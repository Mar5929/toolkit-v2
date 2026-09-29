// AI credit lines for the guard tests. Each is built from parts, so no file
// the plugin ships holds a whole AI credit line (final re-review R-M11). The
// guard sees the joined text, the same as a real commit message.

const join = (...parts) => parts.join('');

/** The AI names and addresses, from parts. */
export const AI = join('Cla', 'ude');
export const AI_CODE = `${AI} Code`;
const MAIL = join('noreply', '@', 'anthro', 'pic.com');
const CODEX = join('Co', 'dex');
const COPILOT = join('Co', 'pilot');
const GEN = join('Gener', 'ated with');

/** Co-author trailers that name an AI. */
export const TRAILER = `Co-Authored-By: ${AI} <${MAIL}>`;
export const TRAILER_MODEL = `Co-Authored-By: ${AI} Opus 5.5 (1M context) <${MAIL}>`;
export const TRAILER_LOWER = `Co-authored-by: ${AI} <${MAIL}>`;
export const CODEX_TRAILER = `Co-authored-by: ${CODEX} <${join(CODEX.toLowerCase(), '@', 'openai.com')}>`;
export const COPILOT_TRAILER = `Co-authored-by: GitHub ${COPILOT} <${join(COPILOT.toLowerCase(), '@', 'github.com')}>`;

/** "Generated with" lines that name an AI. */
export const GENERATED = `${GEN} ${AI_CODE}`;
export const GENERATED_LOWER = `${GEN.toLowerCase()} ${AI_CODE}`;
export const GENERATED_LINK = `🤖 ${GEN} [${AI_CODE}](https://${AI.toLowerCase()}.com/${AI.toLowerCase()}-code)`;
export const GENERATED_CODEX = `${GEN} ${CODEX}`;
export const GENERATED_AI = `${GEN} AI`;
export const WRITTEN_USING = `written using ${join('Chat', 'GPT')}`;

/** A sentence that only mentions a trailer: not a credit line. */
export const TRAILER_IN_SENTENCE = `Deny commits with a Co-Authored-By: ${AI} line`;
