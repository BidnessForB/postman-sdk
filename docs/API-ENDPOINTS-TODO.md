# Postman API SDK - Endpoint Implementation Status

**SDK Version**: 0.8.4
**Last Updated**: January 3, 2026  
**Jest Version**: 30.2.0

## Overview

This document tracks the implementation status of all Postman API endpoints in the SDK.

### Statistics

- **Total Endpoints**: 88 unique paths
- **Total Operations**: 161 HTTP method operations
- **Implemented**: 112 operations (69.57%)
- **Not Implemented**: 49 operations (30.43%)

### Legend

- ✅ **Implemented** - Function exists with passing tests
- ⚠️ **Partial** - Function exists but tests incomplete or failing
- ❌ **Not Implemented** - No implementation exists

---

<details open>
<summary><strong>Specs Module (15/15 completed - 100%) ✅</strong></summary>

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| GET | `/specs` | Get all specs | `getSpecs()` | ✅ | ✅ Passing |
| POST | `/specs` | Create a spec | `createSpec()` | ✅ | ✅ Passing |
| GET | `/specs/{specId}` | Get a spec | `getSpec()` | ✅ | ✅ Passing |
| PATCH | `/specs/{specId}` | Update a spec | `modifySpec()` | ✅ | ✅ Passing |
| DELETE | `/specs/{specId}` | Delete a spec | `deleteSpec()` | ✅ | ✅ Passing |
| GET | `/specs/{specId}/definitions` | Get spec definition | `getSpecDefinition()` | ✅ | ✅ Passing |
| GET | `/specs/{specId}/files` | Get spec files | `getSpecFiles()` | ✅ | ✅ Passing |
| POST | `/specs/{specId}/files` | Create spec file | `createSpecFile()` | ✅ | ✅ Passing |
| GET | `/specs/{specId}/files/{filePath}` | Get spec file content | `getSpecFile()` | ✅ | ✅ Passing |
| PATCH | `/specs/{specId}/files/{filePath}` | Update spec file | `modifySpecFile()` | ✅ | ✅ Passing |
| DELETE | `/specs/{specId}/files/{filePath}` | Delete spec file | `deleteSpecFile()` | ✅ | ✅ Passing |
| POST | `/specs/{specId}/generations/{elementType}` | Generate collection from spec | `createSpecGeneration()` | ✅ | ✅ Passing |
| GET | `/specs/{specId}/generations/{elementType}` | Get generated collections | `getSpecGenerations()` | ✅ | ✅ Passing |
| GET | `/specs/{specId}/tasks/{taskId}` | Get async task status | `getSpecTaskStatus()` | ✅ | ✅ Passing |
| PUT | `/specs/{specId}/synchronizations` | Sync spec with collection | `syncSpecWithCollection()` | ✅ | ✅ Passing |

</details>

---

<details>
<summary><strong>Collections Module (43/64 completed - 67.2%)</strong></summary>

### Core Collection Operations

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| GET | `/collections` | Get all collections | `getCollections()` | ✅ | ✅ Passing |
| POST | `/collections` | Create a collection | `createCollection()` | ✅ | ✅ Passing |
| GET | `/collections/{collectionId}` | Get a collection | `getCollection()` | ✅ | ✅ Passing |
| PUT | `/collections/{collectionId}` | Replace collection data | `updateCollection()` | ✅ | ✅ Passing |
| PATCH | `/collections/{collectionId}` | Update part of collection | `modifyCollection()` | ✅ | ✅ Passing |
| DELETE | `/collections/{collectionId}` | Delete a collection | `deleteCollection()` | ✅ | ✅ Passing |

### Collection Comments

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| GET | `/collections/{collectionId}/comments` | Get collection comments | `getCollectionComments()` | ✅ | ✅ Passing |
| POST | `/collections/{collectionId}/comments` | Create collection comment | `createCollectionComment()` | ✅ | ✅ Passing |
| PUT | `/collections/{collectionId}/comments/{commentId}` | Update comment | `updateCollectionComment()` | ✅ | ✅ Passing |
| DELETE | `/collections/{collectionId}/comments/{commentId}` | Delete comment | `deleteCollectionComment()` | ✅ | ✅ Passing |

