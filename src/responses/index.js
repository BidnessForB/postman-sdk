const { buildAxiosConfig, executeRequest } = require('../core/request');
const { buildQueryString, validateId, validateUid } = require('../core/utils');

/**
 * Creates a response in a collection
 * Postman API endpoint and method: POST /collections/{collectionId}/responses
 * @param {string} collectionId - The collection's ID
 * @param {string} requestId - The parent request's ID
 * @param {Object} responseData - The response data (name, code, body, etc.)
 * @returns {Promise} Axios response
 */
async function createResponse(collectionId, requestId, responseData) {
  validateId(collectionId, 'collectionId');
  validateId(requestId, 'requestId');

  const endpoint = `/collections/${collectionId}/responses`;
  const queryParams = {
    request: requestId
  };
  const fullEndpoint = `${endpoint}${buildQueryString(queryParams)}`;
  const config = buildAxiosConfig('post', fullEndpoint, responseData);
  return await executeRequest(config);
}

/**
 * Gets information about a response in a collection
 * Postman API endpoint and method: GET /collections/{collectionId}/responses/{responseId}
 * @param {string} collectionId - The collection's ID
 * @param {string} responseId - The response's ID
 * @param {boolean} [ids] - If true, returns only the response properties that contain ID values
 * @param {boolean} [uid] - If true, returns all IDs in UID format
 * @param {boolean} [populate] - If true, returns all of a response's contents
 * @returns {Promise} Axios response
 */
async function getResponse(collectionId, responseId, ids = null, uid = null, populate = null) {
  validateId(collectionId, 'collectionId');
  validateId(responseId, 'responseId');

  const endpoint = `/collections/${collectionId}/responses/${responseId}`;
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
 * Updates a response in a collection
 * Postman API endpoint and method: PUT /collections/{collectionId}/responses/{responseId}
 * @param {string} collectionId - The collection's ID
 * @param {string} responseId - The response's ID
 * @param {Object} responseData - The response data to update (name, code, body, etc.)
 * @returns {Promise} Axios response
 */
async function updateResponse(collectionId, responseId, responseData) {
  validateId(collectionId, 'collectionId');
  validateId(responseId, 'responseId');

  const endpoint = `/collections/${collectionId}/responses/${responseId}`;
  const config = buildAxiosConfig('put', endpoint, responseData);
  return await executeRequest(config);
}

/**
 * Deletes a response in a collection
 * Postman API endpoint and method: DELETE /collections/{collectionId}/responses/{responseId}
 * @param {string} collectionId - The collection's ID
 * @param {string} responseId - The response's ID
 * @returns {Promise} Axios response
 */
async function deleteResponse(collectionId, responseId) {
  validateId(collectionId, 'collectionId');
  validateId(responseId, 'responseId');

  const endpoint = `/collections/${collectionId}/responses/${responseId}`;
  const config = buildAxiosConfig('delete', endpoint);
  return await executeRequest(config);
}

/**
 * Gets all comments left by users in a response
 * Postman API endpoint and method: GET /collections/{collectionUid}/responses/{responseUid}/comments
 * @param {string} collectionUid - The collection's UID (format: userId-collectionId)
 * @param {string} responseUid - The response's UID (format: userId-responseId)
 * @returns {Promise} Axios response
 */
async function getResponseComments(collectionUid, responseUid) {
  validateUid(collectionUid, 'collectionUid');
  validateUid(responseUid, 'responseUid');
  
  const endpoint = `/collections/${collectionUid}/responses/${responseUid}/comments`;
  const config = buildAxiosConfig('get', endpoint);
  return await executeRequest(config);
}

/**
 * Creates a comment on a response
 * Postman API endpoint and method: POST /collections/{collectionUid}/responses/{responseUid}/comments
 * @param {string} collectionUid - The collection's UID (format: userId-collectionId)
 * @param {string} responseUid - The response's UID (format: userId-responseId)
 * @param {Object} commentData - The comment data (body, threadId, tags)
 * @returns {Promise} Axios response
 */
async function createResponseComment(collectionUid, responseUid, commentData) {
  validateUid(collectionUid, 'collectionUid');
  validateUid(responseUid, 'responseUid');
  
  const endpoint = `/collections/${collectionUid}/responses/${responseUid}/comments`;
  const config = buildAxiosConfig('post', endpoint, commentData);
  return await executeRequest(config);
}

/**
 * Updates a comment on a response
 * Postman API endpoint and method: PUT /collections/{collectionUid}/responses/{responseUid}/comments/{commentId}
 * @param {string} collectionUid - The collection's UID (format: userId-collectionId)
 * @param {string} responseUid - The response's UID (format: userId-responseId)
 * @param {string} commentId - The comment's ID
 * @param {Object} commentData - The comment data (body, tags)
 * @returns {Promise} Axios response
 */
async function updateResponseComment(collectionUid, responseUid, commentId, commentData) {
  validateUid(collectionUid, 'collectionUid');
  validateUid(responseUid, 'responseUid');
  
  
  const endpoint = `/collections/${collectionUid}/responses/${responseUid}/comments/${commentId}`;
  const config = buildAxiosConfig('put', endpoint, commentData);
  return await executeRequest(config);
}

/**
 * Deletes a comment from a response
 * Postman API endpoint and method: DELETE /collections/{collectionUid}/responses/{responseUid}/comments/{commentId}
 * @param {string} collectionUid - The collection's UID (format: userId-collectionId)
 * @param {string} responseUid - The response's UID (format: userId-responseId)
 * @param {string} commentId - The comment's ID
 * @returns {Promise} Axios response
 */
async function deleteResponseComment(collectionUid, responseUid, commentId) {
  validateUid(collectionUid, 'collectionUid');
  validateUid(responseUid, 'responseUid');
  
  
  const endpoint = `/collections/${collectionUid}/responses/${responseUid}/comments/${commentId}`;
  const config = buildAxiosConfig('delete', endpoint);
  return await executeRequest(config);
}

module.exports = {
  createResponse,
  getResponse,
  updateResponse,
  deleteResponse,
  getResponseComments,
  createResponseComment,
  updateResponseComment,
  deleteResponseComment
};

