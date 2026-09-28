# For each session: the time of the last agent message (session log) and the
# time the toolkit hook state was last written. Only the Stop hook writes the
# state after the final reply.
import json, os, glob
L=os.path.dirname(os.path.abspath(__file__))+'/logs'
for idx in open(L+'/index.txt'):
    sid=idx.split()[0]
    r=f'{L}/{sid}.rollout.jsonl'; h=f'{L}/{sid}.hookstate.json'
    last=None
    if os.path.exists(r):
        for l in open(r):
            try: d=json.loads(l)
            except: continue
            p=d.get('payload',{})
            if isinstance(p,dict) and p.get('type')=='message' and p.get('role')=='assistant': last=d.get('timestamp')
    upd=None; sb=None; lsr=None
    if os.path.exists(h):
        hs=json.load(open(h)); upd=hs.get('updated'); sb=(hs.get('turn') or {}).get('stopBlocked'); lsr=hs.get('lastStopReason')
    ok = 'stop-hook-ran' if (upd and last and upd>=last) else ('no-state' if not upd else 'CHECK')
    print(f'{sid:28} lastReply={last} stateWritten={upd} {ok} stopBlocked={sb} lastStopReason={lsr}')
