const { buildAxiosConfig, executeRequest } = require('../core/request');
const { buildQueryString, validateId } = require('../core/utils');

/**
 * Gets all mock servers
 * Postman API endpoint and method: GET /mocks
 * @param {string} [teamId] - Return only mock servers that belong to the given team ID
 * @param {string} [workspaceId] - Return only mock servers in the given workspace
 * @returns {Promise} Axios response
 */
async function getMocks(teamId = null, workspaceId = null) {
  
  if (workspaceId !== null) {
    validateId(workspaceId, 'workspaceId');
  }

  const endpoint = '/mocks';
  const queryParams = {
    teamId,
    workspace: workspaceId
  };
  const fullEndpoint = `${endpoint}${buildQueryString(queryParams)}`;
  const config = buildAxiosConfig('get', fullEndpoint);
  return await executeRequest(config);
}

/**
 * Creates a mock server in a collection
 * Postman API endpoint and method: POST /mocks
 * @param {Object} mockData - The mock object containing collection and optional configuration
 * @param {string} workspaceId - A workspace ID in which to create the mock server (required)
 * @returns {Promise} Axios response
 */
async function createMock(mockData, workspaceId) {
  validateId(workspaceId, 'workspaceId');

  const endpoint = '/mocks';
  const queryParams = {
    workspace: workspaceId
  };
  const fullEndpoint = `${endpoint}${buildQueryString(queryParams)}`;
  const config = buildAxiosConfig('post', fullEndpoint, { mock: mockData });
  return await executeRequest(config);
}

/**
 * Gets information about a mock server
 * Postman API endpoint and method: GET /mocks/{mockId}
 * @param {string} mockId - The mock's ID
 * @returns {Promise} Axios response
 */
async function getMock(mockId) {
  validateId(mockId, 'mockId');

  const endpoint = `/mocks/${mockId}`;
  const config = buildAxiosConfig('get', endpoint);
  return await executeRequest(config);
}

/**
 * Updates a mock server
 * Postman API endpoint and method: PUT /mocks/{mockId}
 * @param {string} mockId - The mock's ID
 * @param {Object} mockData - The mock object containing collection (required) and optional fields
 * @returns {Promise} Axios response
 */
async function updateMock(mockId, mockData) {
  validateId(mockId, 'mockId');

  const endpoint = `/mocks/${mockId}`;
  const config = buildAxiosConfig('put', endpoint, { mock: mockData });
  return await executeRequest(config);
}

/**
 * Deletes a mock server
 * Postman API endpoint and method: DELETE /mocks/{mockId}
 * @param {string} mockId - The mock's ID
 * @returns {Promise} Axios response
 */
async function deleteMock(mockId) {
  validateId(mockId, 'mockId');

  const endpoint = `/mocks/${mockId}`;
  const config = buildAxiosConfig('delete', endpoint);
  return await executeRequest(config);
}

/**
 * Gets a mock server's call logs
 * Postman API endpoint and method: GET /mocks/{mockId}/call-logs
 * @param {string} mockId - The mock's ID
 * @param {number} [limit] - The maximum number of rows to return (defaults to 100)
 * @param {string} [cursor] - The pointer to the first record of the set of paginated results
 * @param {string} [until] - Return only results created until this given time (ISO 8601 format)
 * @param {string} [since] - Return only results created since the given time (ISO 8601 format)
 * @param {number} [responseStatusCode] - Return only call logs that match the given HTTP response status code
 * @param {string} [responseType] - Return only call logs that match the given response type
 * @param {string} [requestMethod] - Return only call logs that match the given HTTP method
 * @param {string} [requestPath] - Return only call logs that match the given request path
 * @param {string} [sort] - Sort the results by the given value (e.g., 'servedAt')
 * @param {string} [direction] - Sort in ascending ('asc') or descending ('desc') order
 * @param {string} [include] - Include call log records with header and body data (comma-separated values)
 * @returns {Promise} Axios response
 */
async function getMockCallLogs(
  mockId,
  limit = null,
  cursor = null,
  until = null,
  since = null,
  responseStatusCode = null,
  responseType = null,
  requestMethod = null,
  requestPath = null,
  sort = null,
  direction = null,
  include = null
) {
  validateId(mockId, 'mockId');

  const endpoint = `/mocks/${mockId}/call-logs`;
  const queryParams = {
    limit,
    cursor,
    until,
    since,
    responseStatusCode,
    responseType,
    requestMethod,
    requestPath,
    sort,
    direction,
    include
  };
  const fullEndpoint = `${endpoint}${buildQueryString(queryParams)}`;
  const config = buildAxiosConfig('get', fullEndpoint);
  return await executeRequest(config);
}

