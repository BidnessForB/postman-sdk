const { buildAxiosConfig, executeRequest } = require('../core/request');
const { buildQueryString, validateId } = require('../core/utils');

/**
 * Gets all environments
 * Postman API endpoint and method: GET /environments
 * @param {string} [workspaceId] - Return only results found in the given workspace ID
 * @returns {Promise} Axios response
 */
// REQUIRES: ID (workspaceId uses ID)
async function getEnvironments(workspaceId = null) {
  if (workspaceId !== null) {
    validateId(workspaceId, 'workspaceId');
  }

  const endpoint = '/environments';
  const queryParams = {
    workspace: workspaceId
  };
  const fullEndpoint = `${endpoint}${buildQueryString(queryParams)}`;
  const config = buildAxiosConfig('get', fullEndpoint);
  return await executeRequest(config);
}

/**
 * Creates a new environment
 * Postman API endpoint and method: POST /environments
 * @param {Object} environmentData - The environment object containing name and optional values
 * @param {string} [workspaceId] - A workspace ID in which to create the environment
 * @returns {Promise} Axios response
 */
// REQUIRES: ID (workspaceId uses ID)
async function createEnvironment(environmentData, workspaceId = null) {
  if (workspaceId !== null) {
    validateId(workspaceId, 'workspaceId');
  }

  const endpoint = '/environments';
  const queryParams = {
    workspace: workspaceId
  };
  const fullEndpoint = `${endpoint}${buildQueryString(queryParams)}`;
  const config = buildAxiosConfig('post', fullEndpoint, { environment: environmentData });
  return await executeRequest(config);
}

/**
 * Gets information about an environment
 * Postman API endpoint and method: GET /environments/{environmentId}
 * @param {string} environmentId - The environment's ID
 * @returns {Promise} Axios response
 */
// REQUIRES: ID (environmentId uses ID)
async function getEnvironment(environmentId) {
  validateId(environmentId, 'environmentId');

  const endpoint = `/environments/${environmentId}`;
  const config = buildAxiosConfig('get', endpoint);
  return await executeRequest(config);
}

/**
 * Updates an environment using JSON Patch operations (RFC 6902)
 * Postman API endpoint and method: PATCH /environments/{environmentId}
 * @param {string} environmentId - The environment's ID
 * @param {Array} patchOperations - Array of JSON Patch operations
 * @returns {Promise} Axios response
 * 
 * @example
 * // Update environment name
 * await modifyEnvironment(envId, [
 *   { op: 'replace', path: '/name', value: 'New Name' }
 * ]);
 * 
 * // Add a new variable
 * await modifyEnvironment(envId, [
 *   { op: 'add', path: '/values/0', value: { key: 'api_key', value: 'secret', type: 'secret', enabled: true } }
 * ]);
 * 
 * // Replace a variable's value
 * await modifyEnvironment(envId, [
 *   { op: 'replace', path: '/values/0/value', value: 'new_value' }
 * ]);
 * 
 * // Remove a variable
 * await modifyEnvironment(envId, [
 *   { op: 'remove', path: '/values/2' }
 * ]);
 */
// REQUIRES: ID (environmentId uses ID)
async function modifyEnvironment(environmentId, patchOperations) {
  validateId(environmentId, 'environmentId');

  const endpoint = `/environments/${environmentId}`;
  const config = buildAxiosConfig('patch', endpoint, patchOperations);
  return await executeRequest(config);
}

/**
 * Deletes an environment
 * Postman API endpoint and method: DELETE /environments/{environmentId}
 * @param {string} environmentId - The environment's ID
 * @returns {Promise} Axios response
 */
// REQUIRES: ID (environmentId uses ID)
async function deleteEnvironment(environmentId) {
  validateId(environmentId, 'environmentId');

  const endpoint = `/environments/${environmentId}`;
  const config = buildAxiosConfig('delete', endpoint);
  return await executeRequest(config);
}

module.exports = {
  getEnvironments,
  createEnvironment,
  getEnvironment,
  modifyEnvironment,
  deleteEnvironment
};

