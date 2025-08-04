"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Global test setup
const logger_1 = require("../src/utils/logger");
// Suppress logs during testing
logger_1.logger.transports.forEach((transport) => {
    transport.silent = true;
});
// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/ceos_test';
//# sourceMappingURL=setup.js.map