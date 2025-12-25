const { buildAxiosConfig, executeRequest } = require('../core/request');
const { buildQueryString, buildUid } = require('../core/utils');

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

/**
 * Creates a folder in a collection
 * Postman API endpoint and method: POST /collections/{collectionId}/folders
 * @param {string} collectionId - The collection's ID
 * @param {Object} folderData - The folder data (name, description, etc.)
 * @returns {Promise} Axios response
 */
async function createFolder(collectionId, folderData) {
  const endpoint = `/collections/${collectionId}/folders`;
  const config = buildAxiosConfig('post', endpoint, folderData);
  return await executeRequest(config);
}

/**
 * Gets information about a folder in a collection
 * Postman API endpoint and method: GET /collections/{collectionId}/folders/{folderId}
 * @param {string} collectionId - The collection's ID
 * @param {string} folderId - The folder's ID
 * @param {string} [ids] - Return folder item IDs only
 * @param {string} [uid] - Return full UIDs for folder items
 * @param {string} [populate] - Return full folder items
 * @returns {Promise} Axios response
 */
async function getFolder(collectionId, folderId, ids = null, uid = null, populate = null) {
  const endpoint = `/collections/${collectionId}/folders/${folderId}`;
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
 * Updates a folder in a collection
 * Postman API endpoint and method: PUT /collections/{collectionId}/folders/{folderId}
 * @param {string} collectionId - The collection's ID
 * @param {string} folderId - The folder's ID
 * @param {Object} folderData - The folder data to update (name, description, etc.)
 * @returns {Promise} Axios response
 */
async function updateFolder(collectionId, folderId, folderData) {
  const endpoint = `/collections/${collectionId}/folders/${folderId}`;
  const config = buildAxiosConfig('put', endpoint, folderData);
  return await executeRequest(config);
}

/**
 * Deletes a folder in a collection
 * Postman API endpoint and method: DELETE /collections/{collectionId}/folders/{folderId}
 * @param {string} collectionId - The collection's ID
 * @param {string} folderId - The folder's ID
 * @returns {Promise} Axios response
 */
async function deleteFolder(collectionId, folderId) {
  const endpoint = `/collections/${collectionId}/folders/${folderId}`;
  const config = buildAxiosConfig('delete', endpoint);
  return await executeRequest(config);
}

/**
 * Gets all comments left by users in a collection
 * Postman API endpoint and method: GET /collections/{collectionUid}/comments
 * @param {string|number} userId - The user's ID
 * @param {string} collectionId - The collection's ID
 * @returns {Promise} Axios response
 */
async function getCollectionComments(userId, collectionId) {
  const collectionUid = buildUid(userId, collectionId);
  const endpoint = `/collections/${collectionUid}/comments`;
  const config = buildAxiosConfig('get', endpoint);
  return await executeRequest(config);
}

/**
 * Creates a comment on a collection
 * Postman API endpoint and method: POST /collections/{collectionUid}/comments
 * @param {string|number} userId - The user's ID
 * @param {string} collectionId - The collection's ID
 * @param {Object} commentData - The comment data (body, threadId, tags)
 * @returns {Promise} Axios response
 */
async function createCollectionComment(userId, collectionId, commentData) {
  const collectionUid = buildUid(userId, collectionId);
  const endpoint = `/collections/${collectionUid}/comments`;
  const config = buildAxiosConfig('post', endpoint, commentData);
  return await executeRequest(config);
}

/**
 * Updates a comment on a collection
 * Postman API endpoint and method: PUT /collections/{collectionUid}/comments/{commentId}
 * @param {string|number} userId - The user's ID
 * @param {string} collectionId - The collection's ID
 * @param {string} commentId - The comment's ID
 * @param {Object} commentData - The comment data (body, tags)
 * @returns {Promise} Axios response
 */
async function updateCollectionComment(userId, collectionId, commentId, commentData) {
  const collectionUid = buildUid(userId, collectionId);
  const endpoint = `/collections/${collectionUid}/comments/${commentId}`;
  const config = buildAxiosConfig('put', endpoint, commentData);
  return await executeRequest(config);
}

/**
 * Deletes a comment from a collection
 * Postman API endpoint and method: DELETE /collections/{collectionUid}/comments/{commentId}
 * @param {string|number} userId - The user's ID
 * @param {string} collectionId - The collection's ID
 * @param {string} commentId - The comment's ID
 * @returns {Promise} Axios response
 */
async function deleteCollectionComment(userId, collectionId, commentId) {
  const collectionUid = buildUid(userId, collectionId);
  const endpoint = `/collections/${collectionUid}/comments/${commentId}`;
  const config = buildAxiosConfig('delete', endpoint);
  return await executeRequest(config);
}

/**
 * Gets all comments left by users in a folder
 * Postman API endpoint and method: GET /collections/{collectionUid}/folders/{folderUid}/comments
 * @param {string|number} userId - The user's ID
 * @param {string} collectionId - The collection's ID
 * @param {string} folderId - The folder's ID
 * @returns {Promise} Axios response
 */
async function getFolderComments(userId, collectionId, folderId) {
  const collectionUid = buildUid(userId, collectionId);
  const folderUid = buildUid(userId, folderId);
  const endpoint = `/collections/${collectionUid}/folders/${folderUid}/comments`;
  const config = buildAxiosConfig('get', endpoint);
  return await executeRequest(config);
}

/**
 * Creates a comment on a folder
 * Postman API endpoint and method: POST /collections/{collectionUid}/folders/{folderUid}/comments
 * @param {string|number} userId - The user's ID
 * @param {string} collectionId - The collection's ID
 * @param {string} folderId - The folder's ID
 * @param {Object} commentData - The comment data (body, threadId, tags)
 * @returns {Promise} Axios response
 */
async function createFolderComment(userId, collectionId, folderId, commentData) {
  const collectionUid = buildUid(userId, collectionId);
  const folderUid = buildUid(userId, folderId);
  const endpoint = `/collections/${collectionUid}/folders/${folderUid}/comments`;
  const config = buildAxiosConfig('post', endpoint, commentData);
  return await executeRequest(config);
}

/**
 * Updates a comment on a folder
 * Postman API endpoint and method: PUT /collections/{collectionUid}/folders/{folderUid}/comments/{commentId}
 * @param {string|number} userId - The user's ID
 * @param {string} collectionId - The collection's ID
 * @param {string} folderId - The folder's ID
 * @param {string} commentId - The comment's ID
 * @param {Object} commentData - The comment data (body, tags)
 * @returns {Promise} Axios response
 */
async function updateFolderComment(userId, collectionId, folderId, commentId, commentData) {
  const collectionUid = buildUid(userId, collectionId);
  const folderUid = buildUid(userId, folderId);
  const endpoint = `/collections/${collectionUid}/folders/${folderUid}/comments/${commentId}`;
  const config = buildAxiosConfig('put', endpoint, commentData);
  return await executeRequest(config);
}

/**
 * Deletes a comment from a folder
 * Postman API endpoint and method: DELETE /collections/{collectionUid}/folders/{folderUid}/comments/{commentId}
 * @param {string|number} userId - The user's ID
 * @param {string} collectionId - The collection's ID
 * @param {string} folderId - The folder's ID
 * @param {string} commentId - The comment's ID
 * @returns {Promise} Axios response
 */
async function deleteFolderComment(userId, collectionId, folderId, commentId) {
  const collectionUid = buildUid(userId, collectionId);
  const folderUid = buildUid(userId, folderId);
  const endpoint = `/collections/${collectionUid}/folders/${folderUid}/comments/${commentId}`;
  const config = buildAxiosConfig('delete', endpoint);
  return await executeRequest(config);
}

/**
 * Sync collection with spec
 * Postman API endpoint and method: PUT /collections/{collectionUid}/synchronizations
 * @param {string} userId - The user's ID
 * @param {string} collectionId - The collection's ID
 * @param {string} specId - The spec's ID
 * @returns {Promise} Axios response
 */
async function syncCollectionWithSpec(userId, collectionId, specId) {
  const collectionUid = buildUid(userId, collectionId);
  const endpoint = `/collections/${collectionUid}/synchronizations`;
  const queryParams = {
    specId
  };
  const fullEndpoint = `${endpoint}${buildQueryString(queryParams)}`;
  const config = buildAxiosConfig('put', fullEndpoint);
  return await executeRequest(config);
}

/**
 * Generates a spec from a collection
 * Postman API endpoint and method: POST /collections/{collectionUid}/generations/{elementType}
 * @param {string} userId - The user ID
 * @param {string} collectionId - The collection ID
 * @param {string} elementType - The element type (e.g., 'spec')
 * @param {string} name - The API specification's name
 * @param {string} type - The specification's type (e.g., 'OPENAPI:3.0')
 * @param {string} format - The format of the API specification (e.g., 'JSON', 'YAML')
 * @returns {Promise} Axios response with taskId and url
 */
async function createCollectionGeneration(userId, collectionId, elementType, name, type, format) {
  const collectionUid = buildUid(userId, collectionId);
  const endpoint = `/collections/${collectionUid}/generations/${elementType}`;
  const config = buildAxiosConfig('post', endpoint, {
    name,
    type,
    format
  });
  return await executeRequest(config);
}

/**
 * Gets the list of specs generated from a collection
 * Postman API endpoint and method: GET /collections/{collectionUid}/generations/{elementType}
 * @param {string} userId - The user ID
 * @param {string} collectionId - The collection ID
 * @param {string} elementType - The element type (e.g., 'spec')
 * @returns {Promise} Axios response with specs array and pagination metadata
 */
async function getCollectionGenerations(userId, collectionId, elementType) {
  const collectionUid = buildUid(userId, collectionId);
  const endpoint = `/collections/${collectionUid}/generations/${elementType}`;
  const config = buildAxiosConfig('get', endpoint);
  return await executeRequest(config);
}

/**
 * Gets the status of a collection generation task
 * Postman API endpoint and method: GET /collections/{collectionUid}/tasks/{taskId}
 * @param {string} userId - The user ID
 * @param {string} collectionId - The collection ID
 * @param {string} taskId - The task ID
 * @returns {Promise} Axios response with task status
 */
async function getCollectionTaskStatus(userId, collectionId, taskId) {
  const collectionUid = buildUid(userId, collectionId);
  const endpoint = `/collections/${collectionUid}/tasks/${taskId}`;
  const config = buildAxiosConfig('get', endpoint);
  return await executeRequest(config);
}

module.exports = {
  getCollections,
  createCollection,
  getCollection,
  updateCollection,
  modifyCollection,
  deleteCollection,
  createFolder,
  getFolder,
  updateFolder,
  deleteFolder,
  getCollectionComments,
  createCollectionComment,
  updateCollectionComment,
  deleteCollectionComment,
  getFolderComments,
  createFolderComment,
  updateFolderComment,
  deleteFolderComment,
  syncCollectionWithSpec,
  createCollectionGeneration,
  getCollectionGenerations,
  getCollectionTaskStatus
};
