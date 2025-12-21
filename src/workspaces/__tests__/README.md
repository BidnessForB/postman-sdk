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
  "workspaceId": "1f0df51a-8658-4ee8-a2a1-d2567dfa09a9",
  "workspaceName": "Updated Workspace Name 1734607890",
  "specId": "abc123-spec-id",
  "specName": "My API Spec",
  "collectionId": "def456-collection-id",
  "collectionName": "My Collection",
  "createdAt": "2025-12-19T10:30:00.000Z",
  "updatedAt": "2025-12-19T10:31:00.000Z"
}
```

**Note**: This file is ignored by git (via `.gitignore`) and should not be committed. It stores IDs for all test modules (workspaces, specs, collections, etc.).

### Manual Cleanup

Resources are **NEVER deleted automatically**. To clean up:

**Option 1: Delete the workspace manually via Postman UI**

**Option 2: Use the SDK directly**
```javascript
const { deleteWorkspace } = require('./src/workspaces');
await deleteWorkspace('1f0df51a-8658-4ee8-a2a1-d2567dfa09a9');
```

**Option 3: Run the skipped cleanup test**
```bash
# Edit functional.test.js and remove .skip from the cleanup test, then run:
npm test -- src/workspaces/__tests__/functional.test.js -t "deleteWorkspace"
```

**Option 4: Start fresh**
```bash
# Delete the shared file to force creation of new resources next run
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

### Shared Utility Functions

All test modules use shared utility functions from `src/__tests__/test-helpers.js`:

- `loadTestIds()` - Load persisted IDs from shared file (returns empty object if file doesn't exist)
- `saveTestIds(ids)` - Save/update IDs in shared file (merges with existing data)
- `clearTestIds(existingIds)` - Set all properties to null while preserving the file (used after resource deletion)
- `deleteTestIdsFile()` - Completely remove the test-ids.json file (use to start fresh)

**Note**: These functions are shared across all test modules (workspaces, specs, collections, etc.) to maintain a single source of truth for test IDs.

