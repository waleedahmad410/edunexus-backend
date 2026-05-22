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

@Entity({ tableName: 'staff' })
@Unique({ properties: ['user'] })
@Unique({ properties: ['school', 'branch', 'employeeNumber'] })
export class Staff {
  [OptionalProps]?:
    | 'id'
    | 'branch'
    | 'middleName'
    | 'dateOfBirth'
    | 'email'
    | 'address'
    | 'photoUrl'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt';

  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Index()
  @ManyToOne(() => School, { fieldName: 'school_id' })
  school!: Rel<School>;

  @Index()
  @ManyToOne(() => Branch, {
    fieldName: 'branch_id',
    nullable: true,
  })
  branch?: Rel<Branch>;

  @Index()
  @ManyToOne(() => User, { fieldName: 'user_id' })
  user!: Rel<User>;

  @Index()
  @Property({ type: 'string', length: 50 })
  employeeNumber!: string;

  @Property({ type: 'string', length: 100 })
  firstName!: string;

  @Property({ type: 'string', length: 100, nullable: true })
  middleName?: string;

  @Property({ type: 'string', length: 100 })
  lastName!: string;

  @Index()
  @Property({ type: 'string', length: 20 })
  gender!: string;

  @Property({ type: 'Date', nullable: true })
  dateOfBirth?: Date;

  @Index()
  @Property({ type: 'string', length: 20 })
  phone!: string;
}
