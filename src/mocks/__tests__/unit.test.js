const axios = require('axios');
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

jest.mock('axios');
jest.mock('../../core/config', () => ({
  apiKey: 'test-api-key',
  baseUrl: 'https://api.getpostman.com'
}));

describe('mocks unit tests', () => {
  const DEFAULT_MOCK_ID = 'e3d951bf-873f-49ac-a658-b2dcb91d3289';
  const DEFAULT_COLLECTION_ID = '12ece9e1-2abf-4edc-8e34-de66e74114d2';
  const DEFAULT_WORKSPACE_ID = '066b3200-1739-4b19-bd52-71700f3a4545';
  const DEFAULT_TEAM_ID = '12345678';
  const DEFAULT_SERVER_RESPONSE_ID = '965cdd16-fe22-4d96-a161-3d05490ac421';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMocks', () => {
    test('should call GET /mocks without query params', async () => {
      const mockResponse = {
        status: 200,
        data: {
          mocks: [
            {
              id: DEFAULT_MOCK_ID,
              name: 'Test Mock',
              owner: DEFAULT_TEAM_ID,
              uid: `${DEFAULT_TEAM_ID}-${DEFAULT_MOCK_ID}`,
              collection: `${DEFAULT_TEAM_ID}-${DEFAULT_COLLECTION_ID}`
            }
          ]
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getMocks();

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: 'https://api.getpostman.com/mocks'
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include teamId query param when provided', async () => {
      const mockResponse = {
        status: 200,
        data: { mocks: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getMocks(DEFAULT_TEAM_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `https://api.getpostman.com/mocks?teamId=${DEFAULT_TEAM_ID}`
        })
      );
    });

    test('should include workspace query param when provided', async () => {
      const mockResponse = {
        status: 200,
        data: { mocks: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getMocks(null, DEFAULT_WORKSPACE_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `https://api.getpostman.com/mocks?workspace=${DEFAULT_WORKSPACE_ID}`
        })
      );
    });

    test('should include both teamId and workspace query params', async () => {
      const mockResponse = {
        status: 200,
        data: { mocks: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getMocks(DEFAULT_TEAM_ID, DEFAULT_WORKSPACE_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `https://api.getpostman.com/mocks?teamId=${DEFAULT_TEAM_ID}&workspace=${DEFAULT_WORKSPACE_ID}`
        })
      );
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { mocks: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getMocks();

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key'
          })
        })
      );
    });
  });

  describe('createMock', () => {
    test('should call POST /mocks with mock data and workspace', async () => {
      const mockResponse = {
        status: 200,
        data: {
          mock: {
            id: DEFAULT_MOCK_ID,
            name: 'Test Mock',
            collection: DEFAULT_COLLECTION_ID,
            uid: `${DEFAULT_TEAM_ID}-${DEFAULT_MOCK_ID}`
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const mockData = {
        name: 'Test Mock',
        collection: DEFAULT_COLLECTION_ID,
        private: true
      };

      const result = await createMock(mockData, DEFAULT_WORKSPACE_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: `https://api.getpostman.com/mocks?workspace=${DEFAULT_WORKSPACE_ID}`,
          data: {
            mock: mockData
          }
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { mock: {} }
      };
      axios.request.mockResolvedValue(mockResponse);

      await createMock({ collection: DEFAULT_COLLECTION_ID }, DEFAULT_WORKSPACE_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key'
          })
        })
      );
    });
  });

  describe('getMock', () => {
    test('should call GET /mocks/{mockId}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          mock: {
            id: DEFAULT_MOCK_ID,
            name: 'Test Mock',
            owner: DEFAULT_TEAM_ID,
            collection: DEFAULT_COLLECTION_ID
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getMock(DEFAULT_MOCK_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `https://api.getpostman.com/mocks/${DEFAULT_MOCK_ID}`
        })
      );
      expect(result).toEqual(mockResponse);
      expect(result.data.mock.id).toBe(DEFAULT_MOCK_ID);
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { mock: {} }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getMock(DEFAULT_MOCK_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key'
          })
        })
      );
    });
  });

  describe('updateMock', () => {
    test('should call PUT /mocks/{mockId} with mock data', async () => {
      const mockResponse = {
        status: 200,
        data: {
          mock: {
            id: DEFAULT_MOCK_ID,
            name: 'Updated Mock',
            collection: DEFAULT_COLLECTION_ID
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const mockData = {
        name: 'Updated Mock',
        collection: DEFAULT_COLLECTION_ID,
        private: false
      };

      const result = await updateMock(DEFAULT_MOCK_ID, mockData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: `https://api.getpostman.com/mocks/${DEFAULT_MOCK_ID}`,
          data: {
            mock: mockData
          }
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { mock: {} }
      };
      axios.request.mockResolvedValue(mockResponse);

      await updateMock(DEFAULT_MOCK_ID, { collection: DEFAULT_COLLECTION_ID });

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key'
          })
        })
      );
    });
  });

  describe('deleteMock', () => {
    test('should call DELETE /mocks/{mockId}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          mock: {
            id: DEFAULT_MOCK_ID,
            uid: `${DEFAULT_TEAM_ID}-${DEFAULT_MOCK_ID}`
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await deleteMock(DEFAULT_MOCK_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'delete',
          url: `https://api.getpostman.com/mocks/${DEFAULT_MOCK_ID}`
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { mock: {} }
      };
      axios.request.mockResolvedValue(mockResponse);

      await deleteMock(DEFAULT_MOCK_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key'
          })
        })
      );
    });
  });

  describe('getMockCallLogs', () => {
    test('should call GET /mocks/{mockId}/call-logs without query params', async () => {
      const mockResponse = {
        status: 200,
        data: {
          'call-logs': [
            {
              id: 'log-id-123',
              responseName: 'Success Response',
              servedAt: '2022-01-17T06:19:30.000Z'
            }
          ]
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getMockCallLogs(DEFAULT_MOCK_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `https://api.getpostman.com/mocks/${DEFAULT_MOCK_ID}/call-logs`
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include limit query param when provided', async () => {
      const mockResponse = {
        status: 200,
        data: { 'call-logs': [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getMockCallLogs(DEFAULT_MOCK_ID, 50);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `https://api.getpostman.com/mocks/${DEFAULT_MOCK_ID}/call-logs?limit=50`
        })
      );
    });

    test('should include multiple query params when provided', async () => {
      const mockResponse = {
        status: 200,
        data: { 'call-logs': [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getMockCallLogs(
        DEFAULT_MOCK_ID,
        25,
        'cursor123',
        null,
        null,
        200,
        'success',
        'GET',
        '/test',
        'servedAt',
        'desc',
        'request.headers,response.body'
      );

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('limit=25')
        })
      );
      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('cursor=cursor123')
        })
      );
      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('responseStatusCode=200')
        })
      );
      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('responseType=success')
        })
      );
      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('requestMethod=GET')
        })
      );
      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('requestPath=%2Ftest')
        })
      );
      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('sort=servedAt')
        })
      );
      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('direction=desc')
        })
      );
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { 'call-logs': [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getMockCallLogs(DEFAULT_MOCK_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key'
          })
        })
      );
    });
  });

  describe('createMockPublish', () => {
    test('should call POST /mocks/{mockId}/publish', async () => {
      const mockResponse = {
        status: 200,
        data: {
          mock: {
            id: DEFAULT_MOCK_ID
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await createMockPublish(DEFAULT_MOCK_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: `https://api.getpostman.com/mocks/${DEFAULT_MOCK_ID}/publish`
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { mock: {} }
      };
      axios.request.mockResolvedValue(mockResponse);

      await createMockPublish(DEFAULT_MOCK_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key'
          })
        })
      );
    });
  });

  describe('getMockServerResponses', () => {
    test('should call GET /mocks/{mockId}/server-responses', async () => {
      const mockResponse = {
        status: 200,
        data: [
          {
            id: DEFAULT_SERVER_RESPONSE_ID,
            name: 'Internal Server Error',
            statusCode: 500
          }
        ]
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getMockServerResponses(DEFAULT_MOCK_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `https://api.getpostman.com/mocks/${DEFAULT_MOCK_ID}/server-responses`
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: []
      };
      axios.request.mockResolvedValue(mockResponse);

      await getMockServerResponses(DEFAULT_MOCK_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key'
          })
        })
      );
    });
  });

  describe('createMockServerResponse', () => {
    test('should call POST /mocks/{mockId}/server-responses with server response data', async () => {
      const mockResponse = {
        status: 200,
        data: {
          id: DEFAULT_SERVER_RESPONSE_ID,
          name: 'Internal Server Error',
          statusCode: 500,
          body: '{"message": "Something went wrong"}'
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const serverResponseData = {
        name: 'Internal Server Error',
        statusCode: 500,
        body: '{"message": "Something went wrong"}'
      };

      const result = await createMockServerResponse(DEFAULT_MOCK_ID, serverResponseData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: `https://api.getpostman.com/mocks/${DEFAULT_MOCK_ID}/server-responses`,
          data: {
            serverResponse: serverResponseData
          }
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: {}
      };
      axios.request.mockResolvedValue(mockResponse);

      await createMockServerResponse(DEFAULT_MOCK_ID, { name: 'Error', statusCode: 500 });

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key'
          })
        })
      );
    });
  });

  describe('getMockServerResponse', () => {
    test('should call GET /mocks/{mockId}/server-responses/{serverResponseId}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          id: DEFAULT_SERVER_RESPONSE_ID,
          name: 'Internal Server Error',
          statusCode: 500
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getMockServerResponse(DEFAULT_MOCK_ID, DEFAULT_SERVER_RESPONSE_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `https://api.getpostman.com/mocks/${DEFAULT_MOCK_ID}/server-responses/${DEFAULT_SERVER_RESPONSE_ID}`
        })
      );
      expect(result).toEqual(mockResponse);
      expect(result.data.id).toBe(DEFAULT_SERVER_RESPONSE_ID);
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: {}
      };
      axios.request.mockResolvedValue(mockResponse);

      await getMockServerResponse(DEFAULT_MOCK_ID, DEFAULT_SERVER_RESPONSE_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key'
          })
        })
      );
    });
  });

  describe('updateMockServerResponse', () => {
    test('should call PUT /mocks/{mockId}/server-responses/{serverResponseId} with server response data', async () => {
      const mockResponse = {
        status: 200,
        data: {
          id: DEFAULT_SERVER_RESPONSE_ID,
          name: 'Service Unavailable',
          statusCode: 503
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const serverResponseData = {
        name: 'Service Unavailable',
        statusCode: 503
      };

      const result = await updateMockServerResponse(
        DEFAULT_MOCK_ID,
        DEFAULT_SERVER_RESPONSE_ID,
        serverResponseData
      );

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: `https://api.getpostman.com/mocks/${DEFAULT_MOCK_ID}/server-responses/${DEFAULT_SERVER_RESPONSE_ID}`,
          data: {
            serverResponse: serverResponseData
          }
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: {}
      };
      axios.request.mockResolvedValue(mockResponse);

      await updateMockServerResponse(DEFAULT_MOCK_ID, DEFAULT_SERVER_RESPONSE_ID, { name: 'Updated' });

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key'
          })
        })
      );
    });
  });

  describe('deleteMockServerResponse', () => {
    test('should call DELETE /mocks/{mockId}/server-responses/{serverResponseId}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          id: DEFAULT_SERVER_RESPONSE_ID,
          name: 'Service Unavailable',
          statusCode: 503
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await deleteMockServerResponse(DEFAULT_MOCK_ID, DEFAULT_SERVER_RESPONSE_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'delete',
          url: `https://api.getpostman.com/mocks/${DEFAULT_MOCK_ID}/server-responses/${DEFAULT_SERVER_RESPONSE_ID}`
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: {}
      };
      axios.request.mockResolvedValue(mockResponse);

      await deleteMockServerResponse(DEFAULT_MOCK_ID, DEFAULT_SERVER_RESPONSE_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key'
          })
        })
      );
    });
  });

  describe('deleteMockUnpublish', () => {
    test('should call DELETE /mocks/{mockId}/unpublish', async () => {
      const mockResponse = {
        status: 200,
        data: {
          mock: {
            id: DEFAULT_MOCK_ID
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await deleteMockUnpublish(DEFAULT_MOCK_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'delete',
          url: `https://api.getpostman.com/mocks/${DEFAULT_MOCK_ID}/unpublish`
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { mock: {} }
      };
      axios.request.mockResolvedValue(mockResponse);

      await deleteMockUnpublish(DEFAULT_MOCK_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key'
          })
        })
      );
    });
  });
});

