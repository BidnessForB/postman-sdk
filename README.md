# Postman SDK

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

## Development

This SDK is built incrementally, starting with a small subset of endpoints to establish patterns before expanding to cover the full Postman API.

