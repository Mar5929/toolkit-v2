# Confirmation run claude-local: blocked, the claude CLI is signed out

Tried on 2026-09-28 from 16:20 to 16:30 UTC. Claude Code 2.1.280
(`/Users/michaelrihm/.local/bin/claude`). Toolkit V2 plugins from this
repository's folders: `toolkit` 0.2.4, `work` 0.2.6, `memory` 0.2.4,
`session-skills` 0.2.4, `git-workflows` 0.2.4. Tracker: local folders.
Memory: built-in `.memory/`. Not Salesforce.

## Result

The scenario did not run. No session got a single model reply, because the
`claude` CLI on this Mac is not signed in.

- `claude auth status` printed `"loggedIn": false, "authMethod": "none"`, at
  16:21 UTC and again at 16:26 UTC.
- Every `claude -p` session ended on its first turn, before any tool call:
  - With Mike's own Claude Code folder (`~/.claude`, needed for his sign-in):
    "Failed to authenticate: OAuth session expired and could not be
    refreshed" (`sessions/p02.summary.txt`; also an empty-folder check at
    16:21 UTC with the same message).
  - With a scratch Claude Code folder: "Not logged in · Please run /login"
    (`sessions/p01.summary.txt`).
- The Keychain item "Claude Code-credentials" was last changed at
  2026-09-28 15:08:07 UTC. The sign-in stored then no longer works.
- The Claude Code built into the desktop app (2.1.281) reports the same
  `"loggedIn": false`.

What Mike does: run `claude auth login` in a terminal. After that, the whole
scenario in `harness/scenario.md` runs with `harness/run.sh`, in the clean
project folder already made for it (see "Ready for the real run").

## What was checked without a model

These checks need no sign-in. Parts 2 to 4 are not real sessions: they run
the same `toolkit` commands the hooks and skills run, and they are labelled
that way.

### 1. Real Claude Code process: plugins load, two hooks run

Command: the one in `dev/ARCHITECTURE.md` section 10, exactly as in
`sessions/p01.command.txt` and `sessions/p02.command.txt`
(`--setting-sources project,local`, `--settings` turning on the five
`<name>@inline` plugins, `--strict-mcp-config`, `--plugin-dir` for each V2
plugin, `--output-format stream-json --verbose --include-hook-events`,
`--permission-mode acceptEdits`, `--allowedTools 'Bash(toolkit *)' ...`). The
environment was cleared (`env -i`) except `HOME`, `PATH`, `USER`, `LOGNAME`,
`SHELL`, `LANG`, `TMPDIR`, and `TOOLKIT_V2_CONFIG_DIR` (a scratch folder).

The project was a new Git repository with a three-line `README.md`, set up by
hand with
`toolkit init --name greet --key greet --tracker local --memory builtin --owner Mike --decline SOUL.md`
(`checks/init.out.txt`: 33 files added, `README.md` kept).

From the stream-json `init` event of both sessions:

- Plugins: `toolkit@inline`, `work@inline`, `memory@inline`,
  `session-skills@inline`, `git-workflows@inline`, plus Claude Code built-ins
  (`agents-md@builtin` and `telemetry@builtin` in p02; `telemetry@builtin` in
  p01). No other plugin. No error field.
- 22 V2 skills listed, from `toolkit:project-setup` to
  `git-workflows:reset-to-remote`, and 7 V2 agents (`work:acceptance-checker`,
  `work:builder`, `work:design-architect`, `work:design-critic`,
  `work:requirements-analyst`, `work:researcher`,
  `session-skills:handoff-verifier`).
- `output_style`: `Plain English`. `mcp_servers`: empty.

Hook events seen (`hook_response`, outcome `success`, exit 0):

| Hook | Session | What it returned |
| --- | --- | --- |
| SessionStart | p01, p02 | `{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"Project briefing: greet (greet), owner Mike. Work items: local folders in .work-items/ (ids like WI-001). Memory: built-in memory in .memory/. Salesforce: no. ..."}}`. The briefing also said "The tracker has no open items" and "Current focus: still the empty template from setup." |
| UserPromptSubmit | p01 ("Remember that I prefer short commit messages.") | `{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"The owner stated something to keep; memory-save records it, or work-on if it is a task."}}` |
| UserPromptSubmit | p02 ("Where are we?") | Empty output, as designed: no keep phrase. |

