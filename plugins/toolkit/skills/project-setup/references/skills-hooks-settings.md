# Skills, hook commands, and settings

Use this file to add the settings snippets to the setup copy, and to check the skills and hook commands that the setup copy holds. The setup copy is the project's finished files, built in a temporary folder before anything is put into the project. Open this file at step 5 of "New project" in `SKILL.md`, and whenever another file sends you to "Merge rules".

The job is done when each snippet is merged into the settings file that the setup copy already holds, and every check under "Check" passes.

`<copy>` stands for the temporary folder that holds the setup copy, which `setup-copy.md` says how to make. `<skill folder>` stands for the folder that holds this skill's `SKILL.md`.

## Contents

- Skills
- Hook commands
- Settings snippets
- Merge rules
- The older plugins, off in this project
- Check

## Skills

Every skill is already in `<copy>/.claude/skills/`, one folder per skill, because the steps of `setup-copy.md` copied the setup folders for the owner's choices. A setup folder is a folder in this skill's `assets/` that holds project files at the paths a project has them. Claude Code reads that folder. Codex reads `.agents/skills`, which becomes a link to that folder. `placing-files.md`, "4. The .agents/skills link", says how to make the link.

The shared skills are the same in every project (10): `managing-work-items`, `filing-project-records`, `handoff`, `braindump`, `session-summary`, `filechanges`, `pull-latest`, `reset-to-remote`, `merge-and-clean-up`, `publish-docs`. The setup folder `every-project` holds them. A work choice adds the selected tracker references inside `managing-work-items`, not another skill.

Each choice adds the skills in the table below. `setup-copy.md`, "Folders the choices add", says which setup folders hold them.

| Choice | Skills |
| --- | --- |
| Work items local | none |
| Work items in Notion | `using-notion-cli` |
| Work items in GitHub Issues | none |
| Memory local | `managing-project-memory` |
| Memory in Notion | `managing-project-memory`, `using-notion-cli` |
| Memory in Hindsight | none: the agent uses the tools of Hindsight's coding-agent add-on (`hindsight-on-vps.md` in this folder) |
| Salesforce | `sf-component-tracker`, `sf-data-change`, and `sf-deploy-check`; Salesforce's own skills come from Salesforce and not from setup: in Claude Code the project's settings turn Salesforce's plugins on, and for Codex the owner installs the skills (`salesforce.md` in this folder) |

Two rows name another file of this skill:

- In the row "Memory in Hindsight", `hindsight-on-vps.md`, "What runs where", describes the add-on and the tools it gives the agent.
- In the row "Salesforce", `salesforce.md`, "Salesforce's skills", names the Salesforce plugins that the project turns on in Claude Code. It also says how to check that this computer has them, what to ask the owner once on each computer, and what the owner installs for Codex.

A work choice adds tracker references, and a local or Notion memory choice adds store references. The finished `managing-work-items` folder contains one `SKILL.md` and one selected `references/work-tracker.md`. With local or Notion memory, the finished `managing-project-memory` folder contains one `SKILL.md` and one selected `references/memory-store.md`. Hindsight adds no Toolkit memory skill.

## Hook commands

The four hook commands are in `every-project/.claude/hooks/`, so the setup copy has them in `<copy>/.claude/hooks/`: `session-start.mjs`, `prompt-reminder.mjs`, `codex-after-commit.mjs`, and `validate-records.mjs`. A hook command is a command that Claude Code or Codex runs by itself at a fixed moment, for example at session start. Both Claude Code and Codex run the four commands from `.claude/hooks/`.

- `prompt-reminder.mjs` runs on every message. It prints one line that tells the agent to check the project's skills, then a memory reminder when the message has a phrase such as "remember this", and then the whole text of the rule `.claude/rules/evaluate-the-owners-request.md`. It reads that rule file each time it runs, so the project's rule file is the only place where the rule's text is kept.
- `validate-records.mjs` checks the form of the project's records (`DECISIONS.md`, `system/`, `sources/`, and local work items) and only reads.
- The setup copy also has `.githooks/pre-commit`, which runs `validate-records.mjs` before each commit once the steps of `placing-files.md`, "5. The pre-commit check", are done.
- A Salesforce project also gets the two guards in `.claude/hooks/` from the `salesforce` folder, and the scripts in `tools/`. The graph Stop hook runs those scripts.

## Settings snippets

`assets/settings/` holds the settings snippets: the small JSON and TOML files that setup merges into a project's settings files. In the table, `<memory>` stands for the memory choice: `local`, `notion`, or `hindsight`. The work tracking choice has no snippets.

