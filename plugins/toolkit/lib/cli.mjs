// The `toolkit` command dispatcher.
//
// toolkit <group> [sub] [args]
//   loads lib/commands/<group>.mjs and calls its exported
//   async run(argv, ctx), where argv is every argument after <group>.
//   run returns an exit code (a number), or nothing for 0; it may throw a
//   ToolkitError, whose code becomes the exit code.
//   Each command file also exports `summary` (one line, shown by help) and may
//   export `help` (longer usage text, a string or a function returning one).
//   `toolkit help` imports every command file to read its summary, so a
//   command file must not do any work when it is imported.
//
// Built-in groups: version, help. Unknown group: exit 1 with the list of groups.
//
// ctx = {
//   cwd,          the folder the command runs in
//   json,         true when --json was given anywhere
//   host,         'claude' | 'codex' | null (from --host, else the environment)
//   env,          the environment variables
//   stdin,        async ({ timeoutMs } = {}) => all of standard input as text
//                 ('' for a terminal). Pass timeoutMs when the caller may leave
//                 the input open (hooks should). Also stdin.json() (parsed, or
//                 null when empty), stdin.text(), stdin.stream, and
//                 `for await (const chunk of ctx.stdin)`. Read once, then cached.
//   stdout, stderr (writable streams), pluginRoot, version, exitCode
// }
//
// main(argv, overrides) runs one command and returns its exit code without
// exiting; tests use it with overrides { cwd, env, stdin (a string or stream),
// stdout, stderr, commandsDir }. runCli() is what bin/toolkit calls.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { EXIT, ToolkitError, out, fail } from './core/output.mjs';

const LIB_DIR = path.dirname(fileURLToPath(import.meta.url));
export const PLUGIN_ROOT = path.dirname(LIB_DIR);
export const DEFAULT_COMMANDS_DIR = path.join(LIB_DIR, 'commands');
export const DEFAULT_VERSION = '0.1.0';

const BUILTINS = {
  help: 'List the commands, or show help for one: toolkit help <command>.',
  version: 'Print the toolkit version.',
};
const GROUP_NAME = /^[a-z][a-z0-9-]*$/;

/** The version in .claude-plugin/plugin.json, or 0.1.0 when there is none. */
export function readVersion(pluginRoot = PLUGIN_ROOT) {
  try {
    const manifest = JSON.parse(fs.readFileSync(path.join(pluginRoot, '.claude-plugin', 'plugin.json'), 'utf8'));
    if (manifest && typeof manifest.version === 'string' && manifest.version.trim()) return manifest.version.trim();
  } catch {
    // No manifest yet, or not readable.
  }
  return DEFAULT_VERSION;
}

/** Names of the command groups in a commands folder, sorted. */
export function listCommandGroups(commandsDir = DEFAULT_COMMANDS_DIR) {
  let names;
  try {
    names = fs.readdirSync(commandsDir);
  } catch {
    return [];
  }
  return names
    .filter((n) => n.endsWith('.mjs') && !n.endsWith('.test.mjs'))
    .map((n) => n.slice(0, -4))
    .filter((n) => GROUP_NAME.test(n) && !Object.prototype.hasOwnProperty.call(BUILTINS, n))
    .sort();
}

function normalizeHost(value) {
  if (!value || typeof value !== 'string') return null;
  const v = value.trim().toLowerCase();
  if (v === 'claude' || v === 'claude-code' || v === 'claudecode') return 'claude';
  if (v === 'codex') return 'codex';
  return v || null;
}

/** Which agent host started this process, from its environment. */
export function detectHost(env = process.env) {
  // Codex also sets CLAUDE_PLUGIN_ROOT for compatibility, so its own PLUGIN_ROOT is checked first.
  if (env.PLUGIN_ROOT || env.PLUGIN_DATA || env.CODEX_THREAD_ID || env.CODEX_SANDBOX) return 'codex';
  if (env.CLAUDECODE || env.CLAUDE_PLUGIN_ROOT || env.CLAUDE_PROJECT_DIR || env.CLAUDE_CODE_ENTRYPOINT) return 'claude';
  return null;
}

