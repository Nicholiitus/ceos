import axios, { AxiosInstance } from 'axios';
import { logger } from '../utils/logger';

export interface GitHubEnterpriseConfig {
  baseUrl: string;
  apiUrl: string;
  graphqlUrl: string;
  personalAccessToken?: string;
  appId?: string;
  clientId?: string;
  clientSecret?: string;
  privateKey?: string;
}

export class GitHubEnterpriseService {
  private axiosInstance: AxiosInstance;
  private config: GitHubEnterpriseConfig;

  constructor(config: GitHubEnterpriseConfig) {
    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: config.apiUrl,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'CEOS/1.0.0',
      },
      timeout: 30000,
    });

    this.setupAuthentication();
    this.setupInterceptors();
  }

  private setupAuthentication(): void {
    if (this.config.personalAccessToken) {
      this.axiosInstance.defaults.headers.common['Authorization'] = 
        `token ${this.config.personalAccessToken}`;
      logger.info('GitHub Enterprise authentication configured with Personal Access Token');
    } else {
      logger.warn('No GitHub Enterprise authentication configured');
    }
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        logger.debug('GitHub API request', {
          method: config.method,
          url: config.url,
          headers: config.headers,
        });
        return config;
      },
      (error) => {
        logger.error('GitHub API request error', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        logger.debug('GitHub API response', {
          status: response.status,
          headers: response.headers,
        });
        return response;
      },
      (error) => {
        logger.error('GitHub API response error', {
          status: error.response?.status,
          message: error.response?.data?.message,
          url: error.config?.url,
        });
        return Promise.reject(error);
      }
    );
  }

  // Get authenticated user
  async getAuthenticatedUser() {
    try {
      const response = await this.axiosInstance.get('/user');
      return response.data;
    } catch (error) {
      logger.error('Failed to get authenticated user', error);
      throw error;
    }
  }

  // Get organization information
  async getOrganization(org: string) {
    try {
      const response = await this.axiosInstance.get(`/orgs/${org}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to get organization ${org}`, error);
      throw error;
    }
  }

  // Get organization members
  async getOrganizationMembers(org: string) {
    try {
      const response = await this.axiosInstance.get(`/orgs/${org}/members`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to get organization members for ${org}`, error);
      throw error;
    }
  }

  // Get repositories for an organization
  async getOrganizationRepositories(org: string, page = 1, perPage = 30) {
    try {
      const response = await this.axiosInstance.get(`/orgs/${org}/repos`, {
        params: {
          page,
          per_page: perPage,
          sort: 'updated',
          direction: 'desc',
        },
      });
      return response.data;
    } catch (error) {
      logger.error(`Failed to get repositories for organization ${org}`, error);
      throw error;
    }
  }

  // Get Copilot usage for organization
  async getCopilotUsage(org: string) {
    try {
      const response = await this.axiosInstance.get(`/orgs/${org}/copilot/usage`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to get Copilot usage for organization ${org}`, error);
      throw error;
    }
  }

  // Get Copilot seats for organization
  async getCopilotSeats(org: string) {
    try {
      const response = await this.axiosInstance.get(`/orgs/${org}/copilot/billing/seats`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to get Copilot seats for organization ${org}`, error);
      throw error;
    }
  }

  // Add Copilot seat for user
  async addCopilotSeat(org: string, username: string) {
    try {
      const response = await this.axiosInstance.post(`/orgs/${org}/copilot/billing/selected_users`, {
        selected_usernames: [username],
      });
      return response.data;
    } catch (error) {
      logger.error(`Failed to add Copilot seat for user ${username} in organization ${org}`, error);
      throw error;
    }
  }

  // Remove Copilot seat for user
  async removeCopilotSeat(org: string, username: string) {
    try {
      const response = await this.axiosInstance.delete(`/orgs/${org}/copilot/billing/selected_users`, {
        data: {
          selected_usernames: [username],
        },
      });
      return response.data;
    } catch (error) {
      logger.error(`Failed to remove Copilot seat for user ${username} in organization ${org}`, error);
      throw error;
    }
  }

  // Health check for GitHub Enterprise connection
  async healthCheck(): Promise<{ status: string; details: any }> {
    try {
      const response = await this.axiosInstance.get('/rate_limit');
      return {
        status: 'healthy',
        details: {
          rateLimit: response.data,
          apiUrl: this.config.apiUrl,
          authenticated: !!this.config.personalAccessToken,
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: error.message,
          apiUrl: this.config.apiUrl,
          authenticated: !!this.config.personalAccessToken,
        },
      };
    }
  }
}

// Factory function to create GitHub Enterprise service
export function createGitHubEnterpriseService(): GitHubEnterpriseService {
  const config: GitHubEnterpriseConfig = {
    baseUrl: process.env.GITHUB_ENTERPRISE_URL || 'https://github.com',
    apiUrl: process.env.GITHUB_API_URL || 'https://api.github.com',
    graphqlUrl: process.env.GITHUB_GRAPHQL_URL || 'https://api.github.com/graphql',
    personalAccessToken: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
    appId: process.env.GITHUB_APP_ID,
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    privateKey: process.env.GITHUB_PRIVATE_KEY_PATH,
  };

  return new GitHubEnterpriseService(config);
}
