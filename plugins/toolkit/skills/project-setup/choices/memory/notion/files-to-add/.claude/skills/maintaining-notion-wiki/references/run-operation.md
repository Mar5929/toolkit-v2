# Librarian runs and recovery

Daily processing and on-demand operations use the same librarian procedure. Read the project's scheduler, access, invocation and coordination settings in Project context and connections, or `PROJECT.md` when working locally. Scheduling setup selects and verifies a supported mechanism with the owner; this skill does not activate one merely because the cadence is documented.

## Coordinate writers

Use one librarian writer per project operation. Before an on-demand pass, check the configured scheduler or run record for an active operation; join, wait for or coordinate that operation through the supported host. Processing status alone is not an atomic lock. When writer exclusivity cannot be established, leave captures pending rather than issuing competing destination writes.

Coding agents may continue contributing captures. Re-read each selected row before processing, record the input's Last updated and sources in Processing notes, and set Processing status to Processing. Before completing, read the capture again. When its input changed, reconcile the new evidence or leave a documented follow-up; do not mark unprocessed contributions Filed.

## Record outcomes

| Processing status | When to use it |
| --- | --- |
| New | A capture awaits its first pass. |
| Processing | The current writer is reconciling it. |
| Needs review | Useful content remains unresolved or processing needs recovery. The librarian owns follow-up. |
| Filed | Every required destination write has been read back and verified. |
| Dismissed | The capture is duplicate, unusable or does not belong in the wiki; retain its reason and any existing authoritative link. |

Maintain Processing notes, Filed links and Processed at using the verified outcome. For partial success, retain completed links and describe missing work, errors and the next recovery step. Resume by checking existing destinations before repeating a create or write. An abandoned Processing row requires checking its run and completed links, not assuming nothing happened.

Resolve uncertainty from sources and prior decisions where possible. Useful unresolved content remains Needs review; dismissal does not erase it. Ask the owner only when a consequential unresolved decision affects active work or an access/failure issue needs the owner's action. Routine processing sends no report and creates no manual owner review duty.

On-demand filing is required when an explicit correction or forgetting request must complete, or later work needs reconciled documentation. Otherwise verified capture is enough for work-item closure; record publication as pending until filing is verified.
