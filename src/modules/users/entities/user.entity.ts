import { OptionalProps } from '@mikro-orm/core';
import {
  Entity,
  Index,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/decorators/legacy';
import { v4 as uuid } from 'uuid';

@Entity({ tableName: 'users' })
@Unique({ properties: ['email'] })
export class User {
  [OptionalProps]?:
    | 'id'
    | 'phone'
    | 'lastLoginAt'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt';

  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Index()
  @Property({ type: 'string', length: 150 })
  email!: string;

  @Index()
  @Property({ type: 'string', length: 20, nullable: true })
  phone?: string;

  @Property({ type: 'string', length: 255 })
  passwordHash!: string;

  @Index()
  @Property({ type: 'string', length: 30 })
  status!: string;

  @Property({ type: 'Date', nullable: true })
  lastLoginAt?: Date;

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
