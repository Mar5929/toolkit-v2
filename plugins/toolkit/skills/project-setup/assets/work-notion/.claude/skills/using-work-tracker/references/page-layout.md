# The work item page and the design page

This file says how a work item's page in Notion is laid out, where the work item's Current state is, how to change the text of the page, and how the Solution Design page is made. Open it when you change a work item's text or add a comment.

## Contents

- The sections
- Where the work item's Current state is
- Changing the text
- Filling a new work item
- Rewriting the work item's Current state
- Adding a Recent History row
- Requirements
- Saving a question and its answer
- Notes lines
- Pull request links
- Comments
- The Solution Design page

## The sections

A work item's page has these sections, in this order. Each one is marked as text or as a view. A view shows the rows of another database.

1. **Overview** (text): Goals, then `## Current state`, then Related items, then Moved up.
2. **Roadmap** (view): the work item's phases, from Phases.
3. **Sub-items** (view): the work item's sub-items, one column for each phase.
4. **Tasks** (view): the work item's tasks, grouped by phase.
5. **Recent History** (text): a table with the columns Date, Change or decision, Effect on the work.
6. **Requirements** (text): one `## Requirement <number>: <short name>` block for each requirement. "Requirements" below shows the block.
7. **Questions and Answers** (text, a toggle heading): a table.
8. **Notes** (text): `## Context`, `## Sources`, `## Lessons not proven yet`, and `## Solution options and considerations`.
9. **Linked memory** (view): the memory records that link to the work item. A project has this section only when its memory is in Notion.
10. **Linked Github PRs** (text, and an embed that the owner fills in the Notion app): the work item's pull requests. "Pull request links" below says how to add one.

Three more things are true of every page:

- **Heading levels.** In the current template, a section heading is level 1 (`# Overview`), and a heading inside a section is level 2 (`## Current state`). A project whose template was made before toolkit 0.8.1 can have both one level lower. Match a heading by its words, at the level you read. Write a new heading at the level that the page uses for that kind of heading.
- **The note at the top.** The template's first block is a note for the agent, in a callout. The note says what `running-work-item-lifecycle`, section "Every time", says about text in angle brackets. A page that you create or change never keeps the note. "Filling a new work item" below says how to delete it.
- **Lines that are not text.** The Solution Design is a child page, and the page text shows it as a `<page url="…">` line. The page text shows each view as one `<database url="…">` line. Change the rows in the view's database, never the line.

## Where the work item's Current state is

The work item's Current state is under the Overview's "Current state" heading, after a short guide paragraph. It is one text block of five lines, joined by `<br>`:

```text
**Where it stands:** …<br>**Next action:** …<br>**Waiting on:** …<br>**Blockers:** …<br>**Last updated:** …
```

Related items is the paragraph just below that block, and Moved up is the paragraph below Related items.

## Changing the text

- Read the page text, and then change it with `update_content`. `using-notion-cli`, section "Reading and changing page text", gives both calls.
- Keep every heading, every label, and every view line. A view line is the `<database url="…">` line of a view.
- Only Overview, Recent History, Requirements, Questions and Answers, Notes, and Linked Github PRs are text. Never change the text of Roadmap, Sub-items, Tasks, or Linked memory.
- To delete lines, send them in `old_str` together with one neighbouring line that stays, and send only that neighbouring line as `new_str`. For the two example rows of Questions and Answers, the neighbouring line is the `</table>` line under them.
- After a call that deletes lines, read the page again and compare it with the text that you read before the call. Every line that you did not delete or change must still be there.
  - When a heading or a paragraph is lost, write it again from the earlier text.
  - When a `<database …>`, `<page …>`, or `<unknown …>` line is lost, stop and tell the owner which line is lost. Such a line cannot be put back as text.
- A page that holds the "Embed Github" block answers reads and writes of its text with `truncated: true`, and with the embed's block id in `unknown_block_ids`. "Pull request links" below describes that block. When `unknown_block_ids` holds only that block's id, the answer needs no action.

## Filling a new work item

