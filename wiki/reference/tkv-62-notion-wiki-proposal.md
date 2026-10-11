# Notion Project Wiki proposal for TKV-62

This proposal aligns Toolkit’s delivered Notion memory procedures with the Project Wiki Mike already built in his Notion Project template. It covers setup, everyday capture, librarian filing, work-item completion and handoff. Mike requested an interview and a reviewed solution before implementation. The choices below remain proposals unless identified as confirmed.

## Confirmed direction

The new Project Wiki replaces the existing Notion memory setup Toolkit ships. Coding agents capture information in Wiki Inbox. A librarian reconciles captures into Current state, Long-Term Memory, Terminology Glossary and Product Wiki. Daily processing and on-demand passes are confirmed. Each project’s setup selects a supported scheduler with the owner, based on the available host and tools.

The librarian owns unresolved captures. Dismissed records retain a reason. Routine processing creates no owner review queue or routine reports. Consequential unresolved owner decisions that affect active work may still need a question.

Product Wiki owns the living source-of-truth documentation. Mike described promotion of major finalized decisions, shipped behavior and finalized architecture into that documentation. Working designs, including system-wide architecture, live in the work item’s Solution Design until finalized. Later architecture changes go through another work item and update the existing wiki documentation when finalized. Local working files may support the work item. Documentation approval and implementation status remain separate, so finalized architecture does not imply that it has shipped.

Notion Terminology Glossary owns finalized project terms and aliases instead of system/glossary.md. Tentative terms remain part of working records until their meaning is established.

At work-item completion, coding agents automatically capture supported information and the librarian files it without another promotion approval. Existing approval evidence remains attached. Filing does not approve a new rule, an unresolved decision or an unverified implementation claim.

Finalized product decisions and their rationale live with the relevant Product Wiki documentation. Other lasting project decisions and lessons go to Long-Term Memory. Work-item links and supersession history preserve the evidence; a duplicate local DECISIONS.md ledger is not maintained for this Notion model.

Coding-agent instructions must be as short as useful, using judgment. The librarian skill has a main SKILL.md operation sequence with references loaded for the current operation. Project-setup documents follow the document clarity standard and toolkit-wiki specifications. Conflicting old guidance must be reconciled. The whole resulting workflow needs independent review after implementation.

The coding-agent skill also gives an explicit retrieval sequence and routes to destination references. Each reference explains that destination’s structure and how to find and read its information. Plain-English steps describe operations without prescribing the agent’s reasoning.

For any existing project, propose a review and migration batch. This is one setup instruction that uses the existing migration guidance, not a new scripted workflow. This change adds no scripts.

