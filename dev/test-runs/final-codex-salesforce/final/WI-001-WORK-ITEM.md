---
id: WI-001
title: Add a Tier picklist field to Account
type: build
stage: 14-spec-update
status: Done
parent: none
waiting_on: "none"
priority: medium
delivery: owner-led
requirements_approved: "2026-09-28 by Mike Rihm"
design: approved
result_approved: "2026-09-28 by Mike Rihm"
updated: 2026-09-28
---

# WI-001: Add a Tier picklist field to Account

## Overview

**Goal:** Deliver the Account Tier picklist field with Gold, Silver, Bronze, no default, description, and help text; WI-002 owns access and page placement.

**Current position:** Done on 2026-09-28. Owner reported WI-001 production deploy Succeeded and production Tier checks passed: blank default, Gold, Silver, Bronze order, and Sales Manager saved Gold. WI-002 is Done. Delivered requirements and system guide committed on local main at b28c640.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** Sub-item WI-002 delivered Tier access and page placement and is Done.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Tier field | Account Tier picklist is defined with guidance | Done | R-01 and R-02 field checks pass | None. |
| P2 — Access and placement | Access and page layout are delivered separately | Done | WI-002 result is checked and approved | WI-002 |

## Tasks

### P1 — Tier field

- [x] **P1-T01 — Define Account Tier field** · Done  
  **Work:** Add optional Account.Tier__c picklist metadata with Gold, Silver, Bronze, no default, description, and help text.  
  **Deliverable:** Field metadata and narrow WI-001 package.  
  **Done when:** Metadata review confirms R-01 and R-02.  
  **Depends on:** None.
- [x] **P1-T02 — Check field behavior** · Done  
  **Work:** Validate the package in the sandbox and check the field after the owner-approved deploy. Production checks passed as reported by Mike Rihm on 2026-09-28.  
  **Deliverable:** WI-001 test evidence.  
  **Done when:** R-01 and R-02 acceptance checks pass.  
  **Depends on:** P1-T01.

### P2 — Access and placement

- [x] **P2-T01 — Complete WI-002** · Done  
  **Work:** Track WI-002 as the separate access and page layout build.  
  **Deliverable:** WI-002 result and approval.  
  **Done when:** WI-002 is completed or the owner directs otherwise.  
  **Depends on:** P1-T01.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-28 | Finished. Result approved earlier (2026-09-28 by Mike Rihm); marked Done by Mike Rihm. | Evidence: Owner reported WI-001 production deploy Succeeded and production Tier checks passed: blank default, Gold, Silver, Bronze order, and Sales Manager saved Gold. WI-002 is Done. Delivered requirements and system guide committed on local main at b28c640. |
