// Copies Mike's model project into plugins/toolkit/scaffold/model/.
//
//   node dev/tools/import-model.mjs [--from <model folder>]   copy the model and record where it came from
//   node dev/tools/import-model.mjs --check [--from <folder>]  write nothing; exit 1 when the copy differs
//                                                              from the model or a CONDITIONS.json rule no
//                                                              longer matches the copy
//
// The default source is the approved-changes worktree of the model repository:
// /Users/michaelrihm/Documents/Projects/toolkit-v2-model-project-approved.
// The tool only reads the source. It never writes there.
//
// What is copied: every file in the source folder, byte for byte, with its
// executable bit, except
//   - .git, and every .sfdx/, .vscode/, and __pycache__/ folder and .DS_Store
//     file at any depth;
//   - every path that plugins/toolkit/scaffold/CONDITIONS.json lists under "exclude";
//   - every file the source's Git ignores and does not track (a stray local
//     file, such as a real memory note, never ships). The tool names them. To
//     ship one on purpose, track it in the model's Git (git add -f there) and
//     import again. The model tracks its .memory/ and .work-items/ templates
//     that way.
// The copy's scaffold/model/.import.json records { source, branch, commit, dirty, importedAt }.
// toolkit init never installs .import.json.
//
// After the copy, every install rule in CONDITIONS.json ("only", "generated",
// "fill", "jsonRemove", "lineRemove") must match something in the copy. A rule
// that matches nothing stops the tool with exit 1, because the model changed
// under it. Re-run this tool whenever Mike changes the model.
//
// --check also fails when a copied file is hidden from this repository's Git:
// the model's own .gitignore (now scaffold/model/.gitignore) lists .memory/ and
// .work-items/, so a plain git add skips those files, and a clean clone of
// this repository would install projects without them. It prints the
// git add -f command that fixes it.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { matches, unmatchedRules } from '../../plugins/toolkit/lib/project/model-scaffold.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');
const PLUGIN = path.join(REPO, 'plugins', 'toolkit');
const TARGET = path.join(PLUGIN, 'scaffold', 'model');
const CONDITIONS_FILE = path.join(PLUGIN, 'scaffold', 'CONDITIONS.json');
const RECORD = '.import.json';
const DEFAULT_SOURCE = '/Users/michaelrihm/Documents/Projects/toolkit-v2-model-project-approved';

// Always left out, at any depth, whatever CONDITIONS.json says.
const ALWAYS_EXCLUDE = ['**/.git', '**/.git/**', '**/.sfdx/**', '**/.vscode/**', '**/__pycache__/**', '**/.DS_Store'];

function parseArgs(argv) {
  const out = { from: DEFAULT_SOURCE, check: false, quiet: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--check') out.check = true;
    else if (a === '--quiet') out.quiet = true;
    else if (a === '--from') {
      out.from = argv[i + 1];
      i += 1;
      if (!out.from) fail('--from needs a folder.');
    } else if (a.startsWith('--from=')) out.from = a.slice('--from='.length);
    else if (a === '--help' || a === '-h') {
      console.log('Usage: node dev/tools/import-model.mjs [--from <model folder>] [--check] [--quiet]');
      process.exit(0);
    } else fail(`Unknown option ${a}.`);
  }
  out.from = path.resolve(out.from);
  return out;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

// ------------------------------------------------------------------ source

function git(cwd, args) {
  const res = spawnSync('git', args, { cwd, encoding: 'utf8' });
  return res.status === 0 ? res.stdout.trim() : null;
}

function readConditions() {
  try {
    return JSON.parse(fs.readFileSync(CONDITIONS_FILE, 'utf8'));
  } catch (err) {
    fail(`${path.relative(REPO, CONDITIONS_FILE)} could not be read: ${err.message}`);
  }
  return null;
}

/** Every file under a folder as sorted relative paths with `/`. */
function listFiles(root, { skip } = {}) {
  const out = [];
  const visit = (dir, rel) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (skip && skip(r, e)) continue;
      const abs = path.join(dir, e.name);
      if (e.isSymbolicLink()) fail(`${abs} is a symbolic link. The model copy holds plain files only; replace the link with a file in the model.`);
      if (e.isDirectory()) visit(abs, r);
      else if (e.isFile()) out.push(r);
    }
  };
  visit(root, '');
  return out.sort();
}

/** True when a pattern leaves out this path (a folder is left out when the pattern covers everything in it). */
function excluded(rel, patterns, isDir = false) {
  return patterns.some((p) => matches(p, rel) || (isDir && p.endsWith('/**') && matches(p.slice(0, -3), rel)));
}

