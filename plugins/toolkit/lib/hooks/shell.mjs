// Reading a shell command line the way the hooks need it: split into simple
// commands, each a list of words, with quotes removed. This is not a full
// shell parser. It is enough to recognise git and toolkit commands inside
// chains such as `cd x && git add -A`, subshells, pipes, and command strings
// given to `bash -c`, `sh -c`, or `eval`. The body of a here-document
// (`<<EOF` ... `EOF`) is text, not commands, so it is skipped.

const SEPARATORS = new Set(['&&', '||', ';', '|', '&', '\n', '(', ')', '|&', ';;']);

/**
 * Read a here-document operator at `i` (src[i] and src[i + 1] are '<').
 * Returns { delim, stripTabs, end } (end: the index after the delimiter word),
 * or null for a here-string (`<<<`) or an operator with no delimiter.
 */
function readHeredocOperator(src, i) {
  if (src[i + 2] === '<') return null;
  let j = i + 2;
  let stripTabs = false;
  if (src[j] === '-') {
    stripTabs = true;
    j++;
  }
  while (src[j] === ' ' || src[j] === '\t') j++;
  let delim = '';
  let quoted = false;
  while (j < src.length && !/[\s;&|()<>]/.test(src[j])) {
    const c = src[j];
    if (c === "'" || c === '"') {
      const k = src.indexOf(c, j + 1);
      delim += k === -1 ? src.slice(j + 1) : src.slice(j + 1, k);
      j = k === -1 ? src.length : k + 1;
      quoted = true;
      continue;
    }
    if (c === '\\' && j + 1 < src.length) {
      delim += src[j + 1];
      j += 2;
      quoted = true;
      continue;
    }
    delim += c;
    j++;
  }
  return delim ? { delim, stripTabs, quoted, end: j } : null;
}

/**
 * Skip here-document bodies that start at `start`, and set each one's `body`
 * (its text, without the end line). Returns the index of the last character skipped.
 */
function skipHeredocBodies(src, start, pending) {
  let pos = start;
  for (const h of pending) {
    const body = [];
    h.body = '';
    for (;;) {
      if (pos >= src.length) {
        h.body = body.join('\n');
        return src.length - 1;
      }
      const nl = src.indexOf('\n', pos);
      const lineEnd = nl === -1 ? src.length : nl;
      let text = src.slice(pos, lineEnd);
      if (h.stripTabs) text = text.replace(/^\t+/, '');
      pos = lineEnd + 1;
      if (text === h.delim) break;
      body.push(text);
    }
    h.body = body.join('\n');
  }
  return pos - 1;
}

/** Split a command line into simple commands: arrays of words. */
export function splitCommands(line) {
  const src = String(line || '');
  const commands = [];
  let words = [];
  let word = '';
  let inWord = false;
  let heredocs = [];
  const endWord = () => {
    if (inWord) words.push(word);
    word = '';
    inWord = false;
  };
  const endCommand = () => {
    endWord();
    if (words.length) commands.push(words);
    words = [];
  };
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (c === "'") {
      const j = src.indexOf("'", i + 1);
      word += j === -1 ? src.slice(i + 1) : src.slice(i + 1, j);
      inWord = true;
      i = j === -1 ? src.length : j;
      continue;
    }
    if (c === '"') {
      let j = i + 1;
      while (j < src.length && src[j] !== '"') {
        if (src[j] === '\\' && j + 1 < src.length) {
          word += src[j + 1];
          j += 2;
          continue;
        }
        if (src[j] === '$' && src[j + 1] === '(') {
          // A command substitution inside quotes: its text is kept as part of the word.
          word += src[j];
          j++;
          continue;
        }
        word += src[j];
        j++;
      }
      inWord = true;
      i = j;
      continue;
    }
    if (c === '\\' && i + 1 < src.length) {
      if (src[i + 1] === '\n') {
        i++;
        continue;
      }
      word += src[i + 1];
      inWord = true;
      i++;
      continue;
    }
    if (c === '#' && !inWord) {
      const nl = src.indexOf('\n', i);
      i = nl === -1 ? src.length : nl - 1;
      continue;
    }
    if (c === ' ' || c === '\t') {
      endWord();
      continue;
    }
    if (c === '<' && src[i + 1] === '<') {
      const h = readHeredocOperator(src, i);
      if (h) {
        endWord();
        heredocs.push(h);
        i = h.end - 1;
        continue;
      }
    }
    if (c === '\n' && heredocs.length) {
      endCommand();
      i = skipHeredocBodies(src, i + 1, heredocs);
      heredocs = [];
      continue;
    }
    const two = src.slice(i, i + 2);
    if (SEPARATORS.has(two)) {
      endCommand();
      i++;
      continue;
    }
    if (c === '$' && src[i + 1] === '(') {
      endCommand();
      i++;
      continue;
    }
    if (c === '`') {
      endCommand();
      continue;
    }
    if (SEPARATORS.has(c)) {
      endCommand();
      continue;
    }
    word += c;
    inWord = true;
  }
  endCommand();
  return commands;
}

