// Concept memory (Mike, 2026-09-28, dev/GOAL.md "Concept memory, like
// Anthropic's project memory"): one record per concept or area, in every
// backend (a .memory/ file, a Hindsight document, a Notion Memories row).
// Four prefixes (Mike, 2026-09-29, "Rules, skills, and memory each hold one
// kind of thing"): user_, project_, reference_, event_ (for example
// user_profile, project_billing). feedback_ is retired: instructions are rules
// (toolkit rule add); an older feedback_ record is still read and moved out by
// memory-tidy. An event_ record holds one episode, so events stay their own
// files. Every other concept ends with a "## Gotchas and lessons" section
// (lib/memory/lessons.mjs).
//
// A concept record has a title (its "# " line), a one-line summary (the
// `description`), and the date of its last change (`updated`) at the top. Each
// fact, or group of facts, is one "## <Sub-topic>" section with the model's
// labels (**Remember:**, **Why:**, **How to apply:**, **Evidence and limits:**,
// **Related memories:**, **Authoritative records:**). New facts go into the
// concept they belong to, under a heading; a new record only for a new concept.
// A record written before concept memory (labels with no "##" section) is a
// concept of one fact: it stays valid, and toolkit memory tidy --plan proposes
// merging such records into concepts.
//
// This module holds the parts every backend shares:
//   conceptParts(body)                 the lead text and the "##" sections
//   spliceSection(body, heading, text, { mode })   add, replace, append to, or remove one section,
//                                      every other line kept as it was
//   sectionText(text, heading)         the text given for a section, in the model's label format
//   editConceptText(text, key, edit)   one section changed in a record's stored text,
//                                      with `updated` and the other given fields set
//   editRecordWith(driver, key, fn, opts)   a read-change-write through the driver
//                                      (the driver's own editRecord when it has one)
//   suggestConcept(driver, candidate)  the existing concept a new fact's words match
//   planTidy(records)                  which one-fact records to merge into which concepts,
//                                      and which concepts grew too large
//   mergeSections(...)                 the body of a concept that takes in other records
//
// A section is found by its heading, compared without regard to case or
// spacing. Headings inside fenced code blocks are not sections.

import { EXIT, ToolkitError } from '../core/output.mjs';
import { parse as parseFrontmatter, stringify as stringifyFrontmatter } from '../core/frontmatter.mjs';
import {
  DESCRIPTION_MAX, RECORD_TYPES, UNAPPROVED_NOTE_RE, assertValidRecord, bodyTitle, checkExpect, headingAnchor, isProposal, modelLabels,
  parseRecord, repairLinks, searchTerms, setUpdated, titleFromName, topicBody, versionOf,
} from './contract.mjs';
import { stems } from './similar.mjs';

