# Skills, hook commands, and settings

Purpose: add to the setup copy the skills for the owner's choices, the three
hook commands, and the settings snippets, merged into the model's settings
files. `<copy>` is the scratch folder from `setup-copy.md`; `<skill folder>`
is the folder that holds this skill's `SKILL.md`.

## Contents

- Skills
- Hook commands
- Settings snippets
- Merge rules
- The older plugins, off in this project
- Check

## Skills

Every skill goes in `<copy>/.claude/skills/`, one folder per skill. Claude
Code reads that folder; Codex reads `.agents/skills`, which becomes a link to
it (`placing-files.md` in this folder).

The folders `.shared-skills`, `.skill-sets`, and `.salesforce` start with a
dot, so Codex does not load their skills in every folder on this computer.
`ls` hides them; use `ls -a`. The copied skill folders have normal names.

```text
mkdir -p <copy>/.claude/skills
cp -R <skill folder>/assets/.shared-skills/. <copy>/.claude/skills/
```

The shared skills are the same in every project (9): `managing-work-items`,
`handoff`, `braindump`, `explain-simply`, `session-summary`, `pull-latest`,
`reset-to-remote`, `merge-and-clean-up`, `publish-docs`. They name no
tracker or memory system. Every work tracking set holds one skill with the
same name, `tracking-work-items`, so the shared skills name it directly.
They say "the memory save skill", and the "Skills" section of `AGENTS.md`
names which one the project has.

Then copy the sets for the choices:

| Choice | Copy into `<copy>/.claude/skills/` | Skills |
| --- | --- | --- |
| Work items local | `<skill folder>/assets/.skill-sets/local-work/.` | `tracking-work-items` |
| Work items in Notion | `<skill folder>/assets/.skill-sets/notion-work/.` | `tracking-work-items` |
| Work items in GitHub Issues | `<skill folder>/assets/.skill-sets/github-work/.` | `tracking-work-items` |
| Memory local | `<skill folder>/assets/.skill-sets/local-memory/.` | `local-memory-save`, `local-memory-find`, `local-memory-refine` |
| Memory in Notion | `<skill folder>/assets/.skill-sets/notion-memory/.` | `notion-memory-save`, `notion-memory-find`, `notion-memory-refine` |
| Memory in Hindsight | nothing | none: the agent uses the tools of Hindsight's coding-agent add-on (`hindsight-on-vps.md` in this folder) |
| Salesforce | `<skill folder>/assets/.salesforce/sf-architect-solutioning` | `sf-architect-solutioning`; the model copy already put `sf-component-tracker`, `sf-data-change`, and `sf-deploy-check` there |

## Hook commands

```text
mkdir -p <copy>/.claude/hooks
cp <skill folder>/assets/hooks/*.mjs <copy>/.claude/hooks/
```

That is three small commands: `session-start.mjs`, `prompt-reminder.mjs`,
and `codex-after-commit.mjs`. Both hosts run them from `.claude/hooks/`. A
Salesforce project also keeps the model's two guards there, and the
model's scripts in `tools/` (the graph Stop hook runs them).

## Settings snippets

`assets/settings/` holds the small JSON and TOML files that setup merges
into a project's settings files. `<memory>` is the memory choice: `local`,
`notion`, or `hindsight`. The work tracking choice has no snippets.

| Snippet | Merged into | For |
| --- | --- | --- |
| `claude-settings-hooks.<memory>.json` | `<copy>/.claude/settings.json` | the memory choice: the Claude Code hooks (session start, prompt reminder, after a commit, and a helper agent returned) |
| `codex-hooks.<memory>.json` | `<copy>/.codex/hooks.json` | the memory choice: the Codex hooks (session start, prompt reminder, after a commit, and a helper agent started or returned) |
| `enabled-plugins-off.json` | `<copy>/.claude/settings.json` | every project |
| `codex-plugins-off.toml` | `<copy>/.codex/config.toml` | every project |

The Codex plugins-off snippet also sets `max_context_tokens = 10000` under
`[skills]`, the largest value Codex accepts here (more than the 2% default
for a model with a context window under 500,000 tokens). When the list of
skills passes Codex's limit (2% of the model's context window by default),
Codex cuts every skill description short, and the Toolkit skills lose their
"Use when" and "Not for" parts. Never try to turn off a plugin from the
owner's ChatGPT account (its name ends in `@openai-curated-remote`) in the
project: the account's own setting replaces such a table.

The Notion snippets hold `{{CURRENT_STATE_PAGE_ID}}`. Leave it in the setup
copy; the Notion memory setup fills it with the "Current state" page id
(`notion.md` in this folder). Never change a snippet's hook commands or
texts: they are written to match the three hook commands.

