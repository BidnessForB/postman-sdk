/**
 * Configuration module for Postman SDK
 * Reads API key from environment and sets base URL
 */


//Name of the environment variable that contains the Postman API key
const POSTMAN_API_KEY_ENV_VAR = 'POSTMAN_API_KEY';
//API key from the environment variable
const apiKey = process.env[POSTMAN_API_KEY_ENV_VAR];
//Base URL for the Postman API
const baseUrl = 'https://api.getpostman.com';


module.exports = {
  apiKey,
  baseUrl,
  POSTMAN_API_KEY_ENV_VAR
};

