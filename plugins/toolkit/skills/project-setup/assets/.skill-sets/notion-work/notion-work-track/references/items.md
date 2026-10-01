# Work items in Notion: create, change, approve, close

Purpose: every change to one work item, as exact `ntn` steps, and the rules
each change keeps.

## Contents

- A new work item
- Stage and status
- Current state
- Waiting on and blockers
- Writing a section of the page
- Recent History rows
- Questions and Answers
- Approvals
- Marking Done, cancelling, archiving
- The Solution Design page
- Moving an item under another parent
- A card made by hand in Notion

## A new work item

1. **Level check.** A new item under a parent must stay within three
   levels. Read the parent's "Parent item"; if the parent has a parent that
   itself has a parent, the parent is already level 3: refuse, and offer a
   task on that item instead.
2. **Create it from the work item template**, the Work Items database's
   default template (`{{…}}` from `PROJECT.md`):

   ```json
   {"parent": {"type": "data_source_id", "data_source_id": "{{WORK_ITEMS_DS}}"},
    "properties": {
      "Work item": {"title": [{"text": {"content": "<Title>"}}]},
      "Status": {"status": {"name": "Backlog"}},
      "Stage": {"select": {"name": "01-discovery"}},
      "Type": {"select": {"name": "<type>"}},
      "Priority": {"select": {"name": "medium"}},
      "Waiting on": {"select": {"name": "none"}},
      "Requirements approved": {"rich_text": [{"text": {"content": "no"}}]},
      "Design": {"select": {"name": "none"}},
      "Design approved": {"rich_text": [{"text": {"content": "no"}}]},
      "Result approved": {"rich_text": [{"text": {"content": "no"}}]},
      "Delivery": {"select": {"name": "not-offered"}},
      "Parent item": {"relation": [{"id": "<parent-page-id>"}]},
      "Phase": {"relation": [{"id": "<phase-page-id>"}]}},
    "template": {"type": "default"}}
   ```

   Leave out "Parent item" and "Phase" for a top-level item. A sub-item
   goes in the parent's In Progress phase with the lowest Order; when there
   is none, in its Not Started phase with the lowest Order; when there is
   neither, leave "Phase" out (the tree shows it under "No phase"). Use only
   a phase whose "Work item" is that parent. Send it with
   `ntn api v1/pages -d @new.json < /dev/null`; the answer holds the page
   `id`, `url`, and the new ID (`.properties.ID.unique_id`: prefix and
   number, shown as `WI-31`). If Notion refuses because the database has no
   default template, tell the owner and follow `setup.md`, "Bringing a
   project up to the current template", step 4.
3. **Wait** for the template (`ntn-basics.md`): more than 20 blocks.
4. **Fill the text** with one `update_content` call: the Goal, the
   Current state lines (Where it stands "Created on YYYY-MM-DD; not
   started.", Next action "Agent: ask the first requirements question, with
   work-refine.", Waiting on "Nothing.", Blockers "None.", Last
   updated today), Related items, the Starting request in the owner's
   words, and the first Recent History row ("Created."). Replace every
   `\<…\>` prompt you have a value for; leave the others for work-refine to
   fill.
5. **Copy "Next action"** into the Next action property.
6. **Parent's page:** add a Recent History row there too ("Sub-item WI-32
   created: <title>.").

## Stage and status

Status follows stage. Set both in one call:

| Stage | Status |
| --- | --- |
| 01-discovery, 02-refinement | Backlog |
| 03-requirements-approved | Ready |
| 04-solution-design to 11-user-approval | In Progress |
| 12-pr-and-push, 13-deployment, 14-spec-update | In Review |

```bash
ntn api v1/pages/<page-id> -X PATCH -d '{"properties":{"Stage":{"select":{"name":"08-build"}},"Status":{"status":{"name":"In Progress"}}}}' < /dev/null
```

- Done and Cancelled are never set by a stage move ("Marking Done").
- A `build` or `data-load` item cannot move to 03 or later until
  Requirements approved holds an approval.
- The owner may drag a card on the Board. His Status wins: set the Stage
  that matches it only if he asks, and never undo his move.

## Current state

The five lines under the Overview's "Current state" heading are one text
block, the lines joined by `<br>`.

