# Saving to memory

Use this file when you keep something in memory, correct it, or forget it. It gives the steps for each kind of save, and the line to give the owner after each save.

`SKILL.md` says when a save needs the owner's yes, in its section "The owner's yes before a save". It says when a memory record is retired or deleted in its section "A memory record that is out of date or no longer needed".

## Contents

- Decide where the fact is kept
- Find the subject's memory record first
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

## Decide where the fact is kept

Before you save, test whether memory is the place for the fact. Use `references/memory-criteria.md`, section "First find the place where the fact is kept", and the table in the root `AGENTS.md`, section "Where information goes".

- When the fact is kept in a place outside memory, save it in that place, with the skill that the root `AGENTS.md` names for that place. Then tell the owner where the fact is.
  - The owner's request to remember the fact is the owner's yes to write it in that place.
  - Show the owner a change to `PROJECT.md` before you save the change.
- A decision, a term, or a rule of the system never becomes a memory record. Give it to `filing-project-records`.
- A to-do, a reminder, or an action item is a project task, or a task in its work item. Give it to `running-work-item-lifecycle`. When it carries a date, the date also goes under "Coming up" in the project's Current State, as `references/current-state.md` says.
- When nothing qualifies for a save, save nothing. A reminder that a hook prints is only a hint. A hook is a small command that Claude Code or Codex runs by itself at set moments.

## Find the subject's memory record first

Search before every save. Search for the fact's words and their synonyms, and read each likely memory record whole. Then do the one of these that fits:

- When the same fact is already there, save nothing, and tell the owner where it is.
- When a section says something different, the save is a correction. "Correcting a fact" below gives the steps.
- When a memory record of the right type covers the subject, add a section to it.
- When no memory record covers the subject, make a new memory record.
- When two memory records fit, pick the one that a future session would open first, and link the other one under the label "Related memories" in that memory record.

## Write the change

- **A section in a memory record that exists.** Add the fact as its own section, above the record's lessons. Then do three things:
  - Update the record's one-line summary when the record now covers more.
  - Set the record's last-changed date.
  - Add each related work item, and keep every work item that is already there.
- **A new memory record.** Name it for the subject, and not for one fact. Use the type that fits: user, project, reference, or event. Give it a first section and an empty lessons section. Set its created date and its last-changed date to today.
- Each section says four things: what to remember, why it matters, how to apply it, and where it came from, with its date and what is uncertain.
- The one-line summary states the fact itself in a few words, with its dates, and not only the subject. Write "Tom away to 2026-10-20; Sarah covers approvals", never "Notes on availability". A later session sees only this line until it opens the memory record, so keep the summary to one line of about 100 characters or fewer.
- A fact that is true only for a while gets a "check or remove by" date. `references/memory-criteria.md`, section "A fact that is true only for a while", says which date.
- Record what allowed the save, as one of these three: "Approved by <owner> on <date>", "Trusted grant, <date>", or "Proposed by the agent on <date>; not approved".
- When several independent things call for a save, group them into one save.
- Read the memory record back. When the save changes the project's Current State, update the project's Current State as `references/current-state.md` says.

## An unchecked claim

An unchecked claim is something a person said that nobody checked, such as "another developer says the API allows 100 calls a minute". It goes in the memory record of the type project for the subject it is about, as its own section. The section holds three things:

- what was claimed, who said it, to whom, and the date;
- the words "Not checked." and what would check the claim;
- a "check or remove by" date, 30 days ahead unless the owner names one.

Never state an unchecked claim as a fact. Never act on it without saying that it is unchecked.

When the claim is checked, do one of these, and tell the owner which:

- When the claim is true, save it in the place where it is kept, which is often `system/` or `reference/current-system/`, and remove the section.
- When the claim is false, remove the section.

## A lesson

A lesson is something you learned that is not proven yet.

- While the lesson's work item is open, the lesson goes in that work item, with `running-work-item-lifecycle`. When `running-work-item-lifecycle` closes the work item, one of three things happens to the lesson: the owner agrees to keep it for the whole project, it is dropped, or it is given to this skill to be kept.
- When no work item is open, or when the lesson is given to this skill at closing, the lesson goes in the memory record for its subject, in the section "Gotchas and lessons", as one entry. That section holds the lessons that are not proven yet.
  - The entry says what happened and what to do. Its Seen line lists the date, and the session or work item, of each time the lesson came up.
  - The first lesson replaces "None yet."
  - When the same lesson comes up again, add a date to its Seen line. Never give the same lesson a second entry.

