#!/bin/bash
# Builds the base project that every live eval starts from, without a person.
# It does the five steps of ../keeping-project-records/README.md, "Building the base project":
# a real setup by the project-setup skill of this checkout, then the fixture copied over it.
#
# usage: build-base-project.sh <new folder outside this repository>
#
# The session signs in through the fixed test home, never through the owner's own ~/.claude.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
repo="$(cd "$here/../../.." && pwd)"
base="$1"
case "$(cd "$(dirname "$base")" && pwd)/" in "$repo"/*) echo "The folder must be outside this repository." >&2; exit 1;; esac
[ -e "$base" ] && { echo "$base exists already." >&2; exit 1; }
mkdir -p "$base" && cd "$base" && git init -q

export CLAUDE_CONFIG_DIR="$HOME/.toolkit-v2-test-homes/claude"
claude -p "$(cat "$here/base-project-setup-message.txt")" --plugin-dir "$repo/plugins/toolkit" \
  --output-format stream-json --verbose --permission-mode acceptEdits \
  --allowedTools "Bash Read Write Edit Glob Grep Skill Agent ToolSearch" > ../"$(basename "$base")"-setup.jsonl

fixture="$repo/dev/evals/fixtures/pocket-ledger-records"
cp -R "$fixture/project/." .
cp "$fixture/owner-preferences.md" .claude/rules/owner-preferences.md
found="$(echo '{}' | node .claude/hooks/validate-records.mjs --all || true)"
[ -z "$found" ] || { echo "The record check found: $found" >&2; exit 1; }
git config user.name "Eval run" && git config user.email "eval@example.com"
git add -A
git commit -qm "Base project: the starter and the fixture"
echo "Base project built in $base at $(git rev-parse --short HEAD). The setup session's stream is beside it."
