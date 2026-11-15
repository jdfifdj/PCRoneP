'use strict';

const T = require('../public/js/time');
const { createHighlighter } = require('./highlight');

const WINDOWS = {
  activity: [10, 0],
  gacha: [10, 1],
  weapon: [7, 0],
  sixStar: [8, 1],
  role: [5, 1]
};

const CATEGORY_BY_ICON = {
  '/images/icons/主线关卡.png': 1,
  '/images/icons/困难关卡.png': 1,
  '/images/icons/圣迹调查.png': 1,
  '/images/icons/探索.png': 1,
  '/images/icons/大师币.png': 4,
  '/images/icons/庆典.png': 2,
  '/images/icons/露娜塔.png': 2,
  '/images/icons/地下城.png': 2,
  '/images/icons/团队战.png': 2,
  '/images/icons/竞技场.png': 2,
  '/images/icons/扭蛋.png': 3,
  '/images/icons/宝箱.png': 4,
  '/images/icons/妈.png': 4,
  '/images/icons/光属性.png': 3,
  '/images/icons/暗属性.png': 3,
  '/images/icons/风属性.png': 3,
  '/images/icons/火属性.png': 3,
  '/images/icons/水属性.png': 3,
  '/images/icons/体力.png': 4,
  '/images/icons/马娜.png': 4,
  '/images/icons/经验.png': 4,
  '/images/icons/妈盖.png': 4
};

const CATEGORY_COLUMNS = [
  { key: 1, name: '探索', en: 'EXPLORE' },
  { key: 2, name: '活动', en: 'EVENT' },
  { key: 3, name: '抽卡', en: 'GACHA' },
  { key: 4, name: '庆典', en: 'FESTIVAL' }
];

function categoryOf(icon) {
  return CATEGORY_BY_ICON[icon] || 4;
}

function enhance(item, kind, now, highlight) {
  const status = T.statusOf(item.start, item.end, now);
  return {
    ...item,
    kind,
    status,
    stateLabel: T.stateLabel(kind, status),
    stateCN: T.stateCN(kind, status),
    countdown: T.countdown(item.start, item.end, now),
    progress: T.progressOf(item.start, item.end, now),
    range: T.range(item.start, item.end),
    adviceHtml: item.advice ? highlight(item.advice) : ''
  };
}

/** 同一时段的普通关卡 / 困难关卡合并为一张卡 */
function mergeActivities(list) {
  const merged = [];
  const used = new Set();
  const isNormal = (item) => item.name.includes('普通关卡');
  const isHard = (item) => item.name.includes('困难关卡');

  for (let i = 0; i < list.length; i++) {
    if (used.has(i)) continue;
    const current = list[i];
    const currentNormal = isNormal(current);
    const currentHard = isHard(current);
    let mergedItem = null;

    if (currentNormal || currentHard) {
      for (let j = i + 1; j < list.length; j++) {
        if (used.has(j)) continue;
        const other = list[j];
        const pair = (currentNormal && isHard(other)) || (currentHard && isNormal(other));
        if (pair && current.start === other.start && current.end === other.end) {
          mergedItem = {
            ...current,
            name: current.name + ' & ' + other.name,
            icon: '/images/icons/主线关卡.png',
            merged: true
          };
          used.add(j);
          break;
        }
      }
    }

    merged.push(mergedItem || current);
    used.add(i);
  }

  return merged;
}

function sortByUrgency(a, b, now) {
  const rank = (item) => {
    if (now < T.parse(item.start)) return 1;
    if (now > T.parse(item.end)) return 2;
    return 0;
  };
  const ra = rank(a);
  const rb = rank(b);
  if (ra !== rb) return ra - rb;
  if (ra === 0) return T.parse(a.end) - T.parse(b.end);
  if (ra === 1) return T.parse(a.start) - T.parse(b.start);
  return T.parse(b.end) - T.parse(a.end);
}

function visible(list, kind, now, highlight) {
  const [before, after] = WINDOWS[kind];
  return list
    .filter((item) => T.isVisible(item.start, item.end, now, before, after))
    .map((item) => enhance(item, kind, now, highlight));
}

function buildPcronep(data, site, now = Date.now()) {
  const highlight = createHighlighter(data.highlightKeywords);

  const activities = visible(data.activities, 'activity', now, highlight)
    .sort((a, b) => sortByUrgency(a, b, now));
  const merged = mergeActivities(activities).sort((a, b) => sortByUrgency(a, b, now));

  const columns = CATEGORY_COLUMNS.map((column) => ({
    ...column,
    items: merged.filter((item) => categoryOf(item.icon) === column.key)
  }));

  const gacha = visible(data.gachaPools, 'gacha', now, highlight)
    .sort((a, b) => T.parse(a.end) - T.parse(b.end));
  const weapons = visible(data.specialWeapons, 'weapon', now, highlight)
    .sort((a, b) => T.parse(a.end) - T.parse(b.end));
  const sixStar = visible(data.sixStar, 'sixStar', now, highlight)
    .sort((a, b) => T.parse(a.start) - T.parse(b.start));
  const roles = visible(data.huodong, 'role', now, highlight)
    .sort((a, b) => T.parse(a.start) - T.parse(b.start));

  return {
    month: T.monthOf(now),
    clock: T.clock(now),
    clockShort: T.clockShort(now),
    updated: site.updated,
    stats: site.stats,
    activities: merged,
    columns,
    gacha,
    weapons,
    sixStar,
    roles,
    summary: {
      ongoing: merged.filter((item) => item.status === 'ongoing').length,
      upcoming: merged.filter((item) => item.status === 'upcoming').length,
      gacha: gacha.length,
      weapons: weapons.length
    }
  };
}

module.exports = buildPcronep;
