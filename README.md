# founder-research

Pre-meeting intelligence pipeline for a founder-operated business. Runs layered Perplexity deep research — company, founder, market, Companies House financials, job listings, social presence, traffic signals — then reduces everything to a 90-second CIA-style brief with non-obvious signals and opening questions.

Built for consultants, investors, journalists, and advisors who need to understand a business before a call.

## Usage

```
/founder-research "Acme Ltd" acme.co.uk
/founder-research "Acme Ltd" acme.co.uk --sherlock
```

`--sherlock` hunts the founder's username across 400+ platforms. Use when Perplexity doesn't surface their social accounts.

## What it produces

```
enrichment/
  company.md          raw Perplexity output — company basics, products, distribution
  founder.md          raw Perplexity output — background, register, public output
  market.md           raw Perplexity output — market size, competitors, trends
  financials.md       Companies House balance sheet + director history (UK)
  presence.md         social, traffic, AI visibility, reviews, press
  pricing.md          competitor pricing table (if run)
  customer.md         reviews and UGC signal (if run)
  director-[name].md  individual director research (if flagged)
brief.md              the final brief — reads in 90 seconds
post-call.md          reconciled notes after the call (Step 5)
```

## What it doesn't do

- Does not contact the business or send anything externally
- Does not make engagement or investment recommendations
- Companies House data is UK only
- `--sherlock` checks account existence, not content

## Requirements

- [Perplexity MCP](https://github.com/ppl-ai/modelcontextprotocol) configured in Claude Code
- `sherlock-project` Python package — only needed for `--sherlock`
- Notion MCP — only needed if pushing brief to Notion

## Install

```bash
git clone https://github.com/b1rdmania/founder-research ~/.claude/skills/founder-research
```

## Repo structure

```
SKILL.md                  skill definition and pipeline
prompts/                  Perplexity query templates — use verbatim
  company.md
  founder.md
  market.md
  financials.md
  director.md
  pricing.md
  customer.md
examples/
  brief-template.md       annotated output template showing what good looks like
```

## License

MIT
