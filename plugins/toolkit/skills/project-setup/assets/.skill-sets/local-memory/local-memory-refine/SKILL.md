---
name: local-memory-refine
description: 'Reviews all this project''s local memory: merges duplicates, retires stale files, fixes work item links, prunes Current State, and proposes proven lessons as rules or skills, so memory stays small and true. Use when the owner says "refine memory" or "clean up memory", or the session-start hook says so. Not for fixing one memory; use local-memory-save. Only for projects with local memory.'
---

# Local memory: refine

Memory is Markdown files in `memory/` in the main checkout (the first path `git worktree list` prints). Refining changes many files, so it plans first and asks. Single saves and corrections go through `local-memory-save`. From Codex, edits to the main checkout's `memory/` run outside the sandbox.

## Steps

1. **Current State first** (`references/refine.md`, "Current State"): remove every line that is no longer true and tell the owner what went.
2. **List every file** and find: duplicates, concepts grown too large, files to supersede or retire, proposals waiting, broken or missing links to work items and between memories, stale files, sections in the wrong home, old `feedback_` files, glossary problems, lessons ready to become rules or skills, and owner rules that repeat, contradict, or are already enforced (`references/refine.md`).
3. **Show the plan**: one numbered line per change, with its files and a one-line reason. Wait for the owner's yes.
4. **Make the changes** he approved, reading each file fresh first and back after.
5. **Report** in one short list, each line with the file name (`references/refine.md`, "The report").

## Rules

- Only two changes skip the plan: removing Current State lines that are no longer true, and removing a secret or an email address at once.
- Never delete a memory file: supersede it or retire it with the marks in `references/record-format.md`. The exceptions are in `references/refine.md`, "Plan first, then ask".
- An `event_` or `decision_` file is never merged into a concept.
- The owner's edits in Obsidian win. Ask before fixing a file he changed.

## References

| File | Open it when |
| --- | --- |
| [references/refine.md](references/refine.md) | Every refine: the plan, Current State, each kind of change, links, lessons, writing a project skill, and the report. |
| [references/record-format.md](references/record-format.md) | The file format: front matter, status, the marks for superseded and retired text, and work item links. |
