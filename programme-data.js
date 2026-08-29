/* Noula Day 2026 · single source of truth for the day's programme.
 * Both the card grid (programme-of-the-day.html) and the hour-by-hour agenda
 * (deroule.html) render from this one array, so the two can never drift.
 *
 * Per entry:
 *   time    display time ("12h30 – 13h30" or "All day")
 *   start   sortable start ("1230"); use "0000" for all-day so they sort first
 *   room    'bal' (Bal Kréol) | 'cour' (La Cour) | null
 *   cat     grid category / filter (Music, Dance, Workshop, Kids, Tournament,
 *           Storytelling, Food, Market, DJ, Chante, Host)
 *   addon   'book' | 'preorder' | null  (Eventbrite pre-book prompt)
 *   tbc     true if time/slot not yet confirmed
 *   inAgenda  show in the hour-by-hour agenda (timed items)
 *   inGrid    show as a card in the visual grid
 *   people  [{n, img?, pos?, illo?}]
 *   en/fr   { t: title, d: description }
 */
window.NOULA_PROGRAMME = [
  // ---------- All-day / untimed (grid only) ----------
  { id:'kitchen', time:'All day', start:'0000', room:'cour', cat:'Food', addon:'preorder', inAgenda:false, inGrid:true, people:[{n:'Noula kitchen'}],
    en:{t:'Noula kitchen · French Caribbean catering', d:'Traditional French Caribbean dishes served through the day. Full menu to come. Dishes can be pre-ordered as an add-on when you book on Eventbrite.'},
    fr:{t:'Cuisine Noula · traiteur antillais', d:"Des plats antillais traditionnels servis toute la journée. Menu complet à venir. Les plats peuvent être précommandés en option lors de votre réservation sur Eventbrite."} },
  { id:'market', time:'All day', start:'0000', room:'cour', cat:'Market', inAgenda:false, inGrid:true, people:[{n:'Noula team'}],
    en:{t:"Makers' market", d:'A marketplace of French Caribbean makers, crafts, food and community stalls, open right through the day.'},
    fr:{t:'Marché des créateurs', d:"Un marché de créateurs antillais, artisanat, cuisine et stands communautaires, ouvert toute la journée."} },
  { id:'dj-allday', time:'All day', start:'0000', room:'bal', cat:'DJ', inAgenda:false, inGrid:true, people:[{n:'DJ Djahman'}],
    en:{t:'DJ Djahman · sets through the day', d:'DJ Djahman keeps the sound going between acts all day, then takes over for the afterparty.'},
    fr:{t:'DJ Djahman · aux platines toute la journée', d:"DJ Djahman assure l'ambiance entre les temps forts toute la journée, puis prend les commandes de l'afterparty."} },

  // ---------- Daytime · The Créole Kermesse ----------
  { id:'doors', time:'12h00', start:'1200', room:'cour', cat:'Host', inAgenda:true, inGrid:false, people:[{n:'Noula team'}],
    en:{t:'Doors open · madras photo wall', d:'Doors open and the madras photo wall is ready for your first pictures of the day.'},
    fr:{t:'Ouverture · mur photo madras', d:'Ouverture des portes et mur photo madras prêt pour vos premières photos de la journée.'} },
  { id:'accras', time:'12h30 – 13h30', start:'1230', room:'cour', cat:'Workshop', addon:'book', inAgenda:true, inGrid:true, people:[{n:'Noula kitchen'}],
    en:{t:'Accras workshop', d:'A hands-on session making accras, the classic French Caribbean fritters. Limited places, pre-book as an add-on.'},
    fr:{t:'Atelier Accras', d:'Un atelier pratique pour préparer les accras, les beignets antillais par excellence. Places limitées, réservez en option.'} },
  { id:'beguine', time:'14h00 – 15h30', start:'1400', room:'bal', cat:'Dance', addon:'book', inAgenda:true, inGrid:true, people:[{n:'Joyce'}],
    en:{t:'Beguine initiation with Joyce', d:'Learn the steps of the beguine with Joyce. All levels welcome.'},
    fr:{t:'Initiation Biguine avec Joyce', d:'Apprenez les pas de la biguine avec Joyce. Tous niveaux bienvenus.'} },
  { id:'sorbet', time:'14h30 – 16h30', start:'1430', room:'cour', cat:'Kids', inAgenda:true, inGrid:true, people:[{n:'Fritz'}],
    en:{t:'Kids sorbet activity with Fritz', d:'A fun sorbet-making activity for children with Fritz.'},
    fr:{t:'Atelier sorbet des enfants avec Fritz', d:'Un atelier sorbet ludique pour les enfants avec Fritz.'} },
  { id:'tournament', time:'15h00 – 18h00', start:'1500', room:'cour', cat:'Tournament', addon:'book', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Noula team',img:'images/illustrations/dominoes.png',illo:true}],
    en:{t:'Dominoes & Belote tournament', d:'The classic French Caribbean domino table and belote card game, in friendly tournaments. Limited places, enter as an add-on.'},
    fr:{t:'Tournoi de dominos & belote', d:'Le domino antillais et la belote, en tournois conviviaux. Places limitées, inscrivez-vous en option.'} },
  { id:'tales', time:'15h30 – 15h45', start:'1530', room:'bal', cat:'Storytelling', tbc:true, inAgenda:true, inGrid:true, people:[{n:'Ralphy'}],
    en:{t:'Creole tales with Ralphy', d:'A short set of créole tales told by Ralphy.'},
    fr:{t:'Contes créoles avec Ralphy', d:'Un moment de contes créoles raconté par Ralphy.'} },
  { id:'kidoka1', time:'15h45 – 16h15', start:'1545', room:'cour', cat:'Kids', tbc:true, inAgenda:true, inGrid:true, people:[{n:'Noula team'}],
    en:{t:'KIDOKA · under 5s', d:'A gentle drumming and rhythm session for the under 5s.'},
    fr:{t:'KIDOKA · moins de 5 ans', d:'Une séance de tambour et de rythme en douceur pour les moins de 5 ans.'} },
  { id:'blode', time:'16h15 – 16h30', start:'1615', room:'bal', cat:'Music', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Blodè Prens',img:'images/artists/blode-prens.png'}],
    en:{t:'Blodè Prens', d:'A live set from Haitian singer Blodè Prens.'},
    fr:{t:'Blodè Prens', d:'Un concert du chanteur haïtien Blodè Prens.'} },
  { id:'madras', time:'16h30 – 17h00', start:'1630', room:'cour', cat:'Workshop', addon:'book', madrasBg:true, tbc:true, inAgenda:true, inGrid:true, people:[{n:'Jade',img:'images/artists/jade.png'}],
    en:{t:'Madras craft with Jade', d:'Work the iconic madras fabric in a hands-on craft session led by Jade. Limited places, pre-book as an add-on.'},
    fr:{t:'Atelier madras avec Jade', d:'Travaillez le tissu madras emblématique lors d’un atelier animé par Jade. Places limitées, réservez en option.'} },
  { id:'charlz', time:'17h00 – 17h15', start:'1700', room:'bal', cat:'Music', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Charlz',img:'images/artists/charlz.png'}],
    en:{t:'Charlz', d:'A live set from Haitian singer Charlz, who sings in four languages.'},
    fr:{t:'Charlz', d:'Un concert du chanteur haïtien Charlz, qui chante en quatre langues.'} },
  { id:'kidoka2', time:'17h15 – 17h45', start:'1715', room:'cour', cat:'Kids', tbc:true, inAgenda:true, inGrid:true, people:[{n:'Noula team'}],
    en:{t:'KIDOKA · 5-12s', d:'A drumming and rhythm session for 5 to 12 year olds.'},
    fr:{t:'KIDOKA · 5-12 ans', d:'Une séance de tambour et de rythme pour les 5-12 ans.'} },
  { id:'catwalk', time:'17h45 – 18h00', start:'1745', room:'bal', cat:'Host', tbc:true, inAgenda:true, inGrid:true, people:[{n:'UKM'}],
    en:{t:'UKM carnival catwalk', d:'A carnival costume catwalk with UKM.'},
    fr:{t:'Défilé carnaval UKM', d:'Un défilé de costumes de carnaval avec UKM.'} },
  { id:'zouk', time:'18h00 – 18h30', start:'1800', room:'bal', cat:'Dance', tbc:true, inAgenda:true, inGrid:true, people:[{n:'Lina'}],
    en:{t:'Zouk Love London with Lina', d:'A zouk / kompa dance introduction with Lina of Zouk Love London.'},
    fr:{t:'Zouk Love London avec Lina', d:'Une initiation zouk / kompa avec Lina de Zouk Love London.'} },

  // ---------- Evening · Chanté Nwèl & afterparty ----------
  { id:'cn1', time:'18h30 – 19h15', start:'1830', room:'bal', cat:'Chante', inAgenda:true, inGrid:true, people:[{n:'Noula'}],
    en:{t:'Chanté Nwèl · Part 1', d:'The first half of the Chanté Nwèl, with the Père Nwèl Antillais entrance (TBC).'},
    fr:{t:'Chanté Nwèl · 1ère partie', d:'La première partie du Chanté Nwèl, avec l’entrée du Père Nwèl Antillais (TBC).'} },
  { id:'interval', time:'19h15 – 19h35', start:'1915', room:'bal', cat:'Host', inAgenda:true, inGrid:false, people:[{n:'Camille'}],
    en:{t:'Interval · Tombola & prize-giving · Camille live set', d:'A break with the tombola and prize-giving, over a live set from Camille.'},
    fr:{t:'Interlude · Tombola & remise des prix · Camille en live', d:'Une pause avec la tombola et la remise des prix, sur un set live de Camille.'} },
  { id:'cn2', time:'19h35 – 20h20', start:'1935', room:'bal', cat:'Chante', inAgenda:true, inGrid:true, people:[{n:'Noula'}],
    en:{t:'Chanté Nwèl · Part 2', d:'The second half of the Chanté Nwèl carols.'},
    fr:{t:'Chanté Nwèl · 2ème partie', d:'La seconde partie des cantiques du Chanté Nwèl.'} },
  { id:'after', time:'20h30 – 22h20', start:'2030', room:'bal', cat:'DJ', inAgenda:true, inGrid:true, people:[{n:'DJ Djahman'}],
    en:{t:'Afterparty · DJ Djahman', d:'The afterparty, mixed by DJ Djahman, zouk, kompa and island sounds late into the night.'},
    fr:{t:'Afterparty · DJ Djahman', d:'L’afterparty, mixée par DJ Djahman : zouk, kompa et sons des îles jusque tard dans la nuit.'} },
  { id:'toast', time:'22h20 – 22h30', start:'2220', room:'bal', cat:'Host', inAgenda:true, inGrid:false, people:[{n:'Trustees'}],
    en:{t:'Trustee toast + thanks', d:'Closing words and a toast from the Noula trustees.'},
    fr:{t:'Discours de clôture des trustees', d:'Mot de clôture et toast des trustees de Noula.'} },
  { id:'close', time:'22h30', start:'2230', room:null, cat:'Host', inAgenda:true, inGrid:false, people:[{n:'Noula team'}],
    en:{t:'Doors close', d:'Doors close. Thank you and see you next time.'},
    fr:{t:'Fermeture des portes', d:'Fermeture des portes. Merci et à la prochaine.'} }
];
