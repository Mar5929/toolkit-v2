# Skills, hook commands, and settings

This file says which skills, hook commands, and settings a project has, and what each of the owner's choices changes in the settings. Open it at step 5 of "New project" in `SKILL.md`, and whenever another file sends you to "Merge rules".

The job is done when the settings files hold what the owner's choices need, every entry that the owner had is still there, and everything under "What must be true when the settings are done" holds.

In an update, a check of the setup, or a move-over, the files are built in a temporary folder first. `<copy>` stands for that folder, and `reference/setup-copy.md` says how it is made. `<skill folder>` stands for the folder that holds this skill's `SKILL.md`.

## Contents

- Skills
- Hook commands
- The settings every project gets
- What a choice changes in the settings
- Merge rules
- The older plugins, off in this project
- What must be true when the settings are done
- Known problems

## Skills

Every skill is in `.claude/skills/`, one folder per skill. Claude Code reads that folder. Codex reads `.agents/skills`, which is a link to that folder.

The shared skills are the same in every project (10): `managing-work-items`, `filing-project-records`, `handoff`, `braindump`, `session-summary`, `filechanges`, `pull-latest`, `reset-to-remote`, `merge-and-clean-up`, `publish-docs`. `every-project/` holds them.

Each choice adds the skills in the table below. `reference/setup-copy.md`, "Folders the choices add", says which folders hold them.

| Choice | Skills |
| --- | --- |
| Work items local | none |
| Work items in Notion | `using-notion-cli` |
| Work items in GitHub Issues | none |
| Memory local | `managing-project-memory` |
| Memory in Notion | `managing-project-memory`, `using-notion-cli` |
| Memory in Hindsight | none: the agent uses the tools of Hindsight's coding-agent add-on. `references/hindsight-on-vps.md`, "How the owner's Hindsight is set up", describes the add-on. |
| Salesforce | `sf-component-tracker`, `sf-data-change`, and `sf-deploy-check`. The owner installs Salesforce's own skills. `choices/salesforce/salesforce-setup.md`, "Salesforce's skills", says how to check that they are installed, and what to tell the owner when they are not. |

A work choice adds no skill. It adds the selected `references/work-tracker.md` inside `managing-work-items`. A local or Notion memory choice adds the selected `references/memory-store.md` inside `managing-project-memory`.

## Hook commands

A hook command is a command that Claude Code or Codex runs by itself at a fixed moment, for example at session start. Every project has three, in `.claude/hooks/`: `session-start.mjs`, `prompt-reminder.mjs`, and `codex-after-commit.mjs`. `every-project/` holds them. Both Claude Code and Codex run the three commands from `.claude/hooks/`.

`prompt-reminder.mjs` runs on every message. It prints one line that tells the agent to check the project's skills, then a memory reminder when the message has a phrase such as "remember this", and then the whole text of the rule `.claude/rules/evaluate-the-owners-request.md`. It reads that rule file each time it runs, so the project's rule file is the only place where the rule's text is kept.

## The settings every project gets

`every-project/` holds three complete settings files. A project gets all three, whether or not the owner uses Codex today.

| File | Who reads it | What it holds |
| --- | --- | --- |
| `.claude/settings.json` | Claude Code | No AI credit on a commit or a pull request. Claude Code's own memory off. The older claude-toolkit plugins off. The Plain English output style. The Git commands that are refused or asked about. The hooks: session start, every message, after a commit, and after a helper agent returned. More room for the list of skills. |
| `.codex/hooks.json` | Codex | The same hooks, written the way Codex reads them: session start, every message, after a commit, and when a helper agent started or returned. |
| `.codex/config.toml` | Codex | The older claude-toolkit plugins off, and `max_context_tokens = 10000` under `[skills]`. |

A helper agent is a separate agent that a session starts for one job.

As the files are copied, memory is set to local: the session-start line ends with the word `local`. The next section says what another choice changes.

Never change the command or the text of one of the toolkit's hooks, because they are written to match the three hook commands.

## What a choice changes in the settings

The work tracking choice changes nothing in the settings. The table gives every change that a choice makes.

| Choice | `.claude/settings.json` | `.codex/hooks.json` |
| --- | --- | --- |
| Memory local | Nothing. | Nothing. |
| Memory in Notion | In the session-start hook, the last entry of `args` is `"local"`. Put these three entries in its place: `"notion"`, `"--page"`, `"{{CURRENT_STATE_PAGE_ID}}"`. | The session-start command ends with `--memory local`. Make it end with `--memory notion --page {{CURRENT_STATE_PAGE_ID}}`. |
| Memory in Hindsight | In the session-start hook, change the last entry of `args` from `"local"` to `"hindsight"`. In the every-message hook, add two entries at the end of `args`: `"--skill"`, `"hindsight"`. | Make the session-start command end with `--memory hindsight`. Add ` --skill hindsight` at the end of the every-message command. |
| Salesforce | Add the entries that `choices/salesforce/salesforce-setup.md`, "The refuse list", gives to `permissions.deny`. | Nothing. |

