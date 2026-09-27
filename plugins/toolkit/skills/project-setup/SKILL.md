---
name: project-setup
description: 'Sets up Toolkit V2 in a project or repairs it: copies the model scaffold and applies your answers on tracker, memory, and Salesforce, checks this computer, and fixes Notion or Hindsight wiring. Use when the owner says "set up this project", "check the setup", "update the toolkit", or "new computer".'
---

# Project setup

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
The interview wording and what setup installs: `references/interview.md`. Repair, switching, new computer, and wiring: `references/repair-and-wiring.md`. Put each `toolkit` command on its own line.

## Steps

1. Check the setup. If `toolkit` is not found, run `node <this skill's folder>/../../bin/toolkit machine-setup` (the skill's folder is the one holding this file). If doctor reports a computer problem, run machine-setup. Name anything the owner must do himself: `ntn login` opens a browser sign-in; trusting the hooks in Codex happens in its `/hooks` screen. Never do those for him.
   `toolkit doctor`
   `toolkit machine-setup`
2. No `.toolkit.json`: a new project. Look before asking: an empty or existing repository; `sfdx-project.json` answers the Salesforce question in advance. Then ask one question at a time, each with a recommendation, in this order: the project name (with its key, id prefix, and owner name, confirmed in one line); the tracker (local folders, Notion, GitHub Issues, Jira); the memory (built-in `.memory/`, local Hindsight, Notion); Salesforce or not, and for Salesforce the sandbox and production org aliases.
3. Run init with the answers (the second line, with `--salesforce`, for a Salesforce project). Setup copies the model scaffold and applies your answers: it copies the model project's folders and files, keeps only the blocks of `AGENTS.md`, `README.md`, and `PROJECT.md` that match the answers, fills the project name, writes the rules list and `.toolkit.json`, installs the tracker, memory, and Salesforce parts only when chosen, never copies work items or memory records, and turns the V2 plugins on and every `*@claude-toolkit` plugin off in this project. In Codex it writes `.codex/` files, so Codex asks the owner once to let it run outside the sandbox. Then record the choices init has no flag for: the id prefix when it is not `WI`, and the Salesforce org aliases.
   `toolkit init --name "<name>" --key <key> --tracker <tracker> --memory <memory> --owner "<owner>"`
   `toolkit init --name "<name>" --key <key> --tracker <tracker> --memory <memory> --owner "<owner>" --salesforce`
   `toolkit config set tracker.idPrefix <prefix>`
   `toolkit config set salesforce.orgs.sandbox <alias>`
   `toolkit config set salesforce.orgs.production <alias>`
4. Wire the choices. Notion: check the sign-in with `ntn whoami` (if it fails, the owner runs `ntn login` himself), then build the project's pages. Hindsight: check the service (install or start it only after a yes), then create the project's bank. GitHub or Jira: show the written instructions and create nothing in that service without a yes.
   `toolkit notion ensure-root`
   `toolkit notion ensure-project --project-name "<name>"`
   `toolkit hindsight service status`
   `toolkit hindsight ensure-bank`
5. Fill the setup guides: the copied files carry fill-in guide comments and `<angle bracket>` prompts. Fill them only with facts the owner confirmed (the one-sentence outcome and the "Build, test, or deploy" row in `AGENTS.md`, then `PROJECT.md` and `README.md`; `PROJECT-ROADMAP.md` and `requirements/SYSTEM-DATA-MODEL.md` when the facts are known), ask whether he wants `SOUL.md` (removed when he says no), and delete each guide once its file is filled. List any prompt left for a fact nobody knows yet, including those in `PROJECT-ROADMAP.md` and `requirements/SYSTEM-DATA-MODEL.md`.
6. `.toolkit.json` present: repair. Show one numbered table from doctor and the dry run: missing, out of date, changed by the owner, broken wiring, each with its fix. Run sync only after a yes; it adds every missing file at once and never overwrites a file the project changed. Report a changed file as "project ahead of the toolkit".
   `toolkit sync --dry-run`
   `toolkit sync`
7. Switching memory: export from the old backend, change the choice, add its files, wire the new backend (step 4), check the import with a dry run, then import. Switching tracker: no command does it in this version; show a preview and move items only with the owner's yes.
   `toolkit memory export --to <backup-folder>/memory`
   `toolkit config set memory.type <memory>`
   `toolkit sync`
   `toolkit memory import --from <backup-folder>/memory --dry-run`
   `toolkit memory import --from <backup-folder>/memory`
8. Run doctor until it is clean, then show the first briefing. Explain in plain words what was set up, what was skipped, what the owner must do himself, and one next step ("Tell me the first thing you want built.").
   `toolkit brief`
9. Never create a GitHub repository, a paid service, or Notion pages outside the "AI Agent Second Brain" page without a yes.

## Steps only the owner can do

Say each one plainly, with why, and wait. Never do them for him.

- **`ntn login`**: signs the Notion command-line tool into his Notion account. It opens a browser sign-in. Needed only for a Notion tracker or Notion memory, and only when `ntn whoami` fails.
- **Trust the hooks in Codex**: open Codex in this project, type `/hooks`, and trust the Toolkit V2 hooks. Codex skips plugin hooks until he does. Needed again after the hooks change or the project folder moves.
- **Start a new session** after setup, so Claude Code loads the new settings and the Plain English style.
- **Approve Codex running the init command outside its sandbox**, when setup runs inside Codex.

## Rules

- One question per message. Every question carries a recommendation and its main reason.
- Every step is safe to run again. When a step fails, fix the cause and run it again; init writes `.toolkit.json` last.
- Nothing is created outside this project without a yes: no GitHub repository, no Jira fields, no paid service, no Notion pages outside the "AI Agent Second Brain" page.
- Instruction files follow the model: `AGENTS.md` holds the instructions, and one root `CLAUDE.md` (installed when Claude Code is a host) holds only the line `@AGENTS.md`, so Claude Code reads `AGENTS.md` through it. Doctor checks this. There is no other `CLAUDE.md`, `.claude/CLAUDE.md`, or `CLAUDE.local.md`. Because the root `CLAUDE.md` exists, Claude Code does not load a subfolder's `AGENTS.md` by itself; the root `AGENTS.md` tells the agent to read it before editing in that folder. Ask before changing or removing a `CLAUDE.md` the owner wrote.