- Rewrite them in place after each step, with one `update_content` call
  whose `old_str` is the whole block as read.
- Copy a changed Next action into the Next action property in the same
  step, so the board card shows it.

## Waiting on and blockers

An item waiting on someone has the "Waiting on" property set (owner,
agent, external, none), and its Current state "Waiting on" line says who
and for what. There is no "Blocked" status. When the wait ends, set the
property to "none" (or "agent" when the agent continues), the Waiting on
line to "Nothing.", and the Blockers line to "None."

## Writing a section of the page

Read the page text, then change it with `update_content` (`ntn-basics.md`).
Keep every heading, label, and view line. Only these sections are text:
Overview (with its Current state), Recent History, Requirements, Questions
and Answers, Notes. The Roadmap, Sub-items, and Tasks sections are views:
change their rows (planning.md), never their text.

## Recent History rows

Newest first, naming the Q-ID instead of repeating a decision. Add a row
for an answer, approval, rejection, or decision; a plan change; a change
the owner made by hand; a stage, waiting-on, or next-action change a later
reader could not explain from the item alone; the report of the independent
checker run by `work-check`; and a finished result. Insert right after the
header row:

```json
{"type": "update_content", "update_content": {"content_updates": [{
  "old_str": "<tr>\n<td>Date</td>\n<td>Change or decision</td>\n<td>Effect on the work</td>\n</tr>",
  "new_str": "<tr>\n<td>Date</td>\n<td>Change or decision</td>\n<td>Effect on the work</td>\n</tr>\n<tr>\n<td>2026-09-30</td>\n<td>Q-02 answered: Face ID only.</td>\n<td>R-03 updated; next action is Q-03.</td>\n</tr>"}]}}
```

When the template's example row (`\<YYYY-MM-DD\>`) is still there, replace
that row instead of inserting.

## Questions and Answers

Every question asked about the item gets a row, saved as soon as it is
asked, and filled the moment the owner answers. The template's two example
rows (Q-02 open, Q-01 answered) are replaced by real ones.

- **A new question:** insert its row after the last open row (right after
  the header row when none is open), so open rows stay on top, oldest
  first: `old_str` is the last open row as read, `new_str` is that row
  followed by the new one. Next Q-ID = highest Q-ID in the table plus one.
  Status "Open", Decision needed from "owner" (or another person or role).
  Set the Waiting on property to "owner" when the question is for the
  owner, or "external" when it is for someone else, and rewrite the
  Current state to name its Q-ID.
- **An answer to an open row:** replace that row: his own words, in quotes,
  in Answer, the date in Date answered, "yes" in Decision? when it decides
  something (else "no"), and Status "Answered". Then move the row below the
  open ones (remove it and insert it after the last open row), so answered
  rows stay newest first. Update what it affects and name the Q-ID in
  Recent History in the same call. When no open question of his is left,
  set the Waiting on property to "agent" when you continue, or "none".
- **A changed answer:** never rewrite the answered row. Add a new answered
  row after the last open row ("Change to Q-03: …"), set the old row's
  Status to "Superseded by Q-09", and update what it affects. A requirement
  it changes goes back to Refining.
- Match rows exactly as the page returns them: each `<td>` on its own
  line. Inside the toggle, only the `<table …>` and `</table>` lines and the
  line of text above the table start with a tab; the rows do not. Answering
  Q-01 (the row shape as tested):

  ```json
  {"old_str": "<tr>\n<td>Q-01</td>\n<td>Which fields must every transaction have?</td>\n<td></td>\n<td></td>\n<td></td>\n<td>R-01</td>\n<td>Open</td>\n<td>owner</td>\n</tr>",
   "new_str": "<tr>\n<td>Q-01</td>\n<td>Which fields must every transaction have?</td>\n<td>\"Amount, date, category. Notes are optional.\"</td>\n<td>2026-09-29</td>\n<td>yes</td>\n<td>R-01</td>\n<td>Answered</td>\n<td>owner</td>\n</tr>"}
  ```

## Approvals

Approvals stay on the item: a property holds the approval, and the Questions
and Answers row holds his words.

