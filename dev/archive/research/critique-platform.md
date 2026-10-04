# Platform critique of ARCHITECTURE.md (Claude Code and Codex)

Written 2026-09-26. Scope: whether `dev/ARCHITECTURE.md` uses Claude Code and
Codex correctly. Product choices in `dev/GOAL.md` are taken as fixed. Nothing
outside this file was changed.

Installed versions (Observed): Claude Code `2.1.280`, `codex-cli 0.157.0`,
Node `v25.8.1`.

Citation key:

- **CC:`file`#Section**: captured Claude Code docs,
  `claude-toolkit/ai-external-knowledge/claude-code/<file>` (captured 2026-09-22).
- **CX:`page`**: Codex docs, `https://learn.chatgpt.com/docs/<page>.md`
  (fetched 2026-09-26; `developers.openai.com/codex/*` redirects there).
- **CXP:`page`**: OpenAI plugin docs, `https://developers.openai.com/plugins/<page>.md`
  (fetched 2026-09-26).
- **PBP**: `dev/research/platform-best-practices.md`. **HS**: `dev/archive/research/hindsight.md`.
- **Observed**: read or run on this Mac on 2026-09-26.

---

## Summary

| ID | Severity | Topic | Fix in one line |
| --- | --- | --- | --- |
| P1 | Blocking | Hooks call `toolkit` by name | Call `node <plugin root>/bin/toolkit` in every hook command. |
| P2 | Blocking | `~/.local/bin/toolkit` symlink | Replace the symlink with a small wrapper file that reads a plugin-root pointer the hooks keep current. |
| P3 | Blocking | Codex sandbox blocks the CLI | Ship `.codex/rules/toolkit.rules` that lets `toolkit` run outside the sandbox; write `.codex/` files from outside Codex. |
| P4 | Blocking | Test runs load Mike's other plugins, rules, and hooks | `claude -p --setting-sources project,local --plugin-dir ...`; isolated `CODEX_HOME`; check the loaded-plugin list. |
| P5 | Important | Codex hook trust is missing from the plan | `--dangerously-bypass-hook-trust` for tests; Mike trusts once in `/hooks`; keep hook definitions stable. |
| P6 | Important | SessionStart size, matcher, wording | JSON `additionalContext`, `additionalContextLimit: 4000` in Codex, about 6,000 characters, add `fork` for Claude, factual wording. |
| P7 | Important | PostToolUse feedback and coverage | Use `additionalContext`, not `decision: "block"`, for normal feedback; check for changes at UserPromptSubmit and Stop too. |
| P8 | Important | Stop hook details | JSON or nothing; Codex turns `reason` into a user prompt; keep per-session state in the plugin data folder; the CLI records saves. |
| P9 | Important | Edit-tool inputs differ | Claude `tool_input.file_path`; Codex `apply_patch` patch text in `tool_input.command`; matchers `Write|Edit` and `^apply_patch$`. |
| P10 | Important | Rules and `AGENTS.md` | Always-on rules go in `AGENTS.md`; `.claude/rules/` only for path rules; no nested `AGENTS.md`; `doctor` checks the Claude gaps. |
| P11 | Important | Claude-only permission rules | Put the git and Salesforce denies in the PreToolUse `Bash` hook (both hosts), optionally `.codex/rules/` too. |
| P12 | Important | Output style shipping | Project file plus `outputStyle` in project settings; not a plugin style; voice section in `AGENTS.md` for Codex. |
| P13 | Important | Plugin agents do not exist in Codex | Delivery procedures as skills, or `.codex/agents/*.toml` written by init. |
| P14 | Important | Same-name plugins from claude-toolkit | Ship V2 plugins `defaultEnabled: false`; enable per project; turn off the colliding claude-toolkit plugins per project. |
| P15 | Important | Hindsight MCP entries | Exact `.mcp.json` and `.codex/config.toml` entries; read-only tools; approval; timeouts; trust. |
| P16 | Important | Isolated `CODEX_HOME` contents and auth | Needs `config.toml`, a login, and the installed plugins; do not copy `auth.json`; use a separate `codex login` or `CODEX_API_KEY`. |
| P17 | Minor | Codex marketplace and manifest fields | `policy`, `category`, `skills`, no `$schema`, version bumps. |
| P18 | Minor | `bin/toolkit` file format | Shebang, executable bit in Git, CommonJS entry that imports the ES modules. |
| P19 | Minor | Hook timeouts | Explicit `timeout` on every handler; Codex default is 600 s. |
| P20 | Minor | Project root inside hooks | Use `cwd` from the hook input and `git rev-parse`, not `CLAUDE_PROJECT_DIR`. |
| P21 | Minor | Skill frontmatter checklist | Name equals folder, shared-safe fields only, both manual-only switches. |
| P22 | Minor | Sample-run command details | `-p` ignores project allow rules; `codex exec` defaults to read-only; `/tmp` is `/private/tmp`. |
| P23 | Minor | Launchd label mismatch | `local.toolkit.hindsight` (plan) versus `local.toolkit-v2.hindsight` (PROGRESS.md). |

### What the plan already gets right

