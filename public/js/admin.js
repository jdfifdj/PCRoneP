/* PCR ARCHIVE — 管理后台交互 */
(function () {
  'use strict';

  var side = document.getElementById('admin-side');
  var toggle = document.querySelector('[data-menu-toggle]');
  var overlay = document.querySelector('[data-menu-close]');
  var menuOpen = false;

  function setMenu(open) {
    menuOpen = open;
    if (side) side.classList.toggle('is-open', open);
    if (overlay) overlay.classList.toggle('is-open', open);
    if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  if (toggle) toggle.addEventListener('click', function () { setMenu(!menuOpen); });
  if (overlay) overlay.addEventListener('click', function () { setMenu(false); });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && menuOpen) setMenu(false);
  });

  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (!form.matches || !form.matches('form[data-confirm]')) return;
    if (!window.confirm(form.getAttribute('data-confirm'))) event.preventDefault();
  });

  function readDataURL(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () { resolve(reader.result); };
      reader.onerror = function () { reject(new Error('读取文件失败')); };
      reader.readAsDataURL(file);
    });
  }

  document.querySelectorAll('input[type="file"][data-upload-target]').forEach(function (input) {
    input.addEventListener('change', async function () {
      var file = input.files && input.files[0];
      if (!file) return;

      var wrapper = input.closest('.admin-imagefield');
      var target = wrapper && wrapper.querySelector('[data-image-input]');
      var preview = wrapper && wrapper.querySelector('[data-image-preview]');
      var status = wrapper && wrapper.querySelector('[data-upload-status]');

      function showStatus(message, kind) {
        if (!status) return;
        status.textContent = message;
        status.className = 'admin-upload__status' + (kind ? ' is-' + kind : '');
      }

      if (!target) {
        showStatus('未找到图片路径输入框', 'error');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        showStatus('图片不能超过 10MB', 'error');
        input.value = '';
        return;
      }

      showStatus('上传中…');
      try {
        var data = await readDataURL(file);
        var response = await fetch('/admin/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            target: input.getAttribute('data-upload-target'),
            filename: file.name,
            data: data
          })
        });
        var result = await response.json().catch(function () { return {}; });
        if (!response.ok) throw new Error(result.error || '上传失败');

        target.value = result.path;
        if (preview) {
          preview.src = result.path;
          preview.hidden = false;
        }
        showStatus('已上传', 'ok');
      } catch (error) {
        showStatus(error.message || '上传失败', 'error');
      } finally {
        input.value = '';
      }
    });
  });

  document.querySelectorAll('[data-image-input]').forEach(function (input) {
    input.addEventListener('change', function () {
      var wrapper = input.closest('.admin-imagefield');
      var preview = wrapper && wrapper.querySelector('[data-image-preview]');
      if (!preview) return;
      if (input.value.trim()) {
        preview.src = input.value.trim();
        preview.hidden = false;
      } else {
        preview.hidden = true;
      }
    });
  });

  document.addEventListener('error', function (event) {
    var el = event.target;
    if (el && el.tagName === 'IMG') el.classList.add('is-broken');
  }, true);
})();
