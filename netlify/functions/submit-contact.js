// Noula — general contact messages -> Airtable "Messages"
//
// Create a table named exactly "Messages" with these columns:
//   Name     Single line text
//   Email    Email / Single line text
//   Topic    Single select  (Events, Directory, Partnerships, Volunteering, Other)
//   Message  Long text
//   Status   Single select  -> set to "New" on submit

const { clean, createRecord, json, parseBody } = require('./_airtable');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  const body = parseBody(event);
  if (!body) return json(400, { error: 'Invalid JSON body.' });
  if (clean(body['bot-field'])) return json(200, { ok: true }); // honeypot

  const name = clean(body['name']);
  const email = clean(body['email']);
  const message = clean(body['message']);
  if (!name) return json(400, { error: 'Name is required.' });
  if (!email) return json(400, { error: 'Email is required.' });
  if (!message) return json(400, { error: 'Message is required.' });

  const fields = {
    Name: name,
    Email: email,
    Topic: clean(body['topic']),
    Message: message,
    Status: 'New',
  };

  const r = await createRecord('Messages', fields);
  return json(r.status, r.body);
};
