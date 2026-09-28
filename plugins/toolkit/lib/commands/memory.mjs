// toolkit memory ...: project memory through one command, whatever the backend.
//
// The backend comes from .toolkit.json memory.type (builtin, hindsight, notion);
// lib/memory/contract.mjs loads its driver. The approval policy lives in the
// memory-save skill, not here: this command records --approved-by when given,
// and refuses a delete without --owner-approved.
//
// Added on Mike's approval (2026-09-27, GOAL "Memory additions"):
// - saved proposals: save --proposal, approve, reject (lib/memory/proposals.mjs);
// - the duplicate check in save (lib/memory/similar.mjs);
// - clean deletes: delete, reject, retire, and rename take the record out of
//   the briefing cache at once (forgetInCache), before the cache is refreshed.

import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from '../core/args.mjs';
import { requireProject } from '../core/config.mjs';
import { EXIT, ToolkitError, out } from '../core/output.mjs';
import { parse as parseFrontmatter } from '../core/frontmatter.mjs';
import { today } from '../core/util.mjs';
import {
  FOCUS_SECTIONS, KNOWN_FIELDS, NO_AUTHORIZATION, approvalText, canonicalKey, completeFocus, contractStatus, isProposal,
  isProposalAuthorization, isValidKey, loadDriver, normalizeRecord, proposalText, storedStatus, supersededByFromBody,
  supersedesList, RECORD_TYPES,
} from '../memory/contract.mjs';
import { forgetInCache, refreshCache } from '../memory/startup.mjs';
import { exportMemory, importMemory } from '../memory/transfer.mjs';
import { findSimilar } from '../memory/similar.mjs';
import { approveRecord, rejectProposal } from '../memory/proposals.mjs';

export const summary = 'Save, find, and manage project memory: records, the current focus, and the glossary.';

export const help = `Usage:
  toolkit memory save --type <t> --name <slug> --description <d> (--body <text> | --body-file <file|->)
                      [--approved-by <who>] [--authorization <text>] [--supersedes <key>] [--source <text>]
                      [--status <s>] [--last-verified <YYYY-MM-DD|unknown>] [--expect <version|absent>]
                      [--proposal] [--allow-similar]
  toolkit memory find <query> [--reflect] [--type <t>] [--limit <n>] [--all] [--proposals]
  toolkit memory get <key>
  toolkit memory list [--type <t>] [--status <current|needs-review|retired|all>]
  toolkit memory approve <key> --by <name>
  toolkit memory reject <key> [--reason <text>]
  toolkit memory retire <key> [--superseded-by <key>] [--reason <text>]
  toolkit memory restore <key>
  toolkit memory rename <key> --to <new-key>
  toolkit memory delete <key> --owner-approved
  toolkit memory focus [--set-file <file|-> | --text <text>] [--expect <version>]
  toolkit memory glossary [--set-file <file|-> | --text <text>] [--expect <version>]
  toolkit memory reindex
  toolkit memory status
  toolkit memory export --to <folder>
  toolkit memory import --from <folder> [--dry-run]

Types: ${RECORD_TYPES.join(', ')}. A key is <type>_<slug>, for example feedback_deploy_window.
The key is also the file name without .md and the frontmatter name (the model's topic format).
A key typed with dashes (feedback_deploy-window) finds the same record.
A --name longer than 60 characters is refused, not shortened.
A body file that starts with frontmatter fills any field not given as a flag.
--approved-by writes "authorization: Approved by <who> on <date>". With no approver
and memory.approval trusted, it is "Trusted grant"; --authorization sets the words.
Saving over an existing record keeps its source, authorization, supersedes,
last_verified, and any other frontmatter fields unless they are given again.
Saving a record that needs review marks it verified today.
Duplicate check: save refuses (exit 2) and lists the records when memory
already has one with the same key, or one with a very similar description or
text. Update a record you read with --expect <version>, replace one with
--supersedes <key>, or save a different fact anyway with --allow-similar.
--proposal saves a record the owner has not answered yet ("Save to memory?"):
status needs-review, authorization "Proposed by the agent on <date>". A
proposal is not a fact: find leaves it out unless --proposals (or --all) is
given, and the briefing and toolkit work decisions list it for the owner.
approve records his yes (the record becomes current, "Approved by <name> on
<date>"); reject records his no and deletes the proposal. reject --reason
repeats his reason in the output; nothing keeps it, since the proposal is deleted.
delete, reject, retire, and rename also take the record out of the local
briefing cache (Hindsight and Notion memory) and the index.
toolkit memory focus keeps the "# Current focus" heading and the
"Last updated:" line, and adds them with today's date when they are missing.
A "Last updated:" date older than today is set to today: the save is today's update.
retire --superseded-by <key> marks the record superseded (the replacement must
exist and not be archived); retire alone archives it (built-in: moved to
.memory/archive/). A record saved with status superseded or archived keeps that
word; a superseded record stays beside the current ones.
Links to a note in other notes are repaired when it is renamed (rename, or save
--supersedes), superseded, archived (the link becomes its words plus "(archived)"),
or deleted (the link becomes its words); the notes changed are listed, and so
are notes whose links could not be repaired. Saving an archived note as current
moves it out of archive/ and keeps its links working.
The current focus has four ## sections (${FOCUS_SECTIONS.join(', ')}) and at most 50 lines.
Exit codes: 0 ok, 1 error or not found, 2 refused (a rule or a stale --expect), 3 not supported by this backend, 4 not a toolkit project.`;

