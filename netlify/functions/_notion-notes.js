// Reads the shared "Noula Day 2026" space in Notion and turns it into plain text
// for the team assistant. Used by team-notes-sync.mjs (runs every 10 minutes).
// Needs the env var NOTION_TOKEN (a Notion integration with access to the page).

const NOTION = 'https://api.notion.com/v1';
const ROOT_ID = '3d5bb2225dc081c09c2cdb4691a2511a'; // Noula Day 2026 (shared team space)
const ROOT_TITLE = 'Noula Day 2026';
const SKIP = [/inventory/i];   // pages we don't need
const MAX_PAGES = 90;
const WORKERS = 3;             // Notion allows about 3 requests per second

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(path, token, tries = 0) {
  const res = await fetch(NOTION + path, {
    headers: { Authorization: 'Bearer ' + token, 'Notion-Version': '2022-06-28' },
  });
  if (res.status === 429 && tries < 6) {
    const wait = (Number(res.headers.get('retry-after')) || 1) * 1000;
    await sleep(wait);
    return api(path, token, tries + 1);
  }
  if (!res.ok) throw new Error('Notion ' + res.status + ' on ' + path);
  return res.json();
}

async function children(id, token) {
  let all = [];
  let cursor = null;
  do {
    const q = '/blocks/' + id + '/children?page_size=100' + (cursor ? '&start_cursor=' + cursor : '');
    const j = await api(q, token);
    all = all.concat(j.results || []);
    cursor = j.has_more ? j.next_cursor : null;
  } while (cursor);
  return all;
}

const plain = (rt) => (rt || []).map((t) => t.plain_text).join('');

const NESTED = ['bulleted_list_item', 'numbered_list_item', 'to_do', 'toggle', 'quote',
  'callout', 'column_list', 'column', 'synced_block'];

async function blocksToLines(blocks, token, depth, foundPages) {
  const lines = [];
  const pad = '  '.repeat(depth);
  for (const b of blocks) {
    const v = b[b.type] || {};
    let line = null;
    switch (b.type) {
      case 'heading_1': line = '# ' + plain(v.rich_text); break;
      case 'heading_2': line = '## ' + plain(v.rich_text); break;
      case 'heading_3': line = '### ' + plain(v.rich_text); break;
      case 'paragraph': line = plain(v.rich_text); break;
      case 'bulleted_list_item':
      case 'numbered_list_item': line = '- ' + plain(v.rich_text); break;
      case 'to_do': line = '- ' + (v.checked ? '[done] ' : '[ ] ') + plain(v.rich_text); break;
      case 'quote':
      case 'callout':
      case 'toggle': line = plain(v.rich_text); break;
      case 'bookmark':
      case 'embed': line = v.url || null; break;
      case 'table': {
        const rows = await children(b.id, token);
        for (const r of rows) {
          if (r.table_row) lines.push(pad + '| ' + r.table_row.cells.map(plain).join(' | ') + ' |');
        }
        continue;
      }
      case 'child_page':
        foundPages.push({ id: b.id, title: v.title || '' });
        continue;
      default:
        break;
    }
    if (line) lines.push(pad + line);
    if (b.has_children && depth < 3 && NESTED.includes(b.type)) {
      const kids = await children(b.id, token);
      const sub = await blocksToLines(kids, token, depth + 1, foundPages);
      for (const s of sub) lines.push(s);
    }
  }
  return lines;
}

module.exports = async function buildNotes(token) {
  const queue = [{ id: ROOT_ID, title: ROOT_TITLE }];
  const seen = new Set();
  const parts = [];
  let active = 0;

  async function worker() {
    while (queue.length || active > 0) {
      const page = queue.shift();
      if (!page) { await sleep(150); continue; }
      const key = page.id.replace(/-/g, '');
      if (seen.has(key) || seen.size >= MAX_PAGES) continue;
      seen.add(key);
      if (SKIP.some((r) => r.test(page.title))) continue;
      active++;
      try {
        const found = [];
        const blocks = await children(page.id, token);
        const lines = await blocksToLines(blocks, token, 0, found);
        parts.push({ title: page.title, text: lines.filter(Boolean).join('\n') });
        for (const f of found) queue.push(f);
      } catch (e) {
        parts.push({ title: page.title, text: '(could not read this page)' });
      } finally {
        active--;
      }
    }
  }

  const workers = [];
  for (let i = 0; i < WORKERS; i++) workers.push(worker());
  await Promise.all(workers);

  // Root page first, then the rest in a stable order.
  parts.sort((a, b) => (a.title === ROOT_TITLE ? -1 : b.title === ROOT_TITLE ? 1 : a.title.localeCompare(b.title)));
  return parts.map((p) => '=== PAGE: ' + p.title + ' ===\n' + p.text).join('\n\n');
};
