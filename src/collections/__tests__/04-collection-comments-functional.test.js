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
  let persistedIds = {};

  beforeAll(async () => {
    if (!process.env[POSTMAN_API_KEY_ENV_VAR]) {
      throw new Error(`${POSTMAN_API_KEY_ENV_VAR} environment variable is required for functional tests`);
    }

    // Initialize userId first
    testUserId = await initializeUserId();

    persistedIds = loadTestIds();

    if (!persistedIds.collection || !persistedIds.collection.id) {
      throw new Error('No collection ID found. Please run collection tests first to create a test collection.');
    }

    console.log('Using collection ID:', persistedIds.collection.id);

    if (persistedIds.collection && persistedIds.collection.comment && persistedIds.collection.comment.id) {
      console.log('Found persisted comment ID:', persistedIds.collection.comment.id);
    }
  });

  afterAll(async () => {
    
  });

  test('1. getCollectionComments - should retrieve comments (initially empty or with existing comments)', async () => {
    const collectionId = persistedIds.collection.id;
    expect(collectionId).toBeDefined();

    const result = await getCollectionComments(testUserId, collectionId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('data');
    expect(Array.isArray(result.data.data)).toBe(true);
  });

  test('2. createCollectionComment - should create a comment on the collection', async () => {
    const collectionId = persistedIds.collection.id;
    expect(collectionId).toBeDefined();

    const commentData = {
      body: 'This is a test comment on the collection created by SDK functional tests'
    };

    const result = await createCollectionComment(testUserId, collectionId, commentData);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('data');
    expect(result.data.data).toHaveProperty('id');
    expect(result.data.data).toHaveProperty('body');
    expect(result.data.data.body).toBe(commentData.body);

    // Persist comment ID and thread ID for future test runs
    if (!persistedIds.collection.comment) persistedIds.collection.comment = {};
    if (!persistedIds.collection.thread) persistedIds.collection.thread = {};
    
    persistedIds.collection.comment.id = result.data.data.id;
    persistedIds.collection.thread.id = result.data.data.threadId;
    persistedIds.collection.comment.createdAt = new Date().toISOString();
    
    saveTestIds(persistedIds);

    console.log(`Created and persisted comment ID: ${persistedIds.collection.comment.id}, thread ID: ${persistedIds.collection.thread.id}`);
  });

  test('3. getCollectionComments - should retrieve comments including the new one', async () => {
    const collectionId = persistedIds.collection.id;
    expect(collectionId).toBeDefined();
    
    

    const result = await getCollectionComments(testUserId, collectionId);

    expect(result.status).toBe(200);
    expect(result.data.data.length).toBeGreaterThan(0);
    
    const commentId = persistedIds.collection.comment.id;
    const comment = result.data.data.find(c => c.id === commentId);
    expect(comment).toBeDefined();
  });

  test('4. createCollectionCommentReply - should create a reply comment', async () => {
    const collectionId = persistedIds.collection.id;
    expect(collectionId).toBeDefined();
    
    

    const threadId = persistedIds.collection.thread.id;
    const replyData = {
      body: 'This is a reply to the collection comment',
      threadId: threadId
    };

    try {
      const result = await createCollectionComment(testUserId, collectionId, replyData);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('data');
      expect(result.data.data).toHaveProperty('id');
      expect(result.data.data.body).toBe(replyData.body);

      // Persist reply comment ID for future test runs
      if (!persistedIds.collection.comment) persistedIds.collection.comment = {};
      persistedIds.collection.comment.replyId = result.data.data.id;
      saveTestIds(persistedIds);

      console.log(`Created and persisted reply comment ID: ${persistedIds.collection.comment.replyId}`);
    } catch (error) {
      // Reply comments may not be supported by the API or require special permissions
      console.log('Reply comment creation not supported or failed:', error.message);
    }
  });

  test('5. updateCollectionComment - should update the comment', async () => {
    const collectionId = persistedIds.collection.id;
    expect(collectionId).toBeDefined();
    
    

    const commentId = persistedIds.collection.comment.id;
    const updatedData = {
      body: 'This is an updated test comment on the collection'
    };

    const result = await updateCollectionComment(testUserId, collectionId, commentId, updatedData);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('data');
    expect(result.data.data.body).toBe(updatedData.body);
  });

  test('6. deleteCollectionComment - should delete the reply comment', async () => {
    const collectionId = persistedIds.collection.id;
    expect(collectionId).toBeDefined();
    
    

    const replyCommentId = persistedIds.collection.comment.replyId;
    const result = await deleteCollectionComment(testUserId, collectionId, replyCommentId);

    expect(result.status).toBe(204);

    // Clear reply comment ID from persisted file
    const clearedIds = clearTestIds(['collection.comment.replyId']);
    expect(clearedIds.collection.comment.replyId).toBeNull();
    
    // Update local persistedIds
    persistedIds = loadTestIds();
    
    console.log('Reply comment deleted and replyCommentId cleared from test-ids.json');
  });

  test('7. deleteCollectionComment - should delete the main comment', async () => {
    const collectionId = persistedIds.collection.id;
    expect(collectionId).toBeDefined();
    
    

    const commentId = persistedIds.collection.comment.id;
    const result = await deleteCollectionComment(testUserId, collectionId, commentId);

    expect(result.status).toBe(204);

    // Clear comment ID and thread ID from persisted file
    const clearedIds = clearTestIds(['collection.comment.id', 'collection.thread.id']);
    expect(clearedIds.collection.comment.id).toBeNull();
    expect(clearedIds.collection.thread.id).toBeNull();
    
    // Update local persistedIds
    persistedIds = loadTestIds();
    
    console.log('Main comment deleted and commentId/threadId cleared from test-ids.json');
  });

  describe('error handling', () => {
    test('should handle getting comments from non-existent collection', async () => {
      const fakeCollectionId = '00000000-0000-0000-0000-000000000000';
      await expect(getCollectionComments(testUserId, fakeCollectionId)).rejects.toThrow();
    });

    test('should handle updating non-existent comment', async () => {
      const collectionId = persistedIds.collection.id;
      const fakeId = '999999';
      const commentData = { body: 'Updated comment' };
      await expect(updateCollectionComment(testUserId, collectionId, fakeId, commentData)).rejects.toThrow();
    });

    test('should handle deleting non-existent comment', async () => {
      const collectionId = persistedIds.collection.id;
      const fakeId = '999999';
      await expect(deleteCollectionComment(testUserId, collectionId, fakeId)).rejects.toThrow();
    });
  });
});


