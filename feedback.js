/* Noula team feedback widget, team-only, passcode-gated, posts to Airtable
   via the /.netlify/functions/feedback-submit function.

   How the team unlocks it: visit any page with #feedback added to the URL
   (e.g. noula.org.uk/about.html#feedback), enter the team passcode once.
   After that a small "Feedback" button appears on every page on that device. */
(function () {
  'use strict';
  var AUTH_KEY = 'noulaFbAuth';
  var CODE_KEY = 'noulaFbCode';

  function authed() { try { return localStorage.getItem(AUTH_KEY) === '1'; } catch (e) { return false; } }
  function savedCode() { try { return localStorage.getItem(CODE_KEY) || ''; } catch (e) { return ''; } }

  function unlockFromHash() {
    if (authed()) return;
    if ((location.hash || '').toLowerCase().indexOf('feedback') === -1) return;
    var code = window.prompt('Team passcode to unlock feedback:');
    if (code) {
      try { localStorage.setItem(AUTH_KEY, '1'); localStorage.setItem(CODE_KEY, code); } catch (e) {}
      if (history.replaceState) history.replaceState(null, '', location.pathname + location.search);
    }
  }

  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (html != null) n.innerHTML = html;
    return n;
  }

  function injectStyles() {
    if (document.getElementById('noula-fb-styles')) return;
    var css =
      '.nfb-btn{position:fixed;right:20px;bottom:20px;z-index:99998;display:inline-flex;align-items:center;gap:.5rem;' +
      'background:#2D1F3D;color:#FAF6F1;border:none;border-radius:999px;padding:.7rem 1.1rem;font:600 .9rem/1 Inter,sans-serif;' +
      'cursor:pointer;box-shadow:0 10px 26px -8px rgba(42,26,44,.55);transition:transform .2s,background .2s;}' +
      '.nfb-btn:hover{background:#4B2E4E;transform:translateY(-2px);}' +
      '.nfb-overlay{position:fixed;inset:0;z-index:99999;background:rgba(28,16,30,.55);display:none;align-items:flex-end;justify-content:flex-end;padding:20px;}' +
      '.nfb-overlay.open{display:flex;}' +
      '.nfb-panel{background:#FAF6F1;width:360px;max-width:100%;max-height:88vh;overflow:auto;border-radius:14px;' +
      'box-shadow:0 30px 70px -20px rgba(0,0,0,.55);padding:1.25rem 1.25rem 1.4rem;font-family:Inter,sans-serif;color:#2A1A2C;}' +
      '.nfb-panel h3{font:700 1.15rem/1.2 "Playfair Display",Georgia,serif;margin:0 0 .15rem;color:#2D1F3D;}' +
      '.nfb-panel .nfb-sub{font-size:.8rem;color:#6A5F66;margin:0 0 1rem;word-break:break-all;}' +
      '.nfb-field{display:flex;flex-direction:column;gap:.3rem;margin-bottom:.8rem;}' +
      '.nfb-field label{font-size:.82rem;font-weight:600;color:#4B2E4E;}' +
      '.nfb-field input,.nfb-field select,.nfb-field textarea{width:100%;box-sizing:border-box;padding:.6rem .7rem;' +
      'border:1px solid #E1D4C2;border-radius:7px;font:inherit;font-size:.92rem;background:#fff;color:#2A1A2C;}' +
      '.nfb-field textarea{resize:vertical;min-height:80px;}' +
      '.nfb-row{display:flex;gap:.7rem;}.nfb-row .nfb-field{flex:1;}' +
      '.nfb-actions{display:flex;gap:.6rem;align-items:center;margin-top:.4rem;}' +
      '.nfb-send{background:#E8724F;color:#fff;border:none;border-radius:7px;padding:.7rem 1.3rem;font:600 .95rem/1 Inter,sans-serif;cursor:pointer;transition:background .2s;}' +
      '.nfb-send:hover{background:#d05f3d;}.nfb-send:disabled{background:#ccc;cursor:not-allowed;}' +
      '.nfb-cancel{background:none;border:none;color:#6A5F66;font:600 .9rem Inter,sans-serif;cursor:pointer;}' +
      '.nfb-status{font-size:.85rem;margin:.6rem 0 0;}.nfb-status.ok{color:#2D7961;}.nfb-status.err{color:#B23A2E;}' +
      '.nfb-close{float:right;background:none;border:none;font-size:1.4rem;line-height:1;color:#6A5F66;cursor:pointer;margin:-.3rem -.3rem 0 0;}';
    var s = el('style', { id: 'noula-fb-styles' }); s.textContent = css;
    document.head.appendChild(s);
  }

  function build() {
    injectStyles();
    var btn = el('button', { class: 'nfb-btn', type: 'button', 'aria-label': 'Send feedback' },
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>Feedback');
    document.body.appendChild(btn);

    var overlay = el('div', { class: 'nfb-overlay' });
    overlay.innerHTML =
      '<div class="nfb-panel" role="dialog" aria-label="Team feedback">' +
        '<button class="nfb-close" aria-label="Close">&times;</button>' +
        '<h3>Team feedback</h3>' +
        '<p class="nfb-sub" id="nfb-page"></p>' +
        '<div class="nfb-field"><label>Note *</label><textarea id="nfb-note" placeholder="What should we fix or improve on this page?"></textarea></div>' +
        '<div class="nfb-row">' +
          '<div class="nfb-field"><label>Priority</label><select id="nfb-priority"><option>Low</option><option selected>Medium</option><option>High</option></select></div>' +
          '<div class="nfb-field"><label>Category</label><select id="nfb-category"><option>Bug</option><option>Copy</option><option selected>Design</option><option>Idea</option></select></div>' +
        '</div>' +
        '<div class="nfb-field"><label>Your name</label><input id="nfb-name" type="text" autocomplete="name"></div>' +
        '<div class="nfb-field"><label>Screenshot (optional)</label><input id="nfb-shot" type="file" accept="image/*"></div>' +
        '<div class="nfb-actions"><button class="nfb-send" type="button">Send note</button><button class="nfb-cancel" type="button">Cancel</button></div>' +
        '<p class="nfb-status" id="nfb-status" style="display:none;"></p>' +
      '</div>';
    document.body.appendChild(overlay);

    var panel = overlay.querySelector('.nfb-panel');
    var pageEl = overlay.querySelector('#nfb-page');
    var noteEl = overlay.querySelector('#nfb-note');
    var statusEl = overlay.querySelector('#nfb-status');
    var sendBtn = overlay.querySelector('.nfb-send');

    function open() { pageEl.textContent = location.pathname + location.hash; overlay.classList.add('open'); noteEl.focus(); }
    function close() { overlay.classList.remove('open'); }
    btn.addEventListener('click', open);
    overlay.querySelector('.nfb-close').addEventListener('click', close);
    overlay.querySelector('.nfb-cancel').addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    panel.addEventListener('click', function (e) { e.stopPropagation(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    function readShot() {
      var f = overlay.querySelector('#nfb-shot').files[0];
      if (!f) return Promise.resolve(null);
      if (f.size > 4 * 1024 * 1024) return Promise.reject(new Error('Screenshot too large (max 4MB)'));
      return new Promise(function (res, rej) {
        var r = new FileReader();
        r.onload = function () { res({ name: f.name, type: f.type, dataBase64: String(r.result).split(',')[1] }); };
        r.onerror = function () { rej(new Error('Could not read the screenshot')); };
        r.readAsDataURL(f);
      });
    }

    sendBtn.addEventListener('click', function () {
      var note = noteEl.value.trim();
      statusEl.style.display = 'block'; statusEl.className = 'nfb-status';
      if (!note) { statusEl.classList.add('err'); statusEl.textContent = 'Please write a note first.'; return; }
      sendBtn.disabled = true; statusEl.textContent = 'Sending…';
      readShot().then(function (shot) {
        var payload = {
          passcode: savedCode(),
          page: location.pathname + location.hash,
          note: note,
          name: overlay.querySelector('#nfb-name').value.trim(),
          priority: overlay.querySelector('#nfb-priority').value,
          category: overlay.querySelector('#nfb-category').value,
          screenshot: shot
        };
        return fetch('/.netlify/functions/feedback-submit', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
      }).then(function (r) {
        if (r && r.ok) { return r.json().catch(function(){return {};}); }
        var ct = (r && r.headers.get('content-type')) || '';
        if (!ct.includes('application/json')) throw { __preview: true };
        return r.json().catch(function(){return {};}).then(function (d) { throw d; });
      }).then(function (d) {
        sendBtn.disabled = false;
        statusEl.classList.add('ok');
        statusEl.textContent = (d && d.screenshotWarning)
          ? 'Note saved (screenshot skipped: ' + d.screenshotWarning + ')'
          : 'Thanks, your note was saved.';
        noteEl.value = ''; overlay.querySelector('#nfb-name').value = ''; overlay.querySelector('#nfb-shot').value = '';
      }).catch(function (err) {
        sendBtn.disabled = false; statusEl.classList.add('err');
        if (err && err.__preview) { statusEl.textContent = 'Feedback only works on the published site, not this preview.'; return; }
        if (err && err.error === 'Not authorised.') {
          statusEl.textContent = 'Wrong passcode, re-unlock with #feedback.';
          try { localStorage.removeItem('noulaFbAuth'); } catch (e) {}
          return;
        }
        var detail = err && (err.detail || err.error);
        statusEl.textContent = detail ? 'Could not send (' + detail + ')' : 'Could not send, try again.';
      });
    });
  }

  function init() {
    unlockFromHash();
    if (authed()) build();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
