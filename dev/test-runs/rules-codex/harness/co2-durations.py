import json,sys,datetime
f=sys.argv[1]
def ts(s): return datetime.datetime.fromisoformat(s.replace('Z','+00:00'))
calls={}; outs={}
try: lines=[json.loads(l) for l in open(f) if l.strip()]
except Exception: print('(no rollout)'); sys.exit()
for e in lines:
    p=e.get('payload',{})
    if not isinstance(p,dict): continue
    if p.get('type') in ('custom_tool_call','function_call') and p.get('call_id'):
        calls[p['call_id']]=(e.get('timestamp'), str(p.get('input') or p.get('arguments')))
    if p.get('type','').endswith('_output') and p.get('call_id'):
        outs[p['call_id']]=e.get('timestamp')
mx=0
for cid,(t0,inp) in calls.items():
    t1=outs.get(cid)
    d=(ts(t1)-ts(t0)).total_seconds() if (t0 and t1) else None
    if 'toolkit' in inp:
        flag=' SLOW' if (d is None or d>45) else ''
        print(f"{d if d is not None else 'NO-OUTPUT'}s{flag} :: {inp[:220]!r}")
        if d and d>mx: mx=d
print('MAX toolkit call seconds:', mx)
