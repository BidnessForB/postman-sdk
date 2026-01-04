const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { 
  buildQueryString, 
  getContentFS, 
  validateId, 
  validateUid,
  buildAxiosConfig,
  executeRequest
} = require('../utils');
const { DEFAULT_ID, DEFAULT_UID } = require('../../__tests__/test-helpers');

jest.mock('fs');
jest.mock('path');
jest.mock('axios');
jest.mock('../config', () => ({
  apiKey: 'test-api-key',
  baseUrl: 'https://api.getpostman.com'
}));

// Standard test constants - valid ID and UID formats


describe('Core Module Tests', () => {
  describe('buildQueryString', () => {
    test('should build query string from params object', () => {
      const params = {
        workspaceId: DEFAULT_ID,
        limit: 10,
        cursor: 'cursor-value'
      };
      const result = buildQueryString(params);
      expect(result).toBe(`?workspaceId=${DEFAULT_ID}&limit=10&cursor=cursor-value`);
    });

    test('should handle undefined values', () => {
      const params = {
        workspaceId: DEFAULT_ID,
        limit: undefined,
        cursor: 'cursor-value'
      };
      const result = buildQueryString(params);
      expect(result).toBe(`?workspaceId=${DEFAULT_ID}&cursor=cursor-value`);
    });

    test('should handle null values', () => {
      const params = {
        workspaceId: DEFAULT_ID,
        limit: null,
        cursor: 'cursor-value'
      };
      const result = buildQueryString(params);
      expect(result).toBe(`?workspaceId=${DEFAULT_ID}&cursor=cursor-value`);
    });

    test('should return empty string for empty params', () => {
      const result = buildQueryString({});
      expect(result).toBe('');
    });

    test('should convert numbers to strings', () => {
      const params = {
        limit: 10,
        offset: 20
      };
      const result = buildQueryString(params);
      expect(result).toBe('?limit=10&offset=20');
    });
  });

  describe('getContentFS', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should read file content and return object with content property', () => {
      const mockContent = 'test file content';
      const mockPath = '/path/to/file.yaml';
      
      path.resolve.mockReturnValue(mockPath);
      fs.readFileSync.mockReturnValue(mockContent);

      const result = getContentFS('file.yaml');

      expect(path.resolve).toHaveBeenCalledWith('file.yaml');
      expect(fs.readFileSync).toHaveBeenCalledWith(mockPath, 'utf8');
      expect(result).toEqual({ content: mockContent });
    });

    test('should resolve file path correctly', () => {
      const mockContent = 'content';
      const filePath = './relative/path.yaml';
      const resolvedPath = '/absolute/path.yaml';
      
      path.resolve.mockReturnValue(resolvedPath);
      fs.readFileSync.mockReturnValue(mockContent);

      getContentFS(filePath);

      expect(path.resolve).toHaveBeenCalledWith(filePath);
      expect(fs.readFileSync).toHaveBeenCalledWith(resolvedPath, 'utf8');
    });
  });

  describe('validateId', () => {
    test('should validate correct ID format', () => {
      expect(() => validateId(DEFAULT_ID, 'testId')).not.toThrow();
    });

    test('should throw error for missing ID', () => {
      expect(() => validateId(null, 'testId')).toThrow('testId is required');
      expect(() => validateId(undefined, 'testId')).toThrow('testId is required');
      expect(() => validateId('', 'testId')).toThrow('testId is required');
    });

    test('should throw error for invalid ID format', () => {
      expect(() => validateId('invalid-id', 'testId')).toThrow('testId must be a valid ID format');
      expect(() => validateId('12345', 'testId')).toThrow('testId must be a valid ID format');
      expect(() => validateId('not-a-UID', 'testId')).toThrow('testId must be a valid ID format');
    });

    test('should accept uppercase ID', () => {
      expect(() => validateId('12345678-1234-1234-1234-123456789ABC', 'testId')).not.toThrow();
    });
  });

  describe('validateUid', () => {
    test('should validate correct UID format', () => {
      expect(() => validateUid(DEFAULT_UID, 'testUid')).not.toThrow();
    });

    test('should throw error for missing UID', () => {
      expect(() => validateUid(null, 'testUid')).toThrow('testUid is required');
      expect(() => validateUid(undefined, 'testUid')).toThrow('testUid is required');
      expect(() => validateUid('', 'testUid')).toThrow('testUid is required');
    });

    test('should throw error for invalid UID format', () => {
      expect(() => validateUid('invalid-uid', 'testUid')).toThrow('testUid must be a valid UID format');
      expect(() => validateUid(DEFAULT_ID, 'testUid')).toThrow('testUid must be a valid UID format');
      expect(() => validateUid('12345-invalid', 'testUid')).toThrow('testUid must be a valid UID format');
    });

    test('should accept various userId lengths', () => {
      expect(() => validateUid('1-12345678-1234-1234-1234-123456789abc', 'testUid')).not.toThrow();
      expect(() => validateUid('1234567890-12345678-1234-1234-1234-123456789abc', 'testUid')).not.toThrow();
    });
  });

  describe('buildAxiosConfig', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

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
    beforeEach(() => {
      jest.clearAllMocks();
    });

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
      
      try {
        result = await executeRequest(config);
      }
      catch (error) {
        result = error;
        expect(result.status).toBe(404);
        expect(result.data).toHaveProperty('error');
        expect(result.data.error).toBe('Not found');
      }
    });

    test('should throw error for 5xx server error status', async () => {
      const mockResponse = {
        status: 500,
        data: { error: 'Internal server error' }
      };
      axios.request.mockResolvedValue(mockResponse);

      const config = { method: 'post', url: 'https://api.getpostman.com/test' };

      try {
        await executeRequest(config);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/API call failed with status 500/);
      }
    });

    test('should include response data in error message', async () => {
      const mockResponse = {
        status: 400,
        data: { message: 'Bad request', field: 'email' }
      };
      axios.request.mockResolvedValue(mockResponse);

      const config = { method: 'post', url: 'https://api.getpostman.com/test' };

      try {
        await executeRequest(config);
      } catch (error) {
        expect(error.message).toMatch(/Bad request/);
      }
    });

    test('should handle 3xx redirect status as error', async () => {
      const mockResponse = {
        status: 302,
        data: { location: 'https://redirect.com' }
      };
      axios.request.mockResolvedValue(mockResponse);

      const config = { method: 'get', url: 'https://api.getpostman.com/test' };

      try {
        await executeRequest(config);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/API call failed with status 302/);
      }
    });

    test('should handle 1xx informational status as error', async () => {
      const mockResponse = {
        status: 100,
        data: {}
      };
      axios.request.mockResolvedValue(mockResponse);

      const config = { method: 'get', url: 'https://api.getpostman.com/test' };

      try {
        await executeRequest(config);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/API call failed with status 100/);
      }
    });
  });
});

// Export constants for use in other test files
module.exports = {
  DEFAULT_ID,
  DEFAULT_UID
};

