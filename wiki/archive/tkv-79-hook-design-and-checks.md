# TKV-79: memory hook design and checks

The shared hooks invoke the selected memory choice without naming a backend. The project keeps three executable entry commands; a choice supplies a startup module and reminder text beside them. There is no setup program, runtime registry, or new external dependency.

## Installed resources

`session-start.mjs` imports the installed `session-start-choice.mjs` beside itself. It preserves the compaction reminder and output allowance. Local memory supplies the inherited Current State read and index rebuild; Notion supplies its verified page ID and an API read with closed stdin; Hindsight supplies no state snapshot because its add-on delivers memory. `prompt-reminder.mjs` reads the installed `prompt-memory-reminder.md` while retaining phrase matching, pasted-source exclusions, and the owner-approval warning.

Setup copies exactly one choice’s resources. Notion writes its verified page ID in the module. Updates show changes to both commands and resources, preserve owner configuration and unrelated hooks, and replace obsolete memory-selection arguments. Hindsight projects regain the toolkit’s SessionStart entry for compaction reminders. Changed Codex entries require the owner’s review in `/hooks`.

## Verification on 2026-10-13

Scratch command checks passed for startup, compaction, matched and quiet prompts, and pasted-source exclusion with all three memory choices. Local checks rebuilt the index, excluded retired records, found main-checkout memory from a Git worktree, and reported a missing Current State. A mock Notion CLI verified a successful snapshot, closed stdin, and API failure recovery; this does not certify live authentication. No live memory records or host configuration were changed.

A separate reviewer checked the code and setup/update guidance against the live Claude Code hooks and hooks-guide pages and the Codex hooks page on 2026-10-13. No blocking issue was found. Native host loading and plugin discovery are checked in phase 7.

Official sources: https://code.claude.com/docs/en/hooks, https://code.claude.com/docs/en/hooks-guide, https://learn.chatgpt.com/docs/hooks. The source pages allow choice-owned resources and model context from SessionStart output; the toolkit’s startup/import and filing process remains the owner’s own.
