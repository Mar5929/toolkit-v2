#!/bin/zsh
# usage: rc-run.sh <label> <prompt> [extra codex args...]
# env: APPROVE=1 routes approval requests to Codex's automatic reviewer (stands in for Mike clicking approve)
#      RESUME=<thread id> continues that session with codex exec resume
S=/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad
P=$S/runs/rules-codex
L=$S/runs/rules-codex-logs
B=$S/backups/rules-codex
label=$1; shift
prompt=$1; shift
print -r -- "$prompt" > $L/$label.prompt.txt
date -u +%Y-%m-%dT%H:%M:%SZ > $L/$label.start.txt
COMMON=(--json --dangerously-bypass-hook-trust -c 'notify=[]' -c "projects={\"$P\"={trust_level=\"trusted\"}}")
if [ -n "$RESUME" ]; then
  if [ -n "$APPROVE" ]; then AP=(-c 'sandbox_mode="workspace-write"' -c 'approval_policy="on-request"' -c 'approvals_reviewer="auto_review"'); else AP=(-c 'sandbox_mode="workspace-write"'); fi
  print -r -- "cd ${(q)P} && codex exec resume ${(q)COMMON[@]} ${(q)AP[@]} ${(q)@} $RESUME <prompt> < /dev/null" > $L/$label.command.txt
  (cd $P && codex exec resume $COMMON $AP "$@" "$RESUME" "$prompt" < /dev/null > $L/$label.jsonl 2> $L/$label.stderr)
else
  if [ -n "$APPROVE" ]; then AP=(--approve-for-me); else AP=(--sandbox workspace-write); fi
  print -r -- "codex exec ${(q)COMMON[@]} ${(q)AP[@]} ${(q)@} -C ${(q)P} <prompt> < /dev/null" > $L/$label.command.txt
  codex exec $COMMON $AP "$@" -C "$P" "$prompt" < /dev/null > $L/$label.jsonl 2> $L/$label.stderr
fi
echo "exit=$?" > $L/$label.exit.txt
date -u +%Y-%m-%dT%H:%M:%SZ > $L/$label.end.txt
tid=$(head -1 $L/$label.jsonl | python3 -c 'import json,sys; print(json.loads(sys.stdin.read()).get("thread_id",""))' 2>/dev/null)
[ -z "$tid" ] && tid=$RESUME
echo $tid > $L/$label.thread.txt
f=$(ls ~/.codex/sessions/*/*/*/*$tid*.jsonl 2>/dev/null | head -1)
[ -n "$f" ] && cp "$f" $L/$label.rollout.jsonl
cp ~/.codex/plugins/data/toolkit-toolkit-v2/sessions/$tid.json $L/$label.hookstate.json 2>/dev/null
python3 $S/runs/a-summarize.py $L/$label > $L/$label.summary.txt 2>&1
python3 $S/runs/a3-skills.py $L/$label.rollout.jsonl > $L/$label.skills.txt 2>&1
python3 $S/runs/a3-hooks.py $L/$label.rollout.jsonl > $L/$label.hooks.txt 2>&1
python3 $S/runs/co2-durations.py $L/$label.rollout.jsonl > $L/$label.durations.txt 2>&1
(cd $P && git status --short && git log --format='%h %s' | head -8 && git worktree list && find . -path ./.git -prune -o -type f -print | sort) > $L/$label.tree-after.txt 2>&1
(ls -laR $B 2>&1) > $L/$label.backups.txt
(cat $P/.git/toolkit-v2/hook-errors.log 2>/dev/null || echo "(no hook-errors.log)") > $L/$label.hookerrors.txt
(ls -la $P/.memory 2>&1; echo; cat $P/.memory/MEMORY.md 2>&1; echo; echo '--- owner-preferences.md'; cat $P/.claude/rules/owner-preferences.md 2>&1) > $L/$label.memory.txt
(ls $P/.git/toolkit-v2/turns/ 2>/dev/null; cat $P/.git/toolkit-v2/turns/$tid.json 2>/dev/null) > $L/$label.turnfacts.txt
echo "$label start=$(cat $L/$label.start.txt) end=$(cat $L/$label.end.txt) thread=$tid $(cat $L/$label.exit.txt) approve=$APPROVE resume=$RESUME extra=$* skills=$(cat $L/$label.skills.txt)" >> $L/index.txt
