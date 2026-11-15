'use strict';

const path = require('node:path');
const express = require('express');

const buildIndex = require('./src/index');
const buildPcronep = require('./src/pcronep');
const buildGhz = require('./src/pcroneghz');
const store = require('./src/data');
const adminRouter = require('./src/admin');

const app = express();

app.disable('x-powered-by');
// 路由区分大小写：/PCRoneP 是正式地址，/pcronep 只用于 301 跳转。
app.set('case sensitive routing', true);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.locals.assetVersion = require('./package.json').version;

app.use((req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  next();
});

app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '7d' : 0
}));

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache');
  res.locals.site = store.get('site');
  next();
});

// 兼容旧地址
const legacy = {
  '/index.html': '/',
  '/PCRoneP.html': '/PCRoneP',
  '/PCRoneP-1.html': '/PCRoneP',
  '/PCRoneGHZ.html': '/PCRoneGHZ',
  '/pcrone': '/PCRoneP',
  '/pcronep': '/PCRoneP',
  '/pcroneghz': '/PCRoneGHZ'
};
for (const [from, to] of Object.entries(legacy)) {
  app.get(from, (req, res) => res.redirect(301, to));
}

app.get('/', (req, res) => {
  res.render('index', buildIndex(store.get('index'), store.get('site')));
});

app.get('/PCRoneP', (req, res) => {
  res.render('PCRoneP', buildPcronep(store.get('pcronep'), store.get('site')));
});

app.get('/PCRoneGHZ', (req, res) => {
  res.render('PCRoneGHZ', buildGhz(store.get('ghz'), store.get('site')));
});

app.use('/admin', adminRouter);

app.use((req, res) => {
  res.status(404).render('404', { path: req.path });
});

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).send('Internal Server Error');
});

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || '0.0.0.0';

if (require.main === module) {
  app.listen(port, host, () => {
    console.log(`PCR ARCHIVE 已启动：http://localhost:${port}`);
  });
}

module.exports = app;
