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

- Model-alignment rework (workflow run `wf_8b29f392-3ee`): import tool,
  CONDITIONS.json, parity test, runtime on the model's formats, Obsidian link
  repair, skills text, version 0.2.0.

## Next

- Commit the alignment. Then: Notion rebuild of Mike's real page; Codex
  install and sample runs; Claude runs once Mike signs in.
- (Done items below kept for history.) Model-alignment rework (ARCHITECTURE section 0): import-model tool and
  CONDITIONS.json, parity test, work engine and memory drivers on the
  model's formats, Obsidian link repair, skills and rules text updated,
  model-review.md rewritten as a checklist for Mike. Rebuild Mike's real Notion page (ensure-root). Sample runs
  (a)-(d) in real Claude and Codex sessions. Independent review. Report.
- Phase 3, build. Phase 4, sample runs and fixes. Phase 5, final review and report.
