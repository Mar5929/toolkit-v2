#!/bin/bash
# Usage: run.sh <NN-name> <prompt> [extra codex -c args...]
S=/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs
P=$S/b-salesforce-r1; T=$S/b-salesforce-r1-tools
id="$1"; prompt="$2"; shift 2
L=$T/logs
printf '%s' "$prompt" > "$L/$id.prompt.txt"
date '+%Y-%m-%dT%H:%M:%S%z' > "$L/$id.start"
cd "$P"
env ZDOTDIR="$T/zdotdir" PATH="$T/bin:$PATH" codex exec --json \
  --dangerously-bypass-hook-trust --sandbox workspace-write \
  -c "projects={\"$P\"={trust_level=\"trusted\"}}" \
  -c 'model_reasoning_effort="medium"' \
  "$@" \
  -C "$P" -o "$L/$id.last.txt" "$prompt" < /dev/null > "$L/$id.jsonl" 2> "$L/$id.stderr"
echo "exit=$?" > "$L/$id.exit"
date '+%Y-%m-%dT%H:%M:%S%z' > "$L/$id.end"
tid=$(head -5 "$L/$id.jsonl" | python3 -c 'import sys,json
for l in sys.stdin:
  try:
    d=json.loads(l)
  except: continue
  if d.get("type")=="thread.started": print(d.get("thread_id")); break')
echo "$tid" > "$L/$id.thread"
f=$(ls ~/.codex/sessions/*/*/*/*"$tid"*.jsonl 2>/dev/null | head -1)
[ -n "$f" ] && cp "$f" "$L/$id.rollout.jsonl"
cat "$L/$id.exit"; echo "thread=$tid rollout=$f"
# Copy sub-agent rollouts spawned by this session.
for g in $(grep -lE "\"parent_thread_id\": ?\"$tid\"" ~/.codex/sessions/*/*/*/rollout-*.jsonl 2>/dev/null); do
  case "$g" in *"$tid"*) continue;; esac
  cp "$g" "$L/$id.sub-$(basename "$g")"; echo "subagent: $g"
done
cp ~/.codex/plugins/data/toolkit-toolkit-v2/sessions/"$tid".json "$L/$id.hookstate.json" 2>/dev/null
