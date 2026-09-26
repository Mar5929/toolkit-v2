// The Hindsight background service on this Mac: the launchd user agent
// local.toolkit-v2.hindsight (research/hindsight.md section 9).
//
// install  renders templates/hindsight/local.toolkit-v2.hindsight.plist.tmpl
//          ({{HOME}} becomes the home folder), checks it with plutil, creates the
//          working and log folders, writes ~/Library/LaunchAgents/<label>.plist,
//          and loads it with launchctl bootstrap. It is safe to run again: when
//          the same plist is already installed and loaded it changes nothing;
//          when the plist differs it unloads the old one first.
// status   installed? loaded? running? pid? same as the template?
// start    loads the agent when it is not loaded, else kickstarts it
// stop     unloads the agent (launchctl bootout), so KeepAlive does not restart it
//
// Everything that touches the computer goes through `runner(cmd, args)`, and
// the plist path is a parameter, so tests never touch the real LaunchAgent.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { EXIT, ToolkitError } from '../core/output.mjs';
import { atomicWrite, ensureDir, readText } from '../core/fsx.mjs';
import { run } from '../core/util.mjs';

export const LABEL = 'local.toolkit-v2.hindsight';
const HERE = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_TEMPLATE = path.resolve(HERE, '..', '..', 'templates', 'hindsight', `${LABEL}.plist.tmpl`);

export function defaultPlistPath(home = os.homedir()) {
  return path.join(home, 'Library', 'LaunchAgents', `${LABEL}.plist`);
}

/** The runner used on a real computer: runs the program and waits (20 s limit). */
export function defaultRunner(cmd, args) {
  return run(cmd, args, { timeoutMs: 20000 });
}

/**
 * Fill {{NAME}} tokens from vars. A token with no value is an error that
 * names it, so a half-filled plist is never written.
 */
