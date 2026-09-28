#!/bin/zsh
# Final confirmation run "notion" round 1: one real Claude Code session (Mike's own install).
# usage: fn-claude.sh <label> <prompt> [resume session id]
S=/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad
P=$S/runs/final-notion-r1
L=$S/runs/final-notion-r1-logs
export TOOLKIT_V2_CONFIG_DIR=$S/runs/final-notion-r1-config
label=$1; prompt=$2; RESUME=${3:-}
print -r -- "$prompt" > $L/$label.prompt.txt
ARGS=(-p "$prompt" --output-format stream-json --verbose --include-hook-events
  --permission-mode acceptEdits
  --allowedTools 'Bash(toolkit *)' 'Bash(git *)' 'Bash(node *)' 'Bash(ls *)' 'Bash(ls)' 'Bash(cat *)' 'Bash(mktemp *)' 'Bash(rm -rf /var/folders/*)' 'Bash(rm -rf /private/var/folders/*)' 'Bash(rm -rf /tmp/*)' 'Bash(pwd)' 'Bash(head *)' 'Bash(tail *)' 'Bash(wc *)' 'Bash(find *)' 'Bash(grep *)' 'Bash(rg *)' 'Bash(diff *)' 'Bash(echo *)' 'Bash(test *)' 'Bash(date *)' 'Bash(sed -n *)' Read Write Edit MultiEdit Glob Grep Skill Agent Task TodoWrite)
[ -n "$RESUME" ] && ARGS+=(--resume "$RESUME")
{ print -n "cd <project> && TOOLKIT_V2_CONFIG_DIR=<scratch config> claude"; for a in "${ARGS[@]}"; do print -n " ${(q)a}"; done; print ' < /dev/null'; } > $L/$label.command.txt
date -u +%FT%TZ > $L/$label.start.txt
cd $P && claude "${ARGS[@]}" < /dev/null > $L/$label.jsonl 2> $L/$label.stderr
echo "exit=$?" > $L/$label.exit.txt
date -u +%FT%TZ > $L/$label.end.txt
SID=$(python3 -c "
import json,sys
for l in open(sys.argv[1]):
    e=json.loads(l)
    if e.get('type')=='system' and e.get('subtype')=='init': print(e['session_id']); break
" $L/$label.jsonl)
echo $SID > $L/$label.thread.txt
for d in ~/.claude/plugins/data/toolkit-toolkit-v2 ~/.claude/plugins/data/toolkit-inline; do [ -f $d/sessions/$SID.json ] && cp $d/sessions/$SID.json $L/$label.hookstate.json; done
python3 $S/runs/fn-claude-summarize.py $L/$label.jsonl > $L/$label.summary.txt 2>&1
(cd $P && git status --short && git log --oneline | head -5 && git worktree list) > $L/$label.tree-after.txt 2>&1
echo "$label start=$(cat $L/$label.start.txt) end=$(cat $L/$label.end.txt) session=$SID $(cat $L/$label.exit.txt) host=claude-code resume=$RESUME" >> $L/index.txt
touch $L/$label.done
