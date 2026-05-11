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
import { User } from '../../users/entities/user.entity';

@Entity({ tableName: 'audit_logs' })
export class AuditLog {
  [OptionalProps]?:
    | 'id'
    | 'school'
    | 'branch'
    | 'user'
    | 'entityId'
    | 'oldValues'
    | 'newValues'
    | 'ipAddress'
    | 'userAgent'
    | 'createdAt';

  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Index()
  @ManyToOne(() => School, {
    fieldName: 'school_id',
    nullable: true,
  })
  school?: Rel<School>;

  @Index()
  @ManyToOne(() => Branch, {
    fieldName: 'branch_id',
    nullable: true,
  })
  branch?: Rel<Branch>;

  @Index()
  @ManyToOne(() => User, {
    fieldName: 'user_id',
    nullable: true,
  })
  user?: Rel<User>;

  @Index()
  @Property({ type: 'string', length: 100 })
  action!: string;

  @Index()
  @Property({ type: 'string', length: 100 })
  entityName!: string;

  @Index()
  @Property({ type: 'uuid', nullable: true })
  entityId?: string;

  @Property({ type: 'json', nullable: true })
  oldValues?: Record<string, unknown>;

  @Property({ type: 'json', nullable: true })
  newValues?: Record<string, unknown>;

  @Property({ type: 'string', length: 100, nullable: true })
  ipAddress?: string;

  @Property({ type: 'text', nullable: true })
  userAgent?: string;

  @Index()
  @Property({ type: 'Date', onCreate: () => new Date() })
  createdAt = new Date();
}
