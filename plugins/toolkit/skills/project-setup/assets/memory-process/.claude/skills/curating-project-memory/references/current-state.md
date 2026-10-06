# Current State

What Current State holds, its limits, and when to change it. Where it is kept and how to edit it: `using-memory-store`.

## What it holds

Current State is where the project stands right now. It is not lasting memory: it changes often, and it holds no history. Start it with "Last updated: <YYYY-MM-DD, source, and person or agent>", and set that line with every change. An empty section says "None."

| Section | What goes in it | Lines |
| --- | --- | --- |
| Now | Every active thread of work, one line each. A work item: its ID and a few words on what it is for ("WI-031: logging a transaction"). Where it stands, its next action, and what it waits on stay in the item's own Current state. Never copy them here. A thread that is no work item: a few words on what it is, with the ID of its project task or record when it has one ("Preparing the 2026-10-07 client meeting (PT-04)"). | 5 |
| Coming up | A dated event or deadline: the date first, as YYYY-MM-DD, then what it is, who takes part, and the thread or record that prepares it, by its ID and a few words. | 3 |
| Waiting on | Who owes what, with the person or party first: the owner, the client, a vendor. Only what work waits on, or what has no other record: a decision or an action, with the date it was asked and when to check again. A thing owed that has a record is named by its ID and a few words, never by its whole text: a project task ("PT-06: the feed's field list"), an Open decision ("DEC-012: the fiscal year start"). A save question the owner has not answered. | 4 |
| Standing jobs and shared files | A recurring job, or a shared file that is kept up to date: its name, when it runs or is updated, and the memory record that holds its runs or says where it is. | 3 |
| Next session starts with | One line per thread worked on last. A work item: its ID and "read its Current state". A thread that is no work item: the thread and its next step. Never a copy of a work item's next action. | 3 |

The whole of Current State stays under 40 lines and 1,600 characters, so a session can show it whole at its start. Write each line in as few words as say it.

## Who decides each line

| Line | Decided by |
| --- | --- |
| A work item's line under Now | `running-work-item-lifecycle` |
| Every other line under Now, and every line under Coming up, Waiting on, and Standing jobs and shared files | This skill |
| "Next session starts with" | `handoff`, at a handoff. With no handoff: the skill that adds or changes a line under Now sets this part in the same write, so it names that thread. |

## When to change it

- `SKILL.md`, "Before a turn ends", says which lines a turn adds. An unanswered question that work waits on is a line under Waiting on.
- Update it when a save changes it. A change to Current State alone needs no memory question.
- Read it fresh first. When a line changes, replace that line. Never add one beside the old one.
- A to-do, a reminder, or an action item is never kept only here: `running-work-item-lifecycle` saves it as a project task or a task in its work item. One with a date also gets a line under Coming up that names its ID.
- A to-do with a set time ("at 9 tomorrow") needs a reminder at that time: tell him, and offer to set one with the host's scheduled task tool when there is one.
- The lines for a save question he has not answered are written and removed as `references/saving.md`, "Proposals", says.

## Removing what is no longer true

Remove a line the moment it stops being true. Check every line at each of these moments: a handoff, a work item closing, a date under Coming up passing, and a hook saying Current State is too long or too old.

- `running-work-item-lifecycle` removes an item's line under Now when the item finishes.
- This skill removes every other line: a thread that ended, a date that passed, a thing owed that was delivered or answered, a job that stopped, a file that is no longer shared.
- Before you remove a line for something that happened and that a later session must know, check that a record holds it: a work item, a project task, a filed source, or an event record (`references/saving.md`, "An event").

## Pruning

1. Read Current State, the status of every work item it names (`using-work-tracker`), and each project task it names.
2. Remove every line that is no longer true, with no plan, and tell the owner what was removed:
   - a finished or cancelled item, or a thread that ended, under Now;
   - a line under Coming up whose date has passed;
   - a line under Waiting on that was answered or delivered, or whose project task is done, or whose decision is no longer Open;
   - a save question he has answered;
   - a job that no longer runs, or a file that is no longer shared;
   - a "Next session starts with" line that names a closed item;
   - a line that copies an item's status or next step: cut it to the ID and a few words.
3. Set "Last updated:". Remove any sample line or prompt (text in angle brackets) still there.
4. A section still over its limit holds only true lines. Put the lines you propose to cut on the tidying plan (`references/tidying.md`), each with its reason, choosing the ones the next session is least likely to need. Cut a true line only after his yes.

## "Where are we"

The root `AGENTS.md`, "Which skill", lists what to read for this question. From Current State, report every line under Coming up and Waiting on, with its date. A line whose date has passed is reported as passed, then pruned.
