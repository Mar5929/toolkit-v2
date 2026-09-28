# Toolkit V2: goal and settled decisions

Mike's goal, set 2026-09-26. This file is the single place the goal and his
answers live. Update it when he changes a decision.

## Goal

Build a new toolkit repository from scratch at
`/Users/michaelrihm/Documents/Projects/toolkit-v2`. It is a separate
experiment from issue 419 in `Mar5929/claude-toolkit`; the current toolkit is
not changed.

A fresh project set up by the new toolkit must match the model project at
`/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project`: the same
folders, file names, and template text. The templates are how the agent
creates files in those folders. Claude reviews the model for a solo developer
who wants the agent to run the project while they make decisions; the review
is a checklist for Mike, not a change to what projects get.

The main difference from the current toolkit: the orchestration layer is a
clear, non-overlapping set of skills whose names and descriptions let Claude
Code and Codex pick the right one from the skill index, plus hooks for the
steps that must always run the same way.

## Settled decisions (Mike, 2026-09-26)

- Repo lives locally at `/Users/michaelrihm/Documents/Projects/toolkit-v2`.
  A GitHub repo is created only after Mike approves it.
- Separate experiment from issue 419. Add a note to issue 419 linking it.
- Project init copies the model scaffolding except `.work-items/` and
  `.memory/`, then interviews: where to track work, which memory system,
  Salesforce or not. It then writes `AGENTS.md` and the rule files to match.
- Salesforce pieces are installed only when the project is a Salesforce project.
- Port: the session skills from the current toolkit, `sf-architect-solutioning`
  as is, the Plain English output style, the general rules and the Salesforce
  rules the current project-init library installs, and the model's memory
  system (with a review for improvements).
- Follow Claude Code and Codex best practices: hooks set up the documented
  way, rules scoped to paths where that fits, no README in every folder.
- Instruction files: follow the model. Earlier (morning) Mike said `AGENTS.md`
  only; in the evening he said the model's `AGENTS.md` and `CLAUDE.md` files
  are what projects get, and the model keeps `CLAUDE.md` files. The model
  wins. Later approved: one root `CLAUDE.md` with only `@AGENTS.md` (item 1 below).
- Work items: the same stages, lifecycle, `WORK-ITEM.md` body and
  `DESIGN.md` everywhere. Nesting and sub-items are allowed. When Mike moves
  files or folders, the agent detects it and adapts.
- Trackers fully built and tested: local `.work-items/` folders and Notion.
  GitHub Issues and Jira get the template and written instructions only.
- Notion: refactor the "AI Agent Second Brain" page. A Projects database;
  each project page has its own Work Items database (board view, sub-items,
  same stages, body in the `WORK-ITEM.md` format, a templated Solution Design
  subpage) and its own Memory database. No shared all-projects work item
  database. Use the Notion CLI (`ntn`) where it fits.
- Memory options: built-in `.memory/`, local Hindsight, or Notion.
- **Notion memory uses Lore** (Mike, 2026-09-27): `github.com/makenotion/lore`,
  Notion's own open-source "persistent, shared AI memory backed by Notion for
  MCP-compatible assistants". Research: `dev/research/lore.md`. Mike chose
  (2026-09-27) "store in Lore's layout": the toolkit keeps its own `toolkit
  memory` commands, the model's formats, and the approval step, and writes
  each project's Notion memory in Lore's database layout (a "Memory" page
  holding Lore's databases) so Lore's tools can read it. Lore's own automatic
  saving and hooks stay off; no new sign-in. Focus and glossary stay child
  pages.
- **Decisions of 2026-09-28** (Mike: "yes to all your recommendations"):
  (1) requirements areas are one folder per area copied from
  `system-area-template/`; (2) skip `git fetch` when there is no remote;
  (3) in Codex the owner runs every sandbox deploy and sandbox data change;
  (4) template guides say "copy this file" not "rename"; (5) Salesforce
  platform questions route to `sf-architect-solutioning` (AGENTS.md line);
  (6) `sf-component-tracker` description "Use first, before work-on";
  (7) never write a script that deploys; (8) the guard also checks DevOps
  Center pipeline deploys; (9) fix old wording in two Salesforce skill
  bodies; (10) the `toolkit` plugin is on machine-wide in both hosts (only
  project-setup plus hooks that do nothing outside V2 projects), the other
  V2 plugins only inside V2 projects; (11) install Toolkit V2 in Mike's
  everyday Claude Code with that rule; (12) risky toolkit commands (memory
  delete, import, machine-setup, Hindsight service install/start) ask first
  in both hosts; (13) setup asks for a backup folder and the toolkit exports
  `.work-items/` and `.memory/` automatically at work-finish and handoff.
  Goal adjustments: one skill per job with reference files (no new skills
  per process), and anything that must happen every time lives in the
  `toolkit` command or a hook, with the skill explaining it.
- **Skills carry their own procedures** (Mike, 2026-09-28): every process the
  agent must run a certain way (work tracking, local Markdown and Obsidian
  memory, design and delivery teams, handoffs, git, setup) has a skill with a
  clear SKILL.md and reference files inside its own folder for the
  step-by-step details, following Anthropic's and OpenAI's official skill
  and hook guidance. Descriptions say exactly what each skill does and when
  to use it.
- **Routing approvals** (Mike, 2026-09-27 night): (1) the model's
  `.claude/rules/session-handoff.md` gets the new wording in
  `dev/model-changes.md` ("Proposed: handoff rule wording"); (2) the model's
  `AGENTS.md` gets two routing lines: changing a requirement goes to
  work-requirements, and "you drive" or "take it from here" goes to
  work-delegate; (3) new projects raise Claude Code's skill-list budget
  (`skillListingBudgetFraction`) so every Toolkit V2 description is visible.
- **Memory additions from Mike's research note** (Mike, 2026-09-27; note
  summarized in `dev/research/memory-architecture-notes.md`): (1) saved
  proposals: an unanswered "Save to memory?" becomes a `needs-review`
  record the agent does not rely on, listed under "what do you need from me"
  (work-decide) until Mike approves or rejects it; (2) a duplicate check in
  the `toolkit memory save` command itself; (3) clean deletes: deleting or
  retiring a memory also clears it from the briefing, Hindsight, and Notion
  caches; (4) a memory test set: fresh-session handoff, corrected fact
  replaces the old one, "I don't know" instead of a guess, no leak between
  projects. Enterprise parts (tenants, access control, legal hold, graphs)
  are left out for a solo setup.
