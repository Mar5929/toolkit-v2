# Codex setup on Mike's Mac (2026-09-26)

The six Toolkit V2 plugins are installed in Mike's real Codex (codex-cli
0.157.0, signed in with ChatGPT). They are off for the whole computer and on
only in a trusted project whose own `.codex/config.toml` turns them on, which
`toolkit init` writes. Real `codex exec` sessions in a toolkit project list the
V2 skills, run `toolkit` outside the sandbox through
`.codex/rules/toolkit.rules`, and run all five V2 hooks. A folder without
toolkit files, and Mike's `claude-toolkit` project, see exactly what they saw
before.

Raw evidence (JSON events, session files, diffs) is in the scratch folder
`/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/codex-setup/`
(called `$W` below). It is temporary; the outputs that matter are quoted here.

## What changed on this Mac

| Where | Change |
| --- | --- |
| `~/.codex/config.toml` | Backed up first to `scratchpad/codex-config-backup.toml` (sha256 `f66fa6e5...b49a`). Added `[marketplaces.toolkit-v2]`, six `[plugins."<name>@toolkit-v2"] enabled = false` tables, and one `[projects."$W/tk-project"] trust_level = "trusted"` table. Nothing else changed (checked below). |
| `~/.codex/plugins/cache/toolkit-v2/<plugin>/0.2.0/` | The installed copies `codex plugin add` made, one per plugin. Codex runs these copies, not the source folder. |
| `~/.codex/plugins/data/toolkit-toolkit-v2/sessions/` | Hook session-state files from the test sessions (`$PLUGIN_DATA`). The toolkit removes them after 7 days. |
| `~/.codex/sessions/2026/09/26/` | Codex's own session logs for the three runs that were not `--ephemeral` (thread ids `01a0e04e-5884...`, `01a0e04f-7493...`, `01a0e050-d95c...`). |
| `~/.local/bin/toolkit` | New wrapper script from `toolkit machine-setup` (mode 755). No other `toolkit` was on the PATH before. |
| `~/.config/toolkit-v2/plugin-root` | New pointer file. `machine-setup` wrote the source folder; the first Codex session-start hook changed it to `~/.codex/plugins/cache/toolkit-v2/toolkit/0.2.0`. |

`~/.codex/hooks.json`, `~/.codex/rules/default.rules`, the Claude Code
settings, and the `claude-toolkit` repository were not changed. Hook trust was
not stored: every hook run below used `--dangerously-bypass-hook-trust`.

## Steps and output

1. Backup: `cp -p ~/.codex/config.toml scratchpad/codex-config-backup.toml`.
2. Marketplace: `codex plugin marketplace add /Users/michaelrihm/Documents/Projects/toolkit-v2`
   printed `Added marketplace toolkit-v2`. `codex plugin marketplace list` shows
   `toolkit-v2  /Users/michaelrihm/Documents/Projects/toolkit-v2`.
3. Plugins: `codex plugin add <name>@toolkit-v2 --json` for `toolkit`, `work`,
   `memory`, `session-skills`, `git-workflows`, `sf-architect-solutioning`.
   All six exited 0 with `"version": "0.2.0"` and
   `installedPath: ~/.codex/plugins/cache/toolkit-v2/<name>/0.2.0`.
4. `codex plugin add` writes `enabled = true` to the user config. Codex has no
   disable command, so the six lines were changed to `enabled = false` in place.
   `codex plugin list` in a plain folder now shows each as
   `installed, disabled  0.2.0`.
5. `toolkit machine-setup` (run from the source folder):

   ```
   Pointed /Users/michaelrihm/.config/toolkit-v2/plugin-root at /Users/michaelrihm/Documents/Projects/toolkit-v2/plugins/toolkit.
   Wrote the wrapper script /Users/michaelrihm/.local/bin/toolkit (fallback folder: /Users/michaelrihm/Documents/Projects/toolkit-v2/plugins/toolkit).
   Toolkit plugin version: 0.2.0 (/Users/michaelrihm/Documents/Projects/toolkit-v2/plugins/toolkit).
   Programs:
     - node: ok. Node.js 25.8.1.
     - git: ok. git version 2.54.0 (Apple Git-157).
     - ntn: ok. ntn 0.23.10, signed in.
     - ollama: ok. ollama version is 0.34.4, running.
     - hindsight: ok. the local server at 127.0.0.1:8888 is healthy.
   ```

