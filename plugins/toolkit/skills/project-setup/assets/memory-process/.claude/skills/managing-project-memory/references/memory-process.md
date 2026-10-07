# Managing project memory

Use this reference to decide what goes into project memory, when the owner must say yes before a save, and when something in memory is corrected, retired, or deleted. The goal is that project memory stays true, so that a later session can rely on it. A session is one chat with the agent.

Project memory has two parts:

- **Memory records.** A memory record is one saved subject in memory, such as the client's team or the weekly data load.
- **The project's Current State.** The project's Current State is the project's one short page of what is true now. It has five parts: Now, Coming up, Waiting on, Standing jobs and shared files, and Next session starts with.

For every read and every write of memory, use `references/memory-store.md`. That reference gives the instructions for the memory store chosen during project setup.

Two neighbouring jobs belong to other skills. A decision or an open question that more than one work item needs is saved with `filing-project-records`. A to-do is saved with `managing-work-items`.

## Contents

- Before a turn ends
- How memory is kept
- When to search memory
- The owner's yes before a save
- A memory record that is out of date or no longer needed
- Every time you change a memory record
- Work that another skill or reference does

## Before a turn ends

A turn is one message from the owner, with your work on it and your reply.

Before a turn ends, save what a later session must know and nothing saved in the project shows yet. Save it in the same turn, even when you also ask the owner a question. Your reply to the owner is not a record, because a later session never sees the reply.

Find what happened in the turn in this table, and save what the row names.

| What happened in the turn | What to save | Where the steps are |
| --- | --- | --- |
| You did work for the owner that is not a work item, and the work has a project task | The work goes in its project task. Tick the task when the work is done. | `managing-work-items` |
| You did work for the owner that is not a work item, and the work has no project task | An event record. When the work was a run of a recurring job, a row in the Runs table of that job's memory record in its place. | `references/saving.md` |
| You gave the owner a result that is only in your reply, such as an agenda, a draft, or an analysis, and the root `AGENTS.md`, section "Where information goes", names a place for that kind of result | The result, in the file where it belongs. | The root `AGENTS.md`, section "Where information goes" |
| You gave the owner such a result, and that section names no place for it | An event record that holds the result in a few lines. | `references/saving.md`, section "An event" |
| A recurring job ran, or the owner reported that it ran or failed | A row in the Runs table of the job's memory record. | `references/saving.md`, section "A recurring job and its runs" |
| The owner started a piece of work that is not finished and is not a work item | A line under "Now" in the project's Current State. | `references/current-state.md` |
| The owner named a date or a deadline | A line under "Coming up" in the project's Current State. | `references/current-state.md` |
| Somebody owes something | A project task that says who owes it. When work waits on the thing owed, also a line under "Waiting on" in the project's Current State. | `managing-work-items` for the project task; `references/current-state.md` for the line |
| You asked the owner a question about a work item, and the turn ends before the owner answers | A row in that work item's Questions and Answers. | `managing-work-items` |
| You asked the owner a question that is not about a work item, and the turn ends before the owner answers | A line under "Waiting on" in the project's Current State: "Owner: <the question in a few words> (asked <date>)". | `references/current-state.md` |
| The owner told you a fact, or what another person said, and no other file is the place for it | A memory record. When the save needs the owner's yes, a proposal. | "The owner's yes before a save" below, then `references/saving.md` |

## How memory is kept

- Memory holds only what no other project file holds. Before you save a fact, check whether another file is the place for it. `references/memory-criteria.md`, section "First find the place where the fact is kept", lists the kinds of fact that never go in memory and the file each one goes in.
- Memory is stored by subject, like a wiki. One memory record covers one subject or area, such as the client's team or the weekly data load.
  - A new fact goes into the memory record for its subject. That memory record grows and is corrected over time.
  - Make a new memory record only for a new subject.
  - Never make one memory record for each fact.
