# Finding work in local files

This file gives the exact commands that read work items from `work-items/`. The commands only read. Open it when you find or read work items.

Three rules apply to every command in this file:

- Start each command with the `MAIN=` line from `references/work-tracker.md`, section "Steps for every read and every save", step 1.
- Replace `WI` with the prefix from `PROJECT.md`, section "Toolkit settings", and replace `WI-031` with the ID, in three digits.
- Keep the flags as they are written. The flags make a command skip the template and `DESIGN.md` files, except in the search by words.

## One work item

```bash
grep -rlE --include='*.md' --exclude-dir=work-item-template --exclude=DESIGN.md '^id: *"?WI-031"? *$' "$MAIN/work-items"
```

- When the command prints one path, read the whole file, starting with the five lines under `### Current state`. The file's folder also holds `DESIGN.md` and the folders of the work item's sub-items.
- When the command prints no path, run the check for changes made by hand, and then search by title. `work-tracker-folders-and-files.md`, section "The check for changes made by hand", gives the check. Never make a second work item for work that already has one.
- When the command prints two paths, two work items share the ID. `work-tracker-folders-and-files.md`, section "Two work items with one ID", says what to do.

## The board

The board is the list of the open work items. This command prints it, with `archive/` left out:

```bash
grep -rHE --include='*.md' --exclude-dir=work-item-template --exclude-dir=archive --exclude=DESIGN.md '^(id|title|type|state|status|parent|waiting_on|priority):|^\*\*Next action:\*\*' "$MAIN/work-items"
```

- The lines from one file are one work item. A file with no `id:` line is not a work item.
- Leave out the work items that are Done or Cancelled unless the owner asks for them.

## Open questions

Open rows are at the top of each Questions and Answers table. This command prints them:

```bash
grep -rHE --include='*.md' --exclude-dir=work-item-template --exclude-dir=archive --exclude=DESIGN.md '^\| *Q-[0-9]+ *\|.*\| *Open *\|' "$MAIN/work-items"
```

- Only a row with Status `Open` counts.
- Leave out a row that is still the template's example. Its question is `<Specific unanswered question>`. A work item that the owner made by hand can hold such a row.
- Report in this order: first what waits on the owner (the work item's ID, the Q-ID, and what the question blocks), then what is in progress, then your next step.

## A parent's full tree

The parent's folder is the folder of its file.

```bash
grep -rHE --include='*.md' --exclude=DESIGN.md '^(id|title|state|status|parent|waiting_on):' "<parent folder>"
grep -nE '^\| *P[0-9]+ —|^\*\*Sub-items:\*\*|^- \[ \] \*\*(P[0-9]+-)?T[0-9]+' "<item file>"
```

- The second command shows a work item's list of sub-items and its open tasks. For a top-level item, it shows the phases with their Sub-items cells. For a sub-item, it shows the `**Sub-items:**` line.
- Under a top-level item, a sub-item that no Sub-items cell names goes last, under "No phase".

## Search by words or by a field

```bash
grep -rliE --include='*.md' --exclude-dir=work-item-template 'login' "$MAIN/work-items"
grep -rlE --include='*.md' --exclude-dir=work-item-template --exclude=DESIGN.md '^type: *bug' "$MAIN/work-items"
grep -rliE --include='*.md' --exclude-dir=work-item-template --exclude=DESIGN.md '^title:.*login' "$MAIN/work-items"
```

- The first command is the search by words. It also reads designs. A match in a design belongs to the work item whose file is in the same folder.
- The second command searches one field. Use `^state: *Building`, `^status: *Blocked`, or `^waiting_on: *"?owner` the same way.
- When a search has two or more matches, name each match, give your recommendation, and ask the owner which one is meant.

## The commands of the check for changes made by hand

These three commands only read. The first prints every work item's file, ID, and `parent:` line. The second prints each ID that two files share. The third prints the template copies that the owner made by hand. `work-tracker-folders-and-files.md`, section "The check for changes made by hand", explains how to read what they print.

```bash
grep -rHE --include='*.md' --exclude-dir=work-item-template --exclude=DESIGN.md '^(id|parent):' "$MAIN/work-items"
grep -rhE --include='*.md' --exclude-dir=work-item-template --exclude=DESIGN.md '^id:' "$MAIN/work-items" | sed -E 's/^id: *"?([^" ]*)"? *$/\1/' | sort | uniq -d
grep -rlE --include='*.md' --exclude-dir=work-item-template --exclude=DESIGN.md '^title: *"?<Work item title>' "$MAIN/work-items"; find "$MAIN/work-items" -name 'WORK-ITEM.md' -not -path '*/work-item-template/*'
```
