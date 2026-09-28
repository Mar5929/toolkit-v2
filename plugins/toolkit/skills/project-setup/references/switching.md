# Switching the memory backend or the tracker

Purpose: move a project's memory to another backend, or its work items to
another tracker, without losing records.

## Switching the memory backend

The memory export and import commands move memory between backends. The
project-wide `toolkit export` and `toolkit import` do not: they copy only the
local `.work-items/` and `.memory/` folders, so they would miss Hindsight and
Notion memory.

Checklist:

```text
- [ ] Every record exported from the current backend
- [ ] memory.type changed
- [ ] The new backend wired
- [ ] Dry-run import shown to the owner
- [ ] Import run after his yes
- [ ] Status and doctor clean
- [ ] Old backend left in place
```

1. Export every record (retired ones too), the current focus, and the
   glossary from the current backend to Markdown files, in a new folder
   outside the project (for example
   `~/Backups/toolkit/acme-crm-memory-switch`). Do this before changing
   anything.

   ```text
   toolkit memory export --to <export folder>
   ```

2. Change the choice. A setup key change also runs `toolkit sync`, which adds
   the files the new backend needs (for example the `.memory/` seeds for
   built-in memory).

   ```text
   toolkit config set memory.type <builtin|hindsight|notion>
   ```

3. Wire the new backend: `wiring-notion.md` or `wiring-hindsight.md` in this
   folder, "After init, or to repair".
4. Preview the import. It lists what would be saved and any file that breaks
   a rule. Show it to the owner.

   ```text
   toolkit memory import --from <export folder> --dry-run
   ```

5. After his yes, import. A record with the same key is replaced. Both hosts
   ask him before this command runs.

   ```text
   toolkit memory import --from <export folder>
   ```

6. Confirm:

   ```text
   toolkit memory status
   toolkit doctor
   ```

7. The old backend's data stays in place. Removing it needs the owner's yes.

## Switching the tracker

No command does this in this version.

1. Show a preview: each item, where it goes, and what cannot move (for
   example Notion card history).
2. Move items only with the owner's yes, one by one, reading each back.
3. Then change the choice and check:

   ```text
   toolkit config set tracker.type <tracker>
   toolkit doctor
   ```