- **Skill descriptions must be written to the official Claude Code and Codex
  best practices** (Mike, 2026-09-27), so the agent knows exactly when to use
  each skill. Use Firecrawl to capture the official guidance. Mike approved
  rewriting the `sf-architect-solutioning` description only (body unchanged).
- Hindsight: self-hosted only, never Hindsight Cloud. One local server on this
  Mac, one memory bank per project. No Docker (Mike was unsure; Docker on a
  Mac cannot use the GPU and needs Docker Desktop running). Installed with
  `uv tool install hindsight-api --python 3.12`; model `gpt-oss:20b` through
  Ollama (installed with Homebrew, runs as a brew service).
- **The model project is the exact source for folders and file templates**
  (Mike, 2026-09-26 evening, while he keeps editing the model). That covers
  the folder structure, file templates, instructions, rules, `AGENTS.md` and
  `CLAUDE.md` files, project hooks, and agents. The toolkit packages the
  model as it is, with a copy step that can be re-run as he changes it. Setup
  leaves out only `.work-items/`, `.memory/`, and the Salesforce parts when
  they are not chosen. The model does not hold the new plugin skills, the
  `toolkit` command, or plugin hooks; those come from toolkit-v2 and must
  work with the model's templates as they are. Claude's review ideas are a
  checklist for Mike; only approved ones are added, and they go into the model.
