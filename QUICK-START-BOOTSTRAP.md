# Quick Start Guide - CEOS Meta-Repo Bootstrap

## Prerequisites

1. **GitHub Repository**: Ensure your CEOS repository has admin access
2. **GitHub Token**: Create a Personal Access Token with these scopes:
   - `repo` (Full control of private repositories)
   - `admin:org` (Full control of orgs and teams, read and write org projects)
3. **Repository Secret**: Add `CEOS_GITHUB_PAT` to repository secrets

## Setup Steps

### 1. Configure Repository Secret

```bash
# Via GitHub CLI
gh secret set CEOS_GITHUB_PAT --body "your_github_token_here"

# Or via GitHub UI:
# Settings > Secrets and variables > Actions > New repository secret
# Name: CEOS_GITHUB_PAT
# Value: your_github_token_here
```

### 2. Add Your First Repository

Edit `repositories.yml`:

```yaml
repositories:
  - name: "my-first-repo"
    owner: "YourGitHubUsername"
    description: "My first CEOS managed repository"
    type: "microservice"
    technology: "typescript"
```

### 3. Create Repository Configuration

```bash
# Create configuration directory
mkdir -p meta-config/my-first-repo

# Create basic configuration
cat > meta-config/my-first-repo/config.yml << EOF
repository:
  name: "my-first-repo"
  description: "My first CEOS managed repository"
variables:
  API_PREFIX: "/api/v1"
  DEFAULT_PORT: "3000"
auto_push: true
EOF
```

### 4. Test with Dry Run

```bash
# Test the setup without making changes
gh workflow run meta-repo-bootstrap.yml \
  --field target_repos="my-first-repo" \
  --field dry_run=true
```

### 5. Execute Bootstrap

```bash
# Commit and push to trigger automatic bootstrap
git add .
git commit -m "feat: add my-first-repo configuration"
git push

# Or trigger manually
gh workflow run meta-repo-bootstrap.yml \
  --field target_repos="my-first-repo"
```

## Verification

1. **Check Actions**: Visit GitHub Actions tab to monitor execution
2. **Verify Repository**: Check if repository was created with expected structure
3. **Review Logs**: Check workflow logs for any issues

## Next Steps

- Review the [full documentation](docs/meta-repo-bootstrap.md)
- Customize templates in `templates/global/`
- Add repository-specific templates
- Configure provisioning scripts

## Common Commands

```bash
# Update all repositories
gh workflow run meta-repo-bootstrap.yml --field force_update=true

# Update specific repositories
gh workflow run meta-repo-bootstrap.yml --field target_repos="repo1,repo2"

# Dry run for testing
gh workflow run meta-repo-bootstrap.yml --field dry_run=true

# Check workflow status
gh run list --workflow=meta-repo-bootstrap.yml
```
