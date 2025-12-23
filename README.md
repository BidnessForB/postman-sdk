# Postman SDK

![Version](https://img.shields.io/badge/version-0.2.0-blue)
![PR Tests](https://github.com/bidnessforb/postman-sdk/actions/workflows/pr-tests.yml/badge.svg)
[![codecov](https://codecov.io/gh/bidnessforb/postman-sdk/branch/main/graph/badge.svg?token=XBROJOTUS4)](https://codecov.io/gh/bidnessforb/postman-sdk)
![Modules](https://img.shields.io/badge/modules-5-blue)
![Endpoints](https://img.shields.io/badge/endpoints-35%2F191%20(18.3%25)-yellow)
![License](https://img.shields.io/badge/license-ISC-blue)
![Status](https://img.shields.io/badge/status-alpha-orange)

A barebones SDK for the Postman API, built following minimal patterns for easy extension and evolution. Based on published [Postman API spec](https://www.postman.com/postman/postman-public-workspace/specification/3001f4e4-5f9d-4bac-9f57-b2c4d483508f/file/1f4ad1bf-697f-4be6-a167-dc1f3cf2abf2?ctx=preview).

> ⚠️ **Alpha Release**: This SDK is under active development. The API may change between minor versions until 1.0.0 is released.
  
📋 **[View API Endpoint Implementation Status](docs/API-ENDPOINTS-TODO.md)** - Track which endpoints are implemented (35/191, 18.3%)

## Installation
   
### From GitHub Packages

First, configure npm to use GitHub Packages for the `@bidnessforb` scope. Create or edit `~/.npmrc`:

```bash
@bidnessforb:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

**Generate a GitHub Personal Access Token:**
1. Go to GitHub **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **Generate new token (classic)**
3. Give it a name and select the `read:packages` scope
4. Copy the token and replace `YOUR_GITHUB_TOKEN` in your `~/.npmrc`

Then install the package:

```bash
npm install @bidnessforb/postman-sdk
```

### For Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/bidnessforb/postman-sdk.git
cd postman-sdk
npm install
```

## Configuration

Set your Postman API key as an environment variable:

```bash
export POSTMAN_API_KEY=your_api_key_here
```

Or set it programmatically before using the SDK:

```javascript
process.env.POSTMAN_API_KEY = 'your_api_key_here';
```

## Usage

### Basic Example

```javascript
const { collections, workspaces, specs } = require('@bidnessforb/postman-sdk');

// Make sure your API key is set
process.env.POSTMAN_API_KEY = 'your_api_key_here';

async function example() {
  // Get all workspaces
  const workspacesResponse = await workspaces.getWorkspaces();
  console.log('Workspaces:', workspacesResponse.data);

  // Get all collections
  const collectionsResponse = await collections.getCollections();
  console.log('Collections:', collectionsResponse.data);

  // Get all specs
  const specsResponse = await specs.getSpecs();
  console.log('Specs:', specsResponse.data);
}

example().catch(console.error);
```

### Included Utilities

The SDK includes utility scripts for managing test workspaces:

**Find workspaces by pattern:**
```javascript
const getWorkspaces = require('@bidnessforb/postman-sdk/util/get-test-workspaces');
// Run: node node_modules/@bidnessforb/postman-sdk/util/get-test-workspaces.js "*Test*"
```

**Delete workspaces by pattern:**
```javascript
const deleteWorkspaces = require('@bidnessforb/postman-sdk/util/delete-test-workspaces');
// Run: node node_modules/@bidnessforb/postman-sdk/util/delete-test-workspaces.js "*Test*"
```

These utilities are helpful for cleaning up test resources created during development.

### Examples

The SDK includes complete example scripts demonstrating common workflows:

**Create and Populate Workspace:**
```bash
# Run the example
node node_modules/@bidnessforb/postman-sdk/examples/create-populate-workspace.js
```

This example demonstrates:
- Creating a workspace
- Creating a collection in the workspace
- Creating an API spec in the workspace
- Error handling and response parsing

You can copy and modify these examples for your own use cases.

## Project Structure

```
postman-sdk/
├── src/
│   ├── index.js                 # Main entry point, exports all modules
│   ├── core/
│   │   ├── config.js            # Configuration (baseUrl, apiKey from env)
│   │   ├── request.js           # buildAxiosConfig and executeRequest helpers
│   │   └── utils.js             # Shared utilities (query param building, etc.)
│   ├── collections/
│   │   └── index.js             # Collection endpoints
│   ├── workspaces/
│   │   └── index.js             # Workspace endpoints
│   └── specs/
│       └── index.js             # Spec endpoints
├── package.json
├── README.md

```

## Module Organization

The SDK is organized by resource groups:

- **collections**: Endpoints for managing Postman Collections, folders, and comments
- **workspaces**: Endpoints for managing Postman Workspaces
- **specs**: Endpoints for managing Postman API Specifications
- **users**: Endpoints for user information and authentication


## Testing

### Unit Tests

Run unit tests only (mocked, fast):

```bash
npm run test:unit
```

### Functional Tests

Run the complete functional test suite (executes all functional tests in proper dependency order):

```bash
npm run test:all-up
```

This orchestrates all functional tests in sequence:
1. Workspaces (create/test workspace)
2. Collections (create/test collection in workspace)
3. Collection Comments (create/test comments on collection)
4. Folders (create/test folder in collection)
5. Folder Comments (create/test comments on folder)
6. Specs (create/test API specs in workspace)

**Note**: Functional tests make real API calls and create actual resources. Test IDs are persisted to `test-ids.json` for reuse across test runs. Resources are NOT automatically deleted after the test.

Generate functional test coverage report:

```bash
npm run test:coverage
```

### All Tests

Run all tests (unit + functional):

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

### Manual API Tests

Test the getSpecs endpoint (list all specs in a workspace):

```bash
npm run test:getSpecs [workspaceId] [cursor] [limit]
# or
node scripts/test-getSpecs.js list [workspaceId] [cursor] [limit]
```

Test the getSpec endpoint (get a specific spec):

```bash
node scripts/test-getSpecs.js get <specId>
```

Test the createSpec endpoint:

```bash
npm run test:createSpec [workspaceId] [specType]
# Spec types: openapi-3.0, openapi-3.1, asyncapi-2.0, multi-file
```

## Development

This SDK is built incrementally, starting with a small subset of endpoints to establish patterns before expanding to cover the full Postman API.

## CI/CD

### GitHub Actions

The repository includes automated testing via GitHub Actions that runs on:
- All pull requests to `main`
- Manual trigger via GitHub Actions UI (workflow dispatch)

**Workflow Jobs:**
1. **Unit Tests** - Fast, mocked tests for quick feedback
2. **Functional Tests & Coverage** - All-up functional test suite with real API calls and comprehensive coverage analysis

**Setup Required:**
- Add `POSTMAN_API_KEY` secret in GitHub repository settings
- Add `CODECOV_TOKEN` for automatic coverage badge updates (optional)
- See [.github/workflows/README.md](.github/workflows/README.md) for detailed setup instructions

**Coverage Tracking:**
- Coverage reports are automatically uploaded to [Codecov](https://codecov.io)
- The coverage badge updates automatically after each test run
- No manual README updates needed - eliminates merge conflicts

**Local Testing:**
Run the same tests locally before pushing:
```bash
npm run test:unit           # Unit tests
npm run test:all-up         # Functional tests
npm run test:coverage       # Coverage report
```

