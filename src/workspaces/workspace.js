
const { buildAxiosConfig, executeRequest, buildQueryString, validateId } = require('../core/utils');

/**
 * Gets all workspaces
 * Postman API endpoint and method: GET /workspaces
 * @param {string} [type] - Filter by workspace type ('personal', 'team', 'private', 'public', 'partner')
 * @param {number} [createdByUserId] - Return only workspaces created by a specific user ID
 * @param {string} [include] - Include additional information ('mocks:deactivated', 'scim')
 * @returns {Promise} Axios response with workspaces array
 * @example
 * // Get all workspaces
 * const response = await getWorkspaces();
 * console.log(response.data.workspaces);
 * 
 * @example
 * // Get only team workspaces
 * const response = await getWorkspaces('team');
 * 
 * @example
 * // Get workspaces created by a specific user
 * const response = await getWorkspaces(null, 12345678);
 * 
 * @example
 * // Get workspaces with additional mock information
 * const response = await getWorkspaces(null, null, 'mocks:deactivated');
 */
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
 * @param {string} type - The type of workspace ('personal', 'private', 'public', 'team', 'partner')
 * @param {string} [description] - The workspace's description
 * @param {string} [about] - A brief summary about the workspace
 * @returns {Promise} Axios response with created workspace data including ID
 * @example
 * // Create a simple team workspace
 * const response = await createWorkspace('My Team Workspace', 'team');
 * console.log(response.data.workspace.id);
 * 
 * @example
 * // Create a workspace with description
 * const response = await createWorkspace(
 *   'API Development',
 *   'team',
 *   'Workspace for API development and testing'
 * );
 * 
 * @example
 * // Create a workspace with description and about
 * const response = await createWorkspace(
 *   'Public APIs',
 *   'public',
 *   'Collection of public API examples',
 *   'A workspace showcasing popular public APIs'
 * );
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
 * @param {string} [include] - Include additional information ('mocks:deactivated', 'scim')
 * @returns {Promise} Axios response with workspace details including collections, environments, and mocks
 * @example
 * // Get workspace information
 * const response = await getWorkspace('workspace-id-123');
 * console.log(response.data.workspace);
 * 
 * @example
 * // Get workspace with SCIM information
 * const response = await getWorkspace('workspace-id-123', 'scim');
 */
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
 * @param {string} [type] - The new workspace visibility type ('private', 'personal', 'team', 'public', 'partner')
 * @param {string} [description] - The new workspace description
 * @param {string} [about] - A brief summary about the workspace
 * @returns {Promise} Axios response with updated workspace data
 * @example
 * // Update workspace name
 * const response = await updateWorkspace('workspace-id-123', 'New Workspace Name');
 * 
 * @example
 * // Update workspace type to team
 * const response = await updateWorkspace('workspace-id-123', null, 'team');
 * 
 * @example
 * // Update multiple properties
 * const response = await updateWorkspace(
 *   'workspace-id-123',
 *   'Updated Name',
 *   'private',
 *   'Updated description',
 *   'Updated about section'
 * );
 */
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
 * @returns {Promise} Axios response with deletion confirmation
 * @example
 * // Delete a workspace
 * const response = await deleteWorkspace('workspace-id-123');
 * console.log(response.data.workspace);
 */
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
 * @returns {Promise} Axios response with array of tags
 * @example
 * // Get all tags for a workspace
 * const response = await getWorkspaceTags('workspace-id-123');
 * console.log(response.data.tags);
 */
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
 * @param {Array<Object>} tags - Array of tag objects with slug property (maximum 5 tags)
 * @param {string} tags[].slug - The tag's slug/name
 * @returns {Promise} Axios response with updated tags
 * @example
 * // Replace workspace tags
 * const response = await updateWorkspaceTags('workspace-id-123', [
 *   { slug: 'production' },
 *   { slug: 'api-v2' },
 *   { slug: 'needs-review' }
 * ]);
 * 
 * @example
 * // Remove all tags (pass empty array)
 * const response = await updateWorkspaceTags('workspace-id-123', []);
 */
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

