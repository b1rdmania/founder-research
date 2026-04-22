# founder-research

Perplexity-powered pre-meeting intelligence for a founder-operated business. Runs deep research on company, founder, and market in parallel — then layers in brand presence, SEO signals, job listings, financial filings, and social content quality. Reduces to a 90-second brief: named facts, non-obvious signals, and opening questions.

Built for consultants, investors, journalists, and advisors who need to understand a business before a call.

**Recommended: run with Claude Opus 4.7.** The research phase requires judgment — deciding which threads to pull, what to skip, how to read conflicting signals. Opus handles this better than a prescriptive checklist.

## Usage

```
/founder-research "Acme Ltd" acme.co.uk
/founder-research "Acme Ltd" acme.co.uk --sherlock
```

`--sherlock` hunts the founder's username across 400+ platforms. Use when Perplexity doesn't surface their social accounts.

## What it researches

**Layer 1 — Perplexity deep research (parallel)**
- Company: products, distribution, pricing, positioning, recent news
- Founder: background, communication register, public output, direct quotes
- Market: size and growth, named competitors with specifics, distribution dynamics

**Layer 2 — Brand and presence (parallel with Layer 1)**
- Website quality: platform, PageSpeed, photography, copy
- Google search: what a customer actually finds when they look
- SEO signal: indexed, ranking for category terms, organic presence
- Social: content quality and cadence — not just follower counts
- AI visibility: does this business appear when a customer searches Perplexity?
- Job listings: what they're hiring reveals priorities more honestly than their strategy page
- Reviews: actual quotes. Zero reviews after years of trading is a finding.
- Press: recency matters

**Layer 3 — Gap-fills (on demand, judgment call)**
- Financial filings: balance sheet, cash, director history (UK Companies House; equivalent registries for other countries if available)
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

**1. Install the Perplexity MCP**

Perplexity is the core dependency. Add it to your Claude Code MCP config (`~/.claude.json`):

```json
{
  "mcpServers": {
    "perplexity": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@perplexity-ai/mcp-server"],
      "env": {
        "PERPLEXITY_API_KEY": "pplx-..."
      }
    }
  }
}
```

Get an API key at [perplexity.ai/settings/api](https://www.perplexity.ai/settings/api). The `perplexity_research` tool (used for deep research) costs roughly $0.005 per query — a full run is a few cents.

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
prompts/                  Perplexity query templates — reference, not mandatory
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
