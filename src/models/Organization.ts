export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  githubOrgId: string;
  isActive: boolean;
  settings: OrganizationSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationSettings {
  copilotEnabled: boolean;
  analyticsEnabled: boolean;
  auditLogRetentionDays: number;
  allowedDomains: string[];
  enforceSSO: boolean;
  maxUsers: number;
}

export interface CreateOrganizationRequest {
  name: string;
  slug: string;
  description?: string;
  githubOrgId: string;
  settings?: Partial<OrganizationSettings>;
}
