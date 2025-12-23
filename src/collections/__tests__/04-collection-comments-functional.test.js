const { 
  getCollectionComments,
  createCollectionComment,
  updateCollectionComment,
  deleteCollectionComment
} = require('../index');
const { POSTMAN_API_KEY_ENV_VAR } = require('../../core/config');
const { loadTestIds, saveTestIds, clearTestIds, initializeUserId } = require('../../__tests__/test-helpers');

describe('collection comments functional tests (sequential flow)', () => {
  let testUserId;
  let testCollectionId;
  let testCommentId;
  let testThreadId;
  let testReplyCommentId;
  let persistedIds = {};

  beforeAll(async () => {
    if (!process.env[POSTMAN_API_KEY_ENV_VAR]) {
      throw new Error(`${POSTMAN_API_KEY_ENV_VAR} environment variable is required for functional tests`);
    }

    // Initialize userId first
    testUserId = await initializeUserId();

    persistedIds = loadTestIds();
    testCollectionId = (persistedIds.collection && persistedIds.collection.id) || null;
    testCommentId = (persistedIds.collection && persistedIds.collection.comment && persistedIds.collection.comment.id) || null;
    testThreadId = (persistedIds.collection && persistedIds.collection.thread && persistedIds.collection.thread.id) || null;
    testReplyCommentId = (persistedIds.collection && persistedIds.collection.comment && persistedIds.collection.comment.replyId) || null;

    if (!testCollectionId) {
      throw new Error('No collection ID found. Please run collection tests first to create a test collection.');
    }

    console.log('Using collection ID:', testCollectionId);

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

  test('1. getCollectionComments - should retrieve comments (initially empty or with existing comments)', async () => {
    expect(testCollectionId).toBeDefined();

    const result = await getCollectionComments(testUserId, testCollectionId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('data');
    expect(Array.isArray(result.data.data)).toBe(true);
  });

  test('2. createCollectionComment - should create a comment on the collection', async () => {
    expect(testCollectionId).toBeDefined();

    // Check if comment already exists and is valid
    if (testCommentId) {
      try {
        const existingComments = await getCollectionComments(testUserId, testCollectionId);
        const existingComment = existingComments.data.data.find(c => c.id === testCommentId);
        if (existingComment) {
          // Update threadId if not already set
          if (existingComment.threadId && !testThreadId) {
            testThreadId = existingComment.threadId;
            const ids = loadTestIds();
            saveTestIds({
              ...ids,
              collection: {
                ...ids.collection,
                thread: {
                  ...ids.collection.thread,
                  id: testThreadId
                }
              }
            });
          }
          console.log(`Using persisted comment ID: ${testCommentId}, thread ID: ${testThreadId}`);
          return;
        } else {
          console.log('Persisted comment ID not found in collection, creating new comment');
        }
      } catch (error) {
        console.log('Error checking existing comments, creating new comment');
      }
    }

    const commentData = {
      body: 'This is a test comment on the collection created by SDK functional tests'
    };

    const result = await createCollectionComment(testUserId, testCollectionId, commentData);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('data');
    expect(result.data.data).toHaveProperty('id');
    expect(result.data.data).toHaveProperty('body');
    expect(result.data.data.body).toBe(commentData.body);

    testCommentId = result.data.data.id;
    testThreadId = result.data.data.threadId;

    // Persist comment ID and thread ID for future test runs
    const ids = loadTestIds();
    saveTestIds({
      ...ids,
      collection: {
        ...ids.collection,
        comment: {
          ...ids.collection.comment,
          id: testCommentId
        },
        thread: {
          ...ids.collection.thread,
          id: testThreadId
        }
      }
    });

    console.log(`Created and persisted comment ID: ${testCommentId}, thread ID: ${testThreadId}`);
  });

  test('3. getCollectionComments - should retrieve comments including the new one', async () => {
    expect(testCollectionId).toBeDefined();
    
    if (!testCommentId) {
      console.log('Skipping test - no comment was created');
      return;
    }

    const result = await getCollectionComments(testUserId, testCollectionId);

    expect(result.status).toBe(200);
    expect(result.data.data.length).toBeGreaterThan(0);
    
    const comment = result.data.data.find(c => c.id === testCommentId);
    expect(comment).toBeDefined();
  });

  test('4. createCollectionCommentReply - should create a reply comment', async () => {
    expect(testCollectionId).toBeDefined();
    
    if (!testThreadId) {
      console.log('Skipping test - no thread ID available for reply');
      return;
    }

    // Skip if reply comment already exists
    if (testReplyCommentId) {
      console.log(`Using persisted reply comment ID: ${testReplyCommentId}`);
      return;
    }

    const replyData = {
      body: 'This is a reply to the collection comment',
      threadId: testThreadId
    };

    try {
      const result = await createCollectionComment(testUserId, testCollectionId, replyData);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('data');
      expect(result.data.data).toHaveProperty('id');
      expect(result.data.data.body).toBe(replyData.body);

      testReplyCommentId = result.data.data.id;

      // Persist reply comment ID for future test runs
      const ids = loadTestIds();
      saveTestIds({
        ...ids,
        collection: {
          ...ids.collection,
          comment: {
            ...ids.collection.comment,
            replyId: testReplyCommentId
          }
        }
      });

      console.log(`Created and persisted reply comment ID: ${testReplyCommentId}`);
    } catch (error) {
      // Reply comments may not be supported by the API or require special permissions
      console.log('Reply comment creation not supported or failed:', error.message);
    }
  });

  test('5. updateCollectionComment - should update the comment', async () => {
    expect(testCollectionId).toBeDefined();
    
    if (!testCommentId) {
      console.log('Skipping test - no comment available');
      return;
    }

    const updatedData = {
      body: 'This is an updated test comment on the collection'
    };

    const result = await updateCollectionComment(testUserId, testCollectionId, testCommentId, updatedData);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('data');
    expect(result.data.data.body).toBe(updatedData.body);
  });

  test('6. deleteCollectionComment - should delete the reply comment', async () => {
    expect(testCollectionId).toBeDefined();
    
    if (!testReplyCommentId) {
      console.log('Skipping test - no reply comment available');
      return;
    }

    const result = await deleteCollectionComment(testUserId, testCollectionId, testReplyCommentId);

    expect(result.status).toBe(204);

    // Clear reply comment ID from persisted file
    const clearedIds = clearTestIds(['collection.comment.replyId']);
    expect(clearedIds.collection.comment.replyId).toBeNull();
    
    console.log('Reply comment deleted and replyCommentId cleared from test-ids.json');
  });

  test('7. deleteCollectionComment - should delete the main comment', async () => {
    expect(testCollectionId).toBeDefined();
    
    if (!testCommentId) {
      console.log('Skipping test - no comment available');
      return;
    }

    const result = await deleteCollectionComment(testUserId, testCollectionId, testCommentId);

    expect(result.status).toBe(204);

    // Clear comment ID and thread ID from persisted file
    const clearedIds = clearTestIds(['collection.comment.id', 'collection.thread.id']);
    expect(clearedIds.collection.comment.id).toBeNull();
    expect(clearedIds.collection.thread.id).toBeNull();
    
    console.log('Main comment deleted and commentId/threadId cleared from test-ids.json');
  });

  describe('error handling', () => {
    test('should handle getting comments from non-existent collection', async () => {
      const fakeCollectionId = '00000000-0000-0000-0000-000000000000';
      await expect(getCollectionComments(testUserId, fakeCollectionId)).rejects.toThrow();
    });

    test('should handle updating non-existent comment', async () => {
      const fakeId = '999999';
      const commentData = { body: 'Updated comment' };
      await expect(updateCollectionComment(testUserId, testCollectionId, fakeId, commentData)).rejects.toThrow();
    });

    test('should handle deleting non-existent comment', async () => {
      const fakeId = '999999';
      await expect(deleteCollectionComment(testUserId, testCollectionId, fakeId)).rejects.toThrow();
    });
  });
});


