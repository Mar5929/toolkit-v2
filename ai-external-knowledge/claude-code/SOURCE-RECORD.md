# Claude Code documentation: skills, plugins, hooks, subagents, and instructions

- Publisher: Anthropic
- Original documentation home: https://code.claude.com/docs/en/
- Captured on: 2026-10-05. Every page was captured again that day, and 12 pages were added (see Notes). The earlier capture dates were 2026-09-27, 2026-09-29, and 2026-09-30.
- Captured with: the Firecrawl CLI 1.24.3, `firecrawl scrape <page URL>.md --format rawHtml`, which returns the Markdown source the site publishes for each page, unchanged. The 2026-10-05 capture used the same command with `-o <file>`.
- Claude Code version on the capture date: 2.1.289.
- Pages: 33 (21 captured again on 2026-10-05, 12 added on 2026-10-05). The `mods/` folder has its own record.
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
| `agent-sdk-hooks.md` | Intercept and control agent behavior with hooks (Agent SDK callback hooks) | https://code.claude.com/docs/en/agent-sdk/hooks |
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
| `settings.md` | Claude Code settings (where settings files live and how they combine) | https://code.claude.com/docs/en/settings |
| `commands.md` | Commands (every built-in `/` command) | https://code.claude.com/docs/en/commands |
| `plugins-marketplace-reference.md` | Plugin marketplace reference (`marketplace.json`) | https://code.claude.com/docs/en/plugins/marketplace-reference |
| `plugins-dependencies.md` | Constrain plugin dependency versions | https://code.claude.com/docs/en/plugins/dependencies |
| `plugins-troubleshooting.md` | Plugin troubleshooting | https://code.claude.com/docs/en/plugins/troubleshooting |
| `plugins-publish.md` | Publish plugins (share without a marketplace, your own marketplace, Anthropic's directory) | https://code.claude.com/docs/en/plugins/publish |
| `worktrees.md` | Worktrees (parallel sessions in separate Git worktrees) | https://code.claude.com/docs/en/worktrees |
| `agent-sdk-skills.md` | Agent SDK: Extend agents with skills | https://code.claude.com/docs/en/agent-sdk/skills |
| `agent-sdk-subagents.md` | Agent SDK: Subagents | https://code.claude.com/docs/en/agent-sdk/subagents |
| `agent-sdk-claude-code-features.md` | Agent SDK: Use Claude Code features (settings, skills, memory, hooks in an SDK app) | https://code.claude.com/docs/en/agent-sdk/claude-code-features |
| `whats-new-index.md` | What's new (the weekly digest index; lists every week's digest) | https://code.claude.com/docs/en/whats-new |
| `whats-new-2026-w37.md` | What's new, week 37 (September 7-11, 2026; `claude plugin eval`, `maxEffortLevel`) | https://code.claude.com/docs/en/whats-new/2026-w37 |

## Notes

- The old address https://code.claude.com/docs/en/plugins now serves the "Plugins overview" page, and https://code.claude.com/docs/en/plugins-reference now serves the "Plugin manifest reference" page. The plugin documentation was split into several pages under `/docs/en/plugins/`.
- The old Anthropic engineering article "Claude Code best practices" (https://www.anthropic.com/engineering/claude-code-best-practices) now redirects to `best-practices.md` here.
- Links inside the pages are kept as published. Links that start with `/docs/en/` are relative to https://code.claude.com.
- Each captured file starts with a header naming its source URL and capture date.
- A larger capture of this site (164 pages, captured 2026-09-22) is in `/Users/michaelrihm/Documents/Projects/claude-toolkit/ai-external-knowledge/claude-code/`. That folder belongs to another repository and is read-only from here.
- 2026-09-29: `large-codebases.md`, `debug-your-config.md`, and `claude-directory.md` were added for the rules audit in `dev/research/rules-best-practices.md`. `memory.md` was captured again the same day: the live page had added the `/doctor prompt-audit` paragraph under "Write effective instructions" and the `includeGitInstructions` line under "Claude isn't following my CLAUDE.md".
- 2026-09-30: `agent-sdk-hooks.md` was added. Mike named it in the interview (Topic 6) as one of the two pages to read before building the hooks. It covers hooks written as code in an Agent SDK app; Toolkit V2 uses settings-file hooks (`hooks.md`). What it changes for the build is in `dev/research/skills-first-architecture.md`, section 6.

## Release notes

The full changelog page is https://code.claude.com/docs/en/changelog. It was not captured, because the page is about 940 KB. Read it on the web, or fetch it when you need the release notes for one version. The weekly digest index is `whats-new-index.md`; only week 37 (`whats-new-2026-w37.md`) is captured, and the index links to the other weeks.

## What changed since 2026-09-27

Source: the comparison the helper made on 2026-10-05, checked against the stored files. All 21 pages in this folder changed. Many changes are small (table markup, wording). The ones that matter for Toolkit V2:

- `skills.md`: new frontmatter field `effort` and a `${CLAUDE_EFFORT}` value; Claude runs a skill named `verify` or `simplify` before each commit (v2.1.286 or later); a section on the bundled `/claude-api` skill; rules for what happens when a skill name matches a built-in command or another skill; a new section says a skill name typed after plain text only gives permission to run the skill; `allowManagedPermissionRulesOnly` makes Claude Code ignore `allowed-tools` in project and personal skills.
- `hooks.md`: the `if` field and how its Bash patterns match; the `asyncRewake` field; the `/hooks` read-only browser; an `effort` input field; `session_title` input; `UserPromptSubmit` also fires for scheduled tasks, background subagents, and messages from other sessions; the `suppressOriginalPrompt` output field; a pointer to function hooks in mods.
- `settings-reference.md`: new keys `modelSettings`, `prependPlugins`, `appendPlugins`, `allowedProviders`, `defaultToAgentsView`, `copyFullResponse`, `leftArrowOpensAgents`, `prStatusFooterEnabled`, the Chrome keys, and two sandbox network keys; ultracode start-up setting; the key that blocks reads outside the working directories was reworded.
- `plugins-manifest-reference.md`: directory listing fields (`icon`, `documentationUrl`, `supportUrl`, `privacyPolicyUrl`, `termsOfServiceUrl`); `claude plugin validate` now rejects plugin names that start with `claude-` or `anthropic-` and warns on names that use those words; a `types` field for mods; hooks files need a top-level `hooks` key; `requestTimeout` for bundled servers; `experimental.evals`.
- `plugins-components.md`: monitors, the `modules` key for mods, and `user_config` for bundled servers.
- `memory.md`: size and structure guidance for CLAUDE.md (under 200 lines per file) and a section on auditing instruction files.
- `sub-agents.md` and `agents.md`: which model the built-in Explore agent uses; named background subagents in the @-mention list.
- `plugin-evals.md`: scoring against a no-plugin baseline, the judge model option.
- `workflows.md`: ultracode, a setting that plans a workflow for each substantial task.
- `claude-directory.md`: installed-plugin files and a `dev-mods/` folder in the `.claude` directory.
- `hooks-guide.md`, `agent-sdk-hooks.md`, `best-practices.md`, `common-workflows.md`, `context-window.md`, `features-overview.md`, `large-codebases.md`, `output-styles.md`, `debug-your-config.md`, `plugins-overview.md`: small wording and example changes.
- The `mods/` folder has its own record.
- The 12 added pages are new to this folder. They were not diffed.
- Not captured on purpose: the changelog (see above) and the enterprise and administration pages.