6. Two scratch Git folders: `$W/plain` (one README, no toolkit files) and
   `$W/tk-project` (`toolkit init --name "Codex Setup Test" --tracker local --memory builtin --owner "Test Owner"`,
   which wrote `.codex/config.toml` and `.codex/rules/toolkit.rules`).
7. Trust: `toolkit doctor` in `$W/tk-project` warned "Codex does not trust
   this folder". One trust table was added to `~/.codex/config.toml` for that
   folder's real path. The doctor warning went away.

## Proof: V2 skills load only where a project turns them on

`codex debug prompt-input "list skills"` prints what the model sees without
calling the model. `$W/skills-from-prompt.py` counts the skills in it.

| Folder | Skills listed | From `toolkit-v2` | From `claude-toolkit` |
| --- | --- | --- | --- |
| `$W/plain`, before any change | 58 | 0 | 31 |
| `$W/plain`, after the setup | 58 | 0 | 31 |
| `claude-toolkit` (Mike's project; its `git status --ignored` was the same before and after) | 58 | 0 | 31 |
| `$W/tk-project`, not trusted yet | 58 | 0 | 31 |
| `$W/tk-project`, trusted | 49 | 22 | 0 |

The 22 skills in the trusted toolkit project: `git-workflows:merge-and-clean-up`,
`git-workflows:publish-docs`, `git-workflows:pull-latest`,
`git-workflows:reset-to-remote`, `memory:memory-find`, `memory:memory-save`,
`memory:memory-tidy`, `session-skills:braindump`,
`session-skills:explain-simply`, `session-skills:handoff`,
`session-skills:session-summary`, `session-skills:unslop`,
`toolkit:project-setup`, `work:solution-design`, `work:work-check`,
`work:work-decide`, `work:work-delegate`, `work:work-finish`, `work:work-on`,
`work:work-organize`, `work:work-requirements`, `work:work-status`.
`sf-architect-solutioning@toolkit-v2` stays off because the project is not a
Salesforce project.

`codex plugin list` inside the trusted toolkit project shows the five V2
plugins `installed, enabled`, `sf-architect-solutioning@toolkit-v2`
`installed, disabled`, and every `*@claude-toolkit` plugin `installed, disabled`.

A real session agrees. `codex exec` in `$W/plain` answered "work-tracker:work;
no." when asked for skills containing `work-` and whether it got a project
briefing. Its session log holds one hook message, Mike's own voice hook, and
no V2 briefing.

## Proof: `toolkit` runs in a Codex session, outside the sandbox

Command used for every toolkit-project run:

```sh
codex exec --json --sandbox workspace-write --dangerously-bypass-hook-trust \
  -c model_reasoning_effort="low" -C "$W/tk-project" "<prompt>" < /dev/null
```

Run 1 JSON events (thread `01a0e04d-6e17...`, `--ephemeral`):

```
command_execution "/bin/zsh -lc 'toolkit version'"          exit_code 0  output "0.2.0"
command_execution "/bin/zsh -lc 'toolkit hindsight health'" exit_code 0  output "Hindsight at http://127.0.0.1:8888: healthy, version 0.10.1."
```

Control run (thread `01a0e04e-f5a7...`): the same command with
`--ignore-rules`, which stops Codex from loading `.rules` files:

```
command_execution "/bin/zsh -lc 'toolkit hindsight health'" exit_code 1
"The Hindsight server at http://127.0.0.1:8888 did not answer GET /health (EPERM: connect EPERM 127.0.0.1:8888 - Local (0.0.0.0:0))."
```

So the sandbox blocks the network, and the project's
`.codex/rules/toolkit.rules` is what lets `toolkit` run outside it. Codex
accepted the rules file as written. `codex execpolicy check --rules .codex/rules/toolkit.rules -- toolkit version`
returns `"decision": "allow"` with `matchedPrefix ["toolkit"]`. The rule does
not match `node toolkit version` or `/Users/michaelrihm/.local/bin/toolkit version`,
so skills must call `toolkit` by its bare name.

The `toolkit` found in Codex's shell is `~/.local/bin/toolkit`: Codex runs
commands with `/bin/zsh -lc`, which reads Mike's login profile.

## Proof: the hooks run in a real Codex session

Codex accepted `hooks/codex-hooks.json` from the `toolkit` plugin. No run
printed a hook error.

- **SessionStart.** Run 2 (thread `01a0e04e-5884...`) session log
  `~/.codex/sessions/2026/09/26/rollout-2026-09-26T20-40-26-01a0e04e-5884-7511-8403-46d39cb561b1.jsonl`,
  ordinal 9, is a developer message with
  `content_item_kinds: ["hooks.additional_context"]`. It starts:
  "Project briefing: Codex Setup Test (codex-setup-test), owner Test Owner.
  Work items: local folders in .work-items/ (ids like WI-001). Memory:
  built-in memory in .memory/. Salesforce: no. Hosts: Claude Code and Codex."
  It goes on with the project manual line, the tracker state, the current
  focus, the memory count, setup warnings, the always-on rules list, and the
  "How to write replies" section. The agent quoted the first two lines back.
  The hook also changed `~/.config/toolkit-v2/plugin-root` to the Codex copy,
  so hook processes can write outside the sandbox (the open question in
  critique P2).
- **PreToolUse.** Run 2 asked the agent to run `git add -A`. It was refused
  before it ran: "Command blocked by PreToolUse hook: git add -A, git add
  --all, git add ., and git add :/ stage every change in the checkout,
  including work from other sessions. Stage the files you changed by name
  instead: git add <path> <path>.. Command: git add -A". `git status` in the
  project stayed clean.
- **UserPromptSubmit.** Run 3 (thread `01a0e050-d95c...`) prompt: "Remember
  that the staging database for this project is called tkv2-staging." Session
  log ordinal 12, kind `hooks.additional_context`: "The owner stated something
  to keep; memory-save records it, or work-on if it is a task." The session
  state file records `"keep": "remember that"`.
- **PostToolUse.** In run 3 the agent opened `memory:memory-save` and ran
  `toolkit memory save`, which wrote `.memory/project_staging_database.md`.
  The session state file records
  `{"kind": "memory", "what": "toolkit memory save"}`.
- **Stop.** It ran at the end of each turn (`updated` time in each session
  state file) and did not block, because run 3 recorded a save.
- **Without the bypass flag** (thread `01a0e050-10ee...`) the agent answered
  "No." to "did you receive a Project briefing": Codex skips untrusted plugin
  hooks without a message in `codex exec`.

## Proof: Mike's config changed only by additions

`diff scratchpad/codex-config-backup.toml ~/.codex/config.toml` has three hunks,
all `a` (added lines), and 0 removed or changed lines:

```
114a115,117
> [projects."$W/tk-project"]
> trust_level = "trusted"
131a135,138
> [marketplaces.toolkit-v2]
> source_type = "local"
> source = "/Users/michaelrihm/Documents/Projects/toolkit-v2"
194a202,219
> [plugins."toolkit@toolkit-v2"]
> enabled = false
> ... (the same for work, memory, session-skills, git-workflows, sf-architect-solutioning)
```

Parsed with Python `tomllib`: the file is valid TOML, the six
`*@claude-toolkit` plugin tables are identical to the backup, and with the
added tables taken out the whole config equals the backup.

## Findings for the toolkit (not patched)

1. **Nothing in the toolkit installs the plugins in Codex or keeps them off for
   the whole computer.** `project-setup` ("new computer") and
   `references/repair-and-wiring.md` give the Claude Code update commands but
   no Codex ones, and `toolkit doctor` does not read the user-level switches.
   Tested: running `codex plugin add sf-architect-solutioning@toolkit-v2` again
   (as an update after a version bump needs) changed its user-level line back
   to `enabled = true` (`$W/18-readd.txt`); it also re-copies the cache folder
   even at the same version. With a line at `true`, that plugin loads in every
   Codex project, including `claude-toolkit`. Fix:
   - Add a Codex section to the "new computer" and "update" steps:
     `codex plugin marketplace add <toolkit-v2 folder>`, then
     `codex plugin add <name>@toolkit-v2` for the six plugins, then set each
     `[plugins."<name>@toolkit-v2"]` to `enabled = false` in
     `~/.codex/config.toml` with the owner's yes (it is his config, critique P14).
   - `toolkit doctor` warns when any `[plugins."<name>@toolkit-v2"] enabled = true`
     is in `~/.codex/config.toml`, and when a Codex cache copy
     (`installedPluginCopies`) is older than the plugin version the project
     expects.
2. **The briefing contradicts itself when hooks run.** The Codex briefing lists
   the setup warning "The Toolkit V2 hooks are not trusted in Codex yet, so
   Codex skips them (no briefing, no memory reminder, no guards)" inside the
   briefing that a hook just delivered. This happens whenever hooks run through
   `--dangerously-bypass-hook-trust`. Fix: the session-start hook leaves the
   `codex-hook-trust` finding out of its own briefing (it is running, so it
   ran); `toolkit doctor` keeps it. Related: `toolkit doctor` exits 1 on
   warnings (as its help says), so in bypass runs it always exits 1; sample-run
   scripts should read its `Result:` line, not the exit code.
3. **Codex joined the body file and the save into one shell script.** In run 3
   the agent ran `cat > /private/tmp/tkv2-staging-memory.md <<'EOF' ... EOF`
   and `toolkit memory save ... --body-file /private/tmp/tkv2-staging-memory.md`
   as one `zsh -lc` script. A script with a redirect is matched as one command,
   so the `toolkit` rule did not apply and the save ran inside the sandbox. It
   worked only because built-in memory writes inside the project. With
   Hindsight or Notion memory the same pattern fails with the EPERM error
   shown in the control run. The temporary file was also left behind (moved to
   `$W/22-stray-body-file-tkv2-staging-memory.md`). `memory-save` already says
   "Put each `toolkit` command on its own line". Fix: make the Codex step
   explicit in every skill that uses `--body-file` or `--set-file`: write the
   file with its own command (or `apply_patch`), then run the `toolkit`
   command as a separate command with nothing before or after it, then delete
   the file; or pass short bodies with `--body "<text>"` on the `toolkit` line.
4. **Not verified: the hook trust key.** `toolkit doctor` looks for
   `[hooks.state."toolkit@toolkit-v2:..."]`. The real key appears only after
   Mike trusts the hooks in `/hooks`, which was not done. Check it after he
   does.

## Running the sample projects in Codex

- Each sample project must be a Git repository set up by `toolkit init`, so it
  has `.codex/config.toml` and `.codex/rules/toolkit.rules`.
- Codex reads a project's `.codex/` files only in a trusted folder. Two tested
  ways, using the real path (`pwd -P`; `/tmp` is `/private/tmp`):
  - Add `[projects."<real path>"]` with `trust_level = "trusted"` to
    `~/.codex/config.toml`. This is what Mike's Codex does when he trusts a
    folder. Used for `$W/tk-project`.
  - Or pass it for one run only, with no config change:
    `-c 'projects={"<real path>"={trust_level="trusted"}}'`. This replaces the
    whole projects table for that run. Tested with `codex exec` in
    `$W/tk-project-2`, which has no trust table: the agent quoted "Project
    briefing: Codex Override Test (codex-override-test), owner Test Owner." and
    counted 9 `work:` skills. `~/.codex/config.toml` was unchanged afterwards.
- Pass `--dangerously-bypass-hook-trust`, or the hooks do not run.
- Pass `--sandbox workspace-write`. Add `< /dev/null`: when stdin is not a
  terminal, `codex exec` prints "Reading additional input from stdin..." and
  adds whatever it reads there to the prompt.
- Codex runs the cached copy of each plugin. After a change to a plugin:
  raise its version, run `codex plugin add <name>@toolkit-v2`, then set its
  user-level line back to `enabled = false` (finding 1).
- Real interactive use still needs Mike to trust the hooks once in `/hooks`.

## How to undo

```sh
for p in toolkit work memory session-skills git-workflows sf-architect-solutioning; do
  codex plugin remove "$p@toolkit-v2"
done
codex plugin marketplace remove toolkit-v2
```

Then delete the `[projects."$W/tk-project"]` table, `~/.local/bin/toolkit`,
and `~/.config/toolkit-v2/`. The backup is
`scratchpad/codex-config-backup.toml`; copying it back would also undo any
change Codex or Mike made to the config after 20:37 on 2026-09-26, so remove
the added tables instead.
