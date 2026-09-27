// The Notion schemas the toolkit builds: the Projects registry properties,
// each project's Work Items database, and each project's memory (Lore's
// layout, from lore-schema.mjs, plus the toolkit's own columns).
//
// Every property has a key (used in code and in .toolkit.json), a name (what
// Mike sees), and a spec (the Notion API property configuration). The toolkit
// stores each property's Notion id in .toolkit.json after it is created, and
// uses the id afterwards, so Mike can rename a column without breaking anything.
//
// Sources: ARCHITECTURE 4.4 (work item fields), ARCHITECTURE 7 (memory record
// fields), dev/research/notion-design.md sections 8 and 9.

import { STAGES, STATUSES, TYPE_IDS, PRIORITIES, DELIVERY, ITEM_DESIGN_VALUES } from '../work/lifecycle.mjs';
import { loreProperties } from './lore-schema.mjs';

export const STATUS_GROUPS = Object.freeze({
  Backlog: 'To-do',
  Ready: 'To-do',
  'In Progress': 'In progress',
  'In Review': 'In progress',
  Done: 'Complete',
  Cancelled: 'Complete',
});

const STATUS_COLORS = { Backlog: 'gray', Ready: 'blue', 'In Progress': 'yellow', 'In Review': 'purple', Done: 'green', Cancelled: 'brown' };
const STAGE_COLORS = ['gray', 'gray', 'blue', 'purple', 'purple', 'purple', 'purple', 'orange', 'yellow', 'red', 'pink', 'green', 'green', 'green'];
const PRIORITY_COLORS = { urgent: 'red', high: 'orange', medium: 'yellow', low: 'gray' };

const text = (description) => ({ rich_text: {}, ...(description ? { description } : {}) });

// ------------------------------------------------------------------ Projects registry

/** The properties the real Projects database already has (kept as they are). */
export const PROJECTS_BASE_PROPERTIES = Object.freeze([
  { key: 'title', name: 'Project', spec: { title: {} } },
  {
    key: 'status',
    name: 'Status',
    spec: {
      status: {
        options: [
          { name: 'Backlog', color: 'gray', group: 'To-do' },
          { name: 'Planned', color: 'blue', group: 'To-do' },
          { name: 'Active', color: 'yellow', group: 'In progress' },
          { name: 'Blocked', color: 'red', group: 'In progress' },
          { name: 'Complete', color: 'green', group: 'Complete' },
          { name: 'Archived', color: 'brown', group: 'Complete' },
        ],
      },
    },
  },
  {
    key: 'priority',
    name: 'Priority',
    spec: { select: { options: [{ name: 'Critical', color: 'red' }, { name: 'High', color: 'orange' }, { name: 'Medium', color: 'yellow' }, { name: 'Low', color: 'gray' }] } },
  },
  { key: 'owner', name: 'Owner', spec: { people: {} } },
  { key: 'targetDate', name: 'Target Date', spec: { date: {} } },
  { key: 'desiredOutcome', name: 'Desired Outcome', spec: { rich_text: {}, description: 'The measurable result this project should produce.' } },
  { key: 'created', name: 'Created', spec: { created_time: {} } },
  { key: 'lastUpdated', name: 'Last Updated', spec: { last_edited_time: {} } },
]);

/** The properties the toolkit adds to the Projects database (notion-design.md 8.1). */
export const PROJECTS_REGISTRY_PROPERTIES = Object.freeze([
  { key: 'key', name: 'Key', spec: text('Short project slug used by the toolkit.') },
  { key: 'repository', name: 'Repository', spec: { url: {}, description: 'Git remote URL, when there is one.' } },
  { key: 'localPath', name: 'Local path', spec: text('The project folder on this computer.') },
  {
    key: 'tracker',
    name: 'Tracker',
    spec: { select: { options: [{ name: 'notion', color: 'blue' }, { name: 'local', color: 'gray' }, { name: 'github', color: 'purple' }, { name: 'jira', color: 'orange' }] } },
  },
  {
    key: 'memorySystem',
    name: 'Memory system',
    spec: { select: { options: [{ name: 'notion', color: 'blue' }, { name: 'builtin', color: 'gray' }, { name: 'hindsight', color: 'green' }] } },
  },
  { key: 'salesforce', name: 'Salesforce', spec: { checkbox: {} } },
  { key: 'workItemsDataSource', name: 'Work items data source', spec: text('The id of this project\'s Work Items data source.') },
  { key: 'memoryDataSource', name: 'Memory data source', spec: text('The id of this project\'s Memory data source.') },
  { key: 'setUpOn', name: 'Set up on', spec: { date: {}, description: 'The last successful toolkit notion ensure-project.' } },
]);

// ------------------------------------------------------------------ Work Items

