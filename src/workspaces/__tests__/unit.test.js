const axios = require('axios');
const { 
  getWorkspaces, 
  createWorkspace, 
  getWorkspace, 
  updateWorkspace, 
  deleteWorkspace,
  getWorkspaceTags,
  updateWorkspaceTags
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

    test('should include about when provided without description', async () => {
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

      await createWorkspace('Test Workspace', 'team', null, 'About text');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            workspace: {
              name: 'Test Workspace',
              type: 'team',
              about: 'About text'
            }
          }
        })
      );
      // Should not have description
      const callData = axios.request.mock.calls[0][0].data;
      expect(callData.workspace).not.toHaveProperty('description');
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
    test('should call GET then PUT /workspaces/{workspaceId} and merge values', async () => {
      const mockGetResponse = {
        status: 200,
        data: {
          workspace: {
            id: DEFAULT_WORKSPACE_ID,
            name: 'Original Name',
            type: 'team',
            description: 'Original description',
            about: 'Original about'
          }
        }
      };
      const mockPutResponse = {
        status: 200,
        data: {
          workspace: {
            id: DEFAULT_WORKSPACE_ID,
            name: 'Updated Workspace'
          }
        }
      };
      
      // Mock GET request first, then PUT request
      axios.request
        .mockResolvedValueOnce(mockGetResponse)
        .mockResolvedValueOnce(mockPutResponse);

      const result = await updateWorkspace(DEFAULT_WORKSPACE_ID, 'Updated Workspace');

      // Should have called GET first
      expect(axios.request).toHaveBeenNthCalledWith(1,
        expect.objectContaining({
          method: 'get',
          url: `https://api.getpostman.com/workspaces/${DEFAULT_WORKSPACE_ID}`
        })
      );
      
      // Should have called PUT with merged data
      expect(axios.request).toHaveBeenNthCalledWith(2,
        expect.objectContaining({
          method: 'put',
          url: `https://api.getpostman.com/workspaces/${DEFAULT_WORKSPACE_ID}`,
          data: {
            workspace: {
              name: 'Updated Workspace',
              type: 'team',
              description: 'Original description',
              about: 'Original about'
            }
          }
        })
      );
      expect(result).toEqual(mockPutResponse);
    });

    test('should update type when provided', async () => {
      const mockGetResponse = {
        status: 200,
        data: {
          workspace: {
            id: DEFAULT_WORKSPACE_ID,
            name: 'Original Name',
            type: 'team',
            description: 'Original description',
            about: 'Original about'
          }
        }
      };
      const mockPutResponse = {
        status: 200,
        data: {
          workspace: {
            id: DEFAULT_WORKSPACE_ID,
            name: 'Original Name'
          }
        }
      };
      
      axios.request
        .mockResolvedValueOnce(mockGetResponse)
        .mockResolvedValueOnce(mockPutResponse);

      await updateWorkspace(DEFAULT_WORKSPACE_ID, null, 'private');

      expect(axios.request).toHaveBeenNthCalledWith(2,
        expect.objectContaining({
          data: {
            workspace: {
              name: 'Original Name',
              type: 'private',
              description: 'Original description',
              about: 'Original about'
            }
          }
        })
      );
    });

    test('should update all fields when provided', async () => {
      const mockGetResponse = {
        status: 200,
        data: {
          workspace: {
            id: DEFAULT_WORKSPACE_ID,
            name: 'Original Name',
            type: 'team',
            description: 'Original description',
            about: 'Original about'
          }
        }
      };
      const mockPutResponse = {
        status: 200,
        data: {
          workspace: {
            id: DEFAULT_WORKSPACE_ID,
            name: 'Updated Workspace'
          }
        }
      };
      
      axios.request
        .mockResolvedValueOnce(mockGetResponse)
        .mockResolvedValueOnce(mockPutResponse);

      await updateWorkspace(
        DEFAULT_WORKSPACE_ID, 
        'Updated Workspace', 
        'private', 
        'Updated description', 
        'Updated about'
      );

      expect(axios.request).toHaveBeenNthCalledWith(2,
        expect.objectContaining({
          data: {
            workspace: {
              name: 'Updated Workspace',
              type: 'private',
              description: 'Updated description',
              about: 'Updated about'
            }
          }
        })
      );
    });

    test('should keep existing values when all parameters are null', async () => {
      const mockGetResponse = {
        status: 200,
        data: {
          workspace: {
            id: DEFAULT_WORKSPACE_ID,
            name: 'Original Name',
            type: 'team',
            description: 'Original description',
            about: 'Original about'
          }
        }
      };
      const mockPutResponse = {
        status: 200,
        data: {
          workspace: {
            id: DEFAULT_WORKSPACE_ID,
            name: 'Original Name'
          }
        }
      };
      
      axios.request
        .mockResolvedValueOnce(mockGetResponse)
        .mockResolvedValueOnce(mockPutResponse);

      await updateWorkspace(DEFAULT_WORKSPACE_ID, null, null, null, null);

      expect(axios.request).toHaveBeenNthCalledWith(2,
        expect.objectContaining({
          data: {
            workspace: {
              name: 'Original Name',
              type: 'team',
              description: 'Original description',
              about: 'Original about'
            }
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

  describe('getWorkspaceTags', () => {
    test('should call GET /workspaces/{workspaceId}/tags', async () => {
      const mockResponse = {
        status: 200,
        data: {
          tags: [
            { slug: 'needs-review' },
            { slug: 'test-api' }
          ]
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getWorkspaceTags(DEFAULT_WORKSPACE_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `https://api.getpostman.com/workspaces/${DEFAULT_WORKSPACE_ID}/tags`
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle empty tags array', async () => {
      const mockResponse = {
        status: 200,
        data: {
          tags: []
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getWorkspaceTags(DEFAULT_WORKSPACE_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `https://api.getpostman.com/workspaces/${DEFAULT_WORKSPACE_ID}/tags`
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateWorkspaceTags', () => {
    test('should call PUT /workspaces/{workspaceId}/tags with tags array', async () => {
      const mockResponse = {
        status: 200,
        data: {
          tags: [
            { slug: 'needs-review' },
            { slug: 'test-api' }
          ]
        }
      };
      const tags = [
        { slug: 'needs-review' },
        { slug: 'test-api' }
      ];
      axios.request.mockResolvedValue(mockResponse);

      const result = await updateWorkspaceTags(DEFAULT_WORKSPACE_ID, tags);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: `https://api.getpostman.com/workspaces/${DEFAULT_WORKSPACE_ID}/tags`,
          data: {
            tags: [
              { slug: 'needs-review' },
              { slug: 'test-api' }
            ]
          }
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle empty tags array to clear all tags', async () => {
      const mockResponse = {
        status: 200,
        data: {
          tags: []
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await updateWorkspaceTags(DEFAULT_WORKSPACE_ID, []);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: `https://api.getpostman.com/workspaces/${DEFAULT_WORKSPACE_ID}/tags`,
          data: {
            tags: []
          }
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle single tag', async () => {
      const mockResponse = {
        status: 200,
        data: {
          tags: [
            { slug: 'production' }
          ]
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await updateWorkspaceTags(DEFAULT_WORKSPACE_ID, [{ slug: 'production' }]);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          data: {
            tags: [
              { slug: 'production' }
            ]
          }
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle maximum of 5 tags', async () => {
      const mockResponse = {
        status: 200,
        data: {
          tags: [
            { slug: 'tag1' },
            { slug: 'tag2' },
            { slug: 'tag3' },
            { slug: 'tag4' },
            { slug: 'tag5' }
          ]
        }
      };
      const tags = [
        { slug: 'tag1' },
        { slug: 'tag2' },
        { slug: 'tag3' },
        { slug: 'tag4' },
        { slug: 'tag5' }
      ];
      axios.request.mockResolvedValue(mockResponse);

      const result = await updateWorkspaceTags(DEFAULT_WORKSPACE_ID, tags);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            tags: expect.arrayContaining([
              { slug: 'tag1' },
              { slug: 'tag2' },
              { slug: 'tag3' },
              { slug: 'tag4' },
              { slug: 'tag5' }
            ])
          }
        })
      );
      expect(result.data.tags).toHaveLength(5);
      expect(result).toEqual(mockResponse);
    });
  });
});

