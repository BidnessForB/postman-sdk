const axios = require('axios');
const { 
  getCollections, 
  createCollection,
  getCollection,
  updateCollection,
  modifyCollection,
  deleteCollection,
  createFolder,
  getFolder,
  updateFolder,
  deleteFolder,
  getFolderComments,
  createFolderComment,
  updateFolderComment,
  deleteFolderComment,
  syncCollectionWithSpec,
  createCollectionGeneration,
  getCollectionGenerations
} = require('../index');

jest.mock('axios');
jest.mock('../../core/config', () => ({
  apiKey: 'test-api-key',
  baseUrl: 'https://api.getpostman.com'
}));

describe('collections unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCollections', () => {
    test('should call GET /collections without query params', async () => {
      const mockResponse = {
        status: 200,
        data: { collections: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getCollections();

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: 'https://api.getpostman.com/collections'
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include workspace query param', async () => {
      const mockResponse = {
        status: 200,
        data: { collections: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getCollections('workspace-123');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.getpostman.com/collections?workspace=workspace-123'
        })
      );
    });

    test('should include name query param', async () => {
      const mockResponse = {
        status: 200,
        data: { collections: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getCollections(null, 'Test Collection');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.getpostman.com/collections?name=Test+Collection'
        })
      );
    });

    test('should include limit and offset query params', async () => {
      const mockResponse = {
        status: 200,
        data: { collections: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getCollections(null, null, 10, 5);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('limit=10'),
          url: expect.stringContaining('offset=5')
        })
      );
    });

    test('should include all query params when provided', async () => {
      const mockResponse = {
        status: 200,
        data: { collections: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getCollections('workspace-123', 'Test', 10, 0);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('workspace=workspace-123'),
          url: expect.stringContaining('name=Test'),
          url: expect.stringContaining('limit=10'),
          url: expect.stringContaining('offset=0')
        })
      );
    });
  });

  describe('createCollection', () => {
    test('should call POST /collections with collection data', async () => {
      const mockResponse = {
        status: 200,
        data: {
          collection: {
            id: 'col-123',
            name: 'Test Collection'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const collectionData = {
        info: {
          name: 'Test Collection',
          schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
        }
      };

      const result = await createCollection(collectionData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: 'https://api.getpostman.com/collections',
          data: {
            collection: collectionData
          }
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include workspace query param when provided', async () => {
      const mockResponse = {
        status: 200,
        data: {
          collection: {
            id: 'col-123',
            name: 'Test Collection'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const collectionData = {
        info: {
          name: 'Test Collection',
          schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
        }
      };

      await createCollection(collectionData, 'workspace-123');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.getpostman.com/collections?workspace=workspace-123',
          data: {
            collection: collectionData
          }
        })
      );
    });

    test('should not include workspace query param when null', async () => {
      const mockResponse = {
        status: 200,
        data: {
          collection: {
            id: 'col-123',
            name: 'Test Collection'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const collectionData = {
        info: {
          name: 'Test Collection',
          schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
        }
      };

      await createCollection(collectionData, null);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.getpostman.com/collections'
        })
      );
    });
  });

  describe('getCollection', () => {
    test('should call GET /collections/{collectionId}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          collection: {
            id: 'col-123',
            name: 'Test Collection'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getCollection('col-123');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: 'https://api.getpostman.com/collections/col-123'
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include access_key query param when provided', async () => {
      const mockResponse = {
        status: 200,
        data: {
          collection: {
            id: 'col-123',
            name: 'Test Collection'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getCollection('col-123', 'PMAT-XXXX');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.getpostman.com/collections/col-123?access_key=PMAT-XXXX'
        })
      );
    });

    test('should include model query param when provided', async () => {
      const mockResponse = {
        status: 200,
        data: {
          collection: {
            id: 'col-123',
            name: 'Test Collection'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getCollection('col-123', null, 'minimal');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.getpostman.com/collections/col-123?model=minimal'
        })
      );
    });
  });

  describe('updateCollection', () => {
    test('should call PUT /collections/{collectionId}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          collection: {
            id: 'col-123',
            name: 'Updated Collection'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const collectionData = {
        info: {
          name: 'Updated Collection',
          schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
        }
      };

      const result = await updateCollection('col-123', collectionData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: 'https://api.getpostman.com/collections/col-123',
          data: {
            collection: collectionData
          }
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include Prefer header when provided', async () => {
      const mockResponse = {
        status: 202,
        data: {
          collection: {
            id: 'col-123',
            name: 'Updated Collection'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const collectionData = {
        info: {
          name: 'Updated Collection',
          schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
        }
      };

      await updateCollection('col-123', collectionData, 'respond-async');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: 'https://api.getpostman.com/collections/col-123',
          headers: expect.objectContaining({
            'Prefer': 'respond-async'
          })
        })
      );
    });
  });

  describe('modifyCollection', () => {
    test('should call PATCH /collections/{collectionId}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          collection: {
            id: 'col-123',
            name: 'Modified Collection'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const partialData = {
        info: {
          name: 'Modified Collection'
        }
      };

      const result = await modifyCollection('col-123', partialData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'patch',
          url: 'https://api.getpostman.com/collections/col-123',
          data: {
            collection: partialData
          }
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteCollection', () => {
    test('should call DELETE /collections/{collectionId}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          collection: {
            id: 'col-123',
            uid: '12345-col-123'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await deleteCollection('col-123');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'delete',
          url: 'https://api.getpostman.com/collections/col-123'
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createFolder', () => {
    test('should call POST /collections/{collectionId}/folders', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: {
            id: 'folder-123',
            name: 'Test Folder'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const folderData = {
        name: 'Test Folder',
        description: 'Test folder description'
      };

      const result = await createFolder('col-123', folderData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: 'https://api.getpostman.com/collections/col-123/folders',
          data: folderData
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getFolder', () => {
    test('should call GET /collections/{collectionId}/folders/{folderId}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: {
            id: 'folder-123',
            name: 'Test Folder'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getFolder('col-123', 'folder-123');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: 'https://api.getpostman.com/collections/col-123/folders/folder-123'
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include query params when provided', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: {
            id: 'folder-123',
            name: 'Test Folder'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getFolder('col-123', 'folder-123', 'true', 'true', 'true');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('ids=true'),
          url: expect.stringContaining('uid=true'),
          url: expect.stringContaining('populate=true')
        })
      );
    });
  });

  describe('updateFolder', () => {
    test('should call PUT /collections/{collectionId}/folders/{folderId}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: {
            id: 'folder-123',
            name: 'Updated Folder'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const folderData = {
        name: 'Updated Folder',
        description: 'Updated description'
      };

      const result = await updateFolder('col-123', 'folder-123', folderData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: 'https://api.getpostman.com/collections/col-123/folders/folder-123',
          data: folderData
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteFolder', () => {
    test('should call DELETE /collections/{collectionId}/folders/{folderId}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: {
            id: 'folder-123'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await deleteFolder('col-123', 'folder-123');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'delete',
          url: 'https://api.getpostman.com/collections/col-123/folders/folder-123'
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getFolderComments', () => {
    test('should call GET /collections/{collectionUid}/folders/{folderUid}/comments', async () => {
      const mockResponse = {
        status: 200,
        data: {
          comments: [
            {
              id: 1,
              body: 'Test comment'
            }
          ]
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = 12345678;
      const collectionId = 'col-123';
      const folderId = 'folder-123';
      const result = await getFolderComments(userId, collectionId, folderId);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: 'https://api.getpostman.com/collections/12345678-col-123/folders/12345678-folder-123/comments'
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createFolderComment', () => {
    test('should call POST /collections/{collectionUid}/folders/{folderUid}/comments', async () => {
      const mockResponse = {
        status: 201,
        data: {
          comment: {
            id: 1,
            body: 'Test comment'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = 12345678;
      const collectionId = 'col-123';
      const folderId = 'folder-123';
      const commentData = {
        body: 'Test comment'
      };

      const result = await createFolderComment(userId, collectionId, folderId, commentData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: 'https://api.getpostman.com/collections/12345678-col-123/folders/12345678-folder-123/comments',
          data: commentData
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include threadId for replies', async () => {
      const mockResponse = {
        status: 201,
        data: {
          comment: {
            id: 2,
            body: 'Reply comment',
            threadId: 1
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = 12345678;
      const commentData = {
        body: 'Reply comment',
        threadId: 1
      };

      await createFolderComment(userId, 'col-123', 'folder-123', commentData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            threadId: 1
          })
        })
      );
    });
  });

  describe('updateFolderComment', () => {
    test('should call PUT /collections/{collectionUid}/folders/{folderUid}/comments/{commentId}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          comment: {
            id: 1,
            body: 'Updated comment'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = 12345678;
      const collectionId = 'col-123';
      const folderId = 'folder-123';
      const commentId = '1';
      const commentData = {
        body: 'Updated comment'
      };

      const result = await updateFolderComment(userId, collectionId, folderId, commentId, commentData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: 'https://api.getpostman.com/collections/12345678-col-123/folders/12345678-folder-123/comments/1',
          data: commentData
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteFolderComment', () => {
    test('should call DELETE /collections/{collectionUid}/folders/{folderUid}/comments/{commentId}', async () => {
      const mockResponse = {
        status: 204,
        data: ''
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = 12345678;
      const collectionId = 'col-123';
      const folderId = 'folder-123';
      const commentId = '1';

      const result = await deleteFolderComment(userId, collectionId, folderId, commentId);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'delete',
          url: 'https://api.getpostman.com/collections/12345678-col-123/folders/12345678-folder-123/comments/1'
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('syncCollectionWithSpec', () => {
    test('should call PUT /collections/{collectionUid}/synchronizations with specId query param', async () => {
      const mockResponse = {
        status: 202,
        data: {
          taskId: '66ae9950-0869-4e65-96b0-1e0e47e771af',
          url: '/specs/73e15000-bc7a-4802-b80e-05fff18fd7f8/tasks/66ae9950-0869-4e65-96b0-1e0e47e771af'
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = 12345678;
      const collectionId = 'col-123';
      const specId = 'spec-456';

      const result = await syncCollectionWithSpec(userId, collectionId, specId);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: 'https://api.getpostman.com/collections/12345678-col-123/synchronizations?specId=spec-456'
        })
      );
      expect(result).toEqual(mockResponse);
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

      const userId = 12345678;
      const collectionId = 'col-123';
      const specId = 'spec-456';

      await syncCollectionWithSpec(userId, collectionId, specId);

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

  describe('createCollectionGeneration', () => {
    test('should call POST /collections/{collectionUid}/generations/{elementType}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          taskId: '66ae9950-0869-4e65-96b0-1e0e47e771af',
          url: '/collections/12345678-col-123/tasks/66ae9950-0869-4e65-96b0-1e0e47e771af'
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = 12345678;
      const collectionId = 'col-123';
      const elementType = 'spec';
      const name = 'My Generated Spec';
      const type = 'OPENAPI:3.0';
      const format = 'JSON';

      const result = await createCollectionGeneration(userId, collectionId, elementType, name, type, format);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: 'https://api.getpostman.com/collections/12345678-col-123/generations/spec',
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

      const userId = 12345678;
      const collectionId = 'col-123';
      const elementType = 'spec';
      const name = 'Test Spec';
      const type = 'OPENAPI:3.0';
      const format = 'YAML';

      await createCollectionGeneration(userId, collectionId, elementType, name, type, format);

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

      const userId = 12345678;
      const collectionId = 'col-123';
      const elementType = 'spec';

      const result = await getCollectionGenerations(userId, collectionId, elementType);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: 'https://api.getpostman.com/collections/12345678-col-123/generations/spec'
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

      const userId = 12345678;
      const collectionId = 'col-123';
      const elementType = 'spec';

      await getCollectionGenerations(userId, collectionId, elementType);

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

