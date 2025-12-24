const { 
  createFolder,
  getFolder,
  updateFolder,
  deleteFolder
} = require('../index');
const { POSTMAN_API_KEY_ENV_VAR } = require('../../core/config');
const { loadTestIds, saveTestIds, clearTestIds } = require('../../__tests__/test-helpers');

describe('folders functional tests (sequential flow)', () => {
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

    if (persistedIds.folder && persistedIds.folder.id) {
      console.log('Found persisted folder ID:', persistedIds.folder.id);
    }
  });

  afterAll(async () => {
    // NO CLEANUP - Folder persists indefinitely for reuse across test runs
    if (persistedIds.folder && persistedIds.folder.id) {
      console.log(`Folder ${persistedIds.folder.id} will persist for future test runs`);
      console.log(`To delete manually, run: npx jest src/collections/__tests__/manual-cleanup.test.js`);
    }
  });

  test('1. createFolder - should create a folder in the collection', async () => {
    const collectionId = persistedIds.collection.id;
  
    

    const folderName = `Test Folder ${Date.now()}`;
    const folderData = {
      name: folderName,
      description: 'Test folder created by SDK functional tests'
    };

    const result = await createFolder(collectionId, folderData);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('data');
    expect(result.data.data).toHaveProperty('id');
    expect(result.data.data).toHaveProperty('name');
    expect(result.data.data.name).toBe(folderName);

    // Persist folder IDs for future test runs
    persistedIds.folder = {
      ...persistedIds.folder,
      id: result.data.data.id,
      name: folderName,
      createdAt: new Date().toISOString()
    };
    saveTestIds(persistedIds);

    console.log(`Created and persisted folder ID: ${persistedIds.folder.id}`);
  });

  test('2. getFolder - should retrieve the folder by ID', async () => {
    const collectionId = persistedIds.collection.id;
    const folderId = persistedIds.folder.id;
    
    expect(collectionId).toBeDefined();
    expect(folderId).toBeDefined();

    const result = await getFolder(collectionId, folderId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('data');
    expect(result.data.data).toHaveProperty('id');
    expect(result.data.data.id).toBe(folderId);
    expect(result.data.data).toHaveProperty('name');
    
    // Update persisted name with current name from API if different
    if (result.data.data.name !== persistedIds.folder.name) {
      persistedIds.folder.name = result.data.data.name;
      saveTestIds(persistedIds);
    }
  });

  test('3. updateFolder - should update the folder name', async () => {
    const collectionId = persistedIds.collection.id;
    const folderId = persistedIds.folder.id;
    
    expect(collectionId).toBeDefined();
    expect(folderId).toBeDefined();

    const updatedName = `${persistedIds.folder.name} - Updated`;
    const folderData = {
      name: updatedName,
      description: 'Updated folder description'
    };

    const result = await updateFolder(collectionId, folderId, folderData);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('data');
    
    // Update persisted name
    persistedIds.folder = {
      ...persistedIds.folder,
      name: updatedName
    };
    saveTestIds(persistedIds);
  });

  test('4. getFolder - should verify folder update', async () => {
    const collectionId = persistedIds.collection.id;
    const folderId = persistedIds.folder.id;
    
    expect(collectionId).toBeDefined();
    expect(folderId).toBeDefined();

    const result = await getFolder(collectionId, folderId);

    expect(result.status).toBe(200);
    expect(result.data.data).toHaveProperty('name');
    
    // Verify the name matches what we expect (updated or original)
    expect(result.data.data.name).toBe(persistedIds.folder.name);
  });

  describe('error handling', () => {
    test('should handle creating folder in non-existent collection', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const folderData = { name: 'Test Folder' };
      await expect(createFolder(fakeId, folderData)).rejects.toThrow();
    });

    test('should handle getting non-existent folder', async () => {
      const collectionId = persistedIds.collection.id;
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await expect(getFolder(collectionId, fakeId)).rejects.toThrow();
    });

    test('should handle updating non-existent folder', async () => {
      const collectionId = persistedIds.collection.id;
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const folderData = { name: 'Updated Folder' };
      await expect(updateFolder(collectionId, fakeId, folderData)).rejects.toThrow();
    });

    test('should handle deleting non-existent folder', async () => {
      const collectionId = persistedIds.collection.id;
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await expect(deleteFolder(collectionId, fakeId)).rejects.toThrow();
    });
  });
});