### Collection Folders

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| POST | `/collections/{collectionId}/folders` | Create a folder | `createFolder()` | ✅ | ✅ Passing |
| GET | `/collections/{collectionId}/folders/{folderId}` | Get a folder | `getFolder()` | ✅ | ✅ Passing |
| PUT | `/collections/{collectionId}/folders/{folderId}` | Update a folder | `updateFolder()` | ✅ | ✅ Passing |
| DELETE | `/collections/{collectionId}/folders/{folderId}` | Delete a folder | `deleteFolder()` | ✅ | ✅ Passing |

### Folder Comments

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| GET | `/collections/{collectionId}/folders/{folderId}/comments` | Get folder comments | `getFolderComments()` | ✅ | ✅ Passing |
| POST | `/collections/{collectionId}/folders/{folderId}/comments` | Create folder comment | `createFolderComment()` | ✅ | ✅ Passing |
| PUT | `/collections/{collectionId}/folders/{folderId}/comments/{commentId}` | Update comment | `updateFolderComment()` | ✅ | ✅ Passing |
| DELETE | `/collections/{collectionId}/folders/{folderId}/comments/{commentId}` | Delete comment | `deleteFolderComment()` | ✅ | ✅ Passing |

### Collection Responses

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| POST | `/collections/{collectionId}/responses` | Create a response | `createResponse()` | ✅ | ✅ Passing |
| GET | `/collections/{collectionId}/responses/{responseId}` | Get a response | `getResponse()` | ✅ | ✅ Passing |
| PUT | `/collections/{collectionId}/responses/{responseId}` | Update a response | `updateResponse()` | ✅ | ✅ Passing |
| DELETE | `/collections/{collectionId}/responses/{responseId}` | Delete a response | `deleteResponse()` | ✅ | ✅ Passing |

### Response Comments

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| GET | `/collections/{collectionUid}/responses/{responseUid}/comments` | Get response comments | `getResponseComments()` | ✅ | ✅ Passing |
| POST | `/collections/{collectionUid}/responses/{responseUid}/comments` | Create response comment | `createResponseComment()` | ✅ | ✅ Passing |
| PUT | `/collections/{collectionUid}/responses/{responseUid}/comments/{commentId}` | Update comment | `updateResponseComment()` | ✅ | ✅ Passing |
| DELETE | `/collections/{collectionUid}/responses/{responseUid}/comments/{commentId}` | Delete comment | `deleteResponseComment()` | ✅ | ✅ Passing |

### Collection Fork & Merge Operations

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| GET | `/collections/collection-forks` | Get all forked collections | `getCollectionForks()` | ✅ | ✅ Passing |
| POST | `/collections/fork/{collectionId}` | Create a fork | `createCollectionFork()` | ✅ | ✅ Passing |
| GET | `/collections/{collectionId}/forks` | Get collection's forks | *(Same as collection-forks)* | ✅ | ✅ Passing |
| POST | `/collections/merge` | Merge a fork | `mergeCollectionFork()` | ✅ | ✅ Passing |
| PUT | `/collections/{collectionId}/pulls` | Pull source changes | `pullCollectionChanges()` | ✅ | ✅ Passing |

### Collection Pull Requests

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| GET | `/collections/{collectionUid}/pull-requests` | Get pull requests | `getCollectionPullRequests()` | ✅ | ✅ Passing |
| POST | `/collections/{collectionUid}/pull-requests` | Create pull request | `createCollectionPullRequest()` | ✅ | ✅ Passing |

