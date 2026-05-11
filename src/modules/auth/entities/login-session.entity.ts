// src/modules/auth/entities/session.entity.ts

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

import { User } from '../../users/entities/user.entity';

@Entity({ tableName: 'sessions' })
export class Session {
  [OptionalProps]?: 'id' | 'revokedAt' | 'createdAt' | 'updatedAt';

  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Index()
  @ManyToOne(() => User, { fieldName: 'user_id' })
  user!: Rel<User>;

  @Property({ type: 'string', length: 255 })
  refreshTokenHash!: string;

  @Property({ type: 'string', length: 100, nullable: true })
  deviceId?: string;

  @Property({ type: 'string', length: 120, nullable: true })
  deviceName?: string;

  @Property({ type: 'string', length: 45, nullable: true })
  ipAddress?: string;

  @Property({ type: 'string', length: 255, nullable: true })
  userAgent?: string;

  @Index()
  @Property({ type: 'Date' })
  expiresAt!: Date;

  @Property({ type: 'Date', nullable: true })
  revokedAt?: Date;

  @Property({ type: 'Date', onCreate: () => new Date() })
  createdAt = new Date();

  @Property({
    type: 'Date',
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
  })
  updatedAt = new Date();
}
