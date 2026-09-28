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
import { ownerWording } from './owner-wording.mjs';

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
 * The "How to apply" words of a proposal the Stop hook saved
 * (lib/hooks/proposal.mjs proposalBody). They stop being true once the owner
 * approves it.
 */
export const HOOK_PROPOSAL_WAIT = 'Do not rely on this until the owner approves it.';

/** The end of the Evidence and limits line of a proposal the Stop hook saved. */
export const HOOK_PROPOSAL_EVIDENCE = "so the toolkit's Stop hook saved it as a proposal.";

/**
 * The body of an approved proposal that the Stop hook saved: the line that
 * says not to rely on it goes, and the Evidence line says who approved it and
 * when. Any other body is returned as it is. Before this, the skills had to
 * rewrite the whole body, while the hook's note and the CLI said to run
 * toolkit memory approve (skill-references review, 2026-09-28).
 */
export function approvedProposalBody(body, who, day) {
  const text = String(body ?? '');
  if (!text.includes(HOOK_PROPOSAL_WAIT) || !text.includes(HOOK_PROPOSAL_EVIDENCE)) return text;
  return text
    .split('\n')
    .map((line) => {
      if (line.startsWith('**How to apply:**') && line.includes(HOOK_PROPOSAL_WAIT)) {
        const rest = line.replace(HOOK_PROPOSAL_WAIT, '').replace(/\s+$/, '');
        return rest === '**How to apply:**' ? '**How to apply:** Not stated by the owner.' : rest;
      }
      if (line.startsWith('**Evidence and limits:**') && line.endsWith(HOOK_PROPOSAL_EVIDENCE)) {
        return `${line} ${who} approved it on ${day}.`;
      }
      return line;
    })
    .join('\n');
}

/**
 * The title, Remember line, and description of a proposal the Stop hook
 * saved, with the owner's name in place of a leading "you" (ownerWording).
 * The hook does this itself now; this covers a proposal it saved before
 * (final confirmation round 1: "You publish your blog on Ghost ..." stayed
 * in the record after approval). Any other record is returned as it is.
 */
export function ownerWordedProposal(rec, ownerName) {
  const body = String((rec && rec.body) ?? '');
  const description = (rec && rec.description) || '';
  if (!body.includes(HOOK_PROPOSAL_WAIT) || !body.includes(HOOK_PROPOSAL_EVIDENCE)) return { body, description };
  let titled = false;
  const lines = body.split('\n').map((line) => {
    if (!titled && /^# /.test(line)) {
      titled = true;
      return `# ${ownerWording(line.slice(2), ownerName)}`;
    }
    if (line.startsWith('**Remember:** ')) return `**Remember:** ${ownerWording(line.slice('**Remember:** '.length), ownerName)}`;
    return line;
  });
  return { body: lines.join('\n'), description: ownerWording(description, ownerName) };
}

/**
 * Record the owner's yes to a record that needs review (a saved proposal, or
 * a record restored after a retire): status current, authorization "Approved
 * by <by> on <date>", verified today. A proposal the Stop hook saved also
 * loses its "Do not rely on this" words (approvedProposalBody), and a leading
 * "you" in it becomes the owner's name (ownerWordedProposal; `ownerName`,
 * else `by`). Refuses a record that is retired. Returns { key, version,
 * record, changed } (changed false when the record was already current).
 */
export async function approveRecord(driver, key, { by, today = localToday(), ownerName = null } = {}) {
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
  const worded = ownerWordedProposal(rec, String(ownerName ?? '').trim() || who);
  const res = await driver.save({
    ...rec,
    description: worded.description || rec.description,
    body: approvedProposalBody(worded.body, who, today),
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
