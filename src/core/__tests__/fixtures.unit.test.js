const fs = require('fs');
const path = require('path');
const { loadFixture, loadSpecFiles } = require('../fixtures');

jest.mock('fs');
jest.mock('path');

describe('fixtures', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loadFixture', () => {
    test('should load fixture file from fixtures directory', () => {
      const mockContent = 'openapi: 3.0.0\ninfo:\n  title: Test API';
      const fixturePath = 'specs/openapi-3.0.yaml';
      const fixturesDir = '/project/fixtures';
      const fullPath = '/project/fixtures/specs/openapi-3.0.yaml';

      path.join.mockImplementation((...args) => args.join('/'));
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(mockContent);

      const result = loadFixture(fixturePath);

      expect(fs.existsSync).toHaveBeenCalledWith(expect.stringContaining(fixturePath));
      expect(fs.readFileSync).toHaveBeenCalledWith(expect.stringContaining(fixturePath), 'utf8');
      expect(result).toBe(mockContent);
    });

    test('should throw error if fixture file does not exist', () => {
      const fixturePath = 'specs/non-existent.yaml';

      path.join.mockImplementation((...args) => args.join('/'));
      fs.existsSync.mockReturnValue(false);

      expect(() => loadFixture(fixturePath)).toThrow(`Fixture file not found: ${fixturePath}`);
    });

    test('should handle nested fixture paths', () => {
      const mockContent = 'schema content';
      const fixturePath = 'specs/multi-file/components/schemas.json';

      path.join.mockImplementation((...args) => args.join('/'));
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(mockContent);

      const result = loadFixture(fixturePath);

      expect(result).toBe(mockContent);
    });

    test('should read file with utf8 encoding', () => {
      const fixturePath = 'specs/test.yaml';

      path.join.mockImplementation((...args) => args.join('/'));
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue('content');

      loadFixture(fixturePath);

      expect(fs.readFileSync).toHaveBeenCalledWith(expect.any(String), 'utf8');
    });
  });

  describe('loadSpecFiles', () => {
    beforeEach(() => {
      path.join.mockImplementation((...args) => args.join('/'));
      fs.existsSync.mockReturnValue(true);
    });

    test('should load openapi-3.0 spec files', () => {
      const mockContent = 'openapi: 3.0.0';
      fs.readFileSync.mockReturnValue(mockContent);

      const result = loadSpecFiles('openapi-3.0');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        path: 'openapi.yaml',
        content: mockContent
      });
    });

    test('should load openapi-3.1 spec files', () => {
      const mockContent = 'openapi: 3.1.0';
      fs.readFileSync.mockReturnValue(mockContent);

      const result = loadSpecFiles('openapi-3.1');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        path: 'openapi.yaml',
        content: mockContent
      });
    });

    test('should load asyncapi-2.0 spec files', () => {
      const mockContent = 'asyncapi: 2.0.0';
      fs.readFileSync.mockReturnValue(mockContent);

      const result = loadSpecFiles('asyncapi-2.0');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        path: 'asyncapi.yaml',
        content: mockContent
      });
    });

    test('should load multi-file spec with correct structure', () => {
      const mockContents = {
        'openapi.yaml': 'openapi: 3.0.0',
        'schemas.json': '{"User": {}}',
        'responses.json': '{"Error": {}}'
      };
      fs.readFileSync.mockImplementation((filePath) => {
        if (filePath.includes('openapi.yaml')) return mockContents['openapi.yaml'];
        if (filePath.includes('schemas.json')) return mockContents['schemas.json'];
        if (filePath.includes('responses.json')) return mockContents['responses.json'];
      });

      const result = loadSpecFiles('multi-file');

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        path: 'openapi.yaml',
        content: mockContents['openapi.yaml'],
        type: 'ROOT'
      });
      expect(result[1]).toEqual({
        path: 'components/schemas.json',
        content: mockContents['schemas.json'],
        type: 'DEFAULT'
      });
      expect(result[2]).toEqual({
        path: 'components/responses.json',
        content: mockContents['responses.json'],
        type: 'DEFAULT'
      });
    });

    test('should throw error for unknown spec type', () => {
      expect(() => loadSpecFiles('unknown-type')).toThrow(/Unknown spec type/);
      expect(() => loadSpecFiles('unknown-type')).toThrow(/unknown-type/);
    });

    test('should list available spec types in error message', () => {
      try {
        loadSpecFiles('invalid');
      } catch (error) {
        expect(error.message).toContain('openapi-3.0');
        expect(error.message).toContain('openapi-3.1');
        expect(error.message).toContain('asyncapi-2.0');
        expect(error.message).toContain('multi-file');
      }
    });

    test('should return array of file objects for single-file specs', () => {
      fs.readFileSync.mockReturnValue('content');

      const result = loadSpecFiles('openapi-3.0');

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('path');
      expect(result[0]).toHaveProperty('content');
    });

    test('should include type property for multi-file specs', () => {
      fs.readFileSync.mockReturnValue('content');

      const result = loadSpecFiles('multi-file');

      result.forEach(file => {
        expect(file).toHaveProperty('type');
      });
    });

    test('should not include type property for single-file specs', () => {
      fs.readFileSync.mockReturnValue('content');

      const result = loadSpecFiles('openapi-3.0');

      expect(result[0]).not.toHaveProperty('type');
    });
  });
});

