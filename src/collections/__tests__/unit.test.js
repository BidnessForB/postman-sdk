const axios = require('axios');
const { getCollections, createCollection } = require('../index');

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
});

