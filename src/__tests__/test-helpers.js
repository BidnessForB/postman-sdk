const fs = require('fs');
const path = require('path');

// Shared test IDs file location - accessible to all test modules
const TEST_IDS_FILE = path.join(__dirname, 'test-ids.json');

const DEFAULT_ID = 'bf5cb6e7-4b82-a577-d70a-b2068a70f830';
const DEFAULT_UID = '34829850-bf5cb6e7-4b82-a577-d70a-b2068a70f830';


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
    const { getAuthenticatedUser } = require('../users/user');
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

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {Object} options - Retry options
 * @param {number} options.maxAttempts - Maximum number of retry attempts (default: 3)
 * @param {number} options.initialDelay - Initial delay in ms (default: 1000)
 * @param {number} options.maxDelay - Maximum delay in ms (default: 10000)
 * @param {number} options.factor - Exponential backoff factor (default: 2)
 * @param {Function} options.onRetry - Callback on retry (attempt, maxAttempts, delay, error)
 * @param {Function} options.shouldRetry - Function to determine if error should be retried (default: always retry)
 * @returns {Promise} Result of successful function call
 */
async function retryWithBackoff(fn, options = {}) {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    factor = 2,
    onRetry = null,
    shouldRetry = (error) => true
  } = options;

  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Check if we should retry this error
      if (!shouldRetry(error)) {
        throw error;
      }
      
      if (attempt === maxAttempts) {
        console.error(`Failed after ${maxAttempts} attempts`);
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(initialDelay * Math.pow(factor, attempt - 1), maxDelay);
      
      if (onRetry) {
        onRetry(attempt, maxAttempts, delay, error);
      } else {
        console.log(`Attempt ${attempt}/${maxAttempts} failed. Retrying in ${delay}ms...`);
        console.log(`Error: ${error.message}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

/**
 * Poll an async task until completion with retry logic
 * @param {Function} checkStatusFn - Function that checks task status (should return axios response)
 * @param {Object} options - Polling options
 * @param {number} options.pollInterval - Time between polls in ms (default: 5000)
 * @param {number} options.timeout - Maximum time to wait in ms (default: 60000)
 * @param {string} options.taskName - Name of task for logging (default: 'Task')
 * @param {number} options.maxRetries - Max retries for each status check (default: 3)
 * @returns {Promise} Final status result when completed
 */
async function pollUntilComplete(checkStatusFn, options = {}) {
  const {
    pollInterval = 5000,
    timeout = 60000,
    taskName = 'Task',
    maxRetries = 3
  } = options;

  const maxAttempts = Math.ceil(timeout / pollInterval);
  const startTime = Date.now();
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`${taskName} - Polling attempt ${attempt}/${maxAttempts}...`);
    
    let statusResult;
    try {
      // Retry the status check itself in case of network errors
      statusResult = await retryWithBackoff(
        checkStatusFn,
        {
          maxAttempts: maxRetries,
          initialDelay: 2000,
          shouldRetry: (error) => {
            // Retry on network errors, not on 404/403
            const status = error?.response?.status;
            return !status || status >= 500 || status === 429;
          },
          onRetry: (attempt, max, delay, error) => {
            console.log(`  Status check failed (attempt ${attempt}/${max}). Retrying in ${delay}ms...`);
            console.log(`  Error: ${error.message}`);
          }
        }
      );
    } catch (error) {
      console.error(`Failed to check status after ${maxRetries} retries`);
      throw error;
    }
    
    const status = statusResult.data.status;
    console.log(`${taskName} status: ${status}`);
    
    if (status === 'completed') {
      console.log(`✓ ${taskName} completed successfully!`);
      return statusResult;
    }
    
    if (status === 'failed') {
      const errorMessage = statusResult.data.error || 'Unknown error';
      throw new Error(`${taskName} failed: ${errorMessage}`);
    }
    
    // Still pending - check if we should continue
    const elapsed = Date.now() - startTime;
    if (elapsed >= timeout) {
      throw new Error(
        `Timeout: ${taskName} did not complete within ${timeout / 1000}s. ` +
        `Last status: ${status}`
      );
    }
    
    // Wait before next poll
    if (attempt < maxAttempts) {
      console.log(`Waiting ${pollInterval / 1000}s before next poll...`);
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }
  }
  
  throw new Error(`${taskName} polling exceeded maximum attempts`);
}

module.exports = {
  loadTestIds,
  saveTestIds,
  clearTestIds,
  deleteTestIdsFile,
  initializeUserId,
  retryWithBackoff,
  pollUntilComplete,
  TEST_IDS_FILE, 
  DEFAULT_ID,
  DEFAULT_UID
};

