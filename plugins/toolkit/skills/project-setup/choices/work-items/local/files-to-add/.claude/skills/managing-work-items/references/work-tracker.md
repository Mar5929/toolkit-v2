# Work items kept as local files

Use this reference to read, create, save, find, nest, and move work items in a project that keeps its work items as local files in the `work-items/` folder. The goal is to read and write each work item consistently with the lifecycle rules.

This reference only gives the steps for reading and saving. The lifecycle rules decide what happens next: what to save or when, a work item's State, and each approval.

## Where the work items are kept

- The `work-items/` folder holds one folder for each work item. It exists only in the main checkout.
- `work-items/AGENTS.md`, in the main checkout, says what each file and folder is, the form of a work item's ID, and what must stay true in the folder. Read it before your first change.
- Work items can be nested. A top-level item is a work item with no parent, at level 1. A sub-item is a work item inside another work item, at level 2 or level 3. `references/lifecycle-rules.md`, section "Levels", says what each level holds.
- A top-level item may use phases to group its tasks and its level-2 sub-items. When it does, its phases and tasks are under Roadmap and Tasks. An item without phases has one plain task list and a Sub-items line. Sub-items have no phases. `references/work-tracker-field-mapping.md` says where each part of a work item goes in its file.
- The project has phases of its own too, called project phases, which group the top-level items. It also has project tasks, which are tasks that belong to no work item. The project's phases are in `PROJECT-ROADMAP.md`, and its project tasks are in `work-items/PROJECT-TASKS.md`. `references/work-tracker-project-roadmap-and-tasks.md` says how to read and change both files.

## Steps for every read and every save

1. Find the main checkout. `work-items/` is only there, even when this session runs in a worktree. This line puts the path of the main checkout in `MAIN`:

   ```bash
   MAIN="$(git worktree list --porcelain | sed -n '1s/^worktree //p')"
   ```

   - Each shell command starts without the values that the command before it set. Begin every command that uses `$MAIN` with that line and a `;`, in the same command.
   - When the project is not a Git repository, the line prints nothing, and `MAIN` is empty. Then set `MAIN` to the project folder, which is the folder that holds `AGENTS.md`.
   - Never run a command while `MAIN` is empty.
   - When the main checkout has no `work-items/` folder, stop and tell the owner that the setup is incomplete.
2. Find the work item's file by its `id:` line. `references/work-tracker-searching.md` gives the command. Read the whole file in this turn, and read it again right before you change it, because the owner edits and moves work items by hand.
3. Check for changes that the owner made by hand. `references/work-tracker-folders-and-files.md`, section "The check for changes made by hand", says how to run the check and how to record each finding. Run the check at each of these times:
   - at the first lookup of a session;
   - before you move a work item, and before you make a new sub-item;
   - when a work item is not where you read it before;
   - when an ID has two files, or none;
   - when a work item's folder, its `parent:` line, and its parent's list of sub-items disagree.

   Tell the owner each finding in one line, record the finding, and continue.
4. Make the change with the file that the References table below names for it.
   - Change only the lines that change. Keep every other line, heading, and bold label as the work item template has it. Never rewrite the whole file.
   - Set `updated:` to today.
   - In a work item's text, name another work item as `[[WI-031]]`, never by its folder path. The `parent:` line is different: it stays a plain ID.
5. Read the file back, and check that it says what you wrote. When a save failed, or reads back differently, report it as `references/lifecycle-rules.md`, section "Rules that apply in every State", says. That section gives the words your reply must start with.

## Mistakes to avoid

- When the active session blocks a write to the main checkout, use its supported approval mechanism only when approval is required and permitted. When no permitted route is available, tell the owner which save is blocked and what action is needed. Keep the work item in the main checkout.
- Every lookup command except the search by words skips `DESIGN.md` files and `work-item-template/`. Never remove the flags that make a command skip them. The commands are in `references/work-tracker-searching.md`.
- Leave out `archive/` unless the owner asks for archived work items.
- An edit must match the old text exactly, including the spacing of a table. When an edit fails, read the file again, because the owner may have changed the file.
- Three rules apply inside a table:
  - A `|` inside a table cell ends the cell. Write `\|` in its place.
  - A table cell holds one line. Join several lines with `<br>`.
  - Write `[[WI-031]]`, never `[[WI-031|a name]]`.
- A value can lose its quotation marks when the owner edits it in Obsidian's Properties panel, for example `waiting_on: owner`. The commands in the reference files match a value with quotation marks and a value without them.
- When the owner says "WI-31", the work item is `WI-031`.
- A work item that the owner made by hand can still hold the template's example rows and example tasks. Never count an example row or an example task as real.
- Use the `grep -r` commands as the reference files write them. In zsh, a `*` pattern that matches nothing stops the whole command.

## Writing a record's ID in a work item

A local work item is kept in the main checkout, so a record that it names must be there.

- Write the ID of a record that `filing-project-records` saved only after `publish-docs` reports that the main checkout holds the save.
- When `publish-docs` reports that the main checkout does not hold the save, write no ID in the work item yet. `filing-project-records`, section "When to write the ID", says what to do in its place.

## The templates for a work item and its design

A new work item and its design are copied from `work-items/work-item-template/`, as `references/work-tracker-folders-and-files.md` says. A work item's design is the `DESIGN.md` in its folder.

## How a helper opens a work item by ID

Find the file under `work-items/` in the main checkout whose front matter says `id: WI-014` (for example `grep -rlE '^id: *"?WI-014"? *$' <main checkout>/work-items`; the value may be in quotes). The front matter is the block of fields at the top of the file. The design of the work item is `DESIGN.md` in the same folder.

## Related work

| For | Use |
| --- | --- |
| Deciding what happens next: what to save and when, a State, or an approval | Follow `references/lifecycle-rules.md` in this skill. |
| A State and a Status that no longer match | Follow `references/lifecycle-rules.md` in this skill. |
| Moving the work items to another place where work items can be kept, such as Notion or GitHub Issues | `project-setup` |
| An incomplete setup, or a missing template | `project-setup` ("check the setup") |

## References

| File | Open it when |
| --- | --- |
| [references/work-tracker-field-mapping.md](work-tracker-field-mapping.md) | You create or change anything inside a work item: a front matter field (a field in the block at the top of the file), a section, a top-level item's phase, a task, a Questions and Answers row, a Recent History row, a link to a sub-item, or the design file, `DESIGN.md`. |
| [references/work-tracker-folders-and-files.md](work-tracker-folders-and-files.md) | You make a work item's folder and ID; you run the check for changes made by hand; you move, nest, group, archive, or rename work items; the owner made a work item by hand; two work items have one ID; or you need to know how Obsidian links work. |
| [references/work-tracker-searching.md](work-tracker-searching.md) | You find or read work items: one work item, the board (the list of the open work items), the open questions, a parent's full tree, a search by words or by a field, and the three commands of the check for changes made by hand. |
| [references/work-tracker-project-roadmap-and-tasks.md](work-tracker-project-roadmap-and-tasks.md) | You read or change the project's phases, put a top-level item in a project phase, or read or change a project task. |
