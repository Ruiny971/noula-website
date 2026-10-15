/* Noula Day 2026 · single source of truth for the day's programme.
 * Both the card grid (programme-of-the-day.html) and the hour-by-hour agenda
 * (deroule.html) render from this one array.
 *
 * Per entry:
 *   time    display time ("12h30-13h30" or "All day")
 *   start   sortable start ("1230"); use "0000" for all-day so they sort first
 *   room    'bal' (Bal Kréol) | 'cour' (La Cour) | null
 *   cat     grid category / filter (Music, Dance, Workshop, Kids, Tournament,
 *           Storytelling, Food, Market, DJ, Chante, Host, Carnival)
 *   addon   'book' | 'preorder' | 'dropin' | null
 *   inAgenda  show in the hour-by-hour agenda (timed items)
 *   inGrid    show as a card in the visual grid
 *   people  [{n, img?, pos?, illo?}]
 *   en/fr   { t: title, d: description }
 */
/* SOFT LAUNCH: clock times hidden from public view. Times stay in the data below.
 * Set to true (mid-November) to show them again on What's on, the Agenda and the modal. */
window.NOULA_SHOW_TIMES = false;
/* SOFT LAUNCH: room names hidden (shown as TBC). Set true when rooms are confirmed. */
window.NOULA_SHOW_ROOMS = false;
/* SOFT LAUNCH: add-on booking (workshops, kids, tournaments, food pre-orders) not open yet.
 * Entry tickets ARE on sale. Set true when add-ons go live on Eventbrite. */
