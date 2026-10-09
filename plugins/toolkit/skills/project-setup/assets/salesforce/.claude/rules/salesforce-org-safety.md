# Salesforce Org Safety

Applies to every agent and subagent.

## Three places, each with one job

- This rule holds the limits that are the same in every project. No line of another file changes them.
- `.claude/rules/salesforce-agent-permissions.md` holds the owner's choices for this project. For each kind of action and each kind of org, it says Allowed, Ask first, or Never. Read it before any command that changes an org.
- The guard, `guard-protected-orgs.cjs`, with its settings in `.claude/protected-orgs.json`, stops a command aimed at production or at an org it cannot classify, whatever the owner's file says. The owner's file decides what this rule does not forbid and the guard lets through.

## Limits in every project

- Never deploy or validate against production, even if asked. Hand the owner the command instead.
- Never write data or run anonymous Apex in production: `sf data create / update / delete / import / upsert` (record, bulk, or tree), `sf apex run`, `sfdx force:apex:execute`, or any tool that wraps them. For a data change, prepare the handoff with the `sf-data-change` skill. The one kind of production data that a project can open to the agent is DevOps Center records, in the owner's file.
- Never run Apex or Flow tests in production: `sf apex run test`, `sf flow run test`, `sf logic run test`, `sfdx force:apex:test:run`. Hand the owner the command instead.
- Never delete metadata with `sf project delete source` or `force:source:delete`, on any org.
- Never delete an org or sandbox.
- Never use `force:mdapi:deploy`, `force:source:push`, or `force:source:deploy` without a manifest. Use `sf project deploy start`.
- Never deploy, validate, write data, run Apex, or run Apex or Flow tests without naming the target org explicitly (`-o <org>` for `sf`). Never trust the default org.
- Never write or run a script, or any other file, that deploys, validates, writes data, runs Apex, or runs Apex or Flow tests. Run each `sf` command directly, so the guard sees it.
- Never deploy a permission set without a clean `permsets.py preflight`. `sf project deploy validate` and `preview` do not detect removed grants.
- Change `.claude/protected-orgs.json` only when the owner told you that change in this session. Never add a production username or alias to `neverProtect` or to any sandbox allow-list.
- Never rewrite a blocked command to get past a guard hook. Never edit a guard to weaken it. When the guard blocks a command that the owner's file allows, tell the owner.

## The commands

These are the commands for each kind of action. The owner's file says whether you may run one.

- Read data: `sf data query`, `sf data query --bulk`, `sf data get record`, `sf data export bulk`, `sf data export tree`, `sf data search`.
- Read metadata: `sf project retrieve start`, `sf sobject describe`, `sf schema ...`, `sf org display`, `sf org list`.
- Read Apex logs and test results: `sf apex get log`, `sf apex tail log`, `sf apex get test`.
- Validate or preview a deploy: `sf project deploy validate -x <manifest> -o <org>`, `sf project deploy preview`, `sf project deploy report`.
- Deploy metadata: `sf project deploy start -x delivery/deployments/<chosen-folder>/package.xml -o <org>` or `sf project deploy start -d <path> -o <org>`. Use the work item's package for ordinary changes.
- Delete metadata: a deploy that holds a destructive changes file (`--pre-destructive-changes` or `--post-destructive-changes`).
- Run Apex or Flow tests: `sf apex run test -o <org>`, `sf flow run test -o <org>`.
- Change data: `sf data create / update / delete / import / upsert` (record, bulk, or tree).
- Run anonymous Apex: `sf apex run -o <org>`.
- Promote through a DevOps Center pipeline: `sf project deploy pipeline start`, `quick`, `resume`, or `validate`.

## Enforcement

- `guard-protected-orgs.cjs`, where installed, checks deploys, `deploy validate`, DevOps Center pipeline deploys, data create, update, upsert, import, and delete, `apex run`, Apex and Flow test runs, `project delete source`, and `org delete`.
- Aimed at production or an unclassified org, it asks by default; `"action": "deny"` in `.claude/protected-orgs.json` blocks.
- A pipeline deploy (`sf project deploy pipeline start`, `quick`, `resume`, or `validate`) goes to the org of a pipeline stage, which the command line does not name, so the guard treats that org as unclassified.
- Aimed at a sandbox or scratch org, it lets every command pass with no question, except `org delete`, which gets the same decision as on production. The owner's file says when you ask.
- It does not check reads, such as `apex get test`.
- It checks the `sf` and `sfdx` commands the shell will run, not text that only mentions one, such as an echo or a commit message, and it lets `--help` through.
- A `bash -c` string, a `$(...)`, a here-document fed to a shell, or a script written and run in the same command is still checked.
- A script file run by a later command is not checked, which is why "Limits in every project" forbids such a script.
- Codex runs the same guard and cannot ask, so there every ask is a block and the command goes to the owner.
- Follow this rule and the owner's file whether or not a hook fires.
