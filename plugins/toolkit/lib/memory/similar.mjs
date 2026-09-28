// The duplicate check inside `toolkit memory save` (Mike, 2026-09-27,
// "Memory additions" 2): before a record is written, the memory is searched
// for a record with the same key, or with a very similar description or body.
// The command refuses the save (exit 2) and lists them, unless the caller
// says the save is meant: --expect <version> (an update of the record it
// read), --supersedes <key> (a replacement), or --allow-similar.
//
// Similar means: the two descriptions are the same, or share at least
// SIMILAR_AT (60%) of their words (at least 3 words between them), or the
// durable points of the two bodies do (the text after **Remember:**, or the
// whole body when there is no Remember label; at least 5 words in each). Or:
// the record the backend's search returns first for the new record's words
// shares at least TOP_HIT_AT (40%) of its description or durable point
// (final review I6: "Explain each command-line flag in the README file" was
// saved beside "Document every command-line flag in the README").
//
// The closest-match rule is for the same fact in other words, so it does not
// count when the words the two records do not share include a name or a
// value (acme-uat and acme-prod, Fridays and Mondays, Node 20), or two words
// of opposite meaning (before and after, staging and production). Those are
// different facts about the same subject (verifier, 2026-09-28: "The staging
// org alias is acme-uat" stopped "The production org alias is acme-prod").
//
// Words are compared as stems (documented = document, flags = flag, explained
// = explain), and words with one meaning count as one ("each", "every", and
// "all"). Search words are searchTerms() of contract.mjs (common words left
// out); the topic labels and the title line are left out, and the other
// labels (Why, How to apply, ...) are not compared, so two records are not
// similar only because both use the template or the same stock reason.
//
// Works with every backend through the MemoryDriver methods: list() gives the
// descriptions; find() on the new record's words gives at most MAX_BODIES
// records whose bodies are read with get().

import { isProposal, searchTerms } from './contract.mjs';

export const SIMILAR_AT = 0.6;
/** The first search result counts as similar at this word overlap. */
export const TOP_HIT_AT = 0.4;
const MIN_WORDS = 3;
/** Two points are compared only when both have at least this many search words. */
const MIN_BODY_WORDS = 5;
const MAX_BODIES = 5;
const LABEL_WORDS = new Set(['remember', 'why', 'how', 'apply', 'evidence', 'limits', 'related', 'memories', 'authoritative', 'records', 'stated', 'owner', 'none', 'not']);
/** Words that carry no fact of their own in a memory sentence. */
const FILLER = new Set(['be', 'been', 'being', 'should', 'would', 'must', 'can', 'could', 'also', 'always', 'just', 'please']);
/** Words with one meaning, compared as the first word of their group. */
const SAME_MEANING = new Map([
  ['every', 'each'], ['all', 'each'],
  ['docs', 'document'], ['documentation', 'document'],
]);

/** The why of a record found only by the closest-match rule. */
export const CLOSEST_WHY = 'the closest match in memory, about the same subject';

const CALENDAR_WORDS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
  'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
/** Pairs of words of opposite meaning: two records that differ by one of them state different facts. */
const OPPOSITE_WORDS = [
  ['before', 'after'], ['staging', 'production'], ['stage', 'prod'], ['dev', 'prod'], ['development', 'production'],
  ['sandbox', 'production'], ['test', 'production'], ['on', 'off'], ['enable', 'disable'], ['enabled', 'disabled'],
  ['always', 'never'], ['allow', 'deny'], ['allow', 'block'], ['add', 'remove'], ['open', 'close'], ['first', 'last'],
  ['min', 'max'], ['minimum', 'maximum'], ['true', 'false'], ['yes', 'no'], ['public', 'private'], ['local', 'remote'],
  ['start', 'stop'], ['start', 'end'], ['include', 'exclude'], ['increase', 'decrease'], ['more', 'less'],
  ['upper', 'lower'], ['old', 'new'], ['with', 'without'], ['can', 'cannot'], ['must', 'never'],
];

