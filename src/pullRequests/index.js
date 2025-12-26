const { buildAxiosConfig, executeRequest } = require('../core/request');
const { validateId } = require('../core/utils');

/**
 * Gets information about a pull request
 * Postman API endpoint and method: GET /pull-requests/{pullRequestId}
 * @param {string} pullRequestId - The pull request's ID
 * @returns {Promise} Axios response with pull request details including source, destination, status, reviewers, and merge status
 * @example
 * // Get a pull request
 * const response = await getPullRequest('4e1a6609-1a29-4037-a411-89ecc14c6cd8');
 * console.log(response.data.title);
 * console.log(response.data.status); // 'open', 'approved', 'declined'
 * console.log(response.data.source);
 * console.log(response.data.destination);
 * console.log(response.data.reviewers);
 */
async function getPullRequest(pullRequestId) {
  validateId(pullRequestId, 'pullRequestId');

  const endpoint = `/pull-requests/${pullRequestId}`;
  const config = buildAxiosConfig('get', endpoint);
  return await executeRequest(config);
}

/**
 * Updates an open pull request's title, description, and reviewers
 * Postman API endpoint and method: PUT /pull-requests/{pullRequestId}
 * @param {string} pullRequestId - The pull request's ID
 * @param {string} title - The pull request's updated title (required)
 * @param {Array<string>} reviewers - Array of reviewer user IDs (required, replaces all existing reviewers)
 * @param {string} [description] - The updated pull request description (optional)
 * @returns {Promise} Axios response with updated pull request details
 * @example
 * // Update a pull request
 * const response = await updatePullRequest(
 *   '4e1a6609-1a29-4037-a411-89ecc14c6cd8',
 *   'Updated PR Title',
 *   ['12345678', '87654321'],
 *   'Updated description with more details'
 * );
 * console.log(response.data.title);
 * console.log(response.data.status);
 * 
 * @example
 * // Update just title and reviewers (no description)
 * const response = await updatePullRequest(
 *   '4e1a6609-1a29-4037-a411-89ecc14c6cd8',
 *   'New Title',
 *   ['12345678']
 * );
 */
async function updatePullRequest(pullRequestId, title, reviewers, description = null) {
  validateId(pullRequestId, 'pullRequestId');

  const endpoint = `/pull-requests/${pullRequestId}`;
  const data = {
    title,
    reviewers
  };

  if (description !== null) {
    data.description = description;
  }

  const config = buildAxiosConfig('put', endpoint, data);
  return await executeRequest(config);
}

/**
 * Reviews a pull request by performing an action (approve, decline, merge, or unapprove)
 * Postman API endpoint and method: POST /pull-requests/{pullRequestId}/tasks
 * @param {string} pullRequestId - The pull request's ID
 * @param {string} action - The action to perform: 'approve', 'decline', 'merge', or 'unapprove' (required)
 * @param {string} [comment] - Optional comment, required if action is 'decline'
 * @returns {Promise} Axios response with review result including id, reviewedBy, status, and updatedAt
 * @example
 * // Approve a pull request
 * const response = await reviewPullRequest(
 *   '4e1a6609-1a29-4037-a411-89ecc14c6cd8',
 *   'approve'
 * );
 * console.log(response.data.status); // 'approved'
 * console.log(response.data.reviewedBy);
 * 
 * @example
 * // Decline a pull request with a comment
 * const response = await reviewPullRequest(
 *   '4e1a6609-1a29-4037-a411-89ecc14c6cd8',
 *   'decline',
 *   'Missing required documentation in requests'
 * );
 * console.log(response.data.status); // 'declined'
 * 
 * @example
 * // Merge an approved pull request
 * const response = await reviewPullRequest(
 *   '4e1a6609-1a29-4037-a411-89ecc14c6cd8',
 *   'merge'
 * );
 * console.log(response.data.status); // 'merged'
 * 
 * @example
 * // Unapprove a pull request (revoke approval)
 * const response = await reviewPullRequest(
 *   '4e1a6609-1a29-4037-a411-89ecc14c6cd8',
 *   'unapprove'
 * );
 * console.log(response.data.status); // 'open'
 */
async function reviewPullRequest(pullRequestId, action, comment = null) {
  validateId(pullRequestId, 'pullRequestId');

  const endpoint = `/pull-requests/${pullRequestId}/tasks`;
  const data = {
    action
  };

  if (comment !== null) {
    data.comment = comment;
  }

  const config = buildAxiosConfig('post', endpoint, data);
  return await executeRequest(config);
}

module.exports = {
  getPullRequest,
  updatePullRequest,
  reviewPullRequest
};


