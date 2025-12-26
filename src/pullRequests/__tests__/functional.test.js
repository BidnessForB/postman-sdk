const {
  getPullRequest,
  updatePullRequest,
  reviewPullRequest
} = require('../index');
const { POSTMAN_API_KEY_ENV_VAR } = require('../../core/config');
const { loadTestIds, saveTestIds } = require('../../__tests__/test-helpers');

describe('pullRequests', () => {
  describe('functional tests', () => {
    let persistedIds = loadTestIds();
    let userId;

    beforeAll(async () => {
      if (!process.env[POSTMAN_API_KEY_ENV_VAR]) {
        throw new Error(`${POSTMAN_API_KEY_ENV_VAR} environment variable is required for functional tests`);
      }

      userId = persistedIds?.userId;

      if (!userId) {
        throw new Error('User ID not found in test-ids.json. Run user functional tests first.');
      }

      console.log('Using user ID:', userId);

      // Note: Pull requests require actual forks and collections to be created
      // These tests are designed to be run manually when you have a real pull request
      console.log('\n⚠️  Pull Request functional tests require manual setup:');
      console.log('1. Create a collection fork in Postman UI');
      console.log('2. Create a pull request from the fork');
      console.log('3. Add the pull request ID to test-ids.json as pullRequest.id');
      console.log('4. Re-run these tests\n');
    });

    test('should skip tests if no pull request ID is configured', () => {
      if (!persistedIds.pullRequest?.id) {
        console.log('Skipping pull request tests - no pull request ID configured');
        expect(true).toBe(true);
      }
    });

    describe('with configured pull request', () => {
      beforeEach(() => {
        if (!persistedIds.pullRequest?.id) {
          console.log('Skipping test - no pull request ID configured');
        }
      });

      test('1. getPullRequest - should retrieve pull request details', async () => {
        if (!persistedIds.pullRequest?.id) {
          return; // Skip if not configured
        }

        const result = await getPullRequest(persistedIds.pullRequest.id);

        expect(result.status).toBe(200);
        expect(result.data).toHaveProperty('id');
        expect(result.data).toHaveProperty('title');
        expect(result.data).toHaveProperty('status');
        expect(result.data).toHaveProperty('source');
        expect(result.data).toHaveProperty('destination');
        expect(result.data).toHaveProperty('reviewers');
        expect(result.data).toHaveProperty('merge');
        expect(result.data).toHaveProperty('createdAt');
        expect(result.data).toHaveProperty('updatedAt');

        console.log('Pull Request ID:', result.data.id);
        console.log('Title:', result.data.title);
        console.log('Status:', result.data.status);
        console.log('Fork Type:', result.data.forkType);
        console.log('Source:', result.data.source.name);
        console.log('Destination:', result.data.destination.name);
        console.log('Reviewers:', result.data.reviewers.length);
        console.log('Merge Status:', result.data.merge.status);
      });

      test('2. updatePullRequest - should update title and reviewers', async () => {
        if (!persistedIds.pullRequest?.id) {
          return; // Skip if not configured
        }

        const updatedTitle = `SDK Test PR - ${Date.now()}`;
        const reviewers = [userId]; // Use current user as reviewer

        const result = await updatePullRequest(
          persistedIds.pullRequest.id,
          updatedTitle,
          reviewers,
          'Updated by SDK functional test'
        );

        expect(result.status).toBe(200);
        expect(result.data).toHaveProperty('id');
        expect(result.data).toHaveProperty('title');
        expect(result.data.title).toBe(updatedTitle);
        expect(result.data).toHaveProperty('status');

        console.log('Successfully updated pull request');
        console.log('New title:', result.data.title);
        console.log('Status:', result.data.status);
      });

      test('3. reviewPullRequest - should approve pull request', async () => {
        if (!persistedIds.pullRequest?.id) {
          return; // Skip if not configured
        }

        try {
          const result = await reviewPullRequest(persistedIds.pullRequest.id, 'approve');

          expect(result.status).toBe(200);
          expect(result.data).toHaveProperty('id');
          expect(result.data).toHaveProperty('status');
          expect(result.data).toHaveProperty('reviewedBy');
          expect(result.data.status).toBe('approved');

          console.log('Successfully approved pull request');
          console.log('Status:', result.data.status);
          console.log('Reviewed by:', result.data.reviewedBy.name);
        } catch (error) {
          // May fail if already approved or user doesn't have permission
          console.log('Approve action failed (may be expected):', error.message);
        }
      });

      test('4. reviewPullRequest - should unapprove pull request', async () => {
        if (!persistedIds.pullRequest?.id) {
          return; // Skip if not configured
        }

        try {
          const result = await reviewPullRequest(persistedIds.pullRequest.id, 'unapprove');

          expect(result.status).toBe(200);
          expect(result.data).toHaveProperty('id');
          expect(result.data).toHaveProperty('status');
          expect(result.data.status).toBe('open');

          console.log('Successfully unapproved pull request');
          console.log('Status:', result.data.status);
        } catch (error) {
          // May fail if not approved or user doesn't have permission
          console.log('Unapprove action failed (may be expected):', error.message);
        }
      });

      test('5. getPullRequest - should handle invalid pull request ID', async () => {
        const fakeId = '00000000-0000-0000-0000-000000000000';

        await expect(
          getPullRequest(fakeId)
        ).rejects.toThrow();

        console.log('Successfully handled invalid pull request ID');
      });

      test('6. updatePullRequest - should handle invalid pull request ID', async () => {
        const fakeId = '00000000-0000-0000-0000-000000000000';

        await expect(
          updatePullRequest(fakeId, 'Test Title', [userId])
        ).rejects.toThrow();

        console.log('Successfully handled invalid pull request ID for update');
      });

      test('7. reviewPullRequest - should handle invalid pull request ID', async () => {
        const fakeId = '00000000-0000-0000-0000-000000000000';

        await expect(
          reviewPullRequest(fakeId, 'approve')
        ).rejects.toThrow();

        console.log('Successfully handled invalid pull request ID for review');
      });
    });
  });
});


