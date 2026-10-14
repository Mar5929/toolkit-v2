# Salesforce deployment records

Open this file when locating or starting deployment and release records.

## The records and where they are kept

- **The component tracker** is `delivery/deployments/component-tracker.csv`. It is one CSV file for the whole project, with one row for each component that the project created or changed. Each row has a flag for each org, which says whether the component is deployed there. Never split the tracker by work item.
- **A manifest** is a `package.xml` file. It names the components that a Salesforce command-line deploy includes.
- **The master manifest** is `delivery/deployments/full-project-deployment-template/package.xml`. It names every component in the tracker that the command line can deploy. It is used for a full cutover, which is a deploy of the whole project to one org. Fill in the verified API version before its first use.
- **A work item's manifest** is the `package.xml` in that work item's deployment folder. It names only the components that the work item adds or changes.
- **`destructiveChanges.xml`**, in a work item's deployment folder, names the components that the work item removes.
- **`manual-steps.md`** holds the steps that a person does by hand for a deploy. It sits beside the manifest that it belongs to.

```
delivery/deployments/
  component-tracker.csv                  one tracker for the whole project
  full-project-deployment-template/
      package.xml                        project-wide manifest; mirrors the tracker
      manual-steps.md                    manual steps for a full project cutover, if needed
  work-item-deployment-template/  copy it to start a work item's folder
  <work-item-id>-<short-name>/  one folder per work item that ships metadata
      DEPLOYMENT-RECORD.md     deployment scope, evidence, and outcome
      package.xml              that item's new and changed components
      destructiveChanges.xml   only if the item removes components
      manual-steps.md          only if the item has manual steps
delivery/releases/
  release-cutover-template/       copy it to start a release folder
  <YYYY-MM-DD>-<release-name>/ one folder per release that ships several work items together: CUTOVER-PLAN.md and RELEASE-NOTES.md
```

- Name each work item's deployment folder with the work item's ID and a short name from the project's work tracker, for example `WI-031-account-merge`. This folder is not the work item. Find the work item by its ID in the project's work tracker.
- Keep the work items' deployment folders directly under `delivery/deployments/`. Do not sort them into folders by status. The work tracker holds each work item's status, and the tracker's org flags record what is deployed where.

