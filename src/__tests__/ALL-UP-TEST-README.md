# All-Up Functional Test Suite

## Overview

The All-Up Functional Test is a comprehensive integration test that orchestrates all functional test modules in the correct dependency order. This ensures that the entire SDK workflow functions correctly from workspace creation through to API spec management.

## Test Execution Order

The tests run in the following sequence to respect resource dependencies:

1. **Workspaces** (`workspaces/__tests__/functional.test.js`)
   - Creates a new test workspace (or reuses existing if `test-ids.json` exists)
   - Tests workspace CRUD operations
   - Persists workspace ID for downstream tests

2. **Environments** (`environments/__tests__/functional.test.js`)
   - Creates a test environment in the workspace
   - Tests environment CRUD operations
   - Tests environment variable management
   - Persists environment ID for downstream tests

3. **Collections** (`collections/__tests__/01-collections-functional.test.js`)
   - Creates a collection in the workspace
   - Tests collection CRUD operations
   - Persists collection ID for downstream tests

4. **Collection Comments** (`collections/__tests__/04-collection-comments-functional.test.js`)
   - Creates comments on the collection
   - Tests comment CRUD operations including replies
   - Tests thread management
   - Persists comment/thread IDs

5. **Folders** (`collections/__tests__/02-folders-functional.test.js`)
   - Creates a folder in the collection
   - Tests folder CRUD operations
   - Persists folder ID for downstream tests

6. **Folder Comments** (`collections/__tests__/03-folder-comments-functional.test.js`)
   - Creates comments on the folder
   - Tests comment CRUD operations including replies
   - Tests thread management
   - Persists comment/thread IDs

7. **Requests** (`requests/__tests__/functional.test.js`)
   - Creates requests in the collection and folder
   - Tests request CRUD operations
   - Tests requests in both collection root and folder contexts
   - Persists request IDs

8. **Responses** (`responses/__tests__/functional.test.js`)
   - Creates responses for the test requests
   - Tests response CRUD operations
   - Tests response comments and comment operations
   - Persists response IDs

9. **Specs** (`specs/__tests__/functional.test.js`)
   - Creates API specs in the workspace
   - Tests spec CRUD operations
   - Tests spec file operations
   - Persists spec IDs

10. **Transformations** (`transformations/__tests__/functional.test.js`)
    - Creates dedicated test collection and spec for transformations
    - Tests bi-directional synchronization between specs and collections
    - Syncs generated specs with source collections (spec-to-collection)
    - Syncs collections with generated specs (collection-to-spec)
    - Persists transformation resource IDs under `transformations` key
    - Uses resources created in previous phases for sync operations

11. **Tags** (`tags/__tests__/functional.test.js`)
    - Tests tagging operations on workspaces
    - Tests entity retrieval by tag
    - Validates tag-based resource discovery

## Running the Test

### ⚠️ Important Warning

**The all-up test DELETES `test-ids.json` at the start of execution.** This means:
- Any existing test resources IDs will be cleared
- The test will create brand new resources
- If you have other tests running or want to preserve existing test IDs, run individual test modules instead

### Command Line

```bash
# Using npm script (recommended)
npm run test:all-up

# Using jest directly
npx jest src/__tests__/all-up-functional.test.js

# With verbose output
npx jest src/__tests__/all-up-functional.test.js --verbose

# Watch mode (NOT recommended - will reset on every run)
npx jest src/__tests__/all-up-functional.test.js --watch
```

### Prerequisites

1. **Environment Variable**: Set `POSTMAN_API_KEY_POSTMAN` with a valid Postman API key
   ```bash
   export POSTMAN_API_KEY_POSTMAN=your_api_key_here
   ```

2. **Network Access**: Tests make real API calls to api.getpostman.com

## How It Works

### Resource Persistence

The all-up test creates fresh resources on every run:

