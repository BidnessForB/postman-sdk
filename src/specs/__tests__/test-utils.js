const yaml = require('js-yaml');

/**
 * Validates that a given string is valid YAML
 * @param {string} yamlString - The YAML string to validate
 * @returns {boolean} True if valid YAML, false otherwise
 */
function isValidYaml(yamlString) {
  try {
    yaml.load(yamlString);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * JEST matcher to validate YAML content
 * Use with: expect(yamlString).toBeValidYaml()
 */
function toBeValidYaml(received) {
  const pass = isValidYaml(received);
  
  if (pass) {
    return {
      message: () => `expected ${received} not to be valid YAML`,
      pass: true
    };
  } else {
    let errorMessage = 'Unknown YAML error';
    try {
      yaml.load(received);
    } catch (error) {
      errorMessage = error.message;
    }
    
    return {
      message: () => `expected string to be valid YAML but got error: ${errorMessage}`,
      pass: false
    };
  }
}

/**
 * Parses YAML string and returns the parsed object
 * Throws an error if YAML is invalid
 * @param {string} yamlString - The YAML string to parse
 * @returns {any} The parsed YAML object
 */
function parseYaml(yamlString) {
  return yaml.load(yamlString);
}

/**
 * Parse content that could be either JSON or YAML
 * Tries JSON first (faster), then falls back to YAML
 * @param {string} content - The content string to parse
 * @returns {any} The parsed object
 * @throws {Error} If content is neither valid JSON nor YAML
 */
function parseContent(content) {
  if(typeof content === 'object') {
    return content;
  }
  if(typeof content === 'string') {
    try {
      return JSON.parse(content);
    } catch (jsonError) {
      try {
        return parseYaml(content);
      } catch (yamlError) {
        throw new Error(`Content is neither valid JSON nor YAML. JSON error: ${jsonError.message}, YAML error: ${yamlError.message}`);
      }
    }
  }
  throw new Error(`Content is not a string or object: ${typeof content}`);
}


module.exports = {
  isValidYaml,
  toBeValidYaml,
  parseYaml,
  parseContent
};

