const fs = require('fs');
const path = require('path');
const { buildQueryString, getContentFS, validateId, validateUid } = require('../utils');
const { DEFAULT_ID, DEFAULT_UID } = require('../../__tests__/test-helpers');

jest.mock('fs');
jest.mock('path');

// Standard test constants - valid ID and UID formats


describe('utils', () => {
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

  

  
});

// Export constants for use in other test files
module.exports = {
  DEFAULT_ID,
  DEFAULT_UID
};

