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

// ---------- Attachments ----------
// Uploads base64 files to an attachment field of an existing record via
// POST https://content.airtable.com/v0/{base}/{recordId}/{fieldId}/uploadAttachment
// Airtable limit: 5 MB per file.
const UPLOAD_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml'];
const UPLOAD_MAX_BYTES = 5 * 1024 * 1024;

async function uploadAttachment(recordId, fieldId, file) {
  const token = getToken();
  if (!token) return { ok: false, error: 'missing token' };
  try {
    const res = await fetch(
      `https://content.airtable.com/v0/${AIRTABLE_BASE}/${recordId}/${fieldId}/uploadAttachment`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType: file.contentType, file: file.base64, filename: file.filename }),
      }
    );
    if (!res.ok) return { ok: false, error: `${res.status} ${await res.text()}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

// uploads: body.uploads = { logo: [{filename, contentType, base64}], photos: [...] }
// fieldMap: { logo: { field: 'fld…', max: 1 }, photos: { field: 'fld…', max: 3 } }
// Never throws: failures are logged and counted so the submission itself is never lost.
async function uploadFiles(recordId, uploads, fieldMap, label) {
  const result = { uploaded: 0, failed: 0 };
  if (!uploads || typeof uploads !== 'object') return result;
  const jobs = [];
  Object.keys(fieldMap).forEach((key) => {
    const list = Array.isArray(uploads[key]) ? uploads[key].slice(0, fieldMap[key].max) : [];
    list.forEach((raw, i) => {
      const f = raw || {};
      const base64 = typeof f.base64 === 'string' ? f.base64.replace(/^data:[^,]*,/, '') : '';
      const contentType = clean(f.contentType);
      const filename = clean(f.filename).slice(0, 120) || `${key}-${i + 1}`;
      const bytes = Math.floor((base64.length * 3) / 4);
      if (!base64 || !UPLOAD_TYPES.includes(contentType) || bytes > UPLOAD_MAX_BYTES) {
        result.failed++;
        console.error(`[${label}] upload rejected (${key}: ${filename}, ${contentType}, ${bytes} bytes) for ${recordId}`);
        return;
      }
      jobs.push(
        uploadAttachment(recordId, fieldMap[key].field, { base64, contentType, filename }).then((r) => {
          if (r.ok) result.uploaded++;
          else {
            result.failed++;
            console.error(`[${label}] upload failed (${key}: ${filename}) for ${recordId}: ${r.error}`);
          }
        })
      );
    });
  });
  await Promise.all(jobs);
  return result;
}

function json(statusCode, body) {
  return { statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}

function parseBody(event) {
  try { return JSON.parse(event.body || '{}'); }
  catch (e) { return null; }
}

module.exports = { AIRTABLE_BASE, getToken, clean, prune, createRecord, findRecord, esc, DUP_MESSAGE, json, parseBody, uploadAttachment, uploadFiles };