- Two marketplace files and two manifests per plugin, with a separate Codex
  hooks file named from `.codex-plugin/plugin.json` (PBP Part 0 items 1-3;
  CX:`hooks`#Plugin-bundled hooks: "If a manifest defines `hooks`, Codex uses
  those manifest entries instead of the default `hooks/hooks.json`").
- Exec form for Claude, shell strings for Codex, anchored regex matchers.
- No `CLAUDE.md` anywhere; native `AGENTS.md` needs 2.1.277 or later, and
  2.1.280 is installed (CC:`memory.md`#AGENTS.md).
- Every hook exits with no output when `.toolkit.json` is absent, so the
  plugins stay quiet in other repositories.
- Hindsight MCP for Codex goes in the project `.codex/config.toml`, not in the
  global file that `codex mcp add` writes (HS 12.2).
- `"autoMemoryEnabled": false` is the documented key (CC:`memory.md`#Enable or
  disable auto memory).
- `claude plugin validate` on the marketplace and on each plugin: validating
  only the marketplace does not open hook or skill files (PBP 2.5).
- Writing rules into each agent file, because subagents do not receive output
  styles (CC:`output-styles.md`#How output styles work).

### Where each requested check is answered

| Check | Findings |
| --- | --- |
| Plugin layout and manifests, both hosts | P13, P14, P17 |
| `bin/` PATH and the Codex machine-setup link | P1, P2, P18 |
| Hook events, matchers, output formats | P6, P7, P8, P9 |
| Exit codes and JSON decisions | P7, P8, P9 |
| Output size limits | P6 |
| Codex hook trust | P5 |
| `AGENTS.md`-only loading and its gaps | P10 |
| Path-scoped rules and how Codex learns them | P10 |
| Output style shipping | P12 |
| Skill frontmatter | P21 |
| Loading plugins for tests without changing Mike's setup | P4, P16, P22 |
| Hindsight MCP registration | P15 |
| Codex sandbox and permission parity (found during the review) | P3, P11 |

---

## Blocking

### P1. Hook commands must not call `toolkit` by bare name

**Plan.** Section 6: "One script entry, `toolkit hook <event>`, for both
hosts." Section 2: `bin/toolkit` is "on PATH in Claude Code".

**Problem.**

- Claude Code adds a plugin's `bin/` folder to "the Bash tool's `PATH`"
  (CC:`plugins-reference.md`#File locations reference; CC:`plugins.md` table).
  Hook processes are not the Bash tool, so a hook command `toolkit ...` is not
  found.
- Codex has no plugin `bin/` on any PATH. OpenAI's conversion guide lists
  `bin/` among Claude features to remove and says "Call bundled executables
  with package-relative paths" (CXP:`guides/submit-claude-plugin`).
- A hook that cannot start exits with a code like 127. Claude treats that as a
  non-blocking error and the action proceeds: "a mistyped path in
  `settings.json` leaves the gate silently disabled" (CC:`hooks.md`#Other exit
  codes). The generated-file guard and the stage-03 gate would both be off with
  no visible failure.

**Fix.** Claude `plugins/toolkit/hooks/hooks.json`, exec form (the docs'
own pattern, CC:`hooks.md`#Exec form and shell form):

```json
{
  "description": "Toolkit V2 runtime hooks for Claude Code",
  "hooks": {
    "SessionStart": [{ "matcher": "startup|resume|clear|compact|fork", "hooks": [
      { "type": "command", "command": "node", "timeout": 15,
        "args": ["${CLAUDE_PLUGIN_ROOT}/bin/toolkit", "hook", "session-start", "--host", "claude"] } ] }],
    "UserPromptSubmit": [{ "hooks": [
      { "type": "command", "command": "node", "timeout": 10,
        "args": ["${CLAUDE_PLUGIN_ROOT}/bin/toolkit", "hook", "user-prompt", "--host", "claude"] } ] }],
    "PreToolUse": [{ "matcher": "Write|Edit", "hooks": [
      { "type": "command", "command": "node", "timeout": 10,
        "args": ["${CLAUDE_PLUGIN_ROOT}/bin/toolkit", "hook", "pre-edit", "--host", "claude"] } ] }],
    "PostToolUse": [{ "matcher": "Write|Edit", "hooks": [
      { "type": "command", "command": "node", "timeout": 30,
        "args": ["${CLAUDE_PLUGIN_ROOT}/bin/toolkit", "hook", "post-edit", "--host", "claude"] } ] }],
    "Stop": [{ "hooks": [
      { "type": "command", "command": "node", "timeout": 15,
        "args": ["${CLAUDE_PLUGIN_ROOT}/bin/toolkit", "hook", "stop", "--host", "claude"] } ] }]
  }
}
```

Codex `plugins/toolkit/hooks/codex-hooks.json`, shell form with the
Codex-documented variable (CX:`hooks`#Plugin-bundled hooks: "`PLUGIN_ROOT` ...
points to the installed plugin root"), and no `$schema` key (P17):

```json
{
  "description": "Toolkit V2 runtime hooks for Codex",
  "hooks": {
    "SessionStart": [{ "matcher": "^(startup|resume|clear|compact)$", "hooks": [
      { "type": "command", "command": "node \"$PLUGIN_ROOT/bin/toolkit\" hook session-start --host codex",
        "timeout": 15, "additionalContextLimit": 4000, "statusMessage": "Loading project briefing" } ] }],
    "UserPromptSubmit": [{ "hooks": [
      { "type": "command", "command": "node \"$PLUGIN_ROOT/bin/toolkit\" hook user-prompt --host codex", "timeout": 10 } ] }],
    "PreToolUse": [{ "matcher": "^apply_patch$", "hooks": [
      { "type": "command", "command": "node \"$PLUGIN_ROOT/bin/toolkit\" hook pre-edit --host codex", "timeout": 10 } ] }],
    "PostToolUse": [{ "matcher": "^apply_patch$", "hooks": [
      { "type": "command", "command": "node \"$PLUGIN_ROOT/bin/toolkit\" hook post-edit --host codex", "timeout": 30 } ] }],
    "Stop": [{ "hooks": [
      { "type": "command", "command": "node \"$PLUGIN_ROOT/bin/toolkit\" hook stop --host codex", "timeout": 15 } ] }]
  }
}
```

and in `plugins/toolkit/.codex-plugin/plugin.json`:
`"hooks": "./hooks/codex-hooks.json"`.

Why `--host`: Codex also exports `CLAUDE_PLUGIN_ROOT` "for compatibility"
(CX:`hooks`#Plugin-bundled hooks), so environment variables cannot tell the
hosts apart, and the output rules differ (P7, P8). `turn_id` in the stdin JSON
is Codex-only and can serve as a second check.

### P2. The `~/.local/bin/toolkit` symlink breaks in Codex and shadows the plugin copy in Claude

**Plan.** Section 2: "`toolkit machine-setup` links `~/.local/bin/toolkit` to
the plugin's `bin/toolkit`."

**Problem.**

- Codex runs an installed copy under
  `~/.codex/plugins/cache/<marketplace>/<plugin>/<version>/` (CXP:`build/plugins`,
  "How local marketplaces work"). Observed: each plugin in that cache has one
  folder named by its manifest version (for example
  `~/.codex/plugins/cache/claude-toolkit/session-skills/1.14.1/`), so the
  previous folder is gone after a version change. Codex only picks up plugin
  changes after a version bump or reinstall (PBP 3.4), so during the build loop
  the link would break after almost every change.
- In Claude Code, `~/.local/bin` comes before the plugin `bin/` folders on the
  Bash tool's PATH. Observed from the Bash tool in this session:
  `/Users/michaelrihm/.local/bin` is the first entry, and plugin folders such as
  `~/.claude/plugins/cache/claude-toolkit/second-brain/4.17.0/bin` come after
  `/usr/bin`. A `~/.local/bin/toolkit` therefore replaces the plugin's own copy
  in Claude as well, so Claude hooks (plugin copy) and Claude's Bash commands
  (linked copy) can run different versions.

**Fix.** `toolkit machine-setup` writes `~/.local/bin/toolkit` as a regular
file, not a symlink:

```sh
#!/bin/sh
# Written by `toolkit machine-setup`. Runs the installed Toolkit V2 command.
root=$(cat "$HOME/.config/toolkit-v2/plugin-root" 2>/dev/null)
if [ ! -f "$root/bin/toolkit" ]; then
  echo "toolkit: plugin folder not found. Start a Claude Code or Codex session in a Toolkit V2 project, or run toolkit machine-setup." >&2
  exit 127
fi
exec node "$root/bin/toolkit" "$@"
```

- `toolkit hook session-start` writes its own plugin root (`$PLUGIN_ROOT` in
  Codex, `$CLAUDE_PLUGIN_ROOT` in Claude) into
  `~/.config/toolkit-v2/plugin-root` when the stored value differs. The pointer
  then always names an installed copy that exists.
- `toolkit --version` prints the version and the root it runs from;
  `toolkit doctor` warns when the Claude copy and the Codex copy report
  different versions.
- Keep the name `toolkit`: the Codex sandbox rule in P3 matches on the first
  word of the command.
- Check in the first real Codex session that the hook can write under
  `~/.config`; the Codex docs do not say whether hook processes run inside the
  command sandbox. If it cannot, keep the pointer in `$PLUGIN_DATA` and have the
  wrapper read both hosts' data folders.

### P3. The Codex sandbox blocks the `toolkit` command's network calls and some of its writes

**Plan.** Sections 4-7 and 9 have the agent run `toolkit` for Notion
(`ntn api`), Hindsight (HTTP to `127.0.0.1:8888`), the tracker in the main
checkout (found from a worktree with `git rev-parse --git-common-dir`), and
project init (which writes `.codex/config.toml`). The plan does not mention
the Codex sandbox.

**Problem.**

- "By default, `codex exec` runs in a read-only sandbox" (CX:`non-interactive-mode`).
- "The default `workspace-write` sandbox mode keeps network access turned off"
  (CX:`agent-approvals-security`#Network access). The page makes no exception
  for `127.0.0.1`, so the Hindsight and Notion drivers should be expected to
  fail when the agent runs them.
- In `workspace-write`, `<root>/.git`, `<root>/.agents`, and `<root>/.codex`
  are read-only, and for a worktree the resolved Git folder is read-only too
  (CX:`agent-approvals-security`#Protected paths in writable roots). Project
  init cannot write `.codex/config.toml`, `.codex/hooks.json`,
  `.codex/rules/`, or `.codex/agents/` from inside a Codex session without an
  approval.
- From a linked worktree, the main checkout's `.work-items/` and `.memory/`
  are outside the writable root.

**Fix.**

1. Project init writes `.codex/rules/toolkit.rules`. A matching `allow` rule
   means "Run the command outside the sandbox without prompting", and project
   rules load when the project is trusted (CX:`agent-configuration/rules`).
   Rules are marked experimental there.

   ```python
   prefix_rule(
       pattern = ["toolkit"],
       decision = "allow",
       justification = "Toolkit V2 command: updates the tracker and memory in the main checkout and calls Notion and the local Hindsight server.",
       match = ["toolkit work sync", "toolkit memory find billing"],
   )
   ```

   Test it with
   `codex execpolicy check --pretty --rules .codex/rules/toolkit.rules -- toolkit work sync`.
   This works only if the agent types `toolkit ...`, which is another reason
   for the wrapper in P2. Codex applies rules per command only when the shell
   line is a plain chain; a line with `$(...)`, redirects, or variables is
   matched as one `bash -lc` call (CX:`agent-configuration/rules`#Shell wrappers),
   so skills should show `toolkit` commands on their own line.
2. Write every `.codex/` file from outside the Codex sandbox: from Claude, from
   the harness shell before a `codex exec` run, or, in an interactive Codex
   session, after Mike approves the escalation. Say this in the `project-init`
   skill.
3. Narrower alternatives if Mike does not want an `allow` rule: `--add-dir
   <main checkout>` (extra writable root) and
   `[sandbox_workspace_write] network_access = true` in the project
   `.codex/config.toml`. Neither lifts the `.codex/` and `.git` protection, and
   the second opens the network to every command.

### P4. Test runs are not isolated from Mike's installed plugins, rules, and hooks

**Plan.** Section 10: "Plugins are loaded for tests with `--plugin-dir`
(Claude) and an isolated `CODEX_HOME` (Codex), so Mike's installed plugins are
not changed."

**Problem.** Not changed is true; not loaded is not.

- "When a `--plugin-dir` plugin has the same name as an installed marketplace
  plugin, the local copy takes precedence for that session"
  (CC:`plugins.md`#Test your plugins locally). Only same-named plugins are
  replaced. Observed in `~/.claude/settings.json`: 16 plugins enabled, including
  `project-init@claude-toolkit` (skills named `project-init` and
  `project-sync`, the same names as the V2 `toolkit` plugin's skills),
  `second-brain`, `work-tracker`, `system-guide`, and `hooks-library`. Their
  skills, hooks, and SessionStart text would be present in every sample run.
- User-level instructions also load: `~/.claude/CLAUDE.md` and
  `~/.claude/rules/*.md` (for example the rule that tells agents to work in
  their own worktree), and the user `outputStyle`.
- Codex: `~/.codex/config.toml` enables `project-init@claude-toolkit`,
  `second-brain@claude-toolkit`, and others, and `~/.codex/hooks.json` holds
  user hooks (Observed). An isolated `CODEX_HOME` removes these (P16).

**Fix (Claude).**

```sh
cd "$RUN_DIR"          # a git repository created for the run
claude -p "<prompt>" \
  --setting-sources project,local \
  --plugin-dir /Users/michaelrihm/Documents/Projects/toolkit-v2/plugins \
  --permission-mode acceptEdits \
  --allowedTools "Bash(toolkit *)" "Bash(git *)" "Bash(node *)" \
  --output-format stream-json --verbose > "$RUN_DIR/claude-events.jsonl"
```

- Leaving `user` out of `--setting-sources` skips user settings (including
  `enabledPlugins`, hooks, and `outputStyle`), `~/.claude/CLAUDE.md`, and
  `~/.claude/rules/` (CC:`agent-sdk-claude-code-features.md`#Project
  instructions; CC:`plugins-reference.md`#User configuration: "The only source
  you can remove from this list is user settings").
- `~/.claude.json` is always read, so Mike's user-scope MCP servers still load
  (CC:`agent-sdk-claude-code-features.md`#What settingSources does not control).
  Add `--strict-mcp-config --mcp-config ./.mcp.json` for a run that must see
  only Hindsight.
- A folder of plugins in `--plugin-dir` needs 2.1.265 or later
  (CC:`plugins.md`#Test your plugins locally).
- Assert on the `system/init` event: `plugins` lists only the V2 plugins, and
  there is no `plugin_errors` key (CC:`headless.md`#Fail CI when a plugin or
  MCP server doesn't load). Save that event in `dev/test-runs/<run>/` as
  evidence.
- The allow-tools list is needed because project `permissions.allow` rules are
  not used in a `-p` run in a folder that was never trusted (P22).

**Fix (Codex).** Isolated `CODEX_HOME` as set out in P16, and record that
`$HOME/.agents/skills` still loads, because it is not under `CODEX_HOME`
(CX:`build-skills`#Where Codex loads local skills). Observed: it contains one
skill, `neon-postgres`.

---

## Important

### P5. Codex hook trust is missing from the plan

**Problem.** "Installing or enabling a plugin doesn't automatically trust its
hooks; Codex skips plugin-bundled hooks until you review and trust the current
hook definition" (CX:`hooks`#Plugin-bundled hooks). "Codex records trust
against the hook's current hash, so new or changed hooks are marked for review
and skipped until trusted" (CX:`hooks`#Review and trust hooks). Without trust,
none of the V2 hooks run in Codex, and finish item 6 ("seen running in a real
Codex session") fails.

**Fix.**

- Automated runs: `codex exec --dangerously-bypass-hook-trust ...` "to run
  enabled hooks without requiring persisted hook trust for that invocation"
  (CX:`hooks`#Review and trust hooks).
- Real-session proof: Mike opens `/hooks` in Codex once and trusts the five
  toolkit hooks. This writes to his `~/.codex/config.toml`, so it is his step;
  add it to the report's action list.
- Keep hook definitions stable so trust survives updates. Observed trust keys
  in `~/.codex/config.toml` include the source, event, and position, for
  example `[hooks.state."browser@openai-bundled:plugin.json#hooks[0]:stop:0:0"]`
  with a `trusted_hash`. So: keep the literal `$PLUGIN_ROOT` in the command
  string (never an expanded path), do not reorder handlers, and add new
  handlers at the end.
- `toolkit doctor` in Codex can report whether `[hooks.state."toolkit@toolkit-v2:...`
  entries exist; Codex itself prints a startup warning when hooks need review.

### P6. SessionStart: size limit, matcher, and wording

**Plan.** "SessionStart (startup, resume, clear, compact) ... Under 9,000
characters", including "read AGENTS.md if it is not in your context".

**Problems and fixes.**

- **Codex size.** "By default, Codex limits each model-visible hook-output
  message to roughly 2,500 tokens"; larger output is saved to a file and the
  model sees a head-and-tail preview (CX:`hooks`#Large hook output). Nine
  thousand characters of IDs, paths, and tables can pass 2,500 tokens. Return
  JSON `{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"..."}}`,
  set `"additionalContextLimit": 4000` on the Codex handler, and keep the
  briefing near 6,000 characters. `additionalContextLimit` "applies only to
  `additionalContext`", so do not rely on plain stdout in Codex.
- **Claude size.** Each `additionalContext` string is capped at 10,000
  characters; above that Claude gets a file path and a 2,000-character preview
  and "Claude Code doesn't ask it to" read the file (CC:`hooks.md`#Add context
  for Claude). The plan fits, but other SessionStart hooks add to the same
  context, so the 6,000-character target is safer in both hosts.
- **Matcher.** Claude has a fifth source, `fork` (`--fork-session`, `/fork`,
  `/branch`) (CC:`hooks.md`#SessionStart). Claude matcher:
  `startup|resume|clear|compact|fork`. Codex has only
  `startup`, `resume`, `clear`, `compact` (CX:`hooks`#Matcher patterns).
- **Wording.** "Write the text as factual statements rather than imperative
  system instructions ... Text framed as out-of-band system commands can
  trigger Claude's prompt-injection defenses" (CC:`hooks.md`#Add context for
  Claude). Replace "read AGENTS.md if it is not in your context" with a fact:
  "Project manual: /abs/path/AGENTS.md." Never print the contents of
  `AGENTS.md`: once Claude reads it natively, "the hook adds a second copy to
  the context" (CC:`memory.md`#Remove an earlier AGENTS.md workaround).

### P7. PostToolUse: feedback shape and what it cannot see

**Plan.** "After a work item record changes: runs `toolkit work sync` for it,
and feeds back any validation error or gate violation."

**Problem 1: the two hosts treat `decision: "block"` differently.**

- Claude: `"block"` "adds the `reason` next to the tool result. Claude still
  sees the original output" (CC:`hooks.md`#PostToolUse decision control).
- Codex: Codex "replaces the tool result with that feedback, and continues the
  model from the hook-provided message" (CX:`hooks`#PostToolUse). The model no
  longer sees that the patch was applied.

**Fix.** For normal feedback ("WI-003 was rewritten by the toolkit: status set
to In Progress"), return only:

```json
{ "hookSpecificOutput": { "hookEventName": "PostToolUse", "additionalContext": "..." } }
```

This behaves the same in both hosts. Use `decision: "block"` only for a gate
violation, and write `reason` so it is still true when it replaces the tool
result, for example: "The edit to WI-003 was saved. WI-003 is a build item at
stage 05 with no requirements approval. Run `toolkit work set WI-003 --stage
03-requirements-approved` or record the approval." When the sync rewrites the
file just edited, say so in the message; Claude allows an edit to a file that
changed after it was read only when `old_string` still matches
(CC:`tools-reference.md`, Edit tool behavior).

**Problem 2: edits the hook never sees.** PostToolUse on `Write|Edit` or
`apply_patch` does not fire when a shell command or an outside process changes
the file (PBP 2.7, from CC:`hooks.md`#PostToolUse). That covers `mv`, `sed -i`,
and `cat >` from the agent, Mike moving folders in Finder, and edits in Notion.
Codex agents often edit through the shell.

**Fix.** Run a cheap change check (compare `.work-items/` paths and
modification times with `.toolkit-state.json`) in the `user-prompt` and `stop`
hooks, and run `toolkit work sync` only when something changed. Claude-only
option: SessionStart can return `watchPaths` for `FileChanged` events
(CC:`hooks.md`#SessionStart decision control); confirm that a folder path is
accepted before relying on it.

### P8. Stop hook details

**Plan.** "Once per session: if the owner asked to remember something and no
memory save happened, or a changed work item fails validation, blocks one time
with the reason. Otherwise silent."

**Problems and fixes.**

- **Output.** Codex: "`Stop` expects JSON on `stdout` when it exits `0`. Plain
  text output is invalid" (CX:`hooks`#Stop). Print nothing, or exactly one JSON
  object. The shared form is `{"decision":"block","reason":"..."}`. Claude
  prefers `hookSpecificOutput.additionalContext` for "working as designed"
  feedback, which shows as "Stop hook feedback" rather than a hook error
  (CC:`hooks.md`#Stop decision control), but Codex's Stop section documents no
  `additionalContext`; use `--host` (P1) to pick the form.
- **Codex turns `reason` into a user prompt.** "`decision: "block"` ... creates
  a new continuation prompt that acts as a new user prompt, using your `reason`
  as that prompt text" (CX:`hooks`#Stop). The docs do not say whether that
  prompt passes through UserPromptSubmit. Keep the trigger words ("remember",
  "from now on", "always", "never", "don't ever") out of `reason`, and have
  the `user-prompt` hook ignore a prompt equal to the last Stop reason, so the
  two hooks cannot feed each other.
- **Loop guard.** Exit 0 with no output when `stop_hook_active` is `true`
  (both hosts). Claude ends the turn after 8 consecutive blocks
  (CC:`hooks.md`#Stop input).
- **"Once per session" needs state.** Store `{session_id: {...}}` in the plugin
  data folder: `$CLAUDE_PLUGIN_DATA` (`~/.claude/plugins/data/<id>/`,
  CC:`plugins-reference.md`#Persistent data directory) or `$PLUGIN_DATA`
  (CX:`hooks`#Plugin-bundled hooks). Codex subagent hooks receive the parent's
  `session_id` (CX:`hooks`#Common input fields), which is what this needs.
- **"No memory save happened" needs a signal.** The Stop hook sees neither the
  Bash commands nor the CLI. Claude's `transcript_path` can lag at Stop time
  (CC:`hooks.md`#Stop input), and Codex's transcript format "isn't a stable
  interface for hooks" (CX:`hooks`#Common input fields). Have `toolkit memory
  save` write a last-save time into the project state, have the `user-prompt`
  hook record the time a trigger phrase was seen, and let Stop compare the two.
  If agents may save through Hindsight MCP, add a PostToolUse matcher for
  `mcp__hindsight__.*`; P15 recommends not allowing MCP writes at all.

### P9. Edit-tool input differs between the hosts

**Plan.** "PreToolUse (Write, Edit, apply_patch)" and "PostToolUse (Write,
Edit, apply_patch)".

- **Claude.** Matcher `Write|Edit` (an exact list; `MultiEdit` is legacy,
  CC:`permissions.md`). Input has an absolute `tool_input.file_path`
  (CC:`hooks.md`#PreToolUse input).
- **Codex.** Matcher `^apply_patch$` (Codex also accepts `Edit` or `Write` as
  aliases). "Hook input still reports `tool_name: "apply_patch"`", and
  "`Bash` and `apply_patch` use `tool_input.command`" (CX:`hooks`#PreToolUse).
  There is no `file_path`; one patch can change several files. Read the file
  names from the patch headers (`*** Add File: `, `*** Update File: `,
  `*** Delete File: `, `*** Move to: `), relative to the session `cwd`. The
  header format is not in the hooks page, so capture real Codex inputs as test
  fixtures first (the plan's section 10 already plans recorded inputs).
- **Deny output that works in both:**

  ```json
  { "hookSpecificOutput": { "hookEventName": "PreToolUse", "permissionDecision": "deny",
      "permissionDecisionReason": "DASHBOARD.md is generated. Run `toolkit work sync` instead." } }
  ```

  Exit 2 with the reason on stderr also works in both. Never return
  `permissionDecision: "ask"`, `continue`, `stopReason`, or `suppressOutput`
  from PreToolUse: Codex "marks the hook run as failed, reports the error, and
  continues the tool call" (CX:`hooks`#PreToolUse).
- **Limits.** A timed-out Claude hook renders no decision
  (CC:`hooks.md`#Timeouts), so the pre-edit hook must stay fast (no network).
  Codex: "Treat tool hooks as a useful guardrail, not a complete enforcement
  boundary" (CX:`hooks`#Tool coverage). Shell writes to generated files are not
  caught; the next `toolkit work sync` regenerates them, which is acceptable.

### P10. Rules and `AGENTS.md`

**Plan.** Section 9: `AGENTS.md` is generated, and "its Rules section and path
table are generated from the rule files' frontmatter."

**Problem 1: unscoped rules never reach Codex.** Codex reads `AGENTS.md` from
the project root down to the working directory and nothing under
`.claude/rules/` (captured Codex `agents-md.md`; PBP 3.1). A line in
`AGENTS.md` saying "read `.claude/rules/x.md`" is a request the model may
skip.

**Fix.** Put the text of every always-on rule in `AGENTS.md` itself, which both
hosts load at session start. Keep `.claude/rules/` only for path-scoped rules.
Budgets: Codex stops adding instruction files at `project_doc_max_bytes`,
32 KiB by default, spent root first (captured `agents-md.md`); Claude advises
"under 200 lines" per instruction file (CC:`memory.md`#Write effective
instructions). Have `toolkit doctor` fail when the generated `AGENTS.md` passes
about 24 KiB.

**Problem 2: path-scoped rules have gaps in Claude too.** They load "when
Claude reads files matching the pattern, not on every tool use"
(CC:`memory.md`#Path-specific rules), and after compaction they return only on
the next matching Read (PBP 2.8, from CC:`context-window.md`). A file created
with Write, or changed through `toolkit` in Bash, does not load the rule.
Work items and memory change through the CLI, so a rule scoped to
`.work-items/**` or `.memory/**` would almost never load.

**Fix.** Guidance about files the CLI writes belongs in the skill or in the
CLI's own messages, not in a path rule. Optional, and it serves both hosts:
the `pre-edit` hook adds one line of `additionalContext` ("Rule
.claude/rules/salesforce-safety.md applies to force-app/main/...") when an
edited path matches a rule's `paths` globs. That gives Codex the path scoping it
otherwise lacks. The path table in `AGENTS.md` stays as the fallback for Codex.

**Problem 3: nested `AGENTS.md` files.** The model project has
`.memory/AGENTS.md` (3,387 bytes), `requirements/AGENTS.md`, and
`docs/AGENTS.md` (Observed). Codex "stops searching once it reaches your
current directory" (captured `agents-md.md`), so it reads them only when
started inside those folders. Claude reads a subfolder's `AGENTS.md` only when
the Read tool opens a file there (CC:`memory.md`#When Claude Code reads
AGENTS.md). **Fix:** the scaffold has one root `AGENTS.md`; move any needed
lines into it or into the matching skill.

**Problem 4: known gaps in Claude's native `AGENTS.md` reading.** Claude reads
only `CLAUDE.md` in these sessions (CC:`memory.md`#When AGENTS.md support is
unavailable; CC:`env-vars.md`#Features that need feature-flag fetching):

- the first session after installing or upgrading Claude Code;
- when `DISABLE_GROWTHBOOK`, `DISABLE_TELEMETRY`, `DO_NOT_TRACK`, or
  `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` is set;
- third-party providers (Bedrock and others);
- `disableAllHooks` or `allowManagedHooksOnly`, or the built-in `agents-md`
  plugin turned off.

A `CLAUDE.md`, `.claude/CLAUDE.md`, or `CLAUDE.local.md` in the working folder
or any parent also stops it (CC:`memory.md`#When Claude Code reads AGENTS.md).
Observed: none of the four variables is set in the shell or in
`~/.claude/settings.json` `env`, and `disableAllHooks` is not set. **Fix:**
`toolkit doctor` checks the four variables, `disableAllHooks` in each settings
file, and any of the three `CLAUDE*.md` names from the project up to `/`. The
SessionStart hook cannot detect the gap, because `InstructionsLoaded` does not
fire for a natively read `AGENTS.md` (CC:`memory.md`#Where AGENTS.md differs
from CLAUDE.md).

### P11. The permission rules in `.claude/settings.json` do nothing in Codex

**Plan.** Section 9: `.claude/settings.json` gets "general fragment plus the
Salesforce fragment". The model's fragment has `permissions.deny` (`git add -A`,
`git add .`, `git commit -a`, `--no-verify`, force pushes, `sf org delete`, and
others) and `permissions.ask` (`sf project deploy start`, `sf data *`,
`sf apex run`). Codex does not read `.claude/settings.json`.

**Fix.**

- Put these checks in the PreToolUse `Bash` hook, which runs in both hosts
  (Claude matcher `Bash`, Codex `^Bash$`), and deny with the JSON in P9. The
  model's Salesforce guards are already PreToolUse `Bash` hooks, so extend them
  rather than add a new mechanism. Keep the Claude deny list as the first layer.
- Codex's native counterpart is `.codex/rules/*.rules` with
  `decision = "forbidden"` or `"prompt"` (CX:`agent-configuration/rules`). It
  matches an exact argument prefix, so `git push origin main --force` does not
  match `pattern = ["git", "push", "--force"]`. Claude's rules use
  `Bash(git push * --force)` for that case. The hook handles any argument order;
  treat `.codex/rules` as optional here.
- There is no Codex equivalent of Claude's `ask` for a hook: returning `ask`
  from PreToolUse fails the hook in Codex (P9). For Codex, `prompt` in a
  `.codex/rules` file is the only documented way to ask Mike before
  `sf project deploy start`.

### P12. Ship the output style as a project file, not a plugin style

**Plan.** Section 2 puts `output-styles/plain-english.md` in the `toolkit`
plugin. Section 9 does not set `outputStyle`. GOAL item 3 says project init
"installs ... the Plain English output style".

**Problem.**

- A plugin style is selected by name, and whether that name is namespaced is
  not documented (PBP Part 6, open question 2).
- `force-for-plugin: true` applies the style "whenever the plugin is enabled"
  and "Overrides the user's `outputStyle` setting" (CC:`output-styles.md`#Frontmatter).
  With the plugin enabled for the whole machine, every repository would get it,
  which contradicts the plan's rule that the plugins stay quiet outside V2
  projects.
- Observed: Mike already has `~/.claude/output-styles/plain-english.md` with
  `name: Plain English` and different text, and user `outputStyle: "Plain English"`.
  The docs only say that among nested project folders "the one closest to the
  working directory" wins (CC:`output-styles.md`); which of the user, project,
  and plugin copies wins when all three use the same name is not documented.

**Fix.**

- Project init copies `templates/output-styles/plain-english.md` to
  `<project>/.claude/output-styles/plain-english.md` (frontmatter `name`,
  `description`, `keep-coding-instructions: true`) and sets
  `"outputStyle": "<that name>"` in the project's `.claude/settings.json`. This
  is the setup the current toolkit and the model project use and that works on
  this Mac (PBP 2.9).
- Remove `output-styles/` from the plugin. If it stays, never set
  `force-for-plugin`.
- Either give the V2 style a distinct `name` (for example
  `Plain English (Toolkit V2)`) and use that exact string in `outputStyle`, or
  keep `Plain English` and confirm with `/output-style` in a real session which
  file's text is active.
- Style files are read at startup; an edit needs a restart
  (CC:`output-styles.md`).
- Codex has no output styles (PBP 3.6); OpenAI's guide says to move
  `outputStyles` behavior into instructions (CXP:`guides/submit-claude-plugin`).
  The generated `AGENTS.md` needs a short "How to write replies" section (about
  15 lines) that both hosts read.

### P13. Plugin agents do not exist in Codex

**Plan.** Section 2: `work/` holds "orchestration skills for work items +
delivery agents". Section 8: "Plain English rules are stated in each agent
file, because subagents and Codex do not get output styles."

**Problem.** Codex plugins do not ship `agents/`: "Convert reusable behavior to
skills" (CXP:`guides/submit-claude-plugin`). Codex custom agents are TOML files
in `~/.codex/agents/` or the project's `.codex/agents/`, with required `name`,
`description`, and `developer_instructions` (CX:`agent-configuration/subagents`#Custom
agents). Claude plugin agents also cannot use `hooks`, `mcpServers`, or
`permissionMode` (CC:`plugins-reference.md`#Agents).

**Fix.** Recommended: write each delivery procedure as a skill, which both
hosts load, and keep each Claude `agents/*.md` file short: its role, its
writing rules, and "follow the `<skill>` skill". If real Codex agents are
wanted, project init generates `.codex/agents/<name>.toml` from the same source
text, written from outside the Codex sandbox (P3). Section 8's sentence should
say agent files carry the writing rules for Claude subagents, and `AGENTS.md`
carries them for Codex.

### P14. Same-name plugins from `claude-toolkit` collide with the V2 ports

**Problem.** Both marketplaces ship plugins named `session-skills`,
`git-workflows`, and `sf-architect-solutioning`, and both ship skills named
`project-init` and `project-sync`. Observed: the `claude-toolkit` copies are
enabled for all projects in Claude (`~/.claude/settings.json`) and in Codex
(`~/.codex/config.toml`). In Codex, "If two skills share the same `name`,
Codex doesn't merge them; both can appear" (CX:`build-skills`). Claude uses the
plugin name as the skill namespace; what it does when two enabled plugins from
different marketplaces share a name is not documented. The plan's
`"toolkit": "toolkit-v2"` key protects hooks, not skills. The same problem
applies in reverse: V2 plugins enabled for the whole machine appear in Mike's
current-toolkit projects.

**Fix.**

- Set `"defaultEnabled": false` in each V2 `.claude-plugin/plugin.json` (or on
  the marketplace entry, which takes precedence) so the plugins install
  switched off (CC:`plugins-reference.md`#Default enablement;
  CC:`plugin-marketplaces.md`#Plugin entries).
- Project init writes `enabledPlugins` into the project `.claude/settings.json`:
  `true` for the V2 plugins the project uses, and `false` for at least
  `session-skills@claude-toolkit`, `git-workflows@claude-toolkit`,
  `sf-architect-solutioning@claude-toolkit`, and `project-init@claude-toolkit`.
  Project settings take precedence over user settings for `enabledPlugins`
  (PBP 2.11). The model project already does this for
  `second-brain@claude-toolkit`.
- Codex: project `.codex/config.toml` gets
  `[plugins."toolkit@toolkit-v2"] enabled = true` and
  `[plugins."session-skills@claude-toolkit"] enabled = false` (and the same for
  the others). "Trusted-project settings can override user, cloud-managed, and
  system defaults" (CX:`config-file/config-reference`, `plugins.<plugin>.enabled`).
  `codex plugin add` enables a plugin in the user config; `toolkit
  machine-setup` would set the V2 entries to `enabled = false` there, with
  Mike's approval, because that changes his Codex config.
- Alternative: rename the ported plugins (for example `v2-session-skills`).
  That removes the collision without per-project settings, but changes names
  Mike knows.

### P15. Hindsight MCP registration

**Plan.** Section 7: "Project `.mcp.json` points Claude Code at the bank's MCP
URL for free-text recall." Section 9: "`.codex/config.toml` gets the Hindsight
MCP entry." Section 7 also says the main agent writes memory through the CLI.

**Exact entries.**

Claude, `<project>/.mcp.json` (`type` is required; HS 12.1 from
CC:`mcp.md`#Project scope; per-server `timeout` in milliseconds, CC:`mcp.md`):

```json
{
  "mcpServers": {
    "hindsight": { "type": "http", "url": "http://127.0.0.1:8888/mcp/<bank>/", "timeout": 300000 }
  }
}
```

Codex, `<project>/.codex/config.toml` (CX:`config-file/config-reference`,
`mcp_servers.<id>.*`; the default tool timeout is 60 s):

```toml
[mcp_servers.hindsight]
url = "http://127.0.0.1:8888/mcp/<bank>/"
startup_timeout_sec = 20
tool_timeout_sec = 300
enabled_tools = ["recall", "reflect", "list_documents", "get_document"]
```

**Gaps and fixes.**

- **Writes that skip the approval policy.** The bank's MCP endpoint exposes
  `retain`, `sync_retain`, `delete_document`, `clear_memories`, and
  `delete_bank`, and the `retain` and `recall` descriptions say "Use this tool
  PROACTIVELY" (HS 11). Give agents read-only tools. Server side, which covers
  both hosts: `toolkit hindsight ensure-bank` sets the bank config
  `mcp_enabled_tools` to `["recall", "reflect", "list_documents", "get_document"]`
  (HS 11, verified: other tools then return "Unknown tool"). Also Codex
  `enabled_tools` as above, and in the project `.claude/settings.json`
  `"permissions": { "deny": ["mcp__hindsight__retain", "mcp__hindsight__sync_retain", "mcp__hindsight__delete_document"] }`.
- **Claude approval.** Interactive sessions ask once before using a project
  `.mcp.json` server (CC:`mcp.md`#Project scope). Project init can pre-approve
  in the Git-ignored `.claude/settings.local.json`:
  `{ "enabledMcpjsonServers": ["hindsight"] }`. It takes effect after the
  folder is trusted; a committed approval "is ignored in an untrusted folder"
  (CC:`mcp.md`, project server approvals). `claude -p` runs connect without
  asking (CC:`permissions.md`#What runs before you trust a folder).
- **Codex trust.** "Untrusted projects skip project-scoped `.codex/` layers,
  including project-local config, hooks, and rules"
  (CX:`config-file/config-reference`, `projects.<path>.trust_level`). The MCP
  entry, the project hooks, and the rules in P3 and P11 all depend on Mike
  trusting the project the first time Codex opens it. `toolkit doctor` should
  say so.
- Use the name `hindsight` in one scope only (HS 12.1), and never
  `codex mcp add`, which writes the global file (HS 12.2).

### P16. Isolated `CODEX_HOME`: what it needs, and how to sign in

**What the folder needs.** Use a fixed folder outside the repository and
`/tmp`, kept between runs, for example `~/.codex-tkv2-test` (mode `700`).

1. `config.toml`, written by hand:

   ```toml
   model = "gpt-6-sol"                  # same values as lines 1-2 of ~/.codex/config.toml
   model_reasoning_effort = "high"
   cli_auth_credentials_store = "file"

   [projects."/private/tmp/tkv2-run-a"]  # the real path of each run folder
   trust_level = "trusted"
   ```

2. The marketplace and plugin entries and the plugin cache, written by the
   CLI with the variable set:

   ```sh
   export CODEX_HOME="$HOME/.codex-tkv2-test"
   codex plugin marketplace add /Users/michaelrihm/Documents/Projects/toolkit-v2
   codex plugin add toolkit@toolkit-v2      # and work, memory, session-skills, git-workflows, sf-architect-solutioning
   ```

   These add `[marketplaces.toolkit-v2]`, the `[plugins."<name>@toolkit-v2"]`
   tables, and `$CODEX_HOME/plugins/cache/toolkit-v2/...` (PBP 3.4). Repeat
   `codex plugin add` after each version bump (P17).
3. A sign-in (below). Codex creates everything else (sessions, logs, state
   databases) on first run. Do not copy `hooks.json`, `AGENTS.md`, `rules/`,
   or plugin tables from Mike's `~/.codex`; leaving them out is the point.
4. Hook trust: pass `--dangerously-bypass-hook-trust` on each run (P5).

A run then looks like:

```sh
CODEX_HOME="$HOME/.codex-tkv2-test" codex exec --json \
  --sandbox workspace-write --dangerously-bypass-hook-trust \
  -C /private/tmp/tkv2-run-a "<prompt>" > events.jsonl
```

**Is copying `auth.json` required? No, and it is not the safe choice.**

- OpenAI's guide for reusing `auth.json` elsewhere lists as a condition: "only
  one machine or serialized job stream will use a given `auth.json` copy"
  (CX:`auth/ci-cd-auth`#When to use this). Codex refreshes the tokens when
  `last_refresh` is older than about 8 days, and after a `401`, and writes the
  new tokens back into that copy (same page, "Why this works").
- Mike's `~/.codex/auth.json` is in live use: "The CLI and extension share the
  same cached login details" (CX:`auth`#Login caching), and Observed: the file
  exists with mode `600`, so his login uses file storage. A copy in the test
  folder, used while his own sessions keep running, breaks that condition. The
  two copies can refresh at different times, and one of them can end up holding
  a refresh token that no longer works, which could sign Mike out of his normal
  Codex. The docs do not describe this failure step by step; it follows from
  the single-copy condition.
- A copy also puts a password-equivalent file in a second place ("Treat
  `~/.codex/auth.json` like a password", CX:`auth`#Credential storage).

**Safer options, both documented.**

- **Recommended:** Mike signs in once for the test folder:
  `CODEX_HOME="$HOME/.codex-tkv2-test" codex login` (browser), or
  `codex login --device-auth` (CX:`auth`#Login on headless devices). That
  creates a separate login whose `auth.json` exists only in the test folder, and
  Codex refreshes it there. This is a login, so it is Mike's step.
- **Alternative:** no `auth.json` at all. `CODEX_API_KEY=<key> codex exec ...`
  works with `codex exec` (CX:`non-interactive-mode`#Use API key auth). It
  bills at API rates instead of Mike's ChatGPT plan, so it is Mike's decision.

Not recommended: a symlink from the test folder's `auth.json` to Mike's. The
docs do not say whether Codex rewrites the file in place or replaces it, so the
link may turn into a copy on the first refresh.

---

## Minor

### P17. Codex marketplace and manifest fields

- Each entry in `.agents/plugins/marketplace.json` needs
  `"policy": { "installation": "AVAILABLE", "authentication": "ON_INSTALL" }`
  and `"category"`: "Always include `policy.installation`,
  `policy.authentication`, and `category`" (PBP 3.4, from CXP:`build/plugins`).
  `source` is `{ "source": "local", "path": "./plugins/<name>" }`, relative to
  the repository root.
- `.codex-plugin/plugin.json`: `name` and `version` equal to the Claude
  manifest, `"skills": "./skills/"`, an `interface` block, and for `toolkit`
  the `hooks` path from P1 (PBP 3.4).
- No `$schema` in `codex-hooks.json`: Codex allows only `description` and
  `hooks` at the top level (PBP 3.3, from the Codex source).
- Codex runs a cached copy stored under the manifest version (Observed), so bump
  `version` in both manifests and run `codex plugin add` again for Codex to see
  a change. Claude loads a relative-path plugin from a local-directory
  marketplace in place, with no bump needed
  (CC:`plugins-reference.md`#Plugin caching and file resolution).

### P18. `bin/toolkit` file format

- First line `#!/usr/bin/env node`; executable bit recorded in Git
  (`git update-index --chmod=+x plugins/toolkit/bin/toolkit`). Observed: the
  Codex cache keeps executable bits (`-rwxr-xr-x` on copied `.mjs` hooks).
  Hooks call it through `node`, so they do not depend on the bit; Claude's Bash
  PATH use does.
- How Node decides the module type of a file with no extension changed across
  versions. Observed on Node 25.8.1: an extensionless file with `import`
  statements runs as an ES module. Node 20, the plan's minimum, treats such a
  file as CommonJS unless flags or a `package.json` `"type"` say otherwise
  (from Node's release history; not tested here). Keep `bin/toolkit` a few
  lines of CommonJS that run `import("../lib/cli.mjs")`; that form runs on
  both (Observed on 25.8.1).
- No `package.json` with a lockfile at the plugin root unless dependencies are
  wanted: Claude runs `npm ci --ignore-scripts` when it copies a plugin that has
  both (PBP 2.1).

### P19. Hook timeouts

Codex uses 600 seconds for most hooks when `timeout` is omitted
(CX:`hooks`#Config shape); Claude's default is also 600 seconds, 30 on
UserPromptSubmit (PBP 2.7). A stuck Notion or Hindsight call in a hook would
hold the session for ten minutes. Set `timeout` on every handler (P1 values:
10-30 seconds), keep network calls out of `pre-edit`, and add `statusMessage`
where a wait is visible. Claude-only option: the handler `if` field (permission
rule syntax, for example `"Edit(.work-items/**)"`) avoids starting Node for
every edit in every repository (CC:`hooks.md`#Matcher patterns).

### P20. Finding the project root inside a hook

"Every hook exits silently ... when `.toolkit.json` is missing." Find it from
the `cwd` field in the stdin JSON, then `git rev-parse --show-toplevel`.
`CLAUDE_PROJECT_DIR` is the folder where the session started and does not
follow Claude into a worktree (PBP 2.7); Codex documents no project-root
variable and runs hooks "with the session `cwd`" (CX:`hooks`#Config shape).
"Silently" means exit 0 with nothing on stdout, which is valid for every event
in both hosts, including Codex Stop.

### P21. Skill frontmatter checklist for both hosts

- `name` equal to the folder name, lowercase letters, digits, hyphens, at most
  64 characters; Codex requires `name` and `description` (CX:`build-skills`).
- `description` in the third person, trigger words first. The plan's limit of
  300 characters suits Codex's listing budget of 2% of the context window or
  8,000 characters (CX:`build-skills`).
- Leave out `when_to_use` (Claude-only). Do not use `` !`command` ``,
  `$ARGUMENTS`, `${CLAUDE_SKILL_DIR}`, or `${CLAUDE_PLUGIN_ROOT}` in shared
  skills; Codex leaves them as literal text (PBP 3.2, Part 4).
- A manual-only skill needs both `disable-model-invocation: true` (Claude) and
  `agents/openai.yaml` with `policy:` / `allow_implicit_invocation: false`
  (Codex) (PBP Part 4).
- The `<area>-<verb>` names avoid Claude's built-in command names (`init`,
  `review`, `memory`, `doctor`, `status`, and the rest in PBP 2.12).
- Where skills or the briefing tell Mike how to start a skill, give both forms:
  `/work-review` in Claude, `$work-review` in Codex (CX:`build-skills`).

### P22. Sample-run command details

- Claude `-p` in a run folder that was never trusted: project
  `permissions.allow` rules are "Not used", while hooks, skills, and `.mcp.json`
  servers are used (CC:`permissions.md`#What runs before you trust a folder).
  Pass `--allowedTools` (P4) instead of relying on the scaffold's allow list,
  and record that difference in the evidence.
- `codex exec` defaults to a read-only sandbox; pass
  `--sandbox workspace-write` and `-C <run folder>` (Observed in
  `codex exec --help`).
- macOS `/tmp` is a link to `/private/tmp`. Codex trust keys use the real path
  (Observed: `~/.codex/config.toml` already has a
  `[projects."/private/tmp/work-delivery-proof..."]` entry). Build each key
  with `cd "$RUN_DIR" && pwd -P`.
- Each run folder must be a Git repository: Codex requires one unless
  `--skip-git-repo-check` is passed (CX:`non-interactive-mode`#Git repository
  required), and the toolkit finds its root with Git anyway.

### P23. Launchd label mismatch (outside platform scope)

Section 7 names the service `local.toolkit.hindsight`; `dev/PROGRESS.md`
records the installed LaunchAgent as `local.toolkit-v2.hindsight`. `toolkit
hindsight service status` must use the installed label.

---

## Open items for the lead

1. P2: confirm in the first real Codex session whether a hook process can write
   under `~/.config` (the Codex docs do not say whether hooks run inside the
   command sandbox).
2. P3: decide between the `allow` rule for `toolkit` and the narrower sandbox
   settings; the rule depends on the experimental Codex rules feature.
3. P8: check whether Codex runs UserPromptSubmit for the continuation prompt a
   Stop `reason` creates.
4. P12: pick a distinct style name, or confirm which "Plain English" file wins
   in a real session.
5. P14: `defaultEnabled: false` plus per-project enabling, or renamed ported
   plugins.
6. For Mike: the Codex test login (P16) or an API key, and trusting the V2
   hooks once in Codex `/hooks` (P5).
