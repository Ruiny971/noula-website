// Shared Airtable helper for Noula submit-* functions.
// Underscore-prefixed => Netlify treats this as a module, not an endpoint.
//
// Env var (either name works): AIRTABLE_PAT  (or legacy AIRTABLE_TOKEN)
// Base is fixed. Each function passes a table NAME and a field map.
// typecast:true lets single/multi-selects create missing options on the fly.

const AIRTABLE_BASE = 'appkxvLJb4SA6pEt3';

function getToken() {
  return (
    process.env.AIRTABLE_PAT ||
    process.env.AIRTABLE_TOKEN ||
    process.env.AIRTABLE_API_KEY ||
    ''
  );
}

const clean = (v) => (typeof v === 'string' ? v.trim() : v == null ? '' : String(v));

// Drop empty strings / empty arrays so typed Airtable columns don't reject blanks.
function prune(fields) {
  const out = {};
  Object.keys(fields).forEach((k) => {
    const v = fields[k];
    if (v === '' || v == null) return;
    if (Array.isArray(v) && v.length === 0) return;
    out[k] = v;
  });
  return out;
}

// Escape a value for use inside an Airtable formula single-quoted string.
function esc(v) { return String(v == null ? '' : v).replace(/'/g, "\\'"); }

// Find the first record matching a filterByFormula. { record } or { record:null }; { error } on failure.
async function findRecord(table, formula) {
  const token = getToken();
  if (!token) return { error: 'missing token' };
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(table)}?maxRecords=1&filterByFormula=${encodeURIComponent(formula)}`;
  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) return { error: await res.text() };
    const data = await res.json();
    return { record: (data.records && data.records[0]) || null };
  } catch (e) {
    return { error: String(e) };
  }
}

const DUP_MESSAGE =
  'This organisation/email appears to already be submitted. Please email fchpf@outlook.com to update your existing entry rather than resubmit.';

async function createRecord(table, fields) {
  const token = getToken();
  if (!token) {
    return { status: 500, body: { error: 'Server not configured: missing AIRTABLE_PAT env var.' } };
  }
  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(table)}`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ records: [{ fields: prune(fields) }], typecast: true }),
    }
  );
  if (!res.ok) {
    const detail = await res.text();
    return { status: res.status, body: { error: 'Airtable write failed', detail } };
  }
  const data = await res.json();
  const id = data.records && data.records[0] && data.records[0].id;
  return { status: 200, body: { ok: true, id } };
}

function json(statusCode, body) {
  return { statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}

function parseBody(event) {
  try { return JSON.parse(event.body || '{}'); }
  catch (e) { return null; }
}

module.exports = { AIRTABLE_BASE, getToken, clean, prune, createRecord, findRecord, esc, DUP_MESSAGE, json, parseBody };
