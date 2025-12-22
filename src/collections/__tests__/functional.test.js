const { 
  getCollections, 
  createCollection,
  getCollection,
  updateCollection,
  modifyCollection,
  deleteCollection,
  createFolder,
  getFolder,
  updateFolder,
  deleteFolder,
  getFolderComments,
  createFolderComment,
  updateFolderComment,
  deleteFolderComment
} = require('../index');
const { POSTMAN_API_KEY_ENV_VAR } = require('../../core/config');
const { loadTestIds, saveTestIds, clearTestIds, initializeUserId } = require('../../__tests__/test-helpers');

const DEFAULT_WORKSPACE_ID = '5fbcd502-1112-435f-9dac-4c943d3d0b37';

describe('collections functional tests (sequential flow)', () => {
  let testUserId;
  let testWorkspaceId;
  let testCollectionId;
  let testCollectionName;
  let testFolderId;
  let testFolderName;
  let testCommentId;
  let testReplyCommentId;
  let persistedIds = {};

  beforeAll(async () => {
    if (!process.env[POSTMAN_API_KEY_ENV_VAR]) {
      throw new Error(`${POSTMAN_API_KEY_ENV_VAR} environment variable is required for functional tests`);
    }

    // Initialize userId first
    testUserId = await initializeUserId();

    persistedIds = loadTestIds();
    testWorkspaceId = persistedIds.workspaceId || DEFAULT_WORKSPACE_ID;
    testCollectionId = persistedIds.collectionId || null;
    testCollectionName = persistedIds.collectionName || null;
    testFolderId = persistedIds.folderId || null;
    testFolderName = persistedIds.folderName || null;
    testCommentId = persistedIds.commentId || null;
    testReplyCommentId = persistedIds.replyCommentId || null;

    if (persistedIds.workspaceId) {
      console.log('Using persisted workspace ID:', testWorkspaceId);
    } else {
      console.log('Using default workspace ID:', testWorkspaceId);
    }

    if (testCollectionId) {
      console.log('Found persisted collection ID:', testCollectionId);
    }

    if (testFolderId) {
      console.log('Found persisted folder ID:', testFolderId);
    }

    if (testCommentId) {
      console.log('Found persisted comment ID:', testCommentId);
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

  test('6. getCollection - should retrieve collection by ID', async () => {
    expect(testCollectionId).toBeDefined();

    const result = await getCollection(testCollectionId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('collection');
    expect(result.data.collection).toHaveProperty('info');
    expect(result.data.collection.info._postman_id).toBe(testCollectionId);
    expect(result.data.collection.info.name).toBe(testCollectionName);
  });

  test('7. modifyCollection - should update collection name', async () => {
    expect(testCollectionId).toBeDefined();

    const updatedName = `${testCollectionName} - Updated`;
    const partialData = {
      info: {
        name: updatedName
      }
    };

    const result = await modifyCollection(testCollectionId, partialData);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('collection');
    // PATCH response returns minimal data, just verify success
    
    // Update our local reference
    testCollectionName = updatedName;
    persistedIds.collectionName = updatedName;
    saveTestIds(persistedIds);
  });

  test('8. getCollection - should verify name update', async () => {
    expect(testCollectionId).toBeDefined();

    const result = await getCollection(testCollectionId);

    expect(result.status).toBe(200);
    expect(result.data.collection.info.name).toBe(testCollectionName);
  });

  test('9. updateCollection - should replace collection data', async () => {
    expect(testCollectionId).toBeDefined();

    // First get the current collection to preserve its structure
    const currentResult = await getCollection(testCollectionId);
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

    const result = await updateCollection(testCollectionId, updatedCollection);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('collection');
    // PUT response returns minimal data, just verify success
  });

  test('10. createFolder - should create a folder in the collection', async () => {
    expect(testCollectionId).toBeDefined();

    // Check if folder already exists and is valid for this collection
    if (testFolderId) {
      try {
        const existingFolder = await getFolder(testCollectionId, testFolderId);
        if (existingFolder.status === 200) {
          console.log(`Using persisted folder ID: ${testFolderId}`);
          testFolderName = existingFolder.data.data.name;
          return;
        }
      } catch (error) {
        // Folder doesn't exist or is invalid, create a new one
        console.log('Persisted folder not found, creating new folder');
      }
    }

    testFolderName = `Test Folder ${Date.now()}`;
    const folderData = {
      name: testFolderName,
      description: 'Test folder created by SDK functional tests'
    };

    const result = await createFolder(testCollectionId, folderData);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('data');
    expect(result.data.data).toHaveProperty('id');
    expect(result.data.data).toHaveProperty('name');
    expect(result.data.data.name).toBe(testFolderName);

    testFolderId = result.data.data.id;

    // Persist folder IDs for future test runs
    saveTestIds({
      ...loadTestIds(),
      folderId: testFolderId,
      folderName: testFolderName
    });

    console.log(`Created and persisted folder ID: ${testFolderId}`);
  });

  test('11. getFolder - should retrieve the folder by ID', async () => {
    expect(testCollectionId).toBeDefined();
    expect(testFolderId).toBeDefined();

    const result = await getFolder(testCollectionId, testFolderId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('data');
    expect(result.data.data).toHaveProperty('id');
    expect(result.data.data.id).toBe(testFolderId);
    expect(result.data.data).toHaveProperty('name');
    
    // Update testFolderName with current name from API if different
    if (result.data.data.name !== testFolderName) {
      testFolderName = result.data.data.name;
    }
  });

  test('12. updateFolder - should update the folder name', async () => {
    expect(testCollectionId).toBeDefined();
    expect(testFolderId).toBeDefined();

    const updatedName = `${testFolderName} - Updated`;
    const folderData = {
      name: updatedName,
      description: 'Updated folder description'
    };

    const result = await updateFolder(testCollectionId, testFolderId, folderData);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('data');
    
    testFolderName = updatedName;
  });

  test('13. getFolder - should verify folder update', async () => {
    expect(testCollectionId).toBeDefined();
    expect(testFolderId).toBeDefined();

    const result = await getFolder(testCollectionId, testFolderId);

    expect(result.status).toBe(200);
    expect(result.data.data).toHaveProperty('name');
    
    // Verify the name matches what we expect (updated or original)
    expect(result.data.data.name).toBe(testFolderName);
  });

  test('14. getFolderComments - should retrieve comments (initially empty)', async () => {
    expect(testCollectionId).toBeDefined();
    expect(testFolderId).toBeDefined();

    try {
      const result = await getFolderComments(testUserId, testCollectionId, testFolderId);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('data');
      expect(Array.isArray(result.data.data)).toBe(true);
    } catch (error) {
      // Comments API might return 403 if not available for this user/workspace
      if (error.response && error.response.status === 403) {
        console.log('Comments API returned 403 - feature may not be available for this account');
        return; // Skip test
      }
      throw error;
    }
  });

  test('15. createFolderComment - should create a comment on the folder', async () => {
    expect(testCollectionId).toBeDefined();
    expect(testFolderId).toBeDefined();

    // Skip if comment already exists
    if (testCommentId) {
      console.log(`Using persisted comment ID: ${testCommentId}`);
      return;
    }

    const commentData = {
      body: 'This is a test comment created by SDK functional tests'
    };

    try {
      const result = await createFolderComment(testUserId, testCollectionId, testFolderId, commentData);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('data');
      expect(result.data.data).toHaveProperty('id');
      expect(result.data.data).toHaveProperty('body');
      expect(result.data.data.body).toBe(commentData.body);

      testCommentId = result.data.data.id;

      // Persist comment ID for future test runs
      saveTestIds({
        ...loadTestIds(),
        commentId: testCommentId
      });

      console.log(`Created and persisted comment ID: ${testCommentId}`);
    } catch (error) {
      // Comments API might return 400/403 if not available for this user/workspace
      if (error.response && (error.response.status === 400 || error.response.status === 403)) {
        console.log(`Comments API returned ${error.response.status} - feature may not be available for this account`);
        return; // Skip test
      }
      throw error;
    }
  });

  test('16. getFolderComments - should retrieve comments including the new one', async () => {
    expect(testCollectionId).toBeDefined();
    expect(testFolderId).toBeDefined();
    
    if (!testCommentId) {
      console.log('Skipping test - no comment was created');
      return;
    }

    try {
      const result = await getFolderComments(testUserId, testCollectionId, testFolderId);

      expect(result.status).toBe(200);
      expect(result.data.data.length).toBeGreaterThan(0);
      
      const comment = result.data.data.find(c => c.id === testCommentId);
      expect(comment).toBeDefined();
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('Comments API returned 403 - skipping test');
        return;
      }
      throw error;
    }
  });

  test('17. createFolderComment - should create a reply comment', async () => {
    expect(testCollectionId).toBeDefined();
    expect(testFolderId).toBeDefined();
    
    if (!testCommentId) {
      console.log('Skipping test - no parent comment available');
      return;
    }

    // Skip if reply comment already exists
    if (testReplyCommentId) {
      console.log(`Using persisted reply comment ID: ${testReplyCommentId}`);
      return;
    }

    const replyData = {
      body: 'This is a reply to the test comment',
      threadId: testCommentId
    };

    try {
      const result = await createFolderComment(testUserId, testCollectionId, testFolderId, replyData);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('data');
      expect(result.data.data).toHaveProperty('id');
      expect(result.data.data.body).toBe(replyData.body);

      testReplyCommentId = result.data.data.id;

      // Persist reply comment ID for future test runs
      saveTestIds({
        ...loadTestIds(),
        replyCommentId: testReplyCommentId
      });

      console.log(`Created and persisted reply comment ID: ${testReplyCommentId}`);
    } catch (error) {
      if (error.response && (error.response.status === 400 || error.response.status === 403)) {
        console.log(`Comments API returned ${error.response.status} - skipping test`);
        return;
      }
      throw error;
    }
  });

  test('18. updateFolderComment - should update the comment', async () => {
    expect(testCollectionId).toBeDefined();
    expect(testFolderId).toBeDefined();
    
    if (!testCommentId) {
      console.log('Skipping test - no comment available');
      return;
    }

    const updatedData = {
      body: 'This is an updated test comment'
    };

    try {
      const result = await updateFolderComment(testUserId, testCollectionId, testFolderId, testCommentId, updatedData);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('data');
      expect(result.data.data.body).toBe(updatedData.body);
    } catch (error) {
      if (error.response && (error.response.status === 403 || error.response.status === 404)) {
        console.log(`Comments API returned ${error.response.status} - skipping test`);
        return;
      }
      throw error;
    }
  });

  test('19. deleteFolderComment - should delete the reply comment', async () => {
    expect(testCollectionId).toBeDefined();
    expect(testFolderId).toBeDefined();
    
    if (!testReplyCommentId) {
      console.log('Skipping test - no reply comment available');
      return;
    }

    try {
      const result = await deleteFolderComment(testUserId, testCollectionId, testFolderId, testReplyCommentId);

      expect(result.status).toBe(204);

      // Clear reply comment ID from persisted file
      const clearedIds = clearTestIds(['replyCommentId']);
      expect(clearedIds.replyCommentId).toBeNull();
      expect(clearedIds).toHaveProperty('clearedAt');
      
      console.log('Reply comment deleted and replyCommentId cleared from test-ids.json');
    } catch (error) {
      if (error.response && (error.response.status === 403 || error.response.status === 404)) {
        console.log(`Comments API returned ${error.response.status} - skipping test`);
        return;
      }
      throw error;
    }
  });

  test('20. deleteFolderComment - should delete the main comment', async () => {
    expect(testCollectionId).toBeDefined();
    expect(testFolderId).toBeDefined();
    
    if (!testCommentId) {
      console.log('Skipping test - no comment available');
      return;
    }

    try {
      const result = await deleteFolderComment(testUserId, testCollectionId, testFolderId, testCommentId);

      expect(result.status).toBe(204);

      // Clear comment ID from persisted file
      const clearedIds = clearTestIds(['commentId']);
      expect(clearedIds.commentId).toBeNull();
      expect(clearedIds).toHaveProperty('clearedAt');
      
      console.log('Main comment deleted and commentId cleared from test-ids.json');
    } catch (error) {
      if (error.response && (error.response.status === 403 || error.response.status === 404)) {
        console.log(`Comments API returned ${error.response.status} - skipping test`);
        return;
      }
      throw error;
    }
  });

  test('21. deleteFolder - should delete the folder and update test-ids.json', async () => {
    expect(testCollectionId).toBeDefined();
    expect(testFolderId).toBeDefined();

    const result = await deleteFolder(testCollectionId, testFolderId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('data');

    // Clear folder IDs from persisted file
    const clearedIds = clearTestIds(['folderId', 'folderName']);
    expect(clearedIds.folderId).toBeNull();
    expect(clearedIds.folderName).toBeNull();
    expect(clearedIds).toHaveProperty('clearedAt');

    console.log('Folder deleted and folder properties cleared from test-ids.json');

    // Verify folder is actually deleted
    await expect(getFolder(testCollectionId, testFolderId)).rejects.toThrow();
  });

  test('22. deleteCollection - should delete the collection and update test-ids.json', async () => {
    expect(testCollectionId).toBeDefined();
    
    const result = await deleteCollection(testCollectionId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('collection');
    expect(result.data.collection.id).toBe(testCollectionId);
    
    // Clear collection IDs from persisted file
    clearTestIds(['collectionId', 'collectionName']);
    
    console.log('Collection deleted and test-ids.json cleared');
    
    // Verify collection is actually deleted
    await expect(getCollection(testCollectionId)).rejects.toThrow();
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

    test('should handle deleting non-existent collection', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await expect(deleteCollection(fakeId)).rejects.toThrow();
    });

    test('should handle creating folder in non-existent collection', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const folderData = { name: 'Test Folder' };
      await expect(createFolder(fakeId, folderData)).rejects.toThrow();
    });

    test('should handle getting non-existent folder', async () => {
      if (!testCollectionId) {
        console.log('Skipping test - no collection ID available');
        return;
      }
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await expect(getFolder(testCollectionId, fakeId)).rejects.toThrow();
    });

    test('should handle updating non-existent folder', async () => {
      if (!testCollectionId) {
        console.log('Skipping test - no collection ID available');
        return;
      }
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const folderData = { name: 'Updated Folder' };
      await expect(updateFolder(testCollectionId, fakeId, folderData)).rejects.toThrow();
    });

    test('should handle deleting non-existent folder', async () => {
      if (!testCollectionId) {
        console.log('Skipping test - no collection ID available');
        return;
      }
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await expect(deleteFolder(testCollectionId, fakeId)).rejects.toThrow();
    });

    test('should handle getting comments from non-existent folder', async () => {
      if (!testCollectionId) {
        console.log('Skipping test - no collection ID available');
        return;
      }
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await expect(getFolderComments(testUserId, testCollectionId, fakeId)).rejects.toThrow();
    });

    test('should handle creating comment on non-existent folder', async () => {
      if (!testCollectionId) {
        console.log('Skipping test - no collection ID available');
        return;
      }
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const commentData = { body: 'Test comment' };
      await expect(createFolderComment(testUserId, testCollectionId, fakeId, commentData)).rejects.toThrow();
    });

    test('should handle updating non-existent comment', async () => {
      if (!testCollectionId || !testFolderId) {
        console.log('Skipping test - no collection or folder ID available');
        return;
      }
      const fakeId = '999999';
      const commentData = { body: 'Updated comment' };
      await expect(updateFolderComment(testUserId, testCollectionId, testFolderId, fakeId, commentData)).rejects.toThrow();
    });

    test('should handle deleting non-existent comment', async () => {
      if (!testCollectionId || !testFolderId) {
        console.log('Skipping test - no collection or folder ID available');
        return;
      }
      const fakeId = '999999';
      await expect(deleteFolderComment(testUserId, testCollectionId, testFolderId, fakeId)).rejects.toThrow();
    });
  });
});

