# Live test of filling a new Notion work item (TKV-11, 2026-10-03)

The Requirements layout that came with toolkit 0.8.1 was tested once, on
2026-10-03, against the skills on main at 0.8.1 (064d8eb). An agent
followed the skills as written.

The test ran in a throwaway Notion project, "TKV-11 check (safe to
delete)" (page `3eeb381d-a176-8117-ad5f-db18be6e43dd`), made from the
"Project" template with the owner's yes. It did not run in the old test
area, which no longer exists. No real project and no template was changed.

## The seven steps

| # | Step | Result |
| --- | --- | --- |
| 1 | Create the item "Sign-up form" from the default template, State Backlog, Status Not Started (page `3eeb381d-a176-81d8-8b19-efc4c4847b06`). | Worked. The template's 38 blocks were there on the first check. |
| 2 | Fill the page with one `update_content` call of 9 replacements, then set the Next action property. | Worked. |
| 3 | Read the page back. | No `\<` was left, the note for the agent was gone, the four `<database …>` lines were present, and the `<unknown … external_object_instance>` line was unchanged. |
| 4 | Write Requirement 1 in full and add Requirement 2, in one call of 4 replacements. | Worked. The read back showed tab-indented numbered lines inside the toggles. |
| 5 | Add question row Q-01 and set Waiting on to owner; then answer it and set Waiting on to none. | Worked. |
| 6 | Add a pull request link under "Linked Github PRs". | Worked. The embed line survived. |
| 7 | Read the final page. | Worked. |

On that page, every read and write of the text answered with
`truncated: true` and the embed's block id in `unknown_block_ids`.

The owner looked at the item and approved the layout. The project was
then moved to the trash in Notion.

## The seven gaps

Every step worked, but the agent had to guess in seven places. Each one
is closed in toolkit 0.8.4.

| # | Where the agent had to guess | Closed in |
| --- | --- | --- |
| 1 | Adding the first line to a requirement list that is empty. | Notion `page-layout.md`, "Requirements" |
| 2 | The Next action of a new Backlog item. | `managing-work-items`, "Status and State", Backlog |
| 3 | Related items for a top-level item with no project phase yet. | `managing-work-items`, "Levels" |
| 4 | A requirement's Goal with nothing to write yet: whether the label line alone stays. | `managing-work-items`, "Every time" (when it is filled); the three tracking skills already said the label stays |
| 5 | Which Type to send when creating an item. | `managing-work-items`, "Every time" (every new item gets a type); Notion `database-layout.md`, "Creating an item" |
| 6 | The form of the repository in a pull request link. | Notion `page-layout.md`, "Pull request links" |
| 7 | Two Notion facts: a second line in a Questions and Answers cell is sent as `<br>`; the `truncated: true` answer on a page that holds the "Embed Github" block. | `using-notion-cli`, `ntn-commands.md`, "Reading and changing page text"; Notion `page-layout.md`, "Changing the text" |

The fixes were written after the test and have not been run against
Notion.

## The label change

The owner approved one label change in chat on 2026-10-03. In the
Requirements block, "Functional, Process, Logic, Schema, etc.
Requirements" is now "Functional Requirements", and its first hint is now
"One line each: system behavior, process steps, business rules, and data
model". The orchestrating session changed his Notion template and read it
back. Toolkit 0.8.4 makes every shipped file agree. An item that holds
the older label keeps it.

## Not tested

- Adding Recent History rows.
- Rewriting Current state after the fill.
- Phases and tasks.
