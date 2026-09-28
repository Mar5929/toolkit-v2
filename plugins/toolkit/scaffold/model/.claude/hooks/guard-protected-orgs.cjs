#!/usr/bin/env node
/**
 * Salesforce production-org guard  (PreToolUse hook, Claude Code and Codex)
 * ------------------------------------------------------------------
 * Fires before every Bash / PowerShell tool call. If the command runs a
 * guarded Salesforce CLI verb against an org that classifies as PRODUCTION, it
 * returns a "confirm before running" decision so the change cannot happen by
 * accident. A guarded verb is anything that changes an org: a deploy or deploy
 * validate, a data write, anonymous Apex, a metadata delete, or an org delete.
 *
 * Policy is data-driven from .claude/protected-orgs.json, which this project
 * ships with action "deny". The built-in defaults below apply only when that
 * file is missing:
 *   - protect: any production org (auto-detected via `sf org list`)
 *   - action: ask  (confirm; nothing is hard-blocked)
 *   - watch:  deploys, validates, data writes, anonymous Apex, deletes
 *   - sandboxAction: ask. The salesforce-org-safety rule allows sandbox
 *             deploys, data writes and anonymous Apex only after the owner says
 *             yes, so the hook asks for them on a sandbox or scratch org too. A
 *             deploy validate on a sandbox needs no yes and passes silently.
 *
 * Set action to "deny" for a project whose written rule says an agent may never
 * deploy to production. The block message changes with the setting: on "deny" it
 * says BLOCKED and tells the agent not to rewrite the command, because a hard
 * block that ends with "confirm before running" reads as a prompt and invites a
 * retry.
 *
 * Contract (verified against https://code.claude.com/docs/en/hooks.md):
 *   stdin  = JSON { tool_name, tool_input: { command }, ... }
 *   stdout = JSON { hookSpecificOutput: { hookEventName, permissionDecision,
 *                   permissionDecisionReason } }  with exit 0
 *   permissionDecision: "allow" | "ask" | "deny"
 *
 * Design notes:
 *   - Fast path: a command line that does not contain the word `sf` or `sfdx`
 *     exits 0 silently with NO subprocess and NO file read, so the hook adds
 *     ~nothing to normal Bash calls.
 *   - The guard checks the Salesforce CLI commands the shell will run, not
 *     text that only mentions one. See "Reading the command" below.
 *   - A command is known by the words of its name in any order, as the sf CLI
 *     reads them. See "guarded commands" below.
 *   - A target org comes from the command's own -o, then from an
 *     SF_TARGET_ORG=... written in front of that same command, then from the
 *     default org. An org set anywhere else on the line never replaces the
 *     default org; both are checked and the stricter result wins.
 *   - A DevOps Center pipeline deploy (`sf project deploy pipeline start`,
 *     `quick`, `resume`, or `validate`) goes to the org of a pipeline stage,
 *     which DevOps Center picks and the command line does not name. The guard
 *     never takes an org for it from -o, a setting, or the default org; it
 *     treats the org as one it cannot classify.
 *   - `sf ... --help` (or `-h`) only prints help, so it passes.
 *   - Org classification calls `sf org list --json --skip-connection-status`,
 *     which reads the LOCAL auth store (no network round-trip).
 *   - Fail-safe: if the guard hits an internal error on the heavy path, it
 *     asks rather than silently allowing. Errors before a guarded verb is
 *     confirmed allow through, so unrelated tools are never blocked. If the
 *     command line cannot be read, the whole text is matched as before.
 *
 * Codex: registered in .codex/hooks.json with `--host codex`. Codex fails a
 * PreToolUse hook that returns "ask" and then lets the command run, so with
 * `--host codex` every "ask" becomes "deny" and the reason tells the agent to
 * hand the command to the owner.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ------------------------------------------------------------------ output
function hostArg() {
  const i = process.argv.indexOf('--host');
  return i >= 0 && process.argv[i + 1] ? String(process.argv[i + 1]).toLowerCase() : 'claude';
}
const HOST = hostArg();

function emit(decision, reason) {
  if (decision === 'allow') {
    // Silent allow: emit nothing, let normal permission flow apply.
    process.exit(0);
  }
  if (decision === 'ask' && HOST === 'codex') {
    decision = 'deny';
    reason =
      `${reason} Codex cannot ask for confirmation, so this command is blocked ` +
      `here. Give the owner the exact command to run, and do not rewrite it to ` +
      `get around this guard.`;
  }
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: decision, // "ask" | "deny"
        permissionDecisionReason: reason,
      },
    })
  );
  process.exit(0);
}

// ------------------------------------------------------------------ config
function loadConfig() {
  const defaults = {
    action: 'ask', // "ask" | "deny"
    unknownOrgAction: 'ask', // what to do when an org can't be classified
    sandboxAction: 'ask', // "ask" | "allow" for a guarded verb on a sandbox or scratch org
    confirmOrgDeleteAlways: true, // any `org delete` asks, prod or not
    alwaysProtect: [], // aliases/usernames always guarded
    neverProtect: [], // aliases/usernames never guarded (escape hatch)
  };
  try {
    const cfgPath = path.join(__dirname, '..', 'protected-orgs.json');
    const raw = fs.readFileSync(cfgPath, 'utf8');
    return Object.assign(defaults, JSON.parse(raw));
  } catch {
    return defaults; // no/invalid config -> safe defaults
  }
}

// ------------------------------------------------------------------ guarded commands
// Every guarded command, by its name, with the old names the CLI still
// accepts for it (checked against sf 2.128.5: `sf deploy metadata` is
// `sf project deploy start`, `sf env delete scratch` is `sf org delete scratch`).
// The category names itself in the message the owner reads.
//
// The sf CLI reads the words of a name in any order ("flexible taxonomy":
// `sf deploy project start` runs `sf project deploy start`) and with a space
// or a colon between them (`sf project:deploy:start`). So the guard compares
// the set of words, not the order.
const GUARDED = [
  ['orgDelete', ['org:delete:scratch', 'org:delete:sandbox', 'env:delete:scratch', 'env:delete:sandbox', 'force:org:delete']],
  ['deploy', [
    'project:deploy:start', 'project:deploy:quick', 'project:deploy:resume',
    'deploy:metadata', 'deploy:metadata:quick', 'deploy:metadata:resume',
    'force:source:deploy', 'force:mdapi:deploy',
  ]],
  // A validate is not a read: it uploads the package and runs the deploy's Apex
  // tests in the target org. The safety rule forbids it in production. It has
  // its own category because the same rule allows it on a sandbox with no yes.
  ['validate', ['project:deploy:validate', 'deploy:metadata:validate']],
  // DevOps Center (checked against sf 2.142.7 with the devops-center plugin
  // 1.2.28, where these commands are beta). Each one deploys, or validates,
  // to the org of a pipeline stage, which can be production. The command names
  // only the DevOps Center org (-c) and the stage's branch (-b), never the
  // target org. `sf project deploy pipeline report` only reads.
  ['pipelineDeploy', [
    'project:deploy:pipeline:start', 'project:deploy:pipeline:quick',
    'project:deploy:pipeline:resume', 'project:deploy:pipeline:validate',
  ]],
  // Every way the CLI can change records, not only the delete verbs.
  ['dataWrite', [
    'data:delete:record', 'data:delete:bulk', 'data:delete:resume',
    'data:create:record', 'data:create:file',
    'data:update:record', 'data:update:bulk', 'data:update:resume',
    'data:upsert:bulk', 'data:upsert:resume',
    'data:import:tree', 'data:import:bulk', 'data:import:resume',
    'force:data:record:create', 'force:data:record:update', 'force:data:record:delete',
    'force:data:bulk:upsert', 'force:data:bulk:delete', 'force:data:tree:import',
  ]],
  ['apex', ['apex:run', 'force:apex:execute']],
  ['metadataDelete', ['project:delete:source', 'force:source:delete']],
];
// Real commands whose names hold every word of a guarded name and more. They
// change nothing in an org: `sf apex run test` runs Apex tests, and the
// others read or cancel a deploy.
const NOT_GUARDED = ['apex:run:test', 'deploy:metadata:report', 'deploy:metadata:preview', 'deploy:metadata:cancel'];

const nameKey = (parts) => parts.map((p) => p.toLowerCase()).sort().join(' ');
const GUARDED_BY_KEY = new Map();
for (const [category, names] of GUARDED) {
  for (const name of names) GUARDED_BY_KEY.set(nameKey(name.split(':')), category);
}
const NOT_GUARDED_KEYS = new Set(NOT_GUARDED.map((name) => nameKey(name.split(':'))));

// Categories the safety rule allows on a sandbox or scratch org without the
// owner's yes. Everything else asks there, unless sandboxAction is "allow".
const SANDBOX_SILENT = new Set(['validate']);

// Categories whose target org is never on the command line. No -o, setting,
// or default org is taken for them: each is judged as a command with no
// resolvable target org.
const STAGE_TARGET = new Set(['pipelineDeploy']);

/**
 * The category of the command whose name is `parts` (the words after sf, split
 * at colons), or null when it changes no org. The longest leading run of words
 * that names a guarded command decides, so extra words never hide one.
 */
