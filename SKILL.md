---
name: founder-research
description: Pre-meeting intelligence pipeline for a founder-operated business. Leads with Perplexity deep research across company, founder, market, financials, and presence signals, then reduces everything to a scannable CIA-style brief with non-obvious signals and opening questions. Use before any call with a founder.
version: 1.1.0
tools:
  - Bash
  - Read
  - Write
  - WebFetch
  - mcp__perplexity__perplexity_research
  - mcp__perplexity__perplexity_ask
  - mcp__perplexity__perplexity_search
license: MIT
---

# Founder Research

Pre-meeting intelligence for anyone who needs to understand a founder-operated business before a call — consultants, investors, journalists, advisors, potential partners.

Takes public information. Produces a CIA-style brief: named facts, non-obvious signals, gaps, and suggested opening questions. No fluff. Reads in 90 seconds.

**Recommended model: Claude Opus 4.7.** The deep research phase benefits from a model that can make judgment calls about what to pursue, synthesise conflicting signals, and decide what actually matters — not just execute a checklist.

## Command

```
/founder-research "<Company Name>" <website>
/founder-research "<Company Name>" <website> --sherlock
```

`--sherlock` runs a username search across 400+ platforms. Use when the founder has low public footprint or Perplexity doesn't surface their social accounts.

---

## How this works

This skill is intentionally not a rigid step-by-step script. Every business is different. Use the structure below as a framework, not a checklist — decide as you go which threads are worth pulling and which aren't. The prompts in `prompts/` are starting points, not mandatory queries.

The goal is a brief that reads in 90 seconds and tells you something you wouldn't have found on the homepage. That requires judgment, not just research.

---

## Pipeline

### Step 0 — Qualify and read the website

Before running any research, spend 60 seconds checking this is worth doing.

WebFetch the homepage. Is the site live? Does the business appear to be trading? If it's dissolved, dormant, or has no public presence worth investigating — stop and tell the user.

If it passes: read the website properly. Homepage, About, Products or Services, any Stockists or Team page. Note the tone, what they emphasise, what's conspicuously absent. **The gap between the homepage story and what the research surfaces is often the most important thing in the brief.**

---

### Step 1 — Deep research

Use `perplexity_research` to investigate the company, founder, and market. Run in parallel where possible.

Reference prompts are in `prompts/` — use them as a starting point and adapt based on what you already know about this business. You don't need to run every prompt. Use judgment: if the founder has no public profile, a detailed founder query will return little; if the market is niche, a broad market query will return generalities. Adjust accordingly.

**Company** (`prompts/company.md`) — products, distribution, pricing, positioning, recent news
**Founder** (`prompts/founder.md`) — background, communication register, public output, direct quotes
**Market** (`prompts/market.md`) — size, named competitors with specifics, distribution dynamics, customer profile

Save raw output to `enrichment/`.

---

### Step 2 — Brand and presence

While deep research is running, work through the brand and online presence. Think like a prospective customer, journalist, or stockist who's just heard the name for the first time. Follow that customer journey — what do they find? Where does it break down?

Areas to cover — use judgment on which matter for this specific business:

**Website** — platform, load quality, photography, copy. Run PageSpeed if it's a consumer brand:
```bash
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://[domain]&strategy=mobile" 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print('Score:', d['lighthouseResult']['categories']['performance']['score'])" 2>/dev/null || echo "check at pagespeed.web.dev"
```

**Google search appearance** — `perplexity_search "[company name]"`. What does a customer actually find? Their site, a bad review, nothing?

**SEO signal** — does the site have content? Does it rank for category terms? No organic presence = invisible to anyone who doesn't already know the brand.

**Social** — search `"[company name]" site:instagram.com` and equivalent. Don't just log follower counts. Is the content good? When was the last post? A stale account with 10k followers is worse than an active one with 500.

**AI visibility** — search Perplexity as a customer: `"best [product/service] in [city]"`. Does this business appear? Increasingly how buyers find suppliers.

**Job listings** — `"[company name]" jobs OR hiring site:linkedin.com`. What skills are they buying? Often more honest about priorities than their strategy page.

**Reviews** — Trustpilot, Google, retailer listing pages. Pull actual quotes, not just star ratings. Zero reviews after years of trading is a finding.

**Press** — `"[company name]" press OR interview OR feature OR award`. Note recency — 3-year-old coverage with nothing since is a signal.

Save to `enrichment/presence.md`.

---

### Step 3 — Gap-fills

Read what you have. Decide what's missing and matters. Run only what will actually change the brief.

