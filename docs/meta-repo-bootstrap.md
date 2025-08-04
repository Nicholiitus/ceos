# CEOS Meta-Repo Bootstrap System

## Overview

The CEOS Meta-Repo Bootstrap is an advanced GitHub Actions workflow that automatically manages multiple repositories in the CEOS ecosystem. It provides:

- **Automated Repository Creation**: Creates new repositories based on configuration
- **Template Application**: Applies standardized templates and configurations
- **Provisioning Scripts**: Runs setup scripts to initialize repositories
- **Change Detection**: Monitors meta-repo changes and updates affected repositories
- **Multi-Repository Management**: Handles batch operations across repository groups

## Architecture

```
CEOS Meta-Repo
├── .github/workflows/
│   └── meta-repo-bootstrap.yml     # Main bootstrap workflow
├── bootstrap-config.yml            # Global configuration
├── repositories.yml                # Repository definitions
├── templates/                      # Template files
│   ├── global/                     # Applied to all repositories
│   └── [repo-name]/               # Repository-specific templates
├── provisioning/                   # Setup scripts
│   ├── global/                     # Applied to all repositories
│   └── [repo-name]/               # Repository-specific scripts
└── meta-config/                    # Repository configurations
    └── [repo-name]/
        ├── config.yml              # Repository-specific settings
        └── [additional-files]      # Repository-specific files
```

## Workflow Triggers

### Automatic Triggers
- **Push to main/develop**: When changes are pushed to tracked paths
- **Pull Request**: When PRs are opened against main branch

### Manual Triggers
- **Workflow Dispatch**: Manual trigger with options for:
  - Target specific repositories
  - Force update all repositories
  - Dry run mode for testing

### Monitored Paths
- `meta-config/**` - Repository-specific configurations
- `templates/**` - Template files
- `provisioning/**` - Setup scripts
- `repositories.yml` - Repository definitions
- `bootstrap-config.yml` - Global configuration

## Configuration Files

### bootstrap-config.yml
Global configuration affecting all repositories:

```yaml
global:
  default_owner: "Nicholiitus"
  variables:
    ORGANIZATION: "CEOS Enterprise"
    COPYRIGHT_YEAR: "2025"
  repository_defaults:
    private: true
    has_issues: true
```

### repositories.yml
Defines all managed repositories:

```yaml
repositories:
  - name: "ceos-identity"
    owner: "Nicholiitus"
    description: "Identity and Authentication Service"
    type: "microservice"
    technology: "typescript"
```

### meta-config/[repo-name]/config.yml
Repository-specific configuration:

```yaml
repository:
  name: "ceos-identity"
  description: "Identity Service"
variables:
  API_PREFIX: "/api/v1/auth"
provisioning:
  scripts:
    - name: "setup-database"
      command: "npm run db:setup"
```

## Template System

### Template Variables
Templates support variable replacement using `{{ VARIABLE_NAME }}` syntax:

**Global Variables:**
- `{{ REPO_NAME }}` - Repository name
- `{{ REPO_OWNER }}` - Repository owner
- `{{ REPO_DESCRIPTION }}` - Repository description
- `{{ BOOTSTRAP_VERSION }}` - Bootstrap system version
- `{{ TIMESTAMP }}` - Current timestamp

**Custom Variables:**
Defined in configuration files and available in templates.

### Template Hierarchy
1. **Global Templates** (`templates/global/`) - Applied to all repositories
2. **Repository Templates** (`templates/[repo-name]/`) - Repository-specific
3. **Meta-Config Files** (`meta-config/[repo-name]/`) - Direct file copies

### Example Template Structure
```
templates/
├── global/
│   ├── README.md                   # Standard README template
│   ├── .github/workflows/ci-cd.yml # CI/CD pipeline
│   ├── package.json                # Package configuration
│   └── Dockerfile                  # Container configuration
└── ceos-identity/
    ├── src/auth/                   # Service-specific code
    └── config/oauth.yml            # OAuth configuration
```

## Provisioning Scripts

### Script Execution Order
Scripts execute in alphabetical order by default. Use numbered prefixes:
- `01-setup-environment.sh`
- `02-install-dependencies.sh`
- `03-configure-security.sh`

### Script Types

#### Shell Scripts (.sh)
```bash
#!/bin/bash
echo "Setting up $REPO_NAME"
cd "$REPO_PATH"
npm install
```

#### Node.js Scripts (.js)
```javascript
const fs = require('fs');
console.log(`Configuring ${process.env.REPO_NAME}`);
```

#### Inline Scripts
Defined in configuration files:
```yaml
provisioning:
  scripts:
    - name: "setup-database"
      command: "npm run db:setup"
```

### Available Environment Variables
- `REPO_PATH` - Repository directory path
- `REPO_NAME` - Repository name
- `REPO_OWNER` - Repository owner
- `BOOTSTRAP_CONFIG` - Full configuration as JSON

## Change Detection

The system intelligently detects which repositories need updates:

### Global Changes
Changes affecting all repositories:
- `templates/global/` modifications
- `provisioning/global/` modifications
- `bootstrap-config.yml` changes
- `repositories.yml` changes

### Repository-Specific Changes
Changes affecting individual repositories:
- `meta-config/[repo-name]/` modifications
- `templates/[repo-name]/` modifications
- `provisioning/[repo-name]/` modifications

## Usage Examples

### Creating a New Repository

