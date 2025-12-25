/**
 * Integration tests for fixtures module - tests actual file system operations
 * These tests DO NOT mock fs or path, so they provide real code coverage
 */

const { loadFixture, loadSpecFiles } = require('../fixtures');
const fs = require('fs');
const path = require('path');

describe('fixtures integration tests', () => {
  describe('loadFixture', () => {
    test('should load actual openapi-3.0.yaml fixture', () => {
      const result = loadFixture('specs/openapi-3.0.yaml');
      
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result).toContain('openapi');
    });

    test('should load actual openapi-3.1.yaml fixture', () => {
      const result = loadFixture('specs/openapi-3.1.yaml');
      
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result).toContain('openapi');
    });

    test('should load actual asyncapi-2.0.yaml fixture', () => {
      const result = loadFixture('specs/asyncapi-2.0.yaml');
      
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result).toContain('asyncapi');
    });

    test('should throw error for non-existent fixture file', () => {
      expect(() => {
        loadFixture('specs/non-existent-file.yaml');
      }).toThrow(/Fixture file not found/);
    });

    test('should load nested fixture file', () => {
      const result = loadFixture('specs/multi-file/openapi.yaml');
      
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should load JSON fixture file', () => {
      const result = loadFixture('specs/multi-file/components/schemas.json');
      
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      // Should be valid JSON content
      expect(() => JSON.parse(result)).not.toThrow();
    });

    test('should handle deeply nested paths', () => {
      const result = loadFixture('specs/multi-file/components/responses.json');
      
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });

  describe('loadSpecFiles', () => {
    test('should load openapi-3.0 spec files', () => {
      const result = loadSpecFiles('openapi-3.0');
      
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('path', 'openapi.yaml');
      expect(result[0]).toHaveProperty('content');
      expect(result[0].content).toContain('openapi');
    });

    test('should load openapi-3.1 spec files', () => {
      const result = loadSpecFiles('openapi-3.1');
      
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('path', 'openapi.yaml');
      expect(result[0]).toHaveProperty('content');
      expect(result[0].content).toContain('openapi');
    });

    test('should load asyncapi-2.0 spec files', () => {
      const result = loadSpecFiles('asyncapi-2.0');
      
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('path', 'asyncapi.yaml');
      expect(result[0]).toHaveProperty('content');
      expect(result[0].content).toContain('asyncapi');
    });

    test('should load multi-file spec with correct structure', () => {
      const result = loadSpecFiles('multi-file');
      
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(3);
      
      // Check root file
      expect(result[0]).toHaveProperty('path', 'openapi.yaml');
      expect(result[0]).toHaveProperty('type', 'ROOT');
      expect(result[0]).toHaveProperty('content');
      
      // Check schema file
      expect(result[1]).toHaveProperty('path', 'components/schemas.json');
      expect(result[1]).toHaveProperty('type', 'DEFAULT');
      expect(result[1]).toHaveProperty('content');
      
      // Check responses file
      expect(result[2]).toHaveProperty('path', 'components/responses.json');
      expect(result[2]).toHaveProperty('type', 'DEFAULT');
      expect(result[2]).toHaveProperty('content');
    });

    test('should throw error for unknown spec type', () => {
      expect(() => {
        loadSpecFiles('unknown-spec-type');
      }).toThrow(/Unknown spec type/);
    });

    test('should include available types in error message for unknown type', () => {
      try {
        loadSpecFiles('invalid-type');
        fail('Should have thrown error');
      } catch (error) {
        expect(error.message).toContain('openapi-3.0');
        expect(error.message).toContain('openapi-3.1');
        expect(error.message).toContain('asyncapi-2.0');
        expect(error.message).toContain('multi-file');
      }
    });

    test('should return valid content for all spec types', () => {
      const specTypes = ['openapi-3.0', 'openapi-3.1', 'asyncapi-2.0', 'multi-file'];
      
      specTypes.forEach(specType => {
        const result = loadSpecFiles(specType);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        
        result.forEach(file => {
          expect(file).toHaveProperty('path');
          expect(file).toHaveProperty('content');
          expect(typeof file.path).toBe('string');
          expect(typeof file.content).toBe('string');
          expect(file.content.length).toBeGreaterThan(0);
        });
      });
    });

    test('should load actual file content from filesystem', () => {
      const result = loadSpecFiles('openapi-3.0');
      const fixturesDir = path.join(__dirname, '../../../fixtures');
      const directContent = fs.readFileSync(path.join(fixturesDir, 'specs/openapi-3.0.yaml'), 'utf8');
      
      expect(result[0].content).toBe(directContent);
    });

    test('single-file specs should not have type property', () => {
      const singleFileTypes = ['openapi-3.0', 'openapi-3.1', 'asyncapi-2.0'];
      
      singleFileTypes.forEach(specType => {
        const result = loadSpecFiles(specType);
        expect(result[0]).not.toHaveProperty('type');
      });
    });

    test('multi-file spec should have type property for all files', () => {
      const result = loadSpecFiles('multi-file');
      
      result.forEach(file => {
        expect(file).toHaveProperty('type');
        expect(['ROOT', 'DEFAULT']).toContain(file.type);
      });
    });
  });
});

