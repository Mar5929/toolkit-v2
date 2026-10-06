# Toolkit V2 progress

Read `dev/GOAL.md` first. This file says where the work stands.

## Artifact wording in the document clarity standard, version 0.9.4 (2026-10-06)

Mike asked for finished artifacts, including diagrams, charts, dashboards,
mockups, slide decks, published pages, and reports, to use short, ordinary
language that is easy to scan. The standard now says to use the fewest words
that convey the needed meaning. It allows short headings, labels, notes,
and captions, while requiring complete sentences for prose and instructions.
It also states that an artifact sent to another person follows both the
document clarity standard and the outbound text rule. The repository guide
and the copy in `writing-harness-files` are kept in step with the rule.

## Two skills removed, version 0.9.3 (landed 2026-10-06)

Work item TKV-28. Mike, 2026-10-06: "Delete the Explain Simply skill and the
Choosing Outside Tools skill. That should absolutely not be a skill. That
just needs to be something that's just a simple file that's referenced in the
toolkit v2 but doesn't get installed into projects."

- Mike asked to merge the open pull requests on 2026-10-06. Pull request 24
  landed as commit `09160592`.
- `explain-simply` is removed from `every-project/`. A project now gets 9
  shared skills. `project-setup`'s `references/update.md`, "Retired skills",
  tells "update the toolkit" to remove the folder from an existing project.
- `choosing-outside-tools` is removed from the `toolkit` plugin, which now
  holds two skills. The tool list is the plain file `OUTSIDE-TOOLS.md` in the
  repository root. No plugin ships it. This reverses the decision of
  2026-10-03 (TKV-18) that put the list on every computer as a skill: an
  agent in another project is no longer told that the list exists.
- Every check in `AGENTS.md`, "Checks", passed on the branch.
- The routing test was not run for this change. The description rewrite
  landed in PR 25, and the writing rule rename landed in PR 26. The merge
  includes both changes and raises the version to 0.9.3.

## Document clarity standard (2026-10-06)

Mike named the writing rule `document-clarity-standard.md` and asked for the
rule and `writing-harness-files` to follow their own clarity guidance. The
new name replaces `write-documents-in-plain-english.md` in the starter
project, the rule copy, the check tool, the setup update steps, and the
repository guides. The skill description and opening now state their job
without a long definition in the description. That change raised
the toolkit version to 0.9.2.

## Skill description clarity pass (2026-10-06)

The description pass landed in pull request 25 as version 0.9.1.

The 23 skills that Toolkit V2 shipped at the time had revised descriptions in their
`SKILL.md` files and in `dev/SKILL-INDEX.md`. Each description now states the
skill's job, when to use it, and any neighboring skill that could be confused
with it. The opening of `filing-project-records/SKILL.md` gives each record
type its own action and destination. The `choosing-outside-tools` and
`sf-deploy-check` openings also use direct names in place of unclear words.
The skills' operating requirements did not change. The before-and-after text is in
`dev/reviews/2026-10-06-skill-descriptions-before-after.md`.

After that description pass, Mike asked to keep the current skill names and
decide the work and memory skill structure in a separate chat. The
`writing-harness-files` description and opening no longer route an
owner-dictated line in `owner-preferences.md` to the memory skill. The
plain-English writing rule now adds the useful points from pstack's
`unslop` and `technical-writing` skills that were missing: clear pronoun
references, named evidence, readable noun phrases, natural list length,
and choosing a document form for the reader's job. Its exact copy in
`writing-harness-files/references/writing-rule.md` matches. No output style
changed. PR 24 removes `explain-simply` and `choosing-outside-tools` after this
description pass.

The plugin version is 0.9.1. The marketplace, plugin, skill, rule, workstreams,
and Node tests passed. `check-rules.mjs` gave its three existing size warnings.
Two separate readers checked the old and new descriptions for skill routing.
Live Claude Code and Codex routing runs did not start: Claude Code reported an
expired OAuth session, and a scratch Codex home reported HTTP 401 because it
has no credentials. Run live routing in both hosts when they are signed in.

## The one-home layout, version 0.9.0 (landed on main 2026-10-06)

Work item TKV-24. It landed on main on 2026-10-06 as version 0.9.0, by pull
request 22 (merge commit `1217ce07`), together with the restored memory and
the plain-English rewrite. It was built on the branch
`claude/one-home-layout`. A new project folder was set up from it for Mike
to look at (`~/Documents/Projects/toolkit-setup-preview`; he asked for a
fresh setup in place of a rebuilt HarborDesk sample, 2026-10-05).

