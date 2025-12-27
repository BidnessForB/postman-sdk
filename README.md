# Postman SDK

![Version](https://img.shields.io/badge/version-0.8.2-blue)
[![All Tests](https://github.com/bidnessforb/postman-sdk/workflows/Postman%20SDK%20-%20All%20Tests/badge.svg)](https://github.com/bidnessforb/postman-sdk/actions/workflows/all-tests.yml)
[![Unit Tests](https://github.com/bidnessforb/postman-sdk/workflows/Postman%20SDK%20-%20Unit%20Tests/badge.svg)](https://github.com/bidnessforb/postman-sdk/actions/workflows/unit-tests.yml)
[![Functional Tests](https://github.com/bidnessforb/postman-sdk/workflows/Postman%20SDK%20-%20Functional%20Tests%20%26%20Coverage/badge.svg)](https://github.com/bidnessforb/postman-sdk/actions/workflows/functional-tests.yml)
[![codecov](https://codecov.io/gh/bidnessforb/postman-sdk/branch/main/graph/badge.svg?token=XBROJOTUS4)](https://codecov.io/gh/bidnessforb/postman-sdk)
![Modules](https://img.shields.io/badge/modules-12-blue)
![Endpoints](https://img.shields.io/badge/endpoints-102%2F161%20(63.35%25)-yellow)
![License](https://img.shields.io/badge/license-ISC-blue)
![Status](https://img.shields.io/badge/status-alpha-orange)

A barebones SDK for the Postman API, built following minimal patterns for easy extension and evolution. Based on published [Postman API spec](https://www.postman.com/postman/postman-public-workspace/specification/3001f4e4-5f9d-4bac-9f57-b2c4d483508f/file/1f4ad1bf-697f-4be6-a167-dc1f3cf2abf2?ctx=preview).

Project was undertaken as a vehicle for learning how to use Cursor more effectively.  Feedback on rules, etc., welcome.  

> ⚠️ **Alpha Release**: This SDK is under active development. The API may change between minor versions until 1.0.0 is released.

## id vs uid

The Postman API makes use of two different structures for identifying objects.  The API will validate that the correct type of id (id, uid) was supplied.  

### id
 - regex&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: `/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;`
 - example: `bf5cb6e7-0a1e-4b82-a577-b2068a70f830`

### uid
 - regex&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:`/^[0-9]{1,10}-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;`
 - example: `'34876850-bf5cb6e7-0a1e-4b82-a577-b2068a70f830';

## SDK Docs
[Review the SDK Reference](docs/API-REFERENCE.md)
  
📋 **[View API Endpoint Implementation Status](docs/API-ENDPOINTS-TODO.md)** 

## API Builder endpoints (/apis)

API Builder endpoints have not been implemented.


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
const { collections, workspaces, specs, requests, responses } = require('@bidnessforb/postman-sdk');

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

  // Create a request in a collection
  const collectionId = collectionsResponse.data.collections[0].id;
  const requestResponse = await requests.createRequest(collectionId, {
    name: 'New Request',
    method: 'GET',
    url: 'https://api.example.com/endpoint'
  });
  console.log('Created Request:', requestResponse.data);

  // Create a response for the request
  const requestId = requestResponse.data.data.id;
  const responseResponse = await responses.createResponse(collectionId, requestId, {
    name: 'Success Response',
    code: 200,
    body: '{"status": "success"}'
  });
  console.log('Created Response:', responseResponse.data);
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
│   ├── requests/
│   │   └── index.js             # Request endpoints
│   ├── workspaces/
│   │   └── index.js             # Workspace endpoints
│   └── specs/
│       └── index.js             # Spec endpoints
├── package.json
├── README.md

```

## Module Organization

The SDK is organized by resource groups:

- **collections**: Endpoints for managing Postman Collections, folders, comments, forks, and pull requests (41/64 endpoints - 64.1%)
- **requests**: Endpoints for managing requests and comments within collections (8/8 endpoints - 100% ✅)
- **responses**: Endpoints for managing responses and comments within collections (8/8 endpoints - 100% ✅)
- **workspaces**: Endpoints for managing Postman Workspaces and tags (7/14 endpoints - 50%)
- **specs**: Endpoints for managing Postman API Specifications and generations (15/15 endpoints - 100% ✅)
- **environments**: Endpoints for managing Postman Environments and forks (9/10 endpoints - 90%)
- **mocks**: Endpoints for managing mock servers, responses, and call logs (13/13 endpoints - 100% ✅)
- **tags**: Endpoints for retrieving entities by tag (1/1 endpoint - 100% ✅)
- **transformations**: Endpoints for bi-directional sync between specs and collections (2/2 endpoints - 100% ✅)
- **users**: Endpoints for user information and authentication (1/3 endpoints - 33.3%)
- **pullRequests**: Endpoints for managing pull requests - get, update, review (3/3 endpoints - 100% ✅)
- **forks**: Fork operations for collections and environments (included in collections and environments modules)


## Testing

The SDK includes comprehensive test coverage with unit tests, integration tests, and functional tests.

### Test Organization

The test suite is organized into three levels:

1. **Unit Tests** - Fast, mocked tests for individual functions and modules
2. **Integration Tests** - Tests that use real resources (e.g., file system) but don't call external APIs
3. **Functional Tests** - End-to-end tests that make real API calls to Postman

### Unit Tests

Run unit tests only (mocked, fast):

```bash
npm run test:unit
```

Unit tests cover:
- Main SDK entry point (`src/__tests__/index.unit.test.js`)
- Core utilities (request building, query strings, UID construction)
- All module exports and function signatures
- Error handling and edge cases

**Integration Tests** are included in the unit test suite and run actual file system operations:
- Fixtures loading (`src/core/__tests__/fixtures.integration.test.js`)

### Functional Tests

Run the complete functional test suite (executes all functional tests in proper dependency order):

```bash
npm run test:all-up
```

This orchestrates all functional tests in sequence:
1. Workspaces (create/test workspace)
2. Environments (create/test environments in workspace)
3. Collections (create/test collection in workspace)
4. Collection Comments (create/test comments on collection)
5. Folders (create/test folder in collection)
6. Folder Comments (create/test comments on folder)
7. Requests (create/test requests in collections and folders)
8. Responses (create/test responses on requests)
9. Mocks (create/test mock servers)
10. Specs (create/test API specs in workspace)
11. Transformations (test bidirectional sync between specs and collections)
12. Tags (test tagging and entity retrieval)
13. Forks (test collection and environment forking operations)
14. Pull Requests (test PR creation, update, and review)

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

## Contributing

We welcome contributions! Whether you're fixing bugs, adding new endpoints, improving documentation, or suggesting features, your help is appreciated.

### Quick Links

- 📖 **[Contributing Guide](CONTRIBUTING.md)** - Comprehensive guide for contributors
- 🔒 **[Security Policy](SECURITY.md)** - How to report security vulnerabilities

### How to Contribute

1. **Fork and clone** the repository
2. **Create a branch** for your feature or fix
3. **Follow coding standards** - See [CONTRIBUTING.md](CONTRIBUTING.md)
4. **Add tests** - Unit and functional tests required
5. **Update documentation** - Keep docs in sync with code
6. **Submit a PR** - Use conventional commit format

### What to Contribute

- **New Endpoints** - Check [API-ENDPOINTS-TODO.md](docs/API-ENDPOINTS-TODO.md) for unimplemented endpoints
- **Bug Fixes** - Found a bug? Submit a fix!
- **Tests** - Improve coverage, add edge cases
- **Documentation** - Clarify, expand, or fix docs
- **Examples** - Real-world usage examples
- **Performance** - Optimize existing code

### Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/postman-sdk.git
cd postman-sdk

# Install dependencies
npm install

# Set up API key
export POSTMAN_API_KEY=your_api_key_here

# Run tests
npm run test:unit          # Fast unit tests
npm run test:all-up        # Functional tests
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed instructions.

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

