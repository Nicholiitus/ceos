export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/* eslint-disable no-unused-vars */
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  DEVELOPER = 'developer',
  VIEWER = 'viewer',
}
/* eslint-enable no-unused-vars */

export interface CreateUserRequest {
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
}

export interface UpdateUserRequest {
  name?: string;
  role?: UserRole;
  isActive?: boolean;
}
