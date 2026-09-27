# How init, sync, and doctor install the scaffold

How `toolkit init`, `toolkit sync`, and `toolkit doctor` turn the model
project into a project's files. `lib/project/model-scaffold.mjs` builds the
install list; `lib/project/manifest.mjs` plans and writes it.

## Where the files come from

- `scaffold/model/` is an exact copy of Mike's model project. It holds every
  folder, file name, template, instruction, rule, `AGENTS.md`, `CLAUDE.md`,
  project hook, and project skill a new project gets. Nobody edits it by hand:
  `node dev/tools/import-model.mjs` copies it from the model again (see
  "Updating the copy").
- `scaffold/model/.import.json` records where the copy came from: `source`,
  `branch`, `commit`, `dirty` (the model had uncommitted changes), and
  `importedAt`. It is never installed.
- `scaffold/CONDITIONS.json` is the only hand-kept file beside the copy. It
  says which model paths install only under a condition, which model files a
  toolkit command keeps current, which text init fills, and which Salesforce
  entries and lines a project that is not a Salesforce project leaves out.
  Every time init, sync, or doctor plans the install, it checks that each of
  these rules still matches a file in the copy. A rule that matches nothing
  means the plugin copy lost files (for example the `.memory/` templates), so
  the command stops with "The toolkit plugin's model copy is incomplete"
  before it writes anything.
- `templates/` holds only what the model does not: the toolkit's own settings
  entries, the Codex plugin switches and command rule, the toolkit's
  `.gitignore` lines, the Hindsight service file, and this document.

The runtime reads the model's templates (`WORK-ITEM.md`, `DESIGN.md`, the
`.memory/` files, `DECISIONS.md`) from `scaffold/model/` through
`lib/core/templates.mjs`, never from a second copy.

## What installs

Every file in `scaffold/model/` installs at the same path, byte for byte,
unless a rule below changes it. A new file gets the model file's executable
bits. A model file that is not UTF-8 text (an image, for example) is copied as
bytes and hashed as bytes; it cannot have markers, a fill, or a removal rule,
and init stops with the file's name if one names it. After the model's files
come the toolkit's additions:

| Source | Target | Installs for | Mode |
| --- | --- | --- | --- |
| `templates/settings/claude-toolkit.json` | `.claude/settings.json` | Claude Code | `merge-json`, after the model's file |
| `templates/codex/config-base.toml` | `.codex/config.toml` | Codex | `merge-toml` |
| `templates/codex/toolkit.rules` | `.codex/rules/toolkit.rules` | Codex | `copy` |
| `templates/gitignore/toolkit.gitignore` | `.gitignore` | both hosts | `append`, after the model's file |

Targets under `.work-items/` and `.memory/` are written in the main checkout
(the folder that holds `git rev-parse --git-common-dir`), because both folders
are Git-ignored and shared by every worktree. Every other target is relative
to the project root (`git rev-parse --show-toplevel`).

## Conditions (`only`)

Each `only` rule names a condition and a list of path patterns. A model path
installs only when every condition whose patterns match it holds.

| Condition | Holds when |
| --- | --- |
| `tracker:local` | `tracker.type` is `local` |
| `memory:builtin` | `memory.type` is `builtin` |
| `salesforce` | `salesforce.enabled` is true |
| `host:claude-code` | `.toolkit.json` `hosts` lists `claude-code` |
| `host:codex` | `hosts` lists `codex` |

A pattern uses `/` between folders. `**` matches any number of whole folders
(none included), `*` any text inside one name, and `?` one character.

`hosts` is a list, such as `["claude-code"]`. A comma-separated string written
by hand, such as `"claude-code,codex"`, is read the same way, and init saves
it as a list. `claude` is read as `claude-code`. A missing `hosts` means both.
A `hosts` value that cannot be read (another type, an unknown name, or no name
at all) is never taken as both: init, sync, and `toolkit config set` of
another setup key stop and change nothing, and doctor reports it with the fix
(`toolkit config set hosts claude-code`, or `codex`, or `claude-code,codex`).

Only Claude Code reads `CLAUDE.md`, `.claude/settings.json`,
`.claude/output-styles/`, and `.claude/skills/`. Only Codex reads `.codex/`
and `.agents/skills/`. Both hosts get `.claude/rules/` (Codex reads the rules
through `AGENTS.md`), `.claude/hooks/`, and `.claude/protected-orgs.json` (the
Codex hooks run the same guard scripts).

## Setup markers

A model file with a marker line is rendered for the project. A marker line is
a line whose text, with leading and trailing spaces removed, is exactly one of
these:

