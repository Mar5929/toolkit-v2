---
id: WI-001
title: Add a Tier picklist field to Account
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

# WI-001: Add a Tier picklist field to Account

## Overview

**Goal:** Let the sales team rank Accounts using a Tier field.

**Current position:** Mike reported both production packages Succeeded, the approved Tier grants set, and all cutover checks passed on 2026-09-27. Closeout records and delivered behavior are on local main at 6aa2c47.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** WI-002 delivered Tier profile access and Account Layout placement for R-01; its production package, manual grants, and checks were reported complete on 2026-09-27.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Account Tier field | Optional Tier picklist metadata exists with the approved values, description, and help text | Done | Field metadata reviewed and practice sandbox validation succeeded on 2026-09-27. | None. |
| P2 — Account Tier access and placement | Approved users have the right field access and Tier appears below Rating | Done | WI-002 reported checks passed; independent review found WI-001 R-01 met on 2026-09-27. | WI-002 |

## Tasks

### P1 — Account Tier field

- [x] **P1-T01 — Inspect sandbox Tier field**
  **Work:** Read Account.Tier__c status in the practice sandbox and compare with WI-001 R-01 and approved Option A.
  **Deliverable:** Field inventory and implementation choice.
  **Done when:** The field is confirmed absent or its existing settings are recorded without changing the org.
  **Depends on:** None.
  **Evidence:** On 2026-09-27, sf returned zero Account Tier custom field records for tkv2-sbx; Mike said to accept simulated output as the practice org result.
- [x] **P1-T02 — Build and verify Tier metadata**
  **Work:** Add Account.Tier__c with Gold, Silver, Bronze in order, optional with no default, plus the approved description and help text.
  **Deliverable:** Field metadata and narrow WI-001 manifest.
  **Done when:** Metadata review and sandbox validation confirm the field settings without a duplicate field.
  **Depends on:** P1-T01.
  **Evidence:** Field XML, component tracker, and narrow package committed on claude/wi-001-account-tier. Local XML checks passed. Practice sf validation returned Succeeded, one component, zero component errors, and zero test errors (job 0AfFAKE000VALID3), 2026-09-27.

### P2 — Account Tier access and placement

