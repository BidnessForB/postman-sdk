const axios = require('axios');
//const { DEFAULT_ID, DEFAULT_UID } = require('../../core/__tests__/utils.unit.test');
const { DEFAULT_ID, DEFAULT_UID } = require('../../__tests__/test-helpers');
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

// Test constants - valid ID and UID formats for testing
const DEFAULT_COLLECTION_UID = DEFAULT_UID;
const DEFAULT_FOLDER_UID = '12345678-87654321-1234-1234-1234-123456789abc';
const DEFAULT_COMMENT_ID = DEFAULT_ID;
const DEFAULT_TASK_ID = DEFAULT_ID;
const DEFAULT_SPEC_ID = DEFAULT_ID;
const DEFAULT_USER_ID = '12345678';

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

      await getCollections(DEFAULT_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `https://api.getpostman.com/collections?workspace=${DEFAULT_ID}`
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

      await getCollections(DEFAULT_ID, 'Test', 10, 0);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining(`workspace=${DEFAULT_ID}`),
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

      await createCollection(collectionData, DEFAULT_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `https://api.getpostman.com/collections?workspace=${DEFAULT_ID}`,
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

      const result = await getCollection(DEFAULT_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `https://api.getpostman.com/collections/${DEFAULT_ID}`
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

      await getCollection(DEFAULT_ID, 'PMAT-XXXX');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `https://api.getpostman.com/collections/${DEFAULT_ID}?access_key=PMAT-XXXX`
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

      await getCollection(DEFAULT_ID, null, 'minimal');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `https://api.getpostman.com/collections/${DEFAULT_ID}?model=minimal`
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

      const result = await updateCollection(DEFAULT_ID, collectionData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: `https://api.getpostman.com/collections/${DEFAULT_ID}`,
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

      await updateCollection(DEFAULT_ID, collectionData, 'respond-async');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: `https://api.getpostman.com/collections/${DEFAULT_ID}`,
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

      const result = await modifyCollection(DEFAULT_ID, partialData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'patch',
          url: `https://api.getpostman.com/collections/${DEFAULT_ID}`,
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

      const result = await deleteCollection(DEFAULT_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'delete',
          url: `https://api.getpostman.com/collections/${DEFAULT_ID}`
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

      const result = await createFolder(DEFAULT_ID, folderData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: `https://api.getpostman.com/collections/${DEFAULT_ID}/folders`,
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

      const result = await getFolder(DEFAULT_ID, DEFAULT_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `https://api.getpostman.com/collections/${DEFAULT_ID}/folders/${DEFAULT_ID}`
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

      await getFolder(DEFAULT_ID, DEFAULT_ID, 'true', 'true', 'true');

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

      const result = await updateFolder(DEFAULT_ID, DEFAULT_ID, folderData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: `https://api.getpostman.com/collections/${DEFAULT_ID}/folders/${DEFAULT_ID}`,
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

      const result = await deleteFolder(DEFAULT_ID, DEFAULT_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'delete',
          url: `https://api.getpostman.com/collections/${DEFAULT_ID}/folders/${DEFAULT_ID}`
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

      const result = await getFolderComments(DEFAULT_COLLECTION_UID, DEFAULT_FOLDER_UID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `https://api.getpostman.com/collections/${DEFAULT_COLLECTION_UID}/folders/${DEFAULT_FOLDER_UID}/comments`
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

      const commentData = {
        body: 'Test comment'
      };

      const result = await createFolderComment(DEFAULT_COLLECTION_UID, DEFAULT_FOLDER_UID, commentData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: `https://api.getpostman.com/collections/${DEFAULT_COLLECTION_UID}/folders/${DEFAULT_FOLDER_UID}/comments`,
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

      const commentData = {
        body: 'Reply comment',
        threadId: 1
      };

      await createFolderComment(DEFAULT_COLLECTION_UID, DEFAULT_FOLDER_UID, commentData);

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

      const commentData = {
        body: 'Updated comment'
      };

      const result = await updateFolderComment(DEFAULT_COLLECTION_UID, DEFAULT_FOLDER_UID, 1, commentData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: `https://api.getpostman.com/collections/${DEFAULT_COLLECTION_UID}/folders/${DEFAULT_FOLDER_UID}/comments/1`,
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

      const result = await deleteFolderComment(DEFAULT_COLLECTION_UID, DEFAULT_FOLDER_UID, 1);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'delete',
          url: `https://api.getpostman.com/collections/${DEFAULT_COLLECTION_UID}/folders/${DEFAULT_FOLDER_UID}/comments/1`
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
      const collectionId = DEFAULT_UID;

      const result = await getCollectionComments(collectionId);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `https://api.getpostman.com/collections/${DEFAULT_COLLECTION_UID}/comments`
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

      await getCollectionComments(DEFAULT_COLLECTION_UID);

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

      const commentData = {
        content: 'New comment'
      };

      const result = await createCollectionComment(DEFAULT_COLLECTION_UID, commentData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: `https://api.getpostman.com/collections/${DEFAULT_COLLECTION_UID}/comments`,
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
      const collectionId = DEFAULT_UID;
      const commentData = {
        content: 'Reply comment',
        threadId: 1
      };

      await createCollectionComment(DEFAULT_COLLECTION_UID, commentData);

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

      const commentData = {
        content: 'Updated comment'
      };

      const result = await updateCollectionComment(DEFAULT_COLLECTION_UID, 1, commentData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: `https://api.getpostman.com/collections/${DEFAULT_COLLECTION_UID}/comments/1`,
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

      await updateCollectionComment(DEFAULT_COLLECTION_UID, 1, { content: 'test' });

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
      const collectionId = DEFAULT_UID;
      const commentId = 1;

      const result = await deleteCollectionComment(collectionId, commentId);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'delete',
          url: `https://api.getpostman.com/collections/${DEFAULT_COLLECTION_UID}/comments/1`
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

      await deleteCollectionComment(DEFAULT_COLLECTION_UID, 1);

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
      const collectionId = DEFAULT_UID;

      const result = await getCollectionTags(collectionId);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `https://api.getpostman.com/collections/${DEFAULT_COLLECTION_UID}/tags`
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
      const collectionId = DEFAULT_UID;

      const result = await getCollectionTags(collectionId);

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

      await getCollectionTags(DEFAULT_COLLECTION_UID);

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

      const tags = [];

      const result = await updateCollectionTags(DEFAULT_COLLECTION_UID, tags);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: `https://api.getpostman.com/collections/${DEFAULT_COLLECTION_UID}/tags`,
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

      const tags = [{ slug: 'production' }];

      const result = await updateCollectionTags(DEFAULT_COLLECTION_UID, tags);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: `https://api.getpostman.com/collections/${DEFAULT_COLLECTION_UID}/tags`,
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

      const tags = [
        { slug: 'production' },
        { slug: 'test-api' },
        { slug: 'sdk-test' }
      ];

      const result = await updateCollectionTags(DEFAULT_COLLECTION_UID, tags);

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

      const tags = [
        { slug: 'tag1' },
        { slug: 'tag2' },
        { slug: 'tag3' },
        { slug: 'tag4' },
        { slug: 'tag5' }
      ];

      const result = await updateCollectionTags(DEFAULT_COLLECTION_UID, tags);

      expect(result.data.tags).toHaveLength(5);
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { tags: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      await updateCollectionTags(DEFAULT_COLLECTION_UID, []);

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
          url: `https://api.getpostman.com/collections/${DEFAULT_COLLECTION_UID}/tasks/${DEFAULT_TASK_ID}`
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await syncCollectionWithSpec(DEFAULT_COLLECTION_UID, DEFAULT_SPEC_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: expect.stringContaining(`/collections/${DEFAULT_COLLECTION_UID}/synchronizations`),
          //url: expect.stringContaining(specId)
        })
      );
      expect(result).toEqual(mockResponse);
    });

    

  describe('createCollectionGeneration', () => {
    test('should call POST /collections/{collectionUid}/generations/{elementType}', async () => {
      const mockResponse = {
        status: 202,
        data: {
          taskId: 'gen-task-123',
          url: `https://api.getpostman.com/collections/${DEFAULT_COLLECTION_UID}/tasks/${DEFAULT_TASK_ID}`
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const elementType = 'spec';
      const name = 'Generated Spec';
      const type = 'OPENAPI:3.0';
      const format = 'JSON';

      const result = await createCollectionGeneration(DEFAULT_COLLECTION_UID, elementType, name, type, format);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: expect.stringContaining(`/collections/${DEFAULT_COLLECTION_UID}/generations/${elementType}`),
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

      await createCollectionGeneration(DEFAULT_COLLECTION_UID, 'spec', 'My API Spec', 'OPENAPI:3.1', 'YAML');

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
              id: DEFAULT_UID,
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

      const elementType = 'spec';

      const result = await getCollectionGenerations(DEFAULT_UID, elementType);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: expect.stringContaining(`/collections/${DEFAULT_UID}/generations/${elementType}`)
        })
      );
      expect(result).toEqual(mockResponse);
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
                id: DEFAULT_UID,
                name: 'Generated Spec'
              }
            ]
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getCollectionTaskStatus(DEFAULT_COLLECTION_UID, DEFAULT_TASK_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: expect.stringContaining(`/collections/${DEFAULT_COLLECTION_UID}/tasks/${DEFAULT_TASK_ID}`)
        })
      );
      expect(result).toEqual(mockResponse);
    });

    

    test('should handle pending status', async () => {
      const mockResponse = {
        status: 200,
        data: { status: 'pending' }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getCollectionTaskStatus(DEFAULT_COLLECTION_UID, DEFAULT_TASK_ID);

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

      const result = await getCollectionTaskStatus(DEFAULT_COLLECTION_UID, DEFAULT_TASK_ID);

      expect(result.data.status).toBe('failed');
      expect(result.data.error).toBeDefined();
    });
  });

});
});
