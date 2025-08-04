import request from 'supertest';
import app from '../src/index';

describe('Health Endpoints', () => {
  describe('GET /health', () => {
    it('should return 200 and health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('service', 'CEOS');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/v1/health', () => {
    it('should return basic health information', async () => {
      const response = await request(app)
        .get('/api/v1/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('service', 'CEOS');
    });
  });

  describe('GET /api/v1/health/detailed', () => {
    it('should return detailed health information', async () => {
      const response = await request(app)
        .get('/api/v1/health/detailed')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('memory');
      expect(response.body).toHaveProperty('checks');
    });
  });
});
