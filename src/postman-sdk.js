#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const args = process.argv.slice(2);
const fileIndex = args.findIndex(a => a === '--file' || a === '-f');
const specIdIndex = args.findIndex(a => a === '--spec-id' || a === '--specId');
const specFilePathIndex = args.findIndex(a => a === '--spec-file-path' || a === '--specFilePath');

const specFilePath = fileIndex >= 0 ? args[fileIndex + 1] : args[0];
const specId = specIdIndex >= 0 ? args[specIdIndex + 1] : args[1];
const urlFilePath = specFilePathIndex >= 0 ? args[specFilePathIndex + 1] : args[2];
const apiKey = process.env.POSTMAN_API_KEY_POSTMAN;
const baseUrl = "https://api.getpostman.com";
const config = require('./config.json');

// Only validate and exit if this file is run directly, not when imported
if (require.main === module) {
  if (!specFilePath || !specId || !apiKey || !urlFilePath) {
    console.error('Usage: node postmanApiClient.js --file <path> --spec-id <id> --spec-file-path <url-path>');
    process.exit(1);
  }
}

/**
 * Builds an Axios config for Postman API requests
 * @param {string} method - HTTP method (e.g., 'get', 'post', 'patch')
 * @param {string} endpoint - The API endpoint path (e.g., '/specs/{specId}')
 * @param {Object} [data] - The request body data
 * @param {Object} [extra] - Extra Axios config (e.g. maxBodyLength, etc)
 * @returns {Object} Axios request config
 */
function buildAxiosConfig(method, endpoint, data = undefined, extra = {}) {
  return {
    method,
    url: `${baseUrl}${endpoint}`,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey
    },
    ...(data !== undefined && { data }),
    ...extra
  };
}

/**
   * Executes an axios request and throws an error for non-2xx responses.
   * @param {Object} config - Axios request configuration
   * @returns {Promise} Axios response
   */
async function executeRequest(config) {
  const response = await axios.request(config);
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`API call failed with status ${response.status}: ${JSON.stringify(response.data)}`);
  }
  return response;
}

/**
 * Reads file content from the filesystem and returns it in the format expected by Postman API
 * @param {string} specFilePath - The path to the spec file
 * @returns {Object} Object with content property containing the file content
 */
function getContentFS(specFilePath) {
  const yamlContent = fs.readFileSync(path.resolve(specFilePath), 'utf8');
  return { content: yamlContent };
}

/**
 * Gets information about a Postman spec
 * @param {string} specId - The spec ID
 * @returns {Promise} Axios response
 */
async function getSpec(specId) {
  const endpoint = `/specs/${specId}`;
  const config = buildAxiosConfig('get', endpoint);
  return await executeRequest(config);
}

/**
 * Creates an API specification in Postman's Spec Hub
 * @param {string} workspaceId - The workspace ID
 * @param {string} name - The specification's name
 * @param {string} type - The specification's type (e.g., 'OPENAPI:3.0', 'ASYNCAPI:2.0')
 * @param {Array} files - A list of the specification's files and their contents
 * @returns {Promise} Axios response
 */
async function createSpec(workspaceId, name, type, files) {
  const endpoint = '/specs';
  const queryParams = new URLSearchParams();
  queryParams.append('workspaceId', workspaceId);
  const queryString = queryParams.toString();
  const fullEndpoint = `${endpoint}?${queryString}`;
  const config = buildAxiosConfig('post', fullEndpoint, {
    name,
    type,
    files
  });
  return await executeRequest(config);
}

/**
 * Creates a spec file in a Postman spec
 * @param {string} specId - The spec ID
 * @param {string} filePath - The file path (e.g., 'schemas.json' or 'components/schemas.json')
 * @param {string} fileContent - The file content as a string
 * @returns {Promise} Axios response
 */
async function createSpecFile(specId, filePath, fileContent) {
  const endpoint = `/specs/${specId}/files`;
  const config = buildAxiosConfig('post', endpoint, {
    path: filePath,
    content: fileContent
  });
  return await executeRequest(config);
}