Sources: [Project template](https://app.notion.com/p/3ecb381da1768066bfbcfda341a2826d), [Project Wiki](https://app.notion.com/p/3f6b381da176807585fcf70562d08b25), and [TKV-62](https://app.notion.com/p/3f5b381da17680408760f1c64c34c799). Live pages and destination schemas were inspected on October 11, 2026. Protocol text currently on Project Wiki is placeholder text, not accepted policy.

## Proposed responsibilities

| Component | Proposed responsibility |
| --- | --- |
| Coding agent | Read relevant current records and pending captures; maintain work items; capture useful changes with sources and existing approval evidence; verify captures. |
| Managing project memory skill | Give the coding agent a short Notion-specific read/capture procedure and route on-demand reconciliation. Keep detailed destination schemas out of ordinary capture instructions. |
| Librarian skill | Search existing records, inspect the applicable live schemas, reconcile evidence, maintain metadata and history, verify writes and record inbox outcomes. |
| Work tracker | Own requirements, tasks, work status, approvals and delivery evidence for each work item. |
| Current state | Provide a derived view of active work and resumption context. The tracker remains authoritative for work status. |
| Long-Term Memory | Keep qualifying durable context and useful pointers without duplicating documentation owned elsewhere. |
| Terminology Glossary | Own finalized project meanings, aliases and naming history. |
| Product Wiki | Own living source-of-truth documentation promoted from finalized decisions, finalized architecture and shipped work. Preserve the distinction between documentation approval and verified implementation. |
| Harness files | Keep executable instructions for agent behavior; wiki filing alone does not authorize changes to those instructions. |

The local and Hindsight memory choices retain their procedures. Common criteria can remain shared, but the Notion operational procedure must stop inheriting local direct-write responsibilities.

## Proposed retrieval procedure

1. Read the project’s configured Notion links and identifiers. Use the routing table to choose the relevant destination for the requested information.
2. Open that destination’s reference for its structure, fields and search procedure. Search within the configured project and read the matching records and relevant linked sources.
3. When recent changes may affect the answer, check relevant pending Wiki Inbox captures and current work records. Request an on-demand librarian pass when the task needs reconciled documentation.
4. Check source dates, supersession, documentation approval and implementation evidence as applicable. Treat unfiled captures and unresolved claims according to their evidence, not as finalized wiki content.
5. Cite the records used. Before reporting that nothing is recorded, search the other relevant destinations and linked work items.

| Requested information | Destination and focused reference |
| --- | --- |
| Current priorities, blockers and resumption context | Current state; a reference explains this short-term memory page and its relationship to current work records. |
| Lasting context, non-product decisions and lessons | Long-Term Memory; a reference explains the existing collections, their relationships, metadata and retrieval. |
| Finalized product behavior, architecture and product decisions | Product Wiki; a reference explains its categories, approval and implementation fields, and linked evidence. |
| Established meanings, aliases and naming history | Terminology Glossary; a reference explains contextual term lookup and retired or changed terms. |
| Active requirements, working designs, tasks and approval history | The configured work tracker; managing-work-items owns its detailed retrieval procedure. |
| Recent captures not yet filed | Wiki Inbox; a reference explains searching captures, reading evidence and interpreting processing status. |

Project Wiki is the parent navigation page containing these destinations. The skill uses that distinction so an agent can navigate the whole wiki and then search the relevant destination. Destination references load only when the operation needs them; the coding agent does not read every collection or the full librarian manual on every question.

## Proposed capture and filing flow

1. During work, the coding agent captures useful new information and corrections with source dates, links and evidence. Capture is a submission for reconciliation; it does not establish truth or approval.
2. At reflection or closure, the agent checks that reusable outcomes were captured. It links approved decisions, verified changes, terms and lessons rather than copying the full ticket or duplicating existing captures.
3. The librarian reconciles captures against existing destinations and authoritative evidence. It updates matching records, preserves supersession links and verifies each destination before marking a capture Filed.
4. When only some filing succeeds, the librarian retains completed links and resumes missing work. Processing status is a coordination signal, not a guaranteed lock; the scheduling design must prevent overlapping writers.
5. When later work depends on new information, the agent reads relevant pending captures and current sources or requests an on-demand pass. Daily filing cannot guarantee that Current state reflects every change immediately.

Work items may close after useful outcomes have been captured and verified in Wiki Inbox. Librarian filing may finish later. Run an on-demand pass when subsequent work needs reconciled information. The Moved up field must accurately distinguish pending capture from verified publication; closure does not claim that filing has completed.

## Operating details proposed for agreement

The initial scope remains projects choosing Notion memory, as Mike specified. Other memory choices retain their procedures.

When the owner asks for a correction or forgetting, run the librarian operation on demand and verify the result before reporting completion. Preserve supersession history for ordinary replacements; follow an explicit forgetting request without retaining the unwanted content in another destination.

During setup, verify the chosen scheduler’s access and ability to invoke the librarian skill. If scheduling is unavailable, record that setup remains open and retain on-demand operation. Keep failures in the processing record. Raise failures to the owner only when access or an owner decision is needed, or active work is materially affected. Routine processing remains quiet.

These operating details and the complete proposed responsibilities remain subject to Mike’s agreement before implementation. Selecting a scheduler in this toolkit design does not activate a schedule for an installed project.

## Files and procedures affected

All delivered paths below are under plugins/toolkit/skills/project-setup/.

| Area | Required evaluation |
| --- | --- |
| choices/memory/notion/ | Replace old Memory/current-state layout, direct-write procedures, schema routing and templates. |
| choices/memory/shared-by-local-and-notion/ | Separate Notion capture from local direct writes; retain shared criteria where they still apply. |
| choices/notion-shared/ | Update template traversal, setup checks, stored identifiers and relations; distinguish pages from databases. |
| every-project/AGENTS.md and filing-project-records | Route to the confirmed authoritative homes without duplicate documentation. |
| managing-work-items and tracker choice copies | Align reflection, promotion, Moved up records and Current state responsibilities. Preserve lifecycle approval scopes. |
| handoff and adjacent skills | Verify captures and provide pending links; preserve session-summary’s recap role and braindump’s confirmation process. |
| Session-start and reminder hooks | Evaluate freshness and routing messages while retaining the three small hook commands. |
| Setup, finishing and update references | Distinguish instruction updates from separately approved migration of owner records. |
| toolkit-wiki/ | Describe the agreed model coherently and remove superseded Notion procedures. |

Schema findings require setup checks: the long-term collections are Projects, Topics, Memories, Entities and Facts. Memories, Entities and Facts currently relate to the template’s Work Items data source. Verify relations in each resulting project before writing. Owner-authored records must remain discoverable even when they lack Toolkit-specific Record Key metadata.

## Review and delivery

After Mike agrees the solution, implement in isolation from concurrent repository work. Review the delivered instructions for clarity, essential detail, duplicate rules, correct routing and unnecessary context. Check references, copies, both hosts, setup/update assembly and the applicable plugin checks.

Exercise representative flows: capture during work, closure before scheduled filing, handoff with pending captures, approved versus proposed documentation, terminology correction, cancellation, competing contributors, partial filing recovery and a conflicting source. Verify that local and Hindsight assemblies retain their intended behavior. These are review situations, not additional rules to add to each skill.

Deliver the agreed visual report showing responsibilities, capture-to-filing flow, destinations and changes. No toolkit implementation, live template rewrite, migration or schedule activation has occurred during this evaluation.

Official skill guidance read October 11, 2026: [Codex skills](https://learn.chatgpt.com/docs/build-skills), [Claude Code skills](https://code.claude.com/docs/en/skills), and [skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices). These support concise entry instructions and supporting files loaded as needed; suggested editorial sizes are not Toolkit hard limits.
