# Notion work tracking clarity review

The 0.9.60 draft clarifies Mike's Notion work model and makes work-item phases optional when a plain task list is sufficient. The project roadmap and its approval remain separate from an item's own plan.

## Defined behavior

Each project owns its Work Items, Phases and Tasks databases. Agents create work items with the database's default template, fill applicable editable properties from live schemas and confirmed information, and use the generated work-item and Solution Design pages. Project phases organize the project's roadmap; work-item phases organize an item's outcomes when useful. Work-item tasks are steps within that item's goal; project tasks are operational or administrative work outside a work item. Ownership relations are explicit and verified.

Shared lifecycle and all three tracker choices now support plain-list top-level items. New plain-list tasks use T01, phased tasks use P1-T01 and project tasks use PT-01. Existing IDs remain stable. Sub-items of unphased parents have no phase. Conversions preserve phase records in history before removing phase layout. Three work-item levels, approvals and completion evidence remain intact.

The Notion default template is still authoritative for page layout. [Notion's create-page documentation](https://developers.notion.com/reference/post-page), fetched October 11, requires template.type=default during API creation; omission applies no template. This technical parameter is part of the create call, not a separate template-application operation.

## Live template change

Mike explicitly approved changing the single mandatory-phase sentence in the [default template](https://app.notion.com/p/3edb381da17680d5b6aad6ca95cdbfd1). Readback verified the optional-phase sentence and preservation of the Roadmap view. No other template section or database schema changed. Existing project-specific template copies and work records were not migrated.

## Independent review and checks

[Independent review](notion-work-tracking-clarity-independent-review.md) covered a small phase-less item, a larger phased feature, project administration, sub-items, property ownership and template creation. Three findings were fixed and reread: Notion design routing, phased versus plain-list task IDs, and saving phase history before removing layout. No confirmed gap remains in this scope.

Both Claude plugin validations passed. Nine tracker/memory assembly checks passed, including reference links and optional-phase policy. The local and shared work-item templates match exactly. Whitespace checks passed. A scratch Codex home accepted toolkit 0.9.60. These are static and procedural checks, not live end-to-end work-tracking execution or proof that copied Notion views display unphased records correctly.

The draft includes the reviewed librarian package and remains uncommitted on codex/wiki-librarian-package. Delivery must integrate the separately preserved 0.9.59 policy patch before releasing 0.9.60. Existing project updates use a reviewed batch and verify templates, views and relation targets.