const SUBCOMMANDS = ['save', 'find', 'get', 'list', 'approve', 'reject', 'retire', 'restore', 'rename', 'delete', 'focus', 'glossary', 'reindex', 'status', 'export', 'import'];

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

async function afterWrite(project, driver, { forget = [] } = {}) {
  // Clean deletes: the record leaves the briefing cache now, even if the refresh below fails.
  if (forget.length) forgetInCache(project, forget);
  if (driver.backend !== 'builtin') await refreshCache(project, driver);
}

/** Text as one single-quoted shell word, so a command line printed for the agent runs as shown. */
function shellQuote(s) {
  return `'${String(s).replace(/'/g, "'\\''")}'`;
}

function short(version) {
  return version ? String(version).slice(0, 12) : 'none';
}

function statusWord(status) {
  return status === 'needs-review' ? 'needs review' : status;
}

/**
 * How a record's status reads in a list: "[needs review]", "[superseded by <key>]",
 * "[superseded]" (the replacement is not named), "[archived]", or ''.
 */
function statusFlag(r) {
  if (!r.status || r.status === 'current') return '';
  if (r.proposal || isProposal(r)) return ' [proposal: the owner has not answered]';
  if (r.status === 'retired') {
    if (storedStatus(r) === 'archived') return ' [archived]';
    return r.superseded_by ? ` [superseded by ${r.superseded_by}]` : ' [superseded]';
  }
  return ` [${statusWord(r.status)}]`;
}

function notes(n) {
  return `${n} note${n === 1 ? '' : 's'}`;
}

/**
 * The lines about link repair in a driver result: the notes whose links were
 * repaired, the notes also written in the model's topic format, and the notes
 * that could not be repaired (with why). [] when nothing was repaired.
 */
export function repairLines(res) {
  const lines = [];
  const list = (res && res.linksRepaired) || [];
  if (list.length) lines.push(`Links repaired in ${notes(list.length)}: ${list.join(', ')}.`);
  const reformatted = (res && res.reformatted) || [];
  if (reformatted.length) lines.push(`Also written in the model's topic format: ${reformatted.join(', ')}.`);
  const failed = (res && res.linksFailed) || [];
  if (failed.length) {
    lines.push(`Links not repaired in ${notes(failed.length)} (fix each with toolkit memory get and toolkit memory save):`);
    for (const f of failed) lines.push(`- ${f.key}: ${f.reason}`);
  }
  return lines;
}

