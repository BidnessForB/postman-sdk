const axios = require('axios');
const { getSpecs, getSpec, createSpec } = require('../index');

jest.mock('axios');
jest.mock('../../core/config', () => ({
  apiKey: 'test-api-key',
  baseUrl: 'https://api.getpostman.com'
}));

const DEFAULT_WORKSPACE_ID = '066b3200-1739-4b19-bd52-71700f3a4545';

describe('specs functional tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSpecs', () => {
    describe('successful requests', () => {
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

      test('should return response data with multiple specs', async () => {
        const mockResponse = {
          status: 200,
          data: {
            specs: [
              { id: 'spec-1', name: 'API Spec 1' },
              { id: 'spec-2', name: 'API Spec 2' }
            ]
          }
        };
        axios.request.mockResolvedValue(mockResponse);

        const result = await getSpecs(DEFAULT_WORKSPACE_ID);

        expect(result.data.specs).toHaveLength(2);
        expect(result.data.specs[0].id).toBe('spec-1');
      });
    });

    describe('error handling', () => {
      test('should handle 401 unauthorized error', async () => {
        const mockError = {
          response: {
            status: 401,
            data: { error: 'Unauthorized' }
          }
        };
        axios.request.mockResolvedValue(mockError.response);

        await expect(getSpecs(DEFAULT_WORKSPACE_ID)).rejects.toThrow();
      });

      test('should handle 403 forbidden error', async () => {
        const mockError = {
          response: {
            status: 403,
            data: { error: 'Forbidden' }
          }
        };
        axios.request.mockResolvedValue(mockError.response);

        await expect(getSpecs(DEFAULT_WORKSPACE_ID)).rejects.toThrow();
      });
    });
  });

  describe('getSpec', () => {
    describe('successful requests', () => {
      test('should call GET /specs/{specId} with correct spec ID', async () => {
        const specId = 'spec-123';
        const mockResponse = {
          status: 200,
          data: {
            id: specId,
            name: 'My API Spec',
            type: 'OPENAPI:3.0'
          }
        };
        axios.request.mockResolvedValue(mockResponse);

        const result = await getSpec(specId);

        expect(axios.request).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'get',
            url: `https://api.getpostman.com/specs/${specId}`
          })
        );
        expect(result).toEqual(mockResponse);
        expect(result.data.id).toBe(specId);
      });

      test('should include correct headers', async () => {
        const mockResponse = {
          status: 200,
          data: { id: 'spec-123' }
        };
        axios.request.mockResolvedValue(mockResponse);

        await getSpec('spec-123');

        expect(axios.request).toHaveBeenCalledWith(
          expect.objectContaining({
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': 'test-api-key'
            }
          })
        );
      });

      test('should return complete spec information', async () => {
        const mockResponse = {
          status: 200,
          data: {
            id: 'spec-123',
            name: 'E-commerce API',
            type: 'OPENAPI:3.0',
            files: [
              { path: 'openapi.yaml' }
            ]
          }
        };
        axios.request.mockResolvedValue(mockResponse);

        const result = await getSpec('spec-123');

        expect(result.data).toHaveProperty('id');
        expect(result.data).toHaveProperty('name');
        expect(result.data).toHaveProperty('type');
        expect(result.data).toHaveProperty('files');
      });
    });

    describe('error handling', () => {
      test('should handle 404 not found error', async () => {
        const mockError = {
          response: {
            status: 404,
            data: { error: 'Spec not found' }
          }
        };
        axios.request.mockResolvedValue(mockError.response);

        await expect(getSpec('invalid-spec-id')).rejects.toThrow();
      });

      test('should handle 403 forbidden error', async () => {
        const mockError = {
          response: {
            status: 403,
            data: { error: 'Access denied' }
          }
        };
        axios.request.mockResolvedValue(mockError.response);

        await expect(getSpec('spec-123')).rejects.toThrow();
      });
    });
  });

  describe('createSpec', () => {
    describe('successful requests', () => {
      test('should call POST /specs with workspaceId and body', async () => {
        const mockResponse = {
          status: 201,
          data: { id: 'spec-123', name: 'Test Spec' }
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
          data: { id: 'spec-123' }
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
          data: { id: 'spec-123' }
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

      test('should create OpenAPI 3.1 spec', async () => {
        const mockResponse = {
          status: 201,
          data: { id: 'spec-456', name: 'API 3.1', type: 'OPENAPI:3.1' }
        };
        axios.request.mockResolvedValue(mockResponse);

        const files = [
          { path: 'openapi.yaml', content: 'openapi: 3.1.0' }
        ];

        const result = await createSpec(DEFAULT_WORKSPACE_ID, 'API 3.1', 'OPENAPI:3.1', files);

        expect(result.data.type).toBe('OPENAPI:3.1');
      });

      test('should create AsyncAPI 2.0 spec', async () => {
        const mockResponse = {
          status: 201,
          data: { id: 'spec-789', name: 'Async API', type: 'ASYNCAPI:2.0' }
        };
        axios.request.mockResolvedValue(mockResponse);

        const files = [
          { path: 'asyncapi.yaml', content: 'asyncapi: 2.0.0' }
        ];

        const result = await createSpec(DEFAULT_WORKSPACE_ID, 'Async API', 'ASYNCAPI:2.0', files);

        expect(result.data.type).toBe('ASYNCAPI:2.0');
      });
    });

    describe('error handling', () => {
      test('should handle 400 bad request error', async () => {
        const mockError = {
          response: {
            status: 400,
            data: { error: 'Invalid spec format' }
          }
        };
        axios.request.mockResolvedValue(mockError.response);

        const files = [{ path: 'invalid.yaml', content: 'invalid content' }];
        
        await expect(
          createSpec(DEFAULT_WORKSPACE_ID, 'Bad Spec', 'OPENAPI:3.0', files)
        ).rejects.toThrow();
      });

      test('should handle 403 forbidden error', async () => {
        const mockError = {
          response: {
            status: 403,
            data: { error: 'Workspace access denied' }
          }
        };
        axios.request.mockResolvedValue(mockError.response);

        await expect(
          createSpec(DEFAULT_WORKSPACE_ID, 'Test', 'OPENAPI:3.0', [])
        ).rejects.toThrow();
      });

      test('should handle 404 workspace not found error', async () => {
        const mockError = {
          response: {
            status: 404,
            data: { error: 'Workspace not found' }
          }
        };
        axios.request.mockResolvedValue(mockError.response);

        await expect(
          createSpec('invalid-workspace-id', 'Test', 'OPENAPI:3.0', [])
        ).rejects.toThrow();
      });
    });
  });
});