export function renderPlist(templateText, vars) {
  const missing = new Set();
  const text = String(templateText).replace(/\{\{([A-Za-z0-9_.]+)\}\}/g, (m, name) => {
    if (Object.prototype.hasOwnProperty.call(vars, name) && vars[name] !== undefined && vars[name] !== null) {
      return String(vars[name]).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    missing.add(name);
    return m;
  });
  if (missing.size) {
    throw new ToolkitError(EXIT.INVALID, `The Hindsight service template has tokens with no value: ${[...missing].map((n) => `{{${n}}}`).join(', ')}.`, {
      missing: [...missing],
    });
  }
  return text;
}

function plistString(text, key) {
  const m = new RegExp(`<key>${key}</key>\\s*<string>([^<]*)</string>`).exec(text);
  return m ? m[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') : null;
}

/** The folders launchd needs to exist before it starts the job. */
export function plistFolders(text) {
  const dirs = new Set();
  const wd = plistString(text, 'WorkingDirectory');
  if (wd) dirs.add(wd);
  for (const key of ['StandardOutPath', 'StandardErrorPath']) {
    const p = plistString(text, key);
    if (p) dirs.add(path.dirname(p));
  }
  return [...dirs];
}

function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function normalizeText(text) {
  return String(text ?? '').replace(/\r\n/g, '\n').replace(/[ \t]+$/gm, '').replace(/\s+$/, '');
}

export function createService({
  plistPath = defaultPlistPath(),
  templateFile = DEFAULT_TEMPLATE,
  home = os.homedir(),
  uid = typeof process.getuid === 'function' ? process.getuid() : 501,
  runner = defaultRunner,
  label = LABEL,
  tmpDir = os.tmpdir(),
} = {}) {
  const domain = `gui/${uid}`;
  const target = `${domain}/${label}`;

  const call = (cmd, args) => {
    const res = runner(cmd, args) || {};
    return { code: typeof res.code === 'number' ? res.code : 1, stdout: res.stdout || '', stderr: res.stderr || '' };
  };

  function rendered() {
    const tmpl = readText(templateFile);
    if (tmpl === null) {
      throw new ToolkitError(EXIT.ERROR, `The Hindsight service template is missing: ${templateFile}.`, {
        fix: 'Reinstall the toolkit plugin.',
      });
    }
    return renderPlist(tmpl, { HOME: home });
  }

  /** Run plutil on text. Returns { ok, skipped, message }. */
  function lint(text) {
    const tmp = path.join(tmpDir, `toolkit-hindsight-${process.pid}-${crypto.randomBytes(4).toString('hex')}.plist`);
    fs.writeFileSync(tmp, text);
    try {
      const res = call('plutil', ['-lint', tmp]);
      if (res.code === 127) return { ok: true, skipped: true, message: 'plutil is not available; the plist was not checked.' };
      return { ok: res.code === 0, skipped: false, message: (res.stdout + res.stderr).trim() };
    } finally {
      fs.rmSync(tmp, { force: true });
    }
  }

  /** JSON form of plist text through plutil, or null when plutil cannot convert it. */
  function asJson(text) {
    const tmp = path.join(tmpDir, `toolkit-hindsight-${process.pid}-${crypto.randomBytes(4).toString('hex')}.plist`);
    fs.writeFileSync(tmp, text);
    try {
      const res = call('plutil', ['-convert', 'json', '-o', '-', tmp]);
      if (res.code !== 0) return null;
      return JSON.parse(res.stdout);
    } catch {
      return null;
    } finally {
      fs.rmSync(tmp, { force: true });
    }
  }

  function samePlist(a, b) {
    if (a === null || b === null) return false;
    if (normalizeText(a) === normalizeText(b)) return true;
    const ja = asJson(a);
    const jb = asJson(b);
    return ja !== null && jb !== null && JSON.stringify(ja) === JSON.stringify(jb);
  }

  /** { loaded, running, pid, lastExit } from launchctl print. */
  function launchState() {
    const res = call('launchctl', ['print', target]);
    if (res.code !== 0) return { loaded: false, running: false, pid: null, lastExit: null };
    const state = /^\s*state = (\S+)/m.exec(res.stdout);
    const pid = /^\s*pid = (\d+)/m.exec(res.stdout);
    const lastExit = /^\s*last exit code = (.+)$/m.exec(res.stdout);
    return {
      loaded: true,
      running: state ? state[1] === 'running' : Boolean(pid),
      pid: pid ? Number(pid[1]) : null,
      lastExit: lastExit ? lastExit[1].trim() : null,
    };
  }

  function bootstrap() {
    const res = call('launchctl', ['bootstrap', domain, plistPath]);
    if (res.code !== 0) {
      throw new ToolkitError(EXIT.ERROR, `launchctl could not load ${plistPath}: ${(res.stderr || res.stdout).trim() || `exit ${res.code}`}.`, {
        plistPath,
        fix: `Check the file with plutil -lint ${plistPath}, and the log folder named in it.`,
      });
    }
  }

  function bootout() {
    const res = call('launchctl', ['bootout', target]);
    // launchd can take a moment to finish unloading; wait up to 10 seconds.
    for (let i = 0; i < 40 && launchState().loaded; i++) sleepSync(250);
    if (launchState().loaded) {
      throw new ToolkitError(EXIT.ERROR, `launchctl could not unload ${label}: ${(res.stderr || res.stdout).trim() || `exit ${res.code}`}.`, { label });
    }
  }

  return {
    label,
    plistPath,
    templateFile,
    target,

    async status() {
      const installedText = readText(plistPath);
      let sameAsTemplate = null;
      try {
        sameAsTemplate = installedText === null ? null : samePlist(installedText, rendered());
      } catch {
        sameAsTemplate = null;
      }
      return { label, plistPath, installed: installedText !== null, sameAsTemplate, ...launchState() };
    },

    async install() {
      const text = rendered();
      const check = lint(text);
      if (!check.ok) {
        throw new ToolkitError(EXIT.ERROR, `The rendered Hindsight service file does not pass plutil -lint: ${check.message}`, { templateFile });
      }
      const existing = readText(plistPath);
      const same = samePlist(existing, text);
      const before = launchState();
      if (same && before.loaded) {
        return { action: 'none', changed: false, plistPath, message: `${label} is already installed with this plist and loaded. Nothing changed.`, ...before };
      }
      for (const dir of plistFolders(text)) ensureDir(dir);
      if (!same) {
        if (before.loaded) bootout();
        ensureDir(path.dirname(plistPath));
        atomicWrite(plistPath, text);
        fs.chmodSync(plistPath, 0o644);
      }
      bootstrap();
      const after = launchState();
      const action = !same ? (existing === null ? 'installed' : 'replaced') : 'loaded';
      const message = {
        installed: `Installed ${plistPath} and loaded ${label}.`,
        replaced: `Replaced ${plistPath} (it differed from the template) and loaded ${label} again.`,
        loaded: `${plistPath} was already current; loaded ${label}.`,
      }[action];
      return { action, changed: true, plistPath, message, lint: check, ...after };
    },

    async start() {
      if (readText(plistPath) === null) {
        throw new ToolkitError(EXIT.ERROR, `${label} is not installed (${plistPath} does not exist).`, {
          fix: 'Run toolkit hindsight service install.',
        });
      }
      const before = launchState();
      if (!before.loaded) {
        bootstrap();
        return { action: 'loaded', changed: true, message: `Loaded ${label}; launchd starts it now.`, ...launchState() };
      }
      if (before.running) return { action: 'none', changed: false, message: `${label} is already running (pid ${before.pid}).`, ...before };
      const res = call('launchctl', ['kickstart', target]);
      if (res.code !== 0) {
        throw new ToolkitError(EXIT.ERROR, `launchctl could not start ${label}: ${(res.stderr || res.stdout).trim() || `exit ${res.code}`}.`, { label });
      }
      return { action: 'started', changed: true, message: `Started ${label}.`, ...launchState() };
    },

    async stop() {
      const before = launchState();
      if (!before.loaded) return { action: 'none', changed: false, message: `${label} is not loaded, so it is already stopped.`, ...before };
      bootout();
      return { action: 'stopped', changed: true, message: `Stopped and unloaded ${label}. Start it again with toolkit hindsight service start.`, ...launchState() };
    },
  };
}
