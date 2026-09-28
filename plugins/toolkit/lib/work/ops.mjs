// The `toolkit work` operations, written once against the tracker driver
// interface (driver.mjs) so the local and Notion trackers behave the same way.
// Each operation reads the item, changes it, and writes it back with
// expectBody so a change made in between is never overwritten.

import fs from 'node:fs';
import path from 'node:path';
import { EXIT, ToolkitError } from '../core/output.mjs';
import { today as todayDate } from '../core/util.mjs';
import {
  STAGES, TYPE_IDS, PRIORITIES, DELIVERY, DESIGN_STATUSES, DESIGN_FIELD_ORDER, findStage, stageNumber, statusForStage,
  stageShort, isTerminal, isValidType, typeNeedsRequirements, normalizePriority, normalizeDelivery, normalizeWaitingOn,
  isApproved, formatApproval, continueWith, brokenGates,
} from './lifecycle.mjs';
import {
  parseDoc, tryParseDoc, peekHeader, newRecordText, newDesignText, setH1, getH1, setLabel, hasLabel, appendHistory, appendSectionRow,
  setSectionText, getSectionText, splitRowText, sectionNames, canonicalId, parseId, normalizeParent,
  isPlaceholder, parseRequirements, parseQuestions, validateRecord, validateDesign, composeDoc,
  isBlocked, DESIGN_SUFFIX, setDesignStatusLine, normalizeMeta, removeItemGuide, parseHistory,
  parseRoadmap, separateLabelLines, ensureDesignStatusLine, designStatusFromBody, isOpenOwnerQuestion, setQuestionStatus,
  linkRelatedItem, unlinkRelatedItem, addRoadmapSubItem, removeRoadmapSubItem, removeTemplateComments, removeHistoryRow,
} from './model.mjs';
import { RECORD_FILE, DESIGN_FILE, loadTemplate } from './templates.mjs';
import { TRACKER_DIR } from './state.mjs';
import { isDesignQuestion, isResultQuestion, isDeliveryQuestion, isRequirementsQuestion } from './decisions.mjs';

const MAX_TRIES = 6;

function invalid(message, details) {
  return new ToolkitError(EXIT.INVALID, message, details);
}

/** Run fn again when the driver reports that the item changed while it was read (details.conflict). */
export async function withRetry(fn, tries = MAX_TRIES) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn(i);
    } catch (err) {
      if (!(err && err.details && err.details.conflict)) throw err;
      last = err;
      await new Promise((r) => setTimeout(r, 20 * (i + 1) + Math.floor(Math.random() * 30)));
    }
  }
  throw last;
}

/**
 * Read, change, and write one item without losing a change made in between:
 * inside the tracker's lock when it has one (the local tracker), and retried
 * on a conflict otherwise.
 */
export async function change(tracker, fn) {
  return withRetry(() => (typeof tracker.transaction === 'function' ? tracker.transaction(fn) : fn()));
}

/** The item, or a not-found error (exit 1). */
export async function mustGet(tracker, id) {
  const key = canonicalId(id, tracker.prefix);
  if (!key) throw invalid(`"${id}" is not a work item id such as ${tracker.prefix || 'WI'}-007.`);
  const rec = await tracker.get(key);
  if (!rec) {
    throw new ToolkitError(EXIT.ERROR, `${key} was not found.`, { id: key, fix: 'Run toolkit work list --all to see every item.' });
  }
  if (!rec.id) rec.id = key;
  rec.meta = normalizeMeta(rec.meta || {});
  return rec;
}

/**
 * Every item from the driver, with `id` set and `meta` normalized to strings.
 * @param {{ includeArchived?: boolean, includeBody?: boolean, fetchBodies?: boolean }} [opts]
 *   fetchBodies: read the body of each open item the driver listed without one.
 */
export async function listItems(tracker, { includeArchived = true, includeBody = false, fetchBodies = false } = {}) {
  const listed = await tracker.list({ includeArchived, includeBody: includeBody || fetchBodies });
  const outList = [];
  for (const raw of listed || []) {
    let item = { ...raw };
    item.id = item.id || canonicalId(item.meta && item.meta.id, tracker.prefix);
    if (fetchBodies && item.body === undefined && !item.archived) {
      const full = await tracker.get(item.id);
      if (full) item = { ...item, ...full, id: item.id };
    }
    item.meta = normalizeMeta(item.meta || {});
    outList.push(item);
  }
  return outList;
}

/** The template text for WORK-ITEM.md or DESIGN.md for this project. */
export function templateText(tracker, project, name) {
  if (tracker && typeof tracker.template === 'function') {
    const t = tracker.template(name);
    if (t && typeof t.text === 'string') return t.text;
  }
  const trackerDir = project ? path.join(project.mainRoot || project.root, TRACKER_DIR) : undefined;
  return loadTemplate(name, { trackerDir }).text;
}

function todayOf(opts) {
  return (opts && opts.today) || todayDate();
}

/** Parse a stage given on the command line, or fail with the list of stages. */
export function stageArg(value) {
  const s = findStage(value);
  if (!s) {
    throw invalid(`"${value}" is not a stage. Stages: ${STAGES.map((x) => x.id).join(', ')}.`, { stages: STAGES.map((x) => x.id) });
  }
  return s.id;
}

function typeArg(value) {
  const v = String(value).trim().toLowerCase();
  if (!isValidType(v)) throw invalid(`"${value}" is not a type. Types: ${TYPE_IDS.join(', ')}.`, { types: TYPE_IDS });
  return v;
}

function requirementsGate(id, type, stage, meta) {
  if (typeNeedsRequirements(type) && !isApproved(meta.requirements_approved) && (stageNumber(stage) ?? 0) >= 3) {
    return invalid(`${id} is a ${type} item, and ${type} items need the owner's recorded requirements approval before stage 03 or later. Nothing was changed.`, {
      gate: 'requirements_not_approved',
      fix: `After the owner approves the requirements: toolkit work approve ${id} --requirements --by <name>`,
    });
  }
  return null;
}

function addHistory(body, row) {
  try {
    return appendHistory(body, row);
  } catch {
    return body;
  }
}

async function save(tracker, rec, { meta = {}, body }) {
  return tracker.update(rec.id, { meta, body, expectBody: rec.body, expectMeta: { stage: rec.meta.stage, status: rec.meta.status } });
}

function verify(back, want, id) {
  if (!back) throw new ToolkitError(EXIT.ERROR, `Saved but not verified: ${id} could not be read back.`, { id });
  const bm = normalizeMeta(back.meta || {});
  for (const [k, v] of Object.entries(want || {})) {
    if (v === undefined || v === null) continue;
    if (String(bm[k] ?? '') !== String(v)) {
      throw new ToolkitError(EXIT.ERROR, `Saved but not verified: ${id} ${k} reads "${bm[k] ?? ''}" instead of "${v}".`, { id, field: k });
    }
  }
  return back;
}

// ------------------------------------------------------------------ new

/**
 * Create an item from the template.
 * @returns {Promise<{ id: string, record: object }>}
 */
/** Read a --covers value ("R-02", "R-02,R-03", or R2) into requirement ids such as R-02. */
function coversArg(value) {
  const raw = [].concat(value).flatMap((v) => String(v).split(',')).map((v) => v.trim()).filter(Boolean);
  const ids = [];
  for (const r of raw) {
    const m = /^R-?0*(\d+)$/i.exec(r);
    if (!m) throw invalid(`"${r}" is not a requirement id such as R-02.`);
    const id = `R-${String(Number(m[1])).padStart(2, '0')}`;
    if (!ids.includes(id)) ids.push(id);
  }
  if (!ids.length) throw invalid('--covers needs the parent\'s requirement ids, for example --covers R-02,R-03.');
  return ids;
}

/**
 * Create an item from the template.
 * `covers` (with `parent`): the parent's approved requirement ids this sub-item
 * delivers. The sub-item links them and copies none of their text, and it
 * inherits the parent's requirements approval, so the owner is not asked to
 * approve the same requirements twice. It starts at 03-requirements-approved
 * (or a later stage given with `stage`).
 * @returns {Promise<{ id: string, record: object }>}
 */
