const axios = require('axios');
const { DEFAULT_ID, DEFAULT_UID } = require('../../__tests__/test-helpers');
const {
  getEnvironments,
  createEnvironment,
  getEnvironment,
  modifyEnvironment,
  deleteEnvironment
} = require('../index');

jest.mock('axios');
jest.mock('../../core/config', () => ({
  apiKey: 'test-api-key',
  baseUrl: 'https://api.getpostman.com'
}));

describe('environments unit tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getEnvironments', () => {
    test('should call GET /environments without query params', async () => {
      const mockResponse = {
        status: 200,
        data: {
          environments: [
            {
              id: DEFAULT_ID,
              name: 'Test Environment',
              owner: '12345678',
              uid: `12345678-${DEFAULT_ID}`
            }
          ]
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getEnvironments();

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: 'https://api.getpostman.com/environments'
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include workspace query param when provided', async () => {
      const mockResponse = {
        status: 200,
        data: { environments: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getEnvironments(DEFAULT_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `https://api.getpostman.com/environments?workspace=${DEFAULT_ID}`
        })
      );
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { environments: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getEnvironments();

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key'
          })
        })
      );
    });
  });

  describe('createEnvironment', () => {
    test('should call POST /environments with environment data', async () => {
      const mockResponse = {
        status: 200,
        data: {
          environment: {
            id: DEFAULT_ID,
            name: 'Test Environment',
            uid: `12345678-${DEFAULT_ID}`
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const environmentData = {
        name: 'Test Environment',
        values: [
          {
            key: 'API_KEY',
            value: 'secret123',
            type: 'secret',
            enabled: true
          }
        ]
      };

      const result = await createEnvironment(environmentData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: 'https://api.getpostman.com/environments',
          data: {
            environment: environmentData
          }
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include workspace query param when provided', async () => {
      const mockResponse = {
        status: 200,
        data: {
          environment: {
            id: DEFAULT_ID,
            name: 'Test Environment'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const environmentData = { name: 'Test Environment' };

      await createEnvironment(environmentData, DEFAULT_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `https://api.getpostman.com/environments?workspace=${DEFAULT_ID}`
        })
      );
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { environment: {} }
      };
      axios.request.mockResolvedValue(mockResponse);

      await createEnvironment({ name: 'Test' });

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key'
          })
        })
      );
    });
  });

  describe('getEnvironment', () => {
    test('should call GET /environments/{environmentId}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          environment: {
            id: DEFAULT_ID,
            name: 'Test Environment',
            owner: '12345678',
            values: [
              {
                key: 'API_KEY',
                value: 'secret123',
                type: 'secret',
                enabled: true
              }
            ]
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getEnvironment(DEFAULT_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `https://api.getpostman.com/environments/${DEFAULT_ID}`
        })
      );
      expect(result).toEqual(mockResponse);
      expect(result.data.environment.id).toBe(DEFAULT_ID);
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { environment: {} }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getEnvironment(DEFAULT_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key'
          })
        })
      );
    });
  });

  describe('modifyEnvironment', () => {
    test('should call PATCH /environments/{environmentId} with JSON Patch operations', async () => {
      const mockResponse = {
        status: 200,
        data: {
          environment: {
            id: DEFAULT_ID,
            name: 'Updated Environment',
            owner: '12345678'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const patchOperations = [
        {
          op: 'replace',
          path: '/name',
          value: 'Updated Environment'
        }
      ];

      const result = await modifyEnvironment(DEFAULT_ID, patchOperations);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'patch',
          url: `https://api.getpostman.com/environments/${DEFAULT_ID}`,
          data: patchOperations
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should add environment variable with JSON Patch add operation', async () => {
      const mockResponse = {
        status: 200,
        data: {
          environment: {
            id: DEFAULT_ID,
            values: [
              {
                key: 'NEW_KEY',
                value: 'new_value',
                type: 'default',
                enabled: true
              }
            ]
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const patchOperations = [
        {
          op: 'add',
          path: '/values/0',
          value: {
            key: 'NEW_KEY',
            value: 'new_value',
            type: 'default',
            enabled: true
          }
        }
      ];

      await modifyEnvironment(DEFAULT_ID, patchOperations);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: patchOperations
        })
      );
    });

    test('should replace variable value with JSON Patch replace operation', async () => {
      const mockResponse = {
        status: 200,
        data: {
          environment: {
            id: DEFAULT_ID,
            values: [
              {
                key: 'EXISTING_KEY',
                value: 'updated_value',
                type: 'default',
                enabled: true
              }
            ]
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const patchOperations = [
        {
          op: 'replace',
          path: '/values/0/value',
          value: 'updated_value'
        }
      ];

      await modifyEnvironment(DEFAULT_ID, patchOperations);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: patchOperations
        })
      );
    });

    test('should remove variable with JSON Patch remove operation', async () => {
      const mockResponse = {
        status: 200,
        data: {
          environment: {
            id: DEFAULT_ID,
            values: []
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const patchOperations = [
        {
          op: 'remove',
          path: '/values/0'
        }
      ];

      await modifyEnvironment(DEFAULT_ID, patchOperations);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: patchOperations
        })
      );
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { environment: {} }
      };
      axios.request.mockResolvedValue(mockResponse);

      const patchOperations = [
        {
          op: 'replace',
          path: '/name',
          value: 'Updated'
        }
      ];

      await modifyEnvironment(DEFAULT_ID, patchOperations);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key'
          })
        })
      );
    });
  });

  describe('deleteEnvironment', () => {
    test('should call DELETE /environments/{environmentId}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          environment: {
            id: DEFAULT_ID,
            uid: `12345678-${DEFAULT_ID}`
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await deleteEnvironment(DEFAULT_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'delete',
          url: `https://api.getpostman.com/environments/${DEFAULT_ID}`
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { environment: {} }
      };
      axios.request.mockResolvedValue(mockResponse);

      await deleteEnvironment(DEFAULT_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key'
          })
        })
      );
    });
  });
});

