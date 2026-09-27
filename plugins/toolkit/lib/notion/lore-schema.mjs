// Lore's Notion vault layout, pinned for the toolkit's Notion memory.
//
// Lore (https://github.com/makenotion/lore) is Notion's open-source AI memory
// system. A Lore "vault" is one Notion page whose direct children are five
// databases: Projects, Topics, Memories, Entities, and Facts. The toolkit
// writes each project's Notion memory in that layout, so Lore's own read tools
// can read the same rows (dev/research/lore.md, option C). The toolkit does not
// run Lore, install it, or use its search or hooks.
//
// The property lists below are copied from Lore 1.0.0 at commit
// 6e741b1bb91a36b47213f4d3af5bbdfaa2f2081d: the exact create payloads that
// createVaultDatabases() in src/notion/setup.ts sends with the built-in
// "default@1.0.0" profile (src/notion/schema.ts, profiles/default/). They were
// taken by calling that function with a stub client, so names, types, option
// names, option colors, and order match Lore. Relation targets are written as
// '$projects', '$topics', '$memories', and '$entities' and filled in with the
// real data source ids by loreProperties().
//
// Lore promises not to rename or remove these properties (its AGENTS.md,
// "Non-Negotiables"); new Lore versions only add. Before moving to a newer
// Lore, compare this file with its src/notion/schema.ts again.
//
// The copied schema is covered by Lore's license:
//
//   MIT License
//
//   Copyright (c) 2026 Notion Labs, Inc.
//
//   Permission is hereby granted, free of charge, to any person obtaining a copy
//   of this software and associated documentation files (the "Software"), to deal
//   in the Software without restriction, including without limitation the rights
//   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//   copies of the Software, and to permit persons to whom the Software is
//   furnished to do so, subject to the following conditions:
//
//   The above copyright notice and this permission notice shall be included in all
//   copies or substantial portions of the Software.
//
//   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//   SOFTWARE.

export const LORE_REPOSITORY = 'https://github.com/makenotion/lore';
export const LORE_VERSION = '1.0.0';
export const LORE_COMMIT = '6e741b1bb91a36b47213f4d3af5bbdfaa2f2081d';
export const LORE_PROFILE = 'default@1.0.0';

/** The five vault databases, in the order Lore creates them (each relation needs the one it points at). */
export const VAULT_DATABASES = Object.freeze(['projects', 'topics', 'memories', 'entities', 'facts']);

/** The exact titles Lore looks for among the vault page's child databases. */
export const VAULT_TITLES = Object.freeze({ projects: 'Projects', topics: 'Topics', memories: 'Memories', entities: 'Entities', facts: 'Facts' });