1. **Add to repositories.yml:**
```yaml
repositories:
  - name: "ceos-notifications"
    owner: "Nicholiitus"
    description: "Notification Service"
    type: "microservice"
    technology: "typescript"
```

2. **Create configuration:**
```bash
mkdir -p meta-config/ceos-notifications
```

3. **Add config.yml:**
```yaml
repository:
  name: "ceos-notifications"
  description: "Centralized notification service"
variables:
  API_PREFIX: "/api/v1/notifications"
```

4. **Commit and push:**
```bash
git add .
git commit -m "feat: add ceos-notifications repository configuration"
git push
```

The workflow will automatically:
- Create the repository on GitHub
- Apply templates and configurations
- Run provisioning scripts
- Commit and push the initial setup

### Updating Multiple Repositories

**Global Template Update:**
```bash
# Modify global template
echo "Updated security policy" >> templates/global/SECURITY.md
git add .
git commit -m "security: update global security policy"
git push
```
All repositories will be updated automatically.

**Specific Repository Update:**
```bash
# Modify specific configuration
vim meta-config/ceos-identity/config.yml
git add .
git commit -m "config: update identity service configuration"
git push
```
Only `ceos-identity` repository will be updated.

### Manual Execution

**Update Specific Repositories:**
```bash
# Via GitHub UI or gh CLI
gh workflow run meta-repo-bootstrap.yml \
  --field target_repos="ceos-identity,ceos-orchestration"
```

**Dry Run:**
```bash
gh workflow run meta-repo-bootstrap.yml \
  --field dry_run=true
```

**Force Update All:**
```bash
gh workflow run meta-repo-bootstrap.yml \
  --field force_update=true
```

## Security Considerations

### Access Control
- Uses `CEOS_GITHUB_PAT` secret for repository operations
- Requires `repo` and `admin:org` scopes
- Supports fine-grained personal access tokens

### Secret Management
- Repository secrets are not automatically synchronized
- Use organization-level secrets for shared configurations
- Sensitive data should be managed through secure channels

### Branch Protection
- Bootstrap commits use `[skip ci]` to prevent CI loops
- Commits are made by `CEOS Bootstrap` user
- Changes are pushed directly to main branch (consider branch protection)

## Monitoring and Troubleshooting

### Workflow Monitoring
- Check Actions tab for execution status
- Review job summaries for detailed results
- Monitor individual repository updates

### Common Issues

**Repository Creation Fails:**
- Verify GitHub token permissions
- Check repository name conflicts
- Ensure organization limits not exceeded

**Template Application Fails:**
- Verify template syntax
- Check variable definitions
- Review file permissions

**Provisioning Script Fails:**
- Check script syntax and permissions
- Verify required dependencies
- Review environment variables

### Debugging

**Enable Verbose Logging:**
```yaml
# In bootstrap-config.yml
logging:
  level: "debug"
  verbose: true
```

**Dry Run Mode:**
Test changes without applying them:
```bash
gh workflow run meta-repo-bootstrap.yml --field dry_run=true
```

## Best Practices

### Configuration Management
1. **Version Control**: Keep all configurations in version control
2. **Documentation**: Document custom variables and scripts
3. **Testing**: Use dry run mode for testing changes
4. **Backup**: Maintain backups of critical configurations

### Template Design
1. **Modularity**: Keep templates focused and reusable
2. **Variables**: Use variables for customizable content
3. **Documentation**: Include template usage documentation
4. **Validation**: Test templates with different configurations

### Script Development
1. **Idempotency**: Scripts should be safe to run multiple times
2. **Error Handling**: Include proper error handling and logging
3. **Dependencies**: Clearly document script dependencies
4. **Testing**: Test scripts in isolated environments

### Security
1. **Secrets**: Never include secrets in templates or scripts
2. **Permissions**: Use minimal required permissions
3. **Validation**: Validate all inputs and configurations
4. **Audit**: Regularly audit repository access and changes

## Advanced Features

### Repository Groups
Process multiple repositories as groups:
```yaml
repository_groups:
  core_services:
    - "ceos-identity"
    - "ceos-orchestration"
```

### Deployment Dependencies
Define deployment order:
```yaml
deployment_order:
  - ["ceos-shared"]
  - ["ceos-identity", "ceos-config"]
  - ["ceos-gateway", "ceos-orchestration"]
```

### Conditional Processing
Apply templates conditionally:
```yaml
# In repository config
conditions:
  apply_security_templates: true
  enable_monitoring: false
```

### Custom Workflows
Include repository-specific workflows:
```yaml
workflows:
  - name: "custom-deployment"
    enabled: true
    schedule: "0 2 * * *"
```

## Integration Points

### CI/CD Integration
- Bootstrap automatically sets up CI/CD pipelines
- Integrates with existing GitHub Actions workflows
- Supports custom deployment strategies

### Monitoring Integration
- Configures health checks and metrics endpoints
- Sets up alerting and notification systems
- Integrates with observability platforms

### Security Integration
- Applies security scanning and policies
- Configures secret management
- Sets up compliance monitoring

## Maintenance

### Regular Tasks
1. **Review Configurations**: Monthly review of repository configurations
2. **Update Templates**: Regular updates to global templates
3. **Security Audits**: Quarterly security reviews
4. **Performance Monitoring**: Monitor workflow execution times

### Version Management
- Tag bootstrap system versions
- Maintain changelog for template updates
- Document breaking changes

### Backup and Recovery
- Regular backups of meta-repository
- Document recovery procedures
- Test disaster recovery processes