/**
 * Updates a spec file in Postman by reading from sourceFilePath
 * @param {string} specId - The spec ID
 * @param {string} filePath - The file path in the spec (e.g., 'openapi.yaml')
 * @param {string} sourceFilePath - The local file path to read from
 * @returns {Promise} Axios response
 */
async function updateSpecFile(specId, filePath, sourceFilePath) {
  const fileContentObj = getContentFS(path.resolve(sourceFilePath));
  const endpoint = `/specs/${specId}/files/${encodeURIComponent(filePath)}`;
  
  const axiosConfig = buildAxiosConfig(
    'patch',
    endpoint,
    fileContentObj,
    { maxBodyLength: Infinity }
  );
  
  return await executeRequest(axiosConfig);
}

/**
 * Syncs a collection with a spec
 * @param {string} collectionUid - The collection unique ID
 * @param {string} specId - The spec ID
 * @returns {Promise} Axios response
 */
async function syncCollectionWithSpec(collectionUid, specId) {
  const endpoint = `/collections/${collectionUid}/synchronizations?specId=${specId}`;
  const config = buildAxiosConfig('put', endpoint);
  return await executeRequest(config);
}

/**
 * Gets all generated collections for a spec
 * @param {string} specId - The spec ID
 * @param {string} elementType - The element type (e.g., 'collection')
 * @param {number} [limit] - The maximum number of rows to return in the response
 * @param {string} [cursor] - The pointer to the first record of the set of paginated results
 * @returns {Promise} Axios response
 */
async function getSpecCollections(specId, elementType, limit, cursor) {
  const endpoint = `/specs/${specId}/generations/${elementType}`;
  const queryParams = new URLSearchParams();
  if (limit !== undefined) {
    queryParams.append('limit', limit.toString());
  }
  if (cursor !== undefined) {
    queryParams.append('cursor', cursor);
  }
  const queryString = queryParams.toString();
  const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;
  const config = buildAxiosConfig('get', fullEndpoint);
  return await executeRequest(config);
}

/**
 * Generates a collection from a spec
 * @param {string} specId - The spec ID
 * @param {string} elementType - The element type (e.g., 'collection')
 * @param {string} [collectionName] - The generated collection's name. If null/undefined, uses the spec's name
 * @param {Object} [options] - Optional generation options (merged with defaults)
 * @returns {Promise} Axios response
 */
async function generateCollectionFromSpec(specId, elementType = 'collection', collectionName = null, options = null) {
  let finalCollectionName = collectionName;
  
  
  // If collectionName is null or undefined, retrieve the spec and use its name
  if (!finalCollectionName) {
    const specResponse = await getSpec(specId);
    finalCollectionName = specResponse.data?.name ;
    if (!finalCollectionName) {
      throw new Error(`Unable to retrieve spec name for specId: ${specId}`);
    }
  }
  
  const endpoint = `/specs/${specId}/generations/${elementType}`;
  
  const defaultOptions = {
    requestNameSource: 'Fallback',
    indentCharacter: 'Space',
    parametersResolution: 'Example',
    folderStrategy: 'Paths',
    includeAuthInfoInExample: true,
    enableOptionalParameters: true,
    keepImplicitHeaders: false,
    includeDeprecated: true,
    alwaysInheritAuthentication: false,
    nestedFolderHierarchy: false
  };
  
  const mergedOptions = options ? { ...defaultOptions, ...options } : defaultOptions;
  
  const data = {
    name: finalCollectionName,
    options: mergedOptions
  };
  
  const config = buildAxiosConfig('post', endpoint, data);
  return await executeRequest(config);
}

function getUIDfromUUID(id) {
  
}

/**
 * Gets information about a Postman workspace
 * @param {string} workspaceId - The workspace ID
 * @param {string} [include] - Optional include parameter (e.g., 'mocks:deactivated', 'scim')
 * @returns {Promise} Axios response
 */
async function getWorkspace(workspaceId, include) {
  const endpoint = `/workspaces/${workspaceId}`;
  const queryParams = new URLSearchParams();
  if (include !== undefined) {
    queryParams.append('include', include);
  }
  const queryString = queryParams.toString();
  const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;
  const config = buildAxiosConfig('get', fullEndpoint);
  return await executeRequest(config);
}

