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

import { User } from '../../users/entities/user.entity';

@Entity({ tableName: 'super_admin_profiles' })
@Unique({ properties: ['user'] })
export class SuperAdminProfile {
  [OptionalProps]?:
    | 'id'
    | 'phone'
    | 'photoUrl'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt';

  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Index()
  @ManyToOne(() => User, { fieldName: 'user_id' })
  user!: Rel<User>;

  @Property({ type: 'string', length: 100 })
  firstName!: string;

  @Property({ type: 'string', length: 100 })
  lastName!: string;

  @Property({ type: 'string', length: 20, nullable: true })
  phone?: string;

  @Property({ type: 'string', length: 500, nullable: true })
  photoUrl?: string;

  @Index()
  @Property({ type: 'string', length: 50 })
  accessLevel!: string;

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
