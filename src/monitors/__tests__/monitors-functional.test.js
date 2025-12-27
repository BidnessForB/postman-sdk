const {
  getMonitors,
  createMonitor,
  getMonitor,
  updateMonitor,
  deleteMonitor,
  runMonitor
} = require('../monitor');

const {
  loadTestIds,
  saveTestIds,
  getTestWorkspaceId,
  getUserId,
  initPersistedIds
} = require('../../__tests__/test-helpers');

describe('monitors functional tests (sequential flow)', () => {
  let testWorkspaceId;
  let persistedIds = {};
  let userId;
  let collectionUid;

  beforeAll(async () => {
    await initPersistedIds(['monitor']);
    persistedIds = loadTestIds();
    testWorkspaceId = await getTestWorkspaceId();
    userId = await getUserId();
    console.log('Using persisted userId:', userId);

    // Use persisted collection for monitor tests
    if (persistedIds.collection && persistedIds.collection.uid) {
      collectionUid = persistedIds.collection.uid;
      console.log('Using persisted collection UID:', collectionUid);
    } else {
    // Create a test collection and persist its data for monitor tests
    const collectionName = `SDK Test Monitor Collection ${Date.now()}`;
    const collectionData = {
      collection: {
        info: {
          name: collectionName,
          schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
        },
        item: [
          {
            name: 'Sample Request',
            request: {
              url: 'https://postman-echo.com/get',
              method: 'GET'
            }
          }
        ]
      }
    };

    // Use dynamically-imported SDK createCollection if available in helpers, else require directly
    let createCollection;
    try {
      // Try to use the test-helpers export (if available)
      createCollection = require('../../collections/collection').createCollection;
    } catch {
      createCollection = null;
    }
    if (!createCollection) {
      // fallback: require SDK if possible, or throw error
      try {
        createCollection = require('../../collections/collection').createCollection;
      } catch (e) {
        throw new Error('createCollection function is required for test setup.');
      }
    }
    // Actually create the collection in the workspace and store its IDs
    const collectionResult = await createCollection(collectionData.collection, testWorkspaceId);
    expect(collectionResult.status).toBe(200);
    expect(collectionResult.data).toHaveProperty('collection');
    expect(collectionResult.data.collection).toHaveProperty('id');
    expect(collectionResult.data.collection).toHaveProperty('uid');
    persistedIds.collection = {
      id: collectionResult.data.collection.id,
      uid: collectionResult.data.collection.uid,
      name: collectionName,
      createdAt: new Date().toISOString()
    };
    saveTestIds(persistedIds);
    collectionUid = persistedIds.collection.uid;
    console.log('Created and persisted test collection UID:', collectionUid);
    }
  });

  afterAll(async () => {
    // Cleanup is handled in delete test
  });

  test('1. createMonitor - should create a monitor in workspace', async () => {
    const monitorName = `SDK Test Monitor ${Date.now()}`;
    const monitorData = {
      name: monitorName,
      collection: collectionUid,
      active: true,
      schedule: {
        cron: '0 0 * * *',
        timezone: 'UTC'
      },
      options: {
        followRedirects: true,
        requestTimeout: 3000,
        strictSSL: true
      }
    };

    const result = await createMonitor(monitorData, testWorkspaceId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('monitor');
    expect(result.data.monitor).toHaveProperty('id');
    expect(result.data.monitor).toHaveProperty('uid');
    expect(result.data.monitor.name).toBe(monitorName);
    expect(result.data.monitor.active).toBe(true);

    persistedIds.monitor = {
      ...persistedIds.monitor,
      id: result.data.monitor.id,
      uid: result.data.monitor.uid,
      name: monitorName,
      createdAt: new Date().toISOString()
    };
    saveTestIds(persistedIds);
    console.log(`Created and persisted monitor ID: ${persistedIds.monitor.id}`);
  }, 10000);

  test('2. getMonitors - should retrieve monitors from workspace', async () => {
    const result = await getMonitors(testWorkspaceId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('monitors');
    expect(Array.isArray(result.data.monitors)).toBe(true);

    // Verify our test monitor is in the list
    if (persistedIds.monitor && persistedIds.monitor.id) {
      const monitorId = persistedIds.monitor.id;
      const foundMonitor = result.data.monitors.find(m => m.id === monitorId);
      expect(foundMonitor).toBeDefined();
      expect(foundMonitor.name).toBe(persistedIds.monitor.name);
    }
  }, 10000);

  test('3. getMonitors - should retrieve monitors without workspace filter', async () => {
    const result = await getMonitors();

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('monitors');
    expect(Array.isArray(result.data.monitors)).toBe(true);
  }, 10000);

  test('4. getMonitors - should filter monitors by active status', async () => {
    const result = await getMonitors(testWorkspaceId, true);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('monitors');
    expect(Array.isArray(result.data.monitors)).toBe(true);

    // All returned monitors should be active
    if (result.data.monitors.length > 0) {
      result.data.monitors.forEach(monitor => {
        expect(monitor.active).toBe(true);
      });
    }
  }, 10000);

  test('5. getMonitors - should filter monitors by collection', async () => {
    const result = await getMonitors(testWorkspaceId, null, null, collectionUid);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('monitors');
    expect(Array.isArray(result.data.monitors)).toBe(true);

    // All returned monitors should be for the specified collection
    if (result.data.monitors.length > 0) {
      result.data.monitors.forEach(monitor => {
        expect(monitor.collectionUid).toBe(collectionUid);
      });
    }
  }, 10000);

  test('6. getMonitors - should support pagination with limit', async () => {
    const result = await getMonitors(testWorkspaceId, null, null, null, null, null, 5);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('monitors');
    expect(Array.isArray(result.data.monitors)).toBe(true);
    expect(result.data.monitors.length).toBeLessThanOrEqual(5);
  }, 10000);

  test('7. getMonitor - should retrieve monitor by ID', async () => {
    const monitorId = persistedIds.monitor.id;
    expect(monitorId).toBeDefined();

    const result = await getMonitor(monitorId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('monitor');
    expect(result.data.monitor.id).toBe(monitorId);
    expect(result.data.monitor.name).toBe(persistedIds.monitor.name);
    expect(result.data.monitor).toHaveProperty('schedule');
    expect(result.data.monitor).toHaveProperty('options');
    expect(result.data.monitor.collectionUid).toBe(collectionUid);
  }, 10000);

  test('8. updateMonitor - should update monitor name', async () => {
    const monitorId = persistedIds.monitor.id;
    expect(monitorId).toBeDefined();

    const updatedName = `${persistedIds.monitor.name} - Updated`;
    const monitorData = {
      name: updatedName
    };

    const result = await updateMonitor(monitorId, monitorData);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('monitor');
    expect(result.data.monitor.id).toBe(monitorId);
    expect(result.data.monitor.name).toBe(updatedName);

    // Update persisted name
    persistedIds.monitor = {
      ...persistedIds.monitor,
      name: updatedName
    };
    saveTestIds(persistedIds);
  }, 10000);

  test('9. getMonitor - should verify name update', async () => {
    const monitorId = persistedIds.monitor.id;
    expect(monitorId).toBeDefined();

    const result = await getMonitor(monitorId);

    expect(result.status).toBe(200);
    expect(result.data.monitor.name).toBe(persistedIds.monitor.name);
  }, 10000);

  test('10. updateMonitor - should update monitor schedule', async () => {
    const monitorId = persistedIds.monitor.id;
    expect(monitorId).toBeDefined();

    const monitorData = {
      schedule: {
        cron: '0 */6 * * *',
        timezone: 'America/New_York'
      }
    };

    const result = await updateMonitor(monitorId, monitorData);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('monitor');

    // Verify the schedule was updated
    const getResult = await getMonitor(monitorId);
    expect(getResult.data.monitor.schedule.cron).toBe('0 */6 * * *');
    expect(getResult.data.monitor.schedule.timezone).toBe('America/New_York');
  }, 10000);

  test('11. updateMonitor - should make monitor inactive', async () => {
    const monitorId = persistedIds.monitor.id;
    expect(monitorId).toBeDefined();

    const monitorData = {
      active: false
    };

    const result = await updateMonitor(monitorId, monitorData);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('monitor');
    expect(result.data.monitor.active).toBe(false);

    // Verify the monitor is inactive
    const getResult = await getMonitor(monitorId);
    expect(getResult.data.monitor.active).toBe(false);
  }, 10000);

  test('12. updateMonitor - should make monitor active again', async () => {
    const monitorId = persistedIds.monitor.id;
    expect(monitorId).toBeDefined();

    const monitorData = {
      active: true
    };

    const result = await updateMonitor(monitorId, monitorData);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('monitor');
    expect(result.data.monitor.active).toBe(true);
  }, 10000);

  test('13. runMonitor - should run a monitor asynchronously', async () => {
    const monitorId = persistedIds.monitor.id;
    expect(monitorId).toBeDefined();

    const result = await runMonitor(monitorId, true);

    expect([200, 202]).toContain(result.status);
    expect(result.data).toHaveProperty('run');
    expect(result.data.run).toHaveProperty('info');
    expect(result.data.run.info.monitorId).toBe(monitorId);
    expect(result.data.run.info).toHaveProperty('jobId');

    console.log('Monitor run started with job ID:', result.data.run.info.jobId);
  }, 30000);

  test('14. deleteMonitor - should delete a monitor', async () => {
    // Create a temporary monitor specifically for deletion testing
    const tempMonitorData = {
      name: `Temp Monitor for Deletion ${Date.now()}`,
      collection: collectionUid,
      active: true,
      schedule: {
        cron: '0 0 * * *',
        timezone: 'UTC'
      }
    };

    // Create the temporary monitor
    const createResult = await createMonitor(tempMonitorData, testWorkspaceId);
    expect(createResult.status).toBe(200);
    expect(createResult.data).toHaveProperty('monitor');
    const tempMonitorId = createResult.data.monitor.id;
    expect(tempMonitorId).toBeDefined();

    console.log(`Created temporary monitor ${tempMonitorId} for deletion testing`);

    // Delete the monitor
    const deleteResult = await deleteMonitor(tempMonitorId);
    expect(deleteResult.status).toBe(200);
    expect(deleteResult.data).toHaveProperty('monitor');
    expect(deleteResult.data.monitor.id).toBe(tempMonitorId);

    console.log(`Successfully deleted monitor ${tempMonitorId}`);

    // Verify the monitor is deleted by attempting to get it (should fail)
    await expect(getMonitor(tempMonitorId)).rejects.toThrow();
    console.log('Verified monitor no longer exists');
  }, 10000);

  describe('error handling', () => {
    test('should handle invalid workspace ID gracefully', async () => {
      const fakeWorkspaceId = '00000000-0000-0000-0000-000000000000';

      // Per spec: invalid workspace ID returns HTTP 404
      await expect(getMonitors(fakeWorkspaceId)).rejects.toThrow();
    }, 10000);

    test('should handle createMonitor with invalid collection UID', async () => {
      const invalidMonitorData = {
        name: 'Test Monitor',
        collection: '00000000-0000-0000-0000-000000000000',
        schedule: {
          cron: '0 0 * * *',
          timezone: 'UTC'
        }
      };

      await expect(createMonitor(invalidMonitorData, testWorkspaceId)).rejects.toThrow();
    }, 10000);

    test('should handle getting non-existent monitor', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await expect(getMonitor(fakeId)).rejects.toThrow();
    }, 10000);

    test('should handle updating non-existent monitor', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const monitorData = {
        name: 'Test'
      };
      await expect(updateMonitor(fakeId, monitorData)).rejects.toThrow();
    }, 10000);

    test('should handle deleting non-existent monitor', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await expect(deleteMonitor(fakeId)).rejects.toThrow();
    }, 10000);

    test('should handle running non-existent monitor', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await expect(runMonitor(fakeId)).rejects.toThrow();
    }, 10000);
  });
});

