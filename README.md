# Postman SDK

![Tests](https://img.shields.io/badge/tests-128%20passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-92.17%25-brightgreen)
![Modules](https://img.shields.io/badge/modules-4-blue)
![Endpoints](https://img.shields.io/badge/endpoints-31%2F191%20(16.2%25)-yellow)
![License](https://img.shields.io/badge/license-ISC-blue)

A barebones SDK for the Postman API, built following minimal patterns for easy extension and evolution.

## Installation

```bash
npm install
```

## Configuration

Set your Postman API key as an environment variable:

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
└── postmanAPISpec.yaml          # OpenAPI spec reference
```

## Module Organization

The SDK is organized by resource groups:

- **collections**: Endpoints for managing Postman Collections
- **workspaces**: Endpoints for managing Postman Workspaces
- **specs**: Endpoints for managing Postman API Specifications

## Implementation Rules

Following the established patterns:

1. Vanilla Node.js (no TypeScript)
2. Functions use naming prefix based on HTTP method (get/create/update/modify/delete)
3. Functions return axios response directly
4. No validation of parameters
5. Minimal code - only what's necessary
6. JSDoc comments for all functions
7. API key from environment variable (not passed as parameter)

## Testing

### Unit Tests

Run tests with:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
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

