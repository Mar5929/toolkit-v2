# <Work item name>: deployment record

<!-- Fill-in guide: create one deployment folder named for the work item's short name. Replace every angle-bracket prompt in each labeled field, row, and paragraph with that deploy's verified information. Keep the package link; replace optional Removals and Manual steps values with links only when those files exist. Record checks before the deploy and actual results afterward. Delete this guide and example check rows once populated. -->

**Work item:** <The work item's ID, for example `WI-031`, plus its link when the work tracker has one; never a folder path.>  
**Folder name:** `<short name>`  
**Target org:** <Verified alias and environment.>  
**Status:** <Preparing | Validated | Deployed | Failed | Rolled back>  
**Owner:** <Person responsible for the deploy.>

## Scope

- Package: [package.xml](package.xml)
- Removals: <Link to destructiveChanges.xml if used; otherwise None.>
- Manual steps: <Link to manual-steps.md if needed; otherwise None.>
- Source revision: <Commit or other exact source reference.>

## Preflight and approval

| Check | Result | Evidence and date |
| --- | --- | --- |
| Requirement and design readiness | <Pass / Open> | <Link> |
| Deploy scope check (`sf-deploy-check`) | <Pass / Open> | <Link to checked deploy set and target-org read> |
| Validation or dry run | <Pass / Open> | <Command result or job ID> |
| Owner deploy decision | <Approved / Pending> | <Who, when, and the Q-ID of the work item's Questions and Answers row> |

## Execution and outcome

- Started: <Date, time, and operator.>
- Deployment job: <ID or link.>
- Result: <What landed, failed, or was rolled back.>
- Post-deploy checks: <Checks, results, and evidence.>
- Component tracker update: <When org flags were reconciled, or pending.>

## Handoff

<Remaining actions, support owner, and where to resume. Keep detailed work-item history in the tracker.>
