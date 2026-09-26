// toolkit memory ...: project memory through one command, whatever the backend.
//
// The backend comes from .toolkit.json memory.type (builtin, hindsight, notion);
// lib/memory/contract.mjs loads its driver. The approval policy lives in the
// memory-save skill, not here: this command records --approved-by when given,
// and refuses a delete without --owner-approved.

import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from '../core/args.mjs';
import { requireProject } from '../core/config.mjs';
import { EXIT, ToolkitError, out } from '../core/output.mjs';
import { parse as parseFrontmatter } from '../core/frontmatter.mjs';
import { today } from '../core/util.mjs';
import { FOCUS_SECTIONS, FRONTMATTER_ORDER, canonicalKey, loadDriver, normalizeName, keyFor, RECORD_TYPES } from '../memory/contract.mjs';
import { refreshCache } from '../memory/startup.mjs';
import { exportMemory, importMemory } from '../memory/transfer.mjs';

export const summary = 'Save, find, and manage project memory: records, the current focus, and the glossary.';

export const help = `Usage:
  toolkit memory save --type <t> --name <slug> --description <d> (--body <text> | --body-file <file|->)
                      [--approved-by <who>] [--supersedes <key>] [--source <text>] [--status <s>]
                      [--last-verified <YYYY-MM-DD|unknown>] [--expect <version|absent>]
  toolkit memory find <query> [--reflect] [--type <t>] [--limit <n>] [--all]
  toolkit memory get <key>
  toolkit memory list [--type <t>] [--status <current|needs-review|retired|all>]
  toolkit memory retire <key> [--superseded-by <key>] [--reason <text>]
  toolkit memory restore <key>
  toolkit memory delete <key> --owner-approved
  toolkit memory focus [--set-file <file|->] [--expect <version>]
  toolkit memory glossary [--set-file <file|->] [--expect <version>]
  toolkit memory reindex
  toolkit memory status
  toolkit memory export --to <folder>
  toolkit memory import --from <folder> [--dry-run]

Types: ${RECORD_TYPES.join(', ')}. A key is <type>_<slug>, for example feedback_deploy_window.
A key typed with dashes (feedback_deploy-window) finds the same record.
A --name longer than 60 characters is refused, not shortened.
A body file that starts with frontmatter fills any field not given as a flag.
Saving over an existing record keeps its source, approved_by, last_verified, and
any other frontmatter fields unless they are given again. Saving a record that
needs review marks it verified today.
retire --superseded-by needs a record that exists.
The current focus has four ## sections (${FOCUS_SECTIONS.join(', ')}) and at most 50 lines.
Exit codes: 0 ok, 1 error or not found, 2 refused (a rule or a stale --expect), 3 not supported by this backend, 4 not a toolkit project.`;

const SUBCOMMANDS = ['save', 'find', 'get', 'list', 'retire', 'restore', 'delete', 'focus', 'glossary', 'reindex', 'status', 'export', 'import'];

export async function run(argv, ctx) {
  const [sub, ...rest] = argv;
  if (!sub || sub === 'help') {
    out(ctx, help, { subcommands: SUBCOMMANDS, help });
    return EXIT.OK;
  }
  if (!SUBCOMMANDS.includes(sub)) {
    throw new ToolkitError(EXIT.INVALID, `Unknown memory command "${sub}". Commands: ${SUBCOMMANDS.join(', ')}.`, {
      fix: 'Run toolkit help memory.',
    });
  }
  const project = requireProject(ctx.cwd);
  const driver = await loadDriver(project, { env: ctx.env });
  const handler = HANDLERS[sub];
  return handler(rest, ctx, { project, driver });
}

// ---------------------------------------------------------------- helpers

function one(value, flag) {
  if (Array.isArray(value)) {
    throw new ToolkitError(EXIT.INVALID, `--${flag} was given more than once.`);
  }
  return value;
}

function str(flags, name) {
  const v = one(flags[name], name);
  if (v === undefined || v === null) return undefined;
  if (v === true) throw new ToolkitError(EXIT.INVALID, `--${name} needs a value.`);
  return String(v);
}

function requireKeyArg(positionals, what) {
  if (!positionals.length) throw new ToolkitError(EXIT.INVALID, `Give the key of the record to ${what}, for example: toolkit memory ${what} feedback_deploy_window.`);
  if (positionals.length > 1) throw new ToolkitError(EXIT.INVALID, `Give one key, not ${positionals.length}.`);
  return positionals[0];
}