**Note**: See also [Pull Requests Module](#pull-requests-module) for PR management operations.

### Collection Roles & Tags

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| GET | `/collections/{collectionId}/roles` | Get collection roles | `getCollectionRoles()` | ✅ | ✅ Passing |
| PATCH | `/collections/{collectionId}/roles` | Update collection roles | `modifyCollectionRoles()` | ✅ | ✅ Passing |
| GET | `/collections/{collectionUid}/tags` | Get collection tags | `getCollectionTags()` | ✅ | ✅ Passing |
| PUT | `/collections/{collectionUid}/tags` | Update collection tags | `updateCollectionTags()` | ✅ | ✅ Passing |

### Collection Documentation & Generation

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| PUT | `/collections/{collectionId}/public-documentations` | Publish documentation | - | ❌ | ❌ None |
| DELETE | `/collections/{collectionId}/public-documentations` | Unpublish documentation | - | ❌ | ❌ None |
| GET | `/collections/{collectionUid}/generations/{elementType}` | Get generated spec | - | ❌ | ❌ None |
| POST | `/collections/{collectionUid}/generations/{elementType}` | Generate spec from collection | - | ❌ | ❌ None |
| GET | `/collections/{collectionId}/transformations` | Transform collection to OpenAPI | - | ❌ | ❌ None |

### Collection Utilities

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| POST | `/collections/{collectionId}/duplicates` | Duplicate a collection | - | ❌ | ❌ None |
| GET | `/collections/{collectionId}/source-status` | Get source collection status | - | ❌ | ❌ None |
| PUT | `/collections/{collectionUid}/synchronizations` | Sync collection with spec | `syncCollectionWithSpec()` | ✅ | ✅ Passing |

### Collection Generations

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| POST | `/collections/{collectionUid}/generations/{elementType}` | Generate spec from collection | `createCollectionGeneration()` | ✅ | ✅ Passing |
| GET | `/collections/{collectionUid}/generations/{elementType}` | Get generated specs | `getCollectionGenerations()` | ✅ | ✅ Passing |
| GET | `/collections/{collectionUid}/tasks/{taskId}` | Get collection task status | `getCollectionTaskStatus()` | ✅ | ✅ Passing |

### Collection Transfer & Tasks

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| POST | `/collection-folders-transfers` | Transfer folders | - | ❌ | ❌ None |
| POST | `/collection-requests-transfers` | Transfer requests | - | ❌ | ❌ None |
| POST | `/collection-responses-transfers` | Transfer responses | - | ❌ | ❌ None |
| GET | `/collection-duplicate-tasks/{taskId}` | Get duplication task status | - | ❌ | ❌ None |
| GET | `/collection-updates-tasks/{taskId}` | Get async update status | - | ❌ | ❌ None |

### Collection Access & Merges

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| GET | `/collection-access-keys` | Get collection access keys | - | ❌ | ❌ None |
| DELETE | `/collection-access-keys/{keyId}` | Delete collection access key | - | ❌ | ❌ None |
| PUT | `/collection-merges` | Merge or pull changes | - | ❌ | ❌ None |
| GET | `/collection-merges-tasks/{taskId}` | Get merge/pull task status | - | ❌ | ❌ None |

</details>

---

<details open>
<summary><strong>Requests Module (8/8 completed - 100%) ✅</strong></summary>

### Collection Requests

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| POST | `/collections/{collectionId}/requests` | Create a request | `createRequest()` | ✅ | ✅ Passing |
| GET | `/collections/{collectionId}/requests/{requestId}` | Get a request | `getRequest()` | ✅ | ✅ Passing |
| PUT | `/collections/{collectionId}/requests/{requestId}` | Update a request | `updateRequest()` | ✅ | ✅ Passing |
| DELETE | `/collections/{collectionId}/requests/{requestId}` | Delete a request | `deleteRequest()` | ✅ | ✅ Passing |

### Request Comments

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| GET | `/collections/{collectionUid}/requests/{requestUid}/comments` | Get request comments | `getRequestComments()` | ✅ | ✅ Passing |
| POST | `/collections/{collectionUid}/requests/{requestUid}/comments` | Create request comment | `createRequestComment()` | ✅ | ✅ Passing |
| PUT | `/collections/{collectionUid}/requests/{requestUid}/comments/{commentId}` | Update comment | `updateRequestComment()` | ✅ | ✅ Passing |
| DELETE | `/collections/{collectionUid}/requests/{requestUid}/comments/{commentId}` | Delete comment | `deleteRequestComment()` | ✅ | ✅ Passing |

</details>

---

<details open>
<summary><strong>Responses Module (8/8 completed - 100%) ✅</strong></summary>

### Collection Responses

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| POST | `/collections/{collectionId}/responses` | Create a response | `createResponse()` | ✅ | ✅ Passing |
| GET | `/collections/{collectionId}/responses/{responseId}` | Get a response | `getResponse()` | ✅ | ✅ Passing |
| PUT | `/collections/{collectionId}/responses/{responseId}` | Update a response | `updateResponse()` | ✅ | ✅ Passing |
| DELETE | `/collections/{collectionId}/responses/{responseId}` | Delete a response | `deleteResponse()` | ✅ | ✅ Passing |

### Response Comments

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| GET | `/collections/{collectionUid}/responses/{responseUid}/comments` | Get response comments | `getResponseComments()` | ✅ | ✅ Passing |
| POST | `/collections/{collectionUid}/responses/{responseUid}/comments` | Create response comment | `createResponseComment()` | ✅ | ✅ Passing |
| PUT | `/collections/{collectionUid}/responses/{responseUid}/comments/{commentId}` | Update comment | `updateResponseComment()` | ✅ | ✅ Passing |
| DELETE | `/collections/{collectionUid}/responses/{responseUid}/comments/{commentId}` | Delete comment | `deleteResponseComment()` | ✅ | ✅ Passing |

</details>

---

<details>
<summary><strong>Workspaces Module (7/14 completed - 50%)</strong></summary>

### Core Workspace Operations

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| GET | `/workspaces` | Get all workspaces | `getWorkspaces()` | ✅ | ✅ Passing |
| POST | `/workspaces` | Create a workspace | `createWorkspace()` | ✅ | ✅ Passing |
| GET | `/workspaces/{workspaceId}` | Get a workspace | `getWorkspace()` | ✅ | ✅ Passing |
| PUT | `/workspaces/{workspaceId}` | Update a workspace | `updateWorkspace()` | ✅ | ✅ Passing |
| DELETE | `/workspaces/{workspaceId}` | Delete a workspace | `deleteWorkspace()` | ✅ | ✅ Passing |

### Workspace Activities & Roles

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| GET | `/workspaces/{workspaceId}/activities` | Get workspace activities | - | ❌ | ❌ None |
| GET | `/workspaces-roles` | Get workspace roles | - | ❌ | ❌ None |
| GET | `/workspaces/{workspaceId}/roles` | Get workspace roles | - | ❌ | ❌ None |
| PATCH | `/workspaces/{workspaceId}/roles` | Update workspace roles | - | ❌ | ❌ None |

### Workspace Global Variables & Tags

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| GET | `/workspaces/{workspaceId}/global-variables` | Get global variables | - | ❌ | ❌ None |
| PUT | `/workspaces/{workspaceId}/global-variables` | Update global variables | - | ❌ | ❌ None |
| GET | `/workspaces/{workspaceId}/tags` | Get workspace tags | `getWorkspaceTags()` | ✅ | ✅ Passing |
| PUT | `/workspaces/{workspaceId}/tags` | Update workspace tags | `updateWorkspaceTags()` | ✅ | ✅ Passing |

### Workspace Transfers

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| POST | `/workspaces/{workspaceId}/element-transfers` | Transfer elements | - | ❌ | ❌ None |

</details>

---

<details open>
<summary><strong>Environments Module (9/10 completed - 90%)</strong></summary>

### Core Environment Operations

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| GET | `/environments` | Get all environments | `getEnvironments()` | ✅ | ✅ Passing |
| POST | `/environments` | Create an environment | `createEnvironment()` | ✅ | ✅ Passing |
| GET | `/environments/{environmentId}` | Get an environment | `getEnvironment()` | ✅ | ✅ Passing |
| PATCH | `/environments/{environmentId}` | Update an environment | `modifyEnvironment()` | ✅ | ✅ Passing |
| PUT | `/environments/{environmentId}` | Replace environment data | - | ❌ | ❌ None |
| DELETE | `/environments/{environmentId}` | Delete an environment | `deleteEnvironment()` | ✅ | ✅ Passing |

### Environment Fork & Merge Operations

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| POST | `/environments/{environmentUid}/forks` | Create a fork | `createEnvironmentFork()` | ✅ | ✅ Passing |
| GET | `/environments/{environmentUid}/forks` | Get environment forks | `getEnvironmentForks()` | ✅ | ✅ Passing |
| POST | `/environments/{environmentUid}/merges` | Merge a fork | `mergeEnvironmentFork()` | ✅ | ✅ Passing |
| POST | `/environments/{environmentUid}/pulls` | Pull source changes | `pullEnvironmentChanges()` | ✅ | ✅ Passing |

</details>

---

<details>
<summary><strong>Mocks Module (13/13 completed - 100%) ✅</strong></summary>

### Core Mock Operations

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| GET | `/mocks` | Get all mocks | `getMocks()` | ✅ | ✅ Passing |
| POST | `/mocks` | Create a mock | `createMock()` | ✅ | ✅ Passing |
| GET | `/mocks/{mockId}` | Get a mock | `getMock()` | ✅ | ✅ Passing |
| PUT | `/mocks/{mockId}` | Update a mock | `updateMock()` | ✅ | ✅ Passing |
| DELETE | `/mocks/{mockId}` | Delete a mock | `deleteMock()` | ✅ | ✅ Passing |

### Mock Publishing & Call Logs

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| POST | `/mocks/{mockId}/publish` | Publish a mock | `publishMock()` | ✅ | ✅ Passing |
| DELETE | `/mocks/{mockId}/unpublish` | Unpublish a mock | `unpublishMock()` | ✅ | ✅ Passing |
| GET | `/mocks/{mockId}/call-logs` | Get mock call logs | `getMockCallLogs()` | ✅ | ✅ Passing |

### Mock Server Responses

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| GET | `/mocks/{mockId}/server-responses` | Get server responses | `getMockServerResponses()` | ✅ | ✅ Passing |
| POST | `/mocks/{mockId}/server-responses` | Create server response | `createMockServerResponse()` | ✅ | ✅ Passing |
| GET | `/mocks/{mockId}/server-responses/{serverResponseId}` | Get server response | `getMockServerResponse()` | ✅ | ✅ Passing |
| PUT | `/mocks/{mockId}/server-responses/{serverResponseId}` | Update server response | `updateMockServerResponse()` | ✅ | ✅ Passing |
| DELETE | `/mocks/{mockId}/server-responses/{serverResponseId}` | Delete server response | `deleteMockServerResponse()` | ✅ | ✅ Passing |

</details>

---

<details open>
<summary><strong>Monitors Module (6/6 completed - 100%) ✅</strong></summary>

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| GET | `/monitors` | Get all monitors | `getMonitors()` | ✅ | ✅ Passing |
| POST | `/monitors` | Create a monitor | `createMonitor()` | ✅ | ✅ Passing |
| GET | `/monitors/{monitorId}` | Get a monitor | `getMonitor()` | ✅ | ✅ Passing |
| PUT | `/monitors/{monitorId}` | Update a monitor | `updateMonitor()` | ✅ | ✅ Passing |
| DELETE | `/monitors/{monitorId}` | Delete a monitor | `deleteMonitor()` | ✅ | ✅ Passing |
| POST | `/monitors/{monitorId}/run` | Run a monitor | `runMonitor()` | ✅ | ✅ Passing |

</details>

---

<details>
<summary><strong>SCIM Module (0/12 completed - 0%)</strong></summary>

### SCIM Groups

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| GET | `/scim/v2/Groups` | Get all SCIM groups | - | ❌ | ❌ None |
| POST | `/scim/v2/Groups` | Create a SCIM group | - | ❌ | ❌ None |
| GET | `/scim/v2/Groups/{groupId}` | Get a SCIM group | - | ❌ | ❌ None |
| PATCH | `/scim/v2/Groups/{groupId}` | Update a SCIM group | - | ❌ | ❌ None |
| DELETE | `/scim/v2/Groups/{groupId}` | Delete a SCIM group | - | ❌ | ❌ None |

### SCIM Users

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| GET | `/scim/v2/Users` | Get all SCIM users | - | ❌ | ❌ None |
| POST | `/scim/v2/Users` | Create a SCIM user | - | ❌ | ❌ None |
| GET | `/scim/v2/Users/{userId}` | Get a SCIM user | - | ❌ | ❌ None |
| PUT | `/scim/v2/Users/{userId}` | Replace a SCIM user | - | ❌ | ❌ None |
| PATCH | `/scim/v2/Users/{userId}` | Update a SCIM user | - | ❌ | ❌ None |

### SCIM Metadata

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| GET | `/scim/v2/ResourceTypes` | Get resource types | - | ❌ | ❌ None |
| GET | `/scim/v2/ServiceProviderConfig` | Get service provider config | - | ❌ | ❌ None |

</details>

---

<details>
<summary><strong>Network Module (0/6 completed - 0%)</strong></summary>

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| GET | `/network/private` | Get private network elements | - | ❌ | ❌ None |
| POST | `/network/private` | Add element to private network | - | ❌ | ❌ None |
| PUT | `/network/private/{elementType}/{elementId}` | Update private network element | - | ❌ | ❌ None |
| DELETE | `/network/private/{elementType}/{elementId}` | Remove from private network | - | ❌ | ❌ None |
| GET | `/network/private/network-entity/request/all` | Get all network entity requests | - | ❌ | ❌ None |
| PUT | `/network/private/network-entity/request/{requestId}` | Update network entity request | - | ❌ | ❌ None |

</details>

---

<details open>
<summary><strong>Pull Requests Module (3/3 completed - 100%) ✅</strong></summary>

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| GET | `/pull-requests/{pullRequestId}` | Get a pull request | `getPullRequest()` | ✅ | ✅ Passing |
| PUT | `/pull-requests/{pullRequestId}` | Update a pull request | `updatePullRequest()` | ✅ | ✅ Passing |
| POST | `/pull-requests/{pullRequestId}/tasks` | Review a pull request | `reviewPullRequest()` | ✅ | ✅ Passing |

**Note**: Pull requests can be created for collections via `createCollectionPullRequest()` in the Collections module.

</details>

---

<details open>
<summary><strong>Tags Module (1/1 completed - 100%) ✅</strong></summary>

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| GET | `/tags/{slugId}/entities` | Get entities by tag | `getTagEntities()` | ✅ | ✅ Passing |

**Note**: Tags can be managed on collections and workspaces via their respective modules:
- Collections: `getCollectionTags()`, `updateCollectionTags()`
- Workspaces: `getWorkspaceTags()`, `updateWorkspaceTags()`

</details>

---

<details open>
<summary><strong>Transformations Module (2/2 completed - 100%) ✅</strong></summary>

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| PUT | `/collections/{collectionUid}/synchronizations` | Sync collection with spec | `syncCollectionWithSpec()` | ✅ | ✅ Passing |
| PUT | `/specs/{specId}/synchronizations` | Sync spec with collection | `syncSpecWithCollection()` | ✅ | ✅ Passing |

**Note**: Bi-directional synchronization between API specs and collections. Comprehensive functional tests verify both sync directions.

</details>

---

<details>
<summary><strong>Groups Module (2/2 completed - 100%) ✅</strong></summary>

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| GET | `/groups` | Get all groups | `getGroups()` | ✅ | ✅ Passing |
| GET | `/groups/{groupId}` | Get a group | `getGroup()` | ✅ | ✅ Passing |

</details>

---

<details>
<summary><strong>Users Module (1/3 completed - 33.3%)</strong></summary>

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| GET | `/me` | Get authenticated user | `getAuthenticatedUser()` | ✅ | ✅ Passing |
| GET | `/users` | Get all users | - | ❌ | ❌ None |
| GET | `/users/{userId}` | Get a user | - | ❌ | ❌ None |

</details>

---

<details>
<summary><strong>Billing Module (0/2 completed - 0%)</strong></summary>

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| GET | `/accounts` | Get billing accounts | - | ❌ | ❌ None |
| GET | `/accounts/{accountId}/invoices` | List account invoices | - | ❌ | ❌ None |

</details>

---

<details>
<summary><strong>Other Modules (1/13 completed - 7.69%)</strong></summary>

### Audit (0/1)

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| GET | `/audit/logs` | Get team audit logs | - | ❌ | ❌ None |

### Runners (0/2)

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| GET | `/runners/{runnerId}/instances` | Get runner instances | - | ❌ | ❌ None |
| GET | `/runners/{runnerId}/metrics` | Get runner metrics | - | ❌ | ❌ None |

### Detected Secrets (0/3)

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| POST | `/detected-secrets-queries` | Search detected secrets | - | ❌ | ❌ None |
| PUT | `/detected-secrets/{secretId}` | Update secret resolution status | - | ❌ | ❌ None |
| GET | `/detected-secrets/{secretId}/locations` | Get secret locations | - | ❌ | ❌ None |

### Import/Export (0/1)

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| POST | `/import/openapi` | Import OpenAPI definition | - | ❌ | ❌ None |

### Webhooks (0/1)

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| POST | `/webhooks` | Create a webhook | - | ❌ | ❌ None |

### Security (0/1)

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| POST | `/security/api-validation` | Validate API security | - | ❌ | ❌ None |

### Tags (1/1) ✅

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| GET | `/tags/{slug}/entities` | Get tag entities | `getTagEntities()` | ✅ | ✅ Passing |

### Comments (0/1)

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| POST | `/comments-resolutions/{threadId}` | Resolve a comment thread | - | ❌ | ❌ None |

### Postbot (0/1)

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| POST | `/postbot/generations/tool` | Generate using Postbot | - | ❌ | ❌ None |

### Secret Types (0/1)

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| GET | `/secret-types` | Get secret types | - | ❌ | ❌ None |

### Tasks (0/1)

| Method | Endpoint | Description | Function | Implemented | Tests |
|--------|----------|-------------|----------|-------------|-------|
| GET | `/{elementType}/{elementId}/tasks/{taskId}` | Get async task status | - | ❌ | ❌ None |

</details>

