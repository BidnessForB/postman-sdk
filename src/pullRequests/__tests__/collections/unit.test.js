const axios = require('axios');

const { DEFAULT_ID, DEFAULT_UID } = require('../../../__tests__/test-helpers');
const {
  getCollectionPullRequests,
  createCollectionPullRequest
} = require('../../../collections/index');

jest.mock('axios');
jest.mock('../../../core/config', () => ({
  apiKey: 'test-api-key',
  baseUrl: 'https://api.getpostman.com'
}));

describe('unit tests', () => {
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
          const destinationId = DEFAULT_ID;
          const reviewers = ['12345678', '87654321'];
          const description = 'PR description';

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
            data: { id: DEFAULT_ID }
          };
          axios.request.mockResolvedValue(mockResponse);

          const title = 'PR Title';
          const destinationId = DEFAULT_ID;
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
            data: { id: DEFAULT_ID }
          };
          axios.request.mockResolvedValue(mockResponse);

          await createCollectionPullRequest(
            DEFAULT_UID,
            'Title',
            DEFAULT_ID,
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
            data: { id: DEFAULT_ID }
          };
          axios.request.mockResolvedValue(mockResponse);

          const reviewers = ['12345678', '87654321', '11111111'];

          await createCollectionPullRequest(
            DEFAULT_UID,
            'Title',
            DEFAULT_ID,
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
  });
});

