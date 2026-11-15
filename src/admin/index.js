'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const express = require('express');

const store = require('../data');
const {
  requireAuth,
  handleLogin,
  handleLogout,
  issueSession,
  hashPassword,
  hasInitialAccount,
  LOCK_AFTER
} = require('../auth');
const { SECTIONS, CREATOR_FIELDS, NAV } = require('./schema');
const { readFields, formValues, displayValue, truncate, isImagePath } = require('./fields');
const { listImages, uploadImage } = require('./images');
const { defaultRange, formatDateTime } = require('./dates');
const { parseActivitiesPayload } = require('./bulk');

const router = express.Router();
const PAGE_SIZE = 40;
const PUBLIC_DIR = path.join(__dirname, '..', '..', 'public');

router.use(express.urlencoded({ extended: false, limit: '2mb' }));

router.use((req, res, next) => {
  if (req.method === 'POST') {
    const origin = req.get('origin');
    if (origin) {
      try {
        if (new URL(origin).host !== req.get('host')) {
          return res.status(403).send('非法请求来源');
        }
      } catch {
        return res.status(403).send('非法请求来源');
      }
    }
  }
  next();
});

function render(res, view, locals = {}) {
  res.render('admin/' + view, {
    nav: NAV,
    active: '',
    flash: '',
    ...locals
  });
}

function flashFrom(req) {
  return String(req.query.flash || '').slice(0, 200);
}

function redirectWithFlash(res, url, message) {
  const separator = url.includes('?') ? '&' : '?';
  res.redirect(303, url + separator + 'flash=' + encodeURIComponent(message));
}

function clone(key) {
  return structuredClone(store.get(key));
}

function sectionOf(req) {
  return SECTIONS[req.params.section] || null;
}

function collectionOf(section) {
  return store.get(section.store)[section.collection];
}

function imageOptionsFor(fields) {
  const targets = [...new Set(fields.filter((field) => field.type === 'image').map((field) => field.target))];
  const options = {};
  for (const target of targets) {
    options[target] = listImages(target, { recursive: target === 'clan' });
  }
  return options;
}

