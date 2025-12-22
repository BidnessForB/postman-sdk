const { buildAxiosConfig, executeRequest } = require('../core/request');

/**
 * Gets information about the authenticated user
 * Postman API endpoint and method: GET /me
 * @returns {Promise} Axios response
 */
async function getAuthenticatedUser() {
  const endpoint = '/me';
  const config = buildAxiosConfig('get', endpoint);
  return await executeRequest(config);
}

module.exports = {
  getAuthenticatedUser
};

