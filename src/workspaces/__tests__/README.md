# Workspaces Functional Tests

## ID Persistence Across Test Runs

The functional tests for workspaces implement **persistent ID storage** to allow test resources to be reused across multiple test runs **without any automatic cleanup**.

### How It Works

1. **First Run**: Tests create a new workspace and save its ID to `test-ids.json`
2. **Subsequent Runs**: Tests load the ID from `test-ids.json` and reuse the **same existing workspace**
3. **File Persistence**: The `test-ids.json` file is **NEVER deleted** - it persists indefinitely
4. **Workspace Persistence**: The workspace is **NEVER deleted automatically** - it persists indefinitely
5. **Manual Cleanup Only**: Workspaces must be deleted manually when no longer needed

### Benefits

- **Faster test execution** - Skip resource creation on subsequent runs (workspace created once, reused forever)
- **Avoid rate limits** - Drastically reduce API calls to Postman
- **Manual testing** - Resources stay alive indefinitely for manual testing and debugging 
- **Consistent test environment** - Always use the exact same workspace across all test runs
- **Real-world testing** - Test against a persistent, evolving workspace state

### The Shared test-ids.json File

The file is automatically created at `src/__tests__/test-ids.json` (shared across all test modules) and **persists indefinitely**. Example contents:

```json
{
  "workspace": {
    "id": "1f0df51a-8658-4ee8-a2a1-d2567dfa09a9",
    "name": "Updated Workspace Name 1734607890"
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
      "id": null,
      "replyId": null
    },
    "thread": {
      "id": null,
      "clearedAt": null
    }
  }
}
```

**Note**: This file is ignored by git (via `.gitignore`) and should not be committed. It stores IDs for all test modules (workspaces, specs, collections, etc.).

### Manual Cleanup

Resources are **NEVER deleted automatically**. To clean up:

**Option 1: Use the manual cleanup test file**
```bash
# Edit manual-cleanup.test.js and remove .skip from the cleanup test, then run:
npx jest src/workspaces/__tests__/manual-cleanup.test.js
```

This is the **recommended approach** as it:
- Deletes the workspace via the API
- Clears only workspace-related properties from test-ids.json (preserving other test data)
- Verifies the workspace was actually deleted

**Option 2: Delete the workspace manually via Postman UI**
- Go to Postman → Workspaces
- Find and delete the test workspace
- Manually edit `src/__tests__/test-ids.json` to set `workspace.id` and `workspace.name` to `null`

**Option 3: Use the SDK directly**
```javascript
const { deleteWorkspace } = require('./src/workspaces');
const { clearTestIds } = require('../__tests__/test-helpers');

await deleteWorkspace('1f0df51a-8658-4ee8-a2a1-d2567dfa09a9');
clearTestIds(['workspace.id', 'workspace.name']);
```

**Option 4: Start completely fresh**
```bash
# Delete the shared file to force creation of ALL new resources next run
# WARNING: This affects all test modules (workspaces, specs, collections, etc.)
rm src/__tests__/test-ids.json
```

### Test Execution Flow

```
Run 1 (no file): 
  - Create workspace → Save ID to file → Run all tests → Workspace persists
  
Run 2, 3, 4... (file exists):
  - Load ID from file → Verify workspace exists → Reuse SAME workspace → Run all tests → Workspace persists
  
Until manually cleaned up:
  - Same workspace ID used across ALL test runs indefinitely
```

### Test Organization

The workspace tests are organized into three separate files:

1. **`unit.test.js`** - Unit tests with mocked API calls
2. **`functional.test.js`** - Functional tests that create and test real workspaces (no automatic cleanup)
3. **`manual-cleanup.test.js`** - Manual cleanup tests (skipped by default)

When you run all workspace tests with `npx jest src/workspaces/__tests__/`, the manual cleanup tests are skipped automatically. This prevents accidental deletion of test resources.

### Shared Utility Functions

All test modules use shared utility functions from `src/__tests__/test-helpers.js`:

- `loadTestIds()` - Load persisted IDs from shared file (returns empty object if file doesn't exist)
- `saveTestIds(ids)` - Save/update IDs in shared file (merges with existing data)
- `clearTestIds(keysToClear)` - Set specific properties to null while preserving the file and other properties
- `deleteTestIdsFile()` - Completely remove the test-ids.json file (use to start fresh)

**Note**: These functions are shared across all test modules (workspaces, specs, collections, etc.) to maintain a single source of truth for test IDs.

### Scoped Cleanup

The `clearTestIds` function supports scoped cleanup with nested paths, allowing you to clear only workspace-related properties without affecting other test data:

```javascript
// Clear only workspace properties using nested paths
clearTestIds(['workspace.id', 'workspace.name']);

// This preserves spec, collection, folder, etc. data from other test modules
// Result: { workspace: { id: null, name: null }, spec: { id: 'abc', ... }, ... }
```

