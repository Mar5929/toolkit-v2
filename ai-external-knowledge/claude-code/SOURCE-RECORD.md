# Claude Code documentation: skills, plugins, hooks, subagents, and instructions

- Publisher: Anthropic
- Original documentation home: https://code.claude.com/docs/en/
- Captured on: 2026-09-27; four pages added or refreshed on 2026-09-29 (see Notes)
- Captured with: the Firecrawl CLI 1.24.3, `firecrawl scrape <page URL>.md --format rawHtml`, which returns the Markdown source the site publishes for each page, unchanged.
- Pages: 20
- Redistribution: Anthropic's published documentation, kept here as a private reference copy for this repository. Not shipped in any plugin.

## Project use

Read before writing or changing a Toolkit V2 skill, hook, plugin manifest, agent, output style, or instruction file for Claude Code, and when checking how Claude Code lists and selects skills.

## Coverage

| File | Page | Source |
| --- | --- | --- |
| `skills.md` | Extend Claude with skills | https://code.claude.com/docs/en/skills |
| `features-overview.md` | Extend Claude Code (when to use CLAUDE.md, skills, subagents, hooks, MCP, plugins) | https://code.claude.com/docs/en/features-overview |
| `plugins-overview.md` | Plugins overview | https://code.claude.com/docs/en/plugins/overview |
| `plugins-components.md` | Add components to a plugin | https://code.claude.com/docs/en/plugins/components |
| `plugins-manifest-reference.md` | Plugin manifest reference | https://code.claude.com/docs/en/plugins/manifest-reference |
| `plugin-evals.md` | Test plugins with evals | https://code.claude.com/docs/en/plugin-evals |
| `hooks.md` | Hooks reference | https://code.claude.com/docs/en/hooks |
| `hooks-guide.md` | Automate actions with hooks | https://code.claude.com/docs/en/hooks-guide |
| `sub-agents.md` | Create custom subagents | https://code.claude.com/docs/en/sub-agents |
| `agents.md` | Run agents in parallel | https://code.claude.com/docs/en/agents |
| `workflows.md` | Orchestrate subagents at scale with dynamic workflows | https://code.claude.com/docs/en/workflows |
| `output-styles.md` | Output styles | https://code.claude.com/docs/en/output-styles |
| `memory.md` | How Claude remembers your project (CLAUDE.md, AGENTS.md, rules) | https://code.claude.com/docs/en/memory |
| `best-practices.md` | Best practices for Claude Code | https://code.claude.com/docs/en/best-practices |
| `common-workflows.md` | Common workflows | https://code.claude.com/docs/en/common-workflows |
| `settings-reference.md` | All settings (includes `skillListingBudgetFraction` and `skillListingMaxDescChars`) | https://code.claude.com/docs/en/settings-reference |
| `context-window.md` | Explore the context window (includes what the skill listing costs and whether it survives compaction) | https://code.claude.com/docs/en/context-window |
| `large-codebases.md` | Set up Claude Code in a monorepo or large codebase (per-directory CLAUDE.md compared with path-scoped rules) | https://code.claude.com/docs/en/large-codebases |
| `debug-your-config.md` | Debug your configuration (why instructions and rules are not followed) | https://code.claude.com/docs/en/debug-your-config |
| `claude-directory.md` | Explore the .claude directory (where rules, skills, and settings live, and when each loads) | https://code.claude.com/docs/en/claude-directory |

## Notes

- The old address https://code.claude.com/docs/en/plugins now serves the "Plugins overview" page, and https://code.claude.com/docs/en/plugins-reference now serves the "Plugin manifest reference" page. The plugin documentation was split into several pages under `/docs/en/plugins/`.
- The old Anthropic engineering article "Claude Code best practices" (https://www.anthropic.com/engineering/claude-code-best-practices) now redirects to `best-practices.md` here.
- Links inside the pages are kept as published. Links that start with `/docs/en/` are relative to https://code.claude.com.
- Each captured file starts with a header naming its source URL and capture date.
- A larger capture of this site (164 pages, captured 2026-09-22) is in `/Users/michaelrihm/Documents/Projects/claude-toolkit/ai-external-knowledge/claude-code/`. That folder belongs to another repository and is read-only from here.
- 2026-09-29: `large-codebases.md`, `debug-your-config.md`, and `claude-directory.md` were added for the rules audit in `dev/research/rules-best-practices.md`. `memory.md` was captured again the same day: the live page had added the `/doctor prompt-audit` paragraph under "Write effective instructions" and the `includeGitInstructions` line under "Claude isn't following my CLAUDE.md".
