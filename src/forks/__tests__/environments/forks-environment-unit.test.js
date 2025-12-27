const axios = require('axios');

const { DEFAULT_ID, DEFAULT_UID } = require('../../../__tests__/test-helpers');
const { 
  getEnvironmentForks,
  createEnvironmentFork,
  mergeEnvironmentFork,
  pullEnvironmentChanges
} = require('../../../environments/environment');

jest.mock('axios');
jest.mock('../../../core/config', () => ({
  apiKey: 'test-api-key',
  baseUrl: 'https://api.getpostman.com'
}));

describe('forks', () => {
  describe('environments', () => {
    describe('unit tests', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      describe('getEnvironmentForks', () => {
        test('should call GET /environments/{environmentUid}/forks without query params', async () => {
          const mockResponse = {
            status: 200,
            data: { 
              data: [],
              meta: { nextCursor: null, total: 0 }
            }
          };
          axios.request.mockResolvedValue(mockResponse);

          const result = await getEnvironmentForks(DEFAULT_UID);

          expect(axios.request).toHaveBeenCalledWith(
            expect.objectContaining({
              method: 'get',
              url: `https://api.getpostman.com/environments/${DEFAULT_UID}/forks`
            })
          );
          expect(result).toEqual(mockResponse);
        });

        test('should include cursor query param when provided', async () => {
          const mockResponse = {
            status: 200,
            data: { 
              data: [],
              meta: { nextCursor: null, total: 0 }
            }
          };
          axios.request.mockResolvedValue(mockResponse);

          const cursor = 'cursor-abc-123';
          await getEnvironmentForks(DEFAULT_UID, cursor);

          expect(axios.request).toHaveBeenCalledWith(
            expect.objectContaining({
              url: `https://api.getpostman.com/environments/${DEFAULT_UID}/forks?cursor=${cursor}`
            })
          );
        });

        test('should include direction query param when provided', async () => {
          const mockResponse = {
            status: 200,
            data: { 
              data: [],
              meta: { nextCursor: null, total: 0 }
            }
          };
          axios.request.mockResolvedValue(mockResponse);

          await getEnvironmentForks(DEFAULT_UID, null, 'desc');

          expect(axios.request).toHaveBeenCalledWith(
            expect.objectContaining({
              url: `https://api.getpostman.com/environments/${DEFAULT_UID}/forks?direction=desc`
            })
          );
        });

        test('should include limit query param when provided', async () => {
          const mockResponse = {
            status: 200,
            data: { 
              data: [],
              meta: { nextCursor: null, total: 0 }
            }
          };
          axios.request.mockResolvedValue(mockResponse);

          await getEnvironmentForks(DEFAULT_UID, null, null, 20);

          expect(axios.request).toHaveBeenCalledWith(
            expect.objectContaining({
              url: `https://api.getpostman.com/environments/${DEFAULT_UID}/forks?limit=20`
            })
          );
        });

        test('should include sort query param when provided', async () => {
          const mockResponse = {
            status: 200,
            data: { 
              data: [],
              meta: { nextCursor: null, total: 0 }
            }
          };
          axios.request.mockResolvedValue(mockResponse);

          await getEnvironmentForks(DEFAULT_UID, null, null, null, 'createdAt');

          expect(axios.request).toHaveBeenCalledWith(
            expect.objectContaining({
              url: `https://api.getpostman.com/environments/${DEFAULT_UID}/forks?sort=createdAt`
            })
          );
        });

        test('should include all query params when provided', async () => {
          const mockResponse = {
            status: 200,
            data: { 
              data: [],
              meta: { nextCursor: null, total: 0 }
            }
          };
          axios.request.mockResolvedValue(mockResponse);

          const cursor = 'cursor-xyz';
          await getEnvironmentForks(DEFAULT_UID, cursor, 'asc', 10, 'createdAt');

          expect(axios.request).toHaveBeenCalledWith(
            expect.objectContaining({
              url: expect.stringContaining(`cursor=${cursor}`),
              url: expect.stringContaining('direction=asc'),
              url: expect.stringContaining('limit=10'),
              url: expect.stringContaining('sort=createdAt')
            })
          );
        });

        test('should include correct headers', async () => {
          const mockResponse = {
            status: 200,
            data: { 
              data: [],
              meta: { nextCursor: null, total: 0 }
            }
          };
          axios.request.mockResolvedValue(mockResponse);

          await getEnvironmentForks(DEFAULT_UID);

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

      describe('createEnvironmentFork', () => {
        test('should call POST /environments/{environmentUid}/forks', async () => {
          const mockResponse = {
            status: 200,
            data: {
              environment: {
                forkName: 'Test Fork',
                uid: DEFAULT_UID,
                name: 'Forked Environment'
              }
            }
          };
          axios.request.mockResolvedValue(mockResponse);

          const forkName = 'Test Fork';
          const result = await createEnvironmentFork(DEFAULT_UID, DEFAULT_ID, forkName);

          expect(axios.request).toHaveBeenCalledWith(
            expect.objectContaining({
              method: 'post',
              url: `https://api.getpostman.com/environments/${DEFAULT_UID}/forks?workspace=${DEFAULT_ID}`,
              data: {
                forkName: forkName
              },
              headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'test-api-key'
              }
            })
          );
          expect(result).toEqual(mockResponse);
        });
      });

      describe('mergeEnvironmentFork', () => {
        test('should call POST /environments/{environmentUid}/merges', async () => {
          const mockResponse = {
            status: 200,
            data: {
              environment: {
                uid: DEFAULT_UID
              }
            }
          };
          axios.request.mockResolvedValue(mockResponse);

          const result = await mergeEnvironmentFork(DEFAULT_UID);

          expect(axios.request).toHaveBeenCalledWith(
            expect.objectContaining({
              method: 'post',
              url: `https://api.getpostman.com/environments/${DEFAULT_UID}/merges`,
              headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'test-api-key'
              }
            })
          );
          expect(result).toEqual(mockResponse);
        });
      });

      describe('pullEnvironmentChanges', () => {
        test('should call POST /environments/{environmentUid}/pulls', async () => {
          const mockResponse = {
            status: 200,
            data: {
              environment: {
                uid: DEFAULT_UID
              }
            }
          };
          axios.request.mockResolvedValue(mockResponse);

          const result = await pullEnvironmentChanges(DEFAULT_UID);

          expect(axios.request).toHaveBeenCalledWith(
            expect.objectContaining({
              method: 'post',
              url: `https://api.getpostman.com/environments/${DEFAULT_UID}/pulls`,
              headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'test-api-key'
              }
            })
          );
          expect(result).toEqual(mockResponse);
        });
      });
    });
  });
});

