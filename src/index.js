/**
 * Postman SDK - Main entry point
 * Exports all resource modules
 */

module.exports = {
  collections: require('./collections'),
  workspaces: require('./workspaces'),
  specs: require('./specs')
}; 

