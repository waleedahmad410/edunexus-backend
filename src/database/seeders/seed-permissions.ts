import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { randomUUID } from 'node:crypto';

import { AppModule } from '../../app.module';
import { Permission } from '../../modules/roles/entities/permission.entity';

type PermissionSeed = {
  module: string;
  action: string;
  code: string;
  description: string;
};

const PERMISSIONS: PermissionSeed[] = [
  // Schools
  {
    module: 'schools',
    action: 'create',
    code: 'schools.create',
    description: 'Create schools',
  },
  {
    module: 'schools',
    action: 'read',
    code: 'schools.read',
    description: 'View schools',
  },
  {
    module: 'schools',
    action: 'update',
    code: 'schools.update',
    description: 'Update schools',
  },
  {
    module: 'schools',
    action: 'delete',
    code: 'schools.delete',
    description: 'Delete schools',
  },

  // School Settings
  {
    module: 'school_settings',
    action: 'read',
    code: 'school_settings.read',
    description: 'View school settings',
  },
  {
    module: 'school_settings',
    action: 'update',
    code: 'school_settings.update',
    description: 'Update school settings',
  },

  // Branches
  {
    module: 'branches',
    action: 'create',
    code: 'branches.create',
    description: 'Create branches',
  },
  {
    module: 'branches',
    action: 'read',
    code: 'branches.read',
    description: 'View branches',
  },
  {
    module: 'branches',
    action: 'update',
    code: 'branches.update',
    description: 'Update branches',
  },
  {
    module: 'branches',
    action: 'delete',
    code: 'branches.delete',
    description: 'Delete branches',
  },

  // Academic Years
  {
    module: 'academic_years',
    action: 'create',
    code: 'academic_years.create',
    description: 'Create academic years',
  },
  {
    module: 'academic_years',
    action: 'read',
    code: 'academic_years.read',
    description: 'View academic years',
  },
  {
    module: 'academic_years',
    action: 'update',
    code: 'academic_years.update',
    description: 'Update academic years',
  },
  {
    module: 'academic_years',
    action: 'delete',
    code: 'academic_years.delete',
    description: 'Delete academic years',
  },

  // Terms
  {
    module: 'terms',
    action: 'create',
    code: 'terms.create',
    description: 'Create academic terms',
  },
  {
    module: 'terms',
    action: 'read',
    code: 'terms.read',
    description: 'View academic terms',
  },
  {
    module: 'terms',
    action: 'update',
    code: 'terms.update',
    description: 'Update academic terms',
  },
  {
    module: 'terms',
    action: 'delete',
    code: 'terms.delete',
    description: 'Delete academic terms',
  },

  // Staff
  {
    module: 'staff',
    action: 'create',
    code: 'staff.create',
    description: 'Create staff members',
  },
  {
    module: 'staff',
    action: 'read',
    code: 'staff.read',
    description: 'View staff members',
  },
  {
    module: 'staff',
    action: 'update',
    code: 'staff.update',
    description: 'Update staff members',
  },
  {
    module: 'staff',
    action: 'delete',
    code: 'staff.delete',
    description: 'Delete staff members',
  },

  // Teacher Profiles
  {
    module: 'teacher_profiles',
    action: 'create',
    code: 'teacher_profiles.create',
    description: 'Create teacher profiles',
  },
  {
    module: 'teacher_profiles',
    action: 'read',
    code: 'teacher_profiles.read',
    description: 'View teacher profiles',
  },
  {
    module: 'teacher_profiles',
    action: 'update',
    code: 'teacher_profiles.update',
    description: 'Update teacher profiles',
  },
  {
    module: 'teacher_profiles',
    action: 'delete',
    code: 'teacher_profiles.delete',
    description: 'Delete teacher profiles',
  },

  // Roles
  {
    module: 'roles',
    action: 'create',
    code: 'roles.create',
    description: 'Create roles',
  },
  {
    module: 'roles',
    action: 'read',
    code: 'roles.read',
    description: 'View roles',
  },
  {
    module: 'roles',
    action: 'update',
    code: 'roles.update',
    description: 'Update roles',
  },
  {
    module: 'roles',
    action: 'delete',
    code: 'roles.delete',
    description: 'Delete roles',
  },

  // Permissions
  {
    module: 'permissions',
    action: 'read',
    code: 'permissions.read',
    description: 'View permissions',
  },
  {
    module: 'permissions',
    action: 'assign',
    code: 'permissions.assign',
    description: 'Assign permissions to roles',
  },
  {
    module: 'permissions',
    action: 'revoke',
    code: 'permissions.revoke',
    description: 'Revoke permissions from roles',
  },

  // Staff Roles
  {
    module: 'staff_roles',
    action: 'assign',
    code: 'staff_roles.assign',
    description: 'Assign roles to staff',
  },
  {
    module: 'staff_roles',
    action: 'revoke',
    code: 'staff_roles.revoke',
    description: 'Revoke roles from staff',
  },
  {
    module: 'staff_roles',
    action: 'read',
    code: 'staff_roles.read',
    description: 'View staff roles',
  },

  // Users
  {
    module: 'users',
    action: 'create',
    code: 'users.create',
    description: 'Create users',
  },
  {
    module: 'users',
    action: 'read',
    code: 'users.read',
    description: 'View users',
  },
  {
    module: 'users',
    action: 'update',
    code: 'users.update',
    description: 'Update users',
  },
  {
    module: 'users',
    action: 'delete',
    code: 'users.delete',
    description: 'Delete users',
  },

  // Students
  {
    module: 'students',
    action: 'create',
    code: 'students.create',
    description: 'Create students',
  },
  {
    module: 'students',
    action: 'read',
    code: 'students.read',
    description: 'View students',
  },
  {
    module: 'students',
    action: 'update',
    code: 'students.update',
    description: 'Update students',
  },
  {
    module: 'students',
    action: 'delete',
    code: 'students.delete',
    description: 'Delete students',
  },

  // Guardians
  {
    module: 'guardians',
    action: 'create',
    code: 'guardians.create',
    description: 'Create guardians',
  },
  {
    module: 'guardians',
    action: 'read',
    code: 'guardians.read',
    description: 'View guardians',
  },
  {
    module: 'guardians',
    action: 'update',
    code: 'guardians.update',
    description: 'Update guardians',
  },
  {
    module: 'guardians',
    action: 'delete',
    code: 'guardians.delete',
    description: 'Delete guardians',
  },

  // Student Guardians
  {
    module: 'student_guardians',
    action: 'create',
    code: 'student_guardians.create',
    description: 'Link students with guardians',
  },
  {
    module: 'student_guardians',
    action: 'read',
    code: 'student_guardians.read',
    description: 'View student guardian links',
  },
  {
    module: 'student_guardians',
    action: 'update',
    code: 'student_guardians.update',
    description: 'Update student guardian links',
  },
  {
    module: 'student_guardians',
    action: 'delete',
    code: 'student_guardians.delete',
    description: 'Remove student guardian links',
  },

  // Admissions
  {
    module: 'admissions',
    action: 'create',
    code: 'admissions.create',
    description: 'Create admissions',
  },
  {
    module: 'admissions',
    action: 'read',
    code: 'admissions.read',
    description: 'View admissions',
  },
  {
    module: 'admissions',
    action: 'update',
    code: 'admissions.update',
    description: 'Update admissions',
  },
  {
    module: 'admissions',
    action: 'delete',
    code: 'admissions.delete',
    description: 'Delete admissions',
  },
  {
    module: 'admissions',
    action: 'approve',
    code: 'admissions.approve',
    description: 'Approve admissions',
  },
  {
    module: 'admissions',
    action: 'reject',
    code: 'admissions.reject',
    description: 'Reject admissions',
  },

  // Classes
  {
    module: 'classes',
    action: 'create',
    code: 'classes.create',
    description: 'Create classes',
  },
  {
    module: 'classes',
    action: 'read',
    code: 'classes.read',
    description: 'View classes',
  },
  {
    module: 'classes',
    action: 'update',
    code: 'classes.update',
    description: 'Update classes',
  },
  {
    module: 'classes',
    action: 'delete',
    code: 'classes.delete',
    description: 'Delete classes',
  },

  // Sections
  {
    module: 'sections',
    action: 'create',
    code: 'sections.create',
    description: 'Create sections',
  },
  {
    module: 'sections',
    action: 'read',
    code: 'sections.read',
    description: 'View sections',
  },
  {
    module: 'sections',
    action: 'update',
    code: 'sections.update',
    description: 'Update sections',
  },
  {
    module: 'sections',
    action: 'delete',
    code: 'sections.delete',
    description: 'Delete sections',
  },

  // Subjects
  {
    module: 'subjects',
    action: 'create',
    code: 'subjects.create',
    description: 'Create subjects',
  },
  {
    module: 'subjects',
    action: 'read',
    code: 'subjects.read',
    description: 'View subjects',
  },
  {
    module: 'subjects',
    action: 'update',
    code: 'subjects.update',
    description: 'Update subjects',
  },
  {
    module: 'subjects',
    action: 'delete',
    code: 'subjects.delete',
    description: 'Delete subjects',
  },

  // Teacher Assignments
  {
    module: 'teacher_assignments',
    action: 'create',
    code: 'teacher_assignments.create',
    description: 'Create teacher assignments',
  },
  {
    module: 'teacher_assignments',
    action: 'read',
    code: 'teacher_assignments.read',
    description: 'View teacher assignments',
  },
  {
    module: 'teacher_assignments',
    action: 'update',
    code: 'teacher_assignments.update',
    description: 'Update teacher assignments',
  },
  {
    module: 'teacher_assignments',
    action: 'delete',
    code: 'teacher_assignments.delete',
    description: 'Delete teacher assignments',
  },

  // Attendance
  {
    module: 'attendance',
    action: 'create',
    code: 'attendance.create',
    description: 'Create attendance records',
  },
  {
    module: 'attendance',
    action: 'read',
    code: 'attendance.read',
    description: 'View attendance records',
  },
  {
    module: 'attendance',
    action: 'update',
    code: 'attendance.update',
    description: 'Update attendance records',
  },
  {
    module: 'attendance',
    action: 'delete',
    code: 'attendance.delete',
    description: 'Delete attendance records',
  },

  // Exams
  {
    module: 'exams',
    action: 'create',
    code: 'exams.create',
    description: 'Create exams',
  },
  {
    module: 'exams',
    action: 'read',
    code: 'exams.read',
    description: 'View exams',
  },
  {
    module: 'exams',
    action: 'update',
    code: 'exams.update',
    description: 'Update exams',
  },
  {
    module: 'exams',
    action: 'delete',
    code: 'exams.delete',
    description: 'Delete exams',
  },

  // Marks
  {
    module: 'marks',
    action: 'create',
    code: 'marks.create',
    description: 'Create marks',
  },
  {
    module: 'marks',
    action: 'read',
    code: 'marks.read',
    description: 'View marks',
  },
  {
    module: 'marks',
    action: 'update',
    code: 'marks.update',
    description: 'Update marks',
  },
  {
    module: 'marks',
    action: 'delete',
    code: 'marks.delete',
    description: 'Delete marks',
  },

  // Fees
  {
    module: 'fees',
    action: 'create',
    code: 'fees.create',
    description: 'Create fee records',
  },
  {
    module: 'fees',
    action: 'read',
    code: 'fees.read',
    description: 'View fee records',
  },
  {
    module: 'fees',
    action: 'update',
    code: 'fees.update',
    description: 'Update fee records',
  },
  {
    module: 'fees',
    action: 'delete',
    code: 'fees.delete',
    description: 'Delete fee records',
  },

  // Invoices
  {
    module: 'invoices',
    action: 'create',
    code: 'invoices.create',
    description: 'Create invoices',
  },
  {
    module: 'invoices',
    action: 'read',
    code: 'invoices.read',
    description: 'View invoices',
  },
  {
    module: 'invoices',
    action: 'update',
    code: 'invoices.update',
    description: 'Update invoices',
  },
  {
    module: 'invoices',
    action: 'delete',
    code: 'invoices.delete',
    description: 'Delete invoices',
  },

  // Payments
  {
    module: 'payments',
    action: 'create',
    code: 'payments.create',
    description: 'Create payments',
  },
  {
    module: 'payments',
    action: 'read',
    code: 'payments.read',
    description: 'View payments',
  },
  {
    module: 'payments',
    action: 'update',
    code: 'payments.update',
    description: 'Update payments',
  },
  {
    module: 'payments',
    action: 'delete',
    code: 'payments.delete',
    description: 'Delete payments',
  },

  // Reports
  {
    module: 'reports',
    action: 'read',
    code: 'reports.read',
    description: 'View reports',
  },
  {
    module: 'reports',
    action: 'export',
    code: 'reports.export',
    description: 'Export reports',
  },
];

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const em = app.get(EntityManager).fork();

    await em.transactional(async (tx) => {
      const permissionRepository = tx.getRepository(Permission);

      let createdCount = 0;
      let updatedCount = 0;

      for (const item of PERMISSIONS) {
        const existingPermission = await permissionRepository.findOne({
          code: item.code,
        });

        if (existingPermission) {
          existingPermission.module = item.module;
          existingPermission.action = item.action;
          existingPermission.description = item.description;
          existingPermission.status = 'ACTIVE';
          existingPermission.updatedAt = new Date();

          updatedCount += 1;
          continue;
        }

        const permission = tx.create(Permission, {
          id: randomUUID(),
          module: item.module,
          action: item.action,
          code: item.code,
          description: item.description,
          status: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        });

        tx.persist(permission);

        createdCount += 1;
      }

      await tx.flush();

      console.log(`Created permissions: ${createdCount}`);
      console.log(`Updated permissions: ${updatedCount}`);
    });

    console.log('Permission seeding completed successfully.');
  } finally {
    await app.close();
  }
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
