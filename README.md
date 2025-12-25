# Postman SDK

![Version](https://img.shields.io/badge/version-0.2.2-blue)
![All Tests](https://github.com/bidnessforb/postman-sdk/actions/workflows/all-tests.yml/badge.svg)
![Unit Tests](https://github.com/bidnessforb/postman-sdk/actions/workflows/unit-tests.yml/badge.svg)
![Functional Tests](https://github.com/bidnessforb/postman-sdk/actions/workflows/functional-tests.yml/badge.svg)
[![codecov](https://codecov.io/gh/bidnessforb/postman-sdk/branch/main/graph/badge.svg?token=XBROJOTUS4)](https://codecov.io/gh/bidnessforb/postman-sdk)
[![Unit Coverage](https://codecov.io/gh/bidnessforb/postman-sdk/branch/main/graph/badge.svg?token=XBROJOTUS4&flag=unit)](https://codecov.io/gh/bidnessforb/postman-sdk)
[![Functional Coverage](https://codecov.io/gh/bidnessforb/postman-sdk/branch/main/graph/badge.svg?token=XBROJOTUS4&flag=functional)](https://codecov.io/gh/bidnessforb/postman-sdk)
![Modules](https://img.shields.io/badge/modules-5-blue)
![Endpoints](https://img.shields.io/badge/endpoints-39%2F192%20(20.31%25)-yellow)
![License](https://img.shields.io/badge/license-ISC-blue)
![Status](https://img.shields.io/badge/status-alpha-orange)

A barebones SDK for the Postman API, built following minimal patterns for easy extension and evolution. Based on published [Postman API spec](https://www.postman.com/postman/postman-public-workspace/specification/3001f4e4-5f9d-4bac-9f57-b2c4d483508f/file/1f4ad1bf-697f-4be6-a167-dc1f3cf2abf2?ctx=preview).

> ⚠️ **Alpha Release**: This SDK is under active development. The API may change between minor versions until 1.0.0 is released.
  
📋 **[View API Endpoint Implementation Status](docs/API-ENDPOINTS-TODO.md)** - Track which endpoints are implemented (43/191, 22.51%)

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
```bash
node node_modules/@bidnessforb/postman-sdk/util/get-test-workspaces.js "*Test*"
```

**Delete workspaces by pattern:**
```bash
node node_modules/@bidnessforb/postman-sdk/util/delete-test-workspaces.js "*Test*" --force
```

**Delete workspace by ID:**
```bash
node node_modules/@bidnessforb/postman-sdk/util/delete-test-workspaces.js --workspaceId=abc123-def456 --force
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

The repository uses **three workflows** for comprehensive testing:

#### 1. All Tests Workflow (`all-tests.yml`) - **Recommended for Branch Protection**
- Orchestrates both unit and functional tests
- Runs both test suites in parallel
- Automatic cleanup of test resources using test-ids.json artifact
  - Cleanup runs by default (can be disabled with `cleanUp: false` on manual triggers)
  - Uses workspace ID from functional tests for precise cleanup
  - Falls back to pattern-based cleanup if artifact unavailable
  - Always runs, even on test failure
- Single status check that requires both to pass
- Ideal for branch protection rules

#### 2. Unit Tests Workflow (`unit-tests.yml`)
- Fast, mocked tests for quick feedback
- Generates unit test coverage with `unit` flag
- No API key required
- Runs standalone or called by `all-tests.yml`
- Uploads coverage to Codecov

#### 3. Functional Tests & Coverage Workflow (`functional-tests.yml`)
- All-up functional test suite with real API calls
- Generates functional test coverage with `functional` flag
- Comprehensive coverage analysis
- Uploads coverage to Codecov
- Runs standalone or called by `all-tests.yml`

**Execution Strategy:**
- **On PRs**: `all-tests.yml` orchestrates both test suites in parallel
- **On Push to main**: Unit and functional tests run independently
- ✅ Parallel execution for faster feedback
- ✅ Clear separation of concerns
- ✅ Single combined status for branch protection
- ✅ Independent monitoring of each test suite
- ✅ Separate coverage tracking (unit vs functional)

**Setup Required:**
- Add `POSTMAN_API_KEY` secret for functional tests
- Add `CODECOV_TOKEN` for automatic coverage badge updates (optional)
- See [.github/workflows/README.md](.github/workflows/README.md) for detailed setup instructions

**Coverage Tracking:**
- Both workflows generate and upload coverage to [Codecov](https://codecov.io)
- Unit tests tagged with `unit` flag for independent tracking
- Functional tests tagged with `functional` flag for independent tracking
- Overall coverage badge shows combined coverage from both test suites
- Flag-specific badges show unit and functional coverage separately
- All badges update automatically after each workflow run
- No manual README updates needed - eliminates merge conflicts
- **Codecov Status Checks:**
  - `codecov/project` - Combined coverage check (blocking, 2% threshold)
  - `codecov/project/unit` - Unit coverage check (informational only)
  - `codecov/project/functional` - Functional coverage check (informational only)
  - `codecov/patch` - Patch coverage check (informational only)

**Local Testing:**
Run the same tests locally before pushing:
```bash
npm run test:unit              # Unit tests (no coverage)
npm run test:unit-coverage     # Unit tests with coverage
npm run test:all-up            # Functional tests
npm run test:coverage          # Functional tests with coverage
```

