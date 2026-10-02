# The work item page and the design page

How an item's page in Notion is laid out, where Current state sits, how to change its text, and how the Solution Design page is made.

## Contents

- The sections
- Where Current state sits
- Changing the text
- Filling a new item
- Rewriting Current state
- Adding a Recent History row
- Saving a question and its answer
- Comments
- The Solution Design page

## The sections

In order:

1. **Overview** (text): Goal, then `### Current state`, then Related items.
2. **Roadmap** (view): the item's phases, from Phases.
3. **Sub-items** (view): the item's sub-items, one column per phase.
4. **Tasks** (view): the item's tasks, grouped by phase.
5. **Recent History** (text): a table with the columns Date, Change or decision, Effect on the work.
6. **Requirements** (text): Overall status and Finalization rule, then `### Starting request`, `### Agreed goal`, `### Active requirements` (one `#### R-01 — <title>` block for each requirement, with its labeled fields), and `### Acceptance`.
7. **Questions and Answers** (text, a toggle heading): a table.
8. **Notes** (text): `### Context`, `### Sources`, and `### Solution options and considerations`.
9. **Linked memory** (view): the memory records that link to the item. Only with memory in Notion.

The Solution Design is a child page. The page text shows it as a `<page url="…">` line. Each view shows in the page text as one `<database url="…">` line: change the rows in its database, never the line.

## Where Current state sits

Current state is under the Overview's `### Current state` heading, after a short guide paragraph. It is one text block of five lines joined by `<br>`:

```text
**Where it stands:** …<br>**Next action:** …<br>**Waiting on:** …<br>**Blockers:** …<br>**Last updated:** …
```

Related items is the paragraph just below it.

## Changing the text

- Read the page text, then change it with `update_content` (`using-notion-cli`, "Reading and changing page text").
- Keep every heading, label, and view line.
- Only Overview, Recent History, Requirements, Questions and Answers, and Notes are text. Never change the text of Roadmap, Sub-items, Tasks, or Linked memory.

## Filling a new item

After the template's content is there, send one `update_content` call. Replace every `\<…\>` prompt you have a value for, using what `managing-work-items` told you to save: the Goal, the Current state lines, Related items, the Starting request, and the first Recent History row. Leave the other prompts for later steps. Replace the template's example row of Recent History instead of inserting beside it.

## Rewriting Current state

- Use one `update_content` call whose `old_str` is the whole block as read.
- Copy a changed Next action into the Next action property in the same step, so the board card shows it.

## Adding a Recent History row

Insert the new row right after the header row, so the newest row is first:

```json
{"type": "update_content", "update_content": {"content_updates": [{
  "old_str": "<tr>\n<td>Date</td>\n<td>Change or decision</td>\n<td>Effect on the work</td>\n</tr>",
  "new_str": "<tr>\n<td>Date</td>\n<td>Change or decision</td>\n<td>Effect on the work</td>\n</tr>\n<tr>\n<td>2026-09-30</td>\n<td>Q-02 answered: Face ID only.</td>\n<td>R-03 updated; next action is Q-03.</td>\n</tr>"}]}}
```

When the template's example row (`\<YYYY-MM-DD\>`) is still there, replace that row instead.

## Saving a question and its answer

The table sits under the toggle heading `## Questions and Answers {toggle="true"}`. Its columns, in order: ID, Question, Answer, Date answered, Decision?, Affects, Status, Decision needed from.

- **A new row:** its ID is the highest Q-ID in the table plus one. Insert it after the last open row, or right after the header row when none is open, so open rows stay on top, oldest first. `old_str` is the last open row as read, and `new_str` is that row followed by the new one. Status is `Open`. The template's two example rows (Q-02 open, Q-01 answered) are replaced by real rows.
- **An answer:** replace the row. Put his words in quotes under Answer, the date as `YYYY-MM-DD`, Decision? `yes` or `no`, and Status `Answered`. Then move the row below the last open row (remove it, and insert it after the last open row), so answered rows are newest first.
- **A superseded row:** change only its Status, to `Superseded by Q-09`. Never edit its other cells.
- **Waiting on:** set the property for who the open rows wait on (`database-layout.md`, "Setting State and Status").
- **Row shape:** match the rows exactly as the page returns them, each `<td>` on its own line. Inside the toggle, only the `<table …>` and `</table>` lines and the line of text above the table start with a tab. The rows do not.

Answering Q-01:

```json
{"old_str": "<tr>\n<td>Q-01</td>\n<td>Which fields must every transaction have?</td>\n<td></td>\n<td></td>\n<td></td>\n<td>R-01</td>\n<td>Open</td>\n<td>owner</td>\n</tr>",
 "new_str": "<tr>\n<td>Q-01</td>\n<td>Which fields must every transaction have?</td>\n<td>\"Amount, date, category. Notes are optional.\"</td>\n<td>2026-09-29</td>\n<td>yes</td>\n<td>R-01</td>\n<td>Answered</td>\n<td>owner</td>\n</tr>"}
```

## Comments

Comments sit beside the page, apart from its text. Comments made through `ntn` show the owner's name, because `ntn` signs in as him. Start the agent's notes with "Agent:" so they can be told apart.

```bash
ntn api v1/comments -d '{"parent":{"page_id":"<page-id>"},"markdown":"Agent: helper finished **P1-T02**; 12 tests pass."}' < /dev/null | jq -r .id
```

Read an item's comments, oldest first, the owner's too:

```bash
ntn api v1/comments block_id==<page-id> < /dev/null | jq -r '.results[] | "\(.created_time)\t\(.display_name.resolved_name // "")\t\(.rich_text | map(.plain_text) | join(""))"'
```

## The Solution Design page

One design page per item, a child page of the item:

```bash
ntn api v1/pages -d @design.json < /dev/null
```

- `"parent": {"type": "page_id", "page_id": "<item-page-id>"}`.
- The title is `"<ID>: <item title> — solution design"`, for example "WI-31: Log a transaction — solution design". When the item's title changes, rename the design page too.
- `"markdown"` is the design template text `managing-work-items` opened from its `assets/`, written as Notion markdown (`using-notion-cli`, "Reading and changing page text"), with the work item ID filled in. Leave out its front matter and its `<!-- … -->` guide comments: the Design property holds that information. Write each table as a `<table header-row="true">`.
- Then set the item's Design to `proposed`.
- The design page may have its own subpages. They stay under it.

When the owner approves the design, set Design `approved`, set Design approved to `YYYY-MM-DD by <name>`, and update the page's "Design status" and "Design approval" lines.
