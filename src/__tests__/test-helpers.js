const fs = require('fs');
const path = require('path');

// Shared test IDs file location - accessible to all test modules
const TEST_IDS_FILE = path.join(__dirname, 'test-ids.json');

/**
 * Load persisted test IDs from shared file
 * @returns {Object} Test IDs object
 */
function loadTestIds() {
  try {
    if (fs.existsSync(TEST_IDS_FILE)) {
      const data = fs.readFileSync(TEST_IDS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.log('No existing test IDs file found or invalid JSON, will create new resources');
  }
  return {};
}

/**
 * Save test IDs to shared file for reuse across test runs
 * @param {Object} ids - Test IDs to persist
 */
function saveTestIds(ids) {
  try {
    fs.writeFileSync(TEST_IDS_FILE, JSON.stringify(ids, null, 2), 'utf8');
    console.log(`Test IDs saved to ${TEST_IDS_FILE}`);
  } catch (error) {
    console.error('Failed to save test IDs:', error);
  }
}

/**
 * Clear specific test ID properties by setting them to null while preserving all other properties
 * This is useful for cleanup after tests without losing unrelated test data
 * Supports nested paths using dot notation (e.g., 'folder.comment.id', 'workspace.id')
 * @param {string[]} keysToClear - Array of property keys or paths to set to null (e.g., ['workspace.id', 'folder.comment.id'])
 * @returns {Object} Updated test IDs object
 */
function clearTestIds(keysToClear = []) {
  try {
    // Load existing IDs
    const ids = loadTestIds();
    
    // If no keys specified, do nothing (don't clear everything)
    if (keysToClear.length === 0) {
      console.log('No keys specified to clear');
      return ids;
    }
    
    // Set only the specified keys to null (supports nested paths)
    keysToClear.forEach(key => {
      const parts = key.split('.');
      let current = ids;
      
      // Navigate to the parent object
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {};
        }
        current = current[parts[i]];
      }
      
      // Set the final property to null
      current[parts[parts.length - 1]] = null;
    });
    
    // Add/update clearedAt timestamp for thread
    if (!ids.folder) ids.folder = {};
    if (!ids.folder.thread) ids.folder.thread = {};
    if (keysToClear.some(k => k.startsWith('folder.'))) {
      ids.folder.thread.clearedAt = new Date().toISOString();
    }
    
    // Save the updated state
    saveTestIds(ids);
    console.log(`Cleared test ID properties: ${keysToClear.join(', ')}`);
    
    return ids;
  } catch (error) {
    console.error('Failed to clear test IDs:', error);
    return {};
  }
}

/**
 * Delete the test IDs file completely
 * Use this only when you want to start fresh
 */
function deleteTestIdsFile() {
  try {
    if (fs.existsSync(TEST_IDS_FILE)) {
      fs.unlinkSync(TEST_IDS_FILE);
      console.log('Test IDs file deleted');
    }
  } catch (error) {
    console.error('Failed to delete test IDs file:', error);
  }
}

/**
 * Initialize userId by calling /me endpoint if not already persisted
 * This should be called in beforeAll hooks of test suites
 * @returns {Promise<number>} The user's ID
 */
async function initializeUserId() {
  const ids = loadTestIds();
  
  // If userId already exists, return it
  if (ids.user && ids.user.id) {
    console.log('Using persisted user ID:', ids.user.id);
    return ids.user.id;
  }
  
  // Otherwise, fetch it from the API
  try {
    const { getAuthenticatedUser } = require('../users/index');
    const result = await getAuthenticatedUser();
    const userId = result.data.user.id;
    
    // Persist it
    saveTestIds({
      ...ids,
      user: {
        ...ids.user,
        id: userId
      }
    });
    
    console.log('Retrieved and persisted user ID:', userId);
    return userId;
  } catch (error) {
    console.error('Failed to initialize user ID:', error.message);
    throw error;
  }
}

module.exports = {
  loadTestIds,
  saveTestIds,
  clearTestIds,
  deleteTestIdsFile,
  initializeUserId,
  TEST_IDS_FILE
};