export function workItemProperties({ prefix = 'WI' } = {}) {
  return [
    { key: 'title', name: 'Work item', spec: { title: {} } },
    { key: 'id', name: 'ID', spec: { unique_id: { prefix } } },
    {
      key: 'stage',
      name: 'Stage',
      spec: { select: { options: STAGES.map((s, k) => ({ name: s.id, color: STAGE_COLORS[k] || 'gray', description: s.label })) } },
    },
    {
      key: 'status',
      name: 'Status',
      spec: { status: { options: STATUSES.map((s) => ({ name: s, color: STATUS_COLORS[s], group: STATUS_GROUPS[s] })) } },
    },
    { key: 'type', name: 'Type', spec: { select: { options: TYPE_IDS.map((t) => ({ name: t })) } } },
    { key: 'priority', name: 'Priority', spec: { select: { options: PRIORITIES.map((p) => ({ name: p, color: PRIORITY_COLORS[p] })) } } },
    { key: 'waitingOn', name: 'Waiting on', spec: text('owner, agent, external: <who>, or none.') },
    { key: 'delivery', name: 'Delivery', spec: { select: { options: DELIVERY.map((d) => ({ name: d })) } } },
    { key: 'requirementsApproved', name: 'Requirements approved', spec: text('"YYYY-MM-DD by <name>", or no.') },
    { key: 'design', name: 'Design', spec: { select: { options: ITEM_DESIGN_VALUES.map((d) => ({ name: d })) } } },
    { key: 'designApproved', name: 'Design approved', spec: text('The Solution Design approval: "YYYY-MM-DD by <name>", or no.') },
    { key: 'resultApproved', name: 'Result approved', spec: text('"YYYY-MM-DD by <name>", or no.') },
    { key: 'nextAction', name: 'Next action', spec: text('The Overview "Next action" line.') },
    { key: 'openOwnerQuestions', name: 'Open owner questions', spec: { number: { format: 'number' }, description: 'Open questions that need the owner.' } },
    { key: 'updated', name: 'Updated', spec: { date: {}, description: 'The date the toolkit last changed this item.' } },
    { key: 'archived', name: 'Archived', spec: { checkbox: {}, description: 'Hidden from the board and the briefing.' } },
    { key: 'lastEdited', name: 'Last edited', spec: { last_edited_time: {} } },
  ];
}

/** Self-relations, added after the database exists: [key, name, pairKey, pairName]. */
export const WORK_ITEM_RELATIONS = Object.freeze([
  { key: 'parent', name: 'Parent item', pairKey: 'subItems', pairName: 'Sub-items' },
  { key: 'blockedBy', name: 'Blocked by', pairKey: 'blocking', pairName: 'Blocking' },
]);

// ------------------------------------------------------------------ Memory, older layout

/**
 * The older single Memory database on the project page (before the Lore
 * layout). New projects do not get it. ensure-project still reads it to move
 * its records into the Lore layout, and the memory driver still reads and
 * writes it for a project whose .toolkit.json has no `layout: "lore"` yet.
 */
export const MEMORY_PROPERTIES = Object.freeze([
  { key: 'title', name: 'Key', spec: { title: {} } },
  { key: 'type', name: 'Type', spec: { select: { options: [{ name: 'user', color: 'blue' }, { name: 'feedback', color: 'orange' }, { name: 'project', color: 'purple' }, { name: 'reference', color: 'gray' }, { name: 'event', color: 'green' }] } } },
  { key: 'name', name: 'Name', spec: text('Lower-case slug, unique in this project.') },
  { key: 'description', name: 'Description', spec: text('One plain line. Shown in the index.') },
  { key: 'status', name: 'Status', spec: { select: { options: [{ name: 'current', color: 'green' }, { name: 'needs-review', color: 'yellow' }, { name: 'retired', color: 'gray' }] } } },
  { key: 'supersededBy', name: 'Superseded by', spec: text('The key of the record that replaced this one.') },
  { key: 'source', name: 'Source', spec: text('Who or what said it, with a date.') },
  { key: 'saved', name: 'Saved', spec: { date: {} } },
  { key: 'lastVerified', name: 'Last verified', spec: text('YYYY-MM-DD, or unknown.') },
  { key: 'approvedBy', name: 'Approved by', spec: text() },
  { key: 'extra', name: 'Other fields', spec: text('Extra frontmatter fields as JSON. Kept by the toolkit.') },
  { key: 'lastEdited', name: 'Last edited', spec: { last_edited_time: {} } },
]);

// ------------------------------------------------------------------ Memory, Lore layout

