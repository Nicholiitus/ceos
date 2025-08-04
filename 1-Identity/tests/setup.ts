// Global test setup
import { logger } from '../src/utils/loggertils/logger';

// Suppress logs during testing
logger.transports.forEach((transport) => {
  transport.silent = true;
});

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/ceos_test';