/**
 * The stem of a word: common endings taken off, so "documented", "documents",
 * and "documenting" all give "document", and "flags" gives "flag". A short
 * word is kept as it is. Words with one meaning map to one word first.
 */
export function stem(word) {
  let w = String(word ?? '').toLowerCase();
  if (SAME_MEANING.has(w)) return SAME_MEANING.get(w);
  if (w.length <= 3 || /^\d+$/.test(w)) return w;
  if (w.endsWith('ies') && w.length > 4) w = `${w.slice(0, -3)}y`;
  else if (w.endsWith('ing') && w.length > 5) w = w.slice(0, -3);
  else if (w.endsWith('ed') && w.length > 4) w = w.slice(0, -2);
  else if (w.endsWith('es') && /(?:ss|x|z|ch|sh)es$/.test(w)) w = w.slice(0, -2);
  else if (w.endsWith('s') && !/(?:ss|us|is)$/.test(w)) w = w.slice(0, -1);
  if (w.endsWith('ly') && w.length > 4) w = w.slice(0, -2);
  // "running" -> "runn" -> "run"; "saved" -> "sav" and "save" -> "sav" alike.
  if (/([b-df-hj-np-tv-z])\1$/.test(w) && !/(?:ll|ss|zz)$/.test(w)) w = w.slice(0, -1);
  if (w.endsWith('e') && w.length > 3) w = w.slice(0, -1);
  return SAME_MEANING.get(w) || w;
}

const CALENDAR = new Set(CALENDAR_WORDS.map((w) => stem(w)));
const OPPOSITES = OPPOSITE_WORDS.map(([a, b]) => [a, b]);

/** Lower-case words of a text, as written (common words are kept, so "before" and "always" count). */
function plainWords(text) {
  return [...new Set(String(text ?? '').toLowerCase().normalize('NFKD').split(/[^a-z0-9]+/).filter(Boolean))];
}

/**
 * The stems of the names and values in a text: words with a digit, words
 * joined by - _ . / : or @ (acme-uat, v1.2, src/app), capitalized words that
 * do not start a sentence (Mike, Friday, CLI), and day and month names.
 */
