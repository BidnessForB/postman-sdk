module.exports = {
  testEnvironment: 'node',
  runInBand: true,  // Force tests to run sequentially in order
  testMatch: ['**/__tests__/**/*.test.js'],
  testTimeout: 30000, // Default 30s for most tests (individual tests can override)
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/__tests__/**',
    '!src/__tests__/**',
    '!src/pmansdkexample*.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'json-summary'],
  verbose: true,
  // Optimize test execution
  maxWorkers: '50%'
};