PreToolUse, PostToolUse, and Stop did not run in a real session. PreToolUse
and PostToolUse need a tool call, which needs a model reply. Claude Code did
not run Stop after the sign-in error. `sessions/p01.hookstate.json` shows the
UserPromptSubmit hook recorded `"keep": "remember that"` for the turn.

Standard error in both sessions held one line: "Ignoring 1 permissions.allow
entry from .claude/settings.json: this workspace has not been trusted." That
entry is the project's `Bash(toolkit *)`; the harness passes the same rule
with `--allowedTools`, as in claude-a.

### 2. Hook commands run directly (not a real session)

`harness/hookcheck.py` runs `node <toolkit>/bin/toolkit hook <event> --host claude`,
the exact command `hooks/hooks.json` gives Claude Code, with JSON input in the
shape Claude Code sends, in a copy of the test project. Full output:
`checks/hookcheck.json`.

| Hook | Input | Result |
| --- | --- | --- |
| PreToolUse | `git commit -m 'Add greet' -m 'Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>'` | deny: "This commit message gives an AI credit: ... Remove that line and run the command again. Nothing was committed." |
| PreToolUse | `git commit -F - <<'EOF'` with the line `🤖 Generated with [Claude Code](https://claude.com/claude-code)` | deny |
| PreToolUse | `git commit -m "$(cat <<'EOF' ... Co-Authored-By: Claude <noreply@anthropic.com> ... EOF)"` | deny |
| PreToolUse | `git commit -m 'Add greet' --trailer 'Co-authored-by: Claude <noreply@anthropic.com>'` | deny |
| PreToolUse | `gh pr create --title 'Add greet' --body '... Generated with Claude Code'` | deny: "This pull request text gives an AI credit ... No pull request was created or changed." |
| PreToolUse | `git commit -m 'Add greet'` | no output: the command may run |
| PreToolUse | `git commit ... -m 'Co-Authored-By: Sam Lee <sam@example.com>'` (a person) | no output: the command may run |
| UserPromptSubmit | "Remember that the greet demo is on Friday. Reply with only OK." | the keep reminder |
| Stop | first Stop, nothing recorded | `additionalContext`: "The owner asked this turn for something to be kept for later sessions, and nothing was recorded ..." |
| Stop | second Stop, `stop_hook_active: true` | no output: it does not block twice |

### 3. The attribution setting

- `toolkit init` wrote `"attribution": {"commit": "", "pr": "", "sessionUrl": false}`
  and `"skillListingBudgetFraction": 0.02` into the project's
  `.claude/settings.json` (`checks/project-settings.json`). This is the form
  `ai-external-knowledge/claude-code/settings-reference.md` gives for a file
  that Claude Code versions before 2.1.281 also read.
- `toolkit doctor` right after init: "0 problems and 2 warnings"
  (`checks/doctor.out.txt`). Both warnings are about the scratch `HOME` (no
  plugin-root pointer and no wrapper script there), not the project.
- With `attribution` removed from a copy of the settings, doctor reported:
  "Problems (1): .claude/settings.json has no "attribution" setting, so
  Claude Code adds a Co-Authored-By line naming the AI to commits ..." and
  exited 1 (`checks/cli-doctor-attribution.txt`).
- Not proven: that a real Claude Code session with this setting writes
  commits with no credit line. That needs the sign-in.

### 4. The memory proposal path (commands only, not a real session)

In a copy of the test project (`checks/cli-proposal.txt`):

- `toolkit memory save --type project --name project_greet_node_version ... --proposal`:
  "Saved to memory as a proposal: project_greet_node_version (new record).
  It is not a fact until the owner answers."
- `toolkit work decisions` (the command `work-decide` step 1 runs):
  "1 decision waits on the owner: Memory proposals (saved, not yet approved;
  agents do not rely on them until the owner says yes or no):
  project_greet_node_version: greet supports Node 20 and newer only. Saved
  2026-09-28. Yes: toolkit memory approve ... No: toolkit memory reject ..."
- `toolkit memory find 'Node'`: "No memory records match "Node". 1 saved
  proposal also matches; it is not a fact until the owner answers."
