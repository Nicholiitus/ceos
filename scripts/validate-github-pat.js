#!/usr/bin/env node

/**
 * GitHub PAT Validation Script
 * This script validates that your GitHub Personal Access Token is working correctly
 */

require('dotenv').config();
const { Octokit } = require('@octokit/rest');

async function validateGitHubPAT() {
  console.log('🔍 Validating GitHub Personal Access Token...\n');

  const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
  
  if (!token) {
    console.error('❌ No GitHub Personal Access Token found in .env file');
    console.log('   Please set GITHUB_PERSONAL_ACCESS_TOKEN in your .env file\n');
    process.exit(1);
  }

  if (token === 'ghp_your_actual_token_here_replace_this' || token === 'your_personal_access_token') {
    console.error('❌ GitHub Personal Access Token not configured');
    console.log('   Please replace the placeholder with your actual token in .env file\n');
    process.exit(1);
  }

  console.log('🔑 Token found, validating...');

  try {
    const octokit = new Octokit({
      auth: token,
      userAgent: 'CEOS/1.0.0'
    });

    // Test 1: Get authenticated user
    console.log('📋 Test 1: Getting authenticated user...');
    const { data: user } = await octokit.rest.users.getAuthenticated();
    console.log(`✅ Authenticated as: ${user.login} (${user.name || 'No name set'})`);

    // Test 2: Check token scopes
    console.log('\n📋 Test 2: Checking token scopes...');
    const { headers } = await octokit.rest.users.getAuthenticated();
    const scopes = headers['x-oauth-scopes'] ? headers['x-oauth-scopes'].split(', ') : [];
    
    console.log('📝 Available scopes:');
    scopes.forEach(scope => console.log(`   - ${scope}`));

    // Test 3: Check required scopes
    console.log('\n📋 Test 3: Validating required scopes...');
    const requiredScopes = ['repo', 'read:org', 'read:user', 'user:email'];
    const missingScopes = requiredScopes.filter(scope => !scopes.includes(scope));

    if (missingScopes.length > 0) {
      console.warn('⚠️  Missing recommended scopes:');
      missingScopes.forEach(scope => console.warn(`   - ${scope}`));
      console.log('\n💡 Consider adding these scopes for full functionality');
    } else {
      console.log('✅ All required scopes are present');
    }

    // Test 4: Check rate limits
    console.log('\n📋 Test 4: Checking rate limits...');
    const { data: rateLimit } = await octokit.rest.rateLimit.get();
    console.log(`📊 Rate limit: ${rateLimit.resources.core.remaining}/${rateLimit.resources.core.limit} remaining`);
    console.log(`🕐 Reset time: ${new Date(rateLimit.resources.core.reset * 1000).toLocaleString()}`);

    // Test 5: Test organization access (if user has orgs)
    console.log('\n📋 Test 5: Checking organization access...');
    try {
      const { data: orgs } = await octokit.rest.orgs.listForAuthenticatedUser();
      if (orgs.length > 0) {
        console.log(`✅ Access to ${orgs.length} organization(s):`);
        orgs.slice(0, 3).forEach(org => console.log(`   - ${org.login}`));
        if (orgs.length > 3) {
          console.log(`   ... and ${orgs.length - 3} more`);
        }
      } else {
        console.log('ℹ️  No organization memberships found');
      }
    } catch (error) {
      console.log('ℹ️  Organization access check skipped (insufficient permissions)');
    }

    console.log('\n🎉 GitHub PAT validation successful!');
    console.log('✅ Your CEOS application is ready to authenticate with GitHub\n');

  } catch (error) {
    console.error('❌ GitHub PAT validation failed:');
    console.error(`   ${error.message}\n`);
    
    if (error.status === 401) {
      console.log('💡 Suggestions:');
      console.log('   - Check that your token is correct');
      console.log('   - Ensure the token hasn\'t expired');
      console.log('   - Verify the token has required scopes\n');
    }
    
    process.exit(1);
  }
}

// Run validation
validateGitHubPAT().catch(console.error);