function thumbFor(url) {
  if (!url || !url.startsWith('/images/clan/')) return url;
  const thumb = url.replace('/images/clan/', '/images/clan/thumbs/').replace(/\.png$/i, '.jpg');
  const file = path.join(PUBLIC_DIR, thumb.replace(/^\//, '').replace(/\//g, path.sep));
  return fs.existsSync(file) ? thumb : url;
}

function sortEntries(entries, sort) {
  if (!sort) return entries;
  const { key, dir } = sort;
  return entries.sort((a, b) => {
    const av = a.item[key];
    const bv = b.item[key];
    const an = Date.parse(av);
    const bn = Date.parse(bv);
    let result;
    if (!Number.isNaN(an) && !Number.isNaN(bn)) result = an - bn;
    else result = String(av ?? '').localeCompare(String(bv ?? ''), 'zh-CN');
    return dir === 'desc' ? -result : result;
  });
}

function pageHref(sectionKey, q, page) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (page > 1) params.set('page', String(page));
  const query = params.toString();
  return `/admin/${sectionKey}${query ? '?' + query : ''}`;
}

function parseIndex(value) {
  if (!/^\d+$/.test(String(value))) return null;
  const index = Number(value);
  return Number.isSafeInteger(index) ? index : null;
}

function cleanName(value) {
  return String(value || '').trim().slice(0, 60);
}

const RESERVED_GROUP_NAMES = new Set(['__proto__', 'constructor', 'prototype']);

function hasGroup(data, name) {
  return Object.prototype.hasOwnProperty.call(data.upGroups, name);
}

/* ------------------------------ 登录 / 退出 ------------------------------ */

router.get('/login', (req, res) => {
  render(res, 'login', {
    title: '登录',
    error: '',
    next: String(req.query.next || '/admin'),
    username: '',
    showInitialHint: hasInitialAccount()
  });
});

router.post('/login', handleLogin);
router.post('/logout', handleLogout);

router.use(requireAuth);

/* ------------------------------ 仪表盘 ------------------------------ */

router.get('/', (req, res) => {
  const pcronep = store.get('pcronep');
  const index = store.get('index');
  const ghz = store.get('ghz');
  const creatorCount = Object.values(index.upGroups).reduce((sum, list) => sum + list.length, 0);
  const imageCount = ghz.stages.reduce((sum, stage) => sum + stage.images.length, 0);

  render(res, 'dashboard', {
    title: '仪表盘',
    active: 'dashboard',
    showPasswordWarning: Boolean(req.adminAccount.mustChangePassword),
    counts: {
      activities: pcronep.activities.length,
      gachaPools: pcronep.gachaPools.length,
      specialWeapons: pcronep.specialWeapons.length,
      sixStar: pcronep.sixStar.length,
      huodong: pcronep.huodong.length,
      highlightKeywords: pcronep.highlightKeywords.length,
      upGroups: Object.keys(index.upGroups).length,
      creators: creatorCount,
      articles: index.articles.length,
      stages: ghz.stages.length,
      stageImages: imageCount,
      videoLinks: ghz.videoLinks.length,
      accounts: store.get('admins').accounts.length
    }
  });
});

/* ------------------------------ 站点设置 ------------------------------ */

function siteValues(site) {
  return {
    title: site.title || '',
    shortTitle: site.shortTitle || '',
    version: site.version || '',
    updated: site.updated || '',
    github: site.github || '',
    fullGuideImage: site.fullGuideImage || '',
    levelCap: site.stats?.levelCap ?? '',
    weaponCap: site.stats?.weaponCap ?? '',
    rankMax: site.stats?.rankMax ?? '',
    rankMin: site.stats?.rankMin ?? ''
  };
}

router.get('/site', (req, res) => {
  render(res, 'site', {
    title: '站点设置',
    active: 'site',
    values: siteValues(store.get('site')),
    errors: {},
    backgrounds: listImages('backgrounds'),
    flash: flashFrom(req)
  });
});

router.post('/site', (req, res) => {
  const current = store.get('site');
  const values = {
    title: String(req.body.title || '').trim(),
    shortTitle: String(req.body.shortTitle || '').trim(),
    version: String(req.body.version || '').trim(),
    updated: String(req.body.updated || '').trim(),
    github: String(req.body.github || '').trim(),
    fullGuideImage: String(req.body.fullGuideImage || '').trim(),
    levelCap: String(req.body.levelCap || '').trim(),
    weaponCap: String(req.body.weaponCap || '').trim(),
    rankMax: String(req.body.rankMax || '').trim(),
    rankMin: String(req.body.rankMin || '').trim()
  };
  const errors = {};

  if (!values.version) errors.version = '请填写版本号';
  if (!values.updated) errors.updated = '请填写更新日期';
  if (values.github && !/^https?:\/\/[^\s]+$/i.test(values.github)) errors.github = '请输入 http(s) 链接';
  if (!values.fullGuideImage) errors.fullGuideImage = '请填写完整一图流图片';
  else if (!isImagePath(values.fullGuideImage)) errors.fullGuideImage = '图片需以 /images/ 或 http(s):// 开头';

  const stats = {};
  for (const key of ['levelCap', 'weaponCap', 'rankMax', 'rankMin']) {
    if (!values[key] || !/^\d+$/.test(values[key]) || Number(values[key]) < 1) errors[key] = '请输入正整数';
    else stats[key] = Number(values[key]);
  }

  if (Object.keys(errors).length) {
    return res.status(422).render('admin/site', {
      title: '站点设置',
      active: 'site',
      nav: NAV,
      flash: '',
      values,
      errors,
      backgrounds: listImages('backgrounds')
    });
  }

  const site = {
    ...current,
    title: values.title,
    shortTitle: values.shortTitle,
    version: values.version,
    updated: values.updated,
    github: values.github,
    fullGuideImage: values.fullGuideImage,
    stats
  };

  store.save('site', site)
    .then(() => redirectWithFlash(res, '/admin/site', '站点设置已保存'))
    .catch((error) => res.status(500).send('保存失败：' + error.message));
});

/* ------------------------------ 管理员账号 ------------------------------ */

function accountList(currentId) {
  const now = Date.now();
  return store.get('admins').accounts.map((account) => ({
    id: account.id,
    username: account.username,
    createdAt: formatDateTime(account.createdAt),
    passwordUpdatedAt: formatDateTime(account.passwordUpdatedAt),
    locked: Boolean(account.lockedUntil && account.lockedUntil > now),
    lockedUntil: account.lockedUntil ? formatDateTime(account.lockedUntil) : '',
    failedAttempts: Number(account.failedAttempts) || 0,
    mustChangePassword: Boolean(account.mustChangePassword),
    isCurrent: account.id === currentId
  }));
}

function renderAccounts(req, res, options = {}) {
  if (options.status) res.status(options.status);
  render(res, 'accounts', {
    title: '管理员账号',
    active: 'accounts',
    flash: options.flash || '',
    accounts: accountList(req.adminAccount.id),
    lockAfter: LOCK_AFTER,
    errors: options.errors || {},
    values: options.values || { username: '' }
  });
}

router.get('/accounts', (req, res) => {
  renderAccounts(req, res, { flash: flashFrom(req) });
});

router.post('/accounts', async (req, res) => {
  const username = String(req.body.username || '').trim();
  const password = String(req.body.password || '');
  const confirm = String(req.body.confirm || '');
  const errors = {};

  if (!/^[\w\u4e00-\u9fa5.-]{3,30}$/.test(username)) {
    errors.username = '用户名需为 3–30 位，仅限字母、数字、中文、下划线、点和短横线';
  }
  if (password.length < 8) errors.password = '密码至少 8 位';
  if (password.length > 200) errors.password = '密码不能超过 200 位';
  if (password !== confirm) errors.confirm = '两次输入的密码不一致';

  const duplicate = store.get('admins').accounts.some((account) => account.username.toLowerCase() === username.toLowerCase());
  if (duplicate) errors.username = '用户名已存在';

  if (Object.keys(errors).length) {
    return renderAccounts(req, res, { status: 422, errors, values: { username } });
  }

  const now = Date.now();
  const { salt, hash } = hashPassword(password);
  const account = {
    id: crypto.randomUUID(),
    username,
    passwordSalt: salt,
    passwordHash: hash,
    passwordUpdatedAt: now,
    mustChangePassword: false,
    failedAttempts: 0,
    lockedUntil: null,
    createdAt: new Date(now).toISOString(),
    updatedAt: new Date(now).toISOString()
  };

  const data = clone('admins');
  data.accounts.push(account);
  await store.save('admins', data);
  redirectWithFlash(res, '/admin/accounts', `已添加管理员「${username}」`);
});

router.post('/accounts/:id/password', async (req, res) => {
  const accountId = req.params.id;
  const password = String(req.body.password || '');
  const confirm = String(req.body.confirm || '');
  const data = clone('admins');
  const account = data.accounts.find((item) => item.id === accountId);

  if (!account) return redirectWithFlash(res, '/admin/accounts', '账号不存在');
  if (password.length < 8) return redirectWithFlash(res, '/admin/accounts', '密码至少 8 位');
  if (password.length > 200) return redirectWithFlash(res, '/admin/accounts', '密码不能超过 200 位');
  if (password !== confirm) return redirectWithFlash(res, '/admin/accounts', '两次输入的密码不一致');

  const now = Date.now();
  const { salt, hash } = hashPassword(password);
  account.passwordSalt = salt;
  account.passwordHash = hash;
  account.passwordUpdatedAt = now;
  account.mustChangePassword = false;
  account.failedAttempts = 0;
  account.lockedUntil = null;
  account.updatedAt = new Date(now).toISOString();

  await store.save('admins', data);
  if (account.id === req.adminAccount.id) issueSession(req, res, account);
  redirectWithFlash(res, '/admin/accounts', `已重置「${account.username}」的密码`);
});

router.post('/accounts/:id/unlock', async (req, res) => {
  const accountId = req.params.id;
  const data = clone('admins');
  const account = data.accounts.find((item) => item.id === accountId);
  if (!account) return redirectWithFlash(res, '/admin/accounts', '账号不存在');

  account.failedAttempts = 0;
  account.lockedUntil = null;
  account.updatedAt = new Date().toISOString();
  await store.save('admins', data);
  redirectWithFlash(res, '/admin/accounts', `已解除「${account.username}」的登录锁定`);
});

router.post('/accounts/:id/delete', async (req, res) => {
  const accountId = req.params.id;
  const data = clone('admins');
  const account = data.accounts.find((item) => item.id === accountId);
  if (!account) return redirectWithFlash(res, '/admin/accounts', '账号不存在');
  if (account.id === req.adminAccount.id) return redirectWithFlash(res, '/admin/accounts', '不能删除当前登录的账号');
  if (data.accounts.length <= 1) return redirectWithFlash(res, '/admin/accounts', '至少保留一个管理员账号');

  data.accounts = data.accounts.filter((item) => item.id !== accountId);
  await store.save('admins', data);
  redirectWithFlash(res, '/admin/accounts', `已删除管理员「${account.username}」`);
});

/* ------------------------------ 批量添加活动 ------------------------------ */

function activityKey(item) {
  return [item.name, item.start, item.end, item.icon].join('|');
}

router.get('/activities/bulk', (req, res) => {
  render(res, 'bulk-activities', {
    title: '批量添加活动',
    active: 'activities',
    flash: flashFrom(req),
    payload: '',
    errors: []
  });
});

router.post('/activities/bulk', (req, res) => {
  const payload = String(req.body.payload || '');
  const parsed = parseActivitiesPayload(payload);
  const errors = [...parsed.errors];
  const data = clone('pcronep');
  const existing = new Set(data.activities.map(activityKey));
  const seen = new Set();
  let duplicates = 0;

  const items = parsed.items.filter((item) => {
    const key = activityKey(item);
    if (existing.has(key) || seen.has(key)) {
      duplicates += 1;
      return false;
    }
    seen.add(key);
    return true;
  });

  if (!errors.length && !items.length) {
    errors.push(duplicates ? `全部 ${duplicates} 条活动都已存在，没有新增。` : '没有可添加的活动。');
  }

  if (errors.length || !items.length) {
    return res.status(422).render('admin/bulk-activities', {
      title: '批量添加活动',
      active: 'activities',
      nav: NAV,
      flash: '',
      payload,
      errors
    });
  }

  data.activities.push(...items);
  store.save('pcronep', data)
    .then(() => {
      const message = `已批量添加 ${items.length} 条活动` + (duplicates ? `，跳过 ${duplicates} 条重复` : '');
      redirectWithFlash(res, '/admin/activities', message);
    })
    .catch((error) => res.status(500).send('保存失败：' + error.message));
});

/* ------------------------------ 通用集合 ------------------------------ */

router.get('/:section', (req, res, next) => {
  const section = sectionOf(req);
  if (!section) return next();

  const q = String(req.query.q || '').trim().slice(0, 100);
  const entries = collectionOf(section).map((item, index) => ({ item, index }));
  const filtered = q
    ? entries.filter(({ item }) => section.search.some((key) => String(item[key] ?? '').toLowerCase().includes(q.toLowerCase())))
    : entries;

  sortEntries(filtered, section.sort);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(req.query.page) || 1), pageCount);
  const start = (page - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE).map(({ item, index }) => ({
    index,
    item,
    cells: section.columns.map((key) => {
      const field = section.fields.find((f) => f.key === key);
      const value = displayValue(field, item);
      return {
        field,
        value,
        text: field.type === 'image' ? value : truncate(value),
        thumb: field.type === 'image' ? thumbFor(value) : ''
      };
    })
  }));

  render(res, 'list', {
    title: section.title,
    active: section.key,
    flash: flashFrom(req),
    section,
    rows,
    total: filtered.length,
    q,
    page,
    pageCount,
    start,
    end: Math.min(start + PAGE_SIZE, filtered.length),
    pageHref: (target) => pageHref(section.key, q, target)
  });
});

