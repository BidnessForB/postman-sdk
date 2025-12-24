const { 
  deleteWorkspace,
  getWorkspace
} = require('../index');
const { POSTMAN_API_KEY_ENV_VAR } = require('../../core/config');
const { loadTestIds, clearTestIds } = require('../../__tests__/test-helpers');

/**
 * Manual cleanup tests for workspaces
 * 
 * These tests are intentionally separate from functional tests and can be run:
 * - Automatically: The all-tests.yml workflow runs the deleteWorkspace test at the end
 * - Manually: Run when you want to clean up test resources locally
 * 
 * To run these tests manually:
 * npx jest src/workspaces/__tests__/manual-cleanup.test.js
 * 
 * To run specific cleanup test:
 * npx jest src/workspaces/__tests__/manual-cleanup.test.js --testNamePattern="deleteWorkspace"
 */
describe('workspaces manual cleanup', () => {
  let persistedIds = {};
  
  beforeAll(() => {
    if (!process.env[POSTMAN_API_KEY_ENV_VAR]) {
      throw new Error(`${POSTMAN_API_KEY_ENV_VAR} environment variable is required`);
    }
    
    // Load previously persisted IDs from file
    persistedIds = loadTestIds();
  });

  test('deleteWorkspace - manually delete test workspace', async () => {
    // This test runs automatically at the end of the all-tests.yml workflow
    // It can also be run manually when needed
    const workspaceId = persistedIds.workspace && persistedIds.workspace.id;
    
    if (!workspaceId) {
      console.log('No workspace ID found in test-ids.json');
      return;
    }

    console.log(`Deleting workspace: ${workspaceId}`);
    
    const result = await deleteWorkspace(workspaceId);
    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('workspace');
    expect(result.data.workspace.id).toBe(workspaceId);
    
    // Clear workspace-related properties only
    clearTestIds(['workspace.id', 'workspace.name']);
    console.log('Workspace deleted and workspace properties cleared from test-ids.json');
    
    // Verify workspace is actually deleted
    await expect(getWorkspace(workspaceId)).rejects.toThrow();
  });

  test('verifyWorkspaceDeleted - verify workspace no longer exists', async () => {
    // This test can be run manually to verify the workspace was deleted
    const workspaceId = persistedIds.workspace && persistedIds.workspace.id;
    
    if (!workspaceId) {
      console.log('No workspace ID found - workspace is cleared');
      return;
    }

    // This should throw an error if workspace is deleted
    await expect(getWorkspace(workspaceId)).rejects.toThrow();
  });
});

