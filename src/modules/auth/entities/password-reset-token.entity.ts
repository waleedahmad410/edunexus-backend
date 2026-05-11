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

@Entity({ tableName: 'password_reset_tokens' })
export class PasswordResetToken {
  [OptionalProps]?: 'id' | 'ipAddress' | 'usedAt' | 'createdAt' | 'updatedAt';

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
  usedAt?: Date;

  @Property({ type: 'string', length: 100, nullable: true })
  ipAddress?: string;

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
}
