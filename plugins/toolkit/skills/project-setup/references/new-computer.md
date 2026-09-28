# Setting up a new computer

Purpose: install Toolkit V2 on a computer in both hosts, set up the computer
with `toolkit machine-setup`, and bring back each project's Git-ignored
folders.

## Contents

- Checklist
- 1. Install the plugins
- 2. Set up the computer
- 3. Each project
- Owner steps on the new computer

## Checklist

```text
- [ ] Plugins installed in Claude Code (with the owner's yes)
- [ ] toolkit plugin on for every folder in Claude Code (with his yes)
- [ ] Plugins added in Codex (with his yes)
- [ ] toolkit machine-setup run (with his yes)
- [ ] Hindsight installed, when a project uses Hindsight memory (installing-hindsight.md, each install with his yes)
- [ ] toolkit doctor run in each project
- [ ] .work-items/, .memory/, and Hindsight memory restored from the newest backup, after a dry run
- [ ] Owner steps named: ntn login, trust each project folder and its hooks in Codex
```

## 1. Install the plugins

The plugins are off by default. Each Toolkit V2 project turns them on for
itself. The one exception is `toolkit` (setup and the hooks), which is on for
every folder so "set up this project" works anywhere; its hooks do nothing
outside a Toolkit V2 project.

**Claude Code**, with the owner's yes:

```text
claude plugin marketplace add <toolkit folder or Git address>
claude plugin install <plugin>@toolkit-v2
claude plugin enable toolkit@toolkit-v2 --scope user
```

Run the install for each plugin: `toolkit`, `work`, `memory`,
`session-skills`, `git-workflows`, `sf-architect-solutioning`. The last line
turns only `toolkit` on for every folder.

**Codex**, with his yes:

```text
codex plugin marketplace add <toolkit folder or Git address>
codex plugin add <plugin>@toolkit-v2
```

Run the add for each of the same six plugins. `codex plugin add` writes
`enabled = true` to `~/.codex/config.toml`, which would load every plugin in
every Codex project, including ones set up with the older claude-toolkit.
Codex has no command to turn a plugin off; step 2 does it.

## 2. Set up the computer

```text
toolkit machine-setup
```

It changes this computer, so say so in one line and run it only after the
owner's yes. It:

- writes `~/.local/bin/toolkit`, the small script Codex uses to reach the
  command, and the plugin-root pointer in `~/.config/toolkit-v2/`;
- in `~/.codex/config.toml`, sets `enabled = false` for every Toolkit V2
  plugin except `toolkit`, and `enabled = true` for `toolkit`, keeping every
  other line;
- reports whether Claude Code has `toolkit@toolkit-v2` on for every folder;
- checks `node`, `git`, `ntn` (and its sign-in), `ollama`, and the local
  Hindsight server.

It checks Ollama and Hindsight but never installs them. When a project on
this computer uses Hindsight memory and either one is reported "not found" or
"not installed", install them with `installing-hindsight.md` in this folder,
each install after the owner's yes.

## 3. Each project

1. Run doctor in the project:

   ```text
   toolkit doctor
   ```

2. `.work-items/` (local tracker), `.memory/` (built-in memory), and
   Hindsight memory are not in Git, so a clone does not bring them. The owner
   copies his backup folder over (or connects the drive), and the project's
   `backup.dir` setting points at it:

   ```text
   toolkit config get backup.dir
   ```

3. Restore from the newest day's folder, `<backup folder>/<project key>-<YYYY-MM-DD>/`.
   Preview first, then restore after his yes:

   ```text
   toolkit import --from <day folder> --dry-run
   toolkit import --from <day folder>
   ```

4. Hindsight memory: after `toolkit hindsight ensure-bank` has made the
   bank, restore it from the day folder's `memory-export` the same way, with
   a dry run first:

   ```text
   toolkit memory import --from <day folder>/memory-export --dry-run
   toolkit memory import --from <day folder>/memory-export
   ```

   A Notion tracker and Notion memory need no restore. Every restore detail,
   including conflicts and `--replace`: `backup-and-restore.md` in this
   folder.

## Owner steps on the new computer

- `ntn login`, for Notion projects. It opens a browser sign-in.
- Trust each project folder in Codex, and trust its hooks in `/hooks`.
- Start a new session in each host after the installs.
