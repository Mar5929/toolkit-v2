# Final confirmation run claude-local, round 2: passed

Run on 2026-09-28 from 22:10 to 22:43 UTC in real `claude -p` sessions.
Claude Code 2.1.280. Toolkit V2 plugins from this repository's folders:
`toolkit` 0.2.7, `work` 0.2.9, `memory` 0.2.7, `session-skills` 0.2.7,
`git-workflows` 0.2.7 (the Claude Code cache copies of these versions match
the source folders; only one test file differs). Tracker: local folders.
Memory: built-in `.memory/`. Not Salesforce.

Round 1 is kept in `evidence-round1.md` in this folder, with its files in
`sessions/`, `checks/`, and `harness/`. Round 2's files are in `round2/`.

Project folder (scratch, a new Git repository whose only commit held a
three-line `README.md` for "slug", a tool that turns a title into a URL
slug):
`/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/final-claude-local-r2`.
Backup folder given at setup:
`.../scratchpad/backups/claude-local`. It already held round 1's `greet-*`
folders; this project's key is `slug`, so its backups are `slug-*`.

## Result

Every step of the scenario worked. All five Toolkit V2 hooks ran in every
session, and none failed. No commit carries an AI credit line. `work-finish`
wrote a backup that holds both finished items and the new focus. No toolkit
command waited on a prompt Mike could not see.

The two round 1 problems that were fixed in code or agent files are fixed:
`publish-docs` ran with no approval prompt and no `/add-dir`, and the
handoff check ran `toolkit work decisions` and `toolkit doctor`.

Four low problems were found (see "Problems found"). None stopped the
scenario or left a wrong record. The one Mike would notice: when he asked
"What do you need from me?" with one memory proposal waiting, the Stop hook
made the agent ask the same question a second time.

| Scenario step | Result | Where |
| --- | --- | --- |
| Setup with `project-setup`, answering its questions (backup folder included) | Passed | s01 to s01i |
| Setup commit after Mike's yes | Passed | s02 |
| One session with Mike's everyday Claude Code settings in the V2 project | Passed | s03 to s06 |
| WI-001 from 01-discovery to Done, with Mike's approvals | Passed | s03 to s06, s13, s14, s23, s24 |
| Split into a sub-item (WI-002 under WI-001) | Passed | s08 |
| Sub-item folder renamed by hand between sessions, noticed by the next session | Passed | hand step, s09 |
| "Remember that I prefer ..." saved, then found in a later session | Passed; later commits follow it | s07, s19 |
| "Save to memory?" left unanswered becomes a proposal | Passed, twice, both saved by the Stop hook: once from the agent's own question (s11), once from a question worded with "you" (s22) | s11, s22 |
| The proposal shows under "What do you need from me?" | Passed | s13, s25 |
| Proposal approved, and another rejected | Passed | s14 (approve), s26 (reject) |
| "Where are we?" | Passed | s09, s27 |
| Handoff at the end | Passed | s28 |
| No AI credit line in any commit | Passed | `round2/checks/git-final.txt` |
| A backup appeared after `work-finish` | Passed | `round2/checks/backup-after-finish.txt` |
| Every hook ran | Passed | `round2/checks/hook-and-denial-tally.txt` |
| No toolkit command stalled on a prompt Mike could not see | Passed | `round2/checks/hook-and-denial-tally.txt` |

## How the run was done

- `round2/harness/run.sh` runs one real `claude -p` session. It is round 1's
  harness with three changes: the round 2 folders; `PROJ_OVERRIDE` and
  `TKCONF_OVERRIDE`, used only for the probe p00; and
  `--disallowedTools "Bash(toolkit machine-setup*)" "Bash(*toolkit machine-setup*)"`
  on every session, because `HOME` is Mike's own and `machine-setup` would
  change his `~/.codex/config.toml` and `~/.local/bin/toolkit`. No session
  tried to run it.
