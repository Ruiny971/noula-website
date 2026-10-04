/* Shared Noula Day 2026 line-up.
   Single source of truth for BOTH the homepage carousel (index.html)
   and the Noula Day hero slideshow (noula-day.html).
   Edit here once and both pages stay in sync.
   - id .......... matches the programme-modal entry (noula-day opens it on click)
   - roleEn/Fr ... short caption used on the Noula Day slideshow
   - catEn/Fr .... eyebrow category shown on the homepage carousel
   - roleDetailEn/Fr / bioEn/Fr ... optional, only shown on the homepage carousel
   - contain ..... true = fit the photo inside the frame instead of cropping */
window.NOULA_LINEUP = [
  {
    id: 'blode', img: 'images/artists/blode-prens.png', name: 'Blodè Prens',
    catEn: 'Singer', catFr: 'Chanteur',
    roleEn: 'Singer', roleFr: 'Chanteur',
    roleDetailEn: 'Vocals &amp; guitar', roleDetailFr: 'Chant &amp; guitare',
    bioEn: '“A Haitian artist whose music is steeped in emotion and hope. Music touches the soul and stirs the heart, so I chose love and faith, through my songs, to share my story.”',
    bioFr: '« Artiste haïtien dont la musique est empreinte d\'émotion et d\'espoir. La musique touche l\'âme et fait vibrer les cœurs, alors j\'ai choisi l\'amour et la foi, à travers mes chansons, pour partager mon histoire. »'
  },
  {
    id: 'charlz', img: 'images/artists/charlz.png', name: 'Charlz',
    catEn: 'Singer', catFr: 'Chanteur',
    roleEn: 'Singer', roleFr: 'Chanteur',
    roleDetailEn: 'Vocals', roleDetailFr: 'Chant',
    bioEn: '“A Haitian singer passionate about bringing emotion. I sing in four different languages, blending diverse sounds and influences.”',
    bioFr: '« Chanteur haïtien passionné par la transmission de l\'émotion. Je chante en quatre langues différentes, mêlant sons et influences variés. »'
  },
  {
    id: 'beguine', img: 'images/artists/joelle-joyce-slide.png', name: 'Joëlle & Joyce',
    catEn: 'Workshop', catFr: 'Atelier',
    roleEn: 'Biguine initiation', roleFr: 'Initiation biguine'
  },
  {
    id: 'tales', img: 'images/artists/ralphy.png', name: 'Ralphy',
    catEn: 'Storytelling', catFr: 'Contes',
    roleEn: 'Storytelling for kids', roleFr: 'Contes pour enfants'
  },
  {
    id: 'madras', img: 'images/artists/jade.png', name: 'Jade',
    catEn: 'Workshop', catFr: 'Atelier',
    roleEn: 'The Story of Madras', roleFr: 'L’histoire du madras',
    roleDetailEn: 'The Story of Madras', roleDetailFr: 'L’histoire du madras',
    bioEn: '“Explore the history and cultural significance of madras in the French Caribbean, and how this vibrant fabric has carried stories of heritage, identity and belonging across generations. After a short introduction, make your own mini madras canvas to keep or gift.”',
    bioFr: '« Découvrez l\'histoire et la signification du madras dans les Antilles, et comment ce tissu éclatant a porté des histoires d\'héritage, d\'identité et d\'appartenance de génération en génération. Après une courte introduction, créez votre mini toile en madras à garder ou à offrir. »'
  },
  {
    id: 'volcano', img: 'images/artists/shinead.png', name: 'Shinead',
    catEn: 'Workshop', catFr: 'Atelier',
    roleEn: 'Volcano workshop', roleFr: 'Atelier volcan',
    roleDetailEn: 'Build your own volcano', roleDetailFr: 'Fabrique ton volcan', contain: true
  },
  {
    id: 'sorbet', img: 'images/artists/fritz.png', name: 'Fritz',
    catEn: 'Workshop', catFr: 'Atelier',
    roleEn: 'Kids sorbet', roleFr: 'Sorbet des enfants',
    roleDetailEn: 'Kids sorbet making', roleDetailFr: 'Atelier sorbet des enfants'
  },
  {
    id: 'catwalk', img: 'images/artists/ukm.png', name: 'UKM',
    catEn: 'Carnival', catFr: 'Carnaval',
    roleEn: 'Carnival catwalk', roleFr: 'Défilé carnaval', contain: true
  },
  {
    id: 'after', img: 'images/artists/djahman.png', name: 'DJ Djahman',
    catEn: 'DJ', catFr: 'DJ',
    roleEn: 'DJ · Afterparty', roleFr: 'DJ · Afterparty'
  },
  {
    id: 'cn1', img: 'images/artists/ziloka.png', name: 'Ziloka',
    catEn: 'Chanté Nwèl', catFr: 'Chanté Nwèl',
    roleEn: 'Chanté Nwèl', roleFr: 'Chanté Nwèl'
  }
];
