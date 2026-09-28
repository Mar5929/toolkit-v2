# Repair and update

Purpose: reach the `toolkit` command, repair an existing setup from doctor
and a dry run, and update the installed toolkit plugins in both hosts.

## Contents

- Reaching the `toolkit` command
- Repair (`.toolkit.json` present)
- Updating the toolkit
- After a hook change

## Reaching the `toolkit` command

- Claude Code puts the plugin's `bin/` folder on the path, so `toolkit` works
  in every Claude Code session where the toolkit plugin is on.
- Codex needs the small wrapper script that `toolkit machine-setup` writes at
  `~/.local/bin/toolkit`. When `toolkit` is not found, run the plugin's own
  copy once. The skill's folder is the folder that holds this skill's
  `SKILL.md`; both hosts show that path when they load the skill.

  ```text
  node <this skill's folder>/../../bin/toolkit machine-setup
  ```

- `toolkit machine-setup` changes this computer: `~/.codex/config.toml`,
  `~/.local/bin/toolkit`, and `~/.config/toolkit-v2/`. Say that in one line
  and get the owner's yes before the first run on a computer. Both hosts ask
  him before it runs; that prompt is expected. In Codex, run it alone with
  `sandbox_permissions` set to `require_escalated` and a one-line reason, or
  it stays inside the sandbox and cannot write those files. What it changes:
  `new-computer.md` in this folder.
- Node 20 or later is required. When `node --version` is older or missing,
  tell the owner and ask before installing it.

## Repair (`.toolkit.json` present)

1. List every problem with its fix, and every scaffold file that is missing,
   out of date, or changed by the project. The dry run writes nothing.

   ```text
   toolkit doctor
   toolkit sync --dry-run
   ```

2. Show one numbered table:

   | # | Problem | Kind | Fix |
   | --- | --- | --- | --- |
   | 1 | `.claude/rules/keep-work-item-current.md` is missing | missing | `toolkit sync` |
   | 2 | `AGENTS.md` differs from the toolkit's version | changed by the owner | none: project ahead of the toolkit |
   | 3 | The Notion Memory page (Lore layout) is missing | broken wiring | `toolkit notion ensure-project` |

3. Run sync only after the owner's yes. It adds every missing file and
   updates every file the project never changed, all at once. When he
   declines one of its rows, say so and ask whether to run sync anyway or
   skip it.

   ```text
   toolkit sync
   ```

4. A file the project changed on purpose is never overwritten. Report it as
   "project ahead of the toolkit". Files for choices no longer made are listed
   as left over; sync never deletes them.
5. Fix each wiring row with its own command, one at a time, after his yes
   (`wiring-notion.md` or `wiring-hindsight.md` in this folder).
6. Run doctor again until it reports 0 problems. A warning only the other
   host can clear (for example Codex hook trust, seen from Claude Code) is the
   owner's step.

### Doctor findings that need more than `toolkit sync`

Doctor prints a fix line for every finding. These are the ones whose fix is
not sync, or not the agent's:

| Finding id | What it means | Fix |
| --- | --- | --- |
| `backup-folder` | No backup folder is set | Ask the owner for a folder outside the project, then `toolkit config set backup.dir <folder>` (or `none`) |
| `backup-old`, `backup-never` | The last backup is old, or there is none | `toolkit handoff-backup`; when the owner chose no backup folder, `toolkit export --to <folder>` or ask him for a folder |
| `backup-unreachable` | The backup folder's drive is not there | Ask the owner to connect it, or to pick another folder |
| `claude-ask-rules` | The Claude Code settings do not ask before the five ask-first commands | `toolkit sync`, after the owner's yes |
| `codex-ask-rules` | `.codex/rules/toolkit.rules` does not ask before them | `toolkit sync`; a rules file the project changed: copy the `prompt` rules from the toolkit's `templates/codex/toolkit.rules` into it, above the general toolkit rule, with the owner's yes |
| `codex-hook-trust`, `codex-sf-hook-trust` | Codex does not trust the Toolkit V2 hooks, or the Salesforce guards | The owner's step: `/hooks` in Codex |
| `codex-hook-changed` | The hooks changed since Codex last ran them | The owner trusts them again in Codex `/hooks` |
| `plugin-pointer` | The plugin-root pointer is missing, broken, or names a copy that is not installed | `toolkit machine-setup` from an installed copy, after the owner's yes |
| `hook-errors` | A Toolkit V2 hook failed in the last 3 days, silently | Tell the owner, with the file doctor names; the warning ends 3 days after the last failure |

## Updating the toolkit

"Update the toolkit" usually means bringing this project up to date with the
installed toolkit: the repair steps above. The installed plugins come first
when doctor says they are older than the toolkit source, or when Claude Code
and Codex run different versions. Each update needs the owner's yes.

**Claude Code:**

```text
claude plugin marketplace update toolkit-v2
claude plugin update <plugin>@toolkit-v2
```

Run the second command for each plugin: `toolkit`, `work`, `memory`,
`session-skills`, `git-workflows`, `sf-architect-solutioning`. Then the owner
starts a new session.

**Codex** runs a copy filed under the plugin's version, so a new version is
added again:

1. A marketplace added from a Git address is refreshed first. A local folder
   needs no refresh.

   ```text
   codex plugin marketplace upgrade toolkit-v2
   ```

2. Add each of the six plugins again:

   ```text
   codex plugin add <plugin>@toolkit-v2
   ```

3. `codex plugin add` turns each plugin on for every Codex folder, and Codex
   has no command to turn one off. With the owner's yes, run machine-setup:
   it turns every Toolkit V2 plugin except `toolkit` off for every folder
   again, and keeps every other line of `~/.codex/config.toml`.

   ```text
   toolkit machine-setup
   ```

Then run the repair steps in each project.

## After a hook change

Codex skips a plugin hook until the owner trusts it, and it asks again after
every change to the hooks or a move of the project folder. Trusting them is
his step: open Codex in the project, type `/hooks`, and trust the Toolkit V2
hooks.
