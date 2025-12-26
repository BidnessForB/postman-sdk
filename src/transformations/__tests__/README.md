# Transformations Functional Test Suite

## Overview

The Transformations Functional Test Suite validates bi-directional synchronization between API specs and collections in the Postman SDK. This test suite:

1. Creates dedicated test resources (collection and spec) for transformations testing
2. Tests syncing generated specs back to their source collections
3. Tests syncing collections with their generated specs
4. Validates error handling for invalid resources

## Test Structure

The suite starts with two top-level tests that create dedicated resources, then is organized into two main transformation direction groups:

### Top-Level Setup Tests

#### CreateSourceCollection

Creates a new collection specifically for transformations testing.

**Purpose:** Provides a dedicated test collection for transformations operations, independent of other test suites.

**Persists to:** `transformations.sourceCollection` in `test-ids.json`

**Details Stored:**
- `id` - Collection ID
- `uid` - Collection UID (userId-collectionId)
- `name` - Collection name with timestamp
- `workspaceId` - Workspace where collection was created
- `createdAt` - ISO timestamp of creation

#### CreateSourceSpec

Creates a new OpenAPI 3.0 specification specifically for transformations testing.

**Purpose:** Provides a dedicated test spec for transformations operations, independent of other test suites.

**Persists to:** `transformations.sourceSpec` in `test-ids.json`

**Details Stored:**
- `id` - Spec ID
- `name` - Spec name with timestamp
- `workspaceId` - Workspace where spec was created
- `type` - Spec type (OPENAPI:3.0)
- `createdAt` - ISO timestamp of creation

### Transformation Direction Groups

The suite is organized into two main transformation direction groups:

### 1. spec-to-collection

Tests transformations from specs to collections (generating collections from specs and syncing collections with specs).

#### Test 1: createSpecGeneration

Generates a collection from the transformations source spec.

**Test Cases:**
- `1. createSpecGeneration - should generate a collection from spec` - Generates a Postman collection from an OpenAPI spec

**Prerequisites:**
- Transformations source spec must exist (created by `CreateSourceSpec` test)

**Persists:**
- `transformations.sourceSpec.generatedCollection` - Contains taskId, url, name

#### Test 2: createSpecGeneration - should fail with minimal params

Tests error handling when generation is called without required options.

**Test Cases:**
- `2. createSpecGeneration - should fail with minimal params (no options)` - Validates that generation fails without proper options

**Prerequisites:**
- Transformations source spec must exist

#### Test 3: getSpecTaskStatus

Gets the status of the collection generation task once.

**Test Cases:**
- `3. getSpecTaskStatus - should get status of generation task` - Retrieves the current status of the generation task

**Prerequisites:**
- Transformations source spec must exist
- Generation task must have been created (test 1)

#### Test 4: getSpecTaskStatus - Poll until complete

Polls the generation task status until completion and extracts the generated collection ID.

**Test Cases:**
- `4. getSpecTaskStatus - Poll until complete` - Polls every 5 seconds for up to 30 seconds until the task completes

**Prerequisites:**
- Transformations source spec must exist
- Generation task must have been created (test 1)

**Persists:**
- `transformations.sourceSpec.generatedCollection.id` - The ID of the generated collection

#### Test 5: getSpecGenerations

Retrieves the list of all collections generated from the transformations source spec.

**Test Cases:**
- `5. getSpecGenerations - should retrieve generated collections list` - Gets all generated collections and verifies their structure

**Prerequisites:**
- Transformations source spec must exist
- At least one collection should have been generated (test 4)

#### Test 6: getSpecGenerations - should support pagination

Tests pagination functionality for retrieving generated collections.

**Test Cases:**
- `6. getSpecGenerations - should support pagination with limit` - Tests limit parameter for pagination

**Prerequisites:**
- Transformations source spec must exist

#### syncCollectionWithSpec

Tests the synchronization of a collection with a spec (updating the collection based on spec changes).

**Test Cases:**
- `7. should sync collection with generated spec` - Tests syncing a collection with a spec
- `8. should handle error for non-existent collection` - Validates error handling for invalid collection IDs
- `9. should handle error for non-existent spec` - Validates error handling for invalid spec IDs

**Prerequisites:**
- Collection must exist (created in collections functional tests)
- Spec must exist
- User ID must be available

**Note:** This endpoint only works with collections that were originally generated from the spec.

### 2. collection-to-spec

Tests transformations from collections to specs (generating specs from collections and syncing specs with collections).

#### Test 1: createCollectionGeneration

Creates a spec from the transformations source collection.

**Test Cases:**
- `1. createCollectionGeneration - should generate spec from collection` - Generates an OpenAPI 3.0 spec from the transformations source collection

