#!/usr/bin/env node

/**
 * CEOS Development Environment Setup
 * This script helps set up the development environment with proper TypeScript configurations
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up CEOS Development Environment...\n');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'tsconfig.json',
  '.env.example',
  'src/index.ts'
];

const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));

if (missingFiles.length > 0) {
  console.error('❌ Missing required files:');
  missingFiles.forEach(file => console.error(`   - ${file}`));
  process.exit(1);
}

// Check if .env exists, if not create from example
if (!fs.existsSync('.env')) {
  console.log('📄 Creating .env file from .env.example...');
  fs.copyFileSync('.env.example', '.env');
  console.log('✅ .env file created. Please update with your configuration.\n');
} else {
  console.log('✅ .env file exists.\n');
}

// Check TypeScript configuration
console.log('🔧 Checking TypeScript configuration...');
try {
  const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  
  const requiredOptions = [
    'strict',
    'esModuleInterop',
    'skipLibCheck',
    'forceConsistentCasingInFileNames'
  ];
  
  const missingOptions = requiredOptions.filter(option => 
    !tsconfig.compilerOptions || !tsconfig.compilerOptions[option]
  );
  
  if (missingOptions.length > 0) {
    console.warn('⚠️  Missing recommended TypeScript options:');
    missingOptions.forEach(option => console.warn(`   - ${option}`));
  } else {
    console.log('✅ TypeScript configuration looks good.');
  }
} catch (error) {
  console.error('❌ Error reading tsconfig.json:', error.message);
}

// Check package.json scripts
console.log('\n📦 Checking package.json scripts...');
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const requiredScripts = [
    'build', 'start', 'dev', 'test', 'lint'
  ];
  
  const missingScripts = requiredScripts.filter(script => 
    !pkg.scripts || !pkg.scripts[script]
  );
  
  if (missingScripts.length > 0) {
    console.warn('⚠️  Missing recommended scripts:');
    missingScripts.forEach(script => console.warn(`   - ${script}`));
  } else {
    console.log('✅ Package.json scripts look good.');
  }
} catch (error) {
  console.error('❌ Error reading package.json:', error.message);
}

// Check for GitHub configuration
console.log('\n🐙 Checking GitHub configuration...');
if (fs.existsSync('.github/workflows')) {
  console.log('✅ GitHub Actions workflows found.');
} else {
  console.log('📝 No GitHub Actions workflows found. Consider adding CI/CD.');
}

// Display next steps
console.log('\n🎯 Next Steps:');
console.log('1. Update .env file with your GitHub credentials');
console.log('2. Run: npm install');
console.log('3. Run: npm run build');
console.log('4. Run: npm run dev');
console.log('5. Visit: http://localhost:3001/health');

console.log('\n✨ Setup complete! Happy coding! 🚀');