export async function opNew(tracker, project, { title, type, parent, stage, priority, request, group, covers, today } = {}) {
  if (!title || !String(title).trim() || isPlaceholder(title)) throw invalid('--title is required.', { fix: 'toolkit work new --title "<title>"' });
  const t = type ? typeArg(type) : 'task';
  const coverIds = covers !== undefined && covers !== null ? coversArg(covers) : null;
  if (coverIds && (!parent || String(parent).trim().toLowerCase() === 'none')) throw invalid('--covers needs --parent <id>: the item whose approved requirements this sub-item delivers.');
  let s = stage ? stageArg(stage) : '01-discovery';
  const p = priority ? normalizePriority(priority) : 'medium';
  if (!p) throw invalid(`"${priority}" is not a priority. Priorities: ${PRIORITIES.join(', ')}.`);
  let parentId = 'none';
  let par = null;
  if (parent && String(parent).trim().toLowerCase() !== 'none') {
    par = await mustGet(tracker, parent);
    parentId = par.id;
  }
  let inherited = null;
  // A parent design the owner approved covers a child that delivers the
  // parent's approved requirements: the child goes on to planning, not to a
  // design of its own (work-organize step 6; sample runs a and d, round 2).
  let parentDesign = null;
  if (coverIds) {
    if (!isApproved(par.meta.requirements_approved)) {
      throw invalid(`${par.id} has no recorded requirements approval, so a sub-item cannot inherit one. Nothing was created.`, {
        fix: `Create the sub-item without --covers; its requirements go through work-requirements. Or record ${par.id}'s approval first.`,
      });
    }
    const known = new Set(parseRequirements(par.body).filter((r) => !r.placeholder).map((r) => r.id));
    const unknown = coverIds.filter((r) => !known.has(r));
    if (unknown.length) {
      throw invalid(`${par.id} has no requirement ${unknown.join(', ')}. Its requirements: ${[...known].join(', ') || 'none'}. Nothing was created.`);
    }
    inherited = par.meta.requirements_approved;
    if (par.meta.design === 'approved') parentDesign = par.id;
    if (!stage || (stageNumber(s) ?? 0) < 3) s = parentDesign ? '06-implementation-plan' : '03-requirements-approved';
  } else {
    if (stageNumber(s) === 3) throw invalid('A new item cannot start at 03-requirements-approved: record the approval with toolkit work approve <id> --requirements --by <name>.');
    const gate = requirementsGate('A new item', t, s, { requirements_approved: 'no' });
    if (gate) throw gate;
  }
  const date = todayOf({ today });
  const coverText = coverIds ? coverIds.map((r) => `${parentId} ${r}`).join(', ') : '';
  // A sub-item is part of its parent's goal: the delivery the owner chose for
  // the parent covers it (sample run b, round 3: a sub-item built agent-led
  // kept delivery: not-offered).
  const inheritedDelivery = par && ['agent-led', 'owner-led'].includes(par.meta.delivery) ? par.meta.delivery : null;
  const fields = {
    id: `${tracker.prefix || 'WI'}-000`,
    title: String(title).trim(),
    type: t,
    stage: s,
    status: statusForStage(s),
    parent: parentId,
    waiting_on: 'none',
    priority: p,
    delivery: inheritedDelivery || 'not-offered',
    requirements_approved: inherited || 'no',
    design: 'none',
    result_approved: 'no',
    updated: date,
    request,
    historyChange: coverIds ? `Created as a sub-item of ${parentId}. It delivers ${coverText}.` : 'Created.',
    historyEffect: coverIds
      ? `Requirements approval inherited from ${parentId} (${inherited}); the owner is not asked again.${parentDesign ? ` ${parentDesign}'s approved design covers it, so it needs no design of its own.` : ''} Starts at ${stageShort(s)}. Continue with ${continueWith({ stage: s, status: statusForStage(s) })}.`
      : `Starts at ${stageShort(s)}. Continue with ${continueWith({ stage: s, status: statusForStage(s) })}.`,
  };
  let text = newRecordText(templateText(tracker, project, RECORD_FILE), fields);
  let doc = parseDoc(text);
  let body = doc.body;
  // The item-level guide speaks about local folders; a Notion card never needs it.
  // A sub-item made with --covers starts filled in (stage 03 or later), and the
  // guide says to delete it once the item is filled.
  if ((tracker.type && tracker.type !== 'local') || coverIds) body = removeItemGuide(body);
  if (coverIds) {
    const line = `Covers ${coverText}. The requirement text and its approval (${inherited}) stay in ${parentId}; this item copies none of it.`;
    if (getSectionText(body, 'Agreed goal') !== null) body = setSectionText(body, 'Agreed goal', line);
    if (getSectionText(body, 'Active requirements') !== null) body = setSectionText(body, 'Active requirements', `- ${line}`);
    const designNote = parentDesign ? ` Design: ${parentDesign}'s approved design.` : '';
    if (hasLabel(body, 'Related items', { section: 'Overview' })) body = setLabel(body, 'Related items', `Parent ${parentId} (${coverIds.join(', ')}).${designNote}`, { section: 'Overview' });
  } else if (parentId !== 'none') {
    // The parent is named in the text too, not only in the parent field (sample run c, round 3).
    body = linkRelatedItem(body, 'parent', parentId);
  }
  const id = await tracker.create({ meta: doc.meta, body }, { group });
  if (parentId !== 'none') {
    await change(tracker, async () => {
      const cur = await mustGet(tracker, parentId);
      let pbody = linkRelatedItem(cur.body, 'sub-item', id);
      pbody = addRoadmapSubItem(pbody, id);
      pbody = addHistory(pbody, { date, change: `Sub-item ${id} created: ${fields.title}.`, effect: coverIds ? `${id} delivers ${coverIds.join(', ')}. Those requirements stay here, unchanged and approved.` : `${id} is part of this item.` });
      return save(tracker, cur, { meta: { updated: date }, body: pbody });
    });
  }
  const record = await mustGet(tracker, id);
  verify(record, { title: fields.title, stage: s, type: t }, id);
  return { id, record, covers: coverIds || [], inherited, parentDesign, inheritedDelivery };
}

// ------------------------------------------------------------------ set

/**
 * Change stage, waiting_on, priority, type, delivery, or title.
 * A stage change also sets the status the stage gives. Gates are enforced.
 */
export async function opSet(tracker, id, opts = {}, { today, dryRun = false, ownerName = null } = {}) {
  const { stage, waitingOn, priority, type, delivery, title, reopen, note } = opts;
  if ([stage, waitingOn, priority, type, delivery, title].every((v) => v === undefined || v === null)) {
    throw invalid('Nothing to set. Give at least one of --stage, --waiting-on, --priority, --type, --delivery, --title.');
  }
  if (reopen && !stage) throw invalid('--reopen needs --stage: the stage the item goes back to.');
  const date = todayOf({ today });
  const res = await setCore(tracker, id, opts, { date, dryRun, ownerName });
  if (dryRun || !res.changed) return res;
  res.notes = [];
  // A new title goes into the design's heading and, for a folder the toolkit
  // named, into the folder name (sample run a, round 3: both kept the old title).
  if (res.oldTitle !== undefined) {
    res.notes.push(...(await retitleDesign(tracker, res.id, res.record.meta.title)));
    if (typeof tracker.renameFolderForTitle === 'function') {
      try {
        const r = await tracker.renameFolderForTitle(res.id, res.oldTitle);
        if (r && r.renamed) {
          res.folder = r;
          res.notes.push(`Renamed its folder to match the new title: ${r.to} (was ${r.from}).`);
          await noteOnce(tracker, res.id, { date, change: `Folder renamed for the new title: ${r.from} -> ${r.to}.`, effect: 'Same item; the toolkit uses the new path.' }).catch(() => null);
        } else if (r && r.reason) {
          res.notes.push(r.reason);
        }
      } catch (err) {
        res.notes.push(`Its folder keeps the old name: ${err.message}`);
      }
    }
  }
  // The delivery chosen for a goal covers the sub-items that were not asked about.
  if (res.deliveryChanged && ['agent-led', 'owner-led'].includes(res.record.meta.delivery)) {
    const done = await propagateDelivery(tracker, res.id, res.record.meta.delivery, date);
    if (done.length) res.notes.push(`Delivery ${res.record.meta.delivery} also recorded on its sub-item${done.length === 1 ? '' : 's'} ${done.join(', ')}.`);
  }
  return res;
}

/** Put a new title into the design's heading (and the Notion design page's title). Returns report lines. */
async function retitleDesign(tracker, id, newTitle) {
  try {
    if (typeof tracker.retitleDesign === 'function') {
      return (await tracker.retitleDesign(id)) ? ['The design page title now has the new title.'] : [];
    }
    const design = await tracker.getDesign(id);
    if (!design) return [];
    const h1 = getH1(design.body);
    if (h1 && h1.title === newTitle) return [];
    const body = setH1(design.body, id, newTitle, { suffix: DESIGN_SUFFIX });
    await tracker.setDesign(id, composeDoc(design.meta, body, DESIGN_FIELD_ORDER), { create: false });
    return ['The design heading now has the new title.'];
  } catch (err) {
    return [`The design heading still has the old title (${err.message}).`];
  }
}

/** Set delivery on every open sub-item (at any depth) that still says not-offered. Returns their ids. */
async function propagateDelivery(tracker, parentId, value, date) {
  const out = [];
  const queue = [parentId];
  const seen = new Set();
  let items = null;
  while (queue.length) {
    const pid = queue.shift();
    if (seen.has(pid)) continue;
    seen.add(pid);
    let kids;
    const rec = await tracker.get(pid);
    if (rec && Array.isArray(rec.children)) kids = rec.children;
    else {
      items = items || await listItems(tracker);
      kids = items.filter((k) => normalizeParent(k.meta.parent) === pid).map((k) => k.id);
    }
    for (const kid of kids) {
      if (!parseId(kid)) continue;
      queue.push(kid);
      try {
        await change(tracker, async () => {
          const cur = await mustGet(tracker, kid);
          if (isTerminal(cur.meta.status) || cur.meta.delivery !== 'not-offered') return null;
          const body = addHistory(cur.body, { date, change: `Delivery ${value} (recorded on ${parentId}).`, effect: `${parentId}'s delivery covers this sub-item.` });
          const back = await save(tracker, cur, { meta: { delivery: value, updated: date }, body });
          out.push(kid);
          return back;
        });
      } catch {
        // A sub-item that cannot be changed keeps its value; the parent's is recorded.
      }
    }
  }
  return out;
}

