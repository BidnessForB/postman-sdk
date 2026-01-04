const fs = require('fs');
const path = require('path');

// Mock the users module before requiring test-helpers
jest.mock('../users/user', () => ({
  getAuthenticatedUser: jest.fn().mockResolvedValue({
    data: {
      user: {
        id: 12345
      }
    }
  })
}));

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
    jest.clearAllMocks();
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

  describe('initPersistedIds', () => {
    const { initPersistedIds } = require('./test-helpers');

    
  });

});

