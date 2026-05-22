// src/modules/users/entities/user-profile.entity.ts
//Deprecated ..Not used
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

import { User } from './user.entity';

@Entity({ tableName: 'user_profiles' })
export class UserProfile {
  [OptionalProps]?: 'id' | 'createdAt' | 'updatedAt';

  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Index()
  @ManyToOne(() => User, { fieldName: 'user_id' })
  user!: Rel<User>;

  @Property({ type: 'string', length: 80 })
  firstName!: string;

  @Property({ type: 'string', length: 80, nullable: true })
  middleName?: string;

  @Property({ type: 'string', length: 80 })
  lastName!: string;

  @Property({ type: 'string', length: 20, nullable: true })
  gender?: string;

  @Property({ type: 'Date', nullable: true })
  dateOfBirth?: Date;

  @Property({ type: 'string', length: 500, nullable: true })
  photoUrl?: string;

  @Property({ type: 'string', length: 100, nullable: true })
  nationalId?: string;

  @Property({ type: 'text', nullable: true })
  address?: string;

  @Property({ type: 'string', length: 100, nullable: true })
  city?: string;

  @Property({ type: 'string', length: 100, nullable: true })
  state?: string;

  @Property({ type: 'string', length: 100, nullable: true })
  country?: string;

  @Property({ type: 'string', length: 20, nullable: true })
  postalCode?: string;

  @Property({ type: 'Date', onCreate: () => new Date() })
  createdAt = new Date();

  @Property({
    type: 'Date',
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
  })
  updatedAt = new Date();
}
