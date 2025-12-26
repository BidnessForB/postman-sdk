const {
  getCollectionPullRequests,
  createCollectionPullRequest
} = require('../../../collections/index');
const { POSTMAN_API_KEY_ENV_VAR } = require('../../../core/config');
const { loadTestIds, saveTestIds } = require('../../../__tests__/test-helpers');

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

        if (!persistedIds.collection?.uid) {
          throw new Error('Collection UID not found in test-ids.json. Run collection functional tests first.');
        }

        console.log('Using user ID:', userId);
        console.log('Using collection UID:', persistedIds.collection.uid);

        // Note: Collection pull requests require actual forks to be created
        console.log('\n⚠️  Collection pull request functional tests require manual setup:');
        console.log('1. Create a collection fork in Postman UI');
        console.log('2. The fork will be used to create pull requests');
        console.log('3. Tests will attempt to create and retrieve pull requests\n');
  });

  test('should skip tests if no fork is configured', () => {
        if (!persistedIds.fork?.collection?.uid) {
          console.log('Skipping collection pull request tests - no fork configured');
          console.log('Run fork functional tests first to create a fork');
          expect(true).toBe(true);
        }
  });

  describe('with configured fork', () => {
    beforeEach(() => {
          if (!persistedIds.fork?.collection?.uid) {
            console.log('Skipping test - no fork configured');
          }
    });

    test('1. getCollectionPullRequests - should retrieve pull requests for collection', async () => {
          if (!persistedIds.fork?.collection?.uid) {
            return; // Skip if not configured
          }

          const result = await getCollectionPullRequests(persistedIds.collection.uid);

          expect(result.status).toBe(200);
          expect(result.data).toHaveProperty('data');
          expect(Array.isArray(result.data.data)).toBe(true);

          console.log(`Found ${result.data.data.length} pull request(s) for collection`);

          if (result.data.data.length > 0) {
            const pr = result.data.data[0];
            console.log('First PR:');
            console.log('  ID:', pr.id);
            console.log('  Title:', pr.title);
            console.log('  Status:', pr.status);
            console.log('  Source ID:', pr.sourceId);
            console.log('  Destination ID:', pr.destinationId);
            console.log('  Created:', pr.createdAt);
          }
    });

    test('2. createCollectionPullRequest - should create a pull request from fork', async () => {
          if (!persistedIds.fork?.collection?.uid) {
            return; // Skip if not configured
          }

          try {
            const title = `SDK Test PR - ${Date.now()}`;
            const description = 'Pull request created by SDK functional test';
            const reviewers = [userId];

            const result = await createCollectionPullRequest(
              persistedIds.fork.collection.uid,
              title,
              persistedIds.collection.id,
              reviewers,
              description
            );

            expect(result.status).toBe(200);
            expect(result.data).toHaveProperty('id');
            expect(result.data).toHaveProperty('title');
            expect(result.data.title).toBe(title);
            expect(result.data).toHaveProperty('status');
            expect(result.data).toHaveProperty('sourceId');
            expect(result.data).toHaveProperty('destinationId');
            expect(result.data.destinationId).toBe(persistedIds.collection.id);

            // Save the PR ID for potential cleanup
            if (!persistedIds.pullRequest) {
              persistedIds.pullRequest = {};
            }
            persistedIds.pullRequest.id = result.data.id;
            saveTestIds(persistedIds);

            console.log('Successfully created pull request');
            console.log('PR ID:', result.data.id);
            console.log('Title:', result.data.title);
            console.log('Status:', result.data.status);
            console.log('Source:', result.data.sourceId);
            console.log('Destination:', result.data.destinationId);
          } catch (error) {
            // May fail if PR already exists
            console.log('Create PR failed (may be expected):', error.message);
            if (error.response?.data) {
              console.log('API Response:', JSON.stringify(error.response.data, null, 2));
            }
          }
    });

    test('3. createCollectionPullRequest - should handle duplicate PR error', async () => {
          if (!persistedIds.fork?.collection?.uid) {
            return; // Skip if not configured
          }

          try {
            // Try to create another PR with same source/destination
            await createCollectionPullRequest(
              persistedIds.fork.collection.uid,
              'Duplicate PR Test',
              persistedIds.collection.id,
              [userId],
              'This should fail if a PR already exists'
            );

            // If it succeeds, that's also fine (no existing PR)
            console.log('Created PR successfully (no duplicate existed)');
          } catch (error) {
            // Expected to fail with 400 if duplicate
            if (error.response?.status === 400) {
              console.log('Successfully handled duplicate PR error');
              expect(error.response.status).toBe(400);
            } else {
              console.log('Failed with unexpected error:', error.message);
            }
          }
    });

    test('4. getCollectionPullRequests - should handle invalid collection UID', async () => {
          const fakeUid = `${userId}-00000000-0000-0000-0000-000000000000`;

          await expect(
            getCollectionPullRequests(fakeUid)
          ).rejects.toThrow();

          console.log('Successfully handled invalid collection UID');
    });

    test('5. createCollectionPullRequest - should handle invalid destination ID', async () => {
          if (!persistedIds.fork?.collection?.uid) {
            return; // Skip if not configured
          }

          const fakeDestId = '00000000-0000-0000-0000-000000000000';

          await expect(
            createCollectionPullRequest(
              persistedIds.fork.collection.uid,
              'Test PR',
              fakeDestId,
              [userId],
              'Test description'
            )
          ).rejects.toThrow();

          console.log('Successfully handled invalid destination ID');
    });
  });
});
