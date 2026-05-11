import { OptionalProps } from '@mikro-orm/core';
import {
  Entity,
  Index,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/decorators/legacy';
import { v4 as uuid } from 'uuid';

@Entity({ tableName: 'permissions' })
@Unique({ properties: ['code'] })
export class Permission {
  [OptionalProps]?:
    | 'id'
    | 'description'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt';

  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Index()
  @Property({ type: 'string', length: 100 })
  module!: string;

  @Index()
  @Property({ type: 'string', length: 50 })
  action!: string;

  @Index()
  @Property({ type: 'string', length: 150 })
  code!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

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
