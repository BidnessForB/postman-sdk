const fs = require('fs');
const path = require('path');
const { 
  getWorkspaces, 
  createWorkspace, 
  getWorkspace, 
  updateWorkspace, 
  deleteWorkspace
} = require('../index');
const { POSTMAN_API_KEY_ENV_VAR } = require('../../core/config');

// File to persist test IDs across test runs
const TEST_IDS_FILE = path.join(__dirname, 'test-ids.json');

/**
 * Load persisted test IDs from file
 */
function loadTestIds() {
  try {
    if (fs.existsSync(TEST_IDS_FILE)) {
      const data = fs.readFileSync(TEST_IDS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.log('No existing test IDs file found, will create new resources');
  }
  return {};
}

/**
 * Save test IDs to file for reuse across test runs
 */
function saveTestIds(ids) {
  try {
    fs.writeFileSync(TEST_IDS_FILE, JSON.stringify(ids, null, 2), 'utf8');
    console.log(`Test IDs saved to ${TEST_IDS_FILE}`);
  } catch (error) {
    console.error('Failed to save test IDs:', error);
  }
}

/**
 * Clear the test IDs file
 */
function clearTestIds() {
  try {
    if (fs.existsSync(TEST_IDS_FILE)) {
      fs.unlinkSync(TEST_IDS_FILE);
      console.log('Test IDs file cleared');
    }
  } catch (error) {
    console.error('Failed to clear test IDs:', error);
  }
}

describe('workspaces functional tests (sequential flow)', () => {
  // Persisted IDs for use across tests AND test runs
  let testWorkspaceId;
  let workspaceName;
  let updatedWorkspaceName;
  let persistedIds = {};
  
  beforeAll(() => {
    if (!process.env[POSTMAN_API_KEY_ENV_VAR]) {
      throw new Error(`${POSTMAN_API_KEY_ENV_VAR} environment variable is required for functional tests`);
    }
    
    // Load previously persisted IDs from file
    persistedIds = loadTestIds();
    if (persistedIds.workspaceId) {
      testWorkspaceId = persistedIds.workspaceId;
      workspaceName = persistedIds.workspaceName;
      console.log(`Loaded persisted workspace ID: ${testWorkspaceId}`);
    }
  });

  afterAll(async () => {
    // Clean up the created workspace if it still exists AND was not deleted in tests
    // NOTE: We do NOT clear the test-ids.json file here - it persists for reuse
    if (testWorkspaceId) {
      try {
        await deleteWorkspace(testWorkspaceId);
        console.log('Workspace cleaned up in afterAll hook');
        // DO NOT clear the file - let it persist for future runs
      } catch (error) {
        // Ignore cleanup errors - workspace may have been deleted in tests
        console.log('Cleanup error (workspace may already be deleted):', error.message);
      }
    } else {
      console.log('No workspace to clean up (already deleted in tests)');
    }
  });

  test('1. createWorkspace - should create a team workspace', async () => {
    // Skip creation if workspace already exists from previous run
    if (testWorkspaceId) {
      console.log(`Using existing workspace ID from file: ${testWorkspaceId}`);
      // Verify the workspace still exists
      const result = await getWorkspace(testWorkspaceId);
      expect(result.status).toBe(200);
      expect(result.data.workspace.id).toBe(testWorkspaceId);
      return;
    }

    workspaceName = `SDK Test Workspace ${Date.now()}`;
    
    const result = await createWorkspace(
      workspaceName, 
      'team', 
      'Test workspace created by SDK', 
      'SDK functional test'
    );

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('workspace');
    expect(result.data.workspace).toHaveProperty('id');
    expect(result.data.workspace).toHaveProperty('name');
    expect(result.data.workspace.name).toBe(workspaceName);

    // PERSIST ID: Save the workspace ID to memory for use in all subsequent tests
    testWorkspaceId = result.data.workspace.id;
    
    // PERSIST ID TO FILE: Save to file for reuse across test runs
    persistedIds.workspaceId = testWorkspaceId;
    persistedIds.workspaceName = workspaceName;
    persistedIds.createdAt = new Date().toISOString();
    saveTestIds(persistedIds);
    
    // Verify ID was persisted
    expect(testWorkspaceId).toBeDefined();
    expect(typeof testWorkspaceId).toBe('string');
  });

  test('2. getWorkspace - should retrieve the workspace by persisted ID', async () => {
    // USE PERSISTED ID from test 1
    expect(testWorkspaceId).toBeDefined();
    
    const result = await getWorkspace(testWorkspaceId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('workspace');
    expect(result.data.workspace.id).toBe(testWorkspaceId);
    expect(result.data.workspace.name).toBe(workspaceName);
    expect(result.data.workspace.type).toBe('team');
    expect(result.data.workspace.description).toBe('Test workspace created by SDK');
  });

  test('3. getWorkspaces - should list workspaces and include our workspace', async () => {
    // USE PERSISTED ID from test 1 to verify it's in the list
    expect(testWorkspaceId).toBeDefined();
    
    const result = await getWorkspaces();

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('workspaces');
    expect(Array.isArray(result.data.workspaces)).toBe(true);
    
    // Verify our test workspace (using persisted ID) is in the list
    const ourWorkspace = result.data.workspaces.find(w => w.id === testWorkspaceId);
    expect(ourWorkspace).toBeDefined();
    expect(ourWorkspace.name).toBe(workspaceName);
  });

  test('4. getWorkspaces (filtered) - should filter workspaces by type', async () => {
    // USE PERSISTED ID to verify our workspace appears in filtered results
    expect(testWorkspaceId).toBeDefined();
    
    const result = await getWorkspaces('team');

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('workspaces');
    expect(Array.isArray(result.data.workspaces)).toBe(true);
    
    // All returned workspaces should be team workspaces
    if (result.data.workspaces.length > 0) {
      result.data.workspaces.forEach(workspace => {
        expect(workspace.type).toBe('team');
      });
    }
    
    // Verify our workspace is in the filtered list
    const ourWorkspace = result.data.workspaces.find(w => w.id === testWorkspaceId);
    expect(ourWorkspace).toBeDefined();
  });

  test('5. updateWorkspace - should update workspace name using persisted ID', async () => {
    // USE PERSISTED ID from test 1
    expect(testWorkspaceId).toBeDefined();
    
    updatedWorkspaceName = `Updated Workspace Name ${Date.now()}`;
    const result = await updateWorkspace(testWorkspaceId, updatedWorkspaceName);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('workspace');
    expect(result.data.workspace.id).toBe(testWorkspaceId);
    expect(result.data.workspace.name).toBe(updatedWorkspaceName);
    
    // PERSIST UPDATED NAME TO FILE: Save updated name for subsequent test runs
    persistedIds.workspaceName = updatedWorkspaceName;
    persistedIds.updatedAt = new Date().toISOString();
    saveTestIds(persistedIds);
  });

  test('6. getWorkspace - should verify name update using persisted ID', async () => {
    // USE PERSISTED ID from test 1 and updated name from test 5
    expect(testWorkspaceId).toBeDefined();
    expect(updatedWorkspaceName).toBeDefined();
    
    const result = await getWorkspace(testWorkspaceId);

    expect(result.status).toBe(200);
    expect(result.data.workspace.id).toBe(testWorkspaceId);
    expect(result.data.workspace.name).toBe(updatedWorkspaceName);
  });

  test('7. updateWorkspace - should update workspace description', async () => {
    // USE PERSISTED ID from test 1
    expect(testWorkspaceId).toBeDefined();
    
    const newDescription = 'Updated description for SDK test';
    const result = await updateWorkspace(testWorkspaceId, null, null, newDescription);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('workspace');
    expect(result.data.workspace.id).toBe(testWorkspaceId);
  });

  test('8. deleteWorkspace - should delete workspace using persisted ID', async () => {
    // USE PERSISTED ID from test 1
    expect(testWorkspaceId).toBeDefined();
    
    const result = await deleteWorkspace(testWorkspaceId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('workspace');
    expect(result.data.workspace.id).toBe(testWorkspaceId);

    // Clear the persisted ID so afterAll doesn't try to delete it again
    testWorkspaceId = null;
  });

  describe('error handling', () => {
    test('should handle getting non-existent workspace', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await expect(getWorkspace(fakeId)).rejects.toThrow();
    });

    test('should handle updating non-existent workspace', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await expect(updateWorkspace(fakeId, 'New Name')).rejects.toThrow();
    });

    test('should handle deleting non-existent workspace', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await expect(deleteWorkspace(fakeId)).rejects.toThrow();
    });

    test('should handle creating workspace with invalid type', async () => {
      await expect(
        createWorkspace('Invalid Workspace', 'invalid-type')
      ).rejects.toThrow();
    });
  });
});