| Opening marker | The block is kept when |
| --- | --- |
| `<!-- if salesforce -->` | `salesforce.enabled` is true |
| `<!-- if not salesforce -->` | `salesforce.enabled` is false |
| `<!-- if tracker=local -->`, `tracker=notion`, `tracker=github`, `tracker=jira` | `tracker.type` is that value |
| `<!-- if memory=builtin -->`, `memory=hindsight`, `memory=notion` | `memory.type` is that value |

The closing marker is always `<!-- endif -->`.

- Marker lines are always removed, whether the block is kept or not.
- Nothing else changes: every other line, blank line, and line ending stays
  as the model has it. `{{...}}` text in a model file is ordinary text.
- Blocks do not nest. An opening marker inside an open block, an `endif` with
  no open block, a block still open at the end of the file, or an unknown
  condition is an error: init stops before it writes anything and names the
  file and line.
- Any other HTML comment (for example a fill-in guide) is ordinary text.

## The project name (`fill`)

A `fill` rule replaces a text with a setting in the files it names. The one
rule today replaces `<Project name>` with `project.name` on heading lines
(lines that start with one to six `#` and a space) of `AGENTS.md`,
`README.md`, and `PROJECT.md`. The fill-in guide comments that name
`<Project name>` as text keep it. Every other angle-bracket prompt stays for
the agent to fill.

## Salesforce removals (`jsonRemove`, `lineRemove`)

In a project that is not a Salesforce project:

- `jsonRemove` takes entries out of a model JSON file before it is merged:
  every hook handler whose command or arguments contain one of the
  `hookCommandContains` texts (a matcher group with no handler left, and an
  event with no group left, go too), and the listed values from the listed
  arrays (for example `permissions.deny`). With
  `skipFileWhenNoHooksLeft`, a file with no hooks left is not installed at
  all: `.codex/hooks.json` holds only the two Salesforce guards.
- `lineRemove` takes the listed lines out of a model file (compared without
  trailing spaces): the Salesforce CLI and `tools/kb/` lines of `.gitignore`.

A Salesforce project gets the model's files with these entries in.

When Salesforce is turned off later, sync applies the same removals to the
project's `.claude/settings.json` and `.gitignore` when the project has not
changed them (see "Sync"), so no hook is left that runs a Salesforce script the
owner may delete. `.codex/hooks.json` holds only the Salesforce guards, so it
is left over as a whole.

## Generated files (`generated`)

