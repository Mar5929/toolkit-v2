// Lessons, their promotion, and rule proposals (Mike, 2026-09-29, dev/GOAL.md
// "Rules, skills, and memory each hold one kind of thing").
//
// Memory holds facts and unproven know-how. Each concept file has a
// "## Gotchas and lessons" section (the model's topic template); a lesson is a
// "### <heading>" inside it: what happened, what to do, and a Seen line with
// the date of each session it came up in:
//
//   ## Gotchas and lessons
//
//   ### Hindsight needs HF_HUB_OFFLINE
//
//   The server stops at start when it tries to download a model. Set HF_HUB_OFFLINE=1.
//
//   **Seen:** 2026-09-29 (setup session); 2026-10-02 (backup session)
//
// A lesson proves itself when it comes up in two or more sessions, when a
// lesson like it is in another concept, or when the owner confirms it. Then
// the agent proposes it as a rule or a skill (toolkit memory promote), and
// after the owner's yes the lesson gets a Promoted line that names where it
// went. memory-tidy lists the candidates (toolkit memory tidy --plan).
//
// A rule proposal is a saved memory proposal (needs-review, "Proposed by ...")
// whose frontmatter names the rule section it would join (`rule_section`, and
// `rule_scope` project or machine). An older feedback_ proposal is one too.
// toolkit memory approve writes it into the owner-preferences rule and removes
// the proposal record; toolkit memory reject deletes it.

import { LESSONS_HEADING, conceptParts, getSection } from './concepts.mjs';
import { isProposal, searchTerms } from './contract.mjs';
import { stems } from './similar.mjs';
import { ownerWording } from './owner-wording.mjs';

export { LESSONS_HEADING };
/** The text of a Gotchas and lessons section with no lesson yet. */
export const LESSONS_EMPTY = 'None yet.';

const LESSON_RE = /^###(?!#)[ \t]+(.*?\S)[ \t]*#*[ \t]*$/;
const FENCE_RE = /^\s{0,3}(`{3,}|~{3,})/;
const DATE_G = /\d{4}-\d{2}-\d{2}/g;
const SEEN_RE = /^\*\*Seen:\*\*\s*(.*)$/;
const PROMOTED_RE = /^\*\*Promoted:\*\*\s*(.*)$/;

function sameWords(a, b) {
  const n = (s) => String(s ?? '').normalize('NFKC').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  return n(a) !== '' && n(a) === n(b);
}

function trimBlank(lines) {
  let a = 0;
  let b = lines.length;
  while (a < b && !lines[a].trim()) a++;
  while (b > a && !lines[b - 1].trim()) b--;
  return lines.slice(a, b);
}

/**
 * The lessons of a Gotchas and lessons section text:
 * { lead: [lines before the first ###], lessons: [{ heading, lines }] }.
 */
export function parseLessons(sectionText) {
  const lines = String(sectionText ?? '').replace(/\r\n/g, '\n').split('\n');
  const lead = [];
  const lessons = [];
  let fence = false;
  for (const line of lines) {
    if (FENCE_RE.test(line)) fence = !fence;
    const h = !fence && LESSON_RE.exec(line);
    if (h) {
      lessons.push({ heading: h[1].trim(), lines: [] });
      continue;
    }
    if (lessons.length) lessons[lessons.length - 1].lines.push(line);
    else lead.push(line);
  }
  return { lead, lessons };
}

function serializeLessons(parsed) {
  const parts = [];
  const lead = trimBlank(parsed.lead).filter((l) => !(parsed.lessons.length && l.trim() === LESSONS_EMPTY));
  if (lead.length) parts.push(lead.join('\n'));
  for (const l of parsed.lessons) {
    parts.push(`### ${l.heading}`);
    const body = trimBlank(l.lines);
    if (body.length) parts.push(body.join('\n'));
  }
  return parts.length ? parts.join('\n\n') : LESSONS_EMPTY;
}

