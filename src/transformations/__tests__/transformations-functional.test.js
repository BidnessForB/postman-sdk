const { 
  syncSpecWithCollection, 
  createSpec,
  createSpecGeneration,
  getSpecTaskStatus,
  getSpecGenerations
} = require('../../specs/spec');
const { 
  syncCollectionWithSpec, 
  createCollection,
  createCollectionGeneration,
  getCollectionTaskStatus,
  getCollectionGenerations
} = require('../../collections/collection');
const { 
  loadTestIds, 
  saveTestIds, 
  retryWithBackoff, 
  pollUntilComplete ,
  initPersistedIds,
  getUserId
} = require('../../__tests__/test-helpers');



describe('transformations functional tests', () => {
  
  let persistedIds = {};
  let userId;
  


  beforeAll(async () => {
    
    persistedIds = loadTestIds();
    userId = await getUserId();
    // Load persisted test IDs
    
    console.log('Loaded persisted test IDs for transformations tests');
  });

  test('CreateSourceCollection - should create a new collection for transformations', async () => {
    await initPersistedIds(['transformations.sourceCollection']);
    const workspaceId = persistedIds.workspace?.id;

    

    const timestamp = Date.now();
    const collectionName = `Transformations Test Collection ${timestamp}`;
    const collectionData = {
      info: {
        name: collectionName,
        description: 'A collection created for transformations testing',
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
      },
      item: [
        {
          name: 'Sample Request',
          request: {
            method: 'GET',
            header: [],
            url: {
              raw: 'https://api.example.com/data',
              protocol: 'https',
              host: ['api', 'example', 'com'],
              path: ['data']
            }
          }
        }
      ]
    };

    const result = await createCollection(collectionData, workspaceId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('collection');
    expect(result.data.collection).toHaveProperty('id');
    expect(result.data.collection.name).toBe(collectionName);

    // Initialize transformations object if it doesn't exist
    if (!persistedIds.transformations) {
      persistedIds.transformations = {};
    }

    persistedIds.transformations.sourceCollection = {
      id: result.data.collection.id,
      uid: result.data.collection.uid,
      name: result.data.collection.name,
      workspaceId: workspaceId,
      createdAt: new Date().toISOString()
    };
    saveTestIds(persistedIds);

    console.log(`Created source collection for transformations: ${result.data.collection.name}`);
    console.log(`Collection ID: ${result.data.collection.id}`);
  });

  test('CreateSourceSpec - should create a new spec for transformations', async () => {
    const workspaceId = persistedIds.workspace?.id;
    await initPersistedIds(['transformations.sourceSpec']);
    

    const timestamp = Date.now();
    const specName = `Transformations Test Spec ${timestamp}`;
    const specDefinition = {
      openapi: '3.0.0',
      info: {
        title: specName,
        version: '1.0.0',
        description: 'A spec created for transformations testing'
      },
      paths: {
        '/data': {
          get: {
            summary: 'Get data',
            responses: {
              '200': {
                description: 'Successful response',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        status: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };

    const files = [
      {
        path: 'index.yaml',
        content: JSON.stringify(specDefinition, null, 2)
      }
    ];

    const result = await createSpec(workspaceId, specName, 'OPENAPI:3.0', files);

    expect(result.status).toBe(201);
    expect(result.data).toHaveProperty('id');
    expect(result.data.name).toBe(specName);
    expect(result.data.type).toBe('OPENAPI:3.0');

    // Initialize transformations object if it doesn't exist
    if (!persistedIds.transformations) {
      persistedIds.transformations = {};
    }

    persistedIds.transformations.sourceSpec = {
      id: result.data.id,
      name: result.data.name,
      workspaceId: workspaceId,
      type: result.data.type,
      createdAt: new Date().toISOString()
    };
    saveTestIds(persistedIds);

    console.log(`Created source spec for transformations: ${result.data.name}`);
    console.log(`Spec ID: ${result.data.id}`);
  });

  describe('spec-to-collection', () => {
    test('1. createSpecGeneration - should generate a collection from spec', async () => {
      const specId = persistedIds?.transformations?.sourceSpec?.id;

      

      expect(specId).toBeDefined();

      const collectionName = `Generated Collection ${Date.now()}`;
      const options = {
        requestNameSource: 'Fallback',
        folderStrategy: 'Paths',
        includeAuthInfoInExample: true
      };

      // Retry the creation in case of transient failures
      const result = await retryWithBackoff(
        async () => await createSpecGeneration(specId, 'collection', collectionName, options),
        {
          maxAttempts: 3,
          initialDelay: 2000,
          shouldRetry: (error) => {
            // Retry on 500s and 429 (rate limiting), but not on 400s (bad request)
            const status = error?.response?.status;
            return status >= 500 || status === 429;
          },
          onRetry: (attempt, max, delay, error) => {
            console.log(`Collection generation failed (attempt ${attempt}/${max})`);
            console.log(`Error: ${error.message}`);
            console.log(`Retrying in ${delay}ms...`);
          }
        }
      );

      expect(result.status).toBe(202);
      expect(result.data).toHaveProperty('taskId');
      expect(result.data).toHaveProperty('url');
      expect(typeof result.data.taskId).toBe('string');
      expect(typeof result.data.url).toBe('string');
      expect(result.data.url).toContain(`/specs/${specId}/tasks/`);
      
      // Persist the generated collection info under transformations.sourceSpec
      if (!persistedIds.transformations.sourceSpec.generatedCollection) {
        persistedIds.transformations.sourceSpec.generatedCollection = {};
      }
      persistedIds.transformations.sourceSpec.generatedCollection = {
        name: collectionName,
        taskId: result.data.taskId,
        url: result.data.url,
        createdAt: new Date().toISOString()
      };
      saveTestIds(persistedIds);
      
      console.log(`Collection generation started with taskId: ${result.data.taskId}`);
      console.log(`Poll status at: ${result.data.url}`);
      console.log(`Generated collection info saved to transformations.sourceSpec.generatedCollection`);
    });

    test('2. createSpecGeneration - should fail with minimal params (no options)', async () => {
      const specId = persistedIds?.transformations?.sourceSpec?.id;

      

      // Test with no optional parameters (just spec ID and element type)
      await expect(
        createSpecGeneration(specId, 'collection')
      ).rejects.toThrow();
    });

    test('3. getSpecTaskStatus - should get status of generation task', async () => {
      const specId = persistedIds?.transformations?.sourceSpec?.id;
      const taskId = persistedIds?.transformations?.sourceSpec?.generatedCollection?.taskId;
      
      

      expect(specId).toBeDefined();
      expect(taskId).toBeDefined();

      console.log(`Using persisted taskId from test 1: ${taskId}`);
      
      // Now poll the task status
      const statusResult = await getSpecTaskStatus(specId, taskId);
      expect(statusResult.status).toBe(200);
      expect(statusResult.data).toHaveProperty('status');
      expect(statusResult.data.status).toMatch(/pending|completed|failed/);
      
      if (statusResult.data.meta) {
        expect(statusResult.data.meta).toHaveProperty('model');
        expect(statusResult.data.meta).toHaveProperty('action');
      }
      
      // If task is completed and has a collection ID, persist it
      if (statusResult.data.status === 'completed' && statusResult.data.meta && statusResult.data.meta.collection) {
        persistedIds.transformations.sourceSpec.generatedCollection = {
          ...persistedIds.transformations.sourceSpec.generatedCollection,
          id: statusResult.data.meta.collection.id,
          uid: statusResult.data.meta.collection.uid
        };
        saveTestIds(persistedIds);
        console.log(`Generated collection ID persisted: ${statusResult.data.meta.collection.id}`);
      }
      
      console.log(`Task status: ${statusResult.data.status}`);
    });

    test('4. getSpecTaskStatus - Poll until complete', async () => {
      const specId = persistedIds?.transformations?.sourceSpec?.id;
      const taskId = persistedIds?.transformations?.sourceSpec?.generatedCollection?.taskId;
      
      

      expect(specId).toBeDefined();
      expect(taskId).toBeDefined();

      console.log(`Polling task ${taskId} until completion...`);
      
      // Use the polling helper with retry logic
      const result = await pollUntilComplete(
        async () => await getSpecTaskStatus(specId, taskId),
        {
          pollInterval: 5000,
          timeout: 60000, // Increased to 60 seconds
          taskName: 'Spec Generation',
          maxRetries: 3 // Retry each status check up to 3 times
        }
      );
      
      // Verify completion
      expect(result.status).toBe(200);
      expect(result.data.meta).toBeDefined();
      expect(result.data.meta.model).toBe('collection');
      expect(result.data.meta.action).toBe('generation');
      
      // Get and persist the generated collection ID
      const generatedCollectionId = result.data.details.resources[0].id;
      persistedIds.transformations.sourceSpec.generatedCollection = {
        ...persistedIds.transformations.sourceSpec.generatedCollection,
        id: generatedCollectionId
      };
      saveTestIds(persistedIds);
      
      console.log(`Generated collection ID: ${generatedCollectionId}`);
      console.log(`Persisted to transformations.sourceSpec.generatedCollection.id`);
    }, 70000); // Set Jest timeout to 70s (higher than our 60s polling timeout)

    test('5. getSpecGenerations - should retrieve generated collections list', async () => {
      const specId = persistedIds?.transformations?.sourceSpec?.id;

      

      expect(specId).toBeDefined();

      const elementType = 'collection';
      
      // Now retrieve the list of generations
      const result = await getSpecGenerations(specId, elementType);
      
      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('collections');
      expect(result.data).toHaveProperty('meta');
      expect(Array.isArray(result.data.collections)).toBe(true);
      
      // If there are collections, verify their structure
      if (result.data.collections.length > 0) {
        const collection = result.data.collections[0];
        expect(collection).toHaveProperty('id');
        expect(collection).toHaveProperty('name');
        expect(collection).toHaveProperty('state');
        expect(collection).toHaveProperty('createdAt');
        expect(collection).toHaveProperty('updatedAt');
        expect(collection).toHaveProperty('createdBy');
        
        console.log(`Found ${result.data.collections.length} generated collection(s)`);
        console.log(`First collection: ${collection.name} (${collection.state})`);
      } else {
        console.log('No generated collections found yet (generation may still be pending)');
      }
      
      // Verify meta has pagination info
      expect(result.data.meta).toHaveProperty('nextCursor');
    });

    test('6. getSpecGenerations - should support pagination with limit', async () => {
      const specId = persistedIds?.transformations?.sourceSpec?.id;

      

      expect(specId).toBeDefined();

      const elementType = 'collection';
      const limit = 5;
      
      const result = await getSpecGenerations(specId, elementType, limit);
      
      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('collections');
      expect(result.data).toHaveProperty('meta');
      
      // Verify we don't get more than the limit
      expect(result.data.collections.length).toBeLessThanOrEqual(limit);
      
      console.log(`Retrieved ${result.data.collections.length} collection(s) with limit=${limit}`);
    });

    describe('syncCollectionWithSpec', () => {
    test('7. should sync generated collection with source spec', async () => {
      const srcSpecId = persistedIds?.transformations?.sourceSpec?.id;
      const genCollectionid = persistedIds?.transformations?.sourceSpec?.generatedCollection?.id;
      const userId = getUserId();

      

      expect(srcSpecId).toBeDefined();
      expect(genCollectionid).toBeDefined();
      expect(userId).toBeDefined();

      console.log(`Attempting to sync collection ${genCollectionid} with spec ${srcSpecId}`);

      let result;
      
       try {
        result = await syncCollectionWithSpec(genCollectionid, srcSpecId);  
      } catch (err) {
        // Handle known error responses
        if(err?.response?.data?.status === 400 && err?.response?.data?.detail === 'Collection is already in sync') {
          console.log('Received 400, already in sync, OK');
          return;
        }
        console.log(err);
        fail('syncCollectionWithSpec threw unexpected error: ' + (err && err.message ? err.message : JSON.stringify(err)));
      } 

      // If we got here, the sync was successful
      expect([202, 400, 403, 404]).toContain(result.status);
      
      if (result.status === 202) {
        expect(result.data).toHaveProperty('taskId');
        expect(result.data).toHaveProperty('url');
        expect(typeof result.data.taskId).toBe('string');
        expect(typeof result.data.url).toBe('string');

        // Persist the sync task info
        if (!persistedIds.collection.syncCollectionTask) {
          persistedIds.collection.syncCollectionTask = {};
        }
        persistedIds.collection.syncCollectionTask = {
          taskId: result.data.taskId,
          url: result.data.url,
          createdAt: new Date().toISOString()
        };
        saveTestIds(persistedIds);

        console.log(`✓ Collection sync started with taskId: ${result.data.taskId}`);
        console.log(`  Poll status at: ${result.data.url}`);
      }
    });

    test('8. should handle error for non-existent collection', async () => {
      const genSpecId = persistedIds?.collection?.generatedSpec?.id;
      const fakeCollectionId = '00000000-0000-0000-0000-000000000000';
      const userId = getUserId();

      

      await expect(
        syncCollectionWithSpec(fakeCollectionId, genSpecId)
      ).rejects.toThrow();
    });

    test('9. should handle error for non-existent spec', async () => {
      const fakeSpecId = '00000000-0000-0000-0000-000000000000';
      const srcCollectionId = persistedIds?.collection?.id;
      const userId = getUserId();

      

      await expect(
        syncCollectionWithSpec(srcCollectionId, fakeSpecId)
      ).rejects.toThrow();
    });
    });
  });

  describe('collection-to-spec', () => {
    test('1. createCollectionGeneration - should generate spec from collection', async () => {
      
      const collectionUid = persistedIds?.transformations?.sourceCollection?.uid;
      const userId = getUserId();

      

      
      expect(collectionUid).toBeDefined();

      const elementType = 'spec';
      const name = `Generated Spec from Collection ${Date.now()}`;
      const type = 'OPENAPI:3.0';
      const format = 'JSON';
      
      try {
        // Retry the creation in case of transient failures
        const result = await retryWithBackoff(
          async () => await createCollectionGeneration(collectionUid, elementType, name, type, format),
          {
            maxAttempts: 3,
            initialDelay: 2000,
            shouldRetry: (error) => {
              // Retry on 500s and 429 (rate limiting), but not on 400s (bad request)
              const status = error?.response?.status;
              return status >= 500 || status === 429;
            },
            onRetry: (attempt, max, delay, error) => {
              console.log(`Spec generation failed (attempt ${attempt}/${max})`);
              console.log(`Error: ${error.message}`);
              console.log(`Retrying in ${delay}ms...`);
            }
          }
        );

        expect(result.status).toBe(202);
        expect(result.data).toHaveProperty('taskId');
        expect(result.data).toHaveProperty('url');
        expect(typeof result.data.taskId).toBe('string');
        expect(typeof result.data.url).toBe('string');

        // Persist the generated spec info under transformations.sourceCollection
        if (!persistedIds.transformations.sourceCollection.generatedSpec) {
          persistedIds.transformations.sourceCollection.generatedSpec = {};
        }
        persistedIds.transformations.sourceCollection.generatedSpec = {
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
        console.log(`Generated spec info saved to transformations.sourceCollection.generatedSpec`);
      } catch (error) {
        // Handle 404 or 403 errors gracefully - collection might not support spec generation
        
        console.log(error);
      fail('Unexpected error: ' + (error && error.message ? error.message : JSON.stringify(error)));
        
      }
    });

    test('2. getCollectionTaskStatus - should get status of generation task', async () => {
      const collectionUid = persistedIds?.transformations?.sourceCollection?.uid;
      const taskId = persistedIds?.transformations?.sourceCollection?.generatedSpec?.taskId;
      const userId = getUserId();

      

      

      expect(collectionUid).toBeDefined();
      expect(taskId).toBeDefined();
      expect(userId).toBeDefined();

      try {
        const result = await getCollectionTaskStatus(collectionUid, taskId);

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
        console.log(error);
        fail('Unexpected error: ' + (error && error.message ? error.message : JSON.stringify(error)));
      }
    });

    test('3. getCollectionTaskStatus - Poll until complete', async () => {
      const collectionUid = persistedIds?.transformations?.sourceCollection?.uid;
      const taskId = persistedIds?.transformations?.sourceCollection?.generatedSpec?.taskId;
      const userId = getUserId();

      

      

      expect(collectionUid).toBeDefined();
      expect(taskId).toBeDefined();
      expect(userId).toBeDefined();

      console.log(`Polling task ${taskId} until completion...`);

      try {
        // Use the polling helper with retry logic
        const result = await pollUntilComplete(
          async () => await getCollectionTaskStatus(collectionUid, taskId),
          {
            pollInterval: 5000,
            timeout: 60000, // Increased to 60 seconds
            taskName: 'Collection Generation',
            maxRetries: 3 // Retry each status check up to 3 times
          }
        );

        // Verify completion
        expect(result.status).toBe(200);
        expect(result.data.meta).toBeDefined();
        expect(result.data.meta.model).toBe('spec');
        expect(result.data.meta.action).toBe('generation');

        // Extract and persist the generated spec ID
        const generatedSpecId = result.data.details.resources[0].id;
        persistedIds.transformations.sourceCollection.generatedSpec = {
          ...persistedIds.transformations.sourceCollection.generatedSpec,
          id: generatedSpecId
        };
        saveTestIds(persistedIds);

        console.log(`Generated spec ID: ${generatedSpecId}`);
        console.log(`Persisted to transformations.sourceCollection.generatedSpec.id`);
      } catch (error) {
        // Handle 404 errors gracefully - endpoint might not be available
        console.log(error);
        fail('Unexpected error: ' + (error && error.message ? error.message : JSON.stringify(error)));
      }
    }, 70000); // Set Jest timeout to 70s (higher than our 60s polling timeout)

    test('4. getCollectionGenerations - should retrieve generated specs list', async () => {
      const collectionUid = persistedIds?.transformations?.sourceCollection?.uid;
      const userId = getUserId();

      


      expect(collectionUid).toBeDefined();
      expect(userId).toBeDefined();

      const elementType = 'spec';

      try {
        const result = await getCollectionGenerations(collectionUid, elementType);

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
          if (!persistedIds.transformations.sourceCollection.generatedSpec || !persistedIds.transformations.sourceCollection.generatedSpec.id) {
            if (!persistedIds.transformations.sourceCollection.generatedSpec) {
              persistedIds.transformations.sourceCollection.generatedSpec = {};
            }
            persistedIds.transformations.sourceCollection.generatedSpec.id = spec.id;
            persistedIds.transformations.sourceCollection.generatedSpec.name = spec.name;
            persistedIds.transformations.sourceCollection.generatedSpec.state = spec.state;
            saveTestIds(persistedIds);
            console.log(`Persisted generated spec ID: ${spec.id} to transformations.sourceCollection.generatedSpec`);
          }
        } else {
          console.log('No generated specs found yet (generation may still be pending)');
        }
      } catch (error) {
        // Handle 403 or 404 errors gracefully
        console.log(error);
        fail('Unexpected error: ' + (error && error.message ? error.message : JSON.stringify(error)));
      }
    });

    describe('syncSpecWithCollection', () => {
    test('5. should sync generated spec with source collection', async () => {
      const genSpecId = persistedIds?.transformations?.sourceCollection?.generatedSpec?.id;
      const srcCollectionUid = persistedIds?.transformations?.sourceCollection?.uid;
      const userId = getUserId();

      

      expect(genSpecId).toBeDefined();
      expect(srcCollectionUid).toBeDefined();
      expect(userId).toBeDefined();

      // Build the collection UID (userId-collectionId)
      

      console.log(`Attempting to sync spec ${genSpecId} with collection ${srcCollectionUid}`);

      let result;
      try {
        result = await syncSpecWithCollection(genSpecId, srcCollectionUid);
      } catch (err) {
        // Accept 400/404 responses as known limitations
        if (err.message && (err.message.includes('Request failed with status code 400') || err.message.includes('Request failed with status code 404'))) {
          if (err?.response?.data?.status === 400 && err?.response?.data?.detail === 'Specification is already in sync with the collection') {
            console.log('Received 400, already in sync, OK');
            return;
          }
          } else {
          fail('syncSpecWithCollection threw unexpected error: ' + (err && err.message ? err.message : JSON.stringify(err)));
          }
          
      }

      // If we got here, the sync was successful
      expect([202, 400]).toContain(result.status);
      expect(result.data).toHaveProperty('taskId');
      expect(result.data).toHaveProperty('url');
      expect(typeof result.data.taskId).toBe('string');
      expect(typeof result.data.url).toBe('string');

      // Persist the sync task info
      if (!persistedIds.collection.syncSpecTask) {
        persistedIds.collection.syncSpecTask = {};
      }
      persistedIds.collection.syncSpecTask = {
        taskId: result.data.taskId,
        url: result.data.url,
        createdAt: new Date().toISOString()
      };
      saveTestIds(persistedIds);

      console.log(`✓ Spec sync started with taskId: ${result.data.taskId}`);
      console.log(`  Poll status at: ${result.data.url}`);
    });

    test('6. should handle error for non-existent spec', async () => {
      const fakeSpecId = '00000000-0000-0000-0000-000000000000';
      const srcCollectionUid = persistedIds?.collection?.uid;
      const userId = getUserId();

      

      

      await expect(
        syncSpecWithCollection(fakeSpecId, srcCollectionUid)
      ).rejects.toThrow();
    });
    });
  });
});


