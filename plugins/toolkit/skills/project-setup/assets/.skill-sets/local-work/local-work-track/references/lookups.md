# Finding work in local files: the lookups

Purpose: the exact commands that read items from `work-items/`. They only
read.

- Start each command with the `MAIN=` line from `SKILL.md`, step 1.
- Replace `WI` with the prefix from `PROJECT.md`, "Toolkit settings", and
  `WI-031` with the ID, in three digits.
- Keep the flags as written. They skip the template, `references/` folders,
  and `DESIGN.md` files, except in the word search.

## One item

```bash
grep -rlE --include='*.md' --exclude-dir=work-item-template --exclude-dir=references --exclude=DESIGN.md '^id: *"?WI-031"? *$' "$MAIN/work-items"
```

- One path: read the whole file, starting with the five lines under
  `### Current state`. Its folder also holds `DESIGN.md`, `references/`,
  and its sub-items' folders.
- No path: run the hand-change check (`folders.md`), then search by title.
  Never make a second item for work that already has one.
- Two paths: two items share the ID (`folders.md`).

## The board

Open items, `archive/` left out:

```bash
grep -rHE --include='*.md' --exclude-dir=work-item-template --exclude-dir=references --exclude-dir=archive --exclude=DESIGN.md '^(id|title|type|stage|status|parent|waiting_on|priority):|^\*\*Next action:\*\*' "$MAIN/work-items"
```

- The lines from one file are one item. A file with no `id:` line is not
  an item.
- Leave out Done and Cancelled unless the owner asks.

## Open questions

Open rows are at the top of each table. Only a row with Status `Open`
counts; leave out rows that still hold the template prompt:

```bash
grep -rHE --include='*.md' --exclude-dir=work-item-template --exclude-dir=references --exclude-dir=archive --exclude=DESIGN.md '^\| *Q-[0-9]+ *\|.*\| *Open *\|' "$MAIN/work-items"
```

Report what waits on the owner first (item ID, Q-ID, what it blocks), then what is in progress, then your next step.

## A parent's full tree

Three levels at most. The parent's folder is the folder of its file.

```bash
grep -rHE --include='*.md' --exclude-dir=references --exclude=DESIGN.md '^(id|title|stage|status|parent|waiting_on):' "<parent folder>"
grep -nE '^\| *P[0-9]+ —|^- \[ \] \*\*P[0-9]+-T[0-9]+' "<item file>"
```

The second shows an item's phases, their Sub-items cells, and its open
tasks. A sub-item no Sub-items cell names goes last, under "No phase".

## Search by words or type

```bash
grep -rliE --include='*.md' --exclude-dir=work-item-template 'login' "$MAIN/work-items"
grep -rlE --include='*.md' --exclude-dir=work-item-template --exclude-dir=references --exclude=DESIGN.md '^type: *bug' "$MAIN/work-items"
grep -rliE --include='*.md' --exclude-dir=work-item-template --exclude-dir=references --exclude=DESIGN.md '^title:.*login' "$MAIN/work-items"
```

- The word search also reads designs and source files. A hit there belongs
  to the item whose file sits in the same folder.
- Two or more matches: name each, with your recommendation, and ask which.
