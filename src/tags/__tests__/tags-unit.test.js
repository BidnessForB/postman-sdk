const axios = require('axios');
const { getTagEntities } = require('../index');

jest.mock('axios');
jest.mock('../../core/config', () => ({
  apiKey: 'test-api-key',
  baseUrl: 'https://api.getpostman.com'
}));

describe('tags unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTagEntities', () => {
    test('should call GET /tags/{slugId}/entities without query params', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: {
            entities: [
              { entityId: '8b86dfe8-de72-44e6-81ea-79d19805bc6a', entityType: 'api' }
            ]
          },
          meta: {
            count: 1
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getTagEntities('production');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: 'https://api.getpostman.com/tags/production/entities'
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include limit query param when provided', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: { entities: [] },
          meta: { count: 0 }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getTagEntities('needs-review', 20);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.getpostman.com/tags/needs-review/entities?limit=20'
        })
      );
    });

    test('should include direction query param when provided', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: { entities: [] },
          meta: { count: 0 }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getTagEntities('api-v2', null, 'desc');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.getpostman.com/tags/api-v2/entities?direction=desc'
        })
      );
    });

    test('should include cursor query param when provided', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: { entities: [] },
          meta: { count: 0 }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getTagEntities('test', null, null, 'cursor123');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.getpostman.com/tags/test/entities?cursor=cursor123'
        })
      );
    });

    test('should include entityType query param when provided', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: { entities: [] },
          meta: { count: 0 }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getTagEntities('critical', null, null, null, 'collection');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.getpostman.com/tags/critical/entities?entityType=collection'
        })
      );
    });

    test('should include all query params when provided', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: { entities: [] },
          meta: { count: 0 }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getTagEntities('production', 50, 'asc', 'cursor456', 'workspace');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('limit=50'),
          url: expect.stringContaining('direction=asc'),
          url: expect.stringContaining('cursor=cursor456'),
          url: expect.stringContaining('entityType=workspace')
        })
      );
    });

    test('should handle response with multiple entities', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: {
            entities: [
              { entityId: 'id1', entityType: 'api' },
              { entityId: 'id2', entityType: 'collection' },
              { entityId: 'id3', entityType: 'workspace' }
            ]
          },
          meta: {
            count: 3
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getTagEntities('test-tag');

      expect(result.data.data.entities).toHaveLength(3);
      expect(result.data.meta.count).toBe(3);
    });

    test('should handle empty entities array', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: {
            entities: []
          },
          meta: {
            count: 0
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getTagEntities('unused-tag');

      expect(result.data.data.entities).toHaveLength(0);
      expect(result.data.meta.count).toBe(0);
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: { entities: [] },
          meta: { count: 0 }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getTagEntities('production');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key'
          })
        })
      );
    });

    test('should handle tag slug with hyphens', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: { entities: [] },
          meta: { count: 0 }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getTagEntities('needs-review');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.getpostman.com/tags/needs-review/entities'
        })
      );
    });

    test('should filter by api entityType', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: {
            entities: [
              { entityId: 'api-id', entityType: 'api' }
            ]
          },
          meta: { count: 1 }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getTagEntities('production', null, null, null, 'api');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('entityType=api')
        })
      );
      expect(result.data.data.entities[0].entityType).toBe('api');
    });

    test('should filter by collection entityType', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: {
            entities: [
              { entityId: 'collection-id', entityType: 'collection' }
            ]
          },
          meta: { count: 1 }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getTagEntities('production', null, null, null, 'collection');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('entityType=collection')
        })
      );
      expect(result.data.data.entities[0].entityType).toBe('collection');
    });

    test('should filter by workspace entityType', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: {
            entities: [
              { entityId: 'workspace-id', entityType: 'workspace' }
            ]
          },
          meta: { count: 1 }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getTagEntities('production', null, null, null, 'workspace');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('entityType=workspace')
        })
      );
      expect(result.data.data.entities[0].entityType).toBe('workspace');
    });
  });
});

