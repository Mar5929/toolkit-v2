// The explicit phrases that mean "keep this for later sessions" (ARCHITECTURE
// section 6, UserPromptSubmit; critique I14). Only explicit phrases count:
// "remember that" or "remember this", "from now on", "don't ever", "note
// that", "going forward", "keep in mind". Never "do you remember", "never
// mind", or "always fails": broad words such as "always" and "never" alone are
// not in the list, so ordinary sentences do not start a reminder.

export const KEEP_LINE = 'The owner stated something to keep; memory-save records it, or work-on if it is a task.';

const PATTERNS = [
  { phrase: 'remember that', re: /\bremember\s+(?:that|this)\b/gi },
  { phrase: 'from now on', re: /\bfrom\s+now\s+on\b/gi },
  { phrase: "don't ever", re: /\b(?:don['’]?t|do\s+not)\s+ever\b/gi },
  { phrase: 'note that', re: /\bnote\s+that\b/gi },
  { phrase: 'going forward', re: /\bgoing\s+forward\b/gi },
  { phrase: 'keep in mind', re: /\bkeep\s+in\s+mind\b/gi },
];

// "remember that" as a question or a negation is not an instruction to keep.
const NOT_BEFORE_REMEMBER = /\b(?:do|did|don['’]?t|didn['’]?t|do\s+not|did\s+not|can['’]?t|cannot|can\s+not|could\s+not|couldn['’]?t)\s+(?:you\s+|i\s+|we\s+)?$/i;

/** The prompt without fenced code blocks and quoted lines (pasted material is not the owner speaking). */
function ownWords(prompt) {
  return String(prompt || '')
    .replace(/```[\s\S]*?(?:```|$)/g, ' ')
    .split('\n')
    .filter((l) => !/^\s*>/.test(l))
    .join('\n');
}

/** The first keep phrase in a prompt, or null. */
export function keepPhrase(prompt) {
  const text = ownWords(prompt);
  for (const { phrase, re } of PATTERNS) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text)) !== null) {
      if (phrase === 'remember that' && NOT_BEFORE_REMEMBER.test(text.slice(Math.max(0, m.index - 30), m.index))) continue;
      return phrase;
    }
  }
  return null;
}

/** True when a text holds any keep phrase (the Stop reason must not, critique P8). */
export function hasKeepPhrase(text) {
  return keepPhrase(text) !== null;
}
