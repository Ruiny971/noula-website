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

  // Checkbox groups arrive as arrays; a single tick may arrive as a string.
  const list = (v) => (Array.isArray(v) ? v.map(clean).filter(Boolean) : clean(v) ? [clean(v)] : []);
  const events = list(body['events']);
  const areas = list(body['areas']);
  const helpType = list(body['help-type']);
  const availability = list(body['availability']);
  const skills = list(body['skills']);
  const shift = list(body['noula-day-shift']);

  // Free-text extras go into Notes so nothing is lost.
  const extras = [];
  if (clean(body['availability-other'])) extras.push('Availability: ' + clean(body['availability-other']));
  if (clean(body['skills-other'])) extras.push('Skills: ' + clean(body['skills-other']));
  // Under-18 volunteers: kept in Notes (no extra Airtable columns needed)
  if (clean(body['under-18'])) {
    extras.unshift(
      'UNDER 18 · Parent/guardian: ' + (clean(body['guardian-name']) || '?') +
      ' · ' + (clean(body['guardian-phone']) || '?') +
      ' · consent: ' + (clean(body['guardian-consent']) ? 'yes' : 'NO')
    );
  }

  const fields = {
    Name: name,
    Email: email,
    Phone: clean(body['phone']),
    Skills: skills.join(', '),          // long text field in Airtable
    Referral: clean(body['referral']),
    Notes: extras.join('\n'),
    Status: 'New',
  };
  if (events.length) fields.Events = events;
  if (helpType.length) fields['Type of help'] = helpType;
  if (areas.length) fields.Areas = areas;
  if (availability.length) fields.Availability = availability;
  if (shift.length) fields['Noula Day shift'] = shift;
  if (clean(body['consent'])) fields.Consent = 'Yes';

  // Duplicate check: Email (case-insensitive)
  const dup = await findRecord('Volunteers', `LOWER({Email})=LOWER('${esc(email)}')`);
  if (dup.record) return json(409, { error: DUP_MESSAGE, duplicate: true });

  const r = await createRecord('Volunteers', fields);
  return json(r.status, r.body);
};
