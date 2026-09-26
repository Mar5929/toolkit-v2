// Which files a tool call touches, and what kind of toolkit file each one is.
//
// Claude Code: Write, Edit, and MultiEdit carry an absolute tool_input.file_path.
// Codex: apply_patch carries the whole patch in tool_input.command; the file
// names are on its header lines, relative to the session folder:
//   *** Add File: <path>   *** Update File: <path>   *** Delete File: <path>   *** Move to: <path>

import fs from 'node:fs';
import path from 'node:path';

const PATCH_HEADER = /^\*\*\* (Add File|Update File|Delete File|Move to):\s*(.+?)\s*$/;

/** The files an apply_patch text names: [{ path, action }]. */
export function patchFiles(patch) {
  const out = [];
  for (const line of String(patch || '').split(/\r?\n/)) {
    const m = PATCH_HEADER.exec(line);
    if (m) out.push({ path: m[2], action: m[1] });
  }
  return out;
}

/** The absolute paths a file-editing tool call touches (empty for other tools). */
export function editedPaths(input, cwd) {
  const tool = input && input.tool_name;
  const ti = (input && input.tool_input) || {};
  const base = (input && input.cwd) || cwd || process.cwd();
  if (tool === 'apply_patch' || ((tool === 'Edit' || tool === 'Write') && typeof ti.command === 'string' && !ti.file_path)) {
    return patchFiles(ti.command || ti.patch || '').map((f) => ({ path: path.resolve(base, f.path), action: f.action }));
  }
  if (['Write', 'Edit', 'MultiEdit'].includes(tool) && typeof ti.file_path === 'string') {
    return [{ path: path.resolve(base, ti.file_path), action: tool }];
  }
  return [];
}

function relTo(root, file) {
  if (!root) return null;
  const rel = path.relative(root, file);
  if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) return null;
  return rel.split(path.sep).join('/');
}

/**
 * The real path of a file that may not exist yet: the real path of its
 * nearest existing folder, with the rest of the path added back. On macOS
 * /tmp is a link to /private/tmp, and Git reports the real path, so a path
 * given through the link is compared this way.
 */
export function realPath(file) {
  const rest = [];
  let dir = path.resolve(file);
  for (;;) {
    try {
      const real = fs.realpathSync(dir);
      return rest.length ? path.join(real, ...rest.reverse()) : real;
    } catch {
      const parent = path.dirname(dir);
      if (parent === dir) return path.resolve(file);
      rest.push(path.basename(dir));
      dir = parent;
    }
  }
}

/** A path relative to the project folder or the main checkout, whichever holds it. */
export function projectRelative(file, project) {
  const direct = relTo(project.root, file) || relTo(project.mainRoot, file);
  if (direct) return direct;
  const real = realPath(file);
  if (real === file) return null;
  return relTo(project.root, real) || relTo(project.mainRoot, real);
}

/** The path to use for a file in this project: as given, or its real path when only that is inside the project. */
export function projectPath(file, project) {
  if (relTo(project.root, file) || relTo(project.mainRoot, file)) return file;
  const real = realPath(file);
  return relTo(project.root, real) || relTo(project.mainRoot, real) ? real : file;
}

/** Generated files: never edited by hand, each with the command that builds it. */
export const GENERATED = Object.freeze({
  '.work-items/DASHBOARD.md': 'It is rebuilt after every toolkit work command. Change work items with toolkit work commands (toolkit work sync rebuilds it on its own).',
  '.work-items/.toolkit-state.json': 'It is the work tracker\'s own state (the id-to-path map and the highest id used). toolkit work commands keep it; toolkit work sync brings it in step after items are moved by hand.',
  '.memory/MEMORY.md': 'It is rebuilt by toolkit memory save and toolkit memory reindex. Change memory with the memory-save skill.',
  'ai-external-knowledge/INDEX.md': 'It is built from each topic folder\'s SOURCE-RECORD.md. Edit the SOURCE-RECORD.md, then run toolkit index knowledge.',
});

/** The generated file a path is, or null. */
export function generatedFile(file, project) {
  const rel = projectRelative(file, project);
  return rel && Object.prototype.hasOwnProperty.call(GENERATED, rel) ? rel : null;
}

/** True for a Markdown file inside .work-items/ that may be a work item record or design. */
export function isWorkItemFile(file, project) {
  const rel = projectRelative(file, project);
  if (!rel || !rel.startsWith('.work-items/') || !rel.toLowerCase().endsWith('.md')) return false;
  if (rel === '.work-items/DASHBOARD.md') return false;
  const parts = rel.split('/').slice(1, -1);
  return !parts.some((p) => p === 'work-item-template' || p.startsWith('.') || p.startsWith('_'));
}

/** True for a memory record file in .memory/ (not the index, the guide, or the seeds). */
export function isMemoryTopic(file, project) {
  const rel = projectRelative(file, project);
  if (!rel || !rel.startsWith('.memory/') || !rel.toLowerCase().endsWith('.md')) return false;
  const name = rel.split('/').pop();
  return !['MEMORY.md', 'AGENTS.md', 'memory-criteria.md'].includes(name);
}

/** Fast check without Git: could this path be a file the hooks care about? */
export function mightMatter(file) {
  const p = String(file || '');
  return p.includes('.work-items') || p.includes('.memory') || p.endsWith('INDEX.md');
}
