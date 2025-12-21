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
 * Clear test IDs by setting all properties to null while preserving the file
 * This is useful for cleanup after tests without losing the file structure
 * @param {Object} existingIds - Existing test IDs object to clear
 * @returns {Object} Cleared test IDs object with all values set to null
 */
function clearTestIds(existingIds = {}) {
  const clearedIds = {};
  
  // Set all existing properties to null
  for (const key in existingIds) {
    if (existingIds.hasOwnProperty(key)) {
      clearedIds[key] = null;
    }
  }
  
  // Add a clearedAt timestamp
  clearedIds.clearedAt = new Date().toISOString();
  
  // Save the cleared state
  saveTestIds(clearedIds);
  
  return clearedIds;
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

module.exports = {
  loadTestIds,
  saveTestIds,
  clearTestIds,
  deleteTestIdsFile,
  TEST_IDS_FILE
};

