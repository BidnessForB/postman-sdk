const { buildAxiosConfig, executeRequest } = require('../core/request');
const { buildQueryString, validateId, validateUid } = require('../core/utils');

/**
 * Gets all environments
 * Postman API endpoint and method: GET /environments
 * @param {string} [workspaceId] - Return only results found in the given workspace ID
 * @returns {Promise} Axios response with environments array
 * @example
 * // Get all environments
 * const response = await getEnvironments();
 * console.log(response.data.environments);
 * 
 * @example
 * // Get environments in a specific workspace
 * const response = await getEnvironments('workspace-id-123');
 */
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
 * @param {string} environmentData.name - (Required) The environment's name
 * @param {Array} [environmentData.values] - Array of environment variable objects
 * @param {string} [environmentData.values[].key] - The variable's key name
 * @param {string} [environmentData.values[].value] - The variable's value
 * @param {string} [environmentData.values[].type] - The variable type ('default' or 'secret')
 * @param {boolean} [environmentData.values[].enabled] - Whether the variable is enabled
 * @param {string} [workspaceId] - A workspace ID in which to create the environment
 * @returns {Promise} Axios response with created environment data
 * @example
 * // Create a simple environment
 * const response = await createEnvironment({
 *   name: 'Production'
 * });
 * 
 * @example
 * // Create an environment with variables
 * const response = await createEnvironment({
 *   name: 'Development',
 *   values: [
 *     { key: 'base_url', value: 'https://api.dev.example.com', type: 'default', enabled: true },
 *     { key: 'api_key', value: 'dev_key_123', type: 'secret', enabled: true }
 *   ]
 * });
 * 
 * @example
 * // Create environment in specific workspace
 * const response = await createEnvironment(
 *   {
 *     name: 'Staging',
 *     values: [
 *       { key: 'base_url', value: 'https://api.staging.example.com', enabled: true }
 *     ]
 *   },
 *   'workspace-id-123'
 * );
 */
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
 * @returns {Promise} Axios response with environment data including all variables
 * @example
 * // Get environment by ID
 * const response = await getEnvironment('environment-id-123');
 * console.log(response.data.environment);
 * console.log(response.data.environment.values);
 */
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
 * @param {string} patchOperations[].op - The operation ('add', 'remove', 'replace', 'copy', 'move', 'test')
 * @param {string} patchOperations[].path - The JSON path to modify
 * @param {*} [patchOperations[].value] - The value for add/replace operations
 * @returns {Promise} Axios response with updated environment data
 * @example
 * // Update environment name
 * const response = await modifyEnvironment('env-id-123', [
 *   { op: 'replace', path: '/name', value: 'Production Environment' }
 * ]);
 * 
 * @example
 * // Add a new variable
 * const response = await modifyEnvironment('env-id-123', [
 *   { 
 *     op: 'add', 
 *     path: '/values/0', 
 *     value: { key: 'api_key', value: 'secret_key', type: 'secret', enabled: true } 
 *   }
 * ]);
 * 
 * @example
 * // Replace a variable's value
 * const response = await modifyEnvironment('env-id-123', [
 *   { op: 'replace', path: '/values/0/value', value: 'new_api_key' }
 * ]);
 * 
 * @example
 * // Remove a variable
 * const response = await modifyEnvironment('env-id-123', [
 *   { op: 'remove', path: '/values/2' }
 * ]);
 * 
 * @example
 * // Multiple operations at once
 * const response = await modifyEnvironment('env-id-123', [
 *   { op: 'replace', path: '/name', value: 'Updated Name' },
 *   { op: 'replace', path: '/values/0/value', value: 'updated_value' },
 *   { op: 'add', path: '/values/-', value: { key: 'new_var', value: 'value', enabled: true } }
 * ]);
 */
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
 * @returns {Promise} Axios response with deletion confirmation
 * @example
 * // Delete an environment
 * const response = await deleteEnvironment('environment-id-123');
 * console.log(response.data.environment);
 */
async function deleteEnvironment(environmentId) {
  validateId(environmentId, 'environmentId');

  const endpoint = `/environments/${environmentId}`;
  const config = buildAxiosConfig('delete', endpoint);
  return await executeRequest(config);
}

