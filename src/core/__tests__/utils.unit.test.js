const fs = require('fs');
const path = require('path');
const { buildQueryString, getContentFS, buildUid } = require('../utils');

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

  describe('buildUid', () => {
    test('should build UID from userId and objectId', () => {
      const userId = 12345678;
      const objectId = 'c6d2471c-3664-47b5-adc8-35d52484f2f6';
      
      const result = buildUid(userId, objectId);
      
      expect(result).toBe('12345678-c6d2471c-3664-47b5-adc8-35d52484f2f6');
    });

    test('should handle string userId', () => {
      const userId = '12345678';
      const objectId = 'c6d2471c-3664-47b5-adc8-35d52484f2f6';
      
      const result = buildUid(userId, objectId);
      
      expect(result).toBe('12345678-c6d2471c-3664-47b5-adc8-35d52484f2f6');
    });

    test('should return objectId unchanged if it is already a 45-character UID', () => {
      const userId = 12345678;
      const objectId = '12345678-c6d2471c-3664-47b5-adc8-35d52484f2f6'; // 45 chars
      
      const result = buildUid(userId, objectId);
      
      expect(result).toBe(objectId);
      expect(result.length).toBe(45);
    });

    test('should throw error for invalid objectId (not 36 or 45 characters)', () => {
      const userId = 12345678;
      const objectId = 'invalid-id';
      
      expect(() => buildUid(userId, objectId)).toThrow('Invalid object ID');
    });

    test('should throw error for non-string objectId', () => {
      const userId = 12345678;
      const objectId = 12345;
      
      expect(() => buildUid(userId, objectId)).toThrow('Invalid object ID');
    });

    test('should work with different valid 36-character UUIDs', () => {
      const userId = 87654321;
      const objectId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
      
      const result = buildUid(userId, objectId);
      
      expect(result).toBe('87654321-a1b2c3d4-e5f6-7890-1234-567890abcdef');
      expect(result.length).toBe(45);
    });
  });
});

