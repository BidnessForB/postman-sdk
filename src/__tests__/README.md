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

#### `clearTestIds(keysToClear)`
Clears specific test ID properties by setting them to `null` while preserving all other properties. This is useful for scoped cleanup after tests - e.g., only clearing workspace properties when deleting a workspace, or only spec properties when deleting a spec.

**Parameters:**
- `keysToClear` (`string[]`) - Array of property keys to set to `null` (e.g., `['workspaceId', 'workspaceName']`)

**Returns:** `Object` - Updated test IDs object with specified properties set to `null` and an updated `clearedAt` timestamp

**Example:**
```javascript
const { clearTestIds } = require('../__tests__/test-helpers');

// After deleting a workspace - only clear workspace properties
clearTestIds(['workspaceId', 'workspaceName']);
// Result: { workspaceId: null, workspaceName: null, specId: 'abc123', ..., clearedAt: '2025-12-21...' }

// After deleting a spec - only clear spec properties
clearTestIds(['specId', 'specName']);
// Result: { workspaceId: 'xyz789', specId: null, specName: null, ..., clearedAt: '2025-12-21...' }

// After deleting a collection - only clear collection properties
clearTestIds(['collectionId', 'collectionName']);
// Result: { workspaceId: 'xyz789', collectionId: null, collectionName: null, ..., clearedAt: '2025-12-21...' }

// After deleting a folder - only clear folder properties
clearTestIds(['folderId', 'folderName']);
// Result: { workspaceId: 'xyz789', collectionId: 'abc123', folderId: null, folderName: null, ..., clearedAt: '2025-12-21...' }

// After deleting a comment - only clear comment properties
clearTestIds(['commentId']);
// Result: { workspaceId: 'xyz789', collectionId: 'abc123', folderId: 'def456', commentId: null, ..., clearedAt: '2025-12-21...' }

// After deleting a reply comment - only clear reply comment property
clearTestIds(['replyCommentId']);
// Result: { workspaceId: 'xyz789', collectionId: 'abc123', commentId: '123', replyCommentId: null, ..., clearedAt: '2025-12-21...' }
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

