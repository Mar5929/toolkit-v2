# Skills, hook commands, and settings

This file says which skills, hook commands, and settings every project has, and how a settings file that already exists is merged. Open it whenever a settings file changes, and whenever another file sends you to "Merge rules". The setup file of a choice gives, in a step or in the file that a step names, the lines that the choice changes in the settings.

The job is done when the settings files hold what the owner's choices need, every entry that the owner had is still there, and everything under "What must be true when the settings are done" holds.

In a setup, change the project's own settings files. In an update or a check of the setup, the files are built in a temporary folder first, and [reference/setup-copy.md](setup-copy.md) says how that folder is made.

## Contents

- Skills
- Hook commands
- The settings every project gets
- What a choice changes in the settings
- Merge rules
- What must be true when the settings are done
- Known problems

## Skills

Every skill is in `.claude/skills/`, one folder per skill. Claude Code reads that folder. Codex reads `.agents/skills`, which is a link to that folder.

The shared skills are the same in every project: `managing-work-items`, `filing-project-records`, `handoff`, `braindump`, `shaping-a-prompt`, `session-summary`, `pull-latest`, `reset-to-remote`, `merge-and-clean-up`, `publish-docs`. `every-project/` holds them.

A choice may add a skill, or files inside a skill that the project already has. The setup file of each choice says what it adds.

## Hook commands

A hook command is a command that Claude Code or Codex runs by itself at a fixed moment, for example at session start. Every project has three, in `.claude/hooks/`: `session-start.mjs`, `prompt-reminder.mjs`, and `codex-after-commit.mjs`. `every-project/` holds them. Both Claude Code and Codex run the three commands from `.claude/hooks/`.

`prompt-reminder.mjs` runs on every message. It prints one line that tells the agent to check the project's skills, then a memory reminder when the message has a phrase such as "remember this", and then the whole text of the rule `.claude/rules/evaluate-the-owners-request.md`. It reads that rule file each time it runs, so the project's rule file is the only place where the rule's text is kept.

## The settings every project gets

`every-project/` holds three complete settings files. A project gets all three, whether or not the owner uses Codex today.

| File | Who reads it | What it holds |
| --- | --- | --- |
| `.claude/settings.json` | Claude Code | No AI credit on a commit or a pull request. Claude Code's own memory off. The Plain English output style. The Git commands that are refused or asked about. The hooks: session start, every message, after a commit, and after a helper agent returned. More room for the list of skills. |
| `.codex/hooks.json` | Codex | The same hooks, written the way Codex reads them: session start, every message, after a commit, and when a helper agent started or returned. |
| `.codex/config.toml` | Codex | `max_context_tokens = 10000` under `[skills]`. |

A helper agent is a separate agent that a session starts for one job.

As the files are copied, memory is set to local: the session-start line ends with the word `local`. The next section says what another choice changes.

Never change the command or the text of one of the toolkit's hooks, because they are written to match the three hook commands.

## What a choice changes in the settings

The setup file of each choice gives, in a step or in the file that a step names, the lines that the choice changes in `.claude/settings.json` and `.codex/hooks.json`. Work items in local files, Notion, or GitHub Issues, and memory in local files, change nothing.

The owner's answer about Claude Code's own memory is one line in `.claude/settings.json`: `"autoMemoryEnabled"` is `false` when the owner wants it off, which is the default, and `true` when the owner wants it on.

## Merge rules

These rules apply every time the toolkit's settings meet a settings file that already exists: in a project that had its own settings file before setup, in an update, and when the memory choice changes.

- **Add what is missing.** Add each entry and each plain value (text, a number, true or false) that the file does not have.
- **Never delete any other entry.** Apart from the toolkit's own hook handlers, which the rule on replacing them lists below, every entry stays: the permission rules, the Git deny and ask rules, the entries of `permissions.deny` for a production Salesforce org, and the hooks that the owner added.
- **Ask before you change a value.** When a file that the project already had holds a plain value that differs from the toolkit's value, ask the owner. In a file that the copy just brought, take the toolkit's value.
- **Replace the toolkit's own hook handlers. Never keep an old one beside a new one.** A hook handler is one entry in a settings file that says what a hook runs. The toolkit's own hook handlers are:
  - a handler whose `args` or `command` names `session-start.mjs`, `prompt-reminder.mjs`, or `codex-after-commit.mjs`;
  - the `echo` handler in the `PostToolUse` group whose matcher is `Agent`;
  - the `echo` handler in the `.codex/hooks.json` `PostToolUse` group whose matcher is `^(collaboration)?(spawn_agent|wait_agent)$`.
- **Show the owner a handler before you replace it.** When the file already has the toolkit's own hook handlers, as in an update or after a changed memory choice, show the owner the old and the new handlers. Then remove the old ones, and any group or event they leave empty, and put in the new ones.
- **Leave a handler that is already right.** When the file's handler and the toolkit's handler are the same, apart from a page id that was written in place of `{{CURRENT_STATE_PAGE_ID}}`, change nothing and ask nothing. The handler keeps its page id.
- **When you cannot tell whether an entry is the toolkit's, ask the owner.**

## What must be true when the settings are done

- `.claude/skills` holds the shared skills listed above and the skills that the setup files of the owner's choices name, each with a `SKILL.md`. It holds no skill of a choice the owner did not make. A skill of the owner's own may be there too.
- `.claude/settings.json` and `.codex/hooks.json` are valid JSON.
- Every hook command that the settings name is in `.claude/hooks/`.
- Each of the toolkit's own hook handlers is in each settings file once, apart from a handler that the setup file of one of the owner's choices takes out.
- The session-start line, where the project has one, names the owner's memory choice in both files.
- `.claude/settings.json` has no `Stop` hook of type `prompt`, and the Codex helper reminder has only the matcher `^(collaboration)?(spawn_agent|wait_agent)$`.
- `.codex/config.toml` has each table once, and `[skills]` holds `max_context_tokens = 10000`.
- The `description` in `.codex/hooks.json` contains the description text of the toolkit's file.

## Known problems

- **`.codex/hooks.json` accepts only `description` and `hooks` at the top level.** Put nothing else there.
  - In a file that the project already had, a `description` that does not contain the toolkit's text keeps the text it has. Add the toolkit's text after it, with one space between them.
  - One sentence is the exception. A sentence that starts "Toolkit V2 hooks for this project in Codex:" is the toolkit's own earlier text, so replace that sentence with the toolkit's text. Put that change in the numbered table that the owner sees. [reference/placing-files.md](placing-files.md), "Files the project already has", and [reference/update.md](update.md), "3. What to do with each kind of file", say how to show that table.
- **A settings file writes a key another way than the toolkit does.** Another way is a dotted key such as `plugins."x@y".enabled = false`, or an inline table. Leave the file as it is and ask the owner.
- **A settings file holds an entry of the toolkit's that the toolkit no longer ships.** [reference/update.md](update.md), "4. What the toolkit no longer ships", says what to do with it.
- **Codex cuts every skill description short.** Codex does this when the list of skills passes its limit, which is 2% of the model's context window by default. The Toolkit skills then lose their "Use when" and "Not for" parts. `max_context_tokens = 10000` under `[skills]` prevents this. That value is the largest that Codex accepts there, and it is more than the 2% default for a model with a context window under 500,000 tokens.
- **A changed Codex hook entry does not run.** Codex skips a hook until the owner trusts it in `/hooks`, and again after any change to its entry in `.codex/hooks.json`. Tell the owner.
- **Codex refuses to create `.codex/`.** [reference/setup-problems.md](setup-problems.md), "Host permissions", explains how to handle a blocked command under the active session settings.
