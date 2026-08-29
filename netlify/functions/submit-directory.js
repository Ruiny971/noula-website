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
//   Member perk  Single select  (Interested, …)
//   Status       Single select  -> set to "New" (you publish approved ones)
//
// The public directory reads only rows you mark published — new submissions
// land as Status = New for review.

const { clean, createRecord, findRecord, esc, DUP_MESSAGE, json, parseBody } = require('./_airtable');

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
  if (clean(body['perk-interest'])) fields['Member perk'] = 'Interested';

  // Duplicate check: Name OR Email (case-insensitive)
  const dupParts = [`LOWER({Name})=LOWER('${esc(name)}')`];
  if (email) dupParts.push(`LOWER({Email})=LOWER('${esc(email)}')`);
  const dup = await findRecord('Listings', dupParts.length > 1 ? `OR(${dupParts.join(', ')})` : dupParts[0]);
  if (dup.record) return json(409, { error: DUP_MESSAGE, duplicate: true });

  const r = await createRecord('Listings', fields);
  return json(r.status, r.body);
};
