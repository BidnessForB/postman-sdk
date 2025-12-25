# Environments Module Tests

This directory contains all tests for the Environments module, which provides methods for managing Postman environments.

## Module Coverage

The environments module implements **5 of 6 core environment operations** (83.3% of core operations):

✅ **Implemented:**
- `getEnvironments()` - Get all environments with optional workspace filter
- `createEnvironment()` - Create a new environment with variables
- `getEnvironment()` - Get a single environment by ID
- `modifyEnvironment()` - Update an environment (partial updates via PATCH)
- `deleteEnvironment()` - Delete an environment

❌ **Not Implemented:**
- PUT `/environments/{environmentId}` - Full replacement of environment data

## Test Files

### Unit Tests (`unit.test.js`)

Unit tests mock all HTTP requests using Jest and verify that:
- API endpoints are called with correct URLs
- HTTP methods are used correctly
- Request payloads are properly structured
- Headers include API key and Content-Type
- Query parameters are correctly built
- Responses are returned as expected

**Run with:**
```bash
npm run test:unit -- src/environments/__tests__/unit.test.js
```

**Coverage:**
- 13 unit tests covering all 5 implemented functions
- Tests for query parameter handling
- Tests for request body structure
- Tests for header configuration
- Tests for environment variable management

### Functional Tests (`functional.test.js`)

Functional tests make real API calls to Postman and verify:
- End-to-end CRUD operations work correctly
- Resources are created and can be retrieved
- Updates modify the correct properties
- Deletions succeed and resources are removed
- Environment variables can be added, updated, and managed

**Run with:**
```bash
npm test -- src/environments/__tests__/functional.test.js
```

**Coverage:**
- 7 functional tests covering all implemented operations
- Tests use persisted environment IDs from `test-ids.json`
- Tests create and clean up temporary resources
- Tests verify workspace-scoped environment creation
- Tests verify environment variable CRUD operations

**Prerequisites:**
- `POSTMAN_API_KEY_POSTMAN` environment variable must be set
- Valid workspace ID in `test-ids.json`

## Test Data Persistence

The functional tests persist environment IDs to `src/__tests__/test-ids.json`:

```json
{
  "environment": {
    "id": "env-uuid-here",
    "uid": "userId-env-uuid-here",
    "name": "Test Environment",
    "workspaceId": "workspace-uuid",
    "createdAt": "2025-12-24T10:30:00.000Z"
  }
}
```

This allows tests to reuse the same environment across multiple test runs, reducing API calls and test execution time.

## Running All Environment Tests

```bash
# Run all environment tests (unit + functional)
npm test -- src/environments/__tests__/

# Run with coverage
npm test -- src/environments/__tests__/ --coverage

# Run in watch mode
npm test -- src/environments/__tests__/ --watch
```

## Test Execution Order

The functional tests run in this order:

1. `getEnvironments` - Verify we can list all environments
2. `getEnvironments` (workspace-scoped) - Verify workspace filtering
3. `createEnvironment` - Create a test environment with variables
4. `getEnvironment` - Retrieve the created environment
5. `modifyEnvironment` (name) - Update the environment name
6. `modifyEnvironment` (values) - Update environment variables
7. `deleteEnvironment` - Create and delete a temporary environment

## Implementation Notes

### Environment Variables

Environments support different variable types:
- **default**: Regular variables visible in the UI
- **secret**: Sensitive values (API keys, passwords) masked in the UI

Example environment data structure:
```javascript
{
  name: 'My Environment',
  values: [
    {
      key: 'base_url',
      value: 'https://api.example.com',
      type: 'default',
      enabled: true
    },
    {
      key: 'api_key',
      value: 'secret_value',
      type: 'secret',
      enabled: true
    }
  ]
}
```

### Workspace Scoping

Environments can be created in specific workspaces using the `workspace` query parameter:
```javascript
await createEnvironment(environmentData, workspaceId);
```

### Partial Updates

The `modifyEnvironment()` function uses PATCH, allowing partial updates:
```javascript
// Update only the name
await modifyEnvironment(envId, { name: 'New Name' });

// Update only the values
await modifyEnvironment(envId, { values: [...] });
```

## Related Documentation

- [API Endpoints Status](../../../docs/API-ENDPOINTS-TODO.md#environments-module-510-completed---50)
- [Main README](../../../README.md)
- [Test Helpers](../../__tests__/README.md)

