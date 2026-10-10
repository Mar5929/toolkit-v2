# What the Hindsight choice adds to a project

This file lists what setup writes into a project whose memory is kept in Hindsight. `hindsight-setup.md`, one folder up, names the step that uses it.

## `AGENTS.md`

Add this text at the top, with the bank's name filled in. The text is the owner's, and its three criteria are what the owner counts as memory:

> You (the agent) use hindsight for memory recall, storage, and insights in this project. You (the agent) are responsible for saving this type of information to the `<bank>` hindsight memory bank:
>
> Persistent project memory criteria (1 AND 2 AND 3):
>
> 1. Lasting project-specific facts, decisions, lessons, events, and constraints that not already owned by another memory file (we don't want duplicates).
> 2. It has lasting significance: losing it would cost a later agent real time or understanding.
> 3. It comes from the owner, or from work done together with the owner.

Below the owner's text, add this line: One thing may be saved without passing all three criteria: a significant failure that the agent found and fixed itself. The agent saves its cause and its fix.

With the default package, add these two lines below it:

```markdown
- No session is saved to Hindsight by itself in this project. When a fact meets the criteria above, save it with the add-on's tool for saving a document, as short as the fact allows.
- Never save a secret or a transcript.
```

## `PROJECT.md`, section "Toolkit settings"

Write `hindsight` on the "Memory" line, which every project has. Then add these seven lines to the section, each with its exact label:

| Line | What it holds |
| --- | --- |
| Hindsight bank | The bank's ID. |
| Hindsight server | The API address. |
| Hindsight dashboard | The link to the bank's page in the dashboard. |
| Hindsight package | The default package, with any approved changes recorded below. |
| Hindsight template | The published template the owner picked, or `own instructions`. |
| Hindsight changes | Each thing the owner wanted different from the package and the template. |
| Hindsight setup | `done`, or the steps of `hindsight-setup.md` that are still open. |

## The project's settings files

The project's settings files come with memory set to `local`. Change these four places:

| File | Hook | Change |
| --- | --- | --- |
| `.claude/settings.json` | `SessionStart` | In the `args` list, change the last entry from `"local"` to `"hindsight"`. |
| `.claude/settings.json` | `UserPromptSubmit` | Add two entries at the end of the `args` list: `"--skill"`, `"hindsight"`. |
| `.codex/hooks.json` | `SessionStart` | Make the command end with `--memory hindsight` in place of `--memory local`. |
| `.codex/hooks.json` | `UserPromptSubmit` | Add `--skill hindsight` at the end of the command. |

## No `memory/` folder

A Hindsight project gets no `memory/` folder and no Current State file. Hindsight is the project's memory, and the status of work is in the place where the work items are kept.