/** A Seen entry's source, compared without case, spacing, or brackets. */
function sourceKey(text) {
  return String(text ?? '').replace(DATE_G, ' ').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

/**
 * The sessions a Seen line records, as their dates, oldest first. Entries are
 * separated by ";"; each is a date and, in brackets, the session or work it
 * came from. Two entries with the same date and different sources are two
 * sessions of one day (verifier, 2026-09-29: counting dates made two sessions
 * on one day count as one). An entry that lists several dates counts each.
 */
export function seenSessions(seenText) {
  const out = [];
  const keys = new Set();
  for (const part of String(seenText ?? '').split(';')) {
    const dates = part.match(DATE_G) || [];
    const src = dates.length === 1 ? sourceKey(part) : '';
    for (const d of dates) {
      const k = `${d}|${src}`;
      if (keys.has(k)) continue;
      keys.add(k);
      out.push(d);
    }
  }
  return out.sort();
}

/** Facts about one lesson: { heading, text, seen: [a date per session], promoted, confirmed }. */
function describeLesson(lesson, ownerName) {
  const text = trimBlank(lesson.lines).join('\n');
  const seenLine = lesson.lines.map((l) => SEEN_RE.exec(l.trim())).find(Boolean);
  const seen = seenLine ? seenSessions(seenLine[1]) : [...new Set(text.match(DATE_G) || [])].sort();
  const promotedLine = lesson.lines.map((l) => PROMOTED_RE.exec(l.trim())).find(Boolean);
  const owner = String(ownerName ?? '').trim();
  const names = owner ? `|${[owner, owner.split(/\s+/)[0]].map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')}` : '';
  const confirmed = new RegExp(`\\*\\*Owner confirmed:\\*\\*|\\bowner confirmed\\b|\\bconfirmed by (?:the owner${names})\\b`, 'i').test(text);
  return { heading: lesson.heading, text, seen, promoted: promotedLine ? promotedLine[1].trim() : null, confirmed };
}

/** The lessons of a concept body: [{ heading, text, seen, promoted, confirmed }]. */
export function lessonsOf(body, { ownerName = null } = {}) {
  const section = getSection(body, LESSONS_HEADING);
  if (section === null) return [];
  return parseLessons(section).lessons.map((l) => describeLesson(l, ownerName));
}

/**
 * The Gotchas and lessons section text after one lesson is recorded. A lesson
 * with the same heading is the same lesson seen again: today's entry joins its
 * Seen line, and new text is added under it when it is not there yet. The
 * same date again is a new entry only with a source no entry of that date
 * has (another session of the same day).
 * Returns { text, action: 'added'|'seen-again'|'unchanged', heading }.
 */
export function addLesson(sectionText, heading, { text = '', date, source = '' }) {
  const parsed = parseLessons(sectionText === null || sectionText === undefined ? '' : sectionText);
  const seenEntry = `${date}${source ? ` (${String(source).replace(/[()]/g, '').replace(/\s+/g, ' ').trim()})` : ''}`;
  const given = String(text ?? '').replace(/\r\n/g, '\n').trim();
  const found = parsed.lessons.find((l) => sameWords(l.heading, heading));
  if (!found) {
    parsed.lessons.push({ heading: String(heading).replace(/\s+/g, ' ').trim(), lines: [...(given ? [given, ''] : []), `**Seen:** ${seenEntry}`] });
    return { text: serializeLessons(parsed), action: 'added', heading: String(heading).replace(/\s+/g, ' ').trim() };
  }
  let changed = false;
  const at = found.lines.findIndex((l) => SEEN_RE.test(l.trim()));
  if (at === -1) {
    found.lines = [...trimBlank(found.lines), '', `**Seen:** ${seenEntry}`];
    changed = true;
  } else if (!seenAlready(SEEN_RE.exec(found.lines[at].trim())[1], date, source)) {
    found.lines[at] = `${found.lines[at].replace(/\s+$/, '')}; ${seenEntry}`;
    changed = true;
  }
  if (given && !trimBlank(found.lines).join('\n').includes(given)) {
    const seenAt = found.lines.findIndex((l) => SEEN_RE.test(l.trim()));
    found.lines.splice(seenAt, 0, given, '');
    changed = true;
  }
  return { text: serializeLessons(parsed), action: changed ? 'seen-again' : 'unchanged', heading: found.heading };
}

/**
 * True when a Seen line already records this session: an entry of that date
 * with the same source, or any entry of that date when no source is given.
 */
function seenAlready(seenText, date, source) {
  const want = sourceKey(source);
  return String(seenText ?? '').split(';').some((part) => {
    const dates = part.match(DATE_G) || [];
    if (!dates.includes(date)) return false;
    return !want || dates.length > 1 || sourceKey(part) === want;
  });
}

/**
 * The section text with a Promoted line on one lesson: where it went and when.
 * Returns null when the section has no such lesson.
 */
export function promotionMark(sectionText, heading, { date, where }) {
  const parsed = parseLessons(sectionText);
  const found = parsed.lessons.find((l) => sameWords(l.heading, heading));
  if (!found) return null;
  const line = `**Promoted:** ${date}, to ${where}. Follow that; this lesson stays as its history.`;
  const at = found.lines.findIndex((l) => PROMOTED_RE.test(l.trim()));
  if (at === -1) found.lines = [...trimBlank(found.lines), '', line];
  else found.lines[at] = line;
  return serializeLessons(parsed);
}

/** The first lesson of a body with this heading, described, or null. */
export function findLesson(body, heading, opts) {
  return lessonsOf(body, opts).find((l) => sameWords(l.heading, heading)) || null;
}

/** The lesson's point: its text without the Seen, Promoted, and Owner confirmed lines, on one line. */
export function lessonPoint(lesson) {
  return String(lesson.text || '')
    .split('\n')
    .filter((l) => !/^\*\*(?:Seen|Promoted|Owner confirmed):\*\*/.test(l.trim()))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const OWN = new Set(['gotcha', 'gotchas', 'lesson', 'lessons', 'seen', 'session', 'promoted']);

function lessonStems(lesson) {
  return stems(searchTerms(`${lesson.heading} ${lessonPoint(lesson)}`).filter((w) => !OWN.has(w) && !/^\d+$/.test(w)));
}

/**
 * The lessons that have proved themselves and are not promoted yet
 * (memory-tidy's promotion candidates): [{ key, title, heading, point,
 * sessions, why: [reasons] }]. A lesson counts when it came up in two or more
 * sessions (two or more dates on its Seen line), when a lesson that shares at
 * least three words and half its words is in another concept, or when the
 * owner confirmed it.
 */
export function planPromotions(records, { ownerName = null } = {}) {
  const all = [];
  for (const r of records) {
    if (!r || r.status === 'retired' || isProposal(r) || r.type === 'event') continue;
    const title = conceptParts(r.body).title || r.key;
    for (const l of lessonsOf(r.body, { ownerName })) {
      if (l.promoted) continue;
      all.push({ key: r.key, title, lesson: l, words: lessonStems(l) });
    }
  }
  const out = [];
  for (const a of all) {
    const why = [];
    if (a.lesson.seen.length >= 2) why.push(`it came up in ${a.lesson.seen.length} sessions (${a.lesson.seen.join(', ')})`);
    if (a.lesson.confirmed) why.push('the owner confirmed it');
    for (const b of all) {
      if (b.key === a.key) continue;
      const A = new Set(a.words);
      const shared = b.words.filter((w) => A.has(w));
      if (shared.length >= 3 && shared.length >= Math.min(A.size, b.words.length) / 2) why.push(`${b.key} has a lesson like it ("${b.lesson.heading}")`);
    }
    if (why.length) out.push({ key: a.key, title: a.title, heading: a.lesson.heading, point: lessonPoint(a.lesson), sessions: a.lesson.seen.length, why });
  }
  return out;
}

// ---------------------------------------------------------------- rule proposals

/** True for a saved proposal that the owner's yes turns into a rule: it names a rule section, or it is an older feedback_ proposal. */
export function isRuleProposal(record) {
  const r = record || {};
  if (!isProposal(r)) return false;
  const extra = r.extra && typeof r.extra === 'object' ? r.extra : {};
  return Boolean(String(r.rule_section ?? extra.rule_section ?? '').trim()) || r.type === 'feedback';
}

/** The rule section and scope a rule proposal names: { section, scope }. */
export function ruleTarget(record) {
  const r = record || {};
  const extra = r.extra && typeof r.extra === 'object' ? r.extra : {};
  const section = String(r.rule_section ?? extra.rule_section ?? '').replace(/\s+/g, ' ').trim() || 'General';
  const scope = String(r.rule_scope ?? extra.rule_scope ?? '').trim() === 'machine' ? 'machine' : 'project';
  return { section, scope };
}

/** The instruction a rule proposal holds: its Remember line (else its description), with the owner's name for a leading "you". */
export function ruleProposalText(record, ownerName) {
  const r = record || {};
  const m = /\*\*Remember:\*\*\s*([^\n]+)/.exec(String(r.body || ''));
  const text = (m ? m[1] : String(r.description || '')).replace(/\s+/g, ' ').trim();
  return ownerWording(text, ownerName);
}

/**
 * The rule section a preference or instruction belongs under, from its words:
 * Git, Replies, Questions, Testing, Work items, Memory, else General. Git
 * words are checked first: they name one thing, while "short" or "words" fit
 * many ("Keep commits short" is a Git rule; verifier, 2026-09-29). The agent
 * may name another with --rule-section or approve --section.
 */
export function ruleArea(text) {
  const s = String(text ?? '').toLowerCase();
  if (/\b(?:commits?|branch(?:es)?|merge|push|pull requests?|git)\b/.test(s)) return 'Git';
  if (/\b(?:repl(?:y|ies)|answers?|status|bullets?|tables?|summar(?:y|ies)|words?|explain|wording|tone|short)\b/.test(s)) return 'Replies';
  if (/\b(?:questions?|ask(?:s|ing)?)\b/.test(s)) return 'Questions';
  if (/\b(?:tests?|testing|checks?)\b/.test(s)) return 'Testing';
  if (/\b(?:work items?|stages?|tracker|design|requirements?)\b/.test(s)) return 'Work items';
  if (/\b(?:memory|remember)\b/.test(s)) return 'Memory';
  return 'General';
}
