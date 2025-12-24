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
- Pull requests to `main` or `dev`
- Manually via GitHub Actions UI

**Use Case:** Set this as a required status check in branch protection rules to ensure both unit and functional tests pass before merging.

**Note:** This is the **only** workflow that runs automatically on pull requests and pushes. The individual unit-tests and functional-tests workflows are called by this orchestrator.

## 2. Unit Tests (`unit-tests.yml`)

Runs all unit tests with mocked dependencies - fast feedback without API calls.

### Features
- Called by `all-tests.yml` as a reusable workflow
- Runs all unit tests with coverage enabled
- Fast execution (mocked, no API calls)
- Generates coverage reports and uploads to Codecov with `unit` flag
- Manual trigger support via workflow dispatch
- Uploads test results and coverage as artifacts (7 days retention)
- Displays coverage summary in PR

### When It Runs
- **Called by `all-tests.yml` workflow** (automatic on PRs and pushes)
- Manually via GitHub Actions UI (workflow_dispatch)

## 3. Functional Tests & Coverage (`functional-tests.yml`)

Runs comprehensive functional tests with real API calls and generates coverage reports.

### Features
- Called by `all-tests.yml` as a reusable workflow
- Executes the complete functional test suite with coverage using `npm run test:coverage`
- Makes real API calls to Postman API
- Requires `POSTMAN_API_KEY` secret to be configured
- Generates comprehensive coverage reports
- Uploads coverage to Codecov for dynamic badge generation with `functional` flag
- Uploads test results, coverage, and `test-ids.json` as artifacts (30 days retention)
- Displays coverage summary in PR
- Manual trigger support via workflow dispatch

### When It Runs
- **Called by `all-tests.yml` workflow** (automatic on PRs and pushes)
- Manually via GitHub Actions UI (workflow_dispatch)
- Requires `POSTMAN_API_KEY` and optionally `CODECOV_TOKEN` secrets when called

## Workflow Execution Strategy

### On Pull Requests (to `main` or `dev`)
- **Only `all-tests.yml` runs automatically**, which internally calls:
  - `unit-tests.yml` (runs in parallel via `workflow_call`)
  - `functional-tests.yml` (runs in parallel via `workflow_call`)
- All three workflows show individual status checks in the PR
- `all-tests.yml` only succeeds if both unit and functional tests pass

### On Push/Merge (to `main` or `dev`)
- **Only `all-tests.yml` runs automatically** (no separate runs)
- It calls both unit and functional tests as reusable workflows
- Both run in parallel for fast feedback

### Manual Execution
- Individual workflows can still be triggered manually via `workflow_dispatch`
- Useful for debugging specific test suites

**Benefits:**
- ✅ Fast parallel execution
- ✅ Single orchestrator - no duplicate workflow runs
- ✅ Clear individual test status visibility in PRs
- ✅ Single combined status for branch protection
- ✅ Efficient resource usage (tests run only once per event)

### Required Secrets

To run the workflow, you need to configure the following GitHub secrets:

**`POSTMAN_API_KEY`**
- Your Postman API key
- Used for making authenticated API calls during functional tests

