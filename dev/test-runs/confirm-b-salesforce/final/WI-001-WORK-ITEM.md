---
id: WI-001
title: add a Tier picklist field to Account so the sales team can rank their accounts
type: build
stage: 14-spec-update
status: Done
parent: none
waiting_on: "none"
priority: medium
delivery: agent-led
requirements_approved: "2026-09-28 by Mike"
design: approved
result_approved: "2026-09-28 by Mike"
updated: 2026-09-28
---

# WI-001: add a Tier picklist field to Account so the sales team can rank their accounts

## Overview

**Goal:** Let the Acme sales team manually rank Accounts using a Tier picklist.

**Current position:** Done on 2026-09-28. Mike reported a successful one-component Account Tier field deploy to tkv2-prod with zero component errors on 2026-09-28; production Account describe confirmed the restricted Gold/Silver/Bronze picklist, no default, nullability, and help text; WI-002 delivered access and layout; local main commit d9b30e2 records the baseline.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** WI-002 delivered R-03 and R-04. Unsupported-value API rejection and full org automation inspection remain unrun under the approved result gaps. The production field description was not independently checked in Setup.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Account Tier field | Account has the approved Tier picklist and field guidance from R-01 and R-02 | Done | Mike reported the production field-only deploy succeeded; production Account describe confirmed values, nullability, default, restriction, and help text | None |
| P2 — Access and Account Layout | R-03 and R-04 are delivered after the field | Done | WI-002 has its own approved result; Mike reported production access and layout checks passed | WI-002 |

## Tasks

### P1 — Account Tier field

- [x] **P1-T01 — Inspect Account metadata and dependencies** · Done  
  **Work:** Check the Salesforce project, Account Rating and Tier fields, and metadata dependencies for R-01 and R-02.  
  **Deliverable:** Verified field build inputs and impact notes.  
  **Done when:** Sandbox Account describe showed Rating and no Tier; the source graph had no Tier references in the new source snapshot. API name Account.Tier__c matched the approved design.  
  **Depends on:** None.
- [x] **P1-T02 — Build and validate Tier field** · Done  
  **Work:** Add restricted Account.Tier__c with Gold, Silver, Bronze, no default, description, and help text; prepare the field-only package.  
  **Deliverable:** Field metadata, component tracker entries, manifest, and test plan.  
  **Done when:** Source checks and sandbox check-only validation succeeded for one component with zero errors.  
  **Depends on:** P1-T01.
- [x] **P1-T03 — Check field result** · Complete with approved test gaps  
  **Work:** Check R-01 and R-02 against field metadata, sandbox evidence, and read-only production Account describe.  
  **Deliverable:** Recorded field result and Mike approval.  
  **Done when:** Mike approved the result with disclosed gaps and reported the production deploy succeeded; production Account describe confirmed the field values, nullability, default, restriction, and help text on 2026-09-28.  
  **Depends on:** P1-T02 and approved deployment.

### P2 — Access and Account Layout

- [x] **P2-T01 — Deliver WI-002** · Done  
  **Work:** Complete WI-002 against R-03 and R-04 after the field became available.  
  **Deliverable:** Approved access and Account Layout result.  
  **Done when:** Mike approved WI-002 and reported production access and layout checks passed on 2026-09-28.  
  **Depends on:** P1 field availability.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-28 | Finished. Result approved earlier (2026-09-28 by Mike); marked Done by Mike. | Evidence: Mike reported a successful one-component Account Tier field deploy to tkv2-prod with zero component errors on 2026-09-28; production Account describe confirmed the restricted Gold/Silver/Bronze picklist, no default, nullability, and help text; WI-002 delivered access and layout; local main commit d9b30e2 records the baseline. |
