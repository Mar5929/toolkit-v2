# Template language

How `toolkit init`, `toolkit sync`, and `toolkit doctor` turn the files in
`scaffold/` and `templates/` into a project's files. `scaffold/MANIFEST.json`
lists every file with its target path, condition, host, install mode, and
whether it is a template. Only a file with `"template": true` is processed as
described in "Tokens", "Conditional blocks", and "Order of processing"; every
other file is copied byte for byte.

## Tokens

A token is replaced everywhere it appears in a template file.

| Token | Value | Example |
| --- | --- | --- |
| `{{project.name}}` | `.toolkit.json` `project.name` | `Acme CRM` |
| `{{project.key}}` | `project.key` | `acme-crm` |
| `{{project.owner}}` | `project.owner` | `Mike` |
| `{{tracker.type}}` | `tracker.type` | `local`, `notion`, `github`, `jira` |
| `{{tracker.idPrefix}}` | `tracker.idPrefix` | `WI` |
| `{{memory.type}}` | `memory.type` | `builtin`, `hindsight`, `notion` |
| `{{today}}` | The local date of the render | `2026-09-26` |

- A token is exactly two opening braces, the name, and two closing braces, with
  no spaces inside.
- Values are inserted as plain text. Nothing is escaped.
- Any other `{{...}}` text in a template file is an error: init stops before
  writing anything and names the file and the token.
- `tracker.idPrefix` is `WI` at init. When the owner wants another prefix,
  `project-setup` runs `toolkit config set tracker.idPrefix <prefix>` right
  after init, and that renders the files that use the token again (see
  "Setup changes").
- `{{today}}` is the date of the render. A later render, by sync or a setup
  change, uses the date of that render.

`{{HOME}}` is not an init token. It appears only in
`templates/hindsight/local.toolkit-v2.hindsight.plist.tmpl`, which is filled by
`toolkit hindsight service install` with the absolute home folder (launchd does
not expand `~`). That file is never installed into a project.

## Conditional blocks

A block is kept or removed as a whole. Markers sit on their own lines:

```text
<!-- if salesforce -->
Lines kept only in a Salesforce project.
<!-- endif -->
```

| Opening marker | Kept when |
| --- | --- |
| `<!-- if salesforce -->` | `salesforce.enabled` is true |
| `<!-- if not salesforce -->` | `salesforce.enabled` is false |
| `<!-- if tracker=local -->` | `tracker.type` is `local` |
| `<!-- if tracker=notion -->` | `tracker.type` is `notion` |
| `<!-- if tracker=github -->` | `tracker.type` is `github` |
| `<!-- if tracker=jira -->` | `tracker.type` is `jira` |
| `<!-- if memory=builtin -->` | `memory.type` is `builtin` |
| `<!-- if memory=hindsight -->` | `memory.type` is `hindsight` |
| `<!-- if memory=notion -->` | `memory.type` is `notion` |

The closing marker is always `<!-- endif -->`.

- A marker line is a line whose text, with leading and trailing spaces removed,
  is exactly one of the markers above. Marker lines are always removed from the
  output, whether the block is kept or not.
- Blocks do not nest. An opening marker inside an open block, an `endif` with
  no open block, a block still open at the end of the file, or an unknown
  condition is an error: init stops and names the file and line.
- Any other HTML comment (for example the guidance comments in `DESIGN.md`) is
  ordinary text and is left alone.
- Markers work in any text file, not only Markdown. `templates/codex/config-base.toml`
  uses them, and so does the YAML frontmatter of
  `.claude/rules/knowledge-direct-commit.md`. The output is valid TOML or YAML
  once the marker lines are gone.

## Order of processing

For each template file:

1. Split into lines (`\n`; a `\r\n` file keeps its line endings).
2. Resolve conditional blocks and drop the marker lines.
3. Replace tokens.
4. Collapse every run of two or more blank lines into one blank line, and end
   the file with exactly one newline. This keeps Markdown tidy where a removed
   block sat between two blank lines. A blank line is a line that is empty or
   holds only spaces or tabs.

## Generated span in AGENTS.md

`AGENTS.md` holds one generated span:

```text
<!-- toolkit:rules:start -->
...
<!-- toolkit:rules:end -->
```

The two marker lines stay in the installed file. Init writes the span after
every rule file is installed; `toolkit sync` rebuilds it every time it runs,
and `toolkit doctor` rebuilds it in memory and reports a difference. Only the
lines between the markers are replaced; the rest of `AGENTS.md` is never
rewritten by the span update. Nobody edits between the markers: every rebuild
replaces those lines.

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
- `.claude/rules/offer-context-handoff.md`: Offer a Handoff Before Heavy Work in a Long Session

