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

import { Branch } from '../../branches/entities/branch.entity';
import { School } from '../../schools/entities/school.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ tableName: 'students' })
@Unique({ properties: ['user'] })
@Unique({ properties: ['school', 'branch', 'admissionNumber'] })
export class Student {
  [OptionalProps]?:
    | 'id'
    | 'middleName'
    | 'photoUrl'
    | 'bloodGroup'
    | 'medicalNotes'
    | 'address'
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
  @ManyToOne(() => User, { fieldName: 'user_id' })
  user!: Rel<User>;

  @Index()
  @Property({ type: 'string', length: 50 })
  admissionNumber!: string;

  @Property({ type: 'string', length: 100 })
  firstName!: string;

  @Property({ type: 'string', length: 100, nullable: true })
  middleName?: string;

  @Property({ type: 'string', length: 100 })
  lastName!: string;

  @Index()
  @Property({ type: 'string', length: 20 })
  gender!: string;

  @Property({ type: 'Date' })
  dateOfBirth!: Date;

  @Property({ type: 'string', length: 500, nullable: true })
  photoUrl?: string;

  @Property({ type: 'string', length: 10, nullable: true })
  bloodGroup?: string;

  @Property({ type: 'text', nullable: true })
  medicalNotes?: string;

  @Property({ type: 'text', nullable: true })
  address?: string;

  @Property({ type: 'Date' })
  admissionDate!: Date;

  @Index()
  @Property({ type: 'string', length: 30 })
  status!: string;
}
