const { 
  getEnvironmentForks,
  createEnvironmentFork,
  mergeEnvironmentFork,
  pullEnvironmentChanges,
  deleteEnvironment
} = require('../../environments/environment');

const { loadTestIds,
   saveTestIds,
   initPersistedIds,
   getTestWorkspaceId,
   getUserId
    } = require('../../__tests__/test-helpers');
  describe('Forks Environments Functional Tests', () => {
    let persistedIds;
    let userId;
    let workspaceId;

      

    beforeAll(async () => {
      userId = getUserId();
      persistedIds = loadTestIds();
      workspaceId = await getTestWorkspaceId();
      if(!workspaceId) {
        throw new Error('Workspace ID not found in test-ids.json. Run workspace functional tests first.');
      }
      
      if (!persistedIds.environment) {
        const { createEnvironment } = require('../../environments/environment');
        const environmentName = `SDK Test Environment ${Date.now()}`;
        const envResult = await createEnvironment(
          {
            name: environmentName,
            values: [
              { key: 'var1', value: 'value1', enabled: true }
            ]
          },
          workspaceId
        );
        if (envResult.status !== 200) {
          throw new Error('Failed to create environment for fork tests');
        }
        persistedIds.environment = {
          id: envResult.data.environment.id,
          uid: envResult.data.environment.uid,
          name: environmentName,
          createdAt: new Date().toISOString()
        };
        saveTestIds(persistedIds);

      }
      
      
    });

    test('1. createEnvironmentFork - should create a fork of an environment', async () => {
      // If no environment ID is persisted, create a new environment and save its info to test-ids
      
      await initPersistedIds(['fork.environment']);
      const forkName = `SDK Test Env Fork - ${Date.now()}`;
      
      const result = await createEnvironmentFork(
        persistedIds.environment.uid,
        persistedIds.workspace.id,
        forkName
      );

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('environment');
      expect(result.data.environment).toHaveProperty('uid');
      expect(result.data.environment).toHaveProperty('name');
      expect(result.data.environment).toHaveProperty('forkName');
      expect(result.data.environment.forkName).toBe(forkName);

      // Save the fork details
      persistedIds.fork.environment = {
        uid: result.data.environment.uid,
        name: result.data.environment.name,
        forkName: result.data.environment.forkName
      };
      saveTestIds(persistedIds);

      console.log('Successfully created environment fork:', result.data.environment.uid);
      console.log('Fork name:', result.data.environment.forkName);
    });

    test('2. getEnvironmentForks - should retrieve all forked environments', async () => {
      const result = await getEnvironmentForks(persistedIds.environment.uid);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('data');
      expect(Array.isArray(result.data.data)).toBe(true);
      expect(result.data).toHaveProperty('meta');

      console.log(`Found ${result.data.data.length} environment fork(s)`);

      // Verify our fork is in the list
      const ourFork = result.data.data.find(fork => 
        fork.forkId === persistedIds.fork.environment.uid
      );
      if (ourFork) {
        console.log('Verified our fork is in the list');
        expect(ourFork).toHaveProperty('forkName');
        expect(ourFork).toHaveProperty('forkId');
        expect(ourFork).toHaveProperty('createdBy');
        expect(ourFork).toHaveProperty('createdAt');
        expect(ourFork).toHaveProperty('updatedAt');
      }
    });

    test('3. getEnvironmentForks - should handle pagination with limit', async () => {
      const result = await getEnvironmentForks(persistedIds.environment.uid, null, null, 5);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('data');
      expect(Array.isArray(result.data.data)).toBe(true);
      expect(result.data.data.length).toBeLessThanOrEqual(5);

      console.log(`Retrieved ${result.data.data.length} fork(s) with limit of 5`);
    });

    test('4. getEnvironmentForks - should handle descending sort order', async () => {
      const result = await getEnvironmentForks(persistedIds.environment.uid, null, 'desc', 10);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('data');
      expect(Array.isArray(result.data.data)).toBe(true);

      console.log(`Retrieved ${result.data.data.length} fork(s) in descending order`);
    });

    test('5. getEnvironmentForks - should handle sort by createdAt', async () => {
      const result = await getEnvironmentForks(
        persistedIds.environment.uid, 
        null, 
        'asc', 
        10, 
        'createdAt'
      );

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('data');
      expect(Array.isArray(result.data.data)).toBe(true);

      console.log(`Retrieved ${result.data.data.length} fork(s) sorted by createdAt`);
    });

    test.skip('6. pullEnvironmentChanges - should pull changes from parent to fork', async () => {
      //Does not work with the current API?
      if (!persistedIds.fork.environment?.uid) {
        throw new Error('Fork UID not available. Previous test may have failed.');
      }
      const data = {
        source: persistedIds.environment.uid
      };

      const result = await pullEnvironmentChanges(persistedIds.fork.environment.uid, data);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('environment');
      expect(result.data.environment).toHaveProperty('uid');

      console.log('Successfully pulled changes from parent to fork');
      console.log('Result environment UID:', result.data.environment.uid);
    });

    test.skip('7. mergeEnvironmentFork - should merge fork back to parent', async () => {
      //Does not work with the current API?
      if (!persistedIds.fork.environment?.uid) {
        throw new Error('Fork UID not available. Previous test may have failed.');
      }

      const result = await mergeEnvironmentFork(persistedIds.fork.environment.uid);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('environment');
      expect(result.data.environment).toHaveProperty('uid');

      console.log('Successfully merged fork to parent environment');
      console.log('Result environment UID:', result.data.environment.uid);
    });

    test('8. cleanup - delete the forked environment', async () => {
      if (!persistedIds.fork.environment?.uid) {
        console.log('No fork to clean up');
        return;
      }

      try {
        const result = await deleteEnvironment(persistedIds.fork.environment.uid);
        expect(result.status).toBe(200);
        console.log('Successfully deleted forked environment');
        
        // Clear fork data
        delete persistedIds.fork.environment;
        saveTestIds(persistedIds);
      } catch (error) {
        // Fork might have been deleted by merge, which is okay
        console.log('Fork may have already been deleted:', error.message);
      }
    });

    test('9. createEnvironmentFork - should handle invalid environment UID', async () => {
      const fakeUid = `${userId}-00000000-0000-0000-0000-000000000000`;
      const forkName = 'Test Fork';

      await expect(
        createEnvironmentFork(fakeUid, persistedIds.workspace.id, forkName)
      ).rejects.toThrow();

      console.log('Successfully handled invalid environment UID');
    });

    test('10. createEnvironmentFork - should handle invalid workspace ID', async () => {
      const fakeWorkspaceId = '00000000-0000-0000-0000-000000000000';
      const forkName = 'Test Fork';

      await expect(
        createEnvironmentFork(persistedIds.environment.uid, fakeWorkspaceId, forkName)
      ).rejects.toThrow();

      console.log('Successfully handled invalid workspace ID');
    });

    test('11. mergeEnvironmentFork - should handle invalid fork UID', async () => {
      const fakeUid = `${userId}-00000000-0000-0000-0000-000000000000`;

      await expect(
        mergeEnvironmentFork(fakeUid)
      ).rejects.toThrow();

      console.log('Successfully handled invalid fork UID');
    });

    test('12. pullEnvironmentChanges - should handle invalid fork UID', async () => {
      const fakeUid = `${userId}-00000000-0000-0000-0000-000000000000`;

      await expect(
        pullEnvironmentChanges(fakeUid)
      ).rejects.toThrow();

      console.log('Successfully handled invalid fork UID for pull');
    });
  });

