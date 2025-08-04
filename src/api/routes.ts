import { Router } from 'express';
import { analyticsRoutes } from './analytics';
import { authRoutes } from './auth';
import { healthRoutes } from './health';
import { orchestrationRoutes } from './orchestration';

const router = Router();

// API version prefix
const API_VERSION = '/v1';

// Health and status routes
router.use(`${API_VERSION}/health`, healthRoutes);

// Authentication routes
router.use(`${API_VERSION}/auth`, authRoutes);

// Core orchestration routes
router.use(`${API_VERSION}/orchestration`, orchestrationRoutes);

// Analytics and reporting routes
router.use(`${API_VERSION}/analytics`, analyticsRoutes);

// API documentation route
router.get(`${API_VERSION}/docs`, (req, res) => {
  res.json({
    message: 'CEOS API Documentation',
    version: '1.0.0',
    endpoints: {
      health: `${API_VERSION}/health`,
      auth: `${API_VERSION}/auth`,
      orchestration: `${API_VERSION}/orchestration`,
      analytics: `${API_VERSION}/analytics`,
    },
    documentation: 'https://docs.ceos.dev',
  });
});

export { router as apiRoutes };

