# Current State

One short page of what's true now, shown at the start of every session. It holds no history. It starts with "Last updated: <date, source, who>", and an empty part says "None."

| Part | Holds | Example line |
| --- | --- | --- |
| Now | One line per active piece of work | WI-031: logging a transaction |
| Coming up | Dated events and deadlines | 2026-10-20: steering meeting with the client, prepared in PT-07 |
| Waiting on | Who owes what the work waits on | Client: the feed's field list (PT-06), asked 2026-10-10, check 2026-10-17 |
| Standing jobs and shared files | Recurring jobs and maintained shared files | Weekly data load, Mondays; runs in event_weekly-data-load |
| Next session starts with | Where to pick up | WI-031: read its Current state |

## Rules

- Change it in the same turn the truth changes. Replace a changed line; never add a new one beside it.
- Never copy a work item's status, next action, or wait here. Give its ID and a few words; the work item holds the rest.
- A to-do is never kept only here. It becomes a project task or a work item task, and a dated one also gets a Coming up line naming its ID. For a to-do at a set time, tell the owner and offer a scheduled reminder if one is available.
- Before removing a line about something a later session must know, make sure a record holds it: a work item, project task, source, or event record.
- A passed deadline may still mean unfinished work. Check before removing it.
- Remove lines that are no longer true without asking. Cutting a line that's still true needs the owner's yes.

## When another skill reports work

`managing-work-items` and `handoff` call this skill at these moments:

- **Work on an item starts:** add its Now line, and point Next session at it.
- **Its next step or wait changes:** update Next session if the focus moved. Add a Waiting on line only if something outside the work item is owed.
- **Something waits on a record or decision that no work item holds:** add a Waiting on line naming what waits, the items it affects, and on whom. Remove it when the wait ends.
- **An item closes:** remove its Now, Coming up, Waiting on, and Next session lines.
- **A closing item leaves a lesson:** keep it as `saving.md`, "Lessons", says.
- **A session hands off:** write Next session starts with, check each of the session's items has a true Now line, remove every line that's no longer true, and set Last updated to the date, `handoff`, and `agent`. If Current State is missing, don't create it: tell the owner, suggest the setup check, and put the line you would have written in the handoff prompt.
