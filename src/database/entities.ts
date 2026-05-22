import { AcademicYear } from '../modules/academic-years/entities/academic-year.entity';
import { Branch } from '../modules/branches/entities/branch.entity';
import { AuditLog } from '../modules/audit-logs/entities/audit-log.entity';
import { PasswordResetToken } from '../modules/auth/entities/password-reset-token.entity';
import { RefreshToken } from '../modules/auth/entities/refresh-token.entity';
import { Session } from '../modules/auth/entities/login-session.entity';
import { SchoolClass } from '../modules/classes/entities/class.entity';
import { Guardian } from '../modules/guardians/entities/guardian.entity';
import { StudentGuardian } from '../modules/guardians/entities/student-guardian.entity';
import { Permission } from '../modules/roles/entities/permission.entity';
import { RolePermission } from '../modules/roles/entities/role-permission.entity';
import { Role } from '../modules/roles/entities/role.entity';
import { StaffRole } from '../modules/roles/entities/staff-role.entity';
import { SchoolSetting } from '../modules/schools/entities/school-setting.entity';
import { School } from '../modules/schools/entities/school.entity';
import { Section } from '../modules/sections/entities/section.entity';
import { Staff } from '../modules/staff/entities/staff.entity';
import { StudentEnrollment } from '../modules/students/entities/student-enrollment.entity';
import { Student } from '../modules/students/entities/student.entity';
import { ClassSubject } from '../modules/subjects/entities/class-subject.entity';
import { Subject } from '../modules/subjects/entities/subject.entity';
import { SuperAdminProfile } from '../modules/super-admin/entities/super-admin-profile.entity';
import { TeacherSubject } from '../modules/teachers/entities/teacher-subject.entity';
import { Teacher } from '../modules/teachers/entities/teacher.entity';
import { UserProfile } from '../modules/users/entities/user-profile.entity';
import { UserRoleAssignment } from '../modules/users/entities/user-role-assignment.entity';
import { User } from '../modules/users/entities/user.entity';

export const entities = [
  AcademicYear,
  AuditLog,
  Branch,
  ClassSubject,
  Guardian,
  PasswordResetToken,
  Permission,
  RefreshToken,
  Role,
  RolePermission,
  StaffRole,
  SchoolClass,
  Session,
  School,
  SchoolSetting,
  Section,
  Staff,
  Student,
  StudentEnrollment,
  StudentGuardian,
  Subject,
  SuperAdminProfile,
  Teacher,
  TeacherSubject,
  User,
  UserProfile,
  UserRoleAssignment,
];
