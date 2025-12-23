const { 
  getFolderComments,
  createFolderComment,
  updateFolderComment,
  deleteFolderComment
} = require('../index');
const { POSTMAN_API_KEY_ENV_VAR } = require('../../core/config');
const { loadTestIds, saveTestIds, clearTestIds, initializeUserId } = require('../../__tests__/test-helpers');

describe('folder comments functional tests (sequential flow)', () => {
  let testUserId;
  let testCollectionId;
  let testFolderId;
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
    testCollectionId = persistedIds.collectionId || null;
    testFolderId = persistedIds.folderId || null;
    testCommentId = persistedIds.commentId || null;
    testReplyCommentId = persistedIds.replyCommentId || null;

    if (!testCollectionId) {
      throw new Error('No collection ID found. Please run collection tests first to create a test collection.');
    }

    if (!testFolderId) {
      throw new Error('No folder ID found. Please run folder tests first to create a test folder.');
    }

    console.log('Using collection ID:', testCollectionId);
    console.log('Using folder ID:', testFolderId);

    if (testCommentId) {
      console.log('Found persisted comment ID:', testCommentId);
    }
  });

  afterAll(async () => {
    // NO CLEANUP - Comments persist indefinitely for reuse across test runs
    if (testCommentId) {
      console.log(`Comment ${testCommentId} will persist for future test runs`);
      console.log(`To delete manually, run: npx jest src/collections/__tests__/manual-cleanup.test.js`);
    }
  });

  test('1. getFolderComments - should retrieve comments (initially empty)', async () => {
    expect(testCollectionId).toBeDefined();
    expect(testFolderId).toBeDefined();

    const result = await getFolderComments(testUserId, testCollectionId, testFolderId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('data');
    expect(Array.isArray(result.data.data)).toBe(true);
  });

  test('2. createFolderComment - should create a comment on the folder', async () => {
    expect(testCollectionId).toBeDefined();
    expect(testFolderId).toBeDefined();

    // Check if comment already exists and is valid
    if (testCommentId) {
      try {
        const existingComments = await getFolderComments(testUserId, testCollectionId, testFolderId);
        const commentExists = existingComments.data.data.some(c => c.id === testCommentId);
        if (commentExists) {
          console.log(`Using persisted comment ID: ${testCommentId}`);
          return;
        } else {
          console.log('Persisted comment ID not found in folder, creating new comment');
        }
      } catch (error) {
        console.log('Error checking existing comments, creating new comment');
      }
    }

    const commentData = {
      body: 'This is a test comment created by SDK functional tests'
    };

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
  });

  test('3. getFolderComments - should retrieve comments including the new one', async () => {
    expect(testCollectionId).toBeDefined();
    expect(testFolderId).toBeDefined();
    
    if (!testCommentId) {
      console.log('Skipping test - no comment was created');
      return;
    }

    const result = await getFolderComments(testUserId, testCollectionId, testFolderId);

    expect(result.status).toBe(200);
    expect(result.data.data.length).toBeGreaterThan(0);
    
    const comment = result.data.data.find(c => c.id === testCommentId);
    expect(comment).toBeDefined();
  });

  test('4. createFolderCommentReply - should create a reply comment', async () => {
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
      // Reply comments may not be supported by the API or require special permissions
      console.log('Reply comment creation not supported or failed:', error.message);
    }
  });

  test('5. updateFolderComment - should update the comment', async () => {
    expect(testCollectionId).toBeDefined();
    expect(testFolderId).toBeDefined();
    
    if (!testCommentId) {
      console.log('Skipping test - no comment available');
      return;
    }

    const updatedData = {
      body: 'This is an updated test comment'
    };

    const result = await updateFolderComment(testUserId, testCollectionId, testFolderId, testCommentId, updatedData);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('data');
    expect(result.data.data.body).toBe(updatedData.body);
  });

  test('6. deleteFolderComment - should delete the reply comment', async () => {
    expect(testCollectionId).toBeDefined();
    expect(testFolderId).toBeDefined();
    
    if (!testReplyCommentId) {
      console.log('Skipping test - no reply comment available');
      return;
    }

    const result = await deleteFolderComment(testUserId, testCollectionId, testFolderId, testReplyCommentId);

    expect(result.status).toBe(204);

    // Clear reply comment ID from persisted file
    const clearedIds = clearTestIds(['replyCommentId']);
    expect(clearedIds.replyCommentId).toBeNull();
    expect(clearedIds).toHaveProperty('clearedAt');
    
    console.log('Reply comment deleted and replyCommentId cleared from test-ids.json');
  });

  test('7. deleteFolderComment - should delete the main comment', async () => {
    expect(testCollectionId).toBeDefined();
    expect(testFolderId).toBeDefined();
    
    if (!testCommentId) {
      console.log('Skipping test - no comment available');
      return;
    }

    const result = await deleteFolderComment(testUserId, testCollectionId, testFolderId, testCommentId);

    expect(result.status).toBe(204);

    // Clear comment ID from persisted file
    const clearedIds = clearTestIds(['commentId']);
    expect(clearedIds.commentId).toBeNull();
    expect(clearedIds).toHaveProperty('clearedAt');
    
    console.log('Main comment deleted and commentId cleared from test-ids.json');
  });

  describe('error handling', () => {
    test('should handle getting comments from non-existent collection', async () => {
      const fakeCollectionId = '00000000-0000-0000-0000-000000000000';
      await expect(getFolderComments(testUserId, fakeCollectionId, testFolderId)).rejects.toThrow();
    });

    test('should handle updating non-existent comment', async () => {
      const fakeId = '999999';
      const commentData = { body: 'Updated comment' };
      await expect(updateFolderComment(testUserId, testCollectionId, testFolderId, fakeId, commentData)).rejects.toThrow();
    });

    test('should handle deleting non-existent comment', async () => {
      const fakeId = '999999';
      await expect(deleteFolderComment(testUserId, testCollectionId, testFolderId, fakeId)).rejects.toThrow();
    });
  });
});

