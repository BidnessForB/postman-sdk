# Mocks Module

This module provides functions to interact with the Postman API's mock server endpoints.

## Available Functions

### Mock Server Management

#### `getMocks(teamId, workspace)`
Gets all mock servers.

**Parameters:**
- `teamId` (string, optional) - Return only mock servers that belong to the given team ID
- `workspace` (string, optional) - Return only mock servers in the given workspace

**Returns:** Promise with list of mocks

**Example:**
```javascript
const { mocks } = require('@bidnessforb/postman-sdk');

// Get all mocks
const result = await mocks.getMocks();
console.log(result.data.mocks);

// Get mocks in a specific workspace
const workspaceMocks = await mocks.getMocks(null, 'workspace-id');
```

---

#### `createMock(mockData, workspace)`
Creates a mock server in a collection.

**Parameters:**
- `mockData` (object) - The mock object containing:
  - `collection` (string, required) - The collection UID (not just ID). Use `buildUid(userId, collectionId)` from `core/utils`
  - `name` (string, optional) - The mock server's name
  - `environment` (string, optional) - The unique ID of the mock's associated environment
  - `private` (boolean, optional) - If true, the mock server is set private (default: true)
- `workspace` (string, required) - A workspace ID in which to create the mock server

**Returns:** Promise with created mock data

**Example:**
```javascript
const { buildUid } = require('./core/utils');

const mockData = {
  name: 'My Mock Server',
  collection: buildUid(userId, collectionId), // Must use UID format
  private: true
};

const result = await mocks.createMock(mockData, 'workspace-id');
console.log(result.data.mock);
```

---

#### `getMock(mockId)`
Gets information about a mock server.

**Parameters:**
- `mockId` (string) - The mock's ID

**Returns:** Promise with mock data

**Example:**
```javascript
const result = await mocks.getMock('mock-id');
console.log(result.data.mock);
```

---

#### `updateMock(mockId, mockData)`
Updates a mock server.

**Parameters:**
- `mockId` (string) - The mock's ID
- `mockData` (object) - The mock object containing:
  - `collection` (string, required) - The ID of the collection associated with the mock server
  - `name` (string, optional) - The mock server's name
  - `environment` (string, optional) - The associated environment's unique ID
  - `private` (boolean, optional) - If true, the mock server is set private
  - `versionTag` (string, optional) - The API's version tag ID
  - `config` (object, optional) - Configuration object with:
    - `serverResponseId` (string, optional) - The server response ID for default response

**Returns:** Promise with updated mock data

**Example:**
```javascript
const mockData = {
  name: 'Updated Mock Name',
  collection: 'collection-id',
  private: false
};

const result = await mocks.updateMock('mock-id', mockData);
console.log(result.data.mock);
```

---

#### `deleteMock(mockId)`
Deletes a mock server.

**Parameters:**
- `mockId` (string) - The mock's ID

**Returns:** Promise with deleted mock data

**Example:**
```javascript
const result = await mocks.deleteMock('mock-id');
console.log(result.data.mock);
```

---

### Call Logs

#### `getMockCallLogs(mockId, limit, cursor, until, since, responseStatusCode, responseType, requestMethod, requestPath, sort, direction, include)`
Gets a mock server's call logs.

**Parameters:**
- `mockId` (string) - The mock's ID
- `limit` (number, optional) - The maximum number of rows to return (defaults to 100)
- `cursor` (string, optional) - The pointer to the first record of the set of paginated results
- `until` (string, optional) - Return only results created until this given time (ISO 8601 format)
- `since` (string, optional) - Return only results created since the given time (ISO 8601 format)
- `responseStatusCode` (number, optional) - Return only call logs that match the given HTTP response status code
- `responseType` (string, optional) - Return only call logs that match the given response type
- `requestMethod` (string, optional) - Return only call logs that match the given HTTP method
- `requestPath` (string, optional) - Return only call logs that match the given request path
- `sort` (string, optional) - Sort the results by the given value (e.g., 'servedAt')
- `direction` (string, optional) - Sort in ascending ('asc') or descending ('desc') order
- `include` (string, optional) - Include call log records with header and body data (comma-separated values)

**Returns:** Promise with call logs

**Example:**
```javascript
// Get all call logs
const result = await mocks.getMockCallLogs('mock-id');
console.log(result.data['call-logs']);

// Get call logs with filtering
const filteredLogs = await mocks.getMockCallLogs(
  'mock-id',
  50,                  // limit
  null,                // cursor
  null,                // until
  null,                // since
  200,                 // responseStatusCode
  'success',           // responseType
  'GET',               // requestMethod
  '/users',            // requestPath
  'servedAt',          // sort
  'desc',              // direction
  'request.headers'    // include
);
```

---

### Publishing

#### `createMockPublish(mockId)`
Publishes a mock server (sets Access Control to public).

**Parameters:**
- `mockId` (string) - The mock's ID

**Returns:** Promise with publish result

**Example:**
```javascript
const result = await mocks.createMockPublish('mock-id');
console.log(result.data.mock);
```

---

#### `deleteMockUnpublish(mockId)`
Unpublishes a mock server (sets Access Control to private).

