---
id: WI-003
title: Account Tier access setup
type: task
stage: 09-testing
status: Done
parent: WI-001
waiting_on: "none"
priority: medium
delivery: agent-led
requirements_approved: "no"
design: none
result_approved: "2026-09-26 by Mike"
updated: 2026-09-26
---

# WI-003: Account Tier access setup

<!-- Fill-in guide for a new local work item: create it with `toolkit work new`, which copies this folder, names the new folder, and sets the real ID in front matter and heading; keep the file name WORK-ITEM.md. Use stable phase, task, requirement, and question IDs for this item. In the front matter, keep one value from each list and change the fields with `toolkit work` commands; a blocked item has `waiting_on` set and its Blockers line filled, not a Blocked status. Replace every angle-bracket prompt with actual text in that same field, cell, or paragraph; do not leave the prompt in place. Keep the headings and field labels. Add or remove phase, task, question, and requirement examples to match the real work. Use the chosen tracker as the source of truth for status and links. Delete this guide after filling the item. -->

## Overview

**Goal:** Set up Account Tier access under Option A so every Account viewer can see it and only Sales Manager profile users and administrators can edit it.

**Current position:** Mike reported completing the four-profile access setup and Account Layout placement in production on 2026-09-26. He checked Sales Rep read-only and Sales Manager edit access there. Earlier sandbox checks covered the four profiles and field behavior.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** Parent WI-001; sibling WI-002. Covers WI-001 R-01 access and page visibility.

## Roadmap

| Phase | Outcome | Status | Exit result | Sub-items |
| --- | --- | --- | --- | --- |
| P1 — Inventory | Actual Account viewers, grants, administrators, and pages are known | Verified | Mike confirmed four-profile coverage, no other Account access path, no Tier permission-set grants, and Lightning page usage | None |
| P2 — Setup and checks | Profile field permissions and pages match WI-001 R-01 | Verified | Mike reported the named persona and page checks | None |

## Tasks

### P1 — Inventory

- [x] **P1-T01 — Verify Account access** · Verified from Mike's inventory and coverage confirmation  
  **Work:** Inventory active Account viewers, profiles, permission grants, administrators, and Account pages in the sandbox.  
  **Deliverable:** Exact access and page list for Setup.  
  **Done when:** Every active Account viewer access path and applicable page is accounted for.  
  **Depends on:** None.

### P2 — Setup and checks

- [x] **P2-T01 — Record access steps** · Written  
  **Work:** Replace broad draft manual steps with exact Option A profile field permission and page steps.  
  **Deliverable:** Access setup instructions for the sandbox and Mike's production handoff.  
  **Done when:** Steps grant Tier edit only to Sales Manager profile users and verified admins.  
  **Depends on:** P1-T01.
- [x] **P2-T02 — Verify access** · Verified from Mike's sandbox persona and page checks  
  **Work:** After authorized sandbox deployment and setup, check effective access and representative users.  
  **Deliverable:** Sandbox evidence for WI-001 R-01.  
  **Done when:** Every Account viewer can see Tier and only allowed users can edit it.  
  **Depends on:** WI-002 field availability and P2-T01.

## Recent History

