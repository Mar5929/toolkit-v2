# Finding memory in local files

This file gives the exact commands that find and read memory in `memory/`. The commands only read: none of them changes a file.

Four things hold for every command in this file:

- Start each command with the `MAIN=` line from step 1 of `references/memory-store.md`.
- Replace the example words with your own. Replace `billing|invoice` with the words to search for, joined by `|`. Replace `WI-031` with the work item's ID, written exactly as it is shown where the work items are kept, such as `WI-031`, `WI-31`, or `#12`.
- Keep the flags as written. They skip the template, the folder's `AGENTS.md` and `CLAUDE.md`, and the index `MEMORY.md`.
- A command lists file names. Open a file to read it.

## Every file's summary and status

This command prints the description, the status, and the dates of every file:

```bash
grep -rHE --include='*.md' --exclude='*_template.md' --exclude=AGENTS.md --exclude=CLAUDE.md --exclude=MEMORY.md '^(description|status|created|updated|check_by):' "$MAIN/memory"
```

- The lines that come from one file describe one memory record. A file with no `status:` line has no header.
- `MEMORY.md` holds the same summaries for the files that are in the index, as of the last session start. `references/memory-store.md`, section "Where memory is kept", says how the index is made and which files it leaves out.

## By topic

Search memory by topic with this command, and not with the search tool of Claude Code or Codex. `memory/` is only in the main checkout, so that search tool misses `memory/` from a worktree. This command also searches `CURRENT_STATE.md`.

```bash
grep -rliE --include='*.md' --exclude='*_template.md' --exclude=AGENTS.md --exclude=CLAUDE.md --exclude=MEMORY.md 'billing|invoice' "$MAIN/memory"
```

## By work item

This command finds every mention of the work item, in a header or in the text:

```bash
grep -rlE --include='*.md' --exclude='*_template.md' --exclude=AGENTS.md --exclude=CLAUDE.md --exclude=MEMORY.md 'WI-031([^0-9]|$)' "$MAIN/memory"
```

This command finds only the files that list the work item in `work_items`:

```bash
grep -rlE --include='*.md' --exclude='*_template.md' --exclude=AGENTS.md --exclude=CLAUDE.md --exclude=MEMORY.md '^ +- +"(\[\[)?WI-031([^0-9]|$)' "$MAIN/memory"
```

- The ending `([^0-9]|$)` stops `WI-031` from also matching `WI-0310`.
- For a GitHub issue, replace `WI-031` with `#12` in either command.

## By status

This command finds the files with the status `retired`:

```bash
grep -rlE --include='*.md' --exclude='*_template.md' --exclude=AGENTS.md --exclude=CLAUDE.md --exclude=MEMORY.md '^status: *"?retired"?' "$MAIN/memory"
```

- To search for another status, replace `retired` with `current` or `superseded`. `record-format.md`, section "Status", says what each status means.

## By date

This command prints every date that a file carries, in its header and in a section's "Check or remove by" line:

```bash
grep -rHE --include='*.md' --exclude='*_template.md' --exclude=AGENTS.md --exclude=CLAUDE.md --exclude=MEMORY.md '^(created|updated|check_by): *[0-9]|^\*\*Check or remove by:\*\*' "$MAIN/memory"
```

- A `check_by` date or a "Check or remove by" date that is today or earlier is due.
- To find what happened on a day, take two things: the files whose `created` or `updated` is that day, and the rows of each Runs table that start with that day. This command finds those rows:

```bash
grep -rnE --include='event_*.md' '^\| *2026-10-05 *\|' "$MAIN/memory"
```

## Lessons

This command prints each lesson's heading and its Seen line, from the `## Gotchas and lessons` section of every file:

```bash
find "$MAIN/memory" -maxdepth 1 -name '*_*.md' ! -name '*_template.md' -exec awk '/^## Gotchas and lessons/{f=1;next} /^## /{f=0} f&&/^(### |\*\*Seen:\*\*)/{print FILENAME": "$0}' {} +
```

## Links to a file

This command finds every file that links to `project_billing.md`, or names it in `supersedes:`:

```bash
grep -rlF --include='*.md' 'project_billing.md' "$MAIN/memory"
```
