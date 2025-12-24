# Test Scripts

This directory contains shell scripts for running various test suites with specific configurations.

## Scripts

### `test-unit-coverage.sh`

Runs unit tests with coverage reporting.

**Usage:**
```bash
npm run test:unit-coverage
# or directly:
./scripts/test-unit-coverage.sh
```

**What it does:**
- Runs all unit tests (tests matching `unit` pattern)
- Generates coverage reports (json-summary, text, lcov)
- No cleanup needed (unit tests use mocks, no API calls)

**Used by:**
- GitHub Actions: `unit-tests.yml` workflow
- Local development

---

### `test-coverage.sh`

Runs functional tests with coverage reporting.

**Usage:**
```bash
npm run test:coverage
# or directly:
./scripts/test-coverage.sh
```

**What it does:**
- Deletes `src/__tests__/test-ids.json` if it exists
- Runs the all-up functional test suite
- Generates coverage reports (json-summary, text, lcov)
- Makes real API calls to Postman API

**Used by:**
- GitHub Actions: `functional-tests.yml` workflow
- Local development

---

### `test-all-up.sh`

Runs functional tests without coverage.

**Usage:**
```bash
npm run test:all-up
# or directly:
./scripts/test-all-up.sh
```

**What it does:**
- Deletes `src/__tests__/test-ids.json` if it exists
- Runs the all-up functional test suite
- No coverage reports generated
- Makes real API calls to Postman API

**Used by:**
- Local development
- Quick functional test runs

---

### `test-badges.sh`

Runs functional tests with coverage (identical to `test-coverage.sh`).

**Usage:**
```bash
npm run test:badges
# or directly:
./scripts/test-badges.sh
```

**What it does:**
- Same as `test-coverage.sh`
- Originally intended for badge generation
- Kept for backward compatibility

**Used by:**
- Legacy badge generation workflow (if any)

---

## NPM Scripts

All scripts can be run via npm commands defined in `package.json`:

```bash
# Unit Tests
npm run test:unit              # Unit tests without coverage
npm run test:unit-coverage     # Unit tests with coverage ⭐

# Functional Tests
npm run test:all-up            # Functional tests without coverage
npm run test:coverage          # Functional tests with coverage ⭐
npm run test:badges            # Same as test:coverage

# All Tests
npm test                       # Run all tests (no coverage)
npm run test:watch             # Run tests in watch mode
```

## Coverage Reports

Both coverage scripts generate three types of reports:

1. **json-summary** - JSON summary for parsing/badges
2. **text** - Human-readable console output
3. **lcov** - Standard format for Codecov and other tools

Coverage files are generated in the `coverage/` directory.

## Environment Variables

**Functional test scripts require:**
- `POSTMAN_API_KEY` - Your Postman API key for authentication

**Unit test scripts:**
- No environment variables needed (uses mocks)

## CI/CD Usage

### Unit Tests Workflow
```yaml
- name: Run unit tests with coverage
  run: npm run test:unit-coverage
```

### Functional Tests Workflow
```yaml
- name: Generate coverage report
  env:
    POSTMAN_API_KEY: ${{ secrets.POSTMAN_API_KEY }}
  run: npm run test:coverage
```

## Maintenance

All scripts should:
- Be executable (`chmod +x`)
- Use `#!/bin/bash` shebang
- Include comments explaining their purpose
- Clean up test state when appropriate

