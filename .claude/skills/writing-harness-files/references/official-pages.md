# Official pages by kind of file

This file says how to get the current official guidance for a kind of harness file, and gives the web address of the official page for each kind. Use it at step 2 of `SKILL.md`, so that a change follows what Claude Code and Codex do today and not what the writer remembers.

## How to get the current guidance

1. In Claude Code, first use the agent or skill that Claude Code provides for the job, when it is available. A later release of Claude Code may rename one of them.
   - For a question about how Claude Code treats a kind of file, such as a skill, a hook, a rule, a `CLAUDE.md`, a settings file, a plugin, or a subagent, use the built-in `claude-code-guide` agent.
   - To write a new skill, or to test whether a skill is chosen for the right requests, use the `skill-creator` skill. It comes from a plugin, so a computer may not have it.
   - To change a hook or a settings file, use the built-in `update-config` skill.
2. When none of these is available, open the address in the table below. Always do so for a Codex page: these three know nothing about Codex, and a Codex session has none of them.
3. A dated copy of a page counts only when it was captured in the last 14 days. When a line of this skill's checklist disagrees with the live page, the live page wins. Tell the owner which checklist line is out of date.

## The pages

Read the page for the product that reads the file. Read both when both do. A skill is the one exception: before you write or change a skill, read these three pages every time, whichever product reads the skill.

- The skill best practices page: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
- The Claude Code skill page, in the Skill row of the table below.
- The Codex skill page, in the same row.

Each address below returns the page as Markdown when `.md` is added to it, except the Codex best practices guide.

| Kind of file | Claude Code | Codex |
| --- | --- | --- |
| Skill | https://code.claude.com/docs/en/skills | https://learn.chatgpt.com/docs/build-skills |
| Rule, `CLAUDE.md`, `AGENTS.md` | https://code.claude.com/docs/en/memory | https://learn.chatgpt.com/docs/agent-configuration/agents-md |
| Hook | https://code.claude.com/docs/en/hooks and https://code.claude.com/docs/en/hooks-guide | https://learn.chatgpt.com/docs/hooks |
| Settings file | https://code.claude.com/docs/en/settings and https://code.claude.com/docs/en/settings-reference | https://learn.chatgpt.com/docs/config-file/config-basic and https://learn.chatgpt.com/docs/config-file/config-reference |
| Codex `.rules` file (which commands Codex may run outside the sandbox) | None: Claude Code sets command permissions in a settings file | https://learn.chatgpt.com/docs/agent-configuration/rules |
| Output style | https://code.claude.com/docs/en/output-styles | None: Codex has no output styles |
| Plugin manifest | https://code.claude.com/docs/en/plugins/overview and https://code.claude.com/docs/en/plugins/manifest-reference | https://learn.chatgpt.com/docs/build-plugins and https://developers.openai.com/plugins/build/plugins |
| Marketplace file | https://code.claude.com/docs/en/plugins/marketplace-reference | https://developers.openai.com/plugins/build/plugins |
| Subagent definition, helper brief | https://code.claude.com/docs/en/sub-agents | https://learn.chatgpt.com/docs/agent-configuration/subagents |
| Mod | https://code.claude.com/docs/en/plugins/mods/overview and https://code.claude.com/docs/en/plugins/mods/reference | None: Codex cannot run a mod |
| Any of them | https://code.claude.com/docs/en/best-practices | https://learn.chatgpt.com/guides/best-practices |
| What changed lately | https://code.claude.com/docs/en/whats-new (one page per week) and https://code.claude.com/docs/en/changelog (every release; a very long page) | No page is listed here. Read the Codex page for the kind of file again. |

A skill also follows the Agent Skills standard, which both products read:

- https://agentskills.io/specification
- https://agentskills.io/skill-creation/best-practices
- https://agentskills.io/skill-creation/optimizing-descriptions
- https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices

When an address no longer opens, find the page from the site's documentation index, use it, and tell the owner the address in this file is out of date.
