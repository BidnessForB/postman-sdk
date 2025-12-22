const { 
  deleteCollection,
  getCollection,
  deleteFolder,
  getFolder,
  deleteFolderComment,
  getFolderComments
} = require('../index');
const { POSTMAN_API_KEY_ENV_VAR } = require('../../core/config');
const { loadTestIds, clearTestIds } = require('../../__tests__/test-helpers');

/**
 * Manual cleanup tests for collections
 * 
 * These tests are intentionally separate from functional tests and should be run manually
 * when you want to clean up test resources. They are skipped by default.
 * 
 * To run these tests:
 
 * 2. Run: npx jest src/collections/__tests__/manual-cleanup.test.js
 * 
 * Cleanup order:
 * 1. Delete comments first (if any)
 * 2. Delete folders second (if any)
 * 3. Delete collection last
 */
describe('collections manual cleanup', () => {
  let persistedIds = {};
  let testUserId;
  let testCollectionId;
  let testFolderId;
  let testCommentId;
  let testReplyCommentId;
  
  beforeAll(() => {
    if (!process.env[POSTMAN_API_KEY_ENV_VAR]) {
      throw new Error(`${POSTMAN_API_KEY_ENV_VAR} environment variable is required`);
    }
    
    // Load previously persisted IDs from file
    persistedIds = loadTestIds();
    testUserId = persistedIds.userId;
    testCollectionId = persistedIds.collectionId;
    testFolderId = persistedIds.folderId;
    testCommentId = persistedIds.commentId;
    testReplyCommentId = persistedIds.replyCommentId;
  });

  ('deleteFolderComments - manually delete folder comments', async () => {
    
    if (!testUserId || !testCollectionId || !testFolderId) {
      console.log('No userId, collectionId, or folderId found in test-ids.json');
      return;
    }

    // Delete reply comment first (if exists)
    if (testReplyCommentId) {
      console.log(`Deleting reply comment: ${testReplyCommentId}`);
      const result = await deleteFolderComment(testUserId, testCollectionId, testFolderId, testReplyCommentId);
      expect(result.status).toBe(200);
    }

    // Delete main comment (if exists)
    if (testCommentId) {
      console.log(`Deleting comment: ${testCommentId}`);
      const result = await deleteFolderComment(testUserId, testCollectionId, testFolderId, testCommentId);
      expect(result.status).toBe(200);
    }
    
    // Clear comment properties only
    clearTestIds(['commentId', 'replyCommentId']);
    console.log('Comments deleted and comment properties cleared from test-ids.json');
    
    // Verify comments are deleted (should return empty array)
    const commentsResult = await getFolderComments(testUserId, testCollectionId, testFolderId);
    expect(commentsResult.data.data).toEqual([]);
  });

  ('deleteFolder - manually delete test folder', async () => {
    
    
    if (!testCollectionId) {
      console.log('No collectionId found in test-ids.json');
      return;
    }

    if (!testFolderId) {
      console.log('No folderId found in test-ids.json');
      return;
    }

    console.log(`Deleting folder: ${testFolderId}`);
    
    const result = await deleteFolder(testCollectionId, testFolderId);
    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('folder');
    expect(result.data.folder.id).toBe(testFolderId);
    
    // Clear folder-related properties only
    clearTestIds(['folderId', 'folderName']);
    console.log('Folder deleted and folder properties cleared from test-ids.json');
    
    // Verify folder is actually deleted
    await expect(getFolder(testCollectionId, testFolderId)).rejects.toThrow();
  });

  test('deleteCollection - manually delete test collection', async () => {
    
    
    if (!testCollectionId) {
      console.log('No collectionId found in test-ids.json');
      return;
    }

    console.log(`Deleting collection: ${testCollectionId}`);
    
    const result = await deleteCollection(testCollectionId);
    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('collection');
    expect(result.data.collection.id).toBe(testCollectionId);
    
    // Clear collection-related properties only
    clearTestIds(['collectionId', 'collectionName']);
    console.log('Collection deleted and collection properties cleared from test-ids.json');
    
    // Verify collection is actually deleted
    await expect(getCollection(testCollectionId)).rejects.toThrow();
  });

  ('verifyCollectionDeleted - verify collection no longer exists', async () => {
    // Remove .skip to verify the collection was deleted
    
    if (!testCollectionId) {
      console.log('No collectionId found - collection is cleared');
      return;
    }

    // This should throw an error if collection is deleted
    await expect(getCollection(testCollectionId)).rejects.toThrow();
  });
});

