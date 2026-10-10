# Known problems with Notion memory

This file holds what is known to go wrong when memory in Notion is set up. Open it when a step of [notion-memory-setup.md](../notion-memory-setup.md) does not work as expected. Each line names a problem, and what to do.

- **`{{CURRENT_STATE_PAGE_ID}}` is still in a settings file at the finish.** The page's id was not put in. `grep -n '{{' .claude/settings.json .codex/hooks.json` shows where.
- **In Codex, the session-start check prints "could not be read here".** That text comes from the Codex sandbox, which blocks the network, and it is not a setup failure. Run the command escalated, as [SKILL.md](../../../../SKILL.md), "Known problems", says under "In Codex".
- **The owner trusted the Codex hooks before the page's id was put in.** A changed hook must be trusted again. Tell the owner.
