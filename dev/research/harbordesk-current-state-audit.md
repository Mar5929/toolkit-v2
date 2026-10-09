# Current project setup and the problems we are trying to solve

Date: 2026-10-04  
Related work item: TKV-24

This document explains the **HarborDesk sample project as it exists now** and the problems it exposes for Toolkit V2. HarborDesk is a fictional SaaS project used to review the filing system. Its people, workshop, work items, and decisions are examples. It already contains sample discovery work, so it does not show only what a brand-new project would contain immediately after setup.

HarborDesk is a preview: Toolkit V2's current `project-setup` source does not yet create this exact layout. The sample uses local Markdown work items and local memory. The same filing process must eventually work with Notion or GitHub work tracking and Notion or Hindsight memory.

## What the project currently contains

| Part | Current home | What it holds |
| --- | --- | --- |
| Project overview | `PROJECT.md` | Purpose, scope, people, systems, and setup choices. |
| Roadmap | `PROJECT-ROADMAP.md` | Project phases and main work items. |
| Work items | `work-items/` | Each item's status, questions and answers, tasks, history, and `DESIGN.md`. This folder is excluded from Git in the local-tracker setup. |
| Shared project records | `project-records/` | Sources, intake receipts, cross-item questions, domain maps, approved requirements, and current and planned system descriptions. |
| Memory | `memory/` | `CURRENT_STATE.md` for resuming work, selected decision and term notes, and a generated index. This folder is excluded from Git. |
| Tests and outside references | `tests/`, `ai-external-knowledge/` | Test-plan forms and external documentation. The sample has no application tests yet. |
| Agent instructions | Root and folder-level `AGENTS.md`, skills, rules, and hooks | Procedures for starting sessions, running work items, processing shared information, and saving memory. |
| Other local folders | `wiki/`, `inbox/`, and Obsidian files | A Claude-Obsidian experiment whose role alongside the main records is undecided. |

The shared records currently have this shape:

```text
project-records/
├── sources/              Workshop material used across the project
├── coordination/
│   ├── intake/           Where findings from a source were routed
│   ├── questions/        Questions and checks affecting several work items
│   ├── domains/          Maps linking records for one area
│   └── authority/        Detailed decision authority, when needed
├── requirements/         Approved future behavior
└── system/
    ├── current/          Verified behavior in an actual environment
    └── planned/          Proposed or approved intended direction
```

**WI-001 Shared Inbox** is still refining requirements. Its `DESIGN.md` compares technical approaches. **WI-002 Request Search** is in the backlog. No application has been built or deployed. The current-system file therefore does not claim the planned design is live.

The root `AGENTS.md` maps these homes. Other `AGENTS.md` files and skills give more specific filing rules. A human or fresh agent must read several of them to understand the entire route.

## Example: a workshop changes the workspace rule

In the fictional project, a workshop raised the possibility that support leads could see requests across workspaces. Later, WI-001 question Q-04 replaced that earlier answer: each request belongs to one workspace, and only its members may see it.

The sample records this in several places:

1. The workshop source is in `project-records/sources/`.
2. An intake receipt lists the findings and affected records.
3. WI-001 keeps both the earlier Q-01 and later Q-04, preserving the answer history.
4. A shared question checks effects across work items.
5. `project-records/requirements/` contains the approved future access rule, ACC-01.
6. `project-records/system/planned/` contains intended system direction.
7. A domain map and local memory note also point to the decision.

This preserves the correction and separates an approved future rule from verified live behavior. It also shows the main difficulty: a person asking **“What is the workspace rule now?”** sees several related records and must know which one answers that question.

## Problems we are trying to solve

### 1. An approved design has no clear lasting home

Suppose a Salesforce org merge has a work item called **Design the customer data model**. Kickoff and discovery workshops lead to a model. Mike considers the item done when the design is approved. Later migration and build items need to follow that model, and a future workshop may change it.

