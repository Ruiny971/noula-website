# Cowork queue

Backlog for text, forms, logic, and integrations work. Cowork Claude checks this file first each session, picks up next Pending item after confirming with Ruiny.

Last updated: 2026-08-29

## Pending · URGENT (before team review next week)

- [ ] Contact form broken · INVALID_PERMISSIONS_OR_MODEL_NOT_FOUND error on submit. Investigate whether Claude Design wired a Claude/Anthropic API model into the contact form and either fix the API permission or rewire to a simple Netlify serverless function that just sends the message to fchpf@outlook.com.

## Pending · Site-wide text and structure fixes

- [ ] Fix accent · replace Creole (no accent, in English contexts) with Créole (with é) across all HTML files where it refers to the French Caribbean identity or the brand name The Créole Kermesse.
- [ ] Remove all mentions of expected attendee counts from the site.
- [ ] Verify Chanté Nwèl accent everywhere (grave on the è).
- [ ] Rename Ka kids workshop to KIDOKA everywhere it appears in copy or schedule references.
- [ ] Confirm Acras vs Accras spelling with Ruiny · align all HTML.

## Pending · Navigation and layout (simple)

- [ ] Rename nav item Programme to Events.
- [ ] Add donation button to the top nav (with coming soon state) OR make it always visible on scroll. Ruiny to decide final position after seeing options.
- [ ] Add a Noula Day dropdown menu structure with sub-items: Programme of the day, Agenda (name TBC). The sub-pages themselves are built by Claude Design.
- [ ] Make the flyer on the home page clickable · click opens a larger lightbox view.

## Pending · Directory (quick fixes)

- [ ] Add short descriptive text next to the Directory pin nav item so first-time visitors understand what they are clicking.
- [ ] Make the pin icon a bit bigger (CSS tweak).

## Pending · Home page copy

- [ ] Remove Our Flagship event... heading.
- [ ] Replace Multi-generational label with Everyone! and add a family-friendly / kids-welcome visual cue.
- [ ] Reformat the event description for readability (shorter paragraphs, bullets, hierarchy).

## Pending · Programme (soon Events) page

- [ ] Rename section heading Our programme to Our events.
- [ ] Remove tagline The Créole soul of the volcanoes.
- [ ] Make the flyer clickable · click goes to Noula Day page.
- [ ] Remove Guided créole dégustation from the event description.

## Pending · SEO

- [ ] Add JSON-LD structured data on the Noula Day page (Event schema) so it surfaces in Google search results.
- [ ] Meta descriptions and OG tags sweep across all pages for consistency and keyword coverage.

## In progress

(nothing right now)

## Recently done

- [x] Airtable Applications table renames (Organisation, Partner type, Tier, Public liability, Offer) + What selling field added (28 Aug)
- [x] Airtable Volunteers table Type of help field added (28 Aug)
- [x] Airtable Directory duplicate cleanup (Bokit'la) (29 Aug)
- [x] GitHub repo created, connector authorised (29 Aug)
- [x] _todo/ queue system set up (29 Aug)