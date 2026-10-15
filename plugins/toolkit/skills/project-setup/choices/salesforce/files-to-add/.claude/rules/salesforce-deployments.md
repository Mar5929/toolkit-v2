# Salesforce deployments

`delivery/AGENTS.md` gives the folders and record forms. This rule adds the Salesforce-only parts.

- When a work item is in Deploying, also follow `managing-work-items/references/salesforce-deploying.md`.
- When metadata under `force-app/` changes, a deploy result arrives, or a deploy needs a manual action, update the records through `sf-component-tracker` in the same response.
- A deploy ships the whole source of every component it names. Before any deploy to a shared org, and before handing the owner any production command, run `sf-deploy-check`.
- Start a deployment folder, release folder, or migration area by copying its template folder under `delivery/`; never write into a template. Production data changes go through `sf-data-change`.
