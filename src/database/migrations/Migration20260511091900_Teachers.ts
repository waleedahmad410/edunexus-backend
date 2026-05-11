import { Migration } from '@mikro-orm/migrations';

export class Migration20260511091900Teachers extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "teachers" ("id" uuid not null, "staff_id" uuid not null, "qualification" varchar(150) null, "specialization" varchar(150) null, "teaching_experience_years" int null, "status" varchar(30) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, constraint "teachers_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create unique index "teachers_staff_id_unique" on "teachers" ("staff_id");`,
    );
    this.addSql(
      `create index "teachers_staff_id_index" on "teachers" ("staff_id");`,
    );
    this.addSql(
      `create index "teachers_status_index" on "teachers" ("status");`,
    );
    this.addSql(
      `alter table "teachers" add constraint "teachers_staff_id_foreign" foreign key ("staff_id") references "staff" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "teachers" cascade;`);
  }
}
