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
  deleteSpecFile,
  createSpecGeneration
} = require('../index');
const { POSTMAN_API_KEY_ENV_VAR } = require('../../core/config');
const { isValidYaml, parseYaml, parseContent, toBeValidYaml } = require('./test-utils');
const { loadTestIds, saveTestIds, clearTestIds } = require('../../__tests__/test-helpers');
const { loadSpecFixture, getAllSpecFixtures } = require('./fixtures-loader');

// Add custom JEST matcher for YAML validation
expect.extend({
  toBeValidYaml
});

const DEFAULT_WORKSPACE_ID = '066b3200-1739-4b19-bd52-71700f3a4545';

describe('specs functional tests', () => {
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
    testWorkspaceId = (persistedIds.workspace && persistedIds.workspace.id) || DEFAULT_WORKSPACE_ID;
    
    if (persistedIds.workspace && persistedIds.workspace.id) {
      console.log(`Using persisted workspace ID: ${testWorkspaceId}`);
    } else {
      console.log(`Using default workspace ID: ${testWorkspaceId}`);
    }
    
    if (persistedIds.spec && persistedIds.spec.id) {
      console.log(`Found persisted spec ID: ${persistedIds.spec.id}`);
    }
  });

  afterAll(async () => {
    // NO CLEANUP - Spec persists indefinitely for reuse across test runs
    if (persistedIds.spec && persistedIds.spec.id) {
      console.log(`Spec ${persistedIds.spec.id} will persist for future test runs`);
      console.log(`To delete manually, run: npx jest src/specs/__tests__/manual-cleanup.test.js`);
    }
  });

  test('1. createSpec - should create an OpenAPI 3.0 spec', async () => {
    

    // Load fixture content
    const fixture = loadSpecFixture('OPENAPI:3.0', 'yaml');
    const specName = `SDK Functional Test Spec ${Date.now()}`;
    
    const files = [
      {
        path: rootFileName,
        content: fixture.content
      }
    ];

    const result = await createSpec(testWorkspaceId, specName, 'OPENAPI:3.0', files);

    expect(result.status).toBe(201);
    expect(result.data).toHaveProperty('id');
    expect(result.data).toHaveProperty('name');
    expect(result.data.name).toBe(specName);
    expect(result.data.type).toBe('OPENAPI:3.0');

    // Save the spec ID for subsequent tests and persist to file
    persistedIds.spec = {
      ...persistedIds.spec,
      id: result.data.id,
      name: specName,
      createdAt: new Date().toISOString()
    };
    saveTestIds(persistedIds);
    console.log(`Created and persisted spec ID: ${persistedIds.spec.id}`);
  });

  // Comprehensive fixture-based tests for all spec types and formats
  describe('1a. createSpec with fixtures - comprehensive format tests', () => {
    const createdSpecIds = [];

    afterAll(async () => {
      // Clean up all specs created in this test suite
      console.log(`\nCleaning up ${createdSpecIds.length} test specs created from fixtures...`);
      for (const specId of createdSpecIds) {
        try {
          await deleteSpec(specId);
          console.log(`✓ Deleted spec: ${specId}`);
        } catch (error) {
          console.log(`✗ Failed to delete spec ${specId}:`, error.message);
        }
      }
    });

    // Test all spec types and formats
    const allFixtures = getAllSpecFixtures();
    
    allFixtures.forEach(({ specType, format, config }) => {
      test(`should create ${specType} spec in ${format.toUpperCase()} format`, async () => {
        const fixture = loadSpecFixture(specType, format);
        const specName = `${config.name} ${Date.now()}`;
        
        const files = [
          {
            path: fixture.path,
            content: fixture.content
          }
        ];

        const result = await createSpec(testWorkspaceId, specName, specType, files);

        expect(result.status).toBe(201);
        expect(result.data).toHaveProperty('id');
        expect(result.data).toHaveProperty('name');
        expect(result.data.name).toBe(specName);
        expect(result.data.type).toBe(specType);

        // Track for cleanup
        createdSpecIds.push(result.data.id);

        console.log(`✓ Created ${specType} ${format} spec: ${result.data.id}`);

        // Verify we can retrieve it
        const getResult = await getSpec(result.data.id);
        expect(getResult.status).toBe(200);
        expect(getResult.data.id).toBe(result.data.id);
        expect(getResult.data.type).toBe(specType);

        // Verify definition can be retrieved
        const defResult = await getSpecDefinition(result.data.id);
        expect(defResult.status).toBe(200);
        //expect(defResult.data).toHaveProperty('definition');

        // Parse and validate definition based on spec type
        const definition = parseContent(defResult.data);
        
        if (specType.startsWith('OPENAPI:2')) {
          expect(definition).toHaveProperty('swagger');
          expect(definition.swagger).toBe('2.0');
        } else if (specType.startsWith('OPENAPI:3.0')) {
          expect(definition).toHaveProperty('openapi');
          expect(definition.openapi).toBe('3.0.0');
        } else if (specType.startsWith('OPENAPI:3.1')) {
          expect(definition).toHaveProperty('openapi');
          expect(definition.openapi).toBe('3.1.0');
        } else if (specType.startsWith('ASYNCAPI')) {
          expect(definition).toHaveProperty('asyncapi');
          expect(definition.asyncapi).toBe('2.0.0');
        }

        expect(definition).toHaveProperty('info');
        expect(definition.info).toHaveProperty('title');
        expect(definition.info).toHaveProperty('version');
      });
    });
  });

  test('2. getSpec - should retrieve the created spec by ID', async () => {
    const specId = persistedIds.spec.id;
    const result = await getSpec(specId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('id');
    expect(result.data).toHaveProperty('name');
    expect(result.data).toHaveProperty('type');
    expect(result.data.id).toBe(specId);
    expect(result.data.name).toBe(persistedIds.spec.name);
    expect(result.data.type).toBe('OPENAPI:3.0');
  });

  test('3. getSpecs - should retrieve specs from workspace', async () => {
    const result = await getSpecs(testWorkspaceId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('specs');
    expect(Array.isArray(result.data.specs)).toBe(true);
    
    // Verify our test spec is in the list
    const specId = persistedIds.spec.id;
    const ourSpec = result.data.specs.find(s => s.id === specId);
    expect(ourSpec).toBeDefined();
    expect(ourSpec.name).toBe(persistedIds.spec.name);
  });

  test('4. getSpecDefinition - should retrieve the spec definition', async () => {
    const specId = persistedIds.spec.id;
    const result = await getSpecDefinition(specId);

    expect(result.status).toBe(200);
    const specDefinition = parseContent(result.data);
    
    expect(specDefinition).toHaveProperty('openapi');
    expect(specDefinition.openapi).toBe('3.0.0');
    expect(specDefinition).toHaveProperty('info');
    expect(specDefinition.info).toHaveProperty('title');
    expect(specDefinition.info.title).toBe('Example API'); // From OpenAPI 3.0 fixture
    expect(specDefinition).toHaveProperty('paths');
  });

  test('5. modifySpec - should update the spec name', async () => {
    const specId = persistedIds.spec.id;
    const updatedName = `${persistedIds.spec.name} (Updated)`;
    
    const result = await modifySpec(specId, updatedName);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('id');
    expect(result.data).toHaveProperty('name');
    expect(result.data.id).toBe(specId);
    expect(result.data.name).toBe(updatedName);

    // Update persisted name
    persistedIds.spec.name = updatedName;
    saveTestIds(persistedIds);
  });

  test('6. getSpecFiles - should retrieve all files in the spec', async () => {
    const specId = persistedIds.spec.id;
    const result = await getSpecFiles(specId);

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
    const specId = persistedIds.spec.id;
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

    const result = await createSpecFile(specId, additionalFileName, content);

    expect(result.status).toBe(201);
    expect(result.data).toHaveProperty('id');
    expect(result.data).toHaveProperty('path');
    expect(result.data.path).toBe(additionalFileName);
    expect(result.data.type).toBe('DEFAULT');
  });

  test('8. getSpecFile - should retrieve the created spec file', async () => {
    const specId = persistedIds.spec.id;
    const result = await getSpecFile(specId, additionalFileName);

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
    const specId = persistedIds.spec.id;
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

    const result = await modifySpecFile(specId, additionalFileName, { content: updatedContent });

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('id');
    expect(result.data.path).toBe(additionalFileName);

    // Verify the content was updated
    const getResult = await getSpecFile(specId, additionalFileName);
    const content = JSON.parse(getResult.data.content);
    expect(content.TestSchema.properties).toHaveProperty('status');
    expect(content.TestSchema.required).toContain('status');
  });

  test('10. deleteSpecFile - should delete the spec file', async () => {
    const specId = persistedIds.spec.id;
    const result = await deleteSpecFile(specId, additionalFileName);

    expect(result.status).toBe(204);

    // Verify the file is deleted
    await expect(
      getSpecFile(specId, additionalFileName)
    ).rejects.toThrow();
  });

  test('11. createSpecGeneration - should generate a collection from spec', async () => {
    const specId = persistedIds.spec.id;
    const collectionName = `Generated Collection ${Date.now()}`;
    const options = {
      requestNameSource: 'Fallback',
      folderStrategy: 'Paths',
      includeAuthInfoInExample: true
    };

    const result = await createSpecGeneration(specId, 'collection', collectionName, options);

    expect(result.status).toBe(202);
    expect(result.data).toHaveProperty('taskId');
    expect(result.data).toHaveProperty('url');
    expect(typeof result.data.taskId).toBe('string');
    expect(typeof result.data.url).toBe('string');
    expect(result.data.url).toContain(`/specs/${specId}/tasks/`);
    
    console.log(`Collection generation started with taskId: ${result.data.taskId}`);
    console.log(`Poll status at: ${result.data.url}`);
  });

  test('12. createSpecGeneration - should fail with minimal params (no options)', async () => {
    const specId = persistedIds.spec.id;
    // Test with no optional parameters (just spec ID and element type)
    await expect(
      createSpecGeneration(specId, 'collection')
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
      const specId = persistedIds.spec.id;
      await expect(
        getSpecFile(specId, 'non-existent-file.json')
      ).rejects.toThrow();
    });

    test('modifySpecFile - should throw error for non-existent file', async () => {
      const specId = persistedIds.spec.id;
      await expect(
        modifySpecFile(specId, 'non-existent.json', { content: '{}' })
      ).rejects.toThrow();
    });

    test('deleteSpecFile - should throw error for non-existent file', async () => {
      const specId = persistedIds.spec.id;
      await expect(
        deleteSpecFile(specId, 'non-existent-file.json')
      ).rejects.toThrow();
    });

    test('deleteSpecFile - should throw error for non-existent spec ID', async () => {
      await expect(
        deleteSpecFile('00000000-0000-0000-0000-000000000000', 'test.json')
      ).rejects.toThrow();
    });

    test('createSpecGeneration - should throw error for non-existent spec ID', async () => {
      await expect(
        createSpecGeneration('00000000-0000-0000-0000-000000000000', 'collection', 'Test')
      ).rejects.toThrow();
    });
  });
});

