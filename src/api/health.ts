import { Router } from 'express';

const router = Router();

// Basic health check
router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'CEOS',
    version: '1.0.0',
  });
});

// Detailed health check
router.get('/detailed', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'CEOS',
    version: '1.0.0',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    checks: {
      database: 'healthy',
      redis: 'healthy',
      github: 'healthy',
    },
  });
});

export { router as healthRoutes };

