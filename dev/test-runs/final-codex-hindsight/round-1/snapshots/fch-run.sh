#!/bin/zsh
# usage: fch-run.sh <label> <prompt> [extra codex args...]
# env: SANDBOX (default workspace-write; "approve" uses --approve-for-me)
#      RESUME=<thread id> resumes that session instead of starting a fresh one
S=/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad
P=$S/runs/final-codex-hindsight-r1
L=$S/runs/final-codex-hindsight-r1-logs
label=$1; shift
prompt=$1; shift
print -r -- "$prompt" > $L/$label.prompt.txt
date -u +%Y-%m-%dT%H:%M:%SZ > $L/$label.start.txt
if [ "$SANDBOX" = approve ]; then SB=(--approve-for-me); else SB=(--sandbox ${SANDBOX:-workspace-write}); fi
if [ -n "$RESUME" ]; then
  print -r -- "codex exec --json $SB --dangerously-bypass-hook-trust -c model_reasoning_effort=medium -c notify=[] -c projects={<project>={trust_level=trusted}} $* -C <project> resume $RESUME <prompt>" > $L/$label.cmd.txt
  cd $P && codex exec --json $SB --dangerously-bypass-hook-trust \
    -c model_reasoning_effort="medium" -c 'notify=[]' \
    -c "projects={\"$P\"={trust_level=\"trusted\"}}" \
    "$@" -C "$P" resume "$RESUME" "$prompt" < /dev/null > $L/$label.jsonl 2> $L/$label.stderr
else
  print -r -- "codex exec --json $SB --dangerously-bypass-hook-trust -c model_reasoning_effort=medium -c notify=[] -c projects={<project>={trust_level=trusted}} $* -C <project> <prompt>" > $L/$label.cmd.txt
  cd $P && codex exec --json $SB --dangerously-bypass-hook-trust \
    -c model_reasoning_effort="medium" -c 'notify=[]' \
    -c "projects={\"$P\"={trust_level=\"trusted\"}}" \
    "$@" -C "$P" "$prompt" < /dev/null > $L/$label.jsonl 2> $L/$label.stderr
fi
echo "exit=$?" > $L/$label.exit.txt
date -u +%Y-%m-%dT%H:%M:%SZ > $L/$label.end.txt
tid=$(head -1 $L/$label.jsonl | python3 -c 'import json,sys; print(json.loads(sys.stdin.read()).get("thread_id",""))' 2>/dev/null)
[ -z "$tid" ] && tid=$RESUME
echo $tid > $L/$label.thread.txt
f=$(ls -t ~/.codex/sessions/*/*/*/*$tid*.jsonl 2>/dev/null | head -1)
[ -n "$f" ] && cp "$f" $L/$label.rollout.jsonl
python3 $S/runs/a-summarize.py $L/$label > $L/$label.summary.txt 2>&1
cp ~/.codex/plugins/data/toolkit-toolkit-v2/sessions/$tid.json $L/$label.hookstate.json 2>/dev/null
(cd $P && git status --short > $L/$label.gitstatus.txt; git log --oneline -8 >> $L/$label.gitstatus.txt; git worktree list >> $L/$label.gitstatus.txt)
echo "DONE $label exit=$(cat $L/$label.exit.txt) thread=$tid start=$(cat $L/$label.start.txt) end=$(cat $L/$label.end.txt)"
