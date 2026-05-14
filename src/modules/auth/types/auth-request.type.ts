import type { Request } from 'express';
import type { SuperAdminProfile } from '../../super-admin/entities/super-admin-profile.entity';

export type CurrentSuperAdmin = {
  userId: string;
  refreshTokenId: string;
  email: string;
  accessLevel: SuperAdminProfile['accessLevel'];
};

export type SuperAdminAuthRequest = Request & {
  superAdmin?: CurrentSuperAdmin;
};
