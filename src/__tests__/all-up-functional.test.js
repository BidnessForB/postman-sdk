/**
 * All-Up Functional Test Suite
 * 
 * This test suite orchestrates all functional tests in the proper dependency order.
 * It ensures that resources are created and tested in the correct sequence:
 * 
 * 1. Workspaces - Create/test the workspace that will contain all other resources
 * 2. Groups - Test team groups (read-only access)
 * 3. Environments - Create/test environments within the workspace
 * 4. Collections - Create/test a collection within the workspace
 * 5. Collection Comments - Create/test comments on the collection
 * 5a. Collection Roles - Get/test collection roles
 * 6. Folders - Create/test a folder within the collection
 * 7. Folder Comments - Create/test comments on the folder
 * 8. Requests - Create/test requests within the collection and folders
 * 9. Responses - Create/test responses on the requests
 * 10. Mocks - Create/test mock servers for the collection
 * 11. Specs - Create/test API specs within the workspace
 * 12. Transformations - Test bi-directional sync between specs and collections
 * 13. Tags - Test tagging and entity retrieval by tag
 * 
 * Run this test with:
 *   npx jest src/__tests__/all-up-functional.test.js
 * 
 * Note: This test creates real resources via the Postman API and persists their IDs 
 * to test-ids.json for reuse across test runs. Resources are NOT automatically 
 * deleted after the test completes.
 */



describe('All-Up Functional Test Suite', () => {
  beforeAll(() => {
    
    
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
    const workspaceTests = require('../workspaces/__tests__/workspaces-functional.test');
    // Tests are automatically executed when the module is required
  });

  describe('Phase 2: Groups', () => {
    const groupTests = require('../groups/__tests__/groups-functional.test');
    // Tests are automatically executed when the module is required
  });

  describe('Phase 3: Environments', () => {
    const environmentTests = require('../environments/__tests__/environments-functional.test');
    // Tests are automatically executed when the module is required
  });
  
  
  describe('Phase 4: Collections', () => {
    const collectionTests = require('../collections/__tests__/01-collections-functional.test');
    // Tests are automatically executed when the module is required
  });

  describe('Phase 5: Collection Comments', () => {
    const collectionCommentTests = require('../collections/__tests__/04-collection-comments-functional.test');
    // Tests are automatically executed when the module is required
  });

  describe('Phase 5a: Collection Roles', () => {
    const collectionRolesTests = require('../collections/__tests__/06-collection-roles-functional.test');
    // Tests are automatically executed when the module is required
  });

  describe('Phase 6: Folders', () => {
    const folderTests = require('../collections/__tests__/02-folders-functional.test');
    // Tests are automatically executed when the module is required
  });

  describe('Phase 7: Folder Comments', () => {
    const folderCommentTests = require('../collections/__tests__/03-folder-comments-functional.test');
    // Tests are automatically executed when the module is required
  });

  describe('Phase 8: Requests', () => {
    const requestTests = require('../requests/__tests__/requests-functional.test');
    // Tests are automatically executed when the module is required
  });

  describe('Phase 9: Responses', () => {
    const responseTests = require('../responses/__tests__/responses-functional.test');
    // Tests are automatically executed when the module is required
  });

  describe('Phase 10: Mocks', () => {
    const mockTests = require('../mocks/__tests__/mocks-functional.test');
    // Tests are automatically executed when the module is required
  });

  describe('Phase 11: Specs', () => {
    const specTests = require('../specs/__tests__/specs-functional.test');
    // Tests are automatically executed when the module is required
  });

  describe('Phase 12: Transformations', () => {
    const transformationTests = require('../transformations/__tests__/transformations-functional.test');
    // Tests are automatically executed when the module is required
  });

  describe('Phase 13: Tags', () => {
    const tagsTests = require('../tags/__tests__/tags-functional.test');
    // Tests are automatically executed when the module is required
  });

  describe('Phase 14: Forks - Collections', () => {
    const forksTests = require('../forks/__tests__/forks-collections-functional.test');
    // Tests are automatically executed when the module is required
  });

  describe('Phase 15: Forks - Environments', () => {
    const forksTests = require('../forks/__tests__/forks-environment-functional.test');
    // Tests are automatically executed when the module is required
  });

  describe('Phase 16: Pull Requests - Collections', () => {
    const forksTests = require('../pullRequests/__tests__/prs-collections-functional.test');
    // Tests are automatically executed when the module is required
  });
  
});

