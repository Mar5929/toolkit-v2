#!/bin/bash
# usage: run.sh NAME [RESUME_SESSION_ID]
# Reads the prompt from $L/sessions/NAME.prompt.txt and runs one real claude -p session in the project folder.
# CLAUDE_CFG: Claude Code config folder. Default: Mike's own (needed for his sign-in). Set CLAUDE_CFG=scratch for a probe that needs no sign-in.
set -u
S=/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs
PROJ=$S/confirm-claude-local
L=$S/confirm-claude-local-logs
P=/Users/michaelrihm/Documents/Projects/toolkit-v2/plugins
NAME=$1; RESUME=${2:-}
PROMPT="$(cat "$L/sessions/$NAME.prompt.txt")"
ENVV=(HOME="$HOME" PATH="$PATH" USER="$USER" LOGNAME="$LOGNAME" SHELL=/bin/zsh LANG=en_US.UTF-8 TMPDIR="$TMPDIR" TOOLKIT_V2_CONFIG_DIR="$L/tkconfig")
DATA="$HOME/.claude/plugins/data/toolkit-inline"
if [ "${CLAUDE_CFG:-}" = scratch ]; then mkdir -p "$L/claude-config"; ENVV+=(CLAUDE_CONFIG_DIR="$L/claude-config"); DATA="$L/claude-config/plugins/data/toolkit-inline"; fi
ARGS=(-p "$PROMPT"
  --setting-sources project,local
  --settings '{"enabledPlugins":{"toolkit@inline":true,"work@inline":true,"memory@inline":true,"session-skills@inline":true,"git-workflows@inline":true}}'
  --strict-mcp-config
  --plugin-dir "$P/toolkit" --plugin-dir "$P/work" --plugin-dir "$P/memory" --plugin-dir "$P/session-skills" --plugin-dir "$P/git-workflows"
  --output-format stream-json --verbose --include-hook-events
  --permission-mode acceptEdits
  --allowedTools 'Bash(toolkit *)' 'Bash(node *)' 'Bash(git *)' 'Bash(ls *)' 'Bash(ls)' 'Bash(cat *)' 'Bash(mkdir *)' 'Bash(mktemp *)' 'Bash(chmod *)' 'Bash(pwd)' 'Bash(head *)' 'Bash(tail *)' 'Bash(wc *)' 'Bash(find *)' 'Bash(grep *)' 'Bash(diff *)' 'Bash(echo *)' 'Bash(test *)' 'Bash(./greet *)' Read Write Edit MultiEdit Glob Grep Skill Agent Task TodoWrite
)
if [ -n "$RESUME" ]; then ARGS+=(--resume "$RESUME"); fi
{ printf 'cd %q && env -i'; for e in "${ENVV[@]}"; do printf ' %q' "$e"; done; printf ' claude'; for a in "${ARGS[@]}"; do printf ' %q' "$a"; done; echo ' < /dev/null'; } > "$L/sessions/$NAME.command.txt"
date -u +%FT%TZ > "$L/sessions/$NAME.start"
cd "$PROJ" && env -i "${ENVV[@]}" claude "${ARGS[@]}" < /dev/null > "$L/sessions/$NAME.jsonl" 2> "$L/sessions/$NAME.err"
echo $? > "$L/sessions/$NAME.exit"
date -u +%FT%TZ > "$L/sessions/$NAME.end"
SID=$(python3 -c "
import json,sys
for l in open(sys.argv[1]):
    try: e=json.loads(l)
    except Exception: continue
    if e.get('type')=='system' and e.get('subtype')=='init': print(e['session_id']); break
" "$L/sessions/$NAME.jsonl")
echo "$SID" > "$L/sessions/$NAME.sid"
[ -n "$SID" ] && [ -f "$DATA/sessions/$SID.json" ] && cp "$DATA/sessions/$SID.json" "$L/sessions/$NAME.hookstate.json"
python3 "$L/harness/summarize.py" "$L/sessions/$NAME.jsonl" > "$L/sessions/$NAME.summary.txt" 2>&1
echo "done $NAME exit=$(cat $L/sessions/$NAME.exit) sid=$SID"
