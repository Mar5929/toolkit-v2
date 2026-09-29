---
name: project-setup
description: 'Sets up Toolkit V2 in a new project, or checks, updates, and repairs an existing setup, including Notion and Hindsight. Use when the owner says "set up Toolkit V2", "set up this project", "check the setup", or "update the toolkit", or starts working on a new computer.'
---

# Project setup

Voice: write to the owner in plain English. Claude Code: follow the project's Plain English output style. Codex: follow the "How to write replies" section of `AGENTS.md`.
Sets up Toolkit V2, never the older claude-toolkit (its `project-init` skill).

## Steps

1. **Check the computer and the project.** `toolkit` not found, or doctor
   reports a computer problem: `references/repair-and-update.md`, "Reaching
   the `toolkit` command". A warning never blocks init: note it, go on.
   `toolkit doctor`
2. **Pick the path.** `.toolkit.json` present: step 8. A new computer:
   `references/new-computer.md`. Switching memory or tracker:
   `references/switching.md`. Otherwise a new project: put the checklist
   below in the plan tool (Claude Code: the task list; Codex: `update_plan`).
3. **Interview**, one question per message, in the reply text, each with a
   recommendation: name, tracker, memory, Salesforce, `SOUL.md`, backup
   folder (skipped when tracker and memory are both Notion: say Notion keeps
   page history and a trash). Look first. `references/interview.md`. Notion
   or Hindsight chosen: do the "Before init" part of its wiring file now.
4. **Run init** with the answers, then record what it has no flag for.
   Inside Codex, first tell the owner that Codex will ask him to approve
   running init outside the sandbox. `references/running-init.md`.
   `toolkit init --name '<name>' --key <key> --tracker <tracker> --memory <memory> --owner '<owner>' --backup-dir '<folder>' [--salesforce] [--decline SOUL.md]`
5. **Finish wiring each choice**: `references/wiring-notion.md`,
   `wiring-hindsight.md`, `wiring-github-jira.md`, `wiring-salesforce.md`.
6. **Fill the setup guides** with facts the owner confirmed; the one-sentence
   outcome is his to say. `references/finishing-setup.md`.
7. **Finish:** backups, doctor at 0 problems, owner steps in the reply and the
   focus, the first briefing, the report, the commit offer.
   `references/finishing-setup.md`.
8. **Repair or update:** one numbered table from doctor and the dry run; sync
   only after a yes; doctor again until 0 problems.
   `references/repair-and-update.md`.
   `toolkit sync --dry-run`

## New project checklist

```text
- [ ] Doctor run; computer problems fixed
- [ ] Looked before asking: Git repository, code, sfdx-project.json, older toolkit files
- [ ] Six answers: name (key, id prefix, owner), tracker, memory, Salesforce (org aliases), SOUL.md, backup folder (not asked when tracker and memory are both Notion)
- [ ] Notion signed in and root page known, or Hindsight answering, before init
- [ ] toolkit init run; id prefix and Salesforce aliases recorded
- [ ] Each choice wired: Notion, Hindsight, GitHub or Jira, Salesforce API version
- [ ] Setup guides filled with confirmed facts; outcome asked for; prompts left listed
- [ ] First backup made, or the owner's no-backup choice reported, or (tracker and memory both Notion) Notion's page history and trash named as the backup
- [ ] Doctor at 0 problems (warnings only the other host can clear are the owner's)
- [ ] Owner steps in the reply; the ones doctor checks also in the current focus
- [ ] First briefing shown; the report given
- [ ] Commit offer made; commit only after a yes
```

## Gotchas

- Ask each question in the reply text, never through a question box or
  question tool (in Codex, `request_user_input_async` and the like): in
  `codex exec` the box is never shown, and the turn ends with no answer.
  Never answer a question for him after a wait; wait for his reply.
- Never change an answer the owner gave (hosts, tracker, memory, Salesforce,
  `SOUL.md`) to get past a failed command, and never set up in another folder
  and copy it over. Stop, say what failed, and say what he must approve or
  run.
