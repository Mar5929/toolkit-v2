# Print every hook message Codex added to one session (from the session log).
import json, sys
for l in open(sys.argv[1]):
    try: d=json.loads(l)
    except Exception: continue
    p=d.get('payload',{})
    if not isinstance(p,dict) or p.get('type')!='message': continue
    md=p.get('internal_chat_message_metadata_passthrough',{}) or {}
    if 'hooks.additional_context' not in (md.get('content_item_kinds') or []): continue
    txt=' '.join(c.get('text','') for c in p.get('content',[]))
    if txt.startswith('Voice commands'): continue
    print('=== hook message', d.get('timestamp',''))
    print(txt); print()
