# Salesforce manifests

Open this file when changing any manifest.

## What each manifest holds

The master manifest and the tracker hold the same components. These rules apply to every agent and every session.

- Every tracker row that the command line can deploy is a member of the master manifest, and every member has a tracker row.
- A full cutover leaves out a component whose row is missing from the master manifest, and it gives no warning.
- The master manifest never names a component for removal. A removal goes in a work item's `destructiveChanges.xml`.

A work item's manifest holds only that work item's part.

- It names only the work item's new and changed components. Each of its members is also in the master manifest.
- Deploy the work item's manifest, and not the master manifest, unless the goal is a full cutover.
- A removal goes in `destructiveChanges.xml`, never in a `package.xml`.

## Component types that stay out of the master manifest

A manifest cannot deploy these types safely today: profiles, duplicate rules, matching rules, and compact-layout assignments. They move by change set or by hand.

- Add a tracker row for each one. The tracker is the full list of what the project created or changed.
- Keep them out of the master manifest, and name them in the header comment of the master manifest as left out.
- Add their deploy as a step in the `manual-steps.md` that it belongs to. The step says which change set to build, which assignment to make, and in what order.

Permission sets are not one of these types. A permission set gets a normal tracker row and a normal manifest member. It deploys only after you have confirmed that the deploy removes no grant, as the rule `salesforce-org-safety.md` says. Set its org flags like any other component's, as "Org flags" below says.

