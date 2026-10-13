# What Notion memory adds to a project

Use this reference when copying the Notion memory choice and recording its settings. The choice supplies complete Notion procedures; local memory instructions are not copied.

| Kind | What setup adds |
| --- | --- |
| Coding-agent skill | `files-to-add/.claude/skills/managing-project-memory/` provides a short retrieval and capture procedure with focused destination references. |
| Librarian skill | `files-to-add/.claude/skills/maintaining-notion-wiki/` provides reconciliation, schemas, verified writes, metadata and recovery. |
| Published librarian package | Project Wiki holds a Librarian processing skill entry, focused references and filled Project context and connections. [Publication steps](librarian-package.md) verify cloud or local access. |
| Shared Notion access | `choices/notion-shared/files-to-add/` supplies `using-notion-cli` and `notion-records.md`, once even when the tracker also uses Notion. |
| Project settings | Memory is `notion`. Notion memory records configured pages, databases, data sources, the local Lore project row, published librarian links and Librarian schedule. [Notion memory pages](../../../notion-shared/reference/notion-memory-pages.md) gives exact labels. |
| Root `AGENTS.md` | The "Project memory" section below, and the summary sentence. |
| External structure | Project Wiki contains Wiki Inbox, Current state, Long-Term Memory, Terminology Glossary and Product Wiki. Setup reuses the owner’s structure or creates a project from the confirmed template after authorization. |

## Project record homes

After setup or the reviewed migration is verified, update `PROJECT.md`'s record-home links and related constraint and operating-convention pointers to the configured wiki destinations. Product Wiki owns finalized product documentation and decisions, Terminology Glossary owns finalized terms, and Long-Term Memory owns other lasting context and decisions. Active questions and approvals stay in work items. Use verified destination links and preserve unrelated project facts; existing records remain authoritative until verified cutover.

## Session-start settings

In `.claude/settings.json`, replace the session-start argument `local` with `notion`, `--page` and the configured Current state page ID. In `.codex/hooks.json`, replace `--memory local` with `--memory notion --page <Current state page ID>`. Fill actual identifiers before the owner trusts changed hooks.

The startup snapshot is derived context. The coding-agent skill checks pending inbox captures and authoritative work records when freshness matters; startup output does not establish current work status.

## The "Project memory" section of the root AGENTS.md

Replace the prompt under the heading "Project memory" in the root `AGENTS.md` with this text, below the heading:

```markdown
This project keeps its memory in the Notion Project Wiki, with the skill `managing-project-memory`. The librarian, the skill `maintaining-notion-wiki` run on its schedule or on demand, files captured changes into the wiki.

- The project's current state, a short page of what is true now, is the Current state page in Project Wiki. The session-start command prints it. When it is not in the session's context, read it with `managing-project-memory`.
- Use `managing-project-memory` to find memory and to capture new facts, corrections, and reusable outcomes in Wiki Inbox. Verify each capture in the same turn. The librarian reconciles the affected wiki records afterward, and routine reconciliation needs no report to the owner. Report a capture that failed.
- Capture supported reusable outcomes without being asked. A capture does not approve its content: active questions and approvals stay in work items, and draft designs stay with their work item.
- Product Wiki holds finalized product documentation and decisions, Terminology Glossary holds finalized terms, and Long-Term Memory holds other lasting context and lessons. These homes replace `DECISIONS.md`, `wiki/product-wiki/`, and `wiki/product-wiki/glossary.md` in the Project map and in "Where information goes". Local records from before the move to Project Wiki are historical evidence, not active records.
- When the owner asks where the project stands, also read the relevant pending captures in Wiki Inbox.
```

In an existing project whose migration to Project Wiki is not verified yet, add this line at the end of the section, and remove it when the migration is verified: "Until the move to Project Wiki is verified, the existing record homes stay in use."

## Root guide summary

At setup completion, contribute this sentence to the root `AGENTS.md` summary. [Work tracking and memory summary](../../../../reference/project-store-summary.md) gives placement and verification.

```markdown
Project memory is captured in Wiki Inbox and read from [Project Wiki](<verified Project Wiki URL>) in this repository’s [Notion project](<verified Project page URL>), with `managing-project-memory`.
```