const PINNED = Object.freeze({
  Projects: {
    Name: { title: {} },
    Type: { select: { options: [{ name: 'project', color: 'blue' }, { name: 'person', color: 'green' }, { name: 'agent', color: 'purple' }] } },
    Path: { rich_text: {} },
    Status: { select: { options: [{ name: 'active', color: 'green' }, { name: 'archived', color: 'gray' }] } },
    Description: { rich_text: {} },
  },
  Topics: {
    Name: { title: {} },
    Project: { relation: { dual_property: {}, data_source_id: '$projects' } },
    Description: { rich_text: {} },
  },
  Memories: {
    Title: { title: {} },
    Project: { relation: { single_property: {}, data_source_id: '$projects' } },
    Topic: { relation: { single_property: {}, data_source_id: '$topics' } },
    Source: { select: { options: [{ name: 'conversation', color: 'blue' }, { name: 'autosave_learning', color: 'pink' }, { name: 'file', color: 'yellow' }, { name: 'manual', color: 'green' }, { name: 'agent_diary', color: 'purple' }, { name: 'digest', color: 'brown' }] } },
    Kind: { select: { options: [{ name: 'note', color: 'default' }, { name: 'decision', color: 'blue' }, { name: 'incident', color: 'red' }, { name: 'runbook', color: 'green' }, { name: 'postmortem', color: 'orange' }, { name: 'policy', color: 'purple' }, { name: 'state', color: 'gray' }, { name: 'operational', color: 'gray' }, { name: 'task', color: 'yellow' }, { name: 'procedure', color: 'pink' }] } },
    'Task State': { select: { options: [{ name: 'open', color: 'yellow' }, { name: 'in-progress', color: 'blue' }, { name: 'blocked', color: 'red' }, { name: 'done', color: 'green' }, { name: 'cancelled', color: 'gray' }] } },
    'Blocked By': { rich_text: {} },
    Entity: { rich_text: {} },
    Status: { select: { options: [{ name: 'informational', color: 'default' }, { name: 'proposed', color: 'yellow' }, { name: 'accepted', color: 'green' }, { name: 'superseded', color: 'gray' }, { name: 'deprecated', color: 'brown' }, { name: 'rejected', color: 'red' }] } },
    'Topic Key': { rich_text: {} },
    'Revision Count': { number: { format: 'number' } },
    'Compare Notes': { rich_text: {} },
    'Promotion Source Key': { rich_text: {} },
    'Review By': { date: {} },
    'Done At': { date: {} },
    'Decided At': { date: {} },
    'Last Referenced At': { date: {} },
    Alternatives: { rich_text: {} },
    Consequences: { rich_text: {} },
    Author: { rich_text: {} },
    Agent: { rich_text: {} },
    Tags: { multi_select: { options: [{ name: 'android', color: 'default' }, { name: 'api', color: 'default' }, { name: 'architecture', color: 'default' }, { name: 'audit', color: 'default' }, { name: 'backend', color: 'default' }, { name: 'bug', color: 'default' }, { name: 'build', color: 'default' }, { name: 'ci', color: 'default' }, { name: 'code-review', color: 'default' }, { name: 'concurrency', color: 'default' }, { name: 'config', color: 'default' }, { name: 'convention', color: 'default' }, { name: 'data-model', color: 'default' }, { name: 'db', color: 'default' }, { name: 'decision-context', color: 'default' }, { name: 'dependency', color: 'default' }, { name: 'deployment', color: 'default' }, { name: 'docs', color: 'default' }, { name: 'error-handling', color: 'default' }, { name: 'frontend', color: 'default' }, { name: 'gotcha', color: 'default' }, { name: 'incident', color: 'default' }, { name: 'infrastructure', color: 'default' }, { name: 'investigation', color: 'default' }, { name: 'ios', color: 'default' }, { name: 'migration', color: 'default' }, { name: 'observability', color: 'default' }, { name: 'onboarding', color: 'default' }, { name: 'performance', color: 'default' }, { name: 'policy', color: 'default' }, { name: 'postmortem', color: 'default' }, { name: 'refactor', color: 'default' }, { name: 'runbook', color: 'default' }, { name: 'security', color: 'default' }, { name: 'testing', color: 'default' }, { name: 'tooling', color: 'default' }, { name: 'ui', color: 'default' }, { name: 'ux', color: 'default' }, { name: 'web', color: 'default' }, { name: 'workflow', color: 'default' }] } },
    Keywords: { rich_text: {} },
    Synopsis: { rich_text: {} },
    'Expires On': { rich_text: {} },
    Session: { rich_text: {} },
    'Scope Kind': { select: { options: [{ name: 'team', color: 'blue' }, { name: 'project', color: 'green' }, { name: 'user', color: 'yellow' }, { name: 'agent', color: 'purple' }, { name: 'role', color: 'orange' }, { name: 'session', color: 'pink' }, { name: 'run', color: 'red' }, { name: 'environment', color: 'brown' }, { name: 'global', color: 'gray' }] } },
    'Scope Key': { rich_text: {} },
    Audience: { rich_text: {} },
    Lifetime: { select: { options: [{ name: 'persistent', color: 'default' }, { name: 'expires', color: 'yellow' }, { name: 'session-only', color: 'pink' }, { name: 'until-task-closed', color: 'orange' }, { name: 'until-decision-superseded', color: 'blue' }] } },
    'Expires At': { date: {} },
    Pinned: { checkbox: {} },
    'Pinned Priority': { number: { format: 'number' } },
    Mutability: { select: { options: [{ name: 'mutable', color: 'default' }, { name: 'read-only', color: 'red' }] } },
  },
  Entities: {
    Name: { title: {} },
    Aliases: { rich_text: {} },
    Kind: { select: { options: [{ name: 'class', color: 'default' }, { name: 'function', color: 'default' }, { name: 'file', color: 'default' }, { name: 'workflow', color: 'default' }, { name: 'pr', color: 'default' }, { name: 'task-id', color: 'default' }, { name: 'person', color: 'default' }, { name: 'system', color: 'default' }] } },
    Description: { rich_text: {} },
    Project: { relation: { dual_property: {}, data_source_id: '$projects' } },
    Source: { relation: { single_property: {}, data_source_id: '$memories' } },
  },
  Facts: {
    Subject: { title: {} },
    Predicate: { select: { options: [{ name: 'is_a', color: 'default' }, { name: 'has_a', color: 'default' }, { name: 'related_to', color: 'default' }, { name: 'uses', color: 'default' }, { name: 'depends_on', color: 'default' }, { name: 'created_by', color: 'default' }, { name: 'owned_by', color: 'default' }, { name: 'replaces', color: 'default' }, { name: 'extends', color: 'default' }, { name: 'conflicts_with', color: 'default' }, { name: 'needs_action', color: 'default' }, { name: 'waiting_on', color: 'default' }, { name: 'blocked_by', color: 'default' }, { name: 'decided_by', color: 'default' }, { name: 'supersedes_decision', color: 'default' }, { name: 'informs', color: 'default' }, { name: 'mentions', color: 'default' }] } },
    Object: { rich_text: {} },
    Project: { relation: { single_property: {}, data_source_id: '$projects' } },
    'Valid From': { date: {} },
    'Valid Until': { date: {} },
    'Observed At': { date: {} },
    'Invalidated At': { date: {} },
    'Invalidated By': { relation: { single_property: {}, data_source_id: '$memories' } },
    'Review By': { date: {} },
    Source: { relation: { single_property: {}, data_source_id: '$memories' } },
    Confidence: { select: { options: [{ name: 'certain', color: 'green' }, { name: 'likely', color: 'yellow' }, { name: 'speculative', color: 'orange' }] } },
    'Confidence Score': { number: { format: 'number' } },
    'Last Referenced At': { date: {} },
    DedupKey: { rich_text: {} },
    SubjectKey: { rich_text: {} },
    SubjectEntity: { relation: { single_property: {}, data_source_id: '$entities' } },
    ObjectEntity: { relation: { single_property: {}, data_source_id: '$entities' } },
    'Scope Kind': { select: { options: [{ name: 'team', color: 'blue' }, { name: 'project', color: 'green' }, { name: 'user', color: 'yellow' }, { name: 'agent', color: 'purple' }, { name: 'role', color: 'orange' }, { name: 'session', color: 'pink' }, { name: 'run', color: 'red' }, { name: 'environment', color: 'brown' }, { name: 'global', color: 'gray' }] } },
    'Scope Key': { rich_text: {} },
    Audience: { rich_text: {} },
    Lifetime: { select: { options: [{ name: 'persistent', color: 'default' }, { name: 'expires', color: 'yellow' }, { name: 'session-only', color: 'pink' }, { name: 'until-task-closed', color: 'orange' }, { name: 'until-decision-superseded', color: 'blue' }] } },
    'Expires At': { date: {} },
  },
  MemoriesSelfRelations: {
    Supersedes: { relation: { single_property: {}, data_source_id: '$memories' } },
    Affects: { relation: { single_property: {}, data_source_id: '$memories' } },
    'Compared With': { relation: { single_property: {}, data_source_id: '$memories' } },
  },
});

