# Summarize one Codex session: prompt, every tool call from the session log
# (ground truth), agent messages, skills read, toolkit commands, hook context.
import json, sys, os, re
base = sys.argv[1]
full = '--full' in sys.argv
print("PROMPT:", open(base+'.prompt.txt').read().strip())
print("THREAD:", open(base+'.thread').read().strip() if os.path.exists(base+'.thread') else '?')
r = base+'.rollout.jsonl'
if not os.path.exists(r):
    print("NO ROLLOUT"); sys.exit()
lines=[]
for l in open(r):
    try: lines.append(json.loads(l))
    except Exception: pass
outs={}
for e in lines:
    p=e.get('payload',{})
    if isinstance(p,dict) and p.get('type','').endswith('_output') and p.get('call_id'):
        o=p.get('output')
        if isinstance(o,list): o='\n'.join(x.get('text','') for x in o if isinstance(x,dict))
        outs[p['call_id']]=o if isinstance(o,str) else json.dumps(o)
skills=[]; tk=[]
def cmds_of(inp):
    # exec JS tool: pull out cmd strings
    res=[]
    for m in re.finditer(r'cmd\s*:\s*("(?:[^"\\]|\\.)*"|\'(?:[^\'\\]|\\.)*\'|`(?:[^`\\]|\\.)*`)', inp):
        s=m.group(1)
        try: s=json.loads(s) if s[0]=='"' else s[1:-1]
        except Exception: s=s[1:-1]
        res.append(s)
    return res
for e in lines:
    p=e.get('payload',{})
    if not isinstance(p,dict): continue
    t=p.get('type')
    if t=='message' and p.get('role')=='assistant':
        txt=' '.join(c.get('text','') for c in p.get('content',[]))
        print("\n[AGENT]", txt if full else txt[:6000])
    elif t=='message' and p.get('role') in ('developer','user'):
        md=p.get('internal_chat_message_metadata_passthrough',{}) or {}
        kinds=md.get('content_item_kinds') or []
        txt=' '.join(c.get('text','') for c in p.get('content',[]))
        if 'hooks.additional_context' in kinds:
            if txt.startswith('Voice commands'): continue
            print("\n[HOOK CONTEXT]", txt[:3000 if not full else 100000])
    elif t in ('custom_tool_call','function_call'):
        inp=p.get('input') or p.get('arguments') or ''
        name=p.get('name')
        o=outs.get(p.get('call_id'),'')
        cs=cmds_of(inp) if name=='exec' else []
        if name in ('shell','exec_command','shell_command'):
            try:
                a=json.loads(inp); c=a.get('command') or a.get('cmd'); cs=[c if isinstance(c,str) else ' '.join(c)]
            except Exception: pass
        if name=='exec':
            # Commands can also sit in a JS array of strings: pick up every
            # string literal that looks like a command.
            for m in re.finditer(r'"((?:[^"\\]|\\.)*)"', inp):
                try: x=json.loads('"'+m.group(1)+'"')
                except Exception: x=m.group(1)
                if x not in cs and re.match(r'(toolkit|sf|git|cat|sed|rg) ', x): cs.append(x)
        # Skill files read: scan the whole tool input, which also covers
        # commands written as JS template literals.
        skills+=re.findall(r'skills/([a-z0-9-]+)/SKILL\.md', inp if name=='exec' else ' '.join(cs))
        for c in cs:
            for m in re.finditer(r'(?:^|[\s;&|(])(toolkit\s[^\n;&|]*)', c):
                tk.append(m.group(1)[:400])
        big = any(('toolkit' in c or re.search(r'(^|\s)sf\s', c) or 'git ' in c) for c in cs) or name=='apply_patch'
        n = 3000 if big else 500
        if full: n=200000
        if name=='apply_patch' or (name=='exec' and 'apply_patch' in inp):
            files=re.findall(r'\*\*\* (?:Add|Update|Delete) File: (.+)', inp)
            print(f"\n[PATCH] files={files}\n  -> {o[:n]}")
            if full: print(inp)
            continue
        print(f"\n[CALL {name}] {(chr(10)+'   ').join(cs) if cs else inp[:1500]}\n  -> {o[:n]}")
    elif t=='reasoning':
        pass
print("\nSKILLS OPENED (SKILL.md read):", skills)
print("\nTOOLKIT COMMANDS:")
for x in tk: print("  ", x)