const PREFIX_COMMANDS = new Set(['sudo', 'command', 'exec', 'time', 'nohup', 'nice', 'builtin']);

/** Drop leading environment assignments and wrapper words (sudo, env, time, ...). */
export function stripPrefix(words) {
  let i = 0;
  while (i < words.length) {
    const w = words[i];
    if (/^[A-Za-z_][A-Za-z0-9_]*=/.test(w)) {
      i++;
      continue;
    }
    if (PREFIX_COMMANDS.has(w)) {
      i++;
      while (i < words.length && words[i].startsWith('-')) i++;
      continue;
    }
    if (w === 'env') {
      i++;
      while (i < words.length && (words[i].startsWith('-') || /^[A-Za-z_][A-Za-z0-9_]*=/.test(words[i]))) i++;
      continue;
    }
    break;
  }
  return words.slice(i);
}

function base(word) {
  return String(word).split('/').pop();
}

const SHELLS = new Set(['sh', 'bash', 'zsh', 'dash', 'ksh']);

/**
 * The simple commands of a line, with the command strings given to
 * `bash -c "<string>"` (and sh, zsh, dash, ksh) and to `eval` read as
 * commands too.
 */
export function allCommands(line, depth = 0) {
  const out = [];
  for (const words of splitCommands(line)) {
    out.push(words);
    if (depth >= 3) continue;
    const w = stripPrefix(words);
    if (!w.length) continue;
    const name = base(w[0]);
    if (name === 'eval' && w.length > 1) {
      out.push(...allCommands(w.slice(1).join(' '), depth + 1));
      continue;
    }
    if (!SHELLS.has(name)) continue;
    for (let i = 1; i < w.length; i++) {
      const a = w[i];
      if (!a.startsWith('-') || a === '--') break;
      if (!a.startsWith('--') && a.slice(1).includes('c')) {
        if (w[i + 1] !== undefined) out.push(...allCommands(w[i + 1], depth + 1));
        break;
      }
    }
  }
  return out;
}

// Git options that take a value in the next word.
const GIT_GLOBAL_WITH_VALUE = new Set(['-C', '-c', '--git-dir', '--work-tree', '--namespace', '--super-prefix', '--config-env', '--exec-path', '--list-cmds', '--attr-source']);

/** A git command as { sub, args, cwdFlags }, or null. */
export function gitCommand(words) {
  const w = stripPrefix(words);
  if (!w.length || base(w[0]) !== 'git') return null;
  let i = 1;
  const dirs = [];
  while (i < w.length && w[i].startsWith('-')) {
    const opt = w[i];
    if (GIT_GLOBAL_WITH_VALUE.has(opt)) {
      if (opt === '-C') dirs.push(w[i + 1]);
      i += 2;
      continue;
    }
    if (opt.startsWith('--git-dir=') || opt.startsWith('--work-tree=')) {
      dirs.push(opt.split('=').slice(1).join('='));
    }
    i++;
  }
  if (i >= w.length) return null;
  return { sub: w[i], args: w.slice(i + 1), dirs };
}

/**
 * Short option letters of a word such as -fdx, stopping at the first option
 * that takes a value (its value is the rest of the word).
 */
