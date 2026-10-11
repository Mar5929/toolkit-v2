---
name: maintaining-notion-wiki
description: 'Reconciles Wiki Inbox into Current state, Long-Term Memory, Terminology Glossary and Product Wiki. Use for daily processing, an on-demand refresh, or an explicit correction or forgetting request. Coding-agent capture uses managing-project-memory.'
---

# Maintaining the Notion Project Wiki

Keep the Project Wiki current, supported by sources and free of duplicated authority. The librarian owns filing and unresolved captures; routine processing stays quiet.

## Operation sequence

1. Read this project's Project context and connections page from the published skill, or its configured link in `PROJECT.md`. Confirm the project, authoritative sources, Notion identifiers and librarian operating settings before writing. Follow [Notion access and traversal](references/notion-operations.md) and [run coordination](references/run-operation.md).
2. Select pending captures, requested corrections and existing wiki content needing maintenance. Follow [existing-wiki maintenance](references/existing-wiki-maintenance.md) even when the inbox is empty; read relevant work items, sources and destinations before changing records.
3. Open [destination rules](references/destination-rules.md) and the applicable schema reference. Inspect live fields and relation targets; use the installed project's IDs, not template IDs.
4. Reconcile supported information with existing records. Preserve approvals, uncertainty, metadata and history using [record maintenance](references/record-maintenance.md). Filing never grants approval or proves implementation.
5. Read each changed destination back. Preserve verified links and finish missing writes before marking an associated capture Filed. Record unresolved or dismissed outcomes as [run coordination](references/run-operation.md) describes.
6. Keep processing notes and resumption details sufficient for recovery. Ask the owner only when access or a consequential unresolved decision needs the owner, or failure materially affects active work. Send no routine report.

## References

| Reference | Open it when |
| --- | --- |
| [Project context and connections template](assets/project-context-template.md) | Setup fills this template for the published project page; the librarian reads that filled page before processing. |
| [Librarian invocation prompt](assets/librarian-invocation-prompt.md) | Setup fills a prompt for starting scheduled or on-demand work through the published skill. |
| [Existing-wiki maintenance](references/existing-wiki-maintenance.md) | You maintain existing records, duplication or navigation, including runs with no new captures. |
| [Notion access and traversal](references/notion-operations.md) | You read, search, parse or write Notion records. |
| [Destination rules](references/destination-rules.md) | You choose or reconcile a destination. |
| [Wiki schemas](references/wiki-schemas.md) | You access Wiki Inbox, Product Wiki or Terminology Glossary fields. |
| [Long-Term Memory schemas](references/long-term-schemas.md) | You access the five existing memory collections. |
| [Record maintenance](references/record-maintenance.md) | You create, update, correct, supersede, retire or forget records. |
| [Run coordination](references/run-operation.md) | You start a scheduled/on-demand operation or recover partial processing. |
