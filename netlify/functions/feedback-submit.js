// Netlify serverless function — Noula team feedback
// Receives a JSON POST from the on-site feedback widget and creates a record
// in the "Feedback" table of the Airtable base.
//
// Netlify env var required:  AIRTABLE_TOKEN  (same token as the directory)
//   Scopes needed:
//     data.records:write   (create the feedback note)
//     schema.bases:read    (only if you want screenshot attachments to work)
//
// Airtable setup: create a table named exactly "Feedback" in the base with
// these fields (names must match):
//   Note        — Long text
//   Name        — Single line text
//   Priority    — Single select (Low, Medium, High)  [typecast creates options]
//   Category    — Single select (Bug, Copy, Design, Idea)
//   Page        — Single line text
//   Screenshot  — Attachment (optional)
//   Status      — Single select (optional, for your triage)

const AIRTABLE_BASE = 'appkxvLJb4SA6pEt3';
const FEEDBACK_TABLE = 'Feedback';
const SHARED_PASSCODE = 'noula2026';

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  const token =
    process.env.AIRTABLE_TOKEN || process.env.AIRTABLE_PAT || process.env.AIRTABLE_API_KEY;
  if (!token) return json(500, { error: 'Server not configured: missing AIRTABLE_TOKEN env var.' });

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch (e) { return json(400, { error: 'Invalid JSON body.' }); }

  // Light server-side gate so random visitors can't spam the table.
  if ((body.passcode || '') !== SHARED_PASSCODE) {
    return json(401, { error: 'Not authorised.' });
  }

  const clean = (v) => (typeof v === 'string' ? v.trim() : '');
  const note = clean(body.note);
  if (!note) return json(400, { error: 'Note is required.' });

  const fields = { Note: note };
  if (clean(body.name)) fields.Name = clean(body.name);
  if (clean(body.priority)) fields.Priority = clean(body.priority);
  if (clean(body.category)) fields.Category = clean(body.category);
  if (clean(body.page)) fields.Page = clean(body.page);

  try {
    const createRes = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(FEEDBACK_TABLE)}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: [{ fields }], typecast: true }),
      }
    );
    if (!createRes.ok) {
      const detail = await createRes.text();
      return json(createRes.status, { error: 'Airtable write failed', detail });
    }
    const created = await createRes.json();
    const recordId = created.records && created.records[0] && created.records[0].id;

    // Optional screenshot attachment — non-fatal if it fails.
    let screenshotWarning;
    if (recordId && body.screenshot && body.screenshot.dataBase64) {
      try {
        await attachScreenshot(token, recordId, body.screenshot);
      } catch (e) {
        screenshotWarning = String(e && e.message ? e.message : e);
      }
    }
    return json(200, { ok: true, id: recordId, screenshotWarning });
  } catch (e) {
    return json(500, { error: 'Unexpected error', detail: String(e && e.message ? e.message : e) });
  }
};

async function attachScreenshot(token, recordId, shot) {
  // Resolve the Screenshot field id from the base schema.
  const metaRes = await fetch(`https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE}/tables`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!metaRes.ok) throw new Error('schema read failed (add schema.bases:read scope)');
  const meta = await metaRes.json();
  const table = (meta.tables || []).find((t) => t.name === FEEDBACK_TABLE);
  const field = table && (table.fields || []).find((f) => f.name === 'Screenshot');
  if (!field) throw new Error('no Screenshot attachment field');

  const upRes = await fetch(
    `https://content.airtable.com/v0/${AIRTABLE_BASE}/${recordId}/${field.id}/uploadAttachment`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contentType: shot.type || 'image/png',
        file: shot.dataBase64,
        filename: shot.name || 'screenshot.png',
      }),
    }
  );
  if (!upRes.ok) throw new Error('attachment upload failed');
}

function json(statusCode, body) {
  return { statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}
