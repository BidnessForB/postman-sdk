#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Standard test IDs used in examples (from test-helpers.js)
const DEFAULT_ID = 'bf5cb6e7-0a1e-4b82-a577-b2068a70f830';
const DEFAULT_UID = '34829850-bf5cb6e7-0a1e-4b82-a577-b2068a70f830';
const DEFAULT_USER_ID = '2464332';
const DEFAULT_COLLECTION_ID = 'bf5cb6e7-0a1e-4b82-a577-b2068a70f830';
const DEFAULT_FOLDER_ID = 'e650c45b-39a2-41cd-b8d2-3c021b951ec2';
const DEFAULT_SPEC_ID = 'a0c5ad64-211e-442a-b857-22b7d438d478';
const DEFAULT_ENVIRONMENT_ID = '5c6b4f4d-8a24-45f4-8b02-1f07c306be32';
const DEFAULT_COMMENT_ID = '29ff7c7c-a9a9-4f0f-acc8-a3b2cdd49c33';
const DEFAULT_COLLECTION_UID = `${DEFAULT_USER_ID}-${DEFAULT_COLLECTION_ID}`;
const DEFAULT_FOLDER_UID = `${DEFAULT_USER_ID}-${DEFAULT_FOLDER_ID}`;
const DEFAULT_SPEC_UID = `${DEFAULT_USER_ID}-${DEFAULT_SPEC_ID}`;
const DEFAULT_ENVIRONMENT_UID = `${DEFAULT_USER_ID}-${DEFAULT_ENVIRONMENT_ID}`;
const DEFAULT_COMMENT_UID = `${DEFAULT_USER_ID}-${DEFAULT_COMMENT_ID}`;


// Module groupings - functions that belong to each module
const MODULES = {
  'Collections': [
    'getCollections', 'createCollection', 'getCollection', 'updateCollection',
    'modifyCollection', 'deleteCollection', 'createFolder', 'getFolder',
    'updateFolder', 'deleteFolder', 'getCollectionComments',
    'createCollectionComment', 'updateCollectionComment', 'deleteCollectionComment',
    'getFolderComments', 'createFolderComment', 'updateFolderComment',
    'deleteFolderComment', 'syncCollectionWithSpec', 'getCollectionTags',
    'updateCollectionTags', 'createCollectionGeneration', 'getCollectionGenerations',
    'getCollectionTaskStatus', 'getCollectionForks', 'createCollectionFork',
    'mergeCollectionFork'
  ],
  'Requests': [
    'createRequest', 'getRequest', 'updateRequest', 'deleteRequest',
    'getRequestComments', 'createRequestComment', 'updateRequestComment',
    'deleteRequestComment'
  ],
  'Responses': [
    'createResponse', 'getResponse', 'updateResponse', 'deleteResponse',
    'getResponseComments', 'createResponseComment', 'updateResponseComment',
    'deleteResponseComment'
  ],
  'Workspaces': [
    'getWorkspaces', 'createWorkspace', 'getWorkspace', 'updateWorkspace',
    'deleteWorkspace', 'getWorkspaceTags', 'updateWorkspaceTags'
  ],
  'Specs': [
    'getSpecs', 'getSpec', 'createSpec', 'modifySpec', 'deleteSpec',
    'getSpecDefinition', 'getSpecFiles', 'createSpecFile', 'getSpecFile',
    'modifySpecFile', 'deleteSpecFile', 'createSpecGeneration',
    'getSpecTaskStatus', 'getSpecGenerations', 'syncSpecWithCollection'
  ],
  'Environments': [
    'getEnvironments', 'createEnvironment', 'getEnvironment',
    'modifyEnvironment', 'deleteEnvironment'
  ],
  'Mocks': [
    'getMocks', 'createMock', 'getMock', 'updateMock', 'deleteMock',
    'getMockCallLogs', 'publishMock', 'unpublishMock',
    'getMockServerResponses', 'createMockServerResponse',
    'getMockServerResponse', 'updateMockServerResponse',
    'deleteMockServerResponse'
  ],
  'Tags': ['getTagEntities'],
  'Users': ['getAuthenticatedUser'],
  'Core Utilities': [
    'buildAxiosConfig', 'executeRequest', 'validateId', 'validateUid',
    'buildQueryString', 'getContentFS', 'POSTMAN_API_KEY_ENV_VAR', 'utils'
  ]
};