**Prerequisites:**
- Transformations source collection must exist (created by `CreateSourceCollection` test)
- User ID must be available

**Persists:**
- `transformations.sourceCollection.generatedSpec` - Contains taskId, url, name, type, format

#### Test 2: getCollectionTaskStatus

Gets the status of the spec generation task once.

**Test Cases:**
- `2. getCollectionTaskStatus - should get status of generation task` - Retrieves the current status of the generation task

**Prerequisites:**
- Transformations source collection must exist
- Generation task must have been created (test 1)

#### Test 3: getCollectionTaskStatus - Poll until complete

Polls the generation task status until completion and extracts the generated spec ID.

**Test Cases:**
- `3. getCollectionTaskStatus - Poll until complete` - Polls every 5 seconds for up to 30 seconds until the task completes

**Prerequisites:**
- Transformations source collection must exist
- Generation task must have been created (test 1)

**Persists:**
- `transformations.sourceCollection.generatedSpec.id` - The ID of the generated spec

#### Test 4: getCollectionGenerations

Retrieves the list of all specs generated from the transformations source collection.

**Test Cases:**
- `4. getCollectionGenerations - should retrieve generated specs list` - Gets all generated specs and verifies their structure

**Prerequisites:**
- Transformations source collection must exist
- At least one spec should have been generated (test 3)

#### syncSpecWithCollection

Tests the synchronization of a spec with a collection (updating the spec based on collection changes).

**Test Cases:**
- `5. should sync generated spec with source collection` - Tests syncing a spec with a collection
- `6. should handle error for non-existent spec` - Validates error handling for invalid spec IDs

**Prerequisites:**
- Collection must exist (created in collections functional tests)
- Spec must exist
- User ID must be available

**Note:** This endpoint only works with specs that were originally generated from the collection.

## Running the Tests

### Standalone Execution

```bash
# Run the transformations test suite
npm test -- src/transformations/__tests__/functional.test.js

# Run with verbose output
npm test -- src/transformations/__tests__/functional.test.js --verbose

# Run specific transformation direction
npm test -- src/transformations/__tests__/functional.test.js --testNamePattern="spec-to-collection"
npm test -- src/transformations/__tests__/functional.test.js --testNamePattern="collection-to-spec"

# Run specific test group
npm test -- src/transformations/__tests__/functional.test.js --testNamePattern="syncSpecWithCollection"
npm test -- src/transformations/__tests__/functional.test.js --testNamePattern="syncCollectionWithSpec"
```

### As Part of All-Up Tests

The transformations tests run as Phase 7 in the all-up functional test suite:

```bash
npm run test:all-up
```

## Prerequisites

### Environment Setup

1. **API Key**: Set the `POSTMAN_API_KEY_POSTMAN` environment variable:
   ```bash
   export POSTMAN_API_KEY_POSTMAN=your_api_key_here
   ```

2. **Minimum Test Resources**: The following resources must exist in `test-ids.json`:
   - `userId` - The authenticated user's ID
   - `workspace.id` - A valid workspace ID

3. **For Sync Operations**: Additional resources required for sync tests:
   - `collection.id` - A valid collection ID
   - `collection.generatedSpec.id` - ID of a spec generated from the collection

### Creating Prerequisites

The transformations suite automatically creates its own dedicated resources (`CreateSourceCollection` and `CreateSourceSpec` tests), but sync operation tests require additional prerequisites:

```bash
# Run all-up tests to create all prerequisites (recommended)
npm run test:all-up

# OR run specific test suites:

# 1. Create workspace and userId
npm test -- src/workspaces/__tests__/functional.test.js

# 2. Run collections tests to create collection and generate spec (for sync tests)
npm test -- src/collections/__tests__/01-collections-functional.test.js

# Make sure test 11b completes successfully to populate collection.generatedSpec.id
```

## Expected Behavior

### Successful Sync

When prerequisites are met and the sync is successful:

```
✓ Spec sync started with taskId: 66ae9950-0869-4e65-96b0-1e0e47e771af
  Poll status at: /specs/{specId}/tasks/{taskId}
```

The test will:
- Return HTTP 202 (Accepted)
- Provide a `taskId` for tracking
- Provide a `url` for polling status
- Persist task info to `test-ids.json`

### Known API Limitations

The synchronization endpoints have specific requirements:

1. **syncSpecWithCollection**: Only works with specs that were originally generated from the given collection
   - Returns 400 if the spec wasn't generated from this collection
   - Returns 404 if spec or collection doesn't exist

