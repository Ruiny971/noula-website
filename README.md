# Noula website changes · 2026-10-02 20:40
Supersedes noula-changes-2026-10-02-2025.
Front-end changes from Claude Design, diffed against `main` @ c03d280f7765. Drop each file at the repo root (same path). Unchanged files (analytics.js, forms.js, programme-modal.js, all other images) are not included.

## Files
- `partners.html` · Media Partner section (#media): "Discuss coverage" mailto replaced by an inline media form (submit-application, partner-type=Media, fields contact-name, business, email, platforms[] tick boxes, website, coverage). Bug fix: tick boxes no longer individually required; on submit, at least one platform must be ticked, else an inline EN/FR error shows under the group). Also the earlier stalls → partners work: deadline badge 30 Oct 2026, four partner tiles + full-detail views, sponsor tier table, Space / Room placement / Power access rows, insurance tickbox. "Media partner" kept in the Apply now dropdown.
- `_redirects` · new: `/stalls` → `/partners` (301), clean `/sponsor` URL.
- `volunteer.html` · collapsible "What do I get in return?" perks; redesigned form (availability + skills tick boxes with free text, conditional Noula Day shift radios).
- `get-involved.html` · volunteer perks block; partners links.
- `index.html` · countdown to Sat 28 Nov 2026 12:00; shared line-up carousel; nav update.
- `noula-day.html` · countdown; shared artists slideshow; nav update.
- `artists-data.js` · Shinead (Volcano workshop) added to the line-up; Fritz entry.
- `programme-data.js` · Shinead volcano workshop (ages 5-12, free Eventbrite ticket, adult must stay, time TBC) and latest programme edits.
- `events.html` · 26 Sep online cooking demo card removed; nav update.
- `about.html` · nav update. TEMP verification code `oZDpN9` removed.
- `contact.html`, `deroule.html`, `directory.html`, `programme-of-the-day.html`, `sponsor.html`, `_status.html`, `_draft-lineup-option-c-full-programme.html` · site-wide nav: Stallholders item under Noula Day, de-duplicated menu, What's on / Agenda labels.
- `styles.css` · small shared style tweak for the above.

## Images
- `images/artists/shinead.png` · new

## Backend notes for cowork (not in this ZIP)
- `submit-application` now also receives `platforms` (array) and `coverage` from the media form. Map them to Airtable fields, or confirm the function ignores unknown keys.
- Contact form `MODEL_NOT_FOUND` on the deployed function still open.
- Real GA4 ID in `analytics.js` still placeholder.
