# The Notion tracker

How work items are stored when `tracker.type` is `notion`, what the CLI does
with changes the owner makes in Notion, and what the agent must never do
there.

## Contents

1. Where the items live
2. Properties and the page body
3. The board link
4. What the owner may do in Notion, and what the CLI does
5. Moving, nesting, and archiving
6. Errors and what to do
7. Rules

## 1. Where the items live

- Each project has its own Work Items database on its row of the Projects
  database, under the "AI Agent Second Brain" page (the root page). There is
  no shared all-projects database.
- `toolkit config get tracker.type` prints `notion` for this tracker.
- Every read and write goes through `toolkit work ...`. The commands behave
  the same as for the local tracker; the CLI calls Notion through the `ntn`
  program.
- The design of an item is its "Solution Design" child page
  ("<id>: <title> — solution design"). `toolkit work design` reads and writes
  it.
- Notion shows ids without zero padding (`WI-7`); the toolkit shows them
  padded (`WI-007`). Both name the same item.

## 2. Properties and the page body

The header fields are database properties: Work item (the title), ID, Stage,
Status, Type, Priority, Waiting on, Delivery, Requirements approved, Design,
Design approved, Result approved, Updated, Archived, Parent item, and
Sub-items. Next action and Open owner questions are filled from the body on
every write, so a board view needs no body reads.

The page body is the `WORK-ITEM.md` body. Write it in ordinary Markdown
through `toolkit work edit`; the CLI converts it both ways. Things that
change on the way:

- a table is stored as a Notion table and comes back as a Markdown table;
- a template comment (`<!-- ... -->`) is shown in Notion as an italic
  "Note: ..." paragraph;
- a heading deeper than `####` comes back as `####`;
- a `.md` file name is sent as code text, so Notion does not turn it into a
  link.

"Saved but not verified" after a write names the first line that differs.
Read the section back and judge whether only spacing changed.

## 3. The board link

"Show the board" means: give the owner the link to the project's Work Items
database. Its first view is "Board", grouped by Stage. Read the link with:

```text
toolkit config get notion.workItems.url
```

There is also an "All items" table view with sub-items nested under their
parent.

## 4. What the owner may do in Notion, and what the CLI does

Every `toolkit work` command and the session hooks run a sync first. The
owner's value wins; the CLI never undoes it.

| The owner did | What the CLI does | What the agent does |
| --- | --- | --- |
| Made a card with Notion's New button | Fills the empty body with the work item template and default values (stage 01, Backlog) on the next sync, and reports "Created in Notion by hand as <id>" | Tell him in one line; continue with `work-on` when he wants it worked |
| Dragged a card to another Stage | Keeps the Stage, sets Status to match, writes a "Changed by hand" history row | Tell him in one line. When the move skipped a gate, ask about it (the CLI prints the question) |
| Set a card's Status to Done | Keeps it; with no recorded result approval it reports the skipped gate and prints the question | Say a card marked Done is not an approval. Ask whether he approves the result; on a yes open `work-finish` |
| Changed Parent item | Treats it as a move, writes "Parent changed in Notion by hand" on the item and a row on each parent | Tell him in one line |
| Ticked the Archived box | Hides the item from the board and the briefing, and reports it as archived | Tell him in one line; it is not a cancel |
| Moved a card to the Notion trash | Reports the item as missing: "It was moved to the Notion trash." | Open `work-organize`: ask whether it was removed on purpose |
| Moved a card out of the database, or deleted it | Reports it as missing, with that reason | Open `work-organize` |
| Edited body text | Keeps his text; a later `toolkit work edit` changes only the section it names | Read the section again before you change it |

The briefing reads a local copy of the board and only reports. The next
`toolkit work` command writes the history rows.

## 5. Moving, nesting, and archiving

- Nesting is the Parent item and Sub-items relation. Moving a card between
  columns of the board changes its Stage, not its parent.
- Notion items have no group folders. `--under` takes an item id, `root`, or
  `archive`:
  `toolkit work move <id> --under <parent-id>`
  `toolkit work move <id> --under root`
  `toolkit work move <id> --under archive`
- `--under archive` ticks the Archived box. A move to `root` or to a parent
  clears it.
- A trashed card is restored only by the owner, in Notion (Trash, in the
  sidebar). The toolkit never restores or deletes a Notion page.

## 6. Errors and what to do

| The command says | Meaning | What to do |
| --- | --- | --- |
| "<id> changed in Notion while this command was running ... Nothing was saved." | The owner edited the same item during the write | Read it again (`toolkit work show <id>`), then redo the change |
| "The page was changed in Notion while this update was prepared: ... Read it again and redo the change." (exit code 2) | The owner changed or moved a section of the same page between the read and the write | Read the section again (`toolkit work show <id> --section '<heading>'`), merge his change with yours, and run the edit again |
| "Run "ntn login" in a terminal ..." | The Notion sign-in is missing or expired | Lead with "Not saved". Signing in is the owner's step: ask him to run `ntn login` in a terminal. Keep the unsaved text |
| A Codex session reports the keychain or the network blocked | The `toolkit` command ran inside the Codex sandbox | Run the `toolkit` command alone, as its own command, so the project's command rule runs it outside the sandbox |
| "... is in the Notion trash" or "... archived in Notion" for the project row or database | The owner trashed or archived it | Ask him to restore it in the Notion app, then run the command again |
| Exit code 1 with "Not saved" | Notion could not be reached or refused the write | Lead with "Not saved", name what was not saved, and keep the text |

## 7. Rules

- Never write a work item page, a design page, or a property with another
  Notion tool (the Notion MCP server or `ntn` directly). Only `toolkit work`
  keeps the page, the properties, and the CLI's record of what it wrote in
  step.
- The CLI refuses every write outside the root page. Never work around it.
- Never keep a local `.work-items/` copy of Notion items.
- Setting up or repairing the databases is `project-setup`'s job
  (`toolkit notion ensure-project`), never part of normal work.