async function readInput(ctx, file, flag) {
  if (file === '-') return ctx.stdin();
  const full = path.resolve(ctx.cwd, file);
  try {
    return fs.readFileSync(full, 'utf8');
  } catch (err) {
    throw new ToolkitError(EXIT.INVALID, `--${flag} ${file} cannot be read: ${err.code === 'ENOENT' ? 'there is no such file' : err.message}.`);
  }
}

async function afterWrite(project, driver) {
  if (driver.backend !== 'builtin') await refreshCache(project, driver);
}

function short(version) {
  return version ? String(version).slice(0, 12) : 'none';
}

function statusWord(status) {
  return status === 'needs-review' ? 'needs review' : status;
}

// ---------------------------------------------------------------- save

async function save(argv, ctx, { project, driver }) {
  const { _, flags } = parseArgs(argv, {
    string: ['type', 'name', 'description', 'body', 'body-file', 'approved-by', 'supersedes', 'source', 'status', 'last-verified', 'expect', 'host'],
  });
  if (_.length) throw new ToolkitError(EXIT.INVALID, `toolkit memory save takes no words outside flags (got "${_.join(' ')}"). Put the text in --body or --body-file.`);
  const bodyFlag = str(flags, 'body');
  const bodyFile = str(flags, 'body-file');
  if (bodyFlag === undefined && bodyFile === undefined) {
    throw new ToolkitError(EXIT.INVALID, 'Give the record text with --body <text> or --body-file <file> (use - to read standard input).');
  }
  if (bodyFlag !== undefined && bodyFile !== undefined) {
    throw new ToolkitError(EXIT.INVALID, 'Give --body or --body-file, not both.');
  }
  let bodyText = bodyFlag !== undefined ? bodyFlag : await readInput(ctx, bodyFile, 'body-file');
  let fromFile = {};
  const parsed = parseFrontmatter(bodyText);
  if (parsed.hasFrontmatter) {
    fromFile = parsed.data || {};
    bodyText = parsed.body;
  }
  const pick = (flag, field) => {
    const v = str(flags, flag);
    if (v !== undefined) return v;
    const f = fromFile[field];
    return f === undefined || f === null ? undefined : String(f);
  };
  const type = pick('type', 'type');
  const name = pick('name', 'name');
  const description = pick('description', 'description');
  const missing = [['type', type], ['name', name], ['description', description]].filter(([, v]) => !v).map(([n]) => `--${n}`);
  if (missing.length) throw new ToolkitError(EXIT.INVALID, `toolkit memory save needs ${missing.join(', ')}.`);
  const approvedBy = str(flags, 'approved-by');
  let source = pick('source', 'source');
  const key = keyFor(String(type).trim().toLowerCase(), normalizeName(name));
  const existing = RECORD_TYPES.includes(String(type).trim().toLowerCase()) && normalizeName(name) ? await driver.get(key).catch(() => null) : null;
  if (!source && existing && existing.source) source = existing.source;
  if (!source) source = approvedBy ? `${approvedBy}, ${today()}` : `Agent session, ${today()}`;

  // An update keeps what the caller did not give again. A record that needed
  // review and is saved again has just been checked, so it is verified today.
  let lastVerified = pick('last-verified', 'last_verified');
  if (lastVerified === undefined && existing && existing.last_verified && existing.status !== 'needs-review') {
    lastVerified = existing.last_verified;
  }
  const extra = { ...((existing && existing.extra) || {}) };
  for (const [k, v] of Object.entries(fromFile)) {
    if (!FRONTMATTER_ORDER.includes(k) && k !== 'key' && v !== undefined) extra[k] = v;
  }

  const record = {
    type,
    name,
    description,
    source,
    status: pick('status', 'status') || 'current',
    last_verified: lastVerified,
    approved_by: approvedBy ?? (existing ? existing.approved_by : null) ?? null,
    body: bodyText,
  };
  if (Object.keys(extra).length) record.extra = extra;
  if (record.status === 'retired') record.superseded_by = fromFile.superseded_by ?? null;
  const supersedesFlag = str(flags, 'supersedes');
  const supersedes = supersedesFlag === undefined ? undefined : canonicalKey(supersedesFlag);
  const result = await driver.save(record, { expect: str(flags, 'expect') });

  let retired = null;
  let retireError = null;
  if (supersedes && supersedes !== result.key) {
    try {
      await driver.retire(supersedes, { supersededBy: result.key });
      retired = supersedes;
    } catch (err) {
      retireError = err;
    }
  }
  await afterWrite(project, driver);

  const lines = [`Saved to memory: ${result.key} (${result.created ? 'new record' : 'updated'}).`];
  lines.push(`Where: ${driver.location}`);
  lines.push(`Version: ${short(result.version)}`);
  if (approvedBy) lines.push(`Approved by: ${approvedBy}`);
  if (retired) lines.push(`Retired ${retired}; it is replaced by ${result.key}.`);
  out(ctx, lines, {
    ok: true,
    action: 'save',
    key: result.key,
    created: result.created,
    version: result.version,
    backend: driver.backend,
    location: driver.location,
    path: result.record && result.record.path ? result.record.path : null,
    approved_by: approvedBy ?? null,
    retired,
  });
  if (retireError) {
    throw new ToolkitError(retireError.code || EXIT.ERROR, `${result.key} was saved, but ${supersedes} was not retired: ${retireError.message}`, {
      key: result.key,
      supersedes,
    });
  }
  return EXIT.OK;
}

