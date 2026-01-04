const fs = require('fs');
const path = require('path');

// Regex patterns for ID validation

//Regex pattern for ID validation
const idRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
//Regex pattern for UID validation
const uidRegex = /^[0-9]{1,10}-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Validates a standard ID (UUID format).  
 * @param {string} id - The ID to validate
 * @param {string} paramName - The parameter name for error messages
 * @throws {Error} If the ID is invalid
 */
function validateId(id, paramName) {
  if (!id) {
    throw new Error(`${paramName} is required`);
  }
  if (!idRegex.test(id)) {
    throw new Error(`${paramName} must be a valid ID format (e.g., 'cd5cb6e7-0a1e-4b82-a577-b2068a70f830')`);
  }
}

/**
 * Validates a UID (userId-UUID format)
 * @param {string} uid - The UID to validate
 * @param {string} paramName - The parameter name for error messages
 * @throws {Error} If the UID is invalid
 */
function validateUid(uid, paramName) {
  if (!uid) {
    throw new Error(`${paramName} is required`);
  }
  if (!uidRegex.test(uid)) {
    throw new Error(`${paramName} must be a valid UID format (e.g., '11111122-cd5cb6e7-0a1e-4b82-a577-b2068a70f830')`);
  }
}

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
  getContentFS,
  
  validateId,
  validateUid
};