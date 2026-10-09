# Managing project memory

Use this reference to decide what goes into project memory, when to ask the owner, and when something in memory is corrected, retired, or deleted. The goal is that project memory stays true, so that a later session can rely on it. A session is one chat with the agent.

Project memory has two parts:

- **Memory records.** A memory record is one saved subject in memory, such as the client's team or the weekly data load.
- **The project's Current State.** The project's Current State is the project's one short page of what is true now. It has five parts: Now, Coming up, Waiting on, Standing jobs and shared files, and Next session starts with.

For every read and every write of memory, use `references/memory-store.md`. That reference gives the instructions for the memory store chosen during project setup.

Two neighbouring jobs belong to other skills. A decision or an open question that more than one work item needs is saved with `filing-project-records`. A to-do is saved with `managing-work-items`.

## Contents

- The goal, and what it means for memory
- How memory is kept
- When to search memory
- When to ask the owner
- When to clean up all of memory
- A memory record that is out of date or no longer needed
- Every time you change a memory record
- Work that another skill or reference does

## The goal, and what it means for memory

The root `AGENTS.md`, section "Your job as the agent", states the goal for all of the project's records. The goal says what you do when something changes what is true, and when you ask the owner. Read the goal there. For memory, the goal means four things:

- Save in the turn in which the change happens. A turn is one message from the owner, with your work on it and your reply. A later session never sees your reply, so a fact or a result that is only in your reply is lost. Save before the turn ends, even when the turn ends with a question to the owner.
- Correct each memory record and each line of the project's Current State that the change made wrong. `references/saving.md`, section "Correcting a fact", gives the steps. When the turn ends, every line of the project's Current State is true.
- Name the source of every fact that you save, and mark a fact that nobody has confirmed. `references/saving.md`, section "An unchecked claim", gives the mark.
- Tell the owner what you saved. `references/saving.md`, section "Reply lines", gives the line for each kind of save.

## How memory is kept

- Memory holds only what no other project file holds. Before you save a fact, check whether another file is the place for it. `references/memory-criteria.md`, section "First find the place where the fact is kept", lists the kinds of fact that never go in memory and the file each one goes in.
- Memory is stored by subject, like a wiki. One memory record covers one subject or area, such as the client's team or the weekly data load.
  - A new fact goes into the memory record for its subject. That memory record grows and is corrected over time.
  - Make a new memory record only for a new subject.
  - Never make one memory record for each fact.
- A memory record is one of four types: user, project, reference, or event. `references/memory-criteria.md` says what each type holds and what is worth keeping. A memory record of the type event is also called an event record.
- Every memory record carries the date it was created and the date it last changed. A memory record that is true only for a while also carries a "check or remove by" date.
- A memory record has one of three statuses. `references/memory-store.md` says how each status is marked.
  - Current.
  - Replaced: another memory record took its place.
  - Retired: it is no longer used for answers, and kept only as history.
- Never answer from a memory record that is not current as if it were current.

## When to search memory

Search memory at the moments that the root `AGENTS.md`, section "Where information goes", lists. `references/finding.md` says how to search. In a project that does not show its memory records at the start of a session, this search is the only way that you see a memory record.

## When to ask the owner

Save, correct, and retire without a question. Ask the owner only when one of these is true:

- You cannot tell which of two things is true. For example, a memory record and a document that the owner shared give different dates for one deadline, and nothing shows which one is right.
- The step is on the list in the root `AGENTS.md`, section "Ask the owner first". For example, a delete of a memory record cannot be undone in some memory stores, and an instruction that you inferred would add a line to a rule file, which the Project map marks "Only with the owner's yes".
- You clean up all of memory, or a part of the project's Current State is over its limit with only true lines. `references/tidying.md` and `references/current-state.md` say to show the owner the plan first, because a clean-up changes many records at once, and a cut removes a line that is still true.

The owner's own request to keep, change, or forget something is the owner's yes. Act on it at once.

## When to clean up all of memory

Clean up all of memory when the owner asks for it, and start at once. Start a clean-up yourself when you judge that memory is no longer small and true. For example, the memory records shown at the start of a session cover one subject twice. When you start a clean-up yourself, choose a point where the owner is not waiting on you, such as after a work item closes.

`references/tidying.md` gives the steps. A helper does the reading in the background, and the owner approves the plan before anything on it changes.

## A memory record that is out of date or no longer needed

- When a memory record is out of date, retire it or mark it as replaced, so that its history stays.
- When a memory record is no longer needed, or was saved by mistake, delete it. A delete cannot always be undone, so delete a memory record only when the owner asks for the delete or says yes to it.
- Never say that a memory record is deleted when it is not.

## Every time you change a memory record

- Read the memory record again right before you change it, and read it back after the change.
- Never run two writes to the same memory record at the same time.
- Keep the owner's own edits. In a memory record that the owner changed by hand, change only the text that your change is about.

## Work that another skill or reference does

| For | Use |
| --- | --- |
| The steps for every read and every write of memory | `references/memory-store.md` |
| A decision or an open question that more than one work item needs, a source, a project term, or a fact about the system | `filing-project-records` |
| Reading a work item: its status, decisions, and requirements | `managing-work-items` |
| Anything that one work item needs; a to-do or an action item, as a project task; a work item's line under "Now" in the project's Current State | `managing-work-items` |
| A handoff | `handoff` |
