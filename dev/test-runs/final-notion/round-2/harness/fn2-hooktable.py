import json,glob,os,re,sys
L=sys.argv[1]
labels=[l.split()[0] for l in open(os.path.join(L,'index.txt'))]
print('| Session | Host | Briefing (SessionStart) | UserPromptSubmit | PreToolUse seen | PostToolUse records | Stop ran | Stop blocked |')
print('|---|---|---|---|---|---|---|---|')
for lab in labels:
    b=os.path.join(L,lab)
    hs=b+'.hookstate.json'
    st=json.load(open(hs)) if os.path.exists(hs) else None
    if os.path.exists(b+'.rollout.jsonl'):
        host='Codex'
        brief=False; ups=[]; pre=[]; tc=None
        for l in open(b+'.rollout.jsonl'):
            e=json.loads(l); p=e.get('payload',{})
            if not isinstance(p,dict): continue
            md=p.get('internal_chat_message_metadata_passthrough') or {}
            if 'hooks.additional_context' in (md.get('content_item_kinds') or []):
                t=' '.join(c.get('text','') for c in p.get('content',[]))
                if t.startswith('Project briefing'): brief=True
                elif 'joins a toolkit command' in t: pre.append('chained-command note')
                elif t.startswith('Voice'): pass
                else: ups.append(t[:60])
            if p.get('type')=='custom_tool_call_output' and 'blocked by PreToolUse' in json.dumps(p): pre.append('deny')
            if p.get('type')=='task_complete': tc=e.get('timestamp')
        turn=(st or {}).get('turn') or {}
        recs=len(turn.get('records') or [])
        upd=(st or {}).get('updated')
        stop='yes (state written %s, turn ended %s)'%(upd[11:19] if upd else '?', tc[11:19] if tc else '?') if st else 'no state file'
        up='turn %s recorded%s'%(turn.get('n'), '; '+'; '.join(ups) if ups else '') if turn else 'no'
        print('| %s | %s | %s | %s | %s | %s | %s | %s |'%(lab,host,'yes' if brief else 'no',up,', '.join(pre) or 'no output (allow)',recs,stop,turn.get('stopBlocked')))
    else:
        host='Claude Code'
        ev={}
        for l in open(b+'.jsonl'):
            e=json.loads(l)
            if e.get('type')=='system' and e.get('subtype')=='hook_response':
                ev.setdefault(e.get('hook_event'),[]).append((e.get('outcome'),(e.get('output') or '')[:40]))
        turn=(st or {}).get('turn') or {}
        brief=any('Project briefing' in o for _,o in ev.get('SessionStart',[])) or any('Project briefing' in json.dumps(x) for x in [l for l in open(b+'.jsonl') if 'Project briefing' in l][:1])
        print('| %s | %s | %s | %s | %s | %s | %s | %s |'%(lab,host,'yes' if brief else 'no','%d runs'%len(ev.get('UserPromptSubmit',[])),'%d runs'%len(ev.get('PreToolUse',[])),'%d runs; %d records'%(len(ev.get('PostToolUse',[])),len(turn.get('records') or [])),'%d runs'%len(ev.get('Stop',[])),turn.get('stopBlocked')))
