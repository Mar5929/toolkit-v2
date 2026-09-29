#!/bin/bash
# usage: run.sh NAME [RESUME_SESSION_ID]
# Close-out run 2 (Claude Code). Every session uses Mike's everyday Claude Code
# settings: his user settings and the installed toolkit-v2 marketplace, with no
# plugin or setting flags. Only output, permission, and allowed-tool flags are added.
# machine-setup is refused in every session, because HOME is Mike's own.
set -u
S=/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs
PROJ=$S/closeout2-claude
L=$S/closeout2-claude-logs
NAME=$1; RESUME=${2:-}
PROMPT="$(cat "$L/sessions/$NAME.prompt.txt")"
ALLOWED=('Bash(toolkit *)' 'Bash(node *)' 'Bash(git *)' 'Bash(ls *)' 'Bash(ls)' 'Bash(cat *)' 'Bash(mkdir *)' 'Bash(mktemp *)' 'Bash(chmod *)' 'Bash(pwd)' 'Bash(head *)' 'Bash(tail *)' 'Bash(wc *)' 'Bash(find *)' 'Bash(grep *)' 'Bash(diff *)' 'Bash(echo *)' 'Bash(test *)' 'Bash(which *)' 'Bash(command -v *)' 'Bash(date *)' 'Bash(date)' Read Write Edit MultiEdit Glob Grep Skill Agent Task TodoWrite TaskCreate TaskUpdate TaskList)
ENVV=(HOME="$HOME" PATH="$PATH" USER="$USER" LOGNAME="$LOGNAME" SHELL=/bin/zsh LANG=en_US.UTF-8 TMPDIR="$TMPDIR")
DATA="$HOME/.claude/plugins/data/toolkit-toolkit-v2"
ARGS=(-p "$PROMPT" --output-format stream-json --verbose --include-hook-events --permission-mode acceptEdits --allowedTools "${ALLOWED[@]}")
ARGS+=(--disallowedTools "Bash(toolkit machine-setup*)" "Bash(*toolkit machine-setup*)")
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
( cd "$PROJ" && git log --all --format='%h %s' > "$L/sessions/$NAME.gitlog.txt"; git status --short > "$L/sessions/$NAME.gitstatus.txt"; git worktree list > "$L/sessions/$NAME.worktrees.txt" )
echo "done $NAME exit=$(cat $L/sessions/$NAME.exit) sid=$SID"