| Snippet | Merged into | For |
| --- | --- | --- |
| `claude-settings-hooks.<memory>.json` | `<copy>/.claude/settings.json` | The memory choice. It holds the Claude Code hooks: session start, prompt reminder, after a commit, a helper agent returned, and `validate-records.mjs` after a file edit and when the agent stops. |
| `codex-hooks.<memory>.json` | `<copy>/.codex/hooks.json` | The memory choice. It holds the Codex hooks: session start, prompt reminder, after a commit, a helper agent started or returned, and `validate-records.mjs` after a file edit. |
| `enabled-plugins-off.json` | `<copy>/.claude/settings.json` | Every project. |
| `codex-plugins-off.toml` | `<copy>/.codex/config.toml` | Every project. |
| `claude-settings-salesforce.json` | `<copy>/.claude/settings.json` | A Salesforce project only. It names Salesforce's plugin marketplace, turns on the Salesforce plugins that the owner uses, and sets two environment variables that those plugins read. |

A helper agent is a separate agent that a session starts for one job.

The snippet `claude-settings-salesforce.json` is the one place where the toolkit keeps a Salesforce project's own settings for Claude Code. `salesforce.md`, "Salesforce's skills", says what each of its entries is for and what setup does after the merge. Codex has no snippet of this kind, because Codex does not read these settings.

The Codex plugins-off snippet also sets `max_context_tokens = 10000` under `[skills]`. That value is the largest value Codex accepts here, and it is more than the 2% default for a model with a context window under 500,000 tokens. When the list of skills passes Codex's limit (2% of the model's context window by default), Codex cuts every skill description short, and the Toolkit skills lose their "Use when" and "Not for" parts.

Never try to turn off, in the project, a plugin from the owner's ChatGPT account. The name of such a plugin ends in `@openai-curated-remote`. The account's own setting replaces such a table.

The Notion snippets hold `{{CURRENT_STATE_PAGE_ID}}`. Leave it in the setup copy. The Notion memory setup fills it with the id of the Notion page named "Current state". `notion.md`, "The links in PROJECT.md", says when and where to put that id.

Never change a snippet's hook commands or texts, because they are written to match the four hook commands.

## Merge rules

- Start from the file that `<copy>` already holds, after the Salesforce removals. `setup-copy.md`, "Salesforce entries in the settings file", lists the entries to take out in a project that is not a Salesforce project.
  - When `<copy>` has no such file, the first snippet is the start. This is so for `.codex/hooks.json` in a project that is not a Salesforce project, and for `.codex/config.toml`.
- Replace the toolkit's own hook handlers. Never join the old ones and the new ones. A hook handler is one entry in a settings file that says what a hook runs. The toolkit's own hook handlers are:
  - a handler whose `args` or `command` names `session-start.mjs`, `prompt-reminder.mjs`, `codex-after-commit.mjs`, or `validate-records.mjs`;
  - the `echo` handler in the `PostToolUse` group whose matcher is `Agent`;
  - the `echo` handler in the `.codex/hooks.json` `PostToolUse` group whose matcher is `^(collaboration)?(spawn_agent|wait_agent)$`.
- When the file already has the toolkit's own hook handlers (an update, or a changed memory choice), show the owner the old and new handlers. Then remove the old ones and any group or event they leave empty, and merge the snippet. Never keep both.
  - When you cannot tell whether a handler is the toolkit's, ask the owner.
  - A new project's setup copy has none of them.
- When the file holds an old end-of-reply check, an older Codex matcher, or one of the seven `permissions.ask` entries for `sf` commands, handle it as `update.md`, "4. What the toolkit no longer ships", says. That section lists what an earlier version of the toolkit put into a project and how to remove it. Never add an end-of-reply check.
- Add a plain value (text, a number, true or false) that the file does not have.
  - When the file already has that plain value with a different value, and the file is in the setup copy, take the snippet's value.
  - When the file already has that plain value with a different value, and the file is one that the project already had, ask the owner. `placing-files.md` and `update.md` send you to these rules for such a file.
- Merge `claude-settings-salesforce.json` only in a Salesforce project. Each of its plugin entries and each of its `env` values is a plain value, so the rule above applies to it.
  - When a file that the project already had sets one of those plugins to `false`, or sets `SFDX_AUTO_DEPLOY` or `SF_DISABLE_TELEMETRY` to another value, that value is the owner's. Tell the owner what the snippet's value is for, which `salesforce.md`, "Salesforce's skills", gives, and ask which value to keep.
  - When the file already names a marketplace `salesforce` under `extraKnownMarketplaces` with another source, leave that entry as it is and ask the owner. A marketplace entry is not a plain value, and a marketplace has one source.
