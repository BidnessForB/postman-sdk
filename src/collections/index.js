const { buildAxiosConfig, executeRequest } = require('../core/request');
const { buildQueryString, validateId, validateUid } = require('../core/utils');

/**
 * Gets all collections
 * Postman API endpoint and method: GET /collections
 * @param {string} [workspaceId] - The workspace's ID
 * @param {string} [name] - Filter results by collections that match the given name
 * @param {number} [limit] - The maximum number of rows to return in the response
 * @param {number} [offset] - The zero-based offset of the first item to return
 * @returns {Promise} Axios response with collections array and meta information
 * @example
 * // Get all collections in a workspace
 * const response = await getCollections('abc123def-456-789');
 * console.log(response.data.collections);
 * 
 * @example
 * // Get collections with pagination
 * const response = await getCollections('abc123def-456-789', null, 10, 0);
 * console.log(response.data.meta.total);
 * 
 * @example
 * // Filter collections by name
 * const response = await getCollections('abc123def-456-789', 'My API');
 */
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
 * @param {string} collection.info - Information about the collection
 * @param {string} collection.info.name - The collection's name
 * @param {string} [collection.info.description] - The collection's description
 * @param {string} [collection.info.schema] - Schema version (e.g., 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json')
 * @param {Array} [collection.item] - Array of folders and requests in the collection
 * @param {string} [workspaceId] - The workspace ID in which to create the collection. If not provided, creates in default workspace.
 * @returns {Promise} Axios response with collection id and uid
 * @example
 * // Create a simple collection
 * const response = await createCollection({
 *   info: {
 *     name: 'My API Collection',
 *     description: 'Collection for My API',
 *     schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
 *   },
 *   item: []
 * });
 * 
 * @example
 * // Create a collection in a specific workspace
 * const response = await createCollection(
 *   { info: { name: 'Team API' } },
 *   'workspace-id-123'
 * );
 */
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
 * @param {string} [access_key] - A collection's read-only access key for public collections
 * @param {string} [model] - Return minimal model ('minimal' returns only root-level IDs)
 * @returns {Promise} Axios response with full collection data
 * @example
 * // Get a collection by ID
 * const response = await getCollection('abc123-def456-789');
 * console.log(response.data.collection);
 * 
 * @example
 * // Get a public collection using access key
 * const response = await getCollection('collection-id', 'PMAK-123abc');
 * 
 * @example
 * // Get minimal collection model (only root-level IDs)
 * const response = await getCollection('collection-id', null, 'minimal');
 */
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
 * @param {Object} collection - The complete collection object following Postman Collection v2.1.0 schema
 * @param {Object} collection.info - Information about the collection
 * @param {string} collection.info.name - The collection's name
 * @param {string} [collection.info.description] - The collection's description
 * @param {Array} [collection.item] - Array of folders and requests in the collection
 * @param {string} [prefer] - Set to 'respond-async' for asynchronous update (returns immediately)
 * @returns {Promise} Axios response with updated collection
 * @example
 * // Replace a collection's data
 * const response = await updateCollection('collection-id-123', {
 *   info: {
 *     name: 'Updated Collection Name',
 *     description: 'Updated description',
 *     schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
 *   },
 *   item: []
 * });
 * 
 * @example
 * // Async update (returns immediately without waiting)
 * const response = await updateCollection(
 *   'collection-id-123',
 *   collectionData,
 *   'respond-async'
 * );
 */
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
 * @param {Object} collection - Partial collection object with only the fields to update
 * @param {Object} [collection.info] - Collection info to update
 * @param {string} [collection.info.name] - Update the collection's name
 * @param {string} [collection.info.description] - Update the collection's description
 * @returns {Promise} Axios response with updated collection
 * @example
 * // Update only the collection name
 * const response = await modifyCollection('collection-id-123', {
 *   info: {
 *     name: 'New Collection Name'
 *   }
 * });
 * 
 * @example
 * // Update collection description
 * const response = await modifyCollection('collection-id-123', {
 *   info: {
 *     description: 'Updated description text'
 *   }
 * });
 */
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
 * @returns {Promise} Axios response with deletion confirmation
 * @example
 * // Delete a collection
 * const response = await deleteCollection('collection-id-123');
 * console.log(response.data.collection);
 */
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
 * @param {Object} folderData - The folder data
 * @param {string} folderData.name - (Required) The folder's name
 * @param {string} [folderData.description] - The folder's description
 * @param {string} [folderData.parentFolderId] - The ID of the parent folder to nest this folder in
 * @returns {Promise} Axios response with created folder data
 * @example
 * // Create a simple folder
 * const response = await createFolder('collection-id-123', {
 *   name: 'API Endpoints'
 * });
 * 
 * @example
 * // Create a folder with description
 * const response = await createFolder('collection-id-123', {
 *   name: 'Authentication',
 *   description: 'Endpoints related to user authentication'
 * });
 * 
 * @example
 * // Create a nested folder
 * const response = await createFolder('collection-id-123', {
 *   name: 'Sub-folder',
 *   parentFolderId: 'parent-folder-id'
 * });
 */
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
 * @param {string} [ids] - Set to 'true' to return only folder item IDs
 * @param {string} [uid] - Set to 'true' to return full UIDs for folder items
 * @param {string} [populate] - Set to 'true' to return full folder items with details
 * @returns {Promise} Axios response with folder data
 * @example
 * // Get folder information
 * const response = await getFolder('collection-id-123', 'folder-id-456');
 * console.log(response.data.data);
 * 
 * @example
 * // Get folder with only item IDs
 * const response = await getFolder('collection-id-123', 'folder-id-456', 'true');
 * 
 * @example
 * // Get folder with full item details
 * const response = await getFolder(
 *   'collection-id-123',
 *   'folder-id-456',
 *   null,
 *   null,
 *   'true'
 * );
 */
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
 * @param {Object} folderData - The folder data to update
 * @param {string} [folderData.name] - The folder's new name
 * @param {string} [folderData.description] - The folder's new description
 * @returns {Promise} Axios response with updated folder data
 * @example
 * // Update folder name
 * const response = await updateFolder(
 *   'collection-id-123',
 *   'folder-id-456',
 *   { name: 'Updated Folder Name' }
 * );
 * 
 * @example
 * // Update folder name and description
 * const response = await updateFolder(
 *   'collection-id-123',
 *   'folder-id-456',
 *   {
 *     name: 'User Management',
 *     description: 'All user-related API endpoints'
 *   }
 * );
 */
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
 * @returns {Promise} Axios response with deletion confirmation
 * @example
 * // Delete a folder
 * const response = await deleteFolder('collection-id-123', 'folder-id-456');
 * console.log(response.data.folder);
 */
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
 * @returns {Promise} Axios response with array of comments
 * @example
 * // Get all comments for a collection
 * const response = await getCollectionComments('12345678-abc-def-123');
 * console.log(response.data.data);
 */
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
 * const response = await createCollectionComment(
 *   '12345678-abc-def-123',
 *   {
 *     body: 'This collection is well organized!'
 *   }
 * );
 * 
 * @example
 * // Create a comment with user tags
 * const response = await createCollectionComment(
 *   '12345678-abc-def-123',
 *   {
 *     body: 'Great work @alex-cruz!',
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
 * const response = await createCollectionComment(
 *   '12345678-abc-def-123',
 *   {
 *     body: 'I agree with this suggestion.',
 *     threadId: 12345
 *   }
 * );
 */
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
 * @param {Object} commentData - The comment data to update
 * @param {string} [commentData.body] - The updated contents of the comment. Max 10,000 characters.
 * @param {Object} [commentData.tags] - Updated information about users tagged in the body comment
 * @param {Object} commentData.tags.userName - Tagged user info. Key is the user's Postman username (e.g., '@user-postman')
 * @param {string} commentData.tags.userName.type - Must be 'user'
 * @param {string} commentData.tags.userName.id - The user's ID
 * @returns {Promise} Axios response with updated comment data
 * @example
 * // Update a comment's body
 * const response = await updateCollectionComment(
 *   '12345678-abc-def-123',
 *   '12345',
 *   {
 *     body: 'Updated comment text'
 *   }
 * );
 * 
 * @example
 * // Update a comment with new tags
 * const response = await updateCollectionComment(
 *   '12345678-abc-def-123',
 *   '12345',
 *   {
 *     body: 'Updated text with @new-user',
 *     tags: {
 *       '@new-user': {
 *         type: 'user',
 *         id: '11111111'
 *       }
 *     }
 *   }
 * );
 */
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
 * @returns {Promise} Axios response with deletion confirmation
 * @example
 * // Delete a comment
 * const response = await deleteCollectionComment(
 *   '12345678-abc-def-123',
 *   '12345'
 * );
 * console.log(response.data.comment);
 */
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
 * @returns {Promise} Axios response with array of comments
 * @example
 * // Get all comments for a folder
 * const response = await getFolderComments(
 *   '12345678-abc-def-123',
 *   '12345678-folder-id-456'
 * );
 * console.log(response.data.data);
 */
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
 * @param {Object} commentData - The comment data
 * @param {string} commentData.body - (Required) The contents of the comment. Max 10,000 characters.
 * @param {number} [commentData.threadId] - The comment's thread ID. Include this to create a reply on an existing comment.
 * @param {Object} [commentData.tags] - Information about users tagged in the body comment
 * @param {Object} commentData.tags.userName - Tagged user info. Key is the user's Postman username (e.g., '@user-postman')
 * @param {string} commentData.tags.userName.type - Must be 'user'
 * @param {string} commentData.tags.userName.id - The user's ID
 * @returns {Promise} Axios response
 * @example
 * // Create a simple comment
 * const response = await createFolderComment(
 *   '12345678-abc-def-123',
 *   '12345678-folder-id-456',
 *   {
 *     body: 'This looks great!'
 *   }
 * );
 * 
 * @example
 * // Create a comment with user tags
 * const response = await createFolderComment(
 *   '12345678-abc-def-123',
 *   '12345678-folder-id-456',
 *   {
 *     body: 'Great work @alex-cruz!',
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
 * const response = await createFolderComment(
 *   '12345678-abc-def-123',
 *   '12345678-folder-id-456',
 *   {
 *     body: 'I agree with this suggestion.',
 *     threadId: 12345
 *   }
 * );
 */
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
 * @param {Object} commentData - The comment data to update
 * @param {string} [commentData.body] - The updated contents of the comment. Max 10,000 characters.
 * @param {Object} [commentData.tags] - Updated information about users tagged in the body comment
 * @param {Object} commentData.tags.userName - Tagged user info. Key is the user's Postman username (e.g., '@user-postman')
 * @param {string} commentData.tags.userName.type - Must be 'user'
 * @param {string} commentData.tags.userName.id - The user's ID
 * @returns {Promise} Axios response with updated comment data
 * @example
 * // Update a folder comment
 * const response = await updateFolderComment(
 *   '12345678-abc-def-123',
 *   '12345678-folder-id-456',
 *   '12345',
 *   {
 *     body: 'Updated comment text'
 *   }
 * );
 * 
 * @example
 * // Update with new tags
 * const response = await updateFolderComment(
 *   '12345678-abc-def-123',
 *   '12345678-folder-id-456',
 *   '12345',
 *   {
 *     body: 'Updated text with @new-user',
 *     tags: {
 *       '@new-user': {
 *         type: 'user',
 *         id: '11111111'
 *       }
 *     }
 *   }
 * );
 */
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
 * @returns {Promise} Axios response with deletion confirmation
 * @example
 * // Delete a folder comment
 * const response = await deleteFolderComment(
 *   '12345678-abc-def-123',
 *   '12345678-folder-id-456',
 *   '12345'
 * );
 * console.log(response.data.comment);
 */
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
 * @param {string} specId - The spec's ID to sync with
 * @returns {Promise} Axios response with sync status
 * @example
 * // Sync a collection with an API specification
 * const response = await syncCollectionWithSpec(
 *   '12345678-abc-def-123',
 *   'spec-id-456'
 * );
 * console.log(response.data);
 */
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
 * @returns {Promise} Axios response with array of tags
 * @example
 * // Get all tags for a collection
 * const response = await getCollectionTags('12345678-abc-def-123');
 * console.log(response.data.tags);
 */
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
 * @param {Array} tags - Array of tag objects with 'slug' property (maximum 5 tags)
 * @param {string} tags[].slug - The tag's slug/name
 * @returns {Promise} Axios response with updated tags
 * @example
 * // Replace collection tags
 * const response = await updateCollectionTags(
 *   '12345678-abc-def-123',
 *   [
 *     { slug: 'api' },
 *     { slug: 'production' },
 *     { slug: 'v1' }
 *   ]
 * );
 * 
 * @example
 * // Remove all tags (pass empty array)
 * const response = await updateCollectionTags(
 *   '12345678-abc-def-123',
 *   []
 * );
 */
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
 * @param {string} elementType - The element type (typically 'spec')
 * @param {string} name - The API specification's name
 * @param {string} type - The specification's type (e.g., 'OPENAPI:3.0', 'OPENAPI:3.1', 'ASYNCAPI:2.6.0')
 * @param {string} format - The format of the API specification ('JSON' or 'YAML')
 * @returns {Promise} Axios response with taskId and url for the async generation task
 * @example
 * // Generate an OpenAPI 3.0 spec in JSON format
 * const response = await createCollectionGeneration(
 *   '12345678-abc-def-123',
 *   'spec',
 *   'My API Spec',
 *   'OPENAPI:3.0',
 *   'JSON'
 * );
 * console.log(response.data.taskId);
 * 
 * @example
 * // Generate an OpenAPI 3.1 spec in YAML format
 * const response = await createCollectionGeneration(
 *   '12345678-abc-def-123',
 *   'spec',
 *   'My API v2',
 *   'OPENAPI:3.1',
 *   'YAML'
 * );
 */
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
 * @param {string} elementType - The element type (typically 'spec')
 * @returns {Promise} Axios response with array of generated specs and pagination metadata
 * @example
 * // Get all specs generated from a collection
 * const response = await getCollectionGenerations(
 *   '12345678-abc-def-123',
 *   'spec'
 * );
 * console.log(response.data.data);
 * console.log(response.data.meta);
 */
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
 * @param {string} taskId - The task ID returned from createCollectionGeneration
 * @returns {Promise} Axios response with task status and progress information
 * @example
 * // Check the status of a generation task
 * const response = await getCollectionTaskStatus(
 *   '12345678-abc-def-123',
 *   'task-id-789'
 * );
 * console.log(response.data.status);
 * 
 * @example
 * // Poll for task completion
 * const taskId = 'task-id-789';
 * const checkStatus = async () => {
 *   const response = await getCollectionTaskStatus(
 *     '12345678-abc-def-123',
 *     taskId
 *   );
 *   if (response.data.status === 'completed') {
 *     console.log('Generation complete!');
 *   } else if (response.data.status === 'failed') {
 *     console.error('Generation failed');
 *   }
 * };
 */
async function getCollectionTaskStatus(collectionUid, taskId) {
  validateUid(collectionUid, 'collectionUid');
  validateId(taskId, 'taskId');
  
  const endpoint = `/collections/${collectionUid}/tasks/${taskId}`;
  const config = buildAxiosConfig('get', endpoint);
  return await executeRequest(config);
}

/**
 * Gets all forked collections
 * Postman API endpoint and method: GET /collections/collection-forks
 * @param {string} [cursor] - The pointer to the first record of the set of paginated results
 * @param {string} [direction] - Sort order: 'asc' or 'desc' based on creation date
 * @param {number} [limit] - The maximum number of rows to return (defaults to 10)
 * @returns {Promise} Axios response with array of forked collections
 * @example
 * // Get all forked collections
 * const response = await getCollectionForks();
 * console.log(response.data.forks);
 * 
 * @example
 * // Get forked collections with pagination
 * const response = await getCollectionForks(null, 'desc', 20);
 * 
 * @example
 * // Get forked collections with cursor-based pagination
 * const response = await getCollectionForks('cursor-abc-123', 'asc', 10);
 */
async function getCollectionForks(cursor = null, direction = null, limit = null) {
  const endpoint = '/collections/collection-forks';
  const queryParams = {
    cursor,
    direction,
    limit
  };
  const fullEndpoint = `${endpoint}${buildQueryString(queryParams)}`;
  const config = buildAxiosConfig('get', fullEndpoint);
  return await executeRequest(config);
}

/**
 * Creates a fork from an existing collection
 * Postman API endpoint and method: POST /collections/fork/{collectionId}
 * @param {string} collectionId - The collection's ID to fork
 * @param {string} workspaceId - The workspace ID in which to fork the collection (required)
 * @param {string} label - The fork's label (required)
 * @returns {Promise} Axios response with forked collection data including fork metadata
 * @example
 * // Create a fork of a collection
 * const response = await createCollectionFork(
 *   'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
 *   'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
 *   'My Fork Label'
 * );
 * console.log(response.data.collection.fork);
 * 
 * @example
 * // Create a fork with a descriptive label
 * const response = await createCollectionFork(
 *   'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
 *   'bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
 *   'Feature Branch - Authentication Updates'
 * );
 */
async function createCollectionFork(collectionId, workspaceId, label) {
  validateId(collectionId, 'collectionId');
  validateId(workspaceId, 'workspaceId');
  
  const endpoint = `/collections/fork/${collectionId}`;
  const queryParams = {
    workspace: workspaceId
  };
  const fullEndpoint = `${endpoint}${buildQueryString(queryParams)}`;
  const config = buildAxiosConfig('post', fullEndpoint, { label });
  return await executeRequest(config);
}

/**
 * Merges a forked collection back into its parent collection
 * Postman API endpoint and method: POST /collections/merge
 * Note: This endpoint is deprecated. Requires Editor role for the parent collection.
 * @param {string} source - The source (forked) collection's unique ID
 * @param {string} destination - The destination (parent) collection's unique ID
 * @param {string} [strategy] - Merge strategy: 'deleteSource' or 'updateSourceWithDestination' (default)
 * @returns {Promise} Axios response with merged collection ID and UID
 * @example
 * // Merge fork back to parent (default strategy)
 * const response = await mergeCollectionFork(
 *   '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
 *   '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830'
 * );
 * console.log(response.data.collection);
 * 
 * @example
 * // Merge and delete source fork
 * const response = await mergeCollectionFork(
 *   '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
 *   '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
 *   'deleteSource'
 * );
 * 
 * @example
 * // Merge with updateSourceWithDestination strategy
 * const response = await mergeCollectionFork(
 *   '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
 *   '2464332-bf5cb6e7-0a1e-4b82-a577-b2068a70f830',
 *   'updateSourceWithDestination'
 * );
 */
async function mergeCollectionFork(source, destination, strategy = null) {
  validateUid(source, 'source');
  validateUid(destination, 'destination');
  
  const endpoint = '/collections/merge';
  const data = {
    source,
    destination
  };
  
  if (strategy !== null) {
    data.strategy = strategy;
  }
  
  const config = buildAxiosConfig('post', endpoint, data);
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
  getCollectionTaskStatus,
  getCollectionForks,
  createCollectionFork,
  mergeCollectionFork
};
