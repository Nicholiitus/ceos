#!/bin/bash

# CEOS Global Setup Script
# This script sets up the basic structure and configuration for all CEOS repositories

set -e

echo "🚀 Starting CEOS repository setup for: $REPO_NAME"
echo "📍 Repository path: $REPO_PATH"
echo "👤 Repository owner: $REPO_OWNER"

# Ensure we're in the repository directory
cd "$REPO_PATH"

# Create basic directory structure
echo "📁 Creating directory structure..."
mkdir -p src/{api,middleware,models,services,utils,types}
mkdir -p tests/{unit,integration,e2e}
mkdir -p docs/{api,architecture,deployment}
mkdir -p scripts/{build,deploy,maintenance}
mkdir -p config/{environments,security}
mkdir -p .vscode

# Create package.json if it doesn't exist
if [ ! -f "package.json" ]; then
    echo "📦 Creating package.json..."
    cat > package.json << EOF
{
  "name": "$REPO_NAME",
  "version": "1.0.0",
  "description": "CEOS managed repository: $REPO_NAME",
  "main": "dist/index.js",
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "security": "npm audit --audit-level=moderate",
    "clean": "rm -rf dist coverage"
  },
  "keywords": ["ceos", "typescript", "microservice"],
  "author": "$REPO_OWNER",
  "license": "MIT",
  "devDependencies": {
    "@types/node": "^18.0.0",
    "@types/jest": "^29.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0",
    "jest": "^29.0.0",
    "nodemon": "^3.0.0",
    "ts-jest": "^29.0.0",
    "ts-node": "^10.0.0",
    "typescript": "^5.0.0"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0",
    "winston": "^3.8.0"
  }
}
EOF
fi

# Create TypeScript configuration
if [ ! -f "tsconfig.json" ]; then
    echo "⚙️ Creating TypeScript configuration..."
    cat > tsconfig.json << EOF
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "noPropertyAccessFromIndexSignature": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
EOF
fi

# Create Jest configuration
if [ ! -f "jest.config.js" ]; then
    echo "🧪 Creating Jest configuration..."
    cat > jest.config.js << EOF
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
};
EOF
fi

# Create ESLint configuration
if [ ! -f ".eslintrc.js" ]; then
    echo "🔍 Creating ESLint configuration..."
    cat > .eslintrc.js << EOF
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    '@typescript-eslint/recommended-requiring-type-checking',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    'no-console': 'warn',
    'prefer-const': 'error',
  },
  env: {
    node: true,
    jest: true,
  },
};
EOF
fi

# Create basic .gitignore
if [ ! -f ".gitignore" ]; then
    echo "🚫 Creating .gitignore..."
    cat > .gitignore << EOF
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/
*.tsbuildinfo

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Temporary folders
tmp/
temp/

# Database
*.sqlite
*.db

# Security
*.pem
*.key
*.crt
private-keys/
EOF
fi

# Create basic index.ts if it doesn't exist
if [ ! -f "src/index.ts" ]; then
    echo "📝 Creating basic application structure..."
    cat > src/index.ts << EOF
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createLogger } from './utils/logger';

const app = express();
const logger = createLogger('$REPO_NAME');
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: '$REPO_NAME',
    version: '1.0.0'
  });
});

// API routes
app.get('/api/v1/info', (req, res) => {
  res.json({
    service: '$REPO_NAME',
    version: '1.0.0',
    description: 'CEOS managed microservice',
    owner: '$REPO_OWNER'
  });
});

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

// Start server
app.listen(port, () => {
  logger.info(\`\${port} server started on port \${port}\`);
  logger.info(\`Health check available at: http://localhost:\${port}/health\`);
});

export default app;
EOF
fi

# Create logger utility
if [ ! -f "src/utils/logger.ts" ]; then
    mkdir -p src/utils
    cat > src/utils/logger.ts << EOF
import winston from 'winston';

export const createLogger = (service: string): winston.Logger => {
  return winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    defaultMeta: { service },
    transports: [
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
  });

  // Add console transport in development
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple()
    }));
  }

  return logger;
};
EOF
fi

# Create test setup
if [ ! -f "tests/setup.ts" ]; then
    mkdir -p tests
    cat > tests/setup.ts << EOF
// Global test setup
beforeAll(async () => {
  // Global setup for all tests
});

afterAll(async () => {
  // Global cleanup for all tests
});
EOF
fi

# Create basic health test
if [ ! -f "tests/health.test.ts" ]; then
    cat > tests/health.test.ts << EOF
import request from 'supertest';
import app from '../src/index';

describe('Health Endpoints', () => {
  describe('GET /health', () => {
    it('should return 200 and health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('service', '$REPO_NAME');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/v1/info', () => {
    it('should return service information', async () => {
      const response = await request(app)
        .get('/api/v1/info')
        .expect(200);

      expect(response.body).toHaveProperty('service', '$REPO_NAME');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('owner', '$REPO_OWNER');
    });
  });
});
EOF
fi

# Create Dockerfile
if [ ! -f "Dockerfile" ]; then
    echo "🐳 Creating Dockerfile..."
    cat > Dockerfile << EOF
# Multi-stage build for optimal image size
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "run", "dev"]

FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copy built application
COPY --from=builder /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Create logs directory
RUN mkdir logs && chown nodejs:nodejs logs

USER nodejs

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

CMD ["npm", "start"]
EOF
fi

# Create VS Code settings
if [ ! -f ".vscode/settings.json" ]; then
    mkdir -p .vscode
    cat > .vscode/settings.json << EOF
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/coverage": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/coverage": true
  }
}
EOF
fi

echo "✅ CEOS repository setup completed for: $REPO_NAME"
echo "📦 Next steps:"
echo "   1. Run 'npm install' to install dependencies"
echo "   2. Run 'npm run dev' to start development server"
echo "   3. Run 'npm test' to execute tests"
echo "   4. Configure environment variables as needed"
