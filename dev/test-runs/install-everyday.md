# Toolkit V2 in Mike's everyday Claude Code and Codex (2026-09-28)

Decisions 10 and 11 (`dev/GOAL.md`, "Decisions of 2026-09-28") are carried
out on Mike's Mac. The six Toolkit V2 plugins are installed in his own Claude
Code (2.1.280) and his own Codex (codex-cli 0.157.0). In both hosts the
`toolkit` plugin is on for every folder and the other five are off for every
folder. A Toolkit V2 project turns the other five on in its own settings,
which `toolkit init` writes.

Result, checked with real Claude Code sessions (`claude -p`) and Codex's
prompt preview (`codex debug prompt-input`):

| Folder | Claude Code: V2 skills listed | Codex: V2 skills listed |
| --- | --- | --- |
| Plain scratch folder (not a V2 project) | 1: `toolkit:project-setup` | 1: `toolkit:project-setup` |
| V2 project, local tracker, no Salesforce | 22 (every V2 plugin skill except `sf-architect-solutioning`) | 22 (the same 22) |
| V2 project with Salesforce | 23 plugin skills + 3 project skills | 23 plugin skills + 3 project skills |

In both V2 projects no `claude-toolkit` plugin loaded in either host. In the
plain folder the `claude-toolkit` plugins loaded as before.

Raw logs are in the scratch folder
`/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/install-everyday/`
(called `$W` below). The backups are in `scratchpad/install-backups/`. Both
folders are temporary; the outputs that matter are quoted here.

## Every change outside the repository

| Where | Change |
| --- | --- |
| `~/.claude/settings.json` | Six `enabledPlugins` entries added (`toolkit@toolkit-v2: true`, the other five `false`) and one `extraKnownMarketplaces.toolkit-v2` entry (a `directory` source). Claude Code's own writer also moved one unchanged line (`skipWorkflowUsageWarning: true`) and added a final newline. Full diff below. |
| `~/.claude/plugins/known_marketplaces.json` | One entry added: `toolkit-v2`, source `directory`, path `/Users/michaelrihm/Documents/Projects/toolkit-v2`. |
| `~/.claude/plugins/installed_plugins.json` | Six entries added, one per V2 plugin, scope `user`, commit `3adb722`. No entry removed or changed. |
| `~/.claude/plugins/cache/toolkit-v2/<plugin>/<version>/` | New copies: toolkit 0.2.6, work 0.2.8, memory 0.2.6, session-skills 0.2.6, git-workflows 0.2.6, sf-architect-solutioning 0.2.1. Claude Code does not run these (see Finding 1). |
| `~/.claude/plugins/data/toolkit-toolkit-v2/sessions/` | New folder with two hook session-state files from the two V2 test sessions. The toolkit removes them after 7 days. |
| `~/.claude/projects/` | Three new transcript folders for the four `claude -p` test sessions (named after `$W/plain`, `$W/v2-local`, `$W/v2-sf`). |
| `~/.codex/config.toml` | One line: `enabled = false` became `enabled = true` under `[plugins."toolkit@toolkit-v2"]`. Full diff below. |
| `~/.codex/plugins/cache/toolkit-v2/<plugin>/` | `codex plugin add` replaced the old copies (toolkit, memory, session-skills, git-workflows 0.2.4; work 0.2.6) with toolkit 0.2.6, work 0.2.8, memory 0.2.6, session-skills 0.2.6, git-workflows 0.2.6. sf-architect-solutioning stays 0.2.1. |
| `~/.local/bin/toolkit` | Rewritten by `toolkit machine-setup` with the current wrapper text: new comment lines, and it now also falls back when the pointer names a folder without `scaffold/CONDITIONS.json`. The fallback folder is unchanged. |
| `~/.config/toolkit-v2/plugin-root` | Was `~/.codex/plugins/cache/toolkit-v2/toolkit/0.2.4`, a folder `codex plugin add` had just deleted. Now `~/.claude/plugins/cache/toolkit-v2/toolkit/0.2.6`. |

