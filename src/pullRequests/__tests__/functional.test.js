const {
  getPullRequest,
  updatePullRequest,
  reviewPullRequest
} = require('../index');
const { POSTMAN_API_KEY_ENV_VAR } = require('../../core/config');
const { loadTestIds, saveTestIds } = require('../../__tests__/test-helpers');

describe('functional tests', () => {
  let persistedIds = loadTestIds();
  let userId;

  beforeAll(async () => {
    if (!process.env[POSTMAN_API_KEY_ENV_VAR]) {
      throw new Error(`${POSTMAN_API_KEY_ENV_VAR} environment variable is required for functional tests`);
    }

    userId = persistedIds?.userId.toString();

    if (!userId) {
      throw new Error('User ID not found in test-ids.json. Run user functional tests first.');
    }

    console.log('Using user ID:', userId);

    
  });

  test('1. getPullRequest - should retrieve pull request details', async () => {
    

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

  test('2. updatePullRequest - should update pull request title and reviewers', async () => {
    

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

  test('3. updatePullRequest - should update without description', async () => {
    

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

  test('4. reviewPullRequest - should approve pull request', async () => {
    

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

  test('5. reviewPullRequest - should unapprove pull request', async () => {
    

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

  test('6. reviewPullRequest - should decline pull request with comment', async () => {
    

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

  test('7. getPullRequest - should handle invalid PR ID', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';

    await expect(
      getPullRequest(fakeId)
    ).rejects.toThrow();

    console.log('Successfully handled invalid pull request ID');
  });

  test('8. updatePullRequest - should handle invalid PR ID', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';

    
    const results = await updatePullRequest(fakeId, 'Test Title', [userId.toString()]);
    expect([400, 401, 403, 404, 409, 422, 500, 501, 502, 503, 504]).toContain(results.status);
    expect(results.code).toBe('ERR_BAD_REQUEST');
    

    console.log('Successfully handled invalid PR ID for update');
  });

  test('9. reviewPullRequest - should handle invalid PR ID', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';

    await expect(
      reviewPullRequest(fakeId, 'approve')
    ).rejects.toThrow();

    console.log('Successfully handled invalid PR ID for review');
  });
});

