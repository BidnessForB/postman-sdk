const { getGroups, getGroup } = require('../group');
const { loadTestIds, saveTestIds, initPersistedIds } = require('../../__tests__/test-helpers');

describe('groups functional tests', () => {
  let persistedIds = {};
  let testGroupId;

  beforeAll(async () => {
    // Load previously persisted IDs from file
    
    persistedIds = loadTestIds();
    testGroupId = (persistedIds.group && persistedIds.group.id) || null;

    
  });

  describe('getGroups', () => {
    test('should retrieve all groups and verify structure', async () => {
      await initPersistedIds(['group']);
      const result = await getGroups();

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('data');
      expect(Array.isArray(result.data.data)).toBe(true);

      if (result.data.data.length > 0) {
        const firstGroup = result.data.data[0];
        
        // Verify required properties
        expect(firstGroup).toHaveProperty('id');
        expect(firstGroup).toHaveProperty('name');
        expect(firstGroup).toHaveProperty('teamId');
        expect(firstGroup).toHaveProperty('members');
        expect(firstGroup).toHaveProperty('roles');
        expect(firstGroup).toHaveProperty('createdAt');
        expect(firstGroup).toHaveProperty('createdBy');
        expect(firstGroup).toHaveProperty('updatedAt');
        
        // Verify property types
        expect(typeof firstGroup.id).toBe('number');
        expect(typeof firstGroup.name).toBe('string');
        expect(typeof firstGroup.teamId).toBe('number');
        expect(Array.isArray(firstGroup.members)).toBe(true);
        expect(Array.isArray(firstGroup.roles)).toBe(true);

        // Persist a group ID for use in other tests
        // Persist all groups whose names match 'sdk-test*'
        const sdkTestGroups = result.data.data.filter(group => 
          typeof group.name === 'string' && /^sdk-test/i.test(group.name)
        );
        if (sdkTestGroups.length > 0) {
          const ids = loadTestIds();
          saveTestIds({
            ...ids,
            group: sdkTestGroups.map(g => ({
              id: g.id,
              name: g.name,
              teamId: g.teamId
            }))
          });
          console.log(
            `Persisted sdk-test groups: ${sdkTestGroups.map(g => `${g.id} (${g.name})`).join(', ')}`
          );
        }

        console.log(`Retrieved ${result.data.data.length} group(s)`);
      } else {
        console.log('No groups found in team - this is expected for teams without groups');
      }
    });

    test('should return groups with member arrays', async () => {
      const result = await getGroups();

      expect(result.status).toBe(200);
      
      if (result.data.data.length > 0) {
        result.data.data.forEach(group => {
          expect(Array.isArray(group.members)).toBe(true);
          
          // If group has members, they should be numbers
          if (group.members.length > 0) {
            group.members.forEach(memberId => {
              expect(typeof memberId).toBe('number');
            });
          }
        });
      }
    });

    test('should return groups with role arrays', async () => {
      const result = await getGroups();

      expect(result.status).toBe(200);
      
      if (result.data.data.length > 0) {
        result.data.data.forEach(group => {
          expect(Array.isArray(group.roles)).toBe(true);
          
          // If group has roles, they should be strings
          if (group.roles.length > 0) {
            group.roles.forEach(role => {
              expect(typeof role).toBe('string');
            });
          }
        });
      }
    });

    test('should return groups with valid timestamps', async () => {
      const result = await getGroups();

      expect(result.status).toBe(200);
      
      if (result.data.data.length > 0) {
        result.data.data.forEach(group => {
          // Verify timestamps are valid date strings
          expect(group.createdAt).toBeTruthy();
          expect(group.updatedAt).toBeTruthy();
          
          const createdDate = new Date(group.createdAt);
          const updatedDate = new Date(group.updatedAt);
          
          expect(createdDate.toString()).not.toBe('Invalid Date');
          expect(updatedDate.toString()).not.toBe('Invalid Date');
          
          // Updated should be >= created
          expect(updatedDate.getTime()).toBeGreaterThanOrEqual(createdDate.getTime());
        });
      }
    });
  });

  describe('getGroup', () => {
    test('should retrieve a specific group by ID', async () => {
      if (!testGroupId) {
        // Try to get a group ID first
        const groupsResult = await getGroups();
        if (groupsResult.data.data.length === 0) {
          console.log('Skipping test - no groups available in team');
          return;
        }
        testGroupId = groupsResult.data.data[0].id;
      }

      const result = await getGroup(testGroupId);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('id');
      expect(result.data.id).toBe(testGroupId);
      
      // Verify all expected properties
      expect(result.data).toHaveProperty('teamId');
      expect(result.data).toHaveProperty('name');
      expect(result.data).toHaveProperty('summary');
      expect(result.data).toHaveProperty('createdBy');
      expect(result.data).toHaveProperty('createdAt');
      expect(result.data).toHaveProperty('updatedAt');
      expect(result.data).toHaveProperty('members');
      expect(result.data).toHaveProperty('roles');
      expect(result.data).toHaveProperty('managers');
      
      // Verify property types
      expect(typeof result.data.id).toBe('number');
      expect(typeof result.data.teamId).toBe('number');
      expect(typeof result.data.name).toBe('string');
      expect(Array.isArray(result.data.members)).toBe(true);
      expect(Array.isArray(result.data.roles)).toBe(true);
      expect(Array.isArray(result.data.managers)).toBe(true);

      console.log(`Retrieved group: ${result.data.name} (ID: ${result.data.id})`);
    });

    test('should return managers array for group', async () => {
      if (!testGroupId) {
        const groupsResult = await getGroups();
        if (groupsResult.data.data.length === 0) {
          console.log('Skipping test - no groups available in team');
          return;
        }
        testGroupId = groupsResult.data.data[0].id;
      }

      const result = await getGroup(testGroupId);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('managers');
      expect(Array.isArray(result.data.managers)).toBe(true);
      
      // If there are managers, they should be numbers
      if (result.data.managers.length > 0) {
        result.data.managers.forEach(managerId => {
          expect(typeof managerId).toBe('number');
        });
        
        console.log(`Group has ${result.data.managers.length} manager(s)`);
      }
    });

    test('should verify group members are in team', async () => {
      if (!testGroupId) {
        const groupsResult = await getGroups();
        if (groupsResult.data.data.length === 0) {
          console.log('Skipping test - no groups available in team');
          return;
        }
        testGroupId = groupsResult.data.data[0].id;
      }

      const result = await getGroup(testGroupId);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty('members');
      expect(Array.isArray(result.data.members)).toBe(true);
      
      if (result.data.members.length > 0) {
        console.log(`Group has ${result.data.members.length} member(s)`);
        
        // All members should be numeric IDs
        result.data.members.forEach(memberId => {
          expect(typeof memberId).toBe('number');
          expect(memberId).toBeGreaterThan(0);
        });
      } else {
        console.log('Group has no members');
      }
    });

    test('should verify managers are subset of members', async () => {
      if (!testGroupId) {
        const groupsResult = await getGroups();
        if (groupsResult.data.data.length === 0) {
          console.log('Skipping test - no groups available in team');
          return;
        }
        testGroupId = groupsResult.data.data[0].id;
      }

      const result = await getGroup(testGroupId);

      expect(result.status).toBe(200);
      
      // If there are managers, they should all be in the members list
      if (result.data.managers.length > 0) {
        result.data.managers.forEach(managerId => {
          expect(result.data.members).toContain(managerId);
        });
        
        console.log('All managers are members of the group ✓');
      } else {
        console.log('No managers to verify');
      }
    });

    test('should retrieve group with string ID', async () => {
      if (!testGroupId) {
        const groupsResult = await getGroups();
        if (groupsResult.data.data.length === 0) {
          console.log('Skipping test - no groups available in team');
          return;
        }
        testGroupId = groupsResult.data.data[0].id;
      }

      // Call with string version of ID
      const result = await getGroup(String(testGroupId));

      expect(result.status).toBe(200);
      expect(result.data.id).toBe(testGroupId);
    });
  });

  describe('error handling', () => {
    test('should handle non-existent group ID', async () => {
      const nonExistentId = 999999999;

      await expect(getGroup(nonExistentId)).rejects.toThrow();
    });

    test('should handle invalid group ID format', async () => {
      await expect(getGroup('invalid-id')).rejects.toThrow();
    });

    test('should handle zero as invalid group ID', async () => {
      await expect(getGroup(0)).rejects.toThrow();
    });

    test('should handle negative group ID', async () => {
      await expect(getGroup(-1)).rejects.toThrow();
    });
  });

  describe('data consistency', () => {
    test('should have consistent data between getGroups and getGroup', async () => {
      if (!testGroupId) {
        const groupsResult = await getGroups();
        if (groupsResult.data.data.length === 0) {
          console.log('Skipping test - no groups available in team');
          return;
        }
        testGroupId = groupsResult.data.data[0].id;
      }

      // Get all groups
      const allGroupsResult = await getGroups();
      const groupFromList = allGroupsResult.data.data.find(g => g.id === testGroupId);

      // Get specific group
      const specificGroupResult = await getGroup(testGroupId);

      // Compare common properties
      expect(specificGroupResult.data.id).toBe(groupFromList.id);
      expect(specificGroupResult.data.name).toBe(groupFromList.name);
      expect(specificGroupResult.data.teamId).toBe(groupFromList.teamId);
      expect(specificGroupResult.data.createdBy).toBe(groupFromList.createdBy);
      expect(specificGroupResult.data.members).toEqual(groupFromList.members);
      expect(specificGroupResult.data.roles).toEqual(groupFromList.roles);

      console.log('Group data is consistent between list and detail endpoints ✓');
    });

    test('should return same data on repeated calls', async () => {
      if (!testGroupId) {
        const groupsResult = await getGroups();
        if (groupsResult.data.data.length === 0) {
          console.log('Skipping test - no groups available in team');
          return;
        }
        testGroupId = groupsResult.data.data[0].id;
      }

      const result1 = await getGroup(testGroupId);
      const result2 = await getGroup(testGroupId);

      expect(result1.data).toEqual(result2.data);
      
      console.log('Group data is consistent across repeated calls ✓');
    });
  });
});

