#!/usr/bin/env node

/**
 * Test script to execute the getSpecs and getSpec endpoints
 * Usage: 
 *   node scripts/test-getSpecs.js list [workspaceId] [cursor] [limit]
 *   node scripts/test-getSpecs.js get <specId>
 */

const { specs } = require('../src/index');
const { POSTMAN_API_KEY_ENV_VAR } = require('../src/core/config');

const DEFAULT_WORKSPACE_ID = '066b3200-1739-4b19-bd52-71700f3a4545';

async function testGetSpecs() {
  try {
    // Get arguments from command line or use defaults
    const workspaceId = process.argv[2] || DEFAULT_WORKSPACE_ID;
    const cursor = process.argv[3] || null;
    const limit = process.argv[4] ? parseInt(process.argv[4], 10) : null;

    console.log('Testing getSpecs endpoint (list all)...');
    console.log(`Workspace ID: ${workspaceId}`);
    if (cursor) console.log(`Cursor: ${cursor}`);
    if (limit) console.log(`Limit: ${limit}`);
    console.log('');

    const response = await specs.getSpecs(workspaceId, cursor, limit);

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

async function testGetSpec() {
  try {
    const specId = process.argv[2];
    
    if (!specId) {
      console.error('❌ Error: specId is required');
      console.error('Usage: node scripts/test-getSpecs.js get <specId>');
      process.exit(1);
    }

    console.log('Testing getSpec endpoint (get specific)...');
    console.log(`Spec ID: ${specId}`);
    console.log('');

    const response = await specs.getSpec(specId);

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

// Parse command
const command = process.argv[2];

if (command === 'get' && process.argv[3]) {
  // Remove 'get' from argv so specId becomes argv[2]
  process.argv.splice(2, 1);
  testGetSpec();
} else if (command === 'list') {
  // Remove 'list' from argv so workspaceId becomes argv[2]
  process.argv.splice(2, 1);
  testGetSpecs();
} else {
  // Default behavior: treat first arg as workspaceId for listing
  testGetSpecs();
}

