# Codecov Setup Guide

This guide will help you set up Codecov for automatic coverage tracking and badge generation.

## Why Codecov?

- **No merge conflicts** - Coverage badges update automatically without committing to your repo
- **Real-time updates** - Badge reflects actual coverage from latest test run
- **Rich insights** - Detailed coverage reports, history, and trends
- **PR comments** - Automatic coverage reports on pull requests

## Setup Steps

### 1. Sign up for Codecov

1. Go to [codecov.io](https://codecov.io)
2. Click "Sign up with GitHub"
3. Authorize Codecov to access your repositories

### 2. Add Your Repository

1. After signing in, you'll see your repositories
2. Find `postman-sdk` and click to add it
3. It's **free for open source** projects!

### 3. Get Your Upload Token

1. In your repository on Codecov, go to **Settings**
2. Find the **Upload Token** (should be visible on the main settings page)
3. Copy the token (looks like: `abc123...`)

### 4. Add Token to GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `CODECOV_TOKEN`
5. Value: Paste the token you copied from Codecov
6. Click **Add secret**

### 5. Verify Setup

1. Trigger a workflow run (push a commit or use workflow dispatch)
2. Check the workflow runs successfully
3. Visit your Codecov dashboard to see the coverage report
4. The badge in your README will update automatically!

## What Was Configured

### GitHub Actions Workflow
- Added `codecov/codecov-action@v4` to upload coverage reports
- Configured to upload `lcov.info` coverage file
- Set to flag reports as "functional" tests

### Codecov Configuration (`codecov.yml`)
- Precision: 2 decimal places
- Range: 70-100% for color coding
- Auto-comments on pull requests with coverage changes
- Ignores test files, node_modules, and utility scripts

### README Badge
The static badges were replaced with:
```markdown
[![codecov](https://codecov.io/gh/bidnessforb/postman-sdk/branch/main/graph/badge.svg)](https://codecov.io/gh/bidnessforb/postman-sdk)
```

This badge:
- Updates automatically after each test run
- Links to detailed coverage reports
- Shows current coverage percentage
- Changes color based on coverage level

## Benefits

### Before Codecov
- Static badges in README
- Manual updates required
- Merge conflicts when updating badges
- No historical coverage data

### After Codecov
- ✅ Dynamic badges that auto-update
- ✅ No merge conflicts
- ✅ Coverage history and trends
- ✅ Detailed line-by-line coverage reports
- ✅ PR comments with coverage changes
- ✅ Coverage graphs and analytics

## Troubleshooting

**Badge shows "unknown":**
- Wait for first workflow run to complete
- Ensure `CODECOV_TOKEN` is set correctly in GitHub secrets
- Check workflow logs for upload errors

**Upload fails in workflow:**
- Verify the token is correct
- Check that `lcov.info` file exists in coverage folder
- Review workflow logs for specific error messages

**PR comments not appearing:**
- Comments are enabled in `codecov.yml`
- Ensure Codecov app has PR comment permissions
- May need to adjust repository settings on Codecov

## Next Steps

After setup is complete:
1. Push a commit to trigger the workflow
2. Check the Codecov dashboard for your coverage report
3. Watch the README badge update automatically
4. Review PR comments on your next pull request

## Resources

- [Codecov Documentation](https://docs.codecov.com)
- [GitHub Actions Integration](https://docs.codecov.com/docs/github-actions-integration)
- [Codecov YAML Reference](https://docs.codecov.com/docs/codecov-yaml)

