import { OptionalProps } from '@mikro-orm/core';
import type { Rel } from '@mikro-orm/core';
import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/decorators/legacy';
import { v4 as uuid } from 'uuid';

import { AcademicYear } from '../../academic-years/entities/academic-year.entity';
import { Branch } from '../../branches/entities/branch.entity';
import { SchoolClass } from '../../classes/entities/class.entity';
import { School } from '../../schools/entities/school.entity';
import { Section } from '../../sections/entities/section.entity';
import { Student } from '../../students/entities/student.entity';

@Entity({ tableName: 'student_enrollments' })
@Unique({ properties: ['student', 'academicYear'] })
@Unique({
  properties: [
    'school',
    'branch',
    'academicYear',
    'schoolClass',
    'section',
    'rollNumber',
  ],
})
export class StudentEnrollment {
  [OptionalProps]?:
    | 'id'
    | 'rollNumber'
    | 'endDate'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt';

  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Index()
  @ManyToOne(() => School, { fieldName: 'school_id' })
  school!: Rel<School>;

  @Index()
  @ManyToOne(() => Branch, { fieldName: 'branch_id' })
  branch!: Rel<Branch>;

  @Index()
  @ManyToOne(() => Student, { fieldName: 'student_id' })
  student!: Rel<Student>;

  @Index()
  @ManyToOne(() => AcademicYear, { fieldName: 'academic_year_id' })
  academicYear!: Rel<AcademicYear>;

  @Index()
  @ManyToOne(() => SchoolClass, { fieldName: 'class_id' })
  schoolClass!: Rel<SchoolClass>;

  @Index()
  @ManyToOne(() => Section, { fieldName: 'section_id' })
  section!: Rel<Section>;

  @Index()
  @Property({ type: 'string', length: 30, nullable: true })
  rollNumber?: string;

  @Index()
  @Property({ type: 'string', length: 30 })
  enrollmentStatus!: string;

  @Property({ type: 'Date' })
  startDate!: Date;

  @Property({ type: 'Date', nullable: true })
  endDate?: Date;

  @Property({ type: 'Date', onCreate: () => new Date() })
  createdAt = new Date();
}
