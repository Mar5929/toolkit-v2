---
name: memory-find
description: 'Finds what the project already knows in memory, decisions, work items, requirements, and the current focus, and cites the source of each answer. Use when the owner asks "what did we decide", "do you remember", "why did we", or "have we done this before", and before asking him to repeat anything.'
---

# Memory find

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Put each `toolkit` command on its own line. In Codex, a `toolkit` command joined to anything else (`&&`, `;`, a pipe) runs inside the sandbox, which blocks Hindsight and Notion: run it alone. This skill only reads. It never changes memory, an item, or a file.

## Steps

1. Check the session briefing and the current focus.
   `toolkit memory focus`
2. Search memory, then open each hit. A hit is a pointer; read the record before using it, check its date, scope, and `last_verified`, and follow its Related memories links when they bear on the question.
   `toolkit memory find "<query>"`
   `toolkit memory get <key>`
3. Search the other homes: `DECISIONS.md` at the project root; work items (their Recent History and Notes); the area files in `requirements/`; the area files in `system-guide/`; `PROJECT.md` and `PROJECT-ROADMAP.md`; `ai-external-knowledge/INDEX.md`; the glossary for project terms. GitHub Issues or Jira: the work commands exit with code 3; read the issues as the work plugin's `references/trackers.md` says.
   `toolkit work list`
   `toolkit work show <id> --section "Recent History"`
   `toolkit work show <id> --section Notes`
   `toolkit memory glossary`
4. Give a source for every fact: memory key, decision id, work item id and section, or file path, with its date.
5. Sources disagree: show both, say which is newer, leave it open, and offer `memory-save` to correct the older one.
6. Nothing found: say so plainly, then ask the owner once. Hindsight or Notion unreachable: say so in one line and use what is available.
7. Change nothing.

## Search tips

- Try the owner's words first, then the real names (component, setting, work item id).
- Hindsight memory: the search matches meaning, not only words. For a question that needs several records combined ("why did we move off Heroku?"), ask the local model for a combined answer, then check it against the records it cites:
  `toolkit memory find "<question>" --reflect`
- Retired records are left out of search. When the owner asks about an old decision, list retired records too:
  `toolkit memory list --status retired`
- Work item decisions live in the item, not in memory. Project-wide decisions live in `DECISIONS.md` with ids like `D-4`.

## How to answer

- Lead with the answer, then the source in brackets, for example "Postgres, everywhere (D-4, 2026-09-12)."
- Say how sure the answer is when the source is old or indirect.
- Quote the owner's recorded words when the exact words matter.
- A fact from a work item is about that item only. Say so when the owner seems to ask about the whole project.

## Not this skill

- Saving or correcting a fact: `memory-save`.
- Status of current work: `work-status`.
- Cleaning up memory: `memory-tidy`.
