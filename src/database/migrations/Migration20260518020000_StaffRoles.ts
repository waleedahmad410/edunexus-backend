import { Migration } from '@mikro-orm/migrations';

export class Migration20260518020000StaffRoles extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "staff_roles" ("id" uuid not null, "staff_id" uuid not null, "role_id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, constraint "staff_roles_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create unique index "staff_roles_staff_id_role_id_unique" on "staff_roles" ("staff_id", "role_id");`,
    );
    this.addSql(
      `create index "staff_roles_staff_id_index" on "staff_roles" ("staff_id");`,
    );
    this.addSql(
      `create index "staff_roles_role_id_index" on "staff_roles" ("role_id");`,
    );
    this.addSql(
      `alter table "staff_roles" add constraint "staff_roles_staff_id_foreign" foreign key ("staff_id") references "staff" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "staff_roles" add constraint "staff_roles_role_id_foreign" foreign key ("role_id") references "roles" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "staff_roles" cascade;`);
  }
}
