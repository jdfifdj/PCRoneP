'use strict';

const T = require('../../public/js/time');
const { fromLocalInput, pad } = require('./dates');
const { isImagePath } = require('./fields');

const DIRS = {
  '图标': 'icons',
  '卡池': 'pools',
  '专武': 'weapons',
  '六星': 'six-star',
  '活动角色': 'event-roles',
  '工会战': 'clan',
  'up_avatars': 'avatars',
  'logo': 'logo'
};

function stripComments(text) {
  let out = '';
  let quote = null;
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    const next = text[i + 1];
    if (quote) {
      out += ch;
      if (ch === '\\') {
        out += next || '';
        i += 2;
        continue;
      }
      if (ch === quote) quote = null;
      i += 1;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      out += ch;
      i += 1;
      continue;
    }
    if (ch === '/' && next === '/') {
      while (i < text.length && text[i] !== '\n') i += 1;
      continue;
    }
    if (ch === '/' && next === '*') {
      i += 2;
      while (i < text.length && !(text[i] === '*' && text[i + 1] === '/')) i += 1;
      i += 2;
      continue;
    }
    out += ch;
    i += 1;
  }
  return out;
}

function normalizeSingleQuotes(text) {
  let out = '';
  let quote = null;
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (!quote) {
      if (ch === "'") {
        quote = "'";
        out += '"';
        i += 1;
        continue;
      }
      if (ch === '"') {
        quote = '"';
        out += ch;
        i += 1;
        continue;
      }
      out += ch;
      i += 1;
      continue;
    }
    if (quote === '"') {
      out += ch;
      if (ch === '\\') {
        out += text[i + 1] || '';
        i += 2;
        continue;
      }
      if (ch === '"') quote = null;
      i += 1;
      continue;
    }
    if (ch === '\\') {
      const next = text[i + 1];
      if (next === "'") {
        out += "'";
        i += 2;
        continue;
      }
      if (next === '"') {
        out += '\\"';
        i += 2;
        continue;
      }
      out += ch + (next || '');
      i += 2;
      continue;
    }
    if (ch === "'") {
      quote = null;
      out += '"';
      i += 1;
      continue;
    }
    if (ch === '"') {
      out += '\\"';
      i += 1;
      continue;
    }
    out += ch;
    i += 1;
  }
  return out;
}

function normalizeText(raw) {
  let text = stripComments(String(raw || ''));
  text = normalizeSingleQuotes(text);
  text = text.replace(/,\s*([}\]])/g, '$1');
  return text.trim();
}

function extractObjects(text) {
  const blocks = [];
  let depth = 0;
  let start = -1;
  let quote = null;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quote) {
      if (ch === '\\') {
        i += 1;
        continue;
      }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      continue;
    }
    if (ch === '{') {
      if (depth === 0) start = i;
      depth += 1;
    } else if (ch === '}') {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        blocks.push(text.slice(start, i + 1));
        start = -1;
      }
    }
  }
  return blocks;
}

function parseList(text) {
  if (text.startsWith('[')) {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error('输入不是数组');
    return parsed;
  }

  try {
    const parsed = JSON.parse('[' + text + ']');
    if (Array.isArray(parsed)) return parsed;
  } catch {
    /* 回退到逐个对象解析 */
  }

  try {
    const parsed = JSON.parse(text);
    if (parsed && Array.isArray(parsed.activities)) return parsed.activities;
    return [parsed];
  } catch {
    const blocks = extractObjects(text);
    if (!blocks.length) throw new Error('无法解析输入');
    return blocks.map((block, index) => {
      try {
        return JSON.parse(block);
      } catch {
        throw new Error(`第 ${index + 1} 个对象无法解析，请检查引号和括号`);
      }
    });
  }
}

function normalizeDate(value) {
  const text = String(value || '').trim();
  if (!text) return null;

  const local = text.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/);
  if (local) {
    const [, y, mo, d, h, mi] = local;
    return fromLocalInput(`${y}-${pad(mo)}-${pad(d)}T${pad(h)}:${pad(mi)}`);
  }

  if (/^\d{4}-\d{2}-\d{2}T/.test(text)) {
    const ms = T.parse(text);
    if (!Number.isNaN(ms)) {
      const p = T.parts(ms);
      return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}+08:00`;
    }
  }

  return null;
}

function normalizeIcon(value) {
  let icon = String(value || '').trim().replace(/\\/g, '/');
  while (icon.startsWith('../')) icon = icon.slice(3);
  icon = icon.replace(/^\.\//, '');
  if (!icon) return '';

  if (/^https?:\/\//i.test(icon)) return icon;

  const match = icon.match(/^\/?([^/]+)\/(.+)$/);
  if (match && DIRS[match[1]]) return `/images/${DIRS[match[1]]}/${match[2]}`;
  if (icon.startsWith('images/')) return '/' + icon;
  if (icon.startsWith('/images/')) return icon;
  if (/\.(png|jpe?g|webp|gif)$/i.test(icon)) return '/images/icons/' + icon;
  return icon;
}

function parseActivitiesPayload(raw) {
  const text = normalizeText(raw);
  if (!text) return { items: [], errors: ['请输入要添加的活动数据。'] };

  let list;
  try {
    list = parseList(text);
  } catch (error) {
    return {
      items: [],
      errors: ['无法解析输入：' + error.message + '。请粘贴一个或多个 { ... } 对象，或 JSON 数组。']
    };
  }

  if (list.length === 1 && list[0] && Array.isArray(list[0].activities)) {
    list = list[0].activities;
  }
  if (!Array.isArray(list)) list = [list];
  if (list.length > 500) return { items: [], errors: ['一次最多添加 500 条活动。'] };

  const items = [];
  const errors = [];

  list.forEach((entry, index) => {
    const prefix = `第 ${index + 1} 条：`;
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      errors.push(prefix + '不是有效的对象');
      return;
    }

    const name = String(entry.name || '').trim();
    const start = normalizeDate(entry.start);
    const end = normalizeDate(entry.end);
    const icon = normalizeIcon(entry.icon);

    if (!name) errors.push(prefix + '缺少活动名称 name');
    if (!start) errors.push(prefix + '开始时间格式不正确');
    if (!end) errors.push(prefix + '结束时间格式不正确');
    if (start && end && Date.parse(end) <= Date.parse(start)) {
      errors.push(prefix + '结束时间必须晚于开始时间');
    }
    if (!icon) errors.push(prefix + '缺少分类图标 icon');
    else if (!isImagePath(icon)) errors.push(prefix + '图标路径不合法');

    if (!name || !start || !end || !icon || errors.some((message) => message.startsWith(prefix))) return;
    items.push({ name, start, end, icon });
  });

  return { items, errors };
}

module.exports = { parseActivitiesPayload, normalizeIcon, normalizeDate };