/**
 * The files to copy, and the files left out because the source's Git ignores
 * and does not track them: { files, ignored }.
 */
function sourceFiles(source, conditions) {
  const patterns = [...ALWAYS_EXCLUDE, ...((conditions && conditions.exclude) || [])];
  const all = listFiles(source, { skip: (rel, e) => excluded(rel, patterns, e.isDirectory()) });
  const stray = new Set(ignoredUntracked(source));
  return { files: all.filter((f) => !stray.has(f)), ignored: all.filter((f) => stray.has(f)) };
}

function sha(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

// ------------------------------------------------------------------ main

function sourceFacts(source) {
  const top = git(source, ['rev-parse', '--show-toplevel']);
  if (!top) return { branch: null, commit: null, dirty: null };
  const status = git(source, ['status', '--porcelain']);
  return {
    branch: git(source, ['rev-parse', '--abbrev-ref', 'HEAD']),
    commit: git(source, ['rev-parse', 'HEAD']),
    dirty: status === null ? null : status.length > 0,
  };
}

/** Files the source's Git ignores and does not track, relative to the source folder (none when it is not a Git folder). */
function ignoredUntracked(source) {
  const res = spawnSync('git', ['ls-files', '-z', '--others', '--ignored', '--exclude-standard'], { cwd: source, encoding: 'utf8' });
  if (res.status !== 0) return [];
  return res.stdout.split('\0').filter(Boolean);
}

function compare(source, files) {
  const differences = [];
  const targetFiles = fs.existsSync(TARGET) ? listFiles(TARGET).filter((f) => f !== RECORD) : [];
  const want = new Set(files);
  const have = new Set(targetFiles);
  for (const f of files) {
    if (!have.has(f)) {
      differences.push(`missing from the copy: ${f}`);
      continue;
    }
    const a = fs.readFileSync(path.join(source, f));
    const b = fs.readFileSync(path.join(TARGET, f));
    if (sha(a) !== sha(b)) differences.push(`differs: ${f}`);
    else {
      const ma = fs.statSync(path.join(source, f)).mode & 0o111;
      const mb = fs.statSync(path.join(TARGET, f)).mode & 0o111;
      if (ma !== mb) differences.push(`executable bit differs: ${f}`);
    }
  }
  for (const f of targetFiles) if (!want.has(f)) differences.push(`not in the model: ${f}`);
  return differences;
}

function run() {
  const opts = parseArgs(process.argv.slice(2));
  const say = (s) => {
    if (!opts.quiet) console.log(s);
  };
  if (!fs.existsSync(opts.from) || !fs.statSync(opts.from).isDirectory()) fail(`The model folder ${opts.from} does not exist.`);
  const conditions = readConditions();
  const { files, ignored } = sourceFiles(opts.from, conditions);
  if (!files.length) fail(`The model folder ${opts.from} has no files to copy.`);
  const facts = sourceFacts(opts.from);
  const leftOut = () => {
    if (ignored.length) say(`Left out ${ignored.length} file${ignored.length === 1 ? '' : 's'} the model's Git ignores and does not track: ${ignored.join(', ')}. To ship one, track it in the model's Git (git add -f) and import again.`);
  };

  if (opts.check) {
    const problems = [];
    let record = null;
    try {
      record = JSON.parse(fs.readFileSync(path.join(TARGET, RECORD), 'utf8'));
    } catch {
      problems.push(`scaffold/model/${RECORD} is missing or unreadable; run the import.`);
    }
    problems.push(...compare(opts.from, files));
    const copied = fs.existsSync(TARGET) ? listFiles(TARGET).filter((f) => f !== RECORD) : [];
    problems.push(...unmatchedRules(conditions, copied, (f) => fs.readFileSync(path.join(TARGET, f), 'utf8')).map((p) => `CONDITIONS.json ${p}`));
    if (record && facts.commit && record.commit !== facts.commit) say(`Note: the copy was made from commit ${record.commit}; the model is now at ${facts.commit}.`);
    if (facts.dirty) say('Note: the model has changes that are not committed.');
    leftOut();
    const hidden = ignoredHere(copied);
    if (problems.length || hidden.length) {
      if (problems.length) {
        console.log(`scaffold/model does not match ${opts.from}:`);
        for (const p of problems) console.log(`  - ${p}`);
        console.log('Run: node dev/tools/import-model.mjs' + (opts.from === DEFAULT_SOURCE ? '' : ` --from ${opts.from}`));
      }
      if (hidden.length) {
        console.log(`${hidden.length} copied file${hidden.length === 1 ? ' is' : 's are'} hidden from this repository's Git by the model's own .gitignore and not tracked yet: ${hidden.join(', ')}.`);
        console.log('A clean clone would install projects without them. Stage them by name, once:');
        console.log(`  ${addCommand(hidden)}`);
      }
      process.exitCode = 1;
      return;
    }
    say(`scaffold/model matches ${opts.from} (${files.length} files, commit ${facts.commit || 'unknown'}${facts.dirty ? ', with uncommitted changes' : ''}). Every CONDITIONS.json rule matches the copy.`);
    return;
  }

  // The rules are checked against the source before anything is written.
  const problems = unmatchedRules(conditions, files, (f) => fs.readFileSync(path.join(opts.from, f), 'utf8'));
  if (problems.length) {
    console.error('The model no longer matches these CONDITIONS.json rules. Nothing was copied.');
    for (const p of problems) console.error(`  - ${p}`);
    console.error(`Update ${path.relative(REPO, CONDITIONS_FILE)} to match the model, then run the import again.`);
    process.exit(1);
  }

  // The copy is brought in step file by file: changed files are written,
  // files gone from the model are deleted, and empty folders are removed.
  // Deleting and renaming the whole folder makes the file sync service that
  // watches ~/Documents leave "<name> 2" folders behind.
  const before = fs.existsSync(TARGET) ? listFiles(TARGET).filter((f) => f !== RECORD) : [];
  let written = 0;
  for (const f of files) {
    const from = path.join(opts.from, f);
    const to = path.join(TARGET, ...f.split('/'));
    const data = fs.readFileSync(from);
    const mode = fs.statSync(from).mode & 0o777;
    let same = false;
    try {
      same = fs.readFileSync(to).equals(data) && (fs.statSync(to).mode & 0o777) === mode;
    } catch {
      same = false;
    }
    if (same) continue;
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.writeFileSync(to, data);
    fs.chmodSync(to, mode);
    written += 1;
  }
  for (const f of before) if (!files.includes(f)) fs.unlinkSync(path.join(TARGET, ...f.split('/')));
  removeEmptyFolders(TARGET);
  const record = {
    source: opts.from,
    branch: facts.branch,
    commit: facts.commit,
    dirty: facts.dirty,
    importedAt: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(TARGET, RECORD), `${JSON.stringify(record, null, 2)}\n`);

  const added = files.filter((f) => !before.includes(f));
  const removed = before.filter((f) => !files.includes(f));
  say(`Copied ${files.length} files from ${opts.from} into ${path.relative(REPO, TARGET)}/ (${written} written, the rest already the same).`);
  say(`Source: branch ${facts.branch || 'unknown'}, commit ${facts.commit || 'unknown'}${facts.dirty ? ', with uncommitted changes' : ''}.`);
  if (added.length && before.length) say(`New since the last import: ${added.join(', ')}.`);
  if (removed.length) say(`Gone since the last import: ${removed.join(', ')}.`);
  leftOut();
  const hidden = ignoredHere(files);
  if (hidden.length) {
    // Printed even with --quiet: --check fails until this is done.
    console.log(`The model's own .gitignore hides ${hidden.length} of the copied files from this repository's Git (for example ${hidden.slice(0, 2).join(', ')}).`);
    console.log(`Stage them by name, once, or a clean clone installs projects without them: ${addCommand(hidden)}`);
  }
}

/** The git add -f command, with each path by name, for copied files this repository's Git ignores. */
function addCommand(hidden) {
  const prefix = path.relative(REPO, TARGET).split(path.sep).join('/');
  return `git add -f ${hidden.map((f) => `${prefix}/${f}`).join(' ')}`;
}

/** Remove every empty folder under a folder (the folder itself stays). */
function removeEmptyFolders(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const sub = path.join(dir, e.name);
    removeEmptyFolders(sub);
    if (!fs.readdirSync(sub).length) fs.rmdirSync(sub);
  }
}

/** Copied files that this repository's Git ignores and does not track yet (the model's .gitignore lists .memory/ and .work-items/). */
function ignoredHere(files) {
  const rels = files.map((f) => path.relative(REPO, path.join(TARGET, f)));
  const res = spawnSync('git', ['check-ignore', '--no-index', '--stdin'], { cwd: REPO, input: rels.join('\n'), encoding: 'utf8' });
  if (res.status !== 0 && res.status !== 1) return [];
  const ignored = new Set(res.stdout.split('\n').filter(Boolean));
  const tracked = new Set((git(REPO, ['ls-files', '--', path.relative(REPO, TARGET)]) || '').split('\n').filter(Boolean));
  return files.filter((f, i) => ignored.has(rels[i]) && !tracked.has(rels[i]));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) run();
