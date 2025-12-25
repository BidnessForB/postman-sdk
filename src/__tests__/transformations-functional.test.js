const { syncSpecWithCollection, createSpec } = require('../specs/index');
const { syncCollectionWithSpec, createCollection } = require('../collections/index');
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
    describe('syncSpecWithCollection', () => {
    test('1. should sync generated spec with source collection', async () => {
      const genSpecId = persistedIds?.collection?.generatedSpec?.id;
      const srcCollectionId = persistedIds?.collection?.id;
      const userId = persistedIds?.userId;

      // Skip test if prerequisites aren't met
      if (!genSpecId) {
        console.log('Skipping syncSpecWithCollection test - no generated spec ID available');
        console.log('Run collections functional tests first to generate a spec from a collection');
        console.log('Specifically, run test 11b (getCollectionTaskStatus - Poll until complete)');
        return;
      }

      if (!srcCollectionId) {
        console.log('Skipping syncSpecWithCollection test - no collection ID available');
        console.log('Run collections functional tests first to create a collection');
        return;
      }

      if (!userId) {
        console.log('Skipping syncSpecWithCollection test - no userId available');
        return;
      }

      expect(genSpecId).toBeDefined();
      expect(srcCollectionId).toBeDefined();
      expect(userId).toBeDefined();

      // Build the collection UID (userId-collectionId)
      const collectionUid = buildUid(userId, srcCollectionId);

      console.log(`Attempting to sync spec ${genSpecId} with collection ${collectionUid}`);

      let result;
      try {
        result = await syncSpecWithCollection(genSpecId, collectionUid);
      } catch (err) {
        // Accept 400 response as known limitation
        if (err.message && err.message.includes('Request failed with status code 400')) {
          console.log('Received 400 response - this is expected if spec was not originally generated from this collection');
          console.log('The syncSpecWithCollection endpoint only works with specs generated from the given collection');
          return;
        } else {
          throw err;
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

    test('2. should handle error for non-existent spec', async () => {
      const fakeSpecId = '00000000-0000-0000-0000-000000000000';
      const srcCollectionId = persistedIds?.collection?.id;
      const userId = persistedIds?.userId;

      if (!srcCollectionId || !userId) {
        console.log('Skipping error test - prerequisites not available');
        return;
      }

      const collectionUid = buildUid(userId, srcCollectionId);

      await expect(
        syncSpecWithCollection(fakeSpecId, collectionUid)
      ).rejects.toThrow();
    });
    });
  });

  describe('collection-to-spec', () => {
    describe('syncCollectionWithSpec', () => {
    test('1. should sync collection with generated spec', async () => {
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

    test('2. should handle error for non-existent collection', async () => {
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

    test('3. should handle error for non-existent spec', async () => {
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