Not changed: `~/.codex/hooks.json` (last changed 2026-09-12),
`~/.codex/rules/default.rules` (2026-09-19), `~/.claude/hooks/`, the
permissions and hooks in `~/.claude/settings.json`, every `claude-toolkit`
plugin entry in both hosts, the `claude-toolkit` repository (clean, head
`9d4ea8d`), and the model folders. Claude Code's `~/.claude.json` has no entry
for the scratch folders. No Codex trust entry was added: the V2 project checks
passed the trust setting on the command line instead (see "How the skill lists
were read").

## Steps and output

### 1. Checks before the install

All passed on the working tree as it was at 15:33:

- `node --test "tests/**/*.test.mjs"` (in `plugins/toolkit`): 913 tests, 910
  pass, 0 fail, 3 skipped by design.
- `check-skills.mjs --quiet`: 0 failures, 0 warnings, 16 notes.
- `sync-skill-references.mjs --check`: 159 copies, 0 problems.
- `import-model.mjs --check`: the copy matches the approved model folder
  (commit `5e7d7a0`).
- git-workflows tests: 13 of 13 pass.
- `claude plugin validate .`: passed.

### 2. Backups

```
cp -p ~/.claude/settings.json install-backups/claude-settings.json   sha256 03332f6b...4325d0
cp -p ~/.codex/config.toml    install-backups/codex-config.toml      sha256 c135861b...79c991
```

After the install: `~/.claude/settings.json` sha256 `d80a8b38...54e65b`,
`~/.codex/config.toml` sha256 `f8570208...9b6294`. Both were unchanged after
the checks were run again at the end (same results as step 1).

`install-backups/extra/` also holds the earlier `known_marketplaces.json`,
`installed_plugins.json`, `~/.claude.json`, `~/.local/bin/toolkit`, and
`plugin-root`.

### 3. Claude Code

The commands were first run against a copy of the settings file in a scratch
`CLAUDE_CONFIG_DIR`, to see what they write. The real run wrote the same.

```
$ claude plugin marketplace add /Users/michaelrihm/Documents/Projects/toolkit-v2 --scope user
✔ Successfully added marketplace: toolkit-v2 (declared in user settings)
$ claude plugin install toolkit@toolkit-v2 --scope user
✔ Successfully installed plugin: toolkit@toolkit-v2 (scope: user). This plugin is disabled by default — enable it with: claude plugin enable toolkit@toolkit-v2
  (the same for work, memory, session-skills, git-workflows, sf-architect-solutioning; all exit 0)
$ claude plugin enable toolkit@toolkit-v2 --scope user
✔ Successfully enabled plugin: toolkit (scope: user)
```

`claude plugin install` writes `"<plugin>@toolkit-v2": false` for each
plugin, because every V2 manifest has `defaultEnabled: false`. So the five
are off for every folder by an explicit entry, not only by default. A
project's `.claude/settings.json` wins over user settings
(`ai-external-knowledge/claude-code/settings-reference.md`, `enabledPlugins`),
so a V2 project still turns them on.

`claude plugin list` afterwards: `toolkit@toolkit-v2` 0.2.6 enabled;
`work@toolkit-v2` 0.2.8, `memory@toolkit-v2` 0.2.6,
`session-skills@toolkit-v2` 0.2.6, `git-workflows@toolkit-v2` 0.2.6,
`sf-architect-solutioning@toolkit-v2` 0.2.1 disabled; all scope `user`.

Diff of `~/.claude/settings.json` against the backup:

```diff
@@ -107,7 +107,13 @@
     "obsidian@obsidian-skills": true,
     "session-skills@claude-toolkit": true,
     "work-tracker@claude-toolkit": true,
-    "system-guide@claude-toolkit": true
+    "system-guide@claude-toolkit": true,
+    "toolkit@toolkit-v2": true,
+    "work@toolkit-v2": false,
+    "memory@toolkit-v2": false,
+    "session-skills@toolkit-v2": false,
+    "git-workflows@toolkit-v2": false,
+    "sf-architect-solutioning@toolkit-v2": false
   },
   "extraKnownMarketplaces": {
     "claude-toolkit": {
@@ -128,12 +134,18 @@
         "source": "github",
         "repo": "kepano/obsidian-skills"
       }
+    },
+    "toolkit-v2": {
+      "source": {
+        "source": "directory",
+        "path": "/Users/michaelrihm/Documents/Projects/toolkit-v2"
+      }
     }
   },
   "outputStyle": "Plain English",
   "effortLevel": "xhigh",
   "skipDangerousModePermissionPrompt": true,
+  "skipWorkflowUsageWarning": true,
   "inputNeededNotifEnabled": true,
-  "agentPushNotifEnabled": true,
-  "skipWorkflowUsageWarning": true
-}
\ No newline at end of file
+  "agentPushNotifEnabled": true
+}
```

The same two files compared value by value (every key, every level): 7
additions, 0 removals, 0 changed values.

```
added   /enabledPlugins/git-workflows@toolkit-v2 = false
added   /enabledPlugins/memory@toolkit-v2 = false
added   /enabledPlugins/session-skills@toolkit-v2 = false
added   /enabledPlugins/sf-architect-solutioning@toolkit-v2 = false
added   /enabledPlugins/toolkit@toolkit-v2 = true
added   /enabledPlugins/work@toolkit-v2 = false
added   /extraKnownMarketplaces/toolkit-v2 = {"source": {"source": "directory", "path": "/Users/michaelrihm/Documents/Projects/toolkit-v2"}}
```

The `skipWorkflowUsageWarning` line moved because Claude Code writes the
whole file in its own key order. Its value is still `true`.

### 4. Codex

The `toolkit-v2` marketplace was already registered in Codex (2026-09-26).

```
$ codex plugin add toolkit@toolkit-v2 --json
{ "pluginId": "toolkit@toolkit-v2", "version": "0.2.6",
  "installedPath": "/Users/michaelrihm/.codex/plugins/cache/toolkit-v2/toolkit/0.2.6" }
  (work 0.2.8, memory 0.2.6, session-skills 0.2.6, git-workflows 0.2.6,
   sf-architect-solutioning 0.2.1; all exit 0)
```

`codex plugin add` set all six to `enabled = true` in `~/.codex/config.toml`.
Then:

```
$ node /Users/michaelrihm/Documents/Projects/toolkit-v2/plugins/toolkit/bin/toolkit machine-setup
Pointed /Users/michaelrihm/.config/toolkit-v2/plugin-root at /Users/michaelrihm/.claude/plugins/cache/toolkit-v2/toolkit/0.2.6.
Wrote the wrapper script /Users/michaelrihm/.local/bin/toolkit (fallback folder: /Users/michaelrihm/Documents/Projects/toolkit-v2/plugins/toolkit).
Toolkit plugin version: 0.2.6 (/Users/michaelrihm/Documents/Projects/toolkit-v2/plugins/toolkit).
Switched off for every Codex folder in /Users/michaelrihm/.codex/config.toml (codex plugin add had turned them on): work@toolkit-v2, memory@toolkit-v2, session-skills@toolkit-v2, git-workflows@toolkit-v2, sf-architect-solutioning@toolkit-v2. Projects set up by toolkit init turn them on for themselves.
Codex: the toolkit plugin is on for every folder, so "set up Toolkit V2 in this project" works in a new folder. Codex asks once to run toolkit init outside its sandbox.
Claude Code: toolkit@toolkit-v2 is on for every folder.
Programs:
  - node: ok. Node.js 25.8.1.
  - git: ok. git version 2.54.0 (Apple Git-157).
  - ntn: ok. ntn 0.23.10, signed in.
  - ollama: ok. ollama version is 0.34.4, running.
  - hindsight: ok. the local server at 127.0.0.1:8888 is healthy.
exit 0
```

`toolkit machine-setup` did not ask a question when run from a terminal. The
ask-first rule for it lives in each V2 project's settings (Claude Code
`permissions.ask`, Codex prompt rule), so it applies only to an agent inside a
V2 project. Mike's yes to decisions 10 and 11 covered this run.

