/**
 * Postman SDK - Main entry point
 * Exports all resource modules
 */

module.exports = {
  collections: require('./collections'),
  workspaces: require('./workspaces'),
  specs: require('./specs'),
  environments: require('./environments'),
  tags: require('./tags')
}; 

