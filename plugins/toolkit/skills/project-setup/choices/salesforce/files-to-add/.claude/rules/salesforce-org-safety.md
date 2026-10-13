# Salesforce Org Safety

Applies to every agent and subagent.

## Three places, each with one job

- This rule holds the limits that are the same in every project. No line of another file changes them. For production, the limit is to follow the owner's file.
- `.claude/rules/salesforce-agent-permissions.md` holds the owner's choices for this project. For each kind of action and each kind of org, it says Allowed, Ask first, or Never. Read it before any command that changes an org.
- The refuse list, `permissions.deny` in `.claude/settings.json`, makes Claude Code refuse a command that names a read-only org and changes it. It also refuses a command that names a production org and makes a change that the owner's file says Never for production. The owner's file decides what this rule does not forbid.

## Limits in every project

- Change production only as `.claude/rules/salesforce-agent-permissions.md` allows. Its defaults say Never for every change to production, and the owner may change them for this project. Where it says Never, hand the owner the command, or for a data change the handoff that the `sf-data-change` skill prepares.
- Never change an org that `PROJECT.md` marks read-only. Read it only.
- Never delete metadata with `sf project delete source` or `force:source:delete`, on any org.
- Never delete an org or sandbox.
- Never use `force:mdapi:deploy`, `force:source:push`, or `force:source:deploy` without a manifest. Use `sf project deploy start`.
- Never deploy, validate, write data, run Apex, or run Apex or Flow tests without naming the target org explicitly (`-o <org>` for `sf`). Never trust the default org.
- Never write or run a script, or any other file, that deploys, validates, writes data, runs Apex, or runs Apex or Flow tests. Run each `sf` command directly, so that the refuse list can match it.
- Never deploy a permission set before you have compared the file with the org's copy and confirmed that the deploy removes no grant. A deploy replaces the whole permission set, so a grant that the file lacks is switched off. `sf project deploy validate` and `preview` do not detect removed grants.
- Remove or change an entry of the refuse list for a production org or a read-only org only when the owner told you that change in this session. When the owner changes a production cell of the owner's file, change the entries for that cell in the same edit, as "Keeping the refuse list in step" below says; the owner's instruction covers that change.
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

## Keeping the refuse list in step

The production entries follow the production cells of the owner's file. Each entry names the org and one command of "The commands" above, written twice: once with the org's name at the end, and once with more text after it, such as `Bash(sf project deploy * acme-prod)` and `Bash(sf project deploy * acme-prod *)`, and again with `PowerShell(` in place of `Bash(`.

- One entry can cover several rows. For example, `sf project deploy` covers every deploy row and the pipeline row, and `sf apex run` covers both tests and anonymous Apex.
- Keep an entry while any row it covers says Never for production. Remove it only when every row it covers says Allowed or Ask first. A narrower entry, such as `sf apex run test`, can replace a broader one.
- Tell the owner which actions the owner's file allows that Claude Code will still refuse.
- Keep every entry for a read-only org.

## Enforcement

- In Claude Code, the project's `.claude/settings.json` refuses a deploy, a deploy validation, a data change, anonymous Apex, or an Apex or Flow test run when the command names a read-only org. It refuses the same commands when the command names a production org and the owner's file says Never for that change in production. It refuses `sf project delete source` and `sf org delete` on every org. Setup writes the entries for the production orgs and read-only orgs that the owner names.
- The refuse list matches the text of a command. It does not stop a command that reaches production without naming it, a command that names no org, or a script. This rule forbids all three.
- Codex has no refuse list. There, this rule and the owner's file are the only protection for production and read-only orgs.
- Follow this rule and the owner's file whether or not a command is refused.
