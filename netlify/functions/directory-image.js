// Netlify serverless function · Noula Directory image proxy
// GET /.netlify/functions/directory-image?id=recXXXXXXXXXXXXXX
// Looks up the listing, fetches a FRESH Airtable attachment URL (they expire after
// a few hours) and streams the image back. Netlify's CDN caches the response, so the
// page never shows a direct (expiring) Airtable link.
// Env var: AIRTABLE_TOKEN (same read-only token as directory.js).

const AIRTABLE_BASE = 'appkxvLJb4SA6pEt3';
const AIRTABLE_TABLE = 'tblC5Mcn7rvIGM92w';
const LOGO_FIELDS = ['Logo', 'logo', 'Image', 'Photo', 'Picture'];

exports.handler = async function (event) {
  const id = (event.queryStringParameters && event.queryStringParameters.id) || '';
  if (!/^rec[A-Za-z0-9]{14}$/.test(id)) return { statusCode: 400, body: 'Bad id' };
  const token = process.env.AIRTABLE_TOKEN || process.env.AIRTABLE_PAT || process.env.AIRTABLE_API_KEY;
  if (!token) return { statusCode: 500, body: 'Missing token' };
  try {
    const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return { statusCode: 404, body: 'Not found' };
    const f = (await res.json()).fields || {};
    let att = null;
    for (const k of LOGO_FIELDS) { if (Array.isArray(f[k]) && f[k].length) { att = f[k][0]; break; } }
    if (!att) return { statusCode: 404, body: 'No image' };
    const src = (att.thumbnails && (att.thumbnails.large || att.thumbnails.full || {}).url) || att.url;
    const img = await fetch(src);
    if (!img.ok) return { statusCode: 502, body: 'Image fetch failed' };
    const buf = Buffer.from(await img.arrayBuffer());
    return {
      statusCode: 200,
      headers: {
        'Content-Type': img.headers.get('content-type') || att.type || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400',
        'Netlify-CDN-Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400',
      },
      body: buf.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (e) {
    return { statusCode: 500, body: 'Error' };
  }
};
