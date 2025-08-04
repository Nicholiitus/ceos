"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../src/index"));
describe('Health Endpoints', () => {
    describe('GET /health', () => {
        it('should return 200 and health status', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .get('/health')
                .expect(200);
            expect(response.body).toHaveProperty('status', 'OK');
            expect(response.body).toHaveProperty('service', 'CEOS');
            expect(response.body).toHaveProperty('timestamp');
        });
    });
    describe('GET /api/v1/health', () => {
        it('should return basic health information', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .get('/api/v1/health')
                .expect(200);
            expect(response.body).toHaveProperty('status', 'healthy');
            expect(response.body).toHaveProperty('service', 'CEOS');
        });
    });
    describe('GET /api/v1/health/detailed', () => {
        it('should return detailed health information', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .get('/api/v1/health/detailed')
                .expect(200);
            expect(response.body).toHaveProperty('status', 'healthy');
            expect(response.body).toHaveProperty('uptime');
            expect(response.body).toHaveProperty('memory');
            expect(response.body).toHaveProperty('checks');
        });
    });
});
//# sourceMappingURL=health.test.js.map