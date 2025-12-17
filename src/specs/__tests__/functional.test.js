const { getSpecs, getSpec, createSpec, modifySpec, deleteSpec } = require('../index');
const { POSTMAN_API_KEY_ENV_VAR } = require('../../core/config');

const DEFAULT_WORKSPACE_ID = '066b3200-1739-4b19-bd52-71700f3a4545';
const DEFAULT_SPEC_ID = '550f281f-ee6a-4860-aef3-6d9fdd7ca405';

describe('specs functional tests', () => {
  beforeAll(() => {
    if (!process.env[POSTMAN_API_KEY_ENV_VAR]) {
      throw new Error(`${POSTMAN_API_KEY_ENV_VAR} environment variable is required for functional tests`);
    }
  });

  describe('getSpecs', () => {
    test('should retrieve specs from workspace', async () => {
      const result = await getSpecs(DEFAULT_WORKSPACE_ID);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('specs');
      expect(Array.isArray(result.data.specs)).toBe(true);
    });

    test('should handle pagination with limit parameter', async () => {
      const result = await getSpecs(DEFAULT_WORKSPACE_ID, null, 5);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('specs');
      expect(Array.isArray(result.data.specs)).toBe(true);
    });

    test('should throw error for invalid workspace ID', async () => {
      // SDK should throw the error from the API
      await expect(
        getSpecs('invalid-workspace-id')
      ).rejects.toThrow();
    });
  });

  describe('getSpec', () => {
    test('should retrieve a specific spec by ID', async () => {
      const result = await getSpec(DEFAULT_SPEC_ID);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('id');
      expect(result.data).toHaveProperty('name');
      expect(result.data).toHaveProperty('type');
      expect(result.data.id).toBe(DEFAULT_SPEC_ID);
    });

    test('should throw error for non-existent spec ID', async () => {
      // SDK should throw the error from the API (404 Not Found)
      await expect(
        getSpec('00000000-0000-0000-0000-000000000000')
      ).rejects.toThrow();
    });
  });

  describe('createSpec', () => {
    test('should create an OpenAPI 3.0 spec', async () => {
      const specName = `SDK Test Spec ${Date.now()}`;
      const files = [
        {
          path: 'openapi.yaml',
          content: `openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0
paths:
  /test:
    get:
      summary: Test endpoint
      responses:
        '200':
          description: Success`
        }
      ];

      const result = await createSpec(DEFAULT_WORKSPACE_ID, specName, 'OPENAPI:3.0', files);

      expect(result.status).toBe(201);
      expect(result.data).toHaveProperty('id');
      expect(result.data).toHaveProperty('name');
      expect(result.data.name).toBe(specName);
    });

    test('should throw error for invalid workspace ID', async () => {
      const files = [
        { path: 'openapi.yaml', content: 'openapi: 3.0.0' }
      ];

      // SDK should throw the error from the API (404 Not Found)
      await expect(
        createSpec('00000000-0000-0000-0000-000000000000', 'Test', 'OPENAPI:3.0', files)
      ).rejects.toThrow();
    });
  });

  describe('modifySpec', () => {
    test('should update spec name', async () => {
      const newName = `Updated Spec Name ${Date.now()}`;
      
      const result = await modifySpec(DEFAULT_SPEC_ID, newName);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('id');
      expect(result.data).toHaveProperty('name');
      expect(result.data.name).toBe(newName);
    });

    test('should throw error for non-existent spec ID', async () => {
      // SDK should throw the error from the API (404 Not Found)
      await expect(
        modifySpec('00000000-0000-0000-0000-000000000000', 'New Name')
      ).rejects.toThrow();
    });
  });

  describe('deleteSpec', () => {
    test('should delete a spec', async () => {
      // First create a spec to delete
      const specName = `SDK Test Spec to Delete ${Date.now()}`;
      const files = [
        {
          path: 'openapi.yaml',
          content: `openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0
paths:
  /test:
    get:
      summary: Test endpoint
      responses:
        '200':
          description: Success`
        }
      ];

      const createResult = await createSpec(DEFAULT_WORKSPACE_ID, specName, 'OPENAPI:3.0', files);
      const specId = createResult.data.id;

      // Delete the spec
      const deleteResult = await deleteSpec(specId);

      expect(deleteResult.status).toBe(204);
    });

    test('should throw error for non-existent spec ID', async () => {
      // SDK should throw the error from the API (404 Not Found)
      await expect(
        deleteSpec('00000000-0000-0000-0000-000000000000')
      ).rejects.toThrow();
    });
  });
});

