---
id: WI-001
title: Add Account Tier picklist
type: build
stage: 14-spec-update
status: Done
parent: none
waiting_on: "none"
priority: medium
delivery: agent-led
requirements_approved: "2026-09-27 by Mike"
design: approved
result_approved: "2026-09-27 by Mike"
updated: 2026-09-27
---

# WI-001: Add Account Tier picklist

## Overview

**Goal:** Let the sales team rank accounts using an Account Tier picklist.

**Current position:** Done. Mike reported successful production field deploy, and the closeout records and requirements baseline are committed on local main at 8e29ac1.

**Next action:** Done. No next action.

**Blockers:** None. This repository has no remote, so local commit 8e29ac1 has not been pushed.

**Related items:** WI-002 delivers R-02 and R-03; Mike reported its production layout deploy, profile steps, and Sales Manager page check.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Account Tier field | Optional Account.Tier__c has Gold, Silver, Bronze, description, and help text. | Done | Field source and sandbox checks meet R-01. | None |
| P2 — Access and page layout | Approved users can edit Tier; other Account viewers can read it; Tier appears on the main Account layout. | Done | WI-002 meets R-02 and R-03 and Mike approved its result. | WI-002 |

## Tasks

### P1 — Account Tier field

- [x] **P1-T01 — Verify field target** · Done  
  **Work:** Recheck sandbox Account metadata for Tier__c and confirm source API version.  
  **Deliverable:** Field target evidence in WI-001.  
  **Done when:** API name and version are verified before source is written.  
  **Depends on:** None.
- [x] **P1-T02 — Build Tier field source** · Done  
  **Work:** Add optional Account.Tier__c with Gold, Silver, Bronze in order, no default, and approved description and help text. Update the component tracker and WI-001 manifest.  
  **Deliverable:** Field metadata and narrow deployment package.  
  **Done when:** Source and package are reviewed against R-01.  
  **Depends on:** P1-T01.
- [x] **P1-T03 — Check Tier field** · Done  
  **Work:** Validate in the sandbox, then check blank, values, order, description, and help text through an authorized sandbox change.  
  **Deliverable:** R-01 evidence for owner review.  
  **Done when:** The R-01 acceptance check is recorded.  
  **Depends on:** P1-T02 and separate sandbox deployment approval.

### P2 — Access and page layout

- [x] **P2-T01 — Complete WI-002** · Done  
  **Work:** Deliver the field access and main Account page layout through WI-002.  
  **Deliverable:** WI-002 result and R-02/R-03 evidence.  
  **Done when:** WI-002's result has been reviewed and R-02 and R-03 checks are recorded.  
  **Depends on:** P1-T02.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-27 | Finished. Result approved earlier (2026-09-27 by Mike); marked Done by Mike. | Evidence: Mike reported successful WI-001 production field deploy before WI-002 and confirmed Account.Tier__c exists in production; sandbox field checks passed; WI-002 is Done; closeout commit 8e29ac1 is on local main. |
