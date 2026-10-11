# Known problems with Notion memory

This file holds what is known to go wrong when memory in Notion is set up. Open it when a step of [notion-memory-setup.md](../notion-memory-setup.md) does not work as expected. Each line names a problem, and what to do.

- **`{{CURRENT_STATE_PAGE_ID}}` is still in a settings file at the finish.** The page's id was not put in. `grep -n '{{' .claude/settings.json .codex/hooks.json` shows where.
- **In Codex, the session-start check prints "could not be read here".** The command could not reach Notion in this session. Check access and the active network permissions before treating it as a configuration failure. [reference/setup-problems.md](../../../../reference/setup-problems.md), "Host permissions", gives the process for a blocked command.
- **The owner trusted the Codex hooks before the page's id was put in.** A changed hook must be trusted again. Tell the owner.
