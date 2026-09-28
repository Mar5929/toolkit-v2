// Saved memory proposals (Mike, 2026-09-27, "Memory additions" 1).
//
// When the agent asks "Save to memory: <summary>?" and the owner does not
// answer, the record is saved as a proposal: status needs-review (Lore:
// proposed) and an authorization that starts with "Proposed by"
// (`toolkit memory save --proposal`). The agent never uses a proposal as a
// fact: find leaves it out unless asked, the briefing lists it as waiting on
// the owner, and `toolkit work decisions` lists it (listProposals below).
// The owner's answer is recorded with one of:
//   toolkit memory approve <key> --by <name>   the proposal becomes a current record
//   toolkit memory reject <key>                the proposal is deleted
// A rejected proposal is not kept anywhere: the model's .memory/AGENTS.md says
// a rejected candidate is never saved to another memory or a pending queue.
//
// Every function works with every backend (built-in, Hindsight, Notion)
// through the MemoryDriver methods of contract.mjs.

import { EXIT, ToolkitError } from '../core/output.mjs';
import { today as localToday } from '../core/util.mjs';
import { approvalText, assertKey, isProposal, loadDriver, notFound, storedStatus } from './contract.mjs';
import { cacheIdentity, proposalRecords, readCache } from './startup.mjs';

/** One proposal as listProposals gives it. */
function row(r) {
  return { key: r.key, description: r.description || '', saved: r.saved || '', source: r.source || '' };
}

/**
 * The saved proposals of a project, oldest first:
 * [{ key, description, saved, source }].
 *
 * options: { driver, env, fetch } (a driver the caller already has, or what
 * loadDriver needs). The records are read from the backend. When Hindsight or
 * Notion cannot be read, the list comes from the local memory cache that
 * every `toolkit memory` write refreshes, when there is one for this memory;
 * otherwise the read error is thrown (ToolkitError, with a fix).
 */
export async function listProposals(project, { driver, env, fetch: fetchFn } = {}) {
  try {
    const d = driver || await loadDriver(project, { env, fetch: fetchFn });
    const list = await d.list({ status: 'needs-review' });
    return sortOldestFirst(list.filter((r) => r.proposal === true || isProposal(r)).map(row));
  } catch (err) {
    const backend = (project && project.config && project.config.memory && project.config.memory.type) || 'builtin';
    if (backend !== 'builtin') {
      const cached = readCache(project);
      if (cached && cached.backend === backend && cached.identity === cacheIdentity(project) && Array.isArray(cached.records)) {
        return sortOldestFirst(proposalRecords(cached.records).map(row));
      }
    }
    throw err;
  }
}

function sortOldestFirst(rows) {
  return rows.sort((a, b) => (a.saved || '').localeCompare(b.saved || '') || (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
}

/**
 * Record the owner's yes to a record that needs review (a saved proposal, or
 * a record restored after a retire): status current, authorization "Approved
 * by <by> on <date>", verified today. Refuses a record that is retired.
 * Returns { key, version, record, changed } (changed false when the record
 * was already current).
 */
export async function approveRecord(driver, key, { by, today = localToday() } = {}) {
  const k = assertKey(key);
  const who = String(by ?? '').replace(/\s+/g, ' ').trim();
  if (!who) {
    throw new ToolkitError(EXIT.INVALID, `Say who approved it: toolkit memory approve ${k} --by <name>.`, { key: k });
  }
  const rec = await driver.get(k);
  if (!rec) throw notFound(k, driver.location);
  if (rec.status === 'retired') {
    throw new ToolkitError(EXIT.INVALID, `${k} is ${storedStatus(rec)}, so there is nothing to approve.`, {
      key: k,
      fix: `Restore it first with toolkit memory restore ${k}, then approve it.`,
    });
  }
  if (rec.status === 'current') return { key: k, version: rec.version, record: rec, changed: false };
  const res = await driver.save({
    ...rec,
    status: 'current',
    authorization: approvalText(who, today),
    approved_by: who,
    last_verified: today,
  }, { expect: rec.version });
  return { key: res.key, version: res.version, record: res.record, changed: true };
}

/**
 * Record the owner's no to a saved proposal: the record is deleted (Notion:
 * moved to the trash), and links to it in other notes become plain words.
 * Refuses a record that is not a proposal, so an approved record is never
 * deleted this way. Returns the driver's delete result.
 */
export async function rejectProposal(driver, key) {
  const k = assertKey(key);
  const rec = await driver.get(k);
  if (!rec) throw notFound(k, driver.location);
  if (!isProposal(rec)) {
    const what = rec.status === 'retired' ? storedStatus(rec) : rec.status === 'current' ? 'a current record' : 'a record that needs review, not a proposal';
    throw new ToolkitError(EXIT.INVALID, `${k} is ${what}, so it was not rejected. Only a proposal the owner has not answered is rejected.`, {
      key: k,
      fix: `To hide it, use toolkit memory retire ${k}. To delete it for good, the owner must say so: toolkit memory delete ${k} --owner-approved.`,
    });
  }
  return driver.delete(k);
}
