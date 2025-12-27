const { buildAxiosConfig, executeRequest } = require('../core/request');
const { buildQueryString, validateId, validateUid } = require('../core/utils');

/**
 * Creates a response in a collection
 * Postman API endpoint and method: POST /collections/{collectionId}/responses
 * @param {string} collectionId - The collection's ID
 * @param {string} requestId - The parent request's ID that this response belongs to
 * @param {Object} responseData - The response data
 * @param {string} responseData.name - (Required) The response's name
 * @param {number} [responseData.code] - The HTTP response status code (e.g., 200, 404, 500)
 * @param {string} [responseData.status] - The HTTP status text (e.g., 'OK', 'Not Found')
 * @param {Array} [responseData.header] - Array of response header objects
 * @param {string} [responseData.body] - The response body content
 * @param {Object} [responseData.originalRequest] - The original request that generated this response
 * @returns {Promise} Axios response with created response data
 * @example
 * // Create a simple success response
 * const response = await createResponse(
 *   'collection-id-123',
 *   'request-id-456',
 *   {
 *     name: '200 OK',
 *     code: 200,
 *     status: 'OK',
 *     header: [
 *       { key: 'Content-Type', value: 'application/json' }
 *     ],
 *     body: JSON.stringify({ message: 'Success' })
 *   }
 * );
 * 
 * @example
 * // Create an error response
 * const response = await createResponse(
 *   'collection-id-123',
 *   'request-id-456',
 *   {
 *     name: '404 Not Found',
 *     code: 404,
 *     status: 'Not Found',
 *     body: JSON.stringify({ error: 'Resource not found' })
 *   }
 * );
 * 
 * @example
 * // Create response with headers
 * const response = await createResponse(
 *   'collection-id-123',
 *   'request-id-456',
 *   {
 *     name: '201 Created',
 *     code: 201,
 *     status: 'Created',
 *     header: [
 *       { key: 'Content-Type', value: 'application/json' },
 *       { key: 'Location', value: '/users/123' }
 *     ],
 *     body: JSON.stringify({ id: 123, name: 'John Doe' })
 *   }
 * );
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
 * @param {boolean} [uid] - If true, returns all IDs in UID format (userId-objectId)
 * @param {boolean} [populate] - If true, returns all of a response's contents including full details
 * @returns {Promise} Axios response with response data
 * @example
 * // Get a response by ID
 * const response = await getResponse('collection-id-123', 'response-id-789');
 * console.log(response.data.data);
 * 
 * @example
 * // Get response with only ID properties
 * const response = await getResponse('collection-id-123', 'response-id-789', true);
 * 
 * @example
 * // Get response with UIDs and full contents
 * const response = await getResponse(
 *   'collection-id-123',
 *   'response-id-789',
 *   null,
 *   true,
 *   true
 * );
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
 * @param {Object} responseData - The response data to update
 * @param {string} [responseData.name] - The response's name
 * @param {number} [responseData.code] - The HTTP response status code (e.g., 200, 404, 500)
 * @param {string} [responseData.status] - The HTTP status text (e.g., 'OK', 'Not Found')
 * @param {Array} [responseData.header] - Array of response header objects
 * @param {string} [responseData.body] - The response body content
 * @returns {Promise} Axios response with updated response data
 * @example
 * // Update response name and status code
 * const response = await updateResponse(
 *   'collection-id-123',
 *   'response-id-789',
 *   {
 *     name: '200 Success - Updated',
 *     code: 200
 *   }
 * );
 * 
 * @example
 * // Update response body and headers
 * const response = await updateResponse(
 *   'collection-id-123',
 *   'response-id-789',
 *   {
 *     header: [
 *       { key: 'Content-Type', value: 'application/json' },
 *       { key: 'Cache-Control', value: 'no-cache' }
 *     ],
 *     body: JSON.stringify({ data: 'updated response' })
 *   }
 * );
 * 
 * @example
 * // Update error response
 * const response = await updateResponse(
 *   'collection-id-123',
 *   'response-id-789',
 *   {
 *     name: '500 Internal Server Error',
 *     code: 500,
 *     status: 'Internal Server Error',
 *     body: JSON.stringify({ error: 'Server error occurred' })
 *   }
 * );
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
 * @returns {Promise} Axios response with deletion confirmation
 * @example
 * // Delete a response
 * const response = await deleteResponse('collection-id-123', 'response-id-789');
 * console.log(response.data.response);
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
 * @returns {Promise} Axios response with array of comments
 * @example
 * // Get all comments for a response
 * const response = await getResponseComments(
 *   '12345678-abc-def-123',
 *   '12345678-response-id-789'
 * );
 * console.log(response.data.data);
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
 * @param {Object} commentData - The comment data
 * @param {string} commentData.body - (Required) The contents of the comment. Max 10,000 characters.
 * @param {number} [commentData.threadId] - The comment's thread ID. Include this to create a reply on an existing comment.
 * @param {Object} [commentData.tags] - Information about users tagged in the body comment
 * @param {Object} commentData.tags.userName - Tagged user info. Key is the user's Postman username (e.g., '@user-postman')
 * @param {string} commentData.tags.userName.type - Must be 'user'
 * @param {string} commentData.tags.userName.id - The user's ID
 * @returns {Promise} Axios response with created comment data
 * @example
 * // Create a simple comment
 * const response = await createResponseComment(
 *   '12345678-abc-def-123',
 *   '12345678-response-id-789',
 *   {
 *     body: 'This response example is helpful!'
 *   }
 * );
 * 
 * @example
 * // Create a comment with user tags
 * const response = await createResponseComment(
 *   '12345678-abc-def-123',
 *   '12345678-response-id-789',
 *   {
 *     body: 'Great example @alex-cruz!',
 *     tags: {
 *       '@alex-cruz': {
 *         type: 'user',
 *         id: '87654321'
 *       }
 *     }
 *   }
 * );
 * 
 * @example
 * // Reply to an existing comment thread
 * const response = await createResponseComment(
 *   '12345678-abc-def-123',
 *   '12345678-response-id-789',
 *   {
 *     body: 'Thanks, I updated the response.',
 *     threadId: 12345
 *   }
 * );
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
 * @param {Object} commentData - The comment data to update
 * @param {string} [commentData.body] - The updated contents of the comment. Max 10,000 characters.
 * @param {Object} [commentData.tags] - Updated information about users tagged in the body comment
 * @param {Object} commentData.tags.userName - Tagged user info. Key is the user's Postman username (e.g., '@user-postman')
 * @param {string} commentData.tags.userName.type - Must be 'user'
 * @param {string} commentData.tags.userName.id - The user's ID
 * @returns {Promise} Axios response with updated comment data
 * @example
 * // Update a comment's body
 * const response = await updateResponseComment(
 *   '12345678-abc-def-123',
 *   '12345678-response-id-789',
 *   '12345',
 *   {
 *     body: 'Updated: This response format has changed'
 *   }
 * );
 * 
 * @example
 * // Update with new tags
 * const response = await updateResponseComment(
 *   '12345678-abc-def-123',
 *   '12345678-response-id-789',
 *   '12345',
 *   {
 *     body: 'Updated comment with @new-user',
 *     tags: {
 *       '@new-user': {
 *         type: 'user',
 *         id: '11111111'
 *       }
 *     }
 *   }
 * );
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
 * @returns {Promise} Axios response with deletion confirmation
 * @example
 * // Delete a response comment
 * const response = await deleteResponseComment(
 *   '12345678-abc-def-123',
 *   '12345678-response-id-789',
 *   '12345'
 * );
 * console.log(response.data.comment);
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

