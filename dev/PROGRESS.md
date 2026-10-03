# Toolkit V2 progress

Read `dev/GOAL.md` first. This file says where the work stands.


## Current State (2026-10-02)

The Toolkit V2 build is tracked as work items in the Notion project "Toolkit V2" (https://app.notion.com/p/Toolkit-V2-3edb381da17681eeb7ddd0a6d662f9b2). Older sections below are history.

### Now (in progress)
- One Notion project template, 0.7.7: Mike's Projects database now has one template, "Project" (work items and memory). Setup makes every Notion project from it and removes the part kept elsewhere; the steps were tested live on two throwaway projects (trashed). Landed (485caff). Its work item template was in Notion's trash; restoring it through the API did not give Mike a working template, so he made a new one in the app and the agent rebuilt its four views (tested on a throwaway project). 0.7.8 replaces the toolkit's API-restore instruction: the owner restores in the app, or a new template is built.
- A review folder where Mike can read and edit every file a project gets, then hand his edits back: next, after this commit.
- Goal-gap fixes, 0.7.9 (Mike's yes, 2026-10-02): the agent keeps the whole work item true (each task's status and who does it, each phase's status, every field); the lead sets its own task In Progress and adds a task before work no task covers; work the item's goal does not need, and a defect outside the requirements, become new Backlog items; a started item is listed under "Now". Notion tasks gain Status and "Who does it" (pinned at the top of each task page), with migration steps in "update the toolkit". Next: run "update the toolkit" on the Toolkit V2 Notion project.
- Skills reminder on every prompt, 0.7.10 (work item TKV-9, Mike's request 2026-10-02): the existing prompt-reminder.mjs now prints one line before each answer telling the agent to check the project's skills and use every one that fits, then the memory hint when a phrase matches. 4 lines added to the hook (56 to 60); settings snippets unchanged, so Codex needs no new hook trust. Landed on main (e2f1962).
- Levels structure, 0.8.0 (TKV-7, Mike's yes, 2026-10-02), landed on main 2026-10-03 with his yes: the same levels in every tracker. The project has phases (P01) and its own tasks (PT-01); a top-level item has phases (P1) with tasks (P1-T01) and level-2 sub-items; level-2 and level-3 sub-items have one plain task list (T01). managing-work-items has one "Levels" section; the work item template has a sub-item form; each tracking-work-items skill says where project phases and tasks live (local PROJECT-ROADMAP.md and work-items/PROJECT-TASKS.md; Notion rows with no Work item and three new views; GitHub milestones and a pinned "Project tasks" issue); PROJECT-ROADMAP.md has no work units and is local only; "update the toolkit" converts older sub-items that have phases. Notion also gets Task type and Phase type (formulas from Work item), the project page opens Phases and Tasks on the project's own rows, and setup checks the shared "Project" template against the layout before copying it. Added 2026-10-03 (Mike's yes to all five recommendations): a Notion task has one status field, Status of Notion's status type, and no "Done" checkbox ("update the toolkit" converts an older project; the owner makes the one retype click); the shared "Project" template always matches the toolkit (R-11 confirmed); "Untracked to-dos" is gone from Current State (a project to-do goes to its work item, a project task, or a new Backlog item); "By project phase" is the first Work Items tab. Not run live: the Notion test area is gone, so the new views, the two formulas, and the Done-to-Status steps were reviewed but not run against Notion. Next (Mike's choice, 2026-10-03): run the new Notion steps on a throwaway project made from the template first; then, with his yes, on the Toolkit V2 project and the shared template (TKV-7, task P1-T11).
- The new Requirements layout, 0.8.1 (TKV-11, Mike's yes, 2026-10-03): the Notion work item page text now matches the work item template Mike rewrote in his "Project" template (the note at the top, level-1 section headings, the Requirements section, "Linked Github PRs"); local files and GitHub issues use the same Requirements layout ("Requirement <number>: <short name>" with the original requirement word for word, its goal, a numbered requirements list, and numbered Acceptance Criteria); `managing-work-items` writes requirements in it and records approval in "Requirements approved" and Questions and Answers; text in angle brackets is an instruction, so no item an agent creates or changes keeps any; setup and "update the toolkit" never change the owner's parts of the template back and never rewrite an existing item's Requirements. The same branch holds the fixes from the live test of the 0.8.0 Notion steps (`dev/test-runs/notion-levels-0.8.0.md`). On its own branch, not on main yet. Still open: the wording, overlap, and best-practices reviews, and a live Notion test of filling a new item from the new template.

### Just done (2026-10-01 to 2026-10-02)
- Skill cut, 0.5.0 (7b51260). Hindsight on the VPS, 0.5.1 and 0.5.2 (855f1fc, 3169dd3). Work tracking rebuilt as managing-work-items and tracking-work-items, 0.6.0 (a0eda0b). Memory rebuilt as managing-project-memory, storing-project-memory, and using-notion-cli, 0.7.0 (49b1e8f). Memory clean-ups, and V2's own copy of the starter files is now the source, 0.7.1 (b62520c).
- Claude Code mods researched (1fa01f6): dev/research/claude-code-mods.md and dev/research/mods-for-memory.md.
- Notion project "Toolkit V2" made, with the Backlog item "Evaluate Claude Code mods".
- DragonFly move review (read only, kept off Git because it names the client): what moving DragonFly from the old toolkit to V2 deletes, keeps, converts, and adds.
- The voice-to-text line is now in the repository's AGENTS.md, the setup skill, and every project's AGENTS.md (0.7.2).

### Waiting on Mike
- Start the live tests of the rebuilt work-tracking and memory skills (about an hour, test sign-ins).
- After the tests: turn the toolkit plugin on in his Claude Code and install the new version in Codex.
- DragonFly: the five decisions in the review (which computer, where memory lives, which production guard, one file for DragonFly's own safety lines, keeping the data-change READMEs).
- Mods: which supervisor checks to build, if any, after the tests.
- Hindsight live run whenever he sets up a Hindsight project: his key, the add-on install, the dashboard sign-in.

### Still to do
- A move-over step in project-setup for projects on the old toolkit: list what is deleted, kept, converted, and added; act after the owner's OK.
- Rebuild the Git skills and the session skills with the same pattern.
- Routing test in both apps for the renamed skills.
- From the DragonFly review: V2's production guard lets `sf apex test run` through against production; make it block that too (needs Mike's yes).

### Next session starts with
- Read this section, then the Notion project "Toolkit V2".
## Resume here (2026-09-29, overnight build)

### Hindsight on the VPS (2026-10-01, branch claude/hindsight-vps, toolkit 0.5.1, not committed)

- Built: `references/hindsight-on-vps.md` replaces `hindsight.md` and
  `installing-hindsight.md`. It covers the server and key, one bank per
  project, Hindsight's coding-agent add-on pointed at the VPS, the
  save-and-search check, the dashboard, checking a Hindsight project, and a
  new computer. Model commit 5a3d52b (memory rule) is copied into the
  scaffold copy. Decisions: `dev/GOAL.md` ("Hindsight setup decisions").
- Reviewed once: 13 findings, applied except the routing test, which needs
  live sessions.
- Next: the wording, overlap, and best-practices reviews on the changed
  text, the routing test in both hosts for the model's Hindsight routing
  lines, then commit (stage by name; two new files are untracked and two
  references are deleted). Mike's steps: install the add-on, enter the API
  key in his Terminal, trust the add-on's hooks in Codex `/hooks`, sign in
  to the dashboard. None of these has been run.

### Now (2026-10-01, about 17:10)

- Toolkit 0.4.9 (3e3ae62): morning fixes (0.4.8, 169bbc8: memory question
  after a project-wide decision, approved-requirement change goes back for
  approval, all item fields read, end-of-reply check dropped) and the Notion
  database templates (merge 0fd99e6, review in
  dev/reviews/2026-10-01-notion-db-templates-review.md).
- Mike's real Notion: templates are now Projects database templates;
  "Project: work and memory" is the default; template cards hidden;
  "Template check (safe to delete)" exists. Open for him on #6: Q-01
  (layout groupings) and Q-04 (deleting test leftovers). The Notion session
  has nothing else open.
- Claude Code test home signed in again by Mike at about 17:00. Running:
  workflow wf_f39029f9-a02 (update projects to 0.4.9, stage 3 re-checks,
  Claude Code routing after-run on Opus with --max-turns 3, stage 4 Claude
  Code half on Sonnet, one fix round with reviewers, release, tracker).
- Also running (17:20): Notion layout groupings by a Chrome helper agent
  (Mike: "do this in Chrome by hand"); Notion deletions by the Notion
  session (now: "Toolkit V2 templates" and "Project workspace"; later, after
  the Claude Code tests: the test area and "Template check"); the skill
  best-practices audit, workflow wf_c142bee6-3e8 (3 Opus auditors, report in
  dev/reviews/skill-audit-2026-10-01/, then an Opus lead plans a behavior-preserving refactor, Sonnet agents apply it, the three reviewers check it, and a short routing test confirms no behavior changed; behavior changes held for Mike).
- Skill audit done: dev/reviews/skill-audit-2026-10-01/report.md (commit
  ad1cfbb; 70 checks; 64 wording/layout fixes, 49 held). Pass 1 (wording
  and layout only, behavior kept) runs in worktree
  .claude/worktrees/skill-audit-fixes on branch claude/skill-audit-fixes,
  workflow wf_b7f9f051-899 (Opus lead, Sonnet executors, reviewers); merge
  into claude/v2-build after the Claude Code tests finish. The 49 held fixes
  wait for Mike: he is reading report section 5 first (2026-10-01).
- Waiting on Mike: the ~40 small tracker questions (he is reading them);
  scrubbing raw transcripts before any push (#9); merge approval.

### Overnight results (2026-10-01, by 08:30)

- Stage 3 done: commit 08231ab (0.4.5). Claude Code re-runs blocked: its
  test sign-in expired ("OAuth session expired and could not be
  refreshed"); Mike signs in again.
- Applied as one change, reviewed by the three checklists: 1d5bf73 (0.4.6;
  model commits 7a6928d, dfc6ba5, later 593d423): the AGENTS.md routing map
  (155 to 180 lines per setup), the main rule, Next action forms, every
  approved review answer, the earlier team offer, the voice line copy.
- Best-practices sweep (26 fixes), Codex routing after-run, Codex update
  path, and stage 4 Codex runs: e82954a (0.4.7). Codex routing 68 of 84 by
  the strict rule, 82 of 84 counting the work find read as the item read
  (#4 Q-06). Stage 4 Codex: Salesforce 19 of 27 checks pass, iOS Notion 18
  pass, 8 partly, 3 fail. Bugs to fix next: no "save to memory too?" after
  a project-wide decision; an approved requirement changed inside a design
  without asking; the iOS simulator launched after "dont deploy anything";
  a hand-made Phase change not noticed; update.md issues.
- Open questions for Mike: in the tracker issues (#1 to #7), each with a
  recommended answer. Raw transcripts in 08231ab must be scrubbed before
  any push.
- Morning answer applied in 0.4.8 (Mike, 2026-10-01: "Drop it"; 126
  checks, 1 false alarm, 0 real catches): the
  end-of-reply check (the `Stop` hook of type `prompt`) is out of the three
  Claude Code settings snippets, `skills-hooks-settings.md`, `update.md`
  (an old one in a project is listed and removed after his yes), `README.md`,
  `dev/tests/hooks.test.mjs`, and the table in
  `dev/research/skills-first-architecture.md` section 6. The model never
  held it (its only `Stop` hook is the Salesforce graph hook), so no model
  change. Diagram 2 in `dev/diagrams/` still shows the row. The reminder
  hook and the rules that cover saving stay. Mike also answered "Leave
  them on" for the ChatGPT-account plugins in Codex (no change).
- 0.4.8 (this release): the three bugs from the stage 4 Codex runs are
  fixed in the shared texts and skills (re-test pending, #7): the "save to
  memory too?" question now comes as the reply's one question after a
  project-wide decision; an approved requirement changed inside a design
  choice goes to `work-refine` for his approval first; every read of an
  item checks every routing field, so a hand change to Phase is noticed.
  Also in 0.4.8: the `.codex/hooks.json` description merge rule and check,
  and the order for fitting a too-long `AGENTS.md` (`update.md`). Not
  applied, because they are open questions for Mike: the simulator as
  deploying (#7 Q-10), the bare "ok" rule (#7 Q-08), the handoff on "thats
  enough for today" (#7 Q-06), and the rest of the ~40 tracker questions.
  Notion skill files were not touched (the Notion session owns them): the
  "one question" order and the routing-field read still need copying into
  the Notion skills.

### Overnight plan (Mike, 2026-09-30, before bed: "routing plus review";
### "we can run stage 4 overnight too, then we just keep progressing things")

In order, each step reviewed with the three checklists in `dev/reviews/`
and run cheaply (Sonnet for mechanical work and test driving; see
`dev/GOAL.md`, "Cost and model for tests"):
1. Stage 3 finishes (workflow `wf_eeefdaec-4be`): Codex routing and hooks,
   fixes, re-runs, commit. Check its evidence for Mike's email and client
   org names before any push.
2. Issue #1 becomes the build's work item with sub-issues (workflow
   `wf_42387678-99d`); send the Notion session its sub-issue number; keep
   every sub-issue current after each step below.
3. Apply, as one change: the routing and AGENTS.md report's 5
   recommendations, the baseline review's recommended answers (111
   questions, by the "situation first, trigger words as insurance"
   principle), the earlier team offer, the voice-to-text line copy. Model
   changes on the model branch as Mike Rihm, listed in
   `dev/model-changes-2026-09-30.md`. Routing test before and after in both
   hosts.
   DONE 2026-10-01. Model branch commits 7a6928d (AGENTS.md as a map; work
   items name the next skill) and dfc6ba5 (the review answers that change a
   model file). The build side (skills, shared texts, setup references,
   hook text) and the refreshed model copy (matches model commit 593d423)
   are in the toolkit 0.4.6 release commit. The routing test after the
   change is not recorded in `dev/test-runs/` yet.
4. Full best-practices review (`dev/reviews/best-practices-review.md`) and
   its fixes.
   DONE 2026-10-01. Model branch commits e189a8e and 593d423 (two review
   rounds on AGENTS.md, the Next action form, and the roadmap line); the
   build-side fixes are in the toolkit 0.4.6 release commit. Checks at
   0.4.6 passed; the largest setup's AGENTS.md is 179 lines and 20,236
   bytes once setup removes the fill-in guide.
5. Stage 4 with a short targeted plan, Sonnet drivers.
6. Morning report for Mike. Put to him, as separate yeses: (a) switch the
   real Notion templates to Notion database templates (the Notion
   session's final recommendation, commit 0c34b28 on
   worktree-notion-work-tracker: project templates as Projects database
   templates with "Project: work and memory" as default; an empty-titled
   default Work Items template; every Work Items view filtered "Work item
   is not empty"; queries skip the templates list; untitled cards listed
   for him, never deleted); (b) the clicks in his real Projects database
   (by Chrome or by him); (c) later, deleting the plain "Toolkit V2
   templates" page and the test area. The edit lists are ready, not
   applied: dev/test-runs/notion-db-template-edits.md, commit 450dd8a on
   worktree-notion-work-tracker (before and after text per file, each with
   its Notion source; section 11 is the click-by-click migration). Notes
   for Mike: queries use the same empty-title filter as the views; the
   no-Projects-database fallback is removed (stop and ask; does not affect
   him); until he says yes to deleting it, new projects also get a copy of
   the old plain "Work item template" page, which nothing reads.

### Stage 3 results (workflow `wf_eeefdaec-4be`, committed 2026-10-01)

Evidence: `dev/test-runs/v2-skills-first/`, one folder per step; each
`evidence.md` starts with its result, and `rerun-1.md` and `rerun-2.md` hold
the two fix rounds. The toolkit went from 0.4.3 to 0.4.5, installed in both
test homes.

- Onboarding: 6 live setups, all worked. Claude Code: `sf-greenfield`
  (local, Salesforce; second try, the first read a production org Mike had
  not named, now fixed), `ios-money-notion` (Notion work and memory, prefix
  `IOC`), `ios-money-github` (GitHub Issues, Hindsight bank
  `tkv2-test-ios-github`, pushed to `Mar5929/toolkit-v2-test-ios`),
  `sf-greenfield-notion` (Notion work prefix `SFN`, local memory,
  Salesforce). Codex: `sf-greenfield` and `ios-money-notion` (prefix `IOX`),
  each set up twice more on fresh copies (`-r1`, `-r2`) to check the fixes.
- Routing, 3 runs per request: Claude Code 77 of 81 right first, Codex 76
  of 81. With Mike's own skills and plugins visible: Claude Code 60 of 63,
  Codex 26 of 27. No competing skill (Notion plugin, `todoist-cli`,
  `update-config`, `project-init`, and the rest) won in either host. The
  one real miss: a finished task the owner describes without naming it ("I
  made the sandbox, mark it done").
- Hooks: every Claude Code hook row fired in real sessions (162 hook runs,
  all exit 0). Codex: three of four rows fired; the helper reminder did not,
  because Codex names its helper tools differently. The corrected matcher
  was proven live.
- Fixed in two rounds (0.4.4, then 0.4.5): 21 project-setup findings (never
  read a Salesforce org the owner did not name; one question per message;
  "none yet" for an org that does not exist; nothing left outside the
  project); the three track skill descriptions now cover a task the owner
  says is done; `ntn api` calls end with `< /dev/null` and never `pkill`;
  the handoff check reads Notion with `ntn`, not the connector; no plan
  tool in `codex exec`; the Codex helper matcher; the plugins-off lists;
  the end-of-reply check and pasted notes; the prompt reminder's phrases;
  Notion body files no longer left in `/private/tmp`.
- Checks at this commit: both `claude plugin validate` runs pass;
  check-skills passed (0 errors, 16 warnings on Mike's own Salesforce
  skills); check-rules passed (2 warnings); 28 of 28 hook tests pass. No
  fixer changed the model branch. The model copy matches model commit
  35e2177; only d9f61ef (voice-to-text) waits for the refresh below.
- Still open (each with its exact fix in the step's latest `rerun-*.md`):
  - Blocker: the Claude Code test home is still signed out. At 03:22 on
    2026-10-01, after Mike ran the sign-in again, `claude auth status`
    still printed `"loggedIn": false`, and the home's `.claude.json` has not
    changed since 2026-09-30 18:37. A third try of the same command will
    not help; the sign-in is not being saved for this folder. Every Claude
    Code re-run waits on it: `cc-onboard-ios-github-hindsight`,
    `cc-onboard-sf-notion-local`, routing R04, R12, and R22, and the s04
    and s13 end-of-reply checks.
  - Must-fix, Codex (`cx-routing` round 2, finding 1): add `[skills]` and
    `max_context_tokens = 10000` to `codex-plugins-off.toml`, with the
    `skills-hooks-settings.md` and `dev/tests/hooks.test.mjs` edits, so the
    ChatGPT account plugins no longer make Codex cut every description.
  - Should-fix: `prompt-reminder.mjs` line 8 (recall questions such as "is
    that what we decided?" print the decision hint again, `cc-routing`);
    `finishing.md` "The commit offer" (stage files from
    `git status --short --untracked-files=all`, never a folder,
    `cx-onboard-sf-local`); `finishing.md` line 122 (the after-commit
    self-check sets off Codex's after-commit hook, `cx-hooks`).
  - Questions for Mike, for the morning report: keep the end-of-reply
    check; may agents read his own `~/.claude` and `~/.codex` to check a
    setup step (recommended: no); the `AGENTS.md` routing line for a
    described task (recommended: not yet); the ChatGPT account and OpenAI
    plugins in V2 projects (recommended: the `[skills]` fix first, then
    test again); a `[skills]` line or switching off the six older
    claude-toolkit plugins in his own `~/.codex/config.toml`; moving one
    client's rules out of `~/.codex/AGENTS.md`.
  - Before any push: 129 evidence files hold Mike's email address. Check
    the evidence for client org names too (overnight plan, item 1).
- Test projects, each its own Git repository, on 0.4.5 and clean:
  `/Users/michaelrihm/.toolkit-v2-test-projects/claude/` `sf-greenfield`,
  `ios-money-notion`, `ios-money-github`, `sf-greenfield-notion`,
  `routing-local`, `routing-notion`, `routing-github`; and
  `/Users/michaelrihm/.toolkit-v2-test-projects/codex/` `sf-greenfield`
  (plus `-r1`, `-r2`), `ios-money-notion` (plus `-r1`, `-r2`),
  `routing-local`, `routing-notion`, `routing-github`. The
  `routing-empty-*`, `remote-plugin-probe-*`, and `routing-local-rs2-*`
  folders are routing probes, not projects to keep working in.
- Next: stage 4 (overnight plan item 5; items 2 to 4 come first in that
  list). The end-to-end tests continue in the onboarded projects above,
  following `dev/test-runs/v2-skills-first/stage-4-plan.md`. Claude Code
  stage 4 sessions wait on the sign-in.

- Where: branch `claude/v2-build`, worktree `.claude/worktrees/v2-build`.
  Nothing is merged to `main` or pushed until Mike says yes.
- Goal: the finish list at the top of `dev/GOAL.md` (approved 2026-09-29).
  The build plan is below under "Build plan".
- Stage: 2 of 5 (build) is in progress. The old program is deleted on this
  branch. `plugins/toolkit/` holds one skill, `project-setup`, with its
  shared skills, skill sets, Salesforce skill, three hook commands, and
  settings snippets. The committed copy in `assets/model/` matches the
  model branch at 35e2177 (the eighth model commit of 2026-09-30: the
  Hindsight routing line now matches the local and Notion lines). 45a9e2d
  before it holds the Current state edits and the memory find routing
  lines, all listed in `dev/model-changes-2026-09-30.md`. Stage 2c
  (build commit bf4d584) fixed every review finding but three questions
  for Mike (below, "Open questions from stage 2c"); its last fix round
  was not re-checked, so stage 3 starts with one read-only check of it. The model branch
  folder has no uncommitted edits.
- Open questions from stage 2c (in the report for Mike; nothing waits on
  them): (1) two hook reminders print nothing on an error, but the Code
  limit says "prints one line"; recommended: change the rule to "prints at
  most one line". (2) Skills say never use the question box; Mike's own
  quiet-while-working rule says use it; recommended: ban it in Codex only.
  (3) work-on always makes a new worktree; Mike's parallel-agent rule says
  stay in the app's worktree; recommended: build there and rename its
  branch to the item's branch name.
- Model commit d9f61ef (the voice-to-text lines in `AGENTS.md`, Mike
  2026-09-30) is on the model branch but not yet in `assets/model/`: the
  stage 3 onboardings were running against the copy. Refresh the copy
  (AGENTS.md "Refresh the model copy") once stage 3 finishes.
- For Mike, later: he wants to review the model's `AGENTS.md` in full
  (Mike, 2026-09-30).
- After stage 3, before stage 4: make the delivery offer earlier (Mike,
  2026-09-30, `dev/GOAL.md` Interview answers, "When the product-owner and
  agent-team offer is made"). Text only: one step in `work-refine`
  SKILL.md (after the first playback, a clearly large item with no
  `delivery` answer opens `work-delegate`; the same when an item grows
  large), and one line in `work-delegate` references/delivery-offer.md
  section 2. `work-on`'s check stays. No description changes.
- After stage 3, also: (1) apply the verified findings of the full wording
  and overlap review (`dev/reviews/2026-09-30-baseline-review.md`, being
  commit 93c4496: 29 overlap and 1,032 wording findings, 111 questions in
  section 4), each fix re-read by a reviewer. Nothing is applied until Mike
  has read section 4 and answered (Mike, 2026-09-30: "Wait, I'll read the
  file");
  (2) run the wording review on every skill line stage 3's fix rounds
  changed (stage 3 started before the review rule, so its fixers had no
  reviewer); (3) after any description change, the routing test again in
  both hosts. Every later workflow that edits skill text includes these
  review steps (`AGENTS.md`, "Wording and overlap review").
- Checks that exist now, run from the repository root:
  - `claude plugin validate .` and `claude plugin validate ./plugins/toolkit`
  - `node dev/tools/check-skills.mjs` (add `--model <folder>` to compare
    the templates with the model worktree instead of the copy)
  - `node dev/tools/check-rules.mjs --dir plugins/toolkit/skills/project-setup/assets/model`
  - `node --test 'dev/tests/*.test.mjs'`
- Left to do: the routing test (finish item 4, both hosts;
  include `notion-work-track`, `notion-work-find`, `notion-memory-save`,
  `local-work-track`, `github-work-track`, and `work-finish`, whose
  descriptions changed,
  and the request "mark task 3 done" (a track skill, not `work-finish`) in
  local, Notion, and GitHub projects; "help me plan this" and "design this"
  in local and Notion memory projects (`work-refine` or `solution-design`
  must open before `local-memory-find` or `notion-memory-find`, whose
  descriptions changed); "why did we" in local and Notion memory projects
  (`local-memory-find` or `notion-memory-find` must open); also one run
  per host with Mike's real user
  skills and plugins visible, as `dev/research/skills-first-architecture.md`
  section 11 says), the test projects (items 5 to 9), the independent
  review, and the report for Mike (item 11).
  - In the runs with Mike's real plugins visible, test these pairs, 3 runs
    each, in both hosts where the competing skill exists: "add a task to
    phase 2" in a Notion project (`notion-work-track` against
    `Notion:create-task`, `Notion:tasks:plan`, `Notion:tasks:build`, and
    `todoist-cli`) and in local and GitHub projects (the track skill
    against his user skill `todoist-cli`, where his machine-wide
    `CLAUDE.md` also sends task work to `td`); "help me plan this <Notion
    page link>" in a Notion project (`work-refine` against
    `Notion:tasks:plan`); "build it" and "pick up WI-31 <Notion page
    link>" in a Notion project (`work-on` against `Notion:tasks:build`);
    "show me WI-31" in a Notion project (`notion-work-find` against
    `Notion:find` and `Notion:search`); "what did we decide about the
    personas" in a Notion memory project (`notion-memory-find` against
    `Notion:search` and `Notion:find`); "mark task 3 done" in local,
    Notion, and GitHub projects (the track skill against his user skill
    `todoist-cli`); "clean up memory" in local and Notion projects
    (`local-memory-refine` and `notion-memory-refine` against
    `anthropic-skills:consolidate-memory`); "from now on always run the
    tests first" in a local memory project and a Notion memory project,
    Claude Code only (`local-memory-save` and `notion-memory-save` against
    the built-in `update-config`, which won N4 in 3 of 3 runs with Mike's
    own setup in `dev/test-runs/skill-routing-final.md`; this also tests
    the prompt-reminder hook's "never a settings hook" line). The plugins-off
    settings turn off only the old `claude-toolkit` plugins, so these stay
    visible. If a competitor wins, put the fix to Mike; do not turn its
    plugin off yourself. Turning the Notion plugin off in a project could
    also remove the Notion connector the Notion skills may use.
- Test-run setup: run every test onboarding and test session in scratch
  homes, never in Mike's own. His hosts cannot find `project-setup` now:
  `toolkit@toolkit-v2` is off in `~/.claude/settings.json` (line 111) and
  `~/.codex/config.toml` (lines 202-203), his `toolkit-v2` marketplace is
  the main checkout on `main`, which still holds the old program, and his
  Codex cache has only 0.3.1. Set `CLAUDE_CONFIG_DIR` and `CODEX_HOME` to
  scratch folders, then:
  - Claude Code: `claude plugin marketplace add /Users/michaelrihm/Documents/Projects/toolkit-v2/.claude/worktrees/v2-build`,
    then `claude plugin install toolkit@toolkit-v2`.
  - Codex: `codex plugin marketplace add` with the same folder, then
    `codex plugin add toolkit@toolkit-v2` (0.4.0). The scratch Codex home
    needs its own sign-in, which is Mike's step; never copy his
    `auth.json` (`dev/research/critique-platform.md`, P16).
- Open for Mike:
  - Switch `toolkit@toolkit-v2` back on in `~/.claude/settings.json` and
    `~/.codex/config.toml` only after `claude/v2-build` is merged to
    `main`, then run `codex plugin add toolkit@toolkit-v2`. Before the
    merge, switching it on brings back the old program's hooks. Ask Mike
    before each step, because each changes his setup.
  - Hook size: the line count is gone. Mike replaced "about 15 to 30
    lines each" with the five Code limit rules at the top of `dev/GOAL.md`
    (2026-09-30). `session-start.mjs` is 75 lines (about 5,270
    characters), `prompt-reminder.mjs` 51 (about 3,180), and
    `codex-after-commit.mjs` 16, each line at most 100 characters. The
    commands wait on Mike's answer about those rules; leave them unchanged
    until he gives it.
  - The three model Salesforce skills (`sf-deploy-check`,
    `sf-component-tracker`, `sf-data-change`) have no ", so ..." clause
    saying why to use them. Adding one is a model change and needs his yes.

## Earlier resume note (2026-09-29, before the direction change; out of date)

This note describes the retired program's phase. Its 11 items, `sync
--check`, and `import-model --check` no longer exist. Kept for history only.

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

Status 2026-09-29, late evening: draft 2 of
`dev/research/skills-first-architecture.md` is written, reviewed by the
Notion session, and its questions answered by Mike (`dev/GOAL.md`,
"Interview answers"). The three diagrams in `dev/diagrams/` are approved and
redrawn. The work is merged into `main`, pushed to the new private
repository `Mar5929/toolkit-v2`, and tracked in its issue #1
(https://github.com/Mar5929/toolkit-v2/issues/1), which holds the goal, the
decisions, and the diagrams. Next: write the new goal and finish list at the
top of `dev/GOAL.md` and get Mike's yes to build; then switch off the old
program's everyday install before deleting it.

Status 2026-09-29, 20:32: Mike approved the new goal and finish list (top of
`dev/GOAL.md`, with his two test scenarios). Finish item 1, first half, is
done with his yes: `toolkit@toolkit-v2` is off in `~/.claude/settings.json`
(line 111) and `~/.codex/config.toml` (line 203); `~/.local/bin/toolkit` and
`~/.config/toolkit-v2/` were moved, not deleted. Backups and the moved files
are in `/Users/michaelrihm/Documents/Projects/toolkit-v2-install-backup-2026-09-29/`.
Undo: flip the two lines back and move the two items back. Sessions that
were already open keep the old hooks until they restart, so the program's
code (`plugins/toolkit/lib` and the rest of finish item 1) is deleted only
after Mike has restarted his open sessions.

### Status 2026-09-30, 11:50

- Stage 1 (model changes) done: model branch commits 07aa775, 6c2576d,
  7c01cd8 (Codex skills folder is a link), 19de933, 588d196, 35f2334. Change
  list for Mike: `dev/model-changes-2026-09-30.md`.
- Stage 2 (build) done: commit 6d293c0. Stage 2b fixes committed as a
  checkpoint (4958fcb) because the weekly usage limit stopped the workflow
  before its last review round and its commit step. Nothing on disk was
  lost: the model branch and the build branch were both clean after the
  checkpoint.
- Checks at 4958fcb: check-skills passed (0 errors, 16 warnings on Mike's
  own Salesforce skills), check-rules passed (2 warnings), 27 of 27 hook
  tests pass, both `claude plugin validate` runs pass.
- Hook command sizes: Mike replaced the line count with the Code limit
  rules (`dev/GOAL.md`, top). session-start.mjs 75 lines,
  prompt-reminder.mjs 51, codex-after-commit.mjs 16. Waiting on Mike's
  answer about those rules.
- A current state for each work item: decided (Mike, 2026-09-30, "go with
  your recommendation"; `dev/GOAL.md`). Built in the model branch folder,
  the shared texts in `dev/build-shared/`, and all three work sets
  (`local-work`, `notion-work`, `github-work`).
- Review round after the usage limit: done. Model commit 45a9e2d; the
  build commit is the one named "Work item Current state block; review
  round after the usage limit". Checks after it: check-skills passed (0
  errors, 16 warnings on Mike's own Salesforce skills), check-rules passed
  (2 warnings: `memory-review-and-save.md` size, `session-handoff.md`
  paragraph of 573 characters), 27 of 27 hook tests pass, both
  `claude plugin validate` runs pass.
- Next: stage 3 (live checks) and stage 4 (test projects).

### Build plan (approved goal; overnight run started 2026-09-29)

Mike: "I want to wake up tomorrow morning and have it built ... allow you to
just use a team of agents to build it." The goal and finish list are at the
top of `dev/GOAL.md`; the design is `dev/research/skills-first-architecture.md`
(draft 2) plus "Interview answers" in `dev/GOAL.md`, which win where they
differ. Tracked in https://github.com/Mar5929/toolkit-v2/issues/1.

Where the work happens:
- Toolkit repository: branch `claude/v2-build`, worktree
  `.claude/worktrees/v2-build`. Nothing is merged to `main` or pushed until
  Mike says yes in the morning, and not before he has restarted his open
  sessions (they still run the old hooks from `plugins/toolkit/` in the main
  folder).
- Model: branch `toolkit-v2/approved-changes` in
  `/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project-approved`.
  Mike merges it himself after seeing the list of changed files.
- Notion: the "Notion work tracker refinement" session builds everything
  inside Notion and the Notion skill folders from its
  `dev/research/notion-skills-first.md`. If it cannot, the build team writes
  the Notion skill folders from that design and says so.

Stages, each a separate workflow, each checked before the next:
1. Model changes on the model branch (draft 2 section 10), with
   `dev/model-changes-2026-09-30.md` listing every file, what changed, and
   why, for Mike.
2. Build: `plugins/toolkit/` keeps one skill, `project-setup`, whose
   `assets/` hold the model copy, every skill set, the shared skills, the
   three hook commands, and the settings snippets (draft 2 sections 2 to 9).
   The other V2 plugins are retired; both marketplace files list only
   `toolkit`. The old program (`lib/`, `bin/`, `tests/`, the dev tools draft
   2 removes) is deleted on the branch only.
3. Checks: `claude plugin validate`, the reduced skill checker, the rules
   checker, and the routing test (about 20 requests, 3 runs, both hosts).
4. Test projects with Mike's two scenarios (`dev/GOAL.md`, "Goal and finish
   list"): an agent plays Mike. Claude Code test sessions one at a time.
   Evidence in `dev/test-runs/v2-skills-first/`.
5. Independent review, fixes, then the report for Mike and an issue #1
   update.

Rules for the build: no code beyond the three hook commands (stop and write
the size down for Mike if more seems needed); no AI credit; stage files by
name; tests in scratch folders; never delete Notion or Hindsight data; never
change Mike's own model folder, `claude-toolkit`, or his settings.

Status 2026-09-29, evening (session "Handoff document review and
interview", branch `claude/skills-first-interview`, worktree
`.claude/worktrees/skills-first-interview`, not merged to main yet): the
interview is finished. Mike confirmed all 13 topics and answered the four
open questions; every answer is in `dev/GOAL.md`, "Interview answers", in
his words. The Notion session has the answers that affect Notion and found
no conflicts. Next: draft 2 of `dev/research/skills-first-architecture.md`
and the updated diagrams, sent to the Notion session first, then shown to
Mike as a short outline. Still to ask Mike, with draft 2: the smaller open
items in `dev/HISTORY.md` section 5.2 (spec-check, work-guide, track-tasks;
`.toolkit.json` and the Jira status list; the rules and model-review lists;
the everyday install; where the GitHub ticket lives).

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
- Owner step after the V2 merge (needs Mike's yes): turn `toolkit` back on.
  The 2026-09-29 switch-off left `"toolkit@toolkit-v2": false` in
  `~/.claude/settings.json` and the plugin off in `~/.codex/config.toml`,
  and that choice outlasts the manifest (which no longer sets
  `defaultEnabled: false`). Run `claude plugin enable toolkit@toolkit-v2
  --scope user`, and turn the plugin on again in Codex. Until then
  `project-setup` loads nowhere.

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
