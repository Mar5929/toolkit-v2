---
id: WI-002
title: Account Tier field metadata
type: task
stage: 09-testing
status: Done
parent: WI-001
waiting_on: "none"
priority: medium
delivery: not-offered
requirements_approved: "no"
design: none
result_approved: "2026-09-26 by Mike"
updated: 2026-09-26
---

# WI-002: Account Tier field metadata

<!-- Fill-in guide for a new local work item: create it with `toolkit work new`, which copies this folder, names the new folder, and sets the real ID in front matter and heading; keep the file name WORK-ITEM.md. Use stable phase, task, requirement, and question IDs for this item. In the front matter, keep one value from each list and change the fields with `toolkit work` commands; a blocked item has `waiting_on` set and its Blockers line filled, not a Blocked status. Replace every angle-bracket prompt with actual text in that same field, cell, or paragraph; do not leave the prompt in place. Keep the headings and field labels. Add or remove phase, task, question, and requirement examples to match the real work. Use the chosen tracker as the source of truth for status and links. Delete this guide after filling the item. -->

## Overview

**Goal:** Deliver the Account Tier field XML with description and help text, and keep the component tracker and deployment manifests accurate.

**Current position:** The field source and deployment inventory are committed on local main at `e43580c`. Mike reported successful sandbox and production field deployments on 2026-09-26.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** Parent WI-001; sibling WI-003. Covers WI-001 R-01 field values and optional behavior, and R-02 field guidance.

## Roadmap

| Phase | Outcome | Status | Exit result | Sub-items |
| --- | --- | --- | --- | --- |
| P1 — Field source | XML and deployment inventory meet WI-001 R-01 and R-02 | Built | Local XML and inventory checks pass; CLI reports check-only validation success | None |

## Tasks

### P1 — Field source

- [x] **P1-T01 — Verify source and API version** · Built  
  **Work:** Compare draft field and deployment files with WI-001 R-01 and R-02; determine the supported sandbox API version.  
  **Deliverable:** Verified source changes and API version.  
  **Done when:** Values, optional status, missing guidance, and version are recorded from evidence.  
  **Depends on:** None.
- [x] **P1-T02 — Correct field and inventory** · Built  
  **Work:** Update XML description and help text and keep component tracker and package manifests in sync.  
  **Deliverable:** Correct field XML and deployment inventory.  
  **Done when:** XML parses and tracker and manifests name Account.Tier__c once.  
  **Depends on:** P1-T01.

## Recent History

<!-- Add one row for each material decision or progress change, newest first. Put the date in column 1, what happened in column 2, and its effect or next action in column 3. Remove the placeholder row when the first real entry is added. -->

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-26 | Mike supplied API version 62.0. Added description, help text, and optional status; aligned the project version, tracker, and manifests in isolated checkout. XML, CSV, version, and manifest assertions passed; CLI check-only validation reported success. | Field source was built before the later sandbox deployment. |
| 2026-09-26 | Created. | Starts at 01 Discovery. Continue with work-requirements. |
| 2026-09-26 | Created at Mike's request as the field metadata sub-item of WI-001; covers parent R-01 field definition and R-02 guidance. |  |
| 2026-09-26 | Set stage 01 Discovery -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-26 | Field XML, API 62.0, tracker, and manifests committed as 46163ac in isolated checkout; no sandbox deploy occurred. |  |
| 2026-09-26 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-26 | Mike reported the WI-001 field-only production deployment succeeded on 2026-09-26 and asked to finish WI-002 with the parent. |  |
| 2026-09-26 | Result approved by Mike. | The result can be shipped and finished (work-finish). |
| 2026-09-26 | Finished. Result approved earlier (2026-09-26 by Mike); marked Done by Mike. | Evidence: Field source on local main at e43580c; Mike reported successful sandbox and production deployments of Account.Tier__c on 2026-09-26. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
| --- | --- | --- | --- | --- |
| Q-01 | What API version does the sandbox support? | Manifest version and validation | Answered by Mike, 2026-09-26: 62.0 | owner |

## Requirements

**Overall status:** Refining  
**Finalization rule:** Mike approves the parent result before WI-001 is Done.

### Starting request

Field metadata: XML with description and help text, plus the component tracker. Covers WI-001 R-01 values and optional behavior and R-02 field guidance.

### Agreed goal

Supply the source part of Mike's approved Account Tier change under WI-001.

### Active requirements

#### R-01 — Field definition (WI-001 R-01)

**Status:** Refining  
**Applies to:** Account.Tier__c.  
**Required behavior:** Optional restricted picklist with Gold, Silver, and Bronze values and no default.  
**Boundaries and exceptions:** Field access and page placement belong to WI-003.  
**Acceptance check:** XML parses and defines exactly those values, optional status, and no default.  
**Decision record:** WI-001 R-01; Mike approved it on 2026-09-26.  
**Open questions:** None.

#### R-02 — Field guidance (WI-001 R-02)

**Status:** Refining  
**Applies to:** Account.Tier__c.  
**Required behavior:** Description and help text explain Tier's purpose and access.  
**Boundaries and exceptions:** Wording must stay consistent with approved field behavior.  
**Acceptance check:** Field XML includes description and inline help text matching WI-001 R-02.  
**Decision record:** WI-001 R-02; Mike approved it on 2026-09-26.  
**Open questions:** None.

### Acceptance

Field XML meets WI-001 R-01 and R-02. The component tracker and deployment manifests identify Account.Tier__c once. Local checks pass; sandbox validation follows when the real API version and org response are available.

## Notes

### Decisions and context

- Mike chose Option A for parent WI-001 on 2026-09-26. This sub-item owns field XML, component tracker, and deployment manifests. WI-003 owns access setup.
- Earlier draft source remains in the main checkout. Built source is in `.claude/worktrees/wi-001-tier` on `claude/wi-001-tier`; Mike supplied API version 62.0.

### Resume here

WI-002 field source is built in the isolated checkout. Local checks passed, sandbox CLI reported check-only validation success, and Mike reported a successful sandbox deployment and behavior checks. Continue parent WI-001 through WI-003 access coverage and result approval.

### Solution options and considerations

- Use the approved WI-001 Option A design; no separate design choice is pending.
