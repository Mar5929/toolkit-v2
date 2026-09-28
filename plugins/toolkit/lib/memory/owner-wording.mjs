// The owner's name in place of "you" in a memory summary the agent wrote to
// him (final confirmation round 1, local and Notion runs). Used by the Stop
// hook when it saves an unanswered "Save to memory: <summary>?"
// (lib/hooks/proposal.mjs) and by toolkit memory approve for a proposal the
// hook saved before this fix (lib/memory/proposals.mjs).

const MODALS = new Set(['can', 'could', 'will', 'would', 'shall', 'should', 'may', 'might', 'must', "can't", 'cannot', "won't", "wouldn't", "shouldn't", "couldn't", "mustn't", 'did', "didn't", 'had', "hadn't", 'used', 'ought', 'need']);
const IRREGULAR = new Map([
  ['are', 'is'], ['were', 'was'], ["aren't", "isn't"], ["weren't", "wasn't"], ['have', 'has'], ["haven't", "hasn't"],
  ['do', 'does'], ["don't", "doesn't"], ['go', 'goes'],
]);
const PAST = new Set(['said', 'told', 'chose', 'wrote', 'ran', 'made', 'went', 'got', 'gave', 'took', 'knew', 'thought', 'found', 'left', 'kept', 'felt', 'came', 'saw', 'sent', 'built', 'bought', 'brought', 'meant', 'paid', 'sold', 'spent', 'stood', 'understood', 'won', 'lost', 'met', 'began', 'drove', 'forgot', 'heard', 'held', 'led', 'broke', 'spoke', 'set', 'put', 'let', 'cut', 'hit', 'shut', 'quit', 'read']);
const ADVERBS = new Set(['only', 'always', 'never', 'usually', 'often', 'sometimes', 'also', 'just', 'still', 'mostly', 'rarely', 'normally', 'typically', 'already', 'generally', 'currently', 'now', 'really', 'mainly', 'seldom', 'even', 'each']);
const NOT_VERBS = new Set(['and', 'or', 'but', 'too', 'both', 'all', 'alone', 'yourself', 'as', 'with', 'in', 'on', 'at', 'for', 'to']);

/** A verb in the third person singular ("publish" -> "publishes", "run" -> "runs", "try" -> "tries"). */
function thirdPerson(verb) {
  const lower = verb.toLowerCase();
  if (MODALS.has(lower) || PAST.has(lower) || /ed$/.test(lower) || NOT_VERBS.has(lower)) return verb;
  if (IRREGULAR.has(lower)) return IRREGULAR.get(lower);
  if (/(?:s|sh|ch|x|z|o)$/.test(lower)) return `${verb}es`;
  if (/[^aeiou]y$/.test(lower)) return `${verb.slice(0, -1)}ies`;
  return `${verb}s`;
}

/**
 * A summary the agent wrote to the owner, rewritten so the record names him
 * (final confirmation round 1, local and Notion runs: "Save to memory: You
 * publish your blog on Ghost ...?" was saved and approved with "You" in the
 * title and the Remember line, and later agents read "you" as themselves).
 * Only a summary that starts with "you" or "your" is rewritten: "you" is
 * then the owner. "You publish your blog" becomes "Mike Rihm publishes Mike's
 * blog"; "you're" becomes "Mike Rihm is". The owner's first name is used after
 * the first mention. With no owner name, "the owner" is used.
 */
export function ownerWording(summary, ownerName) {
  const text = String(summary ?? '').replace(/\s+/g, ' ').trim();
  if (!/^(?:you|your|you['’](?:re|ve|ll|d))\b/i.test(text)) return text;
  const full = String(ownerName ?? '').replace(/\s+/g, ' ').trim();
  const first = full ? full.split(' ')[0] : 'the owner';
  let named = false;
  const subject = () => {
    if (named) return first;
    named = true;
    return full || 'the owner';
  };
  let out = text
    // Contractions first: you're, you've, you'll, you'd.
    .replace(/\byou['’](re|ve|ll|d)\b/gi, (m, c) => `${subject()} ${({ re: 'is', ve: 'has', ll: 'will', d: 'would' })[c.toLowerCase()]}`)
    // "you <adverb>? <verb>" where "you" starts the summary or a clause: the
    // subject and its verb. Any other "you" is an object ("Ghost emails you").
    .replace(/(^|[,;:.]\s+|\b(?:and|but|or|when|if|that|because|so|unless|until|before|after|while|since|where|once)\s+)you\b(\s+)(?:([a-z]+)(\s+))?([a-z'’]+)/gi, (m, lead, sp1, adv, sp2, verb) => {
      if (adv && ADVERBS.has(adv.toLowerCase())) return `${lead}${subject()}${sp1}${adv}${sp2}${thirdPerson(verb)}`;
      const word = adv || verb;
      const rest = adv ? `${sp2}${verb}` : '';
      if (ADVERBS.has(word.toLowerCase())) return `${lead}${subject()}${sp1}${word}${rest}`;
      return `${lead}${subject()}${sp1}${thirdPerson(word)}${rest}`;
    })
    .replace(/\byours\b/gi, () => `${first}'s`)
    .replace(/\byourself\b/gi, () => 'personally')
    .replace(/\byour\b/gi, () => (named ? `${first}'s` : (named = true, `${full || 'the owner'}'s`)))
    .replace(/\byou\b/gi, () => first);
  out = out.charAt(0).toUpperCase() + out.slice(1);
  return out;
}
