// A small reader for Codex command rules files (.codex/rules/*.rules), so
// doctor can check that a project's rules still make Codex ask the owner
// before the risky toolkit commands (Mike, 2026-09-28, decision 12; verifier
// finding: a project that changed .codex/rules/toolkit.rules never got the
// prompt rules, and nothing said so).
//
// It reads only prefix_rule(...) calls and only their `pattern` and
// `decision` arguments. A pattern is a list whose items are a word or a list
// of words (any one of them). A rule matches a command when the command's
// first words match the pattern item by item. When several rules match, the
// strictest decision wins: forbidden, then prompt, then allow (the same order
// Codex uses; templates/codex/toolkit.rules relies on it). `codex execpolicy
// check --rules <file> <command words>` is the full check; this reader does
// not run Codex.

import fs from 'node:fs';
import path from 'node:path';

const STRICTNESS = { allow: 1, prompt: 2, forbidden: 3 };

/** The text of each prefix_rule(...) call's arguments, in order. */
function ruleBodies(text) {
  const out = [];
  const re = /\bprefix_rule\s*\(/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    let depth = 1;
    let i = re.lastIndex;
    let quote = null;
    for (; i < text.length && depth > 0; i++) {
      const c = text[i];
      if (quote) {
        if (c === '\\') i++;
        else if (c === quote) quote = null;
      } else if (c === '"' || c === "'") quote = c;
      else if (c === '#') {
        const nl = text.indexOf('\n', i);
        i = nl === -1 ? text.length : nl;
      } else if (c === '(' || c === '[') depth++;
      else if (c === ')' || c === ']') depth--;
    }
    out.push(text.slice(re.lastIndex, i - 1));
    re.lastIndex = i;
  }
  return out;
}

/** Parse a list of strings and lists of strings starting at text[start] === '['. Returns { value, end } or null. */
function parseList(text, start) {
  const value = [];
  let i = start + 1;
  while (i < text.length) {
    const c = text[i];
    if (/\s|,/.test(c)) {
      i++;
    } else if (c === ']') {
      return { value, end: i + 1 };
    } else if (c === '[') {
      const inner = parseList(text, i);
      if (!inner) return null;
      value.push(inner.value);
      i = inner.end;
    } else if (c === '"' || c === "'") {
      let s = '';
      let j = i + 1;
      for (; j < text.length && text[j] !== c; j++) {
        if (text[j] === '\\' && j + 1 < text.length) j++;
        s += text[j];
      }
      if (j >= text.length) return null;
      value.push(s);
      i = j + 1;
    } else {
      return null;
    }
  }
  return null;
}

/** The prefix rules in a rules file's text: [{ pattern, decision }]. Rules this reader cannot read are left out. */
export function parsePrefixRules(text) {
  const rules = [];
  for (const body of ruleBodies(String(text ?? ''))) {
    const p = /\bpattern\s*=\s*\[/.exec(body);
    const d = /\bdecision\s*=\s*["'](allow|prompt|forbidden)["']/.exec(body);
    if (!p || !d) continue;
    const list = parseList(body, p.index + p[0].length - 1);
    if (!list || !list.value.length) continue;
    rules.push({ pattern: list.value, decision: d[1] });
  }
  return rules;
}

/** True when a rule's pattern matches the first words of a command. */
export function patternMatches(pattern, words) {
  if (pattern.length > words.length) return false;
  return pattern.every((item, k) => (Array.isArray(item) ? item.includes(words[k]) : item === words[k]));
}

/** The strictest decision of the rules that match a command's words ('allow', 'prompt', 'forbidden'), or null. */
export function ruleDecision(rules, words) {
  let best = null;
  for (const r of rules) {
    if (!patternMatches(r.pattern, words)) continue;
    if (!best || STRICTNESS[r.decision] > STRICTNESS[best]) best = r.decision;
  }
  return best;
}

/** Every prefix rule in a project's .codex/rules/*.rules files (Codex reads all of them). */
export function projectCodexRules(root) {
  const dir = path.join(root, '.codex', 'rules');
  let names = [];
  try {
    names = fs.readdirSync(dir).filter((n) => n.endsWith('.rules')).sort();
  } catch {
    return { files: [], rules: [] };
  }
  const rules = [];
  const files = [];
  for (const n of names) {
    try {
      rules.push(...parsePrefixRules(fs.readFileSync(path.join(dir, n), 'utf8')));
      files.push(n);
    } catch {
      // Unreadable: left out.
    }
  }
  return { files, rules };
}
