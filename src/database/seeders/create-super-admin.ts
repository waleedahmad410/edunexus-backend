import 'dotenv/config';

import { EntityManager } from '@mikro-orm/postgresql';
import { NestFactory } from '@nestjs/core';
import { randomUUID } from 'node:crypto';

import { AppModule } from '../../app.module';
import { PasswordService } from '../../modules/auth/services/password.service';

import { Role } from '../../modules/roles/entities/role.entity';
import { SuperAdminProfile } from '../../modules/super-admin/entities/super-admin-profile.entity';
import { UserRoleAssignment } from '../../modules/users/entities/user-role-assignment.entity';
import { User } from '../../modules/users/entities/user.entity';

const USER_STATUS = {
  ACTIVE: 'ACTIVE',
} as const;

const SUPER_ADMIN_PROFILE_STATUS = {
  ACTIVE: 'ACTIVE',
} as const;

const SUPER_ADMIN_ACCESS_LEVEL = {
  FULL: 'FULL',
} as const;

const SUPER_ADMIN_ROLE_CODE = 'SUPER_ADMIN';

async function bootstrap(): Promise<void> {
  const email = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SUPER_ADMIN_PASSWORD;
  const phone = process.env.SUPER_ADMIN_PHONE?.trim() || undefined;

  const firstName = process.env.SUPER_ADMIN_FIRST_NAME ?? 'Super';
  const lastName = process.env.SUPER_ADMIN_LAST_NAME ?? 'Admin';

  if (!email) {
    throw new Error('SUPER_ADMIN_EMAIL is required.');
  }

  if (!password) {
    throw new Error('SUPER_ADMIN_PASSWORD is required.');
  }

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const em = app.get(EntityManager).fork();
    const passwordService = app.get(PasswordService, { strict: false });

    const passwordHash = await passwordService.hashPassword(password);

    await em.transactional(async (tx) => {
      const user = await createOrUpdateSuperAdminUser(tx, {
        email,
        phone,
        passwordHash,
      });

      await createOrUpdateSuperAdminProfile(tx, {
        user,
        firstName,
        lastName,
        phone,
      });

      await assignSuperAdminRoleToUser(tx, user);

      await tx.flush();
    });

    console.log('Super admin setup completed successfully.');
  } finally {
    await app.close();
  }
}

async function createOrUpdateSuperAdminUser(
  tx: EntityManager,
  data: {
    email: string;
    phone?: string;
    passwordHash: string;
  },
): Promise<User> {
  const userRepository = tx.getRepository(User);

  let user = await userRepository.findOne({
    email: data.email,
    deletedAt: null,
  });

  if (user) {
    user.passwordHash = data.passwordHash;
    user.status = USER_STATUS.ACTIVE;
    user.updatedAt = new Date();

    if (data.phone) {
      user.phone = data.phone;
    }

    console.log(`Updated existing user: ${data.email}`);

    return user;
  }

  user = tx.create(User, {
    id: randomUUID(),
    email: data.email,
    phone: data.phone,
    passwordHash: data.passwordHash,
    status: USER_STATUS.ACTIVE,
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  });

  tx.persist(user);

  console.log(`Created user: ${data.email}`);

  return user;
}

async function createOrUpdateSuperAdminProfile(
  tx: EntityManager,
  data: {
    user: User;
    firstName: string;
    lastName: string;
    phone?: string;
  },
): Promise<SuperAdminProfile> {
  const superAdminProfileRepository = tx.getRepository(SuperAdminProfile);

  let superAdminProfile = await superAdminProfileRepository.findOne({
    user: data.user,
    deletedAt: null,
  });

  if (superAdminProfile) {
    superAdminProfile.firstName = data.firstName;
    superAdminProfile.lastName = data.lastName;
    superAdminProfile.phone = data.phone;
    superAdminProfile.accessLevel = SUPER_ADMIN_ACCESS_LEVEL.FULL;
    superAdminProfile.status = SUPER_ADMIN_PROFILE_STATUS.ACTIVE;
    superAdminProfile.updatedAt = new Date();

    console.log(`Updated super admin profile: ${data.user.email}`);

    return superAdminProfile;
  }

  superAdminProfile = tx.create(SuperAdminProfile, {
    id: randomUUID(),
    user: data.user,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    photoUrl: null,
    accessLevel: SUPER_ADMIN_ACCESS_LEVEL.FULL,
    status: SUPER_ADMIN_PROFILE_STATUS.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  });

  tx.persist(superAdminProfile);

  console.log(`Created super admin profile: ${data.user.email}`);

  return superAdminProfile;
}

async function assignSuperAdminRoleToUser(
  tx: EntityManager,
  user: User,
): Promise<void> {
  const roleRepository = tx.getRepository(Role);
  const userRoleAssignmentRepository = tx.getRepository(UserRoleAssignment);

  const superAdminRole = await roleRepository.findOne({
    code: SUPER_ADMIN_ROLE_CODE,
    school: null,
    branch: null,
    deletedAt: null,
  });

  if (!superAdminRole) {
    throw new Error(
      'SUPER_ADMIN role not found. Run permissions:sync and seed:roles before super-admin:create.',
    );
  }

  /**
   * Do not filter by deletedAt here.
   * If an old assignment was soft-deleted, we restore it instead of creating
   * a duplicate that may violate a unique constraint.
   */
  let existingAssignment = await userRoleAssignmentRepository.findOne({
    user,
    role: superAdminRole,
    school: null,
    branch: null,
  });

  if (existingAssignment) {
    existingAssignment.status = USER_STATUS.ACTIVE;
    existingAssignment.deletedAt = undefined;
    existingAssignment.updatedAt = new Date();

    console.log(`SUPER_ADMIN role already assigned/restored: ${user.email}`);

    return;
  }

  existingAssignment = tx.create(UserRoleAssignment, {
    id: randomUUID(),
    user,
    role: superAdminRole,

    // Platform-level role, not school/branch-specific
    school: null,
    branch: null,

    status: USER_STATUS.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  });

  tx.persist(existingAssignment);

  console.log(`Assigned SUPER_ADMIN role to: ${user.email}`);
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});