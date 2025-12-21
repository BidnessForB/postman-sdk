const { getCollections, createCollection } = require('../index');
const { POSTMAN_API_KEY_ENV_VAR } = require('../../core/config');
const { loadTestIds, saveTestIds, clearTestIds } = require('../../__tests__/test-helpers');

const DEFAULT_WORKSPACE_ID = '5fbcd502-1112-435f-9dac-4c943d3d0b37';

describe('collections functional tests (sequential flow)', () => {
  let testWorkspaceId;
  let testCollectionId;
  let testCollectionName;
  let persistedIds = {};

  beforeAll(() => {
    if (!process.env[POSTMAN_API_KEY_ENV_VAR]) {
      throw new Error(`${POSTMAN_API_KEY_ENV_VAR} environment variable is required for functional tests`);
    }

    persistedIds = loadTestIds();
    testWorkspaceId = persistedIds.workspaceId || DEFAULT_WORKSPACE_ID;
    testCollectionId = persistedIds.collectionId || null;
    testCollectionName = persistedIds.collectionName || null;

    if (persistedIds.workspaceId) {
      console.log('Using persisted workspace ID:', testWorkspaceId);
    } else {
      console.log('Using default workspace ID:', testWorkspaceId);
    }

    if (testCollectionId) {
      console.log('Found persisted collection ID:', testCollectionId);
    }
  });

  afterAll(async () => {
    // NO CLEANUP - Collection persists indefinitely for reuse across test runs
    if (testCollectionId) {
      console.log(`Collection ${testCollectionId} will persist for future test runs`);
      console.log(`Delete manually if needed using: await deleteCollection('${testCollectionId}')`);
    }
  });

  test('1. createCollection - should create a collection in workspace', async () => {
    // Skip creation if we have a persisted collection ID
    if (testCollectionId) {
      console.log('Reusing persisted collection ID, skipping creation');
      return;
    }

    testCollectionName = `SDK Test Collection ${Date.now()}`;
    const collectionData = {
      info: {
        name: testCollectionName,
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
    expect(result.data.collection.name).toBe(testCollectionName);

    testCollectionId = result.data.collection.id;
    persistedIds.collectionId = testCollectionId;
    persistedIds.collectionName = testCollectionName;
    if (!persistedIds.createdAt) {
      persistedIds.createdAt = new Date().toISOString();
    }
    saveTestIds(persistedIds);
    console.log(`Created and persisted collection ID: ${testCollectionId}`);
  }, 10000);

  test('2. getCollections - should retrieve collections from workspace', async () => {
    const result = await getCollections(testWorkspaceId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('collections');
    expect(Array.isArray(result.data.collections)).toBe(true);
    
    // If we have a test collection, verify it's in the list
    if (testCollectionId) {
      const foundCollection = result.data.collections.find(col => col.id === testCollectionId);
      expect(foundCollection).toBeDefined();
      expect(foundCollection.name).toBe(testCollectionName);
    }
  });

  test('3. getCollections - should retrieve collections without workspace filter', async () => {
    const result = await getCollections();

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('collections');
    expect(Array.isArray(result.data.collections)).toBe(true);
  });

  test('4. getCollections - should filter collections by name', async () => {
    if (!testCollectionName) {
      console.log('Skipping name filter test - no collection name available');
      return;
    }

    const result = await getCollections(testWorkspaceId, testCollectionName);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('collections');
    expect(Array.isArray(result.data.collections)).toBe(true);
    
    if (result.data.collections.length > 0) {
      result.data.collections.forEach(col => {
        expect(col.name).toContain(testCollectionName);
      });
    }
  });

  test('5. getCollections - should support pagination with limit and offset', async () => {
    const result = await getCollections(testWorkspaceId, null, 5, 0);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('collections');
    expect(Array.isArray(result.data.collections)).toBe(true);
    expect(result.data.collections.length).toBeLessThanOrEqual(5);
  });

  describe('error handling', () => {
    test('should handle invalid workspace ID gracefully', async () => {
      const fakeWorkspaceId = '00000000-0000-0000-0000-000000000000';
      
      // Per spec: invalid workspace ID returns HTTP 200 with empty array
      const result = await getCollections(fakeWorkspaceId);
      
      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('collections');
      expect(result.data.collections).toEqual([]);
    });

    test('should handle createCollection with invalid data', async () => {
      const invalidData = {
        // Missing required 'info' property
      };

      await expect(createCollection(invalidData, testWorkspaceId)).rejects.toThrow();
    });
  });
});