async function setCore(tracker, id, opts, { date, dryRun, ownerName = null }) {
  const { stage, waitingOn, priority, type, delivery, title, reopen, note } = opts;
  return change(tracker, async () => {
    const rec = await mustGet(tracker, id);
    const meta = rec.meta;
    const patch = {};
    const changes = [];
    let body = rec.body;
    const newType = type !== undefined && type !== null ? typeArg(type) : meta.type;
    if (type !== undefined && type !== null && newType !== meta.type) {
      patch.type = newType;
      changes.push(`type ${meta.type || 'none'} -> ${newType}`);
    }
    let newStage = meta.stage;
    if (stage !== undefined && stage !== null) {
      newStage = stageArg(stage);
      if (isTerminal(meta.status) && !reopen) {
        throw invalid(`${rec.id} is ${meta.status}. To move it back to a stage, add --reopen.`, { fix: `toolkit work set ${rec.id} --stage ${newStage} --reopen` });
      }
      if (stageNumber(newStage) === 3 && !isApproved(meta.requirements_approved)) {
        throw invalid(`Stage 03-requirements-approved means the owner approved the requirements. Record that with: toolkit work approve ${rec.id} --requirements --by <name>`, { gate: 'requirements_not_approved' });
      }
      if (newStage !== meta.stage || (reopen && isTerminal(meta.status))) {
        patch.stage = newStage;
        patch.status = statusForStage(newStage);
        changes.push(`stage ${meta.stage ? stageShort(meta.stage) : 'none'} -> ${stageShort(newStage)} (status ${patch.status})`);
        if (reopen && isTerminal(meta.status)) changes.push(`reopened from ${meta.status}`);
      }
    }
    const gate = requirementsGate(rec.id, newType, newStage, meta);
    if (gate && (patch.stage || patch.type)) throw gate;
    if (waitingOn !== undefined && waitingOn !== null) {
      const w = normalizeWaitingOn(waitingOn);
      if (!w) throw invalid(`"${waitingOn}" is not a waiting_on value. Use owner, agent, none, or "external: <who>".`);
      if (w !== meta.waiting_on) {
        patch.waiting_on = w;
        changes.push(`waiting on ${w}`);
      }
    }
    if (priority !== undefined && priority !== null) {
      const p = normalizePriority(priority);
      if (!p) throw invalid(`"${priority}" is not a priority. Priorities: ${PRIORITIES.join(', ')}.`);
      if (p !== meta.priority) {
        patch.priority = p;
        changes.push(`priority ${p}`);
      }
    }
    if (delivery !== undefined && delivery !== null) {
      const d = normalizeDelivery(delivery);
      if (!d) throw invalid(`"${delivery}" is not a delivery value. Use ${DELIVERY.join(', ')}.`);
      if (d !== meta.delivery) {
        patch.delivery = d;
        changes.push(`delivery ${d}`);
      }
    }
    if (title !== undefined && title !== null) {
      const tt = String(title).trim();
      if (!tt || isPlaceholder(tt)) throw invalid('--title needs a real title.');
      if (tt !== meta.title) {
        patch.title = tt;
        body = setH1(body, rec.id, tt);
        // The old title stays readable in the history row (verifier, fix round 2).
        changes.push(`title "${tt}" (was "${meta.title || ''}")`);
      }
    }
    if (!changes.length) return { id: rec.id, changed: false, changes, record: rec, warnings: [] };
    const warnings = patch.stage ? skipWarnings(rec, meta.stage, patch.stage, { note }) : [];
    // dryRun: every check above ran and passed; nothing is written.
    if (dryRun) return { id: rec.id, changed: true, changes, record: rec, dryRun: true, warnings };
    patch.updated = date;
    // Recording the delivery answers the open question that offered it
    // (verifier, fix round 2: the offer stayed listed as waiting on the owner
    // after `set --delivery agent-led`). An item that waited on the owner
    // only for it no longer waits, unless --waiting-on says otherwise.
    let closed = [];
    let clearedWaiting = false;
    let stillWaiting = [];
    if (patch.delivery && ['agent-led', 'owner-led'].includes(patch.delivery)) {
      closed = answeredQuestions(body, isDeliveryQuestion, ownerName);
      if (closed.length) {
        body = setQuestionStatus(body, closed, 'Answered');
        if (patch.waiting_on === undefined && (waitingOn === undefined || waitingOn === null)) {
          ({ clear: clearedWaiting, still: stillWaiting } = ownerWaitAfter(rec, closed, ownerName));
          if (clearedWaiting) patch.waiting_on = 'none';
        }
      }
    }
    // The template's item-level guide says to delete it once the item is
    // filled; from stage 03 on it is (validate warns about one left there).
    if (patch.stage && (stageNumber(patch.stage) ?? 0) >= 3) body = removeItemGuide(body);
    // A waiting_on change alone lives in the header only: it gets no history
    // row, and it is never joined to a row another command wrote (sample runs
    // b and d, round 3: "Design updated ... Now waiting on the owner." while
    // the wait came from a different question). With --note it gets its own row.
    const onlyWaiting = Object.keys(patch).every((k) => k === 'waiting_on' || k === 'updated') && patch.waiting_on !== undefined;
    if (!onlyWaiting || note) {
      body = addHistory(body, {
        date,
        change: `Set ${changes.join('; ')}.${closed.length ? ` ${closed.join(', ')} answered.` : ''}${clearedWaiting ? ' No longer waiting on the owner.' : ''}`,
        effect: note ? String(note).trim() : setEffect(meta, patch, body),
      });
    }
    const back = verify(await save(tracker, rec, { meta: patch, body }), patch, rec.id);
    return {
      id: rec.id, changed: true, changes, record: back, warnings, closedQuestions: closed, clearedWaiting, stillWaiting,
      oldTitle: patch.title !== undefined ? meta.title : undefined,
      deliveryChanged: patch.delivery !== undefined,
    };
  });
}

/**
 * Warnings for a stage change that skips a step the lifecycle expects (sample
 * run c, round 2: an item went from 01 to 09 with its requirement still
 * Refining and no design). They never refuse the change: a skip can be right,
 * and then its reason belongs in a history note.
 */
function skipWarnings(rec, fromStage, toStage, { note } = {}) {
  const out = [];
  const from = stageNumber(fromStage) ?? 0;
  const to = stageNumber(toStage) ?? 0;
  if (to <= from) return out;
  const meta = rec.meta;
  if (from <= 3 && to > 3 && !isApproved(meta.requirements_approved)) {
    const reqs = parseRequirements(rec.body).filter((r) => !r.placeholder);
    const refining = reqs.filter((r) => /^refining$/i.test(String(r.status).trim())).map((r) => r.id);
    if (refining.length) {
      out.push(`${rec.id} moves past 03 while ${refining.join(', ')} ${refining.length === 1 ? 'is' : 'are'} still Refining, and no requirements approval is recorded. Show the owner the requirements for approval (work-requirements), unless he agreed to skip that; then say why in a history note.`);
    } else if (!reqs.length && from <= 2) {
      // Sample run c, round 3: "write a short project brief" went from 01 to
      // 07 as a task, with no requirement written and no question asked; the
      // --note was the agent's own reason. This warns for every type.
      out.push(`${rec.id} moves from ${stageShort(fromStage)} to ${stageShort(toStage)} with no requirement written (no R-01) and no requirements approval. When the owner named a result but not what it should say or do, that is a question for him: add it to Open Questions and ask before building (work-requirements).`);
    }
  }
  if (from < 5 && to >= 5 && (!meta.design || meta.design === 'none') && !(note && String(note).trim())) {
    const reasoned = parseHistory(rec.body).some((h) => /\bdesign\b/i.test(h.change));
    if (!reasoned) {
      out.push(`${rec.id} moves past 04 Solution design with no design and no history note that says why. If the design is skipped on purpose, tell the owner in the reply ("I'll build it this way; say 'design first' to stop me.") and record the reason: toolkit work history ${rec.id} --note "Design skipped: <reason>". Otherwise open solution-design.`);
    }
  }
  return out;
}

/** The "Effect on the work" cell for a `work set` row with no --note. */
function setEffect(meta, patch, body = '') {
  const after = { ...meta, ...patch };
  const w = normalizeWaitingOn(after.waiting_on);
  if (patch.waiting_on !== undefined && w === 'owner') {
    // Name the question the item waits on, so the row says which decision it is.
    const open = parseQuestions(body).filter((q) => isOpenOwnerQuestion(q) && q.id).map((q) => q.id);
    return `Waits for the owner's answer${open.length ? ` to ${open.join(', ')}` : ''} (work-decide) before the step it blocks.`;
  }
  if (patch.waiting_on !== undefined && w && w.startsWith('external')) return `Waits on ${w.slice('external:'.length).trim() || 'someone outside the project'}.`;
  return `Continue with ${continueWith(after)}.`;
}