function shortLetters(word, valueLetters = '') {
  if (!/^-[A-Za-z]/.test(word) || word.startsWith('--')) return '';
  let out = '';
  for (const ch of word.slice(1)) {
    out += ch;
    if (valueLetters.includes(ch)) break;
  }
  return out;
}

/** The option words of a git subcommand, before `--`, with values of known value-taking options skipped. */
function optionWords(args, valueOptions = new Set()) {
  const out = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--') break;
    out.push(a);
    if (valueOptions.has(a)) i++;
  }
  return out;
}

/** A pathspec that names the whole checkout: `.`, `./`, `:/` (the top of the tree), or `:(top)`. */
function stagesEverything(p) {
  return p === '.' || p === './' || /^:\/(\.|\/)?$/.test(p) || /^:\(top\)(\.|\/)?$/.test(p) || p === ':/:';
}

export const GIT_REASONS = Object.freeze({
  addAll: 'git add -A, git add --all, git add ., and git add :/ stage every change in the checkout, including work from other sessions. Stage the files you changed by name instead: git add <path> <path>.',
  commitAll: 'git commit -a stages every tracked change, including work from other sessions. Stage the files you changed by name, then run git commit.',
  noVerify: 'git commit --no-verify (or -n) skips the project\'s commit checks. Fix what the check reports, then commit again.',
  forcePush: 'A force push (--force, -f, --force-with-lease, or a + refspec) can overwrite work on the remote, so it is not run from an agent session. Tell the owner what needs a force push and why; he runs it himself.',
  addIgnoredData: 'git add -f on .work-items/ or .memory/ would commit the work items or the memory. Both folders are Git-ignored on purpose: they hold the owner\'s private tracker and memory, and toolkit handoff-backup (or toolkit export) backs them up. Stage other files by name.',
  cleanIgnored: 'git clean -x or -X in the main checkout deletes Git-ignored files, including the work items in .work-items/ and the memory in .memory/, which Git cannot bring back. Delete the build output by name instead, or run git clean without -x and -X. toolkit export --to <folder> makes a backup first.',
});

/**
 * Check one command line against the git rules (the model project's settings
 * deny list, and the git clean guard). Returns { rule, reason } or null.
 * opts.mainCheckout: the command runs in the main checkout (git clean -x applies);
 * opts.guardClean: the project keeps Git-ignored data (local tracker or built-in memory).
 */
