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

import { searchTerms, secretKind } from '../memory/contract.mjs';
import { HOOK_PROPOSAL_EVIDENCE, HOOK_PROPOSAL_WAIT } from '../memory/proposals.mjs';
import { ownerWording } from '../memory/owner-wording.mjs';
import { shortHeading } from '../memory/concepts.mjs';
import { ruleArea } from '../memory/lessons.mjs';
import { stems } from '../memory/similar.mjs';

export { ownerWording };

const QUESTION = /save\s+to\s+(?:(?:the\s+)?project(?:'s|’s)?\s+)?memory\s*[*_]*\s*:\s*[*_]*\s*(.+?)\s*\?/gi;
/**
 * The question memory-save asks for an instruction (Mike, 2026-09-29: an
 * instruction for how the agent works is a rule): "Add to the project rules:
 * <one line>?". Its proposal is always a rule proposal.
 */
const RULE_QUESTION = /add\s+(?:this\s+|that\s+|it\s+)?to\s+(?:the\s+|your\s+)?(?:project(?:'s|’s)?\s+)?rules\s*[*_]*\s*:\s*[*_]*\s*(.+?)\s*\?/gi;
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

/**
 * The summaries of the "Save to memory: <summary>?" and "Add to the project
 * rules: <summary>?" questions in a message, in order, without repeats. With
 * { withKind: true }: [{ summary, rule }] where rule is true for the rules form.
 */
export function proposalQuestions(message, { withKind = false } = {}) {
  const text = String(message ?? '');
  const found = [];
  for (const [re, rule] of [[QUESTION, false], [RULE_QUESTION, true]]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text)) !== null) {
      if (reportedAt(text, m.index)) continue;
      found.push({ at: m.index, summary: m[1].replace(/\s+/g, ' ').replace(WRAP, '').trim(), rule });
    }
    re.lastIndex = 0;
  }
  found.sort((a, b) => a.at - b.at);
  const out = [];
  for (const f of found) {
    if (searchTerms(f.summary).length < 2) continue;
    if (!out.some((s) => normalizeSummary(s.summary) === normalizeSummary(f.summary))) out.push({ summary: f.summary, rule: f.rule });
    if (out.length >= MAX_PER_TURN) break;
  }
  return withKind ? out : out.map((x) => x.summary);
}

/**
 * The first question in a message that asks to save something to memory in
 * other words than "Save to memory: <one line>?" (for example "Save it to
 * memory?"), or null. A message with an exact-form question has none.
 */
export function looseQuestion(message) {
  const text = String(message ?? '');
  QUESTION.lastIndex = 0;
  RULE_QUESTION.lastIndex = 0;
  if (QUESTION.test(text) || RULE_QUESTION.test(text)) {
    QUESTION.lastIndex = 0;
    RULE_QUESTION.lastIndex = 0;
    return null;
  }
  QUESTION.lastIndex = 0;
  RULE_QUESTION.lastIndex = 0;
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

/**
 * True when a message asks the owner a question about memory or the rules: a
 * sentence that ends in "?" and names memory, remembering, saving, keeping, a
 * proposal, a rule, or a lesson to promote (toolkit memory promote asks "Make
 * this a project rule: ...?" or "Turn the lesson ... into a project skill?").
 * His next prompt is then his answer to it.
 */
export function memoryQuestionAsked(message) {
  // A period inside a word (a file name such as SKILL.md, a version) does not end a sentence.
  const text = String(message ?? '').replace(/\.(?=\S)/g, '\u00b7');
  const questions = text.match(/[^.?!\n]*\?/g) || [];
  return questions.some((q) => /\b(?:memory|remember|save|saved|keep|kept|proposals?|rules?|lessons?|promot\w*)\b/i.test(q));
}

/**
 * True when a message is about a memory proposal that already exists: it says
 * "memory proposal", names a record key, or quotes a summary this session
 * already saved as a proposal. A loose question in such a message is about
 * that proposal, not a new one, so the Stop hook does not ask for the exact
 * form (final run, claude-local problem 1).
 */
export function namesOpenProposal(message, proposedSummaries = []) {
  const text = String(message ?? '');
  if (/\b(?:memory|rule)\s+proposals?\b|\bproposals?\s+(?:in|for|to)\s+memory\b/i.test(text)) return true;
  if (/\b(?:user|feedback|project|reference|event)_[a-z0-9]+(?:_[a-z0-9]+)+\b/.test(text)) return true;
  const words = normalizeSummary(text);
  return proposedSummaries.some((s) => s && s.length > 10 && words.includes(s));
}

/** A summary reduced to its words, for "was this proposed already" checks. */
export function normalizeSummary(summary) {
  return String(summary ?? '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, ' ').trim();
}

/** A summary that starts with a verb addressed to the agent. */
const IMPERATIVE = /^(?:please\s+)?(?:(?:always|never|only)\s+)?(?:ask|use|keep|write|run|put|avoid|don['’]?t|do\s+not|stop|start|check|make|give|show|tell|say|add|leave|send|test|name|follow|call|list|skip|include|wait|confirm|prefer|read|open|explain|mention|commit|push|merge|deploy|save|let|lead|answer|reply|respond|summari[sz]e|format|verify)\b/i;

/** Words about how work is done: replies, questions, tests, commits, reviews, and the like. */
const WORK_WORDS = /\b(?:repl(?:y|ies)|answers?|status|updates?|summar(?:y|ies)|bullets?|tables?|lists?|format\w*|explain\w*|explanations?|questions?|ask\w*|tests?|testing|commits?|branch\w*|merg\w*|pull\s+requests?|reviews?|approv\w*|messages?|code|comments?|naming|steps?|plans?|planning|designs?|work\s+items?|tasks?|delivery|helpers?|agents?|sessions?|handoffs?|wording|words|tone|emails?|docs?|documents?|changes?|results?|reports?|options?|recommend\w*|commands?|descriptions?|diffs?|screenshots?|examples?|links?|files?)\b/i;

/**
 * What an unanswered "Save to memory: <summary>?" proposes (Mike,
 * 2026-09-29: rules, skills, and memory each hold one kind of thing):
 *   'rule'     an instruction for how the agent works: the owner's preference
 *              about how work is done ("you find tables easier to read than
 *              bullets in status replies", "you'd rather ..."), a correction
 *              ("you should", "stop doing", "the agent"), or an instruction
 *              with no subject ("Ask one question at a time");
 *   'user'     a fact about the owner himself (his role, his devices, a
 *              preference that is not about the work);
 *   'project'  anything else.
 * (close-out 2026-09-28, C1: "you find ... easier" was typed project, and C2:
 * the same preference could land in user_ or feedback_.)
 */
export function proposalType(summary, ownerName) {
  const s = String(summary ?? '');
  const owner = String(ownerName ?? '').trim();
  const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const names = owner ? [owner, owner.split(/\s+/)[0]].map(esc).join('|') : null;
  const namesOwner = names && new RegExp(`\\b(?:${names})\\b`, 'i').test(s);
  const ownerSubject = `(?:${names ? `${names}|` : ''}the owner|you|he|she)`;
  const prefers = new RegExp(`\\b${ownerSubject}(?:['’]d|\\s+would)?\\s+(?:\\w+\\s+)?(?:prefers?|likes?|wants?|hates?|dislikes?|rather|finds?|reads?|expects?|needs?)\\b`, 'i').test(s)
    || /\beasier\s+for\s+(?:you|him|her|the owner)\b/i.test(s)
    || (names && new RegExp(`\\beasier\\s+for\\s+(?:${names})\\b`, 'i').test(s));
  if (/\b(?:the agent|agents?|you should|you must|stop doing|instead of)\b/i.test(s)) return 'rule';
  // An instruction to the agent with no subject ("Ask one requirements question at a time").
  if (IMPERATIVE.test(s.trim())) return 'rule';
  // "you'd rather", "easier for you", "you find X easier": how he wants things done.
  const compares = /\b(?:rather|easier|harder|clearer|faster)\b/i.test(s);
  if (prefers) return WORK_WORDS.test(s) || compares ? 'rule' : 'user';
  if (namesOwner || /\b(?:the owner)\b/i.test(s)) return 'user';
  return 'project';
}

/** The rule section a rule proposal names, from its words (lib/memory/lessons.mjs ruleArea). */
export function proposalRuleSection(summary) {
  return ruleArea(summary);
}

/**
 * The part of the owner's prompt that states the fact a question proposes, or
 * null (close-out 2026-09-28, finding 5: the proposal did not record that the
 * owner stated it). The prompt counts when it shares at least half of the
 * summary's words, or three of them. At most 200 characters; never a secret.
 */
export function statedInPrompt(summary, prompt) {
  const text = String(prompt ?? '').replace(/\s+/g, ' ').trim();
  if (!text || secretKind(text)) return null;
  const want = stems(searchTerms(summary));
  if (!want.length) return null;
  const have = new Set(stems(searchTerms(text)));
  const shared = want.filter((w) => have.has(w)).length;
  if (shared < 3 && shared < want.length / 2) return null;
  if (shared < 2) return null;
  return text.length <= 200 ? text : `${text.slice(0, 197).replace(/\s+\S*$/, '')}...`;
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
export function proposalBody(summary, date, asked = summary, { stated = null, rule = false } = {}) {
  const text = String(summary).replace(/\s+/g, ' ').trim();
  const point = /[.!?]$/.test(text) ? text : `${text}.`;
  const question = String(asked).replace(/\s+/g, ' ').trim();
  const form = rule ? 'Add to the project rules' : 'Save to memory';
  const quoted = stated ? String(stated).replace(/"/g, '”') : null;
  // His words keep their own closing mark; no second period after the quote (verifier, 2026-09-29).
  const stop = quoted && /[.!?]$/.test(quoted) ? '' : '.';
  const evidence = quoted
    ? `On ${date} the owner wrote "${quoted}"${stop} The agent asked him "${form}: ${question}?" and the turn ended with no answer, ${HOOK_PROPOSAL_EVIDENCE}`
    : `On ${date} the agent asked the owner "${form}: ${question}?" and the turn ended with no answer, ${HOOK_PROPOSAL_EVIDENCE}`;
  return [
    `# ${proposalTitle(text)}`,
    '',
    `**Remember:** ${point}`,
    '',
    '**Why:** Not stated by the owner.',
    '',
    `**How to apply:** Not stated by the owner. ${HOOK_PROPOSAL_WAIT}`,
    '',
    `**Evidence and limits:** ${evidence}`,
    '',
  ].join('\n');
}

/**
 * The toolkit memory save arguments for one proposal. The type is read from
 * the question's own wording; the name, description, and body use the
 * owner's name in place of a leading "you" (ownerWording).
 * Concept memory (Mike, 2026-09-28): with concept (the existing concept the
 * save named: "belongs in the concept X"), the proposal names that concept
 * and a section heading, and the owner's yes adds it there.
 */
export function proposalArgs(summary, { ownerName, date, name, concept, section, rule = null, ruleForm = false, stated = null } = {}) {
  // rule: true when the question was "Add to the project rules: ...?" (ruleForm) or its words are an instruction.
  const kind = rule === true || ruleForm ? 'rule' : proposalType(summary, ownerName);
  const named = ownerWording(summary, ownerName);
  const bodyOpts = { stated, rule: Boolean(ruleForm) };
  if (kind === 'rule') {
    // A rule proposal (Mike, 2026-09-29): typed user, it names the rule
    // section a yes adds it to, and it joins no memory concept.
    return [
      'memory', 'save',
      '--type', 'user',
      '--name', name || `rule-${proposalName(named, 'user')}`.slice(0, 55).replace(/-+$/, ''),
      '--description', proposalDescription(named),
      '--body', proposalBody(named, date, summary, bodyOpts),
      '--source', `Agent question in a session, ${date}`,
      '--rule-section', proposalRuleSection(summary),
      '--proposal',
      '--json',
    ];
  }
  if (concept) {
    return [
      'memory', 'save',
      '--concept', concept,
      // A few words that name the sub-topic, not the whole sentence (close-out finding 6).
      '--section', section || shortHeading(named),
      ...(name ? ['--name', name] : []),
      '--description', proposalDescription(named),
      '--body', proposalBody(named, date, summary, bodyOpts),
      '--source', `Agent question in a session, ${date}`,
      '--proposal',
      '--json',
    ];
  }
  return [
    'memory', 'save',
    '--type', kind,
    '--name', name || proposalName(named, kind),
    '--description', proposalDescription(named),
    '--body', proposalBody(named, date, summary, bodyOpts),
    '--source', `Agent question in a session, ${date}`,
    '--proposal',
    '--json',
  ];
}
