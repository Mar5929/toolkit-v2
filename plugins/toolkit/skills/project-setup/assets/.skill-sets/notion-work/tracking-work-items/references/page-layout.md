# The work item page and the design page

How an item's page in Notion is laid out, where Current state sits, how to change its text, and how the Solution Design page is made.

## Contents

- The sections
- Where Current state sits
- Changing the text
- Filling a new item
- Rewriting Current state
- Adding a Recent History row
- Requirements
- Saving a question and its answer
- Pull request links
- Comments
- The Solution Design page

## The sections

In order:

1. **Overview** (text): Goals, then `## Current state`, then Related items.
2. **Roadmap** (view): the item's phases, from Phases.
3. **Sub-items** (view): the item's sub-items, one column per phase.
4. **Tasks** (view): the item's tasks, grouped by phase.
5. **Recent History** (text): a table with the columns Date, Change or decision, Effect on the work.
6. **Requirements** (text): one `## Requirement <number>: <short name>` block for each requirement ("Requirements" below).
7. **Questions and Answers** (text, a toggle heading): a table.
8. **Notes** (text): `## Context`, `## Sources`, and `## Solution options and considerations`.
9. **Linked memory** (view): the memory records that link to the item. Only with memory in Notion.
10. **Linked Github PRs** (text, and an embed the owner fills in the Notion app): the item's pull requests ("Pull request links" below).

- In the current template, a section heading is level 1 (`# Overview`), and a heading inside a section is level 2 (`## Current state`). A project whose template was made before toolkit 0.8.1 can have them one level lower. Match a heading by its words, at the level you read, and write a new heading at the level the page uses for that kind of heading.
- The template's first block is a note for the agent, in a callout. It says what `managing-work-items`, "Every time", says about text in angle brackets. A page you create or change never keeps it ("Filling a new item").
- An item made before toolkit 0.8.1 has the older Requirements layout and no "Linked Github PRs". Read and change it as it is, with the text you read. Give it the current layout only when the owner asks.

The Solution Design is a child page. The page text shows it as a `<page url="…">` line. Each view shows in the page text as one `<database url="…">` line: change the rows in its database, never the line.

## Where Current state sits

Current state is under the Overview's "Current state" heading, after a short guide paragraph. It is one text block of five lines joined by `<br>`:

```text
**Where it stands:** …<br>**Next action:** …<br>**Waiting on:** …<br>**Blockers:** …<br>**Last updated:** …
```

Related items is the paragraph just below it.

## Changing the text

- Read the page text, then change it with `update_content` (`using-notion-cli`, "Reading and changing page text").
- Keep every heading, label, and view line.
- Only Overview, Recent History, Requirements, Questions and Answers, Notes, and Linked Github PRs are text. Never change the text of Roadmap, Sub-items, Tasks, or Linked memory.
- To delete lines, send them in `old_str` together with one neighbouring line that stays, and send only that neighbouring line as `new_str`.

## Filling a new item

After the template's content is there, send one `update_content` call that leaves no `\<…\>` prompt on the page (`managing-work-items`, "Every time").

- **Replace** with what `managing-work-items` told you to save: the Goals, the Current state lines, Related items, the first Recent History row (in place of the example row), and one block for each requirement, in place of the template's pattern block ("Requirements" below). When the project's template still has the older layout (the page holds `**Overall status:**`), replace everything between the Requirements heading and the Questions and Answers heading with the blocks.
- **Delete** the rest: the callout note at the top (its three lines); the line `\<Every requirement must follow this structure below\>`; the two example rows of Questions and Answers; the prompt lines under Context, Sources, and "Solution options and considerations"; and the prompt line under "Linked Github PRs".
- **Keep** every heading, label, guide paragraph, table header row, and view line, and the embed line under "Linked Github PRs".

Then read the page text and check no line holds `\<`, except real content (code such as `Map\<Id, Account\>`).