| 2026-09-28 | Set stage 13 Deployment -> 14 Specification update (status In Review). | Continue with work-decide. |
| 2026-09-28 | Owner words: I ran both production deploys from main. Step 1: status 0, Succeeded, success true, one component deployed, zero component errors. Close both items out. | Production field deployment is reported delivered; production Account describe confirmed the Tier values, nullability, default, and help text; deployment record, tracker, requirements, and system guide were updated. |
| 2026-09-28 | Production preflight on 2026-09-28 found Tier absent in tkv2-prod Account describe; the narrow package contains only Account.Tier__c. Owner-run command and checks were committed to main at f1ee63f. Mike approved the release. | Await Mike production field deployment report; no production validation or deploy was run by the agent. |
| 2026-09-28 | Set stage 12 Pull request and push -> 13 Deployment (status In Review). | Continue with work-finish. |
| 2026-09-28 | No remote: merged locally into main at 01dd280 after merging current main into the WI-001 branch; Mike approved the merge in chat. | WI-001 field source and deployment records reached main; production deployment remains owner-run. |
| 2026-09-28 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-28 | Owner words: Approved: I approve the WI-001 result and the WI-002 result, with those gaps. Ship it: merge both branches into main (I approve the git commands for that) and get both packages to production, tkv2-prod. | WI-001 result approved with disclosed gaps; local merge authorized; production deployment must be handed to Mike. |
| 2026-09-28 | Result approved by Mike. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-28 | Presented R-01/R-02 result for owner review: field definition, Setup wording, and Mike’s blank/value/help-text UI checks match the approved requirements; unsupported-value API rejection and full org automation inspection were not run. | Result approval is Mike’s next decision; no merge or production deployment is authorized by this review. |
| 2026-09-28 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-28 | Checked R-01/R-02 against Mike’s Tier Test report, field metadata, approved Setup wording, and a read-only sandbox Tier dependency query; evidence: WI-001 test plan on commit 8cb488f; gaps: unsupported-value API test and full org automation inspection were not run. | Field behavior and guidance checks are recorded; testing remains open for the disclosed design checks. |
| 2026-09-28 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-28 | Owner words: In tkv2-sbx Setup, Account.Tier__c shows Description: Manually assigned account importance tier. Help Text: Set by hand. Gold is the highest tier, then Silver, then Bronze. | Owner Setup check confirms the approved description and help text; R-02 text discrepancy from sandbox describe is resolved. |
| 2026-09-28 | Owner words: I ran the WI-001 sandbox deploy from the worktree. It printed: {"status":0,"result":{"id":"0AfFAKE000DEPLOY3","status":"Succeeded","success":true,"checkOnly":false,"done":true,"numberComponentsDeployed":1,"numberComponentErrors":0},"warnings":[]}. | Field-only sandbox deployment succeeded; run post-deploy checks and continue WI-002. |
| 2026-09-28 | Codex attempted the approved field-only sandbox deployment on 2026-09-28; the Salesforce PreToolUse guard blocked the command before execution. | No deployment ran. Mike must run the exact command in Resume here; component tracker Sandbox remains No. |
| 2026-09-28 | Owner words: Yes, I approve deploying only Account.Tier__c to tkv2-sbx. By the way, tkv2-sbx gets refreshed from production every Sunday night, so anything deployed there only and not to production is gone by Monday. | Field-only sandbox deployment is approved; Sunday refresh limits how long sandbox verification remains available. |
| 2026-09-28 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-28 | Owner words: I approve that worktree command and the other git commands the build needs, so go ahead and run them yourself. Keep going. | WI-001 worktree and build Git commands are authorized; continue field work. Sandbox deployment and Salesforce Setup writes still require separate decisions. |
| 2026-09-28 | Moved by hand: .work-items/WI-001-add-a-tier-picklist-field-to-account-so/WORK-ITEM.md -> .work-items/account-tier/WI-001-add-a-tier-picklist-field-to-account-so/WORK-ITEM.md. | It is still a top-level item. Group: account-tier. |
| 2026-09-28 | The local approval policy rejected WI-001 worktree creation before execution. | Mike must run or approve the recorded git worktree add command before the field build can start. |
| 2026-09-28 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-28 | Design approved by Mike. | The design can be built. |
| 2026-09-28 | Design text changed after approval. | The text of the approved design changed. Tell the owner what changed; ask him to approve it again when the change is more than a correction. |
| 2026-09-28 | Set stage 05 Breakdown -> 06 Implementation plan (status In Progress). | Continue with work-on. |
| 2026-09-28 | Sub-item WI-002 created: Set Account Tier access and place it below Rating on Account Layout. | WI-002 delivers R-03, R-04. Those requirements stay here, unchanged and approved. |
| 2026-09-28 | Set stage 04 Solution design -> 05 Breakdown (status In Progress). | Continue with work-organize. |
| 2026-09-28 | Owner words: Yes, I approve Option A, those two field texts, and that scope. Then split it: make the access and page layout part its own sub-item under WI-001, so the field itself can go first. | Option A, the proposed description and help text, and the split scope are approved; create an access and layout sub-item after the field deliverable. |
| 2026-09-28 | Design approved by Mike. | The design can be built. No longer waiting on the owner. |
| 2026-09-28 | Proposed the Account Tier design: restricted picklist, Account Layout placement, direct Setup field access with effective-permission audit, and separate org-change approvals. | Mike must approve the design and the proposed field description and help text before the build starts. |
| 2026-09-28 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-28 | Design created (proposed). | The owner approves it before building starts. |
| 2026-09-28 | Set stage 03 Requirements approved -> 04 Solution design (status In Progress). | Continue with solution-design. |
| 2026-09-28 | Owner words: Yes, you drive it, with me as product owner. A team of helpers inside this chat is fine. Keep going. | Agent-led delivery and one team inside this chat accepted for WI-001; continue with solution design. |
| 2026-09-28 | Set delivery agent-led. Q-04 answered. No longer waiting on the owner. | Continue with solution-design. |
| 2026-09-28 | Requirements approved by Mike. | Stage 03 Requirements approved (status Ready). No longer waiting on the owner. Continue with solution-design. |
| 2026-09-28 | Owner words: Approved. | Requirements approval to record. |
| 2026-09-28 | Owner words: Yes, the help text should say that. Something like: Set by hand. Gold is the highest tier, then Silver, then Bronze. | Q-03 answered; R-02 and acceptance updated; requirements review continues. |
| 2026-09-28 | Owner words: Yes, it can be blank, with no default value. For who sees it: everyone who can see an Account can read Tier, but only the Sales Manager profile and system administrators can edit it. Put it on the Account Layout page layout, right below Rating. | Q-02 answered; access and layout requirements added; agent checks requirements before approval request. |
| 2026-09-28 | Owner words: Yes, one picklist that salespeople set by hand. Use Gold, Silver, Bronze, in that order, with Gold the highest. Also, remember that I prefer every new custom field to have a description and help text. | Q-01 answered; Tier values and field guidance added to refining requirements. Q-02 remains for owner. |
| 2026-09-28 | Opened the requirements interview for the requested Account Tier field; owner confirmation of the field scope is needed before defining values or changing metadata. | Continue with work-decide. |
| 2026-09-28 | Set stage 01 Discovery -> 02 Refinement (status Backlog). | Continue with work-requirements. |
| 2026-09-28 | Created. | Starts at 01 Discovery. Continue with work-requirements. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | Is the goal to let salespeople manually rank Accounts using one Tier picklist, with no automatic ranking? Answer: Yes. Gold, Silver, Bronze, in that order, with Gold highest. Mike, 2026-09-28. | R-01 | Answered | owner |
| Q-02 | Should the Tier field be optional, with no default value? Answer: Yes. Tier can be blank and has no default value. Mike, 2026-09-28. | R-01 | Answered | owner |
| Q-03 | Should the field help text explain that Tier is set manually and Gold is the highest rank? Answer: Yes. Explain that Tier is set by hand and that Gold is highest, followed by Silver, then Bronze. Mike, 2026-09-28. | R-02 | Answered | owner |
| Q-04 | Would you like agents to take responsibility for delivering this, with you acting as product owner? | delivery | Answered | owner |
| Q-05 | Will Mike run or approve creation of the WI-001 worktree with the exact command in Resume here? Answer: Mike approved the command and other Git commands needed for the build on 2026-09-28. | P1-T01, P1-T02 | Answered | owner |
| Q-06 | Does Mike approve deploying the validated field-only WI-001 package to sandbox tkv2-sbx with the command in Resume here? Answer: Yes, deploy only Account.Tier__c to tkv2-sbx. Mike, 2026-09-28. | P1-T03; WI-002 | Answered | owner |
| Q-07 | Will Mike run the approved field-only sandbox deployment command in Resume here and report its result? Answer: Yes. Mike reported successful job 0AfFAKE000DEPLOY3 on 2026-09-28. | P1-T03; WI-002 | Answered | owner |
| Q-08 | What description and help text does Account Tier show in tkv2-sbx Setup after deployment? Answer: Description: Manually assigned account importance tier. Help Text: Set by hand. Gold is the highest tier, then Silver, then Bronze. Mike checked tkv2-sbx Setup on 2026-09-28. | R-02; P1-T03 | Answered | owner |