/**
 * Gets all forks of an environment
 * Postman API endpoint and method: GET /environments/{environmentUid}/forks
 * @param {string} environmentUid - The environment's unique ID
 * @param {string} [cursor] - The pointer to the first record of the set of paginated results
 * @param {string} [direction] - Sort results in ascending ('asc') or descending ('desc') order
 * @param {number} [limit] - The maximum number of rows to return in the response (default 10)
 * @param {string} [sort] - Sort the results by the date and time of creation ('createdAt')
 * @returns {Promise} Axios response with array of environment forks
 * @example
 * // Get all forks of an environment
 * const response = await getEnvironmentForks('12345678-env-uid-123');
 * console.log(response.data.data);
 * 
 * @example
 * // Get forks with pagination
 * const response = await getEnvironmentForks('12345678-env-uid-123', null, 'desc', 20, 'createdAt');
 * console.log(response.data.meta.nextCursor);
 */
async function getEnvironmentForks(environmentUid, cursor = null, direction = null, limit = null, sort = null) {
  validateUid(environmentUid, 'environmentUid');

  const endpoint = `/environments/${environmentUid}/forks`;
  const queryParams = {
    cursor,
    direction,
    limit,
    sort
  };
  const fullEndpoint = `${endpoint}${buildQueryString(queryParams)}`;
  const config = buildAxiosConfig('get', fullEndpoint);
  return await executeRequest(config);
}

/**
 * Creates a fork from an existing environment
 * Postman API endpoint and method: POST /environments/{environmentUid}/forks
 * @param {string} environmentUid - The environment's unique ID to fork
 * @param {string} workspaceId - The workspace ID in which to fork the environment (required)
 * @param {string} forkName - The fork's label (required)
 * @returns {Promise} Axios response with forked environment data
 * @example
 * // Create a fork of an environment
 * const response = await createEnvironmentFork(
 *   '12345678-env-uid-123',
 *   'workspace-id-456',
 *   'My Environment Fork'
 * );
 * console.log(response.data.environment);
 */
async function createEnvironmentFork(environmentUid, workspaceId, forkName) {
  validateUid(environmentUid, 'environmentUid');
  validateId(workspaceId, 'workspaceId');

  const endpoint = `/environments/${environmentUid}/forks`;
  const queryParams = {
    workspace: workspaceId
  };
  const fullEndpoint = `${endpoint}${buildQueryString(queryParams)}`;
  const config = buildAxiosConfig('post', fullEndpoint, { forkName });
  return await executeRequest(config);
}

/**
 * Merges a forked environment back into its parent environment
 * Postman API endpoint and method: POST /environments/{environmentUid}/merges
 * @param {string} environmentUid - The forked environment's unique ID
 * @returns {Promise} Axios response with merged environment data
 * @example
 * // Merge a fork back to parent
 * const response = await mergeEnvironmentFork('12345678-fork-uid-123');
 * console.log(response.data.environment.uid);
 */
async function mergeEnvironmentFork(environmentUid) {
  validateUid(environmentUid, 'environmentUid');

  const endpoint = `/environments/${environmentUid}/merges`;
  const config = buildAxiosConfig('post', endpoint);
  return await executeRequest(config);
}

/**
 * Pulls changes from parent environment into a forked environment
 * Postman API endpoint and method: POST /environments/{environmentUid}/pulls
 * @param {string} environmentUid - The forked environment's unique ID
 * @returns {Promise} Axios response with updated environment data
 * @example
 * // Pull parent changes into fork
 * const response = await pullEnvironmentChanges('12345678-fork-uid-123');
 * console.log(response.data.environment.uid);
 */
async function pullEnvironmentChanges(environmentUid, data = undefined) {
  validateUid(environmentUid, 'environmentUid');
  
  const endpoint = `/environments/${environmentUid}/pulls`;
  const config = buildAxiosConfig('post', endpoint, data);
  return await executeRequest(config);
}

module.exports = {
  getEnvironments,
  createEnvironment,
  getEnvironment,
  modifyEnvironment,
  deleteEnvironment,
  getEnvironmentForks,
  createEnvironmentFork,
  mergeEnvironmentFork,
  pullEnvironmentChanges
};

