# Requests Module

The Requests module provides functions for managing requests within Postman collections.

## Functions

### `createRequest(collectionId, requestData, folder)`

Creates a new request in a collection.

**Parameters:**
- `collectionId` (string) - The collection's ID
- `requestData` (Object) - The request data (name, method, url, description, etc.)
- `folder` (string, optional) - The folder ID in which to create the request. If omitted, creates at collection root level.

**Returns:** Promise<AxiosResponse>

**Example:**
```javascript
const { requests } = require('@bidnessforb/postman-sdk');

const collectionId = 'abc-123-collection-id';
const requestData = {
  name: 'Get Users',
  method: 'GET',
  url: 'https://api.example.com/users',
  description: 'Retrieves all users'
};

const response = await requests.createRequest(collectionId, requestData);
console.log('Created request:', response.data);

// Create request in a folder
const folderId = 'def-456-folder-id';
const folderResponse = await requests.createRequest(collectionId, requestData, folderId);
```

### `getRequest(collectionId, requestId, ids, uid, populate)`

Gets information about a request in a collection.

**Parameters:**
- `collectionId` (string) - The collection's ID
- `requestId` (string) - The request's ID
- `ids` (boolean, optional) - If true, returns only the request properties that contain ID values
- `uid` (boolean, optional) - If true, returns all IDs in UID format
- `populate` (boolean, optional) - If true, returns all of a request's contents

**Returns:** Promise<AxiosResponse>

**Example:**
```javascript
const { requests } = require('@bidnessforb/postman-sdk');

const collectionId = 'abc-123-collection-id';
const requestId = 'xyz-789-request-id';

const response = await requests.getRequest(collectionId, requestId);
console.log('Request:', response.data);

// Get with all content populated
const fullResponse = await requests.getRequest(collectionId, requestId, null, null, true);
```

### `updateRequest(collectionId, requestId, requestData)`

Updates a request in a collection. This endpoint acts like a PATCH method - it only updates the values provided in the request body.

**Parameters:**
- `collectionId` (string) - The collection's ID
- `requestId` (string) - The request's ID
- `requestData` (Object) - The request data to update (name, method, url, etc.)

**Returns:** Promise<AxiosResponse>

**Example:**
```javascript
const { requests } = require('@bidnessforb/postman-sdk');

const collectionId = 'abc-123-collection-id';
const requestId = 'xyz-789-request-id';
const updatedData = {
  name: 'Get All Users',
  method: 'POST',
  url: 'https://api.example.com/users',
  description: 'Updated description'
};

const response = await requests.updateRequest(collectionId, requestId, updatedData);
console.log('Updated request:', response.data);
```

**Note:** This endpoint does not support changing the folder of a request. Use transfer endpoints for that.

### `deleteRequest(collectionId, requestId)`

Deletes a request from a collection.

**Parameters:**
- `collectionId` (string) - The collection's ID
- `requestId` (string) - The request's ID

**Returns:** Promise<AxiosResponse>

**Example:**
```javascript
const { requests } = require('@bidnessforb/postman-sdk');

const collectionId = 'abc-123-collection-id';
const requestId = 'xyz-789-request-id';

const response = await requests.deleteRequest(collectionId, requestId);
console.log('Deleted request:', response.data);
```

### `getRequestComments(userId, collectionId, requestId)`

Gets all comments left by users in a request.

**Parameters:**
- `userId` (string|number) - The user's ID (required for building UID)
- `collectionId` (string) - The collection's ID
- `requestId` (string) - The request's ID

**Returns:** Promise<AxiosResponse>

**Example:**
```javascript
const { requests, users } = require('@bidnessforb/postman-sdk');

// Get authenticated user ID
const meResponse = await users.getMe();
const userId = meResponse.data.user.id;

const collectionId = 'abc-123-collection-id';
const requestId = 'xyz-789-request-id';

const response = await requests.getRequestComments(userId, collectionId, requestId);
console.log('Comments:', response.data.data);
```

