# Noula website · full working copy · 2026-09-10 20:00

This is the complete working site (the version under `site/`), ahead of `main`. Use it to bring the repo / live site current.

## Key state
- Partners page is `partners.html` (renamed from `stalls.html`; 301 in `_redirects`). Nav label "Partners".
- Stall tiers: Standard £80 / Premium £120. Premium = "Everything in Standard, plus" (Bal Kréol room, host announcements, 2 meal + 2 drink tokens). Standard/Food comparison table £80/£120. Setup 11:00 · breakdown by 22:00.
- Sponsor page split out as `sponsor.html`.
- Home: event-first, big clickable Noula Day flyer + lightbox, Meet the line-up slideshow, Directory cue, Chanté Nwèl 2025 gallery montage.
- Programme: `programme-of-the-day.html` (card grid) + `deroule.html` (agenda), both from `programme-data.js`.
- Shared line-up data `artists-data.js`; Fritz + Jade ("The Story of Madras") included.

## Notes
- No stall v3 content-swap was applied. `partners.html` already carries the approved tier content; the v3 spec draft was discarded.
- Serverless functions under `netlify/`, Airtable field names, Eventbrite aff URL, Mailchimp embed all preserved.
- Recommended: before/after merge, run a `main` vs last-sync (2026-09-03) diff to confirm exactly what changes on the live site.

## Images
Full `images/` tree included. Most are unchanged from the repo; overwrite is safe (same filenames, git history is the version log).
