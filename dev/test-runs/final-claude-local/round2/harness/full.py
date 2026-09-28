import json, sys
# usage: full.py session.jsonl [substring]  -> prints each Bash command containing substring, and its full result
path=sys.argv[1]; sub=sys.argv[2] if len(sys.argv)>2 else ''
cmds={}
for line in open(path):
    try: e=json.loads(line)
    except Exception: continue
    if e.get('type')=='assistant':
        for c in e['message'].get('content',[]):
            if c.get('type')=='tool_use' and c['name']=='Bash' and sub in c['input'].get('command',''):
                cmds[c['id']]=c['input']['command']
    elif e.get('type')=='user':
        cont=e.get('message',{}).get('content',[])
        if isinstance(cont,list):
            for c in cont:
                if c.get('type')=='tool_result' and c.get('tool_use_id') in cmds:
                    body=c.get('content')
                    if isinstance(body,list): body=' '.join(x.get('text','') for x in body if isinstance(x,dict))
                    print('$ '+cmds[c['tool_use_id']]); print(body); print('-----')
