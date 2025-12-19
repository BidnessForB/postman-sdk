const axios = require('axios');
const { 
  getWorkspaces, 
  createWorkspace, 
  getWorkspace, 
  updateWorkspace, 
  deleteWorkspace
} = require('../index');

jest.mock('axios');
jest.mock('../../core/config', () => ({
  apiKey: 'test-api-key',
  baseUrl: 'https://api.getpostman.com'
}));

const DEFAULT_WORKSPACE_ID = '1f0df51a-8658-4ee8-a2a1-d2567dfa09a9';

describe('workspaces unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getWorkspaces', () => {
    test('should call GET /workspaces without query params', async () => {
      const mockResponse = {
        status: 200,
        data: { workspaces: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getWorkspaces();

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: 'https://api.getpostman.com/workspaces'
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include type query param', async () => {
      const mockResponse = {
        status: 200,
        data: { workspaces: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getWorkspaces('team');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.getpostman.com/workspaces?type=team'
        })
      );
    });

    test('should include createdBy query param', async () => {
      const mockResponse = {
        status: 200,
        data: { workspaces: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getWorkspaces(null, 12345678);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.getpostman.com/workspaces?createdBy=12345678'
        })
      );
    });

    test('should include include query param', async () => {
      const mockResponse = {
        status: 200,
        data: { workspaces: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getWorkspaces(null, null, 'scim');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.getpostman.com/workspaces?include=scim'
        })
      );
    });

    test('should include all query params when provided', async () => {
      const mockResponse = {
        status: 200,
        data: { workspaces: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getWorkspaces('team', 12345678, 'scim');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('type=team'),
          url: expect.stringContaining('createdBy=12345678'),
          url: expect.stringContaining('include=scim')
        })
      );
    });
  });

  describe('createWorkspace', () => {
    test('should call POST /workspaces with required fields', async () => {
      const mockResponse = {
        status: 200,
        data: { 
          workspace: { 
            id: DEFAULT_WORKSPACE_ID, 
            name: 'Test Workspace' 
          } 
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await createWorkspace('Test Workspace', 'team');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: 'https://api.getpostman.com/workspaces',
          data: {
            workspace: {
              name: 'Test Workspace',
              type: 'team'
            }
          }
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include description when provided', async () => {
      const mockResponse = {
        status: 200,
        data: { 
          workspace: { 
            id: DEFAULT_WORKSPACE_ID, 
            name: 'Test Workspace' 
          } 
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await createWorkspace('Test Workspace', 'team', 'This is a test workspace');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            workspace: {
              name: 'Test Workspace',
              type: 'team',
              description: 'This is a test workspace'
            }
          }
        })
      );
    });

    test('should include all optional fields when provided', async () => {
      const mockResponse = {
        status: 200,
        data: { 
          workspace: { 
            id: DEFAULT_WORKSPACE_ID, 
            name: 'Test Workspace' 
          } 
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await createWorkspace('Test Workspace', 'team', 'This is a test workspace', 'Team workspace');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            workspace: {
              name: 'Test Workspace',
              type: 'team',
              description: 'This is a test workspace',
              about: 'Team workspace'
            }
          }
        })
      );
    });

    test('should not include optional fields when null', async () => {
      const mockResponse = {
        status: 200,
        data: { 
          workspace: { 
            id: DEFAULT_WORKSPACE_ID, 
            name: 'Test Workspace' 
          } 
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await createWorkspace('Test Workspace', 'team', null, null);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            workspace: {
              name: 'Test Workspace',
              type: 'team'
            }
          }
        })
      );
    });
  });

  describe('getWorkspace', () => {
    test('should call GET /workspaces/{workspaceId}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          workspace: {
            id: DEFAULT_WORKSPACE_ID,
            name: 'Team Workspace',
            type: 'team'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getWorkspace(DEFAULT_WORKSPACE_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `https://api.getpostman.com/workspaces/${DEFAULT_WORKSPACE_ID}`
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include include query param when provided', async () => {
      const mockResponse = {
        status: 200,
        data: {
          workspace: {
            id: DEFAULT_WORKSPACE_ID,
            name: 'Team Workspace',
            type: 'team'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getWorkspace(DEFAULT_WORKSPACE_ID, 'scim');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `https://api.getpostman.com/workspaces/${DEFAULT_WORKSPACE_ID}?include=scim`
        })
      );
    });

    test('should not include query param when null', async () => {
      const mockResponse = {
        status: 200,
        data: {
          workspace: {
            id: DEFAULT_WORKSPACE_ID,
            name: 'Team Workspace',
            type: 'team'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getWorkspace(DEFAULT_WORKSPACE_ID, null);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `https://api.getpostman.com/workspaces/${DEFAULT_WORKSPACE_ID}`
        })
      );
    });
  });

  describe('updateWorkspace', () => {
    test('should call PUT /workspaces/{workspaceId}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          workspace: {
            id: DEFAULT_WORKSPACE_ID,
            name: 'Updated Workspace'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await updateWorkspace(DEFAULT_WORKSPACE_ID, 'Updated Workspace');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: `https://api.getpostman.com/workspaces/${DEFAULT_WORKSPACE_ID}`,
          data: {
            workspace: {
              name: 'Updated Workspace'
            }
          }
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include type when provided', async () => {
      const mockResponse = {
        status: 200,
        data: {
          workspace: {
            id: DEFAULT_WORKSPACE_ID,
            name: 'Updated Workspace'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await updateWorkspace(DEFAULT_WORKSPACE_ID, null, 'private');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            workspace: {
              type: 'private'
            }
          }
        })
      );
    });

    test('should include all fields when provided', async () => {
      const mockResponse = {
        status: 200,
        data: {
          workspace: {
            id: DEFAULT_WORKSPACE_ID,
            name: 'Updated Workspace'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await updateWorkspace(
        DEFAULT_WORKSPACE_ID, 
        'Updated Workspace', 
        'team', 
        'Updated description', 
        'Updated about'
      );

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            workspace: {
              name: 'Updated Workspace',
              type: 'team',
              description: 'Updated description',
              about: 'Updated about'
            }
          }
        })
      );
    });

    test('should not include fields when all null', async () => {
      const mockResponse = {
        status: 200,
        data: {
          workspace: {
            id: DEFAULT_WORKSPACE_ID,
            name: 'Updated Workspace'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await updateWorkspace(DEFAULT_WORKSPACE_ID, null, null, null, null);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            workspace: {}
          }
        })
      );
    });
  });

  describe('deleteWorkspace', () => {
    test('should call DELETE /workspaces/{workspaceId}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          workspace: {
            id: DEFAULT_WORKSPACE_ID
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await deleteWorkspace(DEFAULT_WORKSPACE_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'delete',
          url: `https://api.getpostman.com/workspaces/${DEFAULT_WORKSPACE_ID}`
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });
});

