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
    const { POSTMAN_API_KEY_ENV_VAR } = require('../constants');
    process.env[POSTMAN_API_KEY_ENV_VAR] = 'test-api-key-123';
    const config = require('../config');
    expect(config.apiKey).toBe('test-api-key-123');
  });

  test('should set base URL correctly', () => {
    const config = require('../config');
    expect(config.baseUrl).toBe('https://api.getpostman.com');
  });

  test('should handle missing API key', () => {
    const { POSTMAN_API_KEY_ENV_VAR } = require('../constants');
    delete process.env[POSTMAN_API_KEY_ENV_VAR];
    const config = require('../config');
    expect(config.apiKey).toBeUndefined();
  });

  test('should export POSTMAN_API_KEY_ENV_VAR constant', () => {
    const config = require('../config');
    expect(config.POSTMAN_API_KEY_ENV_VAR).toBe('POSTMAN_API_KEY_POSTMAN');
  });
});

