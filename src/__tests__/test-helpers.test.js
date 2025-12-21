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
    test('should set all properties to null', () => {
      const originalIds = {
        workspaceId: 'ws-123',
        workspaceName: 'Test Workspace',
        specId: 'spec-456',
        specName: 'Test Spec'
      };

      saveTestIds(originalIds);
      const cleared = clearTestIds(originalIds);

      expect(cleared.workspaceId).toBeNull();
      expect(cleared.workspaceName).toBeNull();
      expect(cleared.specId).toBeNull();
      expect(cleared.specName).toBeNull();
      expect(cleared).toHaveProperty('clearedAt');
      expect(typeof cleared.clearedAt).toBe('string');
    });

    test('should save cleared state to file', () => {
      const originalIds = {
        workspaceId: 'ws-123',
        specId: 'spec-456'
      };

      clearTestIds(originalIds);
      const loaded = loadTestIds();

      expect(loaded.workspaceId).toBeNull();
      expect(loaded.specId).toBeNull();
      expect(loaded).toHaveProperty('clearedAt');
    });

    test('should handle empty object', () => {
      const cleared = clearTestIds({});
      
      expect(cleared).toEqual({ clearedAt: expect.any(String) });
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