What Mike decided is in `dev/research/layout-audit/DESIGN-SPEC.md`. The
audits, the memory scenario test, and the specification of the checking
script are beside it. The reviews are `dev/reviews/2026-10-05-*.md`.

- One folder per setup choice under `project-setup/assets/` (`every-project`,
  `work-local`, `work-notion`, `work-github`, `memory-local`,
  `memory-notion`, `memory-process`, `memory-hindsight`, `notion-tools`,
  `salesforce`, `soul`). A choice decides which files a project gets, never
  which lines: all 53 setup marker blocks are gone.
- The project layout: a root `AGENTS.md` that is the outline and the filing
  table; `DECISIONS.md`; `system/`; `sources/`; `delivery/`; `reference/`;
  a guide (`AGENTS.md` with a one-line `CLAUDE.md`) in each main folder.
  `project-wide-records/`, `requirements/`, `system-guide/`, and
  `ai-external-knowledge/` are removed from the starter.
- Skills renamed: `running-work-item-lifecycle`, `using-work-tracker`,
  `filing-project-records`, `curating-project-memory`, `using-memory-store`.
  No new project skill: closing is a step of the lifecycle skill; recording
  a decision, filing a source, and updating a system document are three
  steps of the filing skill.
- Local memory is the Davis-based memory again (Mike, 2026-10-05: "restore
  the Davis memory and fine-tune it"; he approved the component list the
  same day): Current State in five parts, one Markdown file per concept in
  four kinds (`user_`, `project_`, `reference_`, `event_`), a generated
  index, and the "Memory approval" line. No decision records, glossary, or
  system facts in memory. Two filing rows say to write an analysis of the
  existing system to `reference/current-system/`, and a run of a recurring
  job to memory, before the reply. Reviewed twice and fixed
  (`dev/reviews/2026-10-05-memory-restore-review.md`,
  `dev/test-runs/memory-restore.md`,
  `dev/test-runs/skill-routing-memory-restore.md`). A Hindsight project
  gets no toolkit memory skill (Mike, 2026-10-05): the add-on ships its own.
- A fourth hook command, `validate-records.mjs` (15 checks; Mike accepted
  279 lines plus tests on 2026-10-05), run after an edit, at stop in Claude
  Code, and before a commit through `.githooks/pre-commit`.
