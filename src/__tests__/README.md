# Shared Test Utilities

This directory contains shared test utilities and resources used across all functional test modules in the SDK.

## Test Helpers (`test-helpers.js`)

Provides utility functions for managing persistent test IDs across all functional test modules.

### Functions

#### `loadTestIds()`
Loads persisted test IDs from the shared `test-ids.json` file.

**Returns:** `Object` - Test IDs object, or empty object if file doesn't exist

**Example:**
```javascript
const { loadTestIds } = require('../__tests__/test-helpers');

const ids = loadTestIds();
if (ids.workspaceId) {
  console.log('Using existing workspace:', ids.workspaceId);
}
```

#### `saveTestIds(ids)`
Saves test IDs to the shared `test-ids.json` file.

**Parameters:**
- `ids` (Object) - Test IDs to persist

**Example:**
```javascript
const { saveTestIds } = require('../__tests__/test-helpers');

saveTestIds({
  workspaceId: 'ws-123',
  workspaceName: 'My Workspace',
  specId: 'spec-456',
  createdAt: new Date().toISOString()
});
```

#### `clearTestIds(existingIds)`
Sets all properties in the test IDs object to `null` while preserving the file. Useful for cleanup after resource deletion.

**Parameters:**
- `existingIds` (Object) - Existing test IDs object to clear

**Returns:** `Object` - Cleared test IDs object with all values set to `null` and a `clearedAt` timestamp

**Example:**
```javascript
const { loadTestIds, clearTestIds } = require('../__tests__/test-helpers');

const ids = loadTestIds();
// After deleting a workspace
const cleared = clearTestIds(ids);
// Result: { workspaceId: null, workspaceName: null, ..., clearedAt: '2025-12-21...' }
```

#### `deleteTestIdsFile()`
Completely removes the `test-ids.json` file. Use this only when you want to start completely fresh.

**Example:**
```javascript
const { deleteTestIdsFile } = require('../__tests__/test-helpers');

deleteTestIdsFile(); // File is deleted
```

#### `TEST_IDS_FILE`
Constant containing the absolute path to the shared `test-ids.json` file.

**Example:**
```javascript
const { TEST_IDS_FILE } = require('../__tests__/test-helpers');

console.log('Test IDs file location:', TEST_IDS_FILE);
```

## Shared Test IDs File (`test-ids.json`)

This file stores resource IDs created during functional tests, allowing them to be reused across multiple test runs.

### Structure

```json
{
  "workspaceId": "1f0df51a-8658-4ee8-a2a1-d2567dfa09a9",
  "workspaceName": "SDK Test Workspace",
  "specId": "abc123-spec-id",
  "specName": "My API Spec",
  "collectionId": "def456-collection-id",
  "collectionName": "My Collection",
  "environmentId": "ghi789-env-id",
  "environmentName": "Test Environment",
  "createdAt": "2025-12-19T10:30:00.000Z",
  "updatedAt": "2025-12-19T10:31:00.000Z",
  "clearedAt": null
}
```

### Properties

- **Module-specific IDs**: Each test module (workspaces, specs, collections, etc.) uses specific properties
- **Timestamps**: `createdAt`, `updatedAt`, `clearedAt` track when resources were created, modified, or cleared
- **Null values**: When a resource is deleted, its ID is set to `null` using `clearTestIds()`

### Git Ignore

The `test-ids.json` file is automatically ignored by git (via `.gitignore` pattern `src/**/__tests__/test-ids.json`) and should never be committed to version control.

## Usage in Functional Tests

### Basic Pattern

```javascript
const { loadTestIds, saveTestIds, clearTestIds } = require('../../__tests__/test-helpers');

describe('my module functional tests', () => {
  let testResourceId;
  let persistedIds = {};

  beforeAll(() => {
    // Load existing IDs
    persistedIds = loadTestIds();
    if (persistedIds.myResourceId) {
      testResourceId = persistedIds.myResourceId;
      console.log('Reusing existing resource:', testResourceId);
    }
  });

  test('create resource', async () => {
    if (!testResourceId) {
      const result = await createResource();
      testResourceId = result.data.id;
      
      // Save for future runs
      persistedIds.myResourceId = testResourceId;
      persistedIds.createdAt = new Date().toISOString();
      saveTestIds(persistedIds);
    }
  });

  test('delete resource', async () => {
    await deleteResource(testResourceId);
    
    // Clear the IDs
    clearTestIds(persistedIds);
  });
});
```

### Benefits of Shared Test Helpers

1. **Consistency**: All test modules use the same ID management pattern
2. **Single Source of Truth**: One shared file for all test IDs
3. **Easy Debugging**: All test IDs in one place for inspection
4. **Reusability**: Test helpers can be used by any test module
5. **Maintainability**: Changes to ID management only need to be made in one place

## Testing the Test Helpers

Unit tests for the test helpers are located in `test-helpers.test.js`. Run them with:

```bash
npm test -- src/__tests__/test-helpers.test.js
```

