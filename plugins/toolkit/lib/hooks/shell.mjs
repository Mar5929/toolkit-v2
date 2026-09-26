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
  while (j < src.length && !/[\s;&|()<>]/.test(src[j])) {
    const c = src[j];
    if (c === "'" || c === '"') {
      const k = src.indexOf(c, j + 1);
      delim += k === -1 ? src.slice(j + 1) : src.slice(j + 1, k);
      j = k === -1 ? src.length : k + 1;
      continue;
    }
    if (c === '\\' && j + 1 < src.length) {
      delim += src[j + 1];
      j += 2;
      continue;
    }
    delim += c;
    j++;
  }
  return delim ? { delim, stripTabs, end: j } : null;
}

/** Skip here-document bodies that start at `start`. Returns the index of the last character skipped. */
function skipHeredocBodies(src, start, pending) {
  let pos = start;
  for (const h of pending) {
    for (;;) {
      if (pos >= src.length) return src.length - 1;
      const nl = src.indexOf('\n', pos);
      const lineEnd = nl === -1 ? src.length : nl;
      let text = src.slice(pos, lineEnd);
      if (h.stripTabs) text = text.replace(/^\t+/, '');
      pos = lineEnd + 1;
      if (text === h.delim) break;
    }
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

export const MEMORY_WRITES = Object.freeze(['save', 'retire', 'restore', 'delete', 'import']);
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
    if ((cmd.sub === 'focus' || cmd.sub === 'glossary') && cmd.args.some((a) => a === '--set-file' || a.startsWith('--set-file='))) return 'memory';
    return null;
  }
  if (cmd.group === 'work' && WORK_WRITES.includes(cmd.sub)) return 'work';
  if (cmd.group === 'decision' && cmd.sub === 'add') return 'decision';
  return null;
}
