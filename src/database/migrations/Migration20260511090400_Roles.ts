import { Migration } from '@mikro-orm/migrations';

export class Migration20260511090400Roles extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create table "roles" ("id" uuid not null, "school_id" uuid null, "branch_id" uuid null, "name" varchar(100) not null, "code" varchar(100) not null, "description" text null, "is_system_role" boolean not null default false, "status" varchar(30) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, constraint "roles_pkey" primary key ("id"));`);
    this.addSql(`create unique index "roles_school_id_branch_id_code_unique" on "roles" ("school_id", "branch_id", "code");`);
    this.addSql(`create index "roles_school_id_index" on "roles" ("school_id");`);
    this.addSql(`create index "roles_branch_id_index" on "roles" ("branch_id");`);
    this.addSql(`create index "roles_name_index" on "roles" ("name");`);
    this.addSql(`create index "roles_code_index" on "roles" ("code");`);
    this.addSql(`create index "roles_status_index" on "roles" ("status");`);
    this.addSql(`alter table "roles" add constraint "roles_school_id_foreign" foreign key ("school_id") references "schools" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "roles" add constraint "roles_branch_id_foreign" foreign key ("branch_id") references "branches" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "roles" cascade;`);
  }
}
