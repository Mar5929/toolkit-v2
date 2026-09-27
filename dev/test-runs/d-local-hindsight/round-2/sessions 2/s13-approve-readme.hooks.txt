=== hook context 1 (rollout ordinal 9, 2026-09-27T17:28:37.313Z) ===
Project briefing: Greet CLI Sample D2 (greet-cli-sample-d2), owner Mike. Work items: local folders in .work-items/ (ids like WI-001). Memory: the local Hindsight server. Salesforce: no. Hosts: Claude Code and Codex.
Project manual: /private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/d-local-hindsight-r2/AGENTS.md. Stages, statuses, and approval gates: toolkit work lifecycle.

This worktree is on branch main, which names no work item.

Active items:
- WI-001 Add --shout flag to greet CLI: 11 User approval, In Progress. Next action: Mike reviews the WI-002 README result separately. After that decision, use work-finish and resolve the delivery route; no Git remote is c... Continues with work-finish.
- WI-002 Document --shout in README: 11 User approval, In Progress, waiting on owner. Next action: Mike reviews the WI-002 documentation result separately. After approval, add a remote or choose another delivery route before publication... Continues with work-decide.

Waiting on the owner:
- WI-002 Document --shout in README: WI-002 is at 11 User approval: the owner reviews the result. Approve with: toolkit work approve WI-002 --result --by <name>. (work-decide)

Items: 2 in progress.

Current focus:
Last updated: 2026-09-27, work-check, agent
## Now
- WI-001 Add --shout flag to greet CLI
- WI-002 Document --shout in README (sub-item of WI-001)
## Waiting on the owner
None.
## Untracked to-dos
None.
## Next session starts with
- Continue WI-001 and WI-002 from each item's Resume here; record Mike's separate result decisions, then follow work-finish.

Project memory (hindsight): 1 record, from the local copy. toolkit memory find searches it; toolkit memory get <key> reads one record.

Memory records:
- user_document_cli_flags_in_readme: Document every command-line flag in the README

Always-on rules. Claude Code loads them by itself; in Codex, each one is read at session start:
- .claude/rules/humanize-outbound-text.md: Humanize Anything Sent to Another Person
- .claude/rules/keep-work-item-current.md: Keep the Active Work Item Accurate
- .claude/rules/memory-review-and-save.md: Review and Save Project Memory
- .claude/rules/plain-english-artifacts.md: Write Artifacts in Plain English
- .claude/rules/session-handoff.md: Prepare a Session Handoff
- .claude/rules/shared-repository-work.md: Work Safely in a Shared Repository
- .claude/rules/work-item-folders.md: Local Work-Item Folders

How to write replies (from AGENTS.md):
Claude Code applies the Plain English output style to chat. Codex and helper agents follow these lines instead.

- Start with the answer, result, or current status. Answer what was asked. Keep it short; add detail when asked.
- Use ordinary words. Explain an unfamiliar term the first time it matters. Use the exact name a system uses, the same way every time.
- Write literally: no metaphors, idioms, jokes, or picture words in place of the real name. State the point directly, without a "not this, but that" setup.
- Use paragraphs for a connected explanation, bullets for separate items or choices, and a heading only when it names what is under it.
- When asking for a decision, name the choice and the difference that matters, and recommend one.
- Use the exact status word: written, built, tested, merged, installed, or seen working. Say something works only when you saw it work.
- Leave out routine narration of process and helper activity. Give one direct line when the owner lost something, an action cannot be undone, work waits on the owner, or there is a cost.

=== hook context 2 (rollout ordinal 76, 2026-09-27T17:29:14.686Z) ===
WI-002 was edited directly and passes validation. toolkit work edit <id> --section "<heading>" --set-file <file> changes a section the same way in every tracker and keeps the toolkit's record of what it wrote; prefer it to editing the file.

