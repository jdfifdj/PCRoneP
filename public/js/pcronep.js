/* 一图流：定时刷新倒计时、状态、进度，并自动移除已结束的活动 */
(function () {
  'use strict';

  if (!window.PCRTime) return;

  var T = window.PCRTime;
  var AFTER = { activity: 0, gacha: 1, weapon: 0 };
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-start][data-end]'));

  function visibleItems(kind) {
    return Array.prototype.filter.call(
      document.querySelectorAll('[data-kind="' + kind + '"]'),
      function (el) { return !el.classList.contains('is-hidden'); }
    );
  }

  /* 结束后超过保留窗口的条目直接从页面移除 */
  function shouldHide(el, status, now) {
    if (status !== 'ended') return false;
    var kind = el.getAttribute('data-kind') || 'activity';
    var after = AFTER[kind] == null ? 0 : AFTER[kind];
    var end = T.parse(el.getAttribute('data-end'));
    if (Number.isNaN(end)) return false;
    return (now - end) / T.DAY > after;
  }

  function syncCounts(now) {
    var activities = visibleItems('activity');
    var gacha = visibleItems('gacha');
    var weapons = visibleItems('weapon');

    var total = document.querySelector('[data-count="activities"]');
    if (total) total.textContent = activities.length;
    var gachaCount = document.querySelector('[data-count="gacha"]');
    if (gachaCount) gachaCount.textContent = gacha.length;
    var weaponCount = document.querySelector('[data-count="weapons"]');
    if (weaponCount) weaponCount.textContent = weapons.length;

    document.querySelectorAll('[data-cat-count]').forEach(function (badge) {
      var cat = badge.closest('.cat');
      if (!cat) return;
      var list = cat.querySelector('.cat__list');
      var count = list.querySelectorAll('[data-kind="activity"]:not(.is-hidden)').length;
      badge.textContent = count;
      var empty = list.querySelector('.cat__empty');
      if (count === 0 && !empty) {
        empty = document.createElement('p');
        empty.className = 'cat__empty';
        empty.textContent = 'NO DATA';
        list.appendChild(empty);
      } else if (count > 0 && empty) {
        empty.remove();
      }
    });

    var ongoing = 0;
    var upcoming = 0;
    activities.forEach(function (el) {
      var status = T.statusOf(el.getAttribute('data-start'), el.getAttribute('data-end'), now);
      if (status === 'ongoing') ongoing++;
      else if (status === 'upcoming') upcoming++;
    });
    var ongoingEl = document.querySelector('[data-summary="ongoing"]');
    var upcomingEl = document.querySelector('[data-summary="upcoming"]');
    var gachaEl = document.querySelector('[data-summary="gacha"]');
    var weaponEl = document.querySelector('[data-summary="weapons"]');
    if (ongoingEl) ongoingEl.textContent = ongoing;
    if (upcomingEl) upcomingEl.textContent = upcoming;
    if (gachaEl) gachaEl.textContent = gacha.length;
    if (weaponEl) weaponEl.textContent = weapons.length;

    /* 卡池 / 专武 全部结束后给出空状态 */
    var gachaList = document.querySelector('.gacha-list');
    if (gachaList) {
      var gachaEmpty = gachaList.parentElement.querySelector('.empty');
      if (gacha.length === 0 && !gachaEmpty) {
        gachaEmpty = document.createElement('p');
        gachaEmpty.className = 'empty';
        gachaEmpty.textContent = '当前没有在售卡池';
        gachaList.parentElement.appendChild(gachaEmpty);
      } else if (gacha.length > 0 && gachaEmpty) {
        gachaEmpty.remove();
      }
    }
    var weaponList = document.querySelector('.weapon-list');
    if (weaponList) {
      var weaponEmpty = weaponList.parentElement.querySelector('.empty');
      if (weapons.length === 0 && !weaponEmpty) {
        weaponEmpty = document.createElement('p');
        weaponEmpty.className = 'empty';
        weaponEmpty.textContent = '本月暂无专武情报';
        weaponList.parentElement.appendChild(weaponEmpty);
      } else if (weapons.length > 0 && weaponEmpty) {
        weaponEmpty.remove();
      }
    }
  }

  function refresh() {
    var now = Date.now();

    items.forEach(function (el) {
      var start = el.getAttribute('data-start');
      var end = el.getAttribute('data-end');
      var kind = el.getAttribute('data-kind') || 'activity';
      var status = T.statusOf(start, end, now);
      var hide = shouldHide(el, status, now);

      el.classList.toggle('is-hidden', hide);
      el.hidden = hide;
      el.classList.remove('is-ongoing', 'is-upcoming', 'is-ended');
      el.classList.add('is-' + status);

      var state = el.querySelector('[data-state]');
      if (state) {
        state.textContent = T.stateLabel(kind, status);
        state.title = T.stateCN(kind, status);
        if (state.classList.contains('pill')) {
          state.classList.remove('pill--ongoing', 'pill--upcoming', 'pill--ended');
          state.classList.add('pill--' + status);
        }
      }

      var countdown = el.querySelector('[data-countdown]');
      if (countdown) countdown.textContent = T.countdown(start, end, now);

      var bar = el.querySelector('[data-progress]');
      if (bar) bar.style.width = T.progressOf(start, end, now) + '%';
    });

    syncCounts(now);
  }

  refresh();
  setInterval(refresh, 10000);
})();
