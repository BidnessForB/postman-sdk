const fs = require('fs');
const path = require('path');

const FIXTURES_DIR = path.join(__dirname, '../../../fixtures/specs');

/**
 * Loads a fixture file from the fixtures/specs directory
 * @param {string} filename - The name of the fixture file
 * @returns {string} The contents of the fixture file
 */
function loadFixture(filename) {
  const filePath = path.join(FIXTURES_DIR, filename);
  return fs.readFileSync(filePath, 'utf8');
}

/**
 * Spec type configurations for testing
 */
const SPEC_FIXTURES = {
  'OPENAPI:2.0': {
    yaml: {
      filename: 'openapi-2.0.yaml',
      name: 'OpenAPI 2.0 YAML Spec'
    },
    json: {
      filename: 'openapi-2.0.json',
      name: 'OpenAPI 2.0 JSON Spec'
    }
  },
  'OPENAPI:3.0': {
    yaml: {
      filename: 'openapi-3.0.yaml',
      name: 'OpenAPI 3.0 YAML Spec'
    },
    json: {
      filename: 'openapi-3.0.json',
      name: 'OpenAPI 3.0 JSON Spec'
    }
  },
  'OPENAPI:3.1': {
    yaml: {
      filename: 'openapi-3.1.yaml',
      name: 'OpenAPI 3.1 YAML Spec'
    },
    json: {
      filename: 'openapi-3.1.json',
      name: 'OpenAPI 3.1 JSON Spec'
    }
  },
  'ASYNCAPI:2.0': {
    yaml: {
      filename: 'asyncapi-2.0.yaml',
      name: 'AsyncAPI 2.0 YAML Spec'
    },
    json: {
      filename: 'asyncapi-2.0.json',
      name: 'AsyncAPI 2.0 JSON Spec'
    }
  }
};

/**
 * Gets fixture configuration for a spec type and format
 * @param {string} specType - The spec type (e.g., 'OPENAPI:3.0')
 * @param {string} format - The format ('yaml' or 'json')
 * @returns {Object} Fixture configuration with filename and name
 */
function getFixtureConfig(specType, format) {
  return SPEC_FIXTURES[specType][format];
}

/**
 * Loads a spec fixture and returns the content and metadata
 * @param {string} specType - The spec type (e.g., 'OPENAPI:3.0')
 * @param {string} format - The format ('yaml' or 'json')
 * @returns {Object} Object with content, filename, name, and path properties
 */
function loadSpecFixture(specType, format) {
  const config = getFixtureConfig(specType, format);
  const content = loadFixture(config.filename);
  const filePath = format === 'yaml' ? 'index.yaml' : 'index.json';
  
  return {
    content,
    filename: config.filename,
    name: config.name,
    path: filePath
  };
}

/**
 * Gets all spec type and format combinations for comprehensive testing
 * @returns {Array} Array of {specType, format, config} objects
 */
function getAllSpecFixtures() {
  const fixtures = [];
  
  for (const [specType, formats] of Object.entries(SPEC_FIXTURES)) {
    for (const [format, config] of Object.entries(formats)) {
      fixtures.push({
        specType,
        format,
        config
      });
    }
  }
  
  return fixtures;
}

module.exports = {
  loadFixture,
  loadSpecFixture,
  getFixtureConfig,
  getAllSpecFixtures,
  SPEC_FIXTURES
};

