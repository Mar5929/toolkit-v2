# Salesforce Org Safety

Applies to every agent and subagent. Read-only against every org, except the sandbox actions below.

## Allowed

- Read data: `sf data query`, `sf data query --bulk`, `sf data get record`, `sf data export bulk`, `sf data export tree`, `sf data search`.
- Read metadata: `sf project retrieve start`, `sf sobject describe`, `sf schema ...`, `sf org display`, `sf org list`.
- Apex tests and logs: `sf apex test run`, `sf apex get log`, `sf apex tail log`.
- Validate or preview against a sandbox: `sf project deploy validate -x <manifest> -o <sandbox>`, `sf project deploy preview`, `sf project deploy report`.
- Deploy to a sandbox, after the owner says yes for that deploy: `sf project deploy start -x delivery/deployment/<chosen-folder>/package.xml -o <sandbox>` or `sf project deploy start -d <path> -o <sandbox>`. Use the work item's package for ordinary changes.
- Sandbox data writes (`sf data create / update / delete / import / upsert`) and `sf apex run` against a sandbox, after the owner says yes for that change in the same chat.
- In Codex, the owner runs every sandbox deploy and sandbox data change, including `sf apex run` against a sandbox. Hand him the exact command, with its `-o <sandbox>`; do not run it yourself, even after his yes.

## Never

- Never deploy or validate against production, even if asked. Hand the owner the command instead.
- Never write data or run anonymous Apex in production: `sf data create / update / delete / import / upsert` (record, bulk, or tree), `sf apex run`, `sfdx force:apex:execute`. Hand over a file per `production-data-changes.md`.
- Never delete metadata from an org: `sf project delete source`, `force:source:delete`.
- Never delete an org or sandbox.
- Never use `force:mdapi:deploy`, `force:source:push`, or `force:source:deploy` without a manifest. Use `sf project deploy start`.
- Never deploy, validate, write data, or run Apex without naming the target sandbox explicitly (`-o <sandbox>` for `sf`). Never trust the default org.
- Never write or run a script, or any other file, that deploys, validates, writes data, or runs Apex. Run each `sf` command directly, so the guard sees it.
- Never deploy a profile.
- Never deploy a permission set without a clean `permsets.py preflight`. `sf project deploy validate` and `preview` do not detect removed grants.
- Never add a production username or alias to `neverProtect` or to any sandbox allow-list.
- Never rewrite a blocked command to get past a guard hook. Never edit a guard to weaken it. Ask the owner.

## Enforcement

- `guard-protected-orgs.cjs`, where installed, checks deploys, `deploy validate`, DevOps Center pipeline deploys, data create, update, upsert, import, and delete, `apex run`, `project delete source`, and `org delete`.
- Aimed at production or an unclassified org, it asks by default; `"action": "deny"` in `.claude/protected-orgs.json` blocks.
- A pipeline deploy (`sf project deploy pipeline start`, `quick`, `resume`, or `validate`) goes to the org of a pipeline stage, which the command line does not name, so the guard treats that org as unclassified.
- Aimed at a sandbox, it asks for everything except `deploy validate`.
- It does not check `apex test run` or reads.
- It checks the `sf` and `sfdx` commands the shell will run, not text that only mentions one, such as an echo or a commit message, and it lets `--help` through.
- A `bash -c` string, a `$(...)`, a here-document fed to a shell, or a script written and run in the same command is still checked.
- A script file run by a later command is not checked, which is why the Never list forbids such a script.
- Codex runs the same guard and cannot ask, so there every ask is a block and the command goes to the owner.
- Follow this list whether or not a hook fires.