router.get('/:section/new', (req, res, next) => {
  const section = sectionOf(req);
  if (!section) return next();
  const item = section.defaults ? section.defaults() : {};
  render(res, 'form', {
    title: '新增' + section.singular,
    active: section.key,
    section,
    mode: 'create',
    action: `/admin/${section.key}`,
    item,
    values: formValues(section.fields, item),
    errors: {},
    imageOptions: imageOptionsFor(section.fields)
  });
});

router.post('/:section', (req, res, next) => {
  const section = sectionOf(req);
  if (!section) return next();

  const data = clone(section.store);
  const list = data[section.collection];
  const { item, errors } = readFields(section.fields, req.body, {});
  let nextItem = item;

  if (section.autoId) {
    const id = Math.max(0, ...list.map((entry) => Number(entry[section.autoId]) || 0)) + 1;
    nextItem = { [section.autoId]: id, ...item };
  }

  if (Object.keys(errors).length) {
    return res.status(422).render('admin/form', {
      title: '新增' + section.singular,
      active: section.key,
      nav: NAV,
      flash: '',
      section,
      mode: 'create',
      action: `/admin/${section.key}`,
      item,
      values: Object.fromEntries(section.fields.map((field) => [field.key, req.body[field.key] ?? ''])),
      errors,
      imageOptions: imageOptionsFor(section.fields)
    });
  }

  if (section.prepend) list.unshift(nextItem);
  else list.push(nextItem);
  store.save(section.store, data)
    .then(() => redirectWithFlash(res, `/admin/${section.key}`, `已添加${section.singular}`))
    .catch((error) => res.status(500).send('保存失败：' + error.message));
});

