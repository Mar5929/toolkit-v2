#!/bin/bash
# usage: fn-peek.sh <label> [chars]: one line per finished command or message
L=/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/final-notion-r2-logs
python3 - "$L/$1.jsonl" "${2:-300}" <<'PY'
import json,sys
n=int(sys.argv[2])
for l in open(sys.argv[1]):
  try: d=json.loads(l)
  except Exception: continue
  it=d.get('item') or {}
  if d['type']=='item.completed' and it.get('type') in ('command_execution','agent_message'):
    print(it['type'][:3], it.get('exit_code'), '|', (it.get('command') or it.get('text') or '')[:n].replace('\n',' '))
  elif d['type']=='item.completed' and it.get('type') not in ('reasoning',):
    print(it.get('type'), json.dumps(it)[:200])
  if d['type'] in ('turn.completed','turn.failed','error'): print('SESSION', d['type'], json.dumps(d)[:300])
PY
[ -f "$L/$1.done" ] && echo "== DONE $(cat $L/$1.exit.txt)"
