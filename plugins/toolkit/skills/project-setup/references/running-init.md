# Running init, and what it installs

Purpose: the exact `toolkit init` commands, what init writes and in what
order, what to do when it stops, and which files each setup answer installs.

## Contents

- The init command
- What init does, in order
- A failed or stopped run
- Running init inside Codex
- What init installs
- How the answers shape the files

## The init command

Run one of these alone, with the owner's answers. One-line values go in
single quotes; write an apostrophe inside them as `'\''`.

```text
toolkit init --name '<name>' --key <key> --tracker <tracker> --memory <memory> --owner '<owner>' --backup-dir '<folder>'
toolkit init --name '<name>' --key <key> --tracker <tracker> --memory <memory> --owner '<owner>' --backup-dir '<folder>' --salesforce
```

- `--tracker`: `local`, `notion`, `github`, or `jira`.
- `--memory`: `builtin`, `hindsight`, or `notion`.
- `--backup-dir`: the folder from question 6, or `none`. Leave it out only
  with a Notion tracker and Notion memory.
- Add `--decline SOUL.md` after a no to question 5.
- `--hosts` defaults to both hosts (`claude-code,codex`). Leave it out unless
  the owner uses only one.

Example:

```text
toolkit init --name 'Acme CRM' --key acme-crm --tracker local --memory builtin --owner 'Mike Rihm' --backup-dir '~/Backups/toolkit' --decline SOUL.md
```

Then record what init has no flag for:

```text
toolkit config set tracker.idPrefix <prefix>
toolkit config set salesforce.orgs.sandbox <alias>
toolkit config set salesforce.orgs.production <alias>
```

The id prefix can change only before the first work item exists. The backup
folder changes later with `toolkit config set backup.dir <folder>` (or
`none`).

## What init does, in order

1. Works out the settings from the flags.
2. Plans every file. A setup marker error stops here, before any write.
3. Hindsight memory: checks that the local server answers. Nothing is written
   yet.
4. Wires the backends: builds the Notion pages and databases
   (`toolkit notion ensure-project`) and the Hindsight bank
   (`toolkit hindsight ensure-bank`) when chosen.
5. Writes the files: in Codex's own folders (`.codex/`, `.agents/`) first,
   then the rest.
6. Builds `.work-items/DASHBOARD.md` and `.memory/MEMORY.md`.
7. Writes `.toolkit.json`, last.

So a Notion or Hindsight project needs its backend ready before init runs:
`wiring-notion.md` and `wiring-hindsight.md` in this folder.

## A failed or stopped run

- Every run is safe to repeat. `.toolkit.json` is written last, and a second
  run reuses the Notion and Hindsight ids an earlier run made.
- Read the message and its fix line. Fix the cause, then run the same command
  again.
- Never change an answer the owner gave (hosts, tracker, memory, Salesforce,
  `SOUL.md`) to get past an error. Never set the project up in another folder
  and copy it over. Stop, say what failed, and say what he must approve or
  run.

| Message | What to do |
| --- | --- |
| No Notion root page is known on this computer | `wiring-notion.md`, "Before init" |
| The local Hindsight server does not answer | `wiring-hindsight.md`, "Before init" |
| Could not write `.codex/` (or `.agents/`) | "Running init inside Codex", below |
| The Codex sandbox blocked init's request to Hindsight | "Running init inside Codex", below |
| With Notion, init reports another id prefix, because `WI` is used there | Say the prefix it took in one line |

## Running init inside Codex

Init writes `.codex/` and `.agents/` first, and the Codex sandbox refuses
both. Its request to the local Hindsight server is also blocked there.

1. Before running it, tell the owner that Codex will ask to run init outside
   the sandbox.
