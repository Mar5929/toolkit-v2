#!/usr/bin/env node
// Checks the form of the project's records: DECISIONS.md, system/, sources/, each CLAUDE.md beside
// an AGENTS.md, and, in the main checkout, local work items and Current State. It only reads. A
// finding is one line on stderr, with exit code 2. Its own error prints one line and exits 0.
// Usage: node validate-records.mjs [--all | --staged]. No option: after an edit (PostToolUse JSON
// on stdin). --all: when the agent stops (Stop JSON on stdin). --staged: before a commit.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, realpathSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';

const STATUS = ['Open', 'Decided', 'Superseded', 'Withdrawn'];
const SECTIONS = ['Overview', 'Content', 'Open questions', 'Changelog'];
const PREFIX = { constraints: 'CON', architecture: 'ARC', 'data-model': 'DAT',
  'security-model': 'SEC', automation: 'AUT', glossary: '' };
// Guides and forms are never checked as records.
const GUIDES = ['README.md', 'AGENTS.md', 'CLAUDE.md', 'INTEGRATION-TEMPLATE.md'];
const D = 'DECISIONS.md', S = 'sources/README.md', I = 'system/integrations/README.md';
const ID = /\b(?:DEC|SRC)-\d{3}\b|\b(?:CON|ARC|DAT|SEC|AUT|INT)-\d{2}\b/g;
// A prompt left from a form, such as <short title>. Not a link, an HTML tag, or text in backticks.
const PROMPT = /^(?:[^`]|`[^`]*`)*?<(?![a-z]+:|\/|a |img )(?:\S[^<>\n]*[ #][^<>\n]*|YYYY[^<>\n]*)>/;
const SEPARATOR = /^\|[\s:|-]+$/;
const GIT = { encoding: 'utf8', stdio: 'pipe', timeout: 15000 };

const mode = ['staged', 'all'].find((name) => process.argv.includes(`--${name}`)) ?? 'edit';
const found = [];
const add = (file, line, ...t) => found.push({ file, line, text: t.join(' ').slice(0, 300) });
// A record made of two files is whole only after two edits, so it waits for the stop or commit.
const pair = (...finding) => mode !== 'edit' && add(...finding);
const read = (path) => (existsSync(path) ? readFileSync(path, 'utf8') : ''); // missing: empty
const fail = (error, where = '') => console.error(`validate-records.mjs did not run${where}.`
  + ` Its own error: ${String(error).split('\n')[0]}`);
const real = (path) => { try { return realpathSync(path); } catch { return path; } };
function list(d) { try { return readdirSync(d, { withFileTypes: true }); } catch { return []; } }
// The text of a comment is not checked. Its lines stay, so line numbers hold.
const lines = (text) => text.replace(/<!--[\s\S]*?-->/g, (c) => c.replace(/./g, '')).split('\n');
const noPrompts = (rows) => rows.map((row) => row.replace(/<[^<>\n]*>/g, ''));
const field = (rows, label) => rows.find((row) => row.startsWith(`- ${label}:`))
  ?.slice(label.length + 3).trim() ?? '';
/** The blocks of `rows` that start at a heading matching `head`: its ID, line, and lines. */
function blocks(rows, head, out = [], open = null) {
  rows.forEach((row, i) => {
    const id = row.match(head)?.[1];
    if (id) out.push(open = { id, line: i + 1, rows: [] });
    else if (/^#{1,3} /.test(row)) open = null;
    else open?.rows.push(row);
  });
  return out;
}

/** Runs every check. `top` holds the tracked records. `main` holds work-items/ and memory/; it
 * is null before a commit, because Git never sees those two folders. */
function check(top, main) {
  const decRows = lines(read(join(top, D)));
  const scan = [[D, decRows, true]]; // [file, lines, look for prompts]: for checks 9 and 10
  const itemScan = [[D, decRows, 1]]; // [file, lines, first line number]: for check 15
  // Checks 1 and 2: the entries of DECISIONS.md.
  const [dec, entries] = [new Map(), blocks(decRows, /^## (DEC-\d+)\b/)];
  let last = 0;
  for (const e of entries) {
    const n = Number(e.id.slice(4));
    if (dec.has(e.id)) add(D, e.line, `${e.id} has two entries. Give one the next free ID.`);
    else if (n < last) add(D, e.line, `${e.id} comes after a higher ID. Put entries in ID order.`);
    last = Math.max(last, n);
    dec.set(e.id, field(e.rows, 'Status'));
  }
  for (const e of entries) {
    const [status, decided] = ['Status', 'Decided'].map((label) => field(e.rows, label));
    const other = field(e.rows, 'Replaces or replaced by').match(/DEC-\d+/)?.[0];
    if (!STATUS.includes(status)) add(D, e.line, `${e.id} has Status "${status}".`,
      `Use one of: ${STATUS.join(', ')}.`);
    else if (status === 'Decided' && !/^\d{4}-\d\d-\d\d, *\S/.test(decided)) add(D, e.line,
      `${e.id} is Decided, so its Decided line holds the date and the name: YYYY-MM-DD, who.`);
    else if (status === 'Open' && !/not yet/i.test(decided)) add(D, e.line,
      `${e.id} is Open, so its Decided line says "not yet".`);
    else if (status === 'Superseded' && (other === e.id || !dec.has(other))) add(D, e.line,
      `${e.id} is Superseded, so "Replaces or replaced by" names the entry that replaced it.`);
  }
  // Checks 3 to 6: each document in system/ and system/integrations/.
  const rules = new Map();
  const docs = [['system'], ['system/integrations', 'INT']].flatMap(([dir, fixed]) => list(
    join(top, dir)).filter((f) => f.isFile() && /\.md$/.test(f.name) && !GUIDES.includes(f.name))
    .map((f) => f.name).sort()
    .map((name) => ({ file: `${dir}/${name}`, prefix: fixed ?? PREFIX[name.slice(0, -3)] })));
  for (const { file, prefix } of docs) {
    const rows = lines(read(join(top, file)));
    const heads = rows.flatMap((row, i) => (/^## /.test(row) ? [[row.slice(3).trim(), i]] : []));
    const section = (name, k = heads.findIndex((h) => h[0] === name)) => (k < 0 ? []
      : rows.slice(heads[k][1] + 1, heads[k + 1]?.[1]).map((row, j) => [row, heads[k][1] + 2 + j]));
    const top3 = ['Status', 'Last changed via', 'Governs']
      .map((label) => rows.findIndex((row) => row.startsWith(`- ${label}:`)));
    if (top3.some((at, k) => at < 0 || at > (heads[0]?.[1] ?? at) || at < (top3[k - 1] ?? -1))) add(
      file, 0, 'the top holds three lines in this order, above Overview: "- Status:",',
      '"- Last changed via:", "- Governs:". Restore them as system/AGENTS.md gives them.');
    if (heads.map((h) => h[0]).filter((h) => SECTIONS.includes(h)).join() !== SECTIONS.join()) add(
      file, 0, `the sections are ${SECTIONS.join(', ')}, each once, in that order. Restore them.`);
    // Checks 4 and 5: each rule, then the document's Status against the marks of its rules.
    const mine = blocks(rows, /^### ([A-Z]+-\d+)\b/);
    for (const r of mine) {
      const mark = field(r.rows, 'Mark');
      const [, kind, arg = ''] = mark.match(/^(Draft|Retired|Approved|Built)(?: \((.+)\))?$/) ?? [];
      const formed = kind === 'Approved' ? /^DEC-\d+$/.test(arg)
        : kind === 'Built' ? /^\S+$/.test(arg) : Boolean(kind) && !arg;
      if (prefix !== undefined && !new RegExp(`^${prefix}-\\d\\d$`).test(r.id)) add(file, r.line,
        `${r.id} does not fit this document, which holds ${prefix ? `${prefix}-##` : 'no'} rules.`);
      if (rules.has(r.id)) add(file, r.line, `${r.id} is also a rule in ${rules.get(r.id)}.`,
        'Give this rule the next free ID.');
      rules.set(r.id, file);
      if (!formed) add(file, r.line, `${r.id} has Mark "${mark}".`,
        'Use Draft, Approved (DEC-###), Built (the work item ID), or Retired.');
      const by = kind === 'Approved' ? arg : field(r.rows, 'Source').match(/DEC-\d+/)?.[0];
      if (formed && /^(Approved|Built)$/.test(kind) && dec.get(by) !== 'Decided') add(file, r.line,
        `${r.id} is marked ${kind}, which needs a Decided entry in ${D}, but`, !by ? 'its Source'
          + ' line names no DEC ID.' : `${by} is ${dec.get(by) || 'not an entry there'}.`,
        `Record the decision with filing-project-records, or mark the rule Draft.`);
    }
    const [status, via] = ['Status', 'Last changed via'].map((label) => field(rows, label));
    const draft = mine.some((r) => field(r.rows, 'Mark').startsWith('Draft'));
    const terms = prefix === '' && section('Content').some(([row], k, all) => row.startsWith('|')
      && !SEPARATOR.test(row) && !SEPARATOR.test(all[k + 1]?.[0] ?? ''));
    const expected = draft ? 'Draft' : mine.length || terms ? 'Approved' : 'Not started';
    if (top3[0] >= 0 && status !== expected) add(file, top3[0] + 1, `Status is "${status}",`,
      'but the document', draft ? 'has a rule marked Draft.' : expected === 'Approved' ? 'holds a'
        + ' rule or a term, and no rule is marked Draft.' : 'holds no rule and no term.',
      `Set Status to ${expected}.`);
    // Check 6: "Last changed via" and Open questions.
    if (top3[1] >= 0 && !/^none\.?$/i.test(via) && !dec.has(via.match(/DEC-\d+/)?.[0])) add(file,
      top3[1] + 1, `"Last changed via" is "${via}". Write "none", or the ID of an entry in ${D}.`);
    for (const [row, line] of section('Open questions')) {
      const ids = row.match(/DEC-\d+/g) ?? [];
      const bad = ids.filter((id) => dec.get(id) !== 'Open');
      if (row.trim() && !/^\W*None\W*$/.test(row) && (bad.length || !ids.length)) add(file, line,
        `Open questions holds only the IDs of Open entries in ${D}, or "None.".`, bad.length
          ? `${bad.join(', ')} is not Open there: remove it.` : `Move this text to its entry.`);
    }
    scan.push([file, rows, true]);
    itemScan.push(...section('Changelog').map(([row, line]) => [file, [row], line]));
  }
  // Check 7: the list of sources against the files in sources/.
  const [src, srcRows] = [new Map(), lines(read(join(top, S)))];
  srcRows.forEach((row, i) => {
    const cells = row.split(/(?<!\\)\|/).map((cell) => cell.trim());
    const id = cells[1]?.match(/^SRC-\d+$/)?.[0];
    if (!id) return;
    if (src.has(id)) add(S, i + 1, `${id} has two rows. Give the later source the next free ID.`);
    src.set(id, i + 1);
    // Only a row kept in the repository holds a Markdown link to its file.
    const kept = cells[5]?.match(/\]\((?!\w+:)([^)]+)\)/)?.[1];
    if (kept && !existsSync(join(top, 'sources', kept.replace(/^(\.\/|sources\/)+/, '')))) pair(S,
      i + 1, `${id}: "Where kept" names ${kept}, which is not in sources/. Correct the link.`);
  });
  for (const { name } of list(join(top, 'sources'))) {
    if (GUIDES.includes(name) || name.startsWith('.')) continue;
    if (!src.has(name.match(/^SRC-\d+(?=[-.]|$)/)?.[0])) pair(`sources/${name}`, 0, 'has no row',
      `in ${S}. File it with filing-project-records, which gives it a row and its SRC ID.`);
  }
  scan.push([S, srcRows, true]);
  // Check 8, before a commit only: a filed original is never changed or deleted.
  const diff = main ? '' : execFileSync('git', ['diff', '--cached', '--name-only', '--no-renames',
    '--diff-filter=MD', '--', 'sources'], { ...GIT, cwd: top });
  diff.split('\n').filter((name) => name && !GUIDES.includes(name.slice(8))).forEach((file) => add(
    file, 0, 'this commit changes or deletes a filed source. Take that change out of the',
    'commit, and file a corrected version as a new SRC.'));
  // Checks 13 and 14: local work items, in the main checkout.
  const items = new Map();
  const walk = (dir) => list(dir).flatMap((f) => (f.name === 'work-item-template' ? []
    : f.isDirectory() ? walk(join(dir, f.name)) : /\.md$/.test(f.name) ? [join(dir, f.name)] : []));
  for (const path of main ? walk(join(main, 'work-items')) : []) {
    const text = read(path);
    const front = text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
    const value = (key) => front.match(new RegExp(`^${key}: *"?([^"\\n]*?)"? *$`, 'm'))?.[1] ?? '';
    const [id, file] = [value('id'), relative(main, path)];
    if (!id || basename(path) === 'DESIGN.md') continue;
    if (basename(path) !== `${id}.md` || !basename(dirname(path)).startsWith(`${id}-`)) add(file,
      0, `this work item's id is ${id}, so its file is ${id}.md, in a folder whose name starts`,
      `with "${id}-". Rename it with managing-work-items.`);
    if (items.has(id)) add(file, 0, `${id} is also the id of ${items.get(id)}. Renumber the work`,
      `item made in this session with managing-work-items, and tell the owner.`);
    items.set(id, file);
    const moved = text.match(/^\*\*Moved up:\*\*(.*)$/m)?.[1].replace(/<[^<>\n]*>/g, '').trim();
    if (/^(Done|Cancelled)$/.test(value('status')) && !moved) add(file, 0, 'the work item is',
      'closed, but its Moved up line is empty. Closing with managing-work-items fills it.');
    scan.push([file, noPrompts(lines(text)), false]);
  }
  // Check 9: every DEC, SRC, and rule ID that is written is defined. Check 10: no prompt is left.
  const said = new Set();
  for (const [file, rows, prompts] of scan) {
    const left = rows.flatMap((row, i) => (prompts && PROMPT.test(row) ? [i + 1] : []));
    if (left.length) add(file, left[0], 'Lines that hold an angle-bracket prompt from the form:',
      `${left.length}. Replace each prompt with the real text.`);
    rows.forEach((row, i) => {
      for (const id of row.match(ID) ?? []) {
        const [home, ids] = { DEC: [D, dec], SRC: [S, src] }[id.slice(0, 3)] ?? ['system/', rules];
        if (ids.has(id) || said.has(file + id)) continue;
        said.add(file + id);
        add(file, i + 1, `${id} is written here, but ${home} has no ${id}. Correct the ID, or`,
          `file the record first with filing-project-records.`);
      }
    });
  }
  // Check 11: the project folder and each folder directly inside it.
  const inside = list(top).filter((f) => f.isDirectory()
    && !/^\.|^node_modules$|^work-items$|^memory$/.test(f.name)).map((f) => [f.name, top]);
  const local = main ? [['work-items', main], ['memory', main]] : [];
  for (const [name, root] of [['', top], ...inside, ...local]) {
    if (existsSync(join(root, name, 'AGENTS.md'))
      && read(join(root, name, 'CLAUDE.md')).trim() !== '@AGENTS.md') add(join(name, 'CLAUDE.md'),
      0, 'this folder has an AGENTS.md, so its CLAUDE.md holds exactly one line: @AGENTS.md.',
      'Restore that line.');
  }
  // Check 12: the list of integration documents.
  const listed = lines(read(join(top, I))).map((row) => row.match(/^\|[^|]*?([\w.-]+\.md)/)?.[1]);
  listed.forEach((name, i) => name && !existsSync(join(top, dirname(I), name)) && pair(I, i + 1,
    `the row for ${name} names a document that is not in this folder. Correct or remove the row.`));
  docs.filter((doc) => doc.prefix === 'INT' && !listed.includes(basename(doc.file)))
    .forEach((doc) => pair(doc.file, 0, `has no row in ${I}. Add its row.`));
  // Check 15: work item IDs written in DECISIONS.md, a Changelog, or Current State.
  const wi = read(join(top, 'PROJECT.md')).match(/^- Work item ID prefix: `([A-Za-z]\w*)`/m)?.[1];
  const state = 'memory/CURRENT_STATE.md';
  if (main) itemScan.push([state, noPrompts(lines(read(join(main, state)))), 1]);
  const known = (id) => !main || !existsSync(join(main, 'work-items')) || items.has(id);
  for (const [file, rows, from] of wi ? itemScan : []) {
    rows.forEach((row, j) => {
      for (const id of row.match(new RegExp(`\\b${wi}-?\\d+\\b`, 'gi')) ?? []) {
        const formed = id.startsWith(`${wi}-`);
        if ((formed && known(id)) || said.has(file + id)) continue;
        said.add(file + id);
        add(file, from + j, formed ? `${id} is not a work item in work-items/. Correct the ID.`
          : `"${id}" is not a work item ID. Write ${wi}-, then the number, such as ${wi}-031.`);
      }
    });
  }
}

try {
  const text = mode === 'staged' || process.stdin.isTTY ? '' : readFileSync(0, 'utf8');
  const input = text.trim() ? JSON.parse(text) : {};
  if (mode === 'all' && input.stop_hook_active) process.exit(0); // never block a stop twice
  const cwd = real(input.cwd || process.cwd());
  // The edited file. Claude Code gives its path in tool_input.file_path. Codex gives the patch
  // text in tool_input.command, where a line such as "*** Update File: <path>" names each file.
  const patch = [input.tool_input?.command ?? ''].flat().join('\n').trim();
  const named = [...patch.matchAll(/^\*\*\* (?:(?:Add|Update|Delete) File|Move to): (.+)$/gm)];
  const edited = [input.tool_input?.file_path, ...named.map((m) => m[1])].filter(Boolean)
    .map((p) => resolve(cwd, String(p).trim())).map((p) => join(real(dirname(p)), basename(p)));
  // work-items/ and memory/ are kept out of Git, so they are only in the main checkout.
  const repo = (at) => { try {
    const git = execFileSync('git', ['rev-parse', '--show-toplevel', '--git-common-dir'],
      { ...GIT, cwd: at }).trim().split('\n');
    return [real(git[0]), real(dirname(resolve(at, git[1])))];
  } catch { return [cwd, cwd]; } }; // no Git repository: the folder the command ran in
  const [top, main] = repo(edited.map(dirname).find((dir) => existsSync(dir)) ?? cwd);
  if (repo(cwd)[1] !== main) process.exit(0); // an edit in another repository is not checked
  // After an edit, only the edited file's group is reported; for a patch that names no file, both.
  const local = (path) => /^(work-items|memory)\//.test(path);
  const tracked = /^(?!\.\.)(DECISIONS\.md$|system\/|sources\/|(.*\/)?(AGENTS|CLAUDE)\.md$)/;
  const groups = patch && !named.length ? ['local', 'tracked'] : edited.map((path) => (
    local(relative(main, path)) ? 'local' : tracked.test(relative(top, path)) && 'tracked'));
  if (mode === 'edit' && !groups.some(Boolean)) process.exit(0);
  // In a worktree, work items and Current State are checked against the main checkout's records.
  const far = mode !== 'staged' && top !== main;
  check(top, mode === 'staged' ? null : main);
  const here = found.splice(0).filter(({ file }) => !far || !local(file));
  let lost; // an error of this second check must not lose the findings of the first
  try { if (far) check(main, main); } catch (error) { lost = error; }
  const all = [...here, ...found.filter(({ file }) => local(file))].filter(({ file }) => mode
    !== 'edit' || groups.includes(local(file) ? 'local' : 'tracked'))
    .map(({ file, line, text: what }) => `${file}${line ? `:${line}` : ''}: ${what}`);
  if (!all.length && !lost) process.exit(0);
  // In Codex this text replaces the result of the edit, so it says the edit was not undone.
  const out = !all.length ? [] : [`validate-records.mjs found problems: ${all.length}.${{ edit:
    ' The edit was not undone.', staged: ' The commit was stopped.' }[mode] ?? ''} Fix each one.`
    + ' Tell the owner of any you cannot fix.'];
  // Hosts cut long hook output, so the list stays under about 2,000 characters.
  while (all.length && out.join('\n').length + all[0].length < 1850) out.push(all.shift());
  if (all.length) out.push(`${all.length} more are not shown. Fix these first.`);
  if (out.length) process.exitCode = 2;
  if (out.length) console.error(out.join('\n')); // it ignores a reader that closed the output
  if (lost) fail(lost, ' in the main checkout');
} catch (error) { fail(error); }