## Merge rules

- Start from the model's file in `<copy>`, after the Salesforce removals in
  `setup-copy.md`. When `<copy>` has no such file (`.codex/hooks.json` in a
  project that is not a Salesforce project, and `.codex/config.toml`), the
  first snippet is the start.
- The toolkit's own hook handlers are replaced, never joined. They are: a
  handler whose `args` or `command` names `session-start.mjs`,
  `prompt-reminder.mjs`, or `codex-after-commit.mjs`; the `echo` handler in
  the `PostToolUse` group whose matcher is `Agent`; and the `echo` handler
  in the `.codex/hooks.json` `PostToolUse` group whose matcher is
  `^(collaboration)?(spawn_agent|wait_agent)$`. When the file already has
  them (an update, or a changed memory choice), show the owner the old and
  new handlers, then remove the old ones and any group or event they leave
  empty, and merge the snippet. Never keep both. When you cannot tell
  whether a handler is the toolkit's, ask. A new project's setup copy has
  none of them. An old end-of-reply check or an older Codex matcher: handle
  it as `update.md` says, in "What the toolkit no longer ships". Never add
  an end-of-reply check.
- A plain value (text, a number, true or false) that the file does not have
  is added. A plain value the file already has with a different value: in
  the setup copy, take the snippet's; in a file the project already had
  (`placing-files.md`, `update.md`), ask the owner.
- Never delete any other entry: the model's permission rules, its Git deny
  and ask rules, the Salesforce guards (and the `Stop` hook that runs
  `tools/kb/graph_freshness_hook.py`), and hooks the owner added stay.
- `.codex/hooks.json` holds only `description` and `hooks` at the top level.
  In a Salesforce project, the `description` is the model's text, one
  space, then the snippet's text; otherwise it is the snippet's. In a file
  the project already had, a `description` that does not contain the
  snippet's text keeps the text it has, and the snippet's text is added
  after it with one space between them. List that change in the numbered
  table the owner sees (`placing-files.md`, `update.md`).
- A key the snippet sets but the file writes another way (a dotted key such
  as `plugins."x@y".enabled = false`, or an inline table): leave the file as
  it is and ask the owner.

## The older plugins, off in this project

The two plugins-off snippets turn the older claude-toolkit plugins off for
this project only. Their skills have the same names as Toolkit V2 skills
(`handoff`, `pull-latest`, and others), so both would load. This computer
may have more of them than the snippets name.
List every plugin it has, without changing anything:

```text
jq -r '.enabledPlugins // {} | keys[]' ~/.claude/settings.json
jq -r '.plugins // {} | keys[]' ~/.claude/plugins/installed_plugins.json
grep -o 'plugins\."[^"]*"' ~/.codex/config.toml
```

For each name that ends in `@claude-toolkit`, and each `@toolkit-v2` name
other than `toolkit@toolkit-v2` (the retired `work`, `memory`,
`session-skills`, `git-workflows`, and `sf-architect-solutioning` plugins),
that the snippets do not already name:

- add `"<name>": false` under `enabledPlugins` in
  `<copy>/.claude/settings.json`;
- add this table to `<copy>/.codex/config.toml`:

  ```toml
  [plugins."<name>"]
  enabled = false
  ```

Never turn off `toolkit@toolkit-v2`: it holds this skill. Never change the
files in `~/.claude` or `~/.codex`.

## Check

- `<copy>/.claude/skills/` holds exactly the skill folders for the choices,
  each with a `SKILL.md`, and a folder for every skill that the "Skills"
  section of `AGENTS.md` names, except `project-setup` (the machine-wide
  `toolkit` plugin holds it) and a skill of another plugin that the section
  names only to say not to use it.
- Both JSON files are valid, every hook command the settings name is in
  `<copy>/.claude/hooks/`, `.codex/config.toml` has each table once, and
  `[skills]` holds `max_context_tokens = 10000`.
- The `description` in `.codex/hooks.json` contains the snippet's
  description text (`jq -e` with `contains` shows it); when it does not,
  add it as "Merge rules" says.
- Each of the toolkit's hook handlers is in each settings file once (count
  the `hooks/*.mjs` names with `grep -o`, and the `echo` helper reminders
  with `jq`). The Codex helper reminder has only the matcher
  `^(collaboration)?(spawn_agent|wait_agent)$`, and `.claude/settings.json`
  has no `Stop` hook of type `prompt`; either one is an old handler to take
  out ("Merge rules", `update.md`).