const ICONS = Object.freeze({ Projects: '🗂️', Topics: '📑', Memories: '🧠', Entities: '🪪', Facts: '🔗' });

const TOKENS = Object.freeze({ $projects: 'projects', $topics: 'topics', $memories: 'memories', $entities: 'entities' });

/** A property key for code and .toolkit.json: 'Task State' -> 'taskState', 'DedupKey' -> 'dedupKey'. */
export function propertyKey(name) {
  const words = String(name).split(/[^A-Za-z0-9]+/).filter(Boolean);
  return words.map((w, i) => (i === 0 ? w[0].toLowerCase() + w.slice(1) : w[0].toUpperCase() + w.slice(1))).join('');
}

function fillRelation(spec, ids, which, name) {
  const rel = spec.relation;
  const target = TOKENS[rel.data_source_id];
  const id = ids[target];
  if (!id) throw new Error(`The ${VAULT_TITLES[which]} property "${name}" needs the ${VAULT_TITLES[target]} data source id.`);
  const variant = rel.dual_property ? 'dual_property' : 'single_property';
  return { relation: { data_source_id: id, type: variant, [variant]: {} } };
}

function listOf(which, source, ids) {
  return Object.entries(source).map(([name, spec]) => ({
    key: propertyKey(name),
    name,
    spec: spec.relation ? fillRelation(spec, ids, which, name) : JSON.parse(JSON.stringify(spec)),
  }));
}

/**
 * Lore's properties for one vault database, in Lore's order, as the toolkit's
 * [{ key, name, spec }] lists. ids holds the data source ids the relations point
 * at: { projects, topics, memories, entities }. For 'memories' the three
 * relations to itself (Supersedes, Affects, Compared With) are included only
 * when ids.memories is given, because Lore adds them after the database exists.
 */
export function loreProperties(which, ids = {}) {
  const map = { projects: 'Projects', topics: 'Topics', memories: 'Memories', entities: 'Entities', facts: 'Facts' };
  if (!map[which]) throw new Error(`Lore has no ${which} database.`);
  const list = listOf(which, PINNED[map[which]], ids);
  if (which === 'memories' && ids.memories) list.push(...listOf(which, PINNED.MemoriesSelfRelations, ids));
  return list;
}

/** The icon Lore gives a vault database. */
export function loreIcon(which) {
  return ICONS[VAULT_TITLES[which]];
}

/** The Tags options of Lore's default profile (40 engineering tags). */
export function loreTagOptions() {
  return PINNED.Memories.Tags.multi_select.options.map((o) => ({ ...o }));
}