router.get('/:section/:index/edit', (req, res, next) => {
  const section = sectionOf(req);
  if (!section) return next();
  const index = parseIndex(req.params.index);
  if (index == null) return next();
  const item = collectionOf(section)[index];
  if (!item) return next();

  render(res, 'form', {
    title: '编辑' + section.singular,
    active: section.key,
    section,
    mode: 'edit',
    action: `/admin/${section.key}/${index}`,
    item,
    values: formValues(section.fields, item),
    errors: {},
    imageOptions: imageOptionsFor(section.fields)
  });
});

router.post('/:section/:index', (req, res, next) => {
  const section = sectionOf(req);
  if (!section) return next();
  const index = parseIndex(req.params.index);
  if (index == null) return next();

  const data = clone(section.store);
  const list = data[section.collection];
  const existing = list[index];
  if (!existing) return next();

  const { item, errors } = readFields(section.fields, req.body, existing);

  if (Object.keys(errors).length) {
    return res.status(422).render('admin/form', {
      title: '编辑' + section.singular,
      active: section.key,
      nav: NAV,
      flash: '',
      section,
      mode: 'edit',
      action: `/admin/${section.key}/${index}`,
      item: existing,
      values: Object.fromEntries(section.fields.map((field) => [field.key, req.body[field.key] ?? ''])),
      errors,
      imageOptions: imageOptionsFor(section.fields)
    });
  }

  list[index] = item;
  store.save(section.store, data)
    .then(() => redirectWithFlash(res, `/admin/${section.key}`, `已保存${section.singular}`))
    .catch((error) => res.status(500).send('保存失败：' + error.message));
});

