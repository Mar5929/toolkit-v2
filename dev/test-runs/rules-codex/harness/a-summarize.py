import json, sys, os, re
base = sys.argv[1]
full = '--full' in sys.argv
print("PROMPT:", open(base+'.prompt.txt').read().strip())
print("THREAD:", open(base+'.thread.txt').read().strip() if os.path.exists(base+'.thread.txt') else '?')
skills=[]; cmds=[]
for l in open(base+'.jsonl'):
    try: e=json.loads(l)
    except: continue
    if e.get('type')!='item.completed': 
        if e.get('type') in ('turn.completed','turn.failed','error'): print('EVENT', json.dumps(e)[:400])
        continue
    it=e['item']; t=it.get('type')
    if t=='agent_message':
        print("\n[AGENT]", it['text'] if full else it['text'][:4000])
    elif t=='command_execution':
        c=it['command']
        m=re.findall(r'skills/([a-z-]+)/SKILL\.md', c)
        skills+=m
        out=it.get('aggregated_output','') or ''
        n = 1500 if 'toolkit' in c else 300
        if full: n=100000
        print(f"\n[CMD exit={it.get('exit_code')}] {c[:600]}\n  -> {out[:n]}")
    elif t=='file_change':
        print("\n[FILE_CHANGE]", json.dumps(it.get('changes'))[:600])
    elif t=='reasoning':
        pass
    else:
        print("\n[ITEM", t, "]", json.dumps(it)[:400])
print("\nSKILLS OPENED:", skills)
# hooks from rollout
r=base+'.rollout.jsonl'
if os.path.exists(r):
    for l in open(r):
        try: e=json.loads(l)
        except: continue
        p=e.get('payload',{})
        md=p.get('internal_chat_message_metadata_passthrough',{}) if isinstance(p,dict) else {}
        if 'hooks.additional_context' in (md.get('content_item_kinds') or []):
            txt=' '.join(c.get('text','') for c in p.get('content',[]))
            if txt.startswith('Voice commands'): continue
            print("\n[HOOK CONTEXT ord=%s]"%e.get('ordinal'), txt[:1200 if not full else 100000])
if os.path.exists(r):
    lines=[json.loads(l) for l in open(r) if l.strip()]
    outs={}
    for e in lines:
        p=e.get('payload',{})
        if isinstance(p,dict) and p.get('type','').endswith('_output') and p.get('call_id'):
            outs[p['call_id']]=p.get('output')
    print("\n===== ROLLOUT TOOL CALLS (ground truth) =====")
    for e in lines:
        p=e.get('payload',{})
        if isinstance(p,dict) and p.get('type') in ('custom_tool_call','function_call'):
            inp=str(p.get('input') or p.get('arguments'))
            o=outs.get(p.get('call_id'))
            os_=json.dumps(o) if o is not None else ''
            print("\n[CALL]", inp[:1500 if not full else 100000])
            if 'toolkit' in inp or full:
                print("  [OUT]", os_[:2500 if not full else 200000])
        if isinstance(p,dict) and p.get('type')=='message' and p.get('role')=='developer':
            md=p.get('internal_chat_message_metadata_passthrough',{})
            kinds=md.get('content_item_kinds') or []
            txt=' '.join(c.get('text','') for c in p.get('content',[]))
            if kinds and 'hooks.additional_context' not in kinds:
                print("\n[DEV MSG kinds=%s]"%kinds, txt[:600])
