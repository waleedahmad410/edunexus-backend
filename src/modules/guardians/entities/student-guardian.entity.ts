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

import { Guardian } from '../../guardians/entities/guardian.entity';
import { Student } from '../../students/entities/student.entity';

@Entity({ tableName: 'student_guardians' })
@Unique({ properties: ['student', 'guardian'] })
export class StudentGuardian {
  [OptionalProps]?:
    | 'id'
    | 'isPrimary'
    | 'canPickup'
    | 'receivesSms'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt';

  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Index()
  @ManyToOne(() => Student, { fieldName: 'student_id' })
  student!: Rel<Student>;

  @Index()
  @ManyToOne(() => Guardian, { fieldName: 'guardian_id' })
  guardian!: Rel<Guardian>;

  @Index()
  @Property({ type: 'string', length: 50 })
  relationship!: string;

  @Property({ type: 'boolean' })
  isPrimary = false;

  @Property({ type: 'boolean' })
  canPickup = false;

  @Property({ type: 'boolean' })
  receivesSms = true;

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
