# One folder per setup choice: the move changes nothing a project receives

Date: 2026-10-05. Branch `claude/one-home-layout` (TKV-24), Codex CLI 0.160.0,
plugin version 0.8.16 (unchanged). The "before" copy is `origin/main` at
`63e141a`.

What moved: `assets/model/`, `assets/.shared-skills/`, `assets/.skill-sets/`,
and `assets/hooks/` became `assets/every-project/`, `work-local/`,
`work-notion/`, `work-github/`, `memory-local/`, `memory-notion/`,
`memory-process/`, `notion-tools/`, `salesforce/`, and `soul/`. Each holds
files at the paths a project has them. 247 files moved with `git mv` (every
move shows as a 100% rename); the other 9 files under `assets/` (the settings
snippets and `owner-preferences.md`) did not move. The tracked file count of
`plugins/toolkit` is 279 before and after.

| Old location | New folder | Files |
| --- | --- | --- |
| `model/` (project files, rules, shared hooks of the starter) | `every-project/` | 34 |
| `model/` (Salesforce files) | `salesforce/` | 80 |
| `model/` (`memory/`) | `memory-local/` | 6 |
| `model/` (`work-items/`, `PROJECT-ROADMAP.md`, one rule) | `work-local/` | 6 |
| `model/SOUL.md` | `soul/` | 1 |
| `.shared-skills/` | `every-project/` | 39 |
| `hooks/` | `every-project/.claude/hooks/` | 3 |
| `.skill-sets/local-work/` | `work-local/` | 5 |
| `.skill-sets/notion-work/` | `work-notion/` | 29 |
| `.skill-sets/github-work/` | `work-github/` | 6 |
| `.skill-sets/local-memory/` | `memory-local/` | 4 |
| `.skill-sets/notion-memory/` | `memory-notion/` | 26 |
| `.skill-sets/memory-process/` | `memory-process/` | 6 |
| `.skill-sets/notion-tools/` | `notion-tools/` | 2 |

## 1. The seven checks (from the worktree root)

```bash
claude plugin validate .                      # Validation passed
claude plugin validate ./plugins/toolkit      # Validation passed
claude plugin validate ./plugins/workstreams  # Validation passed
claude plugin test ./plugins/workstreams      # 14 pass, 0 fail
node dev/tools/check-skills.mjs               # passed, 0 errors, 0 warnings (22 skills, 22 index rows)
node dev/tools/check-rules.mjs                # passed with 2 warnings (the same 2 as before the move)
node --test 'dev/tests/*.test.mjs'            # 42 pass, 0 fail, 0 skipped
```

`check-rules.mjs` no longer takes a folder by default: it puts the setup
folders together in a scratch folder (one project with every choice) and
checks that. Its numbers match the old tool on `origin/main` run with
`--dir .../assets/model`: 19 rules, 14 always on, 22971 bytes, and 31579 /
28991 / 42358 bytes loaded in every session for the three setups.

`check-skills.mjs` has new checks: SKILL.md links every setup folder, and a
project path is in one folder (the alternatives, `work-*` and `memory-local`
with `memory-notion`, may share a path). A scratch test added a duplicate
`SOUL.md`, a Salesforce rule the list does not name, and an `sf-*` skill in
`every-project/`: the run failed on each, then passed once they were
removed.

## 2. Equivalence: before and after copies

Before copy: `git archive origin/main plugins/toolkit | tar -x -C <scratch>`,
then the OLD `setup-copy.md` ("Make the scratch folder", "Never copied", "Left
out by the choices") and the OLD `skills-hooks-settings.md` ("Skills", "Hook
commands"), run as shell commands, stopping before the markers and fill-ins.
After copy: the NEW `setup-copy.md` ("Make the scratch folder", "Folders the
choices add", "Never copied") from the worktree, stopping at the same point.
Both used the same `cp`, `rm`, and `find` commands the instructions give; a
Hindsight project copied only `memory-local/memory/CURRENT_STATE.md`.

The script ran every combination: work items (local, Notion, GitHub) x memory
(local, Notion, Hindsight) x Salesforce (yes, no) x SOUL.md (kept, declined)
= 36 combinations. For each it ran `diff -r before after`, and compared a
sorted list of every path with its type (file, folder, link) and file mode.

Result: all 36 combinations show the same files, the same content, and the
same modes. That includes the five the task named:

| Combination | Files (before / after) | Content | Paths and modes |
| --- | --- | --- | --- |
| (a) local work, local memory, no Salesforce, no SOUL.md | 102 / 102 | same | same |
| (b) local work, local memory, Salesforce, SOUL.md kept | 183 / 183 | same | same |
| (c) Notion work, Notion memory, no Salesforce, SOUL.md kept | 139 / 139 | same | same |
| (d) GitHub work, Hindsight memory, no Salesforce, no SOUL.md | 82 / 82 | same | same |
| (e) Notion work, local memory, Salesforce, SOUL.md kept | 203 / 203 | same | same |

One difference in the raw `diff -r`, in every combination without Salesforce:
the old steps delete `.codex/hooks.json` and leave an empty `.codex/` folder;
the new steps never make it. Git keeps no empty folder, and the settings
snippet step puts `.codex/hooks.json` back in every project, so no project
differs. The comparison above was run again with empty folders removed from
both copies. The raw diffs are in the scratch folder
`.../scratchpad/build-1a/runs/<combination>/diff-raw.txt` (temporary).

## 3. Codex lists only the plugin's own skills

Method: `dev/test-runs/codex-dot-folders.md` in Git history (commit
`6d293c0`). Scratch `CODEX_HOME` and a scratch folder; no sign-in and no
model call, because `codex debug prompt-input` prints what the model would
see.

```bash
export CODEX_HOME=<scratch>/home
cd <scratch>/empty
codex plugin marketplace add <worktree>      # Added marketplace `toolkit-v2`
codex plugin add toolkit@toolkit-v2          # Added plugin `toolkit`, version 0.8.16
codex debug prompt-input > prompt-input.json
```

The installed copy holds all 22 `SKILL.md` files. The model's skill list has
two entries from the plugin: `toolkit:choosing-outside-tools` and
`toolkit:project-setup`. None of the 20 project skills is listed. (The other
five entries are Codex's own and `neon-postgres` from `~/.agents/skills`.)

Control: the same plugin in a second scratch marketplace and a second
scratch `CODEX_HOME`, with every `.claude` folder under `assets/` renamed to
`claude-renamed`. The list then holds 22 skills from the plugin, for example
`toolkit:braindump` at
`r2/project-setup/assets/every-project/claude-renamed/skills/braindump/SKILL.md`.
So the leading dot of `.claude` is what keeps the project skills out, as the
leading dot of `.shared-skills` did before.

Mike's own `~/.codex` and `~/.toolkit-v2-test-homes/` were not used.

## Not run

- Claude Code loading: whether the new `claudeMdExcludes` patterns in
  `.claude/settings.json` still stop the setup folders' `CLAUDE.md`,
  `AGENTS.md`, and rules from loading in a toolkit session was not tried in a
  live session. The new patterns follow the old ones (the folder, its rules,
  and the memory folder).
- No live setup session (project-setup run by an agent in Claude Code or Codex)
  was run on the new instructions; the equivalence test follows the new
  commands by hand.
