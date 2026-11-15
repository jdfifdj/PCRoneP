'use strict';

const { defaultRange, todayInput } = require('./dates');

const image = (key, label, target, options = {}) => ({
  key,
  label,
  type: 'image',
  target,
  required: true,
  ...options
});

const text = (key, label, options = {}) => ({ key, label, type: 'text', ...options });
const datetime = (key, label) => ({ key, label, type: 'datetime', required: true });
const textarea = (key, label, options = {}) => ({ key, label, type: 'textarea', ...options });

const SECTIONS = {
  activities: {
    key: 'activities',
    title: '重要活动',
    singular: '活动',
    description: '一图流左侧的活动日程，图标决定它进入探索 / 活动 / 抽卡 / 庆典哪一列。',
    store: 'pcronep',
    collection: 'activities',
    fields: [
      text('name', '活动名称', { required: true, placeholder: '例：「普通关卡」掉落量 2 倍' }),
      image('icon', '分类图标', 'icons', { hint: '图标决定活动归类：探索 / 活动 / 抽卡 / 庆典。' }),
      datetime('start', '开始时间'),
      datetime('end', '结束时间')
    ],
    columns: ['name', 'icon', 'start', 'end'],
    search: ['name'],
    sort: { key: 'start', dir: 'desc' },
    defaults: () => ({ name: '', icon: '/images/icons/探索.png', ...defaultRange() })
  },

  gachaPools: {
    key: 'gachaPools',
    title: '卡池',
    singular: '卡池',
    description: '一图流右侧的卡池列表与抽卡建议。',
    store: 'pcronep',
    collection: 'gachaPools',
    fields: [
      text('name', '卡池名称', { required: true }),
      image('image', '卡池图片', 'pools'),
      datetime('start', '开始时间'),
      datetime('end', '结束时间'),
      textarea('advice', '抽卡建议', { rows: 5, hint: '纯文本；换行会保留。关键词按「高亮词」规则自动着色。' })
    ],
    columns: ['name', 'image', 'start', 'end', 'advice'],
    search: ['name', 'advice'],
    sort: { key: 'start', dir: 'desc' },
    defaults: () => ({ name: '', image: '', advice: '', ...defaultRange() })
  },

  specialWeapons: {
    key: 'specialWeapons',
    title: '专武',
    singular: '专武',
    description: '一图流右侧的每月专武与开专建议。',
    store: 'pcronep',
    collection: 'specialWeapons',
    fields: [
      text('name', '角色 / 专武名称', { required: true }),
      image('image', '专武图片', 'weapons'),
      datetime('start', '开始时间'),
      datetime('end', '结束时间'),
      textarea('advice', '开专建议', { rows: 5 })
    ],
    columns: ['name', 'image', 'start', 'end', 'advice'],
    search: ['name', 'advice'],
    sort: { key: 'start', dir: 'desc' },
    defaults: () => ({ name: '', image: '', advice: '', ...defaultRange() })
  },

  sixStar: {
    key: 'sixStar',
    title: '六星',
    singular: '六星',
    description: '一图流右侧的六星解放日程。',
    store: 'pcronep',
    collection: 'sixStar',
    fields: [
      text('name', '角色名称', { required: true }),
      image('image', '角色图片', 'six-star'),
      datetime('start', '开始时间'),
      datetime('end', '结束时间')
    ],
    columns: ['name', 'image', 'start', 'end'],
    search: ['name'],
    sort: { key: 'start', dir: 'desc' },
    defaults: () => ({ name: '', image: '', ...defaultRange() })
  },

  huodong: {
    key: 'huodong',
    title: '兑换角色',
    singular: '兑换角色',
    description: '一图流右侧的活动兑换角色。',
    store: 'pcronep',
    collection: 'huodong',
    fields: [
      text('name', '角色名称', { required: true }),
      image('image', '角色图片', 'event-roles'),
      datetime('start', '开始时间'),
      datetime('end', '结束时间'),
      textarea('advice', '说明', { rows: 4 })
    ],
    columns: ['name', 'image', 'start', 'end', 'advice'],
    search: ['name', 'advice'],
    sort: { key: 'start', dir: 'desc' },
    defaults: () => ({ name: '', image: '', advice: '', ...defaultRange() })
  },

  highlightKeywords: {
    key: 'highlightKeywords',
    title: '高亮词',
    singular: '高亮词',
    description: '卡池 / 专武建议中自动着色。关键词越长优先级越高。',
    store: 'pcronep',
    collection: 'highlightKeywords',
    fields: [
      text('keyword', '关键词', { required: true, placeholder: '例：必抽' }),
      {
        key: 'className',
        label: '颜色',
        type: 'select',
        required: true,
        options: [
          { value: 'highlight-red', label: '红色（强推荐 / 警告）' },
          { value: 'highlight-blue', label: '蓝色（建议）' },
          { value: 'highlight-orange', label: '橙色（注意）' }
        ]
      }
    ],
    columns: ['keyword', 'className'],
    search: ['keyword'],
    defaults: () => ({ keyword: '', className: 'highlight-red' })
  },

  articles: {
    key: 'articles',
    title: '情报文章',
    singular: '情报',
    description: '首页「情报中心」卡片；列表第一条会作为首页大图。',
    store: 'index',
    collection: 'articles',
    autoId: 'id',
    prepend: true,
    fields: [
      text('title', '标题', { required: true }),
      image('thumb', '封面图', 'avatars'),
      { key: 'date', label: '日期', type: 'date', required: true },
      text('author', '作者 / 来源', { required: true })
    ],
    columns: ['title', 'thumb', 'date', 'author'],
    search: ['title', 'author'],
    sort: { key: 'date', dir: 'desc' },
    defaults: () => ({ title: '', thumb: '', date: todayInput(), author: '' })
  },

  videoLinks: {
    key: 'videoLinks',
    title: '视频攻略',
    singular: '视频',
    description: '工会战页面底部的作者 / 视频入口。',
    store: 'ghz',
    collection: 'videoLinks',
    fields: [
      text('name', '作者名称', { required: true, placeholder: '例：汐汐的奇幻历险[手动-简单set刀]' }),
      { key: 'url', label: '链接', type: 'url', required: true, placeholder: 'https://space.bilibili.com/...' },
      image('cover', '头像 / 封面', 'clan')
    ],
    columns: ['cover', 'name', 'url'],
    search: ['name', 'url'],
    defaults: () => ({ name: '', url: '', cover: '' })
  }
};

