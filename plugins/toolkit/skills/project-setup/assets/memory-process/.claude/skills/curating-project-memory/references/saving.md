# Saving to memory

How to keep, correct, and forget. The approval policy and the rules for retiring and deleting are in `SKILL.md`.

## Contents

- Decide the home
- Find the concept first
- Write the change
- An unchecked claim
- A lesson
- An event
- A recurring job and its runs
- A shared file
- Correcting a fact
- "Forget that", retiring, and deleting
- Proposals: a save the owner has not answered
- The owner's instructions
- Reply lines

## Decide the home

Test it with `references/memory-criteria.md`, "Find the fact's home first", and the "Where information goes" table in the root `AGENTS.md`.

- The fact has a home outside memory: put it there, through the skill the root `AGENTS.md` names for that home, and tell the owner where it is. His request to remember it is his yes to write it there. A change to `PROJECT.md` is shown to him before it is saved.
- A decision, a term, or a rule of the system never becomes a memory record: hand it to `filing-project-records`.
- A to-do, a reminder, or an action item is a project task, or a task in its work item: hand it to `running-work-item-lifecycle`. A date it carries also goes under "Coming up" (`references/current-state.md`).
- Nothing qualifies: save nothing. A hook reminder is only a hint.

## Find the concept first

Search before every save. Search the fact's words and their synonyms, and read each likely record whole. Then:

- The same fact is already there: save nothing, and say where.
- A section says something different: it is a correction.
- A concept of the right kind covers the subject: add a section to it.
- None covers it: make a new concept record.
- Two concepts fit: pick the one a future session would open first, and link the other as a related memory.

## Write the change

- **A section in an existing concept.** Add the fact as its own section, above the concept's lessons. Update the concept's one-line summary when it now covers more, set its last-changed date, and add each related work item, keeping every one already there.
- **A new concept.** Name it for the concept, not for one fact. Use the kind that fits (user, project, reference, or event). Give it a first section and an empty lessons section. Set its created date and its last-changed date to today.
- Each section says what to remember, why it matters, how to apply it, and where it came from with its date and what is uncertain.
- The one-line summary states the fact itself in a few words, with its dates, not only the subject: "Tom away to 2026-10-20; Sarah covers approvals", never "Notes on availability". A later session sees only this line until it opens the record, so keep it to one line of about 100 characters or fewer.
- A fact that is true only for a while gets a "check or remove by" date (`references/memory-criteria.md`).
- Record what allowed the save: "Approved by <owner> on <date>", "Trusted grant, <date>", or "Proposed by the agent on <date>; not approved".
- Group several independent signals into one save.
- Read it back. Update Current State when the save changes it (`references/current-state.md`).

## An unchecked claim

Something a person said that nobody checked, such as "another developer says the API allows 100 calls a minute", goes in the project concept it is about, as its own section:

- what was claimed, who said it, to whom, and the date;
- "Not checked." and what would check it;
- a "check or remove by" date, 30 days ahead unless the owner names one.

Never state it as a fact, and never act on it without saying it is unchecked. When it is checked: a true claim goes to its home (often `system/` or `reference/current-system/`) and the section is removed; a false one is removed. Tell the owner which.

## A lesson

A lesson is something you learned that is not proven yet.

- While its work item is open, it goes in that item (`running-work-item-lifecycle`). When the item closes, the closing step moves it up, drops it, or hands it here to be kept.
- With no work item open, or handed here at closing, it goes under its concept, in "Gotchas and lessons", as one entry: what happened and what to do, with a Seen line that lists the date, and the session or work item, of each time it came up. The first lesson replaces "None yet." The same lesson again adds a date to its Seen line and never gets a second entry.

An instruction the owner gives is never a lesson: it is a rule at once. A lesson that has come up in two or more sessions or work items is offered as a rule or a skill (`references/tidying.md`, "Lessons that should become rules or skills"). Offer it in the turn the second date is added.

## An event

Work done for the owner that no work item, project task, commit, or filed record shows, and anything else that happened and a later session must know, such as a meeting, a call, or an outage. Make one event record, in the same turn, with no question:

- the date, and who took part;
- what was done or what happened;
- the result, in a few lines;
- where the output is: an SRC ID, a file path, a work item or project task ID, or "said in chat only".

Name the record for what happened and its date. A result that the root `AGENTS.md`, "Where information goes", gives a home, such as an analysis of how the system works today, is written there and gets no event record.

## A recurring job and its runs

A job the team runs again and again, such as a weekly data load, a monthly release, or the update of a shared sheet after each meeting, has one event record for the job:

- a first section that says what the job is, when it runs, who runs it, and the exact steps or the file that holds them;
- a section "Runs" with one row per run, in the table `using-memory-store` gives.

Add the row in the turn the run happens or the owner reports it, such as "the weekly load ran fine" or "the nightly job broke again". A failed run is a row too, with the error and the fix. No question comes before the row: report it in one line.

- The owner reports a run without its detail: write the row first, with the date, his words, and "not known yet" in each cell he did not give. Then ask for what is missing, and complete the row with his answer.
- The job has no record yet: make it, with what is known, and add its line under "Standing jobs and shared files" (`references/current-state.md`).
- An earlier run that another record already shows, such as a work item: its row holds only the date and that record's ID.

