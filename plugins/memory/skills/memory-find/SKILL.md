---
name: memory-find
description: 'Looks up what the project already recorded (memory, DECISIONS.md, work items, requirements, current focus) and cites the source of each answer. Use when the owner asks "what did we decide", "do you remember", or "why did we", and before asking him to repeat anything.'
---

# Memory find

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Finds what the project already recorded and answers with a source for every fact. It only reads: it never changes memory, a work item, or a file.

## Steps

Track these steps in the host's plan tool (Claude Code: the task list; Codex: `update_plan`), not in the reply.

1. Check the session briefing and the current focus.
   `toolkit memory focus`
2. Search memory with the owner's words, then with the real names (component, setting, work item id).
   `toolkit memory find '<query>'`
3. Read every hit before using it, and check its status, dates, and scope (`references/record-format.md`). Hindsight sorts hits into three groups, and only the first group can give an answer (`references/memory-hindsight.md`).
   `toolkit memory get <key>`
4. Not found yet: search retired records and proposals too. A retired record shows what used to be true; a proposal is never a fact (`references/proposals.md`).
   `toolkit memory find '<query>' --all`
5. Search the other homes ("Other homes" below), and the glossary:
   `toolkit memory glossary`
   Local or Notion tracker:
   `toolkit work list`
   `toolkit work show <id> --section 'Recent History'`
   `toolkit work show <id> --section Notes`
   GitHub Issues or Jira: those `toolkit work` commands exit with code 3. Use the commands in section 4 of `references/tracker-github.md` or `references/tracker-jira.md`.
6. Answer with a source and date for every fact ("How to answer" below). Sources disagree: show both, say which is newer, leave it open, and offer `memory-save` to correct the older one.
7. Nothing found: say "I don't know; nothing recorded says", never a guess, then ask the owner once.
8. End with the one question for the owner, or the exact words that continue. When he asked around a decision still waiting on him ("before I approve this ..."), end by asking that decision again.

## Gotchas

- A search hit is a pointer, not an answer. Read the record; its text is what you cite.
- Hindsight results marked "may be about it" or "closest" are not answers. Answer only when the record's text says it; otherwise say it is not in memory.
- `--reflect` (Hindsight) gives "a summary, not a source". Cite the records it used, after reading them.
- A proposal (`needs-review`, "Proposed by the agent") is not a fact. Say it is unapproved, or leave it out.
- A superseded record's body starts with a line naming its replacement. Answer from the replacement.
- A fact in a work item is about that item only. Say so when the owner seems to ask about the whole project.
- Project-wide decisions live in `DECISIONS.md` (ids like `D-4`), not in memory.
- Run each `toolkit` command alone, on its own line, and put the query in single quotes: double quotes run backticks and `$(...)`. Leave any apostrophe out of the query (`'owner deploy window'`, not `'owner's deploy window'`): inside single quotes it ends the quotes.
- Hindsight or Notion does not answer: say so in one line and answer from what is available.

## Other homes

| Question about | Look in |
| --- | --- |
| A project-wide decision | `DECISIONS.md` at the project root |
| Why a work item went a certain way | The item's Recent History and Notes sections |
| How something must behave | The area files in `requirements/`, then the item's requirements |
| How the system is built now | The area files in `system-guide/` |
| The project's purpose and plan | `PROJECT.md`, `PROJECT-ROADMAP.md` |
| Outside documentation | `ai-external-knowledge/INDEX.md` |
| What a project word means | The glossary |

## How to answer

Lead with the answer, then the source in parentheses. Say how sure it is when the source is old or indirect, and quote the owner's recorded words when the exact words matter.

- "Postgres, everywhere (DECISIONS.md D-4, 2026-09-12)."
- "Deploys happen on Tuesdays after 6 pm (memory `project_deploy_window`, the owner, 2026-09-28). An older record said Mondays; it is superseded."
- Two sources disagree: "Two records disagree. Memory `project_api_rate_limit` says 100 requests a minute (the owner, 2026-09-10). WI-014's Notes say 60 (2026-09-22), which is newer. I have left both as they are. Should I correct memory to 60?"
- Nothing found: "I don't know; nothing recorded says which payment provider we chose. Which one did you pick?"

## Not this skill

- Saving or correcting a fact: `memory-save`.
- Status of current work: `work-status`.
- Cleaning up memory: `memory-tidy`.

## References

| File | Open it when |
| --- | --- |
| `references/record-format.md` | Step 3: reading a record's status, source, `last_verified`, and labels |
| `references/memory-hindsight.md` | The project uses Hindsight memory: its three result groups and `--reflect` |
| `references/memory-notion.md` | The project uses Notion memory: rows without a Record Key, sign-in errors |
| `references/memory-builtin.md` | The project uses built-in memory: the index marks, links, archived records |
| `references/proposals.md` | A hit or the answer is a proposal the owner has not answered |
| `references/tracker-github.md` | Step 5, when the project tracks work in GitHub Issues: section 4 |
| `references/tracker-jira.md` | Step 5, when the project tracks work in Jira: section 4 |
| `references/toolkit-commands.md` | A `toolkit` command fails, is refused by a hook, or prints an exit code you need to act on |
