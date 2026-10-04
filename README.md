# Noula website · soft launch changes · 2026-10-04 21:20

Copy each file to the repo root (same path), replacing the existing file. No new or replaced images. All images referenced already exist in images/.

## Files
- programme-data.js · soft-launch flags: NOULA_SHOW_TIMES=false (times hidden), NOULA_SHOW_ROOMS=false (rooms show "Room to be announced"), NOULA_ADDONS_OPEN=false (add-on booking shown as coming soon). Camille removed. Room names + booking instructions removed from descriptions.
- programme-of-the-day.html · What's on: "Afternoon / Evening / All day" instead of times; room chip "to be announced"; add-on badges "booking soon" / "pre-orders open soon"; modal shows "booking opens soon" + entry ticket link.
- deroule.html · Agenda: no time column, Afternoon/Evening groups; room cards removed; "Coming soon · Workshop bookings open soon" banner with entry-ticket CTA + "Get notified" link to newsletter; new "All day · French Caribbean food & drinks" card; intro "Programme of the day · more to be announced"; TBC tags now "To be announced"; meta description updated; dash display fix.
- programme-modal.js · times hidden in the shared programme modal.
- artists-data.js · Camille removed from line-up.
- index.html · Donate CTA to Stripe; newsletter section id="newsletter" (anchor); "few emails a year · no spam" line removed.
- get-involved.html · Donate section live (Stripe link, Gift Aid line EN/FR, charity No. 1210134); coming-soon state removed.
- sponsor.html · room names replaced with "Main stage" / "Activities space (names TBC)"; donate links.
- partners.html · room names removed from stall tiers/table; media form label "Your page, channel or publication"; donate links.
- about.html, contact.html, directory.html, events.html, noula-day.html, volunteer.html · nav "Donate" + footer "Support us" link to Stripe (new tab), soon badge removed.

## Preserved
Netlify function endpoints, Airtable field names, Eventbrite URL (?aff=NoulaWebsite), Mailchimp embed, EN/FR span mechanism.

## Optional
- images/artists/camille.png is no longer referenced (can be deleted from the repo).

## Queue
Soft launch prep (times hidden, rooms TBC, add-ons coming soon, donations live, Camille removed) → move to Recently done.