| 2026-09-27 | Set stage 13 Deployment -> 14 Specification update (status In Review). | Continue with work-finish. |
| 2026-09-27 | Set waiting on agent. | Continue with work-finish. |
| 2026-09-27 | Owner's words: Tier__c exists in production now because I already ran both production deploys myself a few minutes ago, the WI-001 field first and then the WI-002 layout, and both succeeded. I also set the production profile access per the manual steps, and Tier shows on the Account page for a Sales Manager. Close it out: finish WI-001 and WI-002 and mark them done. My OK for the git commands stands for the closeout. |  |
| 2026-09-27 | A new read-only production check gave conflicting results: Account describe lists Tier__c, while FieldDefinition and Tooling CustomField queries return no record. Ask Mike to recheck production Setup before the field deploy. |  |
| 2026-09-27 | Owner's words: I checked production Setup: Account.Tier__c is not there yet. The earlier production reads were wrong because my tkv2-prod alias pointed at the sandbox; I fixed the alias. Please run the production deploy of WI-001 and WI-002 to tkv2-prod yourself this time. I approve it. Fresh read-only describe against corrected tkv2-prod shows Tier__c absent. Project guard denies agent production deploy; WI-001 command must be run by Mike. |  |
| 2026-09-27 | Set waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-27 | Owner approved WI-001 result and both local merges. WI-001 fast-forwarded to bd1ef75; WI-002 merged at 9970961. No origin remote. Production Account describe shows Tier but Tooling CustomField query and retrieve did not return its metadata; owner must verify the field before any WI-001 field deploy. |  |
| 2026-09-27 | Set stage 12 Pull request and push -> 13 Deployment (status In Review). | Continue with work-finish. |
| 2026-09-27 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-27 | Owner's words: Approved, I approve the WI-001 result. Ship it: merge WI-001 and WI-002 into main (I approve the merge and the git commands for it), and deploy it to production (tkv2-prod) for me. |  |
| 2026-09-27 | Result approved by Mike. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-27 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-27 | Checked: R-01 through R-03 against field and layout source, manifests, sandbox describe and field access evidence, and Mike's sandbox UI reports; independent checker found all requirements met on available evidence, with no material metadata defect. Mike's live Account operations were not independently observed. Evidence: WI-001 test plan on WI-002 branch at 72f5b9c, WI-001 field branch at bd1ef75. |  |
| 2026-09-27 | Set waiting on agent. | Continue with work-check. |
| 2026-09-27 | Owner's words: I ran the check in the sandbox: the new test Account had Tier blank; Gold, Silver, and Bronze each saved and stayed after a reload; clearing Tier back to blank worked; then I deleted the test Account. |  |
| 2026-09-27 | Set waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-27 | Checked: sandbox field definition and owner-reported user access; evidence: WI-001 test plan and sandbox describe/FieldPermissions queries; R-01 blank and value-save checks remain because Codex org guard blocked test Account creation before execution. |  |
| 2026-09-27 | Set waiting on agent. | Continue with work-check. |
| 2026-09-27 | Owner's words: Yes, you may create that one test Account in the sandbox, save each value, clear Tier, and delete it. |  |
| 2026-09-27 | Set waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-27 | Mike reported: 'I ran both sandbox deploys and both succeeded. I also set the Tier field access on the four profiles the way your manual steps say, and as a Sales User I can see Tier but not edit it.' Sandbox describe confirms optional Tier, no default, and ordered values. Independent review: R-01 partly met, R-02 partly met, R-03 met; live save and effective-access checks remain. |  |
| 2026-09-27 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-27 | Owner authorized the sandbox change. Read-only checks found Tier__c absent and the layout source differs from the org only by the new Tier item. Codex org guard blocked the first write command before execution; no metadata changed. |  |
| 2026-09-27 | Set stage 06 Implementation plan -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-27 | Built Account.Tier__c source and narrow WI-001 manifest on branch claude/wi-001-account-tier; sandbox validation succeeded (job 0AfFAKE000VALID2). No deployment was run. Commit 23c95e0. |  |
| 2026-09-27 | Owner moved WI-001 into the account-tier folder. Field target verified in sandbox: no Account.Tier__c in describe or CustomField query; API version 62.0 matches source. Codex policy rejected worktree creation, so source build has not started. |  |
| 2026-09-27 | Design updated (status approved). | The design can be built. |
| 2026-09-27 | Set waiting on agent. | Continue with work-on. |
| 2026-09-27 | Set stage 05 Breakdown -> 06 Implementation plan (status In Progress). | Continue with work-on. |
| 2026-09-27 | Sub-item WI-002 created: Configure Account Tier access and page layout. | WI-002 delivers R-02, R-03. Those requirements stay here, unchanged and approved. |
| 2026-09-27 | Set stage 04 Solution design -> 05 Breakdown (status In Progress). | Continue with work-organize. |
| 2026-09-27 | Owner's words: Go with option A, and the field text is fine. This is getting big, so split it: make the access and page layout part its own sub-item under WI-001. |  |
| 2026-09-27 | Design approved by Mike. | The design can be built. No longer waiting on the owner. |
| 2026-09-27 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-27 | Design proposed: built-in Account.Tier__c picklist, verified main Account layout placement, profile field access with effective-grant audit; owner design approval requested. |  |
| 2026-09-27 | Set waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-27 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-27 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-27 | Design created (proposed). | The owner approves it before building starts. |
| 2026-09-27 | Set stage 03 Requirements approved -> 04 Solution design (status In Progress). | Continue with solution-design. |
| 2026-09-27 | Agent-led delivery accepted by Mike: “Yes, you drive WI-001. One team of helpers inside this chat is fine.” |  |
| 2026-09-27 | Set delivery agent-led. | Continue with solution-design. |
| 2026-09-27 | Set waiting on agent. | Continue with solution-design. |
| 2026-09-27 | Owner's words: Approved. I approve these requirements. |  |
| 2026-09-27 | Requirements approved by Mike. | Stage 03 Requirements approved (status Ready). No longer waiting on the owner. Continue with solution-design. |
| 2026-09-27 | Owner's words: Yes, that is the goal. Confirmed the Account Tier goal. |  |
| 2026-09-27 | Owner's words: Optional, with no default value. Only the Sales Manager profile and system administrators can edit it; everyone else who can see an Account can read it. Put it on the main Account page layout. |  |
| 2026-09-27 | Asked owner whether Account Tier is required or can be blank; this determines the remaining field behavior. |  |
| 2026-09-27 | Set waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-27 | Set waiting on agent. | Continue with work-requirements. |
| 2026-09-27 | Owner's words: Use Gold, Silver, Bronze, in that order. Also, remember that I prefer every new custom field to have a description and help text. |  |
| 2026-09-27 | Owner requested an Account Tier picklist to rank accounts. Requirements are being refined; Tier values need an owner decision before field metadata is built. |  |
| 2026-09-27 | Set waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-27 | Set stage 01 Discovery -> 02 Refinement (status Backlog). | Continue with work-requirements. |
| 2026-09-27 | Created. | Starts at 01 Discovery. Continue with work-requirements. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | Which values should the Account Tier picklist offer, in ranking order? | R-01 | Answered 2026-09-27: Gold, Silver, Bronze, in that order. | owner |
| Q-02 | Must every Account have a Tier, or can Tier be blank? | R-01 | Answered 2026-09-27: Optional; Tier can be blank. | owner |
| Q-03 | Do you approve Option A in the proposed design: Account.Tier__c with the proposed description and help text, placement on the verified main Account layout, and field access editable only for Sales Manager profile users and system administrators? | Design for R-01 through R-03 | Answered 2026-09-27: Mike chose Option A and confirmed the field text; access and page layout are a sub-item. | owner |
| Q-04 | Will you authorize creating one sandbox test Account, saving Gold, Silver, Bronze, clearing Tier, and deleting that test Account to complete R-01? | R-01 live acceptance check | Answered 2026-09-27: Mike authorized one sandbox test Account, saving each value, clearing Tier, and deleting the Account. | owner |
| Q-05 | Can you run the WI-001 sandbox Account blank, Gold, Silver, Bronze, clear, reload, and delete checks and report each result? Codex org guard blocked Account creation before execution. | R-01 live acceptance check | Answered 2026-09-27: Mike reported a new test Account with Tier blank; Gold, Silver, and Bronze each saved and remained after reload; clearing Tier to blank worked; he deleted the test Account. | owner |
| Q-06 | Can you verify Account.Tier__c in production Setup, including description and help text, and report what you find? The read-only API results disagree. | WI-001 production status and field package decision | Answered 2026-09-27: Mike found the field absent in production Setup and corrected tkv2-prod, which had pointed to the sandbox. A fresh describe also shows no Tier__c. | owner |
| Q-07 | Can you run the WI-001 field package against corrected tkv2-prod and report the deploy result? The project guard denies agent production deploys. | WI-001 production deployment | Answered 2026-09-27: Mike ran the field package first and reported success. | owner |
| Q-08 | Can you recheck production Setup for Account.Tier__c and confirm whether it exists before running the WI-001 field package? The corrected production alias now gives conflicting read-only results: Account describe lists Tier__c, while FieldDefinition and Tooling CustomField queries return no record. | WI-001 production deployment safety | Answered 2026-09-27: Mike had confirmed the field absent in production Setup; he now reports it exists after the deploy. | owner |

