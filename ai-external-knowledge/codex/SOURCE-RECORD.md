# Codex documentation: skills, hooks, AGENTS.md, plugins, and subagents

- Publisher: OpenAI
- Original documentation home: https://learn.chatgpt.com/docs/
- Captured on: 2026-09-27
- Captured with: the Firecrawl CLI 1.24.3. Eleven pages with `firecrawl scrape <page URL>.md --format rawHtml`, which returns the Markdown source the site publishes, unchanged. `best-practices.md` with `--format markdown --only-main-content --include-tags main`, because that page publishes no Markdown source. The three `source-*.md` files with the GitHub CLI.
- Pages: 12 documentation pages and 3 source code files
- Redistribution: published documentation, kept here as a private reference copy for this repository. The source code files are Apache-2.0 licensed. Nothing here is shipped in any plugin.

## Project use

Read before writing or changing a Toolkit V2 skill, hook, plugin manifest, custom agent, or AGENTS.md text that Codex must read, and when checking how Codex lists and selects skills. The `source-*.md` files show the exact skill list format, budget, and truncation that the documentation only summarizes.

## Coverage

| File | Page | Source |
| --- | --- | --- |
| `build-skills.md` | Build skills | https://learn.chatgpt.com/docs/build-skills |
| `hooks.md` | Hooks | https://learn.chatgpt.com/docs/hooks |
| `agents-md.md` | Custom instructions with AGENTS.md | https://learn.chatgpt.com/docs/agent-configuration/agents-md |
| `plugins.md` | Plugins | https://learn.chatgpt.com/docs/plugins |
| `build-plugins.md` | Build plugins | https://learn.chatgpt.com/docs/build-plugins |
| `subagents.md` | Subagents (includes custom agents) | https://learn.chatgpt.com/docs/agent-configuration/subagents |
| `config-basic.md` | Config basics | https://learn.chatgpt.com/docs/config-file/config-basic |
| `config-reference.md` | Configuration Reference (includes `skills.max_context_tokens`) | https://learn.chatgpt.com/docs/config-file/config-reference |
| `customization-overview.md` | Customization (AGENTS.md, skills, MCP, subagents) | https://learn.chatgpt.com/docs/customization/overview |
| `best-practices.md` | Best practices | https://learn.chatgpt.com/guides/best-practices |
| `prompting.md` | Prompting | https://learn.chatgpt.com/docs/prompting |
| `openai-plugins-build-skills.md` | Build skills (OpenAI plugin builder documentation) | https://developers.openai.com/plugins/build/skills |
| `source-skills-catalog-prompt.md` | Codex source: `codex-rs/ext/skills/src/catalog_prompt.rs` | https://github.com/openai/codex/blob/21eb35513df478a2a090bfc2c0293caaf435b36d/codex-rs/ext/skills/src/catalog_prompt.rs |
| `source-skills-render.md` | Codex source: `codex-rs/ext/skills/src/render.rs` | https://github.com/openai/codex/blob/21eb35513df478a2a090bfc2c0293caaf435b36d/codex-rs/ext/skills/src/render.rs |
| `source-skills-parser.md` | Codex source: `codex-rs/skills/src/parser.rs` | https://github.com/openai/codex/blob/21eb35513df478a2a090bfc2c0293caaf435b36d/codex-rs/skills/src/parser.rs |

## Notes

- The Codex documentation moved. On 2026-09-27 each old `https://developers.openai.com/codex/...` address redirected (HTTP 308) to `https://learn.chatgpt.com/docs/...`: `codex/skills` to `docs/build-skills`, `codex/hooks` to `docs/hooks`, `codex/guides/agents-md` to `docs/agent-configuration/agents-md`, `codex/plugins` to `docs/plugins`, `codex/subagents` to `docs/agent-configuration/subagents`, `codex/config-basic` and `codex/config-reference` to `docs/config-file/...`, `codex/prompting` to `docs/prompting`, and `codex/learn/best-practices` to `guides/best-practices`. Each captured file names its old address in its header.
- The OpenAI plugin builder documentation still lives at https://developers.openai.com/plugins/.
- The source files are pinned to commit `21eb35513df478a2a090bfc2c0293caaf435b36d`, the head of `main` in https://github.com/openai/codex on 2026-09-27. The Codex installed on this Mac on that day was `codex-cli 0.157.0`; the source can be newer than the installed program.
- The documentation pages use MDX components such as `<FileTree>` and `<ContentModeSwitch>`. They are kept as published.
- Each captured file starts with a header naming its source URL and capture date.