/** The link-repair fields for --json output: linksRepaired, and linksFailed and reformatted when given. */
function repairFields(res) {
  const outFields = { linksRepaired: (res && res.linksRepaired) || [] };
  if (res && res.linksFailed && res.linksFailed.length) outFields.linksFailed = res.linksFailed;
  if (res && res.reformatted && res.reformatted.length) outFields.reformatted = res.reformatted;
  return outFields;
}

// ---------------------------------------------------------------- save

async function save(argv, ctx, { project, driver }) {
  const { _, flags } = parseArgs(argv, {
    string: ['type', 'name', 'description', 'body', 'body-file', 'approved-by', 'authorization', 'supersedes', 'source', 'status', 'last-verified', 'expect', 'host'],
    boolean: ['proposal', 'allow-similar'],
  });
  if (_.length) throw new ToolkitError(EXIT.INVALID, `toolkit memory save takes no words outside flags (got "${_.join(' ')}"). Put the text in --body or --body-file.`);
  const proposal = flags.proposal === true;
  const allowSimilar = flags['allow-similar'] === true;
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
  const fileMeta = fromFile.metadata && typeof fromFile.metadata === 'object' && !Array.isArray(fromFile.metadata) ? fromFile.metadata : {};
  const pick = (flag, field, alt) => {
    const v = str(flags, flag);
    if (v !== undefined) return v;
    const f = fromFile[field] !== undefined && fromFile[field] !== null ? fromFile[field] : alt;
    return f === undefined || f === null ? undefined : String(f);
  };
  // A body file in the model's format has metadata.type, and name is the whole key.
  const type = pick('type', 'type', fileMeta.type);
  const name = pick('name', 'name');
  const description = pick('description', 'description');
  const missing = [['type', type], ['name', name], ['description', description]].filter(([, v]) => !v).map(([n]) => `--${n}`);
  if (missing.length) throw new ToolkitError(EXIT.INVALID, `toolkit memory save needs ${missing.join(', ')}.`);
  const approvedBy = str(flags, 'approved-by');
  const authorizationFlag = str(flags, 'authorization');
  if (proposal && (approvedBy !== undefined || authorizationFlag !== undefined)) {
    throw new ToolkitError(EXIT.INVALID, 'A proposal has no approver yet, so --proposal cannot go with --approved-by or --authorization. Save it as a proposal now, and record the owner\'s answer later with toolkit memory approve or reject.');
  }
  const statusGiven = pick('status', 'status');
  if (proposal && statusGiven !== undefined && contractStatus(statusGiven) !== 'needs-review') {
    throw new ToolkitError(EXIT.INVALID, `A proposal is saved with the status needs-review, not "${statusGiven}". Leave out --status.`);
  }
  let source = pick('source', 'source');
  const probe = normalizeRecord({ type, name });
  const key = probe.key;
  const existing = RECORD_TYPES.includes(probe.type) && probe.name ? await driver.get(key).catch(() => null) : null;
  if (proposal && existing && !isProposal(existing)) {
    throw new ToolkitError(EXIT.INVALID, `${key} is already a ${existing.status === 'retired' ? storedStatus(existing) : existing.status} record, so it was not saved as a proposal. A proposal never replaces a record the owner approved.`, {
      key,
      fix: 'Ask the owner about the change in the conversation, or propose it under a new name.',
    });
  }
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
    if (!KNOWN_FIELDS.includes(k) && k !== 'key' && v !== undefined) extra[k] = v;
  }

  // authorization, in the model's words.
  let authorization = authorizationFlag;
  if (!authorization && approvedBy) authorization = approvalText(approvedBy, today());
  if (!authorization && proposal) authorization = proposalText(today());
  if (!authorization && fromFile.authorization) authorization = String(fromFile.authorization);
  if (!authorization && existing && existing.authorization) authorization = existing.authorization;
  const mode = project.config && project.config.memory && project.config.memory.approval;
  if (!authorization) authorization = mode === 'trusted' ? 'Trusted grant' : NO_AUTHORIZATION;

  // A proposal stays a proposal until the owner answers: saving it again
  // without his approval keeps it needs-review, and only an approver (or
  // toolkit memory approve) makes it current.
  let status = statusGiven;
  if (proposal) status = 'needs-review';
  else if (isProposalAuthorization(authorization)) {
    if (status !== undefined && contractStatus(status) !== 'needs-review') {
      throw new ToolkitError(EXIT.INVALID, `${key} is a proposal the owner has not answered, so it cannot be saved as ${status}.`, {
        key,
        fix: `Record his yes with toolkit memory approve ${key} --by <name>, or save it again with --approved-by <name> and --expect <version> (the version field of toolkit memory get ${key} --json).`,
      });
    }
    status = 'needs-review';
  }
  if (status === undefined) status = 'current';

  const supersedesFlag = str(flags, 'supersedes');
  const supersedes = supersedesFlag === undefined ? undefined : canonicalKey(supersedesFlag);
  const supersedesAll = supersedesList([...((existing && existing.supersedes) || []), ...supersedesList(fromFile.supersedes)]);
  if (supersedes && supersedes !== key && !supersedesAll.includes(supersedes)) supersedesAll.push(supersedes);

  const record = {
    type,
    name,
    description,
    source,
    status,
    last_verified: lastVerified,
    authorization,
    approved_by: approvedBy ?? null,
    supersedes: supersedesAll,
    body: bodyText,
  };
  const metadata = { ...((existing && existing.metadata) || {}), ...fileMeta };
  if (Object.keys(metadata).some((k) => k !== 'type')) record.metadata = metadata;
  if (Object.keys(extra).length) record.extra = extra;
  // A retired record keeps its word (superseded or archived) and its replacement:
  // from the frontmatter, the body's Superseded line, or the stored record.
  const word = String(record.status).trim().toLowerCase();
  if (word === 'retired' || word === 'superseded') {
    const kept = existing && existing.status === 'retired' && storedStatus(existing) === 'superseded' ? existing.superseded_by : null;
    record.superseded_by = fromFile.superseded_by ?? supersededByFromBody(bodyText) ?? kept ?? null;
    if (word === 'retired' && existing && existing.status === 'retired') record.stored_status = storedStatus(existing);
  }

  // The duplicate check (Mike, 2026-09-27): the same key, or a record with a
  // very similar description or text, stops the save unless the caller says
  // it is meant: --expect <version> (an update of the record read), or
  // --supersedes, or --allow-similar.
  const expect = str(flags, 'expect');
  const updating = expect !== undefined && expect !== 'absent';
  if (!allowSimilar && !supersedes && !updating && isValidKey(key) && RECORD_TYPES.includes(probe.type)) {
    const similar = [];
    if (existing && expect !== 'absent') {
      similar.push({ key: existing.key, description: existing.description, status: existing.status, proposal: isProposal(existing), why: 'the same key', version: existing.version });
    }
    const candidate = normalizeRecord({ type, name, description, body: bodyText }, { today: today() });
    for (const s of await findSimilar(driver, candidate)) similar.push(s);
    if (similar.length) throw duplicateError(key, similar);
  }

  const result = await driver.save(record, { expect });

  let retired = null;
  let retireError = null;
  let retireResult = null;
  if (supersedes && supersedes !== result.key) {
    try {
      retireResult = await driver.retire(supersedes, { supersededBy: result.key });
      retired = supersedes;
    } catch (err) {
      retireError = err;
    }
  }
  const linksRepaired = (retireResult && retireResult.linksRepaired) || [];
  // The replaced record leaves the briefing cache now, even when the refresh fails.
  await afterWrite(project, driver, { forget: retired ? [retired] : [] });

  const saved = result.record || {};
  const isProp = isProposal(saved.status ? saved : record);
  const lines = [isProp
    ? `Saved to memory as a proposal: ${result.key} (${result.created ? 'new record' : 'updated'}). It is not a fact until the owner answers. Record his yes with toolkit memory approve ${result.key} --by <name>, or his no with toolkit memory reject ${result.key}.`
    : `Saved to memory: ${result.key} (${result.created ? 'new record' : 'updated'}).`];
  lines.push(`Where: ${driver.location}`);
  lines.push(`Version: ${short(result.version)}`);
  if (approvedBy) lines.push(`Approved by: ${approvedBy}`);
  if (retired) lines.push(`${retired} is now superseded by ${result.key}.`);
  lines.push(...repairLines(retireResult));
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
    authorization,
    proposal: isProp,
    retired,
    linksRepaired,
    ...(retireResult && retireResult.linksFailed ? { linksFailed: retireResult.linksFailed } : {}),
    ...(retireResult && retireResult.reformatted ? { reformatted: retireResult.reformatted } : {}),
  });
  if (retireError) {
    throw new ToolkitError(retireError.code || EXIT.ERROR, `${result.key} was saved, but ${supersedes} was not retired: ${retireError.message}`, {
      key: result.key,
      supersedes,
    });
  }
  return EXIT.OK;
}

