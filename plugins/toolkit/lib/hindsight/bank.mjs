// One Hindsight memory bank per project: claim it, create it, and set its
// settings (ARCHITECTURE section 7, research/hindsight.md section 13).
//
// Settings every toolkit bank gets (PATCH .../config with { updates }):
//   retain_extraction_mode: 'chunks'   store each record exactly; no language model on save
//   enable_observations: false         no background model work after a save
//   mcp_enabled_tools: READ_ONLY_MCP_TOOLS   an agent connected over MCP can read, never write
//   reflect_mission ends with PLAIN_ENGLISH  find --reflect answers in plain English
//     (gpt-oss:20b sometimes answered in Japanese without it)
//
// Which bank a project gets:
//   - The first time (no hindsight.bank in .toolkit.json), the id comes from the
//     project key. A bank whose marker names this same project key is this
//     project's bank (for example after .toolkit.json was lost or init ran
//     again), so it is used and its settings are repaired. Any other bank that
//     already exists (another key, or no marker) is taken, and the next free id
//     (<id>-2, <id>-3, ...) is used instead. Known limit: two different projects
//     with the same key share a bank; give one of them another key.
//   - After that, .toolkit.json names the bank ("claimed"). It is used as is and
//     created when missing. If its marker names another project's key, it is
//     refused (exit 2), unless the owner named the bank on purpose with --bank.
// The marker is the line `toolkit-v2 project key: <key>` in the retain mission,
// written when the toolkit creates the bank.

import { EXIT, ToolkitError } from '../core/output.mjs';
import { BANK_ID_RE, assertBankId } from './client.mjs';

export const READ_ONLY_MCP_TOOLS = Object.freeze([
  'recall', 'reflect', 'list_documents', 'get_document', 'list_memories', 'get_memory', 'list_tags', 'get_bank',
]);

export const BANK_SETTINGS = Object.freeze({
  retain_extraction_mode: 'chunks',
  enable_observations: false,
  mcp_enabled_tools: READ_ONLY_MCP_TOOLS,
});

/** The sentence every toolkit bank's reflect mission carries. */
export const PLAIN_ENGLISH = 'Always answer in plain English.';

const MARKER = 'toolkit-v2 project key:';
const MAX_SUFFIX = 20;

/** The missions written when a bank is created. The retain mission carries the ownership marker. */
export function bankMissions({ projectKey, projectName } = {}) {
  const name = projectName || projectKey || 'this project';
  return {
    reflect_mission: `Project memory for ${name}: decisions, preferences, corrections, and references the agent needs across sessions. ${PLAIN_ENGLISH}`,
    retain_mission: `Records saved by the toolkit command for ${name}. Store each record as written.\n${MARKER} ${projectKey || ''}`.trim(),
  };
}

/** The project key named in a bank's retain mission, or null. */
export function bankOwner(configResponse) {
  const cfg = configResponse || {};
  const mission = (cfg.overrides && cfg.overrides.retain_mission) || (cfg.config && cfg.config.retain_mission) || '';
  const m = new RegExp(`${MARKER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*(\\S+)`).exec(String(mission));
  return m ? m[1] : null;
}

/**
 * A usable bank id made from a project key, or null. Lower case; anything
 * other than letters, digits, and dashes becomes a dash; a key that does not
 * start with a letter (for example 3m-portal) gets `p-` in front; at most 60
 * characters, so the -2 ... -20 suffixes still fit.
 */