| 2026-09-28 | Set stage 13 Deployment -> 14 Specification update (status In Review); waiting on agent. | Continue with work-finish. |
| 2026-09-28 | Owner said: Both production deploys said Succeeded (job 0AfFAKE000DEPLOY3 for each). Before the second one I checked production: the four profiles are all on Account Layout, there are no Lightning record pages, and no permission set grants Tier. After it, I set the Tier permissions in production Setup as planned, and my checks passed: Tier is below Rating for all four profiles, blank by default, Gold, Silver, Bronze in order; a Sales Manager saved Gold; a Sales User and a Read Only user can see Tier but cannot edit it. Close both items out. I approve the git commands for the closeout. | WI-001 production deploy reported Succeeded; production checks passed; closeout authorized. |
| 2026-09-28 | Owner said: Ship it: merge both branches into main and get both packages to production. I approve the git commands for the merge. | Both local merges authorized; production field deployment handed to the owner for execution. |
| 2026-09-28 | Set stage 12 Pull request and push -> 13 Deployment (status In Review); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-28 | No remote: merged locally into main at ec5ebe1. | No pull request; production deployment remains for the owner. |
| 2026-09-28 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-28 | Result approved by Mike Rihm. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-28 | Owner said: Yes, I approve the WI-001 result. | Result approved; work-finish continues. |
| 2026-09-28 | Set stage 09 Testing -> 11 User approval (status In Progress). | Continue with work-decide. |
| 2026-09-28 | Checked R-01 and R-02; evidence: read-only sandbox describe and Mike Rihm’s 2026-09-28 Setup and Account checks; gaps: no acceptance gap reported; no independent agent checker ran. | WI-001 is ready for separate result approval. |
| 2026-09-28 | Owner said: I ran the four final sandbox checks and all passed. In Setup, Tier description is Sales team’s ranking tier for an Account. Help text is Select Gold, Silver, or Bronze to rank this Account. Leave blank if no Tier has been assigned. As Sales Manager I created an Account with Tier blank, saved Gold, Silver, Bronze, and cleared it; choices show in that order. | R-01 and R-02 sandbox acceptance checks passed; result approval remains separate. |
| 2026-09-28 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-decide. |
| 2026-09-28 | Sandbox describe confirmed Tier is optional with Gold, Silver, Bronze and no default, but returned help text differs from committed source. | Confirm field guidance in Setup before accepting R-02. |
| 2026-09-28 | Owner said: "Both sandbox deploys said Succeeded (job 0AfFAKE000DEPLOY3 each)." | WI-001 sandbox deploy reported successful; field checks continue. |
| 2026-09-28 | Set waiting on owner. | Approved sandbox deploy command handed to Mike Rihm; await execution and result. |
| 2026-09-28 | Owner said: "Yes, I approve deploying WI-001, then WI-002 to tkv2-sbx, and then I’ll do the manual profile steps." | WI-001 and WI-002 sandbox deployments are approved in that order; hand the owner exact commands and profile instructions. |
| 2026-09-28 | Pre-deploy review found only intended field metadata in the WI-001 package. Read-only sandbox describe confirmed Tier__c is absent; owner approval is needed for the ordered sandbox deployments. | WI-001 and WI-002 wait for the sandbox deployment decision. |
| 2026-09-28 | Built Account.Tier__c field and deployment records in commit 147aa3e; sandbox validation succeeded with one component and no errors. | Continue with work-on. |
| 2026-09-28 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-28 | Moved by hand: .work-items/WI-001-add-a-tier-picklist-field-to-account/WORK-ITEM.md -> .work-items/account-tier/WI-001-tier-field/WORK-ITEM.md. | It is still a top-level item. Group: account-tier. |
| 2026-09-28 | Set stage 05 Breakdown -> 06 Implementation plan (status In Progress). | Continue with work-on. |
| 2026-09-28 | Sub-item WI-002 created: Set Account Tier access and page layout. | WI-002 delivers R-03, R-04. Those requirements stay here, unchanged and approved. |
| 2026-09-28 | Set stage 04 Solution design -> 05 Breakdown (status In Progress). | Continue with work-organize. |
| 2026-09-28 | Design approved by Mike Rihm. | The design can be built. No longer waiting on the owner. |
| 2026-09-28 | Design updated. | The owner approves it before building starts. |
| 2026-09-28 | Owner said: "Yes, I approve Option A. Then split it: make the access and page layout part its own sub-item under WI-001, so WI-001 is just the field itself." | Option A selected; create a child for R-03 and R-04 after design approval, while WI-001 delivers the field. |
| 2026-09-28 | Proposed two Account Tier access designs; recommend profile field access with manual org steps | Design choice and approval now wait on Mike Rihm before implementation planning. |
| 2026-09-28 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-28 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-28 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-28 | Design created (proposed). | The owner approves it before building starts. |
| 2026-09-28 | Set stage 03 Requirements approved -> 04 Solution design (status In Progress). | Continue with solution-design. |
| 2026-09-28 | Set delivery owner-led. | Small item: one field, access, and page layout; no delivery offer. |
| 2026-09-28 | Requirements approved by Mike Rihm. | Stage 03 Requirements approved (status Ready). No longer waiting on the owner. Continue with solution-design. |
| 2026-09-28 | Owner said: Approved. | Requirements approved. |
| 2026-09-28 | Independent requirements check found no functional gap in R-01 through R-04 and the acceptance checks. | Requirements are ready for owner approval; design and build remain gated. |
| 2026-09-28 | Owner said: "No, it can be blank, with no default value. Only the Sales Manager profile and system administrators can edit it; everyone else who can see Accounts can read it. Put it on the Account page layout right below Rating." | Q-02 answered; R-01 refined and R-03 and R-04 added for access and layout placement. |
| 2026-09-28 | Owner confirmed Q-01 and said: "The values are Gold, Silver, and Bronze, in that order." | Agreed goal confirmed; Tier values and order added to refining requirements. |
| 2026-09-28 | Recorded the Account Tier request and opened requirements refinement; Q-01 asks the owner to confirm the ranking goal. | Requirements and Salesforce field changes wait for the owner’s answer and approval. |
| 2026-09-28 | Set stage 01 Discovery -> 02 Refinement (status Backlog). | Continue with work-requirements. |
| 2026-09-28 | Created. | Starts at 01 Discovery. Continue with work-requirements. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | Is the agreed goal for the sales team to assign one Tier to each Account and use it to rank accounts? Answer: Yes, confirmed by the owner on 2026-09-28. | R-01 | Answered | owner |
| Q-02 | Should Tier be optional with no default value, or required or prefilled? Answer: Tier can be blank and has no default value, confirmed by the owner on 2026-09-28. | R-01 | Answered | owner |
| Q-03 | Do you approve the two sandbox deployments in order: WI-001 Account.Tier__c, then WI-002 Account layout, with the WI-002 profile steps applied afterward? Answer: Yes, Mike Rihm approved deploying WI-001, then WI-002 to tkv2-sbx, and will do the manual profile steps afterward on 2026-09-28. | Sandbox release of R-01 through R-04 | Answered | owner |

