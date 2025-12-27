const { 
  getWorkspaces, 
  createWorkspace, 
  getWorkspace, 
  updateWorkspace, 
  deleteWorkspace,
  getWorkspaceTags,
  updateWorkspaceTags
} = require('../workspace');

const { loadTestIds, saveTestIds, clearTestIds } = require('../../__tests__/test-helpers');

describe('workspaces functional tests (sequential flow)', () => {
  // Persisted IDs for use across tests AND test runs
  let testWorkspaceId;
  let workspaceName;
  let updatedWorkspaceName;
  let persistedIds = {};
  
  beforeAll(() => {
    
    
    // Load previously persisted IDs from file
    persistedIds = loadTestIds();
    if (persistedIds.workspace && persistedIds.workspace.id) {
      testWorkspaceId = persistedIds.workspace.id;
      workspaceName = persistedIds.workspace.name;
      console.log(`Loaded persisted workspace ID: ${testWorkspaceId}`);
    }
  });

  afterAll(async () => {
    
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
    persistedIds.workspace = {
      ...persistedIds.workspace,
      id: testWorkspaceId,
      name: workspaceName
    };
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
    persistedIds.workspace = {
      ...persistedIds.workspace,
      name: updatedWorkspaceName
    };
    saveTestIds(persistedIds);
  });

  test('6. getWorkspace - should verify name update using persisted ID', async () => {
    // USE PERSISTED ID from test 1 and updated name from test 5
    expect(testWorkspaceId).toBeDefined();
    const ids = loadTestIds();
    const updatedWorkspaceNameFromFile = ids.workspace && ids.workspace.name;
    expect(updatedWorkspaceNameFromFile).toBeDefined();
    
    const result = await getWorkspace(testWorkspaceId);

    expect(result.status).toBe(200);
    expect(result.data.workspace.id).toBe(testWorkspaceId);
    expect(result.data.workspace.name).toBe(updatedWorkspaceNameFromFile);
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

  test('8. getWorkspaceTags - should get workspace tags (initially empty)', async () => {
    // USE PERSISTED ID from test 1
    expect(testWorkspaceId).toBeDefined();
    
    const result = await getWorkspaceTags(testWorkspaceId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('tags');
    expect(Array.isArray(result.data.tags)).toBe(true);
    // Tags may or may not exist depending on previous test runs
    console.log(`Current tags: ${result.data.tags.length} tags`);
  });

  test('9. updateWorkspaceTags - should add tags to workspace', async () => {
    // USE PERSISTED ID from test 1
    expect(testWorkspaceId).toBeDefined();
    
    const tags = [
      { slug: 'sdk-test' },
      { slug: 'automated' }
    ];
    
    const result = await updateWorkspaceTags(testWorkspaceId, tags);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('tags');
    expect(Array.isArray(result.data.tags)).toBe(true);
    expect(result.data.tags).toHaveLength(2);
    expect(result.data.tags[0]).toHaveProperty('slug');
    expect(result.data.tags[1]).toHaveProperty('slug');
    
    // Verify the tags match what we sent
    const slugs = result.data.tags.map(t => t.slug);
    expect(slugs).toContain('sdk-test');
    expect(slugs).toContain('automated');
  });

  test('10. getWorkspaceTags - should verify tags were added', async () => {
    // USE PERSISTED ID from test 1
    expect(testWorkspaceId).toBeDefined();
    
    const result = await getWorkspaceTags(testWorkspaceId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('tags');
    expect(result.data.tags).toHaveLength(2);
    
    const slugs = result.data.tags.map(t => t.slug);
    expect(slugs).toContain('sdk-test');
    expect(slugs).toContain('automated');
  });

  test('11. updateWorkspaceTags - should replace existing tags', async () => {
    // USE PERSISTED ID from test 1
    expect(testWorkspaceId).toBeDefined();
    
    const tags = [
      { slug: 'sdk-test' },
      { slug: 'api-testing' },
      { slug: 'v2' }
    ];
    
    const result = await updateWorkspaceTags(testWorkspaceId, tags);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('tags');
    expect(result.data.tags).toHaveLength(3);
    
    const slugs = result.data.tags.map(t => t.slug);
    expect(slugs).toContain('sdk-test');
    expect(slugs).toContain('api-testing');
    expect(slugs).toContain('v2');
    // Old tags should be gone
    
    expect(slugs).not.toContain('automated');
  });

  test('12. updateWorkspaceTags - should clear all tags with empty array', async () => {
    // USE PERSISTED ID from test 1
    expect(testWorkspaceId).toBeDefined();
    
    const result = await updateWorkspaceTags(testWorkspaceId, []);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('tags');
    expect(result.data.tags).toHaveLength(0);
  });

  test('13. getWorkspaceTags - should verify tags were cleared', async () => {
    // USE PERSISTED ID from test 1
    expect(testWorkspaceId).toBeDefined();
    
    const result = await getWorkspaceTags(testWorkspaceId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('tags');
    expect(result.data.tags).toHaveLength(0);
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

    test('should handle getting tags for non-existent workspace', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await expect(getWorkspaceTags(fakeId)).rejects.toThrow();
    });

    test('should handle updating tags for non-existent workspace', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await expect(
        updateWorkspaceTags(fakeId, [{ slug: 'test' }])
      ).rejects.toThrow();
    });
  });
});