- **Every Run**: Deletes `test-ids.json` at the start to ensure a clean slate
- **Fresh Resources**: Creates all resources new (workspace, collection, folder, comments, specs)
- **ID Persistence During Test**: IDs are saved to `test-ids.json` during the test run for downstream tests
- **No Auto-Cleanup**: Resources remain in Postman after the test completes

**Important**: Unlike individual test modules that reuse resources, the all-up test intentionally starts fresh each time to validate the complete creation workflow.

### Test Independence

Each test module can still be run independently:
```bash
# Run individual test modules
npx jest src/workspaces/__tests__/functional.test.js
npx jest src/collections/__tests__/01-collections-functional.test.js
npx jest src/specs/__tests__/functional.test.js
```

The all-up test simply provides an orchestrated execution path.

### Structure of test-ids.json

After running the all-up test, your `test-ids.json` will contain:

```json
{
  "workspace": {
    "id": "abc-123-workspace-id",
    "name": "SDK Test Workspace 1234567890"
  },
  "user": {
    "id": 34829850
  },
  "collection": {
    "id": "def-456-collection-id",
    "name": "SDK Test Collection 1234567890",
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
    "id": "ghi-789-folder-id",
    "name": "Test Folder 1234567890",
    "comment": {
      "id": 2411530,
      "replyId": 2411531
    },
    "thread": {
      "id": 2110161,
      "clearedAt": null
    }
  },
  "request": {
    "id": "xyz-890-request-id",
    "name": "Test Request 1234567890",
    "createdAt": "2025-12-25T10:31:00.000Z",
    "commentId": 2411532
  },
  "folderRequest": {
    "id": "abc-234-folder-request-id",
    "name": "Folder Request 1234567890"
  },
  "spec": {
    "id": "jkl-012-spec-id",
    "name": "SDK Functional Test Spec",
    "createdAt": "2025-12-23T10:30:00.000Z",
    "generatedCollection": {
      "id": "userId-collectionId",
      "name": "Generated Collection 1234567890",
      "taskId": "task-id-123"
    }
  },
  "transformations": {
    "sourceCollection": {
      "id": "mno-345-collection-id",
      "uid": "userId-mno-345-collection-id",
      "name": "Transformations Test Collection 1234567890",
      "workspaceId": "abc-123-workspace-id",
      "createdAt": "2025-12-23T10:32:00.000Z"
    },
    "sourceSpec": {
      "id": "pqr-678-spec-id",
      "name": "Transformations Test Spec 1234567890",
      "workspaceId": "abc-123-workspace-id",
      "type": "OPENAPI:3.0",
      "createdAt": "2025-12-23T10:32:01.000Z"
    }
  }
}
```

## Expected Results

### Successful Run

When all tests pass, you should see output similar to:

```
All-Up Functional Test Suite
  Phase 1: Workspaces
    workspaces functional tests (sequential flow)
      ✓ 1. createWorkspace - should create a team workspace
      ✓ 2. getWorkspace - should retrieve the workspace by persisted ID
      ✓ 3. getWorkspaces - should list workspaces and include our workspace
      ... (more tests)

  Phase 2: Collections
    collections functional tests (sequential flow)
      ✓ 1. createCollection - should create a collection in workspace
      ✓ 2. getCollections - should retrieve collections from workspace
      ... (more tests)

  Phase 3: Collection Comments
  Phase 4: Folders
  Phase 5: Folder Comments
  Phase 6: Requests
  Phase 7: Specs
  Phase 8: Transformations
  Phase 9: Tags

Test Suites: 1 passed, 1 total
Tests:       116 passed, 116 total
```
c6d2471c-3664-47b5-adc8-35d52484f2f6


### Test Duration

The full suite typically takes 30-60 seconds as it creates fresh resources on every run. The reset step adds minimal overhead (~100ms).

## Cleanup

### Important: Old Resources Accumulate Locally

When running tests **locally**, the all-up test resets `test-ids.json` on each run, which means it loses track of previously created resources:

- **Multiple Local Runs Create Multiple Resources**: Each local run creates a new workspace, collection, folder, etc.
- **Old Resources Remain**: Previous test resources stay in your Postman account
- **Cleanup Required**: You'll need to clean up old test resources

