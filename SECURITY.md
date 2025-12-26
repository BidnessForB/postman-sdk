# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.8.1   | :white_check_mark: |
| < 0.7.1 | :x:                |

**Note:** This project is in alpha stage. The API may change between minor versions until 1.0.0 is released.

## Reporting a Vulnerability

We take the security of Postman SDK seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please Do Not

- **Do not** open a public GitHub issue for security vulnerabilities
- **Do not** discuss the vulnerability in public forums, social media, or other public channels

### How to Report

**Email:** Please report security vulnerabilities to the repository maintainers via GitHub's private vulnerability reporting feature or by creating a private security advisory.

**Steps to Report:**

1. Go to the [Security tab](https://github.com/bidnessforb/postman-sdk/security) of the repository
2. Click "Report a vulnerability"
3. Fill out the security advisory form with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

**What to Include:**

- Type of vulnerability (e.g., authentication bypass, injection, etc.)
- Full paths of affected source files
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability, including how an attacker might exploit it

### What to Expect

After submitting a report, you can expect:

1. **Acknowledgment:** We will acknowledge receipt of your vulnerability report within 48 hours
2. **Assessment:** We will investigate and assess the vulnerability within 5 business days
3. **Updates:** We will keep you informed about the progress of the fix
4. **Resolution:** We will work on a fix and aim to release a patched version as soon as possible
5. **Credit:** With your permission, we will credit you in the release notes and security advisory

### Disclosure Policy

- **Coordinated Disclosure:** We prefer coordinated disclosure
- **Timeline:** We request that you give us reasonable time to address the vulnerability before public disclosure
- **Mutual Respect:** We will work with you in good faith to address legitimate security concerns

## Security Best Practices for Users

When using this SDK:

### API Key Security

1. **Never commit API keys** to version control
   - Use environment variables: `POSTMAN_API_KEY`
   - Add `.env` files to `.gitignore`
   
2. **Rotate API keys regularly**
   - Generate new keys periodically
   - Revoke old keys after rotation

3. **Limit API key scope**
   - Use API keys with minimal required permissions
   - Create separate keys for different environments (dev, staging, prod)

### Code Security

1. **Keep dependencies updated**
   ```bash
   npm audit
   npm update
   ```

2. **Review dependency vulnerabilities**
   ```bash
   npm audit fix
   ```

3. **Use the latest SDK version**
   - Check for updates regularly
   - Review changelogs for security fixes

### Network Security

1. **Use HTTPS** - The SDK always uses HTTPS for API calls
2. **Validate responses** - Always validate API responses before using data
3. **Handle errors securely** - Don't expose sensitive error details to end users

### Environment Isolation

1. **Separate environments** - Use different workspaces/collections for dev, staging, and production
2. **Test in isolation** - Run tests in dedicated test workspaces
3. **Clean up test data** - Remove test resources after testing

## Known Security Considerations

### API Key Storage

- API keys are read from environment variables
- Never hardcode API keys in your code
- Use secure secret management in production environments

### Test IDs Persistence

- The SDK persists test IDs in `test-ids.json` for functional tests
- This file is git-ignored by default
- Ensure it remains excluded from version control
- Contains workspace IDs and resource IDs (not sensitive, but should not be public)

### Functional Tests

- Functional tests make real API calls
- Use dedicated test workspaces
- Use test API keys with limited scope
- Never run tests against production resources

## Security Update Process

When a security vulnerability is addressed:

1. A security advisory will be published
2. A patched version will be released
3. The vulnerability will be documented in the changelog
4. Users will be notified through GitHub releases

## Additional Resources

- [GitHub Security Advisories](https://github.com/bidnessforb/postman-sdk/security/advisories)
- [Postman API Security Best Practices](https://learning.postman.com/docs/developer/intro-api/)
- [npm Security Best Practices](https://docs.npmjs.com/security-best-practices)

## Questions?

If you have questions about this security policy, please open a discussion in the [GitHub Discussions](https://github.com/bidnessforb/postman-sdk/discussions) (for non-sensitive questions) or contact the maintainers privately for security-related inquiries.

---

**Last Updated:** December 25, 2024

