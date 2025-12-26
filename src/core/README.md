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

### `validateId(id, paramName)`

Validates a standard ID (UUID format). Throws an error if the ID is invalid.

**Parameters:**
- `id` (string) - The ID to validate
- `paramName` (string) - The parameter name for error messages

**Returns:** `void` - No return value (throws error if invalid)

**Throws:** `Error` - If the ID is missing or invalid

**Validation:**
- IDs must match regex: `/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i`

**Example:**
```javascript
const { validateId } = require('./core/utils');

try {
  validateId('c6d2471c-3664-47b5-adc8-35d52484f2f6', 'collectionId');
  console.log('Valid ID');
} catch (error) {
  console.error(error.message);
}

// Invalid ID - throws error
try {
  validateId('invalid-id', 'collectionId');
} catch (error) {
  console.error(error.message);
  // "collectionId must be a valid ID format (e.g., 'cd5cb6e7-0a1e-4b82-a577-b2068a70f830')"
}
```

### `validateUid(uid, paramName)`

Validates a UID (userId-UUID format). Throws an error if the UID is invalid.

**Parameters:**
- `uid` (string) - The UID to validate
- `paramName` (string) - The parameter name for error messages

**Returns:** `void` - No return value (throws error if invalid)

**Throws:** `Error` - If the UID is missing or invalid

**Validation:**
- UIDs must match regex: `/^[0-9]{1,10}-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i`

**Example:**
```javascript
const { validateUid } = require('./core/utils');

try {
  validateUid('12345678-c6d2471c-3664-47b5-adc8-35d52484f2f6', 'collectionUid');
  console.log('Valid UID');
} catch (error) {
  console.error(error.message);
}

// Invalid UID - throws error
try {
  validateUid('invalid-uid', 'collectionUid');
} catch (error) {
  console.error(error.message);
  // "collectionUid must be a valid UID format (e.g., '11111122-cd5cb6e7-0a1e-4b82-a577-b2068a70f830')"
}
```

**Usage in SDK:**
The validation functions are used throughout the SDK to ensure IDs and UIDs are properly formatted before making API calls:
- `validateId()` - Used for collection IDs, workspace IDs, spec IDs, etc.
- `validateUid()` - Used for comment-related endpoints that require UIDs:
  - Collection comments: `/collections/{collectionUid}/comments`
  - Folder comments: `/collections/{collectionUid}/folders/{folderUid}/comments`
  - Request comments: `/collections/{collectionUid}/requests/{requestUid}/comments`
  - Response comments: `/collections/{collectionUid}/responses/{responseUid}/comments`

### `fixtures.js`
Provides utilities for loading test fixture files for specs and API definitions.

## Fixtures Functions

### `loadFixture(fixturePath)`

Loads a fixture file from the fixtures directory.

**Parameters:**
- `fixturePath` (string) - Path relative to `fixtures/` directory (e.g., `'specs/openapi-3.0.yaml'`)

**Returns:** `string` - File content as string

**Throws:** `Error` - If fixture file is not found

**Example:**
```javascript
const { loadFixture } = require('./core/fixtures');

const specContent = loadFixture('specs/openapi-3.0.yaml');
console.log(specContent); // YAML content as string
```

### `loadSpecFiles(specType)`

Loads spec files for createSpec based on spec type. Returns an array of file objects ready for use with the Postman API.

**Parameters:**
- `specType` (string) - Type of spec: `'openapi-3.0'`, `'openapi-3.1'`, `'asyncapi-2.0'`, or `'multi-file'`

**Returns:** `Array<Object>` - Array of file objects with `path` and `content` properties

**Throws:** `Error` - If spec type is unknown

**File Object Structure:**
```javascript
// Single-file specs
{
  path: 'openapi.yaml',
  content: '<file content>'
}

// Multi-file specs (includes type property)
{
  path: 'openapi.yaml',
  content: '<file content>',
  type: 'ROOT'  // or 'DEFAULT'
}
```

**Example:**
```javascript
const { loadSpecFiles } = require('./core/fixtures');

// Load single-file spec
const openapi30Files = loadSpecFiles('openapi-3.0');
// Returns: [{ path: 'openapi.yaml', content: '...' }]

// Load multi-file spec
const multiFiles = loadSpecFiles('multi-file');
// Returns: [
//   { path: 'openapi.yaml', content: '...', type: 'ROOT' },
//   { path: 'components/schemas.json', content: '...', type: 'DEFAULT' },
//   { path: 'components/responses.json', content: '...', type: 'DEFAULT' }
// ]
```

