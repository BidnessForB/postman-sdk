const { 
  getWorkspaces, 
  createWorkspace, 
  getWorkspace, 
  updateWorkspace, 
  deleteWorkspace
} = require('../index');
const { POSTMAN_API_KEY_ENV_VAR } = require('../../core/config');
const { loadTestIds, saveTestIds, clearTestIds } = require('../../__tests__/test-helpers');

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
    // NO CLEANUP - Workspace persists for reuse across test runs
    console.log(`Test workspace ID ${testWorkspaceId} persisted for future test runs`);
    console.log(`Delete manually if needed using: await deleteWorkspace('${testWorkspaceId}')`);
  });

  test('1. createWorkspace - should create a team workspace', async () => {
    // Skip creation if workspace already exists from previous run
    if (testWorkspaceId) {
      console.log(`Using existing workspace ID from file: ${testWorkspaceId}`);
      try {
        // Verify the workspace still exists
        const result = await getWorkspace(testWorkspaceId);
        expect(result.status).toBe(200);
        expect(result.data.workspace.id).toBe(testWorkspaceId);
        console.log('Workspace verified - reusing from previous test run');
        return;
      } catch (error) {
        // Workspace no longer exists - create a new one
        console.log('Workspace from file no longer exists, creating new one');
        testWorkspaceId = null;
      }
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
    delete persistedIds.deletedAt; // Clear any previous deletion timestamp
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
    expect(result.data.workspace).toHaveProperty('description'); // Just verify it exists, not the exact value
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
    
    console.log(`Workspace ${testWorkspaceId} updated and will persist for future test runs`);
  });

  test('8. deleteWorkspace - should delete the workspace and update test-ids.json', async () => {
    // USE PERSISTED ID from test 1
    expect(testWorkspaceId).toBeDefined();
    
    const result = await deleteWorkspace(testWorkspaceId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('workspace');
    expect(result.data.workspace.id).toBe(testWorkspaceId);
    
    // Clear test IDs: Set all properties to null using shared utility
    const clearedIds = clearTestIds(persistedIds);
    expect(clearedIds.workspaceId).toBeNull();
    expect(clearedIds.workspaceName).toBeNull();
    expect(clearedIds).toHaveProperty('clearedAt');
    
    console.log('Workspace deleted and test-ids.json cleared using shared utility');
    
    // Verify workspace is actually deleted
    await expect(getWorkspace(testWorkspaceId)).rejects.toThrow();
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

  describe('manual cleanup (optional)', () => {
    test.skip('deleteWorkspace - manually delete test workspace if needed', async () => {
      // This test is skipped by default to preserve the workspace
      // Remove .skip to manually delete the workspace
      if (testWorkspaceId) {
        const result = await deleteWorkspace(testWorkspaceId);
        expect(result.status).toBe(200);
        
        // Clear the file after manual deletion
        clearTestIds();
        console.log('Workspace manually deleted and test-ids.json cleared');
      }
    });
  });
});

