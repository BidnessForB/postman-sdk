const { buildAxiosConfig, executeRequest } = require('../core/request');
const { buildQueryString, validateId } = require('../core/utils');

/**
 * Gets all mock servers
 * Postman API endpoint and method: GET /mocks
 * @param {string} [teamId] - Return only mock servers that belong to the given team ID
 * @param {string} [workspaceId] - Return only mock servers in the given workspace
 * @returns {Promise} Axios response with mocks array
 * @example
 * // Get all mocks
 * const response = await getMocks();
 * console.log(response.data.mocks);
 * 
 * @example
 * // Get mocks in a workspace
 * const response = await getMocks(null, 'workspace-id-123');
 * 
 * @example
 * // Get mocks for a team
 * const response = await getMocks('team-id-456');
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
 * @param {string} mockData.collection - (Required) The collection ID or UID
 * @param {string} [mockData.name] - The mock server's name
 * @param {string} [mockData.environment] - The environment ID to use with the mock server
 * @param {boolean} [mockData.private] - Whether the mock server is private (default: false)
 * @param {string} workspaceId - A workspace ID in which to create the mock server (required)
 * @returns {Promise} Axios response with created mock server data including mockUrl
 * @example
 * // Create a simple mock server
 * const response = await createMock(
 *   {
 *     collection: 'collection-id-123',
 *     name: 'My Mock Server'
 *   },
 *   'workspace-id-456'
 * );
 * console.log(response.data.mock.mockUrl);
 * 
 * @example
 * // Create a private mock with environment
 * const response = await createMock(
 *   {
 *     collection: 'collection-id-123',
 *     name: 'Private Mock',
 *     environment: 'env-id-789',
 *     private: true
 *   },
 *   'workspace-id-456'
 * );
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
 * @returns {Promise} Axios response with mock server details including mockUrl
 * @example
 * // Get mock server information
 * const response = await getMock('mock-id-123');
 * console.log(response.data.mock);
 * console.log(response.data.mock.mockUrl);
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
 * @param {Object} mockData - The mock object with fields to update
 * @param {string} [mockData.name] - The mock server's new name
 * @param {string} [mockData.environment] - The environment ID to use
 * @param {boolean} [mockData.private] - Whether the mock server is private
 * @param {string} [mockData.collection] - The collection ID (required by API)
 * @returns {Promise} Axios response with updated mock server data
 * @example
 * // Update mock server name
 * const response = await updateMock('mock-id-123', {
 *   collection: 'collection-id-456',
 *   name: 'Updated Mock Name'
 * });
 * 
 * @example
 * // Make mock server private
 * const response = await updateMock('mock-id-123', {
 *   collection: 'collection-id-456',
 *   private: true
 * });
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
 * @returns {Promise} Axios response with deletion confirmation
 * @example
 * // Delete a mock server
 * const response = await deleteMock('mock-id-123');
 * console.log(response.data.mock);
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
 * @param {number} [responseStatusCode] - Return only call logs that match the given HTTP response status code (e.g., 200, 404)
 * @param {string} [responseType] - Return only call logs that match the given response type
 * @param {string} [requestMethod] - Return only call logs that match the given HTTP method (e.g., 'GET', 'POST')
 * @param {string} [requestPath] - Return only call logs that match the given request path
 * @param {string} [sort] - Sort the results by the given value (e.g., 'servedAt')
 * @param {string} [direction] - Sort in ascending ('asc') or descending ('desc') order
 * @param {string} [include] - Include call log records with header and body data (comma-separated: 'request.headers,request.body,response.headers,response.body')
 * @returns {Promise} Axios response with call logs array and pagination metadata
 * @example
 * // Get call logs for a mock
 * const response = await getMockCallLogs('mock-id-123');
 * console.log(response.data.logs);
 * 
 * @example
 * // Get filtered call logs
 * const response = await getMockCallLogs(
 *   'mock-id-123',
 *   50,
 *   null,
 *   null,
 *   null,
 *   404,
 *   null,
 *   'GET'
 * );
 * 
 * @example
 * // Get call logs with headers and body
 * const response = await getMockCallLogs(
 *   'mock-id-123',
 *   10,
 *   null,
 *   null,
 *   null,
 *   null,
 *   null,
 *   null,
 *   null,
 *   'servedAt',
 *   'desc',
 *   'request.headers,response.body'
 * );
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
 * @returns {Promise} Axios response with published mock data
 * @example
 * // Publish a mock server (make it public)
 * const response = await publishMock('mock-id-123');
 * console.log(response.data.mock);
 */
async function publishMock(mockId) {
  validateId(mockId, 'mockId');

  const endpoint = `/mocks/${mockId}/publish`;
  const config = buildAxiosConfig('post', endpoint);
  return await executeRequest(config);
}

/**
 * Gets all of a mock server's server responses
 * Postman API endpoint and method: GET /mocks/{mockId}/server-responses
 * @param {string} mockId - The mock's ID
 * @returns {Promise} Axios response with server responses array
 * @example
 * // Get all server responses for a mock
 * const response = await getMockServerResponses('mock-id-123');
 * console.log(response.data.serverResponses);
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
 * @param {Object} serverResponseData - The server response object
 * @param {string} serverResponseData.name - (Required) The server response's name
 * @param {number} serverResponseData.statusCode - (Required) The HTTP status code (e.g., 200, 404, 500)
 * @param {string} [serverResponseData.body] - The response body content
 * @param {Array} [serverResponseData.headers] - Array of header objects
 * @param {string} [serverResponseData.language] - The response language (e.g., 'json', 'xml', 'text')
 * @returns {Promise} Axios response with created server response data
 * @example
 * // Create a server response
 * const response = await createMockServerResponse('mock-id-123', {
 *   name: '200 Success Response',
 *   statusCode: 200,
 *   body: JSON.stringify({ message: 'Success' }),
 *   language: 'json'
 * });
 * 
 * @example
 * // Create an error response
 * const response = await createMockServerResponse('mock-id-123', {
 *   name: '404 Not Found',
 *   statusCode: 404,
 *   body: JSON.stringify({ error: 'Not found' })
 * });
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
 * @returns {Promise} Axios response with server response data
 * @example
 * // Get a server response
 * const response = await getMockServerResponse('mock-id-123', 'response-id-456');
 * console.log(response.data.serverResponse);
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
 * @param {string} [serverResponseData.name] - The server response's name
 * @param {number} [serverResponseData.statusCode] - The HTTP status code
 * @param {string} [serverResponseData.body] - The response body content
 * @param {Array} [serverResponseData.headers] - Array of header objects
 * @returns {Promise} Axios response with updated server response data
 * @example
 * // Update a server response
 * const response = await updateMockServerResponse(
 *   'mock-id-123',
 *   'response-id-456',
 *   {
 *     name: 'Updated Response',
 *     statusCode: 201,
 *     body: JSON.stringify({ message: 'Created' })
 *   }
 * );
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
 * @returns {Promise} Axios response with deletion confirmation
 * @example
 * // Delete a server response
 * const response = await deleteMockServerResponse('mock-id-123', 'response-id-456');
 * console.log(response.data.serverResponse);
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
 * @returns {Promise} Axios response with unpublished mock data
 * @example
 * // Unpublish a mock server (make it private)
 * const response = await unpublishMock('mock-id-123');
 * console.log(response.data.mock);
 */
async function unpublishMock(mockId) {
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
  publishMock: publishMock,
  getMockServerResponses,
  createMockServerResponse,
  getMockServerResponse,
  updateMockServerResponse,
  deleteMockServerResponse,
  unpublishMock: unpublishMock
};

