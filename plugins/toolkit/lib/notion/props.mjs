// Reading and writing Notion page property values.
//
// Pages list their properties by name, and each value carries the property id.
// The toolkit finds a value by id (from .toolkit.json), so a column Mike
// renamed is still found. Writes use the property id as the key.

import { samePropertyId } from './ensure.mjs';

/** Plain text of a rich text array. */
export function plainText(rich) {
  return Array.isArray(rich) ? rich.map((r) => r.plain_text ?? (r.text && r.text.content) ?? '').join('') : '';
}

/** A rich text array for a string, split into pieces of at most 2,000 characters. */
export function richText(value) {
  const s = value === undefined || value === null ? '' : String(value);
  const out = [];
  for (let i = 0; i < s.length; i += 2000) out.push({ type: 'text', text: { content: s.slice(i, i + 2000) } });
  return out;
}

/** The property value object of a page for a property id, or null. */
export function findValue(page, propertyId) {
  if (!page || !page.properties || !propertyId) return null;
  for (const v of Object.values(page.properties)) {
    if (samePropertyId(v.id, propertyId)) return v;
  }
  return null;
}

/** A page property as plain JavaScript: string, number, boolean, string[] (relation ids), or null. */
export function readValue(page, propertyId) {
  const v = findValue(page, propertyId);
  if (!v) return null;
  switch (v.type) {
    case 'title':
      return plainText(v.title);
    case 'rich_text':
      return plainText(v.rich_text);
    case 'select':
      return v.select ? v.select.name : null;
    case 'status':
      return v.status ? v.status.name : null;
    case 'multi_select':
      return (v.multi_select || []).map((o) => o.name);
    case 'number':
      return v.number;
    case 'checkbox':
      return Boolean(v.checkbox);
    case 'date':
      return v.date ? v.date.start : null;
    case 'url':
      return v.url;
    case 'relation':
      return (v.relation || []).map((r) => r.id);
    case 'unique_id':
      return v.unique_id ? v.unique_id.number : null;
    case 'last_edited_time':
      return v.last_edited_time;
    case 'created_time':
      return v.created_time;
    default:
      return null;
  }
}

/** The property value to send for a type and a plain value. */
export function writeValue(type, value) {
  switch (type) {
    case 'title':
      return { title: richText(value) };
    case 'rich_text':
      return { rich_text: richText(value) };
    case 'select':
      return { select: value ? { name: String(value) } : null };
    case 'status':
      return { status: value ? { name: String(value) } : null };
    case 'number':
      return { number: value === null || value === undefined || value === '' ? null : Number(value) };
    case 'checkbox':
      return { checkbox: Boolean(value) };
    case 'date':
      return { date: value ? { start: String(value) } : null };
    case 'url':
      return { url: value || null };
    case 'relation':
      return { relation: (value || []).map((id) => ({ id })) };
    default:
      throw new Error(`The toolkit cannot write a ${type} property.`);
  }
}