export function bankIdFor(key) {
  let id = String(key ?? '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
  if (!id) return null;
  if (!/^[a-z]/.test(id)) id = `p-${id}`;
  id = id.slice(0, 60).replace(/-+$/, '');
  return BANK_ID_RE.test(id) ? id : null;
}

function sameList(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((x, i) => x === sb[i]);
}

/** The reflect mission with PLAIN_ENGLISH at the end (unchanged when it has it). */
export function withPlainEnglish(mission) {
  const m = String(mission ?? '').trim();
  if (m.includes(PLAIN_ENGLISH)) return m;
  return m ? `${m.replace(/\s+$/, '')}${/[.!?]$/.test(m) ? '' : '.'} ${PLAIN_ENGLISH}` : PLAIN_ENGLISH;
}

/** Settings the bank does not have yet: { field: wanted }. */
export function settingsDrift(configResponse) {
  const cfg = (configResponse && configResponse.config) || {};
  const drift = {};
  for (const [field, wanted] of Object.entries(BANK_SETTINGS)) {
    const have = cfg[field];
    const same = Array.isArray(wanted) ? sameList(have, wanted) : have === wanted;
    if (!same) drift[field] = Array.isArray(wanted) ? [...wanted] : wanted;
  }
  if (!String(cfg.reflect_mission ?? '').includes(PLAIN_ENGLISH)) drift.reflect_mission = withPlainEnglish(cfg.reflect_mission);
  return drift;
}

/** Plain-language problems with a bank's settings ([] when it is set up as the toolkit expects). */
export function settingsProblems(configResponse) {
  const drift = settingsDrift(configResponse);
  const cfg = (configResponse && configResponse.config) || {};
  const problems = [];
  if ('retain_extraction_mode' in drift) problems.push(`retain_extraction_mode is ${JSON.stringify(cfg.retain_extraction_mode)}, not "chunks", so saves call the language model and are slow.`);
  if ('enable_observations' in drift) problems.push('enable_observations is on, so the server runs the language model in the background after saves.');
  if ('mcp_enabled_tools' in drift) problems.push('mcp_enabled_tools is not limited to read-only tools, so an agent connected over MCP could write to the bank.');
  if ('reflect_mission' in drift) problems.push(`reflect_mission does not say "${PLAIN_ENGLISH}", so find --reflect can answer in another language.`);
  return problems;
}

/**
 * Make sure a bank exists with the toolkit settings.
 *
 * client     a HindsightClient (its own bank is not used)
 * bank       the wanted bank id
 * projectKey the project's key, written into the ownership marker
 * claimed    true when .toolkit.json or --bank names this bank: it is used as
 *            is, created when missing, and never swapped for another id.
 *            When false, an existing bank is used only when its marker names
 *            projectKey; any other existing bank is skipped.
 * explicit   true when the owner named the bank with --bank: a bank made for
 *            another project is used anyway instead of being refused
 *
 * Returns { bank, created, changed: [fields set], owner, relation, skipped }.
 * relation: 'this-project' (made for this key), 'other-project' (made for
 * another key and named with --bank), or 'no-marker' (not made by the toolkit).
 */
export async function ensureBank({ client, bank, projectKey, projectName, claimed = false, explicit = false }) {
  assertBankId(bank);
  const candidates = claimed ? [bank] : [bank, ...Array.from({ length: MAX_SUFFIX - 1 }, (_, i) => `${bank}-${i + 2}`)];
  const skipped = [];
  for (const id of candidates) {
    if (!BANK_ID_RE.test(id)) break;
    const exists = await client.bankExists(id);
    const current = exists ? await client.getBankConfig(id) : null;
    if (current === null) {
      await client.putBank(bankMissions({ projectKey, projectName }), id);
      await client.patchBankConfig({ ...BANK_SETTINGS, mcp_enabled_tools: [...READ_ONLY_MCP_TOOLS] }, id);
      const after = await verifySettings(client, id);
      return { bank: id, created: true, changed: Object.keys(BANK_SETTINGS), owner: bankOwner(after), relation: 'this-project', skipped };
    }
    const owner = bankOwner(current);
    if (!claimed && !(owner && projectKey && owner === projectKey)) {
      skipped.push({ bank: id, owner });
      continue;
    }
    if (owner && projectKey && owner !== projectKey && !explicit) {
      throw new ToolkitError(EXIT.INVALID, `.toolkit.json names the Hindsight bank ${id}, but that bank was made for the project ${owner}, and this project's key is ${projectKey}. Nothing was changed.`, {
        bank: id,
        owner,
        projectKey,
        fix: `If this project really should use that bank, run toolkit hindsight ensure-bank --bank ${id}. Otherwise remove hindsight.bank from .toolkit.json and run toolkit hindsight ensure-bank to make a bank for this project.`,
      });
    }
    const drift = settingsDrift(current);
    if (Object.keys(drift).length) {
      await client.patchBankConfig(drift, id);
      await verifySettings(client, id);
    }
    const relation = !owner ? 'no-marker' : owner === projectKey ? 'this-project' : 'other-project';
    return { bank: id, created: false, changed: Object.keys(drift), owner, relation, skipped };
  }
  const last = skipped.length ? skipped[skipped.length - 1].bank : bank;
  throw new ToolkitError(EXIT.ERROR, `Every bank id from ${bank} to ${last} is already used on the Hindsight server.`, {
    skipped,
    fix: 'Pick another id and run toolkit hindsight ensure-bank --bank <id>.',
  });
}

async function verifySettings(client, id) {
  const after = await client.getBankConfig(id);
  if (after === null) {
    throw new ToolkitError(EXIT.ERROR, `The Hindsight bank ${id} was created but cannot be read back.`, { bank: id });
  }
  const left = settingsDrift(after);
  if (Object.keys(left).length) {
    throw new ToolkitError(EXIT.ERROR, `The Hindsight bank ${id} did not keep these settings: ${Object.keys(left).join(', ')}.`, { bank: id, drift: left });
  }
  return after;
}