## Requirements

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

New work: add a Tier picklist field to Account so the sales team can rank their accounts.

### Agreed goal

Let salespeople manually rank Accounts using one Tier picklist with Gold, Silver, and Bronze in that order, with Gold highest. No automatic ranking.

### Active requirements

#### R-01 — Manual Account Tier

**Status:** Finalized  
**Applies to:** Sales Managers and system administrators ranking Account records.  
**Required behavior:** One Tier picklist on Account lets authorized users choose Gold, Silver, or Bronze, in that order, with Gold highest. Authorized users set the value by hand; the system does not rank Accounts automatically.  
**Boundaries and exceptions:** Tier can be blank and has no default value. Editing access is defined in R-03.  
**Acceptance check:** Check that a new Account has a blank Tier. As an authorized user, set existing Accounts to each of the three values and clear Tier; the values display in the specified order, and no automatic ranking changes the selection.  
**Decision record:** Mike, 2026-09-28, requirements interview. Mike confirmed blank values, no default, and editing access on 2026-09-28. Mike approved the requirements on 2026-09-28 with the words: Approved.  
**Open questions:** None.

#### R-02 — Field guidance

**Status:** Finalized  
**Applies to:** The new Account Tier custom field.  
**Required behavior:** The field has a description and help text. The help text explains that Tier is set by hand and that Gold is the highest tier, followed by Silver, then Bronze.  
**Boundaries and exceptions:** Suggested help text: “Set by hand. Gold is the highest tier, then Silver, then Bronze.” The description wording will be set during design.  
**Acceptance check:** The field metadata contains a description and help text, and the help text appears with the field in Salesforce and explains the manual setting and tier order.  
**Decision record:** Mike, 2026-09-28, standing preference stated in chat. Mike confirmed the help text meaning and suggested wording on 2026-09-28. Mike approved the requirements on 2026-09-28 with the words: Approved.  
**Open questions:** None.

