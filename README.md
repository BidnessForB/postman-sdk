# Postman SDK

![PR Tests](https://github.com/bidnessforb/postman-sdk/actions/workflows/pr-tests.yml/badge.svg)
![Functional Tests](https://img.shields.io/badge/functional%20tests-145%20passing-brightgreen)
![Functional Coverage](https://img.shields.io/badge/functional%20coverage-92.5%25-brightgreen)
![Unit Tests](https://img.shields.io/badge/unit%20tests-passing-brightgreen)
![Modules](https://img.shields.io/badge/modules-5-blue)
![Endpoints](https://img.shields.io/badge/endpoints-35%2F191%20(18.3%25)-yellow)
![License](https://img.shields.io/badge/license-ISC-blue)

A barebones SDK for the Postman API, built following minimal patterns for easy extension and evolution.  Based on published [Postman API spec](https://www.postman.com/postman/postman-public-workspace/specification/3001f4e4-5f9d-4bac-9f57-b2c4d483508f/file/1f4ad1bf-697f-4be6-a167-dc1f3cf2abf2?ctx=preview).
  
📋 **[View API Endpoint Implementation Status](docs/API-ENDPOINTS-TODO.md)** - Track which endpoints are implemented (35/191, 18.3%)

## Installation
  
```bash
npm install
```

## Configuration

Set your Postman API key as an environment variable, then specify that variable name in config.js

```bash
export POSTMAN_API_KEY_POSTMAN=your_api_key_here
```

## Usage

```javascript
const { collections, workspaces, specs } = require('postman-sdk');

// Example usage (once endpoints are implemented)
// const allCollections = await collections.getCollections();
// const workspace = await workspaces.getWorkspace(workspaceId);
```

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
1. **Unit Tests** - Fast, mocked tests
2. **Functional Tests** - All-up functional test suite with real API calls
3. **Coverage Report** - Comprehensive test coverage analysis

**Setup Required:**
- Add `POSTMAN_API_KEY` secret in GitHub repository settings
- See [.github/workflows/README.md](.github/workflows/README.md) for detailed setup instructions

**Local Testing:**
Run the same tests locally before pushing:
```bash
npm run test:unit           # Unit tests
npm run test:all-up         # Functional tests
npm run test:coverage       # Coverage report
```

