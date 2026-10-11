# Memory metadata follow-up — October 11, 2026

Version 0.9.46 implements Mike's approved metadata mapping for delivered local and Notion memory guidance. Ordinary corrections and added detail update the same record. Replaced decisions or facts get separate records with links in both directions; earlier content stays as history. The changes remain uncommitted.

## Metadata mapping

| Metadata | Local YAML | Notion using existing Lore fields |
| --- | --- | --- |
| Created date | `created`, preserved | Native created time, preserved |
| Modified date | `updated` | Saved |
| Modified by | `modified_by`, actual last editor | Other fields: `modified_by` |
| Provenance | `provenance`, dated evidence with a link, path, or ID | Source note, with claim-specific evidence in the body |
| Tags | `tags`, retrieval subjects; type stays separate | Existing Tags options, including the type; Other fields: `tags` for subjects without an existing option |
| Context | `context`, concise project relevance | Other fields: `context` |
| Source derivation | `source`, a list of stated, summarized, or inferred | Other fields: `source_kind`, the same values |
| Type | `metadata.type` and filename prefix | Type tag and Record Key prefix |
| Supersedes | `supersedes`, filename stem or list | Supersedes relation, preserving earlier entries |
| Superseded by | `superseded_by`, filename stem or list | Superseded by text, one key or a JSON array of keys |

Lore's Source column keeps its origin options. New Toolkit records continue to use manual; an existing origin is preserved. Author and Agent describe creation, while modified_by records later editors. Other fields is merged as JSON without dropping unknown keys. Invalid existing JSON is preserved until its representation is resolved. No new columns or select options are required.

Local legacy source evidence moves into provenance before source becomes derivation metadata. Missing history is filled from evidence or labeled unknown. Context uses concise judgment under Mike's approved removal of editorial caps; the wiki's earlier 255-character note is not imposed as a new limit.

The skill contains Mike's requested sentence: “Make sure that you apply those metadata tags and keep them up to date on the memory files.” Its Notion route names the equivalent field mapping.

## Creation, correction, and replacement

A new local record uses the expanded YAML template. A new Notion record uses the existing page properties and the nested Other fields JSON shown in writing-pages.md. Both retain claim-specific evidence and uncertainty.

An ordinary correction keeps the identity and creation date, adds the new supporting evidence, and updates the actual editor and modification date. Last verified changes only when the fact was checked against its source. Correction searches update current claims and guidance while preserving dated evidence and superseded history.

A replacement retains the old record, links old and new records in both directions, updates both records' metadata, and verifies both sides. When only part of an earlier subject record is replaced, that record stays current and its affected section is marked and linked. Multiple replacements preserve earlier links. Rename searches cover both body links and metadata filename stems.

## Files changed

Paths below are relative to `plugins/toolkit/skills/project-setup/choices/memory/`.

- [Local template](../../../plugins/toolkit/skills/project-setup/choices/memory/local/files-to-add/memory/project_topic_template.md)
- Local references: [record format](../../../plugins/toolkit/skills/project-setup/choices/memory/local/files-to-add/.claude/skills/managing-project-memory/references/record-format.md), [storage](../../../plugins/toolkit/skills/project-setup/choices/memory/local/files-to-add/.claude/skills/managing-project-memory/references/memory-store.md), [folders and files](../../../plugins/toolkit/skills/project-setup/choices/memory/local/files-to-add/.claude/skills/managing-project-memory/references/folders-and-files.md), [searching](../../../plugins/toolkit/skills/project-setup/choices/memory/local/files-to-add/.claude/skills/managing-project-memory/references/searching.md)
- Shared guidance: [skill](../../../plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/SKILL.md), [saving](../../../plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/saving.md), [tidying](../../../plugins/toolkit/skills/project-setup/choices/memory/shared-by-local-and-notion/files-to-add/.claude/skills/managing-project-memory/references/tidying.md)
- Notion guidance: [database mapping](../../plugins/toolkit/skills/project-setup/choices/memory/notion/files-to-add/.claude/skills/managing-project-memory/references/database-layout.md), [writing pages](../../plugins/toolkit/skills/project-setup/choices/memory/notion/files-to-add/.claude/skills/managing-project-memory/references/writing-pages.md), [body template](../../plugins/toolkit/skills/project-setup/choices/memory/notion/files-to-add/.claude/skills/managing-project-memory/assets/concept-record.md)

Marketplace and both plugin manifests now say 0.9.46. The main review links this follow-up. The October 10 video remains a dated snapshot preceding these decisions.

## Verification

Claude marketplace and plugin validation, whitespace checks, skill front matter/settings parsing, and nine assembled tracker/memory combinations passed. Codex accepted version 0.9.46 in an isolated scratch home. Scratch local fixtures using the expanded header parsed as YAML, preserved creation/evidence/custom fields during an ordinary correction, and kept reciprocal replacement links. The real startup hook listed the replacement and excluded the superseded record. The exact delivered Notion creation payload and its nested Other fields parsed as JSON; its property names, types, and select options match the live default Lore Memories schema read October 11.

A separate reviewer walked through creation, legacy migration, correction, replacement, partial replacement, and merging for both stores. Review found rename searches that missed metadata stems, multiple replacements that could overwrite earlier links, and correction propagation that could overwrite history. These findings were fixed and reread.

Current official guidance read October 11: [Claude Code skills](https://code.claude.com/docs/en/skills), [Codex skills](https://learn.chatgpt.com/docs/build-skills), and [Anthropic skill authoring](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices).

No live memory records, Notion schema, owner templates, or real project installations were changed. Notion verification covered schema and payload compatibility plus instruction review; it did not exercise live service writes. The former dev checks are absent. Other unresolved owner intent stays listed in the main review and was not changed by this follow-up.
