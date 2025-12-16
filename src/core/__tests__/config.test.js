describe('config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('should read API key from environment variable', () => {
    process.env.POSTMAN_API_KEY_POSTMAN = 'test-api-key-123';
    const config = require('../config');
    expect(config.apiKey).toBe('test-api-key-123');
  });

  test('should set base URL correctly', () => {
    const config = require('../config');
    expect(config.baseUrl).toBe('https://api.getpostman.com');
  });

  test('should handle missing API key', () => {
    delete process.env.POSTMAN_API_KEY_POSTMAN;
    const config = require('../config');
    expect(config.apiKey).toBeUndefined();
  });
});

