import json, sys, re, os
L = '/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/final-codex-hindsight-r2-logs'
for label in sys.argv[1:]:
    base = os.path.join(L, label)
    skills = []
    start = open(base + '.start.txt').read().strip()
    # rollout: only calls after this session's start time
    r = base + '.rollout.jsonl'
    if os.path.exists(r):
        for l in open(r):
            try: e = json.loads(l)
            except Exception: continue
            ts = e.get('timestamp', '')
            if ts and ts < start: continue
            p = e.get('payload', {})
            if not isinstance(p, dict): continue
            if p.get('type') in ('custom_tool_call', 'function_call'):
                s = str(p.get('input') or p.get('arguments'))
                for m in re.findall(r'([a-z-]+)/SKILL\.md', s):
                    if m not in skills: skills.append(m)
                for m in re.findall(r'/([a-z-]+)/references/([a-z0-9-]+\.md)', s):
                    x = m[0] + ':' + m[1]
                    if x not in skills: skills.append(x)
    print(label, skills)
