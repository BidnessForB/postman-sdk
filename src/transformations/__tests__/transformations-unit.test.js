/**
 * Transformations Unit Tests
 * 
 * Tests for transformation-related API endpoints that enable bi-directional
 * synchronization and generation between specs and collections.
 */

const axios = require('axios');
const {
  createSpecGeneration,
  getSpecTaskStatus,
  getSpecGenerations,
  syncSpecWithCollection
} = require('../../specs');
const {
  createCollectionGeneration,
  getCollectionTaskStatus,
  getCollectionGenerations,
  syncCollectionWithSpec
} = require('../../collections');
const { DEFAULT_USER_ID, DEFAULT_UID, DEFAULT_ID } = require('../../__tests__/test-helpers');

jest.mock('axios');
jest.mock('../../core/config', () => ({
  apiKey: 'test-api-key',
  baseUrl: 'https://api.getpostman.com'
}));

describe('transformations unit tests', () => {
  
  

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Spec-to-Collection Transformations', () => {
    describe('createSpecGeneration', () => {
      test('should call POST /specs/{specId}/generations/{elementType} with full params', async () => {
        const mockResponse = {
          status: 202,
          data: {
            taskId: '66ae9950-0869-4e65-96b0-1e0e47e771af',
            url: '/specs/73e15000-bc7a-4802-b80e-05fff18fd7f8/tasks/66ae9950-0869-4e65-96b0-1e0e47e771af'
          }
        };
        axios.request.mockResolvedValue(mockResponse);

        const name = 'Generated Collection';
        const options = {
          requestNameSource: 'Fallback',
          folderStrategy: 'Paths',
          includeAuthInfoInExample: true
        };
        const result = await createSpecGeneration(DEFAULT_ID, 'collection', name, options);

        expect(axios.request).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'post',
            url: `https://api.getpostman.com/specs/${DEFAULT_ID}/generations/collection`,
            data: {
              name,
              options
            }
          })
        );
        expect(result).toEqual(mockResponse);
        expect(result.data.taskId).toBe('66ae9950-0869-4e65-96b0-1e0e47e771af');
      });

      test('should call POST with only name parameter', async () => {
        const mockResponse = {
          status: 202,
          data: {
            taskId: 'task-123',
            url: '/specs/spec-123/tasks/task-123'
          }
        };
        axios.request.mockResolvedValue(mockResponse);

        const name = 'My Collection';
        await createSpecGeneration(DEFAULT_ID, 'collection', name, null);

        expect(axios.request).toHaveBeenCalledWith(
          expect.objectContaining({
            data: {
              name: 'My Collection'
            }
          })
        );
      });

      test('should call POST with only options parameter', async () => {
        const mockResponse = {
          status: 202,
          data: {
            taskId: 'task-456',
            url: '/specs/spec-456/tasks/task-456'
          }
        };
        axios.request.mockResolvedValue(mockResponse);

        const options = {
          requestNameSource: 'Fallback'
        };
        await createSpecGeneration(DEFAULT_ID, 'collection', null, options);

        expect(axios.request).toHaveBeenCalledWith(
          expect.objectContaining({
            data: {
              options: {
                requestNameSource: 'Fallback'
              }
            }
          })
        );
      });

      test('should call POST with no optional parameters', async () => {
        const mockResponse = {
          status: 202,
          data: {
            taskId: 'task-789',
            url: '/specs/spec-789/tasks/task-789'
          }
        };
        axios.request.mockResolvedValue(mockResponse);

        await createSpecGeneration(DEFAULT_ID, 'collection');

        expect(axios.request).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'post',
            url: `https://api.getpostman.com/specs/${DEFAULT_ID}/generations/collection`,
            data: null
          })
        );
      });

      test('should include correct headers', async () => {
        const mockResponse = {
          status: 202,
          data: {
            taskId: 'task-123',
            url: '/specs/spec-123/tasks/task-123'
          }
        };
        axios.request.mockResolvedValue(mockResponse);

        await createSpecGeneration(DEFAULT_ID, 'collection', 'Test', null);

        expect(axios.request).toHaveBeenCalledWith(
          expect.objectContaining({
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': 'test-api-key'
            }
          })
        );
      });

      test('should handle different element types', async () => {
        const mockResponse = {
          status: 202,
          data: {
            taskId: 'task-999',
            url: '/specs/spec-999/tasks/task-999'
          }
        };
        axios.request.mockResolvedValue(mockResponse);

        await createSpecGeneration(DEFAULT_ID, 'collection', 'Test Collection');

        expect(axios.request).toHaveBeenCalledWith(
          expect.objectContaining({
            url: expect.stringContaining('/generations/collection')
          })
        );
      });
    });

    describe('getSpecTaskStatus', () => {
      test('should call GET /specs/{specId}/tasks/{taskId}', async () => {
        const taskId = '11223344-5566-7788-99aa-bbccddeeff00';
        const mockResponse = {
          status: 200,
          data: {
            status: 'completed',
            meta: {
              model: 'collection',
              action: 'generation'
            }
          }
        };
        axios.request.mockResolvedValue(mockResponse);

        const result = await getSpecTaskStatus(DEFAULT_ID, taskId);

        expect(axios.request).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'get',
            url: `https://api.getpostman.com/specs/${DEFAULT_ID}/tasks/${taskId}`,
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
              'X-API-Key': expect.any(String)
            })
          })
        );
        expect(result).toEqual(mockResponse);
        expect(result.data.status).toBe('completed');
        expect(result.data.meta.model).toBe('collection');
      });

      test('should handle pending status', async () => {
        const taskId = '22334455-6677-8899-aabb-ccddeeff0011';
        const mockResponse = {
          status: 200,
          data: {
            status: 'pending',
            meta: {
              model: 'spec',
              action: 'generation'
            }
          }
        };
        axios.request.mockResolvedValue(mockResponse);

        const result = await getSpecTaskStatus(DEFAULT_ID, taskId);

        expect(result.data.status).toBe('pending');
      });

      test('should throw error for non-existent task', async () => {
        const error = new Error('Request failed with status code 404');
        error.response = {
          status: 404,
          data: {
            type: 'notFoundError',
            title: 'Instance not found',
            status: 404,
            detail: 'Entity that you are trying to access does not exist.'
          }
        };
        axios.request.mockRejectedValue(error);

        await expect(
          getSpecTaskStatus(DEFAULT_ID, 'non-existent-task')
        ).rejects.toThrow();
      });
    });

    describe('getSpecGenerations', () => {
      test('should call GET /specs/{specId}/generations/{elementType} without query params', async () => {
        const mockResponse = {
          status: 200,
          data: {
            collections: [
              {
                id: 'col-123',
                name: 'Generated Collection',
                state: 'in-sync',
                createdAt: '2025-03-17T11:03:15Z',
                updatedAt: '2025-03-17T12:03:15Z',
                createdBy: 12345678,
                updatedBy: 12345678
              }
            ],
            meta: {
              nextCursor: null
            }
          }
        };
        axios.request.mockResolvedValue(mockResponse);

        const result = await getSpecGenerations(DEFAULT_ID, 'collection');

        expect(axios.request).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'get',
            url: `https://api.getpostman.com/specs/${DEFAULT_ID}/generations/collection`,
          })
        );
        expect(result.status).toBe(200);
        expect(result.data.collections).toHaveLength(1);
        expect(result.data.meta).toHaveProperty('nextCursor');
      });

      test('should include limit and cursor query params when provided', async () => {
        const mockResponse = {
          status: 200,
          data: {
            collections: [],
            meta: {
              nextCursor: 'cursor-abc'
            }
          }
        };
        axios.request.mockResolvedValue(mockResponse);

        const result = await getSpecGenerations(DEFAULT_ID, 'collection', 5, 'cursor-123');

        expect(axios.request).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'get',
            url: `https://api.getpostman.com/specs/${DEFAULT_ID}/generations/collection?limit=5&cursor=cursor-123`,
          })
        );
        expect(result.status).toBe(200);
      });

      test('should handle null optional parameters', async () => {
        const mockResponse = {
          status: 200,
          data: {
            collections: [],
            meta: { nextCursor: null }
          }
        };
        axios.request.mockResolvedValue(mockResponse);

        await getSpecGenerations(DEFAULT_ID, 'collection', null, null);

        expect(axios.request).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'get',
            url: `https://api.getpostman.com/specs/${DEFAULT_ID}/generations/collection`,
          })
        );
      });

      test('should include correct headers', async () => {
        const mockResponse = { status: 200, data: { collections: [], meta: {} } };
        axios.request.mockResolvedValue(mockResponse);

        await getSpecGenerations(DEFAULT_ID, 'collection');

        expect(axios.request).toHaveBeenCalledWith(
          expect.objectContaining({
            headers: expect.objectContaining({
              'X-API-Key': expect.any(String),
              'Content-Type': 'application/json'
            })
          })
        );
      });
    });

    describe('syncCollectionWithSpec', () => {
      test('should call PUT /collections/{collectionUid}/synchronizations with specId query param', async () => {
        const mockResponse = {
          status: 202,
          data: {
            taskId: '66ae9950-0869-4e65-96b0-1e0e47e771af',
            url: '/collections/12345678-c6d2471c-3664-47b5-adc8-35d52484f2f6/tasks/66ae9950-0869-4e65-96b0-1e0e47e771af'
          }
        };
        axios.request.mockResolvedValue(mockResponse);

        
        const result = await syncCollectionWithSpec( DEFAULT_UID, DEFAULT_ID);

        expect(axios.request).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'put',
            url: `https://api.getpostman.com/collections/${DEFAULT_UID}/synchronizations?specId=${DEFAULT_ID}`
          })
        );
        expect(result).toEqual(mockResponse);
      });

      test('should include correct headers', async () => {
        const mockResponse = {
          status: 202,
          data: {
            taskId: 'test-task-id',
            url: '/collections/12345678-c6d2471c-3664-47b5-adc8-35d52484f2f6/tasks/test-task-id'
          }
        };
        axios.request.mockResolvedValue(mockResponse);

        
        
        

        await syncCollectionWithSpec(DEFAULT_UID, DEFAULT_ID);

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

  describe('Collection-to-Spec Transformations', () => {
    describe('createCollectionGeneration', () => {
      test('should call POST /collections/{collectionUid}/generations/{elementType}', async () => {
        const mockResponse = {
          status: 200,
          data: {
            taskId: '66ae9950-0869-4e65-96b0-1e0e47e771af',
            url: '/collections/12345678-c6d2471c-3664-47b5-adc8-35d52484f2f6/tasks/66ae9950-0869-4e65-96b0-1e0e47e771af'
          }
        };
        axios.request.mockResolvedValue(mockResponse);

        
        
        const elementType = 'spec';
        const name = 'My Generated Spec';
        const type = 'OPENAPI:3.0';
        const format = 'JSON';

        const result = await createCollectionGeneration(DEFAULT_UID, elementType, name, type, format);

        expect(axios.request).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'post',
            url: `https://api.getpostman.com/collections/${DEFAULT_UID}/generations/spec`,
            data: {
              name: 'My Generated Spec',
              type: 'OPENAPI:3.0',
              format: 'JSON'
            }
          })
        );
        expect(result).toEqual(mockResponse);
        expect(result.data.taskId).toBeDefined();
        expect(result.data.url).toBeDefined();
      });

      test('should include correct headers', async () => {
        const mockResponse = {
          status: 200,
          data: {
            taskId: 'test-task-id',
            url: '/collections/test-collection/tasks/test-task-id'
          }
        };
        axios.request.mockResolvedValue(mockResponse);

        
        
        const elementType = 'spec';
        const name = 'Test Spec';
        const type = 'OPENAPI:3.0';
        const format = 'YAML';

        await createCollectionGeneration(DEFAULT_UID, elementType, name, type, format);

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

    describe('getCollectionGenerations', () => {
      test('should call GET /collections/{collectionUid}/generations/{elementType}', async () => {
        const mockResponse = {
          status: 200,
          data: {
            meta: {
              nextCursor: null
            },
            specs: [
              {
                id: 'e8a015e0-f472-4bb3-a523-57ce7c4583ef',
                name: 'Sample API',
                state: 'in-sync',
                createdAt: '2022-03-29T11:37:15Z',
                updatedAt: '2022-03-29T11:37:15Z',
                createdBy: 12345678,
                updatedBy: 12345678
              }
            ]
          }
        };
        axios.request.mockResolvedValue(mockResponse);

        
        
        const elementType = 'spec';

        const result = await getCollectionGenerations(DEFAULT_UID, elementType);

        expect(axios.request).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'get',
            url: `https://api.getpostman.com/collections/${DEFAULT_UID}/generations/spec`
          })
        );
        expect(result).toEqual(mockResponse);
        expect(result.data.specs).toBeDefined();
        expect(Array.isArray(result.data.specs)).toBe(true);
      });

      test('should include correct headers', async () => {
        const mockResponse = {
          status: 200,
          data: {
            meta: { nextCursor: null },
            specs: []
          }
        };
        axios.request.mockResolvedValue(mockResponse);

        
        
        const elementType = 'spec';

        await getCollectionGenerations(DEFAULT_UID, elementType);

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

    describe('getCollectionTaskStatus', () => {
      test('should call GET /collections/{collectionUid}/tasks/{taskId}', async () => {
        const mockResponse = {
          status: 200,
          data: {
            status: 'completed',
            meta: {
              model: 'spec',
              action: 'generation'
            },
            details: {
              resources: [
                {
                  id: 'spec-id-123',
                  name: 'Generated Spec'
                }
              ]
            }
          }
        };
        axios.request.mockResolvedValue(mockResponse);

        
        
        

        const result = await getCollectionTaskStatus(DEFAULT_UID, DEFAULT_ID);

        expect(axios.request).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'get',
            url: `https://api.getpostman.com/collections/${DEFAULT_UID}/tasks/${DEFAULT_ID}`
          })
        );
        expect(result).toEqual(mockResponse);
        expect(result.data.status).toBeDefined();
      });

      test('should include correct headers', async () => {
        const mockResponse = {
          status: 200,
          data: {
            status: 'pending'
          }
        };
        axios.request.mockResolvedValue(mockResponse);

        
        
        

        await getCollectionTaskStatus(DEFAULT_UID, DEFAULT_ID);

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

    describe('syncSpecWithCollection', () => {
      test('should call PUT /specs/{specId}/synchronizations with collectionUid query param', async () => {
        const mockResponse = {
          status: 202,
          data: {
            taskId: '66ae9950-0869-4e65-96b0-1e0e47e771af',
            url: '/specs/73e15000-bc7a-4802-b80e-05fff18fd7f8/tasks/66ae9950-0869-4e65-96b0-1e0e47e771af'
          }
        };
        axios.request.mockResolvedValue(mockResponse);

        

        const result = await syncSpecWithCollection(DEFAULT_ID, DEFAULT_UID);

        expect(axios.request).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'put',
            url: `https://api.getpostman.com/specs/${DEFAULT_ID}/synchronizations?collectionUid=${DEFAULT_UID}`
          })
        );
        expect(result.status).toBe(202);
        expect(result.data).toHaveProperty('taskId');
        expect(result.data).toHaveProperty('url');
      });

      test('should include correct headers', async () => {
        const mockResponse = {
          status: 202,
          data: {
            taskId: 'test-task-id',
            url: '/specs/test-spec/tasks/test-task-id'
          }
        };
        axios.request.mockResolvedValue(mockResponse);

        

        await syncSpecWithCollection(DEFAULT_ID, DEFAULT_UID);

        expect(axios.request).toHaveBeenCalledWith(
          expect.objectContaining({
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
              'X-API-Key': expect.any(String)
            })
          })
        );
      });
    });
  });
});
