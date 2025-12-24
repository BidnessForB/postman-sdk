# GitHub Actions Workflows

This project uses **three workflows** for comprehensive testing:

## 1. All Tests (`all-tests.yml`) - **Recommended for Branch Protection**

Orchestrates both unit and functional tests, requiring both to succeed.

### Features
- Calls both unit-tests and functional-tests workflows as reusable workflows
- Runs both test suites in parallel
- Single status check that requires both to pass
- Ideal for branch protection rules
- Provides clear summary of overall test status

### When It Runs
- Pull requests to `main`
- Manually via GitHub Actions UI

**Use Case:** Set this as a required status check in branch protection rules to ensure both unit and functional tests pass before merging.

## 2. Unit Tests (`unit-tests.yml`)

Runs all unit tests with mocked dependencies - fast feedback without API calls.

### Features
- Can run standalone or be called by `all-tests.yml`
- Triggers on pull requests and pushes to `main`
- Runs all unit tests using `npm run test:unit`
- Fast execution (mocked, no API calls)
- Path filtering (only runs when relevant files change)
- Manual trigger support via workflow dispatch
- Uploads test results as artifacts (7 days retention)

### When It Runs
- Pull requests to `main`
- Pushes to `main`
- Changes to: `src/**`, `package.json`, `package-lock.json`, `jest.config.js`
- Manually via GitHub Actions UI
- Called by `all-tests.yml` workflow

## 3. Functional Tests & Coverage (`functional-tests.yml`)

Runs comprehensive functional tests with real API calls and generates coverage reports.

### Features
- Can run standalone or be called by `all-tests.yml`
- Triggers independently (parallel with unit tests)
- Executes the complete functional test suite with coverage using `npm run test:coverage`
- Makes real API calls to Postman API
- Requires `POSTMAN_API_KEY` secret to be configured
- Generates comprehensive coverage reports
- Uploads coverage to Codecov for dynamic badge generation
- Uploads test results, coverage, and `test-ids.json` as artifacts (30 days retention)
- Displays coverage summary in PR
- Path filtering (only runs when relevant files change)
- Manual trigger support via workflow dispatch

### When It Runs
- Pull requests to `main`
- Pushes to `main`
- Changes to: `src/**`, `package.json`, `package-lock.json`, `jest.config.js`
- Manually via GitHub Actions UI
- Called by `all-tests.yml` workflow

## Workflow Execution Strategy

### On Pull Requests
- `all-tests.yml` runs, which internally calls:
  - `unit-tests.yml` (runs in parallel)
  - `functional-tests.yml` (runs in parallel)
- All three workflows show individual status checks
- `all-tests.yml` only succeeds if both unit and functional tests pass

### On Push to Main
- `unit-tests.yml` runs independently
- `functional-tests.yml` runs independently
- Both run in parallel for fast feedback

**Benefits:**
- ✅ Fast parallel execution
- ✅ Clear individual test status visibility
- ✅ Single combined status for branch protection
- ✅ Flexible execution (standalone or combined)

### Required Secrets

To run the workflow, you need to configure the following GitHub secrets:

**`POSTMAN_API_KEY`**
- Your Postman API key
- Used for making authenticated API calls during functional tests

**`CODECOV_TOKEN`** (Optional but recommended)
- Your Codecov upload token
- Ensures secure and reliable coverage uploads
- Get this from [codecov.io](https://codecov.io) after signing up

#### How to Add Secrets

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add both secrets:
   - Name: `POSTMAN_API_KEY`, Value: Your Postman API key
   - Name: `CODECOV_TOKEN`, Value: Your Codecov token (from codecov.io)
5. Click **Add secret** for each

#### Setting up Codecov

1. Go to [codecov.io](https://codecov.io) and sign in with GitHub
2. Add your repository (it's free for open source)
3. Copy the upload token from the repository settings
4. Add it as `CODECOV_TOKEN` secret in GitHub (see above)
5. The coverage badge will automatically update after the first workflow run

#### How to Manually Trigger Workflows

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select either **Unit Tests** or **Functional Tests & Coverage** workflow from the left sidebar
4. Click **Run workflow** button
5. Select the branch (default: main)
6. Click **Run workflow** to start the tests

**Tip:** You can trigger both workflows independently for testing purposes.

### Test Results

All test results and coverage reports are uploaded as artifacts and can be downloaded from the workflow run page. Artifacts are retained for:
- Unit test results: 7 days
- Functional tests & coverage (includes test-ids.json): 30 days

Coverage reports are also automatically uploaded to Codecov for detailed analysis and badge generation.

### Status Badges

Add these badges to your README.md to show workflow and coverage status:

**Option 1: Combined Status (Recommended)**
```markdown
![All Tests](https://github.com/YOUR_USERNAME/postman-sdk/actions/workflows/all-tests.yml/badge.svg)
[![codecov](https://codecov.io/gh/YOUR_USERNAME/postman-sdk/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/postman-sdk)
```

**Option 2: Separate Status Badges**
```markdown
![Unit Tests](https://github.com/YOUR_USERNAME/postman-sdk/actions/workflows/unit-tests.yml/badge.svg)
![Functional Tests](https://github.com/YOUR_USERNAME/postman-sdk/actions/workflows/functional-tests.yml/badge.svg)
[![codecov](https://codecov.io/gh/YOUR_USERNAME/postman-sdk/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/postman-sdk)
```

**Option 3: All Status Badges (Maximum Visibility)**
```markdown
![All Tests](https://github.com/YOUR_USERNAME/postman-sdk/actions/workflows/all-tests.yml/badge.svg)
![Unit Tests](https://github.com/YOUR_USERNAME/postman-sdk/actions/workflows/unit-tests.yml/badge.svg)
![Functional Tests](https://github.com/YOUR_USERNAME/postman-sdk/actions/workflows/functional-tests.yml/badge.svg)
[![codecov](https://codecov.io/gh/YOUR_USERNAME/postman-sdk/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/postman-sdk)
```

Replace `YOUR_USERNAME` with your actual GitHub username or organization name.

**Benefits of Combined Badge:**
- Single status check for branch protection
- Simpler README appearance
- Clear pass/fail status for PRs

**Benefits of Separate Badges:**
- Clear visibility into which test suite passes/fails
- Independent monitoring of unit vs functional tests
- Faster identification of issues (unit vs integration)

**Benefits of Codecov Badge:**
- Automatically updates after each workflow run
- No merge conflicts (hosted externally)
- Shows real-time coverage percentage
- Clickable link to detailed coverage reports
- Coverage history and trend graphs

### Local Development

To run the same tests locally:

```bash
# Run unit tests
npm run test:unit

# Run all-up functional tests (requires POSTMAN_API_KEY env var)
export POSTMAN_API_KEY=your_api_key_here
npm run test:all-up

# Generate coverage report
npm run test:coverage
```

### Troubleshooting

**Functional tests fail with "API key required" error:**
- Ensure the `POSTMAN_API_KEY` secret is properly configured in GitHub
- The workflow sets the `POSTMAN_API_KEY` environment variable from this secret
- Verify the secret name matches exactly (case-sensitive)

**Tests timeout or fail intermittently:**
- Functional tests make real API calls and may be affected by network issues
- Check Postman API status at https://status.postman.com
- Consider retrying the workflow

**Coverage report not generated:**
- Coverage job runs only if both unit and functional tests succeed
- Check individual test job logs for errors

