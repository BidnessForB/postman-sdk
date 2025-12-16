#!/usr/bin/env node

/**
 * Test script to execute the createSpec endpoint using fixtures
 * Usage: node scripts/test-createSpec.js [workspaceId] [specType]
 * 
 * Spec types: openapi-3.0, openapi-3.1, asyncapi-2.0, multi-file
 */

const { specs } = require('../src/index');
const { POSTMAN_API_KEY_ENV_VAR } = require('../src/core/config');
const { loadSpecFiles } = require('../src/core/fixtures');

const DEFAULT_WORKSPACE_ID = '066b3200-1739-4b19-bd52-71700f3a4545';
const DEFAULT_SPEC_TYPE = 'openapi-3.0';

async function testCreateSpec() {
  try {
    // Get arguments from command line or use defaults
    const workspaceId = process.argv[2] || DEFAULT_WORKSPACE_ID;
    const specType = process.argv[3] || DEFAULT_SPEC_TYPE;

    console.log('Testing createSpec endpoint...');
    console.log(`Workspace ID: ${workspaceId}`);
    console.log(`Spec Type: ${specType}`);
    console.log('');

    // Load spec files from fixtures
    const files = loadSpecFiles(specType);
    console.log(`Loaded ${files.length} file(s) from fixtures`);
    console.log('');

    // Determine spec type for Postman API
    const postmanSpecType = specType === 'openapi-3.0' ? 'OPENAPI:3.0' :
                           specType === 'openapi-3.1' ? 'OPENAPI:3.1' :
                           specType === 'asyncapi-2.0' ? 'ASYNCAPI:2.0' :
                           'OPENAPI:3.0';

    const specName = `Test Spec - ${specType} - ${new Date().toISOString()}`;

    const response = await specs.createSpec(workspaceId, specName, postmanSpecType, files);

    console.log('✅ Success!');
    console.log(`Status: ${response.status}`);
    console.log('');
    console.log('Response data:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ Error:');
    console.error(error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

// Check if API key is set
if (!process.env[POSTMAN_API_KEY_ENV_VAR]) {
  console.error(`❌ Error: ${POSTMAN_API_KEY_ENV_VAR} environment variable is not set`);
  console.error(`Please set it with: export ${POSTMAN_API_KEY_ENV_VAR}=your_api_key`);
  process.exit(1);
}

testCreateSpec();

