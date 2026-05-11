import { Migration } from '@mikro-orm/migrations';

export class Migration20260511091100UserRoleAssignments extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "user_role_assignments" ("id" uuid not null, "user_id" uuid not null, "role_id" uuid not null, "school_id" uuid null, "branch_id" uuid null, "status" varchar(30) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, constraint "user_role_assignments_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create unique index "user_role_assignments_user_id_role_id_school_id_branch_id_unique" on "user_role_assignments" ("user_id", "role_id", "school_id", "branch_id");`,
    );
    this.addSql(
      `create index "user_role_assignments_user_id_index" on "user_role_assignments" ("user_id");`,
    );
    this.addSql(
      `create index "user_role_assignments_role_id_index" on "user_role_assignments" ("role_id");`,
    );
    this.addSql(
      `create index "user_role_assignments_school_id_index" on "user_role_assignments" ("school_id");`,
    );
    this.addSql(
      `create index "user_role_assignments_branch_id_index" on "user_role_assignments" ("branch_id");`,
    );
    this.addSql(
      `create index "user_role_assignments_status_index" on "user_role_assignments" ("status");`,
    );
    this.addSql(
      `alter table "user_role_assignments" add constraint "user_role_assignments_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "user_role_assignments" add constraint "user_role_assignments_role_id_foreign" foreign key ("role_id") references "roles" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "user_role_assignments" add constraint "user_role_assignments_school_id_foreign" foreign key ("school_id") references "schools" ("id") on update cascade on delete set null;`,
    );
    this.addSql(
      `alter table "user_role_assignments" add constraint "user_role_assignments_branch_id_foreign" foreign key ("branch_id") references "branches" ("id") on update cascade on delete set null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "user_role_assignments" cascade;`);
  }
}
