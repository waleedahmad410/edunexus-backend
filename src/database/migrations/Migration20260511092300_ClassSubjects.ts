import { Migration } from '@mikro-orm/migrations';

export class Migration20260511092300ClassSubjects extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "class_subjects" ("id" uuid not null, "school_id" uuid not null, "branch_id" uuid not null, "academic_year_id" uuid not null, "class_id" uuid not null, "subject_id" uuid not null, "is_compulsory" boolean not null default true, "sort_order" int not null default 0, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "class_subjects_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create index "class_subjects_school_id_index" on "class_subjects" ("school_id");`,
    );
    this.addSql(
      `create index "class_subjects_branch_id_index" on "class_subjects" ("branch_id");`,
    );
    this.addSql(
      `create index "class_subjects_academic_year_id_index" on "class_subjects" ("academic_year_id");`,
    );
    this.addSql(
      `create index "class_subjects_class_id_index" on "class_subjects" ("class_id");`,
    );
    this.addSql(
      `create index "class_subjects_subject_id_index" on "class_subjects" ("subject_id");`,
    );
    this.addSql(
      `alter table "class_subjects" add constraint "class_subjects_school_id_foreign" foreign key ("school_id") references "schools" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "class_subjects" add constraint "class_subjects_branch_id_foreign" foreign key ("branch_id") references "branches" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "class_subjects" add constraint "class_subjects_academic_year_id_foreign" foreign key ("academic_year_id") references "academic_years" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "class_subjects" add constraint "class_subjects_class_id_foreign" foreign key ("class_id") references "classes" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "class_subjects" add constraint "class_subjects_subject_id_foreign" foreign key ("subject_id") references "subjects" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "class_subjects" cascade;`);
  }
}