After the template's content is on the page, send one `update_content` call that leaves no `\<…\>` prompt on the page. A prompt is text in angle brackets that says what to write there. `running-work-item-lifecycle`, section "Every time", gives the rule about prompts.

**Replace** these with what `running-work-item-lifecycle` told you to save:

- the Goals;
- the lines of the work item's Current state;
- Related items;
- the first Recent History row, in place of the example row;
- one block for each requirement, in place of the template's example requirement block. "Requirements" below shows the block.

When the project's template still has the older layout, the page holds `**Overall status:**`. Then replace everything between the Requirements heading and the Questions and Answers heading with the requirement blocks.

**Delete** the rest:

- the callout note at the top, which is three lines;
- the line `\<Every requirement must follow this structure below\>`;
- the two example rows of Questions and Answers;
- the Moved up prompt, but keep its label;
- the prompt lines under Context, Sources, "Lessons not proven yet", and "Solution options and considerations";
- the prompt line under "Linked Github PRs".

**Keep** these:

- every heading, label, guide paragraph, table header row, and view line;
- the embed line under "Linked Github PRs".

Then read the page text, and check that no line holds `\<`. Real content may hold it, for example code such as `Map\<Id, Account\>`.

A card that the owner made by hand holds the same note and the same prompts. The first time you change such a card, do the same, and keep everything that the owner wrote.

## Rewriting the work item's Current state

- Use one `update_content` call whose `old_str` is the whole block as you read it.
- When Next action changed, copy it into the Next action property in the same step, so that the board card shows it.

## Adding a Recent History row

Insert a new row right after the header row, so that the newest row is first:

```json
{"type": "update_content", "update_content": {"content_updates": [{
  "old_str": "<tr>\n<td>Date</td>\n<td>Change or decision</td>\n<td>Effect on the work</td>\n</tr>",
  "new_str": "<tr>\n<td>Date</td>\n<td>Change or decision</td>\n<td>Effect on the work</td>\n</tr>\n<tr>\n<td>2026-09-30</td>\n<td>Q-02 answered: Face ID only.</td>\n<td>R-03 updated; next action is Q-03.</td>\n</tr>"}]}}
```

When the template's example row (`\<YYYY-MM-DD\>`) is still there, replace that row instead.

## Requirements

Each requirement is one block under the Requirements heading, in the order of its number. `running-work-item-lifecycle` says what goes in each part. The two lists are toggles. The page text shows a block like this:

```text
## Requirement 1: Save a transaction
- **Original verbatim requirement: **"I want to type in what I spent and have it saved."
- **Goal**: A person can record one expense in a few seconds.
<details>
<summary>**Functional Requirements**</summary>
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

- **A new requirement.** Insert its block before the Questions and Answers heading line, with the next unused number. `old_str` is that heading line as you read it, which is `# Questions and Answers {toggle="true"}` in the current template. `new_str` is the block followed by that line. Take the form from the block above, never from a prompt that was left on a page.
- **A new line.** Add the line after the last line of its list. `old_str` is that last line, and `new_str` is that last line followed by the new line, which starts with one tab.
  - For a list with no line yet, `old_str` is the toggle's `<summary>` line instead.
  - When `old_str` does not match exactly once, add the lines around it to `old_str`, and keep those lines in `new_str`.
- **A part with nothing to write yet.** Keep the part's label, and write nothing after the label. A list with no line yet is the `<details>`, `<summary>`, and `</details>` lines alone.

## Saving a question and its answer

The table is under the toggle heading "Questions and Answers", which is `# Questions and Answers {toggle="true"}` in the current template. Its columns, in order, are ID, Question, Answer, Date answered, Decision?, Affects, Status, and Decision needed from.

- **A new row.** Its ID is the highest Q-ID in the table plus one. Insert the row after the last open row. When no row is open, insert it right after the header row. Open rows then stay on top, oldest first.
  - `old_str` is the last open row as you read it, and `new_str` is that row followed by the new row.
  - The new row's Status is `Open`.
  - When the template's two example rows (Q-02 open, Q-01 answered) are still there, delete them in the same call.
