const fs = require('fs');
const path = require('path');
const { buildQueryString, getContentFS } = require('../utils');

jest.mock('fs');
jest.mock('path');

const DEFAULT_WORKSPACE_ID = '066b3200-1739-4b19-bd52-71700f3a4545';

describe('utils', () => {
  describe('buildQueryString', () => {
    test('should build query string from params object', () => {
      const params = {
        workspaceId: DEFAULT_WORKSPACE_ID,
        limit: 10,
        cursor: 'cursor-value'
      };
      const result = buildQueryString(params);
      expect(result).toBe(`?workspaceId=${DEFAULT_WORKSPACE_ID}&limit=10&cursor=cursor-value`);
    });

    test('should handle undefined values', () => {
      const params = {
        workspaceId: DEFAULT_WORKSPACE_ID,
        limit: undefined,
        cursor: 'cursor-value'
      };
      const result = buildQueryString(params);
      expect(result).toBe(`?workspaceId=${DEFAULT_WORKSPACE_ID}&cursor=cursor-value`);
    });

    test('should handle null values', () => {
      const params = {
        workspaceId: DEFAULT_WORKSPACE_ID,
        limit: null,
        cursor: 'cursor-value'
      };
      const result = buildQueryString(params);
      expect(result).toBe(`?workspaceId=${DEFAULT_WORKSPACE_ID}&cursor=cursor-value`);
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

  
});