- `MODE=iso` (default) is the isolation command from `dev/ARCHITECTURE.md`
  section 10 (`--setting-sources project,local`, `--settings` turning on the
  five `<name>@inline` plugins, `--strict-mcp-config`, one `--plugin-dir` per
  V2 plugin, `--output-format stream-json --verbose --include-hook-events`,
  `--permission-mode acceptEdits`, and an `--allowedTools` list that
  includes `Bash(toolkit *)`). `TOOLKIT_V2_CONFIG_DIR` points at a scratch
  folder holding a copy of Mike's `plugin-root` pointer (it names
  `~/.claude/plugins/cache/toolkit-v2/toolkit/0.2.7`).
- `MODE=normal` runs `claude -p` with Mike's own settings and no plugin or
  setting flags (the same output and permission flags only). Toolkit V2 is
  now installed in his Claude Code: `toolkit@toolkit-v2` on for every
  folder, the other five off, and the project's `.claude/settings.json`
  turns them on.
- `round2/harness/say.sh <name> <session to resume or -> '<message>'` writes
  the prompt and runs it. A fresh session is "-"; answering a question in
  the same conversation uses `--resume`.
- Each session's exact command, prompt, full stream-json output, readable
  summary, standard error, exit code, times, session id, hook state file,
  and Git state after it are in `round2/sessions/`.
  `round2/harness/tally.py` counts hooks, toolkit commands, and refusals
  over all of them.
- Nothing was written to Mike's model folders, `claude-toolkit`, Notion,
  Hindsight, `~/.codex`, `~/.local/bin`, or `~/.config/toolkit-v2` (their
  last change times are before the run; `plugin-root` still names the
  0.2.7 cache copy). As in round 1, each session wrote its transcript to
  `~/.claude/projects/` and its hook state to `~/.claude/plugins/data/`.

## Sessions

Mike's words are the prompt files in `round2/sessions/`. "(resume)" means
the same conversation as the session before it.

