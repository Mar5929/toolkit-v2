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
requirements_approved: "2026-09-28 by Mike Rihm"
design: approved
result_approved: "2026-09-28 by Mike Rihm"
updated: 2026-09-28
---

# WI-001: Add a Tier picklist field to Account

## Overview

**Goal:** Let the Acme sales team rank Accounts using a Tier field.

**Current position:** Done on 2026-09-28. Owner reported production field deployment Succeeded, job 0AfFAKE000DEPLOY3; Tier blank by default, Gold/Silver/Bronze in order, and Sales Manager saved Gold. WI-002 is Done. Release records committed on main at 0f57d07.

**Next action:** None. Finished.

**Blockers:** None.

**Related items:** Sub-item WI-002 delivered R-03 and R-04 and was finished separately.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — Tier field | Create the Account Tier field with approved values and field text. | Done | Owner reported production deployment Succeeded and checked blank default, choice order, and Gold save; sandbox checks covered field text and other saves. | None. |
| P2 — Access and page layout | Configure field access and show Tier below Rating. | Done | WI-002 production layout and permissions were reported working by Mike Rihm. | WI-002 |

## Tasks

### P1 — Tier field

- [x] **P1-T01 — Build Tier field** · Done  
  **Work:** Create Account.Tier__c with the approved values, settings, description, and help text.  
  **Deliverable:** Tier field metadata and its narrow WI-001 deployment package, committed as 8e95727.  
  **Done when:** R-01/R-02 metadata checks passed: optional restricted picklist, Gold/Silver/Bronze order, no default, description and help text; sandbox check-only validation succeeded as job 0AfFAKE000VALID3.  
  **Depends on:** WI-002 access and page inventory gate, completed 2026-09-28.

### P2 — Access and page layout

- [x] **P2-T01 — Complete WI-002** · Done  
  **Work:** Complete the access and Account page layout sub-item.  
  **Deliverable:** WI-002 result and its own approval.  
  **Done when:** WI-002 is finished.  
  **Depends on:** P1 field build.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-28 | Finished. Result approved earlier (2026-09-28 by Mike Rihm); marked Done by Mike Rihm. | Evidence: Owner reported production field deployment Succeeded, job 0AfFAKE000DEPLOY3; Tier blank by default, Gold/Silver/Bronze in order, and Sales Manager saved Gold. WI-002 is Done. Release records committed on main at 0f57d07. |