## Requirements

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

New work: add a Tier picklist field to Account so the sales team can rank their accounts.

### Agreed goal

The sales team can assign one Tier to each Account and use it to rank accounts.

### Active requirements

#### R-01 — Account Tier ranking

**Status:** Finalized  
**Applies to:** Accounts used by the sales team.  
**Required behavior:** The sales team can assign one Tier to each Account to rank it. The available values are Gold, Silver, and Bronze, in that order.  
**Boundaries and exceptions:** Tier can be blank and has no default value.  
**Acceptance check:** On an Account, an authorized editor can select Gold, Silver, or Bronze in that order, clear Tier, and save the Account. A new Account starts with Tier blank.  
**Decision record:** Owner confirmed the goal and values on 2026-09-28. Owner confirmed Tier can be blank with no default value on 2026-09-28. Mike Rihm approved R-01 and the acceptance checks on 2026-09-28.  
**Open questions:** None.

#### R-02 — Field guidance

**Status:** Finalized  
**Applies to:** The new Account Tier custom field.  
**Required behavior:** The field has a description and help text.  
**Boundaries and exceptions:** None identified.  
**Acceptance check:** The field definition includes a description and help text.  
**Decision record:** Owner stated a standing preference for every new custom field on 2026-09-28. Mike Rihm approved R-02 and the acceptance checks on 2026-09-28.  
**Open questions:** None.

#### R-03 — Tier access

**Status:** Finalized  
**Applies to:** People who can access Accounts.  
**Required behavior:** Users with the Sales Manager profile and system administrators can edit Tier. Everyone else who can see an Account can read its Tier.  
**Boundaries and exceptions:** A user who cannot see an Account does not gain access to it through Tier.  
**Acceptance check:** A Sales Manager and a system administrator can change Tier on an Account they can access. Another user who can see the Account can read Tier but cannot change it.  
**Decision record:** Owner specified the access rule on 2026-09-28. Mike Rihm approved R-03 and the acceptance checks on 2026-09-28.  
**Open questions:** None.

#### R-04 — Tier placement

**Status:** Finalized  
**Applies to:** The Account page layout used by Account viewers.  
**Required behavior:** Tier appears directly below Rating.  
**Boundaries and exceptions:** None identified.  
**Acceptance check:** On the Account page layout, Tier is directly below Rating.  
**Decision record:** Owner specified the placement on 2026-09-28. Mike Rihm approved R-04 and the acceptance checks on 2026-09-28.  
**Open questions:** None.

### Acceptance

This work item can be accepted when:

1. The Account Tier field offers Gold, Silver, and Bronze in that order; Tier is optional, can be cleared, and has no default.
2. The field definition has a description and help text.
3. The owner reviews the Tier field result.

WI-002 has separate acceptance and result approval for WI-001 R-03 and R-04.

## Notes

### Decisions and context

- Mike Rihm approved R-01 through R-04 and the acceptance checks on 2026-09-28. On 2026-09-28 he approved design Option A and directed that access and page layout be a sub-item. WI-001 builds only the field for R-01 and R-02. WI-002 delivers R-03 and R-04 under the inherited approvals. The parent keeps the original approved requirement text as the split record.

### Resume here

Finished on 2026-09-28. Nothing to resume.

### Solution options and considerations

These are possibilities to evaluate, **not approved requirements or design decisions**.

- Security and Account page layout components need to be identified during design.
