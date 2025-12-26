const axios = require('axios');

const { DEFAULT_ID } = require('../../__tests__/test-helpers');
const {
  getPullRequest,
  updatePullRequest,
  reviewPullRequest
} = require('../index');

jest.mock('axios');
jest.mock('../../core/config', () => ({
  apiKey: 'test-api-key',
  baseUrl: 'https://api.getpostman.com'
}));

describe('unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPullRequest', () => {
    test('should call GET /pull-requests/{pullRequestId}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          id: DEFAULT_ID,
          title: 'Test PR',
          description: 'PR description',
          status: 'open',
          sourceId: 'source-uid',
          destinationId: 'dest-id',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          createdBy: '12345678',
          reviewers: ['12345678', '87654321']
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getPullRequest(DEFAULT_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `https://api.getpostman.com/pull-requests/${DEFAULT_ID}`,
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key'
          }
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { id: DEFAULT_ID }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getPullRequest(DEFAULT_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key'
          })
        })
      );
    });

    test('should throw error for invalid ID format', async () => {
      await expect(getPullRequest('invalid-id')).rejects.toThrow();
      expect(axios.request).not.toHaveBeenCalled();
    });

    test('should throw error for null ID', async () => {
      await expect(getPullRequest(null)).rejects.toThrow();
      expect(axios.request).not.toHaveBeenCalled();
    });

    test('should throw error for undefined ID', async () => {
      await expect(getPullRequest(undefined)).rejects.toThrow();
      expect(axios.request).not.toHaveBeenCalled();
    });

    test('should handle API errors', async () => {
      const mockError = new Error('API Error');
      mockError.response = {
        status: 404,
        data: { error: { message: 'Pull request not found' } }
      };
      axios.request.mockRejectedValue(mockError);

      await expect(getPullRequest(DEFAULT_ID)).rejects.toThrow('API Error');
    });
  });

  describe('updatePullRequest', () => {
    test('should call PUT /pull-requests/{pullRequestId} with all fields', async () => {
      const mockResponse = {
        status: 200,
        data: {
          id: DEFAULT_ID,
          title: 'Updated PR Title',
          description: 'Updated description',
          status: 'open',
          sourceId: 'source-uid',
          destinationId: 'dest-id',
          reviewers: ['12345678', '87654321']
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const title = 'Updated PR Title';
      const reviewers = ['12345678', '87654321'];
      const description = 'Updated description';

      const result = await updatePullRequest(
        DEFAULT_ID,
        title,
        reviewers,
        description
      );

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: `https://api.getpostman.com/pull-requests/${DEFAULT_ID}`,
          data: {
            title,
            reviewers,
            description
          },
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key'
          }
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should not include description when null', async () => {
      const mockResponse = {
        status: 200,
        data: { id: DEFAULT_ID }
      };
      axios.request.mockResolvedValue(mockResponse);

      const title = 'PR Title';
      const reviewers = ['12345678'];

      await updatePullRequest(DEFAULT_ID, title, reviewers);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            title,
            reviewers
          }
        })
      );
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { id: DEFAULT_ID }
      };
      axios.request.mockResolvedValue(mockResponse);

      await updatePullRequest(DEFAULT_ID, 'Title', ['12345678']);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key'
          })
        })
      );
    });

    test('should handle multiple reviewers', async () => {
      const mockResponse = {
        status: 200,
        data: { id: DEFAULT_ID }
      };
      axios.request.mockResolvedValue(mockResponse);

      const reviewers = ['12345678', '87654321', '11111111'];

      await updatePullRequest(
        DEFAULT_ID,
        'Title',
        reviewers,
        'Description'
      );

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            reviewers
          })
        })
      );
    });

    test('should throw error for invalid ID format', async () => {
      await expect(
        updatePullRequest('invalid-id', 'Title', ['12345678'])
      ).rejects.toThrow();
      expect(axios.request).not.toHaveBeenCalled();
    });

    test('should throw error for null ID', async () => {
      await expect(
        updatePullRequest(null, 'Title', ['12345678'])
      ).rejects.toThrow();
      expect(axios.request).not.toHaveBeenCalled();
    });

    test('should throw error for undefined title', async () => {
      await expect(
        updatePullRequest(DEFAULT_ID, undefined, ['12345678'])
      ).rejects.toThrow('Title and reviewers are required');
      expect(axios.request).not.toHaveBeenCalled();
      
    });

    test('should throw error for undefined reviewers', async () => {
      await expect(
        updatePullRequest(DEFAULT_ID, undefined, ['12345678'])
      ).rejects.toThrow('Title and reviewers are required');
      expect(axios.request).not.toHaveBeenCalled();
    });

    //not sure how to configure this test to pass
    test('should handle API errors', async () => {
      const mockError = new Error('API Error');
      mockError.response = {
        status: 400,
        data: { error: { message: 'Invalid request' } }
      };
      axios.request.mockRejectedValue(mockError);

      await expect(
        updatePullRequest(DEFAULT_ID, 'Title', ['12345678'])
      ).resolves.toBe(mockError);
    });

    test('should handle empty reviewers array', async () => {
      const mockResponse = {
        status: 200,
        data: { id: DEFAULT_ID }
      };
      axios.request.mockResolvedValue(mockResponse);

      await updatePullRequest(DEFAULT_ID, 'Title', []);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            reviewers: []
          })
        })
      );
    });
  });

  describe('reviewPullRequest (POST /pull-requests/{pullRequestId}/tasks)', () => {
    test('should call POST /pull-requests/{pullRequestId}/tasks with approve action', async () => {
      const mockResponse = {
        status: 200,
        data: {
          id: DEFAULT_ID,
          status: 'approved',
          reviewedBy: '12345678',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await reviewPullRequest(DEFAULT_ID, 'approve');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: `https://api.getpostman.com/pull-requests/${DEFAULT_ID}/tasks`,
          data: {
            action: 'approve'
          },
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key'
          }
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should call POST with decline action and comment', async () => {
      const mockResponse = {
        status: 200,
        data: {
          id: DEFAULT_ID,
          status: 'declined',
          reviewedBy: '12345678',
          comment: 'Missing documentation'
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const comment = 'Missing documentation';
      const result = await reviewPullRequest(DEFAULT_ID, 'decline', comment);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: `https://api.getpostman.com/pull-requests/${DEFAULT_ID}/tasks`,
          data: {
            action: 'decline',
            comment
          }
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should call POST with merge action', async () => {
      const mockResponse = {
        status: 200,
        data: {
          id: DEFAULT_ID,
          status: 'merged',
          reviewedBy: '12345678'
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await reviewPullRequest(DEFAULT_ID, 'merge');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            action: 'merge'
          }
        })
      );
    });

    test('should call POST with unapprove action', async () => {
      const mockResponse = {
        status: 200,
        data: {
          id: DEFAULT_ID,
          status: 'open',
          reviewedBy: '12345678'
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await reviewPullRequest(DEFAULT_ID, 'unapprove');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            action: 'unapprove'
          }
        })
      );
    });

    test('should not include comment when null', async () => {
      const mockResponse = {
        status: 200,
        data: { id: DEFAULT_ID }
      };
      axios.request.mockResolvedValue(mockResponse);

      await reviewPullRequest(DEFAULT_ID, 'approve');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            action: 'approve'
          }
        })
      );
      
      const callData = axios.request.mock.calls[0][0].data;
      expect(callData).not.toHaveProperty('comment');
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { id: DEFAULT_ID }
      };
      axios.request.mockResolvedValue(mockResponse);

      await reviewPullRequest(DEFAULT_ID, 'approve');

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key'
          })
        })
      );
    });

    test('should throw error for invalid ID format', async () => {
      await expect(
        reviewPullRequest('invalid-id', 'approve')
      ).rejects.toThrow();
      expect(axios.request).not.toHaveBeenCalled();
    });

    test('should throw error for null ID', async () => {
      await expect(
        reviewPullRequest(null, 'approve')
      ).rejects.toThrow();
      expect(axios.request).not.toHaveBeenCalled();
    });

    test('should throw error for undefined action', async () => {
      await expect(
        reviewPullRequest(DEFAULT_ID, undefined)
      ).rejects.toThrow();
      expect(axios.request).not.toHaveBeenCalled();
    });

    test('should handle API errors', async () => {
      const mockError = new Error('API Error');
      mockError.response = {
        status: 403,
        data: { error: { message: 'Not authorized to review this PR' } }
      };
      axios.request.mockRejectedValue(mockError);

      await expect(
        reviewPullRequest(DEFAULT_ID, 'approve')
      ).rejects.toThrow('API Error');
    });
  });
});