| 2026-09-28 | Production deployment result recorded from Mike Rihm; WI-002 is Done; requirements, system guide, and release records committed on main at 0f57d07. | WI-001 is ready to finish. |
| 2026-09-28 | Set stage 13 Deployment -> 14 Specification update (status In Review). | Continue with work-decide. |
| 2026-09-28 | Owner said: "Step 10 snapshot saved. Both production deploys said Succeeded (job 0AfFAKE000DEPLOY3 for each)." | WI-001 production field deployment succeeded by owner report; record the release evidence and continue closeout. |
| 2026-09-28 | Production preflight on 2026-09-28: Account describe and FieldDefinition query found no Tier__c; the narrow field package contains only Account.Tier__c. Owner-run steps are in the Account Tier cutover plan committed as c4690fa. | Await Mike Rihm production deploy result and checks; production flag remains No. |
| 2026-09-28 | Set stage 12 Pull request and push -> 13 Deployment (status In Review). | Continue with work-finish. |
| 2026-09-28 | Owner approved merging both branches into main on 2026-09-28. No remote: WI-001 merged locally into main at f006a90. | No pull request; production deployment remains owner-run. |
| 2026-09-28 | Set stage 11 User approval -> 12 Pull request and push (status In Review). | Continue with work-finish. |
| 2026-09-28 | Result approved by Mike Rihm. | The result can be shipped and finished (work-finish). No longer waiting on the owner. |
| 2026-09-28 | Owner said: Yes, I approve the WI-001 result. | Result approved; work-finish continues. |
| 2026-09-28 | Set stage 09 Testing -> 11 User approval (status In Progress); waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-28 | Checked R-01 and R-02 against f2c7b61; evidence: tests/WI-001-TEST-PLAN.md, field metadata, owner-reported sandbox checks, and independent checker; gaps: direct sandbox checks were not repeated by the checker. | Ready for separate WI-001 result approval after WI-002 review. |
| 2026-09-28 | Set stage 08 Build -> 09 Testing (status In Progress). | Continue with work-check. |
| 2026-09-28 | Owner said: "On a new Account, Tier starts blank and the list shows Gold, Silver, Bronze in that order." | Q-05 answered; recheck R-01 final acceptance. |
| 2026-09-28 | Checked R-01 and R-02 against field source and Mike Rihm’s sandbox report; independent checker found R-02 met and R-01 partly met. | WI-001 test plan records the evidence; new Account blank/default state and rendered choice order still need observation. |
| 2026-09-28 | Owner said: "I also saved Bronze and then blank as a Sales Manager, both worked, the API rejected a made-up value Platinum, and the help text shows when I hover. For context, the reps usually give Gold to accounts over about one million dollars a year in revenue, but it’s their call." | Additional R-01 and R-02 behavior evidence supplied; the revenue guideline is advisory context, not an approved rule. |
| 2026-09-28 | Owner said: "Dana Lee is the sales manager who asked for this field, and she will be the one who checks the tiers every Monday." | Dana Lee recorded as the ongoing Tier reviewer in PROJECT.md and WI-001 context. |
| 2026-09-28 | Owner reported both ordered sandbox deploys Succeeded on 2026-09-28; Account describe found optional restricted Tier picklist with Gold/Silver/Bronze and no default. | R-01 Account save behavior and R-02 deployed description remain to be checked; WI-002 access and page checks continue. |
| 2026-09-28 | Built and committed Account.Tier__c and its narrow package; static checks and sandbox check-only validation passed. | Field build is ready for owner-run sandbox deployment; WI-002 access and page work remains. |
| 2026-09-28 | Set stage 07 Tracking setup -> 08 Build (status In Progress). | Continue with work-on. |
| 2026-09-28 | Set stage 06 Implementation plan -> 07 Tracking setup (status In Progress). | Continue with work-on. |
| 2026-09-28 | Moved by hand: .work-items/WI-001-add-a-tier-picklist-field-to-account/WORK-ITEM.md -> .work-items/account-tier/WI-001-tier-field/WORK-ITEM.md. | It is still a top-level item. Group: account-tier. |
| 2026-09-28 | Design text changed after approval: added selected-design headings and clarified the owner-requested WI-001/WI-002 responsibility split; no change to Option A components or behavior. | The approved design remains Option A; the split assigns access and page work to WI-002. |
| 2026-09-28 | Set stage 05 Breakdown -> 06 Implementation plan (status In Progress). | Continue with work-on. |
| 2026-09-28 | Sub-item WI-002 created: Configure Account Tier access and page layout. | WI-002 delivers R-03, R-04. Those requirements stay here, unchanged and approved. |
| 2026-09-28 | Set stage 04 Solution design -> 05 Breakdown (status In Progress). | Continue with work-organize. |
| 2026-09-28 | Design approved by Mike Rihm. | The design can be built. No longer waiting on the owner. |
| 2026-09-28 | Owner said: Yes, I approve Option A. Then split it: make the access and page layout part its own sub-item under WI-001, so WI-001 is just the field itself. | Option A approved; split implementation ownership so WI-001 directly builds the field and a child handles access and page layout. |
| 2026-09-28 | Design proposed: Option A uses a restricted Account Tier picklist, Account Layout placement, and manual profile field permissions, subject to an effective-access and assigned-page design gate before build. | Mike Rihm decides whether to approve Option A. No metadata has been built or deployed. |
| 2026-09-28 | Design updated (status proposed). | The owner approves it before building starts. |
| 2026-09-28 | Agent-led delivery accepted by Mike Rihm: "Yes, you drive it, with me as product owner. A team of helpers inside this chat is fine." | The team will complete the proposed design and bring it to Mike for approval before the build. |
| 2026-09-28 | Set delivery agent-led. Q-04 answered. No longer waiting on the owner. | Continue with solution-design. |
| 2026-09-28 | Design created (proposed). | The owner approves it before building starts. |
| 2026-09-28 | Set stage 03 Requirements approved -> 04 Solution design (status In Progress). | Continue with solution-design. |
| 2026-09-28 | Requirements approved by Mike Rihm. | Stage 03 Requirements approved (status Ready). No longer waiting on the owner. Continue with solution-design. |
| 2026-09-28 | Owner said: Approved. | Requirements approved. |
| 2026-09-28 | Owner said: "Assigning the tier is enough for this item. No list view or report now." | Q-03 answered; R-01 and acceptance limited to Tier assignment; requirements review continues. |
| 2026-09-28 | Owner said: "No, it can be blank, with no default value. Only the Sales Manager profile and system administrators can edit it; everyone else who can see Accounts can read it. Put it on the Account page layout right below Rating." | Tier is optional with no default; access and page placement requirements added to refinement. |
| 2026-09-28 | Owner said: "Yes, that’s the goal. The values are Gold, Silver, and Bronze, in that order. Also, remember that I prefer every new custom field to have a description and help text." | Goal confirmed; Tier values and field text requirement enter refinement. |
| 2026-09-28 | Set stage 01 Discovery -> 02 Refinement (status Backlog). | Continue with work-requirements. |
| 2026-09-28 | Created. | Starts at 01 Discovery. Continue with work-requirements. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | Is the goal for the sales team to assign each Account a Tier and use that Tier to rank accounts? Answer: Yes, confirmed by the owner on 2026-09-28. | Agreed goal, R-01 | Answered | owner |
| Q-02 | Must every Account have a Tier before it can be saved? Answer: No. Tier can be blank and has no default value, confirmed by the owner on 2026-09-28. | R-01 | Answered | owner |
| Q-03 | Is assigning each Account a Tier enough for ranking, or should the team also see Accounts ordered by Tier in a list or report? Answer: Assigning Tier is enough for this item. No list view or report now, confirmed by the owner on 2026-09-28. | R-01 | Answered | owner |
| Q-04 | Would you like agents to take responsibility for delivering this, with you acting as product owner? | delivery | Answered | owner |
| Q-05 | On a new Account, does Tier start blank, and are its choices displayed Gold, Silver, Bronze in that order? Answer: Mike Rihm confirmed on 2026-09-28 that a new Account starts with Tier blank and the list shows Gold, Silver, Bronze in that order. | R-01 final acceptance | Answered | owner |

