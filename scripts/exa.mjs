#!/usr/bin/env node
// Exa discovery + fetch layer for founder-research.
//
// Search finds leads. Only a primary record makes a fact. This script does the
// finding (sweep), the fetching (fetch) and the structured lead extraction
// (extract). It never decides what is true — that stays with the pipeline.
//
//   exa.mjs sweep   "<query>" [--category people|company|news|publication|personal site|financial report]
//                             [--domains a.com,b.org] [--since YYYY-MM-DD] [--n 8] [--type auto|fast|deep-lite]
//   exa.mjs fetch   <url> [<url>...]            live-crawl page text (maxAgeHours 0)
//   exa.mjs extract "<question>" --schema <file.json> [--type deep|deep-reasoning] [--n 10]
//
// JSON on stdout. Cost on stderr. Key: $EXA_API_KEY, else ~/.exa-key, else .env next to this file.

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

function apiKey() {
  if (process.env.EXA_API_KEY) return process.env.EXA_API_KEY.trim();
  const keyFile = join(homedir(), '.exa-key');
  if (existsSync(keyFile)) return readFileSync(keyFile, 'utf8').trim();
  const envFile = join(here, '..', '.env');
  if (existsSync(envFile)) {
    const m = readFileSync(envFile, 'utf8').match(/^EXA_API_KEY=(.*)$/m);
    if (m) return m[1].trim();
  }
  die('No Exa key. Set EXA_API_KEY, or write it to ~/.exa-key (get one at https://dashboard.exa.ai).');
}

function die(msg, code = 1) { console.error(msg); process.exit(code); }

function args(argv) {
  const pos = [], opt = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) { opt[a.slice(2)] = argv[i + 1]; i++; }
    else pos.push(a);
  }
  return { pos, opt };
}

async function call(path, body) {
  const res = await fetch(`https://api.exa.ai${path}`, {
    method: 'POST',
    headers: { 'x-api-key': apiKey(), 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) die(`exa ${res.status}: ${data.error || JSON.stringify(data).slice(0, 300)}`);
  if (data.costDollars) console.error(`exa ${path} $${data.costDollars.total}`);
  return data;
}

const lead = (r) => ({
  title: r.title ?? null,
  url: r.url,
  published: r.publishedDate ?? null,
  author: r.author ?? null,
  text: r.text ?? null,
});

async function sweep({ pos, opt }) {
  const query = pos[0];
  if (!query) die('usage: exa.mjs sweep "<query>" [--category ..] [--domains ..] [--since ..] [--n ..]');
  const body = {
    query,
    type: opt.type || 'auto',
    numResults: Number(opt.n || 8),
    contents: { text: { maxCharacters: Number(opt.chars || 1500) } },
  };
  if (opt.category) body.category = opt.category;
  if (opt.domains) body.includeDomains = opt.domains.split(',').map((s) => s.trim()).filter(Boolean);
  if (opt.since) body.startPublishedDate = new Date(opt.since).toISOString();
  const data = await call('/search', body);
  return (data.results || []).map(lead);
}

async function fetchPages({ pos }) {
  if (!pos.length) die('usage: exa.mjs fetch <url> [<url>...]');
  const data = await call('/contents', {
    urls: pos,
    text: { maxCharacters: 20000 },
    maxAgeHours: 0, // live crawl — a record fetched stale is not a record
  });
  return (data.results || []).map((r) => ({ ...lead(r), fetched_at: new Date().toISOString() }));
}

async function extract({ pos, opt }) {
  const query = pos[0];
  if (!query || !opt.schema) die('usage: exa.mjs extract "<question>" --schema <file.json> [--type deep|deep-reasoning]');
  const outputSchema = JSON.parse(readFileSync(opt.schema, 'utf8'));
  const data = await call('/search', {
    query,
    type: opt.type || 'deep',
    numResults: Number(opt.n || 10),
    outputSchema,
  });
  // `output.content` is a lead object, not a set of facts. `grounding` says which
  // source each field came from and how confident Exa is. Chase every URL.
  return {
    content: data.output?.content ?? null,
    grounding: data.output?.grounding ?? [],
    sources: (data.results || []).map((r) => ({ title: r.title ?? null, url: r.url })),
  };
}

const verbs = { sweep, fetch: fetchPages, extract };
const [verb, ...rest] = process.argv.slice(2);
if (!verbs[verb]) die(`usage: exa.mjs <sweep|fetch|extract> ...\n${readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 13).join('\n')}`);
const out = await verbs[verb](args(rest));
process.stdout.write(JSON.stringify(out, null, 1) + '\n');
