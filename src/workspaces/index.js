const { buildAxiosConfig, executeRequest } = require('../core/request');
const { buildQueryString } = require('../core/utils');

/**
 * Gets all workspaces
 * Postman API endpoint and method: GET /workspaces
 * @param {string} [type] - Filter by workspace type (personal, team, private, public, partner)
 * @param {number} [createdBy] - Return only workspaces created by a specific user ID
 * @param {string} [include] - Include additional information (mocks:deactivated, scim)
 * @returns {Promise} Axios response
 */
async function getWorkspaces(type = null, createdBy = null, include = null) {
  const endpoint = '/workspaces';
  const queryParams = {
    type,
    createdBy,
    include
  };
  const fullEndpoint = `${endpoint}${buildQueryString(queryParams)}`;
  const config = buildAxiosConfig('get', fullEndpoint);
  return await executeRequest(config);
}

/**
 * Creates a new workspace
 * Postman API endpoint and method: POST /workspaces
 * @param {string} name - The workspace's name
 * @param {string} type - The type of workspace (personal, private, public, team, partner)
 * @param {string} [description] - The workspace's description
 * @param {string} [about] - A brief summary about the workspace
 * @returns {Promise} Axios response
 */
async function createWorkspace(name, type, description = null, about = null) {
  const endpoint = '/workspaces';
  const workspace = {
    name,
    type
  };
  if (description !== null) {
    workspace.description = description;
  }
  if (about !== null) {
    workspace.about = about;
  }
  const config = buildAxiosConfig('post', endpoint, { workspace });
  return await executeRequest(config);
}

/**
 * Gets information about a workspace
 * Postman API endpoint and method: GET /workspaces/{workspaceId}
 * @param {string} workspaceId - The workspace's ID
 * @param {string} [include] - Include additional information (mocks:deactivated, scim)
 * @returns {Promise} Axios response
 */
async function getWorkspace(workspaceId, include = null) {
  const endpoint = `/workspaces/${workspaceId}`;
  const queryParams = {
    include
  };
  const fullEndpoint = `${endpoint}${buildQueryString(queryParams)}`;
  const config = buildAxiosConfig('get', fullEndpoint);
  return await executeRequest(config);
}

/**
 * Updates a workspace
 * Postman API endpoint and method: PUT /workspaces/{workspaceId}
 * @param {string} workspaceId - The workspace's ID
 * @param {string} [name] - The workspace's new name
 * @param {string} [type] - The new workspace visibility type (private, personal, team, public)
 * @param {string} [description] - The new workspace description
 * @param {string} [about] - A brief summary about the workspace
 * @returns {Promise} Axios response
 */
async function updateWorkspace(workspaceId, name = null, type = null, description = null, about = null) {
  const endpoint = `/workspaces/${workspaceId}`;
  const workspace = {};
  if (name !== null) {
    workspace.name = name;
  }
  if (type !== null) {
    workspace.type = type;
  }
  if (description !== null) {
    workspace.description = description;
  }
  if (about !== null) {
    workspace.about = about;
  }
  const config = buildAxiosConfig('put', endpoint, { workspace });
  return await executeRequest(config);
}

/**
 * Deletes an existing workspace
 * Postman API endpoint and method: DELETE /workspaces/{workspaceId}
 * @param {string} workspaceId - The workspace's ID
 * @returns {Promise} Axios response
 */
async function deleteWorkspace(workspaceId) {
  const endpoint = `/workspaces/${workspaceId}`;
  const config = buildAxiosConfig('delete', endpoint);
  return await executeRequest(config);
}

module.exports = {
  getWorkspaces,
  createWorkspace,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace
};

