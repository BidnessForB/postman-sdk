const axios = require('axios');
const { getSpecs, getSpec, createSpec, modifySpec, deleteSpec } = require('../index');

jest.mock('axios');
jest.mock('../../core/config', () => ({
  apiKey: 'test-api-key',
  baseUrl: 'https://api.getpostman.com'
}));

const DEFAULT_WORKSPACE_ID = '066b3200-1739-4b19-bd52-71700f3a4545';
const DEFAULT_SPEC_ID = '550f281f-ee6a-4860-aef3-6d9fdd7ca405';

describe('specs unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSpecs', () => {
    test('should call GET /specs with workspaceId', async () => {
      const mockResponse = {
        status: 200,
        data: { specs: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getSpecs(DEFAULT_WORKSPACE_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `https://api.getpostman.com/specs?workspaceId=${DEFAULT_WORKSPACE_ID}`
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include cursor and limit in query params', async () => {
      const mockResponse = {
        status: 200,
        data: { specs: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getSpecs(DEFAULT_WORKSPACE_ID, 'cursor-value', 10);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining(`workspaceId=${DEFAULT_WORKSPACE_ID}`),
          url: expect.stringContaining('cursor=cursor-value'),
          url: expect.stringContaining('limit=10')
        })
      );
    });

    test('should handle null optional parameters', async () => {
      const mockResponse = {
        status: 200,
        data: { specs: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getSpecs(DEFAULT_WORKSPACE_ID, null, null);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `https://api.getpostman.com/specs?workspaceId=${DEFAULT_WORKSPACE_ID}`
        })
      );
    });
  });

  describe('getSpec', () => {
    test('should call GET /specs/{specId} with correct spec ID', async () => {
      const mockResponse = {
        status: 200,
        data: {
          id: DEFAULT_SPEC_ID,
          name: 'My API Spec',
          type: 'OPENAPI:3.0'
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getSpec(DEFAULT_SPEC_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `https://api.getpostman.com/specs/${DEFAULT_SPEC_ID}`
        })
      );
      expect(result).toEqual(mockResponse);
      expect(result.data.id).toBe(DEFAULT_SPEC_ID);
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { id: DEFAULT_SPEC_ID }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getSpec(DEFAULT_SPEC_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key'
          }
        })
      );
    });
  });

  describe('createSpec', () => {
    test('should call POST /specs with workspaceId and body', async () => {
      const mockResponse = {
        status: 201,
        data: { id: DEFAULT_SPEC_ID, name: 'Test Spec' }
      };
      axios.request.mockResolvedValue(mockResponse);

      const files = [
        { path: 'openapi.yaml', content: 'openapi: 3.0.0' }
      ];
      const result = await createSpec(DEFAULT_WORKSPACE_ID, 'Test Spec', 'OPENAPI:3.0', files);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: `https://api.getpostman.com/specs?workspaceId=${DEFAULT_WORKSPACE_ID}`,
          data: {
            name: 'Test Spec',
            type: 'OPENAPI:3.0',
            files
          }
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 201,
        data: { id: DEFAULT_SPEC_ID }
      };
      axios.request.mockResolvedValue(mockResponse);

      await createSpec(DEFAULT_WORKSPACE_ID, 'Test', 'OPENAPI:3.0', []);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key'
          }
        })
      );
    });

    test('should handle multi-file specs', async () => {
      const mockResponse = {
        status: 201,
        data: { id: DEFAULT_SPEC_ID }
      };
      axios.request.mockResolvedValue(mockResponse);

      const files = [
        { path: 'openapi.yaml', content: 'openapi: 3.0.0', type: 'ROOT' },
        { path: 'components/schemas.json', content: '{}', type: 'DEFAULT' }
      ];
      
      await createSpec(DEFAULT_WORKSPACE_ID, 'Multi-file Spec', 'OPENAPI:3.0', files);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            files
          })
        })
      );
    });
  });

  describe('modifySpec', () => {
    test('should call PATCH /specs/{specId} with name', async () => {
      const mockResponse = {
        status: 200,
        data: { id: DEFAULT_SPEC_ID, name: 'Updated Name' }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await modifySpec(DEFAULT_SPEC_ID, 'Updated Name');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'patch',
          url: `https://api.getpostman.com/specs/${DEFAULT_SPEC_ID}`,
          data: {
            name: 'Updated Name'
          }
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { id: DEFAULT_SPEC_ID }
      };
      axios.request.mockResolvedValue(mockResponse);

      await modifySpec(DEFAULT_SPEC_ID, 'New Name');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key'
          }
        })
      );
    });
  });

  describe('deleteSpec', () => {
    test('should call DELETE /specs/{specId}', async () => {
      const mockResponse = {
        status: 204
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await deleteSpec(DEFAULT_SPEC_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'delete',
          url: `https://api.getpostman.com/specs/${DEFAULT_SPEC_ID}`
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 204
      };
      axios.request.mockResolvedValue(mockResponse);

      await deleteSpec(DEFAULT_SPEC_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key'
          }
        })
      );
    });
  });
});

