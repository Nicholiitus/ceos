import { Router } from 'express';

const router = Router();

// Authentication endpoints
router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint - To be implemented' });
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logout endpoint - To be implemented' });
});

router.get('/profile', (req, res) => {
  res.json({ message: 'Profile endpoint - To be implemented' });
});

export { router as authRoutes };
