#!/usr/bin/env node

/**
 * Delete Test Objects - Delete all collections, specs, and environments from workspace in test-ids.json
 * 
 * Usage:
 *   node util/delete-test-objects.js [options]
 * 
 * Options:
 *   -c, --collections    Delete ALL collections in the workspace
 *   -s, --specs          Delete ALL specs in the workspace
 *   -e, --environments   Delete ALL environments in the workspace
 *   --force              Skip confirmation prompt and delete immediately
 *   --dry-run            List objects that would be deleted without deleting them
 * 
 * Examples:
 *   node util/delete-test-objects.js -c                    # Delete all collections
 *   node util/delete-test-objects.js -s                    # Delete all specs
 *   node util/delete-test-objects.js -c -s                 # Delete all collections and specs
 *   node util/delete-test-objects.js -c -s --force         # Delete without confirmation
 *   node util/delete-test-objects.js -c -s --dry-run       # Show what would be deleted
 *   node util/delete-test-objects.js --collections --specs # Long form options
 * 
 * Note: This script retrieves ALL objects of the specified type from the workspace
 * defined in test-ids.json and deletes them. Only the workspaceId is read from test-ids.json.
 * 
 * WARNING: This permanently deletes ALL objects of the specified type. Use with caution!
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { collections, specs, environments } = require('../src/index');
const { POSTMAN_API_KEY_ENV_VAR } = require('../src/core/config');

const TEST_IDS_PATH = path.join(__dirname, '../src/__tests__/test-ids.json');

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
 * Load workspace ID from test-ids.json
 * @returns {string} Workspace ID
 */
