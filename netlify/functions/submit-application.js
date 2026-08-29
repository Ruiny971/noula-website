// Noula — partner / stall application submissions -> Airtable "Applications"
//
// Create a table named exactly "Applications" with these columns
// (names are case-sensitive; select options are created automatically):
//   Partner type        Single select  (Stallholder, Sponsor, Cultural, Media)
//   Organisation        Single line text
//   Contact name        Single line text
//   Email               Email / Single line text
//   Phone               Single line text
//   Website             URL / Single line text
//   Instagram           Single line text
//   About               Long text
//   Category            Single select   (stallholder only)
//   What selling        Long text       (stallholder only)
//   Tier                Single select   (stallholder only)
//   Public liability    Single select   (Confirmed)  (stallholder only)
//   Offer               Long text       (sponsor/cultural/media)
//   Member perk         Single select   (Yes, Maybe, No)
//   Member perk details Long text
//   Notes               Long text
//   Status              Single select   (New, …)  -> set to "New" on submit

const { clean, createRecord, findRecord, esc, DUP_MESSAGE, json, parseBody } = require('./_airtable');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  const body = parseBody(event);
  if (!body) return json(400, { error: 'Invalid JSON body.' });
  if (clean(body['bot-field'])) return json(200, { ok: true }); // honeypot

  const ALLOWED_TYPES = ['Stallholder', 'Sponsor', 'Cultural', 'Media'];
  const type = clean(body['partner-type']);
  const org = clean(body['business']);
  const email = clean(body['email']);
  if (!type) return json(400, { error: 'Partner type is required.' });
  if (!ALLOWED_TYPES.includes(type)) return json(400, { error: 'Invalid partner type.' });
  if (!org) return json(400, { error: 'Organisation name is required.' });
  if (!email) return json(400, { error: 'Email is required.' });

  const fields = {
    'Partner type': type,
    Organisation: org,
    'Contact name': clean(body['contact-name']),
    Email: email,
    Phone: clean(body['phone']),
    Website: clean(body['website']),
    Instagram: clean(body['instagram']),
    About: clean(body['about-org']),
    Notes: clean(body['notes']),
    Status: 'New',
  };

  if (type === 'Stallholder') {
    fields.Category = clean(body['category']);
    fields['What selling'] = clean(body['what-selling']);
    fields.Tier = clean(body['tier']);
    if (clean(body['pli-confirmed'])) fields['Public liability'] = 'Confirmed';
  } else {
    fields.Offer = clean(body['offer']);
  }

  if (clean(body['member-perk'])) fields['Member perk'] = clean(body['member-perk']);
  if (clean(body['member-perk-details'])) fields['Member perk details'] = clean(body['member-perk-details']);

  // Duplicate check: Organisation OR Email (case-insensitive)
  const dupFormula = `OR(LOWER({Organisation})=LOWER('${esc(org)}'), LOWER({Email})=LOWER('${esc(email)}'))`;
  const dup = await findRecord('Applications', dupFormula);
  if (dup.record) return json(409, { error: DUP_MESSAGE, duplicate: true });

  const r = await createRecord('Applications', fields);
  return json(r.status, r.body);
};
