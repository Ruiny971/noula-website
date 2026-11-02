# Noula website fix pass · 2026-11-02 15:20

Built from current `main` (2 Nov, after the programme + uploads ZIP was merged). Paths mirror the repo root. Replace the matching files.

## Pages (all 13 html files)
Every page: one shared footer (Home · Noula Day · What's on · Agenda · Directory · Get Involved · About · Contact · Privacy notice, email, Instagram @noula_charity, charity no. 1210134; "Manage cookies" is still added by analytics.js). Header logo now `logo-256.jpg`. Top strip has a short mobile line ("28 Nov · Noula Day · Book →"). Directory pin in nav has `alt=""`. og:image → 1200x630 banner with width/height tags.

- `index.html` · Where → Montgomery Hall, Kennington SE11; "in Kennington" (EN + FR); 2026 card "at Montgomery Hall, Kennington"; line-up slider cut-outs contain + bottom; gallery host/table photos `object-position:50% 30%`; newsletter small print + privacy line cream 85% (readable); flyer lightbox lazy.
- `noula-day.html` · Where, eyebrow "A French Caribbean day in South London" / "dans le sud de Londres", tickets block full address, meta description, JSON-LD location (Montgomery Hall, 58 Kennington Oval, London, SE11 5SR, GB). Hero slideshow + artist cards: cut-outs contain + bottom + 6% top padding; name overlay gradient starts lower.
- `events.html` · Noula Day card + JSON-LD venue fixed; prices "Under 5s free · Under 12s pay what you like" / "Gratuit pour les moins de 5 ans · Prix libre pour les moins de 12 ans". Chanté Nwèl 2025 card unchanged.
- `partners.html` · venue → Montgomery Hall, Kennington; "Kennington, Lambeth and South London" (EN + FR); deadline → "Last few places · apply by 20 November 2026" / "Dernières places · candidatures jusqu'au 20 novembre 2026" (all places + meta + og:description).
- `sponsor.html` · same venue + audience + deadline fixes; venue row "Montgomery Hall · 58 Kennington Oval, London SE11 5SR"; meta.
- `get-involved.html` · "to life in London" / "à Londres".
- `deroule.html` · meta venue; header 12h → 22h30; food card "See the menu and pre-order your dishes" / "Voir le menu et précommander vos plats" → noula-day.html#ndMenuSection.
- `programme-of-the-day.html` · card image area now 4:3 (every card same height); cut-outs contain + bottom, illustrations cover 50% 25%; footer added (page had none).
- `directory.html` · listing images lazy + `onerror` fallback to the monogram tile, so a broken image never shows.
- `about.html`, `contact.html`, `privacy.html`, `volunteer.html` · footer, logo, strip, flags lazy (about).

## Scripts / styles
- `programme-data.js` · afterparty time "22h00" (no end); catering text → menu + pre-order link (EN + FR); Dymenss zoom removed (image now cropped instead).
- `programme-modal.js` · same image rule as the cards; food dish images 4:3 (max 240px), cover centred, lazy.
- `artists-data.js` · `contain` flags removed (all cut-outs use the same rule now).
- `styles.css` · Get Involved pill padding fixed (was overridden to 0 horizontal); mobile header below 900px (compact bar, logo left, EN/FR + burger right, links in a slide-down menu, submenus stacked inside it, no overflow).
- `analytics.js` · adds the burger button to every page's navbar (no markup change needed per page).

## Netlify functions
- `netlify/functions/directory.js` · no longer returns Airtable attachment URLs; returns `/.netlify/functions/directory-image?id=rec…` instead.
- `netlify/functions/directory-image.js` · NEW. Fetches the record, gets a fresh Airtable image URL, returns the image with CDN cache headers. Uses the existing AIRTABLE_TOKEN env var.

## Images
- `logo-256.jpg` · new (header logo, was 2400px)
- `images/NOULA-Day-2026-banner.png` · replaces existing (Montgomery Hall banner, 2160x1080, same filename for the email links)
- `images/NOULA-Day-2026-banner-1200x630.png` · replaces existing (whole banner, plum padding top/bottom, nothing cropped)
- `images/artists/fritz.png` · replaces existing (empty transparent area trimmed so he fills the frame)
- `images/artists/dymenss.png` · replaces existing (cropped head to waist, replaces the CSS zoom)
- `images/artists/jada-mayday.png` · replaces existing (transparent sides trimmed)
- `images/artists/joelle-joyce-slide.png` · replaces existing (empty top trimmed)

## Notes
- fritz.png on main is already a transparent cut-out (not the dark selfie rectangle), so it follows the cut-out rule.
- Search after changes: Brixton / Matthew / SW2 / 5SW / 23h / 30 October / under 12 free → only the Directory form placeholder "Brixton, London" remains (sample listings have no Brixton).
- After deploy: share noula.org.uk/noula-day in WhatsApp to refresh the preview; Facebook may need the Sharing Debugger "Scrape again".
