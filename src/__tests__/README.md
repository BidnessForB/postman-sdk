# Shared Test Utilities

This directory contains shared test utilities and resources used across all functional test modules in the SDK.

## All-Up Functional Test

The `all-up-functional.test.js` file orchestrates all functional tests in the proper dependency order:

1. Workspaces → 2. Collections → 3. Collection Comments → 4. Folders → 5. Folder Comments → 6. Specs → 7. Transformations

Run with: `npm run test:all-up`

**Note**: Test IDs are persisted in `test-ids.json` and reused across test runs. To start fresh, manually delete the file before running tests.

See [ALL-UP-TEST-README.md](./ALL-UP-TEST-README.md) for detailed documentation.

## Transformations Functional Test Suite

The `transformations-functional.test.js` file tests bi-directional transformations and synchronization between specs and collections. The suite creates its own dedicated test resources and is organized by transformation direction:

### Structure

**Setup Tests:**
- **CreateSourceCollection**: Creates a dedicated collection for transformations testing
- **CreateSourceSpec**: Creates a dedicated spec for transformations testing

**spec-to-collection:** Tests generating collections from specs and syncing collections with specs
- `createSpecGeneration` - Generate collection from spec
- `getSpecTaskStatus` - Poll generation task status
- `getSpecGenerations` - List generated collections
- `syncCollectionWithSpec` - Sync collection with spec (update collection based on spec)

**collection-to-spec:** Tests generating specs from collections and syncing specs with collections
- `createCollectionGeneration` - Generate spec from collection
- `getCollectionTaskStatus` - Poll generation task status
- `getCollectionGenerations` - List generated specs
- `syncSpecWithCollection` - Sync spec with collection (update spec based on collection)

Run with: `npm test -- src/__tests__/transformations-functional.test.js`

**Note**: This suite is self-contained and creates its own test resources under the `transformations` property in `test-ids.json`.

See [TRANSFORMATIONS-TEST-README.md](./TRANSFORMATIONS-TEST-README.md) for detailed documentation.

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
Clears specific test ID properties by setting them to `null` while preserving all other properties. This is useful for scoped cleanup after tests. Supports nested paths using dot notation (e.g., `'folder.comment.id'`, `'workspace.id'`).

**Parameters:**
- `keysToClear` (`string[]`) - Array of property paths to set to `null` (e.g., `['workspace.id', 'folder.comment.id']`)

**Returns:** `Object` - Updated test IDs object with specified properties set to `null`

**Example:**
```javascript
const { clearTestIds } = require('../__tests__/test-helpers');

// After deleting a workspace - only clear workspace properties
clearTestIds(['workspace.id', 'workspace.name']);
// Result: { workspace: { id: null, name: null }, collection: { id: 'abc123', ... }, ... }

// After deleting a spec - only clear spec properties
clearTestIds(['spec.id', 'spec.name']);
// Result: { spec: { id: null, name: null, ... }, workspace: { id: 'xyz789', ... }, ... }

// After deleting a collection - only clear collection properties
clearTestIds(['collection.id', 'collection.name']);
// Result: { collection: { id: null, name: null, ... }, folder: { id: 'def456', ... }, ... }

// After deleting a folder - only clear folder properties
clearTestIds(['folder.id', 'folder.name']);
// Result: { folder: { id: null, name: null, ... }, collection: { id: 'abc123', ... }, ... }

// After deleting a collection comment - only clear collection comment properties
clearTestIds(['collection.comment.id', 'collection.thread.id']);
// Result: { collection: { comment: { id: null, ... }, thread: { id: null, ... } }, ... }

// After deleting a folder comment - only clear folder comment properties
clearTestIds(['folder.comment.id', 'folder.thread.id']);
// Result: { folder: { comment: { id: null, ... }, thread: { id: null, ... } }, ... }

// After deleting a reply comment - only clear reply comment property
clearTestIds(['folder.comment.replyId']);
// Result: { folder: { comment: { id: 123, replyId: null }, ... }, ... }
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

The file uses a nested structure where each Postman object type is an object containing its properties:

```json
{
  "workspace": {
    "id": "1f0df51a-8658-4ee8-a2a1-d2567dfa09a9",
    "name": "SDK Test Workspace"
  },
  "spec": {
    "id": "abc123-spec-id",
    "name": "My API Spec",
    "createdAt": "2025-12-19T10:30:00.000Z",
    "updatedAt": "2025-12-19T10:31:00.000Z"
  },
  "user": {
    "id": 34829850
  },
  "collection": {
    "id": "def456-collection-id",
    "name": "My Collection",
    "comment": {
      "id": 2411528,
      "replyId": 2411529
    },
    "thread": {
      "id": 2110160,
      "clearedAt": null
    }
  },
  "folder": {
    "id": "ghi789-folder-id",
    "name": "My Folder",
    "comment": {
      "id": 2411530,
      "replyId": 2411531
    },
    "thread": {
      "id": 2110161,
      "clearedAt": null
    }
  }
}
```

### Properties

- **Nested Structure**: Each Postman object type (workspace, spec, collection, folder) has its own object containing related properties
- **Comments as Sub-objects**: Comments are nested under their parent objects (e.g., `collection.comment`, `folder.comment`)
- **Timestamps**: Various timestamp properties track when resources were created, modified, or cleared
- **Null values**: When a resource is deleted, its properties are set to `null` using `clearTestIds()` with dot notation paths

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

