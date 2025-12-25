const {
  getMocks,
  createMock,
  getMock,
  updateMock,
  deleteMock,
  getMockCallLogs,
  createMockPublish,
  getMockServerResponses,
  createMockServerResponse,
  getMockServerResponse,
  updateMockServerResponse,
  deleteMockServerResponse,
  deleteMockUnpublish
} = require('../index');
const { getAuthenticatedUser } = require('../../users');
const { loadTestIds, saveTestIds } = require('../../__tests__/test-helpers');
const { buildUid } = require('../../core/utils');

describe('Mocks Functional Tests', () => {
  let persistedIds;
  let userId;
  let mockId;
  let serverResponseId;

  beforeAll(async () => {
    persistedIds = loadTestIds();
    const userResult = await getAuthenticatedUser();
    userId = userResult.data.user.id;
  }, 10000);

  test('1. createMock - should create a new mock server', async () => {
    const mockName = `Test Mock ${Date.now()}`;
    const mockData = {
      name: mockName,
      collection: buildUid(persistedIds.userId, persistedIds.collection.id),
      private: false
    };

    let result;
    try {
      result = await createMock(mockData, persistedIds.workspace.id);
    } catch (error) {
      console.error('Error in createMock:', error);
      throw error;
    }

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('mock');
    expect(result.data.mock).toHaveProperty('id');
    expect(result.data.mock).toHaveProperty('uid');
    expect(result.data.mock).toHaveProperty('mockUrl');
    expect(result.data.mock.name).toBe(mockName);

    // Save the mock ID for subsequent tests
    mockId = result.data.mock.id;
    persistedIds.mock = {
      id: mockId,
      uid: result.data.mock.uid,
      name: mockName,
      mockUrl: result.data.mock.mockUrl,
      collectionId: persistedIds.collection.id,
      workspaceId: persistedIds.workspace.id,
      createdAt: new Date().toISOString()
    };
    saveTestIds(persistedIds);

    console.log(`Created mock server: ${mockName}`);
    console.log(`Mock ID: ${mockId}`);
    console.log(`Mock URL: ${result.data.mock.mockUrl}`);
  }, 10000);

  test('2. getMocks - should get all mocks', async () => {
    const result = await getMocks();

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('mocks');
    expect(Array.isArray(result.data.mocks)).toBe(true);

    console.log(`Retrieved ${result.data.mocks.length} mocks`);
  }, 10000);

  test('3. getMocks - should get mocks in workspace', async () => {
    const workspaceId = persistedIds.workspace.id;
    const result = await getMocks(null, workspaceId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('mocks');
    expect(Array.isArray(result.data.mocks)).toBe(true);

    console.log(`Retrieved ${result.data.mocks.length} mocks in workspace ${workspaceId}`);
  }, 10000);

  test('4. getMock - should get a single mock server', async () => {
    

    const result = await getMock(persistedIds.mock.id);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('mock');
    expect(result.data.mock.id).toBe(persistedIds.mock.id);
    expect(result.data.mock).toHaveProperty('name');
    expect(result.data.mock).toHaveProperty('collection');
    expect(result.data.mock).toHaveProperty('config');

    console.log(`Retrieved mock: ${result.data.mock.name}`);
    console.log(`Mock URL: ${result.data.mock.mockUrl}`);
  }, 10000);

  test('5. updateMock - should update mock server name', async () => {
    const updatedName = `Updated Mock ${Date.now()}`;
    const mockData = {
      name: updatedName,
      collection: persistedIds.collection.id
    };

    const result = await updateMock(persistedIds.mock.id, mockData);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('mock');
    expect(result.data.mock.id).toBe(persistedIds.mock.id);
    expect(result.data.mock.name).toBe(updatedName);

    // Update persisted name
    persistedIds.mock.name = updatedName;
    saveTestIds(persistedIds);

    console.log(`Updated mock name to: ${updatedName}`);
  }, 10000);

  test('6. getMock - should error on non-existent mock', async () => {
    const nonExistentMockId = 'non-existent-mock-id';
    let result;
    try {
      result = await getMock(nonExistentMockId);
    } catch (error) {
      result = error;
      expect(result.status).toBe(404);
      expect(result.response.data).toHaveProperty('error');
      console.log(`Error on non-existent mock: ${result.response.data.error.message}`);
      return;
    }

    fail('Expected getMock to throw 404, but it did not');
  }, 10000);

  test('7. getMockServerResponses - should get all server responses (initially empty)', async () => {
    mockId = persistedIds.mock.id;
    const result = await getMockServerResponses(mockId);

    expect(result.status).toBe(200);
    expect(Array.isArray(result.data)).toBe(true);

    console.log(`Retrieved ${result.data.length} server responses`);
  }, 10000);

  test('8. createMockServerResponse - should create a server response', async () => {
    mockId = persistedIds.mock.id;
    const serverResponseName = `Internal Server Error ${Date.now()}`;
    const serverResponseData = {
      name: serverResponseName,
      statusCode: 500,
      headers: [
        {
          key: 'Content-Type',
          value: 'application/json'
        }
      ],
      body: JSON.stringify({
        message: 'Something went wrong; try again later.'
      }),
      language: 'json'
    };

    const result = await createMockServerResponse(mockId, serverResponseData);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('id');
    expect(result.data.name).toBe(serverResponseName);
    expect(result.data.statusCode).toBe(500);
    expect(result.data).toHaveProperty('headers');
    expect(result.data).toHaveProperty('body');

    // Save the server response ID for subsequent tests
    serverResponseId = result.data.id;
    persistedIds.mock.serverResponseId = serverResponseId;
    saveTestIds(persistedIds);

    console.log(`Created server response: ${serverResponseName}`);
    console.log(`Server Response ID: ${serverResponseId}`);
  }, 10000);

  test('9. getMockServerResponse - should get a single server response', async () => {
    serverResponseId = persistedIds.mock.serverResponseId;
    mockId = persistedIds.mock.id;
    const result = await getMockServerResponse(mockId, serverResponseId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('id');
    expect(result.data.id).toBe(serverResponseId);
    expect(result.data).toHaveProperty('name');
    expect(result.data).toHaveProperty('statusCode');
    expect(result.data.statusCode).toBe(500);

    console.log(`Retrieved server response: ${result.data.name}`);
  }, 10000);

  test('10. updateMockServerResponse - should update server response', async () => {
    serverResponseId = persistedIds.mock.serverResponseId;
    mockId = persistedIds.mock.id;
    const updatedName = `Service Unavailable ${Date.now()}`;
    const serverResponseData = {
      name: updatedName,
      statusCode: 503,
      headers: [
        {
          key: 'Content-Type',
          value: 'application/json'
        }
      ],
      body: JSON.stringify({
        message: 'Service is temporarily unavailable.'
      }),
      language: 'json'
    };

    const result = await updateMockServerResponse(mockId, serverResponseId, serverResponseData);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('id');
    expect(result.data.id).toBe(serverResponseId);
    expect(result.data.name).toBe(updatedName);
    expect(result.data.statusCode).toBe(503);

    console.log(`Updated server response name to: ${updatedName}`);
    console.log(`Updated status code to: 503`);
  }, 10000);

  test('11. getMockServerResponses - should get all server responses (now with data)', async () => {
    mockId = persistedIds.mock.id;
    serverResponseId = persistedIds.mock.serverResponseId;
    const result = await getMockServerResponses(mockId);

    expect(result.status).toBe(200);
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBeGreaterThan(0);

    const serverResponse = result.data.find(sr => sr.id === serverResponseId);
    expect(serverResponse).toBeDefined();
    expect(serverResponse.statusCode).toBe(503);

    console.log(`Retrieved ${result.data.length} server response(s)`);
  }, 10000);

  test('12. getMockCallLogs - should get mock call logs', async () => {
    mockId = persistedIds.mock.id;
    const result = await getMockCallLogs(mockId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('call-logs');
    expect(Array.isArray(result.data['call-logs'])).toBe(true);
    expect(result.data).toHaveProperty('meta');

    console.log(`Retrieved ${result.data['call-logs'].length} call logs`);
  }, 10000);

  test('13. getMockCallLogs - should get mock call logs with limit', async () => {
    mockId = persistedIds.mock.id;
    const result = await getMockCallLogs(mockId, 10);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('call-logs');
    expect(Array.isArray(result.data['call-logs'])).toBe(true);
    expect(result.data['call-logs'].length).toBeLessThanOrEqual(10);

    console.log(`Retrieved ${result.data['call-logs'].length} call logs with limit of 10`);
  }, 10000);

  test.skip('14. createMockPublish - should publish mock server', async () => {
    mockId = persistedIds.mock.id;
    const result = await createMockPublish(mockId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('mock');
    expect(result.data.mock).toHaveProperty('id');

    console.log(`Published mock server ${mockId}`);
  }, 10000);

  test.skip('15. deleteMockUnpublish - should unpublish mock server', async () => {
    const result = await deleteMockUnpublish(mockId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('mock');
    expect(result.data.mock).toHaveProperty('id');

    console.log(`Unpublished mock server ${mockId}`);
  }, 10000);

  test('16. deleteMockServerResponse - should delete server response', async () => {
    mockId = persistedIds.mock.id;
    serverResponseId = persistedIds.mock.serverResponseId;
    const result = await deleteMockServerResponse(mockId, serverResponseId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('id');
    expect(result.data.id).toBe(serverResponseId);

    console.log(`Successfully deleted server response ${serverResponseId}`);

    // Verify the server response is deleted
    await expect(getMockServerResponse(mockId, serverResponseId)).rejects.toThrow();
  }, 10000);

  test('17. deleteMock - should delete mock server', async () => {
     mockId = persistedIds.mock.id;
    const result = await deleteMock(mockId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('mock');
    expect(result.data.mock.id).toBe(mockId);

    console.log(`Successfully deleted mock server ${mockId}`);

    // Verify the mock is deleted
    await expect(getMock(mockId)).rejects.toThrow();

    // Remove from persisted IDs
    delete persistedIds.mock;
    saveTestIds(persistedIds);
  }, 10000);

  
});

