#!/bin/zsh
# usage: ca-run.sh <label> <prompt> [extra codex args...]
# env: APPROVE=1 uses --approve-for-me instead of --sandbox workspace-write
#      RESUME=<thread id> continues that session with codex exec resume
S=/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad
P=$S/runs/confirm-a-local
L=$S/runs/confirm-a-local-logs
label=$1; shift
prompt=$1; shift
print -r -- "$prompt" > $L/$label.prompt.txt
if [ -n "$APPROVE" ]; then SB=(--approve-for-me); else SB=(--sandbox workspace-write); fi
date -u +%Y-%m-%dT%H:%M:%SZ > $L/$label.start.txt
if [ -n "$RESUME" ]; then
  cmd=(codex exec resume --json --dangerously-bypass-hook-trust -c 'sandbox_mode="workspace-write"' -c 'model_reasoning_effort="medium"' -c 'notify=[]' -c "projects={\"$P\"={trust_level=\"trusted\"}}" "$@" "$RESUME" "<prompt>")
  print -r -- "cd ${(q)P} && ${(q)cmd[@]} < /dev/null" > $L/$label.command.txt
  (cd $P && codex exec resume --json --dangerously-bypass-hook-trust -c 'sandbox_mode="workspace-write"' \
    -c 'model_reasoning_effort="medium"' -c 'notify=[]' \
    -c "projects={\"$P\"={trust_level=\"trusted\"}}" \
    "$@" "$RESUME" "$prompt" < /dev/null > $L/$label.jsonl 2> $L/$label.stderr)
else
  cmd=(codex exec --json $SB --dangerously-bypass-hook-trust -c 'model_reasoning_effort="medium"' -c 'notify=[]' -c "projects={\"$P\"={trust_level=\"trusted\"}}" "$@" -C "$P" "<prompt>")
  print -r -- "${(q)cmd[@]} < /dev/null" > $L/$label.command.txt
  codex exec --json $SB --dangerously-bypass-hook-trust \
    -c 'model_reasoning_effort="medium"' -c 'notify=[]' \
    -c "projects={\"$P\"={trust_level=\"trusted\"}}" \
    "$@" -C "$P" "$prompt" < /dev/null > $L/$label.jsonl 2> $L/$label.stderr
fi
echo "exit=$?" > $L/$label.exit.txt
date -u +%Y-%m-%dT%H:%M:%SZ > $L/$label.end.txt
tid=$(head -1 $L/$label.jsonl | python3 -c 'import json,sys; print(json.loads(sys.stdin.read()).get("thread_id",""))' 2>/dev/null)
echo $tid > $L/$label.thread.txt
f=$(ls ~/.codex/sessions/*/*/*/*$tid*.jsonl 2>/dev/null | head -1)
[ -n "$f" ] && cp "$f" $L/$label.rollout.jsonl
cp ~/.codex/plugins/data/toolkit-toolkit-v2/sessions/$tid.json $L/$label.hookstate.json 2>/dev/null
python3 $S/runs/a-summarize.py $L/$label > $L/$label.summary.txt 2>&1
python3 $S/runs/a3-skills.py $L/$label.rollout.jsonl > $L/$label.skills.txt 2>&1
python3 $S/runs/a3-hooks.py $L/$label.rollout.jsonl > $L/$label.hooks.txt 2>&1
(cd $P && git status --short && git log --oneline | head -5 && find . -path ./.git -prune -o -type f -print | sort) > $L/$label.tree-after.txt 2>&1
echo "$label start=$(cat $L/$label.start.txt) end=$(cat $L/$label.end.txt) thread=$tid $(cat $L/$label.exit.txt) mode=${SB[*]} resume=$RESUME extra=$* skills=$(cat $L/$label.skills.txt)" >> $L/index.txt
