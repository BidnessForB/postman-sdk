
const { buildAxiosConfig, executeRequest, buildQueryString, validateId, validateUid } = require('../core/utils');
/**
 * Gets all groups in a team
 * Postman API endpoint and method: GET /groups
 * @returns {Promise} Axios response with array of groups, including id, name, summary, members, roles, teamId, createdBy, createdAt, and updatedAt
 * @example
 * // Get all groups in the team
 * const response = await getGroups();
 * console.log(response.data.data); // Array of groups
 * response.data.data.forEach(group => {
 *   console.log(`${group.name} (ID: ${group.id})`);
 * });
 */
async function getGroups() {
  const endpoint = '/groups';
  const config = buildAxiosConfig('get', endpoint);
  return await executeRequest(config);
}

/**
 * Gets information about a specific group
 * Postman API endpoint and method: GET /groups/{groupId}
 * @param {number|string} groupId - The group's ID
 * @returns {Promise} Axios response with group details including id, teamId, name, summary, createdBy, createdAt, updatedAt, members, roles, and managers arrays
 * @example
 * // Get a specific group
 * const response = await getGroup(123);
 * console.log(response.data.name);
 * console.log(response.data.members); // Array of member user IDs
 * console.log(response.data.managers); // Array of manager user IDs
 */
async function getGroup(groupId) {
  const endpoint = `/groups/${groupId}`;
  const config = buildAxiosConfig('get', endpoint);
  return await executeRequest(config);
}

module.exports = {
  getGroups,
  getGroup
};

