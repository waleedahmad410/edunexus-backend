import { Migration } from '@mikro-orm/migrations';

export class Migration20260511090600AcademicYears extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "academic_years" ("id" uuid not null, "school_id" uuid not null, "branch_id" uuid not null, "name" varchar(50) not null, "start_date" timestamptz not null, "end_date" timestamptz not null, "is_current" boolean not null default false, "status" varchar(30) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, constraint "academic_years_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create unique index "academic_years_school_id_branch_id_name_unique" on "academic_years" ("school_id", "branch_id", "name");`,
    );
    this.addSql(
      `create index "academic_years_school_id_index" on "academic_years" ("school_id");`,
    );
    this.addSql(
      `create index "academic_years_branch_id_index" on "academic_years" ("branch_id");`,
    );
    this.addSql(
      `create index "academic_years_name_index" on "academic_years" ("name");`,
    );
    this.addSql(
      `create index "academic_years_is_current_index" on "academic_years" ("is_current");`,
    );
    this.addSql(
      `create index "academic_years_status_index" on "academic_years" ("status");`,
    );
    this.addSql(
      `alter table "academic_years" add constraint "academic_years_school_id_foreign" foreign key ("school_id") references "schools" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "academic_years" add constraint "academic_years_branch_id_foreign" foreign key ("branch_id") references "branches" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "academic_years" cascade;`);
  }
}
