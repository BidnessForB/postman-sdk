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
| [createCollectionFork][7] | Creates a fork from an existing collection |
| [createCollectionGeneration][10] | Generates a spec from a collection |
| [createFolder][13] | Creates a folder in a collection |
| [createFolderComment][16] | Creates a comment on a folder |
| [deleteCollection][19] | Deletes a collection |
| [deleteCollectionComment][22] | Deletes a comment from a collection |
| [deleteFolder][25] | Deletes a folder in a collection |
| [deleteFolderComment][28] | Deletes a comment from a folder |
| [getCollection][31] | Gets a collection by ID |
| [getCollectionComments][34] | Gets all comments left by users in a collection |
| [getCollectionForks][37] | Gets all forked collections |
| [getCollectionGenerations][40] | Gets the list of specs generated from a collection |
| [getCollections][43] | Gets all collections |
| [getCollectionTags][46] | Gets all tags associated with a collection |
| [getCollectionTaskStatus][49] | Gets the status of a collection generation task |
| [getFolder][52] | Gets information about a folder in a collection |
| [getFolderComments][55] | Gets all comments left by users in a folder |
| [mergeCollectionFork][58] | Merges a forked collection back into its parent collection |
| [modifyCollection][61] | Updates part of a collection |
| [syncCollectionWithSpec][64] | Sync collection with spec |
| [updateCollection][67] | Replaces a collection's data |
| [updateCollectionComment][70] | Updates a comment on a collection |
| [updateCollectionTags][73] | Updates all tags associated with a collection (replaces existing tags) |
| [updateFolder][76] | Updates a folder in a collection |
| [updateFolderComment][79] | Updates a comment on a folder |

</details>

<details open>
<summary><strong>Requests</strong> - Manage requests within collections</summary>

| Function | Description |
|----------|-------------|
| [createRequest][82] | Creates a request in a collection |
| [createRequestComment][85] | Creates a comment on a request |
| [deleteRequest][88] | Deletes a request in a collection |
| [deleteRequestComment][91] | Deletes a comment from a request |
| [getRequest][94] | Gets information about a request in a collection |
| [getRequestComments][97] | Gets all comments left by users in a request |
| [updateRequest][100] | Updates a request in a collection |
| [updateRequestComment][103] | Updates a comment on a request |

</details>

<details open>
<summary><strong>Responses</strong> - Manage responses for requests</summary>

| Function | Description |
|----------|-------------|
| [createResponse][106] | Creates a response in a collection |
| [createResponseComment][109] | Creates a comment on a response |
| [deleteResponse][112] | Deletes a response in a collection |
| [deleteResponseComment][115] | Deletes a comment from a response |
| [getResponse][118] | Gets information about a response in a collection |
| [getResponseComments][121] | Gets all comments left by users in a response |
| [updateResponse][124] | Updates a response in a collection |
| [updateResponseComment][127] | Updates a comment on a response |

</details>

<details open>
<summary><strong>Workspaces</strong> - Manage Postman workspaces</summary>

| Function | Description |
|----------|-------------|
| [createWorkspace][130] | Creates a new workspace |
| [deleteWorkspace][133] | Deletes an existing workspace |
| [getWorkspace][136] | Gets information about a workspace |
| [getWorkspaces][139] | Gets all workspaces |
| [getWorkspaceTags][142] | Gets all tags associated with a workspace |
| [updateWorkspace][145] | Updates a workspace |
| [updateWorkspaceTags][148] | Updates a workspace's associated tags |

</details>

<details open>
<summary><strong>Specs</strong> - Manage API specifications (OpenAPI, AsyncAPI)</summary>

| Function | Description |
|----------|-------------|
| [createSpec][151] | Creates an API specification in Postman's Spec Hub |
| [createSpecFile][154] | Creates an API specification file |
| [createSpecGeneration][157] | Generates a collection from an API specification |
| [deleteSpec][160] | Deletes an API specification |
| [deleteSpecFile][163] | Deletes a file in an API specification |
| [getSpec][166] | Gets information about a specific API specification |
| [getSpecDefinition][169] | Gets the complete contents of an API specification's definition |
| [getSpecFile][172] | Gets the contents of an API specification's file |
| [getSpecFiles][175] | Gets all the files in an API specification |
| [getSpecGenerations][178] | Gets a list of collections generated from a spec |
| [getSpecs][181] | Gets all API specifications in a workspace |
| [getSpecTaskStatus][184] | Gets the status of an asynchronous API specification task |
| [modifySpec][187] | Updates an API specification's properties |
| [modifySpecFile][190] | Updates an API specification's file |
| [syncSpecWithCollection][193] | Syncs a spec with a collection |

</details>

<details open>
<summary><strong>Environments</strong> - Manage Postman environments and variables</summary>

| Function | Description |
|----------|-------------|
| [createEnvironment][196] | Creates a new environment |
| [deleteEnvironment][199] | Deletes an environment |
| [getEnvironment][202] | Gets information about an environment |
| [getEnvironments][205] | Gets all environments |
| [modifyEnvironment][208] | Updates an environment using JSON Patch operations (RFC 6902) |

</details>

<details open>
<summary><strong>Mocks</strong> - Manage mock servers and server responses</summary>

| Function | Description |
|----------|-------------|
| [createMock][211] | Creates a mock server in a collection |
| [createMockPublish][214] | Publishes a mock server (sets Access Control to public) |
| [createMockServerResponse][217] | Creates a server response for a mock server |
| [deleteMock][220] | Deletes a mock server |
| [deleteMockServerResponse][223] | Deletes a mock server's server response |
| [deleteMockUnpublish][226] | Unpublishes a mock server (sets Access Control to private) |
| [getMock][229] | Gets information about a mock server |
| [getMockCallLogs][232] | Gets a mock server's call logs |
| [getMocks][235] | Gets all mock servers |
| [getMockServerResponse][238] | Gets information about a server response |
| [getMockServerResponses][241] | Gets all of a mock server's server responses |
| [updateMock][244] | Updates a mock server |
| [updateMockServerResponse][247] | Updates a mock server's server response |

</details>

<details open>
<summary><strong>Tags</strong> - Query and manage tags across resources</summary>

| Function | Description |
|----------|-------------|
| [getTagEntities][250] | Gets Postman elements (entities) by a given tag |

</details>

<details open>
<summary><strong>Users</strong> - Get authenticated user information</summary>

| Function | Description |
|----------|-------------|
| [getAuthenticatedUser][253] | Gets information about the authenticated user |

</details>

<details open>
<summary><strong>Core Utilities</strong> - Internal utility functions used across modules</summary>

| Function | Description |
|----------|-------------|
| [buildAxiosConfig][255] | Builds an Axios config for Postman API requests |
| [buildQueryString][257] | Builds a query string from parameters object |
| [executeRequest][259] | Executes an axios request and throws an error for non-2xx responses. |
| [getContentFS][261] | Reads file content from the filesystem and returns it in the format expected by Postman API |
| [utils][263] | Builds a UID from a user ID and an object ID |
| [validateId][265] | Validates a standard ID (UUID format) |
| [validateUid][267] | Validates a UID (userId-UUID format) |

</details>


## getCollections

Gets all collections
Postman API endpoint and method: GET /collections

### Parameters

*   `workspaceId` **[string][270]?** The workspace's ID (optional, default `null`)
*   `name` **[string][270]?** Filter results by collections that match the given name (optional, default `null`)
*   `limit` **[number][271]?** The maximum number of rows to return in the response (optional, default `null`)
*   `offset` **[number][271]?** The zero-based offset of the first item to return (optional, default `null`)

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

Returns **[Promise][272]** Axios response with collections array and meta information

## createCollection

Creates a collection
Postman API endpoint and method: POST /collections

### Parameters

*   `collection` **[Object][273]** The collection object following Postman Collection v2.1.0 schema

    *   `collection.info` **[string][270]** Information about the collection

        *   `collection.info.name` **[string][270]** The collection's name
        *   `collection.info.description` **[string][270]?** The collection's description
        *   `collection.info.schema` **[string][270]?** Schema version (e.g., '[https://schema.getpostman.com/json/collection/v2.1.0/collection.json][274]')
    *   `collection.item` **[Array][275]?** Array of folders and requests in the collection
