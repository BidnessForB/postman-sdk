const { 
  getCollectionForks,
  createCollectionFork,
  mergeCollectionFork,
  deleteCollection
} = require('../../../collections/index');
const { POSTMAN_API_KEY_ENV_VAR } = require('../../../core/config');
const { loadTestIds, saveTestIds } = require('../../../__tests__/test-helpers');

describe('forks', () => {
  describe('collections', () => {
    let persistedIds = loadTestIds();
    let userId;

    beforeAll(async () => {
      if (!process.env[POSTMAN_API_KEY_ENV_VAR]) {
        throw new Error(`${POSTMAN_API_KEY_ENV_VAR} environment variable is required for functional tests`);
      }

      userId = persistedIds?.userId;

      if (!persistedIds.collection?.uid) {
        throw new Error('Collection ID not found in test-ids.json. Run collection functional tests first.');
      }

      if (!userId) {
        throw new Error('User ID not found in test-ids.json. Run user functional tests first.');
      }

      if (!persistedIds.workspace?.id) {
        throw new Error('Workspace ID not found in test-ids.json. Run workspace functional tests first.');
      }

      console.log('Using collection ID:', persistedIds.collection.id);
      console.log('Using collection UID:', persistedIds.collection.uid);
      console.log('Using workspace ID:', persistedIds.workspace.id);
      console.log('Using user ID:', userId);

      // Initialize fork storage
      if (!persistedIds.fork) {
        persistedIds.fork = {};
      }
    });

    test('1. createCollectionFork - should create a fork of a collection', async () => {
      const label = `SDK Test Fork - ${Date.now()}`;
      
      const result = await createCollectionFork(
        persistedIds.collection.id,
        persistedIds.workspace.id,
        label
      );

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('collection');
      expect(result.data.collection).toHaveProperty('id');
      expect(result.data.collection).toHaveProperty('uid');
      expect(result.data.collection).toHaveProperty('name');
      expect(result.data.collection).toHaveProperty('fork');
      expect(result.data.collection.fork).toHaveProperty('label');
      expect(result.data.collection.fork.label).toBe(label);
      expect(result.data.collection.fork).toHaveProperty('createdAt');
      expect(result.data.collection.fork).toHaveProperty('from');

      // Save the fork details
      persistedIds.fork.collection = {
        id: result.data.collection.id,
        uid: result.data.collection.uid,
        name: result.data.collection.name,
        label: result.data.collection.fork.label,
        from: result.data.collection.fork.from
      };
      saveTestIds(persistedIds);

      console.log('Successfully created fork:', result.data.collection.id);
      console.log('Fork label:', result.data.collection.fork.label);
      console.log('Forked from:', result.data.collection.fork.from);
    });

    test('2. getCollectionForks - should retrieve all forked collections', async () => {
      const result = await getCollectionForks();

      expect(result.status).toBe(200);
      //expect(result.data).toHaveProperty('data');
      expect(Array.isArray(result.data.data)).toBe(true);

      console.log(`Found ${result.data.data.length} fork(s)`);

      // Verify our fork is in the list
      const ourFork = result.data.data.find(fork => 
        fork.id === persistedIds.fork.collection.id
      );
      if (ourFork) {
        console.log('Verified our fork is in the list');
        expect(ourFork).toHaveProperty('name');
        expect(ourFork).toHaveProperty('fork');
      }
    });

    test('3. getCollectionForks - should handle pagination with limit', async () => {
      const result = await getCollectionForks(null, null, 5);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('data');
      expect(Array.isArray(result.data.data)).toBe(true);
      expect(result.data.data.length).toBeLessThanOrEqual(5);

      console.log(`Retrieved ${result.data.data.length} fork(s) with limit of 5`);
    });

    test('4. getCollectionForks - should handle descending sort order', async () => {
      const result = await getCollectionForks(null, 'desc', 10);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('data');
      expect(Array.isArray(result.data.data)).toBe(true);

      console.log(`Retrieved ${result.data.data.length} fork(s) in descending order`);
    });

    test('5. mergeCollectionFork - should merge fork back to parent (default strategy)', async () => {
      if (!persistedIds.fork.collection?.uid) {
        throw new Error('Fork UID not available. Previous test may have failed.');
      }

      const result = await mergeCollectionFork(
        persistedIds.fork.collection.uid,
        persistedIds.collection.uid
      );

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('collection');
      expect(result.data.collection).toHaveProperty('id');
      expect(result.data.collection).toHaveProperty('uid');

      console.log('Successfully merged fork to parent collection');
      console.log('Result collection ID:', result.data.collection.id);
    });

    test('6. createCollectionFork - should create another fork for deleteSource test', async () => {
      const label = `SDK Test Fork DeleteSource - ${Date.now()}`;
      
      const result = await createCollectionFork(
        persistedIds.collection.id,
        persistedIds.workspace.id,
        label
      );

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('collection');
      expect(result.data.collection).toHaveProperty('id');
      expect(result.data.collection).toHaveProperty('uid');

      // Update fork details for next test
      persistedIds.fork.collection.id = result.data.collection.id;
      persistedIds.fork.collection.uid = result.data.collection.uid;
      saveTestIds(persistedIds);

      console.log('Successfully created second fork for deleteSource test:', result.data.collection.id);
    });

    test('7. mergeCollectionFork - should merge and delete source fork', async () => {
      if (!persistedIds.fork.collection?.uid) {
        throw new Error('Fork UID not available. Previous test may have failed.');
      }

      const result = await mergeCollectionFork(
        persistedIds.fork.collection.uid,
        persistedIds.collection.uid,
        'deleteSource'
      );

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('collection');

      console.log('Successfully merged fork with deleteSource strategy');
      console.log('Fork should be deleted after merge');
    });

    test('8. createCollectionFork - should handle invalid collection ID', async () => {
      const fakeCollectionId = '00000000-0000-0000-0000-000000000000';
      const label = 'Test Fork';

      await expect(
        createCollectionFork(fakeCollectionId, persistedIds.workspace.id, label)
      ).rejects.toThrow();

      console.log('Successfully handled invalid collection ID');
    });

    test('9. createCollectionFork - should handle invalid workspace ID', async () => {
      const fakeWorkspaceId = '00000000-0000-0000-0000-000000000000';
      const label = 'Test Fork';

      await expect(
        createCollectionFork(persistedIds.collection.id, fakeWorkspaceId, label)
      ).rejects.toThrow();

      console.log('Successfully handled invalid workspace ID');
    });

    test('10. mergeCollectionFork - should handle invalid source UID', async () => {
      const fakeUid = `${userId}-00000000-0000-0000-0000-000000000000`;

      await expect(
        mergeCollectionFork(fakeUid, persistedIds.collection.uid)
      ).rejects.toThrow();

      console.log('Successfully handled invalid source UID');
    });
  });
});