A card the owner made by hand holds the same note and prompts. The first time you change it, do the same, and keep everything he wrote.

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

## Requirements

Each requirement is one block under the Requirements heading, in the order of its number. `managing-work-items` says what goes in each part. The two lists are toggles. A block, as the page text shows it:

```text
## Requirement 1: Save a transaction
- **Original verbatim requirement: **"I want to type in what I spent and have it saved."
- **Goal**: A person can record one expense in a few seconds.
<details>
<summary>**Functional, Process, Logic, Schema, etc. Requirements**</summary>
	1. The form takes an amount, a date, and a category.
	2. Saving with no amount shows "Enter an amount" and saves nothing.
</details>
<details>
<summary>**Acceptance Criteria:**</summary>
	1. A saved transaction shows in the list with the same amount, date, and category.
	2. Saving with no amount leaves the list unchanged.
</details>
```

The lines inside a toggle start with one tab.

- **A new requirement:** insert its block before the Questions and Answers heading line, with the next unused number: `old_str` is that line as read (`# Questions and Answers {toggle="true"}` in the current template), and `new_str` is the block followed by that line. Take the form from the block above, never from a prompt left on a page.
- **A new line:** add it after the last line of its list. `old_str` is that last line, with the lines around it when it does not match exactly once.
- **A part with nothing to write yet:** keep its label and write nothing after it. A list with no line yet is the `<details>`, `<summary>`, and `</details>` lines alone.

## Saving a question and its answer

The table sits under the toggle heading "Questions and Answers" (`# Questions and Answers {toggle="true"}` in the current template). Its columns, in order: ID, Question, Answer, Date answered, Decision?, Affects, Status, Decision needed from.

- **A new row:** its ID is the highest Q-ID in the table plus one. Insert it after the last open row, or right after the header row when none is open, so open rows stay on top, oldest first. `old_str` is the last open row as read, and `new_str` is that row followed by the new one. Status is `Open`. When the template's two example rows (Q-02 open, Q-01 answered) are still there, delete them in the same call.
- **An answer:** replace the row. Put his words in quotes under Answer, the date as `YYYY-MM-DD`, Decision? `yes` or `no`, and Status `Answered`. Then move the row below the last open row (remove it, and insert it after the last open row), so answered rows are newest first.
- **A superseded row:** change only its Status, to `Superseded by Q-09`. Never edit its other cells.
- **Waiting on:** set the property for who the open rows wait on (`database-layout.md`, "Setting State and Status").
- **Row shape:** match the rows exactly as the page returns them, each `<td>` on its own line. Inside the toggle, only the `<table …>` and `</table>` lines and the line of text above the table start with a tab. The rows do not.

Answering Q-01:

```json
{"old_str": "<tr>\n<td>Q-01</td>\n<td>Which fields must every transaction have?</td>\n<td></td>\n<td></td>\n<td></td>\n<td>R-01</td>\n<td>Open</td>\n<td>owner</td>\n</tr>",
 "new_str": "<tr>\n<td>Q-01</td>\n<td>Which fields must every transaction have?</td>\n<td>\"Amount, date, category. Notes are optional.\"</td>\n<td>2026-09-29</td>\n<td>yes</td>\n<td>R-01</td>\n<td>Answered</td>\n<td>owner</td>\n</tr>"}
```

## Pull request links

The section "Linked Github PRs" holds an "Embed Github" block that only the Notion app can make or fill. The page text shows it as one `<unknown … alt="external_object_instance"/>` line: never change or remove that line. A pull request that `managing-work-items` says to record on the item goes here, not under Related items, as a plain link on its own line right under the heading: `old_str` is the "Linked Github PRs" heading line as read, and `new_str` is that line followed by `[<repository>#<number>: <title>](<pull request address>)`. Add one line for each pull request. The owner may put the same pull request in the embed himself.

## Comments

Comments sit beside the page, apart from its text. Every comment the agent writes shows the owner's name, because the agent signs in as him. Start each one with "Agent:".

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
