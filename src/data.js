'use strict';

const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const FILES = {
  site: 'site.json',
  index: 'index.json',
  pcronep: 'pcronep.json',
  ghz: 'pcroneghz.json',
  admins: 'admins.json'
};

function readAll() {
  const state = {};
  for (const [key, file] of Object.entries(FILES)) {
    state[key] = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
  }
  return state;
}

const state = readAll();
let queue = Promise.resolve();

function get(key) {
  if (!(key in state)) throw new Error('Unknown data set: ' + key);
  return state[key];
}

function all() {
  return state;
}

/** 原子写入；多个保存操作按顺序排队，写成功后更新内存数据 */
function save(key, value) {
  if (!(key in FILES)) throw new Error('Unknown data set: ' + key);
  const file = path.join(DATA_DIR, FILES[key]);
  const json = JSON.stringify(value, null, 2) + '\n';

  const task = queue.catch(() => {}).then(async () => {
    const tmp = `${file}.tmp-${process.pid}-${Date.now()}`;
    await fsp.writeFile(tmp, json, 'utf8');
    await fsp.rename(tmp, file);
    state[key] = value;
  });

  queue = task.catch(() => {});
  return task;
}

module.exports = { get, all, save, FILES, DATA_DIR };
