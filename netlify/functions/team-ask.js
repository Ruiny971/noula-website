// Netlify serverless function · Noula Day team assistant
// POST /.netlify/functions/team-ask   body: { password, question }
// Answers team questions ONLY from the Noula Day organisation notes in _team-knowledge.js.
//
// Env vars (set in Netlify > Site configuration > Environment variables):
//   ANTHROPIC_API_KEY   Claude API key (never commit it)
//   TEAM_PASSWORD       shared password given to the team
//
// Cost control: small model, short answers, question length capped.

const KNOWLEDGE = require('./_team-knowledge.js');

const MODEL = 'claude-haiku-5-5';
const MAX_QUESTION = 500;

const SYSTEM = [
  'You are the Noula Day 2026 team assistant. You help volunteers, team members and artists',
  'with practical questions about Noula Day (Saturday 28 November 2026, Montgomery Hall, London)',
  'and the set-up day (Friday 27 November).',
  '',
  'Rules:',
  '- Answer ONLY from the organisation notes below. Never invent times, names, prices or rules.',
  '- If the answer is not in the notes, say so simply and tell them to ask Ruiny (day lead),',
  '  Tricia (1st deputy, until 19h) or Lina (2nd deputy).',
  '- Keep answers short and simple: 1 to 5 lines, plain words, bullet points if useful.',
  '- Answer in the language of the question (English or French).',
  '- Never use long dashes. Use "·" or commas.',
  '- Timings may still change a bit: say so when you give times.',
  '- Do not share personal details beyond what the notes contain.',
  '',
  'ORGANISATION NOTES',
  '==================',
  KNOWLEDGE,
].join(String.fromCharCode(10));

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify(body),
});

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  let data = {};
  try { data = JSON.parse(event.body || '{}'); } catch (e) { return json(400, { error: 'Bad request' }); }

  const expected = process.env.TEAM_PASSWORD || '';
  if (!expected || String(data.password || '').trim() !== expected) {
    return json(401, { error: 'Wrong password' });
  }

  const question = String(data.question || '').trim().slice(0, MAX_QUESTION);
  if (!question) return json(400, { error: 'Please type a question' });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return json(500, { error: 'Assistant not configured yet' });

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 400,
        system: SYSTEM,
        messages: [{ role: 'user', content: question }],
      }),
    });
    const out = await res.json();
    if (!res.ok) return json(502, { error: 'The assistant is busy, please try again.' });
    const text = (out.content || []).filter((b) => b.type === 'text').map((b) => b.text).join(' ').trim();
    return json(200, { answer: text || 'Sorry, no answer. Ask Ruiny, Tricia or Lina.' });
  } catch (e) {
    return json(502, { error: 'The assistant is busy, please try again.' });
  }
};
