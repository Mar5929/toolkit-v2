import json,re,sys
f=sys.argv[1]
order=[]
try:
    lines=open(f).readlines()
except Exception as e:
    print('(no rollout)'); sys.exit()
for l in lines:
    try: e=json.loads(l)
    except: continue
    p=e.get('payload',{})
    if isinstance(p,dict) and p.get('type') in ('custom_tool_call','function_call'):
        inp=str(p.get('input') or p.get('arguments'))
        for m in re.findall(r'(toolkit-v2|claude-toolkit)/([a-z-]+)/[0-9.]+/skills/([a-z-]+)/SKILL\.md', inp):
            k=m[2] if m[0]=='toolkit-v2' else m[1]+':'+m[2]+'(claude-toolkit)'
            if k not in order: order.append(k)
        for m in re.findall(r'(toolkit-v2|claude-toolkit)/([a-z-]+)/[0-9.]+/(skills/[a-z-]+/references/[A-Za-z0-9_./-]+|references/[A-Za-z0-9_./-]+|agents/[A-Za-z0-9_.-]+)', inp):
            k='  ref:'+m[1]+'/'+m[2]
            if k not in order: order.append(k)
        if p.get('name')=='spawn_agent' or 'spawn_agent' in str(p.get('name')):
            try:
                a=json.loads(p.get('arguments') or '{}')
                order.append('spawn_agent:'+str(a.get('task_name') or a.get('agent_type') or '?')+'(fork_turns='+str(a.get('fork_turns'))+')')
            except Exception:
                order.append('spawn_agent')
print(', '.join(order) if order else '(none read)')
