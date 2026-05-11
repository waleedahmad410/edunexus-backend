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
import { Role } from '../../roles/entities/role.entity';

@Entity({ tableName: 'user_role_assignments' })
@Unique({ properties: ['user', 'role', 'school', 'branch'] })
export class UserRoleAssignment {
  [OptionalProps]?:
    | 'id'
    | 'school'
    | 'branch'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt';

  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Index()
  @ManyToOne(() => User, { fieldName: 'user_id' })
  user!: Rel<User>;

  @Index()
  @ManyToOne(() => Role, { fieldName: 'role_id' })
  role!: Rel<Role>;

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
