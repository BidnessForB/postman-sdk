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
  getCollectionGenerations,
  getCollectionTaskStatus
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
            id: 'c6d2471c-3664-47b5-adc8-35d52484f2f6',
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
            id: 'c6d2471c-3664-47b5-adc8-35d52484f2f6',
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
            id: 'c6d2471c-3664-47b5-adc8-35d52484f2f6',
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
            id: 'c6d2471c-3664-47b5-adc8-35d52484f2f6',
            name: 'Test Collection'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getCollection('c6d2471c-3664-47b5-adc8-35d52484f2f6');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: 'https://api.getpostman.com/collections/c6d2471c-3664-47b5-adc8-35d52484f2f6'
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include access_key query param when provided', async () => {
      const mockResponse = {
        status: 200,
        data: {
          collection: {
            id: 'c6d2471c-3664-47b5-adc8-35d52484f2f6',
            name: 'Test Collection'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getCollection('c6d2471c-3664-47b5-adc8-35d52484f2f6', 'PMAT-XXXX');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.getpostman.com/collections/c6d2471c-3664-47b5-adc8-35d52484f2f6?access_key=PMAT-XXXX'
        })
      );
    });

    test('should include model query param when provided', async () => {
      const mockResponse = {
        status: 200,
        data: {
          collection: {
            id: 'c6d2471c-3664-47b5-adc8-35d52484f2f6',
            name: 'Test Collection'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getCollection('c6d2471c-3664-47b5-adc8-35d52484f2f6', null, 'minimal');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.getpostman.com/collections/c6d2471c-3664-47b5-adc8-35d52484f2f6?model=minimal'
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
            id: 'c6d2471c-3664-47b5-adc8-35d52484f2f6',
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

      const result = await updateCollection('c6d2471c-3664-47b5-adc8-35d52484f2f6', collectionData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: 'https://api.getpostman.com/collections/c6d2471c-3664-47b5-adc8-35d52484f2f6',
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
            id: 'c6d2471c-3664-47b5-adc8-35d52484f2f6',
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

      await updateCollection('c6d2471c-3664-47b5-adc8-35d52484f2f6', collectionData, 'respond-async');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: 'https://api.getpostman.com/collections/c6d2471c-3664-47b5-adc8-35d52484f2f6',
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
            id: 'c6d2471c-3664-47b5-adc8-35d52484f2f6',
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

      const result = await modifyCollection('c6d2471c-3664-47b5-adc8-35d52484f2f6', partialData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'patch',
          url: 'https://api.getpostman.com/collections/c6d2471c-3664-47b5-adc8-35d52484f2f6',
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
            id: 'c6d2471c-3664-47b5-adc8-35d52484f2f6',
            uid: '12345-col-123'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await deleteCollection('c6d2471c-3664-47b5-adc8-35d52484f2f6');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'delete',
          url: 'https://api.getpostman.com/collections/c6d2471c-3664-47b5-adc8-35d52484f2f6'
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
            id: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
            name: 'Test Folder'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const folderData = {
        name: 'Test Folder',
        description: 'Test folder description'
      };

      const result = await createFolder('c6d2471c-3664-47b5-adc8-35d52484f2f6', folderData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: 'https://api.getpostman.com/collections/c6d2471c-3664-47b5-adc8-35d52484f2f6/folders',
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
            id: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
            name: 'Test Folder'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getFolder('c6d2471c-3664-47b5-adc8-35d52484f2f6', 'a1b2c3d4-5678-90ab-cdef-1234567890ab');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: 'https://api.getpostman.com/collections/c6d2471c-3664-47b5-adc8-35d52484f2f6/folders/a1b2c3d4-5678-90ab-cdef-1234567890ab'
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include query params when provided', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: {
            id: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
            name: 'Test Folder'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getFolder('c6d2471c-3664-47b5-adc8-35d52484f2f6', 'a1b2c3d4-5678-90ab-cdef-1234567890ab', 'true', 'true', 'true');

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
            id: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
            name: 'Updated Folder'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const folderData = {
        name: 'Updated Folder',
        description: 'Updated description'
      };

      const result = await updateFolder('c6d2471c-3664-47b5-adc8-35d52484f2f6', 'a1b2c3d4-5678-90ab-cdef-1234567890ab', folderData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: 'https://api.getpostman.com/collections/c6d2471c-3664-47b5-adc8-35d52484f2f6/folders/a1b2c3d4-5678-90ab-cdef-1234567890ab',
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

      const result = await deleteFolder('c6d2471c-3664-47b5-adc8-35d52484f2f6', 'a1b2c3d4-5678-90ab-cdef-1234567890ab');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'delete',
          url: 'https://api.getpostman.com/collections/c6d2471c-3664-47b5-adc8-35d52484f2f6/folders/a1b2c3d4-5678-90ab-cdef-1234567890ab'
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
      const collectionId = 'c6d2471c-3664-47b5-adc8-35d52484f2f6';
      const folderId = 'a1b2c3d4-5678-90ab-cdef-1234567890ab';
      const result = await getFolderComments(userId, collectionId, folderId);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: 'https://api.getpostman.com/collections/12345678-c6d2471c-3664-47b5-adc8-35d52484f2f6/folders/12345678-a1b2c3d4-5678-90ab-cdef-1234567890ab/comments'
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
      const collectionId = 'c6d2471c-3664-47b5-adc8-35d52484f2f6';
      const folderId = 'a1b2c3d4-5678-90ab-cdef-1234567890ab';
      const commentData = {
        body: 'Test comment'
      };

      const result = await createFolderComment(userId, collectionId, folderId, commentData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: 'https://api.getpostman.com/collections/12345678-c6d2471c-3664-47b5-adc8-35d52484f2f6/folders/12345678-a1b2c3d4-5678-90ab-cdef-1234567890ab/comments',
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

      await createFolderComment(userId, 'c6d2471c-3664-47b5-adc8-35d52484f2f6', 'a1b2c3d4-5678-90ab-cdef-1234567890ab', commentData);

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
      const collectionId = 'c6d2471c-3664-47b5-adc8-35d52484f2f6';
      const folderId = 'a1b2c3d4-5678-90ab-cdef-1234567890ab';
      const commentId = 1;
      const commentData = {
        body: 'Updated comment'
      };

      const result = await updateFolderComment(userId, collectionId, folderId, commentId, commentData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: 'https://api.getpostman.com/collections/12345678-c6d2471c-3664-47b5-adc8-35d52484f2f6/folders/12345678-a1b2c3d4-5678-90ab-cdef-1234567890ab/comments/1',
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
      const collectionId = 'c6d2471c-3664-47b5-adc8-35d52484f2f6';
      const folderId = 'a1b2c3d4-5678-90ab-cdef-1234567890ab';
      const commentId = 1;

      const result = await deleteFolderComment(userId, collectionId, folderId, commentId);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'delete',
          url: 'https://api.getpostman.com/collections/12345678-c6d2471c-3664-47b5-adc8-35d52484f2f6/folders/12345678-a1b2c3d4-5678-90ab-cdef-1234567890ab/comments/1'
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

});

