const {
  getEnvironments,
  createEnvironment,
  getEnvironment,
  modifyEnvironment,
  deleteEnvironment
} = require('../environment');
const { getAuthenticatedUser } = require('../../users/user');
const { loadTestIds, saveTestIds, DEFAULT_UID, DEFAULT_ID } = require('../../__tests__/test-helpers');

describe('Environments Functional Tests', () => {
  let persistedIds;
  let userId;

  beforeAll(async () => {
    persistedIds = loadTestIds();
    const userResult = await getAuthenticatedUser();
    userId = userResult.data.user.id;
  }, 10000);

  test('1. getEnvironments - should get all environments', async () => {
    const result = await getEnvironments();

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('environments');
    expect(Array.isArray(result.data.environments)).toBe(true);

    console.log(`Retrieved ${result.data.environments.length} environments`);
  }, 10000);

  test('2. getEnvironments - should get environments in workspace', async () => {
    const workspaceId = persistedIds.workspace.id;
    const result = await getEnvironments(workspaceId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('environments');
    expect(Array.isArray(result.data.environments)).toBe(true);

    console.log(`Retrieved ${result.data.environments.length} environments in workspace ${workspaceId}`);
  }, 10000);

  test('3. createEnvironment - should create a new environment', async () => {
    const environmentName = `Test Environment ${Date.now()}`;
    const environmentData = {
      name: environmentName,
      values: [
        {
          key: 'base_url',
          value: 'https://api.example.com',
          type: 'default',
          enabled: true
        },
        {
          key: 'api_key',
          value: 'test_secret_key',
          type: 'secret',
          enabled: true
        }
      ]
    };

    const result = await createEnvironment(environmentData, persistedIds.workspace.id);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('environment');
    expect(result.data.environment).toHaveProperty('id');
    expect(result.data.environment.name).toBe(environmentName);

    // Persist the environment ID for subsequent tests
    persistedIds.environment = {
      id: result.data.environment.id,
      uid: result.data.environment.uid,
      name: environmentName,
      workspaceId: persistedIds.workspace.id,
      createdAt: new Date().toISOString()
    };
    saveTestIds(persistedIds);

    console.log(`Created environment: ${environmentName}`);
    console.log(`Environment ID: ${result.data.environment.id}`);
  }, 10000);

  test('4. getEnvironment - should get a single environment', async () => {
    const environmentId = persistedIds.environment.id;
    const result = await getEnvironment(environmentId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('environment');
    expect(result.data.environment.id).toBe(environmentId);
    expect(result.data.environment).toHaveProperty('name');
    expect(result.data.environment).toHaveProperty('values');
    expect(Array.isArray(result.data.environment.values)).toBe(true);

    console.log(`Retrieved environment: ${result.data.environment.name}`);
    console.log(`Environment has ${result.data.environment.values.length} values`);
  }, 10000);

  test('4. getEnvironment - should error on non-existent environment', async () => {
    const environmentId = DEFAULT_ID;
    let result;
    try {

      
      result = await getEnvironment(environmentId);
    }
    catch (error) {
      result = error;
      expect(result.status).toBe(404);
      expect(result.response.data).toHaveProperty('error');
      expect(result.response.data.error.name).toBe('instanceNotFoundError');
      console.log(`Error on non-existent environment: ${result.response.data.error.message}`);
      return;
    }
    
  // Fail the test if we did not get expected 404
  fail('Expected getEnvironment to throw 404, but it did not');

    

    
  }, 10000);

  test('5. modifyEnvironment - should update environment name', async () => {
    const environmentId = persistedIds.environment.id;
    const updatedName = `Updated Environment ${Date.now()}`;
    const patchOperations = [
      {
        op: 'replace',
        path: '/name',
        value: updatedName
      }
    ];

    const result = await modifyEnvironment(environmentId, patchOperations);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('environment');
    expect(result.data.environment.id).toBe(environmentId);
    expect(result.data.environment.name).toBe(updatedName);

    // Update persisted name
    persistedIds.environment.name = updatedName;
    saveTestIds(persistedIds);

    console.log(`Updated environment name to: ${updatedName}`);
  }, 10000);

  test('6. modifyEnvironment - should add a new environment variable', async () => {
    const environmentId = persistedIds.environment.id;
    
    // First, get the current environment to know how many variables exist
    const currentEnv = await getEnvironment(environmentId);
    const currentValueCount = currentEnv.data.environment.values.length;
    
    // Add a new variable at the end
    const patchOperations = [
      {
        op: 'add',
        path: `/values/${currentValueCount}`,
        value: {
          key: 'test_variable',
          value: 'test_value',
          type: 'default',
          enabled: true
        }
      }
    ];

    const result = await modifyEnvironment(environmentId, patchOperations);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('environment');
    expect(result.data.environment.values).toEqual(expect.arrayContaining([
      expect.objectContaining({
        key: 'test_variable',
        value: 'test_value'
      })
    ]));

    console.log(`Added new variable, environment now has ${result.data.environment.values.length} values`);
  }, 10000);

  test('6a. modifyEnvironment - should replace an environment variable value', async () => {
    const environmentId = persistedIds.environment.id;
    
    // Get current environment to find the variable we just added
    const currentEnv = await getEnvironment(environmentId);
    const testVarIndex = currentEnv.data.environment.values.findIndex(v => v.key === 'test_variable');
    
    if (testVarIndex === -1) {
      console.log('Skipping test - test_variable not found');
      return;
    }
    
    // Replace the variable's value
    const patchOperations = [
      {
        op: 'replace',
        path: `/values/${testVarIndex}/value`,
        value: 'updated_test_value'
      }
    ];

    const result = await modifyEnvironment(environmentId, patchOperations);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('environment');
    expect(result.data.environment.values[testVarIndex].value).toBe('updated_test_value');

    console.log(`Updated variable value at index ${testVarIndex}`);
  }, 10000);

  test('6b. modifyEnvironment - should remove an environment variable', async () => {
    const environmentId = persistedIds.environment.id;
    
    // Get current environment to find the variable we added
    const currentEnv = await getEnvironment(environmentId);
    const testVarIndex = currentEnv.data.environment.values.findIndex(v => v.key === 'test_variable');
    
    if (testVarIndex === -1) {
      console.log('Skipping test - test_variable not found');
      return;
    }
    
    const initialCount = currentEnv.data.environment.values.length;
    
    // Remove the variable
    const patchOperations = [
      {
        op: 'remove',
        path: `/values/${testVarIndex}`
      }
    ];

    const result = await modifyEnvironment(environmentId, patchOperations);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('environment');
    expect(result.data.environment.values.length).toBe(initialCount - 1);
    
    // Verify the variable is gone
    const hasTestVar = result.data.environment.values.some(v => v.key === 'test_variable');
    expect(hasTestVar).toBe(false);

    console.log(`Removed variable, environment now has ${result.data.environment.values.length} values`);
  }, 10000);

  test('7. deleteEnvironment - should delete an environment', async () => {
    // Create a temporary environment to delete
    const tempEnvironmentName = `Temp Environment ${Date.now()}`;
    const createResult = await createEnvironment(
      { name: tempEnvironmentName },
      persistedIds.workspace.id
    );

    expect(createResult.status).toBe(200);
    const tempEnvironmentId = createResult.data.environment.id;
    console.log(`Created temporary environment ${tempEnvironmentId} for deletion test`);

    // Delete the environment
    const deleteResult = await deleteEnvironment(tempEnvironmentId);

    expect(deleteResult.status).toBe(200);
    expect(deleteResult.data).toHaveProperty('environment');
    expect(deleteResult.data.environment.id).toBe(tempEnvironmentId);

    console.log(`Successfully deleted environment ${tempEnvironmentId}`);

    // Verify the environment is deleted
    await expect(getEnvironment(tempEnvironmentId)).rejects.toThrow();
  }, 10000);
});

