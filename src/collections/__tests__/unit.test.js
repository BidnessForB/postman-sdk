const axios = require('axios');
const { 
  getCollections, 
  createCollection,
  getCollection,
  updateCollection,
  modifyCollection,
  deleteCollection
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
});

