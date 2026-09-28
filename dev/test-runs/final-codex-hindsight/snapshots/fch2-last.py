import json, sys
L='/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs/final-codex-hindsight-r2-logs/'
for label in sys.argv[1:]:
    msgs=[]
    for l in open(L+label+'.jsonl'):
        e=json.loads(l); it=e.get('item') or {}
        if e.get('type')=='item.completed' and it.get('type')=='agent_message': msgs.append(it['text'])
    print('=== '+label+' final message:\n'+(msgs[-1] if msgs else '(none)'))