/**
 * Gets information about a Postman collection
 * @param {string} collectionId - The collection ID
 * @param {string} [accessKey] - Optional collection access key (read-only access without API key)
 * @param {string} [model] - Optional model parameter (e.g., 'minimal' for root-level IDs only)
 * @returns {Promise} Axios response
 */
async function getCollection(collectionId, accessKey, model) {
  const endpoint = `/collections/${collectionId}`;
  const queryParams = new URLSearchParams();
  if (accessKey !== undefined) {
    queryParams.append('access_key', accessKey);
  }
  if (model !== undefined) {
    queryParams.append('model', model);
  }
  const queryString = queryParams.toString();
  const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;
  const config = buildAxiosConfig('get', fullEndpoint);
  return await executeRequest(config); 
}

/**
 * Updates part of a collection (name, events, variables, etc.)
 * @param {string} collectionId - The collection ID
 * @param {Object} collectionData - The collection update data (e.g., { collection: { info: { name: '...' } } })
 * @returns {Promise} Axios response
 */
async function patchCollection(collectionId, collectionData) {
  const endpoint = `/collections/${collectionId}`;
  const config = buildAxiosConfig('patch', endpoint, collectionData);
  return await executeRequest(config);
}

/**
 * Replaces the contents of a collection using the Postman Collection v2.1.0 schema format
 * @param {string} collectionId - The collection ID
 * @param {Object} collectionData - The complete collection data in Postman Collection v2.1.0 format
 * @param {boolean} [async] - If true, performs update asynchronously (returns 202 Accepted)
 * @returns {Promise} Axios response
 */
async function putCollection(collectionId, collectionData, async = false) {
  const endpoint = `/collections/${collectionId}`;
  const extra = {};
  if (async) {
    extra.headers = { 'Prefer': 'respond-async' };
  }
  const config = buildAxiosConfig('put', endpoint, collectionData, extra);
  // Merge headers if extra.headers is provided
  if (extra.headers) {
    config.headers = { ...config.headers, ...extra.headers };
  }
  return await executeRequest(config);
}

/**
 * Creates a collection using the Postman Collection v2.1.0 schema format
 * @param {Object} collectionData - The collection data in Postman Collection v2.1.0 format
 * @param {string} [workspace] - Optional workspace ID. If not provided, creates in oldest personal Internal workspace
 * @returns {Promise} Axios response
 */
async function createCollection(collectionData, workspace) {
  const endpoint = '/collections';
  const queryParams = new URLSearchParams();
  if (workspace !== undefined) {
    queryParams.append('workspace', workspace);
  }
  const queryString = queryParams.toString();
  const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;
  const config = buildAxiosConfig('post', fullEndpoint, collectionData);
  return await executeRequest(config);
}

// Export functions for use in other modules
module.exports = {
  buildAxiosConfig,
  executeRequest,
  getSpec,
  createSpec,
  getContentFS,
  updateSpecFile,
  createSpecFile,
  getWorkspace,
  getCollection,
  patchCollection,
  putCollection,
  createCollection,
  generateCollectionFromSpec
};

/**
 * Retrieves spec configuration from config.json by matching filename to rootFilePath
 * @param {string} filename - The filename to match against rootFilePath property
 * @returns {Object|null} The spec configuration object, or null if not found
 */
function getSpecConfigByFilename(filename) {
  if (!config || !config.specs || !Array.isArray(config.specs)) {
    return null;
  }
  
  return config.specs.find(spec => spec.rootFilePath === filename) || null;
}

/**
 * Syncs a spec file to Postman by updating an existing file in the spec
 * @returns {Promise<void>}
 */
async function syncSpec() {
  try {
     
    const fileContent = getContentFS(specFilePath);
    const endpoint = `/specs/${specId}/files/${encodeURIComponent(urlFilePath)}`;
    

    const spec = await getSpec(specId);
    

    let config = buildAxiosConfig(
      'patch',
      endpoint,
      fileContent,
      { maxBodyLength: Infinity }
    );

    let response = await executeRequest(config);
    console.log(JSON.stringify(response.data));
    
    console.log('✅ Synced');
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Only execute syncSpec if this file is run directly, not when imported
if (require.main === module) {
  syncSpec();
}
