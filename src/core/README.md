# Core Module

The Core module provides foundational utilities, configuration, and request handling functionality used throughout the SDK.

## Files

### `config.js`
Contains SDK configuration including:
- `BASE_URL`: Postman API base URL (`https://api.getpostman.com`)
- `POSTMAN_API_KEY_ENV_VAR`: Environment variable name for API key (`POSTMAN_API_KEY_POSTMAN`)
- `apiKey`: Retrieved from environment variable

### `request.js`
Provides HTTP request handling utilities:
- `buildAxiosConfig()`: Builds axios configuration objects with proper headers and authentication
- `executeRequest()`: Executes HTTP requests and handles errors consistently

### `utils.js`
Shared utility functions used across the SDK.

## Utility Functions

### `buildQueryString(params)`

Builds a URL query string from a parameters object, filtering out `null` and `undefined` values.

**Parameters:**
- `params` (Object) - Object with query parameters

**Returns:** `string` - Query string (e.g., `'?key1=value1&key2=value2'`)

**Example:**
```javascript
const { buildQueryString } = require('./core/utils');

const queryString = buildQueryString({
  workspaceId: 'abc-123',
  limit: 10,
  cursor: undefined  // Will be omitted
});
// Returns: '?workspaceId=abc-123&limit=10'
```

### `getContentFS(filePath)`

Reads file content from the filesystem and returns it in the format expected by Postman API.

**Parameters:**
- `filePath` (string) - The path to the file

**Returns:** `Object` - Object with `content` property containing the file content

**Example:**
```javascript
const { getContentFS } = require('./core/utils');

const specContent = getContentFS('./my-api.yaml');
console.log(specContent.content); // File contents as string
```

### `buildUid(userId, objectId)`

Builds a UID (Unique Identifier) from a user ID and an object ID. UIDs are required for certain Postman API endpoints that operate on user-specific resources.

**Parameters:**
- `userId` (string|number) - The user's ID
- `objectId` (string) - The object's ID (e.g., collection ID, workspace ID)

**Returns:** `string|null` - The UID in format `userId-objectId`, or `null` if objectId is invalid

**Behavior:**
- **36-character UUID** (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`): Validates format and builds UID by prepending userId
- **45-character UID** (format: `nnnnnnnnnn-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`): Already a UID, returns unchanged
- **Invalid format**: Returns `null`

**Validation:**
- UUIDs must match regex: `/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i`
- UIDs must match regex: `/^[0-9]{1,10}-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i`

**Examples:**
```javascript
const { buildUid } = require('./core/utils');

// Example 1: Build UID from user ID and collection ID (36-char UUID)
const uid1 = buildUid(12345678, 'c6d2471c-3664-47b5-adc8-35d52484f2f6');
console.log(uid1); // '12345678-c6d2471c-3664-47b5-adc8-35d52484f2f6'

// Example 2: objectId is already a UID (45 chars) - returns unchanged
const uid2 = buildUid(12345678, '87654321-c6d2471c-3664-47b5-adc8-35d52484f2f6');
console.log(uid2); // '87654321-c6d2471c-3664-47b5-adc8-35d52484f2f6'

// Example 3: Invalid objectId format - returns null
const uid3 = buildUid(12345678, 'invalid-id');
console.log(uid3); // null

// Example 4: Non-hex characters in UUID - returns null
const uid4 = buildUid(12345678, 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
console.log(uid4); // null (x is not a valid hex digit)
```

**Usage in SDK:**
The `buildUid()` function is used extensively in comment-related endpoints:
- Collection comments: `/collections/{collectionUid}/comments`
- Folder comments: `/collections/{collectionUid}/folders/{folderUid}/comments`
- Request comments: `/collections/{collectionUid}/requests/{requestUid}/comments`

## Testing

### Unit Tests

Run core utility unit tests:
```bash
npm test -- src/core/__tests__/utils.unit.test.js
```

**Test coverage:**
- ✅ `buildQueryString()` - 5 tests
  - Basic query string building
  - Handling undefined/null values
  - Empty params object
  - Number to string conversion
  
- ✅ `getContentFS()` - 2 tests
  - Reading file content
  - Path resolution
  
- ✅ `buildUid()` - 5 tests
  - Building UID from numeric userId
  - Building UID from string userId
  - Handling pre-existing UIDs (45 chars)
  - Rejecting invalid objectId formats
  - Various valid UUID formats

## Notes

### UID Format
- **UUID (36 chars)**: Standard object ID format used by Postman API
- **UID (45 chars)**: User-specific identifier format: `{userId}-{objectId}`
- The 45-character UID format includes:
  - 1-10 digit userId
  - 1 hyphen separator
  - 36-character UUID (8-4-4-4-12 format with hyphens)

### Error Handling
- `buildUid()` returns `null` for invalid formats instead of throwing errors
- Calling code should check for `null` returns and handle appropriately
- This allows for graceful degradation when working with mixed ID formats

### Validation Benefits
The validation in `buildUid()` prevents:
- Building UIDs from invalid IDs
- Double-prepending user IDs to existing UIDs
- API errors from malformed identifiers
- Accidental use of placeholder IDs (like 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')

