# Close-out 2026-09-28

Reviewed on 2026-09-28, 23:20 to 23:35 EDT, by a reviewer who built none of
this. The re-review of 19:36 and the first review of 12:30 follow below
unchanged.

State reviewed: commit `51911ac` plus 165 changed files and 12 new files or
folders in the working tree, none of them committed. Versions: `toolkit`
0.2.9, `work` 0.2.11, `memory` 0.2.9, `session-skills` 0.2.9,
`git-workflows` 0.2.8, `sf-architect-solutioning` 0.2.1, marketplace
metadata 0.2.11. No file under `plugins/` changed after 22:10 EDT. The three
close-out checks started at 22:13 and 22:15 EDT, so their evidence describes
the code as it is now.

No toolkit code or skill was changed. Nothing was staged or committed. This
close-out changed only this file in the repository. Every result below comes
from a command run in this close-out, unless it names an evidence file.

## Verdict

- The goal is not met yet. R-B1 is still open. In the Codex rerun, after
  "No agent team for this one, I'll lead it myself", the agent asked Mike
  "Do you approve the WI-001 result with that check outstanding?" with no
  independent check (`closeout-codex` s10). It had read the new `work-check`
  text and the new `toolkit work set --stage 11-user-approval` note. This
  breaks Mike's decision of 2026-09-28 evening (1).
- The `toolkit` command only prints notes about the check. In a scratch
  project it recorded a result approval, and then finished the item as Done,
  with no check recorded.
- Concept memory is built and works in all three backends. In the Codex
  rerun, three preferences said in three sessions landed in one file as
  three sections. One medium bug (C1, reproduced here) can put a fact into an
  unrelated concept.
- R-I1 and R-I3 are done. R-I4 is fixed as the re-review asked (a note), but
  in the live rerun the record still said "Approved by Mike Rihm" until Mike
  said no. R-I2 is back: the close-out work is not committed, and Mike's
  installs run versions that no commit holds.
- The Claude Code rerun did not run. `claude auth status` still printed
  `"loggedIn": false` at 23:27 EDT.

## Checks run in this close-out

| Check | Result |
| --- | --- |
| `node --test "tests/**/*.test.mjs"` in `plugins/toolkit` | 979 tests: 976 pass, 0 fail, 3 skipped (slow `find --reflect`, Lore clone compare, live Notion), 99 seconds. The Hindsight live tests ran against `127.0.0.1:8888`, which reported healthy. |
| `node --test "plugins/git-workflows/tests/*.test.mjs"` | 14 pass, 0 fail. |
| `node dev/tools/check-skills.mjs --quiet` | Exit 0. 29 `SKILL.md` files, 205 files in `references/`, `assets/`, and `scripts/` (159 generated copies), 7 agent files, 683 `toolkit` commands; 0 failures, 0 warnings, 16 notes (the recorded `sf-architect-solutioning` and `sf-component-tracker` exceptions). |
| `node dev/tools/sync-skill-references.mjs --check` | Exit 0. 159 copies, 0 problems. |
| `node dev/tools/import-model.mjs --check` | Exit 0. The copy matches the approved model folder (112 files, commit `648bf4e`). Every `CONDITIONS.json` rule matches. |
| `claude plugin validate .` and `claude plugin validate ./plugins/<each>` | Passed for the marketplace and all six plugin folders (Claude Code 2.1.280). |
| Manifests | Both manifests of each plugin carry the same version. Both marketplace files list all six plugins. `HEAD` holds `toolkit` 0.2.7, `work` 0.2.9, `memory` 0.2.7. |
| Mike's installs (read only) | `~/.config/toolkit-v2/plugin-root` names `~/.claude/plugins/cache/toolkit-v2/toolkit/0.2.9`; `~/.local/bin/toolkit version` prints 0.2.9. The Claude Code 0.2.9 cache copy and the newest Codex cache copy of each plugin equal their source folders (`diff -rq` printed nothing). `installed_plugins.json` records commit `51911ac` for the 0.2.9 installs, and that commit holds 0.2.7. |
| Acceptance check in a scratch project (`HOME`, `CLAUDE_CONFIG_DIR`, `CODEX_HOME`, `TOOLKIT_V2_CONFIG_DIR` in scratch; local tracker, built-in memory) | `work set WI-001 --stage 11-user-approval`: prints the note. A history note "acceptance-checker: none, owner requested no agent team" does not count: `work decisions` still lists "Start one acceptance-checker for WI-001". `work approve WI-001 --result --by 'Mike Rihm'`: approval recorded, note printed, exit 0. `work finish WI-001 --by 'Mike Rihm' --evidence 'Tests pass'`: "WI-001 is Done", with no word about the missing check. |
| Concept memory, same scratch project | A new concept plus a second `--concept ... --section` save gave one file, `feedback_ways_of_working.md`, with a `# Ways of working` title, a summary, `updated: 2026-09-28`, and two `##` sections. `MEMORY.md` groups by prefix and shows title, summary, and updated date. A related fact in other words ("Write tests with node:test, no npm packages") was saved as a new file, `feedback_test_runner.md`: the duplicate check compares words only, so choosing the concept is the agent's job. |
| C1, reproduced | With `project_output_format` (title "Output format", sections "Lines" and "Who reads it"), saving "Owner finds status tables easier to read than bullet lists" as a new project record was refused: "it belongs in the concept project_output_format ("Output format"), which shares its words (read)". `proposalType('you find tables easier to read than bullets in status replies')` returns `project`. |
| R-I4 hooks, both hosts | `toolkit hook user-prompt` with "FYI, I only ever run tipcalc on my MacBook Air with Node 24.", then `toolkit hook post-tool` for `toolkit memory save ... --approved-by 'Mike Rihm'`: the note "This save says Mike Rihm approved it (--approved-by), but his message this turn has no keep phrase ...". A note only: no block, and the record is not changed. |
| R-M3 | `toolkit doctor` in a plain folder prints "Warning:" before each computer line and "None of these blocks toolkit init." |
| R-M9 | `postgres://admin:<password>@db.example.com:5432/app` refused, exit 2. |
| R-M10 | `toolkit hook pre-tool`, both hosts: `rm -rf .memory` and `rm -r .work-items/` denied; `rm -rf /tmp/x` let through. |
| R-M11 | Search of the 7,198 tracked and new files, captured docs left out: only descriptions of the no-credit rule, in `dev/research/project-init-library.md` and `dev/test-runs/skill-references-check.md`. Nothing under `plugins/`. |
| F1 | `plugins/toolkit/lib/memory/hindsight.mjs` line 497 still builds the find snippet with `.slice(0, 160)`. |
| Read-only sources | `claude-toolkit` clean at `9d4ea8d`. Mike's model folder clean at `efa2440`. The approved branch head is `648bf4e` by Mike Rihm <michael@rihm.com>, no AI credit, three files under `.memory/`. |
| Hindsight | Healthy. 24 banks, the same list as the re-review. This close-out made none. |
| Claude Code sign-in | `claude auth status`: `"loggedIn": false` at 23:27 EDT. |

## Close-out evidence

