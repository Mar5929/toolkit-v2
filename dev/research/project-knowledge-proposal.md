# Proposal: keep complex project knowledge connected

Status: Proposal for Mike's review. No Toolkit V2 behavior in this document is approved or built.

## Problems to solve

- A workshop can affect several work items, but Toolkit V2 has no single record for a question that spans them.
- A transcript can be preserved without a final check that each useful finding reached the right maintained record.
- `PROJECT.md` lists key people, but a large project has no structured home for a person's role, decision authority, sources, and open questions.
- Proposed target architecture can remain scattered across work item designs. A new agent may not know which direction applies to a whole domain.
- A changed answer can update its work item and memory while leaving another work item, a requirement, or an architecture page out of date.
- A new agent has no domain map joining current behavior, target direction, questions, decisions, sources, and active work.

These are gaps in the current instructions and templates. They are not failures observed in an end-to-end test.

## Aim

Give a fresh agent a defined place to find and maintain project knowledge during a complex effort, such as merging two Salesforce orgs. Keep the existing work tracker, requirements, system guide, source storage, and memory as the authorities for their own information. Add only the records and procedures needed to connect information that crosses work items.

## Current and proposed future states

| Information | Current Toolkit V2 | Proposed future |
| --- | --- | --- |
| Meeting transcript | Saved as a work item source, or in `delivery/` for Salesforce client material. The work item names what was taken from it. | Preserve or link the source once. An intake record lists each maintained record created, updated, contradicted, or left open, and checks that findings were placed. |
| Requirement | A proposed requirement lives in a work item. Approved behavior that was verified as delivered moves to `requirements/` during Reflecting. | Keep those homes and lifecycle. Link a requirement to a project question, source, or architecture page when it depends on one. Do not create a competing requirements store. |
| Open question | A numbered Questions and Answers row belongs to one work item. Its answer updates that item's affected requirements and tasks. | Keep item questions there. Give a question that affects several items one project question record with an owner, source, status, and links to every affected record. Close it only after the answer has been incorporated. |
| Stakeholder | Key roles and owners appear in `PROJECT.md`; lasting context may enter memory after the applicable approval. | Keep `PROJECT.md` short. Add a project person record only when the detail matters: role, decision authority, source, last confirmation, and linked open questions. Do not store unnecessary personal details. |
| Architecture | The design for a change stays with its work item. `system-guide/` describes the verified current system. | Keep both. Add a maintained target architecture page for a domain when several items depend on it. Mark proposed, accepted, and superseded content clearly, and link the decisions that authorize changes. |
| Project status | Current State points to active items; each item holds its own next action. | Keep this brief. Use a domain map to find related records. Current State points to a project question only while it blocks active work. |
| Decision | An item decision is a Questions and Answers row. A decision needed beyond that item can also become an approved memory record. | Keep those authorities. Link project questions and architecture pages to the decision, and check affected records when it changes. |

## Example: Account ownership across an org merge

A discovery workshop finds that Org A and Org B assign Account owners differently. The answer will affect migration, security, and the target Account design.

**Current path.** The agent saves the transcript, adds a question to the active work item, and links it to that item's requirement. This works for that item. The agent must work out how to keep the other items and the target design aligned.

**Proposed path.** The agent preserves the transcript in the project's existing source location. It searches for an existing Account ownership question, then creates one project question, for example `PQ-014`, if none exists. The question states what must be decided, who can decide it, its source, its status, and the affected migration, security, and Account design records. The Accounts domain map links to it. When the client answers, the agent records the answer and updates or flags each affected record. It marks `PQ-014` incorporated only when those checks are complete. Current State points to it only while it blocks active work.

The workshop remains evidence. The project question holds the unresolved issue. Each requirement, work item, and architecture page retains its own authoritative content.

## Proposed Toolkit V2 changes

### 1. Add a small project knowledge layout

Use an opt-in set of project files for complex efforts. The first version needs:

```text
project-knowledge/
  README.md                 placement and status rules
  domains/
    accounts.md             short map of maintained records
  questions/
    PQ-014-account-ownership.md
  people/
    jane-smith.md           only when a detailed record is useful
  target-architecture/
    accounts.md             proposed or agreed target direction
  intake/
    2026-10-03-accounts-workshop.md
```

These are example names, not a required list of domains or people. Add a domain or person record when the work needs one. Do not copy source files, work item content, requirements, or memory into this folder. Existing client files stay in `delivery/` or `engagement/` as that project requires. Other sources stay where the current tracker and project rules place them. The intake record points to the source and the records it changed.

### 2. Give each new record a short form and lifecycle

