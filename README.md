# Noula Charity Website

A modern, warm, and welcoming website for Noula - a UK charity promoting French Caribbean heritage.

## Quick Start

### View the Site Locally

1. Open `index.html` in your web browser
2. Click through the pages to preview the full site

That's it! No build process, no dependencies needed.

### Deploy to Netlify

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for complete instructions.

**Quick version:**
1. Push this folder to GitHub
2. Connect your GitHub repo to Netlify at [netlify.com](https://netlify.com)
3. Custom domain `noula.org.uk` can be configured in Netlify dashboard

## Site Pages

- **index.html** — Home page with events preview
- **events.html** — Full STAFE 2026 programme (3 events with Eventbrite links)
- **about.html** — Charity information and mission

## What's Included

- Complete responsive design (mobile, tablet, desktop)
- Caribbean-inspired colour palette with Madras pattern accents
- Google Fonts integration (Playfair Display + Inter)
- Sticky navigation bar
- Event cards with Eventbrite links
- Footer with charity info and social links
- Email contact links
- Instagram integration

## Key Features

✓ **Static Site** — Pure HTML/CSS/JavaScript, no frameworks  
✓ **Fast** — Loads in under 1 second  
✓ **Mobile-Friendly** — Perfect for Instagram link-in-bio  
✓ **Accessible** — Semantic HTML, good contrast, keyboard navigable  
✓ **Netlify Ready** — Includes netlify.toml and _redirects  
✓ **SEO Optimized** — Meta tags, semantic markup  

## Customization

### Change Colours
Edit `:root` variables in `styles.css`:
```css
--coral: #E8724F;
--emerald: #2D7961;
--gold: #D4AF37;
```

### Add Your Logo
1. Place logo in `assets/logo.png` (create assets folder)
2. Replace SVG in nav with `<img src="assets/logo.png">`

### Update Event Details
Edit event cards in `events.html` or `index.html`

### Change Contact Email
Replace `hello@noula.org.uk` throughout (use Find & Replace)

## Files

```
website/
├── index.html              # Home
├── events.html             # Programme
├── about.html              # About us
├── styles.css              # All styling
├── netlify.toml            # Netlify config
├── _redirects              # URL rewrites
├── README.md               # This file
└── DEPLOYMENT_GUIDE.md     # Detailed deployment instructions
```

## Browser Support

Works on all modern browsers:
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS, Android)
- Internet Explorer not supported (outdated)

## Deployment

### Option 1: Netlify (Recommended)
- Free hosting with automatic SSL
- Custom domain support
- Automatic deployments from GitHub
- See DEPLOYMENT_GUIDE.md for setup

### Option 2: Any Static Host
- GitHub Pages
- Vercel
- Cloudflare Pages
- AWS S3 + CloudFront
- Your own server

## Events & Links

The site includes links to three STAFE 2026 events:

1. **La Soufrière & Montagne Pelée Volcano Workshop**
   - Date: Saturday, 26 April 2026
   - Format: Online, Free
   - Hosted by: Shinead (age 9)
   - Register: Eventbrite link included

2. **Acras de Morue Caribbean Cooking Demo**
   - Date: Wednesday, 27 May 2026
   - Format: Online
   - Register: Eventbrite link included

3. **French Caribbean Cultural Showcase**
   - Date: Friday, 27 June 2026
   - Format: In-Person
   - Register: Eventbrite link included

## Contact

- **Email**: hello@noula.org.uk
- **Instagram**: @noula_charity
- **Charity Number**: 1210134

## License

© 2026 Noula - French Caribbean Heritage Promotion Foundation

---

**Ready to deploy?** See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
