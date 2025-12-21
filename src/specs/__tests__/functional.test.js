const { 
  getSpecs, 
  getSpec, 
  createSpec, 
  modifySpec, 
  deleteSpec, 
  getSpecDefinition,
  getSpecFiles,
  createSpecFile,
  getSpecFile,
  modifySpecFile,
  deleteSpecFile
} = require('../index');
const { POSTMAN_API_KEY_ENV_VAR } = require('../../core/config');
const { isValidYaml, parseYaml, parseContent, toBeValidYaml } = require('./test-utils');
const { loadTestIds, saveTestIds, clearTestIds } = require('../../__tests__/test-helpers');

// Add custom JEST matcher for YAML validation
expect.extend({
  toBeValidYaml
});

const DEFAULT_WORKSPACE_ID = '066b3200-1739-4b19-bd52-71700f3a4545';

describe('specs functional tests', () => {
  let testSpecId;
  let testSpecName;
  let testWorkspaceId; // Workspace to use for tests
  let rootFileName = 'openapi.yaml';
  let additionalFileName = 'components/schemas.json';
  let persistedIds = {};

  beforeAll(() => {
    if (!process.env[POSTMAN_API_KEY_ENV_VAR]) {
      throw new Error(`${POSTMAN_API_KEY_ENV_VAR} environment variable is required for functional tests`);
    }

    // Load persisted IDs and use workspaceId if available
    persistedIds = loadTestIds();
    testWorkspaceId = persistedIds.workspaceId || DEFAULT_WORKSPACE_ID;
    testSpecId = persistedIds.specId || null;
    
    if (persistedIds.workspaceId) {
      console.log(`Using persisted workspace ID: ${testWorkspaceId}`);
    } else {
      console.log(`Using default workspace ID: ${testWorkspaceId}`);
    }
    
    if (testSpecId) {
      console.log(`Found persisted spec ID: ${testSpecId}`);
    }
  });

  afterAll(async () => {
    // NO CLEANUP - Spec persists indefinitely for reuse across test runs
    if (testSpecId) {
      console.log(`Spec ${testSpecId} will persist for future test runs`);
      console.log(`Delete manually if needed using: await deleteSpec('${testSpecId}')`);
    }
  });

  test('1. createSpec - should create an OpenAPI 3.0 spec', async () => {
    // Skip creation if we have a persisted spec ID
    if (testSpecId) {
      console.log('Reusing persisted spec ID, skipping creation');
      return;
    }

    testSpecName = `SDK Functional Test Spec ${Date.now()}`;
    const files = [
      {
        path: rootFileName,
        content: `openapi: 3.0.0
info:
  title: Functional Test API
  version: 1.0.0
paths:
  /test:
    get:
      summary: Test endpoint
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: './components/schemas.json#/TestSchema'`
      }
    ];

    const result = await createSpec(testWorkspaceId, testSpecName, 'OPENAPI:3.0', files);

    expect(result.status).toBe(201);
    expect(result.data).toHaveProperty('id');
    expect(result.data).toHaveProperty('name');
    expect(result.data.name).toBe(testSpecName);
    expect(result.data.type).toBe('OPENAPI:3.0');

    // Save the spec ID for subsequent tests and persist to file
    testSpecId = result.data.id;
    persistedIds.specId = testSpecId;
    persistedIds.specName = testSpecName;
    if (!persistedIds.createdAt) {
      persistedIds.createdAt = new Date().toISOString();
    }
    saveTestIds(persistedIds);
    console.log(`Created and persisted spec ID: ${testSpecId}`);
  });

  test('2. getSpec - should retrieve the created spec by ID', async () => {
    const result = await getSpec(testSpecId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('id');
    expect(result.data).toHaveProperty('name');
    expect(result.data).toHaveProperty('type');
    expect(result.data.id).toBe(testSpecId);
    expect(result.data.name).toBe(testSpecName);
    expect(result.data.type).toBe('OPENAPI:3.0');
  });

  test('3. getSpecs - should retrieve specs from workspace', async () => {
    const result = await getSpecs(testWorkspaceId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('specs');
    expect(Array.isArray(result.data.specs)).toBe(true);
    
    // Verify our test spec is in the list
    const ourSpec = result.data.specs.find(s => s.id === testSpecId);
    expect(ourSpec).toBeDefined();
    expect(ourSpec.name).toBe(testSpecName);
  });

  test('4. getSpecDefinition - should retrieve the spec definition', async () => {
    const result = await getSpecDefinition(testSpecId);

    expect(result.status).toBe(200);
    const specDefinition = parseContent(result.data);
    
    expect(specDefinition).toHaveProperty('openapi');
    expect(specDefinition.openapi).toBe('3.0.0');
    expect(specDefinition).toHaveProperty('info');
    expect(specDefinition.info).toHaveProperty('title');
    expect(specDefinition.info.title).toBe('Functional Test API');
    expect(specDefinition).toHaveProperty('paths');
  });

  test('5. modifySpec - should update the spec name', async () => {
    const updatedName = `${testSpecName} (Updated)`;
    
    const result = await modifySpec(testSpecId, updatedName);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('id');
    expect(result.data).toHaveProperty('name');
    expect(result.data.id).toBe(testSpecId);
    expect(result.data.name).toBe(updatedName);

    // Update our tracked name
    testSpecName = updatedName;
  });

  test('6. getSpecFiles - should retrieve all files in the spec', async () => {
    const result = await getSpecFiles(testSpecId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('files');
    expect(Array.isArray(result.data.files)).toBe(true);
    expect(result.data.files.length).toBeGreaterThan(0);
    
    // Should have the root file
    const rootFile = result.data.files.find(f => f.path === rootFileName);
    expect(rootFile).toBeDefined();
    expect(rootFile.type).toBe('ROOT');
  });

  test('7. createSpecFile - should create a new file in the spec', async () => {
    const content = JSON.stringify({
      TestSchema: {
        type: 'object',
        required: ['id', 'name'],
        properties: {
          id: { 
            type: 'string',
            description: 'Unique identifier'
          },
          name: { 
            type: 'string',
            description: 'Name of the test object'
          }
        }
      }
    });

    const result = await createSpecFile(testSpecId, additionalFileName, content);

    expect(result.status).toBe(201);
    expect(result.data).toHaveProperty('id');
    expect(result.data).toHaveProperty('path');
    expect(result.data.path).toBe(additionalFileName);
    expect(result.data.type).toBe('DEFAULT');
  });

  test('8. getSpecFile - should retrieve the created spec file', async () => {
    const result = await getSpecFile(testSpecId, additionalFileName);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('id');
    expect(result.data).toHaveProperty('path');
    expect(result.data.path).toBe(additionalFileName);
    expect(result.data).toHaveProperty('content');
    expect(result.data.type).toBe('DEFAULT');

    // Verify content
    const content = JSON.parse(result.data.content);
    expect(content).toHaveProperty('TestSchema');
    expect(content.TestSchema.type).toBe('object');
  });

  test('9. modifySpecFile - should update the spec file content', async () => {
    const updatedContent = JSON.stringify({
      TestSchema: {
        type: 'object',
        required: ['id', 'name', 'status'],
        properties: {
          id: { 
            type: 'string',
            description: 'Unique identifier'
          },
          name: { 
            type: 'string',
            description: 'Name of the test object'
          },
          status: {
            type: 'string',
            enum: ['active', 'inactive'],
            description: 'Status of the object'
          }
        }
      }
    });

    const result = await modifySpecFile(testSpecId, additionalFileName, { content: updatedContent });

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('id');
    expect(result.data.path).toBe(additionalFileName);

    // Verify the content was updated
    const getResult = await getSpecFile(testSpecId, additionalFileName);
    const content = JSON.parse(getResult.data.content);
    expect(content.TestSchema.properties).toHaveProperty('status');
    expect(content.TestSchema.required).toContain('status');
  });

  test('10. deleteSpecFile - should delete the spec file', async () => {
    const result = await deleteSpecFile(testSpecId, additionalFileName);

    expect(result.status).toBe(204);

    // Verify the file is deleted
    await expect(
      getSpecFile(testSpecId, additionalFileName)
    ).rejects.toThrow();
  });

  // Error handling tests
  describe('error handling', () => {
    test('getSpec - should throw error for non-existent spec ID', async () => {
      await expect(
        getSpec('00000000-0000-0000-0000-000000000000')
      ).rejects.toThrow();
    });

    test('getSpecs - should throw error for invalid workspace ID', async () => {
      await expect(
        getSpecs('invalid-workspace-id')
      ).rejects.toThrow();
    });

    test('createSpec - should throw error for invalid workspace ID', async () => {
      const files = [
        { path: 'openapi.yaml', content: 'openapi: 3.0.0' }
      ];

      await expect(
        createSpec('00000000-0000-0000-0000-000000000000', 'Test', 'OPENAPI:3.0', files)
      ).rejects.toThrow();
    });

    test('modifySpec - should throw error for non-existent spec ID', async () => {
      await expect(
        modifySpec('00000000-0000-0000-0000-000000000000', 'New Name')
      ).rejects.toThrow();
    });

    test('deleteSpec - should throw error for non-existent spec ID', async () => {
      await expect(
        deleteSpec('00000000-0000-0000-0000-000000000000')
      ).rejects.toThrow();
    });

    test('getSpecDefinition - should throw error for non-existent spec ID', async () => {
      await expect(
        getSpecDefinition('00000000-0000-0000-0000-000000000000')
      ).rejects.toThrow();
    });

    test('getSpecFiles - should throw error for non-existent spec ID', async () => {
      await expect(
        getSpecFiles('00000000-0000-0000-0000-000000000000')
      ).rejects.toThrow();
    });

    test('createSpecFile - should throw error for invalid spec ID', async () => {
      await expect(
        createSpecFile('00000000-0000-0000-0000-000000000000', 'test.json', '{}')
      ).rejects.toThrow();
    });

    test('getSpecFile - should throw error for non-existent file', async () => {
      await expect(
        getSpecFile(testSpecId, 'non-existent-file.json')
      ).rejects.toThrow();
    });

    test('modifySpecFile - should throw error for non-existent file', async () => {
      await expect(
        modifySpecFile(testSpecId, 'non-existent.json', { content: '{}' })
      ).rejects.toThrow();
    });

    test('deleteSpecFile - should throw error for non-existent file', async () => {
      await expect(
        deleteSpecFile(testSpecId, 'non-existent-file.json')
      ).rejects.toThrow();
    });

    test('deleteSpecFile - should throw error for non-existent spec ID', async () => {
      await expect(
        deleteSpecFile('00000000-0000-0000-0000-000000000000', 'test.json')
      ).rejects.toThrow();
    });
  });
});

