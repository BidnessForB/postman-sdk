# Spec Fixtures

This directory contains fixture files for testing spec creation across different API specification types and formats.

## Available Fixtures

### OpenAPI 2.0 (Swagger)
- `openapi-2.0.yaml` - OpenAPI 2.0 specification in YAML format
- `openapi-2.0.json` - OpenAPI 2.0 specification in JSON format

### OpenAPI 3.0
- `openapi-3.0.yaml` - OpenAPI 3.0 specification in YAML format
- `openapi-3.0.json` - OpenAPI 3.0 specification in JSON format

### OpenAPI 3.1
- `openapi-3.1.yaml` - OpenAPI 3.1 specification in YAML format
- `openapi-3.1.json` - OpenAPI 3.1 specification in JSON format

### AsyncAPI 2.0
- `asyncapi-2.0.yaml` - AsyncAPI 2.0 specification in YAML format
- `asyncapi-2.0.json` - AsyncAPI 2.0 specification in JSON format

### Multi-File Examples
- `multi-file/` - Example of a spec split across multiple files with references

## Usage

The fixtures are used in functional tests via the `fixtures-loader` module:

```javascript
const { loadSpecFixture, getAllSpecFixtures } = require('./fixtures-loader');

// Load a specific fixture
const fixture = loadSpecFixture('OPENAPI:3.0', 'yaml');
console.log(fixture.content); // YAML content
console.log(fixture.name);    // 'OpenAPI 3.0 YAML Spec'
console.log(fixture.path);    // 'index.yaml'

// Get all fixture configurations
const allFixtures = getAllSpecFixtures();
// Returns array of 8 fixtures (4 types × 2 formats)
```

## Testing Coverage

The functional tests use these fixtures to verify:
1. Spec creation with different spec types (OpenAPI 2.0, 3.0, 3.1, AsyncAPI 2.0)
2. Spec creation with different formats (YAML and JSON)
3. Spec retrieval and validation
4. Definition parsing and structure validation

Each fixture is used to:
- Create a spec via the Postman API
- Verify the spec is created with correct type
- Retrieve and validate the spec definition
- Clean up after testing

## Fixture Structure

Each spec fixture contains:
- **Version identifier** - Declares the spec version (e.g., `openapi: 3.0.0`, `swagger: '2.0'`, `asyncapi: 2.0.0`)
- **Info section** - Title, version, and description
- **Server/host configuration** - API server details
- **Paths/channels** - At least one endpoint or channel definition
- **Components/definitions** - Reusable schema definitions

This ensures each fixture is a valid, minimal API specification that tests real-world scenarios.

