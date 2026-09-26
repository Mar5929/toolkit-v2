// toolkit index knowledge: rebuild ai-external-knowledge/INDEX.md.

import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from '../core/args.mjs';
import { EXIT, ToolkitError, out } from '../core/output.mjs';
import { requireProject } from '../core/config.mjs';
import { atomicWrite } from '../core/fsx.mjs';
import { buildKnowledgeIndex, INDEX_TARGET, KNOWLEDGE_DIR } from '../project/knowledge-index.mjs';

export const summary = 'Rebuild a generated index: toolkit index knowledge rebuilds ai-external-knowledge/INDEX.md from each topic\'s SOURCE-RECORD.md.';

export const help = `Usage:
  toolkit index knowledge [--check]

Lists every topic folder in ai-external-knowledge/ (not topic-template/) with
its publisher, title, capture date, and "Project use" line from its
SOURCE-RECORD.md. The index is generated: edit the SOURCE-RECORD.md files, not
INDEX.md. --check writes nothing and exits 1 when INDEX.md is out of date.`;

export async function run(argv, ctx) {
  const { _: pos, flags } = parseArgs(argv, { boolean: ['check', 'json'], string: ['host'] });
  const what = pos[0];
  if (what !== 'knowledge') {
    throw new ToolkitError(EXIT.INVALID, what ? `Unknown index "${what}". The only index is knowledge: toolkit index knowledge.` : 'Say which index to rebuild: toolkit index knowledge.');
  }
  const project = requireProject(ctx.cwd);
  const file = path.join(project.root, ...INDEX_TARGET.split('/'));
  if (!fs.existsSync(path.join(project.root, KNOWLEDGE_DIR))) {
    throw new ToolkitError(EXIT.ERROR, `${KNOWLEDGE_DIR}/ does not exist in ${project.root}.`, { fix: 'Run toolkit sync to add it.' });
  }
  const { text, topics } = buildKnowledgeIndex(project.root);
  let current = null;
  try {
    current = fs.readFileSync(file, 'utf8');
  } catch {
    current = null;
  }
  const upToDate = current === text;
  if (flags.check) {
    out(ctx, upToDate ? `${INDEX_TARGET} is up to date (${topics.length} topic${topics.length === 1 ? '' : 's'}).` : `${INDEX_TARGET} is out of date. Run toolkit index knowledge.`, { ok: upToDate, topics, path: file });
    return upToDate ? EXIT.OK : EXIT.ERROR;
  }
  if (!upToDate) atomicWrite(file, text);
  const missing = topics.filter((t) => !t.record).map((t) => t.folder);
  const lines = [upToDate ? `${INDEX_TARGET} was already up to date (${topics.length} topic${topics.length === 1 ? '' : 's'}).` : `Rebuilt ${INDEX_TARGET}: ${topics.length} topic${topics.length === 1 ? '' : 's'}.`];
  if (missing.length) lines.push(`Topic folders without a SOURCE-RECORD.md: ${missing.join(', ')}. Start one from ${KNOWLEDGE_DIR}/topic-template/SOURCE-RECORD-TEMPLATE.md.`);
  out(ctx, lines, { ok: true, changed: !upToDate, path: file, topics });
  return EXIT.OK;
}