function makeStdinReader(source) {
  let cached = null;
  const streamOf = () => (typeof source === 'string' ? null : source || process.stdin);
  const read = ({ timeoutMs } = {}) => {
    if (cached) return cached;
    if (typeof source === 'string') {
      cached = Promise.resolve(source);
      return cached;
    }
    const stream = streamOf();
    if (!stream || stream.isTTY) {
      cached = Promise.resolve('');
      return cached;
    }
    cached = new Promise((resolve, reject) => {
      const chunks = [];
      let timer = null;
      const finish = () => {
        if (timer) clearTimeout(timer);
        stream.removeListener('data', onData);
        stream.removeListener('end', finish);
        stream.removeListener('error', onError);
        resolve(chunks.map((c) => (typeof c === 'string' ? c : c.toString('utf8'))).join(''));
      };
      const onData = (chunk) => chunks.push(chunk);
      const onError = (err) => {
        if (timer) clearTimeout(timer);
        reject(err);
      };
      stream.on('data', onData);
      stream.on('end', finish);
      stream.on('error', onError);
      if (timeoutMs && timeoutMs > 0) {
        timer = setTimeout(() => {
          if (typeof stream.pause === 'function') stream.pause();
          if (stream === process.stdin && typeof stream.destroy === 'function') stream.destroy();
          finish();
        }, timeoutMs);
      }
    });
    return cached;
  };
  read.text = read;
  read.json = async (opts) => {
    const text = await read(opts);
    if (!text.trim()) return null;
    try {
      return JSON.parse(text);
    } catch (err) {
      throw new ToolkitError(EXIT.INVALID, `Standard input is not valid JSON: ${err.message}`);
    }
  };
  Object.defineProperty(read, 'stream', { get: streamOf });
  read[Symbol.asyncIterator] = async function* iterate() {
    const text = await read();
    if (text) yield text;
  };
  return read;
}

function helpTextOf(mod) {
  if (!mod) return '';
  if (typeof mod.help === 'function') return String(mod.help() ?? '');
  if (typeof mod.help === 'string') return mod.help;
  return '';
}

async function loadCommand(group, commandsDir) {
  const file = path.join(commandsDir, `${group}.mjs`);
  if (!GROUP_NAME.test(group) || !fs.existsSync(file)) return { file, mod: null, missing: true };
  try {
    const mod = await import(pathToFileURL(file).href);
    return { file, mod, missing: false };
  } catch (err) {
    return { file, mod: null, missing: false, error: err };
  }
}

async function printHelp(ctx, commandsDir) {
  const groups = listCommandGroups(commandsDir);
  const entries = [
    { name: 'help', summary: BUILTINS.help },
    { name: 'version', summary: BUILTINS.version },
  ];
  for (const name of groups) {
    const { mod, error } = await loadCommand(name, commandsDir);
    let summary = mod && typeof mod.summary === 'string' ? mod.summary : '';
    if (error) summary = `(could not load: ${error.message})`;
    entries.push({ name, summary });
  }
  entries.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  const width = Math.max(...entries.map((e) => e.name.length));
  const lines = [
    'Usage: toolkit <command> [subcommand] [options]',
    '',
    'Commands:',
    ...entries.map((e) => `  ${e.name.padEnd(width)}  ${e.summary}`.trimEnd()),
    '',
    'Add --json to any command for machine-readable output.',
    'Run toolkit help <command> for the options of one command.',
  ];
  out(ctx, lines, { commands: entries });
  return EXIT.OK;
}

async function printCommandHelp(ctx, name, commandsDir) {
  if (Object.prototype.hasOwnProperty.call(BUILTINS, name)) {
    out(ctx, `toolkit ${name}: ${BUILTINS[name]}`, { name, summary: BUILTINS[name], help: '' });
    return EXIT.OK;
  }
  const { mod, missing, error, file } = await loadCommand(name, commandsDir);
  if (missing) return unknownGroup(ctx, name, commandsDir);
  if (error) {
    return fail(ctx, new ToolkitError(EXIT.ERROR, `The command file for "${name}" could not be loaded: ${error.message}`, { file }));
  }
  const summary = typeof mod.summary === 'string' ? mod.summary : '';
  const help = helpTextOf(mod);
  const lines = [`toolkit ${name}: ${summary}`.trimEnd()];
  if (help) lines.push('', help.trimEnd());
  out(ctx, lines, { name, summary, help });
  return EXIT.OK;
}

