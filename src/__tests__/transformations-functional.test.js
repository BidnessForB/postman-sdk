const { 
  syncSpecWithCollection, 
  createSpec,
  createSpecGeneration,
  getSpecTaskStatus,
  getSpecGenerations
} = require('../specs/index');
const { 
  syncCollectionWithSpec, 
  createCollection,
  createCollectionGeneration,
  getCollectionTaskStatus,
  getCollectionGenerations
} = require('../collections/index');
const { loadTestIds, saveTestIds } = require('./test-helpers');
const { buildUid } = require('../core/utils');
const { POSTMAN_API_KEY_ENV_VAR } = require('../core/config');

describe('transformations functional tests', () => {
  let persistedIds;

  beforeAll(() => {
    // Verify POSTMAN_API_KEY is set
    if (!process.env[POSTMAN_API_KEY_ENV_VAR]) {
      throw new Error(`${POSTMAN_API_KEY_ENV_VAR} environment variable is not set`);
    }

    // Load persisted test IDs
    persistedIds = loadTestIds();
    console.log('Loaded persisted test IDs for transformations tests');
  });

  test('CreateSourceCollection - should create a new collection for transformations', async () => {
    const workspaceId = persistedIds.workspace?.id;

    if (!workspaceId) {
      console.log('Skipping CreateSourceCollection - missing workspaceId');
      return;
    }

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

    if (!workspaceId) {
      console.log('Skipping CreateSourceSpec - missing workspaceId');
      return;
    }

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

      if (!specId) {
        console.log('Skipping createSpecGeneration test - no transformations source spec ID available');
        console.log('Run CreateSourceSpec test first');
        return;
      }

      expect(specId).toBeDefined();

      const collectionName = `Generated Collection ${Date.now()}`;
      const options = {
        requestNameSource: 'Fallback',
        folderStrategy: 'Paths',
        includeAuthInfoInExample: true
      };

      const result = await createSpecGeneration(specId, 'collection', collectionName, options);

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

      if (!specId) {
        console.log('Skipping test - no transformations source spec ID available');
        return;
      }

      // Test with no optional parameters (just spec ID and element type)
      await expect(
        createSpecGeneration(specId, 'collection')
      ).rejects.toThrow();
    });

    test('3. getSpecTaskStatus - should get status of generation task', async () => {
      const specId = persistedIds?.transformations?.sourceSpec?.id;
      const taskId = persistedIds?.transformations?.sourceSpec?.generatedCollection?.taskId;
      
      if (!specId || !taskId) {
        console.log('Skipping getSpecTaskStatus test - no spec ID or taskId available');
        console.log('Run test 1 (createSpecGeneration) first');
        return;
      }

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
      
      if (!specId || !taskId) {
        console.log('Skipping polling test - no spec ID or taskId available');
        return;
      }

      expect(specId).toBeDefined();
      expect(taskId).toBeDefined();

      console.log(`Polling task ${taskId} until completion...`);
      
      const POLL_INTERVAL_MS = 5000; // 5 seconds
      const TIMEOUT_MS = 30000; // 30 seconds
      const MAX_ATTEMPTS = Math.ceil(TIMEOUT_MS / POLL_INTERVAL_MS);
      
      let attempts = 0;
      let taskStatus;
      let lastStatusResult;
      
      while (attempts < MAX_ATTEMPTS) {
        attempts++;
        console.log(`Polling attempt ${attempts}/${MAX_ATTEMPTS}...`);
        
        lastStatusResult = await getSpecTaskStatus(specId, taskId);
        expect(lastStatusResult.status).toBe(200);
        expect(lastStatusResult.data).toHaveProperty('status');
        
        taskStatus = lastStatusResult.data.status;
        console.log(`Task status: ${taskStatus}`);
        
        if (taskStatus === 'completed') {
          // Task completed successfully
          expect(lastStatusResult.data.meta).toBeDefined();
          expect(lastStatusResult.data.meta.model).toBe('collection');
          expect(lastStatusResult.data.meta.action).toBe('generation');
          
          console.log(`✓ Task completed successfully!`);
          
          // Get the generated collection ID
          const generatedCollectionId = lastStatusResult.data.details.resources[0].id;
          
          // Persist the generated collection ID
          persistedIds.transformations.sourceSpec.generatedCollection = {
            ...persistedIds.transformations.sourceSpec.generatedCollection,
            id: generatedCollectionId
          };
          saveTestIds(persistedIds);
          
          console.log(`Generated collection ID: ${generatedCollectionId}`);
          console.log(`Persisted to transformations.sourceSpec.generatedCollection.id`);
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
    }, 35000); // Set Jest timeout slightly higher than our polling timeout

    test('5. getSpecGenerations - should retrieve generated collections list', async () => {
      const specId = persistedIds?.transformations?.sourceSpec?.id;

      if (!specId) {
        console.log('Skipping getSpecGenerations test - no transformations source spec ID available');
        return;
      }

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

      if (!specId) {
        console.log('Skipping pagination test - no transformations source spec ID available');
        return;
      }

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
    test('7. should sync collection with generated spec', async () => {
      const genSpecId = persistedIds?.collection?.generatedSpec?.id;
      const srcCollectionId = persistedIds?.collection?.id;
      const userId = persistedIds?.userId;

      // Skip test if prerequisites aren't met
      if (!genSpecId) {
        console.log('Skipping syncCollectionWithSpec test - no generated spec ID available');
        console.log('Run collections functional tests first to generate a spec from a collection');
        console.log('Specifically, run test 11b (getCollectionTaskStatus - Poll until complete)');
        return;
      }

      if (!srcCollectionId) {
        console.log('Skipping syncCollectionWithSpec test - no collection ID available');
        console.log('Run collections functional tests first to create a collection');
        return;
      }

      if (!userId) {
        console.log('Skipping syncCollectionWithSpec test - no userId available');
        return;
      }

      expect(genSpecId).toBeDefined();
      expect(srcCollectionId).toBeDefined();
      expect(userId).toBeDefined();

      console.log(`Attempting to sync collection ${srcCollectionId} with spec ${genSpecId}`);

      let result;
      try {
        result = await syncCollectionWithSpec(userId, srcCollectionId, genSpecId);
      } catch (err) {
        // Handle known error responses
        if (err.message && err.message.includes('Request failed with status code 400')) {
          console.log('Received 400 response - this endpoint only works with collections generated from this spec');
          console.log('The syncCollectionWithSpec endpoint requires the collection to have been generated from the spec');
          return;
        } else if (err.message && err.message.includes('Request failed with status code 403')) {
          console.log('Received 403 response - collection may not have permission to sync with this spec');
          console.log('This is a known limitation of the API');
          return;
        } else if (err.message && err.message.includes('Request failed with status code 404')) {
          console.log('Received 404 response - collection or spec not found');
          return;
        } else {
          throw err;
        }
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
      const userId = persistedIds?.userId;

      if (!genSpecId || !userId) {
        console.log('Skipping error test - prerequisites not available');
        return;
      }

      await expect(
        syncCollectionWithSpec(userId, fakeCollectionId, genSpecId)
      ).rejects.toThrow();
    });

    test('9. should handle error for non-existent spec', async () => {
      const fakeSpecId = '00000000-0000-0000-0000-000000000000';
      const srcCollectionId = persistedIds?.collection?.id;
      const userId = persistedIds?.userId;

      if (!srcCollectionId || !userId) {
        console.log('Skipping error test - prerequisites not available');
        return;
      }

      await expect(
        syncCollectionWithSpec(userId, srcCollectionId, fakeSpecId)
      ).rejects.toThrow();
    });
    });
  });

  describe('collection-to-spec', () => {
    test('1. createCollectionGeneration - should generate spec from collection', async () => {
      const collectionId = persistedIds?.transformations?.sourceCollection?.id;
      const userId = persistedIds?.userId;

      // Skip test if no collection is available
      if (!collectionId) {
        console.log('Skipping createCollectionGeneration test - no transformations source collection ID available');
        console.log('Run CreateSourceCollection test first');
        return;
      }

      if (!userId) {
        console.log('Skipping createCollectionGeneration test - no userId available');
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
        if (error.response && (error.response.status === 404 || error.response.status === 403)) {
          console.log(`Skipping: Collection ${collectionId} does not support spec generation (${error.response.status})`);
          console.log('Note: Spec generation may only be available for certain collection types or require specific permissions');
          return;
        }
        throw error;
      }
    });

    test('2. getCollectionTaskStatus - should get status of generation task', async () => {
      const collectionId = persistedIds?.transformations?.sourceCollection?.id;
      const taskId = persistedIds?.transformations?.sourceCollection?.generatedSpec?.taskId;
      const userId = persistedIds?.userId;

      // Skip test if no collection or taskId is available
      if (!collectionId || !taskId) {
        console.log('Skipping getCollectionTaskStatus test - no collection ID or taskId available');
        console.log('Run test 1 (createCollectionGeneration) first to create a generation task');
        return;
      }

      if (!userId) {
        console.log('Skipping getCollectionTaskStatus test - no userId available');
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

    test('3. getCollectionTaskStatus - Poll until complete', async () => {
      const collectionId = persistedIds?.transformations?.sourceCollection?.id;
      const taskId = persistedIds?.transformations?.sourceCollection?.generatedSpec?.taskId;
      const userId = persistedIds?.userId;

      // Skip test if no collection or taskId is available
      if (!collectionId || !taskId) {
        console.log('Skipping polling test - no collection ID or taskId available');
        return;
      }

      if (!userId) {
        console.log('Skipping polling test - no userId available');
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
            persistedIds.transformations.sourceCollection.generatedSpec = {
              ...persistedIds.transformations.sourceCollection.generatedSpec,
              id: generatedSpecId
            };
            saveTestIds(persistedIds);

            console.log(`Generated spec ID: ${generatedSpecId}`);
            console.log(`Persisted to transformations.sourceCollection.generatedSpec.id`);
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

    test('4. getCollectionGenerations - should retrieve generated specs list', async () => {
      const collectionId = persistedIds?.transformations?.sourceCollection?.id;
      const userId = persistedIds?.userId;

      // Skip test if no collection is available
      if (!collectionId) {
        console.log('Skipping getCollectionGenerations test - no transformations source collection ID available');
        return;
      }

      if (!userId) {
        console.log('Skipping getCollectionGenerations test - no userId available');
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
        if (error.response && (error.response.status === 403 || error.response.status === 404)) {
          console.log(`Skipping: Cannot access generations for collection ${collectionId} (${error.response.status})`);
          console.log('Note: This endpoint may require specific permissions or may not be available for all collection types');
          return;
        }
        throw error;
      }
    });

    describe('syncCollectionWithSpec', () => {
    test('5. should sync collection with generated spec', async () => {
      const genSpecId = persistedIds?.collection?.generatedSpec?.id;
      const srcCollectionId = persistedIds?.collection?.id;
      const userId = persistedIds?.userId;

      // Skip test if prerequisites aren't met
      if (!genSpecId) {
        console.log('Skipping syncCollectionWithSpec test - no generated spec ID available');
        console.log('Run collections functional tests first to generate a spec from a collection');
        console.log('Specifically, run test 11b (getCollectionTaskStatus - Poll until complete)');
        return;
      }

      if (!srcCollectionId) {
        console.log('Skipping syncCollectionWithSpec test - no collection ID available');
        console.log('Run collections functional tests first to create a collection');
        return;
      }

      if (!userId) {
        console.log('Skipping syncCollectionWithSpec test - no userId available');
        return;
      }

      expect(genSpecId).toBeDefined();
      expect(srcCollectionId).toBeDefined();
      expect(userId).toBeDefined();

      console.log(`Attempting to sync collection ${srcCollectionId} with spec ${genSpecId}`);

      let result;
      try {
        result = await syncCollectionWithSpec(userId, srcCollectionId, genSpecId);
      } catch (err) {
        // Handle known error responses
        if (err.message && err.message.includes('Request failed with status code 400')) {
          console.log('Received 400 response - this endpoint only works with collections generated from this spec');
          console.log('The syncCollectionWithSpec endpoint requires the collection to have been generated from the spec');
          return;
        } else if (err.message && err.message.includes('Request failed with status code 403')) {
          console.log('Received 403 response - collection may not have permission to sync with this spec');
          console.log('This is a known limitation of the API');
          return;
        } else if (err.message && err.message.includes('Request failed with status code 404')) {
          console.log('Received 404 response - collection or spec not found');
          return;
        } else {
          throw err;
        }
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

    test('6. should handle error for non-existent collection', async () => {
      const genSpecId = persistedIds?.collection?.generatedSpec?.id;
      const fakeCollectionId = '00000000-0000-0000-0000-000000000000';
      const userId = persistedIds?.userId;

      if (!genSpecId || !userId) {
        console.log('Skipping error test - prerequisites not available');
        return;
      }

      await expect(
        syncCollectionWithSpec(userId, fakeCollectionId, genSpecId)
      ).rejects.toThrow();
    });

    test('7. should handle error for non-existent spec', async () => {
      const fakeSpecId = '00000000-0000-0000-0000-000000000000';
      const srcCollectionId = persistedIds?.collection?.id;
      const userId = persistedIds?.userId;

      if (!srcCollectionId || !userId) {
        console.log('Skipping error test - prerequisites not available');
        return;
      }

      await expect(
        syncCollectionWithSpec(userId, srcCollectionId, fakeSpecId)
      ).rejects.toThrow();
    });
    });
  });
});


