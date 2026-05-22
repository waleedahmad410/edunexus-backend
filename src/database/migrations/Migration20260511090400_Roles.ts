import { Migration } from '@mikro-orm/migrations';

export class Migration20260511090400Roles extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      create table "roles" (
        "id" uuid not null,
        "school_id" uuid null,
        "branch_id" uuid null,
        "name" varchar(100) not null,
        "code" varchar(100) not null,
        "description" text null,
        "is_system_role" boolean not null default false,
        "is_template" boolean not null default false,
        "is_default_role" boolean not null default false,
        "status" varchar(30) not null default 'ACTIVE',
        "created_at" timestamptz not null,
        "updated_at" timestamptz not null,
        "deleted_at" timestamptz null,
        constraint "roles_pkey" primary key ("id")
      );
    `);

    this.addSql(`
      create index "roles_school_id_index"
      on "roles" ("school_id");
    `);

    this.addSql(`
      create index "roles_branch_id_index"
      on "roles" ("branch_id");
    `);

    this.addSql(`
      create index "roles_name_index"
      on "roles" ("name");
    `);

    this.addSql(`
      create index "roles_code_index"
      on "roles" ("code");
    `);

    this.addSql(`
      create index "roles_status_index"
      on "roles" ("status");
    `);

    this.addSql(`
      create index "roles_is_system_role_index"
      on "roles" ("is_system_role");
    `);

    this.addSql(`
      create index "roles_is_template_index"
      on "roles" ("is_template");
    `);

    this.addSql(`
      create index "roles_is_default_role_index"
      on "roles" ("is_default_role");
    `);

    /**
     * Global roles/templates:
     * SUPER_ADMIN, SCHOOL_OWNER template, etc.
     */
    this.addSql(`
      create unique index "roles_global_code_unique"
      on "roles" ("code")
      where "school_id" is null
        and "branch_id" is null
        and "deleted_at" is null;
    `);

    /**
     * School-level roles:
     * School A Teacher, School A Accountant, School A Owner, etc.
     */
    this.addSql(`
      create unique index "roles_school_code_unique"
      on "roles" ("school_id", "code")
      where "school_id" is not null
        and "branch_id" is null
        and "deleted_at" is null;
    `);

    /**
     * Branch-level roles:
     * Branch A Teacher, Branch B Teacher, etc.
     */
    this.addSql(`
      create unique index "roles_branch_code_unique"
      on "roles" ("school_id", "branch_id", "code")
      where "school_id" is not null
        and "branch_id" is not null
        and "deleted_at" is null;
    `);

    this.addSql(`
      alter table "roles"
      add constraint "roles_school_id_foreign"
      foreign key ("school_id")
      references "schools" ("id")
      on update cascade
      on delete set null;
    `);

    this.addSql(`
      alter table "roles"
      add constraint "roles_branch_id_foreign"
      foreign key ("branch_id")
      references "branches" ("id")
      on update cascade
      on delete set null;
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "roles" cascade;`);
  }
}
