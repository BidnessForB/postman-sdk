const { 
  createFolder,
  getFolder,
  updateFolder,
  deleteFolder
} = require('../index');
const { POSTMAN_API_KEY_ENV_VAR } = require('../../core/config');
const { loadTestIds, saveTestIds, clearTestIds } = require('../../__tests__/test-helpers');

describe('folders functional tests (sequential flow)', () => {
  let testCollectionId;
  let testFolderId;
  let testFolderName;
  let persistedIds = {};

  beforeAll(async () => {
    if (!process.env[POSTMAN_API_KEY_ENV_VAR]) {
      throw new Error(`${POSTMAN_API_KEY_ENV_VAR} environment variable is required for functional tests`);
    }

    persistedIds = loadTestIds();
    testCollectionId = persistedIds.collectionId || null;
    testFolderId = persistedIds.folderId || null;
    testFolderName = persistedIds.folderName || null;

    if (!testCollectionId) {
      throw new Error('No collection ID found. Please run collection tests first to create a test collection.');
    }

    console.log('Using collection ID:', testCollectionId);

    if (testFolderId) {
      console.log('Found persisted folder ID:', testFolderId);
    }
  });

  afterAll(async () => {
    // NO CLEANUP - Folder persists indefinitely for reuse across test runs
    if (testFolderId) {
      console.log(`Folder ${testFolderId} will persist for future test runs`);
      console.log(`To delete manually, run: npx jest src/collections/__tests__/manual-cleanup.test.js`);
    }
  });

  test('1. createFolder - should create a folder in the collection', async () => {
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

  test('2. getFolder - should retrieve the folder by ID', async () => {
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

  test('3. updateFolder - should update the folder name', async () => {
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
    // Update test-ids.json with new folder name after update
    const persisted = loadTestIds();
    saveTestIds({
      ...persisted,
      folderName: updatedName
    });
    testFolderName = updatedName;
  });

  test('4. getFolder - should verify folder update', async () => {
    expect(testCollectionId).toBeDefined();
    expect(testFolderId).toBeDefined();

    const result = await getFolder(testCollectionId, testFolderId);

    expect(result.status).toBe(200);
    expect(result.data.data).toHaveProperty('name');
    
    // Verify the name matches what we expect (updated or original)
    expect(result.data.data.name).toBe(testFolderName);
  });

  describe('error handling', () => {
    test('should handle creating folder in non-existent collection', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const folderData = { name: 'Test Folder' };
      await expect(createFolder(fakeId, folderData)).rejects.toThrow();
    });

    test('should handle getting non-existent folder', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await expect(getFolder(testCollectionId, fakeId)).rejects.toThrow();
    });

    test('should handle updating non-existent folder', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const folderData = { name: 'Updated Folder' };
      await expect(updateFolder(testCollectionId, fakeId, folderData)).rejects.toThrow();
    });

    test('should handle deleting non-existent folder', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await expect(deleteFolder(testCollectionId, fakeId)).rejects.toThrow();
    });
  });
});

