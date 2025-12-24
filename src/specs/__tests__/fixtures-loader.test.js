const { 
  loadFixture, 
  loadSpecFixture, 
  getFixtureConfig, 
  getAllSpecFixtures,
  SPEC_FIXTURES 
} = require('./fixtures-loader');

describe('fixtures-loader', () => {
  describe('loadFixture', () => {
    test('should load openapi-3.0.yaml fixture', () => {
      const content = loadFixture('openapi-3.0.yaml');
      
      expect(content).toBeDefined();
      expect(typeof content).toBe('string');
      expect(content).toContain('openapi: 3.0.0');
      expect(content).toContain('title: Example API');
    });

    test('should load asyncapi-2.0.json fixture', () => {
      const content = loadFixture('asyncapi-2.0.json');
      
      expect(content).toBeDefined();
      expect(typeof content).toBe('string');
      expect(content).toContain('"asyncapi": "2.0.0"');
    });

    test('should load openapi-2.0.yaml fixture', () => {
      const content = loadFixture('openapi-2.0.yaml');
      
      expect(content).toBeDefined();
      expect(content).toContain("swagger: '2.0'");
    });
  });

  describe('getFixtureConfig', () => {
    test('should get config for OPENAPI:3.0 YAML', () => {
      const config = getFixtureConfig('OPENAPI:3.0', 'yaml');
      
      expect(config).toBeDefined();
      expect(config.filename).toBe('openapi-3.0.yaml');
      expect(config.name).toBe('OpenAPI 3.0 YAML Spec');
    });

    test('should get config for ASYNCAPI:2.0 JSON', () => {
      const config = getFixtureConfig('ASYNCAPI:2.0', 'json');
      
      expect(config).toBeDefined();
      expect(config.filename).toBe('asyncapi-2.0.json');
      expect(config.name).toBe('AsyncAPI 2.0 JSON Spec');
    });

    test('should get config for OPENAPI:2.0 YAML', () => {
      const config = getFixtureConfig('OPENAPI:2.0', 'yaml');
      
      expect(config).toBeDefined();
      expect(config.filename).toBe('openapi-2.0.yaml');
      expect(config.name).toBe('OpenAPI 2.0 YAML Spec');
    });
  });

  describe('loadSpecFixture', () => {
    test('should load OPENAPI:3.0 YAML fixture with metadata', () => {
      const fixture = loadSpecFixture('OPENAPI:3.0', 'yaml');
      
      expect(fixture).toBeDefined();
      expect(fixture).toHaveProperty('content');
      expect(fixture).toHaveProperty('filename');
      expect(fixture).toHaveProperty('name');
      expect(fixture).toHaveProperty('path');
      
      expect(fixture.content).toContain('openapi: 3.0.0');
      expect(fixture.filename).toBe('openapi-3.0.yaml');
      expect(fixture.name).toBe('OpenAPI 3.0 YAML Spec');
      expect(fixture.path).toBe('index.yaml');
    });

    test('should load OPENAPI:3.1 JSON fixture with metadata', () => {
      const fixture = loadSpecFixture('OPENAPI:3.1', 'json');
      
      expect(fixture).toBeDefined();
      expect(fixture.content).toContain('"openapi": "3.1.0"');
      expect(fixture.filename).toBe('openapi-3.1.json');
      expect(fixture.name).toBe('OpenAPI 3.1 JSON Spec');
      expect(fixture.path).toBe('index.json');
    });

    test('should load ASYNCAPI:2.0 YAML fixture with metadata', () => {
      const fixture = loadSpecFixture('ASYNCAPI:2.0', 'yaml');
      
      expect(fixture).toBeDefined();
      expect(fixture.content).toContain('asyncapi: 2.0.0');
      expect(fixture.filename).toBe('asyncapi-2.0.yaml');
      expect(fixture.path).toBe('index.yaml');
    });

    test('should load OPENAPI:2.0 JSON fixture with metadata', () => {
      const fixture = loadSpecFixture('OPENAPI:2.0', 'json');
      
      expect(fixture).toBeDefined();
      expect(fixture.content).toContain('"swagger": "2.0"');
      expect(fixture.filename).toBe('openapi-2.0.json');
      expect(fixture.path).toBe('index.json');
    });
  });

  describe('getAllSpecFixtures', () => {
    test('should return all spec type and format combinations', () => {
      const fixtures = getAllSpecFixtures();
      
      expect(fixtures).toBeDefined();
      expect(Array.isArray(fixtures)).toBe(true);
      expect(fixtures.length).toBe(8); // 4 types × 2 formats
      
      // Verify each fixture has required properties
      fixtures.forEach(fixture => {
        expect(fixture).toHaveProperty('specType');
        expect(fixture).toHaveProperty('format');
        expect(fixture).toHaveProperty('config');
        expect(fixture.config).toHaveProperty('filename');
        expect(fixture.config).toHaveProperty('name');
      });
      
      // Check that all spec types are included
      const specTypes = fixtures.map(f => f.specType);
      expect(specTypes).toContain('OPENAPI:2.0');
      expect(specTypes).toContain('OPENAPI:3.0');
      expect(specTypes).toContain('OPENAPI:3.1');
      expect(specTypes).toContain('ASYNCAPI:2.0');
      
      // Check that both formats are included for each type
      const formats = fixtures.map(f => f.format);
      expect(formats.filter(f => f === 'yaml')).toHaveLength(4);
      expect(formats.filter(f => f === 'json')).toHaveLength(4);
    });

    test('should include all expected spec types', () => {
      const fixtures = getAllSpecFixtures();
      const specTypes = new Set(fixtures.map(f => f.specType));
      
      expect(specTypes.has('OPENAPI:2.0')).toBe(true);
      expect(specTypes.has('OPENAPI:3.0')).toBe(true);
      expect(specTypes.has('OPENAPI:3.1')).toBe(true);
      expect(specTypes.has('ASYNCAPI:2.0')).toBe(true);
      expect(specTypes.size).toBe(4);
    });
  });

  describe('SPEC_FIXTURES constant', () => {
    test('should have all required spec types', () => {
      expect(SPEC_FIXTURES['OPENAPI:2.0']).toBeDefined();
      expect(SPEC_FIXTURES['OPENAPI:3.0']).toBeDefined();
      expect(SPEC_FIXTURES['OPENAPI:3.1']).toBeDefined();
      expect(SPEC_FIXTURES['ASYNCAPI:2.0']).toBeDefined();
    });

    test('each spec type should have yaml and json formats', () => {
      Object.values(SPEC_FIXTURES).forEach(specType => {
        expect(specType).toHaveProperty('yaml');
        expect(specType).toHaveProperty('json');
        expect(specType.yaml).toHaveProperty('filename');
        expect(specType.yaml).toHaveProperty('name');
        expect(specType.json).toHaveProperty('filename');
        expect(specType.json).toHaveProperty('name');
      });
    });
  });
});

