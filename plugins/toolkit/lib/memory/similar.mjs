// The duplicate check inside `toolkit memory save` (Mike, 2026-09-27,
// "Memory additions" 2): before a record is written, the memory is searched
// for a record with the same key, or with a very similar description or body.
// The command refuses the save (exit 2) and lists them, unless the caller
// says the save is meant: --expect <version> (an update of the record it
// read), --supersedes <key> (a replacement), or --allow-similar.
//
// Similar means: the two descriptions are the same, or share at least
// SIMILAR_AT (60%) of their search words (at least 3 words between them), or
// the durable points of the two bodies do (the text after **Remember:**, or
// the whole body when there is no Remember label; at least 5 words in each).
// Search words are searchTerms() of contract.mjs (common words left out); the
// topic labels and the title line are left out, and the other labels (Why,
// How to apply, ...) are not compared, so two records are not similar only
// because both use the template or the same stock reason.
//
// Works with every backend through the MemoryDriver methods: list() gives the
// descriptions; find() on the new record's words gives at most MAX_BODIES
// records whose bodies are read with get().

import { isProposal, searchTerms } from './contract.mjs';

export const SIMILAR_AT = 0.6;
const MIN_WORDS = 3;
/** Two points are compared only when both have at least this many search words. */
const MIN_BODY_WORDS = 5;
const MAX_BODIES = 5;
const LABEL_WORDS = new Set(['remember', 'why', 'how', 'apply', 'evidence', 'limits', 'related', 'memories', 'authoritative', 'records', 'stated', 'owner', 'none', 'not']);

/** The search words of a body: no title line, no labels, no link targets. */
export function bodyWords(body) {
  const text = String(body ?? '')
    .split('\n')
    .filter((l) => !/^#\s/.test(l) && !/^\*\*(Superseded|Archived|Restored) \d{4}-\d{2}-\d{2}:\*\*/.test(l.trim()))
    .join('\n')
    .replace(/\]\([^)]*\)/g, ']')
    .replace(/\*\*[^*\n]+:\*\*/g, ' ');
  return searchTerms(text).filter((w) => !LABEL_WORDS.has(w));
}

/**
 * The search words of a body's durable point: the paragraph after
 * "**Remember:**" (up to the next label or heading), or bodyWords() of the
 * whole body when it has no Remember label.
 */
export function pointWords(body) {
  const text = String(body ?? '');
  const m = /^\s*\*\*Remember:\*\*([\s\S]*?)(?=^\s*\*\*[^*\n]+:\*\*|^#{1,6}\s|(?![\s\S]))/m.exec(text);
  return m ? bodyWords(m[1]) : bodyWords(text);
}

/** The share of words two lists have in common (0 to 1): shared / all. */
export function overlap(a, b) {
  const A = new Set(a);
  const B = new Set(b);
  if (!A.size || !B.size) return 0;
  let shared = 0;
  for (const w of A) if (B.has(w)) shared++;
  return shared / (A.size + B.size - shared);
}

function sameText(a, b) {
  const n = (s) => String(s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  return Boolean(n(a)) && n(a) === n(b);
}

/**
 * How two records compare: { description, body } scores from 0 to 1, and
 * similar: true when either passes SIMILAR_AT (with at least MIN_WORDS words
 * between them) or the descriptions are the same text.
 */
export function compareRecords(a, b) {
  const da = searchTerms(a.description);
  const db = searchTerms(b.description);
  const description = sameText(a.description, b.description) ? 1 : overlap(da, db);
  const descOk = description === 1 || (new Set([...da, ...db]).size >= MIN_WORDS && description >= SIMILAR_AT);
  let body = 0;
  let bodyOk = false;
  if (a.body !== undefined && b.body !== undefined) {
    const ba = pointWords(a.body);
    const bb = pointWords(b.body);
    body = overlap(ba, bb);
    bodyOk = Math.min(new Set(ba).size, new Set(bb).size) >= MIN_BODY_WORDS && body >= SIMILAR_AT;
  }
  return { description, body, similar: descOk || bodyOk, why: descOk ? 'a very similar description' : bodyOk ? 'very similar text' : null };
}

/**
 * The records that look like `record` (a normalized record: key,
 * description, body). Records that are retired, and the keys in `skip`, are
 * not compared. The record with the same key is not listed here: the command
 * reports it itself. Returns [{ key, description, status, proposal, why }],
 * most similar first.
 */
export async function findSimilar(driver, record, { skip = [] } = {}) {
  const leave = new Set([record.key, ...skip]);
  const found = new Map();
  const note = (summary, cmp) => {
    const score = Math.max(cmp.description, cmp.body);
    const had = found.get(summary.key);
    if (had && had.score >= score) return;
    found.set(summary.key, {
      key: summary.key,
      description: summary.description,
      status: summary.status,
      proposal: Boolean(summary.proposal ?? isProposal(summary)),
      why: cmp.why,
      score,
    });
  };
  const summaries = await driver.list();
  for (const s of summaries) {
    if (leave.has(s.key)) continue;
    const cmp = compareRecords(record, { description: s.description });
    if (cmp.similar) note(s, cmp);
  }
  // Bodies: only the few records a search on the new record's words finds.
  const words = [...new Set([...searchTerms(record.description), ...pointWords(record.body)])].slice(0, 12).join(' ');
  if (words) {
    let hits = [];
    try {
      const res = await driver.find(words, { limit: MAX_BODIES + leave.size, proposals: true });
      // Hindsight also gives the records that may be about it (res.maybe) and the
      // records closest by meaning that share few words (res.closest).
      const list = (name) => (res && Array.isArray(res[name]) ? res[name] : []);
      const all = [...list('results'), ...list('maybe'), ...list('closest')];
      hits = all.filter((h) => !leave.has(h.key)).slice(0, MAX_BODIES);
    } catch {
      hits = [];
    }
    for (const h of hits) {
      const rec = await driver.get(h.key);
      if (!rec || rec.status === 'retired') continue;
      const cmp = compareRecords(record, rec);
      if (cmp.similar) note({ ...h, ...rec, proposal: isProposal(rec) }, cmp);
    }
  }
  return [...found.values()].sort((a, b) => b.score - a.score || (a.key < b.key ? -1 : 1)).map(({ score, ...rest }) => rest);
}