**Best Practice**: Periodically clean up old test workspaces from Postman to avoid clutter.

### GitHub Actions Automatic Cleanup

When running tests via the **`all-tests.yml` GitHub Actions workflow**:

- ✅ **Automatic cleanup enabled by default** - Cleanup runs after functional tests complete
- ✅ **Intelligent cleanup** - Uses `test-ids.json` artifact to delete the specific workspace by ID
- ✅ **Runs even on test failure** - Ensures cleanup happens regardless of test results
- ✅ **Optional** - Can be disabled by setting `cleanUp: false` when manually triggering the workflow

This automatic cleanup prevents resource accumulation in CI/CD environments.

### Local Cleanup Options

For **local test runs**, resources are **NOT automatically deleted**. To clean up:

### Option 1: Utility Script (Recommended)

Use the utility scripts to delete workspaces by ID or pattern:

```bash
# Delete by workspace ID (from test-ids.json)
node util/delete-test-workspaces.js --workspaceId=abc123-def456 --force

# Delete by pattern (e.g., all test workspaces)
node util/delete-test-workspaces.js "*SDK Test*" --force
```

### Option 2: Manual Cleanup Tests

Each module has a manual cleanup test file:
```bash
npx jest src/workspaces/__tests__/manual-cleanup.test.js
npx jest src/collections/__tests__/manual-cleanup.test.js
npx jest src/specs/__tests__/manual-cleanup.test.js
```

### Option 3: Start Fresh

Delete the test IDs file to force creation of new resources:
```bash
rm src/__tests__/test-ids.json
```

**Warning**: This affects all test modules.

### Option 4: Manual Cleanup via Postman UI

1. Delete resources in Postman UI
2. Edit `src/__tests__/test-ids.json` to clear the IDs

## Troubleshooting

### Test Failures

If a test fails:

1. **Check API Key**: Ensure `POSTMAN_API_KEY_POSTMAN` is set and valid
2. **Check Network**: Ensure you can reach api.getpostman.com
3. **Check Rate Limits**: Postman API has rate limits
4. **Check Resource State**: A resource might be in an unexpected state
   - Try running the specific failing test module alone
   - Check the resource in Postman UI
   - Consider cleaning up and starting fresh

### Dependency Issues

Tests depend on resources created by earlier tests:
- If collections test fails, folder/comment tests will also fail
- If workspace test fails, everything else will fail
- Check test-ids.json to see what resources exist

### Partial Runs

You can run phases independently by running individual test files:
```bash
# Run just the collections phase
npx jest src/collections/__tests__/01-collections-functional.test.js
```

## Benefits

1. **Comprehensive Testing**: Validates the entire SDK workflow
2. **Dependency Validation**: Ensures resources work together correctly
3. **Regression Prevention**: Catches issues across module boundaries
4. **CI/CD Ready**: Single command to validate all functionality
5. **Resource Efficiency**: Reuses resources across runs

## Limitations

1. **Serial Execution**: Tests run sequentially (not in parallel)
2. **Resource Dependencies**: Later tests depend on earlier tests succeeding
3. **No Isolation**: Tests share the same workspace/collection/folder
4. **Real API Calls**: Makes actual API calls (not mocked)
5. **Rate Limits**: Subject to Postman API rate limits

## Best Practices

1. **Run Periodically**: Execute the all-up test before major releases
2. **Monitor Duration**: Track test duration to identify performance issues
3. **Review Failures**: Investigate any failures thoroughly
4. **Clean Up Regularly**: Periodically clean up old test resources
5. **Check Logs**: Review console output for warnings or issues

## Future Enhancements

Potential improvements to the all-up test:

- Parallel execution where possible
- Performance benchmarking
- Custom test sequencing
- Resource cleanup hooks
- Detailed reporting
- Test retry logic
- API usage metrics

---

**Last Updated**: December 25, 2025