export function checkGit(line, { mainCheckout = true, guardClean = true } = {}) {
  for (const words of allCommands(line)) {
    const git = gitCommand(words);
    if (!git) continue;
    const { sub, args } = git;
    if (sub === 'add') {
      const opts = optionWords(args, new Set(['--chmod', '--pathspec-from-file']));
      const afterDash = args.includes('--') ? args.slice(args.indexOf('--') + 1) : [];
      const paths = [...args.filter((a) => !a.startsWith('-')), ...afterDash];
      if (opts.includes('-A') || opts.includes('--all') || opts.some((o) => shortLetters(o).includes('A')) || paths.some(stagesEverything)) {
        return { rule: 'git-add-all', reason: GIT_REASONS.addAll };
      }
      // .work-items/ and .memory/ are Git-ignored on purpose; only a forced add stages them.
      const forced = opts.includes('--force') || opts.some((o) => shortLetters(o).includes('f'));
      if (forced && paths.some((p) => /(^|\/)\.(?:work-items|memory)(\/|$)/.test(p) && !/scaffold\/model\//.test(p))) {
        return { rule: 'git-add-ignored-data', reason: GIT_REASONS.addIgnoredData };
      }
    }
    if (sub === 'commit') {
      const opts = optionWords(args, new Set(['-m', '-F', '-c', '-C', '-t', '--author', '--date', '--message', '--file', '--template', '--reuse-message', '--reedit-message', '--fixup', '--squash', '--trailer', '--cleanup']));
      if (opts.includes('--all') || opts.some((o) => shortLetters(o, 'mFcCt').includes('a'))) return { rule: 'git-commit-all', reason: GIT_REASONS.commitAll };
      if (opts.includes('--no-verify') || opts.some((o) => shortLetters(o, 'mFcCt').includes('n'))) return { rule: 'git-commit-no-verify', reason: GIT_REASONS.noVerify };
    }
    if (sub === 'push') {
      const opts = optionWords(args, new Set(['-o', '--push-option', '--repo', '--receive-pack', '--exec']));
      const forced = opts.some((o) => o === '--force' || o.startsWith('--force-with-lease') || o.startsWith('--force-if-includes') || shortLetters(o, 'o').includes('f'));
      const plusRef = args.filter((a) => !a.startsWith('-')).some((a) => a.startsWith('+'));
      if (forced || plusRef) return { rule: 'git-force-push', reason: GIT_REASONS.forcePush };
    }
    if (sub === 'clean' && mainCheckout && guardClean) {
      const opts = optionWords(args, new Set(['-e', '--exclude']));
      const dryRun = opts.includes('--dry-run') || opts.some((o) => shortLetters(o, 'e').includes('n'));
      if (!dryRun && opts.some((o) => /[xX]/.test(shortLetters(o, 'e')))) return { rule: 'git-clean-ignored', reason: GIT_REASONS.cleanIgnored };
    }
  }
  return null;
}

// ------------------------------------------------------------------ toolkit commands

export const MEMORY_WRITES = Object.freeze(['save', 'approve', 'reject', 'retire', 'restore', 'rename', 'delete', 'import']);
export const WORK_WRITES = Object.freeze(['new', 'edit', 'set', 'approve', 'design', 'history', 'move', 'finish', 'cancel']);

/**
 * The toolkit commands in a command line: [{ group, sub, args }].
 * Recognises `toolkit ...` and `node <path>/bin/toolkit ...`.
 */
export function toolkitCommands(line) {
  const out = [];
  for (const words of allCommands(line)) {
    let w = stripPrefix(words);
    if (w.length && base(w[0]) === 'node' && w[1] && /(^|\/)bin\/toolkit$/.test(w[1])) w = w.slice(1);
    if (!w.length || base(w[0]) !== 'toolkit') continue;
    const rest = w.slice(1).filter((a) => a !== '--json');
    const group = rest[0] || null;
    const sub = rest[1] && !rest[1].startsWith('-') ? rest[1] : null;
    out.push({ group, sub, args: rest.slice(sub ? 2 : 1) });
  }
  return out;
}

/** What a toolkit command records: 'memory' for a memory write, 'work' for a work-item write, 'decision', or null. */
export function recordKind(cmd) {
  if (!cmd || !cmd.group) return null;
  if (cmd.group === 'memory') {
    if (MEMORY_WRITES.includes(cmd.sub) && !(cmd.sub === 'import' && cmd.args.includes('--dry-run'))) return 'memory';
    if ((cmd.sub === 'focus' || cmd.sub === 'glossary') && cmd.args.some((a) => /^--(?:set-file|text)(?:=|$)/.test(a))) return 'memory';
    return null;
  }
  if (cmd.group === 'work' && WORK_WRITES.includes(cmd.sub)) return 'work';
  if (cmd.group === 'decision' && cmd.sub === 'add') return 'decision';
  return null;
}

// ------------------------------------------------------------------ AI credit

// No AI credit on anything committed or pushed (AGENTS.md; sample run
// claude-a found "Co-Authored-By: Claude ..." on four of five commits).
const AI_NAMES = /(claude|anthropic|openai|chatgpt|\bgpt\b|\bgpt-|codex|copilot|gemini|cursor|devin|aider)/i;
const AI_WORDS = /(claude|anthropic|openai|chatgpt|\bgpt\b|\bgpt-|codex|copilot|gemini|cursor|devin|aider|\bai\b|\bllm\b|artificial intelligence)/i;

// The same credit in the middle of a line ("Release 1.0. Generated with
// <AI tool>" in a tag message or a gh api release name): counted only when an
// AI's name is one of the next three words, so "generated with make" passes.
const MID_LINE_CREDIT = /\b(?:generated|written|created)\s+(?:with|by|using)\s+((?:\S+\s+){0,2}\S+)/gi;

/**
 * The first line of a text that gives an AI credit, or null: a Co-Authored-By
 * line naming an AI (or its noreply address), or a "Generated with/by/using"
 * line naming one (Claude Code's own pull request line starts with a robot
 * emoji, which is skipped). In the middle of a line, "Generated with/by/using"
 * (or written, created) counts when an AI's name is one of the next three
 * words. A Co-Authored-By inside a sentence is not a credit line.
 */
export function aiCreditLine(text) {
  for (const raw of String(text ?? '').split(/\r?\n/)) {
    const line = raw.replace(/^[^A-Za-z0-9]+/, '').trim();
    const co = /^co-authored-by:\s*(.*)$/i.exec(line);
    if (co && AI_NAMES.test(co[1])) return raw.trim();
    const gen = /^generated\s+(?:with|by|using)\b(.*)$/i.exec(line);
    if (gen && AI_WORDS.test(gen[1])) return raw.trim();
    MID_LINE_CREDIT.lastIndex = 0;
    let m;
    while ((m = MID_LINE_CREDIT.exec(line)) !== null) {
      if (AI_NAMES.test(m[1])) {
        MID_LINE_CREDIT.lastIndex = 0;
        return raw.trim();
      }
    }
  }
  return null;
}

/** The value of an option in a word list: --name value, --name=value, -x value, -xvalue. */
function optionValues(args, longNames, shortNames = []) {
  const out = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--') break;
    for (const n of longNames) {
      if (a === n && args[i + 1] !== undefined) out.push(args[i + 1]);
      else if (a.startsWith(`${n}=`)) out.push(a.slice(n.length + 1));
    }
    for (const n of shortNames) {
      if (a === n && args[i + 1] !== undefined) out.push(args[i + 1]);
      else if (a.startsWith(n) && a.length > n.length && !a.startsWith('--')) out.push(a.slice(n.length));
    }
  }
  return out;
}

