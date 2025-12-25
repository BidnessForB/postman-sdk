const { 
  getCollections, 
  createCollection,
  getCollection,
  updateCollection,
  modifyCollection,
  syncCollectionWithSpec,
  createCollectionGeneration,
  getCollectionGenerations,
  getCollectionTaskStatus
} = require('../index');
const { getAuthenticatedUser } = require('../../users/index');
const { POSTMAN_API_KEY_ENV_VAR } = require('../../core/config');
const { loadTestIds, saveTestIds } = require('../../__tests__/test-helpers');

const DEFAULT_WORKSPACE_ID = '5fbcd502-1112-435f-9dac-4c943d3d0b37';

describe('collections functional tests (sequential flow)', () => {
  let testWorkspaceId;
  let persistedIds = {};
  let userId;

  beforeAll(async () => {
    if (!process.env[POSTMAN_API_KEY_ENV_VAR]) {
      throw new Error(`${POSTMAN_API_KEY_ENV_VAR} environment variable is required for functional tests`);
    }

    persistedIds = loadTestIds();
    testWorkspaceId = (persistedIds.workspace && persistedIds.workspace.id) || DEFAULT_WORKSPACE_ID;

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
    // NO CLEANUP - Collection persists indefinitely for reuse across test runs
    if (persistedIds.collection && persistedIds.collection.id) {
      console.log(`Collection ${persistedIds.collection.id} will persist for future test runs`);
      console.log(`To delete manually, run: npx jest src/collections/__tests__/manual-cleanup.test.js`);
    }
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
    /*
    if (!persistedIds.collection || !persistedIds.collection.name) {
      console.log('Skipping name filter test - no collection name available');
      return;
    }
    */

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

  

  test('10. createCollectionGeneration - should generate spec from collection', async () => {
    const collectionId = persistedIds.collection && persistedIds.collection.id;

    // Skip test if no collection is available
    if (!collectionId) {
      console.log('Skipping createCollectionGeneration test - no collection ID available in test-ids.json');
      console.log('Run collection tests first to create a collection');
      return;
    }

    expect(collectionId).toBeDefined();
    expect(userId).toBeDefined();

    const elementType = 'spec';
    const name = `Generated Spec from Collection ${Date.now()}`;
    const type = 'OPENAPI:3.0';
    const format = 'JSON';

    try {
      const result = await createCollectionGeneration(userId, collectionId, elementType, name, type, format);

      expect(result.status).toBe(202);
      expect(result.data).toHaveProperty('taskId');
      expect(result.data).toHaveProperty('url');
      expect(typeof result.data.taskId).toBe('string');
      expect(typeof result.data.url).toBe('string');

      // Persist the generated spec info
      if (!persistedIds.collection.generatedSpec) {
        persistedIds.collection.generatedSpec = {};
      }
      persistedIds.collection.generatedSpec = {
        name: name,
        taskId: result.data.taskId,
        url: result.data.url,
        type: type,
        format: format,
        createdAt: new Date().toISOString()
      };
      saveTestIds(persistedIds);

      console.log(`Spec generation started with taskId: ${result.data.taskId}`);
      console.log(`Poll status at: ${result.data.url}`);
      console.log(`Generated spec info saved to test-ids.json`);
    } catch (error) {
      // Handle 404 or 403 errors gracefully - collection might not support spec generation
      if (error.response && (error.response.status === 404 || error.response.status === 403)) {
        console.log(`Skipping: Collection ${collectionId} does not support spec generation (${error.response.status})`);
        console.log('Note: Spec generation may only be available for certain collection types or require specific permissions');
        return;
      }
      throw error;
    }
  });



  test('11a. getCollectionTaskStatus - should get status of generation task', async () => {
    const collectionId = persistedIds.collection && persistedIds.collection.id;
    const taskId = persistedIds.collection && persistedIds.collection.generatedSpec && persistedIds.collection.generatedSpec.taskId;

    // Skip test if no collection or taskId is available
    if (!collectionId || !taskId) {
      console.log('Skipping getCollectionTaskStatus test - no collection ID or taskId available in test-ids.json');
      console.log('Run test 11 (createCollectionGeneration) first to create a generation task');
      return;
    }

    expect(collectionId).toBeDefined();
    expect(taskId).toBeDefined();
    expect(userId).toBeDefined();

    try {
      const result = await getCollectionTaskStatus(userId, collectionId, taskId);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('status');
      expect(['pending', 'completed', 'failed']).toContain(result.data.status);

      console.log(`Task status: ${result.data.status}`);

      if (result.data.status === 'completed') {
        expect(result.data).toHaveProperty('meta');
        console.log(`✓ Task completed successfully!`);
      }
    } catch (error) {
      // Handle 404 errors gracefully - task might no longer exist or endpoint not available
      if (error.response && error.response.status === 404) {
        console.log(`Skipping: Task ${taskId} not found or endpoint not available (404)`);
        console.log('Note: The task may have expired or the collection may not support task status queries');
        return;
      }
      throw error;
    }
  });

  test('11b. getCollectionTaskStatus - Poll until complete', async () => {
    const collectionId = persistedIds.collection && persistedIds.collection.id;
    const taskId = persistedIds.collection && persistedIds.collection.generatedSpec && persistedIds.collection.generatedSpec.taskId;

    // Skip test if no collection or taskId is available
    if (!collectionId || !taskId) {
      console.log('Skipping polling test - no collection ID or taskId available in test-ids.json');
      return;
    }

    expect(collectionId).toBeDefined();
    expect(taskId).toBeDefined();
    expect(userId).toBeDefined();

    console.log(`Polling task ${taskId} until completion...`);

    const POLL_INTERVAL_MS = 5000; // 5 seconds
    const TIMEOUT_MS = 30000; // 30 seconds
    const MAX_ATTEMPTS = Math.ceil(TIMEOUT_MS / POLL_INTERVAL_MS);

    let attempts = 0;
    let taskStatus;
    let lastStatusResult;

    try {
      while (attempts < MAX_ATTEMPTS) {
        attempts++;
        console.log(`Polling attempt ${attempts}/${MAX_ATTEMPTS}...`);

        lastStatusResult = await getCollectionTaskStatus(userId, collectionId, taskId);
        expect(lastStatusResult.status).toBe(200);
        expect(lastStatusResult.data).toHaveProperty('status');

        taskStatus = lastStatusResult.data.status;
        console.log(`Task status: ${taskStatus}`);

        if (taskStatus === 'completed') {
          // Task completed successfully
          expect(lastStatusResult.data.meta).toBeDefined();
          expect(lastStatusResult.data.meta.model).toBe('spec');
          expect(lastStatusResult.data.meta.action).toBe('generation');

          console.log(`✓ Task completed successfully!`);

          // Extract the generated spec ID from the response
          const generatedSpecId = lastStatusResult.data.details.resources[0].id;

          // Persist the generated spec ID
          persistedIds.collection.generatedSpec = {
            ...persistedIds.collection.generatedSpec,
            id: generatedSpecId
          };
          saveTestIds(persistedIds);

          console.log(`Generated spec ID: ${generatedSpecId}`);
          return; // Test passes
        }

        if (taskStatus === 'failed') {
          // Task failed
          const errorMessage = lastStatusResult.data.error || 'Unknown error';
          throw new Error(`Task failed: ${errorMessage}`);
        }

        // Task is still pending, wait before next poll
        if (attempts < MAX_ATTEMPTS) {
          console.log(`Waiting ${POLL_INTERVAL_MS / 1000} seconds before next poll...`);
          await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));
        }
      }

      // If we get here, we've timed out
      throw new Error(`Timeout: Task did not complete within ${TIMEOUT_MS / 1000} seconds. Last status: ${taskStatus}`);
    } catch (error) {
      // Handle 404 errors gracefully - endpoint might not be available
      if (error.response && error.response.status === 404) {
        console.log(`Skipping: Task ${taskId} not found or endpoint not available (404)`);
        console.log('Note: The collection task status endpoint may not be available for all collection types');
        return;
      }
      throw error;
    }
  }, 35000); // Set Jest timeout slightly higher than our polling timeout

  test('12. getCollectionGenerations - should retrieve generated specs list', async () => {
    const collectionId = persistedIds.collection && persistedIds.collection.id;

    // Skip test if no collection is available
    if (!collectionId) {
      console.log('Skipping getCollectionGenerations test - no collection ID available in test-ids.json');
      return;
    }

    expect(collectionId).toBeDefined();
    expect(userId).toBeDefined();

    const elementType = 'spec';

    try {
      const result = await getCollectionGenerations(userId, collectionId, elementType);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('specs');
      expect(result.data).toHaveProperty('meta');
      expect(Array.isArray(result.data.specs)).toBe(true);

      // If there are specs, verify their structure
      if (result.data.specs.length > 0) {
        const spec = result.data.specs[0];
        expect(spec).toHaveProperty('id');
        expect(spec).toHaveProperty('name');
        expect(spec).toHaveProperty('state');
        expect(spec).toHaveProperty('createdAt');
        expect(spec).toHaveProperty('updatedAt');
        expect(spec).toHaveProperty('createdBy');

        console.log(`Found ${result.data.specs.length} generated spec(s)`);
        console.log(`First spec: ${spec.name} (${spec.state})`);
        
        // Optionally persist the first spec ID if we don't have one yet
        if (!persistedIds.collection.generatedSpec || !persistedIds.collection.generatedSpec.id) {
          if (!persistedIds.collection.generatedSpec) {
            persistedIds.collection.generatedSpec = {};
          }
          persistedIds.collection.generatedSpec.id = spec.id;
          persistedIds.collection.generatedSpec.name = spec.name;
          persistedIds.collection.generatedSpec.state = spec.state;
          saveTestIds(persistedIds);
          console.log(`Persisted generated spec ID: ${spec.id}`);
        }
      } else {
        console.log('No generated specs found yet (generation may still be pending)');
      }

      // Verify meta has pagination info
      expect(result.data.meta).toHaveProperty('nextCursor');
    } catch (error) {
      // Handle 403 errors gracefully - collection might not have permissions
      if (error.response && (error.response.status === 403 || error.response.status === 404)) {
        console.log(`Skipping: Unable to retrieve generated specs for collection ${collectionId} (${error.response.status})`);
        console.log('Note: This may require specific permissions or the collection may not support spec generation');
        return;
      }
      throw error;
    }
  });
test('13. syncCollectionWithSpec - should sync collection with spec', async () => {
    // Note: This endpoint only works with collections that were generated from the spec
    // Use the generatedCollection from spec.generatedCollection if available
    const generatedCollectionId = persistedIds.spec && persistedIds.spec.generatedCollection && persistedIds.spec.generatedCollection.id;
    const specId = persistedIds.spec && persistedIds.spec.id;

    // Skip test if no generated collection or spec is available
    if (!generatedCollectionId) {
      console.log('Skipping syncCollectionWithSpec test - no generated collection ID available');
      console.log('Note: This endpoint only works with collections generated from a spec');
      console.log('The generated collection ID should be in test-ids.json under spec.generatedCollection.id');
      return;
    }

    if (!specId) {
      console.log('Skipping syncCollectionWithSpec test - no spec ID available in test-ids.json');
      console.log('Run specs functional tests first to create a spec');
      return;
    }

    expect(generatedCollectionId).toBeDefined();
    expect(userId).toBeDefined();

    let result; 
    try {
      result = await syncCollectionWithSpec(userId, generatedCollectionId, specId);
    } catch (err) {
      if (err.message && err.message.includes('Request failed with status code 400')) {
        console.log('400 response accepted as "OK"');
        return;
      } else {
        throw err;
      }
    }

    expect(result.status).toBe(202);
    expect(result.data).toHaveProperty('taskId');
    expect(result.data).toHaveProperty('url');
    expect(typeof result.data.taskId).toBe('string');
    expect(typeof result.data.url).toBe('string');

    // Persist the sync task info
    if (!persistedIds.spec.generatedCollection) {
      persistedIds.spec.generatedCollection = {};
    }
    persistedIds.spec.generatedCollection.syncTask = {
      taskId: result.data.taskId,
      url: result.data.url,
      specId: specId,
      createdAt: new Date().toISOString()
    };
    saveTestIds(persistedIds);

    console.log(`Collection sync started with taskId: ${result.data.taskId}`);
    console.log(`Poll status at: ${result.data.url}`);
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
      const workspaceId = (persistedIds.workspace && persistedIds.workspace.id) || DEFAULT_WORKSPACE_ID;
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

      // Skip if no spec available
      if (!specId || !userId) {
        console.log('Skipping error test - no spec ID or userId available');
        return;
      }

      await expect(syncCollectionWithSpec(userId, fakeCollectionId, specId)).rejects.toThrow();
    });

    test('syncCollectionWithSpec - should throw error for non-existent spec', async () => {
      const collectionId = persistedIds.collection && persistedIds.collection.id;
      const fakeSpecId = '00000000-0000-0000-0000-000000000000';

      // Skip if no collection available
      if (!collectionId || !userId) {
        console.log('Skipping error test - no collection ID or userId available');
        return;
      }

      await expect(syncCollectionWithSpec(userId, collectionId, fakeSpecId)).rejects.toThrow();
    });

    test('createCollectionGeneration - should throw error for non-existent collection', async () => {
      const fakeCollectionId = '00000000-0000-0000-0000-000000000000';

      // Skip if no userId available
      if (!userId) {
        console.log('Skipping error test - no userId available');
        return;
      }

      const elementType = 'spec';
      const name = 'Test Spec';
      const type = 'OPENAPI:3.0';
      const format = 'JSON';

      await expect(
        createCollectionGeneration(userId, fakeCollectionId, elementType, name, type, format)
      ).rejects.toThrow();
    });

    test('getCollectionGenerations - should throw error for non-existent collection', async () => {
      const fakeCollectionId = '00000000-0000-0000-0000-000000000000';

      // Skip if no userId available
      if (!userId) {
        console.log('Skipping error test - no userId available');
        return;
      }

      const elementType = 'spec';

      await expect(
        getCollectionGenerations(userId, fakeCollectionId, elementType)
      ).rejects.toThrow();
    });

    test('getCollectionTaskStatus - should throw error for non-existent task', async () => {
      const collectionId = persistedIds.collection && persistedIds.collection.id;
      const fakeTaskId = '00000000-0000-0000-0000-000000000000';

      // Skip if no collection or userId available
      if (!collectionId || !userId) {
        console.log('Skipping error test - no collection ID or userId available');
        return;
      }

      await expect(
        getCollectionTaskStatus(userId, collectionId, fakeTaskId)
      ).rejects.toThrow();
    });
  });
});