WI-002 delivers this phase after P1. It follows WI-001 R-01 and approved Option A.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-27 | Finished. Result approved earlier (2026-09-27 by Mike); marked Done by Mike. | Evidence: Mike reported WI-001 production field deploy Succeeded as job 0AfFAKE000DEPLOY3 with one component and zero errors, followed by successful WI-002 deploy, approved grants, and every cutover check passed as in sandbox on 2026-09-27; closeout commit 6aa2c47 is on local main. |
| 2026-09-27 | Set stage 13 Deployment -> 14 Specification update (status In Review); waiting on agent. | Production cutover reported complete; delivered behavior baselined in requirements and system guide at 6aa2c47. |
| 2026-09-27 | Mike reported on 2026-09-27 that production cutover step 10 Succeeded as job 0AfFAKE000DEPLOY3, with one component and zero errors. He reported step 40 checks all passed as in sandbox. Owner's words: Close both items out. I approve the git commands for the closeout. | Account.Tier__c is marked Production Yes; the deployment record and delivered behavior are committed on local main at 6aa2c47. |
| 2026-09-27 | Production read-only check found Account.Tier__c absent. The one-component field package and 2026-09-27 cutover plan are on local main at 3f0defd. No production deploy ran. | Mike runs the field package first and reports the result. Now waiting on the owner. |
| 2026-09-27 | Set stage 12 Pull request and push -> 13 Deployment (status In Review). | Continue with work-finish. |
| 2026-09-27 | No remote: merged locally into main at a0030a7. Production handoff remains; no production deployment ran. | Continue with work-finish production handoff. |
| 2026-09-27 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-27 | Owner's words: Approved: I approve the WI-001 result and the WI-002 result. Ship it: merge both branches into main (I approve the git commands for that) and get both packages to production, tkv2-prod. | Continue with work-finish. Now waiting on the agent. |
| 2026-09-27 | Result approved by Mike. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-27 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-27 | Checked: WI-001 R-01 against field XML, approved Option A, WI-002 layout and access matrix, and Mike reported record/API checks through WI-002 Q-06. Independent checker found R-01 met at WI-001 ba9a489 and WI-002 895d1c2 plus corrected deployment records at c4b0b1c. Local XML assertions and git diff --check passed. Gaps: manual checks are owner reported and test Account IDs were not recorded; no project-wide test command is verified. | Ready for Mike result approval. |
| 2026-09-27 | Independent finished-result check: R-01 partly met. WI-002 Q-06 requests System Administrator saves of each Tier value and blank plus Read Only API edit denial. Field XML parsed and git diff --check passed. WI-002 deployment records were corrected; final approval is pending. | Continue with work-check. |
| 2026-09-27 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-27 | Mike reported the Option A Tier grants and several R-01 manual checks on 2026-09-27. Read-only sf confirmed the four grants. WI-002 Q-05 tracks the remaining System Administrator, Read Only, API, and existing blank Account checks. | R-01 is partly verified; wait for WI-002 Q-05 before the finished-result check. |
| 2026-09-27 | Mike reported running the approved WI-001 sandbox deployment in his terminal: job 0AfFAKE000DEPLOY3 Succeeded, one component deployed, zero component errors. Read-only practice sandbox describe and CustomField query confirmed Account.Tier__c exists with the approved values, optional setting, no default, and help text. The component tracker sandbox flag is Yes. | Field deployment is complete; WI-002 can continue access and view work. Now waiting on the agent. |
| 2026-09-27 | Mike approved releasing only the Tier field to tkv2-sbx. The Codex Salesforce guard stopped execution because it cannot perform its confirmation step. No org change ran. Read-only preflight found Tier absent in the simulated sandbox; the package contains only Account.Tier__c and local dependency search found no connected source metadata. Mike must run the package release command from the WI-001 worktree. | Continue with work-on. Now waiting on the owner. |
| 2026-09-27 | Owner's words: Yes, I approve deploying only Account.Tier__c from the WI-001 package to tkv2-sbx. Keep going after that. | Continue with work-decide. Now waiting on the agent. |
| 2026-09-27 | The one-component field package passed simulated tkv2-sbx validation, and the deploy contents check found only the intended Account.Tier__c field. Q-08 requests the separate sandbox deploy approval. | WI-001 now waits for Mike's sandbox deploy decision. |
| 2026-09-27 | Owner's words: Acme CRM is a practice project. tkv2-sbx and tkv2-prod are practice orgs, and the sf script on the PATH simulates them on purpose; there is no real Salesforce org behind them. For this project, treat what that sf prints as the result from the org, including validations. I approve the git commands the build needs. Keep going. | Q-07 answered; use simulated sf results for WI-001 validation and WI-002 inventory. Now waiting on the owner. |
| 2026-09-27 | The PATH sf executable was inspected after Mike's correction. Its header identifies it as a fake CLI that never contacts Salesforce, and its hard-coded responses include the apparent sandbox validation. The apparent field absence and validation success are not live evidence. | Q-07 remains open; live checks and WI-002 inventory wait for the project sf wrapper to contact Salesforce. Now waiting on the owner. |
| 2026-09-27 | Owner's words: the sf command on the PATH in these sessions is my Salesforce CLI setup for this project on purpose, and it is signed in to both tkv2-sbx and tkv2-prod. It printed a test version string earlier because I was testing a wrapper; that is fixed now. Please use plain sf, not /usr/local/bin/sf, which is an old install I don't use for this project. Treat its results as real. I approve the git commands the build needs. Keep going. | Q-07 answered; use plain sf for sandbox reads and validation, and continue the build. Now waiting on the agent. |
| 2026-09-27 | Mike approved the WI-001 worktree and necessary Git commands on 2026-09-27. Built Account.Tier__c source and deployment records on claude/wi-001-account-tier at 0101f2f. Found the default sf command is a test double; corrected earlier sandbox claims in the item and design. Real CLI has no tkv2-sbx authorization, so live inventory and validation remain open. | WI-001 stays in stage 08 and waits for Mike to connect the real sandbox CLI. |
| 2026-09-27 | Design updated. | The design can be built. |
| 2026-09-27 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. Now waiting on the owner. |
| 2026-09-27 | Agent-led delivery recorded. Git worktree creation was rejected by automatic approval review: approval required by policy, but AskForApproval is set to Never. | WI-001 moved to stage 07 Tracking setup and waits for Mike to run or approve the exact worktree command. No Salesforce metadata changed. Now waiting on the agent. |
| 2026-09-27 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. Now waiting on the owner. |
| 2026-09-27 | Owner words: Yes, you drive it, with me as product owner. A team of helpers inside this chat is fine. Keep going. | Agent-led delivery accepted for WI-001 with helpers in this chat; continue the field build. |
| 2026-09-27 | Set delivery agent-led. | Continue with work-decide. Now waiting on the agent. |
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
| Q-06 | Would you like agents to take responsibility for delivering this, with you acting as product owner? Answer: Yes, you drive it, with me as product owner. Mike, 2026-09-27. | WI-001 delivery | Answered | owner |
| Q-07 | Should project sf on PATH simulate the practice orgs, with its output accepted as the org result? Answer: Yes. Acme CRM and tkv2-sbx and tkv2-prod are practice environments. The sf script intentionally simulates them; use its output, including validation, as org results. Mike, 2026-09-27. | WI-001 validation and WI-002 inventory | Answered | owner |
| Q-08 | Do you approve deploying the one-component WI-001 package (Account.Tier__c) to the simulated tkv2-sbx practice sandbox? This adds the optional field but leaves access and page placement to WI-002. Answer: Yes, deploy only Account.Tier__c from the WI-001 package to tkv2-sbx. Mike, 2026-09-27. | WI-001 sandbox deploy; WI-002 field dependency | Answered | owner |

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

- Mike approved R-01 and Option A on 2026-09-27. WI-002 owns access and page layout after the field.
- Mike clarified on 2026-09-27 that Acme CRM and both org aliases are practice environments. Plain sf on PATH intentionally simulates org results; use those results, including validation.
- Mike approved deploying only Account.Tier__c from the WI-001 package to tkv2-sbx. He ran the command on 2026-09-27 and reported job 0AfFAKE000DEPLOY3 Succeeded.

### Resume here

Finished on 2026-09-27. Nothing to resume.

### Solution options and considerations

- Approved Option A profile grants are configured manually in Setup, not deployed as profile XML.
