const axios = require('axios');
const {
  createResponse,
  getResponse,
  updateResponse,
  deleteResponse,
  getResponseComments,
  createResponseComment,
  updateResponseComment,
  deleteResponseComment
} = require('../index');

jest.mock('axios');
jest.mock('../../core/config', () => ({
  apiKey: 'test-api-key',
  baseUrl: 'https://api.getpostman.com'
}));

const DEFAULT_COLLECTION_ID = 'c6d2471c-3664-47b5-adc8-35d52484f2f6';
const DEFAULT_REQUEST_ID = 'a1b2c3d4-5678-90ab-cdef-1234567890ab';
const DEFAULT_RESPONSE_ID = 'a1e2c3d4-5678-90ab-cdef-1234567890ab';
const DEFAULT_USER_ID = '12345';

describe('responses unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createResponse', () => {
    test('should call POST /collections/{collectionId}/responses with query param', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_RESPONSE_ID,
          data: {
            id: DEFAULT_RESPONSE_ID,
            name: 'Success Response',
            code: 200
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const responseData = {
        name: 'Success Response',
        code: 200,
        body: '{"status": "success"}',
        header: [
          {
            key: 'Content-Type',
            value: 'application/json'
          }
        ]
      };

      const result = await createResponse(DEFAULT_COLLECTION_ID, DEFAULT_REQUEST_ID, responseData);

      expect(axios.request).toHaveBeenCalledTimes(1);
      const axiosConfig = axios.request.mock.calls[0][0];
      
      expect(axiosConfig.method).toBe('post');
      expect(axiosConfig.url).toBe(`https://api.getpostman.com/collections/${DEFAULT_COLLECTION_ID}/responses?request=${DEFAULT_REQUEST_ID}`);
      expect(axiosConfig.data).toEqual(responseData);
      expect(axiosConfig.headers).toMatchObject({
        'Content-Type': 'application/json',
        'X-API-Key': 'test-api-key'
      });
      expect(result).toBe(mockResponse);
    });

    test('should handle API errors', async () => {
      const mockError = new Error('API Error');
      mockError.response = {
        status: 400,
        data: { error: 'Bad Request' }
      };
      axios.request.mockRejectedValue(mockError);

      const responseData = {
        name: 'Error Response',
        code: 400
      };

      await expect(createResponse(DEFAULT_COLLECTION_ID, DEFAULT_REQUEST_ID, responseData))
        .rejects.toThrow('API Error');

      expect(axios.request).toHaveBeenCalledTimes(1);
    });
  });

  describe('getResponse', () => {
    test('should call GET /collections/{collectionId}/responses/{responseId} without query params', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_RESPONSE_ID,
          data: {
            id: DEFAULT_RESPONSE_ID,
            name: 'Test Response',
            code: 200
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getResponse(DEFAULT_COLLECTION_ID, DEFAULT_RESPONSE_ID);

      expect(axios.request).toHaveBeenCalledTimes(1);
      const axiosConfig = axios.request.mock.calls[0][0];
      
      expect(axiosConfig.method).toBe('get');
      expect(axiosConfig.url).toBe(`https://api.getpostman.com/collections/${DEFAULT_COLLECTION_ID}/responses/${DEFAULT_RESPONSE_ID}`);
      expect(axiosConfig.headers).toMatchObject({
        'Content-Type': 'application/json',
        'X-API-Key': 'test-api-key'
      });
      expect(result).toBe(mockResponse);
    });

    test('should call GET with ids query parameter', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_RESPONSE_ID,
          data: {
            id: DEFAULT_RESPONSE_ID,
            request: DEFAULT_REQUEST_ID
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getResponse(DEFAULT_COLLECTION_ID, DEFAULT_RESPONSE_ID, true);

      expect(axios.request).toHaveBeenCalledTimes(1);
      const axiosConfig = axios.request.mock.calls[0][0];
      
      expect(axiosConfig.method).toBe('get');
      expect(axiosConfig.url).toBe(`https://api.getpostman.com/collections/${DEFAULT_COLLECTION_ID}/responses/${DEFAULT_RESPONSE_ID}?ids=true`);
      expect(result).toBe(mockResponse);
    });

    test('should call GET with uid query parameter', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_RESPONSE_ID,
          data: {
            id: `${DEFAULT_USER_ID}-${DEFAULT_RESPONSE_ID}`,
            request: `${DEFAULT_USER_ID}-${DEFAULT_REQUEST_ID}`
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getResponse(DEFAULT_COLLECTION_ID, DEFAULT_RESPONSE_ID, null, true);

      expect(axios.request).toHaveBeenCalledTimes(1);
      const axiosConfig = axios.request.mock.calls[0][0];
      
      expect(axiosConfig.method).toBe('get');
      expect(axiosConfig.url).toBe(`https://api.getpostman.com/collections/${DEFAULT_COLLECTION_ID}/responses/${DEFAULT_RESPONSE_ID}?uid=true`);
      expect(result).toBe(mockResponse);
    });

    test('should call GET with populate query parameter', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_RESPONSE_ID,
          data: {
            id: DEFAULT_RESPONSE_ID,
            name: 'Test Response',
            code: 200,
            body: '{"status": "success"}',
            header: []
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getResponse(DEFAULT_COLLECTION_ID, DEFAULT_RESPONSE_ID, null, null, true);

      expect(axios.request).toHaveBeenCalledTimes(1);
      const axiosConfig = axios.request.mock.calls[0][0];
      
      expect(axiosConfig.method).toBe('get');
      expect(axiosConfig.url).toBe(`https://api.getpostman.com/collections/${DEFAULT_COLLECTION_ID}/responses/${DEFAULT_RESPONSE_ID}?populate=true`);
      expect(result).toBe(mockResponse);
    });

    test('should call GET with multiple query parameters', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_RESPONSE_ID,
          data: {
            id: `${DEFAULT_USER_ID}-${DEFAULT_RESPONSE_ID}`,
            name: 'Test Response',
            code: 200
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getResponse(DEFAULT_COLLECTION_ID, DEFAULT_RESPONSE_ID, true, true, true);

      expect(axios.request).toHaveBeenCalledTimes(1);
      const axiosConfig = axios.request.mock.calls[0][0];
      
      expect(axiosConfig.method).toBe('get');
      expect(axiosConfig.url).toContain('?ids=true');
      expect(axiosConfig.url).toContain('uid=true');
      expect(axiosConfig.url).toContain('populate=true');
      expect(result).toBe(mockResponse);
    });

    test('should handle API errors', async () => {
      const mockError = new Error('Not Found');
      mockError.response = {
        status: 404,
        data: { error: 'Response not found' }
      };
      axios.request.mockRejectedValue(mockError);

      await expect(getResponse(DEFAULT_COLLECTION_ID, DEFAULT_RESPONSE_ID))
        .rejects.toThrow('Not Found');

      expect(axios.request).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateResponse', () => {
    test('should call PUT /collections/{collectionId}/responses/{responseId}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_RESPONSE_ID,
          data: {
            id: DEFAULT_RESPONSE_ID,
            name: 'Updated Response',
            code: 201
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const responseData = {
        name: 'Updated Response',
        code: 201,
        body: '{"status": "created"}'
      };

      const result = await updateResponse(DEFAULT_COLLECTION_ID, DEFAULT_RESPONSE_ID, responseData);

      expect(axios.request).toHaveBeenCalledTimes(1);
      const axiosConfig = axios.request.mock.calls[0][0];
      
      expect(axiosConfig.method).toBe('put');
      expect(axiosConfig.url).toBe(`https://api.getpostman.com/collections/${DEFAULT_COLLECTION_ID}/responses/${DEFAULT_RESPONSE_ID}`);
      expect(axiosConfig.data).toEqual(responseData);
      expect(axiosConfig.headers).toMatchObject({
        'Content-Type': 'application/json',
        'X-API-Key': 'test-api-key'
      });
      expect(result).toBe(mockResponse);
    });

    test('should handle API errors', async () => {
      const mockError = new Error('Validation Error');
      mockError.response = {
        status: 422,
        data: { error: 'Invalid response data' }
      };
      axios.request.mockRejectedValue(mockError);

      const responseData = {
        name: 'Invalid Response'
      };

      await expect(updateResponse(DEFAULT_COLLECTION_ID, DEFAULT_RESPONSE_ID, responseData))
        .rejects.toThrow('Validation Error');

      expect(axios.request).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteResponse', () => {
    test('should call DELETE /collections/{collectionId}/responses/{responseId}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_RESPONSE_ID,
          meta: {
            model: 'response',
            action: 'delete'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await deleteResponse(DEFAULT_COLLECTION_ID, DEFAULT_RESPONSE_ID);

      expect(axios.request).toHaveBeenCalledTimes(1);
      const axiosConfig = axios.request.mock.calls[0][0];
      
      expect(axiosConfig.method).toBe('delete');
      expect(axiosConfig.url).toBe(`https://api.getpostman.com/collections/${DEFAULT_COLLECTION_ID}/responses/${DEFAULT_RESPONSE_ID}`);
      expect(axiosConfig.headers).toMatchObject({
        'Content-Type': 'application/json',
        'X-API-Key': 'test-api-key'
      });
      expect(result).toBe(mockResponse);
    });

    test('should handle API errors', async () => {
      const mockError = new Error('Not Found');
      mockError.response = {
        status: 404,
        data: { error: 'Response not found' }
      };
      axios.request.mockRejectedValue(mockError);

      await expect(deleteResponse(DEFAULT_COLLECTION_ID, DEFAULT_RESPONSE_ID))
        .rejects.toThrow('Not Found');

      expect(axios.request).toHaveBeenCalledTimes(1);
    });
  });

  describe('getResponseComments', () => {
    test('should call GET /collections/{collectionUid}/responses/{responseUid}/comments', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: [
            {
              id: 12345,
              body: 'Test comment on response',
              createdBy: DEFAULT_USER_ID,
              createdAt: '2024-01-15T10:00:00.000Z'
            }
          ]
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getResponseComments(DEFAULT_USER_ID, DEFAULT_COLLECTION_ID, DEFAULT_RESPONSE_ID);

      expect(axios.request).toHaveBeenCalledTimes(1);
      const axiosConfig = axios.request.mock.calls[0][0];
      
      expect(axiosConfig.method).toBe('get');
      expect(axiosConfig.url).toBe(`https://api.getpostman.com/collections/${DEFAULT_USER_ID}-${DEFAULT_COLLECTION_ID}/responses/${DEFAULT_USER_ID}-${DEFAULT_RESPONSE_ID}/comments`);
      expect(axiosConfig.headers).toMatchObject({
        'Content-Type': 'application/json',
        'X-API-Key': 'test-api-key'
      });
      expect(result).toBe(mockResponse);
    });

    test('should handle API errors', async () => {
      const mockError = new Error('Not Found');
      mockError.response = {
        status: 404,
        data: { error: 'Response not found' }
      };
      axios.request.mockRejectedValue(mockError);

      await expect(getResponseComments(DEFAULT_USER_ID, DEFAULT_COLLECTION_ID, DEFAULT_RESPONSE_ID))
        .rejects.toThrow('Not Found');

      expect(axios.request).toHaveBeenCalledTimes(1);
    });
  });

  describe('createResponseComment', () => {
    test('should call POST /collections/{collectionUid}/responses/{responseUid}/comments', async () => {
      const mockResponse = {
        status: 201,
        data: {
          data: {
            id: 12345,
            body: 'New comment on response',
            createdBy: DEFAULT_USER_ID,
            createdAt: '2024-01-15T10:00:00.000Z'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const commentData = {
        body: 'New comment on response'
      };

      const result = await createResponseComment(DEFAULT_USER_ID, DEFAULT_COLLECTION_ID, DEFAULT_RESPONSE_ID, commentData);

      expect(axios.request).toHaveBeenCalledTimes(1);
      const axiosConfig = axios.request.mock.calls[0][0];
      
      expect(axiosConfig.method).toBe('post');
      expect(axiosConfig.url).toBe(`https://api.getpostman.com/collections/${DEFAULT_USER_ID}-${DEFAULT_COLLECTION_ID}/responses/${DEFAULT_USER_ID}-${DEFAULT_RESPONSE_ID}/comments`);
      expect(axiosConfig.data).toEqual(commentData);
      expect(axiosConfig.headers).toMatchObject({
        'Content-Type': 'application/json',
        'X-API-Key': 'test-api-key'
      });
      expect(result).toBe(mockResponse);
    });

    test('should handle comment with tags', async () => {
      const mockResponse = {
        status: 201,
        data: {
          data: {
            id: 12345,
            body: 'Comment with @user mention',
            createdBy: DEFAULT_USER_ID,
            createdAt: '2024-01-15T10:00:00.000Z'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const commentData = {
        body: 'Comment with @user mention',
        tags: {
          '@user': {
            type: 'user',
            id: '67890'
          }
        }
      };

      const result = await createResponseComment(DEFAULT_USER_ID, DEFAULT_COLLECTION_ID, DEFAULT_RESPONSE_ID, commentData);

      expect(axios.request).toHaveBeenCalledTimes(1);
      const axiosConfig = axios.request.mock.calls[0][0];
      
      expect(axiosConfig.data).toEqual(commentData);
      expect(result).toBe(mockResponse);
    });

    test('should handle API errors', async () => {
      const mockError = new Error('Validation Error');
      mockError.response = {
        status: 422,
        data: { error: 'Invalid comment data' }
      };
      axios.request.mockRejectedValue(mockError);

      const commentData = {
        body: 'Invalid comment'
      };

      await expect(createResponseComment(DEFAULT_USER_ID, DEFAULT_COLLECTION_ID, DEFAULT_RESPONSE_ID, commentData))
        .rejects.toThrow('Validation Error');

      expect(axios.request).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateResponseComment', () => {
    test('should call PUT /collections/{collectionUid}/responses/{responseUid}/comments/{commentId}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: {
            id: 12345,
            body: 'Updated comment on response',
            createdBy: DEFAULT_USER_ID,
            updatedAt: '2024-01-15T11:00:00.000Z'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const commentData = {
        body: 'Updated comment on response'
      };

      const result = await updateResponseComment(DEFAULT_USER_ID, DEFAULT_COLLECTION_ID, DEFAULT_RESPONSE_ID, '12345', commentData);

      expect(axios.request).toHaveBeenCalledTimes(1);
      const axiosConfig = axios.request.mock.calls[0][0];
      
      expect(axiosConfig.method).toBe('put');
      expect(axiosConfig.url).toBe(`https://api.getpostman.com/collections/${DEFAULT_USER_ID}-${DEFAULT_COLLECTION_ID}/responses/${DEFAULT_USER_ID}-${DEFAULT_RESPONSE_ID}/comments/12345`);
      expect(axiosConfig.data).toEqual(commentData);
      expect(axiosConfig.headers).toMatchObject({
        'Content-Type': 'application/json',
        'X-API-Key': 'test-api-key'
      });
      expect(result).toBe(mockResponse);
    });

    test('should handle API errors', async () => {
      const mockError = new Error('Not Found');
      mockError.response = {
        status: 404,
        data: { error: 'Comment not found' }
      };
      axios.request.mockRejectedValue(mockError);

      const commentData = {
        body: 'Updated comment'
      };

      await expect(updateResponseComment(DEFAULT_USER_ID, DEFAULT_COLLECTION_ID, DEFAULT_RESPONSE_ID, '12345', commentData))
        .rejects.toThrow('Not Found');

      expect(axios.request).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteResponseComment', () => {
    test('should call DELETE /collections/{collectionUid}/responses/{responseUid}/comments/{commentId}', async () => {
      const mockResponse = {
        status: 204,
        data: {}
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await deleteResponseComment(DEFAULT_USER_ID, DEFAULT_COLLECTION_ID, DEFAULT_RESPONSE_ID, '12345');

      expect(axios.request).toHaveBeenCalledTimes(1);
      const axiosConfig = axios.request.mock.calls[0][0];
      
      expect(axiosConfig.method).toBe('delete');
      expect(axiosConfig.url).toBe(`https://api.getpostman.com/collections/${DEFAULT_USER_ID}-${DEFAULT_COLLECTION_ID}/responses/${DEFAULT_USER_ID}-${DEFAULT_RESPONSE_ID}/comments/12345`);
      expect(axiosConfig.headers).toMatchObject({
        'Content-Type': 'application/json',
        'X-API-Key': 'test-api-key'
      });
      expect(result).toBe(mockResponse);
    });

    test('should handle API errors', async () => {
      const mockError = new Error('Not Found');
      mockError.response = {
        status: 404,
        data: { error: 'Comment not found' }
      };
      axios.request.mockRejectedValue(mockError);

      await expect(deleteResponseComment(DEFAULT_USER_ID, DEFAULT_COLLECTION_ID, DEFAULT_RESPONSE_ID, '12345'))
        .rejects.toThrow('Not Found');

      expect(axios.request).toHaveBeenCalledTimes(1);
    });
  });
});

