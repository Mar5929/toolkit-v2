# What Notion memory adds to a project

Use this reference when copying the Notion memory choice and recording its settings. The choice supplies complete Notion procedures; local memory instructions are not copied.

| Kind | What setup adds |
| --- | --- |
| Coding-agent skill | `files-to-add/.claude/skills/managing-project-memory/` provides a short retrieval and capture procedure with focused destination references. |
| Librarian skill | `files-to-add/.claude/skills/maintaining-notion-wiki/` provides reconciliation, schemas, verified writes, metadata and recovery. |
| Published librarian package | Project Wiki holds a Librarian processing skill entry, focused references and filled Project context and connections. [Publication steps](librarian-package.md) verify cloud or local access. |
| Shared Notion access | `choices/notion-shared/files-to-add/` supplies `using-notion-cli` and `notion-records.md`, once even when the tracker also uses Notion. |
| Project settings | Memory is `notion`. Notion memory records configured pages, databases, data sources, the local Lore project row, published librarian links and Librarian schedule. [Notion memory pages](../../../notion-shared/reference/notion-memory-pages.md) gives exact labels. |
| External structure | Project Wiki contains Wiki Inbox, Current state, Long-Term Memory, Terminology Glossary and Product Wiki. Setup reuses the owner’s structure or creates a project from the confirmed template after authorization. |

## Project record homes

After setup or the reviewed migration is verified, update `PROJECT.md`'s record-home links and related constraint and operating-convention pointers to the configured wiki destinations. Product Wiki owns finalized product documentation and decisions, Terminology Glossary owns finalized terms, and Long-Term Memory owns other lasting context and decisions. Active questions and approvals stay in work items. Use verified destination links and preserve unrelated project facts; existing records remain authoritative until verified cutover.

## Session-start settings

In `.claude/settings.json`, replace the session-start argument `local` with `notion`, `--page` and the configured Current state page ID. In `.codex/hooks.json`, replace `--memory local` with `--memory notion --page <Current state page ID>`. Fill actual identifiers before the owner trusts changed hooks.

The startup snapshot is derived context. The coding-agent skill checks pending inbox captures and authoritative work records when freshness matters; startup output does not establish current work status.

## Root guide summary

At setup completion, contribute this sentence to the root `AGENTS.md` summary. [Work tracking and memory summary](../../../../reference/project-store-summary.md) gives placement and verification.

```markdown
Project memory is captured in Wiki Inbox and read from [Project Wiki](<verified Project Wiki URL>) in this repository’s [Notion project](<verified Project page URL>), with `managing-project-memory`.
```
