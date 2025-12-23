# GitHub Actions Workflows

## Pull Request Tests (`pr-tests.yml`)

This workflow automatically runs tests when a pull request is opened against the `main` branch.

### Workflow Jobs

#### 1. Unit Tests
- Runs all unit tests using `npm run test:unit`
- Fast execution (mocked, no API calls)
- Uploads test results as artifacts

#### 2. Functional Tests (All-Up)
- Runs the complete functional test suite using `npm run test:all-up`
- Makes real API calls to Postman API
- Requires `POSTMAN_API_KEY_POSTMAN` secret to be configured
- Uploads test results and generated `test-ids.json` as artifacts

#### 3. Test Coverage Report
- Runs after unit and functional tests complete
- Generates comprehensive coverage report
- Uploads coverage to Codecov for dynamic badge generation
- Uploads coverage report as artifact for 30 days
- Displays coverage summary in PR

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

#### How to Manually Trigger the Workflow

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select **Postman SDK Tests** workflow from the left sidebar
4. Click **Run workflow** button
5. Select the branch (default: main)
6. Click **Run workflow** to start the tests

### Workflow Triggers

The workflow runs when:
- A pull request is opened against `main`
- A pull request is synchronized (new commits pushed)
- A pull request is reopened
- Manually triggered via GitHub Actions UI (workflow dispatch)

### Test Results

All test results and coverage reports are uploaded as artifacts and can be downloaded from the workflow run page. Artifacts are retained for:
- Unit test results: 7 days
- Functional test results: 7 days
- Coverage reports: 30 days

### Status Badges

Add these badges to your README.md to show the workflow and coverage status:

**Workflow Status Badge:**
```markdown
![PR Tests](https://github.com/YOUR_USERNAME/postman-sdk/actions/workflows/pr-tests.yml/badge.svg)
```

**Codecov Coverage Badge:**
```markdown
[![codecov](https://codecov.io/gh/YOUR_USERNAME/postman-sdk/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/postman-sdk)
```

Replace `YOUR_USERNAME` with your actual GitHub username or organization name.

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

# Run all-up functional tests (requires POSTMAN_API_KEY_BRKC env var)
export POSTMAN_API_KEY_BRKC=your_api_key_here
npm run test:all-up

# Generate coverage report
npm run test:coverage
```

### Troubleshooting

**Functional tests fail with "API key required" error:**
- Ensure the `POSTMAN_API_KEY` secret is properly configured in GitHub
- The workflow sets the `POSTMAN_API_KEY_BRKC` environment variable from this secret
- Verify the secret name matches exactly (case-sensitive)

**Tests timeout or fail intermittently:**
- Functional tests make real API calls and may be affected by network issues
- Check Postman API status at https://status.postman.com
- Consider retrying the workflow

**Coverage report not generated:**
- Coverage job runs only if both unit and functional tests succeed
- Check individual test job logs for errors

