# Responses Module

The Responses module provides functions for managing responses within Postman collections.

## Functions

### `createResponse(collectionId, requestId, responseData)`

Creates a new response for a request in a collection.

**Parameters:**
- `collectionId` (string) - The collection's ID
- `requestId` (string) - The parent request's ID
- `responseData` (Object) - The response data (name, code, body, headers, etc.)

**Returns:** Promise<AxiosResponse>

**Example:**
```javascript
const { responses } = require('@bidnessforb/postman-sdk');

const collectionId = 'abc-123-collection-id';
const requestId = 'xyz-789-request-id';
const responseData = {
  name: 'Success Response',
  status: 'OK',
  code: 200,
  body: '{"message": "Success"}',
  header: [
    {
      key: 'Content-Type',
      value: 'application/json'
    }
  ]
};

const response = await responses.createResponse(collectionId, requestId, responseData);
console.log('Created response:', response.data);
```

### `getResponse(collectionId, responseId, ids, uid, populate)`

Gets information about a response in a collection.

**Parameters:**
- `collectionId` (string) - The collection's ID
- `responseId` (string) - The response's ID
- `ids` (boolean, optional) - If true, returns only the response properties that contain ID values
- `uid` (boolean, optional) - If true, returns all IDs in UID format
- `populate` (boolean, optional) - If true, returns all of a response's contents

**Returns:** Promise<AxiosResponse>

**Example:**
```javascript
const { responses } = require('@bidnessforb/postman-sdk');

const collectionId = 'abc-123-collection-id';
const responseId = 'def-456-response-id';

const response = await responses.getResponse(collectionId, responseId);
console.log('Response:', response.data);

// Get with all content populated
const fullResponse = await responses.getResponse(collectionId, responseId, null, null, true);
```

### `updateResponse(collectionId, responseId, responseData)`

Updates a response in a collection.

**Parameters:**
- `collectionId` (string) - The collection's ID
- `responseId` (string) - The response's ID
- `responseData` (Object) - The response data to update (name, code, body, headers, etc.)

**Returns:** Promise<AxiosResponse>

**Example:**
```javascript
const { responses } = require('@bidnessforb/postman-sdk');

const collectionId = 'abc-123-collection-id';
const responseId = 'def-456-response-id';
const updatedData = {
  name: 'Success Response - Updated',
  status: 'Created',
  code: 201,
  body: '{"message": "Resource created"}'
};

const response = await responses.updateResponse(collectionId, responseId, updatedData);
console.log('Updated response:', response.data);
```

### `deleteResponse(collectionId, responseId)`

Deletes a response from a collection.

**Parameters:**
- `collectionId` (string) - The collection's ID
- `responseId` (string) - The response's ID

**Returns:** Promise<AxiosResponse>

**Example:**
```javascript
const { responses } = require('@bidnessforb/postman-sdk');

const collectionId = 'abc-123-collection-id';
const responseId = 'def-456-response-id';

const response = await responses.deleteResponse(collectionId, responseId);
console.log('Deleted response:', response.data);
```

## Response Comments

### `getResponseComments(collectionUid, responseUid)`

Gets all comments left by users in a response.

**Parameters:**
- `collectionUid` (string) - The collection's UID (format: `userId-collectionId`)
- `responseUid` (string) - The response's UID (format: `userId-responseId`)

**Returns:** Promise<AxiosResponse>

**Example:**
```javascript
const { responses } = require('@bidnessforb/postman-sdk');

const collectionUid = '12345678-abc-123-collection-id';
const responseUid = '12345678-def-456-response-id';

const response = await responses.getResponseComments(collectionUid, responseUid);
console.log('Comments:', response.data.data);
```

**Note:** This endpoint requires UIDs (format: `userId-objectId`). You must construct the UID by prepending the user ID to both the collection ID and response ID.

### `createResponseComment(collectionUid, responseUid, commentData)`

Creates a comment on a response.

**Parameters:**
- `collectionUid` (string) - The collection's UID (format: `userId-collectionId`)
- `responseUid` (string) - The response's UID (format: `userId-responseId`)
- `commentData` (Object) - The comment data (body, tags)

**Returns:** Promise<AxiosResponse>

