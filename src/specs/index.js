const { buildAxiosConfig, executeRequest } = require('../core/request');
const { buildQueryString, validateId, validateUid } = require('../core/utils');

/**
 * Gets all API specifications in a workspace
 * Postman API endpoint and method: GET /specs
 * @param {string} workspaceId - The workspace ID
 * @param {string} [cursor] - The pointer to the first record of the set of paginated results
 * @param {number} [limit] - The maximum number of rows to return in the response
 * @returns {Promise} Axios response
 */
// REQUIRES: ID (workspaceId uses ID)
async function getSpecs(workspaceId, cursor = null, limit = null) {
  validateId(workspaceId, 'workspaceId');

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
// REQUIRES: ID (specId uses ID)
async function getSpec(specId) {
  validateId(specId, 'specId');

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
// REQUIRES: ID (workspaceId uses ID)
async function createSpec(workspaceId, name, type, files) {
  validateId(workspaceId, 'workspaceId');

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

/**
 * Updates an API specification's properties
 * Postman API endpoint and method: PATCH /specs/{specId}
 * @param {string} specId - The spec ID
 * @param {string} name - The specification's name
 * @returns {Promise} Axios response
 */
// REQUIRES: ID (specId uses ID)
async function modifySpec(specId, name) {
  validateId(specId, 'specId');

  const endpoint = `/specs/${specId}`;
  const config = buildAxiosConfig('patch', endpoint, {
    name
  });
  return await executeRequest(config);
}

/**
 * Deletes an API specification
 * Postman API endpoint and method: DELETE /specs/{specId}
 * @param {string} specId - The spec ID
 * @returns {Promise} Axios response
 */
// REQUIRES: ID (specId uses ID)
async function deleteSpec(specId) {
  validateId(specId, 'specId');

  const endpoint = `/specs/${specId}`;
  const config = buildAxiosConfig('delete', endpoint);
  return await executeRequest(config);
}

/**
 * Gets the complete contents of an API specification's definition
 * Postman API endpoint and method: GET /specs/{specId}/definitions
 * @param {string} specId - The spec ID
 * @returns {Promise} Axios response
 */
// REQUIRES: ID (specId uses ID)
async function getSpecDefinition(specId) {
  validateId(specId, 'specId');

  const endpoint = `/specs/${specId}/definitions`;
  const config = buildAxiosConfig('get', endpoint);
  return await executeRequest(config);
}

/**
 * Gets all the files in an API specification
 * Postman API endpoint and method: GET /specs/{specId}/files
 * @param {string} specId - The spec ID
 * @returns {Promise} Axios response
 */
// REQUIRES: ID (specId uses ID)
async function getSpecFiles(specId) {
  validateId(specId, 'specId');

  const endpoint = `/specs/${specId}/files`;
  const config = buildAxiosConfig('get', endpoint);
  return await executeRequest(config);
}

/**
 * Creates an API specification file
 * Postman API endpoint and method: POST /specs/{specId}/files
 * @param {string} specId - The spec ID
 * @param {string} path - The file's path (accepts JSON or YAML files)
 * @param {string} content - The file's stringified contents
 * @returns {Promise} Axios response
 */
// REQUIRES: ID (specId uses ID)
async function createSpecFile(specId, path, content) {
  validateId(specId, 'specId');

  const endpoint = `/specs/${specId}/files`;
  const config = buildAxiosConfig('post', endpoint, {
    path,
    content
  });
  return await executeRequest(config);
}

/**
 * Gets the contents of an API specification's file
 * Postman API endpoint and method: GET /specs/{specId}/files/{filePath}
 * @param {string} specId - The spec ID
 * @param {string} filePath - The path to the file
 * @returns {Promise} Axios response
 */
// REQUIRES: ID (specId uses ID)
async function getSpecFile(specId, filePath) {
  validateId(specId, 'specId');

  const endpoint = `/specs/${specId}/files/${filePath}`;
  const config = buildAxiosConfig('get', endpoint);
  return await executeRequest(config);
}

/**
 * Updates an API specification's file
 * Postman API endpoint and method: PATCH /specs/{specId}/files/{filePath}
 * @param {string} specId - The spec ID
 * @param {string} filePath - The path to the file
 * @param {Object} data - Update data (name, content, or type - only one property at a time)
 * @returns {Promise} Axios response
 */
// REQUIRES: ID (specId uses ID)
async function modifySpecFile(specId, filePath, data) {
  validateId(specId, 'specId');

  const endpoint = `/specs/${specId}/files/${filePath}`;
  const config = buildAxiosConfig('patch', endpoint, data);
  return await executeRequest(config);
}

/**
 * Deletes a file in an API specification
 * Postman API endpoint and method: DELETE /specs/{specId}/files/{filePath}
 * @param {string} specId - The spec ID
 * @param {string} filePath - The path to the file
 * @returns {Promise} Axios response
 */
// REQUIRES: ID (specId uses ID)
async function deleteSpecFile(specId, filePath) {
  validateId(specId, 'specId');

  const endpoint = `/specs/${specId}/files/${filePath}`;
  const config = buildAxiosConfig('delete', endpoint);
  return await executeRequest(config);
}

/**
 * Generates a collection from an API specification
 * Postman API endpoint and method: POST /specs/{specId}/generations/{elementType}
 * @param {string} specId - The spec ID
 * @param {string} elementType - The element type (typically 'collection')
 * @param {string} [name] - The name for the generated collection
 * @param {Object} [options] - Generation options
 * @returns {Promise} Axios response with taskId and url for polling
 */
// REQUIRES: ID (specId uses ID)
async function createSpecGeneration(specId, elementType, name = null, options = null) {
  validateId(specId, 'specId');

  const endpoint = `/specs/${specId}/generations/${elementType}`;
  const data = {};
  
  if (name !== null) {
    data.name = name;
  }
  
  if (options !== null) {
    data.options = options;
  }
  
  const config = buildAxiosConfig('post', endpoint, Object.keys(data).length > 0 ? data : null);
  return await executeRequest(config);
}

/**
 * Gets the status of an asynchronous API specification task
 * Postman API endpoint and method: GET /specs/{specId}/tasks/{taskId}
 * @param {string} specId - The spec ID
 * @param {string} taskId - The task ID (returned from async operations like createSpecGeneration)
 * @returns {Promise} Axios response with status and meta information
 */
// REQUIRES: ID (specId and taskId use ID)
async function getSpecTaskStatus(specId, taskId) {
  validateId(specId, 'specId');
  validateId(taskId, 'taskId');

  const endpoint = `/specs/${specId}/tasks/${taskId}`;
  const config = buildAxiosConfig('get', endpoint);
  return await executeRequest(config);
}

/**
 * Gets a list of collections generated from a spec
 * Postman API endpoint and method: GET /specs/{specId}/generations/{elementType}
 * @param {string} specId - The spec ID
 * @param {string} elementType - The element type (e.g., 'collection')
 * @param {number} limit - The maximum number of rows to return (default 10)
 * @param {string} cursor - Pagination cursor for next set of results
 * @returns {Promise} Axios response with collections array and pagination metadata
 */
// REQUIRES: ID (specId uses ID)
async function getSpecGenerations(specId, elementType, limit = null, cursor = null) {
  validateId(specId, 'specId');

  const endpoint = `/specs/${specId}/generations/${elementType}`;
  const queryParams = {
    limit,
    cursor
  };
  const fullEndpoint = `${endpoint}${buildQueryString(queryParams)}`;
  const config = buildAxiosConfig('get', fullEndpoint);
  return await executeRequest(config);
}

/**
 * Syncs a spec with a collection
 * Postman API endpoint and method: PUT /specs/{specId}/synchronizations
 * @param {string} specId - The spec ID
 * @param {string} collectionUid - The collection's unique ID (userId-collectionId)
 * @returns {Promise} Axios response with taskId and url
 */
// REQUIRES: ID (specId uses ID), UID (collectionUid uses UID)
async function syncSpecWithCollection(specId, collectionUid) {
  validateId(specId, 'specId');
  validateUid(collectionUid, 'collectionUid');

  const endpoint = `/specs/${specId}/synchronizations`;
  const queryParams = {
    collectionUid
  };
  const fullEndpoint = `${endpoint}${buildQueryString(queryParams)}`;
  const config = buildAxiosConfig('put', fullEndpoint);
  const results = await executeRequest(config);
  return results;
}

module.exports = {
  getSpecs,
  getSpec,
  createSpec,
  modifySpec,
  deleteSpec,
  getSpecDefinition,
  getSpecFiles,
  createSpecFile,
  getSpecFile,
  modifySpecFile,
  deleteSpecFile,
  createSpecGeneration,
  getSpecTaskStatus,
  getSpecGenerations,
  syncSpecWithCollection
};

