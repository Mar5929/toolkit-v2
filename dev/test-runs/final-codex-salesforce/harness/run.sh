#!/bin/bash
# Usage: [APPROVE=1] [RESUME=<thread>] run.sh <label> <prompt> [extra codex args...]
# One codex exec session in the final-codex-salesforce-r2 project, as Mike.
# A new session each time, except RESUME=<thread>, which sends Mike's next
# message in the same chat (codex exec resume).
# APPROVE=1 stands in for Mike approving Codex prompts: --approve-for-me
# (on-request approvals, routed to automatic review) instead of --sandbox.
S=/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs
P=$S/final-codex-salesforce-r2; T=$S/final-codex-salesforce-r2-tools; L=$T/logs
id="$1"; prompt="$2"; shift 2
printf '%s' "$prompt" > "$L/$id.prompt.txt"
date -u '+%Y-%m-%dT%H:%M:%SZ' > "$L/$id.start"
pre=0
if [ -n "$RESUME" ]; then pf=$(ls ~/.codex/sessions/*/*/*/*"$RESUME"*.jsonl 2>/dev/null | head -1); [ -n "$pf" ] && pre=$(wc -l < "$pf"); fi
if [ "$APPROVE" = 1 ]; then mode=(--approve-for-me); else mode=(--sandbox "${SANDBOX:-workspace-write}"); fi
cd "$P"
if [ -n "$RESUME" ]; then
  echo "resume $RESUME ${mode[*]} $*" > "$L/$id.mode"
  env ZDOTDIR="$T/zdotdir" PATH="$T/bin:$PATH" codex exec "${mode[@]}" -C "$P" resume --json \
    --dangerously-bypass-hook-trust \
    -c "projects={\"$P\"={trust_level=\"trusted\"}}" \
    -c 'model_reasoning_effort="medium"' -c 'notify=[]' \
    "$@" \
    -o "$L/$id.last.txt" "$RESUME" "$prompt" < /dev/null > "$L/$id.jsonl" 2> "$L/$id.stderr"
else
  echo "${mode[*]} $*" > "$L/$id.mode"
  env ZDOTDIR="$T/zdotdir" PATH="$T/bin:$PATH" codex exec --json \
    --dangerously-bypass-hook-trust "${mode[@]}" \
    -c "projects={\"$P\"={trust_level=\"trusted\"}}" \
    -c 'model_reasoning_effort="medium"' -c 'notify=[]' \
    "$@" \
    -C "$P" -o "$L/$id.last.txt" "$prompt" < /dev/null > "$L/$id.jsonl" 2> "$L/$id.stderr"
fi
echo "exit=$?" > "$L/$id.exit"
date -u '+%Y-%m-%dT%H:%M:%SZ' > "$L/$id.end"
tid=$(head -5 "$L/$id.jsonl" | python3 -c 'import sys,json
for l in sys.stdin:
  try: d=json.loads(l)
  except Exception: continue
  if d.get("type")=="thread.started": print(d.get("thread_id")); break')
[ -z "$tid" ] && tid="$RESUME"
echo "$tid" > "$L/$id.thread"
if [ -z "$tid" ]; then echo "NO THREAD; stderr:"; head -5 "$L/$id.stderr"; exit 1; fi
f=$(ls ~/.codex/sessions/*/*/*/*"$tid"*.jsonl 2>/dev/null | head -1)
if [ -n "$f" ]; then
  if [ -n "$RESUME" ]; then
    # Keep only the lines after the earlier part of the chat.
    tail -n +$((pre+1)) "$f" > "$L/$id.rollout.jsonl"; cp "$f" "$L/$id.rollout-full.jsonl"
  else
    cp "$f" "$L/$id.rollout.jsonl"
  fi
fi
for g in $(grep -lE "\"parent_thread_id\": ?\"$tid\"" ~/.codex/sessions/*/*/*/rollout-*.jsonl 2>/dev/null); do
  case "$g" in *"$tid"*) continue;; esac
  cp "$g" "$L/$id.sub-$(basename "$g")"; echo "subagent: $g"
done
cp ~/.codex/plugins/data/toolkit-toolkit-v2/sessions/"$tid".json "$L/$id.hookstate.json" 2>/dev/null
python3 "$T/summarize.py" "$L/$id" > "$L/$id.summary.txt" 2>&1
python3 "$T/hooks.py" "$L/$id.rollout.jsonl" > "$L/$id.hooks.txt" 2>&1
echo "$id start=$(cat $L/$id.start) end=$(cat $L/$id.end) thread=$tid $(cat $L/$id.exit) mode=$(cat $L/$id.mode)" >> "$L/index.txt"
cat "$L/$id.exit"; echo "thread=$tid"
