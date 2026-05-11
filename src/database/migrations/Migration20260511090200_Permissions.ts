import { Migration } from '@mikro-orm/migrations';

export class Migration20260511090200Permissions extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create table "permissions" ("id" uuid not null, "module" varchar(100) not null, "action" varchar(50) not null, "code" varchar(150) not null, "description" text null, "status" varchar(30) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, constraint "permissions_pkey" primary key ("id"));`);
    this.addSql(`create unique index "permissions_code_unique" on "permissions" ("code");`);
    this.addSql(`create index "permissions_module_index" on "permissions" ("module");`);
    this.addSql(`create index "permissions_action_index" on "permissions" ("action");`);
    this.addSql(`create index "permissions_code_index" on "permissions" ("code");`);
    this.addSql(`create index "permissions_status_index" on "permissions" ("status");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "permissions" cascade;`);
  }
}
