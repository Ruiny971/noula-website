/* Noula Day 2026 · single source of truth for the day's programme.
 * Both the card grid (programme-of-the-day.html) and the hour-by-hour agenda
 * (deroule.html) render from this one array.
 *
 * Per entry:
 *   time    display time ("12h30-13h30" or "All day")
 *   start   sortable start ("1230"); use "0000" for all-day so they sort first
 *   room    'bal' (Main hall) | 'cour' (La Cour, back room) | 'game' (Game zone & sorbet) | null
 *   price   for addon:'book' · '£3' | 'free' (shown on the Book button)
 *   cat     grid category / filter (Music, Dance, Workshop, Kids, Tournament,
 *           Storytelling, Food, Market, DJ, Chante, Host, Carnival)
 *   addon   'book' | 'preorder' | 'dropin' | null
 *   inAgenda  show in the hour-by-hour agenda (timed items)
 *   inGrid    show as a card in the visual grid
 *   people  [{n, img?, pos?, illo?, zoom?, origin?}]  zoom = scale a photo with lots of empty margin
 *   en/fr   { t: title, d: description }
 */
/* SOFT LAUNCH: clock times hidden from public view. Times stay in the data below.
 * Set to true (mid-November) to show them again on What's on, the Agenda and the modal. */
window.NOULA_SHOW_TIMES = true;
/* SOFT LAUNCH: room names hidden (shown as TBC). Set true when rooms are confirmed. */
window.NOULA_SHOW_ROOMS = true;
/* SOFT LAUNCH: add-on booking (workshops, kids, tournaments, food pre-orders) not open yet.
 * Entry tickets ARE on sale. Set true when add-ons go live on Eventbrite. */
window.NOULA_ADDONS_OPEN = true;
window.NOULA_ROOMS = {
  bal:  { en:'Main hall',            fr:'Grande salle' },
  cour: { en:'La Cour · back room',  fr:'La Cour · arrière-salle' },
  game: { en:'Game zone & sorbet',   fr:'Espace jeux & sorbet' }
};
window.noulaRoomLabel = function(room, L){
  if (window.NOULA_SHOW_ROOMS) return (window.NOULA_ROOMS[room] || {})[L === 'fr' ? 'fr' : 'en'] || '';
  return L === 'fr' ? 'Salle à annoncer' : 'Room to be announced';
};
/* Book button (+ "Limited places" under it) for addon:'book' entries. price: '£3' | 'free' | undefined */
window.noulaBookHTML = function(d, L){
  var fr = L === 'fr';
  var price = d.price === 'free' ? (fr ? 'gratuit' : 'free') : d.price ? (fr ? d.price.replace('£', '') + ' £' : d.price) : '';
  var label = (fr ? 'Réserver' : 'Book') + (price ? ' · ' + price : '');
  return '<div style="margin:0 0 0.9rem;"><a href="https://nouladay2026.eventbrite.co.uk/?aff=NoulaWebsite" target="_blank" rel="noopener" style="display:inline-block;background:var(--coral);color:#fff;padding:0.5rem 1.1rem;border-radius:999px;font-weight:700;font-size:0.9rem;text-decoration:none;">' + label + ' →</a>'
    + '<span style="display:block;margin-top:0.35rem;font-size:0.8rem;font-weight:600;color:var(--text-light,#6b5a6d);">' + (fr ? 'Places limitées' : 'Limited places') + '</span></div>';
};
window.noulaTimeLabel = function(d, L){
  if (window.NOULA_SHOW_TIMES) return d.start === '0000' ? (L === 'fr' ? 'Toute la journée' : 'All day') : d.time;
  var k = d.start === '0000' ? 'all' : (d.start < '1830' ? 'aft' : 'eve');
  return ({ all:{en:'All day',fr:'Toute la journée'}, aft:{en:'Afternoon',fr:"L'après-midi"}, eve:{en:'Evening',fr:'Le soir'} })[k][L === 'fr' ? 'fr' : 'en'];
};

