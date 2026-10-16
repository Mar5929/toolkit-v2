---
name: managing-project-memory
description: 'Finds, saves, and corrects this project''s lasting memory in its Hindsight bank. Use for remembered context, lessons, corrections, forgetting, and work-item outcomes. Other skills call it when work starts, changes, or closes. Current work belongs to managing-work-items; shared decisions and sources belong to filing-project-records.'
---

# Managing project memory (Hindsight)

Lasting memory lives in the Hindsight bank recorded in `PROJECT.md`, under "Toolkit settings". Use Hindsight's coding-agent add-on and its tools. Current work lives in the work tracker, and this project has no Current State file.

## What qualifies

Save a lasting, project-specific fact, person, lesson, event, or constraint when no other memory explains it, losing it would cost a later session real time, and it came from the owner or work with the owner. A significant failure the agent found and fixed can qualify, with its cause and fix.

- The authoritative record stays where `AGENTS.md`, "Where information goes", puts it. Memory can point to it and keep the lasting context, but is never a second source of current status.
- Keep proposals, unchecked claims, and open questions marked as such. An agent's report is never an owner decision.
- Never save secrets or anything that could compromise security.
- Keep moment-to-moment status, routine verification results, and transcripts out; they belong in the tracker or project records.

## Saving

- Review when the owner gives lasting information or a correction, when joint work yields a lasting decision or lesson, and when work ends or is handed off. A keyword reminder is a prompt to review, not to save.
- Search the bank and read related records first. Save with `hindsight_ingest_document`: nothing saves automatically with the default package. Include the source, date, context, and a pointer to the project record.
- Keep dates, who made each revision, provenance, type, tags, and supersession using Hindsight's fields or labeled text. Separate who said it from the agent that saved it. If the tools can't keep some metadata, say so instead of claiming it.
- Tell the owner what you saved or corrected. Save nothing when nothing qualifies.

## Finding

Search before asking the owner to repeat anything or acting on a past decision, constraint, or lesson, and read the relevant record. Use reflection when you need the reasoning behind it. Verify changeable claims against project records, work items, Git, or the running system. Memory grants no permission and doesn't prove current status.

## Correcting and forgetting

Search and read first, then save a `Correction: <topic>` document stating the old claim, what's true now, the evidence, and what it supersedes. A correction doesn't delete the old document, so check what retrieval returns. The add-on's tools have no delete capability. To forget something, tell the owner which record to remove in the bank's dashboard page, `https://memory.mrihm-memory.com/banks/<bank ID>`, under the bank recorded in `PROJECT.md`. Never call a correction a deletion.

## When another skill reports work

Active work, next steps, waits, and handoff context stay in the work tracker. A wait no work item holds becomes a project task through `managing-work-items`; close that task when the wait ends.

When an item closes or is handed off, save each lesson `closing.md` sends here, with its status, its item, and the dates it was seen. Bank configuration changes go through `project-setup`.
