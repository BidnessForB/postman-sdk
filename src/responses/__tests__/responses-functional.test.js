const {
  createResponse,
  getResponse,
  updateResponse,
  deleteResponse,
  getResponseComments,
  createResponseComment,
  updateResponseComment,
  deleteResponseComment
} = require('../response');
const { POSTMAN_API_KEY_ENV_VAR } = require('../../core/config');
const { loadTestIds, saveTestIds } = require('../../__tests__/test-helpers');

describe('responses functional tests (sequential flow)', () => {
  let persistedIds = {};

  beforeAll(async () => {
    if (!process.env[POSTMAN_API_KEY_ENV_VAR]) {
      throw new Error(`${POSTMAN_API_KEY_ENV_VAR} environment variable is required for functional tests`);
    }

    // persistedIds must be loaded so that sequential functional tests have access
    // to IDs (e.g., collectionUid, requestId) persisted from previous phases. This enables
    // the responses functional tests to build on resources created earlier.
    persistedIds = loadTestIds();

    if (!persistedIds.collection || !persistedIds.collection.id) {
      throw new Error('No collection ID found. Please run collection tests first to create a test collection.');
    }

    if (!persistedIds.request || !persistedIds.request.id) {
      throw new Error('No request ID found. Please run request tests first to create a test request.');
    }

    if (!persistedIds?.user?.Id) {
      throw new Error('No user ID found. Please run user tests first to get user ID.');
    }

    console.log('Using collection ID:', persistedIds.collection.id);
    console.log('Using request ID:', persistedIds.request.id);
    console.log('Using user ID:', persistedIds?.user?.Id);

    if (persistedIds.response && persistedIds.response.id) {
      console.log('Found persisted response ID:', persistedIds.response.id);
    }
  });

  afterAll(async () => {
    
  });

  test('1. createResponse - should create a response in the collection', async () => {
    const collectionId = persistedIds.collection.id;
    const requestId = persistedIds.request.id;
  
    const responseName = `Test Response ${Date.now()}`;
    const responseData = {
      name: responseName,
      status: 'OK',
      code: 200,
      body: '{"message": "Success"}',
      header: [
        {
          key: 'Content-Type',
          value: 'application/json'
        }
      ]
    };

    const result = await createResponse(collectionId, requestId, responseData);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('data');
    expect(result.data.data).toHaveProperty('id');
    expect(result.data.data).toHaveProperty('name');
    expect(result.data.data.name).toBe(responseName);

    // Persist response IDs for future test runs
    persistedIds.response = {
      ...persistedIds.response,
      id: result.data.data.id,
      uid: result.data.data.owner + '-' + result.data.data.id,
      name: responseName,
      createdAt: new Date().toISOString()
    };
    saveTestIds(persistedIds);

    console.log(`Created and persisted response ID: ${persistedIds.response.id}`);
  });

  test('2. getResponse - should retrieve the response by ID', async () => {
    const collectionId = persistedIds.collection.id;
    const responseId = persistedIds.response.id;
    
    expect(collectionId).toBeDefined();
    expect(responseId).toBeDefined();

    const result = await getResponse(collectionId, responseId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('data');
    expect(result.data.data).toHaveProperty('id');
    expect(result.data.data.id).toBe(responseId);
    expect(result.data.data).toHaveProperty('name');
    
    // Update persisted name with current name from API if different
    if (result.data.data.name !== persistedIds.response.name) {
      persistedIds.response.name = result.data.data.name;
      saveTestIds(persistedIds);
    }
  });

  test('3. getResponse with populate - should retrieve full response details', async () => {
    const collectionId = persistedIds.collection.id;
    const responseId = persistedIds.response.id;
    
    expect(collectionId).toBeDefined();
    expect(responseId).toBeDefined();

    const result = await getResponse(collectionId, responseId, null, null, true);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('data');
    expect(result.data.data).toHaveProperty('id');
    expect(result.data.data.id).toBe(responseId);
    expect(result.data.meta).toHaveProperty('populate');
    expect(result.data.meta.populate).toBe(true);
  });

  test('4. updateResponse - should update the response name and status', async () => {
    const collectionId = persistedIds.collection.id;
    const responseId = persistedIds.response.id;
    
    expect(collectionId).toBeDefined();
    expect(responseId).toBeDefined();

    const updatedName = `${persistedIds.response.name} - Updated`;
    const updateData = {
      name: updatedName,
      status: 'Created',
      code: 201
    };

    const result = await updateResponse(collectionId, responseId, updateData);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('data');
    expect(result.data.data).toHaveProperty('id');
    expect(result.data.data.id).toBe(responseId);
    expect(result.data.data.name).toBe(updatedName);

    // Update persisted name
    persistedIds.response.name = updatedName;
    saveTestIds(persistedIds);

    console.log(`Updated response name to: ${updatedName}`);
  });

  test('5. getResponseComments - should retrieve comments on the response', async () => {
    const userId = persistedIds?.user?.Id;
    const collectionUid = persistedIds.collection.uid;
    const responseUid = persistedIds.response.uid;
    
    expect(userId).toBeDefined();
    expect(collectionUid).toBeDefined();
    expect(responseUid).toBeDefined();

    const result = await getResponseComments(collectionUid, responseUid);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('data');
    expect(Array.isArray(result.data.data)).toBe(true);

    console.log(`Retrieved ${result.data.data.length} comments on response`);
  });

  test('6. createResponseComment - should create a comment on the response', async () => {
    const userId = persistedIds?.user?.Id;
    const collectionUid = persistedIds.collection.uid;
    const responseUid = persistedIds.response.uid;
    
    expect(userId).toBeDefined();
    expect(collectionUid).toBeDefined();
    expect(responseUid).toBeDefined();

    const commentBody = `Test comment on response - ${Date.now()}`;
    const commentData = {
      body: commentBody
    };

    const result = await createResponseComment(collectionUid, responseUid, commentData);

    expect(result.status).toBeGreaterThanOrEqual(200);
    expect(result.status).toBeLessThan(300);
    expect(result.data).toHaveProperty('data');
    expect(result.data.data).toHaveProperty('id');
    expect(result.data.data).toHaveProperty('body');
    expect(result.data.data.body).toBe(commentBody);

    // Persist comment ID for future tests
    persistedIds.response.commentId = result.data.data.id;
    saveTestIds(persistedIds);

    console.log(`Created response comment with ID: ${persistedIds.response.commentId}`);
  });

  test('7. updateResponseComment - should update the comment on the response', async () => {
    const userId = persistedIds?.user?.Id;
    const collectionUid = persistedIds.collection.uid;
    const responseUid = persistedIds.response.uid;
    const commentId = persistedIds.response.commentId;
    
    expect(userId).toBeDefined();
    expect(collectionUid).toBeDefined();
    expect(responseUid).toBeDefined();
    expect(commentId).toBeDefined();

    const updatedBody = `Updated comment on response - ${Date.now()}`;
    const commentData = {
      body: updatedBody
    };

    const result = await updateResponseComment(collectionUid, responseUid, commentId, commentData);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('data');
    expect(result.data.data).toHaveProperty('id');
    expect(result.data.data.id).toBe(commentId);
    expect(result.data.data).toHaveProperty('body');
    expect(result.data.data.body).toBe(updatedBody);

    console.log(`Updated response comment ID: ${commentId}`);
  });

  test('8. deleteResponseComment - should delete the comment from the response', async () => {
    const userId = persistedIds?.user?.Id;
    const collectionUid = persistedIds.collection.uid;
    const responseUid = persistedIds.response.uid;
    const commentId = persistedIds.response.commentId;
    
    expect(userId).toBeDefined();
    expect(collectionUid).toBeDefined();
    expect(responseUid).toBeDefined();
    expect(commentId).toBeDefined();

    const result = await deleteResponseComment(collectionUid, responseUid, commentId);

    expect(result.status).toBeGreaterThanOrEqual(200);
    expect(result.status).toBeLessThan(300);

    console.log(`Deleted response comment ID: ${commentId}`);

    // Clear the comment ID from persisted data
    delete persistedIds.response.commentId;
    saveTestIds(persistedIds);
  });

  test('9. deleteResponse - should delete the response', async () => {
    const collectionId = persistedIds.collection.id;
    const responseId = persistedIds.response.id;
    
    expect(collectionId).toBeDefined();
    expect(responseId).toBeDefined();

    const result = await deleteResponse(collectionId, responseId);

    expect(result.status).toBeGreaterThanOrEqual(200);
    expect(result.status).toBeLessThan(300);

    console.log(`Deleted response ID: ${responseId}`);

    // Don't clear the response from persisted data yet, as we might want to verify deletion
    // or use it for reference in other tests
  });

  test('10. getResponse after delete - should fail to retrieve deleted response', async () => {
    const collectionId = persistedIds.collection.id;
    const responseId = persistedIds.response.id;
    
    expect(collectionId).toBeDefined();
    expect(responseId).toBeDefined();

    try {
      await getResponse(collectionId, responseId);
      // If we reach here, the test should fail because we expect an error
      fail('Expected getResponse to throw an error for deleted response');
    } catch (error) {
      // We expect an error here
      expect(error).toBeDefined();
      console.log(`Confirmed response ${responseId} was deleted`);
    }
  });
});

