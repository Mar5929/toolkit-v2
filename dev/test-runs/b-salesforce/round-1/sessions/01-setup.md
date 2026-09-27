# Session 01-setup

Prompt (exact):

```text
Set up this project with the toolkit (Toolkit V2). My answers, so you don't have to ask: project name Acme CRM, key acme-crm, work item ids start with WI, owner Mike. Track work in local folders. Use the built-in .memory/ memory. Yes, it is a Salesforce project: the sandbox org alias is tkv2-sbx and the production org alias is tkv2-prod. I use both Claude Code and Codex. I don't want SOUL.md. What the project is: customizations to Acme's Salesforce org for the sales team. We deploy with the sf CLI to the sandbox first; I deploy to production myself.
```

Thread: 01a0e057-9d25-7360-b626-f00f3c9fb939. Started 2026-09-26T20:50:33-0400, ended 2026-09-26T20:53:07-0400. exit=0.

Events from codex exec --json (command output cut to 400 characters; a failed command's output to 3000):

```text
[error] {"id": "item_0", "type": "error", "message": "`--dangerously-bypass-hook-trust` is enabled. Enabled hooks may run without review for this invocation."}
[error] {"id": "item_1", "type": "error", "message": "`--dangerously-bypass-hook-trust` is enabled. Enabled hooks may run without review for this invocation."}
[MSG] I’m using the Toolkit V2 project setup skill. I’ll inspect the current project, apply your choices, and verify the resulting setup.
[CMD exit=0] /bin/zsh -lc 'cat /Users/michaelrihm/.codex/plugins/cache/toolkit-v2/toolkit/0.2.0/skills/project-setup/SKILL.md'
   OUT: ---
        name: project-setup
        description: 'Sets up Toolkit V2 in a project or repairs it: copies the model scaffold and applies your answers on tracker, memory, and Salesforce, checks this computer, and fixes Notion or Hindsight wiring. Use when the owner says "set up this project", "check the setup", "update the toolkit", or "new computer".'
        ---
        
        # Project setup
        
        Voice: write to the owner in plain Eng
[CMD exit=0] /bin/zsh -lc 'cat /Users/michaelrihm/.codex/plugins/cache/toolkit-v2/toolkit/0.2.0/skills/project-setup/references/interview.md'
   OUT: # The setup interview
        
        Detail for `project-setup` step 2. Ask one question per message. Each
        question carries a recommendation and its main reason, so the owner can
        answer "yes" and move on.
        
        ## Look before asking
        
        Check these first, without asking:
        
        - Is this folder a Git repository? (`git rev-parse --show-toplevel`.) No
          repository: say so and offer `git init`. Toolkit V2 finds the project, the
[CMD exit=0] /bin/zsh -lc "pwd && rg --files -g '"'!node_modules'"' -g '"'!vendor'"' | head -80"
   OUT: /private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/b-salesforce-r1
        
[CMD exit=0] /bin/zsh -lc 'ls -la && git status --short --branch && command -v toolkit || true'
   OUT: total 0
        drwxr-xr-x   3 michaelrihm  wheel   96 Sep 26 20:49 .
        drwxr-xr-x  15 michaelrihm  wheel  480 Sep 26 20:50 ..
        drwxr-xr-x  12 michaelrihm  wheel  384 Sep 26 20:49 .git
        ## main
        /Users/michaelrihm/.local/bin/toolkit
        
[CMD exit=0] /bin/zsh -lc 'git config user.name'
   OUT: Mike Rihm
        
[CMD exit=0] /bin/zsh -lc 'sf org list --json'
   OUT: {"status":0,"result":{"other":[],"sandboxes":[{"alias":"tkv2-sbx","username":"mike@acme.com.tkv2sbx","orgId":"00DFAKE0000SBX1","instanceUrl":"https://acme--tkv2sbx.sandbox.my.salesforce.com","loginUrl":"https://test.salesforce.com","isSandbox":true,"connectedStatus":"Unknown"}],"nonScratchOrgs":[{"alias":"tkv2-prod","username":"mike@acme.com","orgId":"00DFAKE0000PRD1","instanceUrl":"https://acme.m
[CMD exit=4] /bin/zsh -lc 'toolkit doctor'
   OUT: /private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/b-salesforce-r1 is not a Toolkit V2 project: there is no .toolkit.json with "toolkit": "toolkit-v2".
        toolkit init sets it up (the project-setup skill asks the questions first).
        
        This computer: no problems found (Node, the plugin-root pointer, and the Codex wrapper).
        
[MSG] This is an empty Git repository, and both Salesforce aliases appear on this computer. The toolkit’s computer check is clean. I’ll initialize the project with local work items, built-in memory, and the Salesforce guards.
[CMD exit=0] /bin/zsh -lc 'toolkit init --help'
   OUT: toolkit init: Set up Toolkit V2 in this repository: the model project's files, AGENTS.md, rules, settings, and the chosen tracker and memory. Safe to run again.
        
        Usage:
          toolkit init --name <name> --tracker <local|notion|github|jira> --memory <builtin|hindsight|notion>
                       [--key <key>] [--owner <name>] [--salesforce] [--dir <path>] [--hosts claude-code,codex]
        
        Copies the model project
[CMD exit=0] /bin/zsh -lc "ls -la && rg --files --hidden -g '"'!.git/**'"' | head -120 && git status --short"
   OUT: total 0
        drwxr-xr-x   3 michaelrihm  wheel   96 Sep 26 20:49 .
        drwxr-xr-x  16 michaelrihm  wheel  512 Sep 26 20:50 ..
        drwxr-xr-x  12 michaelrihm  wheel  384 Sep 26 20:49 .git
        
[MSG] The init command stopped because this Codex sandbox blocks writes to the project’s `.agents/` directory. I’ll prepare the full setup in a temporary Git repository, then copy the permitted files into this project. I’ll report any Codex files that remain blocked.
[CMD exit=0] /bin/zsh -lc 'mktemp -d /private/tmp/acme-toolkit-stage.XXXXXX'
   OUT: /private/tmp/acme-toolkit-stage.2KvEA9
        
[CMD exit=0] /bin/zsh -lc 'git init -q /private/tmp/acme-toolkit-stage.2KvEA9'
   OUT: 
[CMD exit=0] /bin/zsh -lc 'toolkit init --name "Acme CRM" --key acme-crm --tracker local --memory builtin --owner "Mike" --salesforce --hosts claude-code,codex'
   OUT: Set up Toolkit V2 in /private/tmp/acme-toolkit-stage.2KvEA9.
        Acme CRM (acme-crm), owner Mike. Work items: local folders in .work-items/ (ids like WI-001). Memory: built-in memory in .memory/. Salesforce: yes. Hosts: Claude Code and Codex.
        Added 114 files:
          - .agents/skills/ (3 files)
          - .claude/hooks/ (2 files)
          - .claude/output-styles/ (1 file)
          - .claude/ (2 files)
          - .claude/rules/ (18 fil
[CMD exit=0] /bin/zsh -lc 'toolkit config set salesforce.orgs.sandbox tkv2-sbx'
   OUT: Set salesforce.orgs.sandbox to tkv2-sbx (was (not set)).
        
[CMD exit=0] /bin/zsh -lc 'toolkit config set salesforce.orgs.production tkv2-prod'
   OUT: Set salesforce.orgs.production to tkv2-prod (was (not set)).
        
[CMD exit=0] /bin/zsh -lc 'cat AGENTS.md PROJECT.md README.md PROJECT-ROADMAP.md requirements/SYSTEM-DATA-MODEL.md .toolkit.json'
   OUT: Always execute work with the context in mind that the user will likely
        continue work across multiple AI coding sessions where the session context is
        cleared and picked up again. You must assist the user in helping establish
        that continuity across sessions while not adding context that might pollute
        future agents and skew them. Information must be curated and intentional.
        
        # Acme CRM: agent guide
        
        
[CMD exit=0] /bin/zsh -lc 'sf project deploy start --help | head -45'
   OUT: {"status":0,"result":{"status":"Succeeded","success":true,"done":true},"warnings":[]}
        
[CMD exit=0] /bin/zsh -lc "python3 - <<'PY'
from pathlib import Path
p=Path('AGENTS.md')
s=p.read_text()
s=s.replace('<"'!-- Project setup fill-in guide: toolkit init replaces <Project name>, keeps only the blocks for the tracker, memory system, and Salesforce choice made at setup, and writes the rules list. Then replace the one-sentence outcome below and the "Build, test, or deploy" row under Commands with this project'"\\'s confirmed values. Change paths only when the installed folder differs. Remove this guide and every angle-bracket prompt before handing the guide to a new project agent. -->\\n\\n','')
s=s.replace('<One sentence describing this project and its outcome.>', \"Customize Acme's Salesforce org for the sales team, testing changes in the sandbox before Mike deploys to production.\")
s=s.replace('"'`<Verified project commands and target environment; do not infer from this template.>`'"', '"'`sf project deploy validate -x <work-item package.xml> -o tkv2-sbx` for validation; `sf project deploy start -x <work-item package.xml> -o tkv2-sbx` for authorized sandbox deployments. Mike runs production deployments.'"')
p.write_text(s)
Path('SOUL.md').unlink()
PY"
   OUT: 
[CMD exit=0] /bin/zsh -lc "cat > PROJECT.md <<'EOF'
# Acme CRM

## Purpose and intended outcome

- Purpose: Customize Acme's Salesforce org for the sales team.
- Intended outcome: The requested sales team customizations are built and checked in the sandbox before Mike deploys them to production.

## Scope and boundaries

- In scope: Salesforce customizations for Acme's sales team.
- Outside scope: No adjacent systems or teams have been identified yet.
- Constraints: Use the "'`sf` CLI and deploy to the sandbox before production. Mike deploys to production himself. Source: Mike'"'s setup instructions, 2026-09-26.

## Systems and environments

| System or org | Purpose | Environment | Source of truth | Access notes |
| --- | --- | --- | --- | --- |
| "'`tkv2-sbx` | Build validation and initial deployment | Salesforce sandbox | Org alias confirmed by Mike and found by `sf org list` | Use as the target for sandbox checks and authorized deployments. |
| `tkv2-prod` | Live sales team org | Salesforce production | Org alias confirmed by Mike and found by `sf org list` | Mike performs production deployments. |

## People and ownership

| Role | Person or team | Responsibility | Source / last confirmed |
| --- | --- | --- | --- |
| Project owner and production deployer | Mike | Project decisions and production deployments | Mike, 2026-09-26 |
| Users | Acme sales team | Use the Salesforce customizations | Mike, 2026-09-26 |

## Work and project records

- Work tracker: `.work-items/` (local folders, Git-ignored)
- Project roadmap: [PROJECT-ROADMAP.md](PROJECT-ROADMAP.md)
- Project decisions: [DECISIONS.md](DECISIONS.md)
- Functional requirements: [requirements/](requirements/)
- Design home: `DESIGN.md` beside the local work item'"'s "'`WORK-ITEM.md`
- System Guide: `system-guide/` has a template; current org structure has not been documented yet.
- Local memory: `.memory/` (built-in memory, Git-ignored; setup choice in `.toolkit.json`)
- Memory backup or sync: No destination or restore procedure has been chosen yet.

## Resources and project paths

- Salesforce source: `force-app/` as configured by `sfdx-project.json`; no project metadata has been added yet.
- Project-wide deployment manifest: `delivery/deployment/full-project-deployment-template/package.xml` after the API version and members are verified.
- Work-item deployment manifests: `delivery/deployment/<work-item-id>-<short-name>/package.xml` when an item changes Salesforce metadata.
- Tests and checks: Validate against `tkv2-sbx` with the work item'"'s deployment manifest. Project-specific automated tests have not been defined yet.
- Outside references: "'`ai-external-knowledge/INDEX.md`

## Operating conventions

- Deploy to the sandbox with the `sf` CLI before any production deployment. Mike runs production deployments. Source: Mike'"'s setup instructions, 2026-09-26.
EOF
cat > README.md <<'EOF'
# Acme CRM

This project holds Salesforce customizations for Acme's sales team. Changes are checked in the sandbox before Mike deploys them to production.

## Purpose

Build and maintain the sales team's Salesforce customizations in a source-controlled project.

## Start here

1. Install and sign in to the Salesforce CLI for the orgs you need. Confirm the aliases with "'`sf org list`.
2. Use `tkv2-sbx` for sandbox validation and deployment. `tkv2-prod` is production; Mike performs production deployments.
3. Read [AGENTS.md](AGENTS.md) and the active work item. Validate a Salesforce change against the sandbox using its work-item manifest before deployment.

## Project records

- [PROJECT.md](PROJECT.md): purpose, scope, systems, and owners.
- [PROJECT-ROADMAP.md](PROJECT-ROADMAP.md): phases and deliverable-sized work units.
- [DECISIONS.md](DECISIONS.md): decisions for the whole project.
- [requirements/](requirements/): accepted functional behavior by area.
- [AGENTS.md](AGENTS.md): how agents work in this project.
- Active work and each item'"'s design: local "'`.work-items/` folders, configured in `.toolkit.json`.

## Project memory

Project memory lives in `.memory/`, which Git ignores. Back it up with `toolkit memory export --to` and a destination outside this repository; restore it with `toolkit memory import --from` and that destination. No backup destination has been selected yet.

## Project checks and release

- Local validation: Use `sf project deploy validate` with the work item'"'s manifest and "'`-o tkv2-sbx`. Project-specific automated checks have not been defined yet.
- Deployment process: Deploy with the `sf` CLI to `tkv2-sbx` first. Mike performs production deployment.
- Environments: sandbox `tkv2-sbx`; production `tkv2-prod`. Confirmed by Mike and found with `sf org list` on 2026-09-26.
EOF'
   OUT: 
[CMD exit=1] /bin/zsh -lc "python3 - <<'PY'
from pathlib import Path
p=Path('AGENTS.md')
s=p.read_text().replace('"'`sf project deploy validate -x <work-item package.xml> -o tkv2-sbx` for validation; `sf project deploy start -x <work-item package.xml> -o tkv2-sbx` for authorized sandbox deployments. Mike runs production deployments.'"', 'Use "'`sf project deploy validate` or `sf project deploy start` with the work item'"\\'s manifest and "'`-o tkv2-sbx`. Mike runs production deployments.'"')
p.write_text(s)
PY
toolkit doctor"
   OUT: Toolkit doctor for Acme CRM (/private/tmp/acme-toolkit-stage.2KvEA9).
        
        Problems (1):
        1. 1 scaffold file is missing: SOUL.md.
           Fix: Run toolkit sync.
        
        Warnings (3):
        2. Codex does not trust this folder (/private/tmp/acme-toolkit-stage.2KvEA9). Codex loads the project's .codex/ settings, plugin switches, and hooks only in a trusted folder. Trust is tied to the folder path, so moving the project turns it off.
           Fix: The owner opens Codex in this folder and trusts it when Codex asks.
        3. The Toolkit V2 hooks are not trusted in Codex yet, so Codex skips them (no briefing, no memory reminder, no guards).
           Fix: The owner opens /hooks in Codex once and trusts the Toolkit V2 hooks.
        4. The Salesforce org guards in .codex/hooks.json are not trusted in Codex yet, so Codex does not run them.
           Fix: The owner opens /hooks in Codex in this project and trusts the two Salesforce guards.
        
        Notes (3):
        - AGENTS.md was changed by the project, so sync leaves it alone. Nothing new from the toolkit.
        - PROJECT.md was changed by the project, so sync leaves it alone. Nothing new from the toolkit.
        - README.md was changed by the project, so sync leaves it alone. Nothing new from the toolkit.
        
        Result: 1 problem and 3 warnings.
        
[CMD exit=0] /bin/zsh -lc "rg -n 'scaffold file is missing|SOUL.md|installed' /Users/michaelrihm/.codex/plugins/cache/toolkit-v2/toolkit/0.2.0/bin /Users/michaelrihm/.codex/plugins/cache/toolkit-v2/toolkit/0.2.0/src | head -80"
   OUT: rg: /Users/michaelrihm/.codex/plugins/cache/toolkit-v2/toolkit/0.2.0/src: No such file or directory (os error 2)
        
[CMD exit=0] /bin/zsh -lc "ls -la /Users/michaelrihm/.codex/plugins/cache/toolkit-v2/toolkit/0.2.0 && rg -n 'scaffold file is missing|SOUL.md' /Users/michaelrihm/.codex/plugins/cache/toolkit-v2/toolkit/0.2.0 | head -80"
   OUT: total 0
        drwxr-xr-x  11 michaelrihm  staff  352 Sep 26 20:37 .
        drwxr-xr-x   3 michaelrihm  staff   96 Sep 26 20:37 ..
        drwxr-xr-x   3 michaelrihm  staff   96 Sep 26 20:37 .claude-plugin
        drwxr-xr-x   3 michaelrihm  staff   96 Sep 26 20:37 .codex-plugin
        drwxr-xr-x   3 michaelrihm  staff   96 Sep 26 20:37 bin
        drwxr-xr-x   4 michaelrihm  staff  128 Sep 26 20:37 hooks
        drwxr-xr-x  11 michaelrihm  staff  3
[CMD exit=0] /bin/zsh -lc "rg -n 'scaffold file|missingScaffold|installed\\[' /Users/michaelrihm/.codex/plugins/cache/toolkit-v2/toolkit/0.2.0/lib | head -80"
   OUT: /Users/michaelrihm/.codex/plugins/cache/toolkit-v2/toolkit/0.2.0/lib/commands/sync.mjs:1:// toolkit sync: add missing scaffold files and rebuild the ones nobody changed.
        /Users/michaelrihm/.codex/plugins/cache/toolkit-v2/toolkit/0.2.0/lib/commands/sync.mjs:8:export const summary = 'Add missing scaffold files and update the ones the project never changed; a file the project changed is never overwri
[MSG] The staged setup has both hosts configured and the two org aliases recorded. I’ve filled the project guides from your answers and removed `SOUL.md`. Toolkit doctor treats that removal as a missing scaffold file, so I’ll keep your choice and note the diagnostic in the handoff.
[CMD exit=0] /bin/zsh -lc "rsync -a --exclude='.git' --exclude='.agents' --exclude='.codex' /private/tmp/acme-toolkit-stage.2KvEA9/ ./"
   OUT: 
[CMD exit=0] /bin/zsh -lc 'git status --short && ls -la .codex .agents 2>&1 || true'
   OUT: ?? .claude/
        ?? .forceignore
        ?? .gitignore
        ?? .toolkit.json
        ?? AGENTS.md
        ?? CLAUDE.md
        ?? DECISIONS.md
        ?? PROJECT-ROADMAP.md
        ?? PROJECT.md
        ?? README.md
        ?? ai-external-knowledge/
        ?? delivery/
        ?? requirements/
        ?? sfdx-project.json
        ?? system-guide/
        ?? tests/
        ?? tools/
        ls: .agents: No such file or directory
        ls: .codex: No such file or directory
        
[CMD exit=0] /bin/zsh -lc 'toolkit brief'
   OUT: Project briefing: Acme CRM (acme-crm), owner Mike. Work items: local folders in .work-items/ (ids like WI-001). Memory: built-in memory in .memory/. Salesforce: yes. Hosts: Claude Code and Codex.
        Project manual: /private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/b-salesforce-r1/AGENTS.md. Stages, statuses, and approval 
[CMD exit=1] /bin/zsh -lc 'toolkit doctor'
   OUT: Toolkit doctor for Acme CRM (/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/b-salesforce-r1).
        
        Problems (1):
        1. 7 scaffold files are missing: .agents/skills/sf-component-tracker/SKILL.md, .agents/skills/sf-data-change/SKILL.md, .agents/skills/sf-deploy-check/SKILL.md, .codex/hooks.json, SOUL.md, .codex/config.toml, .codex/rules/toolkit.rules.
           Fix: Run toolkit sync.
        
        Warnings (2):
        2. Codex does not trust this folder (/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/b-salesforce-r1). Codex loads the project's .codex/ settings, plugin switches, and hooks only in a trusted folder. Trust is tied to the folder path, so moving the project turns it off.
           Fix: The owner opens Codex in this folder and trusts it when Codex asks.
        3. The Toolkit V2 hooks are not trusted in Codex yet, so Codex skips them (no briefing, no memory reminder, no guards).
           Fix: The owner opens /hooks in Codex once and trusts the Toolkit V2 hooks.
        
        Notes (3):
        - AGENTS.md was changed by the project, so sync leaves it alone. Nothing new from the toolkit.
        - PROJECT.md was changed by the project, so sync leaves it alone. Nothing new from the toolkit.
        - README.md was changed by the project, so sync leaves it alone. Nothing new from the toolkit.
        
        Result: 1 problem and 2 warnings.
        
[CMD exit=0] /bin/zsh -lc "ls -la .memory .work-items && cat .claude/protected-orgs.json && rg -n 'SOUL|<["'^>]+>'"' AGENTS.md PROJECT.md README.md PROJECT-ROADMAP.md requirements/SYSTEM-DATA-MODEL.md"
   OUT: .memory:
        total 56
        drwxr-xr-x   8 michaelrihm  wheel   256 Sep 26 20:51 .
        drwx------  22 michaelrihm  wheel   704 Sep 26 20:51 ..
        -rw-r--r--   1 michaelrihm  wheel  4207 Sep 26 20:51 AGENTS.md
        -rw-r--r--   1 michaelrihm  wheel   964 Sep 26 20:51 CURRENT_FOCUS.md
        -rw-r--r--   1 michaelrihm  wheel   486 Sep 26 20:51 MEMORY.md
        -rw-r--r--   1 michaelrihm  wheel  3248 Sep 26 20:51 memory-criteria.md
        -rw
[CMD exit=0] /bin/zsh -lc 'git status --short --untracked-files=all | wc -l'
   OUT:      100
        
[CMD exit=0] /bin/zsh -lc 'git check-ignore .memory/MEMORY.md .work-items/DASHBOARD.md && python3 -m json.tool .toolkit.json >/dev/null && python3 -m json.tool .claude/protected-orgs.json >/dev/null'
   OUT: .memory/MEMORY.md
        .work-items/DASHBOARD.md
        
[MSG] Toolkit V2 is **partially set up** for Acme CRM. The project has local `WI` work items, built-in `.memory/`, Salesforce setup with sandbox `tkv2-sbx` and production `tkv2-prod`, and the shared [agent guide](/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/b-salesforce-r1/AGENTS.md). The [project record](/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/b-salesforce-r1/PROJECT.md) records sandbox-first delivery and that you deploy to production. I removed `SOUL.md` as requested.

**Codex setup still needs one local step.** This session’s sandbox blocked writes to `.agents/` and `.codex/`. From a terminal in this project, run `toolkit sync` to install those files; it preserves the project guides I filled. That command will also recreate `SOUL.md`, so delete it afterward. Toolkit doctor will continue to report `SOUL.md` as missing because the scaffold expects it, despite your choice.

Then trust this project in Codex and trust its Toolkit V2 hooks through `/hooks`; start a new Claude Code session to load its settings. The [roadmap](/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/b-salesforce-r1/PROJECT-ROADMAP.md) still needs actual work phases, and the [data model](/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/b-salesforce-r1/requirements/SYSTEM-DATA-MODEL.md) needs accepted requirements.

Tell me the first thing you want built.
[USAGE] {"input_tokens": 841013, "cached_input_tokens": 793856, "cache_write_input_tokens": 0, "output_tokens": 6312, "reasoning_output_tokens": 2242}
```

Final message:

Toolkit V2 is **partially set up** for Acme CRM. The project has local `WI` work items, built-in `.memory/`, Salesforce setup with sandbox `tkv2-sbx` and production `tkv2-prod`, and the shared [agent guide](/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/b-salesforce-r1/AGENTS.md). The [project record](/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/b-salesforce-r1/PROJECT.md) records sandbox-first delivery and that you deploy to production. I removed `SOUL.md` as requested.

**Codex setup still needs one local step.** This session’s sandbox blocked writes to `.agents/` and `.codex/`. From a terminal in this project, run `toolkit sync` to install those files; it preserves the project guides I filled. That command will also recreate `SOUL.md`, so delete it afterward. Toolkit doctor will continue to report `SOUL.md` as missing because the scaffold expects it, despite your choice.

Then trust this project in Codex and trust its Toolkit V2 hooks through `/hooks`; start a new Claude Code session to load its settings. The [roadmap](/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/b-salesforce-r1/PROJECT-ROADMAP.md) still needs actual work phases, and the [data model](/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/b-salesforce-r1/requirements/SYSTEM-DATA-MODEL.md) needs accepted requirements.

Tell me the first thing you want built.

## Digest from the Codex session log (rollout)

- start 2026-09-26T20:50:33-0400, end 2026-09-26T20:53:07-0400, thread 01a0e057-9d25-7360-b626-f00f3c9fb939
- prompt: "Set up this project with the toolkit (Toolkit V2). My answers, so you don't have to ask: project name Acme CRM, key acme-crm, work item ids start with WI, owner Mike. Track work in local folders. Use the built-in .memory/ memory. Yes, it is a Salesforce project: the sandbox org alias is tkv2-sbx and the production org alias is tkv2-prod. I use both Claude Code and Codex. I don't want SOUL.md. What the project is: customizations to Acme's Salesforce org for the sales team. We deploy with the sf CLI to the sandbox first; I deploy to production myself."
- skills opened (SKILL.md read): project-setup
- sub-agents: 0
- hooks: briefing=no, keep-line=no, keep=None, records=0, post-edit validations=[], stopBlocked=None
- toolkit commands (9): toolkit doctor [4]; toolkit init --help [0]; toolkit init --name [0]; toolkit config set salesforce.orgs.sandbox tkv2-sbx [0]; toolkit config set salesforce.orgs.production tkv2-prod [0]; toolkit init replaces <Project name>, keeps only the blocks for the tracker, memory system, and Salesf [0]; toolkit doctor [1]; toolkit brief [0]