router.post('/:section/:index/delete', (req, res, next) => {
  const section = sectionOf(req);
  if (!section) return next();
  const index = parseIndex(req.params.index);
  if (index == null) return next();

  const data = clone(section.store);
  const list = data[section.collection];
  if (!list[index]) return next();

  list.splice(index, 1);
  store.save(section.store, data)
    .then(() => redirectWithFlash(res, `/admin/${section.key}`, `已删除${section.singular}`))
    .catch((error) => res.status(500).send('删除失败：' + error.message));
});

/* ------------------------------ UP 主分组 ------------------------------ */

router.get('/up-groups', (req, res) => {
  const data = store.get('index');
  const groups = Object.entries(data.upGroups).map(([name, list], groupIndex) => ({
    name,
    groupIndex,
    creators: list.map((creator, index) => ({ ...creator, index }))
  }));

  render(res, 'up-groups', {
    title: 'UP 主分组',
    active: 'up-groups',
    flash: flashFrom(req),
    groups
  });
});

router.post('/up-groups', (req, res) => {
  const name = cleanName(req.body.name);
  const data = clone('index');
  if (!name) return redirectWithFlash(res, '/admin/up-groups', '分组名称不能为空');
  if (RESERVED_GROUP_NAMES.has(name)) return redirectWithFlash(res, '/admin/up-groups', '这个分组名称不可用');
  if (hasGroup(data, name)) return redirectWithFlash(res, '/admin/up-groups', '同名分组已存在');

  data.upGroups[name] = [];
  store.save('index', data)
    .then(() => redirectWithFlash(res, '/admin/up-groups', '已添加分组'))
    .catch((error) => res.status(500).send('保存失败：' + error.message));
});