// ------------------------------------------------------------------ approve

function requirementWarnings(rec) {
  const warnings = [];
  const goal = getSectionText(rec.body, 'Agreed goal');
  if (goal !== null && isPlaceholder(goal)) warnings.push('The Agreed goal still holds the template text.');
  const reqs = parseRequirements(rec.body).filter((r) => !r.placeholder);
  const refining = reqs.filter((r) => /^refining$/i.test(r.status));
  if (refining.length) warnings.push(`Requirements still marked Refining: ${refining.map((r) => r.id).join(', ')}.`);
  const openQ = new Set(parseQuestions(rec.body).filter((q) => !q.placeholder && /^open$/i.test(q.status)).map((q) => q.id));
  const linked = reqs.filter((r) => r.openQuestions.some((q) => openQ.has(q)));
  if (linked.length) warnings.push(`Requirements with open questions: ${linked.map((r) => `${r.id} (${r.openQuestions.filter((q) => openQ.has(q)).join(', ')})`).join('; ')}.`);
  return warnings;
}

/**
 * Record the owner's approval of the requirements, the design, or the result.
 * @param {{ what: 'requirements'|'design'|'result', by: string }} opts
 */
export async function opApprove(tracker, project, id, { what, by, today } = {}) {
  if (!['requirements', 'design', 'result'].includes(what)) throw invalid('Say what is approved: --requirements, --design, or --result.');
  if (!by || !String(by).trim()) throw invalid('--by <name> is required: the person who approved.');
  const who = String(by).trim();
  const date = todayOf({ today });
  const approval = formatApproval(date, who);
  const ownerName = ownerOf(project);

  if (what === 'design') return approveDesign(tracker, id, { who, date, approval, ownerName });

  return change(tracker, async () => {
    const rec = await mustGet(tracker, id);
    const patch = { updated: date };
    let body = rec.body;
    let warnings = [];
    let effect;
    // An open question that asked for this same approval is answered by it.
    const closed = answeredQuestions(body, what === 'requirements' ? isRequirementsQuestion : isResultQuestion, ownerName);
    // The owner just answered: an item waiting on the owner no longer waits,
    // unless another of his questions is still open.
    const { clear: clearedWaiting, still: stillWaiting } = ownerWaitAfter(rec, closed, ownerName);
    if (clearedWaiting) patch.waiting_on = 'none';
    const waitNote = `${waitEffect(clearedWaiting, stillWaiting)}${closed.length ? ` ${closed.join(', ')} answered by this approval.` : ''}`;
    if (what === 'requirements') {
      // The owner approves a goal and requirements he was shown, so the goal
      // is written before the approval is recorded (sample run b, round 2:
      // "Approved." was lost because the Agreed goal was still blank).
      const goal = getSectionText(body, 'Agreed goal');
      if (goal !== null && isPlaceholder(goal)) {
        throw invalid(`${rec.id}'s Agreed goal still holds the template text, so the requirements approval was not recorded. Nothing was changed.`, {
          gate: 'goal_not_written',
          fix: `Keep the owner's words first: toolkit work history ${rec.id} --note "Owner's words: <quote>". Write the goal he was shown with the requirements: toolkit work edit ${rec.id} --section "Agreed goal" --text "<goal>". Then run this command again; do not ask him again for the same approval.`,
        });
      }
      warnings = requirementWarnings(rec);
      patch.requirements_approved = approval;
      if (hasLabel(body, 'Overall status', { section: 'Requirements' })) body = setLabel(body, 'Overall status', 'Finalized', { section: 'Requirements' });
      // The template's item-level guide says to delete it once the item is filled.
      body = removeItemGuide(body);
      const n = stageNumber(rec.meta.stage);
      if (!isTerminal(rec.meta.status) && (n === null || n < 3)) {
        patch.stage = '03-requirements-approved';
        patch.status = statusForStage(patch.stage);
        effect = `Stage 03 Requirements approved (status Ready).${waitNote} Continue with ${continueWith({ ...rec.meta, ...patch })}.`;
      } else {
        effect = `Stage stays ${stageShort(rec.meta.stage)}.${waitNote}`;
      }
      body = addHistory(body, { date, change: `Requirements approved by ${who}.`, effect });
    } else {
      patch.result_approved = approval;
      const n = stageNumber(rec.meta.stage);
      if (n !== null && n < 9) warnings.push(`${rec.id} is at ${stageShort(rec.meta.stage)}; a result is usually approved at 11 User approval.`);
      effect = `The result can be shipped and finished (work-finish).${waitNote}`;
      body = addHistory(body, { date, change: `Result approved by ${who}.`, effect });
    }
    if (closed.length) body = setQuestionStatus(body, closed, 'Answered');
    const back = verify(await save(tracker, rec, { meta: patch, body }), patch, rec.id);
    return { id: rec.id, what, approval, warnings, clearedWaiting, stillWaiting, closedQuestions: closed, record: back };
  });
}

function waitingOnOwner(meta) {
  return normalizeWaitingOn(meta && meta.waiting_on) === 'owner';
}

/** The ids of the open owner questions that `asks` says ask for this approval. */
function answeredQuestions(body, asks, ownerName = null) {
  return parseQuestions(body).filter((q) => isOpenOwnerQuestion(q, ownerName) && q.id && /^Q-\d+$/.test(q.id) && asks(q)).map((q) => q.id);
}

/** The project owner's name from the project config, or null. */
function ownerOf(project) {
  const o = project && project.config && project.config.project && project.config.project.owner;
  return o && String(o).trim() ? String(o).trim() : null;
}

/**
 * After the owner answered the questions in `closed`: clear waiting_on only
 * when the item waits on the owner and none of his other questions is still
 * open (verifier, fix round 2: "No longer waiting on the owner" while Q-02
 * stayed open). still: the ids of the owner questions that are still open.
 */
function ownerWaitAfter(rec, closed = [], ownerName = null) {
  if (!waitingOnOwner(rec.meta)) return { clear: false, still: [] };
  const still = parseQuestions(rec.body).filter((q) => isOpenOwnerQuestion(q, ownerName) && q.id && !closed.includes(q.id)).map((q) => q.id);
  return { clear: still.length === 0, still };
}

/** The sentence a history row's effect gets about the owner wait. */
function waitEffect(cleared, still = []) {
  if (cleared) return ' No longer waiting on the owner.';
  return still.length ? ` Still waiting on the owner for ${still.join(', ')}.` : '';
}

/** Write a design text back as it was (after a failed approval). True when it was written. */
async function restoreDesign(tracker, id, text) {
  try {
    await tracker.setDesign(id, text, { create: false });
    return true;
  } catch {
    return false;
  }
}

/**
 * Record the owner's design approval, all or nothing (sample run c, round 3:
 * the Notion "Design approved" property was written, then the check failed
 * because Notion had joined the header lines, and the approval was left half
 * written). In order:
 *   1. The design text is prepared: each header label on its own line, a
 *      "**Design status:**" line set to Approved (added when missing). It is
 *      checked before anything is written.
 *   2. The design is written and read back: status approved and the approval
 *      value. A design that does not read back approved is written back as it
 *      was, and nothing is approved.
 *   3. The item gets design: approved, a history row, and the open questions
 *      that asked for this choice are marked Answered. When this fails, the
 *      item is read again (recoverItemApproval): an item that reads approved
 *      keeps the approval; otherwise what reached the item is taken out and
 *      the design is written back as it was.
 */
