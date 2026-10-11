# What Notion memory adds to a project

Use this reference when copying the Notion memory choice and recording its settings. The choice supplies complete Notion procedures; local memory instructions are not copied.

| Kind | What setup adds |
| --- | --- |
| Coding-agent skill | `files-to-add/.claude/skills/managing-project-memory/` provides a short retrieval and capture procedure with focused destination references. |
| Librarian skill | `files-to-add/.claude/skills/maintaining-notion-wiki/` provides reconciliation, schemas, verified writes, metadata and recovery. |
| Shared Notion access | `choices/notion-shared/files-to-add/` supplies `using-notion-cli` and `notion-records.md`, once even when the tracker also uses Notion. |
| Project settings | Memory is `notion`. Notion memory records configured pages, databases, data sources, the local Lore project row and Librarian schedule. [Notion memory pages](../../../notion-shared/reference/notion-memory-pages.md) gives exact labels. |
| External structure | Project Wiki contains Wiki Inbox, Current state, Long-Term Memory, Terminology Glossary and Product Wiki. Setup reuses the owner’s structure or creates a project from the confirmed template after authorization. |

## Session-start settings

In `.claude/settings.json`, replace the session-start argument `local` with `notion`, `--page` and the configured Current state page ID. In `.codex/hooks.json`, replace `--memory local` with `--memory notion --page <Current state page ID>`. Fill actual identifiers before the owner trusts changed hooks.

The startup snapshot is derived context. The coding-agent skill checks pending inbox captures and authoritative work records when freshness matters; startup output does not establish current work status.
