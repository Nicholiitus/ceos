// Global type definitions for CEOS

import { Request } from 'express';
import { UserRole } from '../models/User';

// Extend Express Request interface for authentication
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        login: string;
        email: string;
        role: UserRole;
        name: string;
        avatarUrl: string;
        organizationId?: string;
        githubId?: string;
        organizations: string[];
      };
      githubToken?: string;
      organization?: {
        id: string;
        name: string;
        githubOrgId: string;
        settings: Record<string, any>;
      };
    }
  }
}

// GitHub API types
export interface GitHubUser {
  id: number;
  login: string;
  email?: string;
  name?: string;
  avatar_url: string;
  company?: string;
  location?: string;
  bio?: string;
}

export interface GitHubOrganization {
  id: number;
  login: string;
  name?: string;
  description?: string;
  avatar_url: string;
  html_url: string;
  members_count?: number;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  description?: string;
  html_url: string;
  clone_url: string;
  ssh_url: string;
  language?: string;
  topics: string[];
  created_at: string;
  updated_at: string;
}

// Copilot-specific types
export interface CopilotSeat {
  assignee: GitHubUser;
  organization: GitHubOrganization;
  created_at: string;
  updated_at: string;
  pending_cancellation_date?: string;
  last_activity_at?: string;
  last_activity_editor?: string;
}

export interface CopilotUsage {
  day: string;
  total_suggestions_count: number;
  total_acceptances_count: number;
  total_lines_suggested: number;
  total_lines_accepted: number;
  total_active_users: number;
  breakdown: Array<{
    language: string;
    editor: string;
    suggestions_count: number;
    acceptances_count: number;
    lines_suggested: number;
    lines_accepted: number;
  }>;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pagination?: {
    page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

// Environment types
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
}

export interface AppConfig {
  port: number;
  environment: 'development' | 'production' | 'test';
  database: DatabaseConfig;
  redis: RedisConfig;
  github: {
    baseUrl: string;
    apiUrl: string;
    personalAccessToken?: string;
    appId?: string;
    clientId?: string;
    clientSecret?: string;
    privateKey?: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  cors: {
    origin: string[];
    credentials: boolean;
  };
}

// Error types
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  validationErrors?: ValidationError[];
}

export { Request };