Before you run the job again, or answer how the last run went, read the Runs table.

## A shared file

A file kept outside the project's records that people keep up to date, such as an open-items spreadsheet the client shares, has one reference record: where it is, who shares it, what it is for, and how and when it is updated. It gets a line under "Standing jobs and shared files". Its updates are a recurring job (above): the job's record names the reference record under Related memories.

## Correcting a fact

- Replace the text of its section, with the new source and date, and set its last-verified date to today. The old wording does not stay beside it. Keep the old text in your reply so "undo that" can put it back.
- Search the other records and Current State for the old value, and correct each.
- A whole concept replaced: make the new record, say it replaces the old one, mark the old one replaced, and point every link to the old one at the new one.

## "Forget that", retiring, and deleting

- Right after a save, "forget that" undoes it: remove the section you added, put back the old wording of a section you changed, or delete the record you made.
- About one older section: remove it, and quote the removed text in your reply so he can say "undo that".
- About a whole concept: retire it, with his words as the reason. Links to it from other records get " (retired)" after the link. "Bring it back" reverses all of it.
- About a fact whose home is outside memory: say where it is, and change it there through the skill the root `AGENTS.md` names. A decision is never deleted: `filing-project-records` supersedes or withdraws it.
- Delete cases: a record he says to delete, a proposal he said no to, and a record that holds a secret or an email address (ask first). In the reply, say whether it can be brought back (`using-memory-store` says).
- A secret or an email address found in memory: remove that text at once, and tell him.

## Proposals: a save the owner has not answered

A save that needs his yes is kept as a proposal in the same turn as the question "Save to memory: <one line>?", so it is not lost when the session ends before he answers. This holds for every such question, also one about a fact found in a document he shared. Two saves are never kept as a proposal record, and get only their line in step 1: an inferred rule, and a save that holds more about a named person than attendance, work role, when the person is away, or who covers. The line for such a save names the person and leaves those details out until his yes.

1. Add one line under "Waiting on" in Current State: "Owner: save to memory? <the fact in one line> (asked <date>)". For a rule, the line is "Owner: add to the project rules? <one line>". Several open proposals share one line naming each. Remove each as he answers, and the line when none is left.
2. Save it where it would live, marked proposed (`using-memory-store` says how).
3. His yes: remove the marks, mark the memory current, and record "Approved by <owner> on <date>".
4. His no: remove the proposal. A general rule he gives about what to keep goes to the project rules under "Memory", and later candidates are checked against it.

## The owner's instructions

An instruction for how the agent works, a preference, or a correction of it is a rule, never memory. His own words are the approval. A line he dictates is written with the steps below alone; `writing-harness-files` is for every other change to a rule file.

1. Read `.claude/rules/owner-preferences.md` fresh. A bullet already says it: add nothing, and say so. A bullet says the opposite: replace it with his new words and name the old line in the reply. Otherwise add one bullet in his words under the `## ` area it is about (Replies, Questions, Testing, Git, Work items, Memory, or General), ending with `(<YYYY-MM-DD>, <owner name>, in chat)`. One instruction per bullet. A change or removal he asks for changes or removes that bullet.
2. When his words say every project: add the bullet instead to the files the root `AGENTS.md` names for every project ("Where information goes", the row for the owner's preference). Ask "This project or all projects?" only when his words leave it unclear.
3. A request that a problem never happens again, such as "don't let that happen again", is an instruction. Write the bullet as the check or the step that prevents the problem, and name the record that explains it by its ID (a DEC, a work item, a memory record). Show him the bullet in the reply.
4. An instruction you inferred: ask first: "Add to the project rules: <one line>?", and add its line under "Waiting on" in the same turn (step 1 of "Proposals").
5. A lesson that the closing step of `running-work-item-lifecycle` moves up as a rule, with his yes, is written the same way. Its bullet ends with the work item's ID in place of "in chat".

## Reply lines

One line per save, naming the record by its title and where it is kept (`using-memory-store` gives the path or link). Then the next step: the question still waiting for the owner or, when none is waiting, the exact words that continue ("Say 'keep going' and I'll <next action>.").

- A new record: "Saved to memory: <title>. Say 'forget that' to undo."
- A new section: "Saved to memory: <section heading> (in <title>). Say 'forget that' to undo."
- A correction: "Updated in memory: <title>. It said: "<old text>". Say 'undo that' to put it back."
- A fact filed in its home: "Recorded in <file or record, with its ID>. Memory holds no copy."
- A lesson: "Noted a lesson in memory: <heading> (in <title>). Say 'forget that' to undo."
- An event or a run: "Logged in memory: <title>, <date>."
- A rule: "Added to the project rules (<area>): <instruction>. Say 'forget that' to undo."
- A proposal: "Not approved yet. Save to memory: <one line>? (Kept as a proposal in <title>.)"
- A retire: "Retired from memory: <title>. Say 'bring it back' to restore it."
- A delete: "Deleted from memory, as you said: '<his words>'." Then whether it can be brought back.
- A failed save: "Not saved: <reason>." Keep the text, give the fix, and try the save again as soon as the fix is made, in this session.
