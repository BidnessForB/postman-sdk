/**
 * Unit tests for main SDK entry point
 */

const sdk = require('../index');

describe('Postman SDK - Main Entry Point', () => {
  test('should export collections module', () => {
    expect(sdk).toHaveProperty('collections');
    expect(typeof sdk.collections).toBe('object');
  });

  test('should export requests module', () => {
    expect(sdk).toHaveProperty('requests');
    expect(typeof sdk.requests).toBe('object');
  });

  test('should export responses module', () => {
    expect(sdk).toHaveProperty('responses');
    expect(typeof sdk.responses).toBe('object');
  });

  test('should export workspaces module', () => {
    expect(sdk).toHaveProperty('workspaces');
    expect(typeof sdk.workspaces).toBe('object');
  });

  test('should export specs module', () => {
    expect(sdk).toHaveProperty('specs');
    expect(typeof sdk.specs).toBe('object');
  });

  test('should export environments module', () => {
    expect(sdk).toHaveProperty('environments');
    expect(typeof sdk.environments).toBe('object');
  });

  test('should export tags module', () => {
    expect(sdk).toHaveProperty('tags');
    expect(typeof sdk.tags).toBe('object');
  });

  test('should export users module', () => {
    expect(sdk).toHaveProperty('users');
    expect(typeof sdk.users).toBe('object');
  });

  test('should export mocks module', () => {
    expect(sdk).toHaveProperty('mocks');
    expect(typeof sdk.mocks).toBe('object');
  });

  test('should export exactly 9 modules', () => {
    const expectedModules = [
      'collections',
      'requests',
      'responses',
      'workspaces',
      'specs',
      'environments',
      'tags',
      'users',
      'mocks'
    ];
    const exportedKeys = Object.keys(sdk);
    expect(exportedKeys).toHaveLength(expectedModules.length);
    expectedModules.forEach(module => {
      expect(exportedKeys).toContain(module);
    });
  });

  test('collections module should have expected functions', () => {
    expect(sdk.collections).toHaveProperty('getCollections');
    expect(sdk.collections).toHaveProperty('createCollection');
    expect(sdk.collections).toHaveProperty('getCollection');
    expect(sdk.collections).toHaveProperty('updateCollection');
    expect(sdk.collections).toHaveProperty('modifyCollection');
    expect(sdk.collections).toHaveProperty('deleteCollection');
  });

  test('specs module should have expected functions', () => {
    expect(sdk.specs).toHaveProperty('getSpecs');
    expect(sdk.specs).toHaveProperty('getSpec');
    expect(sdk.specs).toHaveProperty('createSpec');
    expect(sdk.specs).toHaveProperty('modifySpec');
    expect(sdk.specs).toHaveProperty('deleteSpec');
  });

  test('workspaces module should have expected functions', () => {
    expect(sdk.workspaces).toHaveProperty('getWorkspaces');
    expect(sdk.workspaces).toHaveProperty('getWorkspace');
    expect(sdk.workspaces).toHaveProperty('createWorkspace');
    expect(sdk.workspaces).toHaveProperty('updateWorkspace');
    expect(sdk.workspaces).toHaveProperty('deleteWorkspace');
  });

  test('users module should have expected functions', () => {
    expect(sdk.users).toHaveProperty('getAuthenticatedUser');
  });

  test('all exported modules should be non-null', () => {
    Object.values(sdk).forEach(module => {
      expect(module).not.toBeNull();
      expect(module).not.toBeUndefined();
    });
  });
});

