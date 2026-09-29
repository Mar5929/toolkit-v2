// toolkit memory ...: project memory through one command, whatever the backend.
//
// The backend comes from .toolkit.json memory.type (builtin, hindsight, notion);
// lib/memory/contract.mjs loads its driver. The approval policy lives in the
// memory-save skill, not here: this command records --approved-by when given,
// and refuses a delete without --owner-approved.
//
// Added on Mike's approval (2026-09-27, GOAL "Memory additions"):
// - saved proposals: save --proposal, approve, reject (lib/memory/proposals.mjs);
// - the duplicate check in save (lib/memory/similar.mjs);
// - clean deletes: delete, reject, retire, and rename take the record out of
//   the briefing cache at once (forgetInCache), before the cache is refreshed.
//
// Concept memory (Mike, 2026-09-28, GOAL "Concept memory, like Anthropic's
// project memory"; lib/memory/concepts.mjs): one record per concept, each fact
// under a "## " heading. save --concept <key> --section <heading> adds or
// changes one section and leaves the rest of the record as it was; the
// duplicate check says which existing concept a new fact belongs in; merge,
// split, and tidy --plan move facts between concepts.

import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from '../core/args.mjs';
import { requireProject } from '../core/config.mjs';
import { EXIT, ToolkitError, out } from '../core/output.mjs';
import { parse as parseFrontmatter } from '../core/frontmatter.mjs';
import { today } from '../core/util.mjs';
import {
  DESCRIPTION_MAX, FOCUS_SECTIONS, KNOWN_FIELDS, NO_AUTHORIZATION, UNAPPROVED_NOTE_RE, approvalNote, approvalText, assertKey, bodyTitle,
  canonicalKey, completeFocus, contractStatus, headingAnchor, isProposal, isProposalAuthorization, isValidKey, keyFor, loadDriver,
  mergedReason, normalizeName, normalizeRecord, proposalTarget, proposalText, repairLinksWithDriver, repairResult, sameApproval, searchTerms, secretKind,
  splitKey, storedStatus, supersededByFromBody, supersedesList, titleFromName, RECORD_TYPES, ACTIVE_TYPES, isRetiredType, retiredTypeError,
} from '../memory/contract.mjs';
import { readTurnFacts, passingRemark } from '../hooks/turn-facts.mjs';
import {
  PROJECT_RULE_PATH, addEntry, assertArea, assertInstruction, changeRules, commitLine, refreshAgentsSpan,
} from '../project/owner-rules.mjs';
import { proposalType } from '../hooks/proposal.mjs';
import { ownerWording } from '../memory/owner-wording.mjs';
import { projectHosts } from '../project/manifest.mjs';
import { slugify } from '../core/util.mjs';
import {
  LESSONS_HEADING, isRuleProposal, ruleTarget, ruleProposalText, addLesson, findLesson, lessonPoint, planPromotions, promotionMark, ruleArea,
} from '../memory/lessons.mjs';
import { forgetInCache, refreshCache } from '../memory/startup.mjs';
import { exportMemory, importMemory } from '../memory/transfer.mjs';
import { findSimilar, bodyPoints, bodyWords, overlap, stems, SIMILAR_AT, CLOSEST_WHY } from '../memory/similar.mjs';
import { approveRecord, rejectProposal, recordTitle } from '../memory/proposals.mjs';
import {
  addEvidenceNote, assertHeading, conceptParts, editConceptText, editRecordWith, getSection, hasApprovalNote, isOneFact, mergeSections, newConceptBody,
  oldestDate, planTidy, rememberText, retargetLinks, sameHeading, sectionText, spliceSection, suggestConcept, withBodyTitle, withEvidence,
  withLessonsSection,
} from '../memory/concepts.mjs';

export const summary = 'Save, find, and manage project memory: records, the current focus, and the glossary.';

export const help = `Usage:
  toolkit memory save --type <t> --name <slug> --description <d> (--body <text> | --body-file <file|->)
                      [--section <heading>] [--title <text>]
                      [--approved-by <who>] [--authorization <text>] [--supersedes <key>] [--source <text>]
                      [--status <s>] [--last-verified <YYYY-MM-DD|unknown>] [--expect <version|absent>]
                      [--proposal [--rule-section <area>]] [--allow-similar | --new-concept] [--not-a-rule]
  toolkit memory save --concept <key> --section <heading> (--body <text> | --body-file <file|-> | --remove)
                      [--append] [--description <d>] [--title <text>] [--approved-by <who> | --proposal]
                      [--source <text>] [--last-verified <YYYY-MM-DD|unknown>] [--expect <version>] [--allow-similar]
                      [--not-a-rule]
  toolkit memory save --concept <key> --lesson <heading> [--body <text> | --body-file <file|->] [--source <text>]
  toolkit memory find <query> [--reflect] [--type <t>] [--limit <n>] [--all] [--proposals]
  toolkit memory get <key>
  toolkit memory list [--type <t>] [--status <current|needs-review|retired|all>]
  toolkit memory approve <key> --by <name> [--concept <key>] [--title <t>] [--description <d>]
                         (a rule proposal: [--section <area>] [--text <instruction>])
  toolkit memory reject <key> [--reason <text>]
  toolkit memory retire <key> [--superseded-by <key>] [--reason <text>]
  toolkit memory restore <key>
  toolkit memory rename <key> --to <new-key>
  toolkit memory delete <key> --owner-approved
  toolkit memory merge <key> [<key> ...] --into <concept-key> --approved-by <owner> [--title <t>] [--description <d>]
  toolkit memory split <key> --section <heading> [--section <heading> ...] --into <concept-key> --approved-by <owner>
                       [--title <t>] [--description <d>]
  toolkit memory tidy --plan
  toolkit memory promote <key> --section <lesson heading> --to rule|skill [--rule-section <area>] [--text <t>]
                         [--skill-name <name>] [--approved-by <owner>]
  toolkit memory focus [--set-file <file|-> | --text <text>] [--expect <version>]
  toolkit memory glossary [--set-file <file|-> | --text <text>] [--expect <version>]
  toolkit memory reindex
  toolkit memory status
  toolkit memory export --to <folder>
  toolkit memory import --from <folder> [--dry-run]

Concept memory: one record per concept or area (user_profile,
project_billing), with its title ("# " line), a one-line summary
(description), and the date of its last change (updated) at the top. Each
fact goes under a "## " heading in the concept it belongs to; a new record is
only for a new concept. An event_ record holds one episode.
save --concept <key> --section <heading> adds that section to the concept, or,
with --expect <version>, replaces the text of the section with that heading;
--append adds the text under an existing heading; --remove (with --expect)
takes the section out. The rest of the record is not changed. --description
then sets the concept's summary; with --proposal it is the fact's one line, and
the proposal is saved as its own record that names the concept and section,
added there when the owner approves it.
save --type/--name with --section starts a new concept with that section (or
adds the section when the concept exists). --title sets the "# " title.
Types: ${ACTIVE_TYPES.join(', ')}. A key is <type>_<slug>, for example project_deploy_window.
The feedback type is retired (Mike, 2026-09-29): an instruction for how the agent
works is a rule (toolkit rule add), so a new feedback_ record or fact is refused.
An older feedback_ record is still read; tidy --plan lists how to move it out.
The key is also the file name without .md and the frontmatter name (the model's topic format).
A key typed with dashes (project_deploy-window) finds the same record.
A --name longer than 60 characters is refused, not shortened.
A body file that starts with frontmatter fills any field not given as a flag.
--approved-by writes "authorization: Approved by <who> on <date>". With no approver
and memory.approval trusted, it is "Trusted grant"; --authorization sets the words.
A concept's authorization line is the approval of the concept. A section save,
merge, split, or approve keeps an existing concept's line; a section whose approval differs
records it on its Evidence and limits line ("Approved by <who> on <date>." or
"Saved on <date> with no approval recorded.").
Saving over an existing record keeps its source, authorization, supersedes,
last_verified, and any other frontmatter fields unless they are given again.
Saving a record that needs review marks it verified today.
Duplicate check: save refuses (exit 2) and lists the records when memory
already has one with the same key, or one with a very similar description or
text (naming the section that holds it). Update a record you read with
--expect <version>, replace one with --supersedes <key>, or save a different
fact anyway with --allow-similar. A new record whose words match an existing
concept of the same type is not saved either: the output names the concept
it belongs in ("belongs in the concept <key>") and the save --concept command
that adds it there; when it really is a new concept, add --new-concept.
merge moves records into one concept, each as a section (retired as
superseded by it; links follow, to the section). split moves sections out of
a concept into another. Both need the owner's yes (--approved-by). tidy
--plan changes nothing: it lists which one-fact records to merge into which
concepts, and which concepts grew too large.
--proposal saves a record the owner has not answered yet ("Save to memory?"):
status needs-review, authorization "Proposed by the agent on <date>". A
proposal is not a fact: find leaves it out unless --proposals (or --all) is
given, and the briefing and toolkit work decisions list it for the owner.
approve records his yes (the record becomes current, "Approved by <name> on
<date>"); a proposal that names a concept is added to it as a section.
approve --concept <key> names the concept the fact goes in: an existing one
(added as a section), a new one (started with --title and --description), or
the proposal's own key. A one-fact proposal that names no concept is refused
until --concept names one, because its key names the fact, not a concept.
A rule proposal (--proposal --rule-section <area>, typed user) is the owner's
instruction the agent asked about: his yes (approve) adds it to
.claude/rules/owner-preferences.md in that section (--section and --text
change them) and removes the proposal. An older feedback_ proposal is one too.
--approved-by in a turn the hooks recorded with no keep phrase, no other save
words, and no answer to a memory question saves a new record (also with
--expect absent), a new section, or --append text as a proposal instead, even
with the concept's --expect version, and says so: a remark made in passing is
not an approval. A replacement of text already there (--expect <version>) is
saved as given.
An instruction the owner gave this turn with a keep phrase ("from now on",
a correction), saved as a user_ or project_ record or section that is not a
proposal, is refused (exit 2) when its Remember line reads as an instruction
for how the agent works: it is a rule (toolkit rule add, printed). When it is
a fact after all, save it again with --not-a-rule.
--lesson <heading> records learned know-how under the concept's
"## Gotchas and lessons" section, as a "### " heading with a Seen line; the
same heading again adds today's date (on a day already there, only with a
--source no entry of that day has: another session). A lesson seen in two or more sessions,
one like it in another concept, or one the owner confirmed is a promotion
candidate (tidy --plan). promote proposes it as a rule or a skill and changes
nothing; with --approved-by (after his yes, in the turn he answers) it writes
the rule, or a skill skeleton for the agent to fill, and marks the lesson
promoted. With --approved-by in a turn the hooks recorded with no keep phrase,
no other save words, and no answer to a question about memory or rules, it is
refused (exit 2).
reject records his no and deletes the proposal. reject --reason
repeats his reason in the output; nothing keeps it, since the proposal is deleted.
delete, reject, retire, and rename also take the record out of the local
briefing cache (Hindsight and Notion memory) and the index.
toolkit memory focus keeps the "# Current focus" heading and the
"Last updated:" line, and adds them with today's date when they are missing.
A "Last updated:" date older than today is set to today: the save is today's update.
retire --superseded-by <key> marks the record superseded (the replacement must
exist and not be archived); retire alone archives it (built-in: moved to
.memory/archive/). A record saved with status superseded or archived keeps that
word; a superseded record stays beside the current ones.
Links to a note in other notes are repaired when it is renamed (rename, or save
--supersedes), superseded, archived (the link becomes its words plus "(archived)"),
or deleted (the link becomes its words); the notes changed are listed, and so
are notes whose links could not be repaired. Saving an archived note as current
moves it out of archive/ and keeps its links working.
The current focus has four ## sections (${FOCUS_SECTIONS.join(', ')}) and at most 50 lines.
Exit codes: 0 ok, 1 error or not found, 2 refused (a rule or a stale --expect), 3 not supported by this backend, 4 not a toolkit project.`;

const SUBCOMMANDS = ['save', 'find', 'get', 'list', 'approve', 'reject', 'retire', 'restore', 'rename', 'delete', 'merge', 'split', 'tidy', 'promote', 'focus', 'glossary', 'reindex', 'status', 'export', 'import'];

export async function run(argv, ctx) {
  const [sub, ...rest] = argv;
  if (!sub || sub === 'help') {
    out(ctx, help, { subcommands: SUBCOMMANDS, help });
    return EXIT.OK;
  }
  if (!SUBCOMMANDS.includes(sub)) {
    throw new ToolkitError(EXIT.INVALID, `Unknown memory command "${sub}". Commands: ${SUBCOMMANDS.join(', ')}.`, {
      fix: 'Run toolkit help memory.',
    });
  }
  const project = requireProject(ctx.cwd);
  const driver = await loadDriver(project, { env: ctx.env });
  const handler = HANDLERS[sub];
  return handler(rest, ctx, { project, driver });
}

// ---------------------------------------------------------------- helpers

function one(value, flag) {
  if (Array.isArray(value)) {
    throw new ToolkitError(EXIT.INVALID, `--${flag} was given more than once.`);
  }
  return value;
}

function str(flags, name) {
  const v = one(flags[name], name);
  if (v === undefined || v === null) return undefined;
  if (v === true) throw new ToolkitError(EXIT.INVALID, `--${name} needs a value.`);
  return String(v);
}

function requireKeyArg(positionals, what) {
  if (!positionals.length) throw new ToolkitError(EXIT.INVALID, `Give the key of the record to ${what}, for example: toolkit memory ${what} project_deploy_window.`);
  if (positionals.length > 1) throw new ToolkitError(EXIT.INVALID, `Give one key, not ${positionals.length}.`);
  return positionals[0];
}

async function readInput(ctx, file, flag) {
  if (file === '-') return ctx.stdin();
  const full = path.resolve(ctx.cwd, file);
  try {
    return fs.readFileSync(full, 'utf8');
  } catch (err) {
    throw new ToolkitError(EXIT.INVALID, `--${flag} ${file} cannot be read: ${err.code === 'ENOENT' ? 'there is no such file' : err.message}.`);
  }
}

async function afterWrite(project, driver, { forget = [] } = {}) {
  // Clean deletes: the record leaves the briefing cache now, even if the refresh below fails.
  if (forget.length) forgetInCache(project, forget);
  if (driver.backend !== 'builtin') await refreshCache(project, driver);
}

/** Text as one single-quoted shell word, so a command line printed for the agent runs as shown. */
function shellQuote(s) {
  return `'${String(s).replace(/'/g, "'\\''")}'`;
}

function short(version) {
  return version ? String(version).slice(0, 12) : 'none';
}

function statusWord(status) {
  return status === 'needs-review' ? 'needs review' : status;
}

/**
 * How a record's status reads in a list: "[needs review]", "[superseded by <key>]",
 * "[superseded]" (the replacement is not named), "[archived]", or ''.
 */
function statusFlag(r) {
  if (!r.status || r.status === 'current') return '';
  if (r.proposal || isProposal(r)) {
    const extra = r.extra && typeof r.extra === 'object' ? r.extra : {};
    const ruleSection = r.rule_section || extra.rule_section;
    if (ruleSection || r.type === 'feedback') return ` [rule proposal for ${PROJECT_RULE_PATH}${ruleSection ? `, section "${ruleSection}"` : ''}: the owner has not answered]`;
    const target = proposalTarget(r);
    return target ? ` [proposal for ${target.concept}: the owner has not answered]` : ' [proposal: the owner has not answered]';
  }
  if (r.status === 'retired') {
    if (storedStatus(r) === 'archived') return ' [archived]';
    return r.superseded_by ? ` [superseded by ${r.superseded_by}]` : ' [superseded]';
  }
  return ` [${statusWord(r.status)}]`;
}

function notes(n) {
  return `${n} note${n === 1 ? '' : 's'}`;
}

/**
 * The lines about link repair in a driver result: the notes whose links were
 * repaired, the notes also written in the model's topic format, and the notes
 * that could not be repaired (with why). [] when nothing was repaired.
 */
