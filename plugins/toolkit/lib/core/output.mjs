// Exit codes, the error type every command throws, and the two print helpers.
//
// A command prints its result with out(ctx, humanText, data). With --json the
// data is printed as JSON; without it the human text is printed.
// A command reports a problem by throwing a ToolkitError, or by returning
// fail(ctx, err), which prints the error and returns the exit code.

export const EXIT = Object.freeze({
  OK: 0,
  ERROR: 1,
  INVALID: 2,
  UNSUPPORTED: 3,
  NOT_PROJECT: 4,
});

const KNOWN_CODES = new Set(Object.values(EXIT));

export class ToolkitError extends Error {
  /**
   * @param {number} code one of EXIT
   * @param {string} message plain sentence for the reader
   * @param {object} [details] extra facts; a string `fix` is printed as a second line
   */
  constructor(code, message, details) {
    super(message);
    this.name = 'ToolkitError';
    this.code = KNOWN_CODES.has(code) ? code : EXIT.ERROR;
    this.details = details;
  }

  toJSON() {
    const json = { code: this.code, message: this.message };
    if (this.details !== undefined) json.details = this.details;
    return json;
  }
}

export function isToolkitError(err) {
  return Boolean(err) && (err instanceof ToolkitError || err.name === 'ToolkitError') && typeof err.code === 'number';
}

function writer(ctx, stream) {
  const target = ctx && ctx[stream];
  if (target && typeof target.write === 'function') return (s) => target.write(s);
  if (typeof target === 'function') return target;
  return (s) => process[stream].write(s);
}

function withNewline(text) {
  return text.endsWith('\n') ? text : `${text}\n`;
}

/**
 * Print a result. JSON mode prints `data` (or { text } when data is missing);
 * human mode prints `humanText` (a string or an array of lines).
 */
export function out(ctx, humanText, data) {
  const write = writer(ctx, 'stdout');
  if (ctx && ctx.json) {
    const payload = data === undefined ? { text: joinText(humanText) } : data;
    write(`${JSON.stringify(payload, null, 2)}\n`);
    return;
  }
  const text = joinText(humanText);
  if (text === '') return;
  write(withNewline(text));
}

function joinText(humanText) {
  if (humanText === undefined || humanText === null) return '';
  if (Array.isArray(humanText)) return humanText.join('\n');
  return String(humanText);
}

/**
 * Print an error and return its exit code. The code is also stored on
 * ctx.exitCode so the dispatcher uses it even when the caller does not return it.
 * JSON mode prints { ok: false, error: { code, message, details } } to stdout.
 * Human mode prints the message (and details.fix when present) to stderr.
 */
export function fail(ctx, err) {
  const known = isToolkitError(err);
  const code = known ? err.code : EXIT.ERROR;
  const message = err && err.message ? err.message : String(err);
  const details = known ? err.details : undefined;
  if (ctx && typeof ctx === 'object') ctx.exitCode = code;

  if (ctx && ctx.json) {
    const error = { code, message };
    if (details !== undefined) error.details = details;
    if (!known) error.unexpected = true;
    writer(ctx, 'stdout')(`${JSON.stringify({ ok: false, error }, null, 2)}\n`);
    return code;
  }

  const write = writer(ctx, 'stderr');
  const lines = [known ? `Error: ${message}` : `Unexpected error: ${message}`];
  if (details && typeof details === 'object' && typeof details.fix === 'string' && details.fix) {
    lines.push(`Fix: ${details.fix}`);
  }
  const env = (ctx && ctx.env) || process.env;
  if (!known && env && env.TOOLKIT_DEBUG && err && err.stack) lines.push(err.stack);
  write(withNewline(lines.join('\n')));
  return code;
}
