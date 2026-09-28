// The Stop hook's memory proposal (Mike, 2026-09-27, "Memory additions" 1;
// final review I5; goal adjustment 2 of 2026-09-28): an unanswered
// "Save to memory: <summary>?" must not depend on the agent remembering to
// save it. Both hosts give the Stop hook the turn's last assistant message
// (`last_assistant_message`: ai-external-knowledge/claude-code/hooks.md,
// "Stop input"; ai-external-knowledge/codex/hooks.md, "Stop"). When that
// message asks "Save to memory: <summary>?" and no proposal was saved this
// turn, the hook saves one itself with `toolkit memory save --proposal`: the
// same command, the same duplicate and secret checks, the same record format.
// The owner's yes is then `toolkit memory approve <key> --by <name>`, which
// also takes out the body's "Do not rely on this" words
// (lib/memory/proposals.mjs approvedProposalBody); his no is
// `toolkit memory reject <key>`. A summary is proposed once per session; the
// duplicate check stops a second record with the same meaning later.
//
// The question the skills ask is exactly "Save to memory: <one line>?". Bold
// or quote marks around it are allowed, also before the colon
// ("**Save to memory**: X?"), and so is "Save to project memory: X?". A
// question that only reports an earlier one ('Earlier I asked "Save to
// memory: X?" and you said yes') is not a new question.
//
// Other wording (verifier, 2026-09-28: 3 of 4 questions in the live runs, such
// as "Save it to memory?" and "Do you want X saved as a standing
// preference?") has no one-line summary to save. looseQuestion() finds it, and
// the Stop hook then asks the agent once to use the exact form or save the
// proposal itself.

import { searchTerms } from '../memory/contract.mjs';
import { HOOK_PROPOSAL_EVIDENCE, HOOK_PROPOSAL_WAIT } from '../memory/proposals.mjs';
import { ownerWording } from '../memory/owner-wording.mjs';

export { ownerWording };

