# Toolkit V2 progress

Read `dev/GOAL.md` first. This file says where the work stands.

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
