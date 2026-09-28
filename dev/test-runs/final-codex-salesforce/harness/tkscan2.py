# Toolkit commands that exited non-zero or were refused, per session (from the session logs).
import json, glob, os, re
L=os.path.dirname(os.path.abspath(__file__))+'/logs'
for r in sorted(glob.glob(L+'/s*.rollout.jsonl')):
    sid=os.path.basename(r).replace('.rollout.jsonl','')
    lines=[]
    for l in open(r):
        try: lines.append(json.loads(l))
        except: pass
    outs={}
    for e in lines:
        p=e.get('payload',{})
        if isinstance(p,dict) and p.get('type','').endswith('_output') and p.get('call_id'):
            o=p.get('output')
            if isinstance(o,list): o='\n'.join(x.get('text','') for x in o if isinstance(x,dict))
            outs[p['call_id']]=o if isinstance(o,str) else json.dumps(o)
    for e in lines:
        p=e.get('payload',{})
        if not isinstance(p,dict) or p.get('type') not in ('custom_tool_call','function_call'): continue
        inp=p.get('input') or p.get('arguments') or ''
        o=outs.get(p.get('call_id'),'')
        if not re.search(r'toolkit\s+(work|memory|doctor|brief|config|handoff-backup|init|decision)', inp): continue
        codes=[int(x) for x in re.findall(r'"exit_code"\s*:\s*(-?\d+)', o)]
        m=re.search(r'Process exited with code (\d+)|Exit code:? (\d+)', o)
        bad=[c for c in codes if c!=0]
        refused=re.search(r'rejected by|approval required|not approved|declined', o, re.I)
        if bad or refused:
            cmds=re.findall(r'toolkit\s+[a-z-]+(?:\s+[a-z-]+)?[^\n"\'`]{0,60}', inp)
            print(sid, 'exit', bad, 'refused' if refused else '', '|', cmds[:3], '|', re.sub(r'\s+',' ',o)[:260])
