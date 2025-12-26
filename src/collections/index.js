const { buildAxiosConfig, executeRequest } = require('../core/request');
const { buildQueryString, validateId, validateUid } = require('../core/utils');

/**
 * Gets all collections
 * Postman API endpoint and method: GET /collections
 * @param {string} [workspaceId] - The workspace's ID
 * @param {string} [name] - Filter results by collections that match the given name
 * @param {number} [limit] - Limit the number of results returned
 * @param {number} [offset] - Offset for pagination
 * @returns {Promise} Axios response
 */
 (workspaceId uses ID)
async function getCollections(workspaceId = null, name = null, limit = null, offset = null) {
  if (workspaceId !== null) {
    validateId(workspaceId, 'workspaceId');
  }
  
  const endpoint = '/collections';
  const queryParams = {
    workspace: workspaceId,
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
 * @param {string} [workspaceId] - The workspace's ID
 * @returns {Promise} Axios response
 */
 (workspaceId uses ID)
async function createCollection(collection, workspaceId = null) {
  if (workspaceId !== null) {
    validateId(workspaceId, 'workspaceId');
  }
  
  const endpoint = '/collections';
  const queryParams = {
    workspace: workspaceId
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
 (collectionId uses ID)
async function getCollection(collectionId, access_key = null, model = null) {
  validateId(collectionId, 'collectionId');
  
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
 (collectionId uses ID)
async function updateCollection(collectionId, collection, prefer = null) {
  validateId(collectionId, 'collectionId');
  
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
 (collectionId uses ID)
async function modifyCollection(collectionId, collection) {
  validateId(collectionId, 'collectionId');
  
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
 (collectionId uses ID)
async function deleteCollection(collectionId) {
  validateId(collectionId, 'collectionId');
  
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
 (collectionId uses ID)
async function createFolder(collectionId, folderData) {
  validateId(collectionId, 'collectionId');
  
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
 (collectionId and folderId use ID)
async function getFolder(collectionId, folderId, ids = null, uid = null, populate = null) {
  validateId(collectionId, 'collectionId');
  validateId(folderId, 'folderId');
  
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
 (collectionId and folderId use ID)
async function updateFolder(collectionId, folderId, folderData) {
  validateId(collectionId, 'collectionId');
  validateId(folderId, 'folderId');
  
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
 (collectionId and folderId use ID)
async function deleteFolder(collectionId, folderId) {
  validateId(collectionId, 'collectionId');
  validateId(folderId, 'folderId');
  
  const endpoint = `/collections/${collectionId}/folders/${folderId}`;
  const config = buildAxiosConfig('delete', endpoint);
  return await executeRequest(config);
}

/**
 * Gets all comments left by users in a collection
 * Postman API endpoint and method: GET /collections/{collectionUid}/comments
 * @param {string} collectionUid - The collection's UID (format: userId-collectionId)
 * @returns {Promise} Axios response
 */
 (collectionUid parameter)
async function getCollectionComments(collectionUid) {
  validateUid(collectionUid, 'collectionUid');
  
  const endpoint = `/collections/${collectionUid}/comments`;
  const config = buildAxiosConfig('get', endpoint);
  return await executeRequest(config);
}

/**
 * Creates a comment on a collection
 * Postman API endpoint and method: POST /collections/{collectionUid}/comments
 * @param {string} collectionUid - The collection's UID (format: userId-collectionId)
 * @param {Object} commentData - The comment data (body, threadId, tags)
 * @returns {Promise} Axios response
 */
 (collectionUid parameter)
async function createCollectionComment(collectionUid, commentData) {
  validateUid(collectionUid, 'collectionUid');
  
  const endpoint = `/collections/${collectionUid}/comments`;
  const config = buildAxiosConfig('post', endpoint, commentData);
  return await executeRequest(config);
}

/**
 * Updates a comment on a collection
 * Postman API endpoint and method: PUT /collections/{collectionUid}/comments/{commentId}
 * @param {string} collectionUid - The collection's UID (format: userId-collectionId)
 * @param {string} commentId - The comment's ID
 * @param {Object} commentData - The comment data (body, tags)
 * @returns {Promise} Axios response
 */
 (collectionUid parameter), ID (commentId parameter)
async function updateCollectionComment(collectionUid, commentId, commentData) {
  validateUid(collectionUid, 'collectionUid');
  
  
  const endpoint = `/collections/${collectionUid}/comments/${commentId}`;
  const config = buildAxiosConfig('put', endpoint, commentData);
  return await executeRequest(config);
}

/**
 * Deletes a comment from a collection
 * Postman API endpoint and method: DELETE /collections/{collectionUid}/comments/{commentId}
 * @param {string} collectionUid - The collection's UID (format: userId-collectionId)
 * @param {string} commentId - The comment's ID
 * @returns {Promise} Axios response
 */
 (collectionUid parameter), ID (commentId parameter)
async function deleteCollectionComment(collectionUid, commentId) {
  validateUid(collectionUid, 'collectionUid');
  
  
  const endpoint = `/collections/${collectionUid}/comments/${commentId}`;
  const config = buildAxiosConfig('delete', endpoint);
  return await executeRequest(config);
}

/**
 * Gets all comments left by users in a folder
 * Postman API endpoint and method: GET /collections/{collectionUid}/folders/{folderUid}/comments
 * @param {string} collectionUid - The collection's UID (format: userId-collectionId)
 * @param {string} folderUid - The folder's UID (format: userId-folderId)
 * @returns {Promise} Axios response
 */
 (collectionUid and folderUid parameters)
async function getFolderComments(collectionUid, folderUid) {
  validateUid(collectionUid, 'collectionUid');
  validateUid(folderUid, 'folderUid');
  
  const endpoint = `/collections/${collectionUid}/folders/${folderUid}/comments`;
  const config = buildAxiosConfig('get', endpoint);
  return await executeRequest(config);
}

/**
 * Creates a comment on a folder
 * Postman API endpoint and method: POST /collections/{collectionUid}/folders/{folderUid}/comments
 * @param {string} collectionUid - The collection's UID (format: userId-collectionId)
 * @param {string} folderUid - The folder's UID (format: userId-folderId)
 * @param {Object} commentData - The comment data (body, threadId, tags)
 * @returns {Promise} Axios response
 */
 (collectionUid and folderUid parameters)
async function createFolderComment(collectionUid, folderUid, commentData) {
  validateUid(collectionUid, 'collectionUid');
  validateUid(folderUid, 'folderUid');
  
  const endpoint = `/collections/${collectionUid}/folders/${folderUid}/comments`;
  const config = buildAxiosConfig('post', endpoint, commentData);
  return await executeRequest(config);
}

/**
 * Updates a comment on a folder
 * Postman API endpoint and method: PUT /collections/{collectionUid}/folders/{folderUid}/comments/{commentId}
 * @param {string} collectionUid - The collection's UID (format: userId-collectionId)
 * @param {string} folderUid - The folder's UID (format: userId-folderId)
 * @param {string} commentId - The comment's ID
 * @param {Object} commentData - The comment data (body, tags)
 * @returns {Promise} Axios response
 */
 (collectionUid and folderUid parameters), ID (commentId parameter)
async function updateFolderComment(collectionUid, folderUid, commentId, commentData) {
  validateUid(collectionUid, 'collectionUid');
  validateUid(folderUid, 'folderUid');
  //
  
  const endpoint = `/collections/${collectionUid}/folders/${folderUid}/comments/${commentId}`;
  const config = buildAxiosConfig('put', endpoint, commentData);
  return await executeRequest(config);
}

/**
 * Deletes a comment from a folder
 * Postman API endpoint and method: DELETE /collections/{collectionUid}/folders/{folderUid}/comments/{commentId}
 * @param {string} collectionUid - The collection's UID (format: userId-collectionId)
 * @param {string} folderUid - The folder's UID (format: userId-folderId)
 * @param {string} commentId - The comment's ID
 * @returns {Promise} Axios response
 */
 (collectionUid and folderUid parameters), ID (commentId parameter)
async function deleteFolderComment(collectionUid, folderUid, commentId) {
  validateUid(collectionUid, 'collectionUid');
  validateUid(folderUid, 'folderUid');
  
  
  const endpoint = `/collections/${collectionUid}/folders/${folderUid}/comments/${commentId}`;
  const config = buildAxiosConfig('delete', endpoint);
  return await executeRequest(config);
}

/**
 * Sync collection with spec
 * Postman API endpoint and method: PUT /collections/{collectionUid}/synchronizations
 * @param {string} collectionUid - The collection's UID (format: userId-collectionId)
 * @param {string} specId - The spec's ID
 * @returns {Promise} Axios response
 */
 (collectionUid parameter), ID (specId parameter)
async function syncCollectionWithSpec(collectionUid, specId) {
  validateUid(collectionUid, 'collectionUid');
  validateId(specId, 'specId');
  
  const endpoint = `/collections/${collectionUid}/synchronizations`;
  const queryParams = {
    specId
  };
  const fullEndpoint = `${endpoint}${buildQueryString(queryParams)}`;
  const config = buildAxiosConfig('put', fullEndpoint);
  return await executeRequest(config);
}

/**
 * Gets all tags associated with a collection
 * Postman API endpoint and method: GET /collections/{collectionUid}/tags
 * @param {string} collectionUid - The collection's UID (format: userId-collectionId)
 * @returns {Promise} Axios response
 */
 (collectionUid parameter)
async function getCollectionTags(collectionUid) {
  validateUid(collectionUid, 'collectionUid');
  
  const endpoint = `/collections/${collectionUid}/tags`;
  const config = buildAxiosConfig('get', endpoint);
  return await executeRequest(config);
}

/**
 * Updates all tags associated with a collection (replaces existing tags)
 * Postman API endpoint and method: PUT /collections/{collectionUid}/tags
 * @param {string} collectionUid - The collection's UID (format: userId-collectionId)
 * @param {Array} tags - Array of tag objects with 'slug' property (max 5 tags)
 * @returns {Promise} Axios response
 */
 (collectionUid parameter)
async function updateCollectionTags(collectionUid, tags) {
  validateUid(collectionUid, 'collectionUid');
  
  const endpoint = `/collections/${collectionUid}/tags`;
  const data = { tags };
  const config = buildAxiosConfig('put', endpoint, data);
  return await executeRequest(config);
}

/**
 * Generates a spec from a collection
 * Postman API endpoint and method: POST /collections/{collectionUid}/generations/{elementType}
 * @param {string} collectionUid - The collection's UID (format: userId-collectionId)
 * @param {string} elementType - The element type (e.g., 'spec')
 * @param {string} name - The API specification's name
 * @param {string} type - The specification's type (e.g., 'OPENAPI:3.0')
 * @param {string} format - The format of the API specification (e.g., 'JSON', 'YAML')
 * @returns {Promise} Axios response with taskId and url
 */
 (collectionUid parameter)
async function createCollectionGeneration(collectionUid, elementType, name, type, format) {
  validateUid(collectionUid, 'collectionUid');
  
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
 * @param {string} collectionUid - The collection's UID (format: userId-collectionId)
 * @param {string} elementType - The element type (e.g., 'spec')
 * @returns {Promise} Axios response with specs array and pagination metadata
 */
 (collectionUid parameter)
async function getCollectionGenerations(collectionUid, elementType) {
  validateUid(collectionUid, 'collectionUid');
  
  const endpoint = `/collections/${collectionUid}/generations/${elementType}`;
  const config = buildAxiosConfig('get', endpoint);
  return await executeRequest(config);
}

/**
 * Gets the status of a collection generation task
 * Postman API endpoint and method: GET /collections/{collectionUid}/tasks/{taskId}
 * @param {string} collectionUid - The collection's UID (format: userId-collectionId)
 * @param {string} taskId - The task ID
 * @returns {Promise} Axios response with task status
 */
 (collectionUid parameter), ID (taskId parameter)
async function getCollectionTaskStatus(collectionUid, taskId) {
  validateUid(collectionUid, 'collectionUid');
  validateId(taskId, 'taskId');
  
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
  getCollectionTags,
  updateCollectionTags,
  syncCollectionWithSpec,
  createCollectionGeneration,
  getCollectionGenerations,
  getCollectionTaskStatus
};
