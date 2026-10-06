# Finding memory in local files

The exact commands that read memory from `memory/`. They only read.

- Start each command with the `MAIN=` line from `SKILL.md`, "Every time", step 1.
- Replace `billing|invoice` with the words to search, joined by `|`. Replace `WI-031` with the work item ID, written as the tracker shows it (`WI-031`, `WI-31`, or `#12`).
- Keep the flags as written. They skip the seed, the folder's `AGENTS.md` and `CLAUDE.md`, and the index `MEMORY.md`.
- A command lists file names. Open a file to read it.

## Every file's summary and status

```bash
grep -rHE --include='*.md' --exclude='*_template.md' --exclude=AGENTS.md --exclude=CLAUDE.md --exclude=MEMORY.md '^(description|status|created|updated|check_by):' "$MAIN/memory"
```

- The lines from one file are one memory. A file with no `status:` line has no header.
- `MEMORY.md` holds the same summaries for the files that are in the index, as of the last session start (`SKILL.md`, "Where memory lives").

## By topic

```bash
grep -rliE --include='*.md' --exclude='*_template.md' --exclude=AGENTS.md --exclude=CLAUDE.md --exclude=MEMORY.md 'billing|invoice' "$MAIN/memory"
```

This also searches `CURRENT_STATE.md`. The host's own search tool can skip `memory/`, because Git ignores it: use this command.

## By work item

Every mention of the item, in a header or in the text:

```bash
grep -rlE --include='*.md' --exclude='*_template.md' --exclude=AGENTS.md --exclude=CLAUDE.md --exclude=MEMORY.md 'WI-031([^0-9]|$)' "$MAIN/memory"
```

Only the files that list the item in `work_items`:

```bash
grep -rlE --include='*.md' --exclude='*_template.md' --exclude=AGENTS.md --exclude=CLAUDE.md --exclude=MEMORY.md '^ +- +"(\[\[)?WI-031([^0-9]|$)' "$MAIN/memory"
```

- The ending `([^0-9]|$)` stops `WI-031` from also matching `WI-0310`.
- For a GitHub issue, replace `WI-031` with `#12` in either command.

## By status

```bash
grep -rlE --include='*.md' --exclude='*_template.md' --exclude=AGENTS.md --exclude=CLAUDE.md --exclude=MEMORY.md '^status: *"?needs-review"?' "$MAIN/memory"
```

- Replace `needs-review` with `current`, `superseded`, or `retired` (`record-format.md`, "Status").
- Proposals, both whole files and single sections, carry the words `Proposal, not approved yet:`:

```bash
grep -rn --include='*.md' --exclude='*_template.md' --exclude=AGENTS.md --exclude=CLAUDE.md --exclude=MEMORY.md 'Proposal, not approved yet:' "$MAIN/memory"
```

## By date

Every date a file carries, in its header and in a section's "Check or remove by" line:

```bash
grep -rHE --include='*.md' --exclude='*_template.md' --exclude=AGENTS.md --exclude=CLAUDE.md --exclude=MEMORY.md '^(created|updated|check_by): *[0-9]|^\*\*Check or remove by:\*\*' "$MAIN/memory"
```

- A `check_by` or "Check or remove by" date that is today or earlier is due.
- What happened on a day: the files whose `created` or `updated` is that day, and the rows of each Runs table that start with it:

```bash
grep -rnE --include='event_*.md' '^\| *2026-10-05 *\|' "$MAIN/memory"
```

## Lessons

Each lesson's heading and its Seen line, from every file's `## Gotchas and lessons` section:

```bash
find "$MAIN/memory" -maxdepth 1 -name '*_*.md' ! -name '*_template.md' -exec awk '/^## Gotchas and lessons/{f=1;next} /^## /{f=0} f&&/^(### |\*\*Seen:\*\*)/{print FILENAME": "$0}' {} +
```

## Links to a file

Every file that links to `project_billing.md`, or names it in `supersedes:`:

```bash
grep -rlF --include='*.md' 'project_billing.md' "$MAIN/memory"
```
