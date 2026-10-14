# Salesforce Deployments

`delivery/AGENTS.md` gives the folders of `delivery/`, the form of each record, and the Status values. This rule adds what only a Salesforce project has: when to update the component tracker, when to record a manual deployment step, when to check what a deployment includes, and how a record in `delivery/` is started.

## Deploying a work item

When a work item is in Deploying, also follow `.claude/skills/managing-work-items/references/salesforce-deploying.md`, which gives the Salesforce detail for a deployment.

## Keep deployment records current

When metadata under `force-app/` changes, a deploy result arrives, or a deployment needs a manual action, open `sf-component-tracker` and update its records in the same response.

## Check what a deployment includes

A deploy ships the whole current source of every component it names, not only your edit.

- Before any deploy to a shared org (for example UAT, full copy, staging, or production), and before you hand the owner any production deploy command, open the `sf-deploy-check` skill (`.claude/skills/sf-deploy-check/SKILL.md`) and run its check.

## Records in delivery/

- Setup copied these into `delivery/`: `deployments/component-tracker.csv`, `deployments/full-project-deployment-template/`, `deployments/work-item-deployment-template/`, `releases/release-cutover-template/`, `migrations/area-template/`, `migrations/data-loads/`, and `migrations/production-backups/`.
- Start a deployment folder, a release folder, or a migration area by copying its template folder. Never write a record into a template.
- For a production data change, its load file, and its backup, use the `sf-data-change` skill.