/** A "## " heading line (level two only), outside fenced code. */
const SECTION_RE = /^##(?!#)[ \t]+(.*?\S)[ \t]*#*[ \t]*$/;
const FENCE_RE = /^\s{0,3}(`{3,}|~{3,})/;
const H1_RE = /^#(?!#)[ \t]+\S/;

/** The section every concept ends with: learned know-how, each lesson a "### " heading (lib/memory/lessons.mjs). */
export const LESSONS_HEADING = 'Gotchas and lessons';
/** A concept this long is proposed for a split (toolkit memory tidy --plan; memory-tidy). */
export const CONCEPT_MAX_LINES = 300;
export const CONCEPT_MAX_SECTIONS = 20;

/** How a heading is compared: case, spacing, and a closing colon do not count. */
export function sameHeading(a, b) {
  const n = (h) => String(h ?? '').normalize('NFKC').replace(/\s+/g, ' ').replace(/[:.]\s*$/, '').trim().toLowerCase();
  return n(a) !== '' && n(a) === n(b);
}

/**
 * The line ranges of a body: { lines, leadEnd, sections: [{ heading, start, end }] }.
 * start is the heading line; end is the first line after the section.
 */
function ranges(body) {
  const lines = String(body ?? '').replace(/\r\n/g, '\n').split('\n');
  const sections = [];
  let fence = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const f = FENCE_RE.exec(line);
    if (fence) {
      if (f && f[1][0] === fence[0] && f[1].length >= fence.length) fence = null;
      continue;
    }
    if (f) {
      fence = f[1];
      continue;
    }
    const h = SECTION_RE.exec(line);
    if (h) {
      if (sections.length) sections[sections.length - 1].end = i;
      sections.push({ heading: h[1].trim(), start: i, end: lines.length });
    }
  }
  return { lines, leadEnd: sections.length ? sections[0].start : lines.length, sections };
}

function trimBlank(lines) {
  let a = 0;
  let b = lines.length;
  while (a < b && !lines[a].trim()) a++;
  while (b > a && !lines[b - 1].trim()) b--;
  return lines.slice(a, b);
}

/**
 * The parts of a concept body: { title, lead, sections: [{ heading, text }] }.
 * lead is the text before the first "##" section, without the "# " title
 * line; text is a section's content without its heading. Both are trimmed.
 */
export function conceptParts(body) {
  const { lines, leadEnd, sections } = ranges(body);
  const lead = lines.slice(0, leadEnd).filter((l, i, all) => !(H1_RE.test(l) && all.findIndex((x) => H1_RE.test(x)) === i));
  return {
    title: bodyTitle(body),
    lead: trimBlank(lead).join('\n'),
    sections: sections.map((s) => ({ heading: s.heading, text: trimBlank(lines.slice(s.start + 1, s.end)).join('\n') })),
  };
}

/** Every heading of a body, any level, outside fenced code: what a link anchor can name. */
export function allHeadings(body) {
  const out = [];
  let fence = null;
  for (const line of String(body ?? '').replace(/\r\n/g, '\n').split('\n')) {
    const f = FENCE_RE.exec(line);
    if (fence) {
      if (f && f[1][0] === fence[0] && f[1].length >= fence.length) fence = null;
      continue;
    }
    if (f) {
      fence = f[1];
      continue;
    }
    const h = /^#{1,6}[ \t]+(.*?\S)[ \t]*#*[ \t]*$/.exec(line);
    if (h) out.push(h[1].trim());
  }
  return out;
}

/** The headings of a body's "##" sections. */
export function sectionHeadings(body) {
  return ranges(body).sections.map((s) => s.heading);
}

/** The text of one section (without its heading), or null when the body has no such section. */
export function getSection(body, heading) {
  const s = conceptParts(body).sections.find((x) => sameHeading(x.heading, heading));
  return s ? s.text : null;
}

/** True for a record in the older one-fact format: a body with no "##" section. */
export function isOneFact(body) {
  return ranges(body).sections.length === 0;
}

function finish(lines) {
  return `${trimBlank(lines).join('\n')}\n`;
}

/**
 * One section of a body changed; every other line stays as it was.
 * mode:
 *   'set'     add the section at the end, or replace the text of the section with that heading
 *   'append'  add the section, or add the text at the end of the section with that heading
 *   'remove'  take the section with that heading out
 * Returns { body, action: 'added'|'replaced'|'appended'|'removed'|'unchanged', heading, previous }
 * where heading is the heading as the body writes it and previous is the old
 * section text (null when the section is new). Throws INVALID for 'remove'
 * when there is no such section.
 */
export function spliceSection(body, heading, content, { mode = 'set' } = {}) {
  const { lines, sections } = ranges(body);
  const found = sections.find((s) => sameHeading(s.heading, heading));
  const text = String(content ?? '').replace(/\r\n/g, '\n').replace(/\s+$/, '');
  const contentLines = text ? text.split('\n') : [];
  if (mode === 'remove') {
    if (!found) {
      throw new ToolkitError(EXIT.INVALID, `There is no section "${heading}" to remove.`, { heading, sections: sections.map((s) => s.heading) });
    }
    const previous = trimBlank(lines.slice(found.start + 1, found.end)).join('\n');
    const next = [...lines.slice(0, found.start), ...lines.slice(found.end)];
    return { body: finish(next), action: 'removed', heading: found.heading, previous };
  }
  if (!found) {
    const h = String(heading).replace(/\s+/g, ' ').trim();
    // A new fact goes before the concept's Gotchas and lessons section, which stays last.
    const lessons = sameHeading(h, LESSONS_HEADING) ? null : sections.find((x) => sameHeading(x.heading, LESSONS_HEADING));
    if (lessons) {
      const next = [...trimBlank(lines.slice(0, lessons.start)), '', `## ${h}`, '', ...contentLines, '', ...lines.slice(lessons.start)];
      return { body: finish(next), action: 'added', heading: h, previous: null };
    }
    const next = [...trimBlank(lines), '', `## ${h}`, '', ...contentLines];
    return { body: finish(next), action: 'added', heading: h, previous: null };
  }
  const own = lines.slice(found.start + 1, found.end);
  const previous = trimBlank(own).join('\n');
  const after = lines.slice(found.end);
  const gap = after.length && after.some((l) => l.trim()) ? [''] : [];
  let block;
  let action;
  if (mode === 'append') {
    if (previous && previous === text) return { body: finish(lines), action: 'unchanged', heading: found.heading, previous };
    // A Gotchas and lessons section that says "None yet." takes the first lessons in its place.
    const empty = (t) => t.trim() === 'None yet.';
    if (sameHeading(found.heading, LESSONS_HEADING) && empty(text) && previous) return { body: finish(lines), action: 'unchanged', heading: found.heading, previous };
    block = previous && !(sameHeading(found.heading, LESSONS_HEADING) && empty(previous)) ? [...trimBlank(own), '', ...contentLines] : contentLines;
    action = 'appended';
  } else {
    if (previous === text) return { body: finish(lines), action: 'unchanged', heading: found.heading, previous };
    block = contentLines;
    action = 'replaced';
  }
  const next = [...lines.slice(0, found.start + 1), '', ...block, ...gap, ...after];
  return { body: finish(next), action, heading: found.heading, previous };
}

/**
 * The text given for one section, in the model's label format: a leading
 * "# " line, and a leading "## " line with the same heading, are dropped;
 * labels are written in bold ("## Why" -> "**Why:**"); the first paragraph
 * gets "**Remember:**" when no line has it. Throws INVALID when the text is
 * empty or holds a "#" or "##" heading of its own (one section at a time;
 * a "###" heading inside a section is fine).
 */
