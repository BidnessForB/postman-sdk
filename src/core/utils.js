const fs = require('fs');
const path = require('path');

/**
 * Builds a query string from parameters object
 * @param {Object} params - Object with query parameters
 * @returns {string} Query string (e.g., '?key1=value1&key2=value2')
 */
function buildQueryString(params) {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      queryParams.append(key, params[key].toString());
    }
  });
  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Reads file content from the filesystem and returns it in the format expected by Postman API
 * @param {string} filePath - The path to the file
 * @returns {Object} Object with content property containing the file content
 */
function getContentFS(filePath) {
  const fileContent = fs.readFileSync(path.resolve(filePath), 'utf8');
  return { content: fileContent };
}

module.exports = {
  buildQueryString,
  getContentFS
};