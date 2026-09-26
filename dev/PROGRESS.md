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

## In progress

- Phase 3, build (workflow `toolkit-v2-build`, run id `wf_65b6dd20-1be`):
  core runtime, then six builders in parallel (scaffold + model review, work
  engine, memory engine + Hindsight, Notion layer in a private test page,
  work/memory/project skills, ported plugins), each checked by an independent
  verifier and fixed once; then hooks/init/doctor/brief; then packaging and
  `claude plugin validate`. Builders do not commit; the lead commits after.

## Next

- Commit the build. Rebuild Mike's real Notion page (ensure-root). Sample runs
  (a)-(d) in real Claude and Codex sessions. Independent review. Report.
- Phase 3, build. Phase 4, sample runs and fixes. Phase 5, final review and report.
