# Finding work in local files

The exact commands that read items from `work-items/`. They only read.

- Start each command with the `MAIN=` line from `SKILL.md`, "Every time", step 1.
- Replace `WI` with the prefix from `PROJECT.md`, "Toolkit settings", and `WI-031` with the ID, in three digits.
- Keep the flags as written. They skip the template, `references/` folders, and `DESIGN.md` files, except in the word search.

## One item

```bash
grep -rlE --include='*.md' --exclude-dir=work-item-template --exclude-dir=references --exclude=DESIGN.md '^id: *"?WI-031"? *$' "$MAIN/work-items"
```

- One path: read the whole file, starting with the five lines under `### Current state`. Its folder also holds `DESIGN.md`, `references/`, and its sub-items' folders.
- No path: run the hand-change check (`folders-and-files.md`), then search by title. Never make a second item for work that already has one.
- Two paths: two items share the ID (`folders-and-files.md`).

## The board

Open items, `archive/` left out:

```bash
grep -rHE --include='*.md' --exclude-dir=work-item-template --exclude-dir=references --exclude-dir=archive --exclude=DESIGN.md '^(id|title|type|state|status|parent|waiting_on|priority):|^\*\*Next action:\*\*' "$MAIN/work-items"
```

- The lines from one file are one item. A file with no `id:` line is not an item.
- Leave out Done and Cancelled unless the owner asks.

## Open questions

Open rows are at the top of each table. Only a row with Status `Open` counts. Leave out a row that is still the template's example (its question is `<Specific unanswered question>`); an item the owner made by hand can hold one:

```bash
grep -rHE --include='*.md' --exclude-dir=work-item-template --exclude-dir=references --exclude-dir=archive --exclude=DESIGN.md '^\| *Q-[0-9]+ *\|.*\| *Open *\|' "$MAIN/work-items"
```

Report what waits on the owner first (item ID, Q-ID, what it blocks), then what is in progress, then your next step.

## A parent's full tree

The parent's folder is the folder of its file.

```bash
grep -rHE --include='*.md' --exclude-dir=references --exclude=DESIGN.md '^(id|title|state|status|parent|waiting_on):' "<parent folder>"
grep -nE '^\| *P[0-9]+ —|^\*\*Sub-items:\*\*|^- \[ \] \*\*(P[0-9]+-)?T[0-9]+' "<item file>"
```

The second shows an item's sub-item list and its open tasks: a top-level item's phases with their Sub-items cells, or a sub-item's `**Sub-items:**` line. Under a top-level item, a sub-item no Sub-items cell names goes last, under "No phase".

## Search by words or by a field

```bash
grep -rliE --include='*.md' --exclude-dir=work-item-template 'login' "$MAIN/work-items"
grep -rlE --include='*.md' --exclude-dir=work-item-template --exclude-dir=references --exclude=DESIGN.md '^type: *bug' "$MAIN/work-items"
grep -rliE --include='*.md' --exclude-dir=work-item-template --exclude-dir=references --exclude=DESIGN.md '^title:.*login' "$MAIN/work-items"
```

- The second command searches one field. Use `^state: *Building`, `^status: *Blocked`, or `^waiting_on: *"?owner` the same way.
- The word search also reads designs and source files. A hit there belongs to the item whose file sits in the same folder.
- Two or more matches: name each, with your recommendation, and ask which.

## Check for hand changes

Three read-only checks: every item's file, ID, and `parent:`; each ID that two files share; template copies the owner made by hand. `folders-and-files.md`, "The hand-change check", explains how to read them.

```bash
grep -rHE --include='*.md' --exclude-dir=work-item-template --exclude-dir=references --exclude=DESIGN.md '^(id|parent):' "$MAIN/work-items"
grep -rhE --include='*.md' --exclude-dir=work-item-template --exclude-dir=references --exclude=DESIGN.md '^id:' "$MAIN/work-items" | sed -E 's/^id: *"?([^" ]*)"? *$/\1/' | sort | uniq -d
grep -rlE --include='*.md' --exclude-dir=work-item-template --exclude-dir=references --exclude=DESIGN.md '^title: *"?<Work item title>' "$MAIN/work-items"; find "$MAIN/work-items" -name 'WORK-ITEM.md' -not -path '*/work-item-template/*'
```
