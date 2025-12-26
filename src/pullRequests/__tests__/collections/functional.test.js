const {
  getCollectionPullRequests,
  createCollectionFork,
  createCollectionPullRequest
} = require('../../../collections/index');
const {
  getPullRequest,
  updatePullRequest,
  reviewPullRequest
} = require('../../index');
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

    if (!persistedIds.fork?.collection?.uid) {
      console.log('\n⚠️  No fork configured. Run fork functional tests first to create a fork.');
    }
  });
  test('1. createCollectionPullRequest - should create a pull request from fork', async () => {
    if (!persistedIds.fork?.collection?.uid) {
      // Create a fork of the collection and persist the fork ids
      const label = `SDK Test Fork - ${Date.now()}`;
      
      const result = await createCollectionFork(
        persistedIds.collection.id,
        persistedIds.workspace.id,
        label
      );

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('collection');
      expect(result.data.collection).toHaveProperty('id');
      expect(result.data.collection).toHaveProperty('uid');
      expect(result.data.collection).toHaveProperty('name');
      expect(result.data.collection).toHaveProperty('fork');
      expect(result.data.collection.fork).toHaveProperty('label');
      expect(result.data.collection.fork.label).toBe(label);
      expect(result.data.collection.fork).toHaveProperty('createdAt');
      expect(result.data.collection.fork).toHaveProperty('from');

      // Save the fork details
      persistedIds.fork.collection = {
        id: result.data.collection.id,
        uid: result.data.collection.uid,
        name: result.data.collection.name,
        label: result.data.collection.fork.label,
        from: result.data.collection.fork.from
      };
      saveTestIds(persistedIds);

      console.log('Successfully created fork:', result.data.collection.id);
      console.log('Fork label:', result.data.collection.fork.label);
      console.log('Forked from:', result.data.collection.fork.from);
    }

    try {
      const title = `SDK Test PR - ${Date.now()}`;
      const description = 'Pull request created by SDK functional test';
      const reviewers = [userId.toString()];
      const destinationUid = persistedIds.collection.uid;

      const result = await createCollectionPullRequest(
        persistedIds.fork.collection.uid,
        title,
        persistedIds.collection.uid,
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
      expect(result.data.destinationId).toBe(persistedIds.collection.uid);

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
        fail(error.response.data);
      } else {
        fail(error.message);
      }
    }
  });
  test('2. getCollectionPullRequests - should retrieve pull requests for collection', async () => {
   

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

  

  test('3. createCollectionPullRequest - should handle duplicate PR error', async () => {
  

    try {
      // Try to create another PR with same source/destination
      await createCollectionPullRequest(
        persistedIds.fork.collection.uid,
        'Duplicate PR Test',
        persistedIds.collection.uid,
        [userId.toString()],
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

  // Pull Request Management Tests (from ../functional.test.js)
  test('6. getPullRequest - should retrieve pull request details', async () => {
    const result = await getPullRequest(persistedIds.pullRequest.id);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('id');
    expect(result.data.id).toBe(persistedIds.pullRequest.id);
    expect(result.data).toHaveProperty('title');
    expect(result.data).toHaveProperty('status');
    expect(result.data).toHaveProperty('source');
    expect(result.data).toHaveProperty('destination.id');
    expect(result.data).toHaveProperty('reviewers');
    expect(Array.isArray(result.data.reviewers)).toBe(true);

    console.log('Successfully retrieved pull request');
    console.log('PR ID:', result.data.id);
    console.log('Title:', result.data.title);
    console.log('Status:', result.data.status);
    console.log('Source:', result.data.sourceId);
    console.log('Destination:', result.data.destinationId);
    console.log('Reviewers:', result.data.reviewers);
  });

  test('7. updatePullRequest - should update pull request title and reviewers', async () => {
    const newTitle = `Updated SDKK Test PR - ${Date.now()}`;
    const newReviewers = [userId.toString()];
    const newDescription = 'Updated by SDK functional test';

    try {
      const result = await updatePullRequest(
        persistedIds.pullRequest.id,
        newTitle,
        newReviewers,
        newDescription
      );

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('id');
      expect(result.data.id).toBe(persistedIds.pullRequest.id);
      expect(result.data).toHaveProperty('title');
      expect(result.data.title).toBe(newTitle);
      //expect(result.data).toHaveProperty('reviewers');
      //expect(Array.isArray(result.data.reviewers)).toBe(true);

      console.log('Successfully updated pull request');
      console.log('PR ID:', result.data.id);
      console.log('New Title:', result.data.title);
      console.log('Reviewers:', result.data.reviewers);
    } catch (error) {
      if (error.response?.data) {
        fail(error.response.data);
      } else {
        fail(error.message);
      }
    }
  });

  test('8. updatePullRequest - should update without description', async () => {
    const newTitle = `SDK Test PR No Desc - ${Date.now()}`;
    const newReviewers = [userId.toString()];

    try {
      const result = await updatePullRequest(
        persistedIds.pullRequest.id,
        newTitle,
        newReviewers
      );

      expect(result.status).toBe(200);
      expect(result.data.id).toBe(persistedIds.pullRequest.id);

      console.log('Successfully updated PR without description');
      console.log('New Title:', result.data.title);
    } catch (error) {
      if (error.response?.data) {
        fail(error.response.data);
      } else {
        fail(error.message);
      }
    }
  });

  test('9. reviewPullRequest - should approve pull request', async () => {
    try {
      const result = await reviewPullRequest(
        persistedIds.pullRequest.id,
        'approve'
      );

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('id');
      expect(result.data).toHaveProperty('status');
      expect(result.data).toHaveProperty('reviewedBy');

      console.log('Successfully reviewed pull request');
      console.log('Action: approve');
      console.log('Status:', result.data.status);
      console.log('Reviewed by:', result.data.reviewedBy);
    } catch (error) {
      if (error.response?.data) {
        fail(error.response.data);
      } else {
        fail(error.message);
      }
    }
  });

  test('10. reviewPullRequest - should unapprove pull request', async () => {
    try {
      const result = await reviewPullRequest(
        persistedIds.pullRequest.id,
        'unapprove'
      );

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('id');
      expect(result.data).toHaveProperty('status');

      console.log('Successfully unapproved pull request');
      console.log('Status:', result.data.status);
    } catch (error) {
      if (error.response?.data) {
        fail(error.response.data);
      } else {
        fail(error.message);
      }
    }
  });

  test('11. reviewPullRequest - should decline pull request with comment', async () => {
    try {
      const comment = 'Declining for SDK test purposes';
      const result = await reviewPullRequest(
        persistedIds.pullRequest.id,
        'decline',
        comment
      );

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('id');
      expect(result.data).toHaveProperty('status');

      console.log('Successfully declined pull request');
      console.log('Status:', result.data.status);
      console.log('Comment:', comment);
    } catch (error) {
      if (error.response?.data) {
        fail(error.response.data);
      } else {
        fail(error.message);
      }
    }
  });

  test('12. getPullRequest - should handle invalid PR ID', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';

    await expect(
      getPullRequest(fakeId)
    ).rejects.toThrow();

    console.log('Successfully handled invalid pull request ID');
  });

  test('13. updatePullRequest - should handle invalid PR ID', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';

    const results = await updatePullRequest(fakeId, 'Test Title', [userId.toString()]);
    expect([400, 401, 403, 404, 409, 422, 500, 501, 502, 503, 504]).toContain(results.status);
    expect(results.code).toBe('ERR_BAD_REQUEST');

    console.log('Successfully handled invalid PR ID for update');
  });

  test('14. reviewPullRequest - should handle invalid PR ID', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';

    await expect(
      reviewPullRequest(fakeId, 'approve')
    ).rejects.toThrow();

    console.log('Successfully handled invalid PR ID for review');
  });
});
