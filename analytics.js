/* Noula — Google Analytics 4 + automatic event tracking.
 * SETUP: replace the placeholder below with your real GA4 Measurement ID.
 * It looks like G-XXXXXXXXXX (Google Analytics → Admin → Data streams → Web).
 * This is the ONLY line you need to change. Nothing sends until it is set. */
var GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

(function () {
  'use strict';

  var isPlaceholder = !GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX';

  // --- Load gtag.js ---
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());

  if (!isPlaceholder) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(s);
    gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
  } else {
    console.info('[Noula analytics] GA4 ID not set — events are logged to console only. Edit GA_MEASUREMENT_ID in analytics.js.');
  }

  // --- Helper: send (or log) an event ---
  function track(name, params) {
    params = params || {};
    params.page_path = location.pathname;
    if (isPlaceholder) { console.log('[GA4 event]', name, params); return; }
    gtag('event', name, params);
  }
  window.noulaTrack = track;

  // --- Label helper: readable text for an element ---
  function label(el) {
    var t = (el.getAttribute('aria-label') || el.getAttribute('data-track-label') ||
             el.textContent || el.value || '').trim().replace(/\s+/g, ' ');
    return t.slice(0, 100) || '(no label)';
  }

  var origin = location.hostname;

  document.addEventListener('DOMContentLoaded', function () {

    // 1. All link + button clicks (delegated — survives dynamically added cards)
    document.body.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (a) {
        var href = a.getAttribute('href') || '';
        var isOutbound = /^https?:\/\//i.test(href) && a.hostname !== origin;
        if (isOutbound) {
          track('outbound_click', { link_text: label(a), link_url: href, link_domain: a.hostname });
        } else if (href.indexOf('mailto:') === 0) {
          track('email_click', { link_text: label(a), link_url: href });
        } else {
          track('link_click', { link_text: label(a), link_url: href });
        }
        return;
      }
      var btn = e.target.closest('button, [role="button"], .btn, [data-track]');
      if (btn) {
        track('button_click', {
          button_text: label(btn),
          event_category: btn.getAttribute('data-track') || 'button'
        });
      }
    }, true);

    // 2. Form submissions
    document.body.addEventListener('submit', function (e) {
      var f = e.target.closest('form');
      if (!f) return;
      track('form_submit', {
        form_id: f.id || f.getAttribute('name') || '(unnamed form)',
        form_action: f.getAttribute('action') || location.pathname
      });
    }, true);

    // 3. Language toggle (EN/FR buttons)
    document.querySelectorAll('.lang-switch button').forEach(function (b) {
      b.addEventListener('click', function () {
        track('language_toggle', { language: (b.textContent || '').trim() });
      });
    });

  });
})();