- Setup is never a work item. Never create one for setup steps, and never add
  made-up owner questions to finish setup.
- The project's one-sentence outcome is the owner's answer, never a sentence
  worked out from the code, the tests, or the README.
- Init wires Notion and Hindsight itself, so it stops when `ntn` is not signed
  in, no Notion root page is known, or the Hindsight server does not answer.
  Get the backend ready before init.
- Inside Codex, init writes `.codex/` and `.agents/` first, which the sandbox
  refuses. It must run outside the sandbox, with the owner's approval.
- The machine-setup command changes `~/.codex/config.toml`. Get the owner's
  yes before its first run on a computer.
- Nothing is created outside this project without a yes: no GitHub
  repository, no Jira fields, no paid service, no Notion pages outside the "AI
  Agent Second Brain" page.
- Every step is safe to run again. Init writes `.toolkit.json` last, and a
  second run reuses what an earlier run made.
- `git diff --check` reports the scaffold's Markdown templates, because some
  of their lines end with two spaces: a Markdown line break. Leave them.
  Never change a scaffold file to pass a check.
- When the Notion setup (ensure-root or ensure-project) fails, or prints a
  warning about the owner's Notion pages, stop and tell the owner what it
  printed. Never change his Notion pages or views with `ntn api` or any other
  tool to get past it.
- Run each `toolkit` command alone, on its own line, in both hosts; one-line
  values in single quotes (`references/toolkit-commands.md`).

## Steps only the owner can do

Say each one plainly, with why, and wait. Never do them for him.

- **`ntn login`**: signs the Notion command-line tool into his Notion account.
  It opens a browser sign-in. Needed only for Notion, and only when
  `ntn whoami` fails.
- **Trust this project folder in Codex**: open Codex in the project folder
  and trust it when Codex asks. Until he does, Codex ignores the project's
  `.codex/config.toml`, which turns the other Toolkit V2 plugins on. Trust is
  tied to the folder path, so it is needed again after the folder moves.
- **Trust the hooks in Codex**: open Codex in the project, type `/hooks`, and
  trust the Toolkit V2 hooks. Codex skips plugin hooks until he does. Needed
  again after the hooks change or the project folder moves.
- **Approve Codex running init outside its sandbox**, when setup runs inside
  Codex, or run the command init printed in a terminal.
- **Start a new session** after setup, so the host loads the new settings, the
  Plain English style, and the Toolkit V2 skills.

## References

| File | Open it when |
| --- | --- |
| `references/interview.md` | Step 3: what to check before asking, and the six questions with their recommendations |
| `references/running-init.md` | Step 4: the init commands, what init writes and installs, a failed run, init inside Codex |
| `references/wiring-notion.md` | The tracker or memory is Notion: before init, and to check or repair it after |
| `references/wiring-hindsight.md` | The memory is Hindsight: before init, and to check or repair it after |
| `references/installing-hindsight.md` | Hindsight or Ollama is not installed on this Mac: the installs, the first start, the service |
| `references/wiring-github-jira.md` | The tracker is GitHub Issues or Jira |
| `references/wiring-salesforce.md` | A Salesforce project: org aliases and the API version |
| `references/finishing-setup.md` | Steps 6 and 7: the setup guides, `SOUL.md`, backups, doctor, owner steps in the focus, the report, the commit offer |
| `references/repair-and-update.md` | Step 1 when `toolkit` is not found; step 8; updating the installed plugins |
| `references/new-computer.md` | The owner starts on a new computer |
| `references/switching.md` | The owner wants another memory backend or tracker |
| `references/toolkit-commands.md` | Before the first `toolkit` command: one command per call, text in a command, exit codes |
| `references/current-focus.md` | Step 7: the focus format and the version check |
| `references/backup-and-restore.md` | Backups, and restoring on a new computer |
| `references/git-rules.md` | The setup commit, and Git writes in Codex |
| `references/tracker-github.md` | A GitHub Issues tracker: what agents do in place of `toolkit work` |
| `references/tracker-jira.md` | A Jira tracker: what agents do in place of `toolkit work` |
