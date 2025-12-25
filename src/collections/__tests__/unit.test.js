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
  getCollectionComments,
  createCollectionComment,
  updateCollectionComment,
  deleteCollectionComment,
  getFolderComments,
  createFolderComment,
  updateFolderComment,
  deleteFolderComment,
  getCollectionTags,
  updateCollectionTags,
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

  describe('getCollectionComments', () => {
    test('should call GET /collections/{collectionUid}/comments', async () => {
      const mockResponse = {
        status: 200,
        data: {
          comments: [
            {
              id: 1,
              content: 'Test comment',
              createdAt: '2025-01-01T00:00:00Z'
            }
          ]
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = 12345678;
      const collectionId = 'c6d2471c-3664-47b5-adc8-35d52484f2f6';

      const result = await getCollectionComments(userId, collectionId);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: 'https://api.getpostman.com/collections/12345678-c6d2471c-3664-47b5-adc8-35d52484f2f6/comments'
        })
      );
      expect(result).toEqual(mockResponse);
      expect(result.data).toHaveProperty('comments');
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { comments: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = 12345678;
      const collectionId = 'c6d2471c-3664-47b5-adc8-35d52484f2f6';

      await getCollectionComments(userId, collectionId);

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

  describe('createCollectionComment', () => {
    test('should call POST /collections/{collectionUid}/comments', async () => {
      const mockResponse = {
        status: 201,
        data: {
          comment: {
            id: 1,
            content: 'New comment',
            createdAt: '2025-01-01T00:00:00Z'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = 12345678;
      const collectionId = 'c6d2471c-3664-47b5-adc8-35d52484f2f6';
      const commentData = {
        content: 'New comment'
      };

      const result = await createCollectionComment(userId, collectionId, commentData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: 'https://api.getpostman.com/collections/12345678-c6d2471c-3664-47b5-adc8-35d52484f2f6/comments',
          data: commentData
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should support reply with threadId', async () => {
      const mockResponse = {
        status: 201,
        data: {
          comment: {
            id: 2,
            content: 'Reply comment',
            threadId: 1
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = 12345678;
      const collectionId = 'c6d2471c-3664-47b5-adc8-35d52484f2f6';
      const commentData = {
        content: 'Reply comment',
        threadId: 1
      };

      await createCollectionComment(userId, collectionId, commentData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            threadId: 1
          })
        })
      );
    });
  });

  describe('updateCollectionComment', () => {
    test('should call PUT /collections/{collectionUid}/comments/{commentId}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          comment: {
            id: 1,
            content: 'Updated comment'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = 12345678;
      const collectionId = 'c6d2471c-3664-47b5-adc8-35d52484f2f6';
      const commentId = 1;
      const commentData = {
        content: 'Updated comment'
      };

      const result = await updateCollectionComment(userId, collectionId, commentId, commentData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: 'https://api.getpostman.com/collections/12345678-c6d2471c-3664-47b5-adc8-35d52484f2f6/comments/1',
          data: commentData
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { comment: {} }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = 12345678;
      const collectionId = 'c6d2471c-3664-47b5-adc8-35d52484f2f6';
      const commentId = 1;

      await updateCollectionComment(userId, collectionId, commentId, { content: 'test' });

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

  describe('deleteCollectionComment', () => {
    test('should call DELETE /collections/{collectionUid}/comments/{commentId}', async () => {
      const mockResponse = {
        status: 204,
        data: ''
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = 12345678;
      const collectionId = 'c6d2471c-3664-47b5-adc8-35d52484f2f6';
      const commentId = 1;

      const result = await deleteCollectionComment(userId, collectionId, commentId);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'delete',
          url: 'https://api.getpostman.com/collections/12345678-c6d2471c-3664-47b5-adc8-35d52484f2f6/comments/1'
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 204,
        data: ''
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = 12345678;
      const collectionId = 'c6d2471c-3664-47b5-adc8-35d52484f2f6';
      const commentId = 1;

      await deleteCollectionComment(userId, collectionId, commentId);

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

  describe('getCollectionTags', () => {
    test('should call GET /collections/{collectionUid}/tags', async () => {
      const mockResponse = {
        status: 200,
        data: {
          tags: []
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = 12345678;
      const collectionId = 'c6d2471c-3664-47b5-adc8-35d52484f2f6';

      const result = await getCollectionTags(userId, collectionId);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: 'https://api.getpostman.com/collections/12345678-c6d2471c-3664-47b5-adc8-35d52484f2f6/tags'
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should return tags when present', async () => {
      const mockResponse = {
        status: 200,
        data: {
          tags: [
            { slug: 'production' },
            { slug: 'test-api' }
          ]
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = 12345678;
      const collectionId = 'c6d2471c-3664-47b5-adc8-35d52484f2f6';

      const result = await getCollectionTags(userId, collectionId);

      expect(result.data.tags).toHaveLength(2);
      expect(result.data.tags[0].slug).toBe('production');
      expect(result.data.tags[1].slug).toBe('test-api');
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { tags: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = 12345678;
      const collectionId = 'c6d2471c-3664-47b5-adc8-35d52484f2f6';

      await getCollectionTags(userId, collectionId);

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

  describe('updateCollectionTags', () => {
    test('should call PUT /collections/{collectionUid}/tags with empty tags', async () => {
      const mockResponse = {
        status: 200,
        data: {
          tags: []
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = 12345678;
      const collectionId = 'c6d2471c-3664-47b5-adc8-35d52484f2f6';
      const tags = [];

      const result = await updateCollectionTags(userId, collectionId, tags);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: 'https://api.getpostman.com/collections/12345678-c6d2471c-3664-47b5-adc8-35d52484f2f6/tags',
          data: { tags: [] }
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should call PUT /collections/{collectionUid}/tags with single tag', async () => {
      const mockResponse = {
        status: 200,
        data: {
          tags: [{ slug: 'production' }]
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = 12345678;
      const collectionId = 'c6d2471c-3664-47b5-adc8-35d52484f2f6';
      const tags = [{ slug: 'production' }];

      const result = await updateCollectionTags(userId, collectionId, tags);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: 'https://api.getpostman.com/collections/12345678-c6d2471c-3664-47b5-adc8-35d52484f2f6/tags',
          data: { tags: [{ slug: 'production' }] }
        })
      );
      expect(result.data.tags).toHaveLength(1);
    });

    test('should call PUT /collections/{collectionUid}/tags with multiple tags', async () => {
      const mockResponse = {
        status: 200,
        data: {
          tags: [
            { slug: 'production' },
            { slug: 'test-api' },
            { slug: 'sdk-test' }
          ]
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = 12345678;
      const collectionId = 'c6d2471c-3664-47b5-adc8-35d52484f2f6';
      const tags = [
        { slug: 'production' },
        { slug: 'test-api' },
        { slug: 'sdk-test' }
      ];

      const result = await updateCollectionTags(userId, collectionId, tags);

      expect(result.data.tags).toHaveLength(3);
    });

    test('should call PUT /collections/{collectionUid}/tags with max 5 tags', async () => {
      const mockResponse = {
        status: 200,
        data: {
          tags: [
            { slug: 'tag1' },
            { slug: 'tag2' },
            { slug: 'tag3' },
            { slug: 'tag4' },
            { slug: 'tag5' }
          ]
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = 12345678;
      const collectionId = 'c6d2471c-3664-47b5-adc8-35d52484f2f6';
      const tags = [
        { slug: 'tag1' },
        { slug: 'tag2' },
        { slug: 'tag3' },
        { slug: 'tag4' },
        { slug: 'tag5' }
      ];

      const result = await updateCollectionTags(userId, collectionId, tags);

      expect(result.data.tags).toHaveLength(5);
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { tags: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = 12345678;
      const collectionId = 'c6d2471c-3664-47b5-adc8-35d52484f2f6';

      await updateCollectionTags(userId, collectionId, []);

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

  describe('syncCollectionWithSpec', () => {
    test('should call PUT /collections/{collectionUid}/synchronizations with specId', async () => {
      const mockResponse = {
        status: 202,
        data: {
          taskId: 'task-123',
          url: 'https://api.getpostman.com/collections/12345678-c6d2471c-3664-47b5-adc8-35d52484f2f6/tasks/task-123'
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = 12345678;
      const collectionId = 'c6d2471c-3664-47b5-adc8-35d52484f2f6';
      const specId = 'spec-123';

      const result = await syncCollectionWithSpec(userId, collectionId, specId);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: expect.stringContaining(`/collections/12345678-${collectionId}/synchronizations`),
          url: expect.stringContaining(`specId=${specId}`)
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should construct correct collection UID', async () => {
      const mockResponse = {
        status: 202,
        data: { taskId: 'task-123', url: 'https://example.com' }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = 87654321;
      const collectionId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
      const specId = 'spec-456';

      await syncCollectionWithSpec(userId, collectionId, specId);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining(`87654321-${collectionId}`)
        })
      );
    });
  });

  describe('createCollectionGeneration', () => {
    test('should call POST /collections/{collectionUid}/generations/{elementType}', async () => {
      const mockResponse = {
        status: 202,
        data: {
          taskId: 'gen-task-123',
          url: 'https://api.getpostman.com/collections/12345678-c6d2471c-3664-47b5-adc8-35d52484f2f6/tasks/gen-task-123'
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = 12345678;
      const collectionId = 'c6d2471c-3664-47b5-adc8-35d52484f2f6';
      const elementType = 'spec';
      const name = 'Generated Spec';
      const type = 'OPENAPI:3.0';
      const format = 'JSON';

      const result = await createCollectionGeneration(userId, collectionId, elementType, name, type, format);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: expect.stringContaining(`/collections/12345678-${collectionId}/generations/${elementType}`),
          data: {
            name,
            type,
            format
          }
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include all required parameters in request body', async () => {
      const mockResponse = {
        status: 202,
        data: { taskId: 'task-456', url: 'https://example.com' }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = 87654321;
      const collectionId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';

      await createCollectionGeneration(userId, collectionId, 'spec', 'My API Spec', 'OPENAPI:3.1', 'YAML');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            name: 'My API Spec',
            type: 'OPENAPI:3.1',
            format: 'YAML'
          }
        })
      );
    });
  });

  describe('getCollectionGenerations', () => {
    test('should call GET /collections/{collectionUid}/generations/{elementType}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          specs: [
            {
              id: 'spec-1',
              name: 'Generated Spec 1',
              state: 'active',
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-01T00:00:00.000Z',
              createdBy: 12345678
            }
          ],
          meta: {
            nextCursor: null
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = 12345678;
      const collectionId = 'c6d2471c-3664-47b5-adc8-35d52484f2f6';
      const elementType = 'spec';

      const result = await getCollectionGenerations(userId, collectionId, elementType);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: expect.stringContaining(`/collections/12345678-${collectionId}/generations/${elementType}`)
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should construct correct collection UID', async () => {
      const mockResponse = {
        status: 200,
        data: { specs: [], meta: { nextCursor: null } }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = 87654321;
      const collectionId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';

      await getCollectionGenerations(userId, collectionId, 'spec');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining(`87654321-${collectionId}`)
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
                id: 'spec-123',
                name: 'Generated Spec'
              }
            ]
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = 12345678;
      const collectionId = 'c6d2471c-3664-47b5-adc8-35d52484f2f6';
      const taskId = 'task-123';

      const result = await getCollectionTaskStatus(userId, collectionId, taskId);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: expect.stringContaining(`/collections/12345678-${collectionId}/tasks/${taskId}`)
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should construct correct collection UID', async () => {
      const mockResponse = {
        status: 200,
        data: { status: 'pending' }
      };
      axios.request.mockResolvedValue(mockResponse);

      const userId = 87654321;
      const collectionId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
      const taskId = 'task-456';

      await getCollectionTaskStatus(userId, collectionId, taskId);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining(`87654321-${collectionId}`)
        })
      );
    });

    test('should handle pending status', async () => {
      const mockResponse = {
        status: 200,
        data: { status: 'pending' }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getCollectionTaskStatus(12345678, 'collection-id', 'task-id');

      expect(result.data.status).toBe('pending');
    });

    test('should handle failed status', async () => {
      const mockResponse = {
        status: 200,
        data: {
          status: 'failed',
          error: {
            message: 'Generation failed'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getCollectionTaskStatus(12345678, 'collection-id', 'task-id');

      expect(result.data.status).toBe('failed');
      expect(result.data.error).toBeDefined();
    });
  });

});

