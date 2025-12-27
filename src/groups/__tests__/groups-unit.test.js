const axios = require('axios');
const { getGroups, getGroup } = require('../group');

jest.mock('axios');
jest.mock('../../core/config', () => ({
  apiKey: 'test-api-key',
  baseUrl: 'https://api.getpostman.com'
}));

describe('groups unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getGroups', () => {
    test('should call GET /groups', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: [
            {
              updatedAt: '2024-10-03T14:05:05.000Z',
              members: [12345678, 87654321],
              teamId: 1,
              id: 123,
              name: 'API Test Group',
              summary: 'API testing group.',
              roles: ['user'],
              createdAt: '2024-10-03T14:05:05.000Z',
              createdBy: 12345678
            }
          ]
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getGroups();

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: 'https://api.getpostman.com/groups'
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should return array of groups', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: [
            {
              id: 123,
              name: 'Group 1',
              teamId: 1,
              members: [12345678]
            },
            {
              id: 456,
              name: 'Group 2',
              teamId: 1,
              members: [87654321]
            }
          ]
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getGroups();

      expect(result.data.data).toHaveLength(2);
      expect(result.data.data[0]).toHaveProperty('id');
      expect(result.data.data[0]).toHaveProperty('name');
      expect(result.data.data[0]).toHaveProperty('teamId');
    });

    test('should handle empty groups array', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: []
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getGroups();

      expect(result.data.data).toHaveLength(0);
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { data: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getGroups();

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key'
          })
        })
      );
    });

    test('should return groups with all expected properties', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: [
            {
              updatedAt: '2024-10-03T14:05:05.000Z',
              members: [12345678, 87654321, 56781234],
              teamId: 1,
              id: 123,
              name: 'API Test Group',
              summary: 'API testing group.',
              roles: ['user'],
              createdAt: '2024-10-03T14:05:05.000Z',
              createdBy: 12345678
            }
          ]
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getGroups();

      const group = result.data.data[0];
      expect(group).toHaveProperty('id');
      expect(group).toHaveProperty('name');
      expect(group).toHaveProperty('summary');
      expect(group).toHaveProperty('teamId');
      expect(group).toHaveProperty('members');
      expect(group).toHaveProperty('roles');
      expect(group).toHaveProperty('createdAt');
      expect(group).toHaveProperty('createdBy');
      expect(group).toHaveProperty('updatedAt');
      expect(Array.isArray(group.members)).toBe(true);
      expect(Array.isArray(group.roles)).toBe(true);
    });

    test('should handle groups with multiple members', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: [
            {
              id: 789,
              name: 'Collaboration',
              teamId: 1,
              members: [12345678, 87654321, 56781234, 78906531, 45507812],
              roles: ['user'],
              createdAt: '2024-03-15T19:44:20.000Z',
              createdBy: 12345678,
              summary: '',
              updatedAt: '2024-03-15T19:44:20.000Z'
            }
          ]
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getGroups();

      expect(result.data.data[0].members).toHaveLength(5);
    });
  });

  describe('getGroup', () => {
    test('should call GET /groups/{groupId} with numeric ID', async () => {
      const mockResponse = {
        status: 200,
        data: {
          id: 123,
          teamId: 1,
          name: 'API Test Group',
          summary: 'API testing group.',
          createdBy: 12345678,
          createdAt: '2024-10-03T14:05:05.000Z',
          updatedAt: '2024-10-03T14:05:05.000Z',
          members: [12345678, 87654321, 56781234],
          roles: ['user'],
          managers: [12345678]
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getGroup(123);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: 'https://api.getpostman.com/groups/123'
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should call GET /groups/{groupId} with string ID', async () => {
      const mockResponse = {
        status: 200,
        data: {
          id: 456,
          name: 'Test Group',
          teamId: 1
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getGroup('456');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.getpostman.com/groups/456'
        })
      );
    });

    test('should return group with all expected properties', async () => {
      const mockResponse = {
        status: 200,
        data: {
          id: 123,
          teamId: 1,
          name: 'API Test Group',
          summary: 'API testing group.',
          createdBy: 12345678,
          createdAt: '2024-10-03T14:05:05.000Z',
          updatedAt: '2024-10-03T14:05:05.000Z',
          members: [12345678, 87654321, 56781234],
          roles: ['user'],
          managers: [12345678]
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getGroup(123);

      expect(result.data).toHaveProperty('id');
      expect(result.data).toHaveProperty('teamId');
      expect(result.data).toHaveProperty('name');
      expect(result.data).toHaveProperty('summary');
      expect(result.data).toHaveProperty('createdBy');
      expect(result.data).toHaveProperty('createdAt');
      expect(result.data).toHaveProperty('updatedAt');
      expect(result.data).toHaveProperty('members');
      expect(result.data).toHaveProperty('roles');
      expect(result.data).toHaveProperty('managers');
      expect(Array.isArray(result.data.members)).toBe(true);
      expect(Array.isArray(result.data.roles)).toBe(true);
      expect(Array.isArray(result.data.managers)).toBe(true);
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { id: 123, name: 'Test' }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getGroup(123);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key'
          })
        })
      );
    });

    test('should handle group with empty summary', async () => {
      const mockResponse = {
        status: 200,
        data: {
          id: 456,
          name: 'Billing',
          summary: '',
          teamId: 1,
          members: [56789012],
          roles: ['user'],
          managers: [],
          createdAt: '2024-03-06T11:01:42.000Z',
          createdBy: 12345678,
          updatedAt: '2024-04-04T13:36:11.000Z'
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getGroup(456);

      expect(result.data.summary).toBe('');
    });

    test('should handle group with multiple managers', async () => {
      const mockResponse = {
        status: 200,
        data: {
          id: 789,
          name: 'Admin Group',
          teamId: 1,
          members: [12345678, 87654321],
          managers: [12345678, 87654321],
          roles: ['admin'],
          createdAt: '2024-01-01T00:00:00.000Z',
          createdBy: 12345678,
          updatedAt: '2024-01-01T00:00:00.000Z',
          summary: 'Admin team'
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getGroup(789);

      expect(result.data.managers).toHaveLength(2);
      expect(result.data.managers).toContain(12345678);
      expect(result.data.managers).toContain(87654321);
    });

    test('should handle group with no managers', async () => {
      const mockResponse = {
        status: 200,
        data: {
          id: 999,
          name: 'User Group',
          teamId: 1,
          members: [56789012],
          managers: [],
          roles: ['user'],
          createdAt: '2024-01-01T00:00:00.000Z',
          createdBy: 12345678,
          updatedAt: '2024-01-01T00:00:00.000Z',
          summary: 'Regular users'
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getGroup(999);

      expect(result.data.managers).toHaveLength(0);
    });
  });
});

