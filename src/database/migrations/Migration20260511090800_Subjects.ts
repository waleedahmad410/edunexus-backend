import { Migration } from '@mikro-orm/migrations';

export class Migration20260511090800Subjects extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "subjects" ("id" uuid not null, "school_id" uuid not null, "branch_id" uuid not null, "name" varchar(100) not null, "code" varchar(50) not null, "subject_type" varchar(50) not null, "description" text null, "status" varchar(30) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, constraint "subjects_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create unique index "subjects_school_id_branch_id_code_unique" on "subjects" ("school_id", "branch_id", "code");`,
    );
    this.addSql(
      `create index "subjects_school_id_index" on "subjects" ("school_id");`,
    );
    this.addSql(
      `create index "subjects_branch_id_index" on "subjects" ("branch_id");`,
    );
    this.addSql(`create index "subjects_name_index" on "subjects" ("name");`);
    this.addSql(`create index "subjects_code_index" on "subjects" ("code");`);
    this.addSql(
      `create index "subjects_subject_type_index" on "subjects" ("subject_type");`,
    );
    this.addSql(
      `create index "subjects_status_index" on "subjects" ("status");`,
    );
    this.addSql(
      `alter table "subjects" add constraint "subjects_school_id_foreign" foreign key ("school_id") references "schools" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "subjects" add constraint "subjects_branch_id_foreign" foreign key ("branch_id") references "branches" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "subjects" cascade;`);
  }
}
