const { buildAxiosConfig, executeRequest } = require('../core/request');
const { buildQueryString, buildUid } = require('../core/utils');

/**
 * Creates a request in a collection
 * Postman API endpoint and method: POST /collections/{collectionId}/requests
 * @param {string} collectionId - The collection's ID
 * @param {Object} requestData - The request data (name, method, url, etc.)
 * @param {string} [folder] - The folder ID in which to create the request
 * @returns {Promise} Axios response
 */
async function createRequest(collectionId, requestData, folder = null) {
  const endpoint = `/collections/${collectionId}/requests`;
  const queryParams = {
    folder
  };
  const fullEndpoint = `${endpoint}${buildQueryString(queryParams)}`;
  const config = buildAxiosConfig('post', fullEndpoint, requestData);
  return await executeRequest(config);
}

/**
 * Gets information about a request in a collection
 * Postman API endpoint and method: GET /collections/{collectionId}/requests/{requestId}
 * @param {string} collectionId - The collection's ID
 * @param {string} requestId - The request's ID
 * @param {boolean} [ids] - If true, returns only the request properties that contain ID values
 * @param {boolean} [uid] - If true, returns all IDs in UID format
 * @param {boolean} [populate] - If true, returns all of a request's contents
 * @returns {Promise} Axios response
 */
async function getRequest(collectionId, requestId, ids = null, uid = null, populate = null) {
  const endpoint = `/collections/${collectionId}/requests/${requestId}`;
  const queryParams = {
    ids,
    uid,
    populate
  };
  const fullEndpoint = `${endpoint}${buildQueryString(queryParams)}`;
  const config = buildAxiosConfig('get', fullEndpoint);
  return await executeRequest(config);
}

/**
 * Updates a request in a collection
 * Postman API endpoint and method: PUT /collections/{collectionId}/requests/{requestId}
 * @param {string} collectionId - The collection's ID
 * @param {string} requestId - The request's ID
 * @param {Object} requestData - The request data to update (name, method, url, etc.)
 * @returns {Promise} Axios response
 */
async function updateRequest(collectionId, requestId, requestData) {
  const endpoint = `/collections/${collectionId}/requests/${requestId}`;
  const config = buildAxiosConfig('put', endpoint, requestData);
  return await executeRequest(config);
}

/**
 * Deletes a request in a collection
 * Postman API endpoint and method: DELETE /collections/{collectionId}/requests/{requestId}
 * @param {string} collectionId - The collection's ID
 * @param {string} requestId - The request's ID
 * @returns {Promise} Axios response
 */
async function deleteRequest(collectionId, requestId) {
  const endpoint = `/collections/${collectionId}/requests/${requestId}`;
  const config = buildAxiosConfig('delete', endpoint);
  return await executeRequest(config);
}

/**
 * Gets all comments left by users in a request
 * Postman API endpoint and method: GET /collections/{collectionUid}/requests/{requestUid}/comments
 * @param {string|number} userId - The user's ID
 * @param {string} collectionId - The collection's ID
 * @param {string} requestId - The request's ID
 * @returns {Promise} Axios response
 */
async function getRequestComments(userId, collectionId, requestId) {
  const collectionUid = buildUid(userId, collectionId);
  const requestUid = buildUid(userId, requestId);
  const endpoint = `/collections/${collectionUid}/requests/${requestUid}/comments`;
  const config = buildAxiosConfig('get', endpoint);
  return await executeRequest(config);
}

/**
 * Creates a comment on a request
 * Postman API endpoint and method: POST /collections/{collectionUid}/requests/{requestUid}/comments
 * @param {string|number} userId - The user's ID
 * @param {string} collectionId - The collection's ID
 * @param {string} requestId - The request's ID
 * @param {Object} commentData - The comment data (body, threadId, tags)
 * @returns {Promise} Axios response
 */
async function createRequestComment(userId, collectionId, requestId, commentData) {
  const collectionUid = buildUid(userId, collectionId);
  const requestUid = buildUid(userId, requestId);
  const endpoint = `/collections/${collectionUid}/requests/${requestUid}/comments`;
  const config = buildAxiosConfig('post', endpoint, commentData);
  return await executeRequest(config);
}

/**
 * Updates a comment on a request
 * Postman API endpoint and method: PUT /collections/{collectionUid}/requests/{requestUid}/comments/{commentId}
 * @param {string|number} userId - The user's ID
 * @param {string} collectionId - The collection's ID
 * @param {string} requestId - The request's ID
 * @param {string} commentId - The comment's ID
 * @param {Object} commentData - The comment data (body, tags)
 * @returns {Promise} Axios response
 */
async function updateRequestComment(userId, collectionId, requestId, commentId, commentData) {
  const collectionUid = buildUid(userId, collectionId);
  const requestUid = buildUid(userId, requestId);
  const endpoint = `/collections/${collectionUid}/requests/${requestUid}/comments/${commentId}`;
  const config = buildAxiosConfig('put', endpoint, commentData);
  return await executeRequest(config);
}

/**
 * Deletes a comment from a request
 * Postman API endpoint and method: DELETE /collections/{collectionUid}/requests/{requestUid}/comments/{commentId}
 * @param {string|number} userId - The user's ID
 * @param {string} collectionId - The collection's ID
 * @param {string} requestId - The request's ID
 * @param {string} commentId - The comment's ID
 * @returns {Promise} Axios response
 */
async function deleteRequestComment(userId, collectionId, requestId, commentId) {
  const collectionUid = buildUid(userId, collectionId);
  const requestUid = buildUid(userId, requestId);
  const endpoint = `/collections/${collectionUid}/requests/${requestUid}/comments/${commentId}`;
  const config = buildAxiosConfig('delete', endpoint);
  return await executeRequest(config);
}

module.exports = {
  createRequest,
  getRequest,
  updateRequest,
  deleteRequest,
  getRequestComments,
  createRequestComment,
  updateRequestComment,
  deleteRequestComment
};

