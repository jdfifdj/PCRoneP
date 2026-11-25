'use strict';

const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

const PUBLIC_DIR = path.join(__dirname, '..', '..', 'public');
const THUMB_MAX_WIDTH = 1800;
const THUMB_QUALITY = 80;
const TARGETS = {
  icons: 'icons',
  pools: 'pools',
  weapons: 'weapons',
  'six-star': 'six-star',
  'event-roles': 'event-roles',
  clan: 'clan',
  avatars: 'avatars',
  backgrounds: ''
};
const EXT_BY_MIME = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/gif': '.gif'
};
const MAX_BYTES = 10 * 1024 * 1024;

function targetDir(target) {
  if (!Object.prototype.hasOwnProperty.call(TARGETS, target)) throw new Error('Unknown image target');
  return path.join(PUBLIC_DIR, 'images', TARGETS[target]);
}

function targetUrl(target, relative) {
  const sub = TARGETS[target];
  return '/images/' + (sub ? sub + '/' : '') + relative;
}

function listImages(target, options = {}) {
  const dir = targetDir(target);
  if (!fs.existsSync(dir)) return [];
  const out = [];

  function walk(current, prefix) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'thumbs') continue;
        if (options.recursive) walk(full, prefix + entry.name + '/');
      } else if (/\.(png|jpe?g|webp|gif)$/i.test(entry.name)) {
        out.push(targetUrl(target, prefix + entry.name));
      }
    }
  }

  walk(dir, '');
  return out.sort((a, b) => a.localeCompare(b, 'zh-CN'));
}

function sanitizeName(name) {
  const base = String(name || '')
    .replace(/\.[^.]+$/, '')
    .replace(/[^\w\u4e00-\u9fa5.-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return base || 'image';
}

function uniqueFile(dir, name, ext) {
  let candidate = name + ext;
  let index = 2;
  while (fs.existsSync(path.join(dir, candidate))) {
    candidate = `${name}-${index}${ext}`;
    index += 1;
  }
  return candidate;
}

function matchesImageSignature(buffer, mime) {
  if (mime === 'image/png') return buffer.length > 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (mime === 'image/jpeg') return buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (mime === 'image/gif') return buffer.subarray(0, 6).toString('ascii') === 'GIF87a' || buffer.subarray(0, 6).toString('ascii') === 'GIF89a';
  if (mime === 'image/webp') return buffer.length > 12 && buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP';
  return false;
}

function normalizeSubdir(subdir) {
  const raw = String(subdir || '')
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '');
  if (!raw) return '';
  const parts = raw.split('/');
  if (parts.some((part) => !part || part === '.' || part === '..')) {
    throw new Error('图片子目录不合法');
  }
  if (!parts.every((part) => /^[\w\u4e00-\u9fa5.-]+$/.test(part))) {
    throw new Error('图片子目录只能包含字母、数字、中文、点、横线和下划线');
  }
  return parts.join('/');
}

async function uploadImage(target, filename, dataUrl, subdir = '') {
  const root = targetDir(target);
  const folder = normalizeSubdir(subdir);
  const dir = folder ? path.join(root, ...folder.split('/')) : root;
  const resolved = path.resolve(dir);
  if (!resolved.startsWith(path.resolve(root) + path.sep) && resolved !== path.resolve(root)) {
    throw new Error('图片子目录不合法');
  }

  const match = String(dataUrl || '').match(/^data:(image\/(?:png|jpeg|webp|gif));base64,([A-Za-z0-9+/=\s]+)$/);
  if (!match) throw new Error('只支持 PNG / JPG / WebP / GIF 图片');

  const ext = EXT_BY_MIME[match[1]];
  const buffer = Buffer.from(match[2].replace(/\s+/g, ''), 'base64');
  if (!buffer.length) throw new Error('图片内容为空');
  if (buffer.length > MAX_BYTES) throw new Error('图片不能超过 10MB');
  if (!matchesImageSignature(buffer, match[1])) throw new Error('图片内容与格式不匹配');

  await fsp.mkdir(dir, { recursive: true });
  const base = sanitizeName(filename);
  const file = uniqueFile(dir, base, ext);
  await fsp.writeFile(path.join(dir, file), buffer);

  return targetUrl(target, folder ? folder + '/' + file : file);
}

/** 工会战图片对应的缩略图 URL（/images/clan/... -> /images/clan/thumbs/...jpg） */
function clanThumbUrl(url) {
  const value = String(url || '');
  if (!value.startsWith('/images/clan/')) return null;
  return value.replace('/images/clan/', '/images/clan/thumbs/').replace(/\.(png|jpe?g|webp|gif)$/i, '.jpg');
}

/**
 * 为工会战原图生成缩略图。
 * 返回 { thumb, status: 'created' | 'skipped' | 'missing' | 'failed' }
 */
async function generateClanThumb(url) {
  const thumb = clanThumbUrl(url);
  if (!thumb) return { thumb: null, status: 'failed' };
  if (thumb === url) return { thumb, status: 'skipped' };

  const source = path.join(PUBLIC_DIR, url.replace(/^\//, '').replace(/\//g, path.sep));
  const target = path.join(PUBLIC_DIR, thumb.replace(/^\//, '').replace(/\//g, path.sep));
  if (!fs.existsSync(source)) return { thumb, status: 'missing' };

  if (fs.existsSync(target) && fs.statSync(target).mtimeMs >= fs.statSync(source).mtimeMs) {
    return { thumb, status: 'skipped' };
  }

  try {
    await fsp.mkdir(path.dirname(target), { recursive: true });
    await sharp(source)
      .rotate()
      .resize({ width: THUMB_MAX_WIDTH, withoutEnlargement: true })
      .flatten({ background: '#ffffff' })
      .jpeg({ quality: THUMB_QUALITY, progressive: true, mozjpeg: true })
      .toFile(target);
    return { thumb, status: 'created' };
  } catch (error) {
    return { thumb, status: 'failed', error: error.message };
  }
}

/** 删除工会战原图及对应缩略图（仅限 public/images/clan 内） */
async function deleteClanImage(url) {
  const candidates = [url, clanThumbUrl(url)].filter(Boolean);
  const clanRoot = path.resolve(PUBLIC_DIR, 'images', 'clan');

  for (const candidate of candidates) {
    const file = path.resolve(PUBLIC_DIR, String(candidate).replace(/^\//, ''));
    if (!file.startsWith(clanRoot + path.sep)) continue;
    if (!fs.existsSync(file)) continue;
    try {
      await fsp.unlink(file);
    } catch (error) {
      console.warn('[admin] 删除图片失败', file, error.message);
    }
  }
}

module.exports = {
  listImages,
  uploadImage,
  clanThumbUrl,
  generateClanThumb,
  deleteClanImage,
  TARGETS
};