router.post('/up-groups/:group/rename', (req, res) => {
  const oldName = req.params.group;
  const newName = cleanName(req.body.name);
  const data = clone('index');
  if (!hasGroup(data, oldName)) return redirectWithFlash(res, '/admin/up-groups', '分组不存在');
  if (!newName) return redirectWithFlash(res, '/admin/up-groups', '分组名称不能为空');
  if (RESERVED_GROUP_NAMES.has(newName)) return redirectWithFlash(res, '/admin/up-groups', '这个分组名称不可用');
  if (newName !== oldName && hasGroup(data, newName)) return redirectWithFlash(res, '/admin/up-groups', '同名分组已存在');

  const entries = Object.entries(data.upGroups);
  const index = entries.findIndex(([name]) => name === oldName);
  entries[index] = [newName, entries[index][1]];
  data.upGroups = Object.fromEntries(entries);

  store.save('index', data)
    .then(() => redirectWithFlash(res, '/admin/up-groups', '分组已改名'))
    .catch((error) => res.status(500).send('保存失败：' + error.message));
});

router.post('/up-groups/:group/delete', (req, res) => {
  const name = req.params.group;
  const data = clone('index');
  if (!hasGroup(data, name)) return redirectWithFlash(res, '/admin/up-groups', '分组不存在');

  delete data.upGroups[name];
  store.save('index', data)
    .then(() => redirectWithFlash(res, '/admin/up-groups', '已删除分组'))
    .catch((error) => res.status(500).send('删除失败：' + error.message));
});

/* ------------------------------ UP 主 ------------------------------ */

function creatorForm(res, group, options) {
  render(res, 'creator-form', {
    title: options.mode === 'create' ? '新增 UP 主' : '编辑 UP 主',
    active: 'up-groups',
    group,
    mode: options.mode,
    action: options.action,
    values: options.values,
    errors: options.errors,
    creatorFields: CREATOR_FIELDS,
    imageOptions: imageOptionsFor(CREATOR_FIELDS)
  });
}

router.get('/creators/new', (req, res) => {
  const group = String(req.query.group || '');
  if (!hasGroup(store.get('index'), group)) return res.redirect('/admin/up-groups');
  creatorForm(res, group, {
    mode: 'create',
    action: '/admin/creators',
    values: { name: '', desc: '', url: '', avatar: '' },
    errors: {}
  });
});

