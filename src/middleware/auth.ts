import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
import { createGitHubEnterpriseService } from '../services/githubEnterprise';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    login: string;
    email: string;
    name: string;
    avatarUrl: string;
    organizations: string[];
  };
  githubToken?: string;
}

export interface JWTPayload {
  userId: string;
  login: string;
  githubToken: string;
  organizations: string[];
  iat: number;
  exp: number;
}

// Middleware to authenticate requests using JWT tokens
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      logger.error('JWT_SECRET not configured');
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
    
    // Validate the GitHub token is still valid
    const githubService = createGitHubEnterpriseService();
    
    // Override the token for this request
    githubService['config'].personalAccessToken = decoded.githubToken;
    githubService['setupAuthentication']();

    try {
      const githubUser = await githubService.getAuthenticatedUser();
      
      req.user = {
        id: decoded.userId,
        login: githubUser.login,
        email: githubUser.email,
        name: githubUser.name,
        avatarUrl: githubUser.avatar_url,
        organizations: decoded.organizations,
      };
      req.githubToken = decoded.githubToken;

      next();
    } catch (githubError) {
      logger.warn('GitHub token validation failed', {
        error: githubError.message,
        userId: decoded.userId,
      });
      res.status(401).json({ error: 'Invalid or expired GitHub token' });
      return;
    }
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'Token expired' });
      return;
    }
    
    logger.error('Token authentication failed', error);
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Middleware to check if user has access to specific organization
export const requireOrganizationAccess = (orgName: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!req.user.organizations.includes(orgName)) {
      res.status(403).json({ 
        error: 'Organization access required',
        organization: orgName 
      });
      return;
    }

    next();
  };
};

// Middleware to check if user has admin role in organization
export const requireAdminAccess = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || !req.githubToken) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const orgName = req.params.org || req.body.organization;
    if (!orgName) {
      res.status(400).json({ error: 'Organization parameter required' });
      return;
    }

    const githubService = createGitHubEnterpriseService();
    githubService['config'].personalAccessToken = req.githubToken;
    githubService['setupAuthentication']();

    // Check if user is admin in the organization
    try {
      const response = await githubService['axiosInstance'].get(
        `/orgs/${orgName}/memberships/${req.user.login}`
      );
      
      if (response.data.role !== 'admin') {
        res.status(403).json({ 
          error: 'Admin access required',
          organization: orgName,
          currentRole: response.data.role 
        });
        return;
      }

      next();
    } catch (membershipError) {
      logger.warn('Failed to check organization membership', {
        error: membershipError.message,
        userId: req.user.id,
        organization: orgName,
      });
      res.status(403).json({ 
        error: 'Organization membership required',
        organization: orgName 
      });
      return;
    }
  } catch (error) {
    logger.error('Admin access check failed', error);
    res.status(500).json({ error: 'Authorization check failed' });
  }
};

// Generate JWT token for authenticated user
export const generateUserToken = (user: any, githubToken: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET not configured');
  }

  const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
    userId: user.id.toString(),
    login: user.login,
    githubToken,
    organizations: user.organizations || [],
  };

  return jwt.sign(payload, jwtSecret, { 
    expiresIn: process.env.JWT_EXPIRES_IN || '24h' 
  });
};
