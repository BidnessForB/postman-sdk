const { 
  deleteSpec,
  getSpec
} = require('../index');
const { POSTMAN_API_KEY_ENV_VAR } = require('../../core/config');
const { loadTestIds, clearTestIds } = require('../../__tests__/test-helpers');

/**
 * Manual cleanup tests for specs
 * 
 * These tests are intentionally separate from functional tests and should be run manually
 * when you want to clean up test resources. They are skipped by default.
 * 
 * To run these tests:
 * 1. Remove .skip from the test you want to run
 * 2. Run: npx jest src/specs/__tests__/manual-cleanup.test.js
 */
describe('specs manual cleanup', () => {
  let persistedIds = {};
  let testSpecId;
  
  beforeAll(() => {
    if (!process.env[POSTMAN_API_KEY_ENV_VAR]) {
      throw new Error(`${POSTMAN_API_KEY_ENV_VAR} environment variable is required`);
    }
    
    // Load previously persisted IDs from file
    persistedIds = loadTestIds();
    testSpecId = persistedIds.spec && persistedIds.spec.id;
  });

  test('deleteSpec - manually delete test spec', async () => {
    // This test is skipped by default to preserve the spec
    // Remove .skip to manually delete the spec
    
    if (!(testSpecId && persistedIds.spec && persistedIds.spec.id)) {
      console.log('No specId found in test-ids.json');
      return;
    }

    console.log(`Deleting spec: ${testSpecId}`);
    
    const result = await deleteSpec(testSpecId);
    expect(result.status).toBe(204);
    
    // Clear spec-related properties only
    const clearedIds = clearTestIds(['spec.id', 'spec.name']);
    expect(clearedIds.spec.id).toBeNull();
    expect(clearedIds.spec.name).toBeNull();
    
    console.log('Spec deleted and spec properties cleared from test-ids.json');
    
    // Verify spec is actually deleted
    await expect(getSpec(testSpecId)).rejects.toThrow();
  });

  test.skip('verifySpecDeleted - verify spec no longer exists', async () => {
    // Remove .skip to verify the spec was deleted
    
    if (!testSpecId) {
      console.log('No specId found - spec is cleared');
      return;
    }

    // This should throw an error if spec is deleted
    await expect(getSpec(testSpecId)).rejects.toThrow();
  });
});

