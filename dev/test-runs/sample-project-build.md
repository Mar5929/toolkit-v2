# Sample project built from the branch by the setup steps

Date: 2026-10-05. Work item: TKV-24. A separate agent followed
`project-setup` by hand (the plugin is not installed) from commit
`f0bd13d5`, into a new folder beside the older HarborDesk sample:
`/Users/michaelrihm/Documents/Projects/harbordesk-one-home-sample`. Choices:
local work items, local memory, not Salesforce, no `SOUL.md`. It then used
the project by its own skills: two sources, three decisions, rules in
`system/`, three work items (one closed with its Moved up line), a client
handoff record, Current State, and one pointer.

## Result

- 107 files: 94 tracked, 9 in `work-items/`, 4 in `memory/`. 9 commits.
- `node .claude/hooks/validate-records.mjs --all` exit 0 after every step;
  all commits passed with the pre-commit file on; a test commit that
  changed a filed original was stopped.
- No setup marker, old skill name, or removed folder name in the project
  (only the old plugin name `system-guide@claude-toolkit` in the two
  plugins-off settings).

## Instructions that were unclear, wrong, or needed a guess

Paths are under `plugins/toolkit/skills/project-setup/references/` or the
project's `.claude/skills/`.

1. `skills-hooks-settings.md:142-145`: "each `@toolkit-v2` name other than
   `toolkit@toolkit-v2`" also fits `workstreams@toolkit-v2`, which is not
   retired.
2. `finishing.md:50-59` leaves the Commands, `PROJECT.md`, and `README.md`
   prompts in a new project, while both files' guides say "Delete this guide
   after setup". `finishing.md:104` says "None." and `memory/AGENTS.md:21`
   says "None". The interview has no Codex question; setup always writes
   `.codex/`.
3. `record-decision.md:18` with record check 15: a decision whose Affects
   names a work item that does not exist yet fails `--all`. The order had to
   be: sources, then work items, then decisions and rules, then pointers.
4. `record-decision.md:21`: "an Open entry gets a rule only when more than
   one work item depends on the rule" needed a guess. Line 24 "end of that
   row" needed a guess (the end of the Answer cell was used).
5. `closing.md:40` with `update-system-doc.md:27-30`: by the letter, a work
   item that only summarises a rule meets all three conditions to mark the
   rule Built. A clearer condition is needed.
6. `closing.md:47` and the Moved up prompt cover only DEC and rule IDs; a
   glossary change has no ID and no route.
7. `running-work-item-lifecycle/SKILL.md:11`: no step writes a rule's ID
   into a new item that must follow an existing rule.
8. `testing-loop.md:11` says to check in the item's worktree; a
   documents-only item saved with `publish-docs` has none.
9. `using-work-tracker` (local) `field-mapping.md:138` keeps the "Sub-item
   form" comment with nothing under it. `SKILL.md:33` (Backlog: only the
   verbatim words) and `field-mapping.md:135` (write the Goal) differ.
10. `curating-project-memory/SKILL.md:54` gives "Next session starts with"
    to `handoff`; nothing says who writes it when no handoff runs.

## Not done

No helper agents ran (requirements analyst, design critic, acceptance
checker). No live session of Claude Code or Codex opened the project.

## Status

The ten items are open. The sample holds the memory design as it was on
this date (Current State plus pointers).
