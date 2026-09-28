# Repair, switching, a new computer, and wiring

Detail for `project-setup` steps 1 and 4 to 7.

## Reaching the `toolkit` command

- Claude Code puts the plugin's `bin/` folder on the path, so `toolkit` works
  in every Claude Code session.
- Codex needs the small wrapper script that `toolkit machine-setup` writes at
  `~/.local/bin/toolkit`. When `toolkit` is not found, run the plugin's copy
  directly once: `node <this skill's folder>/../../bin/toolkit machine-setup`.
  The skill's folder is the folder that holds `SKILL.md`; both hosts show that
  path when they load the skill.
- Node 20 or later is required. When `node --version` is older or missing,
  tell the owner and ask before installing it.

## Wiring Notion

Needed when the tracker or the memory is `notion`.

1. `ntn whoami`. When it fails, the owner runs `ntn login` himself: it opens a
   browser sign-in to his Notion account. Wait for him to say it is done, then
   run `ntn whoami` again.
2. `toolkit notion ensure-root` checks the "AI Agent Second Brain" page and
   the Projects database, and adds what is missing.
3. `toolkit notion ensure-project --project-name '<name>'` creates or repairs
   this project's row, its Work Items database (board and table views, the
   fourteen stages, sub-items), its Memory page in Lore's layout (the Projects,
   Topics, Memories, Entities, and Facts databases; the records are rows of
   Memories), and its focus and glossary pages. It saves the Notion ids in
   `.toolkit.json`.
4. Both commands only add. They never delete or trash anything, and they
   refuse to write outside the "AI Agent Second Brain" page.
5. In Codex, Notion calls need the network, which Codex's sandbox turns off.
   The project's `.codex/rules/toolkit.rules` lets `toolkit` commands run
   outside the sandbox; when it is missing, Codex asks the owner to approve
   each call.

## Wiring Hindsight

Needed when the memory is `hindsight`. Hindsight runs only on this Mac, never
in Hindsight Cloud, and never in Docker.

1. `toolkit hindsight health`: the local server at `127.0.0.1:8888` answers.
2. When it does not: `toolkit hindsight service status`. Not installed: ask,
   then `toolkit hindsight service install`. Installed but stopped: ask, then
   `toolkit hindsight service start`.
3. The server uses the local model `gpt-oss:20b` through Ollama. When doctor
   says Ollama is not running, tell the owner; it runs as a Homebrew service
   (`brew services start ollama`), which he may prefer to start himself.
4. `toolkit hindsight ensure-bank` creates this project's memory bank (one
   bank per project, named by the project key) and saves it in
   `.toolkit.json`.

## GitHub Issues or Jira

- Show the owner the written instructions. In a GitHub or Jira project, any
  `toolkit work` command exits with code 3 and prints their path, for
  example `toolkit work list`. They are the work plugin's
  `references/trackers/github.md` and `references/trackers/jira.md`.
- GitHub: creating the stage, type, priority, and approval labels needs his
  yes. Never create a GitHub repository without his yes.
- Jira: the Stage field or labels and the status map need his yes and, often,
  a Jira admin. Record the status map as a `DECISIONS.md` row with
  `toolkit decision add`, saved with `publish-docs`.

## Repair (`.toolkit.json` present)

1. `toolkit doctor` lists every problem with its fix.
2. `toolkit sync --dry-run` lists the scaffold files that are missing or out
   of date against the model copy in the toolkit, and the files the project
   changed on purpose.
3. Show one numbered table:

   | # | Problem | Kind | Fix |
   | --- | --- | --- | --- |
   | 1 | `.claude/rules/keep-work-item-current.md` is missing | missing | `toolkit sync` |
   | 2 | `AGENTS.md` differs from the toolkit's version | changed by the owner | none: project ahead of the toolkit |
   | 3 | The Notion Memory page (Lore layout) is missing | broken wiring | `toolkit notion ensure-project` |

4. `toolkit sync` applies every sync row at once. When the owner declines one
   of them, say so and ask whether to run sync anyway or skip it. Wiring rows
   are fixed one at a time with their own command, after his yes.
5. A file the project changed on purpose is never overwritten. Report it as
   "project ahead of the toolkit".
6. Run `toolkit doctor` again until it reports 0 problems. Warnings about the
   other host (for example Codex hook trust, seen from Claude Code) are
   expected: they are the owner's steps.

## Updating the toolkit

- "Update the toolkit" usually means bringing this project up to date with
  the installed toolkit: the repair steps above. When the owner changed his
  model project, the toolkit's copy of the model is refreshed first, in the
  toolkit's own repository; a project sees the change only after the updated
  plugins are installed.
