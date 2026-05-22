import 'dotenv/config';

import { EntityManager } from '@mikro-orm/postgresql';
import { NestFactory } from '@nestjs/core';
import { randomUUID } from 'node:crypto';

import { AppModule } from '../../app.module';

import { Permission } from '../../modules/roles/entities/permission.entity';
import { RolePermission } from '../../modules/roles/entities/role-permission.entity';
import { Role } from '../../modules/roles/entities/role.entity';

const ROLE_STATUS = {
  ACTIVE: 'ACTIVE',
} as const;

const SYSTEM_ROLES = {
  SUPER_ADMIN: {
    name: 'Super Admin',
    code: 'SUPER_ADMIN',
    description: 'Platform-level administrator with full ERP access.',
    isTemplate: false,
  },
  SCHOOL_OWNER: {
    name: 'School Owner',
    code: 'SCHOOL_OWNER',
    description: 'Template role copied to each school during onboarding.',
    isTemplate: true,
  },
} as const;

type SystemRoleSeed = {
  name: string;
  code: string;
  description: string;
  isTemplate: boolean;
};

async function findOrCreateSystemRole(
  tx: EntityManager,
  data: SystemRoleSeed,
): Promise<Role> {
  const roleRepository = tx.getRepository(Role);

  let role = await roleRepository.findOne({
    code: data.code,
    school: null,
    branch: null,
  });

  if (!role) {
    role = tx.create(Role, {
      id: randomUUID(),
      name: data.name,
      code: data.code,
      description: data.description,
      school: null,
      branch: null,
      isSystemRole: true,
      isTemplate: data.isTemplate,
      status: ROLE_STATUS.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    tx.persist(role);

    return role;
  }

  role.name = data.name;
  role.description = data.description;
  role.isSystemRole = true;
  role.isTemplate = data.isTemplate;
  role.status = ROLE_STATUS.ACTIVE;
  role.updatedAt = new Date();
  role.deletedAt = undefined;

  return role;
}

async function getPermissionsByCodes(
  tx: EntityManager,
  permissionCodes: readonly string[],
): Promise<Permission[]> {
  const permissionRepository = tx.getRepository(Permission);

  const uniquePermissionCodes = [...new Set(permissionCodes)];

  const permissions = await permissionRepository.find({
    code: {
      $in: uniquePermissionCodes,
    },
    deletedAt: null,
  });

  const foundPermissionCodes = new Set(
    permissions.map((permission) => permission.code),
  );

  const missingPermissionCodes = uniquePermissionCodes.filter(
    (code) => !foundPermissionCodes.has(code),
  );

  if (missingPermissionCodes.length > 0) {
    throw new Error(
      `Missing permissions: ${missingPermissionCodes.join(', ')}`,
    );
  }

  return permissions;
}

async function syncRolePermissions(
  tx: EntityManager,
  role: Role,
  targetPermissions: Permission[],
): Promise<void> {
  const rolePermissionRepository = tx.getRepository(RolePermission);

  const existingRolePermissions = await rolePermissionRepository.find(
    {
      role,
    },
    {
      populate: ['permission'],
    },
  );

  const targetPermissionIds = new Set(
    targetPermissions.map((permission) => permission.id),
  );

  const existingByPermissionId = new Map(
    existingRolePermissions.map((rolePermission) => [
      rolePermission.permission.id,
      rolePermission,
    ]),
  );

  for (const permission of targetPermissions) {
    const existingRolePermission = existingByPermissionId.get(permission.id);

    if (existingRolePermission) {
      existingRolePermission.deletedAt = undefined;
      existingRolePermission.updatedAt = new Date();
      continue;
    }

    const rolePermission = tx.create(RolePermission, {
      id: randomUUID(),
      role,
      permission,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    tx.persist(rolePermission);
  }

  for (const existingRolePermission of existingRolePermissions) {
    const permissionId = existingRolePermission.permission.id;

    if (
      !targetPermissionIds.has(permissionId) &&
      !existingRolePermission.deletedAt
    ) {
      existingRolePermission.deletedAt = new Date();
      existingRolePermission.updatedAt = new Date();
    }
  }
}

async function seedSystemRolePermissions(
  tx: EntityManager,
  superAdminRole: Role,
  schoolOwnerTemplateRole: Role,
): Promise<void> {
  const permissionRepository = tx.getRepository(Permission);

  const allPermissions = await permissionRepository.find({
    deletedAt: null,
  });

  if (allPermissions.length === 0) {
    throw new Error(
      'No permissions found. Run permission seeder before role seeder.',
    );
  }

  const schoolOwnerPermissions = await getPermissionsByCodes(
    tx,
    getSchoolOwnerPermissionCodes(),
  );

  await syncRolePermissions(tx, superAdminRole, allPermissions);

  await syncRolePermissions(
    tx,
    schoolOwnerTemplateRole,
    schoolOwnerPermissions,
  );
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const em = app.get(EntityManager).fork();

    await em.transactional(async (tx) => {
      const superAdminRole = await findOrCreateSystemRole(
        tx,
        SYSTEM_ROLES.SUPER_ADMIN,
      );

      const schoolOwnerTemplateRole = await findOrCreateSystemRole(
        tx,
        SYSTEM_ROLES.SCHOOL_OWNER,
      );

      await seedSystemRolePermissions(
        tx,
        superAdminRole,
        schoolOwnerTemplateRole,
      );

      await tx.flush();

      console.log('System roles seeded successfully.');
      console.log(`Seeded role: ${SYSTEM_ROLES.SUPER_ADMIN.code}`);
      console.log(`Seeded role template: ${SYSTEM_ROLES.SCHOOL_OWNER.code}`);
    });
  } finally {
    await app.close();
  }
}

function getSchoolOwnerPermissionCodes(): readonly string[] {
  return [
    // School
    'schools.read',
    'schools.update',

    // School settings
    'school_settings.read',
    'school_settings.update',

    // Branches
    'branches.create',
    'branches.read',
    'branches.update',
    'branches.delete',

    // Academic years
    'academic_years.create',
    'academic_years.read',
    'academic_years.update',
    'academic_years.delete',

    // Terms
    'terms.create',
    'terms.read',
    'terms.update',
    'terms.delete',

    // Roles
    'roles.create',
    'roles.read',
    'roles.update',
    'roles.delete',

    // Permissions
    'permissions.read',
    'permissions.assign',
    'permissions.revoke',

    // Staff roles
    'staff_roles.assign',
    'staff_roles.revoke',
    'staff_roles.read',

    // Users
    'users.create',
    'users.read',
    'users.update',
    'users.delete',

    // Staff
    'staff.create',
    'staff.read',
    'staff.update',
    'staff.delete',

    // Teacher profiles
    'teacher_profiles.create',
    'teacher_profiles.read',
    'teacher_profiles.update',
    'teacher_profiles.delete',

    // Students
    'students.create',
    'students.read',
    'students.update',
    'students.delete',

    // Guardians
    'guardians.create',
    'guardians.read',
    'guardians.update',
    'guardians.delete',

    // Student guardians
    'student_guardians.create',
    'student_guardians.read',
    'student_guardians.update',
    'student_guardians.delete',

    // Admissions
    'admissions.create',
    'admissions.read',
    'admissions.update',
    'admissions.delete',
    'admissions.approve',
    'admissions.reject',

    // Classes
    'classes.create',
    'classes.read',
    'classes.update',
    'classes.delete',

    // Sections
    'sections.create',
    'sections.read',
    'sections.update',
    'sections.delete',

    // Subjects
    'subjects.create',
    'subjects.read',
    'subjects.update',
    'subjects.delete',

    // Teacher assignments
    'teacher_assignments.create',
    'teacher_assignments.read',
    'teacher_assignments.update',
    'teacher_assignments.delete',

    // Attendance
    'attendance.create',
    'attendance.read',
    'attendance.update',
    'attendance.delete',

    // Exams
    'exams.create',
    'exams.read',
    'exams.update',
    'exams.delete',

    // Marks
    'marks.create',
    'marks.read',
    'marks.update',
    'marks.delete',

    // Fees
    'fees.create',
    'fees.read',
    'fees.update',
    'fees.delete',

    // Invoices
    'invoices.create',
    'invoices.read',
    'invoices.update',
    'invoices.delete',

    // Payments
    'payments.create',
    'payments.read',
    'payments.update',
    'payments.delete',

    // Reports
    'reports.read',
    'reports.export',
  ] as const;
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