The owner's answer about Claude Code's own memory is one line in `.claude/settings.json`: `"autoMemoryEnabled"` is `false` when the owner wants it off, which is the default, and `true` when the owner wants it on.

## Merge rules

These rules apply every time the toolkit's settings meet a settings file that already exists: in a project that had its own settings file before setup, in an update, in a move-over, and when the memory choice changes.

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

## The older plugins, off in this project

The toolkit's settings turn the older claude-toolkit plugins off for this project only. The skills of those plugins have the same names as Toolkit V2 skills (`handoff`, `pull-latest`, and others), so both would load.

This computer may have more of those plugins than the settings name. These three commands list every plugin that this computer has, and change nothing:

```text
jq -r '.enabledPlugins // {} | keys[]' ~/.claude/settings.json
jq -r '.plugins // {} | keys[]' ~/.claude/plugins/installed_plugins.json
grep -o 'plugins\."[^"]*"' ~/.codex/config.toml
```

Turn off each plugin in the list that the settings do not already name and whose name is one of these:

- a name that ends in `@claude-toolkit`;
- a `@toolkit-v2` name other than `toolkit@toolkit-v2`. These are the retired `work`, `memory`, `session-skills`, `git-workflows`, and Salesforce architect plugins.

To turn off one such plugin, do both of these in the project:

- add `"<name>": false` under `enabledPlugins` in `.claude/settings.json`;
- add this table to `.codex/config.toml`:

  ```toml
  [plugins."<name>"]
  enabled = false
  ```

Never turn off `toolkit@toolkit-v2`, which holds this skill. Never change the files in `~/.claude` or `~/.codex`.

## What must be true when the settings are done

- `.claude/skills` holds the 10 shared skills and the skills that the table under "Skills" gives for the owner's choices, each with a `SKILL.md`. It holds no skill of a choice the owner did not make. A skill of the owner's own may be there too.
- `.claude/settings.json` and `.codex/hooks.json` are valid JSON.
- Every hook command that the settings name is in `.claude/hooks/`.
- Each of the toolkit's own hook handlers is in each settings file once.
- The session-start line names the owner's memory choice in both files.
- `.claude/settings.json` has no `Stop` hook of type `prompt`, and the Codex helper reminder has only the matcher `^(collaboration)?(spawn_agent|wait_agent)$`.
- `.codex/config.toml` has each table once, and `[skills]` holds `max_context_tokens = 10000`.
- The `description` in `.codex/hooks.json` contains the description text of the toolkit's file.

## Known problems

- **`{{CURRENT_STATE_PAGE_ID}}` is still in a settings file.** With Notion memory it stays until the Notion memory setup knows the id of the Notion page named "Current state". `choices/notion-shared/notion-setup.md`, "The links in PROJECT.md", says when and where to put that id.
- **`.codex/hooks.json` accepts only `description` and `hooks` at the top level.** Put nothing else there.
  - In a file that the project already had, a `description` that does not contain the toolkit's text keeps the text it has. Add the toolkit's text after it, with one space between them.
  - One sentence is the exception. A sentence that starts "Toolkit V2 hooks for this project in Codex:" is the toolkit's own earlier text, so replace that sentence with the toolkit's text. Put that change in the numbered table that the owner sees. `reference/placing-files.md`, "3. Files the project already has", and `reference/update.md` say how to show that table.
- **A settings file writes a key another way than the toolkit does.** Another way is a dotted key such as `plugins."x@y".enabled = false`, or an inline table. Leave the file as it is and ask the owner.
- **A settings file holds an entry that an earlier version of the toolkit put there and the toolkit no longer has.** `reference/update.md`, "4. What the toolkit no longer ships", says what to do with it. Two such entries are a `Stop` hook of type `prompt`, and a Codex helper reminder with a matcher other than `^(collaboration)?(spawn_agent|wait_agent)$`. Take each one out as that section says, and never add either one.
- **Codex cuts every skill description short.** Codex does this when the list of skills passes its limit, which is 2% of the model's context window by default. The Toolkit skills then lose their "Use when" and "Not for" parts. `max_context_tokens = 10000` under `[skills]` prevents this. That value is the largest that Codex accepts there, and it is more than the 2% default for a model with a context window under 500,000 tokens.
- **A plugin from the owner's ChatGPT account cannot be turned off in the project.** The name of such a plugin ends in `@openai-curated-remote`. The account's own setting replaces a table for it in the project's file, so never add one.
- **A changed Codex hook entry does not run.** Codex skips a hook until the owner trusts it in `/hooks`, and again after any change to its entry in `.codex/hooks.json`. Tell the owner.
- **Codex refuses to create `.codex/`.** `SKILL.md`, "In Codex", says how to run such a command.