| Session | Mode | Mike said | What happened |
| --- | --- | --- | --- |
| p00 | iso, probe folder, no pointer | "Set up this project with the toolkit." | Probe of the round 1 problem 3 fix, in a separate folder with an empty scratch config folder. Doctor exited 4 and listed the missing pointer under "This computer:". The agent called it "one problem", said "setup can't go ahead reliably until it's fixed", and asked for a yes to `toolkit machine-setup` before the interview (problem 3). Stopped here. |
| s01 | iso | "Set up this project with the toolkit." | `project-setup`: doctor, looked at the folder, checklist; "Question 1 of 6: I'll call this project "slug", with the short key `slug`, work item numbers `WI-001` ... Is that right?" |
| s01b to s01f | iso (resume) | "Yes." / "Local folders on this computer." / "The built-in memory folder." / "No, not Salesforce." / "Skip it." | One question per reply, each with a recommendation: tracker, memory, Salesforce, `SOUL.md`, backup folder (recommended `~/Backups/toolkit`). |
| s01g | iso (resume) | "Use .../scratchpad/backups/claude-local for the backups." | `toolkit init --name 'slug' --key slug --tracker local --memory builtin --owner 'Mike Rihm' --backup-dir '...' --decline SOUL.md` added 33 files and kept `README.md`; `toolkit handoff-backup` made `slug-2026-09-28`; doctor clean. Asked for the one-sentence outcome, with a suggestion from the README. |
| s01h, s01i | iso (resume) | "Yes, use that sentence." / "Yes, leave it blank for now." | Outcome written to `AGENTS.md`, `PROJECT.md`, `PROJECT-ROADMAP.md`; build and test commands left blank. Report: owner steps (new session, two Codex trust steps, also in the current focus), prompts left, commit offer. |
| s02 | iso (resume) | "Yes, commit them." | Staged 26 files by name, checked none was under `.work-items/` or `.memory/`, `git commit -q -m 'Set up Toolkit V2'` (`f8811ea`). |
| s03 | normal | "New work: build the slug command. `node slug.js "Hello World"` should print `hello-world`. Track it as a work item and do it properly." | `work-on`, `work-requirements`: `toolkit work new` made WI-001 at 01-discovery; request saved; stage 02; asked "So the goal is ...?" with four suggested rules. |
| s04 | normal (resume) | "Yes, that's the goal, and the four rules are right." | Saved; asked the empty-input question with a recommendation. |
| s05 | normal (resume) | "Yes. For anything else, go with your recommendations." | R-01 to R-05; the `requirements-analyst` check found 3 gaps, fixed with the recommendations; asked for approval. |
| s06 | normal (resume) | "Yes, the requirements are approved." | `toolkit work approve WI-001 --requirements --by 'Mike Rihm'`; no delivery offer (small item, `--delivery owner-led` with the reason); no separate design, with the reason in the history; stages 06 to 08; worktree `.claude/worktrees/wi-001-build-the-slug-command` on `claude/wi-001-build-the-slug-command`; `slug.js`, `package.json`, 13 tests; 2 commits. `work-check` with the `acceptance-checker` agent found one gap (stroke letters such as "Ħ" were dropped); fixed (commit `16e745a`), re-checked; stage 11; asked for result approval with the command to try in the worktree folder. One `toolkit memory focus` save was refused by the toolkit because a section was missing; the agent added it and saved. |
| s07 | iso | "Remember that I prefer commit messages without the work item number in them. Just say what changed." | UserPromptSubmit keep note; `memory-save`: `toolkit memory find`, `toolkit memory save --type feedback --name commit-messages-without-item-id ... --approved-by 'Mike Rihm'`, read back, doctor. "Saved to memory: ... Say "forget that" to undo." |
| s08 | iso | "Before I approve WI-001: I also want a way to cap the slug length, like --max 20, cutting at a dash. Split that into its own sub-item under WI-001. Don't change WI-001's approved requirements." | `work-organize`: `toolkit work new --title 'Add a --max option to cap slug length' --type build --parent WI-001` made WI-002 in `.work-items/WI-001-build-the-slug-command/WI-002-add-a-max-option-to-cap-slug-length/`; WI-001 roadmap phase P2 names WI-002; Related items "Sub-items: WI-002"; history note; WI-001 kept at stage 11 with R-01 to R-05 unchanged. Four direct edits of WI-002's file got the PostToolUse reminder once. |
| hand | - | `mv WI-001-build-the-slug-command/WI-002-add-a-max-option-to-cap-slug-length WI-001-build-the-slug-command/WI-002-max-length` at 22:24:32 UTC | `round2/checks/hand-rename.txt` |
| s09 | iso | "Where are we?" | The briefing listed "Renamed folder: WI-002's folder was renamed by hand from WI-002-add-a-max-option-to-cap-slug-length to WI-002-max-length; the item itself is the same. It is still a sub-item of WI-001." The reply said it to Mike, with the four waiting decisions. WI-002's history has "Folder renamed by hand: ... Same item; the toolkit uses the new path." |
| s10 | iso | "Let's get WI-002's requirements going. Q-01: yes, --max is the one exception to R-04. For what it's worth, our CI runs slug on Node 22, and nobody uses Node 18 anymore." | Q-01 answer saved as WI-002 R-01; the Node 22 fact went into WI-002's notes for the design stage (not dropped); goal question. |
| s11 | iso (resume) | "Yes, that's the goal. Also, by the way: slug's docs site is at https://docs.example.com/slug, and its usage page is where people read about the options." | Goal saved; `memory-save` (approval mode `onboarding`) asked "**Save to memory: the slug docs site is https://docs.example.com/slug, and its usage page is where people read about the options?** I have no recommendation either way." and did not save. The Stop hook saved it as `project_slug_docs_site_https_example_com_usage_page_people` (`status: needs-review`). `MEMORY.md` lists it with "[proposal: not a fact until the owner answers]". |
| s12 | iso (resume) | "Q-02: yes, cut that word at exactly the limit." | The save question was left unanswered. R-02 saved; "Your docs site question from last time is saved as a proposal, and I'll bring it up again when you review decisions."; Q-03 asked with a recommendation. |
| s13 | iso | "What do you need from me?" | `work-decide`: `toolkit work decisions` printed 4 decisions: the WI-001 result, Q-03, Q-04, and "Memory proposals (saved, not yet approved ...): project_slug_docs_site_...". The reply named all four, then took the WI-001 result first. |
| s14 | iso (resume) | "I tried it, it works. Yes, WI-001's result is approved, but keep WI-001 open until WI-002 is done. Q-03: go with your recommendation. Q-04: no, the docs page is not part of this. And yes, save the docs site to memory." | `toolkit work approve WI-001 --result --by 'Mike Rihm'` (it printed the stale Next action note; the agent fixed it); Q-04 recorded; `toolkit memory approve project_slug_docs_site_... --by 'Mike Rihm'` ("it is now a current memory record"). Q-03 left open: the recommendation was given in another conversation, so the agent asked again rather than guess (problem 4). "One decision still waits on you: Q-03." |
| s15 to s17 | iso (resume) | "Yes, treat it as an error." / "Keep going on WI-002." / "All yes, except 5: last one wins." | R-03; acceptance list; spec check with 9 findings as Q-05, all applied; requirements shown for approval. |
| s18 | iso (resume) | "Yes, approved. Build it." | Requirements approved; no separate design, with the reason; worktree and branch `claude/wi-002-add-a-max-option-to-cap-slug` from the WI-001 branch; commit `2ef81c2` "Add --max option to cap slug length at a word boundary" (no work item id, following the saved preference; the three WI-001 commits before s07 end with "(WI-001)"); 24 tests pass; independent check; stage 11. |
| s19 | iso | "Do you remember how I like my commit messages?" | `memory-find`: "You want commit messages to say only what changed, and never include the work item ID ... (Memory `feedback_commit_messages_without_item_id` ...)". |
| s20 | iso | "I know .work-items/DASHBOARD.md is generated, but I want to see what the toolkit does. Try the Edit tool once ..." | PreToolUse denied the edit: ".work-items/DASHBOARD.md is a generated file, so it is not edited by hand. ..." (the reason keeps its final period in Claude Code). The file's checksum is unchanged. |
| s21 | iso | "Remember that slug's first release is on Friday. For this message, reply with only the word OK. Do not run any tool or skill." | Reply "OK"; the Stop hook returned "The owner asked this turn for something to be kept ... and nothing was recorded ..."; the agent then said in one line why it was not saved. |
| s22 | iso (resume) | "Go ahead and save the Friday release. Then end your reply with exactly this question on its own line, and take no other action on it: "Save to memory: you publish slug releases to npm yourself?"" | Saved `project_slug_first_release_friday` (approved). The agent asked the question and did not save it; the Stop hook saved it as `project_mike_rihm_publishes_slug_releases_npm_personally`, title and Remember line "Mike Rihm publishes slug releases to npm personally", and the Evidence line quotes the question as asked. |
| s23 | iso | "I tried --max, it works. WI-002's result is approved. Ship it: merging locally into main is fine, you have my OK." | Result approved; `git merge --ff-only` to `2ef81c2` (both items' commits); stages 12 to 14; `publish-docs.mjs start` made the save workspace `.claude/worktrees/docsave-201cb530`; `publish-docs.mjs publish --workspace <that folder>` ran from the project folder: "No remote: committed locally. b47419c... is on main."; workspace removed; focus updated first, then `toolkit work finish WI-002 ...` printed "Backed up .work-items/ and .memory/ to .../slug-2026-09-28." Asked whether to close WI-001 and remove the old worktrees. |
| s24 | iso (resume) | "Yes, close WI-001 and remove both." | Both worktrees removed, both branches deleted with `git branch -d`; WI-001 stages 12 to 14; focus updated; `toolkit work finish WI-001 ...` backed up again. |
| s25 | iso | "What do you need from me?" | `toolkit work decisions`: "1 decision waits on the owner: Memory proposals ...: project_mike_rihm_publishes_slug_releases_npm_personally ...". First message: the count, the proposal's line, what yes and no do, "I recommend yes" (with no evidence; problem 2), and the two Codex setup steps. The Stop hook then asked for the exact question form, and the agent sent a second message: "Save to memory: Mike Rihm publishes slug releases to npm personally?" (problem 1). |
| s26 | iso (resume) | "No, don't save that." | `toolkit memory reject project_mike_rihm_...`: "the owner said no, so the proposal was deleted." "No decisions are waiting on you now." |
| s27 | iso | "Where are we?" | Both items Done, nothing waiting, the release on Friday 2026-10-02, two Codex setup steps. |
| s28 | iso (resume) | "Write a handoff. I'm going to clear context and start a new session." | `handoff`: focus saved and read back; the `handoff-verifier` agent ran `toolkit work list`, `toolkit work decisions`, `toolkit doctor`, `toolkit memory focus`, and read the items and memories; it also found that `AGENTS.md` says Node.js 25 while WI-002 records CI on Node 22, which went into the prompt as an open question; `toolkit handoff-backup` made `slug-2026-09-28-184255` (today's earlier backup has one more file, the proposal rejected in s26, so it was kept); checked prompt given. |

## The session with Mike's everyday settings (s03 to s06)

Command: `round2/sessions/s03.command.txt` (no `--setting-sources`,
`--settings`, `--plugin-dir`, or `--strict-mcp-config`).

- Plugins from the stream-json `init` event: `toolkit@toolkit-v2`,
  `work@toolkit-v2`, `memory@toolkit-v2`, `session-skills@toolkit-v2`,
  `git-workflows@toolkit-v2`, plus Mike's other plugins (playwright,
  feature-dev, skill-creator, claude-code-setup, swift-lsp, impeccable,
  obsidian, humanizer, Notion) and built-ins. No `@claude-toolkit` plugin
  loaded. All 22 V2 skills were listed. `output_style`: `Plain English`.
- The `init` event gives each V2 plugin's `path` as
  `/Users/michaelrihm/Documents/Projects/toolkit-v2/plugins/<name>`, not the
  cache folder. This matches Finding 1 of `install-everyday.md`: Claude Code
  runs a directory marketplace in place.
- Hooks: Mike's own user hooks ran beside the V2 hooks (two SessionStart,
  two UserPromptSubmit, two PreToolUse per Bash call, three Stop). All
  returned success. The V2 SessionStart gave the project briefing.
