# Platform best practices: Claude Code and Codex, for Toolkit V2

Research brief, written 2026-09-26. Read-only research; nothing outside this file
was changed.

This brief is the reference the architect and builders use when they build
Toolkit V2's plugins, skills, hooks, rules, instruction files, and output style.
It stands alone: every fact has a source you can open.

## How to read the citations

- **CC:`file`#Section** means the captured Claude Code documentation at
  `/Users/michaelrihm/Documents/Projects/claude-toolkit/ai-external-knowledge/claude-code/<file>`,
  captured 2026-09-22 from `https://code.claude.com/docs/en/`.
- **CX:`page`** means the official Codex documentation, fetched 2026-09-26 as
  Markdown from `https://learn.chatgpt.com/docs/<page>.md`. The old address
  `https://developers.openai.com/codex/hooks` now redirects (HTTP 308) to
  `https://learn.chatgpt.com/docs/hooks`.
- **CXP:`page`** means the OpenAI plugin builder documentation, fetched
  2026-09-26 from `https://developers.openai.com/plugins/<page>.md`.
- **CX-captured** means the one captured Codex page:
  `/Users/michaelrihm/Documents/Projects/claude-toolkit/ai-external-knowledge/codex/agents-md.md`
  (and that folder's `README.md`).
- **CX-src:`path`** means the Codex source code on the `main` branch of
  `https://github.com/openai/codex`, read 2026-09-26 with `gh api`.
- **Observed** means something run or read on this Mac on 2026-09-26.

Installed versions (Observed): `claude --version` prints `2.1.280 (Claude Code)`;
`codex --version` prints `codex-cli 0.157.0`.

---

## Part 0. What this means for Toolkit V2 (the short list)

These are the conclusions a builder needs first. Each one is explained, with its
source, further down.

1. **Two marketplace files, one repository.** Put `.claude-plugin/marketplace.json`
   (Claude Code) and `.agents/plugins/marketplace.json` (Codex) at the
   `toolkit-v2` root, both pointing at `./plugins/<name>`. Codex also reads
   `.claude-plugin/marketplace.json`, but only when `.agents/plugins/marketplace.json`
   is absent, and the Codex format needs `policy` and `category` fields the Claude
   format does not have (Part 2.4, Part 3.4).
2. **Two plugin manifests per plugin.** Each plugin folder gets
   `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json`. Codex picks the
   first it finds in this order: a root `plugin.json` that declares the Agent
   Plugins `$schema`, then `.codex-plugin/plugin.json`, then
   `.claude-plugin/plugin.json` (Part 3.4). The current toolkit uses this
   two-manifest layout and it installs on this Mac today (Part 5).
3. **Keep Claude and Codex hook files separate.** Claude reads
   `hooks/hooks.json` by default. Codex also reads `hooks/hooks.json` by default
   unless the Codex manifest names another file. Codex ignores the `args` field
   (exec form), so a Claude-style `"command": "node", "args": [...]` hook would
   run a bare `node` in Codex. Codex also rejects a top-level `$schema` key in a
   hooks file. Put Codex hooks in their own file, for example
   `hooks/codex-hooks.json`, and point `.codex-plugin/plugin.json`
   `"hooks": "./hooks/codex-hooks.json"` at it (Part 3.3, Part 4).
4. **Hook scripts must find the project root themselves.** Claude exports
   `CLAUDE_PROJECT_DIR`; Codex does not document any project-root variable. Read
   `cwd` from the JSON on stdin, then run `git rev-parse --show-toplevel` from it
   (Part 4).
5. **Stop hooks: print nothing or JSON.** Codex treats plain text on stdout from
   `Stop` and `SubagentStop` as invalid. Claude ignores it. Exit 0 with no output
   is safe on both (Part 3.3).
6. **PreToolUse: use only `deny`, `additionalContext`, or `allow` plus
   `updatedInput`.** Codex marks a PreToolUse hook as failed, and lets the tool
   run, if the hook returns `permissionDecision: "ask"`, `continue`,
   `stopReason`, or `suppressOutput` (Part 3.3).
7. **Codex must trust every non-managed hook, including plugin hooks.** Trust is
   stored against a hash of the exact hook definition. A changed hooks file needs
   review again in `/hooks`. For scripted tests, `codex exec
   --dangerously-bypass-hook-trust` skips this for one run (Part 3.3).
8. **`AGENTS.md` only works in Claude Code when no `CLAUDE.md` exists.** Claude
   Code 2.1.277+ reads `AGENTS.md` natively only when there is no `CLAUDE.md`,
   `.claude/CLAUDE.md`, or `CLAUDE.local.md` in the working directory or above.
   A subdirectory `AGENTS.md` loads lazily only when that subdirectory has no
   `CLAUDE.md` of its own. The model project has nested `CLAUDE.md` files
   (`.memory/`, `requirements/`, `docs/`); the V2 scaffold must drop them
   (Part 2.8).
9. **Known gaps in native `AGENTS.md` reading.** It does not happen in the
   first session after installing or upgrading, in sessions with
   `disableAllHooks` or `allowManagedHooksOnly`, on Amazon Bedrock or other
   third-party providers, or with telemetry off (Part 2.8).
10. **No `@imports` in `AGENTS.md` for Codex.** Claude expands `@path` imports
    inside `AGENTS.md`; Codex passes them through as literal text. Codex
    reads at most 32 KiB of all `AGENTS.md` files combined, root first, and never
    lazily loads a subdirectory `AGENTS.md` below the launch directory (Part 3.1).
11. **`.claude/rules/` is Claude-only.** Path-scoped rules (`paths:`
    frontmatter) never reach Codex. Unscoped rules reload after compaction;
    path-scoped rules come back only when a matching file is read again. Root
    `AGENTS.md` must point Codex at any rule it needs (Part 2.8, Part 4).
12. **Plugins cannot ship rules or instruction files.** A `CLAUDE.md` at a plugin
    root is not loaded, and plugin `settings.json` supports only `agent` and
    `subagentStatusLine`. Project init must copy rule files into the project's
    `.claude/rules/` (Part 2.1).
13. **Plugins can ship the output style.** Put `output-styles/plain-english.md` in
    a plugin. `force-for-plugin: true` applies it whenever the plugin is enabled;
    otherwise select it with `"outputStyle"`. Codex has no output styles, so the
    voice rules must also live in `AGENTS.md` for Codex. Subagents never receive
    the output style (Part 2.9, Part 3).
14. **Skill names and descriptions.** Folder name = `name`, lowercase letters,
    digits and hyphens, at most 64 characters. `description` at most 1,024
    characters, third person, "what it does, then Use when ...", key trigger
    words first. Claude caps each listing entry at 1,536 characters and the whole
    listing at 1% of the context window; Codex caps its listing at 2% of the
    context window (or 8,000 characters). Keep `when_to_use` out of the plan:
    it is Claude-only (Part 2.6, Part 3.2).
15. **Dev loop.** Claude: `claude plugin marketplace add /abs/path/toolkit-v2`,
    then `claude plugin install <plugin>@<marketplace>`; relative-path plugins
    from a local-directory marketplace load in place, so edits apply at the next
    session or `/reload-plugins` with no version bump. Codex: `codex plugin
    marketplace add /abs/path/toolkit-v2`, then `codex plugin add
    <plugin>@<marketplace>`; Codex runs a cached copy stored under the manifest
    version, so changes need a version bump or reinstall (Part 2.5, Part 3.4).
16. **Automated Claude runs (`claude -p`) ignore a repository's
    `extraKnownMarketplaces`.** Register the marketplace at user scope with the
    CLI for sample runs (Part 2.11).

---

## Part 1. Claude Code: which mechanism does what

Source: CC:`features-overview.md`#Context cost by feature, #Compare similar
features; CC:`memory.md`#When to add to CLAUDE.md.

| Mechanism | When it loads | Context cost | Use it for |
| --- | --- | --- | --- |
| Instruction file (`CLAUDE.md` or `AGENTS.md`) | Session start, full text | Every request | Facts Claude needs every session: build commands, conventions, "always do X" rules. Target under 200 lines per file. |
| `.claude/rules/*.md` without `paths:` | Session start | Every request | Topic rules that always apply. |
| `.claude/rules/*.md` with `paths:` | When Claude reads a matching file | Only after a match | Directory- or file-type-specific rules. |
| Skill | Name and description at start; body when invoked | Low (listing only) | Procedures and reference material. |
| Subagent | When spawned, in its own context | Isolated | Research, parallel work, focused workers. |
| Hook | On an event; runs outside the model | Zero unless it returns context | Steps that must run the same way every time. |
| Output style | Every request (system prompt) | Every request | Voice and reply format. |

The docs' rule of thumb: a multi-step procedure belongs in a skill, not the
instruction file; a rule that only matters for part of the codebase belongs in
a path-scoped rule; something that must happen every time belongs in a hook
(CC:`memory.md`#When to add to CLAUDE.md; CC:`memory.md`#Claude isn't
following my CLAUDE.md: "If the instruction is something that must run at a
specific point ... write it as a hook instead").

---

## Part 2. Claude Code details

### 2.1 Plugin directory layout

Source: CC:`plugins-reference.md`#Standard plugin layout, #File locations
reference; CC:`plugins.md`#Plugin structure overview.

```text
my-plugin/
├── .claude-plugin/
│   └── plugin.json          # the manifest; ONLY this file goes in .claude-plugin/
├── skills/<skill-name>/SKILL.md
├── commands/*.md            # older flat skill format; use skills/ for new work
├── agents/*.md              # subagent definitions
├── workflows/*.js
├── output-styles/*.md       # output styles
├── themes/*.json            # experimental
├── monitors/monitors.json   # experimental
├── hooks/hooks.json         # hook configuration
├── bin/                     # executables added to the Bash tool's PATH
├── settings.json            # only "agent" and "subagentStatusLine" keys
├── .mcp.json
├── .lsp.json
└── scripts/                 # hook and helper scripts (any name works)
```

- "All other directories ... must be at the plugin root, not inside
  `.claude-plugin/`." (CC:`plugins-reference.md`#Standard plugin layout)
- The manifest is optional; without it Claude Code auto-discovers the default
  folders and names the plugin after its directory
  (CC:`plugins-reference.md`#Plugin manifest schema).
- "A `CLAUDE.md` file at the plugin root is not loaded as project context.
  Plugins contribute context through skills, agents, and hooks"
  (CC:`plugins-reference.md`#Standard plugin layout). `claude plugin validate`
  warns about a `CLAUDE.md` at a plugin root
  (CC:`plugin-marketplaces.md`#Read the validation results).
- Plugin `settings.json`: "Only the `agent` and `subagentStatusLine` keys are
  supported" (CC:`plugins-reference.md`#File locations reference). A plugin
  cannot set `outputStyle`, permissions, or rules through it.
- A plugin cannot reference files outside its own folder. `../shared` paths are
  rejected with `path escapes plugin directory`, and files above the plugin root
  are not copied into the cache. Symlinks to elsewhere in the same marketplace
  are dereferenced (copied) at install; symlinks outside the marketplace are
  skipped (CC:`plugins-reference.md`#Path traversal limitations, #Share files
  within a marketplace with symlinks). This is why the current toolkit keeps
  project templates inside `plugins/project-init/library/`.
- Use forward slashes in component paths; backslash paths are rejected on macOS
  and Linux (CC:`plugins-reference.md`#Path traversal limitations).
- `bin/`: "Executables added to the Bash tool's `PATH` and invokable as bare
  commands while the plugin is enabled" (CC:`plugins-reference.md`#File
  locations reference). Codex documents no equivalent.
- Node dependencies: when Claude Code copies a plugin into the cache it runs
  `npm ci --ignore-scripts` only if the plugin root has both `package.json` and
  a lockfile; a plugin loaded in place gets no automatic install
  (CC:`plugins-reference.md`#Node.js package dependencies, #Plugin caching and
  file resolution). Simplest: hook scripts that use only Node built-ins.

### 2.2 `plugin.json` fields (Claude Code)

Source: CC:`plugins-reference.md`#Complete schema, #Required fields, #Metadata
fields, #Component path fields, #Path behavior rules.

Only `name` is required. `name` is kebab-case with no spaces; it is the
namespace for every component (skill `hello` in plugin `my-plugin` is
`/my-plugin:hello`).

| Field | Type | Notes |
| --- | --- | --- |
| `$schema` | string | Ignored at load time. |
| `name` | string | Required. Kebab-case. If a marketplace entry uses a different name, the marketplace name is what `enabledPlugins` and `/plugin` use. |
| `displayName` | string | UI label; may have spaces. |
| `version` | string | Semver. Setting it pins updates to bumps of this field, except for plugins loaded in place from a local-directory marketplace, which always load current files. `plugin.json` wins over the marketplace entry. |
| `description` | string | |
| `author` | object | `name`, `email`, `url`. |
| `homepage`, `repository`, `license` | string | |
| `keywords` | array | A string here is a load error. |
| `metadata` | object | Free-form; Claude Code does not read it. |
| `defaultEnabled` | boolean | Default `true`. `false` installs the plugin disabled. |
| `skills` | string or array | **Adds to** the default `skills/` scan. |
| `commands` | string or array | **Replaces** default `commands/`. |
| `agents` | string or array | **Replaces** default `agents/`. |
| `workflows` | string or array | Replaces default `workflows/`. |
| `hooks` | string, array, or object | Hook file paths or inline config. |
| `mcpServers` | string, array, or object | |
| `outputStyles` | string or array | **Replaces** default `output-styles/`. |
| `lspServers` | string, array, or object | |
| `experimental.themes`, `experimental.monitors`, `experimental.evals` | | Experimental. |
| `userConfig` | object | Values prompted at enable time; see below. |
| `channels` | array | Message channels bound to plugin MCP servers. |
| `dependencies` | array | Other plugins, bare name or `{ "name", "version", "marketplace" }` with a semver range (CC:`plugin-dependencies.md`). A manifest that is only `name` plus `dependencies` works as a bundle that installs a set of plugins. |

Path rules: every path is relative to the plugin root and starts with `./`
(the `skills` field also accepts `"."`). When a default folder exists and the
matching manifest key also exists, the folder is ignored and Claude Code warns
(CC:`plugins-reference.md`#Path behavior rules).

Unrecognized top-level fields are ignored at runtime and reported as warnings by
`claude plugin validate`; `--strict` turns warnings into errors. A recognized
field with the wrong type fails the plugin load
(CC:`plugins-reference.md`#Unrecognized fields).

`userConfig`: each option needs `type` (`string`, `number`, `boolean`,
`directory`, `file`), `title`, `description`; optional `sensitive`, `required`,
`default`, `options`, `multiple`, `min`, `max`. Values are available as
`${user_config.KEY}` in MCP/LSP configs and exec-form hooks, and to hook
processes as `CLAUDE_PLUGIN_OPTION_<KEY>`. Shell-form hooks that reference
`${user_config.*}` fail on purpose (CC:`plugins-reference.md`#User
configuration). Codex does not support `userConfig` at all
(CXP:`guides/submit-claude-plugin`#Replace Claude userConfig).

### 2.3 Where plugin components go and how they are named

| Component | Default location | Name users and Claude see | Source |
| --- | --- | --- | --- |
| Skill | `skills/<dir>/SKILL.md` | `/plugin-name:skill-name`; the last segment is the frontmatter `name` if set, else the folder name. "The bare `/fancy` also invokes the skill unless another command already uses that name." | CC:`skills.md`#How a skill gets its command name |
| Single-skill plugin | `SKILL.md` at plugin root, no `skills/` folder | Frontmatter `name`, else the install directory name (a version string in the cache, so always set `name`) | CC:`plugins-reference.md`#Skills |
| Agent | `agents/*.md` (scanned recursively) | `plugin-name:agent-name`; a subfolder becomes part of the name, e.g. `my-plugin:review:security` | CC:`sub-agents.md`#Choose the subagent scope |
| Hooks | `hooks/hooks.json` | n/a; merged with user and project hooks | CC:`hooks.md`#Reference scripts by path |
| Output style | `output-styles/*.md` | File name, or frontmatter `name` | CC:`output-styles.md`#Frontmatter |

Plugin agent frontmatter supports `name`, `description`, `model`, `effort`,
`maxTurns`, `tools`, `disallowedTools`, `skills`, `memory`, `background`,
`omitClaudeMd`, `isolation` (only `"worktree"`). "For security reasons,
plugin-shipped agents don't support `hooks`, `mcpServers`, or `permissionMode`."
(CC:`plugins-reference.md`#Agents). Plugin agents have the lowest priority when
names clash with project or user agents (CC:`sub-agents.md`#Choose the subagent
scope). Agent `name` values cannot contain `:` (CC:`sub-agents.md`#Supported
frontmatter fields).

### 2.4 `marketplace.json` fields (Claude Code)

Source: CC:`plugin-marketplaces.md`#Marketplace schema, #Plugin entries,
#Plugin sources, #Relative paths, #Strict mode.

File: `.claude-plugin/marketplace.json` at the repository root.

Required top-level fields:

- `name`: kebab-case marketplace id; users type `plugin@<name>`. Reserved names
  include `claude-code-marketplace`, `claude-code-plugins`,
  `claude-plugins-official`, `anthropic-plugins`, `agent-skills`, and others;
  names impersonating official ones are blocked; `npm`, `pip`, `uv`, `cargo`,
  `github`, `gh` are refused (v2.1.275+). Claude Desktop also rejects `org`,
  `org-provisioned`, `unknown`.
- `owner`: object; `name` required, `email` and `url` optional.
- `plugins`: array of entries.

Optional top-level fields: `$schema`, `description`, `version`,
`metadata.pluginRoot` (lets entries use a bare folder name), 
`allowCrossMarketplaceDependenciesOn`, `renames` (map of old plugin name to new
name or `null`; append-only history). `description` and `version` are also
accepted under `metadata` (the current toolkit uses `metadata.version`).

Plugin entry: required `name` and `source`. Optional: any `plugin.json` field
(`displayName`, `description`, `version`, `author`, `homepage`, `repository`,
`license`, `keywords`, `metadata`, `skills`, `commands`, `agents`, `hooks`,
`mcpServers`, `lspServers`) plus marketplace-only `category`, `tags`, `strict`,
`relevance`, `defaultEnabled`, `headers`, `headersHelper`.

- `source` for a plugin inside the same repository: a string starting with
  `./`, resolved from the marketplace root (the folder that contains
  `.claude-plugin/`), for example `"./plugins/work"`. No `..` segments.
- `strict` (default `true`): `plugin.json` is the authority and the entry can
  add to it. `false` means the entry is the whole definition, and a
  `plugin.json` that also declares components is a load error.
- If `version` is set in both places, `plugin.json` wins; `claude plugin
  validate` warns when they differ (CC:`plugin-marketplaces.md`#Marketplace
  validation errors).
- Other source types: `github` (`repo`, `ref`, `sha`), `url`, `git-subdir`,
  `npm`, `archive`, `command`.

### 2.5 Installing, validating, and the development loop

Source: CC:`plugin-marketplaces.md`#Manage marketplaces from the CLI;
CC:`plugins-reference.md`#CLI commands reference, #Plugin caching and file
resolution, #Version management; CC:`discover-plugins.md`#Install plugins, #Apply
plugin changes without restarting; CC:`plugins.md`#Test your plugins locally.

```bash
# register the marketplace (default scope: user)
claude plugin marketplace add /Users/michaelrihm/Documents/Projects/toolkit-v2
claude plugin marketplace add ./path --scope project   # writes .claude/settings.json
claude plugin marketplace list [--json]
claude plugin marketplace update [name]
claude plugin marketplace remove <name>                # also uninstalls its plugins

# install / manage
claude plugin install <plugin>@<marketplace> [--scope user|project|local] [--json]
claude plugin enable|disable|uninstall <plugin>@<marketplace> [--scope ...]
claude plugin list [--json]
claude plugin details <plugin>                         # components + token cost

# check
claude plugin validate .            # marketplace dir or plugin dir; exit 0 pass, 1 fail, 2 run error
claude plugin validate . --strict   # warnings become errors
claude plugin validate . --json

# try without installing
claude --plugin-dir ./plugins/work      # repeatable; a folder of plugins also works (v2.1.265+)
```

- Validating a marketplace directory checks `marketplace.json` and each local
  plugin's `plugin.json`, but "doesn't open the plugins' skill, agent, command,
  or hook files". To check those, run `claude plugin validate
  ./plugins/<name>` for each plugin (checks `plugin.json`, `hooks/hooks.json`,
  and the `skills`, `agents`, `commands` folders)
  (CC:`plugin-marketplaces.md`#Marketplace validation errors, #Pick the
  directory to name). A malformed `hooks/hooks.json` makes the plugin load
  without those hooks.
- **In-place loading.** "A relative path source in a marketplace added from a
  local directory loads in place from the marketplace folder." Edits "take
  effect at the next session start or `/reload-plugins`. You don't need a
  version bump." `${CLAUDE_PLUGIN_ROOT}` then points at the source folder
  (CC:`plugins-reference.md`#Plugin caching and file resolution).
- Copied plugins (git, npm, etc.) live in `~/.claude/plugins/cache`; only a
  version change triggers an update when `version` is set
  (CC:`plugins-reference.md`#Version management).
- `claude plugin install` run from a shell does not affect running sessions;
  run `/reload-plugins` or start a new session
  (CC:`discover-plugins.md`#Install plugins).
- `/reload-plugins` reloads plugins, skills, agents, hooks, plugin MCP servers,
  and plugin LSP servers (CC:`plugins.md`#Test your plugins locally). Output
  style files are read at startup; restart to pick up edits
  (CC:`output-styles.md`#Create a custom output style).
- Local and third-party marketplaces have auto-update off by default
  (CC:`discover-plugins.md`#Configure auto-updates).
- Observed: `claude plugin validate .` in `claude-toolkit` (which ships both
  `.claude-plugin/` and `.codex-plugin/` folders and `.agents/plugins/`) prints
  `✔ Validation passed`. The Codex files do not upset the Claude validator.

### 2.6 Skills

#### Where skills load

Source: CC:`skills.md`#Choose where skills load, #Load skills in monorepos and
subdirectories, #Resolve skills that share a name.

| Location | Path | Loads in |
| --- | --- | --- |
| Personal | `~/.claude/skills/<name>/SKILL.md` | All projects on this machine |
| Project | `.claude/skills/<name>/SKILL.md` | This repository; loaded from the launch directory and every parent up to the repo root |
| Nested | `<subdir>/.claude/skills/<name>/SKILL.md` | Loads once Claude reads or edits a file in that subdirectory |
| Plugin | `<plugin>/skills/<name>/SKILL.md` | Wherever the plugin is enabled, as `/plugin-name:skill-name` |

Claude Code does not read `.agents/skills/` (Codex's folder). A skill folder may
be a symlink; Claude reads the target (CC:`skills.md`#Choose where skills load).
Plugin skills never collide with non-plugin skills because they are namespaced.
Skill `SKILL.md` edits are picked up live; a new top-level skills folder needs a
restart (CC:`skills.md`#Edit a skill during a session). `skillOverrides` in
settings does not affect plugin skills (CC:`skills.md`#Override skill visibility
from settings).

#### Frontmatter fields

Source: CC:`skills.md`#Frontmatter reference. Frontmatter is read only when the
opening `---` is the first line of the file. All fields are optional; only
`description` is recommended.

| Field | Meaning |
| --- | --- |
| `name` | Display name. In a plugin skill it sets the last segment of the command. Defaults to the folder name. |
| `description` | What it does and when to use it. If omitted, the first non-empty body line is used. |
| `when_to_use` | Extra trigger text appended to `description` in the listing. Claude Code only. |
| `argument-hint` | Autocomplete hint, e.g. `[issue-number]`. |
| `arguments` | Named positional arguments for `$name` substitution. |
| `disable-model-invocation` | `true`: only the user can invoke; the description is removed from Claude's context entirely. |
| `user-invocable` | `false`: hidden from the `/` menu; only Claude invokes it. |
| `allowed-tools` | Tools pre-approved for the invoking turn only. |
| `disallowed-tools` | Tools removed while the skill is active (until the next user message). |
| `model`, `effort` | Per-turn overrides. |
| `context: fork`, `agent`, `background` | Run the skill in a fresh subagent (no conversation history). |
| `hooks` | Hooks registered when the skill is invoked, kept for the rest of the session; `once: true` removes a hook after its first success. |
| `paths` | Globs; Claude loads the skill automatically only when working with matching files. |
| `shell` | `bash` (default) or `powershell` for injected commands. |
| `metadata`, `license`, `compatibility` | Agent Skills spec fields; accepted, not acted on. |

Boolean fields accept `true/false/yes/no/on/off/1/0` (v2.1.218+).

Outside Claude Code (claude.ai uploads, the Skills API) only `name`,
`description`, `license`, `compatibility`, `metadata`, `allowed-tools` are
allowed; others are a hard error there (CC:`skills.md`#Using skill frontmatter
outside Claude Code). This does not affect plugin skills in Claude Code.

Invocation control summary (CC:`skills.md`#Control who invokes a skill):

| Frontmatter | User can invoke | Claude can invoke | Description in context |
| --- | --- | --- | --- |
| default | yes | yes | always |
| `disable-model-invocation: true` | yes | no | no |
| `user-invocable: false` | no | yes | always |

#### String substitutions in skill bodies

Source: CC:`skills.md`#Available string substitutions, #Inject dynamic context.

`$ARGUMENTS`, `$ARGUMENTS[N]`, `$N`, `$name`, `${CLAUDE_SESSION_ID}`,
`${CLAUDE_EFFORT}`, `${CLAUDE_SKILL_DIR}` (the skill's own folder),
`${CLAUDE_PROJECT_DIR}` (v2.1.196+), and in plugin skills
`${CLAUDE_PLUGIN_ROOT}` and `${CLAUDE_PLUGIN_DATA}`. A line starting with
`` !`command` `` (or a ```` ```! ```` block) runs the command before Claude sees
the skill and inserts its output; a failing command aborts the whole
invocation. All of these are Claude Code features; Codex documents none of
them (Part 4).

#### Skill listing budget and truncation

Source: CC:`skills.md`#Skill descriptions are cut short;
CC:`settings-reference.md`#`skillListingBudgetFraction`,
#`skillListingMaxDescChars`.

- Claude sees a listing of every skill's name and description each turn.
- Each entry's combined `description` + `when_to_use` is cut at **1,536
  characters** (`skillListingMaxDescChars`, default `1536`).
- The whole listing is capped at **1% of the context window**
  (`skillListingBudgetFraction`, default `0.01`). Over budget, "Claude Code keeps
  every skill's name but drops the descriptions of the least-used skills".
- `SLASH_COMMAND_TOOL_CHAR_BUDGET` sets a fixed character budget instead.
- `/doctor` estimates the listing cost; `/skill-doctor` (v2.1.252+) reports
  unused skills; `/context` shows the listing size after the budget.
- `disable-model-invocation: true` removes a skill from the listing entirely
  (CC:`features-overview.md`#Context cost by feature).

#### Writing descriptions and bodies

Sources: CC:`skills.md`#Troubleshooting; Anthropic "Skill authoring best
practices" (`https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices`,
fetched 2026-09-26), sections "Skill structure", "Naming conventions",
"Writing effective descriptions", "Avoid deeply nested references"; Agent Skills
specification (`https://agentskills.io/specification`, fetched 2026-09-26).

- `name`: at most 64 characters, lowercase letters, digits, hyphens; no leading
  or trailing hyphen, no `--`; "Must match the parent directory name" (Agent
  Skills spec). Anthropic adds: no `anthropic` or `claude` in the name; avoid
  vague names like `helper`, `utils`, `tools`; use one consistent naming pattern
  (gerund `processing-pdfs`, noun phrase `pdf-processing`, or action
  `process-pdfs`).
- `description`: non-empty, at most 1,024 characters (Agent Skills spec and
  Anthropic). "Always write in third person" ("Processes Excel files ...", not
  "I can help ..."). Include both what it does and when to use it, with the
  words a user would actually say. Anthropic's pattern: `Extract text and tables
  from PDF files, fill forms, merge documents. Use when working with PDF files or
  when the user mentions PDFs, forms, or document extraction.`
- Put the key use case first, because truncation cuts the end
  (CC:`skills.md`#Frontmatter reference).
- If a skill triggers too often: make the description more specific, or set
  `disable-model-invocation: true` (CC:`skills.md`#Skill triggers too often).
- Body: keep `SKILL.md` under 500 lines; move detail to `references/` files
  linked directly from `SKILL.md`, "one level deep" (CC:`skills.md`#Add
  supporting files; Anthropic best practices).
- The rendered skill "stays in context across turns" and is not re-read, so
  write standing instructions, not one-time steps (CC:`skills.md`#Skill content
  lifecycle).
- After compaction Claude re-attaches the most recent invocation of each skill,
  keeping only its **first 5,000 tokens**, with a 25,000-token total across
  skills; older skills can be dropped. "Put the most important instructions
  near the top of `SKILL.md`" (CC:`skills.md`#Skill content lifecycle;
  CC:`context-window.md`#What survives compaction).
- Malformed YAML: the body still loads but the description is empty, so Claude
  cannot match it. Find it with `claude plugin validate <skills dir>` or
  `--debug` (CC:`skills.md`#Skill not triggering).
- Test triggering in a fresh session with and without the skill;
  `claude plugin eval` automates this for plugin skills
  (CC:`skills.md`#Evaluate and iterate on a skill).

### 2.7 Hooks

#### Where hooks are defined

Source: CC:`hooks.md`#Hook locations.

| Location | Scope |
| --- | --- |
| `~/.claude/settings.json` | All your projects |
| `.claude/settings.json` | This project, committed |
| `.claude/settings.local.json` | This project, personal |
| Managed policy settings | Organization |
| Plugin `hooks/hooks.json` (or `hooks` in `plugin.json`) | While the plugin is enabled |
| Skill frontmatter `hooks:` | From invocation to end of session |
| Subagent frontmatter `hooks:` | While that subagent runs (not for plugin agents) |

Hooks from all sources merge; identical handlers defined in more than one
settings file run once, but a plugin's or skill's copy stays separate. All
matching hooks run in parallel. Hooks from settings and plugins also fire for
tool calls inside subagents, with `agent_id` and `agent_type` in the input
(CC:`hooks.md`#Hook locations, #Hook handler fields).

Plugin `hooks/hooks.json` accepts an optional top-level `description` and
`$schema` (CC:`hooks.md`#Reference scripts by path;
CC:`plugins-reference.md`#Hooks). **Codex rejects `$schema` in a hooks file**
(Part 3.3).

#### Config shape

Source: CC:`hooks.md`#Configuration, #Matcher patterns, #Common fields, #Command
hook fields, #Exec form and shell form.

```json
{
  "description": "optional",
  "hooks": {
    "<EventName>": [
      {
        "matcher": "optional filter",
        "hooks": [
          { "type": "command", "command": "node", "args": ["${CLAUDE_PLUGIN_ROOT}/hooks/x.mjs"], "timeout": 10 }
        ]
      }
    ]
  }
}
```

Handler types: `command`, `http`, `mcp_tool`, `prompt`, `agent`.

Common handler fields: `type` (required), `if` (one permission rule such as
`"Bash(git *)"` or `"Edit(*.ts)"`, tool events only), `timeout` (seconds),
`statusMessage`, `once` (skill frontmatter only).

Command handler fields: `command` (required), `args` (exec form: no shell, each
element one argument), `async`, `asyncRewake`, `shell` (`bash` or
`powershell`).

- The docs recommend exec form (`args`) whenever the command uses a path
  placeholder; in shell form, wrap placeholders in double quotes:
  `"command": "\"${CLAUDE_PLUGIN_ROOT}\"/scripts/x.sh"`.
- Both forms export `CLAUDE_PROJECT_DIR`, `CLAUDE_PLUGIN_ROOT`,
  `CLAUDE_PLUGIN_DATA` to the process.
- **Portability note:** Codex has no `args` field (Part 3.3). For a hook file
  that Codex will also read, use shell form.

Matcher rules (Claude): `"*"`, `""`, or omitted matches everything. A value
made only of letters, digits, `_`, `-`, spaces, `,`, `|` is an exact name or a
list of exact names (`Edit|Write`). Anything else is an unanchored JavaScript
regex, so `Edit.*` also matches `NotebookEdit`; anchor with `^...$`. Matchers
are case-sensitive. A matcher on an event without matcher support is silently
ignored (CC:`hooks.md`#Matcher patterns; CC:`hooks-guide.md`#Hook not firing).

Timeout defaults: `command`/`http`/`mcp_tool` 600 s (30 s on
`UserPromptSubmit`, `PreModelSwitch`, `PostModelSwitch`; 10 s on
`MessageDisplay`); `prompt` 30 s; `agent` 60 s; all `SessionEnd` hooks share a
1.5 s budget, raised by a per-hook `timeout` up to 60 s (plugin hook timeouts
don't raise it) or by `CLAUDE_CODE_SESSIONEND_HOOKS_TIMEOUT_MS`
(CC:`hooks.md`#Common fields, #SessionEnd).

#### Path variables

Source: CC:`plugins-reference.md`#Environment variables; CC:`hooks.md`#Reference
scripts by path.

| Variable | Resolves to | Available in |
| --- | --- | --- |
| `${CLAUDE_PLUGIN_ROOT}` | The plugin's install folder. For a copied plugin it changes on every update; do not write state there. For an in-place plugin from a local marketplace it is the source folder. | Hook and monitor commands, skill and agent content, MCP/LSP config. Exported to hook and MCP/LSP processes. |
| `${CLAUDE_PLUGIN_DATA}` | `~/.claude/plugins/data/<id>/`, survives updates; deleted on uninstall from the last scope unless `--keep-data`. | Same as above. |
| `${CLAUDE_PROJECT_DIR}` | The project root where the session started. It does **not** follow Claude into a worktree; read `cwd` from the hook input for the current directory. | Hooks, skills (v2.1.196+), MCP/LSP servers. |

These are not in the environment of commands Claude runs through the Bash tool
(CC:`plugins-reference.md`#Environment variables).

#### Input and output rules (all events)

Source: CC:`hooks.md`#Common input fields, #Exit code output, #JSON output, #Add
context for Claude, #Decision control.

Common input fields on stdin: `session_id`, `prompt_id` (v2.1.196+),
`transcript_path` (may lag; use `last_assistant_message` on Stop instead),
`cwd`, `scratchpad_dir`, `permission_mode` (`default`, `plan`, `acceptEdits`,
`auto`, `dontAsk`, `bypassPermissions`), `effort` (`{ "level": ... }`),
`hook_event_name`; inside subagents also `agent_id`, `agent_type`.

Exit codes:

- **0**: success. Stdout is parsed as JSON only if it starts with `{` and ends
  with `}`. Plain-text stdout becomes context for Claude only on
  `UserPromptSubmit`, `UserPromptExpansion`, `SessionStart`, `PostModelSwitch`;
  on other events it goes to the debug log. Stderr on exit 0 goes to the debug
  log only.
- **2**: blocking error on events that can block. The block reason is the JSON
  reason if one is given, otherwise stderr. "Exit 2's block is the one outcome
  JSON can't override."
- **Any other code** (including 1): non-blocking error; the action proceeds and
  the transcript shows `<hook name> hook error`. "If your hook is meant to
  enforce a policy, use `exit 2`." A missing or non-executable script also
  lands here, which "leaves the gate silently disabled".
- Invalid JSON (starts with `{` but fails to parse or fails the schema) is a
  non-blocking error.

JSON output fields available on most events: `continue` (false stops Claude
entirely), `stopReason`, `suppressOutput` (no effect), `systemMessage`
(warning shown to the user), `terminalSequence` (allow-listed OSC notifications
and BEL). Event-specific fields go in `hookSpecificOutput` with
`hookEventName` set to the event name. Top-level `decision: "block"` plus
`reason` is used by `UserPromptSubmit`, `UserPromptExpansion`, `PostToolUse`,
`PostToolUseFailure`, `PostToolBatch`, `Stop`, `SubagentStop`, `ConfigChange`,
`PreCompact`.

`additionalContext`: "Claude Code wraps the string in a system reminder and
inserts it into the conversation at the point where the hook fired." Each
string (and plain stdout) is capped at **10,000 characters**; longer output is
saved to a file and replaced with the path and a 2,000-character preview, and
Claude is not told to read the file. The docs advise writing it as factual
statements ("This repo uses `bun test`") rather than imperative system
commands, because command-like text "can trigger Claude's prompt-injection
defenses". When several hooks return it, Claude receives all of them. On
resume, mid-session hook context is replayed, not re-run; `SessionStart` runs
again with `source: "resume"`.

Misplaced fields (for example `permissionDecision` at the top level) are
silently ignored; `claude --debug` logs `Hook JSON output had unrecognized keys`.
A shell profile that echoes text breaks JSON parsing
(CC:`hooks-guide.md`#Hook JSON has no effect).

#### Events: input, blocking, and context

Source: CC:`hooks.md`#Hook events and each event's section; CC:`hooks.md`#Exit
code 2 behavior per event.

| Event | Matcher filters | Key input fields (besides common) | Can block? | How to add context |
| --- | --- | --- | --- | --- |
| `SessionStart` | `startup`, `resume`, `clear`, `compact`, `fork` | `source`, `model` (optional), `agent_type`, `session_title`; on resume/fork also `seconds_since_last_response`, `context_tokens`, `prompt_cache_likely_expired`, `estimated_cache_write_usd` | No | Plain stdout or `additionalContext`; also `initialUserMessage` (`-p` only), `sessionTitle`, `watchPaths`, `reloadSkills` |
| `Setup` | `init`, `maintenance` | `trigger` | No | Output discarded |
| `InstructionsLoaded` | `load_reason`: `session_start`, `nested_traversal`, `path_glob_match`, `include`, `compact` | `file_path`, `memory_type`, `load_reason`, `globs`, `trigger_file_path`, `parent_file_path` | No | None (observability). **Does not fire for an `AGENTS.md` read natively.** |
| `UserPromptSubmit` | none | `prompt` | Yes (erases prompt) | Plain stdout or `additionalContext`; `sessionTitle` |
| `UserPromptExpansion` | command name | `expansion_type`, `command_name`, `command_args`, `command_source`, `prompt` | Yes | `additionalContext`. Fires when the user types `/skill`; `PreToolUse` on `Skill` fires only when Claude calls the tool. |
| `PreToolUse` | tool name | `tool_name`, `tool_input`, `tool_use_id`, `mcp_server` (MCP only) | Yes | `additionalContext`; decisions below |
| `PermissionRequest` | tool name | `tool_name`, `tool_input` | via `decision.behavior` only (exit 2 not honored) | n/a |
| `PostToolUse` | tool name | adds `tool_response`, `duration_ms` | No (tool ran); `decision: "block"` adds `reason` next to the result | `additionalContext`, `updatedToolOutput` |
| `PostToolUseFailure` | tool name | `tool_name`, `tool_input`, error fields | No | `additionalContext` |
| `PostToolBatch` | none | `tool_calls` | Yes (stops the loop) | `additionalContext` once per batch |
| `Notification` | `permission_prompt`, `idle_prompt`, `agent_needs_input`, `agent_completed`, and others | `message`, `title`, `notification_type` | No | None (`terminalSequence` works) |
| `SubagentStart` | agent type (plugin agents: anchor `^my-plugin:reviewer$`) | `agent_id`, `agent_type` | No | `additionalContext` to the subagent |
| `SubagentStop` | agent type | `stop_hook_active`, `agent_id`, `agent_type`, `agent_transcript_path`, `last_assistant_message`, `background_tasks`, `session_crons` | Yes (keeps subagent running) | `additionalContext` |
| `TaskCreated`, `TaskCompleted` | none | `task_id`, `task_subject`, `task_description`, `teammate_name` | Yes | stderr/`reason` returned to Claude |
| `Stop` | none | `stop_hook_active`, `last_assistant_message`, `background_tasks`, `session_crons` | Yes (Claude continues) | `hookSpecificOutput.additionalContext` continues without an error label |
| `StopFailure` | error type | `error`, `error_details` | No | Ignored |
| `ConfigChange` | `user_settings`, `project_settings`, `local_settings`, `policy_settings`, `skills` | | Yes | |
| `CwdChanged` | none | `old_cwd`, `new_cwd` | No | `watchPaths`; `CLAUDE_ENV_FILE` available |
| `FileChanged` | literal file names to watch, e.g. `.envrc\|.env` | `file_path`, `event` (`change`, `add`, `unlink`) | No | `watchPaths` |
| `WorktreeCreate`, `WorktreeRemove` | none | `name` / `worktree_path` | Yes (any non-zero exit) | Path on stdout |
| `PreCompact` | `manual`, `auto` | `trigger`, `custom_instructions` | Yes | None |
| `PostCompact` | `manual`, `auto` | `trigger`, `compact_summary` | No | None |
| `SessionEnd` | `clear`, `resume`, `logout`, `prompt_input_exit`, `other` | `reason` | No | Output discarded |

Also present: `PermissionDenied`, `MessageDisplay`, `TeammateIdle`,
`DirectoryAdded`, `PreModelSwitch`, `PostModelSwitch`, `Elicitation`,
`ElicitationResult` (CC:`hooks.md`#Hook lifecycle).

SessionStart specifics (CC:`hooks.md`#SessionStart):

- Only `command` and `mcp_tool` handlers are supported; `mcp_tool` handlers are
  skipped at launch because MCP servers are not ready yet. "A `type: "command"`
  hook on `SessionStart` runs at launch, so use one for anything the session
  needs from its first turn."
- At launch the hooks run in the background, but "Claude's first response still
  waits for the hooks to finish".
- `compact` fires after every compaction. The hooks guide's pattern "Re-inject
  context after compaction" uses a `SessionStart` hook with matcher `compact`
  (CC:`hooks-guide.md`#Re-inject context after compaction).
- `CLAUDE_ENV_FILE` (SessionStart, Setup, CwdChanged, FileChanged): append
  `export` lines to persist environment variables for later Bash commands.
- Keep it fast: it runs on every session.

PreToolUse decisions (CC:`hooks.md`#PreToolUse decision control):

- `hookSpecificOutput.permissionDecision`: `allow` (skips the prompt, except
  actions no mode auto-approves), `deny`, `ask`, `defer` (`-p` only).
- `permissionDecisionReason`: shown to Claude on `deny`; to the user on
  `allow`/`ask`.
- `updatedInput` replaces the whole tool input.
- Precedence across hooks: `deny` > `defer` > `ask` > `allow`.
- A hook `deny` blocks even in `bypassPermissions` mode; a hook `allow` cannot
  override settings deny rules (CC:`hooks-guide.md`#Hooks and permission modes).
- Top-level `decision: "approve"|"block"` is deprecated for PreToolUse.
- A timed-out command hook does **not** block the tool call
  (CC:`hooks.md`#Timeouts).
- File tools (`Write`, `Edit`, `Read`) always receive an absolute
  `tool_input.file_path`. `Write` has `file_path`, `content`; `Edit` has
  `file_path`, `old_string`, `new_string`, `replace_all`; `Bash` has `command`,
  `description`, `timeout`, `run_in_background`.
- PreToolUse never fires for files the user attaches with `@`.
- To watch a file whatever wrote it (including the user outside Claude), use
  `FileChanged`; `PostToolUse` on `Edit|Write` does not fire when a Bash command
  or outside process rewrites the file (CC:`hooks.md`#PostToolUse).
  `FileChanged` matchers are literal file names in the working directory, not
  globs; dynamic absolute paths come from `watchPaths` (CC:`hooks.md`#FileChanged).

Stop specifics (CC:`hooks.md`#Stop; CC:`hooks-guide.md`#Stop hook hits the
block cap): check `stop_hook_active` and exit 0 when it is `true`, or the hook
can loop. Claude Code overrides a Stop hook after 8 consecutive blocks
(`CLAUDE_CODE_STOP_HOOK_BLOCK_CAP` raises it). Stop fires at the end of every
turn, not only at task completion, and not on user interrupts. `/goal` is a
built-in session-scoped prompt-based Stop hook and is unavailable when hooks are
disabled (CC:`goal.md`#How evaluation works, #Requirements).

#### Trust, disabling, debugging

- Interactive sessions hold back hooks from every settings file until the
  workspace trust dialog is accepted. `-p` and SDK sessions treat the folder as
  trusted, so repository hooks run (CC:`hooks.md`#Workspace trust).
- `"disableAllHooks": true` turns off user, project, local, and plugin hooks;
  there is no way to disable one hook while keeping it configured
  (CC:`hooks.md`#Disable or remove hooks). **It also turns off native
  `AGENTS.md` reading** (CC:`memory.md`#When AGENTS.md support is unavailable).
- `/hooks` shows every configured hook and its source (`Plugin Hooks`, `Project
  Settings`, and so on).
- Debug: `claude --debug-file /tmp/claude.log`, or `claude --debug` then read
  `~/.claude/debug/<session-id>.txt`; `CLAUDE_CODE_DEBUG_LOG_LEVEL=verbose` adds
  matcher detail (CC:`hooks.md`#Debug hooks). Test a script by piping sample
  JSON: `echo '{"tool_name":"Bash","tool_input":{"command":"ls"}}' | ./hook.sh`
  (CC:`hooks-guide.md`#Hook error in output).
- Limits: hooks "can't trigger `/` commands or tool calls"; when several
  PreToolUse hooks return `updatedInput`, the last to finish wins
  (CC:`hooks-guide.md`#Limitations).

### 2.8 Instruction files: `AGENTS.md`, imports, rules

#### How Claude Code reads `AGENTS.md`

Source: CC:`memory.md`#AGENTS.md and its subsections.

| Repository has | Claude reads |
| --- | --- |
| `AGENTS.md`, and no `CLAUDE.md` or `CLAUDE.local.md` in the working directory or above | `AGENTS.md` |
| `AGENTS.md` and a `CLAUDE.md` or `CLAUDE.local.md` in the working directory or above | `CLAUDE.md` files only |
| A `CLAUDE.md` that imports `@AGENTS.md` | `CLAUDE.md` with `AGENTS.md` included |

- Requires Claude Code **v2.1.277 or later** (installed: 2.1.280).
- Files that block `AGENTS.md`: `CLAUDE.md`, `.claude/CLAUDE.md`,
  `CLAUDE.local.md` in the working directory or any parent. Files that do not
  block it: `~/.claude/CLAUDE.md`, the managed `CLAUDE.md`, and `.claude/rules/`.
- At session start Claude reads every `AGENTS.md` and `.claude/AGENTS.md` from
  the working directory up. An interactive session prints `no CLAUDE.md found;
  AGENTS.md loaded: <path>`.
- A subdirectory's `AGENTS.md` loads when Claude opens a file there with the
  Read tool "and that subdirectory has none of the three `CLAUDE.md` files of
  its own".
- Inside `AGENTS.md`, `@path` imports are expanded and `claudeMdExcludes`
  applies.
- Not read: `AGENTS.local.md`, `AGENTS.override.md`, anything under `.agents/`.
- Setting: `/config` → **Project instructions**: `claude-md-or-agents-md`
  (default), `claude-md-and-agents-md`, `claude-md`, `managed-only`. In files it
  lives in `pluginConfigs["agents-md@builtin"].options.instructionFiles`, honored
  only in `~/.claude/settings.json`, `--settings`, or managed settings, not in
  project settings.

When native reading is unavailable (Claude reads `CLAUDE.md` only, and the
**Project instructions** setting is missing from `/config`):
Claude Code before v2.1.277; sessions that do not fetch feature flags (Amazon
Bedrock or other third-party providers, or telemetry disabled); "your first
session after you install or upgrade"; `disableAllHooks` or
`allowManagedHooksOnly` set; or the built-in `agents-md` plugin disabled in
`/plugin` (CC:`memory.md`#When AGENTS.md support is unavailable). The fallback
the docs give is a `CLAUDE.md` containing `@AGENTS.md`, which Mike's decision
rules out; the toolkit should instead detect the gap (see Open questions).

Differences from `CLAUDE.md` when read natively (CC:`memory.md`#Where AGENTS.md
differs from CLAUDE.md): not listed in `/memory` or `/context` Memory files;
`InstructionsLoaded` does not fire; not loaded from `--add-dir` directories; an
external `@path` import loads only if external imports were already approved.

Troubleshooting: "the usual cause is a `CLAUDE.md` somewhere on the project
path" (CC:`memory.md`#My AGENTS.md isn't loading). Remove any leftover
`SessionStart` hook that prints `AGENTS.md`, or Claude gets two copies
(CC:`memory.md`#Remove an earlier AGENTS.md workaround).

#### `@path` imports

Source: CC:`memory.md`#Import additional files. `@path/to/file` anywhere in the
file; relative paths resolve from the importing file; up to four hops deep;
paths inside backticks or code blocks are not imported. Imports outside the
working directory need a one-time approval. Imported files load at launch, so
they save no context. **Codex does not expand imports** (CX-captured
`README.md`, "Facts this project relies on").

#### Size and content guidance

- "target under 200 lines per CLAUDE.md file"; files over 4 MiB are skipped
  (CC:`memory.md`#Write effective instructions, #My CLAUDE.md is too large).
- Write concrete, checkable instructions ("Run `npm test` before committing");
  contradictory instructions make Claude "pick one arbitrarily"
  (CC:`memory.md`#Write effective instructions).
- Block-level HTML comments `<!-- ... -->` are stripped before injection; use
  them for maintainer notes (CC:`memory.md`#How CLAUDE.md files load).
- Instruction files are delivered "as a user message after the system prompt",
  so compliance is not guaranteed; hooks are the enforcement layer
  (CC:`memory.md`#Claude isn't following my CLAUDE.md).

#### `.claude/rules/`

Source: CC:`memory.md`#Organize rules with `.claude/rules/`, #Path-specific
rules, #Share rules across projects with symlinks, #User-level rules.

- Any `.md` file under `.claude/rules/`, found recursively (subfolders allowed).
- Without `paths` frontmatter: loaded at launch with the same priority as
  `.claude/CLAUDE.md`.
- With `paths`: loaded when Claude **reads** a matching file ("not on every tool
  use"). Format:

```markdown
---
paths:
  - "src/api/**/*.ts"
  - "src/**/*.{ts,tsx}"
---
# Rule title
```

- Globs: `**/*.ts`, `src/**/*`, `*.md` (root only), brace expansion allowed
  (budget of 1,000 expanded patterns per rule). An invalid `[` pattern matches
  nothing.
- Symlinked rule files pointing outside the working directory need
  external-import approval, and then only unscoped ones load. `~/.claude/rules/`
  applies to every project, loaded before project rules.
- Rules are skipped when `project` is excluded from `--setting-sources`.

#### What survives compaction

Source: CC:`context-window.md`#What survives compaction;
CC:`memory.md`#Instructions seem lost after `/compact`.

| Content | After compaction |
| --- | --- |
| System prompt and output style | Still apply |
| Project-root instruction file and unscoped rules | Re-injected from disk |
| Rules with `paths:` and nested instruction files | Reload only when Claude next reads a matching file |
| Invoked skill bodies | Re-injected, first 5,000 tokens each, 25,000 total |
| Context hooks added earlier | Summarized with the conversation |
| `SessionStart` hooks matching `compact` | Run again; output added |

"If a rule must persist across compaction, drop the `paths:` frontmatter or
move it to the project-root CLAUDE.md."

### 2.9 Output styles

Source: CC:`output-styles.md`; CC:`plugins-reference.md`#Component path fields;
CC:`settings-reference.md`#`outputStyle`; CC:`sub-agents.md`#What loads at
startup.

- A style is a Markdown file: frontmatter, then instructions.
- Locations: `~/.claude/output-styles/`, project `.claude/output-styles/` (every
  one between the working directory and the repo root; closest wins), managed,
  and plugin `output-styles/` (or the `outputStyles` manifest path, which
  replaces the default folder).
- Frontmatter: `name` (defaults to the file name), `description` (shown in the
  picker), `keep-coding-instructions` (default `false`; set `true` to keep
  Claude Code's engineering instructions), `force-for-plugin` (plugin styles
  only: "apply this style automatically whenever the plugin is enabled ...
  Overrides the user's `outputStyle` setting. If multiple enabled plugins set
  this, Claude Code uses the first one loaded").
- Selecting: `"outputStyle": "<name>"` in any settings file, `/output-style
  <name>`, or `/config`; the menu writes `.claude/settings.local.json`.
  `claude plugin init --with output-style` scaffolds "an
  `output-styles/<name>.md` that applies automatically while the plugin is
  enabled".
- A mid-session switch applies from the next message (v2.1.251+). Style files
  are read at startup; edits need a restart.
- The style is sent with every request and survives compaction.
- "Output styles apply to the main conversation and to a fork ... Other
  subagents run their own system prompt, so styles don't change how they
  respond." Any agent definition must carry its own writing rules.
- Codex has no output styles (Part 3). OpenAI's conversion guide says to move
  `outputStyles` behavior into skills or instructions
  (CXP:`guides/submit-claude-plugin`).
- Not documented: whether a plugin style must be selected by a namespaced name
  such as `plugin:Plain English`. See Open questions.

The current toolkit ships the style as a project file, not a plugin component:
`plugins/project-init/library/output-styles/plain-english.md` with frontmatter
`name: Plain English`, `keep-coding-instructions: true`, copied to the project's
`.claude/output-styles/` and selected with `"outputStyle": "Plain English"`
(Observed; the model project's `.claude/settings.json` has the same setting).

### 2.10 Subagents

Source: CC:`sub-agents.md`#Supported frontmatter fields, #What loads at startup,
#Run every subagent on one model.

- File: Markdown with frontmatter. Required: `name` (lowercase and hyphens, no
  `:`), `description`. Optional: `tools`, `disallowedTools`, `model` (`sonnet`,
  `opus`, `haiku`, `fable`, a full id, or `inherit`), `permissionMode`,
  `maxTurns`, `skills` (preloaded in full), `mcpServers`, `hooks`, `memory`,
  `background`, `omitClaudeMd`, `effort`, `isolation: worktree`, `color`,
  `initialPrompt`, `experimental.cacheTtl`. Plugin agents ignore `hooks`,
  `mcpServers`, `permissionMode`.
- A subagent starts fresh: its own system prompt, the delegation message, the
  project instruction files (including `AGENTS.md` when read natively), git
  status, preloaded skills. It does not get the conversation, the output style,
  or auto memory. The built-in Explore and Plan agents skip the instruction
  files.
- `CLAUDE_CODE_SUBAGENT_MODEL` plus `CLAUDE_CODE_SUBAGENT_MODEL_FORCE=1`
  (v2.1.257+) run every subagent on one model; forks and `context: fork` skills
  with `model: inherit` still use the main model.
- Skills with `disable-model-invocation: true` cannot be preloaded into a
  subagent (CC:`sub-agents.md`#Preload skills into subagents).

### 2.11 Settings that matter to the toolkit

Source: CC:`settings.md`#Settings files and who they affect, #Settings
precedence, #Lists merge instead of overriding; CC:`settings-reference.md`
entries named below; CC:`permissions.md`#What runs before you trust a folder.

Files: `~/.claude/settings.json` (user), `.claude/settings.json` (shared
project, committed), `.claude/settings.local.json` (personal project, kept out
of git), managed. Precedence, highest first: managed, command line, project
local, shared project, user. List keys such as `permissions.allow` merge across
files.

| Key | What it does |
| --- | --- |
| `hooks` | Hook config; merges across files. |
| `enabledPlugins` | `{ "plugin@marketplace": true/false }`. Project beats user; opt out personally in `.claude/settings.local.json`. |
| `extraKnownMarketplaces` | `{ "<name>": { "source": { "source": "github"\|"git"\|"url"\|"file"\|"directory"\|"settings", ... }, "autoUpdate": bool } }`. `directory` (with `path`) is "for development only". From a repository it is honored only after the trust dialog, and **ignored in `claude -p` runs in an untrusted folder**. |
| `outputStyle` | Style name. |
| `skillListingBudgetFraction`, `skillListingMaxDescChars` | Skill listing budget (Part 2.6). |
| `skillOverrides` | `on`, `name-only`, `user-invocable-only`, `off` per skill name; not for plugin skills. |
| `claudeMdExcludes` | Globs of instruction files to skip. |
| `disableAllHooks` | Turns off hooks, and native `AGENTS.md` reading. |
| `env` | Environment variables for every session. |
| `autoMemoryEnabled` | Auto memory on or off (the model project sets `false`). |
| `permissions.allow` / `ask` / `deny` | Permission rules. |

`pluginConfigs` values (plugin `userConfig`) are read only from user settings,
`--settings`, and managed settings, never from project files
(CC:`plugins-reference.md`#User configuration).

### 2.12 Built-in command names to avoid for skills

A skill named `x` creates `/x` in the same namespace as built-in commands
(claude-toolkit `plugins/AGENTS.md`). Names found in CC:`commands.md` (Observed
by extracting its table): `add-dir advisor agents artifacts auto-mode-setup
autocompact autofix-pr background batch branch btw bug cd chrome claude-api
clear code-review color compact config context copy cost dataviz debug
deep-research design design-login design-sync desktop diff doctor effort exit
export fast feedback fewer-permission-prompts focus fork goal heapdump help
hooks ide import init insights install-github-app install-slack-app keybindings
list-agents login logout loop mcp memory mobile model output-style passes
permissions plan plugin powerup pr-comments privacy-settings radio
rate-limit-options recap release-notes reload-plugins reload-skills
remote-control remote-env rename resume review rewind run run-skill-generator
sandbox schedule scroll-speed security-review setup-bedrock setup-vertex
simplify skill-doctor skills stats status statusline stickers stop subtask tasks
team-onboarding teleport terminal-setup theme tui ultraplan ultrareview upgrade
usage usage-credits verify vim voice web-setup workflow-authoring workflows`.

A plugin skill is always reachable as `/plugin:skill` even if the bare name is
taken, but the bare name then runs the other command
(CC:`skills.md`#How a skill gets its command name).

---

## Part 3. Codex details

### 3.1 `AGENTS.md`

Source: CX-captured `agents-md.md`; CX-captured `README.md`;
CX:`config-file/config-reference` (`project_doc_max_bytes`,
`project_doc_fallback_filenames`, `model_instructions_file`).

- Global: `~/.codex/AGENTS.override.md` if present, else `~/.codex/AGENTS.md`
  (first non-empty file only). `CODEX_HOME` moves the home folder.
- Project: from the project root (usually the Git root) **down to the current
  working directory**; in each directory `AGENTS.override.md`, then `AGENTS.md`,
  then any `project_doc_fallback_filenames`; at most one file per directory.
- Files are concatenated root first, joined with blank lines; later (closer)
  files override earlier ones.
- Combined size limit `project_doc_max_bytes`, 32 KiB by default. Codex stops
  adding files at the limit; the budget is spent root first, so a large root
  file can starve nested ones (CX-captured `README.md`, from
  `codex-rs/core/src/agents_md.rs`).
- The chain is built once per run (once per TUI session). Codex does not load a
  subdirectory's `AGENTS.md` later when it works on files there; "Codex stops
  searching once it reaches your current directory".
- Codex never reads `CLAUDE.md` (the fallback list is empty by default) and
  never expands `@path` imports.
- `model_instructions_file` replaces the built-in instructions "instead of
  `AGENTS.md`"; `developer_instructions` adds session instructions.
- OpenAI's advice: "Keep it small"; add rules for repeated mistakes and routing
  guidance for "too much reading" (CX:`customization/overview`#AGENTS
  Guidance).
- Codex does not read `.claude/rules/`. Nothing in the Codex docs mentions
  path-scoped rules.

### 3.2 Skills

Source: CX:`build-skills`; CX:`customization/overview`#Skills;
CXP:`build/skills`; CX:`config-file/config-reference` (`skills.*`).

- A skill is a folder with `SKILL.md`; "The `SKILL.md` file must include `name`
  and `description`." Optional `scripts/`, `references/`, `assets/`, and
  `agents/openai.yaml`.
- Locations: `.agents/skills` in every directory from the working directory up
  to the repo root; `$HOME/.agents/skills` (user); `/etc/codex/skills` (admin);
  bundled system skills; plus skills in enabled plugins. Symlinked skill folders
  are followed. Two skills with the same `name` both appear.
- Codex does not read `.claude/skills/`, and Claude does not read
  `.agents/skills/`. A project that wants the same skill in both hosts without a
  plugin needs it in both folders (the model project duplicates three skills
  this way) or a symlink.
- Invocation: explicit with `$skill-name` or `/skills` in the CLI; implicit when
  the task matches `description`.
- Listing budget: "at most 2% of the model's context window, or 8,000 characters
  when the context window is unknown". Codex "shortens skill descriptions first"
  and "may omit some skills from the initial list and show a warning". The
  listing also includes each skill's file path. Config key
  `skills.max_context_tokens` (explicit values capped at 10,000 tokens).
- Description guidance: "write concise descriptions with clear scope and
  boundaries. Front-load the key use case and trigger words"; "Explain exactly
  when this skill should and should not trigger" (CX:`build-skills`). "The
  description determines when the model considers the skill. State the workflow
  and the conditions that should trigger it. Put detailed procedure, format, and
  safety instructions in the body" (CXP:`build/skills`#Write SKILL.md).
- Best practices: "Keep each skill focused on one job"; prefer instructions over
  scripts unless deterministic behavior is needed; "Split workflows when they
  have different triggers, inputs, or success criteria"; test direct, indirect,
  incomplete, should-not-trigger, and edge-case prompts (CX:`build-skills`#Best
  practices; CXP:`build/skills`#Define the workflow boundary, #Test the skill).
- Manual-only skills: `agents/openai.yaml` with `policy:
  allow_implicit_invocation: false` (explicit `$skill` still works). This is the
  Codex counterpart of Claude's `disable-model-invocation: true`.
- Disable a skill without deleting it: `[[skills.config]]` with `path` and
  `enabled = false` in `~/.codex/config.toml`.
- Codex detects skill changes automatically; restart if one does not appear.
- Not documented for Codex: `when_to_use`, `disable-model-invocation`,
  `allowed-tools` behavior, `$ARGUMENTS`, `${CLAUDE_*}` substitution, `!`
  command injection, `context: fork`. Treat them as Claude-only.

### 3.3 Hooks

Source: CX:`hooks` (whole page); CX-src:`codex-rs/config/src/hook_config.rs`
(last changed 2026-08-28, commit `c2abf869`).

#### Where Codex finds hooks

- `hooks.json` or inline `[hooks]` tables in `config.toml`, next to each active
  config layer. Useful locations: `~/.codex/hooks.json`, `~/.codex/config.toml`,
  `<repo>/.codex/hooks.json`, `<repo>/.codex/config.toml`. All sources load;
  higher layers do not replace lower ones.
- Project `.codex/` hooks load only when the project is trusted
  (`projects.<path>.trust_level`).
- Plugin hooks: by default `hooks/hooks.json` in the plugin root. A `hooks`
  entry in the Codex manifest (a `./` path, an array of paths, an inline hooks
  object, or an array of them) replaces the default file; it does not add to
  it.
- Hooks are on by default; `[features] hooks = false` turns them off
  (`codex_hooks` is a deprecated alias). Observed: `codex features list` shows
  `hooks  stable  true`.

#### Trust

- "Before a non-managed hook can run, Codex requires you to review and trust
  the exact hook definition. Codex records trust against the hook's current
  hash, so new or changed hooks are marked for review and skipped until
  trusted." Use `/hooks` in the CLI to review, trust, or disable individual
  hooks.
- "Installing or enabling a plugin doesn't automatically trust its hooks."
- `--dangerously-bypass-hook-trust` runs enabled hooks without stored trust for
  one invocation (Observed in `codex --help` and `codex exec --help`, 0.157.0).
- Observed storage: `~/.codex/config.toml` has `[hooks.state."<source>:<event>:<group>:<handler>"]`
  tables with `trusted_hash = "sha256:..."`, for example keys like
  `"/Users/.../.codex/hooks.json:session_start:0:0"` and
  `"browser@openai-bundled:plugin.json#hooks[0]:stop:0:0"`.

#### Config shape and handler fields

```json
{
  "description": "optional",
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume|clear|compact",
        "hooks": [
          {
            "type": "command",
            "command": "node \"$(git rev-parse --show-toplevel)/.codex/hooks/x.mjs\"",
            "timeout": 10,
            "statusMessage": "Loading project context",
            "additionalContextLimit": 5000
          }
        ]
      }
    ]
  }
}
```

- Top-level keys: only `description` and `hooks`. The Rust struct `HooksFile`
  has `#[serde(deny_unknown_fields)]`, so any other top-level key, including
  `$schema`, fails the file (CX-src). Unknown event names inside `hooks` are not
  rejected by that struct (the event struct has no `deny_unknown_fields`), so
  Claude-only events are likely ignored; not tested.
- `command` handler fields (CX-src enum `HookHandlerConfig::Command`):
  `command` (required), `commandWindows` (alias `command_windows`), `timeout`
  (seconds), `async`, `statusMessage`, `additionalContextLimit`. **No `args`,
  `if`, `once`, `shell`, or `asyncRewake`.** Extra keys are not rejected, so a
  Claude exec-form hook would load with `args` silently dropped.
- `mcp_tool` fields: `server`, `tool`, `input` (with `${field.path}`
  expansion), `timeout`, `statusMessage`. MCP tool hooks do not start servers;
  `SessionStart` can run before a server is ready; `SessionEnd` does not support
  them.
- `prompt` and `agent` handlers are "parsed but skipped".
- Commands run with the session `cwd` as the working directory. "For repo-local
  hooks, prefer resolving from the git root instead of using a relative path
  such as `.codex/hooks/...`."
- Timeouts: default 600 s; `SessionEnd` and `Interrupt` default 1 s, maximum
  3 s.
- Multiple matching command hooks run concurrently.

#### Plugin hook environment

"Plugin hook commands receive these environment variables: `PLUGIN_ROOT` ...
`PLUGIN_DATA` ... Codex also sets `CLAUDE_PLUGIN_ROOT` and `CLAUDE_PLUGIN_DATA`
for compatibility" (CX:`hooks`#Plugin-bundled hooks). The official example
command is `python3 ${PLUGIN_ROOT}/hooks/session_start.py` (shell expansion).
Codex does not document `CLAUDE_PROJECT_DIR` or any project-root variable; the
environment-variables page lists only `CODEX_HOME`, `CODEX_SQLITE_HOME`,
`CODEX_INSTALL_DIR` and similar (CX:`config-file/environment-variables`). The
current toolkit's scripts also check `CODEX_PROJECT_DIR`; that name appears in
no Codex doc.

#### Events

| Event | Matcher filters | Extra input fields | Output that matters |
| --- | --- | --- | --- |
| `SessionStart` | `source`: `startup`, `resume`, `clear`, `compact` (no `fork`) | `source`, plus common | Plain stdout = developer context; or `hookSpecificOutput.additionalContext`. After compaction of the root session, runs before the next model request, even mid-turn. |
| `SessionEnd` | `reason` (always `other`) | `reason` | Advisory; always synchronous; main thread only. |
| `UserPromptSubmit` | not supported | `turn_id`, `prompt` | Plain stdout = context; `additionalContext`; block with `decision: "block"` + `reason` or exit 2 + stderr. |
| `PreToolUse` | tool name (regex) | `turn_id`, `tool_name`, `tool_use_id`, `tool_input` | Plain stdout ignored. Deny with `hookSpecificOutput.permissionDecision: "deny"` + `permissionDecisionReason`, or legacy `decision: "block"`, or exit 2 + stderr. `additionalContext`. `permissionDecision: "allow"` + `updatedInput` rewrites. |
| `PermissionRequest` | tool name | `turn_id`, `tool_name`, `tool_input` | `decision.behavior` `allow`/`deny`; any deny wins. |
| `PostToolUse` | tool name | adds `tool_response` | Plain stdout ignored; `decision: "block"` replaces the tool result with feedback; `additionalContext`; `continue: false`. |
| `PreCompact`, `PostCompact` | `manual`, `auto` | `turn_id`, `trigger` | Plain stdout ignored; `continue: false` stops. |
| `SubagentStart` | agent type | `turn_id`, `agent_id`, `agent_type` | Plain stdout = subagent context; `additionalContext`; cannot stop it. |
| `SubagentStop` | agent type | `agent_id`, `agent_type`, `agent_transcript_path`, `stop_hook_active`, `last_assistant_message` | **JSON required on exit 0; plain text invalid.** `decision: "block"` continues the subagent. |
| `Stop` | not supported | `turn_id`, `stop_hook_active`, `last_assistant_message` | **JSON required on exit 0; plain text invalid.** `decision: "block"` + `reason` makes Codex continue, using `reason` as a new user prompt. |
| `Interrupt` | not supported | `turn_id`, `permission_mode` | Only `systemMessage`; plain text invalid; main thread only. |

Common input fields: `session_id` (subagent hooks get the parent's id),
`transcript_path` (format not stable), `cwd`, `hook_event_name`, `model`; most
events also get `permission_mode` (`default`, `acceptEdits`, `plan`, `dontAsk`,
`bypassPermissions`).

Shared output fields: `continue`, `stopReason`, `systemMessage`,
`suppressOutput` (parsed, not implemented). "Exit `0` with no output is treated
as success."

PreToolUse traps: `permissionDecision: "ask"`, legacy `decision: "approve"`,
`continue: false`, `stopReason`, `suppressOutput` "are parsed but not supported
yet. Codex marks the hook run as failed, reports the error, and continues the
tool call." For Bash and `apply_patch`, `updatedInput` must contain a string
`command`.

Tool names and coverage: shell commands and `exec_command` match as `Bash`;
file edits go through `apply_patch`, which matchers can also call `Edit` or
`Write`, but the input still says `tool_name: "apply_patch"` and the patch text
is in `tool_input.command` (there is no `file_path`). MCP tools match
`mcp__server__tool`. Hosted tools such as `WebSearch` do not fire tool hooks.
`write_stdin` does not repeat `PreToolUse`. "Treat tool hooks as a useful
guardrail, not a complete enforcement boundary."

Matchers are always regular expressions in Codex (`"Bash"` is unanchored).
`^Bash$` works the same way in both hosts.

Large output: model-visible hook output is limited to roughly 2,500 tokens per
message by default; larger output is "spilled" to
`<temp_dir>/hook_outputs/<session_id>/<uuid>.txt` with a head-and-tail preview.
`additionalContextLimit` on a handler changes the threshold for its
`additionalContext` (`0` means no limit, not advised). The current toolkit uses
`additionalContextLimit` values of 1000 and 5000 in its `.codex/hooks.json`
(Observed).

Background hooks: `"async": true`; output is delivered at the next safe point;
they cannot block or decide; at most eight run at once per session; unfinished
ones are cancelled when the session ends.

### 3.4 Plugins and marketplaces

Sources: CXP:`build/plugins` (Package your plugin); CX:`plugins`;
CX:`config-file/config-reference` (`marketplaces.*`, `plugins.*`);
CXP:`guides/submit-claude-plugin`; CX-src:`codex-rs/utils/plugins/src/plugin_namespace.rs`,
`codex-rs/core-plugins/src/marketplace.rs`, `codex-rs/core-plugins/src/manifest.rs`;
Observed CLI help.

#### Which manifest Codex reads

Order (CX-src `find_plugin_manifest_path`, and test
`preserves_codex_claude_cursor_legacy_precedence`):

1. Root `plugin.json`, only if its `$schema` is an Agent Plugins schema
   (`https://agent-plugins.org/schemas/1.0.0/plugin.schema.json`).
2. `.codex-plugin/plugin.json`.
3. `.claude-plugin/plugin.json`.
4. `.cursor-plugin/plugin.json`.

A symlinked or non-file manifest makes discovery fail.

The docs now prefer the portable layout: root `plugin.json` with
`$schema`, `name`, `version`, `description`, `author`, `homepage`,
`repository`, `license`, `keywords`; skills always from `skills/`; MCP servers
from root `mcp.json` (no dot, with a transport `type` per server); OpenAI-only
settings under `extensions.com.openai` (`apps`, `hooks`, `interface`).
"Existing `.codex-plugin/plugin.json` files remain supported as a compatibility
fallback." The built-in `@plugin-creator` still scaffolds the
`.codex-plugin/plugin.json` layout (CXP:`build/plugins`#Plugin creator output).

Claude Code does not read a root `plugin.json`, and Codex's portable format uses
`mcp.json` while Claude uses `.mcp.json`. The two-manifest layout
(`.claude-plugin/` + `.codex-plugin/`) avoids both issues and is what works on
this Mac today.

`.codex-plugin/plugin.json` fields used by the current toolkit and the bundled
OpenAI plugins (Observed; CXP:`build/plugins`#Manifest fields): `name`,
`version`, `description`, `author` {`name`, `email`, `url`}, `homepage`,
`repository`, `license`, `keywords`, `skills` (`"./skills/"`), `hooks`
(path(s) or inline), `apps` (`"./.app.json"`), `mcpServers`, and `interface`
{`displayName`, `shortDescription`, `longDescription`, `developerName`,
`category`, `capabilities` (e.g. `Interactive`, `Read`, `Write`, `Repository`),
`websiteURL`, `privacyPolicyURL`, `termsOfServiceURL`, `defaultPrompt` (array),
`brandColor`, `composerIcon`, `logo`, `screenshots`}. Paths start with `./` and
stay inside the plugin root. Observed example of inline hooks in a Codex
manifest: the bundled `browser` plugin's `.codex-plugin/plugin.json` has
`"hooks": { "hooks": { "Interrupt": [...], "SubagentStop": [...], "Stop": [...] } }`
with `mcp_tool` handlers.

What Codex plugins do **not** support (CXP:`guides/submit-claude-plugin`):
`commands/` and `agents/` ("Convert reusable behavior to skills"),
`userConfig`/`${user_config.*}`, `outputStyles`, `lspServers`, themes,
monitors, `channels`, `dependencies`, plugin `settings.json`, `bin/` on PATH,
and "Don't depend on hooks in ordinary Chat; Codex doesn't run prompt or agent
hook handlers."

Skill namespace: Codex derives a plugin skill's namespace from the manifest
`name` (CX-src `plugin_namespace.rs`, "Resolve plugin namespace from skill file
paths"). Exact invocation spelling for a plugin skill in the Codex CLI was not
checked; see Open questions.

#### Marketplace file

Which file Codex reads in a marketplace root (CX-src `marketplace.rs`,
`MARKETPLACE_MANIFEST_RELATIVE_PATHS`), first found wins:
`.agents/plugins/marketplace.json`, `.agents/plugins/api_marketplace.json`,
`.claude-plugin/marketplace.json`, `.cursor-plugin/marketplace.json`. The docs
call `.claude-plugin/marketplace.json` "a legacy-compatible marketplace"
(CXP:`build/plugins`#How local marketplaces work).

Format (CXP:`build/plugins`#Marketplace metadata):

```json
{
  "name": "toolkit-v2",
  "interface": { "displayName": "Toolkit V2" },
  "plugins": [
    {
      "name": "work",
      "source": { "source": "local", "path": "./plugins/work" },
      "policy": { "installation": "AVAILABLE", "authentication": "ON_INSTALL" },
      "category": "Productivity"
    }
  ]
}
```

- `source.path` is relative to the marketplace root (not to `.agents/plugins/`),
  starts with `./`, stays inside the root. A plain string path is also accepted
  for local entries. Git sources: `"source": "url"` or `"git-subdir"` with
  `url`, `path`, `ref`/`sha`; npm: `package`, `version`, `registry`.
- "Always include `policy.installation`, `policy.authentication`, and
  `category` on each plugin entry." `installation`: `AVAILABLE`,
  `INSTALLED_BY_DEFAULT`, `NOT_AVAILABLE`. `authentication`: on install or on
  first use (`ON_INSTALL` is the value in use).
- An entry whose source cannot be resolved is skipped; the rest still load.
- Personal marketplace: `~/.agents/plugins/marketplace.json`.

#### CLI (Observed `codex plugin --help`, 0.157.0; CXP:`build/plugins`#Add a marketplace from the CLI)

```bash
codex plugin marketplace add /Users/michaelrihm/Documents/Projects/toolkit-v2   # local root, owner/repo[@ref], or Git URL
codex plugin marketplace add owner/repo --ref main --sparse .agents/plugins
codex plugin marketplace list        # prints each marketplace and its root
codex plugin marketplace upgrade [name]   # refreshes Git marketplace snapshots
codex plugin marketplace remove <name>
codex plugin add <plugin>@<marketplace> [--json]   # or <plugin> --marketplace <name>
codex plugin list
codex plugin remove <plugin>
```

There is no Codex equivalent of `claude plugin validate`. Proof of a good
Codex package is `codex plugin add` succeeding plus the skills and hooks showing
up in a session.

Config written (Observed in `~/.codex/config.toml`):

```toml
[marketplaces.claude-toolkit]
source_type = "local"
source = "/Users/michaelrihm/Documents/Projects/claude-toolkit"

[plugins."session-skills@claude-toolkit"]
enabled = true
```

Per-project control: `.codex/config.toml` in a trusted project can set
`[plugins."<plugin>@<marketplace>"] enabled = true|false`, and marketplaces can
be defined in "trusted-project config.toml" (CX:`config-file/config-reference`,
`marketplaces.<name>.source_type`, `plugins.<plugin>.enabled`).

Install location: docs say `~/.codex/plugins/cache/$MARKETPLACE/$PLUGIN/$VERSION/`
with `$VERSION` = `local` for local plugins, and the host "loads the installed
copy from that cache path rather than directly from the marketplace entry"
(CXP:`build/plugins`#How local marketplaces work). Observed on this Mac: the
folders are named by manifest version, e.g.
`~/.codex/plugins/cache/claude-toolkit/session-skills/1.14.1/`, not `local`.
Either way, Codex runs a copy, so a changed plugin needs a reinstall (and
probably a version bump) before Codex sees it. The docs' instruction for the
desktop app is to update the plugin and "restart the ChatGPT desktop app".

### 3.5 Codex custom agents (subagents)

Source: CX:`agent-configuration/subagents`#Custom agents;
CX:`config-file/config-reference` (`agents.*`).

- Built-in agents: `default`, `worker`, `explorer`.
- Custom agents are TOML files, one per agent, in `~/.codex/agents/` or project
  `.codex/agents/`. Required keys: `name`, `description`,
  `developer_instructions`. Any other `config.toml` key may be added (`model`,
  `model_reasoning_effort`, `sandbox_mode`, `mcp_servers`, `skills.config`).
  The `name` field, not the file name, identifies the agent.
- Plugins cannot ship agents to Codex (Part 3.4). Claude plugin agents
  (`agents/*.md`) are Claude-only.
- Global settings under `[agents]`: `enabled`,
  `max_concurrent_threads_per_session`, `default_subagent_model`,
  `default_subagent_reasoning_effort`, `interrupt_message`.

### 3.6 Codex has no output styles

Codex documents no output-style mechanism. The nearest levers are `AGENTS.md`
(project or `~/.codex/AGENTS.md`), `developer_instructions`, and a
`personality` key (`none`, `friendly`, `pragmatic`) for models that support it
(CX:`config-file/config-reference`). OpenAI's guidance for global files: "Use
the global file to shape how Codex communicates with you (for example, review
style, verbosity, and defaults), and keep repo files focused on team and
codebase rules" (CX:`customization/overview`#AGENTS Guidance).

---

## Part 4. Cross-host portability: the rules that keep one package working in both

| Topic | Claude Code | Codex | Portable choice |
| --- | --- | --- | --- |
| Instruction file | `AGENTS.md` natively (2.1.277+), only with no `CLAUDE.md`; lazy subdirectory loading; `@imports` expanded | `AGENTS.md` root → cwd at start; 32 KiB total; no imports; no lazy loading | Root `AGENTS.md` only, small, no `@imports`, explicit "read this file when ..." pointers. No `CLAUDE.md` anywhere. |
| Scoped rules | `.claude/rules/` with `paths:` | Not read | Keep rules in `.claude/rules/`; root `AGENTS.md` names the rules Codex must open for each area. Decide per rule whether Codex needs it. |
| Skills folder (project) | `.claude/skills/` | `.agents/skills/` | Ship skills in plugins; for project-local skills, one real folder plus a symlink, or both copies. |
| Skill frontmatter | Many fields | `name`, `description` required | Always set `name` = folder name; description ≤1,024 chars with triggers inside it; Claude-only fields are fine but must not be relied on in Codex. |
| Manual-only skill | `disable-model-invocation: true` | `agents/openai.yaml` `policy.allow_implicit_invocation: false` | Ship both. |
| Paths inside a skill | `${CLAUDE_SKILL_DIR}`, `${CLAUDE_PLUGIN_ROOT}` substituted | Not substituted; the listing gives Codex the skill's file path | Refer to bundled files by path relative to the skill folder ("`scripts/x.mjs` in this skill's folder"). |
| Dynamic context `` !`cmd` `` | Runs before the model sees the skill | Literal text | Don't use in shared skills. |
| Plugin manifest | `.claude-plugin/plugin.json` | root Agent Plugins `plugin.json` > `.codex-plugin/plugin.json` > `.claude-plugin/plugin.json` | Both `.claude-plugin/` and `.codex-plugin/`; same `name` and `version`. |
| Marketplace | `.claude-plugin/marketplace.json` | `.agents/plugins/marketplace.json` first | Both files at the repo root. |
| Plugin hooks file | `hooks/hooks.json`, or `hooks` in manifest | `hooks/hooks.json` unless the Codex manifest sets `hooks` | Claude: `hooks/hooks.json`. Codex: separate file named in `.codex-plugin/plugin.json`. Same scripts. |
| Handler form | Exec form (`args`) recommended | No `args`; shell only | Codex file: shell form with quoted `${CLAUDE_PLUGIN_ROOT}` or `${PLUGIN_ROOT}`. |
| Hooks file top level | `description`, `$schema` allowed | Only `description`, `hooks` | Never put `$schema` in a file Codex reads. |
| Project root in scripts | `CLAUDE_PROJECT_DIR` | None documented | Read `cwd` from stdin JSON, then `git rev-parse --show-toplevel`. |
| Matchers | Exact names unless special characters | Always regex | Use `^Name$` or `^(A\|B)$`. |
| File-edit tool names | `Write`, `Edit` with `tool_input.file_path` | `apply_patch` (matcher alias `Edit`/`Write`), patch text in `tool_input.command` | Parse both shapes; or compare `git status` instead of parsing tool input. |
| SessionStart matchers | `startup`, `resume`, `clear`, `compact`, `fork` | `startup`, `resume`, `clear`, `compact` | `startup\|resume\|clear\|compact` (add `\|fork` for Claude). |
| Context injection | Plain stdout or `additionalContext`; 10,000 chars per string | Plain stdout or `additionalContext`; ~2,500 tokens default | JSON `hookSpecificOutput.additionalContext`, well under 2,500 tokens; factual wording. |
| Stop / SubagentStop output | Plain stdout ignored | Plain stdout invalid | Print nothing or one JSON object. |
| Blocking | Exit 2 + stderr, or JSON decisions | Exit 2 + stderr, or JSON decisions | Exit 2 + stderr is the common path; PreToolUse JSON `deny` also works in both. |
| PreToolUse `ask` | Supported | Hook fails, tool proceeds | Never return `ask`, `continue`, `stopReason`, `suppressOutput` from PreToolUse. |
| Stop loop guard | `stop_hook_active`; cap of 8 blocks | `stop_hook_active` | Always exit 0 when `stop_hook_active` is true. |
| Hook trust | Workspace trust for settings hooks; plugin hooks run once enabled | Every non-managed hook needs `/hooks` trust by hash | Tell Mike to trust hooks once in Codex; re-trust after editing a hook file. |
| Files changed outside the agent | `FileChanged` (literal names, `watchPaths`) | No equivalent event | Detect moves at `SessionStart` and `UserPromptSubmit` by scanning disk (e.g. compare `.work-items/` against its index or `git status`). |
| Output style | Plugin or project `output-styles/`, `outputStyle` | None | Style file for Claude; same voice rules in `AGENTS.md` for Codex. |
| Subagents | `agents/*.md` (plugin or `.claude/agents/`) | `.codex/agents/*.toml`, not in plugins | Plugin agents for Claude; project init writes Codex TOML agents if needed. |
| Per-project plugin enablement | `.claude/settings.json` `enabledPlugins` (+ `extraKnownMarketplaces`) | `.codex/config.toml` `[plugins."p@m"] enabled` (+ `[marketplaces.m]`) | Write both at init; both need the project trusted. |

A minimal hook script pattern that works in both hosts (derived from the input
and output rules above; not copied from either doc):

```js
// read JSON from stdin; never crash the session
let raw = ''; for await (const c of process.stdin) raw += c;
const input = raw.trim() ? JSON.parse(raw) : {};
const cwd = input.cwd || process.cwd();
// project root: git top-level of cwd (CLAUDE_PROJECT_DIR exists only in Claude)
// ... compute a short factual message ...
process.stdout.write(JSON.stringify({
  hookSpecificOutput: { hookEventName: input.hook_event_name, additionalContext: message }
}));
// exit 0; on internal error print nothing and exit 0
```

---

## Part 5. How the current `claude-toolkit` registers for both hosts (Observed)

Paths under `/Users/michaelrihm/Documents/Projects/claude-toolkit/`.

- `.claude-plugin/marketplace.json`: `name: "claude-toolkit"`, `owner` {`name`,
  `email`}, `metadata` {`description`, `version: "0.131.2"`}, nine plugin
  entries with `name`, `source: "./plugins/<name>"`, `description`.
- `.agents/plugins/marketplace.json`: `name: "claude-toolkit"`, `interface`
  {`displayName: "Claude Toolkit"`}, seven plugin entries, each
  `{"name", "source": {"source": "local", "path": "./plugins/<name>"},
  "policy": {"installation": "AVAILABLE", "authentication": "ON_INSTALL"},
  "category": "Productivity"|"Developer Tools"}`. `protocol-guard` is left out
  because it uses Claude Code function hooks (`plugins/AGENTS.md`);
  `hooks-library` is also not listed.
- Each plugin has `.claude-plugin/plugin.json` (`name`, `description`,
  `version`, `author`) and, except `protocol-guard`,
  `.codex-plugin/plugin.json`. The Codex manifests for `session-skills`,
  `second-brain`, `system-guide` add `homepage`, `repository`, `keywords`,
  `"skills": "./skills/"`, and a full `interface` block. `hooks-library`'s Codex
  manifest has only `name`, `description`, `version`, `author`.
- Versions are bumped in three places for every content change: both
  manifests and `metadata.version` in `.claude-plugin/marketplace.json`
  (`plugins/AGENTS.md`, "Bump versions").
- `plugins/system-guide/hooks/hooks.json` uses exec form
  (`"command": "node", "args": ["${CLAUDE_PLUGIN_ROOT}/hooks/system-guide-session-start.mjs"]`,
  matcher `startup|resume|clear|compact|fork`). `system-guide` is registered for
  Codex and its Codex manifest sets no `hooks`, so Codex would load this same
  file by default, with `args` ignored. This is the trap in Part 0 item 3; it
  was not tested here.
- Project-level Codex hooks live in the repo's `.codex/hooks.json`: shell-form
  commands that resolve the repo root with `$(git rev-parse --show-toplevel)`,
  plus `commandWindows`, `timeout: 10`, `additionalContextLimit` (1000 and
  5000), and `statusMessage`, for `SessionStart`, `UserPromptSubmit`,
  `PreToolUse` (`^Bash$`), and `Stop`.
- The model project's `.codex/hooks.json` uses a relative path
  (`node ".claude/hooks/toolkit-session-start.mjs"`), which Codex's docs advise
  against because Codex may start in a subdirectory.
- On this Mac, `codex plugin marketplace list` shows `claude-toolkit` rooted at
  `/Users/michaelrihm/Documents/Projects/claude-toolkit`, and six toolkit
  plugins are enabled in `~/.codex/config.toml`.
- `claude plugin validate .` passes in `claude-toolkit`.

---

## Part 6. Open questions

These were not settled by the documentation or by what could be checked
read-only. Each needs a small experiment during the build.

1. **Native `AGENTS.md` gap in Claude Code.** In the first session after an
   upgrade, with hooks disabled, or on a third-party provider, Claude reads no
   `AGENTS.md`. The documented fix (a `CLAUDE.md` with `@AGENTS.md`) conflicts
   with the "no `CLAUDE.md`" decision. Should the toolkit add a `SessionStart`
   hook that detects the gap? It cannot reliably tell whether `AGENTS.md` was
   loaded, because `InstructionsLoaded` does not fire for natively read
   `AGENTS.md`. Mike may need to accept this gap.
2. **Plugin output style name.** Does `"outputStyle"` select a plugin style by
   its plain `name` ("Plain English") or by a namespaced form? Is
   `force-for-plugin: true` the better choice, given that it overrides any
   personal choice?
3. **Codex and Claude-only hook events.** Confirm that a Codex hooks file
   containing Claude-only events is ignored rather than rejected (the source
   suggests ignored). Recommended design avoids the question by using separate
   files.
4. **Codex plugin refresh.** After editing a local plugin, which command makes
   Codex pick up the change: `codex plugin add` again, a version bump, or
   `codex plugin remove` then `add`? The docs describe `$VERSION = local` but the
   cache on this Mac uses the manifest version.
5. **Codex plugin skill invocation name.** Confirm how a plugin skill appears in
   the Codex CLI (`$skill`, `$plugin:skill`) and whether Codex requires the
   frontmatter `name` to equal the folder name.
6. **Codex handling of Claude-only skill frontmatter.** Confirm Codex ignores
   fields like `disable-model-invocation`, `argument-hint`, `when_to_use`
   instead of warning or failing.
7. **Project-scoped marketplace in Claude.** Does a project's
   `extraKnownMarketplaces` with a `directory` source plus `enabledPlugins`
   install the plugin automatically after trust, or must each machine run
   `claude plugin install`? (The docs say external sources are not
   auto-installed; a local directory source was not tested.)
8. **Codex project marketplace declaration.** Confirm that `[marketplaces.x]` in
   a trusted project's `.codex/config.toml` works with `source_type = "local"`
   and a relative or absolute path.
9. **Hook trust during sample runs.** Codex needs `/hooks` trust per hook
   definition. Is running `codex exec --dangerously-bypass-hook-trust` in
   automated tests acceptable, with one real interactive trust by Mike for the
   "seen running in a real Codex session" proof?
10. **Root `plugin.json` (Agent Plugins format).** OpenAI now recommends it.
    Adopting it would change Codex's manifest choice and move MCP config to
    `mcp.json`. The brief recommends staying with `.codex-plugin/plugin.json`
    for V2; the architect should confirm.
