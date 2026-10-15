# Noula website changes · 2026-10-15 17:08

Drop these files over the repo root of `Ruiny971/noula-website` (main). Do NOT touch `netlify/functions/submit-volunteer.js` (already updated on GitHub).

## Files
- `partners.html` · stallholder offer simplified to ONE stall type "Stall · £80" / "Stand · 80 £", applications close 30 October 2026. Premium tier, comparison table and tier dropdown removed; form sends hidden `tier` = "Standard £80" to Airtable. Also "kompa" → "konpa".
- `volunteer.html` · new under-18 block before consent: `under-18` checkbox reveals required `guardian-name`, `guardian-phone`, `guardian-consent` + note (hidden and disabled when unticked). Noula Day shift changed from radios to checkboxes `noula-day-shift[]` (several shifts allowed, values unchanged).
- `forms.js` · conditional sections now respect checkbox ticked state (needed for the under-18 block).
- `programme-data.js` · artist-supplied texts: Zouk Love London replaces "Lina" (Konpa class + Zouk karaoke, new EN/FR text, karaoke card now uses the new illustration); Mister Fritz; Biguine Party with Joyce-Lee & Joëlle; KIDOKA ×2 new text; Ralphie (spelling + text); Chanté Nwèl ×2 people + extra paragraph; Charlz and Blodè Prens lines. "Kompa" → "Konpa" (internal id `kompa` unchanged).
- `artists-data.js` · line-up: Mister Fritz, Ralphie, Zil'Oka, Joyce-Lee & Joëlle names + bios/roles; Charlz "Pop & R&B", Blodè Prens "Reggae · vocals & guitar".
- `about.html`, `directory.html`, `events.html`, `noula-day.html` · "kompa" → "konpa".
- `images/artists/fritz.png` · replaces existing (new photo of Mister Fritz).
- `images/illustrations/zouk-karaoke.png` · new (Zouk karaoke card, illustration + gold Zouk Love logo).

## Queue items completed
- Stallholder offer: single tier.
- Artist texts update (Zouk Love London, Mister Fritz, Joyce-Lee & Joëlle, Zil'Oka / KIDOKA, Ralphie, Chanté Nwèl, Charlz, Blodè Prens).
- Konpa spelling site-wide.
- Volunteer form: under-18 guardian fields + multi-shift checkboxes.

## Optional cleanup for cowork
- `_status.html` is no longer linked anywhere (footer now links Privacy); it's not in the repo, nothing to do.
