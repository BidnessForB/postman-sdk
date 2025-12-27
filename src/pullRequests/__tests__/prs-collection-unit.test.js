const axios = require('axios');

const { DEFAULT_ID, DEFAULT_UID } = require('../../__tests__/test-helpers');
const {
  getCollectionPullRequests,
  createCollectionPullRequest
} = require('../../collections/collection');

jest.mock('axios');
jest.mock('../../core/config', () => ({
  apiKey: 'test-api-key',
  baseUrl: 'https://api.getpostman.com'
}));

describe('Collection Pull Requests Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCollectionPullRequests', () => {
    test('should call GET /collections/{collectionUid}/pull-requests', async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: [
            {
              id: DEFAULT_ID,
              title: 'Test PR',
              description: 'Test pull request',
              status: 'open',
              sourceId: 'source-id',
              destinationId: 'dest-id',
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
              createdBy: '12345678',
              updatedBy: '12345678',
              href: `/pull-requests/${DEFAULT_ID}`
            }
          ]
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getCollectionPullRequests(DEFAULT_UID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `https://api.getpostman.com/collections/${DEFAULT_UID}/pull-requests`,
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
        data: { data: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getCollectionPullRequests(DEFAULT_UID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key'
          })
        })
      );
    });

    test('should throw error for invalid UID format', async () => {
      await expect(getCollectionPullRequests('invalid-uid')).rejects.toThrow();
      expect(axios.request).not.toHaveBeenCalled();
    });

    test('should throw error for null UID', async () => {
      await expect(getCollectionPullRequests(null)).rejects.toThrow();
      expect(axios.request).not.toHaveBeenCalled();
    });

    test('should throw error for undefined UID', async () => {
      await expect(getCollectionPullRequests(undefined)).rejects.toThrow();
      expect(axios.request).not.toHaveBeenCalled();
    });

    test('should handle API errors', async () => {
      const mockError = new Error('API Error');
      mockError.response = {
        status: 404,
        data: { error: { message: 'Collection not found' } }
      };
      axios.request.mockRejectedValue(mockError);

      await expect(getCollectionPullRequests(DEFAULT_UID)).rejects.toThrow('API Error');
    });
  });

  describe('createCollectionPullRequest', () => {
    test('should call POST /collections/{collectionUid}/pull-requests with all fields', async () => {
      const mockResponse = {
        status: 200,
        data: {
          id: DEFAULT_ID,
          title: 'New PR',
          description: 'PR description',
          sourceId: DEFAULT_UID,
          destinationId: DEFAULT_ID,
          status: 'open',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          createdBy: '12345678'
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const title = 'New PR';
      const destinationUid = DEFAULT_UID;
      const reviewers = ['12345678', '87654321'];
      const description = 'PR description';
const destinationId = destinationUid;
      const result = await createCollectionPullRequest(
        DEFAULT_UID,
        title,
        destinationId,
        reviewers,
        description
      );

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: `https://api.getpostman.com/collections/${DEFAULT_UID}/pull-requests`,
          data: {
            title,
            destinationId,
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
        data: { id: DEFAULT_ID, destinationId: DEFAULT_UID }
      };
      axios.request.mockResolvedValue(mockResponse);

      const title = 'PR Title';
      const destinationUid = DEFAULT_UID;
      const destinationId = destinationUid;
      const reviewers = ['12345678'];

      await createCollectionPullRequest(
        DEFAULT_UID,
        title,
        destinationId,
        reviewers
      );

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            title,
            destinationId,
            reviewers
          }
        })
      );
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { id: DEFAULT_UID }
      };
      axios.request.mockResolvedValue(mockResponse);

      await createCollectionPullRequest(
        DEFAULT_UID,
        'Title',
        DEFAULT_UID,
        ['12345678']
      );

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
        data: { id: DEFAULT_UID }
      };
      axios.request.mockResolvedValue(mockResponse);

      const reviewers = ['12345678', '87654321', '11111111'];

      await createCollectionPullRequest(
        DEFAULT_UID,
        'Title',
        DEFAULT_UID,
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

    test('should throw error for invalid collection UID format', async () => {
      await expect(
        createCollectionPullRequest('invalid-uid', 'Title', DEFAULT_UID, ['12345678'])
      ).rejects.toThrow();
      expect(axios.request).not.toHaveBeenCalled();
    });

    test('should throw error for invalid destination ID format', async () => {
      await expect(
        createCollectionPullRequest(DEFAULT_UID, 'Title', 'invalid-id', ['12345678'])
      ).rejects.toThrow();
      expect(axios.request).not.toHaveBeenCalled();
    });

    test('should throw error for null collection UID', async () => {
      await expect(
        createCollectionPullRequest(null, 'Title', DEFAULT_ID, ['12345678'])
      ).rejects.toThrow();
      expect(axios.request).not.toHaveBeenCalled();
    });

    test('should throw error for null destination ID', async () => {
      await expect(
        createCollectionPullRequest(DEFAULT_UID, 'Title', null, ['12345678'])
      ).rejects.toThrow();
      expect(axios.request).not.toHaveBeenCalled();
    });

    test('should throw error for undefined title', async () => {
      await expect(
        createCollectionPullRequest(DEFAULT_UID, undefined, DEFAULT_ID, ['12345678'])
      ).rejects.toThrow();
      expect(axios.request).not.toHaveBeenCalled();
    });

    test('should throw error for undefined reviewers', async () => {
      await expect(
        createCollectionPullRequest(DEFAULT_UID, 'Title', DEFAULT_ID, undefined)
      ).rejects.toThrow();
      expect(axios.request).not.toHaveBeenCalled();
    });

    test('should handle API errors', async () => {
      const mockError = new Error('API Error');
      mockError.response = {
        status: 400,
        data: { error: { message: 'Pull request already exists' } }
      };
      axios.request.mockRejectedValue(mockError);

      await expect(
        createCollectionPullRequest(DEFAULT_UID, 'Title', DEFAULT_UID, ['12345678'])
      ).rejects.toThrow('API Error');
    });

    test('should handle empty reviewers array', async () => {
      const mockResponse = {
        status: 200,
        data: { id: DEFAULT_UID }
      };
      axios.request.mockResolvedValue(mockResponse);

      await createCollectionPullRequest(
        DEFAULT_UID,
        'Title',
        DEFAULT_UID,
        []
      );

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            reviewers: []
          })
        })
      );
    });
  });
});

