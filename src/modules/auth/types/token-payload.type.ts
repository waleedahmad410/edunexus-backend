import type { SuperAdminProfile } from '../../super-admin/entities/super-admin-profile.entity';

export type SuperAdminAccessTokenPayload = {
  sub: string;
  rtid: string;
  role: 'SUPER_ADMIN';
  accessLevel: SuperAdminProfile['accessLevel'];
  iat?: number;
  exp?: number;
};