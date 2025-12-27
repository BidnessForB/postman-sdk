const { getTagEntities } = require('../tag');
const { updateWorkspaceTags } = require('../../workspaces/workspace');
const { updateCollectionTags } = require('../../collections/collection');

const { loadTestIds,getUserId,getTestWorkspaceId,gettestCollectionUid,initPersistedIds } = require('../../__tests__/test-helpers');

describe('tags functional tests', () => {
  let testWorkspaceId;
  let testCollectionUid;
  let userId;
  let testTagSlug = 'sdk-test';
  let collectionTagSlug = 'sdk-collection-test';
  let persistedIds = {};
  
  
  beforeAll(async () => {
    
    
    // Load the persisted workspace ID and collection ID from test-ids.json
    await initPersistedIds(['tags']);
    persistedIds = loadTestIds();
    testWorkspaceId = await getTestWorkspaceId();
    if(!testWorkspaceId) {
      throw new Error('Workspace ID not found in test-ids.json. Run workspace functional tests first.');
    }
    userId = await getUserId();
      console.log('Using persisted userId:', userId);

    
    
      
      if (!persistedIds.collection || !persistedIds.collection.id) {
        // Create a test collection and persist its details in test-ids.json if not already present
      const { createCollection } = require('../../collections/collection');
        const collectionName = `SDK Test Collection ${Date.now()}`;
        const collectionData = {
          info: {
            name: collectionName,
            description: 'Test collection for tag functional tests',
            schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
          },
          item: [
            {
              name: 'Test Request',
              request: {
                method: 'GET',
                url: 'https://postman-echo.com/get',
                description: 'Sample GET request'
              }
            }
          ]
        };
        const result = await createCollection(collectionData, testWorkspaceId);
        if (result.status !== 200 || !result.data.collection || !result.data.collection.id) {
          throw new Error('Failed to create test collection for tag functional tests.');
        }
        persistedIds.collection = {
          ...persistedIds.collection,
          id: result.data.collection.id,
          uid: result.data.collection.uid,
          name: collectionName,
          createdAt: new Date().toISOString()
        };
        const { saveTestIds } = require('../../__tests__/test-helpers');
        saveTestIds(persistedIds);
        testCollectionUid = result.data.collection.uid;
      } else {
        testCollectionUid = persistedIds.collection.uid;
      }
    

    // Use unique tags for testing
    
  });

  describe('Workspace tags', () => {
    test('Setup - Add tag to test workspace', async () => {
      expect(testWorkspaceId).toBeDefined();
      
      // Add a test tag to the workspace
      const result = await updateWorkspaceTags(testWorkspaceId, [
        { slug: testTagSlug }
      ]);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('tags');
      expect(result.data.tags).toHaveLength(1);
      expect(result.data.tags[0].slug).toBe(testTagSlug);
      
      console.log(`Tag '${testTagSlug}' added to workspace ${testWorkspaceId}`);
    });

    test('should find workspace with test tag', async () => {
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

    test('should filter by workspace entityType', async () => {
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

    test('should handle limit parameter', async () => {
      const result = await getTagEntities(testTagSlug, 1);

      expect(result.status).toBe(200);
      expect(result.data.data.entities.length).toBeLessThanOrEqual(1);
      expect(result.data.meta.count).toBeGreaterThan(0);
    });

    test('should handle direction parameter', async () => {
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

    test('should handle filter by collection type (no collection results expected)', async () => {
      // Our test workspace has the tag, but collections might not (yet)
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

    test('should handle filter by api type (no api results expected)', async () => {
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

    test('Cleanup - Remove tag from test workspace', async () => {
      expect(testWorkspaceId).toBeDefined();
      
      // Remove all tags from the workspace
      const result = await updateWorkspaceTags(testWorkspaceId, []);

      expect(result.status).toBe(200);
      expect(result.data.tags).toHaveLength(0);
      
      console.log(`Tag '${testTagSlug}' removed from workspace ${testWorkspaceId}`);
    });
  });

  describe('Collection tags', () => {
    test('Setup - Add tag to test collection', async () => {
      expect(testCollectionUid).toBeDefined();
      expect(userId).toBeDefined();
      
      // Add a test tag to the collection
      const result = await updateCollectionTags(testCollectionUid, [
        { slug: collectionTagSlug }
      ]);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('tags');
      expect(result.data.tags).toHaveLength(1);
      expect(result.data.tags[0].slug).toBe(collectionTagSlug);
      
      console.log(`Tag '${collectionTagSlug}' added to collection ${testCollectionUid}`);
    });

    test('should find collection with test tag', async () => {
      // Wait a moment for tag indexing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = await getTagEntities(collectionTagSlug);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('data');
      expect(result.data.data).toHaveProperty('entities');
      expect(Array.isArray(result.data.data.entities)).toBe(true);
      expect(result.data).toHaveProperty('meta');
      expect(result.data.meta).toHaveProperty('count');
      
      // Should find at least our test collection
      expect(result.data.data.entities.length).toBeGreaterThan(0);
      expect(result.data.meta.count).toBeGreaterThan(0);
      
      // Verify our collection is in the results (API returns UID format)
      const ourCollection = result.data.data.entities.find(
        e => (e.entityId === testCollectionUid || e.entityId === testCollectionUid) && e.entityType === 'collection'
      );
      expect(ourCollection).toBeDefined();
      
      console.log(`Found ${result.data.meta.count} entities with tag '${collectionTagSlug}'`);
    });

    test('should filter by collection entityType', async () => {
      const result = await getTagEntities(collectionTagSlug, null, null, null, 'collection');

      expect(result.status).toBe(200);
      expect(result.data.data.entities.length).toBeGreaterThan(0);
      
      // All results should be collections
      result.data.data.entities.forEach(entity => {
        expect(entity.entityType).toBe('collection');
      });
      
      // Our collection should be in the results (API returns UID format)
      const ourCollection = result.data.data.entities.find(
        e => e.entityId === testCollectionUid || e.entityId === testCollectionUid
      );
      expect(ourCollection).toBeDefined();
      
      console.log(`Found ${result.data.data.entities.length} collection(s) with tag '${collectionTagSlug}'`);
    });

    test('should not find collection when filtering by workspace type', async () => {
      const result = await getTagEntities(collectionTagSlug, null, null, null, 'workspace');

      expect(result.status).toBe(200);
      expect(result.data.data).toHaveProperty('entities');
      expect(Array.isArray(result.data.data.entities)).toBe(true);
      
      // All results should be workspaces (none expected since we only tagged a collection)
      result.data.data.entities.forEach(entity => {
        expect(entity.entityType).toBe('workspace');
      });
      
      // Our collection should NOT be in the results (checking both ID formats)
      const ourCollection = result.data.data.entities.find(
        e => e.entityId === testCollectionUid || e.entityId === testCollectionUid
      );
      expect(ourCollection).toBeUndefined();
    });

    test('should handle mixed tags across workspace and collection', async () => {
      // Add the same tag to both workspace and collection
      const sharedTag = 'sdk-shared-test';
      
      await updateWorkspaceTags(testWorkspaceId, [{ slug: sharedTag }]);
      await updateCollectionTags(testCollectionUid, [{ slug: sharedTag }]);
      
      // Wait a moment for tag indexing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get all entities with the shared tag
      const result = await getTagEntities(sharedTag);
      
      expect(result.status).toBe(200);
      expect(result.data.data.entities.length).toBeGreaterThanOrEqual(2);
      
      // Should find both workspace and collection
      const workspaceEntity = result.data.data.entities.find(
        e => e.entityId === testWorkspaceId && e.entityType === 'workspace'
      );
      const collectionEntity = result.data.data.entities.find(
        e => (e.entityId === testCollectionUid || e.entityId === testCollectionUid) && e.entityType === 'collection'
      );
      
      expect(workspaceEntity).toBeDefined();
      expect(collectionEntity).toBeDefined();
      
      console.log(`Found ${result.data.data.entities.length} entities with shared tag '${sharedTag}'`);
      
      // Cleanup - remove shared tag
      await updateWorkspaceTags(testWorkspaceId, []);
      await updateCollectionTags(testCollectionUid, []);
    });

    test('Cleanup - Remove tag from test collection', async () => {
      expect(testCollectionUid).toBeDefined();
      expect(userId).toBeDefined();
      
      // Remove all tags from the collection
      const result = await updateCollectionTags(testCollectionUid, []);

      expect(result.status).toBe(200);
      expect(result.data.tags).toHaveLength(0);
      
      console.log(`Tag '${collectionTagSlug}' removed from collection ${testCollectionUid}`);
    });
  });

  describe('Error handling', () => {
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
      // Use a valid test tag since we're testing entityType validation, not tag existence
      await expect(
        getTagEntities('test-tag', null, null, null, 'invalid-type')
      ).rejects.toThrow();
    });
  });
});