2. Run init alone, with `sandbox_permissions` set to `require_escalated` and a
   one-line reason ("Set up Toolkit V2 in this project: write .codex/,
   .agents/, and the project files.").
3. It stops with "Could not write ... .codex/" (or `.agents/`), or says the
   Codex sandbox blocked its request to Hindsight: nothing else was written.
   Show the owner the exact command init printed, and ask him to approve it
   or to run it in a terminal.

A brand-new folder in Codex: Codex lists `project-setup` in every folder once
`toolkit machine-setup` has turned the toolkit plugin on for every folder. The
other Toolkit V2 skills appear only after init, in a new session.

## What init installs

The toolkit plugin carries an exact copy of the model project in its
`scaffold/model/` folder. Init copies it and applies the answers.

| Installed | When |
| --- | --- |
| `AGENTS.md`, `PROJECT.md`, `PROJECT-ROADMAP.md`, `DECISIONS.md`, `README.md`, `.gitignore` | Every project |
| `SOUL.md` | Every project, unless the owner declined it |
| `requirements/` (its own `AGENTS.md`, `SYSTEM-DATA-MODEL.md`, and `system-area-template/`), `system-guide/AREA-TEMPLATE.md`, `tests/TEST-PLAN-TEMPLATE.md`, `ai-external-knowledge/INDEX.md` | Every project |
| The general rules in `.claude/rules/` | Every project (Codex reads them through `AGENTS.md`) |
| A root `CLAUDE.md` holding only `@AGENTS.md`, `.claude/settings.json`, `.claude/output-styles/plain-english.md` | Claude Code is one of the hosts |
| `.codex/config.toml` and `.codex/rules/toolkit.rules` (written by the toolkit; the model has neither) | Codex is one of the hosts |
| `.work-items/work-item-template/` (`WORK-ITEM.md`, `DESIGN.md`) and `.claude/rules/work-item-folders.md` | Local folders tracker |
| `.memory/` seed files: `AGENTS.md`, `CURRENT_FOCUS.md`, `MEMORY.md`, `memory-criteria.md`, `project_topic_template.md`, `terminology-glossary.md` | Built-in memory |
| `delivery/`, `sfdx-project.json`, `.forceignore`, `tools/kb/`, `tools/permissions/`, the two guard hooks in `.claude/hooks/`, `.claude/protected-orgs.json`, and the Salesforce rules | Salesforce projects |
| The `sf-*` skills in `.claude/skills/` | Salesforce projects with Claude Code as a host |
| `.codex/hooks.json` (runs the two guard hooks in Codex) and the `sf-*` skills in `.agents/skills/` | Salesforce projects with Codex as a host |

It also turns the Toolkit V2 plugins on for this project, and every
`*@claude-toolkit` plugin off here. It never copies work items or memory
records, and never copies the model's `.vscode/` or `.sfdx/` folders.

## How the answers shape the files

- `AGENTS.md`, `README.md`, and `PROJECT.md` carry setup markers such as
  `<!-- if tracker=local -->` ... `<!-- endif -->`. Init keeps the lines for
  the answers given and removes the rest, markers included.
- The rules list in `AGENTS.md`, between `<!-- toolkit:rules:start -->` and
  `<!-- toolkit:rules:end -->`, is written from the files in `.claude/rules/`
  and rebuilt on every `toolkit sync`. Never edit it by hand.
- A project that is not a Salesforce project gets no Salesforce hooks or `sf`
  permission lines in `.claude/settings.json`, and no Salesforce lines in
  `.gitignore`.
- `.memory/MEMORY.md` is generated: init installs the model's copy, then
  `toolkit memory reindex` rebuilds it.
- A file the project already has is kept. `.gitignore`, the settings, and the
  Codex files get the toolkit's lines merged in.
- Instruction files follow the model: `AGENTS.md` holds the instructions, and
  one root `CLAUDE.md` holds only `@AGENTS.md`. There is no other
  `CLAUDE.md`, `.claude/CLAUDE.md`, or `CLAUDE.local.md`. Doctor checks this.
  Because the root `CLAUDE.md` exists, Claude Code does not load a
  subfolder's `AGENTS.md` by itself; the root `AGENTS.md` tells the agent to
  read it before editing in that folder. Ask before changing or removing a
  `CLAUDE.md` the owner wrote.
