---
name: local-memory-find
description: 'Searches this project''s local memory, rules, requirements, and memories linked to work items, and cites every source, so each answer comes from what was agreed. Use when the owner asks what was decided or recorded before, or why, such as "what did we decide", "do we know", or "search my notes". Not for planning or design; use managing-work-items. Only for projects with local memory.'
---

# Local memory: find

Memory is Markdown files in `<main>/memory/`, where `<main>` is the first path `git worktree list` prints. A fresh clone has none, so an empty result there proves nothing: tell the owner.

## Steps

1. Search `<main>/memory/` by two or three words and their synonyms. Search by work item ID with an ending, so `WI-031` does not also match `WI-0310`: `grep -rlE 'WI-031([^0-9]|$)' <main>/memory/`.
2. Read each hit's whole file and check its `status`:
   - `current` is a fact.
   - `needs-review`, a section that starts "Proposal, not approved yet:", and a lesson under "Gotchas and lessons" are not facts. Leave them out unless he asks, and say what they are when you mention them.
   - `superseded` names its replacement in its first body line: answer from that file. `retired` and `withdrawn` are history. `template` is a seed: ignore it.
3. An item's own decisions are in its Questions and Answers, not memory. Memory holds only project-wide decisions (`decision_*.md`).
4. Cite what you use (`.claude/rules/cite-recalled-knowledge.md`).
5. Nothing found: say "I don't know; nothing recorded covers that." Never guess.

Read only. A wrong or old fact: offer to fix it with `local-memory-save`.