// ---------------------------------------------------------------- read

async function find(argv, ctx, { driver }) {
  const { _, flags } = parseArgs(argv, { boolean: ['reflect', 'all'], string: ['type', 'limit', 'host'] });
  const query = _.join(' ').trim();
  if (!query) throw new ToolkitError(EXIT.INVALID, 'Give words to search for, for example: toolkit memory find deploy window.');
  const limitText = str(flags, 'limit');
  const limit = limitText === undefined ? 10 : Number(limitText);
  if (!Number.isInteger(limit) || limit < 1) throw new ToolkitError(EXIT.INVALID, '--limit must be a whole number of 1 or more.');
  const res = await driver.find(query, { reflect: Boolean(flags.reflect), limit, type: str(flags, 'type'), all: Boolean(flags.all) });
  const lines = [];
  const n = res.results.length;
  // Keyword search (built-in) lists only records that contain the words.
  // Recall (Hindsight) always lists the closest records, even when none is about the question.
  const closest = String(res.mode || '').startsWith('recall');
  if (!n) lines.push(`No memory records match "${query}".`);
  else if (closest) {
    lines.push(`The ${n} memory record${n === 1 ? '' : 's'} closest to "${query}", best first. A close record is not always about the question:`);
  } else {
    lines.push(`${n} memory record${n === 1 ? ' matches' : 's match'} "${query}" (best first):`);
    for (const r of res.results) {
      const flag = r.status && r.status !== 'current' ? ` [${statusWord(r.status)}]` : '';
      lines.push(`- ${r.key}${flag}: ${r.description}`);
      if (r.snippet) lines.push(`    ${r.snippet}`);
    }
    lines.push('Read a record with toolkit memory get <key> before relying on it.');
  }
  if (res.answer !== undefined) {
    lines.push('', `Answer from Hindsight reflect (${(res.answerMs / 1000).toFixed(1)} s; a summary, not a source):`, res.answer || '(no answer)');
  }
  out(ctx, lines, { ok: true, backend: driver.backend, ...res });
  return EXIT.OK;
}

async function get(argv, ctx, { driver }) {
  const { _ } = parseArgs(argv, { string: ['host'] });
  const key = requireKeyArg(_, 'get');
  const rec = await driver.get(key);
  if (!rec) {
    throw new ToolkitError(EXIT.ERROR, `There is no memory record with the key ${key}.`, { key, fix: 'Run toolkit memory list --status all to see the keys.' });
  }
  const text = rec.problems && rec.problems.length
    ? `${rec.text.replace(/\s+$/, '')}\n\n[toolkit: this record breaks a rule: ${rec.problems.join(' ')}]`
    : rec.text;
  out(ctx, text, { ok: true, backend: driver.backend, ...rec });
  return EXIT.OK;
}

