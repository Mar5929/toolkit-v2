// What the test files share so that they run on Windows as well as on a Mac. Not a test file:
// its name does not end in .test.mjs, so `node --test 'dev/tests/*.test.mjs'` does not run it.
// Windows differs in five ways. PATH is split by ";". A child process needs SystemRoot, ComSpec,
// and PATHEXT. The only sh is the one Git for Windows installs. A stand-in for a command must be
// a .cmd file. And the temporary folder may be given in its short form (MICHAE~1), which Git
// never prints.
import { existsSync, mkdtempSync, realpathSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join } from 'node:path';

export const WINDOWS = process.platform === 'win32';
/** The folder that holds the first command `name` on this session's PATH. */
function folderOf(name) {
  const file = WINDOWS ? `${name}.exe` : name;
  const folder = (process.env.PATH ?? '').split(delimiter).find((each) => each && existsSync(join(each, file)));
  if (!folder) throw new Error(`${file} is not on PATH`);
  return folder;
}
export const gitPath = folderOf('git');
// Git for Windows keeps sh.exe in usr\bin, one or two folders above the folder that holds git.exe.
const windowsSh = () => [dirname(gitPath), dirname(dirname(gitPath))].map((root) => join(root, 'usr', 'bin')).find((each) => existsSync(join(each, 'sh.exe'))) ?? folderOf('sh');
/** The folders of the standard commands (sh, echo): the last part of every PATH a test builds. */
const SYSTEM_FOLDERS = WINDOWS ? [windowsSh()] : ['/usr/bin', '/bin'];
export const SH = WINDOWS ? join(SYSTEM_FOLDERS[0], 'sh.exe') : '/bin/sh';

/** A PATH that holds `folders`, then the folders of the standard commands. */
export const pathOf = (...folders) => [...folders, ...SYSTEM_FOLDERS].join(delimiter);
/** The environment of a child process: HOME is the scratch folder, and no computer-wide Git settings are read. */
export function testEnv(home, ...folders) {
  const windows = WINDOWS ? { SystemRoot: process.env.SystemRoot, ComSpec: process.env.ComSpec, PATHEXT: '.COM;.EXE;.BAT;.CMD', USERPROFILE: home } : {};
  return { HOME: home, PATH: pathOf(...folders), GIT_CONFIG_NOSYSTEM: '1', ...windows };
}
/** A new temporary folder, by its full real path. */
export const scratchFolder = (prefix) => realpathSync.native(mkdtempSync(join(tmpdir(), prefix)));

/** Makes a stand-in for the command `name` in the folder `bin`. It writes its arguments to
 * <bin>/args, prints `out` and `err`, and exits with `code`. It runs in Node: a shell script on a
 * Mac starts it, and a .cmd file on Windows, which cannot run a shell script. */
export function standIn(bin, name, { out = '', err = '', code = 0 } = {}) {
  const script = join(bin, `${name}-stand-in.cjs`);
  writeFileSync(script, `require('fs').writeFileSync(${JSON.stringify(join(bin, 'args'))}, process.argv.slice(2).join(' ') + '\\n');
process.stdout.write(${JSON.stringify(out)});
process.stderr.write(${JSON.stringify(err)});
process.exitCode = ${code};
`);
  if (WINDOWS) writeFileSync(join(bin, `${name}.cmd`), `@"${process.execPath}" "${script}" %*\r\n`);
  else writeFileSync(join(bin, name), `#!/bin/sh\nexec "${process.execPath}" "${script}" "$@"\n`, { mode: 0o755 });
}