**Available Spec Types:**
- `'openapi-3.0'` - OpenAPI 3.0 specification
- `'openapi-3.1'` - OpenAPI 3.1 specification
- `'asyncapi-2.0'` - AsyncAPI 2.0 specification
- `'multi-file'` - Multi-file OpenAPI specification with separated components

## Testing

### Unit Tests

Run core utility unit tests:
```bash
npm test -- src/core/__tests__/utils.unit.test.js
npm test -- src/core/__tests__/request.unit.test.js
npm test -- src/core/__tests__/fixtures.unit.test.js
```

**Test coverage:**

#### `utils.js`
- ✅ `buildQueryString()` - 5 tests
  - Basic query string building
  - Handling undefined/null values
  - Empty params object
  - Number to string conversion
  
- ✅ `getContentFS()` - 2 tests
  - Reading file content
  - Path resolution
  
- ✅ `validateId()` - 4 tests
  - Accepting valid UUID format
  - Rejecting invalid ID formats
  - Throwing errors with parameter name
  - Handling missing/null IDs
  
- ✅ `validateUid()` - 4 tests
  - Accepting valid UID format (userId-UUID)
  - Rejecting invalid UID formats
  - Throwing errors with parameter name
  - Handling missing/null UIDs

#### `request.js`
- ✅ `buildAxiosConfig()` - 8 tests
  - Config building with method and endpoint
  - Including data when provided
  - Handling undefined/null data
  - Merging extra config options
  - Different HTTP methods
  - URL construction
  - Required headers
  
- ✅ `executeRequest()` - 9 tests
  - Successful 2xx responses
  - Error handling for 4xx/5xx responses
  - Network error handling
  - Error message formatting

#### `fixtures.js` (Unit Tests)
- ✅ `loadFixture()` - 4 tests (mocked)
  - Loading fixture from fixtures directory
  - Throwing error for non-existent file
  - Handling nested fixture paths
  - Reading with utf8 encoding
  
- ✅ `loadSpecFiles()` - 9 tests (mocked)
  - Loading each spec type (openapi-3.0, openapi-3.1, asyncapi-2.0, multi-file)
  - Multi-file spec structure validation
  - Error handling for unknown spec types
  - Error message content validation

### Integration Tests

Run core fixtures integration tests:
```bash
npm test -- src/core/__tests__/fixtures.integration.test.js
```

These tests run actual file system operations (not mocked) to provide real-world validation and achieve actual code coverage.

**Integration test coverage:**

#### `fixtures.js` (Integration Tests)
- ✅ `loadFixture()` - 7 tests (real filesystem)
  - Loading actual OpenAPI 3.0, 3.1 fixtures
  - Loading actual AsyncAPI 2.0 fixture
  - Throwing error for non-existent files
  - Loading nested fixture files
  - Loading JSON fixture files
  - Handling deeply nested paths
  
- ✅ `loadSpecFiles()` - 10 tests (real filesystem)
  - Loading all spec types with actual files
  - Multi-file spec structure validation
  - Error handling and messages
  - Valid content verification
  - Type property validation
  - Comparing loaded content with direct file reads

**Why Both Unit and Integration Tests?**
- **Unit tests** use mocks for fast, isolated testing
- **Integration tests** use real files for validation and code coverage
- Together they provide comprehensive test coverage

## Notes

### ID and UID Formats
- **UUID (36 chars)**: Standard object ID format used by Postman API
  - Format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
  - Example: `c6d2471c-3664-47b5-adc8-35d52484f2f6`
- **UID (45 chars)**: User-specific identifier format: `{userId}-{objectId}`
  - Format: `nnnnnnnnnn-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
  - Example: `12345678-c6d2471c-3664-47b5-adc8-35d52484f2f6`
  - Includes: 1-10 digit userId + hyphen + 36-character UUID

### Building UIDs
The SDK no longer provides a `buildUid()` helper function. You must construct UIDs manually using string concatenation:

```javascript
const userId = '12345678';
const collectionId = 'c6d2471c-3664-47b5-adc8-35d52484f2f6';
const collectionUid = `${userId}-${collectionId}`;
// Result: '12345678-c6d2471c-3664-47b5-adc8-35d52484f2f6'
```

### Validation
The SDK validates IDs and UIDs before making API calls:
- `validateId()` - Validates 36-character UUIDs
- `validateUid()` - Validates 45-character UIDs (userId-UUID format)
- Both functions throw descriptive errors for invalid formats

### Validation Benefits
The validation functions prevent:
- API errors from malformed identifiers
- Accidental use of placeholder IDs
- Invalid ID/UID format combinations
- Improved error messages with parameter names