**`CODECOV_TOKEN`** (Optional but recommended)
- Your Codecov upload token
- Ensures secure and reliable coverage uploads
- Get this from [codecov.io](https://codecov.io) after signing up
- Required for accurate status check reporting

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
[![codecov](https://codecov.io/gh/YOUR_USERNAME/postman-sdk/branch/main/graph/badge.svg?token=YOUR_TOKEN)](https://codecov.io/gh/YOUR_USERNAME/postman-sdk)
```

**Option 2: Separate Status Badges**
```markdown
![Unit Tests](https://github.com/YOUR_USERNAME/postman-sdk/actions/workflows/unit-tests.yml/badge.svg)
![Functional Tests](https://github.com/YOUR_USERNAME/postman-sdk/actions/workflows/functional-tests.yml/badge.svg)
[![codecov](https://codecov.io/gh/YOUR_USERNAME/postman-sdk/branch/main/graph/badge.svg?token=YOUR_TOKEN)](https://codecov.io/gh/YOUR_USERNAME/postman-sdk)
```

**Option 3: All Status Badges with Separate Coverage (Maximum Visibility)**
```markdown
![All Tests](https://github.com/YOUR_USERNAME/postman-sdk/actions/workflows/all-tests.yml/badge.svg)
![Unit Tests](https://github.com/YOUR_USERNAME/postman-sdk/actions/workflows/unit-tests.yml/badge.svg)
![Functional Tests](https://github.com/YOUR_USERNAME/postman-sdk/actions/workflows/functional-tests.yml/badge.svg)
[![codecov](https://codecov.io/gh/YOUR_USERNAME/postman-sdk/branch/main/graph/badge.svg?token=YOUR_TOKEN)](https://codecov.io/gh/YOUR_USERNAME/postman-sdk)
[![Unit Coverage](https://codecov.io/gh/YOUR_USERNAME/postman-sdk/branch/main/graph/badge.svg?token=YOUR_TOKEN&flag=unit)](https://codecov.io/gh/YOUR_USERNAME/postman-sdk)
[![Functional Coverage](https://codecov.io/gh/YOUR_USERNAME/postman-sdk/branch/main/graph/badge.svg?token=YOUR_TOKEN&flag=functional)](https://codecov.io/gh/YOUR_USERNAME/postman-sdk)
```

Replace `YOUR_USERNAME` with your actual GitHub username or organization name, and `YOUR_TOKEN` with your Codecov repository token.

**Benefits of Combined Badge:**
- Single status check for branch protection
- Simpler README appearance
- Clear pass/fail status for PRs

**Benefits of Separate Badges:**
- Clear visibility into which test suite passes/fails
- Independent monitoring of unit vs functional tests
- Faster identification of issues (unit vs integration)

**Benefits of Separate Coverage Badges:**
- Monitor unit test coverage independently
- Track functional test coverage separately
- Identify which test suite needs more coverage
- Codecov flags (`unit` and `functional`) enable independent tracking

**Benefits of Codecov Badges:**
- Automatically updates after each workflow run
- No merge conflicts (hosted externally)
- Shows real-time coverage percentage
- Clickable link to detailed coverage reports
- Coverage history and trend graphs
- Flag-specific badges show coverage for specific test types

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

### Codecov Configuration

The repository uses an optimized Codecov configuration (`codecov.yml`) to prevent status check issues:

**Status Check Strategy:**
- **`codecov/project`** - Combined coverage from both test suites (blocking, 2% threshold)
- **`codecov/project/unit`** - Unit test coverage only (informational)
- **`codecov/project/functional`** - Functional test coverage only (informational)
- **`codecov/patch`** - Patch coverage (informational)

**Key Configuration Details:**
- `require_ci_to_pass: no` - Prevents circular dependencies with GitHub Actions
- `wait_for_ci: no` - Reports coverage immediately without waiting
- Individual flag checks are informational - won't block PRs
- Only the combined `codecov/project` check can block merges
- 2% coverage threshold for reasonable flexibility

This configuration ensures:
- ✅ No "waiting for status checks" deadlocks
- ✅ Fast feedback on coverage changes
- ✅ Visibility into both test suite coverages
- ✅ Only one blocking codecov check for simplicity

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

**"All Tests" status check waiting indefinitely:**
- Verify branch protection requires `Postman SDK - All Tests / Run unit and functional tests with coverage`
- The exact status check name matters - check your PR to see what's reported
- Avoid requiring outdated or renamed status checks

**Codecov status checks failing:**
- Check if coverage decreased by more than 2%
- Review the Codecov report linked in the PR
- Individual flag checks (unit/functional) are informational and won't block
- Only `codecov/project` (combined) check will block merges

