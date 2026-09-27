---
name: project-setup
description: 'Sets up Toolkit V2 in a new project or repairs one: copies the model scaffold, applies tracker, memory, and Salesforce answers, and fixes this Mac, Notion, or Hindsight. Use when the owner says "set up Toolkit V2", "set up this project", "check the setup", "update the toolkit", or "new computer".'
---

# Project setup

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
The interview wording and what setup installs: `references/interview.md`. Repair, switching, new computer, and wiring: `references/repair-and-wiring.md`. Put each `toolkit` command on its own line.

## Steps

1. Check the setup. If `toolkit` is not found, run `node <this skill's folder>/../../bin/toolkit machine-setup` (the skill's folder is the one holding this file). If doctor reports a computer problem, run machine-setup. Name anything the owner must do himself: `ntn login` opens a browser sign-in; trusting the hooks in Codex happens in its `/hooks` screen. Never do those for him. This skill sets up Toolkit V2, never the older claude-toolkit (its `project-init` skill); when the owner names Toolkit V2 and only `project-init` is listed, say so and use this skill's steps.
   `toolkit doctor`
   `toolkit machine-setup`
2. No `.toolkit.json`: a new project. Look before asking: an empty or existing repository; `sfdx-project.json` answers the Salesforce question in advance. Then ask one question at a time, each with a recommendation, in this order: the project name (with its key, id prefix, and owner name, confirmed in one line); the tracker (local folders, Notion, GitHub Issues, Jira); the memory (built-in `.memory/`, local Hindsight, Notion); Salesforce or not, and for Salesforce the sandbox and production org aliases; whether he wants `SOUL.md` (a no becomes `--decline SOUL.md`, so no later sync brings it back).
3. Run init with the answers (the second line, with `--salesforce`, for a Salesforce project; add `--decline SOUL.md` after a no). Setup copies the model scaffold and applies your answers: it copies the model project's folders and files, keeps only the blocks of `AGENTS.md`, `README.md`, and `PROJECT.md` that match the answers, fills the project name, writes the rules list and `.toolkit.json`, installs the tracker, memory, and Salesforce parts only when chosen, never copies work items or memory records, and turns the V2 plugins on and every `*@claude-toolkit` plugin off in this project. Then record the choices init has no flag for: the id prefix when it is not `WI`, and the Salesforce org aliases. With Notion, init may take another id prefix when `WI` is already used there: say the prefix it reports in one line. In Codex: init writes `.codex/` and `.agents/`, which the Codex sandbox refuses, and it writes them first. Before running it, tell the owner that Codex will ask to run it outside the sandbox. If it stops with "Could not write ... .codex/" (or `.agents/`), or says the Codex sandbox blocked its request to Hindsight, nothing else was written: stop, show him the exact command init printed, and ask him to approve it or to run it in a terminal. Never change a setup answer (hosts, tracker, memory, Salesforce) to get past an error, and never set it up in another folder and copy it over.
   `toolkit init --name "<name>" --key <key> --tracker <tracker> --memory <memory> --owner "<owner>"`
   `toolkit init --name "<name>" --key <key> --tracker <tracker> --memory <memory> --owner "<owner>" --salesforce`
   `toolkit config set tracker.idPrefix <prefix>`
   `toolkit config set salesforce.orgs.sandbox <alias>`
   `toolkit config set salesforce.orgs.production <alias>`
4. Wire the choices. Notion: check the sign-in with `ntn whoami` (if it fails, the owner runs `ntn login` himself), then build the project's pages. Hindsight: check the service (install or start it only after a yes), then create the project's bank. GitHub or Jira: show the written instructions and create nothing in that service without a yes. Salesforce: fill the API version, which the model leaves as `XX.0`. Read it from the sandbox org (the `apiVersion` field of the read-only `sf org display -o <sandbox alias> --json`), or ask the owner. Put it in `sfdx-project.json` (`sourceApiVersion`) and in the `<version>` line of `delivery/deployment/full-project-deployment-template/package.xml`; the work item templates get it when `sf-component-tracker` copies them.
   `toolkit notion ensure-root`
   `toolkit notion ensure-project --project-name "<name>"`
   `toolkit hindsight service status`
   `toolkit hindsight ensure-bank`
5. Fill the setup guides: the copied files carry fill-in guide comments and `<angle bracket>` prompts. Fill them only with facts the owner confirmed (the one-sentence outcome and the "Build, test, or deploy" row in `AGENTS.md`, then `PROJECT.md` and `README.md`; `PROJECT-ROADMAP.md` and `requirements/SYSTEM-DATA-MODEL.md` when the facts are known), fill `SOUL.md` with his words when he wanted it, and delete each guide once its file is filled. List any prompt left for a fact nobody knows yet, including those in `PROJECT-ROADMAP.md` and `requirements/SYSTEM-DATA-MODEL.md`. A `SOUL.md` the owner turns down after init: record the no with the command below, then delete the file, so sync and doctor leave it out.
   `toolkit config set declined SOUL.md`
6. `.toolkit.json` present: repair. Show one numbered table from doctor and the dry run: missing, out of date, changed by the owner, broken wiring, each with its fix. Run sync only after a yes; it adds every missing file at once and never overwrites a file the project changed. Report a changed file as "project ahead of the toolkit".
   `toolkit sync --dry-run`
   `toolkit sync`
7. Switching memory: export from the old backend, change the choice, add its files, wire the new backend (step 4), check the import with a dry run, then import. Switching tracker: no command does it in this version; show a preview and move items only with the owner's yes.
   `toolkit memory export --to <backup-folder>/memory`
   `toolkit config set memory.type <memory>`
   `toolkit sync`
   `toolkit memory import --from <backup-folder>/memory --dry-run`
   `toolkit memory import --from <backup-folder>/memory`
8. Run doctor until it is clean, then show the first briefing. Setup is not a work item: create none for setup steps; an owner step goes in the reply and in the current focus under "Waiting on the owner". Explain in plain words what was set up, what was skipped, what the owner must do himself, and one next step ("Tell me the first thing you want built."). The setup files are not committed yet, and the first merge of a work item needs them committed, so the reply's last line is the offer: "Setup files are not committed. Commit them now?" Commit only after a yes, staged by name (never `git add -A`); in Codex, with escalated permissions (`sandbox_permissions` set to `require_escalated`) and a one-line reason, or by the owner in a terminal when Codex refuses it without asking.
   `toolkit brief`

## Steps only the owner can do

Say each one plainly, with why, and wait. Never do them for him.

- **`ntn login`**: signs the Notion command-line tool into his Notion account. It opens a browser sign-in. Needed only for a Notion tracker or Notion memory, and only when `ntn whoami` fails.
- **Trust the hooks in Codex**: open Codex in this project, type `/hooks`, and trust the Toolkit V2 hooks. Codex skips plugin hooks until he does. Needed again after the hooks change or the project folder moves.
- **Start a new session** after setup, so Claude Code loads the new settings and the Plain English style.
- **Approve Codex running the init command outside its sandbox**, when setup runs inside Codex, or run the command init printed in a terminal.
- **Start a new project from Codex:** Codex lists the Toolkit V2 skills only in a project that `toolkit init` has set up, because the V2 plugins are on only where a project's `.codex/config.toml` turns them on. In a new folder, run `toolkit init` in a terminal first (or set the project up from Claude Code), then open Codex there and say "finish setting up Toolkit V2".

## Rules

- One question per message. Every question carries a recommendation and its main reason.
- Setup is not a work item. Never create one for setup steps, and never add made-up owner questions to finish setup. Owner steps go in the final reply and in the current focus under "Waiting on the owner".
- Every step is safe to run again. When a step fails, fix the cause and run it again; init writes `.toolkit.json` last, and a second run records the files an earlier run wrote.
- Never change an answer the owner gave (tracker, memory, hosts, Salesforce, `SOUL.md`) to get past a failed command. Stop, say what failed, and say what he must approve or run.
- Nothing is created outside this project without a yes: no GitHub repository, no Jira fields, no paid service, no Notion pages outside the "AI Agent Second Brain" page.
- Instruction files follow the model: `AGENTS.md` holds the instructions, and one root `CLAUDE.md` (installed when Claude Code is a host) holds only the line `@AGENTS.md`, so Claude Code reads `AGENTS.md` through it. Doctor checks this. There is no other `CLAUDE.md`, `.claude/CLAUDE.md`, or `CLAUDE.local.md`. Because the root `CLAUDE.md` exists, Claude Code does not load a subfolder's `AGENTS.md` by itself; the root `AGENTS.md` tells the agent to read it before editing in that folder. Ask before changing or removing a `CLAUDE.md` the owner wrote.
