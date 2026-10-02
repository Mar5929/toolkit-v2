# Claude Code documentation: mods (plugins of function hooks)

- Publisher: Anthropic
- Original documentation home: https://code.claude.com/docs/en/plugins/mods/overview
- Captured on: 2026-10-02
- Captured with: the Firecrawl CLI 1.24.3. Documentation pages: `firecrawl scrape <page URL>.md --format rawHtml`, which returns the Markdown source the site publishes for each page, unchanged. GitHub files: `firecrawl scrape <raw.githubusercontent.com URL> --format rawHtml`, which returns the file as GitHub serves it, unchanged. The list of pages in the section came from `firecrawl map https://code.claude.com/docs/en/plugins/mods` and the "Mods" group of https://code.claude.com/docs/llms.txt.
- Pages: 24 (10 pages of the mods section, 8 documentation pages they link to, and 6 files from Anthropic's public GitHub repositories)
- Redistribution: Anthropic's published documentation and public repository files, kept here as a private reference copy for this repository. Not shipped in any plugin.

## Project use

Read before deciding whether any part of Toolkit V2 should be a mod, and before writing, reviewing, or testing one. A mod is a Claude Code plugin whose `hooks/hooks.json` names a JavaScript or TypeScript hooks module. The research summary for this repository is `dev/research/claude-code-mods.md`.

## Coverage

### The mods section

| File | Page | Source |
| --- | --- | --- |
| `overview.md` | Mods overview | https://code.claude.com/docs/en/plugins/mods/overview |
| `create.md` | Create a mod | https://code.claude.com/docs/en/plugins/mods/create |
| `interface.md` | Draw in the interface with a mod | https://code.claude.com/docs/en/plugins/mods/interface |
| `gallery.md` | Interface gallery for mods | https://code.claude.com/docs/en/plugins/mods/gallery |
| `events.md` | React to events with a mod | https://code.claude.com/docs/en/plugins/mods/events |
| `api.md` | Use the mods API | https://code.claude.com/docs/en/plugins/mods/api |
| `test.md` | Test a mod | https://code.claude.com/docs/en/plugins/mods/test |
| `troubleshoot.md` | Troubleshoot a mod | https://code.claude.com/docs/en/plugins/mods/troubleshoot |
| `admin.md` | Manage mods for your organization | https://code.claude.com/docs/en/plugins/mods/admin |
| `reference.md` | Mods reference | https://code.claude.com/docs/en/plugins/mods/reference |

### Documentation pages the mods section links to

| File | Page | Source |
| --- | --- | --- |
| `permissions.md` | Configure permissions (its "Extend permissions with hooks" section says what a mod can approve) | https://code.claude.com/docs/en/permissions |
| `permission-modes.md` | Choose a permission mode (protected paths, including a `--plugin-dir` folder, and auto mode with a mod) | https://code.claude.com/docs/en/permission-modes |
| `plugins-security.md` | Plugin security and trust | https://code.claude.com/docs/en/plugins/security |
| `plugins-loading.md` | Plugin loading reference (in-place and copied plugins, plugin ids such as `@inline` and `@skills-dir`) | https://code.claude.com/docs/en/plugins/loading |
| `plugins-create.md` | Create a Claude Code plugin (load a plugin for one session with `--plugin-dir`) | https://code.claude.com/docs/en/plugins/create |
| `plugins-install.md` | Install and manage plugins (install scopes, turning a plugin on and off) | https://code.claude.com/docs/en/plugins/install |
| `plugins-cli-reference.md` | Plugin commands reference (`claude plugin validate`, `claude plugin test`, `/reload-plugins`) | https://code.claude.com/docs/en/plugins/cli-reference |
| `agent-sdk-plugins.md` | Plugins in the SDK (how an Agent SDK app loads a plugin). Not linked from the mods pages; captured because the overview says a mod's hooks run in the Agent SDK. | https://code.claude.com/docs/en/agent-sdk/plugins |

### Files from Anthropic's public GitHub repositories

| File | What it is | Source |
| --- | --- | --- |
| `types-claude-code.d.ts` | The TypeScript declarations for mods, which the reference page calls the complete reference. Its first line says Claude Code 2.1.277 wrote it. | https://github.com/anthropics/claude-code/blob/main/mods/types/claude-code.d.ts |
| `builtin-mods-readme.md` | README of the `mods` folder in the Claude Code repository: the four mods built into Claude Code and how their tests are written | https://github.com/anthropics/claude-code/tree/main/mods |
| `sample-mods-readme.md` | README of the sample mods folder in the `claude-code-playground` repository | https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods |
| `sample-token-weather.md` | README of the `token-weather` sample mod | https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods/token-weather |
| `sample-blast-radius.md` | README of the `blast-radius` sample mod | https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods/blast-radius |
| `sample-replay-theater.md` | README of the `replay-theater` sample mod | https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods/replay-theater |

## Notes

- Links inside the pages are kept as published. Links that start with `/docs/en/` are relative to https://code.claude.com. Links inside the GitHub READMEs are relative to their folder on GitHub.
- Each captured Markdown file starts with a header naming its source URL and capture date. `types-claude-code.d.ts` starts with the same header written as `//` comment lines, so the file stays valid TypeScript.
- The documentation describes Claude Code v2.1.287, the first version where mods are on by default (`overview.md`, "Turn mods on or off"). Three captured files are older than that and say so:
  - `types-claude-code.d.ts` was written by Claude Code 2.1.277 and opens with "EARLY ACCESS: this surface may change between releases without notice." `reference.md` warns that the GitHub copy can be older than the installed version, and that the copy Claude Code writes for your version wins.
  - `builtin-mods-readme.md` ends with "Early access: hooks modules load only where function hooks are enabled", which the documentation no longer says.
  - The three sample READMEs say each sample "was built and tested on 2.1.280".
- Two pages in the parent folder were captured on 2026-09-27, before mods were documented, and the live pages have changed since. `../hooks.md` now has a paragraph that points function hooks to the mods pages. `../settings-reference.md` now describes what `disableAllHooks`, `allowManagedHooksOnly`, `prependPlugins`, and `appendPlugins` do to mods. Neither was captured again here; capture them again in the parent folder and update its `SOURCE-RECORD.md` when those sections are needed. The mods pages state the same rules for mods.
- Not captured, although the mods pages link to them: the organization and managed-settings pages (`/docs/en/plugins/org`, `/docs/en/managed-settings`, `/docs/en/server-managed-settings`), the sandboxing, Remote Control, cloud session, WSL, cross-session messaging, prompt caching, keybindings, and environment variable pages, and the source code of the built-in and sample mods. They are about administration or neighboring features, not about writing a mod.
- Firecrawl use for this capture: 27 scrapes and 1 map, including pages read for comparison and not kept (`llms.txt`, and the live `hooks` and `settings-reference` pages).