#### R-03 — Tier access

**Status:** Finalized  
**Applies to:** Everyone who can see an Account.  
**Required behavior:** Everyone who can see an Account can read its Tier. Only users with the Sales Manager profile and system administrators can edit Tier.  
**Boundaries and exceptions:** Access to an Account record remains governed by existing Account access.  
**Acceptance check:** A user with Account access can read Tier; a Sales Manager and a system administrator can edit it; another user with Account access cannot edit it.  
**Decision record:** Mike, 2026-09-28, requirements interview. Mike approved the requirements on 2026-09-28 with the words: Approved.  
**Open questions:** None.

#### R-04 — Account Layout placement

**Status:** Finalized  
**Applies to:** The Account Layout page layout.  
**Required behavior:** Tier appears directly below Rating on Account Layout.  
**Boundaries and exceptions:** Other page layouts are outside this requirement.  
**Acceptance check:** Open an Account using Account Layout and confirm Tier appears directly below Rating.  
**Decision record:** Mike, 2026-09-28, requirements interview. Mike approved the requirements on 2026-09-28 with the words: Approved.  
**Open questions:** None.

### Acceptance

This work item can be accepted when:

1. Account has one manually set Tier picklist with Gold, Silver, and Bronze in that order, with Gold highest. Tier can be blank and has no default.
2. The field has a description and help text that explains Tier is set by hand and Gold is highest, followed by Silver, then Bronze.
3. Everyone who can see an Account can read Tier, and only users with the Sales Manager profile and system administrators can edit it.
4. Tier appears directly below Rating on Account Layout.
5. The owner reviews the tested result.

## Notes

### Decisions and context

- Mike approved Option A on 2026-09-28, including the exact description “Manually assigned account importance tier.” and help text “Set by hand. Gold is the highest tier, then Silver, then Bronze.”
- Mike directed that the Tier field go first and the access and Account Layout work become WI-002 under WI-001. WI-001 R-01 through R-04 and their approval remain in the parent; WI-002 covers R-03 and R-04.
- Agent-led delivery with one team inside this chat was accepted by Mike on 2026-09-28. It does not authorize merge, sandbox deployment, Salesforce Setup writes, or production changes.

### Resume here

Finished on 2026-09-28. Nothing to resume.

### Solution options and considerations

- The approved field is a restricted custom Account picklist. The access and Account Layout portions of Option A are assigned to WI-002.
