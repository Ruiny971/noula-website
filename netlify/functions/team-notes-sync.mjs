// Scheduled function: every 10 minutes, copies the shared Notion space
// (Noula Day 2026) into Netlify Blobs, so the team assistant always answers
// from the latest Notion pages. Can also be run by hand in Netlify:
// Logs > Functions > team-notes-sync > Run now.
//
// Env var needed: NOTION_TOKEN

import { getStore } from '@netlify/blobs';
import buildNotes from './_notion-notes.js';

export default async () => {
  const token = process.env.NOTION_TOKEN;
  if (!token) return new Response('NOTION_TOKEN missing', { status: 500 });

  const text = await buildNotes(token);
  // Safety: don't replace good notes with an empty or broken copy.
  if (!text || text.length < 2000) return new Response('Notes too short, kept the old copy', { status: 500 });

  await getStore('team-assistant').set('notes', JSON.stringify({ text, at: new Date().toISOString() }));
  return new Response('Synced ' + text.length + ' characters');
};

export const config = { schedule: '*/10 * * * *' };