Today, the work-item procedure keeps `DESIGN.md` with the item and generally moves that same item into Building after approval. The sample also has a shared planned-system area. The packaged Toolkit model has `requirements/SYSTEM-DATA-MODEL.md`. These are competing answers to **where the approved, project-guiding data model lives**. A human may not know which version to open; an agent may copy the design or leave it in a closed item.

### 2. The current answer is repeated

The workspace boundary appears in WI-001's Q&A, an approved requirement, a planned-system statement, a shared question, a domain map, and memory. Each has a purpose, but the route to the authoritative current answer is not simple. If the rule changes again, the agent has to find each place and avoid leaving stale claims.

For example, the memory glossary still cites superseded WI-001 Q-01 as the source for a term marked current. The definition may be useful, but its cited answer is stale.

### 3. A source can move after it is filed

The current instruction puts a source used by one work item inside that item's `references/`. If another item later needs it, the agent gives it a shared home and updates old links. WI-001 has a kickoff summary inside its own folder, while the earlier workshop is under `project-records/sources/`.

Imagine a meeting initially affecting only the data-model item. Two weeks later, it also affects migration and reporting. Its source entry must move or be relinked just when more people need it. Mike has since chosen one stable entry or locator for every retained original, including a one-item source. The sample has not adopted that rule.

### 4. Discovery questions do not have a consistent route

During an org-merge workshop, someone asks which customer ID will be authoritative. That may be an unanswered question within the data-model design item, a cross-item question, or a separate investigation with its own result. Once answered, it may update the approved design. The sample has places for these records, but its procedures do not explain the boundary consistently.

It also says a project-wide owner decision without an item gets a decision work item. During early planning, that can create an item merely to hold an answer when the useful action is to update a project plan or design.

### 5. The folders are hard to understand at a glance

A workshop about workspace access can create a requirement, planned-system statement, shared question, intake receipt, and domain map. A human browsing in VS Code must learn the difference between `coordination/`, `requirements/`, `system/planned/`, and an item's `DESIGN.md` before finding the right record. The agent has detailed instructions, but it must assemble the full filing route from several files.

This matters in both Salesforce and SaaS projects. The subject changes; the mental model for finding an approved design, open question, source, or active work should stay consistent.

### 6. The setup view and worked example look similar

HarborDesk already has fictional people, a workshop, work items, approved sample statements, and memory notes. These help test the process, but can make it look as if a newly set-up client project would arrive with those records filled in. Mike wants setup to show a complete labeled structure, instructions, and forms **without invented client facts or pretend deliverables**.

### 7. Delivery is unclear for a non-Salesforce project

The SaaS sample has no `delivery/` folder. Its root instruction says to create one when a release, migration, deployment, or handoff output exists. A real SaaS project will have those outputs, but setup does not show their home. The packaged Toolkit model currently treats `delivery/` as Salesforce-only. HarborDesk has not shipped anything, so this is a filing question, not a missing release artifact.

### 8. Work and memory depend on the storage choice

HarborDesk's local `work-items/` and `memory/` folders are excluded from Git. A fresh clone would not contain WI-001, its design, Current State, or local decision notes. That is intentional for this setup, but an approved design shared across work items needs a dependable place that later agents and humans can find.

The same lifecycle must make sense when work items live in Notion or GitHub and memory lives in Notion or Hindsight. Those choices should change the storage route, not the meaning of a source, question, approved design, delivered change, or memory cue.

### 9. The Obsidian experiment adds another place to look

The working copy has `wiki/` and `inbox/` folders from a Claude-Obsidian experiment. The wiki index says no sources are indexed, while the project has a workshop source under `project-records/sources/`. It is unclear whether the wiki is an index, intake area, or another home for answers.

## What is already useful

- `PROJECT.md` gives a concise brief and records the tracker and memory choices.
- The roadmap shows the main sequence without copying every item task.
- WI-001 preserves the old answer and its correction. The approved future rule is separate from delivered behavior.
- Current State points to the next question so an agent can resume work.
- The sample provides realistic events for testing filing rules before changing Toolkit V2's setup.

The project setup we are working toward should let a person and an agent answer: **What is this information? Where is its current home? What evidence supports it? What work depends on it? What changes when a new answer arrives?**
