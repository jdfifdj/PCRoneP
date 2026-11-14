/* 全站共用：时钟、图片弹窗、图片加载兜底 */
(function () {
  'use strict';

  var root = document.documentElement;

  function finishBoot() {
    root.classList.add('is-ready');
    var hero = document.querySelector('.hero');
    if (hero) hero.classList.add('is-loaded');
  }
  setTimeout(finishBoot, 400);
  setTimeout(finishBoot, 2600);

  var clocks = Array.prototype.slice.call(document.querySelectorAll('[data-clock]'));
  var shortClocks = Array.prototype.slice.call(document.querySelectorAll('[data-clock-short]'));

  function updateClock() {
    if (!window.PCRTime) return;
    var now = Date.now();
    var full = window.PCRTime.clock(now);
    var short = window.PCRTime.clockShort(now);
    clocks.forEach(function (el) { el.textContent = full; });
    shortClocks.forEach(function (el) { el.textContent = short; });
  }
  updateClock();
  setInterval(updateClock, 1000);

  var modal = document.querySelector('[data-modal]');
  if (modal) {
    var modalImg = modal.querySelector('[data-modal-img]');
    var modalCaption = modal.querySelector('[data-modal-caption]');
    var modalLink = modal.querySelector('[data-modal-link]');
    var closeButton = modal.querySelector('[data-modal-close]');
    var lastFocus = null;

    function openImage(button) {
      var src = button.getAttribute('data-image');
      var caption = button.getAttribute('data-caption') || '';
      if (!src) return;
      lastFocus = document.activeElement;
      modalImg.src = src;
      modalImg.alt = caption;
      modalCaption.textContent = caption;
      modalLink.href = src;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
      closeButton.focus();
    }

    function closeImage() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }

    document.addEventListener('click', function (event) {
      var trigger = event.target.closest('[data-image]');
      if (trigger) {
        event.preventDefault();
        openImage(trigger);
        return;
      }
      if (event.target.closest('[data-modal-close]')) closeImage();
    });

    modal.addEventListener('click', function (event) {
      if (event.target === modal) closeImage();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && modal.classList.contains('is-open')) closeImage();
    });
  }

  document.addEventListener('error', function (event) {
    var el = event.target;
    if (el && el.tagName === 'IMG') el.classList.add('is-broken');
  }, true);
})();