Diff of `~/.codex/config.toml` against the backup, after both steps:

```diff
@@ -200,7 +200,7 @@
 enabled = true
 
 [plugins."toolkit@toolkit-v2"]
-enabled = false
+enabled = true
 
 [plugins."work@toolkit-v2"]
 enabled = false
```

`codex plugin list` in the plain folder: `toolkit@toolkit-v2` 0.2.6
`installed, enabled`; `work@toolkit-v2` 0.2.8, `memory@toolkit-v2` 0.2.6,
`session-skills@toolkit-v2` 0.2.6, `git-workflows@toolkit-v2` 0.2.6,
`sf-architect-solutioning@toolkit-v2` 0.2.1 `installed, disabled`.
`toolkit version` in a terminal prints `0.2.6`.

## How the skill lists were read

Three scratch folders under `$W`:

- `plain`: one `README.md`, no toolkit files.
- `v2-local`: `git init`, then
  `toolkit init --name "Install Check Local" --tracker local --memory builtin --owner "Test Owner" --backup-dir none`
  (exit 0).
- `v2-sf`: the same with `--name "Install Check SF" --salesforce` (exit 0).
  Its `.claude/settings.json` and `.codex/config.toml` turn all six V2
  plugins on and the `claude-toolkit` plugins off.

`toolkit doctor` in `v2-local`: "Result: clean", with the two known
Codex-only notes (folder not trusted, hooks not trusted).