// Git commands that write a message into history, with the options that
// hold the message (final review M1: merges, tags, and notes passed the guard).
const GIT_MESSAGE = {
  commit: { what: 'commit', text: ['--message', '--trailer'], short: ['-m'], files: ['--file'], shortFiles: ['-F'] },
  merge: { what: 'commit', text: ['--message'], short: ['-m'], files: ['--file'], shortFiles: ['-F'] },
  tag: { what: 'tag', text: ['--message'], short: ['-m'], files: ['--file'], shortFiles: ['-F'] },
  notes: { what: 'note', text: ['--message'], short: ['-m'], files: ['--file'], shortFiles: ['-F'] },
  'cherry-pick': { what: 'commit', text: [], short: [], files: [], shortFiles: [] },
  revert: { what: 'commit', text: [], short: [], files: [], shortFiles: [] },
};
// gh commands that publish text: [group, subcommand] -> the options that hold it.
const GH_TEXT = [
  { group: 'pr', subs: ['create', 'edit', 'comment', 'review', 'merge'], what: 'pull request', text: ['--title', '--body', '--subject'], short: ['-t', '-b'] },
  { group: 'issue', subs: ['create', 'edit', 'comment'], what: 'issue', text: ['--title', '--body'], short: ['-t', '-b'] },
  { group: 'release', subs: ['create', 'edit'], what: 'release', text: ['--title', '--notes'], short: ['-t', '-n'], files: ['--notes-file'], shortFiles: ['-F'] },
];

/**
 * Check a command line for a git commit, merge, tag, or note, a gh pr, issue,
 * or release command that publishes text, or a gh api call on a pull request
 * or issue path, whose message gives an AI credit.
 * readFile(path) -> text or null reads a message file (-F, --file,
 * --body-file, --notes-file, a gh api body=@file or --input). The whole
 * command text is read too, so a message in a heredoc ($(cat <<'EOF' ... EOF))
 * is found. Returns { what: 'commit'|'tag'|'note'|'pull request'|'issue'|'release', line } or null.
 */
