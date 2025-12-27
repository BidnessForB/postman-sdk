const axios = require('axios');

const { DEFAULT_ID, DEFAULT_UID } = require('../../__tests__/test-helpers');
const { 
  getCollectionForks,
  createCollectionFork,
  mergeCollectionFork,
  pullCollectionChanges
} = require('../../collections/collection');

jest.mock('axios');
jest.mock('../../core/config', () => ({
  apiKey: 'test-api-key',
  baseUrl: 'https://api.getpostman.com'
}));


  
    describe('Forks Collections Unit Tests', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      describe('getCollectionForks', () => {
        test('should call GET /collections/collection-forks without query params', async () => {
          const mockResponse = {
            status: 200,
            data: { forks: [] }
          };
          axios.request.mockResolvedValue(mockResponse);

          const result = await getCollectionForks();

          expect(axios.request).toHaveBeenCalledWith(
            expect.objectContaining({
              method: 'get',
              url: 'https://api.getpostman.com/collections/collection-forks'
            })
          );
          expect(result).toEqual(mockResponse);
        });

        test('should include cursor query param when provided', async () => {
          const mockResponse = {
            status: 200,
            data: { forks: [] }
          };
          axios.request.mockResolvedValue(mockResponse);

          const cursor = 'cursor-abc-123';
          await getCollectionForks(cursor);

          expect(axios.request).toHaveBeenCalledWith(
            expect.objectContaining({
              url: `https://api.getpostman.com/collections/collection-forks?cursor=${cursor}`
            })
          );
        });

        test('should include direction query param when provided', async () => {
          const mockResponse = {
            status: 200,
            data: { forks: [] }
          };
          axios.request.mockResolvedValue(mockResponse);

          await getCollectionForks(null, 'desc');

          expect(axios.request).toHaveBeenCalledWith(
            expect.objectContaining({
              url: 'https://api.getpostman.com/collections/collection-forks?direction=desc'
            })
          );
        });

        test('should include limit query param when provided', async () => {
          const mockResponse = {
            status: 200,
            data: { forks: [] }
          };
          axios.request.mockResolvedValue(mockResponse);

          await getCollectionForks(null, null, 20);

          expect(axios.request).toHaveBeenCalledWith(
            expect.objectContaining({
              url: 'https://api.getpostman.com/collections/collection-forks?limit=20'
            })
          );
        });

        test('should include all query params when provided', async () => {
          const mockResponse = {
            status: 200,
            data: { forks: [] }
          };
          axios.request.mockResolvedValue(mockResponse);

          const cursor = 'cursor-xyz';
          await getCollectionForks(cursor, 'asc', 10);

          expect(axios.request).toHaveBeenCalledWith(
            expect.objectContaining({
              url: expect.stringContaining(`cursor=${cursor}`),
              url: expect.stringContaining('direction=asc'),
              url: expect.stringContaining('limit=10')
            })
          );
        });

        test('should include correct headers', async () => {
          const mockResponse = {
            status: 200,
            data: { forks: [] }
          };
          axios.request.mockResolvedValue(mockResponse);

          await getCollectionForks();

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

      describe('createCollectionFork', () => {
        test('should call POST /collections/fork/{collectionId}', async () => {
          const mockResponse = {
            status: 200,
            data: {
              collection: {
                id: DEFAULT_ID,
                uid: DEFAULT_UID,
                name: 'Forked Collection',
                fork: {
                  label: 'Test Fork',
                  createdAt: '2025-01-01T00:00:00Z',
                  from: DEFAULT_ID
                }
              }
            }
          };
          axios.request.mockResolvedValue(mockResponse);

          const label = 'Test Fork';
          const result = await createCollectionFork(DEFAULT_ID, DEFAULT_ID, label);

          expect(axios.request).toHaveBeenCalledWith(
            expect.objectContaining({
              method: 'post',
              url: `https://api.getpostman.com/collections/fork/${DEFAULT_ID}?workspace=${DEFAULT_ID}`,
              data: {
                label: label,
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

      describe('mergeCollectionFork', () => {
        test('should call POST /collections/merge with source and destination', async () => {
          const mockResponse = {
            status: 200,
            data: {
              collection: {
                id: DEFAULT_ID,
                uid: DEFAULT_UID,
                name: 'Merged Collection'
              }
            }
          };
          axios.request.mockResolvedValue(mockResponse);

          const sourceUid = DEFAULT_UID;
          const destinationUid = `${DEFAULT_UID.split('-')[0]}-aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee`;

          const result = await mergeCollectionFork(sourceUid, destinationUid);

          expect(axios.request).toHaveBeenCalledWith(
            expect.objectContaining({
              method: 'post',
              url: 'https://api.getpostman.com/collections/merge',
              data: {
                source: sourceUid,
                destination: destinationUid
              }
            })
          );
          expect(result).toEqual(mockResponse);
        });

        test('should include strategy when provided', async () => {
          const mockResponse = {
            status: 200,
            data: { collection: {} }
          };
          axios.request.mockResolvedValue(mockResponse);

          const sourceUid = DEFAULT_UID;
          const destinationUid = `${DEFAULT_UID.split('-')[0]}-aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee`;
          const strategy = 'deleteSource';

          await mergeCollectionFork(sourceUid, destinationUid, strategy);

          expect(axios.request).toHaveBeenCalledWith(
            expect.objectContaining({
              data: {
                source: sourceUid,
                destination: destinationUid,
                strategy: strategy
              }
            })
          );
        });

        test('should not include strategy when null', async () => {
          const mockResponse = {
            status: 200,
            data: { collection: {} }
          };
          axios.request.mockResolvedValue(mockResponse);

          const sourceUid = DEFAULT_UID;
          const destinationUid = `${DEFAULT_UID.split('-')[0]}-aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee`;

          await mergeCollectionFork(sourceUid, destinationUid, null);

          expect(axios.request).toHaveBeenCalledWith(
            expect.objectContaining({
              data: {
                source: sourceUid,
                destination: destinationUid
              }
            })
          );
        });

        test('should include correct headers', async () => {
          const mockResponse = {
            status: 200,
            data: { collection: {} }
          };
          axios.request.mockResolvedValue(mockResponse);

          const sourceUid = DEFAULT_UID;
          const destinationUid = `${DEFAULT_UID.split('-')[0]}-aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee`;

          await mergeCollectionFork(sourceUid, destinationUid);

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

      describe('pullCollectionChanges', () => {
        test('should call PUT /collections/{collectionId}/pulls', async () => {
          const mockResponse = {
            status: 200,
            data: {
              collection: {
                destinationId: DEFAULT_ID,
                sourceId: 'parent-collection-id'
              }
            }
          };
          axios.request.mockResolvedValue(mockResponse);

          const result = await pullCollectionChanges(DEFAULT_ID);

          expect(axios.request).toHaveBeenCalledWith(
            expect.objectContaining({
              method: 'put',
              url: `https://api.getpostman.com/collections/${DEFAULT_ID}/pulls`,
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
            data: {
              collection: {
                destinationId: DEFAULT_ID,
                sourceId: 'parent-id'
              }
            }
          };
          axios.request.mockResolvedValue(mockResponse);

          await pullCollectionChanges(DEFAULT_ID);

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



