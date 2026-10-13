# Salesforce Org Safety

Applies to every agent and subagent.

## Three places, each with one job

- This rule holds the limits that are the same in every project. No line of another file changes them.
- `.claude/rules/salesforce-agent-permissions.md` holds the owner's choices for this project. For each kind of action and each kind of org, it says Allowed, Ask first, or Never. Read it before any command that changes an org.
- The refuse list, `permissions.deny` in `.claude/settings.json`, makes Claude Code refuse a command that changes an org and names a production org or a read-only org, whatever the owner's file says. The owner's file decides what this rule does not forbid.

## Limits in every project

- Never deploy or validate against production, even if asked. Hand the owner the command instead.
- Never write data or run anonymous Apex in production: `sf data create / update / delete / import / upsert` (record, bulk, or tree), `sf apex run`, `sfdx force:apex:execute`, or any tool that wraps them. For a data change, prepare the handoff with the `sf-data-change` skill. The one kind of production data that a project can open to the agent is DevOps Center records, in the owner's file.
- Never run Apex or Flow tests in production: `sf apex run test`, `sf flow run test`, `sf logic run test`, `sfdx force:apex:test:run`. Hand the owner the command instead.
- Never change an org that `PROJECT.md` marks read-only. Read it only.
- Never delete metadata with `sf project delete source` or `force:source:delete`, on any org.
- Never delete an org or sandbox.
- Never use `force:mdapi:deploy`, `force:source:push`, or `force:source:deploy` without a manifest. Use `sf project deploy start`.
- Never deploy, validate, write data, run Apex, or run Apex or Flow tests without naming the target org explicitly (`-o <org>` for `sf`). Never trust the default org.
- Never write or run a script, or any other file, that deploys, validates, writes data, runs Apex, or runs Apex or Flow tests. Run each `sf` command directly, so that the refuse list can match it.
- Never deploy a permission set before you have compared the file with the org's copy and confirmed that the deploy removes no grant. A deploy replaces the whole permission set, so a grant that the file lacks is switched off. `sf project deploy validate` and `preview` do not detect removed grants.
- Remove or change an entry of the refuse list for a production org or a read-only org only when the owner told you that change in this session.
- Never rewrite a refused command to get past the refuse list. When Claude Code refuses a command that the owner's file allows, tell the owner.

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

- In Claude Code, the project's `.claude/settings.json` refuses a command that names a production org or a read-only org and is a deploy, a deploy validation, a data change, anonymous Apex, or an Apex or Flow test run. It refuses `sf project delete source` and `sf org delete` on every org. Setup writes the entries for the production orgs and read-only orgs that the owner names.
- The refuse list matches the text of a command. It does not stop a command that reaches production without naming it, a command that names no org, or a script. This rule forbids all three.
- Codex has no refuse list. There, this rule and the owner's file are the only protection for production and read-only orgs.
- Follow this rule and the owner's file whether or not a command is refused.
