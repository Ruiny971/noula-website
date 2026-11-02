// Noula — community directory join requests -> Airtable "Listings"
//
// Create a table named exactly "Listings" with these columns:
//   Name         Single line text  (business / project name)
//   Category     Single select
//   Description  Long text
//   Location     Single line text
//   Website      URL / Single line text
//   Instagram    Single line text
//   Contact name Single line text
//   Email        Email / Single line text
//   Member perk  Long text      (the perk they offer, from the "member-perk" field)
//   Logo         Attachment     (fldZmMDM4Ju46FxDr)
//   Photos       Attachment     (fld6RMOQuBUlrfmB5)
//   Status       Single select  -> set to "New" (you publish approved ones)
//
// The public directory reads only rows you mark published — new submissions
// land as Status = New for review.

const { clean, createRecord, findRecord, esc, DUP_MESSAGE, json, parseBody, uploadFiles } = require('./_airtable');

const UPLOAD_FIELDS = {
  logo: { field: 'fldZmMDM4Ju46FxDr', max: 1 },
  photos: { field: 'fld6RMOQuBUlrfmB5', max: 3 },
};

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  const body = parseBody(event);
  if (!body) return json(400, { error: 'Invalid JSON body.' });
  if (clean(body['bot-field'])) return json(200, { ok: true }); // honeypot

  const name = clean(body['business-name']);
  const email = clean(body['email']);
  if (!name) return json(400, { error: 'Business or project name is required.' });

  const fields = {
    Name: name,
    Category: clean(body['category']),
    Description: clean(body['description']),
    Location: clean(body['location']),
    Website: clean(body['website']),
    Instagram: clean(body['instagram']),
    'Contact name': clean(body['contact-name']),
    Email: email,
    Status: 'New',
  };
  // The form field is "member-perk" (free text). "perk-interest" kept as a legacy fallback.
  const perk = clean(body['member-perk']);
  if (perk) fields['Member perk'] = perk;
  else if (clean(body['perk-interest'])) fields['Member perk'] = 'Interested';

  // Duplicate check: Name OR Email (case-insensitive)
  const dupParts = [`LOWER({Name})=LOWER('${esc(name)}')`];
  if (email) dupParts.push(`LOWER({Email})=LOWER('${esc(email)}')`);
  const dup = await findRecord('Listings', dupParts.length > 1 ? `OR(${dupParts.join(', ')})` : dupParts[0]);
  if (dup.record) return json(409, { error: DUP_MESSAGE, duplicate: true });

  const r = await createRecord('Listings', fields);
  if (r.status !== 200 || !r.body.id) return json(r.status, r.body);

  // Record exists: attach images. Failures are logged, never fail the submission.
  const up = await uploadFiles(r.body.id, body.uploads, UPLOAD_FIELDS, 'submit-directory');
  return json(200, { ...r.body, uploads: up });
};
