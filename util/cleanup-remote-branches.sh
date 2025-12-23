#!/bin/bash

# Script to interactively delete remote git branches from origin
# Excludes 'main', 'dev', and the current branch's remote tracking branch
# Fetches from origin before listing branches

set -e

# Check if running interactively (stdin is a terminal)
if [ ! -t 0 ]; then
  echo "Error: This script requires an interactive terminal."
  echo "Please run it directly without redirecting output."
  exit 1
fi

# Colors for output (only if stdout is a terminal)
if [ -t 1 ]; then
  RED='\033[0;31m'
  GREEN='\033[0;32m'
  YELLOW='\033[1;33m'
  NC='\033[0m' # No Color
else
  RED=''
  GREEN=''
  YELLOW=''
  NC=''
fi

# Get current branch and its remote tracking branch
CURRENT_BRANCH=$(git branch --show-current)
CURRENT_TRACKING=$(git rev-parse --abbrev-ref --symbolic-full-name "${CURRENT_BRANCH}@{u}" 2>/dev/null || echo "")

printf "Current branch: ${GREEN}%s${NC}\n" "${CURRENT_BRANCH}"
if [ -n "$CURRENT_TRACKING" ]; then
  printf "Current tracking: ${GREEN}%s${NC}\n" "${CURRENT_TRACKING}"
fi
echo ""

# Fetch from origin to get latest remote branch information
echo "Fetching branches from origin..."
git fetch origin
echo ""

# Get all remote branches from origin, excluding main and dev
# Format: origin/branch-name, then strip 'origin/' prefix
REMOTE_BRANCHES=$(git branch -r --format='%(refname:short)' | grep '^origin/' | sed 's|^origin/||' | grep -v -E '^(main|dev|HEAD)$' | grep -v '^$')

# Also exclude the current branch's remote tracking branch if it exists
if [ -n "$CURRENT_TRACKING" ]; then
  CURRENT_REMOTE_BRANCH=$(echo "$CURRENT_TRACKING" | sed 's|^origin/||')
  REMOTE_BRANCHES=$(echo "$REMOTE_BRANCHES" | grep -v "^${CURRENT_REMOTE_BRANCH}$")
fi

if [ -z "$REMOTE_BRANCHES" ]; then
  echo "No remote branches to clean up (excluding main, dev, and current tracking branch)."
  exit 0
fi

# Count branches
BRANCH_COUNT=$(echo "$REMOTE_BRANCHES" | wc -l | tr -d ' ')
printf "Found ${YELLOW}%s${NC} remote branch(es) to review:\n" "${BRANCH_COUNT}"
echo ""

DELETED_COUNT=0
SKIPPED_COUNT=0

# Process each remote branch
while IFS= read -r branch; do
  if [ -z "$branch" ]; then
    continue
  fi
  
  REMOTE_BRANCH="origin/${branch}"
  
  # Get last commit date for this remote branch
  LAST_COMMIT_DATE=$(git log -1 --format=%cd --date=format:'%Y-%m-%d %H:%M:%S' "$REMOTE_BRANCH" 2>/dev/null || echo "unknown")
  
  # Check if branch has been merged into main
  # Check both main and master as default branches
  MERGED_INTO_MAIN=false
  if git branch -r --merged origin/main 2>/dev/null | grep -q "origin/${branch}$"; then
    MERGED_INTO_MAIN=true
  elif git branch -r --merged origin/master 2>/dev/null | grep -q "origin/${branch}$"; then
    MERGED_INTO_MAIN=true
  fi
  
  if [ "$MERGED_INTO_MAIN" = true ]; then
    MERGED_STATUS="${GREEN}[merged into main]${NC}"
  else
    MERGED_STATUS="${RED}[not merged into main]${NC}"
  fi
  
  # Check if local branch exists
  LOCAL_EXISTS=""
  if git show-ref --verify --quiet "refs/heads/${branch}"; then
    LOCAL_EXISTS="${YELLOW}[local branch exists]${NC}"
  fi
  
  printf "Branch: ${YELLOW}%s${NC} %b\n" "${REMOTE_BRANCH}" "${MERGED_STATUS}"
  printf "  Last commit: %s\n" "${LAST_COMMIT_DATE}"
  if [ -n "$LOCAL_EXISTS" ]; then
    printf "  %b\n" "${LOCAL_EXISTS}"
  fi
  read -p "Delete this remote branch? (y/N): " -n 1 -r </dev/tty
  echo ""
  
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    if git push origin --delete "$branch" 2>/dev/null; then
      printf "${GREEN}✅ Deleted: %s${NC}\n" "${REMOTE_BRANCH}"
      DELETED_COUNT=$((DELETED_COUNT + 1))
    else
      printf "${RED}❌ Failed to delete: %s${NC}\n" "${REMOTE_BRANCH}"
    fi
  else
    echo "Skipped: ${REMOTE_BRANCH}"
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
  fi
  echo ""
done <<< "$REMOTE_BRANCHES"

# Summary
echo "=== Summary ==="
printf "Deleted: ${GREEN}%s${NC}\n" "${DELETED_COUNT}"
printf "Skipped: ${YELLOW}%s${NC}\n" "${SKIPPED_COUNT}"
echo ""

