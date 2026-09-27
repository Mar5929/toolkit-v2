#!/bin/bash
# usage: claude-a-run.sh NAME [RESUME_SESSION_ID]
# Reads the prompt from $LOGS/NAME.prompt.txt and runs one real claude -p session in the project folder.
set -u
S=/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs
PROJ=$S/claude-a
LOGS=$S/claude-a-logs
P=/Users/michaelrihm/Documents/Projects/toolkit-v2/plugins
NAME=$1; RESUME=${2:-}
PROMPT="$(cat "$LOGS/$NAME.prompt.txt")"
ARGS=(-p "$PROMPT"
  --setting-sources project,local
  --settings '{"enabledPlugins":{"toolkit@inline":true,"work@inline":true,"memory@inline":true,"session-skills@inline":true,"git-workflows@inline":true}}'
  --strict-mcp-config
  --plugin-dir "$P/toolkit" --plugin-dir "$P/work" --plugin-dir "$P/memory" --plugin-dir "$P/session-skills" --plugin-dir "$P/git-workflows"
  --output-format stream-json --verbose --include-hook-events
  --permission-mode acceptEdits
  --allowedTools 'Bash(toolkit *)' 'Bash(node *)' 'Bash(git *)' 'Bash(ls *)' 'Bash(ls)' 'Bash(cat *)' 'Bash(mkdir *)' 'Bash(mktemp *)' 'Bash(rm -rf /var/folders/*)' 'Bash(rm -r /var/folders/*)' 'Bash(rm -rf /tmp/*)' 'Bash(rm -rf /private/var/folders/*)' 'Bash(chmod *)' 'Bash(cd *)' 'Bash(pwd)' 'Bash(head *)' 'Bash(tail *)' 'Bash(wc *)' 'Bash(find *)' 'Bash(grep *)' 'Bash(diff *)' 'Bash(echo *)' 'Bash(test *)' 'Bash(./greet *)' Read Write Edit MultiEdit Glob Grep Skill Agent Task TodoWrite
)
if [ -n "$RESUME" ]; then ARGS+=(--resume "$RESUME"); fi
{ printf 'cd %q && claude' "$PROJ"; for a in "${ARGS[@]}"; do printf ' %q' "$a"; done; echo ' < /dev/null'; } > "$LOGS/$NAME.command.txt"
date -u +%FT%TZ > "$LOGS/$NAME.start"
cd "$PROJ" && claude "${ARGS[@]}" < /dev/null > "$LOGS/$NAME.jsonl" 2> "$LOGS/$NAME.err"
echo $? > "$LOGS/$NAME.exit"
date -u +%FT%TZ > "$LOGS/$NAME.end"
SID=$(python3 -c "
import json,sys
for l in open(sys.argv[1]):
    e=json.loads(l)
    if e.get('type')=='system' and e.get('subtype')=='init': print(e['session_id']); break
" "$LOGS/$NAME.jsonl")
echo "$SID" > "$LOGS/$NAME.sid"
[ -f "$HOME/.claude/plugins/data/toolkit-inline/sessions/$SID.json" ] && cp "$HOME/.claude/plugins/data/toolkit-inline/sessions/$SID.json" "$LOGS/$NAME.hookstate.json"
python3 "$S/claude-a-summarize.py" "$LOGS/$NAME.jsonl" > "$LOGS/$NAME.summary.txt" 2>&1
echo "done $NAME exit=$(cat $LOGS/$NAME.exit) sid=$SID"
