# Tags Module Implementation Summary



**Date:** December 25, 2025  
**Module:** Tags (NEW)  
**Endpoints Implemented:** 1

## Overview

Implemented a new Tags module for the Postman SDK, providing functionality to retrieve Postman elements (workspaces, APIs, collections) that are associated with a specific tag.

## Endpoint Implemented

### GET /tags/{slugId}/entities

**Function:** `getTagEntities(slugId, limit, direction, cursor, entityType)`

Gets Postman elements (entities) by a given tag. Tags enable you to organize and search workspaces, APIs, and collections that contain shared tags.

**Parameters:**
- `slugId` (required) - The tag's ID/slug (e.g., 'needs-review', 'production')
- `limit` (optional) - Maximum number of tagged elements to return (max 50, default 10)
- `direction` (optional) - Sort order: 'asc' or 'desc' based on tagging time
- `cursor` (optional) - Pagination cursor from previous response's meta.nextCursor
- `entityType` (optional) - Filter by element type: 'api', 'collection', or 'workspace'

**Returns:** 
- `data.entities` - Array of entity objects with `entityId` and `entityType`
- `meta.count` - Number of tagged elements returned
- `meta.nextCursor` - Pagination cursor for next page (when applicable)

**Example:**
```javascript
const { tags } = require('@bidnessforb/postman-sdk');

// Get all entities with 'production' tag
const result = await tags.getTagEntities('production');
console.log(result.data.data.entities);
// [
//   { entityId: '...', entityType: 'workspace' },
//   { entityId: '...', entityType: 'collection' }
// ]

// Get only collections with 'needs-review' tag
const collections = await tags.getTagEntities('needs-review', null, null, null, 'collection');

// Get entities with pagination
const page1 = await tags.getTagEntities('api-v2', 20, 'desc');
const page2 = await tags.getTagEntities('api-v2', 20, 'desc', page1.data.meta.nextCursor);
```

## Files Created

### Implementation
- `src/tags/index.js` - New module with `getTagEntities()` function
- `src/index.js` - Updated to export tags module

### Tests
- `src/tags/__tests__/unit.test.js` - 13 comprehensive unit tests:
  - Basic GET request without query params
  - Individual query parameters (limit, direction, cursor, entityType)
  - All query parameters together
  - Multiple entities response
  - Empty entities array
  - Correct headers
  - Tag slug with hyphens
  - Filter by each entityType (api, collection, workspace)

- `src/tags/__tests__/functional.test.js` - 11 functional tests:
  - Setup workspace with test tag
  - Find entities by tag
  - Filter by workspace entityType
  - Limit parameter
  - Direction parameter (asc/desc)
  - Filter by collection type
  - Filter by api type
  - Cleanup (remove tag)
  - Error handling (non-existent tag, invalid format, invalid entityType)

### Documentation
- `docs/API-ENDPOINTS-TODO.md` - Updated to reflect:
  - SDK version: 0.4.0
  - Tags module: 0/1 → 1/1 (100%)
  - Other Modules: 0/13 → 1/13 (7.69%)
  - Overall implementation: 50/191 → 51/191 (26.18% → 26.70%)

## Test Results

### Unit Tests
✅ **All 179 unit tests pass** (including 13 new tags tests)

### Functional Tests
✅ **All 11 functional tests pass**

**Test Coverage:**
- Get entities by tag slug
- Pagination with limit parameter
- Sort order with direction parameter
- Filter by entityType (api, collection, workspace)
- Handle empty results
- Error handling for invalid inputs
- Tag lifecycle (setup → test → cleanup)

## API Compliance

Implementation follows the Postman API specification in `postmanAPIspec.yaml`:

- ✅ Correct HTTP method (GET)
- ✅ Correct endpoint path
- ✅ All query parameters supported
- ✅ Correct request structure
- ✅ Correct response structure
- ✅ Proper error handling
- ✅ JSDoc documentation
- ✅ Follows SDK patterns and conventions

## Tag Requirements

Tags must follow these rules:
- Pattern: `^[a-z][a-z0-9-]*[a-z0-9]+$`
- Start with lowercase letter
- Contain only lowercase letters, numbers, and hyphens
- End with lowercase letter or number
- Length: 2-64 characters
- Examples: `production`, `needs-review`, `api-v2`, `test123`

## Entity Types

The endpoint can return three types of Postman elements:
- `api` - API definitions
- `collection` - Collections
- `workspace` - Workspaces

## Pagination

The endpoint supports cursor-based pagination:
```javascript
let cursor = null;
let allEntities = [];

do {
  const result = await tags.getTagEntities('production', 50, 'asc', cursor);
  allEntities.push(...result.data.data.entities);
  cursor = result.data.meta.nextCursor;
} while (cursor);
```

## Integration with Workspace Tags

The tags module works seamlessly with workspace tags:

```javascript
const { workspaces, tags } = require('@bidnessforb/postman-sdk');

// Add tags to a workspace
await workspaces.updateWorkspaceTags(workspaceId, [
  { slug: 'production' },
  { slug: 'critical' }
]);

// Find all workspaces with 'production' tag
const result = await tags.getTagEntities('production', null, null, null, 'workspace');
const productionWorkspaces = result.data.data.entities
  .filter(e => e.entityType === 'workspace')
  .map(e => e.entityId);
```

## Module Status

**Tags Module Progress:** 1/1 endpoints (100% complete) ✅

**Overall SDK Progress:** 51/191 endpoints (26.70%)

## Notes

- Tags are available on Postman Enterprise plans
- This endpoint enables searching across workspaces, APIs, and collections by tag
- The `slugId` parameter uses the tag slug, not a UUID
- Results are paginated with cursor-based navigation
- Tag validation is enforced by the Postman API
- The module includes comprehensive error handling for invalid inputs
- Both unit and functional tests provide full coverage

## Enterprise Feature

**Important:** Tagging is available on [Postman Enterprise plans](https://www.postman.com/pricing/). The endpoint will return appropriate errors if used with non-Enterprise accounts.

---

**Implementation Status:** ✅ Complete and Tested