**Example:**
```javascript
const { responses } = require('@bidnessforb/postman-sdk');

const collectionUid = '12345678-abc-123-collection-id';
const responseUid = '12345678-def-456-response-id';
const commentData = {
  body: 'This response looks good!'
};

const response = await responses.createResponseComment(collectionUid, responseUid, commentData);
console.log('Created comment:', response.data.data);
```

**With user mentions (tags):**
```javascript
const commentData = {
  body: 'Hey @john-doe, can you review this response?',
  tags: {
    '@john-doe': {
      type: 'user',
      id: '87654321'
    }
  }
};

const response = await responses.createResponseComment(collectionUid, responseUid, commentData);
```

**Note:** This endpoint requires UIDs. Construct the UID by prepending the user ID to both the collection ID and response ID.

### `updateResponseComment(collectionUid, responseUid, commentId, commentData)`

Updates a comment on a response.

**Parameters:**
- `collectionUid` (string) - The collection's UID (format: `userId-collectionId`)
- `responseUid` (string) - The response's UID (format: `userId-responseId`)
- `commentId` (string) - The comment's ID
- `commentData` (Object) - The updated comment data (body, tags)

**Returns:** Promise<AxiosResponse>

**Example:**
```javascript
const { responses } = require('@bidnessforb/postman-sdk');

const collectionUid = '12345678-abc-123-collection-id';
const responseUid = '12345678-def-456-response-id';
const commentId = '999';
const updatedData = {
  body: 'Updated: This response looks perfect!'
};

const response = await responses.updateResponseComment(collectionUid, responseUid, commentId, updatedData);
console.log('Updated comment:', response.data.data);
```

**Note:** This endpoint requires UIDs. Construct the UID by prepending the user ID to both the collection ID and response ID.

### `deleteResponseComment(collectionUid, responseUid, commentId)`

Deletes a comment from a response.

**Parameters:**
- `collectionUid` (string) - The collection's UID (format: `userId-collectionId`)
- `responseUid` (string) - The response's UID (format: `userId-responseId`)
- `commentId` (string) - The comment's ID

**Returns:** Promise<AxiosResponse>

**Example:**
```javascript
const { responses } = require('@bidnessforb/postman-sdk');

const collectionUid = '12345678-abc-123-collection-id';
const responseUid = '12345678-def-456-response-id';
const commentId = '999';

const response = await responses.deleteResponseComment(collectionUid, responseUid, commentId);
console.log('Deleted comment');
```

**Note:** This endpoint requires UIDs. Construct the UID by prepending the user ID to both the collection ID and response ID.

## Testing

The Responses module includes comprehensive unit and functional tests:

### Unit Tests

Located in `__tests__/unit.test.js`, these tests use mocked API calls to verify function behavior:

```bash
npm test -- src/responses/__tests__/unit.test.js
```

### Functional Tests

Located in `__tests__/functional.test.js`, these tests make real API calls and test the complete CRUD lifecycle:

```bash
npm test -- src/responses/__tests__/functional.test.js
```

**Note:** Functional tests require:
- `POSTMAN_API_KEY` environment variable
- An existing collection and request (from previous test phases)
- User ID (from test-ids.json)

The functional tests persist response IDs in `test-ids.json` for use across test runs.

## API Endpoint Reference

This module implements the following Postman API endpoints:

- `POST /collections/{collectionId}/responses` - Create a response
- `GET /collections/{collectionId}/responses/{responseId}` - Get a response
- `PUT /collections/{collectionId}/responses/{responseId}` - Update a response
- `DELETE /collections/{collectionId}/responses/{responseId}` - Delete a response
- `GET /collections/{collectionUid}/responses/{responseUid}/comments` - Get response comments
- `POST /collections/{collectionUid}/responses/{responseUid}/comments` - Create response comment
- `PUT /collections/{collectionUid}/responses/{responseUid}/comments/{commentId}` - Update response comment
- `DELETE /collections/{collectionUid}/responses/{responseUid}/comments/{commentId}` - Delete response comment

## Related Modules

- **[Requests](../requests/README.md)** - Manage requests (responses are created for requests)
- **[Collections](../collections/README.md)** - Manage collections that contain responses
- **[Users](../users/README.md)** - Get user ID for comment operations

## Additional Resources

- [Postman API Documentation](https://learning.postman.com/docs/developer/postman-api/intro-api/)
- [Postman Collection Format](https://schema.postman.com/collection/json/v2.1.0/draft-07/docs/index.html)

