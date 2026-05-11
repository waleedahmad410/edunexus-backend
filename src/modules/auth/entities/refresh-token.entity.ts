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

@Entity({ tableName: 'refresh_tokens' })
@Unique({ properties: ['tokenHash'] })
export class RefreshToken {
  [OptionalProps]?:
    | 'id'
    | 'revokedAt'
    | 'ipAddress'
    | 'userAgent'
    | 'createdAt'
    | 'updatedAt';

  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Index()
  @ManyToOne(() => User, { fieldName: 'user_id' })
  user!: Rel<User>;

  @Property({ type: 'string', length: 255 })
  tokenHash!: string;

  @Index()
  @Property({ type: 'Date' })
  expiresAt!: Date;

  @Index()
  @Property({ type: 'Date', nullable: true })
  revokedAt?: Date;

  @Property({ type: 'string', length: 100, nullable: true })
  ipAddress?: string;

  @Property({ type: 'text', nullable: true })
  userAgent?: string;

  @Property({ type: 'Date', onCreate: () => new Date() })
  createdAt = new Date();

  @Property({
    type: 'Date',
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
  })
  updatedAt = new Date();
}
