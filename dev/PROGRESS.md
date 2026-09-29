# Toolkit V2 progress

Read `dev/GOAL.md` first. This file says where the work stands.

## Resume here (written 2026-09-29, before context compaction)

The lead session is `a06506e8` in the claude-toolkit folder. Its /goal is
active: finish the 11 items in GOAL.md and post the final checklist with
proof plus the plain-English report for Mike.

Running now (each writes its results to its journal and to `dev/`):
1. `wf_a6663d9f-9c8` rules/skills/memory split + enforcement: build, verify,
   fix, and installs done (toolkit, work, memory 0.3.0 in both hosts); Codex
   rerun, Claude rerun (one session at a time), and the confirmation review
   still running. Evidence: `dev/test-runs/rules-codex/`, `rules-claude/`;
   review goes to the top of `dev/final-review.md`.
2. `wf_6e6bebee-68e` every skill description says what, why, when; every
   skill folder self-contained; check-skills extended; routing spot check
   (`dev/test-runs/skill-routing-final.md`).
3. `wf_7fbb6da1-7af` rules rewritten to Claude Code best practices on the
   model branch; owner-preferences format; `dev/tools/check-rules.mjs`.
Journals: `~/.claude/projects/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/subagents/workflows/<run id>/journal.jsonl`.

When all three finish: commit (stage paths by name, `git add -f` the
scaffold model `.memory` and `.work-items`), run every check (tests,
check-skills, sync --check, import-model --check, check-rules, claude plugin
validate), fix anything left, then post the 11-item checklist with proof and
the report.

For Mike in the final report (his decisions or steps):
- Merge the model branch: `git merge toolkit-v2/approved-changes` in his
  model folder (worktree at `toolkit-v2-model-project-approved`).
- Trust the V2 hooks once in Codex `/hooks`.
- Delete test data (needs his yes): about 20 Hindsight test banks
  (`acme-crm-*`, `greet-cli-*`, `proj-p6`, `tkv2-test-*`), the Notion test area
  page and the "(safe to delete)" rows, the leftover research store
  `hindsight-v2-research`.
- How many days of automatic backups to keep.
- Open proposals in `dev/model-changes.md` ("needs your yes") and the audit
  proposals (reset-to-remote only on request in Codex; block question boxes
  in Codex; Salesforce skill reference split).
- Claude Code sign-in kept expiring during tests; Claude test sessions now
  run one at a time.

A parallel session "Notion work tracker refinement"
(`local_88e38575-4d95-4bec-8792-3936ba60ddf5`, started 2026-09-29 11:49 EDT)
works in this same toolkit-v2 folder. Before committing here, check
`git status` for files that session changed and leave them out.

Next piece of work Mike asked for: the Notion work tracker refinement. His
prompt is in `dev/next/notion-work-tracker-prompt.md`; run it in a new
session in the toolkit-v2 folder after this goal is met.

## Direction: skills-first (decided 2026-09-29; `dev/GOAL.md` "Direction change")

Status 14:40 EDT: ready to hand off. `dev/HISTORY.md` (full history, checked)
and `dev/next/handoff-2026-09-29.md` (read everything, interview Mike first)
are committed. Diagrams in `dev/diagrams/` wait for Mike's approval before
they go into a GitHub issue; where that issue lives is his call.

Status 14:01 EDT: Mike's corrections recorded in `dev/GOAL.md` ("Corrections
(Mike, 2026-09-29, after the first two diagrams)"); diagrams redrawn in chat;
handoff prompt in `dev/next/handoff-2026-09-29.md` (commits 1c634fc, 8454538,
2354215). The design review workflow `wf_4ed8e485-f07` has finished its four
reviews and is writing `dev/research/skills-first-architecture-review.md`.
The 11 finish items are replaced; a new goal waits for Mike's approval of the
architecture.

Mike chose skills and timely hooks. He asked to see the plan before any
work. Plan shown in chat: (0) snapshot commit of today's working tree;
(1) read-only research of the captured Claude Code, Codex, and Anthropic
skill pages plus OpenAI's "Harness engineering" article (captured to the
session scratchpad as harness-openai.md, not yet in ai-external-knowledge/);
(2) one short architecture document written with the Notion session:
lifecycle map, skill list with descriptions, stages and approvals, memory
save and recall with links to work items, the few small checks, reuse and
delete lists; (3) review by the Notion session, one independent reviewer,
then Mike; (4) new goal and finish list for his yes. Waiting on his yes and
on one question: build only local + Obsidian and Notion + Lore first.

### Earlier: direction question