- When doctor says the installed plugins are older than the toolkit source,
  the plugins themselves need updating first, in each host, with the owner's
  yes:
  - Claude Code: `claude plugin marketplace update toolkit-v2`, then
    `claude plugin update <plugin>@toolkit-v2` for each plugin. Then start a
    new session.
  - Codex runs a copy filed under the plugin's version, so a new version needs
    the plugin added again. A marketplace added from a Git address is
    refreshed first with `codex plugin marketplace upgrade toolkit-v2` (a
    local folder needs no refresh); then `codex plugin add <plugin>@toolkit-v2`
    for each of the six plugins. `codex plugin add` turns the plugin on for the
    whole computer (`enabled = true` in `~/.codex/config.toml`), and Codex
    has no command to turn it off. Then, with the owner's yes, run
    `toolkit machine-setup`: it sets each `[plugins."<plugin>@toolkit-v2"]`
    table back to `enabled = false` and keeps every other line, so the
    plugins stay on only in projects whose `.codex/config.toml` turns them on.
  Then run the repair steps.
- Changed hooks must be trusted again in Codex (`/hooks`). That is the
  owner's step.

## Switching the memory backend

The memory export and import commands move memory between backends. The
project-wide `toolkit export` and `toolkit import` do not: they copy only the
local `.work-items/` and `.memory/` folders, so they would miss Hindsight and
Notion memory.

1. `toolkit memory export --to <backup-folder>/memory` copies every record
   (retired ones too), the current focus, and the glossary from the current
   backend to Markdown files. Run it before changing anything. Use the
   owner's backup folder, outside the project.
2. `toolkit config set memory.type <builtin|hindsight|notion>`.
3. `toolkit sync` adds the files the new backend needs (for example the
   `.memory/` seeds for built-in memory).
4. Wire the new backend (Notion or Hindsight above).
5. `toolkit memory import --from <backup-folder>/memory --dry-run` lists what
   would be saved and any file that breaks a rule. Show it to the owner.
6. `toolkit memory import --from <backup-folder>/memory` saves it into the new
   backend. A record with the same key is replaced.
7. `toolkit memory status` and `toolkit doctor` confirm it.
8. The old backend's data is left in place. Removing it needs the owner's yes.

## Switching the tracker

No command does this in this version. Show a preview: each item, where it
goes, and what cannot move (for example Notion card history). Move items only
with the owner's yes, one by one, reading each back. Then
`toolkit config set tracker.type <tracker>` and `toolkit doctor`.

## A new computer

1. Install the plugins in each host the owner uses, with his yes:
   - Claude Code: `claude plugin marketplace add <toolkit folder or Git address>`,
     then `claude plugin install <plugin>@toolkit-v2` for each plugin. The plugins are off by default; each project's settings turn
     them on.
   - Codex: `codex plugin marketplace add <toolkit folder or Git address>`,
     then `codex plugin add <plugin>@toolkit-v2` for `toolkit`, `work`,
     `memory`, `session-skills`, `git-workflows`, and
     `sf-architect-solutioning`. `codex plugin add` writes `enabled = true`
     to `~/.codex/config.toml`, which would load the plugins in every Codex
     project, including ones set up with the older claude-toolkit. Codex has
     no disable command; step 2 turns them off again. A project set up with
     `toolkit init` turns them on in its own `.codex/config.toml`.
2. `toolkit machine-setup` writes the Codex wrapper and the plugin-root
   pointer, sets each `[plugins."<plugin>@toolkit-v2"]` table in
   `~/.codex/config.toml` to `enabled = false` (every other line is kept),
   and checks for `node`, `git`, `ntn`, `ollama`, and Hindsight. Because it
   changes the owner's Codex settings, say so in one line and run it only
   after his yes.
3. `toolkit doctor` in each project.
4. The local tracker (`.work-items/`) and built-in memory (`.memory/`) are
   Git-ignored, so they do not come with a clone. After the owner copies the
   backup folder over, restore them with
   `toolkit import --from <backup-folder>/project` (a project export holds
   both folders). A memory-only backup made with the memory export goes back
   with `toolkit memory import --from <backup-folder>/memory`. Hindsight
   memory lives on the old Mac; move it the same way, through a memory
   export there and a memory import here. Notion needs no restore.
5. Owner steps on the new computer: `ntn login` (for Notion projects),
   trusting each project folder in Codex, and trusting the hooks in Codex
   (`/hooks`).
