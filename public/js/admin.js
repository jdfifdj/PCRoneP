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
            subdir: input.getAttribute('data-upload-folder') || '',
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

  /* 阶段作业图：多选批量上传，全部完成后自动提交到该阶段 */
  document.querySelectorAll('[data-batch-upload]').forEach(function (input) {
    input.addEventListener('change', async function () {
      var files = Array.prototype.slice.call(input.files || []);
      if (!files.length) return;

      var batch = input.closest('.admin-batch');
      var status = batch && batch.querySelector('[data-batch-status]');
      var list = batch && batch.querySelector('[data-batch-list]');
      var form = batch && batch.querySelector('[data-batch-form]');
      var hidden = batch && batch.querySelector('[data-batch-input]');
      var target = input.getAttribute('data-batch-target') || 'clan';
      var ok = [];
      var failed = [];

      if (!status || !form || !hidden) return;

      function setStatus(message, kind) {
        status.textContent = message;
        status.className = 'admin-upload__status' + (kind ? ' is-' + kind : '');
      }

      function addItem(file, message, isFail) {
        if (!list) return;
        var item = document.createElement('span');
        item.className = 'admin-batch__item' + (isFail ? ' is-fail' : '');
        item.textContent = file.name + ' · ' + message;
        item.title = file.name + ' · ' + message;
        list.appendChild(item);
      }

      if (list) list.innerHTML = '';
      input.disabled = true;

      for (var i = 0; i < files.length; i += 1) {
        var file = files[i];
        setStatus('上传中 ' + (i + 1) + '/' + files.length + '：' + file.name);

        if (!/^image\/(png|jpeg|webp|gif)$/i.test(file.type)) {
          failed.push(file.name);
          addItem(file, '格式不支持', true);
          continue;
        }
        if (file.size > 10 * 1024 * 1024) {
          failed.push(file.name);
          addItem(file, '超过 10MB', true);
          continue;
        }

        try {
          var data = await readDataURL(file);
          var response = await fetch('/admin/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              target: target,
              subdir: input.getAttribute('data-upload-folder') || '',
              filename: file.name,
              data: data
            })
          });
          var result = await response.json().catch(function () { return {}; });
          if (!response.ok) throw new Error(result.error || '上传失败');
          ok.push(result.path);
          addItem(file, '已上传');
        } catch (error) {
          failed.push(file.name);
          addItem(file, error.message || '上传失败', true);
        }
      }

      input.disabled = false;
      input.value = '';

      if (!ok.length) {
        setStatus('上传失败：' + (failed.length ? failed.length + ' 张图片均未成功' : '没有可用图片'), 'error');
        return;
      }

      setStatus('已上传 ' + ok.length + ' 张' + (failed.length ? '，失败 ' + failed.length + ' 张' : ''), 'ok');
      hidden.value = ok.join('\n');
      if (failed.length) {
        if (!window.confirm('有 ' + failed.length + ' 张上传失败，是否先添加已成功的 ' + ok.length + ' 张？')) return;
      }
      form.submit();
    });
  });

  document.addEventListener('error', function (event) {
    var el = event.target;
    if (el && el.tagName === 'IMG') el.classList.add('is-broken');
  }, true);
})();