- Standard error held only: "Ignoring 1 permissions.allow entry from
  .claude/settings.json: this workspace has not been trusted." In an
  interactive session Claude Code shows its trust dialog at the first
  start; the runs passed the same rule with `--allowedTools`.

## Round 1 fixes checked in this run

| Fix | Seen in round 2 |
| --- | --- |
| `publish-docs` save workspace in the ignored `.claude/worktrees/`, `publish --workspace` from the project folder (round 1 problem 1) | Fixed. s23: `.claude/worktrees/docsave-201cb530`, no refusal, no `/add-dir`. |
| `handoff-verifier` may run `toolkit work decisions` and `toolkit doctor` (round 1 problem 2) | Fixed. s28: the verifier ran both. |
| A doctor warning, the plugin pointer included, never blocks init (round 1 problem 3) | Not fixed in practice. p00: see problem 3. |
| An unanswered project-document offer goes into the focus (round 1 problem 4) | Not exercised: the agent put the Node 22 fact into WI-002's notes and made no offer. |
| Stop-hook proposal worded with "you" saved with the owner's name | Fixed. s22. |
| Stale Next action note after an approval | Fixed. s14 printed the note and the agent rewrote the line. |
| work-decide names what still waits after each answer | Fixed. s14 "One decision still waits on you: Q-03."; s26 "No decisions are waiting on you now." |
| Focus taken off before `toolkit work finish`, so the backup holds the new focus | Fixed. The backup's `CURRENT_FOCUS.md` after s24 has "Now: None" and "work-finish WI-001". |
| No "Tasks has no task lines" warning on a Done parent | Fixed. Final `toolkit work validate`: "Checked 2 items: 2 clean, 0 errors". |
| Deny reasons keep their final period in Claude Code | Fixed. s20. |
| `work next --json` has `waitingOnOwner` and `memoryProposals` | Present (`round2/checks/final-cli-state.txt`). |
| The command Mike is given to try names the worktree folder (Hindsight L6) | Fixed. s06, s13, and s18 name the folder. |

