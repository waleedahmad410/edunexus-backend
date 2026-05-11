import { Migration } from '@mikro-orm/migrations';

export class Migration20260511092100StudentGuardians extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "student_guardians" ("id" uuid not null, "student_id" uuid not null, "guardian_id" uuid not null, "relationship" varchar(50) not null, "is_primary" boolean not null default false, "can_pickup" boolean not null default false, "receives_sms" boolean not null default true, "status" varchar(30) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, constraint "student_guardians_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create unique index "student_guardians_student_id_guardian_id_unique" on "student_guardians" ("student_id", "guardian_id");`,
    );
    this.addSql(
      `create index "student_guardians_student_id_index" on "student_guardians" ("student_id");`,
    );
    this.addSql(
      `create index "student_guardians_guardian_id_index" on "student_guardians" ("guardian_id");`,
    );
    this.addSql(
      `create index "student_guardians_relationship_index" on "student_guardians" ("relationship");`,
    );
    this.addSql(
      `create index "student_guardians_status_index" on "student_guardians" ("status");`,
    );
    this.addSql(
      `alter table "student_guardians" add constraint "student_guardians_student_id_foreign" foreign key ("student_id") references "students" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "student_guardians" add constraint "student_guardians_guardian_id_foreign" foreign key ("guardian_id") references "guardians" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "student_guardians" cascade;`);
  }
}
