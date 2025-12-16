const { buildAxiosConfig, executeRequest } = require('../core/request');
const { buildQueryString } = require('../core/utils');

/**
 * Gets all API specifications in a workspace
 * Postman API endpoint and method: GET /specs
 * @param {string} workspaceId - The workspace ID
 * @param {string} [cursor] - The pointer to the first record of the set of paginated results
 * @param {number} [limit] - The maximum number of rows to return in the response
 * @returns {Promise} Axios response
 */
async function getSpecs(workspaceId, cursor = null, limit = null) {
  const endpoint = '/specs';
  const queryParams = {
    workspaceId,
    cursor,
    limit
  };
  const fullEndpoint = `${endpoint}${buildQueryString(queryParams)}`;
  const config = buildAxiosConfig('get', fullEndpoint);
  return await executeRequest(config);
}

/**
 * Gets information about a specific API specification
 * Postman API endpoint and method: GET /specs/{specId}
 * @param {string} specId - The spec ID
 * @returns {Promise} Axios response
 */
async function getSpec(specId) {
  const endpoint = `/specs/${specId}`;
  const config = buildAxiosConfig('get', endpoint);
  return await executeRequest(config);
}

/**
 * Creates an API specification in Postman's Spec Hub
 * Postman API endpoint and method: POST /specs
 * @param {string} workspaceId - The workspace ID
 * @param {string} name - The specification's name
 * @param {string} type - The specification's type (e.g., 'OPENAPI:3.0', 'ASYNCAPI:2.0')
 * @param {Array} files - A list of the specification's files and their contents
 * @returns {Promise} Axios response
 */
async function createSpec(workspaceId, name, type, files) {
  const endpoint = '/specs';
  const queryParams = {
    workspaceId
  };
  const fullEndpoint = `${endpoint}${buildQueryString(queryParams)}`;
  const config = buildAxiosConfig('post', fullEndpoint, {
    name,
    type,
    files
  });
  return await executeRequest(config);
}

module.exports = {
  getSpecs,
  getSpec,
  createSpec
};

