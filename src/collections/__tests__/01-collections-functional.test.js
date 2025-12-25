const { 
  getCollections, 
  createCollection,
  getCollection,
  updateCollection,
  modifyCollection,
  deleteCollection,
  syncCollectionWithSpec
} = require('../index');
const { getAuthenticatedUser } = require('../../users/index');
const { POSTMAN_API_KEY_ENV_VAR } = require('../../core/config');
const { loadTestIds, saveTestIds } = require('../../__tests__/test-helpers');



describe('collections functional tests (sequential flow)', () => {
  let testWorkspaceId;
  let persistedIds = {};
  let userId;

  beforeAll(async () => {
    if (!process.env[POSTMAN_API_KEY_ENV_VAR]) {
      throw new Error(`${POSTMAN_API_KEY_ENV_VAR} environment variable is required for functional tests`);
    }

    persistedIds = loadTestIds();
    testWorkspaceId = persistedIds?.workspace?.id;

    if (persistedIds.workspace && persistedIds.workspace.id) {
      console.log('Using persisted workspace ID:', testWorkspaceId);
    } else {
      console.log('Using default workspace ID:', testWorkspaceId);
    }

    if (persistedIds.collection && persistedIds.collection.id) {
      console.log('Found persisted collection ID:', persistedIds.collection.id);
    }

    // Get userId for UID construction
    if (persistedIds.userId) {
      userId = persistedIds.userId;
      console.log('Using persisted userId:', userId);
    } else {
      const meResult = await getAuthenticatedUser();
      userId = meResult.data.user.id;
      persistedIds.userId = userId;
      saveTestIds(persistedIds);
      console.log('Retrieved and persisted userId:', userId);
    }
  });

  afterAll(async () => {
    
  }); 

  test('1. createCollection - should create a collection in workspace', async () => {
    

    const collectionName = `SDK Test Collection ${Date.now()}`;
    const collectionData = {
      info: {
        name: collectionName,
        description: 'Test collection created by SDK functional tests',
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

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('collection');
    expect(result.data.collection).toHaveProperty('id');
    expect(result.data.collection).toHaveProperty('name');
    expect(result.data.collection.name).toBe(collectionName);

    persistedIds.collection = {
      ...persistedIds.collection,
      id: result.data.collection.id,
      name: collectionName,
      createdAt: new Date().toISOString()
    };
    saveTestIds(persistedIds);
    console.log(`Created and persisted collection ID: ${persistedIds.collection.id}`);
  }, 10000);

  test('2. getCollections - should retrieve collections from workspace', async () => {
    const result = await getCollections(testWorkspaceId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('collections');
    expect(Array.isArray(result.data.collections)).toBe(true);
    
    // If we have a test collection, verify it's in the list
    if (persistedIds.collection && persistedIds.collection.id) {
      const collectionId = persistedIds.collection.id;
      const foundCollection = result.data.collections.find(col => col.id === collectionId);
      expect(foundCollection).toBeDefined();
      expect(foundCollection.name).toBe(persistedIds.collection.name);
    }
  }, 10000);

  test('3. getCollections - should retrieve collections without workspace filter', async () => {
    const result = await getCollections();

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('collections');
    expect(Array.isArray(result.data.collections)).toBe(true);
  }, 10000);

  test('4. getCollections - should filter collections by name', async () => {
    

    const collectionName = persistedIds.collection.name;
    const result = await getCollections(testWorkspaceId, collectionName);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('collections');
    expect(Array.isArray(result.data.collections)).toBe(true);
    
    if (result.data.collections.length > 0) {
      result.data.collections.forEach(col => {
        expect(col.name).toContain(collectionName);
      });
    }
  }, 10000);

  test('5. getCollections - should support pagination with limit and offset', async () => {
    const result = await getCollections(testWorkspaceId, null, 5, 0);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('collections');
    expect(Array.isArray(result.data.collections)).toBe(true);
    expect(result.data.collections.length).toBeLessThanOrEqual(5);
  }, 10000);

  test('6. getCollection - should retrieve collection by ID', async () => {
    const collectionId = persistedIds.collection.id;
    expect(collectionId).toBeDefined();

    const result = await getCollection(collectionId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('collection');
    expect(result.data.collection).toHaveProperty('info');
    expect(result.data.collection.info._postman_id).toBe(collectionId);
    expect(result.data.collection.info.name).toBe(persistedIds.collection.name);
  });

  test('7. modifyCollection - should update collection name', async () => {
    const collectionId = persistedIds.collection.id;
    expect(collectionId).toBeDefined();

    const updatedName = `${persistedIds.collection.name} - Updated`;
    const partialData = {
      info: {
        name: updatedName
      }
    };

    const result = await modifyCollection(collectionId, partialData);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('collection');
    // PATCH response returns minimal data, just verify success
    
    // Update persisted name
    persistedIds.collection = {
      ...persistedIds.collection,
      name: updatedName
    };
    saveTestIds(persistedIds);
  });

  test('8. getCollection - should verify name update', async () => {
    const collectionId = persistedIds.collection.id;
    expect(collectionId).toBeDefined();

    const result = await getCollection(collectionId);

    expect(result.status).toBe(200);
    expect(result.data.collection.info.name).toBe(persistedIds.collection.name);
  });

  test('9. updateCollection - should replace collection data', async () => {
    const collectionId = persistedIds.collection.id;
    expect(collectionId).toBeDefined();

    // First get the current collection to preserve its structure
    const currentResult = await getCollection(collectionId);
    const currentCollection = currentResult.data.collection;

    // Update the collection with new data
    const updatedCollection = {
      info: {
        name: currentCollection.info.name,
        description: 'Updated description via PUT',
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
      },
      item: [
        {
          name: 'Updated Request',
          request: {
            method: 'POST',
            url: 'https://postman-echo.com/post',
            description: 'Updated POST request'
          }
        }
      ]
    };

    const result = await updateCollection(collectionId, updatedCollection);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('collection');
    // PUT response returns minimal data, just verify success
  });

  

  

  test('11. deleteCollection - should delete a collection', async () => {
    // Create a temporary collection specifically for deletion testing
    const tempCollectionData = {
      info: {
        name: `Temp Collection for Deletion ${Date.now()}`,
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
      },
      item: []
    };

    const workspaceId = persistedIds.workspace?.id;
    expect(workspaceId).toBeDefined();

    // Create the temporary collection
    const createResult = await createCollection(tempCollectionData, workspaceId);
    expect(createResult.status).toBe(200);
    expect(createResult.data).toHaveProperty('collection');
    const tempCollectionId = createResult.data.collection.id;
    expect(tempCollectionId).toBeDefined();

    console.log(`Created temporary collection ${tempCollectionId} for deletion testing`);

    // Delete the collection
    const deleteResult = await deleteCollection(tempCollectionId);
    expect(deleteResult.status).toBe(200);
    expect(deleteResult.data).toHaveProperty('collection');
    expect(deleteResult.data.collection.id).toBe(tempCollectionId);

    console.log(`Successfully deleted collection ${tempCollectionId}`);

    // Verify the collection is deleted by attempting to get it (should fail)
    await expect(getCollection(tempCollectionId)).rejects.toThrow();
    console.log('Verified collection no longer exists');
  });

  describe('error handling', () => {
    test('should handle invalid workspace ID gracefully', async () => {
      const fakeWorkspaceId = '00000000-0000-0000-0000-000000000000';
      
      // Per spec: invalid workspace ID returns HTTP 200 with empty array
      const result = await getCollections(fakeWorkspaceId);
      
      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('collections');
      expect(result.data.collections).toEqual([]);
    }, 10000);

    test('should handle createCollection with invalid data', async () => {
      const workspaceId = persistedIds?.workspace?.id;
      const invalidData = {
        // Missing required 'info' property
      };

      await expect(createCollection(invalidData, workspaceId)).rejects.toThrow();
    });

    test('should handle getting non-existent collection', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await expect(getCollection(fakeId)).rejects.toThrow();
    });

    test('should handle updating non-existent collection', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const collectionData = {
        info: {
          name: 'Test',
          schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
        }
      };
      await expect(updateCollection(fakeId, collectionData)).rejects.toThrow();
    });

    test('should handle modifying non-existent collection', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const partialData = {
        info: {
          name: 'Test'
        }
      };
      await expect(modifyCollection(fakeId, partialData)).rejects.toThrow();
    });

    test('syncCollectionWithSpec - should throw error for non-existent collection', async () => {
      const fakeCollectionId = '00000000-0000-0000-0000-000000000000';
      const specId = persistedIds.spec && persistedIds.spec.id;

      

      await expect(syncCollectionWithSpec(userId, fakeCollectionId, specId)).rejects.toThrow();
    });

    test('syncCollectionWithSpec - should throw error for non-existent spec', async () => {
      const collectionId = persistedIds.collection && persistedIds.collection.id;
      const fakeSpecId = '00000000-0000-0000-0000-000000000000';

      

      await expect(syncCollectionWithSpec(userId, collectionId, fakeSpecId)).rejects.toThrow();
    });

  });
});

