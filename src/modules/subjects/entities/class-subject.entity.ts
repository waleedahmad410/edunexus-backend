// src/modules/subjects/entities/class-subject.entity.ts

import { OptionalProps } from '@mikro-orm/core';
import type { Rel } from '@mikro-orm/core';
import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';
import { v4 as uuid } from 'uuid';

import { AcademicYear } from '../../academic-years/entities/academic-year.entity';
import { Branch } from '../../branches/entities/branch.entity';
import { SchoolClass } from '../../classes/entities/class.entity';
import { School } from '../../schools/entities/school.entity';
import { Subject } from './subject.entity';

@Entity({ tableName: 'class_subjects' })
export class ClassSubject {
  [OptionalProps]?:
    | 'id'
    | 'isCompulsory'
    | 'sortOrder'
    | 'createdAt'
    | 'updatedAt';

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
  @ManyToOne(() => SchoolClass, { fieldName: 'class_id' })
  schoolClass!: Rel<SchoolClass>;

  @Index()
  @ManyToOne(() => Subject, { fieldName: 'subject_id' })
  subject!: Rel<Subject>;

  @Property({ type: 'boolean', default: true })
  isCompulsory = true;

  @Property({ type: 'integer', default: 0 })
  sortOrder = 0;

  @Property({ type: 'Date', onCreate: () => new Date() })
  createdAt = new Date();

  @Property({
    type: 'Date',
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
  })
  updatedAt = new Date();
}
