# Saving to memory

Use this file when you keep something in memory, correct it, or forget it. It gives the steps for each kind of save, and the line to give the owner after each save.

`references/memory-process.md`, section "When to ask the owner", says when to ask the owner before a save. Its section "A memory record that is out of date or no longer needed" says when a memory record is retired or deleted.

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
- The owner's instructions
- Reply lines

## Decide where the fact is kept

Before you save, test whether memory is the place for the fact. Use `references/memory-criteria.md`, section "First find the place where the fact is kept", and the table in the root `AGENTS.md`, section "Where information goes".

- When the fact is kept in a place outside memory, save it in that place, with the skill that the root `AGENTS.md` names for that place. Then tell the owner where the fact is.
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
  - Update `description` when the record now covers more.
  - Set `updated` to today and maintain the other metadata as `record-format.md` says.
  - Add each related work item to `work_items`, and keep every entry already there.
- **A new memory record.** Name it for the subject, and not for one fact. Use the type that fits: user, project, reference, or event. Give it a first section and an empty lessons section. Set `created` and `updated` to today, and fill the header as `record-format.md` says.
- Each section says four things: what to remember, why it matters, how to apply it, and where it came from, with its date and what is uncertain.
- The one-line summary states the fact itself in a few words, with its dates, and not only the subject. Write "Tom away to 2026-10-20; Sarah covers approvals", never "Notes on availability". A later session sees only this line until it opens the memory record, so keep the summary concise and informative.
- A fact that is true only for a while gets a "check or remove by" date. `references/memory-criteria.md`, section "A fact that is true only for a while", says which date.
- Record what allowed the save. Write "Approved by <owner> on <date>" when the owner asked for the save or said yes to it. Write "Logged by the agent on <date>" for every other save.
- When several independent things call for a save, group them into one save.
- Read the memory record back. When the save changes the project's Current State, update the project's Current State as `references/current-state.md` says.

## An unchecked claim

An unchecked claim is a statement that nobody has confirmed. It is something a person said that nobody checked, such as "another developer says the API allows 100 calls a minute", or something that you concluded and that no source states. It goes in the memory record of the type project for the subject it is about, as its own section. The section holds three things:

- what was claimed, the date, and who said it and to whom, or what you concluded it from;
- the words "Not checked." and what would check the claim;
- a "check or remove by" date chosen for the claim’s usefulness and likelihood of changing, or the date the owner names.

Never state an unchecked claim as a fact. Never act on it without saying that it is unchecked.

When the claim is checked, do one of these, and tell the owner which:

- When the claim is true, save it in the place where it is kept, which is often `wiki/product-wiki/` or `wiki/reference/current-system/`, and remove the section.
- When the claim is false, remove the section.

## A lesson

A lesson is something you learned that is not proven yet.

- While the lesson's work item is open, the lesson goes in that work item, with `managing-work-items`. When `managing-work-items` closes the work item, one of three things happens to the lesson: the owner agrees to keep it for the whole project, it is dropped, or it is given to this skill to be kept.
- When no work item is open, or when the lesson is given to this skill at closing, the lesson goes in the memory record for its subject, in the section "Gotchas and lessons", as one entry. That section holds the lessons that are not proven yet.
  - The entry says what happened and what to do. Its Seen line lists the date, and the session or work item, of each time the lesson came up.
  - The first lesson replaces "None yet."
  - When the same lesson comes up again, add a date to its Seen line. Never give the same lesson a second entry.

An instruction that the owner gives is never a lesson. It is a rule at once, and "The owner's instructions" below gives the steps.

When a lesson has enough supporting evidence to guide future work, offer it to the owner as a rule or a skill. State the evidence and its limits. `references/tidying.md`, section "Lessons that should become rules or skills", gives the steps.

## An event

Use [events-and-recurring-jobs.md](events-and-recurring-jobs.md), section "An event", to record something that happened and that no other record already covers.