async function approveDesign(tracker, id, { who, date, approval, ownerName = null }) {
  const rec = await mustGet(tracker, id);
  const design = await tracker.getDesign(rec.id);
  if (!design) throw new ToolkitError(EXIT.ERROR, `${rec.id} has no design to approve.`, { fix: `Create one with: toolkit work design ${rec.id} --create` });
  const original = design.text || composeDoc(design.meta, design.body, DESIGN_FIELD_ORDER);
  const body = ensureDesignStatusLine(separateLabelLines(design.body, { design: true }), 'approved');
  const text = designText({ ...design, body }, { status: 'approved', approved: approval });
  if (designStatusFromBody(parseDoc(text).body) !== 'approved') {
    throw new ToolkitError(EXIT.ERROR, `The design of ${rec.id} has a design status line the toolkit cannot set to Approved, so nothing was approved and nothing was changed.`, {
      id: rec.id,
      fix: `Put "**Design status:** Draft" on a line of its own under the design's heading (toolkit work design ${rec.id} --set-file <file>), then run this command again.`,
    });
  }
  const fail = async (reason, cause) => {
    const restored = await restoreDesign(tracker, rec.id, original);
    return new ToolkitError(EXIT.ERROR, `The design approval of ${rec.id} was not recorded: ${reason} ${restored ? 'The design was written back as it was.' : 'Writing the design back as it was failed too; check it with toolkit work design ' + rec.id + '.'} Nothing was approved.`, {
      id: rec.id,
      restored,
      cause: cause && cause.message ? cause.message : undefined,
      fix: `Run toolkit work approve ${rec.id} --design --by ${who} again. If it fails the same way, show the owner the error; do not write the approval into the design text by hand.`,
    });
  };
  let saved;
  try {
    saved = await tracker.setDesign(rec.id, text, { create: false });
  } catch (err) {
    throw await fail(`saving the design failed (${String(err && err.message ? err.message : err).replace(/\.$/, '')}).`, err);
  }
  const m = (saved && saved.meta) || {};
  if (m.status !== 'approved' || String(m.approved ?? '') !== approval) {
    throw await fail(`the design reads back as ${m.status || 'nothing'} with approval "${m.approved ?? ''}", not approved with "${approval}".`);
  }
  let clearedWaiting = false;
  let stillWaiting = [];
  let closed = [];
  // The item as read and the text written to it, on the last try: what a
  // failed step 3 has to undo.
  let attempt = null;
  const historyChange = `Design approved by ${who}.`;
  let back;
  try {
    back = await change(tracker, async () => {
      attempt = null;
      const cur = await mustGet(tracker, rec.id);
      const meta = { design: 'approved', updated: date };
      closed = answeredQuestions(cur.body, isDesignQuestion, ownerName);
      ({ clear: clearedWaiting, still: stillWaiting } = ownerWaitAfter(cur, closed, ownerName));
      if (clearedWaiting) meta.waiting_on = 'none';
      let ibody = closed.length ? setQuestionStatus(cur.body, closed, 'Answered') : cur.body;
      ibody = addHistory(ibody, {
        date,
        change: historyChange,
        effect: `The design can be built.${waitEffect(clearedWaiting, stillWaiting)}${closed.length ? ` ${closed.join(', ')} answered by this approval.` : ''}`,
      });
      attempt = { cur, body: ibody };
      return verify(await save(tracker, cur, { meta, body: ibody }), { design: 'approved' }, cur.id);
    });
  } catch (err) {
    return recoverItemApproval(tracker, rec, {
      err, attempt, fail, restore: () => restoreDesign(tracker, rec.id, original), date, who, approval, historyChange, closed, clearedWaiting, stillWaiting,
    });
  }
  return { id: rec.id, what: 'design', approval, warnings: [], clearedWaiting, stillWaiting, closedQuestions: closed, record: back };
}

const errText = (err) => String(err && err.message ? err.message : err).replace(/\.$/, '');

/**
 * Step 3 of approveDesign failed: the design reads approved, but writing the
 * item threw. A Notion update writes the page text before the properties, so
 * the item can hold the history row and the Answered questions without
 * design: approved (verifier, fix round 2). The item is read again:
 *   - When it says design: approved, the item was saved and only its check
 *     failed: the approval stands, and a warning says so.
 *   - Otherwise what reached its text is taken out again (the history row and
 *     the Answered statuses), its design and waiting_on values are written
 *     back, and it is read back. Then the design is written back as it was.
 *     The error says exactly what, if anything, is left.
 */
async function recoverItemApproval(tracker, rec, { err, attempt, fail, restore, date, who, approval, historyChange, closed, clearedWaiting, stillWaiting }) {
  const reason = errText(err);
  // Nothing was written to the item: it failed before its save.
  if (!attempt) throw await fail(`the design was saved, but ${rec.id} itself could not be updated (${reason}).`, err);
  const before = attempt.cur;
  let now;
  try {
    now = await mustGet(tracker, rec.id);
  } catch (err2) {
    throw new ToolkitError(EXIT.ERROR, `The design approval of ${rec.id} may be half written: saving ${rec.id} failed (${reason}), and reading it again failed too (${errText(err2)}). The design reads Approved and was left that way, because ${rec.id} may already say design: approved.`, {
      id: rec.id, cause: reason,
      fix: `Run toolkit work show ${rec.id}. If it says design: approved, the approval is recorded. If not, run toolkit work approve ${rec.id} --design --by ${who} again. Do not write the approval into the design text by hand.`,
    });
  }
  if (normalizeMeta(now.meta).design === 'approved') {
    return {
      id: rec.id, what: 'design', approval, clearedWaiting, stillWaiting, closedQuestions: closed, record: now,
      warnings: [`${rec.id} was saved, but its first check failed (${reason}). Reading it again shows design: approved, so the approval is recorded.`],
    };
  }
  // Take out of the item's text only what this approval put there.
  let body = removeHistoryRow(now.body, { date, change: historyChange });
  const found = [];
  if (body !== now.body) found.push(`the Recent History row "${historyChange}"`);
  const prevStatus = new Map(parseQuestions(before.body).map((q) => [q.id, q.status]));
  const reopened = parseQuestions(body).filter((q) => closed.includes(q.id) && /^answered$/i.test(String(q.status).trim()) && !/^answered$/i.test(String(prevStatus.get(q.id) || '').trim())).map((q) => q.id);
  for (const qid of reopened) body = setQuestionStatus(body, [qid], prevStatus.get(qid) || 'Open');
  if (reopened.length) found.push(`${reopened.join(', ')} marked Answered`);
  const metaBack = { design: before.meta.design || 'none', waiting_on: before.meta.waiting_on || 'none' };
  const nowMeta = normalizeMeta(now.meta);
  const metaDiffers = Object.entries(metaBack).some(([k, v]) => String(nowMeta[k] ?? '') !== String(v));
  let left = [];
  if (body !== now.body || metaDiffers) {
    let writeErr = null;
    try {
      await tracker.update(rec.id, { meta: metaBack, ...(body !== now.body ? { body, expectBody: now.body } : {}) });
    } catch (err3) {
      writeErr = err3;
    }
    // What is left is read back, not assumed: a Notion update that failed on
    // its properties has already written its text.
    try {
      const check = await mustGet(tracker, rec.id);
      if (parseHistory(check.body).some((h) => h.date === date && h.change === historyChange)) left.push(`the Recent History row "${historyChange}"`);
      const answered = parseQuestions(check.body).filter((q) => reopened.includes(q.id) && /^answered$/i.test(String(q.status).trim())).map((q) => q.id);
      if (answered.length) left.push(`${answered.join(', ')} marked Answered`);
      const cm = normalizeMeta(check.meta);
      for (const [k, v] of Object.entries(metaBack)) {
        if (String(cm[k] ?? '') !== String(v)) left.push(`${k} "${cm[k] ?? ''}" (it was "${v}")`);
      }
    } catch (err4) {
      left = found.length ? [...found] : [];
      if (metaDiffers || !left.length) left.push(`values that could not be checked (${errText(writeErr || err4)})`);
    }
  }
  const restored = await restore();
  const designLine = restored ? 'The design was written back as it was.' : `Writing the design back as it was failed too; check it with toolkit work design ${rec.id}.`;
  if (left.length) {
    throw new ToolkitError(EXIT.ERROR, `The design approval of ${rec.id} was not recorded: the design was saved, but ${rec.id} itself could not be updated (${reason}). ${designLine} ${rec.id} still has ${left.join(' and ')}, which could not be taken out. Nothing was approved.`, {
      id: rec.id, restored, left, cause: reason,
      fix: `Take out ${left.join(' and ')} with toolkit work edit ${rec.id}, then run toolkit work approve ${rec.id} --design --by ${who} again.`,
    });
  }
  throw new ToolkitError(EXIT.ERROR, `The design approval of ${rec.id} was not recorded: the design was saved, but ${rec.id} itself could not be updated (${reason}). ${designLine} ${found.length ? `${found.join(' and ')} ${found.length === 1 ? 'was' : 'were'} taken out of ${rec.id} again. ` : ''}Nothing was approved.`, {
    id: rec.id, restored, cause: reason,
    fix: `Run toolkit work approve ${rec.id} --design --by ${who} again. If it fails the same way, show the owner the error; do not write the approval into the design text by hand.`,
  });
}

// ------------------------------------------------------------------ design

/** Full DESIGN.md text for a design record with some frontmatter values replaced. */
export function designText(design, { status, approved, body } = {}) {
  const meta = { ...(design.meta || {}) };
  if (status !== undefined) meta.status = status;
  if (approved !== undefined) meta.approved = approved;
  const b = setDesignStatusLine(body !== undefined ? body : design.body || '', meta.status, { approved: meta.approved });
  return composeDoc(meta, b, DESIGN_FIELD_ORDER);
}

/**
 * Read, create, replace, or change the status of an item's design.
 * @param {{ create?: boolean, text?: string, status?: string, by?: string }} opts
 */
