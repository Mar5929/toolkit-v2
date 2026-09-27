---
id: WI-001
title: Add a Tier picklist field to Account
type: build
stage: 06-implementation-plan
status: In Progress
parent: none
waiting_on: "owner"
priority: medium
delivery: not-offered
requirements_approved: "2026-09-27 by Mike"
design: approved
result_approved: "no"
updated: 2026-09-27
---

# WI-001: Add a Tier picklist field to Account

## Overview

**Goal:** Let the sales team rank Accounts using a Tier field.

**Current position:** Requirements and Option A design approved by Mike on 2026-09-27. Read-only sandbox inventory confirmed Account.Tier__c is absent. WI-002 owns access and page layout. No Salesforce metadata has been changed.

**Next action:** Await the owner decision on agent-led delivery. Then create the WI-001 worktree and build the field under R-01 and approved Option A.

**Blockers:** The delivery offer awaits Mike. This Codex session cannot approve Git writes needed to create the item worktree; Mike can run the command or use an interactive session that can approve it.

**Related items:** WI-002 covers access and page layout for R-01.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Account Tier field | Optional Tier picklist metadata exists with the approved values, description, and help text | In Progress | Field metadata is reviewed and validated against the sandbox | None. |
| P2 — Account Tier access and placement | Approved users have the right field access and Tier appears below Rating | Not Started | Effective access and actual assigned Account views pass R-01 checks | WI-002 |

## Tasks

### P1 — Account Tier field

- [x] **P1-T01 — Inspect sandbox Tier field** · Done  
  **Work:** Read Account.Tier__c status in the sandbox and compare existing metadata with WI-001 R-01 and approved Option A.  
  **Deliverable:** Field inventory and implementation choice.  
  **Done when:** The field is confirmed absent or its existing settings are recorded without changing the org.  
  **Depends on:** None.  
  **Evidence:** On 2026-09-27, `sf sobject describe -s Account -o tkv2-sbx --json` listed Rating and no Tier__c; a read-only Tooling API CustomField query for Account Tier returned zero records. Create a new field when build starts.
- [ ] **P1-T02 — Build and verify Tier metadata** · Not Started  
  **Work:** Add or adjust Account.Tier__c with Gold, Silver, Bronze in order, optional with no default, plus the approved description and help text (R-01; Option A build order step 2).  
  **Deliverable:** Field metadata and narrow WI-001 manifest.  
  **Done when:** Metadata review and sandbox validation confirm the field settings without a duplicate field.  
  **Depends on:** P1-T01.

### P2 — Account Tier access and placement

WI-002 delivers this phase after P1. It follows WI-001 R-01 and approved Option A.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-27 | Read-only sandbox inventory confirmed Account.Tier__c is absent; P1-T01 is done and P1-T02 will create the field. Agent-led delivery offer is pending. | Waiting for Mike to answer Q-06 before starting the field build. |
| 2026-09-27 | Moved by hand: .work-items/WI-001-add-a-tier-picklist-field-to-account/WORK-ITEM.md -> .work-items/account-tier/WI-001-add-a-tier-picklist-field-to-account/WORK-ITEM.md. | Its parent stays none (top level). Group: account-tier. Now waiting on the owner. |
| 2026-09-27 | Set stage 05 Breakdown -> 06 Implementation plan (status In Progress). | Continue with work-on. Now waiting on the agent. |
| 2026-09-27 | Sub-item WI-002 created: Configure Account Tier access and page layout. | WI-002 delivers R-01. Those requirements stay here, unchanged and approved. |
| 2026-09-27 | Set stage 04 Solution design -> 05 Breakdown (status In Progress). | Continue with work-organize. |
| 2026-09-27 | Owner's words: Go with option A, approved. Then split it: make the access and page layout part its own sub-item under WI-001, so the field itself can go first. | Option A approved; field-first split requested. |
| 2026-09-27 | Design approved by Mike. | The design can be built. No longer waiting on the owner. |
| 2026-09-27 | Design proposed: Option A uses profile field permissions and is recommended; Option B uses a dedicated edit permission set but needs a verified assignment mechanism to keep access aligned with Sales Manager profile changes. Independent review found no material finding for A. Mike's design choice is pending. | Continue with solution-design. Now waiting on the owner. |
| 2026-09-27 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-27 | Design created (proposed). | The owner approves it before building starts. |
| 2026-09-27 | Owner's words: Built-in features, but show me two options so I can compare. And the review team you listed is fine. | Continue with work-decide. Now waiting on the agent. |
| 2026-09-27 | Set stage 03 Requirements approved -> 04 Solution design (status In Progress). | Continue with solution-design. Now waiting on the owner. |
| 2026-09-27 | Requirements approved by Mike. | Stage 03 Requirements approved (status Ready). No longer waiting on the owner. Continue with solution-design. Now waiting on the agent. |
| 2026-09-27 | Owner's words: Approved. | Requirements approval to record. |
| 2026-09-27 | Requirements spec check found no material gaps or unanswered questions. Field description and help text wording can be drafted during design and reviewed with the result. | Requirements are ready for Mike's approval; build remains gated. |
| 2026-09-27 | Owner's words: Yes, it can be blank, with no default value. For who sees it: everyone who can see an Account can read Tier, but only the Sales Manager profile and system administrators can edit it. Put it on the Account Layout page layout, right below Rating. | Q-02 and Q-03 answered; R-01 and acceptance updated. Requirements await owner approval. |
| 2026-09-27 | Owner's words: Use Gold, Silver, Bronze, in that order, with Gold the highest. Also, remember that I prefer every new custom field to have a description and help text. | Q-01 answered; R-01 updated. Q-02 and Q-03 remain open. |
| 2026-09-27 | Set stage 01 Discovery -> 02 Refinement (status Backlog). | Continue with work-requirements. Now waiting on the owner. |
| 2026-09-27 | Created. | Starts at 01 Discovery. Continue with work-requirements. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | What Tier values should be available, in what order? Answer: Gold, Silver, Bronze, in that order; Gold is highest. Mike, 2026-09-27. | R-01 | Answered | owner |
| Q-02 | May Tier be blank, including on existing Accounts? Answer: Yes, Tier can be blank, including on existing Accounts, and has no default value. Mike, 2026-09-27. | R-01 | Answered | owner |
| Q-03 | Which sales users should see and edit Tier, and where should it appear? Answer: Everyone who can see an Account can read Tier; only the Sales Manager profile and system administrators can edit it. Place Tier on the Account Layout page layout directly below Rating. Mike, 2026-09-27. | R-01 | Answered | owner |
| Q-04 | For the solution design, use Salesforce built-in features and one option, or show multiple options? Answer: Use built-in features and show two options to compare. Mike, 2026-09-27. | Design approach | Answered | owner |
| Q-05 | May the design use one requirements analyst, one researcher, one design architect, and one critic? Answer: The listed review team is fine. Mike, 2026-09-27. | Design review team | Answered | owner |
| Q-06 | Would you like agents to take responsibility for delivering this, with you acting as product owner? | WI-001 delivery | Open | owner |

