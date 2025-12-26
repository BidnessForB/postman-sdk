# Forks Functional Tests

This directory contains functional tests for fork operations in the Postman SDK.

## Structure

### `/collections/functional.test.js`
Tests for collection fork operations:
- `getCollectionForks()` - Get all forked collections
- `createCollectionFork()` - Create a fork from a collection
- `mergeCollectionFork()` - Merge a fork back to its parent

**Test Coverage:**
- Create collection forks with labels
- Retrieve all forks with pagination and sorting
- Merge forks with different strategies (default and deleteSource)
- Error handling for invalid IDs/UIDs

### `/environments/functional.test.js`
Tests for environment fork operations (to be implemented):
- `getEnvironmentForks()` - Get all forked environments
- `createEnvironmentFork()` - Create a fork from an environment
- `mergeEnvironmentFork()` - Merge a fork back to its parent

## Running Tests

Run all fork tests:
```bash
npm test -- forks
```

Run only collection fork tests:
```bash
npm test -- forks/collections
```

Run only environment fork tests:
```bash
npm test -- forks/environments
```

## Test Dependencies

These tests require:
- Valid `POSTMAN_API_KEY` environment variable
- Existing test data in `test-ids.json`:
  - `userId` - Current user ID
  - `workspace.id` - Workspace ID for fork operations
  - `collection.id` and `collection.uid` - Source collection for forking

Run prerequisite tests first:
```bash
npm test -- src/__tests__/all-up-functional.test.js
npm test -- src/workspaces
npm test -- src/collections/__tests__/01-collections-functional.test.js
```

## Test Data

Fork tests persist the following data to `test-ids.json`:
```json
{
  "fork": {
    "collection": {
      "id": "...",
      "uid": "...",
      "name": "...",
      "label": "...",
      "from": "..."
    }
  }
}
```

## Notes

- Collection forks are created with timestamp-based labels for uniqueness
- The merge tests use both default strategy and `deleteSource` strategy
- Fork objects are automatically deleted when using `deleteSource` merge strategy
- Environment fork functionality is planned for future implementation

