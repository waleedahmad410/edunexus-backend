// src/modules/users/entities/user.entity.ts

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

@Entity({ tableName: 'users' })
export class User {
  [OptionalProps]?:
    | 'id'
    | 'isEmailVerified'
    | 'isPhoneVerified'
    | 'isActive'
    | 'lastLoginAt'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt';

  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Index()
  @ManyToOne(() => School, { fieldName: 'school_id', nullable: true })
  school?: Rel<School>;

  @Index()
  @ManyToOne(() => Branch, { fieldName: 'branch_id', nullable: true })
  branch?: Rel<Branch>;

  @Index()
  @Property({ type: 'string', length: 160 })
  email!: string;

  @Property({ type: 'string', length: 40, nullable: true })
  phone?: string;

  @Property({ type: 'string', length: 255 })
  passwordHash!: string;

  @Index()
  @Property({ type: 'string', length: 30 })
  userType!: string;

  @Property({ type: 'boolean', default: false })
  isEmailVerified = false;

  @Property({ type: 'boolean', default: false })
  isPhoneVerified = false;

  @Property({ type: 'boolean', default: true })
  isActive = true;

  @Property({ type: 'Date', nullable: true })
  lastLoginAt?: Date;

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