- **Approved content changes (Mike, 2026-09-26 night: "go with your
  recommendations on all of them").** The model decides folder layout, file
  names, and locations. These 23 content changes are approved and go into the
  model itself, on a separate branch of the model's Git repo so Mike's own
  edits are never touched, then merged when he is ready:
  1. One root `CLAUDE.md` containing only `@AGENTS.md`; the other `CLAUDE.md`
     files removed. 2. Rewritten `AGENTS.md` (owner decisions, one routing
     table, "How to write replies", generated rules list). 3. `SOUL.md` kept as
     the model has it. 4. `.claude/RULES.md` and `docs/toolkit-manual.md`
     removed. 5. `README.md` shortened. 6. `DECISIONS.md` added.
     7. `.toolkit.json` replaces `.toolkit-memory.json`. 8. `work-item-folders.md`
     rule for the local tracker. 9. Work item header fields `parent`,
     `waiting_on`, `priority`, `delivery`, `result_approved`, `updated`,
     `requirements_approved`; `active_phase` removed. 10. Six statuses; Blocked
     becomes `waiting_on`. 11. Body uses IDs, "owner", a Sub-items column.
     12. `DESIGN.md` header (work item, status, approval). 13. Four-section
     current focus. 14. One-page memory criteria; save rules in `memory-save`.
     15. Learned-rules table removed; corrections are `feedback` memories.
     16. `delivery/` only in Salesforce projects. 17. Salesforce guards also in
     Codex. 18. Salesforce skill descriptions rewritten, one source for both
     hosts. 19. `tests/TEST-PLAN-TEMPLATE.md` stays where the model has it.
     20. General example in `plain-english-artifacts.md`. 21. `system-guide/`
     kept as the model has it. 22. `.vscode/` and `.sfdx/` not copied.
     23. V2 projects turn on the V2 plugins and turn off the `claude-toolkit`
     plugins.
- **Memory: Claude's mechanisms, Mike's formats** (Mike, 2026-09-26 evening).
  The toolkit's memory mechanisms are used: the `toolkit memory` command
  written by the main agent (no curator subagent, no per-project
  `scripts/memory.py`), the session-start briefing hook for both hosts, the
  explicit-phrase reminder and the once-per-turn Stop check, worktree-safe
  vault lookup, and one command set for built-in, Hindsight, and Notion. The
  model's folder and file formats are kept exactly: the `.memory/` files and
  their sections (with the four-section `CURRENT_FOCUS.md` from approved item 13), the topic
  template and its YAML, the index format, the glossary, memory criteria, and
  Obsidian-style relative links with link repair on rename, merge, and
  archive. Instruction text in the model that names the old mechanism (the
  curator, `scripts/memory.py`, the model's memory hooks) is the only text
  changed, to name the toolkit command instead.
- Review the model project's scaffolding, every template, and its root
  `AGENTS.md` as a solo "vibe coder" developer would: the agent runs the
  project, the human only makes decisions and steers. Say what is missing and
  what is not needed. The findings are a checklist in `dev/model-review.md`.
  Nothing from it reaches new projects unless Mike approves it, and approved
  items are added to the model itself.
- Notion CLI: `ntn` (official, by Notion) installed with `npm install -g ntn`.
  Mike runs `ntn login` himself, because it opens a browser sign-in.
- Built by a team of Opus agents. Loop: build, set up sample projects, run
  work items end to end (including nesting and Mike moving files), fix, repeat.

## How the work runs

Claude leads a team of Opus subagents and keeps `dev/PROGRESS.md` current
(done, in progress, next step) so a new session can resume.

Rules on the way:

- Leave the `claude-toolkit` repo unchanged, except one note on issue 419.
  Leave the `toolkit-v2-model-project` folder unchanged unless Mike approves
  a specific change there (he edits it himself, often).
- Instruction files as the model has them (see above).
- No Docker, no Hindsight Cloud, no GitHub repo without Mike's yes, no AI
  credit in commits.
- Follow the captured Claude Code docs
  (`claude-toolkit/ai-external-knowledge/claude-code/`) for hooks, skills,
  plugins, and path-scoped rules. No README in every folder.
- Ask Mike only for decisions that are his, logins, money, or anything that
  cannot be undone.

## Finish items (11)

The goal is met only when Claude has shown each item in the conversation,
with real command output, file listings, or links as proof.

1. **Model review.** The model project's scaffolding, every template, and
   `AGENTS.md` reviewed as a solo vibe-coder would, where the agent runs the
   project and the human only decides and steers. Findings are a checklist in
   `dev/model-review.md`. The scaffold project init installs is a re-runnable
   copy of the model (a parity test shows setup output matches the model,
   apart from the chosen conditional parts and the memory mechanism files).
2. **Plugins.** `toolkit-v2` registers its plugins for Claude Code and Codex,
   and `claude plugin validate .` passes.
3. **Project init.** Copies the scaffold except `.work-items/` and `.memory/`,
   then asks: tracker (local folders, Notion, GitHub Issues, Jira), memory
   (built-in `.memory/`, local Hindsight, Notion), Salesforce or not. It writes
   `AGENTS.md` and path-scoped rules to match, and installs the general rules,
   the Salesforce rules when chosen, and the Plain English output style.
4. **Work items.** The same stages, lifecycle, `WORK-ITEM.md` body, and
   `DESIGN.md` in every tracker. Sub-items work, and when Mike moves or
   renames a work item file or folder, the agent notices and carries on.
5. **Skills.** A skill index (name, description, when to use) covering the
   ported session skills, `sf-architect-solutioning`, and the new
   orchestration skills. An independent agent checks it for unclear or
   overlapping skills, and every finding is fixed.
6. **Hooks.** The work-item and memory hooks pass automated tests and are seen
   running in a real Claude Code session and a real Codex session.
7. **Notion.** The "AI Agent Second Brain" page is rebuilt so each project has
   its own Work Items database (board view, sub-items, same stages,
   `WORK-ITEM.md` body, Solution Design subpage template) and its own Memory
   database, operated through the `ntn` CLI.
8. **Hindsight.** A local Hindsight server using Ollama `gpt-oss:20b` runs on
   this Mac as a background service, each project has its own memory bank,
   and a test project stores a memory and gets it back.
9. **Sample runs.** A fresh project is set up and one work item is taken from
   start to done, including a sub-item and a moved file, for each of: local
   tracker + built-in memory; a Salesforce project; Notion tracker + Notion
   memory; local tracker + Hindsight. Evidence is saved in `dev/test-runs/`.
10. **Fixes.** Every failure from items 5 to 9 is fixed and re-tested, and a
    final independent review finds no blocking issues.
11. **Report.** Claude gives Mike a final plain-English report: what works,
    what was tested, and the open decisions.
