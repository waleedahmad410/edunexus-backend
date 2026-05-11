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
import { Subject } from '../../subjects/entities/subject.entity';
import { Teacher } from '../../teachers/entities/teacher.entity';

@Entity({ tableName: 'teacher_subjects' })
@Unique({
  properties: ['academicYear', 'teacher', 'subject', 'schoolClass', 'section'],
})
export class TeacherSubject {
  [OptionalProps]?: 'id' | 'createdAt' | 'updatedAt' | 'deletedAt';

  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Index()
  @ManyToOne(() => School, { fieldName: 'school_id' })
  school!: Rel<School>;

  @Index()
  @ManyToOne(() => Branch, { fieldName: 'branch_id' })
  branch!: Rel<Branch>;

  @Index()
  @ManyToOne(() => AcademicYear, { fieldName: 'academic_year_id' })
  academicYear!: Rel<AcademicYear>;

  @Index()
  @ManyToOne(() => Teacher, { fieldName: 'teacher_id' })
  teacher!: Rel<Teacher>;

  @Index()
  @ManyToOne(() => Subject, { fieldName: 'subject_id' })
  subject!: Rel<Subject>;

  @Index()
  @ManyToOne(() => SchoolClass, { fieldName: 'class_id' })
  schoolClass!: Rel<SchoolClass>;

  @Index()
  @ManyToOne(() => Section, { fieldName: 'section_id' })
  section!: Rel<Section>;

  @Index()
  @Property({ type: 'string', length: 30 })
  status!: string;

  @Property({ type: 'Date', onCreate: () => new Date() })
  createdAt = new Date();

  @Property({
    type: 'Date',
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
  })
  updatedAt = new Date();

  @Property({ type: 'Date', nullable: true })
  deletedAt?: Date;
}
