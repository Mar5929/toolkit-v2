---
name: curating-project-memory
description: 'Keeps project memory true: saves what no other file holds (a fact about a person or the client, an event, a job run), sends any other fact to its home, keeps Current State current, writes "from now on" instructions to the rules, and finds or tidies what was recorded. Use when the owner asks to keep, correct, forget, or find something, or reports a fact, a date, what someone said, or how a job ran. Not for a decision; use filing-project-records. Not for a to-do; use running-work-item-lifecycle.'
---

# Curating project memory

This skill holds the process: what is worth keeping, when to ask the owner, and how to decide. It never says where memory is kept.

## Before a turn ends

Record what a later session must know and no record shows yet, in the same turn, even when you also ask the owner a question. A reply in the chat is not a record: a later session never sees it.

| What happened in the turn | Where it goes |
| --- | --- |
| You did work for the owner that is no work item | Its project task, ticked when it is done (`running-work-item-lifecycle`). With no project task: an event record, or a row in its recurring job's record (`references/saving.md`). |
| You gave the owner a result that is only in the chat, such as an agenda, a draft, or an analysis | The file where it belongs, when the root `AGENTS.md`, "Where information goes", gives it a home. Otherwise an event record that holds the result in a few lines (`references/saving.md`, "An event"). |
| A recurring job ran, or the owner reported that it ran or failed | A run row in the job's record (`references/saving.md`, "A recurring job and its runs") |
| The owner started a piece of work that is not finished and is no work item | A line under Now in Current State (`references/current-state.md`) |
| The owner named a date or a deadline | A line under Coming up |
| Somebody owes something | A project task with who owes it (`running-work-item-lifecycle`), and a line under Waiting on when work waits on it |
| You asked the owner a question, and the turn ends before he answers | About a work item: its Questions and Answers row (`running-work-item-lifecycle`). Otherwise a line under Waiting on: "Owner: <the question in a few words> (asked <date>)" |
| The owner told you a fact, or what another person said, that has no home in another file | A memory record, or a proposal when it needs his yes ("Approval" below) |

## How memory is kept

- Memory holds only what no other project file holds. Find a fact's home first: `references/memory-criteria.md`, "Find the fact's home first".
- Memory is stored by concept, like a wiki. One record covers one concept or area, such as the client's team or the weekly data load. A new fact joins its concept's record, which grows and is corrected over time. A new record is only for a new concept. Never make one record per fact.
- A record is one of four kinds: user, project, reference, or event. `references/memory-criteria.md` says what each holds and what is worth keeping.
- Every record carries the date it was created and the date it last changed. A record that is true only for a while also carries a "check or remove by" date.
- A memory is current, proposed (the owner has not approved it), replaced by another, or retired. `using-memory-store` says how each is marked. Never answer from a memory that is not current as if it were.

## When to search memory

The root `AGENTS.md`, "Where information goes", lists the moments to search memory. Search as `references/finding.md` says. In a project whose memory is not shown at the start of a session, this search is the only way a record is seen.

## Out of date, or no longer needed

When a memory is out of date, retire it or mark it replaced, so its history stays. When a memory is no longer needed, or was saved by mistake, delete it after the owner's yes, or when he asks.

Never say a memory is deleted when it is not.

## Approval

- When the "Memory approval" line in `PROJECT.md` is missing or still shows its prompt, use `onboarding`.
- His own request to keep, change, or forget something, or his yes to your question, is the approval. Act at once.
- `onboarding`: anything you inferred gets one question first: "Save to memory: <one-line summary>?". It becomes a current record only after his yes.
- `trusted`: a fact you inferred and can name a source for is saved without asking, and reported in one line, unless it is on the list below. A fact with no source gets the `onboarding` question.
- In both modes, ask first for:
  - an instruction you inferred: "Add to the project rules: <one line>?";
  - anything about a named person, or personal details, that he did not ask you to remember;
  - more than five records at once;
  - retiring or deleting a memory he did not ask you to forget;
  - a change to this policy.
- No question in either mode: a lesson, an event record, a run row of a recurring job (a failed run too), and a change to Current State alone. They record what happened, not a judgment. Report each in one line. An event or a run row that holds more about a named person than attendance, work role, when the person is away, or who covers still gets the question for that part.
- A question is never the only trace: the session can end before he answers. In the same turn as the question, add its line under "Waiting on" in Current State, "Owner: save to memory? <the fact in one line> (asked <date>)", and keep the save as a proposal (`references/saving.md`, "Proposals").
- When he changes the mode, change the "Memory approval" line in `PROJECT.md`, as Hand-offs says, never `.claude/rules/owner-preferences.md`.

## Every time

- Read a record fresh before you change it, and read it back after. Never run two writes to the same record at once.
- His own edits win. Ask before you fix a record he changed by hand.

## Hand-offs

| For | Use |
| --- | --- |
| Every read and every write of memory | `using-memory-store` |
| A decision or an open question more than one work item needs, an original, a project term, or a fact about the system | `filing-project-records` |
| Reading a work item: its status, decisions, and requirements | `using-work-tracker` |
| Anything one work item needs; a to-do or an action item, as a project task; a work item's line under Now in Current State | `running-work-item-lifecycle` |
| Changing the memory approval mode | `project-setup` |
| A handoff | `handoff` |

## References

| File | Open it when |
| --- | --- |
| [references/memory-criteria.md](references/memory-criteria.md) | Deciding whether something is worth keeping, where its home is, and which kind of record it is. |
| [references/saving.md](references/saving.md) | Keeping, correcting, or forgetting anything: a fact, an unchecked claim, a lesson, an event, a run of a recurring job, a "from now on" instruction, a proposal, or a delete. |
| [references/current-state.md](references/current-state.md) | Reading, changing, or pruning Current State. |
| [references/finding.md](references/finding.md) | The owner asks what was recorded or what happened before, or you need a remembered fact. |
| [references/tidying.md](references/tidying.md) | Reviewing or cleaning up all memory. |