- A memory record is one of four types: user, project, reference, or event. `references/memory-criteria.md` says what each type holds and what is worth keeping. A memory record of the type event is also called an event record.
- Every memory record carries the date it was created and the date it last changed. A memory record that is true only for a while also carries a "check or remove by" date.
- A memory record has one of four statuses. `references/memory-store.md` says how each status is marked.
  - Current.
  - Proposed: the owner has not said yes to it.
  - Replaced: another memory record took its place.
  - Retired: it is no longer used for answers, and kept only as history.
- Never answer from a memory record that is not current as if it were current.

## When to search memory

Search memory at the moments that the root `AGENTS.md`, section "Where information goes", lists. `references/finding.md` says how to search. In a project that does not show its memory records at the start of a session, this search is the only way that you see a memory record.

## The owner's yes before a save

The line "Memory approval" in `PROJECT.md` holds one of two values, `onboarding` or `trusted`. When that line is missing or still shows its prompt, use `onboarding`.

### What counts as the owner's yes

The owner's own request to keep, change, or forget something is the owner's yes. The owner's yes to your question is too. Act at once.

### Something you inferred

- With `onboarding`, ask one question before you save anything you inferred: "Save to memory: <one-line summary>?". The save becomes a current memory record only after the owner's yes.
- With `trusted`, what you do depends on whether you can name a source for the fact.
  - When you inferred a fact and can name its source, save it without asking, and report the save in one line. The exception is a fact on the list under "Always ask first" below.
  - When you inferred a fact and cannot name a source, ask the `onboarding` question.

### Always ask first

With both values, ask the owner before each of these:

- an instruction you inferred. Ask "Add to the project rules: <one line>?";
- anything about a named person, or personal details, that the owner did not ask you to remember;
- retiring or deleting a memory record that the owner did not ask you to forget;
- a change to the rules under "The owner's yes before a save".

### Never ask

With both values, save each of these without a question, and report each save in one line. `references/saving.md`, section "Reply lines", gives the line for each kind of save.

- a lesson;
- an event record;
- a row in the Runs table of a recurring job, also when the run failed;
- a change to the project's Current State alone.

These four record what happened, and not a judgment. One exception applies. When an event record or a row in the Runs table holds more about a named person than attendance, work role, when the person is away, or who covers, ask the question for that part.

### Write the question down in the same turn

A question must never be the only trace of a save, because the session can end before the owner answers. In the same turn as the question, do both of these:

- Add this line under "Waiting on" in the project's Current State: "Owner: save to memory? <the fact in one line> (asked <date>)".
- Keep the save as a proposal. A proposal is a save that the owner has not said yes to. `references/saving.md`, section "Proposals: a save the owner has not answered", gives the steps.

### When the owner changes the "Memory approval" value

When the owner tells you to change the value, change the "Memory approval" line in `PROJECT.md` with `project-setup`. Never write the change in `.claude/rules/owner-preferences.md`.

## A memory record that is out of date or no longer needed

- When a memory record is out of date, retire it or mark it as replaced, so that its history stays.
- When a memory record is no longer needed, or was saved by mistake, delete it. Delete it only after the owner's yes, or when the owner asks.
- Never say that a memory record is deleted when it is not.

## Every time you change a memory record

- Read the memory record again right before you change it, and read it back after the change.
- Never run two writes to the same memory record at the same time.
- Keep the owner's own edits. Ask the owner before you correct a memory record that the owner changed by hand.

## Work that another skill or reference does

| For | Use |
| --- | --- |
| The steps for every read and every write of memory | `references/memory-store.md` |
| A decision or an open question that more than one work item needs, a source, a project term, or a fact about the system | `filing-project-records` |
| Reading a work item: its status, decisions, and requirements | `managing-work-items` |
| Anything that one work item needs; a to-do or an action item, as a project task; a work item's line under "Now" in the project's Current State | `managing-work-items` |
| Changing the "Memory approval" value | `project-setup` |
| A handoff | `handoff` |
