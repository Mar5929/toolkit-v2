# Independent retry policy review

The two retry-policy changes implement the owner-approved Q14 policy. No actionable blocker was found. The review checked the GitHub work-tracker command reference and Notion CLI command reference through their parent skills. The already-reviewed Q13 memory changes are separate.

The patch replaces the corrected-request retry count and fixed conflict wait with service-supported retry guidance, backoff, and recovery while progress remains possible. Both references require inspection of an uncertain write before retrying and resumption of only unconfirmed work. Authentication, access and host permission rules remain intact. No additional write authority, field change, command format change, arbitrary attempt count or reasoning prescription was added.

## Current official sources

The reviewer opened these sources on 2026-10-11:

- [Notion status codes](https://developers.notion.com/reference/status-codes): a 409 can reflect a collision or storage failure; current parameters matter. A 503 write can be saved despite the failed response, and supplied retry guidance must be checked.
- [GitHub REST API best practices](https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api): observe rate-limit headers and backoff, avoid repeated unchanged errors, and investigate authentication and access failures. The new general service-guidance instruction preserves these requirements without inventing a toolkit retry allowance.

## Paper recovery replay

| Case | Result from the changed procedure |
| --- | --- |
| Uncertain creation already exists | A simulated issue/page creation returns a timeout, while a scoped lookup finds the intended record. Read that record to verify the requested state and continue from its ID; do not create a duplicate. Notion retry guidance is inspected when supplied. |
| Corrected 400 or 422 makes progress | Read the current schema/target, correct the invalid property or numeric ID from the error, and retry the corrected request within the authorized operation. If a later independent validation error identifies another useful correction, recovery may continue rather than stopping solely because one attempt occurred. |
| Changing 409 target | Re-read the target after a concurrent change and rebuild the requested update from current state, preserving unrelated data. A supported delayed retry can address a temporary storage failure. Neither condition is treated as necessarily two simultaneous writes or assigned an invented five-second remedy. |
| Repeated identical failure | When refreshed state/error gives no correction and service-guided retry no longer makes useful progress, report the unresolved blocker. The instruction does not authorize an indefinite tight loop. |
| Rate-limit wait | Use the service’s supplied delay/reset guidance and supported backoff before retry. Verify an uncertain mutation outcome before repeating it. The removed toolkit count does not waive service limits. |
| Authentication or access blocked | Diagnose permitted access routes and the known target first. If authentication or sharing still needs the owner, report it and wait. Do not retry unchanged credential failures, request secrets, or bypass a host denial. |

## Checks and limits

The review read request evaluation, document clarity, writing-harness-files and its Skill checklist, and eligible official skill captures: Codex build-skills and skill best practices captured 2026-09-27, plus Claude Code skills captured 2026-10-05. These captures are within the permitted 14-day window on 2026-10-11. The instructions state a general recovery process and remain concise supporting references.

All fenced command/body examples in the two references match merged HEAD exactly. `git diff --check` returned no output. The three-level work-item navigation, exact schemas, uncertainty checks and existing authorization boundaries remain unchanged. Model and handoff defaults are outside this edit.

The cases above are paper scenarios with explicitly simulated outcomes, not executed API tests. No live GitHub or Notion calls, scheduler, host changes, procedure edits or commits ran. The only write was this review record. Delivery approval remains separate.
