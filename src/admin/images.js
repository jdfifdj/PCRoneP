'use strict';

const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');

const PUBLIC_DIR = path.join(__dirname, '..', '..', 'public');
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

async function uploadImage(target, filename, dataUrl) {
  const dir = targetDir(target);
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

  return targetUrl(target, file);
}

module.exports = { listImages, uploadImage, TARGETS };
