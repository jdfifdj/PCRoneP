# PCR ARCHIVE

公主连结 Re:Dive 攻略档案的 Node.js 重写版，只保留三个页面：

| 页面 | 路由 | 说明 |
| --- | --- | --- |
| 首页 | `/` | 版本概览、页面导航、推荐 UP 主、情报索引 |
| 一图流 | `/pcronep` | 活动 / 卡池 / 专武 / 六星 / 兑换角色 |
| 工会战 SET 刀 | `/pcroneghz` | D1–D5 与简单分刀作业图、作者攻略 |

旧地址 `/index.html`、`/PCRoneP.html`、`/PCRoneGHZ.html` 会自动 301 到新路由。

## 运行

要求 Node.js 18+。

```bash
npm install
npm start
```

打开 <http://localhost:3000>。开发时可用 `npm run dev`（Node `--watch` 自动重启）。

生产环境可设置：

```bash
PORT=8080 HOST=0.0.0.0 NODE_ENV=production node server.js
```

`NODE_ENV=production` 时静态资源缓存 7 天；页面仍按请求实时渲染（JSON 在启动时加载，后台保存后立即生效）。

## 管理后台

访问 <http://localhost:3000/admin>。

初始账号：`admin`，初始密码：`pcr-admin`。登录后请到「管理员账号」修改密码。

后台可以管理：

- 首页：UP 主分组（分组增删改、UP 主增删改）、情报文章。
- 一图流：重要活动、卡池、专武、六星、兑换角色、高亮词的增删改。
- 重要活动支持批量粘贴：可粘贴一个或多个旧版配置对象，`./图标/xxx.png` 会自动转成 `/images/icons/xxx.png`，重复条目自动跳过。
- 工会战：阶段增删改、每个阶段的作业图（上传 / 批量路径 / 排序 / 删除）、视频攻略。
- 站点设置：版本号、更新日期、等级 / 专武 / 装备数据、GitHub 链接、完整一图流图片。
- 管理员账号：添加账号、重置密码、解除锁定、删除账号。

所有修改会直接写入 `data/*.json`，前台刷新即可看到，无需重启。图片上传保存到 `public/images/<分类>/`，限制 10MB，支持 PNG / JPG / WebP / GIF。

登录使用 HttpOnly + SameSite=Strict 的签名 Cookie，有效期 7 天。同一账号连续输错 5 次密码会被锁定 1 小时，锁定状态保存在 `data/admins.json`；后台可以随时解除锁定。同一 IP 每小时错误尝试过多也会被临时限制。

会话签名密钥默认生成在 `data/.session-secret`；也可以通过环境变量 `ADMIN_SECRET` 指定。

## EdgeOne Pages 部署

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?repository-url=https://github.com/jdfifdj/PCRoneP)

项目根目录已包含 `edgeone.json`，并提供了静态构建脚本：

```bash
npm run build:edgeone
```

构建结果在 `dist/`，包含：

- `/`、`/pcronep`、`/pcroneghz` 三个公开页面
- `css/`、`js/`、`images/`、`fonts/` 静态资源
- `404.html`
- 旧地址重定向与 `/pcronep`、`/pcroneghz` 的 clean URL 重写（见 `edgeone.json`）

部署步骤：

1. 将仓库推送到 GitHub / GitLab。
2. 在 EdgeOne Pages 控制台导入仓库。
3. 构建命令、输出目录、Node 版本会读取 `edgeone.json`（`npm run build:edgeone` → `./dist`）。
4. 部署完成后访问首页、一图流和工会战页面。

**重要：EdgeOne Pages 这里使用的是静态部署**，`dist/` 不包含 `/admin`。管理后台依赖 Express 和可写文件系统，需要部署到支持 Node.js 与持久磁盘的主机（VPS、容器等）后使用。静态页面是构建时的数据快照，后台修改数据后需要重新执行构建并部署；页面上的倒计时和状态会由前端继续刷新，但跨日期后新增/过期条目的筛选需要重新构建。

如果需要在 EdgeOne 上实现在线管理后台，需要额外接入 EdgeOne Blob/KV 并把数据读写改成云端存储，当前静态方案不包含这部分。

## 完整版部署（含管理后台）

后台需要 Node.js 运行环境和持久磁盘：

```bash
npm install
npm start
```

- 需要持久化保存 `data/` 与 `public/images/`（容器请挂载数据卷，不要使用临时文件系统）。
- 生产环境建议放在 HTTPS 反向代理后，并设置 `ADMIN_SECRET`。
- 这样 `/admin`、账号管理、修改数据、上传图片都可以正常使用。

## 目录

```
server.js              Express 入口与路由
edgeone.json           EdgeOne Pages 构建 / 重写 / 重定向配置
scripts/
  build-edgeone.js     生成 dist/ 静态站点（不含后台）
views/                  EJS 模板（三个页面 + 404 + 共用弹窗）
views/admin/            管理后台模板
src/
  data.js              读写 data/*.json（原子写入）
  auth.js              管理后台登录 / Cookie 校验
  admin/               后台路由、字段校验、图片上传
  pcronep.js           一图流：可见性、排序、合并、状态计算
  pcroneghz.js         工会战：阶段、缩略图、作者信息
  index.js             首页：UP 分组、情报
  highlight.js         攻略文本关键词高亮（转义 + 单次匹配）
data/
  pcronep.json         活动 / 卡池 / 专武 / 六星 / 兑换 / 高亮规则
  pcroneghz.json       阶段作业图与视频攻略
  index.json           UP 主分组与情报
  site.json            站点版本、等级 / 专武 / 装备数据、完整一图流、GitHub
  admins.json          管理员账号、密码哈希与锁定状态
public/
  css/                 base.css + 三个页面样式 + admin.css
  js/                  time.js（前后端共用时间逻辑）+ 页面脚本 + admin.js
  images/  fonts/      图片与字体资源
```

## 数据维护

- 日期统一使用 ISO 8601 并带国服时区，例如 `2026-11-13T11:00:00+08:00`。
- 图片放在 `public/images/` 下，JSON 中写绝对路径，例如 `/images/pools/吹雪.png`。
- 攻略建议（`advice`）是纯文本，换行直接写 `\n`，页面会转成 `<br>`；关键词高亮由 `highlightKeywords` 自动完成，不要手写 HTML。
- `data/site.json` 的 `stats` 驱动首页 / 一图流的等级、专武、装备数字；`updated` 是表格更新日期。
- 一图流的可见窗口在 `src/pcronep.js` 的 `WINDOWS` 中调整（活动提前 10 天出现、卡池结束后保留 1 天等）。
- 工会战原图 `public/images/clan/xxx.png` 对应缩略图 `public/images/clan/thumbs/xxx.jpg`，缺失时自动回退原图。
- 推荐通过后台修改数据；直接编辑 JSON 后需要重启服务，`npm run dev` 会在源码变更时自动重启。
