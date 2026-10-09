#!/usr/bin/env python3
"""Runs one eval of a set in dev/evals/ in a live headless Claude Code session.

usage: run-live-eval.py <set folder> <eval id> <base project> <output folder> [attempt]

  <set folder>     a folder in dev/evals/ that holds evals.json, for example
                   dev/evals/keeping-project-records
  <base project>   the base project that the set's README says how to build
  <output folder>  a folder outside this repository; the script writes
                   runs/<name>/ (the run folder) and evidence/<name>/ there

The session signs in through the fixed test home that the root AGENTS.md names,
never through the owner's own ~/.claude. The toolkit plugin is loaded from this
checkout. Set MODEL to pass --model, and EXTRA_TOOLS to allow more tools.
"""
import json, os, re, shutil, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
TEST_HOME = os.path.expanduser('~/.toolkit-v2-test-homes/claude')
TOOLS = 'Bash Read Write Edit Glob Grep Skill Agent ToolSearch'


def sh(cmd, cwd=None, check=True):
    return subprocess.run(cmd, shell=True, cwd=cwd, check=check, capture_output=True, text=True)


def change_run_folder(set_dir, eval_id, run):
    """Makes the change that the set's run-folder-changes.json gives for this eval."""
    path = os.path.join(set_dir, 'run-folder-changes.json')
    if not os.path.exists(path):
        return
    for change in json.load(open(path)).get(str(eval_id), []):
        target = os.path.join(run, change['file'])
        text = open(target).read()
        if 'replace' in change:
            assert change['replace'] in text, change['replace']
            text = text.replace(change['replace'], change['with'])
        else:  # keep everything up to the end of the guide comment, then the new body
            body = open(os.path.join(set_dir, change['body_file'])).read()
            text = text[:text.index('-->') + 3] + '\n\n' + body
        open(target, 'w').write(text)
    check = sh("echo '{}' | node .claude/hooks/validate-records.mjs --all", cwd=run, check=False)
    assert check.returncode == 0 and not check.stdout.strip(), 'record check: ' + check.stdout + check.stderr
    sh('git add -A && git commit -qm "Run folder change"', cwd=run)


def send(run, message, session, out):
    cmd = ['claude', '-p', message, '--plugin-dir', os.path.join(REPO, 'plugins', 'toolkit'),
           '--output-format', 'stream-json', '--verbose', '--include-hook-events',
           '--permission-mode', 'acceptEdits',
           '--allowedTools', (TOOLS + ' ' + os.environ.get('EXTRA_TOOLS', '')).strip()]
    if session:
        cmd += ['--resume', session]
    if os.environ.get('MODEL'):
        cmd += ['--model', os.environ['MODEL']]
    env = dict(os.environ, CLAUDE_CONFIG_DIR=TEST_HOME)
    with open(out, 'w') as f, open(out + '.err', 'w') as e:
        subprocess.run(cmd, cwd=run, env=env, stdin=subprocess.DEVNULL, stdout=f, stderr=e)
    result = None
    for line in open(out):
        try:
            row = json.loads(line)
        except ValueError:
            continue
        if row.get('type') == 'result':
            result = row
    return result


def main():
    set_dir, eval_id, base, outdir = sys.argv[1], int(sys.argv[2]), sys.argv[3], sys.argv[4]
    attempt = sys.argv[5] if len(sys.argv) > 5 else '1'
    set_dir, base, outdir = map(os.path.abspath, (set_dir, base, outdir))
    assert not outdir.startswith(REPO + os.sep), 'the output folder must be outside this repository'
    evals = {e['id']: e for e in json.load(open(os.path.join(set_dir, 'evals.json')))['evals']}
    later = {}
    if os.path.exists(os.path.join(set_dir, 'messages.json')):
        later = json.load(open(os.path.join(set_dir, 'messages.json')))
    name = '%s-%02d-a%s' % (os.path.basename(set_dir), eval_id, attempt)
    run, ev = os.path.join(outdir, 'runs', name), os.path.join(outdir, 'evidence', name)
    for folder in (run, ev):
        if os.path.exists(folder):
            shutil.rmtree(folder)
    os.makedirs(ev)
    os.makedirs(os.path.dirname(run), exist_ok=True)
    subprocess.run(['cp', '-a', base, run], check=True)
    change_run_folder(set_dir, eval_id, run)
    start = sh('git rev-parse HEAD', cwd=run).stdout.strip()

    session, cost = None, 0.0
    messages = [evals[eval_id]['prompt']] + later.get(str(eval_id), [])
    for n, message in enumerate(messages, 1):
        open(os.path.join(ev, 'msg%d.txt' % n), 'w').write(message)
        result = send(run, message, session, os.path.join(ev, 'session-msg%d.jsonl' % n))
        if not result or result.get('is_error'):
            print(name, 'ERROR at message', n, (result or {}).get('result'))
            break
        session = result['session_id']
        cost += result.get('total_cost_usd') or 0
        open(os.path.join(ev, 'reply%d.txt' % n), 'w').write(result.get('result') or '')
    open(os.path.join(ev, 'session-id.txt'), 'w').write(session or '')

    # Every file the run changed, added, or removed against the base project. MEMORY.md is
    # left out because the session-start hook rebuilds it.
    diff = sh("diff -ruN -x .git -x .agents -x worktrees -x MEMORY.md '%s' '%s'" % (base, run), check=False).stdout
    diff = re.sub(r'^(---|\+\+\+) (%s|%s)/' % (re.escape(base), re.escape(run)), r'\1 ', diff, flags=re.M)
    open(os.path.join(ev, 'clean-diff.txt'), 'w').write(re.sub(r'^diff .*\n', '', diff, flags=re.M))
    git = ['git log --all --oneline --decorate %s..' % start, 'git branch --all -vv', 'git worktree list',
           'git status --short']
    open(os.path.join(ev, 'git.txt'), 'w').write(
        '\n'.join('$ %s\n%s' % (c, sh(c, cwd=run, check=False).stdout) for c in git))
    replies = sum(1 for f in os.listdir(ev) if f.startswith('reply'))
    print('%s done: %d of %d replies, cost %.2f USD' % (name, replies, len(messages), cost))


if __name__ == '__main__':
    main()