/**
 * Publishes a mock server (sets Access Control to public)
 * Postman API endpoint and method: POST /mocks/{mockId}/publish
 * @param {string} mockId - The mock's ID
 * @returns {Promise} Axios response
 */
async function createMockPublish(mockId) {
  validateId(mockId, 'mockId');

  const endpoint = `/mocks/${mockId}/publish`;
  const config = buildAxiosConfig('post', endpoint);
  return await executeRequest(config);
}

/**
 * Gets all of a mock server's server responses
 * Postman API endpoint and method: GET /mocks/{mockId}/server-responses
 * @param {string} mockId - The mock's ID
 * @returns {Promise} Axios response
 */
async function getMockServerResponses(mockId) {
  validateId(mockId, 'mockId');

  const endpoint = `/mocks/${mockId}/server-responses`;
  const config = buildAxiosConfig('get', endpoint);
  return await executeRequest(config);
}

/**
 * Creates a server response for a mock server
 * Postman API endpoint and method: POST /mocks/{mockId}/server-responses
 * @param {string} mockId - The mock's ID
 * @param {Object} serverResponseData - The server response object containing name and statusCode (required)
 * @returns {Promise} Axios response
 */
async function createMockServerResponse(mockId, serverResponseData) {
  validateId(mockId, 'mockId');

  const endpoint = `/mocks/${mockId}/server-responses`;
  const config = buildAxiosConfig('post', endpoint, { serverResponse: serverResponseData });
  return await executeRequest(config);
}

/**
 * Gets information about a server response
 * Postman API endpoint and method: GET /mocks/{mockId}/server-responses/{serverResponseId}
 * @param {string} mockId - The mock's ID
 * @param {string} serverResponseId - The server response's ID
 * @returns {Promise} Axios response
 */
async function getMockServerResponse(mockId, serverResponseId) {
  validateId(mockId, 'mockId');
  validateId(serverResponseId, 'serverResponseId');

  const endpoint = `/mocks/${mockId}/server-responses/${serverResponseId}`;
  const config = buildAxiosConfig('get', endpoint);
  return await executeRequest(config);
}

/**
 * Updates a mock server's server response
 * Postman API endpoint and method: PUT /mocks/{mockId}/server-responses/{serverResponseId}
 * @param {string} mockId - The mock's ID
 * @param {string} serverResponseId - The server response's ID
 * @param {Object} serverResponseData - The server response object with fields to update
 * @returns {Promise} Axios response
 */
async function updateMockServerResponse(mockId, serverResponseId, serverResponseData) {
  validateId(mockId, 'mockId');
  validateId(serverResponseId, 'serverResponseId');

  const endpoint = `/mocks/${mockId}/server-responses/${serverResponseId}`;
  const config = buildAxiosConfig('put', endpoint, { serverResponse: serverResponseData });
  return await executeRequest(config);
}

/**
 * Deletes a mock server's server response
 * Postman API endpoint and method: DELETE /mocks/{mockId}/server-responses/{serverResponseId}
 * @param {string} mockId - The mock's ID
 * @param {string} serverResponseId - The server response's ID
 * @returns {Promise} Axios response
 */
async function deleteMockServerResponse(mockId, serverResponseId) {
  validateId(mockId, 'mockId');
  validateId(serverResponseId, 'serverResponseId');

  const endpoint = `/mocks/${mockId}/server-responses/${serverResponseId}`;
  const config = buildAxiosConfig('delete', endpoint);
  return await executeRequest(config);
}

/**
 * Unpublishes a mock server (sets Access Control to private)
 * Postman API endpoint and method: DELETE /mocks/{mockId}/unpublish
 * @param {string} mockId - The mock's ID
 * @returns {Promise} Axios response
 */
async function deleteMockUnpublish(mockId) {
  validateId(mockId, 'mockId');

  const endpoint = `/mocks/${mockId}/unpublish`;
  const config = buildAxiosConfig('delete', endpoint);
  return await executeRequest(config);
}

module.exports = {
  getMocks,
  createMock,
  getMock,
  updateMock,
  deleteMock,
  getMockCallLogs,
  createMockPublish,
  getMockServerResponses,
  createMockServerResponse,
  getMockServerResponse,
  updateMockServerResponse,
  deleteMockServerResponse,
  deleteMockUnpublish
};

