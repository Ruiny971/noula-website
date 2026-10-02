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
    en:{t:'Noula kitchen · French Caribbean catering', d:'Traditional French Caribbean dishes served through the day. Full menu published closer to the event. Dishes can be pre-ordered as an add-on when you book on Eventbrite.'},
    fr:{t:'Cuisine Noula · traiteur antillais', d:"Des plats antillais traditionnels servis toute la journée. Menu complet publié plus près de l'événement. Les plats peuvent être précommandés en option lors de votre réservation sur Eventbrite."} },
  { id:'market', time:'All day', start:'0000', room:'cour', cat:'Market', inAgenda:false, inGrid:true, people:[{n:'Noula team',img:'images/illustrations/makers-market.png'}],
    en:{t:"French Caribbean makers' market", d:'A marketplace of French Caribbean makers, crafts, food and community stalls, spread across Bal Kréol and La Cour, open right through the day.'},
    fr:{t:'Marché des créateurs antillais', d:"Un marché de créateurs antillais, artisanat, cuisine et stands communautaires, réparti entre Bal Kréol et La Cour, ouvert toute la journée."} },
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
    en:{t:'Accras workshop with Valerie', d:'Learn to make accras de morue, the classic French Caribbean cod fritters, with Valerie. Held in the kitchen. Limited places, pre-book as an add-on.'},
    fr:{t:'Atelier Accras avec Valerie', d:"Apprenez à préparer les accras de morue, les beignets antillais par excellence, avec Valerie. En cuisine. Places limitées, réservez en option."} },

  { id:'volcano', time:'12h30-13h30', start:'1230', room:'cour', cat:'Kids', tag:'Craft', addon:'book', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Shinead',img:'images/artists/shinead.png'}],
    en:{t:'Volcano workshop with Shinead', d:"Build your own erupting volcano and discover the story of the islands' two great mountains, La Soufrière (Guadeloupe) and Mount Pelée (Martinique), with Shinead. Ages 5-12. Free · book a ticket on Eventbrite. An adult must stay with the children. Time to be confirmed."},
    fr:{t:'Atelier volcan avec Shinead', d:"Fabrique ton volcan en éruption et découvre l'histoire des deux grandes montagnes des îles, La Soufrière (Guadeloupe) et la Montagne Pelée (Martinique), avec Shinead. 5-12 ans. Gratuit · réservez un billet sur Eventbrite. Un adulte doit accompagner les enfants. Horaire à confirmer."} },

  { id:'blode', time:'14h00-14h15', start:'1400', room:'bal', cat:'Music', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Blodè Prens',img:'images/artists/blode-prens.png'}],
    en:{t:'Blodè Prens', d:'A live set from Haitian singer Blodè Prens, opening the afternoon on the Bal Kréol stage.'},
    fr:{t:'Blodè Prens', d:"Un concert du chanteur haïtien Blodè Prens, ouvrant l'après-midi sur la scène Bal Kréol."} },

  { id:'kompa', time:'14h30-15h30', start:'1430', room:'cour', cat:'Workshop', tag:'Dance', addon:'book', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Lina',img:'images/zouklove-card.png',illo:true}],
    en:{t:'Kompa class by Zouk Love London', d:'Learn the steps of kompa with Lina of Zouk Love London. 1 hour, all levels welcome. Wear comfortable shoes. Limited places, pre-book.'},
    fr:{t:'Cours de kompa par Zouk Love London', d:'Apprenez les pas du kompa avec Lina de Zouk Love London. 1 heure, tous niveaux bienvenus. Portez des chaussures confortables. Places limitées, réservez.'} },

  { id:'kidoka1', time:'14h30-15h00', start:'1430', room:'cour', cat:'Kids', addon:'book', inAgenda:true, inGrid:true, people:[{n:'Ziloka',img:'images/illustrations/kidoka.png'}],
    en:{t:'KIDOKA · Under 5s', d:'A gentle Ka drumming and rhythm session for the under 5s with Ziloka.'},
    fr:{t:'KIDOKA · moins de 5 ans', d:'Une séance de tambour Ka et de rythme en douceur pour les moins de 5 ans avec Ziloka.'} },

  { id:'sorbet', time:'14h30-16h30', start:'1430', room:'bal', cat:'Kids', addon:'dropin', inAgenda:true, inGrid:true, people:[{n:'Fritz',img:'images/illustrations/sorbet.png'}],
    en:{t:'Kids sorbet with Fritz', d:'A fun sorbet-making activity for children with Fritz, right in the Bal Kréol · turn the sorbetière, earn a mini sorbet. Photo-op magnet.'},
    fr:{t:'Sorbet des enfants avec Fritz', d:'Un atelier sorbet ludique pour les enfants avec Fritz, au cœur du Bal Kréol · tournez la sorbetière, gagnez un mini sorbet. Moment photo garanti.'} },

  { id:'dominoes', time:'15h00-18h00', start:'1500', room:'bal', cat:'Tournament', addon:'book', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Noula team',img:'images/illustrations/dominoes.png',illo:true}],
    en:{t:'Dominos tournament', d:'The classic French Caribbean domino table, in a friendly tournament in the Bal Kréol game corner. Champion crowned Mèt Domino. Limited places, enter as an add-on.'},
    fr:{t:'Tournoi de dominos', d:'Le domino antillais, en tournoi convivial dans le coin jeux du Bal Kréol. Le vainqueur est couronné Mèt Domino. Places limitées, inscrivez-vous en option.'} },

  { id:'belote', time:'15h00-18h00', start:'1500', room:'bal', cat:'Tournament', addon:'book', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Noula team',img:'images/illustrations/belote.png',illo:true}],
    en:{t:'Belote tournament', d:'The belote card game in pairs, in a friendly tournament in the Bal Kréol game corner. Winning pair crowned Boss Bèlot. Limited places, enter as an add-on.'},
    fr:{t:'Tournoi de belote', d:'La belote en duo, en tournoi convivial dans le coin jeux du Bal Kréol. Le duo vainqueur est couronné Boss Bèlot. Places limitées, inscrivez-vous en option.'} },

  { id:'charlz', time:'15h30-15h45', start:'1530', room:'bal', cat:'Music', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Charlz',img:'images/artists/charlz.png'}],
    en:{t:'Charlz', d:'A live set from Haitian singer Charlz, who sings in four languages.'},
    fr:{t:'Charlz', d:'Un concert du chanteur haïtien Charlz, qui chante en quatre langues.'} },

  { id:'beguine', time:'16h00-17h00', start:'1600', room:'cour', cat:'Workshop', tag:'Dance', addon:'book', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Joëlle & Joyce',img:'images/artists/joelle-joyce.png'}],
    en:{t:'Biguine initiation with Joëlle & Joyce', d:'Learn the steps of the biguine with Joëlle and Joyce of Association J.C.P.C. 1 hour, all levels welcome. Limited places, pre-book.'},
    fr:{t:'Initiation Biguine avec Joëlle & Joyce', d:"Apprenez les pas de la biguine avec Joëlle et Joyce de l'Association J.C.P.C. 1 heure, tous niveaux bienvenus. Places limitées, réservez."} },

  { id:'kidoka2', time:'16h30-17h00', start:'1630', room:'cour', cat:'Kids', addon:'book', inAgenda:true, inGrid:true, people:[{n:'Ziloka',img:'images/illustrations/kidoka2.png'}],
    en:{t:'KIDOKA · 5-12s', d:'A Ka drumming and rhythm session for 5 to 12 year olds with Ziloka.'},
    fr:{t:'KIDOKA · 5-12 ans', d:'Une séance de tambour Ka et de rythme pour les 5-12 ans avec Ziloka.'} },

  { id:'madras', time:'16h30-17h15', start:'1630', room:'cour', cat:'Workshop', tag:'Craft', addon:'book', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Jade',img:'images/artists/jade.png'}],
    en:{t:'The Story of Madras with Jade', d:'Discover how the iconic madras fabric has carried French Caribbean heritage across generations, then make your own mini madras canvas to keep or gift. 45 minutes. Limited places, pre-book as an add-on.'},
    fr:{t:"L'histoire du madras avec Jade", d:"Découvrez comment le tissu madras emblématique a transmis l'héritage antillais de génération en génération, puis créez votre mini toile en madras à garder ou à offrir. 45 minutes. Places limitées, réservez en option."} },

  { id:'tales', time:'16h30-17h00', start:'1630', room:'bal', cat:'Storytelling', addon:'dropin', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Ralphy',img:'images/artists/ralphy.png'}],
    en:{t:'Créole tales with Ralphy', d:'A moment of créole storytelling with Ralphy on the Bal Kréol stage.'},
    fr:{t:'Contes créoles avec Ralphy', d:'Un moment de contes créoles avec Ralphy sur la scène Bal Kréol.'} },

  { id:'zoukkaraoke', time:'17h45-18h30', start:'1745', room:'bal', cat:'Music', tag:'Dance', addon:'dropin', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Lina',img:'images/zouklove-card.png',illo:true}],
    en:{t:'Zouk Karaoke with Lina', d:'A zouk karaoke warm-up with Lina of Zouk Love London, leading into the evening.'},
    fr:{t:'Karaoké Zouk avec Lina', d:'Un échauffement karaoké zouk avec Lina de Zouk Love London, pour entrer dans la soirée.'} },

  // ---------- Evening · Chanté Nwèl & afterparty ----------
  { id:'camille', time:'18h30-18h45', start:'1830', room:'bal', cat:'Music', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Camille',img:'images/artists/camille.png'}],
    en:{t:'Camille · live warm-up', d:'A gentle live set from Camille to open the evening, setting the mood before the catwalk and Chanté Nwèl.'},
    fr:{t:'Camille · échauffement live', d:'Un set live tout en douceur de Camille pour ouvrir la soirée, avant le défilé et le Chanté Nwèl.'} },

  { id:'catwalk', time:'18h45-19h15', start:'1845', room:'bal', cat:'Carnival', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'UKM',img:'images/artists/ukm.png',illo:true}],
    en:{t:'UKM carnival catwalk', d:"A carnival costume catwalk by United Kreyol Mas, in the Bal Kréol · models walk to Djahman's music, madras + carnival costumes in full effect, right before the Chanté Nwèl."},
    fr:{t:'Défilé carnaval UKM', d:"Un défilé de costumes de carnaval par United Kreyol Mas, dans le Bal Kréol · les mannequins défilent sur la musique de Djahman, madras + costumes de carnaval en pleine lumière, juste avant le Chanté Nwèl."} },

  { id:'cn1', time:'19h15-20h00', start:'1915', room:'bal', cat:'Chante', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Ziloka',img:'images/artists/ziloka.png',illo:true}],
    en:{t:'Chanté Nwèl · Part 1', d:'The first half of the Chanté Nwèl carols, opened by the Père Nwèl Antillais entrance.'},
    fr:{t:'Chanté Nwèl · 1ère partie', d:"La première partie du Chanté Nwèl, ouverte par l'entrée du Père Nwèl Antillais."} },

  { id:'interval', time:'20h00-20h15', start:'2000', room:'bal', cat:'Host', inAgenda:true, inGrid:true, people:[{n:'Noula team'}],
    en:{t:'Interval · Tombola & Prize-giving', d:'A festive break with the tombola draw and the prize-giving ceremony for the dominos and belote winners (Mèt Domino + Boss Bèlot).'},
    fr:{t:'Interlude · Tombola & remise des prix', d:'Une pause festive avec le tirage de la tombola et la remise des prix pour les vainqueurs de dominos et de belote (Mèt Domino + Boss Bèlot).'} },

  { id:'cn2', time:'20h15-21h00', start:'2015', room:'bal', cat:'Chante', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'Ziloka',img:'images/artists/ziloka.png',illo:true}],
    en:{t:'Chanté Nwèl · Part 2', d:'The second half of the Chanté Nwèl carols.'},
    fr:{t:'Chanté Nwèl · 2ème partie', d:'La seconde partie des cantiques du Chanté Nwèl.'} },

  { id:'after', time:'21h00-22h30', start:'2100', room:'bal', cat:'DJ', madrasBg:true, inAgenda:true, inGrid:true, people:[{n:'DJ Djahman',img:'images/artists/djahman.png'}],
    en:{t:'Afterparty · DJ Djahman', d:'The afterparty, mixed by DJ Djahman · zouk, kompa and island sounds until doors close at 22h30.'},
    fr:{t:'Afterparty · DJ Djahman', d:"L'afterparty, mixée par DJ Djahman · zouk, kompa et sons des îles jusqu'à la fermeture à 22h30."} }
];