window.NOULA_PROGRAMME = [
  // ---------- All-day / untimed (grid only) ----------
  { id:'kitchen', time:'All day', start:'0000', room:'cour', cat:'Food', addon:'preorder', madrasBg:true, inAgenda:false, inGrid:true, people:[{n:'Noula kitchen',img:'images/illustrations/caribbean-catering.png',illo:true}],
    menu:[
      { id:'degustation-creole', img:'images/menu/degustation-creole.png',
        en:{n:'La Dégustation Créole', d:'A festive tasting plate · jambon de Noël, accras de morue, pain au beurre with chokola nwèl (spiced hot chocolate), and a scoop of sorbet. Non-meat / non-pork eaters get extra accras instead of jambon.'},
        fr:{n:'La Dégustation Créole', d:'Une assiette de dégustation festive · jambon de Noël, accras de morue, pain au beurre avec chokola nwèl (chocolat chaud épicé), et une boule de sorbet. Sans viande / sans porc : accras supplémentaires à la place du jambon.'} },
      { id:'vegan', img:'images/menu/vegan.png',
        en:{n:'Vegan', d:"Pois d'angole (Antillean pigeon peas) with rice and achard mango pickle."},
        fr:{n:'Vegan', d:"Pois d'angole avec riz et achard de mangue."} },
      { id:'vegan-gratin', img:'images/menu/vegan-gratin.png',
        en:{n:'Vegan + gratin de banane jaune', d:'Vegan plate + a wedge of gratin de banane jaune (baked ripe yellow plantain).'},
        fr:{n:'Vegan + gratin de banane jaune', d:'Plat vegan + une part de gratin de banane jaune.'} },
      { id:'cochon-roussi', img:'images/menu/cochon-roussi.png',
        en:{n:'Cochon roussi', d:"Antillean caramelised pork with rice and pois d'angole."},
        fr:{n:'Cochon roussi', d:"Cochon antillais caramélisé avec riz et pois d'angole."} },
      { id:'poulet-sauce-chien', img:'images/menu/poulet-sauce-chien.png',
        en:{n:'Poulet grillé, sauce chien', d:"Grilled chicken with sauce chien (Antillean parsley-onion-chili green sauce), rice and pois d'angole."},
        fr:{n:'Poulet grillé, sauce chien', d:"Poulet grillé avec sauce chien (sauce persil-oignon-piment antillaise), riz et pois d'angole."} },
      { id:'fish', img:'images/menu/fish.png',
        en:{n:'Fish', d:"Braised whole Caribbean fish (poisson rôti braisé) with rice, pois d'angole and sauce chien on the side."},
        fr:{n:'Fish', d:"Poisson caribéen rôti braisé avec riz, pois d'angole et sauce chien à part."} }
    ],
    en:{t:'Noula kitchen · French Caribbean catering', d:'Traditional French Caribbean dishes served through the day. Full menu published closer to the event.'},
    fr:{t:'Cuisine Noula · traiteur antillais', d:"Des plats antillais traditionnels servis toute la journée. Menu complet publié plus près de l'événement."} },
  { id:'market', time:'All day', start:'0000', room:'cour', cat:'Market', inAgenda:false, inGrid:true, people:[{n:'Noula team',img:'images/illustrations/makers-market.png'}],
    en:{t:"French Caribbean makers' market", d:'A marketplace of French Caribbean makers, crafts, food and community stalls, open right through the day.'},
    fr:{t:'Marché des créateurs antillais', d:"Un marché de créateurs antillais, artisanat, cuisine et stands communautaires, ouvert toute la journée."} },
  { id:'dj-allday', time:'All day', start:'0000', room:'bal', cat:'DJ', madrasBg:true, inAgenda:false, inGrid:true, people:[{n:'DJ Djahman',img:'images/artists/djahman.png'}],
    en:{t:'DJ Djahman · sets through the day', d:'DJ Djahman keeps the sound going between acts all day, then takes over for the afterparty.'},
    fr:{t:'DJ Djahman · aux platines toute la journée', d:"DJ Djahman assure l'ambiance entre les temps forts toute la journée, puis prend les commandes de l'afterparty."} },

  // ---------- Main hall · daytime ----------
  { id:'doors', time:'12h00', start:'1200', room:'bal', cat:'Host', inAgenda:true, inGrid:false, people:[{n:'Noula team'}],
    en:{t:'Doors open · DJ and food all day', d:'Doors open, come on in. DJ sets and French Caribbean food all day.'},
    fr:{t:'Ouverture · DJ et cuisine toute la journée', d:'Ouverture des portes, entrez ! DJ et cuisine antillaise toute la journée.'} },

  { id:'welcome', time:'13h00', start:'1300', room:'bal', cat:'Host', inAgenda:true, inGrid:false, people:[{n:'Noula host'}],
    en:{t:'Welcome to Noula Day', d:'A short welcome from the Noula team to open the day.'},
    fr:{t:'Bienvenue à Noula Day', d:"Un court mot d'accueil de l'équipe Noula pour ouvrir la journée."} },

  { id:'kompa', time:'14h30-15h15', start:'1430', room:'bal', cat:'Workshop', tag:'Dance', addon:'book', price:'£3', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Zouk Love London',img:'images/zouklove-card.png',illo:true}],
    en:{t:'Konpa class by Zouk Love London', d:"An introduction to Konpa with Zouk Love London. This 45-minute class welcomes all levels, including complete beginners. If it's your first time, come along! It's the perfect introduction. Limited places."},
    fr:{t:'Cours de konpa par Zouk Love London', d:"Une initiation au konpa avec Zouk Love London. Ce cours de 45 minutes est ouvert à tous les niveaux, même aux grands débutants. C'est votre première fois ? Venez, c'est l'occasion idéale pour commencer. Places limitées."} },

  { id:'live', time:'15h30-16h15', start:'1530', room:'bal', cat:'Music', madrasBg:true, inAgenda:true, inGrid:false, people:[{n:'Charlz',img:'images/artists/charlz.png'},{n:'Blodè Prens',img:'images/artists/blode-prens.png'},{n:'Jada Mayday',img:'images/artists/jada-mayday.png'}],
    en:{t:'Live: Charlz, Blodè Prens, Jada Mayday', d:'Live sets from Charlz, Blodè Prens and Jada Mayday.'},
    fr:{t:'Live : Charlz, Blodè Prens, Jada Mayday', d:'Les lives de Charlz, Blodè Prens et Jada Mayday.'} },

  { id:'charlz', time:'15h30-16h15', start:'1530', room:'bal', cat:'Music', madrasBg:true, inAgenda:false, inGrid:true, people:[{n:'Charlz',img:'images/artists/charlz.png'}],
    en:{t:'Charlz', d:'A live set from Haitian pop and R&amp;B singer Charlz, who sings in four languages.'},
    fr:{t:'Charlz', d:'Un live du chanteur haïtien pop et R&amp;B Charlz, qui chante en quatre langues.'} },

  { id:'blode', time:'15h30-16h15', start:'1530', room:'bal', cat:'Music', madrasBg:true, inAgenda:false, inGrid:true, people:[{n:'Blodè Prens',img:'images/artists/blode-prens.png'}],
    en:{t:'Blodè Prens', d:'A live set from Haitian reggae artist Blodè Prens: sincere songs about love and faith.'},
    fr:{t:'Blodè Prens', d:"Un live de l'artiste haïtien Blodè Prens : du reggae aux paroles sincères sur l'amour et la foi."} },

  { id:'jada', time:'15h30-16h15', start:'1530', room:'bal', cat:'Music', madrasBg:true, inAgenda:false, inGrid:true, people:[{n:'Jada Mayday',img:'images/artists/jada-mayday.png'}],
    en:{t:'Jada Mayday', d:'A live set from Jada Mayday.'},
    fr:{t:'Jada Mayday', d:'Un live de Jada Mayday.'} },

  { id:'beguine', time:'16h30-17h15', start:'1630', room:'bal', cat:'Workshop', tag:'Dance', addon:'book', price:'£3', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Joyce-Lee &amp; Joëlle',img:'images/artists/joelle-joyce.png'}],
    en:{t:'Biguine Party with Joyce-Lee &amp; Joëlle', d:'The Biguine Party is a festive moment of sharing, discovery and fun around French Caribbean culture! Whether you already know the biguine or want to discover it, come and move to Antillean rhythms, learn, dance and have fun in a warm atmosphere, for all generations. 45 minutes. Limited places.'},
    fr:{t:'Biguine Party avec Joyce-Lee &amp; Joëlle', d:"La Biguine Party, c'est un moment festif de partage, de découverte et de convivialité autour de la culture antillaise ! Que vous connaissiez déjà la biguine ou souhaitiez la découvrir, venez bouger sur les rythmes antillais, apprendre, danser et vous amuser dans une ambiance chaleureuse, toutes générations confondues ! 45 minutes. Places limitées."} },

  { id:'tales', time:'17h30-17h50', start:'1730', room:'bal', cat:'Storytelling', addon:'dropin', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:"Ralphy (Zil'Oka)",img:'images/artists/ralphy.png'}],
    en:{t:"Contes créoles with Ralphy (Zil'Oka)", d:'Créole tales for all ages. Ralphy is a drummer, storyteller and passionate keeper of Caribbean traditions from Martinique, Guadeloupe and French Guiana. With contagious energy and a deep love of working with young people, he brings rhythm, culture and joy to every gathering.'},
    fr:{t:"Contes créoles avec Ralphy (Zil'Oka)", d:'Des contes créoles pour tous les âges. Ralphy est batteur, conteur et gardien passionné des traditions caribéennes de Martinique, de Guadeloupe et de Guyane. Avec une énergie contagieuse et un amour profond du travail avec les jeunes, il apporte rythme, culture et joie à chaque rassemblement.'} },

  { id:'zoukkaraoke', time:'18h00-18h30', start:'1800', room:'bal', cat:'Music', tag:'Dance', addon:'dropin', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Lina',img:'images/illustrations/zouk-karaoke.png',illo:true}],
    en:{t:'Zouk karaoke with Lina', d:'A zouk karaoke with Lina to launch the evening. Come and sing your favourite zouk songs, solo or with friends, or simply join the crowd and enjoy the music. Everyone is welcome!'},
    fr:{t:'Karaoké zouk avec Lina', d:"Un karaoké zouk avec Lina pour lancer la soirée. Venez chanter vos zouks préférés, seul ou entre amis, ou profitez simplement de l'ambiance. Tout le monde est bienvenu !"} },

  // ---------- Main hall · evening ----------
  { id:'catwalk', time:'18h30-18h45', start:'1830', room:'bal', cat:'Carnival', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'UKM',img:'images/artists/ukm.png',illo:true}],
    en:{t:'UKM carnival catwalk', d:"A carnival costume catwalk by United Kreyol Mas · models walk to Djahman's music, madras + carnival costumes in full effect, right before the Chanté Nwèl."},
    fr:{t:'Défilé carnaval UKM', d:"Un défilé de costumes de carnaval par United Kreyol Mas · les mannequins défilent sur la musique de Djahman, madras + costumes de carnaval en pleine lumière, juste avant le Chanté Nwèl."} },

  { id:'cn1', time:'19h00-19h30', start:'1900', room:'bal', cat:'Chante', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:"Ralphy, Takadoum, Stella, Rita (Zil'Oka)",img:'images/artists/ziloka.png',illo:true}],
    en:{t:'Chanté Nwèl · Part 1', d:"The first half of the Chanté Nwèl carols with Zil'Oka, opened by the Père Nwèl Antillais entrance. Ralphy, Takadoum, Stella and Rita invite you to Chanté Nwèl: Caribbean Christmas songs celebrating the joy, tradition and festive spirit of Martinique, Guadeloupe and French Guiana. Expect contagious rhythms, voices at full power and pure joie de vivre."},
    fr:{t:'Chanté Nwèl · 1ère partie', d:"La première partie du Chanté Nwèl avec Zil'Oka, ouverte par l'entrée du Père Nwèl Antillais. Ralphy, Takadoum, Stella et Rita vous invitent au Chanté Nwèl : des chants de Noël caribéens qui célèbrent la joie, la tradition et l'esprit festif de la Martinique, de la Guadeloupe et de la Guyane. Au programme : des rythmes contagieux, des voix à pleine puissance et une vraie joie de vivre."} },

  { id:'guest', time:'19h30', start:'1930', room:'bal', cat:'Music', madrasBg:true, inAgenda:true, inGrid:true, people:[],
    en:{t:'Special guest', d:'A special guest joins us for the evening. More soon.'},
    fr:{t:'Invité spécial', d:'Un invité spécial nous rejoint pour la soirée. À suivre.'} },

  { id:'interval', time:'21h00', start:'2100', room:'bal', cat:'Host', inAgenda:true, inGrid:true, people:[{n:'Noula team'}],
    en:{t:'Interval · Tombola &amp; crowning of the Mèt Domino and Boss Bèlot', d:'A festive break with the tombola draw and the crowning of the dominoes and belote champions, the Mèt Domino and the Boss Bèlot.'},
    fr:{t:'Interlude · Tombola &amp; couronnement du Mèt Domino et du Boss Bèlot', d:'Une pause festive avec le tirage de la tombola et le couronnement des champions de dominos et de belote, le Mèt Domino et le Boss Bèlot.'} },

  { id:'cn2', time:'21h30-22h00', start:'2130', room:'bal', cat:'Chante', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:"Ralphy, Takadoum, Stella, Rita (Zil'Oka)",img:'images/artists/ziloka.png',illo:true}],
    en:{t:'Chanté Nwèl · Part 2', d:"The second half of the Chanté Nwèl carols. Ralphy, Takadoum, Stella and Rita invite you to Chanté Nwèl: Caribbean Christmas songs celebrating the joy, tradition and festive spirit of Martinique, Guadeloupe and French Guiana. Expect contagious rhythms, voices at full power and pure joie de vivre."},
    fr:{t:'Chanté Nwèl · 2ème partie', d:"La seconde partie des cantiques du Chanté Nwèl. Ralphy, Takadoum, Stella et Rita vous invitent au Chanté Nwèl : des chants de Noël caribéens qui célèbrent la joie, la tradition et l'esprit festif de la Martinique, de la Guadeloupe et de la Guyane. Au programme : des rythmes contagieux, des voix à pleine puissance et une vraie joie de vivre."} },

  { id:'after', time:'22h00-23h00', start:'2200', room:'bal', cat:'DJ', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'DJ Djahman',img:'images/artists/djahman.png'},{n:'DJ Dymenss',img:'images/artists/dymenss.png',zoom:2.2,origin:'45% 6%'}],
    en:{t:'Afterparty · DJ Djahman &amp; DJ Dymenss', d:'The afterparty with DJ Djahman and DJ Dymenss · zouk, konpa and island sounds until doors close.'},
    fr:{t:'Afterparty · DJ Djahman &amp; DJ Dymenss', d:"L'afterparty avec DJ Djahman et DJ Dymenss · zouk, konpa et sons des îles jusqu'à la fermeture."} },

  // ---------- Back room · La Cour ----------
  { id:'accras', time:'12h30-13h30', start:'1230', room:'cour', cat:'Workshop', tag:'Cooking', addon:'book', price:'£3', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Valerie',img:'images/gallery/accras-flyer.png',illo:true}],
    en:{t:'Accras workshop with Valerie', d:'Learn to make accras de morue, the classic French Caribbean cod fritters, with Valerie. Limited places.'},
    fr:{t:'Atelier Accras avec Valerie', d:"Apprenez à préparer les accras de morue, les beignets antillais par excellence, avec Valerie. Places limitées."} },

  { id:'volcano', time:'13h30-14h30', start:'1330', room:'cour', cat:'Kids', tag:'Craft', addon:'book', price:'free', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Shinead',img:'images/artists/shinead.png'}],
    en:{t:'Volcano workshop with Shinead', d:"Build your own erupting volcano and discover the story of the islands' two great mountains, La Soufrière (Guadeloupe) and Mount Pelée (Martinique), with Shinead. Ages 5-12. Free, booking required. An adult must stay with the children."},
    fr:{t:'Atelier volcan avec Shinead', d:"Fabrique ton volcan en éruption et découvre l'histoire des deux grandes montagnes des îles, La Soufrière (Guadeloupe) et la Montagne Pelée (Martinique), avec Shinead. 5-12 ans. Gratuit, sur réservation. Un adulte doit accompagner les enfants."} },

  { id:'grotto', time:'14h00-18h45', start:'1400', room:'cour', cat:'Kids', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Père Nwèl',img:'images/illustrations/pere-nwel.png',illo:true}],
    en:{t:"Père Nwèl's grotto", d:"Come and meet Père Nwèl in his grotto, through the afternoon."},
    fr:{t:'La grotte du Père Nwèl', d:"Venez rencontrer le Père Nwèl dans sa grotte, tout l'après-midi."} },

  { id:'kidoka1', time:'14h30-15h00', start:'1430', room:'cour', cat:'Kids', addon:'book', price:'free', inAgenda:true, inGrid:true, people:[{n:'Ralphy, Jerry, Stella',img:'images/illustrations/kidoka.png'}],
    en:{t:'KIDOKA drumming · Under 5s', d:"KIDOKA, Zil'Oka's kids programme, invites little ones to discover Caribbean rhythm and percussion through play. Parents are welcome and encouraged to join in! Free, booking required."},
    fr:{t:'Percussions KIDOKA · moins de 5 ans', d:"KIDOKA, le programme enfants de Zil'Oka, invite les tout-petits à découvrir de façon ludique le rythme et la percussion caribéenne. Les parents sont les bienvenus et encouragés à participer ! Gratuit, sur réservation."} },

  { id:'kidoka2', time:'15h00-15h30', start:'1500', room:'cour', cat:'Kids', addon:'book', price:'free', inAgenda:true, inGrid:true, people:[{n:'Ralphy, Jerry, Stella',img:'images/illustrations/kidoka2.png'}],
    en:{t:'KIDOKA drumming · 5-12s', d:'KIDOKA presents an interactive percussion workshop exploring the rhythms and songs of the French Caribbean islands. Free, booking required.'},
    fr:{t:'Percussions KIDOKA · 5-12 ans', d:'KIDOKA présente un atelier interactif de percussion, explorant le rythme et les chants inspirés des îles de la Caraïbe française. Gratuit, sur réservation.'} },

  { id:'madras', time:'16h00-17h00', start:'1600', room:'cour', cat:'Workshop', tag:'Craft', addon:'book', price:'£3', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Jade',img:'images/artists/jade.png'}],
    en:{t:'The Story of Madras with Jade', d:'Discover how the iconic madras fabric has carried French Caribbean heritage across generations, then make your own mini madras canvas to keep or gift. 1 hour. Limited places.'},
    fr:{t:"L'histoire du madras avec Jade", d:"Découvrez comment le tissu madras emblématique a transmis l'héritage antillais de génération en génération, puis créez votre mini toile en madras à garder ou à offrir. 1 heure. Places limitées."} },

  // ---------- Game zone & sorbet ----------
  { id:'dominoes', time:'14h30-17h00', start:'1430', room:'game', cat:'Tournament', addon:'book', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Noula team',img:'images/illustrations/dominoes.png',illo:true}],
    en:{t:'Dominoes tournament', d:'The classic French Caribbean domino table, in a friendly tournament in the game zone. The champion is crowned Mèt Domino at the interval. Limited places.'},
    fr:{t:'Tournoi de dominos', d:"Le domino antillais, en tournoi convivial dans l'espace jeux. Le vainqueur est couronné Mèt Domino pendant l'interlude. Places limitées."} },

  { id:'belote', time:'14h30-17h00', start:'1430', room:'game', cat:'Tournament', addon:'book', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Noula team',img:'images/illustrations/belote.png',illo:true}],
    en:{t:'Belote tournament', d:'The belote card game in pairs, in a friendly tournament in the game zone. The winning pair is crowned Boss Bèlot at the interval. Limited places.'},
    fr:{t:'Tournoi de belote', d:"La belote en duo, en tournoi convivial dans l'espace jeux. Le duo vainqueur est couronné Boss Bèlot pendant l'interlude. Places limitées."} },

  { id:'sorbet', time:'15h00-19h00', start:'1500', room:'game', cat:'Kids', addon:'dropin', inAgenda:true, inGrid:true, people:[{n:'Mister Fritz',img:'images/illustrations/sorbet.png'}],
    en:{t:'Sorbet coco corner with Mister Fritz', d:'From 15h00, the sorbet coco corner with Mister Fritz. Until 19h00, kids can turn the sorbetière and earn a mini sorbet. Photo-op magnet.'},
    fr:{t:'Le coin sorbet coco avec Mister Fritz', d:"Dès 15h00, le coin sorbet coco avec Mister Fritz. Jusqu'à 19h00, les enfants tournent la sorbetière et gagnent un mini sorbet. Moment photo garanti."} }
];
