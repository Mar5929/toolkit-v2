// Where new WORK-ITEM.md and DESIGN.md files come from.
//
// Order of preference (ARCHITECTURE 4.3 "Templates"):
//   1. the project's copy: <main checkout>/.work-items/work-item-template/<file>
//   2. the plugin's copy: <plugin root>/templates/<file>
//   3. the copy built into this file (the model project's approved template
//      with the ARCHITECTURE 4.2 frontmatter), used only when neither exists.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const TEMPLATE_FOLDER = 'work-item-template';
export const RECORD_FILE = 'WORK-ITEM.md';
export const DESIGN_FILE = 'DESIGN.md';

// A Markdown hard line break (two trailing spaces), kept visible here so editors do not strip it.
const HB = '  ';

const PLUGIN_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export const BUILTIN_WORK_ITEM = `---
id: WI-001
title: <Work item title>
type: <discovery | solution-design | build | data-load | repository-maintenance | research | task | bug | enhancement>
stage: <01-discovery ... 14-spec-update>
status: <Backlog | Ready | In Progress | In Review | Done | Cancelled>
parent: <WI-id | none>
waiting_on: <owner | agent | external: who | none>
priority: <urgent | high | medium | low>
delivery: <agent-led | owner-led | not-offered>
requirements_approved: <YYYY-MM-DD by <name> | no>
design: <proposed | approved | superseded | none>
result_approved: <YYYY-MM-DD by <name> | no>
updated: <YYYY-MM-DD>
---

# WI-001: <Work item title>

## Overview

**Goal:** <The outcome this work item is meant to achieve.>

**Current position:** <What has been completed and where work stands now.>

**Next action:** <The next specific action and its owner.>

**Blockers:** <Blocking decision or dependency, or “None.”>

**Related items:** <Roadmap unit, parent and related work item IDs (never folder paths), or external links.>

## Roadmap

A phase is complete when its tasks are complete and its exit result has been checked.

| Phase | Outcome | Status | Exit result | Sub-items |
|---|---|---|---|---|
| P1 — <Phase 1 name> | <What this phase establishes> | In Progress | <Evidence that P1 is complete> | <WI-ids or “None.”> |
| P2 — <Phase 2 name> | <What this phase delivers> | Not Started | <Evidence that P2 is complete> | <WI-ids or “None.”> |

## Tasks

### P1 — <Phase 1 name>

- [ ] **P1-T01 — <Task 1 name>** · In Progress${HB}
  **Work:** <The action to take.>${HB}
  **Deliverable:** <The file, decision, or other result.>${HB}
  **Done when:** <The observable completion check.>${HB}
  **Depends on:** <Task ID or “None.”>
- [ ] **P1-T02 — <Task 2 name>** · Not Started${HB}
  **Work:** <The action to take.>${HB}
  **Deliverable:** <The expected result.>${HB}
  **Done when:** <The observable completion check.>${HB}
  **Depends on:** P1-T01.

### P2 — <Phase 2 name>

- [ ] **P2-T01 — <Task 1 name>** · Not Started${HB}
  **Work:** <The action to take.>${HB}
  **Deliverable:** <The expected result.>${HB}
  **Done when:** <The observable completion check.>${HB}
  **Depends on:** P1 completion.

## Recent History

| Date | Change or decision | Effect on the work |
|---|---|---|
| <YYYY-MM-DD> | <What happened> | <What changed or what happens next> |

## Open Questions

| ID | Question | Affects | Status | Decision needed from |
|---|---|---|---|---|
| Q-01 | <Specific unanswered question> | R-01, P1-T02 | Open | <owner, or another person or role> |

## Requirements

**Overall status:** Refining${HB}
**Finalization rule:** Mark the overall requirements Finalized only when the agreed goal, every active requirement, and acceptance have been reviewed and approved by the owner. Record who approved them and when.

### Starting request

<The owner’s original request, in their words or a faithful short summary.>

### Agreed goal

<The outcome the owner has agreed this work item should deliver.>

### Active requirements

#### R-01 — <Required outcome>

**Status:** <Refining | Finalized | Superseded>${HB}
**Applies to:** <Who or what is affected, and when this requirement applies.>${HB}
**Required behavior:** <Exactly what must happen or be true.>${HB}
**Boundaries and exceptions:** <Where the requirement does not apply, or “None identified.”>${HB}
**Acceptance check:** <What someone can observe to confirm this requirement is met.>${HB}
**Decision record:** <Source of the requirement; if Finalized, who approved it and when. If Superseded, link to its replacement.>${HB}
**Open questions:** <Question IDs or “None.”>

#### R-02 — <Required outcome>

**Status:** <Refining | Finalized | Superseded>${HB}
**Applies to:** <Who or what is affected, and when.>${HB}
**Required behavior:** <Exactly what must happen or be true.>${HB}
**Boundaries and exceptions:** <Exceptions or “None identified.”>${HB}
**Acceptance check:** <Observable proof.>${HB}
**Decision record:** <Source and approval details.>${HB}
**Open questions:** <Question IDs or “None.”>

### Acceptance

This work item can be accepted when:

1. <Overall result that must be delivered.>
2. <How the completed result will be checked.>
3. <Any required documentation, handoff, or owner review.>

## Notes

### Decisions and context

- <Useful decision or context that is not itself a requirement.>

### Resume here

<Where the next person or session should pick up.>

### Solution options and considerations

These are possibilities to evaluate, **not approved requirements or design decisions**.

- **For R-01:** <Possible approach and the tradeoff or question it raises.>
- **For R-02:** <Another option, constraint, or design consideration to investigate.>
`;