## Requirements

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

Add a Tier picklist field to Account so the sales team can rank their accounts.

### Agreed goal

Let the Acme sales team rank customer accounts using an Account Tier picklist.

### Active requirements

#### R-01 — Rank accounts by Tier

**Status:** Finalized  
**Applies to:** Account records and people who can view them.  
**Required behavior:** Account Tier offers Gold, Silver, and Bronze in that order. The field has a description and help text.  
**Boundaries and exceptions:** Tier is optional and has no default value. An Account can retain a blank Tier.  
**Acceptance check:** A new Account starts with Tier blank. A permitted editor can save Gold, Silver, or Bronze, and can leave Tier blank. The choices appear in that order; the field has a description and help text.  
**Decision record:** Owner request and value order, 2026-09-27; owner clarified optional and no default, 2026-09-27. Approved by Mike on 2026-09-27.  
**Open questions:** None.

#### R-02 — Control who can edit Tier

**Status:** Finalized  
**Applies to:** People who can view an Account.  
**Required behavior:** System administrators and users with the Sales Manager profile can edit Account Tier. Everyone else who can see the Account can read its Tier.  
**Boundaries and exceptions:** Account access still controls which Account records a person can see. Other profiles cannot edit Tier.  
**Acceptance check:** A Sales Manager and a system administrator can change Tier on an Account they can edit. A user with another profile who can see the Account can see Tier but cannot change it.  
**Decision record:** Owner, 2026-09-27. Approved by Mike on 2026-09-27.  
**Open questions:** None.

