/**
 * Postman SDK - A comprehensive SDK for interacting with the Postman API
 * 
 * @module postman-sdk
 * @version 0.8.1
 * @description Barebones SDK for the Postman API providing methods to manage collections, 
 * workspaces, API specifications, environments, mocks, and more.
 * 
 * @example
 * // Import the SDK
 * const postman = require('@bidnessforb/postman-sdk');
 * 
 * // Use collections module
 * const collections = await postman.collections.getCollections('workspace-id');
 * 
 * // Use workspaces module
 * const workspaces = await postman.workspaces.getWorkspaces();
 * 
 * @see {@link https://learning.postman.com/docs/developer/postman-api/intro-api/|Postman API Documentation}
 */

module.exports = {
  /**
   * Collections module - Manage Postman collections, folders, and comments
   * @type {object}
   * @property {Function} getCollections - Get all collections
   * @property {Function} createCollection - Create a new collection
   * @property {Function} getCollection - Get a specific collection
   * @property {Function} updateCollection - Update a collection
   * @property {Function} modifyCollection - Partially update a collection
   * @property {Function} deleteCollection - Delete a collection
   */
  collections: require('./collections/collection'),
  
  /**
   * Requests module - Manage requests within collections
   * @type {object}
   * @property {Function} createRequest - Create a request
   * @property {Function} getRequest - Get a request
   * @property {Function} updateRequest - Update a request
   * @property {Function} deleteRequest - Delete a request
   * @property {Function} getRequestComments - Get request comments
   * @property {Function} createRequestComment - Create a request comment
   */
  requests: require('./requests/request'),
  
  /**
   * Responses module - Manage responses for requests
   * @type {object}
   * @property {Function} createResponse - Create a response
   * @property {Function} getResponse - Get a response
   * @property {Function} updateResponse - Update a response
   * @property {Function} deleteResponse - Delete a response
   * @property {Function} getResponseComments - Get response comments
   */
  responses: require('./responses/response'),
  
  /**
   * Workspaces module - Manage Postman workspaces
   * @type {object}
   * @property {Function} getWorkspaces - Get all workspaces
   * @property {Function} createWorkspace - Create a workspace
   * @property {Function} getWorkspace - Get a workspace
   * @property {Function} updateWorkspace - Update a workspace
   * @property {Function} deleteWorkspace - Delete a workspace
   */
  workspaces: require('./workspaces/workspace'),
  
  /**
   * Specs module - Manage API specifications
   * @type {object}
   * @property {Function} getSpecs - Get all specs
   * @property {Function} createSpec - Create a spec
   * @property {Function} getSpec - Get a spec
   * @property {Function} modifySpec - Update a spec
   * @property {Function} deleteSpec - Delete a spec
   * @property {Function} getSpecFiles - Get spec files
   */
  specs: require('./specs/spec'),
  
  /**
   * Environments module - Manage Postman environments
   * @type {object}
   * @property {Function} getEnvironments - Get all environments
   * @property {Function} createEnvironment - Create an environment
   * @property {Function} getEnvironment - Get an environment
   * @property {Function} modifyEnvironment - Update an environment
   * @property {Function} deleteEnvironment - Delete an environment
   */
  environments: require('./environments/environment'),
  
  /**
   * Groups module - Get information about team groups
   * @type {object}
   * @property {Function} getGroups - Get all groups
   * @property {Function} getGroup - Get a specific group
   */
  groups: require('./groups/group'),
  
  /**
   * Tags module - Manage and query tags
   * @type {object}
   * @property {Function} getTagEntities - Get entities by tag
   */
  tags: require('./tags/tag'),
  
  /**
   * Users module - Get user information
   * @type {object}
   * @property {Function} getAuthenticatedUser - Get authenticated user info
   */
  users: require('./users/user'),
  
  /**
   * Mocks module - Manage mock servers
   * @type {object}
   * @property {Function} getMocks - Get all mocks
   * @property {Function} createMock - Create a mock server
   * @property {Function} getMock - Get a mock
   * @property {Function} updateMock - Update a mock
   * @property {Function} deleteMock - Delete a mock
   */
  mocks: require('./mocks/mock'),
  
  /**
   * Pull Requests module - Manage pull requests
   * @type {object}
   * @property {Function} getPullRequest - Get a pull request
   * @property {Function} updatePullRequest - Update a pull request
   * @property {Function} reviewPullRequest - Review a pull request (approve, decline, merge, unapprove)
   */
  pullRequests: require('./pullRequests/pullRequest')
}; 

