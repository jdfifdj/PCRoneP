/* 工会战：阶段切换 */
(function () {
  'use strict';

  var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-stage]'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('[data-stage-panel]'));

  function activate(index) {
    tabs.forEach(function (tab) {
      var active = Number(tab.getAttribute('data-stage')) === index;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    panels.forEach(function (panel) {
      panel.hidden = Number(panel.getAttribute('data-stage-panel')) !== index;
    });
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () {
      activate(Number(tab.getAttribute('data-stage')));
    });
    tab.addEventListener('keydown', function (event) {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      var next = (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      activate(Number(tabs[next].getAttribute('data-stage')));
      tabs[next].focus();
    });
  });
})();
