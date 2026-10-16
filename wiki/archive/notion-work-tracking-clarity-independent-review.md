# Notion work tracking and optional phases: independent review

Reviewed on 2026-10-11. No confirmed findings remain in the reviewed work-tracker changes after the fixes below were read again.

## Scope and sources

The review covered the Notion work-tracker references, shared lifecycle and design routing, and the local and GitHub changes for optional work-item phases. It followed root `AGENTS.md`, `.claude/rules/evaluate-the-owners-request.md`, `.claude/rules/document-clarity-standard.md`, and the harness-writing skill and checklist. Official skill captures in `ai-external-knowledge/` supplied the shared authoring guidance.

The [Notion create-page reference](https://developers.notion.com/reference/post-page) was provided as `/tmp/tkv-notion-create-page.md`. Its template section confirms that an omitted template defaults to `none`, and that `template.type: default` requests the data source's default template. The create-call example and asynchronous-content wait follow that behavior.

## Findings corrected and verified

- Shared `designing.md` now fills the generated Notion Solution Design page and uses the asset template for local or GitHub work items. The older Notion template fallback remains available.
- Shared `building.md` now assigns new task IDs by phase or plain-list grouping. Unphased top-level items use `T01` forms; existing IDs stay unchanged.
- Local and GitHub phase-to-plain conversion procedures now preserve phase details in Recent History before removing the layout. They retain phase IDs, status, outcome, exit result and sub-item links, and keep task IDs unchanged.

## Procedure simulations

| Situation | Verified outcome |
| --- | --- |
| Small work item without phases | It can use a plain task list without creating a work-item phase. Its project roadmap placement and approvals still apply. |
| Larger feature with phases | Its phases organize tasks and level-2 sub-items. Phase ownership, outcome and completion evidence remain required. |
| Project administrative task | It belongs to the project, has a `PT-01` form, and has neither a Work item nor Phase relation in Notion. Product changes still use the work-item lifecycle. |
| Sub-item under an unphased parent | It retains its parent relation, has no Phase relation, and appears on the parent's plain sub-item list in local or GitHub tracking. |
| Notion API creation | Creation explicitly requests the default template, waits for generated content, fills that content and applicable editable properties, and verifies the result. |
| Ownership and completion | Project and work-item records remain distinct. Three work-item levels, stable IDs, owner approvals, task completion evidence and sub-item closure checks remain intact. |

Notion guidance reads the live schema, fills all applicable editable properties supported by confirmed context or lifecycle defaults, preserves system-managed fields and unrelated owner values, and records unknown decisions instead of inventing values.

## Verification limits

This review used file reads and procedure simulations. It made no live Notion writes and ran no workflow tests.

The main task reported a separately authorized, verified change to the mandatory-phase sentence in default-template page `3edb381da17680d5b6aad6ca95cdbfd1`. Its readback confirmed optional phases, removal of the old sentence and retention of the Roadmap view. This review did not independently read that live page. Existing projects' copied templates were not migrated.