Mike: "I told you initially not to over-engineer this ... Why can't we just
have skills that should be used, depending on what I select on a project?
Why are we creating a whole custom program called Toolkit?" His goal said
skills plus hooks (`dev/GOAL.md`, "Goal"); the build grew a `toolkit`
program of about 37,000 lines (plugins/toolkit/lib) plus 23,000 lines of
tests. Asked him: switch to skills-first (setup installs only the skills for
his choices; skills use files, `ntn`, and Hindsight directly; a few small
hook scripts for must-not-skip checks) or keep the program. Workflow
`wf_a6663d9f-9c8` (live reruns of the program) was stopped at his message;
resume with its script and run id if the program stays. Workflow
`wf_6e6bebee-68e` (skill descriptions, self-contained skill folders) keeps
running: its work is needed either way.

## Open requests from Mike (not yet placed)

- 2026-09-29: cite recalled knowledge, always (settled; `dev/GOAL.md`,
  "Cite recalled knowledge, always"). Today only memory-find cites, and only
  when it runs. Build after the descriptions workflow (`wf_6e6bebee-68e`)
  stops editing skill files: one always-on line in the model's `AGENTS.md`
  (reaches both hosts and helper agents); a "Sources" list in memory-find's
  "How to answer"; a ready-to-copy source line in `toolkit memory get` and
  `find` output; a Stop-hook check (once per turn) when the agent read a
  record with `toolkit memory get` and the reply names no source; tests; a
  real Claude Code and Codex session to see it work.

- 2026-09-29: "What would be awesome is if memories could be tied to work
  items in Notion." Reason: a decision or fact from a work item must be easy
  for the agent to find later (example: the DECISIONS.md history had to be
  dug out of a chat transcript; now written in `dev/model-changes.md` item 6).
  Today a memory names work item IDs only as plain text under "Authoritative
  records" and "Seen" (`plugins/memory/shared/record-format.md`). Proposed: a
  "Work items" relation on the Memories database to the project's Work Items
  database, filled from those IDs; the work item page shows its memories; the
  agent loads an item's memories when it starts work on it. Where to build it
  (this goal or the Notion work tracker refinement session) is Mike's call.

## Done

- Repo folder created and `git init` run (local only).
- `ntn` (Notion CLI) installed; Mike signed in (`ntn whoami` shows the
  "Notion CLI" bot in the Personal workspace).
- Ollama installed with Homebrew and running as a brew service.
- `hindsight-api` installed with `uv tool install hindsight-api --python 3.12`
  (commands: `hindsight-api`, `hindsight-local-mcp`, `hindsight-worker`,
  `hindsight-admin`).

- `gpt-oss:20b` pulled (13 GB).
- Phase 1, research: nine briefs in `dev/research/` (about 10,000 lines).
- Note added to issue 419 (Progress log comment).
- Hindsight service installed and running: LaunchAgent
  `~/Library/LaunchAgents/local.toolkit-v2.hindsight.plist` (settings from
  `dev/research/hindsight.md` section 9.1), `curl 127.0.0.1:8888/health` ->
  healthy, listening on localhost only. Log: `~/.hindsight/logs/`.
  Leftover research store `hindsight-v2-research` (stopped, 49 MB) kept; ask
  Mike before dropping it.
- `dev/ARCHITECTURE.md` written (build plan; section 12 lists Claude's calls
  for Mike to review).

- Phase 2, design pass: `dev/SKILL-INDEX.md` (26 skills, 7 agents; judged
  from three drafts); critiques in `dev/research/critique-*.md`;
  `dev/ARCHITECTURE.md` revision 2 folds them in.

- Phase 3, build (workflow run `wf_65b6dd20-1be`, 23 agents): committed as
  `afb1902`. Full suite 513 tests: 510 pass, 1 fail (a test reading a model
  project file another session renamed), 2 skipped. `claude plugin validate .`
  passes. check-skills: 0 failures after section 5 was updated.
- Notion builder made a private test page, "Toolkit V2 Notion test area (safe
  to delete)" (id in `dev/test-runs/notion-test-area.json`). Mike's real page
  was not touched.

## Blocked on Mike

- The `claude` CLI is signed out ("OAuth session expired"). Real Claude Code
  session tests need `claude auth login`. Codex is signed in.

## Notes for Mike

- Another session is editing the model project right now (it has a new Git
  repo, commit `e7c3b37` "Baseline Toolkit V2 model scaffold" at 18:22, and
  uncommitted edits). The V2 scaffold was ported from the model as it was
  around 15:00; compare again before calling item 1 done.
- A builder ran the model's `tools/kb` tests inside the model folder at 15:57,
  which created and then removed `__pycache__` folders. No file content
  changed, but folder modification times did.

## In progress

- Cleanup round (workflow run `wf_42691c62-28e`): 15 leftover items.
- Cleanup round done and committed (`46c0b62`): 554 of 556 tests pass, 2
  skipped by design (slow reflect, live Notion).
