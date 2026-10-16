# Current State

Current State is `memory/CURRENT_STATE.md`: one short page of what's true now, shown at the start of every session. It holds no history. Its parts and what each line holds are in the file itself; an empty part says "None."

## Rules

- Change it in the same turn the truth changes. Replace a changed line; never add a new one beside it.
- Re-read it right before each change, and change only the lines your work affects, so that a change another session made is kept.
- Keep Active work in priority order, most important first.
- Never copy a work item's status, next action, or wait here. Give its ID and a few words; the work item holds the rest.
- A to-do is never kept only here. It becomes a project task or a work item task, and a dated one also gets a Coming up line naming its ID. For a to-do at a set time, tell the owner and offer a scheduled reminder if one is available.
- A passed deadline may still mean unfinished work. Check before removing its line.
- Before removing a line about something a later session must know, make sure a record holds it: a work item, project task, source, or event record.
- Remove lines that are no longer true without asking. Cutting a line that's still true needs the owner's yes.

## When another skill reports work

`managing-work-items` and `handoff` call this skill at these moments:

- **Work on an item starts:** add its Active work line, and point Where we stopped at it.
- **Its next step or wait changes:** update Where we stopped if the focus moved. Add a Waiting on line only if something outside the work item is owed.
- **Something waits on a record or decision that no work item holds:** add a Waiting on line naming what waits, the items it affects, and on whom. Remove it when the wait ends.
- **An item closes:** remove its Active work, Coming up, Waiting on, and Where we stopped lines.
- **A closing item leaves a lesson:** keep it as `saving.md`, "Lessons", says.
- **A session hands off:** write Where we stopped, check each of the session's items has a true Active work line, remove every line that's no longer true, and set Last updated to the date, `handoff`, and `agent`. If Current State is missing, don't create it: tell the owner, suggest the setup check, and put the line you would have written in the handoff prompt.
