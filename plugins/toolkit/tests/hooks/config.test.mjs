// The two plugin hook files (ARCHITECTURE sections 2 and 6; critique P1, P5,
// P6, P9, P19): Claude Code exec form through ${CLAUDE_PLUGIN_ROOT}; Codex
// shell strings through "$PLUGIN_ROOT", regex matchers, no $schema, explicit
// timeouts, and additionalContextLimit 4000 on the briefing. Also checks that
// the Codex fixtures carry exactly the fields of the Codex input schemas.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { PLUGIN_ROOT } from '../project/helpers.mjs';
import { rawFixture } from './fixtures.mjs';

const claude = JSON.parse(fs.readFileSync(path.join(PLUGIN_ROOT, 'hooks', 'hooks.json'), 'utf8'));
const codex = JSON.parse(fs.readFileSync(path.join(PLUGIN_ROOT, 'hooks', 'codex-hooks.json'), 'utf8'));
const EVENTS = { SessionStart: 'session-start', UserPromptSubmit: 'user-prompt', PreToolUse: 'pre-tool', PostToolUse: 'post-tool', Stop: 'stop' };

test('Claude Code hooks: exec form, the plugin root variable, the section 6 matchers, and a timeout on every handler', () => {
  assert.deepEqual(Object.keys(claude).sort(), ['description', 'hooks']);
  assert.deepEqual(Object.keys(claude.hooks).sort(), Object.keys(EVENTS).sort());
  const matchers = { SessionStart: 'startup|resume|clear|compact|fork', PreToolUse: 'Write|Edit|MultiEdit|Bash', PostToolUse: 'Write|Edit|MultiEdit|Bash' };
  for (const [event, groups] of Object.entries(claude.hooks)) {
    assert.equal(groups.length, 1);
    assert.equal(groups[0].matcher, matchers[event]);
    for (const h of groups[0].hooks) {
      assert.equal(h.type, 'command');
      assert.equal(h.command, 'node');
      assert.deepEqual(h.args, ['${CLAUDE_PLUGIN_ROOT}/bin/toolkit', 'hook', EVENTS[event], '--host', 'claude']);
      assert.ok(Number.isInteger(h.timeout) && h.timeout > 0 && h.timeout <= 30, `${event} timeout`);
    }
  }
});

test('Codex hooks: shell strings, "$PLUGIN_ROOT", anchored regex matchers, no args or $schema, timeouts, and the context limit', () => {
  assert.deepEqual(Object.keys(codex).sort(), ['description', 'hooks'], 'Codex allows only description and hooks at the top');
  const matchers = { SessionStart: '^(startup|resume|clear|compact)$', PreToolUse: '^apply_patch$|^Bash$', PostToolUse: '^apply_patch$|^Bash$' };
  for (const [event, groups] of Object.entries(codex.hooks)) {
    assert.equal(groups.length, 1);
    assert.equal(groups[0].matcher, matchers[event], event);
    for (const h of groups[0].hooks) {
      assert.equal(h.type, 'command');
      assert.equal(h.args, undefined, 'Codex has no args field');
      assert.equal(h.command, `node "$PLUGIN_ROOT/bin/toolkit" hook ${EVENTS[event]} --host codex`);
      assert.ok(Number.isInteger(h.timeout) && h.timeout > 0 && h.timeout <= 30, `${event} timeout`);
      for (const k of Object.keys(h)) assert.ok(['type', 'command', 'timeout', 'statusMessage', 'additionalContextLimit'].includes(k), `${event}: ${k} is a Codex handler field`);
    }
  }
  assert.equal(codex.hooks.SessionStart[0].hooks[0].additionalContextLimit, 4000);
  assert.equal(codex.hooks.Stop[0].hooks[0].additionalContextLimit, undefined, 'Stop cannot give additional context');
  assert.ok(new RegExp(matchers.PreToolUse).test('apply_patch') && new RegExp(matchers.PreToolUse).test('Bash'));
  assert.ok(!new RegExp(matchers.PreToolUse).test('BashOutput'));
  for (const s of ['startup', 'resume', 'clear', 'compact']) assert.ok(new RegExp(matchers.SessionStart).test(s));
});

test('the Codex fixtures carry exactly the required fields of the Codex input schemas', () => {
  const required = {
    'session-start.startup': ['cwd', 'hook_event_name', 'model', 'permission_mode', 'session_id', 'source', 'transcript_path'],
    'user-prompt': ['cwd', 'hook_event_name', 'model', 'permission_mode', 'prompt', 'session_id', 'transcript_path', 'turn_id'],
    'pre-tool.apply-patch': ['cwd', 'hook_event_name', 'model', 'permission_mode', 'session_id', 'tool_input', 'tool_name', 'tool_use_id', 'transcript_path', 'turn_id'],
    'pre-tool.bash': ['cwd', 'hook_event_name', 'model', 'permission_mode', 'session_id', 'tool_input', 'tool_name', 'tool_use_id', 'transcript_path', 'turn_id'],
    'post-tool.apply-patch': ['cwd', 'hook_event_name', 'model', 'permission_mode', 'session_id', 'tool_input', 'tool_name', 'tool_response', 'tool_use_id', 'transcript_path', 'turn_id'],
    'post-tool.bash': ['cwd', 'hook_event_name', 'model', 'permission_mode', 'session_id', 'tool_input', 'tool_name', 'tool_response', 'tool_use_id', 'transcript_path', 'turn_id'],
    stop: ['cwd', 'hook_event_name', 'last_assistant_message', 'model', 'permission_mode', 'session_id', 'stop_hook_active', 'transcript_path', 'turn_id'],
  };
  for (const [name, fields] of Object.entries(required)) assert.deepEqual(Object.keys(rawFixture('codex', name)).sort(), fields, name);
});
