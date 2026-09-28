# Scan every session for toolkit commands: count, exit codes other than 0, long wall times,
# approval or sandbox refusals, and any question-box tool call.
import json, glob, os, re, sys
L=os.path.dirname(os.path.abspath(__file__))+'/logs'
tot=0; flagged=[]; qbox=[]; walls=[]
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
            o=p.get('output'); 
            if isinstance(o,list): o='\n'.join(x.get('text','') for x in o if isinstance(x,dict))
            outs[p['call_id']]=o if isinstance(o,str) else json.dumps(o)
    for e in lines:
        p=e.get('payload',{})
        if not isinstance(p,dict): continue
        if p.get('type') in ('custom_tool_call','function_call'):
            name=p.get('name'); inp=p.get('input') or p.get('arguments') or ''
            if 'request_user_input' in (name or '') or 'request_user_input' in inp: qbox.append((sid,name))
            if not re.search(r'(^|[\s"\'`(;&|])toolkit\s', inp): continue
            o=outs.get(p.get('call_id'),'')
            n=len(re.findall(r'(?:^|[\s"\'`(;&|])toolkit\s+(?:work|memory|doctor|brief|config|handoff-backup|init|decision|export|import|sync)', inp))
            tot+=n
            for m in re.finditer(r'wall_time_seconds"?\s*:\s*([0-9.e-]+)', o): 
                try: walls.append((float(m.group(1)),sid))
                except: pass
            for m in re.finditer(r'Wall time ([0-9.]+) seconds', o): walls.append((float(m.group(1)),sid))
            low=o.lower()
            for kw in ('rejected','approval','timed out','timeout','operation not permitted','eperm','escalat','waiting for','prompt'):
                if kw in low:
                    i=low.find(kw); flagged.append((sid,kw,o[max(0,i-200):i+200].replace('\n',' ')))
                    break
print('toolkit command mentions:',tot)
print('question-box calls:',qbox)
walls.sort(reverse=True); print('longest wall times (s):',walls[:8])
for f in flagged: print('FLAG',f[0],f[1],'::',f[2][:400]); print()
