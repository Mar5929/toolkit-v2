#!/bin/bash
# usage: run.sh NAME [RESUME_SESSION_ID]
# Reads the prompt from $L/sessions/NAME.prompt.txt and runs one real claude -p session in the project folder.
# MODE=iso (default): the isolation command from dev/ARCHITECTURE.md section 10.
# MODE=normal: Mike's everyday Claude Code settings (user settings, the installed toolkit-v2 marketplace), no plugin or setting flags.
set -u
S=/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs
PROJ=$S/final-claude-local-r1
L=$S/final-claude-local-r1-logs
P=/Users/michaelrihm/Documents/Projects/toolkit-v2/plugins
NAME=$1; RESUME=${2:-}
MODE=${MODE:-iso}
PROMPT="$(cat "$L/sessions/$NAME.prompt.txt")"
ALLOWED=('Bash(toolkit *)' 'Bash(node *)' 'Bash(git *)' 'Bash(ls *)' 'Bash(ls)' 'Bash(cat *)' 'Bash(mkdir *)' 'Bash(mktemp *)' 'Bash(chmod *)' 'Bash(pwd)' 'Bash(head *)' 'Bash(tail *)' 'Bash(wc *)' 'Bash(find *)' 'Bash(grep *)' 'Bash(diff *)' 'Bash(echo *)' 'Bash(test *)' 'Bash(./greet *)' 'Bash(which *)' 'Bash(command -v *)' 'Bash(date *)' 'Bash(date)' Read Write Edit MultiEdit Glob Grep Skill Agent Task TodoWrite TaskCreate TaskUpdate TaskList)
if [ "$MODE" = normal ]; then
  ENVV=(HOME="$HOME" PATH="$PATH" USER="$USER" LOGNAME="$LOGNAME" SHELL=/bin/zsh LANG=en_US.UTF-8 TMPDIR="$TMPDIR")
  DATA="$HOME/.claude/plugins/data/toolkit-toolkit-v2"
  ARGS=(-p "$PROMPT" --output-format stream-json --verbose --include-hook-events --permission-mode acceptEdits --allowedTools "${ALLOWED[@]}")
else
  ENVV=(HOME="$HOME" PATH="$PATH" USER="$USER" LOGNAME="$LOGNAME" SHELL=/bin/zsh LANG=en_US.UTF-8 TMPDIR="$TMPDIR" TOOLKIT_V2_CONFIG_DIR="$L/tkconfig")
  DATA="$HOME/.claude/plugins/data/toolkit-inline"
  ARGS=(-p "$PROMPT"
    --setting-sources project,local
    --settings '{"enabledPlugins":{"toolkit@inline":true,"work@inline":true,"memory@inline":true,"session-skills@inline":true,"git-workflows@inline":true}}'
    --strict-mcp-config
    --plugin-dir "$P/toolkit" --plugin-dir "$P/work" --plugin-dir "$P/memory" --plugin-dir "$P/session-skills" --plugin-dir "$P/git-workflows"
    --output-format stream-json --verbose --include-hook-events
    --permission-mode acceptEdits
    --allowedTools "${ALLOWED[@]}")
fi
if [ -n "$RESUME" ]; then ARGS+=(--resume "$RESUME"); fi
# ADD_DIR: the same as Mike running /add-dir <folder> in the session.
if [ -n "${ADD_DIR:-}" ]; then ARGS+=(--add-dir "$ADD_DIR"); fi
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
( cd "$PROJ" && git log --all --format='%h %s' > "$L/sessions/$NAME.gitlog.txt"; git status --short > "$L/sessions/$NAME.gitstatus.txt"; git worktree list > "$L/sessions/$NAME.worktrees.txt" )
echo "done $NAME mode=$MODE exit=$(cat $L/sessions/$NAME.exit) sid=$SID"
