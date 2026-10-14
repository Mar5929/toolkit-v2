# The project's Current State

Use this file when you read or change the project's Current State. It says what each part holds, when to change a line, and when to remove one. The goal is that every line is true now, and that the whole of it is short enough for a session to show at its start.

`references/memory-store.md` says where the project's Current State is kept and how to edit it.

## Contents

- What it holds
- Who decides each line
- When to change it
- Removing what is no longer true
- Steps for removing lines that are no longer true

## What it holds

The project's Current State says where the project stands right now. It is not a memory record: it changes often, and it holds no history.

- Start it with "Last updated: <YYYY-MM-DD, source, and person or agent>", and set that line with every change.
- An empty part says "None."

Keep these five parts concise and retain what a later session needs.

| Part | What goes in it |
| --- | --- |
| Now | One line per active piece of work. |
| Coming up | A dated event or deadline. |
| Waiting on | Who owes what. |
| Standing jobs and shared files | A recurring job, or a shared file that is kept up to date. |
| Next session starts with | One line per piece of work that was worked on last. |

Write each line in as few words as convey its meaning. Keep details in the linked records so that Current State remains useful at session start.

### A line under "Now"

- For a work item, the line holds the work item's ID and a few words on what it is for, for example "WI-031: logging a transaction".
  - Where the work item stands, its next action, and what it waits on stay in the work item's Current state.
  - Never copy those three things into the project's Current State.
- For a piece of work that is not a work item, the line holds a few words on what it is, with the ID of its project task or record when it has one. For example: "Preparing the 2026-10-07 client meeting (PT-04)".

### A line under "Coming up"

The line starts with the date, as YYYY-MM-DD. Then it says what the event or deadline is, who takes part, and the piece of work or record that prepares it, by its ID and a few words.

### A line under "Waiting on"

- The line starts with the person or party that owes something: the owner, the client, or a vendor.
- Write a line only for what work waits on, or for what has no other record. The thing owed is a decision or an action. The line gives the date it was asked and when to check again.
- When the thing owed has a record, name the record by its ID and a few words, never by its whole text. For example, name a project task as "PT-06: the feed's field list", and an Open decision as "DEC-012: the fiscal year start".
- A question that you asked the owner, that work waits on, and that no work item holds also gets a line here: "Owner: <the question in a few words> (asked <date>)".

### A line under "Standing jobs and shared files"

The line holds the name of the recurring job or the shared file, when it runs or is updated, and the memory record that holds its runs or says where it is.

### A line under "Next session starts with"

- For a work item, the line holds the work item's ID and "read its Current state".
- For a piece of work that is not a work item, the line says what it is and its next step.
- Never copy a work item's next action into this part.

## Who decides each line

| Line | Decided by |
| --- | --- |
| A work item's line under "Now" | `managing-work-items` |
| Every other line under "Now", and every line under "Coming up", "Waiting on", and "Standing jobs and shared files" | This skill |
| A line under "Next session starts with", at a handoff | `handoff` |
| A line under "Next session starts with", when there is no handoff | `managing-work-items` for a work item, and this skill for every other piece of work. The skill sets this part in the turn in which that work starts or changes, so that the part names that piece of work. |

## When to change it

- When something changes what is true in the project now, change the project's Current State in the same turn. Add the line that became true, and replace or remove the line that stopped being true. "What it holds" above says which part holds each line.
- Read the project's Current State again right before you change it. When a line changes, replace that line. Never add a new line beside the old one.
- A to-do, a reminder, or an action item is never kept only in the project's Current State. `managing-work-items` saves it as a project task or as a task in its work item. When it has a date, it also gets a line under "Coming up" that names its ID.
- A to-do with a set time, such as "at 9 tomorrow", needs a reminder at that time. Tell the owner so. When Claude Code or Codex has a scheduled task tool, offer to set a reminder with that tool.

## Removing what is no longer true

Two skills remove lines:

- `managing-work-items` removes a work item's line under "Now" when the work item finishes.
- This skill removes every other line: a piece of work that ended, an event that ended or a deadline whose outcome is recorded, a thing owed that was delivered or answered, a job that stopped, and a file that is no longer shared.

A passed deadline can still represent unfinished work. Check the work record, preserve the unresolved commitment, and update its date or follow-up when known.

Before you remove a line for something that happened and that a later session must know, check that a record holds it. That record is a work item, a project task, a filed source, or an event record. `references/saving.md`, section "An event", says how to make an event record.

## Steps for removing lines that are no longer true

Use these steps when the project's Current State contains stale, repeated, or unnecessary detail.

1. Read the project's Current State. Read the status of every work item that it names, with `managing-work-items`. Read each project task that it names.
2. Remove every line that is no longer true. These removals do not go on the plan that `references/tidying.md` describes. Tell the owner what you removed, in the one line that `references/saving.md`, section "Reply lines", gives for the project's Current State. Remove each of these:
   - under "Now", a finished or cancelled work item, or a piece of work that ended;
   - a line under "Coming up" whose event ended or whose deadline was met, cancelled, or moved;
   - a line under "Waiting on" that was answered or delivered, or whose project task is done, or whose decision is no longer Open;
   - a job that no longer runs, or a file that is no longer shared;
   - a line under "Next session starts with" that names a closed work item.

   A line that copies a work item's status or next step is not removed: cut it to the work item's ID and a few words.
3. Set "Last updated:". Remove any sample line or prompt that is still there. A prompt is text in angle brackets.
4. When a true line is no longer useful at session start, propose removing it on the plan that `references/tidying.md` describes, with its reason. Preserve the fact in its proper record. Cut a true line only after the owner's yes.
