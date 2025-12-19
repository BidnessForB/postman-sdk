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

### The test-ids.json File

The file is automatically created in this directory and **persists indefinitely**. Example contents:

```json
{
  "workspaceId": "1f0df51a-8658-4ee8-a2a1-d2567dfa09a9",
  "workspaceName": "Updated Workspace Name 1734607890",
  "createdAt": "2025-12-19T10:30:00.000Z",
  "updatedAt": "2025-12-19T10:31:00.000Z"
}
```

**Note**: This file is ignored by git (via `.gitignore`) and should not be committed.

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
# Delete the file to force creation of a new workspace next run
rm src/workspaces/__tests__/test-ids.json
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

### Functions Available

The test file provides these utility functions:

- `loadTestIds()` - Load persisted IDs from file (returns empty object if file doesn't exist)
- `saveTestIds(ids)` - Save/update IDs in file (appends to existing data, never deletes)
- `clearTestIds()` - Remove the test-ids.json file (available but not used in normal flow)

**Note**: These functions can be adapted for other test modules that need ID persistence.