export function repairLines(res) {
  const lines = [];
  const list = (res && res.linksRepaired) || [];
  if (list.length) lines.push(`Links repaired in ${notes(list.length)}: ${list.join(', ')}.`);
  const reformatted = (res && res.reformatted) || [];
  if (reformatted.length) lines.push(`Also written in the model's topic format: ${reformatted.join(', ')}.`);
  const failed = (res && res.linksFailed) || [];
  if (failed.length) {
    lines.push(`Links not repaired in ${notes(failed.length)} (fix each with toolkit memory get and toolkit memory save):`);
    for (const f of failed) lines.push(`- ${f.key}: ${f.reason}`);
  }
  return lines;
}

/** The link-repair fields for --json output: linksRepaired, and linksFailed and reformatted when given. */
function repairFields(res) {
  const outFields = { linksRepaired: (res && res.linksRepaired) || [] };
  if (res && res.linksFailed && res.linksFailed.length) outFields.linksFailed = res.linksFailed;
  if (res && res.reformatted && res.reformatted.length) outFields.reformatted = res.reformatted;
  return outFields;
}

// ---------------------------------------------------------------- save

const SAVE_SPEC = {
  string: ['type', 'name', 'description', 'body', 'body-file', 'approved-by', 'authorization', 'supersedes', 'source', 'status',
    'last-verified', 'expect', 'host', 'concept', 'section', 'title', 'rule-section', 'lesson'],
  boolean: ['proposal', 'allow-similar', 'new-concept', 'append', 'remove', 'not-a-rule'],
};

/**
 * A save that says the owner approved it (--approved-by), in a turn whose
 * prompt the hooks recorded with no keep phrase, no other words asking for a
 * save, and no answer to a memory question, is saved as a proposal instead
 * (close-out 2026-09-28, R-I4 in code): a remark made in passing is not an
 * approval. The hooks' turn facts come from lib/hooks/turn-facts.mjs.
 * adds: the save stores something new: a new record (no --expect, or
 * --expect absent), a new section of a concept, or more text under a section
 * (--append), whatever --expect it carries (verifier, 2026-09-29: --expect
 * absent and a new section saved with the concept's version were stored as
 * approved). A change of text already there (a whole record or a section
 * replaced with --expect <version>), --supersedes, and a removal are left as
 * they are; the PostToolUse note still covers them. Changes flags in place and
 * returns { by } when it did, else null.
 */
function passingRemarkDowngrade(flags, project, env, { adds = true } = {}) {
  const by = str(flags, 'approved-by');
  if (by === undefined || flags.proposal === true || flags.remove === true) return null;
  // --supersedes retires an approved record, which a proposal never does.
  if (!adds || str(flags, 'supersedes') !== undefined) return null;
  const facts = readTurnFacts(project, env);
  if (!passingRemark(facts)) return null;
  flags.proposal = true;
  delete flags['approved-by'];
  delete flags.authorization;
  return { by, host: facts.host || null, turn: facts.turn ?? null };
}

/** The output line for a save turned into a proposal (passingRemarkDowngrade). */
export function downgradeLine(downgraded, key) {
  const who = downgraded && downgraded.by ? downgraded.by : 'the owner';
  return `Saved as a proposal, not as approved by ${who}: the hooks recorded no keep phrase, no other words asking for a save, and no answer to a memory question in his message this turn, so what he said is a remark made in passing. Tell him in the reply what was kept and ask "Save to memory: <one line>?". His yes: toolkit memory approve ${key} --by <name>${downgraded && downgraded.concept ? '' : ' (with --concept when it names none)'}; his no: toolkit memory reject ${key}.`;
}

/** The fact a save stores, on one line: its Remember line, else the fallback (the description or the heading). */
function factLine(text, fallback) {
  const m = /\*\*Remember:\*\*\s*([^\n]+)/.exec(String(text ?? ''));
  return (m ? m[1] : String(fallback ?? '')).replace(/\s+/g, ' ').trim();
}

/**
 * The refusal of an instruction saved to memory (verifier, 2026-09-29: in a
 * Codex turn "From now on, write tests with Node's built-in node:test
 * runner", the instruction was saved as a user_ section and nothing stopped
 * it). Rules, skills, and memory each hold one kind of thing (Mike,
 * 2026-09-29): an instruction the owner gives for how the agent works is a
 * rule. A user_ or project_ save that is not a proposal is refused (exit 2)
 * when the hooks recorded a keep phrase in the owner's message this turn and
 * the fact reads as an instruction (proposalType 'rule': a verb to the agent,
 * a correction, or a preference about how work is done). --not-a-rule says it
 * is a fact after all. Returns the error, or null.
 */
function instructionRefusal(project, env, { type, fact, what, proposal, notARule }) {
  if (proposal || notARule || !['user', 'project'].includes(String(type ?? '').trim().toLowerCase())) return null;
  const text = String(fact ?? '').replace(/\s+/g, ' ').trim();
  if (!text) return null;
  const facts = readTurnFacts(project, env);
  if (!facts || !facts.keep) return null;
  const owner = project && project.config && project.config.project && project.config.project.owner;
  if (proposalType(text, owner) !== 'rule') return null;
  const instruction = ownerWording(text, owner);
  const area = ruleArea(instruction);
  return new ToolkitError(EXIT.INVALID, `${what} was not saved: "${instruction}" is an instruction for how the agent works, and the owner asked this turn for it to be kept. An instruction is a rule, not memory (rules, skills, and memory each hold one kind of thing).`, {
    rule: { section: area, text: instruction },
    fix: `Add it to the project rules in his words: toolkit rule add --section ${shellQuote(area)} --text ${shellQuote(instruction)} --source '<owner>, in chat'. When it is a fact about the owner or the project and not an instruction, save it again with --not-a-rule.`,
  });
}

/** The owner's name, word by word: never a subject word when a fact is matched to a concept. */
function ownerWords(project) {
  const owner = project && project.config && project.config.project && project.config.project.owner;
  return owner ? String(owner).split(/\s+/).filter(Boolean) : [];
}

function approvalMode(project) {
  return project && project.config && project.config.memory && project.config.memory.approval;
}

/** One line of at most DESCRIPTION_MAX characters, cut at a word. */
function oneLineOf(text) {
  const s = String(text ?? '').replace(/\s+/g, ' ').trim();
  if (s.length <= DESCRIPTION_MAX) return s;
  return s.slice(0, DESCRIPTION_MAX + 1).replace(/\s+\S*$/, '') || s.slice(0, DESCRIPTION_MAX);
}

/** The body text given with --body or --body-file (standard input with -), or undefined when neither was given. */
async function bodyInput(flags, ctx) {
  const bodyFlag = str(flags, 'body');
  const bodyFile = str(flags, 'body-file');
  if (bodyFlag !== undefined && bodyFile !== undefined) {
    throw new ToolkitError(EXIT.INVALID, 'Give --body or --body-file, not both.');
  }
  if (bodyFlag !== undefined) return bodyFlag;
  if (bodyFile !== undefined) return readInput(ctx, bodyFile, 'body-file');
  return undefined;
}

async function save(argv, ctx, deps) {
  const { _, flags } = parseArgs(argv, SAVE_SPEC);
  if (_.length) throw new ToolkitError(EXIT.INVALID, `toolkit memory save takes no words outside flags (got "${_.join(' ')}"). Put the text in --body or --body-file.`);
  const concept = str(flags, 'concept');
  const lesson = str(flags, 'lesson');
  if (lesson !== undefined) return saveLesson(flags, ctx, deps, { conceptKey: concept, heading: lesson });
  if (concept !== undefined) {
    if (str(flags, 'rule-section') !== undefined) throw new ToolkitError(EXIT.INVALID, '--rule-section saves a rule proposal, which joins no concept: leave out --concept.');
    // saveSection decides the passing-remark downgrade once it knows whether the section is new.
    return saveSection(flags, ctx, deps, { conceptKey: concept });
  }
  // A whole record: new unless --expect names a version of one already there.
  const expectGiven = str(flags, 'expect');
  const downgraded = passingRemarkDowngrade(flags, deps.project, ctx.env, { adds: expectGiven === undefined || expectGiven === 'absent' });
  if (flags.append === true || flags.remove === true) {
    throw new ToolkitError(EXIT.INVALID, `--${flags.remove === true ? 'remove' : 'append'} changes one section of a concept: give it with --concept <key> --section <heading>.`);
  }
  const { project, driver } = deps;
  let bodyText = await bodyInput(flags, ctx);
  if (bodyText === undefined) {
    throw new ToolkitError(EXIT.INVALID, 'Give the record text with --body <text> or --body-file <file> (use - to read standard input).');
  }
  let fromFile = {};
  const parsed = parseFrontmatter(bodyText);
  if (parsed.hasFrontmatter) {
    fromFile = parsed.data || {};
    bodyText = parsed.body;
  }
  const fileMeta = fromFile.metadata && typeof fromFile.metadata === 'object' && !Array.isArray(fromFile.metadata) ? fromFile.metadata : {};
  const pick = (flag, field, alt) => {
    const v = str(flags, flag);
    if (v !== undefined) return v;
    const f = fromFile[field] !== undefined && fromFile[field] !== null ? fromFile[field] : alt;
    return f === undefined || f === null ? undefined : String(f);
  };
  // A body file in the model's format has metadata.type, and name is the whole key.
  // A rule proposal (--rule-section) is typed user: the owner's own preference.
  const ruleSectionFlag = str(flags, 'rule-section');
  const type = pick('type', 'type', fileMeta.type) ?? (ruleSectionFlag !== undefined ? 'user' : undefined);
  const name = pick('name', 'name');
  let ruleExtra = null;
  if (ruleSectionFlag !== undefined) {
    if (flags.proposal !== true) {
      throw new ToolkitError(EXIT.INVALID, '--rule-section saves a rule proposal for the owner\'s yes or no, so it goes with --proposal. When the owner asked for the rule himself, write it with toolkit rule add --section \'<area>\' --text \'<instruction>\' --source \'<who said it, where>\'.');
    }
    ruleExtra = { rule_section: assertArea(ruleSectionFlag), rule_scope: 'project' };
  }
  // feedback_ is retired (Mike, 2026-09-29): a new record of that type is an
  // instruction, so it is a rule. --expect absent is a new record too; only
  // --expect <version> (a change of a record already there) goes on.
  if (type && isRetiredType(String(type).trim().toLowerCase()) && (expectGiven === undefined || expectGiven === 'absent')) {
    const probe = name ? normalizeRecord({ type: 'feedback', name }) : null;
    throw retiredTypeError(probe && isValidKey(probe.key) ? probe.key : null, 'toolkit memory save');
  }
  const description = pick('description', 'description');
  const sectionFlag = str(flags, 'section');
  const title = str(flags, 'title');
  // --section with --type and --name: the concept that key names gets the
  // section when it exists; otherwise a new concept starts with it.
  if (sectionFlag !== undefined && type && name) {
    const probe = normalizeRecord({ type, name });
    if (RECORD_TYPES.includes(probe.type) && isValidKey(probe.key)) {
      const there = await driver.get(probe.key).catch(() => null);
      if (there) return saveSection(flags, ctx, deps, { conceptKey: probe.key, bodyText, keepSummary: true, downgraded });
    }
  }
  const missing = [['type', type], ['name', name], ['description', description]].filter(([, v]) => !v).map(([n]) => `--${n}`);
  if (missing.length) throw new ToolkitError(EXIT.INVALID, `toolkit memory save needs ${missing.join(', ')}.`);
  let heading = null;
  if (sectionFlag !== undefined) {
    heading = assertHeading(sectionFlag);
    const probe = normalizeRecord({ type, name });
    // An event holds one episode, and --lesson never writes to one, so it gets no Gotchas and lessons section.
    bodyText = newConceptBody(title || titleFromName(probe.name), heading, sectionText(bodyText, heading), { lessons: probe.type !== 'event' });
  } else if (title !== undefined) {
    bodyText = withBodyTitle(bodyText, title);
  }
  return saveRecord(ctx, deps, {
    type,
    name,
    description,
    bodyText,
    fromFile,
    fileMeta,
    heading,
    approvedBy: str(flags, 'approved-by'),
    authorizationFlag: str(flags, 'authorization'),
    proposal: flags.proposal === true,
    allowSimilar: flags['allow-similar'] === true,
    // A rule proposal joins no concept, so no concept is suggested for it.
    newConcept: flags['new-concept'] === true || Boolean(ruleExtra),
    ...(ruleExtra ? { extra: ruleExtra } : {}),
    downgraded,
    notARule: flags['not-a-rule'] === true,
    statusGiven: pick('status', 'status'),
    source: pick('source', 'source'),
    lastVerified: pick('last-verified', 'last_verified'),
    supersedesFlag: str(flags, 'supersedes'),
    expect: str(flags, 'expect'),
    mode: approvalMode(project),
  });
}

/**
 * Save one whole record (the form every save had before concept memory). input:
 * { type, name, description, bodyText, fromFile, fileMeta, heading, approvedBy,
 * authorizationFlag, proposal, allowSimilar, newConcept, statusGiven, source,
 * lastVerified, supersedesFlag, expect, mode, extra, target }. extra: frontmatter
 * fields to add (a proposal's concept and section); target: the concept a
 * section proposal names (then no concept is suggested).
 */
