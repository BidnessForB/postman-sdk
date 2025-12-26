#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

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
    'getCollectionTaskStatus'
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
    'getMockCallLogs', 'createMockPublish', 'deleteMockUnpublish',
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

  // Build new TOC organized by module
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
    
    // Add functions in this module
    for (const funcName of functions) {
      const entry = tocEntries.find(e => e.name === funcName && e.indent === 0);
      if (entry) {
        const newRef = currentRef++;
        refMapping[entry.ref] = newRef;
        newToc += `*   [${entry.name}][${newRef}]\n`;
        
        // Find sub-entries (Parameters, Examples, etc.)
        const funcIndex = tocEntries.indexOf(entry);
        for (let i = funcIndex + 1; i < tocEntries.length; i++) {
          const subEntry = tocEntries[i];
          if (subEntry.indent === 0) break; // Next function
          
          const subRef = currentRef++;
          refMapping[subEntry.ref] = subRef;
          newToc += `    *   [${subEntry.name}][${subRef}]\n`;
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
  for (const [oldRef, newRef] of Object.entries(refMapping)) {
    // Update anchor definitions at the bottom
    content = content.replace(
      new RegExp(`^\\[${oldRef}\\]:`, 'gm'),
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

  // Write back
  fs.writeFileSync(outputFile, content, 'utf8');
  console.log('✓ API documentation formatted successfully!');
  console.log(`  File: ${outputFile}`);
  console.log(`  Size: ${(content.length / 1024).toFixed(2)} KB`);
}

formatApiDocs();

