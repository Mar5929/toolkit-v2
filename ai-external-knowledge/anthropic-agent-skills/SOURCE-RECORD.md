# Agent Skills: overview, authoring best practices, and the open standard

- Publisher: Anthropic (Claude developer documentation) and the Agent Skills open standard (agentskills.io)
- Original documentation home: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
- Captured on: 2026-09-27. Checked again on 2026-10-05: all 7 pages were found unchanged, and 2 pages were added on 2026-10-05.
- Captured with: the Firecrawl CLI 1.24.3, `firecrawl scrape <page URL>.md --format rawHtml`, which returns the Markdown source each site publishes for the page, unchanged. The 2026-10-05 capture used the same command with `-o <file>`.
- Pages: 9
- Redistribution: published documentation, kept here as a private reference copy for this repository. Not shipped in any plugin.

## Project use

Read before writing or reviewing any skill name, description, or SKILL.md body, and before testing whether a skill triggers. These pages are the shared format both Claude Code and Codex build on.

## Coverage

| File | Page | Source |
| --- | --- | --- |
| `agent-skills-overview.md` | Agent Skills (overview: how skills load, where they work) | https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview |
| `skill-authoring-best-practices.md` | Skill authoring best practices | https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices |
| `agentskills-specification.md` | Specification (the Agent Skills open standard) | https://agentskills.io/specification |
| `agentskills-best-practices.md` | Best practices for skill creators | https://agentskills.io/skill-creation/best-practices |
| `agentskills-optimizing-descriptions.md` | Optimizing skill descriptions | https://agentskills.io/skill-creation/optimizing-descriptions |
| `agentskills-evaluating-skills.md` | Evaluating skill output quality | https://agentskills.io/skill-creation/evaluating-skills |
| `agentskills-adding-skills-support.md` | How to add skills support to your agent (how a host builds the skill list) | https://agentskills.io/client-implementation/adding-skills-support |
| `agentskills-quickstart.md` | Quickstart: create your first skill (a worked example) | https://agentskills.io/skill-creation/quickstart |
| `agentskills-using-scripts.md` | Using scripts in skills | https://agentskills.io/skill-creation/using-scripts |

## Notes

- The Agent Skills open standard lives at https://agentskills.io. Anthropic published it as an open standard on 2025-12-18 (see `../anthropic-engineering/equipping-agents-for-the-real-world-with-agent-skills.md`). Claude Code and Codex both say their skills follow it.
- The platform.claude.com pages carry their own YAML header (title, url, description) under the capture header. That header is part of the published Markdown.
- Links inside the pages are kept as published. Links on agentskills.io that start with `/` are relative to https://agentskills.io.
- Each captured file starts with a header naming its source URL and capture date.

## What changed since 2026-09-27

Source: the comparison the helper made on 2026-10-05, checked against the stored files.

- The 7 stored pages have the same text as before. Two of them (`agentskills-specification.md` and `agentskills-adding-skills-support.md`) differ only in how table columns are padded. Their files were left as they were, so their headers still show 2026-09-27.
- Added on 2026-10-05: `agentskills-quickstart.md` and `agentskills-using-scripts.md`. Neither was diffed, because neither was stored before.