`.memory/MEMORY.md` (kept by `toolkit memory reindex`) and
`ai-external-knowledge/INDEX.md` (whose table rows `toolkit index knowledge`
builds from each topic's `SOURCE-RECORD.md`) install from the model when they
are missing. They are never recorded in `installed`, never listed as changed
by the project, and never replaced by sync. Init runs `toolkit work sync`
(which writes `.work-items/DASHBOARD.md` and `.work-items/.toolkit-state.json`)
and `toolkit memory reindex` as its last steps before it writes
`.toolkit.json`.

## The rules list in AGENTS.md

`AGENTS.md` holds one generated span:

```text
<!-- toolkit:rules:start -->
...
<!-- toolkit:rules:end -->
```

The two marker lines stay in the installed file. Init writes the span after
every rule file is installed; `toolkit sync` rebuilds it every time it runs,
and `toolkit doctor` rebuilds it in memory and reports a difference. Only the
lines between the markers are replaced. Nobody edits between the markers.

The span is built from every `*.md` file in the project's `.claude/rules/`,
sorted by file name in plain character order:

- A rule whose frontmatter has a `paths` list is path-scoped. Any other rule is
  always on.
- The one-line purpose is the text of the rule's first `# ` heading.

Exact output, with `\n` line endings:

```text
<!-- toolkit:rules:start -->
Always on. Claude Code loads these at session start. Codex: read each one at session start.
- `.claude/rules/humanize-outbound-text.md`: Humanize Anything Sent to Another Person
- `.claude/rules/keep-work-item-current.md`: Keep the Active Work Item Accurate

Path-scoped. Claude Code loads each one when it reads a matching file. Codex: open the rule before working on a matching path.

| Paths | Rule |
| --- | --- |
| `ai-external-knowledge/**` | `.claude/rules/ai-external-knowledge.md` |
<!-- toolkit:rules:end -->
```

- In the table, each glob is wrapped in backticks and the globs are joined by
  `, ` in the order the rule lists them.
- With no path-scoped rules, the second paragraph and the table are left out.
- With no always-on rules, the first paragraph and its list are left out.
- A Salesforce project with the model's rules gets exactly the model's list.
- The `installed` hash of `AGENTS.md` (see "Sync") is computed over the file
  with the lines between the two markers removed; the marker lines stay in.
  A span rebuild therefore never makes `AGENTS.md` look changed by the owner,
  and an owner edit anywhere else still does.

## Install modes

`.toolkit.json` `installed` maps each target path to the SHA-256 of the
content the toolkit wrote there. A target the toolkit did not write, and a
generated file, has no entry.

| Mode | Used for | Target missing | Target already there at init |
| --- | --- | --- | --- |
| `copy` | every other model file; `.codex/rules/toolkit.rules` | Write the file. | Keep the project's file and report "kept the project's file". No `installed` entry is recorded, so sync never replaces it. |
| `agents-md` | `AGENTS.md` | Write the rendered file, then fill the span. | See below. |
| `append` | `.gitignore` | Write the model's file, then the toolkit's lines after one blank line. | Add each non-blank source line the target does not already have, after one blank line at the end of the file. Only non-blank lines are compared. |
| `merge-json` | `.claude/settings.json`, `.codex/hooks.json` | Write the model's file as it is, then merge the toolkit's entries. | Deep-merge the model's JSON, then the toolkit's, into the target. Objects merge key by key. Arrays are joined, keeping order and dropping exact duplicates. For any other value, the source wins. Keys the sources do not name are never touched. |
| `merge-toml` | `.codex/config.toml` | Write the rendered source. | See below. |
| `seed` | the generated files | Write the model's file. | Keep it. |

### The toolkit's settings

The model's `.claude/settings.json` is the base. The toolkit adds only its
own entries: `autoMemoryEnabled: false`, `worktree.baseRef: "head"`,
`permissions.allow: ["Bash(toolkit *)"]`, and `enabledPlugins` with every
Toolkit V2 plugin on (`sf-architect-solutioning@toolkit-v2` only in a
Salesforce project) and every `claude-toolkit` plugin off, including any other
`claude-toolkit` plugin this computer has in `~/.claude/settings.json` or
`~/.claude/plugins/installed_plugins.json`. When the model names no
`outputStyle`, the toolkit sets `"Plain English"`. `.codex/config.toml` gets
the same plugin switches for Codex, plus any `claude-toolkit` plugin in
`~/.codex/config.toml`.

### `agents-md`

- Target missing: write the rendered model file and fill the span.
- Target has both span markers: it is already a Toolkit V2 `AGENTS.md`. Keep
  it, rebuild the span, and record it as described below when it has no
  `installed` entry.
- Target has no span markers (an existing repository being adopted): keep
  `AGENTS.md` unchanged. Write the rendered Toolkit V2 version, with its span
  filled, to `.toolkit-cache/AGENTS.proposed.md`, and report "kept the
  project's AGENTS.md; the Toolkit V2 version is in
  .toolkit-cache/AGENTS.proposed.md". The `project-setup` skill shows the
  owner the difference and, after his yes, merges the V2 sections and the two
  span markers into `AGENTS.md`, then runs `toolkit sync`, which fills the span
  and records the `installed` hash.
- The hash recorded is that of the toolkit's own rendered `AGENTS.md` (without
  the span), not of the merged file. When the merged file is exactly the
  toolkit's version, it counts as unchanged from then on, so a later sync or
  setup change renders it again. When it also keeps the project's own text, it
  counts as changed by the project, so sync rebuilds only the span and never
  replaces that text.
- Until `AGENTS.md` has both markers, `toolkit doctor` reports "AGENTS.md has
  no Toolkit V2 sections" with that fix, and the session briefing shows it as a
  setup warning.

### `merge-toml` (only `.codex/config.toml`)

The source holds only comment lines, blank lines, `[table]` headers, and
`key = value` lines, and may use setup markers.

- Target missing: write the rendered source.
- Target present: for each table in the source, compare headers with spaces
  removed.
  - The target has no such table: add the table, with the comment lines directly
    above it in the source, at the end of the file, after one blank line.
  - The target has the table: for each source key, replace the value when the
    target's table has that key; otherwise add the `key = value` line after the
    table's last key line.
  - The comment lines at the top of the source are written only when the file
    is created.
- The target defines one of the source's keys another way (a dotted key such
  as `plugins."toolkit@toolkit-v2".enabled = true`, or an inline table): leave
  the file unchanged and report the conflict. Doctor reports it until it is
  fixed.

## Sync

`toolkit sync` plans the install again with the current `.toolkit.json`
values. It never deletes a file, and it never writes a file the project
changed.

- A target is **unchanged** when its current SHA-256 equals its `installed`
  entry (for `AGENTS.md`, hashed without the span lines). It is **changed by
  the project** when the hashes differ or there is no `installed` entry.
- Several entries with one target (the model's and the toolkit's settings,
  the model's and the toolkit's `.gitignore` lines) are judged once, before the
  first of them runs.
- A missing target whose conditions hold is installed as at init.
- An unchanged target is rebuilt from the current sources and values. When the
  result differs, sync writes it and records the new hash. A `copy` or
  `agents-md` target is rendered again from the model. An `append` or
  `merge-json` target is rebuilt from the file as it is, because a merge only
  adds: first the `lineRemove` and `jsonRemove` rules that apply to the current
  setup take their lines and entries out of it, then the sources are merged in.
  For example, after `toolkit config set salesforce.enabled false`, the
  Salesforce hooks and `sf` permission rules leave `.claude/settings.json` and
  the Salesforce lines leave `.gitignore`.
- A changed target is left alone. `toolkit sync --dry-run` and `toolkit
  doctor` list it as "changed by the project". For `append`, `merge-json`, and
  `merge-toml` targets they also list the lines, keys, or tables the toolkit
  would add, change, or remove. The `project-setup` skill shows that list to
  the owner and makes the changes he approves.
- `toolkit doctor` (and the session briefing) reports a problem for every hook
  in `.claude/settings.json` or `.codex/hooks.json` that runs a project script
  that does not exist, such as a Salesforce guard the owner deleted while the
  settings file, changed by the project, still registers it.
- The `AGENTS.md` span is rebuilt on every sync when both markers are present,
  whether or not the rest of the file was changed.
- A target whose condition no longer holds (for example
  `.claude/rules/work-item-folders.md` after the tracker changed from `local`)
  is not deleted. Doctor lists it as "left over from an earlier setup"; the
  owner decides.

## Setup changes

`toolkit config set` on a key that a marker, a fill, a condition, or a host
reads (`project.name`, `tracker.type`, `memory.type`, `salesforce.enabled`,
`hosts`, and the other keys in `SETUP_KEYS`) saves the value, then runs
`toolkit sync` and prints its report. Examples:

- `toolkit config set project.name "Acme Portal"` renders the headings of
  `AGENTS.md`, `README.md`, and `PROJECT.md` again.
- `toolkit config set memory.type builtin` adds the model's `.memory/` files
  and renders `AGENTS.md`, `README.md`, and `PROJECT.md` again with the
  built-in memory blocks.
- `toolkit config set tracker.idPrefix ACME` changes no file: the model's
  files name the prefix as `tracker.idPrefix` in `.toolkit.json`.
- A file the project already changed keeps the old text. The sync report
  names it and the setting it does not reflect, for example "AGENTS.md was
  changed by the project, so it still describes memory.type hindsight. Update
  it by hand."

## State and lock files

Toolkit commands keep these files for their own use. Nobody edits them.

- `.work-items/.toolkit-state.json`: the ID-to-path map and the highest ID
  used, so IDs are never reused. `toolkit export` includes it.
- `.memory/.toolkit-meta.json`: built-in memory's own record, such as the last
  export time.
- Lock files, held only while a command runs: `.work-items/.lock`,
  `.memory/.lock`, and `.toolkit-decisions.lock` at the project root. The toolkit
  lists `/.toolkit-decisions.lock` and `/.toolkit-cache/` in `.gitignore`.

## Updating the copy

When Mike changes the model:

1. `node dev/tools/import-model.mjs` (or `--from <model folder>`). It stops
   and copies nothing when a `CONDITIONS.json` rule no longer matches the
   model; fix the rule, then run it again. It leaves out `.git`, every
   `.sfdx/`, `.vscode/`, and `__pycache__/` folder and `.DS_Store` file at any
   depth, the `exclude` patterns, and every file the model's Git ignores and
   does not track (it names them). To ship such a file on purpose, track it in
   the model's Git with `git add -f`, as the model does for its `.memory/` and
   `.work-items/` templates, and import again.
2. `node dev/tools/import-model.mjs --check` confirms the copy matches. It
   also fails while a copied file is hidden from this repository's Git.
3. The model's `.gitignore`, copied to `scaffold/model/.gitignore`, hides
   `scaffold/model/.memory/` and `scaffold/model/.work-items/` from this
   repository's Git, so a plain `git add` skips them and a clean clone would
   install projects without the work item and memory templates. Stage each
   new file there by name with `git add -f`; the import and `--check` print
   the exact command.
4. Run the tests: `tests/scaffold/parity.test.mjs` shows that every setup
   still matches the model apart from the rules above.
