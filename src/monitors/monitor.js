const { buildAxiosConfig, executeRequest } = require('../core/request');
const { buildQueryString, validateId } = require('../core/utils');

/**
 * Gets all monitors
 * Postman API endpoint and method: GET /monitors
 * @param {string} [workspaceId] - Return only results found in the given workspace ID
 * @param {boolean} [active] - If true, return only active monitors
 * @param {number} [owner] - Return the results by the given user ID
 * @param {string} [collectionUid] - Filter the results by a collection's unique ID
 * @param {string} [environmentUid] - Filter the results by an environment's unique ID
 * @param {string} [cursor] - The pointer to the first record of the set of paginated results
 * @param {number} [limit] - The maximum number of rows to return in the response (up to 25, defaults to 25)
 * @returns {Promise} Axios response with monitors array and meta information
 * @example
 * // Get all monitors
 * const response = await getMonitors();
 * console.log(response.data.monitors);
 * 
 * @example
 * // Get monitors in a workspace
 * const response = await getMonitors('workspace-id-123');
 * 
 * @example
 * // Get only active monitors for a collection
 * const response = await getMonitors(null, true, null, 'collection-uid-456');
 */
async function getMonitors(
  workspaceId = null,
  active = null,
  owner = null,
  collectionUid = null,
  environmentUid = null,
  cursor = null,
  limit = null
) {
  if (workspaceId !== null) {
    validateId(workspaceId, 'workspaceId');
  }

  const endpoint = '/monitors';
  const queryParams = {
    workspace: workspaceId,
    active,
    owner,
    collectionUid,
    environmentUid,
    cursor,
    limit
  };
  const fullEndpoint = `${endpoint}${buildQueryString(queryParams)}`;
  const config = buildAxiosConfig('get', fullEndpoint);
  return await executeRequest(config);
}

/**
 * Creates a monitor
 * Postman API endpoint and method: POST /monitors
 * @param {Object} monitorData - The monitor object containing configuration
 * @param {string} monitorData.name - (Required) The monitor's name
 * @param {string} monitorData.collection - (Required) The unique ID of the monitor's associated collection
 * @param {string} [monitorData.environment] - The unique ID of the monitor's associated environment
 * @param {boolean} [monitorData.active] - If true, the monitor is active and makes calls (default: true)
 * @param {Object} [monitorData.schedule] - Information about the monitor's schedule
 * @param {string} [monitorData.schedule.cron] - The monitor's run frequency (cron pattern)
 * @param {string} [monitorData.schedule.timezone] - The monitor's timezone
 * @param {number} [monitorData.notificationLimit] - Stop email notifications after given consecutive failures (1-99)
 * @param {Array} [monitorData.distribution] - List of geographic regions
 * @param {Object} [monitorData.options] - Information about the monitor's option settings
 * @param {boolean} [monitorData.options.followRedirects] - If true, follow redirects enabled
 * @param {number} [monitorData.options.requestDelay] - The monitor's request delay value in milliseconds (1-900000)
 * @param {number} [monitorData.options.requestTimeout] - The monitor's request timeout value in milliseconds (1-900000)
 * @param {boolean} [monitorData.options.strictSSL] - If true, strict SSL enabled
 * @param {Object} [monitorData.notifications] - Information about the monitor's notification settings
 * @param {Array} [monitorData.notifications.onError] - Array of objects with email property
 * @param {Array} [monitorData.notifications.onFailure] - Array of objects with email property
 * @param {Object} [monitorData.retry] - Retry settings
 * @param {number} [monitorData.retry.attempts] - The number of times to reattempt (1-2)
 * @param {string} workspaceId - (Required) The workspace ID in which to create the monitor
 * @returns {Promise} Axios response with created monitor data
 * @example
 * // Create a basic monitor
 * const response = await createMonitor(
 *   {
 *     name: 'My API Monitor',
 *     collection: 'collection-uid-123',
 *     schedule: {
 *       cron: '0 0 * * *',
 *       timezone: 'America/New_York'
 *     }
 *   },
 *   'workspace-id-456'
 * );
 * console.log(response.data.monitor.id);
 * 
 * @example
 * // Create a monitor with environment and notifications
 * const response = await createMonitor(
 *   {
 *     name: 'Production Monitor',
 *     collection: 'collection-uid-123',
 *     environment: 'env-uid-789',
 *     active: true,
 *     schedule: {
 *       cron: '0 0 * * *', // Every day at midnight
 *       timezone: 'UTC'
 *     },
 *     notificationLimit: 5,
 *     distribution: [
 *       { region: 'us-east' },
 *       { region: 'eu-central' }
 *     ],
 *     options: {
 *       followRedirects: true,
 *       requestTimeout: 5000,
 *       strictSSL: true
 *     },
 *     notifications: {
 *       onError: [{ email: 'dev@example.com' }],
 *       onFailure: [{ email: 'ops@example.com' }]
 *     },
 *     retry: {
 *       attempts: 2
 *     }
 *   },
 *   'workspace-id-456'
 * );
 */
