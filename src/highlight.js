'use strict';

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const CLASSES = new Set(['highlight-red', 'highlight-blue', 'highlight-orange']);

function escapeHTML(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (ch) => ESCAPES[ch]);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeText(value) {
  return escapeHTML(value).replace(/\r\n?|\n/g, '<br>');
}

/** 用一份规则表编译高亮器：先匹配原文，再逐段转义，避免破坏 HTML 实体 */
function createHighlighter(rules) {
  const classes = new Map();

  for (const rule of rules || []) {
    const keyword = String(rule.keyword || '');
    if (!keyword) continue;
    const className = CLASSES.has(rule.className) ? rule.className : 'highlight-red';
    classes.set(keyword, className);
  }

  if (!classes.size) return (text) => escapeText(text);

  const keys = [...classes.keys()].sort((a, b) => b.length - a.length);
  const pattern = new RegExp(keys.map(escapeRegExp).join('|'), 'g');

  return function highlight(text) {
    if (!text) return '';
    const source = String(text);
    let output = '';
    let lastIndex = 0;

    for (const match of source.matchAll(pattern)) {
      output += escapeText(source.slice(lastIndex, match.index));
      output += '<span class="' + classes.get(match[0]) + '">' + escapeText(match[0]) + '</span>';
      lastIndex = match.index + match[0].length;
    }

    return output + escapeText(source.slice(lastIndex));
  };
}

module.exports = { createHighlighter, escapeHTML };
