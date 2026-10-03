# Live test of filling a new Notion work item (TKV-11, 2026-10-03)

The Requirements layout that came with toolkit 0.8.1 was tested once on a
throwaway Notion project, "TKV-11 check (safe to delete)". An agent
followed the skills as written. No real project and no template was
changed.

## What the test did

- Created the work item "Sign-up form" from the Work Items database's
  default template.
- Filled the new page's text.
- Wrote two requirements.
- Added a question, then answered it.
- Recorded a pull request link.

## Result

All seven steps of the test worked. After the fill:

- no template text in angle brackets was left on the page;
- the note for the agent at the top was gone;
- the four database lines and the embed line were unchanged.

## The seven gaps

Everything worked, but the agent had to guess in seven places. Each one
is closed in toolkit 0.8.4.

| # | Where the agent had to guess | Closed in |
| --- | --- | --- |
| 1 | Adding the first line to a requirement list that is empty. | Notion `page-layout.md`, "Requirements" |
| 2 | The Next action of a new Backlog item. | `managing-work-items`, "Status and State", Backlog |
| 3 | Related items for a top-level item with no project phase yet. | `managing-work-items`, "Levels" |
| 4 | A requirement's Goal with nothing to write yet: whether the label line alone stays. | `managing-work-items`, "Every time" |
| 5 | Which Type to send when creating an item. | Notion `database-layout.md`, "Creating an item" |
| 6 | The form of the repository in a pull request link. | Notion `page-layout.md`, "Pull request links" |
| 7 | Two Notion facts: a second line in a Questions and Answers cell is sent as `<br>`; a page that holds the "Embed Github" block answers every read and write with `truncated: true` and the embed's block id in `unknown_block_ids`. | Notion `page-layout.md`, "Saving a question and its answer" and "Changing the text" |

The fixes were written after the test and have not been run against
Notion.

## The label change

On the same day Mike renamed one list of the Requirements block in his
Notion template. "Functional, Process, Logic, Schema, etc. Requirements"
is now "Functional Requirements", and its first hint is now "One line
each: system behavior, process steps, business rules, and data model".
Toolkit 0.8.4 makes every shipped file agree. An item that holds the
older label keeps it.

## Not tested

- Adding Recent History rows.
- Rewriting Current state after the fill.
- Phases and tasks.

## Cleanup

The throwaway project "TKV-11 check (safe to delete)" was moved to the
trash in Notion.
