import { Migration } from '@mikro-orm/migrations';

export class Migration20260511092000RolePermissions extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "role_permissions" ("id" uuid not null, "role_id" uuid not null, "permission_id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, constraint "role_permissions_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create unique index "role_permissions_role_id_permission_id_unique" on "role_permissions" ("role_id", "permission_id");`,
    );
    this.addSql(
      `create index "role_permissions_role_id_index" on "role_permissions" ("role_id");`,
    );
    this.addSql(
      `create index "role_permissions_permission_id_index" on "role_permissions" ("permission_id");`,
    );
    this.addSql(
      `alter table "role_permissions" add constraint "role_permissions_role_id_foreign" foreign key ("role_id") references "roles" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "role_permissions" add constraint "role_permissions_permission_id_foreign" foreign key ("permission_id") references "permissions" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "role_permissions" cascade;`);
  }
}