### `createRequestComment(userId, collectionId, requestId, commentData)`

Creates a comment on a request.

**Parameters:**
- `userId` (string|number) - The user's ID (required for building UID)
- `collectionId` (string) - The collection's ID
- `requestId` (string) - The request's ID
- `commentData` (Object) - The comment data:
  - `body` (string) - Comment text (required, max 10,000 characters)
  - `threadId` (integer, optional) - Thread ID for replies
  - `tags` (Object, optional) - Tagged users

**Returns:** Promise<AxiosResponse>

**Example:**
```javascript
const { requests, users } = require('@bidnessforb/postman-sdk');

// Get authenticated user ID
const meResponse = await users.getMe();
const userId = meResponse.data.user.id;

const collectionId = 'abc-123-collection-id';
const requestId = 'xyz-789-request-id';

// Simple comment
const commentData = {
  body: 'This endpoint needs authentication'
};
const response = await requests.createRequestComment(userId, collectionId, requestId, commentData);
console.log('Created comment:', response.data.data);

// Comment with tagged users
const taggedComment = {
  body: 'Hey @teammate, can you review this?',
  tags: {
    '@teammate': {
      type: 'user',
      id: '12345678'
    }
  }
};
const taggedResponse = await requests.createRequestComment(userId, collectionId, requestId, taggedComment);
```

### `updateRequestComment(userId, collectionId, requestId, commentId, commentData)`

Updates a comment on a request.

**Parameters:**
- `userId` (string|number) - The user's ID (required for building UID)
- `collectionId` (string) - The collection's ID
- `requestId` (string) - The request's ID
- `commentId` (string) - The comment's ID
- `commentData` (Object) - The updated comment data:
  - `body` (string) - Updated comment text (required, max 10,000 characters)
  - `tags` (Object, optional) - Updated tagged users

**Returns:** Promise<AxiosResponse>

**Example:**
```javascript
const { requests, users } = require('@bidnessforb/postman-sdk');

// Get authenticated user ID
const meResponse = await users.getMe();
const userId = meResponse.data.user.id;

const collectionId = 'abc-123-collection-id';
const requestId = 'xyz-789-request-id';
const commentId = '46814';

const updatedData = {
  body: 'Updated: This endpoint requires Bearer token authentication'
};
const response = await requests.updateRequestComment(userId, collectionId, requestId, commentId, updatedData);
console.log('Updated comment:', response.data.data);
```

### `deleteRequestComment(userId, collectionId, requestId, commentId)`

Deletes a comment from a request.

**Parameters:**
- `userId` (string|number) - The user's ID (required for building UID)
- `collectionId` (string) - The collection's ID
- `requestId` (string) - The request's ID
- `commentId` (string) - The comment's ID

**Returns:** Promise<AxiosResponse> with status 204 (No Content)

**Example:**
```javascript
const { requests, users } = require('@bidnessforb/postman-sdk');

// Get authenticated user ID
const meResponse = await users.getMe();
const userId = meResponse.data.user.id;

const collectionId = 'abc-123-collection-id';
const requestId = 'xyz-789-request-id';
const commentId = '46814';

await requests.deleteRequestComment(userId, collectionId, requestId, commentId);
console.log('Comment deleted successfully');
```

## Request Data Structure