2. **syncCollectionWithSpec**: Only works with collections when syncing with specs
   - Returns 400 if the collection requirements aren't met
   - Returns 403 if permissions are insufficient
   - Returns 404 if collection or spec doesn't exist

The tests gracefully handle these limitations and will pass with informative console messages when these conditions are encountered.

## Test IDs Persistence

The transformations tests read from and write to `test-ids.json`:

### Required Fields (Read)
```json
{
  "userId": 34829850,
  "workspace": {
    "id": "workspace-id-123"
  },
  "collection": {
    "id": "abc-123-collection-id",
    "generatedSpec": {
      "id": "def-456-spec-id"
    }
  }
}
```

### Fields Written by Setup Tests
```json
{
  "transformations": {
    "sourceCollection": {
      "id": "collection-id-123",
      "uid": "userId-collectionId",
      "name": "Transformations Test Collection 1234567890",
      "workspaceId": "workspace-id-123",
      "createdAt": "2025-12-24T10:30:00.000Z"
    },
    "sourceSpec": {
      "id": "spec-id-456",
      "name": "Transformations Test Spec 1234567890",
      "workspaceId": "workspace-id-123",
      "type": "OPENAPI:3.0",
      "createdAt": "2025-12-24T10:30:01.000Z"
    }
  }
}
```

### Fields Written by Sync Tests
```json
{
  "collection": {
    "syncSpecTask": {
      "taskId": "task-id-123",
      "url": "/specs/{specId}/tasks/{taskId}",
      "collectionUid": "userId-collectionId",
      "createdAt": "2025-12-24T10:30:00.000Z"
    },
    "syncCollectionTask": {
      "taskId": "task-id-456",
      "url": "/collections/{uid}/tasks/{taskId}",
      "specId": "spec-id-789",
      "createdAt": "2025-12-24T10:31:00.000Z"
    }
  }
}
```

## API Endpoints Tested

### 1. PUT `/specs/{specId}/synchronizations`

**Function**: `syncSpecWithCollection(specId, collectionUid)`

Syncs a spec with a collection. Only works with specs generated from the collection.

**Parameters:**
- `specId` - The spec's ID
- `collectionUid` - The collection's UID (userId-collectionId format)

**Response:** 202 Accepted with `taskId` and `url`

### 2. PUT `/collections/{collectionUid}/synchronizations`

**Function**: `syncCollectionWithSpec(userId, collectionId, specId)`

Syncs a collection with a spec.

**Parameters:**
- `userId` - The user's ID
- `collectionId` - The collection's ID
- `specId` - The spec's ID to sync with

**Response:** 202 Accepted with `taskId` and `url`

## Troubleshooting

### Test Skipped - No Prerequisites

If you see:
```
Skipping syncSpecWithCollection test - no generated spec ID available
```

**Solution**: Run the collections functional tests first to generate a spec:
```bash
npm test -- src/collections/__tests__/01-collections-functional.test.js
```

Ensure test 11b (`getCollectionTaskStatus - Poll until complete`) completes successfully.

### 400 Bad Request

If the sync returns 400:

**Cause**: The relationship between spec and collection doesn't meet API requirements
- For `syncSpecWithCollection`: The spec wasn't generated from this collection
- For `syncCollectionWithSpec`: The collection doesn't meet sync requirements

**Expected**: This is a known API limitation and the test will pass with an informative message

### 403 Forbidden

**Cause**: Insufficient permissions to sync resources

**Solution**: Ensure your API key has the necessary permissions for the workspace/collection

### 404 Not Found

**Cause**: The specified resource (spec or collection) doesn't exist

**Solution**: 
1. Check `test-ids.json` for valid IDs
2. Verify resources exist in Postman
3. Re-run prerequisite tests to create resources

## Integration with CI/CD

The transformations tests are included in:

1. **All-Up Test Suite** (`all-up-functional.test.js`) - Phase 7
2. **GitHub Actions** (`.github/workflows/all-tests.yml`) - Runs as part of functional tests

The tests respect the existing `test-ids.json` artifact workflow and contribute sync task information.

## Best Practices

1. **Run After Collections Tests**: Always ensure collections tests complete before transformations
2. **Check Prerequisites**: Verify `test-ids.json` has required fields before running
3. **Handle Expected Errors**: The tests gracefully handle 400/403/404 responses
4. **Review Logs**: Check console output for detailed sync information
5. **Poll Task Status**: Use the returned `url` to check sync completion (not automated in these tests)

## Future Enhancements

Potential improvements:

- Add polling logic to wait for sync completion
- Validate sync results after completion
- Test sync with modified specs/collections
- Add performance benchmarks
- Test concurrent sync operations
- Add retry logic for transient failures

---

**Last Updated**: December 25, 2025

