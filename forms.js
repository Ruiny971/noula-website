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
(function () {
  var lang = function () {
    var l = localStorage.getItem('selectedLanguage');
    return l === 'fr' ? 'fr' : 'en';
  };

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
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var hp = form.querySelector('[name=bot-field]');
      if (hp && hp.value) return;
      var data = collect(form);
      if (btn) btn.disabled = true;
      statusEl.style.display = 'block';
      statusEl.classList.remove('err');
      statusEl.textContent = lang() === 'fr' ? 'Envoi en cours…' : 'Sending…';
      fetch('/.netlify/functions/' + fn, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
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
        // Duplicate submission: softer amber notice, not a hard error
        if (err && err.duplicate) {
          statusEl.classList.add('warn');
          statusEl.textContent = lang() === 'fr'
            ? "Cette organisation ou cet email semble déjà enregistré. Écrivez-nous à fchpf@outlook.com pour mettre à jour votre entrée plutôt que de la resoumettre."
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
        var val = ctrl ? ctrl.value : '';
        sec.style.display = want.indexOf(val) >= 0 ? '' : 'none';
      });
    }
    form.querySelectorAll('[name]').forEach(function (el) {
      el.addEventListener('change', apply);
    });
    apply();
  }
})();
