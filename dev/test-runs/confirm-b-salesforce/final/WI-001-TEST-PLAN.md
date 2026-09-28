# WI-001: Account Tier field test plan

## Scope

Check WI-001 R-01 and R-02 for `Account.Tier__c`. WI-002 checks access and Account Layout placement under R-03 and R-04.

## Environment and data

Sandbox: `tkv2-sbx`, API 62.0. Validation is a check-only deployment. UI and record checks require the field to be deployed to the sandbox and a suitable Account test record.

## Checks

| Scenario | Expected result | Method or test | Evidence |
| --- | --- | --- | --- |
| Field definition | Account has one nullable, restricted `Tier__c` picklist with Gold, Silver, Bronze in that order and no default | Inspect field XML and sandbox Account describe | Passed in source and sandbox describe after deployment job `0AfFAKE000DEPLOY3` |
| Field guidance | Description and help text match Mike's approved words | Compare field XML with WI-001's approved design and sandbox Setup | Passed. Mike checked `tkv2-sbx` Setup on 2026-09-28 and reported Description `Manually assigned account importance tier.` and Help Text `Set by hand. Gold is the highest tier, then Silver, then Bronze.` The earlier describe response differed; Setup is the direct field check. |
| Manual values and clearing | An authorized user can save each value and clear it; new Accounts begin blank | Exercise a test Account in the sandbox as an authorized user | Passed by Mike's reported UI check on 2026-09-28. Tier Test began blank with no default; Gold, Silver, Bronze, and blank all saved. Mike deleted the test Account afterwards. |
| Unsupported value | API rejects a value outside Gold, Silver, Bronze | Submit an unsupported value to the sandbox test Account | Not run; needs the test Account and separate approval for a sandbox data write. |
| Help text in UI | Account page shows the approved help text | Open the assigned page in the sandbox after WI-002 layout deployment | Passed by Mike's reported UI check on 2026-09-28: `Set by hand. Gold is the highest tier, then Silver, then Bronze.` |
| Automation | No project automation sets or changes Tier | Review source dependency graph, then inspect org automation if the sandbox exposes it | Source graph has zero Tier connections. A read-only `MetadataComponentDependency` query in `tkv2-sbx` for `RefMetadataComponentName = 'Tier__c'` returned zero records on 2026-09-28. This did not inspect every automation definition directly. |

## Results and follow-up

- Date and tester: 2026-09-28, Codex.
- Outcome: Source definition, check-only validation, and sandbox field shape passed. Mike reported successful deployment job `0AfFAKE000DEPLOY3`; the read-only deployment report confirmed success. Mike's reported Tier Test checks passed for blank default, manual saving and clearing, and help text on the Account page. The description and help text were also confirmed in Setup by Mike.
- Remaining issues: Unsupported-value API rejection has not run. The dependency query found no sandbox references to Tier, but every automation definition was not inspected directly. The UI results are Mike's observations; Codex did not independently reproduce them.
