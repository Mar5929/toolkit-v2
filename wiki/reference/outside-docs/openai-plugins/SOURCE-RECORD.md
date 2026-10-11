# OpenAI plugin builder documentation: plugin architecture, packaging, skills, and submitting a Claude Code plugin

- Publisher: OpenAI
- Original documentation home: https://developers.openai.com/plugins/
- Captured on: 2026-10-05
- Captured with: the Firecrawl CLI 1.24.3, `firecrawl scrape <page URL>.md --format rawHtml -o <file>`, which returns the Markdown source the site publishes for each page, unchanged.
- Codex version on the capture date: 0.160.1.
- Pages: 5
- Redistribution: published documentation, kept here as a private reference copy for this repository. Not shipped in any plugin.

## Project use

Read before building a plugin that Codex or ChatGPT must install, before changing the Codex manifest in `plugins/toolkit/.codex-plugin/`, and when checking how a Claude Code plugin can be submitted to OpenAI's plugin directory. The Codex-side pages about plugins are in `../codex/` (`plugins.md`, `build-plugins.md`, `skills-and-plugins.md`).

## Coverage

| File | Page | Source |
| --- | --- | --- |
| `concepts-plugins.md` | Plugin architecture (what a plugin can contain) | https://developers.openai.com/plugins/concepts/plugins |
| `concepts-skills.md` | Skills (the concept, in the plugin builder documentation) | https://developers.openai.com/plugins/concepts/skills |
| `build-plugins-package.md` | Package your plugin | https://developers.openai.com/plugins/build/plugins |
| `build-extensions.md` | Build extensions | https://developers.openai.com/plugins/build/extensions |
| `submit-claude-plugin.md` | Submit a Claude Code plugin | https://developers.openai.com/plugins/guides/submit-claude-plugin |

## Notes

- The page "Build skills" from the same documentation, https://developers.openai.com/plugins/build/skills, was captured earlier and stays in `../codex/openai-plugins-build-skills.md`.
- Links inside the pages are kept as published. Links that start with `/` are relative to https://developers.openai.com.
- Each captured file starts with a header naming its source URL and capture date.
- The pages were captured once, so there is no earlier copy to compare with.
- Where this folder came from: the 2026-10-05 refresh of the outside documentation (work item TKV-24).
