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
import {
  approvalNote, approvalText, assertKey, bodyTitle, isProposal, loadDriver, notFound, proposalTarget, splitKey, storedStatus, titleFromName,
} from './contract.mjs';
import { editConceptText, editRecordWith, isOneFact, mergeSections, withBodyTitle } from './concepts.mjs';
import { cacheIdentity, proposalRecords, readCache } from './startup.mjs';
import { ownerWording } from './owner-wording.mjs';

/** One proposal as listProposals gives it; concept: the concept it would join (concept memory), or null. */
function row(r) {
  return { key: r.key, description: r.description || '', saved: r.saved || '', source: r.source || '', ...(r.concept ? { concept: r.concept } : {}) };
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
 * else `by`). Refuses a record that is retired.
 *
 * Concept memory (Mike, 2026-09-28): a proposal's fact goes into a concept.
 * - A proposal that names an existing concept (its `concept` field), or
 *   `concept` given here naming one, is added there as a section; the
 *   proposal record goes. The concept's own authorization line is kept; the
 *   section records this approval when it differs (approvalNote).
 * - `concept` naming a key that does not exist yet starts that concept, with
 *   `title` and `description` (or the proposal's), and the fact as its first
 *   section; the proposal record goes.
 * - `concept` equal to the proposal's own key approves it in place, as a
 *   concept.
 * - A one-fact proposal (no "##" section, not an event) with none of these is
 *   refused (verifier, 2026-09-28): its key and title name the fact
 *   ("project_tests_run_before_every_commit"), not a concept, so the agent
 *   names the concept with `concept`.
 * Returns { key, version, record, changed } (changed false when the record
 * was already current), plus { merged, from, heading, action } when the fact
 * went into another concept, and { created: true } when it started one.
 */
export async function approveRecord(driver, key, { by, today = localToday(), ownerName = null, concept = null, title = null, description = null } = {}) {
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
  const proposal = isProposal(rec);
  const conceptKey = concept ? assertKey(concept) : null;
  if (conceptKey && !proposal) {
    throw new ToolkitError(EXIT.INVALID, `${k} is not a proposal, so --concept does not apply. Approve it with toolkit memory approve ${k} --by <name>; to move it into a concept, use toolkit memory merge.`, { key: k });
  }
  if (rec.status === 'current') return { key: k, version: rec.version, record: rec, changed: false };
  const approval = approvalText(who, today);
  const worded = ownerWordedProposal(rec, String(ownerName ?? '').trim() || who);
  const body = approvedProposalBody(worded.body, who, today);
  const target = proposal ? proposalTarget(rec) : null;
  const heading = (target && target.section) || bodyTitle(body) || titleFromName(rec.name);
  const summary = String(description ?? '').trim() || worded.description || rec.description;
  const extra = rec.extra ? { ...rec.extra } : undefined;
  if (extra) {
    delete extra.concept;
    delete extra.section;
  }
  const cleanExtra = extra ? { extra: Object.keys(extra).length ? extra : undefined } : {};

  // Into another concept: the one --concept names, else the one the proposal names.
  let intoKey = conceptKey && conceptKey !== k ? conceptKey : null;
  if (!intoKey && !conceptKey && target) intoKey = target.concept;
  if (intoKey) {
    const parts = splitKey(intoKey);
    if (conceptKey && parts.type !== rec.type) {
      throw new ToolkitError(EXIT.INVALID, `${intoKey} is a ${parts.type} key and ${k} a ${rec.type} proposal, so nothing was approved. A concept's facts share its type: name a ${rec.type}_ concept.`, { key: k });
    }
    if (conceptKey && parts.type === 'event') {
      throw new ToolkitError(EXIT.INVALID, `${intoKey} is an event. An event holds one episode, so a fact is not added to it.`, { key: k });
    }
    const there = await driver.get(intoKey);
    if (there && conceptKey && (there.status === 'retired' || isProposal(there))) {
      throw new ToolkitError(EXIT.INVALID, `${intoKey} is ${isProposal(there) ? 'a proposal the owner has not answered' : storedStatus(there)}, so nothing was approved.`, {
        key: k,
        fix: `Name a concept in use with --concept, or restore ${intoKey} first.`,
      });
    }
    if (there && there.status !== 'retired' && !isProposal(there)) {
      let placed = [];
      const res = await editRecordWith(driver, intoKey, (stored) => {
        const member = {
          ...rec,
          body: withBodyTitle(body, heading),
          approvalNote: approvalNote(approval, stored.authorization, today),
        };
        const merged = mergeSections(stored.body, [member]);
        placed = merged.placed;
        const edited = editConceptText(stored.text, intoKey, { body: merged.body, day: today });
        return { text: edited.text };
      });
      const removed = await driver.delete(k);
      const p = placed[0] || {};
      return {
        key: intoKey, from: k, merged: true, heading: p.heading || heading, action: p.action || 'added',
        version: res.version, record: res.record, changed: true, linksRepaired: removed.linksRepaired || [],
      };
    }
    if (conceptKey) {
      // A new concept, named by the agent, with this fact as its first section.
      const conceptTitle = String(title ?? '').replace(/\s+/g, ' ').trim() || titleFromName(parts.name);
      const shaped = mergeSections(`# ${conceptTitle}\n`, [{ ...rec, body: withBodyTitle(body, heading) }]);
      const res = await driver.save({
        type: rec.type,
        name: parts.name,
        description: summary,
        source: rec.source,
        status: 'current',
        last_verified: today,
        updated: today,
        authorization: approval,
        approved_by: who,
        supersedes: [],
        body: shaped.body,
      }, { expect: 'absent' });
      const removed = await driver.delete(k);
      return {
        key: res.key, from: k, created: true, heading: (shaped.placed[0] || {}).heading || heading, version: res.version, record: res.record,
        changed: true, linksRepaired: removed.linksRepaired || [],
      };
    }
  }

  // In place. A one-fact proposal becomes a concept only under a name the agent gives.
  const oneFact = proposal && rec.type !== 'event' && isOneFact(body);
  if (oneFact && conceptKey !== k) {
    const parts = splitKey(k);
    let concepts = [];
    try {
      concepts = (await driver.list({ type: rec.type })).filter((r) => r.key !== k && r.status === 'current' && !(r.proposal || isProposal(r)));
    } catch {
      concepts = [];
    }
    const shown = concepts.slice(0, 10).map((c) => `${c.key} (${c.title || titleFromName(c.name)})`);
    const missing = target ? ` It named the concept ${target.concept}, which is not in memory now.` : '';
    throw new ToolkitError(EXIT.INVALID, [
      `${k} was not approved yet: it starts a new concept, and its key and title name the fact, not a concept.${missing}`,
      `Name the concept it goes in with --concept: an existing ${rec.type} concept${shown.length ? ` (${shown.join(', ')})` : ' (there is none yet)'}, or a new one named for its subject, for example ${parts.type}_testing for a fact about tests.`,
    ].join(' '), {
      key: k,
      concepts: concepts.map((c) => c.key),
      fix: `toolkit memory approve ${k} --by ${who.includes(' ') ? `'${who}'` : who} --concept ${parts.type}_<subject> (for a new concept, add --title '<Concept title>' and --description '<one-line summary of the concept>').`,
    });
  }
  let inPlace = body;
  if (oneFact) {
    const conceptTitle = String(title ?? '').replace(/\s+/g, ' ').trim() || titleFromName(rec.name);
    inPlace = mergeSections(`# ${conceptTitle}\n`, [{ ...rec, body }]).body;
  } else if (title) {
    inPlace = withBodyTitle(body, title);
  }
  const res = await driver.save({
    ...rec,
    ...cleanExtra,
    description: summary,
    body: inPlace,
    status: 'current',
    authorization: approval,
    approved_by: who,
    last_verified: today,
    updated: today,
  }, { expect: rec.version });
  return { key: res.key, version: res.version, record: res.record, changed: true, conceptMissing: target && !conceptKey ? target.concept : null };
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
  const res = await driver.delete(k);
  return { ...res, title: recordTitle(rec) };
}

/** A record's title: its first "# " heading, else its description, else its key. */
export function recordTitle(rec) {
  const r = rec || {};
  const h1 = /^#\s+(.+?)\s*$/m.exec(String(r.body || ''));
  return (h1 && h1[1]) || String(r.description || '').trim() || String(r.key || '');
}
