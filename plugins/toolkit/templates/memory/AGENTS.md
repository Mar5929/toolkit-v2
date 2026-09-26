# Project memory

This folder is the project's built-in memory. It is Git-ignored, lives in the
main checkout, and is shared by every worktree. `toolkit export` is its backup.

- Write here only through `toolkit memory` commands, which the `memory-save`
  and `memory-tidy` skills run. Never edit these files by hand.
- Look things up with the `memory-find` skill or `toolkit memory find`.
- `MEMORY.md` is a generated index. `CURRENT_FOCUS.md` is the current focus.
  `terminology-glossary.md` holds project terms.
- `memory-criteria.md` says what is worth saving in this project. It is not
  edited: owner corrections to it are saved as `feedback` records with
  `memory-save`. The `memory-save` skill says when a save needs the owner's yes.
