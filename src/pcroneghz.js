'use strict';

const fs = require('node:fs');
const path = require('node:path');
const T = require('../public/js/time');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

function toFile(url) {
  return path.join(PUBLIC_DIR, url.replace(/^\//, '').replace(/\//g, path.sep));
}

function thumbOf(src) {
  const thumb = src.replace('/images/clan/', '/images/clan/thumbs/').replace(/\.png$/i, '.jpg');
  return fs.existsSync(toFile(thumb)) ? thumb : src;
}

function safeUrl(value) {
  try {
    const url = new URL(String(value));
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : '#';
  } catch {
    return '#';
  }
}

function creator(raw) {
  const text = String(raw.name || '').trim();
  const bracket = text.indexOf('[');
  const name = bracket >= 0 ? text.slice(0, bracket).trim() : text;
  const note = bracket >= 0 ? text.slice(bracket + 1).replace(/\]\s*$/, '') : '';
  const auto = note.includes('自动');
  const manual = note.includes('手动');
  const tag = auto && manual ? '自动 / 手动' : auto ? '自动' : manual ? '手动' : 'SET';

  return { name, tag, url: safeUrl(raw.url), cover: raw.cover };
}

function buildGhz(data, site, now = Date.now()) {
  const stages = data.stages.map((stage, index) => ({
    index,
    name: stage.name,
    active: index === 0,
    count: stage.images.length,
    images: stage.images.map((src, i) => ({
      src,
      thumb: thumbOf(src),
      no: T.pad(i + 1)
    }))
  }));

  const creators = data.videoLinks.map(creator);

  return {
    site,
    month: T.monthOf(now),
    clock: T.clock(now),
    stages,
    creators,
    totalImages: stages.reduce((sum, stage) => sum + stage.count, 0),
    totalStages: stages.length
  };
}

module.exports = buildGhz;
