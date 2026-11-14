'use strict';

const T = require('../../public/js/time');

function pad(value) {
  return String(value).padStart(2, '0');
}

function toLocalInput(value) {
  const p = T.parts(value);
  if (!p) return '';
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}

function fromLocalInput(value) {
  const text = String(value || '').trim();
  const m = text.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return null;
  const [, y, mo, d, h, mi] = m;
  const year = Number(y);
  const month = Number(mo);
  const day = Number(d);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  if (Number(h) > 23 || Number(mi) > 59) return null;
  const check = new Date(Date.UTC(year, month - 1, day));
  if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) {
    return null;
  }
  return `${y}-${mo}-${d}T${h}:${mi}:00+08:00`;
}

function formatDateTime(value) {
  const p = T.parts(value);
  if (!p) return String(value || '');
  return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}`;
}

function todayInput(now = Date.now()) {
  const p = T.parts(now);
  return `${p.year}-${p.month}-${p.day}`;
}

function defaultRange(now = Date.now()) {
  const start = new Date(now);
  const end = new Date(now + 7 * T.DAY);
  return { start: toIso(start), end: toIso(end) };
}

function toIso(date) {
  const p = T.parts(date.getTime());
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:00+08:00`;
}

module.exports = {
  pad,
  toLocalInput,
  fromLocalInput,
  formatDateTime,
  todayInput,
  defaultRange
};
