const axios = require('axios');
const { buildAxiosConfig, executeRequest } = require('../request');

jest.mock('axios');
jest.mock('../config', () => ({
  apiKey: 'test-api-key',
  baseUrl: 'https://api.getpostman.com'
}));

describe('request', () => {
  describe('buildAxiosConfig', () => {
    test('should build config with method and endpoint', () => {
      const config = buildAxiosConfig('get', '/specs');
      expect(config.method).toBe('get');
      expect(config.url).toBe('https://api.getpostman.com/specs');
    });

    test('should include headers with API key', () => {
      const config = buildAxiosConfig('get', '/specs');
      expect(config.headers).toEqual({
        'Content-Type': 'application/json',
        'X-API-Key': 'test-api-key'
      });
    });

    test('should include data when provided', () => {
      const data = { name: 'test', type: 'OPENAPI:3.0' };
      const config = buildAxiosConfig('post', '/specs', data);
      expect(config.data).toEqual(data);
    });

    test('should not include data when undefined', () => {
      const config = buildAxiosConfig('get', '/specs');
      expect(config.data).toBeUndefined();
    });

    test('should include extra config options', () => {
      const extra = { maxBodyLength: Infinity };
      const config = buildAxiosConfig('post', '/specs', { data: 'test' }, extra);
      expect(config.maxBodyLength).toBe(Infinity);
    });

    test('should handle null data', () => {
      const config = buildAxiosConfig('post', '/specs', null);
      expect(config.data).toBeNull();
    });
  });

  describe('executeRequest', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should return response for successful request', async () => {
      const mockResponse = {
        status: 200,
        data: { id: '123', name: 'test' }
      };
      axios.request.mockResolvedValue(mockResponse);

      const config = { method: 'get', url: '/specs' };
      const result = await executeRequest(config);

      expect(axios.request).toHaveBeenCalledWith(config);
      expect(result).toEqual(mockResponse);
    });

    test('should throw error for non-2xx status codes', async () => {
      const mockResponse = {
        status: 404,
        data: { error: 'Not found' }
      };
      axios.request.mockResolvedValue(mockResponse);

      const config = { method: 'get', url: '/specs/invalid' };
      
      await expect(executeRequest(config)).rejects.toThrow(
        'API call failed with status 404: {"error":"Not found"}'
      );
    });

    test('should throw error for 4xx status codes', async () => {
      const mockResponse = {
        status: 400,
        data: { error: 'Bad request' }
      };
      axios.request.mockResolvedValue(mockResponse);

      const config = { method: 'post', url: '/specs' };
      
      await expect(executeRequest(config)).rejects.toThrow();
    });

    test('should throw error for 5xx status codes', async () => {
      const mockResponse = {
        status: 500,
        data: { error: 'Internal server error' }
      };
      axios.request.mockResolvedValue(mockResponse);

      const config = { method: 'get', url: '/specs' };
      
      await expect(executeRequest(config)).rejects.toThrow();
    });
  });
});

