# Salesforce Org Safety

Applies to every agent and subagent. Read-only against every org, except the sandbox actions below.

## Allowed

- Read data: `sf data query`, `sf data query --bulk`, `sf data get record`, `sf data export bulk`, `sf data export tree`, `sf data search`.
- Read metadata: `sf project retrieve start`, `sf sobject describe`, `sf schema ...`, `sf org display`, `sf org list`.
- Apex and Flow tests against a sandbox or scratch org: `sf apex run test -o <sandbox>`, `sf flow run test -o <sandbox>`.
- Apex logs and test results: `sf apex get log`, `sf apex tail log`, `sf apex get test`.
- Validate or preview against a sandbox: `sf project deploy validate -x <manifest> -o <sandbox>`, `sf project deploy preview`, `sf project deploy report`.
- Deploy to a sandbox: `sf project deploy start -x delivery/deployments/<chosen-folder>/package.xml -o <sandbox>` or `sf project deploy start -d <path> -o <sandbox>`. Use the work item's package for ordinary changes. "The owner's yes for a sandbox change" below says when to ask first.
- Sandbox data writes (`sf data create / update / delete / import / upsert`) and `sf apex run` against a sandbox. "The owner's yes for a sandbox change" below says when to ask first.

## Never

- Never deploy or validate against production, even if asked. Hand the owner the command instead.
- Never write data or run anonymous Apex in production: `sf data create / update / delete / import / upsert` (record, bulk, or tree), `sf apex run`, `sfdx force:apex:execute`. Hand over a file per `production-data-changes.md`.
- Never run Apex or Flow tests in production: `sf apex run test`, `sf flow run test`, `sf logic run test`, `sfdx force:apex:test:run`. Hand the owner the command instead.
- Never delete metadata from an org: `sf project delete source`, `force:source:delete`. The one exception is in "The owner's yes for a sandbox change" below.
- Never delete an org or sandbox.
- Never use `force:mdapi:deploy`, `force:source:push`, or `force:source:deploy` without a manifest. Use `sf project deploy start`.
- Never deploy, validate, write data, run Apex, or run Apex or Flow tests without naming the target sandbox explicitly (`-o <sandbox>` for `sf`). Never trust the default org.
- Never write or run a script, or any other file, that deploys, validates, writes data, runs Apex, or runs Apex or Flow tests. Run each `sf` command directly, so the guard sees it.
- Never deploy a profile. The one exception is in "The owner's yes for a sandbox change" below.
- Never deploy a permission set without a clean `permsets.py preflight`. `sf project deploy validate` and `preview` do not detect removed grants.
- Never add a production username or alias to `neverProtect` or to any sandbox allow-list.
- Never rewrite a blocked command to get past a guard hook. Never edit a guard to weaken it. Ask the owner.

## The owner's yes for a sandbox change

- Before each deploy, data write, or `sf apex run` on a sandbox or scratch org, ask the owner. Run it after the owner's yes for that change.
- The owner turns these questions off and on by telling you, for example "stop asking for sandbox work" or "turn the sandbox questions back on".
  - When the owner turns them off, add the line "Sandbox questions: off (<YYYY-MM-DD>, <owner name>)" directly under "Last updated" in the project's Current State. When the owner turns them on, remove that line.
  - Never add or remove that line unless the owner told you to in this session.
  - Keep the choice only in that line. Write nothing about it in `.claude/rules/owner-preferences.md` or in memory.
- While that line is there, run a deploy, a data write, or `sf apex run` on a sandbox or scratch org without asking for the owner's yes, in every session. The line is the owner's yes for each one, and also the yes that `managing-work-items` asks for before a deploy to a sandbox that other people use.
- While that line is there, you may also deploy a profile to a sandbox or scratch org, and delete metadata from one with a deploy that holds a destructive changes file (`--pre-destructive-changes` or `--post-destructive-changes`). `sf project delete source` stays forbidden.
- The line never covers production, an org the guard cannot classify, or deleting an org.

## Enforcement

- `guard-protected-orgs.cjs`, where installed, checks deploys, `deploy validate`, DevOps Center pipeline deploys, data create, update, upsert, import, and delete, `apex run`, Apex and Flow test runs, `project delete source`, and `org delete`.
- Aimed at production or an unclassified org, it asks by default; `"action": "deny"` in `.claude/protected-orgs.json` blocks.
- A pipeline deploy (`sf project deploy pipeline start`, `quick`, `resume`, or `validate`) goes to the org of a pipeline stage, which the command line does not name, so the guard treats that org as unclassified.
- Aimed at a sandbox or scratch org, it lets every command pass with no question, except `org delete`, which gets the same decision as on production. "The owner's yes for a sandbox change" above says when you ask.
- It does not check reads, such as `apex get test`.
- It checks the `sf` and `sfdx` commands the shell will run, not text that only mentions one, such as an echo or a commit message, and it lets `--help` through.
- A `bash -c` string, a `$(...)`, a here-document fed to a shell, or a script written and run in the same command is still checked.
- A script file run by a later command is not checked, which is why the Never list forbids such a script.
- Codex runs the same guard and cannot ask, so there every ask is a block and the command goes to the owner.
- Follow this list whether or not a hook fires.
