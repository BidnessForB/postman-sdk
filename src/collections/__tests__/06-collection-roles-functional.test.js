const { 
  getCollectionRoles,
  modifyCollectionRoles
} = require('../collection');

const { 
  loadTestIds,
  getUserId
} = require('../../__tests__/test-helpers');

describe('collection roles functional tests', () => {
  let persistedIds 
  let userId;
  let collectionId;
  let sdkTestEditorGroup = null;
  let sdkTestViewerGroup = null;

  beforeAll(async () => {
    persistedIds = loadTestIds();
    userId = await getUserId();

    if (!persistedIds.collection || !persistedIds.collection.id) {
      throw new Error('Collection ID not found in test-ids.json. Run collection functional tests first.');
    }

    if (!userId) {
      throw new Error('User ID not found in test-ids.json. Run user functional tests first.');
    }

    collectionId = persistedIds.collection.id;
    console.log('Using collection ID:', collectionId);
    console.log('Using user ID:', userId);
    
    // Load persisted groups from test-ids.json
    if (persistedIds.group && Array.isArray(persistedIds.group)) {
      sdkTestEditorGroup = persistedIds.group.find(g => 
        g.name && g.name.toLowerCase() === 'sdk-test-editor'
      );
      sdkTestViewerGroup = persistedIds.group.find(g => 
        g.name && g.name.toLowerCase() === 'sdk-test-viewer'
      );

      if (sdkTestEditorGroup) {
        console.log(`Found sdk-test-editor group (ID: ${sdkTestEditorGroup.id})`);
      }
      if (sdkTestViewerGroup) {
        console.log(`Found sdk-test-viewer group (ID: ${sdkTestViewerGroup.id})`);
      }
      if (!sdkTestEditorGroup && !sdkTestViewerGroup) {
        console.log('Note: No sdk-test-editor or sdk-test-viewer groups found in test-ids.json');
        console.log('Group role tests will be skipped. Run groups functional tests first.');
      }
    } else {
      console.log('Note: No groups found in test-ids.json');
      console.log('Group role tests will be skipped. Run groups functional tests first.');
    }
  });

  test.skip('1. modifyCollectionRoles - should add sdk-test groups with appropriate roles', async () => {
    //endpoint doesn't appear to be working
    if (!sdkTestEditorGroup && !sdkTestViewerGroup) {
      console.log('Skipping: No sdk-test-editor or sdk-test-viewer groups found in test-ids.json');
      console.log('Run groups functional tests first to persist group data');
      return;
    }

    const groupValues = [];
    
    // Add sdk-test-editor as EDITOR
    if (sdkTestEditorGroup) {
      groupValues.push({ id: sdkTestEditorGroup.id, role: 'EDITOR' });
    }
    
    // Add sdk-test-viewer as VIEWER
    if (sdkTestViewerGroup) {
      groupValues.push({ id: sdkTestViewerGroup.id, role: 'VIEWER' });
    }

    const roles = [
      {
        op: 'update',
        path: '/group',
        value: groupValues
      }
    ];

    const result = await modifyCollectionRoles(collectionId, roles);

    // PATCH /roles returns 204 No Content on success
    expect(result.status).toBe(204);
    console.log('Successfully added sdk-test groups with roles (HTTP 204)');

    // Verify the change by getting roles again
    const verifyResult = await getCollectionRoles(collectionId);
    
    expect(verifyResult.data).toHaveProperty('group');
    expect(Array.isArray(verifyResult.data.group)).toBe(true);
    
    // Verify sdk-test-editor has EDITOR role
    if (sdkTestEditorGroup) {
      const editorGroup = verifyResult.data.group.find(g => g.id === sdkTestEditorGroup.id);
      expect(editorGroup).toBeDefined();
      expect(editorGroup.role).toBe('EDITOR');
      console.log(`✓ Verified sdk-test-editor (ID: ${sdkTestEditorGroup.id}) has EDITOR role`);
    }
    
    // Verify sdk-test-viewer has VIEWER role
    if (sdkTestViewerGroup) {
      const viewerGroup = verifyResult.data.group.find(g => g.id === sdkTestViewerGroup.id);
      expect(viewerGroup).toBeDefined();
      expect(viewerGroup.role).toBe('VIEWER');
      console.log(`✓ Verified sdk-test-viewer (ID: ${sdkTestViewerGroup.id}) has VIEWER role`);
    }
  }, 10000);

  test('2. getCollectionRoles - should get collection roles', async () => {
    const result = await getCollectionRoles(collectionId);

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('user');
    //Won't be any group or team roles in the beginning
    //expect(result.data).toHaveProperty('group');
    //expect(Array.isArray(result.data.group)).toBe(true);
    expect(result.data).toHaveProperty('team');
    expect(Array.isArray(result.data.user)).toBe(true);
    expect(Array.isArray(result.data.team)).toBe(true);

    // The creator should have a role in the collection
    console.log(`Collection has ${result.data.user.length} user role(s)`);
    //console.log(`Collection has ${result.data.group.length} group role(s)`);
    console.log(`Collection has ${result.data.team.length} team role(s)`);

    // Verify the current user is in the roles (as the creator)
    const currentUserRole = result.data.user.find(u => u.id === userId);
    if (currentUserRole) {
      expect(currentUserRole).toHaveProperty('role');
      expect(['VIEWER', 'EDITOR']).toContain(currentUserRole.role);
      console.log(`Current user (${userId}) has ${currentUserRole.role} role`);
    }
  }, 10000);

  test.skip('3. getCollectionRoles - should return consistent role structure', async () => {
    const result = await getCollectionRoles(collectionId);

    expect(result.status).toBe(200);

    // Verify each user role has required properties
    if (result.data.user.length > 0) {
      result.data.user.forEach(userRole => {
        expect(userRole).toHaveProperty('id');
        expect(userRole).toHaveProperty('role');
        expect(typeof userRole.id).toBe('number');
        expect(['VIEWER', 'EDITOR']).toContain(userRole.role);
      });
    }

    // Verify each group role has required properties
    /*
    if (result.data.group.length > 0) {
      result.data.group.forEach(groupRole => {
        expect(groupRole).toHaveProperty('id');
        expect(groupRole).toHaveProperty('role');
        expect(typeof groupRole.id).toBe('number');
        expect(['VIEWER', 'EDITOR']).toContain(groupRole.role);
      });
    }
      */

    // Verify each team role has required properties
    //is this broken? 
    /*
    if (result.data.team.length > 0) {
      result.data.team.forEach(teamRole => {
        expect(teamRole).toHaveProperty('role');
        expect(teamRole).toHaveProperty('id');
        expect(typeof teamRole.id).toBe('number');
        expect(['VIEWER', 'EDITOR']).toContain(teamRole.role);
      });
    }
      console.log('Verified all roles have correct structure');
    */

    
  }, 10000);

  test.skip('4. modifyCollectionRoles - should update user role (ensure current user remains EDITOR)', async () => {
    // First get current roles
    const getCurrentRoles = await getCollectionRoles(collectionId);
    const currentUserRole = getCurrentRoles.data.user.find(u => u.id === userId);

    if (!currentUserRole) {
      console.log('Current user not found in roles, skipping role modification test');
      return;
    }

    // Ensure the current user remains an EDITOR (maintain their permissions)
    const roles = [
      {
        op: 'update',
        path: '/user',
        value: [
          { id: userId, role: 'EDITOR' }
        ]
      }
    ];

    const result = await modifyCollectionRoles(collectionId, roles);

    // PATCH /roles returns 204 No Content on success
    expect(result.status).toBe(204);
    console.log('Successfully updated collection roles (HTTP 204)');

    // Verify the change by getting roles again
    const verifyResult = await getCollectionRoles(collectionId);
    const updatedUserRole = verifyResult.data.user.find(u => u.id === userId);
    
    expect(updatedUserRole).toBeDefined();
    expect(updatedUserRole.role).toBe('EDITOR');
    console.log('Verified current user maintained EDITOR role');
  }, 10000);

  test.skip('5. modifyCollectionRoles - should accept valid role update structure', async () => {
    // Get current roles to work with existing IDs
    const getCurrentRoles = await getCollectionRoles(collectionId);
    
    if (getCurrentRoles.data.user.length === 0) {
      console.log('No users in collection, skipping structure test');
      return;
    }

    // Use the first user in the list
    const firstUser = getCurrentRoles.data.user[0];

    const roles = [
      {
        op: 'update',
        path: '/user',
        value: [
          { id: firstUser.id, role: firstUser.role } // Keep their existing role
        ]
      }
    ];

    const result = await modifyCollectionRoles(collectionId, roles);

    expect(result.status).toBe(204);
    console.log('Successfully verified role update structure');
  }, 10000);

  test.skip('6. modifyCollectionRoles - should handle multiple path types simultaneously', async () => {
    const getCurrentRoles = await getCollectionRoles(collectionId);
    
    const roles = [];

    // Add user role update (maintain current user as EDITOR)
    if (getCurrentRoles.data.user.length > 0) {
      const currentUser = getCurrentRoles.data.user.find(u => u.id === userId);
      if (currentUser) {
        roles.push({
          op: 'update',
          path: '/user',
          value: [{ id: userId, role: 'EDITOR' }]
        });
      }
    }

    // Add group role updates if sdk-test groups exist
    if (sdkTestEditorGroup || sdkTestViewerGroup) {
      const groupValues = [];
      if (sdkTestEditorGroup) {
        groupValues.push({ id: sdkTestEditorGroup.id, role: 'EDITOR' });
      }
      if (sdkTestViewerGroup) {
        groupValues.push({ id: sdkTestViewerGroup.id, role: 'VIEWER' });
      }
      roles.push({
        op: 'update',
        path: '/group',
        value: groupValues
      });
    }

    // Add team role update if teams exist
    if (getCurrentRoles.data.team.length > 0) {
      const firstTeam = getCurrentRoles.data.team[0];
      roles.push({
        op: 'update',
        path: '/team',
        value: [{ id: firstTeam.id, role: firstTeam.role }]
      });
    }

    if (roles.length === 0) {
      console.log('No roles available to test multiple path types, skipping');
      return;
    }

    const result = await modifyCollectionRoles(collectionId, roles);

    expect(result.status).toBe(204);
    console.log(`✓ Successfully updated ${roles.length} path type(s) simultaneously`);
  }, 10000);

  describe('error handling', () => {
    test('should handle getting roles for non-existent collection', async () => {
      const fakeCollectionId = '00000000-0000-0000-0000-000000000000';

      await expect(
        getCollectionRoles(fakeCollectionId)
      ).rejects.toThrow();
      console.log('Successfully handled non-existent collection for getCollectionRoles');
    }, 10000);

    test('should handle modifying roles for non-existent collection', async () => {
      const fakeCollectionId = '00000000-0000-0000-0000-000000000000';
      const roles = [
        {
          op: 'update',
          path: '/user',
          value: [{ id: 12345678, role: 'VIEWER' }]
        }
      ];

      await expect(
        modifyCollectionRoles(fakeCollectionId, roles)
      ).rejects.toThrow();
      console.log('Successfully handled non-existent collection for modifyCollectionRoles');
    }, 10000);

    test('should handle invalid role type', async () => {
      const roles = [
        {
          op: 'update',
          path: '/user',
          value: [{ id: userId, role: 'INVALID_ROLE' }]
        }
      ];

      await expect(
        modifyCollectionRoles(collectionId, roles)
      ).rejects.toThrow();
      console.log('Successfully rejected invalid role type');
    }, 10000);

    test('should handle invalid path', async () => {
      const roles = [
        {
          op: 'update',
          path: '/invalid',
          value: [{ id: userId, role: 'EDITOR' }]
        }
      ];

      await expect(
        modifyCollectionRoles(collectionId, roles)
      ).rejects.toThrow();
      console.log('Successfully rejected invalid path');
    }, 10000);

    test('should handle invalid operation', async () => {
      const roles = [
        {
          op: 'delete', // Only 'update' is allowed
          path: '/user',
          value: [{ id: userId, role: 'EDITOR' }]
        }
      ];

      await expect(
        modifyCollectionRoles(collectionId, roles)
      ).rejects.toThrow();
      console.log('Successfully rejected invalid operation');
    }, 10000);

    test('should handle missing required fields in role update', async () => {
      const roles = [
        {
          op: 'update',
          path: '/user',
          value: [{ id: userId }] // Missing 'role' field
        }
      ];

      await expect(
        modifyCollectionRoles(collectionId, roles)
      ).rejects.toThrow();
      console.log('Successfully rejected missing role field');
    }, 10000);
  });

  afterAll(async () => {
    // No cleanup needed - roles remain as configured
    console.log('Collection roles functional tests complete');
  });
});


