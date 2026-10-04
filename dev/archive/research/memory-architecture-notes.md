# Notes on "A practical architecture for shared AI agent memory"

Mike shared this research note on 2026-09-27. It describes a vendor-neutral
memory service for many agents and many people. This file records how it
maps to Toolkit V2's memory, which serves one solo developer.

## Already in Toolkit V2

- Evidence versus approved knowledge: `event` records hold what happened;
  other types hold reusable facts; `supersedes` keeps history.
- Types: working state = current focus; episode = `event`; semantic
  knowledge = `project` and `reference`; preference = `user` and `feedback`;
  decisions = `DECISIONS.md` and work items; procedures = rules and skills.
- One short contract: the memory policy is written once, in `memory-save`.
- Save only what helps later; an explicit "remember" is the owner's approval.
- Search before saving; update the existing record instead of adding one.
- Writes carry an expected version (`--expect`) and a lock, so two sessions
  cannot silently overwrite each other.
- A compact briefing at session start, then retrieval when needed.
- Failed or unverified saves are reported ("saved but not verified").

## Added on Mike's approval (2026-09-27)

1. Saved proposals (`needs-review`), listed by work-decide.
2. A duplicate check inside `toolkit memory save`.
3. Clean deletes across the briefing, Hindsight, and Notion caches.
4. A memory test set: fresh-session handoff, corrected fact, abstaining
   without evidence, no leak between projects.

## Left out for a solo setup

Tenants and organization boundaries, per-identity access control, review
roles, legal hold, sensitivity classes, world-time fields
(`valid_from`/`valid_until`), graph stores, and broad automatic capture.
