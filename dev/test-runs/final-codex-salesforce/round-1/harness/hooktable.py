import json, glob, os, re, sys
L=os.path.dirname(os.path.abspath(__file__))+'/logs'
for idx in open(L+'/index.txt'):
    sid=idx.split()[0]
    hooks=open(f'{L}/{sid}.hooks.txt').read() if os.path.exists(f'{L}/{sid}.hooks.txt') else ''
    brief='Project briefing:' in hooks
    notes=len(re.findall(r'=== hook message', hooks))
    hs={}
    try: hs=json.load(open(f'{L}/{sid}.hookstate.json'))
    except Exception: pass
    t=hs.get('turn',{}) or {}
    keep=t.get('keep')
    recs=len(t.get('records',[]) or [])
    edits=len(t.get('edits',[]) or [])
    sb=hs.get('stopBlocked', t.get('stopBlocked'))
    # PreToolUse denials from rollout
    deny=0; tkchain=0
    r=f'{L}/{sid}.rollout.jsonl'
    if os.path.exists(r):
        s=open(r).read()
        deny=s.count('blocked by PreToolUse hook')
        tkchain=s.count('Run each toolkit command alone')
    print(f"{sid:34} briefing={'yes' if brief else 'no ':3} hookmsgs={notes:2} keep={keep!s:14} records={recs:3} edits={edits} stopBlocked={sb} preToolDenies={deny} chainNotes={tkchain}")
