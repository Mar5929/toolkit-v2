import json,sys
f=sys.argv[1]
try: lines=[json.loads(l) for l in open(f) if l.strip()]
except Exception: print('(no rollout)'); sys.exit()
for e in lines:
    p=e.get('payload',{})
    if not isinstance(p,dict): continue
    md=p.get('internal_chat_message_metadata_passthrough',{}) or {}
    kinds=md.get('content_item_kinds') or []
    if 'hooks.additional_context' in kinds:
        txt='\n'.join(c.get('text','') for c in p.get('content',[]))
        if txt.startswith('Voice commands'): continue
        print('=== HOOK additional_context (ordinal %s, ts %s)'%(e.get('ordinal'), e.get('timestamp')))
        print(txt); print()
    t=json.dumps(p)
    if 'blocked by' in t and ('PreToolUse' in t or 'hook' in t.lower()) and p.get('type','').endswith('_output'):
        print('=== HOOK BLOCK in tool output (ts %s)'%e.get('timestamp'))
        print(str(p.get('output'))[:3000]); print()
    if p.get('type') in ('hook_event','hook') or 'hook_run' in str(p.get('type')):
        print('=== HOOK EVENT', t[:1500]); print()
