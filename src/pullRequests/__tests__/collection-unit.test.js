/**
 * Pull Requests All-Up Test Suite
 * 
 * This test suite orchestrates all pull request tests in the proper order:
 * 
 * Phase 1: Collection Unit Tests - Unit tests for collection pull request functions
 * Phase 2: Pull Request Unit Tests - Unit tests for pull request management functions  
 * Phase 3: Collection Functional Tests - Functional tests for creating PRs from forks
 * Phase 4: Pull Request Functional Tests - Functional tests for PR management operations
 * 
 * Run this test with:
 *   npx jest src/pullRequests/__tests__/all-up.test.js
 * 
 * Note: Functional tests create real resources via the Postman API and persist their IDs 
 * to test-ids.json for reuse across test runs. Resources are NOT automatically 
 * deleted after the test completes.
 */



describe('Pull Requests Collection Unit Test Suite', () => {
  beforeAll(() => {
    
    console.log('\n========================================');
    console.log('Starting Pull Requests All-Up Test Suite');
    console.log('========================================\n');
  });

  afterAll(() => {
    console.log('\n========================================');
    console.log('Pull Requests All-Up Test Suite Complete');
    console.log('========================================\n');
  });

  
  /* describe('Clear Mocks Before Functional Tests', () => {
    beforeAll(() => {
      // Unmock the config module so functional tests use real API key
      jest.unmock('../../core/config');
      jest.unmock('../../../core/config');
      
      // Clear module cache to force re-import with real values
      jest.resetModules();
      
      console.log('✓ Cleared mocks - functional tests will use real API key');
    });
  });
  */

  describe('Phase 1: Collection Pull Unit Tests', () => {
    const collectionUnitTests = require('./collections/unit.test');
    // Tests are automatically executed when the module is required
  });

  
});

 