- Mike approved all 23 recommendations (GOAL.md "Approved content changes").
  Applied and verified on branch `toolkit-v2/approved-changes` (5 commits,
  head `9940854`); Mike merges with `git merge toolkit-v2/approved-changes`
  in his model folder when ready (`dev/model-changes.md`). Originally applied on a separate branch of the model repo,
  `toolkit-v2/approved-changes`, in the worktree folder
  `/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project-approved`
  (workflow run `wf_2fb1adda-6b5`). Mike's own model folder is not touched.
  `.memory/` and `.work-items/` are Git-ignored in the model, so they are
  copied into the worktree and edited there; `dev/model-changes.md` will tell
  Mike how to bring everything into his model.

- Mike's direction (evening): the model is the exact source for folders and
  file templates; memory uses Claude's mechanisms with the model's formats,
  plus Obsidian link repair for local memory. Recorded in GOAL.md and
  ARCHITECTURE.md section 0 (revision 3).

- Model alignment done and committed (`cd73489`): `plugins/toolkit/scaffold/model/`
  is an exact copy of the approved model branch (import tool
  `dev/tools/import-model.mjs`, rules in `scaffold/CONDITIONS.json`); parity
  test passes for all 24 setups; runtime reads the model's formats; local
  memory repairs Obsidian links; version 0.2.0. Suite: 630 pass, 0 fail, 2
  skipped by design. After Mike merges the approved branch, point
  import-model's default source back at his model folder and re-import.

- Live runs (workflow run `wf_f772b253-d1b`, still running after the Mac
  slept overnight): Codex install done (V2 plugins installed, off for the
  whole machine, on only in V2 projects; `dev/test-runs/codex-setup.md`).
  Salesforce run (b) round 1 finished with bugs (fixed in the next round).
  Runs (a), (c), (d) round 1 active.
- 2026-09-27: Mike's Notion page "AI Agent Second Brain" was found archived
  (done from his account at 2026-09-26 22:41 UTC; cause unknown). Mike chose
  "restore and rebuild". Restored with `PATCH is_archived false`. Rebuilt
  (workflow run `wf_41ff86e7-b26`); independent check: finish item 7 passes.
  Evidence: `dev/test-runs/notion-after.md`. Showcase row "Toolkit V2 sample
  (safe to delete)" with its own Work Items (prefix TVS) and Memory databases.

- Claude Code run (claude-a) passed end to end in real `claude -p` sessions
  with all five hooks seen (`dev/test-runs/claude-a/evidence.md`). Found:
  AI credit lines in the test project's commits (must fix: attribution
  setting + commit hook), publish-docs without a remote, temp folders,
  focus heading, memory body labels, doctor exit code.
- Routing check (`dev/test-runs/skill-routing.md`): Claude 81%, Codex 94%;
  two Salesforce overlaps.
- Lore research done (`dev/research/lore.md`); Mike chose "store in Lore's
  layout" and approved rewriting the sf-architect-solutioning description.
- Done (`f208325`): 40 official pages captured with Firecrawl into
  `ai-external-knowledge/`; `dev/research/skill-writing-guide.md` (68 rules);
  all 26 descriptions rewritten; Lore layout for Notion memory; routing
  re-tested (last round: Claude Code 97%, Codex 95%; remaining misses are
  mixed two-job messages).
- Codex sample runs round 3: local, Salesforce, Hindsight passed; Notion
  failed on one HIGH bug (design approval half-written). 77 findings in
  `dev/test-runs/open-bugs.md`.
- Mike approved (2026-09-27/28): handoff rule wording, two AGENTS.md routing
  lines, bigger skill list budget, and the four memory additions.
- Running: final fix round, workflow `wf_bf3d2b80-30f` (model branch, work
  and Notion tracker, memory and runtime, skills), each verified, then
  integration and `dev/test-runs/open-bugs-status.md`.
- Final fix round integrated (2026-09-28, not committed yet): all four
  areas' handoffs done; 77 findings sorted in
  `dev/test-runs/open-bugs-status.md` (67 fixed, 5 not a bug, 5 left for
  Mike). Versions: toolkit 0.2.4, work 0.2.6, memory 0.2.4, session-skills
  0.2.4, git-workflows 0.2.4, marketplace metadata 0.2.6. The lead commits,
  including `git add -f plugins/toolkit/scaffold/model/.memory/AGENTS.md`.