## Checks

### No AI credit line in any commit

`round2/checks/git-final.txt`:

```
b47419c Mike Rihm <michael@rihm.com> | Add slug command requirements and system guide
2ef81c2 Mike Rihm <michael@rihm.com> | Add --max option to cap slug length at a word boundary
16e745a Mike Rihm <michael@rihm.com> | Turn remaining Latin stroke letters into plain letters (WI-001)
e204afb Mike Rihm <michael@rihm.com> | Record the run and test commands in AGENTS.md (WI-001)
af288b5 Mike Rihm <michael@rihm.com> | Add slug command and tests (WI-001)
f8811ea Mike Rihm <michael@rihm.com> | Set up Toolkit V2
6903e40 Mike Rihm <michael@rihm.com> | Initial commit
```

Every body is one line.
`git log --all --format=%B | grep -i -E 'co-authored-by|generated with|claude|anthropic|noreply'`
printed nothing (exit 1). The project's `.claude/settings.json` holds
`"attribution": {"commit": "", "pr": "", "sessionUrl": false}`. At the end
`main` is the only branch and the only worktree, and the working tree is
clean.

### Backups

- Setup (s01g): `toolkit handoff-backup` made `slug-2026-09-28` at 22:12 UTC
  with 11 files: the templates and the empty memory
  (`round2/checks/backup-before-finish.txt`, taken at 22:37 UTC).