<!-- Add one row for each material decision or progress change, newest first. Put the date in column 1, what happened in column 2, and its effect or next action in column 3. Remove the placeholder row when the first real entry is added. -->

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-26 | Mike identified Standard User and Sales Rep as Tier read-only, Sales Manager and System Administrator as Tier editors, no permission-set Account access, and `Account Layout` as the only Account layout. Updated the isolated checkout's manual steps to place Tier in Account Information. | Exact profile and layout steps are written; active users, Tier grants, Lightning assignments, sandbox setup, and persona checks remain. |
| 2026-09-26 | Replaced the broad draft access instruction with Option A inventory, profile grant, page placement, and verification steps in isolated checkout. Sandbox CLI inventory calls returned success without records. | Exact profiles and pages, sandbox setup, and persona checks remain pending. |
| 2026-09-26 | Created. | Starts at 01 Discovery. Continue with work-requirements. |
| 2026-09-26 | Created at Mike's request as the Option A access setup sub-item of WI-001; covers parent R-01 field access and page visibility. |  |
| 2026-09-26 | Set stage 01 Discovery -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-26 | Corrected broad draft access steps in isolated checkout; CLI inventory queries returned success without records, so exact grants and pages remain unknown. |  |
| 2026-09-26 | Recorded Mike’s profile, permission-set, and Account Layout inventory and wrote exact Option A Setup steps. Active-user, Tier-grant, and Lightning assignment checks remain. |  |
| 2026-09-26 | Set delivery agent-led. |  |
| 2026-09-26 | WI-003 is part of the WI-001 Account Tier goal for which Mike already accepted agent-led delivery with one team in this chat on 2026-09-26. |  |
| 2026-09-26 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-26 | Mike reported Standard User Tier read-only, no permission-set Tier grants, and Lightning page usage of Account Layout; independent check confirms source but active-user coverage remains unrecorded. |  |
| 2026-09-26 | Owner's words: Yes. Those four profiles cover every active Account viewer, and there is no other Account access path. |  |
| 2026-09-26 | Checked: four-profile Account-viewer coverage and no other Account access path; evidence: Mike's 2026-09-26 confirmation, prior sandbox persona and page reports, WI-001 test plan; gap: no exported org inventory or screenshots. |  |
| 2026-09-26 | Mike reported production setup for the same four profiles and Account Layout > Account Information; Sales Rep read-only and Sales Manager edit checks passed on 2026-09-26. He asked to finish WI-003 with the parent. |  |
| 2026-09-26 | Result approved by Mike. | The result can be shipped and finished (work-finish). |
| 2026-09-26 | Finished. Result approved earlier (2026-09-26 by Mike); marked Done by Mike. | Evidence: Mike reported four-profile production setup and Account Layout placement; Sales Rep read-only and Sales Manager edit checks passed on 2026-09-26. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
| --- | --- | --- | --- | --- |
| Q-01 | Which active users can view Accounts, by which grants, and which users are administrators? Which Account pages apply? | Exact Setup steps and checks | Answered by Mike, 2026-09-26: four named profiles cover every active Account viewer; no other Account access path; no permission-set Account or Tier grants; Lightning page uses `Account Layout` | agent |

## Requirements

**Overall status:** Refining  
**Finalization rule:** Mike approves the parent result before WI-001 is Done.

### Starting request

Access setup under Option A: inventory Account viewers and administrators; set profile field permissions and page placement so all Account viewers see Tier and only Sales Manager profile users and admins edit it. Covers WI-001 R-01 access.

### Agreed goal

Apply the access part of Mike's approved Account Tier change under WI-001 using Option A.

### Active requirements

#### R-01 — Field access (WI-001 R-01)

**Status:** Refining  
**Applies to:** Active users with Account access.  
**Required behavior:** Every Account viewer can see Tier. Only Sales Manager profile users and administrators can edit it, subject to existing Account edit access.  
**Boundaries and exceptions:** No change to Account object or record sharing. Do not deploy profile metadata.  
**Acceptance check:** Inventory effective grants; verify each applicable Account page and representative viewer, Sales Manager, and admin users in the sandbox.  
**Decision record:** WI-001 R-01 and Option A; Mike approved requirements and chose Option A on 2026-09-26.  
**Open questions:** None. Mike confirmed the four named profiles cover every active Account viewer and there is no other Account access path on 2026-09-26.

### Acceptance

The Setup steps name exact profiles and pages from the sandbox inventory. Effective access and representative user checks show Tier visible to all Account viewers and editable only by Sales Manager profile users and administrators with Account edit access. Mike reviews the combined WI-001 result.

## Notes

### Decisions and context

- Mike chose Option A for parent WI-001 on 2026-09-26. This sub-item owns profile field permission and page setup; WI-002 owns field source and deployment inventory.
- Mike accepted agent-led delivery for the WI-001 Account Tier goal on 2026-09-26, with one team of helpers inside this chat. WI-003 is the access sub-item of that same goal; the choice covers this work. It does not authorize deployment, merge, spending, or publication.
- Profile metadata is not deployed. Mike supplied the sandbox profile and Account layout scope on 2026-09-26. Mike later confirmed that all active Account viewers use the four named profiles and no other Account access path exists. His persona and page checks are reported in WI-001; no exported org inventory is attached.

### Resume here

Use the exact names and owner-reported results in `.claude/worktrees/wi-001-tier/delivery/deployment/WI-001-account-tier/manual-steps.md`. Coverage was confirmed by Mike on 2026-09-26. Pass WI-003 access verification to parent WI-001 for result review.

### Solution options and considerations

- Use the approved WI-001 Option A design; no separate design choice is pending.