**Claude Code.** In each folder:
`claude -p "Reply with the single word ok." --model haiku --max-turns 1 --output-format stream-json --verbose`.
The first `system`/`init` event lists every loaded plugin (with its
marketplace) and every skill. Each run answered `ok`.

**Codex.** In each folder: `codex debug prompt-input "list skills"`, which
prints what the model would see without calling it.
`$W/skills-from-prompt.py` (from the 2026-09-26 Codex setup run) lists each
skill and the file it comes from. Codex reads a project's
`.codex/config.toml` only in a trusted folder. To avoid adding trust entries
to Mike's config, the V2 runs passed trust on the command line:
`-c "projects.<folder path>.trust_level=\"trusted\""`. The quoted form
`projects."<path>".trust_level` is not applied by Codex's `-c` parser (that
run still showed only `toolkit:project-setup`); the unquoted form works
because the path has no dots.

### Claude Code results

```
== plain
toolkit-v2 plugins loaded: toolkit 0.2.6
claude-toolkit plugins loaded: second-brain, project-init, git-workflows, sf-architect-solutioning, hooks-library, session-skills, work-tracker, system-guide
skills from toolkit-v2 plugins: 1: toolkit:project-setup
== v2-local
toolkit-v2 plugins loaded: toolkit 0.2.6, work 0.2.8, memory 0.2.6, session-skills 0.2.6, git-workflows 0.2.6
claude-toolkit plugins loaded: none
skills from toolkit-v2 plugins: 22: git-workflows:merge-and-clean-up, git-workflows:publish-docs, git-workflows:pull-latest, git-workflows:reset-to-remote, memory:memory-find, memory:memory-save, memory:memory-tidy, session-skills:braindump, session-skills:explain-simply, session-skills:handoff, session-skills:session-summary, session-skills:unslop, toolkit:project-setup, work:solution-design, work:work-check, work:work-decide, work:work-delegate, work:work-finish, work:work-on, work:work-organize, work:work-requirements, work:work-status
== v2-sf
toolkit-v2 plugins loaded: toolkit 0.2.6, work 0.2.8, memory 0.2.6, session-skills 0.2.6, git-workflows 0.2.6, sf-architect-solutioning 0.2.1
claude-toolkit plugins loaded: none
skills from toolkit-v2 plugins: 23: (the 22 above) + sf-architect-solutioning:sf-architect-solutioning
project skills: sf-component-tracker, sf-data-change, sf-deploy-check
```

In the plain folder three SessionStart hooks ran: Mike's voice hook and two
that printed nothing (exit 0). No V2 briefing appeared and no hook failed. In
`v2-local` the toolkit's hook printed the project briefing ("Project
briefing: Install Check Local (install-check-local), owner Test Owner. ...").

