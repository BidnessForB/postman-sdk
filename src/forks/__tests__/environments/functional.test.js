const { POSTMAN_API_KEY_ENV_VAR } = require('../../../core/config');
const { loadTestIds, saveTestIds } = require('../../../__tests__/test-helpers');

describe('forks', () => {
  describe('environments', () => {
    let persistedIds = loadTestIds();

    beforeAll(async () => {
      if (!process.env[POSTMAN_API_KEY_ENV_VAR]) {
        throw new Error(`${POSTMAN_API_KEY_ENV_VAR} environment variable is required for functional tests`);
      }

      console.log('Environment fork tests - To be implemented');
    });

    test.todo('getEnvironmentForks - should retrieve all forked environments');
    test.todo('createEnvironmentFork - should create a fork of an environment');
    test.todo('mergeEnvironmentFork - should merge fork back to parent');
  });
});

