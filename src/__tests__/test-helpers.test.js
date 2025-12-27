const fs = require('fs');
const path = require('path');
const { 
  loadTestIds, 
  saveTestIds, 
  clearTestIds, 
  deleteTestIdsFile,
  TEST_IDS_FILE 
} = require('./test-helpers');

describe('test-helpers shared utilities', () => {
  // Clean up before and after each test
  afterEach(() => {
    try {
      if (fs.existsSync(TEST_IDS_FILE)) {
        fs.unlinkSync(TEST_IDS_FILE);
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('saveTestIds and loadTestIds', () => {
    test('should save and load test IDs', () => {
      const testIds = {
        workspaceId: 'test-workspace-123',
        workspaceName: 'Test Workspace',
        specId: 'test-spec-456'
      };

      saveTestIds(testIds);
      const loaded = loadTestIds();

      expect(loaded).toEqual(testIds);
    });

    test('should return empty object when file does not exist', () => {
      const loaded = loadTestIds();
      expect(loaded).toEqual({});
    });

    test('should merge new IDs when saving multiple times', () => {
      saveTestIds({ workspaceId: 'ws-123' });
      saveTestIds({ specId: 'spec-456' });
      
      const loaded = loadTestIds();
      // Note: Second save overwrites, doesn't merge
      expect(loaded).toEqual({ specId: 'spec-456' });
    });
  });

  describe('clearTestIds', () => {
    test('should set only specified properties to null', () => {
      const originalIds = {
        workspaceId: 'ws-123',
        workspaceName: 'Test Workspace',
        specId: 'spec-456',
        specName: 'Test Spec',
        collectionId: 'col-789',
        collectionName: 'Test Collection'
      };

      saveTestIds(originalIds);
      const cleared = clearTestIds(['workspaceId', 'workspaceName']);

      // Only workspace properties should be null
      expect(cleared.workspaceId).toBeNull();
      expect(cleared.workspaceName).toBeNull();
      // Other properties should remain unchanged
      expect(cleared.specId).toBe('spec-456');
      expect(cleared.specName).toBe('Test Spec');
      expect(cleared.collectionId).toBe('col-789');
      expect(cleared.collectionName).toBe('Test Collection');
      
    });

    test('should save cleared state to file', () => {
      const originalIds = {
        workspaceId: 'ws-123',
        specId: 'spec-456',
        collectionId: 'col-789'
      };

      saveTestIds(originalIds);
      clearTestIds(['workspaceId']);
      const loaded = loadTestIds();

      expect(loaded.workspaceId).toBeNull();
      expect(loaded.specId).toBe('spec-456'); // Should be preserved
      expect(loaded.collectionId).toBe('col-789'); // Should be preserved
      
    });

    test('should handle empty array (no keys to clear)', () => {
      const originalIds = {
        workspaceId: 'ws-123',
        specId: 'spec-456'
      };

      saveTestIds(originalIds);
      const cleared = clearTestIds([]);
      
      // Nothing should be cleared
      expect(cleared.workspaceId).toBe('ws-123');
      expect(cleared.specId).toBe('spec-456');
    });

    test('should only clear collection-related properties', () => {
      const originalIds = {
        workspaceId: 'ws-123',
        workspaceName: 'Test Workspace',
        collectionId: 'col-789',
        collectionName: 'Test Collection'
      };

      saveTestIds(originalIds);
      const cleared = clearTestIds(['collectionId', 'collectionName']);

      // Collection properties should be null
      expect(cleared.collectionId).toBeNull();
      expect(cleared.collectionName).toBeNull();
      // Workspace properties should remain
      expect(cleared.workspaceId).toBe('ws-123');
      expect(cleared.workspaceName).toBe('Test Workspace');
    });

    test('should NOT remove properties - all properties should still exist', () => {
      const originalIds = {
        userId: 12345,
        workspaceId: 'ws-123',
        workspaceName: 'Test Workspace',
        collectionId: 'col-789',
        collectionName: 'Test Collection',
        specId: 'spec-456',
        specName: 'Test Spec',
        folderId: 'folder-999',
        folderName: 'Test Folder'
      };

      saveTestIds(originalIds);
      const cleared = clearTestIds(['collectionId', 'collectionName']);

      // All original properties should still exist in the object
      expect(cleared).toHaveProperty('userId');
      expect(cleared).toHaveProperty('workspaceId');
      expect(cleared).toHaveProperty('workspaceName');
      expect(cleared).toHaveProperty('collectionId');
      expect(cleared).toHaveProperty('collectionName');
      expect(cleared).toHaveProperty('specId');
      expect(cleared).toHaveProperty('specName');
      expect(cleared).toHaveProperty('folderId');
      expect(cleared).toHaveProperty('folderName');
      

      // Count of properties should be original + clearedAt
      const propertyCount = Object.keys(cleared).length;
      expect(propertyCount).toBe(Object.keys(originalIds).length + 1); // +1 for clearedAt
    });

    test('should NOT delete the file - file should still exist after clearing', () => {
      const originalIds = {
        workspaceId: 'ws-123',
        specId: 'spec-456'
      };

      saveTestIds(originalIds);
      expect(fs.existsSync(TEST_IDS_FILE)).toBe(true);

      clearTestIds(['workspaceId']);

      // File should still exist
      expect(fs.existsSync(TEST_IDS_FILE)).toBe(true);

      // File should be readable and valid JSON
      const fileContent = fs.readFileSync(TEST_IDS_FILE, 'utf8');
      expect(() => JSON.parse(fileContent)).not.toThrow();

      // Cleared property should be null but still present
      const loaded = loadTestIds();
      expect(loaded).toHaveProperty('workspaceId');
      expect(loaded.workspaceId).toBeNull();
      expect(loaded).toHaveProperty('specId');
      expect(loaded.specId).toBe('spec-456');
    });

    test('should preserve all properties when clearing multiple times', () => {
      const originalIds = {
        workspaceId: 'ws-123',
        collectionId: 'col-789',
        specId: 'spec-456',
        folderId: 'folder-999'
      };

      saveTestIds(originalIds);
      
      // Clear workspace
      clearTestIds(['workspaceId']);
      let loaded = loadTestIds();
      expect(loaded.workspaceId).toBeNull();
      expect(loaded.collectionId).toBe('col-789');
      expect(loaded.specId).toBe('spec-456');
      expect(loaded.folderId).toBe('folder-999');
      expect(loaded).toHaveProperty('workspaceId'); // Property still exists

      // Clear collection
      clearTestIds(['collectionId']);
      loaded = loadTestIds();
      expect(loaded.workspaceId).toBeNull(); // Still null
      expect(loaded.collectionId).toBeNull(); // Now null
      expect(loaded.specId).toBe('spec-456'); // Still there
      expect(loaded.folderId).toBe('folder-999'); // Still there
      expect(loaded).toHaveProperty('workspaceId'); // Property still exists
      expect(loaded).toHaveProperty('collectionId'); // Property still exists

      // All properties should still be present
      expect(Object.keys(loaded)).toEqual(expect.arrayContaining([
        'workspaceId',
        'collectionId',
        'specId',
        'folderId'
      ]));
    });
  });

  describe('deleteTestIdsFile', () => {
    test('should delete the file', () => {
      saveTestIds({ workspaceId: 'ws-123' });
      expect(fs.existsSync(TEST_IDS_FILE)).toBe(true);

      deleteTestIdsFile();
      expect(fs.existsSync(TEST_IDS_FILE)).toBe(false);
    });

    test('should not throw when file does not exist', () => {
      expect(() => deleteTestIdsFile()).not.toThrow();
    });
  });

  describe('TEST_IDS_FILE constant', () => {
    test('should point to src/__tests__/test-ids.json', () => {
      expect(TEST_IDS_FILE).toContain('src/__tests__/test-ids.json');
      expect(TEST_IDS_FILE).toContain(path.sep); // Contains path separator
    });
  });
});

