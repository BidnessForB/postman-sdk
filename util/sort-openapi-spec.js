#!/usr/bin/env node

/**
 * Sorts OpenAPI spec by endpoint paths
 * Usage: node util/sort-openapi-spec.js <input-file> <output-file>
 */

const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

function sortOpenAPISpec(inputFile, outputFile) {
  console.log(`Reading ${inputFile}...`);
  
  // Read the YAML file
  const fileContents = fs.readFileSync(inputFile, 'utf8');
  const spec = yaml.load(fileContents);
  
  if (!spec.paths) {
    console.error('Error: No paths found in OpenAPI spec');
    process.exit(1);
  }
  
  console.log(`Found ${Object.keys(spec.paths).length} endpoints`);
  
  // Sort the paths alphabetically
  const sortedPaths = {};
  const pathKeys = Object.keys(spec.paths).sort();
  
  for (const pathKey of pathKeys) {
    sortedPaths[pathKey] = spec.paths[pathKey];
  }
  
  // Replace paths with sorted version
  spec.paths = sortedPaths;
  
  // Sort components schemas if they exist
  if (spec.components && spec.components.schemas) {
    const sortedSchemas = {};
    const schemaKeys = Object.keys(spec.components.schemas).sort();
    for (const schemaKey of schemaKeys) {
      sortedSchemas[schemaKey] = spec.components.schemas[schemaKey];
    }
    spec.components.schemas = sortedSchemas;
  }
  
  // Sort components parameters if they exist
  if (spec.components && spec.components.parameters) {
    const sortedParameters = {};
    const paramKeys = Object.keys(spec.components.parameters).sort();
    for (const paramKey of paramKeys) {
      sortedParameters[paramKey] = spec.components.parameters[paramKey];
    }
    spec.components.parameters = sortedParameters;
  }
  
  console.log(`Writing sorted spec to ${outputFile}...`);
  
  // Write the sorted spec to the output file
  const yamlStr = yaml.dump(spec, {
    indent: 2,
    lineWidth: -1, // Don't wrap lines
    noRefs: true,
    sortKeys: false // We've already sorted the keys we want
  });
  
  fs.writeFileSync(outputFile, yamlStr, 'utf8');
  
  console.log('✓ Done!');
  console.log(`Sorted ${pathKeys.length} endpoints alphabetically`);
}

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length !== 2) {
  console.error('Usage: node util/sort-openapi-spec.js <input-file> <output-file>');
  process.exit(1);
}

const inputFile = path.resolve(args[0]);
const outputFile = path.resolve(args[1]);

if (!fs.existsSync(inputFile)) {
  console.error(`Error: Input file ${inputFile} does not exist`);
  process.exit(1);
}

try {
  sortOpenAPISpec(inputFile, outputFile);
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}

