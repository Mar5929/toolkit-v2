---
id: WI-001
title: Finish Toolkit V2 setup
type: repository-maintenance
stage: 01-discovery
status: Cancelled
parent: none
waiting_on: "none"
priority: medium
delivery: not-offered
requirements_approved: "no"
design: none
result_approved: "no"
updated: 2026-09-27
---

# WI-001: Finish Toolkit V2 setup

<!-- Fill-in guide for a new local work item: create it with `toolkit work new`, which copies this folder, names the new folder, and sets the real ID in front matter and heading; keep the file name WORK-ITEM.md. Use stable phase, task, requirement, and question IDs for this item. In the front matter, keep one value from each list and change the fields with `toolkit work` commands; a blocked item has `waiting_on` set and its Blockers line filled, not a Blocked status. Replace every angle-bracket prompt with actual text in that same field, cell, or paragraph; do not leave the prompt in place. Keep the headings and field labels. Add or remove phase, task, question, and requirement examples to match the real work. Use the chosen tracker as the source of truth for status and links. Delete this guide after filling the item. -->

## Overview

**Goal:** Finish the Toolkit V2 setup started by `toolkit init` for `greet`.

**Current position:** Local setup guides and current focus were written. Doctor found no setup problems and two Codex trust warnings. Only the README and toolkit files exist.

**Next action:** None. Cancelled.

**Blockers:** Codex trust is an owner-only step; project outcome is unconfirmed.

**Related items:** No roadmap unit yet.

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
| --- | --- | --- | --- | --- |
| P1 — Local setup | Toolkit installation and known facts are checked | Complete | Guides checked and doctor run | None |
| P2 — Owner steps | Codex trust and missing project facts are supplied | Not Started | Doctor warnings resolved and guides completed | None |

## Tasks

### P1 — Local setup

- [x] **P1-T01 — Inspect installation** · Complete  
  **Work:** Run doctor and sync dry run; inspect the repository.  
  **Deliverable:** Setup findings.  
  **Done when:** Installation state and warnings are recorded.  
  **Depends on:** None.
- [x] **P1-T02 — Fill verified setup facts** · Complete  
  **Work:** Replace confirmed scaffold prompts and update current focus.  
  **Deliverable:** Project guides and briefing.  
  **Done when:** Known facts are recorded and checks run again.  
  **Depends on:** P1-T01.

### P2 — Owner steps

- [ ] **P2-T01 — Trust Codex setup** · Not Started  
  **Work:** Mike trusts this folder and the Toolkit V2 hooks in `/hooks`.  
  **Deliverable:** Codex loads project settings and hooks.  
  **Done when:** Doctor no longer reports trust warnings.  
  **Depends on:** P1 completion.
- [ ] **P2-T02 — Confirm project facts** · Not Started  
  **Work:** Mike confirms the intended outcome, scope, and first deliverable.  
  **Deliverable:** Confirmed project guides and roadmap.  
  **Done when:** Remaining setup prompts are replaced with sourced facts.  
  **Depends on:** P1 completion.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| 2026-09-27 | Cancelled: I did not ask for a work item for the setup itself, so cancel WI-001: I do not want the setup tracked as work. | Work stopped. |
| 2026-09-27 | Set waiting on owner. | Waits for the owner's answer (work-decide) before the step it blocks. |
| 2026-09-27 | Local setup checked: doctor has 0 problems and 2 Codex trust warnings; verified project facts and current focus were written. No Git remote is configured. |  |
| 2026-09-27 | Created. | Starts at 01 Discovery. Continue with work-requirements. |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
| --- | --- | --- | --- | --- |
| Q-01 | What should `greet` do for its users beyond the README description? | P2-T02 | Open | owner |
| Q-02 | Where should local tracker and memory backups be stored? | P2-T02 | Open | owner |

## Requirements

**Overall status:** Refining  
**Finalization rule:** No product behavior is approved in this setup item.

### Starting request

I ran that toolkit init command in my terminal and it worked. Finish setting up Toolkit V2.

### Agreed goal

Finish the setup started by `toolkit init` using confirmed project facts.

### Active requirements

#### R-01 — Working local setup

**Status:** Refining  
**Applies to:** This repository and its Toolkit V2 configuration.  
**Required behavior:** Toolkit commands can read the configured local tracker and memory.  
**Boundaries and exceptions:** Mike must trust the Codex folder and hooks.  
**Acceptance check:** Doctor reports no setup problems and briefing shows the project state.  
**Decision record:** Mike's request, 2026-09-27.  
**Open questions:** Q-01, Q-02.

### Acceptance

This item can be accepted when Toolkit V2 checks pass, the owner-only trust steps are complete, and the guides have confirmed project facts.

## Notes

### Decisions and context

- `README.md` calls `greet` a tiny Node.js command-line tool that greets people. No application files or package manifest are present.
- The repository has no remote. Toolkit setup files are untracked, so no setup commit can be published yet.

### Resume here

Check `toolkit doctor` and `toolkit brief`; then continue P2 with Mike's trust steps and confirmed project facts. Template prompts are not accepted requirements.

### Solution options and considerations

- Keep prompts for facts the owner has not confirmed until he supplies them.