**Parameters:**
- `mockId` (string) - The mock's ID

**Returns:** Promise with unpublish result

**Example:**
```javascript
const result = await mocks.deleteMockUnpublish('mock-id');
console.log(result.data.mock);
```

---

### Server Responses

#### `getMockServerResponses(mockId)`
Gets all of a mock server's server responses.

**Parameters:**
- `mockId` (string) - The mock's ID

**Returns:** Promise with array of server responses

**Example:**
```javascript
const result = await mocks.getMockServerResponses('mock-id');
console.log(result.data);
```

---

#### `createMockServerResponse(mockId, serverResponseData)`
Creates a server response for a mock server. Server responses let you simulate 5xx server-level responses.

**Parameters:**
- `mockId` (string) - The mock's ID
- `serverResponseData` (object) - The server response object containing:
  - `name` (string, required) - The server response's name
  - `statusCode` (integer, required) - The server response's 5xx HTTP response code
  - `headers` (array, optional) - Array of header objects with `key` and `value` properties
  - `body` (string, optional) - The server response's body
  - `language` (string, optional) - The server response's body language type (text, javascript, json, html, xml)

**Returns:** Promise with created server response data

**Example:**
```javascript
const serverResponseData = {
  name: 'Internal Server Error',
  statusCode: 500,
  headers: [
    {
      key: 'Content-Type',
      value: 'application/json'
    }
  ],
  body: JSON.stringify({
    message: 'Something went wrong'
  }),
  language: 'json'
};

const result = await mocks.createMockServerResponse('mock-id', serverResponseData);
console.log(result.data);
```

---

#### `getMockServerResponse(mockId, serverResponseId)`
Gets information about a server response.

**Parameters:**
- `mockId` (string) - The mock's ID
- `serverResponseId` (string) - The server response's ID

**Returns:** Promise with server response data

**Example:**
```javascript
const result = await mocks.getMockServerResponse('mock-id', 'server-response-id');
console.log(result.data);
```

---

#### `updateMockServerResponse(mockId, serverResponseId, serverResponseData)`
Updates a mock server's server response.

**Parameters:**
- `mockId` (string) - The mock's ID
- `serverResponseId` (string) - The server response's ID
- `serverResponseData` (object) - The server response object with fields to update

**Returns:** Promise with updated server response data

**Example:**
```javascript
const serverResponseData = {
  name: 'Service Unavailable',
  statusCode: 503
};

const result = await mocks.updateMockServerResponse(
  'mock-id',
  'server-response-id',
  serverResponseData
);
console.log(result.data);
```

---

#### `deleteMockServerResponse(mockId, serverResponseId)`
Deletes a mock server's server response.

**Parameters:**
- `mockId` (string) - The mock's ID
- `serverResponseId` (string) - The server response's ID

**Returns:** Promise with deleted server response data

**Example:**
```javascript
const result = await mocks.deleteMockServerResponse('mock-id', 'server-response-id');
console.log(result.data);
```

---

## Complete Example

```javascript
const { mocks, users } = require('@bidnessforb/postman-sdk');
const { buildUid } = require('@bidnessforb/postman-sdk/src/core/utils');

async function manageMockServers() {
  try {
    // Get authenticated user ID (needed for UID construction)
    const userResult = await users.getAuthenticatedUser();
    const userId = userResult.data.user.id;

    // Create a mock server (collection must be in UID format)
    const mockData = {
      name: 'My API Mock',
      collection: buildUid(userId, 'collection-id'), // Use UID format
      private: false
    };
    const createResult = await mocks.createMock(mockData, 'workspace-id');
    const mockId = createResult.data.mock.id;
    console.log('Created mock:', mockId);
    console.log('Mock URL:', createResult.data.mock.mockUrl);

    // Get mock details
    const mockDetails = await mocks.getMock(mockId);
    console.log('Mock details:', mockDetails.data.mock);

    // Create a server response
    const serverResponse = {
      name: 'Internal Server Error',
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' }),
      language: 'json'
    };
    const serverResponseResult = await mocks.createMockServerResponse(mockId, serverResponse);
    const serverResponseId = serverResponseResult.data.id;
    console.log('Created server response:', serverResponseId);

    // Get call logs
    const logs = await mocks.getMockCallLogs(mockId, 10);
    console.log('Call logs:', logs.data['call-logs'].length);

    // Clean up
    await mocks.deleteMockServerResponse(mockId, serverResponseId);
    await mocks.deleteMock(mockId);
    console.log('Cleaned up');
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('API Response:', error.response.data);
    }
  }
}

manageMockServers();
```

## Notes

- Mock servers can be created for collections
- **Important**: When creating a mock, the `collection` parameter must be in UID format (userId-collectionId), not just the collection ID. Use the `buildUid()` utility function from `core/utils`
- You cannot create mocks for collections added to an API definition
- Server responses simulate 5xx server-level responses (500-599)
- Call logs have a retention period based on your Postman plan
- Publishing a mock sets its Access Control to public
- Unpublishing sets it back to private
- Some features (like publishing/unpublishing) may require specific Postman plan features or permissions

