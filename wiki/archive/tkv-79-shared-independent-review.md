# Independent review of TKV-79 shared skills and Salesforce

The changes from `3c8113e2` through `817df7b2` preserve the protected filing, deployment, recovery, and prompt procedures checked here. The review found a stale moved-heading pointer and whitespace-check failures. Both are fixed and were read again. No unresolved correctness finding remains in this scope.

The reviewer did not write the shared or Salesforce changes. This was source comparison and representative procedure tracing, not a live Salesforce deployment, GitHub merge, or autonomous-host evaluation. The parent integrates the new shared work-item references and performs host checks.

## Findings and verified fixes

| Finding | Why it mattered | Fix and recheck |
| --- | --- | --- |
| The extracted manifests.md still said Org flags below. | The Org flags heading moved to component-tracker-format.md. A reader following the manifest reference alone could not find the required flag policy. | Commit 817df7b2 links component-tracker-format.md and names Org flags. The target file contains the independent flags, failed-deploy protection, and destructive lifecycle. |
| The baseline diff had extra blank lines at EOF in seven newly extracted references. | The execution record claimed git diff --check passed, but checking the whole baseline diff failed. | Commit 817df7b2 removes the extra lines. git diff --check 3c8113e2..817df7b2 passed. |

## Protected procedure traces

| Situation | Before and after behavior |
| --- | --- |
| A narrow production deploy includes a field file with an unrelated change. | sf-deploy-check still reviews the entire component source, checks deployed revision history, treats the tracker as a hint, verifies the target read-only, and stops the deploy or command handoff for confirmed unwanted scope. Narrow manifests still require per-file diff. |
| A tracker incorrectly says a component is absent from production. | The target-org read remains required before reporting that it would ship. A stale tracker alone still cannot block the deploy. |
| A successful production deploy occurs without a sandbox deploy. A later deploy fails. | Independent org flags remain valid, including Sandbox=No and Production=Yes. Success updates only the affected org; failed deploys leave flags unchanged. The extracted format retains the row key and destructive removal lifecycle. |
| A metadata change requires a user assignment, migration, scheduling, or rollback snapshot. | The extracted manual-steps reference retains all nine distinct examples, inline scripts, owner/status fields, pre/post ordering, and same-response updates. These edge cases were not reduced to a fixed example limit. |
| A production upsert succeeds only for some rows. | sf-data-change still requires matching keys, prior-record backup, verified success IDs, created-versus-updated distinction, partial-load recovery, null-value settings, and explicit undo limitations. Permission defaults still route through the owner-controlled permission file. |
| A source arrives as a transcript or as an email with attachments. | Sources remain unchanged, outside work-item folders, with stable SRC IDs and an index row. Existing source-size/type/privacy approval boundaries remain in sources/AGENTS.md. The record ID still reserves only after verified default-branch saving. |
| The default branch has a newer record than the session checkout. | The extracted publish-docs carry procedure compares baseline versions before copying, applies the change to newer content when needed, removes only this session's own copy at the correct remote/no-remote point, and retains ff-only/overlap protection for the main checkout. |
| GitHub queues a merge instead of completing it. | No cleanup occurs until GitHub reports MERGED. The extracted reference preserves exact PR/head matching, queue behavior, fork protection, and credit-handling failure cases. |
| A loose dictated request sounds like direct commands, or the owner corrects the playback. | braindump still waits for confirmed playback before reading unrelated files or executing work, repeats only the corrected part, and treats confirmation as scope. shaping-a-prompt still includes goal/context clarification, deliverable choice, prompt approval, and a separate execution instruction. |
| A handoff contains a claim with no evidence, an inaccessible tracker record, or a failed save. | The isolated verifier still receives the exact brief and fresh record evidence. Unsupported/inaccessible claims keep Unchecked/Skipped status, and the prompt is still delivered with unsaved content and the check limitation. |

## Official guidance and integration

The review used the current Claude Code and Codex skill, memory, and agent-guide pages and the repository's harness-writing checklist and document clarity rule. Salesforce's [Flow test command reference](https://developer.salesforce.com/docs/platform/salesforce-cli-reference/guide/cli_reference_flow_run_test.html), read on 2026-10-13, supports the added sf logic run test command for combined Apex and Flow testing. The explicit target-org requirement remains stricter than the CLI's default-org fallback by owner policy.

The shared branch intentionally relies on the parent's managing-work-items starting-a-helper.md and reporting-a-save.md. The parent must also update handoff's Levels pointer to the extracted work hierarchy reference. These are integration dependencies already assigned to the parent, not evidence that isolated skill folders supply those files themselves.

The memory worker also changed shared Notion CLI files. The parent should resolve that overlap using the final memory procedure and the shared branch's retained page/schema safeguards, without duplicating routes or restoring arbitrary polling limits.