/**
 * Each project's Notion memory is a "Memory" page under the project row that
 * holds Lore's five databases (lore-schema.mjs). A record is a row of the
 * Memories database:
 *   Title        the body's "# Title" line          (Lore)
 *   Keywords     the key, <type>_<slug>              (Lore)
 *   Synopsis     description                         (Lore)
 *   Kind         always "note"                       (Lore)
 *   Tags         the type: user, feedback, project, reference, or event (Lore)
 *   Status       current = accepted, needs-review = proposed,
 *                superseded = superseded, archived = deprecated (Lore)
 *   Supersedes   the records this one replaced      (Lore relation)
 *   Source       always "manual"; Author = the owner; Agent = Claude Code or Codex;
 *                Project = this project's row in the Memory page's Projects database (Lore)
 *   the columns below, which the toolkit adds; Lore keeps columns it does not know.
 * The page body is the record body, unchanged, without its "# Title" line.
 */
export const MEMORY_PAGE_TITLE = 'Memory';

/** The title the older Memory database gets once its records are in the Lore layout. */
export const OLD_MEMORY_DATABASE_TITLE = 'Old memory database (safe to delete)';

/** The Tags options for the five record types (added to Lore's own tags). */
export const RECORD_TYPE_TAGS = Object.freeze([
  { name: 'user', color: 'blue' },
  { name: 'feedback', color: 'orange' },
  { name: 'project', color: 'purple' },
  { name: 'reference', color: 'gray' },
  { name: 'event', color: 'green' },
]);

/** The columns the toolkit adds to Lore's Memories database. */
export const LORE_MEMORY_ADDED_PROPERTIES = Object.freeze([
  { key: 'recordKey', name: 'Record Key', spec: text('The toolkit key, <type>_<slug>. The toolkit finds a record by it.') },
  { key: 'supersededBy', name: 'Superseded by', spec: text('The key of the record that replaced this one.') },
  { key: 'sourceNote', name: 'Source note', spec: text('Who or what said it, with a date (the record\'s source).') },
  { key: 'saved', name: 'Saved', spec: { date: {} } },
  { key: 'lastVerified', name: 'Last verified', spec: text('YYYY-MM-DD, or unknown.') },
  { key: 'authorization', name: 'Authorization', spec: text('What allowed the save, for example "Approved by Mike on 2026-09-26".') },
  { key: 'extra', name: 'Other fields', spec: text('Extra frontmatter fields as JSON. Kept by the toolkit.') },
  { key: 'lastEdited', name: 'Last edited', spec: { last_edited_time: {} } },
]);

/** The Lore Memories columns the toolkit reads or writes (their ids are kept in .toolkit.json). */
export const LORE_MEMORY_USED = Object.freeze(['title', 'keywords', 'synopsis', 'kind', 'tags', 'status', 'source', 'author', 'agent', 'project', 'supersedes']);

/** The Lore Status for each stored status word. */
export const LORE_STATUS_FOR = Object.freeze({ current: 'accepted', 'needs-review': 'proposed', superseded: 'superseded', archived: 'deprecated' });

/** The stored status word for each Lore Status. Rows Lore's own tools made can also say informational or rejected. */
export const STATUS_FROM_LORE = Object.freeze({
  accepted: 'current', informational: 'current', proposed: 'needs-review', superseded: 'superseded', deprecated: 'archived', rejected: 'archived',
});

/**
 * Every Memories property the toolkit makes sure of: Lore's own (with the five
 * type tags added to Tags), then the toolkit's columns. ids: the data source ids
 * of the vault's projects and topics databases, and memories once it exists.
 */
export function loreMemoriesWanted(ids = {}) {
  const list = loreProperties('memories', ids).map((p) => {
    if (p.name !== 'Tags') return p;
    const have = new Set(p.spec.multi_select.options.map((o) => o.name));
    return { ...p, spec: { multi_select: { options: [...p.spec.multi_select.options, ...RECORD_TYPE_TAGS.filter((o) => !have.has(o.name))] } } };
  });
  return [...list, ...LORE_MEMORY_ADDED_PROPERTIES];
}

export const FOCUS_PAGE_TITLE = 'Current focus';
export const GLOSSARY_PAGE_TITLE = 'Terminology glossary';
export const WORK_ITEMS_TITLE = 'Work Items';
export const MEMORY_TITLE = 'Memory';
export const PROJECTS_TITLE = 'Projects';
export const DESIGN_PAGE_SUFFIX = ' — solution design';

/** The property type named in a spec ({ select: {...} } -> 'select'). */
export function specType(spec) {
  return Object.keys(spec).find((k) => k !== 'description' && k !== 'name');
}

/** The option names a select or status spec lists. */
export function specOptions(spec) {
  const t = specType(spec);
  return spec[t] && Array.isArray(spec[t].options) ? spec[t].options.map((o) => o.name) : [];
}
