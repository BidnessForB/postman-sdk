const { getTagEntities } = require('../index');
const { workspaces } = require('../../index');
const { POSTMAN_API_KEY_ENV_VAR } = require('../../core/config');
const { loadTestIds } = require('../../__tests__/test-helpers');

describe('tags functional tests', () => {
  let testWorkspaceId;
  let testTagSlug;
  
  beforeAll(() => {
    if (!process.env[POSTMAN_API_KEY_ENV_VAR]) {
      throw new Error(`${POSTMAN_API_KEY_ENV_VAR} environment variable is required for functional tests`);
    }
    
    // Load the persisted workspace ID from test-ids.json
    const persistedIds = loadTestIds();
    if (persistedIds.workspace && persistedIds.workspace.id) {
      testWorkspaceId = persistedIds.workspace.id;
      console.log(`Using persisted workspace ID: ${testWorkspaceId}`);
    } else {
      throw new Error('No workspace ID found in test-ids.json. Run workspace tests first.');
    }
    
    // Use a unique tag for testing
    testTagSlug = 'sdk-test';
  });

  test('1. Setup - Add tag to test workspace', async () => {
    expect(testWorkspaceId).toBeDefined();
    
    // Add a test tag to the workspace
    const result = await workspaces.updateWorkspaceTags(testWorkspaceId, [
      { slug: testTagSlug }
    ]);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('tags');
    expect(result.data.tags).toHaveLength(1);
    expect(result.data.tags[0].slug).toBe(testTagSlug);
    
    console.log(`Tag '${testTagSlug}' added to workspace ${testWorkspaceId}`);
  });

  test('2. getTagEntities - should find workspace with test tag', async () => {
    const result = await getTagEntities(testTagSlug);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('data');
    expect(result.data.data).toHaveProperty('entities');
    expect(Array.isArray(result.data.data.entities)).toBe(true);
    expect(result.data).toHaveProperty('meta');
    expect(result.data.meta).toHaveProperty('count');
    
    // Should find at least our test workspace
    expect(result.data.data.entities.length).toBeGreaterThan(0);
    expect(result.data.meta.count).toBeGreaterThan(0);
    
    // Verify our workspace is in the results
    const ourWorkspace = result.data.data.entities.find(
      e => e.entityId === testWorkspaceId && e.entityType === 'workspace'
    );
    expect(ourWorkspace).toBeDefined();
    
    console.log(`Found ${result.data.meta.count} entities with tag '${testTagSlug}'`);
  });

  test('3. getTagEntities - should filter by workspace entityType', async () => {
    const result = await getTagEntities(testTagSlug, null, null, null, 'workspace');

    expect(result.status).toBe(200);
    expect(result.data.data.entities.length).toBeGreaterThan(0);
    
    // All results should be workspaces
    result.data.data.entities.forEach(entity => {
      expect(entity.entityType).toBe('workspace');
    });
    
    // Our workspace should be in the results
    const ourWorkspace = result.data.data.entities.find(e => e.entityId === testWorkspaceId);
    expect(ourWorkspace).toBeDefined();
  });

  test('4. getTagEntities - should handle limit parameter', async () => {
    const result = await getTagEntities(testTagSlug, 1);

    expect(result.status).toBe(200);
    expect(result.data.data.entities.length).toBeLessThanOrEqual(1);
    expect(result.data.meta.count).toBeGreaterThan(0);
  });

  test('5. getTagEntities - should handle direction parameter', async () => {
    // Test ascending order
    const ascResult = await getTagEntities(testTagSlug, null, 'asc');
    expect(ascResult.status).toBe(200);
    
    // Test descending order  
    const descResult = await getTagEntities(testTagSlug, null, 'desc');
    expect(descResult.status).toBe(200);
    
    // Both should return results
    expect(ascResult.data.data.entities.length).toBeGreaterThan(0);
    expect(descResult.data.data.entities.length).toBeGreaterThan(0);
  });

  test('6. getTagEntities - should handle filter by collection type (no results expected)', async () => {
    // Our test workspace has the tag, but collections might not
    const result = await getTagEntities(testTagSlug, null, null, null, 'collection');

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('data');
    expect(result.data.data).toHaveProperty('entities');
    expect(Array.isArray(result.data.data.entities)).toBe(true);
    
    // If there are results, they should all be collections
    if (result.data.data.entities.length > 0) {
      result.data.data.entities.forEach(entity => {
        expect(entity.entityType).toBe('collection');
      });
    }
  });

  test('7. getTagEntities - should handle filter by api type (no results expected)', async () => {
    // Our test workspace has the tag, but APIs might not
    const result = await getTagEntities(testTagSlug, null, null, null, 'api');

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('data');
    expect(result.data.data).toHaveProperty('entities');
    expect(Array.isArray(result.data.data.entities)).toBe(true);
    
    // If there are results, they should all be APIs
    if (result.data.data.entities.length > 0) {
      result.data.data.entities.forEach(entity => {
        expect(entity.entityType).toBe('api');
      });
    }
  });

  test('8. Cleanup - Remove tag from test workspace', async () => {
    expect(testWorkspaceId).toBeDefined();
    
    // Remove all tags from the workspace
    const result = await workspaces.updateWorkspaceTags(testWorkspaceId, []);

    expect(result.status).toBe(200);
    expect(result.data.tags).toHaveLength(0);
    
    console.log(`Tag '${testTagSlug}' removed from workspace ${testWorkspaceId}`);
  });

  describe('error handling', () => {
    test('should handle non-existent tag', async () => {
      const nonExistentTag = 'this-tag-definitely-does-not-exist-12345';
      
      await expect(getTagEntities(nonExistentTag)).rejects.toThrow();
    });

    test('should handle invalid tag format', async () => {
      // Tags must start with lowercase letter and follow pattern ^[a-z][a-z0-9-]*[a-z0-9]+$
      const invalidTag = 'INVALID_TAG';
      
      await expect(getTagEntities(invalidTag)).rejects.toThrow();
    });

    test('should handle invalid entityType', async () => {
      // Invalid entity type - API validates and returns 400 error
      await expect(
        getTagEntities(testTagSlug, null, null, null, 'invalid-type')
      ).rejects.toThrow();
    });
  });
});

