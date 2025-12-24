#!/usr/bin/env node

/**
 * Get Test Workspaces - Find workspaces matching a name pattern
 * 
 * Usage:
 *   node util/get-test-workspaces.js [pattern]
 * 
 * Examples:
 *   node util/get-test-workspaces.js "*Updated*"
 *   node util/get-test-workspaces.js "Test*"
 *   node util/get-test-workspaces.js "*SDK*"
 * 
 * Pattern syntax:
 *   - Use * as a wildcard for any characters
 *   - Matching is case-insensitive
 *   - If no pattern provided, lists all workspaces
 */

const { workspaces } = require('../src/index');
const { POSTMAN_API_KEY_ENV_VAR } = require('../src/core/config');

/**
 * Converts a wildcard pattern (with *) to a regular expression
 * @param {string} pattern - Pattern with wildcards (e.g., "*Updated*")
 * @returns {RegExp} Regular expression for matching
 */
function patternToRegex(pattern) {
  if (!pattern) {
    return null;
  }
  // Escape special regex characters except *
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  // Convert * to .*
  const regexPattern = escaped.replace(/\*/g, '.*');
  // Make it case-insensitive and match the full string
  return new RegExp(`^${regexPattern}$`, 'i');
}

/**
 * Main function to get and filter workspaces
 */
async function main() {
  // Check for API key
  if (!process.env[POSTMAN_API_KEY_ENV_VAR]) {
    console.error(`Error: ${POSTMAN_API_KEY_ENV_VAR} environment variable is required`);
    console.error(`Set it with: export ${POSTMAN_API_KEY_ENV_VAR}=your_api_key_here`);
    process.exit(1);
  }

  // Get pattern from command line args
  const pattern = process.argv[2];
  const regex = patternToRegex(pattern);

  console.log('\n========================================');
  if (pattern) {
    console.log(`Finding workspaces matching: ${pattern}`);
  } else {
    console.log('Listing all workspaces');
  }
  console.log('========================================\n');

  try {
    // Fetch all workspaces
    const response = await workspaces.getWorkspaces();
    const allWorkspaces = response.data.workspaces || [];

    // Filter by pattern if provided
    const matchedWorkspaces = regex 
      ? allWorkspaces.filter(ws => regex.test(ws.name))
      : allWorkspaces;

    // Display results
    if (matchedWorkspaces.length === 0) {
      console.log('No matching workspaces found.');
    } else {
      console.log(`Found ${matchedWorkspaces.length} workspace(s):\n`);
      
      matchedWorkspaces.forEach((ws, index) => {
        console.log(`${index + 1}. ${ws.name}`);
        console.log(`   ID: ${ws.id}`);
        console.log(`   Type: ${ws.type}`);
        console.log(`   Visibility: ${ws.visibility}`);
        if (ws.description) {
          console.log(`   Description: ${ws.description}`);
        }
        console.log('');
      });

      // Summary
      console.log('========================================');
      console.log(`Total: ${matchedWorkspaces.length} workspace(s)`);
      if (pattern && allWorkspaces.length > matchedWorkspaces.length) {
        console.log(`(Filtered from ${allWorkspaces.length} total workspaces)`);
      }
    }
  } catch (error) {
    console.error('Error fetching workspaces:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Message: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }

  console.log('========================================\n');
}

// Run the script
main();

