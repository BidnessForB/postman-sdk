# Postman SDK Documentation

This directory contains auto-generated API documentation for the Postman SDK.

## Documentation Files

- **`API-REFERENCE.md`** - Complete API reference in Markdown format (auto-generated)
- **`api/`** - HTML documentation website (auto-generated)
- **`API-ENDPOINTS-TODO.md`** - Implementation status tracker (manually maintained)

## Generating Documentation

The documentation is automatically generated from JSDoc comments in the source code using [documentation.js](https://github.com/documentationjs/documentation).

### Generate Markdown Documentation

```bash
npm run docs:md
```

This creates `docs/API-REFERENCE.md` - a single markdown file with the complete API reference.

### Generate HTML Documentation

```bash
npm run docs:build
```

This creates `docs/api/index.html` - an interactive HTML documentation website.

### Serve Documentation Locally

```bash
npm run docs:serve
```

This starts a local development server with live-reloading at `http://localhost:4001`.

### Clean Generated Documentation

```bash
npm run docs:clean
```

This removes all auto-generated documentation files.

## Documentation Structure

The documentation is organized by module:

1. **Collections** - Manage collections, folders, and comments
2. **Requests** - Manage requests within collections
3. **Responses** - Manage responses for requests
4. **Workspaces** - Manage Postman workspaces
5. **Specs** - Manage API specifications (OpenAPI, AsyncAPI)
6. **Environments** - Manage environment variables
7. **Tags** - Query and manage tags
8. **Users** - Get authenticated user information
9. **Mocks** - Manage mock servers

## Updating Documentation

The documentation is generated from JSDoc comments in the source code. To update:

1. Edit the JSDoc comments in the source files (e.g., `src/collections/index.js`)
2. Run `npm run docs:md` or `npm run docs:build` to regenerate
3. The generated files are git-ignored and should not be committed

## JSDoc Comment Format

All functions should follow this JSDoc format:

```javascript
/**
 * Brief description of what the function does
 * Postman API endpoint and method: HTTP_METHOD /endpoint/path
 * @param {type} paramName - Parameter description
 * @param {type} [optionalParam] - Optional parameter description (optional, default value)
 * @returns {Promise} Description of return value
 * 
 * @example
 * const result = await functionName(param1, param2);
 * console.log(result.data);
 */
async function functionName(paramName, optionalParam = null) {
  // implementation
}
```

## CI/CD Integration

To automatically generate and deploy documentation in GitHub Actions:

```yaml
- name: Generate API Documentation
  run: |
    npm install
    npm run docs:build
    
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./docs/api
```

## Links

- [Main README](../README.md)
- [API Endpoints Status](./API-ENDPOINTS-TODO.md)
- [GitHub Repository](https://github.com/bidnessforb/postman-sdk)
- [Postman API Documentation](https://learning.postman.com/docs/developer/postman-api/intro-api/)

