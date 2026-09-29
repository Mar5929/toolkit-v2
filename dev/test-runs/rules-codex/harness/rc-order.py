import json,sys,re
f=sys.argv[1]; pats=sys.argv[2:]
for i,l in enumerate(open(f)):
    try: e=json.loads(l)
    except: continue
    p=e.get('payload',{})
    if not isinstance(p,dict): continue
    if p.get('type') in ('custom_tool_call','function_call'):
        inp=str(p.get('input') or p.get('arguments'))
        name=p.get('name')
        for pat in pats:
            if re.search(pat, inp) or re.search(pat, str(name)):
                print(i, e.get('timestamp'), name, inp[:260].replace('\n',' '))
                break
    if p.get('type','').endswith('_output'):
        o=str(p.get('output'))
        if 'acceptance' in o and ('verdict' in o.lower() or 'met' in o) and len(o)<6000 and any(re.search(x,'OUT') for x in pats):
            print(i, e.get('timestamp'), 'OUTPUT', o[:400].replace('\n',' '))