An instruction that the owner gives is never a lesson. It is a rule at once, and "The owner's instructions" below gives the steps.

When a lesson has come up in two or more sessions or work items, offer it to the owner as a rule or a skill. Make the offer in the turn in which you add the second date. `references/tidying.md`, section "Lessons that should become rules or skills", gives the steps.

## An event

An event is one of two things:

- work done for the owner that no work item, project task, commit, or filed record shows;
- anything else that happened and that a later session must know, such as a meeting, a call, or an outage.

Make one event record for it, in the same turn, and ask no question first. The event record holds four things:

- the date, and who took part;
- what was done or what happened;
- the result, in a few lines;
- where the output is: an SRC ID, a file path, a work item or project task ID, or "said in chat only".

Name the event record for what happened and its date.

One kind of result gets no event record. When the root `AGENTS.md`, section "Where information goes", names a place for the result, write the result in that place. An analysis of how the system works today is an example.

## A recurring job and its runs

A recurring job is a job that the team runs again and again, such as a weekly data load, a monthly release, or the update of a shared sheet after each meeting. A recurring job has one event record. That event record holds two things:

- a first section that says what the job is, when it runs, who runs it, and the exact steps or the file that holds the steps;
- a section "Runs" with one row per run. `using-memory-store` gives the form of the table.

Add a row in the turn in which the run happens or the owner reports it. The owner may report a run in words such as "the weekly load ran fine" or "the nightly job broke again".

- A failed run gets a row too, with the error and the fix.
- Ask no question before you add the row. Report the row in one line.
- When the owner reports a run without its detail, write the row first: the date, the owner's words, and "not known yet" in each cell that the owner did not give. Then ask for what is missing, and complete the row with the owner's answer.
- When the job has no event record yet, make one with what is known. Add the job's line under "Standing jobs and shared files" in the project's Current State, as `references/current-state.md` says.
- When another record, such as a work item, already shows an earlier run, the row for that run holds only the date and that record's ID.

Before you run the job again, and before you answer how the last run went, read the Runs table.

## A shared file

A shared file is a file kept outside the project's records that people keep up to date, such as an open-items spreadsheet that the client shares. A shared file has one memory record of the type reference. That memory record says where the file is, who shares it, what it is for, and how and when it is updated.

- The shared file gets a line under "Standing jobs and shared files" in the project's Current State.
- The updates of the shared file are a recurring job, as the section above describes. The job's event record names the shared file's memory record under "Related memories".

## Correcting a fact

- Replace the text of the fact's section, with the new source and date, and set the last-verified date to today.
  - Do not leave the old wording beside the new text.
  - Put the old text in your reply, so that the owner can say "undo that" and you can put it back.
- Search the other memory records and the project's Current State for the old value, and correct each place that holds it.
- When a whole subject is replaced, make the new memory record, and say in it that it replaces the old one. Mark the old memory record as replaced. Change every link to the old memory record so that it leads to the new one.

## "Forget that", retiring, and deleting

| "Forget that" is about | Do this |
| --- | --- |
| A save you just made | Undo the save: remove the section you added, put back the old wording of a section you changed, or delete the memory record you made. |
| One older section | Remove the section. Quote the removed text in your reply, so that the owner can say "undo that". |
| A whole subject | Retire its memory record, with the owner's words as the reason. Add " (retired)" after each link to it in other memory records. When the owner says "bring it back", reverse all of these changes. |
| A fact that is kept in a place outside memory | Say where the fact is, and change it there with the skill that the root `AGENTS.md` names. A decision is never deleted: `filing-project-records` supersedes it or withdraws it. |

Delete a memory record in these cases:

- the owner says to delete it;
- it is a proposal that the owner said no to;
- it holds a secret or an email address. In this case, ask the owner first.

In your reply, say whether the deleted memory record can be brought back. `using-memory-store` says whether it can.

When you find a secret or an email address in memory, remove that text at once, and tell the owner.

## Proposals: a save the owner has not answered