*   `workspaceId` **[string][270]?** The workspace ID in which to create the collection. If not provided, creates in default workspace. (optional, default `null`)

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
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830'
);
```

Returns **[Promise][272]** Axios response with collection id and uid

## getCollection

Gets a collection by ID
Postman API endpoint and method: GET /collections/{collectionId}

### Parameters

*   `collectionId` **[string][270]** The collection's ID
*   `access_key` **[string][270]?** A collection's read-only access key for public collections (optional, default `null`)
*   `model` **[string][270]?** Return minimal model ('minimal' returns only root-level IDs) (optional, default `null`)

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

Returns **[Promise][272]** Axios response with full collection data

## updateCollection

Replaces a collection's data
Postman API endpoint and method: PUT /collections/{collectionId}

### Parameters

*   `collectionId` **[string][270]** The collection's ID
*   `collection` **[Object][273]** The complete collection object following Postman Collection v2.1.0 schema

    *   `collection.info` **[Object][273]** Information about the collection

        *   `collection.info.name` **[string][270]** The collection's name
        *   `collection.info.description` **[string][270]?** The collection's description
    *   `collection.item` **[Array][275]?** Array of folders and requests in the collection
*   `prefer` **[string][270]?** Set to 'respond-async' for asynchronous update (returns immediately) (optional, default `null`)

### Examples

```javascript
// Replace a collection's data
const response = await updateCollection('bf5cb6e7-0a1e-4b82-a577-b2068a70f830', {
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
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  collectionData,
  'respond-async'
);
```

Returns **[Promise][272]** Axios response with updated collection

## modifyCollection

Updates part of a collection
Postman API endpoint and method: PATCH /collections/{collectionId}

### Parameters

*   `collectionId` **[string][270]** The collection's ID
*   `collection` **[Object][273]** Partial collection object with only the fields to update

    *   `collection.info` **[Object][273]?** Collection info to update

        *   `collection.info.name` **[string][270]?** Update the collection's name
        *   `collection.info.description` **[string][270]?** Update the collection's description

### Examples

```javascript
// Update only the collection name
const response = await modifyCollection('bf5cb6e7-0a1e-4b82-a577-b2068a70f830', {
  info: {
    name: 'New Collection Name'
  }
});
```

```javascript
// Update collection description
const response = await modifyCollection('bf5cb6e7-0a1e-4b82-a577-b2068a70f830', {
  info: {
    description: 'Updated description text'
  }
});
```

Returns **[Promise][272]** Axios response with updated collection

## deleteCollection

Deletes a collection
Postman API endpoint and method: DELETE /collections/{collectionId}

### Parameters

*   `collectionId` **[string][270]** The collection's ID

### Examples

```javascript
// Delete a collection
const response = await deleteCollection('bf5cb6e7-0a1e-4b82-a577-b2068a70f830');
console.log(response.data.collection);
```

Returns **[Promise][272]** Axios response with deletion confirmation

## createFolder

Creates a folder in a collection
Postman API endpoint and method: POST /collections/{collectionId}/folders

### Parameters

*   `collectionId` **[string][270]** The collection's ID
*   `folderData` **[Object][273]** The folder data

    *   `folderData.name` **[string][270]** (Required) The folder's name
    *   `folderData.description` **[string][270]?** The folder's description
    *   `folderData.parentFolderId` **[string][270]?** The ID of the parent folder to nest this folder in

### Examples

```javascript
// Create a simple folder
const response = await createFolder('bf5cb6e7-0a1e-4b82-a577-b2068a70f830', {
  name: 'API Endpoints'
});
```

```javascript
// Create a folder with description
const response = await createFolder('bf5cb6e7-0a1e-4b82-a577-b2068a70f830', {
  name: 'Authentication',
  description: 'Endpoints related to user authentication'
});
```

```javascript
// Create a nested folder
const response = await createFolder('bf5cb6e7-0a1e-4b82-a577-b2068a70f830', {
  name: 'Sub-folder',
  parentFolderId: 'parent-folder-id'
});
```

Returns **[Promise][272]** Axios response with created folder data

## getFolder

Gets information about a folder in a collection
Postman API endpoint and method: GET /collections/{collectionId}/folders/{folderId}

### Parameters

*   `collectionId` **[string][270]** The collection's ID
*   `folderId` **[string][270]** The folder's ID
*   `ids` **[string][270]?** Set to 'true' to return only folder item IDs (optional, default `null`)
*   `uid` **[string][270]?** Set to 'true' to return full UIDs for folder items (optional, default `null`)
*   `populate` **[string][270]?** Set to 'true' to return full folder items with details (optional, default `null`)

### Examples

```javascript
// Get folder information
const response = await getFolder('bf5cb6e7-0a1e-4b82-a577-b2068a70f830', 'e650c45b-39a2-41cd-b8d2-3c021b951ec2');
console.log(response.data.data);
```

```javascript
// Get folder with only item IDs
const response = await getFolder('bf5cb6e7-0a1e-4b82-a577-b2068a70f830', 'e650c45b-39a2-41cd-b8d2-3c021b951ec2', 'true');
```

```javascript
// Get folder with full item details
const response = await getFolder(
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  'e650c45b-39a2-41cd-b8d2-3c021b951ec2',
  null,
  null,
  'true'
);
```

Returns **[Promise][272]** Axios response with folder data

## updateFolder

Updates a folder in a collection
Postman API endpoint and method: PUT /collections/{collectionId}/folders/{folderId}

### Parameters

*   `collectionId` **[string][270]** The collection's ID
*   `folderId` **[string][270]** The folder's ID
*   `folderData` **[Object][273]** The folder data to update

    *   `folderData.name` **[string][270]?** The folder's new name
    *   `folderData.description` **[string][270]?** The folder's new description

### Examples

```javascript
// Update folder name
const response = await updateFolder(
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  'e650c45b-39a2-41cd-b8d2-3c021b951ec2',
  { name: 'Updated Folder Name' }
);
```

```javascript
// Update folder name and description
const response = await updateFolder(
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  'e650c45b-39a2-41cd-b8d2-3c021b951ec2',
  {
    name: 'User Management',
    description: 'All user-related API endpoints'
  }
);
```

Returns **[Promise][272]** Axios response with updated folder data

## deleteFolder

Deletes a folder in a collection
Postman API endpoint and method: DELETE /collections/{collectionId}/folders/{folderId}

### Parameters

*   `collectionId` **[string][270]** The collection's ID
*   `folderId` **[string][270]** The folder's ID

### Examples

```javascript
// Delete a folder
const response = await deleteFolder('bf5cb6e7-0a1e-4b82-a577-b2068a70f830', 'e650c45b-39a2-41cd-b8d2-3c021b951ec2');
console.log(response.data.folder);
```

Returns **[Promise][272]** Axios response with deletion confirmation

## getCollectionComments

Gets all comments left by users in a collection
Postman API endpoint and method: GET /collections/{collectionUid}/comments

### Parameters

*   `collectionUid` **[string][270]** The collection's UID (format: userId-collectionId)

### Examples

```javascript
// Get all comments for a collection
const response = await getCollectionComments('2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830');
console.log(response.data.data);
```

Returns **[Promise][272]** Axios response with array of comments

## createCollectionComment

Creates a comment on a collection
Postman API endpoint and method: POST /collections/{collectionUid}/comments

### Parameters

*   `collectionUid` **[string][270]** The collection's UID (format: userId-collectionId)
*   `commentData` **[Object][273]** The comment data

    *   `commentData.body` **[string][270]** (Required) The contents of the comment. Max 10,000 characters.
    *   `commentData.threadId` **[number][271]?** The comment's thread ID. Include this to create a reply on an existing comment.
    *   `commentData.tags` **[Object][273]?** Information about users tagged in the body comment

        *   `commentData.tags.userName` **[Object][273]** Tagged user info. Key is the user's Postman username (e.g., '@user-postman')

            *   `commentData.tags.userName.type` **[string][270]** Must be 'user'
            *   `commentData.tags.userName.id` **[string][270]** The user's ID

### Examples

```javascript
// Create a simple comment
const response = await createCollectionComment(
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  {
    body: 'This collection is well organized!'
  }
);
```

```javascript
// Create a comment with user tags
const response = await createCollectionComment(
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
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
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  {
    body: 'I agree with this suggestion.',
    threadId: 12345
  }
);
```

Returns **[Promise][272]** Axios response with created comment data

## updateCollectionComment

Updates a comment on a collection
Postman API endpoint and method: PUT /collections/{collectionUid}/comments/{commentId}

### Parameters

*   `collectionUid` **[string][270]** The collection's UID (format: userId-collectionId)
*   `commentId` **[string][270]** The comment's ID
*   `commentData` **[Object][273]** The comment data to update

    *   `commentData.body` **[string][270]?** The updated contents of the comment. Max 10,000 characters.
    *   `commentData.tags` **[Object][273]?** Updated information about users tagged in the body comment

        *   `commentData.tags.userName` **[Object][273]** Tagged user info. Key is the user's Postman username (e.g., '@user-postman')

            *   `commentData.tags.userName.type` **[string][270]** Must be 'user'
            *   `commentData.tags.userName.id` **[string][270]** The user's ID

### Examples

```javascript
// Update a comment's body
const response = await updateCollectionComment(
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  '12345',
  {
    body: 'Updated comment text'
  }
);
```

```javascript
// Update a comment with new tags
const response = await updateCollectionComment(
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
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

Returns **[Promise][272]** Axios response with updated comment data

## deleteCollectionComment

Deletes a comment from a collection
Postman API endpoint and method: DELETE /collections/{collectionUid}/comments/{commentId}

### Parameters

*   `collectionUid` **[string][270]** The collection's UID (format: userId-collectionId)
*   `commentId` **[string][270]** The comment's ID

### Examples

```javascript
// Delete a comment
const response = await deleteCollectionComment(
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  '12345'
);
console.log(response.data.comment);
```

Returns **[Promise][272]** Axios response with deletion confirmation

## getFolderComments

Gets all comments left by users in a folder
Postman API endpoint and method: GET /collections/{collectionUid}/folders/{folderUid}/comments

### Parameters

*   `collectionUid` **[string][270]** The collection's UID (format: userId-collectionId)
*   `folderUid` **[string][270]** The folder's UID (format: userId-folderId)

### Examples

```javascript
// Get all comments for a folder
const response = await getFolderComments('2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830', '2464332-e650c45b-39a2-41cd-b8d2-3c021b951ec2'
);
console.log(response.data.data);
```

Returns **[Promise][272]** Axios response with array of comments

## createFolderComment

Creates a comment on a folder
Postman API endpoint and method: POST /collections/{collectionUid}/folders/{folderUid}/comments

### Parameters

*   `collectionUid` **[string][270]** The collection's UID (format: userId-collectionId)
*   `folderUid` **[string][270]** The folder's UID (format: userId-folderId)
*   `commentData` **[Object][273]** The comment data

    *   `commentData.body` **[string][270]** (Required) The contents of the comment. Max 10,000 characters.
    *   `commentData.threadId` **[number][271]?** The comment's thread ID. Include this to create a reply on an existing comment.
    *   `commentData.tags` **[Object][273]?** Information about users tagged in the body comment

        *   `commentData.tags.userName` **[Object][273]** Tagged user info. Key is the user's Postman username (e.g., '@user-postman')

            *   `commentData.tags.userName.type` **[string][270]** Must be 'user'
            *   `commentData.tags.userName.id` **[string][270]** The user's ID

### Examples

```javascript
// Create a simple comment
const response = await createFolderComment('2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830', '2464332-e650c45b-39a2-41cd-b8d2-3c021b951ec2',
  {
    body: 'This looks great!'
  }
);
```

```javascript
// Create a comment with user tags
const response = await createFolderComment('2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830', '2464332-e650c45b-39a2-41cd-b8d2-3c021b951ec2',
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
const response = await createFolderComment('2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830', '2464332-e650c45b-39a2-41cd-b8d2-3c021b951ec2',
  {
    body: 'I agree with this suggestion.',
    threadId: 12345
  }
);
```

Returns **[Promise][272]** Axios response

## updateFolderComment

Updates a comment on a folder
Postman API endpoint and method: PUT /collections/{collectionUid}/folders/{folderUid}/comments/{commentId}

### Parameters

*   `collectionUid` **[string][270]** The collection's UID (format: userId-collectionId)
*   `folderUid` **[string][270]** The folder's UID (format: userId-folderId)
*   `commentId` **[string][270]** The comment's ID
*   `commentData` **[Object][273]** The comment data to update

    *   `commentData.body` **[string][270]?** The updated contents of the comment. Max 10,000 characters.
    *   `commentData.tags` **[Object][273]?** Updated information about users tagged in the body comment

        *   `commentData.tags.userName` **[Object][273]** Tagged user info. Key is the user's Postman username (e.g., '@user-postman')

            *   `commentData.tags.userName.type` **[string][270]** Must be 'user'
            *   `commentData.tags.userName.id` **[string][270]** The user's ID

### Examples

```javascript
// Update a folder comment
const response = await updateFolderComment('2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830', '2464332-e650c45b-39a2-41cd-b8d2-3c021b951ec2',
  '12345',
  {
    body: 'Updated comment text'
  }
);
```

```javascript
// Update with new tags
const response = await updateFolderComment('2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830', '2464332-e650c45b-39a2-41cd-b8d2-3c021b951ec2',
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

Returns **[Promise][272]** Axios response with updated comment data

## deleteFolderComment

Deletes a comment from a folder
Postman API endpoint and method: DELETE /collections/{collectionUid}/folders/{folderUid}/comments/{commentId}

### Parameters

*   `collectionUid` **[string][270]** The collection's UID (format: userId-collectionId)
*   `folderUid` **[string][270]** The folder's UID (format: userId-folderId)
*   `commentId` **[string][270]** The comment's ID

### Examples

```javascript
// Delete a folder comment
const response = await deleteFolderComment('2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830', '2464332-e650c45b-39a2-41cd-b8d2-3c021b951ec2',
  '12345'
);
console.log(response.data.comment);
```

Returns **[Promise][272]** Axios response with deletion confirmation

## syncCollectionWithSpec

Sync collection with spec
Postman API endpoint and method: PUT /collections/{collectionUid}/synchronizations

### Parameters

*   `collectionUid` **[string][270]** The collection's UID (format: userId-collectionId)
*   `specId` **[string][270]** The spec's ID to sync with

### Examples

```javascript
// Sync a collection with an API specification
const response = await syncCollectionWithSpec('2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830', 'a0c5ad64-211e-442a-b857-22b7d438d478'
);
console.log(response.data);
```

Returns **[Promise][272]** Axios response with sync status

## getCollectionTags

Gets all tags associated with a collection
Postman API endpoint and method: GET /collections/{collectionUid}/tags

### Parameters

*   `collectionUid` **[string][270]** The collection's UID (format: userId-collectionId)

### Examples

```javascript
// Get all tags for a collection
const response = await getCollectionTags('2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830');
console.log(response.data.tags);
```

Returns **[Promise][272]** Axios response with array of tags

## updateCollectionTags

Updates all tags associated with a collection (replaces existing tags)
Postman API endpoint and method: PUT /collections/{collectionUid}/tags

### Parameters

*   `collectionUid` **[string][270]** The collection's UID (format: userId-collectionId)
*   `tags` **[Array][275]** Array of tag objects with 'slug' property (maximum 5 tags)

    *   `tags[].slug` **[string][270]** The tag's slug/name

### Examples

```javascript
// Replace collection tags
const response = await updateCollectionTags(
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
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
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  []
);
```

Returns **[Promise][272]** Axios response with updated tags

## createCollectionGeneration

Generates a spec from a collection
Postman API endpoint and method: POST /collections/{collectionUid}/generations/{elementType}

### Parameters

*   `collectionUid` **[string][270]** The collection's UID (format: userId-collectionId)
*   `elementType` **[string][270]** The element type (typically 'spec')
*   `name` **[string][270]** The API specification's name
*   `type` **[string][270]** The specification's type (e.g., 'OPENAPI:3.0', 'OPENAPI:3.1', 'ASYNCAPI:2.6.0')
*   `format` **[string][270]** The format of the API specification ('JSON' or 'YAML')

### Examples

```javascript
// Generate an OpenAPI 3.0 spec in JSON format
const response = await createCollectionGeneration(
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
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
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  'spec',
  'My API v2',
  'OPENAPI:3.1',
  'YAML'
);
```

Returns **[Promise][272]** Axios response with taskId and url for the async generation task

## getCollectionGenerations

Gets the list of specs generated from a collection
Postman API endpoint and method: GET /collections/{collectionUid}/generations/{elementType}

### Parameters

*   `collectionUid` **[string][270]** The collection's UID (format: userId-collectionId)
*   `elementType` **[string][270]** The element type (typically 'spec')

### Examples

```javascript
// Get all specs generated from a collection
const response = await getCollectionGenerations(
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  'spec'
);
console.log(response.data.data);
console.log(response.data.meta);
```

Returns **[Promise][272]** Axios response with array of generated specs and pagination metadata

## getCollectionTaskStatus

Gets the status of a collection generation task
Postman API endpoint and method: GET /collections/{collectionUid}/tasks/{taskId}

### Parameters

*   `collectionUid` **[string][270]** The collection's UID (format: userId-collectionId)
*   `taskId` **[string][270]** The task ID returned from createCollectionGeneration

### Examples

```javascript
// Check the status of a generation task
const response = await getCollectionTaskStatus(
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830'
);
console.log(response.data.status);
```

```javascript
// Poll for task completion
const taskId = 'bf5cb6e7-0a1e-4b82-a577-b2068a70f830';
const checkStatus = async () => {
  const response = await getCollectionTaskStatus(
    '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
    taskId
  );
  if (response.data.status === 'completed') {
    console.log('Generation complete!');
  } else if (response.data.status === 'failed') {
    console.error('Generation failed');
  }
};
```

Returns **[Promise][272]** Axios response with task status and progress information

## getCollectionForks

Gets all forked collections
Postman API endpoint and method: GET /collections/collection-forks

### Parameters

*   `cursor` **[string][270]?** The pointer to the first record of the set of paginated results (optional, default `null`)
*   `direction` **[string][270]?** Sort order: 'asc' or 'desc' based on creation date (optional, default `null`)
*   `limit` **[number][271]?** The maximum number of rows to return (defaults to 10) (optional, default `null`)

### Examples

```javascript
// Get all forked collections
const response = await getCollectionForks();
console.log(response.data.forks);
```

```javascript
// Get forked collections with pagination
const response = await getCollectionForks(null, 'desc', 20);
```

```javascript
// Get forked collections with cursor-based pagination
const response = await getCollectionForks('cursor-abc-123', 'asc', 10);
```

Returns **[Promise][272]** Axios response with array of forked collections

## createCollectionFork

Creates a fork from an existing collection
Postman API endpoint and method: POST /collections/fork/{collectionId}

### Parameters

*   `collectionId` **[string][270]** The collection's ID to fork
*   `workspaceId` **[string][270]** The workspace ID in which to fork the collection (required)
*   `label` **[string][270]** The fork's label (required)

### Examples

```javascript
// Create a fork of a collection
const response = await createCollectionFork(
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  'My Fork Label'
);
console.log(response.data.collection.fork);
```

```javascript
// Create a fork with a descriptive label
const response = await createCollectionFork(
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  'Feature Branch - Authentication Updates'
);
```

Returns **[Promise][272]** Axios response with forked collection data including fork metadata

## mergeCollectionFork

Merges a forked collection back into its parent collection
Postman API endpoint and method: POST /collections/merge
Note: This endpoint is deprecated. Requires Editor role for the parent collection.

### Parameters

*   `source` **[string][270]** The source (forked) collection's unique ID
*   `destination` **[string][270]** The destination (parent) collection's unique ID
*   `strategy` **[string][270]?** Merge strategy: 'deleteSource' or 'updateSourceWithDestination' (default) (optional, default `null`)

### Examples

```javascript
// Merge fork back to parent (default strategy)
const response = await mergeCollectionFork(
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830'
);
console.log(response.data.collection);
```

```javascript
// Merge and delete source fork
const response = await mergeCollectionFork(
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  'deleteSource'
);
```

```javascript
// Merge with updateSourceWithDestination strategy
const response = await mergeCollectionFork(
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  'updateSourceWithDestination'
);
```

Returns **[Promise][272]** Axios response with merged collection ID and UID

## getEnvironments

Gets all environments
Postman API endpoint and method: GET /environments

### Parameters

*   `workspaceId` **[string][270]?** Return only results found in the given workspace ID (optional, default `null`)

### Examples

```javascript
// Get all environments
const response = await getEnvironments();
console.log(response.data.environments);
```

```javascript
// Get environments in a specific workspace
const response = await getEnvironments('bf5cb6e7-0a1e-4b82-a577-b2068a70f830');
```

Returns **[Promise][272]** Axios response with environments array

## createEnvironment

Creates a new environment
Postman API endpoint and method: POST /environments

### Parameters

*   `environmentData` **[Object][273]** The environment object containing name and optional values

    *   `environmentData.name` **[string][270]** (Required) The environment's name
    *   `environmentData.values` **[Array][275]?** Array of environment variable objects
*   `workspaceId` **[string][270]?** A workspace ID in which to create the environment (optional, default `null`)
*   `string` **[string][270]** \[].key] - The variable's key name
*   `string` **[string][270]** \[].value] - The variable's value
*   `string` **[string][270]** \[].type] - The variable type ('default' or 'secret')
*   `boolean` **[boolean][276]** \[].enabled] - Whether the variable is enabled

### Examples

```javascript
// Create a simple environment
const response = await createEnvironment({
  name: 'Production'
});
```

```javascript
// Create an environment with variables
const response = await createEnvironment({
  name: 'Development',
  values: [
    { key: 'base_url', value: 'https://api.dev.example.com', type: 'default', enabled: true },
    { key: 'api_key', value: 'dev_key_123', type: 'secret', enabled: true }
  ]
});
```

```javascript
// Create environment in specific workspace
const response = await createEnvironment(
  {
    name: 'Staging',
    values: [
      { key: 'base_url', value: 'https://api.staging.example.com', enabled: true }
    ]
  },
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830'
);
```

Returns **[Promise][272]** Axios response with created environment data

## getEnvironment

Gets information about an environment
Postman API endpoint and method: GET /environments/{environmentId}

### Parameters

*   `environmentId` **[string][270]** The environment's ID

### Examples

```javascript
// Get environment by ID
const response = await getEnvironment('5c6b4f4d-8a24-45f4-8b02-1f07c306be32');
console.log(response.data.environment);
console.log(response.data.environment.values);
```

Returns **[Promise][272]** Axios response with environment data including all variables

## modifyEnvironment

Updates an environment using JSON Patch operations (RFC 6902)
Postman API endpoint and method: PATCH /environments/{environmentId}

### Parameters

*   `environmentId` **[string][270]** The environment's ID
*   `patchOperations` **[Array][275]** Array of JSON Patch operations

    *   `patchOperations[].op` **[string][270]** The operation ('add', 'remove', 'replace', 'copy', 'move', 'test')
    *   `patchOperations[].path` **[string][270]** The JSON path to modify
    *   `patchOperations[].value` **any?** The value for add/replace operations

### Examples

```javascript
// Update environment name
const response = await modifyEnvironment('5c6b4f4d-8a24-45f4-8b02-1f07c306be32', [
  { op: 'replace', path: '/name', value: 'Production Environment' }
]);
```

```javascript
// Add a new variable
const response = await modifyEnvironment('5c6b4f4d-8a24-45f4-8b02-1f07c306be32', [
  { 
    op: 'add', 
    path: '/values/0', 
    value: { key: 'api_key', value: 'secret_key', type: 'secret', enabled: true } 
  }
]);
```

```javascript
// Replace a variable's value
const response = await modifyEnvironment('5c6b4f4d-8a24-45f4-8b02-1f07c306be32', [
  { op: 'replace', path: '/values/0/value', value: 'new_api_key' }
]);
```

```javascript
// Remove a variable
const response = await modifyEnvironment('5c6b4f4d-8a24-45f4-8b02-1f07c306be32', [
  { op: 'remove', path: '/values/2' }
]);
```

```javascript
// Multiple operations at once
const response = await modifyEnvironment('5c6b4f4d-8a24-45f4-8b02-1f07c306be32', [
  { op: 'replace', path: '/name', value: 'Updated Name' },
  { op: 'replace', path: '/values/0/value', value: 'updated_value' },
  { op: 'add', path: '/values/-', value: { key: 'new_var', value: 'value', enabled: true } }
]);
```

Returns **[Promise][272]** Axios response with updated environment data

## deleteEnvironment

Deletes an environment
Postman API endpoint and method: DELETE /environments/{environmentId}

### Parameters

*   `environmentId` **[string][270]** The environment's ID

### Examples

```javascript
// Delete an environment
const response = await deleteEnvironment('5c6b4f4d-8a24-45f4-8b02-1f07c306be32');
console.log(response.data.environment);
```

Returns **[Promise][272]** Axios response with deletion confirmation

## getMocks

Gets all mock servers
Postman API endpoint and method: GET /mocks

### Parameters

*   `teamId` **[string][270]?** Return only mock servers that belong to the given team ID (optional, default `null`)
*   `workspaceId` **[string][270]?** Return only mock servers in the given workspace (optional, default `null`)

### Examples

```javascript
// Get all mocks
const response = await getMocks();
console.log(response.data.mocks);
```

```javascript
// Get mocks in a workspace
const response = await getMocks(null, 'bf5cb6e7-0a1e-4b82-a577-b2068a70f830');
```

```javascript
// Get mocks for a team
const response = await getMocks('team-id-456');
```

Returns **[Promise][272]** Axios response with mocks array

## createMock

Creates a mock server in a collection
Postman API endpoint and method: POST /mocks

### Parameters

*   `mockData` **[Object][273]** The mock object containing collection and optional configuration

    *   `mockData.collection` **[string][270]** (Required) The collection ID or UID
    *   `mockData.name` **[string][270]?** The mock server's name
    *   `mockData.environment` **[string][270]?** The environment ID to use with the mock server
    *   `mockData.private` **[boolean][276]?** Whether the mock server is private (default: false)
*   `workspaceId` **[string][270]** A workspace ID in which to create the mock server (required)

### Examples

```javascript
// Create a simple mock server
const response = await createMock(
  {
    collection: 'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
    name: 'My Mock Server'
  },
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830'
);
console.log(response.data.mock.mockUrl);
```

```javascript
// Create a private mock with environment
const response = await createMock(
  {
    collection: 'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
    name: 'Private Mock',
    environment: '5c6b4f4d-8a24-45f4-8b02-1f07c306be32',
    private: true
  },
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830'
);
```

Returns **[Promise][272]** Axios response with created mock server data including mockUrl

## getMock

Gets information about a mock server
Postman API endpoint and method: GET /mocks/{mockId}

### Parameters

*   `mockId` **[string][270]** The mock's ID

### Examples

```javascript
// Get mock server information
const response = await getMock('bf5cb6e7-0a1e-4b82-a577-b2068a70f830');
console.log(response.data.mock);
console.log(response.data.mock.mockUrl);
```

Returns **[Promise][272]** Axios response with mock server details including mockUrl

## updateMock

Updates a mock server
Postman API endpoint and method: PUT /mocks/{mockId}

### Parameters

*   `mockId` **[string][270]** The mock's ID
*   `mockData` **[Object][273]** The mock object with fields to update

    *   `mockData.name` **[string][270]?** The mock server's new name
    *   `mockData.environment` **[string][270]?** The environment ID to use
    *   `mockData.private` **[boolean][276]?** Whether the mock server is private
    *   `mockData.collection` **[string][270]?** The collection ID (required by API)

### Examples

```javascript
// Update mock server name
const response = await updateMock('bf5cb6e7-0a1e-4b82-a577-b2068a70f830', {
  collection: 'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  name: 'Updated Mock Name'
});
```

```javascript
// Make mock server private
const response = await updateMock('bf5cb6e7-0a1e-4b82-a577-b2068a70f830', {
  collection: 'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  private: true
});
```

Returns **[Promise][272]** Axios response with updated mock server data

## deleteMock

Deletes a mock server
Postman API endpoint and method: DELETE /mocks/{mockId}

### Parameters

*   `mockId` **[string][270]** The mock's ID

### Examples

```javascript
// Delete a mock server
const response = await deleteMock('bf5cb6e7-0a1e-4b82-a577-b2068a70f830');
console.log(response.data.mock);
```

Returns **[Promise][272]** Axios response with deletion confirmation

## getMockCallLogs

Gets a mock server's call logs
Postman API endpoint and method: GET /mocks/{mockId}/call-logs

### Parameters

*   `mockId` **[string][270]** The mock's ID
*   `limit` **[number][271]?** The maximum number of rows to return (defaults to 100) (optional, default `null`)
*   `cursor` **[string][270]?** The pointer to the first record of the set of paginated results (optional, default `null`)
*   `until` **[string][270]?** Return only results created until this given time (ISO 8601 format) (optional, default `null`)
*   `since` **[string][270]?** Return only results created since the given time (ISO 8601 format) (optional, default `null`)
*   `responseStatusCode` **[number][271]?** Return only call logs that match the given HTTP response status code (e.g., 200, 404) (optional, default `null`)
*   `responseType` **[string][270]?** Return only call logs that match the given response type (optional, default `null`)
*   `requestMethod` **[string][270]?** Return only call logs that match the given HTTP method (e.g., 'GET', 'POST') (optional, default `null`)
*   `requestPath` **[string][270]?** Return only call logs that match the given request path (optional, default `null`)
*   `sort` **[string][270]?** Sort the results by the given value (e.g., 'servedAt') (optional, default `null`)
*   `direction` **[string][270]?** Sort in ascending ('asc') or descending ('desc') order (optional, default `null`)
*   `include` **[string][270]?** Include call log records with header and body data (comma-separated: 'request.headers,request.body,response.headers,response.body') (optional, default `null`)

### Examples

```javascript
// Get call logs for a mock
const response = await getMockCallLogs('bf5cb6e7-0a1e-4b82-a577-b2068a70f830');
console.log(response.data.logs);
```

```javascript
// Get filtered call logs
const response = await getMockCallLogs(
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  50,
  null,
  null,
  null,
  404,
  null,
  'GET'
);
```

```javascript
// Get call logs with headers and body
const response = await getMockCallLogs(
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  10,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  'servedAt',
  'desc',
  'request.headers,response.body'
);
```

Returns **[Promise][272]** Axios response with call logs array and pagination metadata

## createMockPublish

Publishes a mock server (sets Access Control to public)
Postman API endpoint and method: POST /mocks/{mockId}/publish

### Parameters

*   `mockId` **[string][270]** The mock's ID

### Examples

```javascript
// Publish a mock server (make it public)
const response = await createMockPublish('bf5cb6e7-0a1e-4b82-a577-b2068a70f830');
console.log(response.data.mock);
```

Returns **[Promise][272]** Axios response with published mock data

## getMockServerResponses

Gets all of a mock server's server responses
Postman API endpoint and method: GET /mocks/{mockId}/server-responses

### Parameters

*   `mockId` **[string][270]** The mock's ID

### Examples

```javascript
// Get all server responses for a mock
const response = await getMockServerResponses('bf5cb6e7-0a1e-4b82-a577-b2068a70f830');
console.log(response.data.serverResponses);
```

Returns **[Promise][272]** Axios response with server responses array

## createMockServerResponse

Creates a server response for a mock server
Postman API endpoint and method: POST /mocks/{mockId}/server-responses

### Parameters

*   `mockId` **[string][270]** The mock's ID
*   `serverResponseData` **[Object][273]** The server response object

    *   `serverResponseData.name` **[string][270]** (Required) The server response's name
    *   `serverResponseData.statusCode` **[number][271]** (Required) The HTTP status code (e.g., 200, 404, 500)
    *   `serverResponseData.body` **[string][270]?** The response body content
    *   `serverResponseData.headers` **[Array][275]?** Array of header objects
    *   `serverResponseData.language` **[string][270]?** The response language (e.g., 'json', 'xml', 'text')

### Examples

```javascript
// Create a server response
const response = await createMockServerResponse('bf5cb6e7-0a1e-4b82-a577-b2068a70f830', {
  name: '200 Success Response',
  statusCode: 200,
  body: JSON.stringify({ message: 'Success' }),
  language: 'json'
});
```

```javascript
// Create an error response
const response = await createMockServerResponse('bf5cb6e7-0a1e-4b82-a577-b2068a70f830', {
  name: '404 Not Found',
  statusCode: 404,
  body: JSON.stringify({ error: 'Not found' })
});
```

Returns **[Promise][272]** Axios response with created server response data

## getMockServerResponse

Gets information about a server response
Postman API endpoint and method: GET /mocks/{mockId}/server-responses/{serverResponseId}

### Parameters

*   `mockId` **[string][270]** The mock's ID
*   `serverResponseId` **[string][270]** The server response's ID

### Examples

```javascript
// Get a server response
const response = await getMockServerResponse('bf5cb6e7-0a1e-4b82-a577-b2068a70f830', 'bf5cb6e7-0a1e-4b82-a577-b2068a70f830');
console.log(response.data.serverResponse);
```

Returns **[Promise][272]** Axios response with server response data

## updateMockServerResponse

Updates a mock server's server response
Postman API endpoint and method: PUT /mocks/{mockId}/server-responses/{serverResponseId}

### Parameters

*   `mockId` **[string][270]** The mock's ID
*   `serverResponseId` **[string][270]** The server response's ID
*   `serverResponseData` **[Object][273]** The server response object with fields to update

    *   `serverResponseData.name` **[string][270]?** The server response's name
    *   `serverResponseData.statusCode` **[number][271]?** The HTTP status code
    *   `serverResponseData.body` **[string][270]?** The response body content
    *   `serverResponseData.headers` **[Array][275]?** Array of header objects

### Examples

```javascript
// Update a server response
const response = await updateMockServerResponse(
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  {
    name: 'Updated Response',
    statusCode: 201,
    body: JSON.stringify({ message: 'Created' })
  }
);
```

Returns **[Promise][272]** Axios response with updated server response data

## deleteMockServerResponse

Deletes a mock server's server response
Postman API endpoint and method: DELETE /mocks/{mockId}/server-responses/{serverResponseId}

### Parameters

*   `mockId` **[string][270]** The mock's ID
*   `serverResponseId` **[string][270]** The server response's ID

### Examples

```javascript
// Delete a server response
const response = await deleteMockServerResponse('bf5cb6e7-0a1e-4b82-a577-b2068a70f830', 'bf5cb6e7-0a1e-4b82-a577-b2068a70f830');
console.log(response.data.serverResponse);
```

Returns **[Promise][272]** Axios response with deletion confirmation

## deleteMockUnpublish

Unpublishes a mock server (sets Access Control to private)
Postman API endpoint and method: DELETE /mocks/{mockId}/unpublish

### Parameters

*   `mockId` **[string][270]** The mock's ID

### Examples

```javascript
// Unpublish a mock server (make it private)
const response = await deleteMockUnpublish('bf5cb6e7-0a1e-4b82-a577-b2068a70f830');
console.log(response.data.mock);
```

Returns **[Promise][272]** Axios response with unpublished mock data

## createRequest

Creates a request in a collection
Postman API endpoint and method: POST /collections/{collectionId}/requests

### Parameters

*   `collectionId` **[string][270]** The collection's ID
*   `requestData` **[Object][273]** The request data

    *   `requestData.name` **[string][270]** (Required) The request's name
    *   `requestData.method` **[string][270]?** The HTTP method (GET, POST, PUT, PATCH, DELETE, etc.)
    *   `requestData.url` **[Object][273]?** The request URL object

        *   `requestData.url.raw` **[string][270]?** The complete URL string
    *   `requestData.header` **[Array][275]?** Array of header objects
    *   `requestData.body` **[Object][273]?** The request body object
    *   `requestData.description` **[string][270]?** The request description
*   `folderId` **[string][270]?** The folder ID in which to create the request. If not provided, creates at collection root. (optional, default `null`)

### Examples

```javascript
// Create a simple GET request
const response = await createRequest('bf5cb6e7-0a1e-4b82-a577-b2068a70f830', {
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
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
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
  'e650c45b-39a2-41cd-b8d2-3c021b951ec2'
);
```

```javascript
// Create a request with description
const response = await createRequest('bf5cb6e7-0a1e-4b82-a577-b2068a70f830', {
  name: 'Update User',
  method: 'PUT',
  url: { raw: 'https://api.example.com/users/:id' },
  description: 'Updates an existing user by ID'
});
```

Returns **[Promise][272]** Axios response with created request data

## getRequest

Gets information about a request in a collection
Postman API endpoint and method: GET /collections/{collectionId}/requests/{requestId}

### Parameters

*   `collectionId` **[string][270]** The collection's ID
*   `requestId` **[string][270]** The request's ID
*   `ids` **[boolean][276]?** If true, returns only the request properties that contain ID values (optional, default `null`)
*   `uid` **[boolean][276]?** If true, returns all IDs in UID format (userId-objectId) (optional, default `null`)
*   `populate` **[boolean][276]?** If true, returns all of a request's contents including full details (optional, default `null`)

### Examples

```javascript
// Get a request by ID
const response = await getRequest('bf5cb6e7-0a1e-4b82-a577-b2068a70f830', 'bf5cb6e7-0a1e-4b82-a577-b2068a70f830');
console.log(response.data.data);
```

```javascript
// Get request with only ID properties
const response = await getRequest('bf5cb6e7-0a1e-4b82-a577-b2068a70f830', 'bf5cb6e7-0a1e-4b82-a577-b2068a70f830', true);
```

```javascript
// Get request with UIDs and full contents
const response = await getRequest(
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  null,
  true,
  true
);
```

Returns **[Promise][272]** Axios response with request data

## updateRequest

Updates a request in a collection
Postman API endpoint and method: PUT /collections/{collectionId}/requests/{requestId}

### Parameters

*   `collectionId` **[string][270]** The collection's ID
*   `requestId` **[string][270]** The request's ID
*   `requestData` **[Object][273]** The request data to update

    *   `requestData.name` **[string][270]?** The request's name
    *   `requestData.method` **[string][270]?** The HTTP method (GET, POST, PUT, PATCH, DELETE, etc.)
    *   `requestData.url` **[Object][273]?** The request URL object

        *   `requestData.url.raw` **[string][270]?** The complete URL string
    *   `requestData.header` **[Array][275]?** Array of header objects
    *   `requestData.body` **[Object][273]?** The request body object
    *   `requestData.description` **[string][270]?** The request description

### Examples

```javascript
// Update request name and method
const response = await updateRequest(
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  {
    name: 'Updated Request Name',
    method: 'POST'
  }
);
```

```javascript
// Update request URL and headers
const response = await updateRequest(
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
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
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
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

Returns **[Promise][272]** Axios response with updated request data

## deleteRequest

Deletes a request in a collection
Postman API endpoint and method: DELETE /collections/{collectionId}/requests/{requestId}

### Parameters

*   `collectionId` **[string][270]** The collection's ID
*   `requestId` **[string][270]** The request's ID

### Examples

```javascript
// Delete a request
const response = await deleteRequest('bf5cb6e7-0a1e-4b82-a577-b2068a70f830', 'bf5cb6e7-0a1e-4b82-a577-b2068a70f830');
console.log(response.data.request);
```

Returns **[Promise][272]** Axios response with deletion confirmation

## getRequestComments

Gets all comments left by users in a request
Postman API endpoint and method: GET /collections/{collectionUid}/requests/{requestUid}/comments

### Parameters

*   `collectionUid` **[string][270]** The collection's UID (format: userId-collectionId)
*   `requestUid` **[string][270]** The request's UID (format: userId-requestId)

### Examples

```javascript
// Get all comments for a request
const response = await getRequestComments(
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830'
);
console.log(response.data.data);
```

Returns **[Promise][272]** Axios response with array of comments

## createRequestComment

Creates a comment on a request
Postman API endpoint and method: POST /collections/{collectionUid}/requests/{requestUid}/comments

### Parameters

*   `collectionUid` **[string][270]** The collection's UID (format: userId-collectionId)
*   `requestUid` **[string][270]** The request's UID (format: userId-requestId)
*   `commentData` **[Object][273]** The comment data

    *   `commentData.body` **[string][270]** (Required) The contents of the comment. Max 10,000 characters.
    *   `commentData.threadId` **[number][271]?** The comment's thread ID. Include this to create a reply on an existing comment.
    *   `commentData.tags` **[Object][273]?** Information about users tagged in the body comment

        *   `commentData.tags.userName` **[Object][273]** Tagged user info. Key is the user's Postman username (e.g., '@user-postman')

            *   `commentData.tags.userName.type` **[string][270]** Must be 'user'
            *   `commentData.tags.userName.id` **[string][270]** The user's ID

### Examples

```javascript
// Create a simple comment
const response = await createRequestComment(
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  {
    body: 'This endpoint needs authentication!'
  }
);
```

```javascript
// Create a comment with user tags
const response = await createRequestComment(
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
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
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  {
    body: 'I agree, authentication added.',
    threadId: 12345
  }
);
```

Returns **[Promise][272]** Axios response with created comment data

## updateRequestComment

Updates a comment on a request
Postman API endpoint and method: PUT /collections/{collectionUid}/requests/{requestUid}/comments/{commentId}

### Parameters

*   `collectionUid` **[string][270]** The collection's UID (format: userId-collectionId)
*   `requestUid` **[string][270]** The request's UID (format: userId-requestId)
*   `commentId` **[string][270]** The comment's ID
*   `commentData` **[Object][273]** The comment data to update

    *   `commentData.body` **[string][270]?** The updated contents of the comment. Max 10,000 characters.
    *   `commentData.tags` **[Object][273]?** Updated information about users tagged in the body comment

        *   `commentData.tags.userName` **[Object][273]** Tagged user info. Key is the user's Postman username (e.g., '@user-postman')

            *   `commentData.tags.userName.type` **[string][270]** Must be 'user'
            *   `commentData.tags.userName.id` **[string][270]** The user's ID

### Examples

```javascript
// Update a comment's body
const response = await updateRequestComment(
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  '12345',
  {
    body: 'Updated: This endpoint now requires authentication'
  }
);
```

```javascript
// Update with new tags
const response = await updateRequestComment(
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
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

Returns **[Promise][272]** Axios response with updated comment data

## deleteRequestComment

Deletes a comment from a request
Postman API endpoint and method: DELETE /collections/{collectionUid}/requests/{requestUid}/comments/{commentId}

### Parameters

*   `collectionUid` **[string][270]** The collection's UID (format: userId-collectionId)
*   `requestUid` **[string][270]** The request's UID (format: userId-requestId)
*   `commentId` **[string][270]** The comment's ID

### Examples

```javascript
// Delete a request comment
const response = await deleteRequestComment(
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  '12345'
);
console.log(response.data.comment);
```

Returns **[Promise][272]** Axios response with deletion confirmation

## validateId

Validates a standard ID (UUID format)

### Parameters

*   `id` **[string][270]** The ID to validate
*   `paramName` **[string][270]** The parameter name for error messages

<!---->

*   Throws **[Error][277]** If the ID is invalid

## validateUid

Validates a UID (userId-UUID format)

### Parameters

*   `uid` **[string][270]** The UID to validate
*   `paramName` **[string][270]** The parameter name for error messages

<!---->

*   Throws **[Error][277]** If the UID is invalid

## buildQueryString

Builds a query string from parameters object

### Parameters

*   `params` **[Object][273]** Object with query parameters

Returns **[string][270]** Query string (e.g., '?key1=value1\&key2=value2')

## getContentFS

Reads file content from the filesystem and returns it in the format expected by Postman API

### Parameters

*   `filePath` **[string][270]** The path to the file

Returns **[Object][273]** Object with content property containing the file content

## utils

Builds a UID from a user ID and an object ID

### Parameters

*   `userId` **([string][270] | [number][271])** The user's ID
*   `objectId` **[string][270]** The object's ID (e.g., collection ID, workspace ID)

Returns **[string][270]** The UID in format: userId-objectId

## createResponse

Creates a response in a collection
Postman API endpoint and method: POST /collections/{collectionId}/responses

### Parameters

*   `collectionId` **[string][270]** The collection's ID
*   `requestId` **[string][270]** The parent request's ID that this response belongs to
*   `responseData` **[Object][273]** The response data

    *   `responseData.name` **[string][270]** (Required) The response's name
    *   `responseData.code` **[number][271]?** The HTTP response status code (e.g., 200, 404, 500)
    *   `responseData.status` **[string][270]?** The HTTP status text (e.g., 'OK', 'Not Found')
    *   `responseData.header` **[Array][275]?** Array of response header objects
    *   `responseData.body` **[string][270]?** The response body content
    *   `responseData.originalRequest` **[Object][273]?** The original request that generated this response

### Examples

```javascript
// Create a simple success response
const response = await createResponse(
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
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
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
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
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
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

Returns **[Promise][272]** Axios response with created response data

## getResponse

Gets information about a response in a collection
Postman API endpoint and method: GET /collections/{collectionId}/responses/{responseId}

### Parameters

*   `collectionId` **[string][270]** The collection's ID
*   `responseId` **[string][270]** The response's ID
*   `ids` **[boolean][276]?** If true, returns only the response properties that contain ID values (optional, default `null`)
*   `uid` **[boolean][276]?** If true, returns all IDs in UID format (userId-objectId) (optional, default `null`)
*   `populate` **[boolean][276]?** If true, returns all of a response's contents including full details (optional, default `null`)

### Examples

```javascript
// Get a response by ID
const response = await getResponse('bf5cb6e7-0a1e-4b82-a577-b2068a70f830', 'bf5cb6e7-0a1e-4b82-a577-b2068a70f830');
console.log(response.data.data);
```

```javascript
// Get response with only ID properties
const response = await getResponse('bf5cb6e7-0a1e-4b82-a577-b2068a70f830', 'bf5cb6e7-0a1e-4b82-a577-b2068a70f830', true);
```

```javascript
// Get response with UIDs and full contents
const response = await getResponse(
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  null,
  true,
  true
);
```

Returns **[Promise][272]** Axios response with response data

## updateResponse

Updates a response in a collection
Postman API endpoint and method: PUT /collections/{collectionId}/responses/{responseId}

### Parameters

*   `collectionId` **[string][270]** The collection's ID
*   `responseId` **[string][270]** The response's ID
*   `responseData` **[Object][273]** The response data to update

    *   `responseData.name` **[string][270]?** The response's name
    *   `responseData.code` **[number][271]?** The HTTP response status code (e.g., 200, 404, 500)
    *   `responseData.status` **[string][270]?** The HTTP status text (e.g., 'OK', 'Not Found')
    *   `responseData.header` **[Array][275]?** Array of response header objects
    *   `responseData.body` **[string][270]?** The response body content

### Examples

```javascript
// Update response name and status code
const response = await updateResponse(
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  {
    name: '200 Success - Updated',
    code: 200
  }
);
```

```javascript
// Update response body and headers
const response = await updateResponse(
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
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
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  {
    name: '500 Internal Server Error',
    code: 500,
    status: 'Internal Server Error',
    body: JSON.stringify({ error: 'Server error occurred' })
  }
);
```

Returns **[Promise][272]** Axios response with updated response data

## deleteResponse

Deletes a response in a collection
Postman API endpoint and method: DELETE /collections/{collectionId}/responses/{responseId}

### Parameters

*   `collectionId` **[string][270]** The collection's ID
*   `responseId` **[string][270]** The response's ID

### Examples

```javascript
// Delete a response
const response = await deleteResponse('bf5cb6e7-0a1e-4b82-a577-b2068a70f830', 'bf5cb6e7-0a1e-4b82-a577-b2068a70f830');
console.log(response.data.response);
```

Returns **[Promise][272]** Axios response with deletion confirmation

## getResponseComments

Gets all comments left by users in a response
Postman API endpoint and method: GET /collections/{collectionUid}/responses/{responseUid}/comments

### Parameters

*   `collectionUid` **[string][270]** The collection's UID (format: userId-collectionId)
*   `responseUid` **[string][270]** The response's UID (format: userId-responseId)

### Examples

```javascript
// Get all comments for a response
const response = await getResponseComments(
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830'
);
console.log(response.data.data);
```

Returns **[Promise][272]** Axios response with array of comments

## createResponseComment

Creates a comment on a response
Postman API endpoint and method: POST /collections/{collectionUid}/responses/{responseUid}/comments

### Parameters

*   `collectionUid` **[string][270]** The collection's UID (format: userId-collectionId)
*   `responseUid` **[string][270]** The response's UID (format: userId-responseId)
*   `commentData` **[Object][273]** The comment data

    *   `commentData.body` **[string][270]** (Required) The contents of the comment. Max 10,000 characters.
    *   `commentData.threadId` **[number][271]?** The comment's thread ID. Include this to create a reply on an existing comment.
    *   `commentData.tags` **[Object][273]?** Information about users tagged in the body comment

        *   `commentData.tags.userName` **[Object][273]** Tagged user info. Key is the user's Postman username (e.g., '@user-postman')

            *   `commentData.tags.userName.type` **[string][270]** Must be 'user'
            *   `commentData.tags.userName.id` **[string][270]** The user's ID

### Examples

```javascript
// Create a simple comment
const response = await createResponseComment(
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  {
    body: 'This response example is helpful!'
  }
);
```

```javascript
// Create a comment with user tags
const response = await createResponseComment(
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
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
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  {
    body: 'Thanks, I updated the response.',
    threadId: 12345
  }
);
```

Returns **[Promise][272]** Axios response with created comment data

## updateResponseComment

Updates a comment on a response
Postman API endpoint and method: PUT /collections/{collectionUid}/responses/{responseUid}/comments/{commentId}

### Parameters

*   `collectionUid` **[string][270]** The collection's UID (format: userId-collectionId)
*   `responseUid` **[string][270]** The response's UID (format: userId-responseId)
*   `commentId` **[string][270]** The comment's ID
*   `commentData` **[Object][273]** The comment data to update

    *   `commentData.body` **[string][270]?** The updated contents of the comment. Max 10,000 characters.
    *   `commentData.tags` **[Object][273]?** Updated information about users tagged in the body comment

        *   `commentData.tags.userName` **[Object][273]** Tagged user info. Key is the user's Postman username (e.g., '@user-postman')

            *   `commentData.tags.userName.type` **[string][270]** Must be 'user'
            *   `commentData.tags.userName.id` **[string][270]** The user's ID

### Examples

```javascript
// Update a comment's body
const response = await updateResponseComment(
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  '12345',
  {
    body: 'Updated: This response format has changed'
  }
);
```

```javascript
// Update with new tags
const response = await updateResponseComment(
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
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

Returns **[Promise][272]** Axios response with updated comment data

## deleteResponseComment

Deletes a comment from a response
Postman API endpoint and method: DELETE /collections/{collectionUid}/responses/{responseUid}/comments/{commentId}

### Parameters

*   `collectionUid` **[string][270]** The collection's UID (format: userId-collectionId)
*   `responseUid` **[string][270]** The response's UID (format: userId-responseId)
*   `commentId` **[string][270]** The comment's ID

### Examples

```javascript
// Delete a response comment
const response = await deleteResponseComment(
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  '12345'
);
console.log(response.data.comment);
```

Returns **[Promise][272]** Axios response with deletion confirmation

## buildAxiosConfig

Builds an Axios config for Postman API requests

### Parameters

*   `method` **[string][270]** HTTP method (e.g., 'get', 'post', 'patch')
*   `endpoint` **[string][270]** The API endpoint path (e.g., '/specs/{specId}')
*   `data` **[Object][273]?** The request body data (optional, default `undefined`)
*   `extra` **[Object][273]?** Extra Axios config (e.g. maxBodyLength, etc) (optional, default `{}`)

Returns **[Object][273]** Axios request config

## executeRequest

Executes an axios request and throws an error for non-2xx responses.

### Parameters

*   `config` **[Object][273]** Axios request configuration

Returns **[Promise][272]** Axios response

## POSTMAN\_API\_KEY\_ENV\_VAR

Configuration module for Postman SDK
Reads API key from environment and sets base URL

Type: [string][270]

## getSpecs

Gets all API specifications in a workspace
Postman API endpoint and method: GET /specs

### Parameters

*   `workspaceId` **[string][270]** The workspace ID
*   `cursor` **[string][270]?** The pointer to the first record of the set of paginated results (optional, default `null`)
*   `limit` **[number][271]?** The maximum number of rows to return in the response (optional, default `null`)

### Examples

```javascript
// Get all specs in a workspace
const response = await getSpecs('bf5cb6e7-0a1e-4b82-a577-b2068a70f830');
console.log(response.data.specs);
```

```javascript
// Get specs with pagination
const response = await getSpecs('bf5cb6e7-0a1e-4b82-a577-b2068a70f830', null, 10);
const nextCursor = response.data.meta.nextCursor;
```

Returns **[Promise][272]** Axios response with specs array and pagination metadata

## getSpec

Gets information about a specific API specification
Postman API endpoint and method: GET /specs/{specId}

### Parameters

*   `specId` **[string][270]** The spec ID

### Examples

```javascript
// Get spec information
const response = await getSpec('a0c5ad64-211e-442a-b857-22b7d438d478');
console.log(response.data.spec);
```

Returns **[Promise][272]** Axios response with spec details including name, type, and files

## createSpec

Creates an API specification in Postman's Spec Hub
Postman API endpoint and method: POST /specs

### Parameters

*   `workspaceId` **[string][270]** The workspace ID
*   `name` **[string][270]** The specification's name
*   `type` **[string][270]** The specification's type (e.g., 'OPENAPI:3.0', 'OPENAPI:3.1', 'ASYNCAPI:2.0', 'ASYNCAPI:2.6.0')
*   `files` **[Array][275]** A list of the specification's files and their contents

    *   `files[].path` **[string][270]** The file path (e.g., 'index.yaml', 'openapi.json')
    *   `files[].content` **[string][270]** The stringified file contents

### Examples

```javascript
// Create an OpenAPI 3.0 spec
const response = await createSpec(
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  'My API Spec',
  'OPENAPI:3.0',
  [{
    path: 'index.yaml',
    content: 'openapi: 3.0.0\ninfo:\n  title: My API\n  version: 1.0.0'
  }]
);
```

```javascript
// Create an AsyncAPI spec
const response = await createSpec(
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  'Event API',
  'ASYNCAPI:2.6.0',
  [{
    path: 'asyncapi.json',
    content: JSON.stringify({ asyncapi: '2.6.0', info: { title: 'Events' } })
  }]
);
```

Returns **[Promise][272]** Axios response with created spec data

## modifySpec

Updates an API specification's properties
Postman API endpoint and method: PATCH /specs/{specId}

### Parameters

*   `specId` **[string][270]** The spec ID
*   `name` **[string][270]** The specification's new name

### Examples

```javascript
// Update spec name
const response = await modifySpec('a0c5ad64-211e-442a-b857-22b7d438d478', 'Updated API Spec Name');
```

Returns **[Promise][272]** Axios response with updated spec data

## deleteSpec

Deletes an API specification
Postman API endpoint and method: DELETE /specs/{specId}

### Parameters

*   `specId` **[string][270]** The spec ID

### Examples

```javascript
// Delete a spec
const response = await deleteSpec('a0c5ad64-211e-442a-b857-22b7d438d478');
```

Returns **[Promise][272]** Axios response with deletion confirmation

## getSpecDefinition

Gets the complete contents of an API specification's definition
Postman API endpoint and method: GET /specs/{specId}/definitions

### Parameters

*   `specId` **[string][270]** The spec ID

### Examples

```javascript
// Get spec definition
const response = await getSpecDefinition('a0c5ad64-211e-442a-b857-22b7d438d478');
console.log(response.data.definition);
```

Returns **[Promise][272]** Axios response with spec definition as JSON or YAML

## getSpecFiles

Gets all the files in an API specification
Postman API endpoint and method: GET /specs/{specId}/files

### Parameters

*   `specId` **[string][270]** The spec ID

### Examples

```javascript
// Get all files in a spec
const response = await getSpecFiles('a0c5ad64-211e-442a-b857-22b7d438d478');
console.log(response.data.files);
```

Returns **[Promise][272]** Axios response with array of file objects

## createSpecFile

Creates an API specification file
Postman API endpoint and method: POST /specs/{specId}/files

### Parameters

*   `specId` **[string][270]** The spec ID
*   `path` **[string][270]** The file's path (e.g., 'index.yaml', 'schemas/user.json')
*   `content` **[string][270]** The file's stringified contents (JSON or YAML)

### Examples

```javascript
// Create a YAML spec file
const response = await createSpecFile(
  'a0c5ad64-211e-442a-b857-22b7d438d478',
  'index.yaml',
  'openapi: 3.0.0\ninfo:\n  title: My API\n  version: 1.0.0'
);
```

```javascript
// Create a JSON schema file
const response = await createSpecFile(
  'a0c5ad64-211e-442a-b857-22b7d438d478',
  'schemas/user.json',
  JSON.stringify({ type: 'object', properties: { name: { type: 'string' } } })
);
```

Returns **[Promise][272]** Axios response with created file data

## getSpecFile

Gets the contents of an API specification's file
Postman API endpoint and method: GET /specs/{specId}/files/{filePath}

### Parameters

*   `specId` **[string][270]** The spec ID
*   `filePath` **[string][270]** The path to the file (e.g., 'index.yaml', 'schemas/user.json')

### Examples

```javascript
// Get a spec file
const response = await getSpecFile('a0c5ad64-211e-442a-b857-22b7d438d478', 'index.yaml');
console.log(response.data.content);
```

Returns **[Promise][272]** Axios response with file content

## modifySpecFile

Updates an API specification's file
Postman API endpoint and method: PATCH /specs/{specId}/files/{filePath}

### Parameters

*   `specId` **[string][270]** The spec ID
*   `filePath` **[string][270]** The path to the file
*   `data` **[Object][273]** Update data (can update name, content, or type - only one property at a time)

    *   `data.name` **[string][270]?** New file name
    *   `data.content` **[string][270]?** New file content
    *   `data.type` **[string][270]?** New file type

### Examples

```javascript
// Update file content
const response = await modifySpecFile(
  'a0c5ad64-211e-442a-b857-22b7d438d478',
  'index.yaml',
  { content: 'openapi: 3.0.0\ninfo:\n  title: Updated API\n  version: 2.0.0' }
);
```

```javascript
// Rename a file
const response = await modifySpecFile(
  'a0c5ad64-211e-442a-b857-22b7d438d478',
  'old-name.yaml',
  { name: 'new-name.yaml' }
);
```

Returns **[Promise][272]** Axios response with updated file data

## deleteSpecFile

Deletes a file in an API specification
Postman API endpoint and method: DELETE /specs/{specId}/files/{filePath}

### Parameters

*   `specId` **[string][270]** The spec ID
*   `filePath` **[string][270]** The path to the file to delete

### Examples

```javascript
// Delete a spec file
const response = await deleteSpecFile('a0c5ad64-211e-442a-b857-22b7d438d478', 'schemas/user.json');
```

Returns **[Promise][272]** Axios response with deletion confirmation

## createSpecGeneration

Generates a collection from an API specification
Postman API endpoint and method: POST /specs/{specId}/generations/{elementType}

### Parameters

*   `specId` **[string][270]** The spec ID
*   `elementType` **[string][270]** The element type (typically 'collection')
*   `name` **[string][270]?** The name for the generated collection (optional, default `null`)
*   `options` **[Object][273]?** Generation options for customizing collection generation (optional, default `null`)

### Examples

```javascript
// Generate a collection from spec
const response = await createSpecGeneration('a0c5ad64-211e-442a-b857-22b7d438d478', 'collection', 'My API Collection');
const taskId = response.data.taskId;
```

```javascript
// Generate with options
const response = await createSpecGeneration(
  'a0c5ad64-211e-442a-b857-22b7d438d478',
  'collection',
  'API Collection',
  { folderStrategy: 'tags' }
);
```

Returns **[Promise][272]** Axios response with taskId and url for async task polling

## getSpecTaskStatus

Gets the status of an asynchronous API specification task
Postman API endpoint and method: GET /specs/{specId}/tasks/{taskId}

### Parameters

*   `specId` **[string][270]** The spec ID
*   `taskId` **[string][270]** The task ID (returned from async operations like createSpecGeneration)

### Examples

```javascript
// Check generation task status
const response = await getSpecTaskStatus('a0c5ad64-211e-442a-b857-22b7d438d478', 'bf5cb6e7-0a1e-4b82-a577-b2068a70f830');
console.log(response.data.status); // 'pending', 'completed', or 'failed'
```

```javascript
// Poll for task completion
const checkStatus = async () => {
  const response = await getSpecTaskStatus('a0c5ad64-211e-442a-b857-22b7d438d478', taskId);
  if (response.data.status === 'completed') {
    console.log('Generation complete!', response.data.result);
  }
};
```

Returns **[Promise][272]** Axios response with task status, progress, and result data

## getSpecGenerations

Gets a list of collections generated from a spec
Postman API endpoint and method: GET /specs/{specId}/generations/{elementType}

### Parameters

*   `specId` **[string][270]** The spec ID
*   `elementType` **[string][270]** The element type (typically 'collection')
*   `limit` **[number][271]?** The maximum number of rows to return (default 10) (optional, default `null`)
*   `cursor` **[string][270]?** Pagination cursor for next set of results (optional, default `null`)

### Examples

```javascript
// Get all collections generated from a spec
const response = await getSpecGenerations('a0c5ad64-211e-442a-b857-22b7d438d478', 'collection');
console.log(response.data.data);
```

```javascript
// Get with pagination
const response = await getSpecGenerations('a0c5ad64-211e-442a-b857-22b7d438d478', 'collection', 20, nextCursor);
```

Returns **[Promise][272]** Axios response with generated collections array and pagination metadata

## syncSpecWithCollection

Syncs a spec with a collection
Postman API endpoint and method: PUT /specs/{specId}/synchronizations

### Parameters

*   `specId` **[string][270]** The spec ID
*   `collectionUid` **[string][270]** The collection's unique ID (format: userId-collectionId)

### Examples

```javascript
// Sync spec with collection
const response = await syncSpecWithCollection(
  'a0c5ad64-211e-442a-b857-22b7d438d478',
  '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830'
);
console.log(response.data.taskId);
```

Returns **[Promise][272]** Axios response with taskId and url for async sync task

## getTagEntities

Gets Postman elements (entities) by a given tag
Postman API endpoint and method: GET /tags/{slugId}/entities

### Parameters

*   `slugId` **[string][270]** The tag's ID/slug (e.g., 'needs-review', 'production')
*   `limit` **[number][271]?** Maximum number of tagged elements to return (max 50, default 10) (optional, default `null`)
*   `direction` **[string][270]?** Sort order: 'asc' or 'desc' based on tagging time (optional, default `null`)
*   `cursor` **[string][270]?** Pagination cursor from previous response's meta.nextCursor (optional, default `null`)
*   `entityType` **[string][270]?** Filter by element type: 'api', 'collection', or 'workspace' (optional, default `null`)

### Examples

```javascript
// Get all entities with 'production' tag
const response = await getTagEntities('production');
console.log(response.data.entities);
```

```javascript
// Get only collections with 'needs-review' tag
const response = await getTagEntities('needs-review', null, null, null, 'collection');
```

```javascript
// Get entities with pagination
const response = await getTagEntities('api-v2', 20, 'desc', nextCursor);
console.log(response.data.meta.nextCursor);
```

Returns **[Promise][272]** Axios response with entities array, meta.count, and meta.nextCursor for pagination

## getAuthenticatedUser

Gets information about the authenticated user
Postman API endpoint and method: GET /me

### Examples

```javascript
// Get current user information
const response = await getAuthenticatedUser();
console.log(response.data.user);
console.log(response.data.user.id);
console.log(response.data.user.username);
```

Returns **[Promise][272]** Axios response with authenticated user information including id, username, email, and team details

## getWorkspaces

Gets all workspaces
Postman API endpoint and method: GET /workspaces

### Parameters

*   `type` **[string][270]?** Filter by workspace type ('personal', 'team', 'private', 'public', 'partner') (optional, default `null`)
*   `createdByUserId` **[number][271]?** Return only workspaces created by a specific user ID (optional, default `null`)
*   `include` **[string][270]?** Include additional information ('mocks:deactivated', 'scim') (optional, default `null`)

### Examples

```javascript
// Get all workspaces
const response = await getWorkspaces();
console.log(response.data.workspaces);
```

```javascript
// Get only team workspaces
const response = await getWorkspaces('team');
```

```javascript
// Get workspaces created by a specific user
const response = await getWorkspaces(null, 12345678);
```

```javascript
// Get workspaces with additional mock information
const response = await getWorkspaces(null, null, 'mocks:deactivated');
```

Returns **[Promise][272]** Axios response with workspaces array

## createWorkspace

Creates a new workspace
Postman API endpoint and method: POST /workspaces

### Parameters

*   `name` **[string][270]** The workspace's name
*   `type` **[string][270]** The type of workspace ('personal', 'private', 'public', 'team', 'partner')
*   `description` **[string][270]?** The workspace's description (optional, default `null`)
*   `about` **[string][270]?** A brief summary about the workspace (optional, default `null`)

### Examples

```javascript
// Create a simple team workspace
const response = await createWorkspace('My Team Workspace', 'team');
console.log(response.data.workspace.id);
```

```javascript
// Create a workspace with description
const response = await createWorkspace(
  'API Development',
  'team',
  'Workspace for API development and testing'
);
```

```javascript
// Create a workspace with description and about
const response = await createWorkspace(
  'Public APIs',
  'public',
  'Collection of public API examples',
  'A workspace showcasing popular public APIs'
);
```

Returns **[Promise][272]** Axios response with created workspace data including ID

## getWorkspace

Gets information about a workspace
Postman API endpoint and method: GET /workspaces/{workspaceId}

### Parameters

*   `workspaceId` **[string][270]** The workspace's ID
*   `include` **[string][270]?** Include additional information ('mocks:deactivated', 'scim') (optional, default `null`)

### Examples

```javascript
// Get workspace information
const response = await getWorkspace('bf5cb6e7-0a1e-4b82-a577-b2068a70f830');
console.log(response.data.workspace);
```

```javascript
// Get workspace with SCIM information
const response = await getWorkspace('bf5cb6e7-0a1e-4b82-a577-b2068a70f830', 'scim');
```

Returns **[Promise][272]** Axios response with workspace details including collections, environments, and mocks

## updateWorkspace

Updates a workspace
Postman API endpoint and method: PUT /workspaces/{workspaceId}
Note: This function fetches the current workspace first to get existing values,
then merges updates, because the Postman API requires 'type' to be present in PUT requests.

### Parameters

*   `workspaceId` **[string][270]** The workspace's ID
*   `name` **[string][270]?** The workspace's new name (optional, default `null`)
*   `type` **[string][270]?** The new workspace visibility type ('private', 'personal', 'team', 'public', 'partner') (optional, default `null`)
*   `description` **[string][270]?** The new workspace description (optional, default `null`)
*   `about` **[string][270]?** A brief summary about the workspace (optional, default `null`)

### Examples

```javascript
// Update workspace name
const response = await updateWorkspace('bf5cb6e7-0a1e-4b82-a577-b2068a70f830', 'New Workspace Name');
```

```javascript
// Update workspace type to team
const response = await updateWorkspace('bf5cb6e7-0a1e-4b82-a577-b2068a70f830', null, 'team');
```

```javascript
// Update multiple properties
const response = await updateWorkspace(
  'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
  'Updated Name',
  'private',
  'Updated description',
  'Updated about section'
);
```

Returns **[Promise][272]** Axios response with updated workspace data

## deleteWorkspace

Deletes an existing workspace
Postman API endpoint and method: DELETE /workspaces/{workspaceId}

### Parameters

*   `workspaceId` **[string][270]** The workspace's ID

### Examples

```javascript
// Delete a workspace
const response = await deleteWorkspace('bf5cb6e7-0a1e-4b82-a577-b2068a70f830');
console.log(response.data.workspace);
```

Returns **[Promise][272]** Axios response with deletion confirmation

## getWorkspaceTags

Gets all tags associated with a workspace
Postman API endpoint and method: GET /workspaces/{workspaceId}/tags

### Parameters

*   `workspaceId` **[string][270]** The workspace's ID

### Examples

```javascript
// Get all tags for a workspace
const response = await getWorkspaceTags('bf5cb6e7-0a1e-4b82-a577-b2068a70f830');
console.log(response.data.tags);
```

Returns **[Promise][272]** Axios response with array of tags

## updateWorkspaceTags

Updates a workspace's associated tags
Postman API endpoint and method: PUT /workspaces/{workspaceId}/tags
Note: This replaces all existing tags with the provided tags array

### Parameters

*   `workspaceId` **[string][270]** The workspace's ID
*   `tags` **[Array][275]<[Object][273]>** Array of tag objects with slug property (maximum 5 tags)

    *   `tags[].slug` **[string][270]** The tag's slug/name

### Examples

```javascript
// Replace workspace tags
const response = await updateWorkspaceTags('bf5cb6e7-0a1e-4b82-a577-b2068a70f830', [
  { slug: 'production' },
  { slug: 'api-v2' },
  { slug: 'needs-review' }
]);
```

```javascript
// Remove all tags (pass empty array)
const response = await updateWorkspaceTags('bf5cb6e7-0a1e-4b82-a577-b2068a70f830', []);
```

Returns **[Promise][272]** Axios response with updated tags

[43]: #getcollections

[44]: #parameters

[45]: #examples

[1]: #createcollection

[2]: #parameters-1

[3]: #examples-1

[31]: #getcollection

[32]: #parameters-2

[33]: #examples-2

[67]: #updatecollection

[68]: #parameters-3

[69]: #examples-3

[61]: #modifycollection

[62]: #parameters-4

[63]: #examples-4

[19]: #deletecollection

[20]: #parameters-5

[21]: #examples-5

[13]: #createfolder

[14]: #parameters-6

[15]: #examples-6

[52]: #getfolder

[53]: #parameters-7

[54]: #examples-7

[76]: #updatefolder

[77]: #parameters-8

[78]: #examples-8

[25]: #deletefolder

[26]: #parameters-9

[27]: #examples-9

[34]: #getcollectioncomments

[35]: #parameters-10

[36]: #examples-10

[4]: #createcollectioncomment

[5]: #parameters-11

[6]: #examples-11

[70]: #updatecollectioncomment

[71]: #parameters-12

[72]: #examples-12

[22]: #deletecollectioncomment

[23]: #parameters-13

[24]: #examples-13

[55]: #getfoldercomments

[56]: #parameters-14

[57]: #examples-14

[16]: #createfoldercomment

[17]: #parameters-15

[18]: #examples-15

[79]: #updatefoldercomment

[80]: #parameters-16

[81]: #examples-16

[28]: #deletefoldercomment

[29]: #parameters-17

[30]: #examples-17

[64]: #synccollectionwithspec

[65]: #parameters-18

[66]: #examples-18

[46]: #getcollectiontags

[47]: #parameters-19

[48]: #examples-19

[73]: #updatecollectiontags

[74]: #parameters-20

[75]: #examples-20

[10]: #createcollectiongeneration

[11]: #parameters-21

[12]: #examples-21

[40]: #getcollectiongenerations

[41]: #parameters-22

[42]: #examples-22

[49]: #getcollectiontaskstatus

[50]: #parameters-23

[51]: #examples-23

[37]: #getcollectionforks

[38]: #parameters-24

[39]: #examples-24

[7]: #createcollectionfork

[8]: #parameters-25

[9]: #examples-25

[58]: #mergecollectionfork

[59]: #parameters-26

[60]: #examples-26

[205]: #getenvironments

[206]: #parameters-27

[207]: #examples-27

[196]: #createenvironment

[197]: #parameters-28

[198]: #examples-28

[202]: #getenvironment

[203]: #parameters-29

[204]: #examples-29

[208]: #modifyenvironment

[209]: #parameters-30

[210]: #examples-30

[199]: #deleteenvironment

[200]: #parameters-31

[201]: #examples-31

[235]: #getmocks

[236]: #parameters-32

[237]: #examples-32

[211]: #createmock

[212]: #parameters-33

[213]: #examples-33

[229]: #getmock

[230]: #parameters-34

[231]: #examples-34

[244]: #updatemock

[245]: #parameters-35

[246]: #examples-35

[220]: #deletemock

[221]: #parameters-36

[222]: #examples-36

[232]: #getmockcalllogs

[233]: #parameters-37

[234]: #examples-37

[214]: #createmockpublish

[215]: #parameters-38

[216]: #examples-38

[241]: #getmockserverresponses

[242]: #parameters-39

[243]: #examples-39

[217]: #createmockserverresponse

[218]: #parameters-40

[219]: #examples-40

[238]: #getmockserverresponse

[239]: #parameters-41

[240]: #examples-41

[247]: #updatemockserverresponse

[248]: #parameters-42

[249]: #examples-42

[223]: #deletemockserverresponse

[224]: #parameters-43

[225]: #examples-43

[226]: #deletemockunpublish

[227]: #parameters-44

[228]: #examples-44

[82]: #createrequest

[83]: #parameters-45

[84]: #examples-45

[94]: #getrequest

[95]: #parameters-46

[96]: #examples-46

[100]: #updaterequest

[101]: #parameters-47

[102]: #examples-47

[88]: #deleterequest

[89]: #parameters-48

[90]: #examples-48

[97]: #getrequestcomments

[98]: #parameters-49

[99]: #examples-49

[85]: #createrequestcomment

[86]: #parameters-50

[87]: #examples-50

[103]: #updaterequestcomment

[104]: #parameters-51

[105]: #examples-51

[91]: #deleterequestcomment

[92]: #parameters-52

[93]: #examples-52

[265]: #validateid

[266]: #parameters-53

[267]: #validateuid

[268]: #parameters-54

[257]: #buildquerystring

[258]: #parameters-55

[261]: #getcontentfs

[262]: #parameters-56

[263]: #utils

[264]: #parameters-57

[106]: #createresponse

[107]: #parameters-58

[108]: #examples-53

[118]: #getresponse

[119]: #parameters-59

[120]: #examples-54

[124]: #updateresponse

[125]: #parameters-60

[126]: #examples-55

[112]: #deleteresponse

[113]: #parameters-61

[114]: #examples-56

[121]: #getresponsecomments

[122]: #parameters-62

[123]: #examples-57

[109]: #createresponsecomment

[110]: #parameters-63

[111]: #examples-58

[127]: #updateresponsecomment

[128]: #parameters-64

[129]: #examples-59

[115]: #deleteresponsecomment

[116]: #parameters-65

[117]: #examples-60

[255]: #buildaxiosconfig

[256]: #parameters-66

[259]: #executerequest

[260]: #parameters-67

[198]: #postman_api_key_env_var

[181]: #getspecs

[182]: #parameters-68

[183]: #examples-61

[166]: #getspec

[167]: #parameters-69

[168]: #examples-62

[151]: #createspec

[152]: #parameters-70

[153]: #examples-63

[187]: #modifyspec

[188]: #parameters-71

[189]: #examples-64

[160]: #deletespec

[161]: #parameters-72

[162]: #examples-65

[169]: #getspecdefinition

[170]: #parameters-73

[171]: #examples-66

[175]: #getspecfiles

[176]: #parameters-74

[177]: #examples-67

[154]: #createspecfile

[155]: #parameters-75

[156]: #examples-68

[172]: #getspecfile

[173]: #parameters-76

[174]: #examples-69

[190]: #modifyspecfile

[191]: #parameters-77

[192]: #examples-70

[163]: #deletespecfile

[164]: #parameters-78

[165]: #examples-71

[157]: #createspecgeneration

[158]: #parameters-79

[159]: #examples-72

[184]: #getspectaskstatus

[185]: #parameters-80

[186]: #examples-73

[178]: #getspecgenerations

[179]: #parameters-81

[180]: #examples-74

[193]: #syncspecwithcollection

[194]: #parameters-82

[195]: #examples-75

[250]: #gettagentities

[251]: #parameters-83

[252]: #examples-76

[253]: #getauthenticateduser

[254]: #examples-77

[139]: #getworkspaces

[140]: #parameters-84

[141]: #examples-78

[130]: #createworkspace

[131]: #parameters-85

[132]: #examples-79

[136]: #getworkspace

[137]: #parameters-86

[138]: #examples-80

[145]: #updateworkspace

[146]: #parameters-87

[147]: #examples-81

[133]: #deleteworkspace

[134]: #parameters-88

[135]: #examples-82

[142]: #getworkspacetags

[143]: #parameters-89

[144]: #examples-83

[148]: #updateworkspacetags

[149]: #parameters-90

[150]: #examples-84

[270]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[271]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[272]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise

[273]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[274]: https://schema.getpostman.com/json/collection/v2.1.0/collection.json

[275]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

[276]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean

[277]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error
