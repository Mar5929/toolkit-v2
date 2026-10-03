// The shell script that reads the chat files Claude Code saves. It only reads.
// It is in its own file so dev/tests/workstreams-scan.test.mjs can run it.

// The line that separates the script's two lists.
export const WRITES = '==writes=='

// $1 is the project's folder name under "projects". $2 is the page ids of the
// open work items, as a pattern: "id|id|id".
//
// First it prints each chat's name records. After the WRITES line it prints
// one line per change a chat's agent, or one of its helper agents, made to a
// work item's own Notion page: path, time, page id. A page id that is only
// named inside the change (a link to another item) is not counted.
export const SCAN = String.raw`
PATH="/usr/bin:/bin:$PATH"
export PATH LC_ALL=C
dir="$CLAUDE_CONFIG_DIR"
[ -n "$dir" ] || dir="$HOME/.claude"
cd "$dir/projects" 2>/dev/null || { echo '${WRITES}'; exit 0; }
find "./$1" ./"$1"--claude-worktrees-* -maxdepth 1 -name '*.jsonl' \
  -exec grep -H '"type":"custom-title"' {} + 2>/dev/null
echo '${WRITES}'
find "./$1" ./"$1"--claude-worktrees-* -name '*.jsonl' \
  -exec grep -H -F PATCH {} + 2>/dev/null |
  grep -F '"type":"assistant"' | grep -E "$2" |
  awk -v target="(pages|blocks)/($2)" '{
    p = index($0, ".jsonl:"); if (!p) next
    ts = ""
    if (match($0, /"timestamp":"[^"]*"/)) ts = substr($0, RSTART + 13, RLENGTH - 14)
    path = substr($0, 1, p + 5); s = $0
    while (match(s, target)) {
      id = substr(s, RSTART, RLENGTH); sub(/^[a-z]*\//, "", id)
      print path "\t" ts "\t" id
      s = substr(s, RSTART + RLENGTH)
    }
  }'
exit 0
`
