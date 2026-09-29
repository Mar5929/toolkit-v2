# Review and Save Project Memory

This rule applies to the main agent. The project's one memory store is the system named in `.toolkit.json`; with built-in memory it is the local `.memory/` folder. Claude's native auto-memory and the `claude-toolkit` Second Brain plugin are off in this project. The session-start briefing shows the current focus in Claude Code and Codex.

## When to review memory

- Review memory after an explicit remember or forget request, a correction, a standing preference, a meaningful decision or discovery, a significant fix or episode, a change of people, tools, or references, a focus shift, a finished work item, and a handoff.
- A hook reminder is not a save decision. The toolkit's `UserPromptSubmit` hook flags only explicit keep phrases, and its Stop hook checks once per turn that such a phrase was handled. Do not save on every hook reminder or every turn. A review can end with nothing saved.

## Where it goes

- Decide the home first, with the memory criteria (`.memory/memory-criteria.md` with built-in memory) and the "Where information goes" table in `AGENTS.md`.
- The owner's instructions for how the agent works go to `.claude/rules/owner-preferences.md` (`toolkit rule add`), never to memory.
- A small memory pointer may route future sessions to a hard-to-find record, without copying its body.

## How to save

- Save, correct, and retire memory only through the `memory-save` skill, which runs `toolkit memory` commands and holds the approval policy. There is no curator agent.
- The approval mode is `memory.approval` in `.toolkit.json`. Only an explicit owner instruction changes it.
- A yes approves only the operation and meaning shown. Silence approves nothing. An unanswered save question stays a proposal: do not rely on it; `work-decide` shows it to the owner until he approves or rejects it.
- If the owner says a proposed item should not be memory, withdraw it. When his feedback gives a general selection rule, write it with `toolkit rule add` and check later candidates against it. Do not restate the rejected fact in the current focus or another topic.
- A focus-only change, or glossary maintenance the owner already authorized, is saved without a lasting-memory question.
- Group several independent signals into one save. Never run two writes to the same topic or index at once.
- Before you say a save worked, read it back with `toolkit memory get` and run `toolkit doctor`. Then tell the owner briefly what was kept or what needs his decision.
