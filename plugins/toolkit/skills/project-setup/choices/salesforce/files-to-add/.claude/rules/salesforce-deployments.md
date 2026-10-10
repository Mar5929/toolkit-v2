# Salesforce Deployments

`delivery/AGENTS.md` gives the folders of `delivery/`, the form of each record, and the Status values. This rule adds what only a Salesforce project has: when to update the component tracker, when to record a manual deployment step, when to check what a deployment includes, and how a record in `delivery/` is started.

## Keep the component tracker current

- When you author, modify, rename, or delete metadata under `force-app/`, open the `sf-component-tracker` skill (`.claude/skills/sf-component-tracker/SKILL.md`). In the same response, update `delivery/deployments/component-tracker.csv`, `delivery/deployments/full-project-deployment-template/package.xml`, and the work item's deployment folder.
- When the owner reports a deploy that succeeded, open the same skill and update the org flags.
- Never change an org flag for a failed deploy.

## Record manual deployment steps

- When metadata needs an action the deploy cannot perform, add a step to `manual-steps.md` in the work item's deployment folder, or `delivery/deployments/full-project-deployment-template/manual-steps.md` for the full project cutover, in the same response.
- Open the `sf-component-tracker` skill for the step shape and the trigger list.
- When unsure, add the step.
- The Status of a step in `manual-steps.md` is Not started, In progress, Done, or Skipped.

## Check what a deployment includes

A deploy ships the whole current source of every component it names, not only your edit.

- Before any deploy to a shared org (for example UAT, full copy, staging, or production), and before you hand the owner any production deploy command, open the `sf-deploy-check` skill (`.claude/skills/sf-deploy-check/SKILL.md`) and run its check.
- Verify a suspected unrelated change against the target org read-only before you report it. A tracker is a hint, not proof.
- If a confirmed unrelated change remains, stop. Do not deploy and do not hand over the command. Tell the owner which component and what would ship.

## Records in delivery/

- Setup copied these into `delivery/`: `deployments/component-tracker.csv`, `deployments/full-project-deployment-template/`, `deployments/work-item-deployment-template/`, `releases/release-cutover-template/`, `migrations/area-template/`, `migrations/data-loads/`, and `migrations/production-backups/`.
- Start a deployment folder, a release folder, or a migration area by copying its template folder. Never write a record into a template.
- For a production data change, its load file, and its backup, use the `sf-data-change` skill.
