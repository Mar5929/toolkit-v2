# Skill renames for the one-home layout (TKV-24)

Date: 2026-10-05. Branch `claude/one-home-layout`. A rename only: no
instruction was rewritten, moved, added, or deleted, except the lines for
existing projects in `plugins/toolkit/skills/project-setup/references/update.md`
(section 4).

## What was renamed

| Old name | New name | Folders |
| --- | --- | --- |
| `managing-work-items` | `running-work-item-lifecycle` | `assets/every-project/.claude/skills/`; `dev/evals/` |
| `tracking-work-items` | `using-work-tracker` | `assets/work-local/`, `work-notion/`, `work-github/` (each `.claude/skills/`); `dev/evals/` |
| `managing-project-wide-records` | `filing-project-records` | `assets/every-project/.claude/skills/` |
| `managing-project-memory` | `curating-project-memory` | `assets/memory-process/.claude/skills/` |
| `storing-project-memory` | `using-memory-store` | `assets/memory-local/`, `memory-notion/` (each `.claude/skills/`) |

Method: `git mv` for each folder, then one `perl` substitution per name, with
the name matched as a whole name (no letter, digit, hyphen, or underscore
next to it). A search before the substitution found no partial match.

## Verification

1. The seven checks in `AGENTS.md` "Checks", run from the worktree root, after
   the change. Every one exited 0.

| Command | Result |
| --- | --- |
| `claude plugin validate .` | Validation passed |
| `claude plugin validate ./plugins/toolkit` | Validation passed |
| `claude plugin validate ./plugins/workstreams` | Validation passed |
| `claude plugin test ./plugins/workstreams` | 14 pass, 0 fail |
| `node dev/tools/check-skills.mjs` | 22 skills, 22 rows in `dev/SKILL-INDEX.md`, 0 errors, 0 warnings |
| `node dev/tools/check-rules.mjs` | Passed with 2 warnings, both on files this change did not touch: `salesforce-org-safety.md` (4199 bytes, over 4096) and `session-handoff.md` (a 573-character paragraph) |
| `node --test 'dev/tests/*.test.mjs'` | 42 pass, 0 fail |

   The first run of the hook tests failed once: the new name made one line of
   `prompt-reminder.mjs` 104 characters, over the 100-character limit in
   `dev/tests/hooks.test.mjs` ("size limit"). The string was re-wrapped at the
   same words, and the output of the hook is unchanged.

2. Remaining old names, found with
   `command grep -rnE '<the five names>' . --exclude-dir=.git --exclude-dir=node_modules`:

| File | Hits | Reason |
| --- | --- | --- |
| `dev/GOAL.md`, `dev/PROGRESS.md` | 3, 6 | Historical records, left alone by rule |
| `dev/archive/reviews/**/verification.md` (2 files) | 9, 12 | Archive |
| `dev/research/**` (8 files) | 4, 63, 130, 6, 3, 5, 2 | Research, left alone by rule (includes `layout-audit/DESIGN-SPEC.md` and the audits) |
| `dev/test-runs/*` (5 files, not this file) | 1, 1, 4, 3, 13 | Test records of earlier versions |
| `plugins/toolkit/skills/project-setup/references/update.md` | 6 | On purpose: the old-to-new table and the memory header line, for existing projects |
| This file | several | On purpose |

   No other file holds an old name.

3. `node --test 'dev/tests/*.test.mjs'`: 42 pass, 0 fail, including the hook
   tests.

4. Codex hook entries: CHANGED. The helper-agent reminder in
   `assets/settings/codex-hooks.hindsight.json`, `codex-hooks.local.json`,
   and `codex-hooks.notion.json` names the work item skill, so its text now
   says `running-work-item-lifecycle`. The owner must trust the changed Codex
   hooks again in `/hooks`. The three matching Claude Code snippets changed
   the same way (no trust step in Claude Code). The `.mjs` files changed
   (`session-start.mjs`, `prompt-reminder.mjs`, `codex-after-commit.mjs`)
   need no new trust by themselves.

## Descriptions that name a renamed skill

Each was changed in the skill's `SKILL.md` and in `dev/SKILL-INDEX.md`, the
skill name only. Each needs the routing test.

`running-work-item-lifecycle`, `filing-project-records`, `braindump`,
`merge-and-clean-up`, `publish-docs`, `sf-deploy-check`, `using-notion-cli`,
`using-work-tracker` (local, Notion, and GitHub versions), and
`using-memory-store` (local and Notion versions). `curating-project-memory`
names no renamed skill, so its description is unchanged.
