const axios = require('axios');
const { buildAxiosConfig, executeRequest } = require('../request');

jest.mock('axios');
jest.mock('../config', () => ({
  apiKey: 'test-api-key',
  baseUrl: 'https://api.getpostman.com'
}));

describe('request', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('buildAxiosConfig', () => {
    test('should build config with method and endpoint', () => {
      const config = buildAxiosConfig('get', '/test/endpoint');

      expect(config).toEqual({
        method: 'get',
        url: 'https://api.getpostman.com/test/endpoint',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'test-api-key'
        }
      });
    });

    test('should include data when provided', () => {
      const data = { name: 'Test', value: 123 };
      const config = buildAxiosConfig('post', '/test/endpoint', data);

      expect(config).toEqual({
        method: 'post',
        url: 'https://api.getpostman.com/test/endpoint',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'test-api-key'
        },
        data: data
      });
    });

    test('should not include data property when data is undefined', () => {
      const config = buildAxiosConfig('get', '/test/endpoint', undefined);

      expect(config).not.toHaveProperty('data');
    });

    test('should include data property when data is null', () => {
      const config = buildAxiosConfig('post', '/test/endpoint', null);

      expect(config).toHaveProperty('data');
      expect(config.data).toBeNull();
    });

    test('should merge extra config options', () => {
      const extra = {
        maxBodyLength: Infinity,
        timeout: 5000
      };
      const config = buildAxiosConfig('post', '/test/endpoint', { test: 'data' }, extra);

      expect(config).toMatchObject({
        method: 'post',
        url: 'https://api.getpostman.com/test/endpoint',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'test-api-key'
        },
        data: { test: 'data' },
        maxBodyLength: Infinity,
        timeout: 5000
      });
    });

    test('should work with different HTTP methods', () => {
      const methods = ['get', 'post', 'put', 'patch', 'delete'];

      methods.forEach(method => {
        const config = buildAxiosConfig(method, '/endpoint');
        expect(config.method).toBe(method);
      });
    });

    test('should construct correct full URL', () => {
      const config = buildAxiosConfig('get', '/specs/123/files');
      expect(config.url).toBe('https://api.getpostman.com/specs/123/files');
    });

    test('should always include required headers', () => {
      const config = buildAxiosConfig('get', '/test');

      expect(config.headers).toHaveProperty('Content-Type', 'application/json');
      expect(config.headers).toHaveProperty('X-API-Key', 'test-api-key');
    });
  });

  describe('executeRequest', () => {
    test('should execute request and return response for 2xx status', async () => {
      const mockResponse = {
        status: 200,
        data: { success: true }
      };
      axios.request.mockResolvedValue(mockResponse);

      const config = { method: 'get', url: 'https://api.getpostman.com/test' };
      const result = await executeRequest(config);

      expect(axios.request).toHaveBeenCalledWith(config);
      expect(result).toEqual(mockResponse);
    });

    test('should handle 201 Created status', async () => {
      const mockResponse = {
        status: 201,
        data: { id: '123', created: true }
      };
      axios.request.mockResolvedValue(mockResponse);

      const config = { method: 'post', url: 'https://api.getpostman.com/test' };
      const result = await executeRequest(config);

      expect(result).toEqual(mockResponse);
    });

    test('should handle 204 No Content status', async () => {
      const mockResponse = {
        status: 204,
        data: ''
      };
      axios.request.mockResolvedValue(mockResponse);

      const config = { method: 'delete', url: 'https://api.getpostman.com/test' };
      const result = await executeRequest(config);

      expect(result).toEqual(mockResponse);
    });

    test('should throw error for axios request failure', async () => {
      const mockError = new Error('Network error');
      axios.request.mockRejectedValue(mockError);

      const config = { method: 'get', url: 'https://api.getpostman.com/test' };

      await expect(executeRequest(config)).rejects.toThrow('Network error');
    });

    test('should throw error for 4xx client error status', async () => {
      const mockResponse = {
        status: 404,
        data: { error: 'Not found' }
      };
      axios.request.mockResolvedValue(mockResponse);

      const config = { method: 'get', url: 'https://api.getpostman.com/test' };

      await expect(executeRequest(config)).rejects.toThrow(/API call failed with status 404/);
    });

    test('should throw error for 5xx server error status', async () => {
      const mockResponse = {
        status: 500,
        data: { error: 'Internal server error' }
      };
      axios.request.mockResolvedValue(mockResponse);

      const config = { method: 'post', url: 'https://api.getpostman.com/test' };

      await expect(executeRequest(config)).rejects.toThrow(/API call failed with status 500/);
    });

    test('should include response data in error message', async () => {
      const mockResponse = {
        status: 400,
        data: { message: 'Bad request', field: 'email' }
      };
      axios.request.mockResolvedValue(mockResponse);

      const config = { method: 'post', url: 'https://api.getpostman.com/test' };

      await expect(executeRequest(config)).rejects.toThrow(/Bad request/);
    });

    test('should handle 3xx redirect status as error', async () => {
      const mockResponse = {
        status: 302,
        data: { location: 'https://redirect.com' }
      };
      axios.request.mockResolvedValue(mockResponse);

      const config = { method: 'get', url: 'https://api.getpostman.com/test' };

      await expect(executeRequest(config)).rejects.toThrow(/API call failed with status 302/);
    });

    test('should handle 1xx informational status as error', async () => {
      const mockResponse = {
        status: 100,
        data: {}
      };
      axios.request.mockResolvedValue(mockResponse);

      const config = { method: 'get', url: 'https://api.getpostman.com/test' };

      await expect(executeRequest(config)).rejects.toThrow(/API call failed with status 100/);
    });
  });
});

