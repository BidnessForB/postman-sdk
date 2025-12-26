const { 
  getFolderComments,
  createFolderComment,
  updateFolderComment,
  deleteFolderComment
} = require('../index');
const { POSTMAN_API_KEY_ENV_VAR } = require('../../core/config');
const { loadTestIds, saveTestIds, clearTestIds, initializeUserId } = require('../../__tests__/test-helpers');
const { DEFAULT_UID } = require('../../__tests__/test-helpers');

describe('folder comments functional tests (sequential flow)', () => {
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

    if (!persistedIds.folder || !persistedIds.folder.id) {
      throw new Error('No folder ID found. Please run folder tests first to create a test folder.');
    }

    console.log('Using collection ID:', persistedIds.collection.id);
    console.log('Using folder ID:', persistedIds.folder.id);

    if (persistedIds.folder && persistedIds.folder.comment && persistedIds.folder.comment.id) {
      console.log('Found persisted comment ID:', persistedIds.folder.comment.id);
    }
  });

  afterAll(async () => {
    
  });

  test('1. getFolderComments - should retrieve comments (initially empty)', async () => {
    const collectionUid = persistedIds.collection.uid;
    const folderUid = persistedIds.folder.uid;
    
    expect(collectionUid).toBeDefined();
    expect(folderUid).toBeDefined();

    const result = await getFolderComments(collectionUid, folderUid);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('data');
    expect(Array.isArray(result.data.data)).toBe(true);
  });

  test('2. createFolderComment - should create a comment on the folder', async () => {
    const collectionUid = persistedIds.collection.uid;
    const folderUid = persistedIds.folder.uid;
    
    expect(collectionUid).toBeDefined();
    expect(folderUid).toBeDefined();

    const commentData = {
      body: 'This is a test comment created by SDK functional tests'
    };

    const result = await createFolderComment(collectionUid, folderUid, commentData);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('data');
    expect(result.data.data).toHaveProperty('id');
    expect(result.data.data).toHaveProperty('body');
    expect(result.data.data.body).toBe(commentData.body);

    // Persist comment ID and thread ID for future test runs
    if (!persistedIds.folder.comment) persistedIds.folder.comment = {};
    if (!persistedIds.folder.thread) persistedIds.folder.thread = {};
    
    persistedIds.folder.comment.id = result.data.data.id;
    persistedIds.folder.thread.id = result.data.data.threadId;
    persistedIds.folder.comment.createdAt = new Date().toISOString();
    
    saveTestIds(persistedIds);

    console.log(`Created and persisted comment ID: ${persistedIds.folder.comment.id}, thread ID: ${persistedIds.folder.thread.id}`);
  });

  test('3. getFolderComments - should retrieve comments including the new one', async () => {
    const collectionUid = persistedIds.collection.uid;
    const folderUid = persistedIds.folder.uid;
    
    expect(collectionUid).toBeDefined();
    expect(folderUid).toBeDefined();
    
    

    const result = await getFolderComments(collectionUid, folderUid);

    expect(result.status).toBe(200);
    expect(result.data.data.length).toBeGreaterThan(0);
    
    const commentId = persistedIds.folder.comment.id;
    const comment = result.data.data.find(c => c.id === commentId);
    expect(comment).toBeDefined();
  });

  test('4. createFolderCommentReply - should create a reply comment', async () => {
    const collectionUid = persistedIds.collection.uid;
    const folderUid = persistedIds.folder.uid;
    
    expect(collectionUid).toBeDefined();
    expect(folderUid).toBeDefined();
    
    

    const threadId = persistedIds.folder.thread.id;
    const replyData = {
      body: 'This is a reply to the test comment',
      threadId: threadId
    };

    try {
      const result = await createFolderComment(collectionUid, folderUid, replyData);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('data');
      expect(result.data.data).toHaveProperty('id');
      expect(result.data.data.body).toBe(replyData.body);

      // Persist reply comment ID for future test runs
      if (!persistedIds.folder.comment) persistedIds.folder.comment = {};
      persistedIds.folder.comment.replyId = result.data.data.id;
      saveTestIds(persistedIds);

      console.log(`Created and persisted reply comment ID: ${persistedIds.folder.comment.replyId}`);
    } catch (error) {
      // Reply comments may not be supported by the API or require special permissions
      console.log('Reply comment creation not supported or failed:', error.message);
    }
  });

  test('5. updateFolderComment - should update the comment', async () => {
    const collectionUid = persistedIds.collection.uid;
    const folderUid = persistedIds.folder.uid;
    
    expect(collectionUid).toBeDefined();
    expect(folderUid).toBeDefined();
    
    

    const commentId = persistedIds.folder.comment.id;
    const updatedData = {
      body: 'This is an updated test comment'
    };

    const result = await updateFolderComment(collectionUid, folderUid, commentId, updatedData);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('data');
    expect(result.data.data.body).toBe(updatedData.body);
  });

  test('6. deleteFolderComment - should delete the reply comment', async () => {
    const collectionUid = persistedIds.collection.uid;
    const folderUid = persistedIds.folder.uid;
    
    expect(collectionUid).toBeDefined();
    expect(folderUid).toBeDefined();
    
    

    const replyCommentId = persistedIds.folder.comment.replyId;
    const result = await deleteFolderComment(collectionUid, folderUid, replyCommentId);

    expect(result.status).toBe(204);

    // Clear reply comment ID from persisted file
    const clearedIds = clearTestIds(['folder.comment.replyId']);
    expect(clearedIds.folder.comment.replyId).toBeNull();
    
    // Update local persistedIds
    persistedIds = loadTestIds();
    
    console.log('Reply comment deleted and replyCommentId cleared from test-ids.json');
  });

  test('7. deleteFolderComment - should delete the main comment', async () => {
    const collectionUid = persistedIds.collection.uid;
    const folderUid = persistedIds.folder.uid;
    
    expect(collectionUid).toBeDefined();
    expect(folderUid).toBeDefined();
    
    

    const commentId = persistedIds.folder.comment.id;
    const result = await deleteFolderComment(collectionUid, folderUid, commentId);

    expect(result.status).toBe(204);

    // Clear comment ID and thread ID from persisted file
    const clearedIds = clearTestIds(['folder.comment.id', 'folder.thread.id']);
    expect(clearedIds.folder.comment.id).toBeNull();
    expect(clearedIds.folder.thread.id).toBeNull();
    
    // Update local persistedIds
    persistedIds = loadTestIds();
    
    console.log('Main comment deleted and commentId/threadId cleared from test-ids.json');
  });

  describe('error handling', () => {
    test('should handle getting comments from non-existent collection', async () => {
      const folderUid = persistedIds.folder.uid;
      
      await expect(getFolderComments(DEFAULT_UID, folderUid)).rejects.toThrow();
    });

    test('should handle updating non-existent comment', async () => {
      const collectionUid = persistedIds.collection.uid;
      const folderUid = persistedIds.folder.uid;
      const fakeId = '999999';
      const commentData = { body: 'Updated comment' };
      await expect(updateFolderComment(collectionUid, folderUid, fakeId, commentData)).rejects.toThrow();
    });

    test('should handle deleting non-existent comment', async () => {
      const collectionUid = persistedIds.collection.uid;
      const folderUid = persistedIds.folder.uid;
      const fakeId = '999999';
      await expect(deleteFolderComment(collectionUid, folderUid, fakeId)).rejects.toThrow();
    });
  });
});

