const { buildAxiosConfig, executeRequest } = require('../core/request');
const { buildQueryString, validateId, validateUid } = require('../core/utils');

/**
 * Creates a request in a collection
 * Postman API endpoint and method: POST /collections/{collectionId}/requests
 * @param {string} collectionId - The collection's ID
 * @param {Object} requestData - The request data (name, method, url, etc.)
 * @param {string} [folderId] - The folder ID in which to create the request
 * @returns {Promise} Axios response
 */
// REQUIRES: ID (collectionId and folderId use ID)
async function createRequest(collectionId, requestData, folderId = null) {
  validateId(collectionId, 'collectionId');
  if (folderId !== null) {
    validateId(folderId, 'folderId');
  }

  const endpoint = `/collections/${collectionId}/requests`;
  const queryParams = {
    folder: folderId
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
// REQUIRES: ID (collectionId and requestId use ID)
async function getRequest(collectionId, requestId, ids = null, uid = null, populate = null) {
  validateId(collectionId, 'collectionId');
  validateId(requestId, 'requestId');

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
// REQUIRES: ID (collectionId and requestId use ID)
async function updateRequest(collectionId, requestId, requestData) {
  validateId(collectionId, 'collectionId');
  validateId(requestId, 'requestId');

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
// REQUIRES: ID (collectionId and requestId use ID)
async function deleteRequest(collectionId, requestId) {
  validateId(collectionId, 'collectionId');
  validateId(requestId, 'requestId');

  const endpoint = `/collections/${collectionId}/requests/${requestId}`;
  const config = buildAxiosConfig('delete', endpoint);
  return await executeRequest(config);
}

/**
 * Gets all comments left by users in a request
 * Postman API endpoint and method: GET /collections/{collectionUid}/requests/{requestUid}/comments
 * @param {string} collectionUid - The collection's UID (format: userId-collectionId)
 * @param {string} requestUid - The request's UID (format: userId-requestId)
 * @returns {Promise} Axios response
 */
// REQUIRES: UID (collectionUid and requestUid parameters)
async function getRequestComments(collectionUid, requestUid) {
  validateUid(collectionUid, 'collectionUid');
  validateUid(requestUid, 'requestUid');
  
  const endpoint = `/collections/${collectionUid}/requests/${requestUid}/comments`;
  const config = buildAxiosConfig('get', endpoint);
  return await executeRequest(config);
}

/**
 * Creates a comment on a request
 * Postman API endpoint and method: POST /collections/{collectionUid}/requests/{requestUid}/comments
 * @param {string} collectionUid - The collection's UID (format: userId-collectionId)
 * @param {string} requestUid - The request's UID (format: userId-requestId)
 * @param {Object} commentData - The comment data (body, threadId, tags)
 * @returns {Promise} Axios response
 */
// REQUIRES: UID (collectionUid and requestUid parameters)
async function createRequestComment(collectionUid, requestUid, commentData) {
  validateUid(collectionUid, 'collectionUid');
  validateUid(requestUid, 'requestUid');
  
  const endpoint = `/collections/${collectionUid}/requests/${requestUid}/comments`;
  const config = buildAxiosConfig('post', endpoint, commentData);
  return await executeRequest(config);
}

/**
 * Updates a comment on a request
 * Postman API endpoint and method: PUT /collections/{collectionUid}/requests/{requestUid}/comments/{commentId}
 * @param {string} collectionUid - The collection's UID (format: userId-collectionId)
 * @param {string} requestUid - The request's UID (format: userId-requestId)
 * @param {string} commentId - The comment's ID
 * @param {Object} commentData - The comment data (body, tags)
 * @returns {Promise} Axios response
 */
// REQUIRES: UID (collectionUid and requestUid parameters), ID (commentId parameter)
async function updateRequestComment(collectionUid, requestUid, commentId, commentData) {
  validateUid(collectionUid, 'collectionUid');
  validateUid(requestUid, 'requestUid');
  validateId(commentId, 'commentId');
  
  const endpoint = `/collections/${collectionUid}/requests/${requestUid}/comments/${commentId}`;
  const config = buildAxiosConfig('put', endpoint, commentData);
  return await executeRequest(config);
}

/**
 * Deletes a comment from a request
 * Postman API endpoint and method: DELETE /collections/{collectionUid}/requests/{requestUid}/comments/{commentId}
 * @param {string} collectionUid - The collection's UID (format: userId-collectionId)
 * @param {string} requestUid - The request's UID (format: userId-requestId)
 * @param {string} commentId - The comment's ID
 * @returns {Promise} Axios response
 */
// REQUIRES: UID (collectionUid and requestUid parameters), ID (commentId parameter)
async function deleteRequestComment(collectionUid, requestUid, commentId) {
  validateUid(collectionUid, 'collectionUid');
  validateUid(requestUid, 'requestUid');
  validateId(commentId, 'commentId');
  
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

