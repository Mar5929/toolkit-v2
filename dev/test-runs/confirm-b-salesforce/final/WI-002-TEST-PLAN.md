# WI-002: Tier access and Account Layout test plan

## Scope

Check WI-001 R-03 and R-04 in sandbox `tkv2-sbx`. The approved field-only WI-001 deployment must be present.

## Checks

| Scenario | Expected result | Method | Evidence |
| --- | --- | --- | --- |
| Effective Tier access | Account viewers can read Tier; only Sales Manager and System Administrator profile users can edit it | Audit profiles, permission sets, permission set groups, and representative users; check Account read access separately | Mike reported saving the approved Setup change on 2026-09-28. Read-only `ObjectPermissions` and `FieldPermissions` queries on 2026-09-28 returned all four Account-reading profile grants and exactly four matching Tier grants: Sales Manager and System Administrator read/edit; Sales User and Read Only read only. No Tier permission-set grant appeared in those results. Mike reported that he checked Tier Test as a user of each profile: Sales Manager and System Administrator could edit Tier; Sales User and Read Only could see but not edit it. |
| Account Layout source | Tier directly follows Rating in Account Information | Compare retrieved layout XML with the WI-002 source diff | Passed. Sandbox validation `0AfFAKE000VALID3` reported success for one component. A fresh post-deploy retrieve matches the WI-002 source byte for byte, including Tier directly after Rating. |
| Account Layout in sandbox | Tier appears directly below Rating for a user assigned Account Layout | Open an Account after approved layout deployment | Metadata passed after Mike reported a successful one-component deploy on 2026-09-28. Mike reported Tier directly below Rating on the Tier Test Account page. |
| Existing access and layout | Other fields and Account record access are unchanged | Review narrow manifest, fresh retrieved baseline, and representative access | Manifest contains only `Account-Account Layout`. Fresh retrieve differed from prepared source only by Tier after Rating. Read-only queries show Account read on the same four profiles and no additional Tier field grants. Mike could access the test Account as each profile; no detailed before-and-after record-access comparison was reported. |

## Results

- Date: 2026-09-28.
- The approved Setup change is reported saved and the four profile Tier grants match R-03 in read-only metadata queries, including a repeat query after the layout deployment. The latest queries returned only the same four Account-reading profiles, each with a matching Tier grant. Mike reported a successful layout-only deployment. A read-only deploy report returned Succeeded, and the post-deploy sandbox layout retrieve matches source exactly. The reported job ID `0AfFAKE000DEPLOY3` duplicates the earlier WI-001 field deploy ID; the retrieved layout is the direct evidence that the layout is present. Mike reported UI checks for all four profiles, Tier placement, and Account access on the disposable Tier Test record, which he deleted afterwards. A detailed before-and-after record-access comparison was not run.