## A recurring job and its runs

Use [events-and-recurring-jobs.md](events-and-recurring-jobs.md), section "A recurring job and its runs", to maintain one event record with a row per run.

## A shared file

Use [events-and-recurring-jobs.md](events-and-recurring-jobs.md), section "A shared file", to record where the file is and how it is kept up to date.

## Correcting a fact

- For an ordinary correction or added detail, update the existing record with the new evidence and date. Update its metadata, and set the last-verified date only when you checked the fact against its source.
  - Do not leave the old wording beside the new text.
  - Put the old text in your reply, so that the owner can say "undo that" and you can put it back.
- Search the other memory records and the project's Current State for the old value. Correct current claims and guidance that need the change; preserve dated evidence and superseded history.
- When a decision or fact is replaced, retain the earlier content as history and link the old and new records in both directions. Make a separate replacement record and use the store's replacement procedure. When the earlier record also holds still-current material, mark and link the replaced section while leaving the record current. Update both records' metadata and read both back. Route links used for current guidance to the replacement, and preserve links that document history.

## "Forget that", retiring, and deleting

| "Forget that" is about | Do this |
| --- | --- |
| A save you just made | Undo the save: remove the section you added, put back the old wording of a section you changed, or delete the memory record you made. |
| One older section | Remove the section. Quote the removed text in your reply, so that the owner can say "undo that". |
| A whole subject | Retire its memory record, with the owner's words as the reason. Add " (retired)" after each link to it in other memory records. When the owner says "bring it back", reverse all of these changes. |
| A fact that is kept in a place outside memory | Say where the fact is, and change it there with the skill that the root `AGENTS.md` names. A decision is never deleted: `filing-project-records` supersedes it or withdraws it. |

Delete a memory record in these cases:

- the owner says to delete it;
- removing the security-compromising text would leave no useful memory. In this case, ask the owner before deleting the whole record.

In your reply, say whether the deleted memory record can be brought back. Check whether the file can be recovered from the actual filesystem or backup before reporting that it can.

When you find secrets or information whose storage could compromise system, product, or project security in memory, remove that text at once and tell the owner. Describe the removal without repeating the excluded text or offering to restore it; this overrides the old-text and undo wording elsewhere in this file.

## The owner's instructions

Use [owner-instructions.md](owner-instructions.md) to record the owner's standing instructions, preferences, and corrections in the applicable rule file. That reference preserves the distinction between an instruction the owner gave and one the agent inferred.

## Reply lines

Give the owner one short line for each record you changed, in the form below, and add nothing else about the save. The line names the record by its title and says where the record is kept. `references/memory-store.md` gives the path or the link. The line for a change that removes or replaces text in a memory record or in the project rules also gives what the section for that change asks for: the old text, and the words that undo or restore it. A correction, a removed section, and a retire are such changes. No other line gives undo words.

After reporting the saves, continue the authorized work. When progress needs an owner decision, name the pending question and what it affects.

The line for each kind of save:

- A new memory record: "Saved to memory: <title>."
- A new section: "Saved to memory: <section heading> (in <title>)."
- A correction: "Updated in memory: <title>. It said: "<old text>". Say 'undo that' to put it back."
- A fact saved in a place outside memory: "Recorded in <file or record, with its ID>."
- A lesson: "Noted a lesson in memory: <heading> (in <title>)."
- An event or a run: "Logged in memory: <title>, <date>."
- A change to the project's Current State: "Updated the project's Current State: <what changed, in a few words>."
- A rule: "Added to the project rules (<area>): <instruction>."
- A retire: "Retired from memory: <title>. Say 'bring it back' to restore it."
- A delete: "Deleted from memory, as you said: '<the owner's words>'." Then say whether the memory record can be brought back.
- A failed save: "Not saved: <reason>." Keep the text that you tried to save, tell the owner the fix, and try the save again in this session as soon as the fix is made.