/**
 * The error for a save the duplicate check stopped: every similar record with
 * why, and the three ways on.
 */
function duplicateError(key, similar) {
  const lines = [`${key} was not saved: memory already has ${similar.length === 1 ? 'a record' : 'records'} like it.`];
  for (const s of similar) {
    const flag = s.proposal ? ' (a proposal the owner has not answered)' : s.status && s.status !== 'current' ? ` (${statusWord(s.status)})` : '';
    lines.push(`- ${s.key}${flag}, ${s.why}: ${s.description}`);
  }
  const same = similar.find((s) => s.why === 'the same key');
  const first = similar[0];
  const fix = [
    same
      ? `To update ${same.key}, read it with toolkit memory get ${same.key} and save again with --expect ${short(same.version)}.`
      : `To update ${first.key}, read it with toolkit memory get ${first.key} --json, then save that key with --expect <version> (the version field of that read).`,
    `To replace a record with this one, add --supersedes <key>. When it is a different fact, add --allow-similar.`,
  ].join(' ');
  return new ToolkitError(EXIT.INVALID, lines.join('\n'), {
    key,
    similar: similar.map(({ version, ...rest }) => rest),
    fix,
  });
}

// ---------------------------------------------------------------- read

async function find(argv, ctx, { driver }) {
  const { _, flags } = parseArgs(argv, { boolean: ['reflect', 'all', 'proposals'], string: ['type', 'limit', 'host'] });
  const query = _.join(' ').trim();
  if (!query) throw new ToolkitError(EXIT.INVALID, 'Give words to search for, for example: toolkit memory find deploy window.');
  const limitText = str(flags, 'limit');
  const limit = limitText === undefined ? 10 : Number(limitText);
  if (!Number.isInteger(limit) || limit < 1) throw new ToolkitError(EXIT.INVALID, '--limit must be a whole number of 1 or more.');
  const res = await driver.find(query, { reflect: Boolean(flags.reflect), limit, type: str(flags, 'type'), all: Boolean(flags.all), proposals: Boolean(flags.proposals) });
  const lines = [];
  const n = res.results.length;
  // Keyword search (built-in, Notion) lists only records that contain the words.
  // Recall (Hindsight) sorts what it found (lib/memory/hindsight.mjs recallTier):
  // res.results are about the question; res.maybe may be about it and must be
  // read before any answer; res.closest are not known to be about it. Neither
  // maybe nor closest is ever presented as an answer.
  const recall = String(res.mode || '').startsWith('recall');
  const maybe = recall && Array.isArray(res.maybe) ? res.maybe : [];
  const closest = recall && Array.isArray(res.closest) ? res.closest : [];
  if (!n) {
    if (!recall) lines.push(`No memory records match "${query}".`);
    else if (maybe.length) lines.push(`No memory record is known to be about "${query}".`);
    else lines.push(`No memory record is about "${query}".`);
  } else {
    if (recall) lines.push(`${n} memory record${n === 1 ? ' is' : 's are'} about "${query}" (Hindsight recall, best first):`);
    else lines.push(`${n} memory record${n === 1 ? ' matches' : 's match'} "${query}" (best first):`);
    for (const r of res.results) {
      lines.push(`- ${r.key}${statusFlag(r)}: ${r.description}`);
      if (r.snippet) lines.push(`    ${r.snippet}`);
    }
    lines.push('Read a record with toolkit memory get <key> before relying on it.');
  }
  if (maybe.length) {
    const one = maybe.length === 1;
    lines.push(`${one ? 'This record' : 'These records'} may ${n ? 'also ' : ''}be about it: Hindsight recall scored ${one ? 'it' : 'them'} above the rest, but ${one ? 'it shares' : 'they share'} few of its words.`);
    for (const r of maybe) lines.push(`- ${r.key}${statusFlag(r)}: ${r.description}`);
    if (n) lines.push('Read one with toolkit memory get <key> before answering from it.');
  }
  if (!n && closest.length) {
    lines.push(`Hindsight recall ranked ${maybe.length ? 'these next' : 'these closest'}, but they score low and share few of its words, so none is known to be about it:`);
    for (const r of closest) lines.push(`- ${r.key}${statusFlag(r)}: ${r.description}`);
  }
  if (!n && (maybe.length || closest.length)) {
    lines.push(`Do not answer from these. Read the first one${maybe.length ? ' that may be about it' : ''} with toolkit memory get <key>, and answer only if its text says it; otherwise say it is not in memory.`);
  }
  if (res.proposalsLeftOut) {
    const p = res.proposalsLeftOut;
    lines.push(`${p} saved proposal${p === 1 ? ' also matches' : 's also match'}; ${p === 1 ? 'it is' : 'they are'} not a fact until the owner answers. toolkit memory find ${shellQuote(query)} --proposals shows ${p === 1 ? 'it' : 'them'}.`);
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
  let text = rec.problems && rec.problems.length
    ? `${rec.text.replace(/\s+$/, '')}\n\n[toolkit: this record breaks a rule: ${rec.problems.join(' ')}]`
    : rec.text;
  const proposal = isProposal(rec);
  if (proposal) text = `${text.replace(/\s+$/, '')}\n\n[toolkit: this is a proposal the owner has not answered. It is not a fact: do not rely on it. His yes: toolkit memory approve ${rec.key} --by <name>. His no: toolkit memory reject ${rec.key}.]`;
  out(ctx, text, { ok: true, backend: driver.backend, ...rec, proposal });
  return EXIT.OK;
}

async function list(argv, ctx, { driver }) {
  const { flags } = parseArgs(argv, { string: ['type', 'status', 'host'] });
  const records = await driver.list({ type: str(flags, 'type'), status: str(flags, 'status') });
  const lines = records.length ? records.map((r) => `- ${r.key}${statusFlag(r)}: ${r.description}`) : ['No memory records.'];
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
  if (supersededBy !== undefined) {
    const replacement = await driver.get(supersededBy);
    if (!replacement) {
      throw new ToolkitError(EXIT.INVALID, `${key} was not retired: the replacement ${canonicalKey(supersededBy)} does not exist.`, {
        key,
        supersededBy: canonicalKey(supersededBy),
        fix: 'Save the new record first, or check the key with toolkit memory list --status all.',
      });
    }
    if (replacement.status === 'retired' && storedStatus(replacement) === 'archived') {
      throw new ToolkitError(EXIT.INVALID, `${key} was not retired: the replacement ${replacement.key} is archived, so a link to it would not work.`, {
        key,
        supersededBy: replacement.key,
        fix: `Restore it first with toolkit memory restore ${replacement.key}, or name a record that is in use.`,
      });
    }
  }
  const res = await driver.retire(key, { supersededBy, reason: str(flags, 'reason') });
  await afterWrite(project, driver, { forget: [res.key] });
  const by = res.record && res.record.superseded_by ? res.record.superseded_by : null;
  const lines = [by ? `Retired ${res.key}: it is superseded by ${by}.` : `Retired ${res.key}: it is archived.`];
  lines.push(...repairLines(res));
  lines.push(`Undo with: toolkit memory restore ${res.key}`);
  out(ctx, lines, {
    ok: true, action: 'retire', backend: driver.backend, key: res.key, version: res.version, superseded_by: by,
    status: by ? 'superseded' : 'archived', ...repairFields(res),
  });
  return EXIT.OK;
}

async function rename(argv, ctx, { project, driver }) {
  const { _, flags } = parseArgs(argv, { string: ['to', 'host'] });
  const key = requireKeyArg(_, 'rename');
  const to = str(flags, 'to');
  if (!to) throw new ToolkitError(EXIT.INVALID, `Give the new key with --to, for example: toolkit memory rename ${key} --to project_new_name.`, { key });
  if (typeof driver.rename !== 'function') {
    throw new ToolkitError(EXIT.UNSUPPORTED, `The ${driver.backend} memory backend cannot rename a record.`, { key });
  }
  const res = await driver.rename(key, to);
  await afterWrite(project, driver, { forget: [res.from] });
  const lines = [`Renamed ${res.from} to ${res.key}.`];
  const repaired = repairLines(res);
  lines.push(...(repaired.length ? repaired : ['No other note linked to it.']));
  out(ctx, lines, { ok: true, action: 'rename', backend: driver.backend, from: res.from, key: res.key, version: res.version, ...repairFields(res) });
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
    const what = driver.backend === 'notion'
      ? 'Deleting a memory record moves it to the Notion trash, and Notion deletes it for good after 30 days'
      : 'Deleting a memory record cannot be undone';
    throw new ToolkitError(EXIT.INVALID, `${key} was not deleted. ${what}, so it needs the owner's explicit approval: add --owner-approved only after the owner said to delete it. To hide a record instead, use toolkit memory retire ${key}.`, { key });
  }
  const res = await driver.delete(key);
  await afterWrite(project, driver, { forget: [res.key] });
  // A driver that can undo a delete says how in `detail` (Notion: the page is
  // in the Notion trash for 30 days). Otherwise the delete is final.
  const detail = res.detail || 'This cannot be undone.';
  const lines = [`Deleted ${res.key}. ${detail}`];
  lines.push(...repairLines(res));
  out(ctx, lines, {
    ok: true, action: 'delete', backend: driver.backend, key: res.key, deleted: true, trash: Boolean(res.trash), detail,
    ...repairFields(res),
  });
  return EXIT.OK;
}

