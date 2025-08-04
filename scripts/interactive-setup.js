#!/usr/bin/env node

/**
 * Interactive CEOS Configuration Setup
 * Securely configure your GitHub Personal Access Token and other secrets
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to hide input for sensitive data
function hiddenQuestion(query) {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    const stdout = process.stdout;
    
    stdout.write(query);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    
    let input = '';
    stdin.on('data', function(char) {
      char = char + '';
      
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004':
          stdin.setRawMode(false);
          stdin.pause();
          stdout.write('\n');
          resolve(input);
          break;
        case '\u0003':
          process.exit();
          break;
        case '\u007f': // backspace
          if (input.length > 0) {
            input = input.slice(0, -1);
            stdout.write('\b \b');
          }
          break;
        default:
          input += char;
          stdout.write('*');
          break;
      }
    });
  });
}

// Function to ask regular questions
function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function main() {
  console.log('🚀 Welcome to CEOS Interactive Setup!\n');
  console.log('This script will help you configure your GitHub Personal Access Token');
  console.log('and other environment variables securely.\n');

  try {
    // Read current .env file
    const envPath = path.join(process.cwd(), '.env');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
      console.log('✅ Found existing .env file\n');
    } else {
      console.log('❌ No .env file found. Please make sure you\'re in the CEOS directory.\n');
      process.exit(1);
    }

    // Step 1: Configure GitHub PAT
    console.log('🔐 Step 1: GitHub Personal Access Token Configuration');
    console.log('════════════════════════════════════════════════════');
    console.log('Please enter your GitHub Personal Access Token.');
    console.log('It should start with "ghp_" and be about 40 characters long.\n');
    
    const githubToken = await hiddenQuestion('Enter your GitHub PAT: ');
    
    if (!githubToken) {
      console.log('\n❌ No token provided. Exiting...');
      process.exit(1);
    }
    
    if (!githubToken.startsWith('ghp_')) {
      console.log('\n⚠️  Warning: Token doesn\'t start with "ghp_". This might not be a classic PAT.');
      const confirm = await question('Continue anyway? (y/N): ');
      if (confirm.toLowerCase() !== 'y') {
        console.log('Exiting...');
        process.exit(1);
      }
    }

    // Step 2: Configure JWT Secret
    console.log('\n🔑 Step 2: JWT Secret Configuration');
    console.log('══════════════════════════════════════');
    console.log('Generating a secure JWT secret...');
    
    const jwtSecret = crypto.randomBytes(64).toString('hex');
    console.log('✅ Generated secure JWT secret\n');

    // Step 3: Configure Session Secret
    console.log('🛡️  Step 3: Session Secret Configuration');
    console.log('═══════════════════════════════════════');
    console.log('Generating a secure session secret...');
    
    const sessionSecret = crypto.randomBytes(32).toString('hex');
    console.log('✅ Generated secure session secret\n');

    // Step 4: Configure environment type
    console.log('🏗️  Step 4: Environment Configuration');
    console.log('════════════════════════════════════');
    
    const envType = await question('Are you configuring for GitHub.com or GitHub Enterprise Server? (github.com/enterprise): ');
    
    let githubApiUrl, githubBaseUrl, githubGraphqlUrl;
    
    if (envType.toLowerCase().includes('enterprise')) {
      console.log('\n🏢 GitHub Enterprise Server Configuration');
      const enterpriseUrl = await question('Enter your GitHub Enterprise Server URL (e.g., https://github.yourcompany.com): ');
      githubBaseUrl = enterpriseUrl;
      githubApiUrl = `${enterpriseUrl}/api/v3`;
      githubGraphqlUrl = `${enterpriseUrl}/api/graphql`;
    } else {
      console.log('\n☁️  Configuring for GitHub.com');
      githubBaseUrl = 'https://github.com';
      githubApiUrl = 'https://api.github.com';
      githubGraphqlUrl = 'https://api.github.com/graphql';
    }

    // Step 5: Update .env file
    console.log('\n📝 Step 5: Updating Configuration');
    console.log('═════════════════════════════════════');
    
    // Update GitHub URLs
    envContent = envContent.replace(
      /GITHUB_ENTERPRISE_URL=.*/,
      `GITHUB_ENTERPRISE_URL=${githubBaseUrl}`
    );
    envContent = envContent.replace(
      /GITHUB_API_URL=.*/,
      `GITHUB_API_URL=${githubApiUrl}`
    );
    envContent = envContent.replace(
      /GITHUB_GRAPHQL_URL=.*/,
      `GITHUB_GRAPHQL_URL=${githubGraphqlUrl}`
    );
    
    // Update PAT
    envContent = envContent.replace(
      /GITHUB_PERSONAL_ACCESS_TOKEN=.*/,
      `GITHUB_PERSONAL_ACCESS_TOKEN=${githubToken}`
    );
    
    // Update JWT Secret
    envContent = envContent.replace(
      /JWT_SECRET=.*/,
      `JWT_SECRET=${jwtSecret}`
    );
    
    // Update Session Secret
    envContent = envContent.replace(
      /SESSION_SECRET=.*/,
      `SESSION_SECRET=${sessionSecret}`
    );

    // Fix the port to 3001 (as used in our development)
    envContent = envContent.replace(
      /PORT=3000/,
      'PORT=3001'
    );

    // Update CORS origin to match the port
    envContent = envContent.replace(
      /CORS_ORIGIN=http:\/\/localhost:3000/,
      'CORS_ORIGIN=http://localhost:3001'
    );

    // Write updated .env file
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Updated .env file with your configuration\n');

    // Step 6: Validate the configuration
    console.log('🔍 Step 6: Validating Configuration');
    console.log('══════════════════════════════════════');
    console.log('Testing your GitHub PAT...\n');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }

  // Run validation
  console.log('Running validation script...\n');
  const { spawn } = require('child_process');
  
  const validation = spawn('npm', ['run', 'validate:github'], {
    stdio: 'inherit',
    shell: true
  });

  validation.on('close', (code) => {
    if (code === 0) {
      console.log('\n🎉 Setup Complete!');
      console.log('═══════════════════');
      console.log('Your CEOS application is now configured and ready to use!');
      console.log('\n📋 Next Steps:');
      console.log('1. Start the development server: npm run dev');
      console.log('2. Visit: http://localhost:3001/health');
      console.log('3. Check API docs: http://localhost:3001/api/v1/docs');
      console.log('4. Review setup guide: docs/github-pat-setup.md\n');
    } else {
      console.log('\n⚠️  Setup completed but validation failed.');
      console.log('Please check your token and try again with: npm run validate:github\n');
    }
  });
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\n👋 Setup cancelled by user');
  process.exit(0);
});

main();
