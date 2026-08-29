// Noula — volunteer sign-ups -> Airtable "Volunteers"
//
// Create a table named exactly "Volunteers" with these columns:
//   Name          Single line text
//   Email         Email / Single line text
//   Phone         Single line text
//   Events        Multiple select   (which event(s) to help with)
//   Type of help  Multiple select   (Noula Day 2026, Ongoing support, Skills-based, Community ambassador, Just curious)
//   Areas         Multiple select   (kitchen, bar, setup, …)
//   Availability  Single line / Long text
//   Skills        Long text
//   Referral      Single line text   (how they heard about us)
//   Consent       Checkbox / Single select
//   Status        Single select  -> set to "New" on submit

const { clean, createRecord, findRecord, esc, DUP_MESSAGE, json, parseBody } = require('./_airtable');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  const body = parseBody(event);
  if (!body) return json(400, { error: 'Invalid JSON body.' });
  if (clean(body['bot-field'])) return json(200, { ok: true }); // honeypot

  const name = clean(body['name']);
  const email = clean(body['email']);
  if (!name) return json(400, { error: 'Name is required.' });
  if (!email) return json(400, { error: 'Email is required.' });

  const events = Array.isArray(body['events'])
    ? body['events']
    : clean(body['events']) ? [clean(body['events'])] : [];
  const areas = Array.isArray(body['areas'])
    ? body['areas']
    : clean(body['areas']) ? [clean(body['areas'])] : [];
  const helpType = Array.isArray(body['help-type'])
    ? body['help-type']
    : clean(body['help-type']) ? [clean(body['help-type'])] : [];

  const fields = {
    Name: name,
    Email: email,
    Phone: clean(body['phone']),
    Availability: clean(body['availability']),
    Skills: clean(body['skills']),
    Referral: clean(body['referral']),
    Status: 'New',
  };
  if (events.length) fields.Events = events;
  if (helpType.length) fields['Type of help'] = helpType;
  if (areas.length) fields.Areas = areas;
  if (clean(body['consent'])) fields.Consent = 'Yes';

  // Duplicate check: Email (case-insensitive)
  const dup = await findRecord('Volunteers', `LOWER({Email})=LOWER('${esc(email)}')`);
  if (dup.record) return json(409, { error: DUP_MESSAGE, duplicate: true });

  const r = await createRecord('Volunteers', fields);
  return json(r.status, r.body);
};