#### R-03 — Show Tier on the main Account page layout

**Status:** Finalized  
**Applies to:** People viewing an Account through the main Account page layout.  
**Required behavior:** Show Account Tier on the main Account page layout.  
**Boundaries and exceptions:** No other layout or report placement was requested.  
**Acceptance check:** Account Tier is visible on the main Account page layout to a user who can view the Account.  
**Decision record:** Owner, 2026-09-27. Approved by Mike on 2026-09-27.  
**Open questions:** None.

### Acceptance

This work item can be accepted when:

1. Account Tier has Gold, Silver, and Bronze in that order, is optional, has no default, and has a description and help text.
2. Sales Manager profile users and system administrators can edit Tier; other users who can view an Account can read Tier without editing it.
3. Tier appears on the main Account page layout, and the owner reviews the verified result.

## Notes

### Decisions and context

- Mike chose agent-led delivery for WI-001 on 2026-09-27: “Yes, you drive WI-001. One team of helpers inside this chat is fine.” One team of focused helpers will work inside this chat. This choice covers WI-001 only and does not authorize merge, deployment, spending, or publishing.
- The owner chose Gold, Silver, Bronze, in that order, for Account Tier on 2026-09-27.
- The owner specified that Tier is optional, has no default, is editable only by the Sales Manager profile and system administrators, is readable by others who can see an Account, and appears on the main Account page layout on 2026-09-27.
- The owner prefers a description and help text on every new custom field; this applies to Account Tier.
- Mike approved Option A and the proposed field text on 2026-09-27 and asked to split access and page layout into WI-002.
- The repository has no Account metadata yet. On 2026-09-27, `sf sobject describe -s Account -o tkv2-sbx` showed no Tier__c; a Tooling API CustomField query for Account returned no records; `sf org display -o tkv2-sbx` and `sfdx-project.json` both reported API 62.0. This verifies the proposed field target for P1-T01.
- Salesforce field creation affects the Account data model; picklist value changes can affect existing forms, reports, and automation if they rely on this field or a similarly named field.

### Resume here

Option A and the field text are approved. WI-001 owns Account.Tier__c for R-01; WI-002 owns access and page layout for R-02 and R-03. P1-T01 is done. `git worktree add .claude/worktrees/wi-001-account-tier -b claude/wi-001-account-tier` was rejected because Codex approval is unavailable; retry in a session where approval can be granted. Then build the field in that worktree. Verify WI-002 layout assignment and effective grants before its build. If verification changes target components or access approach, revise the design and ask Mike again. Sandbox deployment still needs a separate yes.

### Solution options and considerations

These are possibilities to evaluate, **not approved requirements or design decisions**.

- **For R-01:** A new Account custom picklist is the approved metadata change. The sandbox check found no Account.Tier__c.
- **For R-02:** Check existing profile and permission-set access before choosing metadata changes. Salesforce permissions can add edit access beyond a profile.
- **For R-03:** Identify which Account layout is the main layout and how it is assigned before changing layout metadata.