When creating or updating requests, the `requestData` object can include the following properties (refer to the [Postman Collection Format documentation](https://schema.postman.com/collection/json/v2.1.0/draft-07/docs/index.html) for complete details):

- `name` (string) - The request's name
- `method` (string) - HTTP method (GET, POST, PUT, DELETE, etc.)
- `url` (string) - The request URL
- `description` (string) - Request description
- `headers` (string) - Stringified headers
- `auth` (Object) - Authorization configuration
- `events` (Array) - Pre-request and test scripts
- `dataMode` (string) - Request body mode (raw, urlencoded, formdata, etc.)
- `rawModeData` (string) - Raw body content
- `dataOptions` (Object) - Data mode options (e.g., language for raw mode)
- `queryParams` (Array) - Query parameters
- `pathVariables` (Object) - Path variables
- `pathVariableData` (Array) - Path variable data
- `preRequestScript` (string) - Pre-request script
- `tests` (string) - Test script
- `protocolProfileBehavior` (Object) - Protocol profile behavior settings

## Testing

### Unit Tests

The requests module includes comprehensive unit tests with mocked API calls.

**Run unit tests:**
```bash
npm run test:unit -- requests
# or
npm test -- src/requests/__tests__/unit.test.js
```

**Unit test coverage (34 tests):**
- ✅ `createRequest()` - 5 tests
  - POST to collection root
  - POST with folder parameter
  - Null folder parameter handling
  - Complex request properties
  - Header validation
- ✅ `getRequest()` - 7 tests
  - GET request by ID
  - Query parameters (ids, uid, populate)
  - All query parameters combined
  - Null parameter handling
  - Header validation
- ✅ `updateRequest()` - 6 tests
  - PUT with full request data
  - Partial updates (name only)
  - Method and URL updates
  - Request body data updates
  - Auth configuration updates
  - Header validation
- ✅ `deleteRequest()` - 3 tests
  - DELETE request
  - Response structure validation
  - Header validation
- ✅ `getRequestComments()` - 3 tests
  - GET comments with UID building
  - UID format validation
  - Header validation
- ✅ `createRequestComment()` - 4 tests
  - POST comment with body
  - Comment with tags
  - Comment with threadId
  - Header validation
- ✅ `updateRequestComment()` - 4 tests
  - PUT comment update
  - Update with tags
  - URL construction with commentId
  - Header validation
- ✅ `deleteRequestComment()` - 3 tests
  - DELETE comment
  - URL construction
  - Header validation

### Functional Tests

The requests module includes comprehensive functional tests that make real API calls to the Postman API.

**Run functional tests:**
```bash
npm test -- src/requests/__tests__/functional.test.js
```

**Note:** Functional tests require:
- `POSTMAN_API_KEY_POSTMAN` environment variable
- An existing collection (created by collection tests or all-up test)
- Test IDs persisted in `test-ids.json`

**Functional test coverage (16 tests):**

Request Management (10 tests):
- ✅ Creating requests in collection root
- ✅ Creating requests in folders
- ✅ Getting request details
- ✅ Updating request properties
- ✅ Deleting requests
- ✅ Error handling for invalid IDs
- ✅ Error handling for non-existent resources

Request Comments (6 tests):
- ✅ Creating comments on requests
- ✅ Getting all comments on a request
- ✅ Updating comments
- ✅ Deleting comments
- ✅ Error handling for comments on non-existent requests
- ✅ Error handling for invalid comment IDs

## Integration with All-Up Tests

The requests module is integrated into the All-Up Functional Test Suite as Phase 7, running after folders and folder comments are created:

1. Workspaces
2. Environments
3. Collections
4. Collection Comments
5. Folders
6. Folder Comments
7. **Requests** ← Runs here
8. Specs
9. Transformations
10. Tags

This ensures that both collections and folders exist before testing request creation.

## API Reference

For complete API documentation, see:
- [Postman API Documentation - Collection Requests](https://www.postman.com/postman/workspace/postman-public-workspace/documentation/12959542-c8142d51-e97c-46b6-bd77-52bb66712c9a)
- [Postman Collection Format](https://schema.postman.com/collection/json/v2.1.0/draft-07/docs/index.html)

## Notes

### Request Management
- Collection ID (not UID) must be used for request CRUD endpoints
- Requests can be created at collection root level or within folders
- Request IDs are persisted in `test-ids.json` for reuse across test runs
- Folder of a request cannot be changed via update - use transfer endpoints instead

### Request Comments
- Collection UID and Request UID must be used for comment endpoints (format: `{userId}-{id}`)
- Comments support tagging users with the `tags` property
- Comments have a maximum length of 10,000 characters
- Comment IDs are simple integers (not UIDs)
- Thread IDs allow creating threaded comment conversations

