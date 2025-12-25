const { 
  createRequest,
  getRequest,
  updateRequest,
  deleteRequest
} = require('../index');
const { POSTMAN_API_KEY_ENV_VAR } = require('../../core/config');
const { loadTestIds, saveTestIds } = require('../../__tests__/test-helpers');

describe('requests functional tests (sequential flow)', () => {
  let persistedIds = {};

  beforeAll(async () => {
    if (!process.env[POSTMAN_API_KEY_ENV_VAR]) {
      throw new Error(`${POSTMAN_API_KEY_ENV_VAR} environment variable is required for functional tests`);
    }

    persistedIds = loadTestIds();

    if (!persistedIds.collection || !persistedIds.collection.id) {
      throw new Error('No collection ID found. Please run collection tests first to create a test collection.');
    }

    console.log('Using collection ID:', persistedIds.collection.id);

    if (persistedIds.request && persistedIds.request.id) {
      console.log('Found persisted request ID:', persistedIds.request.id);
    }
  });

  afterAll(async () => {
    
  });

  test('1. createRequest - should create a request in the collection', async () => {
    const collectionId = persistedIds.collection.id;
  
    const requestName = `Test Request ${Date.now()}`;
    const requestData = {
      name: requestName,
      method: 'GET',
      url: 'https://postman-echo.com/get',
      description: 'Test request created by SDK functional tests'
    };

    const result = await createRequest(collectionId, requestData);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('data');
    expect(result.data.data).toHaveProperty('id');
    expect(result.data.data).toHaveProperty('name');
    expect(result.data.data.name).toBe(requestName);
    expect(result.data.data.method).toBe('GET');

    // Persist request IDs for future test runs
    persistedIds.request = {
      ...persistedIds.request,
      id: result.data.data.id,
      name: requestName,
      createdAt: new Date().toISOString()
    };
    saveTestIds(persistedIds);

    console.log(`Created and persisted request ID: ${persistedIds.request.id}`);
  });

  test('2. getRequest - should retrieve the request by ID', async () => {
    const collectionId = persistedIds.collection.id;
    const requestId = persistedIds.request.id;
    
    expect(collectionId).toBeDefined();
    expect(requestId).toBeDefined();

    const result = await getRequest(collectionId, requestId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('data');
    expect(result.data.data).toHaveProperty('id');
    expect(result.data.data.id).toBe(requestId);
    expect(result.data.data).toHaveProperty('name');
    
    // Update persisted name with current name from API if different
    if (result.data.data.name !== persistedIds.request.name) {
      persistedIds.request.name = result.data.data.name;
      saveTestIds(persistedIds);
    }
  });

  test('3. updateRequest - should update the request name and method', async () => {
    const collectionId = persistedIds.collection.id;
    const requestId = persistedIds.request.id;
    
    expect(collectionId).toBeDefined();
    expect(requestId).toBeDefined();

    const updatedName = `${persistedIds.request.name} - Updated`;
    const requestData = {
      name: updatedName,
      method: 'POST',
      url: 'https://postman-echo.com/post',
      description: 'Updated request description'
    };

    const result = await updateRequest(collectionId, requestId, requestData);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('data');
    
    // Update persisted name
    persistedIds.request = {
      ...persistedIds.request,
      name: updatedName
    };
    saveTestIds(persistedIds);
  });

  test('4. getRequest - should verify request update', async () => {
    const collectionId = persistedIds.collection.id;
    const requestId = persistedIds.request.id;
    
    expect(collectionId).toBeDefined();
    expect(requestId).toBeDefined();

    const result = await getRequest(collectionId, requestId);

    expect(result.status).toBe(200);
    expect(result.data.data).toHaveProperty('name');
    
    // Verify the name matches what we expect (updated or original)
    expect(result.data.data.name).toBe(persistedIds.request.name);
  });

  test('5. deleteRequest - should delete a request', async () => {
    const collectionId = persistedIds.collection.id;
    expect(collectionId).toBeDefined();

    // Create a temporary request specifically for deletion testing
    const tempRequestData = {
      name: `Temp Request for Deletion ${Date.now()}`,
      method: 'DELETE',
      url: 'https://postman-echo.com/delete',
      description: 'This request will be deleted as part of testing'
    };

    const createResult = await createRequest(collectionId, tempRequestData);
    expect(createResult.status).toBe(200);
    expect(createResult.data.data).toHaveProperty('id');
    const tempRequestId = createResult.data.data.id;
    expect(tempRequestId).toBeDefined();

    console.log(`Created temporary request ${tempRequestId} for deletion testing`);

    // Delete the request
    const deleteResult = await deleteRequest(collectionId, tempRequestId);
    expect(deleteResult.status).toBe(200);
    expect(deleteResult.data).toHaveProperty('data');
    expect(deleteResult.data.data.id).toBe(tempRequestId);

    console.log(`Successfully deleted request ${tempRequestId}`);

    // Verify the request is deleted by attempting to get it (should fail)
    await expect(getRequest(collectionId, tempRequestId)).rejects.toThrow();
    console.log('Verified request no longer exists');
  });

  test('6. createRequest - should create a request in a folder', async () => {
    const collectionId = persistedIds.collection.id;
    const folderId = persistedIds.folder?.id;
    
    if (!folderId) {
      console.log('Skipping folder request test - no folder ID available');
      return;
    }

    const requestName = `Folder Request ${Date.now()}`;
    const requestData = {
      name: requestName,
      method: 'GET',
      url: 'https://postman-echo.com/get',
      description: 'Request created in a folder'
    };

    const result = await createRequest(collectionId, requestData, folderId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('data');
    expect(result.data.data).toHaveProperty('id');
    expect(result.data.data).toHaveProperty('name');
    expect(result.data.data.name).toBe(requestName);
    
    // Store folder request ID separately
    if (!persistedIds.folderRequest) {
      persistedIds.folderRequest = {};
    }
    persistedIds.folderRequest.id = result.data.data.id;
    persistedIds.folderRequest.name = requestName;
    saveTestIds(persistedIds);

    console.log(`Created request in folder: ${persistedIds.folderRequest.id}`);
  });

  describe('error handling', () => {
    test('should handle creating request in non-existent collection', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const requestData = { 
        name: 'Test Request',
        method: 'GET',
        url: 'https://postman-echo.com/get'
      };
      await expect(createRequest(fakeId, requestData)).rejects.toThrow();
    });

    test('should handle getting non-existent request', async () => {
      const collectionId = persistedIds.collection.id;
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await expect(getRequest(collectionId, fakeId)).rejects.toThrow();
    });

    test('should handle updating non-existent request', async () => {
      const collectionId = persistedIds.collection.id;
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const requestData = { 
        name: 'Updated Request',
        method: 'POST',
        url: 'https://postman-echo.com/post'
      };
      await expect(updateRequest(collectionId, fakeId, requestData)).rejects.toThrow();
    });

    test('should handle deleting non-existent request', async () => {
      const collectionId = persistedIds.collection.id;
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await expect(deleteRequest(collectionId, fakeId)).rejects.toThrow();
    });
  });
});

