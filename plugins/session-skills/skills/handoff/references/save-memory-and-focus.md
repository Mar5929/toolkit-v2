# Step 3: save what must outlast the session

Purpose: send anything the owner asked to keep to `memory-save`, then replace
the current focus entry "Next session starts with" so the next session knows
where to start.

## Contents

- Checklist
- Things to keep
- The current focus
- When the save is refused

## Checklist

```text
- [ ] Memory criteria read
- [ ] Every unsaved "keep this" and unanswered "Save to memory?" sent to memory-save
- [ ] Focus read with its version
- [ ] "Next session starts with" replaced with one entry
- [ ] "Now" and "Last updated" checked; setup guide text removed on a new project
- [ ] Focus saved with --expect, then read back
```

## Things to keep

1. Read the memory criteria first. Built-in memory: `.memory/memory-criteria.md`
   in the project, which wins. Hindsight or Notion memory:
   `memory-criteria.md` in this folder.
2. Look for what the owner said to keep in this session that is not saved:
   "remember this", "from now on", a correction of how the agent works.
3. Look for a "Save to memory?" question he never answered. It is kept as a
   proposal, never dropped (`proposals.md` in this folder).
4. Open `memory-save` for each one and wait for its result. It owns where each
   thing goes, the approval, and the wording.
5. Anything `memory-save` did not save goes into the prompt, labeled not saved.
   Leave out anything the owner asked to forget or keep out of the handoff.

A review can end with nothing to save. Say so in one line, and do not invent a
save.

Never copy the work item's status, next step, or decisions into memory. They
live in the item.

## The current focus

The focus format, the version check, and a new project's focus are in
`current-focus.md` in this folder. A handoff changes only these parts.

1. Read the focus with its version:

   ```text
   toolkit memory focus --json
   ```

2. Replace the section "Next session starts with". It holds one entry, which
   each handoff replaces:

   - With a work item, the entry points at the item only:

     ```markdown
     - 2026-09-28 17:40 UTC | CSV export: continue WI-007 from its Resume here. Goal: invoices export to the bank's CSV format.
     ```

   - With no work item, a short note: the goal or topic, where work stopped,
     the first next action, constraints and approval boundaries, and open
     questions. Label unchecked claims. Do not create a work item to hold it.

3. Leave the other sections as they are, except:

   - add this session's work item id and title to "Now" when it is missing;
   - drop a setup step under "Waiting on the owner" that `toolkit doctor` no
     longer reports;
   - set the "Last updated" line with the source `handoff`, for example
     `Last updated: 2026-09-28, handoff, agent`.

   A new project's focus still holds the model's setup text: clean it up as
   `current-focus.md` says, "A new project's focus".

4. The whole file stays under 50 lines. When the new entry would push it
   over, shorten the entry to a pointer. Do not delete other sections to make
   room; tell the owner the focus needs `memory-tidy`.

5. Save the whole new focus with the version you read, then read it back. Run
   only the form for this host: the first is Claude Code, with the text in a
   quoted heredoc (the command, the text, then a line holding only `EOF`); the
   second is Codex.

   ```text
   toolkit memory focus --set-file - --expect <version>
   toolkit memory focus --text '<text>' --expect <version>
   toolkit memory focus
   ```

## When the save is refused

- Exit code 2, "changed since it was read": another session saved the focus
  after you read it. Read it again, put this handoff's entry into the new
  text, and save with the new version. Never save without `--expect`.
- `version` is null: there is no focus yet. Save with `--expect absent`, in
  the full four-section format.
- The old entry pointed at other work that is still in progress: replace it
  anyway (one entry only) and say so in the short list. That work's own
  Resume here still holds its continuation.

The same commands work for every memory backend (built-in `.memory/`, local
Hindsight, Notion).