const CREATOR_FIELDS = [
  text('name', 'UP 主名称', { required: true }),
  textarea('desc', '简介', { rows: 3 }),
  { key: 'url', label: 'B 站链接', type: 'url', required: true, placeholder: 'https://space.bilibili.com/...' },
  image('avatar', '头像', 'avatars')
];

const NAV = [
  {
    title: '总览',
    items: [{ key: 'dashboard', href: '/admin', label: '仪表盘' }]
  },
  {
    title: '首页',
    items: [
      { key: 'up-groups', href: '/admin/up-groups', label: 'UP 主分组' },
      { key: 'articles', href: '/admin/articles', label: '情报文章' }
    ]
  },
  {
    title: '一图流',
    items: [
      { key: 'activities', href: '/admin/activities', label: '重要活动' },
      { key: 'gachaPools', href: '/admin/gachaPools', label: '卡池' },
      { key: 'specialWeapons', href: '/admin/specialWeapons', label: '专武' },
      { key: 'sixStar', href: '/admin/sixStar', label: '六星' },
      { key: 'huodong', href: '/admin/huodong', label: '兑换角色' },
      { key: 'highlightKeywords', href: '/admin/highlightKeywords', label: '高亮词' }
    ]
  },
  {
    title: '工会战',
    items: [
      { key: 'stages', href: '/admin/stages', label: '阶段作业图' },
      { key: 'videoLinks', href: '/admin/videoLinks', label: '视频攻略' }
    ]
  },
  {
    title: '站点',
    items: [
      { key: 'site', href: '/admin/site', label: '站点设置' },
      { key: 'accounts', href: '/admin/accounts', label: '管理员账号' }
    ]
  }
];

module.exports = { SECTIONS, CREATOR_FIELDS, NAV };
