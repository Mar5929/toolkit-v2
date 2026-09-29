# Runs the toolkit plugin's Claude Code hook commands (the same command hooks.json runs)
# with Claude Code-shaped JSON input, in a copy of the test project. No model is involved.
import json, os, subprocess, sys
S = '/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs'
L = S + '/confirm-claude-local-logs'
PROJ = sys.argv[1]
ROOT = '/Users/michaelrihm/Documents/Projects/toolkit-v2/plugins/toolkit'
ENV = dict(PATH=os.environ['PATH'], HOME=L + '/home', TOOLKIT_V2_CONFIG_DIR=L + '/tkconfig',
           CLAUDE_PLUGIN_ROOT=ROOT, CLAUDE_PLUGIN_DATA=L + '/hookcheck-data', CLAUDE_PROJECT_DIR=PROJ)
SID = 'hookcheck-0001'
def run(event, payload):
    base = dict(session_id=SID, transcript_path=L + '/hookcheck-transcript.jsonl', cwd=PROJ, permission_mode='acceptEdits')
    base.update(payload)
    p = subprocess.run(['node', ROOT + '/bin/toolkit', 'hook', event, '--host', 'claude'], input=json.dumps(base),
                       capture_output=True, text=True, env=ENV, cwd=PROJ)
    return p.returncode, p.stdout.strip(), p.stderr.strip()
def bash(cmd, tid):
    return run('pre-tool', dict(hook_event_name='PreToolUse', tool_name='Bash', tool_input=dict(command=cmd, description='Commit'), tool_use_id=tid))
# AI credit lines built from parts, so this file holds no whole one (final re-review R-M11).
AI = 'Cla' + 'ude'
MAIL = 'noreply' + '@' + 'anthro' + 'pic.com'
GEN = 'Gener' + 'ated with'
cases = [
 ('commit, Co-Authored-By AI trailer as a second -m', f"git commit -m 'Add greet' -m 'Co-Authored-By: {AI} Opus 5.5 (1M context) <{MAIL}>'"),
 ('commit, heredoc message with the robot line', f"git commit -F - <<'EOF'\nAdd greet\n\n\U0001F916 {GEN} [{AI} Code](https://{AI.lower()}.com/{AI.lower()}-code)\nEOF"),
 ('commit, $(cat heredoc) message with a Co-Authored-By trailer', f"git commit -m \"$(cat <<'EOF'\nAdd greet\n\nCo-Authored-By: {AI} <{MAIL}>\nEOF\n)\""),
 ('commit, --trailer', f"git commit -m 'Add greet' --trailer 'Co-authored-by: {AI} <{MAIL}>'"),
 ('pull request body with a Generated-with line', f"gh pr create --title 'Add greet' --body 'Adds greet.\n\n{GEN} {AI} Code'"),
 ('clean commit', "git commit -m 'Add greet'"),
 ('commit crediting a human co-author', "git commit -m 'Add greet' -m 'Co-Authored-By: Sam Lee <sam@example.com>'"),
]
out = []
for i, (label, cmd) in enumerate(cases):
    rc, so, se = bash(cmd, f'toolu_{i:02d}')
    decision = None
    try: decision = json.loads(so)['hookSpecificOutput'].get('permissionDecision') if so else None
    except Exception: pass
    out.append(dict(hook='PreToolUse', case=label, command=cmd, exit=rc, decision=decision or 'none (allowed to run)', stdout=so, stderr=se))
# UserPromptSubmit then Stop twice (keep phrase, nothing recorded)
rc, so, se = run('user-prompt', dict(hook_event_name='UserPromptSubmit', prompt='Remember that the greet demo is on Friday. Reply with only OK.'))
out.append(dict(hook='UserPromptSubmit', case='keep phrase', exit=rc, stdout=so, stderr=se))
rc, so, se = run('stop', dict(hook_event_name='Stop', stop_hook_active=False, last_assistant_message='OK'))
out.append(dict(hook='Stop', case='first Stop, nothing recorded', exit=rc, stdout=so, stderr=se))
rc, so, se = run('stop', dict(hook_event_name='Stop', stop_hook_active=True, last_assistant_message='I did not save it.'))
out.append(dict(hook='Stop', case='second Stop (stop_hook_active true)', exit=rc, stdout=so, stderr=se))
json.dump(out, open(L + '/hookcheck.json', 'w'), indent=1, ensure_ascii=False)
for o in out: print(json.dumps(o, ensure_ascii=False)[:900]); print()
