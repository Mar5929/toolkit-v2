# Context from past work

This file says how to read a project's past work, such as code, commits, documents, or earlier agent sessions, before the interview, and how to use what you found in the interview.

The goal is that the project's files start out holding what the owner and earlier agents already worked out, so that the owner does not have to explain it again. The job is done when the interview has offered what the past work shows as answers, and each fact the owner confirmed is written in its place.

## Before the interview: find and read the past work

1. Look on this computer for the project's past sessions in Claude Code and Codex, including sessions that ran in the project's worktrees. Each host keeps them in the owner's home folder: at the time of writing, Claude Code under `~/.claude/projects/` and Codex under `~/.codex/sessions/`. Confirm where the installed version keeps them.
2. Tell the owner what you found, such as how many sessions there are and the dates they cover. Ask whether you may read them, and whether there is anywhere else to look, such as Notion pages, documents, other repositories, or sessions on another computer. Read only what the owner says yes to.
3. Read the material and pick out the facts a later session would need, by the rows of "Where information goes" in the project's `AGENTS.md`.
4. Keep a short list of what you found in your plan, or in your message to the owner, so that a later turn can still use it. Write nothing in the project yet: the owner has not confirmed the facts, and the places for memory and work items are not chosen yet.

## In the interview: use what you found

- Offer what the past work shows as the answer to each question it covers, such as the project's purpose, the people, the systems, the outside tools, and the roadmap. Say that the answer comes from past sessions, and the owner confirms or corrects it.
- At question 10, show the owner the facts that no answer has used yet, grouped by where each fact would go. Use the place that the project's `AGENTS.md`, "Where information goes", gives for each kind of fact, in the form that the guide of that folder gives. Use the project's memory choice for memory.
- Mark what only an agent said in a session as not confirmed. Write each fact after the owner confirms it.
- Name the host and the date of the session as the source of each fact. Never file a session file itself as a source, and never copy a secret, such as a key, a password, or a token, into a project file.
