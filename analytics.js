/* Noula — Google Analytics 4 (GA4) with GDPR consent gating + custom events.
 *
 * Behaviour:
 *  - Consent Mode v2: analytics/ads storage DENIED by default (UK/EU compliant).
 *  - gtag.js is NOT loaded until the visitor clicks "Accept all", so a fresh
 *    visit that rejects (or ignores) the banner makes ZERO Google requests.
 *  - Choice remembered in localStorage("noula_consent") = "granted" | "denied".
 *  - Bilingual banner (reads localStorage "selectedLanguage", EN default).
 *  - "Manage cookies" link auto-added to every footer to reopen the banner.
 *  - Custom events fire only once consent is granted; every event carries a
 *    `language` param and `page_path`.
 */
var GA_MEASUREMENT_ID = 'G-RBNEY3FPN3';

(function () {
  'use strict';

  var CONSENT_KEY = 'noula_consent';

  // --- gtag bootstrap + Consent Mode v2 default (denied) ---
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });

  var gaLoaded = false;
  var consentGranted = false;

  function loadGA() {
    consentGranted = true;
    gtag('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted'
    });
    if (!gaLoaded) {
      gaLoaded = true;
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
      document.head.appendChild(s);
      gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true, send_page_view: true });
    }
  }

  function lang() {
    return localStorage.getItem('selectedLanguage') === 'fr' ? 'fr' : 'en';
  }

  // --- Event helper: only sends once consent is granted ---
  function track(name, params) {
    if (!consentGranted) return;
    params = params || {};
    if (params.page_path === undefined) params.page_path = location.pathname;
    params.language = lang();
    gtag('event', name, params);
  }
  window.noulaTrack = track;

  function label(el) {
    var t = (el.getAttribute('aria-label') || el.getAttribute('data-track-label') ||
             el.textContent || el.value || '').trim().replace(/\s+/g, ' ');
    return t.slice(0, 120);
  }

  // ---------------------------------------------------------------------------
  // Consent banner
  // ---------------------------------------------------------------------------
  var COPY = {
    body: {
      en: 'We use cookies to understand how the site is used, so we can make it better. You can accept or reject · your choice.',
      fr: "On utilise des cookies pour comprendre comment le site est utilisé, pour l'améliorer. Vous pouvez accepter ou refuser · à vous de choisir."
    },
    accept: { en: 'Accept all', fr: 'Tout accepter' },
    reject: { en: 'Reject all', fr: 'Tout refuser' },
    manage: { en: 'Manage cookies', fr: 'Gérer les cookies' }
  };

  var banner = null;

  function buildBanner() {
    if (banner) return banner;
    banner = document.createElement('div');
    banner.id = 'noula-consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.style.cssText = [
      'position:fixed', 'left:16px', 'right:16px', 'bottom:16px', 'z-index:2147483000',
      'max-width:760px', 'margin:0 auto',
      'background:#3f2743', 'color:#FAF6F1',
      'border:1px solid rgba(232,199,138,0.45)', 'border-radius:14px',
      'box-shadow:0 14px 40px rgba(16,6,20,0.5)',
      'padding:16px 18px', 'display:flex', 'gap:16px', 'align-items:center',
      'flex-wrap:wrap', 'font-family:inherit', 'font-size:0.92rem', 'line-height:1.5',
      'transform:translateY(140%)', 'transition:transform 0.35s ease'
    ].join(';');
    banner.innerHTML =
      '<div style="flex:1 1 300px; min-width:240px;">' +
        '<span class="lang-en">' + COPY.body.en + '</span>' +
        '<span class="lang-fr">' + COPY.body.fr + '</span>' +
      '</div>' +
      '<div style="display:flex; gap:10px; flex:0 0 auto;">' +
        '<button type="button" id="noula-consent-reject" style="cursor:pointer; font:inherit; font-weight:600; padding:0.55rem 1.1rem; border-radius:999px; border:1.5px solid rgba(250,246,241,0.5); background:transparent; color:#FAF6F1;">' +
          '<span class="lang-en">' + COPY.reject.en + '</span><span class="lang-fr">' + COPY.reject.fr + '</span>' +
        '</button>' +
        '<button type="button" id="noula-consent-accept" style="cursor:pointer; font:inherit; font-weight:700; padding:0.55rem 1.2rem; border-radius:999px; border:none; background:#E8724F; color:#FFF;">' +
          '<span class="lang-en">' + COPY.accept.en + '</span><span class="lang-fr">' + COPY.accept.fr + '</span>' +
        '</button>' +
      '</div>';
    document.body.appendChild(banner);
    applyLang(banner);
    banner.querySelector('#noula-consent-accept').addEventListener('click', function () {
      localStorage.setItem(CONSENT_KEY, 'granted');
      loadGA();
      hideBanner();
    });
    banner.querySelector('#noula-consent-reject').addEventListener('click', function () {
      localStorage.setItem(CONSENT_KEY, 'denied');
      hideBanner();
    });
    return banner;
  }

  function showBanner() {
    buildBanner();
    requestAnimationFrame(function () { banner.style.transform = 'translateY(0)'; });
  }
  function hideBanner() {
    if (banner) banner.style.transform = 'translateY(140%)';
  }
  window.noulaManageCookies = function () { showBanner(); };

  // Show/hide the correct language spans inside a freshly inserted node.
  function applyLang(root) {
    var cur = lang();
    root.querySelectorAll('.lang-en, .lang-fr').forEach(function (el) {
      el.style.display = el.classList.contains('lang-' + cur) ? '' : 'none';
    });
  }

  // ---------------------------------------------------------------------------
  // Footer "Manage cookies" link (auto-injected on every page)
  // ---------------------------------------------------------------------------
  function addManageLink() {
    var footer = document.querySelector('footer.footer') || document.querySelector('footer');
    if (!footer || footer.querySelector('.noula-manage-cookies')) return;
    var wrap = document.createElement('div');
    wrap.style.cssText = 'text-align:center; padding:0.6rem 1rem 0.2rem; opacity:0.75;';
    var a = document.createElement('a');
    a.href = '#';
    a.className = 'noula-manage-cookies';
    a.style.cssText = 'color:inherit; font-size:0.82rem; text-decoration:underline; cursor:pointer;';
    a.innerHTML = '<span class="lang-en">' + COPY.manage.en + '</span><span class="lang-fr">' + COPY.manage.fr + '</span>';
    a.addEventListener('click', function (e) { e.preventDefault(); showBanner(); });
    wrap.appendChild(a);
    footer.appendChild(wrap);
    applyLang(wrap);
  }

  // ---------------------------------------------------------------------------
  // Custom event wiring
  // ---------------------------------------------------------------------------
  function matchDonate(el) {
    var s = ((el.getAttribute('href') || '') + ' ' + (el.className || '') + ' ' + (el.id || '')).toLowerCase();
    return s.indexOf('donate') >= 0;
  }
  function matchWhatsApp(el) {
    var href = (el.getAttribute('href') || '').toLowerCase();
    var s = ((el.className || '') + ' ' + (el.id || '')).toLowerCase();
    return href.indexOf('wa.me') >= 0 || href.indexOf('whatsapp') >= 0 || href.indexOf('api.whatsapp') >= 0 || s.indexOf('whatsapp') >= 0;
  }

  function wireEvents() {
    document.body.addEventListener('click', function (e) {
      var a = e.target.closest('a, button');
      if (!a) return;
      var href = (a.getAttribute('href') || '');

      if (/eventbrite\.co\.uk|eventbrite\.com/i.test(href)) {
        track('eventbrite_cta_click', { link_text: label(a) });
        return;
      }
      if (matchWhatsApp(a)) { track('whatsapp_click', {}); return; }
      if (matchDonate(a)) { track('donate_click', {}); return; }
    }, true);
  }

  // ---------------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------------
  function init() {
    // Returning visitor who already accepted → load GA immediately.
    if (localStorage.getItem(CONSENT_KEY) === 'granted') {
      loadGA();
    } else if (localStorage.getItem(CONSENT_KEY) !== 'denied') {
      showBanner(); // first visit, no choice yet
    }
    addManageLink();
    wireEvents();

    // Keep banner + footer link language in sync with the EN/FR toggle.
    document.querySelectorAll('.lang-switch button, .lang-btn, [data-lang]').forEach(function (b) {
      b.addEventListener('click', function () {
        setTimeout(function () {
          if (banner) applyLang(banner);
          var mw = document.querySelector('.noula-manage-cookies');
          if (mw) applyLang(mw.parentNode);
        }, 0);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