### Codex results

```
== plain, before the change
toolkit-v2 plugin skills: 0
claude-toolkit plugin skills: 31
== plain, after
toolkit-v2 plugin skills: 1: toolkit:project-setup
  (file: ~/.codex/plugins/cache/toolkit-v2/toolkit/0.2.6/skills/project-setup/SKILL.md)
claude-toolkit plugin skills: 31
== v2-local, trusted
toolkit-v2 plugin skills: 22 (the same 22 names as Claude Code)
claude-toolkit plugin skills: 0
== v2-sf, trusted
toolkit-v2 plugin skills: 23 (the 22 + sf-architect-solutioning:sf-architect-solutioning)
claude-toolkit plugin skills: 0
project skills in .agents/skills: 3: sf-component-tracker, sf-data-change, sf-deploy-check
```

Codex skill files load from `~/.codex/plugins/cache/toolkit-v2/<plugin>/<version>/`,
the installed copies.

## Findings

1. **Claude Code runs the V2 plugins from this repository folder, not from
   its cache.** For a marketplace added as a local folder, Claude Code loads
   each plugin in place. Evidence: the `init` event names each V2 plugin's
   path as `/Users/michaelrihm/Documents/Projects/toolkit-v2/plugins/<plugin>`,
   and inside a Claude Code session the `PATH` holds
   `/Users/michaelrihm/Documents/Projects/toolkit-v2/plugins/toolkit/bin`
   (the `claude-toolkit` plugins, from a GitHub marketplace, run from
   `~/.claude/plugins/cache/...`). The captured docs say the same:
   `ai-external-knowledge/claude-code/plugins-manifest-reference.md` line 178,
   "a plugin loaded in place from a marketplace added as a local directory".
   What this means:
   - Every Claude Code session on this Mac, in every folder, now loads the
     `toolkit` plugin's hooks and `project-setup` skill from the live working
     folder. Other agent sessions edit that folder, uncommitted changes
     included. A half-finished edit to a hook file reaches Mike's sessions at
     their next start. In V2 projects the same is true for all six plugins.
   - For Claude Code, a version raise is not what delivers a change; the
     change is live at once. Codex still runs its own copies, so the version
     rule still holds there.
   - The `toolkit` command in a Claude Code session is `~/.local/bin/toolkit`
     (it comes first on the `PATH`), which runs the Claude Code cache copy
     named in `plugin-root` (0.2.6, copied at 15:37). The hooks run the live
     folder. The two can differ after an edit in this folder.
   - `AGENTS.md` ("Versions": "Neither reads this folder in place") and
     `README.md` ("Both Claude Code and Codex run their own copy of each
     plugin") say otherwise and need correcting.
   Decision for Mike or the lead: keep it this way, or have Claude Code
   install from a fixed copy (for example a Git source instead of a
   `directory` source). The second option has not been tested.
2. Claude Code rewrites the whole `~/.claude/settings.json` when a plugin
   command writes to it: one unchanged line moved and a final newline was
   added. No value changed.
3. The V2 hooks in Codex still need Mike's trust in `/hooks`. Now that
   `toolkit` is on in every Codex folder, once he trusts them they run in
   every folder; outside a V2 project they print nothing.
4. `claude -p` in a folder Claude Code has not trusted ignores the project's
   `permissions.allow` entry ("Ignoring 1 permissions.allow entry from
   .claude/settings.json: this workspace has not been trusted"). Its
   `enabledPlugins` still apply. An interactive session asks for trust first.

## How to undo

- Claude Code: `claude plugin uninstall <plugin>@toolkit-v2 --scope user` for
  the six plugins, then `claude plugin marketplace remove toolkit-v2`. Or put
  back `install-backups/claude-settings.json` (copy it out of the scratch
  folder first if it is still wanted; that folder is temporary).
- Codex: set `enabled = false` under `[plugins."toolkit@toolkit-v2"]` in
  `~/.codex/config.toml`, or put back `install-backups/codex-config.toml`.
