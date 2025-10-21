# GitHub Workflows

## CI/CD Pipeline - Disabled

The CI/CD pipeline has been disabled (`ci.yml.disabled`) because:
- The application is deployed via Coolify (not GitHub Actions)
- Coolify handles the build and deployment process
- The CI pipeline was failing due to missing secrets/environment variables

## To Re-enable

If you want to re-enable GitHub Actions CI:

1. Rename `ci.yml.disabled` back to `ci.yml`
2. Add required secrets in GitHub repository settings:
   - `CODECOV_TOKEN` (optional, for code coverage)
3. Ensure tests pass locally first: `npm test`

## Current Deployment

- **Platform:** Coolify
- **Build Method:** Dockerfile
- **Auto-deploy:** On push to main branch (via Coolify webhook)
