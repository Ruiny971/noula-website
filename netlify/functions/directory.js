// Netlify serverless function — Noula Directory
// Reads the public Listings view from Airtable using a read-only Personal
// Access Token stored in the AIRTABLE_TOKEN environment variable (set in the
// Netlify site settings — never committed to the repo).
//
// Netlify env var required:  AIRTABLE_TOKEN = pat_xxx (scope: data.records:read on the base)

const AIRTABLE_BASE = 'appkxvLJb4SA6pEt3';
const AIRTABLE_TABLE = 'tblC5Mcn7rvIGM92w';
const AIRTABLE_VIEW = 'Public directory';

exports.handler = async function () {
  const token =
    process.env.AIRTABLE_TOKEN ||
    process.env.AIRTABLE_PAT ||
    process.env.AIRTABLE_API_KEY;

  if (!token) {
    return json(500, { error: 'Server not configured: missing AIRTABLE_TOKEN env var.' });
  }

  try {
    let records = [];
    let offset;
    do {
      const url = new URL(
        `https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(AIRTABLE_TABLE)}`
      );
      url.searchParams.set('view', AIRTABLE_VIEW);
      url.searchParams.set('pageSize', '100');
      if (offset) url.searchParams.set('offset', offset);

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const detail = await res.text();
        return json(res.status, { error: 'Airtable request failed', detail });
      }

      const data = await res.json();
      records = records.concat(data.records || []);
      offset = data.offset;
    } while (offset);

    const listings = records
      .map((r) => {
        const f = r.fields || {};
        const pick = (...keys) => {
          for (const k of keys) {
            const v = f[k];
            if (v != null && v !== '' && !(Array.isArray(v) && v.length === 0)) return v;
          }
          return '';
        };
        const asText = (v) => (Array.isArray(v) ? v.join(', ') : typeof v === 'string' ? v : v ? String(v) : '');

        const logoField = pick('Logo', 'logo', 'Image', 'Photo', 'Picture');
        let logo = '';
        if (Array.isArray(logoField) && logoField.length) {
          const a = logoField[0];
          logo = (a.thumbnails && (a.thumbnails.large || a.thumbnails.full || {}).url) || a.url || '';
        } else if (typeof logoField === 'string') {
          logo = logoField;
        }

        const perkRaw = pick('Member perk', 'Member perk?', 'Perk', 'Member offer');
        const perk = asText(perkRaw).trim();
        const perkYes = /^(y|yes|true|1|oui)/i.test(perk) || (perk && perk.length > 3);

        const premium = f['Premium'] === true || f['premium'] === true || f['isPremium'] === true;

        return {
          id: r.id,
          name: asText(pick('Name', 'Business name', 'Business', 'Title', 'Listing name')).trim(),
          category: asText(pick('Category', 'Categories', 'Type', 'Sector')).trim(),
          description: asText(
            pick('Description', 'Short description', 'About', 'Bio', 'Summary')
          ).trim(),
          location: asText(pick('Location', 'City', 'Region', 'Area', 'Town')).trim(),
          website: asText(pick('Website', 'Site', 'URL', 'Web', 'Link')).trim(),
          instagram: asText(pick('Instagram', 'IG', 'Insta', 'Instagram handle')).trim(),
          perk: perkYes ? perk : '',
          premium,
          logo,
        };
      })
      .filter((l) => l.name)
      .sort((a, b) => (b.premium === true) - (a.premium === true));

    return json(200, { listings }, { 'Cache-Control': 'public, max-age=300' });
  } catch (e) {
    return json(500, { error: 'Unexpected error', detail: String(e && e.message ? e.message : e) });
  }
};

function json(statusCode, body, extraHeaders) {
  return {
    statusCode,
    headers: Object.assign({ 'Content-Type': 'application/json' }, extraHeaders || {}),
    body: JSON.stringify(body),
  };
}