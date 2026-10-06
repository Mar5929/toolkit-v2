# Codex documentation: skills, hooks, AGENTS.md, plugins, and subagents

- Publisher: OpenAI
- Original documentation home: https://learn.chatgpt.com/docs/
- Captured on: 2026-10-05. Every page was captured again that day and 7 pages were added; 5 pages were found unchanged and their files were left as they were. The earlier capture date was 2026-09-27.
- Captured with: the Firecrawl CLI 1.24.3. Eighteen pages with `firecrawl scrape <page URL>.md --format rawHtml -o <file>`, which returns the Markdown source the site publishes, unchanged. `best-practices.md` with `--format markdown --only-main-content --include-tags main -o <file>`, because that page publishes no Markdown source. The three `source-*.md` files with the GitHub CLI (see Notes).
- Codex version on the capture date: 0.160.1 (as given for this refresh; `codex --version` on this Mac printed `codex-cli 0.160.0`).
- Pages: 19 documentation pages and 3 source code files
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
| `rules.md` | Rules (which commands Codex may run outside the sandbox; experimental) | https://learn.chatgpt.com/docs/agent-configuration/rules |
| `memories.md` | Memories (what Codex remembers between chats, and the controls) | https://learn.chatgpt.com/docs/customization/memories |
| `config-advanced.md` | Advanced configuration | https://learn.chatgpt.com/docs/config-file/config-advanced |
| `config-sample.md` | Sample configuration | https://learn.chatgpt.com/docs/config-file/config-sample |
| `permissions.md` | Permissions (sandbox and approvals) | https://learn.chatgpt.com/docs/permissions |
| `skills-and-plugins.md` | Skills and plugins (how the two relate) | https://learn.chatgpt.com/docs/skills-and-plugins |
| `custom-prompts.md` | Custom prompts (deprecated; use skills) | https://learn.chatgpt.com/docs/custom-prompts |
| `source-skills-catalog-prompt.md` | Codex source: `codex-rs/ext/skills/src/catalog_prompt.rs` | https://github.com/openai/codex/blob/7c2ce90716335c889a5076ded9a630459f9c9899/codex-rs/ext/skills/src/catalog_prompt.rs |
| `source-skills-render.md` | Codex source: `codex-rs/ext/skills/src/render.rs` | https://github.com/openai/codex/blob/7c2ce90716335c889a5076ded9a630459f9c9899/codex-rs/ext/skills/src/render.rs |
| `source-skills-parser.md` | Codex source: `codex-rs/skills/src/parser.rs` | https://github.com/openai/codex/blob/7c2ce90716335c889a5076ded9a630459f9c9899/codex-rs/skills/src/parser.rs |

## Notes

- The Codex documentation moved. On 2026-09-27 each old `https://developers.openai.com/codex/...` address redirected (HTTP 308) to `https://learn.chatgpt.com/docs/...`: `codex/skills` to `docs/build-skills`, `codex/hooks` to `docs/hooks`, `codex/guides/agents-md` to `docs/agent-configuration/agents-md`, `codex/plugins` to `docs/plugins`, `codex/subagents` to `docs/agent-configuration/subagents`, `codex/config-basic` and `codex/config-reference` to `docs/config-file/...`, `codex/prompting` to `docs/prompting`, and `codex/learn/best-practices` to `guides/best-practices`. Each captured file names its old address in its header.
- The OpenAI plugin builder documentation still lives at https://developers.openai.com/plugins/. Five more pages from it are in `../openai-plugins/`; the one page captured here (`openai-plugins-build-skills.md`) stays here.
- The source files are pinned to commit `7c2ce90716335c889a5076ded9a630459f9c9899`, the head of `main` in https://github.com/openai/codex on 2026-10-05. On 2026-09-27 they were pinned to `21eb35513df478a2a090bfc2c0293caaf435b36d`. The helper fetched the raw files earlier on 2026-10-05; the stored text was checked on the same day against the files at that commit with `gh api repos/openai/codex/contents/<path>?ref=<commit> -H "Accept: application/vnd.github.raw"`, and each one is identical. Each stored file wraps the code in a `rust` code block. The source can be newer than the installed program.
- The documentation pages use MDX components such as `<FileTree>` and `<ContentModeSwitch>`. They are kept as published.
- Each captured file starts with a header naming its source URL and capture date.
- Not captured on purpose: the enterprise and administration pages. `https://learn.chatgpt.com/docs/enterprise/skills` was fetched by the helper and not kept. Some public pages here still carry short enterprise paragraphs (for example "Local computer access with Work Cloud" in `config-reference.md`, `config-basic.md`, `hooks.md`, and `rules.md`); they are kept as published.

## What changed since 2026-09-27

Source: the comparison the helper made on 2026-10-05, checked against the stored files.

- Replaced, with the capture date 2026-10-05:
  - `hooks.md`: `hooks` is now the feature key (`codex_hooks` still works); enterprise-managed requirements can define hooks inline under `[hooks]`; hooks from managed policy and remote hooks run differently in cloud-orchestrated work.
  - `subagents.md` and `best-practices.md`: model advice now names `gpt-6.1-sol` next to `gpt-6-luna` and `gpt-6-astra`.
  - `config-reference.md` and `config-basic.md`: a section on settings for "Local computer access with Work Cloud" and how requirements rank; `config-basic.md` also says web search is on by default and served from a cache.
  - `plugins.md`: plugin hooks are not supported in cloud-orchestrated work; a link to workspace connections for admins.
  - `build-plugins.md`: a reworded "Rules" bullet and a link to the new "Package your plugin" page (`../openai-plugins/build-plugins-package.md`).
  - `source-skills-render.md`: `render.rs` now includes a new file, `render_dedup.rs`, and the function that builds the combined skill list was renamed and split. `render_dedup.rs` is not captured.
  - `source-skills-catalog-prompt.md` and `source-skills-parser.md`: the code did not change. They moved to the new commit only.
- Checked on 2026-10-05 and found unchanged, so the files were left as they were: `agents-md.md`, `build-skills.md`, `customization-overview.md`, `openai-plugins-build-skills.md`, `prompting.md`.
- The 7 added pages are new to this folder. They were not diffed.
