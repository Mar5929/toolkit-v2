# The project's Current State

Use this file when you read or change the project's Current State. It says what each part holds, the limit of each part, when to change a line, and when to remove one. The goal is that every line is true now, and that the whole of it is short enough for a session to show at its start.

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

It has five parts. Each part has a limit in lines.

| Part | What goes in it | Limit, in lines |
| --- | --- | --- |
| Now | One line per active piece of work. | 5 |
| Coming up | A dated event or deadline. | 3 |
| Waiting on | Who owes what. | 4 |
| Standing jobs and shared files | A recurring job, or a shared file that is kept up to date. | 3 |
| Next session starts with | One line per piece of work that was worked on last. | 3 |

The whole of the project's Current State stays under 40 lines, so that a session can show it whole at its start. Write each line in as few words as say it. When a part has more true lines than its limit, follow step 4 of "Steps for removing lines that are no longer true" below.

### A line under "Now"

- For a work item, the line holds the work item's ID and a few words on what it is for, for example "WI-031: logging a transaction".
  - Where the work item stands, its next action, and what it waits on stay in the work item's Current state. The work item's Current state is the five lines at the top of a work item.
  - Never copy those three things into the project's Current State.
- For a piece of work that is not a work item, the line holds a few words on what it is, with the ID of its project task or record when it has one. For example: "Preparing the 2026-10-07 client meeting (PT-04)".

### A line under "Coming up"

The line starts with the date, as YYYY-MM-DD. Then it says what the event or deadline is, who takes part, and the piece of work or record that prepares it, by its ID and a few words.

### A line under "Waiting on"

- The line starts with the person or party that owes something: the owner, the client, or a vendor.
- Write a line only for what work waits on, or for what has no other record. The thing owed is a decision or an action. The line gives the date it was asked and when to check again.
- When the thing owed has a record, name the record by its ID and a few words, never by its whole text. For example, name a project task as "PT-06: the feed's field list", and an Open decision as "DEC-012: the fiscal year start".
- A question about a save that the owner has not answered also gets a line here.

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
| A line under "Next session starts with", when there is no handoff | The skill that adds or changes a line under "Now". It sets this part in the same write, so that the part names that piece of work. |

## When to change it

- `references/memory-process.md`, section "Before a turn ends", says which lines a turn adds. An unanswered question that work waits on is a line under "Waiting on".
- When a save changes the project's Current State, update it. A change to the project's Current State alone needs no question to the owner about memory.
- Read the project's Current State again right before you change it. When a line changes, replace that line. Never add a new line beside the old one.
- A to-do, a reminder, or an action item is never kept only in the project's Current State. `managing-work-items` saves it as a project task or as a task in its work item. When it has a date, it also gets a line under "Coming up" that names its ID.
- A to-do with a set time, such as "at 9 tomorrow", needs a reminder at that time. Tell the owner so. When Claude Code or Codex has a scheduled task tool, offer to set a reminder with that tool.
- For a question about a save that the owner has not answered, write and remove the lines as `references/saving.md`, section "Proposals: a save the owner has not answered", says.

## Removing what is no longer true

Remove a line the moment it stops being true. Check every line at each of these moments:

- a handoff;
- a work item closing;
- a date under "Coming up" passing;
- a hook saying that the project's Current State is too long or too old. A hook is a small command that Claude Code or Codex runs by itself at set moments.

Two skills remove lines:

- `managing-work-items` removes a work item's line under "Now" when the work item finishes.
- This skill removes every other line: a piece of work that ended, a date that passed, a thing owed that was delivered or answered, a job that stopped, and a file that is no longer shared.

Before you remove a line for something that happened and that a later session must know, check that a record holds it. That record is a work item, a project task, a filed source, or an event record. `references/saving.md`, section "An event", says how to make an event record.

## Steps for removing lines that are no longer true

The session-start hook asks for these steps with the words "Prune it".

1. Read the project's Current State. Read the status of every work item that it names, with `managing-work-items`. Read each project task that it names.
2. Remove every line that is no longer true. These removals do not go on the plan that `references/tidying.md` describes. Tell the owner what you removed. Remove each of these:
   - under "Now", a finished or cancelled work item, or a piece of work that ended;
   - a line under "Coming up" whose date has passed;
   - a line under "Waiting on" that was answered or delivered, or whose project task is done, or whose decision is no longer Open;
   - a question about a save that the owner has answered;
   - a job that no longer runs, or a file that is no longer shared;
   - a line under "Next session starts with" that names a closed work item.

   A line that copies a work item's status or next step is not removed: cut it to the work item's ID and a few words.
3. Set "Last updated:". Remove any sample line or prompt that is still there. A prompt is text in angle brackets.
4. A part that is still over its limit now holds only true lines. Put the lines you propose to cut on the plan that `references/tidying.md` describes, each with its reason. Choose the lines that the next session is least likely to need. Cut a true line only after the owner's yes.
