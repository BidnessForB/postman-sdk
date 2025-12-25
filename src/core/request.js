const axios = require('axios');
const { apiKey, baseUrl } = require('./config');

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
  return await axios.request(config);
  
}

module.exports = {
  buildAxiosConfig,
  executeRequest
};

