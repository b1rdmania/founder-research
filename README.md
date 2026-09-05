# What they won't tell you

Deep research on any founder and their business. Reduces to a 90-second brief with the signals that aren't on their website.

Built for consultants, investors, journalists, and advisors who need to understand a business before a call. Runs on [Exa](https://exa.ai) via Claude Code — company, founder, market, financials, brand presence, SEO, job listings, and social signals swept in parallel, every lead chased to its primary record, and reduced to what actually matters.

The rule the whole pipeline runs on: **search finds leads, only a primary record makes a fact.** Exa does the finding and the fetching. The record does the proving.

**Recommended: run with Claude Opus 4.7.** The research phase requires judgment — deciding which threads to pull, what to skip, how to read conflicting signals. Opus handles this better than a prescriptive checklist.

## Usage

```
/founder-research "Acme Ltd" acme.co.uk
/founder-research "Acme Ltd" acme.co.uk --sherlock
```

`--sherlock` hunts the founder's username across 400+ platforms. Use when the sweep doesn't surface their social accounts.

## What it researches

**Layer 1 — Sweep and extract (parallel)**
- Company: `sweep --category company` then a typed `extract` — entity, founders, funding, leadership changes
- Founder: `sweep --category people` then a typed `extract` — roles, public output, direct quotes, each field cited
- Market: recent moves by `sweep --category news`; the narrative from Perplexity if you have it

**Layer 2 — Brand and presence (parallel with Layer 1)**
- Website quality: platform, PageSpeed, photography, copy
- Google search: what a customer actually finds when they look
- SEO signal: indexed, ranking for category terms, organic presence
- Social: content quality and cadence — not just follower counts
- AI visibility: does this business appear when a customer asks a search engine or an AI?
- Job listings: what they're hiring reveals priorities more honestly than their strategy page
- Reviews: actual quotes. Zero reviews after years of trading is a finding.
- Press: recency matters

**Layer 3 — Gap-fills (on demand, judgment call)**
- Financial filings: Companies House pages live-crawled with `fetch` — balance sheet, cash, director history (pin any other registry with `--domains`)
- Director research: who they brought in, why, what happened
- Competitor pricing table
- Customer UGC and community signal

## What it produces

```
enrichment/           raw research files (gitignored — stays on your machine)
brief.md              final brief, reads in 90 seconds
post-call.md          reconciled notes after the call
```

## Setup

**1. Get an Exa key**

Sign up at [dashboard.exa.ai](https://dashboard.exa.ai) and put the key in `~/.exa-key` (or export `EXA_API_KEY`). Node 18+ is the only dependency. A full run costs well under a dollar: standard search is $0.007 a call, deep search $0.012, a page fetch $0.001.

Without a key the skill degrades to Claude Code's built-in `WebSearch` and `WebFetch`.

**Optional: Perplexity MCP.** Still useful for narrative angles (market story, the contrarian read). Add it to `~/.claude.json`:

```json
{
  "mcpServers": {
    "perplexity": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@perplexity-ai/mcp-server"],
      "env": { "PERPLEXITY_API_KEY": "pplx-..." }
    }
  }
}
```

**2. Install the skill**

```bash
git clone https://github.com/b1rdmania/founder-research ~/.claude/skills/founder-research
```

**3. Optional: Notion push**

If you want to push briefs to Notion, add the [Notion MCP](https://github.com/makenotion/notion-mcp-server) to your config and set `NOTION_TOKEN`.

**4. Optional: Sherlock**

```bash
pip install sherlock-project
```

## Repo structure

```
SKILL.md                  skill definition and pipeline
scripts/exa.mjs           sweep / fetch / extract — the Exa layer, no dependencies
schemas/                  extract schemas (person, company) — Exa caps them at 10 properties
prompts/                  query templates — reference, not mandatory
  company.md
  founder.md
  market.md
  financials.md           UK Companies House (adapt for other registries)
  director.md
  pricing.md
  customer.md
examples/
  brief-template.md       annotated output showing what good looks like
```

## License

MIT
