# Salesforce tools

This folder holds two tools for a Salesforce project, with the rule that goes with each. The toolkit does not ship them, and setup does not copy them. A project that wants one adds it as its own.

| Tool | What it does | Its rule |
| --- | --- | --- |
| `tools/kb/` | Lists which parts of an org read and write each other, to show what a change affects. | `rules/dependency-graph.md` |
| `tools/permissions/` | Fetches, checks, and prepares permission sets, so that a deploy removes no grant by accident. `PERMISSIONS-RUNBOOK.md` in that folder says how. | `rules/permissions-source-control.md` |

## Adding a tool to a project

1. Copy the tool's folder into the project as `tools/kb/` or `tools/permissions/`.
2. Copy its rule into the project's `.claude/rules/`.
3. Add these lines to the project's `.gitignore`:

   ```text
   __pycache__/
   *.pyc
   .claude/.permset-preflight/
   tools/kb/out/
   tools/kb/_freshness_stamp.json
   tools/kb/_drift_pending.md
   tools/kb/_prev-*.json
   ```

4. For `tools/kb/` only, and only when the owner wants the graph rebuilt after each Claude Code turn, add this entry under `hooks` in the project's `.claude/settings.json`:

   ```json
   "Stop": [
     { "hooks": [ { "type": "command", "command": "python3 \"$CLAUDE_PROJECT_DIR/tools/kb/graph_freshness_hook.py\"", "timeout": 60 } ] }
   ]
   ```

The tools need Python 3. `tools/kb/README.md` says what the graph cannot tell you.
