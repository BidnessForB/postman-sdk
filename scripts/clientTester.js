#!/usr/bin/env node

/**
 * Test script to execute Postman API endpoints
 * Usage: 
 *   node scripts/clientTester.js list [workspaceId] [cursor] [limit]
 *   node scripts/clientTester.js get <specId>
 */

const { specs } = require('../src/index');
const { POSTMAN_API_KEY_ENV_VAR } = require('../src/core/config');

const DEFAULT_WORKSPACE_ID = '066b3200-1739-4b19-bd52-71700f3a4545';
const DEFAULT_SPEC_ID = '550f281f-ee6a-4860-aef3-6d9fdd7ca405';

/**
 * Logs request parameters
 * @param {Object} params - Key-value pairs to log
 */
function logParams(params) {
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      console.log(`${key}: ${value}`);
    }
  });
  console.log('');
}

/**
 * Logs success response
 * @param {Object} response - Axios response object
 */
function logSuccess(response) {
  console.log('✅ Success!');
  console.log(`Status: ${response.status}`);
  console.log('');
  console.log('Response data:');
  console.log(JSON.stringify(response.data, null, 2));
}

/**
 * Logs error response
 * @param {Error} error - Error object
 */
function logError(error) {
  console.error('❌ Error:');
  console.error(error.message);
  if (error.response) {
    console.error(`Status: ${error.response.status}`);
    console.error('Response:', JSON.stringify(error.response.data, null, 2));
  }
}

/**
 * Executes an API call with standardized logging
 * @param {string} description - Description of the test
 * @param {Object} params - Parameters to log
 * @param {Function} apiCall - Async function that makes the API call
 */
async function executeTest(description, params, apiCall) {
  try {
    console.log(description);
    logParams(params);
    
    const response = await apiCall();
    logSuccess(response);
  } catch (error) {
    logError(error);
    process.exit(1);
  }
}

/**
 * Tests the getSpecs endpoint (list all specs)
 */
async function testGetSpecs() {
  const workspaceId = process.argv[2] || DEFAULT_WORKSPACE_ID;
  const cursor = process.argv[3] || null;
  const limit = process.argv[4] ? parseInt(process.argv[4], 10) : null;

  await executeTest(
    'Testing getSpecs endpoint (list all)...',
    { 'Workspace ID': workspaceId, Cursor: cursor, Limit: limit },
    () => specs.getSpecs(workspaceId, cursor, limit)
  );
}

/**
 * Tests the getSpec endpoint (get specific spec)
 */
async function testGetSpec() {
  const specId = process.argv[2];
  
  if (!specId) {
    console.error('❌ Error: specId is required');
    console.error('Usage: node scripts/clientTester.js get <specId>');
    console.error(`Example: node scripts/clientTester.js get ${DEFAULT_SPEC_ID}`);
    process.exit(1);
  }

  await executeTest(
    'Testing getSpec endpoint (get specific)...',
    { 'Spec ID': specId },
    () => specs.getSpec(specId)
  );
}

/**
 * Validates API key is set
 */
function validateApiKey() {
  if (!process.env[POSTMAN_API_KEY_ENV_VAR]) {
    console.error(`❌ Error: ${POSTMAN_API_KEY_ENV_VAR} environment variable is not set`);
    console.error(`Please set it with: export ${POSTMAN_API_KEY_ENV_VAR}=your_api_key`);
    process.exit(1);
  }
}

/**
 * Main execution
 */
async function main() {
  validateApiKey();
  
  const command = process.argv[2];

  if (command === 'get' && process.argv[3]) {
    process.argv.splice(2, 1);
    await testGetSpec();
  } else if (command === 'list') {
    process.argv.splice(2, 1);
    await testGetSpecs();
  } else {
    await testGetSpecs();
  }
}

main();