- `toolkit brief --host claude` lists it under "Memory proposals waiting on
  the owner (not facts: do not rely on them; work-decide asks him)".
- Not proven: that the agent saves an unanswered "Save to memory?" as a
  proposal, and that "what do you need from me?" shows it in a reply. Both
  need the sign-in.

## The scenario, item by item

| Item | Status |
| --- | --- |
| One work item from 01 to Done | Not run (sign-in) |
| A sub-item | Not run (sign-in) |
| A folder renamed by hand, noticed by the next session | Not run (sign-in) |
| A remembered preference, recalled later | Not run (sign-in). The UserPromptSubmit reminder fired in a real session (p01). |
| Status ("Where are we?") | Not run (sign-in) |
| Decisions ("What do you need from me?") | Not run (sign-in) |
| An unanswered memory proposal shown under "what do you need from me?" | Not run (sign-in). The command path works (part 4). |
| SessionStart hook in a real session | Seen (p01, p02) |
| UserPromptSubmit hook in a real session | Seen (p01) |
| PreToolUse hook in a real session | Not seen (needs a model turn). The command denies AI credit (part 2). |
| PostToolUse hook in a real session | Not seen (needs a model turn) |
| Stop hook in a real session | Not seen (needs a model turn). The command blocks once (part 2). |
| No commit with Co-Authored-By or "Generated with" | Not proven in a real session. The setting is written (part 3) and the pre-tool block works on the command (part 2). |

## Problems found

1. **The `claude` CLI is signed out (blocker, not a toolkit bug).** Evidence
   above. Mike runs `claude auth login`.
2. **Doctor names the default config folder, not the one in use (low).**
   `plugins/toolkit/lib/project/checks.mjs` line 371 writes
   "~/.config/toolkit-v2/plugin-root is missing" as fixed text. With
   `TOOLKIT_V2_CONFIG_DIR` set (every test run), doctor reads the pointer from
   that folder but names `~/.config/toolkit-v2`, so the message points at the
   wrong file (`checks/doctor.out.txt`, warning 1). Suggested fix: build the
   message from `pointerPath(env)` in `lib/project/machine.mjs`, the same
   path `readPointer(env)` reads, and import it in `checks.mjs` next to
   `readPointer`.

## Ready for the real run

- Clean project: `/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/confirm-claude-local`,
  a new Git repository on `main` whose only commit (`4870f7c`) holds a
  three-line `README.md`. `toolkit init` has not run there; s01 runs it
  through the `project-setup` skill.
- The probe sessions p01 and p02 ran in an earlier folder at the same path,
  now renamed `confirm-claude-local-probe` (init run by hand, not committed).
- Harness: `harness/run.sh <name> [<session id to resume>]` in the scratch
  logs folder `.../runs/confirm-claude-local-logs/`. It uses Mike's own
  Claude Code folder unless `CLAUDE_CFG=scratch` is set, and always points
  `TOOLKIT_V2_CONFIG_DIR` at a scratch folder.
- Prompts and what each proves: `harness/scenario.md`. The memory proposal
  step uses `--resume`: s09 should end with a "Save to memory: ...?" line, and
  s10 resumes s09 with a message that does not answer it. The last step is
  `git log --all --format='%H%n%B' | grep -i -E 'co-authored-by|generated with'`,
  which must print nothing.

## Files in this folder

- `sessions/`: p01 and p02: prompt, exact command, full stream-json output,
  readable summary, standard error, exit code, times, session id, hook state.
- `checks/`: `init.out.txt`, `doctor.out.txt`, `project-settings.json`,
  `hookcheck.json`, `cli-proposal.txt`, `cli-doctor-attribution.txt`.
- `harness/`: `run.sh`, `summarize.py` (copied from claude-a),
  `hookcheck.py`, `scenario.md`.

Nothing was written to Mike's model folders, to `claude-toolkit`, or to
Notion. The real-config probe (p02) wrote one session file to
`~/.claude/projects/` and one hook state file to
`~/.claude/plugins/data/toolkit-inline/sessions/`, as claude-a did.
`~/.config/toolkit-v2/plugin-root` changed at 16:22:03 UTC, before either
probe; the Codex confirmation runs running at the same time write it. The
probes wrote their pointer to the scratch folder.