export function valueStems(text) {
  const out = new Set();
  const clean = String(text ?? '').replace(/\]\([^)]*\)/g, ']').replace(/\*\*[^*\n]+:\*\*/g, ' ');
  let sentenceStart = true;
  for (const raw of clean.split(/\s+/)) {
    const tok = raw.replace(/^[("'“‘`*_[]+|[)"'”’`*_\].,;:!?]+$/g, '');
    if (tok) {
      const value = /\d/.test(tok) || /[A-Za-z0-9][-_./:@][A-Za-z0-9]/.test(tok) || (!sentenceStart && /^[A-Z]/.test(tok));
      for (const w of stems(searchTerms(tok))) if (value || CALENDAR.has(w)) out.add(w);
    }
    if (raw) sentenceStart = /[.!?]["'”’)*_]*$/.test(raw) || /^#+$/.test(raw);
  }
  return out;
}

/**
 * True when the words two texts do not share include a name or a value
 * (valueStems), or a pair of words of opposite meaning. Such texts state
 * different facts even when most of their words are the same.
 */
export function differsByValue(a, b) {
  const sa = stems(searchTerms(a));
  const sb = stems(searchTerms(b));
  const A = new Set(sa);
  const B = new Set(sb);
  const va = valueStems(a);
  const vb = valueStems(b);
  if (sa.some((w) => !B.has(w) && va.has(w)) || sb.some((w) => !A.has(w) && vb.has(w))) return true;
  const pa = plainWords(a);
  const pb = plainWords(b);
  const onlyA = new Set(pa.filter((w) => !pb.includes(w)));
  const onlyB = new Set(pb.filter((w) => !pa.includes(w)));
  return OPPOSITES.some(([x, y]) => (onlyA.has(x) && onlyB.has(y)) || (onlyA.has(y) && onlyB.has(x)));
}

/** Search words as stems, without filler words and repeats. */
export function stems(words) {
  return [...new Set(words.filter((w) => !FILLER.has(w)).map(stem))];
}

/** The search words of a body: no title line, no labels, no link targets. */
export function bodyWords(body) {
  const text = String(body ?? '')
    .split('\n')
    .filter((l) => !/^#\s/.test(l) && !/^\*\*(Superseded|Archived|Restored) \d{4}-\d{2}-\d{2}:\*\*/.test(l.trim()))
    .join('\n')
    .replace(/\]\([^)]*\)/g, ']')
    .replace(/\*\*[^*\n]+:\*\*/g, ' ');
  return stems(searchTerms(text).filter((w) => !LABEL_WORDS.has(w)));
}

/**
 * The text of a body's durable point: the paragraph after "**Remember:**" (up
 * to the next label or heading), or the whole body when it has no Remember
 * label.
 */
export function pointText(body) {
  const text = String(body ?? '');
  const m = /^\s*\*\*Remember:\*\*([\s\S]*?)(?=^\s*\*\*[^*\n]+:\*\*|^#{1,6}\s|(?![\s\S]))/m.exec(text);
  return m ? m[1] : text;
}

/** The words (stems) of a body's durable point, as bodyWords() gives them. */
export function pointWords(body) {
  return bodyWords(pointText(body));
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
 * How two records compare: { description, body } scores from 0 to 1;
 * similar: true when either passes SIMILAR_AT (with at least MIN_WORDS words
 * between them) or the descriptions are the same text; close: true when
 * either passes TOP_HIT_AT with at least MIN_WORDS description words (or
 * MIN_BODY_WORDS point words) on each side and the words that differ are
 * not names, values, or opposites (differsByValue).
 */
export function compareRecords(a, b) {
  const da = stems(searchTerms(a.description));
  const db = stems(searchTerms(b.description));
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
  // Close enough when it is also the search's first match (findSimilar): the
  // same word minimums, and TOP_HIT_AT instead of SIMILAR_AT.
  // Not when the words that differ are names, values, or opposites (differsByValue).
  const descMin = Math.min(da.length, db.length);
  const closeDesc = descMin >= MIN_WORDS && description >= TOP_HIT_AT && !differsByValue(a.description, b.description);
  const closeBody = bodyCounted(a, b) && body >= TOP_HIT_AT && !differsByValue(pointText(a.body), pointText(b.body));
  return { description, body, similar: descOk || bodyOk, close: closeDesc || closeBody, why: descOk ? 'a very similar description' : bodyOk ? 'very similar text' : null };
}

function bodyCounted(a, b) {
  if (a.body === undefined || b.body === undefined) return false;
  return Math.min(new Set(pointWords(a.body)).size, new Set(pointWords(b.body)).size) >= MIN_BODY_WORDS;
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
  // The search uses the words as written (not stems), so a meaning search reads them well.
  const words = [...new Set([...searchTerms(record.description), ...searchTerms(pointText(record.body)).filter((w) => !LABEL_WORDS.has(w))])].slice(0, 12).join(' ');
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
    for (const [i, h] of hits.entries()) {
      const rec = await driver.get(h.key);
      if (!rec || rec.status === 'retired') continue;
      const cmp = compareRecords(record, rec);
      if (cmp.similar) note({ ...h, ...rec, proposal: isProposal(rec) }, cmp);
      else if (i === 0 && cmp.close) {
        // The search's first match with many shared words is the same fact in other words.
        note({ ...h, ...rec, proposal: isProposal(rec) }, { ...cmp, why: CLOSEST_WHY });
      }
    }
  }
  return [...found.values()].sort((a, b) => b.score - a.score || (a.key < b.key ? -1 : 1)).map(({ score, ...rest }) => rest);
}