router.post('/creators', (req, res) => {
  const group = String(req.body.group || '');
  const data = clone('index');
  if (!hasGroup(data, group)) return res.redirect('/admin/up-groups');

  const { item, errors } = readFields(CREATOR_FIELDS, req.body, {});
  if (Object.keys(errors).length) {
    return creatorForm(res, group, {
      mode: 'create',
      action: '/admin/creators',
      values: Object.fromEntries(CREATOR_FIELDS.map((field) => [field.key, req.body[field.key] ?? ''])),
      errors
    });
  }

  data.upGroups[group].push(item);
  store.save('index', data)
    .then(() => redirectWithFlash(res, '/admin/up-groups', '已添加 UP 主'))
    .catch((error) => res.status(500).send('保存失败：' + error.message));
});

router.get('/creators/:group/:index/edit', (req, res, next) => {
  const group = req.params.group;
  const index = parseIndex(req.params.index);
  const data = store.get('index');
  if (index == null || !hasGroup(data, group) || !data.upGroups[group][index]) return next();
  const creator = data.upGroups[group][index];

  creatorForm(res, group, {
    mode: 'edit',
    action: `/admin/creators/${encodeURIComponent(group)}/${index}`,
    values: formValues(CREATOR_FIELDS, creator),
    errors: {}
  });
});

router.post('/creators/:group/:index', (req, res, next) => {
  const group = req.params.group;
  const index = parseIndex(req.params.index);
  const data = clone('index');
  if (index == null || !hasGroup(data, group) || !data.upGroups[group][index]) return next();

  const { item, errors } = readFields(CREATOR_FIELDS, req.body, data.upGroups[group][index]);
  if (Object.keys(errors).length) {
    return creatorForm(res, group, {
      mode: 'edit',
      action: `/admin/creators/${encodeURIComponent(group)}/${index}`,
      values: Object.fromEntries(CREATOR_FIELDS.map((field) => [field.key, req.body[field.key] ?? ''])),
      errors
    });
  }

  data.upGroups[group][index] = item;
  store.save('index', data)
    .then(() => redirectWithFlash(res, '/admin/up-groups', '已保存 UP 主'))
    .catch((error) => res.status(500).send('保存失败：' + error.message));
});

router.post('/creators/:group/:index/delete', (req, res, next) => {
  const group = req.params.group;
  const index = parseIndex(req.params.index);
  const data = clone('index');
  if (index == null || !hasGroup(data, group) || !data.upGroups[group][index]) return next();

  data.upGroups[group].splice(index, 1);
  store.save('index', data)
    .then(() => redirectWithFlash(res, '/admin/up-groups', '已删除 UP 主'))
    .catch((error) => res.status(500).send('删除失败：' + error.message));
});

/* ------------------------------ 工会战阶段 ------------------------------ */

router.get('/stages', (req, res) => {
  const data = store.get('ghz');
  const stages = data.stages.map((stage, index) => ({
    ...stage,
    index,
    images: stage.images.map((src, imageIndex) => ({
      src,
      thumb: thumbFor(src),
      imageIndex
    }))
  }));

  render(res, 'stages', {
    title: '阶段作业图',
    active: 'stages',
    flash: flashFrom(req),
    stages,
    clanImages: listImages('clan', { recursive: true })
  });
});

router.post('/stages', (req, res) => {
  const name = cleanName(req.body.name);
  if (!name) return redirectWithFlash(res, '/admin/stages', '阶段名称不能为空');

  const data = clone('ghz');
  if (data.stages.some((stage) => stage.name === name)) {
    return redirectWithFlash(res, '/admin/stages', '同名阶段已存在');
  }
  data.stages.push({ name, images: [] });
  store.save('ghz', data)
    .then(() => redirectWithFlash(res, '/admin/stages', '已添加阶段'))
    .catch((error) => res.status(500).send('保存失败：' + error.message));
});

