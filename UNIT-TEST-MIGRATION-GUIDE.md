# Unit Test Migration Guide

This guide explains how to update unit tests after the UID parameter refactoring.

## Constants Available

The following test constants are exported from `src/core/__tests__/utils.unit.test.js`:

```javascript
const { DEFAULT_ID, DEFAULT_UID } = require('../../core/__tests__/utils.unit.test');

// DEFAULT_ID = '12345678-1234-1234-1234-123456789abc'  // Valid UUID format
// DEFAULT_UID = '12345678-12345678-1234-1234-1234-123456789abc'  // Valid UID format
```

## Function Signature Changes

### Collections Module

| Function | Old Signature | New Signature |
|----------|--------------|---------------|
| `getCollectionComments` | `(userId, collectionId)` | `(collectionUid)` |
| `createCollectionComment` | `(userId, collectionId, commentData)` | `(collectionUid, commentData)` |
| `updateCollectionComment` | `(userId, collectionId, commentId, commentData)` | `(collectionUid, commentId, commentData)` |
| `deleteCollectionComment` | `(userId, collectionId, commentId)` | `(collectionUid, commentId)` |
| `getFolderComments` | `(userId, collectionId, folderId)` | `(collectionUid, folderUid)` |
| `createFolderComment` | `(userId, collectionId, folderId, commentData)` | `(collectionUid, folderUid, commentData)` |
| `updateFolderComment` | `(userId, collectionId, folderId, commentId, commentData)` | `(collectionUid, folderUid, commentId, commentData)` |
| `deleteFolderComment` | `(userId, collectionId, folderId, commentId)` | `(collectionUid, folderUid, commentId)` |
| `syncCollectionWithSpec` | `(userId, collectionId, specId)` | `(collectionUid, specId)` |
| `getCollectionTags` | `(userId, collectionId)` | `(collectionUid)` |
| `updateCollectionTags` | `(userId, collectionId, tags)` | `(collectionUid, tags)` |
| `createCollectionGeneration` | `(userId, collectionId, elementType, name, type, format)` | `(collectionUid, elementType, name, type, format)` |
| `getCollectionGenerations` | `(userId, collectionId, elementType)` | `(collectionUid, elementType)` |
| `getCollectionTaskStatus` | `(userId, collectionId, taskId)` | `(collectionUid, taskId)` |

### Requests Module

| Function | Old Signature | New Signature |
|----------|--------------|---------------|
| `getRequestComments` | `(userId, collectionId, requestId)` | `(collectionUid, requestUid)` |
| `createRequestComment` | `(userId, collectionId, requestId, commentData)` | `(collectionUid, requestUid, commentData)` |
| `updateRequestComment` | `(userId, collectionId, requestId, commentId, commentData)` | `(collectionUid, requestUid, commentId, commentData)` |
| `deleteRequestComment` | `(userId, collectionId, requestId, commentId)` | `(collectionUid, requestUid, commentId)` |

### Responses Module

| Function | Old Signature | New Signature |
|----------|--------------|---------------|
| `getResponseComments` | `(userId, collectionId, responseId)` | `(collectionUid, responseUid)` |
| `createResponseComment` | `(userId, collectionId, responseId, commentData)` | `(collectionUid, responseUid, commentData)` |
| `updateResponseComment` | `(userId, collectionId, responseId, commentId, commentData)` | `(collectionUid, responseUid, commentId, commentData)` |
| `deleteResponseComment` | `(userId, collectionId, responseId, commentId)` | `(collectionUid, responseUid, commentId)` |

## Migration Examples

### Before (OLD):
```javascript
describe('collection comments', () => {
  test('should get comments', async () => {
    const userId = '12345678';
    const collectionId = 'd4dd588d-111f-4651-b64d-463e4b093f4b';
    
    const mockResponse = { status: 200, data: { comments: [] } };
    axios.request.mockResolvedValue(mockResponse);

    await getCollectionComments(userId, collectionId);

    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://api.getpostman.com/collections/12345678-d4dd588d-111f-4651-b64d-463e4b093f4b/comments'
      })
    );
  });
});
```

### After (NEW):
```javascript
const { DEFAULT_ID, DEFAULT_UID } = require('../../core/__tests__/utils.unit.test');

// Define test-specific constants
const DEFAULT_COLLECTION_UID = DEFAULT_UID;

describe('collection comments', () => {
  test('should get comments', async () => {
    const mockResponse = { status: 200, data: { comments: [] } };
    axios.request.mockResolvedValue(mockResponse);

    await getCollectionComments(DEFAULT_COLLECTION_UID);

    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: `https://api.getpostman.com/collections/${DEFAULT_COLLECTION_UID}/comments`
      })
    );
  });
});
```

## Recommended Test Constants

```javascript
const { DEFAULT_ID, DEFAULT_UID } = require('../../core/__tests__/utils.unit.test');

// Module-specific constants
const DEFAULT_COLLECTION_UID = DEFAULT_UID; // '12345678-12345678-1234-1234-1234-123456789abc'
const DEFAULT_FOLDER_UID = '12345678-87654321-1234-1234-1234-123456789abc';
const DEFAULT_REQUEST_UID = '12345678-abcdef12-1234-1234-1234-123456789abc';
const DEFAULT_RESPONSE_UID = '12345678-fedcba98-1234-1234-1234-123456789abc';
const DEFAULT_COMMENT_ID = DEFAULT_ID;
const DEFAULT_TASK_ID = DEFAULT_ID;
const DEFAULT_SPEC_ID = DEFAULT_ID;
```

## URL Pattern Updates

- **ID endpoints** (unchanged): `/collections/{collectionId}` 
- **UID endpoints** (changed): `/collections/{collectionUid}/comments`

When updating URL expectations in tests:

**Before:**
```javascript
url: 'https://api.getpostman.com/collections/12345678-d4dd588d-111f-4651-b64d-463e4b093f4b/comments'
```

**After:**
```javascript
url: `https://api.getpostman.com/collections/${DEFAULT_COLLECTION_UID}/comments`
```

## Step-by-Step Migration Process

1. **Import constants** at the top of your test file
2. **Define module-specific constants** (collection UID, folder UID, etc.)
3. **Update function calls** to use new signatures
4. **Replace hardcoded IDs/UIDs** with constants
5. **Update URL expectations** to use template literals with constants
6. **Run tests** and fix any remaining issues

## Testing the Migration

Run unit tests to ensure everything works:

```bash
npm test
```

Check for validation errors - the new SDK validates all IDs and UIDs, so invalid formats will throw clear error messages.

## Notes

- All functions now validate their ID/UID parameters
- UIDs must match format: `{userId}-{objectId}` (e.g., `12345678-12345678-1234-1234-1234-123456789abc`)
- IDs must match UUID format: `{uuid}` (e.g., `12345678-1234-1234-1234-123456789abc`)
- Invalid formats will throw descriptive errors immediately

