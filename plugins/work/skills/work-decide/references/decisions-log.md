# The project decision log (`DECISIONS.md`)

What goes in `DECISIONS.md`, how a row is added and replaced, and the order
of work with `publish-docs` that commits it.

## What goes in it

- A decision for the whole project: it applies to more than one work item,
  or to how the project is run. Examples: "use Postgres everywhere", a
  standing merge instruction, the Jira status map.
- Not a decision about one item. That stays in the item: its Recent History,
  the answered Open Questions row, and Notes > Decisions and context when the
  next session needs the context.
- Not a preference or lesson about how the owner likes to work. That is a
  memory, through `memory-save`.

## The file

`DECISIONS.md` sits at the project root and is committed to Git. Its table
has these columns:

| Column | Holds |
| --- | --- |
| ID | `D-1`, `D-2`, ... The command gives the next one. |
| Date | The day it was added |
| Decision | What was decided, in one sentence |
| Why | The owner's reason, in his words when he gave one |
| Decided by | Who decided |
| Replaces | The id of the decision this one replaces, or empty |

- The file is append-only. Never rewrite or remove a row, and never edit it
  by hand: add rows only with `toolkit decision add`.
- A changed decision is a new row that names the one it replaces with
  `--replaces D-<n>`.
- Read the current rows in `DECISIONS.md` itself.

## Order of work

`DECISIONS.md` is a committed document, so it is saved through `publish-docs`,
never committed on an item's branch and never left uncommitted.

- [ ] The owner stated the decision in his own words, or said yes to the one
      you proposed. Quote him.
- [ ] Read `DECISIONS.md` and check the decision does not repeat or
      contradict a row already there.
- [ ] Open `publish-docs` and start its save workspace (its own worktree).
- [ ] Inside that workspace, add the row:
      `toolkit decision add --decision '<decision>' --why '<why>' --by <owner>`
      or, when it replaces an older one:
      `toolkit decision add --decision '<decision>' --why '<why>' --by <owner> --replaces D-<n>`
- [ ] Let `publish-docs` stage `DECISIONS.md` by name, commit it, push it (only
      when the project has a remote), and check the result.
- [ ] Tell the owner in one line: "Saved as D-4 in DECISIONS.md."
- [ ] When the decision changes an item's next step, record that on the item
      too (a history note) and update the current focus.

A failed save: lead with "Not saved", and keep the wording so it can be
saved later.

## Worded examples

A project-wide choice:

```text
toolkit decision add --decision 'Use Postgres for every new data store.' --why 'Owner: "one database to back up and learn."' --by Mike
```

A standing merge instruction:

```text
toolkit decision add --decision 'Agents may merge a pull request after an independent acceptance check finds no blocking issue on that exact head and every check passes.' --why 'Owner: "no need for me to click merge on reviewed work."' --by Mike
```

A Jira status map, replacing an earlier one:

```text
toolkit decision add --decision 'Jira status map: Backlog = To Do; Ready = Selected; In Progress = In Progress; In Review = In Review; Done = Done; Cancelled = Declined.' --why 'Set up with the owner for this Jira project.' --by Mike --replaces D-2
```
