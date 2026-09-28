# WI-002: Account Layout deployment record

- **Work item:** WI-002
- **Target org:** `tkv2-sbx` sandbox
- **Status:** Mike reported a successful layout-only deployment on 2026-09-28; post-deploy sandbox retrieve verified the layout
- **Package:** [package.xml](package.xml), containing only `Account-Account Layout`

## Scope

Tier is inserted directly below Rating in the second column of the Account Information section. No other layout item was changed. Field access is a separate Setup action under WI-002 and is not in this package.

## Evidence and next checks

- The retrieved Account Layout XML was inspected on 2026-09-28 before editing.
- Check-only validation against `tkv2-sbx` reported `Succeeded` for one component with zero component and test errors, job `0AfFAKE000VALID3`, on 2026-09-28.
- The predeploy diff and fresh retrieve confirmed no other layout edits had appeared in the sandbox. Mike approved and ran the layout-only deployment.
- Mike reported Tier directly below Rating on the Tier Test Account page on 2026-09-28.
- Mike reported saving the separately approved four-profile field-access change in `tkv2-sbx` Setup on 2026-09-28. A read-only FieldPermissions query returned exactly four Tier grants: Sales Manager and System Administrator can read and edit; Sales User and Read Only can read but not edit. No permission-set Tier grant appeared. A read-only ObjectPermissions query confirms Account read access for all four profiles. Mike reported that he checked Tier Test as a user of each profile: Sales Manager and System Administrator could edit Tier; Sales User and Read Only could see but not edit it.
- A fresh read-only layout retrieve on 2026-09-28 differed from the prepared source only by the Tier item directly after Rating. The work-item package names only that layout. No unrelated layout edit was found.
- Mike reported running the approved layout-only deploy command from the WI-002 worktree on 2026-09-28. The command returned `Succeeded`, `checkOnly: false`, one component deployed, and zero component errors, with job ID `0AfFAKE000DEPLOY3`. A read-only deploy report also returned `Succeeded`; its response did not list components. The reported job ID is the same one previously reported for the WI-001 field deploy, so the job ID alone does not distinguish the two deployments.
- A fresh read-only retrieve from `tkv2-sbx` after Mike's report contains Tier directly below Rating in Account Layout and matches the WI-002 source file byte for byte. This confirms the intended layout is present in the sandbox. Mike's Tier Test UI check also found Tier directly below Rating.

## Production handoff

- Mike approved the WI-002 result with the disclosed audit limits and authorized the local merge and production release on 2026-09-28. The branch was merged into local `main` at `3a010eb`; this repository has no remote.
- Read-only preflight on 2026-09-28: `tkv2-prod` has Account Layout and the four named Account-reading profiles. Account Tier is absent, with no Tier field-permission grants. A fresh production layout retrieve differs from the approved WI-002 source only by the Tier item directly after Rating. The WI-002 manifest names only `Account-Account Layout`; no unrelated layout edit is in that file.
- Status: Mike reported saving the four-profile field access in production Setup and a successful layout-only deployment on 2026-09-28. The result reported one component deployed and zero component errors. Mike observed Tier directly below Rating in production and confirmed the access matches: Sales Manager and System Administrator can edit; Sales User and Read Only can read only. Agents did not validate against or deploy to production.
- The WI-002 result was described as the same successful one-component result as WI-001. Its distinct production job ID was not supplied; `0AfFAKE000DEPLOY3` is the ID reported for WI-001. The observed layout and access are the production outcome evidence.

After the WI-001 production field deployment succeeds, Mike completes the production step in [manual-steps.md](manual-steps.md). From the repository root on commit `3a010eb` or a later commit containing the same layout file and manifest, Mike then runs:

```sh
sf project deploy start -x delivery/deployment/WI-002-tier-access-and-layout/package.xml -o tkv2-prod --json
```

Mike reported `Succeeded`, one component deployed, and zero component errors on 2026-09-28. He confirmed Tier directly below Rating and the four-profile access in production. The production flags and work item were updated during closeout.