const QUESTION = /save\s+to\s+(?:(?:the\s+)?project(?:'s|’s)?\s+)?memory\s*[*_]*\s*:\s*[*_]*\s*(.+?)\s*\?/gi;
/** Other ways of asking to save something to memory, each ending at its question mark in the same sentence. */
const LOOSE = /\bsav(?:e|ed|ing)\b[^?\n.!]{0,80}\bmemory\b[^?\n.!]*\?|\bsaved\s+as\s+an?\s+(?:standing\s+|lasting\s+|permanent\s+)?(?:preference|rule|fact)\b[^?\n.!]*\?/gi;
/** Words in the same sentence, before the question, that show it reports an earlier question or a save that happened. */
const REPORTED = /\b(?:(?:I|we)\s+(?:already\s+|earlier\s+)?asked|earlier|previously|you\s+(?:said|answered|approved|agreed)|(?:was|were|been|is|are|I|I've|I\s+have|already)\s+(?:saved|approved|recorded|stored))\b/i;
const WRAP = /^[\s"'“”‘’`*_]+|[\s"'“”‘’`*_.]+$/g;
const MAX_PER_TURN = 3;
const NAME_MAX = 50;
const DESCRIPTION_MAX = 150;

/** The text of the sentence before a position: from the last sentence end or line break. */
function sentenceBefore(text, index) {
  const before = text.slice(Math.max(0, index - 300), index);
  const cut = Math.max(before.lastIndexOf('\n'), before.lastIndexOf('. '), before.lastIndexOf('! '), before.lastIndexOf('? '));
  return cut >= 0 ? before.slice(cut + 1) : before;
}

/** True when a question at this position only reports an earlier question or a save that happened. */
export function reportedAt(text, index) {
  return REPORTED.test(sentenceBefore(text, index));
}

/** The summaries of the "Save to memory: <summary>?" questions in a message, in order, without repeats. */
export function proposalQuestions(message) {
  const text = String(message ?? '');
  const out = [];
  QUESTION.lastIndex = 0;
  let m;
  while ((m = QUESTION.exec(text)) !== null) {
    if (reportedAt(text, m.index)) continue;
    const summary = m[1].replace(/\s+/g, ' ').replace(WRAP, '').trim();
    if (searchTerms(summary).length < 2) continue;
    if (!out.some((s) => normalizeSummary(s) === normalizeSummary(summary))) out.push(summary);
    if (out.length >= MAX_PER_TURN) break;
  }
  return out;
}

/**
 * The first question in a message that asks to save something to memory in
 * other words than "Save to memory: <one line>?" (for example "Save it to
 * memory?"), or null. A message with an exact-form question has none.
 */
export function looseQuestion(message) {
  const text = String(message ?? '');
  QUESTION.lastIndex = 0;
  if (QUESTION.test(text)) {
    QUESTION.lastIndex = 0;
    return null;
  }
  QUESTION.lastIndex = 0;
  LOOSE.lastIndex = 0;
  let m;
  while ((m = LOOSE.exec(text)) !== null) {
    if (reportedAt(text, m.index)) continue;
    const q = m[0].replace(/\s+/g, ' ').trim();
    LOOSE.lastIndex = 0;
    return q;
  }
  LOOSE.lastIndex = 0;
  return null;
}

/** A summary reduced to its words, for "was this proposed already" checks. */
export function normalizeSummary(summary) {
  return String(summary ?? '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, ' ').trim();
}

/**
 * The record type for a proposal (the model's memory-criteria.md): a working
 * preference the owner stated is `user`; a correction to how the agent works
 * is `feedback`; anything else is `project`.
 */
export function proposalType(summary, ownerName) {
  const s = String(summary ?? '');
  const owner = String(ownerName ?? '').trim();
  const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const names = owner ? [owner, owner.split(/\s+/)[0]].map(esc).join('|') : null;
  const namesOwner = names && new RegExp(`\\b(?:${names})\\b`, 'i').test(s);
  // A preference the owner states is `user`, even when it is about working
  // with the agent (final confirmation round 1, Hindsight run: "For small
  // changes, Mike prefers working directly with the agent" was typed
  // feedback because "the agent" was checked first).
  const ownerSubject = `(?:${names ? `${names}|` : ''}the owner|you|he|she)`;
  if (new RegExp(`\\b${ownerSubject}\\s+(?:\\w+\\s+)?(?:prefers?|likes?|wants?|hates?|dislikes?)\\b`, 'i').test(s)
    && !/\b(?:you should|you must|stop doing)\b/i.test(s)) return 'user';
  if (/\b(?:the agent|agents?|you should|you must|stop doing|instead of)\b/i.test(s)) return 'feedback';
  if (namesOwner || /\b(?:the owner|prefers?|likes?|wants?)\b/i.test(s)) return 'user';
  return 'project';
}

/**
 * A record name (slug) from a summary: its search words joined by dashes, at
 * most 50 characters. The type word is left out, because the key starts with
 * the type (final confirmation round 1, Salesforce run:
 * project_sandbox_deploy_checks_project_usually_take_longer).
 */
export function proposalName(summary, type = null) {
  const skip = type ? String(type).toLowerCase() : null;
  const words = searchTerms(summary).map((w) => w.replace(/[^a-z0-9]/g, '')).filter((w) => w && w !== skip);
  let name = '';
  for (const w of words) {
    const next = name ? `${name}-${w}` : w;
    if (next.length > NAME_MAX) break;
    name = next;
  }
  return name || 'proposal';
}

/** One line of at most 150 characters, cut at a word. */
export function proposalDescription(summary) {
  const s = String(summary ?? '').replace(/\s+/g, ' ').trim();
  if (s.length <= DESCRIPTION_MAX) return s;
  const cut = s.slice(0, DESCRIPTION_MAX + 1).replace(/\s+\S*$/, '');
  return cut || s.slice(0, DESCRIPTION_MAX);
}

const TITLE_MAX = 100;

/**
 * The record title: the summary, or, when it is longer than 100 characters,
 * the summary up to its last comma, semicolon, or dash before that, else up
 * to its last whole word, with "..." to show it was cut (final confirmation
 * round 1, Hindsight run: the title was cut at 80 characters, in the middle
 * of "without helper agents").
 */
export function proposalTitle(summary) {
  const s = String(summary ?? '').replace(/\s+/g, ' ').trim().replace(/[.!?]+$/, '');
  if (s.length <= TITLE_MAX) return s;
  const head = s.slice(0, TITLE_MAX + 1);
  const clause = Math.max(head.lastIndexOf(', '), head.lastIndexOf('; '), head.lastIndexOf(' - '), head.lastIndexOf(' — '));
  if (clause >= 40) return s.slice(0, clause);
  return `${head.replace(/\s+\S*$/, '')}...`;
}

/**
 * The record body in the model's topic format. `asked` is the question's
 * own wording, quoted in the Evidence line; the rest uses `summary` (the
 * owner-named wording from ownerWording).
 */
export function proposalBody(summary, date, asked = summary) {
  const text = String(summary).replace(/\s+/g, ' ').trim();
  const point = /[.!?]$/.test(text) ? text : `${text}.`;
  const question = String(asked).replace(/\s+/g, ' ').trim();
  return [
    `# ${proposalTitle(text)}`,
    '',
    `**Remember:** ${point}`,
    '',
    '**Why:** Not stated by the owner.',
    '',
    `**How to apply:** Not stated by the owner. ${HOOK_PROPOSAL_WAIT}`,
    '',
    `**Evidence and limits:** On ${date} the agent asked the owner "Save to memory: ${question}?" and the turn ended with no answer, ${HOOK_PROPOSAL_EVIDENCE}`,
    '',
  ].join('\n');
}

/**
 * The toolkit memory save arguments for one proposal. The type is read from
 * the question's own wording; the name, description, and body use the
 * owner's name in place of a leading "you" (ownerWording).
 */
export function proposalArgs(summary, { ownerName, date, name } = {}) {
  const type = proposalType(summary, ownerName);
  const named = ownerWording(summary, ownerName);
  return [
    'memory', 'save',
    '--type', type,
    '--name', name || proposalName(named, type),
    '--description', proposalDescription(named),
    '--body', proposalBody(named, date, summary),
    '--source', `Agent question in a session, ${date}`,
    '--proposal',
    '--json',
  ];
}
