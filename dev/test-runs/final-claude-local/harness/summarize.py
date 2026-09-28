import json, sys
V2 = {'toolkit','work','memory','session-skills','git-workflows'}
path = sys.argv[1]
def short(s, n=1500):
    s = s if isinstance(s, str) else json.dumps(s)
    return s if len(s) <= n else s[:n] + f'... [{len(s)} chars]'
for line in open(path):
    try: e = json.loads(line)
    except Exception: print('BADLINE', line[:200]); continue
    t, st = e.get('type'), e.get('subtype')
    sub = ' [subagent]' if e.get('parent_tool_use_id') else ''
    if t == 'system' and st == 'init':
        pl = e.get('plugins', [])
        names = [p['source'] for p in pl]
        nonv2 = [p['source'] for p in pl if not (p['source'].endswith('@builtin') or ((p['source'].endswith('@inline') or p['source'].endswith('@toolkit-v2')) and p['name'] in V2))]
        errs = {k: v for k, v in e.items() if 'error' in k.lower()}
        print(f"INIT session={e['session_id']} version={e.get('claude_code_version')} model={e.get('model')} permissionMode={e.get('permissionMode')} cwd={e.get('cwd')}")
        print(f"INIT plugins={names}")
        print(f"INIT non-V2 non-builtin plugins={nonv2} error_fields={errs} mcp={e.get('mcp_servers')}")
        print(f"INIT v2 skills={[s for s in e.get('skills',[]) if ':' in s]}")
        print(f"INIT output_style={e.get('output_style')}")
    elif t == 'system' and st in ('hook_started',):
        pass
    elif t == 'system' and st == 'hook_response':
        print(f"HOOK {e.get('hook_name')} outcome={e.get('outcome')} exit={e.get('exit_code')}{sub}")
        out = e.get('output') or e.get('stdout') or ''
        if out.strip(): print('  HOOK-OUTPUT: ' + short(out, 7000 if e.get('hook_event')=='SessionStart' else 2500))
        if (e.get('stderr') or '').strip(): print('  HOOK-STDERR: ' + short(e['stderr'], 1500))
    elif t == 'system':
        if st not in ('post_turn_summary', 'status', 'thinking_tokens', 'task_summary'): print(f"SYSTEM {st}: {short(e, 400)}")
    elif t == 'assistant':
        for c in e['message'].get('content', []):
            if c.get('type') == 'text':
                print(f"ASSISTANT{sub}: {short(c['text'], 6000)}")
            elif c.get('type') == 'tool_use':
                n, i = c['name'], c.get('input', {})
                if n == 'Skill': d = f"skill={i.get('skill')} args={i.get('args','')}"
                elif n == 'Bash': d = i.get('command')
                elif n in ('Edit','MultiEdit','Write','Read'): d = i.get('file_path') + (f" old={short(i.get('old_string',''),300)!r} new={short(i.get('new_string',''),300)!r}" if n=='Edit' else '')
                elif n in ('Agent','Task'): d = f"type={i.get('subagent_type')} desc={i.get('description')} prompt={short(i.get('prompt',''),800)}"
                else: d = short(i, 400)
                print(f"TOOL{sub} {n}: {d}")
    elif t == 'user':
        cont = e.get('message', {}).get('content', [])
        if isinstance(cont, list):
            for c in cont:
                if c.get('type') == 'tool_result':
                    body = c.get('content')
                    if isinstance(body, list): body = ' '.join(x.get('text','') for x in body if isinstance(x, dict))
                    print(f"  RESULT{sub}{' ERROR' if c.get('is_error') else ''}: {short(body or '', 900)}")
    elif t == 'result':
        print(f"RESULT-END subtype={st} is_error={e.get('is_error')} turns={e.get('num_turns')} cost={e.get('total_cost_usd')} duration_ms={e.get('duration_ms')}")
        print('PERMISSION-DENIALS: ' + json.dumps(e.get('permission_denials') or []))
        print('FINAL: ' + short(e.get('result') or '', 8000))
