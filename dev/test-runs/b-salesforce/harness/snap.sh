#!/bin/bash
# Usage: snap.sh <label>: copy the tracker, memory, and Salesforce files after a session.
S=/private/tmp/claude-501/-Users-michaelrihm-Documents-Projects-claude-toolkit/a06506e8-ae0d-406f-b493-aee9388c7499/scratchpad/runs
P=$S/b-salesforce-r3; T=$S/b-salesforce-r3-tools
D=$T/snap/$1; mkdir -p $D
cd $P
rsync -a .work-items/ $D/work-items/
rsync -a .memory/ $D/memory/
[ -d force-app ] && rsync -a force-app/ $D/force-app/
rsync -a delivery/deployment/ $D/deployment/
{ echo "## git status"; git status --short; echo "## git log"; git log --oneline --all -15; echo "## worktrees"; git worktree list; echo "## branches"; git branch -a; echo "## tree"; find .work-items .memory force-app delivery/deployment .claude/worktrees -maxdepth 6 -not -path '*/.git*' 2>/dev/null | sort; } > $D/state.txt
toolkit work list --tree --all > $D/work-list-tree.txt 2>&1
echo "snap $D"
