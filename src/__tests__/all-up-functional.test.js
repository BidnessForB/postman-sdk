/**
 * All-Up Functional Test Suite
 * 
 * This test suite orchestrates all functional tests in the proper dependency order.
 * It ensures that resources are created and tested in the correct sequence:
 * 
 * 1. Workspaces - Create/test the workspace that will contain all other resources
 * 2. Collections - Create/test a collection within the workspace
 * 3. Collection Comments - Create/test comments on the collection
 * 4. Folders - Create/test a folder within the collection
 * 5. Folder Comments - Create/test comments on the folder
 * 6. Specs - Create/test API specs within the workspace
 * 
 * Run this test with:
 *   npx jest src/__tests__/all-up-functional.test.js
 * 
 * Note: This test creates real resources via the Postman API and persists their IDs 
 * to test-ids.json for reuse across test runs. Resources are NOT automatically 
 * deleted after the test completes.
 */

const { POSTMAN_API_KEY_ENV_VAR } = require('../core/config');

describe('All-Up Functional Test Suite', () => {
  beforeAll(() => {
    if (!process.env[POSTMAN_API_KEY_ENV_VAR]) {
      throw new Error(`${POSTMAN_API_KEY_ENV_VAR} environment variable is required for functional tests`);
    }
    
    console.log('\n========================================');
    console.log('Starting All-Up Functional Test Suite');
    console.log('========================================\n');
  });

  afterAll(() => {
    console.log('\n========================================');
    console.log('All-Up Functional Test Suite Complete');
    console.log('========================================\n');
  });

  describe('Phase 1: Workspaces', () => {
    const workspaceTests = require('../workspaces/__tests__/functional.test');
    // Tests are automatically executed when the module is required
  });

  describe('Phase 2: Collections', () => {
    const collectionTests = require('../collections/__tests__/01-collections-functional.test');
    // Tests are automatically executed when the module is required
  });

  describe('Phase 3: Collection Comments', () => {
    const collectionCommentTests = require('../collections/__tests__/04-collection-comments-functional.test');
    // Tests are automatically executed when the module is required
  });

  describe('Phase 4: Folders', () => {
    const folderTests = require('../collections/__tests__/02-folders-functional.test');
    // Tests are automatically executed when the module is required
  });

  describe('Phase 5: Folder Comments', () => {
    const folderCommentTests = require('../collections/__tests__/03-folder-comments-functional.test');
    // Tests are automatically executed when the module is required
  });

  describe('Phase 6: Specs', () => {
    const specTests = require('../specs/__tests__/functional.test');
    // Tests are automatically executed when the module is required
  });
});

