# GitHub Enterprise Authentication Setup

This guide will help you configure CEOS to authenticate with your GitHub Enterprise instance.

## Prerequisites

1. **GitHub Enterprise Server** or **GitHub Enterprise Cloud** account
2. **Organization admin** access to create GitHub Apps
3. **VS Code** with GitHub extensions installed

## Step 1: Configure VS Code for GitHub Enterprise

### 1.1 Update VS Code Settings

The project includes VS Code settings configured for GitHub Enterprise. Update the GitHub Enterprise URL in `.vscode/settings.json`:

```json
{
  "github-enterprise.uri": "https://github.yourcompany.com"
}
```

### 1.2 Install Required Extensions

The following extensions are automatically recommended and configured:

- **GitHub Pull Requests and Issues** - For PR and issue management
- **GitHub Copilot** - AI-powered code assistance
- **GitHub Copilot Chat** - Interactive AI assistance
- **GitHub Remote - Repositories** - Remote repository access
- **GitHub Actions** - Workflow management

## Step 2: Create GitHub App (Recommended)

### 2.1 Create a New GitHub App

1. Navigate to your GitHub Enterprise instance
2. Go to **Settings** > **Developer settings** > **GitHub Apps**
3. Click **New GitHub App**

### 2.2 Configure App Settings

**Basic Information:**
- **GitHub App name**: `CEOS-YourOrg`
- **Description**: `Copilot Enterprise Orchestration System`
- **Homepage URL**: `https://your-ceos-instance.com`

**Webhook:**
- **Webhook URL**: `https://your-ceos-instance.com/api/v1/webhooks/github`
- **Webhook secret**: Generate a secure secret
- **SSL verification**: Enabled

**Permissions:**
```
Repository permissions:
- Contents: Read
- Metadata: Read
- Pull requests: Write

Organization permissions:
- Members: Read
- Administration: Read
- Copilot Business: Read & Write

Account permissions:
- Email addresses: Read
```

**Events:**
- [x] Organization
- [x] Repository
- [x] Member
- [x] Pull request

### 2.3 Generate Private Key

1. After creating the app, scroll to **Private keys**
2. Click **Generate a private key**
3. Download the `.pem` file
4. Store it securely (e.g., `config/github-app-private-key.pem`)

## Step 3: Configure Environment Variables

### 3.1 Copy Environment Template

```bash
cp .env.example .env
```

### 3.2 Update Environment Variables

```bash
# GitHub Enterprise Configuration
GITHUB_ENTERPRISE_URL=https://github.yourcompany.com
GITHUB_API_URL=https://github.yourcompany.com/api/v3
GITHUB_GRAPHQL_URL=https://github.yourcompany.com/api/graphql

# GitHub App Configuration
GITHUB_APP_ID=123456
GITHUB_CLIENT_ID=Iv1.a1b2c3d4e5f6g7h8
GITHUB_CLIENT_SECRET=1234567890abcdef1234567890abcdef12345678
GITHUB_PRIVATE_KEY_PATH=./config/github-app-private-key.pem
GITHUB_WEBHOOK_SECRET=your-webhook-secret

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h
```

## Step 4: Alternative Authentication Methods

### 4.1 Personal Access Token (Development)

For development/testing, you can use a Personal Access Token:

1. Go to **Settings** > **Developer settings** > **Personal access tokens**
2. Click **Generate new token (classic)**
3. Select scopes:
   - `repo` (Full control of private repositories)
   - `admin:org` (Full control of orgs and teams)
   - `user` (Update ALL user data)

```bash
# Add to .env
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4.2 OAuth App (Web Authentication)

For web-based user authentication:

1. Go to **Settings** > **Developer settings** > **OAuth Apps**
2. Click **New OAuth App**
3. Configure:
   - **Application name**: `CEOS Web Interface`
   - **Homepage URL**: `https://your-ceos-instance.com`
   - **Authorization callback URL**: `https://your-ceos-instance.com/auth/callback`

```bash
# Add to .env
GITHUB_OAUTH_CLIENT_ID=1234567890abcdef1234
GITHUB_OAUTH_CLIENT_SECRET=1234567890abcdef1234567890abcdef12345678
```

## Step 5: Test Authentication

### 5.1 Start Development Server

```bash
npm run dev
```

### 5.2 Test Health Check

```bash
curl http://localhost:3000/api/v1/health/detailed
```

You should see GitHub connection status in the response.

### 5.3 Test GitHub API Access

```bash
# Test with Personal Access Token
curl -H "Authorization: token YOUR_TOKEN" \
     https://github.yourcompany.com/api/v3/user
```

## Step 6: VS Code Authentication

### 6.1 Sign in to GitHub Enterprise

1. Open VS Code Command Palette (`Ctrl+Shift+P`)
2. Run: `GitHub: Sign in to GitHub Enterprise`
3. Enter your GitHub Enterprise URL
4. Follow the authentication flow

### 6.2 Configure Git

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@yourcompany.com"

# For GitHub Enterprise
git config --global github.enterprise.hostname github.yourcompany.com
```

## Troubleshooting

### Common Issues

**1. SSL Certificate Issues**
```bash
# For self-signed certificates (development only)
git config --global http.sslVerify false
```

**2. GitHub Enterprise URL Format**
- Ensure URL doesn't end with `/`
- Use HTTPS protocol
- Include port if not standard (443 for HTTPS)

**3. Permission Issues**
- Verify GitHub App has correct permissions
- Check organization membership and roles
- Ensure token scopes are sufficient

**4. Network Issues**
- Check firewall settings
- Verify DNS resolution
- Test direct API access

### Logs and Debugging

Enable debug logging:
```bash
# Add to .env
LOG_LEVEL=debug
NODE_ENV=development
```

Check application logs:
```bash
tail -f logs/combined.log
```

## Security Best Practices

1. **Never commit secrets** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate tokens regularly** (every 90 days)
4. **Use least privilege** principle for permissions
5. **Enable audit logging** for all authentication events
6. **Monitor for suspicious activity** in GitHub audit logs

## Support

For additional help:
- Check GitHub Enterprise documentation
- Contact your GitHub Enterprise administrator
- Create an issue in the CEOS repository
