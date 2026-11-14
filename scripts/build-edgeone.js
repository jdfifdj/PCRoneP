'use strict';

/**
 * 生成 EdgeOne Pages 静态站点：dist/
 * 只输出三个公开页面与静态资源；管理后台需要 Node 服务，不包含在静态包内。
 */
const fs = require('node:fs');
const path = require('node:path');
const ejs = require('ejs');

const buildIndex = require('../src/index');
const buildPcronep = require('../src/pcronep');
const buildGhz = require('../src/pcroneghz');

const ROOT = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const OUT_DIR = path.join(ROOT, 'dist');
const VIEWS = path.join(ROOT, 'views');
const pkg = require('../package.json');

function read(name) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, 'data', name + '.json'), 'utf8'));
}

function write(file, html) {
  const target = path.join(OUT_DIR, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html, 'utf8');
  console.log(`  ${file}  ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`);
}

async function render(view, locals) {
  return ejs.renderFile(path.join(VIEWS, view), locals, { root: VIEWS });
}

function copyDir(source, target) {
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name);
    const to = path.join(target, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

function removeDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) removeDir(full);
    else fs.unlinkSync(full);
  }
  fs.rmdirSync(dir);
}

async function main() {
  const site = read('site');
  const indexData = read('index');
  const pcronepData = read('pcronep');
  const ghzData = read('pcroneghz');
  const now = Date.now();
  const base = { site, assetVersion: pkg.version, staticSite: true };

  removeDir(OUT_DIR);
  copyDir(PUBLIC_DIR, OUT_DIR);
  // 后台静态资源不进入公开静态包
  for (const file of [path.join('css', 'admin.css'), path.join('js', 'admin.js')]) {
    try {
      fs.unlinkSync(path.join(OUT_DIR, file));
    } catch {
      /* 文件不存在时忽略 */
    }
  }

  console.log('生成静态页面：');

  const indexHtml = await render('index.ejs', {
    ...buildIndex(indexData, site, now),
    ...base
  });
  write('index.html', indexHtml);

  const pcronepHtml = await render('pcronep.ejs', {
    ...buildPcronep(pcronepData, site, now),
    ...base
  });
  write('pcronep.html', pcronepHtml);
  write(path.join('pcronep', 'index.html'), pcronepHtml);

  const ghzHtml = await render('pcroneghz.ejs', {
    ...buildGhz(ghzData, site, now),
    ...base
  });
  write('pcroneghz.html', ghzHtml);
  write(path.join('pcroneghz', 'index.html'), ghzHtml);

  const notFoundHtml = await render('404.ejs', { path: '该页面', ...base });
  write('404.html', notFoundHtml);

  const files = [];
  (function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else files.push(full);
    }
  })(OUT_DIR);

  const bytes = files.reduce((sum, file) => sum + fs.statSync(file).size, 0);
  console.log(`\n完成：${files.length} 个文件，${(bytes / 1024 / 1024).toFixed(1)} MB → ${path.relative(ROOT, OUT_DIR)}`);
  console.log('注意：静态包不包含 /admin，后台修改数据后需要重新构建并部署。');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
