import { OptionalProps } from '@mikro-orm/core';
import type { Rel } from '@mikro-orm/core';
import {
  Entity,
  Index,
  OneToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/decorators/legacy';
import { v4 as uuid } from 'uuid';

import { Staff } from '../../staff/entities/staff.entity';

@Entity({ tableName: 'teachers' })
@Unique({ properties: ['staff'] })
export class Teacher {
  [OptionalProps]?:
    | 'id'
    | 'qualification'
    | 'specialization'
    | 'teachingExperienceYears'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt';

  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Index()
  @OneToOne(() => Staff, {
    fieldName: 'staff_id',
    owner: true,
  })
  staff!: Rel<Staff>;

  @Property({ type: 'string', length: 150, nullable: true })
  qualification?: string;

  @Property({ type: 'string', length: 150, nullable: true })
  specialization?: string;

  @Property({ type: 'number', nullable: true })
  teachingExperienceYears?: number;

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
