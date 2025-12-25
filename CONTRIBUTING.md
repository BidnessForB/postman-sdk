# Contributing to Postman SDK

Thank you for your interest in contributing to the Postman SDK! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Adding New Endpoints](#adding-new-endpoints)
- [Pull Request Process](#pull-request-process)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Documentation](#documentation)
- [Questions and Support](#questions-and-support)

## Code of Conduct

Be respectful, inclusive, and professional in all interactions. We aim to foster a welcoming community for everyone.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)
- Git
- A Postman account and API key
- Basic knowledge of JavaScript and REST APIs

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/postman-sdk.git
   cd postman-sdk
   ```

3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/bidnessforb/postman-sdk.git
   ```

## Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up your API key:**
   ```bash
   export POSTMAN_API_KEY=your_api_key_here
   ```
   
   Or create a `.env` file (git-ignored):
   ```
   POSTMAN_API_KEY=your_api_key_here
   ```

3. **Run tests to verify setup:**
   ```bash
   # Unit tests (fast, no API calls)
   npm run test:unit
   
   # Functional tests (makes real API calls)
   npm run test:all-up
   ```

## Project Structure

```
postman-sdk/
├── src/
│   ├── index.js                 # Main entry point
│   ├── core/                    # Core utilities
│   │   ├── config.js           # Configuration
│   │   ├── request.js          # HTTP request handling
│   │   ├── utils.js            # Shared utilities
│   │   └── fixtures.js         # Test fixtures
│   ├── collections/            # Collections endpoints
│   ├── workspaces/             # Workspaces endpoints
│   ├── specs/                  # API specs endpoints
│   ├── requests/               # Requests endpoints
│   ├── responses/              # Responses endpoints
│   ├── environments/           # Environments endpoints
│   ├── mocks/                  # Mock servers endpoints
│   ├── tags/                   # Tags endpoints
│   └── users/                  # Users endpoints
├── fixtures/                    # Test fixture files
├── examples/                    # Example scripts
├── util/                        # Utility scripts
├── .github/workflows/           # CI/CD workflows
└── docs/                        # Documentation
```

## Coding Standards

### JavaScript Style

- **Use ES6+ features** where appropriate
- **Async/await** for asynchronous operations (no callbacks)
- **Arrow functions** for short functions
- **Const by default**, `let` when reassignment needed, never `var`
- **Semicolons** - use them consistently
- **2 spaces** for indentation

### Function Structure

All API functions follow this pattern:

```javascript
/**
 * Brief description of what the function does
 * Postman API endpoint and method (e.g., GET /endpoint)
 * @param {string} param1 - Description
 * @param {string} [param2] - Optional parameter description
 * @returns {Promise} Axios response
 */
async function functionName(param1, param2 = null) {
  const endpoint = `/path/${param1}`;
  const queryParams = { param2 };
  const fullEndpoint = `${endpoint}${buildQueryString(queryParams)}`;
  const config = buildAxiosConfig('get', fullEndpoint);
  return await executeRequest(config);
}
```

### Key Rules

1. **No API key parameters** - Always use environment variable
2. **Use helper functions** - `buildAxiosConfig()`, `executeRequest()`, `buildQueryString()`, `buildUid()`
3. **JSDoc comments** - Document all functions
4. **Return axios response** - Return the full response, not just data
5. **Handle errors** - Let `executeRequest()` handle error throwing
6. **Null defaults** - Use `null` for optional parameters
7. **Filter null values** - Query params should omit null/undefined values

## Testing Requirements

### Required Tests

Every new feature or endpoint **MUST** include:

1. **Unit Tests** (required)
   - Mock axios calls
   - Test all parameters and query strings
   - Test error handling
   - Fast execution
   
2. **Functional Tests** (required for API endpoints)
   - Make real API calls
   - Create, read, update, delete operations
   - Test resource persistence
   - Use shared test helpers

3. **Integration Tests** (when applicable)
   - Test interactions between modules
   - No mocks for internal SDK functions
   - May use real file system or fixtures

### Test Structure

```javascript
// Unit test example
describe('myFunction', () => {
  test('should call correct endpoint', async () => {
    const mockResponse = { status: 200, data: {} };
    axios.request.mockResolvedValue(mockResponse);
    
    await myFunction('param');
    
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'get',
        url: expect.stringContaining('/endpoint')
      })
    );
  });
});
```

### Coverage Requirements

- **Minimum 80% line coverage** for new code
- **All functions must have tests**
- **All branches should be tested** (conditionals, error paths)
- Run coverage before submitting PR:
  ```bash
  npm run test:unit-coverage
  npm run test:coverage
  ```

## Adding New Endpoints

### Step-by-Step Guide

1. **Check the API spec** - Review [API-ENDPOINTS-TODO.md](docs/API-ENDPOINTS-TODO.md)

2. **Reference the OAS** - Check `postmanAPIspec.yaml` for endpoint details

3. **Choose the right module** - Add to existing module or create new one

4. **Implement the function:**
   ```javascript
   async function createResource(data, optionalParam = null) {
     const endpoint = '/resources';
     const queryParams = { optionalParam };
     const fullEndpoint = `${endpoint}${buildQueryString(queryParams)}`;
     const config = buildAxiosConfig('post', fullEndpoint, { data });
     return await executeRequest(config);
   }
   ```

5. **Export the function:**
   ```javascript
   module.exports = {
     existingFunction,
     createResource  // Add new function
   };
   ```

6. **Create unit tests** in `__tests__/unit.test.js`:
   ```javascript
   describe('createResource', () => {
     test('should call POST /resources', async () => {
       // Test implementation
     });
   });
   ```

7. **Create functional tests** in `__tests__/functional.test.js`:
   ```javascript
   test('should create resource via API', async () => {
     const result = await createResource({ name: 'Test' });
     expect(result.status).toBe(201);
   });
   ```

8. **Update documentation:**
   - Add function to module README
   - Update API-ENDPOINTS-TODO.md
   - Add examples

### Naming Conventions

Function names use HTTP method prefixes:

- `GET` → `get` (e.g., `getCollection`, `getCollections`)
- `POST` → `create` (e.g., `createCollection`)
- `PUT` → `update` (e.g., `updateCollection`)
- `PATCH` → `modify` (e.g., `modifyCollection`)
- `DELETE` → `delete` (e.g., `deleteCollection`)

## Pull Request Process

### Before Submitting

1. **Sync with upstream:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run all tests:**
   ```bash
   npm run test:unit
   npm run test:all-up
   ```

3. **Check linting:**
   ```bash
   npm run lint
   ```

4. **Verify documentation** is updated

### PR Checklist

- [ ] Code follows style guidelines
- [ ] All tests pass locally
- [ ] New tests added for new functionality
- [ ] Coverage maintained or improved
- [ ] Documentation updated (README, JSDoc, etc.)
- [ ] API-ENDPOINTS-TODO.md updated if adding endpoints
- [ ] Commit messages follow guidelines
- [ ] No merge conflicts with main branch
- [ ] CI/CD workflows pass

### PR Title Format

Use conventional commit format:

```
feat: add getCollectionForks endpoint
fix: correct query parameter handling in getSpecs
docs: update collections module README
test: add unit tests for buildUid function
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Endpoints Added/Modified
- GET /endpoint - Description

## Testing
- [ ] Unit tests added/updated
- [ ] Functional tests added/updated
- [ ] All tests passing

## Documentation
- [ ] README updated
- [ ] JSDoc comments added
- [ ] API-ENDPOINTS-TODO.md updated

## Related Issues
Closes #123
```

## Commit Message Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `test`: Adding or updating tests
- `refactor`: Code refactoring
- `style`: Code style changes (formatting)
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

### Examples

```
feat(collections): add getCollectionForks endpoint

Implements the GET /collections/{collectionId}/forks endpoint
with support for cursor-based pagination.

Closes #45

---

fix(specs): correct query parameter filtering

Previously null values were included in query strings.
Now properly filters out null/undefined values.

---

docs(core): add fixtures module documentation

Documents loadFixture and loadSpecFiles functions
with examples and usage instructions.
```

## Documentation

### Required Documentation

When adding new features:

1. **JSDoc comments** on all functions
2. **Module README** with examples
3. **Main README** if adding new module
4. **API-ENDPOINTS-TODO.md** for new endpoints
5. **Test README** in `__tests__/` directory

### Documentation Style

- Clear, concise descriptions
- Include examples
- Document parameters and return values
- Explain error conditions
- Link to related documentation

## Questions and Support

### Getting Help

- **GitHub Discussions** - Ask questions, share ideas
- **Issues** - Report bugs, request features
- **Pull Requests** - Propose changes

### Useful Resources

- [Postman API Documentation](https://www.postman.com/postman/workspace/postman-public-workspace/documentation/12959542-c8142d51-e97c-46b6-bd77-52bb66712c9a)
- [Postman API OpenAPI Spec](https://www.postman.com/postman/postman-public-workspace/specification/3001f4e4-5f9d-4bac-9f57-b2c4d483508f)
- [Project README](README.md)
- [API Endpoint Status](docs/API-ENDPOINTS-TODO.md)

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes
- Project documentation (if significant contribution)

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

---

**Thank you for contributing to Postman SDK!** 🎉

Your contributions help make this project better for everyone. We appreciate your time and effort.

