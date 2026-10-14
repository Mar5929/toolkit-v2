# TKV-79 independent memory review

The memory and shared Notion changes preserve the reviewed record contracts after the fixes described below. This is an independent source and procedure review, not approval of a merge, deployment, live migration, or finished result.

## Scope and evidence

The review compares base `3c8113e24a4519cd41e3e9404703b4490ed3e064` with `codex/tkv-79-memory`, at final correction `5375fca0`, including ledger commit `5faef79c`. It covers changed files under `choices/memory/` and `choices/notion-shared/`, and reads the relevant unchanged local search/save/format, Notion capture, Hindsight memory rule and repository-publication procedures. The reviewer did not write those changes.

The review follows the repository's harness-writing skill and checklist, request-evaluation rule, document clarity rule and owner guiding principles. Current official [Claude Code skills](https://code.claude.com/docs/en/skills), [Codex skills](https://learn.chatgpt.com/docs/build-skills), and [skill best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) were read on 2026-10-13. The review also checked the current [Notion query reference](https://developers.notion.com/reference/query-a-data-source), [Hindsight configuration](https://hindsight.vectorize.io/developer/configuration), and [Codex hooks](https://learn.chatgpt.com/docs/hooks). Source reading does not prove a live connection or installed version.

## Findings and fixes

| Finding | Exact location at first review | Result |
| --- | --- | --- |
| The extracted closing procedure said to read a wait section "below", although that section stayed in the installed memory-specific reference. The stale pointer could prevent a closing record publication wait from being recorded. | `choices/memory/repository-records/files-to-add/.claude/skills/managing-work-items/references/repository-record-closing.md:35` | Fixed in `b696e204`. The pointer now names `project-memory-steps.md`, "Recording a wait for a record or a decision". Rechecked. |
| A new trailing blank line failed the repository's whitespace check. | The same file, line 49 at first review | Fixed in `b696e204`. Rechecked with `git diff --check`. |

A final integration finding in `choices/memory/local/files-to-add/.claude/skills/managing-project-memory/references/tidying.md:27` named the moved "Starting a helper" section in lifecycle-rules.md. Commit `5375fca0` points it to `starting-a-helper.md` and corrects ledger D17. Rechecked. No unresolved correctness regression was found in the changed memory procedures. The following integration dependency remains for the parent: the standalone memory branch's `choices/memory/hindsight/reference/what-hindsight-adds-to-a-project.md` still describes the old `--skill hindsight` reminder argument and removal of Toolkit SessionStart. Preserve the phase-1 hook integration's updated rows and verification procedure when combining the branches. The phase-1 shared hook reads `session-start-choice.mjs` and `prompt-memory-reminder.md`; its Hindsight provider adds no local state-page read.

## Proposal disposition review

The final execution ledger was read at `5faef79c`. Its changed, retained, and deferred entries match the reviewed edits after D17's helper-start pointer and ledger were corrected in `5375fca0`.

- A9/A11 preserve selected-store isolation; A11 depends on the parent's verified hook design. A12/D43 keep capture authority in the coding-agent entry and retain needed standalone librarian approval context.
- C4's tracker route follows the project rule that current work belongs in the tracker; PROJECT.md retains choices and a pointer. C7 preserves the existing stronger rule against capturing unresolved shared questions as decisions, rather than authorizing them. C2/H8 keep unresolved owner wording unchanged.
- D18 preserves the common closing policy while local and Hindsight adapters keep their distinct lesson and wait behavior. D20's local command copies stay. D40/D49/I6 retain all exact metadata and replacement contracts after removing template prose.
- D50's schema inventories and E6's distinct failure evidence stay; the review found no invented replacement preference. G5 changes read routing while preserving read-before-save and search-before-save. B7's historical evidence is a research record, not a shipped runtime dependency.

## Representative old and new behavior

Each case below was traced from freshly read old and new entry procedures and their required references. These are finite procedure checks, not live service runs or separately launched host sessions.

| Scenario and input | Old behavior | New behavior and verdict |
| --- | --- | --- |
| Search local memory for a past role assignment, with an old index and a newer file saved this chat. | The entry opens retention and storage, then finding/searching. The finding procedure reads whole matching files and verifies changeable claims against authoritative records. | The entry opens storage's fresh-read procedure and finding/searching without loading retention policy unnecessarily. The current-file search and whole-record/source/status checks remain. Preserved. |
| Correct a local fact after an owner edit, while retaining creation date, useful earlier evidence and source uncertainty. | Search first; freshly read the file; apply a targeted correction; maintain metadata; verify read-back. Replacements preserve earlier records and links. | The same steps remain, with exact `description`, `updated`, `work_items` field names and a direct format reference. The format still preserves `created`, provenance, derivation, dates and bidirectional replacement links. Preserved. |
| Capture a useful unapproved Notion proposal; a similar capture is Processing. | Search captures and destinations; submit a linked follow-up rather than edit a claimed capture; include uncertainty and approval evidence. Capture does not approve the proposal. | The entry owns that authorization rule once. Wiki Inbox still distinguishes New/Needs review from Processing/Filed and preserves contributor/source/processing ownership. A working design remains in its item until owner approval. Useful proposal context may be captured with its status; it cannot become an approved design. Preserved. |
| Hindsight startup gives a preview with a saved full-output file; later the chat compacts. | Read the complete output before relying on memory; reread the rule after compaction; verify changing claims. Current work uses the tracker and project records, with no local Current State file. | The rule still requires the full file and distinguishes history from permission. The project guide still routes session start and compaction through the rule. The phase-1 provider adds no local state read. Preserved, subject to combining the hook-setting edits noted above. |
| A closing local work item has an approved shared decision saved on the default branch, but the main checkout has not received that save. | The memory-specific closing procedure checks the tracker's publication gate and records the wait; no premature record ID is written. | The common repository-closing procedure checks the same gate and routes the wait to the memory-specific reference after the pointer fix. Lessons retain approval, evidence, dates and unproven status; only verified published IDs enter the item. Preserved. |

## Checks and limits

- `git diff --check` passed after the closing-file fix.
- Temporary assemblies of every-project plus local, Hindsight or Notion memory and their required modules resolved changed delivered Markdown references. Code examples and the template's example record link were excluded from the link inventory.
- Changed CLI query bodies retain project-scoped data-source and ID filters. Template completion still requires stable repeated content reads rather than a fixed delay. Uncertain-write lookup before retry remains.
- The local `MAIN` command, no-memory-commit rule, read-before-change and read-back rules remain. Local metadata definitions and replacement links remain exact.
- No changed delivered file points to repository `archive/`, a placeholder archival substitute, or an execution report as runtime guidance.
- No live Notion or Hindsight data, owner host configuration, service credentials, or scheduled jobs were read or changed for a behavior test. Scratch host loading, real retrieval and storage, scheduled processing, and actual publication were not run.