function unknownGroup(ctx, group, commandsDir) {
  const names = ['help', 'version', ...listCommandGroups(commandsDir)].sort();
  return fail(ctx, new ToolkitError(
    EXIT.ERROR,
    `Unknown command "${group}". Commands: ${names.join(', ')}.`,
    { command: group, commands: names, fix: 'Run toolkit help to see what each command does.' },
  ));
}

function scanGlobalFlags(tokens) {
  let json = false;
  let host = null;
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === '--') break;
    if (t === '--json' || t === '--json=true') json = true;
    else if (t === '--json=false') json = false;
    else if (t === '--host' && i + 1 < tokens.length) host = tokens[i + 1];
    else if (t.startsWith('--host=')) host = t.slice('--host='.length);
  }
  return { json, host };
}

/** Run one toolkit command and return its exit code. Never throws. */
export async function main(argv = process.argv.slice(2), overrides = {}) {
  const env = overrides.env || process.env;
  const commandsDir = overrides.commandsDir || DEFAULT_COMMANDS_DIR;
  const tokens = Array.from(argv || [], (t) => String(t));

  // Leading global flags, then the group.
  let i = 0;
  let group = null;
  while (i < tokens.length) {
    const t = tokens[i];
    if (t === '--json' || t === '--json=true' || t === '--json=false' || t.startsWith('--host=')) {
      i++;
      continue;
    }
    if (t === '--host') {
      i += 2;
      continue;
    }
    if (t === '--version' || t === '-v' || t === '-V') {
      group = 'version';
      i++;
      break;
    }
    if (t === '--help' || t === '-h') {
      group = 'help';
      i++;
      break;
    }
    group = t;
    i++;
    break;
  }
  const args = tokens.slice(i);
  const flags = scanGlobalFlags(tokens);

  const ctx = {
    cwd: overrides.cwd ? path.resolve(overrides.cwd) : process.cwd(),
    json: flags.json,
    host: normalizeHost(flags.host) || detectHost(env),
    env,
    stdin: makeStdinReader(overrides.stdin),
    stdout: overrides.stdout || process.stdout,
    stderr: overrides.stderr || process.stderr,
    pluginRoot: PLUGIN_ROOT,
    version: readVersion(overrides.pluginRoot || PLUGIN_ROOT),
    exitCode: undefined,
  };

  try {
    if (group === null || group === 'help') {
      const topic = args.find((a) => !a.startsWith('-'));
      return topic ? await printCommandHelp(ctx, topic, commandsDir) : await printHelp(ctx, commandsDir);
    }
    if (group === 'version') {
      out(ctx, ctx.version, { version: ctx.version });
      return EXIT.OK;
    }

    const { mod, missing, error, file } = await loadCommand(group, commandsDir);
    if (missing) return unknownGroup(ctx, group, commandsDir);
    if (error) {
      return fail(ctx, new ToolkitError(EXIT.ERROR, `The command file for "${group}" could not be loaded: ${error.message}`, { file }));
    }
    if (typeof mod.run !== 'function') {
      return fail(ctx, new ToolkitError(EXIT.ERROR, `The command file for "${group}" does not export a run function.`, { file }));
    }
    if (args[0] === '--help' || args[0] === '-h') return await printCommandHelp(ctx, group, commandsDir);

    const code = await mod.run(args, ctx);
    if (typeof code === 'number' && Number.isInteger(code)) return code;
    return typeof ctx.exitCode === 'number' ? ctx.exitCode : EXIT.OK;
  } catch (err) {
    return fail(ctx, err);
  }
}

/** Entry point for bin/toolkit: run main and set the process exit code. */
export async function runCli(argv = process.argv.slice(2)) {
  process.stdout.on('error', (err) => {
    if (err && err.code === 'EPIPE') process.exit(process.exitCode ?? 0);
  });
  const code = await main(argv);
  process.exitCode = code;
  return code;
}

function invokedDirectly() {
  if (!process.argv[1]) return false;
  try {
    return fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

if (invokedDirectly()) runCli();