// ---------------------------------------------------------------- the owner's answer to a proposal

async function approve(argv, ctx, { project, driver }) {
  const { _, flags } = parseArgs(argv, { string: ['by', 'host'] });
  const key = requireKeyArg(_, 'approve');
  const by = str(flags, 'by');
  const res = await approveRecord(driver, key, { by, today: today() });
  if (res.changed) await afterWrite(project, driver);
  const lines = res.changed
    ? [`Approved ${res.key}: it is now a current memory record, approved by ${String(by).trim()} on ${today()}.`, `Version: ${short(res.version)}`]
    : [`${res.key} is already a current memory record; nothing changed.`];
  out(ctx, lines, { ok: true, action: 'approve', backend: driver.backend, key: res.key, version: res.version, changed: res.changed, approved_by: String(by).trim() });
  return EXIT.OK;
}

async function reject(argv, ctx, { project, driver }) {
  const { _, flags } = parseArgs(argv, { string: ['reason', 'host'] });
  const key = requireKeyArg(_, 'reject');
  const res = await rejectProposal(driver, key);
  await afterWrite(project, driver, { forget: [res.key] });
  const where = res.trash ? ` ${res.detail}` : '';
  const reason = str(flags, 'reason');
  const lines = [`Rejected ${res.key}: the owner said no, so the proposal was deleted.${where}`];
  if (reason && reason.trim()) lines.push(`His reason: ${reason.trim()}`);
  lines.push(...repairLines(res));
  lines.push('A rejected proposal is not saved again, here or under another name. When the owner gave a general rule about what to keep, save only that rule, as a feedback record.');
  out(ctx, lines, {
    ok: true, action: 'reject', backend: driver.backend, key: res.key, deleted: true, trash: Boolean(res.trash), reason: reason ?? null, ...repairFields(res),
  });
  return EXIT.OK;
}

