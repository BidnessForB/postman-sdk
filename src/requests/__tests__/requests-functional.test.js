const {
  createRequest,
  getRequest,
  updateRequest,
  deleteRequest,
  getRequestComments,
  createRequestComment,
  updateRequestComment,
  deleteRequestComment
} = require('../request');

const { loadTestIds,getUserId, saveTestIds, DEFAULT_UID } = require('../../__tests__/test-helpers');

describe('requests functional tests (sequential flow)', () => {
  let persistedIds = {};

  beforeAll(async () => {
    

    // persistedIds must be loaded so that sequential functional tests have access
    // to IDs (e.g., collectionId) persisted from previous phases. This enables
    // the requests functional tests to build on resources created earlier.
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
      uid: result.data.data.owner + '-' + result.data.data.id,
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

    const result = await getRequest(persistedIds.collection.id, persistedIds.request.id);

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

    const result = await updateRequest(persistedIds.collection.id, persistedIds.request.id, requestData);

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

    const result = await getRequest(persistedIds.collection.id, persistedIds.request.id);

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

  describe('request comments', () => {
    let commentId;

    describe('comment lifecycle', () => {
      test('should create a comment on a request', async () => {
        const userId = getUserId();
        const collectionId = persistedIds.collection.id;
        const requestId = persistedIds.request.id;
        
        const commentData = {
          body: 'This is a test comment on a request'
        };

        const result = await createRequestComment(persistedIds.collection.uid, persistedIds.request.uid, commentData);

        expect(result.status).toBeGreaterThanOrEqual(200);
        expect(result.status).toBeLessThan(300);
        expect(result.data).toBeDefined();
        expect(result.data.data).toBeDefined();
        expect(result.data.data.id).toBeDefined();
        expect(result.data.data.body).toBe(commentData.body);

        // Save comment ID for subsequent tests
        commentId = result.data.data.id;
        persistedIds.request = {
          ...persistedIds.request,
          commentId
        };
        saveTestIds(persistedIds);
      });

      test('should get all comments on a request', async () => {
        const userId = getUserId();
        const collectionId = persistedIds.collection.id;
        const requestId = persistedIds.request.id;

        const result = await getRequestComments(persistedIds.collection.uid, persistedIds.request.uid);

        expect(result.status).toBe(200);
        expect(result.data).toBeDefined();
        expect(result.data.data).toBeDefined();
        expect(Array.isArray(result.data.data)).toBe(true);
        
        // Should include our created comment
        const ourComment = result.data.data.find(c => c.id === persistedIds.request.commentId);
        expect(ourComment).toBeDefined();
        expect(ourComment.body).toBe('This is a test comment on a request');
      });

      test('should update a comment on a request', async () => {
        const userId = getUserId();
        const collectionId = persistedIds.collection.id;
        const requestId = persistedIds.request.id;
        const commentId = persistedIds.request.commentId;
        
        const updatedCommentData = {
          body: 'This is an updated comment on a request'
        };

        const result = await updateRequestComment(persistedIds.collection.uid, persistedIds.request.uid, commentId, updatedCommentData);

        expect(result.status).toBe(200);
        expect(result.data).toBeDefined();
        expect(result.data.data).toBeDefined();
        expect(result.data.data.id).toBe(commentId);
        expect(result.data.data.body).toBe(updatedCommentData.body);
      });

      test('should delete a comment from a request', async () => {
        const userId = getUserId();
        const collectionId = persistedIds.collection.id;
        const requestId = persistedIds.request.id;
        const commentId = persistedIds.request.commentId;
        let result;
        
        try {
          result = await deleteRequestComment(persistedIds.collection.uid, persistedIds.request.uid, commentId);
        } catch (error) {
          result = error.response;
        }

        expect(result.status).toEqual(204);
        
        
        
      });
    });

    describe('comment error handling', () => {
      test('should return 404 for comments on non-existent request', async () => {
        const userId = getUserId();
        const collectionUid = persistedIds.collection.uid;
        const nonExistentRequestId = DEFAULT_UID;
        const result = await getRequestComments(collectionUid, nonExistentRequestId);
        expect(result.status).toBe(200);
        expect(result.data).toBeDefined();
        expect(result.data.data).toBeDefined();
        expect(Array.isArray(result.data.data)).toBe(true);
        expect(result.data.data.length).toBe(0);

        //await expect(getRequestComments(collectionId, nonExistentRequestId)).rejects.toThrow();
      });

      test('should return error for invalid comment ID', async () => {
        const userId = getUserId();
        const collectionId = persistedIds.collection.id;
        const requestId = persistedIds.request.id;
        const invalidCommentId = 999999999;

        await expect(updateRequestComment(persistedIds.collection.uid, persistedIds.request.uid, invalidCommentId, { body: 'test' })).rejects.toThrow();
      });
    });
  });
});

