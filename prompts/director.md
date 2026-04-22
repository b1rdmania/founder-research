# Director History Prompt

Use with `perplexity_research` when a director appointment or resignation is flagged in financials. Substitute all fields.

---

Research [DIRECTOR FULL NAME], who was appointed as [ROLE] at [COMPANY NAME] on [APPOINTMENT DATE] [and resigned on [RESIGNATION DATE]].

I need:

- **Professional background**: career history, previous roles with company names and dates
- **Other directorships**: current and recent Companies House appointments — what else do they run or sit on?
- **Public commentary**: anything they've said publicly about their time at [COMPANY NAME], or anything the company said about the appointment or departure
- **Most plausible reason they were brought in**: based on their background, what skill or relationship were they hired for? (inference is fine here — flag it clearly)
- **Why they likely left**: if any public signal exists. Flag if this is inference.

Named facts only. Separate confirmed facts from inference clearly.
