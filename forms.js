// Noula, shared form submitter.
// Any <form data-airtable-fn="submit-xxx"> is wired automatically:
//   - prevents default, checks the honeypot (name="bot-field")
//   - collects fields (repeated "name[]" checkboxes become arrays)
//   - POSTs JSON to /.netlify/functions/<fn>
//   - swaps the form for an inline success panel (no redirect / thanks page)
//   - shows a friendly bilingual error otherwise, incl. a preview-only notice
//
// Optional per-form attributes:
//   data-success-en / data-success-fr , custom success headline
//
// Image uploads: <input type="file" class="upload-input" data-upload="logo|photos"
// data-kind="logo|photo" data-max="N"> inside a .upload-block. Files are checked,
// resized in the browser (photos: max 1600 px long side, JPEG 0.85; SVG logos untouched)
// and sent as data.uploads = { logo: [{filename, contentType, base64}], photos: [...] }.
(function () {
  var lang = function () {
    var l = localStorage.getItem('selectedLanguage');
    return l === 'fr' ? 'fr' : 'en';
  };
  var t = function (en, fr) { return lang() === 'fr' ? fr : en; };

  function collect(form) {
    var data = {};
    var fd = new FormData(form);
    fd.forEach(function (v, k) {
      var arr = k.slice(-2) === '[]';
      var key = arr ? k.slice(0, -2) : k;
      if (arr || data[key] !== undefined) {
        if (!Array.isArray(data[key])) data[key] = data[key] !== undefined ? [data[key]] : [];
        data[key].push(v);
      } else {
        data[key] = v;
      }
    });
    return data;
  }

  function successPanel(form) {
    var en = form.getAttribute('data-success-en') || 'Thank you, we’ve got your submission.';
    var fr = form.getAttribute('data-success-fr') || 'Merci, nous avons bien reçu votre envoi.';
    var subEn = 'We’ll review it and be in touch. In the meantime, feel free to email us at fchpf@outlook.com.';
    var subFr = 'Nous l’examinerons et reviendrons vers vous. En attendant, écrivez-nous à fchpf@outlook.com.';
    var wrap = document.createElement('div');
    wrap.className = 'form-success';
    wrap.setAttribute('role', 'status');
    wrap.innerHTML =
      '<div class="form-success-mark"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>' +
      '<h3><span class="lang-en">' + en + '</span><span class="lang-fr">' + fr + '</span></h3>' +
      '<p><span class="lang-en">' + subEn + '</span><span class="lang-fr">' + subFr + '</span></p>';
    form.parentNode.replaceChild(wrap, form);
    // GA4: fire the mapped success event (only sends if consent granted)
    try {
      var _fn = form.getAttribute('data-airtable-fn');
      var _map = {
        'submit-directory': 'directory_signup_submit',
        'submit-volunteer': 'volunteer_signup_submit',
        'submit-contact': 'contact_form_submit',
        'submit-feedback': 'feedback_submit'
      };
      if (window.noulaTrack && _map[_fn]) window.noulaTrack(_map[_fn], {});
    } catch (e) {}
    // re-apply current language to the freshly inserted nodes
    var cur = lang();
    wrap.querySelectorAll('.lang-en, .lang-fr').forEach(function (el) {
      el.style.display = el.classList.contains('lang-' + cur) ? 'inline' : 'none';
    });
    if (wrap.scrollIntoView) { /* avoid scrolljack: only nudge if off-screen */ }
  }

  function wire(form) {
    var fn = form.getAttribute('data-airtable-fn');
    if (!fn) return;
    var btn = form.querySelector('[type=submit]');
    var statusEl = form.querySelector('.form-status');
    if (!statusEl) {
      statusEl = document.createElement('p');
      statusEl.className = 'form-status';
      statusEl.style.display = 'none';
      form.appendChild(statusEl);
    }
    function setStatus(cls, msg) {
      statusEl.style.display = 'block';
      statusEl.classList.remove('warn', 'err');
      if (cls) statusEl.classList.add(cls);
      statusEl.textContent = msg;
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var hp = form.querySelector('[name=bot-field]');
      if (hp && hp.value) return;
      var ups = form._uploads || [];
      if (ups.some(function (s) { return s.error; })) {
        setStatus('err', t('Please fix the image problem above before sending.', 'Corrigez le problème d’image ci-dessus avant l’envoi.'));
        return;
      }
      if (ups.some(function (s) { return s.pending; })) {
        setStatus('', t('Your images are still being prepared, please try again in a moment.', 'Vos images sont en cours de préparation, réessayez dans un instant.'));
        return;
      }
      var data = collect(form);
      var files = {};
      ups.forEach(function (s) {
        if (s.items.length) files[s.key] = s.items.map(function (it) { return { filename: it.filename, contentType: it.contentType, base64: it.base64 }; });
      });
      if (Object.keys(files).length) data.uploads = files;
      var body = JSON.stringify(data);
      if (body.length > 5500000) {
        setStatus('err', t('Your images are too large together. Please remove one and try again.', 'Vos images sont trop lourdes au total. Retirez-en une et réessayez.'));
        return;
      }
      // Preview test mode: on any non-production host (Claude preview, localhost,
      // *.netlify.app deploy previews) walk the full client flow — validation,
      // conditionals, success panel — and log the payload so field names can be
      // verified, without hitting the backend. On noula.org.uk it never triggers,
      // so production submits for real. Add ?formlive=1 to force a real submit
      // anywhere for a final backend check.
      var host = location.hostname;
      var isProd = /(^|\.)noula\.org\.uk$/i.test(host);
      var forceLive = /[?&]formlive=1/.test(location.search);
      if (!isProd && !forceLive) {
        try {
          console.log('[formtest] ' + fn + ' payload →', JSON.stringify(data, function (k, v) {
            return k === 'base64' ? '[' + v.length + ' base64 chars]' : v;
          }, 2));
        } catch (e) {}
        successPanel(form);
        return;
      }
      if (btn) btn.disabled = true;
      statusEl.style.display = 'block';
      statusEl.classList.remove('err');
      statusEl.textContent = data.uploads
        ? t('Sending… images can take a few seconds.', 'Envoi en cours… les images peuvent prendre quelques secondes.')
        : t('Sending…', 'Envoi en cours…');
      fetch('/.netlify/functions/' + fn, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body
      }).then(function (r) {
        var ct = r.headers.get('content-type') || '';
        if (r.ok) { successPanel(form); return; }
        // A missing function (404) means this build has no backend — i.e. the
        // design preview, not the published site. Anything else is a real error.
        if (r.status === 404 && !ct.includes('application/json')) throw { __preview: true };
        return r.json().catch(function () { return { __http: r.status }; }).then(function (d) { throw d; });
      }).catch(function (err) {
        if (btn) btn.disabled = false;
        statusEl.classList.remove('warn', 'err');
        if (err && err.__preview) {
          statusEl.classList.add('err');
          statusEl.textContent = lang() === 'fr'
            ? "Le formulaire ne fonctionne que sur le site publié (pas dans l’aperçu)."
            : "This form only works on the published site, not in this preview.";
          return;
        }
        // Duplicate submission: shown as an error (nothing was saved)
        if (err && err.duplicate) {
          statusEl.classList.add('err');
          statusEl.textContent = lang() === 'fr'
            ? "Cette entreprise ou cet email est déjà enregistré. Écrivez-nous à fchpf@outlook.com pour modifier votre fiche."
            : (err.error || "This organisation/email appears to already be submitted. Please email fchpf@outlook.com to update your existing entry rather than resubmit.");
          return;
        }
        statusEl.classList.add('err');
        var detail = err && (err.detail || err.error);
        var base = lang() === 'fr'
          ? "Votre envoi n’a pas pu être transmis. Réessayez ou écrivez-nous à fchpf@outlook.com."
          : "We couldn’t send this. Please try again or email us at fchpf@outlook.com.";
        statusEl.textContent = detail ? base + ' (' + detail + ')' : base;
        if (detail) { try { console.error(fn + ' error:', detail); } catch (e) {} }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('form[data-airtable-fn]').forEach(uploads);
    document.querySelectorAll('form[data-airtable-fn]').forEach(wire);
    document.querySelectorAll('form[data-airtable-fn]').forEach(conditionals);
    document.querySelectorAll('form[data-airtable-fn] select').forEach(customSelect);
  });

  // Replace a native <select> with a styled dropdown that mirrors it.
  // The real <select> stays in the DOM (hidden) so FormData + conditionals still work.
  function customSelect(sel) {
    if (sel.dataset.enhanced) return;
    sel.dataset.enhanced = '1';
    var wrap = document.createElement('div');
    wrap.className = 'cs';
    sel.parentNode.insertBefore(wrap, sel);
    wrap.appendChild(sel);
    sel.classList.add('cs-native');

    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'cs-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = '<span class="cs-value"></span><span class="cs-caret" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span>';
    wrap.appendChild(trigger);

    var menu = document.createElement('ul');
    menu.className = 'cs-menu';
    menu.setAttribute('role', 'listbox');
    wrap.appendChild(menu);

    var placeholder = '';
    Array.prototype.forEach.call(sel.options, function (opt) {
      if (opt.value === '') { placeholder = opt.textContent.trim() || 'Select…'; return; }
      var li = document.createElement('li');
      li.className = 'cs-option';
      li.setAttribute('role', 'option');
      li.dataset.value = opt.value;
      li.textContent = opt.textContent.trim();
      li.addEventListener('click', function () { choose(opt.value); });
      menu.appendChild(li);
    });

    function label() {
      var o = sel.options[sel.selectedIndex];
      return o && o.value ? o.textContent.trim() : placeholder;
    }
    function render() {
      var val = sel.value;
      trigger.querySelector('.cs-value').textContent = label();
      trigger.classList.toggle('cs-empty', !val);
      menu.querySelectorAll('.cs-option').forEach(function (li) {
        li.classList.toggle('cs-selected', li.dataset.value === val);
      });
    }
    function open() {
      wrap.classList.add('cs-open');
      trigger.setAttribute('aria-expanded', 'true');
      document.addEventListener('click', outside, true);
    }
    function close() {
      wrap.classList.remove('cs-open');
      trigger.setAttribute('aria-expanded', 'false');
      document.removeEventListener('click', outside, true);
    }
    function outside(e) { if (!wrap.contains(e.target)) close(); }
    function choose(v) {
      sel.value = v;
      sel.dispatchEvent(new Event('change', { bubbles: true }));
      render();
      close();
    }

    trigger.addEventListener('click', function () {
      wrap.classList.contains('cs-open') ? close() : open();
    });
    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
    sel.addEventListener('change', render);
    render();
  }

  // Progressive disclosure: elements with
  //   data-when-field="partner-type" data-when-value="Stallholder"
  // (value may be a comma-separated list) show only when that field matches.
  function conditionals(form) {
    var sections = form.querySelectorAll('[data-when-field]');
    if (!sections.length) return;
    function apply() {
      sections.forEach(function (sec) {
        var field = sec.getAttribute('data-when-field');
        var want = (sec.getAttribute('data-when-value') || '').split(',').map(function (s) { return s.trim(); });
        var ctrl = form.querySelector('[name="' + field + '"]');
        var val = !ctrl ? '' : (ctrl.type === 'checkbox' ? (ctrl.checked ? ctrl.value : '') : ctrl.value);
        var show = want.indexOf(val) >= 0;
        sec.style.display = show ? '' : 'none';
        // Disable inputs inside a hidden section so their `required` never
        // blocks submission and their (stale) values aren't sent.
        sec.querySelectorAll('input, select, textarea').forEach(function (f) { f.disabled = !show; });
      });
    }
    form.querySelectorAll('[name]').forEach(function (el) {
      el.addEventListener('change', apply);
    });
    apply();
  }

  // ---------- Image uploads ----------
  var UP_MAX_BYTES = 5 * 1024 * 1024;
  var UP_LONG_SIDE = 1600;
  var UP_QUALITY = 0.85;
  var UP_TYPES = { logo: ['image/png', 'image/jpeg', 'image/svg+xml'], photo: ['image/png', 'image/jpeg'] };

  function fileType(file) {
    if (file.type) return file.type === 'image/jpg' ? 'image/jpeg' : file.type;
    var ext = (file.name.split('.').pop() || '').toLowerCase();
    return { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', svg: 'image/svg+xml' }[ext] || '';
  }
  function readDataURL(blob) {
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onload = function () { res(r.result); };
      r.onerror = rej;
      r.readAsDataURL(blob);
    });
  }
  function loadImage(file) {
    return new Promise(function (res, rej) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () { res(img); };
      img.onerror = function () { URL.revokeObjectURL(url); rej(new Error('decode')); };
      img.src = url;
    });
  }
  // SVG: sent as-is. PNG logos keep transparency (re-encoded to JPEG only if still heavy).
  // Everything else: max 1600 px on the long side, JPEG 0.85 on a white ground.
  function prepareImage(file, kind, type) {
    if (type === 'image/svg+xml') {
      return readDataURL(file).then(function (d) {
        return { filename: file.name, contentType: type, base64: d.split(',')[1], preview: d };
      });
    }
    return loadImage(file).then(function (img) {
      var w = img.naturalWidth, h = img.naturalHeight;
      var s = Math.min(1, UP_LONG_SIDE / Math.max(w, h));
      var c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(w * s));
      c.height = Math.max(1, Math.round(h * s));
      var ctx = c.getContext('2d');
      var keepPng = kind === 'logo' && type === 'image/png';
      if (!keepPng) { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); }
      ctx.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(img.src);
      var outType = keepPng ? 'image/png' : 'image/jpeg';
      var d = c.toDataURL(outType, UP_QUALITY);
      if (keepPng && d.length > 2000000) {
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, c.width, c.height);
        outType = 'image/jpeg';
        d = c.toDataURL(outType, UP_QUALITY);
      }
      var base = file.name.replace(/\.[^.]+$/, '') || 'image';
      return { filename: base + (outType === 'image/png' ? '.png' : '.jpg'), contentType: outType, base64: d.split(',')[1], preview: d };
    });
  }

  function uploads(form) {
    form._uploads = [];
    form.querySelectorAll('input[type=file][data-upload]').forEach(function (input) {
      var block = input.closest('.upload-block');
      if (!block) return;
      var thumbs = block.querySelector('.upload-thumbs');
      var errEl = block.querySelector('.upload-error');
      var kind = input.getAttribute('data-kind') === 'logo' ? 'logo' : 'photo';
      var max = parseInt(input.getAttribute('data-max') || '1', 10);
      var st = { key: input.getAttribute('data-upload'), items: [], pending: 0, error: '' };
      form._uploads.push(st);

      function showError(msg) {
        st.error = msg || '';
        block.classList.toggle('upload-has-error', !!msg);
        errEl.innerHTML = '';
        errEl.hidden = !msg;
        if (!msg) return;
        var span = document.createElement('span');
        span.textContent = msg;
        var clear = document.createElement('button');
        clear.type = 'button';
        clear.textContent = t('OK', 'OK');
        clear.addEventListener('click', function () { showError(''); });
        errEl.appendChild(span);
        errEl.appendChild(clear);
      }
      function render() {
        thumbs.innerHTML = '';
        st.items.forEach(function (it, i) {
          var box = document.createElement('div');
          box.className = 'upload-thumb' + (kind === 'logo' ? ' is-logo' : '');
          var img = document.createElement('img');
          img.src = it.preview;
          img.alt = it.filename;
          var x = document.createElement('button');
          x.type = 'button';
          x.className = 'upload-remove';
          x.setAttribute('aria-label', t('Remove ', 'Retirer ') + it.filename);
          x.innerHTML = '&times;';
          x.addEventListener('click', function () { st.items.splice(i, 1); render(); });
          box.appendChild(img);
          box.appendChild(x);
          thumbs.appendChild(box);
        });
        block.classList.toggle('upload-full', st.items.length + st.pending >= max);
      }

      input.addEventListener('change', function () {
        var files = Array.prototype.slice.call(input.files || []);
        input.value = '';
        if (!files.length) return;
        showError('');
        if (max === 1) st.items = [];
        var room = max - st.items.length - st.pending;
        if (files.length > room) {
          showError(t('You can add up to ' + max + ' photos. Only the first ' + Math.max(room, 0) + ' were added.',
                      'Vous pouvez ajouter jusqu’à ' + max + ' photos. Seules les ' + Math.max(room, 0) + ' premières ont été ajoutées.'));
          files = files.slice(0, Math.max(room, 0));
        }
        files.forEach(function (file) {
          var type = fileType(file);
          if (UP_TYPES[kind].indexOf(type) < 0) {
            showError(kind === 'logo'
              ? t('“' + file.name + '” is not a PNG, JPG or SVG file.', '« ' + file.name + ' » n’est pas un fichier PNG, JPG ou SVG.')
              : t('“' + file.name + '” is not a JPG or PNG file.', '« ' + file.name + ' » n’est pas un fichier JPG ou PNG.'));
            return;
          }
          if (file.size > UP_MAX_BYTES) {
            showError(t('“' + file.name + '” is larger than 5 MB.', '« ' + file.name + ' » dépasse 5 Mo.'));
            return;
          }
          st.pending++;
          render();
          prepareImage(file, kind, type)
            .then(function (it) { st.items.push(it); })
            .catch(function () {
              showError(t('We couldn’t read “' + file.name + '”. Please try another image.', 'Impossible de lire « ' + file.name + ' ». Essayez une autre image.'));
            })
            .then(function () { st.pending--; render(); });
        });
      });
    });
  }
})();