export function checkAiCredit(line, { readFile = () => null } = {}) {
  const texts = [];
  let what = null;
  for (const words of allCommands(line)) {
    const git = gitCommand(words);
    const spec = git && GIT_MESSAGE[git.sub];
    if (spec) {
      what = what || spec.what;
      texts.push(...optionValues(git.args, spec.text, spec.short));
      for (const f of optionValues(git.args, spec.files, spec.shortFiles)) if (f !== '-') texts.push(readFile(f));
      continue;
    }
    const w = stripPrefix(words);
    const gh = w.length >= 3 && base(w[0]) === 'gh' ? GH_TEXT.find((g) => g.group === w[1] && g.subs.includes(w[2])) : null;
    if (gh) {
      what = what || gh.what;
      const args = w.slice(3);
      texts.push(...optionValues(args, gh.text, gh.short));
      for (const f of optionValues(args, ['--body-file', ...(gh.files || [])], ['-F', ...(gh.shortFiles || [])])) if (f !== '-') texts.push(readFile(f));
      continue;
    }
    // gh api on a pull request or issue path (repos/<owner>/<repo>/pulls,
    // pulls/<n>, issues, issues/<n>/comments): -f/-F/--field/--raw-field
    // body=... or title=... (@file reads a file), and --input <file> (JSON).
    if (w.length >= 3 && base(w[0]) === 'gh' && w[1] === 'api' && w.slice(2).some((a) => /(^|\/)(pulls|issues|releases)(\/|$)/.test(a))) {
      what = what || (w.slice(2).some((a) => /(^|\/)pulls(\/|$)/.test(a)) ? 'pull request' : w.slice(2).some((a) => /(^|\/)releases(\/|$)/.test(a)) ? 'release' : 'issue');
      const args = w.slice(2);
      for (const v of optionValues(args, ['--field', '--raw-field'], ['-f', '-F'])) {
        const m = /^(?:body|title|name)=([\s\S]*)$/.exec(v);
        if (!m) continue;
        if (m[1].startsWith('@')) {
          if (m[1] !== '@-') texts.push(readFile(m[1].slice(1)));
        } else texts.push(m[1]);
      }
      for (const f of optionValues(args, ['--input'])) {
        if (f === '-') continue;
        const t = readFile(f);
        texts.push(t);
        try {
          const j = JSON.parse(t || 'null');
          if (j && typeof j === 'object') texts.push(j.body, j.title, j.name);
        } catch {
          // Not JSON: the text itself was checked.
        }
      }
    }
  }
  if (!what) return null;
  for (const t of [...texts, line]) {
    const hit = aiCreditLine(t);
    if (hit) return { what, line: hit };
  }
  return null;
}

// ------------------------------------------------------------------ backticks in toolkit text

/**
 * The simple commands of a line as source text, split where the shell splits
 * them (&&, ||, ;, |, &, a new line, parentheses, an unquoted $( or backtick),
 * with the here-documents each one reads: [{ text, heredocs: [{ delim,
 * quoted, body }] }]. Quoted text is never split, so the text of a command
 * keeps its quotes as written.
 */
export function commandSources(line) {
  const src = String(line || '');
  const out = [];
  let start = 0;
  let quote = null;
  let heredocs = [];
  let cur = [];
  const end = (i) => {
    const text = src.slice(start, i);
    if (text.trim() || cur.length) out.push({ text, heredocs: cur });
    cur = [];
  };
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quote === "'") {
      if (c === "'") quote = null;
      continue;
    }
    if (quote === '"') {
      if (c === '\\') i++;
      else if (c === '"') quote = null;
      continue;
    }
    if (c === '\\') {
      i++;
      continue;
    }
    if (c === "'" || c === '"') {
      quote = c;
      continue;
    }
    if (c === '<' && src[i + 1] === '<') {
      const h = readHeredocOperator(src, i);
      if (h) {
        heredocs.push(h);
        cur.push(h);
        i = h.end - 1;
        continue;
      }
    }
    if (c === '\n' && heredocs.length) {
      end(i);
      i = skipHeredocBodies(src, i + 1, heredocs);
      heredocs = [];
      start = i + 1;
      continue;
    }
    if ('&|;()\n`'.includes(c) || (c === '$' && src[i + 1] === '(')) {
      end(i);
      if (c === '$') i++;
      start = i + 1;
    }
  }
  end(src.length);
  return out.map((cmd) => ({ text: cmd.text, heredocs: cmd.heredocs.map((h) => ({ delim: h.delim, quoted: Boolean(h.quoted), body: h.body || '' })) }));
}