- A third plugin skill, `writing-harness-files` (Mike's yes, 2026-10-05),
  and the repository rule "Harness files follow the current official
  documentation". The official pages were captured again on 2026-10-05, and
  Hindsight's pages were added.
- "Update the toolkit" has steps that move a project from the old layout to
  the new one (`references/one-home-layout.md`).
- Reviews: three separate reviews, a review of the fixes, and a review of
  the second fixes. Their status sections say what is closed and what waits.
- Routing test: `dev/test-runs/skill-routing-0.9.0.md`. Claude Code 54 of
  60 right, Codex 51 of 60. The steady misses are listed there; the
  description changes they suggest are not made yet.
- A Codex project must trust its hooks again in `/hooks` after an update.

The plain-English rewrite (2026-10-06, built on the branch
`claude/one-home-plain`; it landed on main with the same pull request, and
the version is still 0.9.0):
- Seven writers rewrote the skills, the setup references, the folder
  guides, and the rules into plain English: an opening that says what the
  file is for, whole sentences, and plain words or a name the reader can
  see in place of each made-up word. No rule was changed. A last pass made
  the words and the headings the same across the files.
- The writing rule was named `write-documents-in-plain-english.md`
  (Mike, 2026-10-06). It was `write-for-the-reader.md` for about two hours on a branch, and
  `plain-english-artifacts.md` before that. "Update the toolkit" replaces
  either old file in an existing project.
- All the writing rules are in that one rule (Mike, 2026-10-06). The long
  second text in `writing-harness-files` was deleted. The skill holds an
  exact copy of the rule, `references/writing-rule.md`, and
  `check-skills.mjs` fails when the copy and the rule differ.
- The word list is `dev/reviews/word-list.md`: one answer for each made-up
  word, and one word where the files used several, such as "session" (never
  "chat"), "the project's Current State" and "the work item's Current
  state", "the owner's yes", and "source".
- Not rewritten: the Salesforce skills and rules, `choosing-outside-tools`,
  and the templates (the work item and design templates, the memory record
  template, and the three Notion page texts).
- The root guide of a project is 19,880 bytes; setup fails a project whose
  guide is over 20,480.
- The skill routing test ran in both hosts, because 15 skill descriptions
  changed (`dev/test-runs/skill-routing-plain-english.md`): of 70 requests,
  Claude Code opened the right skill first for 65 and Codex for 56.

Open with Mike (also in `dev/research/layout-audit/FIX-LIST.md`, "Waits for
the owner", and `MEMORY-SCENARIOS.md`):
- Memory, known limits from the live runs: a mid-size model does not save
  a draft it gave only in the chat, such as a meeting preparation list (0
  of 3); a reported job failure was saved in 4 of 5 runs. Fixing more needs
  a new hook job, which needs his yes.
- Memory, for him to confirm (`DESIGN-SPEC.md` section 9): the new starter
  file `.ignore`; `@PROJECT.md` in the root guide; a project task may name
  another person; whether his request for an analysis is also his yes to
  commit its record; a save about a named person waits for his yes.
- `session-handoff.md` (his wording) and the figurative words in his older
  rule files.
- What Notion memory stores and when its pointers are read.
- The twelve changes the builders made on their own, listed in
  `DESIGN-SPEC.md` section 9 for him to confirm.
- Mike's answer on whether `toolkit-setup-preview` looks right is not
  recorded.

No longer open:
- The `AGENTS.md` edit that another session left uncommitted in the main
  checkout, the rule "Challenge the current design (Mike, 2026-10-04)", is
  kept: commit `a20dadd0` holds it unchanged.
- The review file `dev/reviews/2026-10-05-memory-restore-review.md` is
  committed (commit `571e40f1`, 2026-10-06).

## Project filing system interview (2026-10-04, TKV-24)

Mike set an active goal to define one project lifecycle, filing system,
record schema, and set of agent procedures across Salesforce and SaaS
projects and across tracker and memory choices. This is design work; the
Toolkit V2 model and shipped skills have not been changed for it. The
working inventory is `dev/research/project-filing-lifecycle-working.md`.
The active Notion work item is TKV-24, "Define the project lifecycle and filing
system." TKV-4's HarborDesk review follows its approved design; TKV-21's
Claude-Obsidian evaluation follows that review. TKV-19 remains Done for the
earlier project-wide records work.
Mike chose a complete labeled setup structure with instructions and forms,
and no fictional records. He also asked agents to recommend a better design
when current files are unclear; the instruction is in this repository's
`AGENTS.md`. Mike approved one stable entry or locator for each original
source, including one-item meeting sources, so work items can lead an agent
back to their context on resume (TKV-24 Q-02). Mike also rejected a giant
collection of bite-sized decision files and requires an answer to be findable
by a human browsing in VS Code (TKV-24 Q-03). Mike did not accept the
subject-based proposal (TKV-24 Q-04); he asked for a Salesforce org-merge
walkthrough starting at setup, planning, and discovery before choosing
folders. The walkthrough and comparison are drafted in the working inventory
through target decision, build, cutover, and a changed answer. The draft also
separates claim, approval, delivery, question, and work-item states. It now
includes a candidate filing decision procedure, readback rule, and examples
showing that tracker and memory choices do not change the record route.
An event-by-event ledger now tests which record carries the source, current
answer, unresolved question, work, and verification at each org-merge stage.
An audit against `codex/tkv4-review` now lists the actual model route and
unresolved gap for each of those records, including conflicting no-item
decision instructions and the missing general SaaS release evidence route.
The changed-answer procedure has been checked against the current shared
records skill; the draft identifies six seams to settle while retaining its
existing answer history, impact checks, and readback behavior.
The org-merge scenario now compares the current role split, a single
`planning/` home, and separate dated discovery versus maintained answers
across workshop, approval, cutover, changed answer, human lookup, and
migration. No folder choice has been approved.
TKV-24's Notion summary and solution-options note now reflect the three
approaches and the open Q-05; its status remains In Progress and Waiting on
Mike for that question.
Mike clarified the missing workflow: a result-led data model design work item
uses kickoff and discovery questions, and its finished design needs a lasting
human-findable home. The working draft now traces that item through source
intake, questions, a maintained design, approval, build handoff, and a later
change. Mike agreed that the design item ends when the design is approved;
the decision is recorded in `dev/GOAL.md`. The draft now compares two
whole-project structures: one organized by record role (recommended for
testing) and one by business/system area. It identifies overlap among the
current system data model requirement, item design, and shared target
architecture. The exact paths remain proposals. Next: show the options to
Mike, test a cross-area architecture design and changed answer against his
preferred layout, then settle the folder names and procedures.
For Mike's refactor-size question, the newer model branch has 60 candidate
files mentioning the old location terms: 23 model files, 19 shared-skill
files, 2 tracker-skill files, 9 setup files, and 7 settings/docs/check files.
The working design records a provisional 30-45 substantive edits, plus file
moves, migration instructions, and scratch-project verification; it would
not require a new runtime. This is a reference inventory, not a final edit
count, and no shipped files were changed for the proposal.
The HarborDesk current-state audit is in
`dev/research/harbordesk-current-state-audit.md`. It maps the existing files
and the lifecycle gaps using the fictional sample, without changing that
project or the shipped model. Mike asked for a plain explanation, so the file
now describes the setup and each problem with an example, without proposing
a final folder design. Read it before settling the final folder layout.

## Merge update (2026-10-04)

- Mike approved both merges. Pull request 20 landed the `dev/` cleanup, and
  pull request 18 landed the project-wide records design and Toolkit V2
  version 0.8.16. Both merged into `main`; the repository checks passed.
- Notion work items TKV-19 and TKV-23 are Done. TKV-21 is no longer blocked
  by TKV-19 and has its requirements step recorded.
- The main checkout still has unrelated untracked files, including a path
  added by pull request 18. Leave them in place until their owner reconciles
  them; do not pull into that checkout yet. Existing client projects receive
  version 0.8.16 only when Mike asks to update each project.

## Developer folder cleanup (2026-10-04)

- The filing map is `dev/INDEX.md`. Superseded drafts, completed reviews,
  old handoff prompts, old model reviews, and the September diagrams were
  moved to `dev/archive/`. The current checks, research, tests, and shared
  sources remain in their working folders. The long earlier progress log is
  in `dev/archive/model/`. References within developer Markdown files were
  updated to the new paths.
- All test evidence remains in `dev/test-runs/`. Mike's approval is needed
  before any test data is deleted (`dev/GOAL.md`, "Not in this goal").
- This cleanup changes developer files only. It does not change the toolkit
  that projects receive, so it does not need a plugin version change.


## Current State (2026-10-04)

The Toolkit V2 build is tracked as work items in the Notion project "Toolkit V2" (https://app.notion.com/p/Toolkit-V2-3edb381da17681eeb7ddd0a6d662f9b2). Older sections below are history.

- 2026-10-04: TKV-19, version 0.8.16, built on pull request 18 after Mike asked to execute the plan; it merged later that day. `dev/research/project-wide-records-workflows.md` holds eleven workflow diagrams; `dev/research/project-wide-records-implementation-plan.md` lists the design and changed files. Every new project gets `project-wide-records/` with five templates and a folder `AGENTS.md`, plus the shared `managing-project-wide-records` skill, regardless of tracker or memory choice. Existing item, requirement, system-guide, source, and memory homes stay authoritative. Setup, handoff, work-item, and document-save routes were updated; no hook or program was added. Independent wording, overlap, and best-practices findings were fixed and rechecked. The repository checks pass (two pre-existing rule warnings); a scratch project copy, 18 rendered AGENTS combinations, temporary plugin installs, and six read-only routing sessions in Claude Code and Codex passed (`dev/test-runs/project-wide-records-0.8.16.md`). No live Notion or Hindsight project was changed during implementation; projects receive the new version only when Mike asks to update them.
- 2026-10-03: Wrote `dev/research/project-knowledge-proposal.md` and created Backlog item TKV-19, "Structure knowledge across complex projects." The proposal covers cross-item questions, source intake, people, target architecture, domain maps, and change propagation. Made a 107-second Explainroo video in `~/Documents/Projects/explainroo/videos/toolkit-knowledge-before-after/out/video.mp4` to show the current and proposed states; its final audio check understood all narration. At that point no model or skill change had been approved or built. The 2026-10-04 entry above supersedes that next step.

### Now (in progress)
- One Notion project template, 0.7.7: Mike's Projects database now has one template, "Project" (work items and memory). Setup makes every Notion project from it and removes the part kept elsewhere; the steps were tested live on two throwaway projects (trashed). Landed (485caff). Its work item template was in Notion's trash; restoring it through the API did not give Mike a working template, so he made a new one in the app and the agent rebuilt its four views (tested on a throwaway project). 0.7.8 replaces the toolkit's API-restore instruction: the owner restores in the app, or a new template is built.
- A review folder where Mike can read and edit every file a project gets, then hand his edits back: next, after this commit.
- Goal-gap fixes, 0.7.9 (Mike's yes, 2026-10-02): the agent keeps the whole work item true (each task's status and who does it, each phase's status, every field); the lead sets its own task In Progress and adds a task before work no task covers; work the item's goal does not need, and a defect outside the requirements, become new Backlog items; a started item is listed under "Now". Notion tasks gain Status and "Who does it" (pinned at the top of each task page), with migration steps in "update the toolkit". Next: run "update the toolkit" on the Toolkit V2 Notion project.
- Skills reminder on every prompt, 0.7.10 (work item TKV-9, Mike's request 2026-10-02): the existing prompt-reminder.mjs now prints one line before each answer telling the agent to check the project's skills and use every one that fits, then the memory hint when a phrase matches. 4 lines added to the hook (56 to 60); settings snippets unchanged, so Codex needs no new hook trust. Landed on main (e2f1962).
- Levels structure, 0.8.0 (TKV-7, Mike's yes, 2026-10-02), landed on main 2026-10-03 with his yes: the same levels in every tracker. The project has phases (P01) and its own tasks (PT-01); a top-level item has phases (P1) with tasks (P1-T01) and level-2 sub-items; level-2 and level-3 sub-items have one plain task list (T01). managing-work-items has one "Levels" section; the work item template has a sub-item form; each tracking-work-items skill says where project phases and tasks live (local PROJECT-ROADMAP.md and work-items/PROJECT-TASKS.md; Notion rows with no Work item and three new views; GitHub milestones and a pinned "Project tasks" issue); PROJECT-ROADMAP.md has no work units and is local only; "update the toolkit" converts older sub-items that have phases. Notion also gets Task type and Phase type (formulas from Work item), the project page opens Phases and Tasks on the project's own rows, and setup checks the shared "Project" template against the layout before copying it. Added 2026-10-03 (Mike's yes to all five recommendations): a Notion task has one status field, Status of Notion's status type, and no "Done" checkbox ("update the toolkit" converts an older project; the agent retypes it through the API after his yes; corrected 2026-10-03 after the live test); the shared "Project" template always matches the toolkit (R-11 confirmed); "Untracked to-dos" is gone from Current State (a project to-do goes to its work item, a project task, or a new Backlog item); "By project phase" is the first Work Items tab. Not run live: the Notion test area is gone, so the new views, the two formulas, and the Done-to-Status steps were reviewed but not run against Notion. Next (Mike's choice, 2026-10-03): run the new Notion steps on a throwaway project made from the template first; then, with his yes, on the Toolkit V2 project and the shared template (TKV-7, task P1-T11).
- The new Requirements layout, 0.8.1 (TKV-11, Mike's yes, 2026-10-03): the Notion work item page text now matches the work item template Mike rewrote in his "Project" template (the note at the top, level-1 section headings, the Requirements section, "Linked Github PRs"); local files and GitHub issues use the same Requirements layout ("Requirement <number>: <short name>" with the original requirement word for word, its goal, a numbered requirements list, and numbered Acceptance Criteria); `managing-work-items` writes requirements in it and records approval in "Requirements approved" and Questions and Answers; text in angle brackets is an instruction, so no item an agent creates or changes keeps any; setup and "update the toolkit" never change the owner's parts of the template back and never rewrite an existing item's Requirements. The same branch holds the fixes from the live test of the 0.8.0 Notion steps (`dev/test-runs/notion-levels-0.8.0.md`). Reviewed in two rounds by a separate agent (16 findings, all fixed) and landed on main 2026-10-03 with Mike's yes. Still open: a live Notion test of filling a new item from the new template, on a throwaway project.
- The 8 carried-over skills rebuilt, 0.8.2 (TKV-5, Mike's instruction 2026-10-03; a builder and a separate reviewer, both Opus). No skill added, removed, or renamed; no description, index row, or model routing line changed, so no routing test was needed. pull-latest: the never-rebase rule moved to the opening; a branch with no upstream now gets a fetch and one question before a merge of the default branch, where it stopped before; a stop when no branch is checked out. reset-to-remote: says the reset runs in the main checkout, which its commands need when the session is in its own worktree. merge-and-clean-up: the standing merge instruction's conditions live only in managing-work-items (this skill says it counts only when managing-work-items sent the agent); a check for AI credit in the pull request title, description, and commit messages before the merge. publish-docs: the merge-safety check before the local fast-forward with no remote. handoff: the memory step points to managing-project-memory and keeps "save only what the owner asked to keep or says yes to"; the phrase list for checking a pasted prompt is gone; the template no longer lists saves the owner said no to (the memory rule forbids it); the verifier brief no longer repeats step 6. braindump: two clauses cut, one of which disagreed with the model's AGENTS.md. explain-simply: one wording fix. session-summary: unchanged. The reviewer checked the plan (4 blockers, 9 should-fix, 6 notes) and the finished text (3 should-fix, 5 notes); all were fixed or held. Held for Mike then, and built in 0.8.6 after his yes (see the 0.8.6 entry): the four check steps he held in the 2026-10-01 audit (reset-to-remote: install command in the plan, a missing installer, a check after the reset; explain-simply: a check before sending), removing merge-and-clean-up's agents/openai.yaml, project tasks at a handoff, and whether unrelated uncommitted files in the base folder should still block the cleanup after a merge. Shipped and flagged for Mike's yes: pull-latest's merge question, reset-to-remote running in the main checkout, the AI credit check before a merge (not tested: that GitHub adds no co-author line of its own when a body is given), the publish-docs check, the handoff template change, and the braindump cut. Not tested live: the skills were reviewed and the repository checks pass, but none was run in a test project. Waiting on the main session: review and landing on main.
- Move-over for projects on the old toolkit, 0.8.3 (TKV-3, Mike's request 2026-10-02, his word to build and ship it 2026-10-03), built on its own branch, not landed: saying "toolkit v2" in a project opens project-setup, and the folder decides the path: a new project is set up, a Toolkit V2 project is updated, and a project set up with the older claude-toolkit, the retired toolkit program, or by hand is moved over. The move-over takes his choices, reads the project, and shows one list (Delete, Add, Update, Kept untouched, Your call), each line with a reason; nothing changes before his yes, and a plain yes never carries out a "Your call" line that changes something. Tracked files change on the agent's own branch; old work items and memory stay where they are, and the ones still in use are carried over into the Toolkit V2 form. Two new references: move-over.md (the steps and the list template) and old-toolkit-pieces.md (the old toolkit's pieces and how old records map). Tested by walking a scratch old-toolkit project through it in Claude Code (dev/test-runs/move-over-0.8.3.md) and by a routing check in both hosts (dev/test-runs/skill-routing-0.8.3.md). A separate reviewer checked the requirements and ran the wording, overlap, and best-practices reviews. Waiting on Mike: his yes to land it, and the open questions Q-02 to Q-13 in TKV-3 (points the agent decided).
- Workstream panel, 0.8.5 (TKV-12, Mike's request and his choice "Separate plugin + Windows fix", 2026-10-03), landed on main 2026-10-03 with his yes (pull request 11): a second plugin, `workstreams`, for Claude Code only. `/streams` opens a side panel that lists the project's Notion work items by status, the chat each open item belongs to, and the running helper agents. It reads the data source id from `PROJECT.md`'s Notion block (or this repository's `AGENTS.md`), reads Notion with `ntn`, and finds the chats by scanning the chat files Claude Code saves. It ran live on Mike's Mac in the desktop app from `~/.claude/skills/workstreams` before the move into the repository. A separate reviewer read it; its findings are fixed (a chat is counted only when it changed the item's own page, a slow failure is not retried, `/streams` opens at once, more than 100 items are read, `CLAUDE_CONFIG_DIR` is honored). `dev/tests/workstreams-scan.test.mjs` runs the scan with the Mac's own tools. The Windows path (the shell that comes with Git for Windows) is covered by a test with stand-ins only: Mike tests `/streams` on his Windows computer. After the merge: install `workstreams@toolkit-v2` with his yes and remove the copy in `~/.claude/skills/workstreams`.
- "Functional Requirements" label and seven gap fixes, 0.8.4 (TKV-11, task P1-T06, 2026-10-03), landed on main 2026-10-03 with Mike's yes. Notion tests now run in a throwaway project (AGENTS.md, "Notion tests"). Mike approved a new name for one list of the Requirements block (in chat, 2026-10-03), and the agent changed his Notion template and read it back: "Functional, Process, Logic, Schema, etc. Requirements" is now "Functional Requirements", and its first hint is "One line each: system behavior, process steps, business rules, and data model". Every shipped file now agrees (the Notion work item page text, the three tracking-work-items skills, `refining-requirements.md`, and both copies of the work item template); an item that holds the older label keeps it. The live Notion test of filling a new item from the new template ran on a throwaway project (`dev/test-runs/notion-requirements-0.8.1.md`): everything worked, and the agent had to guess in seven places, each now closed with one sentence (an empty requirement list, a Backlog item's Next action, Related items with no project phase yet, an empty Goal, where the Type comes from, the repository's form in a pull request link, and two Notion facts). The fixes have not been run against Notion. Waiting on the main session: the separate review, then landing on main.
- TKV-5 follow-up, 0.8.6 (Mike's yes to all five, 2026-10-03), landed on main 2026-10-03 with his yes (762df55): the four changes TKV-5 held for him, and one new one for pull-latest. reset-to-remote: the plan names the install command, a missing installer is skipped and never installed for him, and the agent confirms the branches after the reset. explain-simply: a check before sending that no fact was dropped. pull-latest: from a session's own worktree it also fast-forwards the main checkout, only when that is clean and on the default branch; uncommitted changes in the session's own worktree do not stop that update. merge-and-clean-up: agents/openai.yaml is gone (in a project, "update the toolkit" lists it and removes it after his yes), and after a merge only an uncommitted file the pull request changed blocks the cleanup. A pull that fails also skips the cleanup: Git refuses the update when another newly landed commit changed an uncommitted file in the base folder, and the skill then changes nothing there and reports it. handoff: it also updates the project tasks (PT-01 form) the session worked on. No skill added, removed, or renamed and no description changed, so no routing test was needed. Reviewed through four lenses (wording, best practices, correctness, completeness), each finding checked by a separate skeptic; the 9 confirmed findings are fixed. Not tested live. Projects get it when the owner says "update the toolkit".
- Workstream panel rebuilt around chats, 0.8.7 (TKV-14, Mike's request and his choice "Each chat reports", 2026-10-03), landed on main 2026-10-03 with his yes (pull request 12). Mike does not track work in Notion in every project, so the panel no longer reads Notion or searches chat files. Each chat's agent reports its pieces of work (name, status, next step) through the tool `mcp__workstreams__report`; the plugin notes each chat's state at no token cost; each chat saves its record in its own file under `~/.claude/workstreams/<project>/`; `/streams` shows one bordered card per piece of work and per chat. Live test in the test sign-in, 2026-10-03: a chat starting a real piece of work loaded the tool and reported it unprompted; a chat given a small one-off request did not report, and still showed as a chat with its state and last message. Not yet tried: the panel in the desktop app, two live chats side by side, and Windows.
- Workstream panel, what counts as a workstream, 0.8.8 (TKV-14, Mike's request 2026-10-03), landed on main 2026-10-03 with his yes (pull request 13). The panel ran live in the desktop app on his Mac after a restart and showed a card for the chat "TKV-5 and 3". Mike then said what a workstream is: "a significant piece of work ... a work item or some large task that I'm tracking". The instruction every chat reads and the tool's description now say that, in place of "work that takes more than one step". He did not want a "recently completed" list beyond the "Done today" one.
- Tool list, 0.8.9 (TKV-18, Mike's request and his yes to the goal, 2026-10-03), landed on main 2026-10-03 with his yes (pull request 14): a second skill in the `toolkit` plugin, `choosing-outside-tools`. It lists the outside tool Mike uses for each kind of job, where it comes from, how to set it up, and his choices for it, so every computer uses the same tool without him remembering it. It is text only; the toolkit ships none of the tools. The first row is explainroo, for narrated explainer videos, with the corner label off. `check-skills.mjs` now also checks the plugin's skills beside project-setup. A separate reviewer ran the wording, overlap, and best-practices reviews (5 should-fix findings and 1 from the fixes, all fixed and read again). The routing test ran in both hosts in two rounds, the second after the description changed (`dev/test-runs/skill-routing-0.8.9.md`): 14 of 14, then 12 of 12. One test prompt ("add this to my to-do list: buy milk") made Codex add a real task to Mike's Todoist inbox: routing prompts must not name anything a connected app can act on. Not tested: setting explainroo up on a second computer, and Windows. The test task was removed from his Todoist with his yes. Added 2026-10-03 at Mike's request: a second choice in the explainroo row, `"sfx": "minimal"` (no pencil, pop, or tick sounds), built on its own branch. Found after the merge: the `toolkit` plugin is turned off in Mike's Claude Code and in his Codex on this Mac, so no chat reads the tool list yet. Waiting on Mike: whether to turn the `toolkit` plugin on in both apps, the names of the other tools he wants on the list, and whether adding a tool from any project (not only from a chat in this repository) is worth building.
- Workstream panel, Dismiss buttons, 0.8.10 (TKV-14, Mike's choice "Add a Dismiss button", 2026-10-03), landed on main 2026-10-03 with his yes (pull request 16). Mike said the panel "looks great" in the desktop app. He archived a chat and its card stayed, because the panel is not told about archiving. Each workstream card and chat card now has a Dismiss button; the dismissed cards are in `_dismissed.json` beside the chats' files. A piece of work shows again when it is reported again; a chat shows again when Mike writes to it or it reports work. Two new tests, on the terminal and the desktop app. Not yet tried on his screen.
- Workstream panel, Done button and one card per chat, 0.8.14 (TKV-14, Mike's choice "Add a Done button" and his layout idea, 2026-10-03), landed on main 2026-10-04 with his yes (pull request 19). He used the Dismiss buttons in the desktop app and they worked. He expected a finished piece of work to move to "Done today" when he cleared its card; Dismiss only hid it. Each piece of work now has a Done button (moves it to "Done today") and a Dismiss button (hides it). The layout is now one card per chat, with the chat's pieces of work inside it, each with a colored status label; the separate Workstreams section is gone. 13 plugin tests, on the terminal and the desktop app. Not yet tried on his screen.
- Apex and Flow test runs stopped in production, 0.8.12 and 0.8.13 (TKV-6, Mike's yes 2026-10-03), landed on main 2026-10-03 with his yes. 0.8.13 added Flow test runs (`sf flow run test`) on his answer to Q-02 ("go with your recommendation") and renamed the guard's category from `apexTest` to `testRun`; Agentforce agent tests (`sf agent test run`) stay unchecked by his choice. The starter project's Salesforce guard (`guard-protected-orgs.cjs`) now checks the commands that start Apex or Flow tests in an org: `sf apex run test` in any word order or colon form, its old name `sfdx force:apex:test:run`, `sf logic run test`, and `sf flow run test`. Aimed at a production org, or an org the guard cannot classify, they get the decision a deploy gets there: blocked while the policy says deny, and blocked in Codex. Aimed at a sandbox or scratch org, they pass with no question from the guard, the way a deploy validate does. In Claude Code, `sf apex run test` on a sandbox still shows the permission prompt that the starter settings give every `sf apex run` command; the guard itself asks nothing. Known limit, shared with a sandbox validate: the guard blocks a sandbox test run when the org name is the last word inside `$( )` or backticks, or stands directly before `;` or `|`; a space or another flag after the org name avoids it. `--help` and reading results (`sf apex get test`) still pass. The guard grew by 9 lines, 986 to 995: one new line of code (the `testRun` category), two changed lines of code (`apex:run:test` left the not-guarded list, and `testRun` joined the list that is silent on a sandbox), and comments. The rule `salesforce-org-safety.md` and the text in `protected-orgs.json` now say the same. No setting value changed, and the Codex hook entry did not change, so Codex needs no new hook trust. New test: `dev/tests/org-guard.test.mjs` (171 lines, 10 tests) runs the guard in a scratch project with a stand-in `sf`, so no real org is reached. It passes on the new guard, and the 5 tests about test runs fail on the old guard. The guard from before 0.8.12 and the 0.8.12 guard were also compared on 3,960 combinations of command, target org, and host: they differ only on Apex test runs. The 0.8.12 guard and the 0.8.13 guard were compared on 4,048 combinations: their decisions differ only on `sf flow run test`, and the message names the category `testRun` where it named `apexTest`. Reviewed through three lenses (the code and 111 ways around it, wording, completeness). The review found weaknesses that were already in the guard before this change; they are a separate Backlog work item. Projects get it when the owner says "update the toolkit". The weaknesses that were already in the guard are work item TKV-20 (Backlog).
- Workstream panel, plain names, the About line, labelled layout, and collapsible cards, 0.8.15 (TKV-14, Mike's yes 2026-10-04: "build all of it then merge it into main"), landed on main 2026-10-04. Mike switches between many chats and needs reminding what each piece of work is. The agent now names a piece of work with a subject line in his own plain words and sends an "about" text, one or two sentences on what he asked for and why; the first "about" is kept. Each piece of work shows About, Status, and Next as labelled lines under its name; "Chat" and "Workstreams" labels separate the chat from its work; a card folds with Collapse. Buttons are now "Mark done" and "Hide". Live test in the test sign-in: the agent named a piece of work "Keep web shop customers logged in for a day" with a plain two-sentence reminder. 14 plugin tests. Not yet tried on his screen.

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
- Routing test in both apps for the renamed skills.

### Next session starts with
- Read this section, then the Notion project "Toolkit V2".

## Earlier progress

The earlier progress log is in `dev/archive/model/progress-2026-09-29-to-2026-10-02.md`.