- Never delete any other entry. The copied permission rules, the Git deny and ask rules, the Salesforce guards (and the `Stop` hook that runs `tools/kb/graph_freshness_hook.py`), and the hooks that the owner added all stay.
  - In a Salesforce project, the `Stop` event then holds two groups: the graph hook's group and the group that runs `validate-records.mjs`.
- In an update or a move-over of a project whose settings hold no entry that runs `validate-records.mjs`, add those entries last. `update.md`, "Turning on validate-records.mjs and the pre-commit file", gives the steps that come before them.
- `.codex/hooks.json` holds only `description` and `hooks` at the top level.
  - In a Salesforce project, the `description` is the text of the `salesforce` folder's file, one space, then the snippet's text. In any other project, the `description` is the snippet's text.
  - In a file that the project already had, a `description` that does not contain the snippet's text keeps the text it has, and the snippet's text is added after it with one space between them. List that change in the numbered table that the owner sees. `placing-files.md`, "3. Files the project already has", and `update.md` say how to show that table.
- When the snippet sets a key that the file writes another way, leave the file as it is and ask the owner. Another way is a dotted key such as `plugins."x@y".enabled = false`, or an inline table.

## The older plugins, off in this project

The two plugins-off snippets turn the older claude-toolkit plugins off for this project only. The skills of those plugins have the same names as Toolkit V2 skills (`handoff`, `pull-latest`, and others), so both would load. This computer may have more of those plugins than the snippets name. List every plugin that this computer has, with these commands, which change nothing:

```text
jq -r '.enabledPlugins // {} | keys[]' ~/.claude/settings.json
jq -r '.plugins // {} | keys[]' ~/.claude/plugins/installed_plugins.json
grep -o 'plugins\."[^"]*"' ~/.codex/config.toml
```

Turn off each plugin in the list that the snippets do not already name and whose name is one of these:

- a name that ends in `@claude-toolkit`;
- a `@toolkit-v2` name other than `toolkit@toolkit-v2` and `workstreams@toolkit-v2`. These are the retired `work`, `memory`, `session-skills`, `git-workflows`, and Salesforce architect plugins.

To turn off one such plugin, do both of these:

- add `"<name>": false` under `enabledPlugins` in `<copy>/.claude/settings.json`;
- add this table to `<copy>/.codex/config.toml`:

  ```toml
  [plugins."<name>"]
  enabled = false
  ```

Never turn off `toolkit@toolkit-v2`, which holds this skill, or `workstreams@toolkit-v2`, the side panel of the owner's sessions. Never change the files in `~/.claude` or `~/.codex` to turn an older plugin off.

Salesforce's own plugins are not older plugins, and this section does not cover them. `salesforce.md`, "Salesforce's skills", says which of them a Salesforce project turns on, and how they are turned off for the rest of the computer after the owner's yes.

## Check

- `ls <copy>/.claude/skills` shows exactly the 10 shared skills and the skills that the table under "Skills" gives for the owner's choices, each with a `SKILL.md`.
- Both JSON files are valid.
- In a Salesforce project, `<copy>/.claude/settings.json` holds every entry of `claude-settings-salesforce.json` with the snippet's value. This command compares the two files and prints `true`:

  ```text
  jq -s '.[0] as $snippet | .[1] as $file | ($snippet.env | to_entries | all($file.env[.key] == .value)) and ($snippet.enabledPlugins | to_entries | all($file.enabledPlugins[.key] == .value)) and ($file.extraKnownMarketplaces.salesforce == $snippet.extraKnownMarketplaces.salesforce)' <skill folder>/assets/settings/claude-settings-salesforce.json <copy>/.claude/settings.json
  ```

  In any other project, the file names no Salesforce plugin: `jq '[.enabledPlugins // {} | keys[] | select(endswith("@salesforce"))] | length' <copy>/.claude/settings.json` prints `0`.
- Every hook command that the settings name is in `<copy>/.claude/hooks/`.
- `.codex/config.toml` has each table once, and `[skills]` holds `max_context_tokens = 10000`.
- The `description` in `.codex/hooks.json` contains the snippet's description text (`jq -e` with `contains` shows it). When it does not, add it as "Merge rules" says.
- Each of the toolkit's hook handlers is in each settings file once. Count the `hooks/*.mjs` names with `grep -o`, and the `echo` helper reminders with `jq`.
  - `validate-records.mjs` is named twice in `.claude/settings.json` (after an edit, and at stop with `--all`) and once in `.codex/hooks.json`.
  - The Codex helper reminder has only the matcher `^(collaboration)?(spawn_agent|wait_agent)$`, and `.claude/settings.json` has no `Stop` hook of type `prompt`. A Codex helper reminder with another matcher, or a `Stop` hook of type `prompt`, is an old handler to take out, as "Merge rules" above and `update.md`, "4. What the toolkit no longer ships", say.
