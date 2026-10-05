# Tidying memory

Keeps memory small and true: Current State first, then duplicates, proposals, links, stale records, records in the wrong home, lessons that should become rules, and the owner's rules. Plan first, ask, then change.

## Contents

- Plan first, then ask
- Current State
- Duplicates and merges
- Proposals waiting for the owner
- Links to work items
- Links between memories
- Stale records
- Wrong home, wrong kind, or a record changed by hand
- Old feedback records
- The glossary
- Lessons that should become rules or skills
- Writing a project skill
- The owner's rules
- The report

## Plan first, then ask

- Read every record whole. `using-memory-store` says what in its layout is not a record (an index, a blank form) and what else to check there.
- Write the plan as one numbered list: each change, its records, and a one-line reason. A contradiction between two records is a question on the list. Never settle it by date alone.
- Change nothing until he says yes. His answer often comes in the next turn: open this file again then, because Codex does not keep a skill across turns.
- A delete is its own numbered line, with the record named. Otherwise retire the memory or mark it replaced (`SKILL.md`).
- Two changes skip the plan: removing Current State lines that are no longer true, and removing a secret or an email address at once.

## Current State

Do this first, before the plan. Prune it as `references/current-state.md`, "Pruning", says, and tell the owner what was removed.

## Duplicates and merges

Two records about the same concept merge into the broader one, or into the older one when neither is broader:

1. Move each section of the other into the kept one, above its lessons, keeping each section's source. Move its lessons too, joining the Seen lines of a lesson both hold.
2. Join the two lists of work items without repeats.
3. Mark the other record replaced by the kept one. Update the kept record's summary and date.
4. Point every link to the other record at the kept one.

Two sections in one record that say the same thing merge into one. Two decision records for the same decision: keep the older, mark the newer replaced. An event or a decision record is never merged into a concept.

A concept past the size limit `using-memory-store` gives: move one sub-topic's sections to a new concept, link the two as related memories, and repoint links.

## Proposals waiting for the owner

Put each on the plan as a yes-or-no question with its one-line reason. His yes or no is handled as `references/saving.md`, "Proposals", says.

## Links to work items

- Each work item a memory names must exist (`using-work-tracker`). One that cannot be found: tell the owner. Plan: take it out of the memory's work item links and keep its ID under its authoritative records with "(not found, <date>)".
- A link in the wrong form for this project's tracker: fix it (`using-memory-store` gives the form).
- A record clearly about an item but not linked to it: propose the link.

## Links between memories

Check that each link target exists. A missing target: point the link at the right record, or keep its words and drop the link. A replaced record: point the link at the replacement. A retired record: add " (retired)" after the link.

## Stale records

A record about something that changes (a vendor, a process, a person's role) whose last-verified date is unknown or more than six months old: check it against its source, or ask the owner when you cannot. Then set the date you checked, correct it, or retire it.

## Wrong home, wrong kind, or a record changed by hand

- A section that holds work item status, next steps, undelivered requirements, an item-only decision, or a copy of a requirement or design: propose moving its meaning to the work item, then removing the section.
- A section that is an instruction ("always ...", "never ...", a preference): propose moving it to `.claude/rules/owner-preferences.md` (`references/saving.md`, "The owner's instructions"), then removing the section.
- A guess, or a fact he rejected: retire it.
- A record of the wrong kind: move it to the right kind (`using-memory-store` says how), and repoint links.
- A record that no longer follows the layout because it was made or changed by hand: his edit wins. List these for him, and fix one only with his yes.

## Old feedback records

"Feedback" is a retired kind of record. For each section of one: an instruction goes to `.claude/rules/owner-preferences.md`, ending with `(<date the record was saved>, <owner name>, from the old feedback record <name>)`; a fact goes to a user or project concept. Then mark the record replaced, saying it moved to the rules and concepts on <date>.

## The glossary

Put on the plan: a term with no source, a renamed term with no alias line, and a term nothing uses any more (remove its entry).

## Lessons that should become rules or skills

A lesson has proved itself when its Seen line names two or more sessions, a lesson like it is in another concept, or the owner confirmed it.

1. Decide where it goes: an instruction followed every time is a rule; a procedure with steps is a project skill.
2. Put it on the plan with the exact words: the rule bullet and its area, or the skill's name and description.
3. After his yes: a rule is one bullet in `.claude/rules/owner-preferences.md` in the words he approved, ending with `(<YYYY-MM-DD of his yes>, <owner name>, from the lesson in <record title>)`. A skill: see "Writing a project skill".
4. The lesson gets "Promoted: <date>, to <where>" and stays as history.

A fact that is really an instruction ("always check X before Y") is proposed as a rule the same way.

## Writing a project skill

A project skill goes in `.claude/skills/<name>/SKILL.md`. Codex reads `.agents/skills`, which is a link to `.claude/skills`, so one copy serves both. The header holds only `name` and `description`. Add one line for the skill to the skills list in `AGENTS.md`.

## The owner's rules

Read `.claude/rules/owner-preferences.md` and the rules list in `AGENTS.md`. Put on the plan, each with a one-line reason, every bullet that repeats or contradicts another bullet, another rule file, or a line of `AGENTS.md`, or is already enforced by a hook or a setting. Change or remove a bullet only after his yes. A contradiction is a question for him. Never remove a bullet only because it is old.

## The report

One short list for the owner, each line naming the record by its title and where it is kept (`using-memory-store` gives the path or link):

```text
Memory tidied:
- Current State: removed "WI-002 export fields" (Done) and "Save to memory? Decision WI-004 Q-03" (answered).
- Merged "Export" into "Exports". "Export" is marked replaced.
- Retired "Old dashboard": the dashboard was shut down on 2026-09-20.
- Promoted the lesson "The deploy check needs the VPN" to the project rules (Testing).
- Not changed: the currency-check rule (you said not yet).
```

When he asks how to undo a change, give him the words (for example, "bring back Old dashboard"). End with the questions still open or, when none is open, the exact words that continue ("Say 'keep going' and I'll <next action>.").
