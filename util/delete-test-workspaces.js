#!/usr/bin/env node

/**
 * Delete Test Workspaces - Delete workspaces by ID or name pattern
 * 
 * Usage:
 *   By pattern: node util/delete-test-workspaces.js <pattern> [--force]
 *   By ID:      node util/delete-test-workspaces.js --workspaceId=<id> [--force]
 * 
 * Examples:
 *   node util/delete-test-workspaces.js "*Updated*"
 *   node util/delete-test-workspaces.js "Test*" --force
 *   node util/delete-test-workspaces.js --workspaceId=abc123-def456 --force
 * 
 * Pattern syntax:
 *   - Use * as a wildcard for any characters
 *   - Matching is case-insensitive
 *   - Pattern is REQUIRED unless --workspaceId is provided
 * 
 * Options:
 *   --workspaceId=<id>   Delete a specific workspace by ID
 *   --force              Skip confirmation prompt and delete immediately
 * 
 * WARNING: This permanently deletes workspaces. Use with caution!
 */

const { workspaces } = require('../src/index');
const { POSTMAN_API_KEY_ENV_VAR } = require('../src/core/config');
const readline = require('readline');

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
 * Prompt user for confirmation
 * @param {string} question - Question to ask
 * @returns {Promise<boolean>} True if user confirms, false otherwise
 */
function askConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
    });
  });
}

/**
 * Delete a single workspace by ID
 * @param {string} workspaceId - The workspace ID to delete
 * @param {boolean} forceFlag - Skip confirmation if true
 */
async function deleteWorkspaceById(workspaceId, forceFlag) {
  console.log('\n========================================');
  console.log('⚠️  DELETE WORKSPACE BY ID ⚠️');
  console.log('========================================');
  console.log(`Workspace ID: ${workspaceId}`);
  console.log('========================================\n');

  try {
    // Fetch workspace details
    console.log('Fetching workspace details...');
    const wsResponse = await workspaces.getWorkspace(workspaceId);
    const workspace = wsResponse.data.workspace;

    console.log('Workspace found:\n');
    console.log(`Name: ${workspace.name}`);
    console.log(`ID: ${workspace.id}`);
    console.log(`Type: ${workspace.type}`);
    console.log(`Visibility: ${workspace.visibility}`);
    console.log('');

    // Confirm deletion unless --force flag is used
    if (!forceFlag) {
      console.log('⚠️  WARNING: This will permanently delete this workspace! ⚠️\n');
      const confirmed = await askConfirmation('Type "yes" or "y" to confirm deletion: ');
      
      if (!confirmed) {
        console.log('\nDeletion cancelled.');
        console.log('========================================\n');
        return;
      }
    } else {
      console.log('--force flag detected. Skipping confirmation.\n');
    }

    // Delete workspace
    console.log(`Deleting workspace: ${workspace.name} (${workspace.id})\n`);
    await workspaces.deleteWorkspace(workspace.id);
    console.log(`✓ Successfully deleted: ${workspace.name}\n`);

    console.log('=========================================');   
    console.log('DELETION COMPLETE');
    console.log('========================================\n');

  } catch (error) {
    console.error('Error deleting workspace:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Message: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(error.message);
    }
    console.log('========================================\n');
    process.exit(1);
  }
}

/**
 * Delete workspaces by pattern
 * @param {string} pattern - Pattern to match workspace names
 * @param {boolean} forceFlag - Skip confirmation if true
 */
