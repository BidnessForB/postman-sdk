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

/**
 * Builds a UID from a user ID and an object ID
 * @param {string|number} userId - The user's ID
 * @param {string} objectId - The object's ID (e.g., collection ID, workspace ID)
 * @returns {string} The UID in format: userId-objectId
 */
function buildUid(userId, objectId) {
  if (typeof objectId === 'string' && objectId.length === 45) {
    return objectId;
  }
  if (typeof objectId !== 'string' || objectId.length !== 36) {
    throw new Error('Invalid object ID');
  }
  return `${userId}-${objectId}`;
}

module.exports = {
  buildQueryString,
  getContentFS,
  buildUid
};