export function sectionText(text, heading, { remember = true } = {}) {
  let lines = String(text ?? '').replace(/\r\n/g, '\n').split('\n');
  lines = trimBlank(lines);
  if (lines.length && H1_RE.test(lines[0])) lines = trimBlank(lines.slice(1));
  if (lines.length) {
    const h = SECTION_RE.exec(lines[0]);
    if (h && sameHeading(h[1], heading)) lines = trimBlank(lines.slice(1));
  }
  const labelled = modelLabels(lines.join('\n'));
  const own = [];
  let fence = null;
  for (const line of labelled.split('\n')) {
    const f = FENCE_RE.exec(line);
    if (fence) {
      if (f && f[1][0] === fence[0] && f[1].length >= fence.length) fence = null;
      continue;
    }
    if (f) {
      fence = f[1];
      continue;
    }
    if (H1_RE.test(line) || SECTION_RE.test(line)) own.push(line.trim());
  }
  if (own.length) {
    throw new ToolkitError(EXIT.INVALID, `The text for the section "${heading}" holds its own heading: ${own.join(', ')}. Save one section at a time: give each one with its own --section, or write a heading inside a section as "### ...".`, {
      heading,
      headings: own,
    });
  }
  // topicBody puts "**Remember:**" before the first paragraph when no line has
  // a Remember label. remember: false leaves it out: text appended under a
  // section that already has its Remember label (verifier, 2026-09-28: --append
  // wrote a second one).
  const shaped = remember
    ? topicBody(`# x\n\n${labelled}`, { name: 'x' }).replace(/^# x\n+/, '').replace(/\s+$/, '')
    : topicBody(`# x\n\n**Remember:** x\n\n${labelled}`, { name: 'x' }).replace(/^# x\n+\*\*Remember:\*\* x\n+/, '').replace(/\s+$/, '');
  if (!shaped.trim()) {
    throw new ToolkitError(EXIT.INVALID, `The text for the section "${heading}" is empty. Give the fact with --body or --body-file.`, { heading });
  }
  return shaped;
}

const HEADING_TAIL = new Set(['a', 'an', 'the', 'of', 'with', 'to', 'for', 'in', 'on', 'and', 'or', 'by', 'at', 'from', 'as', 'that', 'is', 'are', 'be', 'so']);

/**
 * A section heading of a few words for a fact written as a sentence
 * (close-out 2026-09-28, finding 6: "Venmo rejects payments with a fraction of
 * a cent, so every split share must be a whole-cent amount" became a heading).
 * The first clause (before a comma, semicolon, colon, or dash), at most seven
 * words, without a closing article or preposition, and without its full stop.
 */
export function shortHeading(sentence) {
  const text = String(sentence ?? '').replace(/\s+/g, ' ').trim().replace(/[.!?]+$/, '');
  const clause = text.split(/\s*(?:[,;:]|\s[-–—]\s|\bso\b|\bbecause\b|\bwhich\b)\s*/i)[0] || text;
  let words = clause.split(' ').filter(Boolean).slice(0, 7);
  while (words.length > 2 && HEADING_TAIL.has(words[words.length - 1].toLowerCase())) words = words.slice(0, -1);
  const h = words.join(' ').replace(/[.!?,;:]+$/, '');
  return h ? h[0].toUpperCase() + h.slice(1) : text.slice(0, 60);
}

/** Check a section heading given with --section: one line, not empty, no "#" of its own. */
export function assertHeading(heading) {
  const h = String(heading ?? '').replace(/\s+/g, ' ').trim().replace(/^#+\s*/, '');
  if (!h) throw new ToolkitError(EXIT.INVALID, 'Give the section heading with --section, for example --section \'Deploy window\'.');
  if (h.length > 120) throw new ToolkitError(EXIT.INVALID, `The section heading is ${h.length} characters; keep it under 120.`);
  if (/^(remember|why|how to apply|evidence and limits|related memories|related|authoritative records)$/i.test(h)) {
    throw new ToolkitError(EXIT.INVALID, `"${h}" is one of the labels inside a section, not a sub-topic. Name the sub-topic, for example --section 'Deploy window'.`);
  }
  return h;
}

/** A body with its "# " title line set (replaced, or added at the top). */
export function withBodyTitle(body, title) {
  const t = String(title ?? '').replace(/\s+/g, ' ').trim();
  if (!t) return body;
  const lines = String(body ?? '').replace(/\r\n/g, '\n').split('\n');
  const at = lines.findIndex((l) => H1_RE.test(l));
  if (at === -1) return finish([`# ${t}`, '', ...trimBlank(lines)]);
  lines[at] = `# ${t}`;
  return finish(lines);
}

/** The body of a new concept: its title, then one section, then the Gotchas and lessons section (left out with { lessons: false }, for an event). */
export function newConceptBody(title, heading, content, { lessons = true } = {}) {
  const body = `# ${String(title).replace(/\s+/g, ' ').trim()}\n\n## ${heading}\n\n${String(content).replace(/\s+$/, '')}\n`;
  return lessons ? withLessonsSection(body) : body;
}

/**
 * A concept body with its "## Gotchas and lessons" section (the model's topic
 * template), added at the end with "None yet." when it is missing. A body
 * with no "## " section (an older one-fact record) is left as it is.
 */
export function withLessonsSection(body) {
  const text = String(body ?? '');
  const { sections } = ranges(text);
  if (!sections.length || sections.some((x) => sameHeading(x.heading, LESSONS_HEADING))) return text;
  return finish([...trimBlank(text.replace(/\r\n/g, '\n').split('\n')), '', `## ${LESSONS_HEADING}`, '', 'None yet.']);
}

/**
 * One section changed in a record's stored text, and the frontmatter fields
 * that go with it. edit = { heading, content, mode ('set'|'append'|'remove'),
 * day, title?, fields?, note?, dropUnapproved?, body? } (note: the section's
 * approval note, added to its Evidence line; dropUnapproved: take out an
 * earlier "no approval recorded" note first; body: the whole new body instead of one
 * section, for merge, split, and an approved proposal) where fields sets frontmatter keys (description,
 * authorization, last_verified, status, ...; undefined leaves one as it is).
 * `updated` is set to day. Every line the edit does not change keeps its
 * exact text. Returns { text, action, heading, previous }.
 */
export function editConceptText(text, key, edit) {
  let parsed;
  try {
    parsed = parseFrontmatter(text);
  } catch (err) {
    throw new ToolkitError(EXIT.INVALID, `The memory record ${key} has frontmatter that cannot be read, so the section was not saved: ${err.message}`, {
      key,
      fix: `Read it with toolkit memory get ${key} --json, correct it, and save it again with --expect <version>.`,
    });
  }
  if (!parsed.hasFrontmatter) {
    throw new ToolkitError(EXIT.INVALID, `The memory record ${key} has no frontmatter, so the section was not saved.`, { key });
  }
  // edit.body: the whole new body (merge, split, an approved proposal); otherwise one section changes.
  let body = edit.body !== undefined ? edit.body : parsed.body;
  let res = { action: edit.body !== undefined ? 'changed' : 'unchanged', heading: edit.heading, previous: null };
  if (edit.heading && edit.body === undefined) {
    res = spliceSection(body, edit.heading, edit.content, { mode: edit.mode || 'set' });
    body = res.body;
    // The section's own approval note (approvalNote in contract.mjs), when it
    // differs from the concept's; the concept's authorization is not changed.
    if (res.action !== 'removed' && (edit.note || edit.dropUnapproved)) {
      const own = getSection(body, res.heading);
      const noted = addEvidenceNote(own, edit.note, { dropUnapproved: edit.dropUnapproved === true });
      if (noted !== own) {
        body = spliceSection(body, res.heading, noted, { mode: 'set' }).body;
        if (res.action === 'unchanged') res = { ...res, action: 'replaced' };
      }
    }
  }
  if (edit.title) body = withBodyTitle(body, edit.title);
  // A blank line between the frontmatter and the title, as serializeRecord writes it.
  if (!/^\n/.test(body)) body = `\n${body}`;
  const data = parsed.data;
  for (const [k, v] of Object.entries(edit.fields || {})) {
    if (v === undefined) continue;
    if (v === null) delete data[k];
    else data[k] = v;
  }
  setUpdated(data, edit.day);
  return { text: stringifyFrontmatter(data, body), action: res.action, heading: res.heading, previous: res.previous };
}

/**
 * Change one stored record through its driver: read it, check --expect, let
 * fn(stored) give the new stored text, check the new text against the record
 * rules, and write it. A driver with its own editRecord (the built-in driver,
 * which holds its lock for the whole change) does all of it itself. Otherwise
 * the record is read with get() and saved with save() and the version just
 * read, so a change made in between is refused, never lost.
 * fn(stored) -> { text, ...anything the caller wants back }.
 * Returns { key, version, created: false, record, ...what fn gave }.
 */
export async function editRecordWith(driver, key, fn, { expect } = {}) {
  if (typeof driver.editRecord === 'function') return driver.editRecord(key, fn, { expect });
  // Without the caller's --expect, a change another writer made between the
  // read and the write is not an error: read again and redo the change on it.
  for (let attempt = 0; ; attempt++) {
    const current = await driver.get(key);
    if (!current) {
      throw new ToolkitError(EXIT.ERROR, `There is no memory record with the key ${key}.`, { key, fix: 'Run toolkit memory list to see the keys.' });
    }
    checkExpect(current.version, expect, `The memory record ${key}`);
    const out = fn(current);
    const record = assertEditedText(out.text, key);
    record.saved = record.updated || record.saved;
    try {
      const res = await driver.save(record, { expect: current.version });
      const { text: _text, ...rest } = out;
      return { ...rest, ...res, created: false };
    } catch (err) {
      const stale = err && err.code === EXIT.INVALID && err.details && err.details.expected === current.version;
      if (!stale || expect !== undefined || attempt >= 2) throw err;
    }
  }
}

/** Check new stored text against the record rules before a driver writes it. Returns the parsed record. */
export function assertEditedText(text, key) {
  const { record, problems } = parseRecord(text, key);
  const fatal = problems.filter((p) => p.startsWith('it has no frontmatter') || p.startsWith('its frontmatter cannot be read'));
  if (fatal.length) throw new ToolkitError(EXIT.INVALID, `The memory record ${key} was not saved. ${fatal.join(' ')}`, { key, problems: fatal });
  assertValidRecord(record);
  return record;
}

// ---------------------------------------------------------------- which concept a fact belongs to

/** Words that say nothing about which concept a fact belongs to. */
const GENERIC = new Set([
  'agent', 'agents', 'owner', 'project', 'memory', 'record', 'note', 'thing', 'things', 'use', 'make', 'need', 'want',
  'work', 'always', 'never', 'fact', 'one', 'two', 'time', 'day', 'way', 'first', 'last', 'new', 'old', 'good', 'best',
  'each', 'every', 'all', 'only', 'more', 'less', 'same', 'other', 'get', 'set', 'run', 'keep', 'say', 'said',
  // Every concept has a "Gotchas and lessons" section, so its words say nothing about which one.
  'gotcha', 'gotchas', 'lesson', 'lessons', 'none', 'yet', 'seen',
]);

function conceptStems(text, ignore) {
  return stems(searchTerms(text).filter((w) => !GENERIC.has(w) && !ignore.has(w)));
}

/** The words of a key's slug: 'project_billing_cycle' -> 'billing cycle'. */
function slugWords(key) {
  return String(key ?? '').replace(/^[a-z]+_/, '').replace(/[_-]+/g, ' ');
}

/**
 * How well a fact's words match one concept: each of the fact's stems found in
 * the concept's key, title, or a section heading counts 2; found only in its
 * summary or a section's Remember line counts 1. Returns { score, shared }.
 */
export function conceptScore(candidateStems, concept, { headings = [], points = '', ignore = new Set() } = {}) {
  const named = new Set(conceptStems(`${slugWords(concept.key)} ${concept.title || ''}`, ignore));
  const strong = new Set([...named, ...conceptStems(headings.join(' '), ignore)]);
  const weak = new Set(conceptStems(`${concept.description || ''} ${points}`, ignore));
  let score = 0;
  const shared = [];
  const inName = [];
  for (const s of new Set(candidateStems)) {
    if (strong.has(s)) {
      score += 2;
      shared.push(s);
      if (named.has(s)) inName.push(s);
    } else if (weak.has(s)) {
      score += 1;
      shared.push(s);
    }
  }
  return { score, shared, inName };
}

/**
 * A concept is suggested only when a fact shares at least two words with it,
 * at least one of them in its key or title, and the score reaches SUGGEST_AT
 * (close-out 2026-09-28, C1: one shared word in a title or a section heading
 * put a note about status replies into an unrelated output-format concept).
 */
export const SUGGEST_AT = 3;
export const SUGGEST_MIN_SHARED = 2;

/** True when a conceptScore result is enough to suggest that concept. */
export function suggests(result) {
  return Boolean(result) && result.score >= SUGGEST_AT && result.shared.length >= SUGGEST_MIN_SHARED && result.inName.length >= 1;
}
const DEEP_READS = 4;
/** A type with this many concepts or fewer is read whole when a new fact is matched. */
const READ_ALL = 12;

/**
 * The existing concept a new fact belongs to, or null (the duplicate check in
 * `toolkit memory save`: "this belongs in concept X"). candidate = { key,
 * type, name, description, heading? }. Only a concept of the same type is
 * suggested (the prefix is the type), never an event (an event_ record holds
 * one episode), a proposal, or a retired record. ignore: words never counted
 * (the owner's name). Returns { key, title, description, score, shared,
 * heading } where heading is the section whose heading shares the most words
 * with the fact, or null.
 */
export async function suggestConcept(driver, candidate, { ignore = [] } = {}) {
  if (!candidate || candidate.type === 'event' || !RECORD_TYPES.includes(candidate.type)) return null;
  const skip = new Set([candidate.key, ...(candidate.skip || [])]);
  const ign = new Set(ignore.flatMap((w) => searchTerms(w)));
  const text = `${slugWords(candidate.key || '')} ${String(candidate.name || '').replace(/[-_]+/g, ' ')} ${candidate.description || ''} ${candidate.heading || ''}`;
  const words = conceptStems(text, ign);
  if (!words.length) return null;
  // Shared words are shown as the fact wrote them, not as stems ("replies", not "rep").
  const written = searchTerms(text);
  const shown = (list) => list.map((st) => written.find((w) => stems([w])[0] === st) || st);
  let summaries;
  try {
    summaries = await driver.list({ type: candidate.type });
  } catch {
    return null;
  }
  const pool = summaries.filter((s) => !skip.has(s.key) && s.type === candidate.type && s.status !== 'retired' && !(s.proposal || isProposal(s)));
  // First by key, title, and summary (and the section headings a backend keeps
  // in its list, as Hindsight does); then the best few are read whole, so
  // their section headings and Remember lines count too. Built-in memory
  // reads a small memory whole (local files; a fact may match only a section
  // heading). Hindsight and Notion read at most DEEP_READS records, because
  // each read is a network call and the Stop hook's save has a deadline.
  const ranked = pool
    .map((s) => ({ s, ...conceptScore(words, s, { headings: s.sections ? String(s.sections).split(' | ') : [], ignore: ign }) }))
    .sort((a, b) => b.score - a.score || (a.s.key < b.s.key ? -1 : 1));
  const local = driver.backend === 'builtin';
  const first = local && pool.length <= READ_ALL
    ? ranked
    : ranked.filter((x) => x.score > 0 || pool.length <= DEEP_READS).slice(0, DEEP_READS);
  let best = null;
  for (const x of first) {
    let rec = null;
    try {
      rec = await driver.get(x.s.key);
    } catch {
      rec = null;
    }
    const parts = rec ? conceptParts(rec.body) : { sections: [] };
    const headings = parts.sections.map((p) => p.heading);
    const points = parts.sections.map((p) => rememberText(p.text)).join(' ');
    const full = conceptScore(words, { ...x.s, title: (rec && bodyTitle(rec.body)) || x.s.title }, { headings, points, ignore: ign });
    if (!suggests(full)) continue;
    if (best && (full.score < best.score || (full.score === best.score && best.key < x.s.key))) continue;
    // The section to add the fact under: the heading that shares the most
    // words with it; a tie goes to the section whose text shares more, and a
    // tie after that names no section (verifier, 2026-09-28: a refund fact
    // was pointed at "Invoice run", the first of two tied headings, although
    // a "Refunds" section existed).
    let heading = null;
    let top = [0, 0];
    let tied = false;
    for (const p of parts.sections) {
      const n = new Set(conceptStems(p.heading, ign).filter((w) => words.includes(w))).size;
      if (!n) continue;
      const inText = new Set(conceptStems(p.text, ign).filter((w) => words.includes(w))).size;
      if (n > top[0] || (n === top[0] && inText > top[1])) {
        top = [n, inText];
        heading = p.heading;
        tied = false;
      } else if (n === top[0] && inText === top[1]) {
        tied = true;
      }
    }
    if (tied) heading = null;
    best = {
      key: x.s.key,
      title: (rec && bodyTitle(rec.body)) || x.s.title || titleFromName(x.s.name),
      description: x.s.description,
      score: full.score,
      shared: shown(full.shared),
      heading,
    };
  }
  return best;
}

/** The text of a section's "**Remember:**" paragraph, or the whole text when it has none. */
export function rememberText(text) {
  const m = /^\s*\*\*Remember:\*\*([\s\S]*?)(?=^\s*\*\*[^*\n]+:\*\*|^#{1,6}\s|(?![\s\S]))/m.exec(String(text ?? ''));
  return (m ? m[1] : String(text ?? '')).replace(/\s+/g, ' ').trim();
}

// ---------------------------------------------------------------- merging records into a concept

/** A dated status line under a title ("**Superseded 2026-09-28:** ..."): history, not a fact. */
const STATUS_LINE_RE = /^\s*\*\*(Superseded|Archived|Restored) \d{4}-\d{2}-\d{2}:\*\*/;

/**
 * The sections one record brings into a concept: [{ heading, text }]. A
 * one-fact record becomes one section under its title (its lead text, less
 * any dated status line); a concept record brings its lead text (when it has
 * any) under its title, then each of its sections. When a section has no
 * "**Evidence and limits:**" line, one is added from the record's source, so
 * where each fact came from is kept.
 */
export function recordSections(record) {
  const parts = conceptParts(record.body);
  const title = parts.title || titleFromName(record.name);
  const out = [];
  const lead = parts.lead.split('\n').filter((l) => !STATUS_LINE_RE.test(l)).join('\n').trim();
  if (lead) out.push({ heading: title, text: lead });
  for (const s of parts.sections) out.push({ heading: s.heading, text: s.text });
  const source = String(record.source || '').trim();
  return out.map((s) => {
    let text = s.text;
    if (source && !/\*\*Evidence and limits:\*\*/.test(text)) text = withEvidence(text, `${source.replace(/[.\s]+$/, '')}.`);
    // approvalNote: the record's own approval, when the concept it joins has
    // another one (a section that already records its approval keeps it).
    if (record.approvalNote && !hasApprovalNote(text)) text = addEvidenceNote(text, record.approvalNote);
    return text === s.text ? s : { ...s, text };
  });
}

/**
 * A section's text with an "**Evidence and limits:**" line added in the
 * template's place: before "**Related memories:**" or "**Authoritative
 * records:**" when the text has one, else at the end.
 */
export function withEvidence(text, evidence) {
  const lines = String(text ?? '').replace(/\s+$/, '').split('\n');
  const at = lines.findIndex((l) => /^\s*\*\*(Related memories|Related|Authoritative records):\*\*/.test(l));
  const line = `**Evidence and limits:** ${evidence}`;
  if (at === -1) return `${lines.join('\n')}\n\n${line}`;
  const before = lines.slice(0, at);
  while (before.length && !before[before.length - 1].trim()) before.pop();
  return [...before, '', line, '', ...lines.slice(at)].join('\n');
}

const EVIDENCE_LINE_RE = /^\s*\*\*Evidence and limits:\*\*/;
const LABEL_START_RE = /^\s*\*\*[^*\n]+:\*\*/;

/** True when a section's text already records its own approval (approvalNote in contract.mjs, or an approved hook proposal). */
export function hasApprovalNote(text) {
  return /\bApproved by .+? on \d{4}-\d{2}-\d{2}\b|with no approval recorded\b|\bapproved it on \d{4}-\d{2}-\d{2}\b/i.test(String(text ?? ''));
}

/**
 * A section's text with an approval note (approvalNote in contract.mjs) at
 * the end of its last "**Evidence and limits:**" paragraph, or on a new
 * Evidence line when it has none. dropUnapproved: take out any "Saved on
 * <date> with no approval recorded." first (a replaced section's new text is
 * approved as a whole). With no note, only that is done.
 */
export function addEvidenceNote(text, note, { dropUnapproved = false } = {}) {
  let lines = String(text ?? '').replace(/\s+$/, '').split('\n');
  if (dropUnapproved) {
    lines = lines.map((l) => l.replace(UNAPPROVED_NOTE_RE, ''));
    // An Evidence line that held only that note goes too, unless the new note takes its place.
    if (!note) {
      const out = [];
      for (const l of lines) {
        if (/^\s*\*\*Evidence and limits:\*\*\s*$/.test(l)) {
          while (out.length && !out[out.length - 1].trim()) out.pop();
          continue;
        }
        out.push(l);
      }
      lines = out;
    }
  }
  if (!note) return lines.join('\n').replace(/\n{3,}/g, '\n\n');
  let at = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (EVIDENCE_LINE_RE.test(lines[i])) {
      at = i;
      break;
    }
  }
  if (at === -1) return withEvidence(lines.join('\n'), note);
  let end = at;
  while (end + 1 < lines.length && lines[end + 1].trim() && !LABEL_START_RE.test(lines[end + 1]) && !/^#{1,6}\s/.test(lines[end + 1])) end++;
  lines[end] = `${lines[end].replace(/\s+$/, '')} ${note}`;
  return lines.join('\n');
}

/**
 * The body of a concept after other records are merged in. Each member's
 * sections are added; a heading the concept already has gets the text
 * appended under it. Returns { body, placed: [{ key, heading, action }] }
 * (heading: the section of the concept each member's first section went to).
 */
export function mergeSections(conceptBody, members) {
  let body = conceptBody;
  const placed = [];
  for (const m of members) {
    let first = null;
    for (const s of recordSections(m)) {
      const res = spliceSection(body, s.heading, s.text, { mode: 'append' });
      body = res.body;
      if (!first) first = { key: m.key, heading: res.heading, action: res.action };
    }
    placed.push(first || { key: m.key, heading: null, action: 'unchanged' });
  }
  return { body, placed };
}

/**
 * Links in a concept's body that point at records now merged into it, pointed
 * at the concept's own section instead ("[deploy window](project_deploy_window.md)"
 * -> "[deploy window](project_release.md#Deploy%20window)"). placed: what
 * mergeSections gave, one entry per member, in the same order.
 */
export function retargetLinks(body, members, intoKey, placed) {
  let text = body;
  members.forEach((m, i) => {
    const heading = placed[i] && placed[i].heading;
    text = repairLinks(text, '', {
      kind: 'supersede', from: m.key, to: intoKey, fromPath: `${m.key}.md`, toPath: `${intoKey}.md`, anchor: heading ? headingAnchor(heading) : '',
    }).text;
  });
  return text;
}

/** The oldest of some last_verified dates, or 'unknown' when any is unknown or missing. */
export function oldestDate(dates) {
  const list = dates.map((d) => String(d ?? '').trim());
  if (!list.length || list.some((d) => !/^\d{4}-\d{2}-\d{2}$/.test(d))) return 'unknown';
  return list.sort()[0];
}

// ---------------------------------------------------------------- tidy plan

/** The default concept for one-fact user_ records that share no subject word. */
export const DEFAULT_CONCEPTS = Object.freeze({
  user: { key: 'user_profile', title: 'Profile' },
});

/** A one-line summary for a new concept made from records: its title, then their descriptions. */
export function draftDescription(title, members) {
  const text = `${title}: ${members.map((m) => String(m.description || '').replace(/[.\s]+$/, '')).filter(Boolean).join('; ')}`;
  if (text.length <= DESCRIPTION_MAX) return text;
  const cut = text.slice(0, DESCRIPTION_MAX - 3).replace(/[;,\s]+\S*$/, '');
  return `${cut}...`;
}

/**
 * The tidy plan for concept memory (toolkit memory tidy --plan; the owner
 * says yes before anything changes). records: every stored record, with
 * bodies. Returns:
 *   merges  [{ into, exists, type, title, description, members: [{ key, title, description }] }]
 *           one-fact records (no "##" section; never an event, a proposal, or a
 *           retired record) to merge into a concept: an existing concept of the
 *           same type whose words they match (suggestConcept's scoring), or a
 *           new concept for two or more that share a subject word in their key
 *           or title. user_ records that share nothing go to user_profile
 *           when there are two or more. feedback_ records are left out: memory-tidy
 *           moves them out of memory (rules and concepts).
 *   stay    [{ key, why }] one-fact records left as they are
 *   large   [{ key, title, lines, sections }] concepts over CONCEPT_MAX_LINES
 *           lines or CONCEPT_MAX_SECTIONS sections: candidates to split
 * ignore: words never counted (the owner's name).
 */
export function planTidy(records, { ignore = [] } = {}) {
  const ign = new Set(ignore.flatMap((w) => searchTerms(w)));
  // feedback_ records are not merged: they move out of memory (memory-tidy's migration step).
  const live = records.filter((r) => r && r.status !== 'retired' && !isProposal(r) && RECORD_TYPES.includes(r.type) && r.type !== 'feedback');
  const concepts = live.filter((r) => r.type !== 'event' && !isOneFact(r.body));
  const facts = live.filter((r) => r.type !== 'event' && isOneFact(r.body));
  const titleOf = (r) => bodyTitle(r.body) || titleFromName(r.name);
  const large = [];
  for (const r of live) {
    const lines = String(r.body || '').split('\n').length;
    const n = sectionHeadings(r.body).length;
    if (lines > CONCEPT_MAX_LINES || n > CONCEPT_MAX_SECTIONS) large.push({ key: r.key, title: titleOf(r), lines, sections: n });
  }
  const merges = new Map();
  const add = (into, info, member) => {
    if (!merges.has(into)) merges.set(into, { into, ...info, members: [] });
    const list = merges.get(into).members;
    list.push({ key: member.key, title: titleOf(member), description: member.description || '' });
    list.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
  };
  // 1. Into an existing concept whose words the fact matches.
  const left = [];
  for (const f of facts) {
    const words = conceptStems(`${slugWords(f.key)} ${titleOf(f)} ${f.description || ''}`, ign);
    let best = null;
    for (const c of concepts.filter((x) => x.type === f.type)) {
      const parts = conceptParts(c.body);
      const s = conceptScore(words, { key: c.key, title: titleOf(c), description: c.description }, {
        headings: parts.sections.map((p) => p.heading),
        points: parts.sections.map((p) => rememberText(p.text)).join(' '),
        ignore: ign,
      });
      if (suggests(s) && (!best || s.score > best.score)) best = { c, score: s.score };
    }
    if (best) add(best.c.key, { exists: true, type: best.c.type, title: titleOf(best.c), description: best.c.description }, f);
    else left.push(f);
  }
  // 2. New concepts: facts of one type that share a subject word in their key or title.
  const byType = new Map();
  for (const f of left) {
    if (!byType.has(f.type)) byType.set(f.type, []);
    byType.get(f.type).push(f);
  }
  const stay = [];
  const existingKeys = new Set(records.map((r) => r.key));
  for (const [type, list] of byType) {
    const topic = list.map((f) => conceptStems(`${slugWords(f.key)} ${titleOf(f)}`, ign));
    const parent = list.map((_, i) => i);
    const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        if (topic[i].some((w) => topic[j].includes(w))) parent[find(j)] = find(i);
      }
    }
    const groups = new Map();
    list.forEach((f, i) => {
      const root = find(i);
      if (!groups.has(root)) groups.set(root, []);
      groups.get(root).push(i);
    });
    const singles = [];
    for (const idx of groups.values()) {
      if (idx.length < 2) {
        singles.push(list[idx[0]]);
        continue;
      }
      // The concept is named for the subject word most of the group shares, as written in their keys.
      const count = new Map();
      for (const i of idx) for (const w of new Set(topic[i])) count.set(w, (count.get(w) || 0) + 1);
      const top = [...count.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))[0][0];
      const word = idx.flatMap((i) => slugWords(list[i].key).split(' ')).find((w) => stems([w])[0] === top) || top;
      let into = `${type}_${word.replace(/[^a-z0-9]+/g, '_')}`;
      if (existingKeys.has(into) && !idx.some((i) => list[i].key === into)) into = `${into}_notes`;
      const members = idx.map((i) => list[i]);
      const title = titleFromName(word);
      const exists = members.some((m) => m.key === into);
      for (const m of members) if (m.key !== into) add(into, { exists, type, title, description: draftDescription(title, members) }, m);
    }
    const fallback = DEFAULT_CONCEPTS[type];
    if (fallback && singles.length >= 2) {
      const exists = existingKeys.has(fallback.key);
      for (const m of singles) if (m.key !== fallback.key) add(fallback.key, { exists, type, title: fallback.title, description: draftDescription(fallback.title, singles) }, m);
    } else {
      for (const m of singles) stay.push({ key: m.key, why: 'no other record shares its subject; it stays a concept of its own' });
    }
  }
  const list = [...merges.values()].filter((m) => m.members.length).sort((a, b) => RECORD_TYPES.indexOf(a.type) - RECORD_TYPES.indexOf(b.type) || (a.into < b.into ? -1 : 1));
  const events = live.filter((r) => r.type === 'event').map((r) => ({ key: r.key, why: 'an event stays its own file' }));
  return { merges: list, stay: [...stay, ...events], large };
}

/** The version of stored text (re-exported for callers that build text themselves). */
export { versionOf, headingAnchor };
