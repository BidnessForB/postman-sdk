# Workspaces Functional Tests

## ID Persistence Across Test Runs

The functional tests for workspaces implement **persistent ID storage** to allow test resources to be reused across multiple test runs.

### How It Works

1. **First Run**: Tests create a new workspace and save its ID to `test-ids.json`
2. **Subsequent Runs**: Tests load the ID from `test-ids.json` and reuse the existing workspace
3. **Cleanup**: When tests complete successfully, the workspace is deleted and `test-ids.json` is cleared

### Benefits

- **Faster test execution** - Skip resource creation on subsequent runs
- **Avoid rate limits** - Reduce API calls to Postman
- **Manual testing** - Keep resources alive between test runs for debugging
- **Consistent test environment** - Use the same workspace across multiple test iterations

### The test-ids.json File

The file is automatically created in this directory and contains:

```json
{
  "workspaceId": "1f0df51a-8658-4ee8-a2a1-d2567dfa09a9",
  "workspaceName": "SDK Test Workspace 1234567890",
  "createdAt": "2025-12-19T10:30:00.000Z",
  "updatedAt": "2025-12-19T10:31:00.000Z"
}
```

**Note**: This file is ignored by git (via `.gitignore`) and should not be committed.

### Clearing Persisted IDs

To force tests to create fresh resources, simply delete the `test-ids.json` file:

```bash
rm src/workspaces/__tests__/test-ids.json
```

### Test Execution Flow

```
Run 1: Create workspace → Save ID to file → Run tests → Delete workspace → Clear file
Run 2 (if file exists): Load ID → Verify workspace exists → Run tests → Delete workspace → Clear file
Run 2 (if deleted manually): Create new workspace → Save ID to file → Run tests → ...
```

### Functions Available

The test file exports these utility functions:

- `loadTestIds()` - Load persisted IDs from file
- `saveTestIds(ids)` - Save IDs to file for reuse
- `clearTestIds()` - Remove the test-ids.json file

These can be adapted for other test modules that need ID persistence.