## Requirements

**Overall status:** Finalized  
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

New work: add a Tier picklist field to Account so the sales team can rank their accounts.

### Agreed goal

The Acme sales team can assign each Account a Tier and use that Tier to rank accounts.

### Active requirements

#### R-01 — Assign Account Tiers

**Status:** Finalized  
**Applies to:** Accounts ranked by the Acme sales team.  
**Required behavior:** An Account can have a Tier of Gold, Silver, or Bronze. The Tier choices appear in Gold, Silver, Bronze order. Assigning a Tier is enough for this item.  
**Boundaries and exceptions:** Tier can be blank and has no default value. This item does not require a list view or report ordered by Tier.  
**Acceptance check:** On an Account, an authorized editor can choose Gold, Silver, or Bronze, or leave Tier blank; a new Account has no Tier preselected. The choices appear in Gold, Silver, Bronze order, and the chosen Tier is saved on the Account.  
**Decision record:** Owner confirmed the goal and values on 2026-09-28, said Tier can be blank with no default on 2026-09-28, and confirmed Tier assignment alone is enough for this item on 2026-09-28. Approved by Mike Rihm on 2026-09-28.  
**Open questions:** None.

#### R-02 — Explain the Tier field

**Status:** Finalized  
**Applies to:** The new custom Tier field on Account.  
**Required behavior:** The field has a description and help text.  
**Boundaries and exceptions:** Exact wording is not yet decided.  
**Acceptance check:** The field has a description and help text.  
**Decision record:** Owner stated the standing preference on 2026-09-28. Approved by Mike Rihm on 2026-09-28.  
**Open questions:** None.

#### R-03 — Control who can edit Tier

**Status:** Finalized  
**Applies to:** People who can see Accounts.  
**Required behavior:** People with the Sales Manager profile and system administrators can read and edit Tier. Everyone else who can see Accounts can read Tier but cannot edit it.  
**Boundaries and exceptions:** This requirement does not grant Account access to anyone who lacks it.  
**Acceptance check:** A Sales Manager and a system administrator can change Tier on an Account; another person who can see that Account can see Tier but cannot change it.  
**Decision record:** Owner specified access on 2026-09-28. Approved by Mike Rihm on 2026-09-28.  
**Open questions:** None.

#### R-04 — Show Tier on the Account page layout

**Status:** Finalized  
**Applies to:** The Account page layout.  
**Required behavior:** Tier appears directly below Rating.  
**Boundaries and exceptions:** None stated.  
**Acceptance check:** Open an Account using the Account page layout and see Tier directly below Rating.  
**Decision record:** Owner specified the placement on 2026-09-28. Approved by Mike Rihm on 2026-09-28.  
**Open questions:** None.

### Acceptance

This work item can be accepted when:

1. An authorized editor can choose Gold, Silver, or Bronze for an Account, or leave Tier blank; a new Account has no Tier preselected (R-01).
2. The Tier choices appear in Gold, Silver, Bronze order and the chosen Tier is saved on the Account (R-01).
3. The Tier field has a description and help text (R-02).
4. A Sales Manager and a system administrator can edit Tier, while other people who can see an Account can read Tier but cannot edit it (R-03).
5. Tier appears directly below Rating on the Account page layout (R-04).
6. The owner reviews the result.

## Notes

### Decisions and context

- **Agent-led delivery (WI-001 goal: add a Tier picklist field to Account):** accepted by Mike Rihm on 2026-09-28 ("Yes, you drive it, with me as product owner. A team of helpers inside this chat is fine."). Team: one team of helpers inside this chat. Archive answer: not asked. Limits: design and result approval, merge, deployment, spending, and publishing remain owner decisions. Lead: this chat.
- **Design approach:** Scan and research first because R-01 through R-04 are approved and the remaining unknowns are Salesforce configuration details. Use built-in Salesforce configuration and one proposed option, unless research reveals a material owner choice. Team: one requirements analyst, one design architect, one design critic; the lead checks Salesforce documentation and org metadata. The first pass has three helper runs.
- **Tier assignment guidance:** Mike Rihm said on 2026-09-28 that reps usually give Gold to Accounts with about $1 million a year in revenue, but the choice is theirs. This is context, not a validation rule, default, or automatic assignment.

### Resume here

Finished on 2026-09-28. Nothing to resume.

### Solution options and considerations

These are possibilities to evaluate, **not approved requirements or design decisions**.

- **For R-01:** <Possible approach and the tradeoff or question it raises.>
- **For R-02:** <Another option, constraint, or design consideration to investigate.>