function loadWorkspaceId() {
  try {
    const data = fs.readFileSync(TEST_IDS_PATH, 'utf8');
    const testIds = JSON.parse(data);
    
    if (!testIds.workspace || !testIds.workspace.id) {
      console.error('Error: workspace.id not found in test-ids.json');
      process.exit(1);
    }
    
    return testIds.workspace.id;
  } catch (error) {
    console.error(`Error reading test-ids.json: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Fetch all collections from workspace
 * @param {string} workspaceId - The workspace ID
 * @returns {Promise<Array<Object>>} Array of collection objects with id and name
 */
async function fetchCollections(workspaceId) {
  try {
    console.log('Fetching collections from workspace...');
    const response = await collections.getCollections(workspaceId);
    const collectionList = response.data.collections || [];
    
    return collectionList.map(col => ({
      id: col.id,
      uid: col.uid,
      name: col.name
    }));
  } catch (error) {
    console.error('Error fetching collections:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Message: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(error.message);
    }
    throw error;
  }
}

/**
 * Fetch all specs from workspace
 * @param {string} workspaceId - The workspace ID
 * @returns {Promise<Array<Object>>} Array of spec objects with id and name
 */
async function fetchSpecs(workspaceId) {
  try {
    console.log('Fetching specs from workspace...');
    const response = await specs.getSpecs(workspaceId);
    const specList = response.data.specs || [];
    
    return specList.map(spec => ({
      id: spec.id,
      name: spec.name
    }));
  } catch (error) {
    console.error('Error fetching specs:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Message: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(error.message);
    }
    throw error;
  }
}

/**
 * Fetch all environments from workspace
 * @param {string} workspaceId - The workspace ID
 * @returns {Promise<Array<Object>>} Array of environment objects with id and name
 */
async function fetchEnvironments(workspaceId) {
  try {
    console.log('Fetching environments from workspace...');
    const response = await environments.getEnvironments(workspaceId);
    const environmentList = response.data.environments || [];
    
    return environmentList.map(env => ({
      id: env.id,
      uid: env.uid,
      name: env.name
    }));
  } catch (error) {
    console.error('Error fetching environments:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Message: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(error.message);
    }
    throw error;
  }
}

/**
 * Delete collections
 * @param {Array<Object>} collectionIds - Array of collection objects with id and name
 * @returns {Object} Summary with success and fail counts
 */
async function deleteCollections(collectionIds) {
  let successCount = 0;
  let failCount = 0;
  
  console.log('\n--- Deleting Collections ---\n');
  
  for (const col of collectionIds) {
    try {
      console.log(`Deleting: ${col.name}`);
      console.log(`  ID: ${col.id}`);
      await collections.deleteCollection(col.id);
      console.log(`  ✓ Successfully deleted\n`);
      successCount++;
    } catch (error) {
      console.error(`  ✗ Failed to delete`);
      if (error.response) {
        console.error(`    Status: ${error.response.status}`);
        console.error(`    Message: ${JSON.stringify(error.response.data, null, 2)}`);
      } else {
        console.error(`    Error: ${error.message}`);
      }
      console.log('');
      failCount++;
    }
  }
  
  return { successCount, failCount };
}

/**
 * Delete specs
 * @param {Array<Object>} specIds - Array of spec objects with id and name
 * @returns {Object} Summary with success and fail counts
 */
async function deleteSpecs(specIds) {
  let successCount = 0;
  let failCount = 0;
  
  console.log('\n--- Deleting Specs ---\n');
  
  for (const spec of specIds) {
    try {
      console.log(`Deleting: ${spec.name}`);
      console.log(`  ID: ${spec.id}`);
      await specs.deleteSpec(spec.id);
      console.log(`  ✓ Successfully deleted\n`);
      successCount++;
    } catch (error) {
      console.error(`  ✗ Failed to delete`);
      if (error.response) {
        console.error(`    Status: ${error.response.status}`);
        console.error(`    Message: ${JSON.stringify(error.response.data, null, 2)}`);
      } else {
        console.error(`    Error: ${error.message}`);
      }
      console.log('');
      failCount++;
    }
  }
  
  return { successCount, failCount };
}

/**
 * Delete environments
 * @param {Array<Object>} environmentIds - Array of environment objects with id and name
 * @returns {Object} Summary with success and fail counts
 */
async function deleteEnvironments(environmentIds) {
  let successCount = 0;
  let failCount = 0;
  
  console.log('\n--- Deleting Environments ---\n');
  
  for (const env of environmentIds) {
    try {
      console.log(`Deleting: ${env.name}`);
      console.log(`  ID: ${env.id}`);
      await environments.deleteEnvironment(env.id);
      console.log(`  ✓ Successfully deleted\n`);
      successCount++;
    } catch (error) {
      console.error(`  ✗ Failed to delete`);
      if (error.response) {
        console.error(`    Status: ${error.response.status}`);
        console.error(`    Message: ${JSON.stringify(error.response.data, null, 2)}`);
      } else {
        console.error(`    Error: ${error.message}`);
      }
      console.log('');
      failCount++;
    }
  }
  
  return { successCount, failCount };
}

/**
 * Main function
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
  const deleteCollectionsFlag = args.includes('-c') || args.includes('--collections');
  const deleteSpecsFlag = args.includes('-s') || args.includes('--specs');
  const deleteEnvironmentsFlag = args.includes('-e') || args.includes('--environments');
  const forceFlag = args.includes('--force');
  const dryRunFlag = args.includes('--dry-run');

  // Check if at least one option is provided
  if (!deleteCollectionsFlag && !deleteSpecsFlag && !deleteEnvironmentsFlag) {
    console.error('Error: At least one option is required');
    console.error('Usage: node util/delete-test-objects.js [options]');
    console.error('Options:');
    console.error('  -c, --collections    Delete ALL collections in workspace');
    console.error('  -s, --specs          Delete ALL specs in workspace');
    console.error('  -e, --environments   Delete ALL environments in workspace');
    console.error('  --force              Skip confirmation prompt');
    console.error('  --dry-run            List objects without deleting them');
    console.error('');
    console.error('Examples:');
    console.error('  node util/delete-test-objects.js -c');
    console.error('  node util/delete-test-objects.js -c -s');
    console.error('  node util/delete-test-objects.js --collections --specs --force');
    console.error('  node util/delete-test-objects.js -c -s --dry-run');
    process.exit(1);
  }

  // Load workspace ID
  console.log('\n========================================');
  if (dryRunFlag) {
    console.log('🔍 DRY RUN MODE - NO DELETIONS WILL BE PERFORMED');
  } else {
    console.log('⚠️  DELETE TEST OBJECTS ⚠️');
  }
  console.log('========================================');
  console.log(`Reading workspace ID from: ${TEST_IDS_PATH}`);
  
  const workspaceId = loadWorkspaceId();
  console.log(`Workspace ID: ${workspaceId}`);
  console.log('========================================\n');

  // Fetch objects to delete
  let collectionsToDelete = [];
  let specsToDelete = [];
  let environmentsToDelete = [];

  try {
    if (deleteCollectionsFlag) {
      collectionsToDelete = await fetchCollections(workspaceId);
      console.log(`Found ${collectionsToDelete.length} collection(s)\n`);
    }

    if (deleteSpecsFlag) {
      specsToDelete = await fetchSpecs(workspaceId);
      console.log(`Found ${specsToDelete.length} spec(s)\n`);
    }

    if (deleteEnvironmentsFlag) {
      environmentsToDelete = await fetchEnvironments(workspaceId);
      console.log(`Found ${environmentsToDelete.length} environment(s)\n`);
    }
  } catch (error) {
    console.log('========================================\n');
    process.exit(1);
  }

  // Display what will be deleted
  let totalCount = 0;

  if (collectionsToDelete.length > 0) {
    console.log('Collections to delete:');
    collectionsToDelete.forEach((col, index) => {
      console.log(`  ${index + 1}. ${col.name}`);
      console.log(`     ID: ${col.id}`);
    });
    console.log('');
    totalCount += collectionsToDelete.length;
  } else if (deleteCollectionsFlag) {
    console.log('No collections found in workspace.\n');
  }

  if (specsToDelete.length > 0) {
    console.log('Specs to delete:');
    specsToDelete.forEach((spec, index) => {
      console.log(`  ${index + 1}. ${spec.name}`);
      console.log(`     ID: ${spec.id}`);
    });
    console.log('');
    totalCount += specsToDelete.length;
  } else if (deleteSpecsFlag) {
    console.log('No specs found in workspace.\n');
  }

  if (environmentsToDelete.length > 0) {
    console.log('Environments to delete:');
    environmentsToDelete.forEach((env, index) => {
      console.log(`  ${index + 1}. ${env.name}`);
      console.log(`     ID: ${env.id}`);
    });
    console.log('');
    totalCount += environmentsToDelete.length;
  } else if (deleteEnvironmentsFlag) {
    console.log('No environments found in workspace.\n');
  }

  if (totalCount === 0) {
    console.log('No objects found to delete.');
    console.log('========================================\n');
    return;
  }

  console.log(`Total objects to delete: ${totalCount}\n`);

  // If dry-run, skip deletion and show summary
  if (dryRunFlag) {
    console.log('========================================');
    console.log('DRY RUN SUMMARY');
    console.log('========================================');
    console.log('The following objects would be deleted:');
    console.log('');
    
    if (collectionsToDelete.length > 0) {
      console.log(`Collections: ${collectionsToDelete.length}`);
    }
    
    if (specsToDelete.length > 0) {
      console.log(`Specs: ${specsToDelete.length}`);
    }
    
    if (environmentsToDelete.length > 0) {
      console.log(`Environments: ${environmentsToDelete.length}`);
    }
    
    console.log('');
    console.log(`Total: ${totalCount} object(s)`);
    console.log('');
    console.log('ℹ️  No deletions performed (dry-run mode)');
    console.log('ℹ️  Run without --dry-run to actually delete these objects');
    console.log('========================================\n');
    return;
  }

  // Confirm deletion unless --force flag is used
  if (!forceFlag) {
    console.log('⚠️  WARNING: This will permanently delete these objects! ⚠️\n');
    const confirmed = await askConfirmation('Type "yes" or "y" to confirm deletion: ');
    
    if (!confirmed) {
      console.log('\nDeletion cancelled.');
      console.log('========================================\n');
      return;
    }
  } else {
    console.log('--force flag detected. Skipping confirmation.\n');
  }

  // Perform deletions
  const results = {
    collections: { successCount: 0, failCount: 0 },
    specs: { successCount: 0, failCount: 0 },
    environments: { successCount: 0, failCount: 0 }
  };

  if (collectionsToDelete.length > 0) {
    results.collections = await deleteCollections(collectionsToDelete);
  }

  if (specsToDelete.length > 0) {
    results.specs = await deleteSpecs(specsToDelete);
  }

  if (environmentsToDelete.length > 0) {
    results.environments = await deleteEnvironments(environmentsToDelete);
  }

  // Display summary
  console.log('========================================');
  console.log('DELETION SUMMARY');
  console.log('========================================');
  
  if (deleteCollectionsFlag) {
    console.log('Collections:');
    console.log(`  Successfully deleted: ${results.collections.successCount}`);
    console.log(`  Failed: ${results.collections.failCount}`);
    console.log(`  Total: ${collectionsToDelete.length}`);
  }
  
  if (deleteSpecsFlag) {
    console.log('Specs:');
    console.log(`  Successfully deleted: ${results.specs.successCount}`);
    console.log(`  Failed: ${results.specs.failCount}`);
    console.log(`  Total: ${specsToDelete.length}`);
  }
  
  if (deleteEnvironmentsFlag) {
    console.log('Environments:');
    console.log(`  Successfully deleted: ${results.environments.successCount}`);
    console.log(`  Failed: ${results.environments.failCount}`);
    console.log(`  Total: ${environmentsToDelete.length}`);
  }
  
  const totalSuccess = results.collections.successCount + results.specs.successCount + results.environments.successCount;
  const totalFailed = results.collections.failCount + results.specs.failCount + results.environments.failCount;
  
  console.log('');
  console.log(`Overall: ${totalSuccess} succeeded, ${totalFailed} failed`);
  console.log('========================================\n');

  if (totalFailed > 0) {
    process.exit(1);
  }
}

// Run the script
main();