Path-scoped. Claude Code loads each one when it reads a matching file. Codex: open the rule before working on a matching path.

| Paths | Rule |
| --- | --- |
| `ai-external-knowledge/**` | `.claude/rules/ai-external-knowledge.md` |
| `requirements/**`, `PROJECT-ROADMAP.md`, `PROJECT.md` | `.claude/rules/knowledge-direct-commit.md` |
<!-- toolkit:rules:end -->
```

- In the table, each glob is wrapped in backticks and the globs are joined by
  `, ` in the order the rule lists them.
- With no path-scoped rules, the second paragraph and the table are left out.
- With no always-on rules, the first paragraph and its list are left out.
- The `installed` hash of `AGENTS.md` (see "Sync") is computed over the file
  with the lines between the two markers removed; the marker lines stay in.
  A span rebuild therefore never makes `AGENTS.md` look changed by the owner,
  and an owner edit anywhere else still does.

## Where files go

- A target path is relative to the project root (`git rev-parse --show-toplevel`).
- Targets under `.work-items/` and `.memory/` are written in the main checkout
  (the folder that holds `git rev-parse --git-common-dir`), because both
  folders are Git-ignored and shared by every worktree.

## Conditions and hosts

Each `files` entry has a `condition`:

| Condition | The entry installs when |
| --- | --- |
| `always` | Every project |
| `salesforce` | `salesforce.enabled` is true |
| `tracker:local` | `tracker.type` is `local` |
| `memory:builtin` | `memory.type` is `builtin` |
| `memory:hindsight`, `memory:notion` | Used only in `runtime` entries |

An entry may also have a `host`: `claude-code` or `codex`. Such an entry
installs only when `.toolkit.json` `hosts` lists that host (init `--hosts`;
both by default). An entry with no `host` installs for every host. The
condition and the host must both hold.

- `claude-code` only: `.claude/settings.json`, `.claude/output-styles/`, and
  `.claude/skills/`.
- `codex` only: `.codex/` and `.agents/skills/`.
- Both hosts: everything else, including `.claude/rules/` (Codex reads the rules
  through `AGENTS.md`), the Salesforce guard scripts in `.claude/hooks/`, and
  `.claude/protected-orgs.json` (the Codex hooks run the same guard scripts).

## Install modes

Each entry has a `mode`. Entries run in `MANIFEST.json` order, so
`scaffold/base/` files come before the Salesforce overlay, and
`templates/settings/claude-base.json` merges before `claude-salesforce.json`.

`.toolkit.json` `installed` maps each target path to the SHA-256 of the
content the toolkit wrote there (for a template, the rendered text; for a
merge, the merged file). A target the toolkit did not write has no entry.

| Mode | Target missing | Target already there at init |
| --- | --- | --- |
| `copy` | Write the file. | Keep the project's file and report "kept the project's file". No `installed` entry is recorded, so sync never replaces it. |
| `agents-md` | Write the rendered template, then fill the span. | See below. |
| `append` | Write the source. | Add each non-blank source line the target does not already have, after one blank line at the end of the file. Blank lines are always kept; only non-blank lines are compared. When every non-blank line is already there, the file is not changed. |
| `merge-json` | Create `{}`, then merge. | Deep-merge the source JSON object into the target. Objects merge key by key. Arrays are joined, keeping order and dropping exact duplicates. For any other value, the source wins. Keys the source does not name are never touched. |
| `merge-toml` | Write the rendered source. | See below. |

### `agents-md` (only `AGENTS.md`)

- Target missing: write the rendered template and fill the span.
- Target has both span markers: it is already a Toolkit V2 `AGENTS.md`. Keep
  it and rebuild the span.
- Target has no span markers (an existing repository being adopted): keep
  `AGENTS.md` unchanged. Write the rendered Toolkit V2 version, with its span
  filled, to `.toolkit-cache/AGENTS.proposed.md`, and report "kept the
  project's AGENTS.md; the Toolkit V2 version is in
  .toolkit-cache/AGENTS.proposed.md". The `project-setup` skill shows the
  owner the difference and, after his yes, merges the V2 sections and the two
  span markers into `AGENTS.md`, then runs `toolkit sync`, which fills the span
  and records the `installed` hash.
- Why a proposal and not an append: an existing `AGENTS.md`, often written for
  the current toolkit, names other skills and files. Appending would put two
  instruction sets that disagree into one file.
- Until `AGENTS.md` has both markers, `toolkit doctor` reports "AGENTS.md has
  no Toolkit V2 sections" with that fix, and the session briefing shows it as a
  setup warning.

### `merge-toml` (only `.codex/config.toml`)

The source holds only comment lines, blank lines, `[table]` headers, and
`key = value` lines.

- Target missing: write the rendered source.
- Target present: for each table in the source, compare headers with spaces
  removed.
  - The target has no such table: add the table, with the comment lines directly
    above it in the source, at the end of the file, after one blank line.
  - The target has the table: for each source key, replace the value when the
    target's table has that key (the source wins, as in `merge-json`); otherwise
    add the `key = value` line after the table's last key line.
  - The comment lines at the top of the source are written only when the file
    is created.
- The target defines one of the source's keys another way (a dotted key such
  as `plugins."toolkit@toolkit-v2".enabled = true`, or an inline table): leave
  the file unchanged and report the conflict. Doctor reports it until it is
  fixed, because the plugin switches in ARCHITECTURE section 2 are not in
  effect.
- Why not `append`: the repeated `enabled = true` lines would be dropped as
  duplicates.

## Sync

`toolkit sync` runs the manifest again with the current `.toolkit.json`
values. It never deletes a file, and it never writes a file the project
changed.

- A target is **unchanged** when its current SHA-256 equals its `installed`
  entry (for `AGENTS.md`, hashed without the span lines). It is **changed by
  the project** when the hashes differ or there is no `installed` entry.
- Several entries with one target (the two `.claude/settings.json` fragments,
  the two `.gitignore` parts) are judged once, before the first of them runs.
- A missing target whose condition and host hold is installed as at init.
- An unchanged target is rebuilt: `copy` and `agents-md` render the current
  source with the current values; `append`, `merge-json`, and `merge-toml`
  run again on the current file. When the result differs, sync writes it and
  records the new hash.
- A changed target is left alone. `toolkit sync --dry-run` and `toolkit
  doctor` list it as "changed by the project". For `append`, `merge-json`, and
  `merge-toml` targets they also list the lines, keys, or tables the toolkit
  would add or change. The `project-setup` skill shows that list to the owner
  and makes the changes he approves.
- The `AGENTS.md` span is rebuilt on every sync when both markers are present,
  whether or not the rest of the file was changed.
- A target whose condition no longer holds (for example
  `.claude/rules/work-item-folders.md` after the tracker changed from `local`)
  is not deleted. Doctor lists it as "left over from an earlier setup"; the
  owner decides.

## Setup changes

`toolkit config set` on a key that a token, a condition, or a host reads
(`project.name`, `project.key`, `project.owner`, `tracker.type`,
`tracker.idPrefix`, `memory.type`, `salesforce.enabled`, `hosts`) saves the
value, then runs `toolkit sync` and prints its report. Examples:

- `toolkit config set tracker.idPrefix ACME` right after init renders
  `AGENTS.md` and `.claude/rules/work-item-folders.md` again, so both say
  `ACME-12`.
- `toolkit config set memory.type builtin` adds the `.memory/` seeds and
  renders `AGENTS.md` again with the built-in memory block.
- A template file the project already changed keeps the old text. The sync
  report names it and the setting it does not reflect, for example
  "AGENTS.md was changed by the project, so it still describes memory.type
  hindsight. Update it by hand."

## Generated files and state

`MANIFEST.json` `generated` lists files that `toolkit` commands write and
people never edit by hand. An entry with `"runAtInit": true` names a command
that init runs as its last step before it writes `.toolkit.json`, so a new
project starts with that file in place: `toolkit work sync` writes
`.work-items/DASHBOARD.md`, and `toolkit memory reindex` writes
`.memory/MEMORY.md`.

`MANIFEST.json` `state` lists files that `toolkit` commands keep for their own
use. They are not generated: they cannot be rebuilt from other files without
losing information, `toolkit export` includes the ones that matter, and nobody
edits them by hand.

- `.work-items/.toolkit-state.json`: the ID-to-path map and the highest ID
  used, so IDs are never reused (ARCHITECTURE 4.3).
- Lock files, held only while a command runs: `.work-items/.lock`,
  `.memory/.lock`, and `.toolkit-decisions.lock` at the project root. The last
  one is listed in the project's `.gitignore`, so a lock left by a crashed
  command never shows up as a new file.

## Directories

`MANIFEST.json` `directories` lists folders init creates even when empty
(Git does not keep empty folders, so the scaffold cannot carry them).

## Files init does not install

`MANIFEST.json` `runtime` lists plugin files that other commands read while
they run, for example `templates/WORK-ITEM.md` when
`.work-items/work-item-template/` is missing, or the focus and glossary seeds
that `toolkit notion ensure-project` writes into the project's Notion pages.
Init does not copy them.
