const fs = require('fs');
const path = require('path');

/**
 * Loads a fixture file from the fixtures directory
 * @param {string} fixturePath - Path relative to fixtures/ directory (e.g., 'specs/openapi-3.0.yaml')
 * @returns {string} File content as string
 */
function loadFixture(fixturePath) {
  const fixturesDir = path.join(__dirname, '../../fixtures');
  const fullPath = path.join(fixturesDir, fixturePath);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Fixture file not found: ${fixturePath}`);
  }
  
  return fs.readFileSync(fullPath, 'utf8');
}

/**
 * Loads spec files for createSpec based on spec type
 * @param {string} specType - Type of spec ('openapi-3.0', 'openapi-3.1', 'asyncapi-2.0', 'multi-file')
 * @returns {Array} Array of file objects with path and content
 */
function loadSpecFiles(specType) {
  const specMap = {
    'openapi-3.0': [
      { path: 'openapi.yaml', content: loadFixture('specs/openapi-3.0.yaml') }
    ],
    'openapi-3.1': [
      { path: 'openapi.yaml', content: loadFixture('specs/openapi-3.1.yaml') }
    ],
    'asyncapi-2.0': [
      { path: 'asyncapi.yaml', content: loadFixture('specs/asyncapi-2.0.yaml') }
    ],
    'multi-file': [
      { path: 'openapi.yaml', content: loadFixture('specs/multi-file/openapi.yaml'), type: 'ROOT' },
      { path: 'components/schemas.json', content: loadFixture('specs/multi-file/components/schemas.json'), type: 'DEFAULT' },
      { path: 'components/responses.json', content: loadFixture('specs/multi-file/components/responses.json'), type: 'DEFAULT' }
    ]
  };

  if (!specMap[specType]) {
    throw new Error(`Unknown spec type: ${specType}. Available types: ${Object.keys(specMap).join(', ')}`);
  }

  return specMap[specType];
}

module.exports = {
  loadFixture,
  loadSpecFiles
};

