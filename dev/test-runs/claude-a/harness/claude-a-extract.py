import json, sys, glob, os, re
L = sys.argv[1]
V2 = {'toolkit','work','memory','session-skills','git-workflows'}
rows = []
for jf in sorted(glob.glob(os.path.join(L, 's[0-9][0-9].jsonl'))):
    name = os.path.basename(jf)[:-6]
    prompt = open(os.path.join(L, name + '.prompt.txt')).read().strip()
    start = open(os.path.join(L, name + '.start')).read().strip()
    end = open(os.path.join(L, name + '.end')).read().strip()
    init = None; skills = []; tk = []; agents = []; hooks = {}; hookout = []; denies = []; res = None
    denied_ids = set()
    for line in open(jf):
        e = json.loads(line)
        if e.get('type') == 'system' and e.get('subtype') == 'permission_denied': denied_ids.add(e.get('tool_use_id'))
    for line in open(jf):
        e = json.loads(line)
        t, st = e.get('type'), e.get('subtype')
        sub = bool(e.get('parent_tool_use_id'))
        if t == 'system' and st == 'init': init = e
        elif t == 'system' and st == 'hook_response':
            hooks[e['hook_event']] = hooks.get(e['hook_event'], 0) + 1
            out = (e.get('output') or '').strip()
            if out: hookout.append((e['hook_name'], out))
        elif t == 'system' and st == 'permission_denied':
            denies.append(e.get('message', '')[:160])
        elif t == 'assistant':
            for c in e['message'].get('content', []):
                if c.get('type') != 'tool_use': continue
                i = c.get('input', {})
                if c['name'] == 'Skill': skills.append(i.get('skill') + (' (subagent)' if sub else ''))
                elif c['name'] in ('Agent', 'Task'): agents.append(i.get('subagent_type'))
                elif c['name'] == 'Bash':
                    for part in re.split(r'\n|&&|;|\|\|', i.get('command', '')):
                        p = part.strip()
                        if p.startswith('toolkit ') or p.startswith('(toolkit '):
                            tk.append(p.lstrip('(')[:220] + ('   [refused by Claude Code before it ran]' if c.get('id') in denied_ids else ''))
        elif t == 'result': res = e
    pl = [p['source'] for p in init.get('plugins', [])]
    nonv2 = [p['source'] for p in init.get('plugins', []) if not (p['source'].endswith('@builtin') or (p['source'].endswith('@inline') and p['name'] in V2))]
    errs = [k for k in init if 'error' in k.lower()]
    rows.append(dict(name=name, prompt=prompt, start=start, end=end, sid=init['session_id'], plugins=pl, nonv2=nonv2, errs=errs,
        style=init.get('output_style'), skills=skills, agents=agents, tk=tk, hooks=hooks, hookout=hookout, denies=denies,
        cost=res.get('total_cost_usd'), turns=res.get('num_turns'), final=res.get('result'), is_error=res.get('is_error')))
json.dump(rows, open(os.path.join(L, 'extract.json'), 'w'), indent=1)
for r in rows:
    print(r['name'], r['sid'], 'nonv2', r['nonv2'], 'errs', r['errs'], 'style', r['style'], 'skills', r['skills'], 'agents', r['agents'], 'hooks', r['hooks'], 'denies', len(r['denies']), 'cost', round(r['cost'],2), 'err', r['is_error'])
print('total cost', round(sum(r['cost'] for r in rows), 2))
