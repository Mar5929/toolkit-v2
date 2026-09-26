// Load a recorded hook input from tests/hooks/fixtures/<host>/<name>.json and
// fill its {{PLACEHOLDERS}}. A string that is exactly one placeholder takes the
// value as it is (so {{STOP_ACTIVE}} can become a boolean); other strings get
// the value written into them.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const FIXTURES = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures');

function fill(value, vars) {
  if (typeof value === 'string') {
    const whole = /^\{\{([A-Z_]+)\}\}$/.exec(value);
    if (whole && Object.prototype.hasOwnProperty.call(vars, whole[1])) return vars[whole[1]];
    return value.replace(/\{\{([A-Z_]+)\}\}/g, (all, name) => (Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : all));
  }
  if (Array.isArray(value)) return value.map((v) => fill(v, vars));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, fill(v, vars)]));
  return value;
}

/** The fixture with its placeholders filled. */
export function fixture(host, name, vars = {}) {
  const raw = JSON.parse(fs.readFileSync(path.join(FIXTURES, host, `${name}.json`), 'utf8'));
  const defaults = { SESSION: 'sess-test-1', TURN: 'turn-1', STOP_ACTIVE: false, STDOUT: '', STDERR: '', CONTENT: '', OLD: '', NEW: '', PROMPT: '', COMMAND: '' };
  return fill(raw, { ...defaults, ...vars });
}

/** The unfilled fixture, for checks of its shape. */
export function rawFixture(host, name) {
  return JSON.parse(fs.readFileSync(path.join(FIXTURES, host, `${name}.json`), 'utf8'));
}

/** An apply_patch text that updates one file (Codex). */
export function updatePatch(rel, oldLine, newLine) {
  return `*** Begin Patch\n*** Update File: ${rel}\n@@\n-${oldLine}\n+${newLine}\n*** End Patch`;
}