- **An answer.** Replace the row, with the owner's words in quotation marks under Answer, and the date as `YYYY-MM-DD`. Then move the row to just below the last open row, so that answered rows are newest first. To move it, remove the row and insert it after the last open row.
- **A superseded row.** Change only the row's Status cell, to `Superseded by Q-09`.
- **Waiting on.** Set the Waiting on property to who the open rows wait on. `database-layout.md`, section "Setting State and Status", gives the call.
- **The shape of a row.** Match the rows exactly as the page returns them, with each `<td>` on its own line. Inside the toggle, only the `<table …>` line, the `</table>` line, and the line of text above the table start with a tab. The rows do not.

This example answers Q-01:

```json
{"old_str": "<tr>\n<td>Q-01</td>\n<td>Which fields must every transaction have?</td>\n<td></td>\n<td></td>\n<td></td>\n<td>R-01</td>\n<td>Open</td>\n<td>owner</td>\n</tr>",
 "new_str": "<tr>\n<td>Q-01</td>\n<td>Which fields must every transaction have?</td>\n<td>\"Amount, date, category. Notes are optional.\"</td>\n<td>2026-09-29</td>\n<td>yes</td>\n<td>R-01</td>\n<td>Answered</td>\n<td>owner</td>\n</tr>"}
```

## Notes lines

A line under `## Sources` or under `## Lessons not proven yet` goes after the last line under that heading. `old_str` is that last line, or the heading line when the heading has no line yet. `new_str` is `old_str` followed by the new line. For example:

`- SRC-012: kickoff meeting transcript, 2026-09-30. Taken from it: R-01, Q-02.`

## Pull request links

A pull request that `running-work-item-lifecycle` says to record on the work item goes in the section "Linked Github PRs", not under Related items. Write it as a plain link on its own line, right under the heading.

- `old_str` is the "Linked Github PRs" heading line as you read it. `new_str` is that line followed by `[<repository>#<number>: <title>](<pull request address>)`.
- Write `<repository>` as the GitHub account and the repository name, for example `acme/expenses`.
- Add one line for each pull request.
- When the page has no "Linked Github PRs" section, put the link under Related items.

The section also holds an "Embed Github" block, which only the Notion app can make or fill. The page text shows the block as one `<unknown … alt="external_object_instance"/>` line. Never change or remove that line. The owner may put the same pull request in the embed.

## Comments

Comments are beside the page, apart from its text. Every comment that the agent writes shows the owner's name, because the agent signs in as the owner. Start each comment with "Agent:".

```bash
ntn api v1/comments -d '{"parent":{"page_id":"<page-id>"},"markdown":"Agent: a helper started on **P1-T02**."}' < /dev/null | jq -r .id
```

This call reads a work item's comments, oldest first, including the owner's:

```bash
ntn api v1/comments block_id==<page-id> < /dev/null | jq -r '.results[] | "\(.created_time)\t\(.display_name.resolved_name // "")\t\(.rich_text | map(.plain_text) | join(""))"'
```

## The Solution Design page

Each work item has one design page, which is a child page of the work item's page. This call makes it:

```bash
ntn api v1/pages -d @design.json < /dev/null
```

The body `design.json` holds these three things:

- `"parent": {"type": "page_id", "page_id": "<item-page-id>"}`.
- The title, which is `"<ID>: <item title> — solution design"`, for example "WI-31: Log a transaction — solution design". When the work item's title changes, rename the design page too.
- `"markdown"`, which is the design template text that `running-work-item-lifecycle` opened from its `assets/`, written as Notion markdown, with the work item ID filled in. `using-notion-cli`, section "Reading and changing page text", describes Notion markdown.
  - Leave out the template's front matter and its `<!-- … -->` guide comments.
  - Write each table as a `<table header-row="true">`.

The design page may have its own subpages. They stay under it.

When the owner approves the design, also set Design approved to `YYYY-MM-DD by <name>`.