// ---------------------------------------------------------------- focus and glossary

async function textDocument(argv, ctx, { project, driver }, kind) {
  const { _, flags } = parseArgs(argv, { string: ['set-file', 'text', 'expect', 'host'] });
  if (_.length) throw new ToolkitError(EXIT.INVALID, `toolkit memory ${kind} takes no words outside flags. Use --set-file <file> or --text <text> to replace it.`);
  const label = kind === 'focus' ? 'current focus' : 'glossary';
  const file = str(flags, 'set-file');
  const inline = str(flags, 'text');
  if (file !== undefined && inline !== undefined) throw new ToolkitError(EXIT.INVALID, 'Give --set-file or --text, not both.');
  if (file === undefined && inline === undefined) {
    const doc = kind === 'focus' ? await driver.focusGet() : await driver.glossaryGet();
    const text = doc.text ? doc.text : `There is no ${label} yet. Set it with toolkit memory ${kind} --set-file <file>.`;
    out(ctx, text, { ok: true, backend: driver.backend, kind, text: doc.text, version: doc.version });
    return EXIT.OK;
  }
  // --text gives the text in the command itself, so a Codex session needs no
  // temporary file (sample run b, round 2).
  let markdown = inline !== undefined ? inline : await readInput(ctx, file, 'set-file');
  const expect = str(flags, 'expect');
  // The focus keeps the model's "# Current focus" heading and "Last updated:"
  // line (sample runs b and claude-a): what is missing is added.
  let added = [];
  if (kind === 'focus') ({ text: markdown, added } = completeFocus(markdown, { today: today() }));
  const res = kind === 'focus' ? await driver.focusSet(markdown, { expect }) : await driver.glossarySet(markdown, { expect });
  await afterWrite(project, driver);
  const extra = res.lines !== undefined ? ` (${res.lines} lines)` : '';
  const lines = [`Saved the ${label}${extra}. Version: ${short(res.version)}`];
  const addedWords = added.filter((a) => a !== 'date').map((a) => (a === 'heading' ? 'the "# Current focus" heading' : `the "Last updated: ${today()}" line`));
  if (addedWords.length) lines.push(`Added what the model's focus has and the text did not: ${addedWords.join(' and ')}.`);
  if (added.includes('date')) lines.push(`Set "Last updated:" to ${today()}: the text had an older date or none, and this save is today's update.`);
  out(ctx, lines, { ok: true, action: `${kind}-set`, backend: driver.backend, kind, added, ...res });
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
  approve,
  reject,
  retire,
  restore,
  rename,
  delete: del,
  focus: (argv, ctx, deps) => textDocument(argv, ctx, deps, 'focus'),
  glossary: (argv, ctx, deps) => textDocument(argv, ctx, deps, 'glossary'),
  reindex,
  status,
  export: doExport,
  import: doImport,
};
