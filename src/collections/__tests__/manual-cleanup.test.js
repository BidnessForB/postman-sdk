const { 
  deleteCollection,
  getCollection,
  deleteFolder,
  getFolder,
  deleteCollectionComment,
  getCollectionComments,
  deleteFolderComment,
  getFolderComments
} = require('../collection');
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
  let testFolderCommentId;
  let testFolderReplyCommentId;
  let testCollectionCommentId;
  let testCollectionReplyCommentId;
  
  beforeAll(() => {
    if (!process.env[POSTMAN_API_KEY_ENV_VAR]) {
      throw new Error(`${POSTMAN_API_KEY_ENV_VAR} environment variable is required`);
    }
    
    // Load previously persisted IDs from file
    persistedIds = loadTestIds();
    testUserId = persistedIds.user && persistedIds.user.id;
    testCollectionId = persistedIds.collection && persistedIds.collection.id;
    testFolderId = persistedIds.folder && persistedIds.folder.id;
    testFolderCommentId = persistedIds.folder && persistedIds.folder.comment && persistedIds.folder.comment.id;
    testFolderReplyCommentId = persistedIds.folder && persistedIds.folder.comment && persistedIds.folder.comment.replyId;
    testCollectionCommentId = persistedIds.collection && persistedIds.collection.comment && persistedIds.collection.comment.id;
    testCollectionReplyCommentId = persistedIds.collection && persistedIds.collection.comment && persistedIds.collection.comment.replyId;
  });

  ('deleteCollectionComments - manually delete collection comments', async () => {
    
    if (!testUserId || !testCollectionId) {
      console.log('No userId or collectionId found in test-ids.json');
      return;
    }

    // Delete reply comment first (if exists)
    if (testCollectionReplyCommentId) {
      console.log(`Deleting collection reply comment: ${testCollectionReplyCommentId}`);
      const result = await deleteCollectionComment(testUserId, testCollectionId, testCollectionReplyCommentId);
      expect(result.status).toBe(204);
    }

    // Delete main comment (if exists)
    if (testCollectionCommentId) {
      console.log(`Deleting collection comment: ${testCollectionCommentId}`);
      const result = await deleteCollectionComment(testUserId, testCollectionId, testCollectionCommentId);
      expect(result.status).toBe(204);
    }
    
    // Clear comment properties only
    clearTestIds(['collection.comment.id', 'collection.comment.replyId']);
    console.log('Collection comments deleted and comment properties cleared from test-ids.json');
    
    // Verify comments are deleted
    const commentsResult = await getCollectionComments(testUserId, testCollectionId);
    const ourComments = commentsResult.data.data.filter(c => 
      c.id === testCollectionCommentId || c.id === testCollectionReplyCommentId
    );
    expect(ourComments.length).toBe(0);
  });

  ('deleteFolderComments - manually delete folder comments', async () => {
    
    if (!testUserId || !testCollectionId || !testFolderId) {
      console.log('No userId, collectionId, or folderId found in test-ids.json');
      return;
    }

    // Delete reply comment first (if exists)
    if (testFolderReplyCommentId) {
      console.log(`Deleting folder reply comment: ${testFolderReplyCommentId}`);
      const result = await deleteFolderComment(testUserId, testCollectionId, testFolderId, testFolderReplyCommentId);
      expect(result.status).toBe(204);
    }

    // Delete main comment (if exists)
    if (testFolderCommentId) {
      console.log(`Deleting folder comment: ${testFolderCommentId}`);
      const result = await deleteFolderComment(testUserId, testCollectionId, testFolderId, testFolderCommentId);
      expect(result.status).toBe(204);
    }
    
    // Clear comment properties only
    clearTestIds(['folder.comment.id', 'folder.comment.replyId']);
    console.log('Folder comments deleted and comment properties cleared from test-ids.json');
    
    // Verify comments are deleted
    const commentsResult = await getFolderComments(testUserId, testCollectionId, testFolderId);
    const ourComments = commentsResult.data.data.filter(c => 
      c.id === testFolderCommentId || c.id === testFolderReplyCommentId
    );
    expect(ourComments.length).toBe(0);
  });

  ('deleteFolder - manually delete test folder', async () => {
    // Note: There is now a functional test for deleteFolder in 02-folders-functional.test.js
    
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
    expect(result.data).toHaveProperty('data');
    expect(result.data.data.id).toBe(testFolderId);
    
    // Clear folder-related properties only
    clearTestIds(['folder.id', 'folder.name']);
    console.log('Folder deleted and folder properties cleared from test-ids.json');
    
    // Verify folder is actually deleted
    await expect(getFolder(testCollectionId, testFolderId)).rejects.toThrow();
  });

  test('deleteCollection - manually delete test collection', async () => {
    // Note: There is now a functional test for deleteCollection in 01-collections-functional.test.js
    
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
    clearTestIds(['collection.id', 'collection.name']);
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

