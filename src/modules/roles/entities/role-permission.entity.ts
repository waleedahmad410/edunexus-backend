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

import { Permission } from '../entities/permission.entity';
import { Role } from './role.entity';

@Entity({ tableName: 'role_permissions' })
@Unique({ properties: ['role', 'permission'] })
export class RolePermission {
  [OptionalProps]?: 'id' | 'createdAt' | 'updatedAt' | 'deletedAt';

  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Index()
  @ManyToOne(() => Role, { fieldName: 'role_id' })
  role!: Rel<Role>;

  @Index()
  @ManyToOne(() => Permission, { fieldName: 'permission_id' })
  permission!: Rel<Permission>;

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
