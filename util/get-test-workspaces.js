#!/usr/bin/env node

/**
 * Get Test Workspaces - Find workspaces matching a name pattern or tags
 * 
 * Usage:
 *   node util/get-test-workspaces.js [pattern] [-t|--tags tag1 tag2 ...] [-e|--element-type type]
 * 
 * Examples:
 *   node util/get-test-workspaces.js "*Updated*"
 *   node util/get-test-workspaces.js "Test*"
 *   node util/get-test-workspaces.js "*SDK*"
 *   node util/get-test-workspaces.js -t needs-review production
 *   node util/get-test-workspaces.js -t test-tag -e collection
 *   node util/get-test-workspaces.js "*Test*" -t needs-review
 * 
 * Pattern syntax:
 *   - Use * as a wildcard for any characters
 *   - Matching is case-insensitive
 *   - If no pattern provided, lists all workspaces (unless tags are used)
 * 
 * Tag search:
 *   -t, --tags - Search by one or more tags (space-separated)
 *   -e, --element-type - Filter by element type: 'collection' or 'workspace'
 *   - If tags are provided but no element type, searches both collections and workspaces
 */

const { workspaces, tags } = require('../src/index');
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
 * Parse command line arguments
 * @returns {Object} Parsed arguments {pattern, tags, elementType}
 */
function parseArgs() {
  const args = process.argv.slice(2);
  let pattern = null;
  const tagsList = [];
  let elementType = null;
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '-t' || arg === '--tags') {
      // Collect all tags until next flag or end
      i++;
      while (i < args.length && !args[i].startsWith('-')) {
        tagsList.push(args[i]);
        i++;
      }
      i--; // Back up one since loop will increment
    } else if (arg === '-e' || arg === '--element-type') {
      i++;
      if (i < args.length) {
        elementType = args[i];
        if (!['collection', 'workspace'].includes(elementType)) {
          console.error(`Error: Invalid element type "${elementType}". Must be 'collection' or 'workspace'`);
          process.exit(1);
        }
      }
    } else if (!arg.startsWith('-') && pattern === null) {
      // First non-flag argument is the pattern
      pattern = arg;
    }
  }
  
  return { pattern, tags: tagsList, elementType };
}

/**
 * Search entities by tags
 * @param {Array<string>} tagsList - Array of tag slugs to search
 * @param {string|null} elementType - Optional element type filter ('collection' or 'workspace')
 * @returns {Promise<Array>} Array of found entities
 */
async function searchByTags(tagsList, elementType) {
  const allEntities = [];
  const seenIds = new Set();
  
  // Determine which entity types to search
  const entityTypes = elementType ? [elementType] : ['collection', 'workspace'];
  
  for (const tag of tagsList) {
    for (const type of entityTypes) {
      try {
        const response = await tags.getTagEntities(tag, 50, null, null, type);
        const entities = response.data.entities || [];
        
        // Add entities, avoiding duplicates
        entities.forEach(entity => {
          const id = entity.id || entity.entityId;
          if (id && !seenIds.has(id)) {
            seenIds.add(id);
            allEntities.push({
              ...entity,
              entityType: type,
              tagSlug: tag
            });
          }
        });
      } catch (error) {
        // Ignore 404s for tags that don't exist, but report other errors
        if (!error.response || error.response.status !== 404) {
          console.error(`Warning: Error fetching entities for tag "${tag}":`, error.message);
        }
      }
    }
  }
  
  return allEntities;
}

/**
 * Display entities found by tag search
 * @param {Array} entities - Array of entities to display
 * @param {Array<string>} tagsList - Array of tags searched
 * @param {string|null} elementType - Element type filter used
 */
function displayTagResults(entities, tagsList, elementType) {
  console.log(`Found ${entities.length} element(s) with tag(s): ${tagsList.join(', ')}`);
  if (elementType) {
    console.log(`Filtered by element type: ${elementType}`);
  }
  console.log('========================================\n');
  
  if (entities.length === 0) {
    console.log('No matching elements found.');
  } else {
    entities.forEach((entity, index) => {
      console.log(`${index + 1}. ${entity.name || 'Unnamed'}`);
      console.log(`   Type: ${entity.entityType}`);
      console.log(`   ID: ${entity.id || entity.entityId}`);
      console.log(`   Tag: ${entity.tagSlug}`);
      if (entity.summary) {
        console.log(`   Summary: ${entity.summary}`);
      }
      console.log('');
    });
    
    // Summary by type
    const byType = entities.reduce((acc, entity) => {
      acc[entity.entityType] = (acc[entity.entityType] || 0) + 1;
      return acc;
    }, {});
    
    console.log('========================================');
    console.log(`Total: ${entities.length} element(s)`);
    Object.entries(byType).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
  }
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

  // Parse command line arguments
  const { pattern, tags: tagsList, elementType } = parseArgs();

  console.log('\n========================================');

  try {
    // If tags are provided, use tag-based search
    if (tagsList.length > 0) {
      const entities = await searchByTags(tagsList, elementType);
      
      // Apply name pattern filter if provided
      let filteredEntities = entities;
      if (pattern) {
        const regex = patternToRegex(pattern);
        filteredEntities = entities.filter(entity => regex.test(entity.name || ''));
        console.log(`Finding elements matching pattern: ${pattern} with tag(s): ${tagsList.join(', ')}`);
        if (elementType) {
          console.log(`Element type: ${elementType}`);
        }
      } else {
        console.log(`Finding elements with tag(s): ${tagsList.join(', ')}`);
        if (elementType) {
          console.log(`Element type: ${elementType}`);
        }
      }
      console.log('========================================\n');
      
      displayTagResults(filteredEntities, tagsList, elementType);
    } else {
      // Original workspace-only search by name pattern
      const regex = patternToRegex(pattern);
      
      if (pattern) {
        console.log(`Finding workspaces matching: ${pattern}`);
      } else {
        console.log('Listing all workspaces');
      }
      console.log('========================================\n');
      
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
    }
  } catch (error) {
    console.error('Error fetching data:');
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

