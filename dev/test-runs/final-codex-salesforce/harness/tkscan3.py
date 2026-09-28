# Precise stall scan: every tool output in every session, looking for prompts,
# time-outs, approval refusals, and non-zero exits of toolkit commands.
import json, glob, os, re
L=os.path.dirname(os.path.abspath(__file__))+'/logs'
pat=re.compile(r'timed out|\[y/N\]|\(y/n\)|press enter|approval required|rejected by|was rejected|not approved by|requires approval|escalat|sandbox_permissions|waiting for input', re.I)
for r in sorted(glob.glob(L+'/s*.rollout.jsonl')):
    sid=os.path.basename(r).replace('.rollout.jsonl','')
    lines=[]
    for l in open(r):
        try: lines.append(json.loads(l))
        except: pass
    calls={}
    for e in lines:
        p=e.get('payload',{})
        if isinstance(p,dict) and p.get('type') in ('custom_tool_call','function_call'):
            calls[p.get('call_id')]=(p.get('name'), p.get('input') or p.get('arguments') or '')
    for e in lines:
        p=e.get('payload',{})
        if not (isinstance(p,dict) and p.get('type','').endswith('_output') and p.get('call_id')): continue
        o=p.get('output')
        if isinstance(o,list): o='\n'.join(x.get('text','') for x in o if isinstance(x,dict))
        o=o if isinstance(o,str) else json.dumps(o)
        name,inp=calls.get(p['call_id'],('?',''))
        # toolkit non-zero exits: find exit_code fields next to a toolkit command
        if re.search(r'(^|[\s"\'`(;&|])toolkit\s', inp):
            for m in re.finditer(r'"exit_code":\s*([1-9]\d*)[^}]*?"output":"((?:[^"\\]|\\.){0,220})', o):
                print(f'{sid}\tNONZERO exit={m.group(1)}\t{m.group(2)[:220]}')
        for m in pat.finditer(o):
            s=o[max(0,m.start()-160):m.end()+160].replace('\n',' ')
            print(f'{sid}\tMATCH [{m.group(0)}] in {name}\t{s}')
            break
        if 'escalat' in inp or 'require_escalated' in inp:
            print(f'{sid}\tESCALATION REQUEST in {name}\t{inp[:300]}')