const MODULE_DESCRIPTIONS = {
  'Collections': 'Manage Postman collections, folders, and comments',
  'Requests': 'Manage requests within collections',
  'Responses': 'Manage responses for requests',
  'Workspaces': 'Manage Postman workspaces',
  'Specs': 'Manage API specifications (OpenAPI, AsyncAPI)',
  'Environments': 'Manage Postman environments and variables',
  'Mocks': 'Manage mock servers and server responses',
  'Tags': 'Query and manage tags across resources',
  'Users': 'Get authenticated user information',
  'Core Utilities': 'Internal utility functions used across modules'
};

function extractFunctionDescription(content, functionName) {
  // Find the function heading and extract its description
  const regex = new RegExp(`## ${functionName}\\n\\n([^\\n]+)`, 'm');
  const match = content.match(regex);
  if (match && match[1]) {
    // Clean up the description - remove "Postman API endpoint" line if present
    let desc = match[1].trim();
    // If next line starts with "Postman API endpoint", grab just the first line
    const lines = desc.split('\n');
    return lines[0];
  }
  return '';
}

/**
 * Normalize example IDs to use appropriate DEFAULT constants based on parameter context
 * This ensures consistency and semantic accuracy across all code examples
 */
function normalizeExampleIds(content) {
  // Split content into sections (code blocks vs text)
  const sections = [];
  let currentIndex = 0;
  const codeBlockRegex = /```[\s\S]*?```/g;
  let match;
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before code block
    if (match.index > currentIndex) {
      sections.push({ type: 'text', content: content.substring(currentIndex, match.index) });
    }
    // Add code block
    sections.push({ type: 'code', content: match[0] });
    currentIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (currentIndex < content.length) {
    sections.push({ type: 'text', content: content.substring(currentIndex) });
  }
  
  // Process only code blocks
  for (const section of sections) {
    if (section.type === 'code') {
      section.content = normalizeCodeBlock(section.content);
    }
  }
  
  // Reconstruct content
  return sections.map(s => s.content).join('');
}

/**
 * Normalize IDs in a single code block based on context
 */
