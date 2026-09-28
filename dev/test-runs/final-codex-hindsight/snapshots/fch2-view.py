import json, sys, re, os
L = '/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/final-codex-hindsight-r2-logs'
label = sys.argv[1]
n_out = int(sys.argv[2]) if len(sys.argv) > 2 else 500
n_hook = int(sys.argv[3]) if len(sys.argv) > 3 else 300
base = os.path.join(L, label)
print('PROMPT:', open(base + '.prompt.txt').read().strip())
print('TIME:', open(base + '.start.txt').read().strip(), '->', open(base + '.end.txt').read().strip())
skills = []
for l in open(base + '.jsonl'):
    try:
        e = json.loads(l)
    except Exception:
        continue
    if e.get('type') != 'item.completed':
        if e.get('type') in ('turn.failed', 'error'):
            print('EVENT', json.dumps(e)[:400])
        continue
    it = e['item']; t = it.get('type')
    if t == 'agent_message':
        print('\n[AGENT]', it['text'])
    elif t == 'command_execution':
        c = it['command']
        skills += re.findall(r'skills/([a-z-]+)/SKILL\.md', c)
        out = it.get('aggregated_output', '') or ''
        if 'SKILL.md' in c or '/references/' in c or '/assets/' in c:
            continue
        n = n_out if ('toolkit' in c or 'git ' in c) else 150
        print(f'\n[CMD exit={it.get("exit_code")}] {c[:900]}\n  -> {out[:n]}')
    elif t == 'file_change':
        print('\n[FILE_CHANGE]', json.dumps(it.get('changes'))[:300])
    elif t in ('reasoning', 'error'):
        pass
    else:
        print('\n[ITEM', t, ']', json.dumps(it)[:500])
print('\nSKILLS OPENED:', skills)
r = base + '.rollout.jsonl'
hooks = []
esc = []
if os.path.exists(r):
    for l in open(r):
        try:
            e = json.loads(l)
        except Exception:
            continue
        p = e.get('payload', {})
        if not isinstance(p, dict):
            continue
        md = p.get('internal_chat_message_metadata_passthrough', {})
        if 'hooks.additional_context' in (md.get('content_item_kinds') or []):
            txt = ' '.join(c.get('text', '') for c in p.get('content', []))
            if txt.startswith('Voice commands'):
                continue
            hooks.append(txt)
        if p.get('type') in ('custom_tool_call', 'function_call'):
            s = str(p.get('input') or p.get('arguments'))
            if 'require_escalated' in s:
                m = re.search(r'cmd:\s*"((?:[^"\\]|\\.)*)"', s)
                esc.append(m.group(1)[:200] if m else s[:200])
print('ESCALATED CALLS:', len(esc))
for x in esc:
    print('  ^', x)
print('HOOK CONTEXTS:', len(hooks))
for h in hooks:
    print('  *', h[:n_hook].replace('\n', ' | '))
hs = base + '.hookstate.json'
if os.path.exists(hs):
    d = json.load(open(hs))
    t = d.get('turn') or {}
    print('HOOKSTATE turns=%s keep=%s records=%s stopBlocked=%s lastStop=%s' % (d.get('turns'), t.get('keep'), [(r.get('kind'), r.get('what'), r.get('key')) for r in t.get('records', [])], t.get('stopBlocked'), (d.get('lastStopReason') or '')[:300]))
    if d.get('proposalNotes'):
        print('PROPOSAL NOTES:', d.get('proposalNotes'))
    if d.get('proposedSummaries'):
        print('PROPOSED SUMMARIES:', d.get('proposedSummaries'))
