#!/bin/bash

# Script to interactively delete local git branches
# Excludes 'main', 'dev', and the current branch

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

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)

printf "Current branch: ${GREEN}%s${NC}\n" "${CURRENT_BRANCH}"
echo ""

# Get all local branches except main, dev, and current branch
# Use --format to avoid asterisk prefix, then filter
BRANCHES=$(git branch --format='%(refname:short)' | grep -v -E "^(${CURRENT_BRANCH}|main|dev)$" | grep -v '^$')

if [ -z "$BRANCHES" ]; then
  echo "No branches to clean up (excluding main, dev, and current branch)."
  exit 0
fi

# Count branches
BRANCH_COUNT=$(echo "$BRANCHES" | wc -l | tr -d ' ')
printf "Found ${YELLOW}%s${NC} branch(es) to review:\n" "${BRANCH_COUNT}"
echo ""

DELETED_COUNT=0
SKIPPED_COUNT=0

# Process each branch
while IFS= read -r branch; do
  if [ -z "$branch" ]; then
    continue
  fi
  
  # Get last commit date for this branch
  LAST_COMMIT_DATE=$(git log -1 --format=%cd --date=format:'%Y-%m-%d %H:%M:%S' "$branch" 2>/dev/null || echo "unknown")
  
  # Check if branch has been merged
  if git branch --merged | grep -q "^  ${branch}$"; then
    MERGED_STATUS="${GREEN}[merged]${NC}"
  else
    MERGED_STATUS="${RED}[not merged]${NC}"
  fi
  
  # Get tracking branch information
  TRACKING_BRANCH=$(git rev-parse --abbrev-ref --symbolic-full-name "${branch}@{u}" 2>/dev/null || echo "")
  
  printf "Branch: ${YELLOW}%s${NC} %b\n" "${branch}" "${MERGED_STATUS}"
  printf "  Last commit: %s\n" "${LAST_COMMIT_DATE}"
  if [ -n "$TRACKING_BRANCH" ]; then
    printf "  Tracking: %s\n" "${TRACKING_BRANCH}"
  fi
  read -p "Delete this branch? (y/N): " -n 1 -r </dev/tty
  echo ""
  
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    if git branch -D "$branch" 2>/dev/null; then
      echo "${GREEN}✅ Deleted: ${branch}${NC}"
      DELETED_COUNT=$((DELETED_COUNT + 1))
    else
      echo "${RED}❌ Failed to delete: ${branch}${NC}"
    fi
  else
    echo "Skipped: ${branch}"
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
  fi
  echo ""
done <<< "$BRANCHES"

# Summary
echo "=== Summary ==="
printf "Deleted: ${GREEN}%s${NC}\n" "${DELETED_COUNT}"
printf "Skipped: ${YELLOW}%s${NC}\n" "${SKIPPED_COUNT}"
echo ""