export async function opDesign(tracker, project, id, { create, text, status, by, today } = {}) {
  const date = todayOf({ today });
  const rec = await mustGet(tracker, id);
  let design = await tracker.getDesign(rec.id);
  if (status !== undefined && status !== null && !DESIGN_STATUSES.includes(status)) {
    throw invalid(`"${status}" is not a design status. Use ${DESIGN_STATUSES.join(', ')}.`);
  }
  if (status === 'approved') {
    if (!by) throw invalid('Approving a design needs the approver: toolkit work approve <id> --design --by <name>.', { fix: `toolkit work approve ${rec.id} --design --by <name>` });
    // Every design approval goes through the one all-or-nothing path
    // (approveDesign). New text is saved first, as a proposed design.
    let created = false;
    let warnings = [];
    if (!design || (text !== undefined && text !== null)) {
      const first = await opDesign(tracker, project, rec.id, { create, text, today });
      created = Boolean(first.created);
      warnings = first.warnings || [];
    }
    const who = String(by).trim();
    const res = await approveDesign(tracker, rec.id, { who, date, approval: formatApproval(date, who), ownerName: ownerOf(project) });
    const saved = await tracker.getDesign(rec.id);
    return { id: rec.id, design: saved, changed: true, created, warnings: [...warnings, ...(res.warnings || [])], closedQuestions: res.closedQuestions, record: res.record };
  }
  const noEdit = (text === undefined || text === null) && (status === undefined || status === null);
  if (create && design && noEdit) return { id: rec.id, design, changed: false, existed: true };
  const noChange = !create && noEdit;
  if (noChange) {
    if (!design) throw new ToolkitError(EXIT.ERROR, `${rec.id} has no design yet.`, { fix: `Create one with: toolkit work design ${rec.id} --create` });
    return { id: rec.id, design, changed: false };
  }
  if (!design && !create) {
    throw new ToolkitError(EXIT.ERROR, `${rec.id} has no design yet.`, { fix: `Create one with: toolkit work design ${rec.id} --create` });
  }
  const warnings = [];
  let history;
  let full;
  if (!design) {
    const base = text !== undefined && text !== null ? text : newDesignText(templateText(tracker, project, DESIGN_FILE), { id: rec.id, title: rec.meta.title, date });
    const doc = parseDoc(base);
    const st = status || 'proposed';
    const approvedValue = st === 'approved' ? formatApproval(date, by) : 'no';
    const body = ensureDesignStatusLine(separateLabelLines(fixDesignHeading(doc.body, rec), { design: true }), st);
    full = designText({ meta: { ...doc.meta, work_item: rec.id }, body }, { status: st, approved: approvedValue });
    history = { date, change: `Design created (${st}${st === 'approved' ? ` by ${String(by).trim()}` : ''}).`, effect: st === 'approved' ? 'The design can be built.' : 'The owner approves it before building starts.' };
  } else {
    let body = design.body;
    let meta = { ...design.meta };
    let changedApproved = false;
    if (text !== undefined && text !== null) {
      const doc = parseDoc(text);
      // Header labels written on consecutive lines stay on their own lines (sample run c, round 3).
      body = separateLabelLines(doc.body, { design: true });
      // Only `toolkit work approve --design` approves: a status in the text never does.
      if (doc.hasFrontmatter && DESIGN_STATUSES.includes(doc.meta.status) && doc.meta.status !== 'approved' && !status) meta.status = doc.meta.status;
      if (design.meta.status === 'approved' && !status) {
        changedApproved = true;
        warnings.push('The design was approved. A changed design may need the owner\'s approval again.');
      }
    }
    if (status) meta.status = status;
    if (status === 'approved') meta.approved = formatApproval(date, by);
    else if (meta.status === 'proposed') meta.approved = 'no';
    body = ensureDesignStatusLine(body, meta.status);
    full = designText({ meta, body }, {});
    const effect = changedApproved
      ? 'The text of the approved design changed. Tell the owner what changed; ask him to approve it again when the change is more than a correction.'
      : meta.status === 'approved' ? 'The design can be built.' : meta.status === 'superseded' ? 'This design is no longer used.' : 'The owner approves it before building starts.';
    history = { date, change: text !== undefined && text !== null ? `Design ${changedApproved ? 'text changed after approval' : 'updated'}${status ? ` (status ${status})` : ''}.` : `Design status set to ${status}${status === 'approved' ? ` by ${String(by).trim()}` : ''}.`, effect };
  }
  const saved = await tracker.setDesign(rec.id, full, { create: !design });
  if (!saved || !saved.meta) throw new ToolkitError(EXIT.ERROR, `Saved but not verified: the design of ${rec.id} could not be read back.`, { id: rec.id });
  const newStatus = saved.meta.status;
  const back = await change(tracker, async () => {
    const cur = await mustGet(tracker, rec.id);
    const body = addHistory(cur.body, history);
    return verify(await save(tracker, cur, { meta: { design: newStatus, updated: date }, body }), { design: newStatus }, cur.id);
  });
  return { id: rec.id, design: saved, changed: true, created: !design, warnings, record: back };
}

function fixDesignHeading(body, rec) {
  const h1 = getH1(body);
  if (!h1) return body;
  const title = isPlaceholder(h1.title) ? rec.meta.title : h1.title;
  return setH1(body, rec.id, title, { suffix: DESIGN_SUFFIX });
}

// ------------------------------------------------------------------ history and edit

export async function opHistory(tracker, id, { note, effect, today } = {}) {
  if (!note || !String(note).trim()) throw invalid('--note <text> is required.');
  const date = todayOf({ today });
  return change(tracker, async () => {
    const rec = await mustGet(tracker, id);
    let body;
    // With no --effect, the row says where the item goes next, so the "Effect
    // on the work" column is never empty (sample runs a and b, round 2).
    // A note that quotes the owner's answer ends the wait on him: its effect
    // names the step after the answer, not work-decide (sample run b, round 3:
    // "Owner's words: All four passed ... | Continue with work-decide.").
    const answered = /^owner'?s? words:/i.test(String(note).trim()) && normalizeWaitingOn(rec.meta.waiting_on) === 'owner';
    const eff = effect && String(effect).trim() ? String(effect).trim()
      : isTerminal(rec.meta.status) ? `No further work: the item is ${rec.meta.status}.`
        : `Continue with ${continueWith(answered ? { ...rec.meta, waiting_on: 'agent' } : rec.meta)}.`;
    try {
      body = appendHistory(rec.body, { date, change: String(note).trim(), effect: eff });
    } catch (err) {
      throw new ToolkitError(EXIT.ERROR, `${rec.id} has no Recent History table to add to.`, { id: rec.id, fix: 'Restore the "## Recent History" table from the template.' });
    }
    const back = await save(tracker, rec, { meta: { updated: date }, body });
    return { id: rec.id, record: back };
  });
}

/**
 * Edit one part of the body.
 * @param {{ section?: string, text?: string, appendRow?: string, label?: string, value?: string }} opts
 *   section + text: replace the text under that heading ("Requirements > Agreed goal" for a sub-section)
 *   section + appendRow: add a table row ("Q-02 | Question | R-01 | Open | owner")
 *   label + value: replace a bold-label line in Overview (or in --section)
 */