router.post('/stages/:index/rename', (req, res) => {
  const index = parseIndex(req.params.index);
  const name = cleanName(req.body.name);
  const data = clone('ghz');
  if (index == null || !data.stages[index]) return res.redirect('/admin/stages');
  if (!name) return redirectWithFlash(res, '/admin/stages', '阶段名称不能为空');
  if (data.stages.some((stage, position) => position !== index && stage.name === name)) {
    return redirectWithFlash(res, '/admin/stages', '同名阶段已存在');
  }

  data.stages[index].name = name;
  store.save('ghz', data)
    .then(() => redirectWithFlash(res, '/admin/stages', '阶段已改名'))
    .catch((error) => res.status(500).send('保存失败：' + error.message));
});

router.post('/stages/:index/delete', (req, res) => {
  const index = parseIndex(req.params.index);
  const data = clone('ghz');
  if (index == null || !data.stages[index]) return res.redirect('/admin/stages');

  data.stages.splice(index, 1);
  store.save('ghz', data)
    .then(() => redirectWithFlash(res, '/admin/stages', '已删除阶段'))
    .catch((error) => res.status(500).send('删除失败：' + error.message));
});

router.post('/stages/:index/images', (req, res) => {
  const index = parseIndex(req.params.index);
  const data = clone('ghz');
  if (index == null || !data.stages[index]) return res.redirect('/admin/stages');

  const single = String(req.body.image || '').trim();
  const lines = String(req.body.images || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const candidates = [...lines, ...(single ? [single] : [])];
  const invalid = candidates.filter((candidate) => !isImagePath(candidate));
  if (invalid.length) {
    return redirectWithFlash(res, '/admin/stages', '图片路径需以 /images/ 或 http(s):// 开头');
  }

  const stage = data.stages[index];
  let added = 0;
  for (const candidate of candidates) {
    if (stage.images.includes(candidate)) continue;
    stage.images.push(candidate);
    added += 1;
  }

  store.save('ghz', data)
    .then(() => redirectWithFlash(res, '/admin/stages', added ? `已添加 ${added} 张作业图` : '没有新增图片'))
    .catch((error) => res.status(500).send('保存失败：' + error.message));
});

router.post('/stages/:index/images/:imageIndex/delete', (req, res) => {
  const index = parseIndex(req.params.index);
  const imageIndex = parseIndex(req.params.imageIndex);
  const data = clone('ghz');
  if (index == null || imageIndex == null || !data.stages[index] || !data.stages[index].images[imageIndex]) {
    return res.redirect('/admin/stages');
  }

  data.stages[index].images.splice(imageIndex, 1);
  store.save('ghz', data)
    .then(() => redirectWithFlash(res, '/admin/stages', '已删除作业图'))
    .catch((error) => res.status(500).send('删除失败：' + error.message));
});

router.post('/stages/:index/images/:imageIndex/move', (req, res) => {
  const index = parseIndex(req.params.index);
  const imageIndex = parseIndex(req.params.imageIndex);
  const direction = req.body.direction;
  const data = clone('ghz');
  if (index == null || imageIndex == null || !data.stages[index]) return res.redirect('/admin/stages');

  const images = data.stages[index].images;
  const target = direction === 'up' ? imageIndex - 1 : imageIndex + 1;
  if (!images[imageIndex] || target < 0 || target >= images.length) {
    return res.redirect('/admin/stages');
  }

  [images[imageIndex], images[target]] = [images[target], images[imageIndex]];
  store.save('ghz', data)
    .then(() => redirectWithFlash(res, '/admin/stages', '已调整顺序'))
    .catch((error) => res.status(500).send('保存失败：' + error.message));
});

/* ------------------------------ 图片上传 ------------------------------ */

router.post('/upload', express.json({ limit: '16mb' }), (req, res) => {
  const { target, filename, data } = req.body || {};
  uploadImage(target, filename, data)
    .then((url) => res.json({ path: url }))
    .catch((error) => res.status(400).json({ error: error.message }));
});

/* ------------------------------ 404 ------------------------------ */

router.use((req, res) => {
  res.status(404);
  render(res, 'not-found', { title: '管理页面不存在', active: '' });
});

module.exports = router;