**Financial filings** — for UK businesses, always worth pulling via `prompts/financials.md`. Cash, equity, and director history are facts no founder will volunteer. For non-UK businesses, check equivalent registries (Irish CRO, Australian ASIC, US SEC EDGAR for public companies) — if none exists, note it and move on.

**Director research** — if the financials flag an appointment or resignation, use `prompts/director.md`. A co-director hired and gone in 3 months is more revealing than anything on the website.

**Pricing** — if you couldn't find retail prices in Layer 1, use `prompts/pricing.md`. Price opacity is itself a finding.

**Customer signal** — if reviews are absent or thin, use `prompts/customer.md`. No UGC after years of trading says something.

**Sherlock** (`--sherlock` flag) — runs username search across 400+ platforms. Use when the founder's social footprint is thin or inconsistent with what you'd expect.
```bash
pip install sherlock-project 2>/dev/null || pip3 install sherlock-project
sherlock [LIKELY_USERNAME] --print-found --output enrichment/sherlock-raw.txt
```
Sherlock checks existence only. Interesting hits need a WebFetch. Save notable finds to `enrichment/sherlock.md`.

---

### Step 4 — Reduce

Read all enrichment files. Apply this frame before writing anything:

> CIA field profile. 90 seconds before a meeting. Every sentence must contain a number, a name, or a decision point — or it gets cut. No "it is worth noting." No category trends unless they directly change how you read this specific business. No adjectives without evidence.

Extract, don't summarise. Kill hedges. Kill filler.

---

### Step 5 — Write the brief

Write to `brief.md`. See `examples/brief-template.md` for structure and what good looks like.

**Required sections:**

`## Snapshot` — 4 sentences. Who, what state the business is in, the key tension, what they probably want from this call.

`## Company` — named facts. Legal entity, address, products, channels, pricing if known.

`## Founder` — background, register, what energises them. Direct quotes where available.

`## Finances` — balance sheet table if filings were available. Flag if accounts are old, micro, or abridged. Skip section if no filing data exists.

`## Distribution` — named channels only. Flag concentration risk.

`## Online presence` — one honest line per relevant channel. AI visibility result. Review count and recency.

`## Job listings` — active roles and what they signal. Omit if nothing found.

`## Competitors` — 4-6, one line each: positioning + one recent fact.

`## Market frame` — 3 bullets max.

`## Non-obvious signals` — the most valuable section. Specific facts with specific implications. Not observations — signals. Director churn, capacity gaps, brand/market mismatches, pricing opacity, community absence, findability gaps. If it's on the homepage, it doesn't belong here.

`## Gaps` — what research couldn't answer and why it matters.

`## Opening questions` — 3 questions grounded in the signals. A well-prepared peer, not a salesperson.

`## Sources` — list enrichment files used.

**Voice:** Orwell rules throughout. Present tense. No word that can be cut. Mark inference as `(inference)`.

---

### Step 6 — Post-call capture

After the call, paste notes into `conversation.md`. Reconcile against the brief:

- Which findings were confirmed, which were wrong, what was new
- What gaps the call answered and what it opened
- What is actually blocking them: cash, time, skill, confidence, market?
- Where what they said contradicted what the research showed

Save to `post-call.md`. This becomes the input for any subsequent work.

---

### Step 7 — Optional Notion push

Push `brief.md` to Notion as a sub-page. Raw enrichment files stay on disk only.

---

## What to look for

Patterns that consistently surface in founder research and belong in the Non-obvious signals section:

- **Director churn** — hired and gone fast, especially with MD or commercial titles. Operational stress signal.
- **Capacity signals** — factory or office moved to larger premises, wholesale/white label offered openly. Supply ahead of demand.
- **Brand/market mismatch** — brand says "affordable and accessible" but distribution is premium-specialist only.
- **Brand/ops mismatch** — "London artisan brand" with a rural factory, "tech-first company" with no engineering hires.
- **Price opacity** — every competitor publishes prices; this one doesn't. Confidence signal.
- **Single-channel concentration** — one retailer, one platform, one geography. Existential dependency.
- **Zero community** — years of trading, no reviews, no UGC, no social engagement. Flywheel was never built.
- **AI invisibility** — doesn't appear when you search as a customer. Invisible to an increasingly important discovery channel.
- **Hiring signals** — bringing in a sales director suggests commercial muscle gap; production hire suggests demand is real.
- **Founder doing the wrong job** — technical or craft founder now doing commercial, financial, or operational work they didn't sign up for.