- `work-finish` (s23, s24): both `toolkit work finish` commands printed
  "Backed up .work-items/ and .memory/ to .../slug-2026-09-28." The folder
  was rewritten at 22:40 UTC with 18 files: both work item records (WI-002
  under its hand-renamed folder), the three memory records, the open
  proposal, and the focus with "Now: None"
  (`round2/checks/backup-after-finish.txt`).
- Handoff (s28): a second folder, `slug-2026-09-28-184255`, because the
  same-day folder held one more file. The earlier one was kept.

### Every hook ran

From `round2/checks/hook-and-denial-tally.txt` (37 session runs, p00
included): SessionStart 41, UserPromptSubmit 43, PreToolUse 450,
PostToolUse 337, Stop 50 hook responses. Every one had outcome success
and exit code 0. `.git/toolkit-v2/hook-errors.log` does not exist.
Outputs seen:

- SessionStart: the project briefing, with the hand rename (s09) and the
  memory proposals (s25).
- UserPromptSubmit: the keep note (s07, s21); the note that the Stop hook
  saved a proposal (s12); the note that a proposal was not saved again
  (s26).
- PreToolUse: the deny on the dashboard edit (s20).
- PostToolUse: the direct-edit reminder, once for four edits of one file
  (s08).
- Stop: the keep check (s21); the two proposal saves (s11, s22); the
  exact-form request (s25, problem 1).

### No toolkit command stalled on a prompt

The agents ran 245 `toolkit` commands. Four returned an error, and none
waited on a prompt:

- s01: `toolkit doctor; echo EXIT=$?; ls -la` was refused by Claude Code
  because it joins commands (the skill says to run each `toolkit` command
  alone). The agent ran `toolkit doctor` alone, which exited 4 as designed
  in a folder that is not a V2 project yet.