function categoryOf(parts) {
  if (NOT_GUARDED_KEYS.has(nameKey(parts))) return null;
  for (let n = parts.length; n > 0; n--) {
    const hit = GUARDED_BY_KEY.get(nameKey(parts.slice(0, n)));
    if (hit) return hit;
  }
  return null;
}

/** Every category of guarded command named anywhere in `text`, read as the words after each sf or sfdx. */
function categoriesIn(text) {
  const found = [];
  // Quotes and backslashes are dropped, so `sf "project" deploy start` is read too.
  const plain = String(text).replace(/["'\\]/g, '');
  const re = /\b(?:sf|sfdx)((?:\s+[A-Za-z][\w-]*(?::[A-Za-z][\w-]*)*)+)/g;
  let m;
  while ((m = re.exec(plain)) !== null) {
    const category = categoryOf(m[1].trim().split(/[\s:]+/));
    if (category && !found.includes(category)) found.push(category);
  }
  return found;
}

// ------------------------------------------------------------------ target org
// Pull every explicit -o / --target-org / -u / --targetusername value from text.
function explicitTargets(cmd) {
  const out = [];
  const re =
    /(?:--target-org|--targetusername|--targetusernamealias|-o|-u)(?:[=\s]+)("[^"]+"|'[^']+'|\S+)/g;
  let m;
  while ((m = re.exec(cmd)) !== null) {
    out.push(m[1].replace(/^["']|["']$/g, ''));
  }
  return out;
}

const TARGET_FLAGS = new Set(['-o', '--target-org', '-u', '--targetusername', '--targetusernamealias']);

// The same flags, read from the words of one sf command (quotes already removed).
function targetsFromWords(args) {
  const out = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (TARGET_FLAGS.has(a)) {
      if (args[i + 1] !== undefined) out.push(args[i + 1]);
      i++;
      continue;
    }
    const eq = a.indexOf('=');
    if (eq > 0 && TARGET_FLAGS.has(a.slice(0, eq))) {
      out.push(a.slice(eq + 1));
      continue;
    }
    const joined = /^-([ou])(.+)$/.exec(a); // -oprod
    if (joined) out.push(joined[2].replace(/^=/, ''));
  }
  return out;
}

// Environment variables that choose the target org.
// - `SF_TARGET_ORG=acme-uat sf ...`: the setting belongs to that one sf
//   command, so it is that command's target.
// - Anywhere else (`export SF_TARGET_ORG=...`, a bare assignment, another
//   command, a quote, a comment), the guard cannot tell which command it
//   reaches. So a value found there never replaces the default org. The
//   whole-text check judges it beside the default org, and the stricter
//   result wins.
const TARGET_ENV = ['SF_TARGET_ORG', 'SFDX_DEFAULTUSERNAME', 'SF_TARGET_ORG_ALIAS'];

/** Every value given to a TARGET_ENV variable anywhere in the text. */
function envTargetsIn(cmd) {
  const out = [];
  const re = /\b(SF_TARGET_ORG|SFDX_DEFAULTUSERNAME|SF_TARGET_ORG_ALIAS)=("[^"]*"|'[^']*'|[^\s;&|)]+)/g;
  let m;
  while ((m = re.exec(cmd)) !== null) {
    const value = m[2].replace(/^["']|["']$/g, '');
    if (value) out.push(value);
  }
  return out;
}

function defaultTarget() {
  // Env override first, then CLI config.
  for (const name of TARGET_ENV) if (process.env[name]) return process.env[name];
  try {
    const out = execSync('sf config get target-org --json', {
      encoding: 'utf8',
      timeout: 30000,
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    const parsed = JSON.parse(out);
    const rows = parsed.result || [];
    for (const r of rows) if (r && r.value) return String(r.value);
  } catch {
    /* no default configured */
  }
  return null;
}

// ------------------------------------------------------------------ org index
// Build alias/username -> category from the local auth store.
function buildOrgIndex() {
  const index = new Map(); // key (lowercased alias or username) -> category
  let out;
  try {
    // 30s, not 8s. `sf org list` has been measured at over 8 seconds on a
    // Windows machine with several orgs, so an 8s timeout expired on nearly
    // every call and every org fell through to "could not be classified". That
    // looks safe, because unknown is guarded, but it meant a sandbox could never
    // be told apart. Keep the hook's registered timeout above the two sf calls
    // together (see salesforce-prod-guard-hook.md): a PreToolUse command hook
    // that runs out of time lets the tool call continue.
    out = execSync('sf org list --json --skip-connection-status', {
      encoding: 'utf8',
      timeout: 30000,
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    return index; // empty -> everything classifies "unknown"
  }
  let result;
  try {
    result = JSON.parse(out).result || {};
  } catch {
    return index;
  }

  const add = (rec, groupName) => {
    if (!rec) return;
    const cat = categorize(rec, groupName);
    for (const key of [rec.alias, rec.username]) {
      if (key) index.set(String(key).toLowerCase(), cat);
    }
  };

  // sf org list groups orgs across versions; cover the known array names.
  for (const rec of result.scratchOrgs || []) add(rec, 'scratchOrgs');
  for (const rec of result.sandboxes || []) add(rec, 'sandboxes');
  for (const rec of result.nonScratchOrgs || []) add(rec, 'nonScratchOrgs');
  for (const rec of result.devHubs || []) add(rec, 'nonScratchOrgs');
  for (const rec of result.regularOrgs || []) add(rec, 'nonScratchOrgs');
  for (const rec of result.other || []) add(rec, 'other');

  return index;
}

function categorize(rec, groupName) {
  if (groupName === 'scratchOrgs' || rec.isScratch === true) return 'scratch';
  if (groupName === 'sandboxes' || rec.isSandbox === true) return 'sandbox';
  const url = String(rec.instanceUrl || rec.loginUrl || '').toLowerCase();
  if (url.includes('test.salesforce.com') || url.includes('.sandbox.'))
    return 'sandbox';
  return 'production';
}

function classify(target, index) {
  const hit = index.get(String(target).toLowerCase());
  return hit || 'unknown';
}

// ------------------------------------------------------------------ reading the command
// The guard checks the Salesforce CLI commands the shell will run. Text that
// only mentions one is not checked: a note given to a toolkit command, a
// commit message, an echo, or a here-document written to a file. An earlier
// version matched the whole command text, so `toolkit work history WI-001
// --note "... sf project deploy start ..."` was refused as a deploy.
//
// The command line is split the way a POSIX shell splits it: into pipelines at
// ; && || & ( ) and line ends, and each pipeline into simple commands at |.
// Quotes, backslashes, comments, redirections, and here-documents are read as
// text. This is not a full shell parser, so wherever the guard cannot be sure
// what runs, it matches the whole command line as before, here-documents
// included. That happens when the line holds
//   - a command substitution ($(...) or backticks) or a process substitution
//     (<(...) or >(...)), even inside double quotes, because the shell runs it;
//   - arithmetic, (( ... )) or $[ ... ], where << is a shift and not a
//     here-document;
//   - an unclosed quote, a here-document whose closing line never comes, or a
//     here-document on a command with no words;
//   - any command other than sf, sfdx, or a command in TEXT_ONLY. So
//     `bash -c "sf ..."`, `echo "sf ..." | sh`, `echo "sf ..." > d.sh && bash
//     d.sh`, `xargs sf ...`, and a Python or Node script that runs sf are
//     still checked;
//   - a NAME=value setting whose value mentions sf or sfdx
//     (`GIT_EDITOR='sf ...' git commit`), any setting in front of git, which
//     reads commands from settings such as GIT_EXTERNAL_DIFF, or a bare
//     setting of a TARGET_ENV variable (`SF_TARGET_ORG=acme-prod; sf ...`).
// A PowerShell command line is always matched as whole text.

// Commands that never run their arguments or their input as a command.
const TEXT_ONLY = new Set([
  'toolkit', 'echo', 'printf', 'cat', 'grep', 'egrep', 'fgrep', 'head', 'tail',
  'wc', 'ls', 'cut', 'tr', 'uniq', 'diff', 'jq', 'tee', 'true', 'false', 'test',
  '[', 'cd', 'pwd', 'mkdir', 'touch', 'cp', 'mv', 'basename', 'dirname', 'date',
]);
// Git subcommands that take text (a commit message, a tag note) but run no
// command given to them. Others, such as rebase --exec, bisect run, and
// submodule foreach, can run one.
const GIT_TEXT_ONLY = new Set([
  'commit', 'tag', 'log', 'show', 'diff', 'status', 'add', 'branch', 'switch',
  'checkout', 'worktree', 'stash', 'notes', 'rev-parse', 'restore', 'rm', 'mv',
]);
// Shell words that come before a command and are not the command.
const RESERVED = new Set(['{', '}', '!', 'if', 'then', 'else', 'elif', 'fi', 'do', 'done', 'while', 'until', 'time', 'esac']);
const SF_NAMES = new Set(['sf', 'sfdx']);

function baseName(word) {
  return String(word).split('/').pop();
}

/** Index of the ')' that closes the '(' at `open`, or the last index when it is not closed. */
function closeParen(src, open) {
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (c === '\\') {
      i++;
    } else if (c === "'") {
      const j = src.indexOf("'", i + 1);
      i = j === -1 ? src.length : j;
    } else if (c === '"') {
      let j = i + 1;
      while (j < src.length && src[j] !== '"') j += src[j] === '\\' ? 2 : 1;
      i = j;
    } else if (c === '(') {
      depth++;
    } else if (c === ')') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return src.length - 1;
}

/** Index of the backtick that closes the one at `open`, or the last index. */
function closeBacktick(src, open) {
  for (let i = open + 1; i < src.length; i++) {
    if (src[i] === '\\') i++;
    else if (src[i] === '`') return i;
  }
  return src.length - 1;
}

/**
 * A here-document operator at `i` (src[i] and src[i + 1] are '<'):
 * { delim, stripTabs, end }, end being the index after the delimiter word.
 * Null for a here-string (<<<) or an operator with no delimiter.
 */
function heredocOperator(src, i) {
  if (src[i + 2] === '<') return null;
  let j = i + 2;
  let stripTabs = false;
  if (src[j] === '-') {
    stripTabs = true;
    j++;
  }
  while (src[j] === ' ' || src[j] === '\t') j++;
  let delim = '';
  while (j < src.length && !/[\s;&|()<>]/.test(src[j])) {
    const c = src[j];
    if (c === "'" || c === '"') {
      const k = src.indexOf(c, j + 1);
      delim += k === -1 ? src.slice(j + 1) : src.slice(j + 1, k);
      j = k === -1 ? src.length : k + 1;
      continue;
    }
    if (c === '\\' && j + 1 < src.length) {
      delim += src[j + 1];
      j += 2;
      continue;
    }
    delim += c;
    j++;
  }
  return delim ? { delim, stripTabs, end: j } : null;
}

/**
 * Split a command line into { pipelines: [{ commands: [{ words, raw }] }], risky }.
 * words: a command's words with quotes removed and redirections left out;
 * raw: its source text; risky: the guard may have misread the line (see
 * "Reading the command"). Here-document bodies are skipped: they are text.
 */
function readCommandLine(src) {
  const pipelines = [];
  let risky = false;
  const newPipeline = () => ({ commands: [] });
  const newCommand = () => ({ words: [], raw: '', heredoc: false });
  let pipeline = newPipeline();
  let cmd = newCommand();
  let word = '';
  let inWord = false;
  let redirectTarget = false; // the next word is where a redirection points
  let pending = []; // here-documents whose body starts after this line: { delim, stripTabs }

  const endWord = () => {
    if (inWord) {
      if (redirectTarget) redirectTarget = false;
      else cmd.words.push(word);
    }
    word = '';
    inWord = false;
  };
  const endCommand = () => {
    endWord();
    redirectTarget = false;
    // A here-document on a command with no words is most likely something
    // else read wrong, such as the shift in `((1<<2))`.
    if (cmd.heredoc && !splitWords(cmd.words).words.length) risky = true;
    if (cmd.raw.trim()) pipeline.commands.push(cmd);
    cmd = newCommand();
  };
  const endPipeline = () => {
    endCommand();
    if (pipeline.commands.length) pipelines.push(pipeline);
    pipeline = newPipeline();
  };
  // A word made only of digits just before < or > is a file descriptor number.
  const dropFdNumber = () => {
    if (inWord && /^\d+$/.test(word)) {
      word = '';
      inWord = false;
    } else endWord();
  };

  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (c === "'") {
      const j = src.indexOf("'", i + 1);
      const end = j === -1 ? src.length : j;
      if (j === -1) risky = true;
      word += src.slice(i + 1, end);
      inWord = true;
      cmd.raw += src.slice(i, end + 1);
      i = end;
      continue;
    }
    if (c === '"') {
      let j = i + 1;
      while (j < src.length && src[j] !== '"') {
        const d = src[j];
        if (d === '\\' && j + 1 < src.length) {
          word += src[j + 1];
          j += 2;
          continue;
        }
        if ((d === '$' && src[j + 1] === '(') || d === '`') {
          risky = true;
          const k = d === '`' ? closeBacktick(src, j) : closeParen(src, j + 1);
          word += src.slice(j, k + 1);
          j = k + 1;
          continue;
        }
        word += d;
        j++;
      }
      if (j >= src.length) risky = true;
      cmd.raw += src.slice(i, j + 1);
      inWord = true;
      i = j;
      continue;
    }
    if (c === '\\') {
      if (src[i + 1] === '\n') {
        cmd.raw += ' ';
        i++;
        continue;
      }
      if (i + 1 < src.length) {
        word += src[i + 1];
        inWord = true;
        cmd.raw += src.slice(i, i + 2);
        i++;
        continue;
      }
      cmd.raw += c;
      continue;
    }
    if (c === '#' && !inWord) {
      // A comment runs to the end of the line.
      const nl = src.indexOf('\n', i);
      i = (nl === -1 ? src.length : nl) - 1;
      continue;
    }
    if (c === ' ' || c === '\t' || c === '\r') {
      endWord();
      cmd.raw += c;
      continue;
    }
    if (c === '\n') {
      endPipeline();
      if (pending.length) {
        let pos = i + 1;
        for (const h of pending) {
          let closed = false;
          while (!closed && pos < src.length) {
            const nl = src.indexOf('\n', pos);
            const lineEnd = nl === -1 ? src.length : nl;
            const line = src.slice(pos, lineEnd);
            pos = lineEnd + 1;
            closed = (h.stripTabs ? line.replace(/^\t+/, '') : line) === h.delim;
          }
          // No closing line: the guard may have read something else as a
          // here-document and skipped real commands.
          if (!closed) risky = true;
        }
        pending = [];
        i = pos - 1;
      }
      continue;
    }
    // Arithmetic: (( ... )) or the old $[ ... ]. Its << is a shift, which this
    // reader would take for a here-document and skip the lines after it.
    if ((c === '(' && src[i + 1] === '(') || (c === '$' && src[i + 1] === '[')) risky = true;
    if ((c === '$' && src[i + 1] === '(') || ((c === '<' || c === '>') && src[i + 1] === '(')) {
      risky = true;
      const k = closeParen(src, i + 1);
      word += src.slice(i, k + 1);
      inWord = true;
      cmd.raw += src.slice(i, k + 1);
      i = k;
      continue;
    }
    if (c === '`') {
      risky = true;
      const k = closeBacktick(src, i);
      word += src.slice(i, k + 1);
      inWord = true;
      cmd.raw += src.slice(i, k + 1);
      i = k;
      continue;
    }
    if (c === '<' && src[i + 1] === '<') {
      const h = heredocOperator(src, i);
      if (h) {
        dropFdNumber();
        cmd.heredoc = true;
        pending.push({ delim: h.delim, stripTabs: h.stripTabs });
        cmd.raw += src.slice(i, h.end);
        i = h.end - 1;
        continue;
      }
    }
    if (c === '<' || c === '>') {
      dropFdNumber();
      let j = i + 1;
      if (c === '>' && (src[j] === '>' || src[j] === '|' || src[j] === '&')) j++;
      else if (c === '<' && src[j] === '<' && src[j + 1] === '<') j += 2;
      else if (c === '<' && (src[j] === '>' || src[j] === '&')) j++;
      cmd.raw += src.slice(i, j);
      redirectTarget = true;
      i = j - 1;
      continue;
    }
    if (c === '&' && src[i + 1] === '>') {
      endWord();
      let j = i + 2;
      if (src[j] === '>') j++;
      cmd.raw += src.slice(i, j);
      redirectTarget = true;
      i = j - 1;
      continue;
    }
    if ((c === '&' && src[i + 1] === '&') || (c === '|' && src[i + 1] === '|')) {
      endPipeline();
      i++;
      continue;
    }
    if (c === '|') {
      endCommand();
      if (src[i + 1] === '&') i++;
      continue;
    }
    if (c === ';') {
      endPipeline();
      if (src[i + 1] === ';' || src[i + 1] === '&') i++;
      continue;
    }
    if (c === '&' || c === '(' || c === ')') {
      endPipeline();
      continue;
    }
    word += c;
    inWord = true;
    cmd.raw += c;
  }
  endPipeline();
  if (pending.length) risky = true; // a here-document with no body after it
  return { pipelines, risky };
}

const ASSIGNMENT = /^([A-Za-z_][A-Za-z0-9_]*)=([\s\S]*)$/;

/**
 * A command's words split into { assignments, words }: the NAME=value settings
 * written in front of it, as [{ name, value }], and its own words. Leading
 * shell keywords are dropped.
 */
function splitWords(all) {
  const assignments = [];
  let i = 0;
  for (; i < all.length; i++) {
    if (RESERVED.has(all[i])) continue;
    const m = ASSIGNMENT.exec(all[i]);
    if (!m) break;
    assignments.push({ name: m[1], value: m[2] });
  }
  return { assignments, words: all.slice(i) };
}

function isTextOnly(words) {
  const name = baseName(words[0]);
  if (TEXT_ONLY.has(name)) return true;
  if (name === 'node' && words[1] && /(^|\/)bin\/toolkit$/.test(words[1])) return true;
  if (name === 'git') {
    let i = 1;
    while (i < words.length && words[i].startsWith('-')) {
      if (words[i] === '-C') {
        i += 2;
        continue;
      }
      if (words[i] === '--no-pager' || words[i] === '-P') {
        i++;
        continue;
      }
      return false; // -c and other options can make git run a command
    }
    return GIT_TEXT_ONLY.has(words[i]);
  }
  return false;
}

// ------------------------------------------------------------------ checks
// A check is one guarded command to judge: { kind, targets, how }.
// targets: the orgs it names, or null when it names none, so the default org
// applies. how: where the orgs came from, for the message.

const SF_TEXT = /\b(?:sf|sfdx)\b/;

/**
 * A check from one sf or sfdx command, or null when it changes no org.
 * words: its own words; assignments: the NAME=value settings in front of it.
 */
function sfCheck(words, assignments) {
  const args = [];
  for (const w of words.slice(1)) {
    if (w === '--') break;
    args.push(w);
  }
  if (args.some((a) => a === '--help' || a === '-h')) return null; // prints help only
  // The name is every word before the first option or name=value word.
  const parts = [];
  for (const a of args) {
    if (a.startsWith('-') || a.includes('=')) break;
    parts.push(...a.split(':').filter(Boolean));
  }
  const kind = categoryOf(parts);
  if (!kind) return null;
  if (STAGE_TARGET.has(kind)) return { kind, targets: null, how: '' };
  const targets = targetsFromWords(args);
  if (targets.length) return { kind, targets, how: '' };
  const env = assignments.filter((a) => TARGET_ENV.includes(a.name) && a.value);
  if (env.length) {
    const names = [...new Set(env.map((a) => a.name))];
    const how = ` (org set by the environment variable${names.length > 1 ? 's' : ''} ${names.join(', ')} in front of the command)`;
    return { kind, targets: env.map((a) => a.value), how };
  }
  return { kind, targets: null, how: '' };
}

/**
 * Checks from text matched as a whole, the way this guard always read it: one
 * per kind of guarded command the text names, aimed at the text's -o values,
 * or at the default org when it has none. An org set by an environment
 * variable anywhere in the text is judged as well, never in place of those,
 * because the guard cannot tell which command it reaches.
 */
function textChecks(text) {
  const checks = [];
  const explicit = explicitTargets(text);
  const env = envTargetsIn(text);
  for (const kind of categoriesIn(text)) {
    if (STAGE_TARGET.has(kind)) {
      checks.push({ kind, targets: null, how: '' });
      continue;
    }
    checks.push(explicit.length ? { kind, targets: explicit, how: '' } : { kind, targets: null, how: '' });
    if (env.length) checks.push({ kind, targets: env, how: ' (org named by an environment variable in the command text)' });
  }
  return checks;
}

function findChecks(command, toolName) {
  if (toolName === 'PowerShell') return textChecks(command);
  const { pipelines, risky } = readCommandLine(command);
  const checks = [];
  let asText = risky;
  for (const p of pipelines) {
    for (const c of p.commands) {
      const { assignments, words } = splitWords(c.words);
      // A setting can hold a command that runs later: GIT_EDITOR='sf ...' git commit.
      if (assignments.some((a) => SF_TEXT.test(a.value))) asText = true;
      if (!words.length) {
        // A bare SF_TARGET_ORG=... can change the org a later sf command uses.
        if (assignments.some((a) => TARGET_ENV.includes(a.name))) asText = true;
        continue;
      }
      if (SF_NAMES.has(baseName(words[0]))) {
        const s = sfCheck(words, assignments);
        if (s) checks.push(s);
        continue;
      }
      if (isTextOnly(words)) {
        // Git runs commands named in settings such as GIT_EDITOR and GIT_EXTERNAL_DIFF.
        if (assignments.length && baseName(words[0]) === 'git') asText = true;
        continue;
      }
      asText = true; // it may run a command the guard cannot see
    }
  }
  if (asText) checks.push(...textChecks(command));
  return checks;
}

const RANK = { allow: 0, ask: 1, deny: 2 };

/** Judge one check: { decision, reason }. */
function judge(check, cfg, lookups) {
  const decision = cfg.action === 'deny' ? 'deny' : 'ask';
  // The closing sentence has to match the decision. A "deny" that ends with
  // "Confirm before running" reads as a prompt the agent can click through,
  // so it invites a retry against the org the hook just refused.
  const tail =
    decision === 'deny'
      ? 'BLOCKED. Ask the owner to run it, and do not rewrite the command to get around this.'
      : 'Confirm before running.';
  const never = (cfg.neverProtect || []).map((s) => String(s).toLowerCase());
  const always = (cfg.alwaysProtect || []).map((s) => String(s).toLowerCase());

  // A pipeline deploy goes to a pipeline stage's org. The default org is not
  // that org, so it is never looked up here.
  if (STAGE_TARGET.has(check.kind)) {
    return {
      decision: cfg.unknownOrgAction === 'allow' ? 'allow' : decision,
      reason:
        `Guarded: '${check.kind}' command with no resolvable target org. A DevOps ` +
        `Center pipeline deploy goes to the org of a pipeline stage, which the ` +
        `command line does not name, so it cannot be proved non-production. ${tail}`,
    };
  }

  let targets = (check.targets || []).slice();
  let how = targets.length ? check.how || '' : '';
  if (targets.length === 0) {
    const def = lookups.defaultTarget();
    if (def) {
      targets = [def];
      how = ' (default org)';
    }
  }

  // confirmOrgDeleteAlways: any org delete asks, regardless of org type,
  // unless the target is explicitly on neverProtect.
  if (cfg.confirmOrgDeleteAlways && check.kind === 'orgDelete') {
    const allNeverProtected =
      targets.length > 0 &&
      targets.every((t) => never.includes(String(t).toLowerCase()));
    if (!allNeverProtected) {
      return {
        decision,
        reason: `Guarded: '${check.kind}' org-delete is irreversible${
          targets.length ? ` (target: ${targets.join(', ')})` : ''
        }. ${tail}`,
      };
    }
  }

  // No resolvable target -> can't prove it's non-production.
  if (targets.length === 0) {
    return {
      decision: cfg.unknownOrgAction === 'allow' ? 'allow' : decision,
      reason:
        `Guarded: '${check.kind}' command with no resolvable target org, ` +
        `so it cannot be proved non-production. ${tail}`,
    };
  }

  const index = lookups.orgIndex();
  const reasons = [];
  const sandboxReasons = [];
  let protectHit = false;

  for (const t of targets) {
    const key = String(t).toLowerCase();
    if (never.includes(key)) continue; // escape hatch
    if (always.includes(key)) {
      protectHit = true;
      reasons.push(`'${t}' is on alwaysProtect`);
      continue;
    }
    const cat = classify(t, index);
    if (cat === 'production') {
      protectHit = true;
      reasons.push(`'${t}' is a PRODUCTION org`);
    } else if (cat === 'unknown' && cfg.unknownOrgAction !== 'allow') {
      protectHit = true;
      reasons.push(`'${t}' could not be classified (treated as protected)`);
    } else if (cat === 'sandbox' || cat === 'scratch') {
      sandboxReasons.push(`'${t}' is a ${cat} org`);
    }
  }

  // Strictest target wins. A command naming a sandbox AND a production org
  // gets the production decision.
  if (protectHit) {
    return {
      decision,
      reason: `Guarded '${check.kind}' command${how}: ${reasons.join('; ')}. ${tail}`,
    };
  }

  // A sandbox deploy, data write, Apex run or delete is allowed by the safety
  // rule, but only after the owner says yes. Nothing else makes that happen,
  // so the hook turns it into a prompt instead of letting it through
  // silently. Set sandboxAction to "allow" to go back to silent.
  if (
    sandboxReasons.length > 0 &&
    cfg.sandboxAction !== 'allow' &&
    !SANDBOX_SILENT.has(check.kind)
  ) {
    return {
      decision: 'ask',
      reason:
        `Guarded '${check.kind}' command${how}: ${sandboxReasons.join('; ')}. ` +
        `Sandbox work is allowed, but only after the owner approves each ` +
        (HOST === 'codex' ? 'change.' : 'change, so approve it here or cancel and ask them.'),
    };
  }

  return { decision: 'allow', reason: '' };
}

// ------------------------------------------------------------------ main
function main() {
  // --- read + parse stdin; on any failure, allow (never block unrelated tools)
  let payload;
  try {
    const raw = fs.readFileSync(0, 'utf8');
    payload = JSON.parse(raw);
  } catch {
    emit('allow');
  }

  const cmd = payload && payload.tool_input && payload.tool_input.command;
  if (!cmd || typeof cmd !== 'string') emit('allow');

  // Fast path: not a Salesforce CLI call at all.
  if (!/\b(?:sf|sfdx)\b/.test(cmd)) emit('allow');

  let checks;
  try {
    checks = findChecks(cmd, payload.tool_name);
  } catch {
    // The command line could not be read: match the whole text, as before.
    checks = textChecks(cmd);
  }
  if (checks.length === 0) emit('allow'); // sf command, but not a guarded verb (retrieve, list, help, ...)

  // --- from here we know it's a guarded verb; fail-safe = ask on error ---
  try {
    const cfg = loadConfig();
    let def;
    let index;
    const lookups = {
      defaultTarget: () => (def === undefined ? (def = defaultTarget()) : def),
      orgIndex: () => index || (index = buildOrgIndex()),
    };
    let worst = null;
    for (const check of checks) {
      const result = judge(check, cfg, lookups);
      if (!worst || RANK[result.decision] > RANK[worst.decision]) worst = result;
    }
    return emit(worst.decision, worst.reason);
  } catch (err) {
    // Heavy-path failure on a known guarded verb -> fail safe: ask.
    return emit(
      'ask',
      `Guard error while checking a '${checks[0].kind}' command (${
        err && err.message ? err.message : 'unknown'
      }). Confirm manually.`
    );
  }
}

main();