async function saveRecord(ctx, { project, driver }, input) {
  const {
    type, name, description, fromFile = {}, fileMeta = {}, approvedBy, authorizationFlag, proposal, allowSimilar, newConcept, mode,
  } = input;
  const bodyText = input.bodyText;
  if (proposal && (approvedBy !== undefined || authorizationFlag !== undefined)) {
    throw new ToolkitError(EXIT.INVALID, 'A proposal has no approver yet, so --proposal cannot go with --approved-by or --authorization. Save it as a proposal now, and record the owner\'s answer later with toolkit memory approve or reject.');
  }
  const statusGiven = input.statusGiven;
  if (proposal && statusGiven !== undefined && contractStatus(statusGiven) !== 'needs-review') {
    throw new ToolkitError(EXIT.INVALID, `A proposal is saved with the status needs-review, not "${statusGiven}". Leave out --status.`);
  }
  let source = input.source;
  const probe = normalizeRecord({ type, name });
  const key = probe.key;
  const notRule = instructionRefusal(project, ctx.env, { type: probe.type, fact: factLine(bodyText, description), what: key, proposal, notARule: input.notARule });
  if (notRule) throw notRule;
  const existing = RECORD_TYPES.includes(probe.type) && probe.name ? await driver.get(key).catch(() => null) : null;
  if (proposal && existing && !isProposal(existing)) {
    throw new ToolkitError(EXIT.INVALID, `${key} is already a ${existing.status === 'retired' ? storedStatus(existing) : existing.status} record, so it was not saved as a proposal. A proposal never replaces a record the owner approved.`, {
      key,
      fix: input.target
        ? `Give the proposal another name with --name, or ask the owner about the change in the conversation.`
        : `To propose a new fact for this concept, save it with --proposal --concept ${key} --section '<heading>'. Or ask the owner about the change in the conversation.`,
    });
  }
  // Concept memory (verifier, 2026-09-28): a one-fact proposal whose key
  // names its fact is not approved by saving it again under that key; the
  // owner's yes goes through toolkit memory approve --concept, which names the
  // concept it goes in. A body with "## " sections is a concept already.
  if (existing && isProposal(existing) && !proposal && (approvedBy !== undefined || authorizationFlag !== undefined)
    && probe.type !== 'event' && !proposalTarget(existing) && isOneFact(bodyText)) {
    throw new ToolkitError(EXIT.INVALID, `${key} was not saved: it is a proposal that starts a new concept, and its key names the fact, not a concept. Record the owner's yes with toolkit memory approve, which names the concept, then change the fact's section with his words.`, {
      key,
      fix: `toolkit memory approve ${key} --by ${approvedBy ? shellQuote(approvedBy) : '<owner>'} --concept ${probe.type}_<subject> (a new concept also takes --title and --description), then toolkit memory get <concept> --json and toolkit memory save --concept <concept> --section '<heading>' --body-file <file> --expect <version> --approved-by <owner>.`,
    });
  }
  if (!source && existing && existing.source) source = existing.source;
  if (!source) source = approvedBy ? `${approvedBy}, ${today()}` : `Agent session, ${today()}`;

  // An update keeps what the caller did not give again. A record that needed
  // review and is saved again has just been checked, so it is verified today.
  let lastVerified = input.lastVerified;
  if (lastVerified === undefined && existing && existing.last_verified && existing.status !== 'needs-review') {
    lastVerified = existing.last_verified;
  }
  const extra = { ...((existing && existing.extra) || {}) };
  for (const [k, v] of Object.entries(fromFile)) {
    if (!KNOWN_FIELDS.includes(k) && k !== 'key' && v !== undefined) extra[k] = v;
  }
  for (const [k, v] of Object.entries(input.extra || {})) if (v !== undefined && v !== null) extra[k] = v;

  // authorization, in the model's words.
  let authorization = authorizationFlag;
  if (!authorization && approvedBy) authorization = approvalText(approvedBy, today());
  if (!authorization && proposal) authorization = proposalText(today());
  if (!authorization && fromFile.authorization) authorization = String(fromFile.authorization);
  if (!authorization && existing && existing.authorization) authorization = existing.authorization;
  if (!authorization) authorization = mode === 'trusted' ? 'Trusted grant' : NO_AUTHORIZATION;

  // A proposal stays a proposal until the owner answers: saving it again
  // without his approval keeps it needs-review, and only an approver (or
  // toolkit memory approve) makes it current.
  let status = statusGiven;
  if (proposal) status = 'needs-review';
  else if (isProposalAuthorization(authorization)) {
    if (status !== undefined && contractStatus(status) !== 'needs-review') {
      throw new ToolkitError(EXIT.INVALID, `${key} is a proposal the owner has not answered, so it cannot be saved as ${status}.`, {
        key,
        fix: `Record his yes with toolkit memory approve ${key} --by <name>, or save it again with --approved-by <name> and --expect <version> (the version field of toolkit memory get ${key} --json).`,
      });
    }
    status = 'needs-review';
  }
  if (status === undefined) status = 'current';

  const supersedesFlag = input.supersedesFlag;
  const supersedes = supersedesFlag === undefined ? undefined : canonicalKey(supersedesFlag);
  const supersedesAll = supersedesList([...((existing && existing.supersedes) || []), ...supersedesList(fromFile.supersedes)]);
  if (supersedes && supersedes !== key && !supersedesAll.includes(supersedes)) supersedesAll.push(supersedes);

  const record = {
    type,
    name,
    description,
    source,
    status,
    last_verified: lastVerified,
    // Concept memory: the date of this change, at the top of the record.
    updated: today(),
    authorization,
    approved_by: approvedBy ?? null,
    supersedes: supersedesAll,
    body: bodyText,
  };
  const metadata = { ...((existing && existing.metadata) || {}), ...fileMeta };
  if (Object.keys(metadata).some((k) => k !== 'type')) record.metadata = metadata;
  if (Object.keys(extra).length) record.extra = extra;
  // A retired record keeps its word (superseded or archived) and its replacement:
  // from the frontmatter, the body's Superseded line, or the stored record.
  const word = String(record.status).trim().toLowerCase();
  if (word === 'retired' || word === 'superseded') {
    const kept = existing && existing.status === 'retired' && storedStatus(existing) === 'superseded' ? existing.superseded_by : null;
    record.superseded_by = fromFile.superseded_by ?? supersededByFromBody(bodyText) ?? kept ?? null;
    if (word === 'retired' && existing && existing.status === 'retired') record.stored_status = storedStatus(existing);
  }

  // The duplicate check (Mike, 2026-09-27): the same key, or a record with a
  // very similar description or text, stops the save unless the caller says
  // it is meant: --expect <version> (an update of the record read), or
  // --supersedes, or --allow-similar. Concept memory (Mike, 2026-09-28): a
  // new record whose words match an existing concept of the same type is not
  // saved either; the error names the concept it belongs in, unless
  // --new-concept (or --allow-similar) says it is a new concept.
  const expect = input.expect;
  const updating = expect !== undefined && expect !== 'absent';
  if (!allowSimilar && !supersedes && !updating && isValidKey(key) && RECORD_TYPES.includes(probe.type)) {
    const similar = [];
    if (existing && expect !== 'absent') {
      similar.push({ key: existing.key, description: existing.description, status: existing.status, proposal: isProposal(existing), why: 'the same key', version: existing.version });
    }
    const candidate = normalizeRecord({ type, name, description, body: bodyText }, { today: today() });
    const found = await findSimilar(driver, candidate);
    const sameFact = found.filter((s) => s.why !== CLOSEST_WHY);
    if (similar.length || sameFact.length) throw duplicateError(key, [...similar, ...sameFact]);
    // --new-concept: the caller read the concept the check named and says this is another one.
    if (!newConcept) {
      if (!existing && !input.target) {
        const words = { key, type: probe.type, name: probe.name, description, heading: input.heading };
        let belongs = await suggestConcept(driver, words, { ignore: ownerWords(project) });
        // A record about the same subject (the search's closest match) of the same type is the concept too.
        if (!belongs) {
          const subject = found.find((s) => s.why === CLOSEST_WHY && splitKey(s.key) && splitKey(s.key).type === probe.type && probe.type !== 'event' && !s.proposal);
          if (subject) {
            const rec = await driver.get(subject.key).catch(() => null);
            if (rec && rec.status !== 'retired') belongs = { key: rec.key, title: bodyTitle(rec.body) || titleFromName(rec.name), description: rec.description, score: 0, shared: [], heading: subject.section || null };
          }
        }
        if (belongs) throw belongsError(key, belongs, { heading: input.heading || bodyTitle(candidate.body) || titleFromName(probe.name), proposal });
      }
      if (found.length) throw duplicateError(key, found);
    }
  }

  const result = await driver.save(record, { expect });

  let retired = null;
  let retireError = null;
  let retireResult = null;
  if (supersedes && supersedes !== result.key) {
    try {
      retireResult = await driver.retire(supersedes, { supersededBy: result.key });
      retired = supersedes;
    } catch (err) {
      retireError = err;
    }
  }
  const linksRepaired = (retireResult && retireResult.linksRepaired) || [];
  // The replaced record leaves the briefing cache now, even when the refresh fails.
  await afterWrite(project, driver, { forget: retired ? [retired] : [] });

  const saved = result.record || {};
  const isProp = isProposal(saved.status ? saved : record);
  const target = input.target || null;
  const rule = record.extra && record.extra.rule_section ? { section: record.extra.rule_section, scope: record.extra.rule_scope || 'project' } : null;
  const lines = [isProp && rule
    ? `Saved to memory as a rule proposal: ${result.key} (${result.created ? 'new record' : 'updated'}). It is not a rule until the owner answers. His yes adds it to ${PROJECT_RULE_PATH}, section "${rule.section}": toolkit memory approve ${result.key} --by <name> (--section '<area>' names another section, --text '<instruction>' other words). His no: toolkit memory reject ${result.key}.`
    : isProp
      ? `Saved to memory as a proposal: ${result.key} (${result.created ? 'new record' : 'updated'})${target ? `, for the concept ${target.concept}, section "${target.section}"` : ''}. It is not a fact until the owner answers. Record his yes with ${approveCommand({ ...record, key: result.key, extra: target ? { concept: target.concept } : record.extra })}${target ? ` (it is then added to ${target.concept})` : ''}, or his no with toolkit memory reject ${result.key}.`
      : `Saved to memory: ${result.key} (${result.created ? 'new record' : 'updated'}).`];
  if (input.downgraded) lines.push(downgradeLine({ ...input.downgraded, concept: target ? target.concept : null }, result.key));
  lines.push(`Where: ${driver.location}`);
  lines.push(`Version: ${short(result.version)}`);
  if (approvedBy) lines.push(`Approved by: ${approvedBy}`);
  // The approval policy (memory-save) says to ask first in onboarding mode; a
  // save with no approver and no --proposal is the mistake it names.
  const unapproved = !isProp && authorization === NO_AUTHORIZATION && mode !== 'trusted';
  if (unapproved) lines.push(`Note: ${result.key} was saved with no approval recorded. Memory is in onboarding mode, so the owner is asked first ("Save to memory: <one line>?"): save again with --approved-by <owner> and --expect ${short(result.version)} after his yes, or with --proposal while he has not answered.`);
  if (retired) lines.push(`${retired} is now superseded by ${result.key}.`);
  lines.push(...repairLines(retireResult));
  // The memory-save skill's reply line, ready to use word for word (final
  // runs: replies paraphrased it in three of five runs).
  const title = recordTitle(saved.body ? saved : { body: bodyText, description, key: result.key });
  const reply = isProp ? REPLY.proposal(title) : unapproved ? null : result.created ? REPLY.saved(title) : REPLY.updated(title);
  if (reply) lines.push(replyLine(reply));
  out(ctx, lines, {
    ok: true,
    action: 'save',
    replyLine: reply,
    key: result.key,
    created: result.created,
    version: result.version,
    backend: driver.backend,
    location: driver.location,
    path: result.record && result.record.path ? result.record.path : null,
    approved_by: approvedBy ?? null,
    authorization,
    proposal: isProp,
    ...(target ? { concept: target.concept, section: { heading: target.section, action: 'proposed' } } : {}),
    ...(rule ? { rule } : {}),
    ...(input.downgraded ? { downgraded: { from: 'approved-by', by: input.downgraded.by } } : {}),
    unapproved,
    retired,
    linksRepaired,
    ...(retireResult && retireResult.linksFailed ? { linksFailed: retireResult.linksFailed } : {}),
    ...(retireResult && retireResult.reformatted ? { reformatted: retireResult.reformatted } : {}),
  });
  if (retireError) {
    throw new ToolkitError(retireError.code || EXIT.ERROR, `${result.key} was saved, but ${supersedes} was not retired: ${retireError.message}`, {
      key: result.key,
      supersedes,
    });
  }
  return EXIT.OK;
}

/**
 * The error for a new record whose words match an existing concept (concept
 * memory): the concept it belongs in, and the command that adds it there.
 */
function belongsError(key, belongs, { heading, proposal }) {
  const what = belongs.title ? `"${belongs.title}"` : belongs.key;
  const shared = belongs.shared && belongs.shared.length ? `, which shares its words (${belongs.shared.join(', ')})` : ', which is about the same subject';
  const lines = [`${key} was not saved: it belongs in the concept ${belongs.key} (${what})${shared}.`];
  if (belongs.description) lines.push(`- ${belongs.key}: ${belongs.description}`);
  const flags = proposal ? '--proposal' : '<the same --approved-by or --proposal>';
  const fix = [
    `Add it there as a section: toolkit memory save --concept ${belongs.key} --section ${shellQuote(heading)} --body-file <file> ${flags} (the same text; read ${belongs.key} first with toolkit memory get ${belongs.key}).`,
    belongs.heading ? `Or add it under its section "${belongs.heading}" with --section ${shellQuote(belongs.heading)} --append.` : '',
    'When it is a different concept, save it again with --new-concept.',
  ].filter(Boolean).join(' ');
  return new ToolkitError(EXIT.INVALID, lines.join('\n'), {
    key,
    suggestion: { concept: belongs.key, title: belongs.title || null, description: belongs.description || '', heading: belongs.heading || null, section: heading, shared: belongs.shared || [] },
    fix,
  });
}

/**
 * The command that records the owner's yes to a proposal. A one-fact
 * proposal that names no concept needs --concept: its key names the fact, and
 * approve asks the agent to name the concept (concept memory).
 */
export function approveCommand(rec) {
  const r = rec || {};
  const plain = `toolkit memory approve ${r.key} --by <name>`;
  const extra = r.extra && typeof r.extra === 'object' ? r.extra : {};
  if (extra.rule_section || r.rule_section || r.type === 'feedback') return plain;
  if (proposalTarget(r) || r.type === 'event' || (r.body !== undefined && !isOneFact(r.body))) return plain;
  const parts = splitKey(r.key);
  return `${plain} --concept ${parts ? parts.type : '<type>'}_<subject> (the concept it goes in: an existing one, or a new one named for its subject, with --title and --description)`;
}