async function list(argv, ctx, { driver }) {
  const { flags } = parseArgs(argv, { string: ['type', 'status', 'host'] });
  const records = await driver.list({ type: str(flags, 'type'), status: str(flags, 'status') });
  const lines = records.length ? records.map((r) => {
    const flag = r.status !== 'current' ? ` [${statusWord(r.status)}]` : '';
    return `- ${r.key}${flag}: ${r.description}`;
  }) : ['No memory records.'];
  out(ctx, lines, { ok: true, backend: driver.backend, records });
  return EXIT.OK;
}

// ---------------------------------------------------------------- lifecycle

async function retire(argv, ctx, { project, driver }) {
  const { _, flags } = parseArgs(argv, { string: ['superseded-by', 'reason', 'host'] });
  const key = requireKeyArg(_, 'retire');
  const supersededBy = str(flags, 'superseded-by');
  if (supersededBy !== undefined && canonicalKey(supersededBy) === canonicalKey(key)) {
    throw new ToolkitError(EXIT.INVALID, 'A record cannot be superseded by itself.', { key });
  }
  if (supersededBy !== undefined && !(await driver.get(supersededBy))) {
    throw new ToolkitError(EXIT.INVALID, `${key} was not retired: the replacement ${canonicalKey(supersededBy)} does not exist.`, {
      key,
      supersededBy: canonicalKey(supersededBy),
      fix: 'Save the new record first, or check the key with toolkit memory list --status all.',
    });
  }
  const res = await driver.retire(key, { supersededBy, reason: str(flags, 'reason') });
  await afterWrite(project, driver);
  const by = res.record && res.record.superseded_by ? ` It is replaced by ${res.record.superseded_by}.` : '';
  out(ctx, [`Retired ${res.key}.${by}`, `Undo with: toolkit memory restore ${res.key}`], { ok: true, action: 'retire', backend: driver.backend, key: res.key, version: res.version, superseded_by: res.record ? res.record.superseded_by : null });
  return EXIT.OK;
}

async function restore(argv, ctx, { project, driver }) {
  const { _ } = parseArgs(argv, { string: ['host'] });
  const key = requireKeyArg(_, 'restore');
  const res = await driver.restore(key);
  await afterWrite(project, driver);
  out(ctx, `Restored ${res.key}. Its status is now needs review; check it and save it again as current when it is still true.`, { ok: true, action: 'restore', backend: driver.backend, key: res.key, version: res.version, status: 'needs-review' });
  return EXIT.OK;
}

async function del(argv, ctx, { project, driver }) {
  const { _, flags } = parseArgs(argv, { boolean: ['owner-approved'], string: ['host'] });
  const key = requireKeyArg(_, 'delete');
  if (flags['owner-approved'] !== true) {
    throw new ToolkitError(EXIT.INVALID, `${key} was not deleted. Deleting a memory record cannot be undone, so it needs the owner's explicit approval: add --owner-approved only after the owner said to delete it. To hide a record instead, use toolkit memory retire ${key}.`, { key });
  }
  const res = await driver.delete(key);
  await afterWrite(project, driver);
  out(ctx, `Deleted ${res.key}. This cannot be undone.`, { ok: true, action: 'delete', backend: driver.backend, key: res.key, deleted: true });
  return EXIT.OK;
}

// ---------------------------------------------------------------- focus and glossary

async function textDocument(argv, ctx, { project, driver }, kind) {
  const { _, flags } = parseArgs(argv, { string: ['set-file', 'expect', 'host'] });
  if (_.length) throw new ToolkitError(EXIT.INVALID, `toolkit memory ${kind} takes no words outside flags. Use --set-file <file> to replace it.`);
  const label = kind === 'focus' ? 'current focus' : 'glossary';
  const file = str(flags, 'set-file');
  if (file === undefined) {
    const doc = kind === 'focus' ? await driver.focusGet() : await driver.glossaryGet();
    const text = doc.text ? doc.text : `There is no ${label} yet. Set it with toolkit memory ${kind} --set-file <file>.`;
    out(ctx, text, { ok: true, backend: driver.backend, kind, text: doc.text, version: doc.version });
    return EXIT.OK;
  }
  const markdown = await readInput(ctx, file, 'set-file');
  const expect = str(flags, 'expect');
  const res = kind === 'focus' ? await driver.focusSet(markdown, { expect }) : await driver.glossarySet(markdown, { expect });
  await afterWrite(project, driver);
  const extra = res.lines !== undefined ? ` (${res.lines} lines)` : '';
  out(ctx, `Saved the ${label}${extra}. Version: ${short(res.version)}`, { ok: true, action: `${kind}-set`, backend: driver.backend, kind, ...res });
  return EXIT.OK;
}

