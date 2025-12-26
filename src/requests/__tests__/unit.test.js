const axios = require('axios');
const { DEFAULT_ID, DEFAULT_UID } = require('../../__tests__/test-helpers');

// Test constants

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

const DEFAULT_USER_ID = '12345';

describe('requests unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createRequest', () => {
    test('should call POST /collections/{collectionId}/requests at collection root', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_ID,
          data: {
            id: DEFAULT_ID,
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

      const result = await createRequest(DEFAULT_ID, requestData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: `https://api.getpostman.com/collections/${DEFAULT_ID}/requests`,
          data: requestData
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include folder query param when provided', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_ID,
          data: {
            id: DEFAULT_ID,
            name: 'Folder Request',
            method: 'POST',
            url: 'https://api.example.com/test',
            folder: DEFAULT_ID
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const requestData = {
        name: 'Folder Request',
        method: 'POST',
        url: 'https://api.example.com/test'
      };

      const result = await createRequest(DEFAULT_ID, requestData, DEFAULT_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: `https://api.getpostman.com/collections/${DEFAULT_ID}/requests?folder=${DEFAULT_ID}`,
          data: requestData
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should not include folder query param when null', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_ID,
          data: {
            id: DEFAULT_ID,
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

      await createRequest(DEFAULT_ID, requestData, null);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `https://api.getpostman.com/collections/${DEFAULT_ID}/requests`
        })
      );
    });

    test('should include all request properties', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_ID,
          data: {
            id: DEFAULT_ID,
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

      const result = await createRequest(DEFAULT_ID, requestData);

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
          model_id: DEFAULT_ID,
          data: {}
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const requestData = {
        name: 'Test Request',
        method: 'GET',
        url: 'https://api.example.com/test'
      };

      await createRequest(DEFAULT_ID, requestData);

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
          model_id: DEFAULT_ID,
          data: {
            id: DEFAULT_ID,
            name: 'Test Request',
            method: 'GET',
            url: 'https://api.example.com/test'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getRequest(DEFAULT_ID, DEFAULT_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `https://api.getpostman.com/collections/${DEFAULT_ID}/requests/${DEFAULT_ID}`
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include ids query param when provided', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_ID,
          data: {
            id: DEFAULT_ID,
            collection: DEFAULT_ID
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getRequest(DEFAULT_ID, DEFAULT_ID, true);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `https://api.getpostman.com/collections/${DEFAULT_ID}/requests/${DEFAULT_ID}?ids=true`
        })
      );
    });

    test('should include uid query param when provided', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_ID,
          data: {
            id: DEFAULT_ID
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getRequest(DEFAULT_ID, DEFAULT_ID, null, true);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `https://api.getpostman.com/collections/${DEFAULT_ID}/requests/${DEFAULT_ID}?uid=true`
        })
      );
    });

    test('should include populate query param when provided', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_ID,
          data: {
            id: DEFAULT_ID,
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

      await getRequest(DEFAULT_ID, DEFAULT_ID, null, null, true);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `https://api.getpostman.com/collections/${DEFAULT_ID}/requests/${DEFAULT_ID}?populate=true`
        })
      );
    });

    test('should include all query params when provided', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_ID,
          data: {}
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getRequest(DEFAULT_ID, DEFAULT_ID, true, true, true);

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
          model_id: DEFAULT_ID,
          data: {}
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getRequest(DEFAULT_ID, DEFAULT_ID, null, null, null);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `https://api.getpostman.com/collections/${DEFAULT_ID}/requests/${DEFAULT_ID}`
        })
      );
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_ID,
          data: {}
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getRequest(DEFAULT_ID, DEFAULT_ID);

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
          model_id: DEFAULT_ID,
          data: {
            id: DEFAULT_ID,
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

      const result = await updateRequest(DEFAULT_ID, DEFAULT_ID, requestData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: `https://api.getpostman.com/collections/${DEFAULT_ID}/requests/${DEFAULT_ID}`,
          data: requestData
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should update only name', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_ID,
          data: {
            id: DEFAULT_ID,
            name: 'New Name'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const requestData = {
        name: 'New Name'
      };

      const result = await updateRequest(DEFAULT_ID, DEFAULT_ID, requestData);

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
          model_id: DEFAULT_ID,
          data: {
            id: DEFAULT_ID,
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

      const result = await updateRequest(DEFAULT_ID, DEFAULT_ID, requestData);

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
          model_id: DEFAULT_ID,
          data: {
            id: DEFAULT_ID,
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

      const result = await updateRequest(DEFAULT_ID, DEFAULT_ID, requestData);

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
          model_id: DEFAULT_ID,
          data: {
            id: DEFAULT_ID,
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

      const result = await updateRequest(DEFAULT_ID, DEFAULT_ID, requestData);

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
          model_id: DEFAULT_ID,
          data: {}
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const requestData = {
        name: 'Updated Request'
      };

      await updateRequest(DEFAULT_ID, DEFAULT_ID, requestData);

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
          model_id: DEFAULT_ID,
          data: {
            id: DEFAULT_ID,
            owner: '12345678'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await deleteRequest(DEFAULT_ID, DEFAULT_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'delete',
          url: `https://api.getpostman.com/collections/${DEFAULT_ID}/requests/${DEFAULT_ID}`
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should return correct response structure', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_ID,
          meta: {
            model: 'request',
            action: 'destroy'
          },
          data: {
            id: DEFAULT_ID,
            owner: '12345678'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await deleteRequest(DEFAULT_ID, DEFAULT_ID);

      expect(result.data).toHaveProperty('model_id', DEFAULT_ID);
      expect(result.data).toHaveProperty('meta');
      expect(result.data.meta).toHaveProperty('action', 'destroy');
      expect(result.data).toHaveProperty('data');
      expect(result.data.data).toHaveProperty('id', DEFAULT_ID);
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: {
          model_id: DEFAULT_ID,
          data: {}
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await deleteRequest(DEFAULT_ID, DEFAULT_ID);

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

      const userId = DEFAULT_USER_ID;
      const collectionId = DEFAULT_UID;
      const requestId = DEFAULT_UID;

      const result = await getRequestComments(collectionId, requestId);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `https://api.getpostman.com/collections/${DEFAULT_UID}/requests/${DEFAULT_UID}/comments`
        })
      );
      expect(result).toEqual(mockResponse);
    });

    

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { data: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getRequestComments(`${DEFAULT_UID}`, `${DEFAULT_UID}`);

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

      const userId = DEFAULT_USER_ID;
      const collectionId = DEFAULT_UID;
      const requestId = DEFAULT_UID;
      const commentData = {
        body: 'Test comment'
      };

      const result = await createRequestComment(collectionId, requestId, commentData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: `https://api.getpostman.com/collections/${DEFAULT_UID}/requests/${DEFAULT_UID}/comments`,
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

      const userId = DEFAULT_USER_ID;
      const collectionId = DEFAULT_UID;
      const requestId = DEFAULT_UID;
      const commentData = {
        body: 'Test comment with @username',
        tags: {
          '@username': {
            type: 'user',
            id: '789'
          }
        }
      };

      await createRequestComment(collectionId, requestId, commentData);

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

      const userId = DEFAULT_USER_ID;
      const collectionId = DEFAULT_UID;
      const requestId = DEFAULT_UID;
      const commentData = {
        body: 'Reply comment',
        threadId: 999
      };

      await createRequestComment(collectionId, requestId, commentData);

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

      await createRequestComment(
        `${DEFAULT_UID}`,
        `${DEFAULT_UID}`,
        commentData
      );

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

      const userId = DEFAULT_USER_ID;
      const collectionId = DEFAULT_UID;
      const requestId = DEFAULT_UID;
      const commentId = '1';
      const commentData = {
        body: 'Updated comment'
      };

      const result = await updateRequestComment(collectionId, requestId, commentId, commentData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: `https://api.getpostman.com/collections/${DEFAULT_UID}/requests/${DEFAULT_UID}/comments/${commentId}`,
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

      const userId = DEFAULT_USER_ID;
      const collectionId = DEFAULT_UID;
      const requestId = DEFAULT_UID;
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

      await updateRequestComment(collectionId, requestId, commentId, commentData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            body: 'Updated with @newuser',
            tags: commentData.tags
          })
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

      await updateRequestComment(`${DEFAULT_UID}`, `${DEFAULT_UID}`, '1', commentData);

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

      const userId = DEFAULT_USER_ID;
      const collectionId = DEFAULT_UID;
      const requestId = DEFAULT_UID;
      const commentId = '1';

      const result = await deleteRequestComment(collectionId, requestId, commentId);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'delete',
          url: `https://api.getpostman.com/collections/${DEFAULT_UID}/requests/${DEFAULT_UID}/comments/${commentId}`
        })
      );
      expect(result).toEqual(mockResponse);
    });

    

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 204,
        data: {}
      };
      axios.request.mockResolvedValue(mockResponse);

      await deleteRequestComment(`${DEFAULT_UID}`, `${DEFAULT_UID}`, '1');

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

