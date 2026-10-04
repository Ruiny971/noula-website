/* Shared Noula Day programme detail modal.
   Opens the same detail card used on the Programme of the Day grid, from any page.
   Usage: NoulaProgrammeModal.open(item)  where item is a NOULA_PROGRAMME entry.
   Also: NoulaProgrammeModal.openById('blode')  */
(function () {
  var EB = 'https://nouladay2026.eventbrite.co.uk/?aff=NoulaWebsite';
  var catLabel = {All:{en:'All',fr:'Tout'},Market:{en:'Market',fr:'Marché'},Music:{en:'Music',fr:'Musique'},Food:{en:'Food',fr:'Cuisine'},Workshop:{en:'Workshop',fr:'Atelier'},Tournament:{en:'Tournament',fr:'Tournoi'},Storytelling:{en:'Storytelling',fr:'Contes'},Kids:{en:'Kids',fr:'Enfants'},DJ:{en:'DJ',fr:'DJ'},Host:{en:'Host',fr:'Animation'},Dance:{en:'Dance',fr:'Danse'},Chante:{en:'Chanté Nwèl',fr:'Chanté Nwèl'},Carnival:{en:'Carnival',fr:'Carnaval'}};
  var roomLabel = { bal:'Bal Kréol', cour:'La Cour' };
  var addonLabel = { preorder:{en:'Pre-order',fr:'Option à précommander'}, book:{en:'Limited places · book',fr:'Places limitées · réserver'}, dropin:{en:'No booking · just turn up',fr:'Sans réservation · venez'} };
  var ctaLabel = { preorder:{en:'Pre-order on Eventbrite',fr:'Précommander sur Eventbrite'}, book:{en:'Book on Eventbrite',fr:'Réserver sur Eventbrite'} };
  var tagLabel = {Dance:{en:'Dance',fr:'Danse'},Craft:{en:'Craft',fr:'Artisanat'},Cooking:{en:'Cooking',fr:'Cuisine'},Music:{en:'Music',fr:'Musique'}};

  var CSS = ''
    + '.prog-modal{position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;padding:4vw;background:rgba(28,16,30,0.7);}'
    + '.prog-modal.open{display:flex;}'
    + '.pm-card{background:#fff;border-radius:18px;max-width:560px;width:100%;overflow:hidden;box-shadow:0 40px 90px -30px rgba(0,0,0,0.7);position:relative;max-height:90vh;overflow-y:auto;}'
    + '.pm-media{position:relative;height:360px;background:linear-gradient(160deg,#3a2440,#4B2E4E);}'
    + '.pm-media img{width:100%;height:100%;object-fit:cover;object-position:center top;}'
    + '.pm-madras{position:absolute;inset:0;background:url("images/madras.png") center/170px repeat;}'
    + '.pm-close{position:absolute;top:12px;right:14px;z-index:3;background:rgba(42,26,44,0.8);color:#fff;border:none;width:38px;height:38px;border-radius:999px;font-size:1.4rem;cursor:pointer;line-height:1;}'
    + '.pm-body{padding:1.75rem;}'
    + '.pm-body .row{display:flex;gap:0.6rem;align-items:center;flex-wrap:wrap;margin-bottom:0.8rem;}'
    + '.pm-body .pm-time{background:var(--plum-deep);color:#fff;font-weight:700;padding:0.3rem 0.75rem;border-radius:999px;font-size:0.9rem;}'
    + '.pm-room{font-size:0.8rem;font-weight:700;padding:0.3rem 0.7rem;border-radius:999px;}'
    + '.pm-room.bal{background:rgba(232,114,79,0.16);color:#b23c22;}.pm-room.cour{background:rgba(63,124,160,0.16);color:#2c6389;}'
    + '.pm-body h2{font-family:"Playfair Display",Georgia,serif;font-size:1.9rem;color:var(--plum-deep);margin:0.3rem 0 0.4rem;}'
    + '.pm-people{color:var(--gold);font-weight:600;margin:0 0 1rem;}'
    + '.pm-body p{color:var(--text-dark);line-height:1.6;margin:0;}'
    + '.pm-cat{font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;padding:0.3rem 0.7rem;border-radius:999px;color:#fff;}'
    + '.pm-cat.cat-Music{background:#E8724F}.pm-cat.cat-Food{background:#2D7961}.pm-cat.cat-Workshop{background:#7A2E3B}.pm-cat.cat-Storytelling{background:#B07A2E}'
    + '.pm-cat.cat-Kids{background:#3F7CA0}.pm-cat.cat-DJ{background:#8A4E8C}.pm-cat.cat-Market{background:#C49E4C}.pm-cat.cat-Host{background:#556B2F}.pm-cat.cat-Tournament{background:#4A6C8C}'
    + '.pm-cat.cat-Dance{background:#B0506E}.pm-cat.cat-Chante{background:#9C3B2E}.pm-cat.cat-Carnival{background:#B23A7A}'
    + '.pm-tag{font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:var(--plum-deep);background:transparent;border:1.5px solid rgba(63,39,67,0.28);padding:0.3rem 0.7rem;border-radius:999px;}';

  // ---- Shared pre-orderable menu block (used in the kitchen modal + on noula-day.html) ----
  var menuCopy = {
    heading: { en:'The menu', fr:'Le menu' },
    note: {
      en:'Pre-order with your ticket to enjoy a lower price. On the day, dishes are served while stocks last, so ordering ahead is the surest way to get what you fancy.',
      fr:"Précommandez avec votre billet pour profiter d'un tarif réduit. Le jour même, les plats sont servis dans la limite des stocks disponibles, alors commander à l'avance reste le plus sûr moyen d'avoir ce qui vous fait envie."
    },
    cta: { en:'Pre-order on Eventbrite', fr:'Précommander sur Eventbrite' },
    disclaimer: {
      en:'Menu is provisional and may vary on the day. Non-meat / non-pork eaters accommodated with substitutions. Additional drinks + sides available at the bar and kitchen on the day (chokola nwèl + pain au beurre combo, gratin banane jaune as a side, shrub, jus de groseille pays, ti-punch, rhum arrangé, and more).',
      fr:'Le menu est indicatif et peut varier le jour J. Substitutions possibles pour sans viande / sans porc. Boissons et accompagnements supplémentaires disponibles au bar et en cuisine le jour même (combo chokola nwèl + pain au beurre, gratin banane jaune en accompagnement, shrub, jus de groseille pays, ti-punch, rhum arrangé, et plus).'
    }
  };
  var MENU_CSS = ''
    + '.nm-block{margin:0;}'
    + '.nm-note{display:flex;gap:0.6rem;align-items:flex-start;background:rgba(232,114,79,0.10);border:1px solid rgba(232,114,79,0.32);border-radius:12px;padding:0.8rem 1rem;color:var(--plum-deep);font-size:0.9rem;line-height:1.5;margin:0 0 1.1rem;}'
    + '.nm-note svg{flex:0 0 auto;margin-top:2px;}'
    + '.nm-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.9rem;}'
    + '.nm-dish{background:#fff;border:1px solid rgba(63,39,67,0.12);border-radius:14px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 10px 24px -18px rgba(0,0,0,0.5);}'
    + '.nm-img{position:relative;height:140px;background:url("images/madras.png") center/150px repeat;}'
    + '.nm-img img{width:100%;height:100%;object-fit:cover;display:block;}'
    + '.nm-dish .nm-txt{padding:0.85rem 0.95rem;}'
    + '.nm-dish h4{font-family:"Playfair Display",Georgia,serif;font-size:1.12rem;color:var(--plum-deep);margin:0 0 0.35rem;line-height:1.2;}'
    + '.nm-dish p{color:var(--text-dark);font-size:0.85rem;line-height:1.5;margin:0;}'
    + '.nm-cta{margin:1.2rem 0 0.6rem;}'
    + '.nm-cta a{display:inline-block;background:var(--coral);color:#fff;padding:0.65rem 1.3rem;border-radius:999px;font-weight:700;font-size:0.95rem;text-decoration:none;}'
    + '.nm-disc{color:rgba(63,39,67,0.6);font-size:0.72rem;line-height:1.5;margin:0.6rem 0 0;}'
    + '@media(max-width:600px){.nm-grid{grid-template-columns:1fr;}}';

  function menuHTML(d, L, opts){
    opts = opts || {};
    var menu = d.menu || [];
    if (!menu.length) return '';
    var cards = menu.map(function (m){
      var t = m[L] || m.en || {};
      var img = m.img ? '<div class="nm-img"><img src="' + m.img + '" alt="' + (t.n || '') + '" onerror="this.style.display=\'none\'"></div>' : '<div class="nm-img"></div>';
      return '<div class="nm-dish">' + img + '<div class="nm-txt"><h4>' + (t.n || '') + '</h4><p>' + (t.d || '') + '</p></div></div>';
    }).join('');
    var head = opts.heading ? '<h3 class="nm-head" style="font-family:\'Playfair Display\',Georgia,serif;color:var(--plum-deep);font-size:1.5rem;margin:0 0 0.9rem;">' + menuCopy.heading[L] + '</h3>' : '';
    var note = '<div class="nm-note"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c04a26" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg><span>' + menuCopy.note[L] + '</span></div>';
    var cta = '<p class="nm-cta"><a href="' + EB + '" target="_blank" rel="noopener">' + menuCopy.cta[L] + ' →</a></p>';
    var disc = '<p class="nm-disc">' + menuCopy.disclaimer[L] + '</p>';
    return '<div class="nm-block">' + head + note + '<div class="nm-grid">' + cards + '</div>' + cta + disc + '</div>';
  }
  function ensureMenuCSS(){
    if (document.getElementById('nm-css')) return;
    var s = document.createElement('style'); s.id = 'nm-css'; s.textContent = MENU_CSS; document.head.appendChild(s);
  }
  window.NoulaMenu = { html: menuHTML, ensureCSS: ensureMenuCSS, copy: menuCopy };

  function lang(){ var l = localStorage.getItem('selectedLanguage'); return (l === 'fr') ? 'fr' : 'en'; }
  function names(d){ return (d.people || []).map(function (p) { return p.n; }).join(' · '); }
  function mediaHTML(d){
    var withImg = (d.people || []).filter(function (p) { return p.img; });
    if (withImg.length){
      var fit = function (p){ return p.illo ? 'contain' : 'cover'; };
      var pos = function (p){ return p.illo ? 'center' : 'center top'; };
      var pad = function (p){ return p.illo ? 'padding:12px;' : ''; };
      if (withImg.length > 1){
        return '<div style="display:flex;height:100%;align-items:flex-end;justify-content:center;">' + withImg.map(function (p){
          return '<div style="flex:1;height:100%;overflow:hidden;"><img src="' + p.img + '" alt="' + p.n + '" style="width:100%;height:100%;object-fit:' + fit(p) + ';object-position:' + pos(p) + ';' + pad(p) + 'box-sizing:border-box;"></div>';
        }).join('') + '</div>';
      }
      var p0 = withImg[0];
      return '<img src="' + p0.img + '" alt="' + p0.n + '" style="object-fit:' + fit(p0) + ';object-position:' + pos(p0) + ';' + pad(p0) + 'box-sizing:border-box;">';
    }
    return '<div class="pm-madras"></div>';
  }

  var modal = null, pmCard = null;
  function ensure(){
    if (modal) return;
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    modal = document.createElement('div');
    modal.className = 'prog-modal';
    modal.innerHTML = '<div class="pm-card"></div>';
    document.body.appendChild(modal);
    pmCard = modal.querySelector('.pm-card');
    modal.addEventListener('click', function (e){ if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e){ if (e.key === 'Escape') close(); });
  }
  function close(){ if (modal) modal.classList.remove('open'); }
  function open(d){
    if (!d) return;
    ensure();
    ensureMenuCSS();
    var L = lang();
    if (window.noulaTrack) window.noulaTrack('programme_card_click', { card_id: d.id, card_name: (d[L] && d[L].t) || d.id });
    var roomChip = d.room ? '<span class="pm-room ' + d.room + '">' + roomLabel[d.room] + '</span>' : '';
    var addon = '';
    if (d.addon === 'preorder' || d.addon === 'book') {
      addon = '<p style="margin:0 0 0.75rem;"><a href="' + EB + '" target="_blank" rel="noopener" style="display:inline-block;background:var(--coral);color:#fff;padding:0.4rem 0.9rem;border-radius:999px;font-weight:600;font-size:0.85rem;text-decoration:none;">' + ctaLabel[d.addon][L] + ' →</a></p>';
    } else if (d.addon === 'dropin') {
      addon = '<p style="margin:0 0 0.75rem;"><span style="display:inline-block;background:#2D7961;color:#fff;padding:0.4rem 0.9rem;border-radius:999px;font-weight:600;font-size:0.85rem;">' + addonLabel[d.addon][L] + '</span></p>';
    }
    pmCard.innerHTML = '<button class="pm-close" aria-label="Close">&times;</button>'
      + '<div class="pm-media"' + (d.madrasBg ? ' style="background:url(\'images/madras.png\') center/230px"' : '') + '>' + mediaHTML(d) + '</div>'
      + '<div class="pm-body"><div class="row"><span class="pm-time">' + (window.noulaTimeLabel ? window.noulaTimeLabel(d, L) : d.time) + '</span>'
      + '<span class="pm-cat cat-' + d.cat + '">' + catLabel[d.cat][L] + '</span>' + (d.tag ? '<span class="pm-tag">' + tagLabel[d.tag][L] + '</span>' : '') + roomChip + '</div>'
      + '<h2>' + d[L].t + '</h2><p class="pm-people">' + names(d) + '</p>' + addon + '<p>' + d[L].d + '</p>'
      + (d.menu && d.menu.length ? '<div style="margin-top:1.4rem;">' + menuHTML(d, L, { heading:true }) + '</div>' : '')
      + '</div>';
    pmCard.querySelector('.pm-close').onclick = close;
    modal.classList.add('open');
  }
  function openById(id){
    var list = window.NOULA_PROGRAMME || [];
    for (var i = 0; i < list.length; i++){ if (list[i].id === id) return open(list[i]); }
  }

  window.NoulaProgrammeModal = { open: open, openById: openById, close: close };
})();
