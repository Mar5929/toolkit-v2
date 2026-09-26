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
folders, file names, and template text, after one review pass for a solo
developer who wants the agent to run the project while they make decisions.

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
- Instruction files: `AGENTS.md` only, no `CLAUDE.md`. Claude Code 2.1.277 and
  later read `AGENTS.md` natively (captured docs: `memory.md`, section
  "AGENTS.md").
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
- Hindsight: self-hosted only, never Hindsight Cloud. One local server on this
  Mac, one memory bank per project. No Docker (Mike was unsure; Docker on a
  Mac cannot use the GPU and needs Docker Desktop running). Installed with
  `uv tool install hindsight-api --python 3.12`; model `gpt-oss:20b` through
  Ollama (installed with Homebrew, runs as a brew service).
- Review the model project's scaffolding, every template, and its root
  `AGENTS.md` as a solo "vibe coder" developer would: the agent runs the
  project, the human only makes decisions and steers. Say what is missing and
  what is not needed. The model project itself is left unchanged; the
  reviewed version goes into the new repo's scaffold, and the findings go in
  `dev/model-review.md`.
- Notion CLI: `ntn` (official, by Notion) installed with `npm install -g ntn`.
  Mike runs `ntn login` himself, because it opens a browser sign-in.
- Built by a team of Opus agents. Loop: build, set up sample projects, run
  work items end to end (including nesting and Mike moving files), fix, repeat.

## How the work runs

Claude leads a team of Opus subagents and keeps `dev/PROGRESS.md` current
(done, in progress, next step) so a new session can resume.

Rules on the way:

- Leave the `claude-toolkit` repo and the `toolkit-v2-model-project` folder
  unchanged, except one note on issue 419.
- `AGENTS.md` only, never `CLAUDE.md`.
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
   project and the human only decides and steers. Findings in
   `dev/model-review.md`; the improved version is the scaffold project init
   installs.
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