async function createMonitor(monitorData, workspaceId) {
  validateId(workspaceId, 'workspaceId');

  const endpoint = '/monitors';
  const queryParams = {
    workspace: workspaceId
  };
  const fullEndpoint = `${endpoint}${buildQueryString(queryParams)}`;
  const config = buildAxiosConfig('post', fullEndpoint, { monitor: monitorData });
  return await executeRequest(config);
}

/**
 * Gets information about a monitor
 * Postman API endpoint and method: GET /monitors/{monitorId}
 * @param {string} monitorId - The monitor's ID
 * @returns {Promise} Axios response with monitor details including schedule and lastRun info
 * @example
 * // Get monitor information
 * const response = await getMonitor('monitor-id-123');
 * console.log(response.data.monitor);
 * console.log(response.data.monitor.lastRun);
 */
async function getMonitor(monitorId) {
  validateId(monitorId, 'monitorId');

  const endpoint = `/monitors/${monitorId}`;
  const config = buildAxiosConfig('get', endpoint);
  return await executeRequest(config);
}

/**
 * Updates a monitor
 * Postman API endpoint and method: PUT /monitors/{monitorId}
 * @param {string} monitorId - The monitor's ID
 * @param {Object} monitorData - The monitor object with fields to update
 * @param {string} [monitorData.name] - The monitor's name
 * @param {Object} [monitorData.schedule] - Information about the monitor's schedule
 * @param {string} [monitorData.schedule.cron] - The monitor's run frequency (cron pattern)
 * @param {string} [monitorData.schedule.timezone] - The monitor's timezone
 * @param {number} [monitorData.notificationLimit] - Stop email notifications after given consecutive failures (1-99)
 * @param {boolean} [monitorData.active] - If true, the monitor is active
 * @param {Array} [monitorData.distribution] - List of geographic regions
 * @param {Object} [monitorData.options] - Information about the monitor's option settings
 * @param {boolean} [monitorData.options.followRedirects] - If true, follow redirects enabled
 * @param {number} [monitorData.options.requestDelay] - The monitor's request delay value in milliseconds (1-900000)
 * @param {number} [monitorData.options.requestTimeout] - The monitor's request timeout value in milliseconds (1-900000)
 * @param {boolean} [monitorData.options.strictSSL] - If true, strict SSL enabled
 * @param {Object} [monitorData.notifications] - Information about the monitor's notification settings
 * @param {Array} [monitorData.notifications.onError] - Array of objects with email property
 * @param {Array} [monitorData.notifications.onFailure] - Array of objects with email property
 * @param {Object} [monitorData.retry] - Retry settings
 * @param {number} [monitorData.retry.attempts] - The number of times to reattempt (1-2)
 * @returns {Promise} Axios response with updated monitor data
 * @example
 * // Update monitor name
 * const response = await updateMonitor('monitor-id-123', {
 *   name: 'Updated Monitor Name'
 * });
 * 
 * @example
 * // Update monitor schedule and make it inactive
 * const response = await updateMonitor('monitor-id-123', {
 *   active: false,
 *   schedule: {
 *     cron: '0 0 * * *', // Every day at midnight
 *     timezone: 'America/Los_Angeles'
 *   }
 * });
 */
async function updateMonitor(monitorId, monitorData) {
  validateId(monitorId, 'monitorId');

  const endpoint = `/monitors/${monitorId}`;
  const config = buildAxiosConfig('put', endpoint, { monitor: monitorData });
  return await executeRequest(config);
}

/**
 * Deletes a monitor
 * Postman API endpoint and method: DELETE /monitors/{monitorId}
 * @param {string} monitorId - The monitor's ID
 * @returns {Promise} Axios response with deletion confirmation
 * @example
 * // Delete a monitor
 * const response = await deleteMonitor('monitor-id-123');
 * console.log(response.data.monitor);
 */
async function deleteMonitor(monitorId) {
  validateId(monitorId, 'monitorId');

  const endpoint = `/monitors/${monitorId}`;
  const config = buildAxiosConfig('delete', endpoint);
  return await executeRequest(config);
}

/**
 * Runs a monitor
 * Postman API endpoint and method: POST /monitors/{monitorId}/run
 * @param {string} monitorId - The monitor's ID
 * @param {boolean} [async] - If true, runs the monitor asynchronously (default: false)
 * @returns {Promise} Axios response with monitor run results. If async=true, response does not include stats, executions, and failures. Use getMonitor to retrieve this information.
 * @example
 * // Run a monitor synchronously (wait for results)
 * const response = await runMonitor('monitor-id-123');
 * console.log(response.data.run.stats);
 * console.log(response.data.run.executions);
 * 
 * @example
 * // Run a monitor asynchronously
 * const response = await runMonitor('monitor-id-123', true);
 * console.log(response.data.run.info.jobId);
 * // Later, use getMonitor to check the run status
 */
async function runMonitor(monitorId, async = null) {
  validateId(monitorId, 'monitorId');

  const endpoint = `/monitors/${monitorId}/run`;
  const queryParams = {
    async
  };
  const fullEndpoint = `${endpoint}${buildQueryString(queryParams)}`;
  const config = buildAxiosConfig('post', fullEndpoint);
  return await executeRequest(config);
}

module.exports = {
  getMonitors,
  createMonitor,
  getMonitor,
  updateMonitor,
  deleteMonitor,
  runMonitor
};