- s06: `toolkit memory focus --set-file -` refused a focus without the
  "Untracked to-dos" section. The agent added it and saved.
- s18: `toolkit work show WI-002 --section 'Active requirements' > /tmp/wi002-req.md`
  was refused by Claude Code for the redirect to a file outside the
  project. The agent went on without it. Interactive: an approval prompt
  Mike sees.

The 19 `permission_denials` in the result events: the dashboard deny
(intended), the two toolkit commands above that Claude Code refused (s01,
s18), two in the probe p00, and 14 other shell commands (joined commands,
`npm test`, `perl`, loops, `cd` into a worktree) while building and
checking. Each was re-run
as plain commands or read with the Read tool. In an interactive session
these are Claude Code approval prompts Mike sees.

### The toolkit's own state at the end

`round2/checks/final-cli-state.txt`: `toolkit doctor` "Result: clean. No
problems and no warnings here (2 for Codex only)", exit 0. `toolkit work
validate`: "Checked 2 items: 2 clean, 0 errors, 0 approval gate problems."
`toolkit work list --all --tree`: WI-001 Done with WI-002 Done under it.
`toolkit work decisions`: "Nothing is waiting on the owner." `toolkit
memory list`: three current records, no proposal. The final records are in
`round2/checks/` (`WI-001-WORK-ITEM.md`, `WI-002-WORK-ITEM.md`,
`CURRENT_FOCUS.md`, `MEMORY.md`, `memory-final/`).

### Repository checks

Run before the scenario (22:06 UTC) and again after it, on the working
tree as it was (head `3adb722` plus the uncommitted round 1 fixes). Before:
`node --test "tests/**/*.test.mjs"` in `plugins/toolkit` 928 tests, 925
pass, 0 fail, 3 skipped by design; `check-skills.mjs --quiet` 0 failures,
0 warnings, 16 notes; `sync-skill-references.mjs --check` 159 copies, 0
problems; `import-model.mjs --check` matches the approved model folder
(commit `5e7d7a0`); git-workflows tests 14 of 14 pass;
`claude plugin validate .` passed. After: see "Checks after the run" at
the end of this file.

## Problems found

1. **The Stop hook makes work-decide ask about an existing proposal twice
   (low).** In s25 the agent's decision message ended "Should I save "Mike
   Rihm publishes slug releases to npm personally" to memory?". The
   proposal already existed; `toolkit work decisions` had just listed it.
   The Stop hook still returned "You asked the owner to save something to
   memory. Ask it as 'Save to memory: <one line>?' or save it now with
   toolkit memory save ... --proposal.", and the agent sent a second
   message holding only "Save to memory: Mike Rihm publishes slug releases
   to npm personally?". Interactive: Mike sees the same question twice.
   With `claude -p`, the result is only the bare second message. No second
   proposal was saved (s26: "was not saved again: memory already has the
   proposal"). Cause: `lib/hooks/stop.mjs` line 205 runs `looseQuestion()`
   whenever the turn has no `Save to memory:` question and no memory write,
   and does not check for an open `needs-review` proposal the message is
   about. Suggested fix: skip the loose check when the message names an
   open proposal, or have work-decide step 6 ask in the
   `Save to memory: <one line>?` form. The question also names Mike in the
   third person when it is put to him; the owner wording is right for the
   record but reads oddly as a question to him.
2. **work-decide recommends yes to a proposal with no evidence (low).** In
   s25: "I recommend yes. The first release is on Friday, 2026-10-02, and
   this makes sure no agent publishes it for you." Nothing in the project
   says Mike publishes to npm. `memory-save` SKILL.md line 38 says
   "Recommend a yes only with evidence from this project ... With none, ask
   without a recommendation." work-decide step 6 ("show its one line and
   your recommendation") and its gotcha "Every decision carries a
   recommendation, even when it is the only one in the queue" say the
   opposite, and work-decide's `references/proposals.md` does not carry the
   evidence rule. Mike said no, so nothing wrong was saved. (The question
   itself was one this test forced.) Suggested fix: add the evidence rule
   to `plugins/memory/shared/proposals.md` or to work-decide step 6, as the
   exception to "every decision carries a recommendation".
3. **Doctor does not say the missing pointer is only a warning outside a
   project, so setup still stops for it (low; round 1 problem 3, fixed in
   the skill text only).** In a folder that is not a V2 project yet,
   `notProjectReport` in `lib/commands/doctor.mjs` (lines 46 to 56) prints
   each computer finding under "This computer:" without its severity, and
   exits 4. In p00 the agent read the pointer line as a problem: "This
   computer has one problem ... I recommend yes, because setup can't go
   ahead reliably until it's fixed", and asked for `toolkit machine-setup`
   before the interview. The `project-setup` step 1 text ("A warning ...
   never blocks init") cannot help when the output does not say "warning".
   Only on a computer without the pointer; asking for `machine-setup` there
   is reasonable, but "can't go ahead" is not true in Claude Code.
   Suggested fix: print the severity in `notProjectReport` (for example
   "Warning: ..."), or add one line saying warnings do not block
   `toolkit init`.
4. **A recommendation given in one conversation is not kept for the next
   (low).** In s12 the agent asked Q-03 with a recommendation, but the
   Q-03 row in WI-002 did not record it. In s14 (another conversation) Mike
   said "Q-03: go with your recommendation"; the agent said it had not
   given one, left Q-03 open, and asked again. That is honest and correct,
   but it costs Mike one more round. Suggested fix: when a question is
   asked with a recommendation, put the recommendation in the Open
   Questions row, so work-decide can show it in any session.

Also noted, not a toolkit bug:

- `AGENTS.md` "Versions" in this repository still says neither host reads
  this folder in place. The s03 `init` event shows Claude Code loading all
  five V2 plugins from `/Users/michaelrihm/Documents/Projects/toolkit-v2/plugins/<name>`
  (`install-everyday.md`, Finding 1).
- The Stop hook typed the docs site fact as `project`; the memory criteria
  have `reference_` for a route to a source. The agent typed "I prefer
  commit messages without the work item number" as `feedback`; the
  criteria also allow `user` for a working preference he stated. Neither
  changes what is found or how it is used.

## Files in this folder

- `evidence.md`: this file (round 2).
- `evidence-round1.md`, `sessions/`, `checks/`, `harness/`: round 1.
- `round2/sessions/`: for each run (p00, s01 to s28): `.prompt.txt`,
  `.command.txt`, `.jsonl` (full stream-json), `.summary.txt`, `.err`,
  `.exit`, `.start`, `.end`, `.sid`, `.hookstate.json`, `.gitlog.txt`,
  `.gitstatus.txt`, `.worktrees.txt`.
- `round2/harness/`: `run.sh`, `say.sh`, `summarize.py`, `full.py` (prints
  a session's full command output), `tally.py` (hook, command, and refusal
  counts).
- `round2/checks/`: `hand-rename.txt`, `backup-before-finish.txt`,
  `backup-after-finish.txt`, `git-final.txt`, `hook-and-denial-tally.txt`,
  `final-cli-state.txt`, `project-settings.json`, the two final work item
  records, the final `CURRENT_FOCUS.md` and `MEMORY.md`, and
  `memory-final/` (the whole `.memory/` folder at the end).

## Checks after the run

Run again from 22:44 UTC, on the same working tree (head `3adb722`):
`node --test "tests/**/*.test.mjs"` in `plugins/toolkit` 928 tests, 925
pass, 0 fail, 3 skipped by design; `check-skills.mjs --quiet` 0 failures,
0 warnings, 16 notes; `sync-skill-references.mjs --check` 159 copies, 0
written, 0 problems; `import-model.mjs --check` matches the approved model
folder (commit `5e7d7a0`); git-workflows tests 14 of 14 pass;
`claude plugin validate .` passed. The same results as before the run.
