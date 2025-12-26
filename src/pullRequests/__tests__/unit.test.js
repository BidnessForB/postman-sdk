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

describe('pullRequests', () => {
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
            description: 'Test pull request',
            status: 'open',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            createdBy: '12345678',
            forkType: 'collection',
            source: {
              id: 'source-id',
              name: 'Source Collection',
              forkName: 'Test Fork',
              exists: true
            },
            destination: {
              id: 'dest-id',
              name: 'Destination Collection',
              exists: true
            },
            reviewers: [],
            merge: {
              status: 'inactive'
            }
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
    });

    describe('updatePullRequest', () => {
      test('should call PUT /pull-requests/{pullRequestId} with required fields', async () => {
        const mockResponse = {
          status: 200,
          data: {
            id: DEFAULT_ID,
            title: 'Updated Title',
            description: 'Updated description',
            reviewers: ['12345678'],
            status: 'open',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-02T00:00:00Z'
          }
        };
        axios.request.mockResolvedValue(mockResponse);

        const title = 'Updated Title';
        const reviewers = ['12345678', '87654321'];
        const description = 'Updated description';

        const result = await updatePullRequest(DEFAULT_ID, title, reviewers, description);

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

        const title = 'Title Only';
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
    });

    describe('reviewPullRequest', () => {
      test('should call POST /pull-requests/{pullRequestId}/tasks with approve action', async () => {
        const mockResponse = {
          status: 200,
          data: {
            id: DEFAULT_ID,
            reviewedBy: {
              id: 12345678,
              name: 'Taylor Lee',
              username: 'taylor-lee'
            },
            status: 'approved',
            updatedAt: '2024-01-02T00:00:00Z'
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

      test('should include comment with decline action', async () => {
        const mockResponse = {
          status: 200,
          data: {
            id: DEFAULT_ID,
            reviewedBy: {
              id: 12345678,
              name: 'Taylor Lee',
              username: 'taylor-lee'
            },
            status: 'declined',
            updatedAt: '2024-01-02T00:00:00Z'
          }
        };
        axios.request.mockResolvedValue(mockResponse);

        const comment = 'Missing required documentation';

        await reviewPullRequest(DEFAULT_ID, 'decline', comment);

        expect(axios.request).toHaveBeenCalledWith(
          expect.objectContaining({
            data: {
              action: 'decline',
              comment
            }
          })
        );
      });

      test('should support merge action', async () => {
        const mockResponse = {
          status: 200,
          data: {
            id: DEFAULT_ID,
            reviewedBy: {
              id: 12345678,
              name: 'Taylor Lee',
              username: 'taylor-lee'
            },
            status: 'merged',
            updatedAt: '2024-01-02T00:00:00Z'
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

      test('should support unapprove action', async () => {
        const mockResponse = {
          status: 200,
          data: {
            id: DEFAULT_ID,
            reviewedBy: {
              id: 12345678,
              name: 'Taylor Lee',
              username: 'taylor-lee'
            },
            status: 'open',
            updatedAt: '2024-01-02T00:00:00Z'
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
    });
  });
});


