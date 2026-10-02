# Finding memory in local files

The exact commands that read memory from `memory/`. They only read.

- Start each command with the `MAIN=` line from `SKILL.md`, "Every time", step 1.
- Replace `billing|invoice` with the words to search, joined by `|`. Replace `WI-031` with the work item ID, written as the tracker shows it (`WI-031`, `WI-31`, or `#12`).
- Keep the flags as written. They skip the seeds, the folder's `AGENTS.md`, the index `MEMORY.md`, and `memory-criteria.md`.
- A command lists file names. Open a file to read it.

## Every file's summary and status

```bash
grep -rHE --include='*.md' --exclude='*_template.md' --exclude=AGENTS.md --exclude=MEMORY.md --exclude=memory-criteria.md '^(description|status|updated):' "$MAIN/memory"
```

- The lines from one file are one memory. A file with no `status:` line has no header.
- `MEMORY.md` holds the same summaries for the files that are in the index, as of the last session start (`SKILL.md`, "Where memory lives").

## By topic

```bash
grep -rliE --include='*.md' --exclude='*_template.md' --exclude=AGENTS.md --exclude=MEMORY.md --exclude=memory-criteria.md 'billing|invoice' "$MAIN/memory"
```

This also searches `CURRENT_STATE.md` and `terminology-glossary.md`.

## By work item

Every mention of the item, in a header or in the text:

```bash
grep -rlE --include='*.md' --exclude='*_template.md' --exclude=AGENTS.md --exclude=MEMORY.md --exclude=memory-criteria.md 'WI-031([^0-9]|$)' "$MAIN/memory"
```

Only the files that list the item in `work_items`:

```bash
grep -rlE --include='*.md' --exclude='*_template.md' --exclude=AGENTS.md --exclude=MEMORY.md --exclude=memory-criteria.md '^ +- +"(\[\[)?WI-031([^0-9]|$)' "$MAIN/memory"
```

- The ending `([^0-9]|$)` stops `WI-031` from also matching `WI-0310`.
- For a GitHub issue, replace `WI-031` with `#12` in either command.

## By status

```bash
grep -rlE --include='*.md' --exclude='*_template.md' --exclude=AGENTS.md --exclude=MEMORY.md --exclude=memory-criteria.md '^status: *"?needs-review"?' "$MAIN/memory"
```

- Replace `needs-review` with `current`, `superseded`, `retired`, or `withdrawn` (`record-format.md`, "Status").
- Proposals, both whole files and single sections, carry the words `Proposal, not approved yet:`:

```bash
grep -rn --include='*.md' --exclude='*_template.md' --exclude=AGENTS.md --exclude=MEMORY.md --exclude=memory-criteria.md 'Proposal, not approved yet:' "$MAIN/memory"
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
