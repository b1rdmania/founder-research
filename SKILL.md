---
name: founder-research
description: Pre-meeting intelligence pipeline for a founder-operated business. Leads with Perplexity deep research across company, founder, market, financials, and presence signals, then reduces everything to a scannable CIA-style brief with non-obvious signals and opening questions. Use before any call with a founder.
version: 1.0.0
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

## Command

```
/founder-research "<Company Name>" <website>
/founder-research "<Company Name>" <website> --sherlock
```

`--sherlock` runs a username search across 400+ platforms. Use when the founder has low public footprint or Perplexity doesn't surface their social accounts.

---

## Pipeline

### Step 0 — Qualification check

Before running deep research, spend 60 seconds checking the business is worth researching.

- WebFetch the homepage — is it live and active?
- Does the business appear to be trading? (products listed, recent content, any press)
- For UK businesses: quick `perplexity_ask` — is it active on Companies House?

If the business is dissolved, dormant, or has no public footprint: stop and tell the user. Do not proceed to deep research.

If it passes: read the full website. WebFetch homepage and key sub-pages (About, Products/Services, Stockists, Team). Note tone, what they emphasise, what they avoid. **The gap between the homepage story and the research is often the most important thing in the brief.**

---

### Step 1 — Layer 1: Parallel deep research

Run all three via `perplexity_research` **simultaneously**. Save raw output to `enrichment/`.

The prompts are in `prompts/` — use them verbatim, substituting the company/founder details.

| Query | Prompt file | Save to |
|---|---|---|
| Company | `prompts/company.md` | `enrichment/company.md` |
| Founder | `prompts/founder.md` | `enrichment/founder.md` |
| Market | `prompts/market.md` | `enrichment/market.md` |

---

### Step 1b — Presence checks (run in parallel with Layer 1)

While deep research runs, do fast checks via `perplexity_search` and WebFetch:

**Social presence**
```
"[company name]" site:instagram.com
"[company name]" site:linkedin.com
```
Note follower count, last post date, content quality — not just "they have Instagram."

**Job listings**
```
"[company name]" jobs OR hiring OR careers
```
Active job listings reveal real priorities. A founder hiring a sales lead is different from one hiring a production operative. Note the roles and what skills they're buying.

**Traffic signal**
WebFetch `https://www.similarweb.com/website/[domain]/`. If blocked: `perplexity_ask "estimated monthly traffic for [domain]"`. A site with no organic traffic is invisible to any customer who doesn't already know the brand.

**AI visibility**
Search Perplexity as a customer would: `"best [product/service] in [city or UK]"`. Does this business appear? If not, it does not exist to AI-assisted discovery.

**Review presence**
Check Trustpilot, Google reviews, relevant retailer listing pages. Zero reviews after years of trading is a signal, not neutral.

**Press**
```
"[company name]" press OR "as seen in" OR interview OR feature
```
Note recency. Coverage from 3+ years ago with nothing since means the brand stopped generating news.

Save to: `enrichment/presence.md`

---

### Step 2 — Layer 2: Gap-fills

After reading Layer 1, run whichever apply. Prompts in `prompts/`.

**Companies House financials** — always run for UK clients
- Prompt: `prompts/financials.md`
- Save to: `enrichment/financials.md`

**Director/key hire history** — run if any appointments or resignations flagged
- Prompt: `prompts/director.md` (substitute name and dates)
- Save to: `enrichment/director-[name].md`

**Pricing** — run if retail prices weren't surfaced in Layer 1
- Prompt: `prompts/pricing.md`
- Save to: `enrichment/pricing.md`

**Customer signal** — run if no reviews or UGC found
- Prompt: `prompts/customer.md`
- Save to: `enrichment/customer.md`

---

### Step 2b — Sherlock (optional, `--sherlock` flag only)

```bash
pip install sherlock-project 2>/dev/null || pip3 install sherlock-project
sherlock [LIKELY_USERNAME] --print-found --output enrichment/sherlock-raw.txt
```

Likely username: firstname, firstnamelastname, or brand handle. Try 1-2 most plausible.

Sherlock checks existence only — not content. Interesting hits need a WebFetch to see what's actually there. Save notable finds to `enrichment/sherlock.md` (summary only).

---

### Step 3 — Reduction

Read all enrichment files. Apply this frame:

> **CIA field profile. 90 seconds before a meeting.** Every sentence must contain a number, a name, or a decision point — or cut it. No "it is worth noting." No category trends unless they directly change how you read this specific business. No adjectives without evidence.

Do not summarise. Extract. Kill hedges. Kill filler.

---

### Step 4 — Write the brief

Write to `brief.md`. See `examples/brief-template.md` for the exact structure and what good looks like.

**Sections:**

`## Snapshot` — 4 sentences max. Who, what state, key tension, what they probably want from this conversation.

`## Company` — named facts only. Legal entity, address, products, channels, pricing if known. One bullet per fact.

`## Founder` — background, communication register, what energises them. Direct quotes preferred.

`## Finances` — table for UK clients:

| | £ | YoY |
|---|---|---|
| Total assets | | |
| Total liabilities | | |
| Net equity | | |
| Cash at bank | | |
| Employees | | |

Flag if accounts are old, abridged, or micro.

`## Distribution` — named channels only. Flag single-channel concentration.

`## Online presence` — one honest line per channel. Traffic signal. AI visibility result. Review count and recency.

`## Job listings` — active roles and what they signal. Skip if none found.

`## Competitors` — 4-6, one line each: positioning + one notable recent fact.

`## Market frame` — 3 bullets max.

`## Non-obvious signals` — the most valuable section. What isn't on the website. Director churn, capacity signals, brand/ops mismatches, pricing gaps, community absence, findability gaps, hiring signals. Each one should be a specific fact with a specific implication.

`## Gaps` — what research couldn't answer and why it matters for the conversation.

`## Opening questions` — 3 questions grounded in the signals. The kind a well-prepared peer asks, not a salesperson.

`## Sources` — list enrichment files used.

**Voice throughout:**
- Orwell rules. No word that can be cut.
- Present tense. Declarative sentences. Numbers not adjectives.
- Mark inference: `(inference)`.

---

### Step 5 — Post-call capture

After the call, paste notes into `conversation.md`. Then:

1. **Reconcile** — which brief findings were confirmed, which were wrong, what was new
2. **Update gaps** — cross off what the call answered, add what it raised
3. **Real constraint** — what is actually blocking them: cash, time, skill, confidence, market?
4. **Mismatches** — where did what they said contradict what the research showed?

Save to `post-call.md`. This is the input for any subsequent work.

---

### Step 6 — Optional Notion push

Push `brief.md` to Notion as a sub-page under the relevant parent page.

---

## Key learnings

- **Qualify first.** Check the site is live before burning Perplexity credits.
- **Read the website before any queries.** The gap between homepage story and research findings is usually the most important output.
- **Companies House always, for UK clients.** Cash, equity, director churn — facts no founder will volunteer.
- **Director appointment/resignation history is a tell.** Appointed and terminated inside 3 months reveals more about operational stress than any press release.
- **Job listings reveal real priorities.** More honest than their stated strategy.
- **AI visibility is a real finding.** Can't find them searching as a customer = they don't exist to that channel.
- **Zero reviews after years of trading is a signal.** Not neutral.
- **Price opacity is a finding.** Flag it and ask why.
- **Raw Perplexity output is unusable.** Always reduce. The brief reads in 90 seconds.
- **The post-call reconcile is where the real intelligence is.** The brief is a hypothesis. The call confirms or breaks it.
