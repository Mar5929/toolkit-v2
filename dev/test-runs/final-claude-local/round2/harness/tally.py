import json, glob, os, re, collections, sys
L = sys.argv[1]
files = sorted(glob.glob(os.path.join(L, 'sessions', '*.jsonl')))
by_event = collections.Counter(); bad = []; per_session = {}
toolkit_cmds = 0; toolkit_errors = []; denials = []; hook_outputs = collections.defaultdict(list)
for f in files:
    name = os.path.basename(f)[:-6]
    ev = collections.Counter(); cmds = {}
    for line in open(f):
        try: e = json.loads(line)
        except Exception: continue
        if e.get('type') == 'system' and e.get('subtype') == 'hook_response':
            he = e.get('hook_event') or (e.get('hook_name') or '').split(':')[0]
            by_event[he] += 1; ev[he] += 1
            if e.get('outcome') != 'success' or e.get('exit_code') not in (0, None):
                bad.append((name, e.get('hook_name'), e.get('outcome'), e.get('exit_code'), (e.get('stderr') or '')[:300]))
            out = e.get('output') or ''
            if out.strip() and he != 'SessionStart':
                try:
                    j = json.loads(out); hso = j.get('hookSpecificOutput', {})
                    txt = hso.get('additionalContext') or hso.get('permissionDecisionReason') or j.get('reason') or out
                    kind = hso.get('permissionDecision') or j.get('decision') or 'context'
                except Exception:
                    txt, kind = out, 'raw'
                if 'Voice commands' not in txt:
                    hook_outputs[he].append((name, kind, txt[:220]))
        elif e.get('type') == 'assistant':
            for c in e['message'].get('content', []):
                if c.get('type') == 'tool_use' and c['name'] == 'Bash':
                    cmd = c['input'].get('command', '')
                    if re.match(r'\s*toolkit\s', cmd):
                        cmds[c['id']] = cmd
        elif e.get('type') == 'user':
            cont = e.get('message', {}).get('content', [])
            if isinstance(cont, list):
                for c in cont:
                    if c.get('type') == 'tool_result' and c.get('tool_use_id') in cmds:
                        toolkit_cmds += 1
                        if c.get('is_error'):
                            body = c.get('content')
                            if isinstance(body, list): body = ' '.join(x.get('text', '') for x in body if isinstance(x, dict))
                            toolkit_errors.append((name, cmds[c['tool_use_id']][:160], (body or '')[:300]))
        elif e.get('type') == 'result':
            for d in e.get('permission_denials') or []:
                denials.append((name, d.get('tool_name'), json.dumps(d.get('tool_input'))[:220]))
    per_session[name] = dict(ev)
print('Sessions:', len(files))
print('Hook responses by event:', dict(by_event))
print('Hook responses that were not success/exit 0:', bad if bad else 'none')
print()
for n, ev in per_session.items(): print(f'  {n}: {ev}')
print()
print('Toolkit commands run (main agent and subagents):', toolkit_cmds)
print('Toolkit commands that returned an error:', len(toolkit_errors))
for t in toolkit_errors: print('  ', t)
print()
print('Permission denials (result events):', len(denials))
for d in denials: print('  ', d)
print()
print('Non-briefing hook outputs:')
for he, rows in hook_outputs.items():
    print(' ', he, len(rows))
    for r in rows: print('    ', r)
