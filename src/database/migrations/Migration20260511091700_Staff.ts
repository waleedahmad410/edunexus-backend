import { Migration } from '@mikro-orm/migrations';

export class Migration20260511091700Staff extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "staff" ("id" uuid not null, "school_id" uuid not null, "branch_id" uuid not null, "user_id" uuid not null, "employee_number" varchar(50) not null, "first_name" varchar(100) not null, "middle_name" varchar(100) null, "last_name" varchar(100) not null, "gender" varchar(20) not null, "date_of_birth" timestamptz null, "phone" varchar(20) not null, constraint "staff_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create unique index "staff_user_id_unique" on "staff" ("user_id");`,
    );
    this.addSql(
      `create unique index "staff_school_id_branch_id_employee_number_unique" on "staff" ("school_id", "branch_id", "employee_number");`,
    );
    this.addSql(
      `create index "staff_school_id_index" on "staff" ("school_id");`,
    );
    this.addSql(
      `create index "staff_branch_id_index" on "staff" ("branch_id");`,
    );
    this.addSql(`create index "staff_user_id_index" on "staff" ("user_id");`);
    this.addSql(
      `create index "staff_employee_number_index" on "staff" ("employee_number");`,
    );
    this.addSql(`create index "staff_gender_index" on "staff" ("gender");`);
    this.addSql(`create index "staff_phone_index" on "staff" ("phone");`);
    this.addSql(
      `alter table "staff" add constraint "staff_school_id_foreign" foreign key ("school_id") references "schools" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "staff" add constraint "staff_branch_id_foreign" foreign key ("branch_id") references "branches" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "staff" add constraint "staff_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "staff" cascade;`);
  }
}
