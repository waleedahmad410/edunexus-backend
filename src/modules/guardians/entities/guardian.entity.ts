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

@Entity({ tableName: 'guardians' })
export class Guardian {
  [OptionalProps]?:
    | 'id'
    | 'user'
    | 'middleName'
    | 'email'
    | 'occupation'
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
  @ManyToOne(() => User, {
    fieldName: 'user_id',
    nullable: true,
  })
  user?: Rel<User>;

  @Property({ type: 'string', length: 100 })
  firstName!: string;

  @Property({ type: 'string', length: 100, nullable: true })
  middleName?: string;

  @Property({ type: 'string', length: 100 })
  lastName!: string;

  @Index()
  @Property({ type: 'string', length: 20 })
  phone!: string;

  @Index()
  @Property({ type: 'string', length: 150, nullable: true })
  email?: string;

  @Property({ type: 'string', length: 100, nullable: true })
  occupation?: string;

  @Property({ type: 'text', nullable: true })
  address?: string;

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
