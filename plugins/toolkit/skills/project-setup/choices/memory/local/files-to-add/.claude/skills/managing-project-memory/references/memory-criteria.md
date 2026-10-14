# Memory criteria

Use this file to decide whether something is worth keeping in a memory record in this project, and which type of memory record holds it, so that memory holds only what a later session needs.

A rule in `.claude/rules/owner-preferences.md` overrides this file.

## First find the place where the fact is kept

Memory holds only what no other project file holds. Before every save, read the table in the root `AGENTS.md`, section "Where information goes". That table names the place where each kind of information is kept.

When the table names a place for the fact, save the fact in that place, with the skill that the root `AGENTS.md` names for it. Memory then gets nothing.

These kinds of fact never go in memory:

| Fact | The one place where it is kept |
| --- | --- |
| A decision or an open question that more than one work item needs | `DECISIONS.md` (`filing-project-records`, step "record a decision") |
| A project term | `wiki/product-wiki/glossary.md` (`filing-project-records`, step "update a system document") |
| How the system must work, or how it works today | `wiki/product-wiki/`, or `wiki/reference/current-system/` |
| A person's lasting role and what the person may decide; a stable fact about how the client's business works | `PROJECT.md` |
| A to-do or an action item, whoever owes it | A project task, or a task in its work item (`managing-work-items`) |
| A source: something the project was given, such as a transcript, a note, or a document | `sources/` (`filing-project-records`, step "file a source") |

A memory record of the type reference may name one of these records, by its ID and path, when a later session would otherwise miss it. The memory record never repeats what that record says.

## Default test for a memory record

Save information when all three of the owner's criteria hold:

- It contains lasting project-specific facts, people, terminology, decisions, lessons, events, or constraints that another memory record does not already explain.
- Losing it would cost a later agent real time or understanding.
- It comes from the owner, or from work done together with the owner.

Apply these criteria after identifying the authoritative record. A qualifying decision still belongs in `DECISIONS.md`; memory may preserve a useful pointer rather than repeat the decision.

Prefer to update a memory record that exists. A new fact goes under a heading in the memory record for the subject it belongs to. Make a new memory record only for a new subject.

## The four types of memory record

### user

A memory record of the type user holds a fact about the owner or another person that matters to the work and is not that person's lasting role. For example: who covers for whom, when someone is away, or what a person handles for now.

It never holds any of these:

- a working preference or a correction, which is a line in `.claude/rules/owner-preferences.md`;
- private details;
- personal judgments.

### project

A memory record of the type project holds the following:

- a lasting fact about the project or the client that fits no other file;
- a claim that is not checked yet, with who said it or what you concluded it from;
- a lesson that is not proven yet, with the dates it was seen.

It never holds a decision, a system rule, a term, a requirement, work item status, an instruction for the agent, or a code summary.

### reference

A memory record of the type reference says where to find something that is hard to find again, with why to open it. The thing can be a record, a system, a dashboard, or a shared file, such as a spreadsheet the client shares.

It never holds either of these:

- the content of that thing;
- a path that `PROJECT.md` or the project map in the root `AGENTS.md` already gives.

### event

A memory record of the type event holds something that happened, or a job that ran: the date, what was done, the result, and where the output is.

- One memory record holds one event.
- A recurring job has one memory record, with one row per run.

It never holds any of these:

- a routine edit, a tool call, a raw error, or a daily progress log;
- work that a work item, a project task, a commit, or a filed record already shows.

## A fact that is true only for a while

A fact with an end, such as "away until 2026-10-20" or "the sandbox is frozen this week", carries a "check or remove by" date. That date is the day after the fact stops being true, or the day the fact must be checked again.

On or after that date, check the fact. Then correct it or retire it. `references/tidying.md`, section "Stale records", gives the steps.

## Never save in a memory record

- Exclude secrets and information whose storage could compromise system, product, or project security. Ordinary contact details may be saved when they meet the memory criteria.
- Transcripts, scratch reasoning, raw logs, dropped guesses, or a claim that names neither who said it nor what you concluded it from.
- A fact that the same change already saves in the place where it is kept. The one exception is a short memory record of the type reference that says where that record is, when a later session needs it.
- The live status of a work item, a pending approval, unshipped requirements, the steps of a procedure, or a restatement of code.
- Something that the owner told you to forget or not to keep, saved again under a new name or in wider wording. The owner's no stands until the owner changes it.
