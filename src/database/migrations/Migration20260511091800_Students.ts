import { Migration } from '@mikro-orm/migrations';

export class Migration20260511091800Students extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "students" ("id" uuid not null, "school_id" uuid not null, "branch_id" uuid not null, "user_id" uuid not null, "admission_number" varchar(50) not null, "first_name" varchar(100) not null, "middle_name" varchar(100) null, "last_name" varchar(100) not null, "gender" varchar(20) not null, "date_of_birth" timestamptz not null, "photo_url" varchar(500) null, "blood_group" varchar(10) null, "medical_notes" text null, "address" text null, "admission_date" timestamptz not null, "status" varchar(30) not null, constraint "students_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create unique index "students_user_id_unique" on "students" ("user_id");`,
    );
    this.addSql(
      `create unique index "students_school_id_branch_id_admission_number_unique" on "students" ("school_id", "branch_id", "admission_number");`,
    );
    this.addSql(
      `create index "students_school_id_index" on "students" ("school_id");`,
    );
    this.addSql(
      `create index "students_branch_id_index" on "students" ("branch_id");`,
    );
    this.addSql(
      `create index "students_user_id_index" on "students" ("user_id");`,
    );
    this.addSql(
      `create index "students_admission_number_index" on "students" ("admission_number");`,
    );
    this.addSql(
      `create index "students_gender_index" on "students" ("gender");`,
    );
    this.addSql(
      `create index "students_status_index" on "students" ("status");`,
    );
    this.addSql(
      `alter table "students" add constraint "students_school_id_foreign" foreign key ("school_id") references "schools" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "students" add constraint "students_branch_id_foreign" foreign key ("branch_id") references "branches" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "students" add constraint "students_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "students" cascade;`);
  }
}
