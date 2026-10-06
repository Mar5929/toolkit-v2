# Memory criteria

What is worth keeping in lasting memory in this project, and which kind of record it is. Rules in `.claude/rules/owner-preferences.md` override this page.

## Find the fact's home first

Memory holds only what no other project file holds. The table in the root `AGENTS.md`, "Where information goes", names the home of each kind of information: read it before every save. A fact that has a home there goes to that home, through the skill the root `AGENTS.md` names for it, and memory gets nothing.

These never go in memory:

| Fact | Its one home |
| --- | --- |
| A decision or an open question that more than one work item needs | `DECISIONS.md` (`filing-project-records`, step "record a decision") |
| A project term | `system/glossary.md` (`filing-project-records`, step "update a system document") |
| How the system must work, or how it works today | `system/`, or `reference/current-system/` |
| A person's lasting role and what the person may decide; a stable fact about how the client's business works | `PROJECT.md` |
| A to-do or an action item, whoever owes it | A project task, or a task in its work item (`running-work-item-lifecycle`) |
| An original: a transcript, a note, a document | `sources/` (`filing-project-records`, step "file a source") |

A `reference_` record may point to one of these records, by its ID and path, when a later session would otherwise miss it. It never repeats what the record says.

## Default test for lasting memory

Save a concept when it concerns this project, has a credible source, would matter in a future session, would be costly or unreliable to reconstruct, and has no other home. Prefer updating an existing concept: a new fact goes under a heading of the concept it belongs to, and a new record is only for a new concept.

| Kind | Holds | Never holds |
| --- | --- | --- |
| user | A fact about the owner or another person that matters to the work and is not that person's lasting role: who covers for whom, when someone is away, what a person handles for now. | A working preference or a correction (a line in `.claude/rules/owner-preferences.md`); private details; personal judgments. |
| project | A lasting fact about the project or the client that fits no other file. A claim someone made that is not checked yet, with who said it. A lesson not proven yet, with the dates it was seen. | A decision, a system rule, a term, a requirement, work item status, an instruction for the agent, a code summary. |
| reference | Where to find something that is hard to find again: a record, a system, a dashboard, a shared file such as a spreadsheet the client shares, with why to open it. | The content of that thing; a path that `PROJECT.md` or the project map in the root `AGENTS.md` already gives. |
| event | Something that happened, or a job that ran: the date, what was done, the result, and where the output is. One event per record. A recurring job has one record, with one row per run. | A routine edit, a tool call, a raw error, a daily progress log; work that a work item, a project task, a commit, or a filed record already shows. |

## A fact that is true only for a while

A fact with an end, such as "away until 2026-10-20" or "the sandbox is frozen this week", carries a "check or remove by" date: the day after it stops being true, or the day it must be checked again. On or after that date, check it and correct it, or retire it (`references/tidying.md`, "Stale records").

## Never save as lasting memory

- Secrets, credentials, sensitive personal data, transcripts, scratch reasoning, raw logs, dropped guesses, or unsupported claims with no person or document named as their source.
- A fact the same change already places in its home, unless a small route to that record is needed.
- Live status of a work item, pending approval, unshipped requirements, procedure steps, or a restatement of code.
- A rejected candidate under a new name or wider wording. A rejection stands until the owner changes it.