export async function opEdit(tracker, id, { section, text, appendRow, label, value, removeGuide = false, today } = {}) {
  const modes = [text !== undefined && text !== null, appendRow !== undefined && appendRow !== null, label !== undefined && label !== null, Boolean(removeGuide)].filter(Boolean).length;
  if (modes !== 1) throw invalid('Give exactly one of --set-file <file>, --text <text>, --append-row <text>, --label <name> --value <text>, or --remove-guide.');
  if ((text !== undefined && text !== null) || (appendRow !== undefined && appendRow !== null)) {
    if (!section) throw invalid('--section <heading> is required.');
  }
  const date = todayOf({ today });
  return change(tracker, async () => {
    const rec = await mustGet(tracker, id);
    let body = rec.body;
    try {
      if (removeGuide) {
        // The template's item-level fill-in guide: the comment above Overview.
        body = removeItemGuide(body);
      } else if (label !== undefined && label !== null) {
        if (value === undefined || value === null) throw invalid('--value <text> is required with --label.');
        body = setLabel(body, label, value, { section: section || 'Overview' });
      } else if (appendRow !== undefined && appendRow !== null) {
        body = appendSectionRow(body, section, splitRowText(appendRow));
      } else {
        // Each template label ("**Work:**", "**Design status:**") keeps a line of its own (sample run c, round 3).
        const content = separateLabelLines(String(text).replace(/\s+$/, ''));
        if (/^#\s/m.test(content)) throw invalid('The new text contains a level-1 heading ("# ..."). Only the item\'s own title line may be level 1.');
        body = setSectionText(body, section, content);
      }
    } catch (err) {
      const known = err && (err.code === 'LABEL_NOT_FOUND' || err.code === 'SECTION_NOT_FOUND' || err.code === 'TABLE_NOT_FOUND' || /was not found|no table/i.test(err.message || ''));
      if (known) {
        throw new ToolkitError(EXIT.INVALID, `${rec.id}: ${err.message} Sections: ${sectionNames(rec.body).join(', ')}.`, { id: rec.id, sections: sectionNames(rec.body) });
      }
      throw err;
    }
    if (body === rec.body) return { id: rec.id, changed: false, record: rec, warnings: [] };
    const back = await save(tracker, rec, { meta: { updated: date }, body });
    // The PostToolUse hook checks only direct file edits, so the command says
    // what its own edit broke (sample run a, round 3: a Roadmap status
    // "Complete" was saved with no word until validate ran two sessions later).
    return { id: rec.id, changed: true, record: back, warnings: newProblems(tracker, rec, back) };
  });
}

/** Validation problems the saved record has that it did not have before the edit, as { level, message }. */
function newProblems(tracker, before, after) {
  const opts = { prefix: tracker.prefix, ownerName: tracker.ownerName };
  const check = (r) => {
    try {
      const v = validateRecord({ meta: normalizeMeta(r.meta || {}), body: r.body }, opts);
      return [...v.errors.map((e) => ({ level: 'error', ...e })), ...v.warnings.map((w) => ({ level: 'warning', ...w })), ...v.gates.map((g) => ({ level: 'question', code: g.code, message: g.message }))];
    } catch {
      return [];
    }
  };
  const had = new Set(check(before).map((p) => `${p.code}|${p.message}`));
  return check(after).filter((p) => !had.has(`${p.code}|${p.message}`)).map((p) => ({ level: p.level, code: p.code, message: p.message }));
}

// ------------------------------------------------------------------ finish and cancel

async function openSubItems(tracker, rec) {
  const kids = [];
  const ids = rec.children || [];
  for (const c of ids) {
    const k = await tracker.get(c);
    if (k && !isTerminal(normalizeMeta(k.meta || {}).status)) kids.push({ id: k.id || c, title: k.meta.title, status: k.meta.status });
  }
  if (!rec.children) {
    for (const k of await listItems(tracker)) {
      if (normalizeParent(k.meta.parent) === rec.id && !isTerminal(k.meta.status)) kids.push({ id: k.id, title: k.meta.title, status: k.meta.status });
    }
  }
  return kids;
}

/**
 * Mark an item Done: needs the owner's name and evidence. With no recorded
 * result approval, it also needs the owner's own words approving the result
 * (--quote), and records that approval.
 */
export async function opFinish(tracker, id, { by, evidence, quote, allowOpenSubItems = false, today } = {}) {
  if (!by || !String(by).trim()) throw invalid('--by <name> is required: the owner who approved the result.');
  if (!evidence || !String(evidence).trim()) throw invalid('--evidence <text> is required: what shows the result works.');
  const who = String(by).trim();
  const date = todayOf({ today });
  return change(tracker, async () => {
    const rec = await mustGet(tracker, id);
    if (rec.meta.status === 'Done') throw invalid(`${rec.id} is already Done.`);
    if (rec.meta.status === 'Cancelled') throw invalid(`${rec.id} is Cancelled. Reopen it first: toolkit work set ${rec.id} --stage <stage> --reopen.`);
    if (typeNeedsRequirements(rec.meta.type) && !isApproved(rec.meta.requirements_approved)) {
      throw invalid(`${rec.id} is a ${rec.meta.type} item with no recorded requirements approval, so it cannot be finished.`, {
        gate: 'requirements_not_approved',
        fix: `After the owner approves the requirements: toolkit work approve ${rec.id} --requirements --by <name>`,
      });
    }
    const open = await openSubItems(tracker, rec);
    if (open.length && !allowOpenSubItems) {
      throw invalid(`${rec.id} has open sub-items: ${open.map((k) => `${k.id} (${k.status})`).join(', ')}. Finishing a parent does not finish its sub-items.`, {
        openSubItems: open,
        fix: `Finish or cancel them first, or add --allow-open-sub-items when the owner says the parent is done anyway.`,
      });
    }
    const patch = { status: 'Done', waiting_on: 'none', updated: date };
    const hadApproval = isApproved(rec.meta.result_approved);
    const words = quote && String(quote).trim() ? String(quote).trim() : null;
    if (!hadApproval && !words) {
      throw invalid(`${rec.id} has no recorded result approval, so it cannot be marked Done without the owner's words. Nothing was changed.`, {
        gate: 'result_not_approved',
        fix: `Show the owner the result and ask. With his yes: toolkit work approve ${rec.id} --result --by ${who}, then finish; or finish with --quote "<his exact words>".`,
      });
    }
    if (!hadApproval) patch.result_approved = formatApproval(date, who);
    let body = withoutGuides(tracker, rec.body);
    body = closeOverview(body, {
      position: `Done on ${date}. ${oneLine(evidence)}`,
      next: 'None. Finished.',
    });
    body = setResumeHere(body, `Finished on ${date}. Nothing to resume.`);
    body = addHistory(body, {
      date,
      change: `Finished. ${hadApproval ? `Result approved earlier (${rec.meta.result_approved}); marked Done by ${who}.` : `Result approved by ${who}: "${words}"`}`,
      effect: `Evidence: ${String(evidence).trim()}${open.length ? ` Open sub-items left: ${open.map((k) => k.id).join(', ')}.` : ''}`,
    });
    const back = verify(await save(tracker, rec, { meta: patch, body }), { status: 'Done' }, rec.id);
    return { id: rec.id, record: back, openSubItems: open, resultApproval: back.meta.result_approved, warnings: finishWarnings(rec) };
  });
}

function oneLine(text) {
  const t = String(text ?? '').replace(/\s+/g, ' ').trim();
  return /[.!?]$/.test(t) ? t : `${t}.`;
}

/**
 * The Overview of a finished or cancelled item: Current position says so,
 * Next action says there is none, and Blockers is None. (sample run d,
 * round 3: Done items kept "Current position: Built on a deleted branch" and
 * "Blockers: Local merge to main needs Mike's approval").
 */
function closeOverview(body, { position, next }) {
  let out = body;
  const set = (label, value) => {
    if (hasLabel(out, label, { section: 'Overview' })) out = setLabel(out, label, value, { section: 'Overview' });
  };
  set('Current position', position);
  set('Next action', next);
  set('Blockers', 'None.');
  return out;
}

/**
 * The body without the template's guide comments: they are instructions for
 * filling the item, and a finished or cancelled item keeps none (sample run
 * b, round 3). Comments someone wrote are kept.
 */
function withoutGuides(tracker, body) {
  let out = removeItemGuide(body);
  try {
    out = removeTemplateComments(out, templateText(tracker, null, RECORD_FILE));
  } catch {
    // No template to compare with: the guides stay.
  }
  return out;
}

/** Notes > Resume here set to a closing line, when the section is there. */
function setResumeHere(body, line) {
  try {
    return getSectionText(body, 'Resume here') !== null ? setSectionText(body, 'Resume here', line) : body;
  } catch {
    return body;
  }
}

/**
 * What `work finish` reports after marking an item Done: stages 12 to 14 that
 * left no record, and Roadmap phases not set to Done (sample runs a and c,
 * round 2). Neither stops the finish: the owner approved the result.
 */
function finishWarnings(rec) {
  const out = [];
  const n = stageNumber(rec.meta.stage);
  if (n !== null && n < 12) {
    const said = parseHistory(rec.body).some((h) => /\b(no remote|merged locally|local merge|pull request|no repository change|nothing to deploy|skipp?ed)\b/i.test(`${h.change} ${h.effect}`));
    if (!said) {
      out.push(`${rec.id} finished from ${stageShort(rec.meta.stage)}, so stages 12 to 14 (pull request, deployment, requirements baseline) left no record. Say what happened instead in a history note, for example: toolkit work history ${rec.id} --note "No remote: merged locally into main; no deployment."`);
    }
  }
  const open = parseRoadmap(rec.body).filter((r) => !r.placeholder && !isPlaceholder(r.status) && !/^(done|cancelled)\.?$/i.test(String(r.status).trim()));
  if (open.length) {
    out.push(`The Roadmap still shows ${open.map((r) => `${r.id || r.phase} as ${r.status}`).join(', ')}. Set each finished phase to Done: toolkit work edit ${rec.id} --section Roadmap --set-file <file>.`);
  }
  return out;
}

/** Mark an item Cancelled with the owner's reason. */
export async function opCancel(tracker, id, { reason, by, today } = {}) {
  if (!reason || !String(reason).trim()) throw invalid('--reason <text> is required: the owner\'s reason, in his words.');
  const date = todayOf({ today });
  return change(tracker, async () => {
    const rec = await mustGet(tracker, id);
    if (rec.meta.status === 'Cancelled') throw invalid(`${rec.id} is already Cancelled.`);
    if (rec.meta.status === 'Done') throw invalid(`${rec.id} is Done. Reopen it first if it should be cancelled: toolkit work set ${rec.id} --stage <stage> --reopen.`);
    const open = await openSubItems(tracker, rec);
    // A cancelled item keeps no template guides either (verifier, fix round 2).
    let body = closeOverview(withoutGuides(tracker, rec.body), {
      position: `Cancelled on ${date}${by ? ` by ${String(by).trim()}` : ''}: ${oneLine(reason)}`,
      next: 'None. Cancelled.',
    });
    body = setResumeHere(body, `Cancelled on ${date}. Nothing to resume.`);
    body = addHistory(body, {
      date,
      change: `Cancelled${by ? ` by ${String(by).trim()}` : ''}: ${String(reason).trim()}`,
      effect: open.length ? `Open sub-items to decide on: ${open.map((k) => k.id).join(', ')}.` : 'Work stopped.',
    });
    const patch = { status: 'Cancelled', waiting_on: 'none', updated: date };
    const back = verify(await save(tracker, rec, { meta: patch, body }), { status: 'Cancelled' }, rec.id);
    return { id: rec.id, record: back, openSubItems: open };
  });
}

// ------------------------------------------------------------------ move

export async function opMove(tracker, id, target, { today } = {}) {
  if (!target || !String(target).trim()) throw invalid('--under <id|group|archive|root> is required.');
  const rec = await mustGet(tracker, id);
  if (typeof tracker.move === 'function') {
    const res = await tracker.move(rec.id, String(target).trim());
    if (!res.unchanged) await moveNotes(tracker, res, todayOf({ today }));
    return res;
  }
  const t = String(target).trim();
  if (t.toLowerCase() === 'root' || parseId(t)) {
    const parent = t.toLowerCase() === 'root' ? 'none' : (await mustGet(tracker, t)).id;
    const back = await tracker.update(rec.id, { meta: { parent }, expectBody: rec.body });
    return { id: rec.id, parentBefore: rec.meta.parent, parentAfter: parent, record: back };
  }
  throw new ToolkitError(EXIT.UNSUPPORTED, `The ${tracker.type} tracker has no ${t} folder; move an item under another item or to root.`);
}

/** "WI-003" or "the top level" (not "none (top level)"; sample run c, round 3). */
export const placeName = (p) => (!p || p === 'none' ? 'the top level' : p);
/** "(it was under WI-001)" or "(it was a top-level item)". */
export const wasUnder = (p) => (!p || p === 'none' ? '(it was a top-level item)' : `(it was under ${p})`);

/**
 * Add a Recent History row unless the item already has the same change on the
 * same date (a command run twice, or two sessions that found the same hand
 * move). A missing item or history table is skipped: the move is still done.
 * edit(body) may change the body first (the links in Related items and the Roadmap).
 */
export async function noteOnce(tracker, id, row, edit = null) {
  return change(tracker, async () => {
    const key = canonicalId(id, tracker.prefix);
    const cur = key ? await tracker.get(key) : null;
    if (!cur) return null;
    if (!cur.id) cur.id = key;
    cur.meta = normalizeMeta(cur.meta || {});
    let body = cur.body;
    if (edit) {
      try {
        body = edit(body);
      } catch {
        body = cur.body;
      }
    }
    if (row.change && !parseHistory(body).some((h) => h.date === row.date && h.change === row.change)) {
      try {
        body = appendHistory(body, row);
      } catch {
        // No Recent History table.
      }
    }
    if (body === cur.body) return null;
    return save(tracker, cur, { meta: { updated: row.date }, body });
  });
}

/**
 * History rows for `toolkit work move`: on the moved item when the tracker did
 * not write one itself (Notion), and on the old and the new parent when the
 * parent changed (sample run c, round 2: the parent got no row). The parent
 * and sub-item links in Related items and the Roadmap follow the move.
 */
async function moveNotes(tracker, res, date) {
  const before = normalizeParent(res.parentBefore, tracker.prefix);
  const after = normalizeParent(res.parentAfter, tracker.prefix);
  const relink = (body) => {
    let b = before !== 'none' ? unlinkRelatedItem(body, 'parent', before) : body;
    if (after !== 'none') b = linkRelatedItem(b, 'parent', after);
    return b;
  };
  if (tracker.type !== 'local') {
    const where = res.archived ? 'to the archive' : after === 'none' ? 'to the top level' : `under ${after}`;
    await noteOnce(tracker, res.id, { date, change: `Moved ${where} with toolkit work move.`, effect: `Parent is now ${placeName(after)}.` }, before !== after ? relink : null);
  } else if (before !== after) {
    // The local tracker wrote the moved item's own history row; only its links change here.
    await noteOnce(tracker, res.id, { date, change: null }, relink).catch(() => null);
  }
  if (before === after) return;
  if (before !== 'none') {
    await noteOnce(tracker, before, { date, change: `Sub-item ${res.id} moved out with toolkit work move.`, effect: after === 'none' ? `${res.id} is a top-level item now.` : `${res.id}'s parent is now ${after}.` },
      (b) => removeRoadmapSubItem(unlinkRelatedItem(b, 'sub-item', res.id), res.id));
  }
  if (after !== 'none') {
    await noteOnce(tracker, after, { date, change: `Sub-item ${res.id} moved here with toolkit work move ${wasUnder(before)}.`, effect: `${res.id} is part of this item now.` },
      (b) => addRoadmapSubItem(linkRelatedItem(b, 'sub-item', res.id), res.id));
  }
}

// ------------------------------------------------------------------ next

const STATUS_RANK = { 'In Progress': 0, 'In Review': 1, Ready: 2 };
const PRIORITY_RANK = { urgent: 0, high: 1, medium: 2, low: 3 };

/**
 * Rank items for `work next`: active, not archived, not blocked, no broken
 * approval gate (those wait on the owner: work-decide); In Progress, then
 * In Review, then Ready; then priority; then the older id. Backlog is never recommended.
 */
export function rankNext(items) {
  return items
    .filter((i) => !i.archived && Object.prototype.hasOwnProperty.call(STATUS_RANK, i.meta.status) && !isBlocked(i.meta, i.body || '') && !brokenGates(i.meta).length)
    .sort((a, b) => (STATUS_RANK[a.meta.status] - STATUS_RANK[b.meta.status])
      || ((PRIORITY_RANK[a.meta.priority] ?? 2) - (PRIORITY_RANK[b.meta.priority] ?? 2))
      || ((parseId(a.id) || { n: 0 }).n - (parseId(b.id) || { n: 0 }).n));
}

// ------------------------------------------------------------------ validate

/**
 * Validate every item (or one), with its design, plus tracker-wide problems.
 * @returns {{ ok: boolean, results: Array<{ id, location, errors, warnings, gates, design? }>, problems: object[] }}
 */
export async function opValidate(tracker, { id, ownerName } = {}) {
  const items = await listItems(tracker, { includeBody: true });
  const knownIds = new Set(items.map((i) => i.id));
  if (typeof tracker.knownIds === 'function') for (const k of tracker.knownIds()) knownIds.add(k);
  const targets = id ? [await mustGet(tracker, id)] : items;
  const results = [];
  let designTemplate = null;
  try {
    designTemplate = templateText(tracker, null, DESIGN_FILE);
  } catch {
    designTemplate = null;
  }
  for (const it of targets) {
    const full = it.body === undefined ? await mustGet(tracker, it.id) : it;
    const meta = normalizeMeta(full.meta || {});
    const opts = { prefix: tracker.prefix, knownIds, ownerName };
    if (tracker.type === 'local' && full.parent !== undefined) opts.locationParent = full.parent;
    if (Array.isArray(full.children)) opts.children = full.children.filter((c) => parseId(c));
    const v = validateRecord({ meta, body: full.body }, opts);
    const res = { id: full.id, location: full.location, errors: v.errors, warnings: v.warnings, gates: v.gates };
    res.openOwnerQuestions = isTerminal(meta.status) || full.archived ? 0 : parseQuestions(full.body).filter((q) => isOpenOwnerQuestion(q, ownerName)).length;
    const design = await tracker.getDesign(full.id);
    if (design) {
      const dv = validateDesign({ meta: design.meta, body: design.body }, { itemId: full.id, itemBody: full.body, itemMeta: meta, templateText: designTemplate });
      res.design = { location: design.location, errors: dv.errors, warnings: dv.warnings, gates: dv.gates };
    } else if (meta.design && meta.design !== 'none' && !isPlaceholder(meta.design)) {
      res.warnings.push({ code: 'design_missing', message: `design is ${meta.design}, but the item has no design.` });
    }
    results.push(res);
  }
  const ok = results.every((r) => !r.errors.length && !r.gates.length && (!r.design || (!r.design.errors.length && !r.design.gates.length)));
  return { ok, results };
}

/**
 * Validate one file on disk (a WORK-ITEM.md or a DESIGN.md), by its frontmatter.
 * Never throws for a file it can read: frontmatter the reader cannot read is a
 * validation error with code bad_frontmatter. (The PostToolUse hook calls this.)
 * @returns {{ kind: 'record'|'design', file, id, ok, errors, warnings, gates }}
 */
export function validateFile(file, { prefix, ownerName } = {}) {
  const text = fs.readFileSync(file, 'utf8');
  const { doc, error } = tryParseDoc(text);
  if (!doc) {
    const peek = peekHeader(text);
    const isDesign = peek.workItem || (path.basename(file) === DESIGN_FILE && !peek.id);
    return {
      kind: isDesign ? 'design' : 'record',
      file,
      id: (isDesign ? peek.workItemId : peek.id) || null,
      ok: false,
      errors: [{ code: 'bad_frontmatter', message: `The frontmatter cannot be read (${error}). Put a value that starts with [ or { in quotes, and close every quote.` }],
      warnings: [],
      gates: [],
    };
  }
  if (doc.kind === 'design') {
    let itemBody;
    let itemMeta;
    const rec = path.join(path.dirname(file), RECORD_FILE);
    if (fs.existsSync(rec)) {
      const r = tryParseDoc(fs.readFileSync(rec, 'utf8')).doc;
      if (r && r.meta.id && canonicalId(r.meta.id) === canonicalId(doc.meta.work_item)) {
        itemBody = r.body;
        itemMeta = r.meta;
      }
    }
    const v = validateDesign(text, { itemBody, itemMeta });
    return { kind: 'design', file, id: doc.meta.work_item || null, ...v };
  }
  const v = validateRecord(text, { prefix, ownerName });
  return { kind: 'record', file, id: doc.meta.id || null, ...v };
}
