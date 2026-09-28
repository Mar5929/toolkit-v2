import json,os,sys,datetime,re
L=sys.argv[1]
labels=[l.split()[0] for l in open(L+'/index.txt')]
def ts(s): return datetime.datetime.fromisoformat(s.replace('Z','+00:00'))
print('label | briefing | other hook context | blocks | hook state turn start | records | edits | last agent msg | state updated | stop gap s')
for lab in labels:
    h=open(f'{L}/{lab}.hooks.txt').read() if os.path.exists(f'{L}/{lab}.hooks.txt') else ''
    brief=h.count('Project briefing:')
    ctx=h.count('=== HOOK additional_context')-brief
    blocks=h.count('HOOK BLOCK')
    st={}
    try: st=json.load(open(f'{L}/{lab}.hookstate.json'))
    except Exception: pass
    turn=(st.get('turn') or {}) if st else {}
    recs=len(turn.get('records',[])); eds=len(turn.get('edits',[]))
    last=None
    try:
        for l in open(f'{L}/{lab}.rollout.jsonl'):
            e=json.loads(l); p=e.get('payload',{})
            if isinstance(p,dict) and p.get('type')=='message' and p.get('role')=='assistant': last=e.get('timestamp')
            if isinstance(p,dict) and p.get('type')=='agent_message': last=e.get('timestamp')
    except Exception: pass
    upd=st.get('updated') if st else None
    gap=(ts(upd)-ts(last)).total_seconds() if (upd and last) else None
    print(f"{lab} | {brief} | {ctx} | {blocks} | {turn.get('startedAt')} | {recs} | {eds} | {last} | {upd} | {gap}")