A proposal is a save that needs the owner's yes and does not have it yet. Keep such a save as a proposal in the same turn in which you ask "Save to memory: <one line>?", so that the save is not lost when the session ends before the owner answers. Do so for every such question, also for one about a fact found in a document that the owner shared.

Two kinds of save are never kept as a proposal in memory. Each of them gets only its line under "Waiting on", which step 1 below describes:

- a rule you inferred;
- a save that holds more about a named person than attendance, work role, when the person is away, or who covers. The line for this save names the person and leaves those details out until the owner's yes.

1. Add one line under "Waiting on" in the project's Current State: "Owner: save to memory? <the fact in one line> (asked <date>)".
   - For a rule, the line is "Owner: add to the project rules? <one line>".
   - Several open proposals share one line that names each of them.
   - Remove each proposal from the line as the owner answers it, and remove the line when none is left.
2. Save the proposal in the place where it would be kept after the owner's yes, and mark it as proposed. `using-memory-store` says how.
3. When the owner says yes, remove the marks, mark the memory record as current, and record "Approved by <owner> on <date>".
4. When the owner says no, remove the proposal. When the owner gives a general rule about what to keep, write that rule in the project rules under "Memory", and check later candidates against it.

## The owner's instructions

An instruction from the owner for how the agent works is a rule, and never memory. So is a preference of the owner, and a correction of how the agent works. The owner's own words are the owner's yes.

Write a line that the owner dictates with the steps below alone. For every other change to a rule file, use `writing-harness-files`.

1. Read `.claude/rules/owner-preferences.md` again, right before you change it. Then do the one of these that fits:
   - When a bullet already says the same, add nothing, and tell the owner so.
   - When a bullet says the opposite, replace it with the owner's new words, and name the old line in your reply.
   - Otherwise, add one bullet in the owner's words under the `## ` area that the instruction is about: Replies, Questions, Testing, Git, Work items, Memory, or General. End the bullet with `(<YYYY-MM-DD>, <owner name>, in chat)`. Write one instruction per bullet.
   - When the owner asks to change or remove an instruction, change or remove that bullet.
2. When the owner's words say that the instruction is for every project, add the bullet to the files that the root `AGENTS.md` names for every project, in place of this project's file. The root `AGENTS.md` names those files in the section "Where information goes", in the row for the owner's preference. Ask "This project or all projects?" only when the owner's words leave it unclear.
3. A request that a problem never happens again, such as "don't let that happen again", is an instruction. Write the bullet as the check or the step that prevents the problem. In the bullet, name the record that explains the problem by its ID: a DEC, a work item, or a memory record. Show the owner the bullet in your reply.
4. When you inferred an instruction, ask first: "Add to the project rules: <one line>?". In the same turn, add its line under "Waiting on" in the project's Current State, as step 1 of "Proposals: a save the owner has not answered" says.
5. When `running-work-item-lifecycle` closes a work item and the owner agreed to keep a lesson from it as a rule, write that rule in the same way. Its bullet ends with the work item's ID in place of "in chat".

## Reply lines

Give the owner one line for each save. The line names the record by its title and says where the record is kept. `using-memory-store` gives the path or the link.

After the lines, give the next step. The next step is the question that still waits for the owner. When no question waits, it is the exact words that continue the work: "Say 'keep going' and I'll <next action>."

The line for each kind of save:

- A new memory record: "Saved to memory: <title>. Say 'forget that' to undo."
- A new section: "Saved to memory: <section heading> (in <title>). Say 'forget that' to undo."
- A correction: "Updated in memory: <title>. It said: "<old text>". Say 'undo that' to put it back."
- A fact saved in a place outside memory: "Recorded in <file or record, with its ID>. Memory holds no copy."
- A lesson: "Noted a lesson in memory: <heading> (in <title>). Say 'forget that' to undo."
- An event or a run: "Logged in memory: <title>, <date>."
- A rule: "Added to the project rules (<area>): <instruction>. Say 'forget that' to undo."
- A proposal: "Not approved yet. Save to memory: <one line>? (Kept as a proposal in <title>.)"
- A retire: "Retired from memory: <title>. Say 'bring it back' to restore it."
- A delete: "Deleted from memory, as you said: '<the owner's words>'." Then say whether the memory record can be brought back.
- A failed save: "Not saved: <reason>." Keep the text that you tried to save, tell the owner the fix, and try the save again in this session as soon as the fix is made.