| Approval | Property | Value |
| --- | --- | --- |
| Requirements | Requirements approved | `2026-09-30 by Mike Rihm` |
| Design | Design approved (and Design = approved) | `2026-09-30 by Mike Rihm` |
| Result | Result approved | `2026-09-30 by Mike Rihm` |

## Marking Done, cancelling, archiving

- **Done:** the agent never sets Done on its own. It asks the owner ("Mark
  WI-31 Done?") as a Questions and Answers row. On his yes, save his words
  first in that row (Answer in quotes, Date answered, "yes" in Decision?,
  Status Answered). Then set Result approved when it is not yet recorded,
  and set Status to Done and the Waiting on property to "none" (the Stage
  stays). Rewrite the Current state as work-finish says (Where it stands
  "Done on YYYY-MM-DD: <evidence>.", Next action "None. Finished.", Waiting
  on "Nothing.", Blockers "None.", Last updated today; the Next action
  property "None. Finished."), and add a Recent History row naming the Q-ID.
  The owner may also set Done himself in Notion. That counts: never undo
  it, and on the next change add a history row "Marked Done by the owner by
  hand on YYYY-MM-DD".
- **Cancel:** only on the owner's word. Record his reason, in his words, as
  an answered Questions and Answers row ("yes" in Decision?). Set Status
  "Cancelled" and Waiting on "none", rewrite the Current state the same
  way ("Cancelled on YYYY-MM-DD: <his reason>.", "None. Cancelled."), and
  add a Recent History row naming the Q-ID. For each sub-item that is not
  Done or Cancelled, ask him whether to cancel it, move it to the top
  level, or move it under another item. Never cancel a sub-item without
  asking.
- **Archive:** only when the owner asks. Tick Archived to hide an item
  from the boards. It is not deleted.
- **Reopen:** set Stage to the stage the work goes back to and Status to
  match it (the table in "Stage and status"), and add a Recent History row
  saying why.

## The Solution Design page

One design page per item, a child page of the item:

```bash
ntn api v1/pages -d @design.json < /dev/null
```

with `"parent": {"type": "page_id", "page_id": "<item-page-id>"}`, the
title `"<ID>: <item title> — solution design"` (for example "WI-31: Log a
transaction — solution design"), and `"markdown"` from
`assets/design-page.md` with `\<Work item ID\>` replaced. Then set Design to
"proposed". The design page may have its own subpages; they stay under it.
On the owner's approval set Design "approved", Design approved
`YYYY-MM-DD by <name>`, and the page's "Design status" and "Design
approval" lines. The page's "Design status" line and the Design property
say the same thing in two ways: Draft or In review is Design "proposed",
Approved is "approved", Superseded is "superseded". When the item's title
changes, rename the design page too.

## Moving an item under another parent

1. Level check (as for a new item) for the item and every level under it.
2. Set "Parent item" to the new parent. Set "Phase" to the new parent's
   phase the owner named; when he named none, set it the same way as for a
   new sub-item ("A new work item", step 2), which leaves it empty when the
   new parent has no In Progress or Not Started phase. Never keep a phase of
   the old parent.
3. Recent History rows on the item, the old parent, and the new parent.

The owner may change "Parent item" by hand. His change wins: add the same
history rows on your next change.

## A card made by hand in Notion

A card the owner makes with "New" or "+ New page" gets the work item
template's sections by itself. Its other properties are empty unless the
template holds a value, so its Stage is empty. A page he made with "Empty"
in the New menu, or made before the project had a default template, has an
empty body (fewer than five blocks). Give such a page the default template
(its properties are kept): read the id of the template with `is_default`
true in the Work Items templates list (`ntn-basics.md`, "Database
templates"), then:

```bash
ntn api v1/pages/<page-id> -X PATCH -d '{"template":{"type":"template_id","template_id":"<default-template-id>"}}' < /dev/null
```

Wait for it. Then, for every card made by hand, set any empty properties to
the defaults of "A new work item" and add a history row: "Made in Notion by
hand." (for a page you gave the template: "Made in Notion by hand; the
template was filled in.").

A card with an empty title is hidden from every Work Items view and from
every query except "Cards with no title" (`queries.md`). For each one, name
it or archive it only after the owner says which of the two he wants and,
to name it, what the title is.