export const BUILTIN_DESIGN = `---
work_item: WI-001
status: proposed
approved: no
---

# WI-001: <Work item title> — solution design

Status: proposed${HB}
Requirements: WI-001${HB}
Date: <YYYY-MM-DD>

## What this solves

<Who uses the result, what they are trying to do, and what must be true when it is done. Link to the agreed goal rather than repeating every requirement.>

## What exists today

<For an existing build, describe verified current behavior in this area, link to the relevant files or configuration, and say where it falls short. For a new project, state that nothing exists yet.>

## Design philosophy

<State the owner’s chosen approach: use built-in mechanisms first when they meet the requirements, or explain the chosen specialized approach.>

## Preparation

- **Requirements readiness:** <Whether the requirements are ready to design from; remaining gaps or owner rulings; links to the corrected requirements. Do not use design text to fill a requirements gap.>
- **Way of working:** <Interview or scan first; how many options will be designed and what differs between them.>
- **Team:** <Agreed roles, models, scope, and expected returns, if helpers are used.>
- **Constraints:** <Applicable project, platform, timing, and approval boundaries.>

<Keep settled preparation here. Put unresolved discussion, decisions needing context, and the exact next action in Notes.>

## Option A: <Short name>

### Summary

<In three to five plain-language sentences, explain the proposed approach and why it fits the agreed goal.>

### How each requirement is met

#### R-01 — <Requirement heading from WORK-ITEM.md>

- **Build or reuse:** <Exact component, setting, or mechanism and whether it is new, changed, or reused.>
- **Why this satisfies it:** <Explain how the approach produces the required behavior.>
- **How to check it:** <Test or observation that proves this requirement works.>

#### R-02 — <Requirement heading from WORK-ITEM.md>

- **Build or reuse:** <Exact component, setting, or mechanism and whether it is new, changed, or reused.>
- **Why this satisfies it:** <Explain how the approach produces the required behavior.>
- **How to check it:** <Test or observation that proves this requirement works.>

### What the person experiences, start to finish

1. <First step in the experience.>
2. <Next step, including what happens if the action fails or cannot proceed.>
3. <Final result and what the person sees or receives.>

### Components and files touched

| Component or file | New, changed, or reused | What changes |
| --- | --- | --- |
| <Real component or file name> | <New / Changed / Reused> | <Specific responsibility or change> |

### Order of work

1. <First thing to build and why it comes first.>
2. <Next thing to build and how it depends on the first.>

### Risks and tradeoffs

- <Risk, how likely it is, what it would cost, and what reduces it.>
- <Tradeoff the owner should understand before choosing this option.>

### Sources

| Claim in this design | Source | Date | Label | Verified how |
| --- | --- | --- | --- | --- |
| <Claim that affects the design> | <Exact link or project path> | <YYYY-MM-DD> | <Official documentation / Project evidence / Community claim> | <How the claim was checked> |

<Use verified sources. A community claim is not treated as fact until checked against official documentation, project evidence, or a test.>

<!-- If the owner wants several options, add Option B, Option C, and so on as top-level sections, each with the same inner headings. Keep all options in this one design file. -->

## Where a builder could misread the requirements

| Requirement | Wrong reading | Intended reading, and what this design does |
| --- | --- | --- |
| R-01 | <Plausible but incorrect interpretation> | <Correct interpretation and the design choice that makes it clear> |

<!-- Include Recommendation only when there is more than one option. -->

## Recommendation

<If there is more than one option, state which one is recommended, why, and what the owner gives up by choosing it. Remove this section for a single-option design.>

<!-- Include this section only for an existing build. -->

## Should the existing build be replaced?

<Yes or no, and why. If yes, explain the cost of a rewrite and why extending the current build serves the requirements worse. Remove this section for a new project.>

## Notes

- **Decisions:** <Relevant choice, proposed or approved status, who decided and when if known, and source. Link to the settled design text.>
- **Still open:** <Unanswered questions, unresolved review findings, and remaining design-document tasks. For each, record who must answer or act, its status, what it affects, and the next step.>
- **Resume here:** <Exact section or question and the next action.>

<Update settled answers in the design above. Saving this draft does not approve the design or authorize implementation.>
`;

function readIfFile(p) {
  try {
    if (fs.statSync(p).isFile()) return fs.readFileSync(p, 'utf8');
  } catch {
    // Missing.
  }
  return null;
}

/**
 * The template text for a file name ('WORK-ITEM.md' or 'DESIGN.md') and where it came from.
 * @param {string} name RECORD_FILE or DESIGN_FILE
 * @param {{ trackerDir?: string, pluginRoot?: string }} where
 * @returns {{ text: string, source: 'project'|'plugin'|'built-in', path: string|null }}
 */
export function loadTemplate(name, { trackerDir, pluginRoot = PLUGIN_ROOT } = {}) {
  if (trackerDir) {
    const p = path.join(trackerDir, TEMPLATE_FOLDER, name);
    const text = readIfFile(p);
    if (text !== null) return { text, source: 'project', path: p };
  }
  if (pluginRoot) {
    const p = path.join(pluginRoot, 'templates', name);
    const text = readIfFile(p);
    if (text !== null) return { text, source: 'plugin', path: p };
  }
  return { text: name === DESIGN_FILE ? BUILTIN_DESIGN : BUILTIN_WORK_ITEM, source: 'built-in', path: null };
}
