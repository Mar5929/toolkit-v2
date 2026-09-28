// The Stop hook's memory proposal (Mike, 2026-09-27, "Memory additions" 1;
// final review I5; goal adjustment 2 of 2026-09-28): an unanswered
// "Save to memory: <summary>?" must not depend on the agent remembering to
// save it. Both hosts give the Stop hook the turn's last assistant message
// (`last_assistant_message`: ai-external-knowledge/claude-code/hooks.md,
// "Stop input"; ai-external-knowledge/codex/hooks.md, "Stop"). When that
// message asks "Save to memory: <summary>?" and no proposal was saved this
// turn, the hook saves one itself with `toolkit memory save --proposal`: the
// same command, the same duplicate and secret checks, the same record format.
// The owner's yes is then `toolkit memory approve <key> --by <name>`, his no
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
  const namesOwner = owner && new RegExp(`\\b${owner.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(s);
  if (/\b(?:the agent|agents?|you should|you must|stop doing|instead of)\b/i.test(s)) return 'feedback';
  if (namesOwner || /\b(?:the owner|prefers?|likes?|wants?)\b/i.test(s)) return 'user';
  return 'project';
}

/** A record name (slug) from a summary: its search words joined by dashes, at most 50 characters. */
export function proposalName(summary) {
  const words = searchTerms(summary).map((w) => w.replace(/[^a-z0-9]/g, '')).filter(Boolean);
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

/** The record body in the model's topic format. */
export function proposalBody(summary, date) {
  const title = String(summary).replace(/\s+/g, ' ').trim();
  const point = /[.!?]$/.test(title) ? title : `${title}.`;
  return [
    `# ${title.length > 80 ? `${title.slice(0, 80).replace(/\s+\S*$/, '')}` : title}`,
    '',
    `**Remember:** ${point}`,
    '',
    '**Why:** Not stated by the owner.',
    '',
    '**How to apply:** Not stated by the owner. Do not rely on this until the owner approves it.',
    '',
    `**Evidence and limits:** On ${date} the agent asked the owner "Save to memory: ${title}?" and the turn ended with no answer, so the toolkit's Stop hook saved it as a proposal.`,
    '',
  ].join('\n');
}

/** The toolkit memory save arguments for one proposal. */
export function proposalArgs(summary, { ownerName, date, name } = {}) {
  return [
    'memory', 'save',
    '--type', proposalType(summary, ownerName),
    '--name', name || proposalName(summary),
    '--description', proposalDescription(summary),
    '--body', proposalBody(summary, date),
    '--source', `Agent question in a session, ${date}`,
    '--proposal',
    '--json',
  ];
}
