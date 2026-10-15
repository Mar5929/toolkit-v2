# Memory criteria

## Where a fact belongs

Memory holds only what no other file holds. Check the root `AGENTS.md`, "Where information goes", before every save. These never go in memory:

| Fact | Its home |
| --- | --- |
| A decision or open question more than one work item needs | `DECISIONS.md`, via `filing-project-records` |
| A project term | `wiki/product-wiki/glossary.md`, via `filing-project-records` |
| How the system works or must work | `wiki/product-wiki/` or `wiki/reference/current-system/` |
| A person's lasting role; a stable fact about the client's business | `PROJECT.md` |
| A to-do or action item | A project task or work item task, via `managing-work-items` |
| A source (transcript, document, file) | `sources/`, via `filing-project-records` |
| An owner instruction or preference | `.claude/rules/owner-preferences.md` (see `saving.md`) |

A reference record may point to one of these when a later session would otherwise miss it. It never repeats the content.

## The test

Save when all three hold: it's lasting and specific to this project, losing it would cost a later session real time, and it came from the owner or from work done with the owner.

## Record types

| Type | Holds | Never holds |
| --- | --- | --- |
| user | A fact about a person that matters to the work: who covers for whom, who's away, what someone handles for now | Preferences (those are rules), private details, judgments |
| project | A lasting fact that fits no other file; an unchecked claim; an unproven lesson | Decisions, rules, terms, requirements, work item status, code summaries |
| reference | Where to find something hard to find, and why you'd open it | Its content; paths `PROJECT.md` or `AGENTS.md` already give |
| event | Something that happened or a job that ran: date, what, result, where the output is | Routine edits, progress logs, anything a work item, task, or commit already shows |

## Never save

- Secrets, or anything whose storage could compromise security.
- Transcripts, scratch reasoning, raw logs, or a claim with no named source.
- Live work item status, pending approvals, procedure steps, or restated code.
- Anything the owner said to forget, even reworded or under a new name.

## Temporary facts

A fact with an end ("away until 2026-10-20") gets a check-or-remove-by date: the day after it stops being true, or when it must be checked again.

## When to ask the owner

Save, correct, and retire without asking. Ask only when:

- a conflict blocks the work and no source settles it;
- the Project map in `AGENTS.md` says the change needs the owner's yes;
- you'd delete a record that can't be restored, and the owner didn't ask;
- you're cleaning up memory as a whole, or cutting a Current State line that's still true.

The owner's own request is the yes. Silence never is.
