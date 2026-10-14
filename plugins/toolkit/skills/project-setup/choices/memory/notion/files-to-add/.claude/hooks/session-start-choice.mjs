import { execFileSync } from 'node:child_process';

export default function ({ cwd }) {
  const pageId = '{{CURRENT_STATE_PAGE_ID}}';
  const readMore = 'the configured Notion Current state page, with managing-project-memory';
  try {
    if (!/^[a-f0-9-]{32,36}$/i.test(pageId)) throw new Error('Current state page ID is not configured');
    const page = JSON.parse(execFileSync('ntn', ['api', `v1/pages/${pageId}/markdown`],
      { cwd, encoding: 'utf8', stdio: 'pipe', input: '', timeout: 15000 }));
    const state = String(page.markdown || '').trim();
    if (!state) throw new Error('Current state page is empty');
    return { text: 'Use managing-project-memory to read relevant wiki records and pending Wiki Inbox captures.'
      + ' Verify current work in the tracker; the librarian reconciles Current state.\n'
      + "The project's Current State:\n" + state, readMore };
  } catch {
    return { text: 'The Notion Current state page could not be read here.'
      + ' Read it with the managing-project-memory skill.', readMore };
  }
}