## Requirements

<!-- Starting request records what was asked; Agreed goal records the outcome the owner accepted. Under Active requirements, create one R-ID subsection per explicit behavior. Fill every labeled field under each R-ID. Keep an item Refining until its required behavior and acceptance check are clear and owner approval is recorded; mark Superseded only with a replacement link. Put solution ideas in the final Notes subsection, not here. -->

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

New work: add a Tier picklist field to Account so the sales team can rank their accounts.

### Agreed goal

Let the sales team rank Accounts with an optional Tier field that the right people can view and edit.

### Active requirements

#### R-01 — Account ranking

**Status:** Finalized  
**Applies to:** Anyone who can view an Account; Sales Manager profile users and system administrators when editing.  
**Required behavior:** Account has a Tier picklist with Gold, Silver, and Bronze in that order, with Gold highest. Tier is optional and has no default value. Anyone who can view an Account can read Tier. Only users with the Sales Manager profile and system administrators can edit Tier. Tier appears on the Account Layout page layout directly below Rating. The custom field has a description and help text.  
**Boundaries and exceptions:** Existing Accounts may have a blank Tier. Users outside the two editing groups can view Tier but cannot change it.  
**Acceptance check:** On Account Layout, Tier appears directly below Rating. A Sales Manager profile user and a system administrator can save Gold, Silver, Bronze, or a blank Tier on an Account. Another user who can view that Account can read Tier but cannot edit it. The choices appear in the agreed order. A new Account has no Tier selected by default. An existing Account with no Tier remains blank. The field metadata contains a description and help text.  
**Decision record:** Mike requested the field on 2026-09-27 and specified the values and order on 2026-09-27. Mike stated the custom field documentation preference on 2026-09-27. On 2026-09-27, Mike decided Tier is optional with no default, set its read and edit access, and chose its position on Account Layout. Mike approved R-01 on 2026-09-27 (his words: ‘Approved.’).  
**Open questions:** None.

### Acceptance

This work item can be accepted when:

1. Account has an optional Tier picklist with Gold, Silver, and Bronze in that order and no default; existing blank values remain blank.
2. Everyone who can view an Account can read Tier; only Sales Manager profile users and system administrators can edit it.
3. Tier appears directly below Rating on Account Layout, and the field has a description and help text.
4. The checks in R-01 are completed and Mike reviews the finished result.

## Notes

### Decisions and context

- Mike chose Gold, Silver, Bronze in that order, with Gold highest, on 2026-09-27.
- Mike chose optional Tier with no default, read access for all Account viewers, edit access for Sales Manager profile users and system administrators, and placement directly below Rating on Account Layout on 2026-09-27.
- Requirements spec check on 2026-09-27 found no material gap. Draft field description and help text can be reviewed with the finished result.
- Mike chose Salesforce built-in features and two design options to compare on 2026-09-27.
- Mike approved one requirements analyst, one researcher, one design architect, and one critic for design review on 2026-09-27.
- Mike approved Option A on 2026-09-27 and asked for field-first work. WI-002 owns access and page layout after the field exists.

### Resume here

Read-only sandbox inventory on 2026-09-27 confirmed Account.Tier__c is absent: Account describe listed no Tier__c and the Tooling API CustomField query returned zero records. P1-T01 is done. Q-06 asks whether Mike wants agent-led delivery. Await that answer before P1-T02. This session cannot create a Git worktree because Git writes require approval that this session cannot request. In an interactive session, approve `git worktree add .claude/worktrees/wi-001-account-tier -b claude/wi-001-account-tier`, or run it in a terminal, then continue the field build. No Salesforce metadata has been changed.

### Solution options and considerations

These are possibilities to evaluate, **not approved requirements or design decisions**.

- Check existing Account Layout and Rating placement, plus the org profile and field access model, during WI-002.
- Use the approved description and help text from Option A when building the field.
