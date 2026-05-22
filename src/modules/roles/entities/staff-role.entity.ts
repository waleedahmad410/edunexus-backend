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

import { Staff } from '../../staff/entities/staff.entity';
import { Role } from './role.entity';

@Entity({ tableName: 'staff_roles' })
@Unique({ properties: ['staff', 'role'] })
export class StaffRole {
  [OptionalProps]?: 'id' | 'createdAt' | 'updatedAt' | 'deletedAt';

  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Index()
  @ManyToOne(() => Staff, { fieldName: 'staff_id' })
  staff!: Rel<Staff>;

  @Index()
  @ManyToOne(() => Role, { fieldName: 'role_id' })
  role!: Rel<Role>;

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
