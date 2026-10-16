# Setup problems and host permissions

This file is for a project folder that is not a plain repository root, a setup that stopped part way, and a required step that cannot run. It gives the recovery process without changing the owner's choices.

## Project folder problems

- **The folder is not a Git repository, or it sits inside another repository.** The hook commands and the skills find `.claude/hooks/`, `work-items/`, and `memory/` from the root of the Git repository. With no repository, offer `git init`. Inside another repository, recommend setting up the root of that repository, and recommend `git init` in this folder only when this folder is its own project.
- **The session runs in a linked worktree.** A linked worktree is a separate folder with its own branch. The main checkout is the project's main folder, the first path that `git worktree list` prints. Git ignores `memory/` and `work-items/`, so they exist only in the main checkout, and the setup commit belongs on the default branch. Set up a new project in the main checkout, even when a rule for the whole computer asks for a worktree.
- **The project has its own folder named `wiki/product-wiki/`, `sources/`, `delivery/`, or `wiki/reference/`.** The full layout puts a guide, `AGENTS.md`, into each of these folders (into `wiki/product-wiki/` only with local or Hindsight memory), and that guide would describe the owner's files there as the project's records. Ask the owner before you copy anything into that folder.
- **Setup stopped part way.** These are the signs: the Tracker or the Memory line of "Toolkit settings" still holds its prompt, one of those lines names a choice whose own lines are missing from the section, a choice resource still holds an unfilled identifier such as `{{CURRENT_STATE_PAGE_ID}}` in `.claude/hooks/session-start-choice.mjs`, or the project's Current State, in a project that has one, still has its fill-in guide.

## Questions and failed steps

- **A question tool shows no question.** In `codex exec` the question box is never shown, and the turn ends with no answer. Ask each question in the reply text.
- **Something fails.** Report the failed step and fix it within the approved setup when you can. When repair needs an owner decision, approval, or action, say what is needed and wait before doing dependent work. Never change an answer of the owner's, or set the project up in another folder and copy it over, to get past a failure.

## Host permissions

Follow the active session's filesystem, network, and approval settings. A Codex session may allow these operations, require approval, or forbid escalation. Use the supported approval mechanism only when the active settings require and permit it. Never request escalation when the session forbids it.

When a required command is blocked and no permitted route is available, show the owner the exact command to run in a terminal and wait for the result before doing dependent work. Keep the required Codex files in the setup; do not omit them to get past a refusal.
