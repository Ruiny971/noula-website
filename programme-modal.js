/* Shared Noula Day programme detail modal.
   Opens the same detail card used on the Programme of the Day grid, from any page.
   Usage: NoulaProgrammeModal.open(item)  where item is a NOULA_PROGRAMME entry.
   Also: NoulaProgrammeModal.openById('blode')  */
(function () {
  var EB = 'https://nouladay2026.eventbrite.co.uk/?aff=NoulaWebsite';
  var catLabel = {All:{en:'All',fr:'Tout'},Market:{en:'Market',fr:'Marché'},Music:{en:'Music',fr:'Musique'},Food:{en:'Food',fr:'Cuisine'},Workshop:{en:'Workshop',fr:'Atelier'},Tournament:{en:'Tournament',fr:'Tournoi'},Storytelling:{en:'Storytelling',fr:'Contes'},Kids:{en:'Kids',fr:'Enfants'},DJ:{en:'DJ',fr:'DJ'},Host:{en:'Host',fr:'Animation'},Dance:{en:'Dance',fr:'Danse'},Chante:{en:'Chanté Nwèl',fr:'Chanté Nwèl'},Carnival:{en:'Carnival',fr:'Carnaval'}};
  var roomLabel = { bal:'Bal Kréol', cour:'La Cour' };
  var addonLabel = { preorder:{en:'Pre-order add-on',fr:'Option à précommander'}, book:{en:'Limited places · book add-on',fr:'Places limitées · option'} };
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
    var L = lang();
    var roomChip = d.room ? '<span class="pm-room ' + d.room + '">' + roomLabel[d.room] + '</span>' : '';
    var addon = d.addon
      ? '<p style="margin:0 0 0.75rem;"><a href="' + EB + '" target="_blank" rel="noopener" style="display:inline-block;background:var(--coral);color:#fff;padding:0.4rem 0.9rem;border-radius:999px;font-weight:600;font-size:0.85rem;text-decoration:none;">' + addonLabel[d.addon][L] + ' →</a></p>'
      : '';
    pmCard.innerHTML = '<button class="pm-close" aria-label="Close">&times;</button>'
      + '<div class="pm-media"' + (d.madrasBg ? ' style="background:url(\'images/madras.png\') center/230px"' : '') + '>' + mediaHTML(d) + '</div>'
      + '<div class="pm-body"><div class="row"><span class="pm-time">' + d.time + '</span>'
      + '<span class="pm-cat cat-' + d.cat + '">' + catLabel[d.cat][L] + '</span>' + (d.tag ? '<span class="pm-tag">' + tagLabel[d.tag][L] + '</span>' : '') + roomChip + '</div>'
      + '<h2>' + d[L].t + '</h2><p class="pm-people">' + names(d) + '</p>' + addon + '<p>' + d[L].d + '</p></div>';
    pmCard.querySelector('.pm-close').onclick = close;
    modal.classList.add('open');
  }
  function openById(id){
    var list = window.NOULA_PROGRAMME || [];
    for (var i = 0; i < list.length; i++){ if (list[i].id === id) return open(list[i]); }
  }

  window.NoulaProgrammeModal = { open: open, openById: openById, close: close };
})();
