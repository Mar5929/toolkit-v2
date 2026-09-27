#!/bin/bash
# Usage: [APPROVE=1] run.sh <label> <prompt> [extra codex args...]
# One fresh codex exec session in the b-salesforce round 2 project, as Mike.
# APPROVE=1 stands in for Mike approving Codex prompts: --approve-for-me
# (on-request approvals, routed to automatic review) instead of --sandbox.
S=/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs
P=$S/b-salesforce-r2; T=$S/b-salesforce-r2-tools; L=$T/logs
id="$1"; prompt="$2"; shift 2
printf '%s' "$prompt" > "$L/$id.prompt.txt"
date -u '+%Y-%m-%dT%H:%M:%SZ' > "$L/$id.start"
if [ "$APPROVE" = 1 ]; then mode=(--approve-for-me); else mode=(--sandbox "${SANDBOX:-workspace-write}"); fi
echo "${mode[*]} $*" > "$L/$id.mode"
cd "$P"
env ZDOTDIR="$T/zdotdir" PATH="$T/bin:$PATH" codex exec --json \
  --dangerously-bypass-hook-trust "${mode[@]}" \
  -c "projects={\"$P\"={trust_level=\"trusted\"}}" \
  -c 'model_reasoning_effort="medium"' -c 'notify=[]' \
  "$@" \
  -C "$P" -o "$L/$id.last.txt" "$prompt" < /dev/null > "$L/$id.jsonl" 2> "$L/$id.stderr"
echo "exit=$?" > "$L/$id.exit"
date -u '+%Y-%m-%dT%H:%M:%SZ' > "$L/$id.end"
tid=$(head -5 "$L/$id.jsonl" | python3 -c 'import sys,json
for l in sys.stdin:
  try: d=json.loads(l)
  except Exception: continue
  if d.get("type")=="thread.started": print(d.get("thread_id")); break')
echo "$tid" > "$L/$id.thread"
if [ -z "$tid" ]; then echo "NO THREAD; stderr:"; head -5 "$L/$id.stderr"; exit 1; fi
f=$(ls ~/.codex/sessions/*/*/*/*"$tid"*.jsonl 2>/dev/null | head -1)
[ -n "$f" ] && cp "$f" "$L/$id.rollout.jsonl"
for g in $(grep -lE "\"parent_thread_id\": ?\"$tid\"" ~/.codex/sessions/*/*/*/rollout-*.jsonl 2>/dev/null); do
  case "$g" in *"$tid"*) continue;; esac
  cp "$g" "$L/$id.sub-$(basename "$g")"; echo "subagent: $g"
done
cp ~/.codex/plugins/data/toolkit-toolkit-v2/sessions/"$tid".json "$L/$id.hookstate.json" 2>/dev/null
python3 "$T/summarize.py" "$L/$id" > "$L/$id.summary.txt" 2>&1
echo "$id start=$(cat $L/$id.start) end=$(cat $L/$id.end) thread=$tid $(cat $L/$id.exit) mode=$(cat $L/$id.mode)" >> "$L/index.txt"
cat "$L/$id.exit"; echo "thread=$tid"
