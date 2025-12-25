/**
 * Postman SDK - Main entry point
 * Exports all resource modules
 */

module.exports = {
  collections: require('./collections'),
  requests: require('./requests'),
  responses: require('./responses'),
  workspaces: require('./workspaces'),
  specs: require('./specs'),
  environments: require('./environments'),
  tags: require('./tags'),
  users: require('./users'),
  mocks: require('./mocks')
}; 