| Evidence | Result | What it shows |
| --- | --- | --- |
| `closeout-codex/evidence.md` | Not passed | 34 real `codex exec` turns on the current versions; each Codex cache copy equal to its source before and after. Setup asked six questions in the reply text. WI-001 and its sub-item WI-002 reached Done; the hand rename was reported. Every concept-memory check passed. Backups after each `work finish`. All five hooks ran; no `hook-errors.log`; no AI credit in `git log`. Failed: R-B1 (s10) and R-I4 (s24). Could not happen: the delivery offer, because the small-item rule recorded owner-led in s07, before the plan and the split. |
| `closeout-claude/evidence.md` | Not run | Claude Code is signed out; s01 ended before any model turn. The project, backup folder, harness, and message plan are ready. A command-only check found C1 and C2. |
| `concept-memory-backends.md` | Passed | One script in built-in, Notion (Lore layout, under Mike's real page), and Hindsight. Notion: 28 of 28 steps and 4 of 4 hand-edit steps equal to built-in, with the same stored text and SHA-256 versions. Hindsight: 25 of 28; the 3 differences are `memory find`, which searches by meaning by design, plus F1. |

I read the three evidence files and confirmed their key lines in the session
files: s10 records "acceptance-checker: none, owner requested no agent team"
and ends "Do you approve the WI-001 result with that check outstanding?";
s17 records "acceptance-checker: R-01 met on exact commit with no defects"
before s18 runs `toolkit work approve WI-001 --result`; s24 shows the
PostToolUse note after the `--approved-by` save. No turn called a question
tool: every mention of `request_user_input` in the session files is skill
text the agent read.

## Finish items

| # | Item | Verdict | Evidence |
| --- | --- | --- | --- |
| 1 | Model review | Met | `dev/model-review.md` is current (re-review). The import check passes at `648bf4e`, which adds concept memory to the model branch (`dev/model-changes.md` line 603). The parity tests pass in the suite. Merging the model branch is Mike's step. |
| 2 | Plugins | Met | Validation passes for the marketplace and all six plugin folders. Both marketplace files list all six. The installed 0.2.9 copies equal the source. |
| 3 | Project init | Met | Scratch init here. Codex rerun s00a to s00h: six questions, one per turn, in the reply text, the backup folder included. Notion-only projects skip the backup question (`project-setup/references/interview.md` line 126, `lib/project/backup.mjs` line 449, `tests/notion/close-out.test.mjs`); not seen live, because no Notion setup ran after this change. |
| 4 | Work items | Met | Codex rerun: WI-001 from `01-discovery` to Done, WI-002 made by a split, the hand rename reported in s10. All four setups in the final runs (re-review). |
| 5 | Skills | Met, one gap | check-skills and the sync check pass. No skill description changed in this round (the `SKILL.md` diffs hold no `description:` line). Gap: R-M8, the routing rerun, is still not done. |
| 6 | Hooks | Met, two gaps | 976 tests pass; each hook fix is tested with both hosts' inputs. All five hooks ran live in the Codex rerun on the current code. Gaps: the current hook code has not run in a live Claude Code session (sign-in), and trusting the hooks in Codex `/hooks` is still untried (every run used `--dangerously-bypass-hook-trust`). |
| 7 | Notion | Met | Re-review evidence, plus concept memory on Mike's real page: one Memories row per concept, and a rename keeps the same page. Open: F2. |
| 8 | Hindsight | Met | Healthy. Concept check: one document per concept, HTTP 404 for the old key after a rename, test bank deleted. Open: F1 (low). |
| 9 | Sample runs | Partly met | All four setups reached Done on 0.2.7 (re-review). On the current code only the Codex local run ran, and it did not pass (R-B1, R-I4). The Claude Code rerun did not run. |
| 10 | Fixes and final review | Not met | R-B1 is open, and the close-out work is not committed (R-I2). |
| 11 | Report | Not met yet | The lead gives it after this review. |

## The re-review's findings now

| Finding | Done? | Evidence |
| --- | --- | --- |
| R-B1. "No agent team" skips the acceptance check | Not done | The text is fixed: no "authorizes no helpers" or "means no helpers" is left under `plugins/`; `work/shared/helpers.md` section 6, `work-delegate/SKILL.md` lines 26, 43, and 52, and `work-check/SKILL.md` lines 35 and 60 say the check always runs. The notes print (tried here). But the live Codex rerun skipped the check in the build turn and asked for approval. `work-decide` caught it one session later (s17), before Mike approved (s18). If Mike had answered s10 with "I approve", the command would have recorded it, and `work finish` would have closed the item with no check. |
| R-I1. Claude Code runs this folder in place | Done | `AGENTS.md` "Versions", `README.md` "Install on this Mac", the `refreshPointer` comment in `lib/project/machine.mjs`, and `repair-and-update.md` line 105 now say so. Mike's decision (install his everyday Claude Code from a fixed copy) is still open. |
| R-I2. Work not committed | Done for the earlier rounds, back now | `82aefe9` committed the earlier fix rounds and the final run evidence. Now 165 changed files and 12 new ones are uncommitted: `lib/memory/concepts.mjs`, 8 new test files, and the three close-out evidence items among them. Mike's installs run 0.2.9, and no commit holds 0.2.9. |
| R-I3. Codex setup used the question box | Done | `project-setup/SKILL.md` step 3 and its first Gotcha. Codex rerun: all six setup questions in the reply text. |
| R-I4. A remark in passing saved as approved | Fixed as asked; the problem remains | The PostToolUse note fires in both hosts (tried here; live in s24, where the agent then told Mike and asked "Save to memory: ...?"). But the record said "Approved by Mike Rihm" until he said no and ran the delete himself (s25). Had he not answered, the false approval would have stayed. |
| R-M1 to R-M7, R-M9 to R-M11 | Fixed | Builders' tests pass. Spot-checked here: R-M3, R-M9, R-M10, R-M11. |
| R-M8 | Open | Routing not rerun. |
| R-M12 | Open, Mike's yes | Same 24 banks. Add the Notion row "Toolkit V2 concept memory check (safe to delete)" (key `tv2-concept-check`). |

Decisions of 2026-09-28, evening: (1) the acceptance check always runs: in
the text and the notes, not in behavior (R-B1). (2) Notion-only projects skip
the backup question: in the text, code, and tests; not seen live.

## Concept memory

Done for what Mike asked, with one medium bug and one type decision open.

What Mike asked, and where it is shown:

- One file per concept, the five prefixes kept: `user_working_preferences.md`
  (three sections from s02, s08, s21) and `project_money_calculation.md` in
  the Codex rerun; `feedback_ways_of_working.md` in the scratch project here.
- Title, one-line summary, and updated date at the top of each file: the
  scratch file here; `MEMORY.md` in the rerun.
- New facts under a `##` heading in the concept they belong to; a new file
  only for a new concept: `toolkit memory save --concept <key> --section
  <heading>`, and the duplicate check names the concept ("it belongs in the
  concept ...").
- Events stay one file each: `suggestConcept` never suggests a concept for
  an event (`lib/memory/concepts.mjs` line 427).
- No starter files: the scratch `.memory/` held only the model's files until
  the first save.
- The index lists title, summary, and updated date, grouped by prefix: here
  and in the rerun.
- Built-in, Notion, and Hindsight store and change concepts the same way
  (`concept-memory-backends.md`). Links between concepts keep their section
  anchor through a rename.
- The model changed only in `.memory/` (three files, commit `648bf4e`).

Open:

- **C1 (medium, reproduced here).** One shared word in a concept's title or
  a section heading scores 2, which is `SUGGEST_AT`, so it is enough to
  suggest that concept. `proposalType` types "you find ..." as `project`.
  Together, the Stop hook can file a preference about status replies under
  an unrelated project concept, and Mike's plain yes, recorded with `toolkit
  memory approve`, puts it there. Fix: suggest a concept only on two or more
  shared words, at least one in its key or title; type "you find", "you'd
  rather", and "easier for you" as `user`.
- **C2 (Mike's decision).** "How I like work done" can land in `user_` or
  `feedback_`. The Codex rerun put all three preferences in `user_`; the
  command-only check in `closeout-claude` put them in `feedback_`. A concept
  holds one type, so a proposal typed `user` cannot be approved into a
  `feedback_` concept. Needs one written rule in the model's
  `memory-criteria.md` and in `proposalType`. Recommendation: how the agent
  should work goes in `feedback_` (the goal's own example is
  `feedback_ways_of_working.md`); facts about Mike himself go in `user_`.
- **Codex rerun finding 4 (medium).** A keep-phrase fact about why a part of
  the project exists (the Friday dinners, s06) went only into the work item,
  which is now Done, so no memory holds it.
- **Low:** the Stop hook's proposal does not record that Mike stated the fact
  (rerun finding 5); an approved proposal's heading is the whole sentence
  (6); a summary left stale for one session (9); "Always" gets no keep-phrase
  line (10); the hook state counts `toolkit memory save --help` as a save
  (11); F1, the Hindsight find snippet; undoing a removed section does not
  restore links to its heading (builder's note).
- **F2 (decision).** In Notion, links between concepts are saved as file
  links (`project_invoicing.md`), not Notion page links, so a click in the
  Notion app will likely not open the other page. Not tried in the app.
- The builders' question on the "belongs in the concept" refusal (exit 2):
  keep it. It saves nothing, the message says so, and it prints the command
  that adds the fact to the concept.
- Not yet seen in a live Claude Code session.

## Before the goal can be called met

1. **R-B1 in code.** Recommended: `toolkit work approve --result` refuses
   (exit 2) when no "acceptance-checker: <verdict>" history note follows the
   last move to stage 08 or 10, and prints the command that records one.
   Allow a skip only with a flag that carries the reason: a host with no way
   to start a worker, or Mike's own words changing his decision. `toolkit
   work finish` refuses the same way. The command runs the same in both
   hosts, while a Stop hook would have to guess from the reply's wording.
   Then run the owner-led build turn again in Codex.
2. **Commit** the close-out work and evidence, paths staged by name,
   `lib/memory/concepts.mjs` and the new test files included. The lead does
   this.
3. **The Claude Code rerun**, after Mike runs `claude auth login`. It also
   answers the open question in `closeout-claude`: which setup skill answers
   "Set up this project with the toolkit." when the old `project-init`
   plugin is loaded too.
4. Recommended, not blocking: the C1 fix; R-I4 in code (the PostToolUse
   hook or `toolkit memory save` turns such a save into a proposal); look at
   the delivery offer again after the plan exists and when a sub-item is
   added (rerun finding 3).

## For Mike

- Run `claude auth login` in a terminal, so the Claude Code rerun can go.
- Decide C2: which prefix "how I like work done" uses.
- Decide F2: file links or Notion page links between concepts in Notion.
- Still open from the re-review: trust the V2 hooks in Codex `/hooks`; merge
  the model branch `toolkit-v2/approved-changes` (now with `648bf4e`);
  install your everyday Claude Code from a fixed copy (R-I1); yes or no to
  deleting the test banks and Notion test rows (R-M12), now also
  `tv2-concept-check`; the model's guard message with two periods.

## What this close-out left behind

- A scratch project and a scratch home in this session's scratch folder
  (`scratchpad/closeout/`). Nothing was written to Mike's `~/.claude`,
  `~/.codex`, `~/.config/toolkit-v2`, Notion, Hindsight, the model folders,
  or `claude-toolkit`.
- This close-out changed only this file in the repository.

---

# Re-review 2026-09-28

Reviewed on 2026-09-28, 19:36 to 19:55 EDT, by a reviewer who built none of
this. The first review, from 12:30 to 13:20 the same day, follows below
unchanged.

State reviewed: commit `3adb722` plus 159 changed files and 7 new files in the
working tree, none of them committed. Versions: `toolkit` 0.2.7, `work` 0.2.9,
`memory` 0.2.7, `session-skills` 0.2.7, `git-workflows` 0.2.7,
`sf-architect-solutioning` 0.2.1, marketplace metadata 0.2.9. These are the
versions the five final runs used and the versions installed in Mike's Claude
Code and Codex. No file under `plugins/` changed after 18:04 EDT; the final
runs started at 18:06 EDT (22:06 UTC). So the final run evidence describes the
code as it is now.

No toolkit code or skill was changed. Nothing was staged or committed. Every
result below comes from a command run in this re-review, unless it names an
evidence file.

## Verdict

- Mike can use Toolkit V2 today in Claude Code and Codex, in all four setups.
  All five final runs took a work item from start to Done on the current code.
- One finding still blocks calling the goal met (R-B1). When Mike says "no
  agent team", the agent skips the independent acceptance check. This
  happened in 3 of the 5 final runs. It is the reason `final-codex-local` did
  not pass, and its cause is still in the shipped text.
- Of the first review's 20 findings: 14 are fixed, 4 are partly fixed, 1 waits
  on Mike (M3), and 1 was wrong (I2). The change made for I2 made
  `AGENTS.md` and `README.md` wrong (R-I1).
- New in this re-review: 4 important findings and 12 minor ones. Each has a
  fix.

## Checks run in this re-review

| Check | Result |
| --- | --- |
| `node --test "tests/**/*.test.mjs"` in `plugins/toolkit` | 928 tests: 925 pass, 0 fail, 3 skipped (slow `find --reflect`, Lore clone compare, live Notion), 91 seconds. The Hindsight live tests ran against `127.0.0.1:8888`. |
| `node --test "plugins/git-workflows/tests/*.test.mjs"` | 14 pass, 0 fail. |
| `node dev/tools/check-skills.mjs --quiet` | 29 `SKILL.md` files, 205 files in `references/`, `assets/`, and `scripts/` (159 of them generated copies), 7 agent files, 649 `toolkit` commands checked; 0 failures, 0 warnings, 16 notes. All 16 are recorded exceptions: 14 ported `sf-architect-solutioning` references without a Contents list (body unchanged, as Mike approved), and the step placement in the two copies of the model's `sf-component-tracker` skill. |
| `node dev/tools/sync-skill-references.mjs --check` | 159 copies, 0 problems. |
| `node dev/tools/import-model.mjs --check` | The copy matches the approved model folder (112 files, commit `5e7d7a0`). Every `CONDITIONS.json` rule matches. |
| `claude plugin validate .` and `claude plugin validate ./plugins/<each>` | Passed for the marketplace and all six plugin folders (Claude Code 2.1.280). |
| A copy of the tree as it would be committed (`git ls-files --cached --others --exclude-standard`, 605 files) in a scratch folder, then `node --test "tests/scaffold/*.test.mjs"` | 77 tests: 76 pass, 0 fail, 1 skipped. The Git-ignored template folders `scaffold/model/.memory/` and `.work-items/` are tracked and arrive. |
| Manifests and caches | Both manifests of each plugin carry the same version. Both marketplace files list all six plugins. Each Codex cache copy in `~/.codex/plugins/cache/toolkit-v2/` equals its source folder, except `toolkit`'s `tests/notion/final-confirm.test.mjs`. |
| `toolkit init` in scratch Git repositories (`HOME`, `CLAUDE_CONFIG_DIR`, `CODEX_HOME`, `TOOLKIT_V2_CONFIG_DIR` in scratch) | p1 local and built-in: done. p2 local, built-in, Salesforce: 114 files. p3 GitHub Issues, Claude Code only: doctor clean, no pointer warning. p4 Jira, Salesforce, Codex only: 105 files, no `CLAUDE.md`. p5 Notion with no root page known: refused, nothing written. p6 local and Hindsight: 29 files and a new bank (see "What this re-review left behind"). p1's `AGENTS.md` and rules name no Salesforce path. |
| `toolkit work approve WI-001 --requirements` while the Agreed goal holds template text | Refused. The fix line uses single quotes, `'Owner said: <quote>'`, and "write an apostrophe as ’". |
| `toolkit hook pre-tool --host claude` fed with 31 commands | Refused: a merge, a tag, a Git note, a commit, `gh release create` and `edit`, `gh issue create` and `comment`, and `gh pr comment` that carry an AI credit line; `git add -A`, `git add .`, `git add -A src/`; `git clean -fdx`; `git push --force` and `--force-with-lease`. Let through: a human co-author, "generated with make", `git clean -fd`, `git stash`, `git add src/a.js tests/`, `npm test`, `npx prettier --write "**/*.md"`. Also let through: `rm -rf .work-items` and `rm -rf .memory` (R-M10). |
| `codex execpolicy check --rules plugins/toolkit/templates/codex/toolkit.rules` | `toolkit machine-setup`, `memory delete`, `memory import`, `import`, `hindsight service install`, and `start`: "prompt". `toolkit work list` and `memory save`: "allow". `toolkit --json memory delete k` is "allow" by the rules, and the CLI refuses that form (`lib/cli.mjs` line 351). |
| Claude Code ask-first rules | `templates/settings/claude-toolkit.json` has the same five commands under `permissions.ask`. The captured `settings-reference.md` (line 1518): deny rules first, then ask, then allow; the first match decides. |
| `toolkit memory save` with secrets, in scratch p1 | An `sk-ant-` key, "The admin password is ...", and a `ghp_` token: refused, exit 2. A password inside a database address (`postgres://admin:<password>@...`): saved (R-M9). |
| `compareRecords` on the first review's I6 pair | `{"description":0.625,"body":0.625,"similar":true}`. |
| Hook run time outside a V2 project | 0.06 to 0.09 seconds for each of the five hooks. |
| Search of the 6,664 tracked and new files for AI credit lines | Found only in test inputs, the captured Claude Code docs, this file's first review, `dev/research/project-init-library.md`, `dev/test-runs/skill-references-check.md`, and `dev/test-runs/confirm-claude-local/` (R-M11). |
| Secret search of the same files | Only the fake keys in two test files. |
| Read-only sources | `claude-toolkit` clean at `9d4ea8d`. Mike's model folder clean on `main` at `efa2440`. The approved branch head is `5e7d7a0`. |
| Issue 419 | The note linking Toolkit V2 is in its comments. |
| Hindsight | `/health` healthy. 24 banks (R-M12). |
| Mike's installs (read only) | `~/.config/toolkit-v2/plugin-root` names `~/.claude/plugins/cache/toolkit-v2/toolkit/0.2.7`. `~/.local/bin/toolkit version` prints 0.2.7. This review session's `PATH` holds `/Users/michaelrihm/Documents/Projects/toolkit-v2/plugins/toolkit/bin`, while every `claude-toolkit` plugin `bin` on it is under `~/.claude/plugins/cache/` (R-I1). |

## The first review's findings now

| Finding | Now | Evidence |
| --- | --- | --- |
| B1. No live pass on the current code | Mostly fixed | Five final runs on 0.2.7: four passed, `final-codex-local` did not (R-B1). |
| I1. Any session could point `toolkit` at any copy | Fixed | `refreshPointer` in `lib/project/machine.mjs` runs only inside a V2 project, writes only a complete installed copy, prefers a cache copy, and never replaces a newer version. The wrapper also needs `scaffold/CONDITIONS.json`. The pointer names the 0.2.7 cache. |
| I2. "Claude Code reads the plugins in place" | The finding was wrong | Claude Code does read a directory marketplace in place. The texts changed for I2 are now wrong (R-I1). |
| I3. Codex-first setup could not work | Fixed | `README.md` Codex steps end with `node .../bin/toolkit machine-setup` and say what it changes. |
| I4. Risky `toolkit` commands ran without asking | Fixed | See the two ask-first rows above. |
| I5. An unanswered "Save to memory?" was dropped | Fixed | The Stop hook saved the proposal live in all five final runs. |
| I6. Duplicate check missed a rewording | Fixed | Pair above. A copy in wholly other words is still saved (a design limit; `final-codex-hindsight` F3). |
| I7. `'\''` in Codex | Fixed | The skills teach ’ in Codex; `pre-tool.mjs` adds a note for `'\''` and for an unmatched quote. No quoting failure in any final Codex run. |
| I8. No backup on day one | Fixed | Setup asks for a backup folder; `work finish`, handoff, and a daily session start back up. Seen in four final runs. With a Notion tracker and Notion memory nothing is copied, and the toolkit says so; whether to export is Mike's decision. |
| M1. AI credit guard missed merges, tags, releases, issues | Fixed | Pre-tool table above. |
| M2. Memory accepted a secret | Mostly fixed | R-M9. |
| M3. Test banks on Mike's Hindsight server | Waits on Mike | Now 24 banks (R-M12). |
| M4. Doctor pointer warning in a Claude Code-only project | Fixed | p3. The message names the real pointer path. |
| M5. Salesforce paths in a non-Salesforce `AGENTS.md` | Fixed | p1. |
| M6. Double quotes in CLI fix lines | Fixed | Approve row above. |
| M7. Two routing findings | Partly fixed | O27: settled by decision 6. O21: the `work-on` sentence is in (step 3, and a gotcha), but the routing messages were not run again (R-M8). |
| M8. `model-review.md` out of date | Fixed | "Updated 2026-09-28"; names head `5e7d7a0`. |
| M9. Evidence quotes AI credit lines | Partly fixed | `claude-a` and `open-bugs.md` are fixed; `confirm-claude-local` is not (R-M11). |
| M10. Codex hook trust hash | Fixed in code | `recordCodexHooksSeen` and doctor compare the hooks file hash. Not tried live: Mike has not trusted the hooks yet. |
| M11. `memory-find` named another plugin's file | Fixed | `memory-find/references/tracker-github.md` and `tracker-jira.md`. |

## Final run evidence

| Run | Host | Setup | Result | Open findings |
| --- | --- | --- | --- | --- |
| `final-claude-local`, round 2 | Claude Code | local, built-in | Passed | 4 low |
| `final-codex-local`, round 2 | Codex | local, built-in | Not passed: the acceptance check was skipped under owner-led delivery | R-B1, 1 low |
| `final-codex-hindsight`, round 2 | Codex | local, Hindsight | Passed | 4 low |
| `final-codex-salesforce`, round 2 | Codex | local, built-in, Salesforce | Passed | 2 medium (question box; acceptance check), 7 small |
| `final-notion`, round 2 | Codex and Claude Code | Notion tracker and memory, on Mike's real page | Passed | 1 medium (a passing remark saved as approved); acceptance check skipped; 3 low |
| `install-everyday.md` | Both | Mike's own installs | `toolkit` on in every folder; the other five only in V2 projects | Finding 1: Claude Code reads this folder in place |

In all five runs: a work item from `01-discovery` to Done with Mike's
approvals, a sub-item made by a split, a hand move or rename that the next
session reported, a preference saved and found in a later session, an
unanswered "Save to memory?" saved as a proposal by the Stop hook and then
approved or rejected, "Where are we?" and "What do you need from me?", a
handoff, all five hooks seen, no `hook-errors.log`, no AI credit line in any
commit, and no `toolkit` command that waited on a hidden prompt.

## Finish items

| # | Item | Verdict | Evidence |
| --- | --- | --- | --- |
| 1 | Model review | Met | `dev/model-review.md` is current. The import check passes. The parity test installs all 24 setups and passes, also from a copy of the tree as it would be committed. Merging the model branch is Mike's step. |
| 2 | Plugins | Met | Validation passes for the marketplace and all six plugin folders. Both marketplace files list all six. Installed in Mike's Claude Code and Codex (`install-everyday.md`). |
| 3 | Project init | Met | Six setups in this review; the `project-setup` interview in all five final runs. Rules, the Plain English style, and Salesforce parts install as chosen. |
| 4 | Work items | Met | Local: all four local runs. Notion: `final-notion` on Mike's real page (stages, sub-item, Notion hand move and rename, Solution Design page renamed on the next sync). GitHub Issues and Jira: written instructions only, as Mike decided. |
| 5 | Skills | Met, one gap | `dev/SKILL-INDEX.md` covers 26 skills and 7 agents; check-skills passes; routing round 3 plus a 16 of 16 spot check in each host after the skill references work (`skill-references-check.md`). Gap: R-M8. |
| 6 | Hooks | Met, one gap | 925 tests pass. All five hooks ran in real Claude Code and real Codex sessions in the final runs. Gap: every Codex run used `--dangerously-bypass-hook-trust`, so trusting the hooks in `/hooks` has not been tried. That is Mike's step. |
| 7 | Notion | Met | `notion-after.md`, `lore-layout.md`, and `final-notion` round 2: `ensure-root` passed on Mike's real page, each project row has its own Work Items database (board by stage, sub-items) and a Memory page in Lore's layout. Left for Mike: the look in the Notion app (open bug 70) and R-M12. |
| 8 | Hindsight | Met | The service is healthy on `127.0.0.1:8888`. `final-codex-hindsight`: its own bank, a memory saved and found, clean deletes checked in the bank. |
| 9 | Sample runs | Partly met | All four setups ran to Done on the current code. Four of five runs passed; `final-codex-local` did not (R-B1). |
| 10 | Fixes and final review | Not met | R-B1 is open, and the fixes are not committed (R-I2). |
| 11 | Report | Not met yet | The lead gives it after this review. |

## Decisions of 2026-09-28

| Decision | Verdict |
| --- | --- |
| (1) One requirements folder per area | Kept: `requirements/account-ranking/ACCOUNT-RANKING.md` in `final-codex-salesforce`. |
| (2) No `git fetch` without a remote | Kept: "No remote" in every final run's `publish-docs`. |
| (3) In Codex the owner runs sandbox deploys | Kept: `final-codex-salesforce` s08. |
| (4) Template guides say "copy this file" | Kept in the scaffold copy (`tests/TEST-PLAN-TEMPLATE.md`, `system-guide/AREA-TEMPLATE.md`, and others). |
| (5) Salesforce questions go to `sf-architect-solutioning` | Kept: the scaffold's `AGENTS.md` line 25. |
| (6), (9) Salesforce skill wording | Kept: model commit `9a2a69b`. |
| (7), (8) No deploy scripts; pipeline deploys guarded | Kept: `salesforce-org-safety.md` and `tests/scaffold/org-guard.test.mjs`. |
| (10), (11) `toolkit` on in every folder; installed in Mike's hosts | Kept (`install-everyday.md`). In Claude Code it runs from this folder (R-I1). |
| (12) Risky commands ask first in both hosts | Kept. |
| (13) Backup folder and automatic backups | Kept. Notion projects: Mike's open decision. |
| Goal adjustment: what must happen every time lives in the `toolkit` command or a hook | Not kept for the acceptance check (R-B1) or for memory approval (R-I4). |
| Skills carry their own procedures in their own folders | Kept: every reference linked, 159 generated copies in step. |

## Findings of this re-review

### Blocking

**R-B1. "No agent team" still skips the independent acceptance check.**

- Evidence: `final-codex-local` s09: "The owner-led delivery choice also
  ruled out helpers, so no independent checker will run." That run is "Not
  passed" for this reason alone. The same happened in `final-codex-salesforce`
  s10 and `final-notion` s08. Only `final-claude-local` ran the check (s06).
  Round 1 found the same, and the skill-text fix did not hold.
- Cause, still in the shipped text: `plugins/work/shared/helpers.md` section 6
  says the acceptance checker needs no permission except for "an owner who
  said no to helpers (for example a no to the team question in
  `work-delegate`)", and "A "no" to the team question authorizes no helpers:
  the main agent does the work itself and says that no independent check
  ran". `work-delegate` `SKILL.md` line 43: "A no to the team question means
  no helpers." Mike's words "no agent team" fit both the delivery offer and
  that team question. `team-roles.md` line 58 and `work-check` line 35 say
  the opposite. Nothing in `toolkit work approve --result` checks for an
  independent check.
- Why it matters: a solo developer approves results that no independent agent
  checked, and is told his delivery choice caused it. The goal adjustment of
  2026-09-28 says a step that must happen every time lives in the `toolkit`
  command or a hook.
- Fix: (1) in `helpers.md` section 6 and `work-delegate` line 43, say that a
  no to the delivery offer or to the team question never removes the design
  critic or the acceptance checker; only his words about the check itself do.
  (2) `toolkit work set --stage 11-user-approval` and `toolkit work approve
  --result` print a note when the item's history has no acceptance check
  since its last build. (3) Run the sync tool, raise the versions, and run the
  owner-led part of the Codex local run again. Save the result in
  `dev/test-runs/`.

### Important

**R-I1. `AGENTS.md` and `README.md` say Claude Code runs a cached copy. It
runs this folder in place.**

- Evidence: this review session's `PATH` holds
  `/Users/michaelrihm/Documents/Projects/toolkit-v2/plugins/toolkit/bin`,
  while every `claude-toolkit` plugin `bin` on it is under
  `~/.claude/plugins/cache/`. `installed_plugins.json` names the cache folder
  `.../toolkit-v2/toolkit/0.2.7`, but that is not what runs. The captured
  `plugins-manifest-reference.md` line 178 names "a plugin loaded in place
  from a marketplace added as a local directory". `install-everyday.md`
  Finding 1 and `final-claude-local` s03 show the same. The first review's
  I2 read only `installed_plugins.json`.
- Wrong texts: `AGENTS.md` "Versions" ("Neither reads this folder in place");
  `README.md` "Install on this Mac" ("They do not read this folder
  directly"); the `refreshPointer` comment in `lib/project/machine.mjs`
  ("while the skills and hooks run from a cache copy").
- Why it matters: every saved edit under `plugins/`, committed or not, is live
  in Mike's everyday Claude Code at the next session start: the `toolkit`
  plugin in every folder, all six plugins in V2 projects. Other sessions edit
  this folder. A broken edit to `lib/` makes every `toolkit` hook exit 1: a
  hook error on each tool call in every folder, and no guards in V2 projects
  until it is fixed. Also, in Claude Code the hooks run this folder while the
  `toolkit` command runs the 0.2.7 cache named by the pointer, and the two can
  differ.
- Fix: correct the three texts (Codex runs its cache copy; Claude Code runs a
  directory marketplace in place; the version raise is still needed for
  Codex and for `claude plugin update`). Then a decision for Mike, with this
  recommendation: install his everyday Claude Code from a fixed copy (for
  example a release folder or a Git source), so an unfinished edit here never
  reaches his sessions. That option has not been tested yet.

**R-I2. Two rounds of fixes are not committed, and Mike's installs run them.**

- Evidence: `git status` lists 159 changed files and 7 new ones under
  `plugins/`, including `plugins/toolkit/lib/memory/owner-wording.mjs`, which
  `lib/memory/proposals.mjs` and `lib/hooks/proposal.mjs` import. `HEAD`
  holds `toolkit` 0.2.5; Mike's Claude Code and Codex run 0.2.7.
  `installed_plugins.json` records commit `3adb722` for the 0.2.7 installs.
  The five final run folders and `install-everyday.md` (43 MB) are not
  committed either.
- Why it matters: nothing in Git records what Mike has installed. Another
  session's `git checkout` or `git restore` in this folder would lose it, and
  the evidence the report rests on.
- Fix: commit the fix rounds and the evidence, paths staged by name,
  `owner-wording.mjs` and the new tests included. Read the staged list first.

**R-I3. The Codex setup interview used Codex's question box.**

- Evidence: `final-codex-salesforce` finding 1: five setup questions went
  through `request_user_input_async`. In `codex exec` the box is not shown;
  after 30 seconds the agent wrote "None verified yet" for the build and test
  command itself. `project-setup/references/interview.md` line 20 has the
  rule; `project-setup/SKILL.md` does not. `memory-save`,
  `work-requirements`, and `work-decide` carry it in `SKILL.md`.
- Fix: add "Ask in the reply text, never through a question tool." to
  `project-setup` `SKILL.md` Gotchas. Blocking question tools in Codex is on
  Mike's decision list.

**R-I4. A remark made in passing was saved as approved by Mike.**

- Evidence: `final-notion` finding 1, sP1: "FYI, I only ever run tip-split on
  my MacBook Air with Node 24." had no keep phrase. The agent saved it with
  `--approved-by 'Mike Rihm'` into an existing record, which now says Mike
  approved a save he never approved. The other remarks made in passing in the
  final runs were handled as the skill says: asked first
  (`final-codex-hindsight` s12, `final-claude-local` s11), saved as a
  proposal (`final-codex-salesforce` s10), or kept in the work item's notes
  (`final-claude-local` s10). So this is 1 of 5.
- Why it matters: the approval line is how Mike and later sessions know a
  memory is his. Only skill text holds this rule.
- Fix: the hooks already know whether the turn's prompt had a keep phrase and
  whether the last reply asked "Save to memory: ...?". When a `toolkit memory
  save --approved-by` runs in a turn with neither, the PostToolUse hook tells
  the agent to ask him or to save a proposal instead.

### Minor

**R-M1. The Stop hook makes the agent ask about an open proposal twice.**
`final-claude-local` problem 1. `lib/hooks/stop.mjs` line 205 runs
`looseQuestion()` without checking for a `needs-review` proposal the message
names. Fix: skip that check when the message names an open proposal.

**R-M2. `work-decide` recommends yes to a proposal without evidence.**
`final-claude-local` problem 2. Fix: add the evidence rule from `memory-save`
to `plugins/memory/shared/proposals.md` or to `work-decide` step 6.

**R-M3. Doctor outside a project prints computer findings without their
severity.** `final-claude-local` problem 3; seen again in this review in a
plain folder. The agent then said setup "can't go ahead". Fix: print
"Warning:" before each line in `notProjectReport` (`lib/commands/doctor.mjs`).

**R-M4. A recommendation asked with a question is not saved with it.**
`final-claude-local` problem 4 and `final-codex-local` finding 2. A fresh
session cannot match "go with your recommendation". Fix: write the
recommendation into the Open Questions row.

**R-M5. After a hand rename, `toolkit work show` names a worktree that does
not exist.** `final-notion` finding 3; `lib/commands/work.mjs` line 279 builds
it from the current title. Fix: name the existing worktree on a branch that
starts with `claude/<id>-`.

**R-M6. Replies do not use the skills' fixed lines.** Memory reply lines
paraphrased (`final-codex-hindsight` F1, `final-codex-salesforce` 7,
`final-notion` 5); "Owner said:" rows not word for word
(`final-codex-salesforce` 6); replies with no next step; the finish reply left
out "No automatic backup" (`final-notion` 4). Every record was right.

**R-M7. The Stop hook types an instruction to the agent as `project`.**
`final-codex-hindsight` F2 (`proposalType` in `lib/hooks/proposal.mjs`).
Fix: a summary that starts with a verb to the agent ("Ask", "Use", "Keep") is
`feedback`.

**R-M8. Routing was not run again after two changes.** The `work-on` step 3
sentence for O21 and the shorter `work-decide` description (its "Not for a
bare yes ..." clause was removed in `fe918aa`) came after routing round 3.
The spot check at 15:00 and the final runs routed the phrases they used
correctly. Fix: run the round 3 message set again in both hosts.

**R-M9. `toolkit memory save` accepts a password inside a database
address.** Tested: `postgres://admin:<password>@db.example.com:5432/app` was
saved. Fix: also refuse `scheme://user:password@host`.

**R-M10. The pre-tool hook lets `rm -rf .work-items` and `rm -rf .memory`
through.** Both folders are Git-ignored and exist only on this disk and in
backups. The hook already refuses `git clean -x` for the same reason. Fix:
refuse a recursive delete of either folder in the main checkout, with the
same message.

**R-M11. The AI co-author line is still quoted in committed evidence.**
`dev/test-runs/confirm-claude-local/` (`evidence.md`,
`checks/hookcheck.json`, `harness/hookcheck.py`) and the first review below
quote it. Test files under `plugins/toolkit/tests/` also hold it as guard
input, and they ship with the plugin. Fix: before any GitHub repository,
replace the evidence quotes with "<AI co-author line>", and build the test
input from parts.

**R-M12. Test data on Mike's own services.** Hindsight: 24 banks, all from
tests (`acme-crm` and `acme-crm-2` to `-17`, six `greet-cli-...` banks, and
`proj-p6` from this review). Notion, under his real page: the rows "Toolkit V2
sample (safe to delete)" and two "Toolkit V2 final run (safe to delete)"
(keys `tv2-final-run` and `tv2-final-run-2`), each with its databases. In his
"All Projects" view the registry columns are hidden since a round 1 agent
changed the view with a raw API call. Fix: list each for Mike and remove
each after his yes; showing the columns is his step in Notion.

Also small, from the Salesforce run and in the model, which needs Mike's yes:
the Salesforce guard's message ends with two periods in Codex
(`final-codex-salesforce` 9). An agent left a folder in `/tmp`
(`final-codex-salesforce` 8).

## For Mike

- Trust the V2 hooks in Codex `/hooks`.
- Merge the model branch `toolkit-v2/approved-changes`.
- Decide: install your everyday Claude Code from a fixed copy (R-I1).
- Decide: an automatic export for Notion projects.
- Decide: block question boxes in Codex (R-I3).
- Yes or no: delete the test banks and Notion test rows (R-M12).
- In Notion: show the registry columns in "All Projects", and look at the
  board columns and sub-item nesting (open bug 70).
- The model changes still waiting: the roadmap's two-space line breaks, and
  the guard message's two periods.

## What this re-review left behind

- One empty Hindsight bank, `proj-p6` (0 documents), on Mike's server:
  `toolkit init --memory hindsight` in scratch folder p6 made it, because the
  toolkit always uses the local server. It is on the R-M12 list for Mike.
  Nothing else was written to Mike's `~/.claude`, `~/.codex`,
  `~/.config/toolkit-v2`, Notion, the model folders, or `claude-toolkit`.
- The scratch projects, the scratch home, and the scripts are in this
  session's scratch folder.
- The only file changed in this repository is this one.

---

# Final independent review (finish item 10)

Reviewed on 2026-09-28, 12:30 to 13:20 EDT, at commit `437e754` ("Update
progress notes", on top of `9d21337`, the final fix round). Versions: `toolkit`
0.2.4, `work` 0.2.6, `memory` 0.2.4, `session-skills` 0.2.4, `git-workflows`
0.2.4, `sf-architect-solutioning` 0.2.1, marketplace metadata 0.2.6.

The reviewer built none of this. Every result below comes from a command run
during this review, unless it says "from the evidence of" another run. No
toolkit code or skill was changed. Nothing was staged or committed. Notion was
not called (Notion is signed out).

## Verdict

- No code defect found in this review stops Mike from setting up a project
  with local work items and built-in memory in Claude Code today.
- One item blocks calling the goal met (B1 below): no live session has
  finished the scenario on the current code in the Notion setup, the Claude
  Code setup, or cleanly in the Hindsight setup. The Hindsight confirmation
  run that finished during this review says "Not passed" and names three
  medium problems.
- Eight findings are important, and eleven are minor. Each has a fix.

## Checks run in this review

| Check | Result |
| --- | --- |
| `node --test "tests/**/*.test.mjs"` in `plugins/toolkit` | 844 tests: 841 pass, 0 fail, 3 skipped (slow `find --reflect`, Lore clone compare, live Notion), 81 seconds. The Hindsight live tests ran against `127.0.0.1:8888`. |
| `node --test "plugins/git-workflows/tests/*.test.mjs"` | 13 pass, 0 fail. |
| `node dev/tools/check-skills.mjs --quiet` | 29 SKILL.md files, 7 agent files, 304 toolkit commands checked; 0 failures, 0 warnings, 3 notes. |
| `node dev/tools/import-model.mjs --check` | The copy matches the approved model folder (112 files, commit `54c5520`). Every `CONDITIONS.json` rule matches. |
| `claude plugin validate .` and `claude plugin validate ./plugins/<each>` | Passed for the marketplace and all six plugin folders (Claude Code 2.1.280). |
| Clean clone: `git clone` to a scratch folder, then init and `node --test "plugins/toolkit/tests/scaffold/*.test.mjs"` | Init works from the clone. 75 tests: 74 pass, 0 fail. The Git-ignored template folders `scaffold/model/.work-items/` and `.memory/` are tracked and arrive in a clone. |
| Scratch install in Claude Code (`CLAUDE_CONFIG_DIR=<scratch>`): `claude plugin marketplace add`, then `claude plugin install toolkit@toolkit-v2` | Installed, "disabled by default". Claude Code made a full copy at `<scratch>/plugins/cache/toolkit-v2/toolkit/0.2.4` (see I2). |
| `toolkit init` in new scratch Git repositories, with `HOME`, `CLAUDE_CONFIG_DIR`, `CODEX_HOME`, and `TOOLKIT_V2_CONFIG_DIR` in scratch | See the next table. |
| `toolkit machine-setup` in a scratch home | Wrote the wrapper and pointer, set `enabled = false` for `toolkit@toolkit-v2` in the scratch `config.toml`, and kept the other plugin's lines. |
| `toolkit hook pre-tool` fed with 30 commands and file edits | See I4, M1, and "Hooks" under finish item 6. |
| Codex rules: `codex execpolicy check --rules .codex/rules/toolkit.rules <command>` | Every `toolkit` command is "allow", including `toolkit machine-setup` and `toolkit memory delete ... --owner-approved` (see I4). |
| `git log` of this repository | 22 commits, every one by Mike Rihm <michael@rihm.com>. No `Co-Authored-By` or "Generated with" line in any message. No remote. |
| Secret scan of tracked files (API key prefixes, private keys, bearer tokens, `ntn_`, `ghp_`, `sk-`) | No secret found. |
| Outbound network in shipped code | Only Notion through `ntn` (when chosen) and the local Hindsight server. The Hindsight client refuses any URL that is not on this computer. No other host is called. |
| Read-only sources | `claude-toolkit` working tree clean. The model folder is clean on `main` at `efa2440`; the branch `toolkit-v2/approved-changes` exists. |
| Hindsight service | `launchctl list` shows `local.toolkit-v2.hindsight` running; it listens on `127.0.0.1:8888` only; `/health` says healthy. |

### Setups tried with `toolkit init`

| Folder | Choices | Result |
| --- | --- | --- |
| p1 | local, built-in, not Salesforce, both hosts | 35 files. Doctor: 0 problems (2 warnings about the scratch home). |
| p2 | local, built-in, Salesforce, both hosts | Salesforce rules, guards, `delivery/`, `tools/`, and both copies of the three Salesforce skills. Doctor: 0 problems; asks for the org aliases. |
| p3 | GitHub Issues, built-in, Claude Code only | No `.work-items/`, no `.codex/`. Doctor: 0 problems. |
| p4 | Jira, built-in, Salesforce, Codex only | No `CLAUDE.md`. Doctor: 0 problems. |
| p5, p6 | Notion memory, or Notion tracker, with no Notion root page known | Refused: "no Notion root page is known on this computer yet". Nothing was written. |
| p7 | p2's choices, from the clean clone | The same files as p2. |
| p8 | An existing repository with its own `README.md`, `AGENTS.md`, `.gitignore`, and `.claude/settings.json` (a hook and `"model": "sonnet"`) | Kept `README.md` and `AGENTS.md` (the V2 version went to `.toolkit-cache/AGENTS.proposed.md`); merged lines into `.gitignore` and settings; kept the project's hook and model. Doctor reports the `AGENTS.md` merge as the one problem, as designed. |
| p9 | A folder named `Mike's App (v2)` | Init, `work new`, a hand move into `My Group/`, `work sync`, and doctor all worked. |

In p1 the work commands behaved as the lifecycle says: `work new` and a
sub-item with `--parent`; `work set --stage 03-requirements-approved` refused
("Record that with: toolkit work approve ..."); `approve --requirements`
refused while "Agreed goal" held template text; it passed after the goal and a
requirement were written. Then the item folder was moved and renamed by hand
into `Billing/`, and the sub-item was moved out of it. `toolkit brief` said:
"Moved: WI-001 ... (moved and renamed by hand). It is still a top-level item."
and "Moved: WI-002 ... It is now a top-level item. It was a sub-item of
WI-001."

## Finish items

| # | Item | Verdict | Evidence |
| --- | --- | --- | --- |
| 1 | Model review | Met | `dev/model-review.md` lists the 23 approved changes and an open checklist. The import check passes. The parity test installs all 24 setups and passes. The file is out of date in one place (M8). |
| 2 | Plugins | Met | Validation passes for the marketplace and all six plugin folders. `.agents/plugins/marketplace.json` lists all six for Codex. The Codex copies in `~/.codex/plugins/cache/toolkit-v2/` are the current versions and match the source folders file for file. |
| 3 | Project init | Met, with one documentation gap | Nine setups above. The interview is in `project-setup`. The Codex-first path in `README.md` does not work on a new computer (I3). |
| 4 | Work items | Partly met | Local tracker: checked above. Notion: built and unit-tested; the last live Notion run (`c-notion`, round 3, version 0.2.2) says "not passed", and it has not been run again (B1). GitHub Issues and Jira: written instructions only, as Mike decided. |
| 5 | Skills | Partly met | `dev/SKILL-INDEX.md` covers 26 skills and 7 agents; check-skills passes. Routing round 3: Claude Code 74 of 76, Codex 72 of 76. Two routing findings are still open (M7). |
| 6 | Hooks | Partly met | 841 automated tests pass. All five hooks were seen in real Claude Code sessions (`claude-a`) and real Codex sessions (runs a to d), all on version 0.2.2. On the current version, a real Claude Code session showed only SessionStart and UserPromptSubmit, because the `claude` CLI is signed out (`confirm-claude-local`). The Codex runs used `--dangerously-bypass-hook-trust`, so trusting the hooks in `/hooks` has never been tried. |
| 7 | Notion | Partly met | `notion-after.md`: Mike's page rebuilt, with a Projects database and a showcase project with its own Work Items database and Memory. `lore-layout.md`: the Lore layout, 21 of 21 live checks. Still waiting on `ntn login`: open bugs 68 and 69 on Mike's real page and two live API questions. Open bug 70 (board columns and sub-item nesting seen in the Notion app) is left for Mike. |
| 8 | Hindsight | Met | The service runs as a LaunchAgent on `127.0.0.1:8888`. Each project has its own bank. `d-local-hindsight` saved a preference and found it in a later session. The live Hindsight tests passed in this review. |
| 9 | Sample runs | Partly met | Evidence exists for all four setups. On 0.2.2: a passed, b passed with bugs, c not passed, d passed. On the current code: `confirm-d-hindsight` is "Not passed" (three medium problems, I5 to I7); `confirm-claude-local` could not run. The confirmation runs for a and b were still running when this review ended. |
| 10 | Fixes and final review | Not met yet | 67 of 77 findings are fixed and unit-tested, but not confirmed in live sessions. This review found one blocking item (B1). |
| 11 | Report | Not met yet | The lead gives it after this review. |

## Settled decisions

| Decision (`dev/GOAL.md`) | Verdict |
| --- | --- |
| Local repository; GitHub only after Mike's yes | Kept. No remote. |
| Separate from issue 419, with a note on it | Kept. The note is in the issue's comments. |
| Init copies the model, interviews tracker, memory, and Salesforce, and writes `AGENTS.md` and rules to match | Kept (setups above). |
| Salesforce parts only for Salesforce projects | Kept. One small leak of Salesforce paths into a rules table (M5). |
| Port the session skills, `sf-architect-solutioning`, the Plain English style, the general and Salesforce rules, and the memory system | Kept. |
| Hooks and path-scoped rules set up the documented way | Kept. Hook fields, events, matchers, and the exec form match the captured Claude Code and Codex pages. |
| Instruction files follow the model: one root `CLAUDE.md` holding `@AGENTS.md` | Kept. |
| Same stages, body, and design in every tracker; nesting; hand moves noticed | Kept for the local tracker; Notion awaits a live re-run (B1). |
| Local and Notion trackers fully built and tested | Local: kept. Notion: built, unit-tested, not passed live on the current code (B1). |
| Notion page rebuilt: Projects database; per-project Work Items and Memory | Partly (finish item 7). |
| Memory options: built-in, local Hindsight, Notion | Kept. |
| Notion memory in Lore's layout | Kept. |
| Routing approvals (handoff rule wording, two `AGENTS.md` routing lines, bigger skill list budget) | Kept. The generated `AGENTS.md` has both routing lines; settings carry `"skillListingBudgetFraction": 0.02`. |
| Memory additions (proposals, duplicate check, clean deletes, memory test set) | Built, and the test set passes for all three backends. Two of them failed live on the current code (I5, I6). |
| Skill descriptions follow the official guidance | Kept. |
| Hindsight self-hosted, no Docker, no Hindsight Cloud | Kept. The client refuses a URL that is not local. |
| The model is the exact source; a re-runnable copy step | Kept (import check). |
| The 23 approved changes on a branch of the model | Kept. Mike's `main` is untouched. |
| Memory: the toolkit's mechanisms, the model's formats | Kept. |
| Tests stay in scratch folders; never write to Mike's real settings or banks | Not kept in two places (I1 and M3). |
| No AI credit in commits | Kept in this repository. See M1 and M9. |

## Findings

### Blocking

**B1. The goal cannot be called met: the current code has not passed a live
run in three of the five setups.**

- Evidence: every sample run in `dev/test-runs/a-*`, `b-*`, `c-*`, `d-*`, and
  `claude-a` used version 0.2.2. The final fix round changed 67 findings after
  that. `c-notion/evidence.md` ends round 3 with "Verdict: not passed".
  `confirm-claude-local/evidence.md`: "The scenario did not run", because
  `claude auth status` printed `"loggedIn": false`. `confirm-d-hindsight/evidence.md`
  (finished during this review): "Not passed". Notion cannot be re-run until
  `ntn login`.
- Why it matters: finish item 10 says every failure is "fixed and re-tested".
  The 67 fixes are re-tested only by unit tests. The one live run on the
  current code found three new problems.
- Fix: Mike runs `claude auth login` and `ntn login`. Fix I5, I6, and I7. Then
  run the confirmation round for all five setups (local, Salesforce, Notion,
  Hindsight in Codex; local in Claude Code) and save each result in
  `dev/test-runs/`. Finish items 9 and 10 are met only when each run passes.

### Important

**I1. Any session can point Mike's `toolkit` command at any copy of the
toolkit, including an incomplete test copy.**

- Evidence: at about 12:35 EDT, `~/.config/toolkit-v2/plugin-root` named
  `.../scratchpad/budget/plugins/toolkit`, a 0.2.3 test copy with no
  `scaffold/` folder. `~/.local/bin/toolkit --version` printed `0.2.3`.
  `node .../scratchpad/budget/plugins/toolkit/bin/toolkit init --name "Ptr Test" --tracker local --memory builtin`
  failed with "The scaffold conditions file ... CONDITIONS.json could not be
  read: ENOENT". So at that moment `toolkit init` in Mike's terminal, which
  `README.md` tells him to run for a Codex-first project, would have failed.
  At 13:07 the pointer named `~/.codex/plugins/cache/toolkit-v2/toolkit/0.2.4`
  again, written by a Codex session. `confirm-d-hindsight` problem 4 saw the
  same thing.
- Cause, in `plugins/toolkit/lib/hooks/session-start.mjs`: "The pointer is
  refreshed in every folder". `refreshPointer` in `lib/project/machine.mjs`
  accepts any folder that holds `bin/toolkit`. The wrapper in
  `~/.local/bin/toolkit` checks only `$root/bin/toolkit`. On this Mac
  `~/.local/bin` is the first entry on the PATH, and Claude Code puts plugin
  `bin/` folders after the user's own entries
  (`ai-external-knowledge/claude-code/plugins-components.md`). So inside
  Claude Code, too, `toolkit` runs whichever copy the last session start
  named, not the session's own copy. The marketplace text "Its hooks do
  nothing outside a Toolkit V2 project" is also not exact: the hook writes
  this file in every folder.
- Fix: (1) refresh the pointer only inside a Toolkit V2 project, and only
  from an installed copy (under `~/.claude/plugins/cache/toolkit-v2/`,
  `~/.codex/plugins/cache/toolkit-v2/`, or the marketplace source folder);
  never from a folder under a temporary folder; (2) never replace a pointer
  to a higher version with a lower one; (3) in `wrapperScript`, also require
  `$root/scaffold/CONDITIONS.json`, else use the fallback folder; (4) every
  test harness sets `TOOLKIT_V2_CONFIG_DIR` and `HOME` to scratch folders; (5)
  with Mike's yes, run `toolkit machine-setup` once after the confirmation
  round to reset the pointer.

**I2. `README.md` and `AGENTS.md` say Claude Code reads the plugins in place.
It does not: it runs a copy filed under the version.**

- Evidence: `README.md` line 94: "Claude Code reads these plugins straight
  from this folder. A change here shows up in the next session, or after
  `/reload-plugins`." `AGENTS.md` line 161: "Claude Code reads the folder in
  place." The scratch install in this review wrote `installPath`
  `<scratch>/plugins/cache/toolkit-v2/toolkit/0.2.4` to
  `installed_plugins.json`, and that folder is a full copy (regular files,
  `scaffold/` included). The captured page says: "Each version has its own
  cache directory".
- Why it matters: an agent that follows the `AGENTS.md` "Versions" rule
  bumps the version only "for any change Codex must see". A fix without a
  bump never reaches Mike's Claude Code, and nothing reports it.
- Fix: correct both texts. Every shipped change raises the version in both
  manifests. After a change, Claude Code needs
  `claude plugin marketplace update toolkit-v2` and
  `claude plugin update <plugin>@toolkit-v2`, as
  `project-setup/references/repair-and-wiring.md` already says.

**I3. The Codex-first setup in `README.md` cannot work on a new computer.**

- Evidence: "Starting a new project from Codex" says to run `toolkit init` in
  a terminal. In a terminal, `toolkit` exists only after
  `toolkit machine-setup` writes `~/.local/bin/toolkit`, and that command
  cannot be run by name before the wrapper exists. The README's Codex install
  steps never mention machine-setup; they tell Mike to edit
  `~/.codex/config.toml` by hand, which machine-setup does for him.
- Fix: in the README's Codex install steps, after the six
  `codex plugin add` lines, add
  `node /Users/michaelrihm/Documents/Projects/toolkit-v2/plugins/toolkit/bin/toolkit machine-setup`,
  say in one line what it changes, and remove the hand edit.

**I4. Every `toolkit` command runs without asking, including the ones the
skills say need Mike's yes.**

- Evidence: the project settings allow `Bash(toolkit *)`, and
  `.codex/rules/toolkit.rules` allows the `toolkit` prefix outside the
  sandbox. `codex execpolicy check` returned `"decision":"allow"` for
  `toolkit machine-setup` (it changes `~/.codex/config.toml` and writes
  `~/.local/bin/toolkit`) and for
  `toolkit memory delete k --owner-approved` (a built-in memory record is
  deleted from a Git-ignored folder and cannot be brought back). The same
  holds for `toolkit import`, `toolkit memory import` (they replace records),
  and `toolkit hindsight service install` and `start` (a LaunchAgent). The
  flag `--owner-approved` is typed by the agent; only skill text asks for his
  yes first.
- Fix: in `templates/settings/claude-toolkit.json`, add `permissions.ask`
  entries: `Bash(toolkit machine-setup*)`, `Bash(toolkit memory delete *)`,
  `Bash(toolkit import *)`, `Bash(toolkit memory import *)`,
  `Bash(toolkit hindsight service *)`. In `templates/codex/toolkit.rules`, add
  `prefix_rule` entries with `decision = "prompt"` for the same commands. This
  review checked in a copy of the rules file that the narrower rule wins:
  `toolkit machine-setup` and `toolkit memory delete ...` came back
  `"decision":"prompt"`, and `toolkit work list` stayed `"allow"`.

**I5. An unanswered "Save to memory?" is dropped (from the evidence of
`confirm-d-hindsight`, problem 1).**

- Evidence: 3 of 3 tries. After an unanswered question, `toolkit work decisions`
  said "Nothing is waiting on the owner." Mike approved this feature on
  2026-09-27 ("Memory additions", 1). Only skill text asks for the save; no
  hook checks it.
- Fix (as that run suggests): in `memory-save` step 3, save the proposal
  with `--proposal` when the question is asked, then ask; his yes runs
  `toolkit memory approve`, his no runs `toolkit memory reject`. Add a test.

**I6. The duplicate check misses a reworded copy (from the evidence of
`confirm-d-hindsight`, problem 2; reproduced in this review).**

- Evidence: `compareRecords` on "Document every command-line flag in the
  README" against "Explain each command-line flag in the README file" gave
  `{"description":0.444,"body":0.417,"similar":false}`. The cut-off is
  `SIMILAR_AT = 0.6` in `plugins/toolkit/lib/memory/similar.mjs`. A second
  record was saved.
- Fix: compare word stems and treat "each" and "every" as one word; also count
  a record that the backend's search returns first with an overlap of 0.4 or
  more. Add this pair as a test.

**I7. In Codex, a `toolkit` command with an apostrophe written `'\''` does not
work (from the evidence of `confirm-d-hindsight`, problem 3; not re-run in
this review).**

- Evidence: every skill header teaches `'\''`. The Codex tool call dropped the
  backslash ("zsh:1: unmatched '", sessions s05 and s06). Written correctly
  (s19), the command ran inside the sandbox, and the Hindsight request failed
  with EPERM. The same command without an apostrophe reached Hindsight. This
  answers the open question in `dev/PROGRESS.md`. `codex execpolicy check`
  matches the rule when given the words, so the failure is in how Codex splits
  the command text, before the rule is checked.
- Why it matters: in a Codex project with Hindsight or Notion memory, a memory
  save, focus update, or search whose text holds "Mike's" fails.
- Fix: in Codex, tell the agent to write an apostrophe as ’ (U+2019) or reword
  it, in every skill header and in `chainedToolkitNote`
  (`plugins/toolkit/lib/hooks/pre-tool.mjs`). Add a Codex PreToolUse note for
  a `toolkit` command that holds `'\''`, and a test.

**I8. The work tracker and memory exist on one disk, and nothing sets up a
backup on day one.**

- Evidence: the model's `.gitignore` ignores `.memory/` and `/.work-items/`
  (by Mike's model, which wins). `toolkit export` is manual.
  `checkBackup` in `lib/project/checks.mjs` warns only when the last export is
  more than 7 days old, or when a never-exported folder is more than 7 days
  old. Setup never asks for a backup folder; `memory-tidy` asks once, only
  when it runs. Good: the pre-tool hook refuses `git clean -x` in the main
  checkout, and `reset-to-remote` uses `git clean -fd`, which keeps ignored
  files.
- Why it matters: a lost or wiped Mac loses every requirement, approval, and
  history row of every local-tracker project, and all built-in memory.
- Fix: in `project-setup`, ask for the backup folder once and save it as a
  `reference` record. Run `toolkit export` to it at the end of `work-finish`
  and `handoff`, and show the briefing's backup warning after 1 day instead of
  7.

### Minor

**M1. The AI credit guard misses merges, tags, releases, and issues.** Tested:
`git merge --no-ff ... -m "<AI co-author line>"`,
`git tag -a v1.0 -m "... <AI Generated-with line>"`,
`gh release create ... --notes "<AI Generated-with line>"`, and
`gh issue create ... --body "<AI Generated-with line>"` all passed the
pre-tool hook. `work-finish` writes merge commits with a message. Claude Code's
`attribution` setting is the first defense there; in Codex the hook is the
only one. Fix: extend `checkAiCredit` in `lib/hooks/shell.mjs` to `git merge`,
`git tag`, `git notes`, `gh release create` and `edit`, `gh issue create`,
`edit`, and `comment`, and `gh pr comment`.

**M2. `toolkit memory save` accepts an obvious secret.** Tested:
`--body 'Remember: the staging key is sk-ant-api03-AbCd... and the admin password is hunter2'`
was saved as `reference_staging_api_key`. The CLI checks for email addresses
but not secrets; the "never store secrets" rule is only skill text. With
Notion memory, the text would go to Notion. Fix: refuse a body or description
that matches common key prefixes (`sk-`, `sk-ant-`, `ghp_`, `ntn_`, `xox`,
`AKIA`), a private key header, or "password is/:", with a message that says
where secrets belong.

**M3. Test data is left on Mike's real Hindsight server.** 17 empty banks
`acme-crm`, `acme-crm-2` to `acme-crm-17` (made 2026-09-26), plus
`greet-cli-sample-d`, `-d2`, `-d3`, and `greet-cli-confirm-d`. The current
tests use `tkv2-test-...` names and delete them, so these come from earlier
runs. Fix: list them for Mike and delete them after his yes.

**M4. Doctor warns about the Codex wrapper in a Claude Code-only project.** p3
(hosts `claude-code` only): "~/.config/toolkit-v2/plugin-root is missing, so
the Codex wrapper cannot find the toolkit." It also names `~/.config/...` when
`TOOLKIT_V2_CONFIG_DIR` points elsewhere (`confirm-claude-local` problem 2).
Fix: in `checkComputer`, check the pointer only when the hosts include
`codex`, and build the message from `pointerPath(env)`.

**M5. A non-Salesforce project's `AGENTS.md` names Salesforce paths.** p1's
path-scoped rules table lists `tools/permissions/PERMISSIONS-RUNBOOK.md` and
`delivery/**` for `publish-project-documents.md`. They come from the model
rule's `paths:` list. Harmless. Fix: a model change with Mike's yes, or a
`CONDITIONS.json` line that removes those two paths when Salesforce is off.

**M6. CLI fix lines still show double quotes.** The failed
`toolkit work approve WI-001 --requirements` printed
`toolkit work history WI-001 --note "Owner's words: <quote>"` and
`--text "<goal>"`. Every skill and the pre-tool hook say single quotes. Fix:
use the single-quote form in the messages in `lib/work/ops.mjs` (and the ’
form for Codex, per I7).

**M7. Two routing findings are still open.** From
`dev/test-runs/skill-routing-r3.md`: O21 ("Ask me questions before you write
anything down") opened `work-on` 3 of 3 in Claude Code; the suggested sentence
for `work-on` step 3 was not added. O27 waits on Mike's yes for the
`sf-component-tracker` description (`dev/model-changes.md`, "Needs your
yes"). Fix: add the O21 sentence and re-run those messages.

**M8. `dev/model-review.md` is out of date.** It says "Updated 2026-09-26" and
names branch head `9940854`; the import check reports commit `54c5520`. Fix:
update the date and head, and point to `dev/model-changes.md` for the later
commits.

**M9. Committed evidence quotes AI credit lines.** `dev/test-runs/claude-a/`
(`final/git-log.txt`, `evidence.md`, `sessions/*.jsonl`) and
`dev/test-runs/open-bugs.md` hold the exact trailer
"<AI co-author line>" (replaced here on 2026-09-28, R-M11). It is
evidence of a bug, not a credit for this repository, but a search of the
repository finds it. Fix: before any GitHub repository exists, replace the
quoted trailer with "<AI co-author line>".

**M10. Doctor checks that a Codex hook trust entry exists, not that it is
current.** Codex stores a `trusted_hash` for each hook in
`~/.codex/config.toml`. `codexHookTrustKeys` in `lib/project/hosts.mjs`
checks only the key. After a hook change, Codex may skip the hooks while
doctor reports them trusted. The key format for the V2 hooks is still
unverified (open bug 51). Fix: after Mike trusts the hooks, record the hash
of `hooks/codex-hooks.json` beside the check, and warn when the file changed
since.

**M11. `memory-find` points at a file in another plugin.** It says "read the
issues as the work plugin's `references/trackers.md` says". `AGENTS.md` says a
plugin cannot use a file outside its own folder, and an installed copy has no
path to it. Doctor's GitHub and Jira note prints an absolute path, which
helps. Fix: copy the few lines the memory skill needs into its own
`references/`, or name the command that prints the path.

## Hooks: what was tried for "could they block normal work?"

Nothing below was refused wrongly. Refused, as designed: `git clean -fdx`,
`git add .`, `git add -A src/`, `git push --force-with-lease`, a commit with an
AI co-author, a toolkit command with a backtick inside double quotes, and a
hand-made `DESIGN.md` inside `.work-items/`. Let through: `git clean -fd`,
`git add src/ tests/`, `git stash`, a commit with a human co-author, a commit
saying "Generated with make fixtures", reads of `MEMORY.md` and
`DASHBOARD.md`, writes to `docs/DESIGN.md`, `docs/INDEX.md`, and
`src/INDEX.md`, `git mv docs/MEMORY.md`, `npx prettier --write "**/*.md"`,
and a notes file inside an item folder. The Stop hook blocks at most once per
turn. The Salesforce guard let `ls -la` and `npm test` through at once, and
refused a deploy to an alias it could not classify.

## Not checked in this review

- Anything that needs Notion (signed out) or a model reply in Claude Code
  (signed out).
- The confirmation runs for Codex local and Salesforce, still running at
  13:18 EDT.
- Which of the two "Plain English" output styles Claude Code applies (already
  on Mike's checklist in `dev/model-review.md`).

## What this review left behind

All test projects, the scratch Claude Code and Codex homes, and the test
rules file are in this session's scratch folder. A secret-looking test record
was saved only in the scratch project p1. Nothing was written to Mike's
`~/.claude`, `~/.codex`, `~/.config/toolkit-v2`, Notion, the model folders, or
`claude-toolkit`. One `toolkit doctor` run read Mike's real
`~/.config/toolkit-v2` and `~/.codex/config.toml`; it wrote nothing. The test
suite made and deleted its own `tkv2-test-...` banks on the local Hindsight
server, as `AGENTS.md` allows; none is left.
