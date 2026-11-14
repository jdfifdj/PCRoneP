/* 一图流：定时刷新倒计时、状态与进度 */
(function () {
  'use strict';

  if (!window.PCRTime) return;

  var T = window.PCRTime;
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-start][data-end]'));
  var ongoingEl = document.querySelector('[data-summary="ongoing"]');
  var upcomingEl = document.querySelector('[data-summary="upcoming"]');

  function refresh() {
    var now = Date.now();

    items.forEach(function (el) {
      var start = el.getAttribute('data-start');
      var end = el.getAttribute('data-end');
      var kind = el.getAttribute('data-kind');
      var status = T.statusOf(start, end, now);

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

    if (ongoingEl || upcomingEl) {
      var ongoing = 0;
      var upcoming = 0;
      document.querySelectorAll('[data-kind="activity"]').forEach(function (el) {
        var status = T.statusOf(el.getAttribute('data-start'), el.getAttribute('data-end'), now);
        if (status === 'ongoing') ongoing++;
        else if (status === 'upcoming') upcoming++;
      });
      if (ongoingEl) ongoingEl.textContent = ongoing;
      if (upcomingEl) upcomingEl.textContent = upcoming;
    }
  }

  refresh();
  setInterval(refresh, 30000);
})();
