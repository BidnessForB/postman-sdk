const { buildAxiosConfig, executeRequest } = require('../core/request');
const { buildQueryString } = require('../core/utils');

/**
 * Gets all collections
 * Postman API endpoint and method: GET /collections
 * @param {string} [workspace] - The workspace's ID
 * @param {string} [name] - Filter results by collections that match the given name
 * @param {number} [limit] - Limit the number of results returned
 * @param {number} [offset] - Offset for pagination
 * @returns {Promise} Axios response
 */
async function getCollections(workspace = null, name = null, limit = null, offset = null) {
  const endpoint = '/collections';
  const queryParams = {
    workspace,
    name,
    limit,
    offset
  };
  const fullEndpoint = `${endpoint}${buildQueryString(queryParams)}`;
  const config = buildAxiosConfig('get', fullEndpoint);
  return await executeRequest(config);
}

/**
 * Creates a collection
 * Postman API endpoint and method: POST /collections
 * @param {Object} collection - The collection object following Postman Collection v2.1.0 schema
 * @param {string} [workspace] - The workspace's ID
 * @returns {Promise} Axios response
 */
async function createCollection(collection, workspace = null) {
  const endpoint = '/collections';
  const queryParams = {
    workspace
  };
  const fullEndpoint = `${endpoint}${buildQueryString(queryParams)}`;
  const config = buildAxiosConfig('post', fullEndpoint, { collection });
  return await executeRequest(config);
}

/**
 * Gets a collection by ID
 * Postman API endpoint and method: GET /collections/{collectionId}
 * @param {string} collectionId - The collection's ID
 * @param {string} [access_key] - A collection's read-only access key
 * @param {string} [model] - Return minimal model (only root-level IDs)
 * @returns {Promise} Axios response
 */
async function getCollection(collectionId, access_key = null, model = null) {
  const endpoint = `/collections/${collectionId}`;
  const queryParams = {
    access_key,
    model
  };
  const fullEndpoint = `${endpoint}${buildQueryString(queryParams)}`;
  const config = buildAxiosConfig('get', fullEndpoint);
  return await executeRequest(config);
}

/**
 * Replaces a collection's data
 * Postman API endpoint and method: PUT /collections/{collectionId}
 * @param {string} collectionId - The collection's ID
 * @param {Object} collection - The collection object following Postman Collection v2.1.0 schema
 * @param {string} [prefer] - Set to 'respond-async' for async update
 * @returns {Promise} Axios response
 */
async function updateCollection(collectionId, collection, prefer = null) {
  const endpoint = `/collections/${collectionId}`;
  const config = buildAxiosConfig('put', endpoint, { collection });
  
  if (prefer) {
    config.headers = config.headers || {};
    config.headers['Prefer'] = prefer;
  }
  
  return await executeRequest(config);
}

/**
 * Updates part of a collection
 * Postman API endpoint and method: PATCH /collections/{collectionId}
 * @param {string} collectionId - The collection's ID
 * @param {Object} collection - Partial collection object with fields to update
 * @returns {Promise} Axios response
 */
async function modifyCollection(collectionId, collection) {
  const endpoint = `/collections/${collectionId}`;
  const config = buildAxiosConfig('patch', endpoint, { collection });
  return await executeRequest(config);
}

/**
 * Deletes a collection
 * Postman API endpoint and method: DELETE /collections/{collectionId}
 * @param {string} collectionId - The collection's ID
 * @returns {Promise} Axios response
 */
async function deleteCollection(collectionId) {
  const endpoint = `/collections/${collectionId}`;
  const config = buildAxiosConfig('delete', endpoint);
  return await executeRequest(config);
}

module.exports = {
  getCollections,
  createCollection,
  getCollection,
  updateCollection,
  modifyCollection,
  deleteCollection
};
