'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const store = require('./data');

const COOKIE = 'pcr_admin';
const MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const LOCK_AFTER = 5;
const LOCK_MS = 60 * 60 * 1000;
const IP_MAX_ATTEMPTS = 20;
const IP_WINDOW = 60 * 60 * 1000;
const ipAttempts = new Map();

function loadSecret() {
  if (process.env.ADMIN_SECRET) return process.env.ADMIN_SECRET;
  const file = path.join(__dirname, '..', 'data', '.session-secret');
  try {
    const existing = fs.readFileSync(file, 'utf8').trim();
    if (existing.length >= 32) return existing;
  } catch {
    /* 首次启动时生成 */
  }
  const secret = crypto.randomBytes(32).toString('hex');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, secret, { mode: 0o600 });
  console.warn('[admin] 已生成 data/.session-secret，用于管理后台会话签名。');
  return secret;
}

const SECRET = loadSecret();

function sign(payload) {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(password), salt, 64).toString('hex');
  return { salt, hash };
}

function verifyPasswordHash(password, salt, hash) {
  try {
    const actual = crypto.scryptSync(String(password), String(salt), 64);
    const expected = Buffer.from(String(hash), 'hex');
    return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

function accounts() {
  return store.get('admins').accounts;
}

function findAccount(username) {
  const needle = String(username || '').trim().toLowerCase();
  if (!needle) return null;
  return accounts().find((account) => account.username.toLowerCase() === needle) || null;
}

function findAccountById(id) {
  return accounts().find((account) => account.id === id) || null;
}

function hasInitialAccount() {
  return accounts().some((account) => account.mustChangePassword);
}

function makeToken(account) {
  const expires = Date.now() + MAX_AGE;
  const version = String(account.passwordUpdatedAt);
  const payload = `${account.id}.${expires}.${version}`;
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token) {
  if (typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 4) return null;
  const [id, expires, version, signature] = parts;
  if (!/^\d+$/.test(expires) || Number(expires) < Date.now()) return null;
  if (!/^\d+$/.test(version)) return null;

  const expected = sign(`${id}.${expires}.${version}`);
  if (signature.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;

  const account = findAccountById(id);
  if (!account) return null;
  if (String(account.passwordUpdatedAt) !== version) return null;
  return account;
}

function parseCookies(header) {
  const cookies = {};
  if (!header) return cookies;
  for (const part of String(header).split(';')) {
    const index = part.indexOf('=');
    if (index < 0) continue;
    const key = part.slice(0, index).trim();
    if (!key) continue;
    try {
      cookies[key] = decodeURIComponent(part.slice(index + 1).trim());
    } catch {
      cookies[key] = part.slice(index + 1).trim();
    }
  }
  return cookies;
}

function isSecure(req) {
  return req.secure || String(req.get('x-forwarded-proto') || '').split(',')[0].trim() === 'https';
}

function cookieOptions(req) {
  return {
    httpOnly: true,
    sameSite: 'strict',
    secure: isSecure(req),
    path: '/admin',
    maxAge: MAX_AGE
  };
}

function issueSession(req, res, account) {
  res.cookie(COOKIE, makeToken(account), cookieOptions(req));
}

function safeNext(value) {
  const next = String(value || '');
  if (!next.startsWith('/admin') || next.startsWith('//')) return '/admin';
  return next;
}

function lockMinutes(account, now) {
  if (!account.lockedUntil || account.lockedUntil <= now) return 0;
  return Math.max(1, Math.ceil((account.lockedUntil - now) / 60000));
}

function ipBlocked(ip) {
  const entry = ipAttempts.get(ip);
  if (!entry) return false;
  if (Date.now() > entry.reset) {
    ipAttempts.delete(ip);
    return false;
  }
  return entry.count >= IP_MAX_ATTEMPTS;
}

function recordIpFailure(ip) {
  const now = Date.now();
  const entry = ipAttempts.get(ip);
  if (!entry || now > entry.reset) {
    ipAttempts.set(ip, { count: 1, reset: now + IP_WINDOW });
    return;
  }
  entry.count += 1;
}

function clearIp(ip) {
  ipAttempts.delete(ip);
}

async function registerFailure(accountId, now) {
  const data = structuredClone(store.get('admins'));
  const account = data.accounts.find((item) => item.id === accountId);
  if (!account) return null;

  if (account.lockedUntil && account.lockedUntil <= now) {
    account.lockedUntil = null;
    account.failedAttempts = 0;
  }

  account.failedAttempts = (account.failedAttempts || 0) + 1;
  if (account.failedAttempts >= LOCK_AFTER) {
    account.lockedUntil = now + LOCK_MS;
  }
  account.updatedAt = new Date(now).toISOString();
  await store.save('admins', data);
  return {
    locked: Boolean(account.lockedUntil && account.lockedUntil > now),
    lockedUntil: account.lockedUntil || null
  };
}

async function clearFailures(accountId, now) {
  const data = structuredClone(store.get('admins'));
  const account = data.accounts.find((item) => item.id === accountId);
  if (!account || (!account.failedAttempts && !account.lockedUntil)) return;
  account.failedAttempts = 0;
  account.lockedUntil = null;
  account.updatedAt = new Date(now).toISOString();
  await store.save('admins', data);
}

function requireAuth(req, res, next) {
  const token = parseCookies(req.headers.cookie)[COOKIE];
  const account = verifyToken(token);
  if (!account) {
    const nextUrl = encodeURIComponent(req.originalUrl || '/admin');
    return res.redirect('/admin/login?next=' + nextUrl);
  }
  req.adminAccount = account;
  res.locals.currentAdmin = {
    id: account.id,
    username: account.username,
    mustChangePassword: Boolean(account.mustChangePassword)
  };
  next();
}

async function handleLogin(req, res) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const body = req.body || {};
  const nextUrl = safeNext(body.next);
  const username = String(body.username || '').trim();
  const password = String(body.password || '');
  const initialHint = hasInitialAccount();

  function fail(status, error, extraHeaders = {}) {
    res.status(status);
    for (const [key, value] of Object.entries(extraHeaders)) res.set(key, String(value));
    return res.render('admin/login', {
      error,
      next: nextUrl,
      username,
      showInitialHint: initialHint
    });
  }

  if (ipBlocked(ip)) {
    return fail(429, '尝试次数过多，请 1 小时后再试。', { 'Retry-After': 3600 });
  }

  if (username.length > 30 || password.length > 200) {
    recordIpFailure(ip);
    return fail(401, '用户名或密码错误。');
  }

  const account = findAccount(username);
  const now = Date.now();

  if (!account) {
    recordIpFailure(ip);
    return fail(401, '用户名或密码错误。');
  }

  const remaining = lockMinutes(account, now);
  if (remaining) {
    return fail(429, `账号已锁定，请在 ${remaining} 分钟后重试。`, {
      'Retry-After': Math.ceil((account.lockedUntil - now) / 1000)
    });
  }

  if (!verifyPasswordHash(password, account.passwordSalt, account.passwordHash)) {
    recordIpFailure(ip);
    let result = null;
    try {
      result = await registerFailure(account.id, now);
    } catch (error) {
      console.error('[admin] 记录登录失败次数出错', error);
    }
    if (result && result.locked) {
      return fail(429, '密码错误次数过多，账号已锁定 1 小时。', { 'Retry-After': 3600 });
    }
    return fail(401, '用户名或密码错误。');
  }

  clearIp(ip);
  try {
    await clearFailures(account.id, now);
  } catch (error) {
    console.error('[admin] 重置登录失败次数出错', error);
  }

  const fresh = findAccountById(account.id) || account;
  issueSession(req, res, fresh);
  res.redirect(nextUrl);
}

function handleLogout(req, res) {
  res.clearCookie(COOKIE, { path: '/admin' });
  res.redirect('/admin/login');
}

if (hasInitialAccount()) {
  console.warn('[admin] 初始管理员账号 admin / pcr-admin 尚未修改密码，请登录后台修改。');
}

module.exports = {
  requireAuth,
  handleLogin,
  handleLogout,
  issueSession,
  hashPassword,
  hasInitialAccount,
  LOCK_AFTER,
  LOCK_MS
};
