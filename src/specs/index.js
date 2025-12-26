const { buildAxiosConfig, executeRequest } = require('../core/request');
const { buildQueryString, validateId, validateUid } = require('../core/utils');

/**
 * Gets all API specifications in a workspace
 * Postman API endpoint and method: GET /specs
 * @param {string} workspaceId - The workspace ID
 * @param {string} [cursor] - The pointer to the first record of the set of paginated results
 * @param {number} [limit] - The maximum number of rows to return in the response
 * @returns {Promise} Axios response with specs array and pagination metadata
 * @example
 * // Get all specs in a workspace
 * const response = await getSpecs('workspace-id-123');
 * console.log(response.data.specs);
 * 
 * @example
 * // Get specs with pagination
 * const response = await getSpecs('workspace-id-123', null, 10);
 * const nextCursor = response.data.meta.nextCursor;
 */
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
 * @returns {Promise} Axios response with spec details including name, type, and files
 * @example
 * // Get spec information
 * const response = await getSpec('spec-id-123');
 * console.log(response.data.spec);
 */
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
 * @param {string} type - The specification's type (e.g., 'OPENAPI:3.0', 'OPENAPI:3.1', 'ASYNCAPI:2.0', 'ASYNCAPI:2.6.0')
 * @param {Array} files - A list of the specification's files and their contents
 * @param {string} files[].path - The file path (e.g., 'index.yaml', 'openapi.json')
 * @param {string} files[].content - The stringified file contents
 * @returns {Promise} Axios response with created spec data
 * @example
 * // Create an OpenAPI 3.0 spec
 * const response = await createSpec(
 *   'workspace-id-123',
 *   'My API Spec',
 *   'OPENAPI:3.0',
 *   [{
 *     path: 'index.yaml',
 *     content: 'openapi: 3.0.0\ninfo:\n  title: My API\n  version: 1.0.0'
 *   }]
 * );
 * 
 * @example
 * // Create an AsyncAPI spec
 * const response = await createSpec(
 *   'workspace-id-123',
 *   'Event API',
 *   'ASYNCAPI:2.6.0',
 *   [{
 *     path: 'asyncapi.json',
 *     content: JSON.stringify({ asyncapi: '2.6.0', info: { title: 'Events' } })
 *   }]
 * );
 */
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
 * @param {string} name - The specification's new name
 * @returns {Promise} Axios response with updated spec data
 * @example
 * // Update spec name
 * const response = await modifySpec('spec-id-123', 'Updated API Spec Name');
 */
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
 * @returns {Promise} Axios response with deletion confirmation
 * @example
 * // Delete a spec
 * const response = await deleteSpec('spec-id-123');
 */
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
 * @returns {Promise} Axios response with spec definition as JSON or YAML
 * @example
 * // Get spec definition
 * const response = await getSpecDefinition('spec-id-123');
 * console.log(response.data.definition);
 */
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
 * @returns {Promise} Axios response with array of file objects
 * @example
 * // Get all files in a spec
 * const response = await getSpecFiles('spec-id-123');
 * console.log(response.data.files);
 */
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
 * @param {string} path - The file's path (e.g., 'index.yaml', 'schemas/user.json')
 * @param {string} content - The file's stringified contents (JSON or YAML)
 * @returns {Promise} Axios response with created file data
 * @example
 * // Create a YAML spec file
 * const response = await createSpecFile(
 *   'spec-id-123',
 *   'index.yaml',
 *   'openapi: 3.0.0\ninfo:\n  title: My API\n  version: 1.0.0'
 * );
 * 
 * @example
 * // Create a JSON schema file
 * const response = await createSpecFile(
 *   'spec-id-123',
 *   'schemas/user.json',
 *   JSON.stringify({ type: 'object', properties: { name: { type: 'string' } } })
 * );
 */
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
 * @param {string} filePath - The path to the file (e.g., 'index.yaml', 'schemas/user.json')
 * @returns {Promise} Axios response with file content
 * @example
 * // Get a spec file
 * const response = await getSpecFile('spec-id-123', 'index.yaml');
 * console.log(response.data.content);
 */
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
 * @param {Object} data - Update data (can update name, content, or type - only one property at a time)
 * @param {string} [data.name] - New file name
 * @param {string} [data.content] - New file content
 * @param {string} [data.type] - New file type
 * @returns {Promise} Axios response with updated file data
 * @example
 * // Update file content
 * const response = await modifySpecFile(
 *   'spec-id-123',
 *   'index.yaml',
 *   { content: 'openapi: 3.0.0\ninfo:\n  title: Updated API\n  version: 2.0.0' }
 * );
 * 
 * @example
 * // Rename a file
 * const response = await modifySpecFile(
 *   'spec-id-123',
 *   'old-name.yaml',
 *   { name: 'new-name.yaml' }
 * );
 */
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
 * @param {string} filePath - The path to the file to delete
 * @returns {Promise} Axios response with deletion confirmation
 * @example
 * // Delete a spec file
 * const response = await deleteSpecFile('spec-id-123', 'schemas/user.json');
 */
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
 * @param {Object} [options] - Generation options for customizing collection generation
 * @returns {Promise} Axios response with taskId and url for async task polling
 * @example
 * // Generate a collection from spec
 * const response = await createSpecGeneration('spec-id-123', 'collection', 'My API Collection');
 * const taskId = response.data.taskId;
 * 
 * @example
 * // Generate with options
 * const response = await createSpecGeneration(
 *   'spec-id-123',
 *   'collection',
 *   'API Collection',
 *   { folderStrategy: 'tags' }
 * );
 */
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
 * @returns {Promise} Axios response with task status, progress, and result data
 * @example
 * // Check generation task status
 * const response = await getSpecTaskStatus('spec-id-123', 'task-id-789');
 * console.log(response.data.status); // 'pending', 'completed', or 'failed'
 * 
 * @example
 * // Poll for task completion
 * const checkStatus = async () => {
 *   const response = await getSpecTaskStatus('spec-id-123', taskId);
 *   if (response.data.status === 'completed') {
 *     console.log('Generation complete!', response.data.result);
 *   }
 * };
 */
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
 * @param {string} elementType - The element type (typically 'collection')
 * @param {number} [limit] - The maximum number of rows to return (default 10)
 * @param {string} [cursor] - Pagination cursor for next set of results
 * @returns {Promise} Axios response with generated collections array and pagination metadata
 * @example
 * // Get all collections generated from a spec
 * const response = await getSpecGenerations('spec-id-123', 'collection');
 * console.log(response.data.data);
 * 
 * @example
 * // Get with pagination
 * const response = await getSpecGenerations('spec-id-123', 'collection', 20, nextCursor);
 */
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
 * @param {string} collectionUid - The collection's unique ID (format: userId-collectionId)
 * @returns {Promise} Axios response with taskId and url for async sync task
 * @example
 * // Sync spec with collection
 * const response = await syncSpecWithCollection(
 *   'spec-id-123',
 *   '12345678-abc-def-456'
 * );
 * console.log(response.data.taskId);
 */
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

