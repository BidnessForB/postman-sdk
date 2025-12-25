const { buildAxiosConfig, executeRequest } = require('../core/request');
const { buildQueryString } = require('../core/utils');

/**
 * Gets all environments
 * Postman API endpoint and method: GET /environments
 * @param {string} [workspace] - Return only results found in the given workspace ID
 * @returns {Promise} Axios response
 */
async function getEnvironments(workspace = null) {
  const endpoint = '/environments';
  const queryParams = {
    workspace
  };
  const fullEndpoint = `${endpoint}${buildQueryString(queryParams)}`;
  const config = buildAxiosConfig('get', fullEndpoint);
  return await executeRequest(config);
}

/**
 * Creates a new environment
 * Postman API endpoint and method: POST /environments
 * @param {Object} environmentData - The environment object containing name and optional values
 * @param {string} [workspace] - A workspace ID in which to create the environment
 * @returns {Promise} Axios response
 */
async function createEnvironment(environmentData, workspace = null) {
  const endpoint = '/environments';
  const queryParams = {
    workspace
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
async function getEnvironment(environmentId) {
  const endpoint = `/environments/${environmentId}`;
  const config = buildAxiosConfig('get', endpoint);
  return await executeRequest(config);
}

/**
 * Updates an environment (partial update using PATCH)
 * Postman API endpoint and method: PATCH /environments/{environmentId}
 * @param {string} environmentId - The environment's ID
 * @param {Object} environmentData - The environment update data
 * @returns {Promise} Axios response
 */
async function modifyEnvironment(environmentId, environmentData) {
  const endpoint = `/environments/${environmentId}`;
  const config = buildAxiosConfig('patch', endpoint, { environment: environmentData });
  return await executeRequest(config);
}

/**
 * Deletes an environment
 * Postman API endpoint and method: DELETE /environments/{environmentId}
 * @param {string} environmentId - The environment's ID
 * @returns {Promise} Axios response
 */
async function deleteEnvironment(environmentId) {
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

