# Postman SDK API Reference

[![npm version](https://img.shields.io/npm/v/@bidnessforb/postman-sdk.svg)](https://www.npmjs.com/package/@bidnessforb/postman-sdk)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

> **Auto-generated API documentation** from JSDoc comments. Last generated: 2025-12-26

## Overview

This SDK provides a comprehensive interface to the Postman API, supporting all major resource types including collections, workspaces, API specifications, environments, mock servers, and more.

**Installation:**
```bash
npm install @bidnessforb/postman-sdk
```

**Quick Start:**
```javascript
const postman = require('@bidnessforb/postman-sdk');

// Get all collections in a workspace
const collections = await postman.collections.getCollections('workspace-id');

// Create a new workspace
const workspace = await postman.workspaces.createWorkspace('My Workspace', 'team');
```

**Important Notes:**
- All functions return Promises that resolve to Axios responses
- API key must be set via `POSTMAN_API_KEY_POSTMAN` environment variable
- Comment endpoints require UIDs in format: `userId-objectId`
- Refer to [Postman API Documentation](https://learning.postman.com/docs/developer/postman-api/intro-api/) for detailed API behavior

---

### Table of Contents

*Quick Links: [Collections](#collections) • [Requests](#requests) • [Responses](#responses) • [Workspaces](#workspaces) • [Specs](#specs) • [Environments](#environments) • [Mocks](#mocks) • [Tags](#tags) • [Users](#users) • [Core Utilities](#core-utilities)*

---

<details open>
<summary><strong>Collections</strong> - Manage Postman collections, folders, and comments</summary>

| Function | Description |
|----------|-------------|
| [createCollection][1] | Creates a collection |
| [createCollectionComment][4] | Creates a comment on a collection |
| [createCollectionGeneration][7] | Generates a spec from a collection |
| [createFolder][10] | Creates a folder in a collection |
| [createFolderComment][13] | Creates a comment on a folder |
| [deleteCollection][16] | Deletes a collection |
| [deleteCollectionComment][19] | Deletes a comment from a collection |
| [deleteFolder][22] | Deletes a folder in a collection |
| [deleteFolderComment][25] | Deletes a comment from a folder |
| [getCollection][28] | Gets a collection by ID |
| [getCollectionComments][31] | Gets all comments left by users in a collection |
| [getCollectionGenerations][34] | Gets the list of specs generated from a collection |
| [getCollections][37] | Gets all collections |
| [getCollectionTags][40] | Gets all tags associated with a collection |
| [getCollectionTaskStatus][43] | Gets the status of a collection generation task |
| [getFolder][46] | Gets information about a folder in a collection |
| [getFolderComments][49] | Gets all comments left by users in a folder |
| [modifyCollection][52] | Updates part of a collection |
| [syncCollectionWithSpec][55] | Sync collection with spec |
| [updateCollection][58] | Replaces a collection's data |
| [updateCollectionComment][61] | Updates a comment on a collection |
| [updateCollectionTags][64] | Updates all tags associated with a collection (replaces existing tags) |
| [updateFolder][67] | Updates a folder in a collection |
| [updateFolderComment][70] | Updates a comment on a folder |

</details>

<details open>
<summary><strong>Requests</strong> - Manage requests within collections</summary>

| Function | Description |
|----------|-------------|
| [createRequest][73] | Creates a request in a collection |
| [createRequestComment][76] | Creates a comment on a request |
| [deleteRequest][79] | Deletes a request in a collection |
| [deleteRequestComment][82] | Deletes a comment from a request |
| [getRequest][85] | Gets information about a request in a collection |
| [getRequestComments][88] | Gets all comments left by users in a request |
| [updateRequest][91] | Updates a request in a collection |
| [updateRequestComment][94] | Updates a comment on a request |

</details>

<details open>
<summary><strong>Responses</strong> - Manage responses for requests</summary>

| Function | Description |
|----------|-------------|
| [createResponse][97] | Creates a response in a collection |
| [createResponseComment][100] | Creates a comment on a response |
| [deleteResponse][103] | Deletes a response in a collection |
| [deleteResponseComment][106] | Deletes a comment from a response |
| [getResponse][109] | Gets information about a response in a collection |
| [getResponseComments][112] | Gets all comments left by users in a response |
| [updateResponse][115] | Updates a response in a collection |
| [updateResponseComment][118] | Updates a comment on a response |

</details>

<details open>
<summary><strong>Workspaces</strong> - Manage Postman workspaces</summary>

| Function | Description |
|----------|-------------|
| [createWorkspace][121] | Creates a new workspace |
| [deleteWorkspace][123] | Deletes an existing workspace |
| [getWorkspace][125] | Gets information about a workspace |
| [getWorkspaces][127] | Gets all workspaces |
| [getWorkspaceTags][129] | Gets all tags associated with a workspace |
| [updateWorkspace][131] | Updates a workspace |
| [updateWorkspaceTags][133] | Updates a workspace's associated tags |

</details>

<details open>
<summary><strong>Specs</strong> - Manage API specifications (OpenAPI, AsyncAPI)</summary>

| Function | Description |
|----------|-------------|
| [createSpec][136] | Creates an API specification in Postman's Spec Hub |
| [createSpecFile][138] | Creates an API specification file |
| [createSpecGeneration][140] | Generates a collection from an API specification |
| [deleteSpec][142] | Deletes an API specification |
| [deleteSpecFile][144] | Deletes a file in an API specification |
| [getSpec][146] | Gets information about a specific API specification |
| [getSpecDefinition][148] | Gets the complete contents of an API specification's definition |
| [getSpecFile][150] | Gets the contents of an API specification's file |
| [getSpecFiles][152] | Gets all the files in an API specification |
| [getSpecGenerations][154] | Gets a list of collections generated from a spec |
| [getSpecs][156] | Gets all API specifications in a workspace |
| [getSpecTaskStatus][158] | Gets the status of an asynchronous API specification task |
| [modifySpec][160] | Updates an API specification's properties |
| [modifySpecFile][162] | Updates an API specification's file |
| [syncSpecWithCollection][164] | Syncs a spec with a collection |

</details>

<details open>
<summary><strong>Environments</strong> - Manage Postman environments and variables</summary>

| Function | Description |
|----------|-------------|
| [createEnvironment][166] | Creates a new environment |
| [deleteEnvironment][168] | Deletes an environment |
| [getEnvironment][170] | Gets information about an environment |
| [getEnvironments][172] | Gets all environments |
| [modifyEnvironment][174] | Updates an environment using JSON Patch operations (RFC 6902) |

</details>

<details open>
<summary><strong>Mocks</strong> - Manage mock servers and server responses</summary>

| Function | Description |
|----------|-------------|
| [createMock][177] | Creates a mock server in a collection |
| [createMockPublish][179] | Publishes a mock server (sets Access Control to public) |
| [createMockServerResponse][181] | Creates a server response for a mock server |
| [deleteMock][183] | Deletes a mock server |
| [deleteMockServerResponse][185] | Deletes a mock server's server response |
| [deleteMockUnpublish][187] | Unpublishes a mock server (sets Access Control to private) |
| [getMock][189] | Gets information about a mock server |
| [getMockCallLogs][191] | Gets a mock server's call logs |
| [getMocks][193] | Gets all mock servers |
| [getMockServerResponse][195] | Gets information about a server response |
| [getMockServerResponses][197] | Gets all of a mock server's server responses |
| [updateMock][199] | Updates a mock server |
| [updateMockServerResponse][201] | Updates a mock server's server response |

</details>

<details open>
<summary><strong>Tags</strong> - Query and manage tags across resources</summary>

| Function | Description |
|----------|-------------|
| [getTagEntities][203] | Gets Postman elements (entities) by a given tag |

</details>

<details open>
<summary><strong>Users</strong> - Get authenticated user information</summary>

| Function | Description |
|----------|-------------|
| [getAuthenticatedUser][206] | Gets information about the authenticated user |

</details>

<details open>
<summary><strong>Core Utilities</strong> - Internal utility functions used across modules</summary>

| Function | Description |
|----------|-------------|
| [buildAxiosConfig][207] | Builds an Axios config for Postman API requests |
| [buildQueryString][209] | Builds a query string from parameters object |
| [executeRequest][211] | Executes an axios request and throws an error for non-2xx responses. |
| [getContentFS][213] | Reads file content from the filesystem and returns it in the format expected by Postman API |
| [utils][215] | Builds a UID from a user ID and an object ID |
| [validateId][217] | Validates a standard ID (UUID format) |
| [validateUid][219] | Validates a UID (userId-UUID format) |

</details>


## getCollections

Gets all collections
Postman API endpoint and method: GET /collections

### Parameters

*   `workspaceId` **[string][222]?** The workspace's ID (optional, default `null`)
*   `name` **[string][222]?** Filter results by collections that match the given name (optional, default `null`)
*   `limit` **[number][223]?** The maximum number of rows to return in the response (optional, default `null`)
*   `offset` **[number][223]?** The zero-based offset of the first item to return (optional, default `null`)

### Examples

```javascript
// Get all collections in a workspace
const response = await getCollections('abc123def-456-789');
console.log(response.data.collections);
```

```javascript
// Get collections with pagination
const response = await getCollections('abc123def-456-789', null, 10, 0);
console.log(response.data.meta.total);
```

```javascript
// Filter collections by name
const response = await getCollections('abc123def-456-789', 'My API');
```

Returns **[Promise][224]** Axios response with collections array and meta information

## createCollection

Creates a collection
Postman API endpoint and method: POST /collections

### Parameters

*   `collection` **[Object][225]** The collection object following Postman Collection v2.1.0 schema

    *   `collection.info` **[string][222]** Information about the collection

        *   `collection.info.name` **[string][222]** The collection's name
        *   `collection.info.description` **[string][222]?** The collection's description
        *   `collection.info.schema` **[string][222]?** Schema version (e.g., '[https://schema.getpostman.com/json/collection/v2.1.0/collection.json][226]')
    *   `collection.item` **[Array][227]?** Array of folders and requests in the collection
*   `workspaceId` **[string][222]?** The workspace ID in which to create the collection. If not provided, creates in default workspace. (optional, default `null`)

### Examples

```javascript
// Create a simple collection
const response = await createCollection({
  info: {
    name: 'My API Collection',
    description: 'Collection for My API',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
  },
  item: []
});
```

```javascript
// Create a collection in a specific workspace
const response = await createCollection(
  { info: { name: 'Team API' } },
  'workspace-id-123'
);
```

Returns **[Promise][224]** Axios response with collection id and uid

## getCollection

Gets a collection by ID
Postman API endpoint and method: GET /collections/{collectionId}

### Parameters

*   `collectionId` **[string][222]** The collection's ID
*   `access_key` **[string][222]?** A collection's read-only access key for public collections (optional, default `null`)
*   `model` **[string][222]?** Return minimal model ('minimal' returns only root-level IDs) (optional, default `null`)

### Examples

```javascript
// Get a collection by ID
const response = await getCollection('abc123-def456-789');
console.log(response.data.collection);
```

```javascript
// Get a public collection using access key
const response = await getCollection('collection-id', 'PMAK-123abc');
```

```javascript
// Get minimal collection model (only root-level IDs)
const response = await getCollection('collection-id', null, 'minimal');
```

Returns **[Promise][224]** Axios response with full collection data

## updateCollection

Replaces a collection's data
Postman API endpoint and method: PUT /collections/{collectionId}

### Parameters

*   `collectionId` **[string][222]** The collection's ID
*   `collection` **[Object][225]** The complete collection object following Postman Collection v2.1.0 schema

    *   `collection.info` **[Object][225]** Information about the collection

        *   `collection.info.name` **[string][222]** The collection's name
        *   `collection.info.description` **[string][222]?** The collection's description
    *   `collection.item` **[Array][227]?** Array of folders and requests in the collection
*   `prefer` **[string][222]?** Set to 'respond-async' for asynchronous update (returns immediately) (optional, default `null`)

### Examples

```javascript
// Replace a collection's data
const response = await updateCollection('collection-id-123', {
  info: {
    name: 'Updated Collection Name',
    description: 'Updated description',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
  },
  item: []
});
```

```javascript
// Async update (returns immediately without waiting)
const response = await updateCollection(
  'collection-id-123',
  collectionData,
  'respond-async'
);
```

Returns **[Promise][224]** Axios response with updated collection

## modifyCollection

Updates part of a collection
Postman API endpoint and method: PATCH /collections/{collectionId}

### Parameters

*   `collectionId` **[string][222]** The collection's ID
*   `collection` **[Object][225]** Partial collection object with only the fields to update

    *   `collection.info` **[Object][225]?** Collection info to update

        *   `collection.info.name` **[string][222]?** Update the collection's name
        *   `collection.info.description` **[string][222]?** Update the collection's description

### Examples

```javascript
// Update only the collection name
const response = await modifyCollection('collection-id-123', {
  info: {
    name: 'New Collection Name'
  }
});
```

```javascript
// Update collection description
const response = await modifyCollection('collection-id-123', {
  info: {
    description: 'Updated description text'
  }
});
```

Returns **[Promise][224]** Axios response with updated collection

## deleteCollection

Deletes a collection
Postman API endpoint and method: DELETE /collections/{collectionId}

### Parameters

*   `collectionId` **[string][222]** The collection's ID

### Examples

```javascript
// Delete a collection
const response = await deleteCollection('collection-id-123');
console.log(response.data.collection);
```

Returns **[Promise][224]** Axios response with deletion confirmation

## createFolder

Creates a folder in a collection
Postman API endpoint and method: POST /collections/{collectionId}/folders

### Parameters

*   `collectionId` **[string][222]** The collection's ID
*   `folderData` **[Object][225]** The folder data

    *   `folderData.name` **[string][222]** (Required) The folder's name
    *   `folderData.description` **[string][222]?** The folder's description
    *   `folderData.parentFolderId` **[string][222]?** The ID of the parent folder to nest this folder in

### Examples

```javascript
// Create a simple folder
const response = await createFolder('collection-id-123', {
  name: 'API Endpoints'
});
```

```javascript
// Create a folder with description
const response = await createFolder('collection-id-123', {
  name: 'Authentication',
  description: 'Endpoints related to user authentication'
});
```

```javascript
// Create a nested folder
const response = await createFolder('collection-id-123', {
  name: 'Sub-folder',
  parentFolderId: 'parent-folder-id'
});
```

Returns **[Promise][224]** Axios response with created folder data

## getFolder

Gets information about a folder in a collection
Postman API endpoint and method: GET /collections/{collectionId}/folders/{folderId}

### Parameters

*   `collectionId` **[string][222]** The collection's ID
*   `folderId` **[string][222]** The folder's ID
*   `ids` **[string][222]?** Set to 'true' to return only folder item IDs (optional, default `null`)
*   `uid` **[string][222]?** Set to 'true' to return full UIDs for folder items (optional, default `null`)
*   `populate` **[string][222]?** Set to 'true' to return full folder items with details (optional, default `null`)

### Examples

```javascript
// Get folder information
const response = await getFolder('collection-id-123', 'folder-id-456');
console.log(response.data.data);
```

```javascript
// Get folder with only item IDs
const response = await getFolder('collection-id-123', 'folder-id-456', 'true');
```

```javascript
// Get folder with full item details
const response = await getFolder(
  'collection-id-123',
  'folder-id-456',
  null,
  null,
  'true'
);
```

Returns **[Promise][224]** Axios response with folder data

## updateFolder

Updates a folder in a collection
Postman API endpoint and method: PUT /collections/{collectionId}/folders/{folderId}

### Parameters

*   `collectionId` **[string][222]** The collection's ID
*   `folderId` **[string][222]** The folder's ID
*   `folderData` **[Object][225]** The folder data to update

    *   `folderData.name` **[string][222]?** The folder's new name
    *   `folderData.description` **[string][222]?** The folder's new description

### Examples

```javascript
// Update folder name
const response = await updateFolder(
  'collection-id-123',
  'folder-id-456',
  { name: 'Updated Folder Name' }
);
```

```javascript
// Update folder name and description
const response = await updateFolder(
  'collection-id-123',
  'folder-id-456',
  {
    name: 'User Management',
    description: 'All user-related API endpoints'
  }
);
```

Returns **[Promise][224]** Axios response with updated folder data

## deleteFolder

Deletes a folder in a collection
Postman API endpoint and method: DELETE /collections/{collectionId}/folders/{folderId}

### Parameters

*   `collectionId` **[string][222]** The collection's ID
*   `folderId` **[string][222]** The folder's ID

### Examples

```javascript
// Delete a folder
const response = await deleteFolder('collection-id-123', 'folder-id-456');
console.log(response.data.folder);
```

Returns **[Promise][224]** Axios response with deletion confirmation

## getCollectionComments

Gets all comments left by users in a collection
Postman API endpoint and method: GET /collections/{collectionUid}/comments

### Parameters

*   `collectionUid` **[string][222]** The collection's UID (format: userId-collectionId)

### Examples

```javascript
// Get all comments for a collection
const response = await getCollectionComments('12345678-abc-def-123');
console.log(response.data.data);
```

Returns **[Promise][224]** Axios response with array of comments

## createCollectionComment

Creates a comment on a collection
Postman API endpoint and method: POST /collections/{collectionUid}/comments

### Parameters

*   `collectionUid` **[string][222]** The collection's UID (format: userId-collectionId)
*   `commentData` **[Object][225]** The comment data

    *   `commentData.body` **[string][222]** (Required) The contents of the comment. Max 10,000 characters.
    *   `commentData.threadId` **[number][223]?** The comment's thread ID. Include this to create a reply on an existing comment.
    *   `commentData.tags` **[Object][225]?** Information about users tagged in the body comment

        *   `commentData.tags.userName` **[Object][225]** Tagged user info. Key is the user's Postman username (e.g., '@user-postman')

            *   `commentData.tags.userName.type` **[string][222]** Must be 'user'
            *   `commentData.tags.userName.id` **[string][222]** The user's ID

### Examples

```javascript
// Create a simple comment
const response = await createCollectionComment(
  '12345678-abc-def-123',
  {
    body: 'This collection is well organized!'
  }
);
```

```javascript
// Create a comment with user tags
const response = await createCollectionComment(
  '12345678-abc-def-123',
  {
    body: 'Great work @alex-cruz!',
    tags: {
      '@alex-cruz': {
        type: 'user',
        id: '87654321'
      }
    }
  }
);
```

```javascript
// Reply to an existing comment thread
const response = await createCollectionComment(
  '12345678-abc-def-123',
  {
    body: 'I agree with this suggestion.',
    threadId: 12345
  }
);
```

Returns **[Promise][224]** Axios response with created comment data

## updateCollectionComment

Updates a comment on a collection
Postman API endpoint and method: PUT /collections/{collectionUid}/comments/{commentId}

### Parameters

*   `collectionUid` **[string][222]** The collection's UID (format: userId-collectionId)
*   `commentId` **[string][222]** The comment's ID
*   `commentData` **[Object][225]** The comment data to update

    *   `commentData.body` **[string][222]?** The updated contents of the comment. Max 10,000 characters.
    *   `commentData.tags` **[Object][225]?** Updated information about users tagged in the body comment

        *   `commentData.tags.userName` **[Object][225]** Tagged user info. Key is the user's Postman username (e.g., '@user-postman')

            *   `commentData.tags.userName.type` **[string][222]** Must be 'user'
            *   `commentData.tags.userName.id` **[string][222]** The user's ID

### Examples

```javascript
// Update a comment's body
const response = await updateCollectionComment(
  '12345678-abc-def-123',
  '12345',
  {
    body: 'Updated comment text'
  }
);
```

```javascript
// Update a comment with new tags
const response = await updateCollectionComment(
  '12345678-abc-def-123',
  '12345',
  {
    body: 'Updated text with @new-user',
    tags: {
      '@new-user': {
        type: 'user',
        id: '11111111'
      }
    }
  }
);
```

Returns **[Promise][224]** Axios response with updated comment data

## deleteCollectionComment

Deletes a comment from a collection
Postman API endpoint and method: DELETE /collections/{collectionUid}/comments/{commentId}

### Parameters

*   `collectionUid` **[string][222]** The collection's UID (format: userId-collectionId)
*   `commentId` **[string][222]** The comment's ID

### Examples

```javascript
// Delete a comment
const response = await deleteCollectionComment(
  '12345678-abc-def-123',
  '12345'
);
console.log(response.data.comment);
```

Returns **[Promise][224]** Axios response with deletion confirmation

## getFolderComments

Gets all comments left by users in a folder
Postman API endpoint and method: GET /collections/{collectionUid}/folders/{folderUid}/comments

### Parameters

*   `collectionUid` **[string][222]** The collection's UID (format: userId-collectionId)
*   `folderUid` **[string][222]** The folder's UID (format: userId-folderId)

### Examples

```javascript
// Get all comments for a folder
const response = await getFolderComments(
  '12345678-abc-def-123',
  '12345678-folder-id-456'
);
console.log(response.data.data);
```

Returns **[Promise][224]** Axios response with array of comments

## createFolderComment

Creates a comment on a folder
Postman API endpoint and method: POST /collections/{collectionUid}/folders/{folderUid}/comments

### Parameters

*   `collectionUid` **[string][222]** The collection's UID (format: userId-collectionId)
*   `folderUid` **[string][222]** The folder's UID (format: userId-folderId)
*   `commentData` **[Object][225]** The comment data

    *   `commentData.body` **[string][222]** (Required) The contents of the comment. Max 10,000 characters.
    *   `commentData.threadId` **[number][223]?** The comment's thread ID. Include this to create a reply on an existing comment.
    *   `commentData.tags` **[Object][225]?** Information about users tagged in the body comment

        *   `commentData.tags.userName` **[Object][225]** Tagged user info. Key is the user's Postman username (e.g., '@user-postman')

            *   `commentData.tags.userName.type` **[string][222]** Must be 'user'
            *   `commentData.tags.userName.id` **[string][222]** The user's ID

### Examples

```javascript
// Create a simple comment
const response = await createFolderComment(
  '12345678-abc-def-123',
  '12345678-folder-id-456',
  {
    body: 'This looks great!'
  }
);
```

```javascript
// Create a comment with user tags
const response = await createFolderComment(
  '12345678-abc-def-123',
  '12345678-folder-id-456',
  {
    body: 'Great work @alex-cruz!',
    tags: {
      '@alex-cruz': {
        type: 'user',
        id: '87654321'
      }
    }
  }
);
```

```javascript
// Reply to an existing comment thread
const response = await createFolderComment(
  '12345678-abc-def-123',
  '12345678-folder-id-456',
  {
    body: 'I agree with this suggestion.',
    threadId: 12345
  }
);
```

Returns **[Promise][224]** Axios response

## updateFolderComment

Updates a comment on a folder
Postman API endpoint and method: PUT /collections/{collectionUid}/folders/{folderUid}/comments/{commentId}

### Parameters

*   `collectionUid` **[string][222]** The collection's UID (format: userId-collectionId)
*   `folderUid` **[string][222]** The folder's UID (format: userId-folderId)
*   `commentId` **[string][222]** The comment's ID
*   `commentData` **[Object][225]** The comment data to update

    *   `commentData.body` **[string][222]?** The updated contents of the comment. Max 10,000 characters.
    *   `commentData.tags` **[Object][225]?** Updated information about users tagged in the body comment

        *   `commentData.tags.userName` **[Object][225]** Tagged user info. Key is the user's Postman username (e.g., '@user-postman')

            *   `commentData.tags.userName.type` **[string][222]** Must be 'user'
            *   `commentData.tags.userName.id` **[string][222]** The user's ID

### Examples

```javascript
// Update a folder comment
const response = await updateFolderComment(
  '12345678-abc-def-123',
  '12345678-folder-id-456',
  '12345',
  {
    body: 'Updated comment text'
  }
);
```

```javascript
// Update with new tags
const response = await updateFolderComment(
  '12345678-abc-def-123',
  '12345678-folder-id-456',
  '12345',
  {
    body: 'Updated text with @new-user',
    tags: {
      '@new-user': {
        type: 'user',
        id: '11111111'
      }
    }
  }
);
```

Returns **[Promise][224]** Axios response with updated comment data

## deleteFolderComment

Deletes a comment from a folder
Postman API endpoint and method: DELETE /collections/{collectionUid}/folders/{folderUid}/comments/{commentId}

### Parameters

*   `collectionUid` **[string][222]** The collection's UID (format: userId-collectionId)
*   `folderUid` **[string][222]** The folder's UID (format: userId-folderId)
*   `commentId` **[string][222]** The comment's ID

### Examples

```javascript
// Delete a folder comment
const response = await deleteFolderComment(
  '12345678-abc-def-123',
  '12345678-folder-id-456',
  '12345'
);
console.log(response.data.comment);
```

Returns **[Promise][224]** Axios response with deletion confirmation

## syncCollectionWithSpec

Sync collection with spec
Postman API endpoint and method: PUT /collections/{collectionUid}/synchronizations

### Parameters

*   `collectionUid` **[string][222]** The collection's UID (format: userId-collectionId)
*   `specId` **[string][222]** The spec's ID to sync with

### Examples

```javascript
// Sync a collection with an API specification
const response = await syncCollectionWithSpec(
  '12345678-abc-def-123',
  'spec-id-456'
);
console.log(response.data);
```

Returns **[Promise][224]** Axios response with sync status

## getCollectionTags

Gets all tags associated with a collection
Postman API endpoint and method: GET /collections/{collectionUid}/tags

### Parameters

*   `collectionUid` **[string][222]** The collection's UID (format: userId-collectionId)

### Examples

```javascript
// Get all tags for a collection
const response = await getCollectionTags('12345678-abc-def-123');
console.log(response.data.tags);
```

Returns **[Promise][224]** Axios response with array of tags

## updateCollectionTags

Updates all tags associated with a collection (replaces existing tags)
Postman API endpoint and method: PUT /collections/{collectionUid}/tags

### Parameters

*   `collectionUid` **[string][222]** The collection's UID (format: userId-collectionId)
*   `tags` **[Array][227]** Array of tag objects with 'slug' property (maximum 5 tags)

    *   `tags[].slug` **[string][222]** The tag's slug/name

### Examples

```javascript
// Replace collection tags
const response = await updateCollectionTags(
  '12345678-abc-def-123',
  [
    { slug: 'api' },
    { slug: 'production' },
    { slug: 'v1' }
  ]
);
```

```javascript
// Remove all tags (pass empty array)
const response = await updateCollectionTags(
  '12345678-abc-def-123',
  []
);
```

Returns **[Promise][224]** Axios response with updated tags

## createCollectionGeneration

Generates a spec from a collection
Postman API endpoint and method: POST /collections/{collectionUid}/generations/{elementType}

### Parameters

*   `collectionUid` **[string][222]** The collection's UID (format: userId-collectionId)
*   `elementType` **[string][222]** The element type (typically 'spec')
*   `name` **[string][222]** The API specification's name
*   `type` **[string][222]** The specification's type (e.g., 'OPENAPI:3.0', 'OPENAPI:3.1', 'ASYNCAPI:2.6.0')
*   `format` **[string][222]** The format of the API specification ('JSON' or 'YAML')

### Examples

```javascript
// Generate an OpenAPI 3.0 spec in JSON format
const response = await createCollectionGeneration(
  '12345678-abc-def-123',
  'spec',
  'My API Spec',
  'OPENAPI:3.0',
  'JSON'
);
console.log(response.data.taskId);
```

```javascript
// Generate an OpenAPI 3.1 spec in YAML format
const response = await createCollectionGeneration(
  '12345678-abc-def-123',
  'spec',
  'My API v2',
  'OPENAPI:3.1',
  'YAML'
);
```

Returns **[Promise][224]** Axios response with taskId and url for the async generation task

## getCollectionGenerations

Gets the list of specs generated from a collection
Postman API endpoint and method: GET /collections/{collectionUid}/generations/{elementType}

### Parameters

*   `collectionUid` **[string][222]** The collection's UID (format: userId-collectionId)
*   `elementType` **[string][222]** The element type (typically 'spec')

### Examples

```javascript
// Get all specs generated from a collection
const response = await getCollectionGenerations(
  '12345678-abc-def-123',
  'spec'
);
console.log(response.data.data);
console.log(response.data.meta);
```

Returns **[Promise][224]** Axios response with array of generated specs and pagination metadata

## getCollectionTaskStatus

Gets the status of a collection generation task
Postman API endpoint and method: GET /collections/{collectionUid}/tasks/{taskId}

### Parameters

*   `collectionUid` **[string][222]** The collection's UID (format: userId-collectionId)
*   `taskId` **[string][222]** The task ID returned from createCollectionGeneration

### Examples

```javascript
// Check the status of a generation task
const response = await getCollectionTaskStatus(
  '12345678-abc-def-123',
  'task-id-789'
);
console.log(response.data.status);
```

```javascript
// Poll for task completion
const taskId = 'task-id-789';
const checkStatus = async () => {
  const response = await getCollectionTaskStatus(
    '12345678-abc-def-123',
    taskId
  );
  if (response.data.status === 'completed') {
    console.log('Generation complete!');
  } else if (response.data.status === 'failed') {
    console.error('Generation failed');
  }
};
```

Returns **[Promise][224]** Axios response with task status and progress information

## validateId

Validates a standard ID (UUID format)

### Parameters

*   `id` **[string][222]** The ID to validate
*   `paramName` **[string][222]** The parameter name for error messages

<!---->

*   Throws **[Error][228]** If the ID is invalid

## validateUid

Validates a UID (userId-UUID format)

### Parameters

*   `uid` **[string][222]** The UID to validate
*   `paramName` **[string][222]** The parameter name for error messages

<!---->

*   Throws **[Error][228]** If the UID is invalid

## buildQueryString

Builds a query string from parameters object

### Parameters

*   `params` **[Object][225]** Object with query parameters

Returns **[string][222]** Query string (e.g., '?key1=value1\&key2=value2')

## getContentFS

Reads file content from the filesystem and returns it in the format expected by Postman API

### Parameters

*   `filePath` **[string][222]** The path to the file

Returns **[Object][225]** Object with content property containing the file content

## utils

Builds a UID from a user ID and an object ID

### Parameters

*   `userId` **([string][222] | [number][223])** The user's ID
*   `objectId` **[string][222]** The object's ID (e.g., collection ID, workspace ID)

Returns **[string][222]** The UID in format: userId-objectId

## getEnvironments

Gets all environments
Postman API endpoint and method: GET /environments

### Parameters

*   `workspaceId` **[string][222]?** Return only results found in the given workspace ID (optional, default `null`)

Returns **[Promise][224]** Axios response

## createEnvironment

Creates a new environment
Postman API endpoint and method: POST /environments

### Parameters

*   `environmentData` **[Object][225]** The environment object containing name and optional values
*   `workspaceId` **[string][222]?** A workspace ID in which to create the environment (optional, default `null`)

Returns **[Promise][224]** Axios response

## getEnvironment

Gets information about an environment
Postman API endpoint and method: GET /environments/{environmentId}

### Parameters

*   `environmentId` **[string][222]** The environment's ID

Returns **[Promise][224]** Axios response

## modifyEnvironment

Updates an environment using JSON Patch operations (RFC 6902)
Postman API endpoint and method: PATCH /environments/{environmentId}

### Parameters

*   `environmentId` **[string][222]** The environment's ID
*   `patchOperations` **[Array][227]** Array of JSON Patch operations

### Examples

```javascript
// Update environment name
await modifyEnvironment(envId, [
  { op: 'replace', path: '/name', value: 'New Name' }
]);

// Add a new variable
await modifyEnvironment(envId, [
  { op: 'add', path: '/values/0', value: { key: 'api_key', value: 'secret', type: 'secret', enabled: true } }
]);

// Replace a variable's value
await modifyEnvironment(envId, [
  { op: 'replace', path: '/values/0/value', value: 'new_value' }
]);

// Remove a variable
await modifyEnvironment(envId, [
  { op: 'remove', path: '/values/2' }
]);
```

Returns **[Promise][224]** Axios response

## deleteEnvironment

Deletes an environment
Postman API endpoint and method: DELETE /environments/{environmentId}

### Parameters

*   `environmentId` **[string][222]** The environment's ID

Returns **[Promise][224]** Axios response

## getMocks

Gets all mock servers
Postman API endpoint and method: GET /mocks

### Parameters

*   `teamId` **[string][222]?** Return only mock servers that belong to the given team ID (optional, default `null`)
*   `workspaceId` **[string][222]?** Return only mock servers in the given workspace (optional, default `null`)

Returns **[Promise][224]** Axios response

## createMock

Creates a mock server in a collection
Postman API endpoint and method: POST /mocks

### Parameters

*   `mockData` **[Object][225]** The mock object containing collection and optional configuration
*   `workspaceId` **[string][222]** A workspace ID in which to create the mock server (required)

Returns **[Promise][224]** Axios response

## getMock

Gets information about a mock server
Postman API endpoint and method: GET /mocks/{mockId}

### Parameters

*   `mockId` **[string][222]** The mock's ID

Returns **[Promise][224]** Axios response

## updateMock

Updates a mock server
Postman API endpoint and method: PUT /mocks/{mockId}

### Parameters

*   `mockId` **[string][222]** The mock's ID
*   `mockData` **[Object][225]** The mock object containing collection (required) and optional fields

Returns **[Promise][224]** Axios response

## deleteMock

Deletes a mock server
Postman API endpoint and method: DELETE /mocks/{mockId}

### Parameters

*   `mockId` **[string][222]** The mock's ID

Returns **[Promise][224]** Axios response

## getMockCallLogs

Gets a mock server's call logs
Postman API endpoint and method: GET /mocks/{mockId}/call-logs

### Parameters

*   `mockId` **[string][222]** The mock's ID
*   `limit` **[number][223]?** The maximum number of rows to return (defaults to 100) (optional, default `null`)
*   `cursor` **[string][222]?** The pointer to the first record of the set of paginated results (optional, default `null`)
*   `until` **[string][222]?** Return only results created until this given time (ISO 8601 format) (optional, default `null`)
*   `since` **[string][222]?** Return only results created since the given time (ISO 8601 format) (optional, default `null`)
*   `responseStatusCode` **[number][223]?** Return only call logs that match the given HTTP response status code (optional, default `null`)
*   `responseType` **[string][222]?** Return only call logs that match the given response type (optional, default `null`)
*   `requestMethod` **[string][222]?** Return only call logs that match the given HTTP method (optional, default `null`)
*   `requestPath` **[string][222]?** Return only call logs that match the given request path (optional, default `null`)
*   `sort` **[string][222]?** Sort the results by the given value (e.g., 'servedAt') (optional, default `null`)
*   `direction` **[string][222]?** Sort in ascending ('asc') or descending ('desc') order (optional, default `null`)
*   `include` **[string][222]?** Include call log records with header and body data (comma-separated values) (optional, default `null`)

Returns **[Promise][224]** Axios response

## createMockPublish

Publishes a mock server (sets Access Control to public)
Postman API endpoint and method: POST /mocks/{mockId}/publish

### Parameters

*   `mockId` **[string][222]** The mock's ID

Returns **[Promise][224]** Axios response

## getMockServerResponses

Gets all of a mock server's server responses
Postman API endpoint and method: GET /mocks/{mockId}/server-responses

### Parameters

*   `mockId` **[string][222]** The mock's ID

Returns **[Promise][224]** Axios response

## createMockServerResponse

Creates a server response for a mock server
Postman API endpoint and method: POST /mocks/{mockId}/server-responses

### Parameters

*   `mockId` **[string][222]** The mock's ID
*   `serverResponseData` **[Object][225]** The server response object containing name and statusCode (required)

Returns **[Promise][224]** Axios response

## getMockServerResponse

Gets information about a server response
Postman API endpoint and method: GET /mocks/{mockId}/server-responses/{serverResponseId}

### Parameters

*   `mockId` **[string][222]** The mock's ID
*   `serverResponseId` **[string][222]** The server response's ID

Returns **[Promise][224]** Axios response

## updateMockServerResponse

Updates a mock server's server response
Postman API endpoint and method: PUT /mocks/{mockId}/server-responses/{serverResponseId}

### Parameters

*   `mockId` **[string][222]** The mock's ID
*   `serverResponseId` **[string][222]** The server response's ID
*   `serverResponseData` **[Object][225]** The server response object with fields to update

Returns **[Promise][224]** Axios response

## deleteMockServerResponse

Deletes a mock server's server response
Postman API endpoint and method: DELETE /mocks/{mockId}/server-responses/{serverResponseId}

### Parameters

*   `mockId` **[string][222]** The mock's ID
*   `serverResponseId` **[string][222]** The server response's ID

Returns **[Promise][224]** Axios response

## deleteMockUnpublish

Unpublishes a mock server (sets Access Control to private)
Postman API endpoint and method: DELETE /mocks/{mockId}/unpublish

### Parameters

*   `mockId` **[string][222]** The mock's ID

Returns **[Promise][224]** Axios response

## createRequest

Creates a request in a collection
Postman API endpoint and method: POST /collections/{collectionId}/requests

### Parameters

*   `collectionId` **[string][222]** The collection's ID
*   `requestData` **[Object][225]** The request data

    *   `requestData.name` **[string][222]** (Required) The request's name
    *   `requestData.method` **[string][222]?** The HTTP method (GET, POST, PUT, PATCH, DELETE, etc.)
    *   `requestData.url` **[Object][225]?** The request URL object

        *   `requestData.url.raw` **[string][222]?** The complete URL string
    *   `requestData.header` **[Array][227]?** Array of header objects
    *   `requestData.body` **[Object][225]?** The request body object
    *   `requestData.description` **[string][222]?** The request description
*   `folderId` **[string][222]?** The folder ID in which to create the request. If not provided, creates at collection root. (optional, default `null`)

### Examples

```javascript
// Create a simple GET request
const response = await createRequest('collection-id-123', {
  name: 'Get Users',
  method: 'GET',
  url: {
    raw: 'https://api.example.com/users'
  }
});
```

```javascript
// Create a POST request with body in a folder
const response = await createRequest(
  'collection-id-123',
  {
    name: 'Create User',
    method: 'POST',
    url: { raw: 'https://api.example.com/users' },
    header: [
      { key: 'Content-Type', value: 'application/json' }
    ],
    body: {
      mode: 'raw',
      raw: JSON.stringify({ name: 'John Doe' })
    }
  },
  'folder-id-456'
);
```

```javascript
// Create a request with description
const response = await createRequest('collection-id-123', {
  name: 'Update User',
  method: 'PUT',
  url: { raw: 'https://api.example.com/users/:id' },
  description: 'Updates an existing user by ID'
});
```

Returns **[Promise][224]** Axios response with created request data

## getRequest

Gets information about a request in a collection
Postman API endpoint and method: GET /collections/{collectionId}/requests/{requestId}

### Parameters

*   `collectionId` **[string][222]** The collection's ID
*   `requestId` **[string][222]** The request's ID
*   `ids` **[boolean][229]?** If true, returns only the request properties that contain ID values (optional, default `null`)
*   `uid` **[boolean][229]?** If true, returns all IDs in UID format (userId-objectId) (optional, default `null`)
*   `populate` **[boolean][229]?** If true, returns all of a request's contents including full details (optional, default `null`)

### Examples

```javascript
// Get a request by ID
const response = await getRequest('collection-id-123', 'request-id-456');
console.log(response.data.data);
```

```javascript
// Get request with only ID properties
const response = await getRequest('collection-id-123', 'request-id-456', true);
```

```javascript
// Get request with UIDs and full contents
const response = await getRequest(
  'collection-id-123',
  'request-id-456',
  null,
  true,
  true
);
```

Returns **[Promise][224]** Axios response with request data

## updateRequest

Updates a request in a collection
Postman API endpoint and method: PUT /collections/{collectionId}/requests/{requestId}

### Parameters

*   `collectionId` **[string][222]** The collection's ID
*   `requestId` **[string][222]** The request's ID
*   `requestData` **[Object][225]** The request data to update

    *   `requestData.name` **[string][222]?** The request's name
    *   `requestData.method` **[string][222]?** The HTTP method (GET, POST, PUT, PATCH, DELETE, etc.)
    *   `requestData.url` **[Object][225]?** The request URL object

        *   `requestData.url.raw` **[string][222]?** The complete URL string
    *   `requestData.header` **[Array][227]?** Array of header objects
    *   `requestData.body` **[Object][225]?** The request body object
    *   `requestData.description` **[string][222]?** The request description

### Examples

```javascript
// Update request name and method
const response = await updateRequest(
  'collection-id-123',
  'request-id-456',
  {
    name: 'Updated Request Name',
    method: 'POST'
  }
);
```

```javascript
// Update request URL and headers
const response = await updateRequest(
  'collection-id-123',
  'request-id-456',
  {
    url: { raw: 'https://api.example.com/v2/users' },
    header: [
      { key: 'Authorization', value: 'Bearer {{token}}' },
      { key: 'Content-Type', value: 'application/json' }
    ]
  }
);
```

```javascript
// Update request body
const response = await updateRequest(
  'collection-id-123',
  'request-id-456',
  {
    body: {
      mode: 'raw',
      raw: JSON.stringify({ email: 'user@example.com' }),
      options: {
        raw: { language: 'json' }
      }
    }
  }
);
```

Returns **[Promise][224]** Axios response with updated request data

## deleteRequest

Deletes a request in a collection
Postman API endpoint and method: DELETE /collections/{collectionId}/requests/{requestId}

### Parameters

*   `collectionId` **[string][222]** The collection's ID
*   `requestId` **[string][222]** The request's ID

### Examples

```javascript
// Delete a request
const response = await deleteRequest('collection-id-123', 'request-id-456');
console.log(response.data.request);
```

Returns **[Promise][224]** Axios response with deletion confirmation

## getRequestComments

Gets all comments left by users in a request
Postman API endpoint and method: GET /collections/{collectionUid}/requests/{requestUid}/comments

### Parameters

*   `collectionUid` **[string][222]** The collection's UID (format: userId-collectionId)
*   `requestUid` **[string][222]** The request's UID (format: userId-requestId)

### Examples

```javascript
// Get all comments for a request
const response = await getRequestComments(
  '12345678-abc-def-123',
  '12345678-request-id-456'
);
console.log(response.data.data);
```

Returns **[Promise][224]** Axios response with array of comments

## createRequestComment

Creates a comment on a request
Postman API endpoint and method: POST /collections/{collectionUid}/requests/{requestUid}/comments

### Parameters

*   `collectionUid` **[string][222]** The collection's UID (format: userId-collectionId)
*   `requestUid` **[string][222]** The request's UID (format: userId-requestId)
*   `commentData` **[Object][225]** The comment data

    *   `commentData.body` **[string][222]** (Required) The contents of the comment. Max 10,000 characters.
    *   `commentData.threadId` **[number][223]?** The comment's thread ID. Include this to create a reply on an existing comment.
    *   `commentData.tags` **[Object][225]?** Information about users tagged in the body comment

        *   `commentData.tags.userName` **[Object][225]** Tagged user info. Key is the user's Postman username (e.g., '@user-postman')

            *   `commentData.tags.userName.type` **[string][222]** Must be 'user'
            *   `commentData.tags.userName.id` **[string][222]** The user's ID

### Examples

```javascript
// Create a simple comment
const response = await createRequestComment(
  '12345678-abc-def-123',
  '12345678-request-id-456',
  {
    body: 'This endpoint needs authentication!'
  }
);
```

```javascript
// Create a comment with user tags
const response = await createRequestComment(
  '12345678-abc-def-123',
  '12345678-request-id-456',
  {
    body: 'Please review this @alex-cruz',
    tags: {
      '@alex-cruz': {
        type: 'user',
        id: '87654321'
      }
    }
  }
);
```

```javascript
// Reply to an existing comment thread
const response = await createRequestComment(
  '12345678-abc-def-123',
  '12345678-request-id-456',
  {
    body: 'I agree, authentication added.',
    threadId: 12345
  }
);
```

Returns **[Promise][224]** Axios response with created comment data

## updateRequestComment

Updates a comment on a request
Postman API endpoint and method: PUT /collections/{collectionUid}/requests/{requestUid}/comments/{commentId}

### Parameters

*   `collectionUid` **[string][222]** The collection's UID (format: userId-collectionId)
*   `requestUid` **[string][222]** The request's UID (format: userId-requestId)
*   `commentId` **[string][222]** The comment's ID
*   `commentData` **[Object][225]** The comment data to update

    *   `commentData.body` **[string][222]?** The updated contents of the comment. Max 10,000 characters.
    *   `commentData.tags` **[Object][225]?** Updated information about users tagged in the body comment

        *   `commentData.tags.userName` **[Object][225]** Tagged user info. Key is the user's Postman username (e.g., '@user-postman')

            *   `commentData.tags.userName.type` **[string][222]** Must be 'user'
            *   `commentData.tags.userName.id` **[string][222]** The user's ID

### Examples

```javascript
// Update a comment's body
const response = await updateRequestComment(
  '12345678-abc-def-123',
  '12345678-request-id-456',
  '12345',
  {
    body: 'Updated: This endpoint now requires authentication'
  }
);
```

```javascript
// Update with new tags
const response = await updateRequestComment(
  '12345678-abc-def-123',
  '12345678-request-id-456',
  '12345',
  {
    body: 'Updated comment with @new-user',
    tags: {
      '@new-user': {
        type: 'user',
        id: '11111111'
      }
    }
  }
);
```

Returns **[Promise][224]** Axios response with updated comment data

## deleteRequestComment

Deletes a comment from a request
Postman API endpoint and method: DELETE /collections/{collectionUid}/requests/{requestUid}/comments/{commentId}

### Parameters

*   `collectionUid` **[string][222]** The collection's UID (format: userId-collectionId)
*   `requestUid` **[string][222]** The request's UID (format: userId-requestId)
*   `commentId` **[string][222]** The comment's ID

### Examples

```javascript
// Delete a request comment
const response = await deleteRequestComment(
  '12345678-abc-def-123',
  '12345678-request-id-456',
  '12345'
);
console.log(response.data.comment);
```

Returns **[Promise][224]** Axios response with deletion confirmation

## createResponse

Creates a response in a collection
Postman API endpoint and method: POST /collections/{collectionId}/responses

### Parameters

*   `collectionId` **[string][222]** The collection's ID
*   `requestId` **[string][222]** The parent request's ID that this response belongs to
*   `responseData` **[Object][225]** The response data

    *   `responseData.name` **[string][222]** (Required) The response's name
    *   `responseData.code` **[number][223]?** The HTTP response status code (e.g., 200, 404, 500)
    *   `responseData.status` **[string][222]?** The HTTP status text (e.g., 'OK', 'Not Found')
    *   `responseData.header` **[Array][227]?** Array of response header objects
    *   `responseData.body` **[string][222]?** The response body content
    *   `responseData.originalRequest` **[Object][225]?** The original request that generated this response

### Examples

```javascript
// Create a simple success response
const response = await createResponse(
  'collection-id-123',
  'request-id-456',
  {
    name: '200 OK',
    code: 200,
    status: 'OK',
    header: [
      { key: 'Content-Type', value: 'application/json' }
    ],
    body: JSON.stringify({ message: 'Success' })
  }
);
```

```javascript
// Create an error response
const response = await createResponse(
  'collection-id-123',
  'request-id-456',
  {
    name: '404 Not Found',
    code: 404,
    status: 'Not Found',
    body: JSON.stringify({ error: 'Resource not found' })
  }
);
```

```javascript
// Create response with headers
const response = await createResponse(
  'collection-id-123',
  'request-id-456',
  {
    name: '201 Created',
    code: 201,
    status: 'Created',
    header: [
      { key: 'Content-Type', value: 'application/json' },
      { key: 'Location', value: '/users/123' }
    ],
    body: JSON.stringify({ id: 123, name: 'John Doe' })
  }
);
```

Returns **[Promise][224]** Axios response with created response data

## getResponse

Gets information about a response in a collection
Postman API endpoint and method: GET /collections/{collectionId}/responses/{responseId}

### Parameters

*   `collectionId` **[string][222]** The collection's ID
*   `responseId` **[string][222]** The response's ID
*   `ids` **[boolean][229]?** If true, returns only the response properties that contain ID values (optional, default `null`)
*   `uid` **[boolean][229]?** If true, returns all IDs in UID format (userId-objectId) (optional, default `null`)
*   `populate` **[boolean][229]?** If true, returns all of a response's contents including full details (optional, default `null`)

### Examples

```javascript
// Get a response by ID
const response = await getResponse('collection-id-123', 'response-id-789');
console.log(response.data.data);
```

```javascript
// Get response with only ID properties
const response = await getResponse('collection-id-123', 'response-id-789', true);
```

```javascript
// Get response with UIDs and full contents
const response = await getResponse(
  'collection-id-123',
  'response-id-789',
  null,
  true,
  true
);
```

Returns **[Promise][224]** Axios response with response data

## updateResponse

Updates a response in a collection
Postman API endpoint and method: PUT /collections/{collectionId}/responses/{responseId}

### Parameters

*   `collectionId` **[string][222]** The collection's ID
*   `responseId` **[string][222]** The response's ID
*   `responseData` **[Object][225]** The response data to update

    *   `responseData.name` **[string][222]?** The response's name
    *   `responseData.code` **[number][223]?** The HTTP response status code (e.g., 200, 404, 500)
    *   `responseData.status` **[string][222]?** The HTTP status text (e.g., 'OK', 'Not Found')
    *   `responseData.header` **[Array][227]?** Array of response header objects
    *   `responseData.body` **[string][222]?** The response body content

### Examples

```javascript
// Update response name and status code
const response = await updateResponse(
  'collection-id-123',
  'response-id-789',
  {
    name: '200 Success - Updated',
    code: 200
  }
);
```

```javascript
// Update response body and headers
const response = await updateResponse(
  'collection-id-123',
  'response-id-789',
  {
    header: [
      { key: 'Content-Type', value: 'application/json' },
      { key: 'Cache-Control', value: 'no-cache' }
    ],
    body: JSON.stringify({ data: 'updated response' })
  }
);
```

```javascript
// Update error response
const response = await updateResponse(
  'collection-id-123',
  'response-id-789',
  {
    name: '500 Internal Server Error',
    code: 500,
    status: 'Internal Server Error',
    body: JSON.stringify({ error: 'Server error occurred' })
  }
);
```

Returns **[Promise][224]** Axios response with updated response data

## deleteResponse

Deletes a response in a collection
Postman API endpoint and method: DELETE /collections/{collectionId}/responses/{responseId}

### Parameters

*   `collectionId` **[string][222]** The collection's ID
*   `responseId` **[string][222]** The response's ID

### Examples

```javascript
// Delete a response
const response = await deleteResponse('collection-id-123', 'response-id-789');
console.log(response.data.response);
```

Returns **[Promise][224]** Axios response with deletion confirmation

## getResponseComments

Gets all comments left by users in a response
Postman API endpoint and method: GET /collections/{collectionUid}/responses/{responseUid}/comments

### Parameters

*   `collectionUid` **[string][222]** The collection's UID (format: userId-collectionId)
*   `responseUid` **[string][222]** The response's UID (format: userId-responseId)

### Examples

```javascript
// Get all comments for a response
const response = await getResponseComments(
  '12345678-abc-def-123',
  '12345678-response-id-789'
);
console.log(response.data.data);
```

Returns **[Promise][224]** Axios response with array of comments

## createResponseComment

Creates a comment on a response
Postman API endpoint and method: POST /collections/{collectionUid}/responses/{responseUid}/comments

### Parameters

*   `collectionUid` **[string][222]** The collection's UID (format: userId-collectionId)
*   `responseUid` **[string][222]** The response's UID (format: userId-responseId)
*   `commentData` **[Object][225]** The comment data

    *   `commentData.body` **[string][222]** (Required) The contents of the comment. Max 10,000 characters.
    *   `commentData.threadId` **[number][223]?** The comment's thread ID. Include this to create a reply on an existing comment.
    *   `commentData.tags` **[Object][225]?** Information about users tagged in the body comment

        *   `commentData.tags.userName` **[Object][225]** Tagged user info. Key is the user's Postman username (e.g., '@user-postman')

            *   `commentData.tags.userName.type` **[string][222]** Must be 'user'
            *   `commentData.tags.userName.id` **[string][222]** The user's ID

### Examples

```javascript
// Create a simple comment
const response = await createResponseComment(
  '12345678-abc-def-123',
  '12345678-response-id-789',
  {
    body: 'This response example is helpful!'
  }
);
```

```javascript
// Create a comment with user tags
const response = await createResponseComment(
  '12345678-abc-def-123',
  '12345678-response-id-789',
  {
    body: 'Great example @alex-cruz!',
    tags: {
      '@alex-cruz': {
        type: 'user',
        id: '87654321'
      }
    }
  }
);
```

```javascript
// Reply to an existing comment thread
const response = await createResponseComment(
  '12345678-abc-def-123',
  '12345678-response-id-789',
  {
    body: 'Thanks, I updated the response.',
    threadId: 12345
  }
);
```

Returns **[Promise][224]** Axios response with created comment data

## updateResponseComment

Updates a comment on a response
Postman API endpoint and method: PUT /collections/{collectionUid}/responses/{responseUid}/comments/{commentId}

### Parameters

*   `collectionUid` **[string][222]** The collection's UID (format: userId-collectionId)
*   `responseUid` **[string][222]** The response's UID (format: userId-responseId)
*   `commentId` **[string][222]** The comment's ID
*   `commentData` **[Object][225]** The comment data to update

    *   `commentData.body` **[string][222]?** The updated contents of the comment. Max 10,000 characters.
    *   `commentData.tags` **[Object][225]?** Updated information about users tagged in the body comment

        *   `commentData.tags.userName` **[Object][225]** Tagged user info. Key is the user's Postman username (e.g., '@user-postman')

            *   `commentData.tags.userName.type` **[string][222]** Must be 'user'
            *   `commentData.tags.userName.id` **[string][222]** The user's ID

### Examples

```javascript
// Update a comment's body
const response = await updateResponseComment(
  '12345678-abc-def-123',
  '12345678-response-id-789',
  '12345',
  {
    body: 'Updated: This response format has changed'
  }
);
```

```javascript
// Update with new tags
const response = await updateResponseComment(
  '12345678-abc-def-123',
  '12345678-response-id-789',
  '12345',
  {
    body: 'Updated comment with @new-user',
    tags: {
      '@new-user': {
        type: 'user',
        id: '11111111'
      }
    }
  }
);
```

Returns **[Promise][224]** Axios response with updated comment data

## deleteResponseComment

Deletes a comment from a response
Postman API endpoint and method: DELETE /collections/{collectionUid}/responses/{responseUid}/comments/{commentId}

### Parameters

*   `collectionUid` **[string][222]** The collection's UID (format: userId-collectionId)
*   `responseUid` **[string][222]** The response's UID (format: userId-responseId)
*   `commentId` **[string][222]** The comment's ID

### Examples

```javascript
// Delete a response comment
const response = await deleteResponseComment(
  '12345678-abc-def-123',
  '12345678-response-id-789',
  '12345'
);
console.log(response.data.comment);
```

Returns **[Promise][224]** Axios response with deletion confirmation

## buildAxiosConfig

Builds an Axios config for Postman API requests

### Parameters

*   `method` **[string][222]** HTTP method (e.g., 'get', 'post', 'patch')
*   `endpoint` **[string][222]** The API endpoint path (e.g., '/specs/{specId}')
*   `data` **[Object][225]?** The request body data (optional, default `undefined`)
*   `extra` **[Object][225]?** Extra Axios config (e.g. maxBodyLength, etc) (optional, default `{}`)

Returns **[Object][225]** Axios request config

## executeRequest

Executes an axios request and throws an error for non-2xx responses.

### Parameters

*   `config` **[Object][225]** Axios request configuration

Returns **[Promise][224]** Axios response

## POSTMAN\_API\_KEY\_ENV\_VAR

Configuration module for Postman SDK
Reads API key from environment and sets base URL

Type: [string][222]

## getSpecs

Gets all API specifications in a workspace
Postman API endpoint and method: GET /specs

### Parameters

*   `workspaceId` **[string][222]** The workspace ID
*   `cursor` **[string][222]?** The pointer to the first record of the set of paginated results (optional, default `null`)
*   `limit` **[number][223]?** The maximum number of rows to return in the response (optional, default `null`)

Returns **[Promise][224]** Axios response

## getSpec

Gets information about a specific API specification
Postman API endpoint and method: GET /specs/{specId}

### Parameters

*   `specId` **[string][222]** The spec ID

Returns **[Promise][224]** Axios response

## createSpec

Creates an API specification in Postman's Spec Hub
Postman API endpoint and method: POST /specs

### Parameters

*   `workspaceId` **[string][222]** The workspace ID
*   `name` **[string][222]** The specification's name
*   `type` **[string][222]** The specification's type (e.g., 'OPENAPI:3.0', 'ASYNCAPI:2.0')
*   `files` **[Array][227]** A list of the specification's files and their contents

Returns **[Promise][224]** Axios response

## modifySpec

Updates an API specification's properties
Postman API endpoint and method: PATCH /specs/{specId}

### Parameters

*   `specId` **[string][222]** The spec ID
*   `name` **[string][222]** The specification's name

Returns **[Promise][224]** Axios response

## deleteSpec

Deletes an API specification
Postman API endpoint and method: DELETE /specs/{specId}

### Parameters

*   `specId` **[string][222]** The spec ID

Returns **[Promise][224]** Axios response

## getSpecDefinition

Gets the complete contents of an API specification's definition
Postman API endpoint and method: GET /specs/{specId}/definitions

### Parameters

*   `specId` **[string][222]** The spec ID

Returns **[Promise][224]** Axios response

## getSpecFiles

Gets all the files in an API specification
Postman API endpoint and method: GET /specs/{specId}/files

### Parameters

*   `specId` **[string][222]** The spec ID

Returns **[Promise][224]** Axios response

## createSpecFile

Creates an API specification file
Postman API endpoint and method: POST /specs/{specId}/files

### Parameters

*   `specId` **[string][222]** The spec ID
*   `path` **[string][222]** The file's path (accepts JSON or YAML files)
*   `content` **[string][222]** The file's stringified contents

Returns **[Promise][224]** Axios response

## getSpecFile

Gets the contents of an API specification's file
Postman API endpoint and method: GET /specs/{specId}/files/{filePath}

### Parameters

*   `specId` **[string][222]** The spec ID
*   `filePath` **[string][222]** The path to the file

Returns **[Promise][224]** Axios response

## modifySpecFile

Updates an API specification's file
Postman API endpoint and method: PATCH /specs/{specId}/files/{filePath}

### Parameters

*   `specId` **[string][222]** The spec ID
*   `filePath` **[string][222]** The path to the file
*   `data` **[Object][225]** Update data (name, content, or type - only one property at a time)

Returns **[Promise][224]** Axios response

## deleteSpecFile

Deletes a file in an API specification
Postman API endpoint and method: DELETE /specs/{specId}/files/{filePath}

### Parameters

*   `specId` **[string][222]** The spec ID
*   `filePath` **[string][222]** The path to the file

Returns **[Promise][224]** Axios response

## createSpecGeneration

Generates a collection from an API specification
Postman API endpoint and method: POST /specs/{specId}/generations/{elementType}

### Parameters

*   `specId` **[string][222]** The spec ID
*   `elementType` **[string][222]** The element type (typically 'collection')
*   `name` **[string][222]?** The name for the generated collection (optional, default `null`)
*   `options` **[Object][225]?** Generation options (optional, default `null`)

Returns **[Promise][224]** Axios response with taskId and url for polling

## getSpecTaskStatus

Gets the status of an asynchronous API specification task
Postman API endpoint and method: GET /specs/{specId}/tasks/{taskId}

### Parameters

*   `specId` **[string][222]** The spec ID
*   `taskId` **[string][222]** The task ID (returned from async operations like createSpecGeneration)

Returns **[Promise][224]** Axios response with status and meta information

## getSpecGenerations

Gets a list of collections generated from a spec
Postman API endpoint and method: GET /specs/{specId}/generations/{elementType}

### Parameters

*   `specId` **[string][222]** The spec ID
*   `elementType` **[string][222]** The element type (e.g., 'collection')
*   `limit` **[number][223]** The maximum number of rows to return (default 10) (optional, default `null`)
*   `cursor` **[string][222]** Pagination cursor for next set of results (optional, default `null`)

Returns **[Promise][224]** Axios response with collections array and pagination metadata

## syncSpecWithCollection

Syncs a spec with a collection
Postman API endpoint and method: PUT /specs/{specId}/synchronizations

### Parameters

*   `specId` **[string][222]** The spec ID
*   `collectionUid` **[string][222]** The collection's unique ID (userId-collectionId)

Returns **[Promise][224]** Axios response with taskId and url

## getTagEntities

Gets Postman elements (entities) by a given tag
Postman API endpoint and method: GET /tags/{slugId}/entities

### Parameters

*   `slugId` **[string][222]** The tag's ID/slug (e.g., 'needs-review', 'production')
*   `limit` **[number][223]?** Maximum number of tagged elements to return (max 50, default 10) (optional, default `null`)
*   `direction` **[string][222]?** Sort order: 'asc' or 'desc' based on tagging time (optional, default `null`)
*   `cursor` **[string][222]?** Pagination cursor from previous response's meta.nextCursor (optional, default `null`)
*   `entityType` **[string][222]?** Filter by element type: 'api', 'collection', or 'workspace' (optional, default `null`)

### Examples

```javascript
// Get all entities with 'production' tag
const result = await getTagEntities('production');
```

```javascript
// Get only collections with 'needs-review' tag
const result = await getTagEntities('needs-review', null, null, null, 'collection');
```

```javascript
// Get entities with pagination
const result = await getTagEntities('api-v2', 20, 'desc', nextCursor);
```

Returns **[Promise][224]** Axios response with data.entities array and meta.count

## getAuthenticatedUser

Gets information about the authenticated user
Postman API endpoint and method: GET /me

Returns **[Promise][224]** Axios response

## getWorkspaces

Gets all workspaces
Postman API endpoint and method: GET /workspaces

### Parameters

*   `type` **[string][222]?** Filter by workspace type (personal, team, private, public, partner) (optional, default `null`)
*   `createdByUserId` **[number][223]?** Return only workspaces created by a specific user ID (optional, default `null`)
*   `include` **[string][222]?** Include additional information (mocks:deactivated, scim) (optional, default `null`)

Returns **[Promise][224]** Axios response

## createWorkspace

Creates a new workspace
Postman API endpoint and method: POST /workspaces

### Parameters

*   `name` **[string][222]** The workspace's name
*   `type` **[string][222]** The type of workspace (personal, private, public, team, partner)
*   `description` **[string][222]?** The workspace's description (optional, default `null`)
*   `about` **[string][222]?** A brief summary about the workspace (optional, default `null`)

Returns **[Promise][224]** Axios response

## getWorkspace

Gets information about a workspace
Postman API endpoint and method: GET /workspaces/{workspaceId}

### Parameters

*   `workspaceId` **[string][222]** The workspace's ID
*   `include` **[string][222]?** Include additional information (mocks:deactivated, scim) (optional, default `null`)

Returns **[Promise][224]** Axios response

## updateWorkspace

Updates a workspace
Postman API endpoint and method: PUT /workspaces/{workspaceId}
Note: This function fetches the current workspace first to get existing values,
then merges updates, because the Postman API requires 'type' to be present in PUT requests.

### Parameters

*   `workspaceId` **[string][222]** The workspace's ID
*   `name` **[string][222]?** The workspace's new name (optional, default `null`)
*   `type` **[string][222]?** The new workspace visibility type (private, personal, team, public) (optional, default `null`)
*   `description` **[string][222]?** The new workspace description (optional, default `null`)
*   `about` **[string][222]?** A brief summary about the workspace (optional, default `null`)

Returns **[Promise][224]** Axios response

## deleteWorkspace

Deletes an existing workspace
Postman API endpoint and method: DELETE /workspaces/{workspaceId}

### Parameters

*   `workspaceId` **[string][222]** The workspace's ID

Returns **[Promise][224]** Axios response

## getWorkspaceTags

Gets all tags associated with a workspace
Postman API endpoint and method: GET /workspaces/{workspaceId}/tags

### Parameters

*   `workspaceId` **[string][222]** The workspace's ID

Returns **[Promise][224]** Axios response

## updateWorkspaceTags

Updates a workspace's associated tags
Postman API endpoint and method: PUT /workspaces/{workspaceId}/tags
Note: This replaces all existing tags with the provided tags array

### Parameters

*   `workspaceId` **[string][222]** The workspace's ID
*   `tags` **[Array][227]<[Object][225]>** Array of tag objects with slug property (max 5 tags)

### Examples

```javascript
// Add tags to workspace
await updateWorkspaceTags(workspaceId, [
  { slug: 'needs-review' },
  { slug: 'test-api' }
]);

// Clear all tags (pass empty array)
await updateWorkspaceTags(workspaceId, []);
```

Returns **[Promise][224]** Axios response

[37]: #getcollections

[38]: #parameters

[39]: #examples

[1]: #createcollection

[2]: #parameters-1

[3]: #examples-1

[28]: #getcollection

[29]: #parameters-2

[30]: #examples-2

[58]: #updatecollection

[59]: #parameters-3

[60]: #examples-3

[52]: #modifycollection

[53]: #parameters-4

[54]: #examples-4

[16]: #deletecollection

[17]: #parameters-5

[18]: #examples-5

[10]: #createfolder

[11]: #parameters-6

[12]: #examples-6

[46]: #getfolder

[47]: #parameters-7

[48]: #examples-7

[67]: #updatefolder

[68]: #parameters-8

[69]: #examples-8

[22]: #deletefolder

[23]: #parameters-9

[24]: #examples-9

[31]: #getcollectioncomments

[32]: #parameters-10

[33]: #examples-10

[4]: #createcollectioncomment

[5]: #parameters-11

[6]: #examples-11

[61]: #updatecollectioncomment

[62]: #parameters-12

[63]: #examples-12

[19]: #deletecollectioncomment

[20]: #parameters-13

[21]: #examples-13

[49]: #getfoldercomments

[50]: #parameters-14

[51]: #examples-14

[13]: #createfoldercomment

[14]: #parameters-15

[15]: #examples-15

[70]: #updatefoldercomment

[71]: #parameters-16

[72]: #examples-16

[25]: #deletefoldercomment

[26]: #parameters-17

[27]: #examples-17

[55]: #synccollectionwithspec

[56]: #parameters-18

[57]: #examples-18

[40]: #getcollectiontags

[41]: #parameters-19

[42]: #examples-19

[64]: #updatecollectiontags

[65]: #parameters-20

[66]: #examples-20

[7]: #createcollectiongeneration

[8]: #parameters-21

[9]: #examples-21

[34]: #getcollectiongenerations

[35]: #parameters-22

[36]: #examples-22

[43]: #getcollectiontaskstatus

[44]: #parameters-23

[45]: #examples-23

[217]: #validateid

[218]: #parameters-24

[219]: #validateuid

[220]: #parameters-25

[209]: #buildquerystring

[210]: #parameters-26

[213]: #getcontentfs

[214]: #parameters-27

[215]: #utils

[216]: #parameters-28

[172]: #getenvironments

[173]: #parameters-29

[166]: #createenvironment

[167]: #parameters-30

[170]: #getenvironment

[171]: #parameters-31

[174]: #modifyenvironment

[175]: #parameters-32

[176]: #examples-24

[168]: #deleteenvironment

[169]: #parameters-33

[193]: #getmocks

[194]: #parameters-34

[177]: #createmock

[178]: #parameters-35

[189]: #getmock

[190]: #parameters-36

[199]: #updatemock

[200]: #parameters-37

[183]: #deletemock

[184]: #parameters-38

[191]: #getmockcalllogs

[192]: #parameters-39

[179]: #createmockpublish

[180]: #parameters-40

[197]: #getmockserverresponses

[198]: #parameters-41

[181]: #createmockserverresponse

[182]: #parameters-42

[195]: #getmockserverresponse

[196]: #parameters-43

[201]: #updatemockserverresponse

[202]: #parameters-44

[185]: #deletemockserverresponse

[186]: #parameters-45

[187]: #deletemockunpublish

[188]: #parameters-46

[73]: #createrequest

[74]: #parameters-47

[75]: #examples-25

[85]: #getrequest

[86]: #parameters-48

[87]: #examples-26

[91]: #updaterequest

[92]: #parameters-49

[93]: #examples-27

[79]: #deleterequest

[80]: #parameters-50

[81]: #examples-28

[88]: #getrequestcomments

[89]: #parameters-51

[90]: #examples-29

[76]: #createrequestcomment

[77]: #parameters-52

[78]: #examples-30

[94]: #updaterequestcomment

[95]: #parameters-53

[96]: #examples-31

[82]: #deleterequestcomment

[83]: #parameters-54

[84]: #examples-32

[97]: #createresponse

[98]: #parameters-55

[99]: #examples-33

[109]: #getresponse

[110]: #parameters-56

[111]: #examples-34

[115]: #updateresponse

[116]: #parameters-57

[117]: #examples-35

[103]: #deleteresponse

[104]: #parameters-58

[105]: #examples-36

[112]: #getresponsecomments

[113]: #parameters-59

[114]: #examples-37

[100]: #createresponsecomment

[101]: #parameters-60

[102]: #examples-38

[118]: #updateresponsecomment

[119]: #parameters-61

[120]: #examples-39

[106]: #deleteresponsecomment

[107]: #parameters-62

[108]: #examples-40

[207]: #buildaxiosconfig

[208]: #parameters-63

[211]: #executerequest

[212]: #parameters-64

[172]: #postman_api_key_env_var

[156]: #getspecs

[157]: #parameters-65

[146]: #getspec

[147]: #parameters-66

[136]: #createspec

[137]: #parameters-67

[160]: #modifyspec

[161]: #parameters-68

[142]: #deletespec

[143]: #parameters-69

[148]: #getspecdefinition

[149]: #parameters-70

[152]: #getspecfiles

[153]: #parameters-71

[138]: #createspecfile

[139]: #parameters-72

[150]: #getspecfile

[151]: #parameters-73

[162]: #modifyspecfile

[163]: #parameters-74

[144]: #deletespecfile

[145]: #parameters-75

[140]: #createspecgeneration

[141]: #parameters-76

[158]: #getspectaskstatus

[159]: #parameters-77

[154]: #getspecgenerations

[155]: #parameters-78

[164]: #syncspecwithcollection

[165]: #parameters-79

[203]: #gettagentities

[204]: #parameters-80

[205]: #examples-41

[206]: #getauthenticateduser

[127]: #getworkspaces

[128]: #parameters-81

[121]: #createworkspace

[122]: #parameters-82

[125]: #getworkspace

[126]: #parameters-83

[131]: #updateworkspace

[132]: #parameters-84

[123]: #deleteworkspace

[124]: #parameters-85

[129]: #getworkspacetags

[130]: #parameters-86

[133]: #updateworkspacetags

[134]: #parameters-87

[135]: #examples-42

[222]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[223]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[224]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise

[225]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[226]: https://schema.getpostman.com/json/collection/v2.1.0/collection.json

[227]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

[228]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error

[229]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean
