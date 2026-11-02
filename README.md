# Noula website changes · 2026-11-02 13:07

All files built from current `main`. Paths mirror the repo root. Replace the matching files in `main`.

## Programme (Noula Day running order)
- `programme-data.js` · new running order across Main Hall (doors 12h, finale 23h), La Cour (workshops, kids) and Game zone & sorbet; Book buttons + "Limited places" on bookable workshops (Eventbrite links); soft-launch flags off so times and rooms show; Père Nwèl card; Jada Mayday and DJ Dymenss photos; Ralphy name standardised.
- `programme-of-the-day.html` · timing note at top (EN + FR), card grid updates.
- `deroule.html` · timing note at top (EN + FR), agenda updates.
- `programme-modal.js` · Book button + Limited places in the modal.
- `images/artists/jada-mayday.png` · new
- `images/artists/dymenss.png` · new
- `images/illustrations/pere-nwel.png` · new

## Forms (image uploads)
- `directory.html` · logo + up to 3 photo upload fields, size limits, validation.
- `partners.html` · same upload fields on the Stallholder/partner form.
- `forms.js` · in-browser resize, file validation, sends images with payload; duplicate (409) message red with new FR wording.
- `netlify/functions/_airtable.js` · `uploadAttachment` helper for Airtable attachments.
- `netlify/functions/submit-directory.js` · attaches images; reads `member-perk` (fallback `perk-interest`).
- `netlify/functions/submit-application.js` · attaches images.

## Shared
- `styles.css` · programme (timing note, Book button, Limited places) + form upload styles. One file covers both sets of changes.

## Before / after deploy
- Airtable: switch "Member perk" field from single choice to Long text before forms go live.
- After deploy: send one test submission on each form and check images arrive in Airtable.
