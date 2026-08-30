# Noula website changes · 2026-08-30-1536

Apply these files to the GitHub repo (Ruiny971/noula-website, branch main), overwriting by path. Netlify auto-deploys on merge.

## Code files (overwrite)
- index.html · home: chips reworded (Dominoes & Belote tournaments; French Caribbean makers' market; removed "line-up still growing"; removed "Come early, stay late"); 2026 Programme header centered; "Community Hub" section renamed "Noula Directory" + madras pin; "Become a partner" now links stalls.html; Accras card uses the Valerie flyer; nav dropdown + stacked "Noula/Directory" label.
- events.html · removed STAFE line; flagship highlights now chips + links to programme pages; removed "feast"; volcano workshop card shows its flyer; nav dropdown.
- noula-day.html · line-up slideshow rebuilt (8 performers, click opens the programme detail modal); nav dropdown; "Hour by hour" -> "Running order".
- deroule.html · agenda rows clickable (open detail modal); "Hour by hour" -> "Running order"; nav dropdown.
- programme-of-the-day.html · category + discipline-tag filtering (an item shows under both its category and its tag, e.g. Joyce under Workshop AND Dance); new "Carnival" category; madras backgrounds unified; performer photos wired; nav dropdown.
- directory.html · Premium listing treatment (gold border, ribbon, sorted first); member-perk explained once and now a REQUIRED form field; "Noula Directory" nav label; Zouk Love London logo; nav dropdown.
- programme-data.js · single source for both programme views. Belote split from Dominoes; Biguine spelling; Joyce = Workshop (tag Dance); accras (tag Cooking) & Jade (tag Craft); performer/illustration images wired; "French Caribbean makers' market".
- programme-modal.js · NEW shared file, loaded by noula-day.html and deroule.html. Keep at repo root alongside the HTML.
- styles.css · nav dropdown styles + stacked Directory label.
- about.html, contact.html, stalls.html, volunteer.html · nav dropdown + Directory label only.

## New images (add)
- images/artists/joyce.png, ralphy.png, ukm.png, djahman.png, ziloka.png · new
- images/gallery/volcano-workshop.png · new
- images/gallery/accras-flyer.png · new
- images/illustrations/caribbean-catering.png, sorbet.png, belote.png, kidoka.png, kidoka2.png, makers-market.png · new
- images/zouklove-black.png, zouklove-gold.png, zouklove-card.png · new

All other images already in the repo are unchanged and referenced by path; no re-upload needed.

## ACTION NEEDED IN AIRTABLE (backend, not front-end)
1. Directory "Premium" tier: the site renders a Premium treatment when a listing is flagged premium. Add a Premium field (boolean) to the directory table, set TRUE on Bokit'la and Zouk Love London, and add UKM as a standard (non-premium) listing.
2. The directory form now sends a REQUIRED field named `member-perk` (replacing the old optional `perk-interest` checkbox). Add a matching "Member perk" column so submissions capture it.
