# What Notion memory adds to a project

Use this reference when copying the Notion memory choice and recording its settings. The choice supplies complete Notion procedures; local memory instructions are not copied.

| Kind | What setup adds |
| --- | --- |
| Coding-agent skill | `files-to-add/.claude/skills/managing-project-memory/` provides a short retrieval and capture procedure with focused destination references. |
| Steps inside other skills | `files-to-add/` also adds `references/project-memory-steps.md` inside `managing-work-items` and `handoff`, `references/record-decision.md` and `references/update-system-doc.md` inside `filing-project-records`, and `references/shared-record-paths.md` inside `publish-docs`: the steps of those skills that depend on Notion memory. |
| Librarian skill | `files-to-add/.claude/skills/maintaining-notion-wiki/` provides reconciliation, schemas, verified writes, metadata and recovery. |
| Published librarian package | Project Wiki holds a Librarian processing skill entry, focused references and filled Project context and connections. [Publication steps](librarian-package.md) verify cloud or local access. |
| Shared Notion access | `choices/notion-shared/files-to-add/` supplies `using-notion-cli` and `notion-records.md`, once even when the tracker also uses Notion. |
| Project settings | Memory is `notion`. Notion memory records configured pages, databases, data sources, the local Lore project row, published librarian links and Librarian schedule. [Notion memory pages](../../../notion-shared/reference/notion-memory-pages.md) gives exact labels. |
| Root `AGENTS.md` | The "Project memory" section and the rows below, and the summary sentence. |
| External structure | Project Wiki contains Wiki Inbox, Current state, Long-Term Memory, Terminology Glossary and Product Wiki. Setup reuses the owner’s structure or creates a project from the confirmed template after authorization. |

## Project authoritative destinations

After setup or the reviewed migration is verified, update `PROJECT.md`'s links to the authoritative records and related constraint and operating-convention pointers to the configured wiki destinations. Product Wiki owns finalized product documentation and decisions, Terminology Glossary owns finalized terms, and Long-Term Memory owns other lasting context and lessons. Active questions and approvals stay in work items. Use verified destination links and preserve unrelated project facts; existing records remain authoritative until the migration is verified.

## Session-start settings

Copy this choice's `.claude/hooks/session-start-choice.mjs` and `prompt-memory-reminder.md`. Replace `{{CURRENT_STATE_PAGE_ID}}` in the copied module with the verified Current state page ID. Keep the shared SessionStart and UserPromptSubmit handlers without memory-selection arguments. When updating old handlers, follow [the settings merge rules](../../../../reference/skills-hooks-settings.md); show their changes and have the owner trust changed Codex entries.

The startup snapshot is derived context. The coding-agent skill checks pending inbox captures and authoritative work records when freshness matters; startup output does not establish current work status.

## The text in the root AGENTS.md

A Notion-memory project gets no `DECISIONS.md` or `wiki/product-wiki/`. Its root `AGENTS.md` gets the "Project memory" section and the rows below. In an existing project, write this text only after the reviewed move to Project Wiki is verified; until then the project keeps its earlier text and authoritative destinations, and the local records stay in place until the owner approves their removal.

In a new project, write the section and the rows during setup.

In the "Project map" table, add this row after the row for `AGENTS.md`, `CLAUDE.md`:

```markdown
| Project Wiki, in Notion | Product Wiki holds finalized product documentation and product decisions. Terminology Glossary holds the project's terms. Long-Term Memory holds other lasting decisions, context, and lessons. `PROJECT.md` holds the links. | Capture changes with `filing-project-records` or `managing-project-memory`; the librarian files them. |
```

In the "Where information goes" table, add these rows after the row "A decision only one work item needs":

```markdown
| A decision more than one work item needs | Project Wiki: Product Wiki for a product decision, Long-Term Memory for another lasting decision (`filing-project-records`) |
| An open question more than one work item needs | Each affected work item, with a link to the other affected work items (`managing-work-items`). When it is decided, record the decision as the row above says. |
| A rule about how the system must work that several work items rely on | Product Wiki (`filing-project-records`) |
| A project term | Terminology Glossary (`filing-project-records`) |
```

Replace the prompt under the heading "Project memory" in the root `AGENTS.md` with this text, below the heading:

```markdown
This project keeps its memory in the Notion Project Wiki, with the skill `managing-project-memory`. The librarian is the skill `maintaining-notion-wiki`, which runs on a schedule or on demand. It files captured changes into the wiki.

- The project's current state, a short page of what is true now, is the Current state page in Project Wiki. The session-start command prints it. When it is not in the session's context, read it with `managing-project-memory`.
- Use `managing-project-memory` to find memory and to capture new facts, corrections, and reusable outcomes in Wiki Inbox. Verify each capture in the same turn. The librarian reconciles the affected wiki records afterward, and routine reconciliation needs no report to the owner. Report a capture that failed.
- Capture supported reusable outcomes without being asked. A capture does not approve its content: active questions and approvals stay in work items, and draft designs stay with their work item.
- When later work needs records that are not filed yet, run the librarian on demand.
- When the owner asks where the project stands, also read the relevant pending captures in Wiki Inbox.
```

## Root guide summary

At setup completion, contribute this sentence to the root `AGENTS.md` summary. [Work tracking and memory summary](../../../../reference/project-store-summary.md) gives placement and verification.

```markdown
Project memory is captured in Wiki Inbox and read from [Project Wiki](<verified Project Wiki URL>) in this repository’s [Notion project](<verified Project page URL>), with `managing-project-memory`.
```