// ---------------------------------------------------------------- upkeep

async function reindex(argv, ctx, { project, driver }) {
  parseArgs(argv, { string: ['host'] });
  const res = await driver.reindex();
  await afterWrite(project, driver);
  out(ctx, res.detail, { ok: true, action: 'reindex', backend: driver.backend, ...res });
  return EXIT.OK;
}

async function status(argv, ctx, { driver }) {
  parseArgs(argv, { string: ['host'] });
  const st = await driver.status();
  const c = st.counts;
  const lines = [
    `Backend: ${st.backend}`,
    `Where: ${st.location}`,
    `Healthy: ${st.healthy ? 'yes' : 'no'}`,
    `Last save: ${st.lastSave || 'none recorded'}`,
  ];
  if (st.lastExport !== undefined) lines.push(`Last export: ${st.lastExport || 'never'}`);
  lines.push(`Records: ${c.current} current, ${c['needs-review']} needing review, ${c.retired} retired`);
  lines.push(st.detail);
  if (st.problems && st.problems.length) {
    lines.push('Problems:');
    for (const p of st.problems) lines.push(`- ${p.where} ${p.problem}`);
  }
  out(ctx, lines, { ok: st.healthy, ...st });
  return st.healthy ? EXIT.OK : EXIT.ERROR;
}

async function doExport(argv, ctx, { project, driver }) {
  const { flags } = parseArgs(argv, { string: ['to', 'host'] });
  const to = str(flags, 'to');
  if (!to) throw new ToolkitError(EXIT.INVALID, 'Give the folder to export to: toolkit memory export --to <folder>.');
  const res = await exportMemory(driver, path.resolve(ctx.cwd, to), {
    forbidden: [path.join(project.mainRoot, '.memory')],
  });
  out(ctx, [
    `Exported ${res.records} memory record${res.records === 1 ? '' : 's'} (${res.retired} retired) to ${res.dir}.`,
    `Current focus: ${res.focus ? 'included' : 'none'}. Glossary: ${res.glossary ? 'included' : 'none'}.`,
    `Bring it back with: toolkit memory import --from ${res.dir}`,
  ], { ok: true, action: 'export', backend: driver.backend, ...res });
  return EXIT.OK;
}

async function doImport(argv, ctx, { project, driver }) {
  const { flags } = parseArgs(argv, { string: ['from', 'host'], boolean: ['dry-run'] });
  const from = str(flags, 'from');
  if (!from) throw new ToolkitError(EXIT.INVALID, 'Give the folder to import from: toolkit memory import --from <folder>.');
  const res = await importMemory(driver, path.resolve(ctx.cwd, from), { dryRun: Boolean(flags['dry-run']) });
  if (!res.dryRun) await afterWrite(project, driver);
  const verb = res.dryRun ? 'Would import' : 'Imported';
  const lines = [`${verb} ${res.imported.length} memory record${res.imported.length === 1 ? '' : 's'} from ${res.from}.`];
  lines.push(`Current focus: ${res.focus ? (res.dryRun ? 'would be replaced' : 'replaced') : 'not changed'}. Glossary: ${res.glossary ? (res.dryRun ? 'would be replaced' : 'replaced') : 'not changed'}.`);
  if (res.skipped.length) {
    lines.push(`Skipped ${res.skipped.length}:`);
    for (const s of res.skipped) lines.push(`- ${s.file} ${s.problem}`);
  }
  out(ctx, lines, { ok: res.skipped.length === 0, action: 'import', backend: driver.backend, ...res });
  return res.skipped.length ? EXIT.INVALID : EXIT.OK;
}

const HANDLERS = {
  save,
  find,
  get,
  list,
  retire,
  restore,
  delete: del,
  focus: (argv, ctx, deps) => textDocument(argv, ctx, deps, 'focus'),
  glossary: (argv, ctx, deps) => textDocument(argv, ctx, deps, 'glossary'),
  reindex,
  status,
  export: doExport,
  import: doImport,
};
