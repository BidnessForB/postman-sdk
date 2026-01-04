
const { buildAxiosConfig, executeRequest, buildQueryString, validateId, validateUid } = require('../core/utils');

/**
 * Creates a request in a collection
 * Postman API endpoint and method: POST /collections/{collectionId}/requests
 * @param {string} collectionId - The collection's ID
 * @param {Object} requestData - The request data
 * @param {string} requestData.name - (Required) The request's name
 * @param {string} [requestData.method] - The HTTP method (GET, POST, PUT, PATCH, DELETE, etc.)
 * @param {Object} [requestData.url] - The request URL object
 * @param {string} [requestData.url.raw] - The complete URL string
 * @param {Array} [requestData.header] - Array of header objects
 * @param {Object} [requestData.body] - The request body object
 * @param {string} [requestData.description] - The request description
 * @param {string} [folderId] - The folder ID in which to create the request. If not provided, creates at collection root.
 * @returns {Promise} Axios response with created request data
 * @example
 * // Create a simple GET request
 * const response = await createRequest('collection-id-123', {
 *   name: 'Get Users',
 *   method: 'GET',
 *   url: {
 *     raw: 'https://api.example.com/users'
 *   }
 * });
 * 
 * @example
 * // Create a POST request with body in a folder
 * const response = await createRequest(
 *   'collection-id-123',
 *   {
 *     name: 'Create User',
 *     method: 'POST',
 *     url: { raw: 'https://api.example.com/users' },
 *     header: [
 *       { key: 'Content-Type', value: 'application/json' }
 *     ],
 *     body: {
 *       mode: 'raw',
 *       raw: JSON.stringify({ name: 'John Doe' })
 *     }
 *   },
 *   'folder-id-456'
 * );
 * 
 * @example
 * // Create a request with description
 * const response = await createRequest('collection-id-123', {
 *   name: 'Update User',
 *   method: 'PUT',
 *   url: { raw: 'https://api.example.com/users/:id' },
 *   description: 'Updates an existing user by ID'
 * });
 */
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
 * @param {boolean} [uid] - If true, returns all IDs in UID format (userId-objectId)
 * @param {boolean} [populate] - If true, returns all of a request's contents including full details
 * @returns {Promise} Axios response with request data
 * @example
 * // Get a request by ID
 * const response = await getRequest('collection-id-123', 'request-id-456');
 * console.log(response.data.data);
 * 
 * @example
 * // Get request with only ID properties
 * const response = await getRequest('collection-id-123', 'request-id-456', true);
 * 
 * @example
 * // Get request with UIDs and full contents
 * const response = await getRequest(
 *   'collection-id-123',
 *   'request-id-456',
 *   null,
 *   true,
 *   true
 * );
 */
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
 * @param {Object} requestData - The request data to update
 * @param {string} [requestData.name] - The request's name
 * @param {string} [requestData.method] - The HTTP method (GET, POST, PUT, PATCH, DELETE, etc.)
 * @param {Object} [requestData.url] - The request URL object
 * @param {string} [requestData.url.raw] - The complete URL string
 * @param {Array} [requestData.header] - Array of header objects
 * @param {Object} [requestData.body] - The request body object
 * @param {string} [requestData.description] - The request description
 * @returns {Promise} Axios response with updated request data
 * @example
 * // Update request name and method
 * const response = await updateRequest(
 *   'collection-id-123',
 *   'request-id-456',
 *   {
 *     name: 'Updated Request Name',
 *     method: 'POST'
 *   }
 * );
 * 
 * @example
 * // Update request URL and headers
 * const response = await updateRequest(
 *   'collection-id-123',
 *   'request-id-456',
 *   {
 *     url: { raw: 'https://api.example.com/v2/users' },
 *     header: [
 *       { key: 'Authorization', value: 'Bearer {{token}}' },
 *       { key: 'Content-Type', value: 'application/json' }
 *     ]
 *   }
 * );
 * 
 * @example
 * // Update request body
 * const response = await updateRequest(
 *   'collection-id-123',
 *   'request-id-456',
 *   {
 *     body: {
 *       mode: 'raw',
 *       raw: JSON.stringify({ email: 'user@example.com' }),
 *       options: {
 *         raw: { language: 'json' }
 *       }
 *     }
 *   }
 * );
 */
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
 * @returns {Promise} Axios response with deletion confirmation
 * @example
 * // Delete a request
 * const response = await deleteRequest('collection-id-123', 'request-id-456');
 * console.log(response.data.request);
 */
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
 * @returns {Promise} Axios response with array of comments
 * @example
 * // Get all comments for a request
 * const response = await getRequestComments(
 *   '12345678-abc-def-123',
 *   '12345678-request-id-456'
 * );
 * console.log(response.data.data);
 */
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
 * const response = await createRequestComment(
 *   '12345678-abc-def-123',
 *   '12345678-request-id-456',
 *   {
 *     body: 'This endpoint needs authentication!'
 *   }
 * );
 * 
 * @example
 * // Create a comment with user tags
 * const response = await createRequestComment(
 *   '12345678-abc-def-123',
 *   '12345678-request-id-456',
 *   {
 *     body: 'Please review this @alex-cruz',
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
 * const response = await createRequestComment(
 *   '12345678-abc-def-123',
 *   '12345678-request-id-456',
 *   {
 *     body: 'I agree, authentication added.',
 *     threadId: 12345
 *   }
 * );
 */
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
 * @param {Object} commentData - The comment data to update
 * @param {string} [commentData.body] - The updated contents of the comment. Max 10,000 characters.
 * @param {Object} [commentData.tags] - Updated information about users tagged in the body comment
 * @param {Object} commentData.tags.userName - Tagged user info. Key is the user's Postman username (e.g., '@user-postman')
 * @param {string} commentData.tags.userName.type - Must be 'user'
 * @param {string} commentData.tags.userName.id - The user's ID
 * @returns {Promise} Axios response with updated comment data
 * @example
 * // Update a comment's body
 * const response = await updateRequestComment(
 *   '12345678-abc-def-123',
 *   '12345678-request-id-456',
 *   '12345',
 *   {
 *     body: 'Updated: This endpoint now requires authentication'
 *   }
 * );
 * 
 * @example
 * // Update with new tags
 * const response = await updateRequestComment(
 *   '12345678-abc-def-123',
 *   '12345678-request-id-456',
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
async function updateRequestComment(collectionUid, requestUid, commentId, commentData) {
  validateUid(collectionUid, 'collectionUid');
  validateUid(requestUid, 'requestUid');
  
  
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
 * @returns {Promise} Axios response with deletion confirmation
 * @example
 * // Delete a request comment
 * const response = await deleteRequestComment(
 *   '12345678-abc-def-123',
 *   '12345678-request-id-456',
 *   '12345'
 * );
 * console.log(response.data.comment);
 */
async function deleteRequestComment(collectionUid, requestUid, commentId) {
  validateUid(collectionUid, 'collectionUid');
  validateUid(requestUid, 'requestUid');
  
  
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

