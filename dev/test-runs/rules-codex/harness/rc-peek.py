import json,sys
f=sys.argv[1]
for l in open(f):
    try: e=json.loads(l)
    except: continue
    if e.get('type')=='item.completed':
        it=e['item']
        if it.get('type')=='agent_message': print('[AGENT]', it['text'][:700])
        elif it.get('type')=='command_execution': print('[CMD %s]'%it.get('exit_code'), it['command'][:200])
        elif it.get('type') not in ('reasoning',): print('[ITEM]', it.get('type'), json.dumps(it)[:200])