- Waiting on Mike: `ntn login`, then two live Notion checks (does
  `PATCH /v1/views/{id}` merge or replace `configuration`; does a data source
  query by Key return archived project rows) before ensure-root runs on his
  page; the "Needs your yes" list in `dev/model-changes.md`; trusting the V2
  hooks in Codex `/hooks` (then check doctor's hook-trust key).
- Next after it: one confirmation round of the sample runs (4 Codex + Claude
  Code), a final independent review, then the report with the 11-item
  checklist. Watch in the Codex round: whether the `toolkit` allow rule
  matches a command with an escaped apostrophe (`'Owner'\''s words'`).

## Now (2026-09-28)

- Final fix round committed (`9d21337`): 67 of 77 findings fixed, 5 not
  bugs, 5 for Mike (`dev/test-runs/open-bugs-status.md`). Suite 841 of 844
  pass, 3 skipped by design.
- Mike signed in again (claude and ntn, 2026-09-28 13:25) and said yes to
  all 13 decisions (GOAL.md "Decisions of 2026-09-28"). Still his: trust
  the V2 hooks in Codex `/hooks`. Earlier waiting list was: 11 yes/no decisions (the "Needs your
  yes" list in `dev/model-changes.md` plus turning the toolkit plugin on
  machine-wide and installing V2 in his everyday Claude Code).
- Running: decisions and review fixes (`wf_198da6c8-9c6`): model branch
  decisions 1-9, runtime fixes for final-review I1-I8 and minors, Stop hook
  saves unanswered memory proposals, backups, ask-first rules.
- Next after both: skill-text pass for the fixes, install V2 in Mike's
  Claude Code and Codex (decisions 10-11), final confirmation round with all
  five setups (Claude Code and Notion now signed in), re-check, report.
- Running: skill references workflow (`wf_d3c692ad-9e1`): audit, per-skill
  reference files, shared-text sync tool, review, routing spot check.
- Running: confirmation round (workflow `wf_2df5e88b-ba7`): Codex local,
  Salesforce, Hindsight; Claude Code local; final independent review
  (`dev/final-review.md`). The Notion confirmation run waits for `ntn login`.

## Also running (2026-09-29)

- `wf_6e6bebee-68e`: every skill description says what, why, and when; every
  skill folder self-contained; checker extended; routing spot check.
  Review fixes done in the working tree (not committed):
  - Descriptions: all 23 plugin skill descriptions say what, why (", so
    ..."), and when, 299 to 405 characters (`dev/SKILL-INDEX.md` section 1).
    `memory-tidy` now names "turn that lesson into a skill"; `work-finish`,
    `work-on`, `project-setup` ("starts using Toolkit V2 on a new
    computer"), and `publish-docs` (names `work-finish` and `memory-save`)
    were reworded; dated owner-decision text left `memory-save` and
    `memory-find`.
  - Self-contained folders: `project-setup` carries
    `assets/codex-toolkit.rules`, a generated copy of
    `plugins/toolkit/templates/codex/toolkit.rules`
    (`sync-skill-references.mjs` now copies `plugins/toolkit/templates/**`
    and gives a non-Markdown copy a `#` header line). Every step that copies
    an asset template into a project says to leave out its "Generated file"
    line.
  - `check-skills.mjs`: a skill's own reference that names a plugin path
    (`templates/...`, `lib/...`) fails; first words such as "Always" or
    "Tools" are not job verbs. 0 failures, 0 warnings, 24 notes.
  - Written rules: `AGENTS.md` "Skill descriptions" and
    `dev/research/skill-writing-guide.md` (D4 300 to 450 characters, D6 why
    clause, template, checks, Part 9 and 10) match what `check-skills`
    enforces. `SKILL-INDEX.md` 3.2 (memory), 5.3 (update-config,
    todoist-cli, skill-creator, obsidian-cli, graphify, machine-sync), 7.2,
    and 9.1 (decisions 5 and 6) updated.
  - Versions raised (not installed): work 0.3.1, memory 0.3.1,
    session-skills 0.2.11, git-workflows 0.2.9, sf-architect-solutioning
    0.2.2, marketplace 0.3.2; toolkit stays 0.3.1 (not installed yet).
    `claude plugin validate` passes for the root and all six plugin folders.
  - Routing check in Claude Code (project settings only, and Mike's own user
    settings, skills, and plugins) and in Codex (a scratch Codex home with
    the raised versions): `dev/test-runs/skill-routing-final.md`.
  Next steps, in order:
  1. Ask Mike before installing the raised versions (`AGENTS.md`,
     "Versions": `claude plugin marketplace update toolkit-v2`, `claude
     plugin update <plugin>@toolkit-v2`, `codex plugin add
     <plugin>@toolkit-v2`, `toolkit machine-setup`).
  2. After the live tests release `plugins/toolkit/lib/`: in
     `lib/commands/memory.mjs` (promote output, about line 1884, and
     `skillSkeleton`, about line 1899) change "what this skill does, then
     when to use it" to "what it does, why (a short ', so ...' clause), then
     when to use it, with two to four example phrases". Double each single
     quote inside the YAML skeleton line, keep its `<Fill in: what this
     skill does` start (`tests/memory/lessons.test.mjs` line 165 checks
     it), and run that test.
  3. Mike answers `SKILL-INDEX.md` 9.1 decisions 5 ("run the tests whenever
     I stop": `update-config` or `memory-save`) and 6 ("remind me to call
     the bank": `memory-save` or Todoist).
  4. The Salesforce project skill descriptions wait for Mike's yes in
     `dev/model-changes.md`.
  5. Dated owner-decision notes are still in shared sources and one skill
     (guide B12): `plugins/work/shared/helpers.md`, `team-roles.md`,
     `plugins/memory/shared/record-format.md`, `memory-notion.md`,
     `backup-and-restore.md`, `proposals.md`,
     `project-setup/references/interview.md`, and `work-check/SKILL.md`
     line 35.
- `wf_7fbb6da1-7af`: every rule rewritten to Claude Code best practices on
  the model branch, owner-preferences format, `dev/tools/check-rules.mjs`.
  Done in the working tree (not committed in this repository): model branch
  commits `f9ec2df`, `8f04125`, `d655664`, imported; `dev/tools/check-rules.mjs`
  and the `toolkit doctor` rule check (`lib/project/rule-lint.mjs`,
  `rule-checks.mjs`); `toolkit rule add|update` size, vague, and conflict
  warnings; toolkit 0.3.1; suite 1027 tests, 0 fail, 3 skipped. Record and
  15 open questions: `dev/model-changes.md`, "Rules best practices" and
  "Rules best practices: needs your yes". Next: Mike answers those; the
  owner of `plugins/*/shared/` may shorten the owner-preferences purpose line
  (same section, "Not done").
  Review fixes: model commit `0b98c16` (headings, a split bullet, "for
  example" in the org list), imported; doctor no longer reports the two
  owner-preferences purpose lines as repeats; `rule add` compares with the
  other project rules and `AGENTS.md`, prints the sections, and warns on a
  close section name; the 4 KB limit is a warning until Mike answers item 11;
  question 16 added. For the owner of `dev/SKILL-INDEX.md`: section 7.2 still
  lists `work-on`, `work-decide`, `work-delegate`, `handoff`, and
  `toolkit work lifecycle` for `keep-work-item-current.md`, and `toolkit
  memory` commands for `memory-review-and-save.md`; after `8f04125` the first
  names none of them and the second names only `toolkit memory get` and
  `toolkit rule add`.

## Rules, memory, and enforcement (2026-09-29, workflow `wf_a6663d9f-9c8`)

- Committed `b503d34`: close-out fixes and concept memory (works the same in
  built-in, Notion, and Hindsight). Confirmation review: items 1-8 met; 9
  partly; 10 open because the Codex agent still skipped the checker after
  "no agent team", and a passing remark was saved as approved.
- Mike decided (GOAL.md): instructions in rules (`owner-preferences.md` or
  machine-wide rules), procedures in skills, facts and unproven lessons in
  memory (four prefixes, `feedback_` retired, "Gotchas and lessons"
  sections, promotion to rule or skill after his yes).
- Running: build the split, make the checker and the passing-remark
  proposal enforced by the `toolkit` command, fix the review findings,
  verify, update installs, rerun in Codex and (one session at a time) in
  Claude Code, independent confirmation.
- Claude Code is signed out again (`claude auth status`); Mike asked to run
  `claude auth login`. Parallel `claude -p` test sessions are the likely
  cause, so Claude test sessions now run one at a time.
- Build done in the working tree (not committed; the lead commits): versions
  `toolkit`, `memory`, `work` 0.3.0, `session-skills` 0.2.10, marketplace
  0.3.0. Suite 1004 tests: 1001 pass, 3 skipped. `toolkit rule add|update|list`;
  `feedback_` refused and migrated (doctor, `tidy --plan`); `--lesson`,
  `promote`, rule proposals; R-B1 (approve --result and finish refuse without
  a checker verdict; `--no-independent-check --reason`) and R-I4 (the command
  saves a proposal, from the hooks' turn facts) in code; C1, F1, F2, the
  delivery re-look, and the close-out minors. Model branch commit `5293d7c`
  (`dev/model-changes.md`, "Rules, skills, and memory"), imported.
- Not done here: the Codex and Claude Code reruns, the routing rerun (R-M8),
  the model guard's double period (Mike's yes), and Mike's installs.

## Close-out (2026-09-28 evening, workflow `wf_68dc2118-661`)

- Final runs (committed `82aefe9`): Claude Code local, Codex Hindsight,
  Codex Salesforce, and Notion (real page) passed; Codex local did not pass
  only because "no agent team" skipped the independent checker. Re-review:
  finish items 1-8 met; 9 partly; 10 and 11 open.
- Mike decided: the checker always runs, even with "no agent team"; Notion-
  only projects rely on Notion history for backup.
- Mike chose concept memory with the five prefixes (GOAL.md). The first
  close-out workflow (`wf_68dc2118-661`) was stopped part way so concept
  memory could be built before the reruns.
- Running: workflow `wf_a579d931-b78`: finish close-out fixes, build concept
  memory in all backends and the model branch, verify, update installs,
  reruns in Codex and Claude Code plus a Notion and Hindsight concept check,
  independent confirmation. Then the final report.
- Close-out fixes done in the working tree (not committed): R-B1 (skill text
  plus `work set --stage 11`, `approve --result`, and `work decisions` notes
  when no acceptance-checker history note follows the last build), Notion-only
  backups, R-I1, R-I3, R-I4 (PostToolUse note), minor findings R-M1 to R-M7,
  R-M9 to R-M11, and the final-run bugs. Versions: toolkit 0.2.8, work 0.2.10,
  memory 0.2.8, session-skills 0.2.8, git-workflows 0.2.8, marketplace
  0.2.10. Still open: R-M8 (routing re-run, live), R-M12 (Mike's yes), the
  Salesforce guard's two periods (a model file; Mike's yes).
- Concept memory built in the working tree (not committed): `lib/memory/concepts.mjs`;
  `toolkit memory save --concept <key> --section <heading>` (add, replace
  with --expect, --append, --remove), `merge`, `split`, `tidy --plan`; the
  duplicate check names the concept a new fact belongs in; proposals name
  their concept and approve adds them there; `updated` in the frontmatter;
  index and list show title, summary, and updated date. Built-in, Hindsight
  (one document per concept), and Notion (one row per concept; section saves
  send update_content). Model branch commit `648bf4e` (three `.memory/`
  files), imported; `dev/model-changes.md` "Concept memory". Skills and
  shared text updated. New tests: `tests/memory/concepts.test.mjs`. Suite:
  963 tests, 0 fail, 3 skipped by design. Versions: toolkit 0.2.9, memory
  0.2.9, work 0.2.11, session-skills 0.2.9, marketplace 0.2.11. Next: the
  lead commits, then installs, reruns, and a live Notion concept check.
- Verifier fixes for concept memory (working tree, not committed): heading
  anchors encode brackets, "#", and "%", and link parsing reads balanced
  brackets; a section save, merge, split, and approve keep the concept's
  authorization line (a fact whose approval differs gets it on its Evidence
  line); Hindsight holds a local lock for every read-change-write; a one-fact
  proposal is approved only with `approve --concept <key>` (existing concept,
  new concept with --title and --description, or its own key), and saving it
  again whole with --approved-by is refused; merged records leave MEMORY.md;
  the index date falls back to last_verified; --type/--name --section keeps
  an existing summary; --append adds no second Remember label; the
  suggested heading breaks ties; find shows the matching section; rename
  retargets waiting proposals; the Stop hook shares one 11-second deadline;
  the acceptance check counts only "acceptance-checker: <verdict>". New
  tests: `tests/memory/verifier-fixes.test.mjs`,
  `tests/work/verifier-fixes.test.mjs`. Suite: 979 tests, 0 fail, 3 skipped.
  No version raise: the working versions (toolkit 0.2.9 and the rest) are
  not installed yet. Still open: the live owner-led Codex rerun for R-B1;
  the model rule `keep-work-item-current.md` wording (Mike's yes); the lead's
  call on "belongs in the concept" staying a refusal (exit 2).

## Last mile (2026-09-28, workflow `wf_93bccb2f-ec7`)

- Committed `fe918aa`: skills carry their procedures in their own
  `references/` (159 generated copies from `plugins/*/shared/`, kept in step
  by `dev/tools/sync-skill-references.mjs`); model decisions 1-9 on the
  branch (head `5e7d7a0`); review fixes (Stop hook saves unanswered memory
  proposals, duplicate check, backups, ask-first rules, plugin pointer).
  Suite 895 of 898, 3 skipped by design; routing spot check 16/16 in both
  hosts.
- Running: follow-up skill text, install in Mike's Claude Code and Codex
  (decisions 10-11), final live runs of all five setups with one fix loop,
  final independent re-review.
- For Mike in the final report: delete about 20 test banks on his Hindsight
  server (needs his yes); how many days of backups to keep; the audit's
  proposals (reset-to-remote only on request in Codex; block question boxes
  in Codex; Salesforce skill reference split); trust the V2 hooks in Codex
  `/hooks`; merge the model branch; delete the Notion test area and showcase
  rows when done.

## For the follow-up pass (from the 2026-09-28 confirmation runs)

All items below are done in the follow-up pass (next section).

Results: Salesforce (Codex) passed; local (Codex) not passed only because
an unanswered "Save to memory?" was dropped (being fixed by the Stop hook in
`wf_198da6c8-9c6`); Hindsight (Codex) not passed for the same proposal bug
plus the duplicate check; Claude Code run blocked by the sign-out (now fixed).
Small findings to fix after the running workflows:
- History note prefix: use "Owner said:" (no apostrophe) in skills, the CLI
  regex in `lib/work/ops.mjs`, and conventions; Codex breaks on `'\''`.
- `toolkit work set --title` prints a "Tell the owner" line; work-on and
  work-organize repeat tracker changes in the final reply.
- `approve --design` refuses or warns while Selected design says "Pending".
- PostToolUse direct-edit reminder once per file, not once per session.
- solution-design: helper agents start with fork_turns none.
- Moving back to 02-refinement after approval clears or re-marks the approval.
- Briefing's Codex hook-trust fact must not claim trust under
  `--dangerously-bypass-hook-trust`; a combined setup step is done only when
  every part is done.
- work-decide names every waiting decision, including memory proposals.
- Memory replies end with the next step.

## Follow-up pass (2026-09-28, workflow `wf_93bccb2f-ec7`, not committed yet)

Every open follow-up that needed no decision from Mike, from the list above,
the `skill_text` lists of `wf_198da6c8-9c6`, the open items of
`wf_d3c692ad-9e1`, and the minor items of `dev/final-review.md`. Versions:
toolkit 0.2.6, work 0.2.8, memory 0.2.6, session-skills 0.2.6, git-workflows
0.2.6, marketplace metadata 0.2.8 (sf-architect-solutioning unchanged).

- Runtime: doctor and the briefing warn about a hook failure in
  `<git common dir>/toolkit-v2/hook-errors.log` from the last 3 days
  (`hook-errors`); `toolkit memory approve` finishes a proposal the Stop hook
  saved (its "Do not rely on this" words go), so the hook note, the CLI, and
  the skills agree; the direct-edit reminder comes once per file; a focus
  setup line is done only when every step it names is done, and Codex hook
  trust is read from `~/.codex/config.toml`, never from a hook that ran
  (`--dangerously-bypass-hook-trust`); the automatic backup never replaces a
  larger backup of the same day and leaves out `.memory/.obsidian/`; CLI fix
  lines say 'Owner said:', use single quotes, and
  `claude plugin enable ... --scope user`; `CONDITIONS.json` takes the two
  Salesforce paths out of `publish-project-documents.md` in projects without
  Salesforce (final review M5).
- Tests: `tests/hooks/timing.test.mjs` (every hook, both hosts, at most half
  its timeout in a busy project; under 2.5 seconds and silent outside a V2
  project), `tests/hooks/follow-up.test.mjs`,
  `tests/project/follow-up.test.mjs`. Suite: 913 tests, 910 pass, 3 skipped by
  design.
- Skill text: "Owner said:" examples; ask-first commands with
  `require_escalated` in Codex and flags after the command words; design
  approval refuses while "Selected design" is pending; `fork_turns` none;
  work-on and work-organize repeat tracker changes in the final reply;
  work-on step 3 "ask me questions first" (routing O21); work-check step 1
  finds the item as work-on does; work-decide names every waiting decision
  first; memory-save lists the six keep phrases, the Stop-hook notes, and ends
  every reply with the next step; Salesforce sandbox deploy lines in
  work-finish, `closing.md`, work-on, and project-setup; doctor finding table
  in `repair-and-update.md`; backup folder naming and the kept folder;
  GitHub label list; Git rules name the automatic backup.
- Docs: ARCHITECTURE sections 5 and 6, AGENTS.md layout rows, SKILL-INDEX
  work-on steps, README (kept backups, hook failures), model-review.md
  (M8), AI co-author trailers in `dev/test-runs/claude-a/` and
  `open-bugs.md` replaced with "<AI co-author line>" (M9).
- Not done, not Mike's but needs a live run: the routing re-check for the
  changed skill bodies (work-on step 3, work-check step 1) and the proposed
  memory-tidy and publish-docs description rewrites (each needs a routing
  run in both hosts first).

## Final confirmation round 1 fixes (2026-09-28, not committed yet)

The 34 findings of the five final runs (`dev/test-runs/final-*/evidence.md`).
Versions: toolkit 0.2.7, work 0.2.9, memory 0.2.7, session-skills 0.2.7,
git-workflows 0.2.7, marketplace metadata 0.2.9. Installed in Mike's Claude
Code (`claude plugin update`) and Codex (`codex plugin add`, then
`toolkit machine-setup`: toolkit on for every folder, the other five off;
`~/.codex/config.toml` and `~/.claude/settings.json` are byte for byte as
before). Suite 928 tests, 925 pass, 3 skipped by design; git-workflows 14 of
14.

- Code: ensure-root leaves a deleted property's column out of the "All
  Projects" view update and makes a view failure a warning (ids still saved);
  a hand rename in Notion is in the briefing's quick check and retitles the
  Solution Design page; design text with unfenced work_item/status/approved
  lines is read as the header; a proposed design is checked for the
  template's sections at save and at approve; `work next` counts memory
  proposals; a parent whose phases are all delivered by sub-items has no
  "no task lines" warning; approvals note a stale Next action; `work finish`
  says when nothing was backed up (Notion tracker and memory) and init says
  so for a backup folder; the Stop hook saves a "you ..." summary with the
  owner's name (and approve rewrites older ones), types an owner preference
  as `user`, cuts long titles at a clause, and keeps the type word out of the
  key; Codex deny reasons end without a period; publish-docs puts the save
  workspace in the ignored `.claude/worktrees/` and `publish --workspace`
  runs from the project folder; handoff-verifier may run
  `toolkit work decisions` and `toolkit doctor`.
- Skill text: owner-led delivery keeps the design critic and the acceptance
  checker; tell the owner about a changed approved design; work-decide names
  what still waits after each answer; exact quotes in "Owner said:" notes;
  focus off before `work finish`; delivery offer with a recommendation;
  memory-save: a passing mention is inferred, "proposal" only after a
  `--proposal` save, a recommendation needs evidence, a refused delete is not
  a retire, project-document offers go to the focus when unanswered, the
  approver's full name; project-setup: warnings do not block init, never
  change the model templates' two-space line breaks, never edit Notion with
  `ntn api` after an ensure-root failure; work-status repeats hand changes.
- For Mike: the registry columns in his "All Projects" view are listed but
  hidden (from the setup agent's raw PATCH in the Notion run); showing them
  is his step in Notion. Whether Notion projects should get an automatic
  `toolkit memory export` at work-finish and handoff (decision). The model's
  `PROJECT-ROADMAP.md` two-space line breaks could become backslash breaks
  (model change, needs his yes). `AGENTS.md` "Versions" says neither host
  reads this folder in place; Claude Code does (`install-everyday.md`,
  Finding 1).

## Pending fixes (collect; fix after the sample runs)

Status 2026-09-28: every item below is fixed in the working tree by the final
fix round (`dev/test-runs/open-bugs-status.md` names the file and test for
each). The `replace_content` item is handled too: a targeted edit comes
first and a whole-page replace is the last resort. The `caffeinate` line is a
note about this Mac, not a fix. Two Notion checks need Mike's `ntn login`
first (see "In progress").


- (claude-a) AI credit: add `"attribution": {"commit": "", "pr": ""}` to the
  toolkit settings fragment; pre-tool hook denies commits or PRs with AI
  credit lines; doctor checks it.
- (claude-a) publish-docs with no remote; skills' temp folders on Claude
  Code; focus heading and "Last updated"; memory body labels; doctor exit
  code with only other-host warnings; test isolation command in
  ARCHITECTURE section 10 needs `--settings` enabledPlugins for `@inline`.

- Recent History rows are appended oldest first; the template says newest
  first (`lib/work/model.mjs` appendSectionRow/appendHistory).
- Parent and sub-item links are not written into the body text (Related
  items, Roadmap Sub-items column) in Notion items.
- `ensure-root` does not add the registry columns (Key...) to the "All
  Projects" view; `ensure-project` leaves the project row's Status empty.
- "WORK-ITEM.md" in page text becomes an auto-link to http://WORK-ITEM.md in
  Notion; write it as code text.
- Notion "Design approved" left blank instead of "no" on new items.
- `replace_content` on a page puts replaced text blocks in the Notion trash;
  prefer targeted edits where possible.
- `caffeinate -i -s -t 28800` runs in the background so the Mac does not
  idle-sleep for 8 hours (closing the lid still sleeps it).

## Next

- Commit run evidence as runs finish; Claude Code runs after `claude auth login`. Then: Notion rebuild of Mike's real page; Codex
  install and sample runs; Claude runs once Mike signs in.
- (Done items below kept for history.) Model-alignment rework (ARCHITECTURE section 0): import-model tool and
  CONDITIONS.json, parity test, work engine and memory drivers on the
  model's formats, Obsidian link repair, skills and rules text updated,
  model-review.md rewritten as a checklist for Mike. Rebuild Mike's real Notion page (ensure-root). Sample runs
  (a)-(d) in real Claude and Codex sessions. Independent review. Report.
- Phase 3, build. Phase 4, sample runs and fixes. Phase 5, final review and report.
