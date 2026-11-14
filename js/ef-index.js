/* =====================================================================
   PCR ARCHIVE — 交互脚本
   ===================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- 载入画面 ---------------- */
  function finishBoot() {
    root.classList.add('is-ready');
    var hero = document.querySelector('.hero');
    if (hero) hero.classList.add('is-loaded');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(finishBoot, 400); });
  } else {
    setTimeout(finishBoot, 400);
  }
  // 兜底：资源异常时也不要卡住内容
  setTimeout(finishBoot, 2600);

  /* ---------------- Vue 应用 ---------------- */
  var source = (typeof configData !== 'undefined' && configData) ? configData : {};
  var groups = source.upGroups || {};
  var articles = source.articles || [];
  var groupNames = Object.keys(groups);

  var app = new Vue({
    el: '#app',
    data: {
      upGroups: groups,
      articles: articles,
      groupNames: groupNames,
      activeGroup: groupNames[0] || '攻略组',
      menuOpen: false,
      year: new Date().getFullYear()
    },
    computed: {
      upList: function () {
        return this.upGroups[this.activeGroup] || [];
      },
      totalUps: function () {
        var n = 0;
        for (var k in this.upGroups) {
          if (Object.prototype.hasOwnProperty.call(this.upGroups, k)) n += this.upGroups[k].length;
        }
        return n;
      },
      featured: function () {
        return this.articles[0] || null;
      }
    },
    methods: {
      setGroup: function (name) {
        this.activeGroup = name;
      },
      toggleMenu: function () {
        this.menuOpen = !this.menuOpen;
      },
      closeMenu: function () {
        this.menuOpen = false;
      },
      toTop: function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      },
      pad: function (n) {
        return n < 10 ? '0' + n : String(n);
      }
    },
    watch: {
      menuOpen: function (open) {
        document.body.classList.toggle('is-locked', open);
      }
    }
  });
  window.pcrArchive = app;

  /* ---------------- 页头滚动态 ---------------- */
  var header = document.querySelector('.header');
  var lastY = -1;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (y === lastY) return;
    lastY = y;
    if (header) header.classList.toggle('is-scrolled', y > 30);

    // 首屏视差
    var hero = document.querySelector('.hero');
    if (hero && !reduceMotion && y < window.innerHeight * 1.2) {
      hero.style.setProperty('--p', (y * 0.16).toFixed(1) + 'px');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- 导航高亮 ---------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__item[data-target]'));
  var watched = navLinks
    .map(function (link) {
      var sec = document.getElementById(link.getAttribute('data-target'));
      return sec ? { link: link, sec: sec } : null;
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && watched.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        watched.forEach(function (item) {
          item.link.classList.toggle('is-active', item.sec === entry.target);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    watched.forEach(function (item) { navObserver.observe(item.sec); });
  }

  /* ---------------- 入场动画 ---------------- */
  var revealItems = document.querySelectorAll('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(revealItems, function (el) { el.classList.add('is-in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    Array.prototype.forEach.call(revealItems, function (el, i) {
      el.style.setProperty('--d', ((i % 4) * 0.06).toFixed(2) + 's');
      revealObserver.observe(el);
    });

    // 兜底：极端环境下观察器未触发时，确保内容不会一直隐藏
    setTimeout(function () {
      Array.prototype.forEach.call(revealItems, function (el) {
        if (!el.classList.contains('is-in')) el.classList.add('is-in');
      });
    }, 3200);
  }

  /* ---------------- 键盘 ---------------- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && window.pcrArchive && window.pcrArchive.menuOpen) {
      window.pcrArchive.closeMenu();
    }
  });

  /* ---------------- 图片加载失败兜底 ---------------- */
  document.addEventListener('error', function (e) {
    var el = e.target;
    if (el && el.tagName === 'IMG') {
      el.style.opacity = '0.15';
      el.style.background = '#222';
    }
  }, true);
})();