async function deleteWorkspacesByPattern(pattern, forceFlag) {
  const regex = patternToRegex(pattern);

  console.log('\n========================================');
  console.log('⚠️  DELETE TEST WORKSPACES ⚠️');
  console.log('========================================');
  console.log(`Pattern: ${pattern}`);
  console.log('========================================\n');

  try {
    // Fetch all workspaces
    console.log('Fetching workspaces...');
    const response = await workspaces.getWorkspaces();
    const allWorkspaces = response.data.workspaces || [];

    // Filter by pattern
    const matchedWorkspaces = allWorkspaces.filter(ws => regex.test(ws.name));

    // Display results
    if (matchedWorkspaces.length === 0) {
      console.log('No matching workspaces found.');
      console.log('========================================\n');
      return;
    }

    console.log(`Found ${matchedWorkspaces.length} workspace(s) to delete:\n`);
    
    matchedWorkspaces.forEach((ws, index) => {
      console.log(`${index + 1}. ${ws.name}`);
      console.log(`   ID: ${ws.id}`);
      console.log(`   Type: ${ws.type}`);
      console.log(`   Visibility: ${ws.visibility}`);
      console.log('');
    });

    // Confirm deletion unless --force flag is used
    if (!forceFlag) {
      console.log('⚠️  WARNING: This will permanently delete these workspaces! ⚠️\n');
      const confirmed = await askConfirmation('Type "yes" or "y" to confirm deletion: ');
      
      if (!confirmed) {
        console.log('\nDeletion cancelled.');
        console.log('========================================\n');
        return;
      }
    } else {
      console.log('--force flag detected. Skipping confirmation.\n');
    }

    // Delete workspaces
    console.log('\nDeleting workspaces...\n');
    let successCount = 0;
    let failCount = 0;

    for (const ws of matchedWorkspaces) {
      try {
        console.log(`Deleting: ${ws.name} (${ws.id})`);
        await workspaces.deleteWorkspace(ws.id);
        console.log(`✓ Successfully deleted: ${ws.name}\n`);
        successCount++;
      } catch (error) {
        console.error(`✗ Failed to delete: ${ws.name}`);
        if (error.response) {
          console.error(`  Status: ${error.response.status}`);
          console.error(`  Message: ${JSON.stringify(error.response.data, null, 2)}`);
        } else {
          console.error(`  Error: ${error.message}`);
        }
        console.log('');
        failCount++;
      }
    }

    // Summary
    console.log('========================================');
    console.log('DELETION SUMMARY');
    console.log('========================================');
    console.log(`Successfully deleted: ${successCount}`);
    console.log(`Failed: ${failCount}`);
    console.log(`Total: ${matchedWorkspaces.length}`);
    console.log('========================================\n');

    if (failCount > 0) {
      process.exit(1);
    }

  } catch (error) {
    console.error('Error fetching workspaces:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Message: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(error.message);
    }
    console.log('========================================\n');
    process.exit(1);
  }
}

/**
 * Main function to find and delete workspaces
 */
async function main() {
  // Check for API key
  if (!process.env[POSTMAN_API_KEY_ENV_VAR]) {
    console.error(`Error: ${POSTMAN_API_KEY_ENV_VAR} environment variable is required`);
    console.error(`Set it with: export ${POSTMAN_API_KEY_ENV_VAR}=your_api_key_here`);
    process.exit(1);
  }

  // Parse command line args
  const args = process.argv.slice(2);
  const forceFlag = args.includes('--force');
  
  // Check for --workspaceId parameter
  const workspaceIdArg = args.find(arg => arg.startsWith('--workspaceId='));
  const workspaceId = workspaceIdArg ? workspaceIdArg.split('=')[1] : null;

  // If workspaceId is provided, delete by ID
  if (workspaceId) {
    if (!workspaceId.trim()) {
      console.error('Error: --workspaceId value cannot be empty');
      console.error('Usage: node util/delete-test-workspaces.js --workspaceId=<id> [--force]');
      process.exit(1);
    }
    await deleteWorkspaceById(workspaceId.trim(), forceFlag);
    return;
  }

  // Otherwise, delete by pattern
  const pattern = args.find(arg => !arg.startsWith('--'));

  if (!pattern) {
    console.error('Error: Pattern or --workspaceId is required');
    console.error('Usage: node util/delete-test-workspaces.js <pattern> [--force]');
    console.error('   or: node util/delete-test-workspaces.js --workspaceId=<id> [--force]');
    console.error('Example: node util/delete-test-workspaces.js "*Updated*"');
    console.error('Example: node util/delete-test-workspaces.js --workspaceId=abc123 --force');
    process.exit(1);
  }

  await deleteWorkspacesByPattern(pattern, forceFlag);
}

// Run the script
main();

