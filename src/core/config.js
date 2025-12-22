/**
 * Configuration module for Postman SDK
 * Reads API key from environment and sets base URL
 */


const POSTMAN_API_KEY_ENV_VAR = 'POSTMAN_API_KEY_BRKC';
const apiKey = process.env[POSTMAN_API_KEY_ENV_VAR];
const baseUrl = 'https://api.getpostman.com';


module.exports = {
  apiKey,
  baseUrl,
  POSTMAN_API_KEY_ENV_VAR
};

