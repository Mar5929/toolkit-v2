# Current State

What Current State holds, its limits, and when to change it. Where it is kept and how to edit it: `storing-project-memory`.

## What it holds

Current State is where the project stands right now. It is not lasting memory: it changes often, and it holds no history. Start it with "Last updated: <YYYY-MM-DD, source, and person or agent>", and set that line with every change. An empty section says "None."

| Section | What goes in it | Lines |
| --- | --- | --- |
| Now | One active work item per line: its ID and a few words on what it is for ("WI-031: logging a transaction"). Where it stands, its next action, and what it waits on stay in the item's own Current state. Never copy them here. | 5 |
| Waiting on the owner | A decision or action only the owner can take that has no work item, or a save question he has not answered: who needs it and when to check again. | 5 |
| Untracked to-dos | An owner request that has no work item. When one is made, replace the line with the item's ID under Now. | 7 |
| Next session starts with | Where to resume (for a work item, its ID), what to read, and the next concrete action. | 3 |

The whole of Current State stays under 40 lines.

## When to change it

- Update it when a save changes it. A change to Current State alone needs no memory question.
- Read it fresh first. When a line changes, replace that line. Never add one beside the old one.
- Remove a line the moment it stops being true. `managing-work-items` removes an item's line when the item finishes, `handoff` rewrites "Next session starts with", and this skill removes a waiting line when the owner answers and prunes the rest.
- An owner to-do with no work item goes under Untracked to-dos. Offer him a work item for it.
- A to-do with a set time ("at 9 tomorrow") does not go in Current State. Tell him it needs a reminder at that time, and offer to set one with the host's scheduled task tool when there is one.
- Never remove an unresolved owner to-do only to meet a limit. Offer him a work item for it instead.
- The lines for a save question he has not answered are written and removed as `references/saving.md`, "Proposals", says.

## Pruning

1. Read Current State, and the status of every work item it names (`tracking-work-items`).
2. Remove every line that is no longer true, with no plan, and tell the owner what was removed:
   - a finished or cancelled item under Now;
   - an answered question under Waiting on the owner;
   - a save question he has answered;
   - a to-do that now has a work item: put the item's ID under Now, unless it is already there or the item is Done or Cancelled;
   - a Now line that copies an item's status or next step: cut it to the ID and a few words.
3. Rewrite "Next session starts with" when it is out of date. Set "Last updated:". Remove any sample line or prompt (text in angle brackets) still there.
4. A section still over its limit holds only true lines. Put the lines you propose to cut on the tidying plan (`references/tidying.md`), each with its reason, choosing the ones the next session is least likely to need. Cut a true line only after his yes.
