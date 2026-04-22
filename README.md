# founder-research

Perplexity-powered pre-meeting intelligence for a founder-operated business. Runs parallel deep research on company, founder, and market — then layers in brand presence, SEO signals, job listings, financial filings, and social content quality. Reduces to a 90-second brief: named facts, non-obvious signals, and opening questions.

Built for consultants, investors, journalists, and advisors who need to understand a business before a call.

## Usage

```
/founder-research "Acme Ltd" acme.co.uk
/founder-research "Acme Ltd" acme.co.uk --sherlock
```

`--sherlock` runs a username search across 400+ platforms. Use when Perplexity doesn't surface the founder's social accounts.

## What it researches

**Layer 1 — Perplexity deep research (parallel)**
- Company: products, distribution, pricing, positioning, recent news
- Founder: background, communication register, public output, direct quotes
- Market: size, competitors with specifics, distribution dynamics, customer profile

**Layer 2 — Brand and presence (parallel with Layer 1)**
- Website quality: platform, PageSpeed score, photography, copy
- Google search appearance — what a customer actually finds
- SEO signal: indexed, ranking for category terms, organic presence
- Social: content quality and cadence, not just follower counts
- AI visibility: does this business appear when a customer searches Perplexity?
- Job listings: what they're actively hiring reveals real priorities
- Reviews: actual quotes, not just star ratings. Zero reviews is a finding.
- Press: recency matters — coverage from 3 years ago with nothing since is a signal

**Layer 3 — Gap-fills (on demand)**
- Financial filings: balance sheet, cash, director history (UK Companies House; equivalent registries for other countries)
- Director research: who they brought in, why, what happened
- Competitor pricing table
- Customer UGC and community signal

## What it produces

```
enrichment/
  company.md          Perplexity — company basics, products, distribution
  founder.md          Perplexity — background, register, public output
  market.md           Perplexity — size, competitors, trends
  presence.md         brand, SEO, social, AI visibility, reviews, press
  financials.md       financial filing + director history
  pricing.md          competitor pricing table (if run)
  customer.md         reviews and UGC (if run)
  director-[name].md  individual director research (if flagged)
brief.md              final brief — reads in 90 seconds
post-call.md          reconciled notes after the call
```

## Requirements

- [Perplexity MCP](https://github.com/ppl-ai/modelcontextprotocol) configured in Claude Code — core dependency
- `sherlock-project` Python package — only for `--sherlock`
- Notion MCP — only if pushing brief to Notion

## Install

```bash
git clone https://github.com/b1rdmania/founder-research ~/.claude/skills/founder-research
```

## Repo structure

```
SKILL.md                  full pipeline
prompts/                  verbatim Perplexity query templates
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
