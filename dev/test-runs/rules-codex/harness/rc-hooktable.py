import json,os,sys,re
L=sys.argv[1]
labels=[l.split()[0] for l in open(L+'/index.txt')]
print('| Turn | SessionStart briefing | UserPromptSubmit (turn file: keep / saveWords / answersMemoryQuestion) | Keep line added | PostToolUse records | PreToolUse deny | Stop (proposal saved / lastReplyAskedMemory) |')
print('|---|---|---|---|---|---|---|')
for lab in labels:
    h=open(f'{L}/{lab}.hooks.txt').read() if os.path.exists(f'{L}/{lab}.hooks.txt') else ''
    brief=h.count('Project briefing:')
    keepline=h.count('The owner stated something to keep')
    blocks=h.count('HOOK BLOCK')
    st={}
    try: st=json.load(open(f'{L}/{lab}.hookstate.json'))
    except Exception: pass
    turn=(st.get('turn') or {}) if st else {}
    recs=turn.get('records',[])
    nrec=len(recs)
    prop=sum(1 for r in recs if r.get('proposal'))
    tf='-'
    tid=open(f'{L}/{lab}.thread.txt').read().strip()
    try:
        t=open(f'{L}/{lab}.turnfacts.txt').read()
        j=json.loads(t[t.index('{'):])
        if j.get('sessionId')==tid: tf=f"{j.get('keep')} / {j.get('saveWords')} / {j.get('answersMemoryQuestion')} (turn {j.get('turn')})"
    except Exception: pass
    print(f"| {lab} | {brief} | {tf} | {keepline} | {nrec} | {blocks} | {prop} / {st.get('lastReplyAskedMemory') if st else '-'} |")