- **Project question:** stable ID, exact question, status, decision owner, source, affected records, answer with date and authority, and incorporation checklist. Suggested statuses: open, awaiting answer, answered, incorporated, superseded. An agent may propose an answer; it may not turn a stakeholder claim into an owner-approved decision.
- **Person:** role in this project, areas of knowledge, decision authority, source and last confirmation, and linked questions. Keep `PROJECT.md` as the short ownership list. Follow the project's privacy rules.
- **Target architecture:** domain and scope, status (proposed, accepted, superseded), the current proposal, known gaps, evidence, decisions, and affected requirements and items. A work item design remains with its item.
- **Domain map:** one short page linking current system guide, target architecture, delivered requirements, open project questions, decisions, sources, and active items. It is a route to records, not a second copy of them. Avoid manually maintained counts that can go stale.
- **Intake record:** source location and date, findings by type, records created or changed, contradictions, items still awaiting confirmation, and a completion check. It is a processing receipt, not a second transcript.

### 3. Add one intake and maintenance procedure

Put the detailed steps in a skill or reference, with a short routing line in the model's `AGENTS.md`:

1. Preserve or link the original source before using it.
2. Search existing work items, requirements, system guide, memory, and project knowledge before creating a record.
3. Separate observed fact, stakeholder claim, proposal, requirement, question, and accepted decision. Record each in its existing authoritative home.
4. Link every material finding to its source and every affected record. Leave an unconfirmed claim marked as unconfirmed.
5. Record what was created, updated, contradicted, or left open in the intake record.
6. Read back the changed records and check that no extracted item exists only in the intake record.

Extend the current work item refinement procedure for sources that affect one item. Use the new procedure when a source affects several items or the project as a whole. Keep one source file; do not create a second work tracker or memory store.

### 4. Check the effects of changed answers

When a project question is answered or a decision changes, search its linked records and their references. Update each affected item, requirement, architecture page, domain map, and Current State line, or leave a named open conflict with a next action. Preserve the old answer and its source in the question's history. Do not mark the question incorporated merely because an answer was entered.

### 5. Update setup, routing, and examples

- Add the optional layout and templates to the `project-setup` model copy.
- Add the placement rule to the model's `AGENTS.md` and its project map. Keep the full procedure in a skill so the always-on guide stays short.
- Update the setup copy instructions so a new project receives the knowledge layout only when selected. Existing projects receive it through the normal "update the toolkit" review, without moving their files automatically.
- Add one worked Salesforce org-merge example showing intake, a project question, links to several items, an answer, and the incorporation check.
- Review new skill text for wording, overlap, and platform best practices, then test routing in Claude Code and Codex as this repository requires.

## Boundaries and decisions for design

- Toolkit V2 remains rules, skills, and the three existing small hook commands. This proposal does not request a new program, validator, or hook job. A new command or hook job needs Mike's prior approval with its size stated in plain numbers.
- The new layout is optional and must not replace the chosen work tracker, local or Notion memory, or Hindsight.
- Do not copy sensitive transcripts into Git merely to fill this layout. Link to the source in its approved location.
- A new skill, a changed model routing line, and changes to the meaning of model files require Mike's review under this repository's rules before implementation.
- During design, settle whether the first version needs all five record types or should begin with project questions, domain maps, and intake records. Do not add a record type solely to make the folder tree symmetrical.
- Define how an existing project's established locations are respected during an update. Do not create a parallel tree beside one it already uses.

## How to check the result

Test on a throwaway Salesforce project with two source orgs and one workshop transcript. The transcript should affect at least two work items and one target design. Start a fresh session after intake and ask the agent to find the current Account ownership issue, its source, decision owner, affected records, and next action. Then provide a changed answer and confirm that every affected record is updated or explicitly marked unresolved. Repeat the routing and intake check in both Claude Code and Codex. Use the repository's normal checks for any shipped file changes.

## Current Toolkit V2 references

- [`AGENTS.md` project map and placement table](../../plugins/toolkit/skills/project-setup/assets/model/AGENTS.md)
- [`PROJECT.md` people and work records](../../plugins/toolkit/skills/project-setup/assets/model/PROJECT.md)
- [Work item template](../../plugins/toolkit/skills/project-setup/assets/model/work-items/work-item-template/WORK-ITEM.md)
- [Requirements area instructions](../../plugins/toolkit/skills/project-setup/assets/model/requirements/AGENTS.md)
- [System guide area template](../../plugins/toolkit/skills/project-setup/assets/model/system-guide/AREA-TEMPLATE.md)
- [Source intake during requirements refinement](../../plugins/toolkit/skills/project-setup/assets/.shared-skills/managing-work-items/references/refining-requirements.md)
- [Reflecting step that updates project documents](../../plugins/toolkit/skills/project-setup/assets/.shared-skills/managing-work-items/references/reflecting.md)
- [Memory process](../../plugins/toolkit/skills/project-setup/assets/.skill-sets/memory-process/managing-project-memory/SKILL.md)
- [Current State template](../../plugins/toolkit/skills/project-setup/assets/model/memory/CURRENT_STATE.md)
- [Goal and finish list](../GOAL.md)

This proposal follows Mike's 2026-10-03 discussion in the referenced chat, *Firecrawl Research Update*, and the comparison of that discussion with the current repository. The conversation's folder names and record examples were illustrative; this proposal keeps Toolkit V2's existing authoritative homes.
