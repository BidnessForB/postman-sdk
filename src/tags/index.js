const { buildAxiosConfig, executeRequest } = require('../core/request');
const { buildQueryString } = require('../core/utils');

/**
 * Gets Postman elements (entities) by a given tag
 * Postman API endpoint and method: GET /tags/{slugId}/entities
 * @param {string} slugId - The tag's ID/slug (e.g., 'needs-review', 'production')
 * @param {number} [limit] - Maximum number of tagged elements to return (max 50, default 10)
 * @param {string} [direction] - Sort order: 'asc' or 'desc' based on tagging time
 * @param {string} [cursor] - Pagination cursor from previous response's meta.nextCursor
 * @param {string} [entityType] - Filter by element type: 'api', 'collection', or 'workspace'
 * @returns {Promise} Axios response with data.entities array and meta.count
 * 
 * @example
 * // Get all entities with 'production' tag
 * const result = await getTagEntities('production');
 * 
 * @example
 * // Get only collections with 'needs-review' tag
 * const result = await getTagEntities('needs-review', null, null, null, 'collection');
 * 
 * @example
 * // Get entities with pagination
 * const result = await getTagEntities('api-v2', 20, 'desc', nextCursor);
 */
async function getTagEntities(slugId, limit = null, direction = null, cursor = null, entityType = null) {
  const endpoint = `/tags/${slugId}/entities`;
  const queryParams = {
    limit,
    direction,
    cursor,
    entityType
  };
  const fullEndpoint = `${endpoint}${buildQueryString(queryParams)}`;
  const config = buildAxiosConfig('get', fullEndpoint);
  return await executeRequest(config);
}

module.exports = {
  getTagEntities
};

