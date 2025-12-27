const axios = require('axios');
const {
  getMonitors,
  createMonitor,
  getMonitor,
  updateMonitor,
  deleteMonitor,
  runMonitor
} = require('../monitor');
const { DEFAULT_ID, DEFAULT_UID } = require('../../__tests__/test-helpers');

jest.mock('axios');
jest.mock('../../core/config', () => ({
  apiKey: 'test-api-key',
  baseUrl: 'https://api.getpostman.com'
}));

describe('monitors unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMonitors', () => {
    test('should call GET /monitors without query params', async () => {
      const mockResponse = {
        status: 200,
        data: { monitors: [], meta: {} }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getMonitors();

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: 'https://api.getpostman.com/monitors'
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include workspace query param', async () => {
      const mockResponse = {
        status: 200,
        data: { monitors: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getMonitors(DEFAULT_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `https://api.getpostman.com/monitors?workspace=${DEFAULT_ID}`
        })
      );
    });

    test('should include active query param', async () => {
      const mockResponse = {
        status: 200,
        data: { monitors: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getMonitors(null, true);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.getpostman.com/monitors?active=true'
        })
      );
    });

    test('should include owner query param', async () => {
      const mockResponse = {
        status: 200,
        data: { monitors: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getMonitors(null, null, 12345678);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.getpostman.com/monitors?owner=12345678'
        })
      );
    });

    test('should include collectionUid query param', async () => {
      const mockResponse = {
        status: 200,
        data: { monitors: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getMonitors(null, null, null, DEFAULT_UID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `https://api.getpostman.com/monitors?collectionUid=${DEFAULT_UID}`
        })
      );
    });

    test('should include environmentUid query param', async () => {
      const mockResponse = {
        status: 200,
        data: { monitors: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getMonitors(null, null, null, null, DEFAULT_UID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `https://api.getpostman.com/monitors?environmentUid=${DEFAULT_UID}`
        })
      );
    });

    test('should include cursor and limit query params', async () => {
      const mockResponse = {
        status: 200,
        data: { monitors: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getMonitors(null, null, null, null, null, 'cursor-123', 10);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('cursor=cursor-123'),
          url: expect.stringContaining('limit=10')
        })
      );
    });

    test('should include all query params when provided', async () => {
      const mockResponse = {
        status: 200,
        data: { monitors: [] }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getMonitors(DEFAULT_ID, true, 12345678, DEFAULT_UID, DEFAULT_UID, 'cursor-abc', 25);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining(`workspace=${DEFAULT_ID}`),
          url: expect.stringContaining('active=true'),
          url: expect.stringContaining('owner=12345678'),
          url: expect.stringContaining(`collectionUid=${DEFAULT_UID}`),
          url: expect.stringContaining(`environmentUid=${DEFAULT_UID}`),
          url: expect.stringContaining('cursor=cursor-abc'),
          url: expect.stringContaining('limit=25')
        })
      );
    });
  });

  describe('createMonitor', () => {
    test('should call POST /monitors with monitor data', async () => {
      const mockResponse = {
        status: 200,
        data: {
          monitor: {
            id: DEFAULT_ID,
            name: 'Test Monitor',
            active: true,
            uid: DEFAULT_UID
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const monitorData = {
        name: 'Test Monitor',
        collection: DEFAULT_UID,
        schedule: {
          cron: '0 0 * * *',
          timezone: 'UTC'
        }
      };

      const result = await createMonitor(monitorData, DEFAULT_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: `https://api.getpostman.com/monitors?workspace=${DEFAULT_ID}`,
          data: {
            monitor: monitorData
          }
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include environment in monitor data', async () => {
      const mockResponse = {
        status: 200,
        data: {
          monitor: {
            id: DEFAULT_ID,
            name: 'Test Monitor'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const monitorData = {
        name: 'Test Monitor',
        collection: DEFAULT_UID,
        environment: DEFAULT_UID,
        schedule: {
          cron: '*/30 * * * *',
          timezone: 'America/New_York'
        }
      };

      await createMonitor(monitorData, DEFAULT_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            monitor: expect.objectContaining({
              environment: DEFAULT_UID
            })
          }
        })
      );
    });

    test('should include options in monitor data', async () => {
      const mockResponse = {
        status: 200,
        data: {
          monitor: {
            id: DEFAULT_ID,
            name: 'Test Monitor'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const monitorData = {
        name: 'Test Monitor',
        collection: DEFAULT_UID,
        schedule: {
          cron: '0 0 * * *',
          timezone: 'UTC'
        },
        options: {
          followRedirects: true,
          requestTimeout: 5000,
          strictSSL: true
        }
      };

      await createMonitor(monitorData, DEFAULT_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            monitor: expect.objectContaining({
              options: {
                followRedirects: true,
                requestTimeout: 5000,
                strictSSL: true
              }
            })
          }
        })
      );
    });

    test('should include notifications in monitor data', async () => {
      const mockResponse = {
        status: 200,
        data: {
          monitor: {
            id: DEFAULT_ID,
            name: 'Test Monitor'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const monitorData = {
        name: 'Test Monitor',
        collection: DEFAULT_UID,
        schedule: {
          cron: '0 0 * * *',
          timezone: 'UTC'
        },
        notifications: {
          onError: [{ email: 'dev@example.com' }],
          onFailure: [{ email: 'ops@example.com' }]
        }
      };

      await createMonitor(monitorData, DEFAULT_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            monitor: expect.objectContaining({
              notifications: {
                onError: [{ email: 'dev@example.com' }],
                onFailure: [{ email: 'ops@example.com' }]
              }
            })
          }
        })
      );
    });

    test('should include distribution in monitor data', async () => {
      const mockResponse = {
        status: 200,
        data: {
          monitor: {
            id: DEFAULT_ID,
            name: 'Test Monitor'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const monitorData = {
        name: 'Test Monitor',
        collection: DEFAULT_UID,
        schedule: {
          cron: '0 0 * * *',
          timezone: 'UTC'
        },
        distribution: [
          { region: 'us-east' },
          { region: 'eu-central' }
        ]
      };

      await createMonitor(monitorData, DEFAULT_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            monitor: expect.objectContaining({
              distribution: [
                { region: 'us-east' },
                { region: 'eu-central' }
              ]
            })
          }
        })
      );
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { monitor: {} }
      };
      axios.request.mockResolvedValue(mockResponse);

      await createMonitor({ name: 'Test', collection: DEFAULT_UID }, DEFAULT_ID);

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

  describe('getMonitor', () => {
    test('should call GET /monitors/{monitorId}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          monitor: {
            id: DEFAULT_ID,
            name: 'Test Monitor',
            uid: DEFAULT_UID,
            active: true
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await getMonitor(DEFAULT_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'get',
          url: `https://api.getpostman.com/monitors/${DEFAULT_ID}`
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { monitor: {} }
      };
      axios.request.mockResolvedValue(mockResponse);

      await getMonitor(DEFAULT_ID);

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

  describe('updateMonitor', () => {
    test('should call PUT /monitors/{monitorId}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          monitor: {
            id: DEFAULT_ID,
            name: 'Updated Monitor',
            active: true,
            uid: DEFAULT_UID
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const monitorData = {
        name: 'Updated Monitor'
      };

      const result = await updateMonitor(DEFAULT_ID, monitorData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'put',
          url: `https://api.getpostman.com/monitors/${DEFAULT_ID}`,
          data: {
            monitor: monitorData
          }
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should update schedule', async () => {
      const mockResponse = {
        status: 200,
        data: {
          monitor: {
            id: DEFAULT_ID,
            name: 'Test Monitor'
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const monitorData = {
        schedule: {
          cron: '0 */6 * * *',
          timezone: 'America/Los_Angeles'
        }
      };

      await updateMonitor(DEFAULT_ID, monitorData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            monitor: expect.objectContaining({
              schedule: {
                cron: '0 */6 * * *',
                timezone: 'America/Los_Angeles'
              }
            })
          }
        })
      );
    });

    test('should update active status', async () => {
      const mockResponse = {
        status: 200,
        data: {
          monitor: {
            id: DEFAULT_ID,
            active: false
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const monitorData = {
        active: false
      };

      await updateMonitor(DEFAULT_ID, monitorData);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            monitor: expect.objectContaining({
              active: false
            })
          }
        })
      );
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { monitor: {} }
      };
      axios.request.mockResolvedValue(mockResponse);

      await updateMonitor(DEFAULT_ID, { name: 'Test' });

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

  describe('deleteMonitor', () => {
    test('should call DELETE /monitors/{monitorId}', async () => {
      const mockResponse = {
        status: 200,
        data: {
          monitor: {
            id: DEFAULT_ID,
            uid: DEFAULT_UID
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await deleteMonitor(DEFAULT_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'delete',
          url: `https://api.getpostman.com/monitors/${DEFAULT_ID}`
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { monitor: {} }
      };
      axios.request.mockResolvedValue(mockResponse);

      await deleteMonitor(DEFAULT_ID);

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

  describe('runMonitor', () => {
    test('should call POST /monitors/{monitorId}/run without query params', async () => {
      const mockResponse = {
        status: 200,
        data: {
          run: {
            info: {
              jobId: 'job-123',
              monitorId: DEFAULT_ID,
              name: 'Test Monitor',
              status: 'success'
            },
            stats: {
              assertions: { total: 5, failed: 0 },
              requests: { total: 3, failed: 0 }
            },
            executions: [],
            failures: []
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      const result = await runMonitor(DEFAULT_ID);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: `https://api.getpostman.com/monitors/${DEFAULT_ID}/run`
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should include async query param when true', async () => {
      const mockResponse = {
        status: 200,
        data: {
          run: {
            info: {
              jobId: 'job-123',
              monitorId: DEFAULT_ID,
              status: 'running'
            }
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await runMonitor(DEFAULT_ID, true);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `https://api.getpostman.com/monitors/${DEFAULT_ID}/run?async=true`
        })
      );
    });

    test('should include async query param when false', async () => {
      const mockResponse = {
        status: 200,
        data: {
          run: {
            info: {
              jobId: 'job-123'
            }
          }
        }
      };
      axios.request.mockResolvedValue(mockResponse);

      await runMonitor(DEFAULT_ID, false);

      expect(axios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `https://api.getpostman.com/monitors/${DEFAULT_ID}/run?async=false`
        })
      );
    });

    test('should include correct headers', async () => {
      const mockResponse = {
        status: 200,
        data: { run: {} }
      };
      axios.request.mockResolvedValue(mockResponse);

      await runMonitor(DEFAULT_ID);

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

