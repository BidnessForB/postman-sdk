const axios = require('axios');
const {
  createRequest,
  getRequest,
  updateRequest,
  deleteRequest,
  getRequestComments,
  createRequestComment,
  updateRequestComment,
  deleteRequestComment
} = require('../index');

jest.mock('axios');
jest.mock('../../core/config', () => ({
  apiKey: 'test-api-key',
  baseUrl: 'https://api.getpostman.com'
}));

const DEFAULT_COLLECTION_ID = 'c6d2471c-3664-47b5-adc8-35d52484f2f6';
const DEFAULT_REQUEST_ID = 'a1b2c3d4-5678-90ab-cdef-1234567890ab';
const DEFAULT_FOLDER_ID = 'b2c3d4e5-6789-01bc-de23-4567890abcde';

describe('requests unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createRequest', () => {
    test('should call POST /collections/{collectionId}/requests at collection root', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_REQUEST_ID,
          data: {
            id: DEFAULT_REQUEST_ID,
            name: 'Test Request',
            method: 'GET',
            url: 'https://api.example.com/test'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const requestData = {
        name: 'Test Request',
        method: 'GET',
        url: 'https://api.example.com/test',
        description: 'Test request description'
      };

      const result = await createRequest(DEFAULT_COLLECTION_ID, requestData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: `https://api.getpostman.com/collections/${DEFAULT_COLLECTION_ID}/requests`,
          data: requestData
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include folder query param when provided', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_REQUEST_ID,
          data: {
            id: DEFAULT_REQUEST_ID,
            name: 'Folder Request',
            method: 'POST',
            url: 'https://api.example.com/test',
            folder: DEFAULT_FOLDER_ID
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const requestData = {
        name: 'Folder Request',
        method: 'POST',
        url: 'https://api.example.com/test'
      };

      const result = await createRequest(DEFAULT_COLLECTION_ID, requestData, DEFAULT_FOLDER_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: `https://api.getpostman.com/collections/${DEFAULT_COLLECTION_ID}/requests?folder=${DEFAULT_FOLDER_ID}`,
          data: requestData
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should not include folder query param when null', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_REQUEST_ID,
          data: {
            id: DEFAULT_REQUEST_ID,
            name: 'Test Request'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const requestData = {
        name: 'Test Request',
        method: 'GET',
        url: 'https://api.example.com/test'
      };

      await createRequest(DEFAULT_COLLECTION_ID, requestData, null);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `https://api.getpostman.com/collections/${DEFAULT_COLLECTION_ID}/requests`
        })
      );
    });

    test('should include all request properties', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_REQUEST_ID,
          data: {
            id: DEFAULT_REQUEST_ID,
            name: 'Complex Request'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const requestData = {
        name: 'Complex Request',
        method: 'POST',
        url: 'https://api.example.com/users',
        description: 'Create a new user',
        headers: 'Content-Type: application/json\n',
        dataMode: 'raw',
        rawModeData: '{"name": "John Doe"}',
        dataOptions: {
          raw: {
            language: 'json'
          }
        },
        queryParams: [
          { key: 'active', value: true, enabled: true }
        ]
      };

      const result = await createRequest(DEFAULT_COLLECTION_ID, requestData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: 'Complex Request',
            method: 'POST',
            url: 'https://api.example.com/users',
            description: 'Create a new user',
            headers: 'Content-Type: application/json\n',
            dataMode: 'raw',
            rawModeData: '{"name": "John Doe"}',
            dataOptions: {
              raw: {
                language: 'json'
              }
            },
            queryParams: expect.arrayContaining([
              expect.objectContaining({
                key: 'active',
                value: true,
                enabled: true
              })
            ])
          })
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_REQUEST_ID,
          data: {}
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const requestData = {
        name: 'Test Request',
        method: 'GET',
        url: 'https://api.example.com/test'
      };

      await createRequest(DEFAULT_COLLECTION_ID, requestData);

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

  describe('getRequest', () => {
    test('should call GET /collections/{collectionId}/requests/{requestId}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_REQUEST_ID,
          data: {
            id: DEFAULT_REQUEST_ID,
            name: 'Test Request',
            method: 'GET',
            url: 'https://api.example.com/test'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getRequest(DEFAULT_COLLECTION_ID, DEFAULT_REQUEST_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `https://api.getpostman.com/collections/${DEFAULT_COLLECTION_ID}/requests/${DEFAULT_REQUEST_ID}`
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include ids query param when provided', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_REQUEST_ID,
          data: {
            id: DEFAULT_REQUEST_ID,
            collection: DEFAULT_COLLECTION_ID
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getRequest(DEFAULT_COLLECTION_ID, DEFAULT_REQUEST_ID, true);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `https://api.getpostman.com/collections/${DEFAULT_COLLECTION_ID}/requests/${DEFAULT_REQUEST_ID}?ids=true`
        })
      );
    });

    test('should include uid query param when provided', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_REQUEST_ID,
          data: {
            id: DEFAULT_REQUEST_ID
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getRequest(DEFAULT_COLLECTION_ID, DEFAULT_REQUEST_ID, null, true);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `https://api.getpostman.com/collections/${DEFAULT_COLLECTION_ID}/requests/${DEFAULT_REQUEST_ID}?uid=true`
        })
      );
    });

    test('should include populate query param when provided', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_REQUEST_ID,
          data: {
            id: DEFAULT_REQUEST_ID,
            name: 'Test Request',
            method: 'GET',
            url: 'https://api.example.com/test',
            headers: [],
            queryParams: [],
            data: null
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getRequest(DEFAULT_COLLECTION_ID, DEFAULT_REQUEST_ID, null, null, true);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `https://api.getpostman.com/collections/${DEFAULT_COLLECTION_ID}/requests/${DEFAULT_REQUEST_ID}?populate=true`
        })
      );
    });

    test('should include all query params when provided', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_REQUEST_ID,
          data: {}
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getRequest(DEFAULT_COLLECTION_ID, DEFAULT_REQUEST_ID, true, true, true);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('ids=true'),
          url: expect.stringContaining('uid=true'),
          url: expect.stringContaining('populate=true')
        })
      );
    });

    test('should not include query params when null', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_REQUEST_ID,
          data: {}
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getRequest(DEFAULT_COLLECTION_ID, DEFAULT_REQUEST_ID, null, null, null);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `https://api.getpostman.com/collections/${DEFAULT_COLLECTION_ID}/requests/${DEFAULT_REQUEST_ID}`
        })
      );
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_REQUEST_ID,
          data: {}
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getRequest(DEFAULT_COLLECTION_ID, DEFAULT_REQUEST_ID);

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

  describe('updateRequest', () => {
    test('should call PUT /collections/{collectionId}/requests/{requestId}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_REQUEST_ID,
          data: {
            id: DEFAULT_REQUEST_ID,
            name: 'Updated Request',
            method: 'POST',
            url: 'https://api.example.com/updated'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const requestData = {
        name: 'Updated Request',
        method: 'POST',
        url: 'https://api.example.com/updated',
        description: 'Updated description'
      };

      const result = await updateRequest(DEFAULT_COLLECTION_ID, DEFAULT_REQUEST_ID, requestData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: `https://api.getpostman.com/collections/${DEFAULT_COLLECTION_ID}/requests/${DEFAULT_REQUEST_ID}`,
          data: requestData
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should update only name', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_REQUEST_ID,
          data: {
            id: DEFAULT_REQUEST_ID,
            name: 'New Name'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const requestData = {
        name: 'New Name'
      };

      const result = await updateRequest(DEFAULT_COLLECTION_ID, DEFAULT_REQUEST_ID, requestData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            name: 'New Name'
          }
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should update method and url', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_REQUEST_ID,
          data: {
            id: DEFAULT_REQUEST_ID,
            method: 'DELETE',
            url: 'https://api.example.com/delete'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const requestData = {
        method: 'DELETE',
        url: 'https://api.example.com/delete'
      };

      const result = await updateRequest(DEFAULT_COLLECTION_ID, DEFAULT_REQUEST_ID, requestData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            method: 'DELETE',
            url: 'https://api.example.com/delete'
          })
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should update request body data', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_REQUEST_ID,
          data: {
            id: DEFAULT_REQUEST_ID,
            dataMode: 'raw',
            rawModeData: '{"updated": true}'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const requestData = {
        dataMode: 'raw',
        rawModeData: '{"updated": true}',
        dataOptions: {
          raw: {
            language: 'json'
          }
        }
      };

      const result = await updateRequest(DEFAULT_COLLECTION_ID, DEFAULT_REQUEST_ID, requestData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            dataMode: 'raw',
            rawModeData: '{"updated": true}',
            dataOptions: {
              raw: {
                language: 'json'
              }
            }
          })
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should update auth configuration', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_REQUEST_ID,
          data: {
            id: DEFAULT_REQUEST_ID,
            auth: {
              type: 'apikey'
            }
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const requestData = {
        auth: {
          type: 'apikey',
          apikey: [
            {
              key: 'key',
              value: 'x-api-key'
            },
            {
              key: 'value',
              value: '{{apiKey}}'
            }
          ]
        }
      };

      const result = await updateRequest(DEFAULT_COLLECTION_ID, DEFAULT_REQUEST_ID, requestData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            auth: expect.objectContaining({
              type: 'apikey',
              apikey: expect.arrayContaining([
                expect.objectContaining({ key: 'key' }),
                expect.objectContaining({ key: 'value' })
              ])
            })
          })
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_REQUEST_ID,
          data: {}
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const requestData = {
        name: 'Updated Request'
      };

      await updateRequest(DEFAULT_COLLECTION_ID, DEFAULT_REQUEST_ID, requestData);

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

  describe('deleteRequest', () => {
    test('should call DELETE /collections/{collectionId}/requests/{requestId}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_REQUEST_ID,
          data: {
            id: DEFAULT_REQUEST_ID,
            owner: '12345678'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await deleteRequest(DEFAULT_COLLECTION_ID, DEFAULT_REQUEST_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'delete',
          url: `https://api.getpostman.com/collections/${DEFAULT_COLLECTION_ID}/requests/${DEFAULT_REQUEST_ID}`
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should return correct response structure', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_REQUEST_ID,
          meta: {
            model: 'request',
            action: 'destroy'
          },
          data: {
            id: DEFAULT_REQUEST_ID,
            owner: '12345678'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await deleteRequest(DEFAULT_COLLECTION_ID, DEFAULT_REQUEST_ID);

      expect(result.data).toHaveProperty('model_id', DEFAULT_REQUEST_ID);
      expect(result.data).toHaveProperty('meta');
      expect(result.data.meta).toHaveProperty('action', 'destroy');
      expect(result.data).toHaveProperty('data');
      expect(result.data.data).toHaveProperty('id', DEFAULT_REQUEST_ID);
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_REQUEST_ID,
          data: {}
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await deleteRequest(DEFAULT_COLLECTION_ID, DEFAULT_REQUEST_ID);

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

  describe('getRequestComments', () => {
    test('should call GET /collections/{collectionUid}/requests/{requestUid}/comments', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: [
            {
              id: 1,
              threadId: 123,
              createdBy: 456,
              body: 'Test comment'
            }
          ]
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = '12345';
      const collectionId = 'col-123';
      const requestId = 'req-123';

      const result = await getRequestComments(userId, collectionId, requestId);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: 'https://api.getpostman.com/collections/12345-col-123/requests/12345-req-123/comments'
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should build UID correctly', async () => {
      const mockResponse = {
        status: 200,
        data: { data: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getRequestComments('34829850', 'd4dd588d-111f-4651-b64d-463e4b093f4b', 'a1b2c3d4-1234-5678-9abc-def012345678');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.getpostman.com/collections/34829850-d4dd588d-111f-4651-b64d-463e4b093f4b/requests/34829850-a1b2c3d4-1234-5678-9abc-def012345678/comments'
        })
      );
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { data: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getRequestComments('123', 'col-123', 'req-123');

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

  describe('createRequestComment', () => {
    test('should call POST /collections/{collectionUid}/requests/{requestUid}/comments', async () => {
      const mockResponse = {
        status: 201,
        data: {
          data: {
            id: 1,
            threadId: 123,
            body: 'Test comment',
            createdBy: 456,
            createdAt: '2024-01-18T12:00:00.000Z',
            updatedAt: '2024-01-18T12:00:00.000Z'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = '12345';
      const collectionId = 'col-123';
      const requestId = 'req-123';
      const commentData = {
        body: 'Test comment'
      };

      const result = await createRequestComment(userId, collectionId, requestId, commentData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: 'https://api.getpostman.com/collections/12345-col-123/requests/12345-req-123/comments',
          data: commentData
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include tags in comment data', async () => {
      const mockResponse = {
        status: 201,
        data: { data: {} }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = '12345';
      const collectionId = 'col-123';
      const requestId = 'req-123';
      const commentData = {
        body: 'Test comment with @username',
        tags: {
          '@username': {
            type: 'user',
            id: '789'
          }
        }
      };

      await createRequestComment(userId, collectionId, requestId, commentData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            body: 'Test comment with @username',
            tags: commentData.tags
          })
        })
      );
    });

    test('should include threadId when provided', async () => {
      const mockResponse = {
        status: 201,
        data: { data: {} }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = '12345';
      const collectionId = 'col-123';
      const requestId = 'req-123';
      const commentData = {
        body: 'Reply comment',
        threadId: 999
      };

      await createRequestComment(userId, collectionId, requestId, commentData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            body: 'Reply comment',
            threadId: 999
          })
        })
      );
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 201,
        data: { data: {} }
      };
      axios.request.mockResolvedValue(mockResponse);

      const commentData = { body: 'Test' };

      await createRequestComment('123', 'col-123', 'req-123', commentData);

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

  describe('updateRequestComment', () => {
    test('should call PUT /collections/{collectionUid}/requests/{requestUid}/comments/{commentId}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: {
            id: 1,
            threadId: 123,
            body: 'Updated comment',
            createdBy: 456,
            createdAt: '2024-01-18T12:00:00.000Z',
            updatedAt: '2024-01-18T12:05:00.000Z'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = '12345';
      const collectionId = 'col-123';
      const requestId = 'req-123';
      const commentId = '1';
      const commentData = {
        body: 'Updated comment'
      };

      const result = await updateRequestComment(userId, collectionId, requestId, commentId, commentData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: 'https://api.getpostman.com/collections/12345-col-123/requests/12345-req-123/comments/1',
          data: commentData
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should update tags in comment', async () => {
      const mockResponse = {
        status: 200,
        data: { data: {} }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = '12345';
      const collectionId = 'col-123';
      const requestId = 'req-123';
      const commentId = '1';
      const commentData = {
        body: 'Updated with @newuser',
        tags: {
          '@newuser': {
            type: 'user',
            id: '999'
          }
        }
      };

      await updateRequestComment(userId, collectionId, requestId, commentId, commentData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            body: 'Updated with @newuser',
            tags: commentData.tags
          })
        })
      );
    });

    test('should build correct URL with commentId', async () => {
      const mockResponse = {
        status: 200,
        data: { data: {} }
      };
      axios.request.mockResolvedValue(mockResponse);

      await updateRequestComment('123', 'col-456', 'req-789', '999', { body: 'test' });

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.getpostman.com/collections/123-col-456/requests/123-req-789/comments/999'
        })
      );
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { data: {} }
      };
      axios.request.mockResolvedValue(mockResponse);

      const commentData = { body: 'Updated' };

      await updateRequestComment('123', 'col-123', 'req-123', '1', commentData);

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

  describe('deleteRequestComment', () => {
    test('should call DELETE /collections/{collectionUid}/requests/{requestUid}/comments/{commentId}', async () => {
      const mockResponse = {
        status: 204,
        data: {}
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = '12345';
      const collectionId = 'col-123';
      const requestId = 'req-123';
      const commentId = '1';

      const result = await deleteRequestComment(userId, collectionId, requestId, commentId);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'delete',
          url: 'https://api.getpostman.com/collections/12345-col-123/requests/12345-req-123/comments/1'
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should build correct URL with commentId', async () => {
      const mockResponse = {
        status: 204,
        data: {}
      };
      axios.request.mockResolvedValue(mockResponse);

      await deleteRequestComment('456', 'col-789', 'req-012', '345');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.getpostman.com/collections/456-col-789/requests/456-req-012/comments/345'
        })
      );
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 204,
        data: {}
      };
      axios.request.mockResolvedValue(mockResponse);

      await deleteRequestComment('123', 'col-123', 'req-123', '1');

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

