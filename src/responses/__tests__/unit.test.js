const axios = require('axios');
const { DEFAULT_ID, DEFAULT_UID } = require('../../core/__tests__/utils.unit.test');

// Test constants
const DEFAULT_COMMENT_ID = DEFAULT_ID;
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
          model_id: DEFAULT_UID,
          data: {
            id: DEFAULT_UID,
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

      const result = await createResponse(DEFAULT_ID, DEFAULT_ID, responseData);

      expect(axios.request).toHaveBeenCalledTimes(1);
      const axiosConfig = axios.request.mock.calls[0][0];
      
      expect(axiosConfig.method).toBe('post');
      expect(axiosConfig.url).toBe(`https://api.getpostman.com/collections/${DEFAULT_ID}/responses?request=${DEFAULT_ID}`);
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

      await expect(createResponse(DEFAULT_ID, DEFAULT_ID, responseData))
        .rejects.toThrow('API Error');

      expect(axios.request).toHaveBeenCalledTimes(1);
    });
  });

  describe('getResponse', () => {
    test('should call GET /collections/{collectionId}/responses/{responseId} without query params', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_UID,
          data: {
            id: DEFAULT_UID,
            name: 'Test Response',
            code: 200
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getResponse(DEFAULT_ID, DEFAULT_ID);

      expect(axios.request).toHaveBeenCalledTimes(1);
      const axiosConfig = axios.request.mock.calls[0][0];
      
      expect(axiosConfig.method).toBe('get');
      expect(axiosConfig.url).toBe(`https://api.getpostman.com/collections/${DEFAULT_ID}/responses/${DEFAULT_ID}`);
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
          model_id: DEFAULT_UID,
          data: {
            id: DEFAULT_UID,
            request: DEFAULT_ID
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getResponse(DEFAULT_ID, DEFAULT_ID, true);

      expect(axios.request).toHaveBeenCalledTimes(1);
      const axiosConfig = axios.request.mock.calls[0][0];
      
      expect(axiosConfig.method).toBe('get');
      expect(axiosConfig.url).toBe(`https://api.getpostman.com/collections/${DEFAULT_ID}/responses/${DEFAULT_ID}?ids=true`);
      expect(result).toBe(mockResponse);
    });

    test('should call GET with uid query parameter', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_UID,
          data: {
            id: `${DEFAULT_UID}`,
            request: `${DEFAULT_UID}`
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getResponse(DEFAULT_ID, DEFAULT_ID, null, true);

      expect(axios.request).toHaveBeenCalledTimes(1);
      const axiosConfig = axios.request.mock.calls[0][0];
      
      expect(axiosConfig.method).toBe('get');
      expect(axiosConfig.url).toBe(`https://api.getpostman.com/collections/${DEFAULT_ID}/responses/${DEFAULT_ID}?uid=true`);
      expect(result).toBe(mockResponse);
    });

    test('should call GET with populate query parameter', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_UID,
          data: {
            id: DEFAULT_UID,
            name: 'Test Response',
            code: 200,
            body: '{"status": "success"}',
            header: []
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getResponse(DEFAULT_ID, DEFAULT_ID, null, true);

      expect(axios.request).toHaveBeenCalledTimes(1);
      const axiosConfig = axios.request.mock.calls[0][0];
      
      expect(axiosConfig.method).toBe('get');
      expect(axiosConfig.url).toBe(`https://api.getpostman.com/collections/${DEFAULT_ID}/responses/${DEFAULT_ID}?uid=true`);
      expect(result).toBe(mockResponse);
    });

    test('should call GET with multiple query parameters', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_UID,
          data: {
            id: `${DEFAULT_UID}`,
            name: 'Test Response',
            code: 200
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getResponse(DEFAULT_ID, DEFAULT_ID, true, true, true);

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

      await expect(getResponse(DEFAULT_ID, DEFAULT_ID))
        .rejects.toThrow('Not Found');

      expect(axios.request).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateResponse', () => {
    test('should call PUT /collections/{collectionId}/responses/{responseId}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_UID,
          data: {
            id: DEFAULT_UID,
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

      const result = await updateResponse(DEFAULT_ID, DEFAULT_ID, responseData);

      expect(axios.request).toHaveBeenCalledTimes(1);
      const axiosConfig = axios.request.mock.calls[0][0];
      
      expect(axiosConfig.method).toBe('put');
      expect(axiosConfig.url).toBe(`https://api.getpostman.com/collections/${DEFAULT_ID}/responses/${DEFAULT_ID}`);
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

      await expect(updateResponse(DEFAULT_ID,DEFAULT_ID, responseData))
        .rejects.toThrow('Validation Error');

      expect(axios.request).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteResponse', () => {
    test('should call DELETE /collections/{collectionId}/responses/{responseId}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_UID,
          meta: {
            model: 'response',
            action: 'delete'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await deleteResponse(DEFAULT_ID, DEFAULT_ID);

      expect(axios.request).toHaveBeenCalledTimes(1);
      const axiosConfig = axios.request.mock.calls[0][0];
      
      expect(axiosConfig.method).toBe('delete');
      expect(axiosConfig.url).toBe(`https://api.getpostman.com/collections/${DEFAULT_ID}/responses/${DEFAULT_ID}`);
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

      await expect(deleteResponse(DEFAULT_ID, DEFAULT_ID))
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

      const result = await getResponseComments(DEFAULT_UID, DEFAULT_UID);

      expect(axios.request).toHaveBeenCalledTimes(1);
      const axiosConfig = axios.request.mock.calls[0][0];
      
      expect(axiosConfig.method).toBe('get');
      expect(axiosConfig.url).toBe(`https://api.getpostman.com/collections/${DEFAULT_UID}/responses/${DEFAULT_UID}/comments`);
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

      await expect(getResponseComments(DEFAULT_UID, DEFAULT_UID))
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

      const result = await createResponseComment(DEFAULT_UID, DEFAULT_UID, commentData);

      expect(axios.request).toHaveBeenCalledTimes(1);
      const axiosConfig = axios.request.mock.calls[0][0];
      
      expect(axiosConfig.method).toBe('post');
      expect(axiosConfig.url).toBe(`https://api.getpostman.com/collections/${DEFAULT_UID}/responses/${DEFAULT_UID}/comments`);
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

      const result = await createResponseComment(DEFAULT_UID, DEFAULT_UID, commentData);

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

      await expect(createResponseComment(DEFAULT_UID, DEFAULT_UID, commentData))
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

      const result = await updateResponseComment(DEFAULT_UID, DEFAULT_UID, '12345', commentData);

      expect(axios.request).toHaveBeenCalledTimes(1);
      const axiosConfig = axios.request.mock.calls[0][0];
      
      expect(axiosConfig.method).toBe('put');
      expect(axiosConfig.url).toBe(`https://api.getpostman.com/collections/${DEFAULT_UID}/responses/${DEFAULT_UID}/comments/12345`);
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

      await expect(updateResponseComment(DEFAULT_UID, DEFAULT_UID, '12345', commentData))
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

      const result = await deleteResponseComment(DEFAULT_UID, DEFAULT_UID, '12345');

      expect(axios.request).toHaveBeenCalledTimes(1);
      const axiosConfig = axios.request.mock.calls[0][0];
      
      expect(axiosConfig.method).toBe('delete');
      expect(axiosConfig.url).toBe(`https://api.getpostman.com/collections/${DEFAULT_UID}/responses/${DEFAULT_UID}/comments/12345`);
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

      await expect(deleteResponseComment(DEFAULT_UID, DEFAULT_UID, '12345'))
        .rejects.toThrow('Not Found');

      expect(axios.request).toHaveBeenCalledTimes(1);
    });
  });
});

