const { buildAxiosConfig, executeRequest } = require('../core/request');

/**
 * Gets information about the authenticated user
 * Postman API endpoint and method: GET /me
 * @returns {Promise} Axios response with authenticated user information including id, username, email, and team details
 * @example
 * // Get current user information
 * const response = await getAuthenticatedUser();
 * console.log(response.data.user);
 * console.log(response.data.user.id);
 * console.log(response.data.user.username);
 */
async function getAuthenticatedUser() {
  const endpoint = '/me';
  const config = buildAxiosConfig('get', endpoint);
  return await executeRequest(config);
}

module.exports = {
  getAuthenticatedUser
};

