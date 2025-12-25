# Collections Tests

This directory contains comprehensive tests for the Collections module, including unit tests and functional tests.

## Test Organization

The collections tests are organized into multiple files:

### Unit Tests (`unit.test.js`)

Comprehensive unit tests with mocked API calls covering all collection-related functions.

**Core Collection Functions:**
- ✅ `getCollections()` - Get all collections with query parameters
- ✅ `createCollection()` - Create collection in workspace
- ✅ `getCollection()` - Get single collection by ID
- ✅ `updateCollection()` - Update collection with Prefer header support
- ✅ `modifyCollection()` - Patch collection
- ✅ `deleteCollection()` - Delete collection

**Folder Functions:**
- ✅ `createFolder()` - Create folder in collection
- ✅ `getFolder()` - Get folder with query parameters (ids, uid, populate)
- ✅ `updateFolder()` - Update folder
- ✅ `deleteFolder()` - Delete folder

**Collection Comment Functions:**
- ✅ `getCollectionComments()` - Get all comments on collection
- ✅ `createCollectionComment()` - Create comment with thread support
- ✅ `updateCollectionComment()` - Update comment
- ✅ `deleteCollectionComment()` - Delete comment

**Folder Comment Functions:**
- ✅ `getFolderComments()` - Get all comments on folder
- ✅ `createFolderComment()` - Create comment with thread support
- ✅ `updateFolderComment()` - Update comment
- ✅ `deleteFolderComment()` - Delete comment

**Tag Functions:**
- ✅ `getCollectionTags()` - Get collection tags
- ✅ `updateCollectionTags()` - Update collection tags (empty, single, multiple, max 5)

**Transformation Functions:**
- ✅ `syncCollectionWithSpec()` - Sync collection with API spec
- ✅ `createCollectionGeneration()` - Generate spec from collection
- ✅ `getCollectionGenerations()` - List generated specs
- ✅ `getCollectionTaskStatus()` - Poll generation task status

**Test Coverage:**
- Query parameter handling (workspace, name, limit, offset, access_key, model)
- UID construction for comment endpoints
- Optional parameters and defaults
- Header customization (Prefer header)
- Thread and reply support in comments
- Tag management with array handling
- Transformation task polling and status checking
- ~95%+ line coverage, 100% function coverage

Run unit tests:
```bash
npm test -- src/collections/__tests__/unit.test.js
```

### Functional Tests

The collections module has functional tests organized in multiple files:

1. **`01-collections-functional.test.js`** - Core collection CRUD operations
2. **`02-folders-functional.test.js`** - Folder operations within collections
3. **`03-folder-comments-functional.test.js`** - Folder comment operations
4. **`04-collection-comments-functional.test.js`** - Collection comment operations
5. **`05-collection-tags-functional.test.js`** - Collection tagging operations
6. **`manual-cleanup.test.js`** - Manual cleanup (skipped by default)

These tests make real API calls and persist test IDs in the shared `test-ids.json` file.

Run functional tests:
```bash
npm test -- src/collections/__tests__/01-collections-functional.test.js
npm test -- src/collections/__tests__/02-folders-functional.test.js
# ... etc
```

## Test Coverage Improvements (December 2024)

Added comprehensive unit tests for transformation functions that were previously untested:

### New Tests Added

**`syncCollectionWithSpec()`:**
- Call PUT endpoint with specId query parameter
- Construct correct collection UID from userId and collectionId
- Return task information (taskId, url) for async sync

**`createCollectionGeneration()`:**
- Call POST endpoint with element type in path
- Include all required parameters in request body (name, type, format)
- Support different spec types (OPENAPI:3.0, OPENAPI:3.1) and formats (JSON, YAML)
- Return task information for async generation

**`getCollectionGenerations()`:**
- Call GET endpoint for listing generated specs
- Construct correct collection UID
- Return array of specs with metadata and pagination

**`getCollectionTaskStatus()`:**
- Call GET endpoint with taskId
- Construct correct collection UID
- Handle different task statuses (pending, completed, failed)
- Return task details and metadata

These additions increased collections module coverage from 80% to ~95%+ lines and from 77.77% to 100% functions.

## Shared Test Resources

All collections tests use the shared test helpers from `src/__tests__/test-helpers.js`:

- `loadTestIds()` - Load persisted IDs from shared file
- `saveTestIds(ids)` - Save/update IDs in shared file
- `clearTestIds(keysToClear)` - Clear specific properties (e.g., `['collection.id', 'folder.id']`)
- `deleteTestIdsFile()` - Completely remove test-ids.json (start fresh)

Test IDs are stored in the shared `src/__tests__/test-ids.json` file (git-ignored).

## Running All Collections Tests

```bash
# Run all collections tests (unit + functional)
npm test -- src/collections/__tests__/

# Run only unit tests
npm test -- src/collections/__tests__/unit.test.js

# Run specific functional test
npm test -- src/collections/__tests__/01-collections-functional.test.js
```

## Notes

- Unit tests use mocks for fast, isolated testing
- Functional tests make real API calls and require `POSTMAN_API_KEY` environment variable
- Test resources persist across runs for efficiency
- Manual cleanup is available but skipped by default to prevent accidental deletion
- All tests follow consistent patterns established in the SDK