/** The commands of a line (commandSources) that run toolkit. */
function toolkitSources(line) {
  return commandSources(line).filter((cmd) => toolkitCommands(cmd.text).length > 0);
}

/** True when `text` has a double-quoted part holding `test` (a function of the text and an index) outside escapes. */
function inDoubleQuotes(text, test) {
  let quote = null;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quote === "'") {
      if (c === "'") quote = null;
      continue;
    }
    if (quote === '"') {
      if (c === '\\') {
        i++;
        continue;
      }
      if (test(text, i)) return true;
      if (c === '"') quote = null;
      continue;
    }
    if (c === '\\') {
      i++;
      continue;
    }
    if (c === "'" || c === '"') quote = c;
  }
  return false;
}

/**
 * True when a toolkit command in the line has a double-quoted argument
 * holding a backtick that is not escaped. Inside double quotes the shell runs
 * `...` as a command and puts its output in the text: sample run a saved a
 * work item section with its `code` words missing, and zsh tried to run them.
 * Only the toolkit command's own words are looked at, not another command
 * joined to it, and not a here-document body.
 */
export function backtickInDoubleQuotes(line) {
  return toolkitSources(line).some((cmd) => inDoubleQuotes(cmd.text, (t, i) => t[i] === '`'));
}

/**
 * True when a toolkit command in the line has a double-quoted argument holding
 * $( ... ). The shell runs it and puts its output in the text. That can be
 * meant (--note "built at $(git rev-parse HEAD)"), so this gives a note, not
 * a refusal.
 */
export function substitutionInDoubleQuotes(line) {
  return toolkitSources(line).some((cmd) => inDoubleQuotes(cmd.text, (t, i) => t[i] === '$' && t[i + 1] === '('));
}

/**
 * True when a toolkit command in the line reads a here-document whose
 * delimiter is not quoted (<<EOF, not <<'EOF') and whose text holds a
 * backtick or $( ): the shell runs those as commands inside the text too.
 */
export function backtickInUnquotedHeredoc(line) {
  return toolkitSources(line).some((cmd) => cmd.heredocs.some((h) => !h.quoted && /(^|[^\\])(`|\$\()/.test(h.body)));
}

// ------------------------------------------------------------------ apostrophes in Codex

/**
 * True when a quote in the line is never closed: the shell stops with
 * "unmatched '". Codex writes the command inside a JavaScript string, where
 * \' is only ', so the escape '\'' reaches the shell as ''' (sample runs
 * confirm-a and confirm-d).
 */
export function unmatchedQuote(line) {
  const src = String(line || '');
  let quote = null;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quote === "'") {
      if (c === "'") quote = null;
      continue;
    }
    if (quote === '"') {
      if (c === '\\') i++;
      else if (c === '"') quote = null;
      continue;
    }
    if (c === '\\') {
      i++;
      continue;
    }
    if (c === "'" || c === '"') quote = c;
  }
  return quote !== null;
}

/**
 * Why a toolkit command's apostrophe will not work in Codex, or null:
 * 'escaped' when the command writes it as '\'' (the command then runs inside
 * the Codex sandbox, because the project's toolkit rule does not match it, so
 * Notion, Hindsight, and the main checkout are blocked), or 'unmatched' when
 * a quote is never closed (the backslash was lost on the way to the shell).
 */
export function codexApostropheProblem(line) {
  const src = String(line || '');
  if (!src.includes("'")) return null;
  const sources = toolkitSources(src);
  if (!sources.length) return null;
  if (sources.some((cmd) => cmd.text.includes("'\\''"))) return 'escaped';
  if (unmatchedQuote(src)) return 'unmatched';
  return null;
}