window.NOULA_ADDONS_OPEN = false;
window.noulaRoomLabel = function(room, L){
  if (window.NOULA_SHOW_ROOMS) return ({bal:'Bal Kréol',cour:'La Cour'})[room] || '';
  return L === 'fr' ? 'Salle à annoncer' : 'Room to be announced';
};
window.noulaTimeLabel = function(d, L){
  if (window.NOULA_SHOW_TIMES) return d.time;
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

  // ---------- Daytime · The French Créole Fair ----------
  { id:'doors', time:'12h00', start:'1200', room:'bal', cat:'Host', inAgenda:true, inGrid:false, people:[{n:'Noula team'}],
    en:{t:'Doors open', d:'Doors open, come on in and start your day.'},
    fr:{t:'Ouverture', d:'Ouverture des portes, entrez et commencez la journée.'} },

  { id:'welcome', time:'12h30-12h45', start:'1230', room:'bal', cat:'Host', inAgenda:true, inGrid:false, people:[{n:'Noula host'}],
    en:{t:'Welcome to Noula Day', d:'A short welcome from the Noula team to open the day.'},
    fr:{t:'Bienvenue à Noula Day', d:"Un court mot d'accueil de l'équipe Noula pour ouvrir la journée."} },

  { id:'accras', time:'12h30-13h30', start:'1230', room:'cour', cat:'Workshop', tag:'Cooking', addon:'book', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Valerie',img:'images/gallery/accras-flyer.png',illo:true}],
    en:{t:'Accras workshop with Valerie', d:'Learn to make accras de morue, the classic French Caribbean cod fritters, with Valerie. Limited places.'},
    fr:{t:'Atelier Accras avec Valerie', d:"Apprenez à préparer les accras de morue, les beignets antillais par excellence, avec Valerie. Places limitées."} },

  { id:'volcano', time:'12h30-13h30', start:'1230', room:'cour', cat:'Kids', tag:'Craft', addon:'book', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Shinead',img:'images/artists/shinead.png'}],
    en:{t:'Volcano workshop with Shinead', d:"Build your own erupting volcano and discover the story of the islands' two great mountains, La Soufrière (Guadeloupe) and Mount Pelée (Martinique), with Shinead. Ages 5-12. Free, limited places. An adult must stay with the children. Time to be confirmed."},
    fr:{t:'Atelier volcan avec Shinead', d:"Fabrique ton volcan en éruption et découvre l'histoire des deux grandes montagnes des îles, La Soufrière (Guadeloupe) et la Montagne Pelée (Martinique), avec Shinead. 5-12 ans. Gratuit, places limitées. Un adulte doit accompagner les enfants. Horaire à confirmer."} },

  { id:'blode', time:'14h00-14h15', start:'1400', room:'bal', cat:'Music', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Blodè Prens',img:'images/artists/blode-prens.png'}],
    en:{t:'Blodè Prens', d:'A live set from Haitian reggae artist Blodè Prens: sincere songs about love and faith.'},
    fr:{t:'Blodè Prens', d:"Un live de l'artiste haïtien Blodè Prens : du reggae aux paroles sincères sur l'amour et la foi."} },

  { id:'kompa', time:'14h30-15h30', start:'1430', room:'cour', cat:'Workshop', tag:'Dance', addon:'book', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Zouk Love London',img:'images/zouklove-card.png',illo:true}],
    en:{t:'Konpa class by Zouk Love London', d:"An introduction to Konpa with Zouk Love London. This one-hour class welcomes all levels, including complete beginners. If it's your first time, come along! It's the perfect introduction. Limited places."},
    fr:{t:'Cours de konpa par Zouk Love London', d:"Une initiation au konpa avec Zouk Love London. Ce cours d'une heure est ouvert à tous les niveaux, même aux grands débutants. C'est votre première fois ? Venez, c'est l'occasion idéale pour commencer. Places limitées."} },

  { id:'kidoka1', time:'14h30-15h00', start:'1430', room:'cour', cat:'Kids', addon:'book', inAgenda:true, inGrid:true, people:[{n:'Ralphie, Jerry, Stella',img:'images/illustrations/kidoka.png'}],
    en:{t:'KIDOKA · Under 5s', d:"KIDOKA, Zil'Oka's kids programme, invites little ones to discover Caribbean rhythm and percussion through play. Parents are welcome and encouraged to join in!"},
    fr:{t:'KIDOKA · moins de 5 ans', d:"KIDOKA, le programme enfants de Zil'Oka, invite les tout-petits à découvrir de façon ludique le rythme et la percussion caribéenne. Les parents sont les bienvenus et encouragés à participer !"} },

  { id:'sorbet', time:'14h30-16h30', start:'1430', room:'bal', cat:'Kids', addon:'dropin', inAgenda:true, inGrid:true, people:[{n:'Mister Fritz',img:'images/illustrations/sorbet.png'}],
    en:{t:'Kids sorbet with Mister Fritz', d:'A fun sorbet-making activity for children with Mister Fritz · turn the sorbetière, earn a mini sorbet. Photo-op magnet.'},
    fr:{t:'Sorbet des enfants avec Mister Fritz', d:'Un atelier sorbet ludique pour les enfants avec Mister Fritz · tournez la sorbetière, gagnez un mini sorbet. Moment photo garanti.'} },

  { id:'dominoes', time:'15h00-18h00', start:'1500', room:'bal', cat:'Tournament', addon:'book', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Noula team',img:'images/illustrations/dominoes.png',illo:true}],
    en:{t:'Dominos tournament', d:'The classic French Caribbean domino table, in a friendly tournament in the game corner. Champion crowned Mèt Domino. Limited places.'},
    fr:{t:'Tournoi de dominos', d:'Le domino antillais, en tournoi convivial dans le coin jeux. Le vainqueur est couronné Mèt Domino. Places limitées.'} },

  { id:'belote', time:'15h00-18h00', start:'1500', room:'bal', cat:'Tournament', addon:'book', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Noula team',img:'images/illustrations/belote.png',illo:true}],
    en:{t:'Belote tournament', d:'The belote card game in pairs, in a friendly tournament in the game corner. Winning pair crowned Boss Bèlot. Limited places.'},
    fr:{t:'Tournoi de belote', d:'La belote en duo, en tournoi convivial dans le coin jeux. Le duo vainqueur est couronné Boss Bèlot. Places limitées.'} },

  { id:'charlz', time:'15h30-15h45', start:'1530', room:'bal', cat:'Music', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Charlz',img:'images/artists/charlz.png'}],
    en:{t:'Charlz', d:'A live set from Haitian pop and R&B singer Charlz, who sings in four languages.'},
    fr:{t:'Charlz', d:'Un live du chanteur haïtien pop et R&B Charlz, qui chante en quatre langues.'} },

  { id:'beguine', time:'16h00-17h00', start:'1600', room:'cour', cat:'Workshop', tag:'Dance', addon:'book', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Joyce-Lee & Joëlle',img:'images/artists/joelle-joyce.png'}],
    en:{t:'Biguine Party with Joyce-Lee & Joëlle', d:'The Biguine Party is a festive moment of sharing, discovery and fun around French Caribbean culture! Whether you already know the biguine or want to discover it, come and move to Antillean rhythms, learn, dance and have fun in a warm atmosphere, for all generations. 1 hour. Limited places.'},
    fr:{t:'Biguine Party avec Joyce-Lee & Joëlle', d:"La Biguine Party, c'est un moment festif de partage, de découverte et de convivialité autour de la culture antillaise ! Que vous connaissiez déjà la biguine ou souhaitiez la découvrir, venez bouger sur les rythmes antillais, apprendre, danser et vous amuser dans une ambiance chaleureuse, toutes générations confondues ! 1 heure. Places limitées."} },

  { id:'kidoka2', time:'16h30-17h00', start:'1630', room:'cour', cat:'Kids', addon:'book', inAgenda:true, inGrid:true, people:[{n:'Ralphie, Jerry, Stella',img:'images/illustrations/kidoka2.png'}],
    en:{t:'KIDOKA · 5-12s', d:'KIDOKA presents an interactive percussion workshop exploring the rhythms and songs of the French Caribbean islands.'},
    fr:{t:'KIDOKA · 5-12 ans', d:'KIDOKA présente un atelier interactif de percussion, explorant le rythme et les chants inspirés des îles de la Caraïbe française.'} },

  { id:'madras', time:'16h30-17h15', start:'1630', room:'cour', cat:'Workshop', tag:'Craft', addon:'book', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Jade',img:'images/artists/jade.png'}],
    en:{t:'The Story of Madras with Jade', d:'Discover how the iconic madras fabric has carried French Caribbean heritage across generations, then make your own mini madras canvas to keep or gift. 45 minutes. Limited places.'},
    fr:{t:"L'histoire du madras avec Jade", d:"Découvrez comment le tissu madras emblématique a transmis l'héritage antillais de génération en génération, puis créez votre mini toile en madras à garder ou à offrir. 45 minutes. Places limitées."} },

  { id:'tales', time:'16h30-17h00', start:'1630', room:'bal', cat:'Storytelling', addon:'dropin', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Ralphie',img:'images/artists/ralphy.png'}],
    en:{t:'Créole tales with Ralphie', d:'Ralphie is a drummer, storyteller and passionate keeper of Caribbean traditions from Martinique, Guadeloupe and French Guiana. With contagious energy and a deep love of working with young people, he brings rhythm, culture and joy to every gathering.'},
    fr:{t:'Contes créoles avec Ralphie', d:'Ralphie est batteur, conteur et gardien passionné des traditions caribéennes de Martinique, de Guadeloupe et de Guyane. Avec une énergie contagieuse et un amour profond du travail avec les jeunes, il apporte rythme, culture et joie à chaque rassemblement.'} },

  { id:'zoukkaraoke', time:'17h45-18h30', start:'1745', room:'bal', cat:'Music', tag:'Dance', addon:'dropin', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Zouk Love London',img:'images/illustrations/zouk-karaoke.png',illo:true}],
    en:{t:'Zouk Karaoke by Zouk Love London', d:'A zouk karaoke warm-up with Zouk Love London, leading into the evening. Come and sing your favourite zouk songs, solo or with friends, or simply join the crowd and enjoy the music. Everyone is welcome!'},
    fr:{t:'Karaoké zouk par Zouk Love London', d:'Un karaoké zouk avec Zouk Love London pour lancer la soirée. Venez chanter vos zouks préférés, seul ou entre amis, ou profitez simplement de l\'ambiance. Tout le monde est bienvenu !'} },

  // ---------- Evening · Chanté Nwèl & afterparty ----------
  { id:'catwalk', time:'18h45-19h15', start:'1845', room:'bal', cat:'Carnival', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'UKM',img:'images/artists/ukm.png',illo:true}],
    en:{t:'UKM carnival catwalk', d:"A carnival costume catwalk by United Kreyol Mas · models walk to Djahman's music, madras + carnival costumes in full effect, right before the Chanté Nwèl."},
    fr:{t:'Défilé carnaval UKM', d:"Un défilé de costumes de carnaval par United Kreyol Mas · les mannequins défilent sur la musique de Djahman, madras + costumes de carnaval en pleine lumière, juste avant le Chanté Nwèl."} },

  { id:'cn1', time:'19h15-20h00', start:'1915', room:'bal', cat:'Chante', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:"Ralphie, Takadoum, Stella, Rita (Zil'Oka)",img:'images/artists/ziloka.png',illo:true}],
    en:{t:'Chanté Nwèl · Part 1', d:"The first half of the Chanté Nwèl carols, opened by the Père Nwèl Antillais entrance. Ralphie, Takadoum, Stella and Rita invite you to Chanté Nwèl: Caribbean Christmas songs celebrating the joy, tradition and festive spirit of Martinique, Guadeloupe and French Guiana. Expect contagious rhythms, voices at full power and pure joie de vivre."},
    fr:{t:'Chanté Nwèl · 1ère partie', d:"La première partie du Chanté Nwèl, ouverte par l'entrée du Père Nwèl Antillais. Ralphie, Takadoum, Stella et Rita vous invitent au Chanté Nwèl : des chants de Noël caribéens qui célèbrent la joie, la tradition et l'esprit festif de la Martinique, de la Guadeloupe et de la Guyane. Au programme : des rythmes contagieux, des voix à pleine puissance et une vraie joie de vivre."} },

  { id:'interval', time:'20h00-20h15', start:'2000', room:'bal', cat:'Host', inAgenda:true, inGrid:true, people:[{n:'Noula team'}],
    en:{t:'Interval · Tombola & Prize-giving', d:'A festive break with the tombola draw and the prize-giving ceremony for the dominos and belote winners (Mèt Domino + Boss Bèlot).'},
    fr:{t:'Interlude · Tombola & remise des prix', d:'Une pause festive avec le tirage de la tombola et la remise des prix pour les vainqueurs de dominos et de belote (Mèt Domino + Boss Bèlot).'} },

  { id:'cn2', time:'20h15-21h00', start:'2015', room:'bal', cat:'Chante', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:"Ralphie, Takadoum, Stella, Rita (Zil'Oka)",img:'images/artists/ziloka.png',illo:true}],
    en:{t:'Chanté Nwèl · Part 2', d:"The second half of the Chanté Nwèl carols. Ralphie, Takadoum, Stella and Rita invite you to Chanté Nwèl: Caribbean Christmas songs celebrating the joy, tradition and festive spirit of Martinique, Guadeloupe and French Guiana. Expect contagious rhythms, voices at full power and pure joie de vivre."},
    fr:{t:'Chanté Nwèl · 2ème partie', d:"La seconde partie des cantiques du Chanté Nwèl. Ralphie, Takadoum, Stella et Rita vous invitent au Chanté Nwèl : des chants de Noël caribéens qui célèbrent la joie, la tradition et l'esprit festif de la Martinique, de la Guadeloupe et de la Guyane. Au programme : des rythmes contagieux, des voix à pleine puissance et une vraie joie de vivre."} },

  { id:'after', time:'21h00-22h30', start:'2100', room:'bal', cat:'DJ', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'DJ Djahman',img:'images/artists/djahman.png'}],
    en:{t:'Afterparty · DJ Djahman', d:'The afterparty, mixed by DJ Djahman · zouk, konpa and island sounds until doors close.'},
    fr:{t:'Afterparty · DJ Djahman', d:"L'afterparty, mixée par DJ Djahman · zouk, konpa et sons des îles jusqu'à la fermeture."} }
];
