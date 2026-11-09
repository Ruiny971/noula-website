# Noula website · image weight pass + Callmeludo headliner · 2026-11-07 16:30

Built from current `main`. Paths mirror the repo root. ONE deploy.

**9 Nov update:** Callmeludo teaser now links to his Instagram post https://www.instagram.com/callmeludo/p/DfckZCtRYnE/ (`noula-day.html` poster frame + `programme-of-the-day.html` "Watch the teaser" button). Poster frame: cream play button with plum triangle, caption under it EN/FR, new alt text. No video anywhere. **Delete from the repo if present:** `teaser.js`, `images/callmeludo-teaser.mp4`, `images/callmeludo-teaser-poster.jpg` (no page references them any more).

## Why
Netlify paused the site (usage limit). Pages loaded 15 to 35 MB of images. All images are now WebP, resized to the size they are shown at.

## Text files (all replace existing)
- All 13 pages (`index`, `noula-day`, `programme-of-the-day`, `deroule`, `events`, `about`, `contact`, `directory`, `get-involved`, `partners`, `privacy`, `sponsor`, `volunteer`) · image refs .png/.jpg → .webp, og:image → `NOULA-Day-2026-banner-1200x630.jpg`, `loading="lazy"` + `decoding="async"` + width/height on images.
- `styles.css`, `programme-modal.js`, `programme-data.js`, `artists-data.js` · image refs → .webp.
- `netlify.toml` · adds `Cache-Control: public, max-age=31536000, immutable` for `/images/*`.
- Callmeludo headliner (from the 6 Nov update): hero headliner card, headliner section on Noula Day, first slide of both line-ups, What's on card (new Comedy filter), agenda 20h00-21h00, JSON-LD performer, og:image of noula-day = Callmeludo poster. "Special guest" removed.
- Teaser: NO video file. Poster frame with a play icon, opens the Instagram reel in a new tab.
- Noula Day slideshow: plum veil over the madras background, readable "line-up" label, Joyce-Lee & Joëlle slide rebuilt so both dancers are whole, Jade and Shinead aligned left so their cut edge doesn't show.

## Images · new
- Every `images/**/*.webp` in this ZIP · new (WebP versions of the existing images).
- `images/NOULA-Day-2026-banner-1200x630.jpg` · new (share image, 173 KB, replaces the .png)
- `images/artists/callmeludo.webp`, `images/callmeludo-teaser-poster.webp`, `images/callmeludo-poster-4x5.jpg` · new

## Images · KEEP
- `images/NOULA-Day-2026-banner.png` · keep (Mailchimp emails link to it).
- `images/madras.svg`, `logo.jpg`, `logo-256.jpg` · keep.

## Images · DELETE from the repo
Replaced by .webp:
images/NOULA-Day-2026-banner-1200x630.png, images/directory-pin.png, images/flag-guadeloupe.png, images/flag-guyane.png, images/flag-haiti.png, images/flag-martinique.png, images/logo-hero.png, images/madras.png, images/trustee-fabrice-2.png, images/trustee-patricia-2.png, images/trustee-valerie-2.png, images/zouklove-black.png, images/zouklove-card.png,
images/artists/{blode-prens, charlz, djahman, dymenss, fritz, jada-mayday, jade, joelle-joyce-slide, joelle-joyce, ralphy, shinead, ukm, ziloka}.png,
images/gallery/{accras-flyer.png, cn25-crowd.jpg, cn25-globe.jpg, cn25-host.jpg, cn25-table.jpg, volcano-workshop.png},
images/illustrations/{belote, caribbean-catering, dominoes, kidoka, kidoka2, makers-market, pere-nwel, sorbet, zouk-karaoke}.png,
images/menu/{cochon-roussi, degustation-creole, fish, poulet-sauce-chien, vegan-gratin, vegan}.png

Not used anywhere:
images/artists/camille.png, images/artists/joyce.png, images/gallery/acras-food.jpg, images/heritage-dance.jpg, images/heritage-kids.jpg, images/heritage-performer.jpg, images/hero-heritage.jpg, images/madras-ribbon.png, images/trustee-fabrice.jpg, images/trustee-patricia.jpg, images/trustee-valerie.jpg, images/zouklove-gold.png

## After deploy
- Check the Noula Day page and What's on, and one share preview (WhatsApp).
- Airtable "Member perk" field must be Long text (from the forms update).
