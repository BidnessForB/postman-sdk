/**
 * Configuration module for Postman SDK
 * Reads API key from environment and sets base URL
 */

const apiKey = process.env.POSTMAN_API_KEY_POSTMAN;
const baseUrl = 'https://api.getpostman.com';

module.exports = {
  apiKey,
  baseUrl
};

