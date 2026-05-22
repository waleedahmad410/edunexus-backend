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

import { Branch } from '../../branches/entities/branch.entity';
import { School } from '../../schools/entities/school.entity';

@Entity({ tableName: 'roles' })
export class Role {
  [OptionalProps]?:
    | 'id'
    | 'school'
    | 'branch'
    | 'description'
    | 'isSystemRole'
    | 'isTemplate'
    | 'isDefaultRole'
    | 'status'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt';

  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Index()
  @ManyToOne(() => School, {
    fieldName: 'school_id',
    nullable: true,
  })
  school?: Rel<School> | null;

  @Index()
  @ManyToOne(() => Branch, {
    fieldName: 'branch_id',
    nullable: true,
  })
  branch?: Rel<Branch> | null;

  @Index()
  @Property({ type: 'string', length: 100 })
  name!: string;

  @Index()
  @Property({ type: 'string', length: 100 })
  code!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property({ type: 'boolean', default: false })
  isSystemRole = false;

  @Property({ type: 'boolean', default: false })
  isTemplate = false;

  @Property({ type: 'boolean', default: false })
  isDefaultRole = false;

  @Index()
  @Property({ type: 'string', length: 30, default: 'ACTIVE' })
  status = 'ACTIVE';

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
