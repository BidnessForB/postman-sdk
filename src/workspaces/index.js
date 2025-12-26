const { buildAxiosConfig, executeRequest } = require('../core/request');
const { buildQueryString, validateId } = require('../core/utils');

/**
 * Gets all workspaces
 * Postman API endpoint and method: GET /workspaces
 * @param {string} [type] - Filter by workspace type (personal, team, private, public, partner)
 * @param {number} [createdByUserId] - Return only workspaces created by a specific user ID
 * @param {string} [include] - Include additional information (mocks:deactivated, scim)
 * @returns {Promise} Axios response
 */
// REQUIRES: ID (createdByUserId uses user ID)
async function getWorkspaces(type = null, createdByUserId = null, include = null) {
  const endpoint = '/workspaces';
  const queryParams = {
    type,
    createdBy: createdByUserId,
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
// REQUIRES: N/A (creates new workspace, returns ID)
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
// REQUIRES: ID (workspaceId uses ID)
async function getWorkspace(workspaceId, include = null) {
  validateId(workspaceId, 'workspaceId');

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
 * Note: This function fetches the current workspace first to get existing values,
 * then merges updates, because the Postman API requires 'type' to be present in PUT requests.
 * @param {string} workspaceId - The workspace's ID
 * @param {string} [name] - The workspace's new name
 * @param {string} [type] - The new workspace visibility type (private, personal, team, public)
 * @param {string} [description] - The new workspace description
 * @param {string} [about] - A brief summary about the workspace
 * @returns {Promise} Axios response
 */
// REQUIRES: ID (workspaceId uses ID)
async function updateWorkspace(workspaceId, name = null, type = null, description = null, about = null) {
  validateId(workspaceId, 'workspaceId');

  // Fetch current workspace to get existing values
  const currentWorkspace = await getWorkspace(workspaceId);
  const current = currentWorkspace.data.workspace;
  
  const endpoint = `/workspaces/${workspaceId}`;
  const workspace = {
    name: name !== null ? name : current.name,
    type: type !== null ? type : current.type,
    description: description !== null ? description : current.description,
    about: about !== null ? about : current.about
  };
  
  const data = { workspace };
  const config = buildAxiosConfig('put', endpoint, data);
  return await executeRequest(config);
} 

/**
 * Deletes an existing workspace
 * Postman API endpoint and method: DELETE /workspaces/{workspaceId}
 * @param {string} workspaceId - The workspace's ID
 * @returns {Promise} Axios response
 */
// REQUIRES: ID (workspaceId uses ID)
async function deleteWorkspace(workspaceId) {
  validateId(workspaceId, 'workspaceId');

  const endpoint = `/workspaces/${workspaceId}`;
  const config = buildAxiosConfig('delete', endpoint);
  return await executeRequest(config);
}

/**
 * Gets all tags associated with a workspace
 * Postman API endpoint and method: GET /workspaces/{workspaceId}/tags
 * @param {string} workspaceId - The workspace's ID
 * @returns {Promise} Axios response
 */
// REQUIRES: ID (workspaceId uses ID)
async function getWorkspaceTags(workspaceId) {
  validateId(workspaceId, 'workspaceId');

  const endpoint = `/workspaces/${workspaceId}/tags`;
  const config = buildAxiosConfig('get', endpoint);
  return await executeRequest(config);
}

/**
 * Updates a workspace's associated tags
 * Postman API endpoint and method: PUT /workspaces/{workspaceId}/tags
 * Note: This replaces all existing tags with the provided tags array
 * @param {string} workspaceId - The workspace's ID
 * @param {Array<Object>} tags - Array of tag objects with slug property (max 5 tags)
 * @returns {Promise} Axios response
 * 
 * @example
 * // Add tags to workspace
 * await updateWorkspaceTags(workspaceId, [
 *   { slug: 'needs-review' },
 *   { slug: 'test-api' }
 * ]);
 * 
 * // Clear all tags (pass empty array)
 * await updateWorkspaceTags(workspaceId, []);
 */
// REQUIRES: ID (workspaceId uses ID)
async function updateWorkspaceTags(workspaceId, tags) {
  validateId(workspaceId, 'workspaceId');

  const endpoint = `/workspaces/${workspaceId}/tags`;
  const config = buildAxiosConfig('put', endpoint, { tags });
  return await executeRequest(config);
}

module.exports = {
  getWorkspaces,
  createWorkspace,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
  getWorkspaceTags,
  updateWorkspaceTags
};