function normalizeCodeBlock(codeBlock) {
  // First, handle multi-line function calls as a whole
  let normalized = codeBlock;
  
  // Handle folder comment functions - two parameters across multiple lines
  normalized = normalized.replace(
    /\b(getFolderComments|createFolderComment|updateFolderComment|deleteFolderComment)\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]/gis,
    (match, funcName, param1, param2) => {
      const quote1 = match.match(/\(\s*(['"])([^'"]+)\1/)[1];
      const quote2 = match.match(/,\s*(['"])([^'"]+)\1/)[1];
      return `${funcName}(${quote1}${DEFAULT_COLLECTION_UID}${quote1}, ${quote2}${DEFAULT_FOLDER_UID}${quote2}`;
    }
  );
  
  // Handle syncCollectionWithSpec - two parameters
  normalized = normalized.replace(
    /\b(syncCollectionWithSpec)\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]/gis,
    (match, funcName, param1, param2) => {
      const quote1 = match.match(/\(\s*(['"])([^'"]+)\1/)[1];
      const quote2 = match.match(/,\s*(['"])([^'"]+)\1/)[1];
      return `${funcName}(${quote1}${DEFAULT_COLLECTION_UID}${quote1}, ${quote2}${DEFAULT_SPEC_ID}${quote2}`;
    }
  );
  
  // Now process line-by-line for other patterns
  const lines = normalized.split('\n');
  const normalizedLines = lines.map(line => normalizeLine(line));
  return normalizedLines.join('\n');
}

/**
 * Normalize IDs in a single line based on parameter context
 */
function normalizeLine(line) {
  // Skip non-JavaScript lines (like ```, ///, etc.)
  if (line.trim().startsWith('```') || line.trim().startsWith('///')) {
    return line;
  }

  let normalizedLine = line;

  // Map parameter names/contexts to their appropriate DEFAULT constants
  // Process in specific order: UIDs first, then IDs, then function-specific patterns
  
  // Step 1: Handle UID-requiring functions (these need UIDs in their first parameters)
  const uidFunctionMappings = [
    // Collection comment functions - first param is collectionUid
    { pattern: /\b(getCollectionComments|createCollectionComment|updateCollectionComment|deleteCollectionComment|getCollectionTags|updateCollectionTags|createCollectionGeneration|getCollectionGenerations|getCollectionTaskStatus)\s*\(\s*['"]([^'"]+)['"]/gi, replacement: DEFAULT_COLLECTION_UID },
    // Folder comment functions - first param is collectionUid, second is folderUid
    // Handle in two steps to preserve formatting
    { pattern: /\b(getFolderComments|createFolderComment|updateFolderComment|deleteFolderComment)\s*\(\s*['"]([^'"]+)['"]/gi, replacement: DEFAULT_COLLECTION_UID },
    // Request comment functions - first param is collectionUid, second is requestUid  
    { pattern: /\b(getRequestComments|createRequestComment|updateRequestComment|deleteRequestComment)\s*\(\s*['"]([^'"]+)['"]/gi, replacement: DEFAULT_COLLECTION_UID },
    // Response comment functions - first param is collectionUid, second is responseUid
    { pattern: /\b(getResponseComments|createResponseComment|updateResponseComment|deleteResponseComment)\s*\(\s*['"]([^'"]+)['"]/gi, replacement: DEFAULT_COLLECTION_UID },
    // syncCollectionWithSpec - first param is collectionUid
    { pattern: /\b(syncCollectionWithSpec)\s*\(\s*['"]([^'"]+)['"]/gi, replacement: DEFAULT_COLLECTION_UID },
  ];

  for (const mapping of uidFunctionMappings) {
    // Single parameter replacement
    normalizedLine = normalizedLine.replace(mapping.pattern, (match, funcName, oldValue) => {
      const quote = match.includes('"') ? '"' : "'";
      return `${funcName}(${quote}${mapping.replacement}${quote}`;
    });
  }

  // Step 2: Handle ID-requiring functions (regular UUIDs)
  const idFunctionMappings = [
    { pattern: /\b(getWorkspace|updateWorkspace|deleteWorkspace|getWorkspaceTags|updateWorkspaceTags)\s*\(\s*['"]([^'"]+)['"]/gi, replacement: DEFAULT_ID },
    { pattern: /\b(getSpec|modifySpec|deleteSpec|getSpecDefinition|getSpecFiles|getSpecTaskStatus|getSpecGenerations|syncSpecWithCollection)\s*\(\s*['"]([^'"]+)['"]/gi, replacement: DEFAULT_SPEC_ID },
    { pattern: /\b(createSpecFile|getSpecFile|modifySpecFile|deleteSpecFile|createSpecGeneration)\s*\(\s*['"]([^'"]+)['"]/gi, replacement: DEFAULT_SPEC_ID },
    { pattern: /\b(getEnvironment|modifyEnvironment|deleteEnvironment)\s*\(\s*['"]([^'"]+)['"]/gi, replacement: DEFAULT_ENVIRONMENT_ID },
    { pattern: /\b(getMock|updateMock|deleteMock|getMockCallLogs|publishMock|unpublishMock|getMockServerResponses|createMockServerResponse|getMockServerResponse|updateMockServerResponse|deleteMockServerResponse)\s*\(\s*['"]([^'"]+)['"]/gi, replacement: DEFAULT_ID },
    { pattern: /\b(createFolder|getFolder|updateFolder|deleteFolder)\s*\(\s*['"]([^'"]+)['"]/gi, replacement: DEFAULT_COLLECTION_ID },
    { pattern: /\b(getSpecs|createSpec)\s*\(\s*['"]([^'"]+)['"]/gi, replacement: DEFAULT_ID },
  ];

  for (const mapping of idFunctionMappings) {
    normalizedLine = normalizedLine.replace(mapping.pattern, (match, funcName, oldValue) => {
      const quote = match.includes('"') ? '"' : "'";
      return `${funcName}(${quote}${mapping.replacement}${quote}`;
    });
  }

  // Step 3: Handle object property patterns
  const propertyMappings = [
    { pattern: /\b(collectionId):\s*['"]([^'"]+)['"]/gi, replacement: DEFAULT_COLLECTION_ID },
    { pattern: /\b(folderId):\s*['"]([^'"]+)['"]/gi, replacement: DEFAULT_FOLDER_ID },
    { pattern: /\b(specId):\s*['"]([^'"]+)['"]/gi, replacement: DEFAULT_SPEC_ID },
    { pattern: /\b(environmentId|envId):\s*['"]([^'"]+)['"]/gi, replacement: DEFAULT_ENVIRONMENT_ID },
    { pattern: /\b(commentId):\s*['"]([^'"]+)['"]/gi, replacement: DEFAULT_COMMENT_ID },
    { pattern: /\b(userId):\s*['"]([^'"]+)['"]/gi, replacement: DEFAULT_USER_ID },
    { pattern: /\b(workspaceId|workspace):\s*['"]([^'"]+)['"]/gi, replacement: DEFAULT_ID },
    { pattern: /\b(mockId|mock):\s*['"]([^'"]+)['"]/gi, replacement: DEFAULT_ID },
    { pattern: /\b(requestId|request):\s*['"]([^'"]+)['"]/gi, replacement: DEFAULT_ID },
    { pattern: /\b(responseId|response):\s*['"]([^'"]+)['"]/gi, replacement: DEFAULT_ID },
    { pattern: /\b(taskId):\s*['"]([^'"]+)['"]/gi, replacement: DEFAULT_ID },
    { pattern: /\b(serverResponseId):\s*['"]([^'"]+)['"]/gi, replacement: DEFAULT_ID },
    { pattern: /\b(collectionUid):\s*['"]([^'"]+)['"]/gi, replacement: DEFAULT_COLLECTION_UID },
    { pattern: /\b(folderUid):\s*['"]([^'"]+)['"]/gi, replacement: DEFAULT_FOLDER_UID },
  ];

  for (const mapping of propertyMappings) {
    normalizedLine = normalizedLine.replace(mapping.pattern, (match, propName, oldValue) => {
      const quote = match.includes('"') ? '"' : "'";
      return `${propName}: ${quote}${mapping.replacement}${quote}`;
    });
  }

  // Step 4: Catch-all for remaining placeholder patterns
  // Replace generic placeholder IDs like 'workspace-id-123', 'spec-id-789', etc.
  const placeholderPatterns = [
    { pattern: /['"](workspace|collection|mock|request|response|tag|task|server-?response)-?id-?\d+['"]/gi, replacement: DEFAULT_ID },
    { pattern: /['"]folder-?id-?\d+['"]/gi, replacement: DEFAULT_FOLDER_ID },
    { pattern: /['"]spec-?id-?\d+['"]/gi, replacement: DEFAULT_SPEC_ID },
    { pattern: /['"](?:environment|env)-?id-?\d+['"]/gi, replacement: DEFAULT_ENVIRONMENT_ID },
    { pattern: /['"]comment-?id-?\d+['"]/gi, replacement: DEFAULT_COMMENT_ID },
    { pattern: /['"]user-?id-?\d+['"]/gi, replacement: DEFAULT_USER_ID },
    // UIDs with placeholder format
    { pattern: /['"]\d{8}-[a-z]+-[a-z]+-\d+['"]/gi, replacement: DEFAULT_COLLECTION_UID },
  ];

  for (const mapping of placeholderPatterns) {
    normalizedLine = normalizedLine.replace(mapping.pattern, (match) => {
      const quote = match[0];
      return `${quote}${mapping.replacement}${quote}`;
    });
  }

  // Step 5: Catch-all for standalone UUIDs (only replace if not already a known constant)
  const genericUuidPattern = /['"]([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})['"]/gi;
  normalizedLine = normalizedLine.replace(genericUuidPattern, (match, uuid) => {
    const knownIds = [
      DEFAULT_COLLECTION_ID, DEFAULT_FOLDER_ID, DEFAULT_SPEC_ID,
      DEFAULT_ENVIRONMENT_ID, DEFAULT_COMMENT_ID, DEFAULT_ID
    ];
    if (knownIds.includes(uuid)) {
      return match;
    }
    const quote = match[0];
    return `${quote}${DEFAULT_ID}${quote}`;
  });

  // Step 6: Catch-all for standalone UIDs (only replace if not already a known constant)
  const genericUidPattern = /['"](\d{7,8}-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})['"]/gi;
  normalizedLine = normalizedLine.replace(genericUidPattern, (match, uid) => {
    const knownUids = [
      DEFAULT_COLLECTION_UID, DEFAULT_FOLDER_UID, DEFAULT_SPEC_UID,
      DEFAULT_ENVIRONMENT_UID, DEFAULT_COMMENT_UID, DEFAULT_UID
    ];
    if (knownUids.includes(uid)) {
      return match;
    }
    const quote = match[0];
    return `${quote}${DEFAULT_COLLECTION_UID}${quote}`;
  });

  return normalizedLine;
}

function formatApiDocs() {
  const inputFile = path.join(__dirname, '../docs/API-REFERENCE.md');
  const outputFile = inputFile; // Overwrite the same file
  
  if (!fs.existsSync(inputFile)) {
    console.error('Error: API-REFERENCE.md not found. Run npm run docs:md first.');
    process.exit(1);
  }

  let content = fs.readFileSync(inputFile, 'utf8');
  
  // Extract the TOC section
  const tocMatch = content.match(/### Table of Contents\n\n([\s\S]*?)\n\n##/);
  if (!tocMatch) {
    console.error('Error: Could not find Table of Contents');
    process.exit(1);
  }

  const tocContent = tocMatch[1];
  const tocLines = tocContent.split('\n');
  
  // Parse TOC entries
  const tocEntries = [];
  for (const line of tocLines) {
    const match = line.match(/^\*\s+\[([^\]]+)\]\[(\d+)\]/);
    if (match) {
      tocEntries.push({ name: match[1], ref: match[2], indent: 0 });
    } else {
      const subMatch = line.match(/^\s+\*\s+\[([^\]]+)\]\[(\d+)\]/);
      if (subMatch) {
        tocEntries.push({ name: subMatch[1], ref: subMatch[2], indent: 1 });
      }
    }
  }

  // Build new TOC organized by module with tables
  let newToc = '### Table of Contents\n\n';
  newToc += '*Quick Links: ';
  newToc += Object.keys(MODULES).map(mod => `[${mod}](#${mod.toLowerCase().replace(/\s+/g, '-')})`).join(' • ');
  newToc += '*\n\n---\n\n';

  let currentRef = 1;
  const refMapping = {}; // Map old refs to new refs

  for (const [moduleName, functions] of Object.entries(MODULES)) {
    // Add collapsible section for module
    newToc += `<details open>\n`;
    newToc += `<summary><strong>${moduleName}</strong> - ${MODULE_DESCRIPTIONS[moduleName]}</summary>\n\n`;
    
    // Start table
    newToc += `| Function | Description |\n`;
    newToc += `|----------|-------------|\n`;
    
    // Sort functions alphabetically (case-insensitive)
    const sortedFunctions = [...functions].sort((a, b) => 
      a.toLowerCase().localeCompare(b.toLowerCase())
    );
    
    // Add functions in this module as table rows
    for (const funcName of sortedFunctions) {
      const entry = tocEntries.find(e => e.name === funcName && e.indent === 0);
      if (entry) {
        const newRef = currentRef++;
        refMapping[entry.ref] = newRef;
        
        // Extract description from the actual function documentation
        const description = extractFunctionDescription(content, funcName);
        
        newToc += `| [${entry.name}][${newRef}] | ${description} |\n`;
        
        // Still need to process sub-entries for ref mapping
        const funcIndex = tocEntries.indexOf(entry);
        for (let i = funcIndex + 1; i < tocEntries.length; i++) {
          const subEntry = tocEntries[i];
          if (subEntry.indent === 0) break; // Next function
          
          const subRef = currentRef++;
          refMapping[subEntry.ref] = subRef;
        }
      }
    }
    
    newToc += '\n</details>\n\n';
  }

  // Replace TOC in content
  content = content.replace(
    /### Table of Contents\n\n[\s\S]*?\n\n##/,
    newToc + '\n##'
  );

  // Update all reference links [1], [2], etc. to use new refs
  // Use a two-pass approach to avoid conflicts:
  // Pass 1: Replace with temporary placeholders
  for (const [oldRef, newRef] of Object.entries(refMapping)) {
    content = content.replace(
      new RegExp(`^\\[${oldRef}\\]:`, 'gm'),
      `[__TEMP_REF_${newRef}__]:`
    );
  }
  
  // Pass 2: Replace placeholders with actual new refs
  for (const newRef of Object.values(refMapping)) {
    content = content.replace(
      new RegExp(`^\\[__TEMP_REF_${newRef}__\\]:`, 'gm'),
      `[${newRef}]:`
    );
  }

  // Add header with badges
  const header = `# Postman SDK API Reference

[![npm version](https://img.shields.io/npm/v/@bidnessforb/postman-sdk.svg)](https://www.npmjs.com/package/@bidnessforb/postman-sdk)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

> **Auto-generated API documentation** from JSDoc comments. Last generated: ${new Date().toISOString().split('T')[0]}

## Overview

This SDK provides a comprehensive interface to the Postman API, supporting all major resource types including collections, workspaces, API specifications, environments, mock servers, and more.

**Installation:**
\`\`\`bash
npm install @bidnessforb/postman-sdk
\`\`\`

**Quick Start:**
\`\`\`javascript
const postman = require('@bidnessforb/postman-sdk');

// Get all collections in a workspace
const collections = await postman.collections.getCollections('workspace-id');

// Create a new workspace
const workspace = await postman.workspaces.createWorkspace('My Workspace', 'team');
\`\`\`

**Important Notes:**
- All functions return Promises that resolve to Axios responses
- API key must be set via \`POSTMAN_API_KEY_POSTMAN\` environment variable
- Comment endpoints require UIDs in format: \`userId-objectId\`
- Refer to [Postman API Documentation](https://learning.postman.com/docs/developer/postman-api/intro-api/) for detailed API behavior

---

`;

  content = content.replace(/<!-- Generated by documentation\.js.*?-->\n\n/, header);

  // Normalize example IDs to use DEFAULT_ID and DEFAULT_UID
  content = normalizeExampleIds(content);

  // Write back
  fs.writeFileSync(outputFile, content, 'utf8');
  console.log('✓ API documentation formatted successfully!');
  console.log(`  File: ${outputFile}`);
  console.log(`  Size: ${(content.length / 1024).toFixed(2)} KB`);
  console.log('\n  Example IDs normalized to context-specific DEFAULT constants:');
  console.log(`    - collectionId/UID: ${DEFAULT_COLLECTION_ID} / ${DEFAULT_COLLECTION_UID}`);
  console.log(`    - folderId/UID: ${DEFAULT_FOLDER_ID} / ${DEFAULT_FOLDER_UID}`);
  console.log(`    - specId/UID: ${DEFAULT_SPEC_ID} / ${DEFAULT_SPEC_UID}`);
  console.log(`    - environmentId/UID: ${DEFAULT_ENVIRONMENT_ID} / ${DEFAULT_ENVIRONMENT_UID}`);
  console.log(`    - commentId/UID: ${DEFAULT_COMMENT_ID} / ${DEFAULT_COMMENT_UID}`);
  console.log(`    - userId: ${DEFAULT_USER_ID}`);
  console.log(`    - workspaceId/mockId/taskId: ${DEFAULT_ID}`);
}

formatApiDocs();

