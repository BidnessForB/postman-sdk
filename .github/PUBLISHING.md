# Publishing Guide

**Current Version**: 0.2.2 (Alpha)

This guide explains how to publish new versions of the Postman SDK to GitHub Packages.

## Alpha Development (0.x.x)

The SDK is currently in alpha development (version 0.x.x). During this phase:

- **0.0.x** - Extremely unstable, initial development
- **0.x.0** - May include breaking changes (API not stable yet)
- **0.x.y** - Bug fixes and minor improvements

Breaking changes are acceptable in minor versions (0.x.0) until we reach 1.0.0. Once we release 1.0.0, we'll follow strict semantic versioning where breaking changes only occur in major versions.

**Path to 1.0.0:**
- Complete core endpoint implementations
- Stabilize the API surface
- Comprehensive test coverage
- Production-ready documentation

## Prerequisites

- Commit all changes and ensure your working directory is clean
- All tests pass (`npm run test:unit`)
- You're on the `main` branch
- You have push access to the repository

## Publishing Process

### Option 1: Automated via GitHub Release (Recommended)

This is the easiest and most reliable method.

1. **Update version and tag:**
   ```bash
   # For patch release (0.2.0 → 0.2.1) - bug fixes
   npm version patch -m "Release v%s: Bug fixes and improvements"
   
   # For minor release (0.2.0 → 0.3.0) - new features/breaking changes (OK during alpha)
   npm version minor -m "Release v%s: New features"
   
   # For major release (0.x.x → 1.0.0) - stable API release
   npm version major -m "Release v%s: Stable API release"
   ```

2. **Push the tag:**
   ```bash
   git push && git push --tags
   ```

3. **Create a GitHub Release:**
   - Go to https://github.com/bidnessforb/postman-sdk/releases
   - Click **Draft a new release**
   - Select the tag you just pushed (e.g., `v1.0.1`)
   - Fill in the release title (e.g., `v1.0.1`)
   - Add release notes describing changes
   - Click **Publish release**

4. **Automatic publication:**
   - The `publish.yml` workflow triggers automatically
   - Package is built, tested, and published to GitHub Packages
   - Check the Actions tab to monitor progress

### Option 2: Manual Workflow Dispatch

If you want to publish without creating a release:

1. Go to **Actions** → **Publish to GitHub Packages**
2. Click **Run workflow**
3. Select the branch
4. Click **Run workflow**

### Option 3: Manual Local Publishing (Not Recommended)

Only use this if the automated workflow fails:

```bash
# Make sure you're authenticated
npm login --registry=https://npm.pkg.github.com --scope=@bidnessforb

# Publish
npm publish
```

## Version Numbering

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (x.0.0): Breaking changes - incompatible API changes
- **MINOR** (0.x.0): New features - backwards-compatible functionality
- **PATCH** (0.0.x): Bug fixes - backwards-compatible fixes

### Examples

```bash
# Bug fix: Fixed error handling in getWorkspace
npm version patch

# New feature: Added support for API specifications
npm version minor

# Breaking change: Renamed all function parameters
npm version major
```

## Pre-release Versions

For beta/alpha releases:

```bash
# Create a pre-release (1.0.0 → 1.0.1-0)
npm version prepatch --preid=beta
npm version preminor --preid=beta
npm version premajor --preid=beta

# Increment pre-release (1.0.1-0 → 1.0.1-1)
npm version prerelease
```

## What Gets Published

The published package includes:

### ✅ Included
- All source code in `src/` (excluding tests)
- Workspace utility scripts:
  - `util/get-test-workspaces.js` - Find workspaces by pattern
  - `util/delete-test-workspaces.js` - Delete by pattern or ID (`--workspaceId`)
- Example scripts in `examples/`
- `README.md`
- `LICENSE`
- `package.json`

### ❌ Excluded
- Test files (`**/__tests__/**`, `*.test.js`)
- Development scripts (`scripts/`)
- Shell scripts (`util/*.sh`)
- Configuration files (`.github/`, `jest.config.js`, `codecov.yml`)
- Documentation (`docs/`)
- Test fixtures (`fixtures/`)
- API spec files

To preview what will be published:

```bash
npm pack --dry-run
```

## Verification

After publishing, verify the package:

1. **Check GitHub Packages:**
   - Go to https://github.com/bidnessforb/postman-sdk/packages
   - Verify the new version appears

2. **Test installation:**
   ```bash
   # In a different directory
   mkdir test-install && cd test-install
   npm init -y
   
   # Configure registry
   echo "@bidnessforb:registry=https://npm.pkg.github.com" > .npmrc
   echo "//npm.pkg.github.com/:_authToken=YOUR_TOKEN" >> .npmrc
   
   # Install
   npm install @bidnessforb/postman-sdk
   
   # Test
   node -e "const sdk = require('@bidnessforb/postman-sdk'); console.log(sdk);"
   ```

3. **Verify contents:**
   ```bash
   # List published files
   npm pack --dry-run
   
   # Or inspect the installed package
   ls -la node_modules/@bidnessforb/postman-sdk/
   ```

## Troubleshooting

**Error: "npm ERR! 404 Not Found"**
- Ensure you're authenticated with GitHub Packages
- Check that `publishConfig` in package.json points to `https://npm.pkg.github.com`

**Error: "npm ERR! 403 Forbidden"**
- Verify you have `write:packages` permission
- Check that you're using the correct authentication token

**Tests fail during prepublishOnly:**
- Fix the failing tests before publishing
- Run `npm run test:unit` locally to debug

**Package is too large:**
- Check what's being included: `npm pack --dry-run`
- Update `.npmignore` to exclude unnecessary files
- Review the `files` array in `package.json`

## Rollback

If you need to unpublish or rollback:

```bash
# Unpublish a specific version (within 72 hours)
npm unpublish @bidnessforb/postman-sdk@1.0.1 --registry=https://npm.pkg.github.com

# Note: GitHub Packages doesn't allow unpublishing after 72 hours
# In that case, publish a new version with fixes
```

## Release Checklist

Before publishing:

- [ ] All changes committed and pushed
- [ ] Tests passing (`npm run test:unit`)
- [ ] Version number updated
- [ ] CHANGELOG updated (if you maintain one)
- [ ] Breaking changes documented
- [ ] Tag created and pushed
- [ ] Release notes prepared

After publishing:

- [ ] Package visible on GitHub Packages
- [ ] Installation tested
- [ ] Badge/version number updated (if applicable)
- [ ] Users notified (if breaking changes)

## Support

For issues with publishing:
- Check GitHub Actions logs
- Review `.npmignore` and `files` in package.json
- Test locally with `npm pack`
- Check GitHub Packages documentation: https://docs.github.com/en/packages