/** True when a section's text already records this approval (the same approver, any date). */
function approvalRecorded(text, authorization) {
  const who = /^approved by\s+(.+?)(?:\s+on\s+\d{4}-\d{2}-\d{2})?$/i.exec(String(authorization || '').trim());
  if (who) return new RegExp(`\\bApproved by ${who[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(String(text || ''));
  return String(text || '').includes(String(authorization || '').trim());
}

/** True when a text shares a search word (stem) with a heading. */
function sharesWords(text, heading) {
  const have = new Set(stems(searchTerms(text)));
  return stems(searchTerms(heading)).some((w) => have.has(w));
}

/** The line for a save --type/--name --section that kept the concept's summary. */
function summaryKeptLine(key, summary) {
  return `The summary of ${key} was kept: "${summary}". --description with --type and --name names a new concept; to change this concept's summary, save with --concept ${key} --section '<heading>' --description '<new summary>'.`;
}

/**
 * The fact of a section that another section of the same concept already
 * holds: the heading of that section, or null. Compared as the duplicate
 * check compares two records (lib/memory/similar.mjs).
 */
function sectionTwin(record, heading, text) {
  const mine = bodyPoints(text).map((p) => bodyWords(p.text)).filter((w) => new Set(w).size >= 5);
  if (!mine.length) return null;
  for (const p of bodyPoints(record.body)) {
    if (p.heading && sameHeading(p.heading, heading)) continue;
    const theirs = bodyWords(p.text);
    if (new Set(theirs).size < 5) continue;
    if (mine.some((w) => overlap(w, theirs) >= SIMILAR_AT)) return p.heading || bodyTitle(record.body) || record.key;
  }
  return null;
}

/**
 * save --concept <key> --section <heading>: add, replace, append to, or
 * remove one section of an existing concept. Every other line of the record
 * stays as it was (lib/memory/concepts.mjs editConceptText), and the driver
 * holds its lock for the whole change (built-in) or checks the version it read
 * (Hindsight, Notion). Notion sends only the changed section. With --proposal
 * the fact is saved as its own proposal record that names this concept.
 */
async function saveSection(flags, ctx, deps, { conceptKey, bodyText: given, keepSummary = false, downgraded: early = null }) {
  const { project, driver } = deps;
  const key = assertKey(conceptKey);
  const sectionFlag = str(flags, 'section');
  if (sectionFlag === undefined) {
    throw new ToolkitError(EXIT.INVALID, 'toolkit memory save --concept needs --section <heading>: the sub-topic this fact goes under, for example --section \'Deploy window\'.', { key });
  }
  const heading = assertHeading(sectionFlag);
  const remove = flags.remove === true;
  const append = flags.append === true;
  let downgraded = early;
  let proposal = flags.proposal === true;
  if (remove && (append || proposal)) throw new ToolkitError(EXIT.INVALID, `--remove cannot go with --${append ? 'append' : 'proposal'}.`);
  if (str(flags, 'status') !== undefined) throw new ToolkitError(EXIT.INVALID, 'A section save keeps the concept\'s status. Leave out --status.');
  if (str(flags, 'supersedes') !== undefined) {
    throw new ToolkitError(EXIT.INVALID, 'A section save does not replace records. To move whole records into this concept, use toolkit memory merge <key> --into ' + key + ' --approved-by <owner>.');
  }
  let approvedBy = str(flags, 'approved-by');
  let authorizationFlag = str(flags, 'authorization');
  if (proposal && (approvedBy !== undefined || authorizationFlag !== undefined)) {
    throw new ToolkitError(EXIT.INVALID, 'A proposal has no approver yet, so --proposal cannot go with --approved-by or --authorization. Save it as a proposal now, and record the owner\'s answer later with toolkit memory approve or reject.');
  }
  let bodyText = given !== undefined ? given : await bodyInput(flags, ctx);
  if (remove && bodyText !== undefined && given === undefined) throw new ToolkitError(EXIT.INVALID, '--remove takes no text: leave out --body and --body-file.');
  if (!remove && bodyText === undefined) {
    throw new ToolkitError(EXIT.INVALID, `Give the text of the section "${heading}" with --body <text> or --body-file <file> (use - to read standard input).`);
  }
  if (bodyText !== undefined) {
    const parsed = parseFrontmatter(bodyText);
    if (parsed.hasFrontmatter) bodyText = parsed.body;
  }
  const current = await driver.get(key);
  if (!current) {
    const parts = splitKey(key);
    throw new ToolkitError(EXIT.ERROR, `There is no memory record ${key}, so the section "${heading}" was not saved.`, {
      key,
      fix: parts
        ? `To start that concept, save it with --type ${parts.type} --name ${parts.name} --description '<one-line summary of the concept>' --section ${shellQuote(heading)}. toolkit memory list shows the concepts there are.`
        : 'Run toolkit memory list to see the concepts.',
    });
  }
  if (current.status === 'retired') {
    throw new ToolkitError(EXIT.INVALID, `${key} is ${storedStatus(current)}, so the section "${heading}" was not saved.`, {
      key,
      fix: current.superseded_by ? `Add it to the record that replaced it: --concept ${current.superseded_by}.` : `Restore it first with toolkit memory restore ${key}, or add the section to another concept.`,
    });
  }
  if (isProposal(current)) {
    throw new ToolkitError(EXIT.INVALID, `${key} is a proposal the owner has not answered, so no section is added to it.`, {
      key,
      fix: `Ask him about it first: his yes is toolkit memory approve ${key} --by <name>, his no toolkit memory reject ${key}.`,
    });
  }
  // What the save adds: a section the concept does not have yet, or more text under one.
  const newSection = getSection(current.body, heading) === null;
  // feedback_ is retired: no new fact goes into a feedback_ concept, whatever
  // --expect it carries (verifier, 2026-09-29). Removing a section, or
  // replacing one read with --expect (moving it out), still works.
  if (isRetiredType(current.type) && !remove && (newSection || append || str(flags, 'expect') === undefined)) throw retiredTypeError(key, 'toolkit memory save');
  // A remark made in passing: a new section, or text added under one, is saved
  // as a proposal, even with the concept's --expect version (verifier,
  // 2026-09-29). The proposal is a record of its own, so that version is not
  // its version.
  if (!downgraded && !remove) {
    downgraded = passingRemarkDowngrade(flags, project, ctx.env, { adds: newSection || append });
    if (downgraded) {
      delete flags.expect;
      proposal = true;
      approvedBy = undefined;
      authorizationFlag = undefined;
    }
  }
  const typeFlag = str(flags, 'type');
  if (typeFlag !== undefined && typeFlag !== current.type) {
    throw new ToolkitError(EXIT.INVALID, `--type ${typeFlag} does not match ${key}, which is a ${current.type} record. A concept's facts share its type; leave out --type, or save the fact to a ${typeFlag} concept.`, { key });
  }
  // Text added under a section that already has its Remember label gets no
  // second one (verifier, 2026-09-28).
  const under = getSection(current.body, heading);
  const hasRemember = under !== null && /^\s*\*\*Remember:\*\*/m.test(under);
  let text = remove ? '' : sectionText(bodyText, heading, { remember: !(append && hasRemember && !proposal) });
  const source = str(flags, 'source');
  if (!remove && source && !/\*\*Evidence and limits:\*\*/.test(text)) text = withEvidence(text, `${source.replace(/[.\s]+$/, '')}.`);
  // save --type/--name --section to a concept that exists: --description
  // there was written for a new concept, so the concept keeps its summary and
  // the output says so (verifier, 2026-09-28: the summary was replaced
  // without a word). With --concept, --description sets the summary.
  if (!remove) {
    const notRule = instructionRefusal(project, ctx.env, { type: current.type, fact: factLine(text, heading), what: `The section "${heading}" of ${key}`, proposal, notARule: flags['not-a-rule'] === true });
    if (notRule) throw notRule;
  }
  const descriptionFlag = str(flags, 'description');
  const description = keepSummary && !proposal ? undefined : descriptionFlag;
  const summaryKept = keepSummary && !proposal && descriptionFlag !== undefined && oneLineOf(descriptionFlag) !== current.description;
  const allowSimilar = flags['allow-similar'] === true || flags['new-concept'] === true;

  // The duplicate check, for one fact: another section of this concept, or
  // another record, that already holds the same fact.
  if (!remove && !allowSimilar) {
    const twin = sectionTwin(current, heading, text);
    if (twin) {
      throw new ToolkitError(EXIT.INVALID, `The section "${heading}" was not saved: ${key} already holds this fact under "${twin}".`, {
        key,
        similar: [{ key, section: twin, why: 'very similar text' }],
        fix: `Read it with toolkit memory get ${key} --json. To change that section, save it with --section ${shellQuote(twin)} --expect <version>. When it is a different fact, add --allow-similar.`,
      });
    }
    const candidate = { key, description: oneLineOf(rememberText(text)) || heading, body: `# ${heading}\n\n${text}\n` };
    const others = (await findSimilar(driver, candidate)).filter((s) => s.why !== CLOSEST_WHY);
    if (others.length) throw duplicateError(`The section "${heading}" of ${key}`, others, { section: true });
  }

  if (proposal) {
    const nameFlag = str(flags, 'name');
    const name = nameFlag !== undefined ? nameFlag : `proposal-${normalizeName(heading).slice(0, 48).replace(/-+$/, '')}`;
    const proposalKey = keyFor(current.type, normalizeName(name));
    const expectProposal = str(flags, 'expect');
    if (expectProposal === undefined && await driver.get(proposalKey).catch(() => null)) {
      throw new ToolkitError(EXIT.INVALID, `The proposal was not saved: memory already has a record ${proposalKey}.`, {
        key: proposalKey,
        fix: `When it is the same proposal, ask the owner about it (toolkit memory get ${proposalKey}). Otherwise give this one another name with --name <slug>.`,
      });
    }
    return saveRecord(ctx, deps, {
      type: current.type,
      name,
      description: description !== undefined ? description : oneLineOf(rememberText(text)) || heading,
      bodyText: `# ${heading}\n\n${text}\n`,
      proposal: true,
      allowSimilar: true,
      newConcept: true,
      source,
      lastVerified: str(flags, 'last-verified'),
      expect: expectProposal,
      mode: approvalMode(project),
      extra: { concept: key, section: heading },
      target: { concept: key, section: heading },
      downgraded,
    });
  }

  const expect = str(flags, 'expect');
  const existingText = getSection(current.body, heading);
  const mode = remove ? 'remove' : append ? 'append' : 'set';
  const replaceRefusal = () => new ToolkitError(EXIT.INVALID, `${key} already has a section "${heading}", so it was not changed.`, {
    key,
    section: heading,
    version: current.version,
    fix: `To replace its text, read it with toolkit memory get ${key} --json and save again with --expect <version>. To add this fact under it, add --append. To keep both apart, give a new --section heading.`,
  });
  if (remove) {
    if (existingText === null) {
      throw new ToolkitError(EXIT.INVALID, `${key} has no section "${heading}", so nothing was removed.`, {
        key,
        sections: conceptParts(current.body).sections.map((s) => s.heading),
        fix: `toolkit memory get ${key} shows its sections.`,
      });
    }
    if (expect === undefined) {
      throw new ToolkitError(EXIT.INVALID, `Removing the section "${heading}" loses its text, so it needs --expect <version>.`, {
        key,
        fix: `Read it with toolkit memory get ${key} --json (keep that read: it is the undo), then run the command again with --expect <version>.`,
      });
    }
  } else if (mode === 'set' && existingText !== null && expect === undefined) {
    throw replaceRefusal();
  }
  // The approval of this save: the owner's, or trusted mode. It is not written
  // over the concept's own authorization line (verifier, 2026-09-28: one
  // unapproved section changed an approved concept to "No approval
  // recorded", and one approved section re-dated every earlier fact). When it
  // differs from the concept's, the section records it on its Evidence line
  // (approvalNote in lib/memory/contract.mjs).
  const mode2 = approvalMode(project);
  const day = today();
  let authorization = authorizationFlag;
  if (!authorization && approvedBy) authorization = approvalText(approvedBy, day);
  if (!authorization) authorization = mode2 === 'trusted' ? 'Trusted grant' : NO_AUTHORIZATION;
  // For --append, a paragraph the section already holds counts as the same
  // text, with or without its Remember label.
  const para = (p) => p.trim().replace(/^\*\*Remember:\*\*\s*/, '');
  const sameText = !remove && existingText !== null
    && ((mode === 'set' && existingText === text) || (mode === 'append' && existingText.split(/\n\s*\n/).map(para).includes(para(text))));
  // The owner approves a section that is already there, word for word: the
  // text stays and his approval is recorded in it.
  const noteNow = approvalNote(authorization, current.authorization, day);
  const approvalOnly = sameText && (approvedBy !== undefined || authorizationFlag !== undefined)
    && (new RegExp(UNAPPROVED_NOTE_RE.source).test(existingText) || (noteNow !== null && !approvalRecorded(existingText, authorization)));
  if (sameText && !approvalOnly && description === undefined && str(flags, 'title') === undefined) {
    const title = bodyTitle(current.body) || titleFromName(current.name);
    const lines = [`Nothing changed: the section "${heading}" of ${key} (${title}) already says this.`];
    if (summaryKept) lines.push(summaryKeptLine(key, current.description));
    out(ctx, lines, {
      ok: true, action: 'save', key, concept: key, section: { heading, action: 'unchanged' }, created: false, version: current.version, backend: driver.backend, changed: false,
    });
    return EXIT.OK;
  }

  const title = str(flags, 'title');
  const lastVerified = str(flags, 'last-verified');
  const res = await editRecordWith(driver, key, (stored) => {
    if (mode === 'set' && !approvalOnly && expect === undefined && getSection(stored.body, heading) !== null) throw replaceRefusal();
    const note = remove ? null : approvalNote(authorization, stored.authorization, day);
    const content = approvalOnly ? (getSection(stored.body, heading) ?? text) : text;
    const edited = editConceptText(stored.text, key, {
      heading,
      content,
      mode: approvalOnly ? 'set' : mode,
      day,
      title,
      note,
      // New text for the whole section: an older "no approval recorded" note goes.
      dropUnapproved: !remove && (mode === 'set' || approvalOnly),
      fields: { description, last_verified: lastVerified },
    });
    return { text: edited.text, action: edited.action, heading: edited.heading, previous: edited.previous, note };
  }, { expect });
  // A removed section: links to it in other notes now point at the concept itself.
  let relinked = null;
  if (res.action === 'removed') {
    const change = { kind: 'unanchor', from: key, fromPath: `${key}.md`, headings: [res.heading || heading] };
    relinked = typeof driver.relink === 'function'
      ? await driver.relink(change, { skip: [] })
      : repairResult(await repairLinksWithDriver(driver, change));
  }
  await afterWrite(project, driver);

  const stored = res.record || {};
  const conceptTitle = bodyTitle(stored.body) || bodyTitle(current.body) || titleFromName(current.name);
  const h = res.heading || heading;
  const action = approvalOnly && res.action !== 'unchanged' ? 'approved' : res.action;
  const verbs = {
    added: `added the section "${h}" to`,
    replaced: `replaced the text of the section "${h}" in`,
    appended: `added to the section "${h}" in`,
    approved: `recorded the approval of the section "${h}" in`,
    removed: `removed the section "${h}" from`,
    unchanged: `saved the section "${h}" of`,
  };
  const lines = [action === 'removed'
    ? `Removed from memory: the section "${h}" of ${key} (${conceptTitle}).`
    : `Saved to memory: ${verbs[action] || verbs.unchanged} ${key} (${conceptTitle}).`];
  lines.push(`Where: ${driver.location}`);
  lines.push(`Version: ${short(res.version)}`);
  if (approvedBy) lines.push(`Approved by: ${approvedBy}`);
  if (res.note) lines.push(`The section records its own approval ("${res.note}"), because the concept's authorization line ("${current.authorization || NO_AUTHORIZATION}") covers its other facts. That line was not changed.`);
  if (summaryKept) lines.push(summaryKeptLine(key, current.description));
  else if (description !== undefined && stored.description && current.description !== stored.description) {
    lines.push(`The summary of ${key} changed from "${current.description}" to "${stored.description}".`);
  }
  const unapproved = authorization === NO_AUTHORIZATION && mode2 !== 'trusted';
  if (unapproved) lines.push(`Note: this change to ${key} was saved with no approval recorded. Memory is in onboarding mode, so the owner is asked first ("Save to memory: <one line>?"): save the section again with --approved-by <owner> and --expect ${short(res.version)} after his yes, or propose it with --proposal while he has not answered.`);
  if (relinked) lines.push(...repairLines(relinked));
  // A summary that does not name the new sub-topic may be stale (close-out
  // 2026-09-28, finding 9: "How Mike prefers to review" stayed after a test
  // runner section was added).
  if (action === 'added' && description === undefined && !sharesWords(stored.description || current.description, h)) {
    lines.push(`Check the summary of ${key}: "${stored.description || current.description}" does not name "${h}". When it no longer covers the concept, save this section again with --description '<new one-line summary>' and --expect ${short(res.version)}.`);
  }
  if (action === 'added') lines.push(`Undo: toolkit memory save --concept ${key} --section ${shellQuote(h)} --remove --expect ${short(res.version)}`);
  else if (action === 'removed') {
    const moved = (relinked && relinked.linksRepaired) || [];
    // An undo adds the section back, but links changed by the removal stay on the concept (a builder's note of 2026-09-28).
    lines.push(`Undo: save its old text again with toolkit memory save --concept ${key} --section ${shellQuote(h)} (the --json output holds the old text as previous).${moved.length ? ` The removal pointed the links in ${moved.join(', ')} at ${key}.md; after an undo, point them back at ${key}.md#${headingAnchor(h)} and save each with toolkit memory save.` : ''}`);
  }
  else if (['replaced', 'appended', 'approved'].includes(action)) lines.push(`Undo: save the old text with --section ${shellQuote(h)} --expect ${short(res.version)} (the --json output holds it as previous).`);
  const named = `${h} (in ${conceptTitle})`;
  const reply = unapproved ? null : action === 'added' ? REPLY.saved(named) : action === 'removed' ? REPLY.removed(named) : REPLY.updated(named);
  if (reply) lines.push(replyLine(reply));
  out(ctx, lines, {
    ok: true,
    action: 'save',
    replyLine: reply,
    key,
    concept: key,
    section: { heading: h, action },
    previous: res.previous ?? null,
    created: false,
    version: res.version,
    backend: driver.backend,
    location: driver.location,
    path: stored.path || null,
    approved_by: approvedBy ?? null,
    authorization,
    ...(res.note ? { sectionApproval: res.note } : {}),
    ...(summaryKept ? { summaryKept: current.description } : {}),
    proposal: false,
    unapproved,
    retired: null,
    ...repairFields(relinked),
  });
  return EXIT.OK;
}

/**
 * save --concept <key> --lesson <heading> [--body <text>] [--source <text>]:
 * one lesson (learned know-how, not yet proven) under the concept's
 * "## Gotchas and lessons" section, as a "### <heading>" with a Seen line
 * (lib/memory/lessons.mjs). The same heading again is the same lesson seen in
 * another session: today's date joins its Seen line. A lesson is the agent's
 * own know-how, so it needs no approval; the owner's yes comes when it is
 * promoted to a rule or a skill (toolkit memory promote).
 */
async function saveLesson(flags, ctx, deps, { conceptKey, heading: headingFlag }) {
  const { project, driver } = deps;
  if (conceptKey === undefined) {
    throw new ToolkitError(EXIT.INVALID, 'A lesson goes in the concept it is about: give it with --concept <key> --lesson <heading>.');
  }
  for (const f of ['section', 'append', 'remove', 'proposal', 'approved-by', 'authorization', 'type', 'name', 'status', 'supersedes', 'rule-section']) {
    if (flags[f] !== undefined) throw new ToolkitError(EXIT.INVALID, `--lesson does not take --${f}: a lesson is a "### " heading under "## ${LESSONS_HEADING}", with a Seen line for each session.`);
  }
  const key = assertKey(conceptKey);
  const heading = assertHeading(headingFlag);
  let text = await bodyInput(flags, ctx);
  if (text !== undefined) {
    const parsed = parseFrontmatter(text);
    if (parsed.hasFrontmatter) text = parsed.body;
    if (/^#{1,3}\s/m.test(text)) throw new ToolkitError(EXIT.INVALID, 'The lesson text holds a heading of its own. Give only the text under the lesson heading.');
  }
  const current = await driver.get(key);
  if (!current) throw new ToolkitError(EXIT.ERROR, `There is no memory record ${key}, so the lesson was not saved.`, { key, fix: 'Run toolkit memory list to see the concepts.' });
  if (current.status === 'retired' || isProposal(current)) {
    throw new ToolkitError(EXIT.INVALID, `${key} is ${isProposal(current) ? 'a proposal the owner has not answered' : storedStatus(current)}, so the lesson was not saved.`, { key });
  }
  if (isRetiredType(current.type)) throw retiredTypeError(key, 'toolkit memory save --lesson');
  if (current.type === 'event') throw new ToolkitError(EXIT.INVALID, `${key} is an event, which holds one episode. Save the lesson in the concept it is about.`, { key });
  const day = today();
  const source = str(flags, 'source');
  // The same lesson already records today: nothing to write.
  const probe = addLesson(getSection(current.body, LESSONS_HEADING), heading, { text: text || '', date: day, source: source || '' });
  if (probe.action === 'unchanged') {
    const seen = (findLesson(current.body, heading) || { seen: [] }).seen;
    out(ctx, [`Nothing changed: the lesson "${probe.heading}" in ${key} already records ${day}.`], { ok: true, action: 'lesson', key, lesson: { heading: probe.heading, action: 'unchanged', seen }, version: current.version, backend: driver.backend });
    return EXIT.OK;
  }
  const res = await editRecordWith(driver, key, (stored) => {
    const had = getSection(stored.body, LESSONS_HEADING);
    const added = addLesson(had, heading, { text: text || '', date: day, source: source || '' });
    if (added.action === 'unchanged') return { text: stored.text, action: 'unchanged', heading: added.heading };
    const edited = editConceptText(stored.text, key, { heading: LESSONS_HEADING, content: added.text, mode: 'set', day });
    return { text: edited.text, action: added.action, heading: added.heading };
  }, { expect: str(flags, 'expect') });
  await afterWrite(project, driver);
  const title = bodyTitle((res.record && res.record.body) || current.body) || titleFromName(current.name);
  const lesson = findLesson((res.record && res.record.body) || '', res.heading || heading) || { seen: [] };
  const lines = [res.action === 'added'
    ? `Saved the lesson "${res.heading}" under "${LESSONS_HEADING}" in ${key} (${title}).`
    : res.action === 'seen-again'
      ? `The lesson "${res.heading}" in ${key} (${title}) came up again: ${day} was added to its Seen line (${lesson.seen.length} session${lesson.seen.length === 1 ? '' : 's'}).`
      : `Nothing changed: the lesson "${res.heading}" in ${key} already records ${day}.`];
  lines.push(`Version: ${short(res.version)}`);
  if (lesson.seen.length >= 2) lines.push(`It came up in ${lesson.seen.length} sessions, so it may be ready to become a rule or a skill: propose it to the owner with toolkit memory promote ${key} --section ${shellQuote(res.heading || heading)} --to rule (or --to skill).`);
  out(ctx, lines, { ok: true, action: 'lesson', key, lesson: { heading: res.heading || heading, action: res.action || 'unchanged', seen: lesson.seen }, version: res.version, backend: driver.backend });
  return EXIT.OK;
}

/**
 * The error for a save the duplicate check stopped: every similar record with
 * why, and the three ways on. With { section: true } the save was one section
 * of a concept, and `key` is words naming it.
 */
function duplicateError(key, similar, { section = false } = {}) {
  // Found only by the closest-match rule: about the same subject, maybe a different fact.
  const subjectOnly = similar.every((s) => s.why === CLOSEST_WHY);
  const lines = [subjectOnly
    ? `${key} was not saved: memory already has ${similar.length === 1 ? 'a record' : 'records'} about the same subject. Check whether it is the same fact.`
    : `${key} was not saved: memory already has ${similar.length === 1 ? 'a record' : 'records'} like it.`];
  for (const s of similar) {
    const flag = s.proposal ? ' (a proposal the owner has not answered)' : s.status && s.status !== 'current' ? ` (${statusWord(s.status)})` : '';
    const where = s.section ? `, in its section "${s.section}"` : '';
    lines.push(`- ${s.key}${flag}${where}, ${s.why}: ${s.description}`);
  }
  const same = similar.find((s) => s.why === 'the same key');
  const first = similar[0];
  const updateCmd = first.section
    ? `save that section with toolkit memory save --concept ${first.key} --section ${shellQuote(first.section)} --expect <version>`
    : `save that key with --expect <version>`;
  const fix = section ? [
    `Read ${first.key} with toolkit memory get ${first.key} --json. When it is the same fact, keep it, or ${updateCmd} (the version field of that read).`,
    'When it is a different fact, save the section again with --allow-similar.',
  ].join(' ') : subjectOnly ? [
    `Read ${first.key} with toolkit memory get ${first.key}.`,
    `When this is a different fact, save it again with --allow-similar.`,
    `When it is the same fact in other words, keep ${first.key}, or update it: ${updateCmd} (the version field of toolkit memory get ${first.key} --json).`,
  ].join(' ') : [
    same
      ? `To update ${same.key}, read it with toolkit memory get ${same.key} and save again with --expect ${short(same.version)}. To add a fact to it as a section, use --concept ${same.key} --section '<heading>'.`
      : `To update ${first.key}, read it with toolkit memory get ${first.key} --json, then ${updateCmd} (the version field of that read).`,
    `To replace a record with this one, add --supersedes <key>. When it is a different fact, add --allow-similar.`,
  ].join(' ');
  const proposals = similar.filter((s) => s.proposal && s.why !== 'the same key');
  const proposalFix = proposals.length
    ? ` ${proposals.map((s) => s.key).join(', ')} ${proposals.length === 1 ? 'is a proposal' : 'are proposals'} the owner has not answered: record his yes with toolkit memory approve <key> --by <name>, or his no with toolkit memory reject <key>.`
    : '';
  return new ToolkitError(EXIT.INVALID, lines.join('\n'), {
    key,
    similar: similar.map(({ version, ...rest }) => rest),
    fix: fix + proposalFix,
  });
}

// ---------------------------------------------------------------- read

async function find(argv, ctx, { driver }) {
  const { _, flags } = parseArgs(argv, { boolean: ['reflect', 'all', 'proposals'], string: ['type', 'limit', 'host'] });
  const query = _.join(' ').trim();
  if (!query) throw new ToolkitError(EXIT.INVALID, 'Give words to search for, for example: toolkit memory find deploy window.');
  const limitText = str(flags, 'limit');
  const limit = limitText === undefined ? 10 : Number(limitText);
  if (!Number.isInteger(limit) || limit < 1) throw new ToolkitError(EXIT.INVALID, '--limit must be a whole number of 1 or more.');
  const res = await driver.find(query, { reflect: Boolean(flags.reflect), limit, type: str(flags, 'type'), all: Boolean(flags.all), proposals: Boolean(flags.proposals) });
  const lines = [];
  const n = res.results.length;
  // Keyword search (built-in, Notion) lists only records that contain the words.
  // Recall (Hindsight) sorts what it found (lib/memory/hindsight.mjs recallTier):
  // res.results are about the question; res.maybe may be about it and must be
  // read before any answer; res.closest are not known to be about it. Neither
  // maybe nor closest is ever presented as an answer.
  const recall = String(res.mode || '').startsWith('recall');
  const maybe = recall && Array.isArray(res.maybe) ? res.maybe : [];
  const closest = recall && Array.isArray(res.closest) ? res.closest : [];
  if (!n) {
    if (!recall) lines.push(`No memory records match "${query}".`);
    else if (maybe.length) lines.push(`No memory record is known to be about "${query}".`);
    else lines.push(`No memory record is about "${query}".`);
  } else {
    if (recall) lines.push(`${n} memory record${n === 1 ? ' is' : 's are'} about "${query}" (Hindsight recall, best first):`);
    else lines.push(`${n} memory record${n === 1 ? ' matches' : 's match'} "${query}" (best first):`);
    for (const r of res.results) {
      lines.push(`- ${r.key}${statusFlag(r)}: ${r.description}`);
      if (r.snippet) lines.push(`    ${r.snippet}`);
    }
    lines.push('Read a record with toolkit memory get <key> before relying on it.');
  }
  if (maybe.length) {
    const one = maybe.length === 1;
    lines.push(`${one ? 'This record' : 'These records'} may ${n ? 'also ' : ''}be about it: Hindsight recall scored ${one ? 'it' : 'them'} above the rest, but ${one ? 'it shares' : 'they share'} few of its words.`);
    for (const r of maybe) lines.push(`- ${r.key}${statusFlag(r)}: ${r.description}`);
    if (n) lines.push('Read one with toolkit memory get <key> before answering from it.');
  }
  if (!n && closest.length) {
    lines.push(`Hindsight recall ranked ${maybe.length ? 'these next' : 'these closest'}, but they score low and share few of its words, so none is known to be about it:`);
    for (const r of closest) lines.push(`- ${r.key}${statusFlag(r)}: ${r.description}`);
  }
  if (!n && (maybe.length || closest.length)) {
    lines.push(`Do not answer from these. Read the first one${maybe.length ? ' that may be about it' : ''} with toolkit memory get <key>, and answer only if its text says it; otherwise say it is not in memory.`);
  }
  if (res.proposalsLeftOut) {
    const p = res.proposalsLeftOut;
    lines.push(`${p} saved proposal${p === 1 ? ' also matches' : 's also match'}; ${p === 1 ? 'it is' : 'they are'} not a fact until the owner answers. toolkit memory find ${shellQuote(query)} --proposals shows ${p === 1 ? 'it' : 'them'}.`);
  }
  if (res.answer !== undefined) {
    lines.push('', `Answer from Hindsight reflect (${(res.answerMs / 1000).toFixed(1)} s; a summary, not a source):`, res.answer || '(no answer)');
  }
  out(ctx, lines, { ok: true, backend: driver.backend, ...res });
  return EXIT.OK;
}

async function get(argv, ctx, { driver }) {
  const { _ } = parseArgs(argv, { string: ['host'] });
  const key = requireKeyArg(_, 'get');
  const rec = await driver.get(key);
  if (!rec) {
    throw new ToolkitError(EXIT.ERROR, `There is no memory record with the key ${key}.`, { key, fix: 'Run toolkit memory list --status all to see the keys.' });
  }
  let text = rec.problems && rec.problems.length
    ? `${rec.text.replace(/\s+$/, '')}\n\n[toolkit: this record breaks a rule: ${rec.problems.join(' ')}]`
    : rec.text;
  const proposal = isProposal(rec);
  if (proposal) text = `${text.replace(/\s+$/, '')}\n\n[toolkit: this is a proposal the owner has not answered. It is not a fact: do not rely on it. His yes: ${approveCommand(rec)}. His no: toolkit memory reject ${rec.key}.]`;
  out(ctx, text, { ok: true, backend: driver.backend, ...rec, proposal });
  return EXIT.OK;
}

async function list(argv, ctx, { driver }) {
  const { flags } = parseArgs(argv, { string: ['type', 'status', 'host'] });
  const records = await driver.list({ type: str(flags, 'type'), status: str(flags, 'status') });
  // Concept memory: each concept's title, one-line summary, and updated date.
  const lines = records.length ? records.map((r) => listLine(r)) : ['No memory records.'];
  out(ctx, lines, { ok: true, backend: driver.backend, records });
  return EXIT.OK;
}

/** One line of toolkit memory list: "- <key>[ status]: <title> — <summary> (updated <date>)". */
export function listLine(r) {
  const title = String(r.title || '').trim();
  const date = r.updated || r.saved ? ` (updated ${r.updated || r.saved})` : '';
  return `- ${r.key}${statusFlag(r)}: ${title ? `${title} — ` : ''}${r.description}${date}`;
}

// ---------------------------------------------------------------- lifecycle

async function retire(argv, ctx, { project, driver }) {
  const { _, flags } = parseArgs(argv, { string: ['superseded-by', 'reason', 'host'] });
  const key = requireKeyArg(_, 'retire');
  const supersededBy = str(flags, 'superseded-by');
  if (supersededBy !== undefined && canonicalKey(supersededBy) === canonicalKey(key)) {
    throw new ToolkitError(EXIT.INVALID, 'A record cannot be superseded by itself.', { key });
  }
  if (supersededBy !== undefined) {
    const replacement = await driver.get(supersededBy);
    if (!replacement) {
      throw new ToolkitError(EXIT.INVALID, `${key} was not retired: the replacement ${canonicalKey(supersededBy)} does not exist.`, {
        key,
        supersededBy: canonicalKey(supersededBy),
        fix: 'Save the new record first, or check the key with toolkit memory list --status all.',
      });
    }
    if (replacement.status === 'retired' && storedStatus(replacement) === 'archived') {
      throw new ToolkitError(EXIT.INVALID, `${key} was not retired: the replacement ${replacement.key} is archived, so a link to it would not work.`, {
        key,
        supersededBy: replacement.key,
        fix: `Restore it first with toolkit memory restore ${replacement.key}, or name a record that is in use.`,
      });
    }
  }
  const res = await driver.retire(key, { supersededBy, reason: str(flags, 'reason') });
  await afterWrite(project, driver, { forget: [res.key] });
  const by = res.record && res.record.superseded_by ? res.record.superseded_by : null;
  const lines = [by ? `Retired ${res.key}: it is superseded by ${by}.` : `Retired ${res.key}: it is archived.`];
  lines.push(...repairLines(res));
  lines.push(`Undo with: toolkit memory restore ${res.key}`);
  out(ctx, lines, {
    ok: true, action: 'retire', backend: driver.backend, key: res.key, version: res.version, superseded_by: by,
    status: by ? 'superseded' : 'archived', ...repairFields(res),
  });
  return EXIT.OK;
}

async function rename(argv, ctx, { project, driver }) {
  const { _, flags } = parseArgs(argv, { string: ['to', 'host'] });
  const key = requireKeyArg(_, 'rename');
  const to = str(flags, 'to');
  if (!to) throw new ToolkitError(EXIT.INVALID, `Give the new key with --to, for example: toolkit memory rename ${key} --to project_new_name.`, { key });
  const toParts = splitKey(canonicalKey(to));
  if (toParts && isRetiredType(toParts.type)) throw retiredTypeError(null, `toolkit memory rename ${key} --to ${to}`);
  if (typeof driver.rename !== 'function') {
    throw new ToolkitError(EXIT.UNSUPPORTED, `The ${driver.backend} memory backend cannot rename a record.`, { key });
  }
  const res = await driver.rename(key, to);
  // Proposals still waiting for the owner that name the old key as their
  // concept now name the new one, so his yes adds the fact there (verifier,
  // 2026-09-28: approve made a new concept project_proposal_freeze instead).
  const retargeted = [];
  const retargetFailed = [];
  let waiting = [];
  try {
    waiting = (await driver.list({ status: 'needs-review' })).filter((r) => r.concept === res.from);
  } catch (err) {
    retargetFailed.push({ key: '(proposals)', reason: `they could not be listed: ${err.message}` });
  }
  for (const p of waiting) {
    try {
      await editRecordWith(driver, p.key, (stored) => ({ text: editConceptText(stored.text, p.key, { day: today(), fields: { concept: res.key } }).text }));
      retargeted.push(p.key);
    } catch (err) {
      retargetFailed.push({ key: p.key, reason: err.message });
    }
  }
  await afterWrite(project, driver, { forget: [res.from] });
  const lines = [`Renamed ${res.from} to ${res.key}.`];
  const repaired = repairLines(res);
  lines.push(...(repaired.length ? repaired : ['No other note linked to it.']));
  if (retargeted.length) lines.push(`Proposals waiting for the owner now name ${res.key} as their concept: ${retargeted.join(', ')}.`);
  for (const f of retargetFailed) lines.push(`The proposal ${f.key} still names ${res.from} as its concept (${f.reason}). Approve it with --concept ${res.key}.`);
  out(ctx, lines, {
    ok: true, action: 'rename', backend: driver.backend, from: res.from, key: res.key, version: res.version, ...repairFields(res),
    proposalsRetargeted: retargeted, ...(retargetFailed.length ? { proposalsNotRetargeted: retargetFailed } : {}),
  });
  return EXIT.OK;
}

async function restore(argv, ctx, { project, driver }) {
  const { _ } = parseArgs(argv, { string: ['host'] });
  const key = requireKeyArg(_, 'restore');
  const res = await driver.restore(key);
  await afterWrite(project, driver);
  out(ctx, `Restored ${res.key}. Its status is now needs review; check it and save it again as current when it is still true.`, { ok: true, action: 'restore', backend: driver.backend, key: res.key, version: res.version, status: 'needs-review' });
  return EXIT.OK;
}

async function del(argv, ctx, { project, driver }) {
  const { _, flags } = parseArgs(argv, { boolean: ['owner-approved'], string: ['host'] });
  const key = requireKeyArg(_, 'delete');
  if (flags['owner-approved'] !== true) {
    const what = driver.backend === 'notion'
      ? 'Deleting a memory record moves it to the Notion trash, and Notion deletes it for good after 30 days'
      : 'Deleting a memory record cannot be undone';
    throw new ToolkitError(EXIT.INVALID, `${key} was not deleted. ${what}, so it needs the owner's explicit approval: add --owner-approved only after the owner said to delete it. To hide a record instead, use toolkit memory retire ${key}.`, { key });
  }
  const res = await driver.delete(key);
  await afterWrite(project, driver, { forget: [res.key] });
  // A driver that can undo a delete says how in `detail` (Notion: the page is
  // in the Notion trash for 30 days). Otherwise the delete is final.
  const detail = res.detail || 'This cannot be undone.';
  const lines = [`Deleted ${res.key}. ${detail}`];
  lines.push(...repairLines(res));
  out(ctx, lines, {
    ok: true, action: 'delete', backend: driver.backend, key: res.key, deleted: true, trash: Boolean(res.trash), detail,
    ...repairFields(res),
  });
  return EXIT.OK;
}

// ---------------------------------------------------------------- concepts: merge, split, tidy

/** --approved-by for a change of several records at once (merge, split): the owner's yes to the tidy list. */
function ownerYes(flags, what) {
  const by = str(flags, 'approved-by');
  if (!by || !by.trim()) {
    throw new ToolkitError(EXIT.INVALID, `${what} changes several records at once, so it needs the owner's yes: add --approved-by <owner> only after he said yes to it (the memory-tidy list).`);
  }
  return by.replace(/\s+/g, ' ').trim();
}

/** A concept to move facts into: the key, its type and name, and the record when it exists (checked). */
async function targetConcept(driver, into) {
  if (!into) throw new ToolkitError(EXIT.INVALID, 'Give the concept with --into <key>, for example --into project_release.');
  const key = assertKey(into);
  const parts = splitKey(key);
  if (isRetiredType(parts.type)) throw retiredTypeError(key, `Moving facts into ${key}`);
  if (parts.type === 'event') {
    throw new ToolkitError(EXIT.INVALID, `${key} is an event. An event record holds one episode, so facts are not merged into it.`, { key });
  }
  const record = await driver.get(key);
  if (record && record.status === 'retired') {
    throw new ToolkitError(EXIT.INVALID, `${key} is ${storedStatus(record)}, so nothing was moved into it.`, { key, fix: `Restore it first with toolkit memory restore ${key}, or name another concept.` });
  }
  if (record && isProposal(record)) {
    throw new ToolkitError(EXIT.INVALID, `${key} is a proposal the owner has not answered, so nothing was moved into it.`, { key });
  }
  return { key, parts, record };
}

async function merge(argv, ctx, { project, driver }) {
  const { _, flags } = parseArgs(argv, { string: ['into', 'title', 'description', 'approved-by', 'host'] });
  const by = ownerYes(flags, 'A merge');
  const target = await targetConcept(driver, str(flags, 'into'));
  const keys = [...new Set(_.map((k) => assertKey(k)))].filter((k) => k !== target.key);
  if (!keys.length) {
    throw new ToolkitError(EXIT.INVALID, `Name the records to merge into ${target.key}, for example: toolkit memory merge project_deploy_window project_release_steps --into ${target.key} --approved-by <owner>. toolkit memory tidy --plan proposes them.`);
  }
  const members = [];
  for (const k of keys) {
    const r = await driver.get(k);
    if (!r) throw new ToolkitError(EXIT.ERROR, `There is no memory record with the key ${k}, so nothing was merged.`, { key: k, fix: 'Run toolkit memory list to see the keys.' });
    if (r.status === 'retired') throw new ToolkitError(EXIT.INVALID, `${k} is ${storedStatus(r)}, so nothing was merged. Merge only records in use.`, { key: k });
    if (isProposal(r)) throw new ToolkitError(EXIT.INVALID, `${k} is a proposal the owner has not answered, so nothing was merged. Ask him about it first (approve or reject).`, { key: k });
    if (r.type === 'event') throw new ToolkitError(EXIT.INVALID, `${k} is an event. An event stays its own record, so nothing was merged.`, { key: k });
    // A feedback_ record's facts may move into a concept of another type (memory-tidy's migration).
    if (r.type !== target.parts.type && !isRetiredType(r.type)) {
      throw new ToolkitError(EXIT.INVALID, `${k} is a ${r.type} record and ${target.key} a ${target.parts.type} concept, so nothing was merged. A concept's facts share its type.`, {
        key: k,
        fix: `When ${k} has the wrong type, rename it first: toolkit memory rename ${k} --to ${target.parts.type}_${splitKey(k).name.replace(/-/g, '_')}.`,
      });
    }
    members.push(r);
  }
  const day = today();
  // The owner's yes to the merge. It becomes the authorization of a concept
  // the merge starts; an existing concept keeps its own (verifier,
  // 2026-09-28). Each merged fact keeps its own approval: a note on its
  // section when it differs from the concept's (approvalNote).
  const authorization = approvalText(by, day);
  const noted = (conceptAuthorization) => members.map((m) => ({
    ...m,
    approvalNote: approvalNote(m.authorization || NO_AUTHORIZATION, conceptAuthorization, m.updated || m.saved || day),
  }));
  const description = str(flags, 'description');
  const titleFlag = str(flags, 'title');
  let placed = [];
  let result;
  if (target.record) {
    result = await editRecordWith(driver, target.key, (stored) => {
      const merged = mergeSections(stored.body, noted(stored.authorization || NO_AUTHORIZATION));
      placed = merged.placed;
      const body = retargetLinks(merged.body, members, target.key, placed);
      const edited = editConceptText(stored.text, target.key, { body, day, title: titleFlag, fields: { description } });
      return { text: edited.text };
    });
  } else {
    if (!description) {
      throw new ToolkitError(EXIT.INVALID, `${target.key} does not exist yet, so the merge would start it: give its one-line summary with --description (toolkit memory tidy --plan prints a draft).`, { key: target.key });
    }
    const title = titleFlag || titleFromName(target.parts.name);
    const merged = mergeSections(`# ${title}\n`, noted(authorization));
    placed = merged.placed;
    result = await driver.save({
      type: target.parts.type,
      name: target.parts.name,
      description,
      source: `Merged from ${keys.join(', ')} on ${day}`,
      status: 'current',
      last_verified: oldestDate(members.map((m) => m.last_verified)),
      updated: day,
      authorization,
      approved_by: by,
      supersedes: [],
      body: withLessonsSection(retargetLinks(merged.body, members, target.key, placed)),
    }, { expect: 'absent' });
  }
  // Each record is now superseded by the concept; links to it go to its section.
  const repaired = new Set();
  const failed = [];
  const retired = [];
  for (const [i, m] of members.entries()) {
    const heading = placed[i] && placed[i].heading;
    try {
      const res = await driver.retire(m.key, {
        supersededBy: target.key,
        reason: mergedReason(target.key, heading),
        anchor: heading ? headingAnchor(heading) : '',
      });
      retired.push(m.key);
      for (const k of res.linksRepaired || []) repaired.add(k);
      for (const f of res.linksFailed || []) failed.push(f);
    } catch (err) {
      failed.push({ key: m.key, reason: `it was merged but not retired: ${err.message}` });
    }
  }
  await afterWrite(project, driver, { forget: retired });
  const stored = result.record || {};
  const title = bodyTitle(stored.body) || titleFromName(target.parts.name);
  const lines = [`Merged ${members.length} record${members.length === 1 ? '' : 's'} into ${target.key} (${title})${target.record ? '' : ', a new concept'}:`];
  for (const [i, m] of members.entries()) {
    const p = placed[i] || {};
    lines.push(`- ${m.key} -> the section "${p.heading}"${p.action === 'appended' ? ' (added under a section it already had)' : ''}${retired.includes(m.key) ? '' : ' (not retired: see below)'}`);
  }
  lines.push(`Each merged record is now superseded by ${target.key}; links to it point at its section.`);
  lines.push(...repairLines({ linksRepaired: [...repaired], linksFailed: failed }));
  lines.push(`Version: ${short(result.version)}`);
  lines.push(`Undo: restore each record (toolkit memory restore <key>, the full steps in memory-tidy), then take its section out of ${target.key} with toolkit memory save --concept ${target.key} --section '<heading>' --remove --expect <version>.`);
  const reply = REPLY.merged(title);
  lines.push(replyLine(reply));
  out(ctx, lines, {
    ok: failed.length === 0,
    action: 'merge',
    backend: driver.backend,
    key: target.key,
    created: !target.record,
    version: result.version,
    merged: members.map((m, i) => ({ key: m.key, heading: (placed[i] || {}).heading || null, action: (placed[i] || {}).action || null, retired: retired.includes(m.key) })),
    approved_by: by,
    replyLine: reply,
    linksRepaired: [...repaired],
    ...(failed.length ? { linksFailed: failed } : {}),
  });
  return failed.some((f) => /not retired/.test(f.reason)) ? EXIT.ERROR : EXIT.OK;
}

async function split(argv, ctx, { project, driver }) {
  const { _, flags } = parseArgs(argv, { string: ['into', 'title', 'description', 'approved-by', 'host'], array: ['section'] });
  const by = ownerYes(flags, 'A split');
  const sourceKey = assertKey(requireKeyArg(_, 'split'));
  const headings = (flags.section || []).map((h) => assertHeading(h));
  if (!headings.length) throw new ToolkitError(EXIT.INVALID, `Name each section to move with --section <heading>, for example: toolkit memory split ${sourceKey} --section 'Refunds' --into project_refunds --approved-by <owner>.`);
  const target = await targetConcept(driver, str(flags, 'into'));
  if (target.key === sourceKey) throw new ToolkitError(EXIT.INVALID, 'Give another concept with --into: a concept cannot be split into itself.');
  const source = await driver.get(sourceKey);
  if (!source) throw new ToolkitError(EXIT.ERROR, `There is no memory record with the key ${sourceKey}.`, { key: sourceKey, fix: 'Run toolkit memory list to see the keys.' });
  if (source.status === 'retired' || isProposal(source)) throw new ToolkitError(EXIT.INVALID, `${sourceKey} is ${isProposal(source) ? 'a proposal' : storedStatus(source)}, so nothing was moved.`, { key: sourceKey });
  if (source.type !== target.parts.type && !isRetiredType(source.type)) {
    throw new ToolkitError(EXIT.INVALID, `${sourceKey} is a ${source.type} concept and ${target.key} a ${target.parts.type} one, so nothing was moved. A concept's facts share its type.`, { key: sourceKey });
  }
  const sections = conceptParts(source.body).sections;
  const moving = [];
  for (const h of headings) {
    const s = sections.find((x) => sameHeading(x.heading, h));
    if (!s) {
      throw new ToolkitError(EXIT.INVALID, `${sourceKey} has no section "${h}", so nothing was moved.`, { key: sourceKey, sections: sections.map((x) => x.heading), fix: `toolkit memory get ${sourceKey} shows its sections.` });
    }
    if (!moving.some((x) => sameHeading(x.heading, s.heading))) moving.push(s);
  }
  if (moving.length === sections.length && !conceptParts(source.body).lead) {
    throw new ToolkitError(EXIT.INVALID, `That moves every section of ${sourceKey}. To move the whole concept, use toolkit memory merge ${sourceKey} --into ${target.key}, or rename it.`, { key: sourceKey });
  }
  const day = today();
  // The owner's yes to the split: the authorization of a concept the split
  // starts. An existing concept, and the source, keep their own (verifier,
  // 2026-09-28). A moved section keeps its approval: a note when the
  // source's approval differs from the target's (approvalNote).
  const authorization = approvalText(by, day);
  const sourceNote = (targetAuthorization) => approvalNote(source.authorization || NO_AUTHORIZATION, targetAuthorization, source.updated || source.saved || day);
  const description = str(flags, 'description');
  const titleFlag = str(flags, 'title');
  const piece = { key: sourceKey, name: source.name, source: '', body: `# x\n\n${moving.map((s) => `## ${s.heading}\n\n${s.text}`).join('\n\n')}\n` };
  // 1. The sections go into the target concept (made when it does not exist yet).
  let intoResult;
  let placedHeadings = [];
  if (target.record) {
    intoResult = await editRecordWith(driver, target.key, (stored) => {
      let body = stored.body;
      placedHeadings = [];
      const note = sourceNote(stored.authorization || NO_AUTHORIZATION);
      for (const s of moving) {
        const moved = note && !hasApprovalNote(s.text) ? addEvidenceNote(s.text, note) : s.text;
        const res = spliceSection(body, s.heading, moved, { mode: 'append' });
        body = res.body;
        placedHeadings.push(res.heading);
      }
      const edited = editConceptText(stored.text, target.key, { body, day, title: titleFlag, fields: { description } });
      return { text: edited.text };
    });
  } else {
    if (!description) throw new ToolkitError(EXIT.INVALID, `${target.key} does not exist yet, so the split would start it: give its one-line summary with --description.`, { key: target.key });
    const title = titleFlag || titleFromName(target.parts.name);
    const merged = mergeSections(`# ${title}\n`, [{ ...piece, approvalNote: sourceNote(authorization) }]);
    placedHeadings = moving.map((s) => s.heading);
    intoResult = await driver.save({
      type: target.parts.type,
      name: target.parts.name,
      description,
      source: `Split from ${sourceKey} on ${day}`,
      status: 'current',
      last_verified: source.last_verified || 'unknown',
      updated: day,
      authorization,
      approved_by: by,
      supersedes: [],
      body: withLessonsSection(merged.body),
    }, { expect: 'absent' });
  }
  // 2. The sections leave the source concept.
  let sourceResult;
  try {
    sourceResult = await editRecordWith(driver, sourceKey, (stored) => {
      let body = stored.body;
      for (const s of moving) {
        if (getSection(body, s.heading) !== null) body = spliceSection(body, s.heading, '', { mode: 'remove' }).body;
      }
      const edited = editConceptText(stored.text, sourceKey, { body, day });
      return { text: edited.text };
    }, { expect: source.version });
  } catch (err) {
    throw new ToolkitError(err.code || EXIT.ERROR, `The sections were copied into ${target.key}, but not taken out of ${sourceKey}: ${err.message}`, {
      key: sourceKey,
      into: target.key,
      fix: `Read ${sourceKey} again and take each moved section out with toolkit memory save --concept ${sourceKey} --section '<heading>' --remove --expect <version>.`,
    });
  }
  // 3. Links to the moved sections follow them.
  const change = { kind: 'section', from: sourceKey, to: target.key, fromPath: `${sourceKey}.md`, toPath: `${target.key}.md`, headings: moving.map((s) => s.heading) };
  const relinked = typeof driver.relink === 'function'
    ? await driver.relink(change, { skip: [] })
    : repairResult(await repairLinksWithDriver(driver, change));
  await afterWrite(project, driver);
  const intoTitle = bodyTitle((intoResult.record || {}).body) || titleFromName(target.parts.name);
  const lines = [`Moved ${moving.length} section${moving.length === 1 ? '' : 's'} from ${sourceKey} into ${target.key} (${intoTitle})${target.record ? '' : ', a new concept'}: ${moving.map((s) => `"${s.heading}"`).join(', ')}.`];
  lines.push(...repairLines(relinked));
  lines.push(`Versions: ${target.key} ${short(intoResult.version)}, ${sourceKey} ${short(sourceResult.version)}`);
  lines.push(`Undo: toolkit memory split ${target.key} ${headings.map((h) => `--section ${shellQuote(h)}`).join(' ')} --into ${sourceKey} --approved-by <owner>.`);
  out(ctx, lines, {
    ok: true,
    action: 'split',
    backend: driver.backend,
    key: sourceKey,
    into: target.key,
    created: !target.record,
    sections: moving.map((s, i) => ({ heading: s.heading, into: placedHeadings[i] || s.heading })),
    versions: { [target.key]: intoResult.version, [sourceKey]: sourceResult.version },
    approved_by: by,
    ...repairFields(relinked),
  });
  return EXIT.OK;
}

async function tidy(argv, ctx, { project, driver }) {
  const { flags } = parseArgs(argv, { boolean: ['plan'], string: ['host'] });
  if (flags.plan !== true) {
    throw new ToolkitError(EXIT.INVALID, 'toolkit memory tidy only plans: run toolkit memory tidy --plan. It changes nothing; the memory-tidy skill shows the plan to the owner, and each change runs after his yes.');
  }
  const summaries = await driver.list();
  const records = [];
  for (const s of summaries) {
    const r = await driver.get(s.key).catch(() => null);
    if (r) records.push(r);
  }
  const plan = planTidy(records, { ignore: ownerWords(project) });
  const ownerName = project && project.config && project.config.project && project.config.project.owner;
  const migrate = feedbackMigration(records);
  const promotions = planPromotions(records, { ownerName });
  const lines = [];
  if (!plan.merges.length && !plan.large.length) {
    lines.push('Nothing to merge or split: every record in use is a concept, or no two share a subject. Nothing was changed.');
  } else {
    lines.push('Concept memory plan. Nothing was changed: show this to the owner (memory-tidy), and run each command only after his yes.');
    let n = 0;
    for (const m of plan.merges) {
      n++;
      const what = m.exists ? `the concept ${m.into} ("${m.title}")` : `a new concept ${m.into} ("${m.title}")`;
      lines.push(`${n}. Merge into ${what}: ${m.members.map((x) => `${x.key} ("${x.title}")`).join(', ')}.`);
      const extra = m.exists ? '' : ` --title ${shellQuote(m.title)} --description ${shellQuote(m.description)}`;
      lines.push(`   toolkit memory merge ${m.members.map((x) => x.key).join(' ')} --into ${m.into}${extra} --approved-by <owner>`);
      if (!m.exists) lines.push('   Write a better one-line summary than the draft before you run it.');
    }
    for (const l of plan.large) {
      n++;
      lines.push(`${n}. ${l.key} ("${l.title}") has ${l.sections} sections and ${l.lines} lines: split the sections about one sub-topic into their own concept with toolkit memory split ${l.key} --section '<heading>' --into <new-key> --description '<summary>' --approved-by <owner>.`);
    }
  }
  if (plan.stay.length) lines.push(`Stay as they are: ${plan.stay.map((s) => s.key).join(', ')}.`);
  if (migrate.length) {
    lines.push('', `feedback_ records to move out of memory (the type is retired: instructions are rules, facts go in concepts). Show each to the owner and run the commands only after his yes:`);
    for (const m of migrate) {
      lines.push(`- ${m.key} ("${m.title}"):`);
      for (const part of m.parts) {
        lines.push(`    "${part.heading}": ${part.point}`);
        lines.push(`      An instruction: toolkit rule add --section ${shellQuote(part.area)} --text '<the instruction>' --source 'memory record ${m.key}, saved ${m.saved || 'earlier'}'`);
        lines.push(part.whole
          ? `      A fact: toolkit memory merge ${m.key} --into <user_ or project_ concept> --approved-by <owner> (it has no "## " sections, so the whole record moves)`
          : `      A fact: toolkit memory split ${m.key} --section ${shellQuote(part.heading)} --into <user_ or project_ concept> --approved-by <owner> (or merge the whole record)`);
      }
      lines.push(`    Then, once every part has moved: toolkit memory retire ${m.key} --reason 'Moved to the rules and concepts' (a merge retires it already)`);
    }
  }
  if (promotions.length) {
    lines.push('', 'Lessons that proved themselves (promotion candidates). Propose each to the owner; nothing changes until his yes:');
    for (const c of promotions) {
      lines.push(`- "${c.heading}" in ${c.key} (${c.title}): ${c.why.join('; ')}.`);
      lines.push(`    toolkit memory promote ${c.key} --section ${shellQuote(c.heading)} --to rule   (or --to skill for a procedure with steps)`);
    }
  }
  out(ctx, lines, { ok: true, action: 'tidy-plan', backend: driver.backend, changed: false, ...plan, migrate, promotions });
  return EXIT.OK;
}

/**
 * The feedback_ records still in use, each with its parts: [{ key, title,
 * saved, parts: [{ heading, point, area }] }]. memory-tidy moves each
 * instruction to the rules and each fact to a concept, after the owner's yes.
 */
export function feedbackMigration(records) {
  const out = [];
  for (const r of records) {
    if (!r || r.type !== 'feedback' || r.status === 'retired' || isProposal(r)) continue;
    const parts = conceptParts(r.body);
    const title = parts.title || bodyTitle(r.body) || titleFromName(r.name);
    const pieces = parts.sections.length
      ? parts.sections.filter((x) => !sameHeading(x.heading, LESSONS_HEADING)).map((x) => ({ heading: x.heading, point: oneLineOf(rememberText(x.text) || x.text) }))
      : [{ heading: title, point: oneLineOf(rememberText(r.body) || r.description), whole: true }];
    out.push({ key: r.key, title, saved: r.updated || r.saved || '', parts: pieces.map((p) => ({ ...p, area: ruleArea(`${p.heading} ${p.point}`) })) });
  }
  return out;
}

// ---------------------------------------------------------------- promotion

/**
 * toolkit memory promote <key> --section <lesson heading> --to rule|skill
 * (Mike, 2026-09-29): a lesson that proved itself becomes a rule or a skill.
 * Without --approved-by it only prints the proposal for the owner and changes
 * nothing. With the owner's yes (--approved-by):
 *   rule   the instruction goes into .claude/rules/owner-preferences.md
 *          (--rule-section, else the area its words name; --text, else the
 *          lesson's own words), and the AGENTS.md rules list is rebuilt;
 *   skill  a project skill skeleton is written (.claude/skills/<name>/SKILL.md,
 *          or .agents/skills/ for a Codex-only project) for the agent to fill;
 * and the lesson gets a Promoted line that names where it went.
 */
async function promote(argv, ctx, { project, driver }) {
  const { _, flags } = parseArgs(argv, { string: ['section', 'to', 'rule-section', 'text', 'skill-name', 'approved-by', 'host'] });
  const key = assertKey(requireKeyArg(_, 'promote'));
  const headingFlag = str(flags, 'section');
  if (!headingFlag) throw new ToolkitError(EXIT.INVALID, `Name the lesson with --section '<lesson heading>' (toolkit memory get ${key} shows them under "${LESSONS_HEADING}").`, { key });
  const to = str(flags, 'to');
  if (to !== 'rule' && to !== 'skill') throw new ToolkitError(EXIT.INVALID, 'Say where the lesson goes: --to rule (an instruction followed every time) or --to skill (a procedure with steps).', { key });
  const rec = await driver.get(key);
  if (!rec) throw new ToolkitError(EXIT.ERROR, `There is no memory record with the key ${key}.`, { key, fix: 'Run toolkit memory list to see the keys.' });
  const ownerName = project && project.config && project.config.project && project.config.project.owner;
  const lesson = findLesson(rec.body, headingFlag, { ownerName });
  if (!lesson) {
    throw new ToolkitError(EXIT.INVALID, `${key} has no lesson "${headingFlag}" under "${LESSONS_HEADING}".`, { key, fix: `toolkit memory get ${key} shows its lessons (the "### " headings under "${LESSONS_HEADING}").` });
  }
  if (lesson.promoted) {
    throw new ToolkitError(EXIT.INVALID, `The lesson "${lesson.heading}" in ${key} was promoted already: ${lesson.promoted}`, { key });
  }
  const point = lessonPoint(lesson);
  const day = today();
  const by = str(flags, 'approved-by');
  const title = bodyTitle(rec.body) || titleFromName(rec.name);
  let plan;
  if (to === 'rule') {
    const section = assertArea(str(flags, 'rule-section') ?? ruleArea(`${lesson.heading} ${point}`));
    const text = assertInstruction(str(flags, 'text') ?? point, secretKind);
    plan = { to, file: PROJECT_RULE_PATH, section, text };
  } else {
    const name = slugify(str(flags, 'skill-name') ?? lesson.heading, 48);
    if (!name) throw new ToolkitError(EXIT.INVALID, 'Give the skill a name with --skill-name <lower-case-words-with-dashes>.');
    const hosts = projectHosts(project.config);
    const dir = hosts.includes('claude-code') ? '.claude/skills' : '.agents/skills';
    plan = { to, name, file: `${dir}/${name}/SKILL.md`, copyTo: hosts.includes('claude-code') && hosts.includes('codex') ? `.agents/skills/${name}/SKILL.md` : null };
  }
  const flagsLine = `--section ${shellQuote(lesson.heading)} --to ${to}${to === 'rule' ? ` --rule-section ${shellQuote(plan.section)} --text ${shellQuote(plan.text)}` : ` --skill-name ${plan.name}`}`;
  if (!by) {
    const ask = to === 'rule'
      ? `Make this a project rule: ${plan.text.replace(/[.!?]+$/, '')}?`
      : `Turn the lesson "${lesson.heading}" into a project skill (${plan.file})?`;
    const lines = [
      `Promotion proposal for the owner. Nothing was changed.`,
      `Lesson "${lesson.heading}" in ${key} (${title}): ${point}`,
      `Seen: ${lesson.seen.length ? lesson.seen.join(', ') : 'no date recorded'}${lesson.confirmed ? '; the owner confirmed it' : ''}.`,
      to === 'rule' ? `It would be added to ${plan.file}, section "${plan.section}": ${plan.text}` : `A skill skeleton would be written at ${plan.file} for the agent to fill${plan.copyTo ? `, then copied to ${plan.copyTo} for Codex` : ''}.`,
      `Ask him: "${ask}"`,
      `After his yes: toolkit memory promote ${key} ${flagsLine} --approved-by <owner>`,
    ];
    out(ctx, lines, { ok: true, action: 'promote-plan', changed: false, key, lesson: { heading: lesson.heading, point, seen: lesson.seen }, plan, ask });
    return EXIT.OK;
  }
  // The owner's yes is the approval (verifier, 2026-09-29: after "FYI the
  // build looked fine." a promote --approved-by wrote a rule). As toolkit rule
  // update does, it is refused when the hooks recorded no keep phrase, no other
  // save words, and no answer to a question about memory or rules this turn.
  if (passingRemark(readTurnFacts(project, ctx.env))) {
    throw new ToolkitError(EXIT.INVALID, `The lesson "${lesson.heading}" was not promoted: the owner's message this turn does not ask for it (the hooks recorded no keep phrase, no other save words, and no answer to a question about memory or rules). A rule applies every session, so his yes comes first. Nothing was changed.`, {
      key,
      fix: `Run toolkit memory promote ${key} ${flagsLine} without --approved-by, ask him the question it prints, and run it with --approved-by in the turn he says yes.`,
    });
  }
  const who = by.replace(/\s+/g, ' ').trim();
  let where;
  let result = {};
  if (to === 'rule') {
    const source = `${who} approved promoting the lesson "${lesson.heading}" from memory (${key})`;
    let already = null;
    try {
      result = await changeRules('project', { root: project.root, env: ctx.env }, (doc) => addEntry(doc, plan.section, { text: plan.text, date: day, source }));
    } catch (err) {
      if (!(err && err.details && err.details.entry)) throw err;
      already = err.details;
    }
    result.agentsUpdated = already ? false : refreshAgentsSpan(project.root).updated;
    result.already = already;
    where = `the project rule in \`${PROJECT_RULE_PATH}\`, section "${already ? already.section : plan.section}"`;
  } else {
    const abs = path.join(project.root, ...plan.file.split('/'));
    if (fs.existsSync(abs)) {
      throw new ToolkitError(EXIT.INVALID, `${plan.file} exists already, so no skeleton was written and the lesson was not marked.`, { key, fix: 'Give another name with --skill-name, or add the lesson to that skill by hand and mark it with this command after it.' });
    }
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    const skeleton = skillSkeleton(plan.name, lesson, { key, day, point });
    fs.writeFileSync(abs, skeleton);
    if (fs.readFileSync(abs, 'utf8') !== skeleton) throw new ToolkitError(EXIT.ERROR, `Saved but not verified: ${plan.file} does not read back as written.`);
    result = { written: plan.file };
    where = `the project skill \`${plan.file}\``;
  }
  const res = await editRecordWith(driver, key, (stored) => {
    const section = getSection(stored.body, LESSONS_HEADING);
    const marked = promotionMark(section, lesson.heading, { date: day, where });
    if (marked === null) throw new ToolkitError(EXIT.ERROR, `The lesson "${lesson.heading}" is no longer in ${key}.`, { key });
    return { text: editConceptText(stored.text, key, { heading: LESSONS_HEADING, content: marked, mode: 'set', day }).text };
  });
  await afterWrite(project, driver);
  const lines = to === 'rule'
    ? [
      result.already
        ? `${PROJECT_RULE_PATH} already has this instruction in "${result.already.section}" (line ${result.already.entry}); nothing was added there.`
        : `Added to ${PROJECT_RULE_PATH}, section "${result.section}", as instruction ${result.n}: ${plan.text}`,
      `The lesson "${lesson.heading}" in ${key} is marked promoted, with the rule's path and section.`,
      ...(result.already ? [] : [commitLine(result.agentsUpdated, 'the owner approved this change')]),
    ]
    : [
      `Wrote the skill skeleton ${plan.file}. Fill it now: the description (what it does, then when to use it, with two to four example phrases) and the steps, from the lesson.${plan.copyTo ? ` Then copy the finished file to ${plan.copyTo}, so Codex has it too.` : ''}`,
      `The lesson "${lesson.heading}" in ${key} is marked promoted, with the skill's path.`,
      `Commit the skill folder after it is filled: the owner approved this change.`,
    ];
  lines.push(`Version of ${key}: ${short(res.version)}`);
  out(ctx, lines, { ok: true, action: 'promote', changed: true, key, to, plan, lesson: { heading: lesson.heading, promoted: day }, version: res.version, ...(to === 'rule' ? { rule: { section: result.already ? result.already.section : result.section, entry: result.already ? result.already.entry : result.n, agentsUpdated: result.agentsUpdated } } : { skill: plan.file, copyTo: plan.copyTo }) });
  return EXIT.OK;
}

/** The SKILL.md skeleton a promoted lesson starts, for the agent to fill. */
export function skillSkeleton(name, lesson, { key, day, point }) {
  const title = String(lesson.heading).replace(/\s+/g, ' ').trim();
  return [
    '---',
    `name: ${name}`,
    "description: '<Fill in: what this skill does, then when to use it, with two to four example phrases the owner would say.>'",
    '---',
    '',
    `# ${title}`,
    '',
    `<!-- Fill-in guide: toolkit memory promote wrote this skeleton on ${day} from the lesson "${title}" in the memory concept ${key}. Write the steps the agent follows every time, in order, one action each. Keep the frontmatter to name and description. Remove this guide when the skill is filled. -->`,
    '',
    '## Steps',
    '',
    '1. <First step>',
    '',
    '## Where this came from',
    '',
    `The lesson "${title}" in memory (${key}): ${point}`,
    '',
  ].join('\n');
}

// ---------------------------------------------------------------- reply lines

/** The memory-save skill's reply lines ("Replies"), filled with a record's title. */
export const REPLY = Object.freeze({
  saved: (title) => `Saved to memory: ${title}. Say 'forget that' to undo.`,
  updated: (title) => `Updated in memory: ${title}. Say 'undo that' to put back the old wording.`,
  proposal: (title) => `Saved as a proposal for your yes or no: ${title}.`,
  rejected: (title) => `Not saved: ${title}. I will not suggest it again.`,
  removed: (title) => `Removed from memory: ${title}. Say 'undo that' to put it back.`,
  merged: (title) => `Merged in memory: ${title}. Say 'undo that' to put the old records back.`,
});

/** The output line that hands the agent its reply line. */
export function replyLine(reply) {
  return `Reply line for the owner, word for word (memory-save): ${reply}`;
}

// ---------------------------------------------------------------- the owner's answer to a proposal

async function approve(argv, ctx, { project, driver }) {
  const { _, flags } = parseArgs(argv, { string: ['by', 'concept', 'title', 'description', 'host', 'section', 'text'] });
  const key = requireKeyArg(_, 'approve');
  const by = str(flags, 'by');
  const ownerName = project && project.config && project.config.project && project.config.project.owner;
  const concept = str(flags, 'concept');
  if (concept !== undefined) {
    const parts = splitKey(canonicalKey(concept));
    if (parts && isRetiredType(parts.type)) throw retiredTypeError(null, `toolkit memory approve ${key} --concept ${concept}`);
  }
  // A rule proposal (or an older feedback_ proposal): the owner's yes writes the rule.
  const pending = await driver.get(canonicalKey(key)).catch(() => null);
  if (pending && isRuleProposal(pending) && concept === undefined) return approveRule(ctx, { project, driver }, pending, { by, ownerName, section: str(flags, 'section'), text: str(flags, 'text') });
  if (str(flags, 'section') !== undefined || str(flags, 'text') !== undefined) {
    throw new ToolkitError(EXIT.INVALID, '--section and --text name the rule section and words for a rule proposal; this record is not one. Use --concept to name the concept a fact goes in.');
  }
  const description = str(flags, 'description');
  const res = await approveRecord(driver, key, {
    by, today: today(), ownerName, concept: str(flags, 'concept'), title: str(flags, 'title'), description: description === undefined ? null : oneLineOf(description),
  });
  if (res.changed) await afterWrite(project, driver, { forget: res.from ? [res.from] : [] });
  const who = String(by).trim();
  let lines;
  let reply = null;
  if (res.created) {
    // Concept memory: the fact started a concept the agent named.
    const title = recordTitle(res.record || { key: res.key });
    lines = [
      `Approved ${res.from}: its fact starts the new concept ${res.key} (${title}), in the section "${res.heading}", approved by ${who} on ${today()}. The proposal record ${res.from} was removed.`,
      `Version: ${short(res.version)}`,
      `Undo: toolkit memory retire ${res.key}`,
    ];
    reply = REPLY.saved(`${res.heading} (in ${title})`);
  } else if (res.merged) {
    // Concept memory: the proposal named a concept, so its fact went there.
    const title = recordTitle(res.record || { key: res.key });
    lines = [
      `Approved ${res.from}: its fact is now in the concept ${res.key} (${title}), ${res.action === 'appended' ? 'added under' : 'in'} the section "${res.heading}", approved by ${who} on ${today()}. The proposal record ${res.from} was removed.`,
      `Version: ${short(res.version)}`,
      `Undo: toolkit memory save --concept ${res.key} --section ${shellQuote(res.heading)} ${res.action === 'appended' ? '--expect <version> with the old text' : `--remove --expect ${short(res.version)}`}`,
    ];
    reply = REPLY.saved(`${res.heading} (in ${title})`);
  } else if (res.changed) {
    lines = [`Approved ${res.key}: it is now a current memory record, approved by ${who} on ${today()}.`, `Version: ${short(res.version)}`];
    if (res.conceptMissing) lines.push(`It named the concept ${res.conceptMissing}, which is not in memory now, so it is a concept of its own. Give it a better name with toolkit memory rename ${res.key} --to <key>, or merge it with toolkit memory merge.`);
    reply = REPLY.saved(recordTitle(res.record || { key: res.key }));
  } else {
    lines = [`${res.key} is already a current memory record; nothing changed.`];
  }
  if (reply) lines.push(replyLine(reply));
  out(ctx, lines, {
    ok: true, action: 'approve', backend: driver.backend, key: res.key, version: res.version, changed: res.changed, approved_by: who, replyLine: reply,
    ...(res.merged ? { merged: true, from: res.from, section: { heading: res.heading, action: res.action } } : {}),
    ...(res.created ? { created: true, from: res.from, section: { heading: res.heading, action: 'added' } } : {}),
  });
  return EXIT.OK;
}

/**
 * The owner's yes to a rule proposal: the instruction goes into the project's
 * .claude/rules/owner-preferences.md (toolkit rule add), the AGENTS.md rules
 * list is rebuilt, and the proposal record is removed. An instruction the
 * section already holds only removes the proposal.
 */
async function approveRule(ctx, { project, driver }, rec, { by, ownerName, section: sectionFlag, text: textFlag }) {
  const who = String(by ?? '').replace(/\s+/g, ' ').trim();
  if (!who) throw new ToolkitError(EXIT.INVALID, `Say who approved it: toolkit memory approve ${rec.key} --by <name>.`, { key: rec.key });
  const target = ruleTarget(rec);
  const section = assertArea(sectionFlag !== undefined ? sectionFlag : target.section);
  const text = assertInstruction(textFlag !== undefined ? textFlag : ruleProposalText(rec, ownerName || who), secretKind);
  const day = today();
  const source = `${who} said yes to the agent's question`;
  let written = null;
  let already = null;
  try {
    written = await changeRules('project', { root: project.root, env: ctx.env }, (doc) => addEntry(doc, section, { text, date: day, source }));
  } catch (err) {
    if (!(err && err.details && err.details.entry)) throw err;
    already = err.details;
  }
  const span = written ? refreshAgentsSpan(project.root) : { updated: false };
  const removed = await driver.delete(rec.key);
  await afterWrite(project, driver, { forget: [rec.key] });
  const lines = already
    ? [`${PROJECT_RULE_PATH} already has this instruction in "${already.section}" (line ${already.entry}), so nothing was added. The proposal ${rec.key} was removed from memory.`]
    : [
      `Approved ${rec.key}: added to ${PROJECT_RULE_PATH}, section "${written.section}", as instruction ${written.n}: ${text}`,
      `The proposal record ${rec.key} was removed from memory.${span.updated ? ' The AGENTS.md rules list now names the file.' : ''}`,
      commitLine(span.updated, 'the owner said yes to it'),
      `Undo: toolkit rule update --section ${shellQuote(written.section)} --entry ${written.n} --remove`,
    ];
  lines.push(...repairLines(removed));
  const reply = already ? null : `Added to the project rules: ${text} Say 'undo that' to take it out.`;
  if (reply) lines.push(`Reply line for the owner, word for word (memory-save): ${reply}`);
  out(ctx, lines, {
    ok: true, action: 'approve', backend: driver.backend, key: rec.key, changed: true, approved_by: who, replyLine: reply, removed: true,
    rule: already ? { file: PROJECT_RULE_PATH, section: already.section, entry: already.entry, alreadyThere: true } : { file: PROJECT_RULE_PATH, section: written.section, entry: written.n, text, created: written.created, agentsUpdated: span.updated },
  });
  return EXIT.OK;
}

async function reject(argv, ctx, { project, driver }) {
  const { _, flags } = parseArgs(argv, { string: ['reason', 'host'] });
  const key = requireKeyArg(_, 'reject');
  const res = await rejectProposal(driver, key);
  await afterWrite(project, driver, { forget: [res.key] });
  const where = res.trash ? ` ${res.detail}` : '';
  const reason = str(flags, 'reason');
  const lines = [`Rejected ${res.key}: the owner said no, so the proposal was deleted.${where}`];
  if (reason && reason.trim()) lines.push(`His reason: ${reason.trim()}`);
  lines.push(...repairLines(res));
  lines.push('A rejected proposal is not saved again, here or under another name. When the owner gave a general rule about what to keep, write only that rule, with toolkit rule add.');
  const reply = REPLY.rejected(res.title || res.key);
  lines.push(replyLine(reply));
  out(ctx, lines, {
    ok: true, action: 'reject', replyLine: reply, backend: driver.backend, key: res.key, deleted: true, trash: Boolean(res.trash), reason: reason ?? null, ...repairFields(res),
  });
  return EXIT.OK;
}

// ---------------------------------------------------------------- focus and glossary

async function textDocument(argv, ctx, { project, driver }, kind) {
  const { _, flags } = parseArgs(argv, { string: ['set-file', 'text', 'expect', 'host'] });
  if (_.length) throw new ToolkitError(EXIT.INVALID, `toolkit memory ${kind} takes no words outside flags. Use --set-file <file> or --text <text> to replace it.`);
  const label = kind === 'focus' ? 'current focus' : 'glossary';
  const file = str(flags, 'set-file');
  const inline = str(flags, 'text');
  if (file !== undefined && inline !== undefined) throw new ToolkitError(EXIT.INVALID, 'Give --set-file or --text, not both.');
  if (file === undefined && inline === undefined) {
    const doc = kind === 'focus' ? await driver.focusGet() : await driver.glossaryGet();
    const text = doc.text ? doc.text : `There is no ${label} yet. Set it with toolkit memory ${kind} --set-file <file>.`;
    out(ctx, text, { ok: true, backend: driver.backend, kind, text: doc.text, version: doc.version });
    return EXIT.OK;
  }
  // --text gives the text in the command itself, so a Codex session needs no
  // temporary file (sample run b, round 2).
  let markdown = inline !== undefined ? inline : await readInput(ctx, file, 'set-file');
  const expect = str(flags, 'expect');
  // The focus keeps the model's "# Current focus" heading and "Last updated:"
  // line (sample runs b and claude-a): what is missing is added.
  let added = [];
  if (kind === 'focus') ({ text: markdown, added } = completeFocus(markdown, { today: today() }));
  const res = kind === 'focus' ? await driver.focusSet(markdown, { expect }) : await driver.glossarySet(markdown, { expect });
  await afterWrite(project, driver);
  const extra = res.lines !== undefined ? ` (${res.lines} lines)` : '';
  const lines = [`Saved the ${label}${extra}. Version: ${short(res.version)}`];
  const addedWords = added.filter((a) => a !== 'date').map((a) => (a === 'heading' ? 'the "# Current focus" heading' : `the "Last updated: ${today()}" line`));
  if (addedWords.length) lines.push(`Added what the model's focus has and the text did not: ${addedWords.join(' and ')}.`);
  if (added.includes('date')) lines.push(`Set "Last updated:" to ${today()}: the text had an older date or none, and this save is today's update.`);
  out(ctx, lines, { ok: true, action: `${kind}-set`, backend: driver.backend, kind, added, ...res });
  return EXIT.OK;
}

// ---------------------------------------------------------------- upkeep

async function reindex(argv, ctx, { project, driver }) {
  parseArgs(argv, { string: ['host'] });
  const res = await driver.reindex();
  await afterWrite(project, driver);
  out(ctx, res.detail, { ok: true, action: 'reindex', backend: driver.backend, ...res });
  return EXIT.OK;
}

async function status(argv, ctx, { driver }) {
  parseArgs(argv, { string: ['host'] });
  const st = await driver.status();
  const c = st.counts;
  const lines = [
    `Backend: ${st.backend}`,
    `Where: ${st.location}`,
    `Healthy: ${st.healthy ? 'yes' : 'no'}`,
    `Last save: ${st.lastSave || 'none recorded'}`,
  ];
  if (st.lastExport !== undefined) lines.push(`Last export: ${st.lastExport || 'never'}`);
  lines.push(`Records: ${c.current} current, ${c['needs-review']} needing review, ${c.retired} retired`);
  lines.push(st.detail);
  if (st.problems && st.problems.length) {
    lines.push('Problems:');
    for (const p of st.problems) lines.push(`- ${p.where} ${p.problem}`);
  }
  out(ctx, lines, { ok: st.healthy, ...st });
  return st.healthy ? EXIT.OK : EXIT.ERROR;
}

async function doExport(argv, ctx, { project, driver }) {
  const { flags } = parseArgs(argv, { string: ['to', 'host'] });
  const to = str(flags, 'to');
  if (!to) throw new ToolkitError(EXIT.INVALID, 'Give the folder to export to: toolkit memory export --to <folder>.');
  const res = await exportMemory(driver, path.resolve(ctx.cwd, to), {
    forbidden: [path.join(project.mainRoot, '.memory')],
  });
  out(ctx, [
    `Exported ${res.records} memory record${res.records === 1 ? '' : 's'} (${res.retired} retired) to ${res.dir}.`,
    `Current focus: ${res.focus ? 'included' : 'none'}. Glossary: ${res.glossary ? 'included' : 'none'}.`,
    `Bring it back with: toolkit memory import --from ${res.dir}`,
  ], { ok: true, action: 'export', backend: driver.backend, ...res });
  return EXIT.OK;
}

async function doImport(argv, ctx, { project, driver }) {
  const { flags } = parseArgs(argv, { string: ['from', 'host'], boolean: ['dry-run'] });
  const from = str(flags, 'from');
  if (!from) throw new ToolkitError(EXIT.INVALID, 'Give the folder to import from: toolkit memory import --from <folder>.');
  const res = await importMemory(driver, path.resolve(ctx.cwd, from), { dryRun: Boolean(flags['dry-run']) });
  if (!res.dryRun) await afterWrite(project, driver);
  const verb = res.dryRun ? 'Would import' : 'Imported';
  const lines = [`${verb} ${res.imported.length} memory record${res.imported.length === 1 ? '' : 's'} from ${res.from}.`];
  lines.push(`Current focus: ${res.focus ? (res.dryRun ? 'would be replaced' : 'replaced') : 'not changed'}. Glossary: ${res.glossary ? (res.dryRun ? 'would be replaced' : 'replaced') : 'not changed'}.`);
  if (res.skipped.length) {
    lines.push(`Skipped ${res.skipped.length}:`);
    for (const s of res.skipped) lines.push(`- ${s.file} ${s.problem}`);
  }
  out(ctx, lines, { ok: res.skipped.length === 0, action: 'import', backend: driver.backend, ...res });
  return res.skipped.length ? EXIT.INVALID : EXIT.OK;
}

const HANDLERS = {
  promote,
  save,
  find,
  get,
  list,
  approve,
  reject,
  retire,
  restore,
  rename,
  delete: del,
  merge,
  split,
  tidy,
  focus: (argv, ctx, deps) => textDocument(argv, ctx, deps, 'focus'),
  glossary: (argv, ctx, deps) => textDocument(argv, ctx, deps, 'glossary'),
  reindex,
  status,
  export: doExport,
  import: doImport,
};
