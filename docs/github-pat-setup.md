# 🔐 GitHub Personal Access Token Configuration Guide

## Quick Setup Instructions

### 1. Create Your GitHub PAT

1. **Open GitHub Settings**: [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. **Set Token Name**: `CEOS Development Token`
4. **Set Expiration**: Choose your preferred duration (90 days recommended for development)

### 2. Required Scopes

Select these scopes for full CEOS functionality:

#### **Essential Scopes:**
- ✅ `repo` - Full control of private repositories
- ✅ `public_repo` - Access public repositories  
- ✅ `read:org` - Read organization membership
- ✅ `read:user` - Read user profile information
- ✅ `user:email` - Access user email addresses

#### **For GitHub Copilot Management:**
- ✅ `copilot` - Manage GitHub Copilot for Business
- ✅ `manage_billing:copilot` - View and manage Copilot billing

#### **For Administrative Features (Optional):**
- ⚪ `admin:org` - Full control of organizations
- ⚪ `admin:org_hook` - Full control of organization hooks

### 3. Configure Your Token

1. **Copy your generated token** (starts with `ghp_`)
2. **Open your `.env` file** in VS Code
3. **Replace the placeholder**:
   ```env
   GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_actual_token_here
   ```

### 4. Validate Your Configuration

Run the validation script to test your setup:

```bash
npm run validate:github
```

This will check:
- ✅ Token authentication
- ✅ Available scopes
- ✅ Rate limits
- ✅ Organization access
- ✅ User permissions

### 5. Test Your CEOS Application

Start the development server:

```bash
npm run dev
```

Test the GitHub integration:

```bash
curl http://localhost:3001/api/v1/health/detailed
```

## 🔒 Security Best Practices

### **Token Security:**
- ❌ **Never commit your token to git**
- ✅ **Keep it in `.env` file only** (already in `.gitignore`)
- ✅ **Rotate tokens regularly** (every 90 days)
- ✅ **Use minimal required scopes**

### **Environment Security:**
- ✅ **Generated secure JWT secret**
- ✅ **Environment variables properly configured**
- ✅ **Development vs Production separation**

## 🚨 Troubleshooting

### **"Authentication failed" errors:**
1. Check token is correctly copied (no extra spaces)
2. Verify token hasn't expired
3. Ensure required scopes are selected

### **"Insufficient permissions" errors:**
1. Check if you have access to the organization
2. Verify token scopes include `read:org`
3. Contact organization admin if needed

### **Rate limit issues:**
1. Check current limits: `npm run validate:github`
2. Consider using GitHub App instead of PAT for production

## 📋 Next Steps After Configuration

1. **Test Authentication**: `npm run validate:github`
2. **Start Development**: `npm run dev`
3. **Run Tests**: `npm test`
4. **Explore API**: Visit `http://localhost:3001/api/v1/docs`

## 🎯 Ready for Development!

Once your PAT is configured, you can:
- 🔐 Authenticate users with GitHub
- 📊 Access organization data
- 👥 Manage GitHub Copilot seats
- 📈 Collect usage analytics
- ⚙️ Configure organizational policies

---

**Need help?** Check the validation script output or review the application logs for detailed error messages.
