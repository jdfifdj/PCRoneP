'use strict';

const T = require('../public/js/time');

function buildIndex(data, site, now = Date.now()) {
  const groups = Object.entries(data.upGroups).map(([name, list], index) => ({
    name,
    index,
    active: index === 0,
    count: list.length,
    items: list.map((up, i) => ({ ...up, no: T.pad(i + 1) }))
  }));

  const totalUps = groups.reduce((sum, group) => sum + group.count, 0);

  return {
    site,
    groups,
    totalUps,
    featured: data.articles[0] || null,
    year: Number(T.parts(now).year),
    stats: site.stats,
    version: site.version,
    updated: site.updated
  };
}

module.exports = buildIndex;
