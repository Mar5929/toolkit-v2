#!/bin/zsh
L=/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/closeout2-codex-logs
lab=$1
cat $L/$lab.exit.txt
python3 - "$L/$lab.jsonl" <<'PY'
import json,sys
for l in open(sys.argv[1]):
    try: e=json.loads(l)
    except: continue
    if e.get('type')=='item.completed':
        it=e['item']
        if it.get('type')=='agent_message': print('[AGENT]', it['text']); print()
        elif it.get('type')=='command_execution' and ('toolkit' in it['command'] or 'git ' in it['command']):
            print('[CMD exit=%s]'%it.get('exit_code'), it['command'][:400]); print('   ->', (it.get('aggregated_output') or '')[:600].replace('\n','\n      ')); print()
    elif e.get('type') in ('turn.failed','error'): print('EVENT', json.dumps(e)[:500])
PY
echo "SKILLS: $(cat $L/$lab.skills.txt)"
