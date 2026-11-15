/* 首页交互：移动菜单、UP 主筛选、滚动效果 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var menuButton = document.querySelector('.menu-btn');
  var drawer = document.getElementById('drawer');
  var menuOpen = false;

  function setMenu(open) {
    menuOpen = open;
    if (menuButton) {
      menuButton.classList.toggle('is-open', open);
      menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuButton.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
    }
    if (drawer) drawer.classList.toggle('is-open', open);
    document.body.classList.toggle('is-locked', open);
  }

  if (menuButton) {
    menuButton.addEventListener('click', function () { setMenu(!menuOpen); });
  }
  if (drawer) {
    drawer.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });
  }
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && menuOpen) setMenu(false);
  });

  var filters = Array.prototype.slice.call(document.querySelectorAll('[data-group]'));
  var groups = Array.prototype.slice.call(document.querySelectorAll('[data-up-group]'));
  var upCount = document.querySelector('[data-up-count]');

  function setGroup(name) {
    var activeGroup = null;
    filters.forEach(function (button) {
      var active = button.getAttribute('data-group') === name;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', active ? 'true' : 'false');
      if (active) activeGroup = button;
    });
    groups.forEach(function (group) {
      group.hidden = group.getAttribute('data-up-group') !== name;
    });
    if (activeGroup && upCount) {
      var badge = activeGroup.querySelector('em');
      upCount.textContent = badge ? badge.textContent : '';
    }
  }

  filters.forEach(function (button) {
    button.addEventListener('click', function () {
      setGroup(button.getAttribute('data-group'));
    });
  });

  var toTop = document.querySelector('[data-to-top]');
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  var header = document.querySelector('.header');
  var lastY = -1;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (y === lastY) return;
    lastY = y;
    if (header) header.classList.toggle('is-scrolled', y > 30);
    var hero = document.querySelector('.hero');
    if (hero && !reduceMotion && y < window.innerHeight * 1.2) {
      hero.style.setProperty('--p', (y * 0.16).toFixed(1) + 'px');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__item[data-target]'));
  var watched = navLinks
    .map(function (link) {
      var section = document.getElementById(link.getAttribute('data-target'));
      return section ? { link: link, section: section } : null;
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && watched.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        watched.forEach(function (item) {
          item.link.classList.toggle('is-active', item.section === entry.target);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    watched.forEach(function (item) { navObserver.observe(item.section); });
  }

  var revealItems = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealItems.forEach(function (el, index) {
      el.style.setProperty('--d', ((index % 4) * 0.06).toFixed(2) + 's');
      revealObserver.observe(el);
    });

    setTimeout(function () {
      revealItems.forEach(function (el) {
        if (!el.classList.contains('is-in')) el.classList.add('is-in');
      });
    }, 3200);
  }
})();